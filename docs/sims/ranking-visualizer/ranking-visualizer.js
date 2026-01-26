// Ranking Score Visualizer MicroSim
// Shows how different ranking signals combine to determine search result order

let canvasWidth = 800;
const drawHeight = 430;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Ranking signal weights (0-100)
let weights = {
  termFreq: 40,
  titleMatch: 25,
  subjectMatch: 20,
  freshness: 10,
  popularity: 5
};

// Slider references
let sliders = {};

// Sample search results with raw signal scores
const results = [
  {
    title: 'Pendulum Period Calculator',
    subject: 'Physics',
    year: 2026,
    scores: { termFreq: 95, titleMatch: 90, subjectMatch: 100, freshness: 100, popularity: 80 }
  },
  {
    title: 'Simple Harmonic Motion Explorer',
    subject: 'Physics',
    year: 2025,
    scores: { termFreq: 75, titleMatch: 50, subjectMatch: 100, freshness: 90, popularity: 95 }
  },
  {
    title: 'Wave Pendulum Visualizer',
    subject: 'Physics',
    year: 2024,
    scores: { termFreq: 85, titleMatch: 80, subjectMatch: 100, freshness: 80, popularity: 70 }
  },
  {
    title: 'Introduction to Oscillations',
    subject: 'Physics',
    year: 2023,
    scores: { termFreq: 60, titleMatch: 30, subjectMatch: 100, freshness: 70, popularity: 85 }
  },
  {
    title: 'Pendulum Art Generator',
    subject: 'Art',
    year: 2026,
    scores: { termFreq: 70, titleMatch: 85, subjectMatch: 30, freshness: 100, popularity: 60 }
  },
  {
    title: 'Clock Mechanism Simulator',
    subject: 'Engineering',
    year: 2025,
    scores: { termFreq: 40, titleMatch: 20, subjectMatch: 50, freshness: 90, popularity: 75 }
  },
  {
    title: 'Gravity and Mass Demo',
    subject: 'Physics',
    year: 2024,
    scores: { termFreq: 55, titleMatch: 25, subjectMatch: 100, freshness: 80, popularity: 90 }
  },
  {
    title: 'Physics 101 Video Lecture',
    subject: 'Physics',
    year: 2022,
    scores: { termFreq: 65, titleMatch: 15, subjectMatch: 100, freshness: 50, popularity: 40 }
  }
];

// Calculated total scores and ranks
let rankedResults = [];
let hoveredResult = -1;
let showBreakdown = true;

// Animation
let targetPositions = [];
let currentPositions = [];

// Signal colors
const signalColors = {
  termFreq: '#4169E1',
  titleMatch: '#32CD32',
  subjectMatch: '#FF8C00',
  freshness: '#9370DB',
  popularity: '#FF6B6B'
};

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Create sliders
  const sliderStartX = canvasWidth * 0.72;
  const sliderY = 85;
  const sliderSpacing = 35;

  const signalNames = ['termFreq', 'titleMatch', 'subjectMatch', 'freshness', 'popularity'];

  for (let i = 0; i < signalNames.length; i++) {
    const name = signalNames[i];
    sliders[name] = createSlider(0, 100, weights[name], 1);
    sliders[name].parent('canvas-container');
    sliders[name].style('width', '100px');
    sliders[name].position(sliderStartX + 50, sliderY + i * sliderSpacing);
  }

  // Initialize positions
  for (let i = 0; i < results.length; i++) {
    targetPositions[i] = i;
    currentPositions[i] = i;
  }

  calculateRankings();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition sliders
  const sliderStartX = canvasWidth * 0.72;
  const sliderY = 85;
  const sliderSpacing = 35;
  const signalNames = ['termFreq', 'titleMatch', 'subjectMatch', 'freshness', 'popularity'];

  for (let i = 0; i < signalNames.length; i++) {
    sliders[signalNames[i]].position(sliderStartX + 50, sliderY + i * sliderSpacing);
  }
}

function calculateRankings() {
  // Update weights from sliders
  for (let key in sliders) {
    weights[key] = sliders[key].value();
  }

  // Calculate total weight
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  // Calculate normalized scores
  rankedResults = results.map((r, idx) => {
    let totalScore = 0;
    let breakdown = {};

    for (let signal in weights) {
      const contribution = (r.scores[signal] * weights[signal]) / (totalWeight || 1);
      totalScore += contribution;
      breakdown[signal] = contribution;
    }

    return {
      ...r,
      originalIndex: idx,
      totalScore: totalScore,
      breakdown: breakdown
    };
  });

  // Sort by total score
  rankedResults.sort((a, b) => b.totalScore - a.totalScore);

  // Update target positions
  for (let i = 0; i < rankedResults.length; i++) {
    targetPositions[rankedResults[i].originalIndex] = i;
  }
}

function draw() {
  calculateRankings();

  // Animate positions
  for (let i = 0; i < currentPositions.length; i++) {
    currentPositions[i] = lerp(currentPositions[i], targetPositions[i], 0.15);
  }

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
  text('Search Result Ranking Visualizer', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Query display
  textSize(11);
  fill(100);
  text('Query: "pendulum physics"', canvasWidth * 0.25, 45);

  // Draw results list
  drawResultsList();

  // Draw signal weight controls
  drawSignalControls();

  // Draw legend
  drawLegend();

  // Draw controls
  drawControls();
}

function drawResultsList() {
  const listX = 15;
  const listY = 60;
  const itemHeight = 42;
  const listWidth = canvasWidth * 0.55;

  // Column headers
  textSize(10);
  textAlign(LEFT, CENTER);
  fill(100);
  text('Rank', listX + 5, listY);
  text('Title', listX + 50, listY);
  text('Score', listX + listWidth - 80, listY);

  // Draw each result at its animated position
  for (let i = 0; i < results.length; i++) {
    const r = rankedResults[i];
    const animY = listY + 15 + currentPositions[r.originalIndex] * itemHeight;

    const isHovered = hoveredResult === i;

    // Item background
    fill(isHovered ? 240 : 255);
    stroke(isHovered ? 150 : 220);
    strokeWeight(1);
    rect(listX, animY, listWidth, itemHeight - 4, 4);

    // Rank number
    fill(50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(i + 1, listX + 20, animY + itemHeight / 2 - 2);
    textStyle(NORMAL);

    // Title and subject
    textAlign(LEFT, CENTER);
    textSize(12);
    fill(30);
    text(r.title, listX + 45, animY + 12);

    textSize(10);
    fill(100);
    text(`${r.subject} • ${r.year}`, listX + 45, animY + 28);

    // Score bar
    const barX = listX + listWidth - 130;
    const barWidth = 80;
    const barHeight = 16;

    // Background
    fill(230);
    noStroke();
    rect(barX, animY + itemHeight / 2 - barHeight / 2 - 2, barWidth, barHeight, 3);

    // Stacked segments if breakdown shown
    if (showBreakdown) {
      let segmentX = barX;
      for (let signal in r.breakdown) {
        const segmentWidth = (r.breakdown[signal] / 100) * barWidth;
        fill(signalColors[signal]);
        rect(segmentX, animY + itemHeight / 2 - barHeight / 2 - 2, segmentWidth, barHeight,
             segmentX === barX ? 3 : 0, 0, 0, segmentX === barX ? 3 : 0);
        segmentX += segmentWidth;
      }
    } else {
      // Single bar
      fill(70, 130, 180);
      const scoreWidth = (r.totalScore / 100) * barWidth;
      rect(barX, animY + itemHeight / 2 - barHeight / 2 - 2, scoreWidth, barHeight, 3);
    }

    // Score text
    textAlign(RIGHT, CENTER);
    fill(50);
    textSize(11);
    text(r.totalScore.toFixed(1), listX + listWidth - 5, animY + itemHeight / 2 - 2);
  }

  textAlign(CENTER, CENTER);
}

function drawSignalControls() {
  const panelX = canvasWidth * 0.60;
  const panelY = 55;
  const panelW = canvasWidth * 0.38;
  const panelH = 200;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(50);
  textSize(12);
  textStyle(BOLD);
  text('Signal Weights', panelX + panelW / 2, panelY + 18);
  textStyle(NORMAL);

  // Signal labels and values
  const signals = [
    { key: 'termFreq', label: 'Term Frequency' },
    { key: 'titleMatch', label: 'Title Match' },
    { key: 'subjectMatch', label: 'Subject Match' },
    { key: 'freshness', label: 'Freshness' },
    { key: 'popularity', label: 'Popularity' }
  ];

  const startY = panelY + 40;
  const spacing = 35;

  textAlign(LEFT, CENTER);
  textSize(11);

  for (let i = 0; i < signals.length; i++) {
    const s = signals[i];
    const y = startY + i * spacing;

    // Color indicator
    fill(signalColors[s.key]);
    noStroke();
    rect(panelX + 10, y - 5, 10, 10, 2);

    // Label
    fill(50);
    text(s.label, panelX + 25, y);

    // Value
    textAlign(RIGHT, CENTER);
    text(weights[s.key] + '%', panelX + panelW - 15, y);
    textAlign(LEFT, CENTER);
  }

  textAlign(CENTER, CENTER);
}

function drawLegend() {
  const legendY = 270;
  const legendX = canvasWidth * 0.60;

  fill(50);
  textSize(10);
  text('Score breakdown by signal type (stacked bars)', canvasWidth * 0.79, legendY);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Reset button
  const resetX = canvasWidth * 0.25;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  textSize(12);
  text('Reset Defaults', resetX + 50, buttonY + buttonH / 2);

  // Toggle breakdown button
  const toggleX = canvasWidth * 0.45;
  fill(showBreakdown ? '#4CAF50' : '#9E9E9E');
  stroke(100);
  strokeWeight(1);
  rect(toggleX, buttonY, 120, buttonH, 5);
  fill(255);
  noStroke();
  text(showBreakdown ? 'Hide Breakdown' : 'Show Breakdown', toggleX + 60, buttonY + buttonH / 2);

  // Equal weights button
  const equalX = canvasWidth * 0.65;
  fill('#2196F3');
  stroke(100);
  strokeWeight(1);
  rect(equalX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text('Equal Weights', equalX + 50, buttonY + buttonH / 2);
}

function mousePressed() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Check Reset button
  const resetX = canvasWidth * 0.25;
  if (mouseX >= resetX && mouseX <= resetX + 100 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    sliders.termFreq.value(40);
    sliders.titleMatch.value(25);
    sliders.subjectMatch.value(20);
    sliders.freshness.value(10);
    sliders.popularity.value(5);
    return;
  }

  // Check Toggle Breakdown button
  const toggleX = canvasWidth * 0.45;
  if (mouseX >= toggleX && mouseX <= toggleX + 120 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    showBreakdown = !showBreakdown;
    return;
  }

  // Check Equal Weights button
  const equalX = canvasWidth * 0.65;
  if (mouseX >= equalX && mouseX <= equalX + 100 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    sliders.termFreq.value(20);
    sliders.titleMatch.value(20);
    sliders.subjectMatch.value(20);
    sliders.freshness.value(20);
    sliders.popularity.value(20);
    return;
  }
}

function mouseMoved() {
  // Check if hovering over a result
  const listX = 15;
  const listY = 75;
  const itemHeight = 42;
  const listWidth = canvasWidth * 0.55;

  hoveredResult = -1;

  for (let i = 0; i < results.length; i++) {
    const y = listY + i * itemHeight;
    if (mouseX >= listX && mouseX <= listX + listWidth &&
        mouseY >= y && mouseY <= y + itemHeight - 4) {
      hoveredResult = i;
      cursor(HAND);
      return;
    }
  }

  // Check buttons
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  if (mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
