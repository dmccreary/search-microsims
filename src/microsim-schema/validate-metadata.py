#!/usr/bin/env python3
"""
MicroSim Metadata Validator

Validates metadata.json files against the official MicroSim JSON Schema.

Usage:
    python src/microsim-schema/validate-metadata.py <metadata.json>
    python src/microsim-schema/validate-metadata.py path/to/metadata.json
    python src/microsim-schema/validate-metadata.py --all  # Validate all in microsims-data.json

Requirements:
    pip install jsonschema

Examples:
    # Validate a single file
    python src/microsim-schema/validate-metadata.py ~/repos/geometry-course/docs/sims/angle-types/metadata.json

    # Validate all collected metadata
    python src/microsim-schema/validate-metadata.py --all
"""

import json
import sys
from pathlib import Path
from typing import Any

try:
    from jsonschema import Draft7Validator, ValidationError
    from jsonschema.exceptions import SchemaError
except ImportError:
    print("Error: jsonschema package required. Install with: pip install jsonschema")
    sys.exit(1)


# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
SCHEMA_FILE = SCRIPT_DIR / "microsim-schema.json"
DATA_FILE = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"


def load_schema() -> dict:
    """Load the MicroSim JSON schema."""
    if not SCHEMA_FILE.exists():
        print(f"Error: Schema file not found: {SCHEMA_FILE}")
        sys.exit(1)

    with open(SCHEMA_FILE) as f:
        return json.load(f)


def load_metadata(path: Path) -> dict:
    """Load a metadata.json file."""
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    with open(path) as f:
        return json.load(f)


def is_nested_format(data: dict) -> bool:
    """Check if metadata uses nested schema format (has 'microsim' wrapper)."""
    return "microsim" in data


def wrap_flat_metadata(data: dict) -> dict:
    """
    Convert flat/legacy metadata format to nested schema format for validation.
    Maps common flat fields to their nested schema locations.
    """
    # If already in nested format, return as-is
    if is_nested_format(data):
        return data

    # Build nested structure from flat fields
    nested = {
        "microsim": {
            "dublinCore": {},
            "search": {},
            "educational": {},
            "technical": {},
            "userInterface": {"controls": []},
        }
    }

    # Dublin Core mappings
    dc_mappings = {
        "title": "title",
        "author": "creator",
        "creator": "creator",
        "description": "description",
        "license": "rights",
        "dateCreated": "date",
        "dateModified": "date",
        "type": "type",
        "format": "format",
        "language": "language",
        "identifier": "identifier",
        "url": "identifier",
    }

    for flat_key, nested_key in dc_mappings.items():
        if flat_key in data:
            value = data[flat_key]
            # Creator should be an array
            if nested_key == "creator" and isinstance(value, str):
                value = [value]
            # Subject should be an array
            if nested_key == "subject" and isinstance(value, str):
                value = [value]
            nested["microsim"]["dublinCore"][nested_key] = value

    # Handle subject specially (can come from multiple sources)
    subjects = []
    if "subject" in data:
        if isinstance(data["subject"], list):
            subjects.extend(data["subject"])
        else:
            subjects.append(data["subject"])
    if "subjects" in data:
        if isinstance(data["subjects"], list):
            subjects.extend(data["subjects"])
        else:
            subjects.append(data["subjects"])
    if subjects:
        nested["microsim"]["dublinCore"]["subject"] = list(set(subjects))

    # Search mappings
    search_mappings = {
        "tags": "tags",
        "visualizationType": "visualizationType",
        "interactionLevel": "interactionLevel",
        "complexity": "complexity",
    }

    for flat_key, nested_key in search_mappings.items():
        if flat_key in data:
            value = data[flat_key]
            # Ensure arrays where needed
            if nested_key in ["tags", "visualizationType"] and isinstance(value, str):
                value = [value]
            nested["microsim"]["search"][nested_key] = value

    # Educational mappings
    edu_mappings = {
        "gradeLevel": "gradeLevel",
        "bloomsTaxonomy": "bloomsTaxonomy",
        "bloomLevel": "bloomsTaxonomy",
        "learningObjectives": "learningObjectives",
        "prerequisites": "prerequisites",
        "difficulty": "difficulty",
        "topic": "topic",
    }

    for flat_key, nested_key in edu_mappings.items():
        if flat_key in data:
            value = data[flat_key]
            # Ensure arrays where needed
            if nested_key in ["gradeLevel", "bloomsTaxonomy", "learningObjectives", "prerequisites", "topic"]:
                if isinstance(value, str):
                    value = [value]
            nested["microsim"]["educational"][nested_key] = value

    # Handle subjectArea from subject
    if "subject" in data:
        value = data["subject"]
        if isinstance(value, str):
            value = [value]
        nested["microsim"]["educational"]["subjectArea"] = value

    # Technical mappings
    tech_mappings = {
        "framework": "framework",
        "library": "framework",
        "version": "version",
    }

    for flat_key, nested_key in tech_mappings.items():
        if flat_key in data:
            nested["microsim"]["technical"][nested_key] = data[flat_key]

    # Canvas dimensions
    if "canvasWidth" in data or "canvasHeight" in data:
        nested["microsim"]["technical"]["canvasDimensions"] = {
            "width": data.get("canvasWidth", 800),
            "height": data.get("canvasHeight", 600),
            "responsive": data.get("responsive", True),
        }

    return nested


def validate_metadata(data: dict, schema: dict, strict: bool = False) -> list[dict]:
    """
    Validate metadata against the schema.

    Args:
        data: The metadata to validate
        schema: The JSON schema
        strict: If True, validate against full nested schema.
                If False, only validate present fields.

    Returns:
        List of validation errors (empty if valid)
    """
    errors = []

    # Create validator
    try:
        validator = Draft7Validator(schema)
    except SchemaError as e:
        return [{"path": "schema", "message": f"Invalid schema: {e.message}"}]

    # Convert flat format to nested for validation
    nested_data = wrap_flat_metadata(data)

    # Validate
    for error in sorted(validator.iter_errors(nested_data), key=lambda e: str(e.path)):
        path = ".".join(str(p) for p in error.absolute_path) or "(root)"
        errors.append({
            "path": path,
            "message": error.message,
            "value": error.instance if not isinstance(error.instance, dict) else "(object)",
        })

    return errors


def validate_required_fields(data: dict) -> list[dict]:
    """
    Check for commonly required fields (lighter validation).
    Returns warnings for missing recommended fields.
    """
    warnings = []

    # Core recommended fields
    recommended = {
        "title": "Title is missing",
        "description": "Description is missing",
    }

    # Check flat format fields
    for field, message in recommended.items():
        if field not in data and not (is_nested_format(data) and
            data.get("microsim", {}).get("dublinCore", {}).get(field)):
            warnings.append({"field": field, "message": message, "severity": "warning"})

    # Educational recommendations
    edu_recommended = ["gradeLevel", "bloomsTaxonomy", "learningObjectives"]
    for field in edu_recommended:
        has_flat = field in data
        has_nested = (is_nested_format(data) and
            field in data.get("microsim", {}).get("educational", {}))
        if not has_flat and not has_nested:
            warnings.append({
                "field": field,
                "message": f"Educational field '{field}' is missing (recommended)",
                "severity": "info"
            })

    return warnings


def check_value_validity(data: dict) -> list[dict]:
    """Check if field values match expected enums."""
    issues = []

    # Valid values from schema
    valid_values = {
        "subject": [
            "Mathematics", "Science", "Physics", "Chemistry", "Biology",
            "Computer Science", "Engineering", "Economics", "Finance", "Statistics",
            "Psychology", "Social Studies", "Language Arts", "Art", "Music",
            "Health", "Physical Education", "Other"
        ],
        "gradeLevel": [
            "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
            "Undergraduate", "Graduate", "Adult"
        ],
        "bloomsTaxonomy": [
            "Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"
        ],
        "framework": [
            "p5.js", "vanilla-js", "d3.js", "three.js", "chart.js",
            "plotly.js", "vis-network", "vis-timeline", "mermaid", "leaflet", "other"
        ],
        "visualizationType": [
            "animation", "chart", "infographic", "graph", "diagram", "simulation",
            "interactive-demo", "data-visualization", "3d-model", "timeline",
            "network", "map", "dashboard"
        ],
        "difficulty": ["Beginner", "Intermediate", "Advanced"],
        "interactionLevel": ["passive", "low", "moderate", "high", "very-high"],
    }

    def check_field(field_name: str, value: Any, valid: list):
        """Check a single field value."""
        if value is None:
            return
        values = value if isinstance(value, list) else [value]
        for v in values:
            if v and v not in valid:
                issues.append({
                    "field": field_name,
                    "value": v,
                    "message": f"Non-standard value '{v}' for {field_name}",
                    "valid_values": valid[:5],  # Show first 5
                    "severity": "warning"
                })

    # Check flat format
    for field, valid in valid_values.items():
        if field in data:
            check_field(field, data[field], valid)

    # Check nested format
    if is_nested_format(data):
        microsim = data.get("microsim", {})

        # Educational fields
        edu = microsim.get("educational", {})
        if "subjectArea" in edu:
            check_field("subjectArea", edu["subjectArea"], valid_values["subject"])
        if "gradeLevel" in edu:
            check_field("gradeLevel", edu["gradeLevel"], valid_values["gradeLevel"])
        if "bloomsTaxonomy" in edu:
            check_field("bloomsTaxonomy", edu["bloomsTaxonomy"], valid_values["bloomsTaxonomy"])
        if "difficulty" in edu:
            check_field("difficulty", edu["difficulty"], valid_values["difficulty"])

        # Technical fields
        tech = microsim.get("technical", {})
        if "framework" in tech:
            check_field("framework", tech["framework"], valid_values["framework"])

        # Search fields
        search = microsim.get("search", {})
        if "visualizationType" in search:
            check_field("visualizationType", search["visualizationType"], valid_values["visualizationType"])
        if "interactionLevel" in search:
            check_field("interactionLevel", search["interactionLevel"], valid_values["interactionLevel"])

    return issues


def print_validation_result(path: str, errors: list, warnings: list, value_issues: list):
    """Print validation results in a readable format."""
    has_issues = errors or warnings or value_issues

    if not has_issues:
        print(f"  {path}: VALID")
        return True

    print(f"\n  {path}:")

    if errors:
        print(f"    ERRORS ({len(errors)}):")
        for err in errors[:10]:  # Limit output
            print(f"      - [{err['path']}] {err['message']}")
        if len(errors) > 10:
            print(f"      ... and {len(errors) - 10} more errors")

    if warnings:
        print(f"    WARNINGS ({len(warnings)}):")
        for warn in warnings:
            print(f"      - {warn['message']}")

    if value_issues:
        print(f"    VALUE ISSUES ({len(value_issues)}):")
        for issue in value_issues[:5]:
            print(f"      - {issue['message']}")
        if len(value_issues) > 5:
            print(f"      ... and {len(value_issues) - 5} more")

    return False


def validate_single_file(path: Path, schema: dict, verbose: bool = True) -> bool:
    """Validate a single metadata file."""
    try:
        data = load_metadata(path)
    except json.JSONDecodeError as e:
        print(f"  {path}: INVALID JSON - {e}")
        return False
    except FileNotFoundError as e:
        print(f"  {path}: NOT FOUND")
        return False

    errors = validate_metadata(data, schema)
    warnings = validate_required_fields(data)
    value_issues = check_value_validity(data)

    if verbose:
        return print_validation_result(str(path), errors, warnings, value_issues)
    else:
        return len(errors) == 0


def validate_all_collected(schema: dict) -> tuple[int, int]:
    """Validate all metadata in the collected microsims-data.json."""
    if not DATA_FILE.exists():
        print(f"Error: Data file not found: {DATA_FILE}")
        return 0, 0

    with open(DATA_FILE) as f:
        all_data = json.load(f)

    print(f"Validating {len(all_data)} MicroSims from {DATA_FILE.name}...")
    print("=" * 60)

    valid_count = 0
    invalid_count = 0

    # Group by severity
    items_with_errors = []
    items_with_warnings = []
    items_valid = []

    for item in all_data:
        source = item.get("_source", {})
        identifier = f"{source.get('repo', 'unknown')}/{source.get('sim', 'unknown')}"

        errors = validate_metadata(item, schema)
        warnings = validate_required_fields(item)
        value_issues = check_value_validity(item)

        if errors:
            invalid_count += 1
            items_with_errors.append((identifier, errors, warnings, value_issues))
        elif warnings or value_issues:
            valid_count += 1
            items_with_warnings.append((identifier, warnings, value_issues))
        else:
            valid_count += 1
            items_valid.append(identifier)

    # Print summary
    print(f"\nSUMMARY")
    print(f"  Valid:   {valid_count}")
    print(f"  Invalid: {invalid_count}")
    print(f"  Total:   {len(all_data)}")

    # Show items with errors (limit to 10)
    if items_with_errors:
        print(f"\nITEMS WITH SCHEMA ERRORS ({len(items_with_errors)}):")
        for identifier, errors, warnings, value_issues in items_with_errors[:10]:
            print_validation_result(identifier, errors, warnings, value_issues)
        if len(items_with_errors) > 10:
            print(f"\n  ... and {len(items_with_errors) - 10} more with errors")

    # Show items with warnings (limit to 5)
    if items_with_warnings:
        print(f"\nITEMS WITH WARNINGS ({len(items_with_warnings)}):")
        for identifier, warnings, value_issues in items_with_warnings[:5]:
            print_validation_result(identifier, [], warnings, value_issues)
        if len(items_with_warnings) > 5:
            print(f"\n  ... and {len(items_with_warnings) - 5} more with warnings")

    return valid_count, invalid_count


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    # Load schema
    schema = load_schema()
    print(f"Loaded schema: {SCHEMA_FILE.name}")

    arg = sys.argv[1]

    if arg == "--all":
        valid, invalid = validate_all_collected(schema)
        sys.exit(0 if invalid == 0 else 1)

    elif arg == "--help" or arg == "-h":
        print(__doc__)
        sys.exit(0)

    else:
        # Validate single file
        path = Path(arg)
        print(f"\nValidating: {path}")
        print("=" * 60)

        success = validate_single_file(path, schema)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
