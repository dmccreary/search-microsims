// Inverted Index Visualizer MicroSim
// Shows how inverted indexes enable fast search

let canvasWidth = 800;
const drawHeight = 450;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Documents
let documents = [
  { id: 'Doc1', title: 'Pendulum Period Physics Simulation' },
  { id: 'Doc2', title: 'Wave Interference Visualization' },
  { id: 'Doc3', title: 'Simple Harmonic Motion Explorer' }
];

// Inverted index
let invertedIndex = {};

// Animation state
let buildingIndex = false;
let buildStep = 0;
let buildSubStep = 0;
let currentDocIdx = 0;
let currentTermIdx = 0;
let currentTerms = [];
let highlightedTerm = null;
let highlightedDocs = [];

// Query state
let queryInput;
let queryTerms = [];
let queryResults = [];
let tracingQuery = false;
let traceStep = 0;

// Statistics
let stats = { totalTerms: 0, totalPostings: 0 };

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Query input
  queryInput = createInput('pendulum wave');
  queryInput.parent('canvas-container');
  queryInput.position(canvasWidth * 0.55 + 80, 55);
  queryInput.size(120);
  queryInput.attribute('placeholder', 'Search query');

  // Build initial index
  buildIndexInstant();
}

function buildIndexInstant() {
  invertedIndex = {};

  for (let doc of documents) {
    const terms = tokenize(doc.title);
    for (let term of terms) {
      if (!invertedIndex[term]) {
        invertedIndex[term] = [];
      }
      if (!invertedIndex[term].includes(doc.id)) {
        invertedIndex[term].push(doc.id);
      }
    }
  }

  updateStats();
}

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2); // Remove very short words
}

function updateStats() {
  stats.totalTerms = Object.keys(invertedIndex).length;
  stats.totalPostings = Object.values(invertedIndex).reduce((sum, arr) => sum + arr.length, 0);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  queryInput.position(canvasWidth * 0.55 + 80, 55);
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
  text('Inverted Index Visualizer', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Draw documents panel
  drawDocuments();

  // Draw index panel
  drawIndex();

  // Draw query panel
  drawQueryPanel();

  // Draw connections
  if (highlightedTerm) {
    drawConnections();
  }

  // Draw controls
  drawControls();

  // Update animation
  if (buildingIndex) {
    updateBuildAnimation();
  }

  if (tracingQuery) {
    updateQueryTrace();
  }
}

function drawDocuments() {
  const panelX = 20;
  const panelY = 50;
  const panelW = canvasWidth * 0.3;
  const panelH = 180;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Documents', panelX + panelW / 2, panelY + 18);
  textStyle(NORMAL);

  // Document cards
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const cardY = panelY + 40 + i * 45;

    // Highlight if in results
    const isHighlighted = highlightedDocs.includes(doc.id);

    fill(isHighlighted ? color(255, 255, 150) : 245);
    stroke(isHighlighted ? color(200, 200, 0) : 200);
    strokeWeight(isHighlighted ? 2 : 1);
    rect(panelX + 10, cardY, panelW - 20, 38, 4);

    // Doc ID
    fill(70, 130, 180);
    noStroke();
    textSize(10);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(doc.id, panelX + 18, cardY + 6);
    textStyle(NORMAL);

    // Title
    fill(50);
    textSize(10);
    text(doc.title, panelX + 18, cardY + 20, panelW - 35);

    textAlign(CENTER, CENTER);
  }

  // Add document hint
  fill(150);
  textSize(9);
  text('Click "Add Document" to add more', panelX + panelW / 2, panelY + panelH - 15);
}

function drawIndex() {
  const panelX = canvasWidth * 0.33;
  const panelY = 50;
  const panelW = canvasWidth * 0.20;
  const panelH = 380;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Inverted Index', panelX + panelW / 2, panelY + 18);
  textStyle(NORMAL);

  // Index entries
  const terms = Object.keys(invertedIndex).sort();
  const startY = panelY + 40;
  const entryHeight = 22;
  const maxShow = 14;

  textAlign(LEFT, CENTER);
  textSize(10);

  for (let i = 0; i < min(terms.length, maxShow); i++) {
    const term = terms[i];
    const postings = invertedIndex[term];
    const y = startY + i * entryHeight;

    // Highlight
    const isHighlighted = term === highlightedTerm || queryTerms.includes(term);

    fill(isHighlighted ? color(200, 230, 255) : 255);
    stroke(isHighlighted ? color(100, 150, 200) : 230);
    strokeWeight(1);
    rect(panelX + 5, y, panelW - 10, entryHeight - 2, 3);

    // Term
    fill(50);
    noStroke();
    textStyle(isHighlighted ? BOLD : NORMAL);
    text(term, panelX + 10, y + entryHeight / 2 - 1);
    textStyle(NORMAL);

    // Postings
    fill(100);
    textAlign(RIGHT, CENTER);
    text(`[${postings.join(', ')}]`, panelX + panelW - 10, y + entryHeight / 2 - 1);
    textAlign(LEFT, CENTER);
  }

  if (terms.length > maxShow) {
    fill(100);
    textAlign(CENTER, CENTER);
    text(`... and ${terms.length - maxShow} more terms`, panelX + panelW / 2, startY + maxShow * entryHeight);
  }

  // Stats
  fill(80);
  textSize(9);
  textAlign(CENTER, CENTER);
  text(`${stats.totalTerms} terms, ${stats.totalPostings} postings`, panelX + panelW / 2, panelY + panelH - 12);
}

function drawQueryPanel() {
  const panelX = canvasWidth * 0.55;
  const panelY = 50;
  const panelW = canvasWidth * 0.42;
  const panelH = 180;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title
  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Query & Results', panelX + panelW / 2, panelY + 18);
  textStyle(NORMAL);

  // Query label
  textSize(10);
  fill(80);
  textAlign(LEFT, CENTER);
  text('Query:', panelX + 15, panelY + 45);

  // Results section
  const resultsY = panelY + 80;

  fill(50);
  textStyle(BOLD);
  text('Matching Documents:', panelX + 15, resultsY);
  textStyle(NORMAL);

  if (queryResults.length > 0) {
    for (let i = 0; i < queryResults.length; i++) {
      const docId = queryResults[i];
      const doc = documents.find(d => d.id === docId);

      fill(70, 130, 180);
      text(`• ${docId}`, panelX + 20, resultsY + 20 + i * 18);

      if (doc) {
        fill(100);
        text(` - ${doc.title.substring(0, 30)}...`, panelX + 55, resultsY + 20 + i * 18);
      }
    }
  } else if (queryTerms.length > 0) {
    fill(150);
    text('No matching documents', panelX + 20, resultsY + 20);
  }

  textAlign(CENTER, CENTER);

  // Trace explanation
  if (tracingQuery && traceStep < queryTerms.length) {
    const currentTerm = queryTerms[traceStep];
    fill(80);
    textSize(9);
    text(`Looking up "${currentTerm}" in index...`, panelX + panelW / 2, panelY + panelH - 15);
  }
}

function drawConnections() {
  // Draw lines from highlighted term to its documents
  const termX = canvasWidth * 0.33 + canvasWidth * 0.1;
  const termY = 100; // Approximate

  for (let docId of highlightedDocs) {
    const docIdx = documents.findIndex(d => d.id === docId);
    if (docIdx >= 0) {
      const docX = 20 + canvasWidth * 0.3 - 10;
      const docY = 50 + 40 + docIdx * 45 + 19;

      stroke(100, 150, 200, 150);
      strokeWeight(2);
      line(termX - 30, termY, docX, docY);
    }
  }
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Build Index button
  const buildX = 50;
  fill('#4CAF50');
  stroke(100);
  strokeWeight(1);
  rect(buildX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  textSize(11);
  text('Build Index', buildX + 50, buttonY + buttonH / 2);

  // Trace Query button
  const traceX = 170;
  fill('#2196F3');
  stroke(100);
  strokeWeight(1);
  rect(traceX, buttonY, 100, buttonH, 5);
  fill(255);
  noStroke();
  text('Trace Query', traceX + 50, buttonY + buttonH / 2);

  // Add Document button
  const addX = 290;
  fill('#FF9800');
  stroke(100);
  strokeWeight(1);
  rect(addX, buttonY, 110, buttonH, 5);
  fill(255);
  noStroke();
  text('Add Document', addX + 55, buttonY + buttonH / 2);

  // Reset button
  const resetX = 420;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  text('Reset', resetX + 40, buttonY + buttonH / 2);

  // Instructions
  fill(100);
  textSize(10);
  text('Click terms in index to highlight connections', canvasWidth - 150, buttonY + buttonH / 2);
}

function updateBuildAnimation() {
  // Simplified build animation
  buildStep++;
  if (buildStep > 60) {
    buildingIndex = false;
    buildStep = 0;
  }
}

function updateQueryTrace() {
  // Update query trace animation
}

function mousePressed() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Check Build Index button
  if (mouseX >= 50 && mouseX <= 150 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    buildingIndex = true;
    buildStep = 0;
    buildIndexInstant();
    return;
  }

  // Check Trace Query button
  if (mouseX >= 170 && mouseX <= 270 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    traceQuery();
    return;
  }

  // Check Add Document button
  if (mouseX >= 290 && mouseX <= 400 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    addSampleDocument();
    return;
  }

  // Check Reset button
  if (mouseX >= 420 && mouseX <= 500 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    resetAll();
    return;
  }

  // Check index term clicks
  const panelX = canvasWidth * 0.33;
  const panelY = 50;
  const panelW = canvasWidth * 0.20;

  if (mouseX >= panelX && mouseX <= panelX + panelW &&
      mouseY >= panelY + 40 && mouseY <= panelY + 380) {

    const terms = Object.keys(invertedIndex).sort();
    const entryHeight = 22;
    const clickedIdx = floor((mouseY - panelY - 40) / entryHeight);

    if (clickedIdx >= 0 && clickedIdx < terms.length) {
      const term = terms[clickedIdx];
      if (highlightedTerm === term) {
        highlightedTerm = null;
        highlightedDocs = [];
      } else {
        highlightedTerm = term;
        highlightedDocs = invertedIndex[term] || [];
      }
    }
  }
}

function traceQuery() {
  const query = queryInput.value();
  queryTerms = tokenize(query);
  queryResults = [];

  if (queryTerms.length === 0) return;

  // Find intersection of posting lists (AND search)
  let resultSet = null;

  for (let term of queryTerms) {
    const postings = invertedIndex[term] || [];

    if (resultSet === null) {
      resultSet = new Set(postings);
    } else {
      resultSet = new Set([...resultSet].filter(x => postings.includes(x)));
    }
  }

  queryResults = resultSet ? Array.from(resultSet) : [];
  highlightedDocs = queryResults;
  highlightedTerm = queryTerms[0];
}

function addSampleDocument() {
  const sampleTitles = [
    'Physics Wave Propagation Demo',
    'Pendulum Wave Art Generator',
    'Oscillation Period Calculator',
    'Gravity and Mass Explorer',
    'Electromagnetic Spectrum Viz'
  ];

  const nextId = `Doc${documents.length + 1}`;
  const title = sampleTitles[documents.length % sampleTitles.length];

  documents.push({ id: nextId, title: title });
  buildIndexInstant();
}

function resetAll() {
  documents = [
    { id: 'Doc1', title: 'Pendulum Period Physics Simulation' },
    { id: 'Doc2', title: 'Wave Interference Visualization' },
    { id: 'Doc3', title: 'Simple Harmonic Motion Explorer' }
  ];

  buildIndexInstant();
  queryTerms = [];
  queryResults = [];
  highlightedTerm = null;
  highlightedDocs = [];
}
