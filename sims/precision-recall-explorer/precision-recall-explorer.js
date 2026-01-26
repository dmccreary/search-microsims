// Precision-Recall Trade-off Explorer MicroSim
// Interactive Venn diagram showing precision and recall metrics

let canvasWidth = 800;
const drawHeight = 450;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Parameters
let specificity = 5; // 1-10 scale
let totalDocs = 100;
let relevantDocs = 25;
let retrievedDocs = 20;
let truePositives = 15;

// Derived metrics
let precision = 0;
let recall = 0;
let f1Score = 0;

// UI elements
let specificitySlider;
let showFormulas = true;
let animateDocs = false;

// Document particles
let particles = [];
const particleCount = 50;

// Venn diagram parameters
let vennCenterX, vennCenterY;
const vennRadius = 100;
const vennOverlap = 60;

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
  vennCenterX = canvasWidth * 0.35;
  vennCenterY = drawHeight / 2 - 20;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Create slider
  specificitySlider = createSlider(1, 10, 5, 0.1);
  specificitySlider.parent('canvas-container');
  specificitySlider.style('width', '150px');
  specificitySlider.position(canvasWidth * 0.7 - 75, drawHeight - 120);

  // Initialize particles
  initParticles();
  updateMetrics();
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(canvasWidth * 0.1, canvasWidth * 0.6),
      y: random(100, drawHeight - 100),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      type: '' // Will be assigned based on position
    });
  }
}

function updateMetrics() {
  specificity = specificitySlider.value();

  // Map specificity to retrieval behavior
  // Higher specificity = higher precision, lower recall
  const t = (specificity - 1) / 9; // 0 to 1

  // Calculate metrics based on specificity
  // Low specificity: retrieve more, lower precision
  // High specificity: retrieve less, higher precision
  retrievedDocs = floor(map(specificity, 1, 10, 40, 8));
  truePositives = floor(map(specificity, 1, 10, 20, 7));

  // Constrain true positives
  truePositives = constrain(truePositives, 1, min(retrievedDocs, relevantDocs));

  // Calculate precision and recall
  precision = truePositives / retrievedDocs;
  recall = truePositives / relevantDocs;

  // F1 Score (harmonic mean)
  if (precision + recall > 0) {
    f1Score = 2 * (precision * recall) / (precision + recall);
  } else {
    f1Score = 0;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  specificitySlider.position(canvasWidth * 0.7 - 75, drawHeight - 120);
}

function draw() {
  updateMetrics();

  // Draw area background
  fill(250);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill(245);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(18);
  textStyle(BOLD);
  text('Precision-Recall Trade-off Explorer', canvasWidth / 2, 25);
  textStyle(NORMAL);

  // Draw Venn diagram
  drawVennDiagram();

  // Draw metrics panel
  drawMetricsPanel();

  // Draw controls
  drawControls();

  // Update particles if animating
  if (animateDocs) {
    updateParticles();
  }
}

function drawVennDiagram() {
  const cx = vennCenterX;
  const cy = vennCenterY;

  // Calculate circle positions based on metrics
  const overlapFactor = map(truePositives, 1, 20, 0.3, 0.8);
  const separation = vennRadius * 2 * (1 - overlapFactor);

  const leftX = cx - separation / 2;
  const rightX = cx + separation / 2;

  // Draw legend above
  textSize(12);
  textAlign(LEFT, CENTER);

  // Retrieved circle (blue)
  fill(100, 149, 237, 100);
  noStroke();
  ellipse(50, 60, 15, 15);
  fill(50);
  text('Retrieved Results', 65, 60);

  // Relevant circle (green)
  fill(144, 238, 144, 100);
  noStroke();
  ellipse(200, 60, 15, 15);
  fill(50);
  text('Relevant in Collection', 215, 60);

  // Overlap (purple)
  fill(186, 85, 211, 100);
  noStroke();
  ellipse(370, 60, 15, 15);
  fill(50);
  text('True Positives', 385, 60);

  textAlign(CENTER, CENTER);

  // Draw circles
  // Retrieved (blue)
  fill(100, 149, 237, 80);
  stroke(100, 149, 237);
  strokeWeight(2);
  ellipse(leftX, cy, vennRadius * 2, vennRadius * 2);

  // Relevant (green)
  fill(144, 238, 144, 80);
  stroke(34, 139, 34);
  ellipse(rightX, cy, vennRadius * 2, vennRadius * 2);

  // Overlap highlight
  // Use clip path to show overlap
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(leftX, cy, vennRadius, 0, TWO_PI);
  drawingContext.clip();

  fill(186, 85, 211, 150);
  noStroke();
  ellipse(rightX, cy, vennRadius * 2, vennRadius * 2);

  drawingContext.restore();
  pop();

  // Labels on circles
  fill(50);
  textSize(11);

  // Retrieved only (false positives)
  const fpCount = retrievedDocs - truePositives;
  text(`False\nPositives\n(${fpCount})`, leftX - vennRadius * 0.5, cy);

  // Overlap (true positives)
  text(`True\nPositives\n(${truePositives})`, cx, cy);

  // Relevant only (false negatives)
  const fnCount = relevantDocs - truePositives;
  text(`False\nNegatives\n(${fnCount})`, rightX + vennRadius * 0.5, cy);

  // Circle labels below
  textSize(12);
  textStyle(BOLD);
  fill(70, 130, 180);
  text(`Retrieved: ${retrievedDocs}`, leftX, cy + vennRadius + 25);

  fill(34, 139, 34);
  text(`Relevant: ${relevantDocs}`, rightX, cy + vennRadius + 25);
  textStyle(NORMAL);

  // Draw document icons if animating
  if (animateDocs) {
    drawParticles(leftX, rightX, cy);
  }
}

function drawParticles(leftX, rightX, cy) {
  for (let p of particles) {
    // Determine particle type based on position
    const inLeft = dist(p.x, p.y, leftX, cy) < vennRadius;
    const inRight = dist(p.x, p.y, rightX, cy) < vennRadius;

    if (inLeft && inRight) {
      fill(186, 85, 211); // True positive
    } else if (inLeft) {
      fill(100, 149, 237); // False positive
    } else if (inRight) {
      fill(34, 139, 34); // False negative
    } else {
      fill(200); // Not in either
    }

    noStroke();
    ellipse(p.x, p.y, 6, 6);
  }
}

function updateParticles() {
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges
    if (p.x < 50 || p.x > canvasWidth * 0.6) p.vx *= -1;
    if (p.y < 90 || p.y > drawHeight - 80) p.vy *= -1;
  }
}

function drawMetricsPanel() {
  const panelX = canvasWidth * 0.65;
  const panelY = 80;
  const panelW = canvasWidth * 0.32;
  const panelH = 180;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Metrics
  textAlign(LEFT, TOP);
  textSize(13);
  let yPos = panelY + 15;

  // Precision
  fill(50);
  textStyle(BOLD);
  text('Precision:', panelX + 15, yPos);
  textStyle(NORMAL);

  // Precision bar
  const precBar = map(precision, 0, 1, 0, 100);
  fill(220);
  rect(panelX + 15, yPos + 18, 100, 12, 3);
  fill(100, 149, 237);
  rect(panelX + 15, yPos + 18, precBar, 12, 3);

  fill(50);
  text(`${(precision * 100).toFixed(1)}%`, panelX + 125, yPos + 16);

  if (showFormulas) {
    textSize(10);
    fill(100);
    text(`${truePositives}/${retrievedDocs}`, panelX + 170, yPos + 18);
  }

  yPos += 45;

  // Recall
  textSize(13);
  fill(50);
  textStyle(BOLD);
  text('Recall:', panelX + 15, yPos);
  textStyle(NORMAL);

  // Recall bar
  const recBar = map(recall, 0, 1, 0, 100);
  fill(220);
  rect(panelX + 15, yPos + 18, 100, 12, 3);
  fill(34, 139, 34);
  rect(panelX + 15, yPos + 18, recBar, 12, 3);

  fill(50);
  text(`${(recall * 100).toFixed(1)}%`, panelX + 125, yPos + 16);

  if (showFormulas) {
    textSize(10);
    fill(100);
    text(`${truePositives}/${relevantDocs}`, panelX + 170, yPos + 18);
  }

  yPos += 45;

  // F1 Score
  textSize(13);
  fill(50);
  textStyle(BOLD);
  text('F1 Score:', panelX + 15, yPos);
  textStyle(NORMAL);

  // F1 bar
  const f1Bar = map(f1Score, 0, 1, 0, 100);
  fill(220);
  rect(panelX + 15, yPos + 18, 100, 12, 3);
  fill(186, 85, 211);
  rect(panelX + 15, yPos + 18, f1Bar, 12, 3);

  fill(50);
  text(`${(f1Score * 100).toFixed(1)}%`, panelX + 125, yPos + 16);

  if (showFormulas) {
    textSize(10);
    fill(100);
    text('harmonic mean', panelX + 170, yPos + 18);
  }

  textAlign(CENTER, CENTER);

  // Slider label
  fill(50);
  textSize(12);
  text('Search Specificity', canvasWidth * 0.7, drawHeight - 145);
  textSize(10);
  fill(100);
  text('Low ← → High', canvasWidth * 0.7, drawHeight - 95);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Preset buttons
  textSize(11);
  fill(100);
  text('Presets:', canvasWidth * 0.15, buttonY + buttonH / 2);

  // High Precision button
  const precX = canvasWidth * 0.25;
  fill('#2196F3');
  stroke(100);
  strokeWeight(1);
  rect(precX, buttonY, 95, buttonH, 5);
  fill(255);
  noStroke();
  textSize(11);
  text('High Precision', precX + 47, buttonY + buttonH / 2);

  // Balanced button
  const balX = canvasWidth * 0.40;
  fill('#9C27B0');
  stroke(100);
  strokeWeight(1);
  rect(balX, buttonY, 75, buttonH, 5);
  fill(255);
  noStroke();
  text('Balanced', balX + 37, buttonY + buttonH / 2);

  // High Recall button
  const recX = canvasWidth * 0.53;
  fill('#4CAF50');
  stroke(100);
  strokeWeight(1);
  rect(recX, buttonY, 90, buttonH, 5);
  fill(255);
  noStroke();
  text('High Recall', recX + 45, buttonY + buttonH / 2);

  // Show Formulas toggle
  const formX = canvasWidth * 0.72;
  fill(showFormulas ? '#607D8B' : '#ccc');
  stroke(100);
  strokeWeight(1);
  rect(formX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text(showFormulas ? 'Hide Formulas' : 'Show Formulas', formX + 50, buttonY + buttonH / 2);

  // Animate toggle
  const animX = canvasWidth * 0.87;
  fill(animateDocs ? '#FF5722' : '#ccc');
  stroke(100);
  strokeWeight(1);
  rect(animX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  text(animateDocs ? 'Stop' : 'Animate', animX + 40, buttonY + buttonH / 2);
}

function mousePressed() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Check High Precision button
  const precX = canvasWidth * 0.25;
  if (mouseX >= precX && mouseX <= precX + 95 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    specificitySlider.value(9);
    return;
  }

  // Check Balanced button
  const balX = canvasWidth * 0.40;
  if (mouseX >= balX && mouseX <= balX + 75 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    specificitySlider.value(5);
    return;
  }

  // Check High Recall button
  const recX = canvasWidth * 0.53;
  if (mouseX >= recX && mouseX <= recX + 90 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    specificitySlider.value(1.5);
    return;
  }

  // Check Show Formulas toggle
  const formX = canvasWidth * 0.72;
  if (mouseX >= formX && mouseX <= formX + 100 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showFormulas = !showFormulas;
    return;
  }

  // Check Animate toggle
  const animX = canvasWidth * 0.87;
  if (mouseX >= animX && mouseX <= animX + 80 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    animateDocs = !animateDocs;
    if (animateDocs) initParticles();
    return;
  }
}
