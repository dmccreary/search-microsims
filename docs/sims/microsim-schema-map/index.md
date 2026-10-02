---
title: MicroSim Schema Structure Map
description: Interactive vis-network map of the MicroSim metadata schema showing its eight sections, their key fields, which fields are required, and the dependencies between sections.
image: /sims/microsim-schema-map/microsim-schema-map.png
og:image: /sims/microsim-schema-map/microsim-schema-map.png
twitter:image: /sims/microsim-schema-map/microsim-schema-map.png
social:
   cards: false
quality_score: 100
---

# MicroSim Schema Structure Map

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Schema Structure Map Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A JSON Schema is easier to understand as a picture than as a page of nested
braces. This map shows the MicroSim metadata schema taught in Chapter 5:

- The gold circle in the center is the **root** object of every `metadata.json` file.
- The eight colored boxes around it are the **sections** of the schema.
  Only `dublinCore` carries a **required** badge.
- The small circles are **fields**. A solid circle with a bold name is a
  required field. An outlined circle is an optional field.
- The **dashed lines** are dependencies: places where a field in one section
  refers to, or should agree with, a field in another section.

The map shows 35 key fields: 7 required and 28 optional. Hovering over a
field shows what a schema validator would check for it: its data type,
whether it is required, and constraints such as minimum length, allowed
values, or minimum number of items.

!!! note "Teaching version of the schema"
    This map follows the simplified schema used in Chapter 5, where only the
    `dublinCore` section and seven of its fields are required. The full
    schema file marks more sections and fields as required and defines many
    more optional fields. See the
    [MicroSim Schema documentation](../../microsim-schema.md) for the complete list.

## How to Use

1. **Click a section** to open or close its fields. The fields fan outward from the section.
2. **Hover over a field** to see its type, whether it is required, and its constraints.
   Click a field to keep its details on screen.
3. Check **Show required only** to hide every optional field. What is left is the
   minimum a metadata file needs in order to pass validation.
4. Use **Show section** to focus on one section and fade the others.
5. Type in **Find a field** to locate a field by name. Sections with a match open
   automatically, and matches are highlighted in yellow.
6. Press **Expand All** to see the whole schema, or **Collapse All** to see only the
   eight sections and the dashed dependency lines between them.
7. Hover over a field at the end of a dashed line. The line turns red, and the details
   panel explains the dependency.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/microsim-schema-map/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will examine the relationships between schema sections by exploring
an interactive visualization of the complete MicroSim metadata schema structure.
(Bloom's Taxonomy: Analyze)

### Grade Level

Undergraduate and adult learners

### Duration

15-20 minutes

### Prerequisites

- Can read JSON objects and arrays
- Knows the JSON Schema keywords `type`, `properties`, `required`, and `enum`
- Has read the "JSON Schema: Defining Structure Requirements" section of
  [Chapter 5: JSON and Data Structures](../../chapters/05-json-and-data-structures/index.md)

### Activities

1. **Orient (3 min)**: Press **Collapse All**. Students name the eight sections and identify the
   one that is required.
2. **Required versus optional (4 min)**: Check **Show required only**. Students list the seven
   required fields and explain why each one is needed for search.
3. **Examine constraints (5 min)**: Students hover over fields to find one example each of a
   length constraint, an enum, a numeric range, and a minimum item count.
4. **Trace dependencies (5 min)**: Press **Expand All**. For each dashed line, students state
   which two sections it connects and what would go wrong if the two fields disagreed.
5. **Discuss (3 min)**: Why does the schema split metadata into eight sections instead of one
   flat list of 35 fields? Which sections would a search engine read? Which would an AI
   generator read?

### Assessment

- Can the student sort a list of ten field names into required and optional?
- Can the student name the section that each of five given fields belongs to?
- Can the student explain one dependency between two sections in their own words?

## References

1. [MicroSim Schema documentation](../../microsim-schema.md) - This textbook - Field-by-field description of the full metadata schema.
2. [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/) - json-schema.org - Reference for `type`, `required`, `enum`, and the other keywords shown in the details panel.
3. [Dublin Core Metadata Element Set](https://www.dublincore.org/specifications/dublin-core/dces/) - Dublin Core Metadata Initiative - Source of the fields in the dublinCore section.
4. [vis-network Documentation](https://visjs.github.io/vis-network/docs/network/) - vis.js - The network library used to draw this map.
