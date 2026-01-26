---
title: Inverted Index Visualizer
description: Interactive visualization showing how inverted indexes enable fast search by mapping terms to document IDs
image: /sims/inverted-index-viz/inverted-index-viz.png
og:image: /sims/inverted-index-viz/inverted-index-viz.png
twitter:image: /sims/inverted-index-viz/inverted-index-viz.png
quality_score: 87
social:
   cards: false
---

# Inverted Index Visualizer

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates how inverted indexes enable fast search by mapping terms to the documents containing them.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/inverted-index-viz/main.html"
        height="522px" width="100%" scrolling="no"></iframe>
```

## Description

### What is an Inverted Index?

Instead of storing "Document → Words", an inverted index stores "Word → Documents":

| Traditional | Inverted Index |
|-------------|----------------|
| Doc1: [pendulum, physics, simulation] | pendulum: [Doc1, Doc3] |
| Doc2: [wave, visualization] | physics: [Doc1, Doc2] |
| Doc3: [pendulum, motion] | wave: [Doc2] |

### How to Use

1. **View documents** on the left panel
2. **Click terms** in the index to highlight which documents contain them
3. **Enter a query** and click "Trace Query" to see the lookup process
4. **Add more documents** to see the index grow
5. **Click "Build Index"** to watch index construction

### Why Inverted Indexes?

| Without Index | With Inverted Index |
|---------------|---------------------|
| Read every document | Look up term directly |
| O(n) time complexity | O(1) lookup time |
| Slow for large collections | Fast for any size |
| Scales poorly | Scales excellently |

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Explain** how inverted indexes map terms to documents
2. **Trace** query lookups through the inverted index
3. **Compare** index-based search vs linear scan

## Lesson Plan

### Introduction (5 minutes)
- Analogy: Back-of-book index vs reading every page
- Why search engines can't read every document for every query

### Index Construction (10 minutes)
1. Start with 3 documents
2. Click "Build Index" to watch construction
3. Add documents and observe index growth
4. Discuss: Why are some posting lists longer?

### Query Tracing (10 minutes)
1. Enter query "pendulum wave"
2. Click "Trace Query"
3. Observe how terms are looked up
4. See intersection of posting lists (AND search)

### Discussion Questions (5 minutes)
- What happens to the index when you add a new document?
- Why is updating an inverted index potentially expensive?
- How might you handle synonyms in an inverted index?

## References

- [Search Fundamentals](../../chapters/06-search-fundamentals/index.md)
- [Inverted Index on Wikipedia](https://en.wikipedia.org/wiki/Inverted_index)
- [How Search Engines Index the Web](https://www.google.com/search/howsearchworks/how-search-works/organizing-information/)
