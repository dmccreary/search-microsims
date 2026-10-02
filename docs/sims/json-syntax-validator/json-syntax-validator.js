// JSON Syntax Validator MicroSim
// CANVAS_HEIGHT: 520
// Use this CANVAS_HEIGHT for all the iframe heights that embed this MicroSim
// Bloom Level: Apply (L3) - students USE the JSON syntax rules to find and fix errors.
// Left panel: a small code editor (textarea layered over the canvas so the canvas
// can draw line numbers, syntax colors and a red underline at the error).
// Right panel: the validation result, a fix suggestion and the rule that was broken.
// MicroSim template version 2026.03

// ---------- canvas layout ----------
let containerWidth;                 // set from the <main> element
let canvasWidth = 700;              // responsive width
let drawHeight = 440;               // editor + results
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
const GUTTER_W = 34;                // width of the line-number gutter
const TAB_SIZE = 2;

// ---------- syntax colors (from the chapter specification) ----------
const TOKEN_COLORS = {
  key: 'purple',
  string: 'green',
  number: 'blue',
  boolean: 'darkorange',
  null: 'gray',
  punct: 'black',
  invalid: 'crimson'
};

// The rules taught in the chapter. An error points at the rule it breaks.
// (short = label used when the panel is too narrow for the full text)
const RULES = [
  { id: 'quotes',   text: 'Strings use "double quotes"',         short: '"Double" quotes' },
  { id: 'keys',     text: 'Keys are quoted strings',             short: 'Quoted keys' },
  { id: 'commas',   text: 'Commas between items, none trailing', short: 'No trailing comma' },
  { id: 'numbers',  text: 'Numbers have no leading zeros',       short: 'No leading zeros' },
  { id: 'comments', text: 'No comments allowed',                 short: 'No comments' },
  { id: 'brackets', text: 'Every { and [ is closed',             short: 'Close { and [' }
];

// Examples for the "Load Example" dropdown. Each broken example has ONE kind of error.
const EXAMPLES = {
  'Valid example':
    '{\n  "title": "Pendulum Simulator",\n  "creator": "Dr. Physics",\n  "version": 2.5,\n' +
    '  "isInteractive": true,\n  "publisher": null,\n  "subjects": ["Physics", "Mechanics"],\n' +
    '  "canvas": {\n    "width": 800,\n    "height": 600\n  }\n}',
  'Missing quote':
    '{\n  "title": "Pendulum Simulator,\n  "creator": "Dr. Physics",\n  "version": 2.5\n}',
  'Trailing comma':
    '{\n  "title": "Pendulum Simulator",\n  "creator": "Dr. Physics",\n  "version": 2.5,\n}',
  'Single quotes':
    '{\n  \'title\': \'Pendulum Simulator\',\n  "creator": "Dr. Physics"\n}',
  'Invalid number':
    '{\n  "title": "Pendulum Simulator",\n  "count": 042,\n  "version": 2.5\n}',
  'Unquoted keys':
    '{\n  title: "Pendulum Simulator",\n  creator: "Dr. Physics"\n}',
  'Missing comma':
    '{\n  "title": "Pendulum Simulator"\n  "creator": "Dr. Physics",\n  "version": 2.5\n}',
  'Missing closing brace':
    '{\n  "title": "Pendulum Simulator",\n  "canvas": {\n    "width": 800,\n    "height": 600\n}',
  'Comment in JSON':
    '{\n  // the name of the MicroSim\n  "title": "Pendulum Simulator"\n}'
};

// Shown in gray while the editor is empty
const PLACEHOLDER = [
  'Type or paste JSON here. Example:',
  '',
  '{',
  '  "title": "My MicroSim",',
  '  "version": 1.0,',
  '  "interactive": true,',
  '  "subjects": ["Physics", "Math"]',
  '}'
];

// ---------- controls ----------
let editor;
let validateButton, formatButton, clearButton;
let liveCheckbox;
let exampleSelect;

// ---------- state ----------
let lines = [''];                   // editor text split into lines
let lineStarts = [0];               // character index where each line starts
let lineSegments = [[]];            // colored text segments for each line
let result = { state: 'empty' };    // 'empty' | 'stale' | 'valid' | 'error'
let errorSince = 0;                 // millis() when the current error first appeared
let errorCardBox = null;            // clickable area of the error message
let confetti = [];                  // celebration particles

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
  editor.attribute('aria-label', 'JSON editor');
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
  validateButton.mousePressed(() => runValidation(true));

  formatButton = createButton('Format');
  formatButton.parent(mainElement);
  formatButton.mousePressed(formatJSON);

  clearButton = createButton('Clear');
  clearButton.parent(mainElement);
  clearButton.mousePressed(clearEditor);

  liveCheckbox = createCheckbox('Live validation', true);
  liveCheckbox.parent(mainElement);
  liveCheckbox.changed(() => {
    if (liveCheckbox.checked()) runValidation(false);
  });

  exampleSelect = createSelect();
  exampleSelect.parent(mainElement);
  exampleSelect.option('Choose an example...', '');
  for (const name of Object.keys(EXAMPLES)) exampleSelect.option(name);
  exampleSelect.changed(loadExample);

  layoutControls();
  refreshTokens();

  describe('JSON syntax validator. A text editor on the left accepts JSON. ' +
    'The panel on the right reports whether the JSON is valid, the line and column of the first ' +
    'syntax error, a suggested fix, and which JSON syntax rule was broken.', LABEL);
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
  textSize(canvasWidth < 480 ? 20 : 24);
  text('JSON Syntax Validator', canvasWidth / 2, 10);

  drawEditor();
  drawResultPanel();
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
  const leftW = Math.floor(canvasWidth * 0.55);
  return { x: margin, y: panelTop, w: leftW - margin - 5, h: drawHeight - panelTop - margin };
}

function resultRect() {
  const leftW = Math.floor(canvasWidth * 0.55);
  return { x: leftW + 5, y: panelTop, w: canvasWidth - leftW - 5 - margin, h: drawHeight - panelTop - margin };
}

// Position every DOM control. Called from setup() and windowResized().
function layoutControls() {
  const row1 = drawHeight + 8;
  const row2 = drawHeight + 45;
  let x = 10;
  for (const b of [validateButton, formatButton, clearButton]) {
    b.position(x, row1);
    x += b.elt.offsetWidth + 8;
  }
  liveCheckbox.position(x + 2, row1 + 1);
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
  const hasError = result.state === 'error';

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

  // ---- gutter: line numbers (scroll vertically only) ----
  push();   // push()/pop() keeps p5's cached fill and stroke in sync with the clip
  drawingContext.beginPath();
  drawingContext.rect(r.x + 1, r.y + 1, GUTTER_W - 1, r.h - 2);
  drawingContext.clip();
  textAlign(RIGHT, BASELINE);
  for (let i = first; i <= last; i++) {
    const isErrorLine = hasError && result.error.line0 === i;
    const y = textY + i * LINE_HEIGHT;
    if (isErrorLine) {
      noStroke();
      fill('mistyrose');
      rect(r.x + 1, y, GUTTER_W - 1, LINE_HEIGHT);
    }
    noStroke();
    fill(isErrorLine ? 'red' : 'gray');
    text(i + 1, r.x + GUTTER_W - 7, y + baseOffset);
  }
  pop();

  // ---- text area: colored tokens (scroll both ways) ----
  push();   // push()/pop() keeps p5's cached fill and stroke in sync with the clip
  drawingContext.beginPath();
  drawingContext.rect(r.x + GUTTER_W + 1, r.y + 1, r.w - GUTTER_W - 2, r.h - 2);
  drawingContext.clip();
  textAlign(LEFT, BASELINE);

  if (hasError) {
    noStroke();
    fill('mistyrose');
    rect(r.x + GUTTER_W + 1, textY + result.error.line0 * LINE_HEIGHT, r.w - GUTTER_W - 2, LINE_HEIGHT);
  }

  if (ta.value.length === 0) {
    // placeholder showing a basic JSON structure
    noStroke();
    fill('gray');
    textStyle(ITALIC);
    for (let i = 0; i < PLACEHOLDER.length; i++) {
      text(PLACEHOLDER[i], textX, textY + i * LINE_HEIGHT + baseOffset);
    }
    textStyle(NORMAL);
  } else {
    for (let i = first; i <= last; i++) {
      const y = textY + i * LINE_HEIGHT + baseOffset;
      for (const seg of lineSegments[i]) {
        noStroke();
        fill(seg.color);
        text(seg.text, textX + seg.col * charW, y);
      }
    }
  }

  // red wavy underline at the error
  if (hasError) {
    const e = result.error;
    const lineText = lines[e.line0] || '';
    const c1 = visualCol(lineText, e.col0);
    const c2 = visualCol(lineText, Math.min(lineText.length, e.col0 + e.length));
    const x1 = textX + c1 * charW;
    const x2 = textX + Math.max(c2, c1 + 1) * charW;
    const y = textY + e.line0 * LINE_HEIGHT + baseOffset + 2;
    stroke('red');
    strokeWeight(1.5);
    noFill();
    beginShape();
    let up = true;
    for (let x = x1; x <= x2 + 0.5; x += 3) {
      vertex(x, y + (up ? 0 : 3));
      up = !up;
    }
    endShape();
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

// ====================================================================
// Result panel drawing
// ====================================================================

function drawResultPanel() {
  const r = resultRect();
  push();
  // keep long wrapped messages inside the panel at very narrow widths
  drawingContext.beginPath();
  drawingContext.rect(r.x - 2, r.y - 2, r.w + 4, r.h + 4);
  drawingContext.clip();

  const cardH = drawResultCard(r);
  const rulesH = 34 + RULES.length * 19 + 8;
  const rulesY = r.y + cardH + 10;
  if (rulesY + rulesH <= r.y + r.h + 1) {
    drawRulesCard(r.x, rulesY, r.w, r.y + r.h - rulesY);
  }
  pop();
}

// Draws the status card and returns its height
function drawResultCard(r) {
  const scale = r.w < 230 ? 0.85 : 1;
  const pad = 12;
  const textW = r.w - pad * 2;
  let headline, accent, blocks;

  if (result.state === 'valid') {
    const s = result.stats;
    headline = 'Valid JSON!';
    accent = 'green';
    blocks = [
      { text: 'Your document contains ' + plural(s.objects, 'object') + ' and ' +
          plural(s.arrays, 'array') + '.', size: 16, color: 'black' },
      { text: plural(s.keys, 'key') + ', ' + plural(s.strings, 'string') + ', ' +
          plural(s.numbers, 'number') + ', ' + plural(s.booleans, 'boolean') + ', ' +
          plural(s.nulls, 'null'), size: 14, color: 'dimgray', gap: 6 }
    ];
  } else if (result.state === 'error') {
    const e = result.error;
    headline = 'Syntax Error';
    accent = 'red';
    blocks = [
      { text: 'Line ' + (e.line0 + 1) + ', Column ' + (e.col0 + 1), size: 16, style: BOLD, color: 'black' },
      { text: e.message, size: 15, color: 'black', gap: 4 },
      { text: 'Fix: ' + e.fix, size: 15, color: 'darkgreen', gap: 6 }
    ];
    if (result.note) {
      blocks.push({ text: result.note, size: 13, style: ITALIC, color: 'firebrick', gap: 6 });
    } else {
      blocks.push({ text: 'Click here to jump to the error.', size: 13, style: ITALIC, color: 'dimgray', gap: 6 });
    }
  } else if (result.state === 'stale') {
    headline = 'Not checked yet';
    accent = 'darkorange';
    blocks = [
      { text: 'Predict first: is this JSON valid?', size: 15, color: 'black' },
      { text: 'Then press Validate to check.', size: 15, color: 'black', gap: 4 }
    ];
  } else {
    headline = 'Waiting for JSON';
    accent = 'gray';
    blocks = [
      { text: 'Type JSON in the editor, or pick one from Load Example.', size: 15, color: 'black' },
      { text: 'Fix each error until the check mark turns green.', size: 15, color: 'dimgray', gap: 6 }
    ];
  }

  // measure the wrapped text so the card is exactly as tall as it needs to be
  let bodyH = 0;
  for (const b of blocks) {
    b.px = Math.round(b.size * scale);
    b.lineH = Math.round(b.px * 1.3);
    textSize(b.px);
    textStyle(b.style || NORMAL);
    b.lines = wrapText(b.text, textW);
    bodyH += (b.gap || 0) + b.lines.length * b.lineH;
  }
  const headH = 50;
  const cardH = headH + bodyH + pad;

  // card
  stroke(accent);
  strokeWeight(2);
  fill('white');
  rect(r.x, r.y, r.w, cardH, 10);
  strokeWeight(1);

  // status icon and headline
  drawStatusIcon(r.x + pad + 14, r.y + 26, result.state, accent);
  noStroke();
  fill(accent);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(r.w < 230 ? 15 : 20);
  text(headline, r.x + pad + 36, r.y + 26);

  // body text
  let y = r.y + headH;
  textAlign(LEFT, TOP);
  for (const b of blocks) {
    y += (b.gap || 0);
    textSize(b.px);
    textStyle(b.style || NORMAL);
    noStroke();
    fill(b.color);
    for (const ln of b.lines) {
      text(ln, r.x + pad, y);
      y += b.lineH;
    }
  }
  textStyle(NORMAL);

  errorCardBox = (result.state === 'error') ? { x: r.x, y: r.y, w: r.w, h: cardH } : null;
  const overCard = errorCardBox && mouseX >= r.x && mouseX <= r.x + r.w &&
    mouseY >= r.y && mouseY <= r.y + cardH;
  cursor(overCard ? HAND : ARROW);
  return cardH;
}

// Green check, red X, or a neutral dot inside a circle
function drawStatusIcon(cx, cy, state, accent) {
  noStroke();
  fill(accent);
  circle(cx, cy, 28);
  stroke('white');
  strokeWeight(3);
  noFill();
  if (state === 'valid') {
    line(cx - 7, cy, cx - 2, cy + 5);
    line(cx - 2, cy + 5, cx + 7, cy - 5);
  } else if (state === 'error') {
    line(cx - 5, cy - 5, cx + 5, cy + 5);
    line(cx + 5, cy - 5, cx - 5, cy + 5);
  } else {
    line(cx, cy - 6, cx, cy + 1);
    point(cx, cy + 6);
  }
  strokeWeight(1);
}

// The six syntax rules. The broken rule is marked in red; all turn green when valid.
function drawRulesCard(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('JSON Syntax Rules', x + 12, y + 10);
  textStyle(NORMAL);
  const narrow = w < 290;       // full rule text needs about 290px
  textSize(narrow ? 13 : 14);

  const broken = result.state === 'error' ? result.error.rule : null;
  let ry = y + 34;
  for (const rule of RULES) {
    const mx = x + 19;
    const my = ry + 8;
    if (result.state === 'valid') {
      stroke('green');
      strokeWeight(2);
      line(mx - 5, my, mx - 1, my + 4);
      line(mx - 1, my + 4, mx + 5, my - 4);
    } else if (rule.id === broken) {
      stroke('red');
      strokeWeight(2);
      line(mx - 4, my - 4, mx + 4, my + 4);
      line(mx + 4, my - 4, mx - 4, my + 4);
    } else {
      noStroke();
      fill('silver');
      circle(mx, my, 6);
    }
    strokeWeight(1);
    noStroke();
    fill(rule.id === broken ? 'red' : 'black');
    textStyle(rule.id === broken ? BOLD : NORMAL);
    text(narrow ? rule.short : rule.text, x + 32, ry);
    ry += 19;
  }
  textStyle(NORMAL);
}

// Greedy word wrap using the current text size and style
function wrapText(str, maxW) {
  const words = str.split(' ');
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
  return out;
}

function plural(count, noun) {
  return count + ' ' + noun + (count === 1 ? '' : 's');
}

// ====================================================================
// Celebration (short burst, only after an error has been fixed)
// ====================================================================

function celebrate() {
  const r = resultRect();
  const colors = ['gold', 'tomato', 'dodgerblue', 'mediumseagreen', 'orchid', 'orange'];
  confetti = [];
  for (let i = 0; i < 60; i++) {
    confetti.push({
      x: r.x + random(r.w),
      y: r.y + random(-30, 20),
      vx: random(-1, 1),
      vy: random(1.5, 4),
      size: random(5, 9),
      color: random(colors),
      life: 90
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
  refreshTokens();
  if (liveCheckbox.checked()) {
    runValidation(false);
  } else {
    result = { state: editor.elt.value.trim() === '' ? 'empty' : 'stale' };
  }
}

function runValidation(fromButton) {
  const before = result.state;
  const wasErrorLongEnough = before === 'error' && millis() - errorSince > 1500;
  const next = parseJSON(editor.elt.value);
  if (next.state === 'error' && before !== 'error') errorSince = millis();
  result = next;
  // celebrate when the Validate button confirms valid JSON, or when a visible error gets fixed
  if (next.state === 'valid' && ((fromButton && before !== 'valid') || wasErrorLongEnough)) {
    celebrate();
  }
}

function formatJSON() {
  const parsed = parseJSON(editor.elt.value);
  if (parsed.state === 'valid') {
    // Prettify: two-space indentation, one key-value pair per line
    editor.elt.value = JSON.stringify(parsed.value, null, 2);
    refreshTokens();
    result = parseJSON(editor.elt.value);
  } else if (parsed.state === 'error') {
    if (result.state !== 'error') errorSince = millis();
    result = parsed;
    result.note = 'Format needs valid JSON. Fix this error first.';
  }
}

function clearEditor() {
  editor.elt.value = '';
  exampleSelect.selected('');
  refreshTokens();
  result = { state: 'empty' };
  confetti = [];
}

function loadExample() {
  const name = exampleSelect.value();
  if (!EXAMPLES[name]) return;
  editor.elt.value = EXAMPLES[name];
  editor.elt.scrollTop = 0;
  editor.elt.scrollLeft = 0;
  refreshTokens();
  confetti = [];
  if (liveCheckbox.checked()) {
    result = parseJSON(editor.elt.value);
    if (result.state === 'error') errorSince = millis();
  } else {
    result = { state: 'stale' };
  }
}

// Click the error message to jump to the error in the editor
function mousePressed() {
  if (result.state === 'error' && errorCardBox &&
      mouseX >= errorCardBox.x && mouseX <= errorCardBox.x + errorCardBox.w &&
      mouseY >= errorCardBox.y && mouseY <= errorCardBox.y + errorCardBox.h) {
    jumpToError();
    return false;   // keep the browser from moving focus back to the page
  }
}

function jumpToError() {
  const e = result.error;
  const ta = editor.elt;
  const end = Math.min(ta.value.length, e.index + Math.max(1, e.length));
  ta.focus();
  ta.setSelectionRange(Math.min(e.index, ta.value.length), end);
  const target = e.line0 * LINE_HEIGHT - ta.clientHeight / 2 + LINE_HEIGHT;
  ta.scrollTop = Math.max(0, target);
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
    let ln = lineIndexOf(t.start);
    let pos = t.start;
    while (pos < t.end && ln < lines.length) {   // only block comments span lines
      const lineEnd = lineStarts[ln] + lines[ln].length;
      const segEnd = Math.min(t.end, lineEnd);
      if (segEnd > pos) {
        lineSegments[ln].push({
          col: visualCol(lines[ln], pos - lineStarts[ln]),
          text: src.slice(pos, segEnd).replace(/\t/g, ' '),
          color: TOKEN_COLORS[t.type]
        });
      }
      pos = segEnd + 1;
      ln++;
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
      if (c === '"' && nextSignificant(src, i) === ':') type = 'key';
    } else if (/[0-9]/.test(c) || ((c === '-' || c === '+' || c === '.') && /[0-9.]/.test(src[i + 1] || ''))) {
      i++;
      while (i < n && /[0-9a-zA-Z.+\-]/.test(src[i])) i++;
      type = 'number';
    } else if (/[A-Za-z_$]/.test(c)) {
      while (i < n && /[A-Za-z0-9_$]/.test(src[i])) i++;
      const word = src.slice(start, i);
      if (word === 'true' || word === 'false') type = 'boolean';
      else if (word === 'null') type = 'null';
      else type = 'invalid';
    } else if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++;
      type = 'invalid';
    } else if (c === '/' && src[i + 1] === '*') {
      const close = src.indexOf('*/', i + 2);
      i = close < 0 ? n : close + 2;
      type = 'invalid';
    } else {
      i++;
    }
    tokens.push({ type: type, start: start, end: i });
  }
  return tokens;
}

function nextSignificant(src, from) {
  let j = from;
  while (j < src.length && /\s/.test(src[j])) j++;
  return src[j];
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

// ====================================================================
// JSON parser with teaching-friendly error messages
// Returns { state: 'empty' } | { state: 'valid', value, stats } |
//         { state: 'error', error: { index, length, line0, col0, message, fix, rule } }
// Like every real JSON parser, it stops at the FIRST error.
// ====================================================================

function parseJSON(src) {
  const n = src.length;
  let i = 0;
  const stats = { objects: 0, arrays: 0, keys: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 };

  function fail(index, length, message, fix, rule) {
    throw { jsonError: true, index: index, length: length, message: message, fix: fix, rule: rule };
  }
  function isDigit(c) { return c !== undefined && c >= '0' && c <= '9'; }
  function isWordStart(c) { return c !== undefined && /[A-Za-z_$]/.test(c); }
  function startsValue(c) {
    return c === '"' || c === "'" || c === '{' || c === '[' || c === '-' || isDigit(c) || isWordStart(c);
  }
  function readWord(at) {
    let j = at;
    while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++;
    return src.slice(at, j);
  }
  function lineNumberOf(index) {
    let count = 1;
    for (let k = 0; k < index && k < n; k++) if (src[k] === '\n') count++;
    return count;
  }
  function singleQuotedLength(at) {
    let j = at + 1;
    while (j < n && src[j] !== "'" && src[j] !== '\n') j++;
    return (j < n && src[j] === "'") ? j - at + 1 : 1;
  }
  function failUnclosed(openIndex, kind) {
    const closer = kind === 'object' ? '}' : ']';
    const name = kind === 'object' ? 'brace' : 'bracket';
    let end = n;
    while (end > 0 && /\s/.test(src[end - 1])) end--;   // point just after the last character
    fail(end, 1,
      'Missing closing ' + name + ' ' + closer + ' for the ' + kind + ' opened on line ' + lineNumberOf(openIndex),
      'Add ' + closer + ' to close the ' + kind, 'brackets');
  }

  function skipWhitespace() {
    while (i < n) {
      const c = src[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
        i++;
      } else if (c === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) {
        let end = src.indexOf('\n', i);
        if (end < 0) end = n;
        fail(i, end - i, 'Comments are not allowed in JSON',
          'Delete the comment. JSON has no comment syntax', 'comments');
      } else {
        break;
      }
    }
  }

  function parseValue() {
    skipWhitespace();
    if (i >= n) {
      fail(n, 1, 'The document ended where a value was expected',
        'Add a value such as "text", 42, true, null, {} or []', null);
    }
    const c = src[i];
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    if (c === '"') { stats.strings++; return parseString(); }
    if (c === "'") {
      fail(i, singleQuotedLength(i), 'Expected double quote, found single quote',
        'Replace \' with " around string values', 'quotes');
    }
    if (c === '-' || isDigit(c)) { stats.numbers++; return parseNumber(); }
    if (c === '+') {
      fail(i, 1, 'Numbers cannot start with a plus sign', 'Remove the + sign', 'numbers');
    }
    if (c === '.') {
      fail(i, 1, 'Numbers need a digit before the decimal point', 'Write 0.5 instead of .5', 'numbers');
    }
    if (c === ',') {
      fail(i, 1, 'Unexpected comma. A value is missing here', 'Remove the extra comma or add a value', 'commas');
    }
    if (c === '}' || c === ']') {
      fail(i, 1, 'A value is missing before ' + c, 'Add a value such as "text", 42, true or null', null);
    }
    if (isWordStart(c)) {
      const word = readWord(i);
      if (word === 'true' || word === 'false') { stats.booleans++; i += word.length; return word === 'true'; }
      if (word === 'null') { stats.nulls++; i += 4; return null; }
      const lower = word.toLowerCase();
      if (lower === 'true' || lower === 'false' || lower === 'null') {
        fail(i, word.length, word + ' must be written in lowercase', 'Write ' + lower + ' instead of ' + word, null);
      }
      if (word === 'None' || word === 'undefined' || word === 'nil') {
        fail(i, word.length, word + ' is not a JSON value', 'Use null for an empty value', null);
      }
      if (word === 'NaN' || word === 'Infinity') {
        fail(i, word.length, word + ' is not a valid JSON number', 'Use a regular number or null', 'numbers');
      }
      fail(i, word.length, 'Text values need double quotes, found ' + word,
        'Write "' + word + '" with double quotes', 'quotes');
    }
    fail(i, 1, 'Unexpected character ' + c, 'Remove it or replace it with a valid JSON value', null);
  }

  function parseString() {
    const start = i;
    i++;
    while (true) {
      if (i >= n || src[i] === '\n') {
        fail(start, i - start, 'String is missing its closing double quote',
          'Add " at the end of the string', 'quotes');
      }
      const c = src[i];
      if (c === '"') { i++; break; }
      if (c === '\\') {
        const next = src[i + 1];
        if (next === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(src.slice(i + 2, i + 6))) {
            fail(i, 2, 'A \\u escape needs four hex digits', 'Write it like \\u00e9', 'quotes');
          }
          i += 6;
        } else if (next !== undefined && '"\\/bfnrt'.indexOf(next) >= 0) {
          i += 2;
        } else {
          fail(i, 2, 'Invalid escape sequence in string',
            'Use a valid escape such as \\n, \\t, \\" or \\\\', 'quotes');
        }
        continue;
      }
      if (c.charCodeAt(0) < 32) {
        fail(i, 1, 'Tab or control character inside a string', 'Use an escape such as \\t instead', 'quotes');
      }
      i++;
    }
    try {
      return JSON.parse(src.slice(start, i));
    } catch (err) {
      return src.slice(start + 1, i - 1);
    }
  }

  function parseNumber() {
    const start = i;
    if (src[i] === '-') i++;
    if (src[i] === '0') {
      i++;
      if (isDigit(src[i])) {
        while (isDigit(src[i])) i++;
        const digits = src.slice(start, i);
        fail(start, i - start, 'Numbers cannot have leading zeros',
          'Remove the leading zero: ' + digits + ' becomes ' + digits.replace(/^(-?)0+(?=\d)/, '$1'), 'numbers');
      }
    } else if (isDigit(src[i])) {
      while (isDigit(src[i])) i++;
    } else {
      fail(start, 1, 'A minus sign must be followed by a digit', 'Write a number such as -5', 'numbers');
    }
    if (src[i] === '.') {
      i++;
      if (!isDigit(src[i])) {
        fail(start, i - start, 'A decimal point must be followed by digits', 'Write 5.0 instead of 5.', 'numbers');
      }
      while (isDigit(src[i])) i++;
    }
    if (src[i] === 'e' || src[i] === 'E') {
      i++;
      if (src[i] === '+' || src[i] === '-') i++;
      if (!isDigit(src[i])) {
        fail(start, i - start, 'An exponent needs digits after e', 'Write it like 1.5e3', 'numbers');
      }
      while (isDigit(src[i])) i++;
    }
    if (isWordStart(src[i])) {
      const tail = readWord(i);
      fail(start, i - start + tail.length, 'Invalid number format',
        'JSON numbers are plain decimals such as 42 or 3.14', 'numbers');
    }
    return Number(src.slice(start, i));
  }

  function parseObject() {
    const open = i;
    i++;
    stats.objects++;
    const obj = {};
    skipWhitespace();
    if (i < n && src[i] === '}') { i++; return obj; }
    let lastComma = -1;
    while (true) {
      skipWhitespace();
      if (i >= n) failUnclosed(open, 'object');
      let c = src[i];
      let key;
      if (c === '"') {
        key = parseString();
        stats.keys++;
      } else if (c === "'") {
        fail(i, singleQuotedLength(i), 'Expected double quote, found single quote',
          'Replace \' with " around the key', 'quotes');
      } else if (c === '}') {
        fail(lastComma, 1, 'Trailing comma before }', 'Remove the comma after the last key-value pair', 'commas');
      } else if (isWordStart(c)) {
        const word = readWord(i);
        fail(i, word.length, 'Key ' + word + ' is not in double quotes',
          'Wrap the key in double quotes: "' + word + '"', 'keys');
      } else if (isDigit(c) || c === '-') {
        fail(i, 1, 'Keys must be strings, not numbers', 'Wrap the key in double quotes', 'keys');
      } else if (c === ',') {
        fail(i, 1, 'Unexpected comma. A key-value pair is missing', 'Remove the extra comma', 'commas');
      } else {
        fail(i, 1, 'Expected a key in double quotes, found ' + c, 'Start each pair with a "key"', 'keys');
      }

      skipWhitespace();
      if (i >= n) failUnclosed(open, 'object');
      if (src[i] !== ':') {
        fail(i, 1, 'Expected a colon after the key "' + key + '"',
          'Put a colon between the key and its value', 'keys');
      }
      i++;
      obj[key] = parseValue();
      const valueEnd = i;

      skipWhitespace();
      if (i >= n) failUnclosed(open, 'object');
      c = src[i];
      if (c === ',') { lastComma = i; i++; continue; }
      if (c === '}') { i++; return obj; }
      if (c === ']') {
        fail(i, 1, 'Found ] but this object was opened with {', 'Close the object with } instead', 'brackets');
      }
      if (startsValue(c)) {
        fail(valueEnd, 1, 'Missing comma between elements', 'Add a comma after the previous value', 'commas');
      }
      fail(i, 1, 'Unexpected character ' + c, 'Use a comma to add another pair, or } to close the object', null);
    }
  }

  function parseArray() {
    const open = i;
    i++;
    stats.arrays++;
    const arr = [];
    skipWhitespace();
    if (i < n && src[i] === ']') { i++; return arr; }
    let lastComma = -1;
    while (true) {
      skipWhitespace();
      if (i >= n) failUnclosed(open, 'array');
      if (src[i] === ']') {
        fail(lastComma, 1, 'Trailing comma before ]', 'Remove the comma after the last element', 'commas');
      }
      arr.push(parseValue());
      const valueEnd = i;

      skipWhitespace();
      if (i >= n) failUnclosed(open, 'array');
      const c = src[i];
      if (c === ',') { lastComma = i; i++; continue; }
      if (c === ']') { i++; return arr; }
      if (c === '}') {
        fail(i, 1, 'Found } but this array was opened with [', 'Close the array with ] first', 'brackets');
      }
      if (c === ':') {
        fail(i, 1, 'Unexpected colon. Arrays hold values, not key-value pairs',
          'Use { } when you need key-value pairs', null);
      }
      if (startsValue(c)) {
        fail(valueEnd, 1, 'Missing comma between elements', 'Add a comma after the previous element', 'commas');
      }
      fail(i, 1, 'Unexpected character ' + c, 'Use a comma to add another element, or ] to close the array', null);
    }
  }

  try {
    skipWhitespace();
    if (i >= n) return { state: 'empty' };
    const value = parseValue();
    skipWhitespace();
    if (i < n) {
      const c = src[i];
      if (c === '}' || c === ']') {
        fail(i, 1, 'Extra closing ' + c + ' with nothing left to close', 'Remove the extra ' + c, 'brackets');
      }
      if (c === ',') {
        fail(i, 1, 'Unexpected comma after the end of the document', 'Remove the comma', 'commas');
      }
      fail(i, 1, 'Unexpected text after the end of the JSON document',
        'A JSON document holds one top-level value. Remove the extra text', null);
    }
    return { state: 'valid', value: value, stats: stats };
  } catch (err) {
    if (!err.jsonError) throw err;
    // convert the character index into a zero-based line and column
    const index = Math.max(0, Math.min(err.index, n));
    let line0 = 0;
    let lineStart = 0;
    for (let k = 0; k < index; k++) {
      if (src[k] === '\n') { line0++; lineStart = k + 1; }
    }
    return {
      state: 'error',
      error: {
        index: index, length: err.length, line0: line0, col0: index - lineStart,
        message: err.message, fix: err.fix, rule: err.rule
      }
    };
  }
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
