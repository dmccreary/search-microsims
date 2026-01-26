---
title: Precision-Recall Trade-off Explorer
description: Interactive Venn diagram visualization demonstrating how search specificity affects precision and recall metrics with real-time calculation
image: /sims/precision-recall-explorer/precision-recall-explorer.png
og:image: /sims/precision-recall-explorer/precision-recall-explorer.png
twitter:image: /sims/precision-recall-explorer/precision-recall-explorer.png
quality_score: 88
social:
   cards: false
---

# Precision-Recall Trade-off Explorer

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim helps you understand the fundamental trade-off between precision and recall in information retrieval through an interactive Venn diagram visualization.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/precision-recall-explorer/main.html"
        height="522px" width="100%" scrolling="no"></iframe>
```

## Description

### Key Concepts Visualized

| Metric | Formula | Meaning |
|--------|---------|---------|
| **Precision** | True Positives / Retrieved | What fraction of results are relevant? |
| **Recall** | True Positives / Total Relevant | What fraction of relevant items did we find? |
| **F1 Score** | 2 × (P × R) / (P + R) | Harmonic mean balancing both metrics |

### Venn Diagram Regions

- **Blue circle**: All retrieved search results
- **Green circle**: All relevant documents in the collection
- **Purple overlap**: True positives (relevant AND retrieved)
- **Blue only**: False positives (retrieved but not relevant)
- **Green only**: False negatives (relevant but not retrieved)

### How to Use

1. **Drag the Specificity slider** to see how search precision affects results
2. **Watch the metrics update** in real-time as the Venn diagram changes
3. **Click preset buttons** to jump to common scenarios
4. **Toggle "Show Formulas"** to see the calculation details
5. **Click "Animate"** to see document particles moving in regions

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Examine** the trade-off between precision and recall
2. **Calculate** precision, recall, and F1 score from search results
3. **Predict** how changing search specificity affects metrics

## Lesson Plan

### Introduction (5 minutes)
- Define precision: "Of what we found, how much was useful?"
- Define recall: "Of what exists, how much did we find?"
- Real-world analogy: fishing with different sized nets

### Exploration Activity (10 minutes)
1. Start with the "Balanced" preset
2. Move slider slowly to "High Precision" - what happens?
3. Move slider to "High Recall" - what changes?
4. Discuss: Why can't we maximize both?

### Analysis Questions (10 minutes)
- When would you want high precision? (Limited time, need accuracy)
- When would you want high recall? (Comprehensive research, audits)
- What's a good F1 score? (Depends on use case)

### Hands-On Calculation (5 minutes)
1. Set a specific slider position
2. Have students calculate precision and recall manually
3. Compare with displayed values

## References

- [Search Fundamentals](../../chapters/06-search-fundamentals/index.md)
- [Precision and Recall on Wikipedia](https://en.wikipedia.org/wiki/Precision_and_recall)
- [F1 Score Explained](https://en.wikipedia.org/wiki/F-score)
