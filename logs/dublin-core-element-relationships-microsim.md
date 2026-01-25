# Dublin Core Element Relationships MicroSim - Design Decisions Log

## Date: 2026-01-25

## Specification Summary

**Type:** Infographic
**Bloom Level:** Understand (L2)
**Bloom Verb:** classify
**Learning Objective:** Students will classify Dublin Core elements into categories (content description, intellectual property, instantiation) and explain how they relate to MicroSim metadata.

## Template Search Results

Ran `find-similar-templates.py` to find semantically similar MicroSims for use as templates.

### Top 10 Similar Templates

| Rank | Title | Score | Framework | Key Features |
|------|-------|-------|-----------|--------------|
| 1 | Classification Matrix MicroSim | 0.6168 | p5.js | 2x2 matrix, drag-and-drop classification |
| 2 | Bloom's Taxonomy MicroSim Types | 0.6024 | p5.js | Pyramid infographic, hover effects, info panels |
| 3 | MicroSim Readiness Assessment | 0.5919 | p5.js | Decision tree flowchart |
| 4 | Specification Quality Checklist | 0.5851 | p5.js | Expandable categories, checklist items |
| 5 | SMART Learning Objectives Framework | 0.5679 | p5.js | Component visualization |
| 6 | MicroSim Types by Bloom's Taxonomy | 0.5588 | unknown | Interactive infographic mapping |
| 7 | Visual Description Completeness Checklist | 0.5524 | p5.js | Categorized checklist |
| 8 | Visualization Library Decision Tree | 0.5492 | p5.js | Decision tree with endpoints |
| 9 | Book Levels MicroSim | 0.5399 | unknown | Stair-step visualization |
| 10 | Book Levels MicroSim (Signal) | 0.5351 | unknown | Level visualization |

## Template Analysis

### Template 1: Bloom's Taxonomy MicroSim Types (Selected for reference)
**GitHub:** https://github.com/dmccreary/automating-instructional-design/tree/main/docs/sims/bloom-microsim-types

**Why selected:**
- Also an infographic with categorized elements
- Has hover effects with pulsing animations
- Has info panel that shows details on hover/click
- Uses color-coded sections
- Well-structured p5.js code with canvas layout

**Key patterns to borrow:**
- Hover detection with visual feedback (pulsing animation using `sin()`)
- Info panel system (right-aligned, 280px width)
- Color interpolation with `lerpColor()` for smooth transitions
- Click vs hover state distinction

### Template 2: Specification Quality Checklist (Selected for reference)
**GitHub:** https://github.com/dmccreary/automating-instructional-design/tree/main/docs/sims/spec-quality-checklist

**Why selected:**
- Category-based layout with colored headers
- Expandable sections with items
- Progress tracking per category
- Visual feedback on hover/click

**Key patterns to borrow:**
- Category header rendering with color coding
- Item layout within categories
- Completion/progress indicators
- Expand/collapse functionality

## Design Decisions

### 1. Layout Architecture

**Decision:** Three-column card layout with fixed positions
- Left column (blue): Content elements
- Center column (green): Intellectual Property elements
- Right column (orange): Instantiation elements

**Rationale:** The specification explicitly calls for three columns representing Dublin Core's three official categories. Fixed columns provide clear visual organization.

### 2. Framework Selection

**Decision:** Vanilla HTML/CSS/JavaScript with p5.js for interactivity

**Rationale:**
- Specification mentions "HTML/CSS/JavaScript with card components"
- p5.js provides good canvas-based rendering for consistent hover effects
- Both reference templates use p5.js successfully

### 3. Card Component Design

**Decision:** Each Dublin Core element rendered as a card with:
- Element name as title
- Color-coded background matching column color
- Subtle shadow that lifts on hover
- Required/optional indicator badge

**Borrowed from:** Bloom's Taxonomy template's level sections with hover effects

### 4. Hover Interaction

**Decision:** On hover, show tooltip/info panel with:
- Definition of the element
- Example value for a MicroSim
- Required vs Optional status

**Implementation approach:**
- Use sin() pulsing effect from Bloom's template for subtle animation
- Card lifts slightly (transform or shadow change)
- Info panel appears below or beside the card

**Borrowed from:** Bloom's Taxonomy template's info panel system

### 5. Click Interaction

**Decision:** Click toggles extended description panel

**Rationale:** Matches specification's "Click to see extended description"

**Borrowed from:** Bloom's template's selected state toggle

### 6. Color Intensity for Usage Frequency

**Decision:** Implement color saturation/opacity variation:
- Commonly used elements: Full color saturation (Title, Creator, Subject, Description)
- Moderately used: 80% saturation (Date, Format, Type)
- Rarely used: 60% saturation (Coverage, Source, Relation)

**Rationale:** Specification calls for "Color intensity indicates how commonly used in MicroSims"

### 7. Data Structure

**Decision:** Use a data array with element definitions:
```javascript
const dublinCoreElements = [
  {
    name: "Title",
    category: "content",
    definition: "Name of the resource",
    example: "Pendulum Period Explorer",
    required: true,
    usage: "high" // high, medium, low
  },
  // ... more elements
];
```

**Borrowed from:** Checklist template's categories array structure

### 8. Responsive Behavior

**Decision:** Calculate column widths dynamically based on canvas width
- Minimum width constraints to prevent text overflow
- Cards resize proportionally

## Implementation Notes

### From Bloom's Taxonomy Template:
- Pulse animation: `let pulse = sin(pulsePhase * 2) * 0.5 + 0.5`
- Color transitions: `lerpColor(baseColor, hoverColor, pulse)`
- Info panel positioning at right edge
- Stroke weight changes on hover (1 to 2 pixels)

### From Spec Quality Checklist Template:
- Category header with icon/name pattern
- Item rendering within categories
- Progress/completion counting logic
- Reset button functionality

### Custom Additions:
- Three-column fixed layout (not expandable)
- Color intensity variation for usage frequency
- Card lift effect with shadow
- Element-specific MicroSim examples

## Files to Create

1. `main.html` - Container page with p5.js include
2. `dublin-core-elements.js` - Main p5.js sketch
3. `metadata.json` - MicroSim metadata following schema

## Testing Checklist

- [x] All 15 Dublin Core elements displayed in correct columns
- [x] Hover effects work smoothly
- [x] Click expands/collapses extended description
- [x] Color intensity correctly reflects usage frequency
- [x] Responsive layout works at different widths
- [x] Info panel displays correct data for each element
- [x] Card shadow/lift animation smooth

## Implementation Summary

### Files Created

| File | Purpose | Size |
|------|---------|------|
| `docs/sims/dublin-core-elements/main.html` | HTML container with p5.js CDN | 0.5 KB |
| `docs/sims/dublin-core-elements/dublin-core-elements.js` | Main visualization code | 12 KB |
| `docs/sims/dublin-core-elements/index.md` | Documentation with lesson plan | 3 KB |
| `docs/sims/dublin-core-elements/metadata.json` | Dublin Core metadata | 1.5 KB |

### Key Implementation Details

**Canvas Dimensions:**
- `drawHeight`: 480px (no control region needed)
- `controlHeight`: 0px (interaction via hover/click only)
- `canvasHeight`: 480px
- `iframeHeight`: 482px (canvas + 2px border)

**Column Layout:**
- Dynamic 3-column layout calculated from canvas width
- `columnWidth = (canvasWidth - 2*margin - 2*columnGap) / 3`
- 10px gap between columns, 15px margins

**Card Design:**
- `cardHeight`: 52px per element
- `cardCornerRadius`: 8px for rounded corners
- Shadow offset: 3px on hover/select for lift effect

**Color Scheme:**
- Content (blue): `rgb(70, 130, 180)` with light variant `rgb(230, 240, 250)`
- Intellectual Property (green): `rgb(60, 140, 80)` with light variant `rgb(230, 250, 235)`
- Instantiation (orange): `rgb(200, 120, 50)` with light variant `rgb(255, 245, 230)`

**Animation:**
- Pulse animation: `sin(pulsePhase * 2) * 0.3 + 0.7`
- `lerpColor()` for smooth transitions on hover
- `mouseOverCanvas` tracking for animation control

**Info Panel:**
- Width: 280px (right-aligned)
- Hover state: 180px height (definition + example + usage)
- Selected state: 310px height (adds extended description)
- Includes word-wrapping for long text

### Patterns Borrowed from Templates

| Pattern | Source Template | Implementation |
|---------|----------------|----------------|
| Pulsing hover animation | Bloom's Taxonomy | `sin(pulsePhase * 2)` with `lerpColor()` |
| Info panel structure | Bloom's Taxonomy | Right-aligned 280px panel with header |
| Category headers | Spec Quality Checklist | Colored bars with rounded top corners |
| Click toggle behavior | Bloom's Taxonomy | `selectedElement` state variable |
| Hit detection array | Spec Quality Checklist | `elementPositions[]` for mouse tracking |

### Unique Additions (Not from templates)

1. **Usage frequency visualization**: Alpha channel variation (255/210/170) based on usage level
2. **Three-column layout**: Dynamic calculation with equal spacing
3. **Dual-state info panel**: Different heights for hover vs selected
4. **Required badge**: Right-aligned in both card and info panel header
5. **Word wrap function**: Custom `wrapText()` for long definitions
6. **Adaptive panel positioning**: Info panel appears on left for right column elements to avoid overlap

## Bug Fixes

### 2026-01-25: Info panel overlap on right column

**Problem:** When hovering or clicking on Instantiation (right column) elements, the info panel appeared on the right side and covered the element being viewed.

**Solution:** Modified `drawInfoPanel()` to check the element's category and position the panel on the left side for instantiation category elements:

```javascript
let panelX = (elem.category === 'instantiation') ? margin : (canvasWidth - panelWidth - margin);
```
