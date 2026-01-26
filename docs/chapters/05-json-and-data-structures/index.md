---
title: JSON and Data Structures
description: Master JSON syntax, objects, arrays, schemas, and validation to create high-quality MicroSim metadata that powers search and discovery
generated_by: claude skill chapter-content-generator
date: 2026-01-24 15:45:00
version: 0.03
reading_level: college
---

# JSON and Data Structures

## Summary

This chapter covers JSON (JavaScript Object Notation) syntax, structure, and validation concepts essential for MicroSim metadata. You'll learn about JSON objects and arrays, JSON Schema for defining data structure requirements, schema validation techniques, and the distinction between required and optional fields. The chapter also addresses data quality metrics including completeness and quality scores. After completing this chapter, students will be able to create valid JSON metadata files and validate them against schemas.

## Concepts Covered

This chapter covers the following 11 concepts from the learning graph:

1. JSON
2. JSON Syntax
3. JSON Objects
4. JSON Arrays
5. JSON Schema
6. Schema Validation
7. Required Fields
8. Optional Fields
9. Data Quality
10. Completeness Score
11. Quality Score

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: MicroSim File Organization](../02-microsim-file-organization/index.md)
- [Chapter 3: Metadata Fundamentals](../03-metadata-fundamentals/index.md)

---

## The Language That Runs the Web

Welcome to the chapter where everything clicks together. You've learned about metadata concepts and Dublin Core elements—now it's time to meet JSON, the format that transforms those ideas into something computers (and AI agents!) can actually use. Think of JSON as the Rosetta Stone of the digital world: it's how your MicroSim metadata speaks to search engines, AI generators, and educational platforms across the globe.

Here's the exciting part: JSON is remarkably simple. Unlike many technical formats that seem designed to confuse, JSON was built for humans AND machines to read. In about 20 minutes, you'll go from "What's a curly brace?" to "I can write metadata that makes my MicroSims discoverable worldwide." That's a superpower worth having.

Why does this matter for education? When you write clean, valid JSON metadata, you're not just organizing files—you're enabling:

- **Search engines** to find your MicroSims instantly
- **AI generators** to learn from your examples
- **Teachers** to discover exactly what they need
- **Students** to access simulations matched to their level
- **Researchers** to analyze educational resource patterns

Let's unlock this capability together.

---

## JSON: The Universal Data Format

**JSON** (JavaScript Object Notation) is a lightweight text format for storing and exchanging structured data. Despite "JavaScript" in its name, JSON is language-independent—Python, Java, Ruby, and virtually every programming language can read and write it. It has become the lingua franca of web APIs, configuration files, and yes, metadata.

JSON's design philosophy is elegant simplicity:

| Principle | Meaning |
|-----------|---------|
| Human-readable | You can open a JSON file in any text editor and understand it |
| Lightweight | Minimal syntax overhead—no verbose tags |
| Hierarchical | Naturally represents nested structures |
| Language-neutral | Works with any programming language |
| Self-describing | Data includes its structure |

A brief history: Douglas Crockford popularized JSON in the early 2000s as a simpler alternative to XML. While XML required verbose opening and closing tags (`<title>My Sim</title>`), JSON achieved the same with `"title": "My Sim"`. Web developers embraced it enthusiastically, and by 2013 it surpassed XML as the dominant data exchange format.

!!! tip "JSON vs. Other Formats"
    You might encounter XML, YAML, or TOML in other contexts. JSON strikes the best balance for metadata: more structured than plain text, less verbose than XML, more widely supported than YAML. For MicroSim metadata, JSON is the clear winner.

---

## JSON Syntax: The Building Blocks

JSON syntax consists of just a few simple rules. Master these, and you can write any JSON document.

### The Six Data Types

JSON supports exactly six data types:

| Type | Description | Example |
|------|-------------|---------|
| **String** | Text in double quotes | `"Hello World"` |
| **Number** | Integer or decimal | `42` or `3.14159` |
| **Boolean** | True or false | `true` or `false` |
| **Null** | Empty/no value | `null` |
| **Object** | Collection of key-value pairs | `{"name": "value"}` |
| **Array** | Ordered list of values | `[1, 2, 3]` |

That's it. Six types. Everything in JSON is built from these primitives.

### Syntax Rules

JSON follows strict syntax rules (which is actually good—it means errors are easy to catch):

**1. Strings must use double quotes:**
```json
"title": "Pendulum Simulator"    ✅ Correct
'title': 'Pendulum Simulator'    ❌ Single quotes not allowed
```

**2. Keys must be strings:**
```json
{"name": "valid"}     ✅ Correct
{name: "invalid"}     ❌ Unquoted keys not allowed
```

**3. No trailing commas:**
```json
{"a": 1, "b": 2}      ✅ Correct
{"a": 1, "b": 2,}     ❌ Trailing comma not allowed
```

**4. Numbers cannot have leading zeros:**
```json
{"count": 42}         ✅ Correct
{"count": 042}        ❌ Leading zero not allowed
```

**5. No comments allowed:**
```json
{"title": "Sim"}      ✅ Correct
{"title": "Sim"} // comment  ❌ Comments not allowed in JSON
```

#### Diagram: JSON Syntax Validator

<iframe src="../../sims/json-syntax-validator/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>JSON Syntax Validator Interactive Tool</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: use

Learning Objective: Students will use JSON syntax rules to identify and fix common syntax errors in real-time, building muscle memory for correct JSON formatting.

Canvas layout:
- Left panel (55%): JSON text editor with syntax highlighting
- Right panel (45%): Validation results and error explanations

Visual elements:
- Code editor with line numbers
- Syntax highlighting: strings (green), numbers (blue), booleans (orange), null (gray), keys (purple)
- Red underlines for syntax errors
- Green checkmark or red X status indicator
- Error message panel with line numbers and fix suggestions

Interactive controls:
- Text area for entering/editing JSON
- "Validate" button
- "Format/Prettify" button
- "Load Example" dropdown (valid example, missing quote, trailing comma, single quotes, invalid number)
- "Clear" button
- Toggle: "Live validation" (validates as you type)

Example errors to demonstrate:
- Missing closing brace
- Trailing comma
- Single quotes instead of double
- Unquoted keys
- Leading zeros on numbers
- Missing comma between elements

Validation feedback:
- Success: "✅ Valid JSON! Your document contains X objects and Y arrays"
- Error: "❌ Line 5, Column 12: Expected double quote, found single quote"
- Suggestion: "Fix: Replace ' with \" around string values"

Default state: Empty editor with placeholder text showing basic JSON structure

Behavior:
- Live validation mode highlights errors as user types
- Click on error message to jump to that line
- Format button properly indents the JSON
- Successful validation shows celebratory animation

Implementation: p5.js with custom text editor component
</details>

---

## JSON Objects: The Heart of Metadata

A **JSON object** is an unordered collection of key-value pairs, wrapped in curly braces `{}`. Objects are the workhorses of JSON—they represent entities with properties. In metadata terms, a JSON object represents your MicroSim with all its attributes.

### Basic Object Structure

```json
{
  "title": "Wave Interference Simulator",
  "creator": "Dr. Physics",
  "version": 2.5,
  "isInteractive": true
}
```

Let's break this down:

- `{` and `}` mark the object boundaries
- `"title"` is a **key** (always a string)
- `:` separates key from value
- `"Wave Interference Simulator"` is a **value** (string type)
- `,` separates key-value pairs

### Nested Objects

Objects can contain other objects, creating hierarchical structures perfect for organized metadata:

```json
{
  "dublinCore": {
    "title": "Pendulum Period Calculator",
    "creator": "Maria Santos"
  },
  "technical": {
    "framework": "p5.js",
    "canvasSize": {
      "width": 800,
      "height": 600
    }
  }
}
```

This nesting mirrors real-world organization: a MicroSim has Dublin Core metadata, which has a title and creator. It also has technical metadata, which includes canvas size with width and height. The structure is both logical and self-documenting.

!!! note "Nesting Best Practices"
    While JSON allows unlimited nesting depth, keep your structures reasonably flat (3-4 levels max). Deeply nested JSON becomes hard to read and maintain. Our MicroSim schema uses logical groupings (dublinCore, technical, educational) without excessive depth.

### The MicroSim Metadata Object

Here's a realistic metadata object showing how concepts from previous chapters come together:

```json
{
  "dublinCore": {
    "title": "Ohm's Law Circuit Explorer",
    "creator": "Prof. Elena Rodriguez",
    "subject": ["Physics", "Electricity", "Circuits"],
    "description": "Interactive simulation for exploring voltage, current, and resistance relationships",
    "date": "2026-01-15",
    "rights": "CC BY-SA 4.0"
  },
  "educational": {
    "gradeLevel": "Undergraduate",
    "bloomsTaxonomy": "Apply",
    "difficulty": "Intermediate",
    "subjectArea": "Physics"
  },
  "technical": {
    "framework": "p5.js",
    "responsive": true
  }
}
```

Notice how the object groups related information. A search engine can quickly find all physics simulations for undergraduates. An AI generator can learn from examples at the same difficulty level. A teacher can filter by grade level. The structure enables all of this.

#### Diagram: JSON Object Structure Visualizer

<iframe src="../../sims/json-object-visualizer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>JSON Object Structure Visualizer</summary>
Type: graph-model

Bloom Level: Understand (L2)
Bloom Verb: interpret

Learning Objective: Students will interpret the hierarchical structure of JSON objects by visualizing nested key-value relationships as an interactive tree.

Purpose: Transform abstract JSON text into a visual tree structure showing parent-child relationships

Node types:
1. Root node (large blue circle)
   - Represents the top-level object
   - Label: "root" or object name if provided

2. Object nodes (medium green rectangles)
   - Represent nested objects
   - Label: key name
   - Show number of children

3. Array nodes (medium orange rectangles with rounded corners)
   - Represent arrays
   - Label: key name + [length]
   - Show element count

4. Primitive nodes (small circles)
   - String: green
   - Number: blue
   - Boolean: orange
   - Null: gray
   - Label: key name, hover shows value

Edge types:
- Solid lines from parent to children
- Labeled with key names where helpful

Interactive features:
- Paste JSON in text area to visualize
- Click nodes to expand/collapse
- Hover to see full values (especially long strings)
- Drag nodes to rearrange layout
- Zoom with mouse wheel
- "Show Values" toggle displays values inline
- "Collapse All" / "Expand All" buttons

Sample data: Pre-loaded with MicroSim metadata example

Layout: Hierarchical tree, left-to-right
Color scheme: Consistent with JSON data types
Animation: Smooth expand/collapse transitions

Implementation: vis-network with custom node rendering
</details>

---

## JSON Arrays: Ordered Collections

A **JSON array** is an ordered list of values, wrapped in square brackets `[]`. Arrays are perfect for representing multiple items of the same type: subjects, keywords, contributors, or learning objectives.

### Basic Array Structure

```json
{
  "subjects": ["Physics", "Mechanics", "Forces"],
  "gradeLevel": ["High School", "Undergraduate"],
  "contributors": ["Alice", "Bob", "Carol"]
}
```

Arrays preserve order—the first element is at index 0, the second at index 1, and so on. This matters when order is significant (like step-by-step instructions).

### Array Element Types

Arrays can contain any JSON data type:

```json
{
  "strings": ["red", "green", "blue"],
  "numbers": [1, 2, 3, 4, 5],
  "booleans": [true, false, true],
  "mixed": ["text", 42, true, null],
  "objects": [
    {"name": "First", "value": 1},
    {"name": "Second", "value": 2}
  ],
  "nested": [[1, 2], [3, 4], [5, 6]]
}
```

While mixed-type arrays are valid JSON, they're generally poor practice for metadata. Keep array elements consistent—an array of subjects should all be strings, an array of parameters should all be objects with the same structure.

### Arrays in MicroSim Metadata

Arrays appear throughout our metadata schema:

```json
{
  "dublinCore": {
    "subject": [
      "Physics",
      "Kinematics",
      "Projectile Motion"
    ],
    "contributor": [
      "Dr. James Chen (lead developer)",
      "Maria Santos (UX design)",
      "Physics Education Group (testing)"
    ]
  },
  "educational": {
    "learningObjectives": [
      "Calculate projectile range given initial velocity and angle",
      "Predict maximum height of projectile trajectory",
      "Explain the independence of horizontal and vertical motion"
    ]
  },
  "technical": {
    "browserSupport": ["Chrome", "Firefox", "Safari", "Edge"]
  }
}
```

Each array serves a purpose: subjects enable faceted search, contributors credit multiple people, learning objectives guide usage, and browser support informs compatibility.

### When to Use Arrays vs. Single Values

| Scenario | Use | Example |
|----------|-----|---------|
| Only one value ever | Single value | `"title": "My Sim"` |
| Usually one, sometimes more | Array | `"creator": ["Alice", "Bob"]` |
| Always multiple values | Array | `"subjects": ["Math", "Algebra"]` |
| Ordered sequence matters | Array | `"steps": ["Step 1", "Step 2"]` |

!!! tip "Future-Proofing with Arrays"
    When designing metadata, prefer arrays even if you expect single values. A MicroSim might have one creator today but two tomorrow. Starting with `"creator": ["Alice"]` makes adding Bob easier than changing `"creator": "Alice"` to an array later.

#### Diagram: Array Operations Playground

<iframe src="../../sims/json-array-playground/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Array Operations Playground</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: demonstrate

Learning Objective: Students will demonstrate understanding of JSON array operations by adding, removing, and reordering elements while observing the resulting JSON structure.

Canvas layout:
- Left panel (40%): Visual array representation
- Center panel (30%): Operation controls
- Right panel (30%): Live JSON output

Visual elements:
- Array displayed as connected boxes (like train cars)
- Each element shows type icon and value
- Index numbers displayed below each element
- Bracket indicators at array start/end
- Highlight animation when elements added/removed

Interactive controls:
- "Add Element" button with type selector (string/number/boolean)
- Text input for new element value
- "Add at Position" dropdown (beginning, end, or specific index)
- Click element to select, "Remove Selected" button
- Drag and drop to reorder elements
- "Add Nested Array" button
- "Clear Array" button

Array visualization:
- Strings: green boxes
- Numbers: blue boxes
- Booleans: orange boxes (shows true/false icon)
- Nested arrays: boxes containing smaller boxes

Live JSON output:
- Shows current array as formatted JSON
- Syntax highlighted
- Updates in real-time
- "Copy JSON" button

Sample scenarios:
- Build a subject array: ["Physics", "Mechanics", "Forces"]
- Build a mixed array (demonstrate why it's not ideal)
- Reorder learning objectives by dragging
- Nest arrays to show 2D data

Default state: Empty array `[]` ready for elements

Animation: Elements smoothly slide into position, removed elements fade out

Implementation: p5.js with drag-and-drop support
</details>

---

## JSON Schema: Defining Structure Requirements

So far, we've written JSON freely—any valid syntax works. But for MicroSim metadata, we need consistency. If one person uses `"subject"` and another uses `"topics"`, search breaks. This is where **JSON Schema** becomes essential.

**JSON Schema** is a vocabulary that defines the structure, content, and format constraints for JSON documents. Think of it as a blueprint that specifies what valid metadata must look like.

### What JSON Schema Defines

A schema specifies:

- **Required fields**: What must be present
- **Data types**: String, number, array, etc.
- **Value constraints**: Allowed values, patterns, ranges
- **Structure**: Nested object shapes
- **Documentation**: Descriptions of each field

### Basic Schema Example

Here's a simple schema for a MicroSim title and creator:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Name of the MicroSim",
      "minLength": 3,
      "maxLength": 100
    },
    "creator": {
      "type": "string",
      "description": "Person who created the MicroSim"
    }
  },
  "required": ["title", "creator"]
}
```

This schema says: "A valid document is an object with a `title` (string, 3-100 characters) and `creator` (string), both required."

### Schema Keywords

Common schema keywords you'll encounter:

| Keyword | Purpose | Example |
|---------|---------|---------|
| `type` | Data type required | `"type": "string"` |
| `properties` | Define object keys | `"properties": {"name": {...}}` |
| `required` | List mandatory fields | `"required": ["title"]` |
| `enum` | Allowed values | `"enum": ["Low", "Medium", "High"]` |
| `minimum/maximum` | Number range | `"minimum": 0, "maximum": 100` |
| `minLength/maxLength` | String length | `"minLength": 1` |
| `pattern` | Regex match | `"pattern": "^[A-Z]"` |
| `items` | Array element schema | `"items": {"type": "string"}` |
| `$ref` | Reference other schemas | `"$ref": "#/definitions/person"` |

### The MicroSim Schema Structure

Our official MicroSim schema organizes metadata into eight sections:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "dublinCore": {
      "type": "object",
      "description": "Standard Dublin Core metadata elements",
      "properties": {
        "title": {"type": "string"},
        "creator": {"type": "string"},
        "subject": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["title", "creator", "subject", "description"]
    },
    "search": {
      "type": "object",
      "description": "Fields optimized for search and discovery"
    },
    "educational": {
      "type": "object",
      "description": "Pedagogical information"
    },
    "technical": {
      "type": "object",
      "description": "Implementation details"
    },
    "userInterface": {
      "type": "object",
      "description": "UI controls and layout"
    },
    "simulation": {
      "type": "object",
      "description": "Simulation parameters and models"
    },
    "analytics": {
      "type": "object",
      "description": "Learning analytics configuration"
    },
    "usage": {
      "type": "object",
      "description": "Usage statistics and feedback"
    }
  },
  "required": ["dublinCore"]
}
```

This schema enforces organization: Dublin Core is required, other sections optional. Within Dublin Core, title, creator, subject, and description are required. This ensures every MicroSim has minimum discoverable metadata.

#### Diagram: Schema Structure Map

<iframe src="../../sims/microsim-schema-map/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>MicroSim Schema Structure Map</summary>
Type: graph-model

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning Objective: Students will examine the relationships between schema sections by exploring an interactive visualization of the complete MicroSim metadata schema structure.

Purpose: Visualize the full MicroSim schema showing all eight sections and their key fields

Node types:
1. Root node (large gold circle)
   - Label: "MicroSim Metadata"
   - Central position

2. Section nodes (large colored rectangles)
   - dublinCore: blue
   - search: green
   - educational: orange
   - technical: purple
   - userInterface: teal
   - simulation: pink
   - analytics: brown
   - usage: gray
   - Shows required badge if section is required

3. Field nodes (small circles)
   - Required fields: solid fill
   - Optional fields: outline only
   - Color matches parent section
   - Label: field name

Edge types:
- Section to root: thick lines
- Field to section: thin lines
- Field dependencies: dashed lines (e.g., subject references subjectArea)

Interactive features:
- Click section to expand/collapse fields
- Hover field to see type, description, constraints
- Filter: "Show required only" checkbox
- Filter: "Show section" dropdown
- Search box to find specific fields
- "Expand All" / "Collapse All" buttons
- Legend showing color coding and symbols

Sample field details on hover:
- "title" → Type: string, Required: yes, Min length: 3, Max length: 100
- "gradeLevel" → Type: string, Enum: ["K-12", "Undergraduate", "Graduate", "Adult"]
- "subject" → Type: array of strings, Min items: 1

Layout: Radial with root in center, sections around it
Animation: Smooth expand/collapse, fields radiate outward

Implementation: vis-network with custom layout
</details>

---

## Schema Validation: Checking Your Work

**Schema validation** is the process of checking whether a JSON document conforms to a schema. Valid documents match all schema requirements; invalid documents have errors that must be fixed.

### Why Validation Matters

Consider this scenario: You create metadata for 50 MicroSims. Without validation, you might:

- Spell "gradeLevel" as "grade_level" in some files
- Forget the required "description" field in others
- Use "Beginner" sometimes and "beginner" other times
- Put strings where numbers should be

Search breaks. AI generators get confused. Your carefully crafted MicroSims become unfindable. Validation prevents this chaos.

### Validation Outcomes

When you validate JSON against a schema, you get one of three results:

| Outcome | Meaning | Action |
|---------|---------|--------|
| ✅ Valid | Document matches schema completely | Ready to use |
| ⚠️ Warning | Valid but with quality suggestions | Consider improvements |
| ❌ Invalid | Document violates schema rules | Must fix errors |

### Common Validation Errors

Here are frequent mistakes and their error messages:

**Missing required field:**
```
Error: Required property 'description' is missing
Location: /dublinCore
Fix: Add "description": "Your description here"
```

**Wrong data type:**
```
Error: Expected string, got number
Location: /dublinCore/title
Value: 12345
Fix: Change to "12345" (with quotes)
```

**Invalid enum value:**
```
Error: Value must be one of: Beginner, Intermediate, Advanced
Location: /educational/difficulty
Value: "Easy"
Fix: Use "Beginner" instead of "Easy"
```

**Array constraint violation:**
```
Error: Array must have at least 1 item
Location: /dublinCore/subject
Value: []
Fix: Add at least one subject: ["Physics"]
```

### Validation Tools

You can validate JSON Schema using:

- **Online validators**: jsonschemavalidator.net, jsonschema.dev
- **Command-line tools**: ajv-cli, jsonschema (Python)
- **IDE plugins**: VS Code JSON Schema extension
- **Programming libraries**: Ajv (JavaScript), jsonschema (Python)

For MicroSim development, we provide a validation script:

```bash
# Validate a single metadata.json file
python3 src/microsim-schema/validate-metadata.py path/to/metadata.json

# Validate all collected metadata
python3 src/microsim-schema/validate-metadata.py --all
```

!!! success "Validation is Your Friend"
    Don't think of validation as a annoying gatekeeper—think of it as a helpful reviewer that catches mistakes before they cause problems. Run validation early and often. Fix errors immediately. Your future self will thank you.

#### Diagram: Validation Feedback Simulator

<iframe src="../../sims/validation-simulator/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Schema Validation Feedback Simulator</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: distinguish

Learning Objective: Students will distinguish between valid and invalid JSON metadata by analyzing validation feedback and correcting errors to produce schema-compliant documents.

Canvas layout:
- Left panel (50%): JSON editor with line numbers
- Right panel (50%): Validation results panel

Visual elements:
- Code editor with syntax highlighting
- Error markers in line gutter (red circles with X)
- Warning markers (yellow triangles)
- Valid indicator (green checkmark)
- Error list with clickable entries
- Progress bar showing "X of Y issues fixed"

Interactive controls:
- Dropdown: "Load Example" (valid, missing required, wrong type, invalid enum, array error)
- Button: "Validate"
- Button: "Auto-fix" (fixes simple errors like wrong quotes)
- Checkbox: "Show hints" (displays fix suggestions)
- Button: "Reset to Original"

Validation feedback display:
- List of errors with:
  - Severity icon (error/warning)
  - Error message
  - Location (path like /dublinCore/title)
  - Current value (if applicable)
  - Expected value/type
  - "Show Fix" button that highlights correction

Example scenarios:
1. Missing required "description" field
2. "gradeLevel" is number instead of string
3. "difficulty" is "Easy" instead of "Beginner"
4. Empty subject array
5. Misspelled key "tittle" instead of "title"

Success state:
- All green checkmarks
- Confetti animation
- Message: "🎉 Valid metadata! Ready for submission"

Default state: Loaded with example containing 3 errors

Behavior:
- Click error to jump to line in editor
- Live re-validation as user edits
- Errors disappear as fixed
- Progress bar updates

Implementation: p5.js with validation logic matching MicroSim schema
</details>

---

## Required vs. Optional Fields

Not all metadata fields carry equal weight. **Required fields** must be present for a document to be valid; **optional fields** enhance quality but aren't mandatory. Understanding this distinction helps you prioritize effort and enables flexible schema design.

### Required Fields in MicroSim Schema

These fields are mandatory—validation fails without them:

| Field | Section | Why Required |
|-------|---------|--------------|
| title | dublinCore | Can't search without a name |
| creator | dublinCore | Attribution is essential |
| subject | dublinCore | Enables topic-based discovery |
| description | dublinCore | Users need to know what it does |
| date | dublinCore | Currency assessment |
| format | dublinCore | Technical compatibility |
| rights | dublinCore | Legal clarity for reuse |

### Optional Fields That Add Value

Optional fields improve searchability and user experience:

| Field | Section | Enhancement |
|-------|---------|-------------|
| publisher | dublinCore | Institutional credibility |
| gradeLevel | educational | Audience matching |
| bloomsTaxonomy | educational | Pedagogical alignment |
| framework | technical | Technical filtering |
| visualizationType | search | Discovery refinement |
| learningObjectives | educational | Instructional design |

### Balancing Required and Optional

Schema design involves tradeoffs:

**Too many required fields:**
- High barrier to entry
- Many incomplete/invalid documents
- Creators skip metadata entirely

**Too few required fields:**
- Low metadata quality
- Search becomes unreliable
- Inconsistent records

The MicroSim schema strikes a balance: 7 required fields ensure minimum searchability, while 30+ optional fields allow rich description for creators who invest the time.

!!! tip "The 80/20 Rule of Metadata"
    About 80% of search value comes from 20% of fields. Get the required fields right, and your MicroSim is discoverable. Add optional fields to stand out in search results and help AI generators learn from your example.

---

## Data Quality: Measuring Metadata Excellence

Having valid metadata is the minimum bar. **Data quality** measures how good your metadata is—how complete, accurate, and useful for its purpose. High-quality metadata powers better search, smarter AI generation, and more effective education.

### Dimensions of Data Quality

| Dimension | Question | Example |
|-----------|----------|---------|
| **Completeness** | How many fields are filled? | 85% of fields populated |
| **Accuracy** | Is the information correct? | Creator name spelled right |
| **Consistency** | Same format throughout? | Dates all use YYYY-MM-DD |
| **Timeliness** | Is it current? | Last updated this year |
| **Relevance** | Does it serve user needs? | Subjects match actual content |
| **Uniqueness** | No unwanted duplicates? | One record per MicroSim |

For MicroSim metadata, we focus primarily on **completeness** and **quality** scores.

---

## Completeness Score

The **completeness score** measures what percentage of metadata fields are populated. It's a straightforward metric: filled fields divided by total possible fields.

### Calculating Completeness

Basic formula:

$$
\text{Completeness Score} = \frac{\text{Fields Populated}}{\text{Total Possible Fields}} \times 100
$$

For MicroSim metadata with 40 possible fields:

- 20 fields filled → 50% completeness
- 32 fields filled → 80% completeness
- 40 fields filled → 100% completeness

### Weighted Completeness

Not all fields matter equally. A weighted approach assigns importance:

| Field Category | Weight | Rationale |
|----------------|--------|-----------|
| Required fields | 3x | Essential for function |
| Recommended fields | 2x | High search impact |
| Optional fields | 1x | Nice to have |

Weighted formula:

$$\text{Weighted Completeness} = \frac{\sum (\text{weight} \times \text{filled})}{\sum (\text{weight} \times \text{total})} \times 100$$

Example:

- 7 required fields (weight 3), 5 filled: 5 × 3 = 15 / 21 possible = 71%
- 8 recommended fields (weight 2), 6 filled: 6 × 2 = 12 / 16 possible = 75%
- 25 optional fields (weight 1), 10 filled: 10 × 1 = 10 / 25 possible = 40%
- **Total: (15 + 12 + 10) / (21 + 16 + 25) = 37 / 62 = 60% weighted completeness**

### Completeness Targets

| Score | Rating | Interpretation |
|-------|--------|----------------|
| 90-100% | Excellent | Comprehensive, exemplary |
| 70-89% | Good | Well-documented, searchable |
| 50-69% | Fair | Basic discoverability |
| Below 50% | Poor | Limited usefulness |

!!! note "Completeness vs. Quality"
    High completeness doesn't guarantee quality. You could fill every field with "TBD" and achieve 100% completeness with 0% usefulness. Completeness is necessary but not sufficient.

#### Diagram: Completeness Score Calculator

<iframe src="../../sims/completeness-calculator/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Metadata Completeness Score Calculator</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: calculate

Learning Objective: Students will calculate completeness scores for MicroSim metadata by filling in fields and observing how the score changes based on field weights and population.

Canvas layout:
- Left panel (45%): Field checklist grouped by section
- Center panel (25%): Score gauges and breakdown
- Right panel (30%): Recommendations and tips

Visual elements:
- Checklist with sections (dublinCore, educational, technical, etc.)
- Checkbox for each field, color-coded by weight (red=required, yellow=recommended, gray=optional)
- Circular gauge showing overall score (0-100%)
- Bar chart showing score by section
- Star rating (1-5) based on score thresholds

Interactive controls:
- Click checkboxes to mark fields as filled
- "Load Sample" buttons: "Minimal", "Good", "Excellent"
- Toggle: "Show weighted" vs "Show unweighted" score
- "Calculate" button (for dramatic reveal)
- "Reset All" button

Score display:
- Large percentage in center gauge
- Color coding: red (<50%), yellow (50-69%), green (70-89%), gold (90%+)
- Breakdown panel showing required/recommended/optional percentages
- Formula display showing calculation

Recommendations panel:
- "Add these fields to reach 70%:" with list
- "High-impact fields you're missing:" prioritized list
- Tips for improving score efficiently

Default state: Minimal fields checked (required only)

Behavior:
- Score updates in real-time as checkboxes change
- Gauge animates smoothly
- Recommendations update dynamically
- Celebration animation at 90%+

Implementation: p5.js with gauge rendering
</details>

---

## Quality Score

While completeness measures quantity, the **quality score** measures usefulness—how well the metadata serves its purpose. Quality considers not just presence but value.

### Quality Factors

| Factor | Description | Good Example | Poor Example |
|--------|-------------|--------------|--------------|
| **Title specificity** | Descriptive vs vague | "Fourier Transform Visualizer" | "Math Animation" |
| **Description length** | Adequate detail | 75 words explaining features | "A simulation" |
| **Subject coverage** | Multiple relevant terms | 5 specific subjects | 1 generic subject |
| **Freshness** | Recently updated | Date within 1 year | Date 5+ years old |
| **Rights clarity** | Explicit license | "CC BY-SA 4.0" | Empty or "Contact author" |

### Calculating Quality Score

Quality scoring uses heuristics that can be automated:

```
Quality Score Components:
- Title quality (0-20 points)
  - Length 3-10 words: 10 points
  - Contains specific terms: 10 points

- Description quality (0-25 points)
  - Length 50-150 words: 15 points
  - Mentions interactions: 5 points
  - Mentions learning outcomes: 5 points

- Subject quality (0-20 points)
  - 3+ subjects: 10 points
  - Mix of broad and specific: 10 points

- Freshness (0-15 points)
  - Updated within 1 year: 15 points
  - Updated within 2 years: 10 points
  - Updated within 5 years: 5 points

- Rights clarity (0-20 points)
  - Standard license specified: 20 points
  - Custom rights text: 10 points

Total possible: 100 points
```

### Quality Benchmarks

| Score | Rating | What It Means |
|-------|--------|---------------|
| 80-100 | Exemplary | Model metadata, use as reference |
| 60-79 | Good | Effective for search and reuse |
| 40-59 | Acceptable | Functions but could improve |
| Below 40 | Needs Work | Limited discoverability |

### Quality vs. Completeness Matrix

The best metadata scores high on both dimensions:

|                    | Low Completeness | High Completeness |
|--------------------|------------------|-------------------|
| **High Quality**   | Hidden gem—expand it | ⭐ Excellent |
| **Low Quality**    | Needs major work | Quantity over quality—improve |

Your goal: upper right quadrant. Complete AND quality metadata makes MicroSims truly discoverable and reusable.

#### Diagram: Quality Score Dashboard

<iframe src="../../sims/quality-dashboard/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Metadata Quality Score Dashboard</summary>
Type: microsim

Bloom Level: Evaluate (L5)
Bloom Verb: assess

Learning Objective: Students will assess metadata quality by analyzing multiple quality factors and identifying specific improvements to increase the overall quality score.

Canvas layout:
- Top panel (25%): Overall score and rating
- Middle panel (50%): Factor breakdown with sliders
- Bottom panel (25%): Improvement suggestions

Visual elements:
- Large circular gauge for overall quality score
- Five smaller gauges for each factor (title, description, subjects, freshness, rights)
- Color-coded bars showing contribution of each factor
- Star rating (1-5 stars) with label
- Quality vs Completeness quadrant chart showing current position

Interactive controls:
- Paste JSON textarea to analyze existing metadata
- "Load Example" dropdown (exemplary, good, poor)
- Individual factor sliders to simulate improvements
- "What if I improve...?" mode to test changes
- "Generate Report" button for detailed analysis
- "Show Details" toggles for each factor

Factor analysis display:
For each factor show:
- Current score / max possible
- Specific feedback (e.g., "Title is only 2 words—aim for 4-7")
- Improvement action (e.g., "Add 'Interactive' and topic keywords")
- Potential points gained

Quadrant chart:
- X-axis: Completeness (0-100%)
- Y-axis: Quality (0-100%)
- Current position marked with dot
- Quadrant labels: "Needs Work", "Quantity>Quality", "Hidden Gem", "Excellent"
- Trail showing improvement path

Recommendations panel:
- Ordered list of highest-impact improvements
- Estimated new score if implemented
- Quick-fix buttons for common issues

Default state: Example with score ~65 (Good rating)

Behavior:
- Live analysis as user edits JSON
- Gauges animate when scores change
- Recommendations update dynamically
- Celebratory animation when reaching 80+

Implementation: p5.js with chart components
</details>

---

## Putting It All Together: The Quality Metadata Workflow

Now you understand JSON syntax, objects, arrays, schemas, validation, and quality metrics. Here's the workflow for creating high-quality MicroSim metadata:

### Step 1: Start with the Template

Begin with a template containing all schema sections:

```json
{
  "dublinCore": {
    "title": "",
    "creator": "",
    "subject": [],
    "description": "",
    "date": "",
    "format": "text/html",
    "rights": ""
  },
  "educational": {
    "gradeLevel": "",
    "bloomsTaxonomy": "",
    "difficulty": "",
    "subjectArea": ""
  },
  "technical": {
    "framework": "",
    "responsive": true
  }
}
```

### Step 2: Fill Required Fields First

Prioritize the seven required Dublin Core fields. Get these right before moving on.

### Step 3: Add High-Value Optional Fields

Focus on fields that most impact searchability:

- educational.gradeLevel
- pedagogical.bloomsTaxonomy
- educational.subjectArea
- technical.framework
- search.visualizationType

### Step 4: Validate Against Schema

Run validation to catch syntax errors and missing requirements:

```bash
python3 src/microsim-schema/validate-metadata.py metadata.json
```

Fix any errors before proceeding.

### Step 5: Check Quality Score

Analyze your metadata quality:

- Is the title specific and searchable?
- Is the description 50-150 words with feature details?
- Do you have 3+ relevant subjects?
- Is the date current?
- Is the license explicit?

### Step 6: Iterate and Improve

Review, revise, repeat. Quality metadata is worth the investment—it determines whether your educational creation reaches learners worldwide or languishes unfound.

---

## Key Takeaways

1. **JSON is simple**: Six data types, strict but learnable syntax, human and machine readable

2. **Objects** (`{}`) represent entities with properties—perfect for MicroSim metadata with its many attributes

3. **Arrays** (`[]`) represent ordered collections—ideal for subjects, contributors, and learning objectives

4. **JSON Schema** defines structural rules that ensure consistency across all metadata

5. **Validation** catches errors early—run it often, fix issues immediately

6. **Required fields** (7 for Dublin Core) ensure minimum searchability; optional fields add richness

7. **Completeness score** measures field population; aim for 70%+ with weighted scoring

8. **Quality score** measures usefulness; specific titles, detailed descriptions, and clear rights matter most

9. **The goal is upper-right quadrant**: High completeness AND high quality metadata

10. **Good metadata is a superpower**: It makes your MicroSims discoverable by teachers, learnable by AI, and impactful for students worldwide

---

## What's Next?

You now have the technical foundation for creating excellent MicroSim metadata. In the next chapters, we'll explore how this metadata powers search and discovery:

- **Keyword search** using the terms you've carefully chosen
- **Faceted search** filtering by grade level, subject, and difficulty
- **Semantic search** using AI to find conceptually similar simulations

Your well-crafted JSON metadata will be the fuel for all of these powerful capabilities.

---

*Ready to see metadata in action? Continue to [Chapter 6: Search Fundamentals](../06-search-fundamentals/index.md).*
