// Metadata Schema Structure Visualization
// Shows the hierarchical structure of metadata.json

const fieldInfo = {
    'microsim': {
        name: 'microsim',
        section: 'root',
        description: 'Root object containing all MicroSim metadata. Every metadata.json file starts with this key.',
        example: '{ "microsim": { ... } }'
    },
    // Dublin Core section
    'dublinCore': {
        name: 'dublinCore',
        section: 'dublin',
        description: 'Standard Dublin Core metadata fields. Based on the Dublin Core Metadata Initiative (DCMI) standard for describing resources.',
        example: '"dublinCore": { "title": "...", "description": "..." }'
    },
    'title': {
        name: 'title',
        section: 'dublin',
        description: 'The name of the MicroSim. Should be descriptive and unique.',
        example: '"title": "Pendulum Physics Simulator"'
    },
    'description': {
        name: 'description',
        section: 'dublin',
        description: 'A brief summary of what the MicroSim does and teaches. Used in search results.',
        example: '"description": "Interactive simulation demonstrating pendulum motion"'
    },
    'creator': {
        name: 'creator',
        section: 'dublin',
        description: 'The person or organization who created the MicroSim.',
        example: '"creator": "Dr. Jane Smith"'
    },
    'date': {
        name: 'date',
        section: 'dublin',
        description: 'Creation or last modification date in ISO 8601 format.',
        example: '"date": "2026-01-24"'
    },
    'rights': {
        name: 'rights',
        section: 'dublin',
        description: 'License or copyright information for the MicroSim.',
        example: '"rights": "CC BY-NC-SA 4.0"'
    },
    // Educational section
    'educational': {
        name: 'educational',
        section: 'education',
        description: 'Fields describing the educational context and learning outcomes of the MicroSim.',
        example: '"educational": { "subjectArea": [...], "gradeLevel": [...] }'
    },
    'subjectArea': {
        name: 'subjectArea',
        section: 'education',
        description: 'Academic subjects this MicroSim relates to. Used for faceted search.',
        example: '"subjectArea": ["Physics", "Mathematics"]'
    },
    'gradeLevel': {
        name: 'gradeLevel',
        section: 'education',
        description: 'Target audience grade levels. K-12, Undergraduate, Graduate, Adult.',
        example: '"gradeLevel": ["High School", "Undergraduate"]'
    },
    'bloomsTaxonomy': {
        name: 'bloomsTaxonomy',
        section: 'pedagogical',
        description: 'All Bloom levels the CONTENT can address (content scope). Typically broader than bloomAlignment.',
        example: '"bloomsTaxonomy": ["Remember", "Understand", "Apply", "Create"]'
    },
    'difficulty': {
        name: 'difficulty',
        section: 'education',
        description: 'Complexity level: Beginner, Intermediate, or Advanced.',
        example: '"difficulty": "Intermediate"'
    },
    'learningObjectives': {
        name: 'learningObjectives',
        section: 'education',
        description: 'Specific skills or knowledge students should gain from using this MicroSim.',
        example: '"learningObjectives": ["Explain how pendulum length affects period"]'
    },
    // Technical section
    'technical': {
        name: 'technical',
        section: 'technical',
        description: 'Implementation details about the MicroSim technology stack.',
        example: '"technical": { "framework": "p5.js", ... }'
    },
    'framework': {
        name: 'framework',
        section: 'technical',
        description: 'JavaScript library used: p5.js, d3.js, three.js, Chart.js, etc.',
        example: '"framework": "p5.js"'
    },
    'libraryVersion': {
        name: 'libraryVersion',
        section: 'technical',
        description: 'Version of the main JavaScript library used.',
        example: '"libraryVersion": "1.9.0"'
    },
    'browserSupport': {
        name: 'browserSupport',
        section: 'technical',
        description: 'List of supported web browsers.',
        example: '"browserSupport": ["Chrome", "Firefox", "Safari"]'
    },
    // Search section
    'search': {
        name: 'search',
        section: 'search',
        description: 'Fields that enhance discoverability in search systems and AI indexing.',
        example: '"search": { "keywords": [...], "visualizationType": [...] }'
    },
    'keywords': {
        name: 'keywords',
        section: 'search',
        description: 'Search terms and phrases that help users find this MicroSim.',
        example: '"keywords": ["pendulum", "oscillation", "physics simulation"]'
    },
    'visualizationType': {
        name: 'visualizationType',
        section: 'search',
        description: 'Type of visualization: animation, chart, simulation, diagram, etc.',
        example: '"visualizationType": ["simulation", "animation"]'
    },
    'interactionLevel': {
        name: 'interactionLevel',
        section: 'search',
        description: 'How interactive is the MicroSim: low, medium, or high.',
        example: '"interactionLevel": "high"'
    },
    // Pedagogical section
    'pedagogical': {
        name: 'pedagogical',
        section: 'pedagogical',
        description: 'Fields describing how the MicroSim supports learning, enabling matching of interaction patterns to learning objectives.',
        example: '"pedagogical": { "pattern": "exploration", "pacing": "self-paced" }'
    },
    'pattern': {
        name: 'pattern',
        section: 'pedagogical',
        description: 'Interaction pattern type: worked-example, exploration, practice, assessment, reference, demonstration, guided-discovery.',
        example: '"pattern": "exploration"'
    },
    'bloomAlignment': {
        name: 'bloomAlignment',
        section: 'pedagogical',
        description: 'Bloom levels the INTERACTION PATTERN effectively supports (pattern effectiveness). Typically narrower than bloomsTaxonomy.',
        example: '"bloomAlignment": ["understand", "apply"]'
    },
    'bloomVerbs': {
        name: 'bloomVerbs',
        section: 'pedagogical',
        description: 'Specific Bloom action verbs supported: explain, experiment, calculate, predict, etc. (36 verbs total).',
        example: '"bloomVerbs": ["explain", "predict", "experiment"]'
    },
    'pacing': {
        name: 'pacing',
        section: 'pedagogical',
        description: 'How the MicroSim controls time: self-paced, continuous, step-through, or timed.',
        example: '"pacing": "self-paced"'
    },
    'supportsPrediction': {
        name: 'supportsPrediction',
        section: 'pedagogical',
        description: 'Whether learners can predict outcomes before observing. Critical for Understand objectives.',
        example: '"supportsPrediction": true'
    },
    'dataVisibility': {
        name: 'dataVisibility',
        section: 'pedagogical',
        description: 'How much data is shown to learners: high, medium, or low.',
        example: '"dataVisibility": "high"'
    },
    'interactionStyle': {
        name: 'interactionStyle',
        section: 'pedagogical',
        description: 'How learners interact: observe, manipulate, construct, respond, or explore.',
        example: '"interactionStyle": "manipulate"'
    }
};

const colors = {
    root: {
        background: '#607d8b',
        border: '#37474f',
        font: '#ffffff',
        highlight: { background: '#78909c', border: '#455a64' }
    },
    dublin: {
        background: '#2196f3',
        border: '#1565c0',
        font: '#ffffff',
        highlight: { background: '#64b5f6', border: '#1976d2' }
    },
    education: {
        background: '#4caf50',
        border: '#2e7d32',
        font: '#ffffff',
        highlight: { background: '#81c784', border: '#388e3c' }
    },
    technical: {
        background: '#ff9800',
        border: '#e65100',
        font: '#000000',
        highlight: { background: '#ffb74d', border: '#f57c00' }
    },
    search: {
        background: '#9c27b0',
        border: '#6a1b9a',
        font: '#ffffff',
        highlight: { background: '#ba68c8', border: '#7b1fa2' }
    },
    pedagogical: {
        background: '#e91e63',
        border: '#ad1457',
        font: '#ffffff',
        highlight: { background: '#f06292', border: '#c2185b' }
    }
};

// Node layout - radial from center with 5 sections
const nodeData = [
    // Root
    { id: 'microsim', label: 'microsim', x: 0, y: -220, section: 'root' },

    // Main sections (5 columns)
    { id: 'dublinCore', label: 'dublinCore', x: -300, y: -120, section: 'dublin' },
    { id: 'educational', label: 'educational', x: -150, y: -120, section: 'education' },
    { id: 'pedagogical', label: 'pedagogical', x: 0, y: -120, section: 'pedagogical' },
    { id: 'technical', label: 'technical', x: 150, y: -120, section: 'technical' },
    { id: 'search', label: 'search', x: 300, y: -120, section: 'search' },

    // Dublin Core fields
    { id: 'title', label: 'title', x: -360, y: -30, section: 'dublin' },
    { id: 'description', label: 'description', x: -280, y: -30, section: 'dublin' },
    { id: 'creator', label: 'creator', x: -320, y: 50, section: 'dublin' },
    { id: 'date', label: 'date', x: -360, y: 130, section: 'dublin' },
    { id: 'rights', label: 'rights', x: -280, y: 130, section: 'dublin' },

    // Educational fields
    { id: 'subjectArea', label: 'subjectArea', x: -200, y: -30, section: 'education' },
    { id: 'gradeLevel', label: 'gradeLevel', x: -120, y: -30, section: 'education' },
    { id: 'difficulty', label: 'difficulty', x: -200, y: 50, section: 'education' },
    { id: 'learningObjectives', label: 'learningObjectives', x: -120, y: 50, section: 'education' },

    // Pedagogical fields
    { id: 'pattern', label: 'pattern', x: -60, y: -30, section: 'pedagogical' },
    { id: 'pacing', label: 'pacing', x: 60, y: -30, section: 'pedagogical' },
    { id: 'bloomsTaxonomy', label: 'bloomsTaxonomy', x: -60, y: 50, section: 'pedagogical' },
    { id: 'bloomAlignment', label: 'bloomAlignment', x: 60, y: 50, section: 'pedagogical' },
    { id: 'bloomVerbs', label: 'bloomVerbs', x: 0, y: 130, section: 'pedagogical' },
    { id: 'supportsPrediction', label: 'supportsPrediction', x: -70, y: 200, section: 'pedagogical' },
    { id: 'dataVisibility', label: 'dataVisibility', x: 70, y: 200, section: 'pedagogical' },
    { id: 'interactionStyle', label: 'interactionStyle', x: 0, y: 270, section: 'pedagogical' },

    // Technical fields
    { id: 'framework', label: 'framework', x: 120, y: -30, section: 'technical' },
    { id: 'libraryVersion', label: 'libraryVersion', x: 200, y: -30, section: 'technical' },
    { id: 'browserSupport', label: 'browserSupport', x: 160, y: 50, section: 'technical' },

    // Search fields
    { id: 'keywords', label: 'keywords', x: 260, y: -30, section: 'search' },
    { id: 'visualizationType', label: 'visualizationType', x: 360, y: -30, section: 'search' },
    { id: 'interactionLevel', label: 'interactionLevel', x: 310, y: 50, section: 'search' }
];

const edgeData = [
    // Root to sections
    { from: 'microsim', to: 'dublinCore' },
    { from: 'microsim', to: 'educational' },
    { from: 'microsim', to: 'pedagogical' },
    { from: 'microsim', to: 'technical' },
    { from: 'microsim', to: 'search' },

    // Dublin Core fields
    { from: 'dublinCore', to: 'title' },
    { from: 'dublinCore', to: 'description' },
    { from: 'dublinCore', to: 'creator' },
    { from: 'dublinCore', to: 'date' },
    { from: 'dublinCore', to: 'rights' },

    // Educational fields
    { from: 'educational', to: 'subjectArea' },
    { from: 'educational', to: 'gradeLevel' },
    { from: 'educational', to: 'difficulty' },
    { from: 'educational', to: 'learningObjectives' },

    // Pedagogical fields
    { from: 'pedagogical', to: 'pattern' },
    { from: 'pedagogical', to: 'pacing' },
    { from: 'pedagogical', to: 'bloomsTaxonomy' },
    { from: 'pedagogical', to: 'bloomAlignment' },
    { from: 'pedagogical', to: 'bloomVerbs' },
    { from: 'pedagogical', to: 'supportsPrediction' },
    { from: 'pedagogical', to: 'dataVisibility' },
    { from: 'pedagogical', to: 'interactionStyle' },

    // Technical fields
    { from: 'technical', to: 'framework' },
    { from: 'technical', to: 'libraryVersion' },
    { from: 'technical', to: 'browserSupport' },

    // Search fields
    { from: 'search', to: 'keywords' },
    { from: 'search', to: 'visualizationType' },
    { from: 'search', to: 'interactionLevel' }
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
    const nodes = new vis.DataSet(nodeData.map(node => {
        const colorSet = colors[node.section];
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
                size: 11,
                face: 'Arial'
            },
            margin: { top: 5, bottom: 5, left: 6, right: 6 },
            borderWidth: 2,
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.15)',
                size: 3,
                x: 1,
                y: 1
            }
        };
    }));

    const edges = new vis.DataSet(edgeData.map((edge, index) => ({
        id: index,
        from: edge.from,
        to: edge.to,
        color: { color: '#999999', highlight: '#666666' },
        width: 1.5,
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

    // Click to show info or hide panel
    network.on('click', function(params) {
        const rightPanel = document.querySelector('.right-panel');
        if (params.nodes.length > 0) {
            rightPanel.style.display = 'flex';
            showFieldInfo(params.nodes[0]);
        } else {
            rightPanel.style.display = 'none';
        }
    });

    network.on('hoverNode', function() {
        document.body.style.cursor = 'pointer';
    });

    network.on('blurNode', function() {
        document.body.style.cursor = 'default';
    });

    // Wait for network to render, then pan to make room for info panel on right
    network.once('afterDrawing', function() {
        // Get current view position
        const currentPosition = network.getViewPosition();
        // Move camera right so diagram appears on left side
        network.moveTo({
            position: { x: currentPosition.x, y: currentPosition.y - 80 },
            scale: 0.95,
            animation: false
        });
    });
}

function showFieldInfo(fieldId) {
    const info = fieldInfo[fieldId];
    if (!info) return;

    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');

    const sectionColors = {
        'root': '#37474f',
        'dublin': '#1565c0',
        'education': '#2e7d32',
        'pedagogical': '#ad1457',
        'technical': '#e65100',
        'search': '#6a1b9a'
    };

    const sectionLabels = {
        'root': 'Root Object',
        'dublin': 'Dublin Core',
        'education': 'Educational',
        'pedagogical': 'Pedagogical',
        'technical': 'Technical',
        'search': 'Search'
    };

    infoTitle.textContent = info.name;
    infoContent.innerHTML = `
        <p style="margin-bottom: 6px;"><strong style="color: ${sectionColors[info.section]};">${sectionLabels[info.section]}</strong></p>
        <p style="margin-bottom: 8px;">${info.description}</p>
        <code class="example-value">${info.example}</code>
    `;

    infoPanel.style.borderColor = sectionColors[info.section];
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeNetwork);
