# Local MicroSim Metadata Updater

This script scans local checked-out GitHub repositories for MicroSim metadata and updates the combined search index.

## Overview

The `update-local-microsims.py` script provides a fast, offline alternative to the GitHub API-based crawler. It reads `metadata.json` files directly from local repositories in your workspace directory.

## Location

```
src/update-local-microsims.py
```

## Usage

### Scan All Repositories

```bash
python src/update-local-microsims.py
```

This scans all repositories in `~/Documents/ws` that have a `docs/sims` directory.

### Scan Specific Repositories

```bash
# Single repository
python src/update-local-microsims.py geometry-course

# Multiple repositories
python src/update-local-microsims.py algebra-1 circuits geometry-course
```

### List Available Repositories

```bash
python src/update-local-microsims.py --list
```

Output:
```
Available repositories in /Users/dan/Documents/ws:

  algebra-1 (11 sims)
  circuits (18 sims)
  geometry-course (27 sims)
  microsims (113 sims)
  ...

Total: 39 repositories with docs/sims
```

### Custom Workspace Directory

```bash
python src/update-local-microsims.py --workspace /path/to/repos
python src/update-local-microsims.py -w /path/to/repos
```

## Output Files

| File | Description |
|------|-------------|
| `docs/search/microsims-data.json` | Combined metadata for all MicroSims |
| `logs/local-update-YYYY-MM-DD.jsonl` | Activity log in JSON Lines format |

## How It Works

1. **Discovery**: Scans the workspace for directories containing `docs/sims/`
2. **Reading**: For each sim directory, reads `metadata.json` if present
3. **Enrichment**: Adds `_source` metadata with repo name, sim name, and GitHub URL
4. **URL Generation**: Sets the `url` field if not present (uses GitHub Pages URL pattern)
5. **Merging**: Combines new metadata with existing entries
6. **Deduplication**: Removes duplicates using `(repo, sim)` as the unique key
7. **Sorting**: Orders entries by repo name, then sim name
8. **ID Assignment**: Assigns sequential IDs to all entries

## Metadata Source Tracking

Each entry includes a `_source` object for tracking:

```json
{
  "title": "Sine Wave Explorer",
  "_source": {
    "repo": "signal-processing",
    "sim": "sine-wave",
    "github_url": "https://github.com/dmccreary/signal-processing/tree/main/docs/sims/sine-wave"
  },
  "url": "https://dmccreary.github.io/signal-processing/sims/sine-wave/",
  "id": 42
}
```

## Duplicate Handling

The script handles duplicates intelligently:

- **Same repo/sim**: Updates the existing entry with new metadata
- **New repo/sim**: Adds as a new entry
- **Entries without `_source`**: Preserved but may create duplicates

When the same MicroSim exists in the data:
- Running the script again will **update** the entry (not create a duplicate)
- The `updated` counter in the summary shows how many were updated

## Log Format

Logs are written in JSON Lines format for easy parsing:

```jsonl
{"timestamp": "2025-12-04T17:07:05.123Z", "event": "update_started", "workspace": "/Users/dan/Documents/ws"}
{"timestamp": "2025-12-04T17:07:05.234Z", "event": "metadata_found", "repo": "geometry-course", "sim": "angle-pairs", "title": "Angle Pairs Explorer"}
{"timestamp": "2025-12-04T17:07:05.345Z", "event": "missing_metadata", "repo": "geometry-course", "sim": "templates", "github_url": "..."}
{"timestamp": "2025-12-04T17:07:07.085Z", "event": "update_completed", "repos_scanned": 39, "sims_found": 489, "metadata_found": 275, ...}
```

### Log Events

| Event | Description |
|-------|-------------|
| `update_started` | Script execution began |
| `metadata_found` | Successfully read a metadata.json file |
| `missing_metadata` | Sim directory exists but no metadata.json |
| `error` | JSON parse error or file read error |
| `update_completed` | Script finished with statistics |

## Statistics

The completion summary includes:

| Statistic | Description |
|-----------|-------------|
| `repos_scanned` | Number of repositories processed |
| `sims_found` | Total sim directories found |
| `metadata_found` | Directories with valid metadata.json |
| `metadata_missing` | Directories without metadata.json |
| `added` | New entries added to the index |
| `updated` | Existing entries updated |
| `errors` | JSON parse or read errors |

## Comparison with GitHub API Crawler

| Feature | Local Script | GitHub API Crawler |
|---------|--------------|-------------------|
| Speed | Fast (local disk) | Slow (network requests) |
| Rate Limits | None | 60/hr (unauthenticated) or 5000/hr (with token) |
| Offline | Yes | No |
| Real-time | Reflects local changes | Reflects pushed changes |
| Setup | Requires local clones | Just needs network |

## Expected Directory Structure

The script expects repositories to follow this structure:

```
~/Documents/ws/
├── geometry-course/
│   └── docs/
│       └── sims/
│           ├── angle-pairs/
│           │   ├── index.md
│           │   ├── main.html
│           │   └── metadata.json  ← Read by script
│           └── pythagorean-theorem/
│               ├── index.md
│               ├── main.html
│               └── metadata.json
├── algebra-1/
│   └── docs/
│       └── sims/
│           └── ...
└── ...
```

## Troubleshooting

### No repositories found

Ensure your workspace contains repositories with `docs/sims` directories:

```bash
ls ~/Documents/ws/*/docs/sims 2>/dev/null | head -5
```

### JSON parse errors

Check the metadata.json file for syntax errors:

```bash
python -m json.tool path/to/metadata.json
```

### Missing entries after update

The script only includes entries with valid `_source` data. Check the log file for errors:

```bash
grep '"event": "error"' logs/local-update-*.jsonl
```

## Example Workflow

```bash
# 1. Check which repos are available
python src/update-local-microsims.py --list

# 2. Update metadata from a specific repo you just modified
python src/update-local-microsims.py geometry-course

# 3. Or update everything
python src/update-local-microsims.py

# 4. Verify the output
python -c "import json; d=json.load(open('docs/search/microsims-data.json')); print(f'{len(d)} entries')"

# 5. Check for any issues in the log
tail -1 logs/local-update-$(date +%Y-%m-%d).jsonl | python -m json.tool
```

## Configuration

Default values are set at the top of the script:

```python
WORKSPACE_DIR = Path(os.environ.get("HOME")) / "Documents" / "ws"
GITHUB_OWNER = "dmccreary"  # Used for URL generation
```

To change defaults, either:
- Use the `--workspace` flag
- Modify the script constants
