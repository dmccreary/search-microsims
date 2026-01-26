// Interactive Rubric Scorer
// Evaluate sample student work using a rubric

let canvasWidth = 850;
const drawHeight = 450;
const controlHeight = 60;

const criteria = ['Accuracy', 'Explanation', 'Exploration', 'Transfer'];
const levels = ['Beginning', 'Developing', 'Proficient', 'Exemplary'];
const levelColors = ['#FF8A65', '#FFD54F', '#AED581', '#4CAF50'];

const studentWork = [
  { name: 'Strong Student', description: 'Calculated T=2.01s (correct), explained relationship clearly, tested 5 scenarios, applied to different gravity values',
    expertScores: [3, 3, 3, 2] },
  { name: 'Developing Student', description: 'Calculated T=2.1s (close), brief explanation, tested 2 scenarios, did not try transfer',
    expertScores: [2, 2, 1, 0] },
  { name: 'Struggling Student', description: 'Calculated T=4.0s (wrong formula), confused explanation, single attempt, no transfer',
    expertScores: [0, 1, 0, 0] }
];

let currentWork = 0;
let scores = [null, null, null, null];
let feedback = '';
let compared = false;

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
  background(248, 249, 250);
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Interactive Rubric Scorer', canvasWidth / 2, 20);
  textStyle(NORMAL);

  drawStudentWork();
  drawRubricGrid();
  drawFeedback();
  drawControls();
}

function drawStudentWork() {
  let x = 15;
  let w = canvasWidth * 0.35;

  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, 45, w, 180, 8);

  fill(70);
  textSize(12);
  textStyle(BOLD);
  text('Student Work', x + w / 2, 60);
  textStyle(NORMAL);

  fill('#2196F3');
  textSize(11);
  text(studentWork[currentWork].name, x + w / 2, 85);

  fill(80);
  textSize(10);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  text(studentWork[currentWork].description, x + 15, 105, w - 30);

  textAlign(CENTER, CENTER);
}

function drawRubricGrid() {
  let gridX = canvasWidth * 0.38;
  let gridW = canvasWidth * 0.6;
  let cellW = gridW / 5;
  let cellH = 40;
  let y = 45;

  // Header row
  fill(100);
  textSize(10);
  textStyle(BOLD);
  text('Criterion', gridX + cellW / 2, y + 15);

  for (let i = 0; i < 4; i++) {
    fill(levelColors[i]);
    noStroke();
    rect(gridX + cellW * (i + 1), y, cellW, 30, i === 3 ? [0, 8, 0, 0] : 0);
    fill(i < 2 ? 50 : 255);
    textSize(9);
    text(levels[i], gridX + cellW * (i + 1) + cellW / 2, y + 15);
  }

  // Criteria rows
  for (let r = 0; r < 4; r++) {
    let rowY = y + 35 + r * cellH;

    // Criterion name
    fill(255);
    stroke(200);
    strokeWeight(1);
    rect(gridX, rowY, cellW, cellH);
    fill(70);
    noStroke();
    textSize(10);
    textStyle(BOLD);
    text(criteria[r], gridX + cellW / 2, rowY + cellH / 2);
    textStyle(NORMAL);

    // Level cells
    for (let c = 0; c < 4; c++) {
      let cellX = gridX + cellW * (c + 1);
      let isSelected = scores[r] === c;
      let isExpert = compared && studentWork[currentWork].expertScores[r] === c;

      fill(isSelected ? levelColors[c] : 255);
      stroke(isExpert ? '#000' : (isSelected ? levelColors[c] : 200));
      strokeWeight(isExpert ? 3 : 1);
      rect(cellX, rowY, cellW, cellH);

      if (isSelected) {
        fill(c < 2 ? 50 : 255);
        textSize(14);
        text('✓', cellX + cellW / 2, rowY + cellH / 2);
      }

      if (isExpert && !isSelected) {
        fill(100);
        textSize(8);
        text('Expert', cellX + cellW / 2, rowY + cellH / 2);
      }
    }
  }

  // Total score
  let total = scores.filter(s => s !== null).reduce((a, b) => a + b, 0);
  let maxScore = scores.filter(s => s !== null).length * 3;

  fill(70);
  textSize(12);
  textStyle(BOLD);
  text('Total: ' + total + '/' + (maxScore || 12), gridX + gridW / 2, y + 35 + 4 * cellH + 20);
  textStyle(NORMAL);
}

function drawFeedback() {
  let y = 270;
  let w = canvasWidth - 30;

  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(15, y, w, 80, 8);

  fill(70);
  textSize(11);
  textStyle(BOLD);
  text('Generated Feedback', canvasWidth / 2, y + 15);
  textStyle(NORMAL);

  if (feedback) {
    fill(80);
    textSize(10);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    text(feedback, 25, y + 30, w - 20);
    textAlign(CENTER, CENTER);
  } else {
    fill(150);
    textSize(10);
    text('Select scores for all criteria, then click "Generate Feedback"', canvasWidth / 2, y + 50);
  }
}

function drawControls() {
  let y = drawHeight + 30;

  // Student selector
  fill(80);
  textSize(10);
  text('Sample:', 45, y - 15);
  for (let i = 0; i < 3; i++) {
    fill(currentWork === i ? '#2196F3' : '#9E9E9E');
    noStroke();
    rectMode(CENTER);
    rect(30 + i * 55, y, 50, 28, 5);
    fill(255);
    textSize(9);
    text(['Strong', 'Developing', 'Struggling'][i], 30 + i * 55, y);
  }

  // Generate button
  fill('#4CAF50');
  rect(240, y, 110, 32, 5);
  fill(255);
  textSize(11);
  text('Generate Feedback', 240, y);

  // Compare button
  fill(compared ? '#9C27B0' : '#9E9E9E');
  rect(360, y, 110, 32, 5);
  fill(255);
  text(compared ? 'Hide Expert' : 'Compare to Expert', 360, y);

  // Reset
  fill('#f44336');
  rect(470, y, 60, 32, 5);
  fill(255);
  text('Reset', 470, y);
}

function generateFeedback() {
  let fb = [];
  for (let i = 0; i < 4; i++) {
    if (scores[i] !== null) {
      let level = levels[scores[i]];
      fb.push(criteria[i] + ': ' + level + ' (' + scores[i] + '/3)');
    }
  }
  feedback = fb.join(' | ');

  if (scores.every(s => s !== null)) {
    let total = scores.reduce((a, b) => a + b, 0);
    if (total >= 10) feedback += ' - Excellent work!';
    else if (total >= 6) feedback += ' - Good progress, some areas to improve.';
    else feedback += ' - Needs additional practice and support.';
  }
}

function mousePressed() {
  // Rubric grid clicks
  let gridX = canvasWidth * 0.38;
  let cellW = canvasWidth * 0.6 / 5;
  let cellH = 40;
  let gridY = 80;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let cellX = gridX + cellW * (c + 1);
      let rowY = gridY + r * cellH;
      if (mouseX > cellX && mouseX < cellX + cellW && mouseY > rowY && mouseY < rowY + cellH) {
        scores[r] = c;
        feedback = '';
        compared = false;
        return;
      }
    }
  }

  // Controls
  if (mouseY > drawHeight) {
    // Student selectors
    for (let i = 0; i < 3; i++) {
      if (mouseX > 5 + i * 55 && mouseX < 55 + i * 55) {
        currentWork = i;
        scores = [null, null, null, null];
        feedback = '';
        compared = false;
        return;
      }
    }

    if (mouseX > 185 && mouseX < 295) generateFeedback();
    if (mouseX > 305 && mouseX < 415) compared = !compared;
    if (mouseX > 440 && mouseX < 500) {
      scores = [null, null, null, null];
      feedback = '';
      compared = false;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
