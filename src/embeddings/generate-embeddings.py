#!/usr/bin/env python3
"""
Generate dual WHAT/HOW embeddings for MicroSims using Sentence Transformers.

This script reads microsims-data.json and creates TWO embeddings for each MicroSim:
  - WHAT: what the MicroSim teaches (title, topic, subjects, learning objectives)
  - HOW:  how it is implemented (framework, visualization type, pedagogical pattern)

Separating WHAT from HOW lets reuse detection match on learning content regardless
of implementation, while template selection can match on implementation style.

Usage:
    # From project root with virtual environment activated:
    source .venv-embeddings/bin/activate
    python src/embeddings/generate-embeddings.py

Requirements:
    pip install sentence-transformers
    (Requires Python 3.12 or earlier - PyTorch doesn't support Python 3.13 yet)

Output:
    data/microsims-embeddings.json - schema "dual-v1", keyed by URL:
    {"embeddings": {"<url>": {"what": [...384 floats], "how": [...384 floats]}}}
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


def create_what_text(microsim: dict) -> str:
    """
    Create the WHAT text: what the MicroSim teaches.

    Covers the learning content — concept, subject, grade level, and
    learning objectives — independent of how the sim is implemented.
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


def create_how_text(microsim: dict) -> str:
    """
    Create the HOW text: how the MicroSim is implemented.

    Covers the implementation and instructional-design choices — framework,
    visualization type, and pedagogical pattern — independent of subject matter.
    """
    parts = []

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

    # Pedagogical metadata (instructional-design implementation choices)
    pedagogical = microsim.get("pedagogical", {})
    if pedagogical:
        pattern = pedagogical.get("pattern", "")
        if pattern:
            parts.append(f"Pedagogical Pattern: {pattern}")

        interaction_style = pedagogical.get("interactionStyle", "")
        if interaction_style:
            parts.append(f"Interaction Style: {interaction_style}")

        pacing = pedagogical.get("pacing", "")
        if pacing:
            parts.append(f"Pacing: {pacing}")

        feedback_type = pedagogical.get("feedbackType", "")
        if feedback_type:
            parts.append(f"Feedback Type: {feedback_type}")

        data_visibility = pedagogical.get("dataVisibility", "")
        if data_visibility:
            parts.append(f"Data Visibility: {data_visibility}")

        if pedagogical.get("supportsPrediction"):
            parts.append("Supports Prediction: yes")

        bloom_verbs = pedagogical.get("bloomVerbs", [])
        if bloom_verbs:
            parts.append(f"Bloom Verbs: {', '.join(flatten_to_strings(bloom_verbs)[:5])}")

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
    print("\nPreparing WHAT and HOW texts for embedding...")
    what_texts = []
    how_texts = []
    urls = []
    skipped = 0
    empty_how = 0

    for microsim in microsims:
        url = get_microsim_url(microsim)
        what_text = create_what_text(microsim)
        how_text = create_how_text(microsim)

        if not what_text.strip():
            skipped += 1
            continue

        if not how_text.strip():
            # Never skip a sim with WHAT text; give sparse-metadata sims a
            # neutral HOW text so they cluster together rather than randomly.
            how_text = "Framework: unknown"
            empty_how += 1

        urls.append(url)
        what_texts.append(what_text)
        how_texts.append(how_text)

    print(f"Prepared {len(urls)} MicroSims for embedding")
    if skipped > 0:
        print(f"Skipped {skipped} MicroSims with insufficient WHAT text")
    if empty_how > 0:
        print(f"{empty_how} MicroSims had no HOW metadata (neutral HOW text used)")

    # Generate embeddings in batches
    batch_size = 32
    print("\nGenerating WHAT embeddings...")
    what_embeddings = model.encode(
        what_texts,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True
    )
    print("\nGenerating HOW embeddings...")
    how_embeddings = model.encode(
        how_texts,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True
    )

    print(f"Generated {len(what_embeddings)} WHAT + {len(how_embeddings)} HOW embeddings")

    # Build output structure
    print("\nBuilding output structure...")
    output = {
        "metadata": {
            "model": MODEL_NAME,
            "dimension": embedding_dimension,
            "schema": "dual-v1",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "source_file": str(INPUT_FILE.name)
        },
        "embeddings": {}
    }

    for url, what_emb, how_emb in zip(urls, what_embeddings, how_embeddings):
        output["embeddings"][url] = {
            "what": what_emb.tolist(),
            "how": how_emb.tolist()
        }

    # Count unique URLs (catalog duplicates collapse in the URL-keyed dict)
    output["metadata"]["count"] = len(output["embeddings"])
    if len(output["embeddings"]) < len(urls):
        print(f"Note: {len(urls) - len(output['embeddings'])} duplicate URLs collapsed")

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
    print(f"  - Total MicroSims processed: {len(urls)}")
    print(f"  - Vectors per MicroSim: 2 (what, how)")
    print(f"  - Embedding dimension: {embedding_dimension}")
    print(f"  - Output file: {OUTPUT_FILE}")
    print(f"  - File size: {file_size_mb:.2f} MB")
    print("\nDone!")


if __name__ == "__main__":
    main()
