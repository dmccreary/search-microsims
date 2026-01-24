---
title: Similar MicroSims Viewer
description: Find MicroSims that are semantically similar to any given MicroSim using precomputed embeddings and cosine similarity.
---

# Similar MicroSims Viewer

This tool displays the most semantically similar MicroSims for any given MicroSim URL. It uses precomputed similarity data derived from sentence embeddings.

## How to Use

1. Navigate to the [Similar MicroSims page](./main.html)
2. Add a `?id=` parameter with a MicroSim URL
3. View the top 10 most similar MicroSims with similarity scores

### Example URLs

- [Coordinate Plane Explorer](./main.html?id=https://dmccreary.github.io/algebra-1/sims/coordinate-plane/)
- [Graph Viewer](./main.html?id=https://dmccreary.github.io/algebra-1/sims/graph-viewer/)

## How It Works

The similarity system uses a batch preprocessing approach:

1. **Embeddings Generation:** Each MicroSim's metadata (title, description, learning objectives) is converted to a 384-dimensional vector using sentence-transformers
2. **Similarity Precomputation:** Cosine similarity is computed between all MicroSim pairs
3. **Compact Storage:** Only the top 10 most similar items per MicroSim are stored (~870 KB total)
4. **Fast Lookup:** The web app loads the small precomputed file for instant results

### Why Precompute?

Loading the full 7 MB embeddings file in a browser would be slow and memory-intensive. By precomputing similarities, we reduce the data to ~870 KB—fast enough for instant page loads.

## Integration with Search

Each result in the [Faceted Search](../../search/demo.html) includes a "Similar MicroSims" link that brings you to this viewer with the appropriate MicroSim pre-selected.

## Technical Details

- **Embedding Model:** all-MiniLM-L6-v2 (384 dimensions)
- **Similarity Metric:** Cosine similarity
- **Results per Query:** Top 10 most similar
- **Data File:** `similar-microsims.json` (~870 KB)

## Regenerating Data

When MicroSims are added or updated:

```bash
# Regenerate similarity lookup from embeddings
python3 src/generate-similar-microsims.py
```

See the [Search Workflow](../search-workflow/index.md) for the complete data pipeline.
