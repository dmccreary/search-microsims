#!/usr/bin/env python3
"""
Generate embeddings for MicroSims using Sentence Transformers.

This script reads microsims-data.json and creates embeddings for each MicroSim,
storing them in data/microsims-embeddings.json with the URL as the unique identifier.

Usage:
    # From project root with virtual environment activated:
    source .venv-embeddings/bin/activate
    python src/embeddings/generate-embeddings.py

Requirements:
    pip install sentence-transformers
    (Requires Python 3.12 or earlier - PyTorch doesn't support Python 3.13 yet)

Output:
    data/microsims-embeddings.json - JSON file containing embeddings keyed by URL
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Error: sentence-transformers not installed.")
    print("Install with: pip install sentence-transformers")
    print("Note: Requires Python 3.12 or earlier (PyTorch constraint)")
    sys.exit(1)

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent  # src/embeddings -> src -> project root
INPUT_FILE = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"
OUTPUT_FILE = PROJECT_ROOT / "data" / "microsims-embeddings.json"

# Model configuration
MODEL_NAME = "all-MiniLM-L6-v2"  # 384 dimensions, good balance of speed and quality


def flatten_to_strings(items) -> list:
    """
    Flatten a potentially nested list structure to a flat list of strings.
    Handles cases where list items might themselves be lists.
    """
    if not items:
        return []

    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten_to_strings(item))
        elif isinstance(item, str):
            result.append(item)
        else:
            result.append(str(item))
    return result


def create_embedding_text(microsim: dict) -> str:
    """
    Create a text representation of a MicroSim for embedding.

    Combines relevant fields to create a rich text that captures
    the semantic meaning of the MicroSim.
    """
    parts = []

    # Title is most important
    title = microsim.get("title", "")
    if title:
        parts.append(f"Title: {title}")

    # Description (clean up iframe tags if present)
    description = microsim.get("description", "")
    if description:
        # Remove iframe tags that sometimes appear in descriptions
        if "<iframe" not in description.lower():
            parts.append(f"Description: {description}")

    # Topic
    topic = microsim.get("topic", "")
    if topic and topic != title:  # Avoid duplication if topic == title
        parts.append(f"Topic: {topic}")

    # Subject area(s)
    subjects = microsim.get("subjects", [])
    if not subjects:
        subject = microsim.get("subject", "")
        if subject:
            subjects = [subject] if isinstance(subject, str) else flatten_to_strings([subject])
    subjects = flatten_to_strings(subjects)
    if subjects:
        parts.append(f"Subjects: {', '.join(subjects)}")

    # Grade level
    grade_level = microsim.get("gradeLevel", "")
    if grade_level:
        parts.append(f"Grade Level: {grade_level}")

    # Learning objectives (very valuable for semantic search)
    objectives = flatten_to_strings(microsim.get("learningObjectives", []))
    if objectives:
        parts.append(f"Learning Objectives: {'; '.join(objectives[:5])}")  # Limit to 5

    # Prerequisites
    prerequisites = flatten_to_strings(microsim.get("prerequisites", []))
    if prerequisites:
        parts.append(f"Prerequisites: {'; '.join(prerequisites[:3])}")  # Limit to 3

    # Keywords/tags
    keywords = flatten_to_strings(microsim.get("keywords", []))
    if keywords:
        parts.append(f"Keywords: {', '.join(keywords)}")

    # Visualization type
    viz_types = microsim.get("visualizationType", [])
    if viz_types:
        if isinstance(viz_types, list):
            viz_types = flatten_to_strings(viz_types)
            parts.append(f"Visualization: {', '.join(viz_types)}")
        else:
            parts.append(f"Visualization: {viz_types}")

    # Framework/library
    framework = microsim.get("framework", "")
    if framework:
        parts.append(f"Framework: {framework}")

    # Bloom's taxonomy level
    blooms = microsim.get("bloomsTaxonomy", [])
    if blooms:
        if isinstance(blooms, list):
            blooms = flatten_to_strings(blooms)
            parts.append(f"Cognitive Level: {', '.join(blooms)}")
        else:
            parts.append(f"Cognitive Level: {blooms}")

    # Source repo (helps with context)
    source = microsim.get("_source", {})
    if source:
        repo = source.get("repo", "")
        if repo:
            # Convert repo name to readable form (e.g., "algebra-1" -> "Algebra 1")
            readable_repo = repo.replace("-", " ").title()
            parts.append(f"Course: {readable_repo}")

    return " | ".join(parts)


def get_microsim_url(microsim: dict) -> str:
    """
    Extract the unique URL identifier for a MicroSim.

    Uses the 'url' or 'identifier' field as the unique key.
    """
    url = microsim.get("url") or microsim.get("identifier")
    if not url:
        # Fallback: construct from _source
        source = microsim.get("_source", {})
        repo = source.get("repo", "unknown")
        sim = source.get("sim", "unknown")
        url = f"https://dmccreary.github.io/{repo}/sims/{sim}/"
    return url


def main():
    print(f"MicroSim Embedding Generator")
    print(f"=" * 50)
    print(f"Model: {MODEL_NAME}")
    print(f"Input: {INPUT_FILE}")
    print(f"Output: {OUTPUT_FILE}")
    print()

    # Check input file exists
    if not INPUT_FILE.exists():
        print(f"Error: Input file not found: {INPUT_FILE}")
        sys.exit(1)

    # Load MicroSims data
    print("Loading MicroSims data...")
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        microsims = json.load(f)

    print(f"Found {len(microsims)} MicroSims")

    # Load the embedding model
    print(f"\nLoading embedding model '{MODEL_NAME}'...")
    print("(This may take a moment on first run as the model downloads)")
    model = SentenceTransformer(MODEL_NAME)
    embedding_dimension = model.get_sentence_embedding_dimension()
    print(f"Model loaded. Embedding dimension: {embedding_dimension}")

    # Prepare texts for embedding
    print("\nPreparing texts for embedding...")
    texts = []
    urls = []
    skipped = 0

    for microsim in microsims:
        url = get_microsim_url(microsim)
        text = create_embedding_text(microsim)

        if not text.strip():
            skipped += 1
            continue

        urls.append(url)
        texts.append(text)

    print(f"Prepared {len(texts)} MicroSims for embedding")
    if skipped > 0:
        print(f"Skipped {skipped} MicroSims with insufficient text")

    # Generate embeddings in batches
    print("\nGenerating embeddings...")
    batch_size = 32
    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True
    )

    print(f"Generated {len(embeddings)} embeddings")

    # Build output structure
    print("\nBuilding output structure...")
    output = {
        "metadata": {
            "model": MODEL_NAME,
            "dimension": embedding_dimension,
            "count": len(embeddings),
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "source_file": str(INPUT_FILE.name)
        },
        "embeddings": {}
    }

    for url, embedding in zip(urls, embeddings):
        output["embeddings"][url] = embedding.tolist()

    # Ensure output directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Save embeddings
    print(f"\nSaving embeddings to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f)

    # Report file size
    file_size_mb = OUTPUT_FILE.stat().st_size / (1024 * 1024)
    print(f"Saved! File size: {file_size_mb:.2f} MB")

    # Summary
    print("\n" + "=" * 50)
    print("Summary:")
    print(f"  - Total MicroSims processed: {len(embeddings)}")
    print(f"  - Embedding dimension: {embedding_dimension}")
    print(f"  - Output file: {OUTPUT_FILE}")
    print(f"  - File size: {file_size_mb:.2f} MB")
    print("\nDone!")


if __name__ == "__main__":
    main()
