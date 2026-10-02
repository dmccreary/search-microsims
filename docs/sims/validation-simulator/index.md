---
title: Validation Feedback Simulator
description: Interactive p5.js MicroSim where students read schema validation feedback for MicroSim metadata, locate each error in a JSON editor, and correct the document until it is valid.
image: /sims/validation-simulator/validation-simulator.png
og:image: /sims/validation-simulator/validation-simulator.png
twitter:image: /sims/validation-simulator/validation-simulator.png
social:
   cards: false
quality_score: 100
---

# Validation Feedback Simulator

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Validation Feedback Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can experiment with the code by pasting
[validation-simulator.js](./validation-simulator.js) into the
[p5.js Editor](https://editor.p5js.org/).

## About This MicroSim

A document can be perfectly good JSON and still be the wrong shape. Syntax
rules say where the quotes and commas go. A **schema** says which properties
must be present, what type each value must be, and which values are allowed.

This MicroSim acts like a schema validator for MicroSim metadata. The editor
on the left holds a `metadata.json` document. The panel on the right lists
every problem the validator found:

| Marker | Meaning | What to do |
|--------|---------|------------|
| Red circle with an X | **Error**: the document violates the schema | Must be fixed |
| Yellow triangle | **Warning**: valid, but a quality suggestion | Consider improving |
| Green check mark | **Valid**: the document matches the schema | Ready to use |

Each issue reports the same four facts a real validator gives you: the
message, the **location** as a path such as `/educational/difficulty`, the
current **value**, and what was **expected**. Lines with issues are marked in
the gutter of the editor.

The validator checks the teaching version of the schema from Chapter 5:

- `dublinCore` is the only required section
- `title`, `creator`, `subject`, `description`, `date`, `format`, and `rights` are required
- `title` must be 3 to 100 characters, `date` must look like `YYYY-MM-DD`,
  and `subject` must contain at least one string
- `gradeLevel`, `difficulty`, and `bloomsTaxonomy` must use values from a fixed list

## How to Use

1. The MicroSim starts with a document that has **three errors**. Read the three messages.
2. **Click an issue** to open its details. The editor jumps to the line and selects the problem.
3. Decide how to fix it, then **edit the JSON**. The document is checked again on every keystroke,
   and the issue disappears from the list when it is fixed.
4. Watch the **progress bar** count the issues you have fixed.
5. If you are stuck, check **Show hints** to see a suggested fix for the selected issue.
6. Press **Auto-fix** to see which problems a program can repair by itself (a misspelled key,
   a value such as `"Easy"` that has an obvious replacement, wrong quotes) and which ones need
   information only a person can supply (a missing description, an empty subject list).
7. Use **Load Example** to practice one kind of error at a time, and **Reset to Original** to
   start an example again.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/validation-simulator/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will distinguish between valid and invalid JSON metadata by analyzing
validation feedback and correcting errors to produce schema-compliant documents.
(Bloom's Taxonomy: Analyze)

### Grade Level

Undergraduate and adult learners

### Duration

15-20 minutes

### Prerequisites

- Can write valid JSON syntax
- Knows what required fields, data types, and enums are in a JSON Schema
- Has read the "Schema Validation: Checking Your Work" section of
  [Chapter 5: JSON and Data Structures](../../chapters/05-json-and-data-structures/index.md)

### Activities

1. **Classify (4 min)**: With hints off, students read the three starting errors and label each
   one: missing required field, wrong type, or invalid enum value.
2. **Repair (6 min)**: Students fix all three errors by editing the JSON and watch the progress
   bar reach 3 of 3.
3. **One at a time (5 min)**: Students load the *Array error* and *Misspelled key* examples and
   explain each message in their own words before fixing it.
4. **Human or machine? (3 min)**: Reset the three-error example and press **Auto-fix**. Discuss
   why the tool could repair one error but not the other two.
5. **Break it (2 min)**: Load *Valid metadata* and make it invalid in a way not shown in the
   examples. What does the validator report?

### Assessment

- Given an error message and location, can the student point to the line that must change?
- Can the student tell an error from a warning and explain the difference?
- Can the student explain why valid JSON syntax does not guarantee valid metadata?

## References

1. [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/) - json-schema.org - Explains `required`, `type`, `enum`, `minItems`, and the other keywords behind these error messages.
2. [JSON Schema Validation: A Vocabulary for Structural Validation of JSON](https://json-schema.org/draft/2020-12/json-schema-validation) - 2022 - json-schema.org - The specification of the validation keywords.
3. [RFC 6901: JavaScript Object Notation (JSON) Pointer](https://www.rfc-editor.org/rfc/rfc6901) - 2013 - IETF - Defines the `/dublinCore/title` path notation used in the Location field.
4. [MicroSim Schema documentation](../../microsim-schema.md) - This textbook - The full metadata schema that the teaching version is based on.
5. [p5.js Reference](https://p5js.org/reference/) - p5.js - Documentation for the library used to build this MicroSim.
