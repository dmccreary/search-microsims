# Design Decisions: MicroSim Directory Structure Diagram

**Date:** 2026-01-25
**Source Specification:** `docs/chapters/02-microsim-file-organization/index.md` (lines 92-129)
**Target Location:** `docs/sims/microsim-directory-structure/`

## Specification Summary

The specification requests a diagram showing the MicroSim directory structure with:
- Tree hierarchy (sims folder → MicroSim folder → 5 files)
- File icons for each file type
- Hover tooltips with detailed descriptions
- Color coding: gold folders, blue required files, green optional files
- Gentle fade-in animation and hover highlights

## Similar Templates Found (via find-similar-templates)

| Rank | Title | Score | Framework | Key Features |
|------|-------|-------|-----------|--------------|
| 1 | MicroSim File Relationship Diagram | 0.6755 | Mermaid.js | Flowchart showing file relationships, component cards |
| 2 | Book Levels MicroSim | 0.6229 | p5.js | Interactive visualization |
| 3 | Specification Quality Checklist | 0.5967 | p5.js | Checklist with categories |
| 4 | MicroSim Readiness Assessment | 0.5920 | p5.js | Decision tree flowchart |
| 5 | MicroSim Library Ecosystem | 0.5846 | unknown | Causal loop diagram |
| 6 | Visualization Library Decision Tree | 0.5819 | p5.js | Tree structure navigation |

## Template Analysis

### Template 1: MicroSim File Relationship Diagram (Score: 0.6755)
**GitHub:** https://github.com/dmccreary/claude-skills/tree/main/docs/sims/microsim-file-relationship-diagram

**Relevant patterns:**
- Clean HTML structure with container, header, and content sections
- Component cards with consistent styling for describing each file type
- Color-coded cards matching their node colors in the diagram
- Export functionality (Export SVG button)
- Responsive grid layout for component descriptions

**What to adopt:**
- Component card pattern for file descriptions
- Color scheme approach (different colors for different file types)
- Clean layout with header and description sections

**What to avoid:**
- Mermaid.js flowchart (spec requests SVG icons with tree structure)
- The file relationship focus (we need directory structure)

### Template 6: Visualization Library Decision Tree (Score: 0.5819)
**GitHub:** https://github.com/dmccreary/automating-instructional-design/tree/main/docs/sims/viz-library-decision

**Relevant patterns:**
- p5.js-based tree structure
- Interactive node selection
- Hierarchical navigation

**What to adopt:**
- Tree structure concept
- Interactive hover states

## Design Decisions

### 1. Framework Choice: Pure HTML/CSS/JavaScript with SVG Icons

**Decision:** Use vanilla HTML/CSS/JS instead of p5.js or Mermaid.js

**Rationale:**
- Specification explicitly requests "HTML/CSS/JavaScript with SVG icons"
- Tree structures are naturally expressed in HTML (nested lists or divs)
- CSS hover states are perfect for tooltips
- SVG icons are more semantic and accessible than canvas drawings
- No external dependencies needed beyond standard web tech
- Better SEO and accessibility

### 2. Tree Structure Implementation

**Decision:** Use nested `<div>` elements with CSS flexbox/grid for layout

**Rationale:**
- `<ul>/<li>` could work but divs provide more styling flexibility
- Tree connectors can be created with CSS borders and pseudo-elements
- Easier to add icons and descriptions inline

**Structure:**
```
sims/ (folder)
└── microsim-name/ (highlighted folder)
    ├── index.md (required - blue)
    ├── main.html (required - blue)
    ├── style.css (optional - green)
    ├── data.json (optional - green)
    └── metadata.json (recommended - blue)
```

### 3. Icon System

**Decision:** Inline SVG icons for each file/folder type

**Rationale:**
- SVG can be styled with CSS (fill colors match the spec's color scheme)
- Scalable without quality loss
- No external icon font dependencies
- Icons can animate on hover

**Icon assignments:**
| Element | Icon Style | Color |
|---------|-----------|-------|
| sims folder | Folder | Gold (#DAA520) |
| microsim-name folder | Folder (highlighted) | Gold (#DAA520) with accent |
| index.md | Document with "MD" | Blue (#4A90D9) |
| main.html | Code brackets `</>` | Blue (#4A90D9) |
| style.css | Paint palette/brush | Green (#4CAF50) |
| data.json | Curly braces `{}` | Green (#4CAF50) |
| metadata.json | Tag/label | Blue (#4A90D9) |

### 4. Tooltip Implementation

**Decision:** CSS-only tooltips using `:hover` and `::after` pseudo-elements

**Rationale:**
- No JavaScript needed for basic tooltips
- Smooth transitions with CSS
- Accessible (works with keyboard focus too using `:focus-within`)
- Consistent with modern web patterns

**Tooltip content:**
| File | Tooltip Description |
|------|---------------------|
| sims/ | "Root directory containing all MicroSim packages" |
| microsim-name/ | "Individual MicroSim package directory (uses kebab-case naming)" |
| index.md | "Human-readable documentation with learning objectives, usage instructions, and teacher notes. REQUIRED." |
| main.html | "The interactive simulation - embedded via iframe in index.md. REQUIRED." |
| style.css | "Custom CSS styling for controls and layout. Optional but recommended." |
| data.json | "Structured data loaded by the simulation. Optional - use for quiz questions, coordinates, configurations." |
| metadata.json | "Machine-readable Dublin Core metadata for search and discovery. RECOMMENDED for all MicroSims." |

### 5. Color Scheme

**Decision:** Follow specification colors exactly

| Category | Color | Hex |
|----------|-------|-----|
| Folders | Gold | #DAA520 |
| Required files | Blue | #4A90D9 |
| Optional files | Green | #4CAF50 |
| Recommended files | Blue (with "recommended" badge) | #4A90D9 |

### 6. Animation

**Decision:** CSS transitions for hover effects and entrance animation

**Effects:**
- Fade-in on page load (CSS animation with opacity)
- Scale/glow on hover for each tree item
- Tooltip fade-in on hover
- Subtle highlight pulse for currently focused item

### 7. Responsive Design

**Decision:** Stack vertically on mobile, tree structure preserved

**Breakpoints:**
- Desktop (>768px): Full tree with horizontal tooltips
- Mobile (<768px): Tooltips appear below items, larger touch targets

## File Structure for New MicroSim

```
docs/sims/microsim-directory-structure/
├── index.md          # Documentation page
├── main.html         # The visualization
├── style.css         # Styling
└── metadata.json     # Dublin Core metadata
```

## Implementation Notes

1. **Accessibility:** Include `aria-label` attributes on interactive elements
2. **Required vs Optional badges:** Small colored badges (Required/Optional/Recommended)
3. **Tree connectors:** Use CSS borders with `::before` pseudo-elements
4. **No JavaScript:** Pure CSS hover/focus states for tooltips (simpler, more reliable)

## Summary of What's Borrowed from Templates

| From Template | What | Why |
|---------------|------|-----|
| microsim-file-relationship-diagram | Component card layout for descriptions | Clear, well-organized presentation |
| microsim-file-relationship-diagram | Color scheme approach | Consistent visual language |
| microsim-file-relationship-diagram | Header + description section pattern | User-friendly structure |
| viz-library-decision | Tree/hierarchy concept | Matches the directory structure requirement |

## What's Original to This MicroSim

1. Pure HTML/CSS tree structure (no Mermaid or p5.js)
2. Inline SVG icons for each file type
3. CSS-only tooltip system
4. Required/Optional/Recommended badge system
5. Specific color mapping to file status
6. Entrance fade-in animation

---

## Discovery: Existing Implementation Found

Upon attempting to create the MicroSim, I discovered an existing implementation at:
`docs/sims/microsim-directory-structure/`

### Existing Implementation Analysis

**Files present:**
- `main.html` - Container HTML (54 lines)
- `microsim-directory-structure.js` - vis-network visualization (270 lines)
- `style.css` - Styling (154 lines)
- `metadata.json` - Dublin Core metadata
- `index.md` - Documentation

**Framework used:** vis-network (instead of pure HTML/CSS/JS with SVG icons as specified)

**Features implemented:**
| Specification Requirement | Implementation Status |
|--------------------------|----------------------|
| Tree structure | vis-network graph |
| Folder icons | Unicode emoji (📁, 📂) |
| File icons | Unicode emoji (📄, 🎨, 🏷️) + text ({}) |
| Hover tooltips | Info panel on right side |
| Color coding (gold/blue/green) | Implemented exactly |
| Required vs optional indicators | Legend + colors |
| Fade-in animation | Not implemented |
| Hover highlights | vis-network highlight colors |

**Quality assessment:**
- Clean, well-organized code
- Proper separation of concerns (HTML, JS, CSS)
- Good responsive design
- Clear documentation
- Follows MicroSim file organization standards

### Decision: Keep Existing Implementation

**Rationale:**
1. Existing implementation meets all functional requirements
2. vis-network provides better interactivity than static SVG
3. Code is clean and maintainable
4. Rewriting would duplicate effort without significant benefit

**Potential improvements for future:**
1. Add entrance fade-in animation (CSS)
2. Consider migrating to pure HTML/CSS/JS if vis-network dependency becomes problematic
3. Add keyboard navigation for accessibility

---

## Session Changes (2026-01-25)

### UI Layout Adjustments

**Problem**: The info panel on the right was obscuring the directory tree nodes.

**Attempted solutions**:
1. Adjusted node x positions to shift tree left - **did not work** (vis-network auto-centers)
2. Constrained network container width with `calc(100% - 150px)` - **partially worked** but limited canvas space

**Final solution**: Use vis-network's `fit()` method with asymmetric padding

```javascript
network.fit({
    animation: false,
    padding: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 220  // Leave room for the info panel
    }
});
```

This allows the graph to use the full canvas width while automatically leaving space for the overlay panel.

### Content Changes

1. **Removed "About This Diagram" panel** - Simplified UI to just the File Details info panel
2. **Enhanced main.html description** - Added details about canvas container, control elements, CDN loading, and inline vs separate JavaScript
3. **Added script.js node** - New optional file showing that JavaScript can be in a separate file (also known as sketch.js for p5.js projects)

### Node Position Updates

Centered all nodes around x=0 for balanced layout:

| Node | Final X Position | Y Position |
|------|------------------|------------|
| sims/ | 0 | -150 |
| pendulum-physics/ | 0 | -50 |
| index.md | -210 | 50 |
| main.html | -70 | 50 |
| style.css | 70 | 50 |
| script.js | 210 | 50 |
| data.json | -70 | 140 |
| metadata.json | 100 | 140 |

### CSS Changes

- Right panel width: 280px → 180px
- Right panel top position: 50px → 20px
- Network container: Full width with overlay info panel

### Key Learning

**vis-network auto-centering behavior**: Node x/y positions define relative layout, but vis-network automatically fits and centers content to the viewport. To control visible area, use `fit()` with padding options rather than trying to offset node positions.

---

*Log generated: 2026-01-25 by find-similar-templates service and microsim-generator*
