# Metadata Enrichment Tools

This directory contains tools for enriching MicroSim metadata files with additional fields and pushing the changes to GitHub.

## Overview

The enrichment workflow has two steps:

1. **Enrich** - Analyze MicroSim content and add missing metadata fields
2. **Commit** - Push the enriched metadata to GitHub

## Scripts

### enrich-metadata.py

Scans existing `metadata.json` files and adds missing fields based on content analysis:

- **learningObjectives** - Generated from subject area and topic
- **visualizationType** - Detected from code patterns (animation, simulation, chart, etc.)
- **bloomsTaxonomy** - Inferred from content keywords

```bash
# Enrich all repos
python src/enrich-metadata/enrich-metadata.py

# Enrich a specific repo
python src/enrich-metadata/enrich-metadata.py geometry-course

# Preview changes without modifying files
python src/enrich-metadata/enrich-metadata.py --dry-run

# Report what's missing (no changes)
python src/enrich-metadata/enrich-metadata.py --report
```

### commit-enrichments.py

Finds repositories with uncommitted metadata changes and pushes them to GitHub:

```bash
# Commit and push all changed metadata files
python src/enrich-metadata/commit-enrichments.py

# Preview what would be committed
python src/enrich-metadata/commit-enrichments.py --dry-run

# Commit a specific repo only
python src/enrich-metadata/commit-enrichments.py geometry-course
```

## Typical Workflow

```bash
# Step 1: See what's missing
python src/enrich-metadata/enrich-metadata.py --report

# Step 2: Preview enrichment changes
python src/enrich-metadata/enrich-metadata.py --dry-run

# Step 3: Apply enrichments
python src/enrich-metadata/enrich-metadata.py

# Step 4: Review changes (optional)
cd ~/Documents/ws/geometry-course && git diff

# Step 5: Preview commits
python src/enrich-metadata/commit-enrichments.py --dry-run

# Step 6: Commit and push to GitHub
python src/enrich-metadata/commit-enrichments.py
```

## What Gets Enriched

### Learning Objectives

Generated based on subject area with templates like:
- Mathematics: "Understand the mathematical concept of {topic}"
- Physics: "Observe and understand {topic} in action"
- Computer Science: "Understand how {topic} algorithms work"

Additional objectives added based on content patterns:
- If sliders present: "Experiment with parameters to observe their effects"
- If quiz elements: "Test understanding through interactive exercises"

### Visualization Types

Detected from code patterns in HTML/JS files:

| Type | Detection Patterns |
|------|-------------------|
| animation | animate, motion, frameRate, velocity |
| simulation | physics, particle, force, collision |
| chart | chart.js, histogram, bar chart |
| graph | plot, scatter, axis, coordinate |
| diagram | flowchart, venn, hierarchy |
| network | vis-network, node, edge, vertex |
| timeline | vis-timeline, chronological |
| map | leaflet, latitude, longitude |
| 3d-model | three.js, WebGL, perspective |
| interactive-demo | slider, playground (default) |

### Bloom's Taxonomy

Inferred from content keywords:
- Remember: identify, list, recall
- Understand: explain, describe, interpret
- Apply: demonstrate, calculate, solve
- Analyze: differentiate, examine, compare
- Evaluate: assess, judge, critique
- Create: design, construct, develop

## Logs

Both scripts write JSONL logs to the `logs/` directory:
- `logs/enrich-metadata-YYYY-MM-DD.jsonl`
- `logs/commit-enrichments-YYYY-MM-DD.jsonl`

## Configuration

Default workspace: `~/Documents/ws`

Override with `--workspace` flag:
```bash
python src/enrich-metadata/enrich-metadata.py --workspace /path/to/repos
```

## Safety Features

- **Dry run mode** - Preview all changes before applying
- **Report mode** - Analyze without any modifications
- **Selective processing** - Process specific repos by name
- **Detailed logging** - JSONL logs for audit trail
- **Only metadata.json** - Commit script only stages metadata files
