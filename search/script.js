/**
 * MicroSim Faceted Search
 * Client-side search using ItemsJS library
 */

// State
let itemsjs;
let currentFilters = {};
let currentQuery = '';
let currentSort = 'title:asc';

// URL parameter mappings (URL param -> internal facet name)
const urlParamMap = {
    'subject': 'subjectArea',
    'level': 'gradeLevel',
    'bloom': 'bloomsTaxonomy',
    'difficulty': 'difficulty',
    'framework': 'framework',
    'viz': 'visualizationType'
};

// Reverse mapping (internal facet name -> URL param)
const facetToUrlParam = Object.fromEntries(
    Object.entries(urlParamMap).map(([k, v]) => [v, k])
);

// Configuration for ItemsJS
const configuration = {
    searchableFields: ['title', 'description', 'concepts', 'subjectArea'],
    sortings: {
        'title:asc': { field: 'title', order: 'asc' },
        'title:desc': { field: 'title', order: 'desc' },
        'date:asc': { field: 'date', order: 'asc' },
        'date:desc': { field: 'date', order: 'desc' }
    },
    aggregations: {
        subjectArea: {
            title: 'Subject Area',
            size: 20,
            conjunction: false // OR logic within facet
        },
        gradeLevel: {
            title: 'Grade Level',
            size: 20,
            conjunction: false
        },
        bloomsTaxonomy: {
            title: 'Bloom\'s Taxonomy',
            size: 6,
            conjunction: false
        },
        difficulty: {
            title: 'Difficulty',
            size: 5,
            conjunction: false
        },
        framework: {
            title: 'Framework',
            size: 10,
            conjunction: false
        },
        visualizationType: {
            title: 'Visualization',
            size: 15,
            conjunction: false
        }
    }
};

// ============================================================================
// URL Parameter Helpers
// ============================================================================

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
}

function updateUrlParams() {
    const url = new URL(window.location);

    // Update search query
    if (currentQuery) {
        url.searchParams.set('q', currentQuery);
    } else {
        url.searchParams.delete('q');
    }

    // Update facet filters
    for (const [urlParam, facetName] of Object.entries(urlParamMap)) {
        if (currentFilters[facetName] && currentFilters[facetName].length > 0) {
            url.searchParams.set(urlParam, currentFilters[facetName].join(','));
        } else {
            url.searchParams.delete(urlParam);
        }
    }

    // Update sort (only if not default)
    if (currentSort && currentSort !== 'title:asc') {
        url.searchParams.set('sort', currentSort);
    } else {
        url.searchParams.delete('sort');
    }

    window.history.replaceState({}, '', url);
}

function loadFiltersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    // Load search query
    const q = urlParams.get('q');
    if (q) {
        currentQuery = q;
        document.getElementById('search-input').value = q;
    }

    // Load facet filters
    for (const [urlParam, facetName] of Object.entries(urlParamMap)) {
        const value = urlParams.get(urlParam);
        if (value) {
            currentFilters[facetName] = value.split(',').map(v => v.trim());
        }
    }

    // Load sort
    const sort = urlParams.get('sort');
    if (sort && ['title:asc', 'title:desc', 'date:asc', 'date:desc'].includes(sort)) {
        currentSort = sort;
        document.getElementById('sort-select').value = sort;
    }
}

// ============================================================================
// Help Modal Functions
// ============================================================================

function showHelp() {
    document.getElementById('help-modal').style.display = 'flex';
}

function closeHelp() {
    document.getElementById('help-modal').style.display = 'none';
    // Remove help param from URL
    const url = new URL(window.location);
    url.searchParams.delete('help');
    window.history.replaceState({}, '', url);
}

function checkForHelp() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('help')) {
        showHelp();
    }
}

// ============================================================================
// Data Normalization
// ============================================================================

/**
 * Normalize data to handle varying metadata schemas
 * Supports both flat legacy format and nested schema format (microsim.dublinCore, etc.)
 */
function normalizeData(items) {
    return items.map((item, index) => {
        // Ensure arrays for faceted fields
        const toArray = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            return [val];
        };

        // Helper to get nested or flat field
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

        // Normalize subject/subjectArea field
        let subjectArea = toArray(get([
            'microsim.educational.subjectArea',
            'educational.subjectArea',
            'subjectArea',
            'subject'
        ]));
        // Add topics to subject for searchability
        const topics = toArray(get([
            'microsim.educational.topic',
            'educational.topic',
            'topic'
        ]));
        if (topics.length) subjectArea = [...new Set([...subjectArea, ...topics])];

        // Normalize grade level
        let gradeLevel = toArray(get([
            'microsim.educational.gradeLevel',
            'educational.gradeLevel',
            'gradeLevel',
            'educationalLevel',
            'educationLevel'
        ]));

        // Normalize Bloom's taxonomy
        let bloomsTaxonomy = toArray(get([
            'microsim.educational.bloomsTaxonomy',
            'educational.bloomsTaxonomy',
            'bloomsTaxonomy',
            'bloomLevel',
            'bloomsLevel'
        ]));

        // Normalize difficulty
        let difficulty = get([
            'microsim.educational.difficulty',
            'educational.difficulty',
            'difficulty'
        ]) || 'Unknown';

        // Normalize framework
        let framework = get([
            'microsim.technical.framework',
            'technical.framework',
            'framework',
            'library'
        ]) || 'Unknown';

        // Normalize visualization type
        let visualizationType = toArray(get([
            'microsim.search.visualizationType',
            'search.visualizationType',
            'visualizationType'
        ]));

        // Normalize interaction level
        let interactionLevel = get([
            'microsim.search.interactionLevel',
            'search.interactionLevel',
            'interactionLevel'
        ]) || 'Unknown';

        // Normalize creator
        let creator = toArray(get([
            'microsim.dublinCore.creator',
            'dublinCore.creator',
            'creator',
            'author'
        ])).join(', ') || 'Unknown';

        // Normalize title and description
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

        // Normalize URL
        let url = get([
            'url',
            'microsim.dublinCore.identifier',
            'dublinCore.identifier',
            'identifier'
        ]) || item._source?.github_url || '#';

        // Normalize date
        let date = get([
            'microsim.dublinCore.date',
            'dublinCore.date',
            'date',
            'dateCreated'
        ]) || '';

        // Learning objectives for search
        let concepts = toArray(get([
            'microsim.educational.learningObjectives',
            'educational.learningObjectives',
            'learningObjectives',
            'concepts'
        ]));

        return {
            id: item.id || index + 1,
            title,
            description,
            subjectArea,
            gradeLevel,
            bloomsTaxonomy,
            difficulty,
            framework,
            visualizationType,
            interactionLevel,
            creator,
            date,
            url,
            concepts,
            _source: item._source
        };
    });
}

// ============================================================================
// Rendering Functions
// ============================================================================

function render() {
    const results = itemsjs.search({
        query: currentQuery,
        filters: currentFilters,
        sort: currentSort,
        per_page: 100
    });

    renderFacets(results.data.aggregations);
    renderResults(results.data.items);
    renderActiveFilters();

    document.getElementById('results-count').textContent =
        `${results.pagination.total} MicroSim${results.pagination.total !== 1 ? 's' : ''} found`;

    // Show/hide clear button
    const hasFilters = Object.keys(currentFilters).length > 0 || currentQuery;
    document.getElementById('clear-filters').style.display = hasFilters ? 'block' : 'none';
}

function renderFacets(aggregations) {
    const facetsContainer = document.getElementById('facets');
    facetsContainer.innerHTML = '';

    for (const [key, agg] of Object.entries(aggregations)) {
        if (agg.buckets.length === 0) continue;

        const facetDiv = document.createElement('div');
        facetDiv.className = 'facet';
        facetDiv.innerHTML = `<h3>${agg.title}</h3>`;

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'facet-items';

        agg.buckets.forEach(bucket => {
            const isSelected = (currentFilters[key] || []).includes(bucket.key);
            const itemDiv = document.createElement('div');
            itemDiv.className = `facet-item ${isSelected ? 'selected' : ''}`;
            itemDiv.innerHTML = `
                <input type="checkbox"
                       id="${key}-${bucket.key}"
                       ${isSelected ? 'checked' : ''}
                       data-facet="${key}"
                       data-value="${bucket.key}">
                <label for="${key}-${bucket.key}">${bucket.key}</label>
                <span class="count">${bucket.doc_count}</span>
            `;
            itemsDiv.appendChild(itemDiv);
        });

        facetDiv.appendChild(itemsDiv);
        facetsContainer.appendChild(facetDiv);
    }
}

function renderResults(items) {
    const resultsContainer = document.getElementById('results');

    if (items.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h2>No MicroSims Found</h2>
                <p>Try adjusting your search or filters.</p>
            </div>`;
        return;
    }

    resultsContainer.innerHTML = items.map(item => `
        <div class="result-card">
            <h3><a href="${item.url || '#'}" target="_blank">${item.title || 'Untitled'}</a></h3>
            <p class="description">${item.description || ''}</p>
            <div class="tags">
                ${(item.subjectArea || []).slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')}
                ${(item.gradeLevel || []).slice(0, 2).map(g => `<span class="tag level">${g}</span>`).join('')}
                <span class="tag library">${item.framework || 'Unknown'}</span>
            </div>
            <div class="tags">
                ${(item.bloomsTaxonomy || []).map(b => `<span class="tag bloom">${b}</span>`).join('')}
                ${item.difficulty && item.difficulty !== 'Unknown' ? `<span class="tag difficulty">${item.difficulty}</span>` : ''}
            </div>
            <div class="meta">By ${item.creator || 'Unknown'}${item.date ? ' | ' + item.date : ''}</div>
            ${item.url ? `<a href="../sims/list-similar-microsim/main.html?id=${encodeURIComponent(item.url)}" class="similar-link">Similar MicroSims</a>` : ''}
        </div>
    `).join('');
}

function renderActiveFilters() {
    const container = document.getElementById('active-filters');
    const filters = [];

    if (currentQuery) {
        filters.push(`<span class="active-filter">Search: "${currentQuery}" <span class="remove" data-type="query">×</span></span>`);
    }

    for (const [facet, values] of Object.entries(currentFilters)) {
        values.forEach(value => {
            filters.push(`<span class="active-filter">${value} <span class="remove" data-type="filter" data-facet="${facet}" data-value="${value}">×</span></span>`);
        });
    }

    container.innerHTML = filters.join('');
}

// ============================================================================
// Event Listeners
// ============================================================================

function setupEventListeners() {
    // Search input with debounce
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentQuery = e.target.value;
            updateUrlParams();
            render();
        }, 200);
    });

    // Facet checkbox clicks
    document.getElementById('facets').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const facet = e.target.dataset.facet;
            const value = e.target.dataset.value;

            if (!currentFilters[facet]) {
                currentFilters[facet] = [];
            }

            if (e.target.checked) {
                currentFilters[facet].push(value);
            } else {
                currentFilters[facet] = currentFilters[facet].filter(v => v !== value);
                if (currentFilters[facet].length === 0) {
                    delete currentFilters[facet];
                }
            }

            updateUrlParams();
            render();
        }
    });

    // Sort dropdown
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateUrlParams();
        render();
    });

    // Clear all filters button
    document.getElementById('clear-filters').addEventListener('click', () => {
        currentFilters = {};
        currentQuery = '';
        currentSort = 'title:asc';
        document.getElementById('search-input').value = '';
        document.getElementById('sort-select').value = 'title:asc';
        updateUrlParams();
        render();
    });

    // Remove individual filters
    document.getElementById('active-filters').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove')) {
            if (e.target.dataset.type === 'query') {
                currentQuery = '';
                document.getElementById('search-input').value = '';
            } else {
                const facet = e.target.dataset.facet;
                const value = e.target.dataset.value;
                currentFilters[facet] = currentFilters[facet].filter(v => v !== value);
                if (currentFilters[facet].length === 0) {
                    delete currentFilters[facet];
                }
            }
            updateUrlParams();
            render();
        }
    });

    // Help modal - close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeHelp();
    });

    // Help modal - close on clicking outside
    document.getElementById('help-modal').addEventListener('click', (e) => {
        if (e.target.id === 'help-modal') closeHelp();
    });
}

// ============================================================================
// Initialization
// ============================================================================

async function init() {
    try {
        console.log('Fetching data...');
        const response = await fetch('microsims-data.json');
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log('Raw data loaded:', rawData.length, 'items');

        const data = normalizeData(rawData);
        console.log('Normalized data:', data.length, 'items');

        if (typeof window.itemsjs === 'undefined') {
            throw new Error('ItemsJS library not loaded');
        }

        itemsjs = window.itemsjs(data, configuration);
        console.log('ItemsJS initialized');

        // Load filters from URL parameters
        loadFiltersFromUrl();

        // Check for help parameter
        checkForHelp();

        render();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('results').innerHTML =
            `<div class="no-results"><h2>Error Loading Data</h2><p>${error.message}</p></div>`;
    }
}

// Start the application
init();
