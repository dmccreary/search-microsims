# Subject Hierarchy Taxonomy MicroSim Design Log

## Specification Extracted

From: `docs/chapters/04-dublin-core-elements/index.md` lines 141-196

```
Type: graph-model

Bloom Level: Understand (L2)
Bloom Verb: classify

Learning Objective: Students will classify subject terms at appropriate levels of specificity by exploring hierarchical relationships between broad disciplines and specific topics.

Purpose: Visualize how subject terms relate hierarchically, helping users choose appropriate specificity levels

Node types:
1. Discipline (large blue circles)
   - Properties: name, color
   - Examples: "Physics", "Mathematics", "Biology"

2. Domain (medium green circles)
   - Properties: name, parent
   - Examples: "Mechanics", "Algebra", "Ecology"

3. Topic (small orange circles)
   - Properties: name, parent, searchVolume
   - Examples: "Projectile Motion", "Quadratic Equations", "Food Webs"

Edge types:
1. CONTAINS (solid gray arrows)
   - Shows hierarchy from discipline to domain to topic
   - Direction: parent to child

Sample data tree:
- Physics (discipline)
  - Mechanics (domain)
    - Projectile Motion (topic)
    - Circular Motion (topic)
    - Newton's Laws (topic)
  - Waves (domain)
    - Sound Waves (topic)
    - Light Waves (topic)
    - Interference (topic)
  - Electricity (domain)
    - Circuits (topic)
    - Ohm's Law (topic)

Interactive features:
- Click node to expand/collapse children
- Hover to see definition and example usage
- Search box to find specific terms
- Highlight path shows breadcrumb trail
- Toggle between tree and radial layout

Layout: Hierarchical tree (default) with option for radial view
Color scheme: Blue for disciplines, green for domains, orange for topics
Animation: Smooth expansion/collapse with spring physics

Implementation: vis-network with hierarchical layout
```

## Template Search Results

Ran `find-similar-templates.py --file /tmp/subject-taxonomy-spec.txt --top 10`

### Top 10 Matches:

| Rank | Name | Combined | Semantic | Pedagogical | Framework |
|------|------|----------|----------|-------------|-----------|
| 1 | Learning Graph | 0.7541 | 0.6302 | 0.9400 | vis-network |
| 2 | Bloom's Taxonomy Pyramid | 0.7449 | 0.6149 | 0.9400 | p5.js |
| 3 | Learning is Nonlinear | 0.7404 | 0.6073 | 0.9400 | unknown |
| 4 | Chapter 03 Concept Map | 0.7378 | 0.6030 | 0.9400 | unknown |
| 5 | **Chapter 1 Concept Map** | 0.7360 | 0.6000 | 0.9400 | **vis-network** |
| 6 | Learning Graph Viewer (finance) | 0.7359 | 0.5999 | 0.9400 | unknown |
| 7 | **Learning Graph Viewer (linear-algebra)** | 0.7354 | 0.5989 | 0.9400 | **vis-network** |
| 8 | Equilibrium Classification Workflow | 0.7325 | 0.5942 | 0.9400 | unknown |
| 9 | Global Impact | 0.7303 | 0.5904 | 0.9400 | unknown |
| 10 | Learning Graph Viewer (AID) | 0.7289 | 0.5882 | 0.9400 | vis-network |

### Primary Templates Selected

Since the specification explicitly requires **vis-network with hierarchical layout**, I selected:

1. **Chapter 1 Concept Map** (automating-instructional-design) - Uses vis-network, has node info panel, color-coded categories
2. **Learning Graph Viewer** (linear-algebra) - Uses vis-network, has search box, category filtering, statistics

## Code Analysis from Templates

### From Chapter 1 Concept Map:
- **Node definitions** with category, position, size
- **Color scheme by category** - maps each category to background/border/font colors
- **Node descriptions** object for hover/click info
- **Click handler** showing node info panel
- **Toggle labels** functionality
- **Reset view** button

### From Learning Graph Viewer:
- **Search functionality** with live results dropdown
- **Category legend** with checkboxes for filtering
- **Statistics panel** showing visible nodes/edges
- **Groups configuration** for vis-network
- **Physics configuration** with forceAtlas2Based solver
- **Stabilization** handling to stop physics after layout settles

## Design Decisions

### 1. Data Structure
**Decision:** Use inline JavaScript data (like Chapter 1 Concept Map) rather than external JSON
**Rationale:** Simpler self-contained MicroSim, matches the template pattern, easier to customize

### 2. Layout Engine
**Decision:** vis-network hierarchical layout with direction: 'UD' (Up-Down)
**Rationale:** Specification requires tree layout; vis-network's hierarchical mode is perfect for parent-child relationships

### 3. Expand/Collapse Behavior
**Decision:** Custom implementation - hide/show child nodes on click
**Rationale:** Not directly in templates; need to track expanded state per node and filter visible nodes

### 4. Search Box
**Decision:** Adopt from Learning Graph Viewer template
**Rationale:** Has proven search with dropdown results, fits the spec requirement

### 5. Node Sizing by Level
**Decision:** Discipline (40px) > Domain (30px) > Topic (20px)
**Rationale:** Specification says "large blue circles", "medium green circles", "small orange circles"

### 6. Color Scheme
**Decision:**
- Discipline: `#2196F3` (blue) - from spec
- Domain: `#4CAF50` (green) - from spec
- Topic: `#FF9800` (orange) - from spec
**Rationale:** Directly matches specification

### 7. Layout Toggle (Tree vs Radial)
**Decision:** Add toggle button switching between:
- `layout.hierarchical.direction: 'UD'` (tree)
- `layout.hierarchical: false` + physics (radial/force-directed)
**Rationale:** Specification explicitly requests both views

### 8. Breadcrumb Trail
**Decision:** On node click/search, highlight path from root to selected node
**Rationale:** Specification requests "Highlight path shows breadcrumb trail"

### 9. Hover Tooltips
**Decision:** Use vis-network's built-in title property for hover text
**Rationale:** Simple, native behavior; matches "Hover to see definition"

## Files Generated

1. `docs/sims/subject-taxonomy-explorer/main.html` - Main HTML structure
2. `docs/sims/subject-taxonomy-explorer/style.css` - Styling
3. `docs/sims/subject-taxonomy-explorer/script.js` - vis-network logic
4. `docs/sims/subject-taxonomy-explorer/index.md` - Documentation page
5. `docs/sims/subject-taxonomy-explorer/metadata.json` - Dublin Core metadata

## Implementation Notes

### Template Code Adopted

**From Chapter 1 Concept Map:**
- Color scheme structure with background/border/font/highlight properties
- Node info panel HTML structure and styling
- Right panel layout with controls and status
- Legend styling with color indicators

**From Learning Graph Viewer:**
- Search input with dropdown results pattern
- Physics configuration for radial layout (forceAtlas2Based)
- Stabilization handling (disable physics after layout settles)
- Statistics/info panel structure

### Custom Implementations

**Expand/Collapse System:**
- `expandedNodes` Set tracks which nodes are expanded
- `getVisibleNodes()` calculates which nodes should be shown based on expanded state
- `refreshNetwork()` rebuilds DataSets when visibility changes
- Node labels show `[+]` or `[-]` indicators for expandable nodes

**Breadcrumb Trail:**
- `getAncestors()` walks up the parent chain
- `showBreadcrumb()` renders path with color-coded spans matching node types
- Separator arrows between path segments

**Layout Toggle:**
- `isHierarchical` boolean state
- Button toggles between hierarchical layout options and force-directed physics
- Full network reinitialization on toggle to apply new layout

### Data Structure

Used inline `taxonomyData` object with:
- `nodes[]` array with id, label, type, parent, description, example
- `edges[]` array built dynamically from parent relationships
- Three disciplines (Physics, Mathematics, Biology) with domains and topics

### Specification Compliance Checklist

| Requirement | Implementation |
|-------------|----------------|
| Click node to expand/collapse | `handleNodeClick()` toggles `expandedNodes` |
| Hover for definition | vis-network `title` property + custom info panel |
| Search box | Live search with dropdown, highlights path on select |
| Breadcrumb trail | `showBreadcrumb()` with color-coded path |
| Tree/Radial toggle | Layout button switches hierarchical/physics modes |
| Blue disciplines | `#2196F3` (40px circles) |
| Green domains | `#4CAF50` (30px circles) |
| Orange topics | `#FF9800` (22px circles) |
| vis-network hierarchical | `layout.hierarchical.direction: 'UD'` |

## Testing

Test locally at:
```
http://127.0.0.1:8000/search-microsims/sims/subject-taxonomy-explorer/
```

Verify:
- [ ] Hierarchy displays correctly on load (3 disciplines expanded)
- [ ] Click expands/collapses children
- [ ] Search finds nodes and highlights path
- [ ] Layout toggle switches between tree and radial
- [ ] Breadcrumb shows path for selected node
- [ ] Hover shows node info
- [ ] Responsive in iframe context

