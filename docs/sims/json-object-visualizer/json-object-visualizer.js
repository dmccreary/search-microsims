// JSON Object Structure Visualizer - vis-network
// CANVAS_HEIGHT: 600
// Use this CANVAS_HEIGHT for all the iframe heights that embed this MicroSim
// Bloom Level: Understand (L2) - students INTERPRET the hierarchy of a JSON document
// by seeing nested key-value pairs drawn as a left-to-right tree.
//
// Design notes
//  * The tree layout is computed here (not by vis-network) so every leaf gets its own
//    row and labels never overlap. vis-network draws the nodes and handles
//    hover, click, drag and the navigation buttons.
//  * All nodes use vis-network custom shapes (ctxRenderer) so a primitive value can be
//    drawn as a small dot with its "key: value" label to the RIGHT of the dot.
//  * The parent-to-child lines are drawn in the beforeDrawing event, from the right
//    side of the parent to the left side of the child. (vis-network edges always aim
//    at the CENTER of a node, which would run the line underneath the label text.)

// ===========================================
// SAMPLE DATA (MicroSim metadata, as in Chapter 5)
// ===========================================
const SAMPLE = {
    dublinCore: {
        title: "Ohm's Law Circuit Explorer",
        creator: 'Prof. Elena Rodriguez',
        subject: ['Physics', 'Electricity', 'Circuits'],
        date: '2026-01-15'
    },
    educational: {
        gradeLevel: 'Undergraduate',
        difficulty: 'Intermediate'
    },
    technical: {
        framework: 'p5.js',
        responsive: true,
        canvasSize: { width: 800, height: 600 },
        license: null
    }
};
const SAMPLE_JSON = JSON.stringify(SAMPLE, null, 2);

// ===========================================
// COLORS (one hue family per JSON data type)
// ===========================================
const STYLE = {
    root:    { fill: '#1976D2', border: '#0D47A1', text: 'white' },
    object:  { fill: '#81C784', border: '#2E7D32', text: 'black' },
    array:   { fill: '#FFB74D', border: '#E65100', text: 'black' },
    string:  { fill: '#2E7D32', border: '#1B5E20', text: '#1B5E20' },
    number:  { fill: '#1565C0', border: '#0D47A1', text: '#0D47A1' },
    boolean: { fill: '#EF6C00', border: '#BF360C', text: '#BF360C' },
    null:    { fill: '#9E9E9E', border: '#616161', text: '#555555' }
};

// ===========================================
// LAYOUT CONSTANTS
// ===========================================
const FONT = '14px Arial';
const ROW_GAP = 27;            // height of a row that holds a primitive value
const BOX_ROW_GAP = 35;        // height of a row that holds a collapsed or empty box
const COL_GAP = 46;            // horizontal gap between a parent and its children
const DOT_R = 7;               // radius of a primitive-value dot
const BOX_H = 28;              // height of object and array boxes
const LEAF_H = 22;             // height of the hover area of a primitive
const ROOT_D = 52;             // diameter of the root circle
const MAX_VALUE_CHARS = 28;    // longer values are shortened in the tree (hover shows all)
const MAX_INITIAL_ROWS = 16;   // if a document is bigger, start partly collapsed
const ANIMATE_LIMIT = 150;     // skip the transition animation for very large trees
const TRANSITION_MS = 300;

// ===========================================
// STATE
// ===========================================
let nodesById = new Map();     // id -> model node
let rootNode = null;
let visibleNodes = [];         // model nodes currently shown, parents before children
let showValues = true;
let selectedId = null;
let animationHandle = null;
let network = null;
let nodes = null;              // vis DataSet (parent-child lines are drawn by drawTreeEdges)

const measureCtx = document.createElement('canvas').getContext('2d');

// ===========================================
// ENVIRONMENT DETECTION
// ===========================================

// Inside a textbook iframe the mouse wheel must scroll the page, not zoom the tree.
function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// ===========================================
// MODEL: turn a parsed JSON value into a tree of nodes
// ===========================================

function typeOf(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;       // 'object', 'string', 'number' or 'boolean'
}

function isContainer(n) {
    return n.type === 'object' || n.type === 'array';
}

function buildModel(value) {
    nodesById = new Map();
    let counter = 0;

    function add(key, val, parent, path) {
        const n = {
            id: ++counter,
            key: key,
            type: typeOf(val),
            value: val,
            parentId: parent ? parent.id : null,
            isRoot: !parent,
            path: path,
            depth: parent ? parent.depth + 1 : 0,
            children: [],
            expanded: true
        };
        nodesById.set(n.id, n);
        if (n.type === 'object') {
            for (const k of Object.keys(val)) {
                const childPath = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? path + '.' + k : path + '["' + k + '"]';
                n.children.push(add(k, val[k], n, childPath).id);
            }
        } else if (n.type === 'array') {
            val.forEach((item, i) => {
                n.children.push(add('[' + i + ']', item, n, path + '[' + i + ']').id);
            });
        }
        return n;
    }

    rootNode = add('root', value, null, 'root');

    // Large documents start partly collapsed so the first view stays readable
    let depthLimit = maxDepth();
    while (depthLimit > 1 && countRows(depthLimit) > MAX_INITIAL_ROWS) depthLimit--;
    for (const n of nodesById.values()) {
        n.expanded = n.depth < depthLimit;
    }
}

function maxDepth() {
    let d = 0;
    for (const n of nodesById.values()) d = Math.max(d, n.depth);
    return d;
}

// Number of leaf rows if every container above depthLimit is expanded
function countRows(depthLimit) {
    function rows(n) {
        if (!isContainer(n) || n.children.length === 0 || n.depth >= depthLimit) return 1;
        return n.children.reduce((sum, id) => sum + rows(nodesById.get(id)), 0);
    }
    return rows(rootNode);
}

// ===========================================
// LABELS AND SIZES
// ===========================================

function shortValue(n) {
    let text = n.type === 'string' ? JSON.stringify(n.value) : String(n.value);
    if (text.length > MAX_VALUE_CHARS) {
        text = text.slice(0, MAX_VALUE_CHARS - 1) + '…' + (n.type === 'string' ? '"' : '');
    }
    return text;
}

function updateLabel(n) {
    measureCtx.font = FONT;
    n.valueText = '';
    if (n.isRoot) {
        n.keyText = 'root';
        n.w = ROOT_D;
        n.h = ROOT_D;
    } else if (n.type === 'object' || n.type === 'array') {
        const count = n.children.length;
        n.keyText = n.key + (n.type === 'object' ? ' {' + count + '}' : ' [' + count + ']');
        n.w = 22 + measureCtx.measureText(n.keyText).width + 12;
        n.h = BOX_H;
    } else {
        n.keyText = n.key;
        if (showValues) n.valueText = ': ' + shortValue(n);
        n.w = 2 * DOT_R + 6 + measureCtx.measureText(n.keyText + n.valueText).width + 6;
        n.h = LEAF_H;
    }
}

// ===========================================
// LAYOUT: tidy left-to-right tree
// ===========================================

function computeLayout() {
    visibleNodes = [];
    let cursor = 0;                        // top of the next free row

    function place(n) {
        updateLabel(n);
        visibleNodes.push(n);
        const kids = (isContainer(n) && n.expanded) ? n.children.map(id => nodesById.get(id)) : [];
        if (kids.length === 0) {
            // every leaf (or collapsed box) gets its own row
            const rowHeight = (isContainer(n) || n.isRoot) ? Math.max(BOX_ROW_GAP, n.h + 6) : ROW_GAP;
            n.ty = cursor + rowHeight / 2;
            cursor += rowHeight;
        } else {
            kids.forEach(place);
            n.ty = (kids[0].ty + kids[kids.length - 1].ty) / 2;   // parents sit beside the middle of their children
        }
    }
    place(rootNode);

    // Column positions: each column starts to the right of the widest expanded parent before it
    const parentWidth = [];
    for (const n of visibleNodes) {
        if (isContainer(n) && n.expanded && n.children.length > 0) {
            parentWidth[n.depth] = Math.max(parentWidth[n.depth] || 0, n.w);
        }
    }
    const colLeft = [0];
    for (let d = 1; d <= maxDepth(); d++) {
        colLeft[d] = colLeft[d - 1] + (parentWidth[d - 1] || 0) + COL_GAP;
    }
    for (const n of visibleNodes) {
        n.tx = colLeft[n.depth] + n.w / 2;   // nodes in a column are left-aligned
    }
}

// Move the camera so the whole visible tree fits in the drawing area
function fitView(animated) {
    if (!network || visibleNodes.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of visibleNodes) {
        minX = Math.min(minX, n.tx - n.w / 2);
        maxX = Math.max(maxX, n.tx + n.w / 2);
        minY = Math.min(minY, n.ty - n.h / 2);
        maxY = Math.max(maxY, n.ty + n.h / 2);
    }
    const el = document.getElementById('network');
    const padX = 24;
    const padTop = 10;
    const padBottom = 44;                  // room for the navigation buttons
    const scaleX = (el.clientWidth - 2 * padX) / Math.max(1, maxX - minX);
    const scaleY = (el.clientHeight - padTop - padBottom) / Math.max(1, maxY - minY);
    const scale = Math.max(0.25, Math.min(scaleX, scaleY, 1.1));
    network.moveTo({
        position: {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2 + ((padBottom - padTop) / 2) / scale
        },
        scale: scale,
        animation: animated ? { duration: TRANSITION_MS, easingFunction: 'easeOutCubic' } : false
    });
}

// ===========================================
// CUSTOM NODE RENDERING
// ===========================================

function roundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

function renderNode({ ctx, id, x, y, state }) {
    const n = nodesById.get(id);
    if (!n) return { drawNode() {}, nodeDimensions: { width: 10, height: 10 } };
    return {
        drawNode() {
            drawNodeShape(ctx, n, x, y, state.selected || state.hover);
        },
        nodeDimensions: { width: n.w, height: n.h }
    };
}

function drawNodeShape(ctx, n, x, y, active) {
    const s = STYLE[n.isRoot ? 'root' : n.type];
    const left = x - n.w / 2;
    ctx.textBaseline = 'middle';

    if (n.isRoot) {
        // 1. Root: large blue circle
        ctx.beginPath();
        ctx.arc(x, y, ROOT_D / 2, 0, 2 * Math.PI);
        ctx.fillStyle = s.fill;
        ctx.fill();
        ctx.lineWidth = active ? 4 : 2;
        ctx.strokeStyle = s.border;
        ctx.stroke();
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = s.text;
        ctx.fillText('root', x, y + 1);
        return;
    }

    if (isContainer(n)) {
        // 2. Object: green rectangle.  3. Array: orange rectangle with rounded corners.
        roundedRectPath(ctx, left, y - n.h / 2, n.w, n.h, n.type === 'array' ? 13 : 2);
        ctx.fillStyle = s.fill;
        ctx.fill();
        ctx.lineWidth = active ? 3.5 : 2;
        ctx.strokeStyle = s.border;
        ctx.stroke();

        // triangle shows whether the box is expanded (down) or collapsed (right)
        if (n.children.length > 0) {
            const tx = left + 12;
            ctx.fillStyle = s.border;
            ctx.beginPath();
            if (n.expanded) {
                ctx.moveTo(tx - 5, y - 3);
                ctx.lineTo(tx + 5, y - 3);
                ctx.lineTo(tx, y + 4);
            } else {
                ctx.moveTo(tx - 3, y - 5);
                ctx.lineTo(tx - 3, y + 5);
                ctx.lineTo(tx + 4, y);
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.font = FONT;
        ctx.textAlign = 'left';
        ctx.fillStyle = s.text;
        ctx.fillText(n.keyText, left + 22, y + 1);
        return;
    }

    // 4. Primitive: small dot, with "key: value" to the right of it.
    if (active) {
        ctx.fillStyle = '#FFF59D';
        ctx.fillRect(left + DOT_R, y - n.h / 2, n.w - DOT_R, n.h);
    }

    ctx.beginPath();
    ctx.arc(left + DOT_R, y, DOT_R, 0, 2 * Math.PI);
    ctx.fillStyle = s.fill;
    ctx.fill();
    ctx.lineWidth = active ? 3 : 1.5;
    ctx.strokeStyle = s.border;
    ctx.stroke();

    ctx.font = FONT;
    ctx.textAlign = 'left';
    const textX = left + 2 * DOT_R + 6;
    ctx.fillStyle = 'black';
    ctx.fillText(n.keyText, textX, y + 1);
    if (n.valueText) {
        ctx.fillStyle = s.text;
        ctx.fillText(n.valueText, textX + ctx.measureText(n.keyText).width, y + 1);
    }
}

// Solid curved lines from each parent to its children, drawn underneath the nodes
function drawTreeEdges(ctx) {
    const pos = network.getPositions();
    ctx.save();
    ctx.strokeStyle = '#7B8CA3';
    ctx.lineWidth = 1.5;
    for (const n of visibleNodes) {
        const parent = nodesById.get(n.parentId);
        const p = parent ? pos[parent.id] : null;
        const c = pos[n.id];
        if (!p || !c) continue;
        const sx = p.x + parent.w / 2;                                   // right side of the parent
        const ex = c.x - n.w / 2 + (isContainer(n) ? 0 : DOT_R);         // left side of the box, or the dot
        const midX = (sx + ex) / 2;
        ctx.beginPath();
        ctx.moveTo(sx, p.y);
        ctx.bezierCurveTo(midX, p.y, midX, c.y, ex, c.y);
        ctx.stroke();
    }
    ctx.restore();
}

// ===========================================
// SYNCHRONIZE MODEL -> vis-network
// ===========================================

// Recompute the layout and move nodes to their new places.
// animate = true gives a short transition so students can follow which
// children came out of (or went back into) which parent.
function applyLayout(animate) {
    if (animationHandle !== null) {
        cancelAnimationFrame(animationHandle);
        animationHandle = null;
    }
    const before = network.getPositions();     // where nodes are now (they may have been dragged)
    computeLayout();
    const visibleIds = new Set(visibleNodes.map(n => n.id));

    // remove nodes that were collapsed away
    const gone = nodes.getIds().filter(id => !visibleIds.has(id));
    if (gone.length > 0) nodes.remove(gone);
    if (selectedId !== null && !visibleIds.has(selectedId)) selectedId = null;

    // new nodes start at their parent's position, then slide out
    const start = new Map();
    const newNodes = [];
    for (const n of visibleNodes) {
        if (before[n.id]) {
            start.set(n.id, before[n.id]);
        } else {
            const p = start.get(n.parentId) || { x: n.tx, y: n.ty };
            start.set(n.id, { x: p.x, y: p.y });
            newNodes.push({ id: n.id, shape: 'custom', ctxRenderer: renderNode, x: p.x, y: p.y });
        }
    }
    nodes.add(newNodes);

    const doAnimate = animate && visibleNodes.length <= ANIMATE_LIMIT;
    fitView(doAnimate);

    if (!doAnimate) {
        nodes.update(visibleNodes.map(n => ({ id: n.id, x: n.tx, y: n.ty })));
        return;
    }
    const t0 = performance.now();
    function step(now) {
        const t = Math.min(1, (now - t0) / TRANSITION_MS);
        const ease = 1 - Math.pow(1 - t, 3);
        nodes.update(visibleNodes.map(n => {
            const s = start.get(n.id);
            return { id: n.id, x: s.x + (n.tx - s.x) * ease, y: s.y + (n.ty - s.y) * ease };
        }));
        animationHandle = t < 1 ? requestAnimationFrame(step) : null;
    }
    animationHandle = requestAnimationFrame(step);
}

// ===========================================
// DETAILS PANEL
// ===========================================

function addInfoRow(parent, key, value, valueClass) {
    const row = document.createElement('div');
    row.className = 'info-row';
    if (key) {
        const k = document.createElement('span');
        k.className = 'info-key';
        k.textContent = key + ': ';
        row.appendChild(k);
    }
    const v = document.createElement('span');
    if (valueClass) v.className = valueClass;
    v.textContent = value;                     // textContent keeps pasted JSON from being read as HTML
    row.appendChild(v);
    parent.appendChild(row);
}

function plural(count, noun) {
    return count + ' ' + noun + (count === 1 ? '' : 's');
}

function showDetails(n) {
    const title = document.getElementById('info-title');
    const content = document.getElementById('info-content');
    title.className = 'info-title';
    content.textContent = '';

    if (!n) {
        // no node selected: summarize the whole document
        const counts = { object: 0, array: 0, string: 0, number: 0, boolean: 0, null: 0 };
        for (const m of nodesById.values()) counts[m.type]++;
        const primitives = counts.string + counts.number + counts.boolean + counts.null;
        title.textContent = 'Document Summary';
        addInfoRow(content, '', plural(nodesById.size, 'value') + ': ' + plural(counts.object, 'object') + ', ' +
            plural(counts.array, 'array') + ', ' + plural(primitives, 'primitive'));
        addInfoRow(content, 'Depth', plural(maxDepth(), 'level') + ' below root');
        addInfoRow(content, '', 'Hover over a node for its path and type. ' +
            'Click a box to open or close it.', 'info-hint');
        return;
    }

    title.textContent = n.isRoot ? 'root' : n.key;
    addInfoRow(content, 'Path', n.path, 'info-path');
    addInfoRow(content, 'Type', n.type);
    if (n.type === 'object') {
        addInfoRow(content, 'Contains', n.children.length + (n.children.length === 1 ? ' key-value pair' : ' key-value pairs'));
    } else if (n.type === 'array') {
        addInfoRow(content, 'Contains', n.children.length + (n.children.length === 1 ? ' element' : ' elements') +
            (n.children.length > 0 ? ' (index 0 to ' + (n.children.length - 1) + ')' : ''));
    } else {
        addInfoRow(content, 'Value', JSON.stringify(n.value));
    }
    if (!n.isRoot) {
        const parent = nodesById.get(n.parentId);
        addInfoRow(content, 'Parent', (parent.isRoot ? 'root' : parent.key) + ' (' + parent.type + '), level ' + n.depth);
    }
}

function showParseError(message) {
    const title = document.getElementById('info-title');
    const content = document.getElementById('info-content');
    title.className = 'info-title error';
    title.textContent = 'Invalid JSON';
    content.textContent = '';
    addInfoRow(content, '', message);
    addInfoRow(content, '', 'Fix the text and press Visualize again. The tree still shows the last valid document.', 'info-hint');
}

// ===========================================
// CONTROL HANDLERS
// ===========================================

function visualize() {
    const text = document.getElementById('json-input').value;
    let value;
    try {
        value = JSON.parse(text);
    } catch (err) {
        showParseError(err.message);
        return;
    }
    if (animationHandle !== null) {
        cancelAnimationFrame(animationHandle);
        animationHandle = null;
    }
    buildModel(value);
    selectedId = null;
    nodes.clear();
    applyLayout(false);
    showDetails(null);
}

function setAllExpanded(expanded) {
    for (const n of nodesById.values()) {
        // "Collapse All" keeps the root open so the top-level keys stay visible
        n.expanded = expanded || n.isRoot;
    }
    selectedId = null;
    network.unselectAll();
    showDetails(null);
    applyLayout(true);
}

function toggleNode(n) {
    n.expanded = !n.expanded;
    applyLayout(true);
}

// ===========================================
// INITIALIZATION
// ===========================================

function initializeNetwork() {
    const mouseNavigation = !isInIframe();     // pan and wheel-zoom only when opened fullscreen
    nodes = new vis.DataSet([]);

    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            hover: true,
            selectConnectedEdges: false,
            dragNodes: true,
            dragView: mouseNavigation,
            zoomView: mouseNavigation,
            navigationButtons: true
        },
        nodes: {
            shape: 'custom',
            ctxRenderer: renderNode
        }
    };

    const container = document.getElementById('network');
    network = new vis.Network(container, { nodes: nodes, edges: new vis.DataSet([]) }, options);
    network.on('beforeDrawing', drawTreeEdges);

    network.on('click', function (params) {
        if (params.nodes.length === 0) {
            selectedId = null;
            showDetails(null);
            return;
        }
        const n = nodesById.get(params.nodes[0]);
        selectedId = n.id;
        showDetails(n);
        if (isContainer(n) && n.children.length > 0) toggleNode(n);
    });

    network.on('hoverNode', function (params) {
        showDetails(nodesById.get(params.node));
        container.style.cursor = 'pointer';
    });

    network.on('blurNode', function () {
        showDetails(selectedId !== null ? nodesById.get(selectedId) : null);
        container.style.cursor = 'default';
    });

    // vis-network re-centers itself after the first draw, so fit again afterwards
    network.once('afterDrawing', function () {
        fitView(false);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // When embedded, the iframe is exactly as tall as this page. Lock scrolling so keys such
    // as Home and End cannot move the MicroSim out of view inside its iframe.
    if (isInIframe()) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    const input = document.getElementById('json-input');
    input.value = SAMPLE_JSON;

    // On a phone-width screen start with key names only so the labels stay readable
    if (document.getElementById('network').clientWidth < 520) {
        showValues = false;
        document.getElementById('values-check').checked = false;
    }

    initializeNetwork();
    visualize();

    document.getElementById('visualize-btn').addEventListener('click', visualize);
    document.getElementById('sample-btn').addEventListener('click', function () {
        input.value = SAMPLE_JSON;
        input.scrollTop = 0;
        visualize();
    });
    document.getElementById('expand-btn').addEventListener('click', function () { setAllExpanded(true); });
    document.getElementById('collapse-btn').addEventListener('click', function () { setAllExpanded(false); });
    document.getElementById('values-check').addEventListener('change', function (event) {
        showValues = event.target.checked;
        applyLayout(true);
    });

    window.addEventListener('resize', function () { fitView(false); });
});
