# Quiz: JSON and Data Structures

Test your understanding of JSON syntax, schemas, and validation with these questions.

---

#### 1. What does JSON stand for?

<div class="upper-alpha" markdown>
1. Java System Object Notation
2. JavaScript Object Notation
3. Joint Standard Online Network
4. JSON Schema Object Name
</div>

??? question "Show Answer"
    The correct answer is **B**. JSON stands for JavaScript Object Notation. Despite "JavaScript" in its name, JSON is language-independent—Python, Java, Ruby, and virtually every programming language can read and write it. It has become the universal format for data exchange on the web.

    **Concept Tested:** JSON

---

#### 2. How many data types does JSON support?

<div class="upper-alpha" markdown>
1. Three (string, number, boolean)
2. Six (string, number, boolean, null, object, array)
3. Ten (including date, function, and undefined)
4. Unlimited (any JavaScript type)
</div>

??? question "Show Answer"
    The correct answer is **B**. JSON supports exactly six data types: String (text in double quotes), Number (integer or decimal), Boolean (true/false), Null (empty value), Object (collection of key-value pairs), and Array (ordered list of values). Everything in JSON is built from these primitives.

    **Concept Tested:** JSON Syntax

---

#### 3. Which of the following is valid JSON syntax?

<div class="upper-alpha" markdown>
1. `{'name': 'value'}`
2. `{"name": "value",}`
3. `{"name": "value"}`
4. `{name: "value"}`
</div>

??? question "Show Answer"
    The correct answer is **C**. Valid JSON requires: double quotes for strings (not single quotes), quoted keys (not unquoted), and no trailing commas. Option A uses single quotes, option B has a trailing comma, and option D has an unquoted key. Only `{"name": "value"}` follows all JSON syntax rules.

    **Concept Tested:** JSON Syntax

---

#### 4. What is a JSON object?

<div class="upper-alpha" markdown>
1. An ordered list of values
2. A single text value
3. A collection of key-value pairs enclosed in curly braces
4. A binary file format
</div>

??? question "Show Answer"
    The correct answer is **C**. A JSON object is a collection of key-value pairs enclosed in curly braces {}. Keys are always strings (in double quotes), and values can be any of the six JSON data types. Objects enable structured, hierarchical data representation like `{"title": "Pendulum Sim", "version": 1.0}`.

    **Concept Tested:** JSON Objects

---

#### 5. What is the purpose of a JSON Schema?

<div class="upper-alpha" markdown>
1. To compress JSON files for faster loading
2. To define structure rules and validate JSON documents against them
3. To convert JSON to XML format
4. To encrypt sensitive data
</div>

??? question "Show Answer"
    The correct answer is **B**. A JSON Schema defines the structure and rules for valid JSON documents. It specifies which fields are required, what data types are acceptable, valid value ranges, and relationships between fields. Schema validation ensures metadata follows these rules before being accepted into a system.

    **Concept Tested:** JSON Schema

---

#### 6. What is the difference between required and optional fields in a metadata schema?

<div class="upper-alpha" markdown>
1. Required fields are longer; optional fields are shorter
2. Required fields must be populated for validity; optional fields add richness when relevant
3. Required fields are for experts; optional fields are for beginners
4. Required fields are public; optional fields are private
</div>

??? question "Show Answer"
    The correct answer is **B**. Required fields must be populated for a MicroSim to be considered minimally complete—typically title, description, and subject area. Optional fields enhance discoverability but aren't essential for basic functionality—examples include contributor, source, and detailed technical specifications.

    **Concept Tested:** Required Fields, Optional Fields

---

#### 7. What does a completeness score measure?

<div class="upper-alpha" markdown>
1. How long the simulation runs
2. What percentage of recommended metadata fields have been filled in
3. How many users have viewed the MicroSim
4. The file size of the JSON document
</div>

??? question "Show Answer"
    The correct answer is **B**. A completeness score indicates what percentage of recommended metadata fields have been populated. A MicroSim with title, description, subject, creator, date, and learning objectives filled in has higher completeness than one with only title and description. Higher completeness improves searchability.

    **Concept Tested:** Completeness Score

---

#### 8. Which statement about JSON arrays is correct?

<div class="upper-alpha" markdown>
1. Arrays can only contain strings
2. Arrays use curly braces {} as delimiters
3. Arrays are ordered lists that can contain mixed data types
4. Arrays cannot be nested inside objects
</div>

??? question "Show Answer"
    The correct answer is **C**. JSON arrays are ordered lists enclosed in square brackets [] that can contain any mixture of JSON data types, including other arrays and objects. For example: `["Physics", "Mathematics"]` or `[1, "text", true, null, {"nested": "object"}]`.

    **Concept Tested:** JSON Arrays

---

#### 9. What happens when you validate JSON against a schema and it fails?

<div class="upper-alpha" markdown>
1. The JSON file is automatically deleted
2. Validation errors are reported indicating which rules were violated
3. The schema is automatically updated to match the JSON
4. The system crashes and requires restart
</div>

??? question "Show Answer"
    The correct answer is **B**. When JSON fails schema validation, the validator reports specific errors indicating which rules were violated—such as missing required fields, wrong data types, or invalid values. This feedback helps creators fix issues before the metadata causes search problems.

    **Concept Tested:** Schema Validation

---

#### 10. What is a quality score in the context of MicroSim metadata?

<div class="upper-alpha" markdown>
1. A rating of how fun the simulation is
2. A composite metric evaluating overall metadata quality based on multiple factors
3. The number of downloads divided by the number of views
4. The speed at which the simulation loads
</div>

??? question "Show Answer"
    The correct answer is **B**. A quality score is a composite metric evaluating overall MicroSim metadata quality based on factors like completeness, schema compliance, description quality, keyword coverage, and proper categorization. Higher quality scores indicate metadata that will perform better in search and discovery.

    **Concept Tested:** Quality Score
