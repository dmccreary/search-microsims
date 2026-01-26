# MicroSim Generation Log: precision-recall-explorer

**Generated:** 2026-01-26
**Status:** SUCCESS

## Source
- Chapter: 06-search-fundamentals
- Diagram Title: Precision-Recall Trade-off Explorer

## Specification
- Type: microsim
- Bloom Level: Analyze (L4)
- Bloom Verb: examine
- Learning Objective: Students will examine the trade-off between precision and recall by adjusting search parameters and observing how changes affect both metrics simultaneously.

## Files Created
1. `docs/sims/precision-recall-explorer/precision-recall-explorer.js` - p5.js implementation
2. `docs/sims/precision-recall-explorer/main.html` - HTML wrapper
3. `docs/sims/precision-recall-explorer/index.md` - Documentation
4. `docs/sims/precision-recall-explorer/metadata.json` - Dublin Core metadata

## Features Implemented
- Interactive Venn diagram with overlapping circles
- Search Specificity slider (1-10 scale)
- Real-time precision, recall, and F1 score calculation
- Stacked progress bars for metrics
- Preset scenario buttons (High Precision, Balanced, High Recall)
- Show/hide formulas toggle
- Optional particle animation in Venn regions
- Color-coded regions (blue=retrieved, green=relevant, purple=overlap)

## Instructional Design Check
- Pattern: exploration
- Alignment: Appropriate for Analyze/examine objective
- Rationale: Slider exploration lets students investigate the trade-off relationship
