---
title: Dublin Core Elements
description: Comprehensive guide to all 15 Dublin Core metadata elements for describing MicroSims, with practical examples and best practices
generated_by: claude skill chapter-content-generator
date: 2026-01-24 14:30:00
version: 0.03
reading_level: college
---

# Dublin Core Elements

## Summary

This chapter provides detailed coverage of all 15 Dublin Core metadata elements used to describe MicroSims. You'll learn about each element including Title, Creator, Subject, Description, Publisher, Contributor, Date, Type, Format, Identifier, Source, Language, Relation, Coverage, and Rights. Understanding these elements enables you to create comprehensive metadata that improves discoverability and supports proper attribution. After completing this chapter, students will be able to apply all Dublin Core elements to MicroSim metadata.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Title Element
2. Creator Element
3. Subject Element
4. Description Element
5. Publisher Element
6. Contributor Element
7. Date Element
8. Type Element
9. Format Element
10. Identifier Element
11. Source Element
12. Language Element
13. Relation Element
14. Coverage Element
15. Rights Element

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Metadata Fundamentals](../03-metadata-fundamentals/index.md)

---

## Meet Your New Best Friends: The Dublin Core 15

In the previous chapter, we introduced Dublin Core as the universal language of metadata. Now it's time to get up close and personal with each of the 15 elements. Think of this chapter as a "meet the cast" episode—you'll learn what each element does, when to use it, and how to make it shine for your MicroSims.

Here's the exciting part: mastering these 15 elements gives you a superpower. When you know how to describe your MicroSims properly, you're not just organizing files—you're making your educational creations discoverable by teachers worldwide. That physics simulation you built last weekend? With the right Dublin Core metadata, it could help a student in Singapore understand wave mechanics tomorrow.

The 15 elements fall into three natural categories:

| Category | Elements | Purpose |
|----------|----------|---------|
| **Content** | Title, Subject, Description, Type, Source, Relation, Coverage | What is it about? |
| **Intellectual Property** | Creator, Publisher, Contributor, Rights | Who made it and how can it be used? |
| **Instantiation** | Date, Format, Identifier, Language | How does it exist in the world? |

Let's dive into each one.

---

## Content Elements: Describing What Your MicroSim Is About

### 1. Title Element

The **Title Element** is the name of your MicroSim—the first thing users see and the primary text they'll search against. A great title is like a great movie trailer: it tells you what you're getting while making you want to learn more.

**Definition:** A name given to the resource.

**What makes a good MicroSim title?**

- **Descriptive**: Tell users what it does ("Pendulum Period Calculator" not "Physics Thing")
- **Specific**: Include the key concept ("Fourier Transform Visualizer" not "Math Animation")
- **Searchable**: Use terms people actually search for
- **Concise**: Aim for 3-7 words
- **Unique**: Distinguish from similar resources

Here are examples ranging from weak to strong:

| Weak Title | Better Title | Excellent Title |
|------------|--------------|-----------------|
| Simulation 1 | Physics Simulation | Projectile Motion Trajectory Simulator |
| Math Helper | Algebra Tool | Quadratic Equation Root Finder |
| My Animation | Wave Animation | Electromagnetic Wave Propagation Visualizer |
| Test | Sorting Demo | Bubble Sort Algorithm Step-by-Step |

!!! tip "The Title Test"
    Read your title out loud. Would a teacher searching for resources understand what your MicroSim does? Would it stand out in a list of 50 search results? If yes to both, you've nailed it.

**JSON example:**
```json
{
  "dublinCore": {
    "title": "Interactive Ohm's Law Circuit Simulator"
  }
}
```

### 2. Subject Element

The **Subject Element** describes what your MicroSim is about—the topics, themes, and keywords that define its content. This is where you connect your resource to the broader world of knowledge.

**Definition:** A topic of the resource, typically expressed as keywords, phrases, or classification codes.

Good subjects work at multiple levels:

- **Broad discipline**: Physics, Mathematics, Biology
- **Specific topic**: Electromagnetic waves, Quadratic equations, Cellular respiration
- **Cross-cutting concepts**: Energy, Patterns, Systems thinking
- **Educational context**: AP Physics, NGSS, Common Core

**Subject selection best practices:**

1. Include both broad and specific terms
2. Use established vocabularies when possible
3. Consider what users might search for
4. Add 3-8 subjects per MicroSim
5. Avoid overly generic terms ("education," "learning")

**JSON example:**
```json
{
  "dublinCore": {
    "subject": [
      "Physics",
      "Electricity",
      "Circuits",
      "Ohm's Law",
      "Current",
      "Voltage",
      "Resistance"
    ]
  }
}
```

#### Diagram: Subject Hierarchy Taxonomy

<iframe src="../../sims/subject-taxonomy-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>
[View Fullscreen](../../sims/subject-taxonomy-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Subject Hierarchy Explorer</summary>
Type: graph-model

Bloom Level: Understand (L2)
Bloom Verb: classify

Learning Objective: Students will classify subject terms at appropriate levels of specificity by exploring hierarchical relationships between broad disciplines and specific topics.

Purpose: Visualize how subject terms relate hierarchically, helping users choose appropriate specificity levels

Node types:
1. Discipline (large blue circles)
   - Properties: name, color
   - Examples: "Physics", "Mathematics", "Biology"

2. Domain (medium green circles)
   - Properties: name, parent
   - Examples: "Mechanics", "Algebra", "Ecology"

3. Topic (small orange circles)
   - Properties: name, parent, searchVolume
   - Examples: "Projectile Motion", "Quadratic Equations", "Food Webs"

Edge types:
1. CONTAINS (solid gray arrows)
   - Shows hierarchy from discipline to domain to topic
   - Direction: parent to child

Sample data tree:
- Physics (discipline)
  - Mechanics (domain)
    - Projectile Motion (topic)
    - Circular Motion (topic)
    - Newton's Laws (topic)
  - Waves (domain)
    - Sound Waves (topic)
    - Light Waves (topic)
    - Interference (topic)
  - Electricity (domain)
    - Circuits (topic)
    - Ohm's Law (topic)

Interactive features:
- Click node to expand/collapse children
- Hover to see definition and example usage
- Search box to find specific terms
- Highlight path shows breadcrumb trail
- Toggle between tree and radial layout

Layout: Hierarchical tree (default) with option for radial view
Color scheme: Blue for disciplines, green for domains, orange for topics
Animation: Smooth expansion/collapse with spring physics

Implementation: vis-network with hierarchical layout
</details>

### 3. Description Element

The **Description Element** is your elevator pitch—a summary that explains what your MicroSim does and why someone would want to use it. This is your chance to sell the educational value.

**Definition:** An account of the resource, typically a free-text summary.

A great description answers:

- What does this MicroSim visualize or simulate?
- What can users interact with?
- What concept will students understand after using it?
- What makes this approach unique or effective?

**Description formula:**

> "[Type of resource] that [action/capability] to help students [learning outcome]. Features include [key interactions]. Suitable for [audience/context]."

**Example descriptions:**

**Weak:**
> "A physics simulation."

**Better:**
> "An interactive simulation showing projectile motion with adjustable parameters."

**Excellent:**
> "Interactive physics simulation demonstrating projectile motion with adjustable launch angle, initial velocity, and gravity. Students can visualize trajectory paths, measure range and height, and explore how each parameter affects the outcome. Features real-time graphing of position vs. time. Ideal for introductory mechanics courses."

**JSON example:**
```json
{
  "dublinCore": {
    "description": "Interactive circuit simulator allowing students to build series and parallel circuits with resistors, measure current and voltage at any point, and verify Ohm's Law relationships. Features include drag-and-drop component placement, animated electron flow visualization, and real-time ammeter/voltmeter readings. Supports both guided exercises and open exploration modes."
  }
}
```

!!! note "Description Length"
    Aim for 50-150 words. Long enough to be useful, short enough to be read. Search engines typically display the first 150-160 characters, so front-load the important information.

### 4. Type Element

The **Type Element** describes the nature or genre of the resource. For MicroSims, this helps users understand what kind of interaction to expect.

**Definition:** The nature or genre of the resource, typically from a controlled vocabulary.

Standard Dublin Core types include:

| Type | Use for MicroSims that... |
|------|---------------------------|
| InteractiveResource | Allow user manipulation (most MicroSims) |
| Software | Are primarily tools (calculators, editors) |
| Image | Display static visualizations |
| MovingImage | Show animations without user control |
| Dataset | Present data exploration interfaces |
| Text | Are primarily instructional content |

For MicroSims, we typically extend with more specific types:

- **Simulation**: Models real-world phenomena
- **Animation**: Shows dynamic processes
- **Calculator**: Computes values from inputs
- **Game**: Uses gamification elements
- **Quiz**: Assesses understanding
- **Visualization**: Displays data or concepts
- **Explorer**: Allows open-ended investigation

**JSON example:**
```json
{
  "dublinCore": {
    "type": "InteractiveResource"
  },
  "search": {
    "visualizationType": ["simulation", "animation"]
  }
}
```

### 5. Source Element

The **Source Element** identifies resources from which your MicroSim is derived. This supports academic integrity and helps users find related materials.

**Definition:** A related resource from which the described resource is derived.

Use Source when your MicroSim:

- Is based on another simulation (with permission)
- Adapts content from a textbook or paper
- Implements an algorithm from published research
- Translates or ports existing resources
- Was inspired by specific educational materials

**JSON example:**
```json
{
  "dublinCore": {
    "source": "Adapted from PhET Interactive Simulations, University of Colorado Boulder (https://phet.colorado.edu). Original 'Projectile Motion' simulation by Sam Reid."
  }
}
```

!!! warning "Give Credit"
    If you've built on someone else's work, the Source element is where you acknowledge it. This isn't just polite—it's essential for maintaining trust in the educational community.

### 6. Relation Element

The **Relation Element** identifies related resources—other MicroSims, documentation, curricula, or materials that connect to yours.

**Definition:** A related resource with a specified relationship.

Common relationship types:

| Relationship | Meaning | Example |
|--------------|---------|---------|
| isPartOf | Belongs to a collection | "Part of Wave Physics series" |
| hasPart | Contains other resources | "Includes three sub-simulations" |
| isVersionOf | Different version of same | "Mobile version of Desktop sim" |
| isFormatOf | Different format | "Interactive version of static diagram" |
| references | Cites another resource | "References NGSS HS-PS2-1" |
| requires | Needs another resource | "Requires completion of Tutorial 1" |
| isReplacedBy | Superseded by newer | "Updated version available" |

**JSON example:**
```json
{
  "dublinCore": {
    "relation": [
      "isPartOf: Physics MicroSim Collection",
      "references: NGSS HS-PS2-1 Motion and Stability",
      "requires: Basic Algebra knowledge",
      "isVersionOf: https://example.com/sims/projectile-v1/"
    ]
  }
}
```

### 7. Coverage Element

The **Coverage Element** describes the scope of your resource in terms of time period, geographic region, or jurisdiction.

**Definition:** The spatial or temporal topic of the resource.

For MicroSims, Coverage is relevant when:

- Content applies to specific time periods ("Classical mechanics era")
- Geographic locations matter ("US Electoral College system")
- Historical context is important ("Pre-Copernican astronomy")
- Regional standards apply ("UK GCSE curriculum")

**JSON example:**
```json
{
  "dublinCore": {
    "coverage": "20th-21st century quantum physics concepts; applicable worldwide"
  }
}
```

!!! tip "When Coverage Matters"
    Many MicroSims cover universal concepts where Coverage isn't critical. But for history, geography, civics, or regionally-specific curricula, this element becomes essential.

#### Diagram: Coverage Applications Map

<iframe src="../../sims/coverage-world-map/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Coverage Applications World Map</summary>
Type: map

Bloom Level: Analyze (L4)
Bloom Verb: differentiate

Learning Objective: Students will differentiate between global versus regional coverage needs by exploring how educational content may have geographic or jurisdictional constraints.

Purpose: Illustrate how the Coverage element applies to region-specific educational content

Geographic scope: World map with major regions

Regions marked:
- United States (blue) - "Common Core, NGSS"
- European Union (green) - "Bologna Process standards"
- United Kingdom (purple) - "GCSE, A-Level curricula"
- Asia-Pacific (orange) - "Various national curricula"
- Latin America (teal) - "Regional educational standards"

Interactive elements:
- Click region to see example Coverage values
- Toggle between "Geographic" and "Temporal" views
- Search for curriculum standards by region
- Examples panel shows MicroSims relevant to selected region

Coverage examples by click:
- US: "Common Core Math, NGSS Science, US History to 1877"
- UK: "Key Stage 3-4, GCSE Physics specification"
- EU: "European scientific notation conventions"
- Global: "Universal physics principles, math concepts"

Visual style: Clean world map with regional highlighting
Color scheme: Distinct colors per region, gray for unselected
Animation: Smooth region highlighting and panel transitions

Implementation: Leaflet.js with GeoJSON regions
</details>

---

## Intellectual Property Elements: Attribution and Rights

### 8. Creator Element

The **Creator Element** identifies who made the MicroSim. This is crucial for attribution, academic credit, and letting users know who to contact with questions.

**Definition:** An entity primarily responsible for making the resource.

Creator best practices:

- Use real names (or consistent pseudonyms)
- Include affiliation if relevant
- List multiple creators in contribution order
- Be consistent across your MicroSims
- Consider including contact information or profile link

**JSON example:**
```json
{
  "dublinCore": {
    "creator": "Dr. Maria Santos, University of California Berkeley"
  }
}
```

For collaborative works:
```json
{
  "dublinCore": {
    "creator": [
      "Dr. Maria Santos (lead developer)",
      "James Chen (visualization design)",
      "Physics Education Research Group, UC Berkeley"
    ]
  }
}
```

### 9. Publisher Element

The **Publisher Element** identifies the entity responsible for making the resource available—typically an organization, institution, or platform.

**Definition:** An entity responsible for making the resource available.

Publisher vs. Creator:

- **Creator**: Who made it (individual or team)
- **Publisher**: Who distributes/hosts it (organization or platform)

The same entity can be both, but they serve different purposes. Publishers take responsibility for availability, quality assurance, and sometimes curation.

**JSON example:**
```json
{
  "dublinCore": {
    "creator": "Dr. Maria Santos",
    "publisher": "OpenStax, Rice University"
  }
}
```

Common MicroSim publishers:

- University departments or research groups
- Open educational resource platforms (OER Commons, MERLOT)
- Textbook publishers
- Government education agencies
- Individual creator websites
- GitHub organizations

### 10. Contributor Element

The **Contributor Element** acknowledges others who helped with the resource but aren't the primary creator—reviewers, translators, accessibility consultants, and others who contributed.

**Definition:** An entity responsible for making contributions to the resource.

Contributors might include:

- Peer reviewers who provided feedback
- Translators who created localized versions
- Accessibility experts who improved WCAG compliance
- Students who beta-tested and reported bugs
- Domain experts who verified accuracy
- Institutions that provided funding

**JSON example:**
```json
{
  "dublinCore": {
    "creator": "Dr. Maria Santos",
    "contributor": [
      "Reviewed by: Prof. Robert Kim, MIT",
      "Accessibility review: Digital Inclusion Lab, Stanford",
      "Spanish translation: Carlos Rivera",
      "Student testers: Physics 101 Fall 2025 class"
    ]
  }
}
```

!!! success "Recognition Matters"
    Contributors often do invisible work. Acknowledging them in metadata isn't just professional—it encourages future collaboration and builds community.

### 11. Rights Element

The **Rights Element** specifies how others can use your MicroSim—the license, permissions, and any restrictions. This is legally important and practically essential for reuse.

**Definition:** Information about rights held in and over the resource.

For open educational resources, Creative Commons licenses are standard:

| License | Allows | Requires | Prohibits |
|---------|--------|----------|-----------|
| CC BY | Anything | Attribution | Nothing |
| CC BY-SA | Anything | Attribution + ShareAlike | Nothing |
| CC BY-NC | Non-commercial use | Attribution | Commercial use |
| CC BY-NC-SA | Non-commercial use | Attribution + ShareAlike | Commercial use |
| CC0 | Anything | Nothing | Nothing |

**Choosing the right license:**

- Want maximum reuse? → **CC BY** or **CC0**
- Want derivatives to stay open? → **CC BY-SA**
- Concerned about commercial exploitation? → **CC BY-NC**
- Academic/institutional requirement? → Check your organization's policy

**JSON example:**
```json
{
  "dublinCore": {
    "rights": "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0). https://creativecommons.org/licenses/by-sa/4.0/"
  }
}
```

#### Diagram: Creative Commons License Chooser

<iframe src="../../sims/cc-license-chooser/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Creative Commons License Chooser Interactive</summary>
Type: microsim

Bloom Level: Evaluate (L5)
Bloom Verb: recommend

Learning Objective: Students will recommend appropriate Creative Commons licenses for different MicroSim sharing scenarios by analyzing use case requirements against license permissions.

Canvas layout:
- Left panel (300px): Decision questions
- Center panel (250px): License visualization
- Right panel (200px): Result and explanation

Visual elements:
- Flowchart decision tree showing license paths
- License icons (CC, BY, NC, SA, ND) with visual representations
- Result card showing recommended license with summary

Interactive controls:
- Radio buttons: "Allow commercial use?" (Yes/No)
- Radio buttons: "Allow modifications?" (Yes/ShareAlike/No)
- Checkbox: "Require attribution?" (locked to Yes except CC0)
- Button: "I want maximum freedom for users" (presets CC0)
- Button: "Reset"

Decision logic:
- Commercial: Yes + Modifications: Yes → CC BY
- Commercial: Yes + Modifications: ShareAlike → CC BY-SA
- Commercial: No + Modifications: Yes → CC BY-NC
- Commercial: No + Modifications: ShareAlike → CC BY-NC-SA
- Commercial: No + Modifications: No → CC BY-NC-ND
- Maximum freedom → CC0

Result display:
- Large license badge
- Plain English summary: "Others can..."
- Link to full license text
- Copy-paste JSON snippet for metadata

Default state: All questions unanswered, no recommendation shown

Behavior:
- As user answers questions, flowchart path highlights
- Recommendation updates immediately
- Incompatible combinations show warning
- Hover over license badges for quick explanations

Implementation: p5.js with interactive form elements
</details>

---

## Instantiation Elements: How Your MicroSim Exists

### 12. Date Element

The **Date Element** records when your MicroSim was created, published, or modified. This helps users assess currency and track versions.

**Definition:** A point or period of time associated with an event in the lifecycle of the resource.

Date types to consider:

- **created**: When the MicroSim was first made
- **issued**: When it was first published/released
- **modified**: When it was last updated
- **valid**: When it's current (for time-sensitive content)

**Always use ISO 8601 format:** `YYYY-MM-DD`

**JSON examples:**
```json
{
  "dublinCore": {
    "date": "2026-01-15"
  }
}
```

For multiple dates:
```json
{
  "dublinCore": {
    "date": {
      "created": "2025-08-20",
      "issued": "2025-09-01",
      "modified": "2026-01-15"
    }
  }
}
```

!!! warning "Keep Dates Updated"
    Nothing erodes trust faster than metadata showing "Last updated: 2019" on a simulation about current events. When you update your MicroSim, update the date too.

### 13. Format Element

The **Format Element** describes the file format and technical manifestation of your MicroSim. This helps users know what to expect and systems know how to handle it.

**Definition:** The file format, physical medium, or dimensions of the resource.

For web-based MicroSims, Format typically indicates:

- MIME type (text/html, application/javascript)
- Delivery mechanism (web page, downloadable)
- Technical requirements (requires WebGL, needs JavaScript enabled)

Common MicroSim formats:

| Format | MIME Type | Description |
|--------|-----------|-------------|
| Web page | text/html | Standard HTML5 page |
| JavaScript app | application/javascript | JS application |
| Jupyter notebook | application/x-ipynb+json | Interactive notebook |
| Standalone | application/zip | Downloadable package |

**JSON example:**
```json
{
  "dublinCore": {
    "format": "text/html"
  },
  "technical": {
    "fileSize": "67KB",
    "framework": "p5.js",
    "browserSupport": ["Chrome", "Firefox", "Safari", "Edge"]
  }
}
```

### 14. Identifier Element

The **Identifier Element** provides a unique reference to your MicroSim—typically a URL, DOI, or other persistent identifier.

**Definition:** An unambiguous reference to the resource within a given context.

Good identifiers are:

- **Unique**: No two resources share the same identifier
- **Persistent**: The identifier doesn't change over time
- **Resolvable**: Users can follow it to find the resource
- **Meaningful**: Preferably human-readable

Identifier types for MicroSims:

| Type | Example | Use Case |
|------|---------|----------|
| URL | https://dmccreary.github.io/physics/sims/pendulum/ | Web-hosted |
| DOI | doi:10.5281/zenodo.1234567 | Academic citation |
| ISBN | 978-3-16-148410-0 | Part of published book |
| UUID | 550e8400-e29b-41d4-a716-446655440000 | System-generated |
| Custom | MICROSIM-PHYS-2026-0042 | Organization-specific |

**JSON example:**
```json
{
  "dublinCore": {
    "identifier": "https://dmccreary.github.io/physics-course/sims/pendulum-period/"
  }
}
```

!!! tip "URL as Identifier"
    For most MicroSims, the URL where it's hosted serves as the identifier. Just make sure you control that URL long-term. If you might change domains, consider also getting a DOI.

### 15. Language Element

The **Language Element** specifies the language of your MicroSim's content—labels, instructions, and text.

**Definition:** A language of the resource.

Use standard language codes (ISO 639-1 or IETF BCP 47):

| Code | Language |
|------|----------|
| en | English (general) |
| en-US | American English |
| en-GB | British English |
| es | Spanish |
| fr | French |
| de | German |
| zh | Chinese |
| ja | Japanese |
| pt-BR | Brazilian Portuguese |

**When language matters for MicroSims:**

- User interface labels and buttons
- Instructions and help text
- Error messages
- Axis labels and data legends
- Accessibility descriptions

**JSON example:**
```json
{
  "dublinCore": {
    "language": "en-US"
  }
}
```

For multilingual MicroSims:
```json
{
  "dublinCore": {
    "language": ["en-US", "es", "fr"]
  }
}
```

---

## Putting It All Together: Complete Dublin Core Profile

Here's a complete example showing all 15 Dublin Core elements for a MicroSim:

```json
{
  "dublinCore": {
    "title": "Double Pendulum Chaos Simulator",
    "creator": "Dr. Sarah Chen, Physics Department, Stanford University",
    "subject": [
      "Physics",
      "Classical Mechanics",
      "Chaos Theory",
      "Pendulums",
      "Nonlinear Dynamics"
    ],
    "description": "Interactive simulation demonstrating chaotic behavior in a double pendulum system. Students can set initial conditions, observe how tiny differences lead to dramatically different outcomes, and explore the boundary between predictable and chaotic motion. Features include phase space visualization, Lyapunov exponent calculation, and side-by-side trajectory comparison.",
    "publisher": "Stanford Physics Education Group",
    "contributor": [
      "Visualization design: James Martinez",
      "Peer review: Prof. Robert Kim, MIT",
      "Student testing: Physics 101 Fall 2025"
    ],
    "date": {
      "created": "2025-06-15",
      "issued": "2025-08-01",
      "modified": "2026-01-10"
    },
    "type": "InteractiveResource",
    "format": "text/html",
    "identifier": "https://stanford.edu/physics/sims/double-pendulum/",
    "source": "Inspired by classical mechanics demonstrations; chaos analysis based on Strogatz, 'Nonlinear Dynamics and Chaos' (2015)",
    "language": "en-US",
    "relation": [
      "isPartOf: Stanford Physics MicroSim Collection",
      "references: NGSS HS-PS2-1",
      "requires: Understanding of basic pendulum motion"
    ],
    "coverage": "Classical mechanics concepts; globally applicable",
    "rights": "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)"
  }
}
```

#### Diagram: Dublin Core Element Completeness Checker

<iframe src="../../sims/dublin-core-checker/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dublin Core Element Completeness Checker</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning Objective: Students will implement complete Dublin Core metadata by filling in all 15 elements and receiving feedback on completeness and quality.

Canvas layout:
- Left panel (350px): Input form with 15 fields
- Right panel (300px): Completeness gauge and quality feedback

Visual elements:
- Form with labeled input fields for each DC element
- Color-coded field borders (red=missing required, yellow=missing optional, green=complete)
- Circular completeness gauge (0-100%)
- Quality score with explanation
- Checklist of elements with status icons

Interactive controls:
- Text inputs for each Dublin Core element
- "Check Completeness" button
- "Load Example" button (pre-fills with good example)
- "Clear All" button
- "Export JSON" button

Field configuration:
- Required (red if empty): title, creator, subject, description, date, format, rights
- Recommended (yellow if empty): publisher, type, identifier, language
- Optional (gray if empty): contributor, source, relation, coverage

Scoring logic:
- Required fields: 10 points each (70 max)
- Recommended fields: 5 points each (20 max)
- Optional fields: 2.5 points each (10 max)
- Quality bonuses: description length, subject count, valid date format

Default state: Empty form, 0% completeness

Behavior:
- Real-time validation as user types
- Completeness gauge animates as fields are filled
- Quality tips appear based on content
- JSON preview updates live
- Export creates downloadable metadata.json

Implementation: p5.js with form handling and validation logic
</details>

---

## Quick Reference Card

Here's a summary table for quick reference when creating MicroSim metadata:

| Element | Required? | Purpose | Example |
|---------|-----------|---------|---------|
| **Title** | ✅ Yes | Name of MicroSim | "Projectile Motion Simulator" |
| **Creator** | ✅ Yes | Who made it | "Dr. Maria Santos" |
| **Subject** | ✅ Yes | Topics covered | "Physics, Kinematics" |
| **Description** | ✅ Yes | What it does | "Interactive simulation..." |
| **Publisher** | Recommended | Who distributes it | "OpenEd Physics" |
| **Contributor** | Optional | Who helped | "Reviewed by Prof. Kim" |
| **Date** | ✅ Yes | When made/updated | "2026-01-15" |
| **Type** | Recommended | What kind of resource | "InteractiveResource" |
| **Format** | ✅ Yes | File format | "text/html" |
| **Identifier** | Recommended | Unique reference | "https://example.com/sims/..." |
| **Source** | Optional | What it's based on | "Adapted from PhET" |
| **Language** | Recommended | UI language | "en-US" |
| **Relation** | Optional | Related resources | "isPartOf: Physics series" |
| **Coverage** | Optional | Scope | "Classical mechanics era" |
| **Rights** | ✅ Yes | License | "CC BY-SA 4.0" |

---

## Common Mistakes and How to Avoid Them

Even experienced creators make metadata mistakes. Here are the most common pitfalls:

**1. Vague Titles**
- ❌ "Physics Sim"
- ✅ "Electromagnetic Wave Polarization Demonstrator"

**2. Missing or Generic Descriptions**
- ❌ "A simulation about circuits"
- ✅ "Interactive circuit builder where students connect resistors, batteries, and switches to explore series and parallel configurations. Features real-time ammeter readings and animated electron flow."

**3. No Subject Terms**
- ❌ Subject: "Science"
- ✅ Subject: ["Physics", "Electricity", "Circuits", "Ohm's Law", "Current", "Voltage"]

**4. Forgetting Rights**
- ❌ No rights information → Users can't legally reuse
- ✅ "CC BY-SA 4.0" → Clear permissions for educators

**5. Outdated Dates**
- ❌ Created in 2026, Date shows 2023
- ✅ Updated modification date with each change

**6. Missing Creator**
- ❌ Anonymous → No accountability or attribution
- ✅ Name and affiliation → Builds trust and enables contact

!!! success "The Metadata Mindset"
    Think of metadata as a gift to future users—including future you. That simulation you built six months ago? With good metadata, you'll actually be able to find it and remember what it does.

---

## Key Takeaways

1. **Dublin Core has 15 elements** organized into Content, Intellectual Property, and Instantiation categories

2. **Title** is your first impression—make it descriptive, specific, and searchable

3. **Subject** connects your MicroSim to the knowledge universe—use multiple levels of specificity

4. **Description** is your elevator pitch—explain what, why, and for whom

5. **Creator and Contributor** give proper attribution to everyone involved

6. **Rights** (licensing) determines how others can use your work—choose intentionally

7. **Date** in ISO format (YYYY-MM-DD) keeps your resources current

8. **Identifier** provides a permanent address—URLs work well for web resources

9. **Required elements** (Title, Creator, Subject, Description, Date, Format, Rights) form the minimum viable metadata

10. **Complete metadata is a superpower**—it makes your MicroSims discoverable, reusable, and valuable to the global education community

---

*Ready to learn how metadata is structured? Continue to [Chapter 5: JSON and Data Structures](../05-json-and-data-structures/index.md).*
