---
title: Difficulty Level Progression
description: Side-by-side comparison of beginner and intermediate pendulum simulations showing how the same concept can be presented with different levels of control complexity.
quality_score: 90
image: /sims/difficulty-progression/difficulty-progression.png
og:image: /sims/difficulty-progression/difficulty-progression.png
twitter:image: /sims/difficulty-progression/difficulty-progression.png
social:
   cards: false
---
# Difficulty Level Progression

<iframe src="main.html" height="502px" scrolling="no"></iframe>

[Run the Difficulty Level Progression MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

Place the following line in your website to include this in your course.

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/difficulty-progression/main.html" height="502px" scrolling="no"></iframe>
```

## Description

This MicroSim demonstrates how the same concept—pendulum motion—can be presented at different difficulty levels for different learners:

### Beginner Level (Left Panel)
- **1 Control**: Pendulum length only
- **Fixed Gravity**: Always 9.8 m/s² (Earth)
- **Focus**: Understanding the basic relationship between length and period
- **Formula shown**: T = 2π√(L/g) with g constant

### Intermediate Level (Right Panel)
- **2 Controls**: Pendulum length AND gravity
- **Variable Gravity**: 1-20 m/s² (Moon to Jupiter)
- **Focus**: Understanding how both length and gravity affect period
- **Added complexity**: Compare pendulums on different planets

## Key Learning Points

1. **Progressive Disclosure**: Start simple, add complexity as understanding grows
2. **Same Physics**: Both panels use the same underlying formula: T = 2π√(L/g)
3. **Scaffolded Learning**: Beginners master one variable before adding another

## Controls

| Control | Beginner | Intermediate |
|---------|----------|--------------|
| Length Slider | ✓ (0.5 - 2.0m) | ✓ (0.5 - 2.0m) |
| Gravity Slider | ✗ (fixed at 9.8) | ✓ (1 - 20 m/s²) |
| View Toggle | Both / Beginner / Intermediate |
| Start/Pause | Controls animation |
| Reset | Returns pendulums to starting position |
| Sync Length | Ensures both pendulums have same length |

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

- Compare the difference between beginner and intermediate level simulations
- Explain why simpler simulations can be more effective for introducing concepts
- Identify when to add complexity to educational content

### Classroom Activities

1. **Beginner Focus**: Have students use only the beginner panel to discover the length-period relationship
2. **Add Complexity**: Once they understand length, switch to intermediate and explore gravity effects
3. **Design Challenge**: Ask students to design what an "Advanced" level would include

### Discussion Questions

- Why is the beginner version easier to understand?
- When would you want to show both versions side-by-side?
- What additional controls might an "Advanced" version include?

## The Physics

The period of a simple pendulum is given by:

**T = 2π√(L/g)**

Where:
- T = period (seconds)
- L = pendulum length (meters)
- g = gravitational acceleration (m/s²)

The beginner version holds g constant, letting students focus on how L affects T.
The intermediate version lets students explore how both L and g affect T.

## References

- Galileo Galilei's original pendulum observations (1602)
- Young, H. D., & Freedman, R. A. (2019). *University Physics with Modern Physics*
