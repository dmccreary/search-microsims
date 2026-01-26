---
title: Information Retrieval Pipeline
description: Interactive visualization showing the five stages of search - from user query through processing, index lookup, matching, ranking, to results display
image: /sims/ir-pipeline/ir-pipeline.png
og:image: /sims/ir-pipeline/ir-pipeline.png
twitter:image: /sims/ir-pipeline/ir-pipeline.png
quality_score: 85
social:
   cards: false
---

# Information Retrieval Pipeline

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim visualizes the complete information retrieval pipeline, showing how a search query flows through five stages from user input to displayed results.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/ir-pipeline/main.html"
        height="452px" width="100%" scrolling="no"></iframe>
```

## Description

The Information Retrieval Pipeline demonstrates the core stages of modern search systems:

### Pipeline Stages

| Stage | Function | Example |
|-------|----------|---------|
| **User Query** | User enters search terms | "physics pendulum simulation" |
| **Query Processing** | Tokenize, normalize, remove stopwords | ["physics", "pendulum", "simulation"] |
| **Index Lookup** | Search pre-built inverted index | Find document IDs for each term |
| **Matching** | Identify documents containing terms | Found 47 potential matches |
| **Ranking** | Score and sort by relevance | Order by TF-IDF or BM25 scores |
| **Search Results** | Display top results | Top 10 with titles and descriptions |

### How to Use

1. **Click "Trace Query"** to animate a sample query through all stages
2. **Click "Step →"** to advance one stage at a time
3. **Click any stage** to see detailed information about what happens there
4. **Hover over stages** to see brief descriptions
5. **Click "Reset"** to start over

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Explain** the five stages of information retrieval
2. **Trace** how a search query moves through the pipeline
3. **Identify** the purpose of each stage in the search process

## Lesson Plan

### Introduction (5 minutes)
- Ask students: "What happens when you search Google?"
- Discuss that search seems instant but involves multiple steps

### Pipeline Exploration (10 minutes)
1. Use "Step →" to walk through each stage slowly
2. Click each stage to explore the details
3. Discuss what each stage contributes

### Trace Activity (10 minutes)
1. Click "Trace Query" to watch the full animation
2. Have students describe what happens at each step
3. Discuss: Which stage do you think takes the most time?

### Discussion Questions (5 minutes)
- Why is the index pre-built rather than created at search time?
- How does ranking affect what you actually see?
- What would happen without the matching stage?

## References

- [Search Fundamentals](../../chapters/06-search-fundamentals/index.md)
- [Information Retrieval on Wikipedia](https://en.wikipedia.org/wiki/Information_retrieval)
- [How Search Works - Google](https://www.google.com/search/howsearchworks/)
