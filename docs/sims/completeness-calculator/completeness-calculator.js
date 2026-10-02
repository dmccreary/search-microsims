// Completeness Score Calculator MicroSim
// CANVAS_HEIGHT: 555
// Use this CANVAS_HEIGHT for all the iframe heights that embed this MicroSim
// Bloom Level: Apply (L3) - students CALCULATE completeness scores for MicroSim metadata
// by checking fields as "filled" and watching how field weights change the score.
// Left: checklist of 40 metadata fields grouped by schema section.
// Center: score gauge, star rating and breakdowns.
// Right: the formula with the current numbers, and what to add next.
// MicroSim template version 2026.03

// ---------- canvas layout ----------
let containerWidth;                 // set from the <main> element
let canvasWidth = 700;              // responsive width
let drawHeight = 475;               // checklist, gauge and recommendations
let controlHeight = 80;             // two rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;
let panelTop = 44;                  // y where the three panels start (below the title)
const ROW_H = 17;                   // height of one checklist row

// ---------- weights (from the chapter) ----------
const WEIGHTS = {
  required:    { weight: 3, label: 'Required',    color: 'crimson',  border: 'darkred' },
  recommended: { weight: 2, label: 'Recommended', color: 'gold',     border: 'darkgoldenrod' },
  optional:    { weight: 1, label: 'Optional',    color: 'darkgray', border: 'dimgray' }
};

// ---------- the 40 fields: 7 required, 8 recommended, 25 optional ----------
// The checklist is drawn in two columns in this order.
const SECTIONS = [
  { name: 'dublinCore', column: 0, fields: [
      ['title', 'required'], ['creator', 'required'], ['subject', 'required'], ['description', 'required'],
      ['date', 'required'], ['format', 'required'], ['rights', 'required'],
      ['publisher', 'recommended'],
      ['contributor', 'optional'], ['type', 'optional'], ['identifier', 'optional'],
      ['language', 'optional']] },
  { name: 'educational', column: 0, fields: [
      ['gradeLevel', 'recommended'], ['subjectArea', 'recommended'], ['bloomsTaxonomy', 'recommended'],
      ['difficulty', 'recommended'], ['learningObjectives', 'recommended'],
      ['prerequisites', 'optional'], ['duration', 'optional'], ['topic', 'optional'],
      ['curriculumStandards', 'optional']] },
  { name: 'technical', column: 1, fields: [
      ['framework', 'recommended'],
      ['responsive', 'optional'], ['canvasDimensions', 'optional'], ['dependencies', 'optional'],
      ['browserCompatibility', 'optional'], ['accessibility', 'optional']] },
  { name: 'search', column: 1, fields: [
      ['visualizationType', 'recommended'],
      ['tags', 'optional'], ['interactionLevel', 'optional'], ['complexity', 'optional'],
      ['relatedConcepts', 'optional']] },
  { name: 'userInterface', column: 1, fields: [
      ['controls', 'optional'], ['layoutType', 'optional'], ['colorScheme', 'optional']] },
  { name: 'other sections', column: 1, fields: [
      ['simulation.model', 'optional'], ['simulation.variables', 'optional'],
      ['analytics.events', 'optional'], ['analytics.privacy', 'optional'],
      ['usage.extensions', 'optional']] }
];

// Optional fields filled in by the "Good" sample (all required and recommended are filled too)
const GOOD_OPTIONAL = ['language', 'identifier', 'prerequisites', 'duration', 'responsive', 'tags',
  'interactionLevel', 'controls'];
// Optional fields left empty by the "Excellent" sample
const EXCELLENT_MISSING = ['curriculumStandards', 'analytics.privacy', 'usage.extensions'];

// ---------- controls ----------
let fields = [];                    // { name, kind, section, checkbox, row, column }
let minimalButton, goodButton, excellentButton, calculateButton, resetButton;
let modeRadio;

// ---------- state ----------
let shownScore = 34;                // the gauge needle eases toward the real score
let revealFrames = 0;               // formula flash after pressing Calculate
let celebrated = false;             // confetti is shown once each time the score reaches 90
let confetti = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // When embedded, the iframe is exactly as tall as the canvas. Lock the page so that
  // keys such as Space, Home and End cannot scroll the MicroSim out of view.
  lockScrollWhenEmbedded();

  // One native checkbox for every metadata field
  for (const section of SECTIONS) {
    for (const [name, kind] of section.fields) {
      const checkbox = createCheckbox(name, kind === 'required');   // default: required fields only
      checkbox.parent(mainElement);
      checkbox.style('font-size', '12px');
      checkbox.style('line-height', '15px');
      checkbox.style('white-space', 'nowrap');
      checkbox.style('overflow', 'hidden');
      checkbox.style('text-overflow', 'ellipsis');
      checkbox.attribute('title', name + ' (' + kind + ')');
      const input = checkbox.elt.querySelector('input');
      if (input) {
        input.style.margin = '0 3px 0 0';
        input.style.verticalAlign = 'middle';
      }
      fields.push({ name: name, kind: kind, section: section.name, checkbox: checkbox });
    }
  }

  minimalButton = createButton('Minimal');
  minimalButton.parent(mainElement);
  minimalButton.mousePressed(() => loadSample('minimal'));

  goodButton = createButton('Good');
  goodButton.parent(mainElement);
  goodButton.mousePressed(() => loadSample('good'));

  excellentButton = createButton('Excellent');
  excellentButton.parent(mainElement);
  excellentButton.mousePressed(() => loadSample('excellent'));

  calculateButton = createButton('Calculate');
  calculateButton.parent(mainElement);
  calculateButton.mousePressed(calculateReveal);

  resetButton = createButton('Reset All');
  resetButton.parent(mainElement);
  resetButton.mousePressed(() => loadSample('none'));

  modeRadio = createRadio();
  modeRadio.parent(mainElement);
  modeRadio.option('weighted', 'Weighted');
  modeRadio.option('unweighted', 'Unweighted');
  modeRadio.selected('weighted');
  modeRadio.style('font-size', '15px');
  modeRadio.changed(() => { celebrated = currentScore() >= 90; });

  layoutControls();
  shownScore = currentScore();

  describe('Metadata completeness score calculator. A checklist of 40 metadata fields is grouped ' +
    'by schema section and color coded as required, recommended or optional. A gauge shows the ' +
    'weighted or unweighted completeness score, and panels show the formula and which fields to add next.', LABEL);
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
  text('Completeness Score Calculator', canvasWidth / 2, 9);

  const score = currentScore();
  // the gauge animates smoothly toward the new score
  shownScore = lerp(shownScore, score, 0.15);
  if (Math.abs(shownScore - score) < 0.2) shownScore = score;

  drawChecklist();
  drawScorePanel(score);
  if (panelRects().right) {
    drawFormulaPanel(score);
    drawRecommendations(score);
  }
  drawConfetti();

  // celebration the first time the score reaches 90%
  if (score >= 90 && !celebrated) {
    celebrated = true;
    celebrate();
  }
  if (score < 90) celebrated = false;

  // control labels
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Load Sample:', 10, drawHeight + 20);
}

// ====================================================================
// Layout
// ====================================================================

// Three panels: checklist (47%), score (24%), formula and recommendations (29%).
// On a phone-width screen there is only room for the checklist and the score.
function panelRects() {
  const narrow = canvasWidth < 560;
  const h = drawHeight - panelTop - 8;
  if (narrow) {
    const usable = canvasWidth - 2 * margin - 8;
    const leftW = Math.floor(usable * 0.6);
    return {
      left:   { x: margin, y: panelTop, w: leftW, h: h },
      center: { x: margin + leftW + 8, y: panelTop, w: usable - leftW, h: h },
      right:  null
    };
  }
  const usable = canvasWidth - 2 * margin - 16;        // two 8px gaps between panels
  const leftW = Math.floor(usable * 0.47);            // wide enough for the longest field name
  const centerW = Math.floor(usable * 0.24);
  const rightW = usable - leftW - centerW;
  return {
    left:   { x: margin, y: panelTop, w: leftW, h: h },
    center: { x: margin + leftW + 8, y: panelTop, w: centerW, h: h },
    right:  { x: margin + leftW + 8 + centerW + 8, y: panelTop, w: rightW, h: h }
  };
}

// Position every DOM control. Called from setup() and windowResized().
function layoutControls() {
  const r = panelRects().left;
  const colW = Math.floor((r.w - 6) / 2);
  const firstRowY = r.y + 20;

  // checklist: two columns, a header row for each section, then its fields
  const nextRow = [0, 0];
  let index = 0;
  for (const section of SECTIONS) {
    const c = section.column;
    section.headerRow = nextRow[c];
    nextRow[c]++;
    for (let k = 0; k < section.fields.length; k++) {
      const f = fields[index++];
      f.column = c;
      f.row = nextRow[c]++;
      const x = r.x + 4 + c * colW;
      const y = firstRowY + f.row * ROW_H;
      f.x = x;
      f.y = y;
      f.checkbox.position(x + 11, y);
      f.checkbox.size(colW - 13, ROW_H);
    }
  }

  // Row 1: Load Sample buttons
  const row1 = drawHeight + 8;
  const row2 = drawHeight + 45;
  let x = 112;
  for (const b of [minimalButton, goodButton, excellentButton]) {
    b.position(x, row1);
    x += b.elt.offsetWidth + 8;
  }
  // Row 2: Calculate, Reset All and the score mode
  x = 10;
  for (const b of [calculateButton, resetButton]) {
    b.position(x, row2);
    x += b.elt.offsetWidth + 8;
  }
  modeRadio.position(x + 6, row2);
}

// ====================================================================
// Score calculations
// ====================================================================

function isWeighted() {
  return modeRadio.value() !== 'unweighted';
}

function isFilled(f) {
  return f.checkbox.checked();
}

// filled and total counts for each weight class
function tally(list) {
  const t = { required: [0, 0], recommended: [0, 0], optional: [0, 0] };
  for (const f of list) {
    t[f.kind][1]++;
    if (isFilled(f)) t[f.kind][0]++;
  }
  return t;
}

// Completeness of a list of fields, as a percentage
//   weighted:   sum(weight x filled) / sum(weight x total) x 100
//   unweighted: fields populated / total possible fields x 100
function completeness(list, weighted) {
  const t = tally(list);
  let filled = 0;
  let possible = 0;
  for (const kind of Object.keys(WEIGHTS)) {
    const w = weighted ? WEIGHTS[kind].weight : 1;
    filled += w * t[kind][0];
    possible += w * t[kind][1];
  }
  return { filled: filled, possible: possible, percent: possible > 0 ? 100 * filled / possible : 0 };
}

function currentScore() {
  return completeness(fields, isWeighted()).percent;
}

// Rating bands from the chapter's "Completeness Targets" table
function rating(score) {
  if (score >= 90) return { label: 'Excellent', color: 'goldenrod', fill: 'gold', stars: 5 };
  if (score >= 70) return { label: 'Good', color: 'green', fill: 'mediumseagreen', stars: 4 };
  if (score >= 50) return { label: 'Fair', color: 'darkgoldenrod', fill: 'khaki', stars: 3 };
  if (score >= 25) return { label: 'Poor', color: 'firebrick', fill: 'tomato', stars: 2 };
  return { label: 'Poor', color: 'firebrick', fill: 'tomato', stars: 1 };
}

// ====================================================================
// Left panel: checklist
// ====================================================================

function drawChecklist() {
  const r = panelRects().left;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 10);

  // legend: color = weight
  let lx = r.x + 8;
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);
  textSize(12);
  for (const kind of Object.keys(WEIGHTS)) {
    const w = WEIGHTS[kind];
    drawChip(lx, r.y + 6, w);
    noStroke();
    fill('black');
    const label = (r.w < 290 ? w.label.slice(0, 3) + '.' : w.label) + ' ×' + w.weight;
    text(label, lx + 11, r.y + 12);
    lx += 11 + textWidth(label) + 9;
  }

  const colW = Math.floor((r.w - 6) / 2);
  const firstRowY = r.y + 20;

  // section headers with a filled/total count
  for (const section of SECTIONS) {
    const list = fields.filter(f => f.section === section.name);
    const filled = list.filter(isFilled).length;
    const x = r.x + 6 + section.column * colW;
    const y = firstRowY + section.headerRow * ROW_H;
    noStroke();
    fill('aliceblue');
    rect(x - 2, y + 1, colW - 4, ROW_H - 2, 4);
    fill('black');
    textStyle(BOLD);
    textSize(13);
    textAlign(LEFT, CENTER);
    text(section.name, x + 2, y + ROW_H / 2 + 1);
    const nameW = textWidth(section.name);
    textStyle(NORMAL);
    textSize(12);
    const count = filled + '/' + list.length;
    if (nameW + textWidth(count) + 16 < colW) {      // skip the count when the column is too narrow
      textAlign(RIGHT, CENTER);
      fill('dimgray');
      text(count, x + colW - 8, y + ROW_H / 2 + 1);
    }
  }

  // weight chip in front of every checkbox
  for (const f of fields) {
    drawChip(f.x + 1, f.y + 2, WEIGHTS[f.kind]);
  }
}

function drawChip(x, y, w) {
  stroke(w.border);
  strokeWeight(1);
  fill(w.color);
  rect(x, y, 8, 12, 2);
}

// ====================================================================
// Center panel: gauge, stars and breakdowns
// ====================================================================

function drawScorePanel(score) {
  const r = panelRects().center;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 10);

  const weighted = isWeighted();
  const rate = rating(score);
  const cx = r.x + r.w / 2;
  const radius = Math.min(62, r.w / 2 - 14);
  const cy = r.y + 14 + radius;

  // gauge: 270 degree arc, colored by the rating band
  const startAngle = 0.75 * PI;
  const sweep = 1.5 * PI;
  noFill();
  strokeCap(SQUARE);
  stroke('gainsboro');
  strokeWeight(14);
  arc(cx, cy, radius * 2, radius * 2, startAngle, startAngle + sweep);
  if (shownScore > 0.5) {
    stroke(rating(shownScore).fill);
    arc(cx, cy, radius * 2, radius * 2, startAngle, startAngle + sweep * shownScore / 100);
  }
  // marks at the 50, 70 and 90 percent targets
  stroke('dimgray');
  strokeWeight(2);
  for (const mark of [50, 70, 90]) {
    const a = startAngle + sweep * mark / 100;
    line(cx + cos(a) * (radius - 9), cy + sin(a) * (radius - 9), cx + cos(a) * (radius + 9), cy + sin(a) * (radius + 9));
  }
  strokeWeight(1);
  strokeCap(ROUND);

  // large percentage in the center
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(radius > 50 ? 30 : 22);
  text(Math.round(shownScore) + '%', cx, cy - 2);
  textStyle(NORMAL);
  textSize(12);
  fill('dimgray');
  text(weighted ? 'weighted' : 'unweighted', cx, cy + 22);

  // rating and stars
  let y = cy + radius + 2;
  fill(rate.color);
  textStyle(BOLD);
  textSize(16);
  text(rate.label, cx, y);
  textStyle(NORMAL);
  y += 19;
  for (let s = 0; s < 5; s++) {
    drawStar(cx - 40 + s * 20, y, 8, s < rate.stars);
  }
  y += 18;

  // with no room for the formula panel, show the division under the stars
  if (!panelRects().right) {
    const c = completeness(fields, weighted);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textSize(13);
    text(c.filled + ' \u00f7 ' + c.possible + ' = ' + Math.round(score) + '%', cx, y - 4);
    y += 16;
  }

  // breakdown by weight class
  const barX = r.x + 10;
  const barW = r.w - 20;
  y = drawBarGroup('By weight', barX, y, barW, Object.keys(WEIGHTS).map(kind => {
    const list = fields.filter(f => f.kind === kind);
    const filled = list.filter(isFilled).length;
    return { label: WEIGHTS[kind].label, note: filled + '/' + list.length, percent: 100 * filled / list.length,
             color: WEIGHTS[kind].color };
  }), 25);

  // breakdown by schema section
  drawBarGroup('By section', barX, y + 4, barW, SECTIONS.map(section => {
    const list = fields.filter(f => f.section === section.name);
    const c = completeness(list, weighted);
    return { label: section.name === 'other sections' ? 'other' : section.name, note: Math.round(c.percent) + '%',
             percent: c.percent, color: 'steelblue' };
  }), panelRects().right ? 21 : 19);
}

// A titled group of labeled horizontal bars. Returns the y below the group.
function drawBarGroup(title, x, y, w, bars, rowH) {
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text(title, x, y);
  textStyle(NORMAL);
  y += 17;
  for (const b of bars) {
    noStroke();
    fill('black');
    textSize(12);
    textAlign(LEFT, TOP);
    text(b.label, x, y);
    textAlign(RIGHT, TOP);
    fill('dimgray');
    text(b.note, x + w, y);
    stroke('silver');
    fill('whitesmoke');
    rect(x, y + 14, w, 6, 3);
    if (b.percent > 0) {
      noStroke();
      fill(b.color);
      rect(x, y + 14, Math.max(3, w * b.percent / 100), 6, 3);
    }
    y += rowH;
  }
  return y;
}

function drawStar(cx, cy, radius, filled) {
  stroke('darkgoldenrod');
  strokeWeight(1);
  fill(filled ? 'gold' : 'white');
  beginShape();
  for (let k = 0; k < 10; k++) {
    const a = -HALF_PI + k * PI / 5;
    const rr = k % 2 === 0 ? radius : radius * 0.45;
    vertex(cx + cos(a) * rr, cy + sin(a) * rr);
  }
  endShape(CLOSE);
}

// ====================================================================
// Right panel: formula and recommendations
// ====================================================================

const FORMULA_H = 150;

function drawFormulaPanel(score) {
  const p = panelRects().right;
  const r = { x: p.x, y: p.y, w: p.w, h: FORMULA_H };
  const weighted = isWeighted();
  const t = tally(fields);
  const c = completeness(fields, weighted);

  stroke(revealFrames > 0 ? 'dodgerblue' : 'silver');
  strokeWeight(revealFrames > 0 ? 3 : 1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 10);
  strokeWeight(1);
  if (revealFrames > 0) revealFrames--;

  const x = r.x + 10;
  let y = r.y + 8;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(14);
  text(weighted ? 'Weighted formula' : 'Unweighted formula', x, y);
  textStyle(NORMAL);
  y += 21;

  const small = r.w < 185;
  const exprSize = small ? 12 : 14;
  const rows = weighted
    ? [['Filled points', '3×' + t.required[0] + ' + 2×' + t.recommended[0] + ' + 1×' + t.optional[0] + ' = ' + c.filled],
       ['Possible points', '3×' + t.required[1] + ' + 2×' + t.recommended[1] + ' + 1×' + t.optional[1] + ' = ' + c.possible]]
    : [['Fields populated', t.required[0] + ' + ' + t.recommended[0] + ' + ' + t.optional[0] + ' = ' + c.filled],
       ['Total possible fields', t.required[1] + ' + ' + t.recommended[1] + ' + ' + t.optional[1] + ' = ' + c.possible]];
  for (const [caption, expr] of rows) {
    fill('dimgray');
    textSize(12);
    text(caption, x, y);
    y += 15;
    fill('black');
    textSize(exprSize);
    text(expr, x, y);
    y += 21;
  }
  stroke('gainsboro');
  line(x, y, r.x + r.w - 10, y);
  noStroke();
  y += 6;
  fill('black');
  textStyle(BOLD);
  textSize(small ? 13 : 15);
  text(c.filled + ' ÷ ' + c.possible + ' = ' + Math.round(score) + '%', x, y);
  textStyle(NORMAL);
}

function drawRecommendations(score) {
  const p = panelRects().right;
  const r = { x: p.x, y: p.y + FORMULA_H + 8, w: p.w, h: p.h - FORMULA_H - 8 };
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 10);

  push();
  drawingContext.beginPath();
  drawingContext.rect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
  drawingContext.clip();

  const weighted = isWeighted();
  const x = r.x + 10;
  const w = r.w - 20;
  let y = r.y + 8;
  noStroke();
  textAlign(LEFT, TOP);

  // unfilled fields, most valuable first
  const missing = fields.filter(f => !isFilled(f))
    .sort((a, b) => WEIGHTS[b.kind].weight - WEIGHTS[a.kind].weight);

  // 1. the next target and the fields that get you there
  const target = score < 50 ? 50 : (score < 70 ? 70 : (score < 90 ? 90 : 100));
  const c = completeness(fields, weighted);
  const needed = Math.ceil(target / 100 * c.possible - c.filled - 1e-9);
  const picks = [];
  let gained = 0;
  for (const f of missing) {
    if (gained >= needed) break;
    picks.push(f);
    gained += weighted ? WEIGHTS[f.kind].weight : 1;
  }

  fill('black');
  textStyle(BOLD);
  textSize(14);
  if (missing.length === 0) {
    y = wrapAt('100% complete!', x, y, w, 17);
    textStyle(NORMAL);
    textSize(13);
    y = wrapAt('Every field is filled. Now check the quality of each value.', x, y + 2, w, 16);
  } else {
    y = wrapAt('Add these to reach ' + target + '%:', x, y, w, 17);
    textStyle(NORMAL);
    textSize(13);
    const shown = picks.slice(0, 5);
    for (const f of shown) {
      drawChip(x, y + 2, WEIGHTS[f.kind]);
      noStroke();
      fill('black');
      text(f.name, x + 13, y + 1);
      y += 16;
    }
    if (picks.length > shown.length) {
      fill('dimgray');
      text('and ' + (picks.length - shown.length) + ' more', x + 13, y + 1);
      y += 16;
    }
  }

  // 2. high-impact fields still missing
  y += 6;
  const missingRequired = missing.filter(f => f.kind === 'required').length;
  const missingRecommended = missing.filter(f => f.kind === 'recommended').length;
  fill('black');
  textStyle(BOLD);
  textSize(14);
  y = wrapAt('High-impact fields missing:', x, y, w, 17);
  textStyle(NORMAL);
  textSize(13);
  fill(missingRequired > 0 ? 'firebrick' : 'black');
  y = wrapAt(missingRequired + ' required, ' + missingRecommended + ' recommended', x, y, w, 16);

  // 3. one tip, chosen from the current state
  y += 6;
  fill('black');
  textStyle(BOLD);
  textSize(14);
  y = wrapAt('Tip', x, y, w, 17);
  textStyle(NORMAL);
  textSize(13);
  fill('black');
  let tip;
  if (missingRequired > 0) tip = 'Required fields count 3 points each. Fill them first.';
  else if (missingRecommended > 0) tip = 'A recommended field adds 2 points, twice as much as an optional field.';
  else if (missing.length > 0) tip = 'Only optional fields are left. Each adds 1 point.';
  else tip = 'Completeness is not quality. A field that says "TBD" still counts as filled.';
  if (!weighted) tip = 'Unweighted: every field counts the same, so a missing title costs no more than a missing tag.';
  wrapAt(tip, x, y, w, 16);
  pop();
}

// Draw wrapped text with the current size and style. Returns the y below the text.
function wrapAt(str, x, y, maxW, lineH) {
  const words = str.split(' ');
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (current && textWidth(candidate) > maxW) {
      text(current, x, y);
      y += lineH;
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) {
    text(current, x, y);
    y += lineH;
  }
  return y;
}

// ====================================================================
// Celebration (short burst when the score reaches 90%)
// ====================================================================

function celebrate() {
  const r = panelRects().center;
  const colors = ['gold', 'tomato', 'dodgerblue', 'mediumseagreen', 'orchid', 'orange'];
  confetti = [];
  for (let i = 0; i < 60; i++) {
    confetti.push({
      x: r.x + random(r.w), y: r.y + random(-30, 20),
      vx: random(-1, 1), vy: random(1.5, 4),
      size: random(5, 9), color: random(colors), life: 90
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

// The checkboxes need no handler: the score, bars, formula and recommendations
// are recomputed from the checkbox states on every frame.

// Check the fields for one of the sample documents
function loadSample(sample) {
  for (const f of fields) {
    let on = false;
    if (sample === 'minimal') on = f.kind === 'required';
    else if (sample === 'good') on = f.kind !== 'optional' || GOOD_OPTIONAL.includes(f.name);
    else if (sample === 'excellent') on = !EXCELLENT_MISSING.includes(f.name);
    f.checkbox.checked(on);
  }
}

// "Calculate": replay the result from zero and highlight the formula
function calculateReveal() {
  shownScore = 0;
  revealFrames = 70;
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
