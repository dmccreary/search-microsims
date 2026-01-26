# Quiz: Dublin Core Elements

Test your understanding of the 15 Dublin Core metadata elements with these questions.

---

#### 1. What makes a good MicroSim title according to Dublin Core best practices?

<div class="upper-alpha" markdown>
1. Using technical jargon that only experts understand
2. Being descriptive, specific, searchable, and concise (3-7 words)
3. Including the creator's full name
4. Using as many words as possible for completeness
</div>

??? question "Show Answer"
    The correct answer is **B**. A good MicroSim title should be descriptive (tell users what it does), specific (include the key concept), searchable (use terms people search for), concise (3-7 words), and unique (distinguish from similar resources). "Projectile Motion Trajectory Simulator" is better than "Physics Thing" or "Simulation 1."

    **Concept Tested:** Title Element

---

#### 2. What is the purpose of the Subject element in Dublin Core?

<div class="upper-alpha" markdown>
1. To list the names of all contributors
2. To describe what the resource is about using topics and keywords
3. To specify the file format
4. To record the creation date
</div>

??? question "Show Answer"
    The correct answer is **B**. The Subject element describes what your MicroSim is about—the topics, themes, and keywords that define its content. Good subjects work at multiple levels: broad discipline (Physics), specific topic (Electromagnetic waves), cross-cutting concepts (Energy, Patterns), and educational context (AP Physics, NGSS).

    **Concept Tested:** Subject Element

---

#### 3. Which Dublin Core element would you use to specify that a MicroSim is licensed under Creative Commons?

<div class="upper-alpha" markdown>
1. Publisher
2. Format
3. Rights
4. Contributor
</div>

??? question "Show Answer"
    The correct answer is **C**. The Rights element specifies intellectual property and usage permissions for a resource. Values like "CC BY-NC-SA 4.0" (Creative Commons Attribution-NonCommercial-ShareAlike) tell users how they can legally use, share, and modify the MicroSim.

    **Concept Tested:** Rights Element

---

#### 4. What is the difference between Creator and Contributor elements?

<div class="upper-alpha" markdown>
1. Creator is for individuals; Contributor is for organizations
2. Creator is the primary responsible party; Contributor is for others who helped
3. Creator is required; Contributor is forbidden
4. Creator is for copyright; Contributor is for licensing
</div>

??? question "Show Answer"
    The correct answer is **B**. The Creator element identifies the primary person or organization responsible for creating the resource (e.g., "Dr. Maria Santos"). The Contributor element identifies others who helped but aren't the primary creator (e.g., "Reviewed by Physics Department" or "Funded by NSF Grant #12345").

    **Concept Tested:** Creator Element, Contributor Element

---

#### 5. What format should dates follow in Dublin Core metadata?

<div class="upper-alpha" markdown>
1. Any format the creator prefers
2. Month/Day/Year (American format)
3. ISO 8601 format (YYYY-MM-DD)
4. Day Month Year (European format)
</div>

??? question "Show Answer"
    The correct answer is **C**. Dublin Core recommends the ISO 8601 date format: YYYY-MM-DD (e.g., "2026-01-15"). This international standard is unambiguous, sortable, and universally parseable by software. It prevents confusion between formats like 01/02/2026 which could mean January 2nd or February 1st.

    **Concept Tested:** Date Element

---

#### 6. Which Dublin Core element specifies that a MicroSim is part of a series?

<div class="upper-alpha" markdown>
1. Coverage
2. Relation
3. Source
4. Publisher
</div>

??? question "Show Answer"
    The correct answer is **B**. The Relation element describes relationships to other resources. Values like "Part of Physics Simulation Series" or "isPartOf: STEM Collection" indicate how a MicroSim connects to other resources. It's useful for organizing related simulations and helping users discover similar content.

    **Concept Tested:** Relation Element

---

#### 7. What is the purpose of the Identifier element?

<div class="upper-alpha" markdown>
1. To describe the topic of the resource
2. To provide a unique string that unambiguously identifies the resource
3. To list the programming languages used
4. To record user ratings
</div>

??? question "Show Answer"
    The correct answer is **B**. The Identifier element provides a unique string that unambiguously identifies the resource. Common identifier types include URLs (https://example.com/sims/pendulum), DOIs (10.1234/microsim.2026.001), or internal IDs. A good identifier is globally unique, persistent, and resolvable.

    **Concept Tested:** Identifier Element

---

#### 8. What does the Format element specify?

<div class="upper-alpha" markdown>
1. The visual design style of the simulation
2. The file format or MIME type of the resource
3. The difficulty level for students
4. The recommended browser settings
</div>

??? question "Show Answer"
    The correct answer is **B**. The Format element specifies the file format, physical medium, or MIME type of a resource. For MicroSims, this is typically "text/html" (for the main.html file), though you might also specify "application/json" for data files or "image/png" for screenshots.

    **Concept Tested:** Format Element

---

#### 9. Into which three categories do Dublin Core elements fall?

<div class="upper-alpha" markdown>
1. Required, Optional, and Recommended
2. Simple, Complex, and Advanced
3. Content, Intellectual Property, and Instantiation
4. Educational, Technical, and Administrative
</div>

??? question "Show Answer"
    The correct answer is **C**. The 15 Dublin Core elements fall into three natural categories: Content (Title, Subject, Description, Type, Source, Relation, Coverage) describes what the resource is about; Intellectual Property (Creator, Publisher, Contributor, Rights) describes who made it and how it can be used; Instantiation (Date, Format, Identifier, Language) describes how it exists in the world.

    **Concept Tested:** Dublin Core Elements

---

#### 10. When would you use the Source element in MicroSim metadata?

<div class="upper-alpha" markdown>
1. To list all the JavaScript libraries used
2. To reference the resource from which your MicroSim was derived or adapted
3. To specify the server hosting the file
4. To record the programming language
</div>

??? question "Show Answer"
    The correct answer is **B**. The Source element references a resource from which the current resource was derived. For example, "Adapted from PhET Pendulum Simulation" or "Based on algorithm from Smith et al. (2020)." This provides attribution, establishes lineage, and helps users find related resources.

    **Concept Tested:** Source Element
