# Migration: Move bloomsTaxonomy from educational to pedagogical

**Date:** 2026-01-25

## Summary

The `bloomsTaxonomy` field was moved from the `educational` section to the `pedagogical` section of the MicroSim metadata schema. This change aligns Bloom's taxonomy data with other pedagogical metadata like `bloomAlignment`, `bloomVerbs`, and `pattern`.

## Schema Change

**Before:**
```json
{
  "microsim": {
    "educational": {
      "bloomsTaxonomy": ["Remember", "Understand", "Apply"]
    }
  }
}
```

**After:**
```json
{
  "microsim": {
    "pedagogical": {
      "bloomsTaxonomy": ["Remember", "Understand", "Apply"],
      "bloomAlignment": ["understand", "apply"],
      "bloomVerbs": ["describe", "calculate", "apply"]
    }
  }
}
```

## Files Updated

### Documentation

| File | Change |
|------|--------|
| `CLAUDE.md` | Updated 2 references from `educational.bloomsTaxonomy` to `pedagogical.bloomsTaxonomy` |
| `README.md` | Updated faceted search fields table |
| `docs/chapters/05-json-and-data-structures/index.md` | Updated high-value fields list |

### Source Code

| File | Change |
|------|--------|
| `src/data-profiler/profile-microsims.py` | Updated KEY_FIELDS to move bloomsTaxonomy to pedagogical category; updated nested_paths lookup |
| `src/reports/pedagogical-distribution.py` | Rewrote to compare `pedagogical.bloomsTaxonomy` vs `pedagogical.bloomAlignment` instead of `educational.bloomsTaxonomy` vs `pedagogical.bloomAlignment` |

### JavaScript (Search UI)

| File | Change |
|------|--------|
| `docs/search/script.js` | Added `microsim.pedagogical.bloomsTaxonomy` and `pedagogical.bloomsTaxonomy` as first lookup paths (kept old paths for backward compatibility) |
| `docs/sims/list-similar-microsim/script.js` | Added `microsim.pedagogical.bloomsTaxonomy` and `pedagogical.bloomsTaxonomy` as first lookup paths (kept old paths for backward compatibility) |

### Reports

| File | Change |
|------|--------|
| `docs/reports/pedagogical-distribution.md` | Regenerated with correct field references |

## Files Intentionally Not Changed

| File | Reason |
|------|--------|
| `src/migrations/migrate-blooms-to-pedagogical.py` | Migration script that moves data FROM educational TO pedagogical - must reference old location |
| `docs/microsim-schema.md` | Documents the migration history with "(moved Jan 2025)" note |

## Backward Compatibility

The JavaScript files (`docs/search/script.js` and `docs/sims/list-similar-microsim/script.js`) maintain backward compatibility by checking multiple paths in order:

1. `microsim.pedagogical.bloomsTaxonomy` (new canonical path)
2. `pedagogical.bloomsTaxonomy` (new canonical path, flat)
3. `microsim.educational.bloomsTaxonomy` (legacy)
4. `educational.bloomsTaxonomy` (legacy)
5. `bloomsTaxonomy` (flat legacy)
6. `bloomLevel` (old flat format)

This ensures existing metadata files with the old structure continue to work while new files use the correct location.

## Verification

After updates, grep for `educational.bloomsTaxonomy` shows only:
- Migration script references (expected)
- Schema migration documentation (expected)
- Backward compatibility fallbacks in JS (expected)

All primary documentation and code paths now reference `pedagogical.bloomsTaxonomy`.
