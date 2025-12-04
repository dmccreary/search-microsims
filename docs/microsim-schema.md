# MicroSim Metadata Schema

This document describes the official JSON schema for MicroSim metadata, used for cataloging and searching educational simulations.

**Schema Source**: [microsim-schema.json](https://github.com/dmccreary/microsims/blob/main/src/microsim-schema/microsim-schema.json)

## Overview

The MicroSim metadata schema is a comprehensive JSON Schema (Draft 07) that organizes metadata into eight primary sections:

| Section | Purpose |
|---------|---------|
| `dublinCore` | Resource identification (title, creator, rights) |
| `search` | Findability (tags, visualization type, complexity) |
| `educational` | Learning attributes (grade level, subject, Bloom's taxonomy) |
| `technical` | Framework, dimensions, dependencies |
| `userInterface` | Layout, controls, accessibility |
| `simulation` | Physics/math model, variables, equations |
| `analytics` | Event tracking, learning indicators |
| `usage` | Pedagogical guidance, assessment questions |

## Dublin Core Metadata

Standard resource description elements based on the Dublin Core standard.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Name of the MicroSim |
| `creator` | array | Authors, developers, or AI models that created it |
| `subject` | array | Topic keywords and subject areas |
| `description` | string | Content description and educational purpose |
| `date` | string | Creation date (ISO 8601 format) |
| `type` | enum | Resource type |
| `format` | enum | File format |
| `rights` | string | License or copyright |

### Type Values

```
Interactive Simulation | Educational MicroSim | Infographic
```

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `publisher` | string | Entity making resource available |
| `contributor` | array | Reviewers, editors, etc. |
| `identifier` | string | DOI, URI, or unique reference |
| `source` | string | Resource this is derived from |
| `language` | string | ISO 639-1 code (e.g., "en", "en-US") |
| `relation` | array | Related resources |
| `coverage` | object | Spatial/temporal coverage |

## Search & Discovery

Metadata for improved findability and filtering.

### Visualization Type

```
animation | chart | infographic | graph | diagram | simulation
interactive-demo | data-visualization | 3d-model | timeline
network | map | dashboard
```

### Interaction Level

```
passive | low | moderate | high | very-high
```

### Application Domains

```
education | research | training | demonstration
assessment | exploration | modeling | analysis
```

### Other Search Fields

| Field | Type | Description |
|-------|------|-------------|
| `tags` | array | Searchable keywords (required) |
| `searchKeywords` | array | SEO-friendly keywords |
| `complexity` | integer | 1-10 scale (1=simple, 10=complex) |
| `relatedConcepts` | array | For recommendation systems |

## Educational Specifications

Learning-focused attributes for curriculum alignment.

### Grade Level

```
K | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
Undergraduate | Graduate | Adult
```

### Subject Area

```
Mathematics | Science | Physics | Chemistry | Biology
Computer Science | Engineering | Economics | Finance | Statistics
Psychology | Social Studies | Language Arts | Art | Music
Health | Physical Education | Other
```

### Bloom's Taxonomy

```
Remember | Understand | Apply | Analyze | Evaluate | Create
```

### Difficulty

```
Beginner | Intermediate | Advanced
```

### Learning Theory

```
constructivism | behaviorism | cognitivism
connectivism | experiential | social-learning
```

### Other Educational Fields

| Field | Type | Description |
|-------|------|-------------|
| `topic` | array | Specific concepts covered |
| `learningObjectives` | array | Learning outcomes |
| `prerequisites` | array | Required prior knowledge |
| `duration` | object | Typical/range interaction time |
| `curriculumStandards` | array | CCSS, NGSS, ISTE alignment |
| `cognitiveLoad` | object | Intrinsic/extraneous/germane load |
| `scaffolding` | object | Guided discovery, hints, feedback |
| `misconceptions` | array | Common misconceptions addressed |
| `transferSkills` | array | Transferable skills developed |

## Technical Requirements

### Framework

```
p5.js | vanilla-js | d3.js | three.js | other
```

### Canvas Dimensions

```json
{
  "width": 800,
  "height": 600,
  "responsive": true
}
```

### Other Technical Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | MicroSim version number |
| `dependencies` | array | Required libraries |
| `browserCompatibility` | array | Supported browsers |
| `performanceMetrics` | object | Load time, memory, FPS |
| `deviceRequirements` | object | Touch, keyboard, screen size |
| `accessibility` | object | WCAG level, screen reader support |

## Example Metadata

```json
{
  "microsim": {
    "dublinCore": {
      "title": "Pendulum Simulation",
      "creator": ["Dan McCreary", "Claude"],
      "subject": ["Physics", "Simple Harmonic Motion"],
      "description": "Interactive pendulum demonstrating period and gravity relationships",
      "date": "2025-01-15",
      "type": "Interactive Simulation",
      "format": "text/html",
      "rights": "CC BY 4.0"
    },
    "search": {
      "tags": ["pendulum", "physics", "oscillation", "gravity"],
      "visualizationType": ["animation", "simulation"],
      "interactionLevel": "high",
      "complexity": 4
    },
    "educational": {
      "gradeLevel": ["9", "10", "11", "12"],
      "subjectArea": ["Physics", "Science"],
      "topic": ["Simple Harmonic Motion", "Period", "Gravity"],
      "learningObjectives": [
        "Understand the relationship between pendulum length and period",
        "Observe how gravity affects oscillation"
      ],
      "bloomsTaxonomy": ["Understand", "Apply", "Analyze"],
      "difficulty": "Intermediate"
    },
    "technical": {
      "framework": "p5.js",
      "version": "1.0.0",
      "canvasDimensions": {
        "width": 600,
        "height": 450,
        "responsive": true
      }
    }
  }
}
```

## Faceted Search Fields

The following fields are used for faceted filtering in the search interface:

| Facet | Schema Path | Values |
|-------|-------------|--------|
| Subject Area | `educational.subjectArea` | 18 standard subjects |
| Grade Level | `educational.gradeLevel` | K-12, Undergraduate, Graduate, Adult |
| Bloom's Taxonomy | `educational.bloomsTaxonomy` | 6 cognitive levels |
| Difficulty | `educational.difficulty` | Beginner, Intermediate, Advanced |
| Framework | `technical.framework` | p5.js, d3.js, three.js, etc. |
| Visualization Type | `search.visualizationType` | 13 visualization types |
| Interaction Level | `search.interactionLevel` | 5 levels |

## Schema Validation

To validate metadata against the schema:

```bash
# Using ajv-cli
npm install -g ajv-cli
ajv validate -s microsim-schema.json -d metadata.json
```

## Legacy Field Mapping

Older metadata files may use different field names. The search normalizes these:

| Legacy Field | Schema Field |
|--------------|--------------|
| `subject` (string) | `dublinCore.subject` (array) |
| `educationalLevel` | `educational.gradeLevel` |
| `bloomLevel` | `educational.bloomsTaxonomy` |
| `library` | `technical.framework` |
| `author` | `dublinCore.creator` |
