#!/usr/bin/env python3
"""
Generate Similar MicroSims Lookup File

Reads the embeddings file and precomputes the top N most similar MicroSims
for each MicroSim. Outputs a compact JSON file for use by the web application.

Usage:
    python src/generate-similar-microsims.py

Output:
    docs/search/similar-microsims.json
"""

import json
import os
import tempfile
import numpy as np
from pathlib import Path
from datetime import datetime, timezone


def atomic_write_json(path: Path, obj, **dump_kwargs):
    """Write JSON atomically (temp file in same dir + os.replace)."""
    path = Path(path)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(obj, f, **dump_kwargs)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)

# Configuration
NUM_SIMILAR = 10  # Number of similar MicroSims to store per item
EMBEDDINGS_PATH = Path("data/microsims-embeddings.json")
OUTPUT_PATH = Path("docs/search/similar-microsims.json")


def get_what_vector(entry):
    """
    Extract the WHAT vector from an embeddings entry.

    Supports the dual-v1 schema ({"what": [...], "how": [...]}) and the
    legacy flat format (a plain list). "Similar MicroSims" on the website
    means "teaches a related concept", so the WHAT vector is the right one.
    """
    if isinstance(entry, dict):
        return entry["what"]
    return entry


def cosine_similarity_matrix(embeddings: np.ndarray) -> np.ndarray:
    """
    Compute cosine similarity matrix for all embeddings.

    Args:
        embeddings: numpy array of shape (n_items, embedding_dim)

    Returns:
        Similarity matrix of shape (n_items, n_items)
    """
    # Normalize embeddings to unit vectors
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    normalized = embeddings / norms

    # Cosine similarity is just dot product of normalized vectors
    similarity_matrix = np.dot(normalized, normalized.T)

    return similarity_matrix


def main():
    print("=" * 60)
    print("Similar MicroSims Generator")
    print("=" * 60)
    print(f"Input:  {EMBEDDINGS_PATH}")
    print(f"Output: {OUTPUT_PATH}")
    print(f"Top N:  {NUM_SIMILAR}")
    print()

    # Load embeddings
    print("Loading embeddings...")
    with open(EMBEDDINGS_PATH, 'r') as f:
        data = json.load(f)

    metadata = data['metadata']
    embeddings_dict = data['embeddings']

    print(f"  Model: {metadata['model']}")
    print(f"  Dimension: {metadata['dimension']}")
    print(f"  Count: {metadata['count']}")
    print()

    # Convert to numpy arrays
    print("Building similarity matrix...")
    urls = list(embeddings_dict.keys())
    embeddings = np.array([get_what_vector(embeddings_dict[url]) for url in urls])

    print(f"  Embeddings shape: {embeddings.shape}")

    # Compute similarity matrix
    similarity_matrix = cosine_similarity_matrix(embeddings)
    print(f"  Similarity matrix shape: {similarity_matrix.shape}")
    print()

    # For each MicroSim, find top N similar (excluding self)
    print(f"Finding top {NUM_SIMILAR} similar MicroSims for each item...")
    similar_lookup = {}

    for i, url in enumerate(urls):
        # Get similarities for this item
        similarities = similarity_matrix[i]

        # Get indices sorted by similarity (descending)
        # argsort returns ascending, so we reverse
        sorted_indices = np.argsort(similarities)[::-1]

        # Skip self (index 0 after sorting, which has similarity 1.0)
        # Take top N similar items
        top_similar = []
        for idx in sorted_indices:
            if idx == i:  # Skip self
                continue
            if len(top_similar) >= NUM_SIMILAR:
                break

            similar_url = urls[idx]
            score = float(similarities[idx])  # Convert from numpy

            top_similar.append({
                "url": similar_url,
                "score": round(score, 4)  # Round to 4 decimal places
            })

        similar_lookup[url] = top_similar

        # Progress indicator
        if (i + 1) % 100 == 0:
            print(f"  Processed {i + 1}/{len(urls)} MicroSims...")

    print(f"  Processed {len(urls)}/{len(urls)} MicroSims")
    print()

    # Build output structure
    output = {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "source_model": metadata['model'],
            "num_similar": NUM_SIMILAR,
            "count": len(urls)
        },
        "similar": similar_lookup
    }

    # Save output
    print(f"Saving to {OUTPUT_PATH}...")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    atomic_write_json(OUTPUT_PATH, output, separators=(',', ':'))  # Compact JSON

    # Calculate file size
    file_size = OUTPUT_PATH.stat().st_size
    if file_size > 1024 * 1024:
        size_str = f"{file_size / (1024 * 1024):.2f} MB"
    else:
        size_str = f"{file_size / 1024:.1f} KB"

    print(f"  File size: {size_str}")
    print()

    # Summary
    print("=" * 60)
    print("Summary:")
    print(f"  - Total MicroSims: {len(urls)}")
    print(f"  - Similar items per MicroSim: {NUM_SIMILAR}")
    print(f"  - Output file: {OUTPUT_PATH}")
    print(f"  - File size: {size_str}")
    print()
    print("Done!")


if __name__ == "__main__":
    main()
