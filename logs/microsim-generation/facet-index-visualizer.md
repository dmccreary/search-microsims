# Facet Index Visualizer - MicroSim Generation Log

**Date:** 2026-01-26
**Chapter:** 7 - Faceted Search
**Status:** Created

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** examine, trace, predict
- **Recommended Pattern:** Step-through with click-select interaction
- **Specification Alignment:** Aligned
- **Rationale:** Set intersection visualization benefits from step-by-step selection to show how facet combinations filter documents

## Files Created

1. `docs/sims/facet-index-visualizer/facet-index-visualizer.js` - p5.js implementation
2. `docs/sims/facet-index-visualizer/main.html` - HTML wrapper
3. `docs/sims/facet-index-visualizer/index.md` - Documentation with iframe, lesson plan
4. `docs/sims/facet-index-visualizer/metadata.json` - Dublin Core metadata

## Features Implemented

- 15 sample documents with 3 facets (Subject, Grade Level, Framework)
- Radio button selection for facet values
- Real-time document filtering with visual feedback
- Gold outlines for matching documents, faded non-matches
- Set calculation panel showing intersection notation
- Reset All button
- Show/Hide Steps toggle
- Animate button for demonstration

## Learning Objectives

1. Examine how facet indexes create document sets
2. Trace the intersection operation across multiple facets
3. Predict which documents match given facet selections

## Quality Score

- **Estimated:** 86/100

## Navigation

Added to mkdocs.yml under MicroSims section.
