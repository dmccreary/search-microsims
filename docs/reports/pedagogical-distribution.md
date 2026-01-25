---
title: Pedagogical Metadata Distribution Report
date: 2026-01-25 12:28:18
---

# Pedagogical Metadata Distribution Report

This report analyzes the distribution of pedagogical metadata across all MicroSims,
comparing `bloomsTaxonomy` (content scope) vs `bloomAlignment` (pattern effectiveness)
within the `pedagogical` section to determine overlap and differences.

## Overview

**Total MicroSims analyzed:** 885

| Metric | Count | Percentage |
|--------|-------|------------|
| Has pedagogical.bloomsTaxonomy | 879 | 99.3% |
| Has pedagogical.bloomAlignment | 883 | 99.8% |
| Has both fields | 877 | 99.1% |
| Has neither field | 0 | 0.0% |

## Comparison: bloomsTaxonomy vs bloomAlignment

For MicroSims that have **both** fields populated:

| Relationship | Count | Percentage |
|--------------|-------|------------|
| Exact match (identical sets) | 58 | 6.6% |
| bloomAlignment ⊂ bloomsTaxonomy (subset) | 468 | 53.4% |
| bloomAlignment ⊃ bloomsTaxonomy (superset) | 119 | 13.6% |
| Partial overlap | 231 | 26.3% |
| No overlap (completely different) | 1 | 0.1% |

**Agreement rate** (any overlap): 99.9%

**Exact match rate**: 6.6%

## Bloom Level Distribution by Field

| Bloom Level | bloomsTaxonomy | bloomAlignment | Difference |
|-------------|----------------|----------------|------------|
| Remember | 658 | 126 | -532 |
| Understand | 786 | 801 | +15 |
| Apply | 853 | 862 | +9 |
| Analyze | 354 | 478 | +124 |
| Evaluate | 363 | 311 | -52 |
| Create | 686 | 16 | -670 |

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

These MicroSims have completely different values in pedagogical.bloomsTaxonomy
and pedagogical.bloomAlignment, which may indicate data quality issues:

| Title | bloomsTaxonomy | bloomAlignment |
|-------|----------------|----------------|
| Triangle Type Explorer | analyze - determine how side lengths affect angles, apply - classify triangles based on measurements, remember - recall definitions of triangle types, understand - explain properties of different triangle types | analyze, apply, understand |

## Analysis & Recommendations

### Moderate Redundancy Detected

With 99.9% overlap between the fields, there is moderate redundancy.
The fields often agree but not always. Consider:

1. **Clarify the distinction** - Document when they should differ
2. **Use bloomsTaxonomy for content scope** - All levels the content can address
3. **Use bloomAlignment for pattern effectiveness** - Levels the interaction pattern supports
4. **Keep bloomVerbs as the primary matching field** - More granular than levels

### Field Purpose Summary

| Field | Section | Purpose | Used For |
|-------|---------|---------|----------|
| bloomsTaxonomy | pedagogical | Content cognitive scope | Semantic search |
| bloomAlignment | pedagogical | Pattern effectiveness levels | Template matching |
| bloomVerbs | pedagogical | Specific action verbs | Precise matching |
