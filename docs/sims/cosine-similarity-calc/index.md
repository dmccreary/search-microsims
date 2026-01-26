---
title: Cosine Similarity Calculator
description: Interactive calculator showing how cosine similarity measures the angle between vectors
image: /sims/cosine-similarity-calc/cosine-similarity-calc.png
og:image: /sims/cosine-similarity-calc/cosine-similarity-calc.png
twitter:image: /sims/cosine-similarity-calc/cosine-similarity-calc.png
quality_score: 88
social:
   cards: false
---

# Cosine Similarity Calculator

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates how cosine similarity measures relatedness between vectors by showing the step-by-step calculation and allowing interactive manipulation of vector components.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/cosine-similarity-calc/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## Description

### The Cosine Similarity Formula

$$\text{cosine similarity}(A, B) = \frac{A \cdot B}{|A| \times |B|}$$

| Component | Meaning |
|-----------|---------|
| **A · B** | Dot product (multiply and sum components) |
| **\|A\|** | Magnitude (length) of vector A |
| **\|B\|** | Magnitude (length) of vector B |
| **Result** | Value from -1 to 1 |

### How to Use

1. **Drag vector endpoints** to change their direction
2. **Watch the angle** update between vectors
3. **Follow the calculation steps** on the right panel
4. **Use presets** to see special cases:
   - Identical (similarity = 1)
   - Perpendicular (similarity = 0)
   - Opposite (similarity = -1)
5. **Toggle calculation steps** to show/hide the math

### Interpreting Results

| Score | Interpretation | Color |
|-------|----------------|-------|
| 0.7 - 1.0 | Similar/Related | Green |
| 0.3 - 0.7 | Somewhat related | Yellow |
| -1.0 - 0.3 | Unrelated/Opposite | Red |

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Calculate** cosine similarity between two vectors
2. **Explain** how angle relates to similarity
3. **Predict** similarity values based on vector positions

## Lesson Plan

### Introduction (5 minutes)
- Review vectors and angles
- Explain why direction matters more than length
- Introduce the cosine similarity formula

### Hands-On Calculation (15 minutes)
1. Start with default vectors, trace the calculation
2. Move to "Identical" preset - why is similarity 1?
3. Move to "Perpendicular" - why is similarity 0?
4. Move to "Opposite" - why is similarity -1?
5. Try intermediate positions, predict before calculating

### Connection to Embeddings (10 minutes)
- Embeddings are vectors in 384 dimensions
- Same formula applies in high dimensions
- Cosine similarity ignores magnitude, focuses on direction

### Discussion (5 minutes)
- Why use cosine instead of Euclidean distance?
- When would cosine similarity give unexpected results?

## References

- [Embeddings and Semantic Search](../../chapters/08-embeddings-semantic-search/index.md)
- [Cosine Similarity (Wikipedia)](https://en.wikipedia.org/wiki/Cosine_similarity)
