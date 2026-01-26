// ItemsJS API Explorer MicroSim
// Interactive explorer showing ItemsJS search API usage

let canvasWidth = 800;
const drawHeight = 480;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Sample MicroSim data
const sampleData = [
  { id: 1, title: "Wave Simulator", description: "Interactive wave motion demo", subjectArea: "Physics", gradeLevel: "Undergraduate", framework: "p5.js" },
  { id: 2, title: "Pendulum Lab", description: "Simple harmonic motion exploration", subjectArea: "Physics", gradeLevel: "High School", framework: "p5.js" },
  { id: 3, title: "Fraction Builder", description: "Visual fraction manipulation", subjectArea: "Mathematics", gradeLevel: "K-12", framework: "p5.js" },
  { id: 4, title: "Cell Division", description: "Mitosis and meiosis animation", subjectArea: "Biology", gradeLevel: "Undergraduate", framework: "d3.js" },
  { id: 5, title: "Sorting Algorithm", description: "Compare sorting techniques", subjectArea: "Computer Science", gradeLevel: "Undergraduate", framework: "p5.js" },
  { id: 6, title: "Graph Traversal", description: "BFS and DFS visualization", subjectArea: "Computer Science", gradeLevel: "Undergraduate", framework: "d3.js" },
  { id: 7, title: "Ohm's Law", description: "Circuit simulation", subjectArea: "Physics", gradeLevel: "High School", framework: "p5.js" },
  { id: 8, title: "Quadratic Explorer", description: "Parabola manipulation", subjectArea: "Mathematics", gradeLevel: "High School", framework: "p5.js" },
  { id: 9, title: "Ecosystem Model", description: "Predator-prey dynamics", subjectArea: "Biology", gradeLevel: "Undergraduate", framework: "p5.js" },
  { id: 10, title: "Binary Trees", description: "Tree data structure explorer", subjectArea: "Computer Science", gradeLevel: "Undergraduate", framework: "d3.js" },
  { id: 11, title: "Projectile Motion", description: "Trajectory calculator", subjectArea: "Physics", gradeLevel: "High School", framework: "p5.js" },
  { id: 12, title: "Statistics Dashboard", description: "Mean, median, mode visual", subjectArea: "Mathematics", gradeLevel: "High School", framework: "p5.js" },
  { id: 13, title: "DNA Replication", description: "Molecular process animation", subjectArea: "Biology", gradeLevel: "Undergraduate", framework: "three.js" },
  { id: 14, title: "Hash Tables", description: "Collision resolution demo", subjectArea: "Computer Science", gradeLevel: "Undergraduate", framework: "p5.js" },
  { id: 15, title: "Geometry Proofs", description: "Interactive proof builder", subjectArea: "Mathematics", gradeLevel: "High School", framework: "p5.js" }
];

// ItemsJS configuration
const itemsjsConfig = {
  searchableFields: ['title', 'description'],
  aggregations: {
    subjectArea: { title: 'Subject Area', size: 10 },
    gradeLevel: { title: 'Grade Level', size: 10 },
    framework: { title: 'Framework', size: 10 }
  }
};

// Search state
let searchQuery = "";
let selectedFilters = {
  subjectArea: [],
  gradeLevel: [],
  framework: []
};
let sortOption = "title_asc";
let currentPage = 1;
let perPage = 5;
let searchResults = null;
let activeTab = "items"; // "items", "aggregations", "raw"

// UI state
let queryInput;
let searchEngine;

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(LEFT, TOP);

  // Initialize ItemsJS
  if (typeof itemsjs !== 'undefined') {
    searchEngine = itemsjs(sampleData, itemsjsConfig);
    executeSearch();
  } else {
    // ItemsJS not loaded, use simple filtering
    searchEngine = null;
    executeSimpleSearch();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function executeSearch() {
  if (searchEngine) {
    const searchParams = {
      query: searchQuery,
      filters: {},
      sort: sortOption,
      per_page: perPage,
      page: currentPage
    };

    // Only add filters that have selections
    for (let facet in selectedFilters) {
      if (selectedFilters[facet].length > 0) {
        searchParams.filters[facet] = selectedFilters[facet];
      }
    }

    searchResults = searchEngine.search(searchParams);
  } else {
    executeSimpleSearch();
  }
}

function executeSimpleSearch() {
  // Fallback if ItemsJS isn't loaded
  let filtered = sampleData.filter(item => {
    // Query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(query) &&
          !item.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Facet filters
    for (let facet in selectedFilters) {
      if (selectedFilters[facet].length > 0) {
        if (!selectedFilters[facet].includes(item[facet])) {
          return false;
        }
      }
    }
    return true;
  });

  // Sort
  filtered.sort((a, b) => a.title.localeCompare(b.title));

  // Build results object mimicking ItemsJS
  searchResults = {
    data: {
      items: filtered.slice((currentPage - 1) * perPage, currentPage * perPage),
      aggregations: {
        subjectArea: { buckets: countBuckets(sampleData, 'subjectArea') },
        gradeLevel: { buckets: countBuckets(sampleData, 'gradeLevel') },
        framework: { buckets: countBuckets(sampleData, 'framework') }
      }
    },
    pagination: {
      total: filtered.length,
      page: currentPage,
      per_page: perPage
    }
  };
}

function countBuckets(data, field) {
  const counts = {};
  data.forEach(item => {
    counts[item[field]] = (counts[item[field]] || 0) + 1;
  });
  return Object.entries(counts).map(([key, doc_count]) => ({ key, doc_count }));
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
  textAlign(CENTER, TOP);
  text('ItemsJS API Explorer', canvasWidth / 2, 10);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);

  // Draw panels
  const leftPanelWidth = canvasWidth * 0.38;
  drawQueryBuilder(10, 40, leftPanelWidth - 20, drawHeight - 50);
  drawResultsViewer(leftPanelWidth + 10, 40, canvasWidth - leftPanelWidth - 20, drawHeight - 50);

  // Draw controls
  drawControls();
}

function drawQueryBuilder(x, y, w, h) {
  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Panel title
  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Query Builder', x + 10, y + 10);
  textStyle(NORMAL);

  let yPos = y + 35;

  // Search query
  fill(70);
  textSize(10);
  text('Search Query:', x + 10, yPos);
  yPos += 15;

  // Query input box
  fill(searchQuery ? 255 : 248);
  stroke(150);
  rect(x + 10, yPos, w - 20, 22, 3);
  fill(50);
  noStroke();
  textSize(10);
  text(searchQuery || 'Click to enter query...', x + 15, yPos + 6);
  yPos += 35;

  // Facet filters
  const facets = [
    { key: 'subjectArea', label: 'Subject Area', values: ['Physics', 'Mathematics', 'Biology', 'Computer Science'] },
    { key: 'gradeLevel', label: 'Grade Level', values: ['K-12', 'High School', 'Undergraduate'] },
    { key: 'framework', label: 'Framework', values: ['p5.js', 'd3.js', 'three.js'] }
  ];

  for (let facet of facets) {
    fill(70);
    textSize(10);
    textStyle(BOLD);
    text(facet.label + ':', x + 10, yPos);
    textStyle(NORMAL);
    yPos += 15;

    for (let value of facet.values) {
      const isSelected = selectedFilters[facet.key].includes(value);

      // Checkbox
      fill(isSelected ? color(70, 130, 180) : 255);
      stroke(isSelected ? color(70, 130, 180) : 150);
      rect(x + 15, yPos, 12, 12, 2);

      if (isSelected) {
        stroke(255);
        strokeWeight(2);
        line(x + 18, yPos + 6, x + 21, yPos + 9);
        line(x + 21, yPos + 9, x + 25, yPos + 3);
        strokeWeight(1);
      }

      // Label
      fill(60);
      noStroke();
      textSize(9);
      text(value, x + 32, yPos + 2);
      yPos += 16;
    }
    yPos += 8;
  }

  // Code preview
  fill(70);
  textSize(10);
  textStyle(BOLD);
  text('Generated Code:', x + 10, yPos);
  textStyle(NORMAL);
  yPos += 15;

  // Code box
  fill(40);
  noStroke();
  rect(x + 10, yPos, w - 20, 90, 4);

  // Code text
  fill(150, 220, 150);
  textSize(8);
  textFont('monospace');

  let codeY = yPos + 8;
  text('searchEngine.search({', x + 15, codeY); codeY += 11;

  fill(220, 180, 120);
  text('  query: ', x + 15, codeY);
  fill(200, 150, 150);
  text('"' + searchQuery + '"', x + 60, codeY);
  fill(220, 180, 120);
  text(',', x + 65 + textWidth(searchQuery) * 0.6, codeY);
  codeY += 11;

  fill(220, 180, 120);
  text('  filters: {', x + 15, codeY); codeY += 11;

  for (let facet in selectedFilters) {
    if (selectedFilters[facet].length > 0) {
      fill(150, 180, 220);
      text('    ' + facet + ': ', x + 15, codeY);
      fill(200, 150, 150);
      text('["' + selectedFilters[facet].join('", "') + '"]', x + 80, codeY);
      codeY += 11;
    }
  }

  fill(220, 180, 120);
  text('  }', x + 15, codeY); codeY += 11;
  text('});', x + 15, codeY);

  textFont('sans-serif');
}

function drawResultsViewer(x, y, w, h) {
  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Tab bar
  const tabs = ['Items', 'Aggregations', 'Raw JSON'];
  const tabWidth = w / 3;

  for (let i = 0; i < tabs.length; i++) {
    const tabX = x + i * tabWidth;
    const isActive = activeTab === tabs[i].toLowerCase().replace(' ', '');

    fill(isActive ? 255 : 240);
    stroke(200);
    rect(tabX, y, tabWidth, 25);

    if (isActive) {
      fill(255);
      noStroke();
      rect(tabX + 1, y + 23, tabWidth - 2, 3);
    }

    fill(isActive ? 50 : 100);
    noStroke();
    textSize(10);
    textStyle(isActive ? BOLD : NORMAL);
    textAlign(CENTER, CENTER);
    text(tabs[i], tabX + tabWidth / 2, y + 12);
  }
  textAlign(LEFT, TOP);
  textStyle(NORMAL);

  // Content area
  const contentY = y + 30;
  const contentH = h - 35;

  if (!searchResults) {
    fill(100);
    textSize(11);
    textAlign(CENTER, CENTER);
    text('Loading...', x + w / 2, contentY + contentH / 2);
    textAlign(LEFT, TOP);
    return;
  }

  if (activeTab === 'items') {
    drawItemsTab(x + 5, contentY, w - 10, contentH);
  } else if (activeTab === 'aggregations') {
    drawAggregationsTab(x + 5, contentY, w - 10, contentH);
  } else {
    drawRawTab(x + 5, contentY, w - 10, contentH);
  }
}

function drawItemsTab(x, y, w, h) {
  const items = searchResults.data ? searchResults.data.items : searchResults.items || [];
  const total = searchResults.pagination ? searchResults.pagination.total : items.length;

  // Results count
  fill(100);
  textSize(10);
  text(`Showing ${items.length} of ${total} results`, x + 5, y + 5);

  let cardY = y + 25;
  const cardH = 55;

  for (let item of items) {
    if (cardY + cardH > y + h - 10) break;

    // Card background
    fill(252);
    stroke(220);
    strokeWeight(1);
    rect(x + 5, cardY, w - 10, cardH, 4);

    // Title
    fill(50);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    text(item.title, x + 12, cardY + 8);
    textStyle(NORMAL);

    // Description
    fill(80);
    textSize(9);
    text(item.description, x + 12, cardY + 24);

    // Tags
    const tags = [item.subjectArea, item.gradeLevel, item.framework];
    let tagX = x + 12;
    fill(100);
    textSize(8);

    for (let tag of tags) {
      const tagW = textWidth(tag) + 10;
      fill(230, 240, 250);
      stroke(180, 200, 220);
      rect(tagX, cardY + 38, tagW, 14, 7);
      fill(70, 100, 130);
      noStroke();
      text(tag, tagX + 5, cardY + 41);
      tagX += tagW + 5;
    }

    cardY += cardH + 5;
  }
}

function drawAggregationsTab(x, y, w, h) {
  const aggs = searchResults.data ? searchResults.data.aggregations : {};

  let aggY = y + 10;
  const facetNames = { subjectArea: 'Subject Area', gradeLevel: 'Grade Level', framework: 'Framework' };

  for (let facet in aggs) {
    if (aggY > y + h - 50) break;

    fill(50);
    textSize(10);
    textStyle(BOLD);
    text(facetNames[facet] || facet, x + 10, aggY);
    textStyle(NORMAL);
    aggY += 18;

    const buckets = aggs[facet].buckets || [];
    const maxCount = Math.max(...buckets.map(b => b.doc_count), 1);

    for (let bucket of buckets) {
      const barWidth = (bucket.doc_count / maxCount) * (w - 100);

      // Bar
      fill(70, 130, 180, 150);
      noStroke();
      rect(x + 10, aggY, barWidth, 14, 2);

      // Label
      fill(60);
      textSize(9);
      text(bucket.key, x + 15, aggY + 3);

      // Count
      fill(100);
      text(bucket.doc_count, x + barWidth + 15, aggY + 3);

      aggY += 18;
    }
    aggY += 10;
  }
}

function drawRawTab(x, y, w, h) {
  // JSON background
  fill(40);
  noStroke();
  rect(x + 5, y + 5, w - 10, h - 10, 4);

  // Simplified JSON preview
  fill(150, 220, 150);
  textSize(9);
  textFont('monospace');

  const items = searchResults.data ? searchResults.data.items : [];
  let jsonY = y + 15;

  text('{', x + 15, jsonY); jsonY += 12;
  text('  "items": [', x + 15, jsonY); jsonY += 12;

  for (let i = 0; i < Math.min(items.length, 3); i++) {
    const item = items[i];
    text('    {', x + 15, jsonY); jsonY += 12;

    fill(220, 180, 120);
    text('      "title": ', x + 15, jsonY);
    fill(200, 150, 150);
    text('"' + item.title.substring(0, 20) + '..."', x + 100, jsonY);
    jsonY += 12;

    fill(150, 220, 150);
    text('    }' + (i < items.length - 1 ? ',' : ''), x + 15, jsonY);
    jsonY += 12;
  }

  if (items.length > 3) {
    fill(100);
    text('    // ... ' + (items.length - 3) + ' more items', x + 15, jsonY);
    jsonY += 12;
  }

  fill(150, 220, 150);
  text('  ],', x + 15, jsonY); jsonY += 12;
  text('  "pagination": { ... },', x + 15, jsonY); jsonY += 12;
  text('  "aggregations": { ... }', x + 15, jsonY); jsonY += 12;
  text('}', x + 15, jsonY);

  textFont('sans-serif');
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Execute Search button
  const execX = canvasWidth / 2 - 150;
  fill('#4CAF50');
  stroke(100);
  strokeWeight(1);
  rect(execX, buttonY, 120, buttonH, 5);
  fill(255);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Execute Search', execX + 60, buttonY + buttonH / 2);

  // Reset button
  const resetX = canvasWidth / 2 - 15;
  fill('#f44336');
  stroke(100);
  strokeWeight(1);
  rect(resetX, buttonY, 80, buttonH, 5);
  fill(255);
  noStroke();
  text('Reset', resetX + 40, buttonY + buttonH / 2);

  // Copy Code button
  const copyX = canvasWidth / 2 + 80;
  fill('#2196F3');
  stroke(100);
  strokeWeight(1);
  rect(copyX, buttonY, 90, buttonH, 5);
  fill(255);
  noStroke();
  text('Copy Code', copyX + 45, buttonY + buttonH / 2);

  textAlign(LEFT, TOP);
}

function mousePressed() {
  // Check tab clicks
  const tabs = ['items', 'aggregations', 'raw'];
  const leftPanelWidth = canvasWidth * 0.38;
  const tabWidth = (canvasWidth - leftPanelWidth - 20) / 3;

  if (mouseY >= 40 && mouseY <= 65) {
    for (let i = 0; i < tabs.length; i++) {
      const tabX = leftPanelWidth + 10 + i * tabWidth;
      if (mouseX >= tabX && mouseX <= tabX + tabWidth) {
        activeTab = tabs[i];
        return;
      }
    }
  }

  // Check query input click
  if (mouseX >= 20 && mouseX <= leftPanelWidth - 10 && mouseY >= 90 && mouseY <= 112) {
    const newQuery = prompt('Enter search query:', searchQuery);
    if (newQuery !== null) {
      searchQuery = newQuery;
      executeSearch();
    }
    return;
  }

  // Check facet checkbox clicks
  const facets = [
    { key: 'subjectArea', startY: 147, values: ['Physics', 'Mathematics', 'Biology', 'Computer Science'] },
    { key: 'gradeLevel', startY: 227, values: ['K-12', 'High School', 'Undergraduate'] },
    { key: 'framework', startY: 291, values: ['p5.js', 'd3.js', 'three.js'] }
  ];

  for (let facet of facets) {
    for (let i = 0; i < facet.values.length; i++) {
      const checkY = facet.startY + i * 16;
      if (mouseX >= 25 && mouseX <= 37 && mouseY >= checkY && mouseY <= checkY + 12) {
        const value = facet.values[i];
        const idx = selectedFilters[facet.key].indexOf(value);
        if (idx >= 0) {
          selectedFilters[facet.key].splice(idx, 1);
        } else {
          selectedFilters[facet.key].push(value);
        }
        executeSearch();
        return;
      }
    }
  }

  // Check control buttons
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Execute Search
  const execX = canvasWidth / 2 - 150;
  if (mouseX >= execX && mouseX <= execX + 120 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    executeSearch();
    return;
  }

  // Reset
  const resetX = canvasWidth / 2 - 15;
  if (mouseX >= resetX && mouseX <= resetX + 80 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    searchQuery = "";
    selectedFilters = { subjectArea: [], gradeLevel: [], framework: [] };
    currentPage = 1;
    executeSearch();
    return;
  }

  // Copy Code
  const copyX = canvasWidth / 2 + 80;
  if (mouseX >= copyX && mouseX <= copyX + 90 && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    copySearchCode();
    return;
  }
}

function copySearchCode() {
  let code = 'searchEngine.search({\n';
  code += '  query: "' + searchQuery + '",\n';
  code += '  filters: {\n';

  for (let facet in selectedFilters) {
    if (selectedFilters[facet].length > 0) {
      code += '    ' + facet + ': ["' + selectedFilters[facet].join('", "') + '"],\n';
    }
  }

  code += '  },\n';
  code += '  sort: "' + sortOption + '",\n';
  code += '  per_page: ' + perPage + '\n';
  code += '});';

  // Copy to clipboard
  navigator.clipboard.writeText(code).then(() => {
    alert('Code copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function mouseMoved() {
  // Check if over clickable elements
  const leftPanelWidth = canvasWidth * 0.38;
  const buttonY = drawHeight + 18;

  // Tabs
  if (mouseY >= 40 && mouseY <= 65 && mouseX >= leftPanelWidth + 10) {
    cursor(HAND);
    return;
  }

  // Query input
  if (mouseX >= 20 && mouseX <= leftPanelWidth - 10 && mouseY >= 90 && mouseY <= 112) {
    cursor(HAND);
    return;
  }

  // Checkboxes area
  if (mouseX >= 25 && mouseX <= 37 && mouseY >= 147 && mouseY <= 350) {
    cursor(HAND);
    return;
  }

  // Buttons
  if (mouseY >= buttonY && mouseY <= buttonY + 32) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
