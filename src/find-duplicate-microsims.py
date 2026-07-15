#!/usr/bin/env python3
"""
Find Duplicate MicroSims by WHAT similarity.

Reads the dual-v1 embeddings file and the catalog metadata, computes pairwise
cosine similarity on the WHAT vector (what each MicroSim teaches), clusters
MicroSims whose WHAT similarity exceeds a threshold, and writes a merge-report
recommending which sim in each cluster to keep as the single high-quality
version and which to retire/redirect.

WHAT similarity is the right signal for de-duplication: two MicroSims that
teach the same concept are candidates to merge even if one uses p5.js and the
other Mermaid. Implementation (HOW) differences do not make them distinct
learning objects.

Usage:
    source .venv-embeddings/bin/activate
    python src/find-duplicate-microsims.py                 # default threshold 0.90
    python src/find-duplicate-microsims.py --threshold 0.88
    python src/find-duplicate-microsims.py --cross-repo-only

Output:
    docs/reports/duplicate-microsims.md    (human-readable merge report)
    docs/reports/duplicate-microsims.json  (full cluster data)
"""

import argparse
import json
import os
import tempfile
from pathlib import Path
from datetime import datetime, timezone

import numpy as np

PROJECT_ROOT = Path(__file__).parent.parent
EMBEDDINGS_PATH = PROJECT_ROOT / "data" / "microsims-embeddings.json"
CATALOG_PATH = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"
REPORT_MD = PROJECT_ROOT / "docs" / "reports" / "duplicate-microsims.md"
REPORT_JSON = PROJECT_ROOT / "docs" / "reports" / "duplicate-microsims.json"

# WHAT-similarity tiers for reporting (applied to the cluster's min internal edge)
TIER_NEAR_IDENTICAL = 0.95   # almost certainly the same MicroSim copied
TIER_STRONG = 0.90           # same concept, very likely mergeable
TIER_MODERATE = 0.85         # related; review before merging

# Scaffold/placeholder sims that are copied into every book by design. They are
# not learning objects, so consolidating them is meaningless — exclude unless
# --include-templates is passed.
PLACEHOLDER_TITLE_MARKERS = (
    "a title under",          # literal scaffold placeholder text
    "template",               # "MicroSim Template", "... index.md Template"
    "lorem ipsum",
)
PLACEHOLDER_SIM_IDS = ("template", "sample-arch", "sim-template")


def is_placeholder(sim):
    """True if this record is a scaffold/template rather than a real MicroSim."""
    title = (sim.get("title") or "").strip().lower()
    sim_id = (sim.get("_source", {}).get("sim") or "").strip().lower()
    if any(m in title for m in PLACEHOLDER_TITLE_MARKERS):
        return True
    if sim_id in PLACEHOLDER_SIM_IDS or sim_id.startswith("template-"):
        return True
    return False


def atomic_write(path: Path, text: str):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(text)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def get_what_vector(entry):
    """Extract the WHAT vector (dual-v1) or the flat legacy vector."""
    if isinstance(entry, dict):
        return entry["what"]
    return entry


def load_data(include_templates=False):
    """Load embeddings + catalog, keeping only sims with meaningful WHAT text.

    Records with no title carry almost no WHAT signal, so their embeddings are
    nearly identical to each other and would form one large spurious
    "near-identical" cluster. Scaffold/template sims are copied into every book
    by design and are not learning objects. Both are excluded and counted.
    """
    with open(EMBEDDINGS_PATH) as f:
        emb = json.load(f)
    with open(CATALOG_PATH) as f:
        catalog = json.load(f)

    by_url = {}
    for sim in catalog:
        url = sim.get("url") or sim.get("identifier")
        if url:
            by_url[url] = sim

    all_urls = list(emb["embeddings"].keys())
    urls, skipped_untitled, skipped_template = [], 0, 0
    for u in all_urls:
        sim = by_url.get(u, {})
        if not (sim.get("title") or "").strip():
            skipped_untitled += 1
            continue
        if not include_templates and is_placeholder(sim):
            skipped_template += 1
            continue
        urls.append(u)

    matrix = np.array([get_what_vector(emb["embeddings"][u]) for u in urls], dtype=np.float32)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    matrix = matrix / norms
    return urls, matrix, by_url, skipped_untitled, skipped_template


def quality_score(sim):
    """Heuristic quality score to pick the 'keeper' in a cluster.

    Rewards a real (non-iframe) description, concrete learning objectives,
    a known framework, a pedagogical block, and membership in the canonical
    `microsims` reference library. Higher is better.
    """
    score = 0.0
    desc = sim.get("description", "") or ""
    if desc and "<iframe" not in desc.lower():
        score += min(len(desc), 400) / 100.0  # up to +4 for a substantive description

    objectives = sim.get("learningObjectives", []) or []
    # Penalize boilerplate objectives ("Understand the key concepts of X")
    boiler = sum(1 for o in objectives if isinstance(o, str) and (
        o.lower().startswith(("understand the key concepts",
                              "explore ", "apply knowledge of",
                              "test understanding of"))))
    score += max(0, len(objectives) - boiler) * 0.5

    if sim.get("framework") and sim.get("framework") != "unknown":
        score += 1.0
    if sim.get("pedagogical"):
        score += 1.0

    repo = sim.get("_source", {}).get("repo", "")
    if repo == "microsims":       # canonical reference library
        score += 2.0

    viz = sim.get("visualizationType") or []
    if viz:
        score += 0.5
    return round(score, 3)


def cluster(urls, matrix, threshold):
    """Union-find clustering over the WHAT-similarity graph at *threshold*."""
    n = len(urls)
    parent = list(range(n))

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    # Block the matmul to keep memory bounded for large catalogs.
    block = 512
    edges = {}  # (i,j) -> sim, only for i<j above threshold
    for start in range(0, n, block):
        end = min(start + block, n)
        sims = matrix[start:end] @ matrix.T  # (block, n)
        for bi in range(end - start):
            i = start + bi
            row = sims[bi]
            js = np.where(row >= threshold)[0]
            for j in js:
                if j <= i:
                    continue
                union(i, j)
                edges[(i, int(j))] = float(row[j])

    groups = {}
    for i in range(n):
        groups.setdefault(find(i), []).append(i)
    return [g for g in groups.values() if len(g) >= 2], edges


def build_report(threshold, cross_repo_only, include_templates=False):
    urls, matrix, by_url, skipped_untitled, skipped_template = load_data(include_templates)
    clusters, edges = cluster(urls, matrix, threshold)

    records = []
    for members in clusters:
        murls = [urls[i] for i in members]
        repos = {by_url.get(u, {}).get("_source", {}).get("repo", "?") for u in murls}
        cross_repo = len(repos) > 1
        if cross_repo_only and not cross_repo:
            continue

        # Internal edge stats for tiering
        internal = [edges[(min(a, b), max(a, b))]
                    for idx, a in enumerate(members) for b in members[idx + 1:]
                    if (min(a, b), max(a, b)) in edges]
        min_sim = min(internal) if internal else threshold
        avg_sim = sum(internal) / len(internal) if internal else threshold

        entries = []
        for u in murls:
            sim = by_url.get(u, {})
            src = sim.get("_source", {})
            entries.append({
                "url": u,
                "repo": src.get("repo", "?"),
                "sim": src.get("sim", "?"),
                "title": sim.get("title", "?"),
                "framework": sim.get("framework", "?"),
                "quality": quality_score(sim),
                "num_objectives": len(sim.get("learningObjectives", []) or []),
                "has_real_desc": bool(sim.get("description") and "<iframe" not in (sim.get("description") or "").lower()),
            })
        # Deterministic keeper choice: quality, then richer metadata, then a
        # stable alphabetical tiebreak so reruns pick the same keeper.
        entries.sort(key=lambda e: (-e["quality"], -e["num_objectives"],
                                    not e["has_real_desc"], e["repo"], e["sim"]))

        if min_sim >= TIER_NEAR_IDENTICAL:
            tier = "near-identical"
        elif min_sim >= TIER_STRONG:
            tier = "strong"
        else:
            tier = "moderate"

        records.append({
            "size": len(entries),
            "cross_repo": cross_repo,
            "repos": sorted(repos),
            "min_similarity": round(min_sim, 4),
            "avg_similarity": round(avg_sim, 4),
            "tier": tier,
            "keeper": entries[0],
            "merge": entries[1:],
            "members": entries,
        })

    # Sort: cross-repo first, then larger, then tighter
    records.sort(key=lambda r: (r["cross_repo"], r["size"], r["avg_similarity"]), reverse=True)
    return records, len(urls), skipped_untitled, skipped_template


def render_md(records, total, threshold, cross_repo_only, skipped_untitled=0, skipped_template=0):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    dup_sims = sum(r["size"] for r in records)
    mergeable = sum(r["size"] - 1 for r in records)
    cross = [r for r in records if r["cross_repo"]]

    L = []
    L.append("# Duplicate MicroSims — Merge Recommendations\n")
    L.append(f"**Generated:** {now} | **WHAT-similarity threshold:** {threshold} | "
             f"**Catalog size:** {total} MicroSims analyzed "
             f"({skipped_untitled} untitled and {skipped_template} scaffold/template "
             f"records excluded — they carry no learning content)\n")
    L.append("MicroSims are grouped by **WHAT** (what they teach) — the learning "
             "objective and concept — regardless of which JavaScript library they "
             "use. Each cluster below is a set of MicroSims that teach essentially "
             "the same thing and are candidates to consolidate into one "
             "high-quality version.\n")
    L.append("## Summary\n")
    L.append(f"- **{len(records)}** duplicate clusters covering **{dup_sims}** MicroSims")
    L.append(f"- **{mergeable}** MicroSims could be retired by merging (keep 1 per cluster)")
    L.append(f"- **{len(cross)}** clusters span **multiple repositories** "
             "(the cross-book duplication that inflates maintenance)\n")
    L.append("The **Keeper** is the highest-quality member (real description, "
             "concrete learning objectives, known framework, pedagogical metadata, "
             "canonical `microsims` repo). Retire or iframe-redirect the rest.\n")
    L.append("| Tier | Meaning |")
    L.append("|------|---------|")
    L.append("| near-identical | min WHAT sim ≥ 0.95 — almost certainly the same sim copied |")
    L.append("| strong | ≥ 0.90 — same concept, very likely mergeable |")
    L.append("| moderate | ≥ threshold — related, review before merging |\n")
    L.append("---\n")

    for n, r in enumerate(records, 1):
        scope = f"cross-repo ({len(r['repos'])} repos)" if r["cross_repo"] else "same-repo"
        L.append(f"## {n}. {r['keeper']['title']} — {r['size']} copies "
                 f"({r['tier']}, {scope})\n")
        L.append(f"WHAT similarity: avg {r['avg_similarity']}, min {r['min_similarity']}. "
                 f"Repos: {', '.join(r['repos'])}\n")
        k = r["keeper"]
        L.append(f"**✅ Keep:** [{k['title']}]({k['url']}) — "
                 f"`{k['repo']}/{k['sim']}` · {k['framework']} · "
                 f"quality {k['quality']}, {k['num_objectives']} objectives"
                 f"{', real description' if k['has_real_desc'] else ''}\n")
        L.append("**Retire / redirect via iframe:**\n")
        L.append("| MicroSim | Repo/Sim | Framework | Quality | Objectives |")
        L.append("|----------|----------|-----------|---------|------------|")
        for m in r["merge"]:
            L.append(f"| [{m['title']}]({m['url']}) | `{m['repo']}/{m['sim']}` | "
                     f"{m['framework']} | {m['quality']} | {m['num_objectives']} |")
        L.append("")
        L.append("---\n")

    if not records:
        L.append("_No duplicate clusters found at this threshold._\n")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser(description="Find duplicate MicroSims by WHAT similarity.")
    ap.add_argument("--threshold", "-t", type=float, default=0.90,
                    help="Minimum WHAT cosine similarity to link two sims (default: 0.90)")
    ap.add_argument("--cross-repo-only", action="store_true",
                    help="Only report clusters that span more than one repository")
    ap.add_argument("--include-templates", action="store_true",
                    help="Include scaffold/template sims (excluded by default)")
    args = ap.parse_args()

    print(f"Loading embeddings + catalog...")
    records, total, skipped_untitled, skipped_template = build_report(
        args.threshold, args.cross_repo_only, args.include_templates)

    md = render_md(records, total, args.threshold, args.cross_repo_only,
                   skipped_untitled, skipped_template)
    atomic_write(REPORT_MD, md)
    atomic_write(REPORT_JSON, json.dumps({
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "threshold": args.threshold,
        "cross_repo_only": args.cross_repo_only,
        "catalog_size": total,
        "untitled_excluded": skipped_untitled,
        "templates_excluded": skipped_template,
        "cluster_count": len(records),
        "clusters": records,
    }, indent=2))
    print(f"Excluded {skipped_untitled} untitled + {skipped_template} scaffold/template records")

    dup = sum(r["size"] for r in records)
    mergeable = sum(r["size"] - 1 for r in records)
    cross = sum(1 for r in records if r["cross_repo"])
    print(f"Clusters: {len(records)}  |  sims in clusters: {dup}  |  "
          f"mergeable (retirable): {mergeable}  |  cross-repo clusters: {cross}")
    print(f"Report:  {REPORT_MD}")
    print(f"Data:    {REPORT_JSON}")


if __name__ == "__main__":
    main()
