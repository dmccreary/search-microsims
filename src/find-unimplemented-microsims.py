#!/usr/bin/env python3
"""
Find Unimplemented MicroSims

Scans textbook repos for MicroSims that are specified in a chapter but not yet
implemented.  A MicroSim is "specified" when a chapter under docs/chapters has a
<details> block describing it, and "unimplemented" when docs/sims/<sim-id>/ has
no JavaScript behind it.

The completion_status field in metadata.json is NOT trusted -- many sims are
still flagged "scaffold" long after their .js file was written.  Instead each
sim directory is inspected directly:

    impl        a local .js file (>= 1500 bytes), an inline <script>, or a
                shared library that exists on disk
    missing     no docs/sims/<sim-id>/ directory at all
    stub        main.html is a "coming soon" placeholder
    broken_src  main.html loads a local .js file that does not exist
    no_html     directory exists but holds no main.html and no .js

Usage:
    python3 src/find-unimplemented-microsims.py                 # scan ~/projects
    python3 src/find-unimplemented-microsims.py -w ~/projects -w /tmp/inv
    python3 src/find-unimplemented-microsims.py --repo calculus # one repo
    python3 src/find-unimplemented-microsims.py --update-todo   # rewrite TODO.md section
    python3 src/find-unimplemented-microsims.py --json out.json

When a repo appears in more than one workspace the first workspace wins, so
list the directory holding your working clones first.
"""

import argparse
import collections
import datetime
import difflib
import glob
import json
import os
import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_WORKSPACE = Path.home() / "projects"
TODO_FILE = PROJECT_ROOT / "TODO.md"
START_MARK = "<!-- unimplemented-microsims:start -->"
END_MARK = "<!-- unimplemented-microsims:end -->"

MIN_JS_BYTES = 1500      # smaller .js files are treated as empty scaffolds
MIN_INLINE_CHARS = 400   # inline <script> smaller than this is not an implementation

PLACEHOLDER = re.compile(
    r"coming soon|placeholder|not yet implemented|under construction|to be implemented|scaffold", re.I)
CDN = re.compile(r"^(https?:)?//")
HEADING = re.compile(
    r"^#{2,6}\s+(?:(Diagram|MicroSim|Drawing|Chart|Infographic|Timeline|Workflow|Graph|Map|Figure"
    r"|Interactive|Simulation)[^:]*:\s*)?(.+?)\s*$", re.I)
# sim paths may be nested, e.g. sims/shared/idea-funnel/main.html from a submodule
IFRAME = re.compile(r"sims/((?:[A-Za-z0-9_.\-]+/)*[A-Za-z0-9_.\-]+)/(?:main|index)\.html"
                    r"|sims/([A-Za-z0-9_.\-]+)/[\"')]")
SIM_ID = re.compile(r"sim-id[:*\s]*\**\s*`?([A-Za-z0-9_\-]+)", re.I)
SPEC_HINT = re.compile(
    r"sim-id|^\s*\**Type\**:|Learning objective|Bloom|Canvas|Purpose:|Implementation:|Layout:"
    r"|Visual (style|elements)|Interactiv", re.I | re.M)
SPEC_SUMMARY = ("diagram", "microsim", "drawing", "chart", "infographic", "timeline")
NAME_SUFFIX = re.compile(
    r"-(microsim|interactive|infographic|chart|diagram|visualization|visualizer|explorer|simulator"
    r"|simulation|demo|tool|workflow|animation|map|comparison|model)$")


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def core_name(name):
    """Strip generic suffixes (-microsim, -explorer, ...) to compare sim names."""
    previous = None
    while previous != name:
        previous, name = name, NAME_SUFFIX.sub("", name)
    return name


def sim_status(sim_dir):
    """Return (state, detail) for a docs/sims/<sim-id> directory."""
    if not os.path.isdir(sim_dir):
        return "missing", ""
    files = os.listdir(sim_dir)
    for f in files:
        if f.endswith(".js") and os.path.getsize(os.path.join(sim_dir, f)) >= MIN_JS_BYTES:
            return "impl", "js"
    htmls = [f for f in files if f.endswith(".html")]
    if not htmls:
        return "no_html", ",".join(sorted(files))[:80]
    best = ("stub", "")
    for h in htmls:
        try:
            txt = open(os.path.join(sim_dir, h), errors="ignore").read()
        except OSError:
            continue
        inline = sum(len(m) for m in re.findall(
            r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", txt, re.S | re.I))
        srcs = re.findall(r"<script[^>]*\bsrc=[\"']([^\"']+)[\"']", txt, re.I)
        local = [s for s in srcs if not CDN.match(s)]
        local_ok = [s for s in local
                    if os.path.exists(os.path.normpath(os.path.join(sim_dir, s.split("?")[0])))]
        if inline >= MIN_INLINE_CHARS:
            return "impl", "inline"
        if local_ok:
            return "impl", "shared:" + local_ok[0]
        if 'class="mermaid"' in txt or ("<svg" in txt.lower() and len(txt) > 3000):
            return "impl", "static"
        if "<iframe" in txt.lower() or 'http-equiv="refresh"' in txt.lower():
            best = ("redirect", "")
        elif local:
            best = ("broken_src", local[0])
        elif PLACEHOLDER.search(txt):
            best = ("stub", "placeholder")
        else:
            best = ("stub", f"html={len(txt)}")
    return best


def is_sim_spec(spec):
    """Filter out <details> blocks that are not MicroSim specs (tables, answers)."""
    if spec["type"].lower().startswith("markdown-table"):
        return False
    if spec["kind"] or spec["sim_id"] or spec["type"]:
        return True
    return spec["summary"].lstrip("#* ").lower().startswith(SPEC_SUMMARY)


def scan_repo(root):
    """Return a list of spec dicts for every <details> spec in the repo's chapters."""
    root = str(root)
    repo = os.path.basename(root.rstrip("/"))
    chapters_dir = os.path.join(root, "docs", "chapters")
    sims_dir = os.path.join(root, "docs", "sims")
    if not os.path.isdir(chapters_dir):
        return []
    sim_dirs = sorted(d for d in os.listdir(sims_dir)
                      if os.path.isdir(os.path.join(sims_dir, d))) if os.path.isdir(sims_dir) else []
    sim_set = set(sim_dirs)
    specs = []
    for path in sorted(glob.glob(chapters_dir + "/**/*.md", recursive=True)):
        lines = open(path, errors="ignore").read().split("\n")
        i = 0
        while i < len(lines):
            if "<details" not in lines[i]:
                i += 1
                continue
            start = i
            j = i
            while j < len(lines) and "</details>" not in lines[j]:
                j += 1
            block = "\n".join(lines[i:j + 1])
            before = lines[max(0, i - 10):i]
            # an iframe may follow the spec; look ahead, but not past the next heading
            after = []
            for line in lines[j + 1:j + 11]:
                if line.startswith("#"):
                    break
                after.append(line)
            i = j + 1

            m = re.search(r"<summary>(.*?)</summary>", block, re.S)
            summary = m.group(1).strip() if m else ""
            heading = kind = None
            for line in reversed(before):
                m = HEADING.match(line)
                if m:
                    kind, heading = m.group(1), m.group(2)
                    break
            if not SPEC_HINT.search(block) and not kind:
                continue
            m = SIM_ID.search(block)
            sim_id = m.group(1) if m else None
            if re.search(r"answer|solution|hint", summary, re.I) and not kind and not sim_id:
                continue
            iframe = None
            for line in before + [block] + after:
                m = IFRAME.search(line)
                if m:
                    iframe = m.group(1) or m.group(2)
                    break
            m = re.search(r"^\s*\**Type\**:\**\s*(.+)$", block, re.M | re.I)
            spec_type = m.group(1).strip()[:40] if m else ""

            candidates = [c for c in (sim_id, iframe, slug(heading) if heading else None,
                                      slug(summary) if summary else None) if c]
            name = next((c for c in candidates if c in sim_set), None)
            if name is None:
                name = sim_id or iframe or slug(heading or summary)
            state, detail = sim_status(os.path.join(sims_dir, name))
            spec = dict(repo=repo, chapter=os.path.relpath(path, root), line=start + 1,
                        name=name, sim_id=sim_id, iframe=iframe, heading=heading, kind=kind,
                        summary=re.sub(r"\s+", " ", summary)[:100], type=spec_type,
                        state=state, detail=detail)
            if state == "missing":
                close = difflib.get_close_matches(name, sim_dirs, n=1, cutoff=0.72)
                core = core_name(name)
                contains = [d for d in sim_dirs if len(core) > 6 and len(core_name(d)) > 6
                            and (core in d or core_name(d) in name)]
                if close or contains:
                    spec["possible_match"] = (close or contains)[0]
            if is_sim_spec(spec):
                specs.append(spec)
    return specs


def find_repos(workspaces, only=None):
    """Map repo name -> root path; the first workspace containing a repo wins."""
    repos = {}
    for ws in workspaces:
        ws = Path(ws).expanduser()
        if not ws.is_dir():
            continue
        for item in sorted(ws.iterdir()):
            if item.name in repos or (only and item.name not in only):
                continue
            if (item / "docs" / "chapters").is_dir():
                repos[item.name] = item
    return repos


def previously_listed():
    """Read (repo, sim) pairs already tracked in TODO.md so finished ones stay listed as done."""
    items = collections.OrderedDict()
    if not TODO_FILE.exists():
        return items
    text = TODO_FILE.read_text()
    if START_MARK not in text or END_MARK not in text:
        return items
    section = text.split(START_MARK, 1)[1].split(END_MARK, 1)[0]
    repo = None
    for line in section.split("\n"):
        m = re.match(r"^### ([A-Za-z0-9_.\-]+)", line)
        if m:
            repo = m.group(1)
            continue
        m = re.match(r"^- \[([ x])\] `([^`]+)`(.*)$", line)
        if m and repo:
            items[(repo, m.group(2))] = (m.group(1) == "x", m.group(3))
    return items


def render_todo(specs, repos):
    """Build the TODO.md section.  Items listed earlier but now implemented are checked off."""
    open_items = collections.OrderedDict()
    for s in specs:
        if s["state"] == "impl":
            continue
        title = s["heading"] or s["summary"] or s["name"]
        tail = f" — {title} *({s['type'] or 'spec'}; {s['state']})* — `{s['chapter']}`"
        if s.get("possible_match"):
            tail += f" — **verify:** may already exist as `{s['possible_match']}`"
        open_items.setdefault((s["repo"], s["name"]), tail)

    done_items = collections.OrderedDict()
    for key, (was_done, tail) in previously_listed().items():
        if key in open_items:
            continue
        # A rescanned repo that no longer reports the sim has implemented it;
        # repos outside this scan keep whatever state they had.
        if key[0] in repos or was_done:
            done_items[key] = tail
        else:
            open_items[key] = tail

    by_repo = collections.defaultdict(lambda: {"open": [], "done": []})
    for (repo, name), tail in open_items.items():
        by_repo[repo]["open"].append((name, tail))
    for (repo, name), tail in done_items.items():
        by_repo[repo]["done"].append((name, tail))

    total_open = sum(len(v["open"]) for v in by_repo.values())
    total_done = sum(len(v["done"]) for v in by_repo.values())
    out = [START_MARK,
           f"## Unimplemented MicroSims ({datetime.date.today().isoformat()})",
           "",
           "MicroSims that have a `<details>` specification in a chapter under `docs/chapters` but no "
           "JavaScript in `docs/sims/<sim-id>/`. Generated by `src/find-unimplemented-microsims.py "
           "--update-todo`; do not edit by hand. Each open item is built with the `/microsim-generator` "
           "skill in a clone of its repo under `~/projects`.",
           "",
           f"**{total_open} open, {total_done} done.**",
           "",
           "| Repo | Open | Done | Cloned in ~/projects |",
           "|------|-----:|-----:|:-------------------:|"]
    for repo in sorted(by_repo, key=str.lower):
        v = by_repo[repo]
        cloned = "yes" if (DEFAULT_WORKSPACE / repo / ".git").exists() else "no"
        out.append(f"| [{repo}](#{repo.lower()}) | {len(v['open'])} | {len(v['done'])} | {cloned} |")
    for repo in sorted(by_repo, key=str.lower):
        v = by_repo[repo]
        out += ["", f"### {repo}", ""]
        out += [f"- [ ] `{name}`{tail}" for name, tail in v["open"]]
        out += [f"- [x] `{name}`{tail}" for name, tail in v["done"]]
    out.append(END_MARK)
    return "\n".join(out), total_open, total_done


def update_todo(section):
    text = TODO_FILE.read_text() if TODO_FILE.exists() else "# TODO\n"
    if START_MARK in text and END_MARK in text:
        head, rest = text.split(START_MARK, 1)
        tail = rest.split(END_MARK, 1)[1]
        text = head + section + tail
    else:
        text = text.rstrip("\n") + "\n\n" + section + "\n"
    TODO_FILE.write_text(text)


def main():
    parser = argparse.ArgumentParser(description="Find MicroSims that are specified but not implemented")
    parser.add_argument("-w", "--workspace", action="append", type=Path,
                        help=f"Directory containing repos (repeatable, default: {DEFAULT_WORKSPACE})")
    parser.add_argument("--repo", action="append", help="Only scan this repo (repeatable)")
    parser.add_argument("--json", type=Path, help="Write every spec found (all states) to this JSON file")
    parser.add_argument("--update-todo", action="store_true",
                        help="Rewrite the unimplemented-microsims section of TODO.md")
    args = parser.parse_args()

    repos = find_repos(args.workspace or [DEFAULT_WORKSPACE], set(args.repo) if args.repo else None)
    if not repos:
        print("No repos with docs/chapters found.", file=sys.stderr)
        return 1

    specs = []
    for name, root in repos.items():
        specs += scan_repo(root)

    print(f"{'Repo':36s} {'Specs':>6s} {'Open':>6s}  States")
    by_repo = collections.defaultdict(collections.Counter)
    for s in specs:
        by_repo[s["repo"]][s["state"]] += 1
    for repo in sorted(by_repo, key=str.lower):
        states = by_repo[repo]
        open_count = sum(n for state, n in states.items() if state != "impl")
        print(f"{repo:36s} {sum(states.values()):6d} {open_count:6d}  {dict(states)}")
    total_open = sum(1 for s in specs if s["state"] != "impl")
    print(f"\n{len(specs)} specs in {len(by_repo)} repos, {total_open} unimplemented")

    if args.json:
        args.json.write_text(json.dumps(specs, indent=1))
        print(f"Wrote {args.json}")
    if args.update_todo:
        section, n_open, n_done = render_todo(specs, repos)
        update_todo(section)
        print(f"Updated {TODO_FILE}: {n_open} open, {n_done} done")
    return 0


if __name__ == "__main__":
    sys.exit(main())
