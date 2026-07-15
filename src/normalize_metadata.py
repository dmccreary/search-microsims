"""
Shared metadata normalization for the MicroSim catalog pipeline.

The official schema (src/microsim-schema/microsim-schema.json) nests fields
under dublinCore/educational/technical/pedagogical/search/userInterface, but
the crawler output (docs/search/microsims-data.json) and everything
downstream (embeddings, similarity, duplicate detection) reads flat
top-level fields (title, learningObjectives, subjects, framework, ...).

The client-side search UI (docs/search/script.js normalizeData()) already
bridges this gap in JavaScript. normalize_metadata() mirrors those same
field mappings on the Python side so nested-schema records don't fall
through the pipeline as "untitled".
"""

# Fields the pipeline treats as scalars (strings). Lists found at a nested
# path are joined into a readable string rather than kept as a list, since
# downstream code inserts these directly into f-strings.
#
# Besides the documented dublinCore/educational/technical nesting, some
# repos use other Dublin Core spellings seen in the wild: "dublin_core"
# (snake_case), and dotted Dublin Core Metadata Element Set keys like
# "dc.title"/"DC.title". "name" is a last-resort title fallback used by a
# handful of older flat metadata.json files that never adopted "title".
SCALAR_FIELD_PATHS = {
    "title": [
        "title", "dublinCore.title", "dublin_core.title",
        "dc.title", "DC.title", "name",
    ],
    "description": [
        "description", "dublinCore.description", "dublin_core.description",
        "dc.description", "DC.description",
    ],
    "creator": [
        "creator", "author", "dublinCore.creator", "dublin_core.creator",
        "dc.creator", "DC.creator",
    ],
    "date": [
        "date", "dublinCore.date", "dublin_core.date", "dc.date", "DC.date",
    ],
    "url": [
        "url", "identifier", "dublinCore.identifier", "dublin_core.identifier",
        "dc.identifier", "DC.identifier",
    ],
    "topic": ["topic", "educational.topic"],
    "gradeLevel": ["gradeLevel", "educational.gradeLevel", "educational.grade_level"],
    "framework": [
        "framework", "library", "implementation", "chart_library",
        "technical.framework",
    ],
    "subject": [
        "subject", "subjects", "educational.subjectArea", "educational.subject_area",
        "dublinCore.subject", "dublin_core.subject", "dc.subject", "DC.subject",
    ],
}

# Fields the pipeline treats as lists.
LIST_FIELD_PATHS = {
    "subjects": [
        "subjects", "subject", "educational.subjectArea", "educational.subject_area",
        "dublinCore.subject", "dublin_core.subject", "dc.subject", "DC.subject",
    ],
    "learningObjectives": [
        "learningObjectives", "learningObjective", "learning_objective",
        "educational.learningObjectives", "educational.learning_objectives",
    ],
    "prerequisites": [
        "prerequisites", "educational.prerequisites", "educational.prerequisites",
    ],
    "keywords": ["keywords", "search.keywords"],
    "bloomsTaxonomy": [
        "bloomsTaxonomy",
        "pedagogical.bloomsTaxonomy",
        "pedagogical.bloomAlignment",
        "educational.bloomsTaxonomy",
        "educational.blooms_taxonomy",
    ],
    "visualizationType": ["visualizationType", "search.visualizationType"],
}

# Numeric Bloom's level (1-6), seen in a few repos as "bloom_level": 4
# instead of a named "bloomsTaxonomy" list.
_BLOOM_LEVEL_NAMES = {
    1: "Remember", 2: "Understand", 3: "Apply",
    4: "Analyze", 5: "Evaluate", 6: "Create",
}


def _get_nested(raw: dict, dotted_path: str):
    """Resolve a dotted path like 'educational.subjectArea' against raw."""
    value = raw
    for part in dotted_path.split("."):
        if not isinstance(value, dict):
            return None
        value = value.get(part)
        if value is None:
            return None
    return value


def _first_present(raw: dict, paths: list[str]):
    """Return the first non-empty value found across candidate paths.

    Each path is tried first as a literal flat key (some repos use dotted
    Dublin Core keys like "dc.title" as one literal key, not a nested
    path), then - if it contains a "." - as a nested lookup.
    """
    for path in paths:
        value = raw.get(path)
        if value in (None, "", [], {}) and "." in path:
            value = _get_nested(raw, path)
        if value not in (None, "", [], {}):
            return value
    return None


def _as_scalar(value):
    if isinstance(value, list):
        if not value:
            return None
        return ", ".join(str(v) for v in value)
    return value


def _as_list(value):
    if value is None:
        return None
    if isinstance(value, list):
        return value if value else None
    return [value]


def normalize_metadata(raw: dict) -> dict:
    """
    Flatten a MicroSim metadata.json (which may use the nested schema, the
    flat legacy schema, a top-level "microsim" wrapper, or a mix of these)
    into the flat shape the rest of the pipeline expects.

    Existing flat fields are never overwritten - a nested value only fills
    in a flat field that is missing or empty.
    """
    # The official schema requires a top-level "microsim" wrapper around
    # dublinCore/educational/technical/... - unwrap it so dotted lookups
    # like "educational.subjectArea" can find those sections, mirroring
    # docs/search/script.js's "microsim.educational.subjectArea" paths.
    wrapped = raw.get("microsim")
    lookup_source = raw
    if isinstance(wrapped, dict):
        lookup_source = {**wrapped, **{k: v for k, v in raw.items() if k != "microsim"}}

    normalized = dict(raw)

    for flat_key, paths in SCALAR_FIELD_PATHS.items():
        if normalized.get(flat_key):
            continue
        value = _as_scalar(_first_present(lookup_source, paths))
        if value:
            normalized[flat_key] = value

    for flat_key, paths in LIST_FIELD_PATHS.items():
        if normalized.get(flat_key):
            continue
        value = _as_list(_first_present(lookup_source, paths))
        if value:
            normalized[flat_key] = value

    # A few repos record Bloom's level as a bare number (e.g. "bloom_level": 4)
    # instead of a named bloomsTaxonomy list.
    if not normalized.get("bloomsTaxonomy"):
        bloom_level = _first_present(lookup_source, ["bloom_level", "bloomLevelNumber"])
        if isinstance(bloom_level, (int, float)) and int(bloom_level) in _BLOOM_LEVEL_NAMES:
            normalized["bloomsTaxonomy"] = [_BLOOM_LEVEL_NAMES[int(bloom_level)]]

    return normalized
