---
title: MicroSim Similarity Map
description: An interactive 2D visualization of MicroSim semantic embeddings using Principal Component Analysis (PCA) dimensionality reduction, showing clusters by subject area.
image: /sims/pca-map/pca-map.jpg
og:image: /sims/pca-map/pca-map.jpg
quality_score: 95
---

# MicroSim Similarity Map

An interactive 2D visualization of MicroSim similarity.  Each dot represents
a MicroSim and dots that are near each other are more similar.

This plot used embeddings created from the MicroSim metadata JSON file and Principal Component Analysis (PCA) for dimensionality reduction.

<iframe src="./main.html" width="100%" height="700px"></iframe>

[Open Full Screen](./main.html){ .md-button .md-button--primary }

```html
<iframe src="https://dmccreary.github.io/microsim-search/sims/pca-map/main.html" width="100%" height="700px"></iframe>
```

## About This Visualization

This visualization projects 384-dimensional semantic embeddings of MicroSims into a 2D space using PCA. Each point represents a MicroSim, colored by subject area.

### Key Statistics

- **Total MicroSims**: 868
- **Subject Areas**: 14 categories

### How to Use

1. **Hover** over points to see MicroSim details (title, repository)
2. **Click** on any point to open the MicroSim in a new tab
3. **Use the legend** to show/hide subject areas
4. **Zoom and pan** to explore clusters

### Interpreting the Map

- **Clusters** indicate semantically similar MicroSims
- **Distance** between points reflects semantic similarity in the embedding space
- Points from the same subject area tend to cluster together, but cross-subject clustering reveals shared educational concepts

## Technical Details

The embeddings were generated using the `all-MiniLM-L6-v2` sentence transformer model on combined MicroSim metadata (title, description, learning objectives). PCA reduces the 384-dimensional vectors to 2D for visualization.

### Files

| File | Description |
|------|-------------|
| `main.html` | Main HTML page |
| `style.css` | CSS styles |
| `script.js` | JavaScript for loading data and creating the Plotly visualization |
| `data.json` | Plotly data and layout configuration |

## Lesson Plan

### Overview

This lesson introduces fundamental concepts in machine learning and data science: embeddings, similarity, clustering, and dimensionality reduction. Students will use this interactive visualization to explore how computers can understand and organize text by meaning.

### Learning Objectives

By the end of this lesson, students will be able to:

1. Explain what an embedding is and why it is useful
2. Describe how similarity is measured between items in an embedding space
3. Identify clusters in a visualization and explain what they represent
4. Understand why dimensionality reduction is necessary for visualization
5. Apply these concepts to interpret real-world data visualizations

### Target Audience

- High school students (grades 10-12) or college freshmen
- Adult learners interested in AI/ML fundamentals
- No programming experience required
- Basic math familiarity helpful but not required

### Prerequisites

- Ability to use a web browser and interact with visualizations
- Understanding of basic concepts like "similar" and "different"

### Key Concepts

#### What is an Embedding?

An **embedding** is a way to represent something (like a word, sentence, or document) as a list of numbers. Think of it like giving everything a unique "address" in a mathematical space.

**Analogy**: Imagine describing a fruit using numbers:

- Sweetness: 1-10
- Size: 1-10
- Color (red to green): 1-10

An apple might be [7, 5, 8] while an orange might be [8, 6, 2]. These number lists are simple embeddings!

In this visualization, each MicroSim is represented by 384 numbers that capture its meaning based on its title, description, and learning objectives.

#### What is Similarity?

**Similarity** measures how close two items are in the embedding space. Items with similar meanings have similar number patterns.

**In the visualization**: Points that are close together represent MicroSims with similar educational content. Points far apart cover different topics.

#### What is Clustering?

A **cluster** is a group of items that are similar to each other and different from items in other groups. Clusters emerge naturally when similar things group together.

**In the visualization**: You can see clusters of points with the same color (subject area), but also notice how some subjects overlap - this reveals shared concepts across disciplines.

#### What is Dimensionality Reduction (PCA)?

We cannot visualize 384 dimensions on a 2D screen. **Principal Component Analysis (PCA)** is a technique that reduces the 384 numbers to just 2 numbers (x and y coordinates) while preserving as much of the "structure" as possible.

**Analogy**: Imagine taking a 3D object and casting its shadow on a wall. You lose some information, but the shadow still tells you something about the object's shape.

### Activities

#### Activity 1: Explore the Map (10 minutes)

1. Look at the visualization without clicking anything
2. **Observe**: Which subject areas form tight clusters? Which are spread out?
3. **Discuss**: Why might "Mathematics" MicroSims cluster together?

#### Activity 2: Find Surprising Neighbors (15 minutes)

1. Click on a MicroSim point to open it
2. Find a nearby point from a *different* subject area
3. Open that MicroSim and compare them
4. **Question**: What do these two MicroSims have in common that made the computer place them near each other?
5. Share your findings with the class

#### Activity 3: Subject Area Investigation (15 minutes)

1. Use the "Uncheck All" button to hide all points
2. Check only ONE subject area at a time
3. **Observe**: Does this subject form one cluster or multiple clusters?
4. **Hypothesize**: If a subject has multiple clusters, what might explain this?
5. Try this with 3-4 different subject areas

#### Activity 4: Cross-Disciplinary Connections (20 minutes)

1. Check two subject areas that you think might be related (e.g., Physics and Mathematics)
2. **Find**: Where do they overlap? Where are they separate?
3. Check two subject areas you think are unrelated
4. **Verify**: Are they actually far apart in the visualization?
5. **Write**: A short paragraph explaining one surprising connection you discovered

#### Activity 5: Limitations Discussion (10 minutes)

1. The visualization only captures 11.2% of the original information (variance explained)
2. **Discuss**: What information might be lost in this 2D view?
3. **Consider**: Could two MicroSims appear close in 2D but actually be far apart in the original 384 dimensions?

### Discussion Questions

1. Why do computers need to convert text into numbers to understand meaning?
2. What are the advantages of using embeddings instead of simple keyword matching?
3. If you were building a "recommended MicroSims" feature, how could you use this similarity information?
4. What other types of content could be visualized using embeddings? (images, music, products?)
5. What biases might exist in how the embedding model understands "similarity"?

### Assessment

#### Formative Assessment

- Observe student interactions with the visualization
- Listen to partner discussions during activities
- Check for accurate use of vocabulary (embedding, similarity, cluster)

#### Summative Assessment Options

**Option A - Written Response**:
Explain in your own words how this visualization was created, starting from MicroSim descriptions and ending with colored dots on a 2D map. Use the terms: embedding, similarity, dimensionality reduction.

**Option B - Create an Analogy**:
Create your own analogy for embeddings using a real-world example (like the fruit example above). Explain how your analogy demonstrates similarity and clustering.

**Option C - Analysis Report**:
Choose one subject area and write a 1-page analysis of its clustering patterns. Include screenshots, identify at least 2 sub-clusters, and hypothesize why they exist.

### Extensions

- **For advanced students**: Explore the [Embeddings Documentation](../../chapters/08-embeddings-semantic-search/index.md) to learn how embeddings are generated with code
- **Cross-curricular**: Connect to biology (taxonomy/classification), library science (cataloging), or social studies (demographic clustering)
- **Project idea**: Have students suggest what additional metadata would improve the embeddings (e.g., difficulty level, interactivity type)

## Related

- [MicroSim Search](../../search/demo.html) - Search MicroSims by facets
- [Embeddings Documentation](../../chapters/08-embeddings-semantic-search/index.md) - How embeddings are generated

## References

1. [Plotly.js](https://plotly.com/javascript/) - Open-source JavaScript graphing library used for the interactive scatter plot visualization
2. [Sentence Transformers](https://www.sbert.net/) - Python framework for state-of-the-art sentence, text, and image embeddings
3. [all-MiniLM-L6-v2 Model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) - Sentence transformer model that maps sentences to a 384-dimensional dense vector space
4. [scikit-learn PCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html) - Principal Component Analysis implementation used for dimensionality reduction
5. [Principal Component Analysis (Wikipedia)](https://en.wikipedia.org/wiki/Principal_component_analysis) - Background on the PCA algorithm for dimensionality reduction
