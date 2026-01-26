// Feedback Quality Comparison Simulator
// Compare effectiveness of different feedback approaches

let canvasWidth = 850;
const drawHeight = 440;
const controlHeight = 80;

const scenarios = [
  {
    name: 'Correct Answer',
    studentAnswer: 2.46,
    correctAnswer: 2.46,
    minimal: { text: 'Correct!', effective: 60 },
    directive: { text: 'Correct! You used the formula properly.', effective: 75 },
    elaborated: { text: 'Correct! T = 2π√(1.5/9.8) = 2.46s. Notice how only length and gravity matter, not mass or amplitude.', effective: 95 }
  },
  {
    name: 'Minor Calculation Error',
    studentAnswer: 2.35,
    correctAnswer: 2.46,
    minimal: { text: 'Incorrect. Try again.', effective: 20 },
    directive: { text: 'Close! Recheck your square root calculation.', effective: 55 },
    elaborated: { text: 'Your formula is correct but √(0.153) = 0.391, not 0.374. Recalculating: T = 2π × 0.391 = 2.46s.', effective: 90 }
  },
  {
    name: 'Wrong Formula Used',
    studentAnswer: 4.71,
    correctAnswer: 2.46,
    minimal: { text: 'Incorrect. Try again.', effective: 15 },
    directive: { text: 'Wrong formula. Use T = 2π√(L/g), not T = 2πL.', effective: 60 },
    elaborated: { text: 'You used T = 2πL = 9.42. The correct formula is T = 2π√(L/g). With L=1.5m and g=9.8: T = 2π√(1.5/9.8) = 2.46s.', effective: 85 }
  },
  {
    name: 'Random Guess',
    studentAnswer: 5.0,
    correctAnswer: 2.46,
    minimal: { text: 'Incorrect. Try again.', effective: 10 },
    directive: { text: 'Not quite. Start with T = 2π√(L/g) where L=1.5m.', effective: 45 },
    elaborated: { text: 'Let\'s work through this: T = 2π√(L/g). With L=1.5m, g=9.8: √(1.5/9.8) = √0.153 = 0.391. So T = 2π(0.391) = 2.46s.', effective: 80 }
  }
];

let currentScenario = 1; // Start with "Minor Calculation Error"
let showResearch = false;
let learnerMood = 0.5;

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

  // Control area background
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Feedback Quality Comparison', canvasWidth / 2, 20);
  textStyle(NORMAL);

  drawProblem();
  drawFeedbackPanels();
  drawLearnerIndicator();
  drawControls();
}

function drawProblem() {
  let y = 45;
  let scenario = scenarios[currentScenario];

  // Problem box
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(20, y, canvasWidth - 40, 55, 8);

  // Problem text
  fill(50);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Problem: Calculate the period of a 1.5m pendulum (g = 9.8 m/s²)', 35, y + 18);

  textStyle(NORMAL);
  fill(70);
  text('Correct answer: T = ' + scenario.correctAnswer.toFixed(2) + 's', 35, y + 40);

  // Student answer
  fill(scenario.studentAnswer === scenario.correctAnswer ? color(39, 174, 96) : color(231, 76, 60));
  text('Student\'s answer: ' + scenario.studentAnswer.toFixed(2) + 's', 280, y + 40);

  // Scenario indicator
  fill(100, 149, 237);
  textAlign(RIGHT, CENTER);
  text('Scenario: ' + scenario.name, canvasWidth - 35, y + 28);

  textAlign(CENTER, CENTER);
}

function drawFeedbackPanels() {
  let scenario = scenarios[currentScenario];
  let panelY = 115;
  let panelH = 180;
  let panelW = (canvasWidth - 80) / 3;
  let gap = 15;

  const feedbackTypes = [
    { name: 'Minimal', data: scenario.minimal, color: '#9e9e9e' },
    { name: 'Directive', data: scenario.directive, color: '#f39c12' },
    { name: 'Elaborated', data: scenario.elaborated, color: '#27ae60' }
  ];

  for (let i = 0; i < 3; i++) {
    let x = 25 + i * (panelW + gap);
    let fb = feedbackTypes[i];

    // Panel background
    fill(255);
    stroke(fb.color);
    strokeWeight(2);
    rect(x, panelY, panelW, panelH, 8);

    // Header
    fill(fb.color);
    noStroke();
    rect(x, panelY, panelW, 35, 8, 8, 0, 0);

    fill(255);
    textSize(14);
    textStyle(BOLD);
    text(fb.name, x + panelW / 2, panelY + 18);
    textStyle(NORMAL);

    // Feedback text
    fill(60);
    textSize(11);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    text(fb.data.text, x + 10, panelY + 45, panelW - 20);
    textAlign(CENTER, CENTER);

    // Effectiveness bar
    let barY = panelY + panelH - 40;
    fill(220);
    rect(x + 10, barY, panelW - 20, 12, 3);

    fill(fb.color);
    let fillW = (fb.data.effective / 100) * (panelW - 20);
    rect(x + 10, barY, fillW, 12, 3);

    fill(50);
    textSize(10);
    text('Effectiveness: ' + fb.data.effective + '%', x + panelW / 2, barY + 22);
  }

  // Research findings (if toggled)
  if (showResearch) {
    let researchY = panelY + panelH + 15;
    fill(255, 250, 240);
    stroke(255, 200, 100);
    strokeWeight(1);
    rect(25, researchY, canvasWidth - 50, 50, 5);

    fill(180, 120, 50);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text('📚 Research Finding:', 35, researchY + 15);
    textStyle(NORMAL);
    fill(100);
    text('Elaborated feedback leads to 2-3x better retention than minimal feedback (Shute, 2008)', 35, researchY + 35);
    textAlign(CENTER, CENTER);
  }
}

function drawLearnerIndicator() {
  let scenario = scenarios[currentScenario];
  let x = canvasWidth - 120;
  let y = 330;

  if (!showResearch) {
    // Calculate mood based on elaborated effectiveness
    let avgEffective = (scenario.minimal.effective + scenario.directive.effective + scenario.elaborated.effective) / 3;
    learnerMood = lerp(learnerMood, avgEffective / 100, 0.1);

    fill(255);
    stroke(200);
    strokeWeight(1);
    rect(x - 10, y - 10, 100, 80, 8);

    // Face
    let faceY = y + 20;
    fill(255, 220, 180);
    noStroke();
    ellipse(x + 40, faceY, 45, 45);

    // Eyes
    fill(50);
    ellipse(x + 30, faceY - 5, 6, 6);
    ellipse(x + 50, faceY - 5, 6, 6);

    // Mouth (curved based on mood)
    noFill();
    stroke(50);
    strokeWeight(2);
    let mouthCurve = map(learnerMood, 0, 1, 10, -10);
    beginShape();
    vertex(x + 28, faceY + 10);
    quadraticVertex(x + 40, faceY + 10 + mouthCurve, x + 52, faceY + 10);
    endShape();

    // Label
    fill(80);
    noStroke();
    textSize(10);
    text('Learner', x + 40, y + 55);
  }
}

function drawControls() {
  let y = drawHeight + 40;

  // Scenario selector
  fill(50);
  textSize(11);
  text('Scenario:', 55, y - 15);

  for (let i = 0; i < scenarios.length; i++) {
    let btnX = 20 + i * 100;
    let isSelected = currentScenario === i;

    fill(isSelected ? color(70, 130, 180) : color(180));
    noStroke();
    rect(btnX, y - 8, 95, 26, 5);

    fill(255);
    textSize(9);
    text(scenarios[i].name, btnX + 47, y + 5);
  }

  // Research toggle
  fill(showResearch ? color(255, 160, 100) : color(150));
  rect(430, y - 8, 130, 26, 5);
  fill(255);
  textSize(10);
  text(showResearch ? 'Hide Research' : 'Show Research', 495, y + 5);

  // Info text
  fill(100);
  textSize(10);
  text('Click scenarios to compare feedback quality', 680, y + 5);
}

function mousePressed() {
  let y = drawHeight + 40;

  // Scenario buttons
  for (let i = 0; i < scenarios.length; i++) {
    let btnX = 20 + i * 100;
    if (mouseX > btnX && mouseX < btnX + 95 && mouseY > y - 8 && mouseY < y + 18) {
      currentScenario = i;
    }
  }

  // Research toggle
  if (mouseX > 430 && mouseX < 560 && mouseY > y - 8 && mouseY < y + 18) {
    showResearch = !showResearch;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
