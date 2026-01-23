# MicroSim Embeddings Generator

This module generates semantic embeddings for MicroSims, enabling similarity search and semantic matching capabilities for the MicroSim search system.

## Overview

The embedding generator reads MicroSim metadata from `docs/search/microsims-data.json` and creates 384-dimensional vector embeddings for each MicroSim using the [Sentence Transformers](https://www.sbert.net/) library with the `all-MiniLM-L6-v2` model.

Each MicroSim is identified by its unique URL (e.g., `https://dmccreary.github.io/algebra-1/sims/graph-viewer/`), which serves as a stable identifier even when the search data is updated.

## Output

The generator produces `data/microsims-embeddings.json` with the following structure:

```json
{
  "metadata": {
    "model": "all-MiniLM-L6-v2",
    "dimension": 384,
    "count": 873,
    "generated_at": "2026-01-23T19:21:57Z",
    "source_file": "microsims-data.json"
  },
  "embeddings": {
    "https://dmccreary.github.io/algebra-1/sims/graph-viewer/": [0.012, -0.045, 0.089, ...],
    "https://dmccreary.github.io/geometry-course/sims/angle-explorer/": [0.034, 0.021, -0.067, ...],
    ...
  }
}
```

### Metadata Fields

| Field | Description |
|-------|-------------|
| `model` | The Sentence Transformers model used for embedding |
| `dimension` | Number of dimensions in each embedding vector |
| `count` | Total number of MicroSims embedded |
| `generated_at` | ISO 8601 timestamp of when embeddings were generated |
| `source_file` | The input file used to generate embeddings |

## Requirements

### Python Version

**Python 3.12 or earlier is required.** PyTorch (a dependency of sentence-transformers) does not yet support Python 3.13.

### Virtual Environment Setup

A dedicated virtual environment is recommended to avoid dependency conflicts:

```bash
# Install pyenv if not already installed
brew install pyenv

# Install Python 3.12
pyenv install 3.12.8

# Create virtual environment from project root
~/.pyenv/versions/3.12.8/bin/python -m venv .venv-embeddings

# Activate the environment
source .venv-embeddings/bin/activate

# Install dependencies
pip install sentence-transformers
```

### Dependencies

- `sentence-transformers>=2.0.0` - Provides the embedding model
- `torch>=1.11.0` - PyTorch backend (installed automatically)
- `transformers>=4.41.0` - Hugging Face transformers (installed automatically)

## Usage

### Generate Embeddings

From the project root directory:

```bash
# Activate the virtual environment
source .venv-embeddings/bin/activate

# Run the generator
python src/embeddings/generate-embeddings.py
```

### Expected Output

```
MicroSim Embedding Generator
==================================================
Model: all-MiniLM-L6-v2
Input: /path/to/docs/search/microsims-data.json
Output: /path/to/data/microsims-embeddings.json

Loading MicroSims data...
Found 873 MicroSims

Loading embedding model 'all-MiniLM-L6-v2'...
(This may take a moment on first run as the model downloads)
Model loaded. Embedding dimension: 384

Preparing texts for embedding...
Prepared 873 MicroSims for embedding

Generating embeddings...
Batches: 100%|██████████| 28/28 [00:15<00:00,  1.81it/s]
Generated 873 embeddings

Building output structure...

Saving embeddings to /path/to/data/microsims-embeddings.json...
Saved! File size: 7.05 MB

==================================================
Summary:
  - Total MicroSims processed: 873
  - Embedding dimension: 384
  - Output file: data/microsims-embeddings.json
  - File size: 7.05 MB

Done!
```

## How Embeddings Are Created

The generator creates a rich text representation for each MicroSim by combining multiple metadata fields:

### Fields Used for Embedding

| Field | Weight | Description |
|-------|--------|-------------|
| `title` | High | The name of the MicroSim |
| `description` | High | Detailed description (excludes iframe tags) |
| `topic` | Medium | The specific topic covered |
| `subjects` | Medium | Subject areas (Mathematics, Physics, etc.) |
| `gradeLevel` | Low | Target grade level |
| `learningObjectives` | High | What students will learn (up to 5) |
| `prerequisites` | Medium | Required prior knowledge (up to 3) |
| `keywords` | Medium | Associated keywords/tags |
| `visualizationType` | Low | Type of visualization (animation, chart, etc.) |
| `framework` | Low | JavaScript framework used (p5.js, d3.js, etc.) |
| `bloomsTaxonomy` | Low | Cognitive level (Remember, Understand, Apply, etc.) |
| `_source.repo` | Low | Course/repository name |

### Example Embedding Text

For a MicroSim, the generated text might look like:

```
Title: Coordinate Plane Explorer | Description: An interactive MicroSim that helps
students understand the coordinate plane structure... | Topic: Coordinate Plane and
Cartesian Coordinates | Subjects: Mathematics | Grade Level: 6-8 | Learning Objectives:
Identify and label the x-axis, y-axis, and origin; Understand the structure and numbering
of the four quadrants; Plot points accurately using ordered pairs | Prerequisites:
Understanding of positive and negative numbers; Basic number line concepts |
Visualization: interactive-demo, graph | Framework: p5.js | Cognitive Level: Understand,
Apply | Course: Algebra 1
```

## Using Embeddings

### Loading Embeddings in Python

```python
import json
import numpy as np

# Load embeddings
with open('data/microsims-embeddings.json', 'r') as f:
    data = json.load(f)

# Access metadata
print(f"Model: {data['metadata']['model']}")
print(f"Dimension: {data['metadata']['dimension']}")
print(f"Count: {data['metadata']['count']}")

# Get embedding for a specific MicroSim
url = "https://dmccreary.github.io/algebra-1/sims/graph-viewer/"
embedding = np.array(data['embeddings'][url])
print(f"Embedding shape: {embedding.shape}")  # (384,)
```

### Similarity Search

```python
from sentence_transformers import SentenceTransformer
import numpy as np

# Load the same model used for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load embeddings
with open('data/microsims-embeddings.json', 'r') as f:
    data = json.load(f)

# Create query embedding
query = "interactive graph for learning about functions"
query_embedding = model.encode(query)

# Calculate cosine similarity with all MicroSims
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

similarities = []
for url, embedding in data['embeddings'].items():
    sim = cosine_similarity(query_embedding, np.array(embedding))
    similarities.append((url, sim))

# Sort by similarity (highest first)
similarities.sort(key=lambda x: x[1], reverse=True)

# Top 5 results
print("Top 5 most similar MicroSims:")
for url, score in similarities[:5]:
    print(f"  {score:.4f}: {url}")
```

### JavaScript Usage (Browser)

```javascript
// Load embeddings
const response = await fetch('data/microsims-embeddings.json');
const data = await response.json();

// Cosine similarity function
function cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Find similar MicroSims given a query embedding
function findSimilar(queryEmbedding, topK = 5) {
    const similarities = Object.entries(data.embeddings)
        .map(([url, embedding]) => ({
            url,
            score: cosineSimilarity(queryEmbedding, embedding)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
    return similarities;
}
```

## Model Information

### all-MiniLM-L6-v2

- **Dimensions**: 384
- **Max Sequence Length**: 256 tokens
- **Performance**: Good balance of speed and quality
- **Size**: ~80MB
- **Training**: Trained on 1B+ sentence pairs
- **Use Case**: Semantic similarity, clustering, information retrieval

For more information, see the [model card on Hugging Face](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2).

### Alternative Models

If you need different characteristics, you can modify `MODEL_NAME` in the script:

| Model | Dimensions | Quality | Speed |
|-------|------------|---------|-------|
| `all-MiniLM-L6-v2` | 384 | Good | Fast |
| `all-MiniLM-L12-v2` | 384 | Better | Medium |
| `all-mpnet-base-v2` | 768 | Best | Slower |
| `paraphrase-MiniLM-L6-v2` | 384 | Good (paraphrase) | Fast |

## Troubleshooting

### PyTorch Not Found

```
ERROR: No matching distribution found for torch
```

**Solution**: Use Python 3.12 or earlier. PyTorch doesn't support Python 3.13 yet.

### NumPy Compatibility Error

```
A module that was compiled using NumPy 1.x cannot be run in NumPy 2.x
```

**Solution**: Downgrade NumPy:
```bash
pip install 'numpy<2' --force-reinstall
```

### Model Download Fails

The first run downloads the model (~80MB). If it fails:

1. Check your internet connection
2. Try running again (partial downloads resume)
3. Manually download from [Hugging Face](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)

### Out of Memory

For very large datasets, reduce batch size in the script:
```python
embeddings = model.encode(texts, batch_size=16, ...)  # Default is 32
```

## Regenerating Embeddings

Embeddings should be regenerated when:

1. **New MicroSims are added** - Run after crawling new metadata
2. **Metadata is updated** - Significant changes to titles, descriptions, or learning objectives
3. **Model is changed** - If switching to a different embedding model

The URL-based identification ensures that updated embeddings correctly map to their MicroSims even if the order in `microsims-data.json` changes.

## File Structure

```
search-microsims/
├── src/
│   └── embeddings/
│       ├── generate-embeddings.py  # Main generator script
│       └── README.md               # This documentation
├── data/
│   └── microsims-embeddings.json   # Generated embeddings (7MB)
├── docs/
│   └── search/
│       └── microsims-data.json     # Input metadata
└── .venv-embeddings/               # Python 3.12 virtual environment (gitignored)
```
