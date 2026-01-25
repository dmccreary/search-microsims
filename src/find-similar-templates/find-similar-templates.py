#!/usr/bin/env python3
"""
Find Similar MicroSim Templates

A service that takes a MicroSim specification (SPECIFICATION block format) and returns
the most relevant existing MicroSims to use as templates. Designed to be used by the
microsim-generator skill when creating new MicroSims.

Usage:
    # From specification file
    python src/find-similar-templates/find-similar-templates.py --file spec.txt

    # From stdin
    echo "Type: microsim\nBloom Level: Apply (L3)..." | python src/find-similar-templates/find-similar-templates.py

    # Direct specification text
    python src/find-similar-templates/find-similar-templates.py --spec "Type: microsim
    Learning Objective: Students will understand pendulum motion..."

    # Return more results (default is 5)
    python src/find-similar-templates/find-similar-templates.py --file spec.txt --top 10

    # Output as JSON for programmatic use
    python src/find-similar-templates/find-similar-templates.py --file spec.txt --json

Requirements:
    pip install sentence-transformers numpy
    (Requires Python 3.12 or earlier - PyTorch doesn't support Python 3.13 yet)

Output:
    Returns GitHub repository URLs for the most similar MicroSims, which can be used
    as templates for creating new MicroSims.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional

try:
    import numpy as np
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Error: Required packages not installed.", file=sys.stderr)
    print("Install with: pip install sentence-transformers numpy", file=sys.stderr)
    print("Note: Requires Python 3.12 or earlier (PyTorch constraint)", file=sys.stderr)
    sys.exit(1)

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
EMBEDDINGS_PATH = PROJECT_ROOT / "data" / "microsims-embeddings.json"
MICROSIMS_DATA_PATH = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"

# Model configuration - must match the embeddings generator
MODEL_NAME = "all-MiniLM-L6-v2"

# Cache for loaded data and model
_cache = {
    'model': None,
    'embeddings': None,
    'microsims_data': None,
    'urls': None,
    'embedding_matrix': None
}


def parse_specification(spec_text: str) -> dict:
    """
    Parse a SPECIFICATION block into structured fields.

    Handles the format used in chapter index.md files:
    Type: microsim
    Bloom Level: Apply (L3)
    Bloom Verb: demonstrate
    Learning Objective: Students will...
    Canvas layout: ...
    Visual elements: ...
    Interactive controls: ...
    etc.
    """
    fields = {}
    current_field = None
    current_value = []

    lines = spec_text.strip().split('\n')

    for line in lines:
        # Check for field definition (Field: value)
        match = re.match(r'^([A-Za-z][A-Za-z\s]+):\s*(.*)$', line)

        if match:
            # Save previous field
            if current_field:
                fields[current_field] = '\n'.join(current_value).strip()

            current_field = match.group(1).strip().lower().replace(' ', '_')
            value = match.group(2).strip()
            current_value = [value] if value else []
        elif current_field and line.strip():
            # Continuation of previous field (indented or bullet points)
            current_value.append(line.strip())

    # Save last field
    if current_field:
        fields[current_field] = '\n'.join(current_value).strip()

    return fields


def create_query_text(spec: dict) -> str:
    """
    Create a text representation of a specification for embedding.

    Mirrors the format used in generate-embeddings.py to ensure
    semantic alignment with the existing embeddings.
    """
    parts = []

    # Type of visualization
    if 'type' in spec:
        parts.append(f"Type: {spec['type']}")

    # Learning objective is most important for semantic matching
    if 'learning_objective' in spec:
        parts.append(f"Learning Objective: {spec['learning_objective']}")

    # Bloom's taxonomy
    if 'bloom_level' in spec:
        parts.append(f"Cognitive Level: {spec['bloom_level']}")
    if 'bloom_verb' in spec:
        parts.append(f"Action: {spec['bloom_verb']}")

    # Visual elements describe what the MicroSim shows
    if 'visual_elements' in spec:
        parts.append(f"Visual Elements: {spec['visual_elements']}")

    # Canvas layout describes structure
    if 'canvas_layout' in spec:
        parts.append(f"Layout: {spec['canvas_layout']}")

    # Interactive controls describe functionality
    if 'interactive_controls' in spec:
        parts.append(f"Controls: {spec['interactive_controls']}")

    # Implementation hints
    if 'implementation' in spec or 'implementation_notes' in spec:
        impl = spec.get('implementation') or spec.get('implementation_notes')
        parts.append(f"Framework: {impl}")

    # Behavior describes interactions
    if 'behavior' in spec:
        parts.append(f"Behavior: {spec['behavior']}")

    # Animation effects
    if 'animation' in spec:
        parts.append(f"Animation: {spec['animation']}")

    # Any topic or subject hints
    if 'topic' in spec:
        parts.append(f"Topic: {spec['topic']}")
    if 'subject' in spec:
        parts.append(f"Subject: {spec['subject']}")

    return " | ".join(parts)


def load_model():
    """Load the sentence transformer model (cached)."""
    if _cache['model'] is None:
        _cache['model'] = SentenceTransformer(MODEL_NAME)
    return _cache['model']


def load_embeddings():
    """Load precomputed embeddings (cached)."""
    if _cache['embeddings'] is None:
        if not EMBEDDINGS_PATH.exists():
            raise FileNotFoundError(
                f"Embeddings file not found: {EMBEDDINGS_PATH}\n"
                "Run: python src/embeddings/generate-embeddings.py"
            )

        with open(EMBEDDINGS_PATH, 'r') as f:
            data = json.load(f)

        _cache['embeddings'] = data
        _cache['urls'] = list(data['embeddings'].keys())
        _cache['embedding_matrix'] = np.array([
            data['embeddings'][url] for url in _cache['urls']
        ])

        # Normalize for cosine similarity
        norms = np.linalg.norm(_cache['embedding_matrix'], axis=1, keepdims=True)
        _cache['embedding_matrix'] = _cache['embedding_matrix'] / norms

    return _cache['embeddings'], _cache['urls'], _cache['embedding_matrix']


def load_microsims_data():
    """Load MicroSims metadata to get GitHub URLs (cached)."""
    if _cache['microsims_data'] is None:
        if not MICROSIMS_DATA_PATH.exists():
            raise FileNotFoundError(
                f"MicroSims data not found: {MICROSIMS_DATA_PATH}\n"
                "Run: python src/crawl-microsims.py"
            )

        with open(MICROSIMS_DATA_PATH, 'r') as f:
            microsims = json.load(f)

        # Build lookup by URL
        _cache['microsims_data'] = {}
        for sim in microsims:
            url = sim.get('url') or sim.get('identifier')
            if url:
                _cache['microsims_data'][url] = sim

    return _cache['microsims_data']


def find_similar_templates(spec_text: str, top_n: int = 5) -> list:
    """
    Find the most similar MicroSim templates for a given specification.

    Args:
        spec_text: The SPECIFICATION block text
        top_n: Number of similar templates to return

    Returns:
        List of dicts with keys: github_url, live_url, title, score, framework, subject
    """
    # Parse the specification
    spec = parse_specification(spec_text)

    # Create query text
    query_text = create_query_text(spec)

    if not query_text.strip():
        # If parsing failed, use the raw text
        query_text = spec_text

    # Load model and embeddings
    model = load_model()
    _, urls, embedding_matrix = load_embeddings()
    microsims_data = load_microsims_data()

    # Generate embedding for query
    query_embedding = model.encode([query_text], convert_to_numpy=True)[0]

    # Normalize query embedding
    query_norm = np.linalg.norm(query_embedding)
    query_normalized = query_embedding / query_norm

    # Compute cosine similarity
    similarities = np.dot(embedding_matrix, query_normalized)

    # Get top N indices
    top_indices = np.argsort(similarities)[::-1][:top_n]

    # Build results
    results = []
    for idx in top_indices:
        url = urls[idx]
        score = float(similarities[idx])

        # Get metadata for this MicroSim
        sim_data = microsims_data.get(url, {})
        source = sim_data.get('_source', {})

        # Construct GitHub URL for code viewing
        github_url = source.get('github_url')
        if not github_url:
            # Fallback: construct from URL
            # https://dmccreary.github.io/repo/sims/name/ -> https://github.com/dmccreary/repo/tree/main/docs/sims/name
            if 'dmccreary.github.io' in url:
                match = re.match(r'https://dmccreary\.github\.io/([^/]+)/sims/([^/]+)/?', url)
                if match:
                    repo, sim_name = match.groups()
                    github_url = f"https://github.com/dmccreary/{repo}/tree/main/docs/sims/{sim_name}"

        results.append({
            'github_url': github_url,
            'live_url': url,
            'title': sim_data.get('title', 'Unknown'),
            'score': round(score, 4),
            'framework': sim_data.get('framework', 'unknown'),
            'subject': sim_data.get('subject', 'unknown'),
            'visualization_type': sim_data.get('visualizationType', []),
            'description': sim_data.get('description', '')[:200] if sim_data.get('description') else ''
        })

    return results


def format_results(results: list, as_json: bool = False) -> str:
    """Format results for output."""
    if as_json:
        return json.dumps(results, indent=2)

    output = []
    output.append("=" * 70)
    output.append("Similar MicroSim Templates")
    output.append("=" * 70)
    output.append("")

    for i, result in enumerate(results, 1):
        score = result['score']
        # Color-code score description
        if score >= 0.85:
            score_desc = "Highly Similar"
        elif score >= 0.70:
            score_desc = "Similar"
        elif score >= 0.50:
            score_desc = "Related"
        else:
            score_desc = "Somewhat Related"

        output.append(f"{i}. {result['title']}")
        output.append(f"   Score: {score:.4f} ({score_desc})")
        output.append(f"   Framework: {result['framework']}")
        output.append(f"   Subject: {result['subject']}")
        if result['visualization_type']:
            viz = result['visualization_type']
            if isinstance(viz, list):
                viz = ', '.join(viz)
            output.append(f"   Visualization: {viz}")
        output.append(f"   GitHub: {result['github_url']}")
        output.append(f"   Live: {result['live_url']}")
        output.append("")

    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(
        description='Find similar MicroSim templates from a specification',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # From specification file
    python find-similar-templates.py --file spec.txt

    # From stdin
    cat spec.txt | python find-similar-templates.py

    # Direct specification text
    python find-similar-templates.py --spec "Type: microsim
    Learning Objective: Students will understand pendulum motion..."

    # JSON output for programmatic use
    python find-similar-templates.py --file spec.txt --json
        """
    )

    parser.add_argument(
        '--file', '-f',
        help='Path to file containing SPECIFICATION block'
    )
    parser.add_argument(
        '--spec', '-s',
        help='Direct specification text'
    )
    parser.add_argument(
        '--top', '-n',
        type=int,
        default=5,
        help='Number of similar templates to return (default: 5)'
    )
    parser.add_argument(
        '--json', '-j',
        action='store_true',
        help='Output as JSON for programmatic use'
    )
    parser.add_argument(
        '--quiet', '-q',
        action='store_true',
        help='Suppress loading messages'
    )

    args = parser.parse_args()

    # Get specification text
    spec_text = None

    if args.file:
        spec_path = Path(args.file)
        if not spec_path.exists():
            print(f"Error: File not found: {args.file}", file=sys.stderr)
            sys.exit(1)
        spec_text = spec_path.read_text()
    elif args.spec:
        spec_text = args.spec
    elif not sys.stdin.isatty():
        spec_text = sys.stdin.read()

    if not spec_text or not spec_text.strip():
        print("Error: No specification provided", file=sys.stderr)
        print("Use --file, --spec, or pipe to stdin", file=sys.stderr)
        sys.exit(1)

    # Redirect loading messages if quiet
    if args.quiet:
        import io
        old_stderr = sys.stderr
        sys.stderr = io.StringIO()

    try:
        # Find similar templates
        if not args.quiet and not args.json:
            print("Loading model and embeddings...", file=sys.stderr)

        results = find_similar_templates(spec_text, args.top)

        # Format and output results
        output = format_results(results, as_json=args.json)
        print(output)

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        if args.quiet:
            sys.stderr = old_stderr


if __name__ == "__main__":
    main()
