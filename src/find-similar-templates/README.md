# Find Similar MicroSim Templates / Reusable MicroSims

A service with two modes:

- **Template mode** (default): takes a MicroSim specification (SPECIFICATION block format) and returns the most relevant existing MicroSims to use as templates. Used by the `microsim-generator` skill when creating new MicroSims.
- **Reuse mode** (`--mode reuse`): takes a plain WHAT query (or a specification) and returns existing MicroSims that already teach the same concept, so the `chapter-content-generator` skill can embed them via iframe instead of regenerating them from scratch.

## Purpose

When the microsim-generator skill receives a specification for a new MicroSim, it can use this service to find existing MicroSims that are semantically similar. These similar MicroSims serve as templates and reference implementations, helping the generator:

1. Follow established patterns for the chosen visualization type
2. Use appropriate frameworks and libraries
3. Implement similar interactive controls
4. Match the expected quality and structure

When the chapter-content-generator skill is about to write a new MicroSim specification, reuse mode tells it whether an existing hosted MicroSim already teaches the concept — avoiding a duplicate that would need to be generated and debugged all over again.

## How It Works

The catalog embeddings are **dual** (schema `dual-v1`): each MicroSim has a WHAT vector (what it teaches) and a HOW vector (how it's implemented). See `src/embeddings/README.md`.

**Template mode:**

1. **Parse Specification**: Extracts structured fields from the SPECIFICATION block format
2. **Create Query Embeddings**: Builds a WHAT query (learning objective, topic, subject, Bloom level) and a HOW query (visual elements, layout, controls, framework) using the same model (`all-MiniLM-L6-v2`)
3. **Compute Similarities**: Cosine similarity of the WHAT query against WHAT vectors and the HOW query against HOW vectors
4. **Compute Pedagogical Alignment**: Scores how well each template's pedagogical pattern matches the specification's Bloom level and verb
5. **Combine Scores**: Final score = 35% WHAT + 35% HOW + 30% pedagogical (when the spec has no HOW content: 70% WHAT + 30% pedagogical)
6. **Return Results**: Returns the top N most similar MicroSims with their GitHub URLs for use as templates

**Reuse mode:**

1. Takes a plain WHAT query via `--query` (format: `Title: ... | Topic: ... | Subjects: ... | Grade Level: ... | Learning Objectives: ...`) or a specification
2. Ranks on **pure WHAT cosine similarity** — a perfect concept match in a different library is still reusable via iframe
3. Each result includes a `recommendation` band and an `iframe_snippet`:

| Band | WHAT score | Meaning |
|------|-----------|---------|
| `reuse` | ≥ 0.75 | Embed an iframe to the existing sim instead of writing a spec |
| `template` | 0.60 – 0.75 | Write a new spec, cite the match as a template |
| `generate` | < 0.60 | Write a new spec from scratch |

Thresholds recalibrated 2026-07-15 against the 1,411-sim catalog, after rewriting ~628 sims' auto-generated boilerplate `learningObjectives` into concept-specific text: same-concept matches now score 0.73–0.86, related-but-different concepts 0.53–0.69, absent concepts 0.43–0.51. The enrichment tightened the noise floor (related/absent scores dropped) but did not raise the same-concept floor enough to justify moving `REUSE_THRESHOLD` up toward 0.80 — a genuine same-concept probe (Coulomb's law) now scores 0.730, just below the current 0.75 threshold, so raising it would trade missed reuse opportunities for a separation gain that didn't materialize on the same-concept side. `REUSE_THRESHOLD` stays at 0.75.

### Pedagogical Alignment Scoring

The service now considers pedagogical appropriateness, not just visual/structural similarity:

| Bloom Verb | Best Patterns | Penalized Patterns |
|------------|---------------|-------------------|
| explain | worked-example, demonstration | continuous animation |
| demonstrate | worked-example, demonstration | reference |
| experiment | exploration, guided-discovery | reference, worked-example |
| predict | guided-discovery, exploration | reference |
| calculate | practice, worked-example | - |
| create | exploration, guided-discovery | reference, demonstration |

This prevents mismatches like recommending a continuous animation template for an "explain" objective, which would be pedagogically inappropriate.

## Usage

### Command Line

```bash
# Activate the embeddings virtual environment
source .venv-embeddings/bin/activate

# From a specification file
python src/find-similar-templates/find-similar-templates.py --file spec.txt

# From stdin
cat spec.txt | python src/find-similar-templates/find-similar-templates.py

# Direct specification text
python src/find-similar-templates/find-similar-templates.py --spec "Type: microsim
Learning Objective: Students will understand pendulum motion..."

# Return more results (default is 5)
python src/find-similar-templates/find-similar-templates.py --file spec.txt --top 10

# JSON output for programmatic use
python src/find-similar-templates/find-similar-templates.py --file spec.txt --json

# Quiet mode (suppress loading messages)
python src/find-similar-templates/find-similar-templates.py --file spec.txt --quiet --json

# REUSE MODE: find existing MicroSims to embed instead of regenerating
# (used by the chapter-content-generator skill; works from any directory
# with absolute paths and the venv's python directly)
/Users/dan/Documents/ws/search-microsims/.venv-embeddings/bin/python \
  /Users/dan/Documents/ws/search-microsims/src/find-similar-templates/find-similar-templates.py \
  --mode reuse \
  --query "Title: Scientific Method Workflow | Topic: scientific method | Subjects: Physics | Grade Level: high school | Learning Objectives: Students will sequence the steps of the scientific method" \
  --top 3 --json --quiet

# Optional: filter out weak results
python src/find-similar-templates/find-similar-templates.py --mode reuse --query "..." --min-score 0.6 --json
```

Reuse-mode JSON results add these fields:

```json
{
  "what_score": 0.7935,
  "how_score": null,
  "recommendation": "reuse",
  "fullscreen_url": "https://dmccreary.github.io/intro-to-physics-course/sims/scientific-method/main.html",
  "iframe_snippet": "<iframe src=\"https://dmccreary.github.io/intro-to-physics-course/sims/scientific-method/main.html\" width=\"100%\" height=\"500px\" scrolling=\"no\"></iframe>"
}
```

### Python API

```python
from find_similar_templates import find_similar_templates

spec_text = """
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: demonstrate

Learning Objective: Students will demonstrate understanding of simple
harmonic motion by adjusting pendulum parameters and observing period changes.

Visual elements:
- Pendulum animation with string and bob
- Period display
- Parameter sliders

Interactive controls:
- Slider: Pendulum length (0.5m - 2.0m)
- Slider: Gravity (1 - 20 m/s²)
- Button: Reset

Implementation notes:
- p5.js for physics simulation
- Use simple harmonic motion formula: T = 2π√(L/g)
"""

results = find_similar_templates(spec_text, top_n=5)

for result in results:
    print(f"{result['title']}")
    print(f"  GitHub: {result['github_url']}")
    print(f"  Score: {result['score']}")
```

## Input Format

The service accepts SPECIFICATION blocks in the format used in chapter `index.md` files:

```markdown
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: demonstrate

Learning Objective: Students will compare how the same concept can be
presented at different difficulty levels.

Canvas layout:
- Left panel (300px): Beginner version
- Right panel (300px): Advanced version

Visual elements:
- Two side-by-side animations
- Clear labels
- Period display

Interactive controls:
- Toggle switch: Show Beginner / Show Both / Show Advanced
- Slider: Parameter A (0 - 100)
- Button: Reset

Default parameters:
- Parameter A: 50
- Animation speed: Real-time

Behavior:
- Both animations update in real-time
- Display shows calculated values

Implementation notes:
- p5.js for simulation
- Responsive layout
```

### Key Fields for Matching

**Semantic Matching** (60% of score):

| Field | Weight | Description |
|-------|--------|-------------|
| `Learning Objective` | High | Most important for semantic matching |
| `Visual elements` | High | What the MicroSim displays |
| `Interactive controls` | High | User interaction capabilities |
| `Type` | Medium | Type of visualization (microsim, diagram, etc.) |
| `Implementation` | Medium | Framework hints (p5.js, d3.js, etc.) |
| `Canvas layout` | Medium | Structure and layout |
| `Behavior` | Medium | Interaction patterns |

**Pedagogical Matching** (40% of score):

| Field | Weight | Description |
|-------|--------|-------------|
| `Bloom Verb` | High | Action verb determines appropriate patterns |
| `Bloom Level` | Medium | Cognitive level affects pacing preferences |

## Output Format

### Human-Readable (default)

```
======================================================================
Similar MicroSim Templates
======================================================================

1. Pendulum Motion Explorer
   Combined Score: 0.8123 (Excellent Match)
   ├─ Semantic: 0.7205  Pedagogical: 0.9500
   Pattern: exploration  Pacing: self-paced
   Bloom Verbs: experiment, analyze, predict
   Framework: p5.js  Subject: Physics
   Visualization: animation, simulation
   GitHub: https://github.com/dmccreary/physics-sims/tree/main/docs/sims/pendulum
   Live: https://dmccreary.github.io/physics-sims/sims/pendulum/

2. Simple Harmonic Motion
   Combined Score: 0.7456 (Good Match)
   ...
```

### JSON Output (`--json` flag)

```json
[
  {
    "github_url": "https://github.com/dmccreary/physics-sims/tree/main/docs/sims/pendulum",
    "live_url": "https://dmccreary.github.io/physics-sims/sims/pendulum/",
    "title": "Pendulum Motion Explorer",
    "score": 0.8123,
    "semantic_score": 0.7205,
    "pedagogical_score": 0.9500,
    "framework": "p5.js",
    "subject": "Physics",
    "visualization_type": ["animation", "simulation"],
    "pattern": "exploration",
    "pacing": "self-paced",
    "bloom_verbs": ["experiment", "analyze", "predict"],
    "description": "An interactive simulation..."
  }
]
```

## Score Interpretation

The combined score reflects both semantic similarity and pedagogical alignment:

| Score Range | Category | Meaning |
|-------------|----------|---------|
| 0.85 - 1.00 | Excellent Match | High semantic + pedagogical alignment |
| 0.70 - 0.85 | Good Match | Strong match on content and/or pedagogy |
| 0.55 - 0.70 | Moderate Match | Related content, may need adaptation |
| 0.00 - 0.55 | Weak Match | Loosely connected, significant adaptation needed |

**Interpreting the component scores:**
- **Semantic score > 0.7**: Very similar content/topic
- **Pedagogical score > 0.8**: Excellent pattern match for the Bloom verb
- **Pedagogical score < 0.5**: Pattern mismatch (e.g., continuous animation for "explain")

## Requirements

- Python 3.12 or earlier (PyTorch constraint)
- sentence-transformers
- numpy

### Setup

```bash
# Use the existing embeddings virtual environment
source .venv-embeddings/bin/activate

# Or create a new one
python3.12 -m venv .venv-embeddings
source .venv-embeddings/bin/activate
pip install sentence-transformers numpy
```

### Data Dependencies

The service requires these pre-generated files:

1. **`data/microsims-embeddings.json`** - Precomputed embeddings (7MB)
   - Generate with: `python src/embeddings/generate-embeddings.py`

2. **`docs/search/microsims-data.json`** - MicroSim metadata
   - Generate with: `python src/crawl-microsims.py`

## Integration with microsim-generator Skill

The microsim-generator skill can call this service to find reference templates:

```python
import subprocess
import json

def get_template_suggestions(specification: str, n: int = 5) -> list:
    """Get similar MicroSim templates for a specification."""
    result = subprocess.run(
        ['python', 'src/find-similar-templates/find-similar-templates.py',
         '--spec', specification, '--top', str(n), '--json', '--quiet'],
        capture_output=True,
        text=True,
        cwd=PROJECT_ROOT
    )

    if result.returncode == 0:
        return json.loads(result.stdout)
    else:
        return []
```

The returned GitHub URLs can then be used to:
1. Fetch and analyze the template's `main.html` and JavaScript files
2. Understand the structure and patterns used
3. Adapt the template for the new specification

## Troubleshooting

### Model Loading Slow

First run downloads the model (~90MB). Subsequent runs use cached model.

### No Results / Low Scores

- Ensure the specification has a clear Learning Objective
- Add more Visual elements and Interactive controls
- Check that embeddings are up to date with latest crawl

### FileNotFoundError

Run the prerequisite scripts:
```bash
python src/crawl-microsims.py
python src/embeddings/generate-embeddings.py
```

---

## TODO: Pedagogical Pattern Alignment (Major Enhancement)

**Priority:** High
**Complexity:** Large project

### Problem Statement

The current template matching system matches on **visual/structural similarity** (keywords, visualization types, frameworks) but does NOT match on **pedagogical alignment** (how well the interaction pattern supports the learning objective).

This leads to poor template recommendations. For example:
- A specification with Bloom Level "Understand (L2)" and verb "explain" might match an animated flow diagram template
- But continuous animation is pedagogically inappropriate for "explain" objectives
- A step-through worked example template would be better, even if visually different

### Proposed Enhancement

Add pedagogical metadata to MicroSim embeddings and incorporate pedagogical alignment scoring:

#### 1. Extend Metadata Schema

Add to each MicroSim's metadata:
```json
{
  "pedagogical": {
    "pattern": "worked-example | exploration | practice | assessment | reference",
    "bloom_alignment": ["remember", "understand", "apply", "analyze", "evaluate", "create"],
    "supports_prediction": true | false,
    "data_visibility": "high | medium | low",
    "pacing": "self-paced | continuous | timed"
  }
}
```

#### 2. Crawl/Enrich Existing MicroSims

- Analyze existing MicroSims to classify their pedagogical patterns
- Add pedagogical metadata to metadata.json files
- Regenerate embeddings with pedagogical features

#### 3. Modify Embedding Generation

Incorporate pedagogical features into the embedding text:
```python
def create_embedding_text(microsim):
    parts = [
        f"Title: {microsim['title']}",
        f"Pedagogical Pattern: {microsim['pedagogical']['pattern']}",
        f"Bloom Alignment: {', '.join(microsim['pedagogical']['bloom_alignment'])}",
        f"Supports Prediction: {microsim['pedagogical']['supports_prediction']}",
        # ... existing fields
    ]
```

#### 4. Add Pedagogical Alignment Score

Modify `find_similar_templates()` to compute a weighted score:
```python
def compute_match_score(spec, template):
    semantic_score = cosine_similarity(spec_embedding, template_embedding)
    pedagogical_score = compute_pedagogical_alignment(spec, template)

    # Weight pedagogical alignment heavily
    final_score = 0.6 * semantic_score + 0.4 * pedagogical_score
    return final_score
```

#### 5. Filter/Boost Based on Bloom Level

```python
def find_similar_templates(spec_text, top_n=5):
    spec = parse_specification(spec_text)
    bloom_level = spec.get('bloom_level', '').lower()

    # Filter out pedagogically inappropriate templates
    if 'understand' in bloom_level:
        # Boost step-through/worked-example templates
        # Penalize continuous animation templates
        pass
```

### Expected Benefits

- Templates matched on pedagogical appropriateness, not just visual similarity
- Fewer instructional design failures like the v1 Keywords-to-Search-Results-Flow
- Better learning outcomes from generated MicroSims

### Implementation Notes

This is a significant project requiring:
1. Metadata schema extension
2. Crawling/classification of 500+ existing MicroSims
3. Embedding regeneration
4. Scoring algorithm changes
5. Testing with diverse specifications

Consider phased rollout:
- Phase 1: Add manual pedagogical tags to 50 high-quality templates
- Phase 2: Build classifier to auto-tag remaining MicroSims
- Phase 3: Integrate into find-similar-templates scoring
