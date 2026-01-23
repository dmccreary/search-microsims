# Add Missing Metadata Session Log

**Date:** 2026-01-23
**Script:** `src/add-missing-metadata.py`

## Overview

This session scanned all local repositories in `~/Documents/ws/*/docs/sims/` for MicroSim directories missing `metadata.json` files. For those with sufficient information (title and description extractable from `index.md` or `main.html`), metadata was auto-generated. For those lacking information, `TODO.md` files were created listing required fixes.

## Statistics

| Metric | Count |
|--------|-------|
| Initial MicroSims missing metadata | 262 |
| Metadata.json files created | 136 |
| TODO.md files created (need manual work) | 126 |
| Repositories processed | 26 |

## Repositories Updated

All changes were committed and pushed to GitHub with the commit message format:
```
Add auto-generated metadata.json for N MicroSims

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Successfully Added Metadata

| Repository | MicroSims | Files Added |
|------------|-----------|-------------|
| conversational-ai | ai-performance-chart, ai-timeline, chatbot-latency-breakdown, graph-viewer, regex-matcher, text-processing-workflow, text-to-graph-timeline | 7 |
| agents-course | llm-control-levels, templates | 2 |
| algebra-1 | graph-viewer | 1 |
| asl-book | graph-viewer, hand-viewer | 2 |
| automating-instructional-design | ai-generation-workflow, bloom-taxonomy, bloom-wheel, corporate-learning-module, design-tradeoff-tree, early-childhood-pattern, ed-tech-ecosystem, graph-viewer, info-density-spectrum, math-relationship-explorer, real-world-data-pattern, sim-vs-microsim, success-criteria-workflow | 13 |
| beginning-electronics | rcl-draw-test, resistor | 2 |
| circuits | templates | 1 |
| clan-macquarrie | migration, population-of-ulva, surname-population, timeline-viewer | 4 |
| claude-skills | certificate-generator, graph-color-test | 2 |
| data-science-course | graph-viewer, independent-dependent-variables | 2 |
| ethics-course | ethics-education-timeline, graph-viewer, harm-bubble-chart, technology-adoption, template | 5 |
| graph-data-modeling-course | graph-viewer | 1 |
| intelligent-book-template | template | 1 |
| intelligent-textbooks | ai-flywheel, blooms-taxonomy, book-gen-workflow, book-levels, implementation-matrix, metr-task-horizon, sae-comparison, standards-ecosystem, templates, terms-to-ekg, textbook-ecosystem-cld | 11 |
| intro-to-graph | graph-viewer, multi-hop-comparison, rdbms-vs-graph-performance | 3 |
| it-management-graph | deployment-dag, graph-viewer, it-asset-hierarchy, it-graph-nodes, p5-infographic-template, show-icons, skill-impact-chart, web-app-architecture | 8 |
| learning-graphs | blooms-taxonomy, graph-viewer, template | 3 |
| linear-algebra | attention-mechanism, cosine-euclidean-similarity, graph-viewer, hessian-curvature-visualizer, kkt-conditions-visualizer, latent-space-interpolation, lora-visualizer, multi-head-attention, newton-vs-gradient-descent, sgd-trajectory-visualizer, transformer-block | 11 |
| mccreary-heritage | ancestor-locations, book-creation-workflow, migration, template | 4 |
| microsims | a-star, conway-game-of-life, graph-viewer, microsim-growth, p5-timeline, terms-to-ekg, us-state-quality-map | 7 |
| modeling-healthcare-data | clinical-care-pathway-dag, graph-viewer, query-performance-comparison | 3 |
| moving-rainbow | animated-wire, color-wheel, current-predictor, led-dimmer, nightlight, photoresistor-component, pico-light-sensor, templates | 8 |
| personal-finance | templates | 1 |
| reading-for-kindergarten | graph-viewer | 1 |
| signal-processing | template, templates | 2 |
| systems-thinking | cld-creation-workflow, cld-editor, cmm-for-systems-thinking, leverage-iceberg, microsim-growth, node-simulation, population-simulator, template | 8 |

**Total: 136 metadata.json files created**

## Remaining Work (126 MicroSims)

The following MicroSims have `TODO.md` files created because they lack sufficient information for auto-generation. Common issues:

- **Missing main.html** - The core simulation file doesn't exist
- **No meaningful title** - Only directory name available, no title in index.md or HTML
- **No description** - No description found in YAML frontmatter, meta tags, or content

### By Repository

| Repository | Missing Count | Primary Issues |
|------------|---------------|----------------|
| agents-course | 3 | Missing main.html, no title |
| algebra-1 | 2 | No title/description |
| atam | 1 | No title, no description |
| automating-instructional-design | 11 | No title |
| beginning-electronics | 7 | Missing main.html |
| circuits | 6 | Missing main.html |
| clan-macquarrie | 1 | No title |
| clocks-and-watches | 2 | Missing main.html |
| data-science-course | 6 | Missing main.html, no title |
| deep-learning-course | 12 | No description |
| digital-electronics | 1 | No description |
| genai-arch-patterns | 3 | Missing main.html |
| geometry-course | 2 | Missing main.html |
| graph-data-modeling-course | 2 | Missing main.html |
| intelligent-book-template | 4 | Missing main.html |
| intelligent-textbooks | 7 | No description |
| intro-to-graph | 1 | No title |
| intro-to-physics-course | 2 | Missing main.html |
| it-management-graph | 1 | No description |
| learning-graphs | 3 | Missing main.html |
| learning-micropython | 3 | Missing main.html |
| linear-algebra | 5 | No title |
| mccreary-heritage | 4 | No description |
| microsims | 4 | Missing main.html |
| moving-rainbow | 2 | Missing main.html |
| personal-finance | 2 | No description |
| prompt-class | 1 | (git conflict) |
| reading-for-kindergarten | 1 | Missing main.html |
| semiconductor-physics-course | 1 | Missing main.html |
| signal-processing | 9 | Missing main.html |
| stem-robots | 5 | Missing main.html |
| systems-thinking | 5 | Missing main.html, no description |
| tracking-ai-course | 1 | (git conflict) |

## Script Details

The `add-missing-metadata.py` script:

1. **Scans** all `~/Documents/ws/*/docs/sims/` directories
2. **Analyzes** each MicroSim by reading:
   - `main.html` for framework detection and HTML title/meta tags
   - `index.md` for YAML frontmatter and markdown content
   - `*.js` files for additional framework detection
3. **Detects automatically:**
   - JavaScript framework (p5.js, d3.js, three.js, Chart.js, vis-network, etc.)
   - Subject area (Mathematics, Physics, Computer Science, etc.)
   - Visualization type (animation, simulation, chart, diagram, etc.)
4. **Creates metadata.json** when title + description are available
5. **Creates TODO.md** when manual intervention is needed

### Usage

```bash
# List all MicroSims missing metadata
python src/add-missing-metadata.py --list

# Dry run to preview changes
python src/add-missing-metadata.py --dry-run

# Process all repos
python src/add-missing-metadata.py

# Process specific repo
python src/add-missing-metadata.py geometry-course
```

## Next Steps

1. Review `TODO.md` files in each MicroSim directory
2. Add missing `main.html` files where needed
3. Add titles and descriptions to `index.md` files
4. Re-run `add-missing-metadata.py` to generate metadata for fixed MicroSims
5. Use `update-local-microsims.py` to update the search index

## Log Files

- Session JSONL log: `logs/add-metadata-2026-01-23.jsonl`
- This summary: `logs/add-missing-metadata.md`
