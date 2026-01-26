// Aggregation Pipeline Simulator
// Process sample MicroSim records through normalization, deduplication, and validation stages

let canvasWidth = 850;
const drawHeight = 500;
const controlHeight = 60;

// Pipeline stages
const pipelineStages = [
  { name: 'Normalize', color: '#2196F3', description: 'Standardize field names' },
  { name: 'Deduplicate', color: '#9C27B0', description: 'Remove duplicates' },
  { name: 'Validate', color: '#FF9800', description: 'Check required fields' },
  { name: 'Enrich', color: '#4CAF50', description: 'Add computed fields' }
];

// Sample input records
const inputRecords = [
  { id: 1, title: 'Geometry Angles', subject: 'Mathematics', description: 'Interactive angle explorer', framework: 'p5.js', status: 'valid', color: '#C8E6C9' },
  { id: 2, name: 'Physics Pendulum', topic: 'Physics', desc: 'Pendulum simulation', library: 'p5.js', status: 'needs-normalization', color: '#BBDEFB' },
  { id: 3, title: 'Geometry Angles', subject: 'Mathematics', description: 'Interactive angle explorer', framework: 'p5.js', status: 'duplicate', color: '#FFF9C4' },
  { id: 4, title: 'Chemistry Bonds', subject: 'Chemistry', description: '', framework: 'p5.js', status: 'validation-fail', color: '#FFCDD2' },
  { id: 5, dublinCore: { title: 'Math Fractions' }, educational: { subjectArea: 'Mathematics' }, description: 'Fraction visualizer', technical: { framework: 'd3.js' }, status: 'needs-normalization', color: '#BBDEFB' },
  { id: 6, title: 'Biology Cells', subject: 'Biology', description: 'Cell structure explorer', framework: 'p5.js', status: 'valid', color: '#C8E6C9' },
  { id: 7, title: '', subject: '', description: '', framework: '', status: 'validation-fail', color: '#FFCDD2' },
  { id: 8, name: 'CS Algorithms', topic: 'Computer Science', desc: 'Sorting visualizer', library: 'vanilla-js', status: 'needs-normalization', color: '#BBDEFB' }
];

let records = [];
let processedRecords = [];
let rejectedRecords = [];
let currentRecordIndex = 0;
let animating = false;
let processingRecord = null;
let processingStage = 0;
let animProgress = 0;
let showLogs = false;
let logs = [];
let animSpeed = 1;

// Statistics
let stats = {
  processed: 0,
  duplicatesRemoved: 0,
  validationFailed: 0,
  successful: 0
};

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 900);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  resetSimulation();
}

function resetSimulation() {
  records = JSON.parse(JSON.stringify(inputRecords));
  processedRecords = [];
  rejectedRecords = [];
  currentRecordIndex = 0;
  processingRecord = null;
  processingStage = 0;
  animProgress = 0;
  animating = false;
  logs = [];
  stats = { processed: 0, duplicatesRemoved: 0, validationFailed: 0, successful: 0 };
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
  text('Data Aggregation Pipeline Simulator', canvasWidth / 2, 18);
  textStyle(NORMAL);

  // Draw three panels
  drawInputQueue();
  drawPipeline();
  drawOutputPanel();

  // Draw processing animation
  if (processingRecord) {
    drawProcessingRecord();
  }

  // Draw logs overlay if enabled
  if (showLogs) {
    drawLogsPanel();
  }

  // Draw controls
  drawControls();

  // Update animation
  if (animating && processingRecord) {
    animProgress += 0.02 * animSpeed;
    if (animProgress >= 1) {
      advanceProcessing();
    }
  }
}

function drawInputQueue() {
  let panelX = 10;
  let panelY = 40;
  let panelW = canvasWidth * 0.22;
  let panelH = drawHeight - 60;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 5);

  // Header
  fill(70);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Input Queue', panelX + panelW / 2, panelY + 15);
  textStyle(NORMAL);
  textSize(10);
  fill(100);
  text(`${records.length - currentRecordIndex} remaining`, panelX + panelW / 2, panelY + 30);

  // Draw record cards
  let cardY = panelY + 45;
  let cardH = 48;
  let cardW = panelW - 20;

  for (let i = currentRecordIndex; i < records.length && cardY + cardH < panelY + panelH - 10; i++) {
    let record = records[i];
    drawRecordCard(panelX + 10, cardY, cardW, cardH - 5, record, false);
    cardY += cardH;
  }
}

function drawPipeline() {
  let panelX = canvasWidth * 0.25;
  let panelY = 40;
  let panelW = canvasWidth * 0.45;
  let panelH = drawHeight - 60;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 5);

  // Header
  fill(70);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Processing Pipeline', panelX + panelW / 2, panelY + 15);
  textStyle(NORMAL);

  // Draw pipeline stages
  let stageW = 100;
  let stageH = 60;
  let startX = panelX + 40;
  let stageY = panelY + 80;
  let gapX = (panelW - 80 - stageW * 4) / 3;

  for (let i = 0; i < pipelineStages.length; i++) {
    let stage = pipelineStages[i];
    let x = startX + i * (stageW + gapX);

    // Stage box
    let isActive = processingRecord && processingStage === i;
    fill(stage.color);
    stroke(isActive ? '#000' : stage.color);
    strokeWeight(isActive ? 3 : 1);
    rectMode(CORNER);
    rect(x, stageY, stageW, stageH, 5);

    // Pulse effect when active
    if (isActive) {
      fill(255, 255, 255, 100 + sin(frameCount * 0.1) * 50);
      noStroke();
      rect(x, stageY, stageW, stageH, 5);
    }

    // Stage label
    fill(255);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    text(stage.name, x + stageW / 2, stageY + stageH / 2 - 8);
    textStyle(NORMAL);
    textSize(9);
    text(stage.description, x + stageW / 2, stageY + stageH / 2 + 8);

    // Arrow between stages
    if (i < pipelineStages.length - 1) {
      let arrowX = x + stageW + gapX / 2;
      fill(150);
      noStroke();
      triangle(arrowX + 8, stageY + stageH / 2, arrowX - 4, stageY + stageH / 2 - 6, arrowX - 4, stageY + stageH / 2 + 6);
      stroke(150);
      strokeWeight(2);
      line(x + stageW + 5, stageY + stageH / 2, arrowX - 4, stageY + stageH / 2);
    }
  }

  // Rejected bin
  let binX = panelX + panelW / 2 - 50;
  let binY = stageY + stageH + 80;

  fill('#FFEBEE');
  stroke('#f44336');
  strokeWeight(1);
  rect(binX, binY, 100, 50, 5);

  fill('#f44336');
  noStroke();
  textSize(10);
  text('Rejected', binX + 50, binY + 15);
  textSize(16);
  text(rejectedRecords.length, binX + 50, binY + 35);

  // Arrow to rejected
  stroke(200);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(panelX + panelW / 2, stageY + stageH + 10, panelX + panelW / 2, binY - 5);
  drawingContext.setLineDash([]);

  // Statistics at bottom
  let statsY = panelY + panelH - 80;
  fill(240, 240, 240);
  noStroke();
  rect(panelX + 20, statsY, panelW - 40, 70, 5);

  fill(70);
  textSize(11);
  textStyle(BOLD);
  text('Statistics', panelX + panelW / 2, statsY + 12);
  textStyle(NORMAL);

  textSize(10);
  textAlign(LEFT, CENTER);
  let col1X = panelX + 35;
  let col2X = panelX + panelW / 2 + 20;

  text(`Records Processed: ${stats.processed}`, col1X, statsY + 30);
  text(`Duplicates Removed: ${stats.duplicatesRemoved}`, col1X, statsY + 45);
  text(`Validation Failures: ${stats.validationFailed}`, col2X, statsY + 30);
  text(`Successfully Added: ${stats.successful}`, col2X, statsY + 45);

  textAlign(CENTER, CENTER);
}

function drawOutputPanel() {
  let panelX = canvasWidth * 0.72;
  let panelY = 40;
  let panelW = canvasWidth * 0.26;
  let panelH = drawHeight - 60;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 5);

  // Header
  fill(70);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Output Collection', panelX + panelW / 2, panelY + 15);
  textStyle(NORMAL);
  textSize(10);
  fill(100);
  text(`${processedRecords.length} items`, panelX + panelW / 2, panelY + 30);

  // Draw processed records
  let cardY = panelY + 45;
  let cardH = 48;
  let cardW = panelW - 20;

  for (let i = 0; i < processedRecords.length && cardY + cardH < panelY + panelH - 10; i++) {
    let record = processedRecords[i];
    drawRecordCard(panelX + 10, cardY, cardW, cardH - 5, record, true);
    cardY += cardH;
  }

  // Quality score distribution
  if (processedRecords.length > 0) {
    let avgScore = processedRecords.reduce((sum, r) => sum + (r.qualityScore || 80), 0) / processedRecords.length;
    fill(100);
    textSize(9);
    text(`Avg Quality: ${avgScore.toFixed(0)}%`, panelX + panelW / 2, panelY + panelH - 15);
  }
}

function drawRecordCard(x, y, w, h, record, isOutput) {
  // Card background
  fill(record.color || '#fff');
  stroke(180);
  strokeWeight(1);
  rectMode(CORNER);
  rect(x, y, w, h, 4);

  // Record info
  fill(50);
  noStroke();
  textSize(9);
  textAlign(LEFT, TOP);

  let title = record.title || record.name || record.dublinCore?.title || 'Untitled';
  let subject = record.subject || record.topic || record.educational?.subjectArea || 'Unknown';

  // Truncate if needed
  if (title.length > 18) title = title.substring(0, 16) + '...';

  textStyle(BOLD);
  text(title, x + 5, y + 5);
  textStyle(NORMAL);

  fill(80);
  text(subject, x + 5, y + 18);

  // Status indicator
  let statusColors = {
    'valid': '#4CAF50',
    'needs-normalization': '#2196F3',
    'duplicate': '#FFC107',
    'validation-fail': '#f44336'
  };

  if (!isOutput) {
    fill(statusColors[record.status] || '#999');
    ellipse(x + w - 10, y + h / 2, 8, 8);
  } else if (record.qualityScore) {
    fill(100);
    textSize(8);
    textAlign(RIGHT, CENTER);
    text(`${record.qualityScore}%`, x + w - 5, y + h / 2);
  }

  textAlign(CENTER, CENTER);
}

function drawProcessingRecord() {
  if (!processingRecord) return;

  let panelX = canvasWidth * 0.25;
  let stageW = 100;
  let startX = panelX + 40;
  let stageY = 120;
  let gapX = (canvasWidth * 0.45 - 80 - stageW * 4) / 3;

  // Calculate position along pipeline
  let fromX = processingStage === 0 ? canvasWidth * 0.22 + 10 : startX + (processingStage - 1) * (stageW + gapX) + stageW;
  let toX = startX + processingStage * (stageW + gapX);

  let x = lerp(fromX, toX, animProgress);
  let y = stageY + 30 + sin(animProgress * PI) * -20;

  // Draw the card
  push();
  fill(processingRecord.color);
  stroke(100);
  strokeWeight(2);
  rectMode(CENTER);
  rect(x, y - 30, 70, 35, 5);

  fill(50);
  noStroke();
  textSize(8);
  let title = processingRecord.title || processingRecord.name || 'Record';
  if (title.length > 12) title = title.substring(0, 10) + '...';
  text(title, x, y - 30);
  pop();
}

function drawLogsPanel() {
  let panelW = 300;
  let panelH = 200;
  let panelX = canvasWidth / 2 - panelW / 2;
  let panelY = drawHeight / 2 - panelH / 2;

  fill(40, 40, 40, 240);
  stroke(100);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 5);

  // Header
  fill(255);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text('Processing Logs', panelX + panelW / 2, panelY + 15);
  textStyle(NORMAL);

  // Log entries
  textSize(9);
  textAlign(LEFT, TOP);
  let logY = panelY + 30;
  let displayLogs = logs.slice(-10);

  for (let log of displayLogs) {
    fill(log.color || '#fff');
    text(log.message, panelX + 10, logY, panelW - 20);
    logY += 15;
  }

  textAlign(CENTER, CENTER);

  // Close hint
  fill(150);
  textSize(8);
  text('Click to close', panelX + panelW / 2, panelY + panelH - 10);
}

function drawControls() {
  let y = drawHeight + 30;

  // Process Next button
  fill(currentRecordIndex < records.length ? '#2196F3' : '#9E9E9E');
  noStroke();
  rectMode(CENTER);
  rect(70, y, 100, 32, 5);
  fill(255);
  textSize(11);
  text('Process Next', 70, y);

  // Process All button
  fill(currentRecordIndex < records.length ? '#4CAF50' : '#9E9E9E');
  rect(180, y, 90, 32, 5);
  fill(255);
  text('Process All', 180, y);

  // Reset button
  fill('#f44336');
  rect(275, y, 70, 32, 5);
  fill(255);
  text('Reset', 275, y);

  // Show logs toggle
  fill(showLogs ? '#9C27B0' : '#9E9E9E');
  rect(365, y, 90, 32, 5);
  fill(255);
  text(showLogs ? 'Hide Logs' : 'Show Logs', 365, y);

  // Speed slider
  fill(80);
  textSize(10);
  text('Speed:', 460, y);

  fill(200);
  rect(520, y, 80, 6, 3);
  fill('#2196F3');
  let sliderPos = map(animSpeed, 0.5, 3, 480, 560);
  ellipse(sliderPos, y, 14, 14);

  // Legend
  let legendX = 620;
  let legendItems = [
    { color: '#C8E6C9', label: 'Valid' },
    { color: '#BBDEFB', label: 'Needs Norm' },
    { color: '#FFF9C4', label: 'Duplicate' },
    { color: '#FFCDD2', label: 'Invalid' }
  ];

  textSize(8);
  for (let i = 0; i < legendItems.length; i++) {
    let item = legendItems[i];
    let x = legendX + i * 55;
    fill(item.color);
    stroke(150);
    strokeWeight(1);
    rect(x, y, 12, 12, 2);
    fill(80);
    noStroke();
    textAlign(LEFT, CENTER);
    text(item.label, x + 8, y);
  }
  textAlign(CENTER, CENTER);
}

function processNextRecord() {
  if (currentRecordIndex >= records.length || processingRecord) return;

  processingRecord = records[currentRecordIndex];
  processingStage = 0;
  animProgress = 0;
  animating = true;

  logs.push({ message: `Processing: ${processingRecord.title || processingRecord.name || 'Record ' + processingRecord.id}`, color: '#fff' });
}

function advanceProcessing() {
  if (!processingRecord) return;

  // Apply stage transformation
  let stage = pipelineStages[processingStage];
  let rejected = false;

  switch (processingStage) {
    case 0: // Normalize
      if (processingRecord.name) {
        processingRecord.title = processingRecord.name;
        delete processingRecord.name;
        logs.push({ message: `  Normalized: name → title`, color: '#64B5F6' });
      }
      if (processingRecord.topic) {
        processingRecord.subject = processingRecord.topic;
        delete processingRecord.topic;
        logs.push({ message: `  Normalized: topic → subject`, color: '#64B5F6' });
      }
      if (processingRecord.dublinCore?.title) {
        processingRecord.title = processingRecord.dublinCore.title;
        logs.push({ message: `  Normalized: dublinCore.title → title`, color: '#64B5F6' });
      }
      if (processingRecord.library) {
        processingRecord.framework = processingRecord.library;
        delete processingRecord.library;
        logs.push({ message: `  Normalized: library → framework`, color: '#64B5F6' });
      }
      break;

    case 1: // Deduplicate
      if (processingRecord.status === 'duplicate') {
        rejected = true;
        stats.duplicatesRemoved++;
        logs.push({ message: `  Duplicate detected - removing`, color: '#FFC107' });
      }
      break;

    case 2: // Validate
      if (!processingRecord.title || !processingRecord.description) {
        rejected = true;
        stats.validationFailed++;
        logs.push({ message: `  Validation failed: missing required fields`, color: '#f44336' });
      }
      break;

    case 3: // Enrich
      processingRecord.qualityScore = calculateQualityScore(processingRecord);
      processingRecord._lastCrawled = new Date().toISOString();
      logs.push({ message: `  Enriched: quality=${processingRecord.qualityScore}%`, color: '#4CAF50' });
      break;
  }

  if (rejected) {
    rejectedRecords.push(processingRecord);
    finishProcessing(false);
  } else {
    processingStage++;
    animProgress = 0;

    if (processingStage >= pipelineStages.length) {
      processedRecords.push(processingRecord);
      stats.successful++;
      logs.push({ message: `  ✓ Added to collection`, color: '#4CAF50' });
      finishProcessing(true);
    }
  }
}

function finishProcessing(success) {
  stats.processed++;
  currentRecordIndex++;
  processingRecord = null;
  processingStage = 0;
  animating = false;
}

function calculateQualityScore(record) {
  let score = 0;
  if (record.title) score += 20;
  if (record.description) score += 20;
  if (record.subject) score += 15;
  if (record.framework) score += 15;
  if (record.description && record.description.length > 20) score += 10;
  score += Math.floor(Math.random() * 20); // Simulate variation
  return Math.min(100, score);
}

function mousePressed() {
  // Check controls
  if (mouseY > drawHeight && mouseY < drawHeight + controlHeight) {
    // Process Next
    if (mouseX > 20 && mouseX < 120) {
      processNextRecord();
    }
    // Process All
    if (mouseX > 135 && mouseX < 225) {
      animSpeed = 3;
      processAll();
    }
    // Reset
    if (mouseX > 240 && mouseX < 310) {
      resetSimulation();
    }
    // Show Logs
    if (mouseX > 320 && mouseX < 410) {
      showLogs = !showLogs;
    }
    // Speed slider
    if (mouseX > 480 && mouseX < 560) {
      animSpeed = map(mouseX, 480, 560, 0.5, 3);
    }
  }

  // Close logs
  if (showLogs && mouseY < drawHeight) {
    showLogs = false;
  }
}

function processAll() {
  if (currentRecordIndex < records.length && !processingRecord) {
    processNextRecord();
    setTimeout(() => {
      if (currentRecordIndex < records.length) {
        processAll();
      }
    }, 2000 / animSpeed);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
