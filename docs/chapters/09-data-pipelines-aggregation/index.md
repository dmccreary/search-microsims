---
title: Data Pipelines and Aggregation
description: Learn to build automated data pipelines that crawl GitHub repositories, extract MicroSim metadata using APIs, and aggregate content from multiple sources to keep searchable collections current
generated_by: claude skill chapter-content-generator
date: 2026-01-24 19:30:00
version: 0.03
reading_level: college_freshman
---

# Data Pipelines and Aggregation

## Summary

This chapter covers the data gathering and aggregation techniques used to build a searchable collection of MicroSims. You'll learn about web crawling approaches, using the GitHub API to discover repositories, repository mining techniques for extracting metadata, and strategies for aggregating data from multiple sources. The chapter focuses on building automated pipelines that keep MicroSim collections current. After completing this chapter, students will be able to design and implement data collection pipelines for MicroSim metadata.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Data Gathering
2. Web Crawling
3. GitHub API
4. Repository Mining
5. MicroSim Repositories
6. Data Aggregation

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../course-description.md). The Data Gathering concept is foundational with no dependencies within this textbook.

---

## Why Data Pipelines Are Your Secret Weapon

Imagine you're an educator who just discovered 500 amazing MicroSims scattered across 40 different GitHub repositories. Manually copying metadata from each one would take days—and by the time you finished, new simulations would already be published. You'd be trapped in an endless game of catch-up!

This is where **data pipelines** become your superpower. A well-designed pipeline automatically discovers new MicroSims, extracts their metadata, validates quality, and delivers a fresh, searchable collection—all while you're sipping coffee or teaching your next class.

In this chapter, you'll learn to build the data infrastructure that powers MicroSim search. Think of it as creating a network of friendly robots that tirelessly explore GitHub, find educational treasures, and organize them for easy discovery. By the end, you'll understand how our search system maintains an up-to-date collection of 400+ MicroSims from dozens of repositories.

Let's build some pipelines!

---

## Understanding Data Gathering

**Data gathering** is the systematic collection of information from various sources. For MicroSim search, this means finding and extracting metadata from wherever simulations are published.

### The Challenge of Distributed Content

MicroSims aren't stored in one central location—they're scattered across:

- Individual GitHub repositories
- Course websites and educational platforms
- Personal project pages
- Organizational collections

Each source has its own structure, format, and update schedule. Your data gathering strategy must handle this diversity gracefully.

### Key Data Gathering Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| **Automation** | Minimize manual intervention | Scripts that run on schedule |
| **Reliability** | Handle errors gracefully | Retry failed requests, log issues |
| **Efficiency** | Don't waste resources | Cache responses, avoid redundant calls |
| **Respect** | Honor rate limits and terms | Wait between API calls |
| **Freshness** | Keep data current | Incremental updates, not full rebuilds |

### Types of Data Sources

Different sources require different gathering techniques:

- **APIs (Application Programming Interfaces)**: Structured endpoints that return data in predictable formats. Ideal for programmatic access. GitHub's API is our primary source.

- **Web Pages**: Human-readable HTML that must be parsed. Useful when APIs aren't available, but more fragile.

- **File Systems**: Direct access to files in known locations. Works when you control the source.

- **Databases**: Structured data stores with query interfaces. Relevant for enterprise deployments.

For MicroSim gathering, we focus primarily on APIs because GitHub provides excellent programmatic access to repository contents.

---

## Web Crawling Fundamentals

**Web crawling** is the automated process of visiting web pages, extracting information, and following links to discover more pages. While our primary approach uses the GitHub API, understanding crawling concepts helps you adapt to sources without good API support.

### Anatomy of a Web Crawler

A basic crawler performs three operations in a loop:

1. **Fetch**: Request a URL and receive the response
2. **Parse**: Extract useful information from the response
3. **Discover**: Find new URLs to visit

```
┌────────────────────────────────────────────────────────────┐
│                    CRAWLING LOOP                            │
├────────────────────────────────────────────────────────────┤
│                                                             │
│     ┌──────────┐                                           │
│     │  URL     │                                           │
│     │  Queue   │◄────────────────────────────┐            │
│     └────┬─────┘                             │            │
│          │                                    │            │
│          │ Pop next URL                       │            │
│          ▼                                    │            │
│     ┌──────────┐                             │            │
│     │  FETCH   │  Request page               │            │
│     └────┬─────┘                             │            │
│          │                                    │            │
│          │ Receive response                   │            │
│          ▼                                    │            │
│     ┌──────────┐                             │            │
│     │  PARSE   │  Extract data               │            │
│     └────┬─────┘                             │            │
│          │                                    │            │
│          │ Find more URLs                     │            │
│          ▼                                    │            │
│     ┌──────────┐                             │            │
│     │ DISCOVER │  Add new URLs ──────────────┘            │
│     └────┬─────┘                                          │
│          │                                                 │
│          │ Store results                                   │
│          ▼                                                 │
│     ┌──────────┐                                          │
│     │ DATABASE │                                          │
│     └──────────┘                                          │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Crawling Best Practices

Being a "good citizen" of the web means following these practices:

- **Respect robots.txt**: Check what the site allows crawlers to access
- **Rate limiting**: Don't bombard servers with rapid requests
- **User-Agent identification**: Identify your crawler so administrators can contact you
- **Error handling**: Don't crash on bad responses
- **Incremental crawling**: Only fetch what's changed since last time

### Why We Prefer APIs Over Crawling

| Aspect | Web Crawling | API Access |
|--------|--------------|------------|
| **Reliability** | Breaks when HTML changes | Stable, versioned contracts |
| **Efficiency** | Downloads entire pages | Returns only needed data |
| **Respect** | May strain servers | Designed for programmatic use |
| **Structure** | Must parse HTML | Returns structured JSON |
| **Updates** | Hard to detect changes | Often includes modification timestamps |

For MicroSim collection, the GitHub API provides everything we need—no HTML parsing required!

!!! tip "When Crawling Is Necessary"
    Sometimes APIs don't exist or don't provide the data you need. In those cases, web crawling with libraries like BeautifulSoup (Python) or Puppeteer (JavaScript) can extract information from HTML pages. Just be extra careful about rate limiting and error handling.

---

## The GitHub API: Your Gateway to MicroSims

The **GitHub API** is a powerful interface that lets you programmatically access repository information, file contents, and metadata. It's the backbone of our MicroSim data pipeline.

### API Basics

GitHub's REST API uses simple HTTP requests to access data:

```
GET https://api.github.com/repos/dmccreary/geometry-course/contents/docs/sims
```

This request returns a JSON array listing all items in that directory. It's like asking GitHub: "What's in this folder?"

### Authentication and Rate Limits

GitHub enforces rate limits to prevent abuse:

| Access Type | Rate Limit |
|-------------|------------|
| **Unauthenticated** | 60 requests/hour |
| **Authenticated** | 5,000 requests/hour |
| **GitHub Actions** | 1,000 requests/hour |

For any serious data gathering, you need authentication. A GitHub Personal Access Token gives you 83× more capacity!

```bash
# Set your token as an environment variable
export GITHUB_TOKEN=ghp_your_token_here

# Now API calls include authentication
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/dmccreary/geometry-course
```

### Key API Endpoints for MicroSim Discovery

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `/users/{username}/repos` | List user's repositories | Find all dmccreary/* repos |
| `/repos/{owner}/{repo}/contents/{path}` | Get directory contents | List sims in a repo |
| `/repos/{owner}/{repo}/contents/{path}` | Get file contents | Fetch metadata.json |
| `/search/code` | Search for files | Find metadata.json files |

### Example: Listing Repositories

```python
import requests
import os

token = os.environ.get('GITHUB_TOKEN')
headers = {'Authorization': f'Bearer {token}'} if token else {}

# Get all public repositories for a user
response = requests.get(
    'https://api.github.com/users/dmccreary/repos',
    headers=headers,
    params={'per_page': 100}
)

repos = response.json()
for repo in repos:
    print(f"Found: {repo['name']} - {repo['description']}")
```

This simple script discovers all repositories owned by a user—the first step in finding MicroSims.

#### Diagram: GitHub API Workflow

<iframe src="../../sims/github-api-workflow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>GitHub API Workflow Visualization</summary>
Type: workflow

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning Objective: Students will explain the sequence of GitHub API calls needed to discover MicroSims by tracing the workflow from user repositories through directory contents to metadata extraction.

Visual style: Flowchart with numbered steps and API call boxes

Steps:
1. Start: "Discover MicroSims"
   Hover text: "Begin the data gathering process"

2. Process: "List User Repositories"
   API call: GET /users/{username}/repos
   Hover text: "Find all repositories owned by the target user"

3. Process: "Filter Course Repositories"
   Hover text: "Select repos likely to contain MicroSims (name contains 'course', 'microsim', etc.)"

4. Loop: "For Each Repository"
   Hover text: "Process each discovered repository"

5. Process: "Check for /docs/sims Directory"
   API call: GET /repos/{owner}/{repo}/contents/docs/sims
   Hover text: "Verify the standard MicroSim location exists"

6. Decision: "Directory Exists?"
   Hover text: "Handle repos with and without MicroSims"

7a. Process: "List MicroSim Directories"
   Hover text: "Enumerate all simulation folders"

7b. Process: "Skip Repository"
   Hover text: "No MicroSims here, continue to next repo"

8. Loop: "For Each MicroSim Directory"
   Hover text: "Process each discovered simulation"

9. Process: "Fetch metadata.json"
   API call: GET /repos/{owner}/{repo}/contents/docs/sims/{sim}/metadata.json
   Hover text: "Retrieve the simulation's metadata file"

10. Decision: "Metadata Valid?"
    Hover text: "Validate against schema, check required fields"

11a. Process: "Store Metadata"
    Hover text: "Add to aggregated collection"

11b. Process: "Log Warning"
    Hover text: "Record missing or invalid metadata for review"

12. End: "Aggregated Collection Complete"
    Hover text: "All discovered metadata ready for search indexing"

Color coding:
- Blue: API call steps
- Yellow: Decision points
- Green: Success outcomes
- Orange: Warning/alternative paths

Implementation: p5.js with interactive hover explanations for each step
</details>

---

## Repository Mining Techniques

**Repository mining** is the process of extracting structured information from code repositories. For MicroSims, this means finding metadata.json files and parsing their contents.

### The Standard MicroSim Structure

Our crawler expects MicroSims to follow a predictable structure:

```
repository/
├── docs/
│   └── sims/
│       ├── pendulum/
│       │   ├── index.md
│       │   ├── main.html
│       │   ├── style.css
│       │   └── metadata.json    ← Target!
│       ├── wave-motion/
│       │   ├── index.md
│       │   ├── main.html
│       │   └── metadata.json    ← Target!
│       └── ...
└── ...
```

The crawler navigates this structure to find all metadata.json files.

### Mining Strategy

Our repository mining follows this strategy:

1. **Enumerate repositories**: Get list of all repos for target users/organizations
2. **Check structure**: Look for `docs/sims/` directory
3. **List simulations**: Get contents of the sims directory
4. **Extract metadata**: Fetch and parse each metadata.json
5. **Validate**: Check required fields, flag incomplete entries
6. **Aggregate**: Combine into single searchable collection

### Handling Missing Metadata

Not every simulation has metadata yet. The crawler tracks these gaps:

```python
results = {
    'found': [],      # Complete metadata entries
    'partial': [],    # Missing some fields
    'missing': [],    # No metadata.json at all
}
```

This categorization helps prioritize metadata improvement efforts.

### Example: Mining a Single Repository

```python
def mine_repository(owner, repo, headers):
    """Extract all MicroSim metadata from a repository."""
    base_url = f"https://api.github.com/repos/{owner}/{repo}"
    microsims = []

    # Check for sims directory
    sims_url = f"{base_url}/contents/docs/sims"
    response = requests.get(sims_url, headers=headers)

    if response.status_code == 404:
        return []  # No sims directory

    sims = response.json()

    for sim in sims:
        if sim['type'] != 'dir':
            continue  # Skip files, only process directories

        # Fetch metadata.json
        metadata_url = f"{base_url}/contents/docs/sims/{sim['name']}/metadata.json"
        meta_response = requests.get(metadata_url, headers=headers)

        if meta_response.status_code == 200:
            # Decode base64 content from GitHub API
            content = base64.b64decode(meta_response.json()['content'])
            metadata = json.loads(content)
            metadata['_source_repo'] = f"{owner}/{repo}"
            metadata['_source_path'] = f"docs/sims/{sim['name']}"
            microsims.append(metadata)

    return microsims
```

This function encapsulates the core mining logic for a single repository.

!!! note "GitHub Returns Base64"
    When fetching file contents via the GitHub API, the content is base64-encoded. Don't forget to decode it before parsing as JSON!

---

## MicroSim Repositories: Finding the Treasure

**MicroSim repositories** are the source of our educational simulations. Understanding how to discover and track them is essential for maintaining a comprehensive collection.

### Discovery Strategies

Finding repositories with MicroSims requires multiple approaches:

| Strategy | Description | Pros | Cons |
|----------|-------------|------|------|
| **Known Users** | Track specific creators | Reliable, high quality | Limited scope |
| **Code Search** | Search for metadata.json files | Discovers new sources | Many false positives |
| **Topic Tags** | Search by repository topics | Self-organized | Inconsistent tagging |
| **Fork Networks** | Follow forks of template repos | Finds derivatives | May be abandoned |

### Our Primary Approach: Known User Mining

For the MicroSim search system, we focus on repositories from known contributors:

```python
MICROSIM_CREATORS = [
    'dmccreary',        # Primary creator
    'microsim-org',     # Organization account
    # Add more contributors as discovered
]

def discover_all_repos():
    """Find all repositories from known MicroSim creators."""
    all_repos = []
    for creator in MICROSIM_CREATORS:
        repos = list_user_repos(creator)
        # Filter for likely MicroSim-containing repos
        microsim_repos = [r for r in repos if is_likely_microsim_repo(r)]
        all_repos.extend(microsim_repos)
    return all_repos
```

### Identifying MicroSim Repositories

Not every repository contains MicroSims. We use heuristics to filter candidates:

- **Name patterns**: Contains "course", "tutorial", "microsim", "simulation"
- **Description keywords**: Mentions "interactive", "visualization", "p5.js"
- **File structure**: Has `docs/sims/` directory
- **Recent activity**: Updated within the last year

```python
def is_likely_microsim_repo(repo):
    """Heuristic: Does this repository probably contain MicroSims?"""
    name = repo['name'].lower()
    description = (repo['description'] or '').lower()

    # Check name patterns
    name_keywords = ['course', 'tutorial', 'microsim', 'simulation', 'demo']
    if any(kw in name for kw in name_keywords):
        return True

    # Check description keywords
    desc_keywords = ['interactive', 'visualization', 'p5.js', 'simulation']
    if any(kw in description for kw in desc_keywords):
        return True

    return False
```

### Tracking Repository Status

Maintain a registry of known repositories and their status:

```json
{
  "repositories": [
    {
      "full_name": "dmccreary/geometry-course",
      "status": "active",
      "last_crawled": "2026-01-24T12:00:00Z",
      "microsim_count": 45,
      "quality_score": 92
    },
    {
      "full_name": "dmccreary/physics-simulations",
      "status": "active",
      "last_crawled": "2026-01-24T12:00:00Z",
      "microsim_count": 38,
      "quality_score": 87
    }
  ]
}
```

This registry enables incremental updates—only crawl repositories that have changed.

#### Diagram: Repository Discovery Flow

<iframe src="../../sims/repo-discovery-flow/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Repository Discovery Flow Visualization</summary>
Type: diagram

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning Objective: Students will examine the repository discovery process by tracing how candidate repositories are filtered and validated to identify MicroSim collections.

Visual layout: Funnel diagram showing filtering stages

Stages (top to bottom):
1. "All User Repositories" (100 repos)
   - Wide funnel entrance
   - Gray color
   - Tooltip: "Starting point: all public repositories for known creators"

2. "Name/Description Filter" (40 repos)
   - Narrower section
   - Light blue
   - Tooltip: "Filter by keywords: course, tutorial, microsim, simulation"

3. "Structure Check" (25 repos)
   - Narrower
   - Medium blue
   - Tooltip: "Verify docs/sims/ directory exists"

4. "Metadata Presence" (18 repos)
   - Narrower
   - Dark blue
   - Tooltip: "At least one valid metadata.json found"

5. "Active Repositories" (15 repos)
   - Narrow
   - Green
   - Tooltip: "Updated within the last year, not archived"

Visual elements:
- Repository icons flowing through funnel
- Count labels at each stage
- Arrows showing flow direction
- Side annotations explaining each filter
- Rejected repos shown fading off to sides

Interactive controls:
- Hover over each stage for detailed explanation
- Click stage to see example repositories at that level
- Toggle: "Show rejected repos" (displays what was filtered out)
- Slider: "Animate flow" (shows repos moving through funnel)

Color scheme:
- Funnel gradient from gray to green
- Rejected items: red/orange
- Selected/active: gold highlight

Implementation: p5.js with animated funnel visualization
</details>

---

## Data Aggregation: Building the Collection

**Data aggregation** combines data from multiple sources into a unified collection. For MicroSim search, this means merging metadata from dozens of repositories into a single searchable JSON file.

### The Aggregation Challenge

Each repository might have:

- Different metadata completeness levels
- Slightly different field naming conventions
- Overlapping or duplicate simulations (forks)
- Varying quality scores

The aggregator must normalize, deduplicate, and validate while preserving information.

### Aggregation Pipeline Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    AGGREGATION PIPELINE                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│   │   Repo 1    │  │   Repo 2    │  │   Repo N    │           │
│   │  metadata   │  │  metadata   │  │  metadata   │           │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
│          │                │                │                   │
│          └────────────────┼────────────────┘                   │
│                           │                                    │
│                           ▼                                    │
│                   ┌───────────────┐                           │
│                   │   NORMALIZE   │                           │
│                   │  field names  │                           │
│                   │  data types   │                           │
│                   └───────┬───────┘                           │
│                           │                                    │
│                           ▼                                    │
│                   ┌───────────────┐                           │
│                   │  DEDUPLICATE  │                           │
│                   │  by URL/ID    │                           │
│                   │  prefer newest │                          │
│                   └───────┬───────┘                           │
│                           │                                    │
│                           ▼                                    │
│                   ┌───────────────┐                           │
│                   │   VALIDATE    │                           │
│                   │ schema check  │                           │
│                   │ required fields│                          │
│                   └───────┬───────┘                           │
│                           │                                    │
│                           ▼                                    │
│                   ┌───────────────┐                           │
│                   │   ENRICH      │                           │
│                   │ compute scores │                          │
│                   │ add timestamps │                          │
│                   └───────┬───────┘                           │
│                           │                                    │
│                           ▼                                    │
│                  ┌────────────────┐                           │
│                  │ microsims-     │                           │
│                  │ data.json      │                           │
│                  │ (unified       │                           │
│                  │  collection)   │                           │
│                  └────────────────┘                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Normalization: Speaking the Same Language

Different repositories might use different field names for the same concept:

| Source Variation | Normalized Field |
|------------------|------------------|
| `title`, `name`, `dublinCore.title` | `title` |
| `subject`, `topic`, `educational.subjectArea` | `subjectArea` |
| `library`, `framework`, `technical.framework` | `framework` |
| `creator`, `author`, `dublinCore.creator` | `creator` |

The normalizer maps all variations to our standard schema:

```python
def normalize_metadata(raw_metadata):
    """Convert varying field names to standard schema."""
    normalized = {}

    # Title normalization
    normalized['title'] = (
        raw_metadata.get('title') or
        raw_metadata.get('name') or
        raw_metadata.get('dublinCore', {}).get('title')
    )

    # Subject area normalization
    normalized['subjectArea'] = (
        raw_metadata.get('subjectArea') or
        raw_metadata.get('subject') or
        raw_metadata.get('educational', {}).get('subjectArea')
    )

    # Framework normalization
    normalized['framework'] = (
        raw_metadata.get('framework') or
        raw_metadata.get('library') or
        raw_metadata.get('technical', {}).get('framework')
    )

    return normalized
```

### Deduplication: One Copy of Each

Simulations might appear in multiple repositories (forks, mirrors). We deduplicate by URL:

```python
def deduplicate_microsims(all_microsims):
    """Remove duplicates, keeping the newest version."""
    by_url = {}

    for microsim in all_microsims:
        url = microsim.get('url')
        if url not in by_url:
            by_url[url] = microsim
        else:
            # Keep the one with more recent modification date
            existing_date = by_url[url].get('_last_modified', '')
            new_date = microsim.get('_last_modified', '')
            if new_date > existing_date:
                by_url[url] = microsim

    return list(by_url.values())
```

### Validation: Quality Gates

Before including a MicroSim in the collection, validate it meets minimum requirements:

```python
REQUIRED_FIELDS = ['title', 'description', 'url']

def validate_microsim(metadata):
    """Check if metadata meets minimum requirements."""
    errors = []

    for field in REQUIRED_FIELDS:
        if not metadata.get(field):
            errors.append(f"Missing required field: {field}")

    # Type validation
    if metadata.get('gradeLevel') and not isinstance(metadata['gradeLevel'], list):
        errors.append("gradeLevel should be a list")

    return len(errors) == 0, errors
```

### Enrichment: Adding Value

After normalization, enrich the data with computed fields:

- **Quality score**: Based on metadata completeness
- **Last updated**: When the metadata was last modified
- **Source repository**: Where this MicroSim came from
- **URL construction**: Build full URL from repository and path

```python
def enrich_metadata(metadata, repo_info):
    """Add computed fields to metadata."""
    # Quality score (0-100 based on field completeness)
    filled_fields = sum(1 for v in metadata.values() if v)
    metadata['_quality_score'] = int((filled_fields / 20) * 100)

    # Source tracking
    metadata['_source_repo'] = repo_info['full_name']
    metadata['_last_crawled'] = datetime.now().isoformat()

    # URL construction
    if not metadata.get('url'):
        metadata['url'] = (
            f"https://{repo_info['owner']}.github.io/"
            f"{repo_info['name']}/sims/{metadata['_source_path']}/"
        )

    return metadata
```

#### Diagram: Aggregation Pipeline Simulator

<iframe src="../../sims/aggregation-pipeline-sim/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Data Aggregation Pipeline Simulator</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: execute

Learning Objective: Students will execute a simulated data aggregation pipeline by processing sample MicroSim records through normalization, deduplication, and validation stages, observing how each stage transforms the data.

Canvas layout:
- Left panel (30%): Input queue with sample records
- Center panel (50%): Pipeline visualization with stages
- Right panel (20%): Output and statistics

Visual elements:
- Input queue showing 8-10 sample metadata records as cards:
  - Some with missing fields (red highlight)
  - Some duplicates (yellow highlight)
  - Some with varying field names (blue highlight)
  - Some complete and valid (green highlight)
- Pipeline stages as connected processing boxes:
  - Normalize (blue)
  - Deduplicate (purple)
  - Validate (orange)
  - Enrich (green)
- Output collection showing final records
- Statistics panel:
  - Records processed
  - Duplicates removed
  - Validation failures
  - Quality score distribution

Sample input records:
1. Complete geometry MicroSim (valid)
2. Physics sim with "name" instead of "title" (needs normalization)
3. Duplicate of #1 from forked repo (will be deduplicated)
4. Chemistry sim missing description (validation failure)
5. Math sim with nested dublinCore fields (needs normalization)
6. Complete biology MicroSim (valid)
7. Empty metadata object (validation failure)
8. CS sim with legacy field names (needs normalization)

Interactive controls:
- Button: "Process Next Record" (step through one at a time)
- Button: "Process All" (run entire pipeline)
- Button: "Reset"
- Toggle: "Show detailed logs"
- Speed slider: Animation speed

Behavior:
- Record cards animate through pipeline stages
- Each stage shows transformation applied
- Failed records divert to "rejected" bin with explanation
- Duplicates merge into single record
- Statistics update in real-time
- Detailed logs show exact transformations

Animation:
- Cards slide through pipeline
- Stage boxes pulse when active
- Transformation details appear as overlay
- Rejected records fade out or move to error bin

Color scheme:
- Valid records: Green
- Needs normalization: Blue
- Duplicates: Yellow
- Validation failures: Red
- Pipeline stages: Gradient from blue to green

Implementation: p5.js with animated card flow and real-time statistics
</details>

---

## Building the Crawler: A Practical Example

Let's walk through building a complete MicroSim crawler. This is the actual approach used for our search system.

### Project Structure

```
src/
├── crawl-microsims.py      # Main crawler script
├── update-repo-microsims.py # Single-repo updater
├── config.py               # Configuration settings
└── utils/
    ├── github.py           # GitHub API helpers
    ├── normalize.py        # Field normalization
    └── validate.py         # Schema validation
```

### The Main Crawler Script

Here's a simplified version of our crawler:

```python
#!/usr/bin/env python3
"""
Crawl GitHub repositories to gather MicroSim metadata.
"""

import os
import json
import requests
from datetime import datetime

# Configuration
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
TARGET_USERS = ['dmccreary']
OUTPUT_FILE = 'docs/search/microsims-data.json'

def main():
    """Main crawler entry point."""
    print(f"Starting MicroSim crawl at {datetime.now()}")

    headers = {}
    if GITHUB_TOKEN:
        headers['Authorization'] = f'Bearer {GITHUB_TOKEN}'
        print("Using authenticated requests (5000 req/hour)")
    else:
        print("Warning: Unauthenticated (60 req/hour limit)")

    all_microsims = []

    # Process each target user
    for username in TARGET_USERS:
        print(f"\nProcessing user: {username}")
        repos = get_user_repos(username, headers)

        for repo in repos:
            microsims = mine_repository(repo, headers)
            print(f"  {repo['name']}: {len(microsims)} MicroSims")
            all_microsims.extend(microsims)

    # Normalize and deduplicate
    all_microsims = [normalize_metadata(m) for m in all_microsims]
    all_microsims = deduplicate_microsims(all_microsims)

    # Validate and filter
    valid_microsims = []
    for microsim in all_microsims:
        is_valid, errors = validate_microsim(microsim)
        if is_valid:
            valid_microsims.append(microsim)
        else:
            log_validation_errors(microsim, errors)

    # Save output
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(valid_microsims, f, indent=2)

    print(f"\nCrawl complete!")
    print(f"Total MicroSims: {len(valid_microsims)}")

if __name__ == '__main__':
    main()
```

### Running the Crawler

Execute the crawler from the command line:

```bash
# Set your GitHub token (required for reasonable rate limits)
export GITHUB_TOKEN=ghp_your_token_here

# Run the crawler
python3 src/crawl-microsims.py
```

Expected output:

```
Starting MicroSim crawl at 2026-01-24 14:30:00
Using authenticated requests (5000 req/hour)

Processing user: dmccreary
  geometry-course: 45 MicroSims
  physics-simulations: 38 MicroSims
  chemistry-visualizations: 22 MicroSims
  ...

Crawl complete!
Total MicroSims: 432
```

!!! success "Automation Ready"
    This crawler can run on a schedule (GitHub Actions, cron job) to keep your collection automatically updated. No manual intervention required!

---

## Incremental Updates: Staying Fresh

Rather than re-crawling everything each time, incremental updates process only what's changed.

### Why Incremental?

| Full Crawl | Incremental Update |
|------------|-------------------|
| Processes all repositories | Only changed repositories |
| Uses many API calls | Minimal API calls |
| Slow (minutes to hours) | Fast (seconds to minutes) |
| Good for initial load | Good for regular updates |

### Detecting Changes

GitHub provides metadata to detect changes:

- **`pushed_at`**: When the repository was last pushed to
- **`updated_at`**: When the repository was last updated
- **Commit SHA**: Hash of the latest commit

```python
def needs_update(repo, last_crawled):
    """Check if repository has changed since last crawl."""
    repo_updated = datetime.fromisoformat(repo['pushed_at'].replace('Z', '+00:00'))
    return repo_updated > last_crawled
```

### Single-Repository Updates

For quick updates when you know what changed:

```bash
# Update metadata from a single repository
python3 src/update-repo-microsims.py dmccreary/geometry-course
```

This is perfect for:

- After publishing new MicroSims
- Fixing metadata errors
- Testing changes before full crawl

---

## Logging and Monitoring

Good pipelines provide visibility into their operation through logging.

### Log Levels

| Level | Use Case | Example |
|-------|----------|---------|
| **INFO** | Normal operation | "Processing repository X" |
| **WARNING** | Non-critical issues | "Missing optional field Y" |
| **ERROR** | Failed operations | "Could not fetch metadata.json" |
| **DEBUG** | Detailed diagnostics | "API response: {...}" |

### Structured Logging (JSONL)

Our crawler logs to JSONL (JSON Lines) format for easy analysis:

```json
{"timestamp": "2026-01-24T14:30:01Z", "level": "INFO", "repo": "geometry-course", "message": "Starting repository crawl"}
{"timestamp": "2026-01-24T14:30:02Z", "level": "WARNING", "repo": "geometry-course", "sim": "angle-bisector", "message": "Missing field: learningObjectives"}
{"timestamp": "2026-01-24T14:30:03Z", "level": "INFO", "repo": "geometry-course", "message": "Completed: 45 MicroSims found"}
```

JSONL files are:

- Easy to append (one line per entry)
- Easy to filter (grep, jq)
- Easy to analyze (load into pandas)

### Log Analysis

Find issues quickly:

```bash
# Count warnings per repository
grep '"level": "WARNING"' logs/microsim-crawl-2026-01-24.jsonl | \
  jq -r '.repo' | sort | uniq -c | sort -rn

# Find all missing metadata
grep '"message": "No metadata.json"' logs/*.jsonl | \
  jq -r '.repo + "/" + .sim'
```

---

## Quality Metrics and Profiling

Data profiling helps you understand your collection's quality and completeness.

### Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Total count** | Number of MicroSims | Growing! |
| **Completeness** | % of fields filled | >80% |
| **Required fields** | % with all required fields | 100% |
| **Subject coverage** | Distribution across subjects | Balanced |
| **Grade coverage** | Distribution across levels | Balanced |

### The Data Profiler

```python
def profile_collection(microsims):
    """Generate quality metrics for the collection."""
    profile = {
        'total_count': len(microsims),
        'by_subject': {},
        'by_grade': {},
        'field_coverage': {},
        'quality_distribution': {'high': 0, 'medium': 0, 'low': 0}
    }

    for microsim in microsims:
        # Count by subject
        subject = microsim.get('subjectArea', 'Unknown')
        profile['by_subject'][subject] = profile['by_subject'].get(subject, 0) + 1

        # Count by grade
        grades = microsim.get('gradeLevel', ['Unknown'])
        for grade in grades:
            profile['by_grade'][grade] = profile['by_grade'].get(grade, 0) + 1

        # Quality categorization
        score = microsim.get('_quality_score', 0)
        if score >= 80:
            profile['quality_distribution']['high'] += 1
        elif score >= 50:
            profile['quality_distribution']['medium'] += 1
        else:
            profile['quality_distribution']['low'] += 1

    return profile
```

### Generating Reports

```bash
# Generate the profiling report
python3 src/data-profiler/profile-microsims.py

# Output: docs/reports/microsim-metrics.md
```

The report helps identify:

- Underrepresented subjects (need more content)
- Quality issues (need metadata enrichment)
- Missing required fields (need corrections)

#### Diagram: Collection Quality Dashboard

<iframe src="../../sims/quality-dashboard/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>MicroSim Collection Quality Dashboard</summary>
Type: infographic

Bloom Level: Evaluate (L5)
Bloom Verb: assess

Learning Objective: Students will assess MicroSim collection quality by interpreting dashboard metrics and identifying areas needing improvement.

Canvas layout: Dashboard with multiple visualization panels

Panels:

1. "Collection Overview" (top-left, 25%):
   - Big number: Total MicroSims count
   - Trend indicator (up/down from last crawl)
   - Subtitle: "From X repositories"

2. "Subject Distribution" (top-right, 25%):
   - Horizontal bar chart showing count per subject
   - Subjects: Math, Physics, Chemistry, Biology, CS, Other
   - Color coded by subject
   - Tooltip on hover: exact count and percentage

3. "Quality Score Distribution" (middle-left, 25%):
   - Pie or donut chart
   - Segments: High (80+), Medium (50-79), Low (<50)
   - Colors: Green, Yellow, Red
   - Center text: Average score

4. "Grade Level Coverage" (middle-right, 25%):
   - Stacked bar or area chart
   - Levels: K-5, 6-8, 9-12, Undergraduate, Graduate
   - Shows balance across educational levels

5. "Field Completeness" (bottom-left, 25%):
   - Grid of field names with completion percentage
   - Color intensity indicates completeness
   - Required fields marked with asterisk
   - Fields: title*, description*, subject, gradeLevel, framework, learningObjectives, etc.

6. "Repository Contributions" (bottom-right, 25%):
   - Treemap showing MicroSims per repository
   - Size = count, color = average quality
   - Click to see repository details

Interactive controls:
- Dropdown: "Time period" (current, last week, last month)
- Filter by subject (checkboxes)
- Toggle: "Show only issues" (highlight problem areas)
- Button: "Export report"

Hover behavior:
- All charts show detailed tooltips
- Clicking drills down to details

Color scheme:
- Quality: Red (low) → Yellow (medium) → Green (high)
- Subjects: Consistent with other visualizations
- Trend indicators: Red (down), Green (up), Gray (unchanged)

Data updates:
- Dashboard reflects current collection state
- Compare to previous crawl to show trends

Implementation: p5.js or Chart.js with multiple coordinated charts
</details>

---

## Scheduling and Automation

Manual crawling doesn't scale. Automation keeps your collection fresh without constant attention.

### Scheduling Options

| Method | Best For | Example |
|--------|----------|---------|
| **Cron job** | Server-based scheduling | `0 2 * * * /path/to/crawl.sh` |
| **GitHub Actions** | Free, integrated with repos | Workflow file in `.github/` |
| **Cloud Functions** | Serverless, event-driven | AWS Lambda, Google Cloud Functions |
| **CI/CD pipeline** | Part of deployment process | Run after merge to main |

### GitHub Actions Example

Our crawler runs daily via GitHub Actions:

```yaml
name: Crawl MicroSims

on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run crawler
        env:
          GITHUB_TOKEN: ${{ secrets.CRAWL_TOKEN }}
        run: python3 src/crawl-microsims.py

      - name: Commit changes
        run: |
          git config user.name "MicroSim Crawler"
          git config user.email "crawler@example.com"
          git add docs/search/microsims-data.json
          git commit -m "Update MicroSim collection" || exit 0
          git push
```

This workflow:

1. Runs automatically every day at 6 AM
2. Uses a secure GitHub token for API access
3. Commits updated data back to the repository
4. Can be triggered manually when needed

!!! tip "The `|| exit 0` Pattern"
    The `git commit ... || exit 0` pattern prevents the workflow from failing when there are no changes to commit. Smart pipelines handle "nothing to do" gracefully.

---

## Error Handling and Recovery

Robust pipelines handle failures gracefully without losing progress.

### Common Failure Modes

| Failure | Cause | Recovery |
|---------|-------|----------|
| **Rate limit exceeded** | Too many API calls | Wait and retry with backoff |
| **Network timeout** | Slow/unreliable connection | Retry with longer timeout |
| **Invalid JSON** | Malformed metadata.json | Log error, skip entry |
| **Missing directory** | Repo structure changed | Log warning, continue |
| **Authentication failure** | Expired/invalid token | Alert, fail fast |

### Retry with Exponential Backoff

When requests fail, retry with increasing delays:

```python
import time
import random

def fetch_with_retry(url, headers, max_retries=3):
    """Fetch URL with exponential backoff on failure."""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=30)

            if response.status_code == 403:
                # Rate limited - wait and retry
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                print(f"Rate limited, waiting {wait_time:.1f}s...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            return response

        except requests.RequestException as e:
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                print(f"Request failed, retrying in {wait_time:.1f}s: {e}")
                time.sleep(wait_time)
            else:
                raise

    return None
```

### Checkpointing for Long Crawls

For large crawls, save progress periodically:

```python
def crawl_with_checkpoints(repos, checkpoint_file='crawl_checkpoint.json'):
    """Crawl with periodic checkpointing."""
    # Load checkpoint if exists
    processed = set()
    results = []
    if os.path.exists(checkpoint_file):
        with open(checkpoint_file) as f:
            checkpoint = json.load(f)
            processed = set(checkpoint['processed'])
            results = checkpoint['results']

    for i, repo in enumerate(repos):
        if repo['full_name'] in processed:
            continue  # Already done

        # Process repository
        microsims = mine_repository(repo)
        results.extend(microsims)
        processed.add(repo['full_name'])

        # Checkpoint every 10 repos
        if i % 10 == 0:
            with open(checkpoint_file, 'w') as f:
                json.dump({
                    'processed': list(processed),
                    'results': results
                }, f)

    # Clean up checkpoint on success
    if os.path.exists(checkpoint_file):
        os.remove(checkpoint_file)

    return results
```

---

## Key Takeaways

1. **Data gathering** systematically collects information from distributed sources—essential for building comprehensive MicroSim collections

2. **Web crawling** automates page fetching and parsing, but APIs are preferred when available for reliability and efficiency

3. **The GitHub API** provides structured access to repository contents, with authenticated requests enabling 5,000 calls per hour

4. **Repository mining** extracts metadata.json files from known directory structures, tracking completeness and gaps

5. **MicroSim repositories** are discovered through known creators, code search, and heuristic filtering of repository characteristics

6. **Data aggregation** combines multi-source data through normalization, deduplication, validation, and enrichment stages

7. **Incremental updates** process only changed repositories, dramatically reducing API calls and execution time

8. **Structured logging** (JSONL format) provides visibility into pipeline operation for debugging and monitoring

9. **Quality metrics** reveal collection health—completeness, coverage, and areas needing improvement

10. **Automation** through GitHub Actions or cron keeps collections current without manual intervention

---

## What's Next?

You've learned to build data pipelines that automatically discover, extract, and aggregate MicroSim metadata. Your search system can now maintain a fresh, comprehensive collection with minimal manual effort.

In the final chapter, we'll bring everything together:

- Building complete search interfaces
- Deployment strategies
- Future directions for MicroSim search
- How AI agents can leverage MicroSim search for generation

The infrastructure is ready—now let's make it shine for users!

---

*Ready to see it all come together? Continue to [Chapter 10: Putting It All Together](../10-putting-it-all-together/index.md).*
