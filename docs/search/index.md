# MicroSim Faceted Search Demo

[Run the MicroSim Faceted Search Demo](search/demo.html){ .md-button .md-button--primary }

This page demonstrates faceted search for MicroSims using [ItemsJS](https://github.com/itemsapi/itemsjs).

## Features

- **Full-text search** across titles, descriptions, and concepts
- **Faceted filtering** by Subject Area, Education Level, Bloom's Taxonomy, and Library
- **OR logic** within facets (select multiple values)
- **Active filter chips** with one-click removal
- **Responsive design** works on mobile and desktop

## Demo

<iframe src="./demo.html" width="100%" height="800" style="border: 1px solid #ddd; border-radius: 8px;"></iframe>

## How It Works

1. **Data**: MicroSim metadata is stored in a JSON file (`microsims-data.json`)
2. **ItemsJS**: Lightweight JavaScript library handles indexing and faceted search
3. **No Backend**: Runs entirely in the browser - perfect for GitHub Pages

## Data Schema

Each MicroSim has the following fields used for search and filtering:

| Field | Type | Facet |
|-------|------|-------|
| `title` | string | searchable |
| `description` | string | searchable |
| `subject` | array | Subject Area |
| `educationalLevel` | string | Education Level |
| `bloomLevel` | array | Bloom's Taxonomy |
| `concepts` | array | searchable |
| `library` | string | Library |
| `creator` | string | display |
| `date` | string | sortable |
| `url` | string | link |

## Standalone Version

View the standalone HTML version: [demo.html](./demo.html)
