---
title: MicroSim Search Application Workflow
description: Interactive workflow diagram showing the complete data pipeline for the MicroSim faceted search system, from crawling GitHub repositories to serving web applications.
image: /sims/search-workflow/main.html
quality_score: 85
---

# MicroSim Search Application Workflow

This interactive diagram illustrates the complete data pipeline for the MicroSim search application, from harvesting metadata to serving fast, interactive web applications.

<iframe src="./main.html" width="100%" height="600" style="border:1px solid #ddd; border-radius:8px;"></iframe>

[View Fullscreen](./main.html){ .md-button .md-button--primary }

## Overview

The MicroSim search system uses a batch processing approach to enable fast, client-side search and similarity lookups without requiring a backend server. The key insight is that expensive computations (embeddings, similarity matrices, PCA projections) are done once during build time, producing small files that web browsers can load instantly.

## Workflow Steps

### Step 1: Crawl Metadata
- **Script:** `src/crawl-microsims.py`
- **Input:** GitHub API (dmccreary/* repositories)
- **Output:** `docs/search/microsims-data.json` (~500 KB)
- **Description:** Fetches metadata.json files from all MicroSim directories across repositories. Normalizes varying schema formats and combines into a single searchable JSON file.

### Step 2: Generate Embeddings
- **Script:** `src/embeddings/generate-embeddings.py`
- **Input:** microsims-data.json
- **Output:** `data/microsims-embeddings.json` (7 MB)
- **Description:** Uses sentence-transformers (all-MiniLM-L6-v2) to create 384-dimensional semantic vectors from titles, descriptions, and learning objectives.

!!! warning "Large File"
    The embeddings file is 7 MB and should **never be loaded directly** by web applications or read by Claude Code. It is used only as input to batch processing scripts.

### Step 3: Precompute Similarities
- **Script:** `src/generate-similar-microsims.py`
- **Input:** microsims-embeddings.json (7 MB)
- **Output:** `docs/search/similar-microsims.json` (~870 KB)
- **Description:** Computes cosine similarity between all MicroSim pairs and stores the top 10 most similar items for each MicroSim in a compact lookup table.

### Step 4: Generate PCA Projection
- **Script:** `src/generate-pca.py`
- **Input:** microsims-embeddings.json (7 MB)
- **Output:** `docs/search/pca-projection.json` (~50 KB)
- **Description:** Reduces 384-dimensional embeddings to 2D coordinates using Principal Component Analysis for visualization on a scatter plot.

### Step 5: Web Applications
Three web applications load the precomputed small files:

| Application | Data Files Loaded | Purpose |
|-------------|-------------------|---------|
| Faceted Search | microsims-data.json (500 KB) | Filter by subject, level, framework |
| Similar MicroSims | similar-microsims.json (870 KB) + metadata | Find related simulations |
| PCA Map | pca-projection.json (50 KB) + metadata | Visual exploration by similarity |

## Key Design Decisions

### Why Precompute?
- **Fast load times:** Web apps load <1 MB instead of 7 MB
- **No backend required:** Pure client-side JavaScript
- **Instant interactions:** No network latency for similarity queries
- **GitHub Pages compatible:** Static file hosting only

### File Size Comparison

| File | Size | Loaded by Browser? |
|------|------|-------------------|
| microsims-data.json | ~500 KB | Yes |
| similar-microsims.json | ~870 KB | Yes |
| pca-projection.json | ~50 KB | Yes |
| microsims-embeddings.json | 7 MB | **No** |

## Regenerating Data

When MicroSims are added or updated:

```bash
# 1. Re-crawl metadata
python3 src/crawl-microsims.py

# 2. Regenerate embeddings (requires Python 3.12)
source .venv-embeddings/bin/activate
python src/embeddings/generate-embeddings.py

# 3. Regenerate similarity lookup
python3 src/generate-similar-microsims.py

# 4. Regenerate PCA projection
python3 src/generate-pca.py
```

## Lesson Plan

### Learning Objectives
- Understand the trade-offs between runtime computation and build-time preprocessing
- Explain why large files should be processed into smaller derivatives
- Identify the role of embeddings in semantic similarity search

### Activities
1. **Trace the data flow:** Follow a single MicroSim's metadata from GitHub through each processing step
2. **Compare file sizes:** Examine the compression ratio between embeddings and precomputed files
3. **Modify and rebuild:** Add a new MicroSim and run the full pipeline

### Assessment
- What is the main advantage of precomputing similarity data?
- Why can't the 7 MB embeddings file be loaded directly in the browser?
- How does PCA enable 2D visualization of high-dimensional data?

## References

- [Sentence Transformers Documentation](https://www.sbert.net/)
- [ItemsJS Library](https://github.com/itemsapi/itemsjs)
- [Principal Component Analysis (Wikipedia)](https://en.wikipedia.org/wiki/Principal_component_analysis)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
