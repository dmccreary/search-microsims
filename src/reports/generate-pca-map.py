#!/usr/bin/env python3
"""
Generate an interactive 2D PCA map of MicroSim embeddings using Plotly.

This script:
1. Loads 384-dimensional embeddings from microsims-embeddings.json
2. Loads metadata from microsims-data.json
3. Applies PCA to reduce to 2 dimensions
4. Generates split files for a MicroSim-style folder structure

Usage:
    python src/reports/generate-pca-map.py

Output:
    docs/sims/pca-map/
        - data.json   (Plotly data and layout)
        - main.html   (HTML structure)
        - style.css   (CSS styles)
        - script.js   (JavaScript)
"""

import json
import sys
from pathlib import Path
from datetime import datetime
import numpy as np
from sklearn.decomposition import PCA
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
EMBEDDINGS_PATH = PROJECT_ROOT / "data" / "microsims-embeddings.json"
MICROSIMS_PATH = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"
OUTPUT_DIR = PROJECT_ROOT / "docs" / "sims" / "pca-map"

# Subject color mapping
SUBJECT_COLORS = {
    'Mathematics': '#1f77b4',
    'Physics': '#ff7f0e',
    'Computer Science': '#2ca02c',
    'Chemistry': '#d62728',
    'Biology': '#9467bd',
    'Engineering': '#8c564b',
    'Statistics': '#e377c2',
    'Data Science': '#7f7f7f',
    'AI/ML': '#bcbd22',
    'Robotics': '#17becf',
    'Economics': '#aec7e8',
    'Music': '#ffbb78',
    'Art': '#ff9896',
    'Language Arts': '#98df8a',
    'Social Studies': '#c5b0d5',
    'Earth Science': '#c49c94',
    'Operating Systems': '#f7b6d2',
    'Ethics': '#c7c7c7',
    'Healthcare': '#dbdb8d',
    'Education': '#9edae5',
    'Other': '#999999',
}


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
    """Normalize subject to a primary category."""
    if not raw_subject:
        return 'Other'

    s = raw_subject.lower()

    if 'math' in s or 'algebra' in s or 'geometry' in s or 'calcul' in s or 'linear algebra' in s:
        return 'Mathematics'
    if 'physic' in s:
        return 'Physics'
    if 'computer' in s or 'programming' in s or 'software' in s or 'algorithm' in s:
        return 'Computer Science'
    if 'chem' in s:
        return 'Chemistry'
    if 'bio' in s:
        return 'Biology'
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
    if 'music' in s:
        return 'Music'
    if 'art' in s:
        return 'Art'
    if 'language' in s or 'reading' in s:
        return 'Language Arts'
    if 'social' in s or 'history' in s or 'geography' in s:
        return 'Social Studies'
    if 'earth' in s or 'environment' in s:
        return 'Earth Science'
    if 'linux' in s or 'operating system' in s:
        return 'Operating Systems'
    if 'ethic' in s:
        return 'Ethics'
    if 'health' in s:
        return 'Healthcare'
    if 'education' in s:
        return 'Education'

    return 'Other'


def get_subject(sim: dict) -> str:
    """Extract subject from MicroSim metadata."""
    raw_subject = None

    subject = sim.get('subject')
    if subject and isinstance(subject, str):
        raw_subject = subject
    else:
        subjects = sim.get('subjects')
        if subjects and isinstance(subjects, list) and len(subjects) > 0:
            raw_subject = subjects[0]
        else:
            educational = sim.get('educational', {})
            subject_area = educational.get('subjectArea')
            if subject_area:
                if isinstance(subject_area, list) and len(subject_area) > 0:
                    raw_subject = subject_area[0]
                elif isinstance(subject_area, str):
                    raw_subject = subject_area

    return normalize_subject(raw_subject)


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

    fig.update_layout(
        title=dict(
            text=f'MicroSim Embeddings PCA Map<br><sub>2D projection of 384-dimensional semantic embeddings ({len(points)} MicroSims, {variance_pct:.1f}% variance explained)</sub>',
            x=0.5,
            xanchor='center',
            font=dict(size=20)
        ),
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


def generate_split_files(fig: go.Figure, points: list, explained_variance: np.ndarray, output_dir: Path):
    """Generate split files: data.json, main.html, style.css, script.js."""

    output_dir.mkdir(parents=True, exist_ok=True)

    # Count subjects
    subject_counts = {}
    for p in points:
        subject_counts[p['subject']] = subject_counts.get(p['subject'], 0) + 1

    total_variance = sum(explained_variance) * 100

    # 1. Generate data.json (Plotly data and layout)
    plotly_data = {
        "data": fig.to_dict()['data'],
        "layout": fig.to_dict()['layout']
    }

    data_path = output_dir / "data.json"
    with open(data_path, 'w') as f:
        json.dump(plotly_data, f, indent=2)
    print(f"  Saved {data_path.name} ({data_path.stat().st_size / 1024:.1f} KB)")

    # 2. Generate style.css
    css_content = '''* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8f9fa;
}

.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.header {
    text-align: center;
    padding-bottom: 15px;
}

h1 {
    color: #333;
    font-size: 1.6rem;
    margin-bottom: 5px;
}

.subtitle {
    color: #666;
    font-size: 0.9rem;
}

.stats {
    display: flex;
    justify-content: center;
    gap: 25px;
    margin-top: 12px;
    flex-wrap: wrap;
}

.stat {
    background: white;
    padding: 10px 18px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    text-align: center;
}

.stat-label {
    color: #888;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    color: #333;
    font-size: 1.3rem;
    font-weight: 600;
}

.plot-wrapper {
    flex: 1;
    min-height: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 10px;
    overflow: hidden;
}

.plot-wrapper > div {
    width: 100% !important;
    height: 100% !important;
}

.js-plotly-plot, .plotly {
    width: 100% !important;
    height: 100% !important;
}

.footer {
    text-align: center;
    padding-top: 15px;
    color: #888;
    font-size: 0.8rem;
}

.instructions {
    margin-top: 10px;
    padding: 10px 16px;
    background: #e3f2fd;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #555;
    text-align: center;
}

.instructions strong {
    color: #1976d2;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    h1 {
        font-size: 1.3rem;
    }
    .stats {
        gap: 10px;
    }
    .stat {
        padding: 8px 12px;
    }
    .stat-value {
        font-size: 1.1rem;
    }
}
'''

    css_path = output_dir / "style.css"
    with open(css_path, 'w') as f:
        f.write(css_content)
    print(f"  Saved {css_path.name} ({css_path.stat().st_size / 1024:.1f} KB)")

    # 3. Generate script.js
    js_content = '''// MicroSim PCA Map - Interactive Plotly Visualization
// Loads data from data.json and renders an interactive scatter plot

document.addEventListener('DOMContentLoaded', function() {
    const plotDiv = document.getElementById('pca-plot');

    // Load the data
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load data.json');
            }
            return response.json();
        })
        .then(plotData => {
            // Update stats from data
            updateStats(plotData.data);

            // Configure responsive layout
            const layout = plotData.layout;
            layout.autosize = true;

            // Config for interactivity
            const config = {
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                displaylogo: false
            };

            // Create the plot
            Plotly.newPlot(plotDiv, plotData.data, layout, config);

            // Handle click events to open MicroSim URLs
            plotDiv.on('plotly_click', function(data) {
                const point = data.points[0];
                if (point.customdata) {
                    const url = point.customdata;
                    if (url.startsWith('http')) {
                        window.open(url, '_blank');
                    }
                }
            });

            // Handle window resize
            window.addEventListener('resize', function() {
                Plotly.Plots.resize(plotDiv);
            });
        })
        .catch(error => {
            console.error('Error loading PCA data:', error);
            plotDiv.innerHTML = '<p style="color: red; padding: 20px;">Error loading visualization data. Please check that data.json exists.</p>';
        });
});

function updateStats(data) {
    // Calculate total MicroSims
    let totalPoints = 0;
    let subjectAreas = 0;

    data.forEach(trace => {
        if (trace.x && Array.isArray(trace.x)) {
            totalPoints += trace.x.length;
        }
        subjectAreas++;
    });

    // Update stat values if elements exist
    const microsimsStat = document.getElementById('stat-microsims');
    const subjectsStat = document.getElementById('stat-subjects');

    if (microsimsStat) microsimsStat.textContent = totalPoints;
    if (subjectsStat) subjectsStat.textContent = subjectAreas;
}
'''

    js_path = output_dir / "script.js"
    with open(js_path, 'w') as f:
        f.write(js_content)
    print(f"  Saved {js_path.name} ({js_path.stat().st_size / 1024:.1f} KB)")

    # 4. Generate main.html
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MicroSim PCA Map</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.plot.ly/plotly-3.3.1.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MicroSim Embeddings PCA Map</h1>
            <p class="subtitle">Interactive 2D projection of 384-dimensional semantic embeddings</p>
            <div class="stats">
                <div class="stat">
                    <div class="stat-label">MicroSims</div>
                    <div class="stat-value" id="stat-microsims">{len(points):,}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Variance Explained</div>
                    <div class="stat-value">{total_variance:.1f}%</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Subject Areas</div>
                    <div class="stat-value" id="stat-subjects">{len(subject_counts)}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">PC1 Variance</div>
                    <div class="stat-value">{explained_variance[0]*100:.1f}%</div>
                </div>
                <div class="stat">
                    <div class="stat-label">PC2 Variance</div>
                    <div class="stat-value">{explained_variance[1]*100:.1f}%</div>
                </div>
            </div>
        </div>

        <div class="plot-wrapper">
            <div id="pca-plot"></div>
        </div>

        <div class="footer">
            <p>Generated from MicroSim metadata embeddings using PCA dimensionality reduction</p>
            <div class="instructions">
                <strong>Tip:</strong> Click on any point to open the MicroSim. Hover for details. Use the legend to filter by subject area.
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
'''

    html_path = output_dir / "main.html"
    with open(html_path, 'w') as f:
        f.write(html_content)
    print(f"  Saved {html_path.name} ({html_path.stat().st_size / 1024:.1f} KB)")


def main():
    print("=" * 60)
    print("MicroSim PCA Map Generator")
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

    # Build point data
    points = build_dataframe(urls, coords_2d, microsims)
    print(f"  Built {len(points)} data points")

    # Create figure
    fig = create_plotly_figure(points, explained_variance)

    # Generate split files
    print("Generating split files...")
    generate_split_files(fig, points, explained_variance, OUTPUT_DIR)

    # Calculate total size
    total_size = sum((OUTPUT_DIR / f).stat().st_size for f in ['data.json', 'main.html', 'style.css', 'script.js'])

    print()
    print("=" * 60)
    print("Summary:")
    print(f"  - MicroSims mapped: {len(points)}")
    print(f"  - Subject areas: {len(set(p['subject'] for p in points))}")
    print(f"  - Variance explained: {sum(explained_variance)*100:.1f}%")
    print(f"  - Output directory: {OUTPUT_DIR.relative_to(PROJECT_ROOT)}")
    print(f"  - Total size: {total_size / 1024:.1f} KB")
    print("=" * 60)
    print("Done!")


if __name__ == '__main__':
    main()
