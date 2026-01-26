---
title: Button State Design
description: Interactive grid showing button types (Primary, Secondary, Toggle, Destructive) and their visual states (Normal, Hover, Active, Disabled)
image: /sims/button-states/button-states.png
og:image: /sims/button-states/button-states.png
twitter:image: /sims/button-states/button-states.png
quality_score: 85
social:
   cards: false
---

# Button State Design Patterns

<iframe src="main.html" height="402px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim demonstrates the visual design patterns for interactive buttons across different types and states.

### Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/search-microsims/sims/button-states/main.html"
        height="402px" width="100%" scrolling="no"></iframe>
```

## Description

The Button States diagram shows a grid of four button types across four visual states:

### Button Types (Rows)
1. **Primary** - Main action buttons with solid color fill
2. **Secondary** - Alternative actions with outlined style
3. **Toggle** - Play/Pause buttons that switch between states
4. **Destructive** - Delete/Remove actions in red for warning

### Visual States (Columns)
1. **Normal** - Default resting state
2. **Hover** - When mouse is over the button (darker, lift shadow)
3. **Active** - When button is being clicked (pressed appearance)
4. **Disabled** - When action is unavailable (grayed out)

### Interactive Features
- Hover over any button to see a description of that state
- Toggle "Show Focus States" to see accessibility focus rings
- Click buttons to see the active state

## Learning Objectives

After using this MicroSim, students will be able to:

1. **Identify** the four common button states in user interfaces
2. **Recognize** visual cues that indicate button interactivity
3. **Apply** appropriate button styling in their own MicroSim designs

## Lesson Plan

### Introduction (3 minutes)
- Ask: "How do you know if something on a screen is clickable?"
- Discuss visual affordances and feedback

### Exploration (7 minutes)
1. Examine each button type and its purpose
2. Hover over buttons to see state transitions
3. Enable focus states to discuss accessibility

### Discussion (5 minutes)
- Why use different colors for destructive actions?
- What makes the toggle button different from others?
- Why is the disabled state important?

### Application (10 minutes)
- Have students identify button states in their favorite apps
- Design a button set for a specific MicroSim use case

## References

- [User Interface Controls](../../chapters/13-user-interface-controls/index.md)
- [WCAG 2.1 Button Guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
