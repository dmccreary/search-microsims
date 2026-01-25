---
title: Subject Hierarchy Taxonomy Explorer
description: Interactive visualization showing hierarchical relationships between subject disciplines, domains, and topics for Dublin Core metadata classification
image: subject-taxonomy-explorer.png
quality_score: 85
bloom_level: understand
bloom_verb: classify
---

# Subject Hierarchy Taxonomy Explorer

An interactive network visualization that helps users understand how subject terms relate hierarchically when creating Dublin Core metadata for educational resources like MicroSims.

<iframe src="main.html" width="100%" height="500px" scrolling="no" style="border: none; overflow: hidden;"></iframe>

[View Fullscreen](main.html){ .md-button }

## Learning Objective

Students will classify subject terms at appropriate levels of specificity by exploring hierarchical relationships between broad disciplines and specific topics.

## How to Use

1. **Explore the Hierarchy**: The visualization shows three levels:
   - **Disciplines** (blue, large) - Broad fields like Physics, Mathematics, Biology
   - **Domains** (green, medium) - Subject areas within disciplines like Mechanics, Algebra
   - **Topics** (orange, small) - Specific concepts like Projectile Motion, Quadratic Equations

2. **Click to Expand/Collapse**: Click any node with children to expand or collapse its subtree

3. **Search**: Use the search box to find specific subjects and highlight their path in the hierarchy

4. **View Details**: Hover over nodes to see descriptions and example usage

5. **Change Layout**: Toggle between hierarchical tree view and radial force-directed view

## Key Concepts

### Subject Specificity Levels

When tagging MicroSims with Dublin Core subject metadata:

- **Discipline level** is too broad for precise discovery ("Physics")
- **Domain level** is good for categorization ("Electricity")
- **Topic level** is best for specific learning resources ("Ohm's Law")

### Best Practice: Use Multiple Levels

A well-tagged MicroSim includes subjects at multiple levels:
```json
"subject": ["Physics", "Electricity", "Ohm's Law", "Current", "Voltage"]
```

This ensures the resource is discoverable whether users search broadly or specifically.

## Lesson Plan

### Duration
10-15 minutes

### Activities

1. **Exploration (5 min)**: Have students freely explore the hierarchy, expanding and collapsing nodes to understand the structure

2. **Classification Exercise (5 min)**: Give students a MicroSim description and ask them to identify appropriate subjects at each level

3. **Discussion (5 min)**: Discuss why using multiple specificity levels improves discoverability

### Assessment

Ask students to:
- Identify the appropriate discipline, domain, and topic for a given MicroSim
- Explain why both broad and specific subject tags are valuable

## References

- [Dublin Core Subject Element](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/subject)
- [LCSH Subject Headings](https://id.loc.gov/authorities/subjects.html)
- [Controlled Vocabularies in Metadata](https://www.dublincore.org/resources/userguide/publishing_metadata/)
