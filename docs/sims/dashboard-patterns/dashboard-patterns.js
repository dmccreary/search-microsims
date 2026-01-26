// Educational Dashboard Layout Patterns
// Interactive dashboard builder with component library

let canvasWidth = 850;
const drawHeight = 440;
const controlHeight = 80;

const components = [
  { id: 'kpi', name: 'KPI Card', icon: '📊', w: 1, h: 1, color: '#3498db' },
  { id: 'line', name: 'Line Chart', icon: '📈', w: 2, h: 1, color: '#27ae60' },
  { id: 'bar', name: 'Bar Chart', icon: '📊', w: 2, h: 1, color: '#e67e22' },
  { id: 'pie', name: 'Pie Chart', icon: '🥧', w: 1, h: 1, color: '#9b59b6' },
  { id: 'table', name: 'Data Table', icon: '📋', w: 2, h: 1, color: '#1abc9c' },
  { id: 'status', name: 'Status', icon: '🔔', w: 1, h: 1, color: '#e74c3c' }
];

const templates = [
  { name: 'Student Progress', components: ['kpi', 'kpi', 'kpi', 'line', 'table'] },
  { name: 'Class Overview', components: ['bar', 'pie', 'kpi', 'table'] },
  { name: 'Real-time Lab', components: ['line', 'status', 'kpi', 'kpi', 'bar'] }
];

let placedComponents = [];
let selectedTemplate = -1;
let dragging = null;
let dragOffset = { x: 0, y: 0 };
let hoveredComponent = -1;

// Canvas area
const canvasX = 150;
const canvasY = 50;
const canvasW = 520;
const canvasH = 320;
const gridCols = 4;
const gridRows = 3;
const cellW = canvasW / gridCols;
const cellH = canvasH / gridRows;

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
  text('Dashboard Layout Builder', canvasWidth / 2, 20);
  textStyle(NORMAL);

  drawComponentLibrary();
  drawCanvas();
  drawTemplates();
  drawControls();

  // Draw dragging component
  if (dragging) {
    drawComponentAt(dragging, mouseX - dragOffset.x, mouseY - dragOffset.y, cellW * dragging.w - 10, cellH - 10, 0.8);
  }
}

function drawComponentLibrary() {
  let libX = 10;
  let libY = 50;
  let libW = 130;
  let libH = 320;

  // Library panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(libX, libY, libW, libH, 5);

  fill(70);
  textSize(11);
  textStyle(BOLD);
  text('Components', libX + libW / 2, libY + 15);
  textStyle(NORMAL);

  fill(100);
  textSize(8);
  text('(Drag to canvas)', libX + libW / 2, libY + 30);

  // Component items
  for (let i = 0; i < components.length; i++) {
    let comp = components[i];
    let cy = libY + 50 + i * 42;
    let isHovered = hoveredComponent === i && !dragging;

    fill(isHovered ? color(comp.color + '30') : color(248));
    stroke(isHovered ? comp.color : color(220));
    strokeWeight(isHovered ? 2 : 1);
    rect(libX + 8, cy, libW - 16, 36, 4);

    fill(comp.color);
    textSize(16);
    text(comp.icon, libX + 25, cy + 18);

    fill(60);
    textSize(10);
    textAlign(LEFT, CENTER);
    text(comp.name, libX + 42, cy + 18);
    textAlign(CENTER, CENTER);
  }
}

function drawCanvas() {
  // Canvas background
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(canvasX, canvasY, canvasW, canvasH, 5);

  // Grid lines
  stroke(220);
  strokeWeight(1);
  for (let i = 1; i < gridCols; i++) {
    let x = canvasX + i * cellW;
    line(x, canvasY, x, canvasY + canvasH);
  }
  for (let i = 1; i < gridRows; i++) {
    let y = canvasY + i * cellH;
    line(canvasX, y, canvasX + canvasW, y);
  }

  // Canvas label
  if (placedComponents.length === 0) {
    fill(180);
    textSize(12);
    text('Dashboard Canvas', canvasX + canvasW / 2, canvasY + canvasH / 2 - 10);
    textSize(10);
    text('Drag components here or select a template', canvasX + canvasW / 2, canvasY + canvasH / 2 + 10);
  }

  // Draw placed components
  for (let i = 0; i < placedComponents.length; i++) {
    let pc = placedComponents[i];
    let comp = components.find(c => c.id === pc.id);
    let x = canvasX + pc.col * cellW + 5;
    let y = canvasY + pc.row * cellH + 5;
    let w = comp.w * cellW - 10;
    let h = cellH - 10;

    drawComponentAt(comp, x, y, w, h, 1);

    // Remove button
    fill(200, 50, 50);
    noStroke();
    ellipse(x + w - 8, y + 8, 16, 16);
    fill(255);
    textSize(10);
    text('×', x + w - 8, y + 8);
  }
}

function drawComponentAt(comp, x, y, w, h, alpha) {
  // Component card
  fill(red(color(comp.color)) * alpha + 255 * (1 - alpha),
       green(color(comp.color)) * alpha + 255 * (1 - alpha),
       blue(color(comp.color)) * alpha + 255 * (1 - alpha));
  stroke(comp.color);
  strokeWeight(2);
  rect(x, y, w, h, 5);

  // Icon and name
  fill(255);
  textSize(20);
  text(comp.icon, x + w / 2, y + h / 2 - 8);
  textSize(10);
  text(comp.name, x + w / 2, y + h / 2 + 12);
}

function drawTemplates() {
  let tempX = canvasX + canvasW + 20;
  let tempY = canvasY;
  let tempW = canvasWidth - tempX - 15;
  let tempH = canvasH;

  // Templates panel
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(tempX, tempY, tempW, tempH, 5);

  fill(70);
  textSize(11);
  textStyle(BOLD);
  text('Templates', tempX + tempW / 2, tempY + 15);
  textStyle(NORMAL);

  // Template buttons
  for (let i = 0; i < templates.length; i++) {
    let t = templates[i];
    let ty = tempY + 40 + i * 90;
    let isSelected = selectedTemplate === i;

    fill(isSelected ? color(70, 130, 180, 30) : color(248));
    stroke(isSelected ? color(70, 130, 180) : color(220));
    strokeWeight(isSelected ? 2 : 1);
    rect(tempX + 8, ty, tempW - 16, 80, 5);

    fill(60);
    textSize(10);
    textStyle(BOLD);
    text(t.name, tempX + tempW / 2, ty + 15);
    textStyle(NORMAL);

    // Mini preview
    let previewW = tempW - 30;
    let previewH = 45;
    let previewX = tempX + 15;
    let previewY = ty + 28;

    fill(240);
    noStroke();
    rect(previewX, previewY, previewW, previewH, 3);

    // Mini components
    let miniX = previewX + 3;
    for (let j = 0; j < min(t.components.length, 4); j++) {
      let compId = t.components[j];
      let comp = components.find(c => c.id === compId);
      let miniW = comp.w === 2 ? 30 : 18;

      fill(comp.color);
      noStroke();
      rect(miniX, previewY + 3, miniW, previewH - 6, 2);

      miniX += miniW + 3;
    }
  }
}

function drawControls() {
  let y = drawHeight + 40;

  // Component count
  fill(80);
  textSize(11);
  text('Components: ' + placedComponents.length + '/6', 100, y);

  // Clear button
  fill(placedComponents.length > 0 ? color(231, 76, 60) : color(200));
  noStroke();
  rect(200, y - 15, 80, 30, 5);
  fill(255);
  textSize(11);
  text('Clear All', 240, y);

  // Instructions
  fill(100);
  textSize(10);
  text('Drag components from library to canvas • Click templates to apply • Click × to remove', canvasWidth / 2 + 100, y);
}

function mousePressed() {
  // Check library drag start
  let libX = 10;
  let libY = 50;
  let libW = 130;

  for (let i = 0; i < components.length; i++) {
    let cy = libY + 50 + i * 42;
    if (mouseX > libX + 8 && mouseX < libX + libW - 8 && mouseY > cy && mouseY < cy + 36) {
      dragging = { ...components[i] };
      dragOffset = { x: mouseX - (libX + libW / 2), y: mouseY - cy };
      return;
    }
  }

  // Check template click
  let tempX = canvasX + canvasW + 20;
  let tempY = canvasY;
  let tempW = canvasWidth - tempX - 15;

  for (let i = 0; i < templates.length; i++) {
    let ty = tempY + 40 + i * 90;
    if (mouseX > tempX + 8 && mouseX < tempX + tempW - 8 && mouseY > ty && mouseY < ty + 80) {
      applyTemplate(i);
      return;
    }
  }

  // Check remove button clicks
  for (let i = placedComponents.length - 1; i >= 0; i--) {
    let pc = placedComponents[i];
    let comp = components.find(c => c.id === pc.id);
    let x = canvasX + pc.col * cellW + 5;
    let y = canvasY + pc.row * cellH + 5;
    let w = comp.w * cellW - 10;

    if (dist(mouseX, mouseY, x + w - 8, y + 8) < 10) {
      placedComponents.splice(i, 1);
      selectedTemplate = -1;
      return;
    }
  }

  // Check clear button
  let ctrlY = drawHeight + 40;
  if (mouseX > 200 && mouseX < 280 && mouseY > ctrlY - 15 && mouseY < ctrlY + 15) {
    placedComponents = [];
    selectedTemplate = -1;
  }
}

function mouseReleased() {
  if (dragging) {
    // Check if dropped on canvas
    if (mouseX > canvasX && mouseX < canvasX + canvasW &&
        mouseY > canvasY && mouseY < canvasY + canvasH) {

      let col = floor((mouseX - canvasX) / cellW);
      let row = floor((mouseY - canvasY) / cellH);

      // Check if space is available
      if (col + dragging.w <= gridCols && placedComponents.length < 6) {
        let canPlace = true;
        for (let pc of placedComponents) {
          let comp = components.find(c => c.id === pc.id);
          if (row === pc.row) {
            if (col < pc.col + comp.w && col + dragging.w > pc.col) {
              canPlace = false;
            }
          }
        }

        if (canPlace) {
          placedComponents.push({ id: dragging.id, col: col, row: row });
          selectedTemplate = -1;
        }
      }
    }
    dragging = null;
  }
}

function mouseMoved() {
  hoveredComponent = -1;

  let libX = 10;
  let libY = 50;
  let libW = 130;

  for (let i = 0; i < components.length; i++) {
    let cy = libY + 50 + i * 42;
    if (mouseX > libX + 8 && mouseX < libX + libW - 8 && mouseY > cy && mouseY < cy + 36) {
      hoveredComponent = i;
    }
  }
}

function applyTemplate(index) {
  placedComponents = [];
  selectedTemplate = index;

  let t = templates[index];
  let col = 0;
  let row = 0;

  for (let compId of t.components) {
    let comp = components.find(c => c.id === compId);

    if (col + comp.w > gridCols) {
      col = 0;
      row++;
      if (row >= gridRows) break;
    }

    placedComponents.push({ id: compId, col: col, row: row });
    col += comp.w;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
