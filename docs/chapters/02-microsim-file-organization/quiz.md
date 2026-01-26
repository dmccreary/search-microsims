# Quiz: MicroSim File Organization

Test your understanding of MicroSim file structure and organization with these questions.

---

#### 1. What naming convention should be used for MicroSim directories?

<div class="upper-alpha" markdown>
1. CamelCase with no spaces
2. Kebab-case with all lowercase letters and hyphens
3. Uppercase with underscores
4. Any format the creator prefers
</div>

??? question "Show Answer"
    The correct answer is **B**. MicroSim directories use kebab-case: all lowercase letters with hyphens separating words. For example: `pendulum-simulator`, `quadratic-equation-explorer`. No spaces, no capital letters, no underscores. This convention ensures URL-friendly names and consistency across all MicroSims.

    **Concept Tested:** File Organization

---

#### 2. Which file serves as the "front door" to a MicroSim, providing human-readable documentation?

<div class="upper-alpha" markdown>
1. main.html
2. style.css
3. index.md
4. metadata.json
</div>

??? question "Show Answer"
    The correct answer is **C**. The index.md file is the front door to your MicroSim—the first thing humans read when they want to understand what the simulation does. Written in Markdown, it contains the title, description, learning objectives, usage instructions, and pedagogical notes.

    **Concept Tested:** index.md File

---

#### 3. What is the primary purpose of the main.html file in a MicroSim?

<div class="upper-alpha" markdown>
1. To store metadata for search engines
2. To contain the actual simulation code and be the iframe target
3. To define the visual styling
4. To hold configuration data
</div>

??? question "Show Answer"
    The correct answer is **B**. The main.html file is the star of the show—it contains (or links to) the actual simulation code. When you embed a MicroSim in an iframe, this is the file you're pointing to. It includes HTML structure, JavaScript library references, simulation code, control elements, and canvas elements for visualization.

    **Concept Tested:** main.html File

---

#### 4. Why is it beneficial to store simulation data in a separate data.json file?

<div class="upper-alpha" markdown>
1. It makes the simulation run faster
2. It allows easier updates without touching code and enables non-programmers to modify content
3. It is required by all web browsers
4. It automatically translates the content
</div>

??? question "Show Answer"
    The correct answer is **B**. Storing data in a separate data.json file makes MicroSims more flexible and maintainable. Changes can be made without touching code, teachers can modify content without JavaScript knowledge, different datasets can be swapped for different scenarios, and simulation logic isn't cluttered with data definitions.

    **Concept Tested:** data.json File

---

#### 5. What makes the metadata.json file a "superpower" for MicroSim discovery?

<div class="upper-alpha" markdown>
1. It makes the simulation graphics look better
2. It contains structured information that enables search, categorization, and AI integration
3. It speeds up the simulation's performance
4. It provides virus protection
</div>

??? question "Show Answer"
    The correct answer is **B**. The metadata.json file contains structured information about the MicroSim that enables search engines, AI systems, and educational platforms to understand, categorize, and recommend the simulation. It answers questions about subject, grade level, learning objectives, technology, creator, and permissions—enabling powerful search and discovery.

    **Concept Tested:** metadata.json File

---

#### 6. Which files are required (not optional) for a properly structured MicroSim?

<div class="upper-alpha" markdown>
1. Only main.html
2. index.md and main.html
3. All five files: index.md, main.html, style.css, data.json, metadata.json
4. style.css and data.json only
</div>

??? question "Show Answer"
    The correct answer is **B**. The two required files are index.md (human-readable documentation) and main.html (the actual simulation). The style.css, data.json, and metadata.json files are optional or recommended but not strictly required for a MicroSim to function.

    **Concept Tested:** MicroSim Structure

---

#### 7. What is the purpose of putting each MicroSim in its own directory?

<div class="upper-alpha" markdown>
1. To use more disk space
2. To enable isolation, portability, discoverability, and version control
3. To make files harder to find
4. To comply with government regulations
</div>

??? question "Show Answer"
    The correct answer is **B**. Each MicroSim living in its own directory provides multiple benefits: isolation (prevents file conflicts), portability (can zip and share the entire folder), discoverability (search crawlers know where to look), consistency (users develop muscle memory), and version control (easy to track changes in Git).

    **Concept Tested:** File Organization

---

#### 8. In MkDocs-based textbooks, what happens when someone navigates to a MicroSim's directory URL?

<div class="upper-alpha" markdown>
1. An error page appears
2. The index.md file is automatically served as the landing page
3. All files download automatically
4. The browser requests a login
</div>

??? question "Show Answer"
    The correct answer is **B**. In MkDocs-based textbooks, the index.md file automatically becomes the directory's landing page. When someone navigates to `/sims/pendulum-physics/`, MkDocs serves the index.md as the default page, displaying the human-readable documentation for that MicroSim.

    **Concept Tested:** index.md File

---

#### 9. Why might a MicroSim creator choose to separate CSS into its own style.css file?

<div class="upper-alpha" markdown>
1. It is legally required
2. It follows web development best practices and makes maintenance easier
3. It makes the simulation run offline
4. It prevents security vulnerabilities
</div>

??? question "Show Answer"
    The correct answer is **B**. Separating CSS into its own file follows web development best practices and makes maintenance easier. While some MicroSims use inline styles or p5.js programmatic styling, a separate style.css enables easier updates, consistent visual identity across multiple MicroSims, and cleaner code organization.

    **Concept Tested:** style.css File

---

#### 10. What does the directory name serve as in the MicroSim ecosystem?

<div class="upper-alpha" markdown>
1. The copyright holder's name
2. The MicroSim's unique identifier
3. The date of creation
4. The license type
</div>

??? question "Show Answer"
    The correct answer is **B**. The directory name serves as the MicroSim's unique identifier. When you see a URL like `example.com/sims/pendulum-physics/main.html`, you immediately know you're looking at a MicroSim about pendulum physics. This identifier makes resources consistently locatable and shareable.

    **Concept Tested:** MicroSim Structure
