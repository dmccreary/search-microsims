// MicroSim Directory Structure Visualization
// Shows the standard file organization for MicroSims

// Node and edge data with file information
const fileInfo = {
    'sims': {
        name: 'sims/',
        type: 'folder',
        description: 'Root directory containing all MicroSim packages. Located under docs/ in a typical MkDocs project.'
    },
    'microsim-folder': {
        name: 'pendulum-physics/',
        type: 'folder',
        description: 'Individual MicroSim directory. Uses kebab-case naming (lowercase with hyphens). Contains all files for one simulation.'
    },
    'index-md': {
        name: 'index.md',
        type: 'required',
        description: 'Human-readable documentation file. Contains title, description, learning objectives, usage instructions, and teaching notes. Serves as the landing page in MkDocs.'
    },
    'main-html': {
        name: 'main.html',
        type: 'required',
        description: 'The simulation entry point. Contains HTML structure, canvas container, control elements, and links to CSS/libraries. Loads p5.js or other frameworks from CDN. JavaScript can be inline or in a separate script.js file. This is the file embedded in iframes.'
    },
    'script-js': {
        name: 'script.js',
        type: 'optional',
        description: 'Optional separate JavaScript file for simulation logic. Keeps code organized when simulations grow complex. Referenced from main.html via <script src="script.js">. Can also be named sketch.js for p5.js projects.'
    },
    'style-css': {
        name: 'style.css',
        type: 'optional',
        description: 'Custom stylesheet for visual presentation. Handles canvas sizing, control layout, typography, and responsive design. Can be omitted if using inline styles.'
    },
    'data-json': {
        name: 'data.json',
        type: 'optional',
        description: 'Structured data for the simulation. Separates content from code for easier maintenance. Teachers can modify data without JavaScript knowledge.'
    },
    'metadata-json': {
        name: 'metadata.json',
        type: 'optional',
        description: 'Machine-readable metadata using Dublin Core standard. Enables search indexing, AI discovery, and educational platform integration. Highly recommended!'
    }
};

// Colors for different node types
const colors = {
    folder: {
        background: '#FFD700',
        border: '#B8860B',
        font: '#333333',
        highlight: { background: '#FFEC8B', border: '#DAA520' }
    },
    required: {
        background: '#2196f3',
        border: '#1565c0',
        font: '#ffffff',
        highlight: { background: '#64b5f6', border: '#1976d2' }
    },
    optional: {
        background: '#4caf50',
        border: '#2e7d32',
        font: '#ffffff',
        highlight: { background: '#81c784', border: '#388e3c' }
    }
};

// Node definitions with icons represented as Unicode characters
const nodeData = [
    {
        id: 'sims',
        label: '\uD83D\uDCC1 sims/',
        x: 0,
        y: -150,
        ...colors.folder
    },
    {
        id: 'microsim-folder',
        label: '\uD83D\uDCC2 pendulum-physics/',
        x: 0,
        y: -50,
        ...colors.folder
    },
    {
        id: 'index-md',
        label: '\uD83D\uDCC4 index.md',
        x: -210,
        y: 50,
        ...colors.required
    },
    {
        id: 'main-html',
        label: '\u2329/\u232A main.html',
        x: -70,
        y: 50,
        ...colors.required
    },
    {
        id: 'style-css',
        label: '\uD83C\uDFA8 style.css',
        x: 70,
        y: 50,
        ...colors.optional
    },
    {
        id: 'script-js',
        label: '\uD83D\uDCDC script.js',
        x: 210,
        y: 50,
        ...colors.optional
    },
    {
        id: 'data-json',
        label: '{ } data.json',
        x: -70,
        y: 140,
        ...colors.optional
    },
    {
        id: 'metadata-json',
        label: '\uD83C\uDFF7\uFE0F metadata.json',
        x: 100,
        y: 140,
        ...colors.optional
    }
];

// Edge definitions (parent to child relationships)
const edgeData = [
    { from: 'sims', to: 'microsim-folder' },
    { from: 'microsim-folder', to: 'index-md' },
    { from: 'microsim-folder', to: 'main-html' },
    { from: 'microsim-folder', to: 'style-css' },
    { from: 'microsim-folder', to: 'script-js' },
    { from: 'microsim-folder', to: 'data-json' },
    { from: 'microsim-folder', to: 'metadata-json' }
];

let network;

function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function initializeNetwork() {
    const nodes = new vis.DataSet(nodeData.map(node => ({
        id: node.id,
        label: node.label,
        x: node.x,
        y: node.y,
        shape: 'box',
        color: {
            background: node.background,
            border: node.border,
            highlight: node.highlight || { background: node.background, border: node.border }
        },
        font: {
            color: node.font,
            size: 14,
            face: 'Arial'
        },
        margin: { top: 8, bottom: 8, left: 12, right: 12 },
        borderWidth: 2,
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.15)',
            size: 4,
            x: 2,
            y: 2
        }
    })));

    const edges = new vis.DataSet(edgeData.map((edge, index) => ({
        id: index,
        from: edge.from,
        to: edge.to,
        color: { color: '#666666', highlight: '#333333' },
        width: 2,
        smooth: {
            type: 'cubicBezier',
            forceDirection: 'vertical',
            roundness: 0.3
        }
    })));

    const enableMouseInteraction = !isInIframe();

    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            selectConnectedEdges: false,
            zoomView: enableMouseInteraction,
            dragView: enableMouseInteraction,
            dragNodes: false,
            hover: true,
            navigationButtons: true
        },
        nodes: {
            shape: 'box'
        },
        edges: {
            arrows: { to: { enabled: false } }
        }
    };

    const container = document.getElementById('network');
    const data = { nodes: nodes, edges: edges };
    network = new vis.Network(container, data, options);

    // Set up hover events
    network.on('hoverNode', function(params) {
        showNodeInfo(params.node);
    });

    network.on('blurNode', function() {
        hideNodeInfo();
    });

    // Position the view with asymmetric padding (more on right for info panel)
    setTimeout(() => {
        network.fit({
            animation: false,
            padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 220  // Leave room for the info panel
            }
        });
    }, 100);
}

function showNodeInfo(nodeId) {
    const info = fileInfo[nodeId];
    if (!info) return;

    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');

    let typeLabel = '';
    let typeColor = '';

    switch(info.type) {
        case 'folder':
            typeLabel = 'Directory';
            typeColor = '#B8860B';
            break;
        case 'required':
            typeLabel = 'Required File';
            typeColor = '#1565c0';
            break;
        case 'optional':
            typeLabel = 'Optional File';
            typeColor = '#2e7d32';
            break;
    }

    infoTitle.textContent = info.name;
    infoContent.innerHTML = `
        <p style="margin-bottom: 8px;"><strong style="color: ${typeColor};">${typeLabel}</strong></p>
        <p>${info.description}</p>
    `;

    infoPanel.style.borderColor = typeColor;
}

function hideNodeInfo() {
    const infoContent = document.getElementById('info-content');
    const infoTitle = document.getElementById('info-title');
    const infoPanel = document.getElementById('info-panel');

    infoTitle.textContent = 'File Details';
    infoContent.innerHTML = '<p class="info-placeholder">Hover over a node to see details</p>';
    infoPanel.style.borderColor = '#2196f3';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeNetwork);
