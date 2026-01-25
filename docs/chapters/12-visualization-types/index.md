---
title: Visualization Types
description: Master the art of selecting the perfect visualization format for educational content, from animations and charts to interactive simulations and 3D models
generated_by: claude skill chapter-content-generator
date: 2026-01-24 21:00:00
version: 0.03
reading_level: college_freshman
---

# Visualization Types

## Summary

This chapter covers the various visualization types supported by MicroSims, helping you select the right format for different educational content. You'll learn about animations, charts, graph visualizations, diagrams, simulation displays, interactive demos, data visualizations, 3D models, timelines, network diagrams, map visualizations, and dashboards. Understanding visualization types enables better metadata classification and helps educators find the right MicroSim format for their needs. After completing this chapter, students will be able to categorize and select appropriate visualization types.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Visualization Type
2. Animation
3. Chart
4. Graph Visualization
5. Diagram
6. Simulation Display
7. Interactive Demo
8. Data Visualization
9. 3D Model
10. Timeline
11. Network Diagram
12. Map Visualization
13. Dashboard

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md). The Visualization Type concept is foundational with no dependencies within this textbook.

---

## Why Visualization Types Matter

Imagine you're teaching the concept of wave interference. You could:

- Show a static diagram with overlapping waves
- Animate two waves approaching and combining
- Create an interactive simulation where students control wave parameters
- Display a 3D model of wave patterns in a ripple tank
- Build a chart showing amplitude at different points

Each approach has strengths. Static diagrams work for quick reference. Animations show temporal progression. Simulations enable exploration. 3D models reveal spatial relationships. Charts quantify patterns.

Choosing the wrong visualization type is like using a hammer when you need a screwdriver—you might make progress, but it's frustrating and inefficient. **The right visualization type makes concepts click instantly.**

This is where visualization taxonomy becomes your superpower. When you understand the landscape of visualization options, you can match each learning objective to its ideal format. And when your metadata accurately describes the visualization type, educators can find exactly what they need.

Let's explore the visualization universe!

---

## What Is a Visualization Type?

A **visualization type** is a category describing how a MicroSim presents information visually. It's part of the `search.visualizationType` field in metadata and enables educators to filter for specific formats.

### Why Categorize Visualizations?

| Reason | Benefit |
|--------|---------|
| **Search filtering** | "Show me only animations" |
| **Curriculum matching** | "I need a chart for data analysis unit" |
| **Device planning** | "3D models need powerful devices" |
| **Time estimation** | "Simulations take longer than diagrams" |
| **Learning outcome alignment** | Different types support different Bloom levels |

### The Visualization Type Taxonomy

Our classification includes 13 major types:

| Type | Description | Best For |
|------|-------------|----------|
| **Animation** | Time-sequenced visual progression | Showing processes, changes over time |
| **Chart** | Quantitative data display | Comparing values, showing distributions |
| **Graph Visualization** | Node-and-edge network displays | Relationships, connections, dependencies |
| **Diagram** | Schematic representations | Structure, components, relationships |
| **Simulation** | Interactive model of a system | Exploration, experimentation, "what if" |
| **Interactive Demo** | Guided walkthrough with interaction | Demonstrations, tutorials, features |
| **Data Visualization** | Visual encoding of data patterns | Patterns, trends, distributions |
| **3D Model** | Three-dimensional representations | Spatial relationships, physical objects |
| **Timeline** | Temporal sequence display | History, sequences, progression |
| **Network Diagram** | Interconnected node systems | Dependencies, flows, social networks |
| **Map Visualization** | Geographic or spatial data | Location, distribution, movement |
| **Dashboard** | Multi-metric display panel | Monitoring, overview, KPIs |

Let's explore each type in detail!

---

## Animation: Bringing Concepts to Life

**Animations** show change over time through sequenced visual frames. They're the MicroSim equivalent of video—temporal progression is central.

### When to Use Animations

| Use Case | Example |
|----------|---------|
| **Processes** | Cell division stages, chemical reactions |
| **Change over time** | Population growth, climate patterns |
| **Motion** | Projectile trajectories, wave propagation |
| **Transformations** | Geometric transformations, state changes |
| **Cause-effect sequences** | Dominoes falling, feedback loops |

### Animation Design Principles

**Control is crucial**: Users should be able to:

- Play, pause, and restart
- Adjust speed (slow motion for complex parts)
- Step frame-by-frame for detailed analysis
- Jump to specific points

**Highlight the essential**: Use visual emphasis to direct attention:

- Color changes for active elements
- Motion blur for direction
- Annotations at key moments
- Reduced complexity for focus areas

**Loop thoughtfully**: Some animations benefit from loops, others don't:

- Cycles (pendulum, seasons): Loop naturally
- Progressions (evolution, history): Don't loop—show completion

### Animation vs. Simulation

| Animation | Simulation |
|-----------|------------|
| Pre-defined sequence | User-controlled parameters |
| Shows *what* happens | Shows *what if* |
| Watch and learn | Explore and discover |
| Passive viewing possible | Requires interaction |

**Example**: An *animation* of a pendulum shows one swing. A *simulation* lets you change length and see how period changes.

#### Diagram: Animation Control Panel

<iframe src="../../sims/animation-control-panel/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Animation Control Interface Design</summary>
Type: diagram

Bloom Level: Remember (L1)
Bloom Verb: identify

Learning Objective: Students will identify the essential controls of an educational animation interface by examining a well-designed control panel.

Layout: Single-panel diagram showing animation controls

Visual elements:
- Sample animation area (wave or pendulum)
- Transport controls bar below animation:
  - Play/Pause toggle button (triangle/two bars)
  - Restart button (circular arrow)
  - Step backward button (|<)
  - Step forward button (>|)
- Progress/scrubber bar with draggable position indicator
- Speed control slider (0.25x to 2x)
- Current time display
- Total duration display
- Loop toggle checkbox

Labeled callouts for each element:
- "Play/Pause: Control animation state"
- "Restart: Return to beginning"
- "Step: Advance frame-by-frame"
- "Scrubber: Jump to any point"
- "Speed: Slow for detail, fast for overview"
- "Loop: Repeat continuously or play once"

Interactive elements:
- Hover over any control to see its purpose
- Click controls to see them in action
- Try different combinations

Color scheme:
- Controls: Dark gray with light icons
- Active state: Blue highlight
- Scrubber played portion: Blue
- Scrubber remaining: Gray

Implementation: p5.js with functional animation controls
</details>

---

## Chart: Quantifying Concepts

**Charts** encode quantitative data visually, making numbers comprehensible at a glance. They're essential for any content involving comparison, distribution, or trends.

### Chart Types and Their Uses

| Chart Type | Best For | Example |
|------------|----------|---------|
| **Bar chart** | Comparing discrete categories | Population by country |
| **Line chart** | Trends over time | Temperature change by year |
| **Pie chart** | Part-to-whole relationships | Budget allocation |
| **Scatter plot** | Correlation between variables | Height vs. weight |
| **Histogram** | Distribution of values | Test score frequencies |
| **Area chart** | Cumulative changes over time | Stack market portfolio |

### Chart Design Principles

**Choose wisely**: The wrong chart type can mislead:

- Don't use pie charts for more than 5-6 categories
- Don't use 3D effects (they distort perception)
- Don't truncate axes deceptively

**Label clearly**:

- Axis labels with units
- Legend for multiple series
- Title stating what's shown
- Data source if applicable

**Use color meaningfully**:

- Consistent colors for same categories
- Sequential colors for ordered data
- Diverging colors for positive/negative

### Interactive Charts in MicroSims

Static charts show fixed data. Interactive charts enable exploration:

| Feature | Educational Value |
|---------|-------------------|
| **Hover details** | See exact values without clutter |
| **Zoom** | Explore dense data regions |
| **Filter** | Focus on specific categories |
| **Animate** | Show data changes over time |
| **Compare** | Toggle series on/off |
| **Export** | Use data in other contexts |

**Example**: A static bar chart shows 2020 population. An interactive chart lets students filter by continent, hover for exact values, and animate from 1900 to 2020.

---

## Graph Visualization: Mapping Relationships

**Graph visualizations** (not to be confused with charts/graphs of data) display nodes connected by edges—perfect for showing relationships, networks, and dependencies.

### When to Use Graph Visualization

| Use Case | Example |
|----------|---------|
| **Social networks** | Friend connections, communication patterns |
| **Dependency chains** | Build dependencies, import graphs |
| **Hierarchies** | Organization charts, taxonomies |
| **Processes** | State machines, workflow steps |
| **Knowledge graphs** | Concept maps, semantic relationships |

### Graph Layout Algorithms

The layout algorithm determines how nodes are positioned:

| Algorithm | Result | Best For |
|-----------|--------|----------|
| **Force-directed** | Organic clustering | General networks |
| **Hierarchical** | Top-to-bottom tree | Hierarchies, flows |
| **Circular** | Nodes on a circle | Showing all connections equally |
| **Grid** | Regular arrangement | Matrices, game boards |
| **Radial** | Center-outward | Ego networks, degrees of separation |

### Interactive Graph Features

| Feature | Educational Value |
|---------|-------------------|
| **Drag nodes** | Explore structure, untangle |
| **Hover details** | See node/edge properties |
| **Zoom/pan** | Navigate large graphs |
| **Filter** | Show subset of connections |
| **Highlight paths** | Trace specific routes |
| **Search** | Find specific nodes |

#### Diagram: Graph Visualization Gallery

<iframe src="../../sims/graph-viz-gallery/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Graph Visualization Layout Gallery</summary>
Type: infographic

Bloom Level: Understand (L2)
Bloom Verb: classify

Learning Objective: Students will classify graph layout algorithms by examining examples and identifying when each is most appropriate.

Layout: Gallery grid showing 5 layout types

Visual elements:
- 5 panels arranged in grid (2×3, last row centered)
- Each panel shows:
  - Layout name as header
  - Small sample graph (10-15 nodes) in that layout
  - Brief description
  - "Best for" tag
- Same node/edge data rendered differently in each

Panel content:

1. **Force-Directed**
   - Nodes pushed apart, edges pull together
   - Organic, clustered appearance
   - Best for: General exploration

2. **Hierarchical**
   - Top-to-bottom tree structure
   - Clear levels visible
   - Best for: Organizational charts, taxonomies

3. **Circular**
   - Nodes evenly spaced on circle edge
   - All connections visible
   - Best for: Comparing connection density

4. **Radial**
   - Central node with rings outward
   - Shows distance from center
   - Best for: Ego networks, influence spread

5. **Grid**
   - Regular rows and columns
   - Predictable positioning
   - Best for: Game boards, matrices

Interactive elements:
- Click any layout to see it animated
- Toggle: "Same data, different layouts" (morphs between)
- Select different sample datasets
- Hover for detailed explanation

Animation:
- Smooth morphing between layouts when toggling
- Nodes animate to new positions
- Edges curve and reconnect

Color scheme:
- Nodes: Blue with white labels
- Edges: Gray, thickness by weight
- Selected: Gold highlight
- Panel backgrounds: Light gray

Implementation: vis-network.js with layout switching
</details>

---

## Diagram: Showing Structure

**Diagrams** are schematic representations showing how components relate. They simplify reality to highlight essential structure.

### Types of Educational Diagrams

| Diagram Type | Purpose | Example |
|--------------|---------|---------|
| **Block diagram** | System components and connections | Computer architecture |
| **Flowchart** | Process steps and decisions | Algorithm logic |
| **Concept map** | Idea relationships | Topic overview |
| **Entity-relationship** | Data model structure | Database schema |
| **Circuit diagram** | Electronic components | Electrical circuits |
| **Anatomy diagram** | Body part structure | Heart chambers |
| **Architecture diagram** | System layers | Software stack |

### Diagram Design Principles

**Simplify appropriately**: Diagrams aren't photographs. Remove irrelevant detail while preserving essential structure.

**Use consistent conventions**:

- Arrows for direction/flow
- Shapes for component types
- Colors for categories
- Line styles for relationship types

**Guide the eye**:

- Reading order (left-to-right, top-to-bottom in Western contexts)
- Visual hierarchy (size, color for importance)
- Alignment and spacing for grouping

### Static vs. Interactive Diagrams

| Static | Interactive |
|--------|-------------|
| Quick reference | Deep exploration |
| Print-friendly | Screen-optimized |
| Single view | Multiple perspectives |
| Labeled once | Hover for details |

**Example**: A static heart diagram labels parts. An interactive version lets you click chambers to see blood flow, hover for function descriptions, and toggle overlays (arteries, veins, nerves).

---

## Simulation Display: Exploring Systems

**Simulations** are interactive models where users manipulate parameters and observe system behavior. They're the most powerful MicroSim type for conceptual understanding.

### What Makes a Simulation

A true simulation includes:

- **Model**: Mathematical or logical representation of a system
- **Parameters**: User-controllable inputs
- **Visualization**: Output display showing system state
- **Interactivity**: Real-time response to parameter changes

### Simulation Use Cases

| Use Case | What Students Do | Learning Outcome |
|----------|------------------|------------------|
| **Physics** | Change mass, observe motion | Understand force-acceleration relationship |
| **Ecology** | Adjust predator population | See boom-bust cycles |
| **Economics** | Modify interest rates | Observe market effects |
| **Chemistry** | Change concentration | Watch reaction rates change |
| **Epidemiology** | Adjust transmission rate | Understand R0 and herd immunity |

### Simulation Design Principles

**Make the invisible visible**: Simulations can show things impossible in real life:

- Slow down fast processes
- Speed up slow processes
- Visualize abstract quantities (energy, probability)
- Show hidden mechanisms

**Enable systematic exploration**:

- One variable at a time when learning
- Multiple variables for mastery
- Presets for interesting scenarios
- Reset to compare trials

**Connect to reality**:

- Use realistic parameters
- Show units and scales
- Compare simulation to real data
- Acknowledge simplifications

#### Diagram: Simulation Anatomy

<iframe src="../../sims/simulation-anatomy/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Anatomy of a Well-Designed Simulation</summary>
Type: diagram

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning Objective: Students will examine the essential components of an educational simulation by identifying and describing each region's purpose.

Layout: Annotated simulation interface with callout labels

Visual elements:
- Mock simulation interface showing:
  - Title bar with simulation name
  - Main visualization area (central, largest)
  - Control panel (right side)
  - Information panel (bottom or left)
  - Status indicators
- Numbered callouts pointing to each region
- Callout explanations in a legend

Regions to annotate:

1. **Visualization Area** (60-70% of space)
   - Where the action happens
   - Shows system state visually
   - Updates in real-time

2. **Control Panel** (15-20%)
   - Parameter sliders
   - Mode toggles
   - Action buttons (Start, Reset)

3. **Information Display** (10-15%)
   - Current values
   - Calculated outputs
   - Status messages

4. **Title/Context** (5%)
   - What this simulation models
   - Learning objectives

5. **Help/Instructions** (accessible)
   - How to use controls
   - What to observe
   - Guiding questions

Interactive elements:
- Click any region to highlight and see detailed description
- Toggle: "Show good vs. bad design" (comparison)
- Hover regions for purpose explanation

Color scheme:
- Visualization: Blue border
- Controls: Green border
- Information: Orange border
- Annotations: Dark gray

Implementation: p5.js with clickable regions and annotations
</details>

---

## Interactive Demo: Guided Exploration

**Interactive demos** are structured walkthroughs with user participation. Unlike free-form simulations, demos guide users through specific features or concepts.

### Demo vs. Simulation

| Interactive Demo | Simulation |
|------------------|------------|
| Guided sequence | Free exploration |
| "Follow along" | "Experiment freely" |
| Shows specific features | Shows system behavior |
| Linear or branching path | Open-ended |
| Instruction-focused | Discovery-focused |

### When to Use Demos

| Scenario | Why Demo Works |
|----------|----------------|
| **Software tutorials** | Show specific features in order |
| **Onboarding** | Introduce interface gradually |
| **Concept introduction** | Build understanding step-by-step |
| **Worked examples** | Show problem-solving process |
| **Feature tours** | Highlight capabilities |

### Demo Design Principles

**Progressive revelation**: Don't show everything at once

- Start simple, add complexity
- Each step builds on previous
- User confirms understanding before advancing

**Active participation**: Don't just watch—do

- "Click this button"
- "Drag the slider to 50"
- "Type your name"

**Immediate feedback**: Confirm correct actions

- Visual confirmation
- Encouraging messages
- Error correction guidance

---

## Data Visualization: Patterns in Numbers

**Data visualization** encodes data values as visual properties (position, size, color, shape), making patterns perceivable that would be invisible in raw numbers.

### Data Visualization vs. Charts

All charts are data visualizations, but data visualization includes more exotic formats:

| Beyond Charts | What It Shows |
|---------------|---------------|
| **Treemap** | Hierarchical proportions |
| **Heatmap** | Intensity across two dimensions |
| **Parallel coordinates** | Multi-dimensional patterns |
| **Sankey diagram** | Flow quantities between stages |
| **Chord diagram** | Relationships and their magnitudes |
| **Word cloud** | Text frequency |
| **Streamgraph** | Layered time series |

### Data Visualization Principles

**Encode appropriately**: Match visual properties to data types

- Position for precise comparison
- Length for quantitative values
- Color intensity for magnitude
- Hue for categories

**Reduce chart junk**: Remove non-data elements

- No decorative graphics
- Minimal gridlines
- No 3D effects
- No excessive colors

**Tell a story**: Guide attention to insights

- Highlight key patterns
- Annotate important points
- Provide context
- Answer "so what?"

---

## 3D Model: Spatial Understanding

**3D models** represent three-dimensional objects or spaces, enabling exploration of spatial relationships impossible in 2D.

### When 3D Adds Value

| Use Case | Why 3D Helps |
|----------|--------------|
| **Anatomy** | Understand organ positions in body |
| **Molecules** | See bond angles and shapes |
| **Geography** | Visualize terrain and elevation |
| **Architecture** | Explore building layouts |
| **Engineering** | Examine mechanical parts |
| **Astronomy** | Navigate solar system scale |

### 3D Interaction Controls

| Control | Action | Purpose |
|---------|--------|---------|
| **Rotate** | Drag to spin | See all sides |
| **Zoom** | Scroll or pinch | Detail or overview |
| **Pan** | Shift+drag | Reposition view |
| **Orbit** | Arc around object | Examine from angles |
| **Explode** | Separate components | See internal structure |
| **Cut** | Plane slices model | View cross-sections |

### 3D Design Considerations

**Performance matters**: 3D requires significant processing

- Simplify models for web delivery
- Provide level-of-detail options
- Test on target devices
- Consider fallback for weak devices

**Orientation challenges**: Users can get lost

- Provide "reset view" button
- Show orientation indicator
- Label key features
- Use consistent lighting

**Accessibility**: Not everyone can manipulate 3D

- Provide preset views
- Include 2D alternatives
- Add text descriptions
- Support keyboard navigation

---

## Timeline: Temporal Sequences

**Timelines** display events in chronological order, making temporal relationships clear.

### Timeline Use Cases

| Use Case | Example |
|----------|---------|
| **History** | Major events in a period |
| **Biography** | Key life events |
| **Project management** | Milestones and deadlines |
| **Evolution** | Species development |
| **Technology** | Innovation progression |
| **Process** | Sequential steps with durations |

### Timeline Design Patterns

| Pattern | Layout | Best For |
|---------|--------|----------|
| **Horizontal** | Left-to-right flow | Reading-order progression |
| **Vertical** | Top-to-bottom scroll | Long timelines, detailed events |
| **Centered** | Events alternate sides | Dense timelines, visual balance |
| **Parallel** | Multiple tracks | Comparing simultaneous sequences |

### Interactive Timeline Features

| Feature | Educational Value |
|---------|-------------------|
| **Zoom** | Overview vs. detail |
| **Filter** | Focus on event categories |
| **Hover details** | Rich information without clutter |
| **Link events** | Show cause-effect relationships |
| **Animate** | Watch progression unfold |
| **Compare** | Multiple timelines aligned |

#### Diagram: Timeline Styles Gallery

<iframe src="../../sims/timeline-styles/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Timeline Layout Styles Comparison</summary>
Type: infographic

Bloom Level: Understand (L2)
Bloom Verb: compare

Learning Objective: Students will compare timeline layout styles by examining examples and selecting appropriate styles for different content types.

Layout: Four-panel gallery showing timeline styles

Visual elements:
- 4 panels (2×2 grid)
- Each shows same historical data in different style
- Brief description below each

Sample data (same for all):
- 1990: Event A
- 1995: Event B
- 2000: Event C
- 2005: Event D
- 2010: Event E

Panel content:

1. **Horizontal Linear**
   - Events flow left to right
   - Single line with markers
   - Labels above/below line
   - Best for: Simple sequences, limited events

2. **Vertical Scroll**
   - Events flow top to bottom
   - Full-width event cards
   - Detailed descriptions visible
   - Best for: Rich content, long timelines

3. **Centered Alternating**
   - Central spine
   - Events alternate left/right
   - Visual balance
   - Best for: Dense timelines, presentations

4. **Parallel Tracks**
   - Multiple horizontal lanes
   - Related events aligned vertically
   - Shows simultaneity
   - Best for: Comparing multiple sequences

Interactive elements:
- Click to see larger example
- Toggle: "Same data, different styles"
- Select different datasets
- Hover for style recommendations

Color scheme:
- Timeline spine: Dark gray
- Event markers: Blue
- Highlighted: Gold
- Panel backgrounds: Light gray

Implementation: vis-timeline.js with style switching
</details>

---

## Network Diagram: Interconnections

**Network diagrams** visualize systems of interconnected elements—how components relate, communicate, or depend on each other.

### Network Diagram vs. Graph Visualization

These terms are often used interchangeably, but:

| Network Diagram | General Graph |
|-----------------|---------------|
| Often technical context | Academic/abstract |
| Infrastructure, systems | Any node-edge data |
| Specific conventions | Flexible representation |
| Engineering focus | Analysis focus |

### Network Diagram Use Cases

| Domain | What's Connected |
|--------|------------------|
| **Computer networks** | Devices, routers, connections |
| **Electrical** | Components, power flow |
| **Organizational** | People, reporting relationships |
| **Supply chain** | Suppliers, factories, customers |
| **Infrastructure** | Roads, utilities, services |

### Network Diagram Conventions

Different domains have established visual conventions:

| Element | Common Meaning |
|---------|----------------|
| **Rectangle** | Processing/device |
| **Circle** | Node/endpoint |
| **Cylinder** | Database/storage |
| **Cloud** | Network/internet |
| **Arrow** | Direction of flow |
| **Line thickness** | Bandwidth/capacity |
| **Color** | Status or category |

---

## Map Visualization: Geographic Context

**Map visualizations** display data in geographic context—where things are, how they're distributed, and how they move.

### Map Visualization Types

| Type | What It Shows | Example |
|------|---------------|---------|
| **Choropleth** | Color intensity by region | Population density by state |
| **Point map** | Locations of discrete items | Store locations |
| **Heat map** | Continuous density | Crime hotspots |
| **Flow map** | Movement between places | Migration patterns |
| **Proportional symbol** | Size represents value | City population circles |
| **Tile map** | Equal-area regions | Electoral results |

### When Maps Help Learning

| Scenario | Why Map Works |
|----------|---------------|
| **Distribution patterns** | "Most cases are in the north" |
| **Regional comparisons** | "This state differs from neighbors" |
| **Movement/flow** | "Trade routes connected these cities" |
| **Spatial relationships** | "Mountains blocked expansion" |
| **Local context** | "This happened near you" |

### Interactive Map Features

| Feature | Educational Value |
|---------|-------------------|
| **Zoom** | Overview to street level |
| **Pan** | Explore different areas |
| **Hover details** | Location-specific information |
| **Layer toggle** | Compare different data overlays |
| **Animation** | Show change over time |
| **Filter** | Focus on specific categories |

---

## Dashboard: The Big Picture

**Dashboards** combine multiple visualizations to provide comprehensive views of complex systems or data.

### Dashboard Components

A typical educational dashboard includes:

| Component | Purpose |
|-----------|---------|
| **KPI cards** | Key metrics at a glance |
| **Charts** | Trends and comparisons |
| **Tables** | Detailed data access |
| **Filters** | Narrow focus |
| **Status indicators** | Current state |
| **Alerts** | Attention needed |

### Educational Dashboard Use Cases

| Context | What's Monitored |
|---------|------------------|
| **Student progress** | Completion, scores, time spent |
| **Class performance** | Aggregate statistics, comparisons |
| **Simulation state** | Multiple parameters at once |
| **Lab data** | Real-time measurements |
| **Project status** | Milestones, blockers, resources |

### Dashboard Design Principles

**Prioritize**: Not everything is equally important

- Most important metrics largest/top-left
- Secondary information smaller/peripheral
- Details on demand

**Group logically**: Related information together

- Temporal data in one area
- Comparisons adjacent
- Actions clearly labeled

**Avoid overload**: Dashboards can overwhelm

- Limit to 5-7 key elements
- Progressive disclosure for details
- Clean whitespace
- Consistent visual language

#### Diagram: Dashboard Layout Patterns

<iframe src="../../sims/dashboard-patterns/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Educational Dashboard Layout Patterns</summary>
Type: diagram

Bloom Level: Apply (L3)
Bloom Verb: construct

Learning Objective: Students will construct effective dashboard layouts by selecting and arranging appropriate components for different monitoring needs.

Layout: Interactive dashboard builder with component library

Visual elements:
- Left sidebar: Component library
  - KPI card
  - Line chart
  - Bar chart
  - Pie chart
  - Table
  - Map
  - Filter dropdown
  - Status indicator
- Main area: Dashboard canvas with grid
- Right sidebar: Layout templates

Component library items:
- Drag-and-drop components
- Each with preview and description
- Resize handles when placed

Template options:
- "Student Progress" (KPIs top, timeline middle, details bottom)
- "Class Overview" (comparison charts, ranking table)
- "Real-time Lab" (live charts, status indicators)
- "Custom" (blank canvas)

Interactive controls:
- Drag components from library to canvas
- Resize components on canvas
- Remove with X button
- Save layout button
- Load template button
- Preview mode toggle

Behavior:
- Components snap to grid
- Validation: "Dashboard needs at least 3 components"
- Preview shows with sample data
- Templates auto-populate canvas

Grid system:
- 12-column responsive grid
- Components span 3, 4, 6, or 12 columns
- Auto-arrange on resize

Color scheme:
- Component cards: White with shadow
- Canvas: Light gray grid
- Library: White sidebar
- Templates: Blue highlight on selection

Implementation: p5.js with drag-and-drop and grid snapping
</details>

---

## Choosing the Right Visualization Type

With 13 types to choose from, how do you pick the right one? Match visualization to learning objective:

### Decision Guide

| If You Want To... | Consider... |
|-------------------|-------------|
| Show change over time | Animation, Timeline, Line Chart |
| Compare quantities | Bar Chart, Data Visualization |
| Show relationships | Graph, Network Diagram, Concept Map |
| Explain structure | Diagram, Block Diagram |
| Enable exploration | Simulation |
| Demonstrate features | Interactive Demo |
| Show spatial data | Map, 3D Model |
| Monitor multiple metrics | Dashboard |
| Display hierarchies | Treemap, Graph (hierarchical layout) |

### Bloom Level Alignment

| Bloom Level | Visualization Types That Fit |
|-------------|------------------------------|
| **Remember** | Diagrams, Labeled Images |
| **Understand** | Animations, Concept Maps |
| **Apply** | Simulations, Calculators |
| **Analyze** | Data Visualizations, Graphs |
| **Evaluate** | Dashboards, Comparison Charts |
| **Create** | Model Builders, Design Tools |

### The Visualization Selection Checklist

Before choosing, ask:

- [ ] What is the learning objective?
- [ ] What Bloom level are we targeting?
- [ ] Is temporal sequence important?
- [ ] Are quantities being compared?
- [ ] Are relationships central?
- [ ] Is exploration valuable?
- [ ] What devices will students use?
- [ ] How much interaction is appropriate?

---

## Key Takeaways

1. **Visualization type** categorizes how a MicroSim presents information, enabling search filtering and curriculum matching

2. **Animations** show change over time with user control over playback—ideal for processes and transformations

3. **Charts** encode quantitative data visually—choose type based on what comparison you're enabling

4. **Graph visualizations** display node-edge networks—layout algorithm choice affects perception

5. **Diagrams** simplify reality to show essential structure—use consistent conventions and guide the eye

6. **Simulations** are interactive models where users control parameters—the most powerful type for conceptual understanding

7. **Interactive demos** guide users through features step-by-step—structured rather than open-ended

8. **Data visualizations** make patterns visible that would be invisible in raw numbers—encode appropriately

9. **3D models** enable spatial understanding—consider performance and accessibility

10. **Timelines** display chronological sequences—choose layout pattern based on detail and event density

11. **Network diagrams** visualize interconnections—use domain conventions for clarity

12. **Map visualizations** provide geographic context—choose type based on whether showing points, regions, or flows

13. **Dashboards** combine multiple visualizations for comprehensive views—prioritize and avoid overload

---

## What's Next?

You now have a taxonomy for visualization types and principles for choosing among them. You can classify MicroSims accurately and select appropriate formats for different learning objectives.

In the next chapter, we'll explore **User Interface and Controls**:

- Interaction levels from passive to highly interactive
- Control widget types (sliders, buttons, dropdowns)
- Layout patterns for organizing controls
- Color scheme considerations

The visualization types you've learned here will be brought to life through thoughtful interface design.

---

*Ready to design interfaces? Continue to [Chapter 13: User Interface and Controls](../13-user-interface-controls/index.md).*
