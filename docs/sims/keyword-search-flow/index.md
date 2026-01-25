---
title: Keywords to Search Results Flow
description: Step-through visualization showing how user search queries are processed through tokenization, keyword matching, and ranking to produce ordered MicroSim results.
image: /sims/keyword-search-flow/keyword-search-flow.png
og:image: /sims/keyword-search-flow/keyword-search-flow.png
twitter:image: /sims/keyword-search-flow/keyword-search-flow.png
quality_score: 90
social:
   cards: false
---

# Keywords to Search Results Flow

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Keywords to Search Results Flow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Keywords to Search Results Flow MicroSim Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/)

## About This MicroSim

This step-through visualization demonstrates how search queries flow from user input through keyword matching to produce ranked search results. Unlike animated visualizations, this design uses **worked examples** that let you see the actual data transformations at each stage.

### The Five Stages

1. **User Query** - The raw query string and inferred intent
2. **Query Processing** - Tokenization, normalization (stemming), stop word removal, and synonym expansion
3. **Keyword Matching** - Comparing expanded terms against MicroSim metadata, showing match counts
4. **Ranking** - Applying scoring rules (exact match +10, synonym +3, etc.) to calculate final scores
5. **Results** - Ordered list with rank badges, scores, and highlighted matching keywords

### Example Queries Included

- "physics ball throwing simulation" - demonstrates synonym expansion (throwing → projectile)
- "interactive graph visualization" - shows ambiguity resolution (graph → network, chart)
- "pendulum motion for kids" - demonstrates grade-level matching and stop word removal
- "sorting algorithm animation" - shows exact vs. partial matching

## Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/microsim-search/sims/keyword-search-flow/main.html"
        height="552px"
        width="100%"
        scrolling="no">
</iframe>
```

## How to Use

1. **Select a query** from the dropdown menu
2. **Click "Next →"** to advance through each stage
3. **Observe the data** - see exactly how the query transforms at each step
4. **Compare queries** - switch between examples to see how different queries produce different results

### Predict-Test-Observe

Before clicking "Next," try to predict:

- What tokens will result from the query?
- Which synonyms might be expanded?
- Which MicroSims will score highest and why?

## Learning Objectives

After using this MicroSim, students will be able to:

- **Explain** how keywords in metadata connect user search queries to relevant results
- **Describe** the role of tokenization, normalization, and synonym expansion in search
- **Calculate** match scores using weighted factors (exact, partial, synonym matches)
- **Predict** which results will rank highest based on keyword overlap

## Lesson Plan

### Introduction (5 minutes)

Ask students: "When you search for 'physics ball throwing,' why does a 'Projectile Motion Simulator' appear in the results even though it doesn't contain the word 'throwing'?"

### Guided Exploration (15 minutes)

Walk through the first example ("physics ball throwing simulation") together:

1. **Stage 1**: Note the raw query and discuss user intent
2. **Stage 2**: Observe tokenization and ask students to predict synonyms before revealing
3. **Stage 3**: Count matches and predict which MicroSim will rank highest
4. **Stage 4**: Verify predictions by examining score calculations
5. **Stage 5**: Discuss why the ranking order makes sense

### Independent Practice (10 minutes)

Have students explore the other three queries and complete a worksheet:

| Query | Predicted Top Result | Actual Top Result | Key Insight |
|-------|---------------------|-------------------|-------------|
| interactive graph visualization | ? | ? | ? |
| pendulum motion for kids | ? | ? | ? |
| sorting algorithm animation | ? | ? | ? |

### Discussion (5 minutes)

- Why does "pendulum motion for kids" rank "Simple Pendulum" above "Pendulum Period Explorer"?
- What role does metadata quality play in ranking?
- How could you improve a MicroSim's discoverability?

### Assessment

Students should be able to:

1. Trace a novel query through all five stages
2. Explain why synonym expansion improves search results
3. Calculate a match score given scoring rules

## Instructional Design Notes

This MicroSim was redesigned from an animation-based approach to a step-through approach based on instructional design principles:

| Principle | Implementation |
|-----------|----------------|
| **Worked Examples** | Four complete query examples with all transformations shown |
| **Self-Paced Learning** | Next/Previous buttons instead of continuous animation |
| **Predict-Test-Observe** | Students can predict before clicking Next |
| **Reduced Cognitive Load** | No distracting animation; focus on data content |
| **Concrete Data** | Shows actual arrays, scores, and matches—not abstract particles |

## Technical Details

- **Framework**: p5.js 1.11.10
- **Canvas Size**: Width-responsive, 500px draw height + 50px control area
- **Controls**: Query dropdown, Previous/Next navigation buttons
- **Data**: Four pre-built example queries with complete stage-by-stage transformations

## References

- [Dublin Core Metadata Initiative](https://dublincore.org/)
- [Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/)
- [Worked Example Effect in Learning](https://www.learningscientists.org/blog/2016/8/11-1)
- [Cognitive Load Theory](https://www.instructionaldesign.org/theories/cognitive-load/)
