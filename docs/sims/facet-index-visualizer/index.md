---
title: Facet Index Visualizer
description: Interactive visualization showing how facet selections create set intersections for fast filtering
image: /sims/facet-index-visualizer/facet-index-visualizer.png
og:image: /sims/facet-index-visualizer/facet-index-visualizer.png
twitter:image: /sims/facet-index-visualizer/facet-index-visualizer.png
quality_score: 86
social:
   cards: false
---

# Facet Index Visualizer

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates how facet indexes enable fast filtering by visualizing set intersections as facet values are selected.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/facet-index-visualizer/main.html"
        height="522px" width="100%" scrolling="no"></iframe>
```

## Description

### Set Operations in Faceted Search

| Operation | Notation | Example |
|-----------|----------|---------|
| **Single facet** | A | Subject = "Physics" → {1, 2, 3, 7} |
| **Two facets (AND)** | A ∩ B | Physics AND Undergrad → {1, 2} |
| **Three facets** | A ∩ B ∩ C | Physics AND Undergrad AND p5.js → {1, 2} |

### How to Use

1. **Click radio buttons** to select facet values
2. **Watch documents** fade that don't match selections
3. **See the set calculation** panel update with notation
4. **Gold outlines** highlight matching documents
5. **Click "Reset All"** to clear selections
6. **Toggle "Show Steps"** to hide/show calculation panel

### Visual Elements

- **Colored circles**: Documents (numbered 1-15)
- **Radio buttons**: Facet value selectors
- **Gold outlines**: Documents matching all selected facets
- **Faded circles**: Documents not matching current filters
- **Calculation panel**: Shows set notation and intersection

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Examine** how facet indexes create document sets
2. **Trace** the intersection operation across multiple facets
3. **Predict** which documents match given facet selections

## Lesson Plan

### Introduction (5 minutes)
- Explain facet indexes as "pre-computed lists"
- Analogy: phone book indexes by first letter

### Set Operations Activity (10 minutes)
1. Select only "Physics" - observe which docs match
2. Add "Undergraduate" - watch intersection shrink
3. Add "p5.js" - final intersection

### Mental Math Exercise (10 minutes)
Before clicking, predict:
- "If I select Chemistry, which documents will match?"
- "If I add Graduate level, how many will remain?"
Then verify predictions by clicking

### Discussion (5 minutes)
- Why is intersection fast? (No scanning all documents)
- What if we had 10,000 documents?
- How do facet counts get calculated?

## References

- [Faceted Search](../../chapters/07-faceted-search-client-side/index.md)
- [Set Intersection](https://en.wikipedia.org/wiki/Intersection_(set_theory))
