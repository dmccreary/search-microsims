# KNN Visualizer - MicroSim Generation Log

**Date:** 2026-01-26
**Chapter:** 8 - Embeddings and Semantic Search
**Status:** Created

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** differentiate
- **Recommended Pattern:** Exploration with adjustable K parameter
- **Specification Alignment:** Aligned
- **Rationale:** KNN algorithm visualization benefits from interactive K slider to show how neighborhood size affects results

## Files Created

1. `docs/sims/knn-visualizer/knn-visualizer.js` - p5.js implementation
2. `docs/sims/knn-visualizer/main.html` - HTML wrapper
3. `docs/sims/knn-visualizer/index.md` - Documentation with iframe, lesson plan
4. `docs/sims/knn-visualizer/metadata.json` - Dublin Core metadata

## Features Implemented

- 20 MicroSim points across 5 subject clusters
- K slider (1-15) with immediate visualization update
- Distance circles showing neighborhood boundary
- Ranked connection lines from query to neighbors
- Results panel with similarity scores
- Statistics (average similarity, range, subject breakdown)
- Random query button

## Learning Objectives

1. Differentiate between query results with different K values
2. Analyze how K affects the composition of neighbors
3. Explain the trade-off between precision and coverage

## Quality Score

- **Estimated:** 87/100

## Navigation

Added to mkdocs.yml under MicroSims section.
