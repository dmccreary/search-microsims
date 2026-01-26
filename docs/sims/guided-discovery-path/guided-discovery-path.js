// Guided Discovery Learning Path
// Interactive workflow showing structured exploration steps

let canvasWidth = 850;
const drawHeight = 400;
const controlHeight = 80;

const steps = [
  { name: 'Pose Question', icon: '?', color: '#3498db',
    hover: 'What affects how fast a pendulum swings?',
    detail: 'Start with a clear, focused question that guides exploration.' },
  { name: 'Constrain Variables', icon: '⚙', color: '#5dade2',
    hover: 'Focus on length only - mass and amplitude are locked',
    detail: 'Limit variables to prevent confusion and focus discovery.' },
  { name: 'Explore Freely', icon: '▶', color: '#48c9b0',
    hover: 'Change the length slider and watch what happens',
    detail: 'Allow hands-on exploration within the constrained space.' },
  { name: 'Prompt Observation', icon: '👁', color: '#52be80',
    hover: 'What pattern do you notice? Longer means...',
    detail: 'Guide attention to key patterns without giving answers.' },
  { name: 'Form Hypothesis', icon: '💡', color: '#f4d03f',
    hover: 'Complete: I think longer pendulums swing [slower/faster]',
    detail: 'Encourage explicit prediction to deepen engagement.' },
  { name: 'Test Prediction', icon: '🧪', color: '#f5b041',
    hover: 'Try extreme values - very short and very long',
    detail: 'Systematic testing builds confidence in the discovery.' },
  { name: 'Confirm Discovery', icon: '✓', color: '#58d68d',
    hover: 'You discovered it! Longer = slower period',
    detail: 'Validate the student\'s insight with positive feedback.' },
  { name: 'Connect to Theory', icon: '📐', color: '#27ae60',
    hover: 'This relationship follows T = 2π√(L/g)',
    detail: 'Link experiential discovery to formal knowledge.' },
  { name: 'Transfer', icon: '↗', color: '#1e8449',
    hover: 'Apply this to predict: a 4m pendulum vs 1m...',
    detail: 'Apply the concept to new contexts to build transfer.' }
];

let currentStep = 0;
let animationProgress = 0;
let showComparison = false;
let hoveredStep = -1;

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

  // Control area background
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Guided Discovery Learning Path', canvasWidth / 2, 20);
  textStyle(NORMAL);

  drawPath();
  drawDetailPanel();
  drawControls();

  // Animate
  animationProgress = min(animationProgress + 0.02, 1);
}

function drawPath() {
  let pathY = 200;
  let startX = 50;
  let endX = canvasWidth - 50;
  let stepWidth = (endX - startX) / (steps.length - 1);

  // Draw connecting line (gradient)
  strokeWeight(4);
  for (let i = 0; i < steps.length - 1; i++) {
    let x1 = startX + i * stepWidth;
    let x2 = startX + (i + 1) * stepWidth;
    let col1 = color(steps[i].color);
    let col2 = color(steps[i + 1].color);

    for (let j = 0; j < 20; j++) {
      let t = j / 20;
      stroke(lerpColor(col1, col2, t));
      let px1 = lerp(x1, x2, t);
      let px2 = lerp(x1, x2, t + 0.05);
      line(px1, pathY, px2, pathY);
    }
  }

  // Draw step nodes
  for (let i = 0; i < steps.length; i++) {
    let x = startX + i * stepWidth;
    let step = steps[i];
    let isCompleted = i < currentStep;
    let isCurrent = i === currentStep;
    let isHovered = i === hoveredStep;

    // Node circle
    let nodeSize = isCurrent ? 50 : isHovered ? 45 : 40;

    if (isCompleted || isCurrent) {
      // Glow effect for current
      if (isCurrent) {
        noStroke();
        fill(color(step.color + '40'));
        ellipse(x, pathY, nodeSize + 20, nodeSize + 20);
      }

      fill(step.color);
    } else {
      fill(255);
      stroke(step.color);
      strokeWeight(2);
    }

    ellipse(x, pathY, nodeSize, nodeSize);

    // Icon
    fill(isCompleted || isCurrent ? 255 : step.color);
    noStroke();
    textSize(isCurrent ? 20 : 16);
    text(step.icon, x, pathY);

    // Label below
    fill(70);
    textSize(10);
    textStyle(isCurrent ? BOLD : NORMAL);

    // Split long names
    let words = step.name.split(' ');
    if (words.length > 1) {
      text(words[0], x, pathY + 35);
      text(words.slice(1).join(' '), x, pathY + 47);
    } else {
      text(step.name, x, pathY + 40);
    }
    textStyle(NORMAL);

    // Step number
    textSize(8);
    fill(150);
    text(i + 1, x, pathY - 30);
  }

  // Progress arrow
  if (currentStep < steps.length - 1) {
    let arrowX = startX + currentStep * stepWidth + 25;
    fill(steps[currentStep].color);
    noStroke();
    triangle(arrowX, pathY - 5, arrowX, pathY + 5, arrowX + 10, pathY);
  }
}

function drawDetailPanel() {
  let panelX = 50;
  let panelY = 280;
  let panelW = canvasWidth - 100;
  let panelH = 100;

  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  let step = steps[currentStep];

  // Header
  fill(step.color);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Step ' + (currentStep + 1) + ': ' + step.name, panelX + 15, panelY + 20);
  textStyle(NORMAL);

  // Hover text (guidance example)
  fill(70);
  textSize(12);
  text('Example: "' + step.hover + '"', panelX + 15, panelY + 45);

  // Detail
  fill(100);
  textSize(11);
  text(step.detail, panelX + 15, panelY + 70);

  textAlign(CENTER, CENTER);

  // Pure discovery comparison
  if (showComparison) {
    let compX = panelX + panelW - 200;
    fill(255, 245, 238);
    stroke(255, 160, 122);
    rect(compX, panelY + 10, 190, panelH - 20, 5);

    fill(255, 99, 71);
    textSize(10);
    textStyle(BOLD);
    text('Without This Step', compX + 95, panelY + 25);
    textStyle(NORMAL);

    fill(100);
    textSize(9);
    textAlign(LEFT, CENTER);
    let warnings = [
      'Students may never discover the concept',
      'Risk of forming misconceptions',
      'Wasted cognitive resources',
      'Frustration and disengagement'
    ];
    text(warnings[currentStep % warnings.length], compX + 10, panelY + 50);
    textAlign(CENTER, CENTER);
  }
}

function drawControls() {
  let y = drawHeight + 40;

  // Navigation buttons
  // Previous
  let prevEnabled = currentStep > 0;
  fill(prevEnabled ? color(100, 149, 237) : color(200));
  noStroke();
  rect(50, y - 15, 80, 30, 5);
  fill(255);
  textSize(12);
  text('◀ Previous', 90, y);

  // Next
  let nextEnabled = currentStep < steps.length - 1;
  fill(nextEnabled ? color(100, 149, 237) : color(200));
  rect(150, y - 15, 80, 30, 5);
  fill(255);
  text('Next ▶', 190, y);

  // Step indicator
  fill(50);
  textSize(11);
  text('Step ' + (currentStep + 1) + ' of ' + steps.length, 280, y);

  // Comparison toggle
  fill(showComparison ? color(255, 99, 71) : color(150));
  rect(380, y - 15, 150, 30, 5);
  fill(255);
  textSize(11);
  text(showComparison ? 'Hide Comparison' : 'Show Pure Discovery', 455, y);

  // Auto-play button
  fill(color(46, 204, 113));
  rect(550, y - 15, 80, 30, 5);
  fill(255);
  text('Auto-play', 590, y);

  // Reset button
  fill(color(231, 76, 60));
  rect(650, y - 15, 60, 30, 5);
  fill(255);
  text('Reset', 680, y);
}

function mousePressed() {
  let y = drawHeight + 40;

  // Previous button
  if (mouseX > 50 && mouseX < 130 && mouseY > y - 15 && mouseY < y + 15) {
    if (currentStep > 0) currentStep--;
  }

  // Next button
  if (mouseX > 150 && mouseX < 230 && mouseY > y - 15 && mouseY < y + 15) {
    if (currentStep < steps.length - 1) currentStep++;
  }

  // Comparison toggle
  if (mouseX > 380 && mouseX < 530 && mouseY > y - 15 && mouseY < y + 15) {
    showComparison = !showComparison;
  }

  // Auto-play (advance every 2 seconds)
  if (mouseX > 550 && mouseX < 630 && mouseY > y - 15 && mouseY < y + 15) {
    autoPlay();
  }

  // Reset
  if (mouseX > 650 && mouseX < 710 && mouseY > y - 15 && mouseY < y + 15) {
    currentStep = 0;
  }

  // Click on path nodes
  let pathY = 200;
  let startX = 50;
  let endX = canvasWidth - 50;
  let stepWidth = (endX - startX) / (steps.length - 1);

  for (let i = 0; i < steps.length; i++) {
    let x = startX + i * stepWidth;
    if (dist(mouseX, mouseY, x, pathY) < 25) {
      currentStep = i;
    }
  }
}

function mouseMoved() {
  let pathY = 200;
  let startX = 50;
  let endX = canvasWidth - 50;
  let stepWidth = (endX - startX) / (steps.length - 1);

  hoveredStep = -1;
  for (let i = 0; i < steps.length; i++) {
    let x = startX + i * stepWidth;
    if (dist(mouseX, mouseY, x, pathY) < 25) {
      hoveredStep = i;
    }
  }
}

function autoPlay() {
  let interval = setInterval(() => {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      clearInterval(interval);
    }
  }, 2000);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
