// PCA vs t-SNE Comparison MicroSim
// Side-by-side visualization of two dimensionality reduction techniques

let canvasWidth = 800;
const drawHeight = 480;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Sample MicroSims with both PCA and t-SNE projections
const microsims = [
  // Physics (blue) - PCA spreads, t-SNE clusters
  { id: 1, title: "Pendulum", subject: "Physics", pca: {x: 0.2, y: 0.4}, tsne: {x: 0.15, y: 0.25}, color: [70, 130, 180] },
  { id: 2, title: "Wave", subject: "Physics", pca: {x: 0.25, y: 0.45}, tsne: {x: 0.2, y: 0.22}, color: [70, 130, 180] },
  { id: 3, title: "Projectile", subject: "Physics", pca: {x: 0.18, y: 0.35}, tsne: {x: 0.18, y: 0.28}, color: [70, 130, 180] },
  { id: 4, title: "Circuit", subject: "Physics", pca: {x: 0.3, y: 0.5}, tsne: {x: 0.22, y: 0.2}, color: [70, 130, 180] },
  { id: 5, title: "Optics", subject: "Physics", pca: {x: 0.22, y: 0.42}, tsne: {x: 0.17, y: 0.3}, color: [70, 130, 180] },

  // Chemistry (green)
  { id: 6, title: "Molecule", subject: "Chemistry", pca: {x: 0.6, y: 0.3}, tsne: {x: 0.75, y: 0.2}, color: [60, 179, 113] },
  { id: 7, title: "Reaction", subject: "Chemistry", pca: {x: 0.65, y: 0.35}, tsne: {x: 0.8, y: 0.18}, color: [60, 179, 113] },
  { id: 8, title: "pH Scale", subject: "Chemistry", pca: {x: 0.58, y: 0.28}, tsne: {x: 0.78, y: 0.25}, color: [60, 179, 113] },
  { id: 9, title: "Gas Laws", subject: "Chemistry", pca: {x: 0.62, y: 0.32}, tsne: {x: 0.72, y: 0.22}, color: [60, 179, 113] },

  // Math (purple) - overlaps in PCA, separates in t-SNE
  { id: 10, title: "Graphing", subject: "Math", pca: {x: 0.45, y: 0.55}, tsne: {x: 0.4, y: 0.75}, color: [147, 112, 219] },
  { id: 11, title: "Geometry", subject: "Math", pca: {x: 0.5, y: 0.6}, tsne: {x: 0.35, y: 0.8}, color: [147, 112, 219] },
  { id: 12, title: "Statistics", subject: "Math", pca: {x: 0.48, y: 0.52}, tsne: {x: 0.42, y: 0.72}, color: [147, 112, 219] },
  { id: 13, title: "Algebra", subject: "Math", pca: {x: 0.42, y: 0.58}, tsne: {x: 0.38, y: 0.78}, color: [147, 112, 219] },

  // Biology (orange)
  { id: 14, title: "Cell", subject: "Biology", pca: {x: 0.75, y: 0.65}, tsne: {x: 0.82, y: 0.7}, color: [255, 140, 0] },
  { id: 15, title: "Ecosystem", subject: "Biology", pca: {x: 0.8, y: 0.7}, tsne: {x: 0.78, y: 0.75}, color: [255, 140, 0] },
  { id: 16, title: "Genetics", subject: "Biology", pca: {x: 0.78, y: 0.68}, tsne: {x: 0.85, y: 0.72}, color: [255, 140, 0] },

  // CS (teal) - central in PCA, distinct cluster in t-SNE
  { id: 17, title: "Sorting", subject: "CS", pca: {x: 0.4, y: 0.45}, tsne: {x: 0.5, y: 0.45}, color: [0, 128, 128] },
  { id: 18, title: "Trees", subject: "CS", pca: {x: 0.38, y: 0.48}, tsne: {x: 0.55, y: 0.42}, color: [0, 128, 128] },
  { id: 19, title: "Graphs", subject: "CS", pca: {x: 0.42, y: 0.42}, tsne: {x: 0.48, y: 0.48}, color: [0, 128, 128] }
];

// State
let selectedPoint = null;
let hoveredPoint = null;
let showClusterBoundaries = false;
let linkHover = true;
let colorBy = 'subject';

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
  text('PCA vs t-SNE Comparison', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Calculate plot dimensions
  const plotW = (canvasWidth - 50) / 2;
  const plotH = drawHeight - 70;
  const plotY = 45;

  // Draw PCA plot
  drawPlot(15, plotY, plotW - 5, plotH, 'pca', 'PCA (Linear Projection)');

  // Draw t-SNE plot
  drawPlot(canvasWidth / 2 + 10, plotY, plotW - 5, plotH, 'tsne', 't-SNE (Neighbor Preservation)');

  // Draw controls
  drawControls();
}

function drawPlot(x, y, w, h, type, title) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 4);

  // Title
  fill(50);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text(title, x + w / 2, y + 15);
  textStyle(NORMAL);

  // Cluster boundaries if enabled
  if (showClusterBoundaries) {
    drawClusterBoundaries(x, y + 25, w, h - 30, type);
  }

  // Points
  for (let ms of microsims) {
    const pos = type === 'pca' ? ms.pca : ms.tsne;
    const px = x + pos.x * w;
    const py = y + 25 + (1 - pos.y) * (h - 30);

    const isSelected = selectedPoint && selectedPoint.id === ms.id;
    const isHovered = hoveredPoint && hoveredPoint.id === ms.id;

    // Selection glow
    if (isSelected) {
      noStroke();
      fill(255, 215, 0, 100);
      ellipse(px, py, 30, 30);
    }

    // Point
    fill(...ms.color, isSelected || isHovered ? 255 : 180);
    stroke(isSelected ? color(255, 215, 0) : (isHovered ? 100 : 255));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    ellipse(px, py, 14, 14);

    // Label
    if (isHovered || isSelected) {
      fill(50);
      noStroke();
      textSize(9);
      text(ms.title, px, py - 14);
    }
  }

  // Annotation
  fill(100);
  textSize(8);
  if (type === 'pca') {
    text('Global structure preserved', x + w / 2, y + h - 8);
  } else {
    text('Local clusters clearer', x + w / 2, y + h - 8);
  }
}

function drawClusterBoundaries(x, y, w, h, type) {
  const clusters = {
    Physics: { color: [70, 130, 180, 40] },
    Chemistry: { color: [60, 179, 113, 40] },
    Math: { color: [147, 112, 219, 40] },
    Biology: { color: [255, 140, 0, 40] },
    CS: { color: [0, 128, 128, 40] }
  };

  // Calculate cluster centers
  const clusterCenters = {};
  for (let subject in clusters) {
    const items = microsims.filter(m => m.subject === subject);
    const pos = type === 'pca' ? 'pca' : 'tsne';
    const cx = items.reduce((sum, m) => sum + m[pos].x, 0) / items.length;
    const cy = items.reduce((sum, m) => sum + m[pos].y, 0) / items.length;
    clusterCenters[subject] = { x: cx, y: cy };
  }

  // Draw cluster ellipses
  noStroke();
  for (let subject in clusters) {
    const center = clusterCenters[subject];
    const px = x + center.x * w;
    const py = y + (1 - center.y) * h;

    fill(...clusters[subject].color);
    ellipse(px, py, type === 'tsne' ? 80 : 100, type === 'tsne' ? 70 : 90);
  }
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Show Cluster Boundaries toggle
  const clusterX = 20;
  fill(showClusterBoundaries ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(clusterX, buttonY, 130, buttonH, 5);
  fill(255);
  noStroke();
  textSize(10);
  text(showClusterBoundaries ? 'Hide Clusters' : 'Show Clusters', clusterX + 65, buttonY + buttonH / 2);

  // Link Hover toggle
  const linkX = 165;
  fill(linkHover ? '#2196F3' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(linkX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text(linkHover ? 'Link: ON' : 'Link: OFF', linkX + 50, buttonY + buttonH / 2);

  // Legend
  const legendX = 300;
  const subjects = [
    { name: "Physics", color: [70, 130, 180] },
    { name: "Chemistry", color: [60, 179, 113] },
    { name: "Math", color: [147, 112, 219] },
    { name: "Biology", color: [255, 140, 0] },
    { name: "CS", color: [0, 128, 128] }
  ];

  textAlign(LEFT, CENTER);
  textSize(9);
  let legX = legendX;
  for (let s of subjects) {
    fill(...s.color);
    noStroke();
    ellipse(legX, buttonY + buttonH / 2, 10, 10);
    fill(60);
    text(s.name, legX + 8, buttonY + buttonH / 2);
    legX += 70;
  }
  textAlign(CENTER, CENTER);

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
  const plotW = (canvasWidth - 50) / 2;
  const plotH = drawHeight - 70;
  const plotY = 45;

  // Check PCA plot
  checkPointClick(15, plotY + 25, plotW - 5, plotH - 30, 'pca');

  // Check t-SNE plot
  checkPointClick(canvasWidth / 2 + 10, plotY + 25, plotW - 5, plotH - 30, 'tsne');

  // Check controls
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Show Clusters toggle
  if (mouseX >= 20 && mouseX <= 150 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showClusterBoundaries = !showClusterBoundaries;
    return;
  }

  // Link Hover toggle
  if (mouseX >= 165 && mouseX <= 265 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    linkHover = !linkHover;
    return;
  }

  // Reset button
  const resetX = canvasWidth - 90;
  if (mouseX >= resetX && mouseX <= resetX + 70 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    selectedPoint = null;
    showClusterBoundaries = false;
    linkHover = true;
    return;
  }
}

function checkPointClick(x, y, w, h, type) {
  for (let ms of microsims) {
    const pos = type === 'pca' ? ms.pca : ms.tsne;
    const px = x + pos.x * w;
    const py = y + (1 - pos.y) * h;

    if (dist(mouseX, mouseY, px, py) < 12) {
      selectedPoint = (selectedPoint && selectedPoint.id === ms.id) ? null : ms;
      return true;
    }
  }
  return false;
}

function mouseMoved() {
  const plotW = (canvasWidth - 50) / 2;
  const plotH = drawHeight - 70;
  const plotY = 45;

  hoveredPoint = null;

  // Check PCA plot
  if (checkPointHover(15, plotY + 25, plotW - 5, plotH - 30, 'pca')) {
    cursor(HAND);
    return;
  }

  // Check t-SNE plot
  if (checkPointHover(canvasWidth / 2 + 10, plotY + 25, plotW - 5, plotH - 30, 'tsne')) {
    cursor(HAND);
    return;
  }

  // Check controls
  const buttonY = drawHeight + 18;
  if (mouseY >= buttonY && mouseY <= buttonY + 32) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}

function checkPointHover(x, y, w, h, type) {
  for (let ms of microsims) {
    const pos = type === 'pca' ? ms.pca : ms.tsne;
    const px = x + pos.x * w;
    const py = y + (1 - pos.y) * h;

    if (dist(mouseX, mouseY, px, py) < 12) {
      if (linkHover) {
        hoveredPoint = ms;
      } else {
        hoveredPoint = ms;
      }
      return true;
    }
  }
  return false;
}
