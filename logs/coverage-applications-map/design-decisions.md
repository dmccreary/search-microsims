# Coverage Applications Map - Design Decisions Log

## Date: 2026-01-25

## Specification Summary

- **Type**: Map (Leaflet.js with GeoJSON regions)
- **Bloom Level**: Analyze (L4)
- **Bloom Verb**: differentiate
- **Learning Objective**: Students will differentiate between global versus regional coverage needs by exploring how educational content may have geographic or jurisdictional constraints.

## Template Search Results

Ran `find-similar-templates.py` with the specification. Top 10 results:

| Rank | Template | Score | Semantic | Pedagogical | Framework |
|------|----------|-------|----------|-------------|-----------|
| 1 | ZPD Visualization | 0.6618 | 0.5297 | 0.86 | p5.js |
| 2 | Ed Tech Ecosystem | 0.6338 | 0.5097 | 0.82 | vis-network |
| 3 | **Major World Cities** | 0.6331 | 0.5885 | 0.70 | Leaflet |
| 4 | Sierpinski Triangles | 0.6321 | 0.4802 | 0.86 | unknown |
| 5 | Translation Explorer | 0.6294 | 0.4756 | 0.86 | unknown |
| 6 | p5 Coordinate System | 0.6243 | 0.4971 | 0.815 | unknown |
| 7 | Book Levels | 0.6192 | 0.4587 | 0.86 | unknown |
| 8 | Color Wheel | 0.6187 | 0.4845 | 0.82 | unknown |
| 9 | Spatial Viz Types | 0.6177 | 0.5129 | 0.775 | p5.js |
| 10 | Flex Layout Playground | 0.6173 | 0.4855 | 0.815 | unknown |

## Template Selection Decision

### Primary Template: Major World Cities (Rank #3)

**Rationale:**
- Only Leaflet.js template in the results - exact framework match for specification
- Highest semantic score (0.5885) among geographic visualizations
- Already implements map initialization, tile layers, and popup handling
- Uses OpenStreetMap tiles with attribution
- Responsive design optimized for iframe embedding in MkDocs

**Why not higher-ranked templates:**
- ZPD Visualization (#1): Uses p5.js, not Leaflet. Would require complete rewrite.
- Ed Tech Ecosystem (#2): Uses vis-network for graphs, not geographic maps.

### Code Elements to Reuse from Major World Cities:

1. **HTML Structure** (`main.html`):
   - DOCTYPE and meta viewport settings
   - Leaflet CSS/JS CDN includes with integrity hashes
   - Container layout with title/subtitle
   - Map div with fixed height requirement
   - External script/style references

2. **CSS** (`style.css`):
   - iframe-optimized body margins (margin: 0, padding: 0)
   - Container styling with aliceblue background
   - Map container fixed height (400px)
   - Leaflet popup customization styles
   - Responsive breakpoints for mobile

3. **JavaScript** (`script.js`):
   - Map configuration object pattern
   - L.map initialization with zoom controls
   - L.tileLayer with OpenStreetMap
   - Popup content generation pattern

## Required Modifications

### New Features Not in Template:

1. **GeoJSON Region Polygons** (specification: "Leaflet.js with GeoJSON regions")
   - Template uses point markers; need polygon layers instead
   - Will use simplified GeoJSON for 5 major regions
   - Each region needs distinct styling

2. **Region Data Structure**:
   ```javascript
   regions = {
     "United States": { color: "blue", coverage: ["Common Core Math", "NGSS Science", "US History to 1877"] },
     "European Union": { color: "green", coverage: ["Bologna Process standards"] },
     "United Kingdom": { color: "purple", coverage: ["Key Stage 3-4", "GCSE Physics specification"] },
     "Asia-Pacific": { color: "orange", coverage: ["Various national curricula"] },
     "Latin America": { color: "teal", coverage: ["Regional educational standards"] }
   }
   ```

3. **Info Panel** (specification: "Examples panel shows MicroSims relevant to selected region")
   - Add right-side panel showing coverage examples
   - Update on region click

4. **View Toggle** (specification: "Toggle between Geographic and Temporal views")
   - Geographic: Shows regional education standards
   - Temporal: Shows time periods (Classical, Medieval, Modern, etc.)

5. **Global Option** (specification: "Global: Universal physics principles, math concepts")
   - Add "Global/Universal" toggle or indicator

## GeoJSON Strategy

Using simplified bounding boxes for regions rather than detailed country borders:
- Keeps file size small
- Loads quickly
- Sufficient for pedagogical purpose (illustrating coverage concept)

Alternative considered: Natural Earth country boundaries
- Rejected: Too complex, large file size, overkill for concept demonstration

## Color Scheme

Per specification:
- United States: `#3b82f6` (blue)
- European Union: `#22c55e` (green)
- United Kingdom: `#a855f7` (purple)
- Asia-Pacific: `#f97316` (orange)
- Latin America: `#14b8a6` (teal)
- Unselected: `#9ca3af` (gray)

## Pacing Pattern

Template match (Major World Cities): `self-paced`, `assessment`
Specification requirement: `Analyze (L4)`, `differentiate`

The exploration pattern with click-to-reveal details aligns well with the "differentiate" verb - students must actively compare regions to understand coverage differences.

## Files to Generate

1. `docs/sims/coverage-world-map/main.html` - Main HTML
2. `docs/sims/coverage-world-map/script.js` - JavaScript with map logic
3. `docs/sims/coverage-world-map/style.css` - Styles
4. `docs/sims/coverage-world-map/index.md` - Documentation
5. `docs/sims/coverage-world-map/metadata.json` - MicroSim metadata

## Implementation Notes

- The iframe in chapter 4 references `../../sims/coverage-world-map/main.html`
- Height is 450px per the iframe specification
- Need to ensure info panel fits within this height constraint

---

## Final Implementation (2026-01-25)

### Files Created

| File | Lines | Description |
|------|-------|-------------|
| main.html | 73 | Leaflet CDN, container with map + side panel, controls, legend |
| style.css | 215 | iframe-optimized layout, info panel styling, responsive breakpoints |
| script.js | 308 | Map init, GeoJSON regions, view toggle, info panel updates |
| index.md | 97 | Documentation with lesson plan and references |
| metadata.json | 56 | Dublin Core + pedagogical metadata |

### Key Implementation Decisions

1. **Side Panel Instead of Popups**: Used a fixed info panel (right side) instead of Leaflet popups for better UX when comparing regions. This supports the "differentiate" learning objective.

2. **Simplified GeoJSON**: Created inline bounding-box polygons instead of loading external country boundaries. Rationale:
   - Faster loading (no external fetch)
   - Sufficient for pedagogical purpose
   - Smaller file size

3. **CartoDB Light Tiles**: Chose `cartocdn.com/light_all` instead of OpenStreetMap standard tiles for cleaner visual presentation with colored regions.

4. **Three-View Toggle**: Implemented Geographic, Temporal, and Global views to cover all aspects of the Coverage element.

5. **Flexbox Layout**: Used `display: flex` for main-content to position map and info panel side-by-side, with responsive fallback to vertical stacking.

### Deviations from Specification

| Specification | Implementation | Rationale |
|---------------|----------------|-----------|
| "Search for curriculum standards" | Not implemented | Overkill for concept demonstration; click-to-explore sufficient |
| "Examples panel shows MicroSims relevant to selected region" | Simplified to static example list | Dynamic lookup would require additional data infrastructure |

### Template Reuse Summary

From **Major World Cities** template:
- Leaflet CDN includes with integrity hashes
- Basic map initialization pattern
- OpenStreetMap attribution pattern

From **map-guide.md** templates:
- CSS structure with info panel, legend, responsive styles
- JavaScript patterns for GeoJSON, hover, click handlers

**Novel code** (not from templates):
- Region data structure with coverage arrays
- Three-view toggle system
- Temporal data integration
- Side panel update logic

---

## Post-Implementation Fix (2026-01-25)

### Issue: UK Region Not Clickable

**Problem**: The UK polygon was rendered underneath the EU polygon, making it impossible to click on Great Britain. The EU bounding box (-10 to 30 longitude) completely covered the UK region (-8 to 2 longitude).

**Solution**: Two changes to the GeoJSON:

1. **Reordered features** so UK is listed last in the array (Leaflet renders features in order, so last = on top)

2. **Reshaped EU polygon** to an L-shape that goes around the UK:
   - West portion: -10 to 3 longitude, 35 to 48 latitude (Spain, Portugal, France)
   - East portion: 3 to 40 longitude, 48 to 60 latitude (Germany, Italy, Eastern Europe)

3. **Expanded UK polygon**: -11 to 3 longitude, 49 to 61 latitude (includes all of British Isles)

**Result**: UK is now fully clickable and visually distinct from EU.

---

## User Feedback

User was **very happy** with the overall design. Only a single fix required (the UK/EU overlap issue). The template selection, layout decisions, and implementation approach all worked well on first iteration.
