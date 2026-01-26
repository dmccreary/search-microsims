// KNN Visualizer MicroSim
// Shows how K-nearest neighbors algorithm works in 2D embedding space

let canvasWidth = 800;
const drawHeight = 480;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Sample MicroSims with 2D positions
const microsims = [
  // Physics (blue)
  { id: 1, title: "Pendulum", subject: "Physics", x: 0.15, y: 0.25, color: [70, 130, 180] },
  { id: 2, title: "Wave Motion", subject: "Physics", x: 0.2, y: 0.3, color: [70, 130, 180] },
  { id: 3, title: "Projectile", subject: "Physics", x: 0.18, y: 0.2, color: [70, 130, 180] },
  { id: 4, title: "Circuit", subject: "Physics", x: 0.25, y: 0.28, color: [70, 130, 180] },
  { id: 5, title: "Optics", subject: "Physics", x: 0.22, y: 0.35, color: [70, 130, 180] },

  // Chemistry (green)
  { id: 6, title: "Molecule", subject: "Chemistry", x: 0.7, y: 0.2, color: [60, 179, 113] },
  { id: 7, title: "Reaction", subject: "Chemistry", x: 0.75, y: 0.25, color: [60, 179, 113] },
  { id: 8, title: "Gas Laws", subject: "Chemistry", x: 0.68, y: 0.28, color: [60, 179, 113] },
  { id: 9, title: "Equilibrium", subject: "Chemistry", x: 0.72, y: 0.15, color: [60, 179, 113] },

  // Math (purple)
  { id: 10, title: "Graphing", subject: "Math", x: 0.4, y: 0.7, color: [147, 112, 219] },
  { id: 11, title: "Geometry", subject: "Math", x: 0.35, y: 0.75, color: [147, 112, 219] },
  { id: 12, title: "Probability", subject: "Math", x: 0.45, y: 0.68, color: [147, 112, 219] },
  { id: 13, title: "Calculus", subject: "Math", x: 0.38, y: 0.72, color: [147, 112, 219] },

  // Biology (orange)
  { id: 14, title: "Cell", subject: "Biology", x: 0.8, y: 0.65, color: [255, 140, 0] },
  { id: 15, title: "Ecosystem", subject: "Biology", x: 0.78, y: 0.7, color: [255, 140, 0] },
  { id: 16, title: "Genetics", subject: "Biology", x: 0.82, y: 0.72, color: [255, 140, 0] },
  { id: 17, title: "Evolution", subject: "Biology", x: 0.75, y: 0.68, color: [255, 140, 0] },

  // CS (teal)
  { id: 18, title: "Sorting", subject: "CS", x: 0.5, y: 0.4, color: [0, 128, 128] },
  { id: 19, title: "Trees", subject: "CS", x: 0.55, y: 0.45, color: [0, 128, 128] },
  { id: 20, title: "Graphs", subject: "CS", x: 0.48, y: 0.42, color: [0, 128, 128] }
];

// State
let selectedPoint = null;
let kValue = 5;
let showDistanceCircles = true;
let showConnectionLines = true;
let hoveredPoint = null;

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Select first point by default
  selectedPoint = microsims[0];
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
  text('K-Nearest Neighbors Visualizer', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Calculate plot area
  const plotX = 20;
  const plotY = 45;
  const plotW = canvasWidth * 0.65;
  const plotH = drawHeight - 60;

  // Draw plot
  drawPlot(plotX, plotY, plotW, plotH);

  // Draw side panel
  drawSidePanel(plotX + plotW + 15, plotY, canvasWidth - plotX - plotW - 35, plotH);

  // Draw controls
  drawControls();
}

function drawPlot(x, y, w, h) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 4);

  // Find neighbors
  let neighbors = [];
  if (selectedPoint) {
    neighbors = findNeighbors(selectedPoint, kValue);
  }

  // Draw distance circles if enabled
  if (showDistanceCircles && selectedPoint && neighbors.length > 0) {
    const sx = x + selectedPoint.x * w;
    const sy = y + (1 - selectedPoint.y) * h;

    // Draw concentric circles up to furthest neighbor
    const maxDist = neighbors[neighbors.length - 1].distance;

    for (let i = 0; i < 3; i++) {
      const radius = (maxDist * w * (i + 1) / 3) * 2;
      noFill();
      stroke(200, 100);
      strokeWeight(1);
      ellipse(sx, sy, radius, radius);
    }

    // Draw boundary circle
    const boundaryRadius = maxDist * w * 2;
    stroke(255, 180, 0, 150);
    strokeWeight(2);
    setLineDash([5, 5]);
    ellipse(sx, sy, boundaryRadius, boundaryRadius);
    setLineDash([]);
  }

  // Draw connection lines if enabled
  if (showConnectionLines && selectedPoint) {
    const sx = x + selectedPoint.x * w;
    const sy = y + (1 - selectedPoint.y) * h;

    for (let i = 0; i < neighbors.length; i++) {
      const n = neighbors[i];
      const nx = x + n.ms.x * w;
      const ny = y + (1 - n.ms.y) * h;

      // Line opacity based on rank
      const alpha = map(i, 0, neighbors.length - 1, 200, 80);
      stroke(100, alpha);
      strokeWeight(2);
      line(sx, sy, nx, ny);

      // Rank label
      fill(80);
      noStroke();
      textSize(10);
      textStyle(BOLD);
      const mx = (sx + nx) / 2;
      const my = (sy + ny) / 2;
      text(i + 1, mx, my);
      textStyle(NORMAL);
    }
  }

  // Draw points
  for (let ms of microsims) {
    const px = x + ms.x * w;
    const py = y + (1 - ms.y) * h;

    const isSelected = selectedPoint && selectedPoint.id === ms.id;
    const isNeighbor = neighbors.some(n => n.ms.id === ms.id);
    const isHovered = hoveredPoint && hoveredPoint.id === ms.id;

    // Glow for selected
    if (isSelected) {
      noStroke();
      fill(255, 215, 0, 100);
      ellipse(px, py, 40, 40);
    }

    // Point
    const alpha = (isSelected || isNeighbor) ? 255 : 120;
    fill(...ms.color, alpha);
    stroke(isSelected ? color(255, 215, 0) : (isHovered ? 100 : 255));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    ellipse(px, py, isSelected ? 22 : 18, isSelected ? 22 : 18);

    // Label on hover or selected
    if (isHovered || isSelected) {
      fill(50);
      noStroke();
      textSize(10);
      text(ms.title, px, py - 20);
    }
  }

  // Legend
  drawLegend(x + 10, y + h - 90);
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function findNeighbors(point, k) {
  const distances = microsims
    .filter(ms => ms.id !== point.id)
    .map(ms => ({
      ms,
      distance: dist(point.x, point.y, ms.x, ms.y),
      similarity: 1 - dist(point.x, point.y, ms.x, ms.y)
    }))
    .sort((a, b) => a.distance - b.distance);

  return distances.slice(0, k);
}

function drawSidePanel(x, y, w, h) {
  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 4);

  // Title
  fill(50);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Results (K=' + kValue + ')', x + 10, y + 10);
  textStyle(NORMAL);

  let yPos = y + 35;

  if (selectedPoint) {
    // Query info
    fill(70);
    textSize(10);
    text('Query: ' + selectedPoint.title, x + 10, yPos);
    fill(100);
    textSize(9);
    text('Subject: ' + selectedPoint.subject, x + 10, yPos + 14);
    yPos += 40;

    // Separator
    stroke(220);
    line(x + 10, yPos - 5, x + w - 10, yPos - 5);

    // Neighbors list
    const neighbors = findNeighbors(selectedPoint, kValue);

    fill(70);
    noStroke();
    textSize(10);
    textStyle(BOLD);
    text('Nearest Neighbors:', x + 10, yPos);
    textStyle(NORMAL);
    yPos += 20;

    for (let i = 0; i < neighbors.length; i++) {
      const n = neighbors[i];

      // Rank badge
      fill(70, 130, 180);
      noStroke();
      ellipse(x + 18, yPos + 8, 18, 18);
      fill(255);
      textSize(10);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(i + 1, x + 18, yPos + 8);
      textAlign(LEFT, TOP);
      textStyle(NORMAL);

      // Title and similarity
      fill(50);
      textSize(10);
      text(n.ms.title, x + 32, yPos);

      // Similarity bar
      const simScore = (n.similarity * 100);
      const barW = map(simScore, 0, 100, 0, 60);
      fill(...n.ms.color, 150);
      noStroke();
      rect(x + 32, yPos + 14, barW, 8, 2);

      fill(100);
      textSize(8);
      text(simScore.toFixed(0) + '%', x + 95, yPos + 13);

      yPos += 32;
    }

    // Statistics
    yPos = y + h - 60;
    stroke(220);
    line(x + 10, yPos - 5, x + w - 10, yPos - 5);

    fill(70);
    noStroke();
    textSize(9);

    const avgSim = neighbors.reduce((sum, n) => sum + n.similarity, 0) / neighbors.length * 100;
    text('Avg similarity: ' + avgSim.toFixed(1) + '%', x + 10, yPos);

    const highSim = neighbors[0].similarity * 100;
    const lowSim = neighbors[neighbors.length - 1].similarity * 100;
    text('Range: ' + lowSim.toFixed(0) + '% - ' + highSim.toFixed(0) + '%', x + 10, yPos + 14);

    // Subject breakdown
    const subjectCounts = {};
    neighbors.forEach(n => {
      subjectCounts[n.ms.subject] = (subjectCounts[n.ms.subject] || 0) + 1;
    });
    const subjects = Object.entries(subjectCounts).map(([s, c]) => s + ':' + c).join(', ');
    text('Subjects: ' + subjects, x + 10, yPos + 28);

  } else {
    fill(100);
    textSize(10);
    text('Click a point to select', x + 10, yPos);
  }

  textAlign(CENTER, CENTER);
}

function drawLegend(x, y) {
  const subjects = [
    { name: "Physics", color: [70, 130, 180] },
    { name: "Chemistry", color: [60, 179, 113] },
    { name: "Math", color: [147, 112, 219] },
    { name: "Biology", color: [255, 140, 0] },
    { name: "CS", color: [0, 128, 128] }
  ];

  fill(255, 240);
  stroke(200);
  rect(x, y, 70, 85, 4);

  textAlign(LEFT, CENTER);
  textSize(8);

  let yPos = y + 10;
  for (let s of subjects) {
    fill(...s.color);
    noStroke();
    ellipse(x + 10, yPos, 8, 8);
    fill(60);
    text(s.name, x + 18, yPos);
    yPos += 14;
  }

  textAlign(CENTER, CENTER);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // K value control
  fill(60);
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('K = ' + kValue, 20, buttonY + buttonH / 2);

  // K slider
  const sliderX = 70;
  const sliderW = 120;
  fill(200);
  rect(sliderX, buttonY + buttonH / 2 - 4, sliderW, 8, 4);

  fill(70, 130, 180);
  rect(sliderX, buttonY + buttonH / 2 - 4, sliderW * (kValue - 1) / 14, 8, 4);

  // Slider handle
  const handleX = sliderX + sliderW * (kValue - 1) / 14;
  fill(255);
  stroke(70, 130, 180);
  strokeWeight(2);
  ellipse(handleX, buttonY + buttonH / 2, 16, 16);

  // Toggle buttons
  const circleX = 220;
  fill(showDistanceCircles ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(circleX, buttonY, 110, buttonH, 5);
  fill(255);
  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  text(showDistanceCircles ? 'Hide Circles' : 'Show Circles', circleX + 55, buttonY + buttonH / 2);

  const linesX = 340;
  fill(showConnectionLines ? '#2196F3' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(linesX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text(showConnectionLines ? 'Hide Lines' : 'Show Lines', linesX + 50, buttonY + buttonH / 2);

  // Random button
  const randX = 460;
  fill('#FF9800');
  stroke(100);
  strokeWeight(1);
  rect(randX, buttonY, 90, buttonH, 5);
  fill(255);
  noStroke();
  text('Random', randX + 45, buttonY + buttonH / 2);

  // Reset button
  const resetX = canvasWidth - 90;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 70, buttonH, 5);
  fill(255);
  noStroke();
  text('Reset', resetX + 35, buttonY + buttonH / 2);
}

function mousePressed() {
  const plotX = 20;
  const plotY = 45;
  const plotW = canvasWidth * 0.65;
  const plotH = drawHeight - 60;

  // Check if clicking on a point
  for (let ms of microsims) {
    const px = plotX + ms.x * plotW;
    const py = plotY + (1 - ms.y) * plotH;

    if (dist(mouseX, mouseY, px, py) < 15) {
      selectedPoint = ms;
      return;
    }
  }

  // Check controls
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // K slider
  const sliderX = 70;
  const sliderW = 120;
  if (mouseX >= sliderX && mouseX <= sliderX + sliderW &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    kValue = Math.round(1 + 14 * (mouseX - sliderX) / sliderW);
    kValue = constrain(kValue, 1, 15);
    return;
  }

  // Show Circles toggle
  if (mouseX >= 220 && mouseX <= 330 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showDistanceCircles = !showDistanceCircles;
    return;
  }

  // Show Lines toggle
  if (mouseX >= 340 && mouseX <= 440 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showConnectionLines = !showConnectionLines;
    return;
  }

  // Random button
  if (mouseX >= 460 && mouseX <= 550 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    selectedPoint = microsims[Math.floor(Math.random() * microsims.length)];
    return;
  }

  // Reset button
  const resetX = canvasWidth - 90;
  if (mouseX >= resetX && mouseX <= resetX + 70 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    selectedPoint = microsims[0];
    kValue = 5;
    showDistanceCircles = true;
    showConnectionLines = true;
    return;
  }
}

function mouseDragged() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;
  const sliderX = 70;
  const sliderW = 120;

  if (mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    if (mouseX >= sliderX - 10 && mouseX <= sliderX + sliderW + 10) {
      kValue = Math.round(1 + 14 * (mouseX - sliderX) / sliderW);
      kValue = constrain(kValue, 1, 15);
    }
  }
}

function mouseMoved() {
  const plotX = 20;
  const plotY = 45;
  const plotW = canvasWidth * 0.65;
  const plotH = drawHeight - 60;

  hoveredPoint = null;

  for (let ms of microsims) {
    const px = plotX + ms.x * plotW;
    const py = plotY + (1 - ms.y) * plotH;

    if (dist(mouseX, mouseY, px, py) < 15) {
      hoveredPoint = ms;
      cursor(HAND);
      return;
    }
  }

  const buttonY = drawHeight + 18;
  if (mouseY >= buttonY && mouseY <= buttonY + 32) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
