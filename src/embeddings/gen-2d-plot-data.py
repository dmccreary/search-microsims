#!/usr/bin/env python3
"""
Generate 2D PCA projection of MicroSim embeddings for Plotly.js visualization.

This script reads the 384-dimensional embeddings from microsims-embeddings.json,
applies PCA to reduce to 2 dimensions, and outputs a JSON file suitable for
Plotly.js scatter plot visualization with hover information.

Usage:
    python src/embeddings/gen-2d-plot-data.py

Output:
    docs/search/embeddings-2d.json
"""

import json
import sys
from pathlib import Path
import numpy as np
from sklearn.decomposition import PCA

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
EMBEDDINGS_PATH = PROJECT_ROOT / "data" / "microsims-embeddings.json"
MICROSIMS_PATH = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"
OUTPUT_PATH = PROJECT_ROOT / "docs" / "search" / "embeddings-2d.json"


def load_embeddings(path: Path) -> dict:
    """Load embeddings from JSON file."""
    print(f"Loading embeddings from {path}...")
    with open(path, 'r') as f:
        data = json.load(f)
    print(f"  Loaded {data['metadata']['count']} embeddings ({data['metadata']['dimension']}D)")
    return data


def load_microsims(path: Path) -> dict:
    """Load MicroSims metadata and index by URL."""
    print(f"Loading MicroSims metadata from {path}...")
    with open(path, 'r') as f:
        microsims = json.load(f)

    # Index by URL for fast lookup
    by_url = {}
    for sim in microsims:
        url = sim.get('url') or sim.get('identifier')
        if url:
            by_url[url] = sim

    print(f"  Loaded {len(microsims)} MicroSims, {len(by_url)} with URLs")
    return by_url


def apply_pca(embeddings_dict: dict) -> tuple:
    """Apply PCA to reduce embeddings to 2D."""
    print("Applying PCA dimensionality reduction (384D → 2D)...")

    # Extract URLs and embeddings in consistent order
    urls = list(embeddings_dict.keys())
    embeddings_matrix = np.array([embeddings_dict[url] for url in urls])

    print(f"  Input shape: {embeddings_matrix.shape}")

    # Apply PCA
    pca = PCA(n_components=2, random_state=42)
    coords_2d = pca.fit_transform(embeddings_matrix)

    explained_variance = pca.explained_variance_ratio_
    print(f"  Explained variance: PC1={explained_variance[0]:.3f}, PC2={explained_variance[1]:.3f}")
    print(f"  Total variance explained: {sum(explained_variance):.3f}")

    return urls, coords_2d, explained_variance


def get_color_by_subject(subject: str) -> str:
    """Map subject area to a color."""
    subject_colors = {
        'Mathematics': 'blue',      # Blue
        'Physics': 'orange',          # Orange
        'Computer Science': 'green', # Green
        'Linear Algebra': '#d62728',        # Red
        'Linux': 'purple',          # Purple
        'Engineering': '#8c564b',      # Brown
        'Statistics': '#e377c2',       # Pink
        'Data Science': '#7f7f7f',     # Gray
        'AI/ML': '#bcbd22',            # Yellow-green
        'Robotics': '#17becf',         # Cyan
        'Economics': '#aec7e8',        # Light blue
        'Language Arts': '#98df8a',    # Light green
        'Operating Systems': '#f7b6d2', # Light pink
        'Ethics': '#c7c7c7',           # Light gray
        'Healthcare': '#dbdb8d',       # Light yellow
        'Graph': 'orange',          # Light orange
        'Education': '#9edae5',        # Light cyan
        'Other': '#999999',            # Medium gray
    }
    return subject_colors.get(subject, '#999999')


def normalize_subject(raw_subject: str) -> str:
    """Normalize subject to a primary category for consistent coloring."""
    if not raw_subject:
        return 'Other'

    # Lowercase for matching
    s = raw_subject.lower()

    # Map to primary categories
    if 'geometry' in s:
        return 'Geometry'
    if 'linear algebra' in s:
        return 'Linear Algebra'
    if 'linux' in s:
        return 'Linux'
    if 'algebra' in s:
        return 'Algebra'
    if 'math' in s or 'calculus' in s:
        return 'Mathematics'
    if 'physic' in s:
        return 'Physics'
    if 'computer' in s or 'programming' in s or 'software' in s or 'algorithm' in s:
        return 'Computer Science'
    if 'signal' in s:
        return 'Signal Processing'
    if 'engineer' in s or 'electronic' in s or 'circuit' in s:
        return 'Engineering'
    if 'statistic' in s:
        return 'Statistics'
    if 'data science' in s or 'data' in s:
        return 'Data Science'
    if 'machine learning' in s or 'neural' in s or 'deep learning' in s or 'ai' in s:
        return 'AI/ML'
    if 'robot' in s or 'autonomous' in s:
        return 'Robotics'
    if 'econom' in s or 'financ' in s:
        return 'Economics'
    if 'reading' in s:
        return 'Reading'
    if 'social' in s or 'history' in s or 'geography' in s:
        return 'Social Studies'
    if 'graph' in s:
        return 'Graph'
    if 'operating system' in s:
        return 'Operating Systems'
    if 'ethic' in s:
        return 'Ethics'
    if 'health' in s:
        return 'Healthcare'
    if 'education' in s:
        return 'Education'
    if 'chem' in s:
        return 'Chemistry'
    if 'bio' in s:
        return 'Biology'
    
    return 'Other'


def get_subject(sim: dict) -> str:
    """Extract subject from MicroSim metadata, handling various formats."""
    raw_subject = None

    # Try flat 'subject' field first
    subject = sim.get('subject')
    if subject and isinstance(subject, str):
        raw_subject = subject
    else:
        # Try 'subjects' array
        subjects = sim.get('subjects')
        if subjects and isinstance(subjects, list) and len(subjects) > 0:
            raw_subject = subjects[0]
        else:
            # Try nested educational.subjectArea
            educational = sim.get('educational', {})
            subject_area = educational.get('subjectArea')
            if subject_area:
                if isinstance(subject_area, list) and len(subject_area) > 0:
                    raw_subject = subject_area[0]
                elif isinstance(subject_area, str):
                    raw_subject = subject_area

    return normalize_subject(raw_subject)


def build_plot_data(urls: list, coords_2d: np.ndarray, microsims: dict, explained_variance: np.ndarray) -> dict:
    """Build the output JSON structure for Plotly.js."""
    print("Building plot data...")

    points = []
    subjects_seen = set()

    for i, url in enumerate(urls):
        sim = microsims.get(url, {})

        # Get subject (handle both flat and nested formats)
        subject = get_subject(sim)
        subjects_seen.add(subject)

        # Get title
        title = sim.get('title', 'Unknown MicroSim')

        # Get repo from _source
        source = sim.get('_source', {})
        repo = source.get('repo', '')

        # Get grade level
        grade_level = sim.get('gradeLevel', '')

        # Get framework
        framework = sim.get('framework', '')

        point = {
            'x': float(coords_2d[i, 0]),
            'y': float(coords_2d[i, 1]),
            'title': title,
            'subject': subject,
            'repo': repo,
            'gradeLevel': grade_level,
            'framework': framework,
            'url': url,
            'color': get_color_by_subject(subject)
        }
        points.append(point)

    # Build color legend
    color_legend = {subj: get_color_by_subject(subj) for subj in sorted(subjects_seen)}

    output = {
        'metadata': {
            'source': 'microsims-embeddings.json',
            'reduction': 'PCA',
            'dimensions': 2,
            'count': len(points),
            'explained_variance': {
                'pc1': float(explained_variance[0]),
                'pc2': float(explained_variance[1]),
                'total': float(sum(explained_variance))
            }
        },
        'colorLegend': color_legend,
        'points': points
    }

    print(f"  Created {len(points)} points across {len(subjects_seen)} subjects")
    return output


def save_output(data: dict, path: Path):
    """Save output JSON file."""
    print(f"Saving to {path}...")
    path.parent.mkdir(parents=True, exist_ok=True)

    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

    size_kb = path.stat().st_size / 1024
    print(f"  Saved! File size: {size_kb:.1f} KB")


def main():
    print("=" * 60)
    print("MicroSim Embeddings 2D Projection Generator")
    print("=" * 60)
    print()

    # Check files exist
    if not EMBEDDINGS_PATH.exists():
        print(f"ERROR: Embeddings file not found: {EMBEDDINGS_PATH}")
        sys.exit(1)

    if not MICROSIMS_PATH.exists():
        print(f"ERROR: MicroSims data not found: {MICROSIMS_PATH}")
        sys.exit(1)

    # Load data
    embeddings_data = load_embeddings(EMBEDDINGS_PATH)
    microsims = load_microsims(MICROSIMS_PATH)

    # Apply PCA
    urls, coords_2d, explained_variance = apply_pca(embeddings_data['embeddings'])

    # Build output
    plot_data = build_plot_data(urls, coords_2d, microsims, explained_variance)

    # Save
    save_output(plot_data, OUTPUT_PATH)

    print()
    print("=" * 60)
    print("Summary:")
    print(f"  - MicroSims processed: {plot_data['metadata']['count']}")
    print(f"  - Variance explained: {plot_data['metadata']['explained_variance']['total']:.1%}")
    print(f"  - Output file: {OUTPUT_PATH.relative_to(PROJECT_ROOT)}")
    print("=" * 60)
    print("Done!")


if __name__ == '__main__':
    main()
