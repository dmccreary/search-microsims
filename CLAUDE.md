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
# Set GitHub token for higher rate limits (recommended)
export GITHUB_TOKEN=ghp_your_token

# Crawl all dmccreary/* repos for metadata.json files
python3 src/crawl-microsims.py

# Update metadata from a single repository (adds/updates, removes duplicates)
python3 src/update-repo-microsims.py dmccreary/geometry-course

# Analyze missing metadata by repository
python3 src/analyze-missing-metadata.py
```

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
| `src/crawl-microsims.py` | GitHub crawler for metadata collection |
| `src/update-repo-microsims.py` | Update metadata from a single repo |
| `src/analyze-missing-metadata.py` | Report repos missing metadata |
| `docs/search/demo.html` | ItemsJS faceted search UI |
| `docs/search/microsims-data.json` | Combined metadata (generated) |
| `docs/microsim-schema.md` | Schema documentation |
| `logs/*.jsonl` | Crawl logs with missing metadata entries |
