// Similarity Score Interface Demo MicroSim
// Compare different ways to display similarity scores

let canvasWidth = 800;
const drawHeight = 410;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Source MicroSim
const sourceMicroSim = {
  title: "Wave Motion Simulator",
  subject: "Physics",
  description: "Interactive wave propagation visualization"
};

// Similar items with scores
const similarItems = [
  { title: "Wave Interference", score: 0.92, subject: "Physics" },
  { title: "Oscillation Explorer", score: 0.87, subject: "Physics" },
  { title: "Sound Propagation", score: 0.81, subject: "Physics" },
  { title: "Frequency Analyzer", score: 0.76, subject: "Physics" },
  { title: "Resonance Demo", score: 0.71, subject: "Physics" }
];

// Alternate sources
const alternateSources = [
  {
    source: { title: "Pendulum Lab", subject: "Physics", description: "Simple harmonic motion exploration" },
    similar: [
      { title: "Spring Mass System", score: 0.94, subject: "Physics" },
      { title: "Simple Harmonic Motion", score: 0.89, subject: "Physics" },
      { title: "Energy Conservation", score: 0.82, subject: "Physics" },
      { title: "Circular Motion", score: 0.77, subject: "Physics" },
      { title: "Projectile Motion", score: 0.72, subject: "Physics" }
    ]
  },
  {
    source: { title: "Molecule Viewer", subject: "Chemistry", description: "3D molecular structure visualization" },
    similar: [
      { title: "Chemical Bonds", score: 0.91, subject: "Chemistry" },
      { title: "Electron Orbitals", score: 0.85, subject: "Chemistry" },
      { title: "Periodic Trends", score: 0.79, subject: "Chemistry" },
      { title: "Reaction Mechanism", score: 0.74, subject: "Chemistry" },
      { title: "Molecular Geometry", score: 0.70, subject: "Chemistry" }
    ]
  }
];

let currentSourceIndex = -1; // -1 means original source
let selectedDisplay = 3; // Default to combined (0-3)
let showExplanation = false;
let threshold = 0.6;

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(LEFT, TOP);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function getCurrentSource() {
  if (currentSourceIndex < 0) return sourceMicroSim;
  return alternateSources[currentSourceIndex].source;
}

function getCurrentSimilar() {
  if (currentSourceIndex < 0) return similarItems;
  return alternateSources[currentSourceIndex].similar;
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
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Similarity Score Display Comparison', canvasWidth / 2, 10);
  textStyle(NORMAL);

  // Source card
  drawSourceCard(15, 35, canvasWidth - 30, 55);

  // Display columns
  const colWidth = (canvasWidth - 50) / 4;
  const colY = 100;
  const colH = 280;

  const displayNames = ['Percentages', 'Categories', 'Color Bars', 'Combined'];

  for (let i = 0; i < 4; i++) {
    const colX = 15 + i * (colWidth + 7);
    drawDisplayColumn(colX, colY, colWidth, colH, i, displayNames[i]);
  }

  // Draw controls
  drawControls();
}

function drawSourceCard(x, y, w, h) {
  const source = getCurrentSource();

  // Card background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 6);

  // Source label
  fill(100);
  textSize(9);
  textAlign(LEFT, TOP);
  text('SOURCE MICROSIM', x + 12, y + 8);

  // Title
  fill(50);
  textSize(13);
  textStyle(BOLD);
  text(source.title, x + 12, y + 22);
  textStyle(NORMAL);

  // Subject badge
  const badgeX = x + 12 + textWidth(source.title) + 15;
  fill(230, 240, 250);
  noStroke();
  rect(badgeX, y + 20, textWidth(source.subject) + 12, 18, 9);
  fill(70, 100, 130);
  textSize(10);
  text(source.subject, badgeX + 6, y + 24);

  // Description
  fill(80);
  textSize(10);
  text(source.description, x + 12, y + 40);

  textAlign(LEFT, TOP);
}

function drawDisplayColumn(x, y, w, h, displayType, title) {
  // Column background
  const isSelected = displayType === selectedDisplay;
  fill(isSelected ? color(240, 248, 255) : 255);
  stroke(isSelected ? color(70, 130, 180) : 200);
  strokeWeight(isSelected ? 2 : 1);
  rect(x, y, w, h, 6);

  // Column title
  fill(isSelected ? color(50, 100, 150) : 100);
  textSize(10);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text(title, x + w / 2, y + 8);
  textStyle(NORMAL);

  // Draw items
  const similar = getCurrentSimilar();
  let itemY = y + 30;
  const itemH = 46;

  textAlign(LEFT, TOP);

  for (let item of similar) {
    if (item.score < threshold) {
      // Below threshold - faded
      push();
      drawingContext.globalAlpha = 0.3;
    }

    // Item card
    fill(252);
    stroke(220);
    strokeWeight(1);
    rect(x + 5, itemY, w - 10, itemH, 4);

    // Title
    fill(50);
    textSize(9);
    text(item.title, x + 10, itemY + 5);

    // Display type specific content
    const scoreY = itemY + 22;

    switch (displayType) {
      case 0: // Percentages only
        fill(60);
        textSize(14);
        textStyle(BOLD);
        text((item.score * 100).toFixed(0) + '%', x + 10, scoreY);
        textStyle(NORMAL);
        break;

      case 1: // Categories
        const category = getCategory(item.score);
        fill(category.color);
        textSize(11);
        text(category.label, x + 10, scoreY);
        break;

      case 2: // Color bars
        drawColorBar(x + 10, scoreY, w - 25, 14, item.score);
        break;

      case 3: // Combined
        // Color badge with percentage
        const cat = getCategory(item.score);
        fill(cat.color);
        noStroke();
        rect(x + 10, scoreY, 45, 16, 8);
        fill(255);
        textSize(10);
        textStyle(BOLD);
        textAlign(CENTER, TOP);
        text((item.score * 100).toFixed(0) + '%', x + 32, scoreY + 2);
        textStyle(NORMAL);
        textAlign(LEFT, TOP);

        // Category text
        fill(100);
        textSize(9);
        text(cat.shortLabel, x + 60, scoreY + 3);
        break;
    }

    if (item.score < threshold) {
      pop();
    }

    itemY += itemH + 3;
  }

  // Selection indicator
  if (isSelected) {
    fill(70, 130, 180);
    noStroke();
    ellipse(x + w / 2, y + h - 10, 8, 8);
  }

  textAlign(LEFT, TOP);
}

function getCategory(score) {
  if (score >= 0.85) return { label: 'Very Similar', shortLabel: 'Very Similar', color: color(76, 175, 80) };
  if (score >= 0.70) return { label: 'Related', shortLabel: 'Related', color: color(255, 193, 7) };
  if (score >= 0.55) return { label: 'Somewhat Related', shortLabel: 'Somewhat', color: color(255, 152, 0) };
  return { label: 'Weakly Related', shortLabel: 'Weak', color: color(158, 158, 158) };
}

function drawColorBar(x, y, w, h, score) {
  // Background
  fill(230);
  noStroke();
  rect(x, y, w, h, h / 2);

  // Filled portion
  const cat = getCategory(score);
  fill(cat.color);
  rect(x, y, w * score, h, h / 2);

  // Border
  noFill();
  stroke(200);
  rect(x, y, w, h, h / 2);
}

function drawControls() {
  const buttonY = drawHeight + 12;
  const buttonH = 28;

  // Threshold slider
  fill(60);
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  text('Threshold: ' + (threshold * 100).toFixed(0) + '%', 20, buttonY + buttonH / 2);

  // Slider track
  const sliderX = 120;
  const sliderW = 100;
  fill(200);
  rect(sliderX, buttonY + buttonH / 2 - 3, sliderW, 6, 3);

  // Slider fill
  fill(70, 130, 180);
  rect(sliderX, buttonY + buttonH / 2 - 3, sliderW * (threshold - 0.5) / 0.5, 6, 3);

  // Slider handle
  const handleX = sliderX + sliderW * (threshold - 0.5) / 0.5;
  fill(255);
  stroke(70, 130, 180);
  strokeWeight(2);
  ellipse(handleX, buttonY + buttonH / 2, 14, 14);

  // Change Source button
  const sourceX = 250;
  fill('#2196F3');
  stroke(100);
  strokeWeight(1);
  rect(sourceX, buttonY, 120, buttonH, 5);
  fill(255);
  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  text('Change Source', sourceX + 60, buttonY + buttonH / 2);

  // Preference label
  fill(60);
  textAlign(LEFT, CENTER);
  text('Preferred display:', 400, buttonY + buttonH / 2);

  // Display preference radio buttons
  const radioNames = ['%', 'Cat', 'Bar', 'All'];
  let radioX = 495;
  for (let i = 0; i < 4; i++) {
    fill(selectedDisplay === i ? color(70, 130, 180) : 255);
    stroke(selectedDisplay === i ? color(70, 130, 180) : 150);
    ellipse(radioX, buttonY + buttonH / 2, 16, 16);

    if (selectedDisplay === i) {
      fill(255);
      noStroke();
      ellipse(radioX, buttonY + buttonH / 2, 8, 8);
    }

    fill(60);
    noStroke();
    textSize(9);
    text(radioNames[i], radioX + 12, buttonY + buttonH / 2);

    radioX += 50;
  }

  // Show explanation toggle
  const explainX = canvasWidth - 130;
  fill(showExplanation ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(explainX, buttonY, 110, buttonH, 5);
  fill(255);
  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  text(showExplanation ? 'Hide Tips' : 'Show Tips', explainX + 55, buttonY + buttonH / 2);
}

function mousePressed() {
  const buttonY = drawHeight + 12;
  const buttonH = 28;

  // Check slider drag
  const sliderX = 120;
  const sliderW = 100;
  if (mouseX >= sliderX && mouseX <= sliderX + sliderW &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    threshold = 0.5 + 0.5 * (mouseX - sliderX) / sliderW;
    threshold = constrain(threshold, 0.5, 1.0);
    return;
  }

  // Change Source button
  if (mouseX >= 250 && mouseX <= 370 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    currentSourceIndex = (currentSourceIndex + 1) % 3;
    if (currentSourceIndex === 2) currentSourceIndex = -1; // Cycle back
    return;
  }

  // Radio buttons
  let radioX = 495;
  for (let i = 0; i < 4; i++) {
    if (dist(mouseX, mouseY, radioX, buttonY + buttonH / 2) < 12) {
      selectedDisplay = i;
      return;
    }
    radioX += 50;
  }

  // Show explanation toggle
  const explainX = canvasWidth - 130;
  if (mouseX >= explainX && mouseX <= explainX + 110 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showExplanation = !showExplanation;
    return;
  }

  // Check column clicks
  const colWidth = (canvasWidth - 50) / 4;
  const colY = 100;
  const colH = 280;

  for (let i = 0; i < 4; i++) {
    const colX = 15 + i * (colWidth + 7);
    if (mouseX >= colX && mouseX <= colX + colWidth &&
        mouseY >= colY && mouseY <= colY + colH) {
      selectedDisplay = i;
      return;
    }
  }
}

function mouseDragged() {
  const buttonY = drawHeight + 12;
  const buttonH = 28;
  const sliderX = 120;
  const sliderW = 100;

  if (mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    if (mouseX >= sliderX - 10 && mouseX <= sliderX + sliderW + 10) {
      threshold = 0.5 + 0.5 * (mouseX - sliderX) / sliderW;
      threshold = constrain(threshold, 0.5, 1.0);
    }
  }
}

function mouseMoved() {
  const buttonY = drawHeight + 12;
  if (mouseY >= buttonY && mouseY <= buttonY + 40) {
    cursor(HAND);
    return;
  }

  const colY = 100;
  const colH = 280;
  if (mouseY >= colY && mouseY <= colY + colH) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
