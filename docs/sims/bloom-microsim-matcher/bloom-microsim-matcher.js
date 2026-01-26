// Bloom Level MicroSim Matcher - Drag and Drop Classification
let canvasWidth = 850;
const drawHeight = 450;
const controlHeight = 50;
const canvasHeight = drawHeight + controlHeight;
const margin = 20;

const bloomLevels = [
  { name: 'Remember', color: '#E57373' },
  { name: 'Understand', color: '#FFB74D' },
  { name: 'Apply', color: '#FFF176' },
  { name: 'Analyze', color: '#AED581' },
  { name: 'Evaluate', color: '#81C784' },
  { name: 'Create', color: '#64B5F6' }
];

const cards = [
  { text: 'Match terms\nto definitions', level: 0 },
  { text: 'Summarize\na concept', level: 1 },
  { text: 'Calculate using\na formula', level: 2 },
  { text: 'Compare two\nalgorithms', level: 3 },
  { text: 'Rate accuracy\non rubric', level: 4 },
  { text: 'Design custom\nvisualization', level: 5 },
  { text: 'Identify\ndiagram parts', level: 0 },
  { text: 'Predict simulation\noutput', level: 1 },
  { text: 'Apply rules\nto scenario', level: 2 },
  { text: 'Find patterns\nin data', level: 3 },
  { text: 'Critique solution\napproach', level: 4 },
  { text: 'Build a\nconcept map', level: 5 }
];

let cardStates = [];
let draggedCard = null;
let dragOffsetX = 0, dragOffsetY = 0;
let score = 0;
let checked = false;

// Feedback modal state
let showFeedback = false;
let feedbackCorrect = false;
let feedbackCard = null;
let feedbackLevel = null;

// Celebration animation state
let celebrating = false;

// DOM elements
let resetButton;
let stars = [];
const starColors = ['#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF6B9D'];

function createStarBurst(x, y, count) {
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let speed = random(3, 8);
    stars.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(8, 20),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.2, 0.2),
      color: color(random(starColors)),
      alpha: 255,
      fadeRate: random(3, 6),
      gravity: 0.15
    });
  }
}

function updateAndDrawStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    let s = stars[i];

    // Update physics
    s.vy += s.gravity;
    s.x += s.vx;
    s.y += s.vy;
    s.rotation += s.rotationSpeed;
    s.alpha -= s.fadeRate;
    s.vx *= 0.99; // Slight drag

    // Draw star
    if (s.alpha > 0) {
      push();
      translate(s.x, s.y);
      rotate(s.rotation);
      fill(red(s.color), green(s.color), blue(s.color), s.alpha);
      noStroke();
      drawStar(0, 0, s.size / 2, s.size, 5);
      pop();
    }

    // Remove faded stars
    if (s.alpha <= 0) {
      stars.splice(i, 1);
    }
  }
}

function drawStar(x, y, innerRadius, outerRadius, points) {
  let angle = TWO_PI / points;
  let halfAngle = angle / 2;
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * outerRadius;
    let sy = y + sin(a) * outerRadius;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * innerRadius;
    sy = y + sin(a + halfAngle) * innerRadius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function startCelebration() {
  celebrating = true;
  // Create multiple bursts across the screen
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      if (celebrating) {
        createStarBurst(random(100, canvasWidth - 100), random(100, 300), 25);
      }
    }, i * 400);
  }
}



function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textAlign(CENTER, CENTER);

  // Create Reset button using p5.js DOM
  resetButton = createButton('Reset');
  resetButton.position(margin, drawHeight - 45);
  resetButton.style('background-color', '#f44336');
  resetButton.style('color', 'white');
  resetButton.style('border', 'none');
  resetButton.style('padding', '8px 20px');
  resetButton.style('border-radius', '5px');
  resetButton.style('font-size', '14px');
  resetButton.style('cursor', 'pointer');
  resetButton.mousePressed(resetCards);

  resetCards();
}

function resetCards() {
  cardStates = cards.map((c, i) => ({
    ...c, id: i, x: 30 + (i % 3) * 110, y: 70 + floor(i / 3) * 55,
    placed: null, width: 100, height: 45
  }));
  score = 0;
  checked = false;
  showFeedback = false;
  feedbackCard = null;
  celebrating = false;
  stars = [];
}

function draw() {
  // updateCanvasSize();
  background('aliceblue');
  // fill('white');
  // rect(0, drawHeight, canvasWidth, controlHeight);

  // Title in the top center
  fill('black');
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Bloom's Level MicroSim Matcher", canvasWidth / 2, margin);
  
  // Instruction below title
  fill('black');
  textSize(12);
  textStyle(ITALIC);
  textAlign(CENTER, TOP);
  text('Drag cards to matching Bloom level', canvasWidth / 2, margin*2);
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
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);

    // Show placed cards count
    let placedCount = cardStates.filter(c => c.placed === i).length;

    // Center text vertically in the zone (y + zoneH/2 = y + 35)
    // Adding extra offset to account for visual centering
    let centerY = y + zoneH / 2 + 5;
    if (placedCount > 0) {
      text('L' + (i + 1) + ': ' + bloomLevels[i].name, zoneX + zoneW / 2, centerY - 12);
      textStyle(NORMAL);
      textSize(10);
      text(placedCount + ' card(s)', zoneX + zoneW / 2, centerY + 10);
    } else {
      text('L' + (i + 1) + ': ' + bloomLevels[i].name, zoneX + zoneW / 2, centerY);
      textStyle(NORMAL);
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
  fill('black');
  textSize(14);
  noStroke();
  textAlign(LEFT, CENTER);
  text('Score: ' + score + '/' + cards.length, margin, drawHeight*.7);
  
  drawControls();

  // Draw celebration stars
  if (celebrating || stars.length > 0) {
    updateAndDrawStars();
  }

  // Draw completion message during celebration
  if (celebrating && score === cards.length) {
    drawCompletionMessage();
  }

  // Draw feedback modal if active
  if (showFeedback) {
    drawFeedbackModal();
  }
}

function drawCompletionMessage() {
  // Semi-transparent background
  fill(0, 0, 0, 100);
  noStroke();
  rectMode(CORNER);
  rect(canvasWidth / 2 - 150, 180, 300, 80, 10);

  // Completion text
  fill(255);
  textSize(28);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('All Complete!', canvasWidth / 2, 210);

  textSize(14);
  textStyle(NORMAL);
  text('You matched all 12 cards correctly!', canvasWidth / 2, 240);
}

function drawFeedbackModal() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, canvasWidth, drawHeight + controlHeight);

  // Modal box
  let modalW = 280;
  let modalH = 160;
  let modalX = canvasWidth / 2 - modalW / 2;
  let modalY = drawHeight / 2 - modalH / 2;

  fill(255);
  stroke(feedbackCorrect ? '#4CAF50' : '#f44336');
  strokeWeight(4);
  rect(modalX, modalY, modalW, modalH, 10);

  // Feedback text
  fill(feedbackCorrect ? '#4CAF50' : '#f44336');
  noStroke();
  textSize(24);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(feedbackCorrect ? 'Correct!' : 'Try Again', canvasWidth / 2, modalY + 40);

  // Card and level info
  fill(80);
  textSize(12);
  textStyle(NORMAL);
  if (feedbackCard) {
    text('"' + feedbackCard.text + '"', canvasWidth / 2, modalY + 70);
    if (!feedbackCorrect) {
      fill(100);
      textSize(11);
      text('Correct level: L' + (feedbackCard.level + 1) + ' ' + bloomLevels[feedbackCard.level].name, canvasWidth / 2, modalY + 90);
    }
  }

  // OK button
  rectMode(CENTER);
  fill(feedbackCorrect ? '#4CAF50' : '#2196F3');
  noStroke();
  rect(canvasWidth / 2, modalY + modalH - 35, 80, 32, 5);
  fill(255);
  textSize(14);
  text('OK', canvasWidth / 2, modalY + modalH - 35);
}

function drawCard(card, x, y) {
  let isCorrect = checked && card.placed !== null && card.level === card.placed;
  let isWrong = checked && card.placed !== null && card.level !== card.placed;

  fill(215, 235, 250); // light blue, darker than aliceblue
  stroke(isCorrect ? '#4CAF50' : (isWrong ? '#f44336' : '#90CAF9'));
  strokeWeight(isCorrect || isWrong ? 3 : 1);
  rect(x, y, card.width, card.height, 5);

  fill(50);
  noStroke();
  textSize(9);
  textWrap(WORD);
  text(card.text, x + card.width / 2, y + card.height / 2);
}

function drawControls() {
  // Reset button is now a p5.js DOM element created in setup()
}

function mousePressed() {
  // Handle feedback modal OK button
  if (showFeedback) {
    let modalW = 280;
    let modalH = 160;
    let modalY = drawHeight / 2 - modalH / 2;
    let okBtnY = modalY + modalH - 35;

    // Check if OK button clicked
    if (mouseX > canvasWidth / 2 - 40 && mouseX < canvasWidth / 2 + 40 &&
        mouseY > okBtnY - 16 && mouseY < okBtnY + 16) {
      showFeedback = false;
      feedbackCard = null;
    }
    return; // Don't process other clicks while modal is open
  }

  // Reset button is handled by p5.js DOM element

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
        // Check if correct
        feedbackCorrect = (draggedCard.level === i);
        feedbackCard = draggedCard;
        feedbackLevel = i;

        if (feedbackCorrect) {
          draggedCard.placed = i;
          score++;

          // Start celebration if all cards are correct (skip feedback modal)
          if (score === cards.length) {
            startCelebration();
          } else {
            // Show feedback for non-final correct answers
            showFeedback = true;
          }
        } else {
          // Show feedback for wrong answers
          showFeedback = true;
        }
        break;
      }
    }
    draggedCard = null;
  }
}

function updateCanvasSize() {
  canvasWidth = windowWidth;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
