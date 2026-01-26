---
title: PCA vs t-SNE Comparison
description: Side-by-side comparison of PCA and t-SNE dimensionality reduction techniques
image: /sims/pca-tsne-compare/pca-tsne-compare.png
og:image: /sims/pca-tsne-compare/pca-tsne-compare.png
twitter:image: /sims/pca-tsne-compare/pca-tsne-compare.png
quality_score: 86
social:
   cards: false
---

# PCA vs t-SNE Comparison

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates the differences between PCA and t-SNE dimensionality reduction techniques by showing the same data reduced with both methods side-by-side.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/pca-tsne-compare/main.html"
        height="552px" width="100%" scrolling="no"></iframe>
```

## Description

### Comparing Reduction Techniques

| Aspect | PCA | t-SNE |
|--------|-----|-------|
| **Preserves** | Global variance | Local neighborhoods |
| **Speed** | Fast | Slower |
| **Deterministic** | Yes | No (random init) |
| **Cluster separation** | Often overlapping | Usually clearer |
| **Distance meaning** | Globally meaningful | Only locally meaningful |

### How to Use

1. **Compare both plots** - Same points, different positions
2. **Click any point** - Selection syncs across both views
3. **Toggle cluster boundaries** - See groupings in each projection
4. **Toggle linked hover** - Hover highlights same point in both

### Visual Elements

- **Left plot**: PCA projection (linear, global structure)
- **Right plot**: t-SNE projection (nonlinear, local structure)
- **Annotations**: Key differences highlighted
- **Synced selection**: Selected point shown in both views

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Compare** PCA and t-SNE dimensionality reduction
2. **Identify** differences in cluster separation
3. **Explain** when to use each technique

## Lesson Plan

### Introduction (5 minutes)
- Review why we reduce dimensions (visualization, exploration)
- Introduce PCA as "find directions of maximum variance"
- Introduce t-SNE as "preserve local neighborhoods"

### Comparative Analysis (15 minutes)
1. Look at both plots without cluster boundaries
2. Enable cluster boundaries - which shows clearer separation?
3. Click different points, observe their neighborhoods
4. Notice: Math cluster overlaps in PCA but separates in t-SNE

### Critical Thinking (10 minutes)
- Why might clusters overlap in PCA?
- Why does t-SNE create clearer separation?
- What information is lost in each projection?
- Can you trust distances between clusters in t-SNE?

### Discussion (5 minutes)
- When would you use PCA? (Quick overview, reproducibility)
- When would you use t-SNE? (Cluster exploration, publication figures)
- What about UMAP? (Another popular alternative)

## References

- [Embeddings and Semantic Search](../../chapters/08-embeddings-semantic-search/index.md)
- [PCA (Wikipedia)](https://en.wikipedia.org/wiki/Principal_component_analysis)
- [t-SNE (Wikipedia)](https://en.wikipedia.org/wiki/T-distributed_stochastic_neighbor_embedding)
