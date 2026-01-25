---
title: Faceted Search and Client-Side Search
description: Learn to implement powerful faceted filtering and instant browser-based search using ItemsJS for MicroSim discovery
generated_by: claude skill chapter-content-generator
date: 2026-01-24 17:15:00
version: 0.03
reading_level: college
---

# Faceted Search and Client-Side Search

## Summary

This chapter covers faceted search implementation and lightweight client-side search techniques for MicroSim discovery. You'll learn how facets enable users to filter results by multiple dimensions, how to implement filter controls, and how to use the ItemsJS library for browser-based search without a backend server. The chapter also covers inverted indexes and introduces semantic search concepts. After completing this chapter, students will be able to implement faceted search interfaces for MicroSim collections.

## Concepts Covered

This chapter covers the following 8 concepts from the learning graph:

1. Faceted Search
2. Facets
3. Filter Controls
4. Lightweight Search
5. Client-Side Search
6. ItemsJS Library
7. Inverted Index
8. Semantic Search

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Metadata Fundamentals](../03-metadata-fundamentals/index.md)
- [Chapter 6: Search Fundamentals](../06-search-fundamentals/index.md)

---

## Beyond Keywords: The Power of Faceted Search

Remember the last time you shopped online? You probably didn't just type "shoes" and hope for the best. You filtered by size, color, brand, price range, and style. Within seconds, you narrowed thousands of options to exactly what you wanted. That's faceted search in action—and it's about to become your superpower for finding MicroSims.

Faceted search transforms the educational resource discovery experience. Instead of crafting the perfect boolean query (remember `(physics OR chemistry) AND undergraduate NOT video`?), teachers can simply click checkboxes: Physics ✓, Undergraduate ✓, Interactive Simulation ✓. The system does the heavy lifting, and the right MicroSims appear instantly.

This chapter takes you from understanding facets to implementing a complete client-side search system. By the end, you'll be able to build search interfaces that run entirely in the browser—no servers required—making MicroSim search accessible to anyone, anywhere. That's the kind of technology that transforms education.

---

## What Are Facets?

A **facet** is a distinct dimension or category by which items can be classified and filtered. Think of facets as different "lenses" for viewing your collection. Each facet represents a different way to slice and dice your data.

For MicroSims, common facets include:

| Facet | Description | Example Values |
|-------|-------------|----------------|
| **Subject Area** | Academic discipline | Physics, Chemistry, Mathematics, Biology |
| **Grade Level** | Target audience | K-12, Undergraduate, Graduate, Adult |
| **Difficulty** | Complexity level | Beginner, Intermediate, Advanced |
| **Framework** | Technical implementation | p5.js, D3.js, Three.js, Chart.js |
| **Visualization Type** | Kind of interactive | Simulation, Animation, Chart, Diagram |
| **Bloom's Level** | Cognitive objective | Remember, Understand, Apply, Analyze |

Each facet provides a different perspective on the same collection. A physics professor might filter by Subject Area first, while a web developer might start with Framework. Faceted search accommodates different user needs without requiring complex query syntax.

### Facets vs. Keywords

How do facets differ from keyword search?

| Aspect | Keyword Search | Faceted Search |
|--------|----------------|----------------|
| **User Input** | Type search terms | Click/select options |
| **Matching** | Text contains words | Exact category match |
| **Discovery** | Must know terminology | Browse available options |
| **Precision** | Variable | High (controlled vocabulary) |
| **Learning Curve** | Requires query skills | Intuitive point-and-click |

The magic happens when you combine both: keyword search for free-text exploration, facets for precise filtering. Search for "wave" to find wave-related simulations, then filter by Grade Level: Undergraduate and Framework: p5.js. Best of both worlds.

!!! tip "Facets Reveal What's Available"
    One underappreciated benefit of faceted search: users see what options exist. If the Grade Level facet shows "K-12 (45), Undergraduate (120), Graduate (23)", users immediately understand the collection's composition. Facets educate while they filter.

---

## Faceted Search: The Complete Picture

**Faceted search** (also called faceted navigation or guided navigation) is a search technique that combines traditional text search with a faceted classification system. Users can progressively narrow results by selecting values from multiple facets, with the system updating counts and results in real-time.

### The Faceted Search Experience

Here's what happens when a user interacts with faceted search:

1. **Initial State**: All MicroSims displayed, facets show total counts
2. **Select Facet Value**: User clicks "Physics" under Subject Area
3. **Results Update**: Only physics MicroSims shown
4. **Counts Recalculate**: Other facets update to show counts within physics
5. **Select Another Facet**: User clicks "Undergraduate" under Grade Level
6. **Further Narrowing**: Results show only undergraduate physics MicroSims
7. **Continue Refining**: Process repeats until desired results found

This progressive refinement feels natural—like drilling down through a well-organized file system, but smarter.

### Anatomy of a Faceted Search Interface

A typical faceted search interface has three main regions:

```
┌─────────────────────────────────────────────────────────────┐
│  [Search Box: "wave interference"                    🔍]    │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  FACET PANEL     │     SEARCH RESULTS                       │
│                  │                                          │
│  Subject Area    │  ┌─────────────────────────────────┐     │
│  ☑ Physics (45)  │  │ Wave Interference Simulator     │     │
│  ☐ Chemistry (12)│  │ Physics | Undergraduate | p5.js │     │
│  ☐ Math (8)      │  └─────────────────────────────────┘     │
│                  │                                          │
│  Grade Level     │  ┌─────────────────────────────────┐     │
│  ☐ K-12 (15)     │  │ Double Slit Experiment          │     │
│  ☑ Undergrad (28)│  │ Physics | Undergraduate | p5.js │     │
│  ☐ Graduate (2)  │  └─────────────────────────────────┘     │
│                  │                                          │
│  Framework       │  ┌─────────────────────────────────┐     │
│  ☑ p5.js (18)    │  │ Standing Wave Visualizer        │     │
│  ☐ D3.js (6)     │  │ Physics | Undergraduate | p5.js │     │
│  ☐ Three.js (4)  │  └─────────────────────────────────┘     │
│                  │                                          │
│  [Clear Filters] │     Showing 18 of 450 results           │
│                  │     Page 1 of 2  [1] [2] [Next]         │
└──────────────────┴──────────────────────────────────────────┘
```

### Key Features of Effective Faceted Search

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Live Counts** | Numbers update as filters applied | Users see impact before clicking |
| **Multi-select** | Choose multiple values per facet | "Show Physics OR Chemistry" |
| **Clear Filters** | One-click reset | Easy recovery from dead ends |
| **Active Filter Display** | Show what's currently selected | Always know current state |
| **Zero-result Prevention** | Disable options leading to no results | Avoid frustration |

#### Diagram: Faceted Search Interface Simulator

<iframe src="../../sims/faceted-search-simulator/main.html" width="100%" height="600px" scrolling="no"></iframe>

<details markdown="1">
<summary>Faceted Search Interface Simulator</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: use

Learning Objective: Students will use faceted search to filter a MicroSim collection by applying multiple facet selections and observing how results and counts update dynamically.

Canvas layout:
- Left panel (30%): Facet filters
- Right panel (70%): Search results grid

Visual elements:
- Search box at top with magnifying glass icon
- Four facet groups in left panel:
  - Subject Area (checkboxes with counts)
  - Grade Level (checkboxes with counts)
  - Framework (checkboxes with counts)
  - Difficulty (checkboxes with counts)
- Results displayed as cards showing:
  - Title
  - Subject badge
  - Grade level badge
  - Framework badge
  - Brief description
- Active filters displayed as removable chips above results
- Result count and pagination at bottom

Sample data (20 MicroSims):
- Physics simulations (8): wave, pendulum, projectile, circuits, etc.
- Chemistry simulations (5): molecular, reactions, periodic table
- Math simulations (4): graphing, geometry, statistics
- Biology simulations (3): ecosystem, cells, genetics

Interactive controls:
- Checkbox for each facet value
- Search input with real-time filtering
- "Clear All Filters" button
- Click "X" on active filter chips to remove
- Click result card to show detail modal

Behavior:
- Selecting any facet immediately filters results
- Counts update dynamically for all facets
- Multiple selections within same facet = OR logic
- Selections across different facets = AND logic
- Search box filters by title and description text
- Zero-count options shown grayed out but still visible

Animation:
- Smooth fade transition when results update
- Counts animate when changing
- Filter chips slide in/out

Default state: All filters cleared, all 20 MicroSims showing

Implementation: p5.js with simulated faceted search logic
</details>

---

## Filter Controls: The User Interface of Facets

**Filter controls** are the UI components that allow users to interact with facets. The design of these controls significantly impacts usability. Different control types suit different facet characteristics.

### Types of Filter Controls

| Control Type | Best For | Example |
|--------------|----------|---------|
| **Checkboxes** | Multi-select categorical | Subject Area, Framework |
| **Radio Buttons** | Single-select categorical | Difficulty level |
| **Range Sliders** | Numeric ranges | Year published, Quality score |
| **Dropdown** | Long lists, single select | Creator/Author |
| **Search-within-facet** | Many options | Tags, Keywords |
| **Toggle/Switch** | Binary options | "Has video tutorial" |

### Checkbox Controls (Multi-Select)

Checkboxes allow users to select multiple values within a facet. This creates OR logic within the facet.

**Example**: Selecting Physics ✓ and Chemistry ✓ shows MicroSims that are Physics OR Chemistry.

```html
<div class="facet-group">
  <h3>Subject Area</h3>
  <label><input type="checkbox" value="physics"> Physics (45)</label>
  <label><input type="checkbox" value="chemistry"> Chemistry (23)</label>
  <label><input type="checkbox" value="math"> Mathematics (67)</label>
  <label><input type="checkbox" value="biology"> Biology (31)</label>
</div>
```

### Range Slider Controls

Range sliders work well for numeric facets where users want to specify a range rather than discrete values.

**Example**: Quality Score slider from 0-100, user selects 70-100 to see only high-quality MicroSims.

```html
<div class="facet-group">
  <h3>Quality Score</h3>
  <input type="range" min="0" max="100" value="0" class="min-slider">
  <input type="range" min="0" max="100" value="100" class="max-slider">
  <span class="range-display">0 - 100</span>
</div>
```

### Hierarchical Facets

Some facets have natural hierarchies. Subject Area might expand into sub-topics:

```
▼ Physics (45)
  ├─ Mechanics (18)
  │  ├─ Kinematics (7)
  │  └─ Dynamics (11)
  ├─ Waves (12)
  └─ Electricity (15)
```

Users can select at any level—clicking "Physics" selects all sub-topics, or they can drill down to specific areas.

### Filter Control Best Practices

When designing filter controls:

- **Show counts**: Users need feedback on selection impact
- **Preserve state**: Filters should survive page refresh (use URL parameters)
- **Keyboard accessible**: Support Tab, Enter, Space for all controls
- **Mobile friendly**: Touch targets at least 44x44 pixels
- **Logical ordering**: Most-used or alphabetical, be consistent

!!! note "The Count Paradox"
    Should you show counts for currently filtered results or the total collection? Both approaches have merit. Showing filtered counts helps users understand the current subset. Showing total counts helps users understand overall collection composition. Many interfaces show both: "Physics (28 of 120)".

---

## Lightweight Search: No Server Required

**Lightweight search** refers to search implementations that minimize infrastructure requirements—specifically, search that runs without dedicated search servers like Elasticsearch, Solr, or Algolia. For modest-sized collections (hundreds to a few thousand documents), lightweight approaches offer compelling advantages.

### Why Go Lightweight?

| Advantage | Description |
|-----------|-------------|
| **Zero infrastructure** | No servers to maintain, no databases to manage |
| **Free hosting** | Static files can be hosted on GitHub Pages, Netlify |
| **Instant response** | No network latency after initial data load |
| **Works offline** | Search continues without internet connection |
| **Privacy preserving** | Queries never leave the user's browser |
| **Simple deployment** | Just HTML, CSS, JavaScript, and JSON |

For MicroSim collections (typically 100-1000 items), lightweight search is not just adequate—it's often superior to server-based alternatives.

### Lightweight Search Approaches

| Approach | How It Works | Best For |
|----------|--------------|----------|
| **Client-side indexing** | Build search index in browser | Small-medium collections |
| **Pre-built static index** | Index generated at build time | Larger collections |
| **JSON filtering** | Simple array filtering | Very small collections |
| **Web Workers** | Search runs in background thread | CPU-intensive search |

### The Trade-offs

Lightweight search isn't magic. Here's when it works and when it doesn't:

**Works Great For:**

- Collections under 5,000 items
- Metadata search (not full-text of large documents)
- Read-heavy applications (search often, update rarely)
- Static sites or single-page applications
- Educational and portfolio sites

**Consider Server-Side When:**

- Collection exceeds 10,000+ items
- Full-text search of large documents needed
- Real-time collaborative updates required
- Complex ranking algorithms needed
- Search analytics are business-critical

!!! success "MicroSim Collections Are Perfect for Lightweight Search"
    A typical MicroSim repository has hundreds of simulations, each with a small metadata file. Total data size: under 1MB. Initial load time: under 1 second. Search response: instantaneous. This is the sweet spot for client-side search.

---

## Client-Side Search: Search in the Browser

**Client-side search** means the search functionality runs entirely in the user's web browser using JavaScript. The data is loaded once, and all search operations happen locally without server round-trips.

### How Client-Side Search Works

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. Page Load                                              │
│      ┌──────────────┐     ┌───────────────────────────┐    │
│      │ HTML/JS/CSS  │────→│ Application Loads          │    │
│      └──────────────┘     └───────────────────────────┘    │
│                                                             │
│   2. Data Fetch                                             │
│      ┌──────────────┐     ┌───────────────────────────┐    │
│      │ microsims.   │────→│ JSON loaded into memory    │    │
│      │ json (500KB) │     │ Search index built         │    │
│      └──────────────┘     └───────────────────────────┘    │
│                                                             │
│   3. User Searches (happens entirely in browser)           │
│      ┌──────────────┐     ┌───────────────────────────┐    │
│      │ User types   │────→│ Index queried locally      │    │
│      │ "pendulum"   │     │ Results returned instantly │    │
│      └──────────────┘     └───────────────────────────┘    │
│                                                             │
│   4. No Server Calls for Search!                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Characteristics

| Characteristic | Implication |
|----------------|-------------|
| **Data preloaded** | Initial page load includes all searchable data |
| **Index in memory** | Search index lives in browser's JavaScript heap |
| **Instant queries** | No network delay for search operations |
| **Client CPU** | User's device does the computational work |
| **Stateless server** | Server just serves static files |

### Client-Side Search Libraries

Several excellent JavaScript libraries enable client-side search:

| Library | Features | Best For |
|---------|----------|----------|
| **ItemsJS** | Faceted search, aggregations | Faceted filtering (our choice!) |
| **Lunr.js** | Full-text search, stemming | Text-heavy search |
| **Fuse.js** | Fuzzy matching | Typo-tolerant search |
| **FlexSearch** | Speed-optimized | Large collections |
| **MiniSearch** | Lightweight, full-featured | Balanced needs |

For MicroSim search with faceted filtering, **ItemsJS** is the standout choice. It's specifically designed for faceted search and aggregations—exactly what we need.

#### Diagram: Client-Side Search Architecture

<iframe src="../../sims/client-side-architecture/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Client-Side Search Architecture Diagram</summary>
Type: diagram

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning Objective: Students will explain the data flow in client-side search by tracing how data moves from static files through the browser to search results.

Components to show:
1. Static File Server (cloud icon)
   - HTML/CSS/JS files
   - microsims-data.json
   - Labels: "GitHub Pages, Netlify, or any web host"

2. User's Browser (large rectangle)
   - Sub-components:
     - Data Layer: JSON data in memory
     - Search Engine: ItemsJS instance
     - UI Components: Search box, facets, results
   - Arrows showing internal data flow

3. User (stick figure)
   - Inputs: Search queries, facet selections
   - Outputs: Views search results

Connections:
- Dashed arrow from Server to Browser: "One-time data load (page load)"
- Solid arrows within Browser: "All search operations"
- Double arrow between User and Browser: "Instant interaction"

Key annotations:
- "No server round-trips for search!" with emphasis
- "~500KB of JSON = instant search for 400+ MicroSims"
- "Works offline after initial load"

Color scheme:
- Server: Gray (passive)
- Browser: Blue (active)
- Data flow: Green arrows
- User interaction: Orange arrows

Style: Clean block diagram with rounded rectangles

Implementation: p5.js with animated data flow on hover
</details>

---

## The Inverted Index: How Search Gets Fast

In Chapter 6, we introduced inverted indexes for search. Now let's see how they apply specifically to client-side faceted search. Understanding this structure helps you design efficient search systems.

### Inverted Index Recap

An **inverted index** maps terms to the documents containing them:

```
Term          → Document IDs
─────────────────────────────
"physics"     → [1, 3, 5, 8, 12, 15]
"chemistry"   → [2, 4, 7, 11]
"pendulum"    → [1, 5, 15]
"wave"        → [3, 8, 12]
```

To find MicroSims about "physics pendulum":
1. Look up "physics" → [1, 3, 5, 8, 12, 15]
2. Look up "pendulum" → [1, 5, 15]
3. Intersection: [1, 5, 15]

Three results, found without scanning all documents.

### Facet Indexes

Faceted search extends this with **facet indexes**—inverted indexes for each facet:

```
Subject Area Index:
  "Physics"     → [1, 3, 5, 8, 12, 15]
  "Chemistry"   → [2, 4, 7, 11]
  "Mathematics" → [6, 9, 10, 13, 14]

Grade Level Index:
  "K-12"          → [2, 6, 9, 10]
  "Undergraduate" → [1, 3, 5, 7, 8, 11, 12, 14, 15]
  "Graduate"      → [4, 13]

Framework Index:
  "p5.js"    → [1, 3, 5, 8, 10, 12, 15]
  "D3.js"    → [2, 6, 9, 14]
  "Three.js" → [4, 7, 11, 13]
```

### Faceted Query Resolution

When a user selects Physics + Undergraduate + p5.js:

```
Step 1: Get documents for each facet selection
  Subject = Physics      → [1, 3, 5, 8, 12, 15]
  Grade = Undergraduate  → [1, 3, 5, 7, 8, 11, 12, 14, 15]
  Framework = p5.js      → [1, 3, 5, 8, 10, 12, 15]

Step 2: Intersect all sets (AND logic across facets)
  [1, 3, 5, 8, 12, 15] ∩ [1, 3, 5, 7, 8, 11, 12, 14, 15] ∩ [1, 3, 5, 8, 10, 12, 15]
  = [1, 3, 5, 8, 12, 15]

Step 3: Return matching documents
  Documents 1, 3, 5, 8, 12, 15 displayed
```

### Calculating Facet Counts

After filtering, facet counts must update. This requires counting matches for each facet value *within the current result set*:

```
Current results: [1, 3, 5, 8, 12, 15] (Physics + Undergraduate + p5.js)

Difficulty facet counts (for remaining filters):
  "Beginner"     → [1, 3] ∩ [1, 3, 5, 8, 12, 15] = [1, 3]        → count: 2
  "Intermediate" → [5, 8, 12] ∩ [1, 3, 5, 8, 12, 15] = [5, 8, 12] → count: 3
  "Advanced"     → [15] ∩ [1, 3, 5, 8, 12, 15] = [15]            → count: 1
```

This is why good search libraries like ItemsJS are valuable—they handle these set operations efficiently.

#### Diagram: Facet Index Visualizer

<iframe src="../../sims/facet-index-visualizer/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Facet Index Structure Visualizer</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning Objective: Students will examine how facet indexes enable fast filtering by visualizing set intersections as facet values are selected.

Canvas layout:
- Top panel (30%): Facet selection controls
- Middle panel (40%): Set visualization (Venn-style or bar representation)
- Bottom panel (30%): Results list and counts

Visual elements:
- Three facet groups with checkboxes:
  - Subject Area: Physics, Chemistry, Math
  - Grade Level: K-12, Undergraduate, Graduate
  - Framework: p5.js, D3.js, Three.js
- Document set visualization showing:
  - Color-coded document icons (numbered 1-15)
  - Highlighting for selected facet values
  - Intersection region emphasized
- Results count display
- Step-by-step calculation panel

Sample data:
- 15 documents with varied facet values
- At least 3 documents matching any triple-facet combination

Interactive controls:
- Checkboxes for each facet value
- "Show Calculation Steps" toggle
- "Animate Intersection" button
- "Reset All" button
- Speed slider for animation

Behavior:
- Selecting facet value highlights matching documents
- Multiple selections show intersection
- Calculation steps panel shows set notation
- Animation option shows documents "filtering" into intersection

Animation sequence (when activated):
1. Show all documents
2. Highlight first facet selection
3. Fade non-matching documents
4. Repeat for additional selections
5. Final intersection highlighted

Color scheme:
- Subject facets: Blues
- Grade facets: Greens
- Framework facets: Oranges
- Intersection: Gold/Yellow highlight

Implementation: p5.js with set visualization
</details>

---

## ItemsJS Library: Faceted Search Made Easy

**ItemsJS** is a JavaScript library specifically designed for faceted search and filtering. It's the engine that powers our MicroSim search interface, and understanding its API will help you build your own search applications.

### Why ItemsJS?

| Feature | Benefit |
|---------|---------|
| **Faceted search native** | Built specifically for facets, not an afterthought |
| **Aggregations** | Automatically calculates facet counts |
| **No dependencies** | Pure JavaScript, no external requirements |
| **Browser & Node** | Works client-side or server-side |
| **Small size** | ~15KB minified |
| **Active maintenance** | Regular updates, good documentation |

### Getting Started with ItemsJS

Basic setup in three steps:

**Step 1: Include the Library**

```html
<script src="https://cdn.jsdelivr.net/npm/itemsjs@latest/dist/itemsjs.min.js"></script>
```

**Step 2: Define Your Configuration**

```javascript
const configuration = {
  searchableFields: ['title', 'description', 'creator'],
  sortings: {
    title_asc: { field: 'title', order: 'asc' },
    date_desc: { field: 'date', order: 'desc' }
  },
  aggregations: {
    subjectArea: {
      title: 'Subject Area',
      size: 10,
      conjunction: false  // OR logic within facet
    },
    gradeLevel: {
      title: 'Grade Level',
      size: 5
    },
    framework: {
      title: 'Framework',
      size: 10
    }
  }
};
```

**Step 3: Initialize and Search**

```javascript
// Load your MicroSim data
const microsims = await fetch('microsims-data.json').then(r => r.json());

// Create ItemsJS instance
const searchEngine = itemsjs(microsims, configuration);

// Perform a search with facets
const results = searchEngine.search({
  query: 'pendulum',
  filters: {
    subjectArea: ['Physics'],
    gradeLevel: ['Undergraduate']
  }
});

console.log(results.data.items);        // Matching MicroSims
console.log(results.data.aggregations); // Updated facet counts
```

### The ItemsJS Response Structure

When you call `searchEngine.search()`, you get a rich response:

```javascript
{
  data: {
    items: [
      { title: "Pendulum Period Calculator", ... },
      { title: "Simple Harmonic Motion", ... }
    ],
    aggregations: {
      subjectArea: {
        title: "Subject Area",
        buckets: [
          { key: "Physics", doc_count: 45 },
          { key: "Mathematics", doc_count: 12 }
        ]
      },
      gradeLevel: {
        buckets: [
          { key: "Undergraduate", doc_count: 28 },
          { key: "K-12", doc_count: 15 }
        ]
      }
    }
  },
  pagination: {
    page: 1,
    per_page: 12,
    total: 57
  }
}
```

### Key ItemsJS Concepts

| Concept | Description |
|---------|-------------|
| **searchableFields** | Fields to include in text search |
| **aggregations** | Facet definitions with size limits |
| **conjunction** | true = AND within facet, false = OR |
| **filters** | Currently selected facet values |
| **buckets** | Facet values with their counts |
| **pagination** | Page-based result limiting |

### Complete ItemsJS Example

Here's a minimal but complete working example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>MicroSim Search</title>
  <script src="https://cdn.jsdelivr.net/npm/itemsjs@latest/dist/itemsjs.min.js"></script>
</head>
<body>
  <input type="text" id="search" placeholder="Search MicroSims...">
  <div id="facets"></div>
  <div id="results"></div>

  <script>
    // Sample data (normally loaded from JSON file)
    const data = [
      { id: 1, title: "Pendulum Simulator", subjectArea: "Physics", gradeLevel: "Undergraduate" },
      { id: 2, title: "Wave Interference", subjectArea: "Physics", gradeLevel: "Undergraduate" },
      { id: 3, title: "Quadratic Grapher", subjectArea: "Mathematics", gradeLevel: "K-12" }
    ];

    // Configuration
    const config = {
      searchableFields: ['title'],
      aggregations: {
        subjectArea: { title: 'Subject', size: 10 },
        gradeLevel: { title: 'Level', size: 5 }
      }
    };

    // Initialize
    const search = itemsjs(data, config);

    // Search function
    function doSearch(query, filters = {}) {
      const results = search.search({ query, filters });

      // Display results
      document.getElementById('results').innerHTML = results.data.items
        .map(item => `<div>${item.title}</div>`)
        .join('');

      // Display facets with counts
      document.getElementById('facets').innerHTML = Object.entries(results.data.aggregations)
        .map(([key, agg]) => `
          <div>
            <h3>${agg.title}</h3>
            ${agg.buckets.map(b => `<label>
              <input type="checkbox" data-facet="${key}" value="${b.key}">
              ${b.key} (${b.doc_count})
            </label>`).join('')}
          </div>
        `).join('');
    }

    // Initial render
    doSearch('');

    // Event handlers
    document.getElementById('search').addEventListener('input', e => doSearch(e.target.value));
  </script>
</body>
</html>
```

!!! success "That's a Working Faceted Search in 50 Lines"
    The example above is a complete, functional faceted search interface. With a bit more HTML/CSS, you'd have something production-ready. ItemsJS handles all the complex index management and set operations behind the scenes.

#### Diagram: ItemsJS API Explorer

<iframe src="../../sims/itemsjs-explorer/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>ItemsJS API Interactive Explorer</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning Objective: Students will implement search queries using the ItemsJS API by constructing search parameters and observing the resulting data structure.

Canvas layout:
- Left panel (40%): Query builder interface
- Right panel (60%): Results and response viewer

Visual elements:
- Query builder with:
  - Text input for search query
  - Facet selection dropdowns/checkboxes
  - Sorting dropdown
  - Page number input
- Response viewer showing:
  - Tabbed view: "Items" | "Aggregations" | "Raw JSON"
  - Items tab: Card view of results
  - Aggregations tab: Facet counts visualization
  - Raw JSON tab: Formatted JSON response
- "Execute Search" button
- Code preview showing generated search() call

Sample data:
- 15 MicroSims with varied metadata
- Searchable by title and description
- Facets: Subject, Grade, Framework

Interactive controls:
- Query text input
- Multi-select for each facet
- Sorting dropdown (title A-Z, date newest, relevance)
- Items per page selector
- "Copy Code" button to copy the search() call

Code preview (updates live):
```javascript
searchEngine.search({
  query: "wave",
  filters: {
    subjectArea: ["Physics"],
    gradeLevel: ["Undergraduate"]
  },
  sort: "title_asc",
  per_page: 10
});
```

Behavior:
- All inputs update code preview in real-time
- "Execute Search" runs the query and shows results
- Response tabs show different views of same data
- Aggregation counts shown as horizontal bars

Default state: Empty query, no filters, showing all items

Implementation: p5.js with embedded ItemsJS
</details>

---

## Semantic Search: A Preview

While this chapter focuses on faceted search, it's worth briefly introducing **semantic search**—a more advanced approach that we'll explore fully in the next chapter.

### The Vocabulary Problem Revisited

Faceted and keyword search share a fundamental limitation: they match exact terms. Search for "car" and you won't find "automobile." Search for "momentum" and you might miss "inertia" even though they're conceptually related.

**Semantic search** addresses this by understanding meaning, not just matching words.

### How Semantic Search Differs

| Aspect | Keyword/Faceted Search | Semantic Search |
|--------|------------------------|-----------------|
| **Matching** | Exact terms | Conceptual similarity |
| **Query** | "wave physics" | "things that oscillate" |
| **Finds** | Documents with those words | Documents about the concept |
| **Handles synonyms** | No (unless explicitly listed) | Yes (automatically) |
| **Requires** | Good metadata keywords | AI embeddings |

### Example: Semantic Search in Action

**Query**: "interactive demonstration of how planets orbit"

**Keyword search results**: Might find nothing (no document has all those words)

**Semantic search results**:
1. "Solar System Simulator" (conceptually matches)
2. "Kepler's Laws Visualization" (related concept)
3. "Gravity and Orbital Mechanics" (related concept)

The semantic search understands that "planets orbit" relates to "solar system," "Kepler's laws," and "orbital mechanics" even without those exact words in the query.

### Combining Approaches

The most powerful search systems combine all three approaches:

1. **Faceted search** for structured filtering (Subject: Astronomy)
2. **Keyword search** for specific terms ("Kepler")
3. **Semantic search** for conceptual discovery ("how things move in space")

In the next chapter, we'll dive deep into embeddings—the technology that makes semantic search possible.

!!! tip "Semantic Search Preview"
    Curious to see semantic search in action? Our MicroSim search includes a "Similar MicroSims" feature that uses embeddings to find conceptually related simulations. Click any result to see what's semantically nearby!

---

## Building a Complete Faceted Search Interface

Let's put everything together with a practical guide to building a MicroSim faceted search interface.

### Step 1: Prepare Your Data

Ensure MicroSim metadata includes facetable fields:

```json
{
  "title": "Pendulum Period Calculator",
  "description": "Interactive simulation showing period vs length relationship",
  "dublinCore": {
    "creator": "Dr. Physics",
    "subject": ["Physics", "Mechanics"]
  },
  "educational": {
    "subjectArea": "Physics",
    "gradeLevel": "Undergraduate",
    "bloomsTaxonomy": "Apply",
    "difficulty": "Intermediate"
  },
  "technical": {
    "framework": "p5.js"
  }
}
```

### Step 2: Normalize Facet Values

Facets work best with controlled vocabularies. Normalize variations:

```javascript
// Normalization mapping
const gradeNormalize = {
  'undergraduate': 'Undergraduate',
  'college': 'Undergraduate',
  'university': 'Undergraduate',
  'undergrad': 'Undergraduate',
  'high school': 'K-12',
  'high-school': 'K-12',
  'secondary': 'K-12'
};

// Apply during data loading
data.forEach(item => {
  const raw = item.educational?.gradeLevel?.toLowerCase();
  item.gradeLevel = gradeNormalize[raw] || item.educational?.gradeLevel;
});
```

### Step 3: Configure ItemsJS

Define your aggregations based on available facets:

```javascript
const configuration = {
  searchableFields: ['title', 'description', 'dublinCore.subject'],
  aggregations: {
    subjectArea: {
      title: 'Subject Area',
      size: 20,
      conjunction: false
    },
    gradeLevel: {
      title: 'Grade Level',
      size: 10
    },
    framework: {
      title: 'Framework',
      size: 15
    },
    difficulty: {
      title: 'Difficulty',
      size: 5
    },
    bloomsTaxonomy: {
      title: "Bloom's Level",
      size: 6
    }
  }
};
```

### Step 4: Build the UI

Create responsive facet panels and result displays:

```html
<div class="search-container">
  <aside class="facet-panel">
    <div id="active-filters"></div>
    <button id="clear-all">Clear All Filters</button>

    <div class="facet-group" id="facet-subjectArea"></div>
    <div class="facet-group" id="facet-gradeLevel"></div>
    <div class="facet-group" id="facet-framework"></div>
  </aside>

  <main class="results-panel">
    <div class="search-header">
      <input type="search" id="search-input" placeholder="Search MicroSims...">
      <select id="sort-select">
        <option value="relevance">Relevance</option>
        <option value="title_asc">Title A-Z</option>
        <option value="date_desc">Newest First</option>
      </select>
    </div>

    <div id="results-count"></div>
    <div id="results-grid"></div>
    <div id="pagination"></div>
  </main>
</div>
```

### Step 5: Wire Up Interactions

Handle search, facet clicks, and state management:

```javascript
let currentFilters = {};
let currentQuery = '';

function performSearch() {
  const results = searchEngine.search({
    query: currentQuery,
    filters: currentFilters,
    per_page: 12
  });

  renderResults(results.data.items);
  renderFacets(results.data.aggregations);
  renderActiveFilters();
  updateURL();  // Save state to URL parameters
}

function handleFacetClick(facetName, value) {
  if (!currentFilters[facetName]) {
    currentFilters[facetName] = [];
  }

  const index = currentFilters[facetName].indexOf(value);
  if (index > -1) {
    currentFilters[facetName].splice(index, 1);
  } else {
    currentFilters[facetName].push(value);
  }

  performSearch();
}

function clearAllFilters() {
  currentFilters = {};
  currentQuery = '';
  document.getElementById('search-input').value = '';
  performSearch();
}
```

### Step 6: Add Polish

Enhance the user experience:

- **URL state**: Persist filters in URL for shareable links
- **Loading states**: Show spinner during data fetch
- **Error handling**: Graceful messages if data fails to load
- **Keyboard navigation**: Full keyboard accessibility
- **Mobile responsiveness**: Collapsible facet panel on small screens
- **Analytics**: Track popular searches and facet usage

---

## Key Takeaways

1. **Facets** are dimensions for filtering—Subject, Grade Level, Framework are common MicroSim facets

2. **Faceted search** lets users progressively narrow results by clicking, no query syntax needed

3. **Filter controls** (checkboxes, sliders, dropdowns) must match facet data types and user expectations

4. **Lightweight search** eliminates server infrastructure—perfect for MicroSim collections under 5,000 items

5. **Client-side search** runs entirely in the browser after initial data load—instant, private, works offline

6. **ItemsJS** is the ideal library for faceted search: small, focused, easy to use

7. **Inverted indexes** for facets enable fast set intersections when multiple facets are selected

8. **Facet counts** update dynamically, showing users the impact of each selection before clicking

9. **Semantic search** goes beyond keywords to find conceptually similar content—preview of next chapter

10. **Combining approaches** (faceted + keyword + semantic) provides the most powerful search experience

---

## What's Next?

You now have the tools to build powerful, instant search interfaces for MicroSim collections. But we've only scratched the surface of what's possible. In the next chapter, we'll explore **semantic search and embeddings**:

- How AI models understand meaning
- Converting text to numerical vectors
- Finding similar MicroSims by concept, not just keywords
- Building "More Like This" recommendations

The combination of faceted search (structured) and semantic search (conceptual) creates search experiences that feel almost magical.

---

*Ready to unlock semantic understanding? Continue to [Chapter 8: Embeddings and Semantic Search](../08-embeddings-semantic-search/index.md).*
