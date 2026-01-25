// Difficulty Level Progression MicroSim
// Compares beginner vs intermediate pendulum simulations side by side
// Shows how the same concept can be presented at different difficulty levels
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// Pendulum physics
let beginnerAngle, beginnerAngularVel;
let intermediateAngle, intermediateAngularVel;
let pendulumLength = 1.0; // meters
let gravity = 9.8; // m/s^2

// Animation control
let isRunning = true;
let mouseOverCanvas = false;

// UI elements
let lengthSlider, gravitySlider;
let startButton, resetButton, syncButton;

// Display mode: 0=both, 1=beginner only, 2=intermediate only
let displayMode = 0;
let modeButtons = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Track mouse for animation control
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  textSize(defaultTextSize);

  // Initialize pendulums
  resetPendulums();

  // Row 1: Mode toggle buttons
  let buttonY = drawHeight + 10;

  // Create mode buttons
  let modes = ['Both', 'Beginner', 'Intermediate'];
  for (let i = 0; i < 3; i++) {
    let btn = createButton(modes[i]);
    btn.position(10 + i * 80, buttonY);
    btn.mousePressed(() => setDisplayMode(i));
    modeButtons.push(btn);
  }

  // Start/Pause and Reset buttons
  startButton = createButton('Pause');
  startButton.position(canvasWidth - 140, buttonY);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(canvasWidth - 70, buttonY);
  resetButton.mousePressed(resetPendulums);

  // Row 2: Length slider (affects both)
  let row2Y = drawHeight + 45;
  lengthSlider = createSlider(0.5, 2.0, 1.0, 0.1);
  lengthSlider.position(sliderLeftMargin, row2Y);
  lengthSlider.size((canvasWidth / 2) - sliderLeftMargin - 20);

  // Row 2: Gravity slider (intermediate only)
  gravitySlider = createSlider(1, 20, 9.8, 0.1);
  gravitySlider.position(canvasWidth / 2 + sliderLeftMargin - 30, row2Y);
  gravitySlider.size((canvasWidth / 2) - sliderLeftMargin - 10);

  // Row 3: Sync button
  syncButton = createButton('Sync Length');
  syncButton.position(canvasWidth / 2 - 45, drawHeight + 75);
  syncButton.mousePressed(syncLength);

  describe('Side-by-side comparison of beginner and intermediate pendulum simulations showing different levels of control complexity', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Get slider values
  pendulumLength = lengthSlider.value();
  gravity = gravitySlider.value();

  // Update physics when running and mouse is over
  if (isRunning && mouseOverCanvas) {
    updatePendulums();
  }

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Difficulty Level Progression', canvasWidth / 2, 8);

  // Draw divider line
  stroke(200);
  strokeWeight(1);
  line(canvasWidth / 2, 35, canvasWidth / 2, drawHeight - 10);

  // Calculate panel widths based on display mode
  let leftWidth = canvasWidth / 2;
  let rightWidth = canvasWidth / 2;

  if (displayMode === 1) {
    leftWidth = canvasWidth;
    rightWidth = 0;
  } else if (displayMode === 2) {
    leftWidth = 0;
    rightWidth = canvasWidth;
  }

  // Draw pendulums
  if (displayMode !== 2) {
    drawBeginnerPanel(leftWidth / 2, displayMode === 1 ? canvasWidth : leftWidth);
  }
  if (displayMode !== 1) {
    let offsetX = displayMode === 2 ? canvasWidth / 2 : canvasWidth / 2;
    drawIntermediatePanel(offsetX + rightWidth / 2, rightWidth);
  }

  // Draw control labels
  drawControlLabels();

  // Update button styling
  updateModeButtons();

  // Instruction text
  fill('#666');
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text('Hover to animate', canvasWidth / 2, drawHeight - 3);
}

function drawBeginnerPanel(centerX, panelWidth) {
  // Panel header
  fill(70, 130, 180);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text('BEGINNER', centerX, 35);
  textStyle(NORMAL);

  // Subtitle
  fill(100);
  textSize(11);
  text('1 control', centerX, 52);

  // Draw pendulum
  let pivotY = 100;
  let displayLength = map(pendulumLength, 0.5, 2.0, 80, 180);

  // Pendulum calculations (using only length, fixed gravity at 9.8)
  let beginnerPeriod = 2 * PI * sqrt(pendulumLength / 9.8);
  let bobX = centerX + sin(beginnerAngle) * displayLength;
  let bobY = pivotY + cos(beginnerAngle) * displayLength;

  // Draw pivot
  fill(100);
  noStroke();
  circle(centerX, pivotY, 10);

  // Draw rod
  stroke(80);
  strokeWeight(3);
  line(centerX, pivotY, bobX, bobY);

  // Draw bob
  fill(70, 130, 180);
  noStroke();
  circle(bobX, bobY, 30);

  // Period display
  fill(70, 130, 180);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('Period: ' + beginnerPeriod.toFixed(2) + 's', centerX, drawHeight - 60);

  // Control indicator
  fill(200);
  stroke(180);
  strokeWeight(1);
  rectMode(CENTER);
  rect(centerX, drawHeight - 35, panelWidth * 0.7, 20, 5);

  fill(100);
  noStroke();
  textSize(10);
  text('Length only', centerX, drawHeight - 35);

  rectMode(CORNER);
}

function drawIntermediatePanel(centerX, panelWidth) {
  // Panel header
  fill(60, 179, 113);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text('INTERMEDIATE', centerX, 35);
  textStyle(NORMAL);

  // Subtitle
  fill(100);
  textSize(11);
  text('2 controls', centerX, 52);

  // Draw pendulum
  let pivotY = 100;
  let displayLength = map(pendulumLength, 0.5, 2.0, 80, 180);

  // Pendulum calculations (using both length and variable gravity)
  let intermediatePeriod = 2 * PI * sqrt(pendulumLength / gravity);
  let bobX = centerX + sin(intermediateAngle) * displayLength;
  let bobY = pivotY + cos(intermediateAngle) * displayLength;

  // Draw pivot
  fill(100);
  noStroke();
  circle(centerX, pivotY, 10);

  // Draw rod
  stroke(80);
  strokeWeight(3);
  line(centerX, pivotY, bobX, bobY);

  // Draw bob
  fill(60, 179, 113);
  noStroke();
  circle(bobX, bobY, 30);

  // Period display
  fill(60, 179, 113);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('Period: ' + intermediatePeriod.toFixed(2) + 's', centerX, drawHeight - 60);

  // Gravity indicator
  fill(255, 200, 100);
  noStroke();
  textSize(10);
  let gravityLabel = gravity < 5 ? 'Moon' : gravity < 15 ? 'Earth' : 'Jupiter';
  text('g = ' + gravity.toFixed(1) + ' m/s² (' + gravityLabel + ')', centerX, drawHeight - 35);

  rectMode(CORNER);
}

function updatePendulums() {
  // Simple harmonic motion for small angles
  // Angular acceleration = -(g/L) * sin(angle)
  let dt = 0.05;

  // Beginner: fixed gravity at 9.8
  let beginnerAngularAcc = -(9.8 / pendulumLength) * sin(beginnerAngle);
  beginnerAngularVel += beginnerAngularAcc * dt;
  beginnerAngularVel *= 0.999; // Slight damping
  beginnerAngle += beginnerAngularVel * dt;

  // Intermediate: variable gravity
  let intermediateAngularAcc = -(gravity / pendulumLength) * sin(intermediateAngle);
  intermediateAngularVel += intermediateAngularAcc * dt;
  intermediateAngularVel *= 0.999; // Slight damping
  intermediateAngle += intermediateAngularVel * dt;
}

function resetPendulums() {
  beginnerAngle = PI / 4; // 45 degrees
  beginnerAngularVel = 0;
  intermediateAngle = PI / 4;
  intermediateAngularVel = 0;
}

function syncLength() {
  // Already synced since they share the same slider
  resetPendulums();
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function setDisplayMode(mode) {
  displayMode = mode;
  resetPendulums();
}

function updateModeButtons() {
  for (let i = 0; i < modeButtons.length; i++) {
    if (i === displayMode) {
      modeButtons[i].style('background-color', '#4a90d9');
      modeButtons[i].style('color', 'white');
    } else {
      modeButtons[i].style('background-color', '#e0e0e0');
      modeButtons[i].style('color', 'black');
    }
  }
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);

  // Row 2 labels
  let row2Y = drawHeight + 55;
  text('Length: ' + pendulumLength.toFixed(1) + 'm', 10, row2Y);
  text('Gravity: ' + gravity.toFixed(1), canvasWidth / 2 + 10, row2Y);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);

  // Reposition and resize controls
  lengthSlider.size((canvasWidth / 2) - sliderLeftMargin - 20);
  gravitySlider.position(canvasWidth / 2 + sliderLeftMargin - 30, drawHeight + 45);
  gravitySlider.size((canvasWidth / 2) - sliderLeftMargin - 10);

  startButton.position(canvasWidth - 140, drawHeight + 10);
  resetButton.position(canvasWidth - 70, drawHeight + 10);
  syncButton.position(canvasWidth / 2 - 45, drawHeight + 75);

  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
