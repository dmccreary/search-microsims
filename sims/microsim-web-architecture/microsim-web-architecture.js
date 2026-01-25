// MicroSim Web Architecture Diagram
// Shows the relationship between host pages, iframes, and MicroSim files
// Technical diagram with layered elements showing HTTP request/response flow
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Animation variables
let flowPhase = 0;
let mouseOverCanvas = false;
let showDetails = false;

// Speed slider
let speedSlider;
let animationSpeed = 1;

// Detail checkbox
let detailCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Track mouse for animation control
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  textSize(defaultTextSize);

  detailCheckbox = createCheckbox(' Show Labels', true);
  detailCheckbox.position(10, drawHeight + 15);
  detailCheckbox.changed(() => showDetails = detailCheckbox.checked());
  showDetails = true;

  speedSlider = createSlider(0.2, 3, 1, 0.1);
  speedSlider.position(sliderLeftMargin + 60, drawHeight + 15);
  speedSlider.size(canvasWidth - sliderLeftMargin - 60 - margin);

  describe('Technical diagram showing how MicroSims are embedded in web pages using iframes, with server delivering files to browser', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  animationSpeed = speedSlider.value();

  // Update animation when mouse is over canvas
  if (mouseOverCanvas) {
    flowPhase += 0.02 * animationSpeed;
    if (flowPhase > TWO_PI) flowPhase = 0;
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('MicroSim Web Architecture', canvasWidth / 2, 8);

  // Calculate layout based on canvas width
  let serverX = 70;
  let browserX = canvasWidth / 2;
  let zoomX = canvasWidth - 90;

  // Draw components
  drawServer(serverX, 180);
  drawBrowser(browserX, 200);
  drawZoomedIframe(zoomX, 280);

  // Draw data flow arrows
  drawDataFlow(serverX, browserX);

  // Draw connecting line from browser to zoom
  stroke(150);
  strokeWeight(1);
  setLineDash([5, 5]);
  line(browserX + 100, 220, zoomX - 60, 200);
  setLineDash([]);

  // Magnifying glass icon
  noFill();
  stroke(100);
  strokeWeight(2);
  circle(zoomX - 55, 195, 20);
  line(zoomX - 45, 205, zoomX - 35, 215);

  // Draw control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Speed: ' + animationSpeed.toFixed(1) + 'x', sliderLeftMargin, drawHeight + 25);

  // Instruction text
  textAlign(CENTER, BOTTOM);
  textSize(12);
  fill('#666');
  text('Hover to animate data flow', canvasWidth / 2, drawHeight - 5);
}

function drawServer(x, y) {
  // Server box
  fill(128, 128, 128);
  stroke(80);
  strokeWeight(2);
  rectMode(CENTER);
  rect(x, y - 60, 90, 180, 8);

  // Server label
  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('SERVER', x, y - 135);

  // File icons
  let fileY = y - 100;
  let fileSpacing = 40;

  // main.html file
  drawFileIcon(x, fileY, 'main.html', [100, 149, 237]); // Cornflower blue

  // script.js file
  drawFileIcon(x, fileY + fileSpacing, 'script.js', [255, 215, 0]); // Gold

  // style.css file
  drawFileIcon(x, fileY + fileSpacing * 2, 'style.css', [144, 238, 144]); // Light green

  // Metadata file
  drawFileIcon(x, fileY + fileSpacing * 3, 'metadata', [255, 182, 193]); // Light pink

  rectMode(CORNER);
}

function drawFileIcon(x, y, label, color) {
  // File shape
  fill(color[0], color[1], color[2]);
  stroke(color[0] * 0.7, color[1] * 0.7, color[2] * 0.7);
  strokeWeight(1);

  beginShape();
  vertex(x - 20, y - 12);
  vertex(x + 12, y - 12);
  vertex(x + 20, y - 4);
  vertex(x + 20, y + 12);
  vertex(x - 20, y + 12);
  endShape(CLOSE);

  // Folded corner
  fill(255, 255, 255, 100);
  noStroke();
  triangle(x + 12, y - 12, x + 20, y - 4, x + 12, y - 4);

  // Label
  if (showDetails) {
    fill('black');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(9);
    text(label, x, y + 2);
  }
}

function drawBrowser(x, y) {
  let w = 180;
  let h = 220;

  // Browser window
  fill(240, 240, 240);
  stroke(100);
  strokeWeight(2);
  rectMode(CENTER);
  rect(x, y, w, h, 8);

  // Browser tab bar
  fill(200);
  noStroke();
  rect(x, y - h/2 + 15, w - 4, 25, 6, 6, 0, 0);

  // Tab
  fill(255);
  rect(x - 40, y - h/2 + 15, 60, 20, 4, 4, 0, 0);

  // URL bar
  fill(255);
  stroke(180);
  strokeWeight(1);
  rect(x, y - h/2 + 40, w - 20, 18, 4);

  // URL text
  if (showDetails) {
    fill(100);
    noStroke();
    textSize(7);
    textAlign(CENTER, CENTER);
    text('textbook.edu/chapter1', x, y - h/2 + 40);
  }

  // Browser label
  fill('black');
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('BROWSER', x, y - h/2 - 10);

  // Host page content
  fill(250);
  stroke(180);
  strokeWeight(1);
  rect(x, y + 10, w - 20, h - 80, 4);

  // Text placeholder lines
  fill(200);
  noStroke();
  for (let i = 0; i < 3; i++) {
    rect(x, y - 40 + i * 15, w - 40, 6, 2);
  }

  // Iframe container (highlighted)
  let iframeY = y + 45;
  let iframeH = 70;
  fill(100, 149, 237, 50); // Light blue tint
  stroke(100, 149, 237);
  strokeWeight(2);
  rect(x, iframeY, w - 30, iframeH, 4);

  // Iframe label
  if (showDetails) {
    fill(70, 130, 180);
    noStroke();
    textSize(9);
    text('<iframe>', x, iframeY - iframeH/2 + 10);
  }

  // Mini MicroSim inside iframe
  fill(173, 216, 230);
  noStroke();
  rect(x, iframeY + 5, w - 50, 35, 3);

  // Mini slider representation
  fill(150);
  rect(x, iframeY + 28, w - 60, 4, 2);
  fill(70, 130, 180);
  circle(x - 10 + sin(flowPhase) * 20, iframeY + 28, 8);

  // More text after iframe
  fill(200);
  for (let i = 0; i < 2; i++) {
    rect(x, y + 95 + i * 12, w - 40, 5, 2);
  }

  rectMode(CORNER);
}

function drawZoomedIframe(x, y) {
  let w = 120;
  let h = 150;

  // Zoomed panel
  fill(255);
  stroke(100, 149, 237);
  strokeWeight(3);
  rectMode(CENTER);
  rect(x, y, w, h, 8);

  // Header
  fill(100, 149, 237);
  noStroke();
  rect(x, y - h/2 + 15, w - 4, 26, 6, 6, 0, 0);

  // Title in header
  fill('white');
  textSize(10);
  textAlign(CENTER, CENTER);
  text('MicroSim', x, y - h/2 + 15);

  // Drawing area
  fill(240, 248, 255); // Alice blue
  stroke(200);
  strokeWeight(1);
  rect(x, y - 10, w - 20, 70, 4);

  // Animated content (bouncing ball representation)
  let ballY = y - 20 + sin(flowPhase * 2) * 20;
  fill(70, 130, 180);
  noStroke();
  circle(x, ballY, 20);

  // Control area
  fill(250);
  stroke(200);
  strokeWeight(1);
  rect(x, y + 45, w - 20, 30, 4);

  // Mini slider in control area
  fill(180);
  noStroke();
  rect(x + 10, y + 45, 35, 5, 2);
  fill(100, 149, 237);
  circle(x + 10 + sin(flowPhase) * 15, y + 45, 8);

  // Label
  if (showDetails) {
    fill(80);
    textSize(8);
    textAlign(LEFT, CENTER);
    text('Speed:', x - 45, y + 45);
  }

  // Zoom label
  fill('black');
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('ZOOMED VIEW', x, y + h/2 + 15);

  rectMode(CORNER);
}

function drawDataFlow(serverX, browserX) {
  // HTTP Request arrow
  let arrowY1 = 80;
  let arrowStartX = serverX + 50;
  let arrowEndX = browserX - 95;

  // Request arrow (going right)
  let requestProgress = (sin(flowPhase) + 1) / 2;
  let requestX = lerp(arrowStartX, arrowEndX, requestProgress);

  stroke(70, 130, 180);
  strokeWeight(2);
  line(arrowStartX, arrowY1, arrowEndX, arrowY1);

  // Animated packet (request)
  fill(70, 130, 180);
  noStroke();
  push();
  translate(requestX, arrowY1);
  triangle(8, 0, -5, -5, -5, 5);
  pop();

  // Request label
  if (showDetails) {
    fill(70, 130, 180);
    textSize(9);
    textAlign(CENTER, CENTER);
    noStroke();
    text('HTTP Request', (arrowStartX + arrowEndX) / 2, arrowY1 - 12);
  }

  // Response arrow (going left, below)
  let arrowY2 = 110;
  let responseProgress = (cos(flowPhase) + 1) / 2;
  let responseX = lerp(arrowEndX, arrowStartX, responseProgress);

  stroke(60, 179, 113);
  strokeWeight(2);
  line(arrowEndX, arrowY2, arrowStartX, arrowY2);

  // Animated packet (response - file icon)
  fill(60, 179, 113);
  noStroke();
  push();
  translate(responseX, arrowY2);
  rotate(PI);
  triangle(8, 0, -5, -5, -5, 5);
  pop();

  // Response label
  if (showDetails) {
    fill(60, 179, 113);
    textSize(9);
    textAlign(CENTER, CENTER);
    noStroke();
    text('MicroSim Files', (arrowStartX + arrowEndX) / 2, arrowY2 + 15);
  }

  // Arrow heads
  stroke(70, 130, 180);
  strokeWeight(2);
  line(arrowEndX - 8, arrowY1 - 5, arrowEndX, arrowY1);
  line(arrowEndX - 8, arrowY1 + 5, arrowEndX, arrowY1);

  stroke(60, 179, 113);
  line(arrowStartX + 8, arrowY2 - 5, arrowStartX, arrowY2);
  line(arrowStartX + 8, arrowY2 + 5, arrowStartX, arrowY2);
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - 60 - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
