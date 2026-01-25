# Dublin Core Element Completeness Checker - Design Log

## Date: 2026-01-25

## Specification Summary
- **Type**: microsim
- **Bloom Level**: Apply (L3)
- **Bloom Verb**: implement
- **Learning Objective**: Students will implement complete Dublin Core metadata by filling in all 15 elements and receiving feedback on completeness and quality.

## Template Search Results

Used `find-similar-templates.py` to identify relevant templates:

| Rank | Template | Score | Key Features |
|------|----------|-------|--------------|
| 1 | MicroSim Template | 0.7082 | Basic p5.js structure |
| 2 | p5.js Architecture | 0.7081 | Architecture patterns |
| 3 | **Visual Description Checklist** | 0.6901 | Checklist UI, progress bar, export |
| 4 | p5.js MicroSim Architecture | 0.6836 | Layout patterns |
| 5 | **Dublin Core Elements** | 0.6827 | DC element data, info panels |
| 6 | MicroSim Template (signal) | 0.6813 | Template structure |
| 7 | Interaction Spec Template | 0.6763 | Spec patterns |
| 8 | MicroSim Template (graph) | 0.6723 | Basic structure |
| 9 | **Specification Quality Checklist** | 0.6596 | Checklist with categories |
| 10 | Icons Demo | 0.6569 | Icon patterns |

## Templates Selected for Reference

### 1. Visual Description Completeness Checklist (Primary Template)
**Repository**: `automating-instructional-design`
**Path**: `docs/sims/visual-description-checklist/`

**Features Used**:
- Expandable category headers with collapse/expand
- Checkbox-based completion tracking
- Progress bar showing percentage complete
- Export to clipboard functionality
- Reset all button
- Hover tooltips with example content
- Color-coded categories with distinct headers
- Responsive canvas sizing

**Why Selected**: This template provides the core checklist interaction pattern with progress tracking, which directly maps to our completeness checker concept.

### 2. Specification Quality Checklist (Secondary Template)
**Repository**: `automating-instructional-design`
**Path**: `docs/sims/spec-quality-checklist/`

**Features Used**:
- Category icons (book, palette, cursor, code)
- Simpler category structure
- Clean checkbox styling with checkmark animation

**Why Selected**: Provides a cleaner, more compact category design that works well for the 3-category grouping of Dublin Core elements.

### 3. Dublin Core Elements Infographic (Data Reference)
**Repository**: `search-microsims`
**Path**: `docs/sims/dublin-core-elements/`

**Features Used**:
- Complete Dublin Core element data structure with 15 elements
- Category organization: Content (7), Intellectual Property (4), Instantiation (4)
- Element definitions, examples, and extended descriptions
- Required vs optional element flagging
- Color scheme for three categories (blue/green/orange)

**Why Selected**: Contains authoritative data structure for all 15 Dublin Core elements that can be directly reused.

## Design Decisions

### 1. Layout Architecture
**Decision**: Two-panel layout with form on left (350px) and feedback on right (300px)
**Rationale**: Spec requested this layout. Provides clear separation between input and feedback areas.
**Source**: Novel design per specification

### 2. Input Method
**Decision**: Use text input fields instead of checkboxes
**Rationale**: The spec asks students to "fill in all 15 elements" - this requires actual content entry, not just checkbox marking. This supports the "Apply/Implement" Bloom level better than passive checkbox clicking.
**Source**: Specification requirement + Bloom alignment

### 3. Field Organization
**Decision**: Group fields by Dublin Core category with collapsible sections
**Rationale**: 15 fields would be overwhelming as a flat list. The Visual Description Checklist template's expandable categories work well for this.
**Source**: Visual Description Checklist pattern

### 4. Color-Coded Validation
**Decision**:
- Red border: Required field missing
- Yellow border: Recommended field missing
- Green border: Field complete
**Rationale**: Directly from specification. Provides immediate visual feedback.
**Source**: Specification requirement

### 5. Completeness Gauge
**Decision**: Circular gauge with percentage (0-100%)
**Rationale**: Spec requests circular gauge. More visually engaging than linear progress bar.
**Source**: Specification requirement (novel implementation)

### 6. Scoring System
**Decision**:
- Required fields: 10 points each (7 fields = 70 max)
- Recommended fields: 5 points each (4 fields = 20 max)
- Optional fields: 2.5 points each (4 fields = 10 max)
- Total: 100 points possible
**Rationale**: Directly from specification. Emphasizes required fields.
**Source**: Specification requirement

### 7. Quality Bonuses
**Decision**: Add quality assessment beyond presence/absence:
- Description length bonus (50+ chars)
- Subject count bonus (3+ subjects)
- Valid date format (ISO 8601)
**Rationale**: From specification. Encourages quality metadata, not just completeness.
**Source**: Specification requirement

### 8. Export Format
**Decision**: Generate downloadable JSON matching Dublin Core nested structure
**Rationale**: Creates practical, usable output that students can use in real projects.
**Source**: Specification requirement + Dublin Core Elements template data structure

### 9. Load Example Button
**Decision**: Pre-fill with example from Dublin Core Elements template
**Rationale**: Shows students what good metadata looks like before they start.
**Source**: Specification requirement + Dublin Core Elements template data

### 10. Field Classification

Based on the Dublin Core Elements template and common MicroSim practice:

| Category | Fields | Priority |
|----------|--------|----------|
| **Required** | Title, Creator, Subject, Description, Date, Format, Rights | 10 pts each |
| **Recommended** | Publisher, Type, Identifier, Language | 5 pts each |
| **Optional** | Contributor, Source, Relation, Coverage | 2.5 pts each |

## Implementation Approach

### File Structure
```
docs/sims/dublin-core-checker/
├── index.md           # Documentation page
├── main.html          # HTML wrapper
└── dublin-core-checker.js  # p5.js implementation
```

### Key Components

1. **Data Structure**: Adapt from Dublin Core Elements template
2. **Form Handler**: Novel implementation for text inputs in p5.js
3. **Validation Engine**: Check field presence, format validation, quality bonuses
4. **Circular Gauge**: Custom p5.js arc-based gauge
5. **JSON Generator**: Build nested Dublin Core structure
6. **Download Handler**: Browser download API

### Technical Notes

- p5.js doesn't have native form inputs; will use DOM elements (`createInput()`)
- Canvas used for gauge, checklist, and visual feedback
- DOM inputs positioned to align with canvas layout
- Export uses `saveJSON()` or Blob download

## Deviations from Templates

1. **Input Method**: Templates use checkboxes; we use text inputs for content entry
2. **Gauge Style**: Templates use linear progress bars; we use circular gauge per spec
3. **Two-Panel Layout**: Novel layout not in templates
4. **JSON Export**: Templates export text; we export structured JSON
5. **Quality Scoring**: Novel feature beyond simple completion tracking

## Estimated Complexity

- **Lines of Code**: ~500-600 (comparable to Visual Description Checklist at 700 lines)
- **Components**:
  - Form with 15 input fields
  - Circular gauge with animation
  - Checklist status display
  - 4 buttons (Check, Load Example, Clear, Export)
  - Live JSON preview area

## Implementation Summary

### Files Created

| File | Size | Purpose |
|------|------|---------|
| `docs/sims/dublin-core-checker/main.html` | 608 bytes | HTML wrapper |
| `docs/sims/dublin-core-checker/dublin-core-checker.js` | 19.8 KB | p5.js implementation |
| `docs/sims/dublin-core-checker/index.md` | 2.1 KB | Documentation |
| `docs/sims/dublin-core-checker/metadata.json` | 1.7 KB | MicroSim metadata |

### Features Implemented

1. **Two-panel layout**: Form on left (~400px), feedback on right
2. **15 input fields**: DOM text inputs positioned over canvas
3. **Three priority sections**: Required (7), Recommended (4), Optional (4)
4. **Color-coded validation**: Red/Orange/Gray for empty, Green for filled
5. **Circular completeness gauge**: 0-100% with color coding
6. **Scoring system**: Base points + quality bonuses
7. **Quality feedback**: Tips for improving metadata quality
8. **Element status checklist**: 3-column grid showing all 15 elements
9. **Example selector dropdown**: 5 levels from minimal (1 field) to complete (all 15)
10. **Three buttons**: Clear All, Export JSON, Check
11. **JSON export**: Downloads structured Dublin Core JSON file

### Technical Approach

- Used hybrid DOM/canvas approach: DOM inputs for text entry, canvas for visual feedback
- Inputs positioned absolutely over the canvas using JavaScript
- Real-time validation triggered on input change events
- Responsive layout adjusts panel widths based on container

## Lessons Learned: p5.js vs HTML Forms

### The Problem

Using p5.js to create form-based interfaces required significant effort and resulted in complex, fragile code. The challenges included:

| Challenge | Description |
|-----------|-------------|
| **Manual DOM creation** | Had to use `document.createElement()` for each input, select, and button |
| **Absolute positioning** | Complex calculations to align DOM inputs with canvas-drawn labels |
| **Pointer events** | Managing click-through between canvas and DOM layers required z-index and pointer-events juggling |
| **Resize handling** | Repositioning all DOM elements when window/container resizes |
| **Timing issues** | Needed `setTimeout()` to ensure canvas was rendered before positioning inputs |
| **Code complexity** | ~500+ lines of code for what would be ~50 lines in HTML/CSS |

### Recommended Approach for Future Form-Based MicroSims

Use a **hybrid architecture** that leverages each technology's strengths:

```
┌─────────────────────────────────────────────┐
│  HTML/CSS (Forms)       │  p5.js (Visuals)  │
│  ─────────────────      │  ──────────────   │
│  • <input> elements     │  • Gauges         │
│  • <select> dropdowns   │  • Charts         │
│  • <button> elements    │  • Animations     │
│  • CSS Grid/Flexbox     │  • Diagrams       │
│  • Native validation    │  • Simulations    │
└─────────────────────────────────────────────┘
```

### When to Use Each Technology

| Component Type | Best Tool | Rationale |
|----------------|-----------|-----------|
| Text inputs | HTML `<input>` | Native keyboard handling, accessibility, validation |
| Dropdowns | HTML `<select>` | Native behavior, mobile-friendly |
| Buttons | HTML `<button>` | Native focus, keyboard nav, accessibility |
| Checkboxes | HTML `<input type="checkbox">` | Native toggle behavior |
| Layout | CSS Flexbox/Grid | Responsive, declarative, maintainable |
| Circular gauges | p5.js canvas | Custom drawing, animation |
| Data visualizations | p5.js canvas | Real-time updates, interactivity |
| Animations | p5.js canvas | Frame-based control |

### Data Flow Pattern

```javascript
// Shared state object
const formData = { title: '', creator: '', ... };

// HTML form updates state
document.getElementById('title').addEventListener('input', (e) => {
  formData.title = e.target.value;
});

// p5.js reads state for visualization
function draw() {
  drawGauge(calculateCompleteness(formData));
}
```

### Benefits of Hybrid Approach

1. **Simpler code**: ~80% reduction in form-handling code
2. **Better accessibility**: Native HTML form elements are screen-reader friendly
3. **Mobile-friendly**: Native inputs have proper touch handling
4. **Maintainable**: Clear separation of concerns
5. **Faster development**: No fighting against the framework

### Conclusion

**p5.js excels at**: visualizations, animations, simulations, custom graphics

**p5.js struggles with**: forms, text input, native UI elements

For future MicroSims requiring user input forms, use HTML/CSS for the form and reserve p5.js for the visualization components only.

## References

- Visual Description Checklist: https://dmccreary.github.io/automating-instructional-design/sims/visual-description-checklist/
- Specification Quality Checklist: https://dmccreary.github.io/automating-instructional-design/sims/spec-quality-checklist/
- Dublin Core Elements: https://dmccreary.github.io/microsim-search/sims/dublin-core-elements/
