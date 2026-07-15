#!/usr/bin/env python3
"""
Find Similar MicroSim Templates / Reusable MicroSims

A service with two modes:

  --mode template (default)
    Takes a MicroSim specification (SPECIFICATION block format) and returns the
    most relevant existing MicroSims to use as templates when generating a new
    MicroSim. Scores on WHAT similarity + HOW similarity + pedagogical alignment.
    Used by the microsim-generator skill.

  --mode reuse
    Takes a plain WHAT query (or a specification) and returns existing MicroSims
    that already teach the same concept, ranked purely on WHAT similarity — a
    perfect concept match in a different library is still reusable via iframe.
    Each result carries a "recommendation" band (reuse / template / generate)
    and an iframe-ready embed snippet. Used by the chapter-content-generator
    skill to avoid regenerating MicroSims that already exist.

Usage:
    # Template mode from specification file
    python src/find-similar-templates/find-similar-templates.py --file spec.txt

    # Template mode from stdin
    echo "Type: microsim\nBloom Level: Apply (L3)..." | python src/find-similar-templates/find-similar-templates.py

    # Reuse mode with a plain WHAT query (chapter-content-generator integration)
    python src/find-similar-templates/find-similar-templates.py --mode reuse \
        --query "Title: Scientific Method Workflow | Topic: scientific method | Subjects: Physics | Grade Level: high school | Learning Objectives: Students will sequence the steps of the scientific method" \
        --top 3 --json --quiet

    # Return more results (default is 5)
    python src/find-similar-templates/find-similar-templates.py --file spec.txt --top 10

    # Output as JSON for programmatic use
    python src/find-similar-templates/find-similar-templates.py --file spec.txt --json

Requirements:
    pip install sentence-transformers numpy
    (Requires Python 3.12 or earlier - PyTorch doesn't support Python 3.13 yet)

Output:
    Returns GitHub repository URLs and live URLs for the most similar MicroSims,
    with per-result scores; in reuse mode also a recommendation band and an
    iframe snippet ready to paste into a chapter markdown file.
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

# Template-mode scoring weights: WHAT (concept) + HOW (implementation style)
# + pedagogical alignment. When a spec has no HOW content, the HOW weight is
# folded into WHAT (0.70 what + 0.30 pedagogical).
WHAT_WEIGHT = 0.35
HOW_WEIGHT = 0.35
PEDAGOGICAL_WEIGHT = 0.30

# Reuse-mode recommendation bands, applied to the pure WHAT cosine score.
# Recalibrated 2026-07-15 against the 1,411-sim catalog after rewriting
# ~628 sims' boilerplate learningObjectives into concept-specific text (see
# src/enrich-metadata/README.md). Result: enrichment did NOT let us raise
# REUSE_THRESHOLD toward 0.80 as originally hoped. It tightened the noise
# floor (related-but-different concepts dropped from 0.60-0.75 to 0.53-0.69;
# absent concepts from 0.48-0.51 to 0.43-0.51) but same-concept matches also
# spread wider (0.73-0.86, vs 0.78-0.86 before) because specific technical
# objectives sit further from generically-phrased queries than generic
# boilerplate text did. Net gap between the same-concept floor and the
# related-different ceiling widened only slightly (0.031 -> 0.044), and a
# genuine same-concept probe (Coulomb's law) now scores 0.730 — below the
# existing 0.75 threshold. Raising the threshold would have increased
# false negatives (missed reuse) without clear evidence it reduces false
# positives. Keep REUSE_THRESHOLD conservative: a false-positive reuse (the
# wrong sim embedded in a published book) costs more than regenerating.
REUSE_THRESHOLD = 0.75      # >= this: embed an iframe to the existing sim
TEMPLATE_THRESHOLD = 0.60   # >= this: generate new, but use the match as a template

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
    'what_matrix': None,
    'how_matrix': None
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


def create_what_query_text(spec: dict) -> str:
    """
    Create the WHAT query text from a parsed specification: what the
    MicroSim should teach. Mirrors the WHAT embedding text format in
    generate-embeddings.py to ensure semantic alignment.
    """
    parts = []

    if 'title' in spec:
        parts.append(f"Title: {spec['title']}")

    if 'topic' in spec:
        parts.append(f"Topic: {spec['topic']}")

    if 'subject' in spec:
        parts.append(f"Subjects: {spec['subject']}")
    if 'subjects' in spec:
        parts.append(f"Subjects: {spec['subjects']}")

    if 'grade_level' in spec:
        parts.append(f"Grade Level: {spec['grade_level']}")

    # Learning objective is most important for semantic matching
    if 'learning_objective' in spec:
        parts.append(f"Learning Objectives: {spec['learning_objective']}")
    if 'learning_objectives' in spec:
        parts.append(f"Learning Objectives: {spec['learning_objectives']}")

    # Bloom's taxonomy
    if 'bloom_level' in spec:
        parts.append(f"Cognitive Level: {spec['bloom_level']}")
    if 'bloom_verb' in spec:
        parts.append(f"Action: {spec['bloom_verb']}")

    return " | ".join(parts)


def create_how_query_text(spec: dict) -> str:
    """
    Create the HOW query text from a parsed specification: how the
    MicroSim should be implemented. Mirrors the HOW embedding text
    format in generate-embeddings.py where labels overlap.
    """
    parts = []

    # Type of visualization
    if 'type' in spec:
        parts.append(f"Visualization: {spec['type']}")

    # Implementation hints
    if 'implementation' in spec or 'implementation_notes' in spec:
        impl = spec.get('implementation') or spec.get('implementation_notes')
        parts.append(f"Framework: {impl}")

    # Visual elements describe what the MicroSim shows
    if 'visual_elements' in spec:
        parts.append(f"Visual Elements: {spec['visual_elements']}")

    # Canvas layout describes structure
    if 'canvas_layout' in spec:
        parts.append(f"Layout: {spec['canvas_layout']}")

    # Interactive controls describe functionality
    if 'interactive_controls' in spec:
        parts.append(f"Controls: {spec['interactive_controls']}")

    # Behavior describes interactions
    if 'behavior' in spec:
        parts.append(f"Behavior: {spec['behavior']}")

    # Animation effects
    if 'animation' in spec:
        parts.append(f"Animation: {spec['animation']}")

    return " | ".join(parts)


def load_model():
    """Load the sentence transformer model (cached)."""
    if _cache['model'] is None:
        _cache['model'] = SentenceTransformer(MODEL_NAME)
    return _cache['model']


def _normalize_rows(matrix: np.ndarray) -> np.ndarray:
    """L2-normalize matrix rows for cosine similarity via dot product."""
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return matrix / norms


def load_embeddings():
    """
    Load precomputed embeddings (cached).

    Supports the dual-v1 schema ({"what": [...], "how": [...]} per URL) and
    the legacy flat format (a plain vector per URL), where the single legacy
    vector is used as both the WHAT and HOW matrix.
    """
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

        if data.get('metadata', {}).get('schema') == 'dual-v1':
            what_matrix = np.array([
                data['embeddings'][url]['what'] for url in _cache['urls']
            ])
            how_matrix = np.array([
                data['embeddings'][url]['how'] for url in _cache['urls']
            ])
        else:
            # Legacy single-vector format: use it for both roles
            what_matrix = np.array([
                data['embeddings'][url] for url in _cache['urls']
            ])
            how_matrix = what_matrix

        _cache['what_matrix'] = _normalize_rows(what_matrix)
        _cache['how_matrix'] = (
            _cache['what_matrix'] if how_matrix is what_matrix
            else _normalize_rows(how_matrix)
        )

    return _cache['embeddings'], _cache['urls'], _cache['what_matrix'], _cache['how_matrix']


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


def fullscreen_url_for(live_url: str) -> str:
    """Build the directly-embeddable main.html URL from a catalog live URL."""
    if live_url.endswith('main.html'):
        return live_url
    if not live_url.endswith('/'):
        live_url += '/'
    return live_url + 'main.html'


def iframe_snippet_for(live_url: str) -> str:
    """Build an iframe embed snippet for a reused MicroSim."""
    return (f'<iframe src="{fullscreen_url_for(live_url)}" '
            f'width="100%" height="500px" scrolling="no"></iframe>')


def recommendation_for(what_score: float) -> str:
    """Map a WHAT similarity score to a reuse recommendation band."""
    if what_score >= REUSE_THRESHOLD:
        return 'reuse'
    if what_score >= TEMPLATE_THRESHOLD:
        return 'template'
    return 'generate'


def find_similar_templates(spec_text: str = None, top_n: int = 5,
                           mode: str = 'template', query_text: str = None,
                           min_score: float = None) -> list:
    """
    Find the most similar MicroSims for a specification or a plain WHAT query.

    Args:
        spec_text: The SPECIFICATION block text (template mode, or reuse
                   mode when no query_text is given)
        top_n: Number of results to return
        mode: 'template' ranks on WHAT + HOW + pedagogical alignment;
              'reuse' ranks on pure WHAT similarity
        query_text: Plain WHAT query text (bypasses spec parsing)
        min_score: Optional minimum score filter on the ranking score

    Returns:
        List of result dicts. Reuse mode adds recommendation,
        iframe_snippet and fullscreen_url per result.
    """
    if query_text and query_text.strip():
        spec = parse_specification(query_text)
        what_query = query_text
        how_query = ""
    else:
        spec = parse_specification(spec_text)
        what_query = create_what_query_text(spec)
        how_query = create_how_query_text(spec)
        if not what_query.strip() and not how_query.strip():
            # If parsing failed, use the raw text as the WHAT query
            what_query = spec_text

    # Load model and embeddings
    model = load_model()
    _, urls, what_matrix, how_matrix = load_embeddings()
    microsims_data = load_microsims_data()

    def encode_normalized(text: str) -> np.ndarray:
        embedding = model.encode([text], convert_to_numpy=True)[0]
        norm = np.linalg.norm(embedding)
        return embedding / norm if norm > 0 else embedding

    # WHAT similarity: what the sim teaches vs what the query asks for
    what_similarities = np.dot(what_matrix, encode_normalized(what_query))

    # HOW similarity: implementation style (only when the query describes one)
    how_similarities = None
    if how_query.strip():
        how_similarities = np.dot(how_matrix, encode_normalized(how_query))

    # Score all catalog entries
    scored = []
    for idx, url in enumerate(urls):
        what_score = float(what_similarities[idx])
        how_score = float(how_similarities[idx]) if how_similarities is not None else None
        sim_data = microsims_data.get(url, {})
        pedagogical_score = compute_pedagogical_score(spec, sim_data)

        if mode == 'reuse':
            # Pure WHAT ranking: a perfect concept match in a different
            # library is still reusable via iframe.
            ranking_score = what_score
        else:
            if how_score is not None:
                ranking_score = (WHAT_WEIGHT * what_score +
                                 HOW_WEIGHT * how_score +
                                 PEDAGOGICAL_WEIGHT * pedagogical_score)
            else:
                # No HOW content in the query: fold HOW weight into WHAT
                ranking_score = ((WHAT_WEIGHT + HOW_WEIGHT) * what_score +
                                 PEDAGOGICAL_WEIGHT * pedagogical_score)

        scored.append((idx, ranking_score, what_score, how_score, pedagogical_score))

    # Sort by ranking score
    scored.sort(key=lambda x: x[1], reverse=True)

    if min_score is not None:
        scored = [s for s in scored if s[1] >= min_score]

    top_results = scored[:top_n]

    # Build results
    results = []
    for idx, ranking_score, what_score, how_score, pedagogical_score in top_results:
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

        result = {
            'github_url': github_url,
            'live_url': url,
            'title': sim_data.get('title', 'Unknown'),
            'score': round(ranking_score, 4),
            'what_score': round(what_score, 4),
            'how_score': round(how_score, 4) if how_score is not None else None,
            'pedagogical_score': round(pedagogical_score, 4),
            'framework': sim_data.get('framework', 'unknown'),
            'subject': sim_data.get('subject', 'unknown'),
            'grade_level': sim_data.get('gradeLevel', 'unknown'),
            'visualization_type': sim_data.get('visualizationType', []),
            'pattern': pedagogical.get('pattern', 'unknown'),
            'pacing': pedagogical.get('pacing', 'unknown'),
            'bloom_verbs': pedagogical.get('bloomVerbs', []),
            'description': sim_data.get('description', '')[:200] if sim_data.get('description') else ''
        }

        if mode == 'reuse':
            result['recommendation'] = recommendation_for(what_score)
            result['fullscreen_url'] = fullscreen_url_for(url)
            result['iframe_snippet'] = iframe_snippet_for(url)

        results.append(result)

    return results


def format_results(results: list, as_json: bool = False, mode: str = 'template') -> str:
    """Format results for output."""
    if as_json:
        return json.dumps(results, indent=2)

    output = []
    output.append("=" * 70)
    if mode == 'reuse':
        output.append("Reusable Existing MicroSims")
    else:
        output.append("Similar MicroSim Templates")
    output.append("=" * 70)
    output.append("")

    for i, result in enumerate(results, 1):
        score = result['score']
        what = result.get('what_score', score)
        how = result.get('how_score')
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
        if mode == 'reuse':
            output.append(f"   WHAT Score: {what:.4f}  Recommendation: {result.get('recommendation', 'unknown')}")
        else:
            output.append(f"   Combined Score: {score:.4f} ({score_desc})")
            how_str = f"{how:.4f}" if how is not None else "n/a"
            output.append(f"   ├─ WHAT: {what:.4f}  HOW: {how_str}  Pedagogical: {pedagogical:.4f}")
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
        if mode == 'reuse':
            output.append(f"   Embed: {result.get('iframe_snippet', '')}")
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
        '--mode', '-m',
        choices=['template', 'reuse'],
        default='template',
        help='template: rank on WHAT + HOW + pedagogical alignment (default); '
             'reuse: rank on pure WHAT similarity to find existing MicroSims '
             'to embed via iframe instead of generating new ones'
    )
    parser.add_argument(
        '--query',
        help='Plain WHAT query text (e.g. "Title: ... | Topic: ... | '
             'Learning Objectives: ..."), alternative to --spec/--file'
    )
    parser.add_argument(
        '--min-score',
        type=float,
        help='Only return results with a ranking score at or above this value'
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
    elif not args.query and not sys.stdin.isatty():
        spec_text = sys.stdin.read()

    if (not spec_text or not spec_text.strip()) and not (args.query and args.query.strip()):
        print("Error: No specification or query provided", file=sys.stderr)
        print("Use --file, --spec, --query, or pipe to stdin", file=sys.stderr)
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

        results = find_similar_templates(
            spec_text,
            args.top,
            mode=args.mode,
            query_text=args.query,
            min_score=args.min_score
        )

        # Format and output results
        output = format_results(results, as_json=args.json, mode=args.mode)
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
