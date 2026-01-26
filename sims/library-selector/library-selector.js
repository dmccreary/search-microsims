// Library Selector MicroSim
// Decision tree for choosing JavaScript visualization libraries
// Bloom Level: Apply (L3) - select appropriate library
// MicroSim template version 2026.02

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Decision tree structure
const decisionTree = {
  root: {
    question: 'What do you need to visualize?',
    options: [
      { label: 'Animation/Simulation', next: 'p5js' },
      { label: 'Data Charts', next: 'charts' },
      { label: 'Networks/Graphs', next: 'visnetwork' },
      { label: 'Maps', next: 'leaflet' },
      { label: 'Timelines', next: 'vistimeline' },
      { label: 'Diagrams', next: 'diagrams' }
    ]
  },
  charts: {
    question: 'Need 3D or scientific plots?',
    options: [
      { label: 'Yes, scientific/3D', next: 'plotly' },
      { label: 'No, standard charts', next: 'chartjs' }
    ]
  },
  diagrams: {
    question: 'Need interactivity?',
    options: [
      { label: 'Static flowcharts', next: 'mermaid' },
      { label: 'Interactive', next: 'p5js' }
    ]
  }
};

// Library recommendations
const libraries = {
  p5js: {
    name: 'p5.js',
    color: '#ed225d',
    tagline: 'Creative coding for animations & simulations',
    bestFor: ['Custom animations', 'Physics simulations', 'Interactive art', 'Educational games'],
    size: '~800KB',
    learning: 'Easy'
  },
  chartjs: {
    name: 'Chart.js',
    color: '#ff6384',
    tagline: 'Simple, clean charts',
    bestFor: ['Bar charts', 'Line graphs', 'Pie charts', 'Radar charts'],
    size: '~200KB',
    learning: 'Easy'
  },
  plotly: {
    name: 'Plotly.js',
    color: '#3f4f75',
    tagline: 'Scientific & 3D visualization',
    bestFor: ['3D plots', 'Heatmaps', 'Contour plots', 'Statistical charts'],
    size: '~3MB',
    learning: 'Medium'
  },
  visnetwork: {
    name: 'vis-network',
    color: '#f5a623',
    tagline: 'Network & graph visualization',
    bestFor: ['Node-edge graphs', 'Concept maps', 'Dependency trees', 'Social networks'],
    size: '~500KB',
    learning: 'Medium'
  },
  vistimeline: {
    name: 'vis-timeline',
    color: '#4a90d9',
    tagline: 'Interactive timelines',
    bestFor: ['Historical events', 'Project schedules', 'Life events', 'Sequential data'],
    size: '~400KB',
    learning: 'Easy'
  },
  leaflet: {
    name: 'Leaflet.js',
    color: '#199900',
    tagline: 'Interactive maps',
    bestFor: ['Geographic data', 'Location markers', 'Routes & paths', 'Heatmaps on maps'],
    size: '~150KB',
    learning: 'Easy'
  },
  mermaid: {
    name: 'Mermaid.js',
    color: '#ff3670',
    tagline: 'Diagrams from text',
    bestFor: ['Flowcharts', 'Sequence diagrams', 'Class diagrams', 'State machines'],
    size: '~2MB',
    learning: 'Easy'
  }
};

// State
let currentNode = 'root';
let path = [];
let selectedLibrary = null;
let hoveredOption = -1;

// UI Elements
let resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  resetButton = createButton('Start Over');
  resetButton.position(10, drawHeight + 12);
  resetButton.mousePressed(resetTree);

  describe('Decision tree to help select the right JavaScript library for different visualization needs. Answer questions to get a recommendation.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('JavaScript Library Selector', canvasWidth / 2, 10);

  // Draw breadcrumb path
  drawBreadcrumbs();

  if (selectedLibrary) {
    // Show library recommendation
    drawRecommendation();
  } else {
    // Show current question
    drawQuestion();
  }

  // Draw library palette at bottom
  drawLibraryPalette();
}

function drawBreadcrumbs() {
  if (path.length === 0) return;

  let x = 15;
  let y = 40;

  fill('#666');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(10);

  for (let i = 0; i < path.length; i++) {
    let step = path[i];
    if (i > 0) {
      fill('#ccc');
      text(' → ', x, y);
      x += textWidth(' → ');
    }
    fill('#3498db');
    text(step, x, y);
    x += textWidth(step);
  }
}

function drawQuestion() {
  let node = decisionTree[currentNode];
  if (!node) return;

  let questionY = 70;
  let optionStartY = 110;
  let optionHeight = 45;

  // Question box
  fill('#2c3e50');
  stroke('#34495e');
  strokeWeight(2);
  rect(30, questionY, canvasWidth - 60, 35, 8);

  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(node.question, canvasWidth / 2, questionY + 17);

  // Options
  hoveredOption = -1;
  for (let i = 0; i < node.options.length; i++) {
    let opt = node.options[i];
    let y = optionStartY + i * optionHeight;
    let isHovered = mouseY > y && mouseY < y + optionHeight - 5 &&
                    mouseX > 40 && mouseX < canvasWidth - 40;

    if (isHovered) hoveredOption = i;

    // Option button
    fill(isHovered ? '#3498db' : '#ecf0f1');
    stroke(isHovered ? '#2980b9' : '#bdc3c7');
    strokeWeight(2);
    rect(40, y, canvasWidth - 80, optionHeight - 8, 8);

    // Option text
    fill(isHovered ? 'white' : '#2c3e50');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text(opt.label, canvasWidth / 2, y + (optionHeight - 8) / 2);

    // Arrow indicator
    if (isHovered) {
      fill('white');
      triangle(canvasWidth - 60, y + 18, canvasWidth - 50, y + 23, canvasWidth - 60, y + 28);
    }
  }
}

function drawRecommendation() {
  let lib = libraries[selectedLibrary];
  if (!lib) return;

  let boxY = 60;
  let boxHeight = 240;

  // Recommendation box
  fill(lib.color);
  noStroke();
  rect(30, boxY, canvasWidth - 60, 50, 10, 10, 0, 0);

  fill('white');
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text(lib.name, canvasWidth / 2, boxY + 25);
  textStyle(NORMAL);

  // Details box
  fill('white');
  stroke('#ddd');
  strokeWeight(1);
  rect(30, boxY + 50, canvasWidth - 60, boxHeight - 50, 0, 0, 10, 10);

  // Tagline
  fill(lib.color);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(ITALIC);
  text(lib.tagline, canvasWidth / 2, boxY + 60);
  textStyle(NORMAL);

  // Best for section
  fill('#2c3e50');
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Best for:', 50, boxY + 90);
  textStyle(NORMAL);

  textSize(11);
  fill('#555');
  for (let i = 0; i < lib.bestFor.length; i++) {
    text('• ' + lib.bestFor[i], 60, boxY + 108 + i * 18);
  }

  // Stats
  let statsY = boxY + 190;
  fill('#666');
  textSize(10);
  text('Size: ' + lib.size, 50, statsY);
  text('Learning Curve: ' + lib.learning, 50, statsY + 15);

  // Try it suggestion
  fill(lib.color);
  textAlign(CENTER, TOP);
  textSize(12);
  text('Recommended for your use case!', canvasWidth / 2, statsY + 35);
}

function drawLibraryPalette() {
  let paletteY = drawHeight - 55;
  let libNames = Object.keys(libraries);
  let boxWidth = (canvasWidth - 30) / libNames.length;

  fill('#f5f5f5');
  noStroke();
  rect(10, paletteY - 15, canvasWidth - 20, 60, 5);

  fill('#666');
  textAlign(LEFT, TOP);
  textSize(9);
  text('Libraries:', 15, paletteY - 10);

  for (let i = 0; i < libNames.length; i++) {
    let lib = libraries[libNames[i]];
    let x = 15 + i * boxWidth;
    let isSelected = selectedLibrary === libNames[i];

    // Mini card
    fill(isSelected ? lib.color : '#fff');
    stroke(lib.color);
    strokeWeight(isSelected ? 2 : 1);
    rect(x, paletteY + 5, boxWidth - 5, 30, 4);

    // Name
    fill(isSelected ? 'white' : lib.color);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(8);
    text(lib.name, x + (boxWidth - 5) / 2, paletteY + 20);
  }
}

function mousePressed() {
  if (selectedLibrary) {
    // Check if clicking in palette
    let paletteY = drawHeight - 55;
    if (mouseY > paletteY && mouseY < paletteY + 50) {
      let libNames = Object.keys(libraries);
      let boxWidth = (canvasWidth - 30) / libNames.length;
      for (let i = 0; i < libNames.length; i++) {
        let x = 15 + i * boxWidth;
        if (mouseX > x && mouseX < x + boxWidth - 5) {
          selectedLibrary = libNames[i];
          return;
        }
      }
    }
    return;
  }

  // Check option click
  if (hoveredOption >= 0) {
    let node = decisionTree[currentNode];
    let opt = node.options[hoveredOption];
    path.push(opt.label);

    if (libraries[opt.next]) {
      // Reached a library
      selectedLibrary = opt.next;
    } else if (decisionTree[opt.next]) {
      // Go to next question
      currentNode = opt.next;
    }
  }
}

function resetTree() {
  currentNode = 'root';
  path = [];
  selectedLibrary = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
