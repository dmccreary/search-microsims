# Quiz: User Interface and Controls

Test your understanding of MicroSim interface design with these questions.

---

#### 1. What does "interaction level" describe in a MicroSim?

<div class="upper-alpha" markdown>
1. The speed of the animation
2. How much user control the MicroSim provides
3. The file size of the simulation
4. The color depth of the graphics
</div>

??? question "Show Answer"
    The correct answer is **B**. Interaction level describes how much user control a MicroSim provides, ranging from passive viewing (no control) to high interaction (extensive control). The appropriate level depends on the learning goal—introductions may need passive viewing while experimentation needs high interaction.

    **Concept Tested:** Interaction Level

---

#### 2. When is passive viewing an appropriate interaction level?

<div class="upper-alpha" markdown>
1. When students need to explore freely
2. For initial concept introduction or when interaction would distract
3. When teaching advanced mathematical proofs
4. When students are taking a test
</div>

??? question "Show Answer"
    The correct answer is **B**. Passive viewing is appropriate for initial concept introductions, showing complete processes, and situations where interaction would distract from the content. It works well for demonstrations and overviews where user control isn't needed for understanding.

    **Concept Tested:** Passive Viewing

---

#### 3. What type of control is best for adjusting a continuous numerical value like pendulum length?

<div class="upper-alpha" markdown>
1. Checkbox
2. Radio button
3. Slider
4. Text input only
</div>

??? question "Show Answer"
    The correct answer is **C**. Sliders are ideal for adjusting continuous numerical values within a defined range. They provide visual feedback, allow both precise adjustments and quick exploration, and make the valid range obvious. A pendulum length slider (0.5m to 2.0m) lets students smoothly explore values.

    **Concept Tested:** Slider Control

---

#### 4. When should you use radio buttons instead of checkboxes?

<div class="upper-alpha" markdown>
1. When users need to type values
2. When options are mutually exclusive (only one can be selected)
3. When there are more than 10 options
4. When the simulation needs to run faster
</div>

??? question "Show Answer"
    The correct answer is **B**. Radio buttons present mutually exclusive options where only one can be selected at a time—like choosing "Beginner," "Intermediate," or "Advanced" difficulty. Checkboxes are for non-exclusive options where multiple selections are valid simultaneously.

    **Concept Tested:** Radio Button, Checkbox Control

---

#### 5. What is a two-panel layout in MicroSim design?

<div class="upper-alpha" markdown>
1. A layout with two separate HTML files
2. A layout dividing the interface into two areas, typically for controls and visualization
3. A layout that only works on two types of devices
4. A layout with two different color schemes
</div>

??? question "Show Answer"
    The correct answer is **B**. A two-panel layout divides the MicroSim interface into two distinct areas, typically one for controls and one for visualization. This clear separation improves usability by grouping related elements and giving adequate space to both interaction and output.

    **Concept Tested:** Two Panel Layout

---

#### 6. What is the purpose of a start-pause button in a MicroSim?

<div class="upper-alpha" markdown>
1. To close the browser window
2. To toggle between starting and pausing an animation or simulation
3. To save the current settings
4. To change the color scheme
</div>

??? question "Show Answer"
    The correct answer is **B**. A start-pause button toggles between starting and pausing an animation or simulation. This control is essential for giving students time to observe, think, and predict—supporting pedagogical approaches that require pausing to process information before continuing.

    **Concept Tested:** Start-Pause Button

---

#### 7. What is the principle behind "high interaction" level?

<div class="upper-alpha" markdown>
1. The simulation runs at high speed
2. Users have extensive control with many parameters and custom scenarios
3. The graphics are highly detailed
4. Multiple users can interact simultaneously
</div>

??? question "Show Answer"
    The correct answer is **B**. High interaction means users have extensive control—many adjustable parameters, the ability to create custom scenarios, and freedom to explore the system thoroughly. This level is appropriate for free experimentation and when deep exploration aids understanding.

    **Concept Tested:** High Interaction

---

#### 8. When should you use a dropdown select control?

<div class="upper-alpha" markdown>
1. For binary yes/no choices
2. When presenting a list of options from which users select one item
3. For entering numerical values
4. For selecting colors visually
</div>

??? question "Show Answer"
    The correct answer is **B**. Dropdown select controls present a list of options from which users select one item. They're space-efficient (compact until opened) and work well when there are 4-15 options. For longer lists, they're better than displaying all options as radio buttons.

    **Concept Tested:** Dropdown Select

---

#### 9. Why should MicroSim designers aim for "invisible" interface design?

<div class="upper-alpha" markdown>
1. To hide the controls from users
2. So users focus on learning content rather than fighting the interface
3. To reduce file size
4. To prevent unauthorized access
</div>

??? question "Show Answer"
    The correct answer is **B**. Great interface design is "invisible"—users don't notice it because everything just works. When interfaces are intuitive, students focus on the physics (or other content) rather than figuring out controls. Poor interface design is painfully visible and distracts from learning.

    **Concept Tested:** User Controls

---

#### 10. What does a range slider control allow users to do?

<div class="upper-alpha" markdown>
1. Select a color from a palette
2. Select a range of values rather than a single value
3. Enter text input
4. Choose from a dropdown menu
</div>

??? question "Show Answer"
    The correct answer is **B**. A range slider allows users to select a range of values (minimum and maximum) rather than a single value. This is useful for filtering simulations by date range, setting bounds for parameter exploration, or defining a subset of a continuous range.

    **Concept Tested:** Range Slider
