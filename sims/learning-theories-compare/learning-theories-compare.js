// Learning Theories Interactive Comparison
// Compare how four learning theories approach MicroSim design

let canvasWidth = 850;
const drawHeight = 440;
const controlHeight = 80;

const theories = [
  {
    name: 'Constructivism',
    icon: '🧱',
    color: '#3498db',
    principle: 'Learners construct knowledge through exploration',
    approach: 'Open-ended simulation, discover period-length relationship',
    features: ['Free exploration', 'Minimal instructions', '"What did you notice?" prompts', 'Build on prior knowledge'],
    strength: 'Deep understanding, ownership of learning',
    weakness: 'Time-consuming, risk of misconceptions'
  },
  {
    name: 'Behaviorism',
    icon: '⭐',
    color: '#27ae60',
    principle: 'Behavior is shaped through reinforcement',
    approach: 'Drill with immediate feedback and rewards',
    features: ['Points for correct answers', 'Achievement badges', 'Streak counters', 'Immediate feedback'],
    strength: 'Automaticity, clear progress metrics',
    weakness: 'Surface learning, extrinsic motivation'
  },
  {
    name: 'Cognitivism',
    icon: '🧠',
    color: '#9b59b6',
    principle: 'Learning is information processing',
    approach: 'Structured presentation managing cognitive load',
    features: ['Worked examples', 'Organized interface', 'Step-by-step progression', 'Chunked information'],
    strength: 'Efficient learning, clear structure',
    weakness: 'May be passive, less engagement'
  },
  {
    name: 'Experiential',
    icon: '✋',
    color: '#e67e22',
    principle: 'Experience and reflection create knowledge',
    approach: 'Hands-on experimentation with reflection',
    features: ['Experiment mode', 'Reflection questions', 'Predict-then-test cycle', 'Real-world connections'],
    strength: 'Meaningful learning, transfer',
    weakness: 'Requires scaffolding, time-intensive'
  }
];

let selectedTheory = -1;
let compareMode = false;
let compareA = 0;
let compareB = 1;
let showMockups = false;

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

  // Control area
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Learning Theories Comparison', canvasWidth / 2, 20);
  textStyle(NORMAL);

  // Central challenge
  drawChallenge();

  if (compareMode) {
    drawComparison();
  } else if (selectedTheory >= 0) {
    drawExpandedView();
  } else {
    drawQuadrants();
  }

  drawControls();
}

function drawChallenge() {
  let cx = canvasWidth / 2;
  let cy = 75;

  // Pulsing circle
  let pulse = sin(frameCount * 0.05) * 3;
  fill(100, 149, 237, 150);
  noStroke();
  ellipse(cx, cy, 140 + pulse, 50 + pulse / 2);

  fill(70, 130, 180);
  ellipse(cx, cy, 130, 45);

  fill(255);
  textSize(11);
  textStyle(BOLD);
  text('Design Challenge:', cx, cy - 8);
  textStyle(NORMAL);
  textSize(10);
  text('Teach pendulum period', cx, cy + 8);
}

function drawQuadrants() {
  let qw = (canvasWidth - 60) / 2;
  let qh = 150;
  let startY = 115;

  for (let i = 0; i < 4; i++) {
    let col = i % 2;
    let row = floor(i / 2);
    let x = 20 + col * (qw + 20);
    let y = startY + row * (qh + 15);

    let theory = theories[i];
    let isHovered = mouseX > x && mouseX < x + qw && mouseY > y && mouseY < y + qh;

    // Quadrant box
    fill(255);
    stroke(theory.color);
    strokeWeight(isHovered ? 3 : 2);
    rect(x, y, qw, qh, 8);

    // Header
    fill(theory.color);
    noStroke();
    rect(x, y, qw, 35, 8, 8, 0, 0);

    fill(255);
    textSize(14);
    textStyle(BOLD);
    text(theory.icon + ' ' + theory.name, x + qw / 2, y + 18);
    textStyle(NORMAL);

    // Principle
    fill(60);
    textSize(10);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    text('"' + theory.principle + '"', x + 10, y + 45, qw - 20);

    // Approach
    fill(100);
    textSize(9);
    text('→ ' + theory.approach, x + 10, y + 75, qw - 20);

    // Click hint
    if (isHovered) {
      fill(theory.color);
      textAlign(CENTER, CENTER);
      textSize(9);
      text('Click for details', x + qw / 2, y + qh - 15);
    }

    textAlign(CENTER, CENTER);
  }
}

function drawExpandedView() {
  let theory = theories[selectedTheory];
  let x = 40;
  let y = 110;
  let w = canvasWidth - 80;
  let h = 300;

  // Main panel
  fill(255);
  stroke(theory.color);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  // Header
  fill(theory.color);
  noStroke();
  rect(x, y, w, 45, 8, 8, 0, 0);

  fill(255);
  textSize(18);
  textStyle(BOLD);
  text(theory.icon + ' ' + theory.name, x + w / 2, y + 23);
  textStyle(NORMAL);

  // Content columns
  let colW = (w - 40) / 3;

  // Principle column
  textAlign(LEFT, TOP);
  fill(theory.color);
  textSize(12);
  textStyle(BOLD);
  text('Key Principle', x + 20, y + 60);
  textStyle(NORMAL);
  fill(60);
  textSize(11);
  textWrap(WORD);
  text(theory.principle, x + 20, y + 80, colW - 10);

  // Design Approach
  fill(theory.color);
  textSize(12);
  textStyle(BOLD);
  text('MicroSim Approach', x + 20, y + 130);
  textStyle(NORMAL);
  fill(60);
  textSize(11);
  text(theory.approach, x + 20, y + 150, colW - 10);

  // Features column
  fill(theory.color);
  textSize(12);
  textStyle(BOLD);
  text('Design Features', x + 20 + colW, y + 60);
  textStyle(NORMAL);
  fill(60);
  textSize(10);

  for (let i = 0; i < theory.features.length; i++) {
    text('• ' + theory.features[i], x + 25 + colW, y + 85 + i * 18);
  }

  // Strengths/Weaknesses column
  fill(39, 174, 96);
  textSize(12);
  textStyle(BOLD);
  text('Strength', x + 20 + colW * 2, y + 60);
  textStyle(NORMAL);
  fill(60);
  textSize(10);
  textWrap(WORD);
  text(theory.strength, x + 20 + colW * 2, y + 80, colW - 10);

  fill(231, 76, 60);
  textSize(12);
  textStyle(BOLD);
  text('Limitation', x + 20 + colW * 2, y + 150);
  textStyle(NORMAL);
  fill(60);
  textSize(10);
  text(theory.weakness, x + 20 + colW * 2, y + 170, colW - 10);

  // Back button
  textAlign(CENTER, CENTER);
  fill(150);
  noStroke();
  rect(x + w - 80, y + h - 40, 70, 30, 5);
  fill(255);
  textSize(11);
  text('← Back', x + w - 45, y + h - 25);

  textAlign(CENTER, CENTER);
}

function drawComparison() {
  let theoryA = theories[compareA];
  let theoryB = theories[compareB];
  let y = 115;
  let panelW = (canvasWidth - 80) / 2;
  let h = 280;

  // VS badge
  fill(100);
  textSize(16);
  textStyle(BOLD);
  text('VS', canvasWidth / 2, y + h / 2);
  textStyle(NORMAL);

  // Two panels
  for (let i = 0; i < 2; i++) {
    let theory = i === 0 ? theoryA : theoryB;
    let x = 20 + i * (panelW + 40);

    fill(255);
    stroke(theory.color);
    strokeWeight(2);
    rect(x, y, panelW, h, 8);

    // Header
    fill(theory.color);
    noStroke();
    rect(x, y, panelW, 40, 8, 8, 0, 0);

    fill(255);
    textSize(14);
    textStyle(BOLD);
    text(theory.icon + ' ' + theory.name, x + panelW / 2, y + 20);
    textStyle(NORMAL);

    // Content
    textAlign(LEFT, TOP);
    fill(60);
    textSize(10);
    textWrap(WORD);

    text('Principle: ' + theory.principle, x + 10, y + 55, panelW - 20);
    text('Approach: ' + theory.approach, x + 10, y + 100, panelW - 20);

    textSize(9);
    text('Features:', x + 10, y + 150);
    for (let j = 0; j < theory.features.length; j++) {
      text('• ' + theory.features[j], x + 15, y + 168 + j * 15, panelW - 25);
    }

    textAlign(CENTER, CENTER);
  }
}

function drawControls() {
  let y = drawHeight + 40;

  if (selectedTheory >= 0 || compareMode) {
    // Back to overview
    fill(color(100, 149, 237));
    noStroke();
    rect(30, y - 15, 100, 30, 5);
    fill(255);
    textSize(11);
    text('← Overview', 80, y);
  }

  // Compare button
  fill(compareMode ? color(231, 76, 60) : color(155, 89, 182));
  rect(150, y - 15, 100, 30, 5);
  fill(255);
  text(compareMode ? 'Exit Compare' : 'Compare Two', 200, y);

  // Theory selectors (for compare mode)
  if (compareMode) {
    fill(80);
    textSize(10);
    text('Select:', 280, y);

    for (let i = 0; i < 4; i++) {
      let x = 320 + i * 70;
      let isA = compareA === i;
      let isB = compareB === i;

      fill(isA || isB ? theories[i].color : color(200));
      noStroke();
      rect(x, y - 12, 65, 24, 4);

      fill(255);
      textSize(9);
      text(theories[i].name.substring(0, 8), x + 32, y);
    }
  } else if (selectedTheory < 0) {
    // Hint text
    fill(100);
    textSize(10);
    text('Click a quadrant for details, or use Compare to see two side-by-side', canvasWidth / 2 + 100, y);
  }
}

function mousePressed() {
  let y = drawHeight + 40;

  // Control buttons
  if (mouseY > y - 15 && mouseY < y + 15) {
    // Back/Overview
    if (mouseX > 30 && mouseX < 130 && (selectedTheory >= 0 || compareMode)) {
      selectedTheory = -1;
      compareMode = false;
    }

    // Compare toggle
    if (mouseX > 150 && mouseX < 250) {
      compareMode = !compareMode;
      selectedTheory = -1;
    }

    // Theory selectors in compare mode
    if (compareMode) {
      for (let i = 0; i < 4; i++) {
        let x = 320 + i * 70;
        if (mouseX > x && mouseX < x + 65) {
          if (compareA === i) {
            // Deselect A, make it B
          } else if (compareB === i) {
            // Already B
          } else {
            // Cycle through
            compareA = compareB;
            compareB = i;
          }
        }
      }
    }
  }

  // Quadrant clicks (overview mode)
  if (!compareMode && selectedTheory < 0) {
    let qw = (canvasWidth - 60) / 2;
    let qh = 150;
    let startY = 115;

    for (let i = 0; i < 4; i++) {
      let col = i % 2;
      let row = floor(i / 2);
      let x = 20 + col * (qw + 20);
      let qy = startY + row * (qh + 15);

      if (mouseX > x && mouseX < x + qw && mouseY > qy && mouseY < qy + qh) {
        selectedTheory = i;
      }
    }
  }

  // Back button in expanded view
  if (selectedTheory >= 0) {
    let x = 40;
    let w = canvasWidth - 80;
    let h = 300;
    let y = 110;
    if (mouseX > x + w - 80 && mouseX < x + w - 10 && mouseY > y + h - 40 && mouseY < y + h - 10) {
      selectedTheory = -1;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
