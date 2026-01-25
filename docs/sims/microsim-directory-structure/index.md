---
title: MicroSim Directory Structure
description: Interactive diagram showing the standard file organization for MicroSim packages including index.md, main.html, style.css, script.js, data.json, and metadata.json files
image: /sims/microsim-directory-structure/microsim-directory-structure.png
quality_score: 85
---

# MicroSim Directory Structure

<iframe src="./main.html" width="100%" height="450px" scrolling="no" style="overflow: hidden;"></iframe>

[View Fullscreen](./main.html){ .md-button .md-button--primary target="_blank" }

## About This MicroSim

This interactive diagram visualizes the standard file organization pattern for MicroSim packages. Every MicroSim follows the same predictable structure, making them easy to create, share, discover, and maintain.

The diagram shows a hierarchical tree structure:

- **Root `sims/` folder** - Contains all MicroSim packages for a project
- **Individual MicroSim folder** - Named using kebab-case (e.g., `pendulum-physics/`)
- **Six standard files** - Each with a specific purpose in the MicroSim ecosystem

Understanding this structure is essential for anyone creating MicroSims, as it enables:

1. **Automatic discovery** - Search crawlers know exactly where to find metadata
2. **Consistent user experience** - Students and teachers navigate all MicroSims the same way
3. **Easy sharing** - Zip up a folder and share the complete package
4. **AI integration** - Language models can generate and understand MicroSims that follow the pattern

## File Types Explained

| File | Status | Purpose |
|------|--------|---------|
| **index.md** | Required | Human-readable documentation with learning objectives, usage instructions, and teaching notes |
| **main.html** | Required | The simulation entry point - contains HTML structure, canvas, controls, and loads JavaScript libraries |
| **style.css** | Optional | Custom CSS for visual styling, responsive layout, and control appearance |
| **script.js** | Optional | Separate JavaScript file for simulation logic (can also be named `sketch.js` for p5.js) |
| **data.json** | Optional | Structured data loaded by the simulation - quiz questions, coordinates, configurations |
| **metadata.json** | Recommended | Dublin Core metadata enabling search, discovery, and LMS integration |

## Learning Objectives

After using this MicroSim, students will be able to:

1. Describe the standard MicroSim directory structure and naming conventions
2. Explain the purpose of each file type within a MicroSim package
3. Distinguish between required, optional, and recommended files
4. Understand how consistent file organization enables discoverability and reuse
5. Apply the structure when creating their own MicroSims

## How to Use

1. **Hover over nodes** to see detailed descriptions in the info panel
2. **Blue nodes** indicate required files (index.md, main.html)
3. **Green nodes** indicate optional files (style.css, script.js, data.json, metadata.json)
4. **Gold nodes** represent directories/folders
5. Use the **navigation controls** in the bottom corners to pan and zoom

---

## Lesson Plan

**Grade Level:** High School / Undergraduate
**Duration:** 30-45 minutes
**Prerequisites:** Basic understanding of files and folders, familiarity with HTML concepts

### Learning Objectives

By the end of this lesson, students will be able to:

- Identify all six file types in a standard MicroSim package
- Explain why each file exists and what it contains
- Distinguish between required and optional files
- Describe how metadata enables search and discovery

### Materials Needed

- This MicroSim (projected or on individual devices)
- Sample MicroSim folder to explore (optional)
- Quiz handout or online quiz

### Lesson Outline

#### Introduction (5 minutes)

Ask students: "If you wanted to share an interactive simulation with thousands of teachers, what information would they need?"

Discuss responses, then introduce the concept that standardized organization makes sharing possible at scale.

#### Guided Exploration (10 minutes)

1. Display the MicroSim and walk through the tree structure
2. Hover over each node, reading the descriptions aloud
3. Emphasize the color coding:
   - Gold = folders (containers)
   - Blue = required files (must have)
   - Green = optional files (good to have)

#### Discussion Questions (10 minutes)

1. **Why separate documentation (index.md) from code (main.html)?**
   - Different audiences: teachers read docs, browsers run code
   - Easier to update one without breaking the other

2. **Why put JavaScript in a separate script.js file?**
   - Cleaner code organization
   - Easier to maintain large simulations
   - Can share code between multiple HTML files

3. **Why is metadata.json "recommended" rather than "required"?**
   - MicroSim works without it
   - But search/discovery doesn't work without it
   - Trade-off between minimum viable and full functionality

4. **What happens if everyone uses different file names?**
   - Crawlers can't find files automatically
   - Teachers spend time figuring out each MicroSim
   - AI can't learn consistent patterns

#### Hands-On Activity (10 minutes)

Option A: **Explore a Real MicroSim**
- Open a sample MicroSim folder in a file browser
- Identify each file and match it to the diagram
- Open each file and examine its contents

Option B: **Plan Your Own MicroSim**
- Choose a topic for a simulation
- List what would go in each file
- Sketch out the directory structure

#### Wrap-Up (5 minutes)

- Review the six file types and their purposes
- Emphasize that following the standard makes MicroSims "supercharged" for discovery
- Preview: Next lesson will cover metadata.json in detail

---

## Quiz

Test your understanding of MicroSim file organization:

---

#### 1. Which two files are required for every MicroSim?

<div class="upper-alpha" markdown>
1. style.css and script.js
2. data.json and metadata.json
3. index.md and main.html
4. main.html and metadata.json
</div>

??? question "Show Answer"
    The correct answer is **C**. Every MicroSim must have an index.md file (human-readable documentation) and a main.html file (the simulation itself). The other files are optional or recommended but not required for the MicroSim to function.

    **Concept Tested:** Required vs Optional Files

---

#### 2. What naming convention do MicroSim directories use?

<div class="upper-alpha" markdown>
1. CamelCase (pendulumPhysics)
2. kebab-case (pendulum-physics)
3. snake_case (pendulum_physics)
4. Any naming is acceptable
</div>

??? question "Show Answer"
    The correct answer is **B**. MicroSim directories use kebab-case: all lowercase letters with hyphens separating words. This convention ensures URL-friendly names that work consistently across all operating systems and web servers.

    **Concept Tested:** Directory Naming Convention

---

#### 3. What is the primary purpose of the metadata.json file?

<div class="upper-alpha" markdown>
1. Store simulation data like quiz questions
2. Define the visual styling of the simulation
3. Enable search engines and AI to discover and categorize the MicroSim
4. Contain the JavaScript simulation code
</div>

??? question "Show Answer"
    The correct answer is **C**. The metadata.json file contains Dublin Core metadata that enables search engines, AI systems, and educational platforms to discover, categorize, and recommend the MicroSim. Option A describes data.json, option B describes style.css, and option D describes script.js or inline code in main.html.

    **Concept Tested:** Metadata Purpose

---

#### 4. Why might a developer choose to put JavaScript in a separate script.js file instead of inline in main.html?

<div class="upper-alpha" markdown>
1. It runs faster in the browser
2. It keeps code organized and is easier to maintain for complex simulations
3. It is required by web browsers
4. It reduces the total file size
</div>

??? question "Show Answer"
    The correct answer is **B**. Separating JavaScript into its own file improves code organization and maintainability, especially as simulations grow in complexity. It also allows sharing code between multiple HTML files. Options A and D are incorrect as there's no performance or size benefit. Option C is incorrect as browsers accept inline JavaScript.

    **Concept Tested:** Code Organization

---

#### 5. Which file would a teacher most likely read to understand how to use a MicroSim in class?

<div class="upper-alpha" markdown>
1. index.md
2. main.html
3. metadata.json
4. script.js
</div>

??? question "Show Answer"
    The correct answer is **A**. The index.md file is the human-readable documentation that contains learning objectives, usage instructions, and teaching notes specifically written for educators. The other files are technical implementation files not intended for teacher consumption.

    **Concept Tested:** File Audiences

---

#### 6. A student wants to change the colors and fonts in a MicroSim. Which file should they edit?

<div class="upper-alpha" markdown>
1. index.md
2. data.json
3. style.css
4. metadata.json
</div>

??? question "Show Answer"
    The correct answer is **C**. The style.css file handles all visual presentation including colors, fonts, layout, and responsive design. Option A is for documentation, option B is for simulation data, and option D is for search metadata.

---

## Iframe Embed Code

```html
<iframe src="../../sims/microsim-directory-structure/main.html"
        width="100%"
        height="450px"
        scrolling="no">
</iframe>
```

## References

- [MicroSim Metadata Schema](https://dmccreary.github.io/microsim-search/microsim-schema/)
- [Dublin Core Metadata Initiative](https://www.dublincore.org/)
- [Chapter 2: MicroSim File Organization](../../chapters/02-microsim-file-organization/index.md)
