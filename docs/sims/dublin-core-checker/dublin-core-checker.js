// Dublin Core Element Completeness Checker MicroSim
// Interactive tool for implementing and validating Dublin Core metadata
// Bloom Level: Apply (L3) - Students implement complete metadata

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 620;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;

// Layout - two panel design
let leftPanelWidth = 380;
let rightPanelWidth;

// State
let mouseOverCanvas = false;
let score = 0;
let maxScore = 100;
let completenessPercent = 0;
let qualityTips = [];

// Dublin Core element definitions organized by priority
const dcElements = {
  required: [
    { id: 'title', name: 'Title', points: 10, placeholder: 'Name of your MicroSim', example: 'Interactive Ohm\'s Law Circuit Simulator' },
    { id: 'creator', name: 'Creator', points: 10, placeholder: 'Your name or organization', example: 'Dr. Maria Santos, UC Berkeley' },
    { id: 'subject', name: 'Subject', points: 10, placeholder: 'Topics (comma-separated)', example: 'Physics, Electricity, Circuits, Ohm\'s Law' },
    { id: 'description', name: 'Description', points: 10, placeholder: 'What does it do?', example: 'Interactive circuit simulator for exploring Ohm\'s Law relationships' },
    { id: 'date', name: 'Date', points: 10, placeholder: 'YYYY-MM-DD', example: '2026-01-25' },
    { id: 'format', name: 'Format', points: 10, placeholder: 'File format', example: 'text/html' },
    { id: 'rights', name: 'Rights', points: 10, placeholder: 'License', example: 'CC BY-SA 4.0' }
  ],
  recommended: [
    { id: 'publisher', name: 'Publisher', points: 5, placeholder: 'Organization hosting it', example: 'OpenEd Physics' },
    { id: 'type', name: 'Type', points: 5, placeholder: 'Resource type', example: 'InteractiveResource' },
    { id: 'identifier', name: 'Identifier', points: 5, placeholder: 'URL or DOI', example: 'https://example.com/sims/ohms-law/' },
    { id: 'language', name: 'Language', points: 5, placeholder: 'Language code', example: 'en-US' }
  ],
  optional: [
    { id: 'contributor', name: 'Contributor', points: 2.5, placeholder: 'Others who helped', example: 'Reviewed by Physics Dept.' },
    { id: 'source', name: 'Source', points: 2.5, placeholder: 'Based on what?', example: 'Adapted from PhET simulations' },
    { id: 'relation', name: 'Relation', points: 2.5, placeholder: 'Related resources', example: 'Part of Physics MicroSim Collection' },
    { id: 'coverage', name: 'Coverage', points: 2.5, placeholder: 'Scope (time/place)', example: 'Classical physics era' }
  ]
};

// Input elements (DOM)
let inputs = {};
let inputElements = [];
let exampleSelect = null;

// Example datasets (1 = minimal, 5 = complete)
const examples = {
  1: {
    name: "1 - Minimal (Title only)",
    data: {
      title: "Pendulum Simulator"
    }
  },
  2: {
    name: "2 - Basic (3 required)",
    data: {
      title: "Pendulum Period Explorer",
      creator: "Physics Teacher",
      description: "Interactive pendulum simulation"
    }
  },
  3: {
    name: "3 - Good (All required)",
    data: {
      title: "Interactive Pendulum Period Calculator",
      creator: "Dr. Jane Smith, State University",
      subject: "Physics, Mechanics, Oscillation",
      description: "Simulation demonstrating how pendulum length affects period. Students adjust length and observe timing changes.",
      date: "2026-01-25",
      format: "text/html",
      rights: "CC BY 4.0"
    }
  },
  4: {
    name: "4 - Better (Required + Recommended)",
    data: {
      title: "Interactive Pendulum Period Calculator",
      creator: "Dr. Jane Smith, State University",
      subject: "Physics, Mechanics, Oscillation, Harmonic Motion",
      description: "Simulation demonstrating how pendulum length affects period. Students adjust length and observe timing changes in real-time.",
      date: "2026-01-25",
      format: "text/html",
      rights: "CC BY-SA 4.0",
      publisher: "OpenPhysics Educational Resources",
      type: "InteractiveResource",
      identifier: "https://openphysics.edu/sims/pendulum/",
      language: "en-US"
    }
  },
  5: {
    name: "5 - Complete (All 15 fields)",
    data: {
      title: "Double Pendulum Chaos Simulator",
      creator: "Dr. Sarah Chen, Stanford University",
      subject: "Physics, Classical Mechanics, Chaos Theory, Pendulums, Nonlinear Dynamics",
      description: "Interactive simulation demonstrating chaotic behavior in a double pendulum system. Students can set initial conditions and observe how tiny differences lead to dramatically different outcomes.",
      date: "2026-01-15",
      format: "text/html",
      rights: "CC BY-SA 4.0",
      publisher: "Stanford Physics Education Group",
      type: "InteractiveResource",
      identifier: "https://stanford.edu/physics/sims/double-pendulum/",
      language: "en-US",
      contributor: "Visualization design: James Martinez; Peer review: Prof. Robert Kim, MIT",
      source: "Inspired by Strogatz, Nonlinear Dynamics and Chaos (2015)",
      relation: "isPartOf: Stanford Physics MicroSim Collection",
      coverage: "Classical mechanics concepts; globally applicable"
    }
  }
};

// Colors
const colors = {
  background: 'aliceblue',
  panelBg: '#FFFFFF',
  required: { border: '#E53935', bg: '#FFEBEE', header: '#C62828' },
  recommended: { border: '#FFA726', bg: '#FFF3E0', header: '#EF6C00' },
  optional: { border: '#78909C', bg: '#ECEFF1', header: '#546E7A' },
  complete: { border: '#43A047', bg: '#E8F5E9' },
  text: '#2C3E50',
  subtext: '#7F8C8D',
  gaugeTrack: '#E0E0E0',
  gaugeGood: '#43A047',
  gaugeMedium: '#FFA726',
  gaugeLow: '#E53935',
  button: '#3498DB',
  buttonHover: '#2980B9',
  resetButton: '#E53935',
  resetButtonHover: '#C62828'
};

// Buttons state
let buttonAreas = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  textFont('Arial');

  // Create input fields
  createInputFields();

  describe('Dublin Core Element Completeness Checker with 15 input fields organized by priority (Required, Recommended, Optional), a circular completeness gauge, and buttons to check, load example, clear, and export metadata as JSON.', LABEL);
}

function createInputFields() {
  let container = document.querySelector('main');

  // Create a div to hold inputs that will be positioned absolutely
  let inputContainer = document.createElement('div');
  inputContainer.id = 'dc-inputs';
  inputContainer.style.position = 'absolute';
  inputContainer.style.top = '0';
  inputContainer.style.left = '0';
  inputContainer.style.pointerEvents = 'none'; // Let clicks pass through to canvas
  inputContainer.style.zIndex = '10';
  container.style.position = 'relative'; // Ensure container is positioning context
  container.appendChild(inputContainer);

  // Create inputs for all categories
  let allElements = [...dcElements.required, ...dcElements.recommended, ...dcElements.optional];

  for (let elem of allElements) {
    let input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-' + elem.id;
    input.placeholder = elem.placeholder;
    input.style.position = 'absolute';
    input.style.fontFamily = 'Arial, sans-serif';
    input.style.fontSize = '12px';
    input.style.padding = '4px 8px';
    input.style.borderRadius = '4px';
    input.style.border = '2px solid #ccc';
    input.style.outline = 'none';
    input.style.boxSizing = 'border-box';
    input.style.pointerEvents = 'auto'; // Enable clicks on inputs
    input.addEventListener('input', onInputChange);
    input.addEventListener('focus', () => input.style.borderColor = '#3498DB');
    input.addEventListener('blur', () => updateInputBorders());
    inputContainer.appendChild(input);
    inputs[elem.id] = input;
    inputElements.push({ element: elem, input: input });
  }

  // Create example selector dropdown
  exampleSelect = document.createElement('select');
  exampleSelect.id = 'example-select';
  exampleSelect.style.position = 'absolute';
  exampleSelect.style.fontFamily = 'Arial, sans-serif';
  exampleSelect.style.fontSize = '12px';
  exampleSelect.style.padding = '6px 8px';
  exampleSelect.style.borderRadius = '4px';
  exampleSelect.style.border = '2px solid #3498DB';
  exampleSelect.style.backgroundColor = '#EBF5FB';
  exampleSelect.style.color = '#2C3E50';
  exampleSelect.style.cursor = 'pointer';
  exampleSelect.style.outline = 'none';
  exampleSelect.style.pointerEvents = 'auto'; // Enable clicks on select

  // Add default option
  let defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Load Example...';
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  exampleSelect.appendChild(defaultOpt);

  // Add example options
  for (let i = 1; i <= 5; i++) {
    let opt = document.createElement('option');
    opt.value = i;
    opt.textContent = examples[i].name;
    exampleSelect.appendChild(opt);
  }

  exampleSelect.addEventListener('change', onExampleSelect);
  inputContainer.appendChild(exampleSelect);

  // Position after a short delay to ensure canvas is rendered
  setTimeout(positionInputFields, 50);
}

function positionInputFields() {
  // Get the canvas element position
  let canvasElem = document.querySelector('canvas');
  if (!canvasElem) return;

  let canvasRect = canvasElem.getBoundingClientRect();
  let startY = 45;
  let inputHeight = 26;
  let spacing = 32;
  let labelWidth = 85;
  let inputWidth = leftPanelWidth - margin * 2 - labelWidth - 10;
  let inputX = canvasRect.left + margin + labelWidth + 5;

  let yOffset = startY;

  // Required section header
  yOffset += 25;

  for (let elem of dcElements.required) {
    let input = inputs[elem.id];
    input.style.left = inputX + 'px';
    input.style.top = (canvasRect.top + yOffset) + 'px';
    input.style.width = inputWidth + 'px';
    input.style.height = inputHeight + 'px';
    yOffset += spacing;
  }

  // Recommended section header
  yOffset += 20;

  for (let elem of dcElements.recommended) {
    let input = inputs[elem.id];
    input.style.left = inputX + 'px';
    input.style.top = (canvasRect.top + yOffset) + 'px';
    input.style.width = inputWidth + 'px';
    input.style.height = inputHeight + 'px';
    yOffset += spacing;
  }

  // Optional section header
  // this is for placement of the field input boxes
  yOffset += 42;

  for (let elem of dcElements.optional) {
    let input = inputs[elem.id];
    input.style.left = inputX + 'px';
    input.style.top = (canvasRect.top + yOffset) + 'px';
    input.style.width = inputWidth + 'px';
    input.style.height = inputHeight + 'px';
    yOffset += spacing;
  }

  // Position example selector in control area
  if (exampleSelect) {
    let selectWidth = 180;
    let selectX = canvasRect.left + margin;
    let selectY = canvasRect.top + drawHeight + 18; // Below the label
    exampleSelect.style.left = selectX + 'px';
    exampleSelect.style.top = selectY + 'px';
    exampleSelect.style.width = selectWidth + 'px';
    exampleSelect.style.height = '32px';
    exampleSelect.style.zIndex = '10';
  }
}

function onExampleSelect(e) {
  let level = parseInt(e.target.value);
  if (level && examples[level]) {
    loadExample(level);
    // Reset select to show prompt again
    e.target.selectedIndex = 0;
  }
}

function onInputChange() {
  calculateScore();
  updateInputBorders();
}

function updateInputBorders() {
  for (let item of inputElements) {
    let input = item.input;
    let elem = item.element;
    let value = input.value.trim();

    if (value.length > 0) {
      input.style.borderColor = colors.complete.border;
      input.style.backgroundColor = colors.complete.bg;
    } else {
      // Color based on priority
      let priority = getPriority(elem.id);
      if (priority === 'required') {
        input.style.borderColor = colors.required.border;
        input.style.backgroundColor = colors.required.bg;
      } else if (priority === 'recommended') {
        input.style.borderColor = colors.recommended.border;
        input.style.backgroundColor = colors.recommended.bg;
      } else {
        input.style.borderColor = colors.optional.border;
        input.style.backgroundColor = colors.optional.bg;
      }
    }
  }
}

function getPriority(id) {
  if (dcElements.required.find(e => e.id === id)) return 'required';
  if (dcElements.recommended.find(e => e.id === id)) return 'recommended';
  return 'optional';
}

function calculateScore() {
  score = 0;
  qualityTips = [];

  let allElements = [...dcElements.required, ...dcElements.recommended, ...dcElements.optional];

  for (let elem of allElements) {
    let value = inputs[elem.id].value.trim();
    if (value.length > 0) {
      score += elem.points;
    }
  }

  // Quality bonuses
  let description = inputs['description'].value.trim();
  if (description.length >= 50) {
    score += 2;
    qualityTips.push('Description is detailed (+2)');
  } else if (description.length > 0 && description.length < 50) {
    qualityTips.push('Tip: Add more detail to description');
  }

  let subjects = inputs['subject'].value.trim();
  if (subjects.length > 0) {
    let subjectCount = subjects.split(',').filter(s => s.trim().length > 0).length;
    if (subjectCount >= 3) {
      score += 2;
      qualityTips.push('Good subject coverage (+2)');
    } else {
      qualityTips.push('Tip: Add 3+ subject terms');
    }
  }

  let dateVal = inputs['date'].value.trim();
  if (dateVal.match(/^\d{4}-\d{2}-\d{2}$/)) {
    score += 1;
    qualityTips.push('Valid ISO date format (+1)');
  } else if (dateVal.length > 0) {
    qualityTips.push('Tip: Use YYYY-MM-DD format');
  }

  // Cap at max
  score = Math.min(score, maxScore + 5); // Allow up to 105 with bonuses
  completenessPercent = Math.min(100, Math.round((score / maxScore) * 100));
}

function draw() {
  updateCanvasSize();

  // Background
  fill(colors.background);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#CFD8DC');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Calculate layout
  rightPanelWidth = canvasWidth - leftPanelWidth - margin;

  // Left panel - Form labels
  drawFormLabels();

  // Right panel - Feedback
  drawFeedbackPanel();

  // Control area - Buttons
  drawControlArea();
}

function drawFormLabels() {
  let startY = 45;
  let spacing = 32;
  let yOffset = startY;

  // Title
  fill(colors.text);
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  noStroke();
  text('Dublin Core Metadata', margin, 12);
  textStyle(NORMAL);

  // Required section
  fill(colors.required.header);
  textSize(12);
  textStyle(BOLD);
  text('REQUIRED (10 pts each)', margin, yOffset);
  textStyle(NORMAL);
  yOffset += 25;

  textSize(12);
  fill(colors.text);
  for (let elem of dcElements.required) {
    textAlign(RIGHT, CENTER);
    text(elem.name + ':', margin + 80, yOffset + 13);
    yOffset += spacing;
  }

  // Recommended section
  yOffset += 3;
  fill(colors.recommended.header);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('RECOMMENDED (5 pts each)', margin, yOffset);
  textStyle(NORMAL);

  yOffset += 20;

  fill(colors.text);
  for (let elem of dcElements.recommended) {
    textAlign(RIGHT, CENTER);
    text(elem.name + ':', margin + 80, yOffset + 13);
    yOffset += spacing;
  }

  // Optional section
  // this is for placement of the field labels
  yOffset += 15;
  fill(colors.optional.header);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('OPTIONAL (2.5 pts each)', margin, yOffset);
  textStyle(NORMAL);
  yOffset += 25;

  fill(colors.text);
  for (let elem of dcElements.optional) {
    textAlign(RIGHT, CENTER);
    text(elem.name + ':', margin + 80, yOffset + 13);
    yOffset += spacing;
  }
}

function drawFeedbackPanel() {
  let panelX = leftPanelWidth + margin / 2;
  let panelY = 12;
  let panelW = rightPanelWidth - margin;
  let panelH = drawHeight - 24;

  // Panel background
  fill(colors.panelBg);
  stroke('#DDD');
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(colors.text);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Completeness Score', panelX + panelW / 2, panelY + 12);
  textStyle(NORMAL);

  // Draw circular gauge
  drawGauge(panelX + panelW / 2, panelY + 110, 70);

  // Score text
  fill(colors.text);
  textAlign(CENTER, TOP);
  textSize(12);
  text(score.toFixed(1) + ' / ' + maxScore + ' points', panelX + panelW / 2, panelY + 190);

  // Field status checklist
  drawStatusChecklist(panelX + 15, panelY + 220, panelW - 30);

  // Quality tips
  drawQualityTips(panelX + 15, panelY + 395, panelW - 30);
}

function drawGauge(cx, cy, radius) {
  // Track
  stroke(colors.gaugeTrack);
  strokeWeight(12);
  noFill();
  arc(cx, cy, radius * 2, radius * 2, PI * 0.75, PI * 2.25);

  // Progress
  let progressAngle = map(completenessPercent, 0, 100, PI * 0.75, PI * 2.25);
  let gaugeColor;
  if (completenessPercent >= 80) {
    gaugeColor = colors.gaugeGood;
  } else if (completenessPercent >= 50) {
    gaugeColor = colors.gaugeMedium;
  } else {
    gaugeColor = colors.gaugeLow;
  }

  stroke(gaugeColor);
  strokeWeight(12);
  arc(cx, cy, radius * 2, radius * 2, PI * 0.75, progressAngle);

  // Center percentage
  fill(gaugeColor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  text(completenessPercent + '%', cx, cy);
  textStyle(NORMAL);

  // Label
  fill(colors.subtext);
  textSize(10);
  text('Complete', cx, cy + 22);
}

function drawStatusChecklist(x, y, width) {
  fill(colors.text);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  noStroke();
  text('Element Status:', x, y);
  textStyle(NORMAL);

  y += 18;

  let allElements = [...dcElements.required, ...dcElements.recommended, ...dcElements.optional];
  let col = 0;
  let row = 0;
  let colWidth = width / 3;
  let rowHeight = 14;

  for (let elem of allElements) {
    let value = inputs[elem.id].value.trim();
    let statusX = x + col * colWidth;
    let statusY = y + row * rowHeight;

    // Status icon
    if (value.length > 0) {
      fill(colors.complete.border);
      text('\u2713', statusX, statusY);
    } else {
      let priority = getPriority(elem.id);
      if (priority === 'required') {
        fill(colors.required.border);
      } else if (priority === 'recommended') {
        fill(colors.recommended.border);
      } else {
        fill(colors.optional.border);
      }
      text('\u2717', statusX, statusY);
    }

    // Element name
    fill(value.length > 0 ? colors.subtext : colors.text);
    textSize(9);
    text(elem.name, statusX + 12, statusY);
    textSize(11);

    col++;
    if (col >= 3) {
      col = 0;
      row++;
    }
  }
}

function drawQualityTips(x, y, width) {
  fill(colors.text);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  noStroke();
  text('Quality Feedback:', x, y);
  textStyle(NORMAL);

  y += 16;
  textSize(10);

  if (qualityTips.length === 0) {
    fill(colors.subtext);
    text('Fill in fields to see feedback', x, y);
  } else {
    for (let tip of qualityTips.slice(0, 5)) {
      if (tip.includes('+')) {
        fill(colors.gaugeGood);
      } else {
        fill(colors.recommended.header);
      }
      text('\u2022 ' + tip, x, y);
      y += 14;
    }
  }
}

function drawControlArea() {
  buttonAreas = [];

  let buttonW = 100;
  let buttonH = 32;
  let buttonY = drawHeight + 20; // Align with select dropdown
  let gap = 12;

  // Label for example selector (dropdown is positioned via DOM)
  fill(colors.subtext);
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(10);
  text('Examples:', margin, drawHeight + 14);

  // Buttons positioned to the right of the example selector
  let buttonsStartX = margin + 200; // After select dropdown

  // Clear All button
  drawButton('Clear All', buttonsStartX, buttonY, buttonW, buttonH, colors.resetButton, colors.resetButtonHover);

  // Export JSON button
  drawButton('Export JSON', buttonsStartX + buttonW + gap, buttonY, buttonW, buttonH, colors.button, colors.buttonHover);

  // Check button (recalculates)
  drawButton('Check', buttonsStartX + (buttonW + gap) * 2, buttonY, buttonW, buttonH, colors.gaugeGood, '#388E3C');
}

function drawButton(label, x, y, w, h, baseColor, hoverColor) {
  let isHovered = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;

  fill(isHovered ? hoverColor : baseColor);
  noStroke();
  rect(x, y, w, h, 6);

  fill('white');
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(label, x + w / 2, y + h / 2);
  textStyle(NORMAL);

  buttonAreas.push({ label, x, y, w, h });
}

function mousePressed() {
  for (let btn of buttonAreas) {
    if (mouseX >= btn.x && mouseX <= btn.x + btn.w &&
        mouseY >= btn.y && mouseY <= btn.y + btn.h) {
      handleButton(btn.label);
      return;
    }
  }
}

function handleButton(label) {
  switch (label) {
    case 'Clear All':
      clearAll();
      break;
    case 'Export JSON':
      exportJSON();
      break;
    case 'Check':
      calculateScore();
      updateInputBorders();
      break;
  }
}

function loadExample(level) {
  // Clear all fields first
  for (let id in inputs) {
    inputs[id].value = '';
  }

  // Load the selected example
  let exampleData = examples[level].data;
  for (let field in exampleData) {
    if (inputs[field]) {
      inputs[field].value = exampleData[field];
    }
  }

  calculateScore();
  updateInputBorders();
}

function clearAll() {
  for (let id in inputs) {
    inputs[id].value = '';
  }
  calculateScore();
  updateInputBorders();
}

function exportJSON() {
  let dcObject = {
    dublinCore: {
      title: inputs['title'].value.trim() || null,
      creator: inputs['creator'].value.trim() || null,
      subject: inputs['subject'].value.trim() ? inputs['subject'].value.split(',').map(s => s.trim()).filter(s => s) : null,
      description: inputs['description'].value.trim() || null,
      publisher: inputs['publisher'].value.trim() || null,
      contributor: inputs['contributor'].value.trim() || null,
      date: inputs['date'].value.trim() || null,
      type: inputs['type'].value.trim() || null,
      format: inputs['format'].value.trim() || null,
      identifier: inputs['identifier'].value.trim() || null,
      source: inputs['source'].value.trim() || null,
      language: inputs['language'].value.trim() || null,
      relation: inputs['relation'].value.trim() || null,
      coverage: inputs['coverage'].value.trim() || null,
      rights: inputs['rights'].value.trim() || null
    }
  };

  // Remove null values for cleaner output
  for (let key in dcObject.dublinCore) {
    if (dcObject.dublinCore[key] === null) {
      delete dcObject.dublinCore[key];
    }
  }

  // Create and trigger download
  let json = JSON.stringify(dcObject, null, 2);
  let blob = new Blob([json], { type: 'application/json' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = 'dublin-core-metadata.json';
  a.click();
  URL.revokeObjectURL(url);
}

function mouseMoved() {
  // Check button hovers
  for (let btn of buttonAreas) {
    if (mouseX >= btn.x && mouseX <= btn.x + btn.w &&
        mouseY >= btn.y && mouseY <= btn.y + btn.h) {
      cursor(HAND);
      return;
    }
  }
  cursor(ARROW);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionInputFields();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(650, container.offsetWidth);
    leftPanelWidth = Math.min(400, canvasWidth * 0.55);
  }
}
