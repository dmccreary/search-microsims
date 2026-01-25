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
3. **Compute Similarity**: Compares against the precomputed embeddings of all existing MicroSims using cosine similarity
4. **Return Results**: Returns the top N most similar MicroSims with their GitHub URLs for use as templates

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

The following fields have the highest impact on similarity matching:

| Field | Weight | Description |
|-------|--------|-------------|
| `Learning Objective` | High | Most important for semantic matching |
| `Visual elements` | High | What the MicroSim displays |
| `Interactive controls` | High | User interaction capabilities |
| `Type` | Medium | Type of visualization (microsim, diagram, etc.) |
| `Implementation` | Medium | Framework hints (p5.js, d3.js, etc.) |
| `Bloom Level` | Medium | Cognitive complexity |
| `Canvas layout` | Medium | Structure and layout |
| `Behavior` | Medium | Interaction patterns |

## Output Format

### Human-Readable (default)

```
======================================================================
Similar MicroSim Templates
======================================================================

1. Pendulum Motion Explorer
   Score: 0.8723 (Highly Similar)
   Framework: p5.js
   Subject: Physics
   Visualization: animation, simulation
   GitHub: https://github.com/dmccreary/physics-sims/tree/main/docs/sims/pendulum
   Live: https://dmccreary.github.io/physics-sims/sims/pendulum/

2. Simple Harmonic Motion
   Score: 0.7856 (Similar)
   ...
```

### JSON Output (`--json` flag)

```json
[
  {
    "github_url": "https://github.com/dmccreary/physics-sims/tree/main/docs/sims/pendulum",
    "live_url": "https://dmccreary.github.io/physics-sims/sims/pendulum/",
    "title": "Pendulum Motion Explorer",
    "score": 0.8723,
    "framework": "p5.js",
    "subject": "Physics",
    "visualization_type": ["animation", "simulation"],
    "description": "An interactive simulation..."
  }
]
```

## Score Interpretation

| Score Range | Category | Meaning |
|-------------|----------|---------|
| 0.85 - 1.00 | Highly Similar | Nearly identical concept or approach |
| 0.70 - 0.85 | Similar | Same topic or visualization type |
| 0.50 - 0.70 | Related | Same subject area or interaction pattern |
| 0.00 - 0.50 | Somewhat Related | Loosely connected |

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
