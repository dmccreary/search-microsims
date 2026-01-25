#!/usr/bin/env python3
"""
Enrich MicroSim Metadata with Pedagogical Classification

Scans existing metadata.json files and adds pedagogical fields for
template matching and instructional alignment:
  - pattern: worked-example, exploration, practice, assessment, etc.
  - bloomAlignment: which Bloom's levels the interaction supports
  - bloomVerbs: specific action verbs (demonstrate, calculate, predict, etc.)
  - pacing: self-paced, continuous, timed, step-through
  - supportsPrediction: whether students can make predictions
  - dataVisibility: how much data/calculations are shown
  - feedbackType: types of feedback provided
  - interactionStyle: primary interaction mode

Usage:
    python src/enrich-metadata/enrich-pedagogical.py                 # Enrich all repos
    python src/enrich-metadata/enrich-pedagogical.py geometry-course # Specific repo
    python src/enrich-metadata/enrich-pedagogical.py --dry-run       # Preview changes
    python src/enrich-metadata/enrich-pedagogical.py --report        # Report only

Output:
    - Updates metadata.json files with pedagogical section
    - Logs activity to logs/enrich-pedagogical-YYYY-MM-DD.jsonl
"""

import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORKSPACE_DIR = Path(os.environ.get("HOME")) / "Documents" / "ws"

# Paths relative to script location
SCRIPT_DIR = Path(__file__).parent.parent
LOG_DIR = SCRIPT_DIR / "logs"


# Pattern detection rules
# Each pattern has positive indicators (must match) and negative indicators (reduce confidence)
PATTERN_INDICATORS = {
    "worked-example": {
        "positive": [
            r"step[\s-]*(by[\s-]*step|through)", r"example", r"walkthrough",
            r"next.*step", r"previous.*step", r"step\s*\d+", r"explanation",
            r"show.*how", r"demonstrate", r"let'?s\s+see", r"notice\s+how",
            r"worked", r"solution\s*steps", r"step\s*button"
        ],
        "negative": [r"quiz", r"test", r"score", r"random"],
        "weight": 1.0
    },
    "exploration": {
        "positive": [
            r"explore", r"discover", r"experiment", r"try\s+different",
            r"what\s+happens", r"observe", r"investigate", r"sandbox",
            r"playground", r"free[\s-]*form", r"open[\s-]*ended"
        ],
        "negative": [r"quiz", r"score", r"correct", r"wrong"],
        "weight": 1.0
    },
    "practice": {
        "positive": [
            r"practice", r"exercise", r"drill", r"repeat", r"try\s+again",
            r"attempt", r"solve", r"problem\s+set", r"homework"
        ],
        "negative": [r"demonstration", r"watch"],
        "weight": 1.0
    },
    "assessment": {
        "positive": [
            r"quiz", r"test", r"assess", r"score", r"grade", r"correct",
            r"wrong", r"answer", r"submit", r"check\s+answer", r"evaluate",
            r"multiple[\s-]*choice", r"true[\s/]false"
        ],
        "negative": [],
        "weight": 1.2  # Higher weight - clearer signal
    },
    "reference": {
        "positive": [
            r"reference", r"lookup", r"table", r"chart", r"formula\s*sheet",
            r"cheat\s*sheet", r"documentation", r"info(rmation)?[\s-]*graphic"
        ],
        "negative": [r"slider", r"animate", r"interactive"],
        "weight": 0.8
    },
    "demonstration": {
        "positive": [
            r"demonstrat", r"show", r"display", r"present", r"illustrat",
            r"watch", r"observe", r"see\s+how", r"animation", r"visualiz"
        ],
        "negative": [r"slider", r"input", r"control", r"adjust"],
        "weight": 0.9
    },
    "guided-discovery": {
        "positive": [
            r"guided", r"hint", r"scaffold", r"prompt", r"suggestion",
            r"try\s+this", r"consider", r"what\s+if", r"notice",
            r"prediction", r"predict"
        ],
        "negative": [],
        "weight": 1.0
    }
}

# Pacing detection
PACING_INDICATORS = {
    "self-paced": {
        "positive": [
            r"slider", r"input", r"click", r"drag", r"button",
            r"control", r"adjust", r"change", r"set\s+value"
        ],
        "negative": [r"auto[\s-]*play", r"continuous", r"timer"]
    },
    "continuous": {
        "positive": [
            r"animate", r"animation", r"auto[\s-]*play", r"running",
            r"continuous", r"loop", r"frameRate", r"requestAnimationFrame",
            r"setInterval"
        ],
        "negative": [r"pause", r"step", r"next"]
    },
    "timed": {
        "positive": [
            r"timer", r"countdown", r"time\s*limit", r"seconds?\s*remaining",
            r"clock", r"deadline", r"hurry"
        ],
        "negative": []
    },
    "step-through": {
        "positive": [
            r"step[\s-]*through", r"next\s*(step|button)?", r"previous",
            r"forward", r"backward", r"step\s*\d+", r"advance"
        ],
        "negative": [r"auto", r"continuous"]
    }
}

# Interaction style detection
INTERACTION_STYLE_INDICATORS = {
    "observe": {
        "positive": [
            r"watch", r"observe", r"see", r"view", r"display",
            r"show", r"animation", r"visualiz"
        ],
        "negative": [r"slider", r"input", r"click", r"drag", r"control"]
    },
    "manipulate": {
        "positive": [
            r"slider", r"adjust", r"change", r"modify", r"control",
            r"parameter", r"value", r"range", r"createSlider"
        ],
        "negative": []
    },
    "construct": {
        "positive": [
            r"create", r"build", r"construct", r"design", r"draw",
            r"make", r"compose", r"assemble", r"arrange"
        ],
        "negative": []
    },
    "respond": {
        "positive": [
            r"answer", r"respond", r"select", r"choose", r"click.*option",
            r"submit", r"enter", r"type", r"input.*answer"
        ],
        "negative": []
    },
    "explore": {
        "positive": [
            r"explore", r"discover", r"investigate", r"experiment",
            r"try", r"test", r"sandbox", r"playground"
        ],
        "negative": [r"quiz", r"test", r"score"]
    }
}

# Feedback type detection
FEEDBACK_INDICATORS = {
    "immediate": [
        r"instant", r"immediate", r"real[\s-]*time", r"live",
        r"as\s+you", r"responsive"
    ],
    "delayed": [
        r"submit.*then", r"check\s+answer", r"see\s+result", r"reveal"
    ],
    "corrective": [
        r"correct", r"incorrect", r"wrong", r"right", r"error",
        r"mistake", r"try\s+again"
    ],
    "explanatory": [
        r"explanation", r"because", r"reason", r"why", r"hint",
        r"help", r"feedback.*text"
    ]
}

# Data visibility detection
DATA_VISIBILITY_INDICATORS = {
    "high": [
        r"formula", r"equation", r"calculation", r"show.*value",
        r"display.*data", r"number", r"value.*=", r"result.*:"
    ],
    "medium": [
        r"label", r"axis", r"legend", r"tooltip"
    ],
    "low": [
        r"abstract", r"conceptual", r"visual.*only", r"no.*numbers?"
    ]
}

# Bloom's level to lowercase mapping
BLOOMS_LOWERCASE = {
    "Remember": "remember",
    "Understand": "understand",
    "Apply": "apply",
    "Analyze": "analyze",
    "Evaluate": "evaluate",
    "Create": "create"
}

# Bloom's verbs detection patterns
# Each verb has patterns that indicate it's supported by the MicroSim
BLOOM_VERB_INDICATORS = {
    # Remember level
    "define": [r"defin(e|ition)", r"meaning\s+of", r"what\s+is"],
    "identify": [r"identify", r"find\s+the", r"locate", r"point\s+to"],
    "list": [r"\blist\b", r"enumerate", r"name\s+the"],
    "recall": [r"recall", r"remember", r"retriev"],
    "recognize": [r"recogni[zs]e", r"match", r"select.*correct"],
    "state": [r"\bstate\b", r"tell", r"say\s+what"],

    # Understand level
    "classify": [r"classif", r"categoriz", r"sort\s+into", r"group"],
    "compare": [r"compar", r"side[\s-]*by[\s-]*side", r"difference", r"similar"],
    "describe": [r"describ", r"explain\s+what", r"tell\s+about"],
    "explain": [r"explain", r"why\s+does", r"how\s+does", r"because"],
    "interpret": [r"interpret", r"meaning", r"what.*means"],
    "summarize": [r"summari[zs]", r"overview", r"main\s+points"],

    # Apply level
    "apply": [r"\bapply\b", r"use\s+the", r"put.*into\s+practice"],
    "calculate": [r"calculat", r"compute", r"formula", r"equation", r"\.toFixed"],
    "demonstrate": [r"demonstrat", r"show\s+how", r"step[\s-]*by[\s-]*step", r"walkthrough"],
    "illustrate": [r"illustrat", r"visuali[zs]", r"diagram", r"picture"],
    "implement": [r"implement", r"code", r"program", r"algorithm"],
    "solve": [r"\bsolve\b", r"solution", r"answer", r"problem"],
    "use": [r"\buse\b", r"using", r"utilize", r"employ"],

    # Analyze level
    "analyze": [r"analy[zs]", r"break\s+down", r"components"],
    "differentiate": [r"differentiat", r"distinguish", r"tell\s+apart"],
    "examine": [r"examin", r"look\s+at", r"inspect", r"study"],
    "experiment": [r"experiment", r"try\s+different", r"what\s+happens", r"slider", r"parameter"],
    "investigate": [r"investigat", r"explore", r"discover", r"find\s+out"],
    "test": [r"\btest\b", r"check", r"verify", r"validate"],

    # Evaluate level
    "assess": [r"assess", r"measure", r"score", r"grade"],
    "critique": [r"critiqu", r"review", r"feedback"],
    "evaluate": [r"evaluat", r"judge", r"rate", r"rank"],
    "judge": [r"\bjudge\b", r"decide", r"determin"],
    "justify": [r"justif", r"reason", r"support.*argument"],
    "predict": [r"predict", r"forecast", r"estimate", r"expect", r"hypothesis"],

    # Create level
    "construct": [r"construct", r"build", r"assemble"],
    "create": [r"creat", r"make", r"produce", r"generate"],
    "design": [r"design", r"plan", r"layout", r"architect"],
    "develop": [r"develop", r"extend", r"improve"],
    "formulate": [r"formulat", r"devise", r"invent"],
    "generate": [r"generat", r"produce", r"output"]
}

# Map verbs to their Bloom level for cross-reference
VERB_TO_BLOOM_LEVEL = {
    "define": "remember", "identify": "remember", "list": "remember",
    "recall": "remember", "recognize": "remember", "state": "remember",
    "classify": "understand", "compare": "understand", "describe": "understand",
    "explain": "understand", "interpret": "understand", "summarize": "understand",
    "apply": "apply", "calculate": "apply", "demonstrate": "apply",
    "illustrate": "apply", "implement": "apply", "solve": "apply", "use": "apply",
    "analyze": "analyze", "differentiate": "analyze", "examine": "analyze",
    "experiment": "analyze", "investigate": "analyze", "test": "analyze",
    "assess": "evaluate", "critique": "evaluate", "evaluate": "evaluate",
    "judge": "evaluate", "justify": "evaluate", "predict": "evaluate",
    "construct": "create", "create": "create", "design": "create",
    "develop": "create", "formulate": "create", "generate": "create"
}


class PedagogicalEnricher:
    def __init__(self, workspace: Path = WORKSPACE_DIR, dry_run: bool = False):
        self.workspace = workspace
        self.dry_run = dry_run
        self.log_file = None
        self.stats = {
            "repos_scanned": 0,
            "files_scanned": 0,
            "files_updated": 0,
            "pattern_added": 0,
            "bloom_alignment_added": 0,
            "pacing_added": 0,
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

        for filename in ["main.html", "index.md", "index.html"]:
            filepath = sim_dir / filename
            if filepath.exists():
                try:
                    content += filepath.read_text(encoding='utf-8', errors='ignore')
                except Exception:
                    pass

        for js_file in sim_dir.glob("*.js"):
            try:
                content += js_file.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                pass

        return content

    def detect_pattern(self, content: str, metadata: dict) -> str:
        """Detect the primary pedagogical pattern."""
        content_lower = content.lower()
        scores = {}

        for pattern, indicators in PATTERN_INDICATORS.items():
            score = 0

            # Check positive indicators
            for regex in indicators["positive"]:
                matches = len(re.findall(regex, content_lower))
                score += matches

            # Check negative indicators (reduce score)
            for regex in indicators["negative"]:
                if re.search(regex, content_lower):
                    score -= 2

            # Apply weight
            scores[pattern] = score * indicators["weight"]

        # Check existing metadata for hints
        viz_types = metadata.get("visualizationType", [])
        if isinstance(viz_types, str):
            viz_types = [viz_types]

        if "chart" in viz_types or "graph" in viz_types:
            scores["exploration"] += 2
        if "diagram" in viz_types:
            scores["reference"] += 1

        # Check for sliders/controls - indicates exploration or practice
        if re.search(r"createSlider|<input.*range|slider", content_lower):
            scores["exploration"] += 3
            scores["demonstration"] -= 2

        # Get highest scoring pattern
        if not scores or max(scores.values()) == 0:
            return "exploration"  # Default

        return max(scores, key=scores.get)

    def detect_bloom_alignment(self, content: str, metadata: dict) -> list[str]:
        """Determine which Bloom's levels this interaction pattern supports."""
        # Start with existing bloomsTaxonomy if available
        existing = metadata.get("bloomsTaxonomy", [])
        if isinstance(existing, str):
            existing = [existing]

        # Convert to lowercase
        levels = set()
        for level in existing:
            if level in BLOOMS_LOWERCASE:
                levels.add(BLOOMS_LOWERCASE[level])
            elif level.lower() in BLOOMS_LOWERCASE.values():
                levels.add(level.lower())

        content_lower = content.lower()

        # Detect based on content - use word boundaries to avoid false positives
        # like "createCanvas" matching "create"
        if re.search(r"slider|adjust|parameter|\bexperiment\b", content_lower):
            levels.add("apply")

        # Use stricter patterns to avoid matching JS function names
        if re.search(r"\bcompare\b|\bcontrast\b|\bdifferentiate\b|\brelationship\b", content_lower):
            levels.add("analyze")

        # Avoid matching createCanvas, createButton, etc.
        if re.search(r"\bcreate\s+your|\bdesign\s+your|\bbuild\s+your|\bconstruct\s+a\b", content_lower):
            levels.add("create")

        if re.search(r"\bquiz\b|\bassess\b|\bevaluate\b|\bjudge\b|score|correct|wrong", content_lower):
            levels.add("evaluate")

        if re.search(r"\bexplain\b|\bdescribe\b|\binterpret\b|\bunderstand\b", content_lower):
            levels.add("understand")

        if re.search(r"\bidentify\b|\brecall\b|\brecognize\b|\blist\b(?!\s*=)|\bname\s+the\b", content_lower):
            levels.add("remember")

        # Default based on interactivity level
        if not levels:
            if re.search(r"slider|input|button|click", content_lower):
                levels = {"understand", "apply"}
            else:
                levels = {"understand"}

        # Limit to at most 3 levels for more focused matching
        if len(levels) > 3:
            # Prioritize middle levels (understand, apply, analyze) which are most common
            priority_order = ["apply", "understand", "analyze", "evaluate", "remember", "create"]
            sorted_levels = sorted(levels, key=lambda x: priority_order.index(x) if x in priority_order else 99)
            levels = set(sorted_levels[:3])

        # Sort by Bloom's order
        bloom_order = ["remember", "understand", "apply", "analyze", "evaluate", "create"]
        return sorted(list(levels), key=lambda x: bloom_order.index(x) if x in bloom_order else 99)

    def detect_bloom_verbs(self, content: str, metadata: dict, bloom_alignment: list[str]) -> list[str]:
        """Detect specific Bloom's verbs supported by this MicroSim."""
        content_lower = content.lower()
        detected_verbs = set()

        # Check each verb's indicators
        for verb, patterns in BLOOM_VERB_INDICATORS.items():
            # Only consider verbs whose Bloom level is in the alignment
            verb_level = VERB_TO_BLOOM_LEVEL.get(verb)
            if verb_level not in bloom_alignment:
                continue

            # Check if any pattern matches
            for pattern in patterns:
                if re.search(pattern, content_lower):
                    detected_verbs.add(verb)
                    break

        # Add verbs based on detected patterns and interaction styles
        if re.search(r"createSlider|<input.*range|slider", content_lower):
            if "apply" in bloom_alignment:
                detected_verbs.add("experiment")
            if "analyze" in bloom_alignment:
                detected_verbs.add("analyze")

        if re.search(r"step[\s-]*(by[\s-]*step|through)|next.*step", content_lower):
            if "apply" in bloom_alignment:
                detected_verbs.add("demonstrate")

        if re.search(r"quiz|score|correct|wrong", content_lower):
            if "evaluate" in bloom_alignment:
                detected_verbs.add("assess")

        if re.search(r"compar|side[\s-]*by[\s-]*side|versus", content_lower):
            if "understand" in bloom_alignment:
                detected_verbs.add("compare")

        if re.search(r"formula|equation|calculat|\.toFixed", content_lower):
            if "apply" in bloom_alignment:
                detected_verbs.add("calculate")

        if re.search(r"predict|hypothesis|before.*see|guess", content_lower):
            if "evaluate" in bloom_alignment:
                detected_verbs.add("predict")

        if re.search(r"creat|build|construct|design|draw", content_lower):
            if "create" in bloom_alignment:
                detected_verbs.update(["create", "construct", "design"])

        # Only add default verb if no verbs detected for that level AND we have few verbs
        if len(detected_verbs) < 3:
            for level in bloom_alignment:
                level_verbs = [v for v, l in VERB_TO_BLOOM_LEVEL.items() if l == level]
                if not any(v in detected_verbs for v in level_verbs):
                    defaults = {
                        "remember": "identify",
                        "understand": "explain",
                        "apply": "use",
                        "analyze": "examine",
                        "evaluate": "evaluate",
                        "create": "create"
                    }
                    detected_verbs.add(defaults.get(level, "use"))

        # Sort verbs by Bloom level order, then alphabetically within level
        def verb_sort_key(verb):
            level = VERB_TO_BLOOM_LEVEL.get(verb, "apply")
            level_order = ["remember", "understand", "apply", "analyze", "evaluate", "create"]
            return (level_order.index(level) if level in level_order else 99, verb)

        sorted_verbs = sorted(list(detected_verbs), key=verb_sort_key)

        # Limit to top 5 verbs for focused matching
        return sorted_verbs[:5]

    def detect_pacing(self, content: str, metadata: dict) -> str:
        """Detect the pacing mode."""
        content_lower = content.lower()
        scores = {}

        for pacing, indicators in PACING_INDICATORS.items():
            score = 0

            for regex in indicators["positive"]:
                matches = len(re.findall(regex, content_lower))
                score += matches

            for regex in indicators["negative"]:
                if re.search(regex, content_lower):
                    score -= 2

            scores[pacing] = score

        # Check for animation/frameRate patterns
        if re.search(r"frameRate|requestAnimationFrame|setInterval.*draw", content_lower):
            # But if there's also slider control, it's self-paced
            if re.search(r"createSlider|<input.*range", content_lower):
                scores["self-paced"] += 3
            else:
                scores["continuous"] += 3

        if not scores or max(scores.values()) <= 0:
            return "self-paced"  # Default

        return max(scores, key=scores.get)

    def detect_supports_prediction(self, content: str) -> bool:
        """Detect if the MicroSim supports prediction activities."""
        content_lower = content.lower()
        patterns = [
            r"predict", r"guess", r"estimate", r"what.*will.*happen",
            r"hypothesis", r"before.*you.*see", r"think.*first"
        ]
        return any(re.search(p, content_lower) for p in patterns)

    def detect_data_visibility(self, content: str) -> str:
        """Detect how much data/calculations are shown."""
        content_lower = content.lower()

        high_score = sum(1 for p in DATA_VISIBILITY_INDICATORS["high"]
                         if re.search(p, content_lower))
        medium_score = sum(1 for p in DATA_VISIBILITY_INDICATORS["medium"]
                          if re.search(p, content_lower))
        low_score = sum(1 for p in DATA_VISIBILITY_INDICATORS["low"]
                       if re.search(p, content_lower))

        # Check for numeric displays
        if re.search(r"text\([^)]*\d|\.toFixed|display.*value|show.*number", content_lower):
            high_score += 2

        if high_score > medium_score and high_score > low_score:
            return "high"
        elif low_score > medium_score:
            return "low"
        else:
            return "medium"

    def detect_feedback_types(self, content: str) -> list[str]:
        """Detect types of feedback provided."""
        content_lower = content.lower()
        types = []

        for feedback_type, patterns in FEEDBACK_INDICATORS.items():
            if any(re.search(p, content_lower) for p in patterns):
                types.append(feedback_type)

        # Check for real-time updates (indicates immediate feedback)
        if re.search(r"oninput|onchange|addEventListener.*input", content_lower):
            if "immediate" not in types:
                types.append("immediate")

        if not types:
            types = ["none"]

        return types

    def detect_interaction_style(self, content: str) -> str:
        """Detect the primary interaction style."""
        content_lower = content.lower()
        scores = {}

        for style, indicators in INTERACTION_STYLE_INDICATORS.items():
            score = 0

            for regex in indicators["positive"]:
                matches = len(re.findall(regex, content_lower))
                score += matches

            for regex in indicators["negative"]:
                if re.search(regex, content_lower):
                    score -= 2

            scores[style] = score

        if not scores or max(scores.values()) <= 0:
            # Default based on common patterns
            if re.search(r"slider|input|control", content_lower):
                return "manipulate"
            return "observe"

        return max(scores, key=scores.get)

    def needs_pedagogical(self, metadata: dict) -> bool:
        """Check if pedagogical section needs to be added."""
        return "pedagogical" not in metadata

    def create_pedagogical_section(self, content: str, metadata: dict) -> dict:
        """Create the pedagogical metadata section."""
        bloom_alignment = self.detect_bloom_alignment(content, metadata)
        bloom_verbs = self.detect_bloom_verbs(content, metadata, bloom_alignment)

        return {
            "pattern": self.detect_pattern(content, metadata),
            "bloomAlignment": bloom_alignment,
            "bloomVerbs": bloom_verbs,
            "pacing": self.detect_pacing(content, metadata),
            "supportsPrediction": self.detect_supports_prediction(content),
            "dataVisibility": self.detect_data_visibility(content),
            "feedbackType": self.detect_feedback_types(content),
            "interactionStyle": self.detect_interaction_style(content)
        }

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

        if not self.needs_pedagogical(metadata):
            self.stats["already_complete"] += 1
            return False

        # Read content for analysis
        content = self.read_sim_content(sim_dir)

        # Create pedagogical section
        pedagogical = self.create_pedagogical_section(content, metadata)
        metadata["pedagogical"] = pedagogical

        verbs_summary = pedagogical['bloomVerbs'][:3]  # Show first 3 verbs
        if len(pedagogical['bloomVerbs']) > 3:
            verbs_summary = verbs_summary + ['...']
        summary = f"pattern={pedagogical['pattern']}, verbs={verbs_summary}, pacing={pedagogical['pacing']}"

        if self.dry_run:
            print(f"    [dry-run] Would add pedagogical to {sim_name}: {summary}")
        else:
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            print(f"    + Added pedagogical to {sim_name}: {summary}")

            self.log("pedagogical_added", {
                "repo": repo_name,
                "sim": sim_name,
                "pedagogical": pedagogical
            })

        self.stats["files_updated"] += 1
        self.stats["pattern_added"] += 1
        self.stats["bloom_alignment_added"] += 1
        self.stats["pacing_added"] += 1

        return True

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
        """Generate a report of pedagogical metadata status."""
        print("MicroSim Pedagogical Metadata Report")
        print("=" * 60)

        if repo_names:
            repos = [self.workspace / name for name in repo_names if (self.workspace / name).exists()]
        else:
            repos = self.find_local_repos()

        missing = []
        has_pedagogical = []
        pattern_counts = {}

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

                if "pedagogical" in metadata:
                    has_pedagogical.append(identifier)
                    pattern = metadata["pedagogical"].get("pattern", "unknown")
                    pattern_counts[pattern] = pattern_counts.get(pattern, 0) + 1
                else:
                    missing.append(identifier)

        print(f"\nSummary:")
        print(f"  Has pedagogical: {len(has_pedagogical)}")
        print(f"  Missing pedagogical: {len(missing)}")

        if pattern_counts:
            print(f"\nPattern Distribution:")
            for pattern, count in sorted(pattern_counts.items(), key=lambda x: -x[1]):
                print(f"  {pattern}: {count}")

        if missing:
            print(f"\nMissing Pedagogical Metadata ({len(missing)}):")
            for item in missing[:30]:
                print(f"  - {item}")
            if len(missing) > 30:
                print(f"  ... and {len(missing) - 30} more")

    def run(self, repo_names: list[str] | None = None):
        """Main execution logic."""
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_filename = f"enrich-pedagogical-{datetime.now().strftime('%Y-%m-%d')}.jsonl"
        log_path = LOG_DIR / log_filename

        print("Enrich MicroSim Pedagogical Metadata")
        print(f"Workspace: {self.workspace}")
        if self.dry_run:
            print("Mode: DRY RUN (no files will be modified)")
        print(f"Log file: {log_path}")

        with open(log_path, "a") as self.log_file:
            self.log("run_started", {
                "workspace": str(self.workspace),
                "dry_run": self.dry_run
            })

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

            for repo_path in repos:
                self.process_repo(repo_path)

            self.log("run_completed", self.stats)

        print()
        print("=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Repos scanned:           {self.stats['repos_scanned']}")
        print(f"Files scanned:           {self.stats['files_scanned']}")
        print(f"Files updated:           {self.stats['files_updated']}")
        print(f"Already complete:        {self.stats['already_complete']}")
        print(f"Errors:                  {self.stats['errors']}")


def main():
    parser = argparse.ArgumentParser(
        description="Enrich metadata.json files with pedagogical classification",
        epilog="Examples:\n"
               "  python src/enrich-metadata/enrich-pedagogical.py                 # All repos\n"
               "  python src/enrich-metadata/enrich-pedagogical.py geometry-course # Specific\n"
               "  python src/enrich-metadata/enrich-pedagogical.py --dry-run       # Preview\n"
               "  python src/enrich-metadata/enrich-pedagogical.py --report        # Report only",
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
        help="Generate report without making changes"
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Show what would be changed without modifying files"
    )
    parser.add_argument(
        "--workspace", "-w",
        type=Path,
        default=WORKSPACE_DIR,
        help=f"Workspace directory containing repos (default: {WORKSPACE_DIR})"
    )

    args = parser.parse_args()

    enricher = PedagogicalEnricher(args.workspace, dry_run=args.dry_run)

    if args.report:
        enricher.generate_report(args.repos if args.repos else None)
    else:
        enricher.run(args.repos if args.repos else None)


if __name__ == "__main__":
    main()
