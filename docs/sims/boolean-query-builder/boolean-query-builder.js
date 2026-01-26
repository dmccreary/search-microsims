// Boolean Query Builder MicroSim
// Visual query construction with Venn diagram representation

let canvasWidth = 800;
const drawHeight = 480;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Query terms
let terms = ['', '', ''];
let operators = ['AND', 'AND']; // Between terms
let notFlags = [false, false, false];

// Sample results database
const sampleDocs = [
  { id: 1, title: 'Pendulum Period Calculator', keywords: ['pendulum', 'physics', 'simulation', 'period'] },
  { id: 2, title: 'Wave Interference Demo', keywords: ['wave', 'physics', 'interference', 'simulation'] },
  { id: 3, title: 'Simple Harmonic Motion', keywords: ['pendulum', 'harmonic', 'physics', 'motion'] },
  { id: 4, title: 'Sound Wave Analyzer', keywords: ['wave', 'sound', 'audio', 'analyzer'] },
  { id: 5, title: 'Electromagnetic Spectrum', keywords: ['wave', 'electromagnetic', 'physics', 'spectrum'] },
  { id: 6, title: 'Double Pendulum Chaos', keywords: ['pendulum', 'chaos', 'simulation', 'physics'] },
  { id: 7, title: 'Ocean Wave Simulator', keywords: ['wave', 'ocean', 'water', 'simulation'] },
  { id: 8, title: 'Pendulum Art Generator', keywords: ['pendulum', 'art', 'creative', 'generator'] },
  { id: 9, title: 'Physics Lab Toolkit', keywords: ['physics', 'lab', 'toolkit', 'simulation'] },
  { id: 10, title: 'Wave Pendulum Display', keywords: ['pendulum', 'wave', 'display', 'art'] }
];

// Input elements
let inputFields = [];
let operatorSelects = [];
let notCheckboxes = [];

// Results
let matchingDocs = [];
let queryString = '';

// Venn diagram
const vennCenterX = 550;
const vennCenterY = 200;
const vennRadius = 70;

// Preset examples
const presets = [
  { name: 'Basic AND', terms: ['physics', 'simulation', ''], ops: ['AND', 'AND'], nots: [false, false, false] },
  { name: 'Synonym OR', terms: ['pendulum', 'wave', ''], ops: ['OR', 'AND'], nots: [false, false, false] },
  { name: 'Exclusion', terms: ['wave', 'physics', 'ocean'], ops: ['AND', 'AND'], nots: [false, false, true] },
  { name: 'Complex', terms: ['pendulum', 'physics', 'art'], ops: ['OR', 'AND'], nots: [false, false, true] }
];

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  createInputElements();
  evaluateQuery();
}

function createInputElements() {
  // Create term inputs
  const startY = 80;

  for (let i = 0; i < 3; i++) {
    // NOT checkbox
    notCheckboxes[i] = createCheckbox('NOT', false);
    notCheckboxes[i].parent('canvas-container');
    notCheckboxes[i].position(30, startY + i * 50);
    notCheckboxes[i].style('font-size', '12px');
    notCheckboxes[i].changed(() => {
      notFlags[i] = notCheckboxes[i].checked();
      evaluateQuery();
    });

    // Term input
    inputFields[i] = createInput('');
    inputFields[i].parent('canvas-container');
    inputFields[i].position(85, startY + i * 50 - 3);
    inputFields[i].size(120);
    inputFields[i].attribute('placeholder', `Term ${i + 1}`);
    inputFields[i].input(() => {
      terms[i] = inputFields[i].value().toLowerCase().trim();
      evaluateQuery();
    });

    // Operator select (between terms)
    if (i < 2) {
      operatorSelects[i] = createSelect();
      operatorSelects[i].parent('canvas-container');
      operatorSelects[i].position(220, startY + i * 50 + 20);
      operatorSelects[i].option('AND');
      operatorSelects[i].option('OR');
      operatorSelects[i].selected('AND');
      operatorSelects[i].changed(() => {
        operators[i] = operatorSelects[i].value();
        evaluateQuery();
      });
    }
  }
}

function evaluateQuery() {
  // Build query string
  let parts = [];
  for (let i = 0; i < 3; i++) {
    if (terms[i]) {
      const termStr = notFlags[i] ? `NOT ${terms[i]}` : terms[i];
      parts.push(termStr);
      if (i < 2 && terms[i + 1]) {
        parts.push(operators[i]);
      }
    }
  }
  queryString = parts.join(' ');

  // Evaluate against documents
  matchingDocs = sampleDocs.filter(doc => matchesQuery(doc));
}

function matchesQuery(doc) {
  const keywords = doc.keywords;

  // Get which terms match
  const matches = terms.map((term, i) => {
    if (!term) return null; // Not specified
    const found = keywords.some(k => k.includes(term));
    return notFlags[i] ? !found : found;
  });

  // Apply operators
  // Filter out null (unused terms)
  const activeMatches = [];
  const activeOps = [];

  for (let i = 0; i < 3; i++) {
    if (matches[i] !== null) {
      activeMatches.push(matches[i]);
      if (activeMatches.length > 1 && i > 0) {
        activeOps.push(operators[i - 1]);
      }
    }
  }

  if (activeMatches.length === 0) return true; // No query = all match

  // Evaluate left to right
  let result = activeMatches[0];
  for (let i = 0; i < activeOps.length; i++) {
    if (activeOps[i] === 'AND') {
      result = result && activeMatches[i + 1];
    } else {
      result = result || activeMatches[i + 1];
    }
  }

  return result;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
  // Draw area background
  fill(250);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill(245);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Boolean Query Builder', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Query builder section
  drawQuerySection();

  // Venn diagram
  drawVennDiagram();

  // Results section
  drawResults();

  // Controls
  drawControls();
}

function drawQuerySection() {
  // Section title
  fill(70);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Build Query:', 30, 55);
  textStyle(NORMAL);

  // Query string display
  fill(255);
  stroke(150);
  strokeWeight(1);
  rect(30, 230, 230, 35, 5);

  fill(50);
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  const displayQuery = queryString || '(enter terms above)';
  text(displayQuery, 40, 247);

  textAlign(CENTER, CENTER);
}

function drawVennDiagram() {
  const cx = canvasWidth * 0.55;
  const cy = 150;

  // Title
  fill(70);
  textSize(12);
  textStyle(BOLD);
  text('Venn Diagram', cx, 50);
  textStyle(NORMAL);

  // Only draw if we have terms
  const activeTerms = terms.filter(t => t);
  if (activeTerms.length === 0) {
    fill(150);
    textSize(11);
    text('Enter terms to see visualization', cx, cy);
    return;
  }

  // Circle positions based on number of terms
  const positions = [];
  if (activeTerms.length === 1) {
    positions.push({ x: cx, y: cy });
  } else if (activeTerms.length === 2) {
    positions.push({ x: cx - 40, y: cy });
    positions.push({ x: cx + 40, y: cy });
  } else {
    positions.push({ x: cx - 35, y: cy - 25 });
    positions.push({ x: cx + 35, y: cy - 25 });
    positions.push({ x: cx, y: cy + 35 });
  }

  // Colors for terms
  const colors = [
    color(100, 149, 237, 100), // Blue
    color(144, 238, 144, 100), // Green
    color(255, 182, 193, 100)  // Pink
  ];

  // Draw circles
  let termIdx = 0;
  for (let i = 0; i < 3; i++) {
    if (terms[i]) {
      fill(notFlags[i] ? color(255, 100, 100, 50) : colors[termIdx % 3]);
      stroke(notFlags[i] ? color(200, 50, 50) : colors[termIdx % 3].levels.slice(0, 3));
      strokeWeight(2);
      ellipse(positions[termIdx].x, positions[termIdx].y, vennRadius * 2);

      // Label
      fill(50);
      noStroke();
      textSize(10);
      const label = (notFlags[i] ? '¬' : '') + terms[i];
      text(label, positions[termIdx].x, positions[termIdx].y + vennRadius + 15);

      termIdx++;
    }
  }

  // Highlight selected region based on operators
  // (simplified - just show result region indication)
  fill(50);
  textSize(9);
  text('Shaded = matching region', cx, cy + vennRadius + 45);
}

function drawResults() {
  const resultsX = canvasWidth * 0.68;
  const resultsY = 50;
  const resultsW = canvasWidth * 0.30;
  const resultsH = 220;

  // Results panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(resultsX, resultsY, resultsW, resultsH, 8);

  // Title
  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Results', resultsX + resultsW / 2, resultsY + 18);
  textStyle(NORMAL);

  // Count
  textSize(11);
  fill(100);
  text(`~${matchingDocs.length} matches`, resultsX + resultsW / 2, resultsY + 38);

  // Results list
  textAlign(LEFT, TOP);
  textSize(10);

  const maxShow = 6;
  for (let i = 0; i < min(matchingDocs.length, maxShow); i++) {
    const doc = matchingDocs[i];
    const y = resultsY + 55 + i * 25;

    fill(50);
    text(doc.title, resultsX + 10, y, resultsW - 20);
  }

  if (matchingDocs.length > maxShow) {
    fill(100);
    text(`... and ${matchingDocs.length - maxShow} more`, resultsX + 10, resultsY + 55 + maxShow * 25);
  }

  textAlign(CENTER, CENTER);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Preset buttons
  fill(100);
  textSize(11);
  text('Load Example:', 60, buttonY + buttonH / 2);

  const presetNames = ['Basic AND', 'Synonym OR', 'Exclusion', 'Complex'];
  let btnX = 130;

  for (let i = 0; i < presetNames.length; i++) {
    const preset = presets[i];
    fill('#607D8B');
    stroke(100);
    strokeWeight(1);
    rect(btnX, buttonY, 85, buttonH, 5);
    fill(255);
    noStroke();
    textSize(10);
    text(presetNames[i], btnX + 42, buttonY + buttonH / 2);
    btnX += 95;
  }

  // Clear button
  const clearX = canvasWidth - 100;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(clearX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  textSize(11);
  text('Clear All', clearX + 40, buttonY + buttonH / 2);
}

function mousePressed() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Check preset buttons
  let btnX = 130;
  for (let i = 0; i < presets.length; i++) {
    if (mouseX >= btnX && mouseX <= btnX + 85 &&
        mouseY >= buttonY && mouseY <= buttonY + buttonH) {
      loadPreset(i);
      return;
    }
    btnX += 95;
  }

  // Check Clear button
  const clearX = canvasWidth - 100;
  if (mouseX >= clearX && mouseX <= clearX + 80 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    clearAll();
    return;
  }
}

function loadPreset(index) {
  const preset = presets[index];

  for (let i = 0; i < 3; i++) {
    terms[i] = preset.terms[i];
    inputFields[i].value(preset.terms[i]);
    notFlags[i] = preset.nots[i];
    notCheckboxes[i].checked(preset.nots[i]);
  }

  for (let i = 0; i < 2; i++) {
    operators[i] = preset.ops[i];
    operatorSelects[i].selected(preset.ops[i]);
  }

  evaluateQuery();
}

function clearAll() {
  for (let i = 0; i < 3; i++) {
    terms[i] = '';
    inputFields[i].value('');
    notFlags[i] = false;
    notCheckboxes[i].checked(false);
  }

  for (let i = 0; i < 2; i++) {
    operators[i] = 'AND';
    operatorSelects[i].selected('AND');
  }

  evaluateQuery();
}
