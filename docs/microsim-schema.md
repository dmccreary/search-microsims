# MicroSim Metadata Schema

This document describes the official JSON schema for MicroSim metadata, used for cataloging and searching educational simulations.

**Schema Source**: [microsim-schema.json](https://github.com/dmccreary/microsims/blob/main/src/microsim-schema/microsim-schema.json)

## Overview

The MicroSim metadata schema is a comprehensive JSON Schema (Draft 07) that organizes metadata into nine primary sections:

| Section | Purpose |
|---------|---------|
| `dublinCore` | Resource identification (title, creator, rights) |
| `search` | Findability (tags, visualization type, complexity) |
| `educational` | Learning attributes (grade level, subject, difficulty) |
| `technical` | Framework, dimensions, dependencies |
| `userInterface` | Layout, controls, accessibility |
| `simulation` | Physics/math model, variables, equations |
| `analytics` | Event tracking, learning indicators |
| `usage` | Pedagogical guidance, assessment questions |
| `pedagogical` | Bloom's taxonomy, instructional patterns, template matching |

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

## Pedagogical Patterns

Metadata for template matching and instructional alignment. This section enables the `find-similar-templates` service to recommend MicroSims based on pedagogical appropriateness, not just visual similarity.

**Note:** Bloom's taxonomy fields have been moved to the pedagogical section (from educational) because they directly impact template matching scores.

### Pattern (Required)

The primary pedagogical pattern the MicroSim follows:

```
worked-example    - Step-through demonstrations with explanations
exploration       - Open-ended discovery with minimal guidance
practice          - Repeated skill application with feedback
assessment        - Testing/evaluation of understanding
reference         - Static information display or lookup
demonstration     - Instructor-led showing of concepts
guided-discovery  - Scaffolded exploration with hints
```

### Bloom's Taxonomy vs Bloom Alignment

The pedagogical section contains **two** Bloom-related fields that serve different purposes:

| Field | Case | Purpose | Scope |
|-------|------|---------|-------|
| `bloomsTaxonomy` | Title Case | Content scope - all levels the content CAN address | Broader |
| `bloomAlignment` | lowercase | Pattern effectiveness - levels the interaction SUPPORTS | Narrower |

**Why Two Fields?**

A MicroSim's *content* may touch multiple cognitive levels, but its *interaction pattern* may only effectively support a subset. For example:

- A **pendulum simulation** content touches Remember (definitions), Understand (concepts), Apply (calculations), Analyze (relationships), and Create (design experiments)
- But its **exploration pattern** most effectively supports Understand, Apply, and Analyze
- The worked-example videos within it support Remember and Understand

**Typical Relationship:**

| Relationship | Occurrence | Example |
|--------------|------------|---------|
| bloomAlignment ⊂ bloomsTaxonomy | ~53% | Content: [Remember, Understand, Apply, Create] → Pattern: [Understand, Apply] |
| Exact match | ~7% | Both fields identical |
| Partial overlap | ~27% | Some levels shared |
| bloomAlignment ⊃ bloomsTaxonomy | ~14% | Pattern supports more levels than content explicitly addresses |

### Bloom's Taxonomy (Required)

All cognitive levels the **content** can address (Title Case):

```
Remember | Understand | Apply | Analyze | Evaluate | Create
```

### Bloom Alignment (Required)

Cognitive levels the **interaction pattern** effectively supports (lowercase for matching):

```
remember | understand | apply | analyze | evaluate | create
```

### Bloom Verbs (Optional)

Specific action verbs the MicroSim supports, enabling more precise template matching:

| Level | Verbs |
|-------|-------|
| Remember | define, identify, list, recall, recognize, state |
| Understand | classify, compare, describe, explain, interpret, summarize |
| Apply | apply, calculate, demonstrate, illustrate, implement, solve, use |
| Analyze | analyze, differentiate, examine, experiment, investigate, test |
| Evaluate | assess, critique, evaluate, judge, justify, predict |
| Create | construct, create, design, develop, formulate, generate |

**Why Bloom Verbs Matter:**

Two MicroSims at the same Bloom level may require different interaction patterns:

| Verb | Best Pattern | Reason |
|------|--------------|--------|
| demonstrate | worked-example, step-through | Show process sequentially |
| calculate | practice | Repeated skill application with feedback |
| solve | exploration, guided-discovery | Open-ended problem solving |
| explain | worked-example | Step-through with explanations |
| experiment | exploration | Parameter manipulation |
| predict | guided-discovery | Hypothesis testing |

**Pedagogical Alignment Guidelines:**

| Bloom Level | Appropriate Patterns | Inappropriate Patterns |
|-------------|---------------------|------------------------|
| remember | reference, demonstration | exploration, create |
| understand | worked-example, demonstration | practice, assessment |
| apply | practice, guided-discovery | reference |
| analyze | exploration, guided-discovery | worked-example |
| evaluate | assessment, exploration | demonstration |
| create | exploration | worked-example, reference |

### Pacing (Required)

How the learner controls progression:

```
self-paced   - Learner controls all timing
continuous   - Animation runs automatically
timed        - Fixed time constraints
step-through - Discrete steps with explicit advancement
```

### Optional Pedagogical Fields

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `bloomVerbs` | array | see table above | Specific verbs for precise matching |
| `supportsPrediction` | boolean | true/false | Allows predictions before seeing results |
| `dataVisibility` | enum | high, medium, low | How much data/calculations shown |
| `feedbackType` | array | immediate, delayed, corrective, explanatory, none | Types of feedback |
| `interactionStyle` | enum | observe, manipulate, construct, respond, explore | Primary interaction mode |

### Interaction Style

```
observe     - Watch without direct manipulation
manipulate  - Adjust parameters and see effects
construct   - Build or create something
respond     - Answer questions or prompts
explore     - Free-form investigation
```

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
    },
    "pedagogical": {
      "pattern": "exploration",
      "bloomsTaxonomy": ["Remember", "Understand", "Apply", "Analyze", "Create"],
      "bloomAlignment": ["understand", "apply", "analyze"],
      "bloomVerbs": ["experiment", "analyze", "predict"],
      "pacing": "self-paced",
      "supportsPrediction": true,
      "dataVisibility": "high",
      "feedbackType": ["immediate"],
      "interactionStyle": "manipulate"
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
| Difficulty | `educational.difficulty` | Beginner, Intermediate, Advanced |
| Framework | `technical.framework` | p5.js, d3.js, three.js, etc. |
| Visualization Type | `search.visualizationType` | 13 visualization types |
| Interaction Level | `search.interactionLevel` | 5 levels |
| Bloom's Taxonomy | `pedagogical.bloomsTaxonomy` | 6 cognitive levels (content scope) |
| Bloom Alignment | `pedagogical.bloomAlignment` | 6 cognitive levels (pattern effectiveness) |
| Pedagogical Pattern | `pedagogical.pattern` | 7 instructional patterns |
| Pacing | `pedagogical.pacing` | 4 pacing modes |

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
| `bloomLevel` | `pedagogical.bloomsTaxonomy` |
| `educational.bloomsTaxonomy` | `pedagogical.bloomsTaxonomy` (moved Jan 2025) |
| `library` | `technical.framework` |
| `author` | `dublinCore.creator` |
