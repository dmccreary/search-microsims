# MicroSim Search

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20Site-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/microsim-search/)
[![ItemsJS](https://img.shields.io/badge/Search-ItemsJS-green)](https://github.com/itemsapi/itemsjs)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the faceted search demo at: [https://dmccreary.github.io/search-microsims/](https://dmccreary.github.io/search-microsims/)

## Overview

MicroSim Search is a client-side faceted search system for educational MicroSims (interactive simulations). It crawls GitHub repositories to collect MicroSim metadata and provides a browser-based search interface using [ItemsJS](https://github.com/itemsapi/itemsjs) - no backend server required.

The system is designed for GitHub Pages deployment and supports the official [MicroSim Metadata Schema](https://github.com/dmccreary/microsims/blob/main/src/microsim-schema/microsim-schema.json), which includes Dublin Core metadata, educational specifications (Bloom's Taxonomy, grade levels), and technical requirements.

Key features:

- **Faceted filtering** by Subject Area, Grade Level, Bloom's Taxonomy, Difficulty, Framework, and Visualization Type
- **Full-text search** across titles, descriptions, and learning objectives
- **GitHub crawler** that collects metadata from multiple repositories
- **Schema normalization** supporting both legacy and nested metadata formats
- **Zero backend** - runs entirely in the browser

## Site Status and Metrics

| Metric | Count |
|--------|-------|
| MicroSims Indexed | 45 |
| Repositories Crawled | 17 |
| Markdown Files | 9 |
| Total Words | 2,816 |
| Python Scripts | 5 |
| Facets Available | 6 |

**Data Sources:** Crawls `dmccreary/*/docs/sims/*/metadata.json` from GitHub

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/search-microsims.git
cd search-microsims
```

### Install Dependencies

```bash
pip install mkdocs mkdocs-material requests
```

### Crawl MicroSim Metadata

```bash
# Optional: Set GitHub token for higher rate limits
export GITHUB_TOKEN=ghp_your_token

# Crawl all repositories for metadata
python3 src/crawl-microsims.py

# Analyze missing metadata by repo
python3 src/analyze-missing-metadata.py
```

### Build and Serve Locally

```bash
mkdocs serve
```

Open your browser to `http://127.0.0.1:8000/microsim-search/`

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

## Repository Structure

```
search-microsims/
├── docs/                          # MkDocs documentation source
│   ├── search/                    # Faceted search interface
│   │   ├── demo.html             # ItemsJS search UI
│   │   ├── microsims-data.json   # Combined metadata (generated)
│   │   └── index.md              # Search page documentation
│   ├── microsim-schema.md        # Schema documentation
│   ├── index.md                  # Home page
│   └── glossary.md               # Glossary
├── src/                           # Python scripts
│   ├── crawl-microsims.py        # GitHub metadata crawler
│   └── analyze-missing-metadata.py # Missing metadata report
├── logs/                          # Crawl logs (JSONL)
│   └── microsim-crawl-*.jsonl    # Timestamped crawl logs
├── mkdocs.yml                     # MkDocs configuration
├── CLAUDE.md                      # Claude Code guidance
└── README.md                      # This file
```

## How It Works

1. **Crawl**: `crawl-microsims.py` uses the GitHub API to find all `metadata.json` files in `dmccreary/*/docs/sims/*/`
2. **Normalize**: Data is normalized to handle varying metadata schemas (legacy flat format and nested schema format)
3. **Index**: Combined JSON is loaded by ItemsJS in the browser
4. **Search**: Users filter by facets and search text - all client-side

## Faceted Search Fields

| Facet | Schema Path | Example Values |
|-------|-------------|----------------|
| Subject Area | `educational.subjectArea` | Mathematics, Physics, Computer Science |
| Grade Level | `educational.gradeLevel` | K-12, Undergraduate, Graduate |
| Bloom's Taxonomy | `educational.bloomsTaxonomy` | Remember, Understand, Apply, Analyze |
| Difficulty | `educational.difficulty` | Beginner, Intermediate, Advanced |
| Framework | `technical.framework` | p5.js, d3.js, three.js |
| Visualization | `search.visualizationType` | animation, chart, simulation |

## Reporting Issues

Found a bug or have a suggestion? Please report it:

[GitHub Issues](https://github.com/dmccreary/search-microsims/issues)

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Acknowledgements

- **[ItemsJS](https://github.com/itemsapi/itemsjs)** - Lightweight faceted search engine
- **[MkDocs](https://www.mkdocs.org/)** - Static site generator
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Beautiful theme
- **[Claude AI](https://claude.ai)** by Anthropic - AI-assisted development
- **[GitHub Pages](https://pages.github.com/)** - Free hosting

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)
