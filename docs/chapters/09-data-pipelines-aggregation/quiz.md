# Quiz: Data Pipelines and Aggregation

Test your understanding of data gathering and pipeline concepts with these questions.

---

#### 1. What is the primary purpose of a data pipeline for MicroSim search?

<div class="upper-alpha" markdown>
1. To display animations on web pages
2. To automatically discover, extract, and aggregate MicroSim metadata from multiple sources
3. To convert video files to audio
4. To manage user accounts
</div>

??? question "Show Answer"
    The correct answer is **B**. A data pipeline automatically discovers new MicroSims, extracts their metadata, validates quality, and delivers a fresh, searchable collection. This automation prevents the need for manual copying from hundreds of repositories and keeps the collection current as new simulations are published.

    **Concept Tested:** Data Gathering, Data Aggregation

---

#### 2. What is web crawling?

<div class="upper-alpha" markdown>
1. A technique for slowing down websites
2. The automated process of visiting web pages, extracting information, and following links
3. A method for creating web animations
4. A security protocol for protecting data
</div>

??? question "Show Answer"
    The correct answer is **B**. Web crawling is the automated process of visiting web pages, extracting information, and following links to discover more pages. A basic crawler performs three operations in a loop: fetch (request a URL), parse (extract useful information), and discover (find new URLs to visit).

    **Concept Tested:** Web Crawling

---

#### 3. What is the GitHub API used for in MicroSim data gathering?

<div class="upper-alpha" markdown>
1. To create new GitHub accounts
2. To programmatically access repository contents and discover MicroSim metadata
3. To host video content
4. To send emails to repository owners
</div>

??? question "Show Answer"
    The correct answer is **B**. The GitHub API provides structured endpoints that return data in predictable formats, enabling programmatic access to repository contents. It's the primary source for MicroSim data gathering, allowing pipelines to discover repositories, list files, and extract metadata.json files automatically.

    **Concept Tested:** GitHub API

---

#### 4. What is repository mining?

<div class="upper-alpha" markdown>
1. Deleting old repositories
2. Extracting and analyzing data from code repositories to gather metadata
3. Creating backup copies of code
4. Converting repositories to databases
</div>

??? question "Show Answer"
    The correct answer is **B**. Repository mining is the process of extracting and analyzing data from code repositories to gather metadata. For MicroSims, this means discovering metadata.json files within repository structures, extracting their contents, and validating against the schema.

    **Concept Tested:** Repository Mining

---

#### 5. What principle should data gathering pipelines follow regarding rate limits?

<div class="upper-alpha" markdown>
1. Ignore rate limits to gather data faster
2. Honor rate limits and wait between API calls to respect source systems
3. Use random timing to avoid detection
4. Only run pipelines during business hours
</div>

??? question "Show Answer"
    The correct answer is **B**. Data gathering pipelines should honor rate limits and terms of service by waiting between API calls. This "respect" principle ensures the pipeline doesn't overwhelm source systems, maintains good relationships with data providers, and avoids being blocked from access.

    **Concept Tested:** Data Gathering

---

#### 6. What is data aggregation in the context of MicroSim search?

<div class="upper-alpha" markdown>
1. Deleting duplicate files
2. Collecting and combining data from multiple sources into a unified dataset
3. Compressing files for storage
4. Splitting large files into smaller pieces
</div>

??? question "Show Answer"
    The correct answer is **B**. Data aggregation is the process of collecting and combining data from multiple sources into a unified dataset. For MicroSim search, this means gathering metadata from dozens of different GitHub repositories and combining them into a single searchable collection.

    **Concept Tested:** Data Aggregation

---

#### 7. Why is automation important for MicroSim data gathering?

<div class="upper-alpha" markdown>
1. It makes the process more expensive
2. It minimizes manual intervention and keeps collections current as new content is published
3. It requires more storage space
4. It slows down the search system
</div>

??? question "Show Answer"
    The correct answer is **B**. Automation minimizes manual intervention and keeps collections current. Manually copying metadata from 500+ MicroSims across 40+ repositories would take days, and by the time you finished, new simulations would already be published. Automated pipelines handle this continuously.

    **Concept Tested:** Data Gathering

---

#### 8. What is the purpose of incremental updates in data pipelines?

<div class="upper-alpha" markdown>
1. To use more bandwidth
2. To only process changes since the last run rather than rebuilding everything
3. To make data gathering slower
4. To create more duplicate entries
</div>

??? question "Show Answer"
    The correct answer is **B**. Incremental updates process only changes since the last run rather than rebuilding the entire collection from scratch. This "freshness" principle keeps data current efficiently—checking for new or modified MicroSims without re-processing unchanged ones.

    **Concept Tested:** Data Gathering

---

#### 9. What types of data sources might a MicroSim pipeline need to handle?

<div class="upper-alpha" markdown>
1. Only GitHub repositories
2. APIs, web pages, file systems, and databases
3. Only video streaming services
4. Only social media platforms
</div>

??? question "Show Answer"
    The correct answer is **B**. Different sources require different gathering techniques. MicroSim pipelines may need to handle APIs (like GitHub API), web pages (HTML that must be parsed), file systems (direct access to files), and databases (structured data stores). GitHub's API is the primary source, but flexibility is important.

    **Concept Tested:** Data Gathering

---

#### 10. What should a pipeline do when it encounters errors during data gathering?

<div class="upper-alpha" markdown>
1. Stop immediately and delete all data
2. Handle errors gracefully by retrying failed requests and logging issues
3. Ignore errors and continue without any record
4. Send an alert to the user for every error
</div>

??? question "Show Answer"
    The correct answer is **B**. Pipelines should handle errors gracefully through the "reliability" principle: retry failed requests (network issues are often temporary), log issues for later review, and continue processing other sources. This ensures one failed repository doesn't prevent gathering data from dozens of others.

    **Concept Tested:** Data Gathering
