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

# Pedagogical alignment scoring weights
SEMANTIC_WEIGHT = 0.6
PEDAGOGICAL_WEIGHT = 0.4

# Bloom verb to appropriate pedagogical patterns mapping
# Higher scores indicate better alignment
VERB_PATTERN_ALIGNMENT = {
    # Remember verbs - favor reference, demonstration
    "define": {"reference": 1.0, "demonstration": 0.8, "worked-example": 0.6},
    "identify": {"reference": 0.9, "demonstration": 0.8, "assessment": 0.7},
    "list": {"reference": 1.0, "demonstration": 0.7},
    "recall": {"reference": 0.9, "assessment": 0.8, "practice": 0.7},
    "recognize": {"reference": 0.8, "assessment": 0.9, "demonstration": 0.7},
    "state": {"reference": 1.0, "demonstration": 0.8},

    # Understand verbs - favor worked-example, demonstration
    "classify": {"worked-example": 0.9, "assessment": 0.8, "exploration": 0.7},
    "compare": {"exploration": 0.9, "demonstration": 0.8, "worked-example": 0.7},
    "describe": {"demonstration": 0.9, "worked-example": 0.8, "reference": 0.7},
    "explain": {"worked-example": 1.0, "demonstration": 0.8, "guided-discovery": 0.7},
    "interpret": {"worked-example": 0.9, "exploration": 0.8, "demonstration": 0.7},
    "summarize": {"reference": 0.9, "demonstration": 0.8, "worked-example": 0.7},

    # Apply verbs - favor practice, exploration, guided-discovery
    "apply": {"practice": 0.9, "exploration": 0.8, "guided-discovery": 0.8},
    "calculate": {"practice": 1.0, "worked-example": 0.8, "exploration": 0.7},
    "demonstrate": {"worked-example": 1.0, "demonstration": 0.9, "guided-discovery": 0.7},
    "illustrate": {"demonstration": 0.9, "worked-example": 0.8, "exploration": 0.7},
    "implement": {"practice": 0.9, "exploration": 0.8, "guided-discovery": 0.7},
    "solve": {"practice": 1.0, "guided-discovery": 0.8, "exploration": 0.7},
    "use": {"practice": 0.8, "exploration": 0.8, "guided-discovery": 0.7},

    # Analyze verbs - favor exploration, guided-discovery
    "analyze": {"exploration": 1.0, "guided-discovery": 0.9, "demonstration": 0.6},
    "differentiate": {"exploration": 0.9, "demonstration": 0.8, "worked-example": 0.7},
    "examine": {"exploration": 0.9, "guided-discovery": 0.8, "demonstration": 0.7},
    "experiment": {"exploration": 1.0, "guided-discovery": 0.9, "practice": 0.7},
    "investigate": {"exploration": 1.0, "guided-discovery": 0.9},
    "test": {"exploration": 0.9, "assessment": 0.8, "practice": 0.7},

    # Evaluate verbs - favor assessment, exploration
    "assess": {"assessment": 1.0, "exploration": 0.7, "practice": 0.7},
    "critique": {"assessment": 0.9, "exploration": 0.8},
    "evaluate": {"assessment": 1.0, "exploration": 0.8, "guided-discovery": 0.7},
    "judge": {"assessment": 0.9, "exploration": 0.8},
    "justify": {"assessment": 0.8, "worked-example": 0.7, "exploration": 0.7},
    "predict": {"guided-discovery": 1.0, "exploration": 0.9, "assessment": 0.7},

    # Create verbs - favor exploration
    "construct": {"exploration": 1.0, "guided-discovery": 0.8, "practice": 0.7},
    "create": {"exploration": 1.0, "guided-discovery": 0.8},
    "design": {"exploration": 1.0, "guided-discovery": 0.9},
    "develop": {"exploration": 0.9, "guided-discovery": 0.8, "practice": 0.7},
    "formulate": {"exploration": 0.9, "guided-discovery": 0.8},
    "generate": {"exploration": 0.9, "practice": 0.7}
}

# Bloom level to appropriate patterns (fallback if verb not found)
LEVEL_PATTERN_ALIGNMENT = {
    "remember": {"reference": 1.0, "demonstration": 0.8, "assessment": 0.6},
    "understand": {"worked-example": 1.0, "demonstration": 0.9, "guided-discovery": 0.7},
    "apply": {"practice": 1.0, "exploration": 0.8, "guided-discovery": 0.8},
    "analyze": {"exploration": 1.0, "guided-discovery": 0.9, "demonstration": 0.5},
    "evaluate": {"assessment": 1.0, "exploration": 0.8, "guided-discovery": 0.7},
    "create": {"exploration": 1.0, "guided-discovery": 0.9}
}

# Pacing appropriateness by Bloom level
LEVEL_PACING_ALIGNMENT = {
    "remember": {"self-paced": 0.9, "step-through": 0.8, "continuous": 0.6, "timed": 0.5},
    "understand": {"step-through": 1.0, "self-paced": 0.9, "continuous": 0.5, "timed": 0.4},
    "apply": {"self-paced": 1.0, "step-through": 0.8, "continuous": 0.6, "timed": 0.7},
    "analyze": {"self-paced": 1.0, "continuous": 0.7, "step-through": 0.6, "timed": 0.4},
    "evaluate": {"self-paced": 0.9, "timed": 0.8, "step-through": 0.7, "continuous": 0.5},
    "create": {"self-paced": 1.0, "step-through": 0.7, "continuous": 0.5, "timed": 0.3}
}

# Patterns that are inappropriate for certain verbs (penalty applied)
PATTERN_PENALTIES = {
    "explain": {"continuous": -0.3},  # Continuous animation bad for explain
    "demonstrate": {"reference": -0.2},  # Reference bad for demonstrate
    "experiment": {"reference": -0.3, "worked-example": -0.2},
    "predict": {"reference": -0.3},
    "create": {"reference": -0.4, "demonstration": -0.2}
}

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


def extract_bloom_info(spec: dict) -> tuple[Optional[str], Optional[str]]:
    """
    Extract Bloom level and verb from a parsed specification.

    Returns:
        Tuple of (bloom_level, bloom_verb) in lowercase, or (None, None) if not found
    """
    bloom_level = None
    bloom_verb = None

    # Extract Bloom level
    level_text = spec.get('bloom_level', '')
    if level_text:
        # Parse formats like "Apply (L3)" or just "Apply"
        level_match = re.match(r'(\w+)', level_text.lower())
        if level_match:
            bloom_level = level_match.group(1)

    # Extract Bloom verb
    verb_text = spec.get('bloom_verb', '')
    if verb_text:
        bloom_verb = verb_text.lower().strip()

    return bloom_level, bloom_verb


def compute_pedagogical_score(spec: dict, template_data: dict) -> float:
    """
    Compute a pedagogical alignment score between a specification and a template.

    Args:
        spec: Parsed specification dict
        template_data: Template's metadata from microsims-data.json

    Returns:
        Score between 0.0 and 1.0 indicating pedagogical alignment
    """
    pedagogical = template_data.get('pedagogical', {})
    if not pedagogical:
        # No pedagogical data - return neutral score
        return 0.5

    bloom_level, bloom_verb = extract_bloom_info(spec)

    template_pattern = pedagogical.get('pattern', '')
    template_pacing = pedagogical.get('pacing', '')
    template_verbs = pedagogical.get('bloomVerbs', [])
    template_bloom_alignment = pedagogical.get('bloomAlignment', [])

    scores = []

    # 1. Pattern alignment score (most important)
    pattern_score = 0.5  # Default neutral

    if bloom_verb and template_pattern:
        # Check verb-specific alignment
        verb_patterns = VERB_PATTERN_ALIGNMENT.get(bloom_verb, {})
        if template_pattern in verb_patterns:
            pattern_score = verb_patterns[template_pattern]
        elif bloom_level:
            # Fallback to level-based alignment
            level_patterns = LEVEL_PATTERN_ALIGNMENT.get(bloom_level, {})
            pattern_score = level_patterns.get(template_pattern, 0.5)

        # Apply penalties for known bad combinations
        penalties = PATTERN_PENALTIES.get(bloom_verb, {})
        if template_pattern in penalties:
            pattern_score = max(0.0, pattern_score + penalties[template_pattern])

    elif bloom_level and template_pattern:
        # Only have level, not verb
        level_patterns = LEVEL_PATTERN_ALIGNMENT.get(bloom_level, {})
        pattern_score = level_patterns.get(template_pattern, 0.5)

    scores.append(('pattern', pattern_score, 0.4))  # 40% weight

    # 2. Verb match score
    verb_score = 0.5  # Default neutral
    if bloom_verb and template_verbs:
        if bloom_verb in template_verbs:
            verb_score = 1.0  # Exact match
        else:
            # Check for related verbs at same Bloom level
            verb_score = 0.6  # Partial credit if template has verbs
    scores.append(('verb', verb_score, 0.25))  # 25% weight

    # 3. Pacing alignment score
    pacing_score = 0.5  # Default neutral
    if bloom_level and template_pacing:
        pacing_alignment = LEVEL_PACING_ALIGNMENT.get(bloom_level, {})
        pacing_score = pacing_alignment.get(template_pacing, 0.5)
    scores.append(('pacing', pacing_score, 0.2))  # 20% weight

    # 4. Bloom level alignment score
    level_score = 0.5  # Default neutral
    if bloom_level and template_bloom_alignment:
        if bloom_level in template_bloom_alignment:
            level_score = 1.0
        else:
            # Adjacent levels get partial credit
            level_order = ["remember", "understand", "apply", "analyze", "evaluate", "create"]
            if bloom_level in level_order:
                spec_idx = level_order.index(bloom_level)
                for tmpl_level in template_bloom_alignment:
                    if tmpl_level in level_order:
                        tmpl_idx = level_order.index(tmpl_level)
                        distance = abs(spec_idx - tmpl_idx)
                        if distance == 1:
                            level_score = max(level_score, 0.7)
                        elif distance == 2:
                            level_score = max(level_score, 0.5)
    scores.append(('level', level_score, 0.15))  # 15% weight

    # Compute weighted average
    total_score = sum(score * weight for _, score, weight in scores)
    total_weight = sum(weight for _, _, weight in scores)

    return total_score / total_weight if total_weight > 0 else 0.5


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

    # Compute cosine similarity (semantic score)
    semantic_similarities = np.dot(embedding_matrix, query_normalized)

    # Compute combined scores with pedagogical alignment
    combined_scores = []
    for idx, url in enumerate(urls):
        semantic_score = float(semantic_similarities[idx])
        sim_data = microsims_data.get(url, {})

        # Compute pedagogical alignment score
        pedagogical_score = compute_pedagogical_score(spec, sim_data)

        # Combine scores
        combined_score = (SEMANTIC_WEIGHT * semantic_score +
                          PEDAGOGICAL_WEIGHT * pedagogical_score)

        combined_scores.append((idx, combined_score, semantic_score, pedagogical_score))

    # Sort by combined score
    combined_scores.sort(key=lambda x: x[1], reverse=True)

    # Get top N
    top_results = combined_scores[:top_n]

    # Build results
    results = []
    for idx, combined_score, semantic_score, pedagogical_score in top_results:
        url = urls[idx]

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

        # Get pedagogical metadata for display
        pedagogical = sim_data.get('pedagogical', {})

        results.append({
            'github_url': github_url,
            'live_url': url,
            'title': sim_data.get('title', 'Unknown'),
            'score': round(combined_score, 4),
            'semantic_score': round(semantic_score, 4),
            'pedagogical_score': round(pedagogical_score, 4),
            'framework': sim_data.get('framework', 'unknown'),
            'subject': sim_data.get('subject', 'unknown'),
            'visualization_type': sim_data.get('visualizationType', []),
            'pattern': pedagogical.get('pattern', 'unknown'),
            'pacing': pedagogical.get('pacing', 'unknown'),
            'bloom_verbs': pedagogical.get('bloomVerbs', []),
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
        semantic = result.get('semantic_score', score)
        pedagogical = result.get('pedagogical_score', 0.5)

        # Color-code score description
        if score >= 0.85:
            score_desc = "Excellent Match"
        elif score >= 0.70:
            score_desc = "Good Match"
        elif score >= 0.55:
            score_desc = "Moderate Match"
        else:
            score_desc = "Weak Match"

        output.append(f"{i}. {result['title']}")
        output.append(f"   Combined Score: {score:.4f} ({score_desc})")
        output.append(f"   ├─ Semantic: {semantic:.4f}  Pedagogical: {pedagogical:.4f}")
        output.append(f"   Pattern: {result.get('pattern', 'unknown')}  Pacing: {result.get('pacing', 'unknown')}")
        if result.get('bloom_verbs'):
            verbs = result['bloom_verbs'][:4]  # Show first 4 verbs
            output.append(f"   Bloom Verbs: {', '.join(verbs)}")
        output.append(f"   Framework: {result['framework']}  Subject: {result['subject']}")
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
