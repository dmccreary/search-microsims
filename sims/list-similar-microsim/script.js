/**
 * Similar MicroSims Viewer
 * Uses precomputed similarity data for fast lookups
 */

// Configuration
const SIMILAR_PATH = '../../search/similar-microsims.json';
const METADATA_PATH = '../../search/microsims-data.json';

/**
 * Normalize metadata to consistent format
 * (Adapted from the main search script)
 */
function normalizeItem(item) {
    const toArray = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        return [val];
    };

    const get = (paths) => {
        for (const path of paths) {
            const parts = path.split('.');
            let val = item;
            for (const part of parts) {
                val = val?.[part];
                if (val === undefined) break;
            }
            if (val !== undefined) return val;
        }
        return undefined;
    };

    let subjectArea = toArray(get([
        'microsim.educational.subjectArea',
        'educational.subjectArea',
        'subjectArea',
        'subject'
    ]));

    let gradeLevel = toArray(get([
        'microsim.educational.gradeLevel',
        'educational.gradeLevel',
        'gradeLevel',
        'educationalLevel'
    ]));

    let bloomsTaxonomy = toArray(get([
        'microsim.pedagogical.bloomsTaxonomy',
        'pedagogical.bloomsTaxonomy',
        'microsim.educational.bloomsTaxonomy',
        'educational.bloomsTaxonomy',
        'bloomsTaxonomy',
        'bloomLevel'
    ]));

    let difficulty = get([
        'microsim.educational.difficulty',
        'educational.difficulty',
        'difficulty'
    ]) || 'Unknown';

    let framework = get([
        'microsim.technical.framework',
        'technical.framework',
        'framework',
        'library'
    ]) || 'Unknown';

    let creator = toArray(get([
        'microsim.dublinCore.creator',
        'dublinCore.creator',
        'creator',
        'author'
    ])).join(', ') || 'Unknown';

    let title = get([
        'microsim.dublinCore.title',
        'dublinCore.title',
        'title'
    ]) || 'Untitled';

    let description = get([
        'microsim.dublinCore.description',
        'dublinCore.description',
        'description'
    ]) || '';

    // Clean up iframe descriptions
    if (description.includes('<iframe')) {
        description = '';
    }

    let url = get([
        'url',
        'microsim.dublinCore.identifier',
        'dublinCore.identifier',
        'identifier'
    ]) || item._source?.github_url || '#';

    let date = get([
        'microsim.dublinCore.date',
        'dublinCore.date',
        'date',
        'dateCreated'
    ]) || '';

    return {
        title,
        description,
        subjectArea,
        gradeLevel,
        bloomsTaxonomy,
        difficulty,
        framework,
        creator,
        date,
        url
    };
}

/**
 * Create metadata lookup by URL
 */
function createMetadataLookup(items) {
    const lookup = {};

    for (const item of items) {
        const normalized = normalizeItem(item);
        lookup[normalized.url] = normalized;
    }

    return lookup;
}

/**
 * Render the source MicroSim card
 */
function renderSourceCard(item) {
    const container = document.getElementById('source-card');

    if (!item) {
        container.innerHTML = `
            <div class="error">
                <h2>MicroSim Not Found</h2>
                <p>The requested MicroSim could not be found in the database.</p>
            </div>`;
        return;
    }

    container.innerHTML = `
        <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
        ${item.description ? `<p class="description">${item.description}</p>` : ''}
        <div class="tags">
            ${item.subjectArea.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')}
            ${item.gradeLevel.slice(0, 2).map(g => `<span class="tag">${g}</span>`).join('')}
            <span class="tag">${item.framework}</span>
        </div>
        <div class="meta">By ${item.creator}${item.date ? ' | ' + item.date : ''}</div>
    `;
}

/**
 * Render similar MicroSims results
 */
function renderResults(similarities, metadataLookup) {
    const container = document.getElementById('results');
    const countEl = document.getElementById('results-count');

    if (!similarities || similarities.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h2>No Similar MicroSims Found</h2>
                <p>Could not find similarity data for this MicroSim.</p>
            </div>`;
        countEl.textContent = '';
        return;
    }

    countEl.textContent = `Showing top ${similarities.length} similar MicroSims`;

    container.innerHTML = similarities.map(({ url, score }) => {
        const item = metadataLookup[url];

        if (!item) {
            return ''; // Skip if metadata not found
        }

        const similarityPercent = Math.round(score * 100);

        return `
            <div class="result-card">
                <span class="similarity-badge">${similarityPercent}% similar</span>
                <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
                ${item.description ? `<p class="description">${item.description}</p>` : ''}
                <div class="tags">
                    ${item.subjectArea.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')}
                    ${item.gradeLevel.slice(0, 2).map(g => `<span class="tag level">${g}</span>`).join('')}
                    <span class="tag library">${item.framework}</span>
                </div>
                <div class="tags">
                    ${item.bloomsTaxonomy.map(b => `<span class="tag bloom">${b}</span>`).join('')}
                    ${item.difficulty && item.difficulty !== 'Unknown' ? `<span class="tag difficulty">${item.difficulty}</span>` : ''}
                </div>
                <div class="meta">By ${item.creator}${item.date ? ' | ' + item.date : ''}</div>
                <a href="?id=${encodeURIComponent(item.url)}" class="similar-link">Find Similar</a>
            </div>
        `;
    }).join('');
}

/**
 * Main initialization
 */
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('id');

    if (!targetId) {
        document.getElementById('source-card').innerHTML = `
            <div class="error">
                <h2>No MicroSim Selected</h2>
                <p>Please select a MicroSim from the search page to find similar ones.</p>
                <p><a href="../../search/demo.html" style="color: white;">Go to Search</a></p>
            </div>`;
        document.getElementById('results').innerHTML = '';
        return;
    }

    try {
        // Load similarity data and metadata in parallel
        const [similarResponse, metadataResponse] = await Promise.all([
            fetch(SIMILAR_PATH),
            fetch(METADATA_PATH)
        ]);

        if (!similarResponse.ok) {
            throw new Error(`Failed to load similarity data: ${similarResponse.status}`);
        }
        if (!metadataResponse.ok) {
            throw new Error(`Failed to load metadata: ${metadataResponse.status}`);
        }

        const similarData = await similarResponse.json();
        const metadataItems = await metadataResponse.json();

        console.log(`Loaded similarity data for ${similarData.metadata.count} MicroSims`);
        console.log(`Loaded ${metadataItems.length} metadata items`);

        // Create lookup tables
        const metadataLookup = createMetadataLookup(metadataItems);

        // Find source item
        const sourceItem = metadataLookup[targetId];
        renderSourceCard(sourceItem);

        // Update page title
        if (sourceItem) {
            document.title = `Similar to: ${sourceItem.title} - MicroSim Search`;
        }

        // Get precomputed similar MicroSims
        const similarities = similarData.similar[targetId];
        renderResults(similarities, metadataLookup);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('source-card').innerHTML = `
            <div class="error">
                <h2>Error Loading Data</h2>
                <p>${error.message}</p>
            </div>`;
        document.getElementById('results').innerHTML = '';
    }
}

// Start the application
init();
