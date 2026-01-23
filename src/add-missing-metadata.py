#!/usr/bin/env python3
"""
Add Missing MicroSim Metadata

Scans local repositories for MicroSim directories missing metadata.json files,
analyzes the content to extract information, and either generates metadata.json
or creates a TODO.md file listing what needs to be fixed.

Usage:
    python src/add-missing-metadata.py                    # Scan all repos
    python src/add-missing-metadata.py geometry-course   # Scan specific repo
    python src/add-missing-metadata.py --list            # List repos with missing metadata
    python src/add-missing-metadata.py --dry-run         # Show what would be created

Output:
    - Creates metadata.json files where possible
    - Creates TODO.md files where manual intervention is needed
    - Logs activity to logs/add-metadata-YYYY-MM-DD.jsonl
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# Configuration
WORKSPACE_DIR = Path(os.environ.get("HOME")) / "Documents" / "ws"
GITHUB_OWNER = "dmccreary"

# Paths relative to script location
SCRIPT_DIR = Path(__file__).parent.parent
LOG_DIR = SCRIPT_DIR / "logs"

# Framework detection patterns
FRAMEWORK_PATTERNS = {
    "p5.js": [r"p5\.js", r"p5\.min\.js", r"setup\s*\(\s*\)", r"draw\s*\(\s*\)", r"createCanvas"],
    "d3.js": [r"d3\.js", r"d3\.min\.js", r"d3\.select", r"d3\.scale"],
    "three.js": [r"three\.js", r"three\.min\.js", r"THREE\."],
    "chart.js": [r"chart\.js", r"Chart\.min\.js", r"new\s+Chart"],
    "vis-network": [r"vis-network", r"vis\.Network", r"new\s+vis\.Network"],
    "plotly": [r"plotly", r"Plotly\.newPlot"],
    "leaflet": [r"leaflet", r"L\.map"],
    "mermaid": [r"mermaid", r"mermaid\.initialize"],
}

# Subject detection keywords
SUBJECT_KEYWORDS = {
    "Mathematics": ["math", "geometry", "algebra", "calculus", "trigonometry", "coordinate",
                   "equation", "graph", "function", "number", "fraction", "decimal"],
    "Physics": ["physics", "force", "velocity", "acceleration", "motion", "gravity",
               "wave", "energy", "momentum", "collision"],
    "Computer Science": ["algorithm", "sorting", "binary", "tree", "graph", "data structure",
                        "search", "recursion", "stack", "queue", "linked list"],
    "Chemistry": ["chemistry", "molecule", "atom", "element", "reaction", "bond", "periodic"],
    "Biology": ["biology", "cell", "dna", "evolution", "ecosystem", "organism", "genetics"],
    "Statistics": ["statistics", "probability", "distribution", "mean", "median", "variance",
                  "regression", "correlation", "histogram"],
    "Engineering": ["engineering", "circuit", "signal", "control", "robot", "mechanical"],
    "Economics": ["economics", "supply", "demand", "market", "price", "cost", "budget"],
}

# Visualization type detection
VISUALIZATION_KEYWORDS = {
    "animation": ["animate", "animation", "moving", "motion", "dynamic"],
    "simulation": ["simulation", "simulate", "model", "physics"],
    "chart": ["chart", "bar", "pie", "line chart", "histogram"],
    "graph": ["graph", "plot", "scatter", "curve"],
    "diagram": ["diagram", "flowchart", "schematic"],
    "interactive-demo": ["interactive", "demo", "explore", "slider"],
    "network": ["network", "node", "edge", "connection", "graph theory"],
    "timeline": ["timeline", "history", "chronolog"],
    "map": ["map", "geographic", "location", "coordinates"],
}


class MetadataGenerator:
    def __init__(self, workspace: Path = WORKSPACE_DIR, dry_run: bool = False):
        self.workspace = workspace
        self.dry_run = dry_run
        self.log_file = None
        self.stats = {
            "repos_scanned": 0,
            "sims_scanned": 0,
            "already_has_metadata": 0,
            "metadata_created": 0,
            "todo_created": 0,
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

        if event_type in ["error", "todo_created"]:
            print(f"  [{event_type}] {data.get('message', data)}")

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

    def get_sims_without_metadata(self, repo_path: Path) -> list[Path]:
        """Get list of sim directories without metadata.json."""
        sims_dir = repo_path / "docs" / "sims"
        if not sims_dir.exists():
            return []

        missing = []
        for item in sims_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                metadata_path = item / "metadata.json"
                if not metadata_path.exists():
                    missing.append(item)

        return sorted(missing, key=lambda p: p.name)

    def read_file_content(self, file_path: Path) -> str:
        """Read file content, return empty string if file doesn't exist."""
        if not file_path.exists():
            return ""
        try:
            return file_path.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            return ""

    def detect_framework(self, html_content: str, js_content: str) -> str:
        """Detect the JavaScript framework used."""
        combined = html_content + js_content

        for framework, patterns in FRAMEWORK_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, combined, re.IGNORECASE):
                    return framework

        return "vanilla-js"

    def detect_subject(self, content: str, sim_name: str) -> list[str]:
        """Detect subject areas from content and sim name."""
        subjects = []
        combined = (content + " " + sim_name.replace("-", " ")).lower()

        for subject, keywords in SUBJECT_KEYWORDS.items():
            for keyword in keywords:
                if keyword.lower() in combined:
                    if subject not in subjects:
                        subjects.append(subject)
                    break

        return subjects if subjects else ["Other"]

    def detect_visualization_type(self, content: str) -> list[str]:
        """Detect visualization types from content."""
        types = []
        content_lower = content.lower()

        for viz_type, keywords in VISUALIZATION_KEYWORDS.items():
            for keyword in keywords:
                if keyword in content_lower:
                    if viz_type not in types:
                        types.append(viz_type)
                    break

        return types if types else ["interactive-demo"]

    def extract_title_from_content(self, index_content: str, html_content: str, sim_name: str) -> str:
        """Extract title from index.md or HTML, or generate from sim name."""
        # Try index.md YAML frontmatter
        yaml_match = re.search(r'^---\s*\n.*?title:\s*["\']?([^"\'\n]+)["\']?\s*\n.*?---',
                               index_content, re.DOTALL | re.MULTILINE)
        if yaml_match:
            return yaml_match.group(1).strip()

        # Try index.md H1 header
        h1_match = re.search(r'^#\s+(.+)$', index_content, re.MULTILINE)
        if h1_match:
            return h1_match.group(1).strip()

        # Try HTML title
        title_match = re.search(r'<title>([^<]+)</title>', html_content, re.IGNORECASE)
        if title_match:
            title = title_match.group(1).strip()
            if title and title.lower() not in ['untitled', 'microsim', 'simulation']:
                return title

        # Generate from sim name
        return sim_name.replace("-", " ").title()

    def extract_description(self, index_content: str, html_content: str) -> str:
        """Extract description from content."""
        # Try index.md YAML frontmatter
        yaml_match = re.search(r'^---\s*\n.*?description:\s*["\']?([^"\'\n]+)["\']?\s*\n.*?---',
                               index_content, re.DOTALL | re.MULTILINE)
        if yaml_match:
            return yaml_match.group(1).strip()

        # Try meta description in HTML
        meta_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']',
                               html_content, re.IGNORECASE)
        if meta_match:
            return meta_match.group(1).strip()

        # Try first paragraph after H1 in index.md
        para_match = re.search(r'^#\s+.+\n\n(.+?)(?:\n\n|\n#|\Z)', index_content, re.MULTILINE)
        if para_match:
            desc = para_match.group(1).strip()
            if len(desc) > 20:
                return desc[:500]  # Truncate if too long

        return ""

    def analyze_sim_directory(self, sim_path: Path) -> dict:
        """Analyze a MicroSim directory and extract available information."""
        sim_name = sim_path.name

        # Read available files
        main_html = self.read_file_content(sim_path / "main.html")
        index_md = self.read_file_content(sim_path / "index.md")

        # Read any JS files
        js_content = ""
        for js_file in sim_path.glob("*.js"):
            js_content += self.read_file_content(js_file) + "\n"

        combined_content = main_html + index_md + js_content

        # Extract information
        info = {
            "sim_name": sim_name,
            "has_main_html": (sim_path / "main.html").exists(),
            "has_index_md": (sim_path / "index.md").exists(),
            "has_js_files": bool(list(sim_path.glob("*.js"))),
            "title": self.extract_title_from_content(index_md, main_html, sim_name),
            "description": self.extract_description(index_md, main_html),
            "framework": self.detect_framework(main_html, js_content),
            "subjects": self.detect_subject(combined_content, sim_name),
            "visualization_types": self.detect_visualization_type(combined_content),
        }

        return info

    def can_generate_metadata(self, info: dict) -> tuple[bool, list[str]]:
        """Check if we have enough information to generate metadata."""
        issues = []

        if not info["has_main_html"]:
            issues.append("Missing main.html file")

        if not info["title"] or info["title"] == info["sim_name"].replace("-", " ").title():
            issues.append("No meaningful title found (only generated from directory name)")

        if not info["description"]:
            issues.append("No description found")

        return len(issues) == 0, issues

    def generate_metadata(self, sim_path: Path, repo_name: str, info: dict) -> dict:
        """Generate metadata.json content."""
        sim_name = info["sim_name"]
        today = datetime.now().strftime("%Y-%m-%d")

        # Determine GitHub Pages URL
        github_pages_url = f"https://{GITHUB_OWNER}.github.io/{repo_name}/sims/{sim_name}/"

        metadata = {
            "title": info["title"],
            "description": info["description"] or f"Interactive MicroSim for exploring {info['title']}",
            "subject": info["subjects"][0] if info["subjects"] else "Other",
            "topic": info["title"],
            "gradeLevel": "6-12",
            "bloomsTaxonomy": ["Understand", "Apply"],
            "author": "Dan McCreary",
            "dateCreated": today,
            "dateModified": today,
            "version": "1.0.0",
            "license": "MIT",
            "language": "en",
            "format": "text/html",
            "type": "Interactive Simulation",
            "framework": info["framework"],
            "url": github_pages_url,
            "identifier": github_pages_url,
            "_source": {
                "repo": repo_name,
                "sim": sim_name,
                "github_url": f"https://github.com/{GITHUB_OWNER}/{repo_name}/tree/main/docs/sims/{sim_name}",
                "auto_generated": True,
                "generation_date": today
            }
        }

        # Add subjects if multiple detected
        if len(info["subjects"]) > 1:
            metadata["subjects"] = info["subjects"]

        # Add visualization types
        if info["visualization_types"]:
            metadata["visualizationType"] = info["visualization_types"]

        return metadata

    def generate_todo_content(self, sim_path: Path, repo_name: str, info: dict, issues: list[str]) -> str:
        """Generate TODO.md content for MicroSims that need manual work."""
        sim_name = info["sim_name"]
        today = datetime.now().strftime("%Y-%m-%d")

        content = f"""# TODO: Fix MicroSim Metadata

**MicroSim:** {sim_name}
**Repository:** {repo_name}
**Generated:** {today}

## Issues Found

The following issues prevented automatic metadata generation:

"""
        for i, issue in enumerate(issues, 1):
            content += f"{i}. {issue}\n"

        content += """
## Required Actions

### High Priority

- [ ] Create or fix `main.html` - the main simulation file
- [ ] Add a meaningful title that describes the simulation
- [ ] Write a clear description (2-3 sentences) explaining what the MicroSim does

### Medium Priority

- [ ] Create `index.md` with proper YAML frontmatter:
  ```yaml
  ---
  title: "Your Title Here"
  description: "Brief description for SEO"
  ---
  ```
- [ ] Add an iframe to display the simulation
- [ ] Add a "Run Fullscreen" button

### Low Priority

- [ ] Add a lesson plan section
- [ ] Add references section
- [ ] Create a screenshot for social media preview

## Detected Information

"""
        content += f"- **Framework:** {info['framework']}\n"
        content += f"- **Detected subjects:** {', '.join(info['subjects'])}\n"
        content += f"- **Visualization types:** {', '.join(info['visualization_types'])}\n"
        content += f"- **Has main.html:** {'Yes' if info['has_main_html'] else 'No'}\n"
        content += f"- **Has index.md:** {'Yes' if info['has_index_md'] else 'No'}\n"

        content += """
## After Fixing

Once you've addressed the issues above, run the metadata standardization:

```bash
# Use Claude Code's microsim-utils skill to standardize
# Or manually create metadata.json following the schema
```

Delete this TODO.md file after creating proper metadata.json.
"""

        return content

    def process_sim(self, sim_path: Path, repo_name: str):
        """Process a single MicroSim directory."""
        sim_name = sim_path.name
        metadata_path = sim_path / "metadata.json"
        todo_path = sim_path / "TODO.md"

        # Skip if metadata already exists
        if metadata_path.exists():
            self.stats["already_has_metadata"] += 1
            return

        self.stats["sims_scanned"] += 1

        # Analyze the directory
        info = self.analyze_sim_directory(sim_path)

        # Check if we can generate metadata
        can_generate, issues = self.can_generate_metadata(info)

        if can_generate:
            # Generate and write metadata
            metadata = self.generate_metadata(sim_path, repo_name, info)

            if self.dry_run:
                print(f"    [dry-run] Would create metadata.json for {sim_name}")
                print(f"              Title: {metadata['title']}")
            else:
                with open(metadata_path, 'w') as f:
                    json.dump(metadata, f, indent=2)
                print(f"    + Created metadata.json for {sim_name}")

                self.log("metadata_created", {
                    "repo": repo_name,
                    "sim": sim_name,
                    "title": metadata["title"]
                })

            self.stats["metadata_created"] += 1
        else:
            # Create TODO.md with issues
            todo_content = self.generate_todo_content(sim_path, repo_name, info, issues)

            if self.dry_run:
                print(f"    [dry-run] Would create TODO.md for {sim_name}")
                print(f"              Issues: {', '.join(issues)}")
            else:
                with open(todo_path, 'w') as f:
                    f.write(todo_content)
                print(f"    - Created TODO.md for {sim_name} (needs manual work)")

                self.log("todo_created", {
                    "repo": repo_name,
                    "sim": sim_name,
                    "issues": issues,
                    "message": f"Created TODO.md: {', '.join(issues)}"
                })

            self.stats["todo_created"] += 1

    def process_repo(self, repo_path: Path):
        """Process a single repository."""
        repo_name = repo_path.name
        print(f"\nProcessing {repo_name}...")

        missing = self.get_sims_without_metadata(repo_path)
        if not missing:
            print(f"  All sims have metadata.json")
            return

        print(f"  Found {len(missing)} sims without metadata")
        self.stats["repos_scanned"] += 1

        for sim_path in missing:
            self.process_sim(sim_path, repo_name)

    def list_missing_metadata(self, repo_names: list[str] | None = None):
        """List all repos and sims missing metadata."""
        print("MicroSims Missing metadata.json")
        print("=" * 50)

        if repo_names:
            repos = [self.workspace / name for name in repo_names if (self.workspace / name).exists()]
        else:
            repos = self.find_local_repos()

        total_missing = 0
        for repo_path in repos:
            missing = self.get_sims_without_metadata(repo_path)
            if missing:
                print(f"\n{repo_path.name} ({len(missing)} missing):")
                for sim_path in missing:
                    info = self.analyze_sim_directory(sim_path)
                    status = "✓ can generate" if self.can_generate_metadata(info)[0] else "✗ needs TODO"
                    print(f"  - {sim_path.name} [{status}]")
                total_missing += len(missing)

        print(f"\n{'=' * 50}")
        print(f"Total: {total_missing} MicroSims missing metadata.json")

    def run(self, repo_names: list[str] | None = None):
        """Main execution logic."""
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_filename = f"add-metadata-{datetime.now().strftime('%Y-%m-%d')}.jsonl"
        log_path = LOG_DIR / log_filename

        print("Add Missing MicroSim Metadata")
        print(f"Workspace: {self.workspace}")
        if self.dry_run:
            print("Mode: DRY RUN (no files will be created)")
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

            print(f"\nFound {len(repos)} repositories with docs/sims")

            # Process each repo
            for repo_path in repos:
                self.process_repo(repo_path)

            self.log("run_completed", self.stats)

        # Print summary
        print()
        print("=" * 50)
        print("SUMMARY")
        print("=" * 50)
        print(f"Repos processed:        {self.stats['repos_scanned']}")
        print(f"Sims scanned:           {self.stats['sims_scanned']}")
        print(f"Already had metadata:   {self.stats['already_has_metadata']}")
        print(f"Metadata created:       {self.stats['metadata_created']}")
        print(f"TODO.md created:        {self.stats['todo_created']}")
        print(f"Errors:                 {self.stats['errors']}")


def main():
    parser = argparse.ArgumentParser(
        description="Add missing metadata.json to MicroSim directories",
        epilog="Examples:\n"
               "  python src/add-missing-metadata.py                  # Process all repos\n"
               "  python src/add-missing-metadata.py geometry-course  # Process specific repo\n"
               "  python src/add-missing-metadata.py --list           # List missing metadata\n"
               "  python src/add-missing-metadata.py --dry-run        # Preview changes",
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
        help="List repositories and sims missing metadata, then exit"
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Show what would be created without actually creating files"
    )
    parser.add_argument(
        "--workspace", "-w",
        type=Path,
        default=WORKSPACE_DIR,
        help=f"Workspace directory containing repos (default: {WORKSPACE_DIR})"
    )

    args = parser.parse_args()

    generator = MetadataGenerator(args.workspace, dry_run=args.dry_run)

    if args.list:
        generator.list_missing_metadata(args.repos if args.repos else None)
    else:
        generator.run(args.repos if args.repos else None)


if __name__ == "__main__":
    main()
