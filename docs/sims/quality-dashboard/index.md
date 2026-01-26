---
title: Collection Quality Dashboard
description: Multi-panel dashboard for assessing MicroSim collection quality with metrics on subject distribution, quality scores, grade coverage, and field completeness
image: quality-dashboard.png
quality_score: 89
---

# Collection Quality Dashboard

<iframe src="main.html" width="100%" height="580px" scrolling="no" style="border:none; overflow:hidden;"></iframe>

[View Full Screen](main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive dashboard provides a comprehensive view of MicroSim collection quality. Multiple visualization panels display different aspects of the collection, enabling educators and administrators to assess coverage, identify gaps, and prioritize improvement efforts.

### Dashboard Panels

| Panel | Purpose | Key Metrics |
|-------|---------|-------------|
| **Collection Overview** | Total count and trend | 432 MicroSims, +14 from last crawl |
| **Subject Distribution** | Balance across subjects | Mathematics leads with 145 |
| **Quality Score** | Overall quality breakdown | 76% average, donut chart |
| **Grade Levels** | Coverage by education level | Grades 9-12 most represented |
| **Field Completeness** | Metadata quality | 9 fields tracked, color-coded |
| **Repository Contributions** | Source breakdown | Top 5 repos as treemap |

### Key Features

- **6 coordinated visualization panels**
- **Color-coded quality indicators** (red/yellow/green)
- **Trend indicators** showing changes since last crawl
- **Field completeness grid** with progress bars
- **Repository treemap** sized by contribution

### Learning Objectives

After using this simulation, students will be able to:

1. **Assess** overall collection quality from multiple metrics
2. **Identify** areas needing improvement (low completeness fields)
3. **Evaluate** balance across subjects and grade levels

## Lesson Plan

### Grade Level
Undergraduate / Graduate (Data Quality, Educational Technology)

### Duration
20-25 minutes

### Materials Needed
- This dashboard visualization
- Understanding of data quality metrics

### Procedure

1. **Introduction (3 min)**: Discuss why data quality matters for search systems

2. **Panel Exploration (10 min)**:
   - Start with Collection Overview - what's the overall health?
   - Examine Subject Distribution - is coverage balanced?
   - Check Quality Score distribution - what percentage is high quality?
   - Review Grade Levels - are all educational levels served?
   - Analyze Field Completeness - which fields need attention?
   - Study Repository Contributions - who are the top contributors?

3. **Quality Assessment (5 min)**:
   - Which metrics indicate good collection health?
   - Which areas need improvement?
   - What's the relationship between repository quality and count?

4. **Discussion (5 min)**:
   - How would you prioritize improvement efforts?
   - What's the cost of low completeness in learningObjectives vs. title?
   - How often should quality metrics be reviewed?

### Assessment

Students should be able to:
- Interpret the quality score donut chart
- Identify the field with lowest completeness
- Explain why required fields (*) have 100% completeness
- Recommend 3 specific improvement actions

## Technical Details

**Framework**: p5.js

**Canvas Size**: Responsive width, 560px height

**Visualization Types**: Bar charts, donut chart, grid, treemap

## References

- [Chapter 9: Data Pipelines and Aggregation](../../chapters/09-data-pipelines-aggregation/index.md)
- [Data Quality Dimensions](https://en.wikipedia.org/wiki/Data_quality)
