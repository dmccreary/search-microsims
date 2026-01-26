# MicroSim Generation Log: boolean-query-builder

**Generated:** 2026-01-26
**Status:** SUCCESS

## Source
- Chapter: 06-search-fundamentals
- Diagram Title: Boolean Query Builder

## Specification
- Type: microsim
- Bloom Level: Apply (L3)
- Bloom Verb: construct
- Learning Objective: Students will construct boolean search queries by visually combining terms with AND, OR, and NOT operators while observing the resulting query string and Venn diagram representation.

## Files Created
1. `docs/sims/boolean-query-builder/boolean-query-builder.js` - p5.js implementation
2. `docs/sims/boolean-query-builder/main.html` - HTML wrapper
3. `docs/sims/boolean-query-builder/index.md` - Documentation
4. `docs/sims/boolean-query-builder/metadata.json` - Dublin Core metadata

## Features Implemented
- 3 term input fields with NOT checkboxes
- Operator selectors (AND/OR) between terms
- Real-time query string generation
- Venn diagram visualization with colored circles
- Sample document database (10 docs)
- Live matching results display
- 4 preset example buttons (Basic AND, Synonym OR, Exclusion, Complex)
- Clear All button

## Instructional Design Check
- Pattern: guided-discovery
- Alignment: Appropriate for Apply/construct objective
- Rationale: Input fields let students build and test their own queries
