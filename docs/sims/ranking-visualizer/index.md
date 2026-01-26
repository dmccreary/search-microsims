---
title: Ranking Score Visualizer
description: Interactive visualization showing how different ranking signals combine to determine search result order with adjustable weights
image: /sims/ranking-visualizer/ranking-visualizer.png
og:image: /sims/ranking-visualizer/ranking-visualizer.png
twitter:image: /sims/ranking-visualizer/ranking-visualizer.png
quality_score: 87
social:
   cards: false
---

# Ranking Score Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates how search engines combine multiple ranking signals to determine which results appear first.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/ranking-visualizer/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## Description

### Ranking Signals

| Signal | Description | Example Impact |
|--------|-------------|----------------|
| **Term Frequency** | How often query terms appear | "pendulum" appears 5× scores higher |
| **Title Match** | Query terms in title | Title match beats description-only |
| **Subject Match** | Topic alignment | Physics query + physics sim = boost |
| **Freshness** | How recently updated | 2026 scores higher than 2022 |
| **Popularity** | Usage metrics | High views = higher rank |

### How to Use

1. **Adjust weight sliders** to change how much each signal matters
2. **Watch results reorder** as weights change (smooth animation)
3. **Toggle "Show Breakdown"** to see stacked score contributions
4. **Click "Equal Weights"** to see balanced ranking
5. **Click "Reset Defaults"** to return to typical weights

### Key Insights

- **Small weight changes** can dramatically shift rankings
- **Title matches** often matter more than you'd expect
- **Freshness** can override content quality
- **Combined signals** produce nuanced rankings

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Interpret** how different ranking signals contribute to final scores
2. **Experiment** with signal weights to understand ranking behavior
3. **Predict** how changing priorities affects result ordering

## Lesson Plan

### Introduction (5 minutes)
- Ask: "Why does Google show certain results first?"
- Discuss that ranking is not just keyword matching

### Signal Exploration (10 minutes)
1. Set all weights to 0 except Term Frequency
2. Observe which results rank highest
3. Repeat for each signal alone
4. Discuss: Which single signal works best?

### Combined Ranking (10 minutes)
1. Use "Equal Weights" preset
2. Gradually increase Title Match weight
3. Watch "Pendulum Art Generator" move up despite being Art, not Physics
4. Discuss: Should title match override subject relevance?

### Real-World Application (5 minutes)
- How might e-commerce sites weight signals differently?
- How might academic search weight freshness vs popularity?
- What happens when users can game certain signals?

## References

- [Search Fundamentals](../../chapters/06-search-fundamentals/index.md)
- [BM25 Ranking Algorithm](https://en.wikipedia.org/wiki/Okapi_BM25)
- [Learning to Rank](https://en.wikipedia.org/wiki/Learning_to_rank)
