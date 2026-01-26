---
title: Aggregation Pipeline Simulator
description: Interactive simulation of a data aggregation pipeline processing MicroSim metadata through normalization, deduplication, validation, and enrichment stages
image: aggregation-pipeline-sim.png
quality_score: 88
---

# Aggregation Pipeline Simulator

<iframe src="main.html" width="100%" height="580px" scrolling="no" style="border:none; overflow:hidden;"></iframe>

[View Full Screen](main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive simulation demonstrates how a data aggregation pipeline processes MicroSim metadata records. Watch as sample records flow through four processing stages: normalization, deduplication, validation, and enrichment.

### Key Features

- **8 sample input records** with varying data quality
- **4 pipeline stages** with visual processing
- **Real-time statistics** tracking outcomes
- **Processing logs** showing transformations
- **Step-through or batch processing** modes

### Pipeline Stages

| Stage | Purpose | Example Transformation |
|-------|---------|----------------------|
| **Normalize** | Standardize field names | `name` → `title`, `topic` → `subject` |
| **Deduplicate** | Remove duplicate entries | Merge by URL/title |
| **Validate** | Check required fields | Reject if missing title/description |
| **Enrich** | Add computed fields | Quality score, timestamps |

### Sample Records

The simulator includes 8 sample records demonstrating different scenarios:

- **Valid records** (green) - Complete metadata, passes all stages
- **Needs normalization** (blue) - Uses legacy field names
- **Duplicates** (yellow) - Same content from forked repositories
- **Invalid** (red) - Missing required fields

### Learning Objectives

After using this simulation, students will be able to:

1. **Execute** a data aggregation pipeline step-by-step
2. **Observe** how each stage transforms the data
3. **Identify** which records pass or fail validation

## Lesson Plan

### Grade Level
Undergraduate / Graduate (Data Engineering, ETL Pipelines)

### Duration
25-30 minutes

### Materials Needed
- This simulation
- Understanding of JSON data formats

### Procedure

1. **Introduction (5 min)**: Explain the challenge of combining data from multiple sources with varying formats

2. **Step-Through Mode (10 min)**:
   - Click "Process Next" for each record
   - Enable "Show Logs" to see transformations
   - Observe how different record types are handled

3. **Batch Processing (5 min)**:
   - Reset the simulation
   - Click "Process All" to watch the full pipeline
   - Note the final statistics

4. **Analysis (5 min)**:
   - What percentage of records succeeded?
   - Which stage rejected the most records?
   - How do quality scores vary?

5. **Discussion (5 min)**:
   - Why normalize before deduplication?
   - What other validation rules might be useful?
   - How would you handle partial data?

### Assessment

Students should be able to:
- Explain the purpose of each pipeline stage
- Predict whether a given record will pass or fail
- Describe how normalization handles legacy field names

## Technical Details

**Framework**: p5.js

**Canvas Size**: Responsive width, 560px height

**Interaction**: Button controls, speed slider, log toggle

## References

- [Chapter 9: Data Pipelines and Aggregation](../../chapters/09-data-pipelines-aggregation/index.md)
- [ETL Pipeline Design Patterns](https://en.wikipedia.org/wiki/Extract,_transform,_load)
