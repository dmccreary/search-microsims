# MicroSim Search and Similarity FAQ

This FAQ addresses common questions about MicroSim search, metadata, embeddings, and building effective search systems for educational simulations.

## Getting Started

### What is this course about?

This course teaches you how to create high-quality search and retrieval applications that work with MicroSim metadata. You'll learn how to build search tools that help educators find the perfect interactive simulation for their teaching needs, and how AI systems can use these search capabilities to generate better MicroSims. The course covers everything from basic metadata concepts to advanced semantic search using embeddings.

### Who is this course designed for?

The ideal audience is educators or software developers who want to build and customize MicroSim search tools. You don't need a strong background in search technology—we cover all the basics in the introductory chapters. However, if you're already familiar with MicroSims or curious about how teachers can reuse similar components, you'll find valuable insights throughout.

### What do I need to know before starting?

You should have access to a web browser and be familiar with how web search engines work and how search results are ranked by relevancy. That's it for the main content. There are optional advanced exercises at the end targeting software developers who want to customize search tools, but these require programming knowledge.

### What is a MicroSim?

A MicroSim (Micro Simulation) is a small, focused, interactive visualization designed to teach a single concept or explore one idea. Think of it as the educational equivalent of a well-crafted espresso shot—concentrated and powerful. Unlike sprawling educational software, a MicroSim does one thing exceptionally well. For example, a pendulum period explorer lets students adjust the pendulum length and observe how swing timing changes.

### Why do MicroSims need search systems?

Creating amazing MicroSims is only half the battle—if educators can't find them, they might as well not exist. With thousands of educational simulations scattered across the internet, teachers need powerful search tools to discover the perfect simulation for their class. Good search systems also help AI generators find the right reference examples when creating new MicroSims.

### What files make up a MicroSim?

A standard MicroSim contains five files: `index.md` (documentation and description), `main.html` (the primary HTML file with structure and scripts), `style.css` (visual styling rules), `data.json` (data that drives the content), and `metadata.json` (structured metadata following the schema specification).

### What JavaScript libraries are commonly used in MicroSims?

The most common libraries include p5.js (creative coding and animation), Chart.js (responsive charts), mermaid.js (diagrams and flowcharts), vis-network.js (network graphs), vis-timeline.js (timelines), plotly.js (publication-quality graphs), and leaflet.js (interactive maps). The p5.js framework is particularly popular for physics simulations and interactive visualizations.

## Core Concepts

### What is metadata and why does it matter for MicroSims?

Metadata is data that describes other data—information about a resource's content, format, and context. For MicroSims, metadata includes title, subject area, grade level, learning objectives, and technical details. Metadata makes MicroSims findable by providing the descriptive information that search systems match against user queries. Without good metadata, even brilliant simulations remain hidden.

### What is Dublin Core?

Dublin Core is a metadata standard consisting of 15 elements for describing digital resources. Developed in 1995 in Dublin, Ohio, it's widely adopted because of its simplicity and flexibility. Dublin Core provides the foundation for MicroSim metadata, enabling discovery across different platforms and repositories.

### What are the 15 Dublin Core elements?

The 15 Dublin Core elements are: Title, Creator, Subject, Description, Publisher, Contributor, Date, Type, Format, Identifier, Source, Language, Relation, Coverage, and Rights. For MicroSims, the most important are Title, Creator, Subject, Description, Date, Format, and Rights. The others add richness when relevant.

### What is Bloom's Taxonomy and how does it apply to MicroSims?

Bloom's Taxonomy is a hierarchical classification of cognitive learning objectives with six levels: Remember, Understand, Apply, Analyze, Evaluate, and Create. For MicroSims, Bloom's Taxonomy helps designers target appropriate cognitive complexity. A simulation for the "Apply" level might require students to use a formula with different parameters, while one for "Analyze" might ask students to examine relationships between variables.

### What's the difference between required and optional metadata fields?

Required fields must be populated for a MicroSim to be considered minimally complete—these typically include title, description, and subject area. Optional fields enhance discoverability but aren't essential for basic functionality—examples include contributor, source, and detailed technical specifications. The completeness score indicates what percentage of all recommended fields have been filled in.

### What is a learning objective?

A learning objective is a specific statement describing what learners should know or be able to do after engaging with educational content. Well-crafted learning objectives guide MicroSim design and help match simulations to appropriate Bloom's Taxonomy levels. For example: "Students will predict where constructive interference occurs given two wave sources."

### What is subject normalization?

Subject normalization maps variant terms to standard forms so that different phrasings can be matched to the same concept. For example, "Math," "Mathematics," and "Maths" all normalize to "Mathematics" for consistent search matching. Without normalization, a search for "Mathematics" would miss simulations tagged with "Math."

## Search Fundamentals

### What is precision in search?

Precision measures what fraction of returned results are actually relevant to your query. If a search returns 20 results and 16 are relevant, precision is 80%. High precision means most results are useful; low precision means you're wading through irrelevant content.

### What is recall in search?

Recall measures what fraction of all relevant documents in the collection were actually retrieved. If 25 relevant MicroSims exist and your search finds 16 of them, recall is 64%. High recall means you found most of what exists; low recall means you missed things.

### Why is there a trade-off between precision and recall?

Precision and recall often work against each other. Very specific queries increase precision (fewer irrelevant results) but decrease recall (you might miss relevant ones). Broad queries increase recall (find more relevant items) but decrease precision (more noise). The right balance depends on your use case—browsing for ideas favors recall, while finding a specific simulation favors precision.

### What is keyword search?

Keyword search finds documents containing the specific words entered in the query. You type words, the system finds documents containing those words. It's simple, intuitive, and fast because it uses pre-built indexes. The limitation is that it only matches exact words—it won't connect "pendulum" to "oscillation" unless both words appear in the metadata.

### What are Boolean operators and how do I use them?

Boolean operators (AND, OR, NOT) combine or exclude search terms for more precise results. AND requires all terms to appear (narrows results), OR accepts any term (broadens results), and NOT excludes terms. For example: `(physics OR chemistry) AND simulation NOT video` finds physics or chemistry simulations while excluding videos.

### What is faceted search?

Faceted search allows users to filter results by multiple independent dimensions simultaneously. Instead of crafting complex queries, users click checkboxes: Physics, Undergraduate, Interactive Simulation. The system narrows results in real-time. Facets typically include subject area, grade level, difficulty, framework, and visualization type.

### What is the difference between keyword search and faceted search?

Keyword search requires typing search terms and relies on text matching, while faceted search uses point-and-click selection from predefined categories. Keyword search requires knowing the right terminology; faceted search shows you what options exist. The most effective search systems combine both approaches.

### What is an inverted index?

An inverted index is a data structure that maps terms to the documents containing them, enabling fast keyword lookup. Instead of reading every document for each query, the system looks up which documents contain each search term. For example, an entry for "pendulum" might list [Doc1, Doc5, Doc12], indicating which MicroSims mention that term.

### What is ranking in search results?

Ranking determines which results appear first when there are many matches. Search engines use signals like term frequency, field importance (title match vs description match), document quality, freshness, and popularity to calculate relevance scores. The top positions get almost all user attention—if your best MicroSim ranks #47, almost no one will find it.

## Semantic Search and Embeddings

### What is semantic search?

Semantic search understands the meaning of queries and documents to find conceptually related results beyond keyword matching. It can recognize that a pendulum simulation and a spring-mass simulation are conceptually similar, even if they share no words. Semantic search finds what you meant, not just what you typed.

### What are embeddings?

Embeddings are numerical representations of content (text, images, or anything else) as lists of numbers—vectors—where similar items have similar numbers. It's like giving every MicroSim a GPS coordinate in a "meaning space" where similar simulations are located near each other. Our system uses 384-dimensional embeddings for MicroSim metadata.

### How do embeddings enable semantic search?

Embeddings transform MicroSim metadata into numerical vectors that capture semantic meaning. When you search for "oscillating motion," the system converts your query into an embedding, then finds MicroSims whose embeddings are mathematically close—returning simulations about pendulums and springs even though they don't contain the exact phrase "oscillating motion."

### What is cosine similarity?

Cosine similarity is a mathematical measure of similarity between two vectors based on the cosine of the angle between them, ranging from -1 to 1. Two MicroSims about pendulum motion might have embeddings with cosine similarity of 0.92, indicating high semantic similarity. It's the primary metric used to find similar MicroSims.

### What are similar MicroSims?

Similar MicroSims are simulations identified as conceptually related based on semantic similarity of their content and metadata. When you find a great pendulum simulation, similar MicroSims might include spring-mass systems, wave motion, or other oscillation concepts—resources that a keyword search might never connect.

### What is dimensionality reduction?

Dimensionality reduction techniques reduce the number of variables in data while preserving important relationships. Since humans can't visualize 384-dimensional embedding space, techniques like PCA and t-SNE project embeddings into 2D or 3D for visualization. This reveals clustering patterns—similar MicroSims appear as groups on the visualization.

### What is PCA?

PCA (Principal Component Analysis) is a dimensionality reduction technique that finds the directions of maximum variance in data. For MicroSim embeddings, PCA helps visualize which simulations are similar by projecting 384 dimensions down to 2D. The PCA map shows clusters of related simulations.

## Technical Implementation

### What is client-side search?

Client-side search runs entirely in the user's web browser using downloaded data, providing instant results without server communication. It's ideal for MicroSim repositories with hundreds to thousands of items, offering fast response times and privacy since queries never leave the user's device. Our search uses ItemsJS for client-side faceted search.

### What is ItemsJS?

ItemsJS is a JavaScript library for client-side faceted search that powers the MicroSim search interface. It enables instant filtering and searching without requiring a backend server, making it perfect for static websites hosted on platforms like GitHub Pages.

### What is responsive design for MicroSims?

Responsive design ensures MicroSims adapt their layout and functionality to work effectively across different screen sizes and devices. Width-responsive MicroSims automatically adjust to fit their container, while iframe heights are typically fixed. The goal is ensuring simulations work on desktops, tablets, and phones.

### What is the difference between the drawing region and control region?

The drawing region is the area of a MicroSim's canvas dedicated to displaying visual output and animations. The control region is the area dedicated to user input controls like sliders, buttons, and menus. Clear separation between these regions improves usability and allows for consistent layouts.

### What layout types are available for MicroSims?

Common layouts include fixed layout (predetermined dimensions that don't change), two-panel layout (typically controls on one side and visualization on the other), and three-panel layout (controls, visualization, and information areas). The choice depends on the complexity of the simulation and the number of controls needed.

### What is accessibility in MicroSims?

Accessibility ensures MicroSims are usable by people with disabilities. Key features include keyboard navigation (operating all controls without a mouse), screen reader support (conveying information through assistive technology), and high contrast modes. The p5.js describe() function adds text descriptions for screen readers.

## Common Challenges

### Why can't users find my MicroSim even though it exists?

The most common cause is poor or missing metadata. If your MicroSim lacks proper title, description, subject area, or keywords, search systems have nothing to match against. Fill out complete metadata including both technical terminology and everyday language that users might search for.

### What causes low precision in search results?

Low precision (too many irrelevant results) often results from metadata that's too general, missing subject area classification, or keywords that are too broad. Improving precision requires more specific metadata, proper categorization, and controlled vocabulary for key fields.

### What causes low recall in search?

Low recall (missing relevant results) usually happens when metadata uses different terminology than searchers expect, or when subject normalization isn't working. Adding synonyms to keywords, using standardized subject terms, and including multiple phrasings can improve recall.

### How do I choose the right visualization type?

Match the visualization type to your learning objective. Animations work well for showing change over time, charts for data relationships, simulations for parameter exploration, and diagrams for structural relationships. Consider what cognitive activity you want to support—passive observation, active manipulation, or analysis.

### Why do semantically similar MicroSims appear far apart in search results?

This happens when relying solely on keyword search. Two simulations about the same concept but using different terminology won't match. The solution is semantic search using embeddings, which compares meaning rather than exact words.

### What's the best practice for tagging MicroSims?

Use a combination of controlled vocabulary (standardized subject areas, grade levels) and free-form tags (specific details, emerging terminology). Include both technical terms that experts use and everyday language that beginners might search for. Tags like "flipped-classroom" or "test-prep" capture contexts that formal taxonomies miss.

## Best Practices

### How should I write effective metadata descriptions?

Write descriptions that are specific, searchable, and include the learning objective. Lead with what the MicroSim does, mention the key concept, note the target audience, and include important keywords naturally. A good description is 50-150 words and answers: "What will users learn by interacting with this?"

### What makes a good learning objective for a MicroSim?

Use the format: "Students will [Bloom's verb] [specific content] by [observable action]." Be specific about what learners will do, use measurable verbs from Bloom's Taxonomy, and keep it focused on a single outcome. For example: "Students will predict pendulum period by adjusting length and observing the relationship."

### When should I use keyword search vs. faceted search vs. semantic search?

Use keyword search when you know specific terminology. Use faceted search when exploring what's available or filtering by known categories. Use semantic search when looking for conceptually similar content without knowing exact terms. The best systems combine all three approaches.

### How do I improve findability for my MicroSims?

Fill out complete metadata using the schema. Use descriptive titles that include the main concept. Write thorough descriptions with relevant keywords. Classify correctly by subject area, grade level, and difficulty. Add tags for specific features and use cases. Test by searching for your simulation using terms a teacher might use.

### What's the recommended approach for choosing a JavaScript framework?

Choose based on your visualization needs: p5.js for animations and creative coding, Chart.js for data charts, mermaid.js for diagrams and flowcharts, vis-network.js for network graphs, vis-timeline.js for timelines, plotly.js for scientific graphs, and leaflet.js for maps. p5.js is the most versatile for interactive educational simulations.

### How do I balance simplicity and complexity in MicroSim design?

Follow the "one concept, one MicroSim" principle. Start with the minimum viable simulation that teaches the core concept. Add complexity only when it directly supports learning—not for feature's sake. Use progressive disclosure to hide advanced options initially. Remember that simpler simulations are faster to create, easier to maintain, and more likely to work across devices.

## Advanced Topics

### How can AI use MicroSim search to generate better simulations?

AI MicroSim generators can use semantic search to find high-quality reference examples before generating new code. By finding MicroSims that are conceptually similar to what's being requested, the AI can learn from working implementations with consistent user interfaces. This template-matching approach produces more reliable results than generating from scratch.

### What is RAG and how does it apply to MicroSims?

RAG (Retrieval-Augmented Generation) combines search retrieval with AI generation to produce grounded responses. For MicroSims, RAG means an AI first searches for relevant existing simulations, then uses that context when generating new code or answering questions. This reduces hallucination and improves accuracy.

### How do embeddings enable template matching?

When you describe a new MicroSim you want to create, the system converts your description into an embedding and finds existing MicroSims with similar embeddings. These serve as templates—working examples that demonstrate how similar concepts have been implemented. The AI can then adapt the template's approach rather than starting from scratch.

### What is pedagogical metadata and why does it matter?

Pedagogical metadata describes how a MicroSim teaches, including interaction patterns, pacing, and Bloom alignment. It enables template matching systems to recommend MicroSims that support specific learning objectives, not just topically similar content. A template might be visually similar but pedagogically mismatched without this metadata.

### How do I build a data pipeline for MicroSim aggregation?

Data pipelines typically involve crawling repositories (like GitHub) to discover metadata.json files, validating against the schema, normalizing fields, generating embeddings, and indexing for search. The pipeline should handle incremental updates, track quality scores, and maintain logs of missing metadata.

### How can I visualize the MicroSim embedding space?

Use dimensionality reduction techniques (PCA or t-SNE) to project 384-dimensional embeddings into 2D or 3D. Plot each MicroSim as a point, colored by subject area or other facets. Similar simulations cluster together, revealing the conceptual organization of your collection. Interactive visualization tools let users explore these clusters.
