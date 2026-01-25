# Find Similar MicroSim Templates

A service that takes a MicroSim specification (SPECIFICATION block format) and returns the most relevant existing MicroSims to use as templates. Designed to be used by the `microsim-generator` skill when creating new MicroSims.

## Purpose

When the microsim-generator skill receives a specification for a new MicroSim, it can use this service to find existing MicroSims that are semantically similar. These similar MicroSims serve as templates and reference implementations, helping the generator:

1. Follow established patterns for the chosen visualization type
2. Use appropriate frameworks and libraries
3. Implement similar interactive controls
4. Match the expected quality and structure

## How It Works

1. **Parse Specification**: Extracts structured fields from the SPECIFICATION block format
2. **Create Query Embedding**: Converts the specification into a semantic embedding using the same model as the main embeddings (`all-MiniLM-L6-v2`)
3. **Compute Semantic Similarity**: Compares against the precomputed embeddings of all existing MicroSims using cosine similarity
4. **Compute Pedagogical Alignment**: Scores how well each template's pedagogical pattern matches the specification's Bloom level and verb
5. **Combine Scores**: Final score = 60% semantic + 40% pedagogical
6. **Return Results**: Returns the top N most similar MicroSims with their GitHub URLs for use as templates

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
