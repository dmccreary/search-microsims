// Faceted Classification MicroSim
// Demonstrates how multi-dimensional classification enables faceted search
// Students explore filter combinations and observe how result sets change
// MicroSim template version 2026.02

// Canvas dimensions - responsive width
let containerWidth;
let canvasWidth = 800;
let drawHeight = 500;
let controlHeight = 0; // Controls are in left panel, not bottom
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let leftPanelWidth = 200;
let rightPanelWidth = 180;
let margin = 10;
let cardWidth = 130;
let cardHeight = 65;
let cardGap = 8;

// Animation
let mouseOverCanvas = false;

// Filter state
let subjectSelect;
let gradeLevelCheckboxes = [];
let difficultyCheckboxes = [];
let typeCheckboxes = [];
let clearButton;

// Current filter values
let subjectFilter = 'All';
let gradeLevelFilters = [];
let difficultyFilters = [];
let typeFilters = [];

// Card opacity for fade animation
let cardOpacities = [];

// Sample MicroSim data (20 items with varied classifications)
const sampleMicroSims = [
  { id: 1, title: "Pendulum Motion", subject: "Physics", gradeLevel: "High", difficulty: "Intermediate", type: "Simulation" },
  { id: 2, title: "Fraction Builder", subject: "Math", gradeLevel: "Elementary", difficulty: "Beginner", type: "Animation" },
  { id: 3, title: "Cell Division", subject: "Biology", gradeLevel: "High", difficulty: "Intermediate", type: "Animation" },
  { id: 4, title: "Periodic Table", subject: "Chemistry", gradeLevel: "Middle", difficulty: "Beginner", type: "Chart" },
  { id: 5, title: "Projectile Path", subject: "Physics", gradeLevel: "College", difficulty: "Advanced", type: "Simulation" },
  { id: 6, title: "Algebra Quiz", subject: "Math", gradeLevel: "Middle", difficulty: "Intermediate", type: "Quiz" },
  { id: 7, title: "DNA Structure", subject: "Biology", gradeLevel: "College", difficulty: "Advanced", type: "Simulation" },
  { id: 8, title: "Molecule Viewer", subject: "Chemistry", gradeLevel: "High", difficulty: "Intermediate", type: "Simulation" },
  { id: 9, title: "Wave Interference", subject: "Physics", gradeLevel: "High", difficulty: "Advanced", type: "Simulation" },
  { id: 10, title: "Number Line", subject: "Math", gradeLevel: "Elementary", difficulty: "Beginner", type: "Animation" },
  { id: 11, title: "Ecosystem Flow", subject: "Biology", gradeLevel: "Middle", difficulty: "Intermediate", type: "Chart" },
  { id: 12, title: "pH Scale", subject: "Chemistry", gradeLevel: "Middle", difficulty: "Beginner", type: "Animation" },
  { id: 13, title: "Circuit Builder", subject: "Physics", gradeLevel: "Middle", difficulty: "Intermediate", type: "Simulation" },
  { id: 14, title: "Geometry Shapes", subject: "Math", gradeLevel: "Elementary", difficulty: "Beginner", type: "Quiz" },
  { id: 15, title: "Photosynthesis", subject: "Biology", gradeLevel: "High", difficulty: "Intermediate", type: "Animation" },
  { id: 16, title: "Reaction Rates", subject: "Chemistry", gradeLevel: "College", difficulty: "Advanced", type: "Chart" },
  { id: 17, title: "Gravity Sim", subject: "Physics", gradeLevel: "College", difficulty: "Advanced", type: "Simulation" },
  { id: 18, title: "Graph Plotter", subject: "Math", gradeLevel: "High", difficulty: "Intermediate", type: "Chart" },
  { id: 19, title: "Genetics Quiz", subject: "Biology", gradeLevel: "College", difficulty: "Advanced", type: "Quiz" },
  { id: 20, title: "Bonding Types", subject: "Chemistry", gradeLevel: "High", difficulty: "Intermediate", type: "Animation" }
];

// Subject colors
const subjectColors = {
  Physics: [70, 130, 180],    // Steel blue
  Math: [180, 100, 180],      // Purple
  Chemistry: [60, 140, 80],   // Green
  Biology: [200, 120, 50]     // Orange
};

// Type icons (simple text representations)
const typeIcons = {
  Animation: "▶",
  Simulation: "⚙",
  Chart: "📊",
  Quiz: "?"
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  // Initialize card opacities
  for (let i = 0; i < sampleMicroSims.length; i++) {
    cardOpacities[i] = 255;
  }

  createFilterControls();

  describe('Interactive faceted search demonstration with 20 MicroSim cards that can be filtered by Subject, Grade Level, Difficulty, and Type. Explore how combining filters narrows results.', LABEL);
}

function createFilterControls() {
  let controlX = 15;
  let controlY = 70;
  let labelHeight = 22;

  // Subject dropdown
  subjectSelect = createSelect();
  subjectSelect.position(controlX, controlY);
  subjectSelect.option('All');
  subjectSelect.option('Physics');
  subjectSelect.option('Math');
  subjectSelect.option('Chemistry');
  subjectSelect.option('Biology');
  subjectSelect.changed(() => {
    subjectFilter = subjectSelect.value();
  });
  subjectSelect.style('width', '170px');
  subjectSelect.style('padding', '4px');
  controlY += 35;

  // Grade Level checkboxes
  controlY += labelHeight;
  let gradeLevels = ['Elementary', 'Middle', 'High', 'College'];
  for (let level of gradeLevels) {
    let cb = createCheckbox(level, false);
    cb.position(controlX, controlY);
    cb.changed(() => updateGradeLevelFilters());
    cb.style('font-size', '13px');
    gradeLevelCheckboxes.push(cb);
    controlY += 22;
  }

  // Difficulty checkboxes
  controlY += labelHeight;
  let difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  for (let diff of difficulties) {
    let cb = createCheckbox(diff, false);
    cb.position(controlX, controlY);
    cb.changed(() => updateDifficultyFilters());
    cb.style('font-size', '13px');
    difficultyCheckboxes.push(cb);
    controlY += 22;
  }

  // Type checkboxes
  controlY += labelHeight;
  let types = ['Animation', 'Simulation', 'Chart', 'Quiz'];
  for (let t of types) {
    let cb = createCheckbox(t, false);
    cb.position(controlX, controlY);
    cb.changed(() => updateTypeFilters());
    cb.style('font-size', '13px');
    typeCheckboxes.push(cb);
    controlY += 22;
  }

  // Clear All button
  controlY += 15;
  clearButton = createButton('Clear All Filters');
  clearButton.position(controlX, controlY);
  clearButton.mousePressed(clearAllFilters);
  clearButton.style('padding', '6px 12px');
  clearButton.style('cursor', 'pointer');
}

function updateGradeLevelFilters() {
  gradeLevelFilters = [];
  let levels = ['Elementary', 'Middle', 'High', 'College'];
  for (let i = 0; i < gradeLevelCheckboxes.length; i++) {
    if (gradeLevelCheckboxes[i].checked()) {
      gradeLevelFilters.push(levels[i]);
    }
  }
}

function updateDifficultyFilters() {
  difficultyFilters = [];
  let difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  for (let i = 0; i < difficultyCheckboxes.length; i++) {
    if (difficultyCheckboxes[i].checked()) {
      difficultyFilters.push(difficulties[i]);
    }
  }
}

function updateTypeFilters() {
  typeFilters = [];
  let types = ['Animation', 'Simulation', 'Chart', 'Quiz'];
  for (let i = 0; i < typeCheckboxes.length; i++) {
    if (typeCheckboxes[i].checked()) {
      typeFilters.push(types[i]);
    }
  }
}

function clearAllFilters() {
  subjectSelect.selected('All');
  subjectFilter = 'All';

  for (let cb of gradeLevelCheckboxes) {
    cb.checked(false);
  }
  gradeLevelFilters = [];

  for (let cb of difficultyCheckboxes) {
    cb.checked(false);
  }
  difficultyFilters = [];

  for (let cb of typeCheckboxes) {
    cb.checked(false);
  }
  typeFilters = [];
}

function matchesFilters(item) {
  let matchSubject = subjectFilter === 'All' || item.subject === subjectFilter;
  let matchGrade = gradeLevelFilters.length === 0 || gradeLevelFilters.includes(item.gradeLevel);
  let matchDiff = difficultyFilters.length === 0 || difficultyFilters.includes(item.difficulty);
  let matchType = typeFilters.length === 0 || typeFilters.includes(item.type);
  return matchSubject && matchGrade && matchDiff && matchType;
}

function draw() {
  updateCanvasSize();

  // Background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Draw panels
  drawLeftPanel();
  drawCenterPanel();
  drawRightPanel();

  // Update card opacities with smooth animation
  for (let i = 0; i < sampleMicroSims.length; i++) {
    let targetOpacity = matchesFilters(sampleMicroSims[i]) ? 255 : 60;
    cardOpacities[i] = lerp(cardOpacities[i], targetOpacity, 0.15);
  }
}

function drawLeftPanel() {
  // Panel background
  fill(245);
  noStroke();
  rect(0, 0, leftPanelWidth, drawHeight);

  // Panel border
  stroke('silver');
  strokeWeight(1);
  line(leftPanelWidth, 0, leftPanelWidth, drawHeight);

  // Title
  fill(50);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text('Filter Controls', 15, 15);

  // Section labels
  textSize(14);
  fill('blue');
  text('Subject:', 13, 50);
  text('Grade Level:', 13, 108);
  text('Difficulty:', 13, 220);
  text('Type:', 13, 308);
}

function drawCenterPanel() {
  let centerX = leftPanelWidth + margin;
  let centerWidth = canvasWidth - leftPanelWidth - rightPanelWidth - margin * 2;

  // Title
  fill(50);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('MicroSim Collection', centerX + centerWidth / 2, 15);

  // Calculate grid layout
  let cardsPerRow = Math.floor((centerWidth - margin) / (cardWidth + cardGap));
  if (cardsPerRow < 1) cardsPerRow = 1;

  let startX = centerX + margin;
  let startY = 45;

  // Draw cards
  for (let i = 0; i < sampleMicroSims.length; i++) {
    let col = i % cardsPerRow;
    let row = Math.floor(i / cardsPerRow);
    let x = startX + col * (cardWidth + cardGap);
    let y = startY + row * (cardHeight + cardGap);

    drawCard(sampleMicroSims[i], x, y, cardOpacities[i]);
  }
}

function drawCard(item, x, y, opacity) {
  let subjectColor = subjectColors[item.subject] || [100, 100, 100];

  // Card shadow
  fill(0, 0, 0, opacity * 0.1);
  noStroke();
  rect(x + 2, y + 2, cardWidth, cardHeight, 6);

  // Card background
  fill(255, 255, 255, opacity);
  stroke(subjectColor[0], subjectColor[1], subjectColor[2], opacity);
  strokeWeight(2);
  rect(x, y, cardWidth, cardHeight, 6);

  // Subject color bar at top
  fill(subjectColor[0], subjectColor[1], subjectColor[2], opacity);
  noStroke();
  rect(x, y, cardWidth, 18, 6, 6, 0, 0);

  // Subject label in bar
  fill(255, 255, 255, opacity);
  textAlign(LEFT, CENTER);
  textSize(10);
  noStroke();
  text(item.subject, x + 6, y + 9);

  // Type icon in bar
  textAlign(RIGHT, CENTER);
  text(typeIcons[item.type] || "", x + cardWidth - 6, y + 9);

  // Title
  fill(50, 50, 50, opacity);
  textAlign(LEFT, TOP);
  textSize(11);
  let titleText = item.title;
  if (textWidth(titleText) > cardWidth - 12) {
    titleText = titleText.substring(0, 14) + '...';
  }
  text(titleText, x + 6, y + 24);

  // Grade and Difficulty badges
  textSize(9);
  fill(100, 100, 100, opacity);

  // Grade badge
  let gradeText = item.gradeLevel.substring(0, 4);
  text(gradeText, x + 6, y + cardHeight - 18);

  // Difficulty badge
  let diffColors = {
    Beginner: [60, 140, 80],
    Intermediate: [200, 150, 50],
    Advanced: [180, 60, 60]
  };
  let diffColor = diffColors[item.difficulty] || [100, 100, 100];
  fill(diffColor[0], diffColor[1], diffColor[2], opacity);
  textAlign(RIGHT, TOP);
  text(item.difficulty.substring(0, 3), x + cardWidth - 6, y + cardHeight - 18);
}

function drawRightPanel() {
  let rightX = canvasWidth - rightPanelWidth;

  // Panel background
  fill(250);
  noStroke();
  rect(rightX, 0, rightPanelWidth, drawHeight);

  // Panel border
  stroke('silver');
  strokeWeight(1);
  line(rightX, 0, rightX, drawHeight);

  // Count matching items
  let matchCount = 0;
  for (let item of sampleMicroSims) {
    if (matchesFilters(item)) matchCount++;
  }

  // Results count
  fill(50);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Results', rightX + rightPanelWidth / 2, 15);

  // Count display
  textSize(36);
  fill(70, 130, 180);
  text(matchCount, rightX + rightPanelWidth / 2, 40);

  textSize(12);
  fill(100);
  text('of ' + sampleMicroSims.length + ' MicroSims', rightX + rightPanelWidth / 2, 80);

  // Active filters section
  textSize(14);
  fill(50);
  text('Active Filters', rightX + rightPanelWidth / 2, 115);

  let badgeY = 140;
  let badgeX = rightX + 10;
  textAlign(LEFT, TOP);
  textSize(11);

  // Subject filter badge
  if (subjectFilter !== 'All') {
    drawFilterBadge(badgeX, badgeY, subjectFilter, subjectColors[subjectFilter] || [100, 100, 100]);
    badgeY += 28;
  }

  // Grade level badges
  for (let level of gradeLevelFilters) {
    drawFilterBadge(badgeX, badgeY, level, [100, 100, 150]);
    badgeY += 28;
  }

  // Difficulty badges
  let diffColors = {
    Beginner: [60, 140, 80],
    Intermediate: [200, 150, 50],
    Advanced: [180, 60, 60]
  };
  for (let diff of difficultyFilters) {
    drawFilterBadge(badgeX, badgeY, diff, diffColors[diff] || [100, 100, 100]);
    badgeY += 28;
  }

  // Type badges
  for (let t of typeFilters) {
    drawFilterBadge(badgeX, badgeY, t, [150, 100, 150]);
    badgeY += 28;
  }

  // No filters message
  if (subjectFilter === 'All' && gradeLevelFilters.length === 0 &&
      difficultyFilters.length === 0 && typeFilters.length === 0) {
    fill(150);
    textAlign(CENTER, TOP);
    textSize(11);
    text('No filters active', rightX + rightPanelWidth / 2, 145);
    text('(showing all)', rightX + rightPanelWidth / 2, 160);
  }
}

function drawFilterBadge(x, y, label, color) {
  let badgeWidth = rightPanelWidth - 20;
  let badgeHeight = 22;

  // Badge background
  fill(color[0], color[1], color[2], 40);
  stroke(color[0], color[1], color[2]);
  strokeWeight(1);
  rect(x, y, badgeWidth, badgeHeight, 4);

  // Badge text
  fill(color[0], color[1], color[2]);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(11);
  text(label, x + 8, y + badgeHeight / 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
