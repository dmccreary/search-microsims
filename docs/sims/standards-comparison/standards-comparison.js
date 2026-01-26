// Standards Framework Comparison - Three-column infographic
let canvasWidth = 850;
const drawHeight = 440;
const controlHeight = 60;

const frameworks = [
  { name: 'CCSS', fullName: 'Common Core State Standards', color: '#2196F3',
    subjects: 'Mathematics, English Language Arts', grades: 'K-12',
    structure: 'Grade.Domain.Cluster.Standard',
    example: 'CCSS.MATH.CONTENT.8.F.A.1',
    exampleText: 'Understand that a function assigns one output per input',
    microsim: 'Function graphing explorer' },
  { name: 'NGSS', fullName: 'Next Generation Science Standards', color: '#4CAF50',
    subjects: 'Physical, Life, Earth Science, Engineering', grades: 'K-12',
    structure: 'GradeBand-DisciplineCoreIdea-Number',
    example: 'HS-PS2-1',
    exampleText: 'Analyze data supporting Newton\'s second law',
    microsim: 'Force and acceleration simulator' },
  { name: 'ISTE', fullName: 'International Society for Technology in Education', color: '#9C27B0',
    subjects: 'Technology, Digital Literacy, Computational Thinking', grades: 'K-12',
    structure: 'Standard.Indicator',
    example: 'ISTE 5.c',
    exampleText: 'Break problems into components and develop models',
    microsim: 'Algorithm visualization tool' }
];

let hoveredPanel = null;
let showOverlap = false;

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
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Curriculum Standards Framework Comparison', canvasWidth / 2, 22);
  textStyle(NORMAL);

  let panelW = (canvasWidth - 60) / 3;
  let panelH = drawHeight - 70;

  for (let i = 0; i < 3; i++) {
    let x = 15 + i * (panelW + 15);
    drawPanel(frameworks[i], x, 50, panelW, panelH, hoveredPanel === i);
  }

  if (showOverlap) drawOverlapLines();
  drawControls();
}

function drawPanel(fw, x, y, w, h, isHovered) {
  // Panel background
  fill(255);
  stroke(isHovered ? fw.color : 200);
  strokeWeight(isHovered ? 3 : 1);
  rect(x, y, w, h, 8);

  // Header
  fill(fw.color);
  noStroke();
  rect(x, y, w, 45, 8, 8, 0, 0);

  fill(255);
  textSize(16);
  textStyle(BOLD);
  text(fw.name, x + w / 2, y + 18);
  textStyle(NORMAL);
  textSize(9);
  text(fw.fullName.substring(0, 35), x + w / 2, y + 35);

  // Content
  let contentY = y + 55;
  fill(70);
  textSize(10);
  textStyle(BOLD);
  textAlign(LEFT, TOP);

  text('Subjects:', x + 10, contentY);
  textStyle(NORMAL);
  fill(100);
  textWrap(WORD);
  text(fw.subjects, x + 10, contentY + 15, w - 20);

  contentY += 50;
  fill(70);
  textStyle(BOLD);
  text('Grades:', x + 10, contentY);
  textStyle(NORMAL);
  fill(100);
  text(fw.grades, x + 10, contentY + 15);

  contentY += 35;
  fill(70);
  textStyle(BOLD);
  text('Structure:', x + 10, contentY);
  textStyle(NORMAL);
  fill(fw.color);
  text(fw.structure, x + 10, contentY + 15);

  contentY += 40;
  fill(70);
  textStyle(BOLD);
  text('Example:', x + 10, contentY);
  textStyle(NORMAL);
  fill(fw.color);
  textSize(11);
  text(fw.example, x + 10, contentY + 18);
  fill(100);
  textSize(9);
  text(fw.exampleText, x + 10, contentY + 35, w - 20);

  contentY += 70;
  fill(70);
  textStyle(BOLD);
  text('MicroSim:', x + 10, contentY);
  textStyle(NORMAL);
  fill(fw.color);
  text(fw.microsim, x + 10, contentY + 15);

  textAlign(CENTER, CENTER);
}

function drawOverlapLines() {
  // Draw connecting lines showing overlaps
  let y1 = 200;
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);

  // CCSS-NGSS overlap (both K-12)
  let panelW = (canvasWidth - 60) / 3;
  line(15 + panelW, y1, 30 + panelW, y1);

  // NGSS-ISTE overlap (both K-12)
  line(30 + panelW * 2, y1, 15 + panelW * 2, y1);

  drawingContext.setLineDash([]);

  fill(100);
  textSize(9);
  text('All cover K-12', canvasWidth / 2, y1 - 10);
}

function drawControls() {
  let y = drawHeight + 30;

  fill(showOverlap ? '#2196F3' : '#9E9E9E');
  noStroke();
  rectMode(CENTER);
  rect(80, y, 110, 32, 5);
  fill(255);
  textSize(11);
  text(showOverlap ? 'Hide Overlap' : 'Show Overlap', 80, y);

  fill(100);
  textSize(10);
  text('Hover over panels for details', canvasWidth / 2 + 100, y);
}

function mouseMoved() {
  hoveredPanel = null;
  let panelW = (canvasWidth - 60) / 3;

  for (let i = 0; i < 3; i++) {
    let x = 15 + i * (panelW + 15);
    if (mouseX > x && mouseX < x + panelW && mouseY > 50 && mouseY < drawHeight - 20) {
      hoveredPanel = i;
      break;
    }
  }
}

function mousePressed() {
  if (mouseY > drawHeight && mouseX > 25 && mouseX < 135) {
    showOverlap = !showOverlap;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
