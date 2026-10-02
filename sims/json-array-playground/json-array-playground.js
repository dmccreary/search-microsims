// Array Operations Playground MicroSim
// CANVAS_HEIGHT: 515
// Use this CANVAS_HEIGHT for all the iframe heights that embed this MicroSim
// Bloom Level: Apply (L3) - students DEMONSTRATE JSON array operations by adding,
// removing, reordering and nesting elements while watching the JSON text change.
// Left: the array drawn as connected boxes (train cars) with index numbers.
// Right: the live JSON for the same array.
// MicroSim template version 2026.03

// ---------- canvas layout ----------
let containerWidth;                 // set from the <main> element
let canvasWidth = 700;              // responsive width
let drawHeight = 400;               // array picture + live JSON
let controlHeight = 115;            // three rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;
let panelTop = 48;                  // y where both panels start (below the title)

// ---------- array picture geometry ----------
const BOX_H = 48;                   // height of one element box
const ROW_H = 82;                   // box + index number + gap
const GAP = 12;                     // gap between boxes (the coupler)
const BRACKET_W = 26;               // room for the [ and ] at each end
const MAX_ROWS = 3;                 // rows of boxes that fit in the picture
const MAX_NESTED_ITEMS = 5;         // elements allowed inside one nested array
const FLASH_FRAMES = 50;            // how long a new or moved element glows

// box colors by JSON type (from the chapter specification)
const TYPE_COLORS = {
  string:  { fill: 'lightgreen',  border: 'green',        tag: 'darkgreen' },
  number:  { fill: 'lightblue',   border: 'steelblue',    tag: 'darkblue' },
  boolean: { fill: 'navajowhite', border: 'darkorange',   tag: 'saddlebrown' },
  array:   { fill: 'lavender',    border: 'mediumpurple', tag: 'indigo' }
};

// colors for the JSON text
const JSON_COLORS = { string: 'green', number: 'blue', boolean: 'darkorange', punct: 'black' };

// Practice goals from the chapter's sample scenarios
const CHALLENGES = [
  // Free play starts with two elements so index numbers, brackets and the matching
  // JSON are visible before the first click. Clear Array gives the empty array [].
  { name: 'Free play (no goal)', start: ['Physics', 'Mechanics'], goal: null,
    intro: 'This array has 2 elements. Type a value and press Add Element to make it longer.' },
  { name: 'Goal: subject array', start: [], goal: ['Physics', 'Mechanics', 'Forces'],
    intro: 'Build an array of three subject strings.' },
  { name: 'Goal: reorder by dragging', start: ['Apply', 'Remember', 'Understand'],
    goal: ['Remember', 'Understand', 'Apply'],
    intro: 'Drag the boxes until the Bloom levels are in order.' },
  { name: 'Goal: 2D grid (nested)', start: [], goal: [[1, 2], [3, 4], [5, 6]],
    intro: 'Press Add Nested Array, then add two numbers inside it. Repeat for three rows.' },
  { name: 'Goal: mixed types', start: [], goal: ['text', 42, true],
    intro: 'Add one string, one number and one boolean, then read the warning under the JSON.' }
];

// ---------- controls ----------
let valueInput, typeSelect, positionSelect;
let addButton, nestedButton, removeButton, clearButton, copyButton;
let challengeSelect;

// ---------- state ----------
let arr = [];                       // main array: { id, type, value, items, x, y, appear, flash }
let ghosts = [];                    // removed elements that are fading out
let nextId = 1;
let selected = null;                // { id, innerId } - innerId is null unless an inner element is selected
let press = null;                   // mouse press that may become a drag
let dragInsertIndex = -1;           // where the dragged element would land
let displayOrder = [];              // arr, or the preview order while dragging
let closeBracket = { x: 0, y: 0 };  // animated position of the closing ]
let message = { text: '', kind: 'info' };
let challenge = CHALLENGES[0];
let positionKey = '';               // remembers what the Position list was built for

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // When embedded, the iframe is exactly as tall as the canvas. Lock the page so that
  // keys such as Home and End cannot scroll the MicroSim out of view inside its iframe.
  lockScrollWhenEmbedded();
  textSize(defaultTextSize);

  // Always use the native builtin p5.js controls
  valueInput = createInput('');
  valueInput.parent(mainElement);
  valueInput.attribute('placeholder', 'Forces');
  valueInput.attribute('aria-label', 'Value of the new element');
  valueInput.elt.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addElement();
  });

  typeSelect = createSelect();
  typeSelect.parent(mainElement);
  typeSelect.option('string');
  typeSelect.option('number');
  typeSelect.option('boolean');
  typeSelect.attribute('aria-label', 'Type of the new element');
  typeSelect.changed(updatePlaceholder);

  positionSelect = createSelect();
  positionSelect.parent(mainElement);
  positionSelect.attribute('aria-label', 'Position of the new element');

  addButton = createButton('Add Element');
  addButton.parent(mainElement);
  addButton.mousePressed(addElement);

  nestedButton = createButton('Add Nested Array');
  nestedButton.parent(mainElement);
  nestedButton.mousePressed(addNestedArray);

  removeButton = createButton('Remove Selected');
  removeButton.parent(mainElement);
  removeButton.mousePressed(removeSelected);

  clearButton = createButton('Clear Array');
  clearButton.parent(mainElement);
  clearButton.mousePressed(clearArray);

  copyButton = createButton('Copy JSON');
  copyButton.parent(mainElement);
  copyButton.mousePressed(copyJSON);

  challengeSelect = createSelect();
  challengeSelect.parent(mainElement);
  CHALLENGES.forEach((c, i) => challengeSelect.option(c.name, String(i)));
  challengeSelect.attribute('aria-label', 'Practice goal');
  challengeSelect.changed(loadChallenge);

  refreshPositionOptions();
  layoutControls();
  loadChallenge();

  describe('Array operations playground. A JSON array is drawn as a row of connected boxes with ' +
    'index numbers. Controls add, remove, reorder and nest elements, and a panel shows the ' +
    'resulting JSON text.', LABEL);
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
  text('Array Operations Playground', canvasWidth / 2, 10);

  refreshPositionOptions();
  updateTargets();
  drawArrayPicture();
  drawStatusArea();
  drawJsonPanel();

  // control label
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Value:', 10, drawHeight + 20);
}

// ====================================================================
// Layout
// ====================================================================

function arrayRect() {
  const leftW = Math.floor(canvasWidth * 0.58);
  return { x: margin, y: panelTop + 8, w: leftW - margin - 4, h: MAX_ROWS * ROW_H };
}

function jsonRect() {
  const leftW = Math.floor(canvasWidth * 0.58);
  return { x: leftW + 6, y: panelTop, w: canvasWidth - leftW - 6 - margin, h: drawHeight - panelTop - margin };
}

// Position every DOM control. Called from setup() and windowResized().
function layoutControls() {
  const row1 = drawHeight + 8;
  const row2 = drawHeight + 43;
  const row3 = drawHeight + 78;

  // Row 1: Value: [input] [type] [position]
  const typeW = typeSelect.elt.offsetWidth;
  const posW = 112;
  positionSelect.size(posW);
  const inputX = 62;
  const inputW = Math.max(90, Math.min(260, canvasWidth - inputX - typeW - posW - 16 - margin));
  valueInput.position(inputX, row1);
  valueInput.size(inputW);
  typeSelect.position(inputX + inputW + 14, row1 + 1);
  positionSelect.position(inputX + inputW + 14 + typeW + 8, row1 + 1);

  // Row 2: the three operations
  let x = 10;
  for (const b of [addButton, nestedButton, removeButton]) {
    b.position(x, row2);
    x += b.elt.offsetWidth + 8;
  }

  // Row 3: clear, copy and the practice goal
  x = 10;
  for (const b of [clearButton, copyButton]) {
    b.position(x, row3);
    x += b.elt.offsetWidth + 8;
  }
  challengeSelect.position(x + 4, row3 + 1);
  challengeSelect.size(Math.min(210, canvasWidth - x - 4 - margin));
}

// ====================================================================
// Array model helpers
// ====================================================================

function makeElement(value) {
  const e = { id: nextId++, x: null, y: null, appear: 0, flash: FLASH_FRAMES };
  if (Array.isArray(value)) {
    e.type = 'array';
    e.items = value.map(v => ({ id: nextId++, type: typeof v, value: v }));
  } else {
    e.type = typeof value;
    e.value = value;
  }
  return e;
}

function plainValue(e) {
  return e.type === 'array' ? e.items.map(item => item.value) : e.value;
}

function currentValue() {
  return arr.map(plainValue);
}

function findElement(id) {
  return arr.find(e => e.id === id) || null;
}

// The nested array that new elements go into, or null for the main array
function targetNested() {
  if (!selected) return null;
  const e = findElement(selected.id);
  return (e && e.type === 'array') ? e : null;
}

function displayText(item) {
  if (item.type === 'string') {
    let s = JSON.stringify(item.value);
    if (s.length > 16) s = s.slice(0, 14) + '…"';
    return s;
  }
  return String(item.value);
}

function miniWidth(item) {
  textSize(13);
  textStyle(NORMAL);
  return Math.max(26, textWidth(displayText(item)) + 12);
}

function elementWidth(e) {
  if (e.type === 'array') {
    let w = 34;                                     // room for the inner [ and ]
    e.items.forEach((item, i) => { w += miniWidth(item) + (i > 0 ? 5 : 0); });
    return Math.max(78, w);
  }
  textSize(16);
  textStyle(NORMAL);
  return Math.max(70, textWidth(displayText(e)) + (e.type === 'boolean' ? 46 : 24));
}

// Flow the boxes left to right, wrapping to a new row when the panel is full
function computeSlots(list) {
  const r = arrayRect();
  const left = r.x + BRACKET_W;
  const right = r.x + r.w - BRACKET_W;
  const slots = [];
  let x = left;
  let y = r.y;
  for (const e of list) {
    const w = elementWidth(e);
    if (x + w > right && x > left) {
      x = left;
      y += ROW_H;
    }
    slots.push({ x: x, y: y, w: w });
    x += w + GAP;
  }
  const rows = Math.round((y - r.y) / ROW_H) + 1;
  const closeX = list.length > 0 ? x - GAP + 4 : left + 2;
  return { slots: slots, rows: rows, close: { x: closeX, y: y } };
}

// Would this list still fit in the picture?
function fits(list) {
  return computeSlots(list).rows <= MAX_ROWS;
}

// ====================================================================
// Drawing the array
// ====================================================================

// Set the target position of every element (and make room while dragging)
function updateTargets() {
  let order = arr;
  if (press && press.dragging) {
    const dragged = arr[press.index];
    order = arr.filter(e => e !== dragged);
    order.splice(dragInsertIndex, 0, dragged);
  }
  displayOrder = order;
  const layout = computeSlots(order);
  order.forEach((e, i) => {
    e.tx = layout.slots[i].x;
    e.ty = layout.slots[i].y;
    e.w = layout.slots[i].w;
    if (e.x === null) { e.x = e.tx; e.y = e.ty; }
    // elements slide smoothly into position
    e.x = lerp(e.x, e.tx, 0.25);
    e.y = lerp(e.y, e.ty, 0.25);
    if (Math.abs(e.x - e.tx) < 0.5) e.x = e.tx;
    if (Math.abs(e.y - e.ty) < 0.5) e.y = e.ty;
    if (e.appear < 1) e.appear = Math.min(1, e.appear + 0.12);
    if (e.flash > 0) e.flash--;
  });
  closeBracket.x = lerp(closeBracket.x, layout.close.x, 0.25);
  closeBracket.y = lerp(closeBracket.y, layout.close.y, 0.25);
}

function drawArrayPicture() {
  const r = arrayRect();

  // opening and closing brackets
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textSize(52);
  textAlign(LEFT, CENTER);
  text('[', r.x + 4, r.y + BOX_H / 2 - 3);
  text(']', closeBracket.x, closeBracket.y + BOX_H / 2 - 3);

  if (arr.length === 0 && ghosts.length === 0) {
    fill('dimgray');
    textSize(15);
    textAlign(LEFT, CENTER);
    text('empty array', closeBracket.x + 28, r.y + BOX_H / 2);
  }

  // couplers between neighbors in the same row (like train cars)
  stroke('gray');
  strokeWeight(3);
  const draggedElement = (press && press.dragging) ? arr[press.index] : null;
  for (let i = 0; i < displayOrder.length - 1; i++) {
    const a = displayOrder[i];
    const b = displayOrder[i + 1];
    if (a !== draggedElement && b !== draggedElement && Math.abs(a.y - b.y) < 2) {
      line(a.x + a.w, a.y + BOX_H / 2, b.x, b.y + BOX_H / 2);
    }
  }
  strokeWeight(1);

  // removed elements fade out
  for (const g of ghosts) {
    g.alpha -= 0.08;
    if (g.alpha > 0) {
      push();
      drawingContext.globalAlpha = g.alpha;
      drawElement(g.element, g.element.x, g.element.y, false, -1);
      pop();
    }
  }
  ghosts = ghosts.filter(g => g.alpha > 0);

  // elements with their index numbers (while dragging, the numbers preview the new order)
  displayOrder.forEach((e, i) => {
    if (e === draggedElement) return;                           // drawn last, on top
    push();
    drawingContext.globalAlpha = e.appear;
    drawElement(e, e.x, e.y, selected && selected.id === e.id, i);
    pop();
  });

  // the element being dragged follows the mouse
  if (press && press.dragging) {
    const e = arr[press.index];
    const x = mouseX - press.offX;
    const y = mouseY - press.offY;
    noStroke();
    fill(0, 0, 0, 40);
    rect(x + 4, y + 5, e.w, BOX_H, 8);
    drawElement(e, x, y, true, -1);
    // insertion marker: the index it will get
    noStroke();
    fill('black');
    textSize(14);
    textAlign(CENTER, TOP);
    text('to index ' + dragInsertIndex, x + e.w / 2, y + BOX_H + 6);
  }
}

// One box of the train. index < 0 hides the index number.
function drawElement(e, x, y, isSelected, index) {
  const c = TYPE_COLORS[e.type];
  const w = e.w || elementWidth(e);

  // glow on a new or moved element
  if (e.flash > 0) {
    noStroke();
    fill(255, 215, 0, map(e.flash, 0, FLASH_FRAMES, 0, 200));
    rect(x - 5, y - 5, w + 10, BOX_H + 10, 12);
  }

  stroke(isSelected ? 'black' : c.border);
  strokeWeight(isSelected ? 3 : 1.5);
  fill(c.fill);
  rect(x, y, w, BOX_H, 8);
  strokeWeight(1);

  // type tag
  noStroke();
  fill(c.tag);
  textStyle(NORMAL);
  textSize(12);
  textAlign(LEFT, TOP);
  text(e.type, x + 7, y + 3);

  if (e.type === 'array') {
    // nested array: a box that contains smaller boxes
    fill(c.tag);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('[', x + 9, y + 31);
    text(']', x + w - 9, y + 31);
    let mx = x + 17;
    if (e.items.length === 0) {
      fill('dimgray');
      textSize(13);
      text('empty', x + w / 2, y + 32);
    }
    for (const item of e.items) {
      const mw = miniWidth(item);
      const mc = TYPE_COLORS[item.type];
      const innerSelected = isSelected && selected && selected.innerId === item.id;
      stroke(innerSelected ? 'black' : mc.border);
      strokeWeight(innerSelected ? 2.5 : 1);
      fill(mc.fill);
      rect(mx, y + 19, mw, 24, 5);
      strokeWeight(1);
      noStroke();
      fill('black');
      textSize(13);
      textAlign(CENTER, CENTER);
      text(displayText(item), mx + mw / 2, y + 32);
      mx += mw + 5;
    }
  } else if (e.type === 'boolean') {
    // true/false icon next to the value
    const cx = x + 20;
    const cy = y + 31;
    noStroke();
    fill(e.value ? 'green' : 'firebrick');
    circle(cx, cy, 18);
    stroke('white');
    strokeWeight(2);
    if (e.value) {
      line(cx - 4, cy, cx - 1, cy + 3);
      line(cx - 1, cy + 3, cx + 5, cy - 4);
    } else {
      line(cx - 3, cy - 3, cx + 3, cy + 3);
      line(cx + 3, cy - 3, cx - 3, cy + 3);
    }
    strokeWeight(1);
    noStroke();
    fill('black');
    textSize(16);
    textAlign(LEFT, CENTER);
    text(String(e.value), x + 34, y + 32);
  } else {
    noStroke();
    fill('black');
    textSize(16);
    textAlign(CENTER, CENTER);
    text(displayText(e), x + w / 2, y + 32);
  }

  // index number below the box
  if (index >= 0) {
    noStroke();
    fill('dimgray');
    textSize(14);
    textAlign(CENTER, TOP);
    text(index, x + w / 2, y + BOX_H + 5);
  }
}

// Message about the last operation, and the practice goal
function drawStatusArea() {
  const r = arrayRect();
  const y0 = r.y + r.h;
  const w = r.w - 6;

  // block A: what just happened
  noStroke();
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  textSize(15);
  fill(message.kind === 'error' ? 'firebrick' : (message.kind === 'success' ? 'darkgreen' : 'black'));
  drawWrapped(message.text, r.x + 4, y0 + 2, w, 19, 2);

  // block B: the goal, or a tip in free play
  textSize(14);
  if (challenge.goal) {
    const done = goalReached();
    if (done) {
      noStroke();
      fill('green');
      circle(r.x + 13, y0 + 58, 18);
      stroke('white');
      strokeWeight(2);
      line(r.x + 9, y0 + 58, r.x + 12, y0 + 61);
      line(r.x + 12, y0 + 61, r.x + 18, y0 + 54);
      strokeWeight(1);
    }
    noStroke();
    fill(done ? 'darkgreen' : 'black');
    textStyle(BOLD);
    const label = done ? 'Goal reached: ' : 'Goal: ';
    const x = r.x + (done ? 28 : 4);
    drawWrapped(label + compactJSON(challenge.goal), x, y0 + 48, w - (done ? 24 : 0), 18, 2);
    textStyle(NORMAL);
  } else {
    noStroke();
    fill('dimgray');
    drawWrapped('Tip: click a box to select it. Drag a box to reorder the array.', r.x + 4, y0 + 48, w, 18, 2);
  }
}

// Draw text wrapped to maxW, at most maxLines lines
function drawWrapped(str, x, y, maxW, lineH, maxLines) {
  const words = str.split(' ');
  let current = '';
  let count = 0;
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (current && textWidth(candidate) > maxW) {
      if (count < maxLines) text(current, x, y + count * lineH);
      count++;
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current && count < maxLines) text(current, x, y + count * lineH);
}

// ====================================================================
// Live JSON panel
// ====================================================================

function compactJSON(value) {
  return JSON.stringify(value).replace(/,/g, ', ');
}

// tokens of one value, for colored drawing
function valueTokens(value) {
  if (Array.isArray(value)) {
    const tokens = [{ text: '[', color: JSON_COLORS.punct }];
    value.forEach((v, i) => {
      if (i > 0) tokens.push({ text: ', ', color: JSON_COLORS.punct });
      tokens.push({ text: JSON.stringify(v), color: JSON_COLORS[typeof v] });
    });
    tokens.push({ text: ']', color: JSON_COLORS.punct });
    return tokens;
  }
  return [{ text: JSON.stringify(value), color: JSON_COLORS[typeof value] }];
}

function drawJsonPanel() {
  const r = jsonRect();
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 10);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('Live JSON', r.x + 12, r.y + 9);
  textStyle(NORMAL);

  push();
  drawingContext.beginPath();
  drawingContext.rect(r.x + 2, r.y + 2, r.w - 4, r.h - 4);
  drawingContext.clip();

  // one element per line, like JSON.stringify(value, null, 2)
  const lineH = 18;
  let y = r.y + 34;
  const x = r.x + 12;
  textFont('monospace');             // code font so the JSON lines up
  textSize(14);
  textAlign(LEFT, TOP);
  if (arr.length === 0) {
    noStroke();
    fill(JSON_COLORS.punct);
    text('[]', x, y);
    y += lineH;
  } else {
    noStroke();
    fill(JSON_COLORS.punct);
    text('[', x, y);
    y += lineH;
    arr.forEach((e, i) => {
      if (e.flash > 0) {
        // the line that just changed glows, linking the box to its JSON text
        noStroke();
        fill(255, 215, 0, map(e.flash, 0, FLASH_FRAMES, 0, 200));
        rect(r.x + 4, y - 2, r.w - 8, lineH);
      }
      let tx = x + textWidth('  ');
      const tokens = valueTokens(plainValue(e));
      if (i < arr.length - 1) tokens.push({ text: ',', color: JSON_COLORS.punct });
      for (const t of tokens) {
        noStroke();
        fill(t.color);
        text(t.text, tx, y);
        tx += textWidth(t.text);
      }
      y += lineH;
    });
    noStroke();
    fill(JSON_COLORS.punct);
    text(']', x, y);
    y += lineH;
  }
  textFont('sans-serif');

  // facts about the array
  y += 6;
  stroke('gainsboro');
  line(r.x + 10, y, r.x + r.w - 10, y);
  y += 8;
  noStroke();
  fill('black');
  textSize(14);
  text('length: ' + arr.length + (arr.length > 0 ? '   last index: ' + (arr.length - 1) : ''), x, y);
  y += 22;

  const types = [];
  for (const e of arr) if (!types.includes(e.type)) types.push(e.type);
  if (types.length === 1) {
    fill('darkgreen');
    const note = types[0] === 'array'
      ? 'All elements are arrays: a 2D structure.'
      : 'All elements are ' + types[0] + 's: consistent.';
    drawWrapped(note, x, y, r.w - 24, 18, 3);
  } else if (types.length > 1) {
    fill('firebrick');
    drawWrapped('Mixed types (' + types.join(', ') + '): valid JSON, but poor practice. ' +
      'Keep one type per array.', x, y, r.w - 24, 18, 4);
  }
  pop();
}

// ====================================================================
// Operations
// ====================================================================

function setMessage(text, kind) {
  message = { text: text, kind: kind || 'info' };
}

function updatePlaceholder() {
  const type = typeSelect.value();
  valueInput.attribute('placeholder', type === 'string' ? 'Forces' : (type === 'number' ? '42' : 'true or false'));
}

// Turn the text box into a JSON value of the chosen type. Returns { ok, value } or { ok: false, error }.
function readValue() {
  const raw = valueInput.value().trim();
  const type = typeSelect.value();
  if (raw === '') {
    return { ok: false, error: 'Type a value in the Value box first.' };
  }
  if (type === 'number') {
    const num = Number(raw);
    if (!Number.isFinite(num)) return { ok: false, error: '"' + raw + '" is not a number. Try 42 or 3.14.' };
    return { ok: true, value: num };
  }
  if (type === 'boolean') {
    const lower = raw.toLowerCase();
    if (lower === 'true') return { ok: true, value: true };
    if (lower === 'false') return { ok: true, value: false };
    return { ok: false, error: 'A boolean is either true or false.' };
  }
  return { ok: true, value: valueInput.value() };
}

function insertIndex(length) {
  const choice = positionSelect.value();
  if (choice === 'start') return 0;
  if (choice === 'end') return length;
  return Math.min(length, parseInt(choice, 10));
}

function addElement() {
  const parsed = readValue();
  if (!parsed.ok) {
    setMessage(parsed.error, 'error');
    return;
  }
  const nested = targetNested();
  if (nested) {
    // the selected nested array is the target
    if (nested.items.length >= MAX_NESTED_ITEMS) {
      setMessage('This nested array is full (' + MAX_NESTED_ITEMS + ' elements).', 'error');
      return;
    }
    const at = insertIndex(nested.items.length);
    const item = { id: nextId++, type: typeof parsed.value, value: parsed.value };
    nested.items.splice(at, 0, item);
    if (!fits(arr)) {
      nested.items.splice(at, 1);
      setMessage('No more room in the picture. Remove an element first.', 'error');
      return;
    }
    nested.flash = FLASH_FRAMES;
    selected = { id: nested.id, innerId: null };
    setMessage('Added ' + JSON.stringify(parsed.value) + ' inside the nested array at index ' +
      arr.indexOf(nested) + '. Click empty space to add to the main array.', 'info');
  } else {
    const at = insertIndex(arr.length);
    const e = makeElement(parsed.value);
    const trial = arr.slice();
    trial.splice(at, 0, e);
    if (!fits(trial)) {
      setMessage('No more room in the picture. Remove an element first.', 'error');
      return;
    }
    arr = trial;
    const shifted = arr.length - 1 - at;
    setMessage('Added ' + JSON.stringify(parsed.value) + ' at index ' + at + '.' +
      (shifted > 0 ? ' ' + shifted + (shifted === 1 ? ' element' : ' elements') + ' moved up one index.' : ''), 'info');
  }
  valueInput.value('');
  checkGoal();
}

function addNestedArray() {
  const at = targetNested() ? arr.length : insertIndex(arr.length);
  const e = makeElement([]);
  const trial = arr.slice();
  trial.splice(at, 0, e);
  if (!fits(trial)) {
    setMessage('No more room in the picture. Remove an element first.', 'error');
    return;
  }
  arr = trial;
  selected = { id: e.id, innerId: null };
  setMessage('Added an empty nested array at index ' + at + '. It is selected, so Add Element now puts values inside it.', 'info');
  checkGoal();
}

function removeSelected() {
  if (!selected || !findElement(selected.id)) {
    setMessage('Click an element to select it, then press Remove Selected.', 'error');
    return;
  }
  const e = findElement(selected.id);
  const index = arr.indexOf(e);
  if (selected.innerId !== null) {
    const innerIndex = e.items.findIndex(item => item.id === selected.innerId);
    const removed = e.items.splice(innerIndex, 1)[0];
    e.flash = FLASH_FRAMES;
    selected = { id: e.id, innerId: null };
    setMessage('Removed ' + JSON.stringify(removed.value) + ' from the nested array at index ' + index + '.', 'info');
  } else {
    arr.splice(index, 1);
    ghosts.push({ element: e, alpha: 1 });
    selected = null;
    const shifted = arr.length - index;
    setMessage('Removed index ' + index + '.' +
      (shifted > 0 ? ' ' + shifted + (shifted === 1 ? ' element' : ' elements') + ' moved down one index.' : ''), 'info');
  }
  checkGoal();
}

function clearArray() {
  for (const e of arr) ghosts.push({ element: e, alpha: 1 });
  arr = [];
  selected = null;
  positionSelect.selected('end');
  setMessage('Cleared. The array is empty: []', 'info');
  checkGoal();
}

function loadChallenge() {
  challenge = CHALLENGES[parseInt(challengeSelect.value(), 10)] || CHALLENGES[0];
  arr = challenge.start.map(makeElement);
  for (const e of arr) e.flash = 0;
  ghosts = [];
  selected = null;
  press = null;
  positionSelect.selected('end');
  setMessage(challenge.intro, 'info');
}

function goalReached() {
  return challenge.goal !== null && JSON.stringify(currentValue()) === JSON.stringify(challenge.goal);
}

function checkGoal() {
  if (!goalReached()) return;
  if (challenge.goal.some(v => !Array.isArray(v)) && new Set(challenge.goal.map(v => typeof v)).size > 1) {
    setMessage('Goal reached. Notice the warning: mixed types are legal JSON but make metadata hard to search.', 'success');
  } else {
    setMessage('Goal reached. The JSON on the right matches the goal exactly.', 'success');
  }
}

function prettyJSON() {
  if (arr.length === 0) return '[]';
  return '[\n' + arr.map(e => '  ' + compactJSON(plainValue(e))).join(',\n') + '\n]';
}

function copyJSON() {
  const text = prettyJSON();
  const done = () => setMessage('JSON copied to the clipboard.', 'success');
  const fallback = () => {
    // older browsers, and iframes without clipboard permission
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    if (ok) done(); else setMessage('This browser blocked copying from the page.', 'error');
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, fallback);
  } else {
    fallback();
  }
}

// Keep the Position list in step with the length of the array that will receive the element
function refreshPositionOptions() {
  const nested = targetNested();
  const length = nested ? nested.items.length : arr.length;
  const key = (nested ? 'n' + nested.id : 'main') + ':' + length;
  if (key === positionKey) return;
  positionKey = key;
  const previous = positionSelect.value();
  positionSelect.elt.innerHTML = '';
  positionSelect.option('at end', 'end');
  positionSelect.option('at beginning', 'start');
  for (let i = 1; i < length; i++) positionSelect.option('at index ' + i, String(i));
  const stillValid = previous === 'end' || previous === 'start' || (parseInt(previous, 10) < length);
  positionSelect.selected(stillValid && previous ? previous : 'end');
}

// ====================================================================
// Mouse: click to select, drag to reorder
// ====================================================================

// Which element (and inner element) is under the point?
function hitTest(px, py) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const e = arr[i];
    if (px >= e.x && px <= e.x + e.w && py >= e.y && py <= e.y + BOX_H) {
      let innerId = null;
      if (e.type === 'array') {
        let mx = e.x + 17;
        for (const item of e.items) {
          const mw = miniWidth(item);
          if (px >= mx && px <= mx + mw && py >= e.y + 19 && py <= e.y + 43) innerId = item.id;
          mx += mw + 5;
        }
      }
      return { index: i, innerId: innerId };
    }
  }
  return null;
}

function inArrayPicture(px, py) {
  const r = arrayRect();
  return px >= r.x && px <= r.x + r.w && py >= r.y - 6 && py <= r.y + r.h;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  const hit = hitTest(mouseX, mouseY);
  if (hit) {
    const e = arr[hit.index];
    press = { index: hit.index, innerId: hit.innerId, startX: mouseX, startY: mouseY,
              offX: mouseX - e.x, offY: mouseY - e.y, dragging: false };
  } else if (inArrayPicture(mouseX, mouseY)) {
    if (selected) setMessage('Nothing selected. New elements go into the main array.', 'info');
    selected = null;
  }
}

function mouseDragged() {
  if (!press) return;
  if (!press.dragging && dist(mouseX, mouseY, press.startX, press.startY) > 6) {
    press.dragging = true;
    selected = { id: arr[press.index].id, innerId: null };
  }
  if (press.dragging) {
    dragInsertIndex = dropIndex();
    return false;                    // keep the page from scrolling or selecting text
  }
}

function mouseReleased() {
  if (!press) return;
  if (press.dragging) {
    const from = press.index;
    const to = dragInsertIndex;
    const e = arr[from];
    e.x = mouseX - press.offX;       // slide from where it was dropped
    e.y = mouseY - press.offY;
    arr.splice(from, 1);
    arr.splice(to, 0, e);
    if (to !== from) {
      e.flash = FLASH_FRAMES;
      setMessage('Moved index ' + from + ' to index ' + to + '. Order matters in an array, so the JSON changed.', 'info');
      checkGoal();
    }
  } else {
    // a click selects the element (or an element inside a nested array)
    const e = arr[press.index];
    selected = { id: e.id, innerId: press.innerId };
    if (press.innerId !== null) {
      setMessage('Selected a value inside the nested array at index ' + press.index + '. Remove Selected deletes it.', 'info');
    } else if (e.type === 'array') {
      setMessage('Selected the nested array at index ' + press.index + '. Add Element puts values inside it.', 'info');
    } else {
      setMessage('Selected index ' + press.index + '. Drag it to reorder, or press Remove Selected.', 'info');
    }
  }
  press = null;
  dragInsertIndex = -1;
}

// Index the dragged element would get if dropped at the mouse position
function dropIndex() {
  const dragged = arr[press.index];
  const others = arr.filter(e => e !== dragged);
  const layout = computeSlots(others);
  const r = arrayRect();
  const mouseRow = Math.max(0, Math.floor((mouseY - r.y) / ROW_H));
  for (let j = 0; j < others.length; j++) {
    const slot = layout.slots[j];
    const slotRow = Math.round((slot.y - r.y) / ROW_H);
    if (slotRow > mouseRow || (slotRow === mouseRow && mouseX < slot.x + slot.w / 2)) return j;
  }
  return others.length;
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
