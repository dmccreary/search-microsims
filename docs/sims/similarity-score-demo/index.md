---
title: Similarity Score Interface Demo
description: Compare different ways to display similarity scores in user interfaces
image: /sims/similarity-score-demo/similarity-score-demo.png
og:image: /sims/similarity-score-demo/similarity-score-demo.png
twitter:image: /sims/similarity-score-demo/similarity-score-demo.png
quality_score: 82
social:
   cards: false
---

# Similarity Score Interface Demo

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates different approaches to displaying similarity scores, helping students evaluate which presentation format provides the best user experience.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/similarity-score-demo/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## Description

### Display Format Comparison

| Format | Pros | Cons |
|--------|------|------|
| **Percentages** | Precise, familiar | May imply false precision |
| **Categories** | Easy to understand | Loses nuance |
| **Color Bars** | Visual, quick scanning | Needs context |
| **Combined** | Comprehensive | More complex |

### How to Use

1. **Compare the four columns** showing the same data differently
2. **Click a column** to mark it as your preferred display
3. **Adjust the threshold slider** to see how items below threshold fade
4. **Change the source MicroSim** to see different recommendation sets
5. **Select a preferred display** using the radio buttons

### Score Categories

| Score Range | Category | Color |
|-------------|----------|-------|
| 85%+ | Very Similar | Green |
| 70-84% | Related | Yellow |
| 55-69% | Somewhat Related | Orange |
| <55% | Weakly Related | Gray |

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Judge** the usefulness of different similarity score displays
2. **Compare** presentation formats for user experience
3. **Recommend** appropriate display formats for different contexts

## Lesson Plan

### Introduction (5 minutes)
- Discuss why similarity scores need to be presented to users
- Explain the trade-off between precision and clarity
- Introduce the four display formats

### Comparative Analysis (15 minutes)
1. Look at the same data in all four formats
2. Which format makes it easiest to:
   - Find the most similar item?
   - Understand the relative ranking?
   - Decide whether to click?
3. Discuss cognitive load of each format

### Threshold Exploration (10 minutes)
- Adjust threshold from 50% to 100%
- Observe how items fade below threshold
- Discuss: What threshold would you recommend?

### Design Discussion (5 minutes)
- When would you use percentages vs. categories?
- How does context affect the best choice?
- What would you combine for an ideal display?

## References

- [Embeddings and Semantic Search](../../chapters/08-embeddings-semantic-search/index.md)
- [User Interface Design Principles](https://www.nngroup.com/articles/)
