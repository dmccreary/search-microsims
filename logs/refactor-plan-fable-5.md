# MicroSim Reuse: Dual Embeddings + Search-First Chapter Generation

This is a request made to the Anthropic Claude Fable 5 model to refactor
the `/chapter-content-generator` skill to include a new feature.  This
feature will automatically use an existing similar MicroSim if it has
already been generated.

The Prompt was:

!!! prompt
    Please help me come up with a detailed plan on avoiding the duplication of microsims.  Right now, when any intelligent textbook is generated using the "/chapter-content-generator" skill, that skill writes a new specification for a new microsim.   The problem is that now every textbook that uses the "Scientific Method" now generates a new copy of workflow diagram for the scientific method.  Each of these are generated from scratch and each need to be debugged.  

    I would like you to create a plan that would first check the repository of MicroSims in this project.  Each MicroSim has a JSON file that describes it.  I have attempted to create embeddings for the MicroSims so that you could use these embeddings to find similar MicroSims.   The embedding are old, and after I designed the first version of the search, I realized that the "WHAT a MicroSim does (what learning objective it attempts to solve) and HOW it solves it (what javascript library it uses and how it implements it using good instructional design principals) are really different things.  The WHAT and the HOW each need their own embeddings.

    My goal is for you to add logic to the "/chapter-content-generator" skill in the ../claude-skills/skills/chapter-content-generator skill so that it calls a high-quality search for existing MicroSims and then inserts a reference to an existing MicroSim using an iframe reference rather than regenerate a new version.

Here is the plan that the Fable 5 model generated:

## Context

Every intelligent textbook generated with the `chapter-content-generator` skill writes brand-new MicroSim specifications, so common concepts (e.g., "Scientific Method workflow") get regenerated and re-debugged in every book. The catalog in this repo already holds ~885 MicroSims with metadata and embeddings, and `src/find-similar-templates/find-similar-templates.py` already parses SPECIFICATION blocks and returns scored matches — but neither skill calls it, and the current single embedding conflates **WHAT** a sim teaches (concept, learning objective) with **HOW** it's built (library, visualization type, instructional-design pattern).

Goal: split the embeddings into WHAT and HOW vectors, add a reuse-mode search, and make `chapter-content-generator` search the catalog before writing any new MicroSim spec — inserting an `<iframe>` to the existing hosted sim when a strong WHAT match exists.

User decisions (confirmed):
- **Automatic reuse** at score ≥ 0.80 (no per-match prompting); decisions logged in the chapter summary.
- **microsim-generator backstop deferred** until thresholds are calibrated on real books.
- **WHAT embedding** drives both the Similar MicroSims widget and the PCA map.

---

## Phase 1 — Dual embeddings (search-microsims repo)

### 1.1 Split embedding text in `src/embeddings/generate-embeddings.py`

Replace `create_embedding_text()` (line 63) with two builders, keeping the `Label: value | Label: value` join format:

**`create_what_text()`** — what it teaches: `title`, `description` (keep existing skip-if-`<iframe>` guard), `topic` (skip if == title), `subjects`/`subject`, `gradeLevel`, `learningObjectives[:5]`, `prerequisites[:3]`, `keywords`, `bloomsTaxonomy`, `_source.repo` (titleized, as "Course:").

**`create_how_text()`** — how it's implemented: `visualizationType`, `framework`, `pedagogical.pattern`, `pedagogical.interactionStyle`, `pedagogical.pacing`, `pedagogical.feedbackType`, `pedagogical.dataVisibility`, `pedagogical.supportsPrediction` (emit "supports prediction" when true), `pedagogical.bloomVerbs[:5]`.

Never skip a sim with sparse HOW metadata — embed whatever HOW fields exist (worst case just `Framework:`).

**Output — one file, two vectors per sim** (atomic regeneration, no key drift). New schema for `data/microsims-embeddings.json`:

```json
{
  "metadata": {"model": "all-MiniLM-L6-v2", "dimension": 384, "schema": "dual-v1", ...},
  "embeddings": {"https://dmccreary.github.io/{repo}/sims/{sim}/": {"what": [...], "how": [...]}}
}
```

Two batched `model.encode()` calls (what-texts, how-texts).

### 1.2 Update all consumers of the embeddings file (same change — schema break)

- `src/find-similar-templates/find-similar-templates.py` — `load_embeddings()` (line 263): detect `metadata.schema == "dual-v1"`, build two normalized matrices; treat legacy flat vectors as both (transition safety).
- `src/generate-similar-microsims.py` — use the **WHAT** vector. Regenerate `docs/search/similar-microsims.json`.
- `src/embeddings/gen-2d-plot-data.py` and `src/reports/generate-pca-map.py` — use **WHAT** vector so the map clusters by subject matter.

### 1.3 Add `requirements.txt` (fills existing gap)

`sentence-transformers`, `numpy`, `scikit-learn`, `plotly`, with a comment: Python ≤ 3.12 required (PyTorch), use `.venv-embeddings`.

---

## Phase 2 — Reuse-mode search (extend find-similar-templates.py, no new script)

### 2.1 CLI additions

```
--mode {template,reuse}   default: template (existing behavior preserved)
--query TEXT              plain WHAT text, alternative to --spec/--file/stdin
--min-score FLOAT         optional result filter
```

Skill-issued call (absolute paths — textbook repos are separate checkouts):

```bash
/Users/dan/Documents/ws/search-microsims/.venv-embeddings/bin/python \
  /Users/dan/Documents/ws/search-microsims/src/find-similar-templates/find-similar-templates.py \
  --mode reuse --query "Title: ... | Topic: ... | Subjects: ... | Grade Level: ... | Learning Objectives: ..." \
  --top 3 --json --quiet
```

### 2.2 Scoring

- **Reuse mode:** rank by pure WHAT cosine (`what_score`). Report `how_score` / `pedagogical_score` as informational only — a perfect concept match in a different library is still reusable via iframe.
- **Template mode (updated):** `0.35*what + 0.35*how + 0.30*pedagogical` (replaces `0.6*semantic + 0.4*pedagogical`, constants at lines 61–62) — HOW now genuinely drives template selection.

### 2.3 Reuse-mode JSON output adds

```json
{"what_score": 0.87, "how_score": 0.41, "recommendation": "reuse",
 "iframe_snippet": "<iframe src=\"https://dmccreary.github.io/.../main.html\" width=\"100%\" height=\"500px\" scrolling=\"no\"></iframe>",
 "fullscreen_url": "https://.../main.html"}
```

(Catalog `live_url` ends with `/`; append `main.html`.)

### 2.4 Thresholds (named constants, calibrated in Phase 4)

| Band | WHAT score | Recommendation |
|---|---|---|
| reuse | ≥ 0.80 | insert iframe to existing sim |
| template | 0.60–0.80 | write new spec, cite top match as template |
| generate | < 0.60 | write new spec from scratch |

0.80 is deliberately conservative — a false-positive reuse (wrong sim in a published book) costs more than regenerating.

---

## Phase 3 — chapter-content-generator skill changes (claude-skills repo)

### 3.1 New reuse-check step in `skills/chapter-content-generator/SKILL.md`, Step 2.4

Insert after the non-text element types list (~line 481), before the `<details>` block structure. Content:

1. **Availability check once per session:** `test -x .venv-embeddings/bin/python && test -f data/microsims-embeddings.json` (absolute paths). If either fails, skip the reuse step for the whole session — graceful degradation to current behavior; never block chapter generation.
2. **Draft the WHAT query** in the embedding field format (`Title: ... | Topic: ... | Subjects: ... | Grade Level: ... | Learning Objectives: ...`).
3. **Run the reuse search** (command from 2.1). On error or >~60s, fall back to normal spec generation.
4. **Decide by `recommendation`:**
   - `reuse` → emit the Reused block (below). Sanity-check gradeLevel/subject fit; if clearly wrong, treat as `template`. If `docs/sims/<sim-id>` already exists locally in this book, embed the local sim instead.
   - `template` → normal spec + `**Template:** <github_url><br/>` line in the details block.
   - `generate` → normal spec as today.
5. **Log reuse decisions** in the chapter-generation summary (n reused / n from template / n new).

**Reused block emitted (exact markdown):**

```markdown
#### Diagram: Scientific Method Workflow

<iframe src="https://dmccreary.github.io/intro-to-physics-course/sims/scientific-method/main.html" width="100%" height="500px" scrolling="no"></iframe>

[Run the Scientific Method Workflow MicroSim fullscreen](https://dmccreary.github.io/intro-to-physics-course/sims/scientific-method/main.html){ .md-button }

<details markdown="1">
<summary>Scientific Method Workflow (reused MicroSim)</summary>
Type: microsim
**sim-id:** scientific-method<br/>
**Library:** p5.js<br/>
**Status:** Reused<br/>
**Source:** https://dmccreary.github.io/intro-to-physics-course/sims/scientific-method/<br/>
**Source Repo:** https://github.com/dmccreary/intro-to-physics-course

Reused from the MicroSim catalog (WHAT match score 0.87). Learning objective: [as used in this chapter].
</details>
```

Keeps the `#### Diagram:` header so coverage reporting and the extraction grammar stay unified; `**Status:** Reused` is the safety marker. Document `Reused` as a terminal lifecycle state (alongside specified → scaffolded → implemented → validated → deployed) in SKILL.md and `src/microsim-utils/README.md`.

### 3.2 Downstream-tool safety in `claude-skills/src/microsim-utils/` (verified against source)

- `add-iframes-to-chapter.py` — **no change needed.** Its `IFRAME_RE` matches absolute https srcs (so no duplicate iframe inserted) and `--fix-paths` `ABS_PATH_RE` only matches srcs starting with `/sims/` (so https srcs untouched). Add a comment noting this contract.
- `generate-todo.py` — **required fix.** `_determine_status()` is filesystem-based; a reused sim has no `docs/sims/` dir → misclassified "specified" → lands on the TODO list → would get scaffolded. Add a filter (~line 112): skip specs whose in-document status is `reused`.
- `extract-sim-specs.py` — status already extracted (line 214); ensure `Reused` carries through and `generate_status_file` treats it as complete, not pending.
- `generate-sim-scaffold.py` — add the same status guard if it batch-consumes specs.

The `generate-todo.py` fix must land **before or with** 3.1 — otherwise the first reused sim pollutes TODO lists.

**Skills-repo commit:** write the `.claude-pending-commit.txt` marker per global CLAUDE.md so the Stop hook commits the claude-skills edits. If SKILL.md and microsim-utils changes end up unrelated in scope, split across turns; here they are one coherent change.

### 3.3 microsim-generator backstop — DEFERRED (per user decision)

After Phase 4 calibration proves the thresholds, a follow-up adds a reuse gate in microsim-generator between `extract-sim-specs.py` and `generate-sim-scaffold.py` (`--mode reuse --file <spec>`) to catch pre-existing `Specified` blocks. Not in this effort.

---

## Phase 4 — Regeneration, calibration, end-to-end verification

1. **Regenerate artifacts** (in search-microsims): `source .venv-embeddings/bin/activate && python src/embeddings/generate-embeddings.py && python src/generate-similar-microsims.py`. Then `src/embeddings/update-pca-data.sh` for the PCA map.
2. **Positive probe:** reuse query for "Scientific Method workflow" → expect `intro-to-physics-course/sims/scientific-method` (confirmed to exist in the catalog) ranked #1 with `what_score ≥ 0.80`. Second probe on a concept with several catalog sims (pendulum / sine wave).
3. **Negative probes:** absent concept ("Byzantine fault tolerance in distributed ledgers") → top score < 0.60; near-miss ("engineering design process" vs scientific method) → 0.60–0.80 template band. Adjust the two threshold constants if bands disagree.
4. **Downstream dry run** in a scratch textbook repo: hand-insert the Reused block into a chapter `index.md`, then run `extract-sim-specs.py` (status carried), `generate-todo.py` (reused sim absent from TODO), `add-iframes-to-chapter.py --all --fix-paths --dry-run` (no insertion, no src rewrite).
5. **Degradation test:** temporarily rename `.venv-embeddings`, confirm the skill's availability check routes to current (generate-new) behavior.
6. **Website check:** load the Similar MicroSims viewer (`docs/sims/list-similar-microsim/main.html`) against the regenerated `similar-microsims.json` — user runs `mkdocs serve` themselves (never start/kill it).

---

## Phase 5 — Follow-ups (not blocking)

- microsim-generator backstop gate (3.3).
- `--batch queries.jsonl` mode: one model load for ~10 elements per chapter (the per-call model load is the main latency cost).
- Data enrichment via existing `src/enrich-metadata/`: backfill real descriptions for iframe-only records; normalize boilerplate learningObjectives (these currently limit WHAT-embedding precision).
- Optional canvas-height metadata in the catalog so reused iframes get accurate heights instead of the 500px default.

## Critical files

| File | Change |
|---|---|
| `src/embeddings/generate-embeddings.py` | Split into WHAT/HOW builders, dual-v1 schema |
| `src/find-similar-templates/find-similar-templates.py` | dual-schema loader, `--mode reuse`, `--query`, new weights, thresholds, iframe snippet output |
| `src/generate-similar-microsims.py` | read WHAT vector from dual schema |
| `src/embeddings/gen-2d-plot-data.py`, `src/reports/generate-pca-map.py` | read WHAT vector |
| `requirements.txt` (new) | document embedding deps |
| `~/Documents/ws/claude-skills/skills/chapter-content-generator/SKILL.md` | reuse-check step in Step 2.4, Reused block template, lifecycle doc |
| `~/Documents/ws/claude-skills/src/microsim-utils/generate-todo.py` | skip `Status: Reused` specs |
| `~/Documents/ws/claude-skills/src/microsim-utils/extract-sim-specs.py` | treat Reused as complete in status file |

## Constraints honored

No git worktrees; absolute paths in all skill-issued commands (textbook repos are separate checkouts); claude-skills edits committed via the Stop-hook marker file; never touch `mkdocs serve`; never read the 7MB embeddings file directly.