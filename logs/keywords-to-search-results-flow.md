# Keywords to Search Results Flow MicroSim - Design Decisions Log

## Date: 2025-01-25

---

## Instructional Design Review (v2 Redesign)

### Critique of Animation-Based Approach (v1)

The initial implementation used animated data packets flowing between stages. Upon review from an instructional design perspective, this approach had significant weaknesses:

| Issue | Problem |
|-------|---------|
| **Extraneous cognitive load** | Learners watch moving dots while trying to read hover tooltips |
| **No data visibility** | Shows *that* data flows, but not *what* the data looks like at each stage |
| **No cause-effect connection** | Generic animation doesn't connect specific query to specific results |
| **Doesn't support prediction** | Continuous flow prevents predict-test-observe pedagogy |
| **Redundant with arrows** | Static arrows already show flow direction; animation adds no conceptual value |

### Key Question Raised

> "What is the instructional purpose of the animation if arrows will work to show the flow of information?"

**Answer:** The animation added visual appeal but not instructional value. For Bloom's Understand level with verb "explain," learners need to see concrete data transformations, not abstract particle effects.

### Instructional Design Principles Applied (v2)

1. **Worked Example Pedagogy**: Show concrete transformations of real queries
2. **Self-Paced Learning**: Next/Previous buttons instead of continuous animation
3. **Predict-Test-Observe**: Learners can predict the next transformation before clicking
4. **Reduce Extraneous Load**: Remove animation, focus on content
5. **Concrete Examples**: Dropdown with 4 pre-built example queries
6. **Progressive Disclosure**: One stage at a time with full data visibility

### v2 Design Decisions

**Interaction Model:**
- Dropdown to select from 4 example queries
- Next/Previous buttons to step through 5 stages
- Current stage highlighted, others dimmed
- Large data display panel showing exact transformation at each stage

**Example Queries Selected:**
1. "physics ball throwing simulation" - demonstrates synonym expansion
2. "interactive graph visualization" - shows partial matching
3. "pendulum motion for kids" - demonstrates grade-level considerations
4. "sorting algorithm animation" - shows exact vs. partial matches

**Data Shown at Each Stage:**
| Stage | Data Displayed |
|-------|----------------|
| User Query | Raw query string as entered |
| Processing | Tokens array, normalized forms, expanded synonyms |
| Matching | Candidate MicroSims with match counts per term |
| Ranking | Scoring breakdown (exact: +10, partial: +5, synonym: +3) |
| Results | Final ordered list with scores and matched keywords highlighted |

**Visual Design:**
- Static arrows between stages (no animation)
- Current stage: full color with border
- Other stages: muted/grayed
- Data panel: monospace font for arrays/code, clear labels

---

## Specification Summary

**Type:** Workflow diagram
**Bloom Level:** Understand (L2)
**Bloom Verb:** explain
**Learning Objective:** Students will explain how keywords in metadata connect user search queries to relevant MicroSim results through matching and ranking processes.

## Similar Template Search Results

Ran `find-similar-templates.py` to find relevant existing MicroSims. Top matches:

| Rank | Template | Score | Framework | Key Features |
|------|----------|-------|-----------|--------------|
| 1 | Bloom's Taxonomy MicroSim Types | 0.6283 | p5.js | Interactive pyramid infographic |
| 2 | MicroSim Types by Bloom's Taxonomy | 0.6199 | unknown | Interactive infographic |
| 3 | Visualization Library Decision Tree | 0.6166 | p5.js | Decision tree flowchart |
| 4 | Classification Matrix MicroSim | 0.6137 | unknown | 2x2 matrix drag-drop |
| 5 | Interaction Specification Template | 0.6053 | unknown | Three-part structure visualization |
| 6 | Think-Aloud Protocol | 0.5925 | p5.js | Interactive flowchart with phases |
| 7 | Visual Description Checklist | 0.5894 | p5.js | Interactive checklist |
| **8** | **xAPI Data Flow** | **0.5867** | **p5.js** | **Animated data flow between components** |
| 9 | Prediction Prompt Interface | 0.5864 | unknown | 5-panel workflow |
| 10 | MicroSim Readiness Assessment | 0.5793 | p5.js | Decision tree flowchart |

## Template Selection Decision

### Primary Template: xAPI Data Flow

**Rationale:**
- Despite lower similarity score (0.5867), this template is the best structural match for our requirements
- Features animated data packets traveling between stages - exactly what we need for showing data flow
- Uses p5.js with proven patterns for:
  - Hover tooltips displaying detailed descriptions
  - Click functionality to spawn animated data packets
  - Arrow labels describing data transfer methods
  - Color-coded components by stage type
- Horizontal left-to-right flow matching our specification

**Key patterns to adapt from xAPI Data Flow:**
1. Stage boxes with rounded rectangles and icons
2. Animated particles flowing between stages
3. Hover detection for detailed information display
4. Color scheme: blue for user side, green for processing, orange for results

### Secondary Reference: Think-Aloud Protocol

**Rationale:**
- Interactive flowchart with color-coded phases
- Clickable nodes revealing detailed information
- Good reference for phase labeling and information hierarchy

## Implementation Decisions

### Framework Choice: HTML/CSS/JavaScript with p5.js

The specification says "HTML/CSS/JavaScript with animated flow visualization" - using p5.js gives us:
- Proven animation capabilities
- Easy hover detection
- Consistent with existing MicroSim patterns in the codebase

### Layout Structure

Following the specification's 5 stages (left to right):
1. **User Query** (blue) - Person icon with search box
2. **Query Processing** (green) - Gear icon, tokenization details
3. **Keyword Matching** (green) - Database icon with arrows
4. **Ranking** (orange) - Sorting icon with scoring factors
5. **Results** (orange) - List with thumbnails

### Interactive Features

From specification:
- Enter custom search query and see matching process
- Hover over each stage for detailed explanation
- Click to see sample data at each stage

### Animation Design

- Animated data packets flowing left to right (adapted from xAPI Data Flow)
- Subtle particle effects between stages
- Stage glow on hover

### Color Scheme

Following specification:
- Blue: User side (stages 1)
- Green: Processing (stages 2-3)
- Orange: Results (stages 4-5)

## Files Created

1. `docs/sims/keyword-search-flow/index.md` - MicroSim page with iframe and lesson plan
2. `docs/sims/keyword-search-flow/main.html` - HTML wrapper with p5.js 1.11.10
3. `docs/sims/keyword-search-flow/keyword-search-flow.js` - p5.js visualization (350+ lines)
4. `docs/sims/keyword-search-flow/metadata.json` - Dublin Core metadata

## Implementation Details

### Patterns Adapted from xAPI Data Flow Template

1. **Data Packet Animation System**
   - Continuous spawning of animated particles that flow left-to-right
   - Packets change color based on which stage they're passing through
   - Mouse-over-canvas control to pause/resume animation (saves CPU)
   - Click-to-spawn multiple packets for visual feedback

2. **Stage Box Design**
   - Rounded rectangles with stage-specific colors
   - Custom icons drawn with p5.js primitives (person, gear, database, sort, list)
   - Hover detection with shadow/glow effects
   - Labels and descriptions below each box

3. **Info Panel on Hover**
   - Right-side panel appears when hovering over any stage
   - Shows detailed information about the stage's processing
   - Semi-transparent white background with rounded corners

### Custom Additions for This MicroSim

1. **Search Input Control**
   - Text input field for entering custom search queries
   - Search button triggers packet burst animation

2. **Results Preview Panel**
   - Left-side mini panel showing sample search results
   - Color-coded score badges (green > 90%, yellow > 80%, red otherwise)
   - Demonstrates what the final output looks like

3. **Five-Stage Flow**
   - User Query (blue) - person icon
   - Query Processing (green) - gear icon
   - Keyword Matching (green) - database icon
   - Ranking (orange/yellow) - sort/bar icon
   - Results (red/orange) - list icon

### Layout Calculations

```
drawHeight = 400px
controlHeight = 80px (2 rows)
canvasHeight = 480px
iframeHeight = 482px (canvas + 2px border)
```

### Color Scheme (Following Specification)

- Blue (#4285F4): User side (Stage 1)
- Green (#34A853): Processing (Stages 2-3)
- Yellow/Orange (#FBBC04, #EA4335): Results (Stages 4-5)

---

## v2 Implementation Summary

### Files Updated

| File | Changes |
|------|---------|
| `keyword-search-flow.js` | Complete rewrite: 700 lines → step-through with 4 worked examples |
| `index.md` | Updated lesson plan, added instructional design notes, new iframe height |
| `main.html` | No changes |
| `metadata.json` | No changes |

### Canvas Dimensions (v2)

```
drawHeight = 500px (increased for data panel)
controlHeight = 50px (1 row: dropdown + buttons)
canvasHeight = 550px
iframeHeight = 552px
```

### Key Code Structures

**Example Query Data Structure:**
```javascript
{
  query: "physics ball throwing simulation",
  stages: [
    {
      title: "Stage 1: User Query",
      description: "...",
      data: {
        "Raw Query": '"physics ball throwing simulation"',
        "Intent": "Find interactive physics simulations..."
      }
    },
    // ... 4 more stages
  ]
}
```

**Visual Elements:**
- Stage indicator bar at top (5 boxes with arrows)
- Current stage highlighted, past stages dimmed, future stages grayed
- Large data panel showing stage-specific content
- Match results with colored badges
- Ranked results with numbered rank circles

### Instructional Improvements (v2 over v1)

| Aspect | v1 (Animation) | v2 (Step-Through) |
|--------|----------------|-------------------|
| Data visibility | Abstract particles | Concrete arrays and values |
| Pacing | Continuous, uncontrolled | Self-paced with buttons |
| Prediction | Not possible | Predict before clicking Next |
| Cognitive load | High (watch + read) | Low (read only) |
| Learning objective alignment | Weak | Strong |

### Lessons Learned

1. **Animation ≠ Engagement**: Visual motion captures attention but doesn't ensure learning
2. **Worked examples > abstraction**: Students learn better from concrete, complete examples
3. **Question the "wow factor"**: Ask "what does this animation teach?" before implementing
4. **Arrows are sufficient**: Static arrows communicate flow; animation is redundant
5. **Self-pacing supports prediction**: Continuous animation prevents predict-test-observe

---

## User Feedback

**Date:** 2025-01-25

The user reviewed the v2 step-through design and was **very pleased** with the result. The redesign successfully addressed the instructional design concerns raised during review.

---

## Post-Mortem: Why the First Design Failed

### Root Cause Analysis

The v1 animated design failed not because of implementation bugs, but because of **flawed assumptions in the design process itself**. Several factors contributed:

#### 1. Specification Bias Toward Visual Appeal

The original specification from `book-content-generator` included:
```
Animation: Data flows between stages with subtle particle effects
Visual style: Horizontal flow diagram with stages as rounded rectangles
```

This specification prioritized **visual aesthetics** over **instructional function**. It asked "what should this look like?" rather than "what should the learner be able to DO after using this?"

#### 2. Template Matching on Surface Features

The `find-similar-templates.py` script matched based on:
- Keywords like "flow", "diagram", "stages"
- Visualization type (animation, workflow)
- Framework (p5.js)

It did NOT match on:
- Bloom's taxonomy level alignment
- Pedagogical pattern (worked example vs. exploration vs. practice)
- What data transformations need to be visible

The xAPI Data Flow template was a poor pedagogical match despite being a good visual match.

#### 3. Missing Instructional Design Checkpoint

Neither skill asked the critical question:
> "For a Bloom's UNDERSTAND level objective with verb EXPLAIN, what interaction pattern best supports learning?"

The answer is almost never "continuous animation" — it's typically:
- Worked examples with concrete data
- Step-through with pause points for reflection
- Side-by-side comparisons

### Recommendations for Skill Improvements

#### For `book-content-generator` (writes specifications):

| Current Behavior | Recommended Improvement |
|------------------|------------------------|
| Specifies visual effects (particles, animations) | Specify what DATA must be visible at each stage |
| Defaults to animation for "flow" diagrams | Match interaction pattern to Bloom's level |
| Focuses on aesthetics | Include "Instructional Rationale" section |

**Proposed Specification Template Addition:**
```
Instructional Pattern: [worked-example | exploration | practice | assessment]
Data Visibility Requirements:
  - Stage 1: Show [specific data]
  - Stage 2: Show transformation from X to Y
  ...
Interaction Justification: Why this pattern supports the learning objective
```

#### For `microsim-generator` (creates MicroSims):

| Current Behavior | Recommended Improvement |
|------------------|------------------------|
| Routes by visualization type (chart, timeline, network) | Also route by pedagogical pattern |
| Uses templates matched on visual similarity | Weight pedagogical alignment in template matching |
| No instructional design review | Add mandatory ID checkpoint before implementation |

**Proposed Instructional Design Checkpoint:**
```
Before implementing, answer:
1. What specific data transformation must the learner SEE?
2. Does the learner need to PREDICT before observing? (If yes, avoid continuous animation)
3. What does animation add that static arrows don't?
4. Is this pattern appropriate for Bloom's level [X]?
```

#### For `find-similar-templates.py`:

| Current Behavior | Recommended Improvement |
|------------------|------------------------|
| Embeds on title, description, keywords | Also embed on Bloom's level + pedagogical pattern |
| Returns templates by cosine similarity | Add pedagogical alignment score |
| No filtering by learning objective type | Filter/boost templates matching objective type |

**Proposed Enhancement:**
Add metadata to embeddings:
```json
{
  "pedagogical_pattern": "worked-example",
  "bloom_alignment": ["understand", "apply"],
  "requires_prediction": false,
  "data_visibility": "high"
}
```

### Key Insight

**The fundamental problem:** Both skills optimize for "what looks good" rather than "what teaches well."

Animation is seductive because it signals effort and sophistication. But for UNDERSTAND-level objectives, animation often **interferes** with learning by:
- Adding extraneous cognitive load
- Preventing learner-controlled pacing
- Obscuring the actual data transformations
- Making prediction impossible

The fix isn't just better prompts — it's building **instructional design reasoning** into the skill workflows themselves.
