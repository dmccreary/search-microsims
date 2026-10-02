---
title: Array Operations Playground
description: Interactive p5.js MicroSim where students add, remove, reorder, and nest JSON array elements shown as connected boxes while the matching JSON text updates live.
image: /sims/json-array-playground/json-array-playground.png
og:image: /sims/json-array-playground/json-array-playground.png
twitter:image: /sims/json-array-playground/json-array-playground.png
social:
   cards: false
quality_score: 100
---

# Array Operations Playground

<iframe src="main.html" height="517px" width="100%" scrolling="no"></iframe>

[Run the Array Operations Playground MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can experiment with the code by pasting
[json-array-playground.js](./json-array-playground.js) into the
[p5.js Editor](https://editor.p5js.org/).

## About This MicroSim

A JSON array is an **ordered** list of values inside square brackets.
This MicroSim draws the array as a train of connected boxes. Each box is one
element, and the number under it is its **index**. Indexes always start at 0.

The **Live JSON** panel on the right shows the exact JSON text for the array
in the picture. Every operation you perform changes both views at the same
time, and the line that changed glows briefly so you can connect the picture
to the text.

| Box color | JSON type | Example |
|-----------|-----------|---------|
| Green | String | `"Physics"` |
| Blue | Number | `42` |
| Orange | Boolean | `true` |
| Purple, holding smaller boxes | Nested array | `[1, 2]` |

Under the JSON, the panel reports the array length, the last index, and
whether all the elements share one data type. Mixed types are valid JSON, but
they are poor practice in metadata because search tools expect every element
of an array to be the same kind of thing.

## How to Use

1. **Add an element.** The playground starts with a two-element array. Type a value, choose its
   type (string, number, or boolean), choose a position, and press **Add Element** (or press
   Enter). Watch the index numbers of the elements after it move up by one.
2. **Select and remove.** Click a box to select it, then press **Remove Selected**.
   The elements after it move down by one index.
3. **Reorder.** Drag a box to a new place in the train. The JSON order changes with it.
4. **Nest.** Press **Add Nested Array**. The new purple box is selected, so **Add Element** now
   puts values *inside* it. Click empty space to go back to adding to the main array.
5. **Practice goals.** Pick a goal from the list in the bottom row and build the array
   until the green check mark appears:
    - a subject array: `["Physics", "Mechanics", "Forces"]`
    - reorder Bloom levels by dragging
    - a 2D grid: `[[1, 2], [3, 4], [5, 6]]`
    - a mixed-type array, to see the warning it produces
6. Press **Copy JSON** to copy the array to the clipboard, or **Clear Array** to start over
   with the empty array `[]`.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/json-array-playground/main.html"
        height="517px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will demonstrate understanding of JSON array operations by adding,
removing, and reordering elements while observing the resulting JSON structure.
(Bloom's Taxonomy: Apply)

### Grade Level

Undergraduate and adult learners (also suitable for high school computer science)

### Duration

15-20 minutes

### Prerequisites

- Knows the six JSON data types
- Has read the "JSON Arrays: Ordered Collections" section of
  [Chapter 5: JSON and Data Structures](../../chapters/05-json-and-data-structures/index.md)

### Activities

1. **Explore (3 min)**: In free play, add three strings. Ask: what index does the first element
   have? What is the last index when the length is 3?
2. **Predict (4 min)**: Before each operation, students predict the new JSON. Add a value
   "at beginning" and explain why every other index changed. Remove the middle element and
   explain what happened to the indexes after it.
3. **Guided practice (6 min)**: Complete the *subject array*, *reorder by dragging*, and *2D grid* goals.
4. **Discuss (4 min)**: Complete the *mixed types* goal. Read the warning and discuss why a
   metadata field such as `subject` should hold only strings.
5. **Transfer (3 min)**: Students build the `learningObjectives` array for a MicroSim they know,
   press **Copy JSON**, and paste it into a metadata file.

### Assessment

- Can the student state the index of any element and the last index for a given length?
- Can the student produce a target array, including a nested one, without hints?
- Can the student explain why order matters in an array but not in an object?

## References

1. [Introducing JSON](https://www.json.org/json-en.html) - json.org - Syntax diagram for arrays: an ordered collection of values in square brackets.
2. [RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259) - 2017 - IETF - Section 5 defines arrays and notes that element types need not match.
3. [Array (data structure)](https://en.wikipedia.org/wiki/Array_(data_structure)) - Wikipedia - Background on indexes and zero-based numbering.
4. [p5.js Reference](https://p5js.org/reference/) - p5.js - Documentation for the library used to build this MicroSim.
