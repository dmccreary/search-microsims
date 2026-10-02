// MicroSim Schema Structure Map - vis-network
// CANVAS_HEIGHT: 620
// Use this CANVAS_HEIGHT for all the iframe heights that embed this MicroSim
// Bloom Level: Analyze (L4) - students EXAMINE how the eight sections of the MicroSim
// metadata schema relate to each other, which fields are required, and which fields
// depend on fields in other sections.
//
// Design notes
//  * The schema shown is the teaching version from Chapter 5: only dublinCore is a
//    required section, and seven of its fields are required.
//  * Layout is a two-sided radial tree (mind map): root in the center, sections around
//    it, fields fanning outward left and right. A strict circle would shrink the labels
//    below a readable size once several sections are open, so positions are computed
//    here and every label stays horizontal.
//  * All nodes are vis-network custom shapes; the connecting lines are drawn in the
//    beforeDrawing event so they can end exactly at a field's dot.

// ===========================================
// SCHEMA DATA
// ===========================================
// side: which side of the root the section sits on. Sections are listed clockwise,
// starting at the top right.
const SECTIONS = [
    {
        id: 'dublinCore', color: '#1565C0', required: true, side: 'right',
        description: 'Standard Dublin Core elements: what the MicroSim is, who made it, and how it may be reused.',
        fields: [
            { name: 'title', required: true, type: 'string', constraints: ['Min length: 3', 'Max length: 100'],
              description: 'Name of the MicroSim.', example: '"Pendulum Period Calculator"' },
            { name: 'creator', required: true, type: 'string', constraints: [],
              description: 'Person or organization who created the MicroSim.', example: '"Maria Santos"' },
            { name: 'subject', required: true, type: 'array of strings', constraints: ['Min items: 1'],
              description: 'Topic keywords that drive topic-based search.', example: '["Physics", "Kinematics"]' },
            { name: 'description', required: true, type: 'string', constraints: [],
              description: 'What the MicroSim does and what it teaches.', example: '"Interactive simulation of..."' },
            { name: 'date', required: true, type: 'string', constraints: ['Format: YYYY-MM-DD'],
              description: 'Date created or last updated.', example: '"2026-01-15"' },
            { name: 'format', required: true, type: 'string', constraints: [],
              description: 'File format, written as a media type.', example: '"text/html"' },
            { name: 'rights', required: true, type: 'string', constraints: [],
              description: 'License that tells others how they may reuse the MicroSim.', example: '"CC BY-SA 4.0"' },
            { name: 'publisher', required: false, type: 'string', constraints: [],
              description: 'Organization that makes the MicroSim available.', example: '"OpenEd Physics"' },
            { name: 'language', required: false, type: 'string', constraints: ['Pattern: two-letter code, optional region'],
              description: 'Language of the MicroSim.', example: '"en-US"' }
        ]
    },
    {
        id: 'search', color: '#2E7D32', required: false, side: 'right',
        description: 'Fields tuned for search and discovery, such as facets and keywords.',
        fields: [
            { name: 'visualizationType', required: false, type: 'array of strings',
              constraints: ['Enum: animation, chart, diagram, simulation, network, map, ...'],
              description: 'Kinds of visualization used. A facet in the search interface.', example: '["simulation", "chart"]' },
            { name: 'tags', required: false, type: 'array of strings', constraints: [],
              description: 'Extra search keywords beyond the subject list.', example: '["pendulum", "period"]' },
            { name: 'interactionLevel', required: false, type: 'string',
              constraints: ['Enum: passive, low, moderate, high, very-high'],
              description: 'How much the learner must interact.', example: '"high"' },
            { name: 'complexity', required: false, type: 'integer', constraints: ['Minimum: 1', 'Maximum: 10'],
              description: 'Overall complexity score used for filtering.', example: '4' }
        ]
    },
    {
        id: 'educational', color: '#D84315', required: false, side: 'right',
        description: 'Pedagogical information: who the MicroSim is for and what they will learn.',
        fields: [
            { name: 'gradeLevel', required: false, type: 'string',
              constraints: ['Enum: K-12, Undergraduate, Graduate, Adult'],
              description: 'Intended audience level.', example: '"Undergraduate"' },
            { name: 'subjectArea', required: false, type: 'string',
              constraints: ['Enum: Mathematics, Physics, Computer Science, ...'],
              description: 'Primary subject area. A facet in the search interface.', example: '"Physics"' },
            { name: 'bloomsTaxonomy', required: false, type: 'string',
              constraints: ['Enum: Remember, Understand, Apply, Analyze, Evaluate, Create'],
              description: 'Cognitive level the MicroSim targets.', example: '"Apply"' },
            { name: 'difficulty', required: false, type: 'string',
              constraints: ['Enum: Beginner, Intermediate, Advanced'],
              description: 'How hard the content is.', example: '"Intermediate"' },
            { name: 'learningObjectives', required: false, type: 'array of strings', constraints: [],
              description: 'What learners will be able to do afterward.', example: '["Calculate projectile range"]' },
            { name: 'prerequisites', required: false, type: 'array of strings', constraints: [],
              description: 'Knowledge learners need before they start.', example: '["Basic algebra"]' }
        ]
    },
    {
        id: 'technical', color: '#6A1B9A', required: false, side: 'left',
        description: 'Implementation details: the library used and how the canvas behaves.',
        fields: [
            { name: 'framework', required: false, type: 'string',
              constraints: ['Enum: p5.js, vis-network.js, chart.js, mermaid.js, plotly.js, leaflet.js, other'],
              description: 'JavaScript library the MicroSim is built with.', example: '"p5.js"' },
            { name: 'responsive', required: false, type: 'boolean', constraints: [],
              description: 'Whether the layout adapts to the width of its container.', example: 'true' },
            { name: 'canvasDimensions', required: false, type: 'object', constraints: ['Properties: width, height (integers)'],
              description: 'Size of the drawing canvas in pixels.', example: '{"width": 800, "height": 600}' },
            { name: 'dependencies', required: false, type: 'array of strings', constraints: [],
              description: 'External libraries the MicroSim needs.', example: '["p5.js 1.11"]' }
        ]
    },
    {
        id: 'userInterface', color: '#00796B', required: false, side: 'left',
        description: 'Controls and layout: the sliders, buttons, and panels a learner sees.',
        fields: [
            { name: 'controls', required: false, type: 'array of objects',
              constraints: ['Each item: id, type, label', 'type enum: slider, button, checkbox, dropdown, ...'],
              description: 'Every control and what it does.', example: '[{"id": "speed", "type": "slider"}]' },
            { name: 'layoutType', required: false, type: 'string',
              constraints: ['Enum: fixed, responsive-width, two-column, multi-panel, dashboard'],
              description: 'Overall layout pattern.', example: '"two-column"' },
            { name: 'colorScheme', required: false, type: 'object', constraints: ['Properties: drawingArea, controlArea, accent, text'],
              description: 'Colors used for each region.', example: '{"drawingArea": "aliceblue"}' }
        ]
    },
    {
        id: 'simulation', color: '#C2185B', required: false, side: 'left',
        description: 'The model behind the MicroSim: its variables, equations, and preset scenarios.',
        fields: [
            { name: 'model', required: false, type: 'object', constraints: ['Properties: type, equations, assumptions, limitations'],
              description: 'The model being simulated and its limits.', example: '{"type": "physics"}' },
            { name: 'variables', required: false, type: 'array of objects', constraints: ['Each item: name, dataType, units, range'],
              description: 'Quantities the simulation tracks or lets the learner change.', example: '[{"name": "length", "units": "m"}]' },
            { name: 'scenarios', required: false, type: 'array of objects', constraints: ['Each item: name, description, parameters'],
              description: 'Preset situations a learner can load.', example: '[{"name": "Moon gravity"}]' }
        ]
    },
    {
        id: 'analytics', color: '#5D4037', required: false, side: 'left',
        description: 'Learning analytics: which interaction events are recorded and how privacy is handled.',
        fields: [
            { name: 'events', required: false, type: 'array of objects', constraints: ['Each item: name, category, importance'],
              description: 'Interaction events worth recording.', example: '[{"name": "slider-changed"}]' },
            { name: 'learningIndicators', required: false, type: 'array of objects', constraints: ['Each item: indicator, measurement'],
              description: 'Evidence that learning is taking place.', example: '[{"indicator": "explores range"}]' },
            { name: 'privacy', required: false, type: 'object', constraints: ['Properties: piiCollected, dataRetention, consentRequired'],
              description: 'What data is kept and for how long.', example: '{"piiCollected": false}' }
        ]
    },
    {
        id: 'usage', color: '#616161', required: false, side: 'left',
        description: 'Teaching guidance: how instructors should use the MicroSim.',
        fields: [
            { name: 'recommendedUsage', required: false, type: 'array of strings',
              constraints: ['Enum: demonstration, exploration, guided-practice, assessment, homework, ...'],
              description: 'Classroom situations the MicroSim suits.', example: '["exploration"]' },
            { name: 'instructionalStrategies', required: false, type: 'array of strings', constraints: [],
              description: 'Recommended teaching strategies.', example: '["Predict, then observe"]' },
            { name: 'assessmentQuestions', required: false, type: 'array of objects', constraints: ['Each item: question, type, level'],
              description: 'Questions that check understanding.', example: '[{"question": "What happens when...?"}]' }
        ]
    }
];

// Field dependencies: a field in one section that refers to, or should agree with,
// a field in another section. Drawn as dashed lines.
// bow: extra outward bend (px) so two lines between closed sections do not overlap.
const DEPENDENCIES = [
    { from: 'dublinCore.subject', to: 'educational.subjectArea', bow: 12,
      note: 'The subject keywords should include the broad subjectArea.' },
    { from: 'search.tags', to: 'dublinCore.subject', bow: 0,
      note: 'Tags add search keywords beyond those already in subject.' },
    { from: 'userInterface.controls', to: 'simulation.variables', bow: 0,
      note: 'Each control changes one or more simulation variables.' },
    { from: 'analytics.events', to: 'userInterface.controls', bow: 12,
      note: 'Interaction events are produced when a learner uses a control.' }
];

// ===========================================
// LAYOUT CONSTANTS
// ===========================================
const FIELD_FONT = '13px Arial';
const REQUIRED_FONT = 'bold 13px Arial';     // required field names are bold
const SECTION_FONT = 'bold 14px Arial';
const ROOT_R = 38;              // radius of the root circle
const SECTION_X = 88;           // distance from the center to the inner edge of a section box
const SECTION_W = 118;
const SECTION_H = 32;
const SECTION_GAP = 12;         // vertical gap between section blocks
const FIELD_ROW = 21;           // vertical distance between fields
const DOT_X = SECTION_X + SECTION_W + 30;   // distance from the center to a field's dot
const DOT_R = 6;
const FIELD_H = 18;
const ANIMATE_LIMIT = 150;
const TRANSITION_MS = 300;

// ===========================================
// STATE
// ===========================================
const modelById = new Map();    // id -> { kind: 'root' | 'section' | 'field', ... }
let expanded = new Set(['dublinCore']);   // sections whose fields are showing
let requiredOnly = false;
let focusSection = 'all';       // value of the "Show section" filter
let query = '';                 // lowercase search text
let visibleNodes = [];
let hoverId = null;
let selectedId = null;
let animationHandle = null;
let network = null;
let nodes = null;

const measureCtx = document.createElement('canvas').getContext('2d');

// ===========================================
// ENVIRONMENT DETECTION
// ===========================================

// Inside a textbook iframe the mouse wheel must scroll the page, not zoom the map.
function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// ===========================================
// MODEL
// ===========================================

function buildModel() {
    modelById.set('root', { id: 'root', kind: 'root', w: 2 * ROOT_R, h: 2 * ROOT_R });
    for (const section of SECTIONS) {
        const sign = section.side === 'right' ? 1 : -1;
        modelById.set(section.id, {
            id: section.id, kind: 'section', section: section, sign: sign,
            w: SECTION_W, h: SECTION_H
        });
        for (const field of section.fields) {
            const id = section.id + '.' + field.name;
            measureCtx.font = field.required ? REQUIRED_FONT : FIELD_FONT;
            modelById.set(id, {
                id: id, kind: 'field', section: section, field: field, sign: sign,
                w: 2 * DOT_R + 6 + measureCtx.measureText(field.name).width + 4, h: FIELD_H
            });
        }
    }
}

function fieldMatches(section, field) {
    return query !== '' && (field.name.toLowerCase().includes(query) ||
        (section.id + '.' + field.name).toLowerCase().includes(query));
}

function sectionHasMatch(section) {
    return section.fields.some(f => fieldMatches(section, f) && (!requiredOnly || f.required));
}

// Is this section showing its fields right now?
function isOpen(section) {
    if (query !== '') return sectionHasMatch(section);            // search opens the sections with matches
    if (focusSection !== 'all') return section.id === focusSection;
    return expanded.has(section.id);
}

function shownFields(section) {
    if (!isOpen(section)) return [];
    return section.fields.filter(f => !requiredOnly || f.required);
}

// Should this node be drawn faded?
function isDimmed(m) {
    if (m.kind === 'root') return false;
    if (query !== '') {
        if (m.kind === 'field') return !fieldMatches(m.section, m.field);
        return !sectionHasMatch(m.section);
    }
    if (focusSection !== 'all') return m.section.id !== focusSection;
    return false;
}

// ===========================================
// LAYOUT: two-sided radial tree
// ===========================================

function computeLayout() {
    visibleNodes = [];
    const root = modelById.get('root');
    root.tx = 0;
    root.ty = 0;
    visibleNodes.push(root);

    for (const side of ['right', 'left']) {
        // clockwise order: the right side reads top to bottom, the left side bottom to top
        let list = SECTIONS.filter(s => s.side === side);
        if (side === 'left') list = list.slice().reverse();
        const sign = side === 'right' ? 1 : -1;

        const blocks = list.map(section => {
            const fields = shownFields(section);
            return { section: section, fields: fields, h: Math.max(SECTION_H + 8, fields.length * FIELD_ROW) };
        });
        const total = blocks.reduce((sum, b) => sum + b.h, 0) + SECTION_GAP * (blocks.length - 1);
        let y = -total / 2;
        for (const b of blocks) {
            const s = modelById.get(b.section.id);
            s.tx = sign * (SECTION_X + SECTION_W / 2);
            s.ty = y + b.h / 2;
            visibleNodes.push(s);
            const top = y + (b.h - b.fields.length * FIELD_ROW) / 2;
            b.fields.forEach((field, i) => {
                const f = modelById.get(b.section.id + '.' + field.name);
                f.tx = sign * (DOT_X - DOT_R + f.w / 2);   // the dot sits on the side nearest the section
                f.ty = top + (i + 0.5) * FIELD_ROW;
                visibleNodes.push(f);
            });
            y += b.h + SECTION_GAP;
        }
    }
}

// Move the camera so the whole visible map fits in the drawing area
function fitView(animated) {
    if (!network || visibleNodes.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of visibleNodes) {
        minX = Math.min(minX, n.tx - n.w / 2);
        maxX = Math.max(maxX, n.tx + n.w / 2);
        minY = Math.min(minY, n.ty - n.h / 2 - (n.kind === 'section' ? 8 : 0));   // room for the badge
        maxY = Math.max(maxY, n.ty + n.h / 2);
    }
    const el = document.getElementById('network');
    const padX = 16;
    const padTop = 8;
    const padBottom = 42;                  // room for the navigation buttons
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
    const m = modelById.get(id);
    if (!m) return { drawNode() {}, nodeDimensions: { width: 10, height: 10 } };
    return {
        drawNode() {
            const active = state.selected || state.hover;
            ctx.globalAlpha = isDimmed(m) ? 0.28 : 1;
            if (m.kind === 'root') drawRoot(ctx, x, y, active);
            else if (m.kind === 'section') drawSection(ctx, m, x, y, active);
            else drawField(ctx, m, x, y, active);
            ctx.globalAlpha = 1;
        },
        nodeDimensions: { width: m.w, height: m.h }
    };
}

// 1. Root: large gold circle in the center
function drawRoot(ctx, x, y, active) {
    ctx.beginPath();
    ctx.arc(x, y, ROOT_R, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFC107';
    ctx.fill();
    ctx.lineWidth = active ? 4 : 2.5;
    ctx.strokeStyle = '#B28704';
    ctx.stroke();
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText('MicroSim', x, y - 8);
    ctx.fillText('Metadata', x, y + 9);
}

// 2. Section: large colored rectangle, with a badge if the section is required
function drawSection(ctx, m, x, y, active) {
    const left = x - m.w / 2;
    const top = y - m.h / 2;
    roundedRectPath(ctx, left, top, m.w, m.h, 7);
    ctx.fillStyle = m.section.color;
    ctx.fill();
    ctx.lineWidth = active ? 3.5 : 1.5;
    ctx.strokeStyle = active ? 'black' : 'rgba(0,0,0,0.45)';
    ctx.stroke();

    // triangle on the outer side: points outward when closed, down when open
    const open = isOpen(m.section);
    const tx = x + m.sign * (m.w / 2 - 11);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    if (open) {
        ctx.moveTo(tx - 5, y - 3);
        ctx.lineTo(tx + 5, y - 3);
        ctx.lineTo(tx, y + 4);
    } else {
        ctx.moveTo(tx - m.sign * 3, y - 5);
        ctx.lineTo(tx - m.sign * 3, y + 5);
        ctx.lineTo(tx + m.sign * 4, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.font = SECTION_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(m.section.id, x - m.sign * 7, y + 1);

    if (m.section.required) {
        // "required" badge on the top edge
        ctx.font = 'bold 11px Arial';
        const bw = ctx.measureText('required').width + 12;
        const bx = x - bw / 2;
        const by = top - 9;
        roundedRectPath(ctx, bx, by, bw, 15, 7);
        ctx.fillStyle = '#FFC107';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#B28704';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('required', x, by + 8);
    }
}

// 3. Field: small circle (solid = required, outline = optional) with its name beside it
function drawField(ctx, m, x, y, active) {
    const dotX = x - m.sign * (m.w / 2 - DOT_R);
    const matched = fieldMatches(m.section, m.field);
    ctx.font = m.field.required ? REQUIRED_FONT : FIELD_FONT;
    const textW = ctx.measureText(m.field.name).width;
    const textLeft = m.sign > 0 ? dotX + DOT_R + 6 : dotX - DOT_R - 6 - textW;

    if (matched || active) {
        ctx.fillStyle = matched ? '#FFEB3B' : '#FFF59D';
        ctx.fillRect(textLeft - 3, y - m.h / 2, textW + 6, m.h);
    }

    ctx.beginPath();
    ctx.arc(dotX, y, DOT_R - 1, 0, 2 * Math.PI);
    ctx.fillStyle = m.field.required ? m.section.color : 'white';
    ctx.fill();
    ctx.lineWidth = active ? 3 : 2;
    ctx.strokeStyle = m.section.color;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(m.field.name, textLeft, y + 1);
}

// ===========================================
// EDGES (drawn underneath the nodes)
// ===========================================

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function drawEdges(ctx) {
    const pos = network.getPositions();
    ctx.save();

    for (const m of visibleNodes) {
        const p = pos[m.id];
        if (!p || m.kind === 'root') continue;
        const alpha = isDimmed(m) ? 0.25 : 0.9;
        ctx.strokeStyle = hexToRgba(m.section.color, alpha);
        ctx.setLineDash([]);
        let sx, sy, ex;
        if (m.kind === 'section') {
            // Section to root: thick line
            const r = pos.root;
            if (!r) continue;
            sx = r.x;
            sy = r.y;
            ex = p.x - m.sign * m.w / 2;
            ctx.lineWidth = 3.5;
        } else {
            // Field to section: thin line
            const s = pos[m.section.id];
            if (!s) continue;
            sx = s.x + m.sign * SECTION_W / 2;
            sy = s.y;
            ex = p.x - m.sign * (m.w / 2 - DOT_R);
            ctx.lineWidth = 1.3;
        }
        const midX = (sx + ex) / 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(midX, sy, midX, p.y, ex, p.y);
        ctx.stroke();
    }

    // Field dependencies: dashed lines. When a section is closed the line attaches to the section box.
    for (const dep of DEPENDENCIES) {
        const a = dependencyEnd(dep.from, pos);
        const b = dependencyEnd(dep.to, pos);
        if (!a || !b) continue;
        const highlighted = hoverId === dep.from || hoverId === dep.to || selectedId === dep.from || selectedId === dep.to;
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = highlighted ? 2.6 : 1.6;
        ctx.strokeStyle = highlighted ? '#B71C1C' : 'rgba(40,40,40,' + (a.dim || b.dim ? 0.3 : 0.85) + ')';
        // When a field is showing, the curve runs in the lane between the section boxes and
        // the dots. Between two closed sections it bends around the outside of their boxes.
        const sign = a.sign;
        const cx = (a.isDot || b.isDot)
            ? DOT_X - 16
            : SECTION_X + SECTION_W + 18 + dep.bow;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(sign * cx, a.y, sign * cx, b.y, b.x, b.y);
        ctx.stroke();
    }
    ctx.restore();
}

// Where a dependency line ends: the field's dot, or the outer edge of its closed section
function dependencyEnd(fieldId, pos) {
    const f = modelById.get(fieldId);
    const sectionModel = modelById.get(f.section.id);
    if (pos[fieldId]) {
        return { x: pos[fieldId].x - f.sign * (f.w / 2 - DOT_R), y: pos[fieldId].y, sign: f.sign, dim: isDimmed(f), isDot: true };
    }
    const s = pos[sectionModel.id];
    if (!s) return null;
    return { x: s.x + f.sign * (SECTION_W / 2 + 2), y: s.y, sign: f.sign, dim: isDimmed(sectionModel), isDot: false };
}

// ===========================================
// SYNCHRONIZE MODEL -> vis-network
// ===========================================

// Recompute the layout and slide nodes to their new places. New fields start at
// their section and radiate outward.
function applyLayout(animate) {
    if (animationHandle !== null) {
        cancelAnimationFrame(animationHandle);
        animationHandle = null;
    }
    const before = network.getPositions();
    computeLayout();
    const visibleIds = new Set(visibleNodes.map(n => n.id));

    const gone = nodes.getIds().filter(id => !visibleIds.has(id));
    if (gone.length > 0) nodes.remove(gone);
    if (selectedId !== null && !visibleIds.has(selectedId)) selectedId = null;

    const start = new Map();
    const newNodes = [];
    for (const n of visibleNodes) {
        if (before[n.id]) {
            start.set(n.id, before[n.id]);
        } else {
            const parentId = n.kind === 'field' ? n.section.id : 'root';
            const p = start.get(parentId) || before[parentId] || { x: n.tx, y: n.ty };
            start.set(n.id, { x: p.x, y: p.y });
            newNodes.push({ id: n.id, shape: 'custom', ctxRenderer: renderNode, x: p.x, y: p.y });
        }
    }
    nodes.add(newNodes);
    updateCount();

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
    v.textContent = value;
    row.appendChild(v);
    parent.appendChild(row);
}

function totals() {
    let all = 0;
    let required = 0;
    for (const s of SECTIONS) {
        all += s.fields.length;
        required += s.fields.filter(f => f.required).length;
    }
    return { all: all, required: required, optional: all - required };
}

function dependenciesOf(id) {
    return DEPENDENCIES.filter(d => d.from === id || d.to === id ||
        d.from.startsWith(id + '.') || d.to.startsWith(id + '.'));
}

function showDetails(id) {
    const title = document.getElementById('info-title');
    const content = document.getElementById('info-content');
    content.textContent = '';
    const m = id ? modelById.get(id) : null;

    if (!m && query !== '') {
        // search results
        const hits = [];
        for (const s of SECTIONS) {
            for (const f of s.fields) {
                if (fieldMatches(s, f) && (!requiredOnly || f.required)) hits.push(s.id + '.' + f.name);
            }
        }
        title.textContent = hits.length + (hits.length === 1 ? ' field matches "' : ' fields match "') + query + '"';
        if (hits.length === 0) {
            addInfoRow(content, '', 'No field name contains that text. Try "subject", "level" or "type".', 'info-hint');
        } else {
            addInfoRow(content, '', hits.join(', '), 'info-code');
            addInfoRow(content, '', 'Matches are highlighted in yellow. Hover over one for its details.', 'info-hint');
        }
        return;
    }

    if (!m) {
        const t = totals();
        title.textContent = 'Schema Summary';
        addInfoRow(content, '', '8 sections, ' + t.all + ' key fields: ' + t.required + ' required, ' + t.optional + ' optional.');
        addInfoRow(content, '', 'Only dublinCore is a required section. Dashed lines mark ' +
            DEPENDENCIES.length + ' dependencies.');
        addInfoRow(content, '', 'Click a section to open it. Hover over a field for details.', 'info-hint');
        return;
    }

    if (m.kind === 'root') {
        const t = totals();
        title.textContent = 'MicroSim Metadata (root)';
        addInfoRow(content, 'Type', 'object');
        addInfoRow(content, 'Contains', '8 sections, ' + t.all + ' key fields');
        addInfoRow(content, 'Required', 'dublinCore', 'info-yes');
        addInfoRow(content, '', 'This is the top-level object in every metadata.json file.', 'info-hint');
        return;
    }

    if (m.kind === 'section') {
        const s = m.section;
        const req = s.fields.filter(f => f.required).length;
        title.textContent = s.id + ' (section)';
        addInfoRow(content, 'Type', 'object');
        addInfoRow(content, 'Required', s.required ? 'yes' : 'no (optional section)', s.required ? 'info-yes' : '');
        addInfoRow(content, 'Fields shown', s.fields.length + ' (' + req + ' required, ' + (s.fields.length - req) + ' optional)');
        addInfoRow(content, '', s.description);
        for (const d of dependenciesOf(s.id)) {
            addInfoRow(content, 'Dependency', d.from + ' → ' + d.to, 'info-code');
        }
        return;
    }

    const f = m.field;
    title.textContent = m.id;
    addInfoRow(content, 'Type', f.type);
    addInfoRow(content, 'Required', f.required ? 'yes' : 'no', f.required ? 'info-yes' : '');
    for (const c of f.constraints) {
        const parts = c.split(': ');
        addInfoRow(content, parts[0], parts.slice(1).join(': '));
    }
    addInfoRow(content, '', f.description);
    addInfoRow(content, 'Example', f.example, 'info-code');
    for (const d of dependenciesOf(m.id)) {
        const other = d.from === m.id ? d.to : d.from;
        addInfoRow(content, 'Depends on', other + '. ' + d.note);
    }
}

function updateCount() {
    const t = totals();
    const shown = visibleNodes.filter(n => n.kind === 'field').length;
    document.getElementById('count-text').textContent = 'Showing ' + shown + ' of ' + t.all + ' fields';
}

// ===========================================
// CONTROL HANDLERS
// ===========================================

function refresh(animate) {
    applyLayout(animate);
    showDetails(selectedId);
    network.redraw();
}

function toggleSection(id) {
    // clicking a section returns the "Show section" filter to All sections
    if (focusSection !== 'all') {
        expanded = new Set([focusSection]);
        focusSection = 'all';
        document.getElementById('section-select').value = 'all';
    }
    if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
    refresh(true);
}

function clearSearch() {
    query = '';
    document.getElementById('search-input').value = '';
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
            dragNodes: false,
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
    network.on('beforeDrawing', drawEdges);

    network.on('click', function (params) {
        if (params.nodes.length === 0) {
            selectedId = null;
            showDetails(null);
            network.redraw();
            return;
        }
        const m = modelById.get(params.nodes[0]);
        selectedId = m.id;
        if (m.kind === 'section') {
            if (query !== '') clearSearch();
            toggleSection(m.id);
        } else {
            showDetails(m.id);        // a click pins the details so they can be read and scrolled
            network.redraw();
        }
    });

    network.on('hoverNode', function (params) {
        hoverId = params.node;
        showDetails(params.node);
        container.style.cursor = modelById.get(params.node).kind === 'section' ? 'pointer' : 'default';
    });

    network.on('blurNode', function () {
        hoverId = null;
        showDetails(selectedId);
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

    buildModel();

    const sectionSelect = document.getElementById('section-select');
    for (const s of SECTIONS) {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = s.id;
        sectionSelect.appendChild(option);
    }

    initializeNetwork();
    applyLayout(false);
    showDetails(null);

    document.getElementById('search-input').addEventListener('input', function (event) {
        query = event.target.value.trim().toLowerCase();
        selectedId = null;
        network.unselectAll();
        refresh(true);
    });

    sectionSelect.addEventListener('change', function (event) {
        focusSection = event.target.value;
        if (focusSection !== 'all') clearSearch();
        selectedId = null;
        network.unselectAll();
        refresh(true);
    });

    document.getElementById('required-check').addEventListener('change', function (event) {
        requiredOnly = event.target.checked;
        refresh(true);
    });

    document.getElementById('expand-btn').addEventListener('click', function () {
        clearSearch();
        focusSection = 'all';
        sectionSelect.value = 'all';
        expanded = new Set(SECTIONS.map(s => s.id));
        refresh(true);
    });

    document.getElementById('collapse-btn').addEventListener('click', function () {
        clearSearch();
        focusSection = 'all';
        sectionSelect.value = 'all';
        expanded = new Set();
        selectedId = null;
        network.unselectAll();
        refresh(true);
    });

    window.addEventListener('resize', function () { fitView(false); });
});
