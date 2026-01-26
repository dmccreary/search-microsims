---
title: Boolean Query Builder
description: Interactive tool for constructing boolean search queries with AND, OR, NOT operators and Venn diagram visualization
image: /sims/boolean-query-builder/boolean-query-builder.png
og:image: /sims/boolean-query-builder/boolean-query-builder.png
twitter:image: /sims/boolean-query-builder/boolean-query-builder.png
quality_score: 86
social:
   cards: false
---

# Boolean Query Builder

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim helps you understand boolean search by visually constructing queries with AND, OR, and NOT operators.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/boolean-query-builder/main.html"
        height="552px" width="100%" scrolling="no"></iframe>
```

## Description

### Boolean Operators

| Operator | Symbol | Effect | Example |
|----------|--------|--------|---------|
| **AND** | ∩ | Both terms required | `physics AND simulation` |
| **OR** | ∪ | Either term acceptable | `pendulum OR wave` |
| **NOT** | ¬ | Exclude term | `wave NOT ocean` |

### How to Use

1. **Enter search terms** in the text fields (up to 3)
2. **Select operators** (AND/OR) between terms
3. **Check NOT boxes** to exclude terms
4. **Watch the Venn diagram** show which regions match
5. **See matching results** from the sample database
6. **Load presets** to see common query patterns

### Preset Examples

| Preset | Query | Purpose |
|--------|-------|---------|
| Basic AND | `physics AND simulation` | Require both terms |
| Synonym OR | `pendulum OR wave` | Accept either term |
| Exclusion | `wave AND physics NOT ocean` | Exclude unwanted matches |
| Complex | `(pendulum OR physics) NOT art` | Combined logic |

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Construct** boolean search queries using AND, OR, and NOT
2. **Visualize** query logic using Venn diagrams
3. **Predict** which documents match complex queries

## Lesson Plan

### Introduction (5 minutes)
- Explain why simple keyword search isn't always enough
- Introduce the three boolean operators

### Hands-On Building (15 minutes)
1. Start with "Basic AND" preset - observe results
2. Change operator to OR - what happens to result count?
3. Add NOT to the third term - how does this filter?
4. Try "Complex" preset - trace the logic

### Practice Problems (10 minutes)
Give students scenarios and have them build queries:
- "Find physics simulations about pendulums, not art projects"
- "Find anything about waves OR oscillations"
- "Find physics content that isn't videos"

### Discussion (5 minutes)
- When is AND more useful than OR?
- What are the dangers of using NOT too broadly?
- How do parentheses change query meaning?

## References

- [Search Fundamentals](../../chapters/06-search-fundamentals/index.md)
- [Boolean Logic](https://en.wikipedia.org/wiki/Boolean_algebra)
- [Boolean Search on Google](https://support.google.com/websearch/answer/2466433)
