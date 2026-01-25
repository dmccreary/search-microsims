# Creative Commons License Chooser - Design Decisions

## Overview

This document logs the design decisions made while creating the CC License Chooser MicroSim based on the specification from Chapter 4 of the Dublin Core Elements book.

## Template Search Results

Ran `find-similar-templates.py` with the specification and received the following top 10 matches:

| Rank | Template | Score | Semantic | Pedagogical | Key Features |
|------|----------|-------|----------|-------------|--------------|
| 1 | Icons Demo | 0.6855 | 0.5558 | 0.88 | CC license icons, click detection |
| 2 | MicroSim Readiness Assessment | 0.6641 | 0.5202 | 0.88 | Decision tree flowchart, node interactions |
| 3 | Accessibility Audit Workflow | 0.6372 | 0.5053 | 0.835 | Interactive flowchart |
| 4 | Standardization Workflow | 0.6301 | 0.4635 | 0.88 | Flowchart evaluation process |
| 5 | Corporate Learning Module | 0.6263 | 0.4571 | 0.88 | Learner journey flowchart |
| 6 | RCL Draw Test | 0.6223 | 0.4504 | 0.88 | Component drawing functions |
| 7 | Spec Quality Checklist | 0.6219 | 0.4799 | 0.835 | Checkbox interactions, progress tracking |
| 8 | Classification Matrix | 0.6200 | 0.4767 | 0.835 | 2x2 decision matrix |
| 9 | Portfolio Components | 0.6195 | 0.4458 | 0.88 | Hub-and-spoke diagram |
| 10 | Success Criteria Workflow | 0.6184 | 0.4973 | 0.80 | Validation flowchart |

## Templates Selected for Analysis

### 1. Icons Demo (Score: 0.6855)
**Source:** `microsims/docs/sims/icons/icons.js`

**Features extracted:**
- Width-responsive canvas setup pattern with `updateCanvasSize()`
- Drawing region + control region split layout
- Standard MicroSim color scheme (aliceblue background)
- Click detection using distance calculation: `dist(mouseX, mouseY, iconX, iconY)`

**Used in CC License Chooser:**
- Canvas structure with drawing/control regions
- Responsive resize handling
- Basic visual styling

### 2. MicroSim Readiness Assessment (Score: 0.6641)
**Source:** `automating-instructional-design/docs/sims/sim-readiness/sim-readiness.js`

**Features extracted:**
- Decision tree flowchart with multiple node types (start, decision, result)
- Different shapes for different node types (rectangle, diamond, rounded rectangle)
- Connection drawing with bezier curves and arrowheads
- Yes/No path coloring (green/red)
- Info panel that appears on node click/hover
- Hit detection for diamond shapes and rectangles

**Used in CC License Chooser:**
- Decision flowchart visualization concept
- Yes/No path highlighting
- Color scheme for decision outcomes
- Curved connection lines between nodes

### 3. Spec Quality Checklist (Score: 0.6219)
**Source:** `automating-instructional-design/docs/sims/spec-quality-checklist/spec-quality-checklist.js`

**Features extracted:**
- Radio button / checkbox-style interactions in p5.js
- Mouse hover detection for form elements
- Progress/completion visualization
- Reset button functionality
- Category-based organization
- Visual feedback on selection state

**Used in CC License Chooser:**
- Radio button implementation for Yes/No choices
- Hover states for interactive elements
- Reset button
- Selection state management

## Design Decisions

### 1. Layout (Three-Panel Design)

**Decision:** Implement a three-panel layout:
- Left panel (300px): Decision questions with radio buttons
- Center panel (250px): Flowchart visualization showing the decision path
- Right panel (200px): Result card with license recommendation

**Rationale:** The specification calls for this layout. It provides clear separation between input (questions), process (flowchart), and output (recommendation).

### 2. Interaction Model

**Decision:** Use radio buttons for binary Yes/No questions instead of standard HTML form elements.

**Rationale:**
- p5.js custom-drawn radio buttons provide consistent styling
- Better integration with the flowchart animation
- Templates showed checkbox/button interactions can be cleanly implemented in p5.js

### 3. Flowchart Visualization

**Decision:** Show a simplified decision tree that highlights the path taken based on user selections.

**Rationale:**
- Based on the MicroSim Readiness Assessment pattern
- Provides immediate visual feedback as user makes choices
- Helps students understand the license selection logic

### 4. License Icons

**Decision:** Display Creative Commons license component icons (CC, BY, NC, SA, ND) using Unicode symbols and styled shapes.

**Rationale:**
- The Icons Demo template shows CC icons can be effectively rendered
- Visual icons help students recognize license components
- More engaging than text-only representation

### 5. Result Display

**Decision:** Show:
- Large license badge
- Plain English summary ("Others can...")
- Copy-paste JSON snippet for metadata

**Rationale:** Direct from specification. Practical output that students can immediately use.

### 6. Color Scheme

**Decision:** Use the following color scheme:
- Primary blue (#1976D2): Questions panel header
- Green (#4CAF50): "Yes" paths and CC0/permissive outcomes
- Orange (#FF9800): Decision nodes
- Red (#F44336): "No" paths and restrictive elements
- Purple (#9C27B0): Result panel

**Rationale:**
- Consistent with template color schemes
- Green/red for yes/no is intuitive
- Distinct colors help identify different sections

### 7. Animation

**Decision:** Animate flowchart path highlighting as user makes selections.

**Rationale:**
- Specification requests "As user answers questions, flowchart path highlights"
- Provides immediate feedback
- Helps students trace their decision path

### 8. "Maximum Freedom" Preset

**Decision:** Include a single button that immediately selects CC0 and shows the result.

**Rationale:**
- Direct from specification
- Provides a quick path for users who want the most permissive option
- Educational - shows what "maximum freedom" means in licensing terms

## Files Created

1. `docs/sims/cc-license-chooser/index.md` - Documentation page
2. `docs/sims/cc-license-chooser/main.html` - HTML container
3. `docs/sims/cc-license-chooser/cc-license-chooser.js` - Main p5.js code
4. `docs/sims/cc-license-chooser/metadata.json` - MicroSim metadata

## Implementation Notes

### Key Code Patterns from Templates

```javascript
// From Icons Demo - Responsive canvas setup
function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}

// From Readiness Assessment - Node drawing with different types
function drawNode(node) {
  if (node.type === 'decision') {
    // Diamond shape
    beginShape();
    vertex(0, -s);
    vertex(s, 0);
    vertex(0, s);
    vertex(-s, 0);
    endShape(CLOSE);
  }
}

// From Spec Quality Checklist - Radio button click detection
if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
  // Toggle selection
}
```

### Decision Logic Implementation

```javascript
const licenseLogic = {
  // Commercial: Yes + Modifications: Yes → CC BY
  'commercial-yes,modifications-yes': 'CC BY',
  // Commercial: Yes + Modifications: ShareAlike → CC BY-SA
  'commercial-yes,modifications-sharealike': 'CC BY-SA',
  // Commercial: No + Modifications: Yes → CC BY-NC
  'commercial-no,modifications-yes': 'CC BY-NC',
  // Commercial: No + Modifications: ShareAlike → CC BY-NC-SA
  'commercial-no,modifications-sharealike': 'CC BY-NC-SA',
  // Commercial: No + Modifications: No → CC BY-NC-ND
  'commercial-no,modifications-no': 'CC BY-NC-ND',
  // Maximum freedom → CC0
  'maximum-freedom': 'CC0'
};
```

## Files Created

| File | Purpose |
|------|---------|
| `docs/sims/cc-license-chooser/main.html` | HTML container |
| `docs/sims/cc-license-chooser/cc-license-chooser.js` | Main p5.js code (~600 lines) |
| `docs/sims/cc-license-chooser/index.md` | Documentation page |
| `docs/sims/cc-license-chooser/metadata.json` | MicroSim metadata |
| `logs/creative-commons-license-chooser/spec.txt` | Original specification |
| `logs/creative-commons-license-chooser/design-decisions.md` | This file |

## Implementation Summary

### Key Features Implemented

1. **Three-Panel Layout:**
   - Left panel: Two questions with radio buttons (commercial use, modifications)
   - Center panel: Decision flowchart with animated path highlighting
   - Right panel: License recommendation with badge, summary, and JSON

2. **Interactive Elements:**
   - Radio buttons for Yes/No/ShareAlike choices
   - "Maximum Freedom (CC0)" quick-select button
   - Reset button
   - Clickable license URL

3. **Visual Feedback:**
   - Flowchart path highlights as user makes selections
   - Color-coded connections (green=yes, red=no, orange=sharealike)
   - License badges with CC component icons

4. **All 7 License Types:**
   - CC0 (Public Domain)
   - CC BY (Attribution)
   - CC BY-SA (Attribution-ShareAlike)
   - CC BY-ND (Attribution-NoDerivatives) - Added post-implementation
   - CC BY-NC (Attribution-NonCommercial)
   - CC BY-NC-SA (Attribution-NonCommercial-ShareAlike)
   - CC BY-NC-ND (Attribution-NonCommercial-NoDerivatives)

## Testing Checklist

- [x] Radio buttons respond to clicks
- [x] Flowchart updates as selections are made
- [x] Correct license is recommended for each combination
- [x] "Maximum Freedom" button presets to CC0
- [x] Reset clears all selections
- [x] JSON snippet is correct for each license
- [x] Responsive to window resize
- [x] Hover states work for all interactive elements

## Post-Implementation Notes

The MicroSim successfully combines patterns from three templates:
- **Icons Demo**: Responsive canvas setup, click detection
- **MicroSim Readiness Assessment**: Flowchart with nodes, connections, and highlighting
- **Spec Quality Checklist**: Radio button/checkbox interactions and state management

Total code size: ~600 lines of JavaScript, implementing all specification requirements.
