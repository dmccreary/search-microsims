---
title: JSON Object Structure Visualizer
description: Interactive vis-network MicroSim that turns any JSON document into a left-to-right tree so students can see how objects, arrays, and values nest inside each other.
image: /sims/json-object-visualizer/json-object-visualizer.png
og:image: /sims/json-object-visualizer/json-object-visualizer.png
twitter:image: /sims/json-object-visualizer/json-object-visualizer.png
social:
   cards: false
quality_score: 100
---

# JSON Object Structure Visualizer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the JSON Object Structure Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

JSON text is a flat string of characters, but the data it describes is a tree.
Curly braces and square brackets tell you where one level ends and the next
begins, and that is hard to see when you are reading line after line of text.

This MicroSim reads a JSON document and draws its real shape. The **root** is
on the left. Each step to the right is one level deeper in the nesting.

| Shape | JSON type | Label |
|-------|-----------|-------|
| Large blue circle | Root (the top-level value) | `root` |
| Green rectangle | Object | key name and number of key-value pairs, such as `dublinCore {4}` |
| Orange rounded rectangle | Array | key name and length, such as `subject [3]` |
| Small green dot | String | key name and value |
| Small blue dot | Number | key name and value |
| Small orange dot | Boolean | key name and value |
| Small gray dot | Null | key name and `null` |

The sample document is MicroSim metadata with three sections
(`dublinCore`, `educational`, and `technical`), one array, and one object
nested inside another object.

## How to Use

1. **Read the tree from left to right.** Follow a line from `root` to any dot. The keys you pass
   through are the *path* to that value.
2. **Hover over a node** to see its path (for example `root.dublinCore.subject[1]`), its data type,
   its full value, and its parent.
3. **Click a green or orange box** to collapse it. Click again to expand it. The small triangle
   points down when the box is open and right when it is closed.
4. Press **Collapse All** to see only the top-level keys, then open one section at a time.
5. Uncheck **Show Values** to look at structure only (keys without values).
6. **Paste your own JSON** into the text box and press **Visualize**. Press **Load Sample** to return
   to the starting document.
7. Drag any node to rearrange the picture. Use the green arrow and zoom buttons to move around a
   large tree. (When you run the MicroSim fullscreen, the mouse wheel also zooms.)

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/json-object-visualizer/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will interpret the hierarchical structure of JSON objects by visualizing
nested key-value relationships as an interactive tree.
(Bloom's Taxonomy: Understand)

### Grade Level

Undergraduate and adult learners (also suitable for high school computer science)

### Duration

10-15 minutes

### Prerequisites

- Can recognize JSON objects `{ }`, arrays `[ ]`, and the four primitive types
- Has read the "JSON Objects: The Heart of Metadata" section of
  [Chapter 5: JSON and Data Structures](../../chapters/05-json-and-data-structures/index.md)

### Activities

1. **Predict (3 min)**: Before touching the tree, read the JSON in the text box. Ask students:
   How many top-level keys are there? How deep is the deepest value? Press **Collapse All**
   and expand one box at a time to check.
2. **Trace paths (4 min)**: Call out a value such as `600` or `"Electricity"`. Students write the
   path from `root`, then hover over the node to confirm it.
3. **Compare types (3 min)**: Students explain how the tree shows the difference between an object
   (children have names) and an array (children have index numbers).
4. **Apply (5 min)**: Students paste the `metadata.json` file of a real MicroSim and describe its
   structure in two sentences: how many sections, how deep, and which keys hold arrays.

### Assessment

- Given a path such as `root.technical.canvasSize.width`, can the student point to the node?
- Given a node, can the student write its path and name its data type?
- Can the student explain why `subject [3]` has children named `[0]`, `[1]`, and `[2]`?

## References

1. [Introducing JSON](https://www.json.org/json-en.html) - json.org - Defines objects, arrays, and values with syntax diagrams.
2. [RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259) - 2017 - IETF - The standard definition of JSON objects and arrays.
3. [Tree (abstract data type)](https://en.wikipedia.org/wiki/Tree_(abstract_data_type)) - Wikipedia - Root, parent, child, and depth terminology used in this MicroSim.
4. [vis-network Documentation](https://visjs.github.io/vis-network/docs/network/) - vis.js - The network library used to draw and interact with the tree.
