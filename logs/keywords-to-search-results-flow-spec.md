# Keywords to Search Results Data Flow

This is version 1

Type: workflow

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning Objective: Students will explain how keywords in metadata connect user search queries to relevant MicroSim results through matching and ranking processes.

Purpose: Visualize the journey from user query through keyword matching to ranked results

Steps (left to right flow):
1. User Query (person icon with search box)
   - Example: "physics ball throwing simulation"
   - Shows query being tokenized into words

2. Query Processing (gear icon)
   - Tokenization: ["physics", "ball", "throwing", "simulation"]
   - Normalization: lowercase, stemming
   - Synonym expansion: "throwing" → ["throwing", "projectile", "launch"]

3. Keyword Matching (database icon with arrows)
   - Compare query terms against MicroSim keywords
   - Calculate match scores
   - Show multiple MicroSims being evaluated

4. Ranking (sorting icon)
   - Score: keyword matches + metadata quality
   - Factors: exact match > partial match > synonym match
   - Freshness, popularity bonuses

5. Results (list with thumbnails)
   - Ordered list of matching MicroSims
   - Match score badges
   - Highlighted matching keywords

Interactive elements:
- Enter custom search query and see matching process
- Hover over each stage for detailed explanation
- Click to see sample data at each stage

Visual style: Horizontal flow diagram with stages as rounded rectangles
Color scheme: Blue for user side, green for processing, orange for results
Animation: Data flows between stages with subtle particle effects

Implementation: HTML/CSS/JavaScript with animated flow visualization
