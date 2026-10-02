// Validation Feedback Simulator MicroSim
// CANVAS_HEIGHT: 540
// Use this CANVAS_HEIGHT for all the iframe heights that embed this MicroSim
// Bloom Level: Analyze (L4) - students DISTINGUISH valid from invalid MicroSim metadata
// by reading schema validation feedback and correcting the document.
// Left panel: a JSON editor (textarea layered over the canvas so the canvas can draw
// line numbers, syntax colors and error markers in the gutter).
// Right panel: the list of schema issues with location, current value, expected value
// and an optional fix hint, plus a progress bar.
// MicroSim template version 2026.03

// ---------- canvas layout ----------
let containerWidth;                 // set from the <main> element
let canvasWidth = 700;              // responsive width
let drawHeight = 460;               // editor + validation results
let controlHeight = 80;             // two rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;
let panelTop = 45;                  // y of the top of both panels (below the title)

// ---------- editor geometry (must match the textarea CSS exactly) ----------
const EDITOR_FONT_SIZE = 14;
const LINE_HEIGHT = 20;
const PAD_X = 8;
const PAD_Y = 6;
const GUTTER_W = 48;                // marker + line number
const TAB_SIZE = 2;

const TOKEN_COLORS = {
  key: 'purple', string: 'green', number: 'blue', boolean: 'darkorange',
  null: 'gray', punct: 'black', invalid: 'crimson'
};

// ---------- the schema (teaching version from Chapter 5) ----------
// dublinCore is the only required section. Seven of its fields are required.
const SCHEMA = {
  type: 'object',
  fields: {
    dublinCore: {
      type: 'object', required: true,
      fields: {
        title:       { type: 'string', required: true, minLength: 3, maxLength: 100, sample: '"Your title here"' },
        creator:     { type: 'string', required: true, sample: '"Your name"' },
        subject:     { type: 'array', items: 'string', minItems: 1, required: true, sample: '["Physics"]' },
        description: { type: 'string', required: true, sample: '"Your description here"' },
        date:        { type: 'string', required: true, pattern: /^\d{4}-\d{2}-\d{2}$/, patternText: 'YYYY-MM-DD', sample: '"2026-01-15"' },
        format:      { type: 'string', required: true, sample: '"text/html"' },
        rights:      { type: 'string', required: true, sample: '"CC BY-SA 4.0"' },
        publisher:   { type: 'string' },
        contributor: { type: 'array', items: 'string' },
        type:        { type: 'string' },
        identifier:  { type: 'string' },
        language:    { type: 'string' }
      }
    },
    educational: {
      type: 'object',
      fields: {
        gradeLevel:     { type: 'string', enum: ['K-12', 'Undergraduate', 'Graduate', 'Adult'] },
        bloomsTaxonomy: { type: 'string', enum: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'] },
        difficulty:     { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'],
                          synonyms: { easy: 'Beginner', medium: 'Intermediate', hard: 'Advanced' } },
        subjectArea:    { type: 'string' },
        learningObjectives: { type: 'array', items: 'string' }
      }
    },
    technical: {
      type: 'object',
      fields: {
        framework:  { type: 'string' },
        responsive: { type: 'boolean' }
      }
    },
    search: {
      type: 'object',
      fields: {
        visualizationType: { type: 'array', items: 'string' },
        tags: { type: 'array', items: 'string' }
      }
    }
  }
};

// ---------- example documents ----------
const BASE_DOCUMENT = {
  dublinCore: {
    title: "Ohm's Law Explorer",
    creator: 'Elena Rodriguez',
    subject: ['Physics', 'Circuits'],
    description: 'Explore voltage, current, and resistance.',
    date: '2026-01-15',
    format: 'text/html',
    rights: 'CC BY-SA 4.0'
  },
  educational: {
    gradeLevel: 'Undergraduate',
    difficulty: 'Intermediate'
  }
};

function makeExample(change) {
  const doc = JSON.parse(JSON.stringify(BASE_DOCUMENT));
  change(doc);
  return formatJSON(doc, 0);
}

const EXAMPLES = [
  { name: 'Three errors (start here)', change: d => { delete d.dublinCore.description; d.educational.gradeLevel = 12; d.educational.difficulty = 'Easy'; } },
  { name: 'Valid metadata', change: d => {} },
  { name: 'Missing required field', change: d => { delete d.dublinCore.description; } },
  { name: 'Wrong type', change: d => { d.educational.gradeLevel = 12; } },
  { name: 'Invalid enum value', change: d => { d.educational.difficulty = 'Easy'; } },
  { name: 'Array error', change: d => { d.dublinCore.subject = []; } },
  { name: 'Misspelled key', change: d => { d.dublinCore = renameKey(d.dublinCore, 'title', 'tittle'); } }
];

// ---------- controls ----------
let editor;
let validateButton, autoFixButton, resetButton;
let hintsCheckbox;
let exampleSelect;

// ---------- state ----------
let lines = [''];                   // editor text split into lines
let lineStarts = [0];               // character index where each line starts
let lineSegments = [[]];            // colored text segments for each line
let result = { state: 'empty', issues: [] };   // 'empty' | 'syntax' | 'checked'
let originalText = '';              // the example as loaded, for Reset to Original
let baselineKeys = [];              // issues present in the original example
let selectedKey = null;             // key of the issue whose details are open
let issueBoxes = [];                // clickable areas of the issue cards
let note = '';                      // one-line message under the progress bar
let celebrated = false;             // confetti is shown once per loaded example
let confetti = [];
let flashFrames = 0;                // header flash after pressing Validate

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // When embedded, the iframe is exactly as tall as the canvas. Lock the page so that
  // keys such as Home and End cannot scroll the MicroSim out of view inside its iframe.
  lockScrollWhenEmbedded();

  // The editor is a native textarea placed over the canvas. Its text is transparent:
  // the canvas underneath draws the same characters in color at the same positions.
  editor = createElement('textarea');
  editor.parent(mainElement);
  editor.attribute('spellcheck', 'false');
  editor.attribute('wrap', 'off');
  editor.attribute('autocomplete', 'off');
  editor.attribute('autocapitalize', 'off');
  editor.attribute('aria-label', 'Metadata JSON editor');
  editor.style('font-family', 'monospace');
  editor.style('font-size', EDITOR_FONT_SIZE + 'px');
  editor.style('line-height', LINE_HEIGHT + 'px');
  editor.style('padding', PAD_Y + 'px ' + PAD_X + 'px');
  editor.style('margin', '0');
  editor.style('border', 'none');
  editor.style('outline', 'none');
  editor.style('resize', 'none');
  editor.style('box-sizing', 'border-box');
  editor.style('background', 'transparent');
  editor.style('color', 'transparent');
  editor.style('caret-color', 'black');
  editor.style('white-space', 'pre');
  editor.style('overflow', 'auto');
  editor.style('tab-size', String(TAB_SIZE));
  editor.style('letter-spacing', '0px');
  editor.elt.addEventListener('input', onEditorInput);

  // Always use the native builtin p5.js controls
  validateButton = createButton('Validate');
  validateButton.parent(mainElement);
  validateButton.mousePressed(pressValidate);

  autoFixButton = createButton('Auto-fix');
  autoFixButton.parent(mainElement);
  autoFixButton.mousePressed(autoFix);

  resetButton = createButton('Reset to Original');
  resetButton.parent(mainElement);
  resetButton.mousePressed(resetToOriginal);

  hintsCheckbox = createCheckbox('Show hints', false);
  hintsCheckbox.parent(mainElement);

  exampleSelect = createSelect();
  exampleSelect.parent(mainElement);
  EXAMPLES.forEach((ex, i) => exampleSelect.option(ex.name, String(i)));
  exampleSelect.changed(loadExample);

  layoutControls();
  loadExample();

  describe('Schema validation feedback simulator. A JSON editor on the left holds MicroSim ' +
    'metadata. The panel on the right lists each schema error or warning with its location, ' +
    'current value, expected value and a fix hint, and a progress bar counts the issues fixed.', LABEL);
}

function draw() {
  // drawing region: light blue background with a silver border
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // control region: white background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(canvasWidth < 520 ? 19 : 24);
  text('Validation Feedback Simulator', canvasWidth / 2, 10);

  drawEditor();
  drawResults();
  drawConfetti();

  // control labels
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Load Example:', 10, drawHeight + 56);
}

// ====================================================================
// Layout
// ====================================================================

function editorRect() {
  const leftW = Math.floor(canvasWidth * 0.5);
  return { x: margin, y: panelTop, w: leftW - margin - 5, h: drawHeight - panelTop - margin };
}

function resultRect() {
  const leftW = Math.floor(canvasWidth * 0.5);
  return { x: leftW + 5, y: panelTop, w: canvasWidth - leftW - 5 - margin, h: drawHeight - panelTop - margin };
}

// Position every DOM control. Called from setup() and windowResized().
function layoutControls() {
  const row1 = drawHeight + 8;
  const row2 = drawHeight + 45;
  let x = 10;
  for (const b of [validateButton, autoFixButton, resetButton]) {
    b.position(x, row1);
    x += b.elt.offsetWidth + 8;
  }
  hintsCheckbox.position(x + 2, row1 + 1);
  exampleSelect.position(120, row2);

  const r = editorRect();
  editor.position(r.x + GUTTER_W, r.y + 1);
  editor.size(r.w - GUTTER_W - 1, r.h - 2);
}

// ====================================================================
// Editor drawing
// ====================================================================

function drawEditor() {
  const r = editorRect();
  const ta = editor.elt;
  const scrollTop = ta.scrollTop;
  const scrollLeft = ta.scrollLeft;

  // worst severity on each line, and the line of the selected issue
  const lineSeverity = {};
  let selectedLine = -1;
  for (const issue of result.issues) {
    if (lineSeverity[issue.line0] !== 'error') lineSeverity[issue.line0] = issue.severity;
    if (issue.key === selectedKey) selectedLine = issue.line0;
  }

  // editor background and gutter
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h);
  noStroke();
  fill('whitesmoke');
  rect(r.x + 1, r.y + 1, GUTTER_W - 1, r.h - 2);
  stroke('gainsboro');
  line(r.x + GUTTER_W, r.y + 1, r.x + GUTTER_W, r.y + r.h - 1);

  push();
  // a monospace font is required so canvas columns line up with the textarea
  textFont('monospace');
  textSize(EDITOR_FONT_SIZE);
  textStyle(NORMAL);
  textAlign(LEFT, BASELINE);          // measure ascent/descent from the alphabetic baseline
  const m = drawingContext.measureText('Mg');
  const asc = m.fontBoundingBoxAscent || EDITOR_FONT_SIZE * 0.8;
  const desc = m.fontBoundingBoxDescent || EDITOR_FONT_SIZE * 0.2;
  const baseOffset = (LINE_HEIGHT - (asc + desc)) / 2 + asc;   // baseline inside a line box
  const charW = textWidth('M');
  const textX = r.x + GUTTER_W + PAD_X - scrollLeft;
  const textY = r.y + 1 + PAD_Y - scrollTop;
  const first = Math.max(0, Math.floor((scrollTop - PAD_Y) / LINE_HEIGHT));
  const last = Math.min(lines.length - 1, first + Math.ceil(r.h / LINE_HEIGHT) + 1);

  // ---- gutter: issue markers and line numbers (scroll vertically only) ----
  push();   // push()/pop() keeps p5's cached fill and stroke in sync with the clip
  drawingContext.beginPath();
  drawingContext.rect(r.x + 1, r.y + 1, GUTTER_W - 1, r.h - 2);
  drawingContext.clip();
  for (let i = first; i <= last; i++) {
    const y = textY + i * LINE_HEIGHT;
    const severity = lineSeverity[i];
    if (severity === 'error') drawErrorMarker(r.x + 11, y + LINE_HEIGHT / 2, 6);
    if (severity === 'warning') drawWarningMarker(r.x + 11, y + LINE_HEIGHT / 2, 7);
    noStroke();
    fill(severity === 'error' ? 'red' : 'gray');
    textAlign(RIGHT, BASELINE);
    text(i + 1, r.x + GUTTER_W - 7, y + baseOffset);
  }
  pop();

  // ---- text area: colored tokens (scroll both ways) ----
  push();
  drawingContext.beginPath();
  drawingContext.rect(r.x + GUTTER_W + 1, r.y + 1, r.w - GUTTER_W - 2, r.h - 2);
  drawingContext.clip();
  textAlign(LEFT, BASELINE);

  // bands behind the lines that have issues
  for (let i = first; i <= last; i++) {
    const severity = lineSeverity[i];
    if (!severity) continue;
    noStroke();
    fill(severity === 'error' ? 'mistyrose' : 'lemonchiffon');
    rect(r.x + GUTTER_W + 1, textY + i * LINE_HEIGHT, r.w - GUTTER_W - 2, LINE_HEIGHT);
  }
  if (selectedLine >= 0) {
    // the selected issue gets an outline so it stands out from the other bands
    noFill();
    stroke('firebrick');
    strokeWeight(1.5);
    rect(r.x + GUTTER_W + 2, textY + selectedLine * LINE_HEIGHT + 1, r.w - GUTTER_W - 5, LINE_HEIGHT - 2);
    strokeWeight(1);
  }

  for (let i = first; i <= last; i++) {
    const y = textY + i * LINE_HEIGHT + baseOffset;
    for (const seg of lineSegments[i]) {
      noStroke();
      fill(seg.color);
      text(seg.text, textX + seg.col * charW, y);
    }
  }
  pop();
  pop();

  // focus ring so students can see the editor is active
  if (document.activeElement === ta) {
    noFill();
    stroke('dodgerblue');
    strokeWeight(2);
    rect(r.x, r.y, r.w, r.h);
    strokeWeight(1);
  }
}

// red circle with an X
function drawErrorMarker(cx, cy, radius) {
  noStroke();
  fill('red');
  circle(cx, cy, radius * 2);
  stroke('white');
  strokeWeight(1.8);
  const d = radius * 0.45;
  line(cx - d, cy - d, cx + d, cy + d);
  line(cx + d, cy - d, cx - d, cy + d);
  strokeWeight(1);
}

// yellow triangle with an exclamation mark
function drawWarningMarker(cx, cy, size) {
  stroke('darkgoldenrod');
  strokeWeight(1);
  fill('gold');
  triangle(cx, cy - size, cx - size, cy + size * 0.8, cx + size, cy + size * 0.8);
  stroke('black');
  strokeWeight(1.6);
  line(cx, cy - size * 0.35, cx, cy + size * 0.2);
  point(cx, cy + size * 0.5);
  strokeWeight(1);
}

// green circle with a check mark
function drawValidMarker(cx, cy, radius) {
  noStroke();
  fill('green');
  circle(cx, cy, radius * 2);
  stroke('white');
  strokeWeight(radius > 10 ? 3 : 1.8);
  const d = radius * 0.5;
  line(cx - d, cy, cx - d * 0.25, cy + d * 0.7);
  line(cx - d * 0.25, cy + d * 0.7, cx + d, cy - d * 0.7);
  strokeWeight(1);
}

// ====================================================================
// Results panel
// ====================================================================

function countOf(severity) {
  return result.issues.filter(issue => issue.severity === severity).length;
}

function drawResults() {
  const r = resultRect();
  push();
  drawingContext.beginPath();
  drawingContext.rect(r.x - 2, r.y - 2, r.w + 4, r.h + 4);
  drawingContext.clip();

  let y = r.y + drawHeaderCard(r) + 8;

  issueBoxes = [];
  for (const issue of result.issues) {
    const h = drawIssueCard(issue, r.x, y, r.w);
    issueBoxes.push({ key: issue.key, x: r.x, y: y, w: r.w, h: h });
    y += h + 6;
  }
  pop();

  const over = issueBoxes.some(b => mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h);
  cursor(over ? HAND : ARROW);
}

// Status, progress bar and note. Returns the card height.
function drawHeaderCard(r) {
  const errors = countOf('error');
  const warnings = countOf('warning');
  const small = r.w < 250;
  let headline, sub, accent, icon;

  if (result.state === 'empty') {
    headline = 'Editor is empty';
    sub = 'Load an example to begin.';
    accent = 'gray';
    icon = 'none';
  } else if (result.state === 'syntax') {
    headline = 'JSON syntax error';
    sub = 'Schema checks start once the syntax is correct.';
    accent = 'red';
    icon = 'error';
  } else if (errors > 0) {
    headline = errors + (errors === 1 ? ' error found' : ' errors found');
    sub = warnings > 0 ? 'and ' + warnings + (warnings === 1 ? ' warning' : ' warnings') : 'Click an issue to see its details.';
    accent = 'red';
    icon = 'error';
  } else if (warnings > 0) {
    headline = 'Valid, with ' + warnings + (warnings === 1 ? ' warning' : ' warnings');
    sub = 'It passes the schema, but could be better.';
    accent = 'darkgoldenrod';
    icon = 'warning';
  } else {
    headline = 'Valid metadata!';
    sub = 'Ready for submission.';
    accent = 'green';
    icon = 'valid';
  }

  const total = baselineKeys.length;
  const currentKeys = result.issues.map(issue => issue.key);
  const fixed = result.state === 'syntax' ? 0 : baselineKeys.filter(k => !currentKeys.includes(k)).length;
  const noteLines = note ? wrapText(note, r.w - 24, 13, NORMAL) : [];
  // headline and sub-line wrap on narrow screens, so the card height is measured first
  const headSize = small ? 15 : 19;
  const subSize = small ? 12 : 13;
  const headLines = wrapText(headline, r.w - 58, headSize, BOLD);
  const subLines = wrapText(sub, r.w - 58, subSize, NORMAL);
  const topH = Math.max(50, 9 + headLines.length * (headSize + 4) + subLines.length * (subSize + 4) + 6);
  const h = topH + 12 + 30 + noteLines.length * 17 + (noteLines.length ? 4 : 0);

  stroke(accent);
  strokeWeight(flashFrames > 0 ? 4 : 2);
  fill('white');
  rect(r.x, r.y, r.w, h, 10);
  strokeWeight(1);
  if (flashFrames > 0) flashFrames--;

  const cx = r.x + 26;
  const cy = r.y + 28;
  if (icon === 'error') drawErrorMarker(cx, cy, 14);
  else if (icon === 'warning') drawWarningMarker(cx, cy + 1, 13);
  else if (icon === 'valid') drawValidMarker(cx, cy, 14);
  else { noStroke(); fill('silver'); circle(cx, cy, 28); }

  noStroke();
  fill(accent);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(headSize);
  let hy = r.y + 9;
  for (const ln of headLines) {
    text(ln, r.x + 48, hy);
    hy += headSize + 4;
  }
  textStyle(NORMAL);
  fill('black');
  textSize(subSize);
  for (const ln of subLines) {
    text(ln, r.x + 48, hy);
    hy += subSize + 4;
  }

  // progress bar: issues from the original example that are now fixed
  const barX = r.x + 12;
  const barY = r.y + topH + 8;
  const barW = r.w - 24;
  stroke('silver');
  fill('whitesmoke');
  rect(barX, barY, barW, 10, 5);
  if (total > 0 && fixed > 0) {
    noStroke();
    fill('mediumseagreen');
    rect(barX, barY, barW * fixed / total, 10, 5);
  }
  noStroke();
  fill('black');
  textSize(13);
  const progressText = total > 0
    ? fixed + ' of ' + total + (total === 1 ? ' issue fixed' : ' issues fixed')
    : 'This example starts with no issues.';
  text(progressText, barX, barY + 15);

  let ny = barY + 36;
  fill('darkslateblue');
  for (const ln of noteLines) {
    text(ln, barX, ny);
    ny += 17;
  }
  return h;
}

// One issue. The selected issue also shows its value, the expected value and the fix.
function drawIssueCard(issue, x, y, w) {
  const isSelected = issue.key === selectedKey;
  const pad = 10;
  const textX = x + 34;
  const textW = w - 34 - pad;

  const messageLines = wrapText(issue.message, textW, 14, BOLD);
  let h = 8 + messageLines.length * 18 + 18 + 6;
  let detail = [];
  if (isSelected) {
    if (issue.valueText !== null) detail.push({ label: 'Value: ', text: issue.valueText, color: 'black' });
    if (issue.expected) detail.push({ label: 'Expected: ', text: issue.expected, color: 'black' });
    if (hintsCheckbox.checked()) {
      detail.push({ label: 'Fix: ', text: issue.fix, color: 'darkgreen' });
    } else {
      detail.push({ label: '', text: 'Check Show hints to see a suggested fix.', color: 'dimgray', italic: true });
    }
    for (const d of detail) {
      d.lines = wrapText(d.label + d.text, textW, 13, d.italic ? ITALIC : NORMAL);
      h += d.lines.length * 17;
    }
    h += 4;
  }

  const borderColor = issue.severity === 'error' ? 'red' : 'goldenrod';
  stroke(borderColor);
  strokeWeight(isSelected ? 2.5 : 1);
  fill(isSelected ? 'lightyellow' : 'white');
  rect(x, y, w, h, 8);
  strokeWeight(1);

  // severity icon
  if (issue.severity === 'error') drawErrorMarker(x + 17, y + 17, 8);
  else drawWarningMarker(x + 17, y + 17, 8);

  // message
  let ty = y + 8;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  for (const ln of messageLines) {
    text(ln, textX, ty);
    ty += 18;
  }
  textStyle(NORMAL);

  // location: JSON path and line number
  const lineLabel = 'line ' + (issue.line0 + 1);
  fill('dimgray');
  textSize(13);
  const pathRoom = textW - textWidth(lineLabel) - 10;
  textAlign(RIGHT, TOP);
  text(lineLabel, x + w - pad, ty + 1);
  textAlign(LEFT, TOP);
  push();
  textFont('monospace');
  textSize(13);
  fill('dimgray');
  // on a narrow panel keep the end of the path, which names the property
  let shownPath = issue.path;
  while (shownPath.length > 4 && textWidth(shownPath) > pathRoom) {
    shownPath = '\u2026' + shownPath.slice(shownPath.startsWith('\u2026') ? 2 : 1);
  }
  text(shownPath, textX, ty + 1);
  pop();
  ty += 18;

  if (isSelected) {
    ty += 4;
    for (const d of detail) {
      textStyle(d.italic ? ITALIC : NORMAL);
      fill(d.color);
      for (const ln of d.lines) {
        text(ln, textX, ty);
        ty += 17;
      }
    }
    textStyle(NORMAL);
  }
  return h;
}

// Greedy word wrap at the given size and style
function wrapText(str, maxW, size, style) {
  textSize(size);
  textStyle(style);
  const words = String(str).split(' ');
  const out = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (current && textWidth(candidate) > maxW) {
      out.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) out.push(current);
  textStyle(NORMAL);
  return out;
}

// ====================================================================
// Celebration (once per example, when every issue has been fixed)
// ====================================================================

function celebrate() {
  const r = resultRect();
  const colors = ['gold', 'tomato', 'dodgerblue', 'mediumseagreen', 'orchid', 'orange'];
  confetti = [];
  for (let i = 0; i < 70; i++) {
    confetti.push({
      x: r.x + random(r.w), y: r.y + random(-30, 20),
      vx: random(-1, 1), vy: random(1.5, 4),
      size: random(5, 9), color: random(colors), life: 100
    });
  }
}

function drawConfetti() {
  if (confetti.length === 0) return;
  noStroke();
  for (const p of confetti) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.y < drawHeight - 6) {
      fill(p.color);
      rect(p.x, p.y, p.size, p.size * 0.6);
    }
  }
  confetti = confetti.filter(p => p.life > 0 && p.y < drawHeight);
}

// ====================================================================
// Control handlers
// ====================================================================

function onEditorInput() {
  note = '';
  refreshTokens();
  runValidation();          // live re-validation as the student edits
}

function pressValidate() {
  runValidation();
  flashFrames = 25;
  const errors = countOf('error');
  if (result.state === 'syntax') note = 'Fix the JSON syntax first.';
  else if (errors > 0) note = 'Validated: ' + errors + (errors === 1 ? ' error remains.' : ' errors remain.');
  else note = 'Validated: the document matches the schema.';
}

function runValidation() {
  result = validateText(editor.elt.value);
  if (!result.issues.some(issue => issue.key === selectedKey)) {
    selectedKey = result.issues.length > 0 ? result.issues[0].key : null;
  }
  const valid = result.state === 'checked' && countOf('error') === 0;
  if (valid && baselineKeys.length > 0 && !celebrated) {
    celebrated = true;
    celebrate();
  }
}

function loadExample() {
  const example = EXAMPLES[parseInt(exampleSelect.value(), 10)] || EXAMPLES[0];
  originalText = makeExample(example.change);
  setEditorText(originalText);
  baselineKeys = result.issues.filter(issue => issue.severity === 'error').map(issue => issue.key);
  note = '';
}

function resetToOriginal() {
  setEditorText(originalText);
  note = 'Reset to the original example.';
}

// Replace the editor text and start a fresh validation session
function setEditorText(text) {
  editor.elt.value = text;
  editor.elt.scrollTop = 0;
  editor.elt.scrollLeft = 0;
  refreshTokens();
  confetti = [];
  celebrated = true;        // no confetti for simply loading a document
  selectedKey = null;
  runValidation();
  celebrated = false;
}

// Auto-fix repairs only mechanical mistakes. Missing information still needs a person.
function autoFix() {
  let text = editor.elt.value;
  let repaired = 0;

  if (result.state === 'syntax') {
    // simple syntax repairs: wrong quotes and trailing commas
    const fixedText = text
      .replace(/'([^'\\\n]*)'/g, '"$1"')
      .replace(/,(\s*[}\]])/g, '$1');
    if (fixedText === text || validateText(fixedText).state === 'syntax') {
      note = 'Auto-fix cannot repair this syntax error. Edit the JSON by hand.';
      return;
    }
    text = fixedText;
    repaired++;
  }

  let check = validateText(text);
  const fixable = check.issues.filter(issue => issue.auto);
  if (fixable.length > 0) {
    let doc = JSON.parse(text);
    for (const issue of fixable) {
      doc = applyFix(doc, issue.auto);
      repaired++;
    }
    text = formatJSON(doc, 0);
  }

  if (repaired === 0) {
    const left = countOf('error') + countOf('warning');
    note = left > 0
      ? 'Nothing here can be fixed automatically. These issues need your judgment.'
      : 'Nothing to fix.';
    return;
  }
  editor.elt.value = text;
  refreshTokens();
  selectedKey = null;
  runValidation();
  const left = countOf('error');
  note = 'Auto-fix repaired ' + repaired + (repaired === 1 ? ' issue.' : ' issues.') +
    (left > 0 ? ' ' + left + (left === 1 ? ' error needs' : ' errors need') + ' information only you can supply.' : '');
}

// Apply one automatic repair to a parsed document and return the new document
function applyFix(doc, fix) {
  const parts = fix.path.split('/').filter(p => p !== '');
  if (fix.kind === 'set') {
    let target = doc;
    for (let k = 0; k < parts.length - 1; k++) target = target[parts[k]];
    target[parts[parts.length - 1]] = fix.value;
    return doc;
  }
  // rename a key, keeping the order of the keys
  if (parts.length === 0) return renameKey(doc, fix.from, fix.to);
  let parent = doc;
  for (let k = 0; k < parts.length - 1; k++) parent = parent[parts[k]];
  const last = parts[parts.length - 1];
  parent[last] = renameKey(parent[last], fix.from, fix.to);
  return doc;
}

function renameKey(obj, from, to) {
  const out = {};
  for (const key of Object.keys(obj)) out[key === from ? to : key] = obj[key];
  return out;
}

// Pretty-print with two-space indents, keeping arrays of simple values on one line
function formatJSON(value, depth) {
  const pad = '  '.repeat(depth);
  if (Array.isArray(value)) {
    if (value.every(v => v === null || typeof v !== 'object')) {
      return '[' + value.map(v => JSON.stringify(v)).join(', ') + ']';
    }
    return '[\n' + value.map(v => pad + '  ' + formatJSON(v, depth + 1)).join(',\n') + '\n' + pad + ']';
  }
  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    return '{\n' + keys.map(k => pad + '  ' + JSON.stringify(k) + ': ' + formatJSON(value[k], depth + 1)).join(',\n') +
      '\n' + pad + '}';
  }
  return JSON.stringify(value);
}

// Click an issue to open its details and jump to its line in the editor
function mousePressed() {
  for (const box of issueBoxes) {
    if (mouseX >= box.x && mouseX <= box.x + box.w && mouseY >= box.y && mouseY <= box.y + box.h &&
        mouseY < drawHeight) {
      selectedKey = box.key;
      jumpToIssue(result.issues.find(issue => issue.key === box.key));
      return false;   // keep the browser from moving focus back to the page
    }
  }
}

function jumpToIssue(issue) {
  if (!issue) return;
  const ta = editor.elt;
  ta.focus();
  ta.setSelectionRange(Math.min(issue.start, ta.value.length), Math.min(issue.end, ta.value.length));
  const target = issue.line0 * LINE_HEIGHT - ta.clientHeight / 2 + LINE_HEIGHT;
  ta.scrollTop = Math.max(0, target);
}

// ====================================================================
// Validation
// ====================================================================

// Returns { state: 'empty' | 'syntax' | 'checked', issues: [...] }
function validateText(src) {
  const parsed = parseWithPositions(src);
  if (parsed.empty) return { state: 'empty', issues: [] };
  if (!parsed.ok) {
    const where = lineColumn(src, parsed.index);
    return {
      state: 'syntax',
      issues: [{
        severity: 'error', key: 'syntax', path: 'line ' + (where.line0 + 1) + ', column ' + (where.col0 + 1),
        line0: where.line0, start: parsed.index, end: parsed.index + 1,
        message: parsed.message, valueText: null, expected: 'valid JSON syntax', fix: parsed.fix, auto: null
      }]
    };
  }
  const issues = [];
  checkValue(parsed.root, '', SCHEMA, null, src, issues);
  issues.sort((a, b) => a.line0 - b.line0 || (a.severity === 'error' ? -1 : 1));
  return { state: 'checked', issues: issues };
}

function lineColumn(src, index) {
  let line0 = 0;
  let lineStart = 0;
  for (let k = 0; k < index && k < src.length; k++) {
    if (src[k] === '\n') { line0++; lineStart = k + 1; }
  }
  return { line0: line0, col0: index - lineStart };
}

// path identifies the issue; location is what the student sees (defaults to path)
function addIssue(issues, src, severity, code, path, start, end, message, valueText, expected, fix, auto, location) {
  const shown = location !== undefined ? location : path;
  issues.push({
    severity: severity, key: code + ':' + path, path: shown === '' ? '/' : shown,
    line0: lineColumn(src, start).line0, start: start, end: end,
    message: message, valueText: valueText, expected: expected, fix: fix, auto: auto || null
  });
}

function sourceText(src, node) {
  let text = src.slice(node.start, node.end).replace(/\s+/g, ' ');
  if (text.length > 40) text = text.slice(0, 38) + '...';
  return text;
}

function describeSpec(spec) {
  if (spec.enum) return 'string, one of: ' + spec.enum.join(', ');
  if (spec.type === 'array') return 'array of ' + (spec.items || 'value') + 's' + (spec.minItems ? ' with at least ' + spec.minItems + ' item' : '');
  if (spec.patternText) return 'string in the form ' + spec.patternText;
  return spec.type;
}

// Check one value against its part of the schema
function checkValue(node, path, spec, member, src, issues) {
  if (node.type !== spec.type) {
    let fix;
    let auto = null;
    if (spec.type === 'string' && spec.enum) {
      fix = 'Replace ' + sourceText(src, node) + ' with a quoted value from the list, such as "' + spec.enum[0] + '".';
    } else if (spec.type === 'string' && (node.type === 'number' || node.type === 'boolean')) {
      fix = 'Change to "' + node.value + '" (with quotes).';
      auto = { kind: 'set', path: path, value: String(node.value) };
    } else if (spec.type === 'array') {
      fix = 'Wrap the value in square brackets: [' + sourceText(src, node) + '].';
      if (node.type !== 'object') auto = { kind: 'set', path: path, value: [node.value] };
    } else if (spec.type === 'object') {
      fix = 'Use an object in curly braces { } that holds the fields of this section.';
    } else {
      fix = 'Replace it with a ' + spec.type + ' value.';
    }
    addIssue(issues, src, 'error', 'type', path, node.start, node.end,
      'Expected ' + spec.type + ', got ' + node.type, sourceText(src, node), describeSpec(spec), fix, auto);
    return;
  }

  if (spec.type === 'object' && spec.fields) {
    checkObject(node, path, spec, src, issues);
    return;
  }

  if (spec.type === 'string') {
    const value = node.value;
    if (spec.enum && !spec.enum.includes(value)) {
      const lower = value.toLowerCase();
      const suggestion = spec.enum.find(e => e.toLowerCase() === lower) || (spec.synonyms && spec.synonyms[lower]) || null;
      addIssue(issues, src, 'error', 'enum', path, node.start, node.end,
        'Value must be one of: ' + spec.enum.join(', '), JSON.stringify(value), 'one of: ' + spec.enum.join(', '),
        suggestion ? 'Use "' + suggestion + '" instead of "' + value + '".' : 'Pick the closest value from the list.',
        suggestion ? { kind: 'set', path: path, value: suggestion } : null);
    } else if (spec.minLength && value.length < spec.minLength) {
      addIssue(issues, src, 'error', 'minLength', path, node.start, node.end,
        'String must be at least ' + spec.minLength + ' characters long', JSON.stringify(value),
        'string of ' + spec.minLength + ' to ' + spec.maxLength + ' characters', 'Write a longer, more descriptive value.');
    } else if (spec.maxLength && value.length > spec.maxLength) {
      addIssue(issues, src, 'error', 'maxLength', path, node.start, node.end,
        'String must be at most ' + spec.maxLength + ' characters long', value.length + ' characters',
        'string of ' + spec.minLength + ' to ' + spec.maxLength + ' characters', 'Shorten the value.');
    } else if (spec.pattern && !spec.pattern.test(value)) {
      addIssue(issues, src, 'error', 'pattern', path, node.start, node.end,
        'Value does not match the required format ' + spec.patternText, JSON.stringify(value),
        'string in the form ' + spec.patternText, 'Rewrite it like ' + spec.sample + '.');
    } else if (path === '/dublinCore/description' && value.trim().split(/\s+/).length < 5) {
      // a quality suggestion, not a schema violation
      addIssue(issues, src, 'warning', 'short', path, node.start, node.end,
        'Description is very short', JSON.stringify(value), 'a full sentence (5 words or more)',
        'Say what the MicroSim does and what students learn from it.');
    }
    return;
  }

  if (spec.type === 'array') {
    if (spec.minItems && node.items.length < spec.minItems) {
      addIssue(issues, src, 'error', 'minItems', path, node.start, node.end,
        'Array must have at least ' + spec.minItems + ' item', sourceText(src, node), describeSpec(spec),
        'Add at least one ' + path.split('/').pop() + ': ' + (spec.sample || '["value"]') + '.');
      return;
    }
    node.items.forEach((item, index) => {
      if (spec.items && item.type !== spec.items) {
        const auto = (spec.items === 'string' && (item.type === 'number' || item.type === 'boolean'))
          ? { kind: 'set', path: path + '/' + index, value: String(item.value) } : null;
        addIssue(issues, src, 'error', 'type', path + '/' + index, item.start, item.end,
          'Expected ' + spec.items + ', got ' + item.type, sourceText(src, item), spec.items,
          'Every item in this array must be a ' + spec.items + '.', auto);
      }
    });
  }
}

// Check an object: required properties, misspelled keys, unknown keys, then each value
function checkObject(node, path, spec, src, issues) {
  const present = new Map();
  for (const m of node.members) if (!present.has(m.key)) present.set(m.key, m);
  const unknown = node.members.filter(m => !spec.fields[m.key]);
  const claimed = new Set();

  for (const name of Object.keys(spec.fields)) {
    const fieldSpec = spec.fields[name];
    const member = present.get(name);
    if (member) {
      checkValue(member.value, path + '/' + name, fieldSpec, member, src, issues);
      continue;
    }
    // not present: was it misspelled?
    const typo = unknown.find(u => !claimed.has(u.key) && isNearMiss(u.key, name));
    if (typo) {
      claimed.add(typo.key);
      addIssue(issues, src, fieldSpec.required ? 'error' : 'warning', 'misspelled', path + '/' + typo.key,
        typo.keyStart, typo.keyEnd,
        'Unknown property \'' + typo.key + '\'. Did you mean \'' + name + '\'?',
        '"' + typo.key + '"', (fieldSpec.required ? 'the required key "' : 'the key "') + name + '"',
        'Rename "' + typo.key + '" to "' + name + '".',
        { kind: 'rename', path: path, from: typo.key, to: name });
    } else if (fieldSpec.required) {
      addIssue(issues, src, 'error', 'required', path + '/' + name, node.start, node.start + 1,
        'Required property \'' + name + '\' is missing', null,
        '"' + name + '": ' + describeSpec(fieldSpec) + ' inside ' + (path === '' ? 'the root object' : path),
        'Add "' + name + '": ' + (fieldSpec.sample || '{ ... }') + (path === '' ? '.' : ' inside ' + path.split('/').pop() + '.'),
        null, path);            // a missing property is reported at its parent, as validators do
    }
  }

  for (const u of unknown) {
    if (claimed.has(u.key)) continue;
    addIssue(issues, src, 'warning', 'unknown', path + '/' + u.key, u.keyStart, u.keyEnd,
      'Unknown property \'' + u.key + '\' is not in the schema', '"' + u.key + '"', 'a property defined by the schema',
      'Remove it, or check the spelling. Search tools will ignore it.');
  }
}

// Is typed probably a misspelling of expected?
function isNearMiss(typed, expected) {
  const a = typed.toLowerCase();
  const b = expected.toLowerCase();
  if (a === b) return true;                       // wrong capital letters only
  const limit = b.length <= 4 ? 1 : 2;
  return editDistance(a, b) <= limit;
}

function editDistance(a, b) {
  const rows = [];
  for (let i = 0; i <= a.length; i++) {
    rows.push([i]);
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = i === 0 ? j : Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return rows[a.length][b.length];
}

// ====================================================================
// JSON parser that remembers where every key and value is in the text
// Returns { empty: true } | { ok: true, root } | { ok: false, index, message, fix }
// node = { type, start, end, value | members: [{ key, keyStart, keyEnd, value }] | items: [node] }
// ====================================================================

function parseWithPositions(src) {
  const n = src.length;
  let i = 0;

  function fail(index, message, fix) {
    throw { syntax: true, index: Math.max(0, Math.min(index, n)), message: message, fix: fix };
  }
  function skipWhitespace() {
    while (i < n && /\s/.test(src[i])) i++;
  }
  function endOfContent() {
    let end = n;
    while (end > 0 && /\s/.test(src[end - 1])) end--;
    return end;
  }
  function isDigit(c) { return c !== undefined && c >= '0' && c <= '9'; }

  function parseString() {
    const start = i;
    i++;
    while (true) {
      if (i >= n || src[i] === '\n') fail(start, 'String is missing its closing double quote', 'Add " at the end of the string.');
      if (src[i] === '\\') { i += 2; continue; }
      if (src[i] === '"') { i++; break; }
      i++;
    }
    try {
      return JSON.parse(src.slice(start, i));
    } catch (err) {
      fail(start, 'Invalid escape sequence in string', 'Use a valid escape such as \\n or \\".');
    }
  }

  function parseNode() {
    skipWhitespace();
    if (i >= n) fail(endOfContent(), 'The document ended where a value was expected', 'Add the missing value.');
    const c = src[i];
    const start = i;
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    if (c === '"') {
      const value = parseString();
      return { type: 'string', value: value, start: start, end: i };
    }
    if (c === "'") fail(i, 'Strings must use double quotes, not single quotes', 'Replace \' with ".');
    if (c === '-' || isDigit(c)) {
      const re = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/y;
      re.lastIndex = i;
      const m = re.exec(src);
      if (!m) fail(i, 'Invalid number', 'Write a plain number such as 42 or 3.14.');
      i += m[0].length;
      if (isDigit(src[i])) fail(start, 'Numbers cannot have leading zeros', 'Remove the leading zero.');
      return { type: 'number', value: Number(m[0]), start: start, end: i };
    }
    const word = /[A-Za-z_][A-Za-z0-9_]*/y;
    word.lastIndex = i;
    const w = word.exec(src);
    if (w) {
      if (w[0] === 'true' || w[0] === 'false') { i += w[0].length; return { type: 'boolean', value: w[0] === 'true', start: start, end: i }; }
      if (w[0] === 'null') { i += 4; return { type: 'null', value: null, start: start, end: i }; }
      fail(i, 'Text values need double quotes, found ' + w[0], 'Write "' + w[0] + '" with double quotes.');
    }
    if (c === ',' || c === '}' || c === ']') fail(i, 'A value is missing before ' + c, 'Add a value, or remove the extra punctuation.');
    fail(i, 'Unexpected character ' + c, 'Remove it or replace it with a JSON value.');
  }

  function parseObject() {
    const start = i;
    i++;
    const members = [];
    skipWhitespace();
    if (src[i] === '}') { i++; return { type: 'object', members: members, start: start, end: i }; }
    let lastComma = -1;
    while (true) {
      skipWhitespace();
      if (i >= n) fail(endOfContent(), 'Missing closing brace }', 'Add } to close the object.');
      const c = src[i];
      if (c === '}') fail(lastComma, 'Trailing comma before }', 'Remove the comma after the last property.');
      if (c === "'") fail(i, 'Keys must use double quotes, not single quotes', 'Replace \' with ".');
      if (c !== '"') fail(i, 'Keys must be strings in double quotes', 'Wrap the key in double quotes.');
      const keyStart = i;
      const key = parseString();
      const keyEnd = i;
      skipWhitespace();
      if (src[i] !== ':') fail(Math.min(i, n), 'Expected a colon after the key "' + key + '"', 'Put : between the key and its value.');
      i++;
      const value = parseNode();
      members.push({ key: key, keyStart: keyStart, keyEnd: keyEnd, value: value });
      const valueEnd = i;
      skipWhitespace();
      if (i >= n) fail(endOfContent(), 'Missing closing brace }', 'Add } to close the object.');
      if (src[i] === ',') { lastComma = i; i++; continue; }
      if (src[i] === '}') { i++; return { type: 'object', members: members, start: start, end: i }; }
      if (src[i] === '"' || src[i] === "'") fail(valueEnd, 'Missing comma between properties', 'Add a comma after the previous value.');
      fail(i, 'Unexpected character ' + src[i], 'Use a comma to add a property, or } to close the object.');
    }
  }

  function parseArray() {
    const start = i;
    i++;
    const items = [];
    skipWhitespace();
    if (src[i] === ']') { i++; return { type: 'array', items: items, start: start, end: i }; }
    let lastComma = -1;
    while (true) {
      skipWhitespace();
      if (i >= n) fail(endOfContent(), 'Missing closing bracket ]', 'Add ] to close the array.');
      if (src[i] === ']') fail(lastComma, 'Trailing comma before ]', 'Remove the comma after the last item.');
      items.push(parseNode());
      const valueEnd = i;
      skipWhitespace();
      if (i >= n) fail(endOfContent(), 'Missing closing bracket ]', 'Add ] to close the array.');
      if (src[i] === ',') { lastComma = i; i++; continue; }
      if (src[i] === ']') { i++; return { type: 'array', items: items, start: start, end: i }; }
      if (src[i] === '}') fail(i, 'Found } but this array was opened with [', 'Close the array with ] first.');
      fail(valueEnd, 'Missing comma between items', 'Add a comma after the previous item.');
    }
  }

  try {
    skipWhitespace();
    if (i >= n) return { empty: true };
    const root = parseNode();
    skipWhitespace();
    if (i < n) fail(i, 'Unexpected text after the end of the document', 'Remove the extra text.');
    return { ok: true, root: root };
  } catch (err) {
    if (!err.syntax) throw err;
    return { ok: false, index: err.index, message: err.message, fix: err.fix };
  }
}

// ====================================================================
// Syntax highlighting
// ====================================================================

// Rebuild the per-line colored segments. Called whenever the text changes.
function refreshTokens() {
  const src = editor.elt.value;
  lines = src.split('\n');
  lineStarts = [0];
  for (let k = 0; k < src.length; k++) {
    if (src[k] === '\n') lineStarts.push(k + 1);
  }
  lineSegments = lines.map(() => []);
  for (const t of tokenize(src)) {
    const ln = lineIndexOf(t.start);
    const lineEnd = lineStarts[ln] + lines[ln].length;
    const segEnd = Math.min(t.end, lineEnd);
    if (segEnd > t.start) {
      lineSegments[ln].push({
        col: visualCol(lines[ln], t.start - lineStarts[ln]),
        text: src.slice(t.start, segEnd).replace(/\t/g, ' '),
        color: TOKEN_COLORS[t.type]
      });
    }
  }
}

// Forgiving lexer: it must color broken JSON too, so it never throws.
function tokenize(src) {
  const tokens = [];
  const n = src.length;
  let i = 0;
  while (i < n) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
    const start = i;
    let type = 'punct';
    if (c === '"' || c === "'") {
      i++;
      while (i < n && src[i] !== c && src[i] !== '\n') {
        if (src[i] === '\\' && i + 1 < n && src[i + 1] !== '\n') i++;
        i++;
      }
      if (i < n && src[i] === c) i++;
      type = c === '"' ? 'string' : 'invalid';
      if (c === '"') {
        let j = i;
        while (j < n && /\s/.test(src[j])) j++;
        if (src[j] === ':') type = 'key';
      }
    } else if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(src[i + 1] || ''))) {
      i++;
      while (i < n && /[0-9a-zA-Z.+\-]/.test(src[i])) i++;
      type = 'number';
    } else if (/[A-Za-z_$]/.test(c)) {
      while (i < n && /[A-Za-z0-9_$]/.test(src[i])) i++;
      const word = src.slice(start, i);
      if (word === 'true' || word === 'false') type = 'boolean';
      else if (word === 'null') type = 'null';
      else type = 'invalid';
    } else {
      i++;
    }
    tokens.push({ type: type, start: start, end: i });
  }
  return tokens;
}

function lineIndexOf(index) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lineStarts[mid] <= index) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// Column on screen for a character offset (tabs advance to the next tab stop)
function visualCol(lineText, charCol) {
  if (lineText.indexOf('\t') < 0) return charCol;
  let v = 0;
  for (let k = 0; k < charCol && k < lineText.length; k++) {
    v = lineText[k] === '\t' ? (Math.floor(v / TAB_SIZE) + 1) * TAB_SIZE : v + 1;
  }
  return v;
}

// Inside an iframe there is no scroll bar to get back with, so page scrolling is turned off.
function lockScrollWhenEmbedded() {
  let embedded = true;
  try { embedded = window.self !== window.top; } catch (err) { embedded = true; }
  if (embedded) {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
}

// ====================================================================
// Responsive design - always place these at the END of the code
// ====================================================================

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, canvasHeight);
  layoutControls();
  redraw();
}

function updateCanvasSize() {
  // Get the width of the <main> element
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
