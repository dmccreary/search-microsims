# Quiz: Embeddings and Semantic Search

Test your understanding of vector embeddings and semantic search with these questions.

---

#### 1. What is an embedding in the context of semantic search?

<div class="upper-alpha" markdown>
1. A way to insert videos into web pages
2. A numerical representation of content where similar items have similar numbers
3. A method for compressing large files
4. A type of HTML element for displaying images
</div>

??? question "Show Answer"
    The correct answer is **B**. An embedding is a numerical representation of data (text, images, audio) as a list of numbers—a vector—where similar items end up with similar numbers. It's like giving every MicroSim a GPS coordinate in a "meaning space" where similar simulations are located near each other.

    **Concept Tested:** Embeddings

---

#### 2. How do embeddings solve the vocabulary mismatch problem?

<div class="upper-alpha" markdown>
1. By requiring all users to use the same keywords
2. By capturing semantic meaning so related concepts have similar vectors
3. By translating all content to English
4. By removing uncommon words from searches
</div>

??? question "Show Answer"
    The correct answer is **B**. Embeddings convert text into numerical vectors where related concepts have similar vectors, regardless of the specific words used. This means "pendulum" and "oscillation" end up mathematically close even though they're different words, bridging the vocabulary gap between queries and documents.

    **Concept Tested:** Embeddings, Vector Representations

---

#### 3. What is cosine similarity?

<div class="upper-alpha" markdown>
1. A method for measuring file sizes
2. A mathematical measure of similarity between vectors based on the angle between them
3. A type of search filter
4. A way to compress images
</div>

??? question "Show Answer"
    The correct answer is **B**. Cosine similarity is a mathematical measure of similarity between two vectors based on the cosine of the angle between them, ranging from -1 to 1. Two MicroSims about pendulum motion might have embeddings with cosine similarity of 0.92, indicating high semantic similarity.

    **Concept Tested:** Cosine Similarity

---

#### 4. Why do real embedding systems use hundreds of dimensions (like 384) instead of just 2 or 3?

<div class="upper-alpha" markdown>
1. To make the math more impressive
2. To capture more nuance and distinguish subtle differences between concepts
3. To use more computer memory
4. To slow down search for security
</div>

??? question "Show Answer"
    The correct answer is **B**. More dimensions allow embeddings to capture more nuance. A 3-dimensional embedding might put all physics simulations together, but a 384-dimensional embedding can distinguish kinematics from thermodynamics from electromagnetism—and even subtler distinctions within those areas.

    **Concept Tested:** Vector Representations

---

#### 5. What are "similar MicroSims" in a semantic search system?

<div class="upper-alpha" markdown>
1. MicroSims with the same file size
2. MicroSims identified as conceptually related based on embedding similarity
3. MicroSims created by the same author
4. MicroSims uploaded on the same date
</div>

??? question "Show Answer"
    The correct answer is **B**. Similar MicroSims are simulations identified as conceptually related based on semantic similarity of their embeddings. When you find a great pendulum simulation, similar MicroSims might include spring-mass systems, wave motion, or other oscillation concepts—resources connected by meaning rather than keywords.

    **Concept Tested:** Similar MicroSims

---

#### 6. What is the purpose of dimensionality reduction techniques like PCA and t-SNE?

<div class="upper-alpha" markdown>
1. To make embeddings more accurate
2. To reduce data storage costs
3. To project high-dimensional embeddings into 2D or 3D for human visualization
4. To remove duplicate MicroSims
</div>

??? question "Show Answer"
    The correct answer is **C**. Dimensionality reduction techniques like PCA (Principal Component Analysis) and t-SNE (t-distributed Stochastic Neighbor Embedding) project 384-dimensional embeddings into 2D or 3D for visualization. Since humans can't visualize 384-dimensional space, these techniques reveal clustering patterns and relationships.

    **Concept Tested:** Dimensionality Reduction, PCA, t-SNE

---

#### 7. What is a similarity score?

<div class="upper-alpha" markdown>
1. A grade assigned by teachers
2. A numerical measure of how closely two items match, typically from 0 to 1
3. The number of shared keywords between documents
4. The file size ratio between two MicroSims
</div>

??? question "Show Answer"
    The correct answer is **B**. A similarity score is a numerical measure of how closely two items match, typically ranging from 0 (unrelated) to 1 (identical). In semantic search, similarity scores are calculated using cosine similarity between embedding vectors, indicating how conceptually related two MicroSims are.

    **Concept Tested:** Similarity Score

---

#### 8. What are nearest neighbors in embedding space?

<div class="upper-alpha" markdown>
1. MicroSims stored in adjacent file folders
2. Items whose embeddings are closest to a query embedding based on similarity
3. Users who live in the same geographic area
4. Documents created at similar times
</div>

??? question "Show Answer"
    The correct answer is **B**. Nearest neighbors are items in a collection that are most similar to a query item based on similarity in embedding space. When you search for MicroSims similar to a pendulum simulation, the system finds the MicroSims whose embeddings are mathematically closest to the pendulum's embedding.

    **Concept Tested:** Nearest Neighbors

---

#### 9. What key advantage does semantic search have over keyword search?

<div class="upper-alpha" markdown>
1. It's faster to compute
2. It uses less storage space
3. It finds conceptually related content even when different terminology is used
4. It requires simpler infrastructure
</div>

??? question "Show Answer"
    The correct answer is **C**. Semantic search understands meaning rather than just matching keywords. It can recognize that a pendulum simulation and a spring-mass simulation are conceptually similar, even if they never share a single word in their descriptions. This finds what you meant, not just what you typed.

    **Concept Tested:** Embeddings

---

#### 10. What is a visualization map in the context of embeddings?

<div class="upper-alpha" markdown>
1. A geographic map showing MicroSim locations
2. A 2D or 3D plot showing relationships between items based on their embeddings
3. A flowchart of the search process
4. A diagram of the file system structure
</div>

??? question "Show Answer"
    The correct answer is **B**. A visualization map is a 2D or 3D plot showing the relationships between items based on their embedding vectors. Created using dimensionality reduction techniques, these maps reveal clustering patterns—similar MicroSims appear as groups, making the conceptual organization of a collection visible.

    **Concept Tested:** Visualization Maps
