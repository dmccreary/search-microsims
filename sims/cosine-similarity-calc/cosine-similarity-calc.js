// Cosine Similarity Calculator MicroSim
// Interactive visualization of cosine similarity between two vectors

let canvasWidth = 800;
const drawHeight = 430;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Vector state
let vectorA = { x: 0.8, y: 0.6 };
let vectorB = { x: 0.7, y: 0.7 };

// UI state
let draggingA = false;
let draggingB = false;
let showSteps = true;

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
  // Draw area background
  fill(250);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill(245);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Cosine Similarity Calculator', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Left panel: Vector visualization
  const vizX = 20;
  const vizY = 45;
  const vizSize = min(canvasWidth * 0.45, drawHeight - 60);
  drawVectorVisualization(vizX, vizY, vizSize);

  // Right panel: Calculation
  const calcX = vizX + vizSize + 30;
  const calcY = 45;
  const calcW = canvasWidth - calcX - 20;
  const calcH = drawHeight - 60;
  drawCalculation(calcX, calcY, calcW, calcH);

  // Draw controls
  drawControls();
}

function drawVectorVisualization(x, y, size) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, size, size, 4);

  // Center point
  const cx = x + size / 2;
  const cy = y + size / 2;
  const scale = size * 0.4;

  // Grid
  stroke(230);
  strokeWeight(1);
  for (let i = -1; i <= 1; i += 0.5) {
    line(cx + i * scale, y + 10, cx + i * scale, y + size - 10);
    line(x + 10, cy + i * scale, x + size - 10, cy + i * scale);
  }

  // Axes
  stroke(150);
  strokeWeight(2);
  line(cx - scale, cy, cx + scale, cy);
  line(cx, cy - scale, cx, cy + scale);

  // Axis labels
  fill(100);
  noStroke();
  textSize(10);
  text('x', cx + scale + 10, cy);
  text('y', cx, cy - scale - 10);

  // Calculate angle between vectors
  const angle = calculateAngle();

  // Draw angle arc
  if (abs(angle) > 0.01) {
    noFill();
    stroke(255, 180, 0);
    strokeWeight(2);
    const startAngle = atan2(-vectorA.y, vectorA.x);
    const endAngle = atan2(-vectorB.y, vectorB.x);
    arc(cx, cy, 50, 50, min(startAngle, endAngle), max(startAngle, endAngle));

    // Angle label
    fill(200, 120, 0);
    noStroke();
    textSize(11);
    const labelAngle = (startAngle + endAngle) / 2;
    const labelX = cx + 40 * cos(labelAngle);
    const labelY = cy + 40 * sin(labelAngle);
    text(degrees(abs(angle)).toFixed(1) + '°', labelX, labelY);
  }

  // Draw Vector A
  const axEnd = cx + vectorA.x * scale;
  const ayEnd = cy - vectorA.y * scale;
  stroke(70, 130, 180);
  strokeWeight(3);
  line(cx, cy, axEnd, ayEnd);
  drawArrowHead(axEnd, ayEnd, atan2(cy - ayEnd, axEnd - cx), color(70, 130, 180));

  // Vector A endpoint
  fill(70, 130, 180);
  noStroke();
  ellipse(axEnd, ayEnd, 14, 14);
  fill(255);
  textSize(10);
  textStyle(BOLD);
  text('A', axEnd, ayEnd);
  textStyle(NORMAL);

  // Draw Vector B
  const bxEnd = cx + vectorB.x * scale;
  const byEnd = cy - vectorB.y * scale;
  stroke(60, 179, 113);
  strokeWeight(3);
  line(cx, cy, bxEnd, byEnd);
  drawArrowHead(bxEnd, byEnd, atan2(cy - byEnd, bxEnd - cx), color(60, 179, 113));

  // Vector B endpoint
  fill(60, 179, 113);
  noStroke();
  ellipse(bxEnd, byEnd, 14, 14);
  fill(255);
  textSize(10);
  textStyle(BOLD);
  text('B', bxEnd, byEnd);
  textStyle(NORMAL);

  // Coordinate labels
  fill(70, 130, 180);
  textAlign(LEFT, TOP);
  textSize(10);
  text('A = [' + vectorA.x.toFixed(2) + ', ' + vectorA.y.toFixed(2) + ']', x + 10, y + size - 35);
  fill(60, 179, 113);
  text('B = [' + vectorB.x.toFixed(2) + ', ' + vectorB.y.toFixed(2) + ']', x + 10, y + size - 20);
  textAlign(CENTER, CENTER);
}

function drawArrowHead(x, y, angle, col) {
  push();
  translate(x, y);
  rotate(angle);
  fill(col);
  noStroke();
  triangle(0, 0, -12, -5, -12, 5);
  pop();
}

function calculateAngle() {
  const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  const magA = sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y);
  const magB = sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y);
  const cosSim = dotProduct / (magA * magB);
  return acos(constrain(cosSim, -1, 1));
}

function drawCalculation(x, y, w, h) {
  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 4);

  // Title
  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Calculation', x + 15, y + 10);
  textStyle(NORMAL);

  // Calculate values
  const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  const magA = sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y);
  const magB = sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y);
  const cosSim = dotProduct / (magA * magB);

  let yPos = y + 35;

  if (showSteps) {
    // Step 1: Dot product
    fill(70);
    textSize(10);
    textStyle(BOLD);
    text('Step 1: Dot Product', x + 15, yPos);
    textStyle(NORMAL);
    yPos += 18;

    fill(80);
    textSize(9);
    text('A · B = (' + vectorA.x.toFixed(2) + ' × ' + vectorB.x.toFixed(2) + ') + (' +
         vectorA.y.toFixed(2) + ' × ' + vectorB.y.toFixed(2) + ')', x + 20, yPos);
    yPos += 14;
    fill(50);
    text('    = ' + (vectorA.x * vectorB.x).toFixed(4) + ' + ' + (vectorA.y * vectorB.y).toFixed(4) +
         ' = ' + dotProduct.toFixed(4), x + 20, yPos);
    yPos += 25;

    // Step 2: Magnitudes
    fill(70);
    textSize(10);
    textStyle(BOLD);
    text('Step 2: Magnitudes', x + 15, yPos);
    textStyle(NORMAL);
    yPos += 18;

    fill(70, 130, 180);
    textSize(9);
    text('|A| = √(' + vectorA.x.toFixed(2) + '² + ' + vectorA.y.toFixed(2) + '²) = ' + magA.toFixed(4), x + 20, yPos);
    yPos += 14;
    fill(60, 179, 113);
    text('|B| = √(' + vectorB.x.toFixed(2) + '² + ' + vectorB.y.toFixed(2) + '²) = ' + magB.toFixed(4), x + 20, yPos);
    yPos += 25;

    // Step 3: Result
    fill(70);
    textSize(10);
    textStyle(BOLD);
    text('Step 3: Cosine Similarity', x + 15, yPos);
    textStyle(NORMAL);
    yPos += 18;

    fill(80);
    textSize(9);
    text('cos(θ) = (A · B) / (|A| × |B|)', x + 20, yPos);
    yPos += 14;
    text('       = ' + dotProduct.toFixed(4) + ' / (' + magA.toFixed(4) + ' × ' + magB.toFixed(4) + ')', x + 20, yPos);
    yPos += 14;
  }

  // Result display
  yPos = y + h - 80;
  fill(50);
  textSize(14);
  textStyle(BOLD);
  text('Cosine Similarity:', x + 15, yPos);

  // Result value with color
  yPos += 25;
  const resultColor = getSimilarityColor(cosSim);
  fill(resultColor);
  textSize(28);
  text(cosSim.toFixed(4), x + w / 2, yPos);

  // Similarity meter
  yPos += 30;
  drawSimilarityMeter(x + 15, yPos, w - 30, 15, cosSim);

  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
}

function getSimilarityColor(sim) {
  if (sim >= 0.7) return color(76, 175, 80); // Green
  if (sim >= 0.3) return color(255, 193, 7); // Yellow
  return color(244, 67, 54); // Red
}

function drawSimilarityMeter(x, y, w, h, value) {
  // Background gradient
  for (let i = 0; i < w; i++) {
    const t = i / w;
    if (t < 0.3) {
      stroke(lerpColor(color(244, 67, 54), color(255, 193, 7), t / 0.3));
    } else if (t < 0.7) {
      stroke(lerpColor(color(255, 193, 7), color(76, 175, 80), (t - 0.3) / 0.4));
    } else {
      stroke(76, 175, 80);
    }
    line(x + i, y, x + i, y + h);
  }

  // Border
  noFill();
  stroke(150);
  strokeWeight(1);
  rect(x, y, w, h, 2);

  // Indicator
  const indicatorX = x + map(constrain(value, -1, 1), -1, 1, 0, w);
  fill(50);
  noStroke();
  triangle(indicatorX - 6, y - 2, indicatorX + 6, y - 2, indicatorX, y + 4);

  // Labels
  fill(100);
  textSize(8);
  textAlign(LEFT, TOP);
  text('-1', x, y + h + 3);
  textAlign(CENTER, TOP);
  text('0', x + w / 2, y + h + 3);
  textAlign(RIGHT, TOP);
  text('1', x + w, y + h + 3);
  textAlign(CENTER, CENTER);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Preset buttons
  const presets = [
    { label: 'Identical', ax: 0.7, ay: 0.7, bx: 0.7, by: 0.7 },
    { label: 'Perpendicular', ax: 1, ay: 0, bx: 0, by: 1 },
    { label: 'Opposite', ax: 0.7, ay: 0.7, bx: -0.7, by: -0.7 },
    { label: 'Similar', ax: 0.8, ay: 0.5, bx: 0.75, by: 0.55 }
  ];

  let btnX = 20;
  for (let preset of presets) {
    fill('#2196F3');
    stroke(100);
    strokeWeight(1);
    rect(btnX, buttonY, 90, buttonH, 5);
    fill(255);
    noStroke();
    textSize(10);
    text(preset.label, btnX + 45, buttonY + buttonH / 2);
    btnX += 100;
  }

  // Toggle Steps button
  const toggleX = canvasWidth / 2 + 100;
  fill(showSteps ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(toggleX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text(showSteps ? 'Hide Steps' : 'Show Steps', toggleX + 50, buttonY + buttonH / 2);

  // Reset button
  const resetX = canvasWidth - 90;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 70, buttonH, 5);
  fill(255);
  noStroke();
  textSize(11);
  text('Reset', resetX + 35, buttonY + buttonH / 2);

  // Instructions
  fill(100);
  textSize(9);
  text('Drag vector endpoints to adjust', canvasWidth / 2, drawHeight + 58);
}

function mousePressed() {
  const vizX = 20;
  const vizY = 45;
  const vizSize = min(canvasWidth * 0.45, drawHeight - 60);
  const cx = vizX + vizSize / 2;
  const cy = vizY + vizSize / 2;
  const scale = vizSize * 0.4;

  // Check if clicking on vector endpoints
  const axEnd = cx + vectorA.x * scale;
  const ayEnd = cy - vectorA.y * scale;
  const bxEnd = cx + vectorB.x * scale;
  const byEnd = cy - vectorB.y * scale;

  if (dist(mouseX, mouseY, axEnd, ayEnd) < 15) {
    draggingA = true;
    return;
  }
  if (dist(mouseX, mouseY, bxEnd, byEnd) < 15) {
    draggingB = true;
    return;
  }

  // Check control buttons
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Preset buttons
  const presets = [
    { ax: 0.7, ay: 0.7, bx: 0.7, by: 0.7 },
    { ax: 1, ay: 0, bx: 0, by: 1 },
    { ax: 0.7, ay: 0.7, bx: -0.7, by: -0.7 },
    { ax: 0.8, ay: 0.5, bx: 0.75, by: 0.55 }
  ];

  let btnX = 20;
  for (let preset of presets) {
    if (mouseX >= btnX && mouseX <= btnX + 90 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
      vectorA = { x: preset.ax, y: preset.ay };
      vectorB = { x: preset.bx, y: preset.by };
      return;
    }
    btnX += 100;
  }

  // Toggle Steps
  const toggleX = canvasWidth / 2 + 100;
  if (mouseX >= toggleX && mouseX <= toggleX + 100 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showSteps = !showSteps;
    return;
  }

  // Reset
  const resetX = canvasWidth - 90;
  if (mouseX >= resetX && mouseX <= resetX + 70 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    vectorA = { x: 0.8, y: 0.6 };
    vectorB = { x: 0.7, y: 0.7 };
    showSteps = true;
    return;
  }
}

function mouseDragged() {
  const vizX = 20;
  const vizY = 45;
  const vizSize = min(canvasWidth * 0.45, drawHeight - 60);
  const cx = vizX + vizSize / 2;
  const cy = vizY + vizSize / 2;
  const scale = vizSize * 0.4;

  if (draggingA) {
    vectorA.x = constrain((mouseX - cx) / scale, -1, 1);
    vectorA.y = constrain((cy - mouseY) / scale, -1, 1);
  }
  if (draggingB) {
    vectorB.x = constrain((mouseX - cx) / scale, -1, 1);
    vectorB.y = constrain((cy - mouseY) / scale, -1, 1);
  }
}

function mouseReleased() {
  draggingA = false;
  draggingB = false;
}

function mouseMoved() {
  const vizX = 20;
  const vizY = 45;
  const vizSize = min(canvasWidth * 0.45, drawHeight - 60);
  const cx = vizX + vizSize / 2;
  const cy = vizY + vizSize / 2;
  const scale = vizSize * 0.4;

  const axEnd = cx + vectorA.x * scale;
  const ayEnd = cy - vectorA.y * scale;
  const bxEnd = cx + vectorB.x * scale;
  const byEnd = cy - vectorB.y * scale;

  if (dist(mouseX, mouseY, axEnd, ayEnd) < 15 || dist(mouseX, mouseY, bxEnd, byEnd) < 15) {
    cursor(HAND);
    return;
  }

  const buttonY = drawHeight + 18;
  if (mouseY >= buttonY && mouseY <= buttonY + 32) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
