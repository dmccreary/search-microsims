# Common brief: implementing specified-but-unbuilt MicroSims

You are implementing MicroSims that are specified in textbook chapters but were never built. The repo is an MkDocs Material intelligent textbook cloned from GitHub (dmccreary/*) under `/Users/dan/projects/`. Your batch file names the repo and lists the sims.

## What "unimplemented" means
A chapter under `docs/chapters/` has a `<details>` block containing the MicroSim specification, but `docs/sims/<sim-id>/` has no JavaScript: the directory is missing, or it holds only a placeholder `main.html`, or it holds scaffold files whose `.js` was never written. Your job is to build each listed sim with the **microsim-generator** skill.

## How to do it
1. Invoke the `microsim-generator` skill with the Skill tool and follow it. If the Skill tool is not available to you, read `/Users/dan/.claude/skills/microsim-generator/SKILL.md` and its `references/` guides directly and follow them.
2. Read the repo's `CLAUDE.md` (if present) and look at two or three existing implemented sims in `docs/sims/` so new sims match that repo's conventions (library versions, layout, file naming, shared libraries).
3. Work **sequentially**, one sim at a time, in the order listed.
4. Specs typed "infographic", "diagram", "chart", "workflow", "graph-model", "timeline" are still interactive MicroSims: per the skill's policy the deliverable is interactive, never a static image.

## Corrections to the skill's paths (the skill text is stale on these)
- Python utilities: `UTILS="$HOME/projects/ibook-skills/src/microsim-utils"` (NOT `~/Documents/ws/...`).
- `BK_HOME="$HOME/projects/ibook-skills"`; screenshot tool is `~/.local/bin/bk-capture-screenshot`.
- Do NOT write to `/tmp/ch-specs.json` or `/tmp/sim-status.json`. Other agents are running the same skill in parallel on other repos and would clobber them. Use `<WORK_DIR>/<repo-name>/ (a per-session scratch directory the coordinator names in your prompt)` (create it) for all temp, spec and status files.

## Rules
- **No duplicates.** Before generating each sim, check `docs/sims/` for an existing implemented sim that already covers the same spec under a different directory name (items marked "VERIFY FIRST" have a likely candidate, but check every item). If one exists, do not build another: make sure the chapter has an iframe pointing at the existing sim (add one in the repo's usual style if missing) and report it as "already existed".
- **Existing directories.** If the sim directory already exists with scaffold or placeholder files, the scaffold script skips it unless run with `--force` (the skill explains this). A "coming soon" placeholder `main.html` must be replaced by a real one.
- **Nobody is available to answer questions.** Where the skill says to ask the user (Step 3.4 instructional-design mismatch, Step 4.5 ambiguous generator), make the pedagogically sound choice yourself and record it in your report.
- **Accuracy.** Facts, dates, formulas, constants and data values shown in a sim must be correct. Use the chapter text and well-established knowledge; do not invent statistics, dates or citations. If a spec asks for a figure you cannot state with confidence, leave it out and say so in your report.
- **Keep the diff narrow.** Scope the repo-wide utilities (`validate-sims.py`, `sync-iframe-heights.py`, `add-iframes-to-chapter.py`, `update-mkdocs-nav.py`) to the chapters and sims you touched (`--chapter`, `--sim`) wherever the tool supports it, and use `--dry-run` first. The goal is a diff limited to the new sims, their chapters' iframes, and their nav entries. If a tool would rewrite many unrelated files or nav entries, do not apply it; add only what the new sims need and say so in your report.
- **Repo conventions win.** Where the repo's own `CLAUDE.md` or its existing sims conflict with the skill (p5.js version, canvas-drawn vs DOM controls, iframe/fullscreen-link style in chapters), follow the repo, even if that costs validator points, and note it.
- **Expected side files.** Hand-adding the new sims' entries to `mkdocs.yml` nav and to a hand-maintained `docs/sims/index.md` gallery is fine when the nav tool would rewrite the whole block. Do not re-sync heights or edit files of pre-existing sims you did not build.
- **Known tool limits.** `extract-sim-specs.py` only parses `#### Diagram:` / `#### Drawing:` headings; for specs under other headings (`#### MicroSim:`, `#### Timeline:`, none) use the skill's Step 1B hand-written spec JSON and scaffold with `--sim-id`. The scaffold can emit wrong-subject placeholder text (e.g. "High School Geometry") in `index.md` / `metadata.json`: read what it wrote and correct subject, grade level and description to this book. `extract-sim-specs.py` also tends to report Bloom level "Create" for every spec: take the Bloom level from the spec text. Do not copy a bogus creator "Dementia Education Project" / subject "dementia" from older sims' `metadata.json` (a template leak present in several repos); use the book's real subject.
- **Keep generators.** If you write a script to generate a sim's data file, save the script in the repo (in the sim's directory, or the repo's `src/` if it has one) with paths that work from the repo root, not only in the scratch directory.
- **Map tiles.** CARTO basemap tiles (`basemaps.cartocdn.com`) now return an "API KEY REQUIRED" watermark. Do not use them in new map sims; draw from vector data or use a tile source you have confirmed renders cleanly. Do not modify pre-existing sims that use them; just mention it.
- **Status flag.** After a sim's `.js` is written and working, set `completion_status` in its `metadata.json` to `implemented` if that field is present with the value `scaffold`.
- **TODO queue.** If the repo keeps a `docs/sims/TODO/` queue of spec JSON files, leave it alone unless the repo's CLAUDE.md documents what to do with it.
- **Finish every skill step** for each sim, including validation, iframe-height sync, the Playwright control-visibility test, the screenshot, and the visual layout review. If a tool is genuinely unavailable, say which and continue.
- **No git writes.** Do NOT `git commit`, `git push`, or `mkdocs gh-deploy`. Leave changes in the working tree. Do not discard or overwrite uncommitted changes that are already in the repo.
- Do not modify anything under `~/projects/ibook-skills` (unless that is your assigned repo, and then only `docs/`) or `~/projects/search-microsims` (unless that is your assigned repo).

## Report back (concise, under 500 words; it is read by the coordinating agent, not the user)
For each sim: outcome (implemented / already existed / skipped + why), library used, validate-sims score, Playwright iframe test PASS/FAIL, layout review result, and any deviation from the spec with the reason (including facts left out because you could not confirm them). Then list every file you changed outside `docs/sims/<sim-id>/` (chapter markdown, mkdocs.yml, etc.), and anything that did not work or that you could not verify.
