#!/usr/bin/env python3
"""
Enrich MicroSim Metadata

Scans existing metadata.json files and adds missing fields like
learningObjectives and visualizationType based on content analysis.

Usage:
    python src/enrich-metadata.py                    # Enrich all repos
    python src/enrich-metadata.py geometry-course   # Enrich specific repo
    python src/enrich-metadata.py --dry-run         # Show what would change
    python src/enrich-metadata.py --report          # Report missing fields only

Output:
    - Updates metadata.json files with enriched fields
    - Logs activity to logs/enrich-metadata-YYYY-MM-DD.jsonl
"""

import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORKSPACE_DIR = Path(os.environ.get("HOME")) / "Documents" / "ws"
GITHUB_OWNER = "dmccreary"

# Paths relative to script location
SCRIPT_DIR = Path(__file__).parent.parent
LOG_DIR = SCRIPT_DIR / "logs"

# Learning objectives templates by subject
LEARNING_OBJECTIVES_TEMPLATES = {
    "Mathematics": [
        "Understand the mathematical concept of {topic}",
        "Apply {topic} to solve problems",
        "Visualize and interpret {topic} relationships",
    ],
    "Physics": [
        "Observe and understand {topic} in action",
        "Explore how changing parameters affects {topic}",
        "Apply physics principles to predict {topic} behavior",
    ],
    "Computer Science": [
        "Understand how {topic} algorithms work",
        "Visualize {topic} data structures and operations",
        "Analyze the efficiency and behavior of {topic}",
    ],
    "Chemistry": [
        "Visualize {topic} at the molecular level",
        "Understand the relationships in {topic}",
        "Explore how variables affect {topic}",
    ],
    "Biology": [
        "Observe {topic} processes in action",
        "Understand the mechanisms of {topic}",
        "Explore relationships within {topic}",
    ],
    "Statistics": [
        "Understand {topic} concepts through visualization",
        "Apply {topic} to analyze data",
        "Interpret {topic} results and patterns",
    ],
    "Engineering": [
        "Understand {topic} principles and applications",
        "Design and test {topic} configurations",
        "Analyze {topic} performance under different conditions",
    ],
    "Economics": [
        "Understand {topic} economic concepts",
        "Analyze how variables affect {topic}",
        "Apply {topic} principles to real-world scenarios",
    ],
    "default": [
        "Understand the key concepts of {topic}",
        "Explore {topic} through interactive visualization",
        "Apply knowledge of {topic} to solve problems",
    ],
}

# Visualization type detection patterns
VISUALIZATION_PATTERNS = {
    "animation": [
        r"animate", r"animation", r"moving", r"motion", r"dynamic", r"frameRate",
        r"requestAnimationFrame", r"setInterval.*draw", r"velocity", r"speed"
    ],
    "simulation": [
        r"simulat", r"physic", r"model", r"particle", r"force", r"gravity",
        r"collision", r"pendulum", r"projectile", r"orbit"
    ],
    "chart": [
        r"chart\.js", r"Chart\(", r"bar\s*chart", r"pie\s*chart", r"line\s*chart",
        r"histogram", r"bargraph", r"piechart"
    ],
    "graph": [
        r"plot", r"scatter", r"curve", r"axis", r"coordinate", r"graphing",
        r"x-axis", r"y-axis", r"function.*graph"
    ],
    "diagram": [
        r"diagram", r"flowchart", r"schematic", r"venn", r"tree.*structure",
        r"hierarchy", r"org.*chart"
    ],
    "interactive-demo": [
        r"slider", r"interactive", r"demo", r"explore", r"playground",
        r"createSlider", r"input.*range", r"controlP5"
    ],
    "network": [
        r"network", r"vis-network", r"node.*edge", r"graph.*theory",
        r"connection", r"vertex", r"vertices", r"adjacen"
    ],
    "timeline": [
        r"timeline", r"chronolog", r"history", r"vis-timeline", r"temporal"
    ],
    "map": [
        r"leaflet", r"map", r"geographic", r"location", r"latitude", r"longitude",
        r"L\.map", r"tile.*layer", r"marker"
    ],
    "3d-model": [
        r"three\.js", r"THREE\.", r"WebGL", r"3[dD]", r"rotate.*3", r"perspective"
    ],
    "data-visualization": [
        r"d3\.js", r"D3\.", r"data.*viz", r"infographic", r"dashboard"
    ],
}

# Bloom's taxonomy keyword mapping
BLOOMS_KEYWORDS = {
    "Remember": ["identify", "list", "name", "recall", "recognize", "state", "define"],
    "Understand": ["explain", "describe", "interpret", "summarize", "classify", "compare", "understand"],
    "Apply": ["apply", "demonstrate", "calculate", "solve", "use", "implement", "execute"],
    "Analyze": ["analyze", "differentiate", "examine", "compare", "contrast", "investigate"],
    "Evaluate": ["evaluate", "assess", "judge", "critique", "justify", "defend"],
    "Create": ["create", "design", "construct", "develop", "formulate", "generate"],
}


class MetadataEnricher:
    def __init__(self, workspace: Path = WORKSPACE_DIR, dry_run: bool = False):
        self.workspace = workspace
        self.dry_run = dry_run
        self.log_file = None
        self.stats = {
            "repos_scanned": 0,
            "files_scanned": 0,
            "files_updated": 0,
            "learning_objectives_added": 0,
            "visualization_type_added": 0,
            "already_complete": 0,
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

    def find_metadata_files(self, repo_path: Path) -> list[Path]:
        """Find all metadata.json files in a repo's sims directory."""
        sims_dir = repo_path / "docs" / "sims"
        if not sims_dir.exists():
            return []

        return sorted(sims_dir.glob("*/metadata.json"))

    def read_sim_content(self, sim_dir: Path) -> str:
        """Read all relevant content from a MicroSim directory."""
        content = ""

        # Read main.html
        main_html = sim_dir / "main.html"
        if main_html.exists():
            try:
                content += main_html.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                pass

        # Read index.md
        index_md = sim_dir / "index.md"
        if index_md.exists():
            try:
                content += index_md.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                pass

        # Read JS files
        for js_file in sim_dir.glob("*.js"):
            try:
                content += js_file.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                pass

        return content

    def detect_visualization_types(self, content: str, metadata: dict) -> list[str]:
        """Detect visualization types from content."""
        types = set()
        content_lower = content.lower()

        # Check each pattern
        for viz_type, patterns in VISUALIZATION_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    types.add(viz_type)
                    break

        # Also consider framework hints
        framework = metadata.get("framework", "")
        if framework == "vis-network":
            types.add("network")
        elif framework == "chart.js":
            types.add("chart")
        elif framework == "three.js":
            types.add("3d-model")
        elif framework == "leaflet":
            types.add("map")
        elif framework == "mermaid":
            types.add("diagram")
        elif framework == "vis-timeline":
            types.add("timeline")

        # Default to interactive-demo if nothing else detected
        if not types:
            types.add("interactive-demo")

        return sorted(list(types))

    def generate_learning_objectives(self, metadata: dict, content: str) -> list[str]:
        """Generate learning objectives based on metadata and content."""
        # Get subject and topic
        subject = metadata.get("subject", "Other")
        if isinstance(subject, list):
            subject = subject[0] if subject else "Other"

        topic = metadata.get("topic", metadata.get("title", "this concept"))

        # Clean up topic
        if isinstance(topic, list):
            topic = topic[0] if topic else "this concept"
        topic = topic.lower().replace("microsim", "").replace("simulation", "").strip()
        if not topic:
            topic = "this concept"

        # Get templates for subject
        templates = LEARNING_OBJECTIVES_TEMPLATES.get(
            subject, LEARNING_OBJECTIVES_TEMPLATES["default"]
        )

        # Generate objectives
        objectives = []
        for template in templates:
            objective = template.format(topic=topic)
            # Capitalize first letter
            objective = objective[0].upper() + objective[1:]
            objectives.append(objective)

        # Check content for additional specific objectives
        content_lower = content.lower()

        # Add specific objectives based on content patterns
        if re.search(r"slider|parameter|adjust|change.*value", content_lower):
            objectives.append(f"Experiment with parameters to observe their effects on {topic}")

        if re.search(r"quiz|question|test|assess", content_lower):
            objectives.append(f"Test understanding of {topic} through interactive exercises")

        return objectives[:4]  # Limit to 4 objectives

    def infer_blooms_taxonomy(self, content: str, metadata: dict) -> list[str]:
        """Infer Bloom's taxonomy levels from content."""
        levels = set()
        content_lower = content.lower()

        # Check for keywords
        for level, keywords in BLOOMS_KEYWORDS.items():
            for keyword in keywords:
                if keyword in content_lower:
                    levels.add(level)
                    break

        # Default levels if nothing detected
        if not levels:
            levels = {"Understand", "Apply"}

        # Ensure reasonable defaults based on interactivity
        if re.search(r"slider|input|click|drag", content_lower):
            levels.add("Apply")

        return sorted(list(levels), key=lambda x: list(BLOOMS_KEYWORDS.keys()).index(x))

    def needs_enrichment(self, metadata: dict) -> dict:
        """Check what fields need to be added."""
        missing = {}

        # Check learningObjectives
        if "learningObjectives" not in metadata or not metadata["learningObjectives"]:
            missing["learningObjectives"] = True

        # Check visualizationType
        if "visualizationType" not in metadata or not metadata["visualizationType"]:
            missing["visualizationType"] = True

        # Check bloomsTaxonomy (bonus)
        if "bloomsTaxonomy" not in metadata or not metadata["bloomsTaxonomy"]:
            missing["bloomsTaxonomy"] = True

        return missing

    def enrich_metadata(self, metadata_path: Path) -> bool:
        """Enrich a single metadata.json file. Returns True if updated."""
        sim_dir = metadata_path.parent
        sim_name = sim_dir.name
        repo_name = sim_dir.parent.parent.parent.name

        try:
            with open(metadata_path) as f:
                metadata = json.load(f)
        except json.JSONDecodeError as e:
            print(f"    Error reading {sim_name}/metadata.json: {e}")
            self.stats["errors"] += 1
            return False

        # Check what's missing
        missing = self.needs_enrichment(metadata)

        if not missing:
            self.stats["already_complete"] += 1
            return False

        # Read content for analysis
        content = self.read_sim_content(sim_dir)

        updated = False
        changes = []

        # Add visualizationType
        if missing.get("visualizationType"):
            viz_types = self.detect_visualization_types(content, metadata)
            metadata["visualizationType"] = viz_types
            changes.append(f"visualizationType: {viz_types}")
            self.stats["visualization_type_added"] += 1
            updated = True

        # Add learningObjectives
        if missing.get("learningObjectives"):
            objectives = self.generate_learning_objectives(metadata, content)
            metadata["learningObjectives"] = objectives
            changes.append(f"learningObjectives: {len(objectives)} items")
            self.stats["learning_objectives_added"] += 1
            updated = True

        # Add bloomsTaxonomy if missing (bonus enrichment)
        if missing.get("bloomsTaxonomy"):
            blooms = self.infer_blooms_taxonomy(content, metadata)
            metadata["bloomsTaxonomy"] = blooms
            changes.append(f"bloomsTaxonomy: {blooms}")
            updated = True

        if updated:
            if self.dry_run:
                print(f"    [dry-run] Would update {sim_name}: {', '.join(changes)}")
            else:
                with open(metadata_path, 'w') as f:
                    json.dump(metadata, f, indent=2)
                print(f"    + Updated {sim_name}: {', '.join(changes)}")

                self.log("metadata_enriched", {
                    "repo": repo_name,
                    "sim": sim_name,
                    "changes": changes
                })

            self.stats["files_updated"] += 1

        return updated

    def process_repo(self, repo_path: Path):
        """Process all metadata files in a repository."""
        repo_name = repo_path.name
        print(f"\nProcessing {repo_name}...")

        metadata_files = self.find_metadata_files(repo_path)
        if not metadata_files:
            print(f"  No metadata.json files found")
            return

        self.stats["repos_scanned"] += 1
        print(f"  Found {len(metadata_files)} metadata.json files")

        for metadata_path in metadata_files:
            self.stats["files_scanned"] += 1
            self.enrich_metadata(metadata_path)

    def generate_report(self, repo_names: list[str] | None = None):
        """Generate a report of what needs enrichment."""
        print("MicroSim Metadata Enrichment Report")
        print("=" * 60)

        if repo_names:
            repos = [self.workspace / name for name in repo_names if (self.workspace / name).exists()]
        else:
            repos = self.find_local_repos()

        missing_viz = []
        missing_obj = []
        complete = []

        for repo_path in repos:
            metadata_files = self.find_metadata_files(repo_path)
            for metadata_path in metadata_files:
                try:
                    with open(metadata_path) as f:
                        metadata = json.load(f)
                except:
                    continue

                sim_name = metadata_path.parent.name
                repo_name = repo_path.name
                identifier = f"{repo_name}/{sim_name}"

                needs = self.needs_enrichment(metadata)

                if needs.get("visualizationType"):
                    missing_viz.append(identifier)
                if needs.get("learningObjectives"):
                    missing_obj.append(identifier)
                if not needs:
                    complete.append(identifier)

        print(f"\nSummary:")
        print(f"  Complete: {len(complete)}")
        print(f"  Missing visualizationType: {len(missing_viz)}")
        print(f"  Missing learningObjectives: {len(missing_obj)}")

        if missing_viz:
            print(f"\nMissing visualizationType ({len(missing_viz)}):")
            for item in missing_viz[:20]:
                print(f"  - {item}")
            if len(missing_viz) > 20:
                print(f"  ... and {len(missing_viz) - 20} more")

        if missing_obj:
            print(f"\nMissing learningObjectives ({len(missing_obj)}):")
            for item in missing_obj[:20]:
                print(f"  - {item}")
            if len(missing_obj) > 20:
                print(f"  ... and {len(missing_obj) - 20} more")

    def run(self, repo_names: list[str] | None = None):
        """Main execution logic."""
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_filename = f"enrich-metadata-{datetime.now().strftime('%Y-%m-%d')}.jsonl"
        log_path = LOG_DIR / log_filename

        print("Enrich MicroSim Metadata")
        print(f"Workspace: {self.workspace}")
        if self.dry_run:
            print("Mode: DRY RUN (no files will be modified)")
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
        print("=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Repos scanned:              {self.stats['repos_scanned']}")
        print(f"Files scanned:              {self.stats['files_scanned']}")
        print(f"Files updated:              {self.stats['files_updated']}")
        print(f"visualizationType added:    {self.stats['visualization_type_added']}")
        print(f"learningObjectives added:   {self.stats['learning_objectives_added']}")
        print(f"Already complete:           {self.stats['already_complete']}")
        print(f"Errors:                     {self.stats['errors']}")


def main():
    parser = argparse.ArgumentParser(
        description="Enrich existing metadata.json files with missing fields",
        epilog="Examples:\n"
               "  python src/enrich-metadata.py                    # Enrich all repos\n"
               "  python src/enrich-metadata.py geometry-course    # Enrich specific repo\n"
               "  python src/enrich-metadata.py --dry-run          # Preview changes\n"
               "  python src/enrich-metadata.py --report           # Report only",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "repos",
        nargs="*",
        help="Repository names to process (default: all repos with docs/sims)"
    )
    parser.add_argument(
        "--report", "-r",
        action="store_true",
        help="Generate report of missing fields without making changes"
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Show what would be changed without actually modifying files"
    )
    parser.add_argument(
        "--workspace", "-w",
        type=Path,
        default=WORKSPACE_DIR,
        help=f"Workspace directory containing repos (default: {WORKSPACE_DIR})"
    )

    args = parser.parse_args()

    enricher = MetadataEnricher(args.workspace, dry_run=args.dry_run)

    if args.report:
        enricher.generate_report(args.repos if args.repos else None)
    else:
        enricher.run(args.repos if args.repos else None)


if __name__ == "__main__":
    main()
