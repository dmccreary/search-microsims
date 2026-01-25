#!/usr/bin/env python3
"""
Commit and Push Enriched Metadata

Finds repositories with uncommitted metadata.json changes and commits/pushes them to GitHub.

Usage:
    python src/enrich-metadata/commit-enrichments.py                # Commit all changes
    python src/enrich-metadata/commit-enrichments.py --dry-run      # Preview what would be committed
    python src/enrich-metadata/commit-enrichments.py geometry-course # Commit specific repo only

Output:
    - Commits and pushes metadata.json changes to GitHub
    - Logs activity to logs/commit-enrichments-YYYY-MM-DD.jsonl
"""

import argparse
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORKSPACE_DIR = Path(os.environ.get("HOME")) / "Documents" / "ws"
COMMIT_MESSAGE = "Added pedagogical metadata to MicroSim metadata.json files"

# Paths relative to script location
SCRIPT_DIR = Path(__file__).parent.parent.parent
LOG_DIR = SCRIPT_DIR / "logs"


class MetadataCommitter:
    def __init__(self, workspace: Path = WORKSPACE_DIR, dry_run: bool = False):
        self.workspace = workspace
        self.dry_run = dry_run
        self.log_file = None
        self.stats = {
            "repos_scanned": 0,
            "repos_with_changes": 0,
            "files_committed": 0,
            "repos_pushed": 0,
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

    def run_git(self, repo_path: Path, *args) -> tuple[int, str, str]:
        """Run a git command in the specified repo directory."""
        try:
            result = subprocess.run(
                ["git"] + list(args),
                cwd=repo_path,
                capture_output=True,
                text=True,
                timeout=60
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", "Command timed out"
        except Exception as e:
            return -1, "", str(e)

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

    def get_changed_metadata_files(self, repo_path: Path) -> list[str]:
        """Get list of modified metadata.json files in the repo."""
        # Check for both staged and unstaged changes
        returncode, stdout, stderr = self.run_git(repo_path, "status", "--porcelain")

        if returncode != 0:
            return []

        changed_files = []
        for line in stdout.strip().split('\n'):
            if not line:
                continue
            # Status is first two chars, then space, then filename
            status = line[:2]
            filename = line[3:]

            # Look for metadata.json files that are modified or added
            if filename.endswith('metadata.json') and 'docs/sims/' in filename:
                if status.strip() in ['M', 'A', 'MM', 'AM', '??']:
                    changed_files.append(filename)

        return changed_files

    def commit_and_push(self, repo_path: Path, changed_files: list[str]) -> bool:
        """Stage, commit, and push the changed metadata files."""
        repo_name = repo_path.name

        # Stage the metadata files
        for filepath in changed_files:
            returncode, _, stderr = self.run_git(repo_path, "add", filepath)
            if returncode != 0:
                print(f"    Error staging {filepath}: {stderr}")
                self.stats["errors"] += 1
                return False

        # Check if there's anything to commit (files might already be staged)
        returncode, stdout, _ = self.run_git(repo_path, "diff", "--cached", "--name-only")
        if not stdout.strip():
            print(f"    No changes to commit (already committed?)")
            return False

        # Commit
        returncode, stdout, stderr = self.run_git(repo_path, "commit", "-m", COMMIT_MESSAGE)
        if returncode != 0:
            if "nothing to commit" in stderr or "nothing to commit" in stdout:
                print(f"    No changes to commit")
                return False
            print(f"    Error committing: {stderr}")
            self.stats["errors"] += 1
            return False

        print(f"    Committed {len(changed_files)} file(s)")
        self.stats["files_committed"] += len(changed_files)

        # Push
        returncode, stdout, stderr = self.run_git(repo_path, "push")
        if returncode != 0:
            print(f"    Error pushing: {stderr}")
            self.stats["errors"] += 1
            self.log("push_error", {
                "repo": repo_name,
                "error": stderr
            })
            return False

        print(f"    Pushed to origin")
        self.stats["repos_pushed"] += 1

        self.log("repo_pushed", {
            "repo": repo_name,
            "files": changed_files
        })

        return True

    def process_repo(self, repo_path: Path) -> bool:
        """Process a single repository. Returns True if changes were pushed."""
        repo_name = repo_path.name
        self.stats["repos_scanned"] += 1

        # Check for changed metadata files
        changed_files = self.get_changed_metadata_files(repo_path)

        if not changed_files:
            return False

        self.stats["repos_with_changes"] += 1
        print(f"\n{repo_name}:")
        print(f"  Changed metadata files: {len(changed_files)}")

        for f in changed_files:
            print(f"    - {f}")

        if self.dry_run:
            print(f"  [dry-run] Would commit and push {len(changed_files)} file(s)")
            return False

        return self.commit_and_push(repo_path, changed_files)

    def run(self, repo_names: list[str] | None = None):
        """Main execution logic."""
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_filename = f"commit-enrichments-{datetime.now().strftime('%Y-%m-%d')}.jsonl"
        log_path = LOG_DIR / log_filename

        print("Commit and Push Enriched Metadata")
        print(f"Workspace: {self.workspace}")
        if self.dry_run:
            print("Mode: DRY RUN (no commits will be made)")
        print(f"Log file: {log_path}")

        with open(log_path, "a") as self.log_file:
            self.log("run_started", {
                "workspace": str(self.workspace),
                "dry_run": self.dry_run
            })

            # Find repos to process
            if repo_names:
                repos = []
                for name in repo_names:
                    repo_path = self.workspace / name
                    if repo_path.exists():
                        repos.append(repo_path)
                    else:
                        print(f"Warning: Repo not found: {name}")
            else:
                repos = self.find_local_repos()

            if not repos:
                print("\nNo repositories found to process.")
                return

            print(f"\nScanning {len(repos)} repositories...")

            # Process each repo
            for repo_path in repos:
                self.process_repo(repo_path)

            self.log("run_completed", self.stats)

        # Print summary
        print()
        print("=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Repos scanned:        {self.stats['repos_scanned']}")
        print(f"Repos with changes:   {self.stats['repos_with_changes']}")
        print(f"Files committed:      {self.stats['files_committed']}")
        print(f"Repos pushed:         {self.stats['repos_pushed']}")
        print(f"Errors:               {self.stats['errors']}")


def main():
    parser = argparse.ArgumentParser(
        description="Commit and push enriched metadata.json files to GitHub",
        epilog="Examples:\n"
               "  python src/enrich-metadata/commit-enrichments.py                # Commit all\n"
               "  python src/enrich-metadata/commit-enrichments.py --dry-run      # Preview\n"
               "  python src/enrich-metadata/commit-enrichments.py geometry-course # Specific repo",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "repos",
        nargs="*",
        help="Repository names to process (default: all repos with docs/sims)"
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Show what would be committed without actually committing"
    )
    parser.add_argument(
        "--workspace", "-w",
        type=Path,
        default=WORKSPACE_DIR,
        help=f"Workspace directory containing repos (default: {WORKSPACE_DIR})"
    )

    args = parser.parse_args()

    committer = MetadataCommitter(args.workspace, dry_run=args.dry_run)
    committer.run(args.repos if args.repos else None)


if __name__ == "__main__":
    main()
