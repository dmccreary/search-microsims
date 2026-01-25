/**
 * Coverage Applications Map
 * Interactive world map showing educational coverage by region
 *
 * Learning Objective: Students will differentiate between global versus
 * regional coverage needs by exploring how educational content may have
 * geographic or jurisdictional constraints.
 */

// ===========================================
// CONFIGURATION
// ===========================================

const MAP_CONFIG = {
    center: [30, 0],     // World view centered
    zoom: 2,
    minZoom: 1,
    maxZoom: 6
};

// Region colors matching specification
const REGION_COLORS = {
    us: '#3b82f6',      // Blue
    eu: '#22c55e',      // Green
    uk: '#a855f7',      // Purple
    asia: '#f97316',    // Orange
    latam: '#14b8a6',   // Teal
    global: '#6b7280'   // Gray
};

// Region data with coverage examples and sample MicroSims
const REGION_DATA = {
    us: {
        name: 'United States',
        colorClass: 'us',
        coverage: [
            'Common Core Math Standards',
            'NGSS Science Standards',
            'US History to 1877',
            'AP Curriculum alignment',
            'State-specific standards'
        ],
        microsims: [
            'Constitutional Convention Timeline',
            'Electoral College Map',
            'US Geography Quiz'
        ]
    },
    eu: {
        name: 'European Union',
        colorClass: 'eu',
        coverage: [
            'Bologna Process standards',
            'European scientific notation conventions',
            'ECTS credit system',
            'Metric system emphasis',
            'Multilingual content support'
        ],
        microsims: [
            'EU Member States Map',
            'Euro Currency Converter',
            'European History Timeline'
        ]
    },
    uk: {
        name: 'United Kingdom',
        colorClass: 'uk',
        coverage: [
            'Key Stage 3-4 curriculum',
            'GCSE Physics specification',
            'A-Level requirements',
            'National Curriculum alignment',
            'Ofsted standards'
        ],
        microsims: [
            'UK Parliament Structure',
            'British History Timeline',
            'GCSE Maths Practice'
        ]
    },
    asia: {
        name: 'Asia-Pacific',
        colorClass: 'asia',
        coverage: [
            'Various national curricula',
            'STEM-focused standards',
            'Regional exam systems',
            'Multilingual considerations',
            'Cultural context adaptations'
        ],
        microsims: [
            'Asian Geography Explorer',
            'Pacific Trade Routes',
            'Regional Language Map'
        ]
    },
    latam: {
        name: 'Latin America',
        colorClass: 'latam',
        coverage: [
            'Regional educational standards',
            'Spanish/Portuguese content',
            'Latin American history focus',
            'Regional STEM initiatives',
            'Cultural heritage content'
        ],
        microsims: [
            'Latin American Independence Timeline',
            'Amazon Ecosystem Explorer',
            'Regional Capitals Quiz'
        ]
    },
    global: {
        name: 'Global / Universal',
        colorClass: 'global',
        coverage: [
            'Universal physics principles',
            'Mathematical concepts',
            'Scientific method',
            'Logic and reasoning',
            'Language-independent visualizations'
        ],
        microsims: [
            'Pendulum Physics Simulator',
            'Pythagorean Theorem Visual',
            'Periodic Table Explorer'
        ]
    }
};

// Temporal coverage data (for temporal view)
const TEMPORAL_DATA = [
    { era: 'Ancient', years: 'Before 500 CE', examples: 'Classical civilizations, ancient mathematics' },
    { era: 'Medieval', years: '500-1500 CE', examples: 'Middle Ages, Islamic Golden Age' },
    { era: 'Early Modern', years: '1500-1800', examples: 'Renaissance, Scientific Revolution' },
    { era: 'Modern', years: '1800-1945', examples: 'Industrial era, World Wars' },
    { era: 'Contemporary', years: '1945-present', examples: 'Digital age, globalization' }
];

// Simplified GeoJSON for regions (bounding boxes)
// Note: UK is listed after EU so it renders on top (no overlap issues)
const REGION_GEOJSON = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { id: 'us', name: 'United States' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-125, 24], [-125, 49], [-67, 49], [-67, 24], [-125, 24]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { id: 'latam', name: 'Latin America' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-120, -55], [-120, 23], [-35, 23], [-35, -55], [-120, -55]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { id: 'asia', name: 'Asia-Pacific' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [60, -10], [60, 55], [180, 55], [180, -10], [60, -10]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { id: 'eu', name: 'European Union' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-10, 35], [-10, 48], [3, 48], [3, 60], [40, 60], [40, 35], [-10, 35]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { id: 'uk', name: 'United Kingdom' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-11, 49], [-11, 61], [3, 61], [3, 49], [-11, 49]
                ]]
            }
        }
    ]
};

// ===========================================
// STATE
// ===========================================

let map;
let geojsonLayer;
let currentView = 'geographic';
let selectedRegion = null;

// ===========================================
// MAP INITIALIZATION
// ===========================================

function initializeMap() {
    map = L.map('map', {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Add tile layer (light style for better region visibility)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: MAP_CONFIG.maxZoom
    }).addTo(map);

    // Add region polygons
    addRegionLayers();
}

// ===========================================
// REGION LAYERS
// ===========================================

function getRegionStyle(feature) {
    const regionId = feature.properties.id;
    const isSelected = selectedRegion === regionId;

    return {
        fillColor: REGION_COLORS[regionId],
        weight: isSelected ? 3 : 1,
        opacity: 1,
        color: isSelected ? '#333' : 'white',
        fillOpacity: isSelected ? 0.6 : 0.35
    };
}

function highlightRegion(e) {
    const layer = e.target;

    if (selectedRegion !== layer.feature.properties.id) {
        layer.setStyle({
            weight: 2,
            color: '#333',
            fillOpacity: 0.5
        });
    }

    layer.bringToFront();
}

function resetHighlight(e) {
    if (selectedRegion !== e.target.feature.properties.id) {
        geojsonLayer.resetStyle(e.target);
    }
}

function selectRegion(e) {
    const regionId = e.target.feature.properties.id;
    selectedRegion = regionId;

    // Reset all styles
    geojsonLayer.setStyle(getRegionStyle);

    // Highlight selected
    e.target.setStyle({
        weight: 3,
        color: '#333',
        fillOpacity: 0.6
    });

    // Update info panel
    updateInfoPanel(regionId);
}

function onEachRegion(feature, layer) {
    layer.on({
        mouseover: highlightRegion,
        mouseout: resetHighlight,
        click: selectRegion
    });
}

function addRegionLayers() {
    geojsonLayer = L.geoJSON(REGION_GEOJSON, {
        style: getRegionStyle,
        onEachFeature: onEachRegion
    }).addTo(map);
}

// ===========================================
// INFO PANEL
// ===========================================

function updateInfoPanel(regionId) {
    const panel = document.getElementById('region-info');

    if (!regionId) {
        panel.innerHTML = `
            <p>The <strong>Coverage</strong> element describes the spatial or temporal scope of educational content.</p>
            <p>Different regions have different curriculum standards that may affect how MicroSims are tagged.</p>
        `;
        return;
    }

    const data = REGION_DATA[regionId];

    if (currentView === 'geographic') {
        panel.innerHTML = `
            <div class="region-name ${data.colorClass}">${data.name}</div>
            <p><strong>Coverage Examples:</strong></p>
            <ul class="coverage-list">
                ${data.coverage.map(c => `<li>${c}</li>`).join('')}
            </ul>
            <div class="example-microsims">
                <h4>Example MicroSims:</h4>
                <ul>
                    ${data.microsims.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        // Temporal view
        panel.innerHTML = `
            <div class="region-name ${data.colorClass}">${data.name}</div>
            <div class="temporal-info">
                <h4>Temporal Coverage Options:</h4>
                ${TEMPORAL_DATA.map(t => `
                    <div class="era-item">
                        <span class="era-name">${t.era}</span>
                        <span class="era-years">${t.years}</span>
                    </div>
                `).join('')}
            </div>
            <p style="margin-top: 8px; font-size: 10px; color: #666;">
                Temporal coverage is region-independent but often combined with geographic scope.
            </p>
        `;
    }
}

function showGlobalInfo() {
    selectedRegion = 'global';

    // Reset region styles
    if (geojsonLayer) {
        geojsonLayer.setStyle(feature => ({
            fillColor: REGION_COLORS[feature.properties.id],
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.2  // Dim all regions
        }));
    }

    updateInfoPanel('global');
}

// ===========================================
// VIEW TOGGLE
// ===========================================

function setView(view) {
    currentView = view;

    // Update button states
    document.getElementById('btn-geographic').classList.toggle('active', view === 'geographic');
    document.getElementById('btn-temporal').classList.toggle('active', view === 'temporal');
    document.getElementById('btn-global').classList.toggle('active', view === 'global');

    if (view === 'global') {
        showGlobalInfo();
    } else if (selectedRegion && selectedRegion !== 'global') {
        updateInfoPanel(selectedRegion);
    } else {
        // Reset to default
        selectedRegion = null;
        if (geojsonLayer) {
            geojsonLayer.setStyle(getRegionStyle);
        }
        updateInfoPanel(null);
    }
}

// ===========================================
// EVENT HANDLERS
// ===========================================

function setupEventHandlers() {
    document.getElementById('btn-geographic').addEventListener('click', () => setView('geographic'));
    document.getElementById('btn-temporal').addEventListener('click', () => setView('temporal'));
    document.getElementById('btn-global').addEventListener('click', () => setView('global'));
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventHandlers();
});
