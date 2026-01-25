// HTML Architecture Diagram
// Shows the structure of a MicroSim's main.html file

const elementInfo = {
    'doctype': {
        name: '<!DOCTYPE html>',
        type: 'document',
        description: 'Document type declaration. Tells the browser this is an HTML5 document.',
        code: '<!DOCTYPE html>'
    },
    'html': {
        name: '<html>',
        type: 'document',
        description: 'Root element of the HTML document. Contains all other elements. The lang attribute specifies the language.',
        code: '<html lang="en">\n  <head>...</head>\n  <body>...</body>\n</html>'
    },
    'head': {
        name: '<head>',
        type: 'head',
        description: 'Contains metadata about the document: character encoding, viewport settings, title, stylesheets, and script imports.',
        code: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" ...>\n  <title>...</title>\n  <link rel="stylesheet" ...>\n  <script src="..."></script>\n</head>'
    },
    'meta-charset': {
        name: '<meta charset>',
        type: 'head',
        description: 'Specifies the character encoding. UTF-8 supports all international characters.',
        code: '<meta charset="UTF-8">'
    },
    'meta-viewport': {
        name: '<meta viewport>',
        type: 'head',
        description: 'Controls how the page scales on mobile devices. Essential for responsive design.',
        code: '<meta name="viewport"\n      content="width=device-width,\n               initial-scale=1.0">'
    },
    'title': {
        name: '<title>',
        type: 'head',
        description: 'Sets the page title shown in the browser tab and used by search engines.',
        code: '<title>Pendulum Simulator</title>'
    },
    'link-css': {
        name: '<link> CSS',
        type: 'script',
        description: 'Links to an external CSS stylesheet for styling the simulation.',
        code: '<link rel="stylesheet"\n      href="style.css">'
    },
    'script-lib': {
        name: '<script> Library',
        type: 'script',
        description: 'Imports external JavaScript libraries like p5.js from a CDN.',
        code: '<script src="https://cdnjs.cloudflare.com\n  /ajax/libs/p5.js/1.9.0/p5.min.js">\n</script>'
    },
    'body': {
        name: '<body>',
        type: 'body',
        description: 'Contains all visible content: the canvas container, control elements, and script tags.',
        code: '<body>\n  <div id="canvas-container">\n  </div>\n  <div id="controls">...</div>\n  <script src="sketch.js">\n  </script>\n</body>'
    },
    'canvas-div': {
        name: 'Canvas Container',
        type: 'body',
        description: 'A div element where the p5.js canvas is rendered. The simulation draws here.',
        code: '<div id="canvas-container">\n  <!-- p5.js canvas renders here -->\n</div>'
    },
    'controls-div': {
        name: 'Controls Container',
        type: 'body',
        description: 'Contains interactive controls like sliders, buttons, and input fields.',
        code: '<div id="controls">\n  <label>Length:\n    <input type="range" id="length">\n  </label>\n  <button id="start">Start</button>\n</div>'
    },
    'script-app': {
        name: '<script> App',
        type: 'script',
        description: 'Links to the main application JavaScript file containing simulation logic.',
        code: '<script src="sketch.js"></script>'
    }
};

const colors = {
    document: {
        background: '#9c27b0',
        border: '#6a1b9a',
        font: '#ffffff',
        highlight: { background: '#ba68c8', border: '#7b1fa2' }
    },
    head: {
        background: '#2196f3',
        border: '#1565c0',
        font: '#ffffff',
        highlight: { background: '#64b5f6', border: '#1976d2' }
    },
    body: {
        background: '#4caf50',
        border: '#2e7d32',
        font: '#ffffff',
        highlight: { background: '#81c784', border: '#388e3c' }
    },
    script: {
        background: '#ff9800',
        border: '#e65100',
        font: '#000000',
        highlight: { background: '#ffb74d', border: '#f57c00' }
    }
};

const nodeData = [
    { id: 'doctype', label: '<!DOCTYPE html>', x: -250, y: -180, type: 'document' },
    { id: 'html', label: '<html>', x: -250, y: -100, type: 'document' },
    { id: 'head', label: '<head>', x: -350, y: -20, type: 'head' },
    { id: 'body', label: '<body>', x: -150, y: -20, type: 'body' },
    { id: 'meta-charset', label: 'charset', x: -450, y: 60, type: 'head' },
    { id: 'meta-viewport', label: 'viewport', x: -380, y: 60, type: 'head' },
    { id: 'title', label: '<title>', x: -310, y: 60, type: 'head' },
    { id: 'link-css', label: 'style.css', x: -420, y: 130, type: 'script' },
    { id: 'script-lib', label: 'p5.js CDN', x: -340, y: 130, type: 'script' },
    { id: 'canvas-div', label: 'canvas', x: -200, y: 60, type: 'body' },
    { id: 'controls-div', label: 'controls', x: -120, y: 60, type: 'body' },
    { id: 'script-app', label: 'sketch.js', x: -160, y: 130, type: 'script' }
];

const edgeData = [
    { from: 'doctype', to: 'html' },
    { from: 'html', to: 'head' },
    { from: 'html', to: 'body' },
    { from: 'head', to: 'meta-charset' },
    { from: 'head', to: 'meta-viewport' },
    { from: 'head', to: 'title' },
    { from: 'head', to: 'link-css' },
    { from: 'head', to: 'script-lib' },
    { from: 'body', to: 'canvas-div' },
    { from: 'body', to: 'controls-div' },
    { from: 'body', to: 'script-app' }
];

let network;
let selectedNode = null;

function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function initializeNetwork() {
    const nodes = new vis.DataSet(nodeData.map(node => {
        const colorSet = colors[node.type];
        return {
            id: node.id,
            label: node.label,
            x: node.x,
            y: node.y,
            shape: 'box',
            color: {
                background: colorSet.background,
                border: colorSet.border,
                highlight: colorSet.highlight
            },
            font: {
                color: colorSet.font,
                size: 12,
                face: 'Consolas, Monaco, monospace'
            },
            margin: { top: 6, bottom: 6, left: 10, right: 10 },
            borderWidth: 2,
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.15)',
                size: 4,
                x: 2,
                y: 2
            }
        };
    }));

    const edges = new vis.DataSet(edgeData.map((edge, index) => ({
        id: index,
        from: edge.from,
        to: edge.to,
        color: { color: '#666666', highlight: '#333333' },
        width: 2,
        smooth: {
            type: 'cubicBezier',
            forceDirection: 'vertical',
            roundness: 0.2
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
        edges: {
            arrows: { to: { enabled: false } }
        }
    };

    const container = document.getElementById('network');
    const data = { nodes: nodes, edges: edges };
    network = new vis.Network(container, data, options);

    // Click to show code
    network.on('click', function(params) {
        if (params.nodes.length > 0) {
            showNodeInfo(params.nodes[0]);
        }
    });

    // Hover for highlight
    network.on('hoverNode', function(params) {
        document.body.style.cursor = 'pointer';
    });

    network.on('blurNode', function() {
        document.body.style.cursor = 'default';
    });

    // Position the view
    setTimeout(() => {
        network.moveTo({
            position: { x: -280, y: -20 },
            scale: 1.0,
            animation: false
        });
    }, 100);
}

function showNodeInfo(nodeId) {
    const info = elementInfo[nodeId];
    if (!info) return;

    selectedNode = nodeId;

    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');
    const codePanel = document.getElementById('code-panel');
    const codeContent = document.getElementById('code-content');

    const typeColors = {
        'document': '#6a1b9a',
        'head': '#1565c0',
        'body': '#2e7d32',
        'script': '#e65100'
    };

    const typeLabels = {
        'document': 'Document Root',
        'head': 'Head Element',
        'body': 'Body Element',
        'script': 'External Resource'
    };

    infoTitle.textContent = info.name;
    infoContent.innerHTML = `
        <p style="margin-bottom: 8px;"><strong style="color: ${typeColors[info.type]};">${typeLabels[info.type]}</strong></p>
        <p>${info.description}</p>
    `;

    infoPanel.style.borderColor = typeColors[info.type];

    // Show code panel
    codePanel.style.display = 'block';
    codeContent.textContent = info.code;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeNetwork);
