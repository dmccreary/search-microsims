// Apply-Level Pendulum Period Calculator
// Students calculate and verify pendulum period

let canvasWidth = 800;
const drawHeight = 450;
const controlHeight = 60;

let pendulumLength = 1.0;
let gravity = 9.8;
let angle = Math.PI / 6;
let angularVelocity = 0;
let studentAnswer = '';
let feedback = '';
let feedbackColor = '#333';
let showSteps = false;

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 850);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  let container = document.getElementById('canvas-container');
  if (container) {
    canvas.parent(container);
  }
  textAlign(CENTER, CENTER);
}

function draw() {
  background(248, 249, 250);
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Apply-Level: Pendulum Period Calculator', canvasWidth / 2, 20);
  textStyle(NORMAL);

  // Update pendulum physics
  let angularAcceleration = -gravity / (pendulumLength * 100) * sin(angle);
  angularVelocity += angularAcceleration;
  angularVelocity *= 0.999;
  angle += angularVelocity;

  // Draw pendulum
  let pivotX = canvasWidth * 0.35;
  let pivotY = 80;
  let bobX = pivotX + sin(angle) * pendulumLength * 150;
  let bobY = pivotY + cos(angle) * pendulumLength * 150;

  // String
  stroke(100);
  strokeWeight(2);
  line(pivotX, pivotY, bobX, bobY);

  // Pivot
  fill(80);
  noStroke();
  ellipse(pivotX, pivotY, 12, 12);

  // Bob
  fill('#1565C0');
  stroke('#0D47A1');
  strokeWeight(2);
  ellipse(bobX, bobY, 40, 40);

  // Length dimension
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]);
  line(pivotX + 20, pivotY, pivotX + 20, pivotY + pendulumLength * 150);
  drawingContext.setLineDash([]);
  fill(100);
  textSize(11);
  text('L = ' + pendulumLength.toFixed(2) + ' m', pivotX + 50, pivotY + pendulumLength * 75);

  // Calculator panel
  let panelX = canvasWidth * 0.6;
  drawCalculatorPanel(panelX);

  // Controls
  drawControls();
}

function drawCalculatorPanel(x) {
  let panelW = canvasWidth * 0.35;
  let panelY = 50;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, panelY, panelW, 350, 8);

  // Title
  fill(70);
  textSize(13);
  textStyle(BOLD);
  text('Calculate the Period', x + panelW / 2, panelY + 20);
  textStyle(NORMAL);

  // Formula
  fill('#1565C0');
  textSize(14);
  text('T = 2π√(L/g)', x + panelW / 2, panelY + 50);

  // Parameters
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);

  text('Length (L):', x + 15, panelY + 85);
  text(pendulumLength.toFixed(2) + ' m', x + panelW - 60, panelY + 85);

  text('Gravity (g):', x + 15, panelY + 110);
  text(gravity.toFixed(1) + ' m/s²', x + panelW - 60, panelY + 110);

  // Actual period
  let actualPeriod = 2 * PI * sqrt(pendulumLength / gravity);
  text('Actual Period:', x + 15, panelY + 140);
  fill('#4CAF50');
  text(actualPeriod.toFixed(3) + ' s', x + panelW - 60, panelY + 140);

  // Input prompt
  fill(80);
  textStyle(BOLD);
  text('Your Calculation:', x + 15, panelY + 180);
  textStyle(NORMAL);

  // Input display
  fill(255);
  stroke(feedbackColor === '#4CAF50' ? '#4CAF50' : '#ccc');
  strokeWeight(2);
  rect(x + 15, panelY + 195, panelW - 30, 35, 5);

  fill(50);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(studentAnswer || 'Type your answer...', x + panelW / 2, panelY + 212);

  // Feedback
  if (feedback) {
    fill(feedbackColor);
    textSize(11);
    textWrap(WORD);
    textAlign(LEFT, TOP);
    text(feedback, x + 15, panelY + 245, panelW - 30);
    textAlign(CENTER, CENTER);
  }

  // Show steps
  if (showSteps) {
    fill(100);
    textSize(10);
    textAlign(LEFT, TOP);
    let stepsY = panelY + 290;
    text('Step 1: L/g = ' + (pendulumLength / gravity).toFixed(4), x + 15, stepsY);
    text('Step 2: √(L/g) = ' + sqrt(pendulumLength / gravity).toFixed(4), x + 15, stepsY + 15);
    text('Step 3: 2π × √(L/g) = ' + actualPeriod.toFixed(4) + ' s', x + 15, stepsY + 30);
    textAlign(CENTER, CENTER);
  }
}

function drawControls() {
  let y = drawHeight + 30;

  // Length slider
  fill(80);
  textSize(10);
  text('Length:', 60, y - 15);
  fill(200);
  rect(30, y, 100, 6, 3);
  fill('#1565C0');
  let sliderPos = map(pendulumLength, 0.2, 2.0, 30, 130);
  ellipse(sliderPos, y, 14, 14);

  // Gravity slider
  fill(80);
  text('Gravity:', 190, y - 15);
  fill(200);
  rect(160, y, 100, 6, 3);
  fill('#1565C0');
  let gSliderPos = map(gravity, 1.6, 25, 160, 260);
  ellipse(gSliderPos, y, 14, 14);

  // Check button
  fill('#4CAF50');
  noStroke();
  rectMode(CENTER);
  rect(320, y, 80, 32, 5);
  fill(255);
  textSize(11);
  text('Check', 320, y);

  // Show Steps toggle
  fill(showSteps ? '#2196F3' : '#9E9E9E');
  rect(420, y, 90, 32, 5);
  fill(255);
  text(showSteps ? 'Hide Steps' : 'Show Steps', 420, y);

  // Hint
  fill(100);
  textSize(9);
  text('Enter period in seconds (e.g., 2.01)', canvasWidth - 120, y);
}

function keyPressed() {
  if (key >= '0' && key <= '9') {
    studentAnswer += key;
  } else if (key === '.') {
    if (!studentAnswer.includes('.')) studentAnswer += '.';
  } else if (keyCode === BACKSPACE) {
    studentAnswer = studentAnswer.slice(0, -1);
  } else if (keyCode === ENTER) {
    checkAnswer();
  }
}

function checkAnswer() {
  let actualPeriod = 2 * PI * sqrt(pendulumLength / gravity);
  let studentValue = parseFloat(studentAnswer);

  if (isNaN(studentValue)) {
    feedback = 'Please enter a valid number.';
    feedbackColor = '#f44336';
    return;
  }

  let error = Math.abs(studentValue - actualPeriod) / actualPeriod * 100;

  if (error < 5) {
    feedback = '✓ Correct! Your answer is within 5% of the actual period.';
    feedbackColor = '#4CAF50';
  } else {
    feedback = '✗ Not quite. Check your calculation. Hint: T = 2π√(' + pendulumLength.toFixed(2) + '/' + gravity.toFixed(1) + ')';
    feedbackColor = '#f44336';
  }
}

function mousePressed() {
  if (mouseY > drawHeight) {
    // Length slider
    if (mouseX > 30 && mouseX < 130) {
      pendulumLength = map(mouseX, 30, 130, 0.2, 2.0);
      feedback = '';
    }
    // Gravity slider
    if (mouseX > 160 && mouseX < 260) {
      gravity = map(mouseX, 160, 260, 1.6, 25);
      feedback = '';
    }
    // Check button
    if (mouseX > 280 && mouseX < 360) {
      checkAnswer();
    }
    // Show steps toggle
    if (mouseX > 375 && mouseX < 465) {
      showSteps = !showSteps;
    }
  }
}

function mouseDragged() {
  if (mouseY > drawHeight) {
    if (mouseX > 30 && mouseX < 130) {
      pendulumLength = constrain(map(mouseX, 30, 130, 0.2, 2.0), 0.2, 2.0);
    }
    if (mouseX > 160 && mouseX < 260) {
      gravity = constrain(map(mouseX, 160, 260, 1.6, 25), 1.6, 25);
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
