// Subject Hierarchy Taxonomy Explorer
// Interactive vis-network visualization of subject classification hierarchy
// Bloom Level: Understand (L2) | Verb: classify

// ===========================================
// NODE COLOR DEFINITIONS
// ===========================================
const colors = {
    discipline: {
        background: 'lightblue',
        border: '#1565C0',
        font: '#333333',
        highlight: { background: '#64B5F6', border: '#1976D2' }
    },
    domain: {
        background: '#4CAF50',
        border: '#2E7D32',
        font: '#ffffff',
        highlight: { background: '#81C784', border: '#388E3C' }
    },
    topic: {
        background: '#FF9800',
        border: '#E65100',
        font: '#ffffff',
        highlight: { background: '#FFB74D', border: '#F57C00' }
    },
    dimmed: {
        background: '#E0E0E0',
        border: '#BDBDBD',
        font: '#999999'
    }
};

// ===========================================
// STATE VARIABLES
// ===========================================
let taxonomyData = { nodes: [], edges: [] };
let network = null;
let nodes = null;
let edges = null;
let isHierarchical = true;
let expandedNodes = new Set();
let selectedNode = null;

// ===========================================
// DATA LOADING
// ===========================================

async function loadTaxonomyData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        taxonomyData.nodes = data.nodes;
        taxonomyData.edges = [];

        // Build edges from parent relationships
        taxonomyData.nodes.forEach(node => {
            if (node.parent) {
                taxonomyData.edges.push({
                    from: node.parent,
                    to: node.id
                });
            }
        });

        // Initialize expanded nodes (disciplines start expanded)
        taxonomyData.nodes
            .filter(n => n.type === 'discipline')
            .forEach(n => expandedNodes.add(n.id));

        // Initialize the network
        initializeNetwork();
        setupSearch();
        setupControls();

    } catch (error) {
        console.error('Error loading taxonomy data:', error);
        document.getElementById('network').innerHTML =
            '<p style="color: red; padding: 20px;">Error loading data.json. Make sure the file exists.</p>';
    }
}

// ===========================================
// ENVIRONMENT DETECTION
// ===========================================
function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getNodeLevel(nodeId) {
    const node = taxonomyData.nodes.find(n => n.id === nodeId);
    if (!node) return -1;
    if (node.type === 'discipline') return 0;
    if (node.type === 'domain') return 1;
    return 2;
}

function getChildren(nodeId) {
    return taxonomyData.nodes.filter(n => n.parent === nodeId).map(n => n.id);
}

function getAncestors(nodeId) {
    const ancestors = [];
    let current = taxonomyData.nodes.find(n => n.id === nodeId);
    while (current && current.parent) {
        ancestors.unshift(current.parent);
        current = taxonomyData.nodes.find(n => n.id === current.parent);
    }
    return ancestors;
}

function getVisibleNodes() {
    const visible = new Set();

    // Always show disciplines
    taxonomyData.nodes
        .filter(n => n.type === 'discipline')
        .forEach(n => visible.add(n.id));

    // Show children of expanded nodes
    expandedNodes.forEach(nodeId => {
        getChildren(nodeId).forEach(childId => visible.add(childId));
    });

    return visible;
}

function getVisibleEdges(visibleNodeIds) {
    return taxonomyData.edges.filter(e =>
        visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)
    );
}

// ===========================================
// NETWORK INITIALIZATION
// ===========================================

function createNodeData(nodeId, dimmed = false) {
    const nodeInfo = taxonomyData.nodes.find(n => n.id === nodeId);
    if (!nodeInfo) return null;

    const colorSet = dimmed ? colors.dimmed : colors[nodeInfo.type];
    const hasChildren = getChildren(nodeId).length > 0;
    const isExpanded = expandedNodes.has(nodeId);

    // Size based on type
    let size;
    switch (nodeInfo.type) {
        case 'discipline': size = 40; break;
        case 'domain': size = 30; break;
        case 'topic': size = 22; break;
        default: size = 25;
    }

    // Add expand indicator to label if has children
    let label = nodeInfo.label;
    if (hasChildren && nodeInfo.type !== 'discipline') {
        label += isExpanded ? ' [-]' : ' [+]';
    }

    return {
        id: nodeId,
        label: label,
        title: `${nodeInfo.description}\n\nClick to ${isExpanded ? 'collapse' : 'expand'}`,
        shape: 'circle',
        size: size,
        color: {
            background: colorSet.background,
            border: colorSet.border,
            highlight: colorSet.highlight || { background: colorSet.background, border: colorSet.border }
        },
        font: {
            color: colorSet.font,
            size: nodeInfo.type === 'topic' ? 11 : 13,
            face: 'Arial',
            multi: 'html'
        },
        borderWidth: 3,
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.2)',
            size: 5,
            x: 2,
            y: 2
        }
    };
}

function buildNetworkData() {
    const visibleNodeIds = getVisibleNodes();
    const visibleEdges = getVisibleEdges(visibleNodeIds);

    const nodeDataArray = [];
    visibleNodeIds.forEach(nodeId => {
        const nodeData = createNodeData(nodeId);
        if (nodeData) nodeDataArray.push(nodeData);
    });

    const edgeDataArray = visibleEdges.map((edge, idx) => ({
        id: `e${idx}`,
        from: edge.from,
        to: edge.to,
        arrows: { to: { enabled: true, scaleFactor: 0.8 } },
        color: { color: '#888888', opacity: 0.7 },
        width: 2,
        smooth: { type: 'cubicBezier', roundness: 0.3 }
    }));

    return { nodes: nodeDataArray, edges: edgeDataArray };
}

function getLayoutOptions() {
    const enableMouseInteraction = !isInIframe();

    const baseOptions = {
        interaction: {
            zoomView: enableMouseInteraction,
            dragView: enableMouseInteraction,
            navigationButtons: true,
            hover: true,
            tooltipDelay: 200
        },
        nodes: {
            shape: 'circle'
        },
        edges: {
            smooth: { type: 'cubicBezier', roundness: 0.3 }
        }
    };

    if (isHierarchical) {
        return {
            ...baseOptions,
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 120,
                    nodeSpacing: 100,
                    treeSpacing: 150
                }
            },
            physics: { enabled: false }
        };
    } else {
        return {
            ...baseOptions,
            layout: {
                hierarchical: { enabled: false }
            },
            physics: {
                enabled: true,
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -100,
                    centralGravity: 0.01,
                    springLength: 150,
                    springConstant: 0.08,
                    damping: 0.4
                },
                stabilization: {
                    enabled: true,
                    iterations: 200,
                    updateInterval: 25
                }
            }
        };
    }
}

function initializeNetwork() {
    const container = document.getElementById('network');
    const data = buildNetworkData();

    nodes = new vis.DataSet(data.nodes);
    edges = new vis.DataSet(data.edges);

    const options = getLayoutOptions();

    network = new vis.Network(container, { nodes, edges }, options);

    // Disable physics after stabilization in radial mode
    if (!isHierarchical) {
        network.on('stabilizationIterationsDone', () => {
            network.setOptions({ physics: { enabled: false } });
        });
    }

    // Set up event handlers
    network.on('click', handleNodeClick);
    network.on('hoverNode', handleNodeHover);
    network.on('blurNode', handleNodeBlur);

    // Position view for hierarchical layout
    if (isHierarchical) {
        network.once('afterDrawing', () => {
            const pos = network.getViewPosition();
            network.moveTo({
                position: { x: pos.x + 60, y: pos.y },
                animation: false
            });
        });
    }
}

function refreshNetwork() {
    const data = buildNetworkData();
    nodes.clear();
    edges.clear();
    nodes.add(data.nodes);
    edges.add(data.edges);

    // Re-apply layout
    network.setOptions(getLayoutOptions());

    if (!isHierarchical) {
        network.stabilize(200);
    }
}

// ===========================================
// EVENT HANDLERS
// ===========================================

function handleNodeClick(params) {
    if (params.nodes.length === 0) {
        clearSelection();
        return;
    }

    const nodeId = params.nodes[0];
    const children = getChildren(nodeId);

    // Toggle expand/collapse
    if (children.length > 0) {
        if (expandedNodes.has(nodeId)) {
            // Collapse: remove this node and all descendants from expanded set
            expandedNodes.delete(nodeId);
            collapseDescendants(nodeId);
        } else {
            // Expand
            expandedNodes.add(nodeId);
        }
        refreshNetwork();
    }

    // Show node info and breadcrumb
    selectedNode = nodeId;
    showNodeInfo(nodeId);
    showBreadcrumb(nodeId);
}

function collapseDescendants(nodeId) {
    getChildren(nodeId).forEach(childId => {
        expandedNodes.delete(childId);
        collapseDescendants(childId);
    });
}

function handleNodeHover(params) {
    const nodeId = params.node;
    showNodeInfo(nodeId);
}

function handleNodeBlur(params) {
    if (!selectedNode) {
        hideNodeInfo();
    } else {
        showNodeInfo(selectedNode);
    }
}

function clearSelection() {
    selectedNode = null;
    hideNodeInfo();
    hideBreadcrumb();
}

// ===========================================
// UI UPDATES
// ===========================================

function showNodeInfo(nodeId) {
    const nodeInfo = taxonomyData.nodes.find(n => n.id === nodeId);
    if (!nodeInfo) return;

    const panel = document.getElementById('node-info');
    const title = document.getElementById('info-title');
    const type = document.getElementById('info-type');
    const desc = document.getElementById('info-desc');
    const example = document.getElementById('info-example');

    title.textContent = nodeInfo.label.replace('\n', ' ');
    type.textContent = nodeInfo.type;
    type.className = 'node-info-type ' + nodeInfo.type;
    desc.textContent = nodeInfo.description;
    example.textContent = nodeInfo.example;

    panel.style.display = 'block';
}

function hideNodeInfo() {
    document.getElementById('node-info').style.display = 'none';
}

function showBreadcrumb(nodeId) {
    const ancestors = getAncestors(nodeId);
    const nodeInfo = taxonomyData.nodes.find(n => n.id === nodeId);
    if (!nodeInfo) return;

    const pathContainer = document.getElementById('breadcrumb-path');
    let html = '';

    ancestors.forEach((ancestorId, idx) => {
        const ancestor = taxonomyData.nodes.find(n => n.id === ancestorId);
        if (ancestor) {
            html += `<span class="${ancestor.type}">${ancestor.label.replace('\n', ' ')}</span>`;
            html += '<span class="separator">&rarr;</span>';
        }
    });

    html += `<span class="${nodeInfo.type}"><strong>${nodeInfo.label.replace('\n', ' ')}</strong></span>`;

    pathContainer.innerHTML = html;
    document.getElementById('breadcrumb').style.display = 'block';
}

function hideBreadcrumb() {
    document.getElementById('breadcrumb').style.display = 'none';
}

// ===========================================
// SEARCH FUNCTIONALITY
// ===========================================

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        const matches = taxonomyData.nodes.filter(n =>
            n.label.toLowerCase().replace('\n', ' ').includes(query) ||
            n.description.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        } else {
            searchResults.innerHTML = matches.slice(0, 8).map(n => `
                <div class="search-result-item" data-id="${n.id}">
                    ${n.label.replace('\n', ' ')}
                    <span class="type-badge ${n.type}">${n.type}</span>
                </div>
            `).join('');
        }

        searchResults.classList.add('active');
    });

    searchResults.addEventListener('click', (e) => {
        const item = e.target.closest('.search-result-item');
        if (item && item.dataset.id) {
            selectSearchResult(item.dataset.id);
            searchInput.value = '';
            searchResults.classList.remove('active');
        }
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });
}

function selectSearchResult(nodeId) {
    // Expand ancestors to make node visible
    const ancestors = getAncestors(nodeId);
    ancestors.forEach(ancestorId => expandedNodes.add(ancestorId));

    // Also expand the node itself if it has children
    const children = getChildren(nodeId);
    if (children.length > 0) {
        expandedNodes.add(nodeId);
    }

    refreshNetwork();

    // Focus on the node
    setTimeout(() => {
        network.selectNodes([nodeId]);
        network.focus(nodeId, {
            scale: 1,
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });

        selectedNode = nodeId;
        showNodeInfo(nodeId);
        showBreadcrumb(nodeId);
    }, 100);
}

// ===========================================
// CONTROL BUTTONS
// ===========================================

function setupControls() {
    const layoutBtn = document.getElementById('layout-btn');
    const expandAllBtn = document.getElementById('expand-all-btn');
    const collapseAllBtn = document.getElementById('collapse-all-btn');

    layoutBtn.addEventListener('click', () => {
        isHierarchical = !isHierarchical;
        layoutBtn.textContent = isHierarchical ? 'Radial View' : 'Tree View';
        layoutBtn.classList.toggle('active', !isHierarchical);

        // Rebuild network with new layout
        initializeNetwork();
    });

    expandAllBtn.addEventListener('click', () => {
        // Expand all non-topic nodes
        taxonomyData.nodes
            .filter(n => n.type !== 'topic')
            .forEach(n => expandedNodes.add(n.id));
        refreshNetwork();
    });

    collapseAllBtn.addEventListener('click', () => {
        // Keep only disciplines expanded
        expandedNodes.clear();
        taxonomyData.nodes
            .filter(n => n.type === 'discipline')
            .forEach(n => expandedNodes.add(n.id));
        refreshNetwork();
        clearSelection();
    });
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    loadTaxonomyData();
});
