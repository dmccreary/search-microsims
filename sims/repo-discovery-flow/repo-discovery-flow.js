// Repository Discovery Flow - Funnel Visualization
// Shows how repositories are filtered to identify MicroSim collections

let canvasWidth = 800;
const drawHeight = 480;
const controlHeight = 60;

// Funnel stages
const stages = [
  {
    name: 'All User Repositories',
    count: 100,
    color: '#9E9E9E',
    tooltip: 'Starting point: all public repositories for known creators'
  },
  {
    name: 'Name/Description Filter',
    count: 40,
    color: '#64B5F6',
    tooltip: 'Filter by keywords: course, tutorial, microsim, simulation'
  },
  {
    name: 'Structure Check',
    count: 25,
    color: '#42A5F5',
    tooltip: 'Verify docs/sims/ directory exists'
  },
  {
    name: 'Metadata Presence',
    count: 18,
    color: '#1E88E5',
    tooltip: 'At least one valid metadata.json found'
  },
  {
    name: 'Active Repositories',
    count: 15,
    color: '#4CAF50',
    tooltip: 'Updated within the last year, not archived'
  }
];

// Sample repository icons that flow through
let repoIcons = [];
let hoveredStage = null;
let showRejected = false;
let animating = false;
let animProgress = 0;

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 850);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Create repository icons
  createRepoIcons();
}

function createRepoIcons() {
  repoIcons = [];
  for (let i = 0; i < 100; i++) {
    let stageIndex = getStageForRepo(i);
    repoIcons.push({
      id: i,
      finalStage: stageIndex,
      x: 0,
      y: 0,
      rejected: stageIndex < stages.length - 1
    });
  }
}

function getStageForRepo(index) {
  // Distribute repos according to funnel counts
  if (index < 15) return 4;  // Active
  if (index < 18) return 3;  // Metadata present but inactive
  if (index < 25) return 2;  // Structure but no metadata
  if (index < 40) return 1;  // Name matches but no structure
  return 0;  // Filtered at first stage
}

function draw() {
  // Draw area
  fill(248, 249, 250);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill(240, 240, 240);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(18);
  textStyle(BOLD);
  text('Repository Discovery Funnel', canvasWidth / 2, 25);
  textStyle(NORMAL);

  // Draw funnel
  drawFunnel();

  // Draw repo icons in animation mode
  if (animating) {
    drawAnimatedRepos();
    animProgress += 0.005;
    if (animProgress > 1) animProgress = 0;
  }

  // Draw tooltip
  if (hoveredStage !== null) {
    drawTooltip(hoveredStage);
  }

  // Draw controls
  drawControls();
}

function drawFunnel() {
  let funnelTop = 60;
  let funnelBottom = 420;
  let funnelHeight = funnelBottom - funnelTop;
  let stageHeight = funnelHeight / stages.length;

  let maxWidth = canvasWidth * 0.7;
  let minWidth = 120;

  for (let i = 0; i < stages.length; i++) {
    let stage = stages[i];
    let y = funnelTop + i * stageHeight;

    // Width decreases with each stage
    let topWidthRatio = 1 - (i / stages.length) * 0.7;
    let bottomWidthRatio = 1 - ((i + 1) / stages.length) * 0.7;

    let topWidth = maxWidth * topWidthRatio;
    let bottomWidth = maxWidth * bottomWidthRatio;

    let centerX = canvasWidth / 2;

    // Draw trapezoid
    push();
    fill(stage.color);
    stroke(255);
    strokeWeight(2);

    beginShape();
    vertex(centerX - topWidth / 2, y);
    vertex(centerX + topWidth / 2, y);
    vertex(centerX + bottomWidth / 2, y + stageHeight);
    vertex(centerX - bottomWidth / 2, y + stageHeight);
    endShape(CLOSE);

    // Highlight if hovered
    if (hoveredStage === i) {
      fill(255, 255, 255, 50);
      noStroke();
      beginShape();
      vertex(centerX - topWidth / 2, y);
      vertex(centerX + topWidth / 2, y);
      vertex(centerX + bottomWidth / 2, y + stageHeight);
      vertex(centerX - bottomWidth / 2, y + stageHeight);
      endShape(CLOSE);
    }

    // Stage label
    fill(255);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    text(stage.name, centerX, y + stageHeight / 2 - 10);
    textStyle(NORMAL);

    // Count badge
    textSize(20);
    text(stage.count, centerX, y + stageHeight / 2 + 12);

    // Side annotation showing what's filtered
    if (i > 0) {
      let filtered = stages[i - 1].count - stage.count;
      let annotationX = centerX + topWidth / 2 + 50;
      let annotationY = y + 10;

      // Rejected count
      fill(showRejected ? '#f44336' : '#999');
      textSize(12);
      textAlign(LEFT, CENTER);
      text(`-${filtered} repos`, annotationX, annotationY);

      // Arrow pointing to side
      stroke(showRejected ? '#f44336' : '#999');
      strokeWeight(1);
      line(centerX + topWidth / 2 + 5, y + 20, annotationX - 5, annotationY);

      textAlign(CENTER, CENTER);
    }

    pop();
  }

  // Draw flow arrow on left side
  let arrowX = canvasWidth / 2 - maxWidth / 2 - 40;
  drawFlowArrow(arrowX, funnelTop + 20, funnelBottom - 20);
}

function drawFlowArrow(x, y1, y2) {
  push();
  stroke(150);
  strokeWeight(2);
  line(x, y1, x, y2 - 10);

  fill(150);
  noStroke();
  triangle(x, y2, x - 6, y2 - 12, x + 6, y2 - 12);

  // Label
  push();
  translate(x - 15, (y1 + y2) / 2);
  rotate(-PI / 2);
  fill(100);
  textSize(11);
  text('Filter Flow', 0, 0);
  pop();
  pop();
}

function drawAnimatedRepos() {
  let funnelTop = 60;
  let stageHeight = 360 / stages.length;
  let maxWidth = canvasWidth * 0.7;
  let centerX = canvasWidth / 2;

  for (let repo of repoIcons) {
    // Calculate position based on animation progress
    let targetStage = min(repo.finalStage, floor(animProgress * stages.length));
    let withinStageProgress = (animProgress * stages.length) % 1;

    if (animProgress * stages.length < repo.finalStage) {
      // Still flowing down
      let y = funnelTop + (targetStage + withinStageProgress) * stageHeight;
      let widthRatio = 1 - (targetStage / stages.length) * 0.7;
      let spread = maxWidth * widthRatio * 0.4;

      let xOffset = map(repo.id % 20, 0, 20, -spread, spread);
      let x = centerX + xOffset * (1 - withinStageProgress * 0.1);

      // Draw repo icon
      fill(repo.rejected ? '#FFCDD2' : '#C8E6C9');
      stroke(repo.rejected ? '#f44336' : '#4CAF50');
      strokeWeight(1);
      rectMode(CENTER);
      rect(x, y, 12, 10, 2);
    } else if (animProgress * stages.length >= repo.finalStage + 0.5 && repo.rejected && showRejected) {
      // Rejected - float off to the side
      let y = funnelTop + repo.finalStage * stageHeight + 20;
      let widthRatio = 1 - (repo.finalStage / stages.length) * 0.7;
      let baseX = centerX + maxWidth * widthRatio / 2;
      let x = baseX + 30 + (animProgress - repo.finalStage / stages.length) * 200;

      fill('#FFCDD2');
      stroke('#f44336');
      strokeWeight(1);
      rectMode(CENTER);
      push();
      translate(x, y);
      rotate(PI / 6);
      rect(0, 0, 10, 8, 2);
      pop();
    }
  }
}

function drawTooltip(stageIndex) {
  let stage = stages[stageIndex];
  let funnelTop = 60;
  let stageHeight = 360 / stages.length;
  let y = funnelTop + stageIndex * stageHeight + stageHeight / 2;

  let tooltipX = canvasWidth / 2;
  let tooltipY = y;

  // Keep tooltip in bounds
  let boxWidth = 280;
  let boxHeight = 50;

  push();
  // Shadow
  fill(0, 0, 0, 30);
  noStroke();
  rectMode(CENTER);
  rect(tooltipX + 3, tooltipY + 3, boxWidth, boxHeight, 5);

  // Box
  fill(50, 50, 50, 240);
  rect(tooltipX, tooltipY, boxWidth, boxHeight, 5);

  // Text
  fill(255);
  textSize(12);
  text(stage.tooltip, tooltipX, tooltipY);
  pop();
}

function drawControls() {
  let y = drawHeight + 30;

  // Animate button
  fill(animating ? '#f44336' : '#4CAF50');
  noStroke();
  rectMode(CENTER);
  rect(80, y, 100, 32, 5);
  fill(255);
  textSize(12);
  text(animating ? 'Stop' : 'Animate Flow', 80, y);

  // Show rejected toggle
  fill(showRejected ? '#2196F3' : '#9E9E9E');
  rect(220, y, 130, 32, 5);
  fill(255);
  text(showRejected ? 'Hide Rejected' : 'Show Rejected', 220, y);

  // Statistics
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text(`Conversion: ${stages[stages.length - 1].count}/${stages[0].count} = ${(stages[stages.length - 1].count / stages[0].count * 100).toFixed(0)}%`, 320, y);

  textAlign(CENTER, CENTER);

  // Instructions
  fill(100);
  textSize(10);
  text('Hover over stages for details', canvasWidth - 100, y);
}

function mouseMoved() {
  hoveredStage = null;

  let funnelTop = 60;
  let stageHeight = 360 / stages.length;

  for (let i = 0; i < stages.length; i++) {
    let y = funnelTop + i * stageHeight;
    if (mouseY >= y && mouseY < y + stageHeight && mouseY < drawHeight) {
      hoveredStage = i;
      break;
    }
  }
}

function mousePressed() {
  if (mouseY > drawHeight && mouseY < drawHeight + controlHeight) {
    // Animate button
    if (mouseX > 30 && mouseX < 130) {
      animating = !animating;
      if (animating) animProgress = 0;
    }
    // Show rejected toggle
    if (mouseX > 155 && mouseX < 285) {
      showRejected = !showRejected;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
