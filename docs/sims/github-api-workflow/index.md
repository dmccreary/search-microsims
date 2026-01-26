---
title: GitHub API Workflow
description: Interactive flowchart showing the sequence of GitHub API calls needed to discover and extract MicroSim metadata from repositories
image: github-api-workflow.png
quality_score: 86
---

# GitHub API Workflow

<iframe src="main.html" width="100%" height="560px" scrolling="no" style="border:none; overflow:hidden;"></iframe>

[View Full Screen](main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive workflow visualization shows the complete sequence of GitHub API calls needed to discover MicroSims across repositories. It traces the flow from listing user repositories through directory traversal to metadata extraction.

### Key Features

- **12 connected workflow steps** showing the complete discovery process
- **Hover tooltips** with detailed explanations for each step
- **API call badges** indicating which steps make GitHub API requests
- **Decision diamonds** showing branching logic
- **Loop indicators** for iterative processing
- **Animation mode** to trace the data flow

### Learning Objectives

After using this simulation, students will be able to:

1. **Explain** the sequence of API calls required for MicroSim discovery
2. **Identify** decision points in the crawling workflow
3. **Trace** data flow from repositories to aggregated collection

## Lesson Plan

### Grade Level
Undergraduate / Graduate (Computer Science, Data Engineering)

### Duration
20-25 minutes

### Materials Needed
- This simulation
- Access to GitHub API documentation

### Procedure

1. **Introduction (3 min)**: Discuss the challenge of discovering content across distributed repositories

2. **Guided Exploration (8 min)**: Walk through the workflow steps:
   - Hover over each step to read the tooltip
   - Note which steps make API calls (blue boxes)
   - Identify the two decision points
   - Observe the loop structures

3. **Animation Mode (5 min)**: Click "Animate Flow" to watch data move through the pipeline

4. **Discussion (5 min)**:
   - Why do we filter repositories before checking for sims?
   - What happens when metadata validation fails?
   - How do the two loops (repos and sims) nest together?

5. **Extension Activity**: Compare this workflow to another API-based data collection you've encountered

### Assessment

Ask students to:
- List the 3 API endpoints used in this workflow
- Explain why we check for directory existence before listing contents
- Describe what happens to invalid metadata

## Technical Details

**Framework**: p5.js

**Canvas Size**: Responsive width, 540px height (480px draw area + 60px controls)

**Interaction**: Hover for tooltips, click to animate

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Chapter 9: Data Pipelines and Aggregation](../../chapters/09-data-pipelines-aggregation/index.md)
