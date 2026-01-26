---
title: p5.js Architecture
description: Step-through flowchart showing p5.js program execution model - setup runs once, draw loops continuously, event handlers trigger on user interaction
image: /sims/p5-architecture/p5-architecture.png
og:image: /sims/p5-architecture/p5-architecture.png
twitter:image: /sims/p5-architecture/p5-architecture.png
quality_score: 88
social:
   cards: false
---

# p5.js Execution Model

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim helps students understand how a p5.js program executes, from page load through the continuous animation loop.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/p5-architecture/main.html"
        height="472px" width="100%" scrolling="no"></iframe>
```

## Description

The p5.js Architecture diagram shows the execution flow of a p5.js program:

### Execution Phases

1. **Page Loads** - Browser loads the HTML page and p5.js library
2. **p5.js Initializes** - Library sets up the environment
3. **setup()** - Runs once to create canvas, initialize variables, and create controls
4. **Animation Loop** - Continuous cycle running at 60 frames per second
5. **draw()** - Called every frame to update and render the visualization
6. **Event Handlers** - Functions like mousePressed(), keyPressed() can trigger anytime

### Interactive Features

- **Next Step** - Advance through the execution flow manually
- **Reset** - Return to the beginning
- **Auto Play** - Automatic progression through steps
- Animated highlighting shows active nodes and edges
- Detail panels explain what each function does

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Explain** the p5.js execution model and the role of setup() vs draw()
2. **Trace** the flow from page load through continuous animation
3. **Identify** when event handlers execute relative to the draw loop

## Lesson Plan

### Introduction (5 minutes)
- Ask: "What happens when you load a p5.js sketch in the browser?"
- Discuss the difference between code that runs once vs continuously

### Step-Through Activity (10 minutes)
1. Use "Next Step" to trace through each phase
2. At each step, ask students to predict what happens next
3. Discuss the setup() function and what belongs there
4. Explain the draw() loop and why it runs continuously

### Event Handler Discussion (5 minutes)
- Click "Auto Play" to see the continuous loop
- Discuss when mousePressed() would interrupt the flow
- Why are event handlers shown with dashed lines?

### Code Connection (10 minutes)
- Show a simple p5.js sketch
- Match each part of the code to the flowchart
- Identify what runs in setup() vs draw()

## References

- [Technical Implementation](../../chapters/14-technical-implementation/index.md)
- [p5.js Reference](https://p5js.org/reference/)
