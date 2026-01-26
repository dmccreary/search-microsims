---
title: Layout Patterns
description: Interactive gallery showing Fixed, Two-Panel, and Three-Panel MicroSim layout patterns with live examples and comparison table
image: /sims/layout-patterns/layout-patterns.png
og:image: /sims/layout-patterns/layout-patterns.png
twitter:image: /sims/layout-patterns/layout-patterns.png
quality_score: 88
social:
   cards: false
---

# MicroSim Layout Pattern Gallery

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim helps designers choose the appropriate layout pattern for their educational simulations.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/layout-patterns/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## Description

The Layout Patterns gallery presents three standard MicroSim layout approaches:

### Layout Types

1. **Fixed Layout**
   - Single area with minimal structure
   - Controls overlay or sit below visualization
   - Maximum space for visualization
   - Best for: Simple animations, demos, mobile-first designs

2. **Two-Panel Layout**
   - Visualization area + Control panel side-by-side
   - Clear separation of view and controls
   - Most common MicroSim layout
   - Best for: Parameter exploration, most simulations

3. **Three-Panel Layout**
   - Visualization + Controls + Information/Output panel
   - Dedicated area for data display and feedback
   - Best for: Complex labs, data-rich simulations

### Interactive Features

- Click any layout to select it and see details
- Toggle "Show Mobile View" to see responsive behavior
- Live animated pendulum in each mini-example
- Comparison table with color-coded ratings

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Select** the appropriate layout pattern for a given scenario
2. **Compare** trade-offs between visualization space and control capacity
3. **Apply** layout patterns to their own MicroSim designs

## Lesson Plan

### Introduction (5 minutes)
- Discuss why layout matters in educational software
- Show examples of good and poor layouts in familiar apps

### Exploration (10 minutes)
1. Examine each layout type's structure
2. Toggle mobile view to understand responsive design
3. Review the comparison table for trade-offs

### Design Activity (15 minutes)
1. Present 3 different MicroSim scenarios:
   - A simple pendulum demonstration
   - A chemistry reaction simulator with multiple parameters
   - A physics lab with real-time data output
2. Have students choose and justify their layout selection

### Discussion (5 minutes)
- Share layout choices and reasoning
- Discuss how audience (mobile vs desktop) affects decisions

## References

- [User Interface Controls](../../chapters/13-user-interface-controls/index.md)
- [Responsive Design](../../chapters/14-technical-implementation/index.md)
