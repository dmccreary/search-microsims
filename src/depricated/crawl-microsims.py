#!/usr/bin/env python3
"""
MicroSim Metadata Crawler

Crawls GitHub repos matching dmccreary/*/docs/sims pattern,
collects metadata.json files, and logs missing metadata.

Usage:
    python src/crawl-microsims.py

Output:
    - docs/search/microsims-data.json: Combined metadata for all MicroSims
    - logs/microsim-crawl-YYYY-MM-DD.jsonl: Log of crawl activity
"""

import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

import requests

# Configuration
GITHUB_USER = "dmccreary"
GITHUB_API = "https://api.github.com"
RAW_CONTENT_BASE = "https://raw.githubusercontent.com"

# Rate limiting
REQUEST_DELAY = 0.5  # seconds between requests to avoid rate limits

# Output paths
SCRIPT_DIR = Path(__file__).parent.parent
OUTPUT_JSON = SCRIPT_DIR / "docs" / "search" / "microsims-data.json"
LOG_DIR = SCRIPT_DIR / "logs"


class MicroSimCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "MicroSim-Crawler/1.0"
        })

        # Check for GitHub token in environment
        github_token = os.environ.get("GITHUB_TOKEN")
        if github_token:
            self.session.headers["Authorization"] = f"token {github_token}"
            print("Using GitHub token for authentication")
        else:
            print("Warning: No GITHUB_TOKEN set. Rate limits will be lower (60 req/hr)")

        self.log_file = None
        self.all_metadata = []
        self.stats = {
            "repos_checked": 0,
            "repos_with_sims": 0,
            "sims_found": 0,
            "metadata_found": 0,
            "metadata_missing": 0,
            "errors": 0
        }

    def log(self, event_type: str, data: dict):
        """Write a log entry in JSONL format."""
        entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "event": event_type,
            **data
        }
        if self.log_file:
            self.log_file.write(json.dumps(entry) + "\n")
            self.log_file.flush()

        # Also print important events
        if event_type in ["error", "missing_metadata", "repo_found"]:
            print(f"  [{event_type}] {data}")

    def get_user_repos(self) -> list:
        """Get all public repos for the user."""
        repos = []
        page = 1
        per_page = 100

        while True:
            url = f"{GITHUB_API}/users/{GITHUB_USER}/repos"
            params = {"page": page, "per_page": per_page, "type": "public"}

            response = self.session.get(url, params=params)

            if response.status_code == 403:
                print("Rate limited! Consider setting GITHUB_TOKEN environment variable.")
                self.log("error", {"message": "Rate limited", "url": url})
                break

            if response.status_code != 200:
                self.log("error", {"message": f"API error {response.status_code}", "url": url})
                break

            data = response.json()
            if not data:
                break

            repos.extend(data)
            page += 1
            time.sleep(REQUEST_DELAY)

        return repos

    def check_sims_directory(self, repo_name: str) -> list:
        """Check if repo has docs/sims directory and return list of sim directories."""
        url = f"{GITHUB_API}/repos/{GITHUB_USER}/{repo_name}/contents/docs/sims"

        response = self.session.get(url)
        time.sleep(REQUEST_DELAY)

        if response.status_code == 404:
            return []

        if response.status_code != 200:
            self.log("error", {
                "repo": repo_name,
                "message": f"API error {response.status_code}",
                "url": url
            })
            return []

        contents = response.json()

        # Filter to directories only
        sim_dirs = [
            item["name"] for item in contents
            if item["type"] == "dir"
        ]

        return sim_dirs

    def fetch_metadata(self, repo_name: str, sim_name: str) -> dict | None:
        """Fetch metadata.json for a specific MicroSim."""
        url = f"{RAW_CONTENT_BASE}/{GITHUB_USER}/{repo_name}/main/docs/sims/{sim_name}/metadata.json"

        response = self.session.get(url)
        time.sleep(REQUEST_DELAY)

        if response.status_code == 404:
            return None

        if response.status_code != 200:
            self.log("error", {
                "repo": repo_name,
                "sim": sim_name,
                "message": f"HTTP error {response.status_code}",
                "url": url
            })
            self.stats["errors"] += 1
            return None

        try:
            metadata = response.json()
            return metadata
        except json.JSONDecodeError as e:
            self.log("error", {
                "repo": repo_name,
                "sim": sim_name,
                "message": f"Invalid JSON: {e}"
            })
            self.stats["errors"] += 1
            return None

    def crawl(self):
        """Main crawl logic."""
        # Setup log file
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_filename = f"microsim-crawl-{datetime.now().strftime('%Y-%m-%d')}.jsonl"
        log_path = LOG_DIR / log_filename

        print(f"Starting crawl...")
        print(f"Log file: {log_path}")
        print(f"Output: {OUTPUT_JSON}")
        print()

        with open(log_path, "a") as self.log_file:
            self.log("crawl_started", {"user": GITHUB_USER})

            # Get all repos
            print(f"Fetching repos for {GITHUB_USER}...")
            repos = self.get_user_repos()
            print(f"Found {len(repos)} repos")
            self.log("repos_fetched", {"count": len(repos)})

            # Check each repo for docs/sims
            for repo in repos:
                repo_name = repo["name"]
                self.stats["repos_checked"] += 1

                sim_dirs = self.check_sims_directory(repo_name)

                if not sim_dirs:
                    continue

                self.stats["repos_with_sims"] += 1
                print(f"\n{repo_name}: {len(sim_dirs)} sims")
                self.log("repo_found", {
                    "repo": repo_name,
                    "sim_count": len(sim_dirs),
                    "url": repo["html_url"]
                })

                # Fetch metadata for each sim
                for sim_name in sim_dirs:
                    self.stats["sims_found"] += 1

                    metadata = self.fetch_metadata(repo_name, sim_name)

                    if metadata:
                        self.stats["metadata_found"] += 1

                        # Add source info
                        metadata["_source"] = {
                            "repo": repo_name,
                            "sim": sim_name,
                            "github_url": f"https://github.com/{GITHUB_USER}/{repo_name}/tree/main/docs/sims/{sim_name}"
                        }

                        # Ensure URL is set
                        if "identifier" in metadata and not metadata.get("url"):
                            metadata["url"] = metadata["identifier"]
                        elif not metadata.get("url"):
                            metadata["url"] = f"https://{GITHUB_USER}.github.io/{repo_name}/sims/{sim_name}/"

                        self.all_metadata.append(metadata)
                        print(f"  + {sim_name}")

                        self.log("metadata_found", {
                            "repo": repo_name,
                            "sim": sim_name,
                            "title": metadata.get("title", "Unknown")
                        })
                    else:
                        self.stats["metadata_missing"] += 1
                        print(f"  - {sim_name} (no metadata)")

                        self.log("missing_metadata", {
                            "repo": repo_name,
                            "sim": sim_name,
                            "github_url": f"https://github.com/{GITHUB_USER}/{repo_name}/tree/main/docs/sims/{sim_name}"
                        })

            # Write combined output
            OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

            # Add IDs to each entry
            for i, item in enumerate(self.all_metadata, 1):
                item["id"] = i

            with open(OUTPUT_JSON, "w") as f:
                json.dump(self.all_metadata, f, indent=2)

            self.log("crawl_completed", self.stats)

        # Print summary
        print("\n" + "=" * 50)
        print("CRAWL COMPLETE")
        print("=" * 50)
        print(f"Repos checked:     {self.stats['repos_checked']}")
        print(f"Repos with sims:   {self.stats['repos_with_sims']}")
        print(f"Sims found:        {self.stats['sims_found']}")
        print(f"Metadata found:    {self.stats['metadata_found']}")
        print(f"Metadata missing:  {self.stats['metadata_missing']}")
        print(f"Errors:            {self.stats['errors']}")
        print()
        print(f"Output written to: {OUTPUT_JSON}")
        print(f"Log written to:    {log_path}")


def main():
    crawler = MicroSimCrawler()
    crawler.crawl()


if __name__ == "__main__":
    main()
