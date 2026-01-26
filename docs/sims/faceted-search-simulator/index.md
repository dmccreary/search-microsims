---
title: Faceted Search Simulator
description: Interactive demonstration of faceted filtering for MicroSim discovery with multiple filter dimensions and real-time result updates
image: /sims/faceted-search-simulator/faceted-search-simulator.png
og:image: /sims/faceted-search-simulator/faceted-search-simulator.png
twitter:image: /sims/faceted-search-simulator/faceted-search-simulator.png
quality_score: 89
social:
   cards: false
---

# Faceted Search Simulator

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates faceted search - the powerful filtering technique used by e-commerce sites and search engines to help users narrow results by multiple dimensions.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/faceted-search-simulator/main.html"
        height="602px" width="100%" scrolling="no"></iframe>
```

## Description

### Available Facets

| Facet | Values | Purpose |
|-------|--------|---------|
| **Subject Area** | Physics, Chemistry, Math, Biology, CS | Academic discipline |
| **Grade Level** | Middle School, High School, Undergraduate, Graduate | Target audience |
| **Framework** | p5.js, D3.js, Three.js | Technical implementation |
| **Difficulty** | Beginner, Intermediate, Advanced | Complexity level |

### How to Use

1. **Click checkboxes** in the facet panel to filter results
2. **Watch counts update** as filters are applied
3. **Use the search box** to filter by title text
4. **Remove active filters** by clicking the × on filter chips
5. **Navigate pages** if results exceed 6 items
6. **Click "Clear All Filters"** to reset

### Key Behaviors

- **Within facet**: Selections use OR logic (Physics OR Chemistry)
- **Across facets**: Selections use AND logic (Physics AND Undergraduate)
- **Live counts**: Numbers update to show filtered totals
- **Zero-count options**: Shown but grayed out

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Use** faceted search to filter a collection
2. **Explain** the difference between OR and AND logic in facets
3. **Observe** how filter counts update dynamically

## Lesson Plan

### Introduction (5 minutes)
- Compare to shopping site filters (size, color, price)
- Why is this better than typing complex boolean queries?

### Exploration Activity (10 minutes)
1. Start with no filters - observe all 20 MicroSims
2. Select "Physics" - watch results and counts update
3. Add "Undergraduate" - notice AND behavior
4. Select both Physics AND Chemistry - notice OR within facet
5. Clear and try different combinations

### Analysis Questions (10 minutes)
- How do the counts help you understand the collection?
- What happens when a count shows 0?
- Why might you want multiple values within one facet?

### Design Discussion (5 minutes)
- What other facets would be useful for MicroSims?
- How would you handle 1000+ items?
- What if a MicroSim belongs to multiple subjects?

## References

- [Faceted Search](../../chapters/07-faceted-search-client-side/index.md)
- [Faceted Navigation on Wikipedia](https://en.wikipedia.org/wiki/Faceted_search)
