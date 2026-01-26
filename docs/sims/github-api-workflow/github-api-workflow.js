// GitHub API Workflow Visualization MicroSim
// Shows the sequence of API calls needed to discover MicroSims

let canvasWidth = 800;
const drawHeight = 480;
const controlHeight = 60;

// Workflow steps
const steps = [
  { id: 1, type: 'start', label: 'Discover\nMicroSims', tooltip: 'Begin the data gathering process', x: 400, y: 40 },
  { id: 2, type: 'process', label: 'List User\nRepositories', api: 'GET /users/{username}/repos', tooltip: 'Find all repositories owned by the target user', x: 400, y: 100 },
  { id: 3, type: 'process', label: 'Filter Course\nRepositories', tooltip: 'Select repos likely to contain MicroSims (name contains course, microsim, etc.)', x: 400, y: 160 },
  { id: 4, type: 'loop', label: 'For Each\nRepository', tooltip: 'Process each discovered repository', x: 400, y: 220 },
  { id: 5, type: 'process', label: 'Check for\n/docs/sims', api: 'GET /repos/{owner}/{repo}/contents/docs/sims', tooltip: 'Verify the standard MicroSim location exists', x: 400, y: 280 },
  { id: 6, type: 'decision', label: 'Directory\nExists?', tooltip: 'Handle repos with and without MicroSims', x: 400, y: 340 },
  { id: '7a', type: 'process', label: 'List MicroSim\nDirectories', tooltip: 'Enumerate all simulation folders', x: 280, y: 400 },
  { id: '7b', type: 'skip', label: 'Skip\nRepository', tooltip: 'No MicroSims here, continue to next repo', x: 550, y: 340 },
  { id: 8, type: 'loop', label: 'For Each\nMicroSim Dir', tooltip: 'Process each discovered simulation', x: 180, y: 340 },
  { id: 9, type: 'process', label: 'Fetch\nmetadata.json', api: 'GET /repos/{owner}/{repo}/contents/.../metadata.json', tooltip: 'Retrieve the simulation\'s metadata file', x: 80, y: 280 },
  { id: 10, type: 'decision', label: 'Metadata\nValid?', tooltip: 'Validate against schema, check required fields', x: 80, y: 200 },
  { id: '11a', type: 'success', label: 'Store\nMetadata', tooltip: 'Add to aggregated collection', x: 80, y: 120 },
  { id: '11b', type: 'warning', label: 'Log\nWarning', tooltip: 'Record missing or invalid metadata for review', x: 200, y: 140 },
  { id: 12, type: 'end', label: 'Collection\nComplete', tooltip: 'All discovered metadata ready for search indexing', x: 80, y: 50 }
];

// Edges connecting steps
const edges = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: '7a', label: 'Yes' },
  { from: 6, to: '7b', label: 'No' },
  { from: '7a', to: 8 },
  { from: 8, to: 9 },
  { from: 9, to: 10 },
  { from: 10, to: '11a', label: 'Yes' },
  { from: 10, to: '11b', label: 'No' },
  { from: '11a', to: 12 },
  { from: '11b', to: 8, dashed: true },
  { from: '7b', to: 4, dashed: true }
];

let hoveredStep = null;
let animating = false;
let currentAnimStep = 0;
let animProgress = 0;

// Colors by step type
const typeColors = {
  start: { bg: '#4CAF50', border: '#2E7D32' },      // Green
  end: { bg: '#4CAF50', border: '#2E7D32' },        // Green
  process: { bg: '#2196F3', border: '#1565C0' },    // Blue (API calls)
  decision: { bg: '#FFC107', border: '#FFA000' },   // Yellow
  loop: { bg: '#9C27B0', border: '#6A1B9A' },       // Purple
  success: { bg: '#4CAF50', border: '#2E7D32' },    // Green
  warning: { bg: '#FF9800', border: '#E65100' },    // Orange
  skip: { bg: '#FF9800', border: '#E65100' }        // Orange
};

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 850);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Scale step positions to canvas
  scalePositions();
}

function scalePositions() {
  let scaleX = canvasWidth / 800;
  for (let step of steps) {
    step.scaledX = step.x * scaleX;
  }
}

function draw() {
  // Draw area
  fill(248, 249, 250);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill(240, 240, 240);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(18);
  textStyle(BOLD);
  text('GitHub API Workflow for MicroSim Discovery', canvasWidth / 2, 20);
  textStyle(NORMAL);

  // Draw edges first
  for (let edge of edges) {
    drawEdge(edge);
  }

  // Draw steps
  for (let step of steps) {
    drawStep(step);
  }

  // Draw tooltip if hovering
  if (hoveredStep) {
    drawTooltip(hoveredStep);
  }

  // Draw controls
  drawControls();

  // Animation
  if (animating) {
    animProgress += 0.02;
    if (animProgress >= 1) {
      animProgress = 0;
      currentAnimStep++;
      if (currentAnimStep >= edges.length) {
        currentAnimStep = 0;
      }
    }
  }
}

function drawStep(step) {
  let x = step.scaledX;
  let y = step.y;
  let isHovered = hoveredStep === step;
  let isAnimated = animating && isStepInAnimation(step);

  let colors = typeColors[step.type];

  push();

  // Glow effect if animated or hovered
  if (isAnimated || isHovered) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = colors.bg;
  }

  // Shape based on type
  fill(colors.bg);
  stroke(colors.border);
  strokeWeight(2);

  if (step.type === 'start' || step.type === 'end') {
    // Rounded rectangle (terminal)
    rectMode(CENTER);
    rect(x, y, 80, 36, 18);
  } else if (step.type === 'decision') {
    // Diamond
    beginShape();
    vertex(x, y - 28);
    vertex(x + 45, y);
    vertex(x, y + 28);
    vertex(x - 45, y);
    endShape(CLOSE);
  } else if (step.type === 'loop') {
    // Hexagon for loops
    beginShape();
    let r = 32;
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i - PI / 6;
      vertex(x + cos(angle) * r * 1.4, y + sin(angle) * r * 0.9);
    }
    endShape(CLOSE);
  } else {
    // Regular rectangle for process
    rectMode(CENTER);
    rect(x, y, 90, 45, 5);
  }

  // Label
  fill(255);
  noStroke();
  textSize(10);
  let lines = step.label.split('\n');
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, y + (i - (lines.length - 1) / 2) * 12);
  }

  // API badge if has API call
  if (step.api) {
    fill(255, 255, 255, 200);
    rectMode(CENTER);
    noStroke();
    rect(x, y + 32, 70, 12, 3);
    fill(100);
    textSize(7);
    text('API Call', x, y + 32);
  }

  pop();
}

function drawEdge(edge) {
  let fromStep = steps.find(s => s.id === edge.from);
  let toStep = steps.find(s => s.id === edge.to);

  if (!fromStep || !toStep) return;

  let x1 = fromStep.scaledX;
  let y1 = fromStep.y;
  let x2 = toStep.scaledX;
  let y2 = toStep.y;

  // Offset from step edges
  let offset = 25;
  if (fromStep.type === 'decision') offset = 30;

  // Determine if we're going down, right, or up
  let yOffset = y2 > y1 ? offset : (y2 < y1 ? -offset : 0);
  let xOffset = x2 > x1 ? 45 : (x2 < x1 ? -45 : 0);

  push();
  stroke(100);
  strokeWeight(edge.dashed ? 1.5 : 2);

  if (edge.dashed) {
    drawingContext.setLineDash([5, 5]);
  }

  // Simple line or bent path
  if (Math.abs(x1 - x2) < 10) {
    // Vertical line
    line(x1, y1 + offset, x2, y2 - offset);
    drawArrow(x2, y2 - offset, PI / 2);
  } else if (Math.abs(y1 - y2) < 10) {
    // Horizontal line
    let dir = x2 > x1 ? 1 : -1;
    line(x1 + 45 * dir, y1, x2 - 45 * dir, y2);
    drawArrow(x2 - 45 * dir, y2, dir > 0 ? 0 : PI);
  } else {
    // Bent path
    let midY = (y1 + y2) / 2;
    noFill();
    beginShape();
    vertex(x1 + (x2 > x1 ? 45 : -45), y1);
    vertex((x1 + x2) / 2, y1);
    vertex((x1 + x2) / 2, y2);
    vertex(x2 + (x2 > x1 ? -45 : 45), y2);
    endShape();

    let arrowDir = x2 > x1 ? 0 : PI;
    drawArrow(x2 + (x2 > x1 ? -45 : 45), y2, arrowDir);
  }

  // Label on edge
  if (edge.label) {
    fill(80);
    noStroke();
    textSize(10);
    let labelX = (x1 + x2) / 2;
    let labelY = (y1 + y2) / 2 - 10;
    text(edge.label, labelX + 15, labelY);
  }

  pop();
}

function drawArrow(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  fill(100);
  noStroke();
  triangle(0, 0, -8, -4, -8, 4);
  pop();
}

function drawTooltip(step) {
  let x = step.scaledX;
  let y = step.y;

  // Position tooltip to avoid edges
  let tooltipX = x;
  let tooltipY = y + 50;

  if (tooltipY + 60 > drawHeight) {
    tooltipY = y - 50;
  }

  // Calculate text width
  textSize(11);
  let tooltipText = step.tooltip;
  if (step.api) {
    tooltipText += '\n\n' + step.api;
  }

  let boxWidth = min(250, max(150, textWidth(step.tooltip) + 20));
  let boxHeight = step.api ? 70 : 45;

  // Keep in bounds
  tooltipX = constrain(tooltipX, boxWidth / 2 + 10, canvasWidth - boxWidth / 2 - 10);

  push();
  // Shadow
  fill(0, 0, 0, 30);
  noStroke();
  rectMode(CENTER);
  rect(tooltipX + 3, tooltipY + 3, boxWidth, boxHeight, 5);

  // Box
  fill(50, 50, 50, 240);
  rect(tooltipX, tooltipY, boxWidth, boxHeight, 5);

  // Text
  fill(255);
  textSize(11);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  text(step.tooltip, tooltipX - boxWidth / 2 + 10, tooltipY - 10, boxWidth - 20);

  if (step.api) {
    fill(150, 220, 255);
    textSize(9);
    text(step.api, tooltipX, tooltipY + 20);
  }
  pop();
}

function drawControls() {
  let y = drawHeight + 30;

  // Animate button
  fill(animating ? '#f44336' : '#4CAF50');
  noStroke();
  rectMode(CENTER);
  rect(80, y, 100, 32, 5);
  fill(255);
  textSize(12);
  text(animating ? 'Stop Animation' : 'Animate Flow', 80, y);

  // Legend
  let legendX = 200;
  let legendItems = [
    { type: 'process', label: 'API Call' },
    { type: 'decision', label: 'Decision' },
    { type: 'loop', label: 'Loop' },
    { type: 'warning', label: 'Alternative' }
  ];

  textSize(10);
  textAlign(LEFT, CENTER);
  for (let i = 0; i < legendItems.length; i++) {
    let item = legendItems[i];
    let x = legendX + i * 130;

    fill(typeColors[item.type].bg);
    stroke(typeColors[item.type].border);
    strokeWeight(1);
    rect(x, y, 16, 16, 3);

    fill(80);
    noStroke();
    text(item.label, x + 12, y);
  }
  textAlign(CENTER, CENTER);

  // Instructions
  fill(100);
  textSize(10);
  text('Hover over steps for details', canvasWidth - 100, y);
}

function isStepInAnimation(step) {
  if (currentAnimStep >= edges.length) return false;
  let edge = edges[currentAnimStep];
  return step.id === edge.from || step.id === edge.to;
}

function mouseMoved() {
  hoveredStep = null;

  for (let step of steps) {
    let d = dist(mouseX, mouseY, step.scaledX, step.y);
    if (d < 40) {
      hoveredStep = step;
      break;
    }
  }
}

function mousePressed() {
  // Check animate button
  if (mouseY > drawHeight && mouseY < drawHeight + controlHeight) {
    if (mouseX > 30 && mouseX < 130) {
      animating = !animating;
      if (animating) {
        currentAnimStep = 0;
        animProgress = 0;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
  scalePositions();
}
