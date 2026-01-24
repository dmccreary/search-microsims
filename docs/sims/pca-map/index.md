# MicroSim PCA Map

An interactive 2D visualization of MicroSim embeddings using Principal Component Analysis (PCA) dimensionality reduction.

<iframe src="./main.html" width="100%" height="700px" style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></iframe>

[Open Full Screen](./main.html){ .md-button .md-button--primary }

## About This Visualization

This visualization projects 384-dimensional semantic embeddings of MicroSims into a 2D space using PCA. Each point represents a MicroSim, colored by subject area.

### Key Statistics

- **Total MicroSims**: 868
- **Variance Explained**: 11.2% (PC1: 6.5%, PC2: 4.7%)
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

## Related

- [MicroSim Search](../../search/demo.html) - Search MicroSims by facets
- [Embeddings Documentation](../../embeddings.md) - How embeddings are generated
