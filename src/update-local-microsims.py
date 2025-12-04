#!/usr/bin/env python3
"""
Local Repository MicroSim Metadata Updater

Scans local checked out GitHub repositories for metadata.json files and
updates the combined microsims-data.json file. Handles duplicates by
replacing existing entries for the same repo/sim combination.

Usage:
    python src/update-local-microsims.py                    # Scan all repos in workspace
    python src/update-local-microsims.py geometry-course   # Scan specific repo
    python src/update-local-microsims.py --list            # List available repos

Output:
    - Updates docs/search/microsims-data.json with new/changed metadata
    - Logs activity to logs/local-update-YYYY-MM-DD.jsonl
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORKSPACE_DIR = Path(os.environ.get("HOME")) / "Documents" / "ws"
GITHUB_OWNER = "dmccreary"  # Default owner for GitHub URL construction

# Paths relative to script location
SCRIPT_DIR = Path(__file__).parent.parent
OUTPUT_JSON = SCRIPT_DIR / "docs" / "search" / "microsims-data.json"
LOG_DIR = SCRIPT_DIR / "logs"


class LocalRepoUpdater:
    def __init__(self, workspace: Path = WORKSPACE_DIR):
        self.workspace = workspace
        self.log_file = None
        self.existing_data = []
        self.new_metadata = []
        self.stats = {
            "repos_scanned": 0,
            "sims_found": 0,
            "metadata_found": 0,
            "metadata_missing": 0,
            "added": 0,
            "updated": 0,
            "errors": 0
        }

    def log(self, event_type: str, data: dict):
        """Write a log entry in JSONL format."""
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "event": event_type,
            **data
        }
        if self.log_file:
            self.log_file.write(json.dumps(entry) + "\n")
            self.log_file.flush()

        if event_type in ["error", "missing_metadata"]:
            print(f"  [{event_type}] {data}")

    def load_existing_data(self):
        """Load existing microsims-data.json if it exists."""
        if OUTPUT_JSON.exists():
            with open(OUTPUT_JSON) as f:
                self.existing_data = json.load(f)
            print(f"Loaded {len(self.existing_data)} existing entries")
        else:
            self.existing_data = []
            print("No existing data file found, starting fresh")

    def find_local_repos(self) -> list[Path]:
        """Find all local repos that have a docs/sims directory."""
        repos = []
        if not self.workspace.exists():
            print(f"Workspace directory not found: {self.workspace}")
            return repos

        for item in self.workspace.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                sims_dir = item / "docs" / "sims"
                if sims_dir.exists() and sims_dir.is_dir():
                    repos.append(item)

        return sorted(repos, key=lambda p: p.name)

    def get_sims_directories(self, repo_path: Path) -> list[str]:
        """Get list of sim directories from a local repo."""
        sims_dir = repo_path / "docs" / "sims"
        if not sims_dir.exists():
            return []

        sim_dirs = []
        for item in sims_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                sim_dirs.append(item.name)

        return sorted(sim_dirs)

    def read_metadata(self, repo_path: Path, sim_name: str) -> dict | None:
        """Read metadata.json for a specific MicroSim from local filesystem."""
        metadata_path = repo_path / "docs" / "sims" / sim_name / "metadata.json"

        if not metadata_path.exists():
            return None

        try:
            with open(metadata_path) as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            self.log("error", {
                "repo": repo_path.name,
                "sim": sim_name,
                "message": f"Invalid JSON: {e}"
            })
            self.stats["errors"] += 1
            return None
        except Exception as e:
            self.log("error", {
                "repo": repo_path.name,
                "sim": sim_name,
                "message": f"Read error: {e}"
            })
            self.stats["errors"] += 1
            return None

    def process_repo(self, repo_path: Path):
        """Process a single local repository."""
        repo_name = repo_path.name
        print(f"\nProcessing {repo_name}...")

        sim_dirs = self.get_sims_directories(repo_path)
        if not sim_dirs:
            print(f"  No sim directories found")
            return

        print(f"  Found {len(sim_dirs)} sim directories")
        self.stats["repos_scanned"] += 1

        for sim_name in sim_dirs:
            self.stats["sims_found"] += 1
            metadata = self.read_metadata(repo_path, sim_name)

            if metadata:
                self.stats["metadata_found"] += 1

                # Add source info
                metadata["_source"] = {
                    "repo": repo_name,
                    "sim": sim_name,
                    "github_url": f"https://github.com/{GITHUB_OWNER}/{repo_name}/tree/main/docs/sims/{sim_name}"
                }

                # Ensure URL is set
                if "identifier" in metadata and not metadata.get("url"):
                    metadata["url"] = metadata["identifier"]
                elif not metadata.get("url"):
                    metadata["url"] = f"https://{GITHUB_OWNER}.github.io/{repo_name}/sims/{sim_name}/"

                self.new_metadata.append(metadata)
                print(f"    + {sim_name}")

                self.log("metadata_found", {
                    "repo": repo_name,
                    "sim": sim_name,
                    "title": metadata.get("title", "Unknown")
                })
            else:
                self.stats["metadata_missing"] += 1
                print(f"    - {sim_name} (no metadata)")

                self.log("missing_metadata", {
                    "repo": repo_name,
                    "sim": sim_name,
                    "github_url": f"https://github.com/{GITHUB_OWNER}/{repo_name}/tree/main/docs/sims/{sim_name}"
                })

    def merge_metadata(self):
        """Merge new metadata with existing data, removing duplicates."""
        # Build a key-based index of existing entries
        # Key is (repo, sim) tuple from _source
        existing_by_key = {}
        for item in self.existing_data:
            source = item.get("_source", {})
            key = (source.get("repo"), source.get("sim"))
            if key != (None, None):
                existing_by_key[key] = item

        # Process new metadata
        for new_item in self.new_metadata:
            source = new_item.get("_source", {})
            key = (source.get("repo"), source.get("sim"))

            if key in existing_by_key:
                # Update existing entry
                self.stats["updated"] += 1
                existing_by_key[key] = new_item
            else:
                # Add new entry
                self.stats["added"] += 1
                existing_by_key[key] = new_item

        # Convert back to list and remove any entries with invalid keys
        merged = [v for k, v in existing_by_key.items() if k != (None, None)]

        # Also include any existing entries that didn't have _source
        for item in self.existing_data:
            if "_source" not in item or not item["_source"].get("repo"):
                merged.append(item)

        # Remove duplicates by creating unique key for each entry
        seen = set()
        unique_merged = []
        for item in merged:
            source = item.get("_source", {})
            key = (source.get("repo"), source.get("sim"))
            if key not in seen:
                seen.add(key)
                unique_merged.append(item)

        # Sort by repo name then sim name for consistent output
        unique_merged.sort(key=lambda x: (
            x.get("_source", {}).get("repo", ""),
            x.get("_source", {}).get("sim", "")
        ))

        # Reassign sequential IDs
        for i, item in enumerate(unique_merged, 1):
            item["id"] = i

        return unique_merged

    def update(self, repo_names: list[str] | None = None):
        """Main update logic."""
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_filename = f"local-update-{datetime.now().strftime('%Y-%m-%d')}.jsonl"
        log_path = LOG_DIR / log_filename

        print(f"Local MicroSim Metadata Updater")
        print(f"Workspace: {self.workspace}")
        print(f"Log file: {log_path}")
        print(f"Output: {OUTPUT_JSON}")

        with open(log_path, "a") as self.log_file:
            self.log("update_started", {"workspace": str(self.workspace)})

            # Load existing data
            self.load_existing_data()

            # Find repos to process
            if repo_names:
                # Process specific repos
                repos = []
                for name in repo_names:
                    repo_path = self.workspace / name
                    if repo_path.exists():
                        repos.append(repo_path)
                    else:
                        print(f"Warning: Repo not found: {name}")
            else:
                # Find all repos with docs/sims
                repos = self.find_local_repos()

            if not repos:
                print("\nNo repositories found to process.")
                self.log("update_completed", {"message": "No repos found"})
                return

            print(f"\nFound {len(repos)} repositories with docs/sims:")
            for repo in repos:
                print(f"  - {repo.name}")

            # Process each repo
            for repo_path in repos:
                self.process_repo(repo_path)

            # Merge and save
            merged_data = self.merge_metadata()

            OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
            with open(OUTPUT_JSON, "w") as f:
                json.dump(merged_data, f, indent=2)

            self.log("update_completed", self.stats)

        # Print summary
        print()
        print("=" * 50)
        print("UPDATE COMPLETE")
        print("=" * 50)
        print(f"Repos scanned:     {self.stats['repos_scanned']}")
        print(f"Sims found:        {self.stats['sims_found']}")
        print(f"Metadata found:    {self.stats['metadata_found']}")
        print(f"Metadata missing:  {self.stats['metadata_missing']}")
        print(f"Entries added:     {self.stats['added']}")
        print(f"Entries updated:   {self.stats['updated']}")
        print(f"Errors:            {self.stats['errors']}")
        print(f"Total entries:     {len(merged_data)}")
        print()
        print(f"Output written to: {OUTPUT_JSON}")


def list_available_repos(workspace: Path):
    """List all repos that have docs/sims directory."""
    print(f"Available repositories in {workspace}:")
    print()

    if not workspace.exists():
        print(f"Workspace directory not found: {workspace}")
        return

    found = 0
    for item in sorted(workspace.iterdir(), key=lambda p: p.name):
        if item.is_dir() and not item.name.startswith('.'):
            sims_dir = item / "docs" / "sims"
            if sims_dir.exists() and sims_dir.is_dir():
                sim_count = len([s for s in sims_dir.iterdir() if s.is_dir()])
                print(f"  {item.name} ({sim_count} sims)")
                found += 1

    print()
    print(f"Total: {found} repositories with docs/sims")


def main():
    parser = argparse.ArgumentParser(
        description="Update MicroSim metadata from local GitHub repositories",
        epilog="Examples:\n"
               "  python src/update-local-microsims.py                  # Scan all repos\n"
               "  python src/update-local-microsims.py geometry-course  # Scan specific repo\n"
               "  python src/update-local-microsims.py repo1 repo2      # Scan multiple repos\n"
               "  python src/update-local-microsims.py --list           # List available repos",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "repos",
        nargs="*",
        help="Repository names to process (default: all repos with docs/sims)"
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List available repositories and exit"
    )
    parser.add_argument(
        "--workspace", "-w",
        type=Path,
        default=WORKSPACE_DIR,
        help=f"Workspace directory containing repos (default: {WORKSPACE_DIR})"
    )

    args = parser.parse_args()

    if args.list:
        list_available_repos(args.workspace)
        return

    updater = LocalRepoUpdater(args.workspace)
    updater.update(args.repos if args.repos else None)


if __name__ == "__main__":
    main()
