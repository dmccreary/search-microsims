// p5.js Architecture MicroSim
// Shows the execution flow of a p5.js program
// Bloom Level: Understand (L2) - explain execution model
// MicroSim template version 2026.02

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Flow nodes
const nodes = [
  { id: 'start', label: 'Page Loads', x: 0.5, y: 0.08, type: 'terminal' },
  { id: 'init', label: 'p5.js Library\nInitializes', x: 0.5, y: 0.18, type: 'process' },
  { id: 'setup', label: 'setup()', x: 0.5, y: 0.30, type: 'function', color: '#3498db' },
  { id: 'loop', label: 'Animation Loop\n(60 fps)', x: 0.5, y: 0.44, type: 'loop' },
  { id: 'draw', label: 'draw()', x: 0.5, y: 0.58, type: 'function', color: '#27ae60' },
  { id: 'events', label: 'Event Handlers', x: 0.15, y: 0.58, type: 'events', color: '#e67e22' }
];

// Edges
const edges = [
  { from: 'start', to: 'init' },
  { from: 'init', to: 'setup' },
  { from: 'setup', to: 'loop' },
  { from: 'loop', to: 'draw' },
  { from: 'draw', to: 'loop', curved: true },
  { from: 'events', to: 'draw', dashed: true }
];

// Setup details
const setupDetails = [
  'createCanvas()',
  'Initialize variables',
  'Create controls',
  'Set initial state'
];

// Draw details
const drawDetails = [
  'Clear background',
  'Calculate positions',
  'Draw shapes',
  'Display values'
];

// Event handlers
const eventHandlers = [
  'mousePressed()',
  'keyPressed()',
  'windowResized()'
];

// Animation state
let currentStep = 0;
let animationPhase = 0;
let showDetails = true;
let autoPlay = false;
let lastStepTime = 0;

// Selected node for details
let selectedNode = null;

// UI Elements
let stepButton;
let resetButton;
let autoButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create buttons
  stepButton = createButton('Next Step');
  stepButton.position(10, drawHeight + 10);
  stepButton.mousePressed(nextStep);

  resetButton = createButton('Reset');
  resetButton.position(100, drawHeight + 10);
  resetButton.mousePressed(resetAnimation);

  autoButton = createButton('Auto Play');
  autoButton.position(165, drawHeight + 10);
  autoButton.mousePressed(toggleAutoPlay);

  describe('Flowchart showing p5.js program execution: Page loads, setup runs once, then draw loops continuously. Event handlers can trigger anytime.', LABEL);
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
  textSize(18);
  text('p5.js Execution Model', canvasWidth / 2, 8);

  // Auto-play logic
  if (autoPlay && millis() - lastStepTime > 1500) {
    nextStep();
    lastStepTime = millis();
  }

  // Animate phase for visual feedback
  animationPhase += 0.05;

  // Draw flow diagram
  drawEdges();
  drawNodes();

  // Draw detail panels
  if (showDetails) {
    drawDetailPanels();
  }

  // Draw step indicator
  drawStepIndicator();
}

function drawNodes() {
  for (let node of nodes) {
    let x = node.x * canvasWidth;
    let y = node.y * drawHeight + 30;
    let isActive = isNodeActive(node.id);
    let isHovered = isMouseOverNode(node, x, y);

    drawNode(x, y, node, isActive, isHovered);
  }
}

function drawNode(x, y, node, isActive, isHovered) {
  let w = 90;
  let h = 35;

  // Glow effect for active nodes
  if (isActive) {
    noStroke();
    fill(100, 200, 255, 50 + sin(animationPhase * 3) * 30);
    ellipse(x, y, w + 20, h + 20);
  }

  // Node shape based on type
  if (node.type === 'terminal') {
    // Rounded terminal (start/end)
    fill(isActive ? '#2ecc71' : (isHovered ? '#95a5a6' : '#bdc3c7'));
    stroke(isActive ? '#27ae60' : '#95a5a6');
    strokeWeight(2);
    rect(x - w/2, y - h/2, w, h, 15);

  } else if (node.type === 'process') {
    // Rectangle
    fill(isActive ? '#3498db' : (isHovered ? '#bdc3c7' : '#ecf0f1'));
    stroke(isActive ? '#2980b9' : '#bdc3c7');
    strokeWeight(2);
    rect(x - w/2, y - h/2, w, h, 5);

  } else if (node.type === 'function') {
    // Colored function box
    let baseColor = color(node.color || '#3498db');
    fill(isActive ? baseColor : (isHovered ? lerpColor(baseColor, color(255), 0.5) : lerpColor(baseColor, color(255), 0.7)));
    stroke(isActive ? lerpColor(baseColor, color(0), 0.2) : baseColor);
    strokeWeight(2);
    rect(x - w/2, y - h/2, w, h, 8);

  } else if (node.type === 'loop') {
    // Diamond shape for loop
    fill(isActive ? '#9b59b6' : (isHovered ? '#d5c4df' : '#e8daef'));
    stroke(isActive ? '#8e44ad' : '#9b59b6');
    strokeWeight(2);
    beginShape();
    vertex(x, y - h/2 - 5);
    vertex(x + w/2 + 5, y);
    vertex(x, y + h/2 + 5);
    vertex(x - w/2 - 5, y);
    endShape(CLOSE);

  } else if (node.type === 'events') {
    // Events box (dashed border)
    fill(isActive ? '#e67e22' : (isHovered ? '#fdebd0' : '#fef5e7'));
    stroke(isActive ? '#d35400' : '#e67e22');
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    rect(x - w/2, y - h/2, w, h + 15, 5);
    drawingContext.setLineDash([]);
  }

  // Node label
  fill(isActive ? 'white' : '#2c3e50');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(10);

  let lines = node.label.split('\n');
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, y + (i - (lines.length-1)/2) * 12);
  }
}

function drawEdges() {
  for (let edge of edges) {
    let fromNode = nodes.find(n => n.id === edge.from);
    let toNode = nodes.find(n => n.id === edge.to);

    let x1 = fromNode.x * canvasWidth;
    let y1 = fromNode.y * drawHeight + 30;
    let x2 = toNode.x * canvasWidth;
    let y2 = toNode.y * drawHeight + 30;

    let isActive = isEdgeActive(edge.from, edge.to);

    stroke(isActive ? '#3498db' : '#95a5a6');
    strokeWeight(isActive ? 3 : 2);

    if (edge.dashed) {
      drawingContext.setLineDash([5, 5]);
    }

    if (edge.curved) {
      // Curved arrow for loop back
      noFill();
      let cx = x1 + 80;
      bezier(x1 + 45, y1, cx, y1, cx, y2 - 60, x1 + 45, y2 - 60);

      // Arrow pointing up to loop
      fill(isActive ? '#3498db' : '#95a5a6');
      noStroke();
      triangle(x1 + 45, y2 - 75, x1 + 40, y2 - 60, x1 + 50, y2 - 60);

    } else {
      // Straight arrow
      let offset = 20;
      if (fromNode.type === 'loop') offset = 25;

      line(x1, y1 + offset, x2, y2 - 20);

      // Arrow head
      let angle = atan2(y2 - y1, x2 - x1);
      fill(isActive ? '#3498db' : '#95a5a6');
      noStroke();
      push();
      translate(x2, y2 - 20);
      rotate(angle);
      triangle(0, 0, -10, -5, -10, 5);
      pop();
    }

    drawingContext.setLineDash([]);
  }
}

function drawDetailPanels() {
  // Setup details panel
  drawInfoPanel(canvasWidth - 120, 80, 110, setupDetails, 'setup() does:', currentStep >= 2);

  // Draw details panel
  drawInfoPanel(canvasWidth - 120, 200, 110, drawDetails, 'draw() does:', currentStep >= 4);

  // Event handlers panel
  drawInfoPanel(10, 280, 95, eventHandlers, 'Events:', currentStep >= 3);
}

function drawInfoPanel(x, y, w, items, title, isActive) {
  let h = 20 + items.length * 15;

  fill(255, 255, 255, isActive ? 250 : 200);
  stroke(isActive ? '#3498db' : '#ccc');
  strokeWeight(1);
  rect(x, y, w, h, 5);

  fill(isActive ? '#2c3e50' : '#7f8c8d');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(9);
  textStyle(BOLD);
  text(title, x + 5, y + 5);
  textStyle(NORMAL);

  textSize(8);
  for (let i = 0; i < items.length; i++) {
    text('• ' + items[i], x + 8, y + 20 + i * 14);
  }
}

function drawStepIndicator() {
  let steps = ['Start', 'Initialize', 'setup()', 'Events Ready', 'draw()', 'Loop'];

  textAlign(LEFT, CENTER);
  textSize(10);
  noStroke();

  let stepX = 15;
  let stepY = drawHeight - 25;

  for (let i = 0; i < steps.length; i++) {
    let isCurrentStep = i <= currentStep;
    fill(isCurrentStep ? '#3498db' : '#ccc');
    ellipse(stepX + i * 60, stepY, 12, 12);

    if (i === currentStep) {
      fill('white');
      ellipse(stepX + i * 60, stepY, 6, 6);
    }

    fill(isCurrentStep ? '#2c3e50' : '#95a5a6');
    textAlign(CENTER, TOP);
    textSize(7);
    text(steps[i], stepX + i * 60, stepY + 10);
  }
}

function isNodeActive(nodeId) {
  const stepNodes = [
    ['start'],
    ['start', 'init'],
    ['init', 'setup'],
    ['setup', 'events'],
    ['loop', 'draw'],
    ['loop', 'draw']
  ];

  if (currentStep < stepNodes.length) {
    return stepNodes[currentStep].includes(nodeId);
  }
  return nodeId === 'loop' || nodeId === 'draw';
}

function isEdgeActive(from, to) {
  if (currentStep === 0) return false;
  if (currentStep === 1 && from === 'start' && to === 'init') return true;
  if (currentStep === 2 && from === 'init' && to === 'setup') return true;
  if (currentStep >= 3 && from === 'setup' && to === 'loop') return true;
  if (currentStep >= 4 && (from === 'loop' && to === 'draw')) return true;
  if (currentStep >= 5 && from === 'draw' && to === 'loop') return true;
  if (currentStep >= 3 && from === 'events' && to === 'draw') return true;
  return false;
}

function isMouseOverNode(node, x, y) {
  let w = 50;
  let h = 25;
  return mouseX > x - w && mouseX < x + w && mouseY > y - h && mouseY < y + h;
}

function nextStep() {
  currentStep = (currentStep + 1) % 6;
}

function resetAnimation() {
  currentStep = 0;
  autoPlay = false;
  autoButton.html('Auto Play');
}

function toggleAutoPlay() {
  autoPlay = !autoPlay;
  autoButton.html(autoPlay ? 'Stop' : 'Auto Play');
  lastStepTime = millis();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
