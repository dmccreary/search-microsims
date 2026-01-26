---
title: Faceted Classification
description: Interactive demonstration of multi-dimensional classification showing how faceted search filters combine to narrow results across Subject, Grade Level, Difficulty, and Type dimensions.
quality_score: 90
image: /sims/faceted-classification/faceted-classification.png
og:image: /sims/faceted-classification/faceted-classification.png
twitter:image: /sims/faceted-classification/faceted-classification.png
social:
   cards: false
---
# Faceted Classification

<iframe src="main.html" height="795px" width="100%" scrolling="no"></iframe>

[Run the Faceted Classification MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit the Faceted Classification MicroSim Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/gZr9kiQ-P)

## About This MicroSim

This interactive demonstration shows how **multi-dimensional classification** enables **faceted search**. A collection of 20 sample MicroSims can be filtered across four dimensions simultaneously:

### Filter Dimensions

1. **Subject** (dropdown) - Physics, Math, Chemistry, Biology
2. **Grade Level** (checkboxes) - Elementary, Middle, High, College
3. **Difficulty** (radio buttons) - Beginner, Intermediate, Advanced
4. **Type** (checkboxes) - Animation, Simulation, Chart, Quiz

### Key Features

- **Real-time filtering**: Results update instantly as you change filters
- **Multi-select support**: Grade Level and Type allow multiple selections
- **Visual feedback**: Cards fade when filtered out, remain bright when matching
- **Match count**: Right panel shows how many items match current filters
- **Active filter badges**: See all active filters at a glance
- **Clear All button**: Reset all filters with one click

### Understanding Faceted Search

Faceted search uses AND logic across dimensions:
- Selecting "Physics" shows only Physics items
- Adding "High" grade level shows Physics items for High School
- Adding "Simulation" type shows Physics Simulations for High School

Each additional filter narrows the results. With no filters active, all 20 items are shown.

## Embed This MicroSim

Place the following line in your website to include this MicroSim:

```html
<iframe src="https://dmccreary.github.io/microsim-search/sims/faceted-classification/main.html" height="502px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

By the end of this lesson, students will be able to:

1. **Demonstrate** how multi-dimensional classification enables faceted search
2. **Predict** how adding filters affects result sets
3. **Explain** the difference between single-select and multi-select filters
4. **Apply** faceted search concepts to find specific resources

### Suggested Activities

**Activity 1: Filter Exploration (5 minutes)**
Start with all filters cleared. Progressively add one filter at a time and observe how the count changes. Discuss: Why does adding filters typically reduce results?

**Activity 2: Find the Match Challenge (10 minutes)**
Give students specific criteria (e.g., "Find all Advanced Chemistry items") and have them set filters to find matching items. Compare strategies - which order of filters works best?

**Activity 3: Multi-Select vs Single-Select (5 minutes)**
Compare Grade Level (multi-select checkboxes) with Difficulty (single-select radio buttons). When would you want each type? Why is Subject a dropdown instead of checkboxes?

**Activity 4: Empty Results Investigation (5 minutes)**
Challenge students to find filter combinations that result in zero matches. What does this tell us about the sample data? How would a real system handle this?

### Discussion Questions

1. Why do real search systems show the count of results for each filter option?
2. How is faceted search different from keyword search?
3. What other dimensions might be useful for filtering MicroSims?
4. How does color-coding by subject help users understand the results?

### Assessment Questions

1. If you select "Physics" and "Math" subjects (if multi-select were available), would you get MORE or FEWER results than selecting just "Physics"? Why?
2. Why do inactive filters (checkboxes with nothing selected) show all items instead of no items?
3. Design a fifth filter dimension that would be useful for educational resources.

## Sample Data

The MicroSim includes 20 sample items distributed across:

| Subject | Count |
|---------|-------|
| Physics | 5 |
| Math | 5 |
| Chemistry | 5 |
| Biology | 5 |

Each item has varied combinations of Grade Level, Difficulty, and Type to demonstrate meaningful filtering.

## References

- [Faceted Search (Wikipedia)](https://en.wikipedia.org/wiki/Faceted_search)
- [Chapter 7: Faceted Search](../../chapters/07-faceted-search-client-side/)
- [ItemsJS - Client-Side Faceted Search](https://itemsjs.com/)
