# Vector Space Visualization - MicroSim Generation Log

**Date:** 2026-01-26
**Chapter:** 8 - Embeddings and Semantic Search
**Status:** Created

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** explain
- **Recommended Pattern:** Exploration with clustering visualization
- **Specification Alignment:** Aligned
- **Rationale:** Vector space visualization benefits from interactive point selection with neighbor highlighting to show semantic relationships

## Files Created

1. `docs/sims/vector-space-viz/vector-space-viz.js` - p5.js implementation
2. `docs/sims/vector-space-viz/main.html` - HTML wrapper
3. `docs/sims/vector-space-viz/index.md` - Documentation with iframe, lesson plan
4. `docs/sims/vector-space-viz/metadata.json` - Dublin Core metadata

## Features Implemented

- 15 MicroSim points across 4 subject clusters
- Click-to-select with neighbor highlighting
- Adjustable neighbor count (1-10)
- Toggle cluster background shading
- Toggle distance lines to neighbors
- Information panel with similarity percentages
- Subject-based color coding with legend

## Learning Objectives

1. Explain how embeddings position similar items near each other
2. Identify clusters of related content in vector space
3. Interpret the meaning of distance in semantic similarity

## Quality Score

- **Estimated:** 85/100

## Navigation

Added to mkdocs.yml under MicroSims section.
