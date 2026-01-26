// Grade Level Progression Visualization
// Shows educational grade levels from K-2 through Adult

let canvasWidth = 800;
const drawHeight = 400;
const controlHeight = 60;

// Grade level nodes
const gradeLevels = [
  { id: 'k2', label: 'K-2', ageRange: 'Ages 5-8', keywords: ['Concrete', 'Visual', 'Playful'],
    description: 'Focus on concrete, hands-on experiences. Heavy use of visuals and games. Short attention spans require quick interactions.',
    topics: ['Counting', 'Basic shapes', 'Animal life cycles', 'Color mixing'],
    color: '#FF7043' },
  { id: '35', label: '3-5', ageRange: 'Ages 8-11', keywords: ['Guided Discovery', 'Beginning Abstraction'],
    description: 'Transition from concrete to abstract. Guided discovery with scaffolding. Beginning to read for information.',
    topics: ['Fractions', 'State of matter', 'Simple machines', 'Geographic maps'],
    color: '#FFA726' },
  { id: '68', label: '6-8', ageRange: 'Ages 11-14', keywords: ['Emerging Reasoning', 'Peer Learning'],
    description: 'Developing logical reasoning. Interest in peer collaboration. Beginning abstract thinking.',
    topics: ['Algebra basics', 'Cell biology', 'Historical analysis', 'Probability'],
    color: '#FFCA28' },
  { id: '912', label: '9-12', ageRange: 'Ages 14-18', keywords: ['Abstract Thinking', 'Career Focus'],
    description: 'Full abstract thinking capacity. Career exploration begins. Preparing for higher education.',
    topics: ['Calculus', 'Chemistry reactions', 'Literary analysis', 'Statistical inference'],
    color: '#9CCC65' },
  { id: 'undergrad', label: 'Undergrad', ageRange: 'Ages 18-22', keywords: ['Theoretical Depth', 'Research'],
    description: 'Deep theoretical content. Introduction to research methods. Specialization begins.',
    topics: ['Differential equations', 'Molecular biology', 'Data structures', 'Research design'],
    color: '#66BB6A' },
  { id: 'grad', label: 'Graduate', ageRange: 'Ages 22+', keywords: ['Specialized', 'Research-Oriented'],
    description: 'Highly specialized content. Original research focus. Professional expertise development.',
    topics: ['Advanced algorithms', 'Thesis research', 'Grant writing', 'Publication'],
    color: '#26A69A' },
  { id: 'adult', label: 'Adult', ageRange: 'Lifelong', keywords: ['Self-Directed', 'Application-Focused'],
    description: 'Self-directed learning. Immediate practical application. Building on life experience.',
    topics: ['Professional development', 'Career skills', 'Personal finance', 'Health literacy'],
    color: '#42A5F5' }
];

let hoveredNode = null;
let selectedNode = null;
let showOverlap = false;

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 850);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Calculate node positions
  calculatePositions();
}

function calculatePositions() {
  let padding = 50;
  let nodeSpacing = (canvasWidth - padding * 2) / (gradeLevels.length - 1);

  for (let i = 0; i < gradeLevels.length; i++) {
    gradeLevels[i].x = padding + i * nodeSpacing;
    gradeLevels[i].y = drawHeight / 2 - 30;
    gradeLevels[i].radius = 35;
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
  text('Grade Level Progression', canvasWidth / 2, 25);
  textStyle(NORMAL);

  // Draw progression arrow
  drawProgressionArrow();

  // Draw connecting lines
  for (let i = 0; i < gradeLevels.length - 1; i++) {
    let node1 = gradeLevels[i];
    let node2 = gradeLevels[i + 1];

    stroke(200);
    strokeWeight(3);
    line(node1.x + node1.radius, node1.y, node2.x - node2.radius, node2.y);
  }

  // Draw nodes
  for (let node of gradeLevels) {
    drawNode(node);
  }

  // Draw tooltip for hovered node
  if (hoveredNode) {
    drawTooltip(hoveredNode);
  }

  // Draw detail panel for selected node
  if (selectedNode) {
    drawDetailPanel(selectedNode);
  }

  // Draw controls
  drawControls();
}

function drawProgressionArrow() {
  let y = drawHeight / 2 + 80;
  let startX = 50;
  let endX = canvasWidth - 50;

  // Arrow line
  stroke(180);
  strokeWeight(2);
  line(startX, y, endX - 10, y);

  // Arrow head
  fill(180);
  noStroke();
  triangle(endX, y, endX - 12, y - 6, endX - 12, y + 6);

  // Labels
  fill(120);
  textSize(11);
  text('Concrete → Abstract', canvasWidth / 2, y + 20);
  text('Guided → Self-Directed', canvasWidth / 2, y + 35);
}

function drawNode(node) {
  let isHovered = hoveredNode === node;
  let isSelected = selectedNode === node;

  push();

  // Shadow
  if (isHovered || isSelected) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = node.color;
  }

  // Node circle
  fill(node.color);
  stroke(isSelected ? '#333' : '#fff');
  strokeWeight(isSelected ? 3 : 2);
  ellipse(node.x, node.y, node.radius * 2, node.radius * 2);

  // Label
  fill(255);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  text(node.label, node.x, node.y - 5);
  textStyle(NORMAL);
  textSize(9);
  text(node.ageRange, node.x, node.y + 10);

  // Keywords below node
  fill(80);
  textSize(8);
  let keywordText = node.keywords.slice(0, 2).join(', ');
  text(keywordText, node.x, node.y + node.radius + 15);

  pop();
}

function drawTooltip(node) {
  let tooltipW = 220;
  let tooltipH = 90;
  let tooltipX = constrain(node.x, tooltipW / 2 + 10, canvasWidth - tooltipW / 2 - 10);
  let tooltipY = node.y - node.radius - tooltipH - 15;

  if (tooltipY < 50) {
    tooltipY = node.y + node.radius + 20;
  }

  push();
  // Shadow
  fill(0, 0, 0, 30);
  noStroke();
  rectMode(CENTER);
  rect(tooltipX + 3, tooltipY + tooltipH / 2 + 3, tooltipW, tooltipH, 5);

  // Background
  fill(50, 50, 50, 240);
  rect(tooltipX, tooltipY + tooltipH / 2, tooltipW, tooltipH, 5);

  // Title
  fill(255);
  textSize(12);
  textStyle(BOLD);
  text(node.label + ': ' + node.keywords.join(', '), tooltipX, tooltipY + 18);
  textStyle(NORMAL);

  // Description
  fill(220);
  textSize(10);
  textAlign(CENTER, TOP);
  textWrap(WORD);
  text(node.description, tooltipX - tooltipW / 2 + 10, tooltipY + 35, tooltipW - 20);

  textAlign(CENTER, CENTER);
  pop();
}

function drawDetailPanel(node) {
  let panelW = canvasWidth - 100;
  let panelH = 80;
  let panelX = canvasWidth / 2;
  let panelY = drawHeight - 50;

  push();
  fill(255);
  stroke(node.color);
  strokeWeight(2);
  rectMode(CENTER);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(node.color);
  textSize(14);
  textStyle(BOLD);
  text(node.label + ' Level - ' + node.ageRange, panelX, panelY - 25);
  textStyle(NORMAL);

  // Example topics
  fill(70);
  textSize(11);
  text('Example MicroSim Topics:', panelX, panelY);
  textSize(10);
  fill(100);
  text(node.topics.join('  •  '), panelX, panelY + 18);

  pop();
}

function drawControls() {
  let y = drawHeight + 30;

  // Show Overlap toggle
  fill(showOverlap ? '#2196F3' : '#9E9E9E');
  noStroke();
  rectMode(CENTER);
  rect(100, y, 140, 32, 5);
  fill(255);
  textSize(11);
  text(showOverlap ? 'Hide Overlap' : 'Show Overlapping', 100, y);

  // Instructions
  fill(100);
  textSize(10);
  text('Hover for details • Click to see topics', canvasWidth / 2 + 80, y);

  // Color legend
  textAlign(LEFT, CENTER);
  textSize(9);
  fill(80);
  text('Warm → Cool colors show progression', canvasWidth - 180, y);
  textAlign(CENTER, CENTER);
}

function mouseMoved() {
  hoveredNode = null;

  for (let node of gradeLevels) {
    let d = dist(mouseX, mouseY, node.x, node.y);
    if (d < node.radius) {
      hoveredNode = node;
      break;
    }
  }
}

function mousePressed() {
  // Check controls
  if (mouseY > drawHeight) {
    if (mouseX > 30 && mouseX < 170) {
      showOverlap = !showOverlap;
    }
    return;
  }

  // Check nodes
  for (let node of gradeLevels) {
    let d = dist(mouseX, mouseY, node.x, node.y);
    if (d < node.radius) {
      selectedNode = selectedNode === node ? null : node;
      return;
    }
  }

  // Click elsewhere clears selection
  selectedNode = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
  calculatePositions();
}
