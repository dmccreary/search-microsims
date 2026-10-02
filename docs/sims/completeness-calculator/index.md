---
title: Completeness Score Calculator
description: Interactive p5.js MicroSim where students check off metadata fields and see how required, recommended, and optional field weights change the weighted and unweighted completeness score.
image: /sims/completeness-calculator/completeness-calculator.png
og:image: /sims/completeness-calculator/completeness-calculator.png
twitter:image: /sims/completeness-calculator/completeness-calculator.png
social:
   cards: false
quality_score: 100
---

# Completeness Score Calculator

<iframe src="main.html" height="557px" width="100%" scrolling="no"></iframe>

[Run the Completeness Score Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can experiment with the code by pasting
[completeness-calculator.js](./completeness-calculator.js) into the
[p5.js Editor](https://editor.p5js.org/).

## About This MicroSim

The **completeness score** measures how much of a metadata record has been
filled in. This MicroSim lets you fill in a record one field at a time and
watch the score respond.

The checklist on the left holds 40 metadata fields grouped by schema section.
The color in front of each field shows how much it counts:

| Color | Kind of field | Count | Weight |
|-------|---------------|-------|--------|
| Red | Required | 7 | 3 points each |
| Yellow | Recommended | 8 | 2 points each |
| Gray | Optional | 25 | 1 point each |

The **unweighted** score treats every field the same:

$$
\text{Completeness} = \frac{\text{Fields Populated}}{\text{Total Possible Fields}} \times 100
$$

The **weighted** score multiplies each field by its weight first, so a missing
title costs three times as much as a missing tag. With all 40 fields there are
$3 \times 7 + 2 \times 8 + 1 \times 25 = 62$ possible points.

The gauge in the center shows the score, a rating (Poor, Fair, Good, or
Excellent), and one to five stars. The three tick marks on the gauge are the
50%, 70%, and 90% targets. The panel on the right shows the formula with your
current numbers and tells you which fields would raise the score fastest.

## How to Use

1. The MicroSim starts with the seven **required** fields checked. Read the formula panel:
   $21 \div 62 = 34\%$.
2. **Check a recommended field** (yellow). The filled points go up by 2. Check an optional
   field (gray). They go up by 1.
3. Follow the **Add these to reach** list until the rating changes to *Fair*, then *Good*.
4. Switch between **Weighted** and **Unweighted**. Notice that the same record can earn two
   different scores.
5. Press **Minimal**, **Good**, or **Excellent** to load a sample record.
6. Press **Reset All** to clear every field, then rebuild the worked example from the chapter:
   check 5 required, 6 recommended, and 10 optional fields. The weighted score should be
   $37 \div 62 = 60\%$.
7. Press **Calculate** to replay the result from zero.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/completeness-calculator/main.html"
        height="557px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will calculate completeness scores for MicroSim metadata by filling
in fields and observing how the score changes based on field weights and population.
(Bloom's Taxonomy: Apply)

### Grade Level

Undergraduate and adult learners

### Duration

15 minutes

### Prerequisites

- Understands percentages and weighted averages
- Knows the difference between required and optional metadata fields
- Has read the "Completeness Score" section of
  [Chapter 5: JSON and Data Structures](../../chapters/05-json-and-data-structures/index.md)

### Activities

1. **Calculate by hand (4 min)**: Press **Reset All**. The instructor names a set of fields.
   Students compute the weighted and unweighted scores on paper, then check the fields and
   compare their answers with the formula panel.
2. **Fastest route (4 min)**: Starting from **Minimal**, what is the smallest number of
   additional fields that reaches 70% weighted? Students predict, then test.
3. **Compare the two scores (3 min)**: Find a record whose weighted score is at least 15 points
   higher than its unweighted score. Explain why.
4. **Limits of the metric (4 min)**: Load **Excellent**. Discuss the tip in the chapter: a record
   can be 100% complete and still be useless if every field says "TBD".

### Assessment

- Given counts of filled required, recommended, and optional fields, can the student compute
  both scores?
- Can the student explain why required fields move the weighted score more than optional fields?
- Can the student name the rating band for a given score?

## References

1. [Data quality](https://en.wikipedia.org/wiki/Data_quality) - Wikipedia - Overview of quality dimensions, including completeness.
2. [Dublin Core Metadata Element Set](https://www.dublincore.org/specifications/dublin-core/dces/) - Dublin Core Metadata Initiative - Definitions of the fields in the dublinCore section of the checklist.
3. [MicroSim Schema documentation](../../microsim-schema.md) - This textbook - The schema sections and fields used in the checklist.
4. [p5.js Reference](https://p5js.org/reference/) - p5.js - Documentation for the library used to build this MicroSim.
