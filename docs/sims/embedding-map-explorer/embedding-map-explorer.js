// Embedding Map Explorer MicroSim
// Interactive exploration of MicroSim collection organized by semantic similarity

let canvasWidth = 800;
const drawHeight = 530;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Sample MicroSims with positions (simulating t-SNE projection)
const microsims = [
  // Physics cluster
  { id: 1, title: "Pendulum Lab", subject: "Physics", subcluster: "Mechanics", x: 0.12, y: 0.25, quality: 92 },
  { id: 2, title: "Wave Simulator", subject: "Physics", subcluster: "Waves", x: 0.18, y: 0.35, quality: 88 },
  { id: 3, title: "Projectile Motion", subject: "Physics", subcluster: "Mechanics", x: 0.15, y: 0.22, quality: 85 },
  { id: 4, title: "Circuit Builder", subject: "Physics", subcluster: "E&M", x: 0.22, y: 0.28, quality: 90 },
  { id: 5, title: "Optics Explorer", subject: "Physics", subcluster: "Waves", x: 0.2, y: 0.38, quality: 87 },
  { id: 6, title: "Spring Mass", subject: "Physics", subcluster: "Mechanics", x: 0.1, y: 0.28, quality: 84 },
  { id: 7, title: "Sound Waves", subject: "Physics", subcluster: "Waves", x: 0.16, y: 0.4, quality: 82 },
  { id: 8, title: "Electric Fields", subject: "Physics", subcluster: "E&M", x: 0.25, y: 0.32, quality: 89 },

  // Chemistry cluster
  { id: 9, title: "Molecule Viewer", subject: "Chemistry", subcluster: "Molecular", x: 0.72, y: 0.18, quality: 91 },
  { id: 10, title: "Reaction Rates", subject: "Chemistry", subcluster: "Reactions", x: 0.78, y: 0.25, quality: 86 },
  { id: 11, title: "pH Calculator", subject: "Chemistry", subcluster: "Reactions", x: 0.75, y: 0.3, quality: 83 },
  { id: 12, title: "Gas Laws", subject: "Chemistry", subcluster: "Molecular", x: 0.68, y: 0.22, quality: 88 },
  { id: 13, title: "Electron Orbitals", subject: "Chemistry", subcluster: "Molecular", x: 0.7, y: 0.15, quality: 90 },

  // Math cluster
  { id: 14, title: "Function Grapher", subject: "Math", subcluster: "Algebra", x: 0.35, y: 0.7, quality: 94 },
  { id: 15, title: "Geometry Proofs", subject: "Math", subcluster: "Geometry", x: 0.42, y: 0.78, quality: 87 },
  { id: 16, title: "Statistics Lab", subject: "Math", subcluster: "Statistics", x: 0.38, y: 0.65, quality: 89 },
  { id: 17, title: "Probability Sim", subject: "Math", subcluster: "Statistics", x: 0.4, y: 0.62, quality: 85 },
  { id: 18, title: "Calculus Viz", subject: "Math", subcluster: "Algebra", x: 0.32, y: 0.72, quality: 91 },
  { id: 19, title: "Triangle Centers", subject: "Math", subcluster: "Geometry", x: 0.45, y: 0.75, quality: 86 },

  // Biology cluster
  { id: 20, title: "Cell Division", subject: "Biology", subcluster: "Cells", x: 0.8, y: 0.68, quality: 93 },
  { id: 21, title: "Ecosystem Model", subject: "Biology", subcluster: "Ecosystems", x: 0.75, y: 0.72, quality: 88 },
  { id: 22, title: "Genetics Lab", subject: "Biology", subcluster: "Cells", x: 0.82, y: 0.65, quality: 90 },
  { id: 23, title: "Food Web", subject: "Biology", subcluster: "Ecosystems", x: 0.72, y: 0.75, quality: 84 },
  { id: 24, title: "DNA Replication", subject: "Biology", subcluster: "Cells", x: 0.85, y: 0.7, quality: 92 },

  // CS cluster
  { id: 25, title: "Sorting Visualizer", subject: "CS", subcluster: "Algorithms", x: 0.5, y: 0.42, quality: 95 },
  { id: 26, title: "Tree Traversal", subject: "CS", subcluster: "Data Structures", x: 0.55, y: 0.48, quality: 89 },
  { id: 27, title: "Graph Algorithms", subject: "CS", subcluster: "Algorithms", x: 0.48, y: 0.45, quality: 91 },
  { id: 28, title: "Hash Tables", subject: "CS", subcluster: "Data Structures", x: 0.58, y: 0.5, quality: 87 },
  { id: 29, title: "Binary Search", subject: "CS", subcluster: "Algorithms", x: 0.52, y: 0.4, quality: 86 }
];

// Colors
const subjectColors = {
  Physics: [70, 130, 180],
  Chemistry: [60, 179, 113],
  Math: [147, 112, 219],
  Biology: [255, 140, 0],
  CS: [0, 128, 128]
};

// State
let selectedPoint = null;
let hoveredPoint = null;
let searchQuery = "";
let visibleSubjects = { Physics: true, Chemistry: true, Math: true, Biology: true, CS: true };
let pointSize = 1; // Scale factor
let showLabels = false;
let viewOffset = { x: 0, y: 0 };
let viewScale = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

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
  text('MicroSim Embedding Map Explorer', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Main plot area
  const plotX = 15;
  const plotY = 45;
  const plotW = canvasWidth * 0.75;
  const plotH = drawHeight - 60;

  drawPlot(plotX, plotY, plotW, plotH);

  // Side panel
  const panelX = plotX + plotW + 10;
  const panelW = canvasWidth - panelX - 15;
  drawSidePanel(panelX, plotY, panelW, plotH);

  // Draw controls
  drawControls();
}

function drawPlot(x, y, w, h) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 4);

  // Filter visible microsims
  const visibleItems = microsims.filter(ms => {
    if (!visibleSubjects[ms.subject]) return false;
    if (searchQuery && !ms.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Highlight search matches
  const searchMatches = searchQuery ?
    microsims.filter(ms => ms.title.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  // Draw points
  for (let ms of microsims) {
    const isVisible = visibleItems.includes(ms);
    const isMatch = searchMatches.includes(ms);

    const px = x + 20 + ms.x * (w - 40);
    const py = y + 20 + (1 - ms.y) * (h - 40);

    const isSelected = selectedPoint && selectedPoint.id === ms.id;
    const isHovered = hoveredPoint && hoveredPoint.id === ms.id;

    // Skip if not visible
    if (!isVisible && !isMatch) continue;

    // Size based on quality score
    const baseSize = map(ms.quality, 80, 95, 10, 18) * pointSize;

    // Search match glow
    if (isMatch && searchQuery) {
      noStroke();
      fill(255, 255, 0, 100);
      ellipse(px, py, baseSize + 15, baseSize + 15);
    }

    // Selection glow
    if (isSelected) {
      noStroke();
      fill(255, 215, 0, 100);
      ellipse(px, py, baseSize + 12, baseSize + 12);
    }

    // Point
    const alpha = isVisible ? (isSelected || isHovered ? 255 : 200) : 50;
    fill(...subjectColors[ms.subject], alpha);
    stroke(isSelected ? color(255, 215, 0) : (isHovered ? 100 : 255));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    ellipse(px, py, baseSize, baseSize);

    // Label
    if (showLabels || isHovered || isSelected) {
      fill(50, alpha);
      noStroke();
      textSize(8);
      text(ms.title, px, py - baseSize / 2 - 8);
    }
  }

  // Cluster labels
  drawClusterLabels(x, y, w, h);
}

function drawClusterLabels(x, y, w, h) {
  const clusterCenters = {
    Physics: { x: 0.16, y: 0.3, label: "Physics" },
    Chemistry: { x: 0.72, y: 0.22, label: "Chemistry" },
    Math: { x: 0.38, y: 0.7, label: "Math" },
    Biology: { x: 0.78, y: 0.7, label: "Biology" },
    CS: { x: 0.52, y: 0.45, label: "CS" }
  };

  fill(100, 80);
  noStroke();
  textSize(11);
  textStyle(ITALIC);

  for (let subject in clusterCenters) {
    if (!visibleSubjects[subject]) continue;
    const c = clusterCenters[subject];
    const px = x + 20 + c.x * (w - 40);
    const py = y + 20 + (1 - c.y) * (h - 40) + 50;
    text(c.label, px, py);
  }

  textStyle(NORMAL);
}

function drawSidePanel(x, y, w, h) {
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
  textAlign(LEFT, TOP);
  text('Filters', x + 10, y + 10);
  textStyle(NORMAL);

  let yPos = y + 35;

  // Subject filter checkboxes
  for (let subject in visibleSubjects) {
    const isChecked = visibleSubjects[subject];

    // Checkbox
    fill(isChecked ? subjectColors[subject] : 255);
    stroke(isChecked ? subjectColors[subject] : 150);
    strokeWeight(1);
    rect(x + 10, yPos, 14, 14, 2);

    if (isChecked) {
      stroke(255);
      strokeWeight(2);
      line(x + 13, yPos + 7, x + 17, yPos + 11);
      line(x + 17, yPos + 11, x + 22, yPos + 4);
    }

    // Label
    fill(60);
    noStroke();
    textSize(10);
    text(subject, x + 30, yPos + 2);

    yPos += 22;
  }

  yPos += 15;

  // Selected point details
  if (selectedPoint) {
    stroke(220);
    line(x + 10, yPos, x + w - 10, yPos);
    yPos += 15;

    fill(50);
    textSize(10);
    textStyle(BOLD);
    text('Selected:', x + 10, yPos);
    textStyle(NORMAL);
    yPos += 16;

    fill(...subjectColors[selectedPoint.subject]);
    textSize(11);
    textStyle(BOLD);
    text(selectedPoint.title, x + 10, yPos);
    textStyle(NORMAL);
    yPos += 16;

    fill(80);
    textSize(9);
    text('Subject: ' + selectedPoint.subject, x + 10, yPos);
    yPos += 14;
    text('Area: ' + selectedPoint.subcluster, x + 10, yPos);
    yPos += 14;
    text('Quality: ' + selectedPoint.quality + '%', x + 10, yPos);
    yPos += 20;

    // Find similar
    fill(70);
    textStyle(BOLD);
    text('Similar:', x + 10, yPos);
    textStyle(NORMAL);
    yPos += 16;

    const similar = findSimilar(selectedPoint, 3);
    for (let s of similar) {
      fill(...subjectColors[s.ms.subject], 150);
      noStroke();
      ellipse(x + 16, yPos + 5, 8, 8);

      fill(60);
      textSize(9);
      text(s.ms.title, x + 24, yPos);

      fill(100);
      text(Math.round(s.similarity * 100) + '%', x + w - 30, yPos);
      yPos += 16;
    }
  } else {
    yPos += 20;
    fill(100);
    textSize(9);
    text('Click a point for details', x + 10, yPos);
  }

  // Stats at bottom
  yPos = y + h - 45;
  stroke(220);
  line(x + 10, yPos, x + w - 10, yPos);
  yPos += 12;

  const visibleCount = microsims.filter(ms => visibleSubjects[ms.subject]).length;
  fill(80);
  textSize(9);
  text('Showing: ' + visibleCount + '/' + microsims.length, x + 10, yPos);
  yPos += 14;

  if (searchQuery) {
    const matchCount = microsims.filter(ms => ms.title.toLowerCase().includes(searchQuery.toLowerCase())).length;
    text('Search matches: ' + matchCount, x + 10, yPos);
  }

  textAlign(CENTER, CENTER);
}

function findSimilar(point, k) {
  return microsims
    .filter(ms => ms.id !== point.id)
    .map(ms => ({
      ms,
      similarity: 1 - dist(point.x, point.y, ms.x, ms.y)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Search box
  fill(255);
  stroke(150);
  strokeWeight(1);
  rect(20, buttonY + 2, 150, buttonH - 4, 4);

  fill(searchQuery ? 50 : 150);
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  text(searchQuery || 'Search...', 28, buttonY + buttonH / 2);

  // Show Labels toggle
  const labelX = 190;
  fill(showLabels ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(labelX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(10);
  text(showLabels ? 'Hide Labels' : 'Show Labels', labelX + 50, buttonY + buttonH / 2);

  // Point Size
  fill(60);
  textAlign(LEFT, CENTER);
  text('Size:', 310, buttonY + buttonH / 2);

  const sizeSliderX = 345;
  const sizeSliderW = 80;
  fill(200);
  noStroke();
  rect(sizeSliderX, buttonY + buttonH / 2 - 3, sizeSliderW, 6, 3);

  fill(70, 130, 180);
  rect(sizeSliderX, buttonY + buttonH / 2 - 3, sizeSliderW * pointSize, 6, 3);

  fill(255);
  stroke(70, 130, 180);
  strokeWeight(2);
  ellipse(sizeSliderX + sizeSliderW * pointSize, buttonY + buttonH / 2, 14, 14);

  // Reset View button
  const resetX = canvasWidth - 100;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text('Reset', resetX + 40, buttonY + buttonH / 2);
}

function mousePressed() {
  const plotX = 15;
  const plotY = 45;
  const plotW = canvasWidth * 0.75;
  const plotH = drawHeight - 60;

  // Check plot points
  for (let ms of microsims) {
    if (!visibleSubjects[ms.subject]) continue;

    const px = plotX + 20 + ms.x * (plotW - 40);
    const py = plotY + 20 + (1 - ms.y) * (plotH - 40);
    const size = map(ms.quality, 80, 95, 10, 18) * pointSize;

    if (dist(mouseX, mouseY, px, py) < size / 2 + 5) {
      selectedPoint = (selectedPoint && selectedPoint.id === ms.id) ? null : ms;
      return;
    }
  }

  // Check filter checkboxes
  const panelX = plotX + plotW + 10;
  let yPos = plotY + 35;
  for (let subject in visibleSubjects) {
    if (mouseX >= panelX + 10 && mouseX <= panelX + 24 &&
        mouseY >= yPos && mouseY <= yPos + 14) {
      visibleSubjects[subject] = !visibleSubjects[subject];
      return;
    }
    yPos += 22;
  }

  // Check controls
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Search box
  if (mouseX >= 20 && mouseX <= 170 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    const query = prompt('Search MicroSims:', searchQuery);
    if (query !== null) searchQuery = query;
    return;
  }

  // Show Labels toggle
  if (mouseX >= 190 && mouseX <= 290 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showLabels = !showLabels;
    return;
  }

  // Reset button
  const resetX = canvasWidth - 100;
  if (mouseX >= resetX && mouseX <= resetX + 80 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    selectedPoint = null;
    searchQuery = "";
    showLabels = false;
    pointSize = 1;
    for (let s in visibleSubjects) visibleSubjects[s] = true;
    return;
  }
}

function mouseDragged() {
  const buttonY = drawHeight + 18;
  const sizeSliderX = 345;
  const sizeSliderW = 80;

  if (mouseY >= buttonY && mouseY <= buttonY + 32) {
    if (mouseX >= sizeSliderX - 10 && mouseX <= sizeSliderX + sizeSliderW + 10) {
      pointSize = constrain((mouseX - sizeSliderX) / sizeSliderW, 0.3, 1.5);
    }
  }
}

function mouseMoved() {
  const plotX = 15;
  const plotY = 45;
  const plotW = canvasWidth * 0.75;
  const plotH = drawHeight - 60;

  hoveredPoint = null;

  for (let ms of microsims) {
    if (!visibleSubjects[ms.subject]) continue;

    const px = plotX + 20 + ms.x * (plotW - 40);
    const py = plotY + 20 + (1 - ms.y) * (plotH - 40);
    const size = map(ms.quality, 80, 95, 10, 18) * pointSize;

    if (dist(mouseX, mouseY, px, py) < size / 2 + 5) {
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

  const panelX = plotX + plotW + 10;
  if (mouseX >= panelX && mouseY >= plotY + 35 && mouseY <= plotY + 35 + 110) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
