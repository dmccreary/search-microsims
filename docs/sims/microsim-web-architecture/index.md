---
title: MicroSim Web Architecture
description: Technical diagram showing how MicroSims are embedded in web pages using iframes, with animated HTTP request/response flow.
quality_score: 90
image: /sims/microsim-web-architecture/microsim-web-architecture.png
og:image: /sims/microsim-web-architecture/microsim-web-architecture.png
twitter:image: /sims/microsim-web-architecture/microsim-web-architecture.png
social:
   cards: false
---
# MicroSim Web Architecture

<iframe src="main.html" height="502px" scrolling="no"></iframe>

[Run the MicroSim Web Architecture Fullscreen](./main.html){ .md-button .md-button--primary }

Place the following line in your website to include this in your course.

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/microsim-web-architecture/main.html" height="502px" scrolling="no"></iframe>
```

## Description

This technical diagram illustrates how MicroSims are embedded and displayed within web pages using iframe technology. The visualization shows:

- **Server**: Hosts the MicroSim files (main.html, script.js, style.css, metadata.json)
- **Browser**: Displays the host web page (e.g., an online textbook) with an embedded iframe
- **Iframe Container**: The isolated frame where the MicroSim runs independently
- **Zoomed View**: Detailed look at the MicroSim running inside the iframe

The animation demonstrates the HTTP request/response cycle as the browser requests and receives MicroSim files from the server.

## Key Concepts

1. **Iframe Isolation**: MicroSims run in their own document context, preventing JavaScript conflicts with the host page
2. **Portability**: The same MicroSim can be embedded in any webpage via a simple HTML tag
3. **Responsive Design**: Width adapts to container while height remains fixed
4. **Self-Contained**: All required files (HTML, JS, CSS) are delivered together

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

- Explain how iframes create isolated document contexts within web pages
- Describe the HTTP request/response cycle for loading embedded content
- Identify the key files that make up a MicroSim package

### Technical Details

```html
<iframe src="path/to/main.html"
        height="450px"
        width="100%"
        scrolling="no">
</iframe>
```

The iframe element provides:
- `src`: URL to the MicroSim's main.html file
- `height`: Fixed height matching the MicroSim's canvas
- `width`: Set to 100% for responsive behavior
- `scrolling="no"`: Prevents nested scroll areas

## References

- MDN Web Docs: [The Inline Frame element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- W3C: [HTML5 iframe specification](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)
