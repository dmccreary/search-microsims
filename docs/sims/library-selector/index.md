---
title: Library Selector
description: Interactive decision tree to help select the right JavaScript visualization library for different needs - p5.js, Chart.js, Plotly, vis-network, Leaflet, Mermaid
image: /sims/library-selector/library-selector.png
og:image: /sims/library-selector/library-selector.png
twitter:image: /sims/library-selector/library-selector.png
quality_score: 88
social:
   cards: false
---

# JavaScript Library Selector

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim guides you through selecting the right JavaScript library for your visualization needs.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/library-selector/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## Description

The Library Selector presents a decision tree that helps you choose among seven popular visualization libraries:

### Available Libraries

| Library | Best For | Size |
|---------|----------|------|
| **p5.js** | Animations, simulations, creative coding | ~800KB |
| **Chart.js** | Bar, line, pie, radar charts | ~200KB |
| **Plotly.js** | Scientific plots, 3D visualizations | ~3MB |
| **vis-network** | Node-edge graphs, concept maps | ~500KB |
| **vis-timeline** | Timelines, schedules, events | ~400KB |
| **Leaflet.js** | Maps, geographic data | ~150KB |
| **Mermaid.js** | Flowcharts, diagrams from text | ~2MB |

### How to Use

1. Answer the question about what you need to visualize
2. Follow the decision path based on your requirements
3. Receive a library recommendation with details
4. Click library cards at the bottom to compare options

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Select** the appropriate JavaScript library for a given visualization task
2. **Compare** library features, sizes, and learning curves
3. **Apply** the decision criteria when starting new projects

## Lesson Plan

### Introduction (5 minutes)
- Discuss why library choice matters (bundle size, learning curve, features)
- Show examples of visualizations from each library

### Decision Tree Activity (10 minutes)
1. Present 3 different scenarios:
   - "I need to show population growth over time as a line chart"
   - "I want to create an interactive pendulum simulation"
   - "I need to visualize relationships between concepts"
2. Have students use the selector to find recommendations

### Comparison Discussion (10 minutes)
- Compare recommendations for similar needs (e.g., Chart.js vs Plotly)
- Discuss trade-offs: simplicity vs features, size vs capability

### Practical Application (5 minutes)
- Students identify their own upcoming project needs
- Use the selector to choose a starting library

## References

- [Technical Implementation](../../chapters/14-technical-implementation/index.md)
- [p5.js](https://p5js.org/)
- [Chart.js](https://www.chartjs.org/)
- [Plotly.js](https://plotly.com/javascript/)
- [vis-network](https://visjs.github.io/vis-network/)
- [Leaflet](https://leafletjs.com/)
- [Mermaid](https://mermaid.js.org/)
