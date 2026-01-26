---
title: Client-Side Search Architecture
description: Interactive diagram showing data flow from static server through browser components to user in client-side search systems
image: /sims/client-side-architecture/client-side-architecture.png
og:image: /sims/client-side-architecture/client-side-architecture.png
twitter:image: /sims/client-side-architecture/client-side-architecture.png
quality_score: 86
social:
   cards: false
---

# Client-Side Search Architecture

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim visualizes the architecture of client-side search systems, showing how data flows from static file servers through browser components to deliver instant search results.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/client-side-architecture/main.html"
        height="452px" width="100%" scrolling="no"></iframe>
```

## Description

### Architecture Components

| Component | Role | Details |
|-----------|------|---------|
| **Static Server** | Host files | GitHub Pages, Netlify, any web host |
| **Data Layer** | Store data | JSON loaded into browser memory |
| **Search Engine** | Process queries | ItemsJS runs entirely in browser |
| **UI Components** | User interface | Search box, facets, results display |
| **User** | Interact | Queries and views results |

### Key Data Flows

1. **One-time load** (dashed green): Server sends JSON data on page load
2. **Internal processing** (blue dashed): Data moves through browser components
3. **User interaction** (orange): Bidirectional instant communication

### Why Client-Side Search?

| Advantage | Explanation |
|-----------|-------------|
| **No server costs** | Static hosting is free or very cheap |
| **Instant results** | No network latency for queries |
| **Works offline** | After initial load, no internet needed |
| **Privacy** | Queries never leave user's device |
| **Scalable** | Each user's browser does the work |

### How to Use

1. **Click "Animate Data Flow"** to see particles moving through the system
2. **Hover over components** to highlight them
3. **Read the annotations** at the bottom for key insights

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Explain** the data flow in client-side search
2. **Identify** the browser components involved in search
3. **Compare** client-side vs server-side search architectures

## Lesson Plan

### Introduction (5 minutes)
- Ask: "When you search Google, where does the search happen?"
- Contrast with client-side: search happens in YOUR browser

### Architecture Exploration (10 minutes)
1. Animate data flow and trace the path
2. Discuss the one-time load vs continuous interaction
3. Identify the bottleneck (initial JSON download)

### Comparison Activity (10 minutes)
Create a table comparing client-side vs server-side:
- Where is data stored?
- Where does search execute?
- What happens with no internet?
- Who pays for computation?

### Design Discussion (5 minutes)
- When is client-side search appropriate?
- When would you need server-side?
- What's the maximum reasonable JSON size?

## References

- [Faceted Search](../../chapters/07-faceted-search-client-side/index.md)
- [ItemsJS Library](https://github.com/itemsapi/itemsjs)
- [JAMstack Architecture](https://jamstack.org/)
