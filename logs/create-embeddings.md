# Create Embeddings Session Log

**Date:** 2026-01-23
**Purpose:** Create a Python program to generate semantic embeddings for MicroSims

## Task Summary

Created a system to generate 384-dimensional semantic embeddings for 873 MicroSims using Sentence Transformers, enabling future similarity search capabilities.

## Steps Completed

### 1. Initial Analysis

- Examined `docs/search/microsims-data.json` structure
- Found 873 MicroSims with varying metadata schemas
- Identified URL as the unique identifier (e.g., `https://dmccreary.github.io/algebra-1/sims/graph-viewer/`)

### 2. Embedding Model Selection

User chose **Sentence Transformers (all-MiniLM-L6-v2)**:
- Free, runs locally
- 384 dimensions
- Good balance of speed and quality

### 3. Python Environment Setup

**Challenge:** PyTorch doesn't support Python 3.13 yet.

**Solution:** Installed Python 3.12 via pyenv:
```bash
brew install pyenv
pyenv install 3.12.8
~/.pyenv/versions/3.12.8/bin/python -m venv .venv-embeddings
source .venv-embeddings/bin/activate
pip install sentence-transformers
pip install 'numpy<2' --force-reinstall  # NumPy 2.x incompatible with torch 2.2.2
```

### 4. Created Generator Script

Initial location: `src/generate-embeddings.py`
Final location: `src/embeddings/generate-embeddings.py`

**Key features:**
- Combines multiple metadata fields into rich embedding text
- Uses URL as unique identifier for each MicroSim
- Handles nested list structures in metadata (bug fix)
- Outputs to `data/microsims-embeddings.json`

**Fields used for embedding text:**
- title (high weight)
- description (high weight, excludes iframe tags)
- topic
- subjects
- gradeLevel
- learningObjectives (up to 5)
- prerequisites (up to 3)
- keywords
- visualizationType
- framework
- bloomsTaxonomy
- course name from _source.repo

### 5. Bug Fixes

**Issue:** Some `subjects` fields contained nested lists instead of strings.

**Solution:** Added `flatten_to_strings()` helper function to recursively flatten nested lists.

**Issue:** NumPy 2.4.1 incompatible with PyTorch 2.2.2.

**Solution:** Downgraded to NumPy 1.26.4.

**Issue:** Deprecated `datetime.utcnow()` warning.

**Solution:** Changed to `datetime.now(timezone.utc)`.

### 6. Successful Generation

```
MicroSim Embedding Generator
==================================================
Model: all-MiniLM-L6-v2
Input: docs/search/microsims-data.json
Output: data/microsims-embeddings.json

Found 873 MicroSims
Embedding dimension: 384
Generated 873 embeddings
File size: 7.05 MB
```

### 7. Reorganization

Moved to dedicated folder with documentation:
```
src/embeddings/
├── generate-embeddings.py   # Main generator script
└── README.md                # Extensive documentation
```

### 8. Documentation Updates

**Updated `CLAUDE.md`:**
- Added embeddings generation commands
- Added new files to Key Files table

**Updated `.gitignore`:**
- Added `.venv-embeddings`

**Created `src/embeddings/README.md`:**
- Overview and output structure
- Python version requirements
- Virtual environment setup
- Usage examples
- Python and JavaScript code examples for similarity search
- Model information and alternatives
- Troubleshooting guide

## Output Files

| File | Size | Description |
|------|------|-------------|
| `data/microsims-embeddings.json` | 7.05 MB | 873 embeddings, 384 dimensions each |
| `src/embeddings/generate-embeddings.py` | 8.5 KB | Generator script |
| `src/embeddings/README.md` | 10 KB | Documentation |

## Output Structure

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
    "https://dmccreary.github.io/algebra-1/sims/graph-viewer/": [0.012, -0.045, ...],
    ...
  }
}
```

## Usage

### Regenerate Embeddings
```bash
source .venv-embeddings/bin/activate
python src/embeddings/generate-embeddings.py
```

### Similarity Search Example (Python)
```python
from sentence_transformers import SentenceTransformer
import numpy as np
import json

model = SentenceTransformer('all-MiniLM-L6-v2')
with open('data/microsims-embeddings.json') as f:
    data = json.load(f)

query = "interactive graph for learning about functions"
query_embedding = model.encode(query)

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

similarities = [
    (url, cosine_similarity(query_embedding, np.array(emb)))
    for url, emb in data['embeddings'].items()
]
similarities.sort(key=lambda x: x[1], reverse=True)

for url, score in similarities[:5]:
    print(f"{score:.4f}: {url}")
```

## Dependencies Installed

In `.venv-embeddings`:
- sentence-transformers 5.2.0
- torch 2.2.2
- transformers 4.57.6
- numpy 1.26.4
- scipy 1.17.0
- scikit-learn 1.8.0
- huggingface-hub 0.36.0

## Notes

- PyTorch requires Python 3.12 or earlier (no 3.13 support yet)
- The all-MiniLM-L6-v2 model downloads automatically on first run (~80MB)
- Embedding generation takes ~15 seconds for 873 MicroSims on CPU
- URLs serve as stable identifiers even when search data is updated
