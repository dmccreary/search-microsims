---
title: Vector Space Visualization
description: Interactive 2D scatter plot showing how embeddings position similar items near each other
image: /sims/vector-space-viz/vector-space-viz.png
og:image: /sims/vector-space-viz/vector-space-viz.png
twitter:image: /sims/vector-space-viz/vector-space-viz.png
quality_score: 85
social:
   cards: false
---

# Vector Space Visualization

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates how embeddings position similar items near each other in vector space by visualizing MicroSims as points in a 2D projection.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/vector-space-viz/main.html"
        height="522px" width="100%" scrolling="no"></iframe>
```

## Description

### Understanding Vector Space

| Concept | Meaning in This Visualization |
|---------|-------------------------------|
| **Point** | A MicroSim positioned by its embedding |
| **Cluster** | MicroSims with similar content |
| **Distance** | Semantic dissimilarity (closer = more similar) |
| **Color** | Subject area classification |

### How to Use

1. **Click any point** to select it and see its neighbors
2. **Adjust the neighbor count** using +/- buttons
3. **Toggle cluster backgrounds** to see subject groupings
4. **Toggle distance lines** to see connections to neighbors
5. **View the side panel** for similarity percentages

### Visual Elements

- **Colored points**: MicroSims grouped by subject
- **Cluster shading**: Light backgrounds showing subject regions
- **Distance lines**: Dashed lines to nearest neighbors
- **Information panel**: Selected point details and neighbor list

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Explain** how embeddings position similar items near each other
2. **Identify** clusters of related content in vector space
3. **Interpret** the meaning of distance in semantic similarity

## Lesson Plan

### Introduction (5 minutes)
- Explain that embeddings convert text to numerical vectors
- Introduce the concept of "semantic space"
- Discuss how similar meaning = close position

### Exploration Activity (15 minutes)
1. Click different points, observe which neighbors appear
2. Notice how Physics items cluster together
3. Compare distances within vs. between clusters
4. Adjust K to see how neighborhood size affects results

### Analysis Questions (10 minutes)
- Why are all Physics MicroSims near each other?
- What does it mean when a Chemistry item is close to Physics?
- If you added a new MicroSim about "sound waves," where would it appear?

### Discussion (5 minutes)
- Limitations of 2D projection (information loss)
- Real embeddings have 384 dimensions
- Applications: recommendation systems, search

## References

- [Embeddings and Semantic Search](../../chapters/08-embeddings-semantic-search/index.md)
- [Word Embeddings](https://en.wikipedia.org/wiki/Word_embedding)
