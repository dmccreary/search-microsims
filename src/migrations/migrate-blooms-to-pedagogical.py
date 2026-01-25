#!/usr/bin/env python3
"""
Migration Script: Move bloomsTaxonomy from educational to pedagogical

This script migrates the bloomsTaxonomy field from the educational section
to the pedagogical section in all MicroSim metadata.json files.

The migration reflects the schema change where Bloom's taxonomy data
now lives in the pedagogical section since it impacts template matching scores.

Usage:
    # Dry run (preview changes)
    python src/migrations/migrate-blooms-to-pedagogical.py --dry-run

    # Actually perform migration
    python src/migrations/migrate-blooms-to-pedagogical.py

    # Migrate specific repo
    python src/migrations/migrate-blooms-to-pedagogical.py --repo geometry-course

Output:
    - Updates metadata.json files in place
    - Logs changes to logs/blooms-migration-YYYY-MM-DD.log
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
import argparse

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
REPOS_BASE = Path.home() / "Documents" / "ws"
LOG_DIR = PROJECT_ROOT / "logs"

# List of dmccreary repos to process
REPOS = [
    "algebra-1",
    "algebra-2",
    "arithmetic-course",
    "automating-instructional-design",
    "beginning-electronics",
    "calculus",
    "circuit-boards-course",
    "circuits-in-python",
    "clojure-graphics",
    "computer-architecture",
    "data-literacy",
    "deep-learning-course",
    "digital-twins",
    "discovery-graphs",
    "electronics",
    "fft-benchmarking",
    "geometry-course",
    "graph-algorithms",
    "graph-course",
    "graph-databases-course",
    "graph-lms",
    "intro-to-cosine-similarity",
    "learn-langchain",
    "learning-haskell",
    "learning-java",
    "machine-learning-course",
    "microsims",
    "mkdocs-for-educators",
    "moving-rainbow",
    "neopixel-words",
    "physics-pond",
    "physics-sims",
    "pi-pico-robot-pet",
    "python-crash-course",
    "raspberry-pi-pico-sims",
    "robot-day",
    "signal-processing",
    "spectrum-analyzer",
    "statistics",
    "stem-robots",
    "tour-maps",
    "trigonometry",
]


def migrate_metadata_file(filepath: Path, dry_run: bool = False) -> dict:
    """
    Migrate a single metadata.json file.

    Returns dict with migration status:
        - 'status': 'migrated', 'already_done', 'no_blooms', 'error'
        - 'details': description of what happened
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return {'status': 'error', 'details': f'JSON parse error: {e}'}
    except Exception as e:
        return {'status': 'error', 'details': f'Read error: {e}'}

    # Check various structures
    educational = data.get('educational', {})
    pedagogical = data.get('pedagogical', {})

    # Also check nested microsim structure
    if 'microsim' in data:
        educational = data.get('microsim', {}).get('educational', {})
        pedagogical = data.get('microsim', {}).get('pedagogical', {})

    blooms_edu = educational.get('bloomsTaxonomy', [])
    blooms_ped = pedagogical.get('bloomsTaxonomy', [])

    # Case 1: Already migrated (bloomsTaxonomy in pedagogical, not in educational)
    if blooms_ped and not blooms_edu:
        return {'status': 'already_done', 'details': 'bloomsTaxonomy already in pedagogical'}

    # Case 2: No bloomsTaxonomy anywhere
    if not blooms_edu and not blooms_ped:
        return {'status': 'no_blooms', 'details': 'No bloomsTaxonomy field found'}

    # Case 3: bloomsTaxonomy in educational - needs migration
    if blooms_edu:
        if dry_run:
            return {
                'status': 'would_migrate',
                'details': f'Would move {blooms_edu} from educational to pedagogical'
            }

        # Perform migration
        # Handle nested microsim structure
        if 'microsim' in data:
            # Ensure pedagogical exists
            if 'pedagogical' not in data['microsim']:
                data['microsim']['pedagogical'] = {}

            # Move bloomsTaxonomy
            data['microsim']['pedagogical']['bloomsTaxonomy'] = blooms_edu
            del data['microsim']['educational']['bloomsTaxonomy']
        else:
            # Flat structure
            if 'pedagogical' not in data:
                data['pedagogical'] = {}

            data['pedagogical']['bloomsTaxonomy'] = blooms_edu
            del data['educational']['bloomsTaxonomy']

        # Write back
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                f.write('\n')  # Add trailing newline
            return {
                'status': 'migrated',
                'details': f'Moved {blooms_edu} from educational to pedagogical'
            }
        except Exception as e:
            return {'status': 'error', 'details': f'Write error: {e}'}

    return {'status': 'unknown', 'details': 'Unexpected state'}


def find_metadata_files(repo_path: Path) -> list:
    """Find all metadata.json files in a repo's docs/sims directory."""
    sims_dir = repo_path / "docs" / "sims"
    if not sims_dir.exists():
        return []

    metadata_files = []
    for item in sims_dir.iterdir():
        if item.is_dir():
            metadata_file = item / "metadata.json"
            if metadata_file.exists():
                metadata_files.append(metadata_file)

    return metadata_files


def main():
    parser = argparse.ArgumentParser(
        description='Migrate bloomsTaxonomy from educational to pedagogical section'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview changes without modifying files'
    )
    parser.add_argument(
        '--repo',
        type=str,
        help='Migrate only a specific repo (e.g., geometry-course)'
    )
    args = parser.parse_args()

    print("=" * 60)
    print("Bloom's Taxonomy Migration: educational → pedagogical")
    print("=" * 60)

    if args.dry_run:
        print("\n🔍 DRY RUN MODE - No files will be modified\n")

    # Setup logging
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_file = LOG_DIR / f"blooms-migration-{datetime.now().strftime('%Y-%m-%d')}.log"

    # Determine which repos to process
    repos_to_process = [args.repo] if args.repo else REPOS

    # Statistics
    stats = {
        'total_files': 0,
        'migrated': 0,
        'already_done': 0,
        'no_blooms': 0,
        'would_migrate': 0,
        'errors': 0,
        'repos_processed': 0,
        'repos_not_found': 0,
    }

    log_entries = []

    for repo_name in repos_to_process:
        repo_path = REPOS_BASE / repo_name

        if not repo_path.exists():
            print(f"⚠️  Repo not found: {repo_name}")
            stats['repos_not_found'] += 1
            continue

        metadata_files = find_metadata_files(repo_path)

        if not metadata_files:
            continue

        stats['repos_processed'] += 1
        repo_migrated = 0

        for metadata_file in metadata_files:
            stats['total_files'] += 1
            result = migrate_metadata_file(metadata_file, dry_run=args.dry_run)

            status = result['status']
            stats[status] = stats.get(status, 0) + 1

            if status in ('migrated', 'would_migrate'):
                repo_migrated += 1
                sim_name = metadata_file.parent.name
                log_entry = f"{repo_name}/{sim_name}: {result['details']}"
                log_entries.append(log_entry)
            elif status == 'error':
                sim_name = metadata_file.parent.name
                log_entry = f"ERROR {repo_name}/{sim_name}: {result['details']}"
                log_entries.append(log_entry)
                print(f"  ❌ {sim_name}: {result['details']}")

        if repo_migrated > 0:
            action = "Would migrate" if args.dry_run else "Migrated"
            print(f"✅ {repo_name}: {action} {repo_migrated} files")

    # Write log file
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write(f"Bloom's Taxonomy Migration Log\n")
        f.write(f"Date: {datetime.now().isoformat()}\n")
        f.write(f"Dry Run: {args.dry_run}\n")
        f.write("=" * 60 + "\n\n")
        for entry in log_entries:
            f.write(entry + "\n")

    # Print summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Repos processed:     {stats['repos_processed']}")
    print(f"Repos not found:     {stats['repos_not_found']}")
    print(f"Total files checked: {stats['total_files']}")
    print(f"Already migrated:    {stats['already_done']}")
    print(f"No bloomsTaxonomy:   {stats['no_blooms']}")

    if args.dry_run:
        print(f"Would migrate:       {stats.get('would_migrate', 0)}")
    else:
        print(f"Migrated:            {stats['migrated']}")

    print(f"Errors:              {stats['errors']}")
    print(f"\nLog file: {log_file}")

    if args.dry_run and stats.get('would_migrate', 0) > 0:
        print(f"\n💡 Run without --dry-run to perform migration")


if __name__ == "__main__":
    main()
