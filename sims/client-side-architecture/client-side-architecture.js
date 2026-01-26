// Client-Side Search Architecture Diagram MicroSim
// Shows data flow from static server through browser to user

let canvasWidth = 800;
const drawHeight = 380;
const controlHeight = 70;
const canvasHeight = drawHeight + controlHeight;

// Components
const components = {
  server: { x: 80, y: 100, w: 140, h: 160, label: 'Static Server' },
  browser: { x: 280, y: 60, w: 300, h: 250, label: "User's Browser" },
  user: { x: 660, y: 140, w: 80, h: 120, label: 'User' }
};

// Browser sub-components
const browserParts = {
  dataLayer: { x: 300, y: 90, w: 120, h: 50, label: 'Data Layer', sublabel: 'JSON in Memory' },
  searchEngine: { x: 440, y: 90, w: 120, h: 50, label: 'Search Engine', sublabel: 'ItemsJS' },
  ui: { x: 300, y: 180, w: 260, h: 80, label: 'UI Components', sublabel: 'Search Box, Facets, Results' }
};

// Animation state
let animateDataFlow = false;
let animationPhase = 0;
let flowParticles = [];
let hoveredComponent = null;

// Annotations
const annotations = [
  { text: 'No server round-trips for search!', x: 420, y: 335, emphasis: true },
  { text: '~500KB JSON = instant search for 400+ MicroSims', x: 420, y: 355, emphasis: false },
  { text: 'Works offline after initial load', x: 420, y: 375, emphasis: false }
];

function updateCanvasSize() {
  canvasWidth = select('#canvas-container').width;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
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
  text('Client-Side Search Architecture', canvasWidth / 2, 25);
  textStyle(NORMAL);

  // Draw connections first (behind components)
  drawConnections();

  // Draw components
  drawServer();
  drawBrowser();
  drawUser();

  // Draw annotations
  drawAnnotations();

  // Draw flow particles if animating
  if (animateDataFlow) {
    updateAndDrawParticles();
  }

  // Draw controls
  drawControls();

  // Update animation
  if (animateDataFlow) {
    animationPhase += 0.02;
    if (animationPhase > 1) animationPhase = 0;

    // Add new particles periodically
    if (frameCount % 15 === 0) {
      addFlowParticle();
    }
  }
}

function drawServer() {
  const s = components.server;
  const isHovered = hoveredComponent === 'server';

  // Server box (gray)
  fill(isHovered ? 230 : 220);
  stroke(150);
  strokeWeight(isHovered ? 2 : 1);
  rect(s.x, s.y, s.w, s.h, 8);

  // Cloud icon at top
  fill(180);
  noStroke();
  ellipse(s.x + s.w / 2 - 20, s.y + 30, 30, 25);
  ellipse(s.x + s.w / 2, s.y + 25, 40, 30);
  ellipse(s.x + s.w / 2 + 20, s.y + 30, 30, 25);
  rect(s.x + s.w / 2 - 30, s.y + 25, 60, 15);

  // Label
  fill(60);
  textSize(12);
  textStyle(BOLD);
  text(s.label, s.x + s.w / 2, s.y + 70);
  textStyle(NORMAL);

  // Contents
  textSize(10);
  fill(80);
  text('HTML/CSS/JS', s.x + s.w / 2, s.y + 100);
  text('microsims-data.json', s.x + s.w / 2, s.y + 118);

  // Sub-label
  textSize(8);
  fill(120);
  text('GitHub Pages,', s.x + s.w / 2, s.y + 145);
  text('Netlify, or any host', s.x + s.w / 2, s.y + 157);
}

function drawBrowser() {
  const b = components.browser;
  const isHovered = hoveredComponent === 'browser';

  // Browser box (blue)
  fill(isHovered ? 230 : 240, 248, 255);
  stroke(70, 130, 180);
  strokeWeight(isHovered ? 2 : 1);
  rect(b.x, b.y, b.w, b.h, 8);

  // Browser chrome at top
  fill(70, 130, 180);
  noStroke();
  rect(b.x, b.y, b.w, 20, 8, 8, 0, 0);

  // Window buttons
  fill(255, 100, 100);
  ellipse(b.x + 15, b.y + 10, 8, 8);
  fill(255, 200, 100);
  ellipse(b.x + 30, b.y + 10, 8, 8);
  fill(100, 255, 100);
  ellipse(b.x + 45, b.y + 10, 8, 8);

  // Label
  fill(255);
  textSize(10);
  text("User's Browser", b.x + b.w / 2, b.y + 10);

  // Draw sub-components
  for (let key in browserParts) {
    const part = browserParts[key];
    const partHovered = hoveredComponent === key;

    fill(partHovered ? 255 : 248);
    stroke(100, 150, 200);
    strokeWeight(1);
    rect(part.x, part.y, part.w, part.h, 5);

    fill(50);
    textSize(10);
    textStyle(BOLD);
    text(part.label, part.x + part.w / 2, part.y + 15);
    textStyle(NORMAL);

    fill(100);
    textSize(9);
    text(part.sublabel, part.x + part.w / 2, part.y + 32);
  }

  // Internal arrows
  stroke(100, 150, 200);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);

  // Data Layer to Search Engine
  line(browserParts.dataLayer.x + browserParts.dataLayer.w,
       browserParts.dataLayer.y + browserParts.dataLayer.h / 2,
       browserParts.searchEngine.x,
       browserParts.searchEngine.y + browserParts.searchEngine.h / 2);

  // Search Engine to UI
  line(browserParts.searchEngine.x + browserParts.searchEngine.w / 2,
       browserParts.searchEngine.y + browserParts.searchEngine.h,
       browserParts.ui.x + browserParts.ui.w / 2,
       browserParts.ui.y);

  // Data Layer to UI
  line(browserParts.dataLayer.x + browserParts.dataLayer.w / 2,
       browserParts.dataLayer.y + browserParts.dataLayer.h,
       browserParts.ui.x + 30,
       browserParts.ui.y);

  drawingContext.setLineDash([]);
}

function drawUser() {
  const u = components.user;
  const isHovered = hoveredComponent === 'user';

  // Stick figure
  const cx = u.x + u.w / 2;
  const cy = u.y + 30;

  // Head
  fill(isHovered ? 255 : 245);
  stroke(100);
  strokeWeight(isHovered ? 2 : 1);
  ellipse(cx, cy, 35, 35);

  // Body
  line(cx, cy + 17, cx, cy + 50);

  // Arms
  line(cx - 25, cy + 30, cx + 25, cy + 30);

  // Legs
  line(cx, cy + 50, cx - 15, cy + 75);
  line(cx, cy + 50, cx + 15, cy + 75);

  // Label
  fill(60);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  text(u.label, cx, u.y + 115);
  textStyle(NORMAL);
}

function drawConnections() {
  // Server to Browser (dashed - one-time load)
  stroke(100, 180, 100);
  strokeWeight(2);
  drawingContext.setLineDash([8, 4]);

  const serverRight = components.server.x + components.server.w;
  const browserLeft = components.browser.x;
  const midY = components.server.y + components.server.h / 2;

  line(serverRight, midY, browserLeft, browserParts.dataLayer.y + browserParts.dataLayer.h / 2);

  // Arrow head
  drawingContext.setLineDash([]);
  fill(100, 180, 100);
  noStroke();
  push();
  translate(browserLeft - 5, browserParts.dataLayer.y + browserParts.dataLayer.h / 2);
  rotate(atan2(browserParts.dataLayer.y + browserParts.dataLayer.h / 2 - midY, browserLeft - serverRight));
  triangle(0, 0, -10, -5, -10, 5);
  pop();

  // Label
  fill(80, 150, 80);
  textSize(9);
  text('One-time data load', (serverRight + browserLeft) / 2, midY - 20);
  text('(on page load)', (serverRight + browserLeft) / 2, midY - 8);

  // Browser to User (solid - interaction)
  stroke(255, 140, 0);
  strokeWeight(2);

  const browserRight = components.browser.x + components.browser.w;
  const userLeft = components.user.x;
  const interactY = browserParts.ui.y + browserParts.ui.h / 2;

  // Bidirectional arrow
  line(browserRight, interactY, userLeft, interactY);

  // Arrow heads
  fill(255, 140, 0);
  noStroke();

  // To user
  triangle(userLeft - 5, interactY, userLeft - 15, interactY - 5, userLeft - 15, interactY + 5);

  // To browser
  triangle(browserRight + 5, interactY, browserRight + 15, interactY - 5, browserRight + 15, interactY + 5);

  // Label
  fill(200, 100, 0);
  textSize(9);
  text('Instant interaction', (browserRight + userLeft) / 2, interactY - 12);
}

function drawAnnotations() {
  textAlign(LEFT, CENTER);
  textSize(10);

  for (let a of annotations) {
    if (a.emphasis) {
      fill(200, 50, 50);
      textStyle(BOLD);
    } else {
      fill(80);
      textStyle(NORMAL);
    }
    text('• ' + a.text, 140, a.y);
  }

  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
}

function addFlowParticle() {
  // Data from server to browser
  flowParticles.push({
    x: components.server.x + components.server.w,
    y: components.server.y + components.server.h / 2,
    targetX: browserParts.dataLayer.x,
    targetY: browserParts.dataLayer.y + browserParts.dataLayer.h / 2,
    progress: 0,
    type: 'data'
  });

  // User input to browser
  if (random() > 0.5) {
    flowParticles.push({
      x: components.user.x,
      y: browserParts.ui.y + browserParts.ui.h / 2,
      targetX: components.browser.x + components.browser.w,
      targetY: browserParts.ui.y + browserParts.ui.h / 2,
      progress: 0,
      type: 'input'
    });
  }
}

function updateAndDrawParticles() {
  for (let i = flowParticles.length - 1; i >= 0; i--) {
    const p = flowParticles[i];

    p.progress += 0.02;

    const currentX = lerp(p.x, p.targetX, p.progress);
    const currentY = lerp(p.y, p.targetY, p.progress);

    // Draw particle
    noStroke();
    if (p.type === 'data') {
      fill(100, 180, 100);
    } else {
      fill(255, 140, 0);
    }
    ellipse(currentX, currentY, 8, 8);

    // Remove when done
    if (p.progress >= 1) {
      flowParticles.splice(i, 1);
    }
  }
}

function drawControls() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Animate button
  fill(animateDataFlow ? '#f44336' : '#4CAF50');
  stroke(100);
  strokeWeight(1);
  rect(canvasWidth / 2 - 70, buttonY, 140, buttonH, 5);
  fill(255);
  noStroke();
  textSize(12);
  text(animateDataFlow ? 'Stop Animation' : 'Animate Data Flow', canvasWidth / 2, buttonY + buttonH / 2);

  // Instruction
  fill(100);
  textSize(10);
  text('Hover over components for details', canvasWidth - 150, buttonY + buttonH / 2);
}

function mousePressed() {
  const buttonY = drawHeight + 18;
  const buttonH = 32;

  // Check animate button
  if (mouseX >= canvasWidth / 2 - 70 && mouseX <= canvasWidth / 2 + 70 &&
      mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    animateDataFlow = !animateDataFlow;
    if (!animateDataFlow) {
      flowParticles = [];
    }
  }
}

function mouseMoved() {
  hoveredComponent = null;

  // Check server
  const s = components.server;
  if (mouseX >= s.x && mouseX <= s.x + s.w && mouseY >= s.y && mouseY <= s.y + s.h) {
    hoveredComponent = 'server';
    cursor(HAND);
    return;
  }

  // Check browser parts
  for (let key in browserParts) {
    const part = browserParts[key];
    if (mouseX >= part.x && mouseX <= part.x + part.w &&
        mouseY >= part.y && mouseY <= part.y + part.h) {
      hoveredComponent = key;
      cursor(HAND);
      return;
    }
  }

  // Check user
  const u = components.user;
  if (mouseX >= u.x && mouseX <= u.x + u.w && mouseY >= u.y && mouseY <= u.y + u.h) {
    hoveredComponent = 'user';
    cursor(HAND);
    return;
  }

  // Check button
  const buttonY = drawHeight + 18;
  if (mouseY >= buttonY && mouseY <= buttonY + 32 &&
      mouseX >= canvasWidth / 2 - 70 && mouseX <= canvasWidth / 2 + 70) {
    cursor(HAND);
    return;
  }

  cursor(ARROW);
}
