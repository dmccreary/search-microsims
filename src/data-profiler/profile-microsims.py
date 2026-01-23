#!/usr/bin/env python3
"""
MicroSim Metadata Data Profiler

Analyzes microsims-data.json to generate quality and completeness metrics.
Outputs a markdown report to docs/reports/microsim-metrics.md

Usage:
    python src/data-profiler/profile-microsims.py
"""

import json
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


# Project paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
DATA_FILE = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"
REPORT_FILE = PROJECT_ROOT / "docs" / "reports" / "microsim-metrics.md"

# Key fields to track for completeness
# These are the most important fields for search and educational value
KEY_FIELDS = {
    "core": ["title", "description", "url"],
    "educational": ["subject", "gradeLevel", "bloomsTaxonomy", "learningObjectives"],
    "technical": ["framework", "version"],
    "search": ["visualizationType", "tags"],
    "metadata": ["author", "dateCreated", "license"],
}

# Fields that should have specific valid values
VALID_VALUES = {
    "subject": [
        "Mathematics", "Science", "Physics", "Chemistry", "Biology",
        "Computer Science", "Engineering", "Economics", "Finance", "Statistics",
        "Psychology", "Social Studies", "Language Arts", "Art", "Music",
        "Health", "Physical Education", "Other"
    ],
    "gradeLevel": [
        "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
        "K-5", "6-8", "6-12", "9-12", "K-12",
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
}


def load_data():
    """Load the microsims data file."""
    with open(DATA_FILE) as f:
        return json.load(f)


def get_field_value(item, field):
    """
    Get field value, handling both flat and nested schema formats.
    Returns None if field not found.
    """
    # Direct field access
    if field in item:
        return item[field]

    # Check nested paths
    nested_paths = {
        "subject": ["educational.subjectArea", "dublinCore.subject"],
        "gradeLevel": ["educational.gradeLevel"],
        "bloomsTaxonomy": ["educational.bloomsTaxonomy"],
        "framework": ["technical.framework"],
        "visualizationType": ["search.visualizationType"],
        "tags": ["search.tags"],
        "difficulty": ["educational.difficulty"],
        "author": ["dublinCore.creator"],
        "title": ["dublinCore.title"],
        "description": ["dublinCore.description"],
    }

    for path in nested_paths.get(field, []):
        parts = path.split(".")
        value = item
        for part in parts:
            if isinstance(value, dict) and part in value:
                value = value[part]
            else:
                value = None
                break
        if value is not None:
            return value

    return None


def normalize_list(value):
    """Ensure value is a list."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def calculate_field_completeness(data):
    """Calculate completeness percentage for each field."""
    total = len(data)
    completeness = {}

    for category, fields in KEY_FIELDS.items():
        completeness[category] = {}
        for field in fields:
            count = sum(1 for item in data if get_field_value(item, field))
            completeness[category][field] = {
                "count": count,
                "total": total,
                "percentage": round(100 * count / total, 1) if total > 0 else 0
            }

    return completeness


def calculate_value_distributions(data):
    """Calculate distribution of values for categorical fields."""
    distributions = {}

    for field in VALID_VALUES.keys():
        counter = Counter()
        invalid_values = Counter()

        for item in data:
            values = normalize_list(get_field_value(item, field))
            for value in values:
                if value:
                    # Check if value is valid
                    valid = VALID_VALUES.get(field, [])
                    if not valid or value in valid:
                        counter[value] += 1
                    else:
                        invalid_values[value] += 1

        distributions[field] = {
            "values": counter.most_common(),
            "invalid": invalid_values.most_common(10),
            "unique_count": len(counter),
        }

    return distributions


def analyze_by_repository(data):
    """Analyze metrics grouped by source repository."""
    repos = defaultdict(lambda: {
        "count": 0,
        "completeness_scores": [],
        "items": []
    })

    for item in data:
        source = item.get("_source", {})
        repo = source.get("repo", "unknown")
        repos[repo]["count"] += 1
        repos[repo]["items"].append(item)

        # Calculate completeness score for this item
        score = calculate_item_quality_score(item)
        repos[repo]["completeness_scores"].append(score)

    # Calculate average scores per repo
    for repo_name, repo_data in repos.items():
        scores = repo_data["completeness_scores"]
        repo_data["avg_score"] = round(sum(scores) / len(scores), 1) if scores else 0
        repo_data["min_score"] = min(scores) if scores else 0
        repo_data["max_score"] = max(scores) if scores else 0

    return dict(repos)


def calculate_item_quality_score(item):
    """
    Calculate a quality score (0-100) for a single item.
    Based on presence and quality of key fields.
    """
    score = 0
    max_score = 0

    # Core fields (40 points)
    core_weights = {"title": 15, "description": 15, "url": 10}
    for field, weight in core_weights.items():
        max_score += weight
        value = get_field_value(item, field)
        if value:
            if field == "description" and len(str(value)) > 50:
                score += weight  # Full points for substantial description
            elif field == "description":
                score += weight * 0.5  # Half points for short description
            else:
                score += weight

    # Educational fields (35 points)
    edu_weights = {"subject": 10, "gradeLevel": 10, "bloomsTaxonomy": 10, "learningObjectives": 5}
    for field, weight in edu_weights.items():
        max_score += weight
        value = get_field_value(item, field)
        if value:
            score += weight

    # Technical fields (15 points)
    tech_weights = {"framework": 10, "version": 5}
    for field, weight in tech_weights.items():
        max_score += weight
        value = get_field_value(item, field)
        if value:
            score += weight

    # Metadata fields (10 points)
    meta_weights = {"author": 5, "license": 5}
    for field, weight in meta_weights.items():
        max_score += weight
        value = get_field_value(item, field)
        if value:
            score += weight

    return round(100 * score / max_score) if max_score > 0 else 0


def calculate_overall_quality_distribution(data):
    """Calculate distribution of quality scores across all items."""
    scores = [calculate_item_quality_score(item) for item in data]

    # Bucket into ranges
    ranges = {
        "Excellent (90-100)": 0,
        "Good (70-89)": 0,
        "Fair (50-69)": 0,
        "Poor (30-49)": 0,
        "Minimal (0-29)": 0,
    }

    for score in scores:
        if score >= 90:
            ranges["Excellent (90-100)"] += 1
        elif score >= 70:
            ranges["Good (70-89)"] += 1
        elif score >= 50:
            ranges["Fair (50-69)"] += 1
        elif score >= 30:
            ranges["Poor (30-49)"] += 1
        else:
            ranges["Minimal (0-29)"] += 1

    return {
        "distribution": ranges,
        "average": round(sum(scores) / len(scores), 1) if scores else 0,
        "median": sorted(scores)[len(scores) // 2] if scores else 0,
        "min": min(scores) if scores else 0,
        "max": max(scores) if scores else 0,
    }


def find_items_needing_improvement(data, threshold=50):
    """Find items with quality scores below threshold."""
    items = []
    for item in data:
        score = calculate_item_quality_score(item)
        if score < threshold:
            source = item.get("_source", {})
            items.append({
                "title": get_field_value(item, "title") or "Untitled",
                "repo": source.get("repo", "unknown"),
                "sim": source.get("sim", "unknown"),
                "score": score,
                "missing": get_missing_fields(item),
            })

    return sorted(items, key=lambda x: x["score"])


def get_missing_fields(item):
    """Get list of missing key fields for an item."""
    missing = []
    for category, fields in KEY_FIELDS.items():
        for field in fields:
            if not get_field_value(item, field):
                missing.append(field)
    return missing


def generate_markdown_report(data, completeness, distributions, repos, quality):
    """Generate the markdown report."""

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    total_items = len(data)

    lines = [
        "# MicroSim Metadata Quality Report",
        "",
        f"*Generated: {timestamp}*",
        "",
        "## Executive Summary",
        "",
        f"- **Total MicroSims**: {total_items:,}",
        f"- **Average Quality Score**: {quality['average']}%",
        f"- **Median Quality Score**: {quality['median']}%",
        f"- **Repositories**: {len(repos)}",
        "",
        "## Quality Score Distribution",
        "",
        "| Quality Level | Count | Percentage |",
        "|--------------|------:|------------|",
    ]

    for level, count in quality["distribution"].items():
        pct = round(100 * count / total_items, 1) if total_items > 0 else 0
        lines.append(f"| {level} | {count:,} | {pct}% |")

    lines.extend([
        "",
        "## Field Completeness",
        "",
    ])

    for category, fields in completeness.items():
        lines.append(f"### {category.title()} Fields")
        lines.append("")
        lines.append("| Field | Present | Percentage |")
        lines.append("|-------|--------:|------------|")

        for field, stats in fields.items():
            lines.append(f"| {field} | {stats['count']:,} / {stats['total']:,} | {stats['percentage']}% |")

        lines.append("")

    lines.extend([
        "## Value Distributions",
        "",
    ])

    for field, dist in distributions.items():
        if dist["values"]:
            lines.append(f"### {field}")
            lines.append("")
            lines.append("| Value | Count |")
            lines.append("|-------|------:|")

            for value, count in dist["values"][:15]:  # Top 15
                lines.append(f"| {value} | {count:,} |")

            if len(dist["values"]) > 15:
                lines.append(f"| *... and {len(dist['values']) - 15} more* | |")

            if dist["invalid"]:
                lines.append("")
                lines.append("**Non-standard values found:**")
                for value, count in dist["invalid"][:5]:
                    lines.append(f"- `{value}` ({count})")

            lines.append("")

    lines.extend([
        "## Repository Breakdown",
        "",
        "| Repository | Count | Avg Score | Min | Max |",
        "|------------|------:|----------:|----:|----:|",
    ])

    sorted_repos = sorted(repos.items(), key=lambda x: x[1]["count"], reverse=True)
    for repo_name, repo_data in sorted_repos:
        lines.append(
            f"| {repo_name} | {repo_data['count']:,} | {repo_data['avg_score']}% | "
            f"{repo_data['min_score']}% | {repo_data['max_score']}% |"
        )

    # Items needing improvement
    low_quality = find_items_needing_improvement(data, threshold=50)

    if low_quality:
        lines.extend([
            "",
            "## Items Needing Improvement",
            "",
            f"Found {len(low_quality)} items with quality score below 50%.",
            "",
            "### Lowest Quality Items",
            "",
            "| Score | Repository | Simulation | Missing Fields |",
            "|------:|------------|------------|----------------|",
        ])

        for item in low_quality[:20]:  # Top 20 worst
            missing_str = ", ".join(item["missing"][:4])
            if len(item["missing"]) > 4:
                missing_str += f" (+{len(item['missing']) - 4} more)"
            lines.append(f"| {item['score']}% | {item['repo']} | {item['sim']} | {missing_str} |")

    lines.extend([
        "",
        "## Recommendations",
        "",
        "Based on this analysis:",
        "",
    ])

    # Generate recommendations based on data
    recommendations = []

    # Check for low completeness fields
    for category, fields in completeness.items():
        for field, stats in fields.items():
            if stats["percentage"] < 50:
                recommendations.append(
                    f"- **Add `{field}`**: Only {stats['percentage']}% of items have this field"
                )

    # Check for repos with low average scores
    for repo_name, repo_data in sorted_repos:
        if repo_data["avg_score"] < 50 and repo_data["count"] >= 5:
            recommendations.append(
                f"- **Improve `{repo_name}`**: Average quality score is only {repo_data['avg_score']}%"
            )

    if not recommendations:
        recommendations.append("- Data quality is generally good. Continue monitoring for consistency.")

    lines.extend(recommendations[:10])  # Top 10 recommendations

    lines.extend([
        "",
        "---",
        "",
        "*This report was generated by `src/data-profiler/profile-microsims.py`*",
    ])

    return "\n".join(lines)


def main():
    print("MicroSim Metadata Profiler")
    print("=" * 50)

    # Load data
    print(f"Loading data from {DATA_FILE}...")
    data = load_data()
    print(f"Loaded {len(data):,} MicroSims")

    # Calculate metrics
    print("Calculating field completeness...")
    completeness = calculate_field_completeness(data)

    print("Analyzing value distributions...")
    distributions = calculate_value_distributions(data)

    print("Analyzing by repository...")
    repos = analyze_by_repository(data)

    print("Calculating quality scores...")
    quality = calculate_overall_quality_distribution(data)

    # Generate report
    print("Generating markdown report...")
    report = generate_markdown_report(data, completeness, distributions, repos, quality)

    # Write report
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_FILE, "w") as f:
        f.write(report)

    print(f"\nReport written to: {REPORT_FILE}")

    # Print summary
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Total MicroSims:      {len(data):,}")
    print(f"Average Quality:      {quality['average']}%")
    print(f"Median Quality:       {quality['median']}%")
    print(f"Repositories:         {len(repos)}")
    print(f"Items needing work:   {sum(1 for s in quality['distribution'].values() if s)}")

    # Show quality distribution
    print("\nQuality Distribution:")
    for level, count in quality["distribution"].items():
        bar = "#" * (count // 10)
        print(f"  {level:20} {count:4} {bar}")


if __name__ == "__main__":
    main()
