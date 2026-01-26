// MicroSim Collection Quality Dashboard
// Multi-panel dashboard for assessing collection quality

let canvasWidth = 850;
const drawHeight = 500;
const controlHeight = 60;

// Sample data for the dashboard
const collectionData = {
  total: 432,
  previousTotal: 418,
  repositories: 42,
  avgQuality: 76,
  bySubject: {
    'Mathematics': 145,
    'Physics': 98,
    'Computer Science': 72,
    'Chemistry': 48,
    'Biology': 42,
    'Other': 27
  },
  byGrade: {
    'K-5': 45,
    '6-8': 87,
    '9-12': 156,
    'Undergraduate': 112,
    'Graduate': 32
  },
  qualityDistribution: {
    high: 187,    // 80+
    medium: 168,  // 50-79
    low: 77       // <50
  },
  fieldCompleteness: {
    'title*': 100,
    'description*': 100,
    'subject': 94,
    'gradeLevel': 89,
    'framework': 97,
    'learningObjectives': 62,
    'bloomsTaxonomy': 58,
    'visualizationType': 71,
    'keywords': 45
  },
  topRepos: [
    { name: 'geometry-course', count: 48, quality: 92 },
    { name: 'physics-simulations', count: 42, quality: 87 },
    { name: 'chemistry-viz', count: 35, quality: 83 },
    { name: 'biology-cells', count: 28, quality: 78 },
    { name: 'cs-algorithms', count: 24, quality: 85 }
  ]
};

let showIssues = false;
let hoveredPanel = null;
let selectedSubject = null;

// Colors
const subjectColors = {
  'Mathematics': '#4CAF50',
  'Physics': '#2196F3',
  'Computer Science': '#9C27B0',
  'Chemistry': '#FF9800',
  'Biology': '#E91E63',
  'Other': '#9E9E9E'
};

const gradeColors = {
  'K-5': '#81D4FA',
  '6-8': '#4FC3F7',
  '9-12': '#29B6F6',
  'Undergraduate': '#03A9F4',
  'Graduate': '#0288D1'
};

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 900);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);
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
  textSize(16);
  textStyle(BOLD);
  text('MicroSim Collection Quality Dashboard', canvasWidth / 2, 18);
  textStyle(NORMAL);

  // Draw dashboard panels
  drawOverviewPanel();
  drawSubjectChart();
  drawQualityPie();
  drawGradeChart();
  drawCompletenessGrid();
  drawRepoTreemap();

  // Draw controls
  drawControls();
}

function drawOverviewPanel() {
  let x = 15;
  let y = 40;
  let w = canvasWidth * 0.22;
  let h = 100;

  // Panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(70);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text('Collection Overview', x + w / 2, y + 15);
  textStyle(NORMAL);

  // Big number
  textSize(36);
  fill(50);
  text(collectionData.total, x + w / 2, y + 50);

  // Trend
  let change = collectionData.total - collectionData.previousTotal;
  let trendColor = change >= 0 ? '#4CAF50' : '#f44336';
  fill(trendColor);
  textSize(12);
  text((change >= 0 ? '↑ ' : '↓ ') + Math.abs(change) + ' from last crawl', x + w / 2, y + 75);

  // Repositories
  fill(100);
  textSize(10);
  text(`From ${collectionData.repositories} repositories`, x + w / 2, y + 90);
}

function drawSubjectChart() {
  let x = canvasWidth * 0.25;
  let y = 40;
  let w = canvasWidth * 0.35;
  let h = 100;

  // Panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(70);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text('Subject Distribution', x + w / 2, y + 15);
  textStyle(NORMAL);

  // Horizontal bar chart
  let subjects = Object.keys(collectionData.bySubject);
  let maxCount = Math.max(...Object.values(collectionData.bySubject));
  let barHeight = 10;
  let barStartX = x + 90;
  let barMaxWidth = w - 120;
  let barY = y + 30;

  for (let i = 0; i < subjects.length; i++) {
    let subject = subjects[i];
    let count = collectionData.bySubject[subject];
    let barWidth = (count / maxCount) * barMaxWidth;

    // Label
    fill(80);
    textSize(9);
    textAlign(RIGHT, CENTER);
    text(subject, barStartX - 5, barY + barHeight / 2);

    // Bar
    fill(subjectColors[subject]);
    noStroke();
    rect(barStartX, barY, barWidth, barHeight, 2);

    // Count
    fill(80);
    textSize(8);
    textAlign(LEFT, CENTER);
    text(count, barStartX + barWidth + 5, barY + barHeight / 2);

    barY += barHeight + 2;
  }

  textAlign(CENTER, CENTER);
}

function drawQualityPie() {
  let x = canvasWidth * 0.62;
  let y = 40;
  let w = canvasWidth * 0.18;
  let h = 100;

  // Panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(70);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text('Quality Score', x + w / 2, y + 15);
  textStyle(NORMAL);

  // Donut chart
  let centerX = x + w / 2;
  let centerY = y + 55;
  let outerR = 30;
  let innerR = 18;

  let total = collectionData.qualityDistribution.high +
              collectionData.qualityDistribution.medium +
              collectionData.qualityDistribution.low;

  let segments = [
    { value: collectionData.qualityDistribution.high, color: '#4CAF50', label: 'High' },
    { value: collectionData.qualityDistribution.medium, color: '#FFC107', label: 'Medium' },
    { value: collectionData.qualityDistribution.low, color: '#f44336', label: 'Low' }
  ];

  let startAngle = -PI / 2;

  for (let seg of segments) {
    let angle = (seg.value / total) * TWO_PI;
    fill(seg.color);
    noStroke();
    arc(centerX, centerY, outerR * 2, outerR * 2, startAngle, startAngle + angle, PIE);
    startAngle += angle;
  }

  // Inner circle (donut hole)
  fill(255);
  noStroke();
  ellipse(centerX, centerY, innerR * 2, innerR * 2);

  // Center text
  fill(50);
  textSize(14);
  textStyle(BOLD);
  text(collectionData.avgQuality + '%', centerX, centerY);
  textStyle(NORMAL);

  // Legend
  textSize(7);
  textAlign(LEFT, CENTER);
  let legendY = y + 88;
  let legendX = x + 8;
  for (let seg of segments) {
    fill(seg.color);
    rect(legendX, legendY - 4, 8, 8, 1);
    fill(80);
    text(seg.label, legendX + 11, legendY);
    legendX += 45;
  }
  textAlign(CENTER, CENTER);
}

function drawGradeChart() {
  let x = canvasWidth * 0.82;
  let y = 40;
  let w = canvasWidth * 0.16;
  let h = 100;

  // Panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(70);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text('Grade Levels', x + w / 2, y + 15);
  textStyle(NORMAL);

  // Stacked area chart simplified as bars
  let grades = Object.keys(collectionData.byGrade);
  let maxCount = Math.max(...Object.values(collectionData.byGrade));
  let barWidth = (w - 30) / grades.length;
  let maxBarHeight = 55;
  let barX = x + 15;
  let baseY = y + h - 15;

  for (let i = 0; i < grades.length; i++) {
    let grade = grades[i];
    let count = collectionData.byGrade[grade];
    let barHeight = (count / maxCount) * maxBarHeight;

    fill(gradeColors[grade]);
    noStroke();
    rect(barX, baseY - barHeight, barWidth - 3, barHeight, 2, 2, 0, 0);

    // Label
    push();
    translate(barX + barWidth / 2 - 1, baseY + 5);
    rotate(PI / 4);
    fill(80);
    textSize(7);
    textAlign(LEFT, CENTER);
    text(grade, 0, 0);
    pop();

    barX += barWidth;
  }

  textAlign(CENTER, CENTER);
}

function drawCompletenessGrid() {
  let x = 15;
  let y = 150;
  let w = canvasWidth * 0.45;
  let h = 145;

  // Panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(70);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text('Field Completeness', x + w / 2, y + 15);
  textStyle(NORMAL);

  // Grid of field cards
  let fields = Object.keys(collectionData.fieldCompleteness);
  let cols = 3;
  let cellW = (w - 30) / cols;
  let cellH = 28;
  let gridX = x + 15;
  let gridY = y + 30;

  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    let pct = collectionData.fieldCompleteness[field];
    let col = i % cols;
    let row = Math.floor(i / cols);
    let cx = gridX + col * cellW;
    let cy = gridY + row * cellH;

    // Cell background with color intensity based on completeness
    let r = map(pct, 0, 100, 255, 76);
    let g = map(pct, 0, 100, 200, 175);
    let b = map(pct, 0, 100, 200, 80);
    fill(r, g, b, 150);
    noStroke();
    rect(cx, cy, cellW - 5, cellH - 3, 3);

    // Field name (required fields marked with *)
    fill(50);
    textSize(9);
    textAlign(LEFT, CENTER);
    let displayName = field.length > 14 ? field.substring(0, 12) + '...' : field;
    text(displayName, cx + 5, cy + cellH / 2 - 4);

    // Percentage
    fill(pct >= 80 ? '#2E7D32' : (pct >= 60 ? '#F57C00' : '#C62828'));
    textSize(10);
    textStyle(BOLD);
    textAlign(RIGHT, CENTER);
    text(pct + '%', cx + cellW - 10, cy + cellH / 2 - 4);
    textStyle(NORMAL);

    // Progress bar
    fill(200);
    rect(cx + 5, cy + cellH - 8, cellW - 15, 4, 2);
    fill(pct >= 80 ? '#4CAF50' : (pct >= 60 ? '#FF9800' : '#f44336'));
    rect(cx + 5, cy + cellH - 8, (cellW - 15) * pct / 100, 4, 2);
  }

  textAlign(CENTER, CENTER);

  // Legend
  fill(100);
  textSize(8);
  text('* = required fields', x + w / 2, y + h - 10);
}

function drawRepoTreemap() {
  let x = canvasWidth * 0.48;
  let y = 150;
  let w = canvasWidth * 0.50;
  let h = 145;

  // Panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(70);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text('Repository Contributions', x + w / 2, y + 15);
  textStyle(NORMAL);

  // Simplified treemap as rectangles
  let repos = collectionData.topRepos;
  let totalCount = repos.reduce((sum, r) => sum + r.count, 0);

  let treeX = x + 10;
  let treeY = y + 30;
  let treeW = w - 20;
  let treeH = h - 50;

  // Calculate layout
  let currentX = treeX;
  let currentY = treeY;
  let rowHeight = treeH / 2;

  // First row: 3 repos
  for (let i = 0; i < 3; i++) {
    let repo = repos[i];
    let boxW = (treeW * repo.count / totalCount) * 1.8;
    boxW = min(boxW, treeW / 2.5);

    // Quality-based color
    let quality = repo.quality;
    let r = map(quality, 60, 100, 255, 76);
    let g = map(quality, 60, 100, 200, 175);
    let b = map(quality, 60, 100, 200, 80);

    fill(r, g, b);
    stroke(255);
    strokeWeight(1);
    rect(currentX, currentY, boxW, rowHeight - 5, 3);

    // Label
    fill(50);
    noStroke();
    textSize(8);
    textStyle(BOLD);
    text(repo.name, currentX + boxW / 2, currentY + rowHeight / 2 - 8);
    textStyle(NORMAL);
    textSize(10);
    text(repo.count, currentX + boxW / 2, currentY + rowHeight / 2 + 5);
    textSize(7);
    fill(80);
    text('Q: ' + repo.quality + '%', currentX + boxW / 2, currentY + rowHeight / 2 + 16);

    currentX += boxW + 5;
  }

  // Second row: 2 repos
  currentX = treeX;
  currentY = treeY + rowHeight;

  for (let i = 3; i < 5; i++) {
    let repo = repos[i];
    let boxW = (treeW * repo.count / totalCount) * 2.2;
    boxW = min(boxW, treeW / 2);

    let quality = repo.quality;
    let r = map(quality, 60, 100, 255, 76);
    let g = map(quality, 60, 100, 200, 175);
    let b = map(quality, 60, 100, 200, 80);

    fill(r, g, b);
    stroke(255);
    strokeWeight(1);
    rect(currentX, currentY, boxW, rowHeight - 5, 3);

    fill(50);
    noStroke();
    textSize(8);
    textStyle(BOLD);
    text(repo.name, currentX + boxW / 2, currentY + rowHeight / 2 - 8);
    textStyle(NORMAL);
    textSize(10);
    text(repo.count, currentX + boxW / 2, currentY + rowHeight / 2 + 5);
    textSize(7);
    fill(80);
    text('Q: ' + repo.quality + '%', currentX + boxW / 2, currentY + rowHeight / 2 + 16);

    currentX += boxW + 5;
  }

  // "Others" box
  let othersCount = collectionData.total - totalCount;
  fill(220);
  stroke(255);
  strokeWeight(1);
  rect(currentX, currentY, treeW - (currentX - treeX) - 5, rowHeight - 5, 3);

  fill(100);
  noStroke();
  textSize(8);
  text('Others', currentX + (treeW - (currentX - treeX) - 5) / 2, currentY + rowHeight / 2 - 5);
  textSize(10);
  text(othersCount, currentX + (treeW - (currentX - treeX) - 5) / 2, currentY + rowHeight / 2 + 8);
}

function drawControls() {
  let y = drawHeight + 30;

  // Show Issues toggle
  fill(showIssues ? '#f44336' : '#9E9E9E');
  noStroke();
  rectMode(CENTER);
  rect(80, y, 120, 32, 5);
  fill(255);
  textSize(11);
  text(showIssues ? 'Hide Issues' : 'Show Only Issues', 80, y);

  // Export button
  fill('#2196F3');
  rect(190, y, 90, 32, 5);
  fill(255);
  text('Export Report', 190, y);

  // Quality legend
  fill(80);
  textSize(10);
  textAlign(LEFT, CENTER);
  text('Quality:', 260, y);

  let legendItems = [
    { color: '#f44336', label: 'Low (<50%)' },
    { color: '#FFC107', label: 'Medium (50-79%)' },
    { color: '#4CAF50', label: 'High (80%+)' }
  ];

  let legendX = 310;
  for (let item of legendItems) {
    fill(item.color);
    noStroke();
    rect(legendX, y, 12, 12, 2);
    fill(80);
    textSize(9);
    text(item.label, legendX + 16, y);
    legendX += 95;
  }

  // Timestamp
  fill(100);
  textSize(9);
  textAlign(RIGHT, CENTER);
  let date = new Date().toLocaleDateString();
  text('Data as of: ' + date, canvasWidth - 20, y);

  textAlign(CENTER, CENTER);
}

function mousePressed() {
  if (mouseY > drawHeight && mouseY < drawHeight + controlHeight) {
    // Show Issues toggle
    if (mouseX > 20 && mouseX < 140) {
      showIssues = !showIssues;
    }
    // Export button
    if (mouseX > 145 && mouseX < 235) {
      alert('Report export would generate markdown summary');
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
