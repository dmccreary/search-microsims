---
title: JSON Syntax Validator
description: Interactive p5.js MicroSim where students type or load JSON, see the first syntax error underlined with its line and column, and apply the suggested fix until the document is valid.
image: /sims/json-syntax-validator/json-syntax-validator.png
og:image: /sims/json-syntax-validator/json-syntax-validator.png
twitter:image: /sims/json-syntax-validator/json-syntax-validator.png
social:
   cards: false
quality_score: 100
---

# JSON Syntax Validator

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the JSON Syntax Validator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can experiment with the code by pasting
[json-syntax-validator.js](./json-syntax-validator.js) into the
[p5.js Editor](https://editor.p5js.org/).

## About This MicroSim

JSON has only a handful of syntax rules, but every one of them is strict.
A single missing quote or extra comma makes the whole document unreadable
to a parser. This MicroSim lets you practice the rules the way developers
really learn them: write some JSON, read the error, fix it, and try again.

The left panel is a small code editor with line numbers and syntax colors:

| Color | Meaning |
|-------|---------|
| Purple | Keys |
| Green | String values |
| Blue | Numbers |
| Orange | Booleans (`true`, `false`) |
| Gray | `null` |
| Red | Text that is not legal JSON (single-quoted strings, bare words, comments) |

The right panel shows the result. When the JSON is broken you get the line
and column of the first error, a plain-language message, a suggested fix,
and a red mark next to the syntax rule that was broken. When the JSON is
valid the panel turns green and reports how many objects and arrays the
document contains.

Like every real JSON parser, the validator stops at the **first** error.
Fixing one error often reveals the next one, which is exactly how debugging
JSON works in practice.

## How to Use

1. Choose **Single quotes** from the **Load Example** list. The error is underlined in red.
2. Read the message and the **Fix** line, then edit the text in the editor.
   Click the error message to jump straight to the problem.
3. Keep fixing until the check mark turns green.
4. Work through the other examples: missing quote, trailing comma, invalid number,
   unquoted keys, missing comma, missing closing brace, and a comment.
5. Uncheck **Live validation** to test yourself. Load an example, predict whether it is valid
   and where the error is, then press **Validate** to check your prediction.
6. Press **Format** to pretty-print valid JSON with two-space indentation.
7. Press **Clear** and write your own JSON from scratch.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/json-syntax-validator/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will use JSON syntax rules to identify and fix common syntax errors
in real time, building muscle memory for correct JSON formatting.
(Bloom's Taxonomy: Apply)

### Grade Level

Undergraduate and adult learners (also suitable for high school computer science)

### Duration

15-20 minutes

### Prerequisites

- Knows that JSON stores data as key-value pairs and lists
- Has read the "JSON Syntax: The Building Blocks" section of
  [Chapter 5: JSON and Data Structures](../../chapters/05-json-and-data-structures/index.md)

### Activities

1. **Warm-up (3 min)**: Load **Valid example**. Ask students to name the data type of each value
   using the colors as a guide.
2. **Guided practice (7 min)**: Load each broken example in turn. For each one, students state
   which rule was broken before reading the message, then make the fix.
3. **Predict and check (5 min)**: Turn off **Live validation**. Students load an example or type
   their own JSON, write down their prediction (valid or invalid, and which line), then press
   **Validate**.
4. **Create (5 min)**: Press **Clear**. Students write a metadata object for a MicroSim of their
   choice with at least one string, one number, one boolean, one array, and one nested object.

### Assessment

- Can the student fix all eight broken examples without using the **Fix** hint?
- Can the student explain why `{"count": 042}` and `{"a": 1,}` are invalid?
- Can the student write a valid nested JSON object from scratch on the first or second attempt?

## References

1. [Introducing JSON](https://www.json.org/json-en.html) - json.org - The original railroad diagrams that define every JSON syntax rule on one page.
2. [RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259) - 2017 - IETF - The Internet standard for JSON, including the grammar for numbers and strings.
3. [ECMA-404: The JSON Data Interchange Syntax](https://ecma-international.org/publications-and-standards/standards/ecma-404/) - 2017 - Ecma International - The formal syntax standard.
4. [JSON](https://en.wikipedia.org/wiki/JSON) - Wikipedia - History, data types, and comparison with other formats.
5. [p5.js Reference](https://p5js.org/reference/) - p5.js - Documentation for the library used to build this MicroSim.
