# Faceted Classification MicroSim - Design Decisions Log

## Date: 2026-01-25

## Specification Summary

**Type:** MicroSim
**Bloom Level:** Apply (L3)
**Bloom Verb:** demonstrate
**Learning Objective:** Students will demonstrate how multi-dimensional classification enables faceted search by exploring different filter combinations and observing how result sets change.

## Template Search Results

Ran `find-similar-templates.py` to find semantically similar MicroSims.

### Top 10 Similar Templates

| Rank | Title | Score | Framework | Key Features |
|------|-------|-------|-----------|--------------|
| 1 | Classification Matrix MicroSim | 0.5291 | p5.js | 2x2 matrix, drag-and-drop, card rendering |
| 2 | Bloom's Taxonomy MicroSim Types | 0.4871 | p5.js | Pyramid infographic, hover effects |
| 3 | p5.js MicroSim Architecture | 0.4802 | p5.js | Canvas layout, regions |
| 4 | Skill Development Priority Matrix | 0.4413 | Chart.js | Bubble chart visualization |
| 5 | MicroSim Readiness Assessment | 0.4410 | p5.js | Decision tree |
| 6 | Visual Description Checklist | 0.4367 | p5.js | Checkboxes, categories |
| 7 | Regex Matcher | 0.4347 | p5.js | Real-time filtering, input handling |
| 8 | Variable Types Infographic | 0.4327 | p5.js | 2x2 grid layout, expandable content |
| 9 | Three-Lens Evaluation | 0.4299 | p5.js | Venn diagram, intersections |
| 10 | Elementary Scaffolding | 0.4276 | p5.js | Progressive unlocking |

## Template Analysis

### Template 1: Classification Matrix MicroSim (Selected for reference)
**GitHub:** https://github.com/dmccreary/automating-instructional-design/tree/main/docs/sims/classification-matrix

**Why selected:**
- Has card rendering with rounded rectangles
- Layout with sidebar and main content area
- Item state management (placed vs unplaced)
- Responsive canvas with windowResized()

**Key patterns to borrow:**
- Card rendering: `rect(x, y, itemWidth, itemHeight, 6)` with rounded corners
- Fixed item dimensions with text centering
- Layout division into regions

### Template 2: Variable Types Infographic
**Why considered:**
- 2x2 grid layout similar to card grid
- Expandable content patterns

## Design Decisions

### 1. Layout Architecture

**Decision:** Three-panel layout
- Left panel (200px): Filter controls
- Center panel (flexible): Card grid
- Right panel (180px): Results summary and active filters

**Rationale:** Matches specification's panel structure and provides clear separation of concerns.

### 2. Filter Controls

**Decision:** Use p5.js DOM elements for controls
- `createSelect()` for Subject dropdown
- `createCheckbox()` for Grade Level and Type (multiple selections)
- `createRadio()` for Difficulty (single selection)
- `createButton()` for Clear All

**Rationale:** p5.js DOM elements integrate well with canvas and provide standard HTML form behavior.

### 3. Sample Data Structure

**Decision:** Array of 20 MicroSim objects with properties:
```javascript
{
  id: 1,
  title: "Pendulum Motion",
  subject: "Physics",
  gradeLevel: "High",
  difficulty: "Intermediate",
  type: "Simulation"
}
```

**Rationale:** Covers all four filter dimensions with varied combinations for meaningful filtering demos.

### 4. Card Rendering

**Decision:** Fixed-size cards in a responsive grid
- Card dimensions: 140px × 70px
- Show title, subject icon, and classification badges
- Fade opacity for non-matching cards (alpha: 60)
- Full opacity for matching cards (alpha: 255)

**Borrowed from:** Classification Matrix template's card rendering approach

### 5. Filtering Logic

**Decision:** Real-time AND logic across all dimensions
```javascript
function matchesFilters(item) {
  let matchSubject = subjectFilter === 'All' || item.subject === subjectFilter;
  let matchGrade = gradeLevelFilters.length === 0 || gradeLevelFilters.includes(item.gradeLevel);
  let matchDiff = difficultyFilter === 'All' || item.difficulty === difficultyFilter;
  let matchType = typeFilters.length === 0 || typeFilters.includes(item.type);
  return matchSubject && matchGrade && matchDiff && matchType;
}
```

**Rationale:** Standard faceted search behavior where all selected filters must match.

### 6. Active Filter Badges

**Decision:** Display colored badges in right panel showing active filters
- Each badge shows filter value with category color
- Count updates in real-time

**Rationale:** Provides visual feedback of current filter state.

### 7. Animation

**Decision:** Smooth fade transitions on filter changes
- Use lerp for opacity transitions
- Target opacity based on match status

**Rationale:** Matches specification's "Smooth fade animations on filter changes"

## Implementation Notes

### From Classification Matrix Template:
- Card rendering with rounded corners
- Responsive layout with updateCanvasSize()
- Region-based drawing organization

### Custom Additions:
- Multi-select checkboxes for Grade Level and Type
- Radio buttons for Difficulty
- Dropdown for Subject
- Active filter badge display
- Match count display
- Fade animation for non-matching cards

## Files to Create

1. `main.html` - Container page with p5.js include
2. `faceted-classification.js` - Main p5.js sketch
3. `index.md` - Documentation with lesson plan
4. `metadata.json` - MicroSim metadata

## Testing Checklist

- [x] All 20 sample MicroSims displayed
- [x] Subject dropdown filters correctly
- [x] Grade Level checkboxes filter correctly (multi-select)
- [x] Difficulty radio buttons filter correctly (single-select)
- [x] Type checkboxes filter correctly (multi-select)
- [x] Clear All button resets all filters
- [x] Match count updates in real-time
- [x] Active filter badges display correctly
- [x] Cards fade smoothly when filtered out
- [x] Responsive layout works at different widths

## Implementation Summary

### Files Created

| File | Purpose | Size |
|------|---------|------|
| `docs/sims/faceted-classification/main.html` | HTML container | 0.5 KB |
| `docs/sims/faceted-classification/faceted-classification.js` | Main visualization | 12 KB |
| `docs/sims/faceted-classification/index.md` | Documentation | 4 KB |
| `docs/sims/faceted-classification/metadata.json` | Dublin Core metadata | 1.2 KB |

### Key Implementation Details

**Canvas Dimensions:**
- `drawHeight`: 500px
- `controlHeight`: 0px (controls in left panel)
- `canvasHeight`: 500px
- `iframeHeight`: 502px

**Layout:**
- Left panel: 200px (filter controls)
- Right panel: 180px (results summary)
- Center panel: Remaining width (card grid)

**Card Design:**
- Dimensions: 130px × 65px
- Color-coded header bar by subject
- Type icon in header
- Title with truncation
- Grade level and difficulty badges

**Filter Controls:**
- Subject: `createSelect()` dropdown
- Grade Level: 4 × `createCheckbox()` (multi-select)
- Difficulty: `createRadio()` group (single-select)
- Type: 4 × `createCheckbox()` (multi-select)

**Animation:**
- Fade opacity using `lerp()` with factor 0.15
- Target opacity: 255 (matching) or 60 (non-matching)

### Patterns Borrowed from Templates

| Pattern | Source Template | Implementation |
|---------|----------------|----------------|
| Card rendering | Classification Matrix | Rounded rectangles with shadow |
| Responsive layout | p5.js Architecture | updateCanvasSize() pattern |
| Panel-based UI | Multiple templates | Three-panel division |

### Unique Additions

1. **Multi-select checkboxes**: Grade Level, Difficulty, and Type all support multiple selections
2. **Active filter badges**: Visual display of current filter state
3. **Real-time match count**: Large number display in right panel
4. **Smooth fade animation**: lerp-based opacity transitions

## Revisions

### 2026-01-25: Difficulty changed to checkboxes
Changed Difficulty filter from radio buttons (single-select) to checkboxes (multi-select) to match the other filter controls.

### 2026-01-25: Section labels styled blue
Changed section labels (Subject, Grade Level, Difficulty, Type) from gray to blue with larger font size (14px) so they stand out more from the checkbox labels and provide clearer visual hierarchy in the left panel.
