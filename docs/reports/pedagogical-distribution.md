---
title: Pedagogical Metadata Distribution Report
date: 2025-01-25 11:57:43
---

# Pedagogical Metadata Distribution Report

This report analyzes the distribution of pedagogical metadata across all MicroSims,
comparing `bloomsTaxonomy` vs `bloomAlignment` to determine overlap and inform schema design decisions.

!!! note "Schema Update"
    Based on this analysis, `bloomsTaxonomy` was moved from the `educational` section to `pedagogical` (January 2025). Both fields now live in the pedagogical section since they both impact template matching scores. See [Bloom's Taxonomy vs Bloom Alignment](../microsim-schema.md#blooms-taxonomy-vs-bloom-alignment) for the distinction between these fields.

## Overview

**Total MicroSims analyzed:** 885

| Metric | Count | Percentage |
|--------|-------|------------|
| Has educational.bloomsTaxonomy | 880 | 99.4% |
| Has pedagogical.bloomAlignment | 883 | 99.8% |
| Has both fields | 878 | 99.2% |
| Has neither field | 0 | 0.0% |

## Comparison: Educational vs Pedagogical Bloom Levels

For MicroSims that have **both** fields populated:

| Relationship | Count | Percentage |
|--------------|-------|------------|
| Exact match (identical sets) | 58 | 6.6% |
| Pedagogical ⊂ Educational (subset) | 463 | 52.7% |
| Pedagogical ⊃ Educational (superset) | 121 | 13.8% |
| Partial overlap | 235 | 26.8% |
| No overlap (completely different) | 1 | 0.1% |

**Agreement rate** (any overlap): 99.9%

**Exact match rate**: 6.6%

## Bloom Level Distribution by Section

| Bloom Level | Educational | Pedagogical | Difference |
|-------------|-------------|-------------|------------|
| Remember | 657 | 126 | -531 |
| Understand | 786 | 801 | +15 |
| Apply | 851 | 862 | +11 |
| Analyze | 353 | 478 | +125 |
| Evaluate | 359 | 311 | -48 |
| Create | 681 | 16 | -665 |

## Pedagogical Pattern Distribution

| Pattern | Count | Percentage |
|---------|-------|------------|
| demonstration | 376 | 42.6% |
| assessment | 172 | 19.5% |
| exploration | 132 | 14.9% |
| worked-example | 78 | 8.8% |
| reference | 76 | 8.6% |
| guided-discovery | 38 | 4.3% |
| practice | 11 | 1.2% |

## Pacing Distribution

| Pacing | Count | Percentage |
|--------|-------|------------|
| self-paced | 832 | 94.2% |
| step-through | 26 | 2.9% |
| continuous | 23 | 2.6% |
| timed | 2 | 0.2% |

## Top 20 Bloom Verbs

| Verb | Count |
|------|-------|
| describe | 584 |
| calculate | 509 |
| explain | 466 |
| apply | 441 |
| compare | 394 |
| demonstrate | 309 |
| illustrate | 301 |
| classify | 205 |
| implement | 168 |
| interpret | 162 |
| use | 161 |
| summarize | 131 |
| assess | 70 |
| experiment | 59 |
| recognize | 54 |
| identify | 53 |
| state | 43 |
| list | 42 |
| define | 33 |
| analyze | 33 |

## MicroSims with No Overlap Between Fields

These MicroSims have completely different values in educational.bloomsTaxonomy
and pedagogical.bloomAlignment, which may indicate data quality issues:

| Title | Educational | Pedagogical |
|-------|-------------|-------------|
| Triangle Type Explorer | analyze - determine how side lengths affect angles, apply - classify triangles based on measurements, remember - recall definitions of triangle types, understand - explain properties of different triangle types | analyze, apply, understand |

## Analysis & Recommendations

### Moderate Redundancy Detected

With 99.9% overlap between the fields, there is moderate redundancy.
The fields often agree but not always. Consider:

1. **Clarify the distinction** - Document when they should differ
2. **Use pedagogical.bloomAlignment for pattern matching** - Move educational.bloomsTaxonomy there
3. **Keep bloomVerbs as the primary matching field** - More granular than levels

### Field Purpose Summary

| Field | Section | Purpose | Used For |
|-------|---------|---------|----------|
| bloomsTaxonomy | educational | Content cognitive levels | Semantic search |
| bloomAlignment | pedagogical | Pattern-appropriate levels | Template matching |
| bloomVerbs | pedagogical | Specific action verbs | Precise matching |
