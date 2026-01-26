---
title: Repository Discovery Flow
description: Interactive funnel diagram showing how repositories are filtered through multiple stages to identify MicroSim collections
image: repo-discovery-flow.png
quality_score: 87
---

# Repository Discovery Flow

<iframe src="main.html" width="100%" height="560px" scrolling="no" style="border:none; overflow:hidden;"></iframe>

[View Full Screen](main.html){ .md-button .md-button--primary }

## About This MicroSim

This funnel visualization shows how repositories are progressively filtered to identify those containing MicroSim collections. Starting from 100 repositories, the funnel narrows at each filtering stage until only 15 active MicroSim repositories remain.

### Key Features

- **5-stage funnel** showing progressive filtering
- **Animated repository flow** visualizing the filtering process
- **Hover tooltips** explaining each filter criterion
- **Show/hide rejected** toggle to see filtered repositories
- **Conversion statistics** showing overall success rate

### Filtering Stages

| Stage | Repositories | Filter Criterion |
|-------|-------------|------------------|
| All Repositories | 100 | Starting point |
| Name/Description | 40 | Keywords: course, tutorial, microsim |
| Structure Check | 25 | Has docs/sims/ directory |
| Metadata Presence | 18 | Valid metadata.json exists |
| Active | 15 | Updated within last year |

### Learning Objectives

After using this simulation, students will be able to:

1. **Examine** the multi-stage repository filtering process
2. **Analyze** conversion rates at each filtering stage
3. **Identify** which criteria cause the most repository rejection

## Lesson Plan

### Grade Level
Undergraduate / Graduate (Data Engineering, Information Science)

### Duration
15-20 minutes

### Procedure

1. **Introduction (3 min)**: Discuss why filtering is necessary when dealing with large data sources

2. **Guided Exploration (7 min)**:
   - Hover over each stage to read the filter criteria
   - Note the drop-off counts between stages
   - Calculate the conversion rate at each stage

3. **Animation Mode (5 min)**:
   - Click "Animate Flow" to watch repositories flow through
   - Toggle "Show Rejected" to see filtered repositories exit

4. **Discussion (5 min)**:
   - Which stage has the highest rejection rate? Why?
   - How would you improve the filtering strategy?
   - What's the cost of false positives vs false negatives?

### Assessment

Students should explain:
- Why the name/description filter has the highest rejection rate
- The purpose of the structure check stage
- Why we filter for recent activity

## Technical Details

**Framework**: p5.js

**Canvas Size**: Responsive width, 540px height

**Interaction**: Hover tooltips, animation toggle, show rejected toggle

## References

- [Chapter 9: Data Pipelines and Aggregation](../../chapters/09-data-pipelines-aggregation/index.md)
