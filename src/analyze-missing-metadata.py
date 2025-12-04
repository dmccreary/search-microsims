#!/usr/bin/env python3
"""
Analyze Missing Metadata

Reads the crawl log and generates a report of repositories
sorted by the number of MicroSims missing metadata.json files.

Usage:
    python src/analyze-missing-metadata.py [logfile]

If no logfile specified, uses the most recent crawl log.
"""

import json
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.parent
LOG_DIR = SCRIPT_DIR / "logs"


def find_latest_log():
    """Find the most recent crawl log file."""
    logs = list(LOG_DIR.glob("microsim-crawl-*.jsonl"))
    if not logs:
        return None
    return max(logs, key=lambda p: p.stat().st_mtime)


def analyze_log(log_path: Path):
    """Analyze a crawl log and return statistics."""

    # Track stats per repo
    repos = defaultdict(lambda: {
        "missing": [],
        "found": [],
        "url": ""
    })

    with open(log_path) as f:
        for line in f:
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue

            event = entry.get("event")
            repo = entry.get("repo")

            if event == "repo_found":
                repos[repo]["url"] = entry.get("url", "")

            elif event == "missing_metadata":
                repos[repo]["missing"].append({
                    "sim": entry.get("sim"),
                    "github_url": entry.get("github_url")
                })

            elif event == "metadata_found":
                repos[repo]["found"].append({
                    "sim": entry.get("sim"),
                    "title": entry.get("title")
                })

    return repos


def print_report(repos: dict, show_details: bool = True):
    """Print a sorted report of missing metadata."""

    # Sort by number of missing (descending)
    sorted_repos = sorted(
        repos.items(),
        key=lambda x: len(x[1]["missing"]),
        reverse=True
    )

    # Filter to only repos with missing metadata
    repos_with_missing = [(r, d) for r, d in sorted_repos if d["missing"]]

    # Summary statistics
    total_missing = sum(len(d["missing"]) for _, d in repos_with_missing)
    total_found = sum(len(d["found"]) for _, d in sorted_repos)

    print("=" * 70)
    print("MISSING METADATA ANALYSIS")
    print("=" * 70)
    print(f"Total repos with missing metadata: {len(repos_with_missing)}")
    print(f"Total MicroSims missing metadata:  {total_missing}")
    print(f"Total MicroSims with metadata:     {total_found}")
    print(f"Coverage: {total_found}/{total_found + total_missing} ({100*total_found/(total_found + total_missing):.1f}%)")
    print()

    print("=" * 70)
    print("REPOS SORTED BY MISSING METADATA COUNT")
    print("=" * 70)
    print(f"{'Repo':<35} {'Missing':>8} {'Found':>8} {'Total':>8}")
    print("-" * 70)

    for repo, data in repos_with_missing:
        missing_count = len(data["missing"])
        found_count = len(data["found"])
        total = missing_count + found_count
        print(f"{repo:<35} {missing_count:>8} {found_count:>8} {total:>8}")

    print("-" * 70)
    print(f"{'TOTAL':<35} {total_missing:>8} {total_found:>8} {total_missing + total_found:>8}")
    print()

    if show_details:
        print("=" * 70)
        print("DETAILED MISSING METADATA BY REPO")
        print("=" * 70)

        for repo, data in repos_with_missing:
            if not data["missing"]:
                continue

            print(f"\n{repo} ({len(data['missing'])} missing)")
            print(f"  Repo: {data['url']}")
            print("  Missing:")
            for item in sorted(data["missing"], key=lambda x: x["sim"]):
                print(f"    - {item['sim']}")

            if data["found"]:
                print("  Has metadata:")
                for item in sorted(data["found"], key=lambda x: x["sim"]):
                    print(f"    + {item['sim']}: {item['title']}")


def export_csv(repos: dict, output_path: Path):
    """Export missing metadata to CSV for further analysis."""

    sorted_repos = sorted(
        repos.items(),
        key=lambda x: len(x[1]["missing"]),
        reverse=True
    )

    with open(output_path, "w") as f:
        f.write("repo,sim,github_url\n")
        for repo, data in sorted_repos:
            for item in data["missing"]:
                f.write(f"{repo},{item['sim']},{item['github_url']}\n")

    print(f"\nCSV exported to: {output_path}")


def main():
    # Get log file
    if len(sys.argv) > 1:
        log_path = Path(sys.argv[1])
    else:
        log_path = find_latest_log()

    if not log_path or not log_path.exists():
        print("Error: No crawl log found. Run crawl-microsims.py first.")
        sys.exit(1)

    print(f"Analyzing: {log_path}")
    print()

    # Analyze
    repos = analyze_log(log_path)

    # Print report
    print_report(repos, show_details=True)

    # Export CSV
    csv_path = LOG_DIR / f"missing-metadata-{datetime.now().strftime('%Y-%m-%d')}.csv"
    export_csv(repos, csv_path)


if __name__ == "__main__":
    main()
