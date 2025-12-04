#!/usr/bin/env python3
"""
Single Repository MicroSim Metadata Updater

Fetches metadata.json files from a single GitHub repository and
updates the combined microsims-data.json file. Handles duplicates
by replacing existing entries for the same repo/sim combination.

Usage:
    python src/update-repo-microsims.py <owner/repo>
    python src/update-repo-microsims.py dmccreary/geometry-course

Output:
    - Updates docs/search/microsims-data.json with new/changed metadata
    - Logs activity to logs/repo-update-YYYY-MM-DD.jsonl
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

# Configuration
GITHUB_API = "https://api.github.com"
RAW_CONTENT_BASE = "https://raw.githubusercontent.com"
REQUEST_DELAY = 0.5  # seconds between requests

# Paths relative to script location
SCRIPT_DIR = Path(__file__).parent.parent
OUTPUT_JSON = SCRIPT_DIR / "docs" / "search" / "microsims-data.json"
LOG_DIR = SCRIPT_DIR / "logs"


class RepoUpdater:
    def __init__(self, owner: str, repo: str):
        self.owner = owner
        self.repo = repo
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "MicroSim-RepoUpdater/1.0"
        })

        # Check for GitHub token
        github_token = os.environ.get("GITHUB_TOKEN")
        if github_token:
            self.session.headers["Authorization"] = f"token {github_token}"
            print("Using GitHub token for authentication")
        else:
            print("Warning: No GITHUB_TOKEN set. Rate limits will be lower (60 req/hr)")

        self.log_file = None
        self.existing_data = []
        self.new_metadata = []
        self.stats = {
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
            "repo": f"{self.owner}/{self.repo}",
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

    def get_sims_directories(self) -> list:
        """Get list of sim directories from the repo."""
        url = f"{GITHUB_API}/repos/{self.owner}/{self.repo}/contents/docs/sims"

        response = self.session.get(url)
        time.sleep(REQUEST_DELAY)

        if response.status_code == 404:
            print(f"No docs/sims directory found in {self.owner}/{self.repo}")
            return []

        if response.status_code == 403:
            print("Rate limited! Set GITHUB_TOKEN environment variable.")
            self.log("error", {"message": "Rate limited", "url": url})
            return []

        if response.status_code != 200:
            self.log("error", {
                "message": f"API error {response.status_code}",
                "url": url
            })
            return []

        contents = response.json()
        sim_dirs = [item["name"] for item in contents if item["type"] == "dir"]
        return sim_dirs

    def fetch_metadata(self, sim_name: str) -> dict | None:
        """Fetch metadata.json for a specific MicroSim."""
        url = f"{RAW_CONTENT_BASE}/{self.owner}/{self.repo}/main/docs/sims/{sim_name}/metadata.json"

        response = self.session.get(url)
        time.sleep(REQUEST_DELAY)

        if response.status_code == 404:
            return None

        if response.status_code != 200:
            self.log("error", {
                "sim": sim_name,
                "message": f"HTTP error {response.status_code}",
                "url": url
            })
            self.stats["errors"] += 1
            return None

        try:
            return response.json()
        except json.JSONDecodeError as e:
            self.log("error", {
                "sim": sim_name,
                "message": f"Invalid JSON: {e}"
            })
            self.stats["errors"] += 1
            return None

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

        # Reassign sequential IDs
        for i, item in enumerate(unique_merged, 1):
            item["id"] = i

        return unique_merged

    def update(self):
        """Main update logic."""
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_filename = f"repo-update-{datetime.now().strftime('%Y-%m-%d')}.jsonl"
        log_path = LOG_DIR / log_filename

        print(f"Updating metadata from {self.owner}/{self.repo}")
        print(f"Log file: {log_path}")
        print(f"Output: {OUTPUT_JSON}")
        print()

        with open(log_path, "a") as self.log_file:
            self.log("update_started", {})

            # Load existing data
            self.load_existing_data()

            # Get sim directories
            print(f"Checking docs/sims in {self.owner}/{self.repo}...")
            sim_dirs = self.get_sims_directories()

            if not sim_dirs:
                print("No sim directories found.")
                self.log("update_completed", {"message": "No sims found"})
                return

            print(f"Found {len(sim_dirs)} sim directories")

            # Fetch metadata for each sim
            for sim_name in sim_dirs:
                self.stats["sims_found"] += 1
                metadata = self.fetch_metadata(sim_name)

                if metadata:
                    self.stats["metadata_found"] += 1

                    # Add source info
                    metadata["_source"] = {
                        "repo": self.repo,
                        "sim": sim_name,
                        "github_url": f"https://github.com/{self.owner}/{self.repo}/tree/main/docs/sims/{sim_name}"
                    }

                    # Ensure URL is set
                    if "identifier" in metadata and not metadata.get("url"):
                        metadata["url"] = metadata["identifier"]
                    elif not metadata.get("url"):
                        metadata["url"] = f"https://{self.owner}.github.io/{self.repo}/sims/{sim_name}/"

                    self.new_metadata.append(metadata)
                    print(f"  + {sim_name}")

                    self.log("metadata_found", {
                        "sim": sim_name,
                        "title": metadata.get("title", "Unknown")
                    })
                else:
                    self.stats["metadata_missing"] += 1
                    print(f"  - {sim_name} (no metadata)")

                    self.log("missing_metadata", {
                        "sim": sim_name,
                        "github_url": f"https://github.com/{self.owner}/{self.repo}/tree/main/docs/sims/{sim_name}"
                    })

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
        print(f"Sims found:        {self.stats['sims_found']}")
        print(f"Metadata found:    {self.stats['metadata_found']}")
        print(f"Metadata missing:  {self.stats['metadata_missing']}")
        print(f"Entries added:     {self.stats['added']}")
        print(f"Entries updated:   {self.stats['updated']}")
        print(f"Errors:            {self.stats['errors']}")
        print(f"Total entries:     {len(merged_data)}")
        print()
        print(f"Output written to: {OUTPUT_JSON}")


def parse_repo_arg(repo_arg: str) -> tuple[str, str]:
    """Parse repository argument - handles both URL and owner/repo formats."""
    # Handle full GitHub URLs
    # https://github.com/owner/repo or https://github.com/owner/repo/
    url_match = re.match(r'https?://github\.com/([^/]+)/([^/]+)/?$', repo_arg)
    if url_match:
        return url_match.group(1), url_match.group(2)

    # Handle owner/repo format
    if "/" in repo_arg:
        parts = repo_arg.split("/", 1)
        return parts[0], parts[1]

    return None, None


def main():
    parser = argparse.ArgumentParser(
        description="Update MicroSim metadata from a single GitHub repository",
        epilog="Examples:\n"
               "  python src/update-repo-microsims.py dmccreary/geometry-course\n"
               "  python src/update-repo-microsims.py https://github.com/dmccreary/geometry-course",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "repo",
        help="GitHub repository (owner/repo or full URL)"
    )

    args = parser.parse_args()

    owner, repo = parse_repo_arg(args.repo)

    if not owner or not repo:
        print(f"Error: Could not parse repository: {args.repo}")
        print(f"Expected formats:")
        print(f"  dmccreary/geometry-course")
        print(f"  https://github.com/dmccreary/geometry-course")
        sys.exit(1)

    updater = RepoUpdater(owner, repo)
    updater.update()


if __name__ == "__main__":
    main()
