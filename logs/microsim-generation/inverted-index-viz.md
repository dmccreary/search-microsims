# MicroSim Generation Log: inverted-index-viz

**Generated:** 2026-01-26
**Status:** SUCCESS

## Source
- Chapter: 06-search-fundamentals
- Diagram Title: Inverted Index Visualizer

## Specification
- Type: microsim
- Bloom Level: Understand (L2)
- Bloom Verb: explain
- Learning Objective: Students will explain how inverted indexes enable fast search by watching the index construction process and tracing query lookups through the resulting data structure.

## Files Created
1. `docs/sims/inverted-index-viz/inverted-index-viz.js` - p5.js implementation
2. `docs/sims/inverted-index-viz/main.html` - HTML wrapper
3. `docs/sims/inverted-index-viz/index.md` - Documentation
4. `docs/sims/inverted-index-viz/metadata.json` - Dublin Core metadata

## Features Implemented
- Document collection panel (3+ documents)
- Alphabetically sorted inverted index display
- Clickable terms with connection lines to documents
- Query input field
- Trace Query button showing AND intersection lookup
- Add Document button to expand collection
- Build Index animation
- Index statistics (term count, posting count)
- Document highlighting for matched results
- Reset functionality

## Instructional Design Check
- Pattern: exploration
- Alignment: Appropriate for Understand/explain objective
- Rationale: Interactive term clicking and query tracing reveal index structure
