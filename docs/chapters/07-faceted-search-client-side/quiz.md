# Quiz: Faceted Search and Client-Side Search

Test your understanding of faceted search and client-side implementation with these questions.

---

#### 1. What is a facet in the context of search?

<div class="upper-alpha" markdown>
1. A type of search engine algorithm
2. A distinct dimension or category by which items can be classified and filtered
3. A visual effect applied to search results
4. A method for sorting results alphabetically
</div>

??? question "Show Answer"
    The correct answer is **B**. A facet is a distinct dimension or category by which items can be classified and filtered. Think of facets as different "lenses" for viewing your collection—Subject Area, Grade Level, Difficulty, Framework, and Visualization Type are common facets for MicroSims.

    **Concept Tested:** Facets

---

#### 2. What is the main advantage of faceted search over traditional keyword search?

<div class="upper-alpha" markdown>
1. Faceted search is faster
2. Users can filter by multiple dimensions without learning query syntax
3. Faceted search uses less memory
4. Keywords are obsolete technology
</div>

??? question "Show Answer"
    The correct answer is **B**. Faceted search allows users to filter by multiple dimensions (Subject, Grade Level, Difficulty) using point-and-click selection without needing to craft complex Boolean queries. Teachers can simply click checkboxes: Physics ✓, Undergraduate ✓, Interactive Simulation ✓.

    **Concept Tested:** Faceted Search

---

#### 3. What is client-side search?

<div class="upper-alpha" markdown>
1. Search that only works on desktop computers
2. Search that runs entirely in the user's browser without server communication
3. Search that requires a paid subscription
4. Search limited to client data only
</div>

??? question "Show Answer"
    The correct answer is **B**. Client-side search runs entirely in the user's web browser using downloaded data, providing instant results without server communication. It's ideal for MicroSim repositories with hundreds to thousands of items, offering fast response times and privacy since queries never leave the user's device.

    **Concept Tested:** Client-Side Search

---

#### 4. What is ItemsJS?

<div class="upper-alpha" markdown>
1. A server-side database management system
2. A JavaScript library for client-side faceted search
3. A file format for storing MicroSim data
4. A programming language for animations
</div>

??? question "Show Answer"
    The correct answer is **B**. ItemsJS is a JavaScript library for client-side faceted search that powers the MicroSim search interface. It enables instant filtering and searching without requiring a backend server, making it perfect for static websites hosted on platforms like GitHub Pages.

    **Concept Tested:** ItemsJS Library

---

#### 5. What happens when a user selects a facet value in faceted search?

<div class="upper-alpha" markdown>
1. The page reloads completely
2. Results filter immediately and counts recalculate for other facets
3. An email is sent to the administrator
4. The selected value is saved to a database
</div>

??? question "Show Answer"
    The correct answer is **B**. When a user selects a facet value (like clicking "Physics" under Subject Area), results update immediately to show only matching items, and counts recalculate for all other facets to show how many items remain within each category. This progressive refinement continues until desired results are found.

    **Concept Tested:** Faceted Search

---

#### 6. What is an underappreciated benefit of faceted search interfaces?

<div class="upper-alpha" markdown>
1. They use less bandwidth than keyword search
2. They reveal what options exist in the collection, educating users while filtering
3. They eliminate the need for metadata
4. They automatically translate content
</div>

??? question "Show Answer"
    The correct answer is **B**. One underappreciated benefit of faceted search is that users see what options exist. If the Grade Level facet shows "K-12 (45), Undergraduate (120), Graduate (23)", users immediately understand the collection's composition. Facets educate while they filter.

    **Concept Tested:** Facets

---

#### 7. What is the benefit of combining keyword search with faceted search?

<div class="upper-alpha" markdown>
1. It makes the interface more complex and professional
2. Keywords provide free-text exploration while facets provide precise filtering
3. It reduces the number of search results to zero
4. It eliminates the need for metadata standards
</div>

??? question "Show Answer"
    The correct answer is **B**. Combining keyword search with faceted search provides the best of both worlds: keywords enable free-text exploration (search for "wave" to find wave-related simulations), while facets provide precise filtering (then filter by Grade Level: Undergraduate and Framework: p5.js).

    **Concept Tested:** Faceted Search, Filter Controls

---

#### 8. What logic is applied when multiple values are selected within the same facet?

<div class="upper-alpha" markdown>
1. AND logic (must match all selected values)
2. OR logic (must match any selected value)
3. NOT logic (must not match any selected value)
4. XOR logic (must match exactly one value)
</div>

??? question "Show Answer"
    The correct answer is **B**. When multiple values are selected within the same facet (e.g., selecting both "Physics" and "Chemistry" under Subject Area), OR logic is applied—results matching any selected value are included. However, selections across different facets use AND logic.

    **Concept Tested:** Filter Controls

---

#### 9. What is "lightweight search" in the context of MicroSim discovery?

<div class="upper-alpha" markdown>
1. Search that only finds small files
2. Search functionality that operates with minimal computational resources
3. Search limited to titles only
4. Search that ignores most metadata fields
</div>

??? question "Show Answer"
    The correct answer is **B**. Lightweight search refers to search functionality that operates with minimal computational resources, suitable for static websites. Client-side search with ItemsJS is an example—it loads data once into the browser and performs all filtering locally without server infrastructure.

    **Concept Tested:** Lightweight Search

---

#### 10. Why is an inverted index important for search performance?

<div class="upper-alpha" markdown>
1. It stores files upside down for compression
2. It maps terms to documents for fast lookup without scanning every document
3. It reverses the order of search results
4. It converts images to text
</div>

??? question "Show Answer"
    The correct answer is **B**. An inverted index maps terms to the documents containing them, enabling fast keyword lookup. Instead of reading every document for each query (which would be slow), the system looks up which documents contain each search term directly from the index.

    **Concept Tested:** Inverted Index
