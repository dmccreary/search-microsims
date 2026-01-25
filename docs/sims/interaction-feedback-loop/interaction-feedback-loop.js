// Interaction Feedback Loop Diagram
// Shows the cognitive feedback cycle in interactive learning
// Components: Student, MicroSim Interface, Brain Processing with animated flow
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Animation variables
let pulsePhase = 0;
let flowPhase = 0;
let activeStep = 0;
let mouseOverCanvas = false;

// Speed slider
let speedSlider;
let animationSpeed = 1;

// Component positions (will be calculated based on canvas width)
let studentPos, microsimPos, brainPos;
let componentWidth = 100;
let componentHeight = 70;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Track mouse for animation control
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  textSize(defaultTextSize);

  speedSlider = createSlider(0.2, 3, 1, 0.1);
  speedSlider.position(sliderLeftMargin, drawHeight + 12);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Animated diagram showing the cognitive feedback loop: Student adjusts parameters, MicroSim updates, Student observes, Brain processes, cycle repeats', LABEL);
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

  animationSpeed = speedSlider.value();

  // Update animation when mouse is over canvas
  if (mouseOverCanvas) {
    pulsePhase += 0.03 * animationSpeed;
    flowPhase += 0.02 * animationSpeed;

    // Cycle through 5 steps
    if (flowPhase > TWO_PI) {
      flowPhase = 0;
      activeStep = (activeStep + 1) % 5;
    }
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Interaction Feedback Loop', canvasWidth / 2, 10);

  // Calculate component positions based on canvas width
  let centerX = canvasWidth / 2;
  let centerY = drawHeight / 2 + 10;
  let radius = canvasWidth * 0.28;

  // Position components in a triangle
  studentPos = { x: centerX - radius, y: centerY + 40 };
  microsimPos = { x: centerX, y: centerY - 80 };
  brainPos = { x: centerX + radius, y: centerY + 40 };

  // Draw flow arrows first (behind components)
  drawFlowArrows();

  // Draw components
  drawStudent(studentPos.x, studentPos.y);
  drawMicroSim(microsimPos.x, microsimPos.y);
  drawBrain(brainPos.x, brainPos.y);

  // Draw step labels
  drawStepLabels();

  // Draw control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Speed: ' + animationSpeed.toFixed(1) + 'x', 10, drawHeight + 25);

  // Instruction text
  textAlign(CENTER, BOTTOM);
  textSize(12);
  fill('#666');
  text('Hover to animate the learning cycle', canvasWidth / 2, drawHeight - 8);
}

function drawStudent(x, y) {
  let pulse = activeStep === 0 || activeStep === 4 ? sin(pulsePhase * 3) * 5 : 0;
  let w = componentWidth + pulse;
  let h = componentHeight + pulse;

  // Background
  let alpha = activeStep === 0 || activeStep === 4 ? 255 : 200;
  fill(70, 130, 180, alpha); // Steel blue for student
  stroke(50, 100, 150);
  strokeWeight(2);
  rectMode(CENTER);
  rect(x, y, w, h, 10);

  // Person icon
  fill('white');
  noStroke();
  let iconY = y - 10;
  circle(x, iconY - 12, 18); // Head

  // Body
  stroke('white');
  strokeWeight(3);
  line(x, iconY - 2, x, iconY + 15); // Body
  line(x - 10, iconY + 5, x + 10, iconY + 5); // Arms
  line(x, iconY + 15, x - 8, iconY + 25); // Left leg
  line(x, iconY + 15, x + 8, iconY + 25); // Right leg

  // Label
  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(11);
  text('STUDENT', x, y + h/2 - 12);

  rectMode(CORNER);
}

function drawMicroSim(x, y) {
  let pulse = activeStep === 1 || activeStep === 2 ? sin(pulsePhase * 3) * 5 : 0;
  let w = componentWidth + 20 + pulse;
  let h = componentHeight + pulse;

  // Background
  let alpha = activeStep === 1 || activeStep === 2 ? 255 : 200;
  fill(60, 179, 113, alpha); // Medium sea green for MicroSim
  stroke(46, 139, 87);
  strokeWeight(2);
  rectMode(CENTER);
  rect(x, y, w, h, 10);

  // Interface visualization
  fill(255, 255, 255, 200);
  noStroke();
  let boxY = y - 5;
  rect(x, boxY, w - 30, 30, 5); // Display area

  // Mini slider
  fill(200);
  rect(x, boxY + 20, w - 40, 6, 3);
  fill(46, 139, 87);
  circle(x + (sin(pulsePhase) * 15), boxY + 20, 10);

  // Mini visualization (bar chart)
  fill(46, 139, 87);
  let barW = 6;
  for (let i = -2; i <= 2; i++) {
    let barH = 8 + sin(pulsePhase + i) * 5;
    rect(x + i * 10, boxY - 5, barW, barH, 2);
  }

  // Label
  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(11);
  text('MICROSIM', x, y + h/2 - 12);

  rectMode(CORNER);
}

function drawBrain(x, y) {
  let pulse = activeStep === 3 ? sin(pulsePhase * 3) * 5 : 0;
  let w = componentWidth + pulse;
  let h = componentHeight + pulse;

  // Background (thought bubble style)
  let alpha = activeStep === 3 ? 255 : 200;
  fill(255, 165, 0, alpha); // Orange for brain/processing
  stroke(220, 140, 0);
  strokeWeight(2);
  rectMode(CENTER);
  rect(x, y, w, h, 10);

  // Gear icons for processing
  noFill();
  stroke('white');
  strokeWeight(2);

  // Large gear
  push();
  translate(x - 12, y - 5);
  rotate(pulsePhase);
  drawGear(0, 0, 15, 6);
  pop();

  // Small gear
  push();
  translate(x + 12, y);
  rotate(-pulsePhase * 1.5);
  drawGear(0, 0, 10, 5);
  pop();

  // Label
  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(11);
  text('BRAIN', x, y + h/2 - 12);

  rectMode(CORNER);
}

function drawGear(x, y, radius, teeth) {
  beginShape();
  for (let i = 0; i < teeth * 2; i++) {
    let angle = map(i, 0, teeth * 2, 0, TWO_PI);
    let r = i % 2 === 0 ? radius : radius * 0.7;
    vertex(x + cos(angle) * r, y + sin(angle) * r);
  }
  endShape(CLOSE);
  circle(x, y, radius * 0.4);
}

function drawFlowArrows() {
  strokeWeight(3);

  // Arrow 1: Student -> MicroSim (adjusts parameter)
  let arrowAlpha1 = activeStep === 0 ? 255 : 120;
  let color1 = color(70, 130, 180, arrowAlpha1);
  stroke(color1);
  drawCurvedArrow(
    studentPos.x + 40, studentPos.y - 25,
    microsimPos.x - 50, microsimPos.y + 25,
    -30, color1
  );

  // Arrow 2: MicroSim internal (updates visualization)
  let arrowAlpha2 = activeStep === 1 ? 255 : 120;
  let color2 = color(60, 179, 113, arrowAlpha2);
  stroke(color2);
  // Small circular arrow inside MicroSim (shown as pulsing)
  if (activeStep === 1) {
    noFill();
    arc(microsimPos.x + 35, microsimPos.y, 20, 20, -PI/2, PI);
    drawArrowHead(microsimPos.x + 35, microsimPos.y + 10, PI/2, color2);
  }

  // Arrow 3: MicroSim -> Brain (observes change)
  let arrowAlpha3 = activeStep === 2 ? 255 : 120;
  let color3 = color(60, 179, 113, arrowAlpha3);
  stroke(color3);
  drawCurvedArrow(
    microsimPos.x + 50, microsimPos.y + 25,
    brainPos.x - 40, brainPos.y - 25,
    -30, color3
  );

  // Arrow 4: Brain processes (internal)
  let arrowAlpha4 = activeStep === 3 ? 255 : 120;
  let color4 = color(255, 165, 0, arrowAlpha4);
  stroke(color4);
  // Shown via gear rotation

  // Arrow 5: Brain -> Student (tests new idea)
  let arrowAlpha5 = activeStep === 4 ? 255 : 120;
  let color5 = color(255, 165, 0, arrowAlpha5);
  stroke(color5);
  drawCurvedArrow(
    brainPos.x - 10, brainPos.y + 35,
    studentPos.x + 10, studentPos.y + 35,
    40, color5
  );
}

function drawCurvedArrow(x1, y1, x2, y2, curvature, arrowColor) {
  noFill();

  // Control point
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2 + curvature;

  // Draw curve
  beginShape();
  vertex(x1, y1);
  quadraticVertex(midX, midY, x2, y2);
  endShape();

  // Arrow head
  let angle = atan2(y2 - midY, x2 - midX);
  drawArrowHead(x2, y2, angle, arrowColor);
}

function drawArrowHead(x, y, angle, arrowColor) {
  push();
  translate(x, y);
  rotate(angle);
  fill(arrowColor);
  noStroke();
  triangle(0, 0, -10, -5, -10, 5);
  pop();
}

function drawStepLabels() {
  textSize(14);
  noStroke();

  // Step descriptions - positioned 40px further from center to avoid overlapping edges
  let steps = [
    { text: '1. Adjusts\nparameter', x: studentPos.x - 70, y: microsimPos.y + 20, color: [70, 130, 180] },
    { text: '2. Updates\nvisualization', x: microsimPos.x + 95, y: microsimPos.y - 15, color: [60, 179, 113] },
    { text: '3. Observes\nchange', x: brainPos.x + 50, y: brainPos.y - 70, color: [60, 179, 113] },
    { text: '4. Forms\nhypothesis', x: brainPos.x + 85, y: brainPos.y + 10, color: [255, 165, 0] },
    { text: '5. Tests\nnew idea', x: (studentPos.x + brainPos.x) / 2, y: studentPos.y + 100, color: [255, 165, 0] }
  ];

  for (let i = 0; i < steps.length; i++) {
    let s = steps[i];
    let alpha = activeStep === i ? 255 : 150;
    fill(s.color[0], s.color[1], s.color[2], alpha);
    textAlign(CENTER, CENTER);
    text(s.text, s.x, s.y);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = container.width;
  canvasWidth = containerWidth;
}
