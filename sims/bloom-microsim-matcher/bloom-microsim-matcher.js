// Bloom Level MicroSim Matcher - Drag and Drop Classification
let canvasWidth = 850;
const drawHeight = 500;
const controlHeight = 60;

const bloomLevels = [
  { name: 'Remember', color: '#E57373' },
  { name: 'Understand', color: '#FFB74D' },
  { name: 'Apply', color: '#FFF176' },
  { name: 'Analyze', color: '#AED581' },
  { name: 'Evaluate', color: '#81C784' },
  { name: 'Create', color: '#64B5F6' }
];

const cards = [
  { text: 'Match terms to definitions', level: 0 },
  { text: 'Summarize concept', level: 1 },
  { text: 'Calculate using formula', level: 2 },
  { text: 'Compare two algorithms', level: 3 },
  { text: 'Rate accuracy on rubric', level: 4 },
  { text: 'Design custom visualization', level: 5 },
  { text: 'Identify diagram parts', level: 0 },
  { text: 'Predict simulation output', level: 1 },
  { text: 'Apply rules to scenario', level: 2 },
  { text: 'Find patterns in data', level: 3 },
  { text: 'Critique solution approach', level: 4 },
  { text: 'Build a concept map', level: 5 }
];

let cardStates = [];
let draggedCard = null;
let dragOffsetX = 0, dragOffsetY = 0;
let score = 0;
let checked = false;

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 40, 900);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, drawHeight + controlHeight);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);
  resetCards();
}

function resetCards() {
  cardStates = cards.map((c, i) => ({
    ...c, id: i, x: 30 + (i % 3) * 110, y: 70 + floor(i / 3) * 55,
    placed: null, width: 100, height: 45
  }));
  score = 0;
  checked = false;
}

function draw() {
  background(248, 249, 250);
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  fill(50);
  textSize(16);
  textStyle(BOLD);
  text("Bloom's Level MicroSim Matcher", canvasWidth / 2, 20);
  textStyle(NORMAL);

  // Draw drop zones
  rectMode(CORNER);  // Reset from drawControls' CENTER mode
  let zoneX = canvasWidth - 200;
  let zoneW = 180;
  let zoneH = 70;

  for (let i = 0; i < 6; i++) {
    let y = 50 + i * 75;
    fill(bloomLevels[i].color);
    stroke(checked ? (cardStates.filter(c => c.placed === i).every(c => c.level === i) ? '#4CAF50' : '#f44336') : '#fff');
    strokeWeight(2);
    rect(zoneX, y, zoneW, zoneH, 5);

    fill(i < 3 ? 50 : 255);
    noStroke();
    textSize(12);
    textStyle(BOLD);

    // Show placed cards count
    let placedCount = cardStates.filter(c => c.placed === i).length;

    // Center text vertically, adjust if showing card count
    let labelY = placedCount > 0 ? y + zoneH / 2 - 8 : y + zoneH / 2;
    text('L' + (i + 1) + ': ' + bloomLevels[i].name, zoneX + zoneW / 2, labelY);
    textStyle(NORMAL);

    if (placedCount > 0) {
      textSize(10);
      text(placedCount + ' card(s)', zoneX + zoneW / 2, y + zoneH / 2 + 12);
    }
  }

  // Draw unplaced cards
  for (let card of cardStates) {
    if (card !== draggedCard && card.placed === null) {
      drawCard(card, card.x, card.y);
    }
  }

  // Draw dragged card last (on top)
  if (draggedCard) {
    drawCard(draggedCard, mouseX - dragOffsetX, mouseY - dragOffsetY);
  }

  // Score
  fill(50);
  textSize(14);
  text('Score: ' + score + '/' + cards.length, canvasWidth / 2, drawHeight - 20);

  drawControls();
}

function drawCard(card, x, y) {
  let isCorrect = checked && card.placed !== null && card.level === card.placed;
  let isWrong = checked && card.placed !== null && card.level !== card.placed;

  fill(255);
  stroke(isCorrect ? '#4CAF50' : (isWrong ? '#f44336' : '#ccc'));
  strokeWeight(isCorrect || isWrong ? 3 : 1);
  rect(x, y, card.width, card.height, 5);

  fill(50);
  noStroke();
  textSize(9);
  textWrap(WORD);
  text(card.text, x + card.width / 2, y + card.height / 2);
}

function drawControls() {
  let y = drawHeight + 30;

  fill('#4CAF50');
  noStroke();
  rectMode(CENTER);
  rect(80, y, 100, 32, 5);
  fill(255);
  textSize(11);
  text('Check Answers', 80, y);

  fill('#f44336');
  rect(190, y, 70, 32, 5);
  fill(255);
  text('Reset', 190, y);

  fill(100);
  textSize(10);
  text('Drag cards to matching Bloom level', canvasWidth / 2 + 100, y);
}

function mousePressed() {
  if (mouseY > drawHeight) {
    if (mouseX > 30 && mouseX < 130) checkAnswers();
    if (mouseX > 155 && mouseX < 225) resetCards();
    return;
  }

  for (let card of cardStates) {
    if (card.placed === null && mouseX > card.x && mouseX < card.x + card.width &&
        mouseY > card.y && mouseY < card.y + card.height) {
      draggedCard = card;
      dragOffsetX = mouseX - card.x;
      dragOffsetY = mouseY - card.y;
      break;
    }
  }
}

function mouseReleased() {
  if (draggedCard) {
    let zoneX = canvasWidth - 200;
    for (let i = 0; i < 6; i++) {
      let y = 50 + i * 75;
      if (mouseX > zoneX && mouseX < zoneX + 180 && mouseY > y && mouseY < y + 70) {
        draggedCard.placed = i;
        checked = false;
        break;
      }
    }
    draggedCard = null;
  }
}

function checkAnswers() {
  checked = true;
  score = cardStates.filter(c => c.placed !== null && c.level === c.placed).length;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
