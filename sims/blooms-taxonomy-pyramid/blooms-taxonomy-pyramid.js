// Bloom's Taxonomy Pyramid - Interactive Visualization
// Shows the six cognitive levels with verbs and examples

let canvasWidth = 800;
const drawHeight = 470;
const controlHeight = 60;

// Bloom's levels (bottom to top)
const levels = [
  { name: 'Remember', abbrev: 'L1', color: '#E57373',
    description: 'Recall facts and basic concepts',
    verbs: ['list', 'define', 'recall', 'identify', 'name', 'recognize', 'locate', 'describe', 'match', 'label'],
    example: 'Identify the six levels of Bloom\'s Taxonomy',
    microsimType: 'Flash Cards, Matching Pairs, Label Diagram' },
  { name: 'Understand', abbrev: 'L2', color: '#FFB74D',
    description: 'Explain ideas and concepts',
    verbs: ['explain', 'summarize', 'interpret', 'classify', 'compare', 'contrast', 'exemplify', 'infer', 'paraphrase'],
    example: 'Explain how changing pendulum length affects period',
    microsimType: 'Concept Matcher, Predict Output, Analogy Builder' },
  { name: 'Apply', abbrev: 'L3', color: '#FFF176',
    description: 'Use information in new situations',
    verbs: ['use', 'execute', 'implement', 'solve', 'demonstrate', 'calculate', 'apply', 'practice', 'construct'],
    example: 'Calculate the period of a pendulum given length',
    microsimType: 'Parameter Explorer, Interactive Calculator' },
  { name: 'Analyze', abbrev: 'L4', color: '#AED581',
    description: 'Draw connections among ideas',
    verbs: ['differentiate', 'organize', 'attribute', 'compare', 'contrast', 'examine', 'deconstruct', 'distinguish'],
    example: 'Compare periods of pendulums with different lengths',
    microsimType: 'Network Explorer, Data Pattern Finder' },
  { name: 'Evaluate', abbrev: 'L5', color: '#81C784',
    description: 'Justify decisions or positions',
    verbs: ['judge', 'critique', 'assess', 'justify', 'prioritize', 'recommend', 'validate', 'defend', 'evaluate'],
    example: 'Assess whether a simulation accurately models physics',
    microsimType: 'Error Detector, Ranking Ladder, Rubric Rater' },
  { name: 'Create', abbrev: 'L6', color: '#64B5F6',
    description: 'Produce new or original work',
    verbs: ['design', 'construct', 'develop', 'formulate', 'compose', 'produce', 'invent', 'generate'],
    example: 'Design a pendulum system with a specific target period',
    microsimType: 'Model Builder, Algorithm Designer, Synthesis Canvas' }
];

let hoveredLevel = null;
let selectedLevel = null;
let showMicrosims = false;

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 850);
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
  textSize(18);
  textStyle(BOLD);
  text("Bloom's Taxonomy Pyramid", canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Draw pyramid
  drawPyramid();

  // Draw LOTS/HOTS labels
  drawThinkingLabels();

  // Draw hover panel
  if (hoveredLevel !== null) {
    drawHoverPanel(hoveredLevel);
  }

  // Controls
  drawControls();
}

function drawPyramid() {
  let pyramidTop = 55;
  let pyramidBottom = 380;
  let pyramidHeight = pyramidBottom - pyramidTop;
  let levelHeight = pyramidHeight / levels.length;

  let maxWidth = canvasWidth * 0.55;
  let minWidth = 100;
  let centerX = canvasWidth / 2 - 50;

  for (let i = levels.length - 1; i >= 0; i--) {
    let level = levels[i];
    let y = pyramidTop + (levels.length - 1 - i) * levelHeight;

    // Calculate widths (wider at bottom)
    let topRatio = (levels.length - 1 - i) / levels.length;
    let bottomRatio = (levels.length - i) / levels.length;
    let topWidth = minWidth + (maxWidth - minWidth) * topRatio;
    let bottomWidth = minWidth + (maxWidth - minWidth) * bottomRatio;

    // Draw trapezoid
    let isHovered = hoveredLevel === i;
    fill(level.color);
    stroke(isHovered ? '#333' : '#fff');
    strokeWeight(isHovered ? 3 : 2);

    beginShape();
    vertex(centerX - topWidth / 2, y);
    vertex(centerX + topWidth / 2, y);
    vertex(centerX + bottomWidth / 2, y + levelHeight);
    vertex(centerX - bottomWidth / 2, y + levelHeight);
    endShape(CLOSE);

    // Level name
    fill(i < 3 ? 50 : 255);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    text(level.name, centerX, y + levelHeight / 2 - 8);
    textStyle(NORMAL);
    textSize(10);
    text(level.abbrev + ': ' + level.description, centerX, y + levelHeight / 2 + 8);

    // Store bounds for hover detection
    level.bounds = { y: y, height: levelHeight };
  }
}

function drawThinkingLabels() {
  let centerX = canvasWidth / 2 - 50;
  let arrowX = centerX + canvasWidth * 0.55 / 2 + 40;

  // HOTS label (top)
  fill(100);
  textSize(11);
  textStyle(BOLD);
  push();
  translate(arrowX + 30, 120);
  rotate(-PI / 2);
  text('HOTS', 0, 0);
  pop();
  textStyle(NORMAL);
  textSize(9);
  text('Higher-Order', arrowX + 30, 165);
  text('Thinking', arrowX + 30, 177);

  // LOTS label (bottom)
  textStyle(BOLD);
  textSize(11);
  push();
  translate(arrowX + 30, 320);
  rotate(-PI / 2);
  text('LOTS', 0, 0);
  pop();
  textStyle(NORMAL);
  textSize(9);
  text('Lower-Order', arrowX + 30, 275);
  text('Thinking', arrowX + 30, 287);

  // Arrow
  stroke(150);
  strokeWeight(2);
  line(arrowX, 350, arrowX, 80);
  fill(150);
  noStroke();
  triangle(arrowX, 70, arrowX - 6, 85, arrowX + 6, 85);

  // Note
  fill(120);
  textSize(9);
  text('Foundation', arrowX + 30, 355);
  text('↓', arrowX + 30, 367);
}

function drawHoverPanel(levelIndex) {
  let level = levels[levelIndex];
  let panelW = 280;
  let panelH = showMicrosims ? 180 : 140;
  let panelX = canvasWidth - panelW / 2 - 30;
  let panelY = 150;

  push();
  fill(255);
  stroke(level.color);
  strokeWeight(2);
  rectMode(CENTER);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(level.color);
  rectMode(CORNER);
  noStroke();
  rect(panelX - panelW / 2, panelY - panelH / 2, panelW, 30, 8, 8, 0, 0);

  fill(levelIndex < 3 ? 50 : 255);
  textSize(13);
  textStyle(BOLD);
  text(level.name + ' (' + level.abbrev + ')', panelX, panelY - panelH / 2 + 15);
  textStyle(NORMAL);

  // Verbs
  fill(70);
  textSize(10);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Key Verbs:', panelX - panelW / 2 + 15, panelY - panelH / 2 + 40);
  textStyle(NORMAL);
  textWrap(WORD);
  text(level.verbs.join(', '), panelX - panelW / 2 + 15, panelY - panelH / 2 + 55, panelW - 30);

  // Example
  textStyle(BOLD);
  text('Example:', panelX - panelW / 2 + 15, panelY - panelH / 2 + 85);
  textStyle(NORMAL);
  fill(100);
  text(level.example, panelX - panelW / 2 + 15, panelY - panelH / 2 + 100, panelW - 30);

  // MicroSim types
  if (showMicrosims) {
    fill(70);
    textStyle(BOLD);
    text('MicroSim Types:', panelX - panelW / 2 + 15, panelY - panelH / 2 + 135);
    textStyle(NORMAL);
    fill(level.color);
    text(level.microsimType, panelX - panelW / 2 + 15, panelY - panelH / 2 + 150, panelW - 30);
  }

  textAlign(CENTER, CENTER);
  pop();
}

function drawControls() {
  let y = drawHeight + 30;

  // Show MicroSims toggle
  fill(showMicrosims ? '#2196F3' : '#9E9E9E');
  noStroke();
  rectMode(CENTER);
  rect(100, y, 140, 32, 5);
  fill(255);
  textSize(11);
  text(showMicrosims ? 'Hide MicroSims' : 'Show MicroSim Types', 100, y);

  // Instructions
  fill(100);
  textSize(10);
  text('Hover over pyramid levels for details', canvasWidth / 2 + 100, y);
}

function mouseMoved() {
  hoveredLevel = null;

  let centerX = canvasWidth / 2 - 50;

  for (let i = 0; i < levels.length; i++) {
    let level = levels[i];
    if (level.bounds && mouseY >= level.bounds.y && mouseY < level.bounds.y + level.bounds.height) {
      // Check if within pyramid width at this y
      if (mouseX > centerX - canvasWidth * 0.35 && mouseX < centerX + canvasWidth * 0.35) {
        hoveredLevel = i;
        break;
      }
    }
  }
}

function mousePressed() {
  if (mouseY > drawHeight && mouseX > 30 && mouseX < 170) {
    showMicrosims = !showMicrosims;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
