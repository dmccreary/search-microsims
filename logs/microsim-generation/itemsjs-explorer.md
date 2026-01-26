# ItemsJS API Explorer - MicroSim Generation Log

**Date:** 2026-01-26
**Chapter:** 7 - Faceted Search
**Status:** Created

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** implement
- **Recommended Pattern:** Build-and-test with live code preview
- **Specification Alignment:** Aligned
- **Rationale:** API exploration benefits from interactive query building with immediate feedback showing both code and results

## Files Created

1. `docs/sims/itemsjs-explorer/itemsjs-explorer.js` - p5.js implementation with ItemsJS integration
2. `docs/sims/itemsjs-explorer/main.html` - HTML wrapper with ItemsJS CDN
3. `docs/sims/itemsjs-explorer/index.md` - Documentation with iframe, lesson plan
4. `docs/sims/itemsjs-explorer/metadata.json` - Dublin Core metadata

## Features Implemented

- Query builder panel with text search input
- Multi-select checkboxes for 3 facets (Subject, Grade, Framework)
- Live-updating code preview showing generated search() call
- Tabbed results viewer (Items, Aggregations, Raw JSON)
- 15 sample MicroSim data items
- Execute Search button
- Reset button to clear all selections
- Copy Code button for clipboard export
- Card-based item display with tags
- Horizontal bar chart for aggregation counts

## Learning Objectives

1. Implement search queries using the ItemsJS API
2. Construct search parameters with filters and sorting
3. Interpret the data structure returned by ItemsJS

## Quality Score

- **Estimated:** 84/100

## Navigation

Added to mkdocs.yml under MicroSims section.
