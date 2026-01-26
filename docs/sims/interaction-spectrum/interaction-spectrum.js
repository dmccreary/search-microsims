// Interaction Spectrum MicroSim
// Classifies MicroSims by interaction level from Passive to High
// Students can drag examples to test their classification understanding
// MicroSim template version 2026.02

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Spectrum configuration
let spectrumY = 180;
let spectrumHeight = 40;
let spectrumLeft = 60;
let spectrumRight;

// Interaction levels
const levels = [
  {
    name: 'Passive',
    color: '#3498db', // Blue
    icon: 'play',
    controls: 'None/Auto-play',
    role: 'Observer',
    example: 'Watch cell division',
    x: 0.1
  },
  {
    name: 'Low',
    color: '#5dade2', // Light blue
    icon: 'play-pause',
    controls: 'Play/pause, reset',
    role: 'Controller',
    example: 'Play/pause pendulum',
    x: 0.35
  },
  {
    name: 'Medium',
    color: '#27ae60', // Green
    icon: 'sliders',
    controls: 'Few parameters',
    role: 'Explorer',
    example: 'Adjust pendulum length',
    x: 0.65
  },
  {
    name: 'High',
    color: '#1d8348', // Dark green
    icon: 'many-controls',
    controls: 'Many parameters',
    role: 'Experimenter',
    example: 'Full pendulum lab',
    x: 0.9
  }
];

// Example cards for dragging
let cards = [];
let selectedCard = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Quiz mode
let quizMode = false;
let showPanels = true;
let feedback = '';
let feedbackTimer = 0;

// Buttons
let quizButton;
let panelButton;
let resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  spectrumRight = canvasWidth - 60;

  // Initialize example cards
  initializeCards();

  // Create buttons
  quizButton = createButton('Quiz Mode');
  quizButton.position(10, drawHeight + 10);
  quizButton.mousePressed(toggleQuizMode);

  panelButton = createButton('Show Details');
  panelButton.position(100, drawHeight + 10);
  panelButton.mousePressed(togglePanels);

  resetButton = createButton('Reset');
  resetButton.position(200, drawHeight + 10);
  resetButton.mousePressed(resetCards);

  describe('Interactive spectrum showing MicroSim interaction levels from Passive to High. Drag example cards to classify them.', LABEL);
}

function initializeCards() {
  cards = [
    {
      name: 'Cell Division',
      correctLevel: 0, // Passive
      x: 100,
      y: 300,
      description: 'Auto-playing animation showing cell mitosis'
    },
    {
      name: 'Simple Pendulum',
      correctLevel: 1, // Low
      x: 200,
      y: 300,
      description: 'Pendulum with only play/pause control'
    },
    {
      name: 'Wave Explorer',
      correctLevel: 2, // Medium
      x: 300,
      y: 300,
      description: 'Wave simulation with frequency and amplitude sliders'
    },
    {
      name: 'Physics Lab',
      correctLevel: 3, // High
      x: canvasWidth - 150,
      y: 300,
      description: 'Full simulation with many adjustable parameters'
    }
  ];
}

function draw() {
  updateCanvasSize();

  // Drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Interaction Level Spectrum', canvasWidth / 2, 15);

  // Draw spectrum
  drawSpectrum();

  // Draw level labels and markers
  drawLevelMarkers();

  // Draw detail panels if enabled
  if (showPanels && !quizMode) {
    drawDetailPanels();
  }

  // Draw example cards
  drawCards();

  // Draw feedback message
  if (feedbackTimer > 0) {
    drawFeedback();
    feedbackTimer--;
  }

  // Draw instructions
  drawInstructions();
}

function drawSpectrum() {
  // Draw gradient spectrum bar
  let spectrumWidth = spectrumRight - spectrumLeft;

  noStroke();
  for (let i = 0; i < spectrumWidth; i++) {
    let t = i / spectrumWidth;
    let c;
    if (t < 0.25) {
      c = lerpColor(color('#3498db'), color('#5dade2'), t * 4);
    } else if (t < 0.5) {
      c = lerpColor(color('#5dade2'), color('#27ae60'), (t - 0.25) * 4);
    } else if (t < 0.75) {
      c = lerpColor(color('#27ae60'), color('#1d8348'), (t - 0.5) * 4);
    } else {
      c = color('#1d8348');
    }
    fill(c);
    rect(spectrumLeft + i, spectrumY, 1, spectrumHeight);
  }

  // Border
  noFill();
  stroke('gray');
  strokeWeight(2);
  rect(spectrumLeft, spectrumY, spectrumWidth, spectrumHeight, 5);
}

function drawLevelMarkers() {
  textAlign(CENTER, TOP);
  textSize(14);

  let spectrumWidth = spectrumRight - spectrumLeft;

  for (let i = 0; i < levels.length; i++) {
    let level = levels[i];
    let x = spectrumLeft + level.x * spectrumWidth;

    // Draw marker
    fill(level.color);
    noStroke();
    ellipse(x, spectrumY + spectrumHeight / 2, 20, 20);

    // Draw label above
    fill('black');
    noStroke();
    textSize(14);
    textStyle(BOLD);
    text(level.name, x, spectrumY - 25);
    textStyle(NORMAL);

    // Draw icon representation below spectrum
    drawIcon(x, spectrumY + spectrumHeight + 20, level.icon, level.color);
  }
}

function drawIcon(x, y, type, col) {
  fill(col);
  noStroke();

  switch(type) {
    case 'play':
      // Simple play triangle
      triangle(x - 8, y - 8, x - 8, y + 8, x + 8, y);
      break;
    case 'play-pause':
      // Play + restart icon
      triangle(x - 12, y - 6, x - 12, y + 6, x - 4, y);
      rect(x + 2, y - 6, 4, 12);
      rect(x + 8, y - 6, 4, 12);
      break;
    case 'sliders':
      // 2-3 slider lines
      stroke(col);
      strokeWeight(2);
      line(x - 15, y - 5, x + 15, y - 5);
      line(x - 15, y + 5, x + 15, y + 5);
      noStroke();
      ellipse(x - 5, y - 5, 6, 6);
      ellipse(x + 5, y + 5, 6, 6);
      break;
    case 'many-controls':
      // Multiple controls representation
      rect(x - 15, y - 8, 8, 4, 1);
      rect(x - 15, y - 2, 8, 4, 1);
      rect(x - 15, y + 4, 8, 4, 1);
      stroke(col);
      strokeWeight(2);
      line(x, y - 6, x + 15, y - 6);
      line(x, y, x + 15, y);
      line(x, y + 6, x + 15, y + 6);
      noStroke();
      ellipse(x + 8, y - 6, 5, 5);
      ellipse(x + 12, y, 5, 5);
      ellipse(x + 5, y + 6, 5, 5);
      break;
  }
}

function drawDetailPanels() {
  let spectrumWidth = spectrumRight - spectrumLeft;
  let panelY = spectrumY + spectrumHeight + 50;
  let panelWidth = 85;
  let panelHeight = 60;

  textSize(10);
  textAlign(CENTER, TOP);

  for (let i = 0; i < levels.length; i++) {
    let level = levels[i];
    let x = spectrumLeft + level.x * spectrumWidth - panelWidth / 2;

    // Panel background
    fill(255, 255, 255, 230);
    stroke(level.color);
    strokeWeight(2);
    rect(x, panelY, panelWidth, panelHeight, 5);

    // Panel content
    fill('black');
    noStroke();
    textSize(9);
    text('Controls:', x + panelWidth/2, panelY + 5);
    textSize(8);
    text(level.controls, x + panelWidth/2, panelY + 16);
    textSize(9);
    text('Role:', x + panelWidth/2, panelY + 30);
    textSize(8);
    fill(level.color);
    text(level.role, x + panelWidth/2, panelY + 41);
  }
}

function drawCards() {
  let cardWidth = 100;
  let cardHeight = 45;

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let isSelected = (selectedCard === i);

    // Card shadow
    if (isSelected) {
      fill(0, 0, 0, 30);
      noStroke();
      rect(card.x - cardWidth/2 + 3, card.y - cardHeight/2 + 3, cardWidth, cardHeight, 8);
    }

    // Card background
    fill(isSelected ? '#fff8e1' : 'white');
    stroke(isSelected ? '#ff9800' : '#bdc3c7');
    strokeWeight(isSelected ? 3 : 2);
    rect(card.x - cardWidth/2, card.y - cardHeight/2, cardWidth, cardHeight, 8);

    // Card text
    fill('black');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text(card.name, card.x, card.y - 8);
    textStyle(NORMAL);
    textSize(9);
    fill('#666');

    // Show correct level indicator in non-quiz mode
    if (!quizMode) {
      text(levels[card.correctLevel].name, card.x, card.y + 10);
    } else {
      text('Drag to classify', card.x, card.y + 10);
    }
  }
}

function drawFeedback() {
  let isCorrect = feedback.startsWith('Correct');

  fill(isCorrect ? '#27ae60' : '#e74c3c');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text(feedback, canvasWidth / 2, 80);
  textStyle(NORMAL);
}

function drawInstructions() {
  fill('#666');
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(12);

  if (quizMode) {
    text('Drag cards to the correct position on the spectrum', canvasWidth / 2, drawHeight - 10);
  } else {
    text('Click cards to see descriptions. Toggle Quiz Mode to test your knowledge.', canvasWidth / 2, drawHeight - 10);
  }
}

function mousePressed() {
  // Check if clicking on a card
  let cardWidth = 100;
  let cardHeight = 45;

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    if (mouseX > card.x - cardWidth/2 && mouseX < card.x + cardWidth/2 &&
        mouseY > card.y - cardHeight/2 && mouseY < card.y + cardHeight/2) {
      selectedCard = i;
      dragOffsetX = card.x - mouseX;
      dragOffsetY = card.y - mouseY;
      return;
    }
  }
}

function mouseDragged() {
  if (selectedCard !== null) {
    cards[selectedCard].x = mouseX + dragOffsetX;
    cards[selectedCard].y = mouseY + dragOffsetY;

    // Constrain to canvas
    cards[selectedCard].x = constrain(cards[selectedCard].x, 50, canvasWidth - 50);
    cards[selectedCard].y = constrain(cards[selectedCard].y, 50, drawHeight - 30);
  }
}

function mouseReleased() {
  if (selectedCard !== null && quizMode) {
    checkPlacement(selectedCard);
  }
  selectedCard = null;
}

function checkPlacement(cardIndex) {
  let card = cards[cardIndex];
  let spectrumWidth = spectrumRight - spectrumLeft;

  // Check if card is near the spectrum
  if (card.y > spectrumY - 60 && card.y < spectrumY + spectrumHeight + 80) {
    // Calculate which level it's closest to
    let relativeX = (card.x - spectrumLeft) / spectrumWidth;

    let closestLevel = 0;
    let minDist = 1;

    for (let i = 0; i < levels.length; i++) {
      let dist = abs(relativeX - levels[i].x);
      if (dist < minDist) {
        minDist = dist;
        closestLevel = i;
      }
    }

    if (closestLevel === card.correctLevel) {
      feedback = 'Correct! ' + card.name + ' is ' + levels[closestLevel].name + ' interaction.';
      feedbackTimer = 120;
    } else {
      feedback = 'Try again! Think about what controls it has.';
      feedbackTimer = 90;
    }
  }
}

function toggleQuizMode() {
  quizMode = !quizMode;
  quizButton.html(quizMode ? 'Exit Quiz' : 'Quiz Mode');
  if (quizMode) {
    resetCards();
    showPanels = false;
    panelButton.html('Show Details');
  }
}

function togglePanels() {
  showPanels = !showPanels;
  panelButton.html(showPanels ? 'Hide Details' : 'Show Details');
}

function resetCards() {
  cards[0].x = 100;
  cards[0].y = 300;
  cards[1].x = 200;
  cards[1].y = 300;
  cards[2].x = 300;
  cards[2].y = 300;
  cards[3].x = canvasWidth - 150;
  cards[3].y = 300;
  feedback = '';
  feedbackTimer = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  spectrumRight = canvasWidth - 60;

  // Reposition cards proportionally
  cards[3].x = canvasWidth - 150;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
