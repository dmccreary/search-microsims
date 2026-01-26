// Layout Patterns MicroSim
// Shows Fixed, Two-Panel, and Three-Panel MicroSim layouts
// Bloom Level: Apply (L3) - select appropriate layout
// MicroSim template version 2026.02

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Layout definitions
const layouts = [
  {
    name: 'Fixed',
    description: 'Single area, minimal structure',
    bestFor: 'Simple animations, demos',
    vizSpace: 'Maximum',
    controlCap: 'Minimal',
    mobile: 'Best'
  },
  {
    name: 'Two-Panel',
    description: 'Visualization + Controls',
    bestFor: 'Most simulations',
    vizSpace: 'Good',
    controlCap: 'Medium',
    mobile: 'Good'
  },
  {
    name: 'Three-Panel',
    description: 'Viz + Controls + Info',
    bestFor: 'Complex labs',
    vizSpace: 'Less',
    controlCap: 'High',
    mobile: 'Challenging'
  }
];

// Selection state
let selectedLayout = 1; // Default to Two-Panel
let showMobile = false;

// Mini-sim animation
let pendulumAngle = 0;
let pendulumSpeed = 0.03;

// UI elements
let mobileToggle;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Mobile toggle checkbox
  mobileToggle = createCheckbox(' Show Mobile View', false);
  mobileToggle.position(10, drawHeight + 12);
  mobileToggle.changed(() => showMobile = mobileToggle.checked());

  describe('Gallery showing three MicroSim layout patterns: Fixed, Two-Panel, and Three-Panel, with live mini-examples and comparison table', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('MicroSim Layout Pattern Gallery', canvasWidth / 2, 10);

  // Update animation
  pendulumAngle = sin(frameCount * pendulumSpeed) * PI / 4;

  // Calculate column positions
  let colWidth = (canvasWidth - 40) / 3;
  let startX = 20;

  // Draw three layout columns
  for (let i = 0; i < 3; i++) {
    let x = startX + i * colWidth;
    let isSelected = selectedLayout === i;
    drawLayoutColumn(x, 40, colWidth - 10, layouts[i], i, isSelected);
  }

  // Draw comparison table
  drawComparisonTable();

  // Draw selection indicator
  drawSelectionInfo();
}

function drawLayoutColumn(x, y, width, layout, index, isSelected) {
  let height = 180;

  // Column background
  if (isSelected) {
    fill(230, 245, 255);
    stroke('#3498db');
    strokeWeight(3);
  } else {
    fill(255);
    stroke('#ddd');
    strokeWeight(1);
  }
  rect(x, y, width, height, 8);

  // Layout name
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text(layout.name, x + width/2, y + 8);
  textStyle(NORMAL);

  // Mini diagram
  let diagramY = y + 30;
  let diagramHeight = 70;
  let diagramWidth = width - 20;
  let diagramX = x + 10;

  if (showMobile) {
    drawMobileLayout(diagramX, diagramY, diagramWidth, diagramHeight, index);
  } else {
    drawDesktopLayout(diagramX, diagramY, diagramWidth, diagramHeight, index);
  }

  // Live mini-example
  let exampleY = y + 110;
  drawMiniExample(diagramX, exampleY, diagramWidth, 55, index);

  // Best for text
  fill('#666');
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text('Best for: ' + layout.bestFor, x + width/2, y + height - 5);
}

function drawDesktopLayout(x, y, w, h, layoutIndex) {
  stroke('#999');
  strokeWeight(1);

  if (layoutIndex === 0) {
    // Fixed layout - single area
    fill('#a8d5f7'); // Viz area blue
    rect(x, y, w, h * 0.85, 3);
    fill('#ddd');
    rect(x + w * 0.3, y + h * 0.6, w * 0.4, h * 0.2, 2);

    // Label
    fill('#666');
    noStroke();
    textSize(8);
    textAlign(CENTER, CENTER);
    text('VIZ', x + w/2, y + h * 0.35);

  } else if (layoutIndex === 1) {
    // Two-panel layout
    let vizWidth = w * 0.7;
    fill('#a8d5f7'); // Viz area
    rect(x, y, vizWidth, h, 3);
    fill('#b8e6b8'); // Control area
    rect(x + vizWidth + 2, y, w - vizWidth - 2, h, 3);

    // Labels
    fill('#666');
    noStroke();
    textSize(8);
    textAlign(CENTER, CENTER);
    text('VIZ', x + vizWidth/2, y + h/2);
    text('CTRL', x + vizWidth + (w - vizWidth)/2, y + h/2);

  } else {
    // Three-panel layout
    let vizWidth = w * 0.6;
    let panelWidth = w - vizWidth - 2;
    fill('#a8d5f7'); // Viz area
    rect(x, y, vizWidth, h, 3);
    fill('#b8e6b8'); // Control area
    rect(x + vizWidth + 2, y, panelWidth, h * 0.5, 3);
    fill('#f7d794'); // Info area
    rect(x + vizWidth + 2, y + h * 0.52, panelWidth, h * 0.48, 3);

    // Labels
    fill('#666');
    noStroke();
    textSize(8);
    textAlign(CENTER, CENTER);
    text('VIZ', x + vizWidth/2, y + h/2);
    text('CTRL', x + vizWidth + panelWidth/2, y + h * 0.25);
    text('INFO', x + vizWidth + panelWidth/2, y + h * 0.75);
  }
}

function drawMobileLayout(x, y, w, h, layoutIndex) {
  stroke('#999');
  strokeWeight(1);

  // Mobile shows stacked layouts
  if (layoutIndex === 0) {
    // Fixed - same as desktop
    fill('#a8d5f7');
    rect(x, y, w, h * 0.85, 3);
    fill('#ddd');
    rect(x + w * 0.2, y + h * 0.6, w * 0.6, h * 0.2, 2);

  } else if (layoutIndex === 1) {
    // Two-panel - stacked
    fill('#a8d5f7');
    rect(x, y, w, h * 0.6, 3);
    fill('#b8e6b8');
    rect(x, y + h * 0.62, w, h * 0.38, 3);

    fill('#666');
    noStroke();
    textSize(7);
    textAlign(CENTER, CENTER);
    text('VIZ', x + w/2, y + h * 0.3);
    text('CONTROLS', x + w/2, y + h * 0.8);

  } else {
    // Three-panel - stacked (complex)
    fill('#a8d5f7');
    rect(x, y, w, h * 0.45, 3);
    fill('#b8e6b8');
    rect(x, y + h * 0.47, w, h * 0.25, 3);
    fill('#f7d794');
    rect(x, y + h * 0.74, w, h * 0.26, 3);

    fill('#666');
    noStroke();
    textSize(6);
    textAlign(CENTER, CENTER);
    text('VIZ', x + w/2, y + h * 0.22);
    text('CTRL', x + w/2, y + h * 0.59);
    text('INFO', x + w/2, y + h * 0.87);
  }
}

function drawMiniExample(x, y, w, h, layoutIndex) {
  // Mini working pendulum example
  stroke('#ccc');
  strokeWeight(1);
  fill('#f9f9f9');
  rect(x, y, w, h, 3);

  let pendX, pendY, pendLength;

  if (layoutIndex === 0) {
    // Fixed - full width pendulum
    pendX = x + w/2;
    pendY = y + 5;
    pendLength = h * 0.7;

    // Pendulum
    let bobX = pendX + sin(pendulumAngle) * pendLength;
    let bobY = pendY + cos(pendulumAngle) * pendLength;
    stroke('#666');
    strokeWeight(1);
    line(pendX, pendY, bobX, bobY);
    fill('#3498db');
    noStroke();
    ellipse(bobX, bobY, 8, 8);

    // Overlay controls
    fill(200);
    noStroke();
    rect(x + 5, y + h - 12, 20, 8, 2);
    rect(x + 28, y + h - 12, 20, 8, 2);

  } else if (layoutIndex === 1) {
    // Two-panel
    let vizW = w * 0.65;
    pendX = x + vizW/2;
    pendY = y + 5;
    pendLength = h * 0.65;

    // Viz area
    fill('#f0f8ff');
    stroke('#ccc');
    rect(x + 1, y + 1, vizW - 2, h - 2, 2);

    // Pendulum
    let bobX = pendX + sin(pendulumAngle) * pendLength;
    let bobY = pendY + cos(pendulumAngle) * pendLength;
    stroke('#666');
    strokeWeight(1);
    line(pendX, pendY, bobX, bobY);
    fill('#27ae60');
    noStroke();
    ellipse(bobX, bobY, 7, 7);

    // Control panel
    fill('#f5f5f5');
    stroke('#ccc');
    rect(x + vizW + 1, y + 1, w - vizW - 2, h - 2, 2);

    // Mini sliders
    fill('#ddd');
    noStroke();
    rect(x + vizW + 5, y + 10, w - vizW - 12, 4, 1);
    rect(x + vizW + 5, y + 22, w - vizW - 12, 4, 1);
    rect(x + vizW + 5, y + 34, w - vizW - 12, 4, 1);

  } else {
    // Three-panel
    let vizW = w * 0.55;
    let panelW = w - vizW - 2;
    pendX = x + vizW/2;
    pendY = y + 5;
    pendLength = h * 0.6;

    // Viz area
    fill('#f0f8ff');
    stroke('#ccc');
    rect(x + 1, y + 1, vizW - 2, h - 2, 2);

    // Pendulum
    let bobX = pendX + sin(pendulumAngle) * pendLength;
    let bobY = pendY + cos(pendulumAngle) * pendLength;
    stroke('#666');
    strokeWeight(1);
    line(pendX, pendY, bobX, bobY);
    fill('#e74c3c');
    noStroke();
    ellipse(bobX, bobY, 6, 6);

    // Control panel
    fill('#f5f5f5');
    stroke('#ccc');
    rect(x + vizW + 1, y + 1, panelW - 1, h * 0.45, 2);

    // Mini sliders
    fill('#ddd');
    noStroke();
    rect(x + vizW + 4, y + 8, panelW - 10, 3, 1);
    rect(x + vizW + 4, y + 16, panelW - 10, 3, 1);

    // Info panel
    fill('#fff9e6');
    stroke('#ccc');
    rect(x + vizW + 1, y + h * 0.48, panelW - 1, h * 0.5, 2);

    // Mini text lines
    fill('#ccc');
    noStroke();
    rect(x + vizW + 4, y + h * 0.55, panelW - 10, 2, 1);
    rect(x + vizW + 4, y + h * 0.65, panelW - 15, 2, 1);
    rect(x + vizW + 4, y + h * 0.75, panelW - 12, 2, 1);
  }
}

function drawComparisonTable() {
  let tableY = 235;
  let tableHeight = 100;
  let colWidth = (canvasWidth - 120) / 3;
  let headerX = 20;

  // Table title
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Comparison', headerX, tableY);
  textStyle(NORMAL);

  // Row headers
  let rows = ['Viz Space', 'Controls', 'Mobile'];
  textSize(10);
  textAlign(RIGHT, CENTER);

  for (let i = 0; i < rows.length; i++) {
    fill('#666');
    text(rows[i], headerX + 65, tableY + 25 + i * 22);
  }

  // Data cells
  textAlign(CENTER, CENTER);
  for (let col = 0; col < 3; col++) {
    let x = headerX + 80 + col * colWidth;
    let layout = layouts[col];

    // Column header
    fill(selectedLayout === col ? '#3498db' : '#333');
    textStyle(BOLD);
    text(layout.name, x + colWidth/2, tableY + 12);
    textStyle(NORMAL);

    // Values
    let values = [layout.vizSpace, layout.controlCap, layout.mobile];
    for (let row = 0; row < values.length; row++) {
      fill(getValueColor(values[row]));
      text(values[row], x + colWidth/2, tableY + 25 + row * 22);
    }
  }
}

function getValueColor(value) {
  const colors = {
    'Maximum': '#27ae60',
    'Best': '#27ae60',
    'Good': '#3498db',
    'Medium': '#f39c12',
    'Less': '#e67e22',
    'High': '#27ae60',
    'Minimal': '#e74c3c',
    'Challenging': '#e74c3c'
  };
  return colors[value] || '#666';
}

function drawSelectionInfo() {
  let infoY = 345;
  let layout = layouts[selectedLayout];

  fill(240);
  stroke('#ccc');
  strokeWeight(1);
  rect(15, infoY, canvasWidth - 30, 90, 8);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Selected: ' + layout.name + ' Layout', 25, infoY + 10);
  textStyle(NORMAL);

  textSize(11);
  fill('#555');
  text(layout.description, 25, infoY + 30);
  text('Best for: ' + layout.bestFor, 25, infoY + 48);

  // Recommendation
  fill('#3498db');
  textSize(10);
  text('Click a layout above to select it', 25, infoY + 70);
}

function mousePressed() {
  // Check if clicking on a layout column
  let colWidth = (canvasWidth - 40) / 3;
  let startX = 20;

  for (let i = 0; i < 3; i++) {
    let x = startX + i * colWidth;
    if (mouseX > x && mouseX < x + colWidth - 10 &&
        mouseY > 40 && mouseY < 220) {
      selectedLayout = i;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
