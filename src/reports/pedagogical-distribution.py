#!/usr/bin/env python3
"""
Pedagogical Distribution Report Generator

Analyzes the distribution of pedagogical metadata across all MicroSims,
comparing bloomsTaxonomy (content scope) vs bloomAlignment (pattern effectiveness)
within the pedagogical section to determine overlap and differences.

Usage:
    python src/reports/pedagogical-distribution.py

Output:
    docs/reports/pedagogical-distribution.md
"""

import json
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
INPUT_FILE = PROJECT_ROOT / "docs" / "search" / "microsims-data.json"
OUTPUT_FILE = PROJECT_ROOT / "docs" / "reports" / "pedagogical-distribution.md"


def normalize_bloom_level(level: str) -> str:
    """Normalize Bloom level to lowercase standard form."""
    if not level:
        return ""
    level = level.lower().strip()
    # Handle variations
    mappings = {
        "remember": "remember",
        "remembering": "remember",
        "understand": "understand",
        "understanding": "understand",
        "apply": "apply",
        "applying": "apply",
        "application": "apply",
        "analyze": "analyze",
        "analyse": "analyze",
        "analyzing": "analyze",
        "analysing": "analyze",
        "analysis": "analyze",
        "evaluate": "evaluate",
        "evaluating": "evaluate",
        "evaluation": "evaluate",
        "create": "create",
        "creating": "create",
        "creation": "create",
    }
    return mappings.get(level, level)


def extract_bloom_levels(data, field_path: list) -> set:
    """Extract Bloom levels from a nested field path."""
    result = set()
    current = data

    for key in field_path:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return result

    if isinstance(current, list):
        for item in current:
            normalized = normalize_bloom_level(str(item))
            if normalized:
                result.add(normalized)
    elif isinstance(current, str):
        normalized = normalize_bloom_level(current)
        if normalized:
            result.add(normalized)

    return result


def analyze_microsims(microsims: list) -> dict:
    """Analyze pedagogical metadata across all MicroSims."""
    stats = {
        "total": len(microsims),
        "has_blooms_taxonomy": 0,
        "has_bloom_alignment": 0,
        "has_both": 0,
        "has_neither": 0,
        "exact_match": 0,
        "subset_match": 0,  # bloomAlignment is subset of bloomsTaxonomy
        "superset_match": 0,  # bloomAlignment is superset of bloomsTaxonomy
        "partial_overlap": 0,
        "no_overlap": 0,
        "taxonomy_only": Counter(),
        "alignment_only": Counter(),
        "taxonomy_distribution": Counter(),
        "alignment_distribution": Counter(),
        "pattern_distribution": Counter(),
        "pacing_distribution": Counter(),
        "bloom_verbs_distribution": Counter(),
        "comparison_details": [],
    }

    for ms in microsims:
        # Extract bloomsTaxonomy from pedagogical section (content scope)
        taxonomy_blooms = extract_bloom_levels(ms, ["pedagogical", "bloomsTaxonomy"])
        # Also check legacy flat format
        if not taxonomy_blooms:
            taxonomy_blooms = extract_bloom_levels(ms, ["bloomsTaxonomy"])
        if not taxonomy_blooms:
            taxonomy_blooms = extract_bloom_levels(ms, ["bloomLevel"])

        # Extract bloomAlignment from pedagogical section (pattern effectiveness)
        alignment_blooms = extract_bloom_levels(ms, ["pedagogical", "bloomAlignment"])

        # Track presence
        has_taxonomy = len(taxonomy_blooms) > 0
        has_alignment = len(alignment_blooms) > 0

        if has_taxonomy:
            stats["has_blooms_taxonomy"] += 1
            for level in taxonomy_blooms:
                stats["taxonomy_distribution"][level] += 1

        if has_alignment:
            stats["has_bloom_alignment"] += 1
            for level in alignment_blooms:
                stats["alignment_distribution"][level] += 1

        if has_taxonomy and has_alignment:
            stats["has_both"] += 1

            # Compare the sets
            if taxonomy_blooms == alignment_blooms:
                stats["exact_match"] += 1
            elif alignment_blooms.issubset(taxonomy_blooms):
                stats["subset_match"] += 1
            elif alignment_blooms.issuperset(taxonomy_blooms):
                stats["superset_match"] += 1
            elif len(taxonomy_blooms & alignment_blooms) > 0:
                stats["partial_overlap"] += 1
            else:
                stats["no_overlap"] += 1
                # Track these for the report
                title = ms.get("title") or ms.get("dublinCore", {}).get("title", "Unknown")
                stats["comparison_details"].append({
                    "title": title,
                    "taxonomy": sorted(taxonomy_blooms),
                    "alignment": sorted(alignment_blooms),
                })
        elif has_taxonomy and not has_alignment:
            stats["taxonomy_only"]["count"] += 1
            for level in taxonomy_blooms:
                stats["taxonomy_only"][level] += 1
        elif has_alignment and not has_taxonomy:
            stats["alignment_only"]["count"] += 1
            for level in alignment_blooms:
                stats["alignment_only"][level] += 1
        else:
            stats["has_neither"] += 1

        # Extract other pedagogical fields
        pedagogical = ms.get("pedagogical", {})
        if pedagogical:
            pattern = pedagogical.get("pattern", "")
            if pattern:
                stats["pattern_distribution"][pattern] += 1

            pacing = pedagogical.get("pacing", "")
            if pacing:
                stats["pacing_distribution"][pacing] += 1

            bloom_verbs = pedagogical.get("bloomVerbs", [])
            if bloom_verbs:
                for verb in bloom_verbs:
                    stats["bloom_verbs_distribution"][verb] += 1

    return stats


def generate_report(stats: dict) -> str:
    """Generate markdown report from statistics."""
    lines = []

    lines.append("---")
    lines.append("title: Pedagogical Metadata Distribution Report")
    lines.append(f"date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("---")
    lines.append("")
    lines.append("# Pedagogical Metadata Distribution Report")
    lines.append("")
    lines.append("This report analyzes the distribution of pedagogical metadata across all MicroSims,")
    lines.append("comparing `bloomsTaxonomy` (content scope) vs `bloomAlignment` (pattern effectiveness)")
    lines.append("within the `pedagogical` section to determine overlap and differences.")
    lines.append("")

    # Overview
    lines.append("## Overview")
    lines.append("")
    lines.append(f"**Total MicroSims analyzed:** {stats['total']}")
    lines.append("")
    lines.append("| Metric | Count | Percentage |")
    lines.append("|--------|-------|------------|")
    lines.append(f"| Has pedagogical.bloomsTaxonomy | {stats['has_blooms_taxonomy']} | {100*stats['has_blooms_taxonomy']/stats['total']:.1f}% |")
    lines.append(f"| Has pedagogical.bloomAlignment | {stats['has_bloom_alignment']} | {100*stats['has_bloom_alignment']/stats['total']:.1f}% |")
    lines.append(f"| Has both fields | {stats['has_both']} | {100*stats['has_both']/stats['total']:.1f}% |")
    lines.append(f"| Has neither field | {stats['has_neither']} | {100*stats['has_neither']/stats['total']:.1f}% |")
    lines.append("")

    # Comparison of both
    if stats['has_both'] > 0:
        lines.append("## Comparison: bloomsTaxonomy vs bloomAlignment")
        lines.append("")
        lines.append("For MicroSims that have **both** fields populated:")
        lines.append("")
        lines.append("| Relationship | Count | Percentage |")
        lines.append("|--------------|-------|------------|")
        lines.append(f"| Exact match (identical sets) | {stats['exact_match']} | {100*stats['exact_match']/stats['has_both']:.1f}% |")
        lines.append(f"| bloomAlignment ⊂ bloomsTaxonomy (subset) | {stats['subset_match']} | {100*stats['subset_match']/stats['has_both']:.1f}% |")
        lines.append(f"| bloomAlignment ⊃ bloomsTaxonomy (superset) | {stats['superset_match']} | {100*stats['superset_match']/stats['has_both']:.1f}% |")
        lines.append(f"| Partial overlap | {stats['partial_overlap']} | {100*stats['partial_overlap']/stats['has_both']:.1f}% |")
        lines.append(f"| No overlap (completely different) | {stats['no_overlap']} | {100*stats['no_overlap']/stats['has_both']:.1f}% |")
        lines.append("")

        # Calculate agreement rate
        agreement = stats['exact_match'] + stats['subset_match'] + stats['superset_match'] + stats['partial_overlap']
        lines.append(f"**Agreement rate** (any overlap): {100*agreement/stats['has_both']:.1f}%")
        lines.append("")
        lines.append(f"**Exact match rate**: {100*stats['exact_match']/stats['has_both']:.1f}%")
        lines.append("")

    # Distribution tables
    lines.append("## Bloom Level Distribution by Field")
    lines.append("")

    # Combine all levels
    all_levels = ["remember", "understand", "apply", "analyze", "evaluate", "create"]

    lines.append("| Bloom Level | bloomsTaxonomy | bloomAlignment | Difference |")
    lines.append("|-------------|----------------|----------------|------------|")
    for level in all_levels:
        taxonomy_count = stats['taxonomy_distribution'].get(level, 0)
        alignment_count = stats['alignment_distribution'].get(level, 0)
        diff = alignment_count - taxonomy_count
        diff_str = f"+{diff}" if diff > 0 else str(diff)
        lines.append(f"| {level.capitalize()} | {taxonomy_count} | {alignment_count} | {diff_str} |")
    lines.append("")

    # Pattern distribution
    if stats['pattern_distribution']:
        lines.append("## Pedagogical Pattern Distribution")
        lines.append("")
        lines.append("| Pattern | Count | Percentage |")
        lines.append("|---------|-------|------------|")
        total_patterns = sum(stats['pattern_distribution'].values())
        for pattern, count in stats['pattern_distribution'].most_common():
            lines.append(f"| {pattern} | {count} | {100*count/total_patterns:.1f}% |")
        lines.append("")

    # Pacing distribution
    if stats['pacing_distribution']:
        lines.append("## Pacing Distribution")
        lines.append("")
        lines.append("| Pacing | Count | Percentage |")
        lines.append("|--------|-------|------------|")
        total_pacing = sum(stats['pacing_distribution'].values())
        for pacing, count in stats['pacing_distribution'].most_common():
            lines.append(f"| {pacing} | {count} | {100*count/total_pacing:.1f}% |")
        lines.append("")

    # Top Bloom verbs
    if stats['bloom_verbs_distribution']:
        lines.append("## Top 20 Bloom Verbs")
        lines.append("")
        lines.append("| Verb | Count |")
        lines.append("|------|-------|")
        for verb, count in stats['bloom_verbs_distribution'].most_common(20):
            lines.append(f"| {verb} | {count} |")
        lines.append("")

    # No overlap examples
    if stats['comparison_details']:
        lines.append("## MicroSims with No Overlap Between Fields")
        lines.append("")
        lines.append("These MicroSims have completely different values in pedagogical.bloomsTaxonomy")
        lines.append("and pedagogical.bloomAlignment, which may indicate data quality issues:")
        lines.append("")
        lines.append("| Title | bloomsTaxonomy | bloomAlignment |")
        lines.append("|-------|----------------|----------------|")
        for detail in stats['comparison_details'][:20]:  # Limit to 20
            taxonomy_str = ", ".join(detail['taxonomy'])
            alignment_str = ", ".join(detail['alignment'])
            title = detail['title'][:40] + "..." if len(detail['title']) > 40 else detail['title']
            lines.append(f"| {title} | {taxonomy_str} | {alignment_str} |")
        if len(stats['comparison_details']) > 20:
            lines.append(f"| ... and {len(stats['comparison_details']) - 20} more | | |")
        lines.append("")

    # Recommendations
    lines.append("## Analysis & Recommendations")
    lines.append("")

    if stats['has_both'] > 0:
        exact_pct = 100 * stats['exact_match'] / stats['has_both']
        overlap_pct = 100 * (stats['exact_match'] + stats['subset_match'] + stats['superset_match'] + stats['partial_overlap']) / stats['has_both']

        if exact_pct > 80:
            lines.append("### High Redundancy Detected")
            lines.append("")
            lines.append(f"With {exact_pct:.1f}% exact matches between bloomsTaxonomy and")
            lines.append("bloomAlignment, there is significant redundancy. Consider:")
            lines.append("")
            lines.append("1. **Remove one field** - If they are always the same, keep only one")
            lines.append("2. **Keep only bloomVerbs in pedagogical** - More specific and useful for matching")
            lines.append("")
        elif overlap_pct > 70:
            lines.append("### Moderate Redundancy Detected")
            lines.append("")
            lines.append(f"With {overlap_pct:.1f}% overlap between the fields, there is moderate redundancy.")
            lines.append("The fields often agree but not always. Consider:")
            lines.append("")
            lines.append("1. **Clarify the distinction** - Document when they should differ")
            lines.append("2. **Use bloomsTaxonomy for content scope** - All levels the content can address")
            lines.append("3. **Use bloomAlignment for pattern effectiveness** - Levels the interaction pattern supports")
            lines.append("4. **Keep bloomVerbs as the primary matching field** - More granular than levels")
            lines.append("")
        else:
            lines.append("### Low Agreement Detected")
            lines.append("")
            lines.append(f"With only {overlap_pct:.1f}% overlap, the fields capture different information.")
            lines.append("This suggests they serve genuinely different purposes:")
            lines.append("")
            lines.append("- **bloomsTaxonomy**: All Bloom levels the content can address (content scope)")
            lines.append("- **bloomAlignment**: Bloom levels the interaction pattern effectively supports (pattern effectiveness)")
            lines.append("")

    lines.append("### Field Purpose Summary")
    lines.append("")
    lines.append("| Field | Section | Purpose | Used For |")
    lines.append("|-------|---------|---------|----------|")
    lines.append("| bloomsTaxonomy | pedagogical | Content cognitive scope | Semantic search |")
    lines.append("| bloomAlignment | pedagogical | Pattern effectiveness levels | Template matching |")
    lines.append("| bloomVerbs | pedagogical | Specific action verbs | Precise matching |")
    lines.append("")

    return "\n".join(lines)


def main():
    print("Pedagogical Distribution Report Generator")
    print("=" * 50)

    # Load data
    print(f"\nLoading MicroSims from {INPUT_FILE}...")
    if not INPUT_FILE.exists():
        print(f"Error: Input file not found: {INPUT_FILE}")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        microsims = json.load(f)

    print(f"Loaded {len(microsims)} MicroSims")

    # Analyze
    print("\nAnalyzing pedagogical metadata distribution...")
    stats = analyze_microsims(microsims)

    # Generate report
    print("\nGenerating report...")
    report = generate_report(stats)

    # Ensure output directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Write report
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"\nReport saved to: {OUTPUT_FILE}")

    # Print summary
    print("\n" + "=" * 50)
    print("Summary:")
    print(f"  - Total MicroSims: {stats['total']}")
    print(f"  - Has pedagogical.bloomsTaxonomy: {stats['has_blooms_taxonomy']}")
    print(f"  - Has pedagogical.bloomAlignment: {stats['has_bloom_alignment']}")
    print(f"  - Has both: {stats['has_both']}")
    if stats['has_both'] > 0:
        print(f"  - Exact match: {stats['exact_match']} ({100*stats['exact_match']/stats['has_both']:.1f}%)")
    print("\nDone!")


if __name__ == "__main__":
    main()
