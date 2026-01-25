---
title: User Interface and Controls
description: Design intuitive MicroSim interfaces with appropriate interaction levels, control widgets, and layout patterns that enhance rather than hinder learning
generated_by: claude skill chapter-content-generator
date: 2026-01-24 21:30:00
version: 0.03
reading_level: college_freshman
---

# User Interface and Controls

## Summary

This chapter covers user interaction levels, control widgets, and layout patterns for MicroSim interfaces. You'll learn about interaction levels from passive viewing through high interaction, and the various user controls including sliders, buttons, dropdowns, checkboxes, radio buttons, text inputs, and color pickers. The chapter also covers layout types including fixed, two-panel, and three-panel layouts, as well as color scheme considerations. After completing this chapter, students will be able to design effective user interfaces for MicroSims.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Interaction Level
2. Passive Viewing
3. Low Interaction
4. High Interaction
5. User Controls
6. Slider Control
7. Button Control
8. Start-Pause Button
9. Range Slider
10. Dropdown Select
11. Multi Select
12. Checkbox Control
13. Radio Button
14. Text Input
15. Color Picker
16. Layout Types
17. Fixed Layout
18. Two Panel Layout
19. Three Panel Layout
20. Color Scheme

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to MicroSims](../01-intro-to-microsims/index.md)
- [Chapter 12: Visualization Types](../12-visualization-types/index.md)

---

## Why Interface Design Is Your Superpower

You've created an amazing simulation with perfect physics, beautiful visuals, and sound pedagogy. But students open it and immediately ask: "What do I do?" They can't find the controls. They don't know what's clickable. They accidentally reset their work. Frustration mounts. Learning plummets.

Sound familiar? This is what happens when brilliant content meets poor interface design. The content itself might be perfect, but the *interface* stands between students and learning.

Great interface design is invisible—users don't notice it because everything just works. Poor interface design is painfully visible—users constantly fight it instead of learning. Your goal is invisibility.

This is where interface design becomes your superpower. When you master interaction levels, control widgets, and layout patterns, your MicroSims become intuitive. Students focus on the physics, not the controls. Teachers recommend your work because "students just get it."

Let's design some interfaces!

---

## Interaction Levels: How Much Control?

**Interaction level** describes how much user control a MicroSim provides, ranging from passive viewing (no control) to high interaction (extensive control).

### The Interaction Spectrum

| Level | User Role | Example |
|-------|-----------|---------|
| **Passive Viewing** | Watch only | Auto-playing animation |
| **Low Interaction** | Minimal control | Play/pause, hover for info |
| **Medium Interaction** | Some parameters | A few sliders, presets |
| **High Interaction** | Full control | Many parameters, custom scenarios |

### Choosing the Right Level

| Learning Goal | Appropriate Level |
|---------------|-------------------|
| **Introduction/overview** | Passive or low |
| **Concept demonstration** | Low to medium |
| **Guided exploration** | Medium |
| **Free experimentation** | High |
| **Assessment/practice** | Varies by task |

### Passive Viewing

**Passive viewing** means the user watches without input. The MicroSim runs automatically or follows a scripted sequence.

**When passive works:**

- Initial concept introduction
- Showing a complete process
- When interaction would distract
- Background demonstrations

**When passive fails:**

- When exploration aids understanding
- When individual pacing matters
- When discovery is the goal
- For extended learning sessions

Even "passive" MicroSims should include:

- Play/pause control (at minimum)
- Restart option
- Speed control if timing matters

### Low Interaction

**Low interaction** provides minimal controls—typically play/pause, reset, and perhaps hover for details.

**Characteristics:**

- 1-3 controls maximum
- Simple, obvious actions
- No parameter adjustment
- Focus stays on content

**Best for:**

- Beginners to a topic
- Short attention spans
- Clear learning paths
- Demonstrations with optional pausing

### High Interaction

**High interaction** gives users extensive control over parameters, modes, and scenarios.

**Characteristics:**

- Multiple adjustable parameters
- Mode switches or scenarios
- Data input capabilities
- Custom configurations
- Often includes reset and save

**Best for:**

- Deep exploration
- What-if analysis
- Advanced learners
- Open-ended investigation
- Research and experimentation

**Caution:** High interaction increases cognitive load. Use progressive disclosure to prevent overwhelm.

#### Diagram: Interaction Level Spectrum

<iframe src="../../sims/interaction-spectrum/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Interaction Level Spectrum Visualization</summary>
Type: infographic

Bloom Level: Understand (L2)
Bloom Verb: classify

Learning Objective: Students will classify MicroSims by interaction level by examining examples along a spectrum from passive to highly interactive.

Layout: Horizontal spectrum with example MicroSims positioned

Visual elements:
- Horizontal gradient bar from blue (passive) to green (high interaction)
- Spectrum labels: Passive → Low → Medium → High
- Example MicroSim thumbnails positioned on spectrum:
  - Passive: Auto-playing cell division animation
  - Low: Pendulum with play/pause only
  - Medium: Pendulum with length slider
  - High: Full physics simulator with many parameters
- Callout boxes describing characteristics of each level
- Control icons showing what controls each level includes

Interactive elements:
- Click any example to see detailed description
- Drag examples to test your classification
- Toggle: "Show control panels" (reveals interface for each)
- Quiz mode: Position new examples on spectrum

Spectrum detail:

**Passive (Left):**
- Icon: Play button only
- Controls: None or auto-play
- User role: Observer
- Example: "Watch cell division"

**Low (Left-center):**
- Icon: Play + Restart
- Controls: Play/pause, reset, hover
- User role: Controller
- Example: "Play/pause the pendulum"

**Medium (Center-right):**
- Icon: Play + 2-3 sliders
- Controls: Few parameters, presets
- User role: Explorer
- Example: "Adjust pendulum length"

**High (Right):**
- Icon: Many controls
- Controls: Many parameters, modes
- User role: Experimenter
- Example: "Full pendulum lab"

Color scheme:
- Passive: Blue
- Low: Light blue
- Medium: Green
- High: Dark green
- Examples: White cards with colored borders

Implementation: p5.js with draggable classification
</details>

---

## User Controls: The Interface Toolkit

**User controls** are the interactive elements that let users adjust parameters and trigger actions. Each control type has strengths and appropriate use cases.

### The Control Toolkit

| Control | Best For | Example Use |
|---------|----------|-------------|
| **Slider** | Continuous values | Pendulum length (0.1-2.0m) |
| **Button** | Discrete actions | Start, Reset, Export |
| **Dropdown** | One of many options | Select planet gravity |
| **Checkbox** | On/off toggles | Show velocity vectors |
| **Radio buttons** | One of few options | Select mode: A, B, or C |
| **Text input** | Precise values | Enter exact mass value |
| **Color picker** | Color selection | Choose background color |
| **Range slider** | Value range | Filter results 10-50 |

---

## Slider Control: Continuous Adjustment

**Sliders** let users adjust continuous values by dragging along a track. They're the most common MicroSim control because many parameters vary continuously.

### Slider Anatomy

```
      Label: Pendulum Length
      ├────────────●─────────┤
      0.1m                  2.0m
                Current: 1.2m
```

**Components:**

- **Label**: What this controls
- **Track**: The draggable range
- **Thumb/handle**: Current position
- **Min/max labels**: Range endpoints
- **Current value display**: Shows exact current value

### Slider Design Principles

**Appropriate range**: Don't include impossible values

- ✓ Pendulum length: 0.1m to 2.0m (realistic)
- ✗ Pendulum length: 0 to 100m (includes impossible values)

**Sensible defaults**: Start with educational values

- Not too extreme (edge cases are confusing)
- Not arbitrary (pick meaningful defaults)
- Often a "standard" or "canonical" case

**Appropriate step size**: Match precision needs

- Temperature: 1° steps (fine enough)
- Probability: 0.01 steps (percentages)
- Discrete counts: 1 step (integers only)

**Real-time feedback**: Update visualization immediately

- User drags → display updates instantly
- No "Apply" button needed for exploration
- Responsive feel encourages experimentation

### Range Slider: Selecting Intervals

A **range slider** selects a range (min and max) rather than a single value. It has two handles.

```
      Price Range
      ├───●──────────────●───┤
      $0                    $100
           $20        $75
```

**Use cases:**

- Filter results by range
- Select time intervals
- Define boundaries
- Set minimum and maximum thresholds

---

## Button Control: Discrete Actions

**Buttons** trigger discrete actions—things that happen once when clicked, not continuous adjustments.

### Button Types

| Button Type | Purpose | Example |
|-------------|---------|---------|
| **Action** | Do something now | "Start Simulation" |
| **Toggle** | Switch between states | "Play/Pause" |
| **Reset** | Return to initial state | "Reset" |
| **Navigation** | Move somewhere | "Next Step" |
| **Confirmation** | Confirm intent | "Apply Changes" |

### The Start-Pause Button

The **start-pause button** is essential for any animated MicroSim. It toggles between running and paused states.

**Design patterns:**

| Pattern | Icon (Running) | Icon (Paused) | Pros |
|---------|----------------|---------------|------|
| **Toggle icon** | ⏸ Pause | ▶ Play | Clear state indication |
| **Static icon** | ▶ (always) | ▶ (always) | Simpler, less clear |
| **Text toggle** | "Pause" | "Play" | Explicit, uses more space |

**Best practice**: Toggle the icon to show *what will happen* when clicked, not current state. When running, show pause icon (clicking will pause). When paused, show play icon (clicking will play).

### Button Design Principles

**Clear labeling**: Say what happens

- ✓ "Reset Simulation"
- ✗ "Go" (ambiguous)

**Obvious clickability**: Look like buttons

- Raised/bordered appearance
- Hover effects
- Cursor changes

**Consistent placement**: Same position across MicroSims

- Transport controls (play/pause) often bottom or top
- Reset often near other controls
- Dangerous actions (clear all) isolated or confirmed

**Appropriate prominence**: Important buttons stand out

- Primary actions: Large, colored
- Secondary actions: Smaller, muted
- Dangerous actions: Red, with confirmation

#### Diagram: Button State Design

<iframe src="../../sims/button-states/main.html" width="100%" height="400px" scrolling="no"></iframe>

<details markdown="1">
<summary>Button State Design Patterns</summary>
Type: diagram

Bloom Level: Remember (L1)
Bloom Verb: identify

Learning Objective: Students will identify the different states of interactive buttons by examining visual changes across normal, hover, active, and disabled states.

Layout: Grid showing button types and their states

Visual elements:
- 4 rows (button types): Primary, Secondary, Toggle, Destructive
- 4 columns (states): Normal, Hover, Active/Pressed, Disabled
- Each cell shows button appearance in that state
- Annotations explaining visual changes

Button type rows:

**Primary Button (Blue):**
- Normal: Blue background, white text
- Hover: Darker blue, slight lift shadow
- Active: Even darker, pressed appearance
- Disabled: Gray background, low opacity

**Secondary Button (Outlined):**
- Normal: White background, blue border
- Hover: Light blue fill
- Active: Darker blue fill
- Disabled: Gray border, faded

**Toggle Button (Play/Pause):**
- Normal (paused): Play icon, blue
- Normal (playing): Pause icon, blue
- Hover: Darker shade
- Disabled: Gray

**Destructive Button (Red):**
- Normal: Red background
- Hover: Darker red
- Active: Very dark red
- Disabled: Gray

Interactive elements:
- Hover over cells to see state change
- Click to see active state
- Toggle: "Show focus states" (accessibility)
- Annotations appear on hover

Color scheme:
- Primary: Blue (#3498db)
- Secondary: White with blue border
- Destructive: Red (#e74c3c)
- Disabled: Gray (#95a5a6)
- Hover states: 15% darker
- Active states: 25% darker

Implementation: p5.js with interactive state demonstration
</details>

---

## Dropdown Select: Choosing from Options

**Dropdowns** (select menus) let users choose one option from a list. They're space-efficient for many options.

### When to Use Dropdowns

| Scenario | Use Dropdown? |
|----------|---------------|
| 2-3 options | No—use radio buttons |
| 4-12 options | Yes—ideal range |
| 13+ options | Yes, with search/filter |
| Common option used 90%+ of time | Maybe—consider default with "change" option |

### Dropdown Design Principles

**Clear labeling**: What are you selecting?

```
  Gravitational Setting: [Earth (9.8 m/s²) ▼]
```

**Logical ordering**: Make options findable

- Alphabetical for long lists
- Frequency for common selections
- Logical sequence (e.g., small to large)

**Include current value**: Show what's selected

**Accessible sizing**: Large enough to tap on mobile

### Multi Select: Choosing Several

**Multi select** allows selecting multiple options from a list. Uses checkboxes within dropdown or tags interface.

**Use cases:**

- Select multiple subjects
- Choose visible layers
- Pick several filters simultaneously

---

## Checkbox Control: Boolean Toggles

**Checkboxes** control on/off, show/hide, or true/false settings. Each checkbox is independent.

### Checkbox Use Cases

| Use Case | Example |
|----------|---------|
| **Show/hide elements** | ☑ Show velocity vectors |
| **Enable/disable features** | ☑ Enable sound effects |
| **Filter options** | ☑ Include archived items |
| **Agreement/confirmation** | ☑ I understand the risks |

### Checkbox Design Principles

**Clear labels**: Describe the "on" state

- ✓ "Show grid lines"
- ✗ "Grid" (unclear what happens)

**Positive framing**: Checking should enable/show

- ✓ "Show labels" (check to show)
- ✗ "Hide labels" (confusing—check to hide?)

**Group related checkboxes**: Visual clustering aids scanning

**Immediate effect**: Changes apply without "Submit"

---

## Radio Button: Exclusive Choices

**Radio buttons** let users select exactly one option from a group. Selecting one deselects others.

### Radio Button vs. Dropdown

| Factor | Radio Buttons | Dropdown |
|--------|---------------|----------|
| **Options visible** | All visible at once | Only selected visible |
| **Space needed** | More (all shown) | Less (collapsed) |
| **Number of options** | 2-5 ideal | 4+ ideal |
| **Speed of selection** | One click | Two clicks |

### Radio Button Use Cases

| Scenario | Example |
|----------|---------|
| **Mode selection** | ◉ Explore Mode ○ Quiz Mode |
| **Speed presets** | ○ Slow ◉ Normal ○ Fast |
| **View options** | ○ Graph ◉ Table ○ Both |
| **Difficulty levels** | ○ Easy ◉ Medium ○ Hard |

### Radio Button Design Principles

**Always show all options**: Unlike dropdowns, radio buttons display every choice

**Default selection**: One option should start selected

**Logical grouping**: Related options together

**Clear differentiation**: Options should be distinct, not overlapping

---

## Text Input: Precise Values

**Text input** fields accept typed values—for when sliders aren't precise enough or values need exact specification.

### When to Use Text Input

| Scenario | Appropriate? |
|----------|--------------|
| Precise numerical value needed | Yes |
| Value might be copied/pasted | Yes |
| Range is very large | Yes |
| User comfort with typing | Yes |
| Quick exploration is goal | No—use slider |
| Avoiding typos is critical | No—use constrained controls |

### Text Input Design Principles

**Validate input**: Check for valid values

- Number inputs: Reject letters
- Range validation: Flag out-of-bounds
- Format hints: Show expected format

**Provide feedback**: Show validation status

- Green border: Valid
- Red border: Invalid
- Error message: What's wrong

**Connect to visualization**: Update on valid input

**Include units**: Show expected units

```
  Mass: [2.5] kg    ← Clear unit label
```

---

## Color Picker: Visual Selection

**Color pickers** let users select colors for customization, visualization mapping, or aesthetic preferences.

### Color Picker Use Cases

| Scenario | Example |
|----------|---------|
| **Customization** | Choose background color |
| **Object identification** | Pick color for my pendulum |
| **Data mapping** | Select color scale |
| **Accessibility** | High contrast mode |

### Color Picker Design

**Common patterns:**

- **Native picker**: Browser's built-in color selector
- **Preset palette**: Grid of predefined colors
- **Spectrum picker**: Full color space selection
- **Named colors**: Dropdown of color names

**For educational MicroSims**: Preset palettes usually suffice. Full spectrum pickers add complexity without learning benefit.

---

## Layout Types: Organizing the Interface

**Layout** determines how controls and visualization areas are arranged. Good layout makes interfaces intuitive; poor layout creates confusion.

### The Three Standard Layouts

| Layout | Structure | Best For |
|--------|-----------|----------|
| **Fixed** | Single area, no panels | Simple visualizations |
| **Two-panel** | Visualization + Controls | Most MicroSims |
| **Three-panel** | Viz + Controls + Info | Complex simulations |

### Fixed Layout

**Fixed layout** uses a single area with minimal structure. Controls may overlay the visualization or sit below.

```
┌────────────────────────────┐
│                            │
│      VISUALIZATION         │
│                            │
│    [Play] [Reset]          │
│                            │
└────────────────────────────┘
```

**Characteristics:**

- Simple, uncluttered
- Controls minimal or overlaid
- Works for low-interaction MicroSims
- Maximum space for visualization

**Best for:**

- Animations with few controls
- Demonstrations
- Mobile-first designs
- Passive or low-interaction levels

### Two-Panel Layout

**Two-panel layout** separates visualization from controls. Most common MicroSim layout.

```
┌────────────────────┬───────────┐
│                    │ Controls  │
│   VISUALIZATION    │           │
│                    │ [Slider]  │
│                    │ [Slider]  │
│                    │ [Button]  │
└────────────────────┴───────────┘
```

**Variations:**

- Controls on right (most common)
- Controls on left
- Controls below
- Controls above

**Characteristics:**

- Clear separation of view and control
- Scales well with more controls
- Works for medium interaction
- Controls always visible

**Best for:**

- Parameter exploration
- Most simulations
- Teaching interfaces
- Medium-interaction levels

### Three-Panel Layout

**Three-panel layout** adds an information/output area separate from controls and visualization.

```
┌────────────────────┬───────────┐
│                    │ Controls  │
│   VISUALIZATION    ├───────────┤
│                    │ Info/     │
│                    │ Output    │
└────────────────────┴───────────┘
```

**The third panel shows:**

- Calculated values
- Status information
- Data tables
- Instructions or guidance
- Feedback messages

**Best for:**

- Complex simulations
- When output data matters
- Teaching with explicit feedback
- High-interaction levels

#### Diagram: Layout Pattern Gallery

<iframe src="../../sims/layout-patterns/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>MicroSim Layout Pattern Gallery</summary>
Type: infographic

Bloom Level: Apply (L3)
Bloom Verb: select

Learning Objective: Students will select appropriate layout patterns for different MicroSim scenarios by examining layout options and matching them to requirements.

Layout: Three-column gallery with interactive examples

Visual elements:
- Three columns for Fixed, Two-Panel, Three-Panel
- Each column shows:
  - Layout diagram (schematic)
  - Live mini-example (functional)
  - Pros and cons list
  - "Best for" summary
- Comparison table below

Column content:

**Fixed Layout:**
- Diagram: Single rectangle
- Mini-example: Simple pendulum animation with overlay controls
- Pros: Maximum viz space, simple, mobile-friendly
- Cons: Limited controls, overlay can obscure
- Best for: Animations, demos, passive viewing

**Two-Panel Layout:**
- Diagram: Large left rectangle + narrow right rectangle
- Mini-example: Pendulum with control sidebar
- Pros: Clear separation, scalable controls, always visible
- Cons: Uses horizontal space, less viz area
- Best for: Most simulations, exploration, medium interaction

**Three-Panel Layout:**
- Diagram: Large left + narrow right (split top/bottom)
- Mini-example: Full pendulum lab with data output
- Pros: Dedicated info area, rich feedback, comprehensive
- Cons: Complex, crowded on small screens
- Best for: Complex labs, high interaction, data-rich

Interactive elements:
- Click any layout to see full-size example
- Toggle: "Show on mobile" (responsive behavior)
- Match quiz: Given scenario, pick best layout
- Resize demo: See how layouts adapt

Comparison table:
| Aspect | Fixed | Two-Panel | Three-Panel |
|--------|-------|-----------|-------------|
| Viz space | Maximum | Good | Less |
| Control capacity | Minimal | Medium | High |
| Info display | Overlay | Limited | Dedicated |
| Mobile-friendly | Best | Good | Challenging |
| Complexity | Low | Medium | High |

Color scheme:
- Visualization area: Blue
- Control area: Green
- Info area: Orange
- Inactive: Gray

Implementation: p5.js with switchable layouts and mini-examples
</details>

---

## Color Scheme: Visual Harmony

**Color scheme** affects usability, aesthetics, and accessibility. Thoughtful color choices enhance learning; poor choices distract or exclude.

### Color Scheme Functions

| Function | How Color Helps |
|----------|-----------------|
| **Grouping** | Same color = related elements |
| **Emphasis** | Bright/contrasting = important |
| **Status** | Red = error, green = success |
| **Hierarchy** | Darker = primary, lighter = secondary |
| **Aesthetics** | Pleasing colors = positive experience |

### Choosing a Color Palette

**Start with brand/context colors** if any exist. Otherwise:

1. **Pick a primary color**: Main action/emphasis color
2. **Choose 1-2 accent colors**: Secondary emphasis
3. **Define neutrals**: Backgrounds, text, borders
4. **Add semantic colors**: Success, error, warning

### Semantic Color Conventions

| Meaning | Typical Color | Use |
|---------|---------------|-----|
| **Success** | Green | Correct answer, success message |
| **Error** | Red | Wrong answer, error message |
| **Warning** | Yellow/Orange | Caution, partial |
| **Information** | Blue | Neutral info, hints |
| **Disabled** | Gray | Unavailable options |

### Accessibility Considerations

| Issue | Solution |
|-------|----------|
| **Color blindness** | Don't rely on color alone; add icons/text |
| **Low contrast** | Ensure 4.5:1 text contrast ratio |
| **Busy backgrounds** | Use solid backgrounds for text |
| **Too many colors** | Limit palette to 5-7 colors |

### Dark Mode Support

Consider supporting both light and dark color schemes:

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | White/light gray | Dark gray/black |
| Text | Dark gray/black | White/light gray |
| Primary | Saturated blue | Lighter blue |
| Borders | Light gray | Dark gray |

!!! tip "Test with Simulation Tools"
    Use browser developer tools or online simulators to check how your colors appear to color-blind users. What's obvious to you might be invisible to others.

---

## Responsive Design: Adapting to Devices

MicroSims should work across devices—from large monitors to tablets to phones. This requires **responsive design**.

### Responsive Strategies

| Strategy | How It Works |
|----------|--------------|
| **Fluid sizing** | Elements resize with window |
| **Breakpoints** | Different layouts at different widths |
| **Stacking** | Side-by-side becomes vertical on narrow |
| **Hiding** | Less important elements hidden on small |
| **Touch optimization** | Larger targets on touch devices |

### MicroSim Responsive Patterns

**Common adaptations for narrow screens:**

| Desktop | Mobile |
|---------|--------|
| Two-panel side-by-side | Stacked (viz above controls) |
| Small buttons | Large touch targets |
| Hover tooltips | Tap-to-reveal info |
| Many controls visible | Progressive disclosure |
| Mouse dragging | Touch dragging |

### Touch Considerations

| Mouse | Touch Equivalent |
|-------|------------------|
| Hover | Tap and hold |
| Click | Tap |
| Drag | Swipe/drag |
| Scroll wheel | Pinch zoom |
| Right-click | Long press |

**Touch-friendly design:**

- Minimum 44×44 pixel touch targets
- Spacing between targets
- No hover-only information (provide alternatives)
- Gestures that don't conflict with browser

---

## Control Organization: Grouping and Hierarchy

When MicroSims have many controls, organization becomes critical. Users should find what they need quickly.

### Grouping Strategies

| Strategy | How It Helps |
|----------|--------------|
| **Spatial grouping** | Related controls near each other |
| **Visual borders** | Boxes or dividers separate groups |
| **Labeled sections** | Headers identify control groups |
| **Tabs** | Different groups on different tabs |
| **Accordions** | Expandable sections hide complexity |

### Example: Organized Control Panel

```
┌─ Pendulum Properties ─────────┐
│ Length    ├────●────┤  1.5m  │
│ Mass      ├──●──────┤  0.5kg │
└───────────────────────────────┘

┌─ Environment ─────────────────┐
│ Gravity   [Earth (9.8)    ▼]  │
│ ☑ Show air resistance         │
└───────────────────────────────┘

┌─ Display Options ─────────────┐
│ ☑ Show velocity vector        │
│ ☐ Show acceleration vector    │
│ ☐ Show energy graph           │
└───────────────────────────────┘

     [▶ Start]    [↺ Reset]
```

**Organization principles applied:**

- Related controls grouped (Pendulum, Environment, Display)
- Section headers identify groups
- Most-used controls first
- Action buttons at bottom

### Control Hierarchy

**Primary controls**: Always visible, most-used

- Start/pause, main parameters

**Secondary controls**: Visible but less prominent

- Additional parameters, display options

**Tertiary controls**: Hidden until needed

- Advanced settings, export options

Use progressive disclosure: Start simple, reveal more on request.

---

## Labels and Instructions

Good labels and instructions reduce confusion and cognitive load.

### Label Design Principles

**Be specific**: Say exactly what it controls

- ✓ "Pendulum Length (m)"
- ✗ "Length"

**Include units**: Prevent conversion confusion

- ✓ "Mass: 2.5 kg"
- ✗ "Mass: 2.5"

**Use standard terms**: Match domain vocabulary

- ✓ "Period" (physics term)
- ✗ "Swing time" (informal)

**Abbreviate carefully**: Only well-known abbreviations

- ✓ "kg" for kilogram
- ✗ "pen. len." for pendulum length

### Instruction Placement

| Type | Placement | Example |
|------|-----------|---------|
| **Overall purpose** | Top of MicroSim | "Explore how pendulum length affects period" |
| **Control instructions** | Near control | "Drag slider to adjust" |
| **Tooltips** | On hover/tap | "Length of pendulum string in meters" |
| **Guided steps** | Prominent panel | "Step 1: Set length to 1m" |
| **Help panel** | Expandable section | Detailed instructions if needed |

### Error Messages

When users make errors (invalid input, impossible values):

**Be helpful, not scolding:**

- ✓ "Please enter a value between 0 and 10"
- ✗ "Invalid input!"

**Be specific about what's wrong:**

- ✓ "Mass must be positive (you entered -5)"
- ✗ "Value error"

**Suggest correction:**

- ✓ "Try a value like 2.5"
- ✗ "Fix your input"

---

## Key Takeaways

1. **Interaction level** ranges from passive viewing through high interaction—choose based on learning goal and audience

2. **Low interaction** focuses attention on content; **high interaction** enables exploration but increases cognitive load

3. **Sliders** are ideal for continuous parameters—ensure sensible range, step size, and real-time feedback

4. **Buttons** trigger discrete actions—use clear labels and appropriate visual prominence

5. **Start-pause buttons** should show what will happen when clicked, not current state

6. **Dropdowns** work for 4+ options; use radio buttons for 2-3 mutually exclusive choices

7. **Checkboxes** control independent on/off settings; label with the "on" state positively

8. **Text inputs** provide precision but require validation and clear error handling

9. **Fixed layout** maximizes visualization space; **two-panel** is the workhorse; **three-panel** handles complex data output

10. **Color schemes** should use semantic colors consistently (red=error, green=success) and ensure accessibility

11. **Responsive design** adapts layouts for different devices—stack panels and enlarge touch targets on mobile

12. **Group related controls** with visual organization and clear section headers

13. **Labels should be specific, include units**, and use domain-appropriate terminology

---

## What's Next?

You now understand how to design intuitive MicroSim interfaces—choosing appropriate interaction levels, selecting the right controls, organizing layouts, and using color effectively. Good interface design makes the technology invisible so learning can shine.

In the next chapter, we'll explore **Technical Implementation**:

- JavaScript libraries for MicroSim development
- Responsive design techniques
- Accessibility requirements
- Performance optimization

The interface design principles you've learned here will be implemented through specific technologies and best practices.

---

*Ready to build? Continue to [Chapter 14: Technical Implementation](../14-technical-implementation/index.md).*
