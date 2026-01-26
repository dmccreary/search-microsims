// Information Retrieval Pipeline MicroSim
// Shows the 5-stage search pipeline with interactive trace animation

let canvasWidth = 800;
const drawHeight = 380;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Pipeline stages
const stages = [
  {
    id: 'query',
    label: 'User Query',
    shape: 'rounded',
    color: '#87CEEB',
    hoverText: 'User enters search terms: "physics pendulum simulation"',
    detail: 'Input: Raw search query',
    x: 0, y: 0, w: 120, h: 50
  },
  {
    id: 'process',
    label: 'Query\nProcessing',
    shape: 'rect',
    color: '#4169E1',
    hoverText: 'Tokenize, normalize, remove stopwords, identify key terms',
    detail: 'Steps: tokenize → lowercase → remove common words',
    x: 0, y: 0, w: 120, h: 50
  },
  {
    id: 'index',
    label: 'Index\nLookup',
    shape: 'cylinder',
    color: '#FF8C00',
    hoverText: 'Search the pre-built index for matching documents',
    detail: 'Query terms mapped to document IDs',
    x: 0, y: 0, w: 120, h: 60
  },
  {
    id: 'match',
    label: 'Matching',
    shape: 'rect',
    color: '#FFD700',
    hoverText: 'Identify all documents containing query terms',
    detail: 'Found 47 potential matches',
    x: 0, y: 0, w: 120, h: 50
  },
  {
    id: 'rank',
    label: 'Ranking',
    shape: 'rect',
    color: '#32CD32',
    hoverText: 'Score and sort by relevance using TF-IDF, BM25, or other algorithms',
    detail: 'Documents reordered by score',
    x: 0, y: 0, w: 120, h: 50
  },
  {
    id: 'results',
    label: 'Search\nResults',
    shape: 'rounded',
    color: '#90EE90',
    hoverText: 'Top 10 results displayed to user with titles and descriptions',
    detail: 'Output: Ordered list of MicroSims',
    x: 0, y: 0, w: 120, h: 50
  }
];

// Animation state
let currentStep = -1;
let isAnimating = false;
let animationProgress = 0;
let hoveredStage = -1;
let showDetail = false;
let detailStage = -1;

// Sample data for trace
const sampleQuery = 'physics pendulum simulation';
const sampleTokens = ['physics', 'pendulum', 'simulation'];
const sampleMatches = ['Doc1', 'Doc5', 'Doc12', 'Doc23', 'Doc31', 'Doc44', 'Doc47'];
const sampleResults = [
  'Pendulum Period Calculator',
  'Simple Harmonic Motion',
  'Physics Oscillation Lab'
];

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Calculate stage positions
  updateStagePositions();
}

function updateStagePositions() {
  const margin = 60;
  const spacing = (canvasWidth - 2 * margin - 120) / 5;
  const centerY = 120;

  for (let i = 0; i < stages.length; i++) {
    stages[i].x = margin + i * spacing;
    stages[i].y = centerY;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  updateStagePositions();
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
  textSize(18);
  textStyle(BOLD);
  text('Information Retrieval Pipeline', canvasWidth / 2, 30);
  textStyle(NORMAL);

  // Draw connections first (behind stages)
  drawConnections();

  // Draw stages
  for (let i = 0; i < stages.length; i++) {
    drawStage(i);
  }

  // Draw detail panel if active
  if (showDetail && detailStage >= 0) {
    drawDetailPanel();
  }

  // Draw hover tooltip
  if (hoveredStage >= 0 && !showDetail) {
    drawTooltip(hoveredStage);
  }

  // Draw controls
  drawControls();

  // Update animation
  if (isAnimating) {
    animationProgress += 0.02;
    if (animationProgress >= 1) {
      animationProgress = 0;
      currentStep++;
      if (currentStep >= stages.length) {
        isAnimating = false;
        currentStep = stages.length - 1;
      }
    }
  }
}

function drawConnections() {
  for (let i = 0; i < stages.length - 1; i++) {
    const s1 = stages[i];
    const s2 = stages[i + 1];

    // Connection line
    let lineColor;
    if (currentStep > i) {
      lineColor = color(50, 150, 50); // Completed
    } else if (currentStep === i && isAnimating) {
      lineColor = lerpColor(color(150), color(50, 150, 50), animationProgress);
    } else {
      lineColor = color(150); // Not yet
    }

    stroke(lineColor);
    strokeWeight(2);

    const x1 = s1.x + s1.w;
    const x2 = s2.x;
    const y = s1.y + s1.h / 2;

    line(x1, y, x2, y);

    // Arrow head
    fill(lineColor);
    noStroke();
    triangle(x2 - 5, y - 6, x2 - 5, y + 6, x2, y);
  }

  // Dashed line from Index to stored index
  const indexStage = stages[2];
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]);
  line(indexStage.x + indexStage.w / 2, indexStage.y + indexStage.h,
       indexStage.x + indexStage.w / 2, indexStage.y + indexStage.h + 40);
  drawingContext.setLineDash([]);

  // Storage icon
  fill(255);
  stroke(150);
  rect(indexStage.x + indexStage.w / 2 - 30, indexStage.y + indexStage.h + 40, 60, 25, 3);
  fill(100);
  noStroke();
  textSize(10);
  text('Pre-built Index', indexStage.x + indexStage.w / 2, indexStage.y + indexStage.h + 52);
}

function drawStage(i) {
  const s = stages[i];
  const isActive = currentStep === i;
  const isCompleted = currentStep > i;
  const isHovered = hoveredStage === i;

  // Determine fill color
  let fillColor;
  if (isActive && isAnimating) {
    // Pulsing effect
    const pulse = sin(frameCount * 0.1) * 0.2 + 0.8;
    fillColor = lerpColor(color(255), color(s.color), pulse);
  } else if (isCompleted || isActive) {
    fillColor = color(s.color);
  } else {
    fillColor = lerpColor(color(255), color(s.color), 0.3);
  }

  // Hover effect
  if (isHovered) {
    fillColor = lerpColor(fillColor, color(255), 0.3);
  }

  // Draw shape
  stroke(isHovered || isActive ? 80 : 150);
  strokeWeight(isHovered || isActive ? 2 : 1);
  fill(fillColor);

  if (s.shape === 'rounded') {
    rect(s.x, s.y, s.w, s.h, 20);
  } else if (s.shape === 'cylinder') {
    // Cylinder shape
    rect(s.x, s.y + 8, s.w, s.h - 16, 0);
    ellipse(s.x + s.w / 2, s.y + 8, s.w, 16);
    fill(fillColor);
    noStroke();
    ellipse(s.x + s.w / 2, s.y + s.h - 8, s.w, 16);
    stroke(isHovered || isActive ? 80 : 150);
    strokeWeight(isHovered || isActive ? 2 : 1);
    noFill();
    arc(s.x + s.w / 2, s.y + s.h - 8, s.w, 16, 0, PI);
  } else {
    rect(s.x, s.y, s.w, s.h, 5);
  }

  // Label
  fill(isCompleted || isActive ? 30 : 100);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  const lines = s.label.split('\n');
  for (let j = 0; j < lines.length; j++) {
    const lineY = s.y + s.h / 2 + (j - (lines.length - 1) / 2) * 14;
    text(lines[j], s.x + s.w / 2, lineY);
  }
  textStyle(NORMAL);

  // Step number
  fill(50);
  textSize(10);
  text(i + 1, s.x + s.w / 2, s.y - 15);
}

function drawTooltip(i) {
  const s = stages[i];
  const tooltipText = s.hoverText;

  textSize(11);
  const tw = textWidth(tooltipText) + 20;
  const th = 30;

  let tx = s.x + s.w / 2 - tw / 2;
  tx = constrain(tx, 10, canvasWidth - tw - 10);
  const ty = s.y + s.h + 15;

  // Tooltip background
  fill(50, 50, 50, 230);
  noStroke();
  rect(tx, ty, tw, th, 5);

  // Tooltip text
  fill(255);
  text(tooltipText, tx + tw / 2, ty + th / 2);
}

function drawDetailPanel() {
  const s = stages[detailStage];
  const panelW = 280;
  const panelH = 140;
  const panelX = canvasWidth / 2 - panelW / 2;
  const panelY = 230;

  // Panel background
  fill(255);
  stroke(100);
  strokeWeight(2);
  rect(panelX, panelY, panelW, panelH, 8);

  // Close button
  fill(200);
  noStroke();
  ellipse(panelX + panelW - 15, panelY + 15, 20, 20);
  fill(100);
  textSize(14);
  text('×', panelX + panelW - 15, panelY + 15);

  // Title
  fill(50);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text(s.label.replace('\n', ' '), panelX + panelW / 2, panelY + 15);
  textStyle(NORMAL);

  // Detail content
  textSize(11);
  textAlign(LEFT, TOP);
  fill(70);

  let content = '';
  switch(detailStage) {
    case 0:
      content = `Query: "${sampleQuery}"\n\nUser types search terms into the search box.`;
      break;
    case 1:
      content = `Tokens: [${sampleTokens.join(', ')}]\n\nSteps:\n• Tokenize into words\n• Convert to lowercase\n• Remove stopwords`;
      break;
    case 2:
      content = `Index lookup for each token:\n• physics → [Doc1, Doc5, Doc23...]\n• pendulum → [Doc1, Doc12, Doc31...]\n• simulation → [Doc5, Doc44, Doc47...]`;
      break;
    case 3:
      content = `Matching documents (AND operation):\n${sampleMatches.join(', ')}\n\nFound ${sampleMatches.length} documents containing all terms.`;
      break;
    case 4:
      content = `Ranking by relevance score:\n1. Doc1 (score: 0.92)\n2. Doc5 (score: 0.87)\n3. Doc12 (score: 0.81)\n...`;
      break;
    case 5:
      content = `Top Results:\n1. ${sampleResults[0]}\n2. ${sampleResults[1]}\n3. ${sampleResults[2]}\n...`;
      break;
  }

  text(content, panelX + 15, panelY + 40, panelW - 30, panelH - 50);
  textAlign(CENTER, CENTER);
}

function drawControls() {
  const buttonY = drawHeight + 20;
  const buttonH = 32;

  // Trace Query button
  const traceX = canvasWidth / 2 - 180;
  fill(currentStep < 0 || !isAnimating ? '#4CAF50' : '#aaa');
  stroke(100);
  strokeWeight(1);
  rect(traceX, buttonY, 110, buttonH, 5);
  fill(255);
  noStroke();
  textSize(13);
  text('Trace Query', traceX + 55, buttonY + buttonH / 2);

  // Reset button
  const resetX = canvasWidth / 2 - 55;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  text('Reset', resetX + 40, buttonY + buttonH / 2);

  // Step button
  const stepX = canvasWidth / 2 + 40;
  fill(currentStep < stages.length - 1 ? '#2196F3' : '#aaa');
  stroke(100);
  strokeWeight(1);
  rect(stepX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  text('Step →', stepX + 40, buttonY + buttonH / 2);

  // Progress indicator
  fill(100);
  textSize(11);
  const progress = currentStep < 0 ? 'Ready' :
                   currentStep >= stages.length - 1 ? 'Complete' :
                   `Step ${currentStep + 1} of ${stages.length}`;
  text(progress, canvasWidth / 2 + 160, buttonY + buttonH / 2);
}

function mousePressed() {
  const buttonY = drawHeight + 20;
  const buttonH = 32;

  // Check Trace Query button
  const traceX = canvasWidth / 2 - 180;
  if (mouseX >= traceX && mouseX <= traceX + 110 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    if (currentStep < 0 || !isAnimating) {
      currentStep = 0;
      isAnimating = true;
      animationProgress = 0;
    }
    return;
  }

  // Check Reset button
  const resetX = canvasWidth / 2 - 55;
  if (mouseX >= resetX && mouseX <= resetX + 80 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    currentStep = -1;
    isAnimating = false;
    animationProgress = 0;
    showDetail = false;
    detailStage = -1;
    return;
  }

  // Check Step button
  const stepX = canvasWidth / 2 + 40;
  if (mouseX >= stepX && mouseX <= stepX + 80 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    if (currentStep < stages.length - 1) {
      currentStep++;
      isAnimating = false;
    }
    return;
  }

  // Check close button on detail panel
  if (showDetail) {
    const panelW = 280;
    const panelX = canvasWidth / 2 - panelW / 2;
    const panelY = 230;

    if (dist(mouseX, mouseY, panelX + panelW - 15, panelY + 15) < 12) {
      showDetail = false;
      detailStage = -1;
      return;
    }
  }

  // Check stage clicks
  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    if (mouseX >= s.x && mouseX <= s.x + s.w &&
        mouseY >= s.y && mouseY <= s.y + s.h) {
      if (showDetail && detailStage === i) {
        showDetail = false;
        detailStage = -1;
      } else {
        showDetail = true;
        detailStage = i;
      }
      return;
    }
  }

  // Click outside closes detail
  if (showDetail) {
    showDetail = false;
    detailStage = -1;
  }
}

function mouseMoved() {
  hoveredStage = -1;

  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    if (mouseX >= s.x && mouseX <= s.x + s.w &&
        mouseY >= s.y && mouseY <= s.y + s.h) {
      hoveredStage = i;
      cursor(HAND);
      return;
    }
  }

  // Check buttons
  const buttonY = drawHeight + 20;
  const buttonH = 32;

  if (mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
