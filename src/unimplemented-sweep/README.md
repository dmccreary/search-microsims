# Unimplemented MicroSim sweep

Working files for the job that builds every MicroSim that has a `<details>`
specification in a chapter but no JavaScript in `docs/sims/`. The backlog is
tracked in [`TODO.md`](../../TODO.md) and found by
[`src/find-unimplemented-microsims.py`](../find-unimplemented-microsims.py).

| File | Purpose |
|------|---------|
| `agent-brief.md` | Shared instructions given to each build agent: method, corrected skill paths, rules, report format |
| `next_batch.py` | Rescans one repo and writes a batch file listing its next open sims |
| `findings.md` | Running log of what each batch found: spec and chapter errors, broken existing sims, tool bugs |

## How a batch is run

1. `python3 src/unimplemented-sweep/next_batch.py <repo> 7 <out-dir>` writes the batch file.
2. One agent per repo is given `agent-brief.md`, the batch file, a scratch
   directory of its own, and notes specific to that repo. It runs the
   `/microsim-generator` skill on each sim in turn. Up to five repos run at once;
   two agents never share a repo.
3. When the agent reports, `python3 src/find-unimplemented-microsims.py --repo <repo>`
   confirms the sims now have JavaScript, and `--update-todo` refreshes `TODO.md`.
4. Agents do not commit, push or deploy.

## Status when paused (2026-10-02)

820 open, 155 done. The sweep was paused on request with five agents stopped
mid-batch.

**Closed out and published (14):** search-microsims, public-health, us-geography,
calculus, cybersecurity, automating-instructional-design, algebra-1,
computer-science, english-language-arts, statistics-course,
organizational-analytics, circuits, scratch, tracking-ai-course.

**Closed out, not deployed (3):** context-graph, ibook-skills, atam. Their sims
are committed and pushed, but none of the three sites has been redeployed.

**Stopped mid-batch (5).** Their partly finished work was committed and pushed as
work in progress on 2026-10-02 (not deployed). Inspect the sim directories before
continuing rather than trusting the scanner, which only checks that a `.js` file
exists.

| Repo | Open | State on disk |
|------|-----:|---------------|
| semiconductor-physics-course | 3 | `solar-cell-iv-explorer` and `quantum-well-explorer` built, final verification steps not confirmed; three not started (chapters 20 to 22) |
| chemistry | 5 | `heterogeneous-catalysis-surface` built; five more directories for chapters 12 to 16 hold only scaffold files with placeholder docs and no `.js` |
| signal-processing | 7 | Batch 2 (chapters 5 to 8) has `.js` files for all seven, later steps unverified; seven more in chapters 9+ not started |
| conversational-ai | 23 | `inverted-index` and `full-text-search` built but not yet embedded in chapters, in the nav, or fully verified; `query-parser-pipeline` is scaffold only |
| information-systems | 25 | Nothing written yet |

**Not started (14):** clocks-and-watches, control-systems, data-science-course,
Dementia, digital-citizenship, digital-electronics, ethics-course,
geometry-course, graph-data-modeling-course, intro-to-graph,
intro-to-physics-course, learning-linux, psychology, right-database.

## Things to know before resuming

- Repos are cloned under `~/projects`. The microsim-generator skill still points
  its utilities at `~/Documents/ws/ibook-skills`, which no longer exists;
  `agent-brief.md` gives the corrected paths.
- The skill writes to `/tmp/ch-specs.json`, so parallel agents need separate
  scratch directories.
- Each batch of about seven sims takes 40 to 60 minutes and roughly 500k agent
  tokens. Five parallel batches reached the account usage limit twice in one
  night.
- Several repos will not build in the `mkdocs` environment without extra
  plugins (`social_override`, `exclude`); see `findings.md`.
