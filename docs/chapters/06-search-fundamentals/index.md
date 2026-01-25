---
title: Search Fundamentals
description: Master the core concepts of information retrieval including precision, recall, relevance ranking, and boolean search operators to find MicroSims effectively
generated_by: claude skill chapter-content-generator
date: 2026-01-24 16:30:00
version: 0.03
reading_level: college
---

# Search Fundamentals

## Summary

This chapter introduces core search concepts that form the foundation for finding and retrieving MicroSims. You'll learn about information retrieval principles including precision and recall, relevance ranking, and various search approaches. The chapter covers keyword search, boolean search with AND, OR, and NOT operators, as well as search engine concepts like indexing. After completing this chapter, students will understand how search systems work and be able to construct effective search queries.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Search
2. Search Fundamentals
3. Information Retrieval
4. Precision
5. Recall
6. Relevance
7. Ranking
8. Keyword Search
9. Boolean Search
10. Boolean Operators
11. AND Operator
12. OR Operator
13. NOT Operator
14. Search Engines
15. Indexing

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../course-description.md). The Search concept is foundational and has no dependencies within this textbook.

---

## The Superpower Every Educator Needs

Imagine having instant access to the perfect interactive simulation for any topic you're teaching. Need a visualization of pendulum motion for tomorrow's physics class? Found in seconds. Looking for an interactive supply-and-demand curve for economics? Right there. Want a sorting algorithm animation for computer science? Got it.

This isn't a fantasy—it's the reality that MicroSim search makes possible. But to wield this superpower effectively, you need to understand how search actually works. The difference between finding exactly what you need and drowning in irrelevant results comes down to understanding the fundamentals we'll cover in this chapter.

Search technology is genuinely transformative for education. When teachers can quickly find high-quality interactive simulations, they spend less time creating materials from scratch and more time actually teaching. When students can discover MicroSims that match their learning level, they get personalized education at scale. And when AI systems can search MicroSim repositories, they can suggest the perfect simulation for any learning moment.

Let's unlock this superpower together.

---

## What Is Search?

At its core, **search** is the process of finding specific information within a larger collection. When you type a query into Google, search a library catalog, or look for a file on your computer, you're performing search. The goal is always the same: given what you're looking for (the query), find the items that match (the results).

For MicroSim search specifically, we're finding interactive educational simulations that match a teacher's or student's needs. The "collection" is all the MicroSims across various repositories. The "query" might be keywords like "projectile motion" or filters like "physics + undergraduate + p5.js."

Search seems simple on the surface, but there's elegant complexity underneath. Consider these challenges:

- How do you find simulations about "gravity" when they might use words like "gravitational force," "freefall," or "g = 9.8 m/s²"?
- How do you rank results so the best matches appear first?
- How do you search thousands of MicroSims in milliseconds?
- How do you balance finding everything relevant against filtering out noise?

These questions drive the field of **information retrieval**, the science behind search systems.

---

## Information Retrieval: The Science of Finding

**Information retrieval (IR)** is the discipline concerned with obtaining relevant information from a collection of resources. It's the academic field that gave us Google, recommendation systems, and modern search engines. Understanding IR fundamentals helps you become both a better searcher and a better creator of searchable content.

Information retrieval involves three key components:

| Component | Description | MicroSim Example |
|-----------|-------------|------------------|
| **Collection** | The documents/resources to search | All MicroSim metadata files |
| **Query** | What the user is looking for | "wave interference physics" |
| **Retrieval Model** | How matches are determined | Keyword matching, semantic similarity |

The fundamental challenge of IR is the **vocabulary mismatch problem**: users describe what they want in their words, while documents describe content in potentially different words. Your query might be "pendulum swing" but the MicroSim's metadata says "simple harmonic motion." Bridging this gap is what separates great search from frustrating search.

### The Information Retrieval Process

Search systems follow a general workflow:

1. **Indexing**: Pre-process the collection to enable fast search
2. **Query Processing**: Parse and understand the user's search terms
3. **Matching**: Find documents that potentially satisfy the query
4. **Ranking**: Order results by estimated relevance
5. **Presentation**: Display results to the user

We'll explore each of these throughout this chapter, with special attention to how they apply to MicroSim discovery.

#### Diagram: Information Retrieval Pipeline

<iframe src="../../sims/ir-pipeline/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Information Retrieval Pipeline Workflow</summary>
Type: workflow

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning Objective: Students will explain the five stages of information retrieval by tracing a search query through the complete pipeline from user input to displayed results.

Purpose: Visualize the complete search pipeline showing how a query moves through each stage

Visual style: Horizontal flowchart with process rectangles and data flow arrows

Steps:
1. Start: "User Query"
   - Shape: Rounded rectangle (input)
   - Hover text: "User enters search terms: 'physics pendulum simulation'"
   - Color: Light blue

2. Process: "Query Processing"
   - Shape: Rectangle
   - Hover text: "Tokenize, normalize, remove stopwords, identify key terms"
   - Color: Blue
   - Sub-elements shown on click: tokenize → lowercase → remove 'simulation' (too common)

3. Process: "Index Lookup"
   - Shape: Cylinder (database symbol)
   - Hover text: "Search the pre-built index for matching documents"
   - Color: Orange
   - Shows: Query terms mapped to document IDs

4. Process: "Matching"
   - Shape: Rectangle
   - Hover text: "Identify all documents containing query terms"
   - Color: Yellow
   - Shows: "Found 47 potential matches"

5. Process: "Ranking"
   - Shape: Rectangle with star icon
   - Hover text: "Score and sort by relevance using TF-IDF, BM25, or other algorithms"
   - Color: Green
   - Shows: Documents reordered by score

6. End: "Search Results"
   - Shape: Rounded rectangle (output)
   - Hover text: "Top 10 results displayed to user with titles and descriptions"
   - Color: Light green
   - Shows: Ordered list preview

Data flow arrows:
- Solid arrows between sequential steps
- Dashed arrow from "Index Lookup" back to stored index (showing pre-computation)

Interactive features:
- Click any step to see detailed sub-process
- Hover shows description text
- "Trace Query" button animates a sample query through pipeline
- Reset button returns to overview

Animation: When "Trace Query" clicked, highlight moves through stages with sample data

Color scheme: Blue gradient (input) → Orange (storage) → Green gradient (output)

Implementation: p5.js with interactive flowchart components
</details>

---

## Precision and Recall: The Two Pillars of Search Quality

How do we measure whether a search system is any good? Two metrics dominate the field: **precision** and **recall**. Understanding these helps you evaluate search results and design better metadata.

### Precision: Are the Results Relevant?

**Precision** measures what fraction of returned results are actually relevant to your query. High precision means most results are useful; low precision means you're wading through junk.

$$\text{Precision} = \frac{\text{Relevant Results Retrieved}}{\text{Total Results Retrieved}}$$

**Example**: You search for "projectile motion" and get 20 results. If 16 of them are actually about projectile motion and 4 are about unrelated topics, your precision is:

$$\text{Precision} = \frac{16}{20} = 0.80 = 80\%$$

### Recall: Did We Find Everything?

**Recall** measures what fraction of all relevant documents in the collection were actually retrieved. High recall means you found most of what exists; low recall means you missed things.

$$\text{Recall} = \frac{\text{Relevant Results Retrieved}}{\text{Total Relevant Results in Collection}}$$

**Example**: There are 25 MicroSims about projectile motion in the entire repository. Your search found 16 of them. Your recall is:

$$\text{Recall} = \frac{16}{25} = 0.64 = 64\%$$

### The Precision-Recall Trade-off

Here's the challenge: precision and recall often work against each other.

| Strategy | Effect on Precision | Effect on Recall |
|----------|--------------------| -----------------|
| Be very specific | ⬆️ Higher (fewer irrelevant results) | ⬇️ Lower (miss some relevant ones) |
| Be very broad | ⬇️ Lower (more noise) | ⬆️ Higher (find more relevant ones) |

Think of it like fishing:

- **High precision, low recall**: Using a small net with fine mesh. You catch only the fish you want, but you miss many others.
- **High recall, low precision**: Using a huge net. You catch everything including the fish you want, but also lots of seaweed and old boots.
- **The ideal**: A well-designed net that catches most target fish while excluding most debris.

For MicroSim search, the right balance depends on the use case:

- **Browsing for ideas**: Favor recall (show me everything that might be relevant)
- **Finding specific simulation**: Favor precision (show me exactly what I asked for)
- **AI training examples**: Need high recall (don't miss good examples)
- **Classroom demonstration**: Need high precision (no time for irrelevant results)

#### Diagram: Precision-Recall Trade-off Explorer

<iframe src="../../sims/precision-recall-explorer/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Precision-Recall Trade-off Interactive Explorer</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning Objective: Students will examine the trade-off between precision and recall by adjusting search parameters and observing how changes affect both metrics simultaneously.

Canvas layout:
- Left panel (55%): Venn diagram visualization
- Right panel (45%): Controls and metrics display

Visual elements:
- Large Venn diagram with two overlapping circles:
  - Circle A (blue): "All Results Retrieved"
  - Circle B (green): "All Relevant Documents in Collection"
  - Overlap (purple): "Relevant Results Retrieved" (true positives)
  - Blue only: False positives (retrieved but not relevant)
  - Green only: False negatives (relevant but not retrieved)
- Metrics display showing:
  - Precision percentage with formula
  - Recall percentage with formula
  - F1 Score (harmonic mean)
- Small icons representing documents in each region

Interactive controls:
- Slider: "Search Specificity" (1-10 scale)
  - Moving right: Increases precision, decreases recall
  - Moving left: Increases recall, decreases precision
- Slider: "Collection Coverage" (adjust how many relevant docs exist)
- Buttons: "High Precision Scenario" / "High Recall Scenario" / "Balanced"
- Toggle: "Show formulas" / "Hide formulas"
- Toggle: "Animate documents"

Default parameters:
- Search Specificity: 5 (balanced)
- Collection size: 100 documents
- Relevant documents: 25
- Retrieved documents: 20
- Overlap: 15

Behavior:
- Moving specificity slider smoothly adjusts circle overlap
- Documents (small icons) move between regions
- Metrics update in real-time
- Formulas highlight the changing numerators/denominators
- Color coding shows true positives (good) vs false positives/negatives (problems)

Scenarios (preset buttons):
1. "High Precision": Precision=95%, Recall=40%
2. "High Recall": Precision=50%, Recall=90%
3. "Balanced": Precision=75%, Recall=75%

Animation option: Documents float around within their regions

Implementation: p5.js with smooth transitions and real-time calculation
</details>

---

## Relevance: What Makes a Result "Good"?

**Relevance** is the degree to which a search result satisfies the user's information need. It sounds simple, but relevance is surprisingly subjective and multidimensional.

### Dimensions of Relevance

A MicroSim result might be relevant along several dimensions:

| Dimension | Question | Example |
|-----------|----------|---------|
| **Topical** | Is it about the right subject? | Searching "friction" finds friction simulations |
| **Level** | Is it appropriate for the audience? | College student needs undergraduate-level content |
| **Format** | Is it the right type of resource? | Want interactive simulation, not static diagram |
| **Quality** | Is it well-made and accurate? | Professional visualization vs amateur attempt |
| **Currency** | Is it up-to-date? | Uses current frameworks, not deprecated ones |
| **Accessibility** | Can the user actually use it? | Works on mobile, supports screen readers |

A truly relevant result scores well on all dimensions. Search systems typically focus on topical relevance (does it match the query terms?) while users often care about the full picture.

### Relevance Judgment in Practice

In MicroSim search, relevance might look like:

**Query**: "wave interference physics undergraduate"

| Result | Topical | Level | Format | Overall |
|--------|---------|-------|--------|---------|
| Interactive wave superposition sim | ✅ High | ✅ Match | ✅ Perfect | Highly Relevant |
| Wave lecture notes PDF | ✅ High | ✅ Match | ❌ Not interactive | Partially Relevant |
| Graduate-level quantum mechanics | ❌ Different topic | ❌ Too advanced | ✅ Interactive | Low Relevance |
| Wave sound effects audio | ❌ Wrong type | ⬜ N/A | ❌ Not simulation | Not Relevant |

Good metadata increases relevance by providing rich information for matching. If your MicroSim metadata includes grade level, subject area, and visualization type, the search system can match on all these dimensions.

!!! tip "Making Your MicroSims Findable"
    Want your MicroSims to appear in relevant searches? Fill out complete metadata! The more accurately you describe your simulation's topic, level, and features, the more likely it appears for users who actually need it.

---

## Ranking: Ordering by Importance

Finding matching documents is only half the battle. With potentially hundreds or thousands of matches, **ranking** determines which results appear first. Good ranking puts the most relevant results at the top; bad ranking buries gold under garbage.

### Why Ranking Matters

Consider these statistics about search behavior:

- 75% of users never scroll past the first page of results
- The first result gets ~30% of clicks
- Results below position 10 get less than 2% of clicks

If your best MicroSim ranks #47, almost no one will find it. Ranking is everything.

### Ranking Signals

Search engines use various signals to determine ranking:

| Signal | Description | MicroSim Example |
|--------|-------------|------------------|
| **Term frequency** | How often query terms appear | "pendulum" appears 5 times in metadata |
| **Field importance** | Where terms appear | Match in title > match in description |
| **Document quality** | Overall resource quality | High completeness score, proper metadata |
| **Freshness** | How recently updated | Last modified 2026 vs 2019 |
| **Popularity** | Usage or endorsement | View count, download count |
| **User context** | Personalization factors | User's subject area preferences |

### Relevance Scoring

Most search systems assign a **relevance score** to each result—a number indicating how well it matches the query. Common approaches include:

**TF-IDF (Term Frequency × Inverse Document Frequency)**:

- Rewards documents where query terms appear frequently (TF)
- Penalizes common words that appear everywhere (IDF)
- A MicroSim about "projectile motion" scores higher than one that just mentions "motion" once

**BM25 (Best Matching 25)**:

- Improved version of TF-IDF
- Accounts for document length (longer documents shouldn't automatically score higher)
- The algorithm behind many modern search engines

**Learning to Rank**:

- Machine learning approach
- Trained on user behavior (clicks, time spent)
- Can incorporate many signals simultaneously

#### Diagram: Ranking Score Visualizer

<iframe src="../../sims/ranking-visualizer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Search Result Ranking Score Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: interpret

Learning Objective: Students will interpret how different ranking signals combine to determine search result order by experimenting with signal weights and observing rank changes.

Canvas layout:
- Left panel (60%): Results list with score bars
- Right panel (40%): Ranking signal controls

Visual elements:
- List of 8 sample MicroSim results with:
  - Title and brief description
  - Horizontal bar showing total relevance score (0-100)
  - Stacked bar segments showing contribution of each signal
  - Rank number (updates as scores change)
- Legend showing signal colors

Sample results:
1. "Pendulum Period Calculator" - Physics, 2026
2. "Simple Harmonic Motion Explorer" - Physics, 2025
3. "Wave Pendulum Visualizer" - Physics, 2024
4. "Introduction to Oscillations" - Physics, 2023
5. "Pendulum Art Generator" - Art, 2026
6. "Clock Mechanism Simulator" - Engineering, 2025
7. "Gravity and Mass Demo" - Physics, 2024
8. "Physics 101 Video Lecture" - Physics, 2022

Interactive controls:
- Query input: "pendulum physics" (editable)
- Sliders for signal weights (0-100%):
  - Term Frequency weight (default: 40%)
  - Title Match weight (default: 25%)
  - Subject Match weight (default: 20%)
  - Freshness weight (default: 10%)
  - Popularity weight (default: 5%)
- Button: "Reset to Defaults"
- Toggle: "Show score breakdown"

Behavior:
- Adjusting any slider recalculates all scores
- Results smoothly animate to new positions
- Score bars update with smooth transitions
- Rank numbers update accordingly
- Hovering over result shows detailed score breakdown

Score calculation (visible when toggle on):
- Each signal contributes: (signal_score × weight) / sum(weights)
- Total score normalized to 0-100

Default state: Balanced weights showing "Pendulum Period Calculator" ranked #1

Animation: Results slide up/down when ranks change

Implementation: p5.js with animated list component
</details>

---

## Keyword Search: The Foundation

**Keyword search** is the most common search approach—you type words, the system finds documents containing those words. Simple, intuitive, and powerful. When you search Google, library catalogs, or most websites, you're using keyword search.

### How Keyword Search Works

1. **User enters query**: "projectile motion physics"
2. **System tokenizes**: Splits into ["projectile", "motion", "physics"]
3. **Index lookup**: Finds documents containing each term
4. **Matching**: Documents with more query terms score higher
5. **Ranking**: Results ordered by relevance score

### Strengths and Limitations

| Strengths | Limitations |
|-----------|-------------|
| ✅ Intuitive for users | ❌ Exact word matching only |
| ✅ Fast (uses pre-built indexes) | ❌ Vocabulary mismatch problem |
| ✅ Works across any content | ❌ No understanding of meaning |
| ✅ Predictable results | ❌ Synonyms missed ("car" ≠ "automobile") |

### Keyword Search Best Practices

When searching for MicroSims, these strategies improve results:

**Use specific terms:**
- ❌ "physics" (too broad, millions of matches)
- ✅ "projectile motion trajectory" (specific, fewer but better matches)

**Include multiple relevant words:**
- ❌ "waves" (could be ocean, sound, radio, hand waves...)
- ✅ "electromagnetic wave propagation" (clearly physics context)

**Think about what creators write:**
- Creators use technical terms, so search for them
- "Simple harmonic motion" not "back and forth movement"

**Try variations:**
- "visualization" vs "visualizer" vs "visual"
- "simulation" vs "simulator" vs "sim"

!!! success "The Keyword Search Mindset"
    To search effectively, think like the person who wrote the metadata. What words would they use to describe this simulation? Put yourself in the creator's shoes, and your keywords will match their descriptions.

---

## Boolean Search: Precision Through Logic

**Boolean search** uses logical operators (AND, OR, NOT) to create precise queries. Named after mathematician George Boole, this approach gives you surgical control over search results. When keyword search is too imprecise, Boolean search lets you specify exactly what you want.

### The Three Boolean Operators

Boolean search relies on three fundamental operators that combine search terms:

| Operator | Meaning | Effect |
|----------|---------|--------|
| **AND** | Both terms required | Narrows results (more precise) |
| **OR** | Either term acceptable | Broadens results (more recall) |
| **NOT** | Exclude term | Filters out unwanted results |

Let's explore each in detail.

---

## The AND Operator: Requiring Multiple Terms

The **AND operator** requires that all connected terms appear in results. It's the precision tool—each AND narrows your results to documents matching all criteria.

### How AND Works

**Query**: `physics AND pendulum AND undergraduate`

This finds documents containing ALL THREE terms:
- ✅ "Undergraduate physics pendulum simulation" → matches
- ❌ "High school pendulum lab" → missing "undergraduate"
- ❌ "Physics wave mechanics" → missing "pendulum"

### AND in Practice

Think of AND as an intersection of sets:

```
[physics documents] ∩ [pendulum documents] ∩ [undergraduate documents]
= [documents with all three]
```

| Search | Results | Precision | Recall |
|--------|---------|-----------|--------|
| physics | 500 | Low | High |
| physics AND pendulum | 45 | Medium | Medium |
| physics AND pendulum AND undergraduate | 12 | High | Lower |

Each AND reduces the result count but increases precision.

### When to Use AND

Use AND when you need multiple aspects to be present:

- **Topic + Level**: `calculus AND high-school`
- **Subject + Method**: `sorting AND visualization`
- **Domain + Tool**: `chemistry AND p5.js`

!!! note "Implicit AND"
    Many search engines treat spaces as implicit AND. The query `physics pendulum` is often equivalent to `physics AND pendulum`. But being explicit helps when using multiple operators.

---

## The OR Operator: Expanding Possibilities

The **OR operator** accepts either term, broadening your search. It's the recall tool—use it when you want to find everything relevant, including alternative terminology.

### How OR Works

**Query**: `simulation OR visualization OR animation`

This finds documents containing ANY of these terms:
- ✅ "Physics simulation" → matches (has "simulation")
- ✅ "Wave visualization tool" → matches (has "visualization")
- ✅ "Animated chemistry demo" → matches (has "animation")
- ✅ "Interactive simulation and visualization" → matches (has both)

### OR for Synonyms and Variations

OR is perfect for handling vocabulary variation:

**Subject synonyms**:
`(velocity OR speed) AND measurement`

**Spelling variations**:
`(colour OR color) AND visualization`

**Related concepts**:
`(gravity OR gravitational OR freefall) AND simulation`

**Format variations**:
`(sim OR simulation OR simulator) AND physics`

### OR in Set Terms

OR represents a union of sets:

```
[simulation docs] ∪ [visualization docs] ∪ [animation docs]
= [documents with any of these]
```

| Search | Results | Precision | Recall |
|--------|---------|-----------|--------|
| simulation | 200 | Medium | Medium |
| simulation OR visualization | 350 | Lower | Higher |
| simulation OR visualization OR animation | 420 | Lowest | Highest |

Each OR increases results, potentially decreasing precision but improving recall.

---

## The NOT Operator: Excluding Unwanted Results

The **NOT operator** (sometimes written as AND NOT or minus sign) excludes documents containing specific terms. It's the filter tool—use it to remove irrelevant results polluting your search.

### How NOT Works

**Query**: `wave AND physics NOT ocean`

This finds physics wave documents but excludes anything about ocean waves:
- ✅ "Electromagnetic wave propagation in physics" → matches
- ✅ "Sound wave interference simulation" → matches
- ❌ "Ocean wave patterns and physics" → excluded (contains "ocean")

### When to Use NOT

Use NOT to remove common false positives:

**Disambiguation**:
`python NOT snake` (programming, not reptile)
`java NOT coffee` (programming, not beverage)
`mercury NOT planet` (element, not astronomy)

**Exclude formats**:
`pendulum NOT video` (want simulations, not videos)
`physics NOT PDF` (want interactive, not documents)

**Exclude levels**:
`calculus NOT graduate` (want undergraduate resources)

### NOT Caution

Use NOT carefully—it can accidentally exclude relevant results:

**Problematic**: `wave NOT water`
- Excludes ocean wave simulations ✅ (intended)
- But also excludes "water wave tank demonstration" ❌ (probably relevant!)

**Better**: Use positive terms instead
- `electromagnetic wave` or `sound wave` instead of `wave NOT water`

!!! warning "NOT is a Blunt Instrument"
    NOT removes any document containing the excluded term, even if it's highly relevant in other ways. A physics simulation that briefly mentions ocean waves as an analogy gets excluded. Use NOT sparingly and test your queries.

---

## Combining Boolean Operators

Real-world searches often combine multiple operators. Understanding operator precedence and using parentheses creates powerful, precise queries.

### Operator Precedence

Without parentheses, operators typically evaluate in this order:
1. NOT (highest precedence)
2. AND
3. OR (lowest precedence)

**Example**: `A OR B AND C`
Evaluates as: `A OR (B AND C)` — not `(A OR B) AND C`

### Using Parentheses

Parentheses override precedence and group operations clearly:

**Finding simulations about either mechanics topic at undergraduate level**:
```
(projectile OR pendulum) AND physics AND undergraduate
```

This finds:
- Projectile physics undergraduate materials, OR
- Pendulum physics undergraduate materials

**Finding physics or chemistry simulations, excluding videos**:
```
(physics OR chemistry) AND simulation NOT video
```

### Complex Query Examples

| Goal | Boolean Query |
|------|---------------|
| Physics or chemistry at high school level | `(physics OR chemistry) AND high-school` |
| Wave simulations except ocean waves | `wave AND (sound OR electromagnetic OR radio) AND simulation` |
| P5.js or D3.js visualizations about graphs | `(p5.js OR d3.js) AND (graph OR network) AND visualization` |
| Undergraduate math not calculus | `mathematics AND undergraduate NOT calculus` |

#### Diagram: Boolean Query Builder

<iframe src="../../sims/boolean-query-builder/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Interactive Boolean Query Builder</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: construct

Learning Objective: Students will construct boolean search queries by visually combining terms with AND, OR, and NOT operators while observing the resulting query string and Venn diagram representation.

Canvas layout:
- Top panel (25%): Query construction area
- Middle panel (50%): Venn diagram visualization
- Bottom panel (25%): Results preview

Visual elements:
- Query builder with:
  - Text inputs for search terms (up to 4)
  - Dropdown selectors for operators between terms (AND/OR)
  - NOT checkbox for each term
  - Parentheses grouping controls
- Three-circle Venn diagram showing:
  - Each circle represents one search term's result set
  - Shaded regions show what the query selects
  - Labels on each region
- Final query string display (formatted)
- Results count estimate
- Sample matching documents preview

Interactive controls:
- Term inputs: Type any search term
- Operator dropdowns: Select AND or OR between terms
- NOT toggles: Checkbox to negate any term
- Grouping buttons: Add/remove parentheses
- "Build Query" button: Generates final query string
- "Reset" button: Clear all terms
- Dropdown: "Load Example Query" with presets

Example presets:
1. "Basic AND": physics AND simulation
2. "Synonym OR": (velocity OR speed) AND physics
3. "Exclusion": wave AND physics NOT ocean
4. "Complex": (projectile OR pendulum) AND undergraduate NOT video

Venn diagram behavior:
- Circle A (blue): First term results
- Circle B (green): Second term results
- Circle C (orange): Third term results
- Shaded region changes based on operators:
  - AND: Only overlapping region shaded
  - OR: All circles shaded
  - NOT: Excluded region crossed out

Results preview:
- Shows 5 sample document titles that would match
- Indicates "~X results" estimate

Default state: Empty query builder ready for input

Animation: Venn diagram regions fade in/out as query changes

Implementation: p5.js with query parser and visualization
</details>

---

## Search Engines: Putting It All Together

A **search engine** is a complete system that indexes documents, processes queries, and returns ranked results. Google is the famous example, but search engines power everything from e-commerce sites to MicroSim repositories.

### Search Engine Architecture

Modern search engines have these core components:

```
┌─────────────────────────────────────────────────────────────┐
│                     SEARCH ENGINE                           │
├─────────────────────┬───────────────────────────────────────┤
│     OFFLINE         │           ONLINE                      │
│   (Background)      │        (Per Query)                    │
├─────────────────────┼───────────────────────────────────────┤
│  ┌───────────────┐  │  ┌───────────────┐  ┌──────────────┐ │
│  │   Crawler     │  │  │Query Processor│→ │ Index Lookup │ │
│  │ (fetch docs)  │  │  │(parse, expand)│  │ (find matches)│ │
│  └───────┬───────┘  │  └───────────────┘  └──────┬───────┘ │
│          │          │                            │          │
│  ┌───────▼───────┐  │                    ┌───────▼───────┐ │
│  │   Indexer     │  │                    │    Ranker     │ │
│  │(build index)  │──┼────Index Data─────→│ (score, sort) │ │
│  └───────────────┘  │                    └───────┬───────┘ │
│                     │                            │          │
│                     │                    ┌───────▼───────┐ │
│                     │                    │   Results     │ │
│                     │                    │  Formatter    │ │
│                     │                    └───────────────┘ │
└─────────────────────┴───────────────────────────────────────┘
```

### Key Components

| Component | Function | MicroSim Search Example |
|-----------|----------|------------------------|
| **Crawler** | Discovers and fetches documents | Scans GitHub repos for metadata.json files |
| **Indexer** | Processes and stores documents for fast retrieval | Extracts terms, builds inverted index |
| **Query Processor** | Parses user query | Handles boolean operators, synonyms |
| **Ranker** | Scores and orders results | Uses TF-IDF, metadata quality scores |
| **Results Formatter** | Presents results to user | Shows titles, descriptions, thumbnails |

### Client-Side vs Server-Side Search

For MicroSim search, we use **client-side search** powered by libraries like ItemsJS:

| Aspect | Server-Side Search | Client-Side Search |
|--------|-------------------|-------------------|
| **Where it runs** | Remote server | User's browser |
| **Data location** | Server database | JSON loaded in browser |
| **Latency** | Network round-trip | Instant (after load) |
| **Scalability** | Handles millions | Hundreds to thousands |
| **Infrastructure** | Requires server | Static files only |
| **Privacy** | Queries sent to server | Queries stay local |

For our MicroSim repository (hundreds of simulations), client-side search is ideal: instant results, no server costs, works offline, and respects user privacy.

---

## Indexing: The Secret to Speed

**Indexing** is the process of organizing documents for fast retrieval. Without an index, search would require reading every document for every query—impossibly slow for large collections. With an index, search becomes nearly instantaneous.

### The Book Analogy

Consider how you find information in a physical textbook:

**Without index (linear scan)**:
- Start at page 1
- Read every page looking for "momentum"
- Eventually find it on page 247
- Time: Several minutes

**With index (indexed lookup)**:
- Open to index at back of book
- Find "momentum: pages 247, 251, 289"
- Turn directly to page 247
- Time: Seconds

Search engine indexes work the same way, but for millions of documents.

### The Inverted Index

The most common search index structure is the **inverted index**. Instead of mapping documents to their words, it maps words to their documents.

**Document collection**:
```
Doc1: "pendulum physics simulation"
Doc2: "physics wave visualization"
Doc3: "pendulum wave interference"
```

**Inverted index**:
```
pendulum     → [Doc1, Doc3]
physics      → [Doc1, Doc2]
simulation   → [Doc1]
wave         → [Doc2, Doc3]
visualization→ [Doc2]
interference → [Doc3]
```

Now searching for "pendulum physics" is simple:
1. Look up "pendulum" → [Doc1, Doc3]
2. Look up "physics" → [Doc1, Doc2]
3. Intersect (AND): [Doc1]
4. Return Doc1

No need to read any document content—just follow the index.

### Index Construction for MicroSims

For MicroSim search, the index includes:

| Field | Index Type | Purpose |
|-------|-----------|---------|
| title | Full-text | Keyword search on titles |
| description | Full-text | Keyword search on descriptions |
| subject | Exact match | Faceted filtering |
| gradeLevel | Exact match | Faceted filtering |
| creator | Exact match | Author search |
| tags | Multi-value | Tag-based discovery |

**Tokenization** breaks text into searchable units:
- "Simple Harmonic Motion" → ["simple", "harmonic", "motion"]

**Normalization** standardizes terms:
- Lowercase: "Physics" → "physics"
- Remove punctuation: "p5.js" → "p5js" or ["p5", "js"]

#### Diagram: Inverted Index Visualizer

<iframe src="../../sims/inverted-index-viz/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Inverted Index Construction Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning Objective: Students will explain how inverted indexes enable fast search by watching the index construction process and tracing query lookups through the resulting data structure.

Canvas layout:
- Left panel (45%): Document collection
- Right panel (55%): Inverted index visualization

Visual elements:
- Document cards showing:
  - Document ID (Doc1, Doc2, etc.)
  - Title text
  - Highlight animation when indexed
- Inverted index displayed as:
  - Alphabetically sorted term list
  - Each term shows posting list (document IDs)
  - Lines connecting terms to their documents
- Query input and trace visualization
- Statistics: total terms, total postings, average postings per term

Interactive controls:
- Button: "Add Sample Document" (adds pre-defined MicroSim metadata)
- Text input: "Add Custom Document" with title field
- Button: "Build Index" (animates index construction)
- Query input: Search the index
- Button: "Trace Query" (shows lookup animation)
- Button: "Reset All"

Sample documents (pre-loaded):
1. "Pendulum Period Physics Simulation"
2. "Wave Interference Visualization"
3. "Simple Harmonic Motion Explorer"
4. "Physics Wave Propagation Demo"
5. "Pendulum Wave Art Generator"

Index construction animation:
1. Highlight first document
2. Extract terms, show tokenization
3. For each term, add to index (or update posting list)
4. Draw connection line from term to document
5. Repeat for all documents

Query trace animation:
1. User enters: "pendulum wave"
2. Highlight "pendulum" in index → show posting list [Doc1, Doc5]
3. Highlight "wave" in index → show posting list [Doc2, Doc3, Doc4, Doc5]
4. Show intersection (AND) or union (OR)
5. Highlight matching documents

Default state: 3 documents pre-loaded, index built

Color scheme:
- Documents: Light blue cards
- Index terms: White boxes with gray border
- Posting lists: Green highlights
- Query matches: Yellow/gold highlights

Animation: Smooth transitions, connection lines draw in, highlights pulse

Implementation: p5.js with animated graph rendering
</details>

---

## Search Quality in Practice

Now that you understand the fundamentals, let's see how they apply to real MicroSim search scenarios.

### Scenario 1: Teacher Preparing a Lesson

**Goal**: Find an interactive simulation about electromagnetic waves for high school physics

**Strategy**: High precision search (specific needs, limited time)

**Query progression**:
1. `electromagnetic waves` — 89 results, too many
2. `electromagnetic waves AND physics` — 45 results, still broad
3. `electromagnetic waves AND physics AND high-school` — 12 results, manageable
4. `electromagnetic waves AND physics AND high-school AND simulation` — 7 results, perfect

**Result**: Teacher quickly reviews 7 relevant options and picks the best one.

### Scenario 2: Curriculum Designer Cataloging Resources

**Goal**: Find ALL simulations related to wave phenomena for a curriculum audit

**Strategy**: High recall search (need comprehensive coverage)

**Query progression**:
1. `wave` — 150 results, good start
2. `wave OR waves OR waveform` — 180 results, catches variations
3. `(wave OR waves OR waveform) OR (oscillation OR harmonic)` — 220 results, related concepts
4. Review and tag all results

**Result**: Designer has comprehensive list of all wave-related resources.

### Scenario 3: AI System Finding Reference Examples

**Goal**: Find high-quality p5.js physics simulations to use as examples for code generation

**Strategy**: Balance of precision and recall with quality filtering

**Query**: `physics AND p5.js AND simulation`
**Filters**: Quality score > 80%, completeness > 70%, updated within 2 years

**Result**: AI gets curated list of well-documented, working examples to learn from.

---

## Key Takeaways

1. **Search is a superpower** for educators—mastering it means finding exactly what you need, when you need it

2. **Information retrieval** is the science behind search, involving indexing, matching, and ranking

3. **Precision** measures result quality (are results relevant?); **Recall** measures coverage (did we find everything?)

4. **The precision-recall trade-off**: More specific queries increase precision but decrease recall; broader queries do the opposite

5. **Relevance** is multidimensional—topical match, appropriate level, right format, good quality

6. **Ranking** determines which results appear first—the top positions get almost all the attention

7. **Keyword search** matches query terms to document content—simple and effective for most needs

8. **Boolean operators** provide precision control:
   - **AND** narrows (requires all terms)
   - **OR** broadens (accepts any term)
   - **NOT** excludes (filters unwanted)

9. **Search engines** combine crawling, indexing, query processing, and ranking into complete systems

10. **Inverted indexes** enable fast search by mapping terms to documents rather than documents to terms

---

## What's Next?

You now understand how search works at a fundamental level. In the coming chapters, we'll build on these foundations:

- **Faceted Search**: Filtering results by categories like subject, grade level, and framework
- **Semantic Search**: Using AI to find conceptually similar MicroSims, even without matching keywords
- **Embeddings**: The technology that makes semantic similarity possible

Your search superpower is just getting started.

---

*Ready to go beyond keywords? Continue to [Chapter 7: Faceted Search](../07-faceted-search/index.md).*
