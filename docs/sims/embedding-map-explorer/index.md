---
title: Embedding Map Explorer
description: Interactive exploration of MicroSim collection organized by semantic similarity
image: /sims/embedding-map-explorer/embedding-map-explorer.png
og:image: /sims/embedding-map-explorer/embedding-map-explorer.png
twitter:image: /sims/embedding-map-explorer/embedding-map-explorer.png
quality_score: 90
social:
   cards: false
---

# Embedding Map Explorer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim provides an interactive exploration interface for a MicroSim collection organized by semantic similarity, allowing users to discover related content through visual navigation.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/embedding-map-explorer/main.html"
        height="602px" width="100%" scrolling="no"></iframe>
```

## Description

### Map Features

| Feature | Purpose |
|---------|---------|
| **Clusters** | Subject-based groupings (Physics, Chemistry, etc.) |
| **Point size** | Quality score (larger = higher quality) |
| **Search** | Find specific MicroSims by title |
| **Filters** | Show/hide by subject |
| **Similar list** | Top 3 similar items for selected point |

### How to Use

1. **Browse the map** - Explore subject clusters
2. **Click any point** - See details and similar items
3. **Use search** - Type to highlight matching items
4. **Filter by subject** - Uncheck to hide categories
5. **Adjust point size** - Use slider for dense areas
6. **Toggle labels** - Show all point names

### Visual Elements

- **Colored points**: Subject-coded (Physics=blue, etc.)
- **Point size**: Quality score (80-95%)
- **Search glow**: Yellow highlight on matches
- **Selection glow**: Gold highlight on selected
- **Details panel**: Title, subject, area, quality, similar items

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Assess** the organization of MicroSim collections in embedding space
2. **Identify** clusters, outliers, and semantic relationships
3. **Navigate** embedding visualizations for content discovery

## Lesson Plan

### Introduction (5 minutes)
- Explain embedding maps as "semantic landscapes"
- Each point is a MicroSim positioned by meaning
- Clusters form naturally from similar content

### Guided Exploration (15 minutes)
1. Start with all subjects visible
2. Click a Physics MicroSim - what are its neighbors?
3. Find "boundary" items between clusters
4. Search for "wave" - where do matches appear?
5. Filter to show only Math - observe cluster structure

### Discovery Activity (10 minutes)
- Find an "outlier" - a point far from its cluster
- Find a "bridge" - a point connecting two subjects
- Identify subclusters within a main cluster
- Find the highest-quality item in each cluster

### Discussion (5 minutes)
- How would this help a teacher find content?
- What does it mean when items cluster unexpectedly?
- How could this guide new content development?

## References

- [Embeddings and Semantic Search](../../chapters/08-embeddings-semantic-search/index.md)
- [Data Visualization Best Practices](https://www.tableau.com/learn/articles/data-visualization-tips)
