// Timeline Layout Styles Comparison
// Compare different ways to display chronological data

let canvasWidth = 850;
const drawHeight = 400;
const controlHeight = 80;

const styles = [
  { name: 'Horizontal Linear', desc: 'Events flow left to right', bestFor: 'Simple sequences, limited events' },
  { name: 'Vertical Scroll', desc: 'Events flow top to bottom', bestFor: 'Rich content, long timelines' },
  { name: 'Centered Alternating', desc: 'Central spine, events alternate', bestFor: 'Dense timelines, presentations' },
  { name: 'Parallel Tracks', desc: 'Multiple horizontal lanes', bestFor: 'Comparing multiple sequences' }
];

const events = [
  { year: 1990, label: 'Event A', color: '#3498db' },
  { year: 1995, label: 'Event B', color: '#27ae60' },
  { year: 2000, label: 'Event C', color: '#e67e22' },
  { year: 2005, label: 'Event D', color: '#9b59b6' },
  { year: 2010, label: 'Event E', color: '#e74c3c' }
];

let selectedStyle = -1;
let hoveredStyle = -1;

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
  text('Timeline Layout Styles', canvasWidth / 2, 20);
  textStyle(NORMAL);

  if (selectedStyle >= 0) {
    drawExpandedStyle();
  } else {
    drawGallery();
  }

  drawControls();
}

function drawGallery() {
  let cols = 2;
  let rows = 2;
  let panelW = (canvasWidth - 70) / cols;
  let panelH = 160;
  let startY = 50;

  for (let i = 0; i < styles.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = 20 + col * (panelW + 15);
    let y = startY + row * (panelH + 15);

    let style = styles[i];
    let isHovered = hoveredStyle === i;

    // Panel
    fill(255);
    stroke(isHovered ? color(70, 130, 180) : color(200));
    strokeWeight(isHovered ? 2 : 1);
    rect(x, y, panelW, panelH, 8);

    // Header
    fill(70, 130, 180);
    noStroke();
    rect(x, y, panelW, 28, 8, 8, 0, 0);

    fill(255);
    textSize(11);
    textStyle(BOLD);
    text(style.name, x + panelW / 2, y + 14);
    textStyle(NORMAL);

    // Mini timeline
    drawMiniTimeline(x + 10, y + 35, panelW - 20, 85, i);

    // Best for label
    fill(100);
    textSize(9);
    text('Best for: ' + style.bestFor, x + panelW / 2, y + panelH - 15);

    if (isHovered) {
      fill(70, 130, 180);
      textSize(8);
      text('Click to expand', x + panelW / 2, y + panelH - 30);
    }
  }
}

function drawMiniTimeline(x, y, w, h, styleType) {
  let cx = x + w / 2;
  let cy = y + h / 2;

  switch (styleType) {
    case 0: // Horizontal Linear
      // Main line
      stroke(150);
      strokeWeight(2);
      line(x + 10, cy, x + w - 10, cy);

      // Events
      for (let i = 0; i < events.length; i++) {
        let ex = x + 15 + i * ((w - 30) / (events.length - 1));
        fill(events[i].color);
        noStroke();
        ellipse(ex, cy, 12, 12);

        fill(100);
        textSize(7);
        text(events[i].year, ex, cy + 18);
      }
      break;

    case 1: // Vertical Scroll
      // Main line
      stroke(150);
      strokeWeight(2);
      line(x + 25, y + 10, x + 25, y + h - 10);

      // Events
      for (let i = 0; i < events.length; i++) {
        let ey = y + 15 + i * ((h - 30) / (events.length - 1));
        fill(events[i].color);
        noStroke();
        ellipse(x + 25, ey, 10, 10);

        fill(80);
        textAlign(LEFT, CENTER);
        textSize(8);
        text(events[i].year + ': ' + events[i].label, x + 38, ey);
        textAlign(CENTER, CENTER);
      }
      break;

    case 2: // Centered Alternating
      // Central spine
      stroke(150);
      strokeWeight(2);
      line(cx, y + 5, cx, y + h - 5);

      // Events alternating
      for (let i = 0; i < events.length; i++) {
        let ey = y + 10 + i * ((h - 20) / (events.length - 1));
        let side = i % 2 === 0 ? -1 : 1;
        let ex = cx + side * 35;

        // Connector line
        stroke(180);
        strokeWeight(1);
        line(cx, ey, ex, ey);

        fill(events[i].color);
        noStroke();
        ellipse(ex, ey, 10, 10);

        fill(80);
        textSize(7);
        text(events[i].year, ex + side * 20, ey);
      }
      break;

    case 3: // Parallel Tracks
      let trackH = h / 3;

      // Two parallel tracks
      for (let t = 0; t < 2; t++) {
        let ty = y + 20 + t * trackH * 1.2;

        stroke(150);
        strokeWeight(2);
        line(x + 10, ty, x + w - 10, ty);

        fill(100);
        textSize(7);
        textAlign(LEFT, CENTER);
        text('Track ' + (t + 1), x + 10, ty - 12);
        textAlign(CENTER, CENTER);

        // Events on track
        let trackEvents = events.filter((_, i) => i % 2 === t);
        for (let i = 0; i < trackEvents.length; i++) {
          let ex = x + 30 + i * ((w - 60) / Math.max(trackEvents.length - 1, 1));
          fill(trackEvents[i].color);
          noStroke();
          ellipse(ex, ty, 10, 10);

          fill(100);
          textSize(6);
          text(trackEvents[i].year, ex, ty + 12);
        }
      }
      break;
  }
}

function drawExpandedStyle() {
  let style = styles[selectedStyle];
  let x = 40;
  let y = 50;
  let w = canvasWidth - 80;
  let h = 300;

  // Panel
  fill(255);
  stroke(70, 130, 180);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  // Header
  fill(70, 130, 180);
  noStroke();
  rect(x, y, w, 40, 8, 8, 0, 0);

  fill(255);
  textSize(16);
  textStyle(BOLD);
  text(style.name, x + w / 2, y + 20);
  textStyle(NORMAL);

  // Large timeline
  drawMiniTimeline(x + 20, y + 60, w - 200, h - 120, selectedStyle);

  // Description panel
  let descX = x + w - 160;
  fill(248);
  stroke(200);
  strokeWeight(1);
  rect(descX, y + 60, 140, h - 120, 5);

  textAlign(LEFT, TOP);
  fill(70);
  textSize(11);
  textStyle(BOLD);
  text('Layout:', descX + 10, y + 75);
  textStyle(NORMAL);
  textWrap(WORD);
  text(style.desc, descX + 10, y + 95, 120);

  textStyle(BOLD);
  text('Best For:', descX + 10, y + 150);
  textStyle(NORMAL);
  text(style.bestFor, descX + 10, y + 170, 120);

  textAlign(CENTER, CENTER);

  // Back button
  fill(150);
  noStroke();
  rect(x + w - 80, y + h - 40, 70, 30, 5);
  fill(255);
  textSize(11);
  text('← Back', x + w - 45, y + h - 25);
}

function drawControls() {
  let y = drawHeight + 40;

  if (selectedStyle >= 0) {
    fill(80);
    textSize(11);
    text('Click "Back" or press Escape to return to gallery', canvasWidth / 2, y);
  } else {
    fill(80);
    textSize(11);
    text('Click any style to see larger example', canvasWidth / 2, y);
  }

  // Style selector buttons
  textSize(9);
  for (let i = 0; i < styles.length; i++) {
    let btnX = 60 + i * ((canvasWidth - 120) / styles.length);
    let btnW = (canvasWidth - 150) / styles.length;
    let isSelected = selectedStyle === i;

    fill(isSelected ? color(70, 130, 180) : color(200));
    noStroke();
    rect(btnX, y + 12, btnW, 22, 4);

    fill(isSelected ? 255 : 80);
    text(styles[i].name.split(' ')[0], btnX + btnW / 2, y + 23);
  }
}

function mousePressed() {
  // Gallery panel clicks
  if (selectedStyle < 0) {
    let cols = 2;
    let panelW = (canvasWidth - 70) / cols;
    let panelH = 160;
    let startY = 50;

    for (let i = 0; i < styles.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = 20 + col * (panelW + 15);
      let y = startY + row * (panelH + 15);

      if (mouseX > x && mouseX < x + panelW && mouseY > y && mouseY < y + panelH) {
        selectedStyle = i;
        return;
      }
    }
  }

  // Back button
  if (selectedStyle >= 0) {
    let x = 40;
    let w = canvasWidth - 80;
    let y = 50;
    let h = 300;

    if (mouseX > x + w - 80 && mouseX < x + w - 10 && mouseY > y + h - 40 && mouseY < y + h - 10) {
      selectedStyle = -1;
    }
  }

  // Bottom buttons
  let y = drawHeight + 52;
  for (let i = 0; i < styles.length; i++) {
    let btnX = 60 + i * ((canvasWidth - 120) / styles.length);
    let btnW = (canvasWidth - 150) / styles.length;

    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > y && mouseY < y + 22) {
      selectedStyle = i;
    }
  }
}

function mouseMoved() {
  hoveredStyle = -1;

  if (selectedStyle < 0) {
    let cols = 2;
    let panelW = (canvasWidth - 70) / cols;
    let panelH = 160;
    let startY = 50;

    for (let i = 0; i < styles.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = 20 + col * (panelW + 15);
      let y = startY + row * (panelH + 15);

      if (mouseX > x && mouseX < x + panelW && mouseY > y && mouseY < y + panelH) {
        hoveredStyle = i;
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) selectedStyle = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
