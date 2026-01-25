---
title: MicroSim HTML Architecture
description: Interactive diagram showing the structure of a MicroSim's main.html file including head, body, scripts, and how components work together
image: /sims/html-architecture/html-architecture.png
quality_score: 85
---

# MicroSim HTML Architecture

<iframe src="./main.html" width="100%" height="500px" scrolling="no" style="overflow: hidden;"></iframe>

[View Fullscreen](./main.html){ .md-button .md-button--primary target="_blank" }

## About This MicroSim

This interactive diagram shows the anatomy of a MicroSim's main.html file. Click on any element to see its code example and understand how different components work together to create an interactive simulation.

## Learning Objectives

After using this MicroSim, students will be able to:

1. Examine the structure of a main.html file
2. Identify how different components (head, body, scripts) work together
3. Understand the role of meta tags, stylesheets, and scripts
4. Recognize the separation between structure (HTML) and behavior (JavaScript)

## How to Use

1. **Click on nodes** to see code examples for each element
2. **Purple nodes** represent document-level elements
3. **Blue nodes** are head section elements (metadata)
4. **Green nodes** are body section elements (visible content)
5. **Orange nodes** represent external resources (CSS, JavaScript)

## Lesson Plan

### Learning Objectives
- Understand HTML document structure
- Identify the purpose of head vs body sections
- Recognize how external resources are loaded

### Activities
1. Have students click through each node to see the code examples
2. Ask students to trace how a script file gets loaded (head vs body placement)
3. Discuss why meta viewport is important for MicroSims embedded in iframes

### Assessment
- Can students explain the difference between head and body sections?
- Can students identify where to add a new JavaScript library?
- Can students explain why the canvas container is in the body?

## Iframe Embed Code

```html
<iframe src="../../sims/html-architecture/main.html"
        width="100%"
        height="500px"
        scrolling="no">
</iframe>
```

## References

- [MDN HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML)
- [p5.js Getting Started](https://p5js.org/get-started/)
