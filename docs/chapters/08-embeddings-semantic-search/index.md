---
title: Embeddings and Semantic Search
description: Master vector embeddings and semantic search techniques to find similar MicroSims based on meaning, not just keywords, using cosine similarity and dimensionality reduction
generated_by: claude skill chapter-content-generator
date: 2026-01-24 18:45:00
version: 0.03
reading_level: college_freshman
---

# Embeddings and Semantic Search

## Summary

This chapter introduces vector embeddings and semantic search techniques for finding related MicroSims based on meaning rather than keywords. You'll learn how embeddings represent text as high-dimensional vectors, how cosine similarity measures semantic relatedness, and how to find similar MicroSims using nearest neighbor algorithms. The chapter also covers dimensionality reduction techniques including PCA and t-SNE for visualizing embedding spaces. After completing this chapter, students will understand how semantic search enhances MicroSim discovery.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Embeddings
2. Vector Representations
3. Cosine Similarity
4. Similar MicroSims
5. Similarity Score
6. Nearest Neighbors
7. Dimensionality Reduction
8. PCA
9. t-SNE
10. Visualization Maps

## Prerequisites

This chapter builds on concepts from:

- [Chapter 6: Search Fundamentals](../06-search-fundamentals/index.md)
- [Chapter 7: Faceted Search and Client-Side Search](../07-faceted-search-client-side/index.md)

---

## The Magic of Understanding Meaning

Here's a scenario that might sound familiar: You've found a fantastic MicroSim about pendulum motion for your physics class. Now you want more simulations *like* that one—not necessarily about pendulums specifically, but about similar physics concepts. You try searching for "pendulum" but get the same results. You try "oscillation" and find some new ones. But what about "simple harmonic motion," "periodic behavior," or "conservation of energy"? How do you find simulations that are *conceptually related* without knowing all the right keywords?

This is where semantic search becomes your superpower. Instead of matching keywords, semantic search understands *meaning*. It can recognize that a pendulum simulation and a spring-mass simulation are conceptually similar, even if they never share a single word in their descriptions. It's the difference between finding what you *typed* and finding what you *meant*.

The technology that makes this possible is called **embeddings**—a way of converting text into numbers that capture meaning. This chapter will take you from "what is an embedding?" to "I can find any similar MicroSim instantly!" By the end, you'll understand one of the most transformative technologies in modern AI, and you'll see it applied directly to making education better.

Let's dive in—this is going to be fun!

---

## What Are Embeddings?

An **embedding** is a numerical representation of data (text, images, audio, or anything else) as a list of numbers—a vector—where similar items end up with similar numbers. It's like giving every MicroSim a GPS coordinate in a "meaning space" where similar simulations are located near each other.

### From Words to Numbers

Computers don't naturally understand the meaning of words. To a computer, "pendulum" and "oscillation" are just different strings of characters with no inherent connection. But humans know these concepts are related. Embeddings bridge this gap by converting text into numerical vectors where related concepts have similar vectors.

Here's a simplified example:

| Concept | Vector (3 dimensions, simplified) |
|---------|-----------------------------------|
| Pendulum | [0.82, 0.45, 0.21] |
| Spring Mass | [0.79, 0.48, 0.19] |
| Wave | [0.71, 0.52, 0.35] |
| Chemical Reaction | [0.15, 0.23, 0.88] |
| Cell Division | [0.11, 0.19, 0.91] |

Notice how "Pendulum" and "Spring Mass" have similar numbers? That's because they're conceptually similar—both involve oscillatory motion. "Chemical Reaction" and "Cell Division" are similar to each other but different from the physics concepts.

### Real Embeddings Are High-Dimensional

Real embedding systems use many more dimensions—typically 384, 768, or even 1536 numbers per item. Each dimension captures some aspect of meaning, though the dimensions don't correspond to human-interpretable concepts (it's not like dimension 47 means "relates to physics").

For our MicroSim search system, we use 384-dimensional embeddings. Every MicroSim's metadata gets converted into a list of 384 numbers that capture its semantic meaning. With 400+ MicroSims, that's 400+ points floating in a 384-dimensional space, clustered by conceptual similarity.

!!! tip "Why So Many Dimensions?"
    More dimensions allow the embedding to capture more nuance. A 3-dimensional embedding might put all physics simulations together, but a 384-dimensional embedding can distinguish kinematics from thermodynamics from electromagnetism—and even subtler distinctions within those areas.

---

## Vector Representations: The Language of Similarity

A **vector** is simply an ordered list of numbers. In the context of embeddings, vectors represent items in a multi-dimensional space where position encodes meaning.

### Vectors as Coordinates

Think of a 2D coordinate system (like a map). Every location has an (x, y) coordinate:

- Paris might be at (2.35, 48.86) in longitude/latitude
- London at (-0.12, 51.51)
- Tokyo at (139.69, 35.68)

Cities that are close on the map have similar coordinates. The numbers encode location.

Embeddings work the same way, but instead of geographic location, they encode *meaning*. And instead of 2 dimensions, they use hundreds.

### Vector Properties

| Property | Description | Example |
|----------|-------------|---------|
| **Dimension** | Number of values in the vector | 384-dimensional embedding |
| **Magnitude** | "Length" of the vector (distance from origin) | Computed using Pythagorean theorem |
| **Direction** | Where the vector "points" in the space | Captures semantic meaning |

For comparing meaning, we care most about *direction*, not magnitude. Two vectors pointing the same direction represent similar concepts, regardless of their length.

### Vector Operations

Embeddings unlock powerful mathematical operations:

**Addition**: Combining concepts
```
king - man + woman ≈ queen
```
The famous example! Embedding arithmetic can capture analogies.

**Subtraction**: Finding differences
```
embedding("wave simulation") - embedding("animation")
≈ "what makes it about waves specifically"
```

**Averaging**: Finding the center of a concept cluster
```
average(embedding("pendulum"), embedding("spring"), embedding("oscillator"))
≈ "general oscillation concept"
```

These operations work because embeddings encode semantic relationships geometrically.

#### Diagram: Vector Space Visualization

<iframe src="../../sims/vector-space-viz/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Vector Space Visualization for Embeddings</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning Objective: Students will explain how embeddings position similar items near each other in vector space by manipulating a 2D projection and observing clustering patterns.

Canvas layout:
- Main panel (75%): Interactive 2D scatter plot
- Side panel (25%): Controls and information display

Visual elements:
- Scatter plot with:
  - Points representing MicroSims (colored by subject area)
  - Point labels on hover
  - Cluster regions shown with light background shading
  - Distance lines when comparing two points
- Legend showing color coding by subject
- Information panel showing:
  - Selected point details
  - Distance to other points
  - Nearest neighbors list

Sample data (15 points representing MicroSims):
- Physics cluster: Pendulum, Wave, Projectile, Circuit, Magnet
- Chemistry cluster: Molecule, Reaction, pH Scale, Gas Laws
- Math cluster: Graphing, Geometry, Statistics, Algebra
- Biology: Ecosystem, Cell

Interactive controls:
- Click point to select and see neighbors
- Drag to pan the view
- Scroll to zoom
- Toggle: "Show cluster boundaries"
- Toggle: "Show distance lines"
- Slider: "Number of neighbors to highlight" (1-5)
- Dropdown: "Color by" (Subject, Grade Level, Framework)

Behavior:
- Selecting a point highlights its K nearest neighbors
- Distance lines drawn from selected point to neighbors
- Information panel updates with similarity scores
- Hovering shows point labels and metadata

Animation:
- Points gently float/breathe to feel alive
- Smooth transitions when selecting points
- Lines draw in with animation

Color scheme:
- Physics: Blue shades
- Chemistry: Green shades
- Math: Purple shades
- Biology: Orange shades
- Selection highlight: Gold

Implementation: p5.js with 2D scatter plot and interactive selection
</details>

---

## How Embeddings Are Created

You don't create embeddings by hand—AI models do it. But understanding the process helps you appreciate what they capture.

### Embedding Models

Embedding models are trained on massive amounts of text to learn patterns of language use. Popular models include:

| Model | Dimensions | Strengths |
|-------|------------|-----------|
| **all-MiniLM-L6-v2** | 384 | Fast, great for semantic search |
| **all-mpnet-base-v2** | 768 | Higher quality, still fast |
| **text-embedding-ada-002** | 1536 | OpenAI's model, very high quality |
| **BGE-large** | 1024 | Strong multilingual support |

For MicroSim search, we use **all-MiniLM-L6-v2** because it balances quality with speed and runs locally without API calls.

### The Training Process (Simplified)

Embedding models learn by predicting context. Given a sentence with a word missing, the model learns to predict what word fits. Through billions of such examples, the model develops an internal representation where:

- Words that appear in similar contexts get similar representations
- Sentences about similar topics get similar representations
- Documents with related content get similar representations

This "distributional semantics" means the model learns meaning from usage patterns, not from explicit definitions.

### Creating MicroSim Embeddings

For each MicroSim, we create an embedding from its metadata:

```python
# Combine relevant text fields
text = f"{title}. {description}. Subject: {subject_area}. {learning_objectives}"

# Generate embedding using sentence-transformers library
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embedding = model.encode(text)  # Returns 384-dimensional vector
```

The embedding captures the semantic content of the entire MicroSim description in 384 numbers.

!!! note "What Gets Embedded?"
    For our MicroSim embeddings, we combine: title, description, subject area, keywords, and learning objectives. This gives the embedding rich context about what the simulation teaches and how it's used.

---

## Cosine Similarity: Measuring Relatedness

Once we have embeddings, we need a way to measure how similar two items are. The standard approach is **cosine similarity**—a mathematical measure of how similar two vectors are in direction.

### The Intuition

Imagine two arrows (vectors) starting from the same point:
- If they point the same direction: identical meaning, cosine similarity = 1
- If they point perpendicular: unrelated meaning, cosine similarity = 0
- If they point opposite directions: opposite meaning, cosine similarity = -1

Cosine similarity measures the *angle* between vectors, ignoring their length.

### The Math

For two vectors A and B, cosine similarity is:

$$\text{cosine similarity}(A, B) = \frac{A \cdot B}{|A| \times |B|}$$

Where:
- $A \cdot B$ is the dot product (multiply corresponding elements and sum)
- $|A|$ and $|B|$ are the magnitudes (lengths) of the vectors

### Worked Example

Let's compute cosine similarity for two simplified 3D vectors:

**Pendulum**: A = [0.82, 0.45, 0.21]
**Spring Mass**: B = [0.79, 0.48, 0.19]

**Step 1**: Dot product
$$A \cdot B = (0.82 \times 0.79) + (0.45 \times 0.48) + (0.21 \times 0.19)$$
$$= 0.6478 + 0.216 + 0.0399 = 0.9037$$

**Step 2**: Magnitudes
$$|A| = \sqrt{0.82^2 + 0.45^2 + 0.21^2} = \sqrt{0.8770} = 0.9365$$
$$|B| = \sqrt{0.79^2 + 0.48^2 + 0.19^2} = \sqrt{0.8906} = 0.9437$$

**Step 3**: Cosine similarity
$$\frac{0.9037}{0.9365 \times 0.9437} = \frac{0.9037}{0.8839} = 0.9997$$

Result: **0.9997** — These vectors are nearly identical in direction, meaning "Pendulum" and "Spring Mass" are highly semantically similar!

### Interpreting Similarity Scores

| Score Range | Interpretation | Example |
|-------------|----------------|---------|
| 0.95 - 1.00 | Nearly identical | Same topic, slightly different wording |
| 0.85 - 0.95 | Highly similar | Same concept, different approach |
| 0.70 - 0.85 | Related | Same subject area, different topic |
| 0.50 - 0.70 | Somewhat related | Same broad field |
| 0.00 - 0.50 | Unrelated | Different domains |

For MicroSim recommendations, we typically show items with similarity scores above 0.70.

#### Diagram: Cosine Similarity Calculator

<iframe src="../../sims/cosine-similarity-calc/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Interactive Cosine Similarity Calculator</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: calculate

Learning Objective: Students will calculate cosine similarity between vector pairs by manipulating vector components and observing how the angle between vectors changes.

Canvas layout:
- Left panel (50%): Vector visualization
- Right panel (50%): Calculation steps and controls

Visual elements:
- 2D coordinate plane with:
  - Two vectors drawn as arrows from origin
  - Angle arc between vectors with degree label
  - Grid lines for reference
  - Vector endpoint coordinates displayed
- Calculation panel showing:
  - Step-by-step formula breakdown
  - Dot product calculation
  - Magnitude calculations
  - Final cosine similarity result
- Similarity meter (color-coded bar from red to green)

Interactive controls:
- Vector A:
  - Slider for x component (-1 to 1)
  - Slider for y component (-1 to 1)
  - Or drag endpoint directly on visualization
- Vector B:
  - Slider for x component (-1 to 1)
  - Slider for y component (-1 to 1)
  - Or drag endpoint directly on visualization
- Toggle: "Show calculation steps"
- Preset buttons:
  - "Identical vectors" (similarity = 1)
  - "Perpendicular" (similarity = 0)
  - "Opposite" (similarity = -1)
  - "Similar but different"

Default parameters:
- Vector A: [0.8, 0.6]
- Vector B: [0.7, 0.7]
- Show calculation steps: On

Behavior:
- Moving any slider updates visualization immediately
- Angle arc animates smoothly
- Calculation steps update in real-time
- Similarity meter changes color:
  - Green: > 0.7
  - Yellow: 0.3 - 0.7
  - Red: < 0.3

Animation:
- Smooth vector transitions when sliders moved
- Angle arc sweeps to new position
- Numbers roll to new values

Implementation: p5.js with vector math and interactive controls
</details>

---

## Finding Similar MicroSims

With embeddings and cosine similarity, we can now build a "Similar MicroSims" feature—one of the most useful tools for educators browsing our collection.

### The Problem It Solves

You've found a great simulation. Now you want:
- "More like this" for the same lesson
- Related simulations for deeper exploration
- Alternatives if this one doesn't quite fit

Without semantic search, you'd have to guess keywords. With embeddings, the system finds conceptually related simulations automatically.

### How It Works

1. **Pre-compute embeddings**: Generate embedding vectors for all MicroSims (done once, stored in a file)
2. **Calculate all pairwise similarities**: For each MicroSim, compute cosine similarity to every other MicroSim
3. **Store top-N similar**: Save the 10 most similar MicroSims for each item
4. **Look up on demand**: When user views a MicroSim, instantly retrieve its similar items

This pre-computation approach means similar MicroSim lookup is instant—no real-time computation needed.

### The Similar MicroSims Data Structure

Our similar-microsims.json file looks like this:

```json
{
  "https://dmccreary.github.io/geometry-course/sims/angle-bisector/": [
    {
      "id": "https://dmccreary.github.io/geometry-course/sims/triangle-centers/",
      "score": 0.89
    },
    {
      "id": "https://dmccreary.github.io/geometry-course/sims/circumscribed-circle/",
      "score": 0.86
    },
    {
      "id": "https://dmccreary.github.io/geometry-course/sims/inscribed-angle/",
      "score": 0.84
    }
  ]
}
```

Each MicroSim URL maps to its top 10 most similar items with similarity scores.

### Example: Finding Similar Physics Simulations

Starting MicroSim: **Pendulum Period Calculator**

| Similar MicroSim | Similarity | Why Related |
|------------------|------------|-------------|
| Simple Harmonic Motion | 0.92 | Same physics principles |
| Spring-Mass System | 0.89 | Oscillatory motion |
| Wave Propagation | 0.81 | Periodic behavior |
| Circular Motion | 0.78 | Related kinematics |
| Energy Conservation | 0.74 | Common physics context |

The system found these connections automatically—no one had to manually tag "pendulum" as related to "spring-mass."

!!! success "The Power of Embeddings"
    A physics teacher searching for "pendulum" now discovers not just pendulum simulations, but the entire constellation of related physics concepts. Embeddings expand discovery beyond the limits of keyword matching.

---

## Similarity Scores in the Interface

When displaying similar MicroSims, the similarity score helps users understand *how* related items are.

### Score Display Strategies

| Approach | Pros | Cons |
|----------|------|------|
| **Percentage** (89%) | Intuitive for users | May imply false precision |
| **Categories** (Very Similar, Related) | Easy to understand | Loses nuance |
| **Color coding** (green → yellow → orange) | Visual, quick scanning | Needs legend |
| **Ranking only** (#1, #2, #3) | Simple, relative | Hides absolute similarity |

Our interface uses color-coded badges with percentages:

- 🟢 **Green** (≥85%): Highly similar, same concept
- 🟡 **Yellow** (70-84%): Related, same subject area
- 🟠 **Orange** (55-69%): Somewhat related
- ⚪ **Gray** (<55%): Weakly related (usually not shown)

### User Experience Considerations

Good similarity interfaces:

- **Show the source**: "Similar to: Pendulum Period Calculator"
- **Explain the connection**: Shared subjects, concepts, or learning objectives
- **Allow exploration**: Click any similar item to see *its* similar items
- **Set expectations**: Scores are approximate, not absolute truth

The goal is discovery, not definitive ranking. A 0.82 and 0.80 similarity are essentially equivalent—both are worth exploring.

#### Diagram: Similarity Score Interface Demo

<iframe src="../../sims/similarity-score-demo/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Similarity Score Interface Demonstration</summary>
Type: microsim

Bloom Level: Evaluate (L5)
Bloom Verb: judge

Learning Objective: Students will judge the usefulness of different similarity score displays by comparing presentation formats and identifying which provides the best user experience.

Canvas layout:
- Top panel (20%): Source MicroSim card
- Middle panel (60%): Multiple display format comparisons
- Bottom panel (20%): User preference selection

Visual elements:
- Source card showing:
  - MicroSim title, subject, brief description
  - "Find Similar" button
- Four parallel columns showing same similar items with different displays:
  - Column 1: Percentages only (92%, 87%, 81%)
  - Column 2: Categories (Very Similar, Related, Somewhat Related)
  - Column 3: Color bars (colored progress bars)
  - Column 4: Combined (color badge + percentage + category)
- Comparison table highlighting pros/cons

Similar items (same in all columns):
1. "Wave Interference" - 0.92 similarity
2. "Oscillation Explorer" - 0.87 similarity
3. "Sound Propagation" - 0.81 similarity
4. "Frequency Analyzer" - 0.76 similarity
5. "Resonance Demo" - 0.71 similarity

Interactive controls:
- Radio buttons: "Which display do you prefer?"
- Toggle: "Show explanation" (why each format works)
- Button: "Try different source MicroSim" (cycles through examples)
- Slider: "Threshold cutoff" (shows/hides items below threshold)

Behavior:
- Clicking any similar item would show its details (simulated)
- Preference selection highlights that column
- Threshold slider animates items in/out

Visual styling:
- Clean, modern card-based layout
- Consistent spacing across columns
- Clear labels for each display type

Implementation: p5.js with multi-column comparison layout
</details>

---

## Nearest Neighbors: Finding the Closest Items

The **nearest neighbors** algorithm is how we find similar MicroSims efficiently. Given one item's embedding, find the K items whose embeddings are closest.

### K-Nearest Neighbors (KNN)

The "K" in KNN is how many neighbors to find:
- K=1: Find the single most similar item
- K=5: Find the 5 most similar items
- K=10: Find the 10 most similar items (what we use)

### The Naive Approach

The simplest approach: compare the query item to every other item, keep the top K.

```python
def find_similar(query_embedding, all_embeddings, k=10):
    similarities = []
    for item_id, embedding in all_embeddings.items():
        score = cosine_similarity(query_embedding, embedding)
        similarities.append((item_id, score))

    # Sort by similarity, descending
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Return top K (excluding self)
    return similarities[1:k+1]
```

For 400 MicroSims with 384-dimensional embeddings, this runs in milliseconds. For millions of items, we'd need approximate nearest neighbor algorithms (FAISS, Annoy, HNSW), but our collection size doesn't require that complexity.

### Pre-Computing Nearest Neighbors

For instant lookups, we pre-compute all nearest neighbors:

```python
similar_microsims = {}
for item_id, embedding in all_embeddings.items():
    neighbors = find_similar(embedding, all_embeddings, k=10)
    similar_microsims[item_id] = neighbors

# Save to JSON for client-side use
with open('similar-microsims.json', 'w') as f:
    json.dump(similar_microsims, f)
```

Now finding similar MicroSims is just a dictionary lookup—O(1) time!

### Why K=10?

We chose K=10 for similar MicroSims because:

- **Enough variety**: 10 options lets users explore different directions
- **Quality threshold**: Below top 10, similarity often drops significantly
- **UI friendly**: Fits nicely on screen without overwhelming
- **File size**: 10 neighbors per item keeps the JSON manageable (~870KB)

Different applications might choose different K values—recommendations often use K=3-5, while research exploration might use K=20+.

#### Diagram: KNN Visualization

<iframe src="../../sims/knn-visualizer/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>K-Nearest Neighbors Visualization</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: differentiate

Learning Objective: Students will differentiate between query results with different K values by selecting items in a 2D embedding space and observing how the number of returned neighbors affects results.

Canvas layout:
- Main panel (70%): 2D scatter plot with MicroSim points
- Side panel (30%): Controls and results list

Visual elements:
- Scatter plot with:
  - 25-30 points representing MicroSims
  - Color-coded by subject area
  - Selected query point highlighted
  - K nearest neighbors connected by lines
  - Concentric distance circles from query point
- Results panel showing:
  - Ordered list of K neighbors
  - Similarity scores
  - Distance indicators
- Statistics display:
  - Average similarity of top K
  - Similarity range (highest to lowest)

Interactive controls:
- Click any point to select as query
- Slider: K value (1-15)
- Toggle: "Show distance circles"
- Toggle: "Show connection lines"
- Dropdown: "Sort neighbors by" (Similarity, Subject, Title)
- Button: "Random query" (selects random point)
- Button: "Reset view"

Behavior:
- Clicking point selects it as query, highlights neighbors
- Changing K slider immediately updates visualization
- Distance circles help visualize the "neighborhood" boundary
- Connection lines drawn from query to each neighbor
- Lines colored by similarity (darker = more similar)

Animation:
- Smooth transitions when K changes
- Lines draw in sequentially from most to least similar
- Points pulse when selected

Sample data:
- Physics: Pendulum, Wave, Projectile, Circuit, Optics (blue)
- Chemistry: Molecule, Reaction, Gas Laws, Equilibrium (green)
- Math: Graphing, Geometry, Probability, Calculus (purple)
- Biology: Cell, Ecosystem, Genetics, Evolution (orange)
- Multiple items per subject to show intra-cluster neighbors

Default state: K=5, one physics point selected

Implementation: p5.js with interactive scatter plot and KNN algorithm
</details>

---

## Dimensionality Reduction: Making Embeddings Visible

Here's a problem: embeddings live in 384 dimensions, but humans can only visualize 2 or 3. **Dimensionality reduction** compresses high-dimensional data into something we can see while preserving important relationships.

### Why Reduce Dimensions?

| Purpose | Benefit |
|---------|---------|
| **Visualization** | See clusters and relationships in 2D plots |
| **Exploration** | Discover structure in your data |
| **Debugging** | Verify embeddings make sense |
| **Communication** | Show others how semantic space is organized |

Dimensionality reduction is lossy—we lose information. But for visualization, the trade-off is worth it.

### The Challenge

Going from 384 dimensions to 2 means throwing away most of the information. The art is keeping the *important* information: which items are similar and which are different.

Imagine having 384 different attributes for every MicroSim (physics-ness, difficulty, interactivity, color-related, etc.). Dimensionality reduction asks: "If I could only use 2 attributes to describe similarities, which combination captures the most?"

---

## PCA: Principal Component Analysis

**PCA (Principal Component Analysis)** is the classic dimensionality reduction technique. It finds the directions of maximum variance in the data and projects onto those directions.

### The Intuition

Imagine a cloud of points in 3D space. PCA finds:
1. **First principal component**: The direction with the most spread (variance)
2. **Second principal component**: The direction perpendicular to the first with the most remaining spread
3. And so on...

By projecting onto just the first two principal components, we get a 2D view that captures the most "interesting" variation.

### PCA in Action

```python
from sklearn.decomposition import PCA
import numpy as np

# embeddings: array of shape (n_microsims, 384)
pca = PCA(n_components=2)
reduced = pca.fit_transform(embeddings)

# reduced: array of shape (n_microsims, 2)
# Each MicroSim now has (x, y) coordinates
```

### PCA Characteristics

| Strength | Limitation |
|----------|------------|
| ✅ Fast and deterministic | ❌ Only captures linear relationships |
| ✅ Results are reproducible | ❌ May not preserve local structure well |
| ✅ Interpretable (variance explained) | ❌ Distant points may appear close |
| ✅ Good for overview visualization | ❌ Clusters may overlap |

PCA is great for a quick overview but might squash clusters together.

### Variance Explained

PCA tells you how much information is retained:

```python
print(pca.explained_variance_ratio_)
# [0.12, 0.08]  # First two components explain 20% of variance
```

With 384-dimensional embeddings, 2 dimensions typically capture only 10-20% of the variance. That's why PCA visualizations are approximate—they're useful for patterns but don't show everything.

---

## t-SNE: Preserving Local Structure

**t-SNE (t-Distributed Stochastic Neighbor Embedding)** is specifically designed for visualization. Unlike PCA, it prioritizes keeping similar items close together, even at the cost of global structure.

### The Intuition

t-SNE asks: "In the original high-dimensional space, which items are neighbors? Let me create a 2D layout where those same items remain neighbors."

It's like arranging seats at a dinner party—people who are friends should sit near each other, even if the overall table arrangement doesn't match some abstract "ideal."

### t-SNE in Action

```python
from sklearn.manifold import TSNE
import numpy as np

# embeddings: array of shape (n_microsims, 384)
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
reduced = tsne.fit_transform(embeddings)

# reduced: array of shape (n_microsims, 2)
```

### The Perplexity Parameter

Perplexity controls how t-SNE balances local vs. global structure:

| Perplexity | Effect |
|------------|--------|
| **Low (5-10)** | Tight, small clusters; may fragment natural groups |
| **Medium (30-50)** | Balanced; good default choice |
| **High (100+)** | Larger groups; may merge distinct clusters |

For MicroSim visualization, perplexity around 30 works well.

### t-SNE Characteristics

| Strength | Limitation |
|----------|------------|
| ✅ Excellent cluster separation | ❌ Non-deterministic (different runs = different layouts) |
| ✅ Preserves local neighborhoods | ❌ Distances between clusters are meaningless |
| ✅ Creates visually pleasing plots | ❌ Slow for large datasets |
| ✅ Reveals natural groupings | ❌ Can create artificial clusters |

!!! warning "t-SNE Distance Caution"
    In t-SNE plots, distance *within* clusters is meaningful, but distance *between* clusters is not. Two clusters far apart might actually be quite similar—t-SNE just needed to put them somewhere.

#### Diagram: PCA vs t-SNE Comparison

<iframe src="../../sims/pca-tsne-compare/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>PCA vs t-SNE Comparison Visualizer</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: compare

Learning Objective: Students will compare PCA and t-SNE dimensionality reduction techniques by viewing the same MicroSim embeddings reduced with both methods and identifying differences in cluster separation and structure.

Canvas layout:
- Left panel (48%): PCA visualization
- Right panel (48%): t-SNE visualization
- Bottom panel (4%): Shared controls

Visual elements:
- Two parallel scatter plots:
  - Same points (MicroSims) in both
  - Same color coding (by subject)
  - Same point selection synced
- Each plot labeled clearly:
  - Left: "PCA (Linear Projection)"
  - Right: "t-SNE (Neighbor Preservation)"
- Legend showing subject color coding
- Comparison metrics:
  - Cluster separation score for each
  - Neighbor preservation score
- Selected point highlighted in both views

Sample data:
- 30-40 MicroSims across 5 subject areas
- Clear subject-based clustering expected
- Some cross-subject similarities

Interactive controls:
- Click any point to select (highlights in both views)
- Slider: t-SNE perplexity (10-100)
- Button: "Re-run t-SNE" (generates new random layout)
- Toggle: "Show cluster boundaries"
- Toggle: "Link hover" (hover one, highlight same point in other)
- Dropdown: "Color by" (Subject, Framework, Grade Level)

Behavior:
- Selecting point in either plot highlights same point in both
- Changing perplexity re-computes t-SNE (with loading indicator)
- Same points appear in different positions between plots
- Clusters more separated in t-SNE view
- Points more spread in PCA view

Comparison callouts:
- Annotation on PCA: "Global structure preserved"
- Annotation on t-SNE: "Local clusters clearer"
- When clusters overlap in PCA but separate in t-SNE, highlight this

Animation:
- Smooth transition when parameters change
- Points animate to new positions
- Cluster boundaries fade in/out

Implementation: p5.js with pre-computed PCA and t-SNE projections
</details>

---

## Visualization Maps: Exploring the MicroSim Universe

Dimensionality reduction enables **visualization maps**—interactive explorations of your entire collection organized by semantic similarity.

### What Makes a Good Embedding Map?

| Feature | Purpose |
|---------|---------|
| **Clear clusters** | Show natural groupings by subject/concept |
| **Hover details** | Display MicroSim information on hover |
| **Click navigation** | Click to view full MicroSim details |
| **Color coding** | Distinguish categories (subject, level, etc.) |
| **Search integration** | Highlight search results on map |
| **Zoom and pan** | Explore dense regions |

### Use Cases for Visualization Maps

**Curriculum Planning**: See all your physics simulations clustered together, identify gaps ("no thermodynamics MicroSims!"), find unexpected connections.

**Student Exploration**: Students browse visually, discovering topics organically rather than through hierarchical menus.

**Collection Analysis**: Administrators see collection balance, over-represented areas, and where new content is needed.

**Finding Outliers**: Items far from any cluster might be unique gems or miscategorized.

### Building an Interactive Map

A good visualization map includes:

1. **2D projection**: t-SNE or PCA reduction to x,y coordinates
2. **Point rendering**: Each MicroSim as an interactive point
3. **Tooltips**: Information on hover
4. **Filtering**: Show/hide by facets (subject, level)
5. **Search highlight**: Mark search results
6. **Navigation**: Zoom, pan, click-to-detail

#### Diagram: MicroSim Embedding Map Explorer

<iframe src="../../sims/embedding-map-explorer/main.html" width="100%" height="600px" scrolling="no"></iframe>

<details markdown="1">
<summary>MicroSim Embedding Space Explorer</summary>
Type: microsim

Bloom Level: Evaluate (L5)
Bloom Verb: assess

Learning Objective: Students will assess the organization of MicroSim collections by exploring an embedding visualization map, identifying clusters, outliers, and semantic relationships between simulations.

Canvas layout:
- Main panel (80%): Zoomable, pannable 2D map
- Side panel (20%): Filters and information display

Visual elements:
- 2D scatter plot map with:
  - 50+ points representing MicroSims
  - Color coded by subject area
  - Size coded by quality score or popularity
  - Cluster labels for major groupings
  - Grid/axis for orientation
- Hover card showing:
  - Title
  - Subject
  - Brief description
  - Thumbnail preview (placeholder)
- Minimap for navigation (small overview)
- Filter panel with checkboxes for subjects
- Search box for finding specific items

Sample data:
- Physics cluster (blue): Mechanics, Waves, E&M subclusters
- Chemistry cluster (green): Molecular, Reactions subclusters
- Math cluster (purple): Algebra, Geometry, Statistics subclusters
- Biology cluster (orange): Cells, Ecosystems subclusters
- CS cluster (teal): Algorithms, Data Structures subclusters
- Some cross-disciplinary items between clusters

Interactive controls:
- Scroll: Zoom in/out
- Click and drag: Pan the view
- Click point: Show detail panel
- Search box: Highlight matching points
- Subject checkboxes: Show/hide categories
- Slider: "Point size" (for dense areas)
- Button: "Reset view"
- Toggle: "Show labels" (point labels on/off)
- Dropdown: "Layout" (t-SNE / PCA / UMAP)

Behavior:
- Hover shows tooltip with MicroSim info
- Click opens detail panel with full information
- Search highlights matching points with glow
- Unchecking subject fades those points
- Zoom enables examining dense cluster regions
- Minimap shows viewport position

Special features:
- "Find similar" from detail panel draws lines to neighbors
- Double-click zooms to cluster
- Keyboard navigation (arrow keys to move selection)

Animation:
- Smooth zoom and pan
- Points fade in/out when filtered
- Connections draw in for "find similar"
- Gentle floating animation for ambient feel

Color scheme:
- Physics: Blues (#3498db, #2980b9)
- Chemistry: Greens (#27ae60, #229954)
- Math: Purples (#9b59b6, #8e44ad)
- Biology: Oranges (#e67e22, #d35400)
- CS: Teals (#1abc9c, #16a085)
- Selected: Gold (#f1c40f)

Implementation: p5.js with zoom/pan and rich interactivity
</details>

---

## Semantic Search in Practice

Let's see how embeddings power semantic search in real MicroSim discovery scenarios.

### Scenario 1: "Find me something like this"

**User action**: Viewing "Pendulum Period Calculator", clicks "Find Similar"

**System process**:
1. Look up pre-computed similar MicroSims for this URL
2. Return top 10 with similarity scores
3. Display ranked list with score badges

**Results**:
- Simple Harmonic Motion (0.92) 🟢
- Spring-Mass Oscillation (0.89) 🟢
- Wave Equation Visualizer (0.81) 🟡
- Energy Conservation Demo (0.78) 🟡
- Circular Motion Explorer (0.74) 🟡

**User benefit**: Discovers related simulations without knowing the right keywords.

### Scenario 2: Semantic Query Search

**User query**: "How do things bounce back and forth?"

**Traditional keyword search**: Zero results (no MicroSim has this exact phrasing)

**Semantic search process**:
1. Generate embedding for the query text
2. Compare to all MicroSim embeddings
3. Return highest similarity matches

**Semantic results**:
- Oscillation Patterns (0.76)
- Pendulum Motion (0.74)
- Spring Dynamics (0.73)
- Harmonic Motion (0.71)

**User benefit**: Natural language works—no need to know technical terms!

### Scenario 3: Collection Diversity Analysis

**Question**: "Do we have good coverage of biology topics?"

**Using embedding map**:
1. Filter to show only Biology points
2. Examine cluster distribution
3. Identify sparse areas

**Discovery**:
- Strong coverage: Cell biology, Ecosystems
- Weak coverage: Genetics, Anatomy, Plant biology
- Gap identified: No simulations about photosynthesis

**Action**: Prioritize creating photosynthesis MicroSim

!!! tip "Embeddings as Analysis Tool"
    Beyond search, embeddings reveal collection structure. Sparse regions in the embedding map show content gaps. Dense regions might indicate redundancy. Outliers might be unique or miscategorized.

---

## Putting It Together: The Complete Semantic Search Flow

Here's how all the concepts connect in a working semantic search system:

```
┌─────────────────────────────────────────────────────────────┐
│                   OFFLINE PROCESSING                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Collect MicroSim metadata                               │
│     ┌─────────────┐                                         │
│     │ metadata.   │ ──→ title, description, subject, etc.  │
│     │ json files  │                                         │
│     └─────────────┘                                         │
│                                                              │
│  2. Generate embeddings                                     │
│     ┌─────────────┐     ┌────────────────────┐             │
│     │ Embedding   │ ──→ │ 384-dim vector for │             │
│     │ Model       │     │ each MicroSim      │             │
│     └─────────────┘     └────────────────────┘             │
│                                                              │
│  3. Compute similarities                                    │
│     ┌─────────────────────────────────────────┐            │
│     │ For each MicroSim, find top 10 similar  │            │
│     │ using cosine similarity                  │            │
│     └─────────────────────────────────────────┘            │
│                                                              │
│  4. Store results                                           │
│     ┌────────────────────┐                                 │
│     │ similar-microsims. │  ~870KB JSON file              │
│     │ json               │                                 │
│     └────────────────────┘                                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    ONLINE SEARCH                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User clicks "Find Similar" on Pendulum simulation         │
│                    │                                        │
│                    ▼                                        │
│  Look up pre-computed neighbors (instant!)                 │
│                    │                                        │
│                    ▼                                        │
│  Display results with similarity scores                    │
│  ┌──────────────────────────────────────────┐             │
│  │ 🟢 Simple Harmonic Motion     0.92       │             │
│  │ 🟢 Spring-Mass System         0.89       │             │
│  │ 🟡 Wave Propagation           0.81       │             │
│  └──────────────────────────────────────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

The heavy computation (embeddings, similarities) happens once, offline. User-facing search is just a lookup—instant and scalable.

---

## Key Takeaways

1. **Embeddings** convert text into numerical vectors where similar meaning = similar numbers

2. **Vector representations** position items in a high-dimensional space organized by semantic relationships

3. **Cosine similarity** measures how aligned two vectors are, ignoring their length—perfect for comparing meaning

4. **Similar MicroSims** uses pre-computed nearest neighbors for instant "more like this" functionality

5. **Similarity scores** range from 0 to 1, with scores above 0.70 indicating meaningfully related content

6. **K-Nearest Neighbors** efficiently finds the K most similar items by comparing embeddings

7. **Dimensionality reduction** compresses 384 dimensions into 2 for visualization while preserving relationships

8. **PCA** captures global variance structure—good for overviews but may lose local detail

9. **t-SNE** preserves local neighborhoods—excellent cluster separation but distances between clusters are meaningless

10. **Visualization maps** enable exploration of entire collections organized by semantic similarity

---

## What's Next?

You've now mastered the fundamentals of semantic search—one of the most powerful technologies in modern information retrieval. You understand how embeddings capture meaning, how similarity is measured, and how visualization makes high-dimensional data explorable.

In the next chapter, we'll shift gears to **Data Pipelines and Aggregation**:

- How to crawl MicroSim repositories automatically
- Aggregating metadata from multiple sources
- Quality scoring and validation
- Building the data infrastructure that powers search

The semantic search technology you've learned here is only as good as the data it searches. Let's learn how to build robust data pipelines!

---

*Ready to build the data infrastructure? Continue to [Chapter 9: Data Pipelines and Aggregation](../09-data-pipelines-aggregation/index.md).*
