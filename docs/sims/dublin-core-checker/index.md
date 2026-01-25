# Dublin Core Element Completeness Checker

A MicroSim for implementing and validating Dublin Core metadata.

<iframe src="main.html" width="100%" height="685px" scrolling="no"></iframe>

[View Dublin Core Element Completeness Checker MicroSim Fullscreen](main.html){ .md-button .md-button--primary }
[Edit the Dublin Core Element Completeness Checker MicroSim Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/KXn4PfDBY)
## About This MicroSim

This interactive tool helps students practice implementing complete Dublin Core metadata. The two-panel layout provides:

- **Left Panel**: Input form with 15 Dublin Core fields organized by priority
- **Right Panel**: Real-time feedback with completeness gauge, element status, and quality tips

## How to Use

### Input Fields

The 15 Dublin Core elements are organized into three priority levels:

| Priority | Elements | Points Each |
|----------|----------|-------------|
| **Required** | Title, Creator, Subject, Description, Date, Format, Rights | 10 pts |
| **Recommended** | Publisher, Type, Identifier, Language | 5 pts |
| **Optional** | Contributor, Source, Relation, Coverage | 2.5 pts |

### Color Coding

Field borders indicate status:

- **Red border**: Required field is empty
- **Orange border**: Recommended field is empty
- **Gray border**: Optional field is empty
- **Green border**: Field has content

### Completeness Gauge

The circular gauge shows your overall completion percentage:

- **Red** (0-49%): Low completion
- **Orange** (50-79%): Moderate completion
- **Green** (80-100%): Good completion

### Element Status Checklist

Shows all 15 elements with checkmarks (filled) or X marks (empty) for quick visual reference.

### Quality Feedback

Provides tips for improving your metadata quality, including bonuses for:

- Description with 50+ characters: +2 points
- 3 or more subject terms: +2 points
- Valid ISO date format (YYYY-MM-DD): +1 point

### Controls

| Control | Description |
|---------|-------------|
| **Examples dropdown** | Load pre-filled examples at 5 levels (Minimal to Complete) |
| **Clear All** | Reset all fields to empty |
| **Export JSON** | Download metadata as a JSON file |
| **Check** | Recalculate score and update feedback |

### Example Levels

1. **Minimal** - Title only (1 field)
2. **Basic** - Title, Creator, Description (3 fields)
3. **Good** - All 7 required fields
4. **Better** - Required + Recommended (11 fields)
5. **Complete** - All 15 fields filled

## Learning Objective

Students will implement complete Dublin Core metadata by filling in all 15 elements and receiving feedback on completeness and quality.

## Bloom's Taxonomy

- **Level**: Apply (L3)
- **Verb**: Implement

## References

- [Dublin Core Metadata Initiative](https://www.dublincore.org/)
- [Dublin Core Element Set](https://www.dublincore.org/specifications/dublin-core/dces/)
