# MicroSim Generation Log: ranking-visualizer

**Generated:** 2026-01-26
**Status:** SUCCESS

## Source
- Chapter: 06-search-fundamentals
- Diagram Title: Ranking Score Visualizer

## Specification
- Type: microsim
- Bloom Level: Understand (L2)
- Bloom Verb: interpret
- Learning Objective: Students will interpret how different ranking signals combine to determine search result order by experimenting with signal weights and observing rank changes.

## Files Created
1. `docs/sims/ranking-visualizer/ranking-visualizer.js` - p5.js implementation
2. `docs/sims/ranking-visualizer/main.html` - HTML wrapper
3. `docs/sims/ranking-visualizer/index.md` - Documentation
4. `docs/sims/ranking-visualizer/metadata.json` - Dublin Core metadata

## Features Implemented
- 8 sample MicroSim results with animated reordering
- 5 ranking signal sliders (Term Frequency, Title Match, Subject Match, Freshness, Popularity)
- Stacked bar score breakdown showing signal contributions
- Smooth animation when ranks change
- Reset Defaults button
- Equal Weights preset
- Show/Hide Breakdown toggle
- Color-coded signal legend

## Instructional Design Check
- Pattern: exploration
- Alignment: Appropriate for Understand/interpret objective
- Rationale: Weight sliders let students experiment with ranking factors
