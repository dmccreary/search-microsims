// Graph Visualization Layout Gallery
// Compare different graph layout algorithms

let canvasWidth = 850;
const drawHeight = 440;
const controlHeight = 80;

const layouts = [
  { name: 'Force-Directed', desc: 'Nodes pushed apart, edges pull together', bestFor: 'General exploration' },
  { name: 'Hierarchical', desc: 'Top-to-bottom tree structure', bestFor: 'Org charts, taxonomies' },
  { name: 'Circular', desc: 'Nodes evenly spaced on circle', bestFor: 'Connection density' },
  { name: 'Radial', desc: 'Central node with rings outward', bestFor: 'Ego networks, influence' },
  { name: 'Grid', desc: 'Regular rows and columns', bestFor: 'Game boards, matrices' }
];

// Sample graph data (same data rendered in each layout)
const nodes = [
  { id: 0, label: 'A' },
  { id: 1, label: 'B' },
  { id: 2, label: 'C' },
  { id: 3, label: 'D' },
  { id: 4, label: 'E' },
  { id: 5, label: 'F' },
  { id: 6, label: 'G' },
  { id: 7, label: 'H' }
];

const edges = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 7]
];

let selectedLayout = -1;
let hoveredLayout = -1;
let morphProgress = 0;
let targetLayout = -1;

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 900);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);
}

function draw() {
  background(248, 249, 250);

  // Control area
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Graph Layout Algorithm Gallery', canvasWidth / 2, 20);
  textStyle(NORMAL);

  if (selectedLayout >= 0) {
    drawExpandedLayout();
  } else {
    drawGallery();
  }

  drawControls();
}

function drawGallery() {
  let cols = 3;
  let rows = 2;
  let panelW = (canvasWidth - 80) / cols;
  let panelH = 170;
  let startY = 50;

  for (let i = 0; i < layouts.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = 25 + col * (panelW + 15);
    let y = startY + row * (panelH + 15);

    let layout = layouts[i];
    let isHovered = hoveredLayout === i;

    // Panel
    fill(255);
    stroke(isHovered ? color(70, 130, 180) : color(200));
    strokeWeight(isHovered ? 2 : 1);
    rect(x, y, panelW, panelH, 8);

    // Header
    fill(70, 130, 180);
    noStroke();
    rect(x, y, panelW, 28, 8, 8, 0, 0);

    fill(255);
    textSize(11);
    textStyle(BOLD);
    text(layout.name, x + panelW / 2, y + 14);
    textStyle(NORMAL);

    // Mini graph
    drawMiniGraph(x + 10, y + 35, panelW - 20, 85, i);

    // Best for label
    fill(100);
    textSize(9);
    text('Best for: ' + layout.bestFor, x + panelW / 2, y + panelH - 15);

    // Click hint
    if (isHovered) {
      fill(70, 130, 180);
      textSize(8);
      text('Click to expand', x + panelW / 2, y + panelH - 30);
    }
  }
}

function drawMiniGraph(x, y, w, h, layoutType) {
  let positions = getLayoutPositions(layoutType, x, y, w, h);

  // Draw edges first
  stroke(180);
  strokeWeight(1);
  for (let e of edges) {
    let p1 = positions[e[0]];
    let p2 = positions[e[1]];
    line(p1.x, p1.y, p2.x, p2.y);
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let p = positions[i];
    fill(70, 130, 180);
    noStroke();
    ellipse(p.x, p.y, 16, 16);

    fill(255);
    textSize(8);
    text(nodes[i].label, p.x, p.y);
  }
}

function getLayoutPositions(layoutType, x, y, w, h) {
  let positions = [];
  let cx = x + w / 2;
  let cy = y + h / 2;

  switch (layoutType) {
    case 0: // Force-directed (simulated)
      positions = [
        { x: cx - w * 0.3, y: cy - h * 0.2 },
        { x: cx - w * 0.1, y: cy - h * 0.35 },
        { x: cx + w * 0.2, y: cy - h * 0.15 },
        { x: cx - w * 0.3, y: cy + h * 0.2 },
        { x: cx + w * 0.1, y: cy + h * 0.35 },
        { x: cx + w * 0.35, y: cy - h * 0.3 },
        { x: cx + w * 0.4, y: cy + h * 0.15 },
        { x: cx, y: cy + h * 0.4 }
      ];
      break;

    case 1: // Hierarchical
      positions = [
        { x: cx, y: y + 10 },
        { x: cx - w * 0.25, y: y + h * 0.35 },
        { x: cx + w * 0.25, y: y + h * 0.35 },
        { x: cx - w * 0.35, y: y + h * 0.65 },
        { x: cx - w * 0.1, y: y + h * 0.65 },
        { x: cx + w * 0.1, y: y + h * 0.65 },
        { x: cx + w * 0.35, y: y + h * 0.65 },
        { x: cx, y: y + h - 10 }
      ];
      break;

    case 2: // Circular
      for (let i = 0; i < nodes.length; i++) {
        let angle = (i / nodes.length) * TWO_PI - HALF_PI;
        let radius = min(w, h) * 0.4;
        positions.push({
          x: cx + cos(angle) * radius,
          y: cy + sin(angle) * radius
        });
      }
      break;

    case 3: // Radial
      positions.push({ x: cx, y: cy }); // Center node
      for (let i = 1; i < nodes.length; i++) {
        let ring = i < 3 ? 1 : 2;
        let ringNodes = ring === 1 ? 2 : 5;
        let ringIndex = ring === 1 ? i - 1 : i - 3;
        let angle = (ringIndex / ringNodes) * TWO_PI - HALF_PI;
        let radius = ring * min(w, h) * 0.25;
        positions.push({
          x: cx + cos(angle) * radius,
          y: cy + sin(angle) * radius
        });
      }
      break;

    case 4: // Grid
      let cols = 3;
      let rows = 3;
      let cellW = w / (cols + 1);
      let cellH = h / (rows + 1);
      for (let i = 0; i < nodes.length; i++) {
        let col = i % cols;
        let row = floor(i / cols);
        positions.push({
          x: x + cellW * (col + 1),
          y: y + cellH * (row + 1)
        });
      }
      break;
  }

  return positions;
}

function drawExpandedLayout() {
  let layout = layouts[selectedLayout];
  let x = 50;
  let y = 50;
  let w = canvasWidth - 100;
  let h = 350;

  // Panel
  fill(255);
  stroke(70, 130, 180);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  // Header
  fill(70, 130, 180);
  noStroke();
  rect(x, y, w, 40, 8, 8, 0, 0);

  fill(255);
  textSize(16);
  textStyle(BOLD);
  text(layout.name + ' Layout', x + w / 2, y + 20);
  textStyle(NORMAL);

  // Large graph
  drawMiniGraph(x + 20, y + 60, w - 200, h - 120, selectedLayout);

  // Description panel
  let descX = x + w - 160;
  fill(248);
  stroke(200);
  strokeWeight(1);
  rect(descX, y + 60, 140, h - 120, 5);

  textAlign(LEFT, TOP);
  fill(70);
  textSize(11);
  textStyle(BOLD);
  text('Description:', descX + 10, y + 75);
  textStyle(NORMAL);
  textWrap(WORD);
  text(layout.desc, descX + 10, y + 95, 120);

  textStyle(BOLD);
  text('Best For:', descX + 10, y + 160);
  textStyle(NORMAL);
  text(layout.bestFor, descX + 10, y + 180, 120);

  textAlign(CENTER, CENTER);

  // Back button
  fill(150);
  noStroke();
  rect(x + w - 80, y + h - 40, 70, 30, 5);
  fill(255);
  textSize(11);
  text('← Back', x + w - 45, y + h - 25);
}

function drawControls() {
  let y = drawHeight + 40;

  if (selectedLayout >= 0) {
    // Back hint
    fill(80);
    textSize(11);
    text('Click "Back" or press Escape to return to gallery', canvasWidth / 2, y);
  } else {
    // Gallery hint
    fill(80);
    textSize(11);
    text('Click any layout to see larger example with description', canvasWidth / 2, y);
  }

  // Layout selector buttons at bottom
  textSize(9);
  for (let i = 0; i < layouts.length; i++) {
    let btnX = 80 + i * 140;
    let isSelected = selectedLayout === i;

    fill(isSelected ? color(70, 130, 180) : color(200));
    noStroke();
    rect(btnX, y + 10, 130, 22, 4);

    fill(isSelected ? 255 : 80);
    text(layouts[i].name, btnX + 65, y + 21);
  }
}

function mousePressed() {
  // Gallery panel clicks
  if (selectedLayout < 0) {
    let cols = 3;
    let panelW = (canvasWidth - 80) / cols;
    let panelH = 170;
    let startY = 50;

    for (let i = 0; i < layouts.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = 25 + col * (panelW + 15);
      let y = startY + row * (panelH + 15);

      if (mouseX > x && mouseX < x + panelW && mouseY > y && mouseY < y + panelH) {
        selectedLayout = i;
        return;
      }
    }
  }

  // Back button in expanded view
  if (selectedLayout >= 0) {
    let x = 50;
    let w = canvasWidth - 100;
    let y = 50;
    let h = 350;

    if (mouseX > x + w - 80 && mouseX < x + w - 10 && mouseY > y + h - 40 && mouseY < y + h - 10) {
      selectedLayout = -1;
    }
  }

  // Bottom layout buttons
  let y = drawHeight + 50;
  for (let i = 0; i < layouts.length; i++) {
    let btnX = 80 + i * 140;
    if (mouseX > btnX && mouseX < btnX + 130 && mouseY > y && mouseY < y + 22) {
      selectedLayout = i;
    }
  }
}

function mouseMoved() {
  hoveredLayout = -1;

  if (selectedLayout < 0) {
    let cols = 3;
    let panelW = (canvasWidth - 80) / cols;
    let panelH = 170;
    let startY = 50;

    for (let i = 0; i < layouts.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = 25 + col * (panelW + 15);
      let y = startY + row * (panelH + 15);

      if (mouseX > x && mouseX < x + panelW && mouseY > y && mouseY < y + panelH) {
        hoveredLayout = i;
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ESCAPE && selectedLayout >= 0) {
    selectedLayout = -1;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
