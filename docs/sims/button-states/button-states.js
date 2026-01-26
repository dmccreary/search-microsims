// Button States MicroSim
// Shows different button types and their visual states
// Bloom Level: Remember (L1) - identify button states
// MicroSim template version 2026.02

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Button configuration
const buttonTypes = [
  { name: 'Primary', baseColor: '#3498db', textColor: 'white', style: 'filled' },
  { name: 'Secondary', baseColor: '#3498db', textColor: '#3498db', style: 'outlined' },
  { name: 'Toggle', baseColor: '#3498db', textColor: 'white', style: 'toggle' },
  { name: 'Destructive', baseColor: '#e74c3c', textColor: 'white', style: 'filled' }
];

const states = ['Normal', 'Hover', 'Active', 'Disabled'];

// Grid configuration
let gridStartX = 120;
let gridStartY = 80;
let cellWidth = 75;
let cellHeight = 55;
let buttonWidth = 60;
let buttonHeight = 30;

// Interaction tracking
let hoveredCell = null;
let activeCell = null;
let showFocus = false;

// UI Elements
let focusCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create checkbox for focus states
  focusCheckbox = createCheckbox(' Show Focus States', false);
  focusCheckbox.position(10, drawHeight + 12);
  focusCheckbox.changed(() => showFocus = focusCheckbox.checked());

  describe('Grid showing button types (Primary, Secondary, Toggle, Destructive) and their visual states (Normal, Hover, Active, Disabled)', LABEL);
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
  textSize(20);
  text('Button State Design Patterns', canvasWidth / 2, 15);

  // Draw column headers (states)
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  for (let col = 0; col < states.length; col++) {
    let x = gridStartX + col * cellWidth + cellWidth / 2;
    text(states[col], x, gridStartY - 5);
  }

  // Draw row labels (button types)
  textAlign(RIGHT, CENTER);
  for (let row = 0; row < buttonTypes.length; row++) {
    let y = gridStartY + row * cellHeight + cellHeight / 2;
    text(buttonTypes[row].name, gridStartX - 10, y);
  }
  textStyle(NORMAL);

  // Check hover state
  hoveredCell = null;
  for (let row = 0; row < buttonTypes.length; row++) {
    for (let col = 0; col < states.length; col++) {
      let x = gridStartX + col * cellWidth;
      let y = gridStartY + row * cellHeight;
      let btnX = x + (cellWidth - buttonWidth) / 2;
      let btnY = y + (cellHeight - buttonHeight) / 2;

      if (mouseX > btnX && mouseX < btnX + buttonWidth &&
          mouseY > btnY && mouseY < btnY + buttonHeight) {
        hoveredCell = { row, col };
      }
    }
  }

  // Draw grid of buttons
  for (let row = 0; row < buttonTypes.length; row++) {
    for (let col = 0; col < states.length; col++) {
      let x = gridStartX + col * cellWidth;
      let y = gridStartY + row * cellHeight;
      drawButtonCell(x, y, buttonTypes[row], states[col], row, col);
    }
  }

  // Draw annotation if hovering
  if (hoveredCell !== null) {
    drawAnnotation(hoveredCell.row, hoveredCell.col);
  }

  // Draw legend
  drawLegend();
}

function drawButtonCell(x, y, buttonType, state, row, col) {
  let btnX = x + (cellWidth - buttonWidth) / 2;
  let btnY = y + (cellHeight - buttonHeight) / 2;

  let isHovered = hoveredCell && hoveredCell.row === row && hoveredCell.col === col;
  let isActive = activeCell && activeCell.row === row && activeCell.col === col;

  // Cell background (highlight if hovered)
  if (isHovered) {
    fill(255, 255, 200, 100);
    noStroke();
    rect(x + 2, y + 2, cellWidth - 4, cellHeight - 4, 5);
  }

  // Calculate button colors based on state
  let baseCol = color(buttonType.baseColor);
  let btnFill, btnStroke, btnText;
  let isDisabled = state === 'Disabled';

  if (isDisabled) {
    btnFill = color('#95a5a6');
    btnStroke = color('#7f8c8d');
    btnText = color('white');
  } else {
    switch (state) {
      case 'Normal':
        btnFill = baseCol;
        btnStroke = baseCol;
        btnText = color(buttonType.textColor);
        break;
      case 'Hover':
        btnFill = lerpColor(baseCol, color(0), 0.15);
        btnStroke = lerpColor(baseCol, color(0), 0.15);
        btnText = color(buttonType.textColor);
        break;
      case 'Active':
        btnFill = lerpColor(baseCol, color(0), 0.25);
        btnStroke = lerpColor(baseCol, color(0), 0.25);
        btnText = color(buttonType.textColor);
        break;
      default:
        btnFill = baseCol;
        btnStroke = baseCol;
        btnText = color(buttonType.textColor);
    }
  }

  // Draw button based on style
  if (buttonType.style === 'outlined') {
    // Outlined button
    if (isDisabled) {
      fill(245);
      stroke('#95a5a6');
    } else if (state === 'Hover' || state === 'Active') {
      fill(lerpColor(color(255), baseCol, state === 'Active' ? 0.3 : 0.15));
      stroke(btnStroke);
    } else {
      fill(255);
      stroke(baseCol);
    }
    strokeWeight(2);
    rect(btnX, btnY, buttonWidth, buttonHeight, 5);

    // Text
    fill(isDisabled ? '#95a5a6' : btnStroke);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text('Button', btnX + buttonWidth/2, btnY + buttonHeight/2);
  } else if (buttonType.style === 'toggle') {
    // Toggle button (show play/pause icon)
    fill(btnFill);
    stroke(lerpColor(btnFill, color(0), 0.1));
    strokeWeight(1);
    rect(btnX, btnY, buttonWidth, buttonHeight, 5);

    // Icon
    fill(btnText);
    noStroke();
    let iconX = btnX + buttonWidth/2;
    let iconY = btnY + buttonHeight/2;

    if (state === 'Active') {
      // Pause icon
      rect(iconX - 8, iconY - 6, 5, 12);
      rect(iconX + 3, iconY - 6, 5, 12);
    } else {
      // Play icon
      triangle(iconX - 5, iconY - 7, iconX - 5, iconY + 7, iconX + 8, iconY);
    }
  } else {
    // Filled button (Primary or Destructive)
    fill(btnFill);
    if (state === 'Active') {
      // Pressed appearance - slight inset
      stroke(lerpColor(btnFill, color(0), 0.3));
      strokeWeight(1);
    } else if (state === 'Hover') {
      // Slight lift shadow
      fill(0, 0, 0, 30);
      noStroke();
      rect(btnX + 2, btnY + 2, buttonWidth, buttonHeight, 5);
      fill(btnFill);
    }
    stroke(lerpColor(btnFill, color(0), 0.1));
    strokeWeight(1);
    rect(btnX, btnY, buttonWidth, buttonHeight, 5);

    // Text
    fill(btnText);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text('Button', btnX + buttonWidth/2, btnY + buttonHeight/2);
  }

  // Focus ring (if enabled)
  if (showFocus && state === 'Hover') {
    noFill();
    stroke('#2196F3');
    strokeWeight(2);
    rect(btnX - 3, btnY - 3, buttonWidth + 6, buttonHeight + 6, 8);
  }
}

function drawAnnotation(row, col) {
  let buttonType = buttonTypes[row];
  let state = states[col];

  let annotationX = canvasWidth - 130;
  let annotationY = 80;
  let boxWidth = 120;
  let boxHeight = 80;

  // Background
  fill(255, 255, 255, 240);
  stroke('#333');
  strokeWeight(1);
  rect(annotationX, annotationY, boxWidth, boxHeight, 8);

  // Title
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text(buttonType.name + ' - ' + state, annotationX + 8, annotationY + 8);
  textStyle(NORMAL);

  // Description
  textSize(9);
  fill('#555');
  let desc = getStateDescription(buttonType.style, state);
  text(desc, annotationX + 8, annotationY + 28, boxWidth - 16, boxHeight - 35);
}

function getStateDescription(style, state) {
  const descriptions = {
    filled: {
      Normal: 'Default state. Solid fill with white text.',
      Hover: '15% darker. Subtle lift shadow indicates clickability.',
      Active: '25% darker. Pressed appearance.',
      Disabled: 'Gray fill. Low opacity. Not clickable.'
    },
    outlined: {
      Normal: 'White fill with colored border.',
      Hover: 'Light color fill on hover.',
      Active: 'Darker fill when clicked.',
      Disabled: 'Gray border. Faded appearance.'
    },
    toggle: {
      Normal: 'Shows play icon. Ready to start.',
      Hover: 'Darker shade indicates interactivity.',
      Active: 'Shows pause icon. Currently running.',
      Disabled: 'Gray. Feature unavailable.'
    }
  };
  return descriptions[style]?.[state] || 'Button state';
}

function drawLegend() {
  let legendY = drawHeight - 45;

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(10);
  textStyle(BOLD);
  text('Color Guide:', 15, legendY);
  textStyle(NORMAL);

  // Primary color
  fill('#3498db');
  noStroke();
  rect(15, legendY + 15, 12, 12, 2);
  fill('black');
  text('Primary (Blue)', 32, legendY + 16);

  // Destructive color
  fill('#e74c3c');
  noStroke();
  rect(120, legendY + 15, 12, 12, 2);
  fill('black');
  text('Destructive (Red)', 137, legendY + 16);

  // Disabled color
  fill('#95a5a6');
  noStroke();
  rect(245, legendY + 15, 12, 12, 2);
  fill('black');
  text('Disabled (Gray)', 262, legendY + 16);
}

function mousePressed() {
  if (hoveredCell !== null) {
    activeCell = { ...hoveredCell };
  }
}

function mouseReleased() {
  activeCell = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Recalculate grid positions for responsiveness
  gridStartX = Math.max(100, canvasWidth * 0.2);
  cellWidth = Math.min(80, (canvasWidth - gridStartX - 20) / 4);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);

  // Recalculate grid
  gridStartX = Math.max(100, canvasWidth * 0.2);
  cellWidth = Math.min(80, (canvasWidth - gridStartX - 20) / 4);
}
