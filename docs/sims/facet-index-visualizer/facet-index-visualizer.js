// Facet Index Visualizer MicroSim
// Shows how facet selections create set intersections

let canvasWidth = 800;
const drawHeight = 450;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Sample documents with facet values
const documents = [];
for (let i = 1; i <= 15; i++) {
  documents.push({
    id: i,
    subject: ['Physics', 'Chemistry', 'Math'][Math.floor(Math.random() * 3)],
    grade: ['K-12', 'Undergraduate', 'Graduate'][Math.floor(Math.random() * 3)],
    framework: ['p5.js', 'D3.js', 'Three.js'][Math.floor(Math.random() * 3)]
  });
}

// Ensure some documents match common combinations
documents[0] = { id: 1, subject: 'Physics', grade: 'Undergraduate', framework: 'p5.js' };
documents[1] = { id: 2, subject: 'Physics', grade: 'Undergraduate', framework: 'p5.js' };
documents[2] = { id: 3, subject: 'Physics', grade: 'K-12', framework: 'p5.js' };
documents[3] = { id: 4, subject: 'Chemistry', grade: 'Undergraduate', framework: 'D3.js' };
documents[4] = { id: 5, subject: 'Chemistry', grade: 'Graduate', framework: 'Three.js' };
documents[5] = { id: 6, subject: 'Math', grade: 'K-12', framework: 'p5.js' };
documents[6] = { id: 7, subject: 'Physics', grade: 'Graduate', framework: 'Three.js' };
documents[7] = { id: 8, subject: 'Math', grade: 'Undergraduate', framework: 'D3.js' };

// Facet definitions
const facets = {
  subject: { label: 'Subject Area', values: ['Physics', 'Chemistry', 'Math'], color: [100, 149, 237] },
  grade: { label: 'Grade Level', values: ['K-12', 'Undergraduate', 'Graduate'], color: [60, 179, 113] },
  framework: { label: 'Framework', values: ['p5.js', 'D3.js', 'Three.js'], color: [255, 165, 0] }
};

// Selected values
let selected = {
  subject: null,
  grade: null,
  framework: null
};

// Animation state
let animating = false;
let animationStep = 0;
let animationProgress = 0;
let showSteps = true;

// Document positions
let docPositions = [];

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
  initDocPositions();
}

function initDocPositions() {
  docPositions = [];
  const startX = canvasWidth * 0.08;
  const cols = 5;
  const spacing = 55;
  const startY = 230;

  for (let i = 0; i < documents.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    docPositions.push({
      x: startX + col * spacing,
      y: startY + row * spacing,
      opacity: 255
    });
  }
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);
  initDocPositions();
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
  text('Facet Index Visualizer', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Draw facet controls
  drawFacetControls();

  // Draw documents
  drawDocuments();

  // Draw calculation panel
  if (showSteps) {
    drawCalculationPanel();
  }

  // Draw results count
  drawResultsCount();

  // Draw controls
  drawControls();

  // Update animation
  if (animating) {
    updateAnimation();
  }
}

function drawFacetControls() {
  const startY = 50;
  let xPos = 20;

  for (let facetKey in facets) {
    const facet = facets[facetKey];

    // Facet label
    fill(50);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(facet.label, xPos, startY);
    textStyle(NORMAL);

    // Radio buttons for values
    let yPos = startY + 18;
    for (let value of facet.values) {
      const isSelected = selected[facetKey] === value;

      // Radio button
      fill(isSelected ? color(...facet.color) : 255);
      stroke(isSelected ? color(...facet.color) : 150);
      strokeWeight(isSelected ? 2 : 1);
      ellipse(xPos + 8, yPos + 6, 14, 14);

      if (isSelected) {
        fill(255);
        noStroke();
        ellipse(xPos + 8, yPos + 6, 6, 6);
      }

      // Label
      fill(60);
      noStroke();
      textSize(10);
      text(value, xPos + 22, yPos);

      yPos += 20;
    }

    xPos += 130;
  }

  textAlign(CENTER, CENTER);
}

function drawDocuments() {
  const matchingDocs = getMatchingDocs();

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const pos = docPositions[i];
    const isMatching = matchingDocs.includes(doc.id);

    // Determine opacity
    let opacity = 255;
    if (hasAnySelection() && !isMatching) {
      opacity = 80;
    }

    // Document circle
    const docColor = getDocColor(doc);
    fill(docColor[0], docColor[1], docColor[2], opacity);
    stroke(isMatching && hasAnySelection() ? color(255, 215, 0) : 150);
    strokeWeight(isMatching && hasAnySelection() ? 3 : 1);
    ellipse(pos.x, pos.y, 40, 40);

    // Document number
    fill(opacity > 100 ? 255 : 200);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    text(doc.id, pos.x, pos.y);
    textStyle(NORMAL);
  }
}

function getDocColor(doc) {
  // Mix colors based on facet values
  const subjectIdx = facets.subject.values.indexOf(doc.subject);
  const gradeIdx = facets.grade.values.indexOf(doc.grade);

  const baseColors = [
    [100, 149, 237], // Blue
    [60, 179, 113],  // Green
    [255, 140, 0],   // Orange
    [186, 85, 211],  // Purple
    [255, 99, 71],   // Tomato
    [64, 224, 208]   // Turquoise
  ];

  return baseColors[(subjectIdx + gradeIdx) % baseColors.length];
}

function drawCalculationPanel() {
  const panelX = canvasWidth * 0.55;
  const panelY = 180;
  const panelW = canvasWidth * 0.42;
  const panelH = 140;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(50);
  textSize(11);
  textStyle(BOLD);
  text('Set Calculation', panelX + panelW / 2, panelY + 18);
  textStyle(NORMAL);

  // Show set notation
  textAlign(LEFT, TOP);
  textSize(10);
  let yPos = panelY + 35;

  const selections = [];

  for (let facetKey in selected) {
    if (selected[facetKey]) {
      const facet = facets[facetKey];
      const matchingIds = documents
        .filter(d => d[facetKey] === selected[facetKey])
        .map(d => d.id);

      fill(...facet.color);
      text(`${facet.label} = "${selected[facetKey]}"`, panelX + 15, yPos);

      fill(80);
      text(`→ {${matchingIds.join(', ')}}`, panelX + 15, yPos + 15);

      selections.push(matchingIds);
      yPos += 35;
    }
  }

  // Show intersection
  if (selections.length > 0) {
    const result = getMatchingDocs();

    fill(200, 150, 0);
    textStyle(BOLD);

    if (selections.length > 1) {
      text('Intersection:', panelX + 15, panelY + panelH - 25);
    } else {
      text('Result:', panelX + 15, panelY + panelH - 25);
    }

    fill(50);
    textStyle(NORMAL);
    text(`{${result.join(', ')}} (${result.length} docs)`, panelX + 90, panelY + panelH - 25);
  } else {
    fill(150);
    text('Select facets to see set operations', panelX + 15, panelY + 50);
  }

  textAlign(CENTER, CENTER);
}

function drawResultsCount() {
  const matchingDocs = getMatchingDocs();
  const total = documents.length;

  fill(50);
  textSize(12);
  textStyle(BOLD);

  if (hasAnySelection()) {
    text(`Matching: ${matchingDocs.length} of ${total} documents`, canvasWidth * 0.25, drawHeight - 20);
  } else {
    text(`All ${total} documents`, canvasWidth * 0.25, drawHeight - 20);
  }

  textStyle(NORMAL);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Reset button
  const resetX = canvasWidth / 2 - 130;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  textSize(11);
  text('Reset All', resetX + 40, buttonY + buttonH / 2);

  // Toggle Steps button
  const toggleX = canvasWidth / 2 - 35;
  fill(showSteps ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(toggleX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text(showSteps ? 'Hide Steps' : 'Show Steps', toggleX + 50, buttonY + buttonH / 2);

  // Animate button
  const animX = canvasWidth / 2 + 80;
  fill('#2196F3');
  stroke(100);
  strokeWeight(1);
  rect(animX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text('Animate', animX + 50, buttonY + buttonH / 2);
}

function getMatchingDocs() {
  let result = documents.map(d => d.id);

  for (let facetKey in selected) {
    if (selected[facetKey]) {
      const matching = documents
        .filter(d => d[facetKey] === selected[facetKey])
        .map(d => d.id);
      result = result.filter(id => matching.includes(id));
    }
  }

  return result;
}

function hasAnySelection() {
  return Object.values(selected).some(v => v !== null);
}

function updateAnimation() {
  animationProgress += 0.03;

  if (animationProgress >= 1) {
    animationStep++;
    animationProgress = 0;

    if (animationStep > 3) {
      animating = false;
      animationStep = 0;
    }
  }
}

function mousePressed() {
  // Check facet radio buttons
  const startY = 50;
  let xPos = 20;

  for (let facetKey in facets) {
    const facet = facets[facetKey];
    let yPos = startY + 18;

    for (let value of facet.values) {
      if (dist(mouseX, mouseY, xPos + 8, yPos + 6) < 10) {
        if (selected[facetKey] === value) {
          selected[facetKey] = null; // Deselect if clicking same value
        } else {
          selected[facetKey] = value;
        }
        return;
      }
      yPos += 20;
    }

    xPos += 130;
  }

  // Check control buttons
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Reset button
  const resetX = canvasWidth / 2 - 130;
  if (mouseX >= resetX && mouseX <= resetX + 80 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    selected = { subject: null, grade: null, framework: null };
    return;
  }

  // Toggle Steps button
  const toggleX = canvasWidth / 2 - 35;
  if (mouseX >= toggleX && mouseX <= toggleX + 100 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showSteps = !showSteps;
    return;
  }

  // Animate button
  const animX = canvasWidth / 2 + 80;
  if (mouseX >= animX && mouseX <= animX + 100 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    animating = true;
    animationStep = 0;
    animationProgress = 0;
    return;
  }
}

function mouseMoved() {
  // Check if over buttons
  const buttonY = drawHeight + 18;
  if (mouseY >= buttonY && mouseY <= buttonY + 32) {
    cursor(HAND);
    return;
  }

  // Check if over facet controls
  if (mouseY >= 50 && mouseY <= 140 && mouseX < 420) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
