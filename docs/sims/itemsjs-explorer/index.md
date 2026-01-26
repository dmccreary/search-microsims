---
title: ItemsJS API Explorer
description: Interactive explorer showing how to construct and execute ItemsJS search queries
image: /sims/itemsjs-explorer/itemsjs-explorer.png
og:image: /sims/itemsjs-explorer/itemsjs-explorer.png
twitter:image: /sims/itemsjs-explorer/itemsjs-explorer.png
quality_score: 84
social:
   cards: false
---

# ItemsJS API Explorer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates how to use the ItemsJS library for faceted search by providing an interactive query builder that generates and executes search code in real-time.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/itemsjs-explorer/main.html"
        height="552px" width="100%" scrolling="no"></iframe>
```

## Description

### Understanding the ItemsJS API

ItemsJS is a client-side faceted search library that provides:

| Feature | Description |
|---------|-------------|
| **Full-text search** | Search across configured text fields |
| **Faceted filtering** | Filter by multiple categories |
| **Aggregations** | Count items per facet value |
| **Pagination** | Handle large result sets |

### How to Use

1. **Enter a search query** - Click the query box to type a text search
2. **Select facet filters** - Check boxes to filter by Subject, Grade, or Framework
3. **View generated code** - See the ItemsJS search() call update in real-time
4. **Switch result tabs** - View Items, Aggregations, or Raw JSON
5. **Execute Search** - Run the query to see results
6. **Copy Code** - Copy the generated code for your own project

### Visual Elements

- **Query Builder Panel** - Build search parameters interactively
- **Code Preview** - Live-updating search() function call
- **Results Viewer** - Tabbed display of search results
- **Aggregation Bars** - Visual counts per facet value

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Implement** search queries using the ItemsJS API
2. **Construct** search parameters with filters and sorting
3. **Interpret** the data structure returned by ItemsJS

## Lesson Plan

### Introduction (5 minutes)
- Explain client-side search libraries
- Introduce ItemsJS as a faceted search solution
- Discuss when to use client-side vs server-side search

### Hands-On Exploration (15 minutes)
1. Start with an empty query - observe all results
2. Add a text search term - watch results filter
3. Add facet filters - see intersection of conditions
4. Examine the Aggregations tab - understand counts
5. View Raw JSON - see the complete response structure

### Code Analysis Activity (10 minutes)
- Copy the generated code
- Discuss each parameter:
  - `query`: Full-text search term
  - `filters`: Object mapping facets to selected values
  - `sort`: Ordering option
  - `per_page`: Results per page
- Predict what happens with different combinations

### Discussion (5 minutes)
- How does ItemsJS differ from server-side search?
- What are the limitations of client-side search?
- When is ItemsJS the right choice?

## References

- [Faceted Search Chapter](../../chapters/07-faceted-search-client-side/index.md)
- [ItemsJS Documentation](https://github.com/itemsapi/itemsjs)
- [ItemsJS NPM Package](https://www.npmjs.com/package/itemsjs)
