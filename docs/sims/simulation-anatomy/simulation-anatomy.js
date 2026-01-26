// Anatomy of a Well-Designed Simulation
// Interactive diagram showing essential simulation components

let canvasWidth = 850;
const drawHeight = 420;
const controlHeight = 80;

const regions = [
  {
    id: 'viz',
    name: 'Visualization Area',
    x: 0.05, y: 0.12, w: 0.55, h: 0.55,
    color: '#3498db',
    desc: 'Where the action happens. Shows system state visually and updates in real-time.',
    details: ['Largest area (60-70%)', 'Primary focus', 'Real-time updates', 'Visual output of model']
  },
  {
    id: 'controls',
    name: 'Control Panel',
    x: 0.62, y: 0.12, w: 0.33, h: 0.35,
    color: '#27ae60',
    desc: 'User input area for parameters and actions.',
    details: ['Parameter sliders', 'Mode toggles', 'Action buttons (Start, Reset)', 'Presets']
  },
  {
    id: 'info',
    name: 'Information Display',
    x: 0.62, y: 0.49, w: 0.33, h: 0.18,
    color: '#e67e22',
    desc: 'Shows current values, calculations, and status messages.',
    details: ['Current parameter values', 'Calculated outputs', 'Status messages', 'Units and labels']
  },
  {
    id: 'title',
    name: 'Title & Context',
    x: 0.05, y: 0.02, w: 0.9, h: 0.08,
    color: '#9b59b6',
    desc: 'Identifies what the simulation models and its purpose.',
    details: ['Simulation name', 'Learning objective', 'Brief description', 'Help link']
  },
  {
    id: 'help',
    name: 'Help/Instructions',
    x: 0.05, y: 0.69, w: 0.9, h: 0.1,
    color: '#95a5a6',
    desc: 'Guidance on how to use controls and what to observe.',
    details: ['How to use controls', 'What to observe', 'Guiding questions', 'Tips']
  }
];

let selectedRegion = -1;
let hoveredRegion = -1;
let showGoodBad = false;

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
  text('Anatomy of a Well-Designed Simulation', canvasWidth / 2, 20);
  textStyle(NORMAL);

  drawSimulationFrame();
  drawRegions();
  drawCallouts();
  drawControls();
}

function drawSimulationFrame() {
  let frameX = 40;
  let frameY = 50;
  let frameW = canvasWidth * 0.55;
  let frameH = 280;

  // Outer frame
  fill(30);
  stroke(60);
  strokeWeight(2);
  rect(frameX, frameY, frameW, frameH, 5);

  // Inner simulation screen
  fill(40, 45, 55);
  noStroke();
  rect(frameX + 10, frameY + 35, frameW - 20, frameH - 45, 3);

  // Title bar
  fill(50, 55, 65);
  rect(frameX + 10, frameY + 10, frameW - 20, 22, 3, 3, 0, 0);

  fill(180);
  textSize(10);
  text('Pendulum Simulation', frameX + frameW / 2, frameY + 21);

  // Fake pendulum
  let pendX = frameX + frameW / 2 - 50;
  let pendY = frameY + 100;

  stroke(150);
  strokeWeight(2);
  fill(100);
  ellipse(pendX, pendY, 8, 8);

  stroke(200);
  line(pendX, pendY, pendX - 30, pendY + 80);

  fill(100, 180, 255);
  noStroke();
  ellipse(pendX - 30, pendY + 80, 25, 25);

  // Fake control panel
  let ctrlX = frameX + frameW - 130;
  let ctrlY = frameY + 60;

  fill(60, 65, 75);
  noStroke();
  rect(ctrlX, ctrlY, 110, 140, 3);

  // Fake sliders
  for (let i = 0; i < 3; i++) {
    fill(80);
    rect(ctrlX + 10, ctrlY + 20 + i * 35, 90, 6, 2);
    fill(100, 180, 255);
    rect(ctrlX + 10, ctrlY + 20 + i * 35, 40 + i * 15, 6, 2);

    fill(150);
    textSize(8);
    text(['Length', 'Mass', 'Gravity'][i], ctrlX + 55, ctrlY + 12 + i * 35);
  }

  // Fake info area
  fill(55, 60, 70);
  rect(ctrlX, ctrlY + 115, 110, 45, 3);

  fill(200);
  textSize(9);
  text('T = 2.01s', ctrlX + 55, ctrlY + 130);
  text('v = 1.2 m/s', ctrlX + 55, ctrlY + 145);

  // Fake help bar
  fill(45, 50, 60);
  rect(frameX + 10, frameY + frameH - 35, frameW - 20, 25, 0, 0, 3, 3);

  fill(140);
  textSize(8);
  text('Adjust sliders to change parameters. Watch the period change.', frameX + frameW / 2, frameY + frameH - 22);
}

function drawRegions() {
  let frameX = 40;
  let frameY = 50;
  let frameW = canvasWidth * 0.55;
  let frameH = 280;

  // Calculate actual positions
  for (let i = 0; i < regions.length; i++) {
    let r = regions[i];
    let x = frameX + r.x * frameW;
    let y = frameY + r.y * frameH;
    let w = r.w * frameW;
    let h = r.h * frameH;

    let isHovered = hoveredRegion === i;
    let isSelected = selectedRegion === i;

    // Region overlay
    if (isHovered || isSelected) {
      fill(r.color + '40');
      stroke(r.color);
      strokeWeight(2);
      rect(x, y, w, h, 3);

      // Number badge
      fill(r.color);
      noStroke();
      ellipse(x + 15, y + 15, 22, 22);
      fill(255);
      textSize(12);
      textStyle(BOLD);
      text(i + 1, x + 15, y + 15);
      textStyle(NORMAL);
    }
  }
}

function drawCallouts() {
  let calloutX = canvasWidth * 0.58;
  let calloutY = 50;
  let calloutW = canvasWidth - calloutX - 20;
  let calloutH = 280;

  // Callout panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(calloutX, calloutY, calloutW, calloutH, 8);

  if (selectedRegion >= 0 || hoveredRegion >= 0) {
    let r = regions[selectedRegion >= 0 ? selectedRegion : hoveredRegion];

    // Header with color
    fill(r.color);
    noStroke();
    rect(calloutX, calloutY, calloutW, 35, 8, 8, 0, 0);

    fill(255);
    textSize(13);
    textStyle(BOLD);
    text(r.name, calloutX + calloutW / 2, calloutY + 18);
    textStyle(NORMAL);

    // Description
    textAlign(LEFT, TOP);
    fill(60);
    textSize(11);
    textWrap(WORD);
    text(r.desc, calloutX + 15, calloutY + 50, calloutW - 30);

    // Details list
    fill(r.color);
    textSize(11);
    textStyle(BOLD);
    text('Key Elements:', calloutX + 15, calloutY + 110);
    textStyle(NORMAL);

    fill(80);
    textSize(10);
    for (let i = 0; i < r.details.length; i++) {
      text('• ' + r.details[i], calloutX + 20, calloutY + 130 + i * 18);
    }

    // Percentage
    fill(r.color);
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    let pct = floor(r.w * r.h * 100);
    text(pct + '%', calloutX + calloutW / 2, calloutY + calloutH - 40);
    textStyle(NORMAL);
    textSize(10);
    fill(100);
    text('of screen area', calloutX + calloutW / 2, calloutY + calloutH - 20);

    textAlign(CENTER, CENTER);
  } else {
    // Instructions
    fill(100);
    textSize(12);
    text('Hover or click regions', calloutX + calloutW / 2, calloutY + calloutH / 2 - 20);
    text('to see their purpose', calloutX + calloutW / 2, calloutY + calloutH / 2);

    // Legend
    textAlign(LEFT, CENTER);
    textSize(10);
    for (let i = 0; i < regions.length; i++) {
      let r = regions[i];
      let ly = calloutY + 80 + i * 35;

      fill(r.color);
      noStroke();
      ellipse(calloutX + 25, ly, 18, 18);
      fill(255);
      textSize(10);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(i + 1, calloutX + 25, ly);
      textStyle(NORMAL);

      fill(60);
      textAlign(LEFT, CENTER);
      text(r.name, calloutX + 45, ly);
    }
    textAlign(CENTER, CENTER);
  }
}

function drawControls() {
  let y = drawHeight + 40;

  // Instructions
  fill(80);
  textSize(11);
  text('Hover over regions in the simulation frame to see their purpose', canvasWidth / 2, y);

  // Region buttons
  textSize(9);
  for (let i = 0; i < regions.length; i++) {
    let r = regions[i];
    let btnX = 30 + i * (canvasWidth - 60) / regions.length;
    let btnW = (canvasWidth - 80) / regions.length;
    let isSelected = selectedRegion === i;

    fill(isSelected ? r.color : color(200));
    noStroke();
    rect(btnX, y + 12, btnW, 22, 4);

    fill(isSelected ? 255 : 80);
    text(r.name.split(' ')[0], btnX + btnW / 2, y + 23);
  }
}

function mousePressed() {
  checkRegionClick();
  checkButtonClick();
}

function mouseMoved() {
  checkRegionHover();
}

function checkRegionHover() {
  let frameX = 40;
  let frameY = 50;
  let frameW = canvasWidth * 0.55;
  let frameH = 280;

  hoveredRegion = -1;

  for (let i = 0; i < regions.length; i++) {
    let r = regions[i];
    let x = frameX + r.x * frameW;
    let y = frameY + r.y * frameH;
    let w = r.w * frameW;
    let h = r.h * frameH;

    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      hoveredRegion = i;
    }
  }
}

function checkRegionClick() {
  if (hoveredRegion >= 0) {
    selectedRegion = selectedRegion === hoveredRegion ? -1 : hoveredRegion;
  }
}

function checkButtonClick() {
  let y = drawHeight + 52;

  for (let i = 0; i < regions.length; i++) {
    let btnX = 30 + i * (canvasWidth - 60) / regions.length;
    let btnW = (canvasWidth - 80) / regions.length;

    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > y && mouseY < y + 22) {
      selectedRegion = selectedRegion === i ? -1 : i;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
