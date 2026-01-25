# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MicroSim faceted search system that crawls GitHub repositories (dmccreary/*) to collect MicroSim metadata and provides a client-side search interface using ItemsJS. The site is built with MkDocs Material and deployed to GitHub Pages.

## Commands

### Local Development
```bash
mkdocs serve                    # Start dev server at http://127.0.0.1:8000/microsim-search/
```

### Crawling MicroSims
```bash
# FAST: Update from local repos (use this after enriching metadata locally)
python3 src/update-local-microsims.py              # Scan all local repos
python3 src/update-local-microsims.py geometry-course  # Scan specific repo

# SLOW: Crawl from GitHub (use only if local repos not available)
# Set GitHub token for higher rate limits (recommended)
export GITHUB_TOKEN=ghp_your_token
python3 src/crawl-microsims.py

# Update metadata from a single GitHub repository (adds/updates, removes duplicates)
python3 src/update-repo-microsims.py dmccreary/geometry-course

# Analyze missing metadata by repository
python3 src/analyze-missing-metadata.py

# Enrich existing metadata with missing fields (learningObjectives, visualizationType)
python3 src/enrich-metadata/enrich-metadata.py              # Enrich all repos
python3 src/enrich-metadata/enrich-metadata.py --report     # Report what's missing
python3 src/enrich-metadata/enrich-metadata.py --dry-run    # Preview changes

# Enrich with pedagogical classification (pattern, bloomAlignment, pacing, etc.)
python3 src/enrich-metadata/enrich-pedagogical.py           # Enrich all repos
python3 src/enrich-metadata/enrich-pedagogical.py --report  # Report what's missing
python3 src/enrich-metadata/enrich-pedagogical.py --dry-run # Preview changes

# Commit and push enriched metadata to GitHub
python3 src/enrich-metadata/commit-enrichments.py           # Commit all changed repos
python3 src/enrich-metadata/commit-enrichments.py --dry-run # Preview what would be committed
```

### Data Profiling
```bash
# Generate quality metrics report
python3 src/data-profiler/profile-microsims.py

# Output: docs/reports/microsim-metrics.md
```

### Schema Validation
```bash
# Validate a single metadata.json file
python3 src/microsim-schema/validate-metadata.py path/to/metadata.json

# Validate all collected metadata
python3 src/microsim-schema/validate-metadata.py --all
```

### Generating Embeddings
```bash
# Activate the embeddings virtual environment (requires Python 3.12)
source .venv-embeddings/bin/activate

# Generate embeddings for all MicroSims
python src/embeddings/generate-embeddings.py

# Output: data/microsims-embeddings.json (7MB, 384-dim vectors)
```

See `src/embeddings/README.md` for detailed documentation on the embedding system.

**WARNING:** The embeddings file `data/microsims-embeddings.json` is 7MB and should NEVER be read directly by Claude Code as it will crash the context. Use the precomputed similar MicroSims file instead.

### Generating Similar MicroSims Lookup
```bash
# Generate precomputed similar MicroSims from embeddings
python3 src/generate-similar-microsims.py

# Output: docs/search/similar-microsims.json (~870KB)
```

This script reads the 7MB embeddings file and precomputes the top 10 most similar MicroSims for each item using cosine similarity. The output file is much smaller (~870KB) and is used by the Similar MicroSims web interface at `docs/sims/list-similar-microsim/main.html`.

Run this script after regenerating embeddings.

### Finding Similar Templates (for microsim-generator)
```bash
# Activate the embeddings virtual environment (requires Python 3.12)
source .venv-embeddings/bin/activate

# Find templates from a specification file
python src/find-similar-templates/find-similar-templates.py --file spec.txt

# Find templates from stdin
cat spec.txt | python src/find-similar-templates/find-similar-templates.py

# Direct specification text
python src/find-similar-templates/find-similar-templates.py --spec "Type: microsim
Learning Objective: Students will understand pendulum motion..."

# JSON output for programmatic use (used by microsim-generator skill)
python src/find-similar-templates/find-similar-templates.py --file spec.txt --json --quiet

# Return more results (default is 5)
python src/find-similar-templates/find-similar-templates.py --file spec.txt --top 10
```

This service takes SPECIFICATION blocks (from chapter `index.md` files) and returns the most similar existing MicroSims as templates. It uses the same embedding model to create a query embedding, then computes cosine similarity against all existing MicroSim embeddings. Returns GitHub repository URLs for viewing the source code.

See `src/find-similar-templates/README.md` for detailed documentation.

## Architecture

### Data Pipeline
1. **Crawler** (`src/crawl-microsims.py`) - Fetches metadata.json from `dmccreary/*/docs/sims/*/metadata.json` via GitHub API
2. **Output** (`docs/search/microsims-data.json`) - Combined JSON of all MicroSim metadata
3. **Log** (`logs/microsim-crawl-YYYY-MM-DD.jsonl`) - JSONL log including missing metadata entries

### Search Interface
- `docs/search/demo.html` - Standalone ItemsJS faceted search (no backend required)
- Uses ItemsJS library from CDN (`window.itemsjs` - lowercase)
- Normalizes varying metadata schemas to official schema fields
- Facets: Subject Area, Grade Level, Bloom's Taxonomy, Difficulty, Framework, Visualization Type

### Similar MicroSims
- `docs/sims/list-similar-microsim/main.html` - Shows similar MicroSims for a given URL
- Uses precomputed similarity data from `docs/search/similar-microsims.json`
- URL format: `?id=https://dmccreary.github.io/repo/sims/name/`
- Displays top 10 similar MicroSims with similarity scores (color-coded badges)

### MicroSim Metadata Schema
Official schema: [microsim-schema.json](https://github.com/dmccreary/microsims/blob/main/src/microsim-schema/microsim-schema.json)

The schema has 8 sections: `dublinCore`, `search`, `educational`, `technical`, `userInterface`, `simulation`, `analytics`, `usage`

Key faceted fields:
- `educational.subjectArea` - Mathematics, Physics, Computer Science, etc.
- `educational.gradeLevel` - K-12, Undergraduate, Graduate, Adult
- `educational.bloomsTaxonomy` - Remember, Understand, Apply, Analyze, Evaluate, Create
- `educational.difficulty` - Beginner, Intermediate, Advanced
- `technical.framework` - p5.js, d3.js, three.js, vanilla-js
- `search.visualizationType` - animation, chart, simulation, diagram, etc.

### Schema Normalization
The search normalizes both flat legacy format and nested schema format:
- `subject` or `educational.subjectArea` → subjectArea
- `gradeLevel` or `educational.gradeLevel` → gradeLevel
- `bloomLevel` or `educational.bloomsTaxonomy` → bloomsTaxonomy
- `library` or `technical.framework` → framework
- `creator` or `dublinCore.creator` → creator

## Key Files

| File | Purpose |
|------|---------|
| `src/crawl-microsims.py` | GitHub crawler for metadata collection (slow) |
| `src/update-local-microsims.py` | Update from local repos (fast, preferred) |
| `src/update-repo-microsims.py` | Update metadata from a single GitHub repo |
| `src/analyze-missing-metadata.py` | Report repos missing metadata |
| `src/enrich-metadata/enrich-metadata.py` | Add missing fields to existing metadata |
| `src/enrich-metadata/enrich-pedagogical.py` | Add pedagogical classification to metadata |
| `src/enrich-metadata/commit-enrichments.py` | Commit and push enriched metadata to GitHub |
| `src/enrich-metadata/README.md` | Enrichment tools documentation |
| `src/data-profiler/profile-microsims.py` | Generate metadata quality metrics report |
| `src/microsim-schema/validate-metadata.py` | Validate metadata against JSON schema |
| `src/microsim-schema/microsim-schema.json` | Official MicroSim metadata JSON schema |
| `src/embeddings/generate-embeddings.py` | Generate semantic embeddings for MicroSims |
| `src/embeddings/README.md` | Embeddings documentation |
| `src/generate-similar-microsims.py` | Precompute similar MicroSims from embeddings |
| `src/find-similar-templates/find-similar-templates.py` | Find template MicroSims from specifications |
| `src/find-similar-templates/README.md` | Template finder documentation |
| `docs/search/demo.html` | ItemsJS faceted search UI |
| `docs/search/microsims-data.json` | Combined metadata (generated) |
| `docs/search/similar-microsims.json` | Precomputed similar MicroSims lookup (~870KB, generated) |
| `docs/sims/list-similar-microsim/main.html` | Similar MicroSims viewer UI |
| `data/microsims-embeddings.json` | Semantic embeddings (7MB, generated) - DO NOT READ DIRECTLY |
| `docs/microsim-schema.md` | Schema documentation |
| `docs/reports/microsim-metrics.md` | Metadata quality report (generated) |
| `logs/*.jsonl` | Crawl logs with missing metadata entries |

## p5.js Gotchas

- **stroke() does not return color values**: In p5.js, `stroke()` only sets the stroke color - it does not return the current stroke color. You cannot use `red(stroke())` or `fill(stroke())` to retrieve color components. Instead, store the color in a variable and pass it to functions that need it:
  ```javascript
  // WRONG - will error
  fill(red(stroke()), green(stroke()), blue(stroke()));

  // CORRECT - pass color as parameter
  let arrowColor = color(70, 130, 180);
  stroke(arrowColor);
  drawArrowHead(x, y, angle, arrowColor);
  ```
