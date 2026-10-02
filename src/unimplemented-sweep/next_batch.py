"""next_batch.py <repo> [max] [out-dir]

Rescan one repo and write a batch file listing its first <max> open sims
(default 7) for an agent to build.  Output goes to <out-dir> (default: the
current directory).
"""
import json, subprocess, sys, collections, datetime, os, tempfile
repo = sys.argv[1]; maxb = int(sys.argv[2]) if len(sys.argv) > 2 else 7
outdir = sys.argv[3] if len(sys.argv) > 3 else '.'
os.makedirs(outdir, exist_ok=True)
out = os.path.join(tempfile.gettempdir(), f'{repo}-scan.json')
SCANNER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'find-unimplemented-microsims.py')
subprocess.run(['python3', SCANNER, '--repo', repo, '--json', out], capture_output=True, check=True)
items = collections.OrderedDict()
for o in json.load(open(out)):
    if o['state'] != 'impl': items.setdefault(o['name'], o)
items = list(items.values())
b = items[:maxb]
if len(items) - len(b) <= 2: b = items
stamp = datetime.datetime.now().strftime('%H%M')
path = os.path.join(outdir, f'{repo}-{stamp}.md')
desc = {'missing':'no sim directory','stub':'directory holds only a placeholder main.html','broken_src':'directory has scaffold files (main.html/index.md/metadata.json) but the .js that main.html loads was never written','no_html':'directory exists without main.html or .js','redirect':'main.html only redirects'}
lines = [f"# Batch for repo `/Users/dan/projects/{repo}` ({len(b)} of {len(items)} open sims)", "",
         "Sims to build (path:line is the `<details>` tag of the spec; the sim-id was derived from a `sim-id:` line, an iframe path, or the heading. If the spec block names a different sim-id, use the spec's):", ""]
for o in b:
    t = o['heading'] or o['summary']
    v = f" — VERIFY FIRST: `docs/sims/{o['possible_match']}` may already be this sim" if o.get('possible_match') else ''
    lines.append(f"- `{o['name']}` — \"{t}\" — type: {o['type'] or 'unspecified'} — {desc.get(o['state'], o['state'])} — {o['chapter']}:{o['line']}{v}")
open(path, 'w').write('\n'.join(lines) + '\n')
print(path, f'({len(b)} of {len(items)} open)')
print('\n'.join(lines[4:]))
