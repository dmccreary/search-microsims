#!/bin/bash
#
# count-local-sims.sh
# Scans all local repositories for MicroSim metadata and generates an HTML report
#

# Configuration
WS_DIR="$HOME/Documents/ws"
OUTPUT_FILE="$WS_DIR/search-microsims/docs/reports/local-sims-report.html"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
TEMP_FILE=$(mktemp)

# Create output directory if needed
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Initialize counters
total_repos=0
total_sims=0
sims_with_metadata=0

# Collect all sim data to temp file
for sims_dir in "$WS_DIR"/*/docs/sims; do
    if [[ -d "$sims_dir" ]]; then
        repo_path=$(dirname "$(dirname "$sims_dir")")
        repo_name=$(basename "$repo_path")
        ((total_repos++))

        # Find all sim directories
        for sim_dir in "$sims_dir"/*/; do
            if [[ -d "$sim_dir" ]]; then
                sim_name=$(basename "$sim_dir")
                metadata_file="$sim_dir/metadata.json"

                ((total_sims++))

                if [[ -f "$metadata_file" ]]; then
                    ((sims_with_metadata++))

                    # Extract fields using jq if available
                    if command -v jq &> /dev/null; then
                        title=$(jq -r '.title // .microsim.title // .dublinCore.title // .microsim.dublinCore.title // "Untitled"' "$metadata_file" 2>/dev/null | tr '|' '-')
                        status=$(jq -r '.status // .microsim.status // "—"' "$metadata_file" 2>/dev/null)
                        quality=$(jq -r '.qualityScore // .microsim.qualityScore // .quality // .microsim.quality // "—"' "$metadata_file" 2>/dev/null)
                    else
                        # Fallback to grep/sed
                        title=$(grep -o '"title"[[:space:]]*:[[:space:]]*"[^"]*"' "$metadata_file" | head -1 | sed 's/.*"title"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' | tr '|' '-')
                        status=$(grep -o '"status"[[:space:]]*:[[:space:]]*"[^"]*"' "$metadata_file" | head -1 | sed 's/.*"status"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
                        quality="—"
                        [[ -z "$title" ]] && title="Untitled"
                        [[ -z "$status" ]] && status="—"
                    fi

                    # Clean up null values from jq
                    [[ "$title" == "null" ]] && title="Untitled"
                    [[ "$status" == "null" ]] && status="—"
                    [[ "$quality" == "null" ]] && quality="—"

                    echo "$repo_name|$sim_name|$title|$status|$quality|yes" >> "$TEMP_FILE"
                else
                    echo "$repo_name|$sim_name|No metadata.json|—|—|no" >> "$TEMP_FILE"
                fi
            fi
        done
    fi
done

# Calculate missing metadata count
missing_metadata=$((total_sims - sims_with_metadata))

# Start HTML output
cat > "$OUTPUT_FILE" << 'HTMLHEAD'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Local MicroSims Report</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        h2 { color: #007acc; margin-top: 30px; }
        .timestamp { color: #666; font-size: 0.9em; margin-bottom: 20px; }
        .summary {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .stat {
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .stat-value { font-size: 2.5em; font-weight: bold; color: #007acc; }
        .stat-label { color: #666; margin-top: 5px; }
        .repo {
            background: #fff;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .repo-header {
            background: #007acc;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .repo-name { font-weight: bold; font-size: 1.2em; }
        .repo-count {
            background: rgba(255,255,255,0.2);
            padding: 5px 15px;
            border-radius: 20px;
        }
        .sim-list { padding: 0; margin: 0; }
        .sim-item {
            display: grid;
            grid-template-columns: 1fr 120px 100px;
            padding: 12px 20px;
            border-bottom: 1px solid #eee;
            align-items: center;
        }
        .sim-item:last-child { border-bottom: none; }
        .sim-item:hover { background: #f8f9fa; }
        .sim-name { font-weight: 500; }
        .sim-title { color: #666; font-size: 0.9em; margin-top: 3px; }
        .status {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            text-align: center;
        }
        .status-complete { background: #d4edda; color: #155724; }
        .status-development { background: #fff3cd; color: #856404; }
        .status-draft { background: #e2e3e5; color: #383d41; }
        .status-unknown { background: #f8f9fa; color: #6c757d; }
        .quality-score {
            text-align: center;
            font-weight: bold;
        }
        .quality-high { color: #28a745; }
        .quality-medium { color: #ffc107; }
        .quality-low { color: #dc3545; }
        .no-metadata { color: #999; font-style: italic; }
        .missing { color: #dc3545; }
        a { color: #007acc; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
HTMLHEAD

# Add header with timestamp and summary
cat >> "$OUTPUT_FILE" << EOF
    <h1>Local MicroSims Report</h1>
    <p class="timestamp">Generated: $TIMESTAMP</p>
    <div class="summary">
        <h2 style="margin-top: 0;">Summary</h2>
        <div class="summary-stats">
            <div class="stat">
                <div class="stat-value">$total_repos</div>
                <div class="stat-label">Repositories</div>
            </div>
            <div class="stat">
                <div class="stat-value">$total_sims</div>
                <div class="stat-label">Total Sims</div>
            </div>
            <div class="stat">
                <div class="stat-value">$sims_with_metadata</div>
                <div class="stat-label">With Metadata</div>
            </div>
            <div class="stat">
                <div class="stat-value" style="color: ${missing_metadata:+#dc3545}">$missing_metadata</div>
                <div class="stat-label">Missing Metadata</div>
            </div>
        </div>
    </div>
EOF

# Process each repository
current_repo=""
sim_count=0

# Sort temp file by repo name
sort "$TEMP_FILE" -o "$TEMP_FILE"

while IFS='|' read -r repo_name sim_name title status quality has_metadata; do
    # When repo changes, close previous and start new
    if [[ "$repo_name" != "$current_repo" ]]; then
        # Close previous repo section if exists
        if [[ -n "$current_repo" ]]; then
            echo "        </div>" >> "$OUTPUT_FILE"
            echo "    </div>" >> "$OUTPUT_FILE"
        fi

        # Count sims for this repo
        sim_count=$(grep -c "^$repo_name|" "$TEMP_FILE")

        # Start new repo section
        cat >> "$OUTPUT_FILE" << EOF
    <div class="repo">
        <div class="repo-header">
            <span class="repo-name"><a href="https://github.com/dmccreary/$repo_name" style="color: white;">$repo_name</a></span>
            <span class="repo-count">$sim_count sims</span>
        </div>
        <div class="sim-list">
EOF
        current_repo="$repo_name"
    fi

    # Determine status class
    status_lower=$(echo "$status" | tr '[:upper:]' '[:lower:]')
    case "$status_lower" in
        *complete*|*finished*|*stable*) status_class="status-complete" ;;
        *development*|*progress*|*wip*) status_class="status-development" ;;
        *draft*|*beta*) status_class="status-draft" ;;
        *) status_class="status-unknown" ;;
    esac

    # Determine quality class
    if [[ "$quality" =~ ^[0-9]+$ ]]; then
        if (( quality >= 80 )); then
            quality_class="quality-high"
        elif (( quality >= 50 )); then
            quality_class="quality-medium"
        else
            quality_class="quality-low"
        fi
    else
        quality_class=""
    fi

    # Output sim item
    if [[ "$has_metadata" == "no" ]]; then
        cat >> "$OUTPUT_FILE" << EOF
            <div class="sim-item">
                <div>
                    <div class="sim-name no-metadata">$sim_name</div>
                    <div class="sim-title missing">Missing metadata.json</div>
                </div>
                <div class="status status-unknown">—</div>
                <div class="quality-score">—</div>
            </div>
EOF
    else
        cat >> "$OUTPUT_FILE" << EOF
            <div class="sim-item">
                <div>
                    <div class="sim-name">$sim_name</div>
                    <div class="sim-title">$title</div>
                </div>
                <div class="status $status_class">$status</div>
                <div class="quality-score $quality_class">$quality</div>
            </div>
EOF
    fi
done < "$TEMP_FILE"

# Close last repo section
if [[ -n "$current_repo" ]]; then
    echo "        </div>" >> "$OUTPUT_FILE"
    echo "    </div>" >> "$OUTPUT_FILE"
fi

# Close HTML
cat >> "$OUTPUT_FILE" << 'HTMLFOOT'
</body>
</html>
HTMLFOOT

# Clean up
rm -f "$TEMP_FILE"

echo "Report generated: $OUTPUT_FILE"
echo "Total repositories: $total_repos"
echo "Total sims: $total_sims"
echo "Sims with metadata: $sims_with_metadata"
echo "Missing metadata: $missing_metadata"
