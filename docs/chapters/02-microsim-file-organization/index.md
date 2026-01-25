---
title: MicroSim File Organization
description: Understanding the directory structure and essential files that comprise a MicroSim package including index.md, main.html, style.css, and JSON configuration files
generated_by: claude skill chapter-content-generator
date: 2026-01-24 10:45:00
version: 0.03
reading_level: college
---

# MicroSim File Organization

## Summary

This chapter covers the directory structure and essential files that comprise a MicroSim package. You'll learn about the standard file organization pattern including the index.md documentation file, main.html visualization file, style.css for styling, and JSON files for data and metadata. Understanding this structure is essential for creating MicroSims that can be easily discovered, indexed, and reused. After completing this chapter, students will be able to create properly organized MicroSim directories.

## Concepts Covered

This chapter covers the following 7 concepts from the learning graph:

1. MicroSim Structure
2. File Organization
3. index.md File
4. main.html File
5. style.css File
6. data.json File
7. metadata.json File

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to MicroSims](../01-intro-to-microsims/index.md)

---

## The Secret to Supercharged MicroSims

Here's a truth that separates amateur MicroSim creators from the pros: *organization matters*. You can write the most brilliant simulation code in the world, but if it's scattered across random files with mysterious names, you've essentially buried treasure without leaving a map.

Think of MicroSim file organization like the layout of a well-designed coffee shop. Every barista knows exactly where the espresso beans are, where the milk is stored, and where to find the specialty syrups. New employees can get up to speed quickly because everything follows a logical pattern. That's what we're building here—a consistent structure that makes MicroSims instantly understandable, discoverable, and reusable.

When thousands of teachers can find, understand, and deploy your MicroSim in minutes rather than hours, that's when the real magic happens. Your single afternoon of work transforms into educational impact across countless classrooms. Now *that's* leverage!

## Understanding MicroSim Structure

The **MicroSim structure** refers to the standardized way we organize files within a MicroSim package. Just like how every house has a foundation, walls, and roof in predictable places, every MicroSim follows a consistent organizational pattern.

A properly structured MicroSim lives in its own directory with a descriptive, URL-friendly name. Inside that directory, you'll find a specific set of files, each with a distinct purpose:

| File | Purpose | Required? |
|------|---------|-----------|
| `index.md` | Human-readable documentation | Yes |
| `main.html` | The actual simulation | Yes |
| `style.css` | Custom styling | Optional |
| `data.json` | Simulation data | Optional |
| `metadata.json` | Machine-readable metadata | Recommended |

This isn't arbitrary bureaucracy—it's a superpower for findability. When every MicroSim follows the same structure, search systems can automatically crawl and index them. Teachers can instantly navigate any MicroSim they encounter. AI systems can learn from and generate new MicroSims that follow established patterns.

!!! tip "The Naming Convention"
    MicroSim directories use **kebab-case**: all lowercase letters with hyphens separating words. For example: `pendulum-simulator`, `quadratic-equation-explorer`, or `water-cycle-animation`. No spaces, no capital letters, no underscores.

## The Art of File Organization

**File organization** is about creating a predictable, navigable structure for your MicroSim files. When done right, anyone—human or machine—can find exactly what they need in seconds.

Here's what a typical MicroSim directory looks like in practice:

```
docs/sims/pendulum-physics/
├── index.md          # Documentation for humans
├── main.html         # The simulation itself
├── style.css         # Custom styles (optional)
├── data.json         # Data for the simulation (optional)
└── metadata.json     # Metadata for search systems
```

Why does this specific organization matter? Let's break it down:

1. **Isolation**: Each MicroSim lives in its own directory, preventing file conflicts
2. **Portability**: You can zip up the entire folder and share it
3. **Discoverability**: Search crawlers know exactly where to look
4. **Consistency**: Users develop muscle memory for finding things
5. **Version control**: Easy to track changes in Git repositories

The directory name serves as the MicroSim's unique identifier. When you see a URL like `example.com/sims/pendulum-physics/main.html`, you immediately know you're looking at a MicroSim about pendulum physics. No detective work required!

#### Diagram: MicroSim Directory Structure

<iframe src="../../sims/microsim-directory-structure/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>MicroSim Directory Structure Diagram</summary>
Type: diagram

Bloom Level: Understand (L2)
Bloom Verb: describe

Learning Objective: Students will describe the standard MicroSim directory structure and explain the purpose of each file type within the package.

Purpose: Visualize the hierarchical relationship between MicroSim files in a directory structure

Components to show:
- Root sims directory (folder icon)
- Individual MicroSim directory (highlighted folder)
- Five file types with distinct icons:
  - index.md (document icon with "md")
  - main.html (code icon with angle brackets)
  - style.css (paint palette icon)
  - data.json (curly braces icon)
  - metadata.json (tag icon)

Layout:
- Tree structure with the sims folder at top
- MicroSim folder as child
- Five files as children of MicroSim folder
- Each file has an icon, filename, and brief purpose label

Interactive elements:
- Hover over each file to see detailed description
- Tooltips explain file purpose and contents
- Required files highlighted vs optional files

Visual style: Clean tree diagram with folder/file icons
Color scheme: Folders in gold, required files in blue, optional files in green
Animation: Gentle fade-in as user scrolls, hover highlights

Implementation: HTML/CSS/JavaScript with SVG icons
</details>

## The index.md File: Your MicroSim's Welcome Mat

The **index.md file** is the front door to your MicroSim—the first thing humans read when they want to understand what your simulation does and how to use it.

Written in Markdown (that's what the `.md` extension means), this file contains:

- **Title**: What is this MicroSim called?
- **Description**: What does it do and teach?
- **Learning objectives**: What will students understand after using it?
- **Usage instructions**: How do the controls work?
- **Pedagogical notes**: Suggestions for teachers on how to incorporate it

Here's a sample index.md structure:

```markdown
# Pendulum Physics Simulator

## Description

An interactive simulation demonstrating the relationship between
pendulum length, gravity, and oscillation period.

## Learning Objectives

- Explain how pendulum length affects period
- Predict the effect of changing gravity on swing speed
- Apply the pendulum formula: T = 2π√(L/g)

## Controls

- **Length Slider**: Adjust pendulum length from 0.5m to 3.0m
- **Gravity Slider**: Change gravity from 1 to 20 m/s²
- **Start/Pause**: Control animation
- **Reset**: Return to default values

## For Teachers

Great for introducing periodic motion in physics classes.
Pair with the mass-spring simulator for comparison.
```

Notice how the index.md speaks to humans? It uses natural language, explains *why* things work the way they do, and provides context that machines can't easily infer. This is deliberate—we have a separate file (metadata.json) for machine-readable information.

!!! note "MkDocs Integration"
    In MkDocs-based textbooks, the index.md file automatically becomes the directory's landing page. When someone navigates to `/sims/pendulum-physics/`, MkDocs serves the index.md as the default page.

## The main.html File: Where the Magic Happens

The **main.html file** is the star of the show—it contains (or links to) the actual simulation code. When you embed a MicroSim in an iframe, this is the file you're pointing to.

A typical main.html includes:

- HTML structure for the page
- References to JavaScript libraries (like p5.js)
- The simulation code itself
- Control elements (sliders, buttons, dropdowns)
- Canvas or SVG elements for visualization

Here's a simplified example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pendulum Simulator</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
</head>
<body>
    <div id="canvas-container"></div>
    <div id="controls">
        <label>Length: <input type="range" id="length" min="50" max="300"></label>
        <label>Gravity: <input type="range" id="gravity" min="1" max="20"></label>
    </div>
    <script src="sketch.js"></script>
</body>
</html>
```

The key principles for main.html:

- **Self-contained**: Should work when opened directly in a browser
- **Responsive**: Adapts to different container widths
- **Accessible**: Includes proper labels and ARIA attributes
- **Performant**: Loads quickly and runs smoothly

Some MicroSim creators put their JavaScript code directly in main.html, while others separate it into a sketch.js file. Both approaches work—what matters is consistency and clarity.

#### Diagram: MicroSim HTML Architecture

<iframe src="../../sims/html-architecture/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>MicroSim HTML Architecture Diagram</summary>
Type: diagram

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning Objective: Students will examine the structure of a main.html file and identify how different components (head, body, scripts) work together to create an interactive simulation.

Purpose: Show the anatomy of a MicroSim's main.html file with labeled sections

Components to show:
- DOCTYPE declaration (top banner)
- HTML element (outer container)
- Head section containing:
  - Meta tags for charset and viewport
  - Title element
  - Link to style.css
  - Script tag for p5.js CDN
- Body section containing:
  - Canvas container div
  - Controls div with sliders/buttons
  - Script tag linking to sketch.js

Layout: Nested box diagram showing HTML document structure
- Clear visual hierarchy with head and body as siblings
- Expandable sections for detailed view

Interactive elements:
- Click on any section to see code example
- Hover for brief description of purpose
- Toggle between "structure view" and "code view"

Visual style: Nested rectangles with rounded corners
Color scheme:
- Head elements in blue tones
- Body structure in green tones
- Script references in orange
- External resources with dotted borders

Animation: Sections expand smoothly when clicked

Implementation: HTML/CSS/JavaScript with interactive panels
</details>

## The style.css File: Making It Beautiful

The **style.css file** handles the visual presentation of your MicroSim. While many simulations work fine without custom CSS (relying on default browser styles), a well-crafted stylesheet makes the difference between "functional" and "polished."

Common styling needs for MicroSims include:

- **Canvas sizing**: Making the drawing area responsive
- **Control layout**: Arranging sliders and buttons attractively
- **Typography**: Readable labels and values
- **Color themes**: Consistent visual identity
- **Responsive breakpoints**: Adapting to mobile screens

Here's a practical style.css example:

```css
/* Container fills available width */
#canvas-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

/* Control panel styling */
#controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
}

/* Slider styling */
input[type="range"] {
    width: 150px;
    cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    #controls {
        flex-direction: column;
    }
}
```

The style.css file is optional because:

- Some MicroSims use inline styles in the HTML
- p5.js can handle styling programmatically
- Default browser styles may be sufficient

However, separating CSS into its own file follows web development best practices and makes maintenance easier.

!!! tip "Consistency Across MicroSims"
    Consider creating a base stylesheet that you reuse across all your MicroSims. This gives your collection a cohesive visual identity and reduces the work for each new simulation.

## The data.json File: Separating Content from Code

The **data.json file** stores structured data that the simulation uses. Instead of hardcoding values into your JavaScript, you load them from this external file. This separation makes MicroSims more flexible and maintainable.

Why use a separate data file?

- **Easier updates**: Change data without touching code
- **Non-programmer friendly**: Teachers can modify content without JavaScript knowledge
- **Multiple datasets**: Swap data files for different scenarios
- **Cleaner code**: Simulation logic isn't cluttered with data definitions

Here's an example data.json for a solar system simulation:

```json
{
  "planets": [
    {
      "name": "Mercury",
      "distanceFromSun": 0.39,
      "orbitalPeriod": 88,
      "color": "#A0522D"
    },
    {
      "name": "Venus",
      "distanceFromSun": 0.72,
      "orbitalPeriod": 225,
      "color": "#DEB887"
    },
    {
      "name": "Earth",
      "distanceFromSun": 1.0,
      "orbitalPeriod": 365,
      "color": "#4169E1"
    }
  ],
  "settings": {
    "animationSpeed": 1.0,
    "showOrbits": true,
    "showLabels": true
  }
}
```

Loading this data in JavaScript is straightforward:

```javascript
let planetData;

function preload() {
    planetData = loadJSON('data.json');
}

function setup() {
    // Now planetData.planets contains the array
    // and planetData.settings contains configuration
}
```

The data.json file is particularly valuable for:

- Quiz questions and answers
- Geographic coordinates for maps
- Historical timelines
- Mathematical datasets
- Configuration options

## The metadata.json File: Your MicroSim's Digital DNA

Here's where the superpower truly kicks in. The **metadata.json file** contains structured information *about* your MicroSim—data that enables search engines, AI systems, and educational platforms to understand, categorize, and recommend your simulation.

Think of metadata.json as a comprehensive profile that answers every question a search system might ask:

- What subject does this teach?
- What grade levels is it appropriate for?
- What learning objectives does it address?
- What technology does it use?
- Who created it and when?
- How can it be used and shared?

Here's a complete metadata.json example:

```json
{
  "microsim": {
    "dublinCore": {
      "title": "Pendulum Physics Simulator",
      "description": "Interactive simulation demonstrating the relationship between pendulum length, gravity, and oscillation period",
      "creator": "Dr. Jane Smith",
      "date": "2026-01-15",
      "type": "Interactive Simulation",
      "format": "text/html",
      "language": "en-US",
      "rights": "CC BY-NC-SA 4.0"
    },
    "educational": {
      "subjectArea": ["Physics", "Mathematics"],
      "gradeLevel": ["High School", "Undergraduate"],
      "bloomsTaxonomy": ["Understand", "Apply", "Analyze"],
      "difficulty": "Intermediate",
      "topic": "Periodic Motion",
      "learningObjectives": [
        "Explain how pendulum length affects oscillation period",
        "Predict the effect of gravity on pendulum motion",
        "Apply the pendulum equation T = 2π√(L/g)"
      ],
      "prerequisites": [
        "Basic algebra",
        "Understanding of time and motion"
      ]
    },
    "technical": {
      "framework": "p5.js",
      "libraryVersion": "1.9.0",
      "fileSize": "45KB",
      "browserSupport": ["Chrome", "Firefox", "Safari", "Edge"]
    },
    "search": {
      "visualizationType": ["animation", "simulation"],
      "interactionLevel": "high",
      "keywords": [
        "pendulum",
        "oscillation",
        "period",
        "gravity",
        "physics simulation",
        "harmonic motion"
      ]
    }
  }
}
```

This metadata enables powerful capabilities:

- **Faceted search**: Find all Physics simulations for High School with Intermediate difficulty
- **Semantic matching**: AI understands that "periodic motion" relates to "oscillation"
- **Quality scoring**: Systems can assess completeness and recommend improvements
- **Similar recommendations**: "Students who used this also liked..."

#### Diagram: Metadata Schema Structure

<iframe src="../../sims/metadata-schema/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Metadata Schema Structure Interactive Diagram</summary>
Type: infographic

Bloom Level: Analyze (L4)
Bloom Verb: organize

Learning Objective: Students will organize their understanding of the metadata.json schema by exploring the hierarchical structure of Dublin Core, educational, technical, and search sections.

Purpose: Visualize the complete metadata.json schema with expandable sections

Layout: Radial or hierarchical tree starting from "microsim" root

Main sections (level 1):
1. dublinCore (8 fields)
   - title, description, creator, date, type, format, language, rights
2. educational (7 fields)
   - subjectArea, gradeLevel, bloomsTaxonomy, difficulty, topic, learningObjectives, prerequisites
3. technical (4 fields)
   - framework, libraryVersion, fileSize, browserSupport
4. search (3 fields)
   - visualizationType, interactionLevel, keywords

Interactive elements:
- Click section to expand and see all fields
- Hover over field for description and example values
- Color coding indicates required vs optional fields
- Search box to find specific fields

Visual style: Clean hierarchical diagram with card-based field display
Color scheme:
- dublinCore in blue (standard metadata)
- educational in green (learning focus)
- technical in orange (implementation)
- search in purple (discoverability)

Animation: Smooth expand/collapse transitions

Implementation: HTML/CSS/JavaScript with collapsible tree structure
</details>

## Putting It All Together

Let's walk through creating a properly organized MicroSim from scratch. Imagine you're building a simulation that demonstrates how area and perimeter change as you resize a rectangle.

**Step 1: Create the directory**

```bash
mkdir docs/sims/rectangle-area-perimeter
```

**Step 2: Create index.md**

```markdown
# Rectangle Area and Perimeter Explorer

## Description

An interactive visualization showing how a rectangle's area and
perimeter change as width and height are adjusted.

## Learning Objectives

- Understand the formulas for rectangle area (A = w × h) and
  perimeter (P = 2w + 2h)
- Observe how doubling dimensions affects area vs perimeter
- Compare the rate of change between area and perimeter
```

**Step 3: Create main.html with the simulation**

Build your p5.js simulation with sliders for width and height, displaying both the rectangle visualization and the calculated values.

**Step 4: Add style.css for polish**

Style the control panel, ensure responsive behavior, and add visual refinements.

**Step 5: Create metadata.json**

Fill in all the structured information about subject area, grade level, learning objectives, and technical details.

**Step 6: Test everything**

- Open main.html directly in a browser
- Verify all controls work
- Check responsive behavior
- Validate JSON syntax
- Test embedding in an iframe

!!! success "Congratulations!"
    You've created a fully-documented, discoverable, reusable MicroSim! When this gets indexed by search systems, teachers worldwide will be able to find it, understand it, and use it in their classrooms.

## Why This Structure is Your Superpower

This consistent file organization isn't just bureaucratic tidiness—it's the foundation for transformative educational technology. When every MicroSim follows the same pattern:

- **Search works**: Crawlers know where to find metadata.json
- **AI learns**: Training data is consistent and predictable
- **Teachers win**: Less time figuring out, more time teaching
- **Students benefit**: Familiar interface patterns across all MicroSims
- **Communities grow**: Easy to share, fork, and improve

The MicroSim search system we're building in this course relies on this structure. Each metadata.json feeds into a master index. Faceted search filters become possible because subject areas and grade levels are in predictable fields. Semantic similarity works because descriptions and learning objectives follow consistent patterns.

One teacher creating one well-organized MicroSim might impact thousands of students. That's the multiplier effect in action. That's why file organization isn't boring—it's empowering.

## Key Takeaways

1. **MicroSim structure** follows a consistent pattern with predictable file names and locations
2. **File organization** uses kebab-case directory names and standard file types
3. The **index.md file** provides human-readable documentation and usage instructions
4. The **main.html file** contains the actual simulation code and is the iframe target
5. The **style.css file** handles visual presentation and responsive design
6. The **data.json file** separates content from code for easier maintenance
7. The **metadata.json file** enables search, discovery, and AI integration
8. Consistent organization transforms individual MicroSims into a searchable, reusable ecosystem

---

*Ready to dive into metadata standards? Continue to [Chapter 3: Metadata Fundamentals](../03-metadata-fundamentals/index.md).*
