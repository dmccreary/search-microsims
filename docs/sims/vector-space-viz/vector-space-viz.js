// Vector Space Visualization MicroSim
// Shows how embeddings position similar items near each other

let canvasWidth = 800;
const drawHeight = 450;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Sample MicroSim data with 2D positions (simulated embeddings)
const microsims = [
  // Physics cluster (blue)
  { id: 1, title: "Pendulum", subject: "Physics", x: 0.2, y: 0.3, color: [70, 130, 180] },
  { id: 2, title: "Wave Motion", subject: "Physics", x: 0.25, y: 0.25, color: [70, 130, 180] },
  { id: 3, title: "Projectile", subject: "Physics", x: 0.18, y: 0.35, color: [70, 130, 180] },
  { id: 4, title: "Circuit Sim", subject: "Physics", x: 0.3, y: 0.28, color: [70, 130, 180] },
  { id: 5, title: "Magnet Field", subject: "Physics", x: 0.22, y: 0.38, color: [70, 130, 180] },

  // Chemistry cluster (green)
  { id: 6, title: "Molecule Viewer", subject: "Chemistry", x: 0.7, y: 0.25, color: [60, 179, 113] },
  { id: 7, title: "Reaction Sim", subject: "Chemistry", x: 0.75, y: 0.3, color: [60, 179, 113] },
  { id: 8, title: "pH Scale", subject: "Chemistry", x: 0.68, y: 0.32, color: [60, 179, 113] },
  { id: 9, title: "Gas Laws", subject: "Chemistry", x: 0.72, y: 0.2, color: [60, 179, 113] },

  // Math cluster (purple)
  { id: 10, title: "Graphing Tool", subject: "Math", x: 0.4, y: 0.7, color: [147, 112, 219] },
  { id: 11, title: "Geometry Proof", subject: "Math", x: 0.45, y: 0.75, color: [147, 112, 219] },
  { id: 12, title: "Statistics", subject: "Math", x: 0.38, y: 0.68, color: [147, 112, 219] },
  { id: 13, title: "Algebra Solver", subject: "Math", x: 0.42, y: 0.72, color: [147, 112, 219] },

  // Biology cluster (orange)
  { id: 14, title: "Ecosystem", subject: "Biology", x: 0.8, y: 0.7, color: [255, 140, 0] },
  { id: 15, title: "Cell Division", subject: "Biology", x: 0.78, y: 0.75, color: [255, 140, 0] }
];

// State
let selectedPoint = null;
let numNeighbors = 3;
let showClusters = true;
let showDistances = false;
let hoveredPoint = null;

// View state
let viewOffset = { x: 0, y: 0 };
let viewScale = 1;

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
  text('Vector Space Visualization', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Calculate plot area
  const plotX = 20;
  const plotY = 45;
  const plotW = canvasWidth * 0.7;
  const plotH = drawHeight - 60;

  // Draw plot background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(plotX, plotY, plotW, plotH, 4);

  // Draw cluster backgrounds if enabled
  if (showClusters) {
    drawClusterBackgrounds(plotX, plotY, plotW, plotH);
  }

  // Find neighbors of selected point
  let neighbors = [];
  if (selectedPoint) {
    neighbors = findNeighbors(selectedPoint, numNeighbors);
  }

  // Draw distance lines if enabled
  if (showDistances && selectedPoint) {
    drawDistanceLines(plotX, plotY, plotW, plotH, neighbors);
  }

  // Draw points
  for (let ms of microsims) {
    const px = plotX + ms.x * plotW;
    const py = plotY + (1 - ms.y) * plotH; // Flip Y

    const isSelected = selectedPoint && selectedPoint.id === ms.id;
    const isNeighbor = neighbors.some(n => n.ms.id === ms.id);
    const isHovered = hoveredPoint && hoveredPoint.id === ms.id;

    // Point glow for selected/hovered
    if (isSelected) {
      noStroke();
      fill(255, 215, 0, 100);
      ellipse(px, py, 35, 35);
    } else if (isNeighbor) {
      noStroke();
      fill(...ms.color, 50);
      ellipse(px, py, 30, 30);
    }

    // Point
    fill(...ms.color, isSelected || isNeighbor ? 255 : 180);
    stroke(isSelected ? color(255, 215, 0) : (isHovered ? 100 : 255));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    ellipse(px, py, 18, 18);

    // Label on hover
    if (isHovered || isSelected) {
      fill(50);
      noStroke();
      textSize(10);
      text(ms.title, px, py - 18);
    }
  }

  // Draw side panel
  drawSidePanel(plotX + plotW + 15, plotY, canvasWidth - plotX - plotW - 35, plotH, neighbors);

  // Draw legend
  drawLegend(plotX + 10, plotY + plotH - 80);

  // Draw controls
  drawControls();
}

function drawClusterBackgrounds(plotX, plotY, plotW, plotH) {
  const clusters = [
    { subject: "Physics", cx: 0.23, cy: 0.3, color: [70, 130, 180, 30] },
    { subject: "Chemistry", cx: 0.71, cy: 0.27, color: [60, 179, 113, 30] },
    { subject: "Math", cx: 0.41, cy: 0.71, color: [147, 112, 219, 30] },
    { subject: "Biology", cx: 0.79, cy: 0.72, color: [255, 140, 0, 30] }
  ];

  noStroke();
  for (let cluster of clusters) {
    fill(...cluster.color);
    const cx = plotX + cluster.cx * plotW;
    const cy = plotY + (1 - cluster.cy) * plotH;
    ellipse(cx, cy, 120, 100);
  }
}

function drawDistanceLines(plotX, plotY, plotW, plotH, neighbors) {
  if (!selectedPoint) return;

  const sx = plotX + selectedPoint.x * plotW;
  const sy = plotY + (1 - selectedPoint.y) * plotH;

  for (let i = 0; i < neighbors.length; i++) {
    const n = neighbors[i];
    const nx = plotX + n.ms.x * plotW;
    const ny = plotY + (1 - n.ms.y) * plotH;

    // Distance line
    stroke(100, 150);
    strokeWeight(1);
    setLineDash([5, 5]);
    line(sx, sy, nx, ny);
    setLineDash([]);

    // Distance label
    const mx = (sx + nx) / 2;
    const my = (sy + ny) / 2;
    fill(80);
    noStroke();
    textSize(9);
    text(n.distance.toFixed(2), mx, my - 8);
  }
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function findNeighbors(point, k) {
  const distances = microsims
    .filter(ms => ms.id !== point.id)
    .map(ms => ({
      ms,
      distance: dist(point.x, point.y, ms.x, ms.y)
    }))
    .sort((a, b) => a.distance - b.distance);

  return distances.slice(0, k);
}

function drawSidePanel(x, y, w, h, neighbors) {
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
  text('Information', x + 10, y + 10);
  textStyle(NORMAL);

  let yPos = y + 35;

  // Selected point info
  if (selectedPoint) {
    fill(70);
    textSize(10);
    textStyle(BOLD);
    text('Selected:', x + 10, yPos);
    textStyle(NORMAL);
    yPos += 15;

    fill(50);
    text(selectedPoint.title, x + 15, yPos);
    yPos += 14;
    fill(100);
    text('Subject: ' + selectedPoint.subject, x + 15, yPos);
    yPos += 25;

    // Neighbors
    fill(70);
    textStyle(BOLD);
    text('Nearest Neighbors:', x + 10, yPos);
    textStyle(NORMAL);
    yPos += 18;

    for (let i = 0; i < neighbors.length; i++) {
      const n = neighbors[i];
      const similarity = 1 - n.distance; // Convert distance to similarity

      // Color bar
      const barW = map(similarity, 0, 1, 0, 60);
      fill(...n.ms.color, 150);
      noStroke();
      rect(x + 10, yPos, barW, 12, 2);

      // Text
      fill(50);
      textSize(9);
      text((i + 1) + '. ' + n.ms.title, x + 75, yPos + 2);
      fill(100);
      text((similarity * 100).toFixed(0) + '%', x + w - 30, yPos + 2);
      yPos += 18;
    }
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
    { name: "Biology", color: [255, 140, 0] }
  ];

  fill(255, 240);
  stroke(200);
  rect(x, y, 85, 75, 4);

  textAlign(LEFT, CENTER);
  textSize(9);

  let yPos = y + 12;
  for (let s of subjects) {
    fill(...s.color);
    noStroke();
    ellipse(x + 12, yPos, 10, 10);
    fill(60);
    text(s.name, x + 22, yPos);
    yPos += 16;
  }

  textAlign(CENTER, CENTER);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Neighbors slider label
  fill(60);
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  text('Neighbors: ' + numNeighbors, 20, buttonY + buttonH / 2);

  // Minus button
  fill(200);
  stroke(150);
  rect(100, buttonY + 5, 24, 22, 3);
  fill(60);
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  text('-', 112, buttonY + 15);

  // Plus button
  fill(200);
  stroke(150);
  rect(130, buttonY + 5, 24, 22, 3);
  fill(60);
  noStroke();
  text('+', 142, buttonY + 15);

  // Show Clusters toggle
  const clusterX = 180;
  fill(showClusters ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  rect(clusterX, buttonY, 110, buttonH, 5);
  fill(255);
  noStroke();
  textSize(10);
  text(showClusters ? 'Hide Clusters' : 'Show Clusters', clusterX + 55, buttonY + buttonH / 2);

  // Show Distances toggle
  const distX = 300;
  fill(showDistances ? '#2196F3' : '#9E9E9E');
  stroke(100);
  rect(distX, buttonY, 110, buttonH, 5);
  fill(255);
  noStroke();
  text(showDistances ? 'Hide Lines' : 'Show Lines', distX + 55, buttonY + buttonH / 2);

  // Reset button
  const resetX = canvasWidth - 100;
  fill('#f44336');
  stroke(100);
  rect(resetX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  textSize(11);
  text('Reset', resetX + 40, buttonY + buttonH / 2);
}

function mousePressed() {
  const plotX = 20;
  const plotY = 45;
  const plotW = canvasWidth * 0.7;
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

  // Check control buttons
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Minus button
  if (mouseX >= 100 && mouseX <= 124 && mouseY >= buttonY + 5 && mouseY <= buttonY + 27) {
    numNeighbors = max(1, numNeighbors - 1);
    return;
  }

  // Plus button
  if (mouseX >= 130 && mouseX <= 154 && mouseY >= buttonY + 5 && mouseY <= buttonY + 27) {
    numNeighbors = min(10, numNeighbors + 1);
    return;
  }

  // Show Clusters toggle
  if (mouseX >= 180 && mouseX <= 290 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showClusters = !showClusters;
    return;
  }

  // Show Distances toggle
  if (mouseX >= 300 && mouseX <= 410 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showDistances = !showDistances;
    return;
  }

  // Reset button
  const resetX = canvasWidth - 100;
  if (mouseX >= resetX && mouseX <= resetX + 80 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    selectedPoint = microsims[0];
    numNeighbors = 3;
    showClusters = true;
    showDistances = false;
    return;
  }
}

function mouseMoved() {
  const plotX = 20;
  const plotY = 45;
  const plotW = canvasWidth * 0.7;
  const plotH = drawHeight - 60;

  hoveredPoint = null;

  // Check hover on points
  for (let ms of microsims) {
    const px = plotX + ms.x * plotW;
    const py = plotY + (1 - ms.y) * plotH;

    if (dist(mouseX, mouseY, px, py) < 15) {
      hoveredPoint = ms;
      cursor(HAND);
      return;
    }
  }

  // Check hover on controls
  const buttonY = drawHeight + 18;
  if (mouseY >= buttonY && mouseY <= buttonY + 32) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
