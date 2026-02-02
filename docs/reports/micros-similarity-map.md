# MicroSim Similarity Map

**Version:** 1.0.0
**Generated:** 2026-02-02
**Source:** [docs/reports/micros-similarity-map.md](https://github.com/dmccreary/search-microsims/blob/main/docs/reports/micros-similarity-map.md)

## Overview

This interactive visualization displays all MicroSims in a 2D similarity map where **similar MicroSims appear close together**. The map is generated using Principal Component Analysis (PCA) to reduce high-dimensional semantic embeddings into two dimensions that can be visualized.

[View Fullscreen](../sims/pca-map/main.html){ .md-button .md-button--primary }

## Interactive Map

<iframe
    src="../sims/pca-map/main.html"
    width="100%"
    height="700"
    style="border: 1px solid #ccc; border-radius: 8px;"
    title="MicroSim Similarity Map">
</iframe>

## How to Use

- **Hover** over any point to see the MicroSim title, description, and subject area
- **Click** on any point to open the MicroSim in a new tab
- **Legend filtering** - Click on subject areas in the legend to show/hide them
- **Check All / Uncheck All** - Use the buttons to quickly toggle all subject areas
- **Zoom and pan** - Use the Plotly toolbar to zoom into clusters of interest

## Understanding the Map

### What Does Position Mean?

Points that are **close together** represent MicroSims with similar:

- Learning objectives
- Subject matter
- Concepts covered
- Technical approaches
- Target audience

Points that are **far apart** represent MicroSims that differ significantly in their educational content or purpose.

### How It Works

1. **Metadata Extraction**: Each MicroSim's metadata (title, description, learning objectives, subject area, etc.) is combined into a text representation

2. **Semantic Embeddings**: The `all-MiniLM-L6-v2` model from SentenceTransformers converts each text into a 384-dimensional vector that captures semantic meaning

3. **Dimensionality Reduction**: PCA reduces these 384 dimensions to 2 dimensions while preserving as much variance (similarity relationships) as possible

4. **Visualization**: The 2D coordinates are plotted using Plotly with color-coding by subject area

### Why PCA?

Principal Component Analysis finds the directions of maximum variance in the data. The first principal component (x-axis) captures the direction of greatest variation between MicroSims, while the second (y-axis) captures the next most significant direction of variation.

This means:

- The **x-axis** typically separates MicroSims by their most distinguishing characteristic (often subject area or primary learning domain)
- The **y-axis** captures secondary distinguishing features (often visualization type, complexity level, or sub-topic)

## Clusters and Patterns

Look for:

- **Subject area clusters** - MicroSims of the same subject often form visible groups
- **Cross-subject bridges** - MicroSims that span multiple disciplines appear between clusters
- **Outliers** - Unique or highly specialized MicroSims appear at the edges

## Technical Details

| Aspect | Value |
|--------|-------|
| Embedding Model | all-MiniLM-L6-v2 |
| Original Dimensions | 384 |
| Reduced Dimensions | 2 |
| Reduction Method | PCA |
| Visualization Library | Plotly.js |

## Related Resources

- [Faceted Search](../search/demo.md) - Search MicroSims by filters
- [Similar MicroSims Finder](../sims/list-similar-microsim/index.md) - Find similar MicroSims for any given URL
- [Metadata Quality Report](microsim-metrics.md) - Quality metrics for MicroSim metadata

---

*This visualization is generated from embeddings created by `src/embeddings/generate-embeddings.py`*
