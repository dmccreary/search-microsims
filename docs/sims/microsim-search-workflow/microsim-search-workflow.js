// MicroSim Search Workflow Infographic
// Shows the workflow from teacher need to MicroSim discovery
// Horizontal flow diagram with 4 stages
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Animation variables
let flowPhase = 0;
let activeStage = 0;
let mouseOverCanvas = false;

// Speed slider
let speedSlider;
let animationSpeed = 1;

// Stage data
let stages = [
  {
    title: 'Teacher Need',
    icon: 'person',
    color: [70, 130, 180],
    detail: '"I need something\nto teach quadratic\nequations"'
  },
  {
    title: 'Search Interface',
    icon: 'search',
    color: [100, 149, 237],
    detail: 'Subject: Math\nGrade: High School\nTopic: Quadratics'
  },
  {
    title: 'Results Ranked',
    icon: 'list',
    color: [60, 179, 113],
    detail: 'Top matches\nSorted by relevance\nQuality scores'
  },
  {
    title: 'MicroSim Found!',
    icon: 'check',
    color: [255, 165, 0],
    detail: 'Preview available\nOne-click embed\nSave to collection'
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Track mouse for animation control
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  textSize(defaultTextSize);

  speedSlider = createSlider(0.2, 3, 1, 0.1);
  speedSlider.position(sliderLeftMargin, drawHeight + 15);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Infographic showing the four stages of MicroSim discovery: Teacher Need, Search Interface, Results Ranked, and MicroSim Found', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area with gradient-like background
  drawGradientBackground();

  // Control area background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  animationSpeed = speedSlider.value();

  // Update animation when mouse is over canvas
  if (mouseOverCanvas) {
    flowPhase += 0.03 * animationSpeed;
    if (flowPhase > TWO_PI) {
      flowPhase = 0;
      activeStage = (activeStage + 1) % 4;
    }
  }

  // Title
  fill('white');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('MicroSim Search Workflow', canvasWidth / 2, 12);

  // Calculate stage positions
  let stageWidth = (canvasWidth - 60) / 4;
  let stageY = drawHeight / 2 + 10;

  // Draw flow arrows between stages
  drawFlowArrows(stageWidth, stageY);

  // Draw stages
  for (let i = 0; i < 4; i++) {
    let x = 30 + stageWidth * i + stageWidth / 2;
    drawStage(x, stageY, i, stageWidth - 20);
  }

  // Draw stage number indicators
  drawStageNumbers(stageWidth, stageY);

  // Draw control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Speed: ' + animationSpeed.toFixed(1) + 'x', 10, drawHeight + 25);

  // Instruction text
  textAlign(CENTER, BOTTOM);
  textSize(12);
  fill('#666');
  text('Hover to animate the discovery flow', canvasWidth / 2, drawHeight - 5);
}

function drawGradientBackground() {
  // Create blue gradient effect
  noStroke();
  for (let y = 0; y < drawHeight; y++) {
    let inter = map(y, 0, drawHeight, 0, 1);
    let c = lerpColor(color(40, 80, 120), color(70, 130, 180), inter);
    stroke(c);
    line(0, y, canvasWidth, y);
  }

  // Add subtle border
  noFill();
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
}

function drawFlowArrows(stageWidth, stageY) {
  let arrowY = stageY - 30;

  for (let i = 0; i < 3; i++) {
    let x1 = 30 + stageWidth * (i + 1) - 10;
    let x2 = 30 + stageWidth * (i + 1) + 10;

    // Arrow line
    let progress = 0;
    if (activeStage === i) {
      progress = (sin(flowPhase) + 1) / 2;
    } else if (activeStage > i) {
      progress = 1;
    }

    // Draw arrow with animation
    stroke(255, 255, 255, 150);
    strokeWeight(3);
    line(x1, arrowY, x2, arrowY);

    // Animated dot
    if (activeStage === i) {
      let dotX = lerp(x1, x2, progress);
      fill(255, 255, 255);
      noStroke();
      circle(dotX, arrowY, 8);
    }

    // Arrow head
    fill(255, 255, 255, 150);
    noStroke();
    triangle(x2 + 8, arrowY, x2, arrowY - 5, x2, arrowY + 5);
  }
}

function drawStage(x, y, index, w) {
  let stage = stages[index];
  let isActive = index === activeStage;
  let h = 180;

  // Pulse effect for active stage
  let pulse = isActive ? sin(flowPhase * 3) * 5 : 0;

  // Card background
  let alpha = isActive ? 255 : 200;
  fill(255, 255, 255, alpha);
  stroke(stage.color[0], stage.color[1], stage.color[2]);
  strokeWeight(isActive ? 3 : 2);
  rectMode(CENTER);
  rect(x, y, w + pulse, h + pulse, 12);

  // Icon circle at top
  let iconY = y - h/2 + 35;
  fill(stage.color[0], stage.color[1], stage.color[2]);
  noStroke();
  circle(x, iconY, 50 + pulse/2);

  // Draw icon
  fill(255);
  drawIcon(x, iconY, stage.icon);

  // Stage title
  fill(stage.color[0], stage.color[1], stage.color[2]);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(stage.title, x, y - 15);
  textStyle(NORMAL);

  // Stage details
  fill(80);
  textSize(10);
  textAlign(CENTER, TOP);
  let lines = stage.detail.split('\n');
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, y + 5 + i * 14);
  }

  rectMode(CORNER);
}

function drawIcon(x, y, iconType) {
  noStroke();
  fill(255);

  switch(iconType) {
    case 'person':
      // Person icon
      circle(x, y - 8, 14); // Head
      // Body
      beginShape();
      vertex(x - 10, y + 15);
      vertex(x - 6, y);
      vertex(x + 6, y);
      vertex(x + 10, y + 15);
      endShape(CLOSE);
      break;

    case 'search':
      // Magnifying glass
      noFill();
      stroke(255);
      strokeWeight(3);
      circle(x - 3, y - 3, 18);
      line(x + 6, y + 6, x + 12, y + 12);
      noStroke();
      break;

    case 'list':
      // List with checkmarks
      rectMode(CENTER);
      for (let i = 0; i < 3; i++) {
        let ly = y - 10 + i * 10;
        // Checkbox
        fill(255);
        rect(x - 8, ly, 8, 8, 2);
        // Check mark
        stroke(70, 130, 180);
        strokeWeight(2);
        line(x - 10, ly, x - 7, ly + 3);
        line(x - 7, ly + 3, x - 4, ly - 2);
        noStroke();
        // Line
        fill(255);
        rect(x + 4, ly, 14, 4, 2);
      }
      rectMode(CORNER);
      break;

    case 'check':
      // Celebration checkmark
      stroke(255);
      strokeWeight(4);
      noFill();
      line(x - 10, y, x - 3, y + 8);
      line(x - 3, y + 8, x + 10, y - 8);
      noStroke();

      // Sparkles around checkmark
      fill(255);
      let sparkles = [
        {dx: -15, dy: -10, size: 4},
        {dx: 15, dy: -8, size: 3},
        {dx: 12, dy: 10, size: 4},
        {dx: -12, dy: 8, size: 3}
      ];
      for (let s of sparkles) {
        drawSparkle(x + s.dx, y + s.dy, s.size);
      }
      break;
  }
}

function drawSparkle(x, y, size) {
  push();
  translate(x, y);
  rotate(flowPhase);
  stroke(255);
  strokeWeight(2);
  line(-size, 0, size, 0);
  line(0, -size, 0, size);
  pop();
}

function drawStageNumbers(stageWidth, stageY) {
  let numY = stageY + 120;

  for (let i = 0; i < 4; i++) {
    let x = 30 + stageWidth * i + stageWidth / 2;
    let isActive = i === activeStage;

    // Number circle
    fill(isActive ? 255 : 200, isActive ? 255 : 200, isActive ? 255 : 200, isActive ? 255 : 180);
    stroke(stages[i].color[0], stages[i].color[1], stages[i].color[2]);
    strokeWeight(2);
    circle(x, numY, 24);

    // Number
    fill(stages[i].color[0], stages[i].color[1], stages[i].color[2]);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(i + 1, x, numY);
    textStyle(NORMAL);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
