#!/usr/bin/env python3
"""
Generate 2D PCA data for MicroSim embeddings visualization.

This script:
1. Loads 384-dimensional embeddings from microsims-embeddings.json
2. Loads metadata from microsims-data.json
3. Loads subject mapping from config/subject-mapping.json
4. Applies PCA to reduce to 2 dimensions
5. Generates data.json for the Plotly visualization

Usage:
    python src/reports/generate-pca-map.py

Output:
    docs/sims/pca-map/data.json

Configuration:
    config/subject-mapping.json - Edit this file to add/modify subject
    categories, colors, and pattern matching rules. Order matters -
    first match wins, so specific subjects should come before broader ones.

Note:
    The presentation files (main.html, style.css, script.js) are maintained
    separately and not overwritten by this script.
"""

import json
import sys
from pathlib import Path
import numpy as np
from sklearn.decomposition import PCA
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
EMBEDDINGS_PATH = PROJECT_ROOT / "data" / "microsims-embeddings.json"
MICROSIMS_PATH = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"
SUBJECT_MAPPING_PATH = PROJECT_ROOT / "config" / "subject-mapping.json"
OUTPUT_DIR = PROJECT_ROOT / "docs" / "sims" / "pca-map"

# Global variables loaded from config
SUBJECT_CONFIG = None
SUBJECT_COLORS = None


def load_subject_mapping(path: Path) -> dict:
    """Load subject mapping configuration from JSON file."""
    print(f"Loading subject mapping from {path}...")
    with open(path, 'r') as f:
        config = json.load(f)
    print(f"  Loaded {len(config['subjects'])} subject categories")
    return config


def init_subject_config():
    """Initialize subject configuration from JSON file."""
    global SUBJECT_CONFIG, SUBJECT_COLORS

    SUBJECT_CONFIG = load_subject_mapping(SUBJECT_MAPPING_PATH)

    # Build color lookup dictionary
    SUBJECT_COLORS = {}
    for subject in SUBJECT_CONFIG['subjects']:
        SUBJECT_COLORS[subject['name']] = subject['color']

    # Add default
    SUBJECT_COLORS[SUBJECT_CONFIG['default']['name']] = SUBJECT_CONFIG['default']['color']


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

    by_url = {}
    for sim in microsims:
        url = sim.get('url') or sim.get('identifier')
        if url:
            by_url[url] = sim

    print(f"  Loaded {len(microsims)} MicroSims, {len(by_url)} with URLs")
    return by_url


def normalize_subject(raw_subject: str) -> str:
    """Normalize subject to a primary category using config file.

    Uses patterns from config/subject-mapping.json. Order in the config
    file determines priority - first match wins. This allows specific
    subjects (e.g., 'Geometry') to be matched before broader categories
    (e.g., 'Mathematics').
    """
    if not raw_subject:
        return SUBJECT_CONFIG['default']['name']

    s = raw_subject.lower()

    # Check each subject's patterns in order (first match wins)
    for subject in SUBJECT_CONFIG['subjects']:
        for pattern in subject['patterns']:
            if pattern in s:
                return subject['name']

    return SUBJECT_CONFIG['default']['name']


def get_subject(sim: dict) -> str:
    """Extract subject from MicroSim metadata.

    When multiple subjects are provided, checks each one and returns
    the first that maps to a recognized category (preferring specific
    subjects over broader ones due to normalize_subject() ordering).
    """
    # Collect all subject strings from various metadata formats
    all_subjects = []

    subject = sim.get('subject')
    if subject:
        if isinstance(subject, str):
            all_subjects.append(subject)
        elif isinstance(subject, list):
            all_subjects.extend(subject)

    subjects = sim.get('subjects')
    if subjects and isinstance(subjects, list):
        all_subjects.extend(subjects)

    educational = sim.get('educational', {})
    subject_area = educational.get('subjectArea')
    if subject_area:
        if isinstance(subject_area, str):
            all_subjects.append(subject_area)
        elif isinstance(subject_area, list):
            all_subjects.extend(subject_area)

    # Try each subject and return first that's not 'Other'
    for raw_subject in all_subjects:
        normalized = normalize_subject(raw_subject)
        if normalized != 'Other':
            return normalized

    # Fall back to first subject normalized, or 'Other'
    if all_subjects:
        return normalize_subject(all_subjects[0])

    return 'Other'


def apply_pca(embeddings_dict: dict) -> tuple:
    """Apply PCA to reduce embeddings to 2D."""
    print("Applying PCA dimensionality reduction (384D → 2D)...")

    urls = list(embeddings_dict.keys())
    embeddings_matrix = np.array([embeddings_dict[url] for url in urls])

    print(f"  Input shape: {embeddings_matrix.shape}")

    pca = PCA(n_components=2, random_state=42)
    coords_2d = pca.fit_transform(embeddings_matrix)

    explained_variance = pca.explained_variance_ratio_
    print(f"  Explained variance: PC1={explained_variance[0]:.3f}, PC2={explained_variance[1]:.3f}")
    print(f"  Total variance explained: {sum(explained_variance):.3f}")

    return urls, coords_2d, explained_variance


def build_dataframe(urls: list, coords_2d: np.ndarray, microsims: dict) -> list:
    """Build list of point data for plotting."""
    points = []

    for i, url in enumerate(urls):
        sim = microsims.get(url, {})
        subject = get_subject(sim)
        title = sim.get('title', 'Unknown MicroSim')
        source = sim.get('_source', {})
        repo = source.get('repo', 'Unknown')
        grade_level = sim.get('gradeLevel', 'N/A')
        framework = sim.get('framework', 'N/A')

        points.append({
            'x': float(coords_2d[i, 0]),
            'y': float(coords_2d[i, 1]),
            'title': title,
            'subject': subject,
            'repo': repo,
            'gradeLevel': grade_level,
            'framework': framework,
            'url': url,
            'color': SUBJECT_COLORS.get(subject, '#999999')
        })

    return points


def create_plotly_figure(points: list, explained_variance: np.ndarray) -> go.Figure:
    """Create interactive Plotly figure."""
    print("Creating Plotly figure...")

    # Group points by subject for traces
    by_subject = {}
    for p in points:
        subject = p['subject']
        if subject not in by_subject:
            by_subject[subject] = []
        by_subject[subject].append(p)

    # Sort subjects by count for legend
    sorted_subjects = sorted(by_subject.keys(), key=lambda s: -len(by_subject[s]))

    fig = go.Figure()

    for subject in sorted_subjects:
        pts = by_subject[subject]
        color = SUBJECT_COLORS.get(subject, '#999999')

        # Build hover text
        hover_texts = []
        for p in pts:
            hover_text = (
                f"<b>{p['title']}</b><br>"
                f"Subject: {p['subject']}<br>"
                f"Repo: {p['repo']}<br>"
                f"Grade: {p['gradeLevel']}<br>"
                f"Framework: {p['framework']}"
            )
            hover_texts.append(hover_text)

        # Build custom data for click events
        custom_data = [p['url'] for p in pts]

        fig.add_trace(go.Scatter(
            x=[p['x'] for p in pts],
            y=[p['y'] for p in pts],
            mode='markers',
            name=f"{subject} ({len(pts)})",
            marker=dict(
                color=color,
                size=12,
                opacity=0.7,
                line=dict(color='white', width=1)
            ),
            text=[p['title'] for p in pts],
            hovertext=hover_texts,
            hoverinfo='text',
            customdata=custom_data
        ))

    # Update layout for responsiveness
    variance_pct = sum(explained_variance) * 100

    # Note: Title is set by JavaScript from document.title for easy editing
    fig.update_layout(
        xaxis=dict(
            title=f'PC1 ({explained_variance[0]*100:.1f}% variance)',
            zeroline=True,
            zerolinecolor='#ddd',
            gridcolor='#eee',
            showgrid=True
        ),
        yaxis=dict(
            title=f'PC2 ({explained_variance[1]*100:.1f}% variance)',
            zeroline=True,
            zerolinecolor='#ddd',
            gridcolor='#eee',
            showgrid=True
        ),
        legend=dict(
            title='Subject Areas',
            itemsizing='constant',
            font=dict(size=11),
            yanchor='top',
            y=0.99,
            xanchor='left',
            x=1.02
        ),
        hovermode='closest',
        hoverdistance=20,
        spikedistance=20,
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=60, r=200, t=100, b=60),
        # Make responsive
        autosize=True,
    )

    # Add click event JavaScript
    fig.update_layout(
        clickmode='event+select'
    )

    return fig


def save_data_json(fig: go.Figure, output_dir: Path):
    """Generate data.json with Plotly data and layout."""

    output_dir.mkdir(parents=True, exist_ok=True)

    plotly_data = {
        "data": fig.to_dict()['data'],
        "layout": fig.to_dict()['layout']
    }

    data_path = output_dir / "data.json"
    with open(data_path, 'w') as f:
        json.dump(plotly_data, f, indent=2)

    size_kb = data_path.stat().st_size / 1024
    print(f"  Saved {data_path} ({size_kb:.1f} KB)")


def main():
    print("=" * 60)
    print("MicroSim PCA Map Generator")
    print("=" * 60)
    print()

    # Check files exist
    if not SUBJECT_MAPPING_PATH.exists():
        print(f"ERROR: Subject mapping config not found: {SUBJECT_MAPPING_PATH}")
        sys.exit(1)

    if not EMBEDDINGS_PATH.exists():
        print(f"ERROR: Embeddings file not found: {EMBEDDINGS_PATH}")
        sys.exit(1)

    if not MICROSIMS_PATH.exists():
        print(f"ERROR: MicroSims data not found: {MICROSIMS_PATH}")
        sys.exit(1)

    # Load subject mapping configuration
    init_subject_config()

    # Load data
    embeddings_data = load_embeddings(EMBEDDINGS_PATH)
    microsims = load_microsims(MICROSIMS_PATH)

    # Apply PCA
    urls, coords_2d, explained_variance = apply_pca(embeddings_data['embeddings'])

    # Build point data
    points = build_dataframe(urls, coords_2d, microsims)
    print(f"  Built {len(points)} data points")

    # Create figure
    fig = create_plotly_figure(points, explained_variance)

    # Save data.json only (presentation files are maintained separately)
    print("Generating data.json...")
    save_data_json(fig, OUTPUT_DIR)

    print()
    print("=" * 60)
    print("Summary:")
    print(f"  - MicroSims mapped: {len(points)}")
    print(f"  - Subject areas: {len(set(p['subject'] for p in points))}")
    print(f"  - Variance explained: {sum(explained_variance)*100:.1f}%")
    print(f"  - Output: {OUTPUT_DIR.relative_to(PROJECT_ROOT)}/data.json")
    print("=" * 60)
    print("Done!")


if __name__ == '__main__':
    main()
