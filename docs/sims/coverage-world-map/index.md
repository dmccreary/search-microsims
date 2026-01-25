---
title: Coverage Applications Map
description: Interactive world map showing how the Dublin Core Coverage element applies to region-specific educational content
image: coverage-world-map.png
quality_score: 85
---

# Coverage Applications Map

Interactive world map demonstrating how the Dublin Core **Coverage** element applies differently across global regions with varying educational standards and curricula.

<iframe src="main.html" width="100%" height="450px" scrolling="no" style="border: none;"></iframe>

[View Fullscreen](main.html){:target="_blank"}

## About This MicroSim

This visualization helps students understand the Coverage element in Dublin Core metadata by exploring how educational content may have geographic or jurisdictional constraints. Different regions have different curriculum standards (Common Core, NGSS, GCSE, etc.) that affect how MicroSims should be tagged for discoverability.

### Learning Objective

Students will **differentiate** between global versus regional coverage needs by exploring how educational content may have geographic or jurisdictional constraints.

### Bloom's Taxonomy

- **Level**: Analyze (L4)
- **Verb**: differentiate

## How to Use

1. **Click a region** on the map to see coverage examples specific to that area
2. **Toggle between views**:
   - **Geographic View**: Shows regional curriculum standards and example MicroSims
   - **Temporal View**: Shows how time periods (Ancient, Medieval, Modern, etc.) apply as coverage
   - **Global**: Shows universal content that applies worldwide
3. **Compare regions** to understand why some content needs regional coverage tags while other content is universal

## Key Concepts Demonstrated

| Concept | Example |
|---------|---------|
| **Geographic Coverage** | US-specific content tagged with "Common Core" or "NGSS" |
| **Jurisdictional Coverage** | UK content aligned with "GCSE" or "A-Level" specifications |
| **Universal Content** | Physics simulations that work globally without modification |
| **Temporal Coverage** | Historical content covering specific time periods |

## Regions Covered

- **United States** - Common Core, NGSS, AP curriculum
- **European Union** - Bologna Process, ECTS, metric conventions
- **United Kingdom** - Key Stage 3-4, GCSE, A-Level
- **Asia-Pacific** - Various national curricula, STEM focus
- **Latin America** - Regional standards, Spanish/Portuguese content
- **Global** - Universal scientific and mathematical concepts

## Technical Notes

- Built with **Leaflet.js** for interactive map functionality
- Uses **CartoDB light tiles** for clean visual presentation
- Simplified GeoJSON regions for quick loading
- Responsive design for mobile devices

## Lesson Plan

### Objective

Students will be able to correctly apply the Coverage element when creating MicroSim metadata by distinguishing between region-specific and universal content.

### Activities

1. **Explore the map** (5 min): Click each region and read the coverage examples
2. **Compare two regions** (5 min): Identify which coverage values would differ for a "Pythagorean Theorem" MicroSim vs. a "US Constitution" MicroSim
3. **Practice tagging** (10 min): Given a list of MicroSim topics, determine appropriate Coverage values

### Assessment

Students can correctly identify:

- When Coverage is needed (region-specific content)
- When Coverage can be omitted or marked "global" (universal concepts)
- How to combine geographic and temporal coverage

## References

- [Dublin Core Coverage Element](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#coverage)
- [Common Core State Standards](https://www.corestandards.org/)
- [UK National Curriculum](https://www.gov.uk/government/collections/national-curriculum)
- [NGSS - Next Generation Science Standards](https://www.nextgenscience.org/)
