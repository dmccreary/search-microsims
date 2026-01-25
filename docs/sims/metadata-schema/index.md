---
title: Metadata Schema Structure
description: Interactive diagram showing the hierarchical structure of metadata.json with Dublin Core, educational, pedagogical, technical, and search sections
image: /sims/metadata-schema/metadata-schema.png
quality_score: 85
---

# Metadata Schema Structure

<iframe src="./main.html" width="100%" height="650px" scrolling="no" style="overflow: hidden;"></iframe>

[View Fullscreen](./main.html){ .md-button .md-button--primary target="_blank" }

## About This MicroSim

This interactive diagram visualizes the complete metadata.json schema used for MicroSim packages. Click on any field to see its description and example values. The schema is organized into five main sections that enable search, discovery, pedagogical matching, and AI integration.

## Learning Objectives

After using this MicroSim, students will be able to:

1. Organize their understanding of the metadata.json schema
2. Identify the five main sections: dublinCore, educational, pedagogical, technical, and search
3. Explain the purpose of each field within the schema
4. Understand how pedagogical metadata enables matching interaction patterns to learning objectives
5. Create properly structured metadata files for their own MicroSims

## How to Use

1. **Click on nodes** to see field descriptions and example values
2. **Gray node** is the root object
3. **Blue nodes** represent Dublin Core standard metadata
4. **Green nodes** represent educational context fields
5. **Pink nodes** represent pedagogical pattern fields
6. **Orange nodes** represent technical implementation details
7. **Purple nodes** represent search and discoverability fields

## Schema Sections

### Dublin Core (Blue)
Standard metadata based on the Dublin Core Metadata Initiative. Includes title, description, creator, date, and rights.

### Educational (Green)
Learning-focused metadata including subject area, grade level, Bloom's Taxonomy levels, difficulty, and learning objectives.

### Pedagogical (Pink)
Interaction pattern metadata that enables matching MicroSims to learning objectives. Includes pattern type (worked-example, exploration, practice), Bloom alignment, Bloom verbs, pacing (self-paced, continuous), prediction support, data visibility, and interaction style. This section prevents mismatches like recommending continuous animations for "explain" objectives.

### Technical (Orange)
Implementation details such as the JavaScript framework used, library version, and browser support.

### Search (Purple)
Discoverability fields including keywords, visualization type, and interaction level for faceted search.

## Lesson Plan

### Learning Objectives
- Understand the hierarchical structure of metadata.json
- Identify which fields belong to which section
- Recognize required vs optional fields
- Explain how pedagogical metadata prevents interaction pattern mismatches

### Activities
1. Have students click through all five sections to understand their purpose
2. Ask students to create a metadata.json file for a hypothetical MicroSim
3. Discuss how metadata enables search and AI discovery
4. Explore how pedagogical fields (pattern, pacing, bloomVerbs) help match MicroSims to learning objectives

### Assessment
- Can students name the five main sections?
- Can students explain the difference between educational and pedagogical fields?
- Can students explain why continuous animation is inappropriate for "explain" objectives?
- Can students create valid metadata for a new MicroSim?

## Iframe Embed Code

```html
<iframe src="../../sims/metadata-schema/main.html"
        width="100%"
        height="650px"
        scrolling="no">
</iframe>
```

## References

- [Dublin Core Metadata Initiative](https://www.dublincore.org/)
- [MicroSim Schema Documentation](https://dmccreary.github.io/microsim-search/microsim-schema/)
- [Bloom's Taxonomy](https://www.bloomstaxonomy.net/)
- [Pedagogical Pattern Alignment](../../chapters/15-pedagogical-pattern-alignment/index.md)
