# Quiz: Search Fundamentals

Test your understanding of information retrieval concepts with these questions.

---

#### 1. What is precision in the context of search?

<div class="upper-alpha" markdown>
1. The total number of documents in the collection
2. The fraction of returned results that are actually relevant to the query
3. The speed at which search results are displayed
4. The number of keywords in a search query
</div>

??? question "Show Answer"
    The correct answer is **B**. Precision measures what fraction of returned results are actually relevant to your query. If a search returns 20 results and 16 are relevant, precision is 80% (16/20). High precision means most results are useful; low precision means you're wading through irrelevant content.

    **Concept Tested:** Precision

---

#### 2. What is recall in search systems?

<div class="upper-alpha" markdown>
1. The ability to remember previous searches
2. The fraction of all relevant documents that were successfully retrieved
3. The time it takes to process a query
4. The number of pages in the search results
</div>

??? question "Show Answer"
    The correct answer is **B**. Recall measures what fraction of all relevant documents in the collection were actually retrieved. If 25 relevant MicroSims exist and your search finds 16 of them, recall is 64% (16/25). High recall means you found most of what exists; low recall means you missed things.

    **Concept Tested:** Recall

---

#### 3. Why is there typically a trade-off between precision and recall?

<div class="upper-alpha" markdown>
1. They are measured in different units
2. Very specific queries increase precision but may miss relevant items (lower recall)
3. They cannot be measured at the same time
4. Recall is always more important than precision
</div>

??? question "Show Answer"
    The correct answer is **B**. Precision and recall often work against each other. Very specific queries increase precision (fewer irrelevant results) but decrease recall (you might miss relevant ones). Broad queries increase recall (find more relevant items) but decrease precision (more noise). The right balance depends on your use case.

    **Concept Tested:** Precision, Recall

---

#### 4. What does the AND operator do in Boolean search?

<div class="upper-alpha" markdown>
1. Adds the results of two searches together
2. Requires all connected terms to appear in results, narrowing the search
3. Finds synonyms of the search terms
4. Sorts results alphabetically
</div>

??? question "Show Answer"
    The correct answer is **B**. The AND operator requires all connected terms to appear in results, narrowing the search to documents matching all criteria. For example, `physics AND pendulum AND undergraduate` returns only documents containing all three terms, producing fewer but more targeted results.

    **Concept Tested:** AND Operator

---

#### 5. What does the OR operator do in Boolean search?

<div class="upper-alpha" markdown>
1. Excludes documents containing either term
2. Accepts documents containing any of the connected terms, broadening results
3. Requires documents to contain all terms
4. Ranks results by date
</div>

??? question "Show Answer"
    The correct answer is **B**. The OR operator accepts documents containing any of the connected terms, broadening results. The query `simulation OR visualization OR animation` finds documents containing any of these terms, casting a wider net to ensure you don't miss relevant resources that use different terminology.

    **Concept Tested:** OR Operator

---

#### 6. How does the NOT operator affect search results?

<div class="upper-alpha" markdown>
1. It requires the term to appear in results
2. It excludes documents containing the specified term from results
3. It highlights the term in the results
4. It sorts results by relevance
</div>

??? question "Show Answer"
    The correct answer is **B**. The NOT operator excludes documents containing the specified term from results. The query `wave AND physics NOT ocean` finds physics wave content while excluding ocean wave simulations. This is useful for filtering out irrelevant results that happen to share terminology.

    **Concept Tested:** NOT Operator

---

#### 7. What is an inverted index?

<div class="upper-alpha" markdown>
1. A search results page displayed upside down
2. A data structure mapping terms to the documents containing them for fast lookup
3. A way to reverse the order of search results
4. A backup copy of the document collection
</div>

??? question "Show Answer"
    The correct answer is **B**. An inverted index is a data structure that maps terms to the documents containing them, enabling fast keyword lookup. Instead of reading every document for each query, the system looks up which documents contain each search term. An entry for "pendulum" might list [Doc1, Doc5, Doc12].

    **Concept Tested:** Indexing

---

#### 8. What is relevance ranking in search?

<div class="upper-alpha" markdown>
1. Sorting results alphabetically by title
2. Ordering results by estimated relevance so best matches appear first
3. Counting how many times each document has been viewed
4. Grouping results by file type
</div>

??? question "Show Answer"
    The correct answer is **B**. Ranking determines which results appear first when there are many matches. Search engines use signals like term frequency, field importance (title match vs description match), document quality, freshness, and popularity to calculate relevance scores. Better ranking ensures the best matches appear at the top.

    **Concept Tested:** Ranking

---

#### 9. What is the "vocabulary mismatch problem" in information retrieval?

<div class="upper-alpha" markdown>
1. When users type in the wrong language
2. When users describe queries differently than how documents describe content
3. When documents contain spelling errors
4. When the search box is too small
</div>

??? question "Show Answer"
    The correct answer is **B**. The vocabulary mismatch problem occurs when users describe what they want in their words, while documents describe content in potentially different words. Your query might be "pendulum swing" but the MicroSim's metadata says "simple harmonic motion." Bridging this gap is a core challenge in search.

    **Concept Tested:** Information Retrieval

---

#### 10. What is keyword search?

<div class="upper-alpha" markdown>
1. A search that uses only one word
2. A search method that finds documents containing the specific words entered
3. A search that requires exact phrase matching
4. A search limited to document titles only
</div>

??? question "Show Answer"
    The correct answer is **B**. Keyword search finds documents containing the specific words entered in the query. You type words, the system finds documents containing those words using pre-built indexes. It's simple, intuitive, and fast, but only matches exact words—it won't connect "pendulum" to "oscillation" unless both appear in the metadata.

    **Concept Tested:** Keyword Search
