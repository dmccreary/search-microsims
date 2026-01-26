---
title: KNN Visualizer
description: Interactive visualization of K-nearest neighbors algorithm in 2D embedding space
image: /sims/knn-visualizer/knn-visualizer.png
og:image: /sims/knn-visualizer/knn-visualizer.png
twitter:image: /sims/knn-visualizer/knn-visualizer.png
quality_score: 87
social:
   cards: false
---

# KNN Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates how the K-nearest neighbors algorithm finds similar items in embedding space by visualizing distance calculations and neighbor selection.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/knn-visualizer/main.html"
        height="552px" width="100%" scrolling="no"></iframe>
```

## Description

### Understanding KNN

| K Value | Effect | Use Case |
|---------|--------|----------|
| **K=1** | Single most similar item | Exact match finding |
| **K=3-5** | Small neighborhood | Recommendations |
| **K=10+** | Large neighborhood | Exploration |

### How to Use

1. **Click any point** to select it as the query
2. **Adjust K** with the slider (1-15)
3. **Toggle distance circles** to see the neighborhood boundary
4. **Toggle connection lines** to see ranked connections
5. **View the results panel** for similarity scores and statistics
6. **Click Random** to explore different query points

### Visual Elements

- **Colored points**: MicroSims grouped by subject
- **Distance circles**: Concentric rings showing distance from query
- **Connection lines**: Ranked connections to neighbors
- **Dashed boundary**: The "neighborhood" containing K items

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Differentiate** between query results with different K values
2. **Analyze** how K affects the composition of neighbors
3. **Explain** the trade-off between precision and coverage

## Lesson Plan

### Introduction (5 minutes)
- Explain KNN as "find the K most similar items"
- Discuss applications: recommendations, classification
- Introduce the visualization

### K Value Exploration (15 minutes)
1. Start with K=1, observe single nearest neighbor
2. Increase to K=3, then K=5, then K=10
3. Notice how neighbors change with different K values
4. Observe statistics: average similarity, range

### Cross-Subject Analysis (10 minutes)
- Select a Physics item, examine neighbors
- Are all neighbors Physics? Why or why not?
- Select an item near cluster boundaries
- Discuss "boundary" items and their neighbors

### Discussion (5 minutes)
- Why might you choose K=3 vs K=10?
- How does K affect accuracy vs. coverage?
- What happens with very large K?

## References

- [Embeddings and Semantic Search](../../chapters/08-embeddings-semantic-search/index.md)
- [K-Nearest Neighbors (Wikipedia)](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)
