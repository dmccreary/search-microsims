// Faceted Search Interface Simulator MicroSim
// Interactive demonstration of faceted filtering

let canvasWidth = 800;
const drawHeight = 530;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Sample MicroSim data
const microsims = [
  { id: 1, title: 'Pendulum Period Calculator', subject: 'Physics', grade: 'Undergraduate', framework: 'p5.js', difficulty: 'Intermediate' },
  { id: 2, title: 'Wave Interference Simulator', subject: 'Physics', grade: 'Undergraduate', framework: 'p5.js', difficulty: 'Intermediate' },
  { id: 3, title: 'Projectile Motion Lab', subject: 'Physics', grade: 'High School', framework: 'p5.js', difficulty: 'Beginner' },
  { id: 4, title: 'Electric Circuit Builder', subject: 'Physics', grade: 'High School', framework: 'p5.js', difficulty: 'Intermediate' },
  { id: 5, title: 'Molecular Viewer 3D', subject: 'Chemistry', grade: 'Undergraduate', framework: 'Three.js', difficulty: 'Advanced' },
  { id: 6, title: 'Reaction Rate Explorer', subject: 'Chemistry', grade: 'High School', framework: 'p5.js', difficulty: 'Beginner' },
  { id: 7, title: 'Periodic Table Interactive', subject: 'Chemistry', grade: 'Middle School', framework: 'D3.js', difficulty: 'Beginner' },
  { id: 8, title: 'Function Grapher', subject: 'Mathematics', grade: 'High School', framework: 'p5.js', difficulty: 'Beginner' },
  { id: 9, title: 'Geometry Transformations', subject: 'Mathematics', grade: 'Middle School', framework: 'p5.js', difficulty: 'Beginner' },
  { id: 10, title: 'Statistics Dashboard', subject: 'Mathematics', grade: 'Undergraduate', framework: 'D3.js', difficulty: 'Intermediate' },
  { id: 11, title: 'Ecosystem Simulator', subject: 'Biology', grade: 'Undergraduate', framework: 'p5.js', difficulty: 'Intermediate' },
  { id: 12, title: 'Cell Division Visualizer', subject: 'Biology', grade: 'High School', framework: 'p5.js', difficulty: 'Beginner' },
  { id: 13, title: 'Gravity Simulation', subject: 'Physics', grade: 'Graduate', framework: 'Three.js', difficulty: 'Advanced' },
  { id: 14, title: 'Sorting Algorithms', subject: 'Computer Science', grade: 'Undergraduate', framework: 'p5.js', difficulty: 'Intermediate' },
  { id: 15, title: 'Data Structures Viz', subject: 'Computer Science', grade: 'Undergraduate', framework: 'D3.js', difficulty: 'Intermediate' },
  { id: 16, title: 'pH Scale Simulator', subject: 'Chemistry', grade: 'Middle School', framework: 'p5.js', difficulty: 'Beginner' },
  { id: 17, title: 'Harmonic Motion', subject: 'Physics', grade: 'Undergraduate', framework: 'p5.js', difficulty: 'Intermediate' },
  { id: 18, title: 'Probability Dice', subject: 'Mathematics', grade: 'Middle School', framework: 'p5.js', difficulty: 'Beginner' },
  { id: 19, title: 'Neural Network Demo', subject: 'Computer Science', grade: 'Graduate', framework: 'p5.js', difficulty: 'Advanced' },
  { id: 20, title: 'Genetics Simulator', subject: 'Biology', grade: 'Undergraduate', framework: 'p5.js', difficulty: 'Intermediate' }
];

// Facet definitions
const facets = {
  subject: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
  grade: ['Middle School', 'High School', 'Undergraduate', 'Graduate'],
  framework: ['p5.js', 'D3.js', 'Three.js'],
  difficulty: ['Beginner', 'Intermediate', 'Advanced']
};

// Selected filters
let selectedFilters = {
  subject: [],
  grade: [],
  framework: [],
  difficulty: []
};

// Search query
let searchQuery = '';
let searchInput;

// Filtered results
let filteredResults = [];
let facetCounts = {};

// UI state
let hoveredResult = -1;
let scrollOffset = 0;
const resultsPerPage = 6;

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Create search input
  searchInput = createInput('');
  searchInput.parent('canvas-container');
  searchInput.position(canvasWidth * 0.32 + 80, 55);
  searchInput.size(200);
  searchInput.attribute('placeholder', 'Search MicroSims...');
  searchInput.input(() => {
    searchQuery = searchInput.value().toLowerCase();
    applyFilters();
  });

  applyFilters();
}

function applyFilters() {
  // Filter microsims
  filteredResults = microsims.filter(sim => {
    // Check search query
    if (searchQuery) {
      const searchable = (sim.title + ' ' + sim.subject).toLowerCase();
      if (!searchable.includes(searchQuery)) return false;
    }

    // Check facet filters (OR within facet, AND across facets)
    for (let facet in selectedFilters) {
      if (selectedFilters[facet].length > 0) {
        if (!selectedFilters[facet].includes(sim[facet])) return false;
      }
    }

    return true;
  });

  // Calculate facet counts
  calculateFacetCounts();

  // Reset scroll
  scrollOffset = 0;
}

function calculateFacetCounts() {
  facetCounts = {};

  for (let facet in facets) {
    facetCounts[facet] = {};
    for (let value of facets[facet]) {
      // Count how many results would match if this filter were added
      facetCounts[facet][value] = filteredResults.filter(sim => sim[facet] === value).length;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  searchInput.position(canvasWidth * 0.32 + 80, 55);
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
  text('Faceted Search Simulator', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Draw facet panel
  drawFacetPanel();

  // Draw results panel
  drawResultsPanel();

  // Draw active filters
  drawActiveFilters();

  // Draw controls
  drawControls();
}

function drawFacetPanel() {
  const panelX = 15;
  const panelY = 85;
  const panelW = canvasWidth * 0.28;
  const panelH = drawHeight - 95;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Facet groups
  const facetNames = {
    subject: 'Subject Area',
    grade: 'Grade Level',
    framework: 'Framework',
    difficulty: 'Difficulty'
  };

  let yPos = panelY + 15;
  textAlign(LEFT, TOP);

  for (let facet in facets) {
    // Facet title
    fill(50);
    textSize(11);
    textStyle(BOLD);
    text(facetNames[facet], panelX + 12, yPos);
    textStyle(NORMAL);
    yPos += 18;

    // Facet values
    for (let value of facets[facet]) {
      const count = facetCounts[facet]?.[value] || 0;
      const isSelected = selectedFilters[facet].includes(value);
      const isDisabled = count === 0 && !isSelected;

      // Checkbox
      fill(isSelected ? color(70, 130, 180) : 255);
      stroke(isDisabled ? 200 : 150);
      strokeWeight(1);
      rect(panelX + 15, yPos, 14, 14, 2);

      if (isSelected) {
        fill(255);
        noStroke();
        textSize(10);
        text('✓', panelX + 22, yPos + 7);
      }

      // Label and count
      fill(isDisabled ? 180 : 60);
      noStroke();
      textSize(10);
      text(`${value} (${count})`, panelX + 35, yPos + 2);

      yPos += 18;
    }

    yPos += 10;
  }

  textAlign(CENTER, CENTER);
}

function drawResultsPanel() {
  const panelX = canvasWidth * 0.32;
  const panelY = 85;
  const panelW = canvasWidth * 0.66;
  const panelH = drawHeight - 95;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Results count
  fill(80);
  noStroke();
  textSize(11);
  text(`Showing ${filteredResults.length} of ${microsims.length} results`,
       panelX + panelW / 2, panelY + 18);

  // Results grid
  const cardW = (panelW - 40) / 2;
  const cardH = 75;
  const startY = panelY + 40;

  const displayResults = filteredResults.slice(scrollOffset, scrollOffset + resultsPerPage);

  for (let i = 0; i < displayResults.length; i++) {
    const sim = displayResults[i];
    const col = i % 2;
    const row = floor(i / 2);
    const x = panelX + 15 + col * (cardW + 10);
    const y = startY + row * (cardH + 10);

    // Card background
    const isHovered = hoveredResult === i;
    fill(isHovered ? 248 : 255);
    stroke(isHovered ? 150 : 220);
    strokeWeight(1);
    rect(x, y, cardW, cardH, 5);

    // Title
    fill(30);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(sim.title, x + 8, y + 8, cardW - 16);
    textStyle(NORMAL);

    // Badges
    textSize(9);
    let badgeX = x + 8;
    const badgeY = y + 30;

    // Subject badge
    fill(100, 149, 237, 50);
    noStroke();
    const subjectW = textWidth(sim.subject) + 10;
    rect(badgeX, badgeY, subjectW, 16, 3);
    fill(70, 130, 180);
    text(sim.subject, badgeX + 5, badgeY + 3);
    badgeX += subjectW + 5;

    // Grade badge
    fill(144, 238, 144, 50);
    const gradeW = textWidth(sim.grade) + 10;
    rect(badgeX, badgeY, gradeW, 16, 3);
    fill(34, 139, 34);
    text(sim.grade, badgeX + 5, badgeY + 3);
    badgeX += gradeW + 5;

    // Framework badge
    fill(255, 182, 193, 50);
    const fwW = textWidth(sim.framework) + 10;
    rect(badgeX, badgeY, fwW, 16, 3);
    fill(199, 21, 133);
    text(sim.framework, badgeX + 5, badgeY + 3);

    // Difficulty
    fill(120);
    text(sim.difficulty, x + 8, y + 55);

    textAlign(CENTER, CENTER);
  }

  // Pagination
  if (filteredResults.length > resultsPerPage) {
    const totalPages = ceil(filteredResults.length / resultsPerPage);
    const currentPage = floor(scrollOffset / resultsPerPage) + 1;

    fill(100);
    textSize(10);
    text(`Page ${currentPage} of ${totalPages}`, panelX + panelW / 2, panelY + panelH - 15);

    // Prev/Next buttons
    if (currentPage > 1) {
      fill(70, 130, 180);
      text('← Prev', panelX + panelW / 2 - 70, panelY + panelH - 15);
    }
    if (currentPage < totalPages) {
      fill(70, 130, 180);
      text('Next →', panelX + panelW / 2 + 70, panelY + panelH - 15);
    }
  }

  // Empty state
  if (filteredResults.length === 0) {
    fill(150);
    textSize(12);
    text('No MicroSims match your filters', panelX + panelW / 2, panelY + panelH / 2);
  }
}

function drawActiveFilters() {
  // Check if any filters active
  const activeFilters = [];
  for (let facet in selectedFilters) {
    for (let value of selectedFilters[facet]) {
      activeFilters.push({ facet, value });
    }
  }

  if (activeFilters.length === 0) return;

  const startX = canvasWidth * 0.32 + 15;
  const y = 55;

  fill(80);
  textSize(10);
  textAlign(LEFT, CENTER);
  text('Active:', startX, y);

  let chipX = startX + 45;
  textSize(9);

  for (let filter of activeFilters) {
    const chipW = textWidth(filter.value) + 25;

    fill(70, 130, 180, 30);
    stroke(70, 130, 180);
    strokeWeight(1);
    rect(chipX, y - 10, chipW, 20, 10);

    fill(70, 130, 180);
    noStroke();
    text(filter.value, chipX + 5, y);
    text('×', chipX + chipW - 15, y);

    chipX += chipW + 5;
  }

  textAlign(CENTER, CENTER);
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Clear All button
  const clearX = canvasWidth / 2 - 60;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(clearX, buttonY, 120, buttonH, 5);
  fill(255);
  noStroke();
  textSize(12);
  text('Clear All Filters', clearX + 60, buttonY + buttonH / 2);

  // Stats
  fill(100);
  textSize(10);
  const activeCount = Object.values(selectedFilters).flat().length;
  text(`${activeCount} filters active`, canvasWidth - 100, buttonY + buttonH / 2);
}

function mousePressed() {
  const panelX = 15;
  const panelY = 85;
  const panelW = canvasWidth * 0.28;

  // Check facet checkboxes
  let yPos = panelY + 33;

  for (let facet in facets) {
    for (let value of facets[facet]) {
      if (mouseX >= panelX + 15 && mouseX <= panelX + 29 &&
          mouseY >= yPos && mouseY <= yPos + 14) {
        toggleFilter(facet, value);
        return;
      }
      yPos += 18;
    }
    yPos += 28;
  }

  // Check Clear All button
  const buttonY = drawHeight + 18;
  const buttonH = 32;
  const clearX = canvasWidth / 2 - 60;

  if (mouseX >= clearX && mouseX <= clearX + 120 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    clearAllFilters();
    return;
  }

  // Check pagination
  const resultsX = canvasWidth * 0.32;
  const resultsW = canvasWidth * 0.66;
  const resultsH = drawHeight - 95;

  if (filteredResults.length > resultsPerPage) {
    const totalPages = ceil(filteredResults.length / resultsPerPage);
    const currentPage = floor(scrollOffset / resultsPerPage) + 1;

    // Prev button
    if (currentPage > 1 &&
        mouseX >= resultsX + resultsW / 2 - 90 && mouseX <= resultsX + resultsW / 2 - 50 &&
        mouseY >= 85 + resultsH - 25 && mouseY <= 85 + resultsH - 5) {
      scrollOffset -= resultsPerPage;
      return;
    }

    // Next button
    if (currentPage < totalPages &&
        mouseX >= resultsX + resultsW / 2 + 50 && mouseX <= resultsX + resultsW / 2 + 90 &&
        mouseY >= 85 + resultsH - 25 && mouseY <= 85 + resultsH - 5) {
      scrollOffset += resultsPerPage;
      return;
    }
  }

  // Check active filter chip removal
  const activeFilters = [];
  for (let facet in selectedFilters) {
    for (let value of selectedFilters[facet]) {
      activeFilters.push({ facet, value });
    }
  }

  if (activeFilters.length > 0) {
    let chipX = canvasWidth * 0.32 + 60;
    const chipY = 55;

    for (let filter of activeFilters) {
      const chipW = textWidth(filter.value) + 25;

      if (mouseX >= chipX + chipW - 20 && mouseX <= chipX + chipW &&
          mouseY >= chipY - 10 && mouseY <= chipY + 10) {
        toggleFilter(filter.facet, filter.value);
        return;
      }

      chipX += chipW + 5;
    }
  }
}

function toggleFilter(facet, value) {
  const idx = selectedFilters[facet].indexOf(value);
  if (idx >= 0) {
    selectedFilters[facet].splice(idx, 1);
  } else {
    selectedFilters[facet].push(value);
  }
  applyFilters();
}

function clearAllFilters() {
  for (let facet in selectedFilters) {
    selectedFilters[facet] = [];
  }
  searchQuery = '';
  searchInput.value('');
  applyFilters();
}

function mouseMoved() {
  // Check if hovering over result card
  const panelX = canvasWidth * 0.32;
  const panelY = 85;
  const panelW = canvasWidth * 0.66;
  const cardW = (panelW - 40) / 2;
  const cardH = 75;
  const startY = panelY + 40;

  hoveredResult = -1;

  const displayResults = filteredResults.slice(scrollOffset, scrollOffset + resultsPerPage);

  for (let i = 0; i < displayResults.length; i++) {
    const col = i % 2;
    const row = floor(i / 2);
    const x = panelX + 15 + col * (cardW + 10);
    const y = startY + row * (cardH + 10);

    if (mouseX >= x && mouseX <= x + cardW &&
        mouseY >= y && mouseY <= y + cardH) {
      hoveredResult = i;
      cursor(HAND);
      return;
    }
  }

  // Check buttons
  if (mouseY >= drawHeight + 18 && mouseY <= drawHeight + 50) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
