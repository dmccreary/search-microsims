// Creative Commons License Chooser MicroSim
// Interactive tool to help select the appropriate CC license for MicroSims
// Based on templates: Icons Demo, MicroSim Readiness Assessment, Spec Quality Checklist

// Canvas dimensions
let canvasWidth = 800;
let topRowHeight = 420;
let bottomRowHeight = 180;
let rowGap = 0;
let drawHeight = topRowHeight + bottomRowHeight + rowGap;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;

// Panel dimensions (will be recalculated on resize)
let leftPanelWidth = 300;
let panelMargin = 10;

// State
let commercialChoice = null;  // 'yes' or 'no'
let modificationsChoice = null;  // 'yes', 'sharealike', or 'no'
let isCC0 = false;  // Maximum freedom mode
let hoveredElement = null;

// Colors
const colors = {
  background: 'aliceblue',
  panelBg: 'white',
  panelBorder: '#E0E0E0',
  headerBlue: '#1976D2',
  headerGreen: '#4CAF50',
  headerPurple: '#7B1FA2',
  yes: '#4CAF50',
  no: '#F44336',
  sharealike: '#FF9800',
  neutral: '#9E9E9E',
  text: '#333333',
  subtext: '#666666',
  radioUnselected: '#E0E0E0',
  radioSelected: '#1976D2',
  buttonPrimary: '#2196F3',
  buttonReset: '#757575',
  cc0Badge: '#4CAF50',
  ccbyBadge: '#4CAF50',
  ncBadge: '#F44336',
  saBadge: '#FF9800',
  ndBadge: '#9C27B0'
};

// License data
const licenses = {
  'CC0': {
    name: 'CC0 (Public Domain)',
    summary: 'Others can do anything with your work. No conditions.',
    icons: ['CC', '0'],
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    json: '"rights": "CC0 1.0 Universal (Public Domain Dedication)"'
  },
  'CC BY': {
    name: 'CC BY (Attribution)',
    summary: 'Others can copy, modify, distribute, and use commercially, as long as they give credit.',
    icons: ['CC', 'BY'],
    url: 'https://creativecommons.org/licenses/by/4.0/',
    json: '"rights": "Creative Commons Attribution 4.0 International (CC BY 4.0)"'
  },
  'CC BY-SA': {
    name: 'CC BY-SA (Attribution-ShareAlike)',
    summary: 'Others can copy, modify, and use commercially, but must give credit and share under the same license.',
    icons: ['CC', 'BY', 'SA'],
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    json: '"rights": "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)"'
  },
  'CC BY-ND': {
    name: 'CC BY-ND (Attribution-NoDerivatives)',
    summary: 'Others can copy and use commercially, but cannot modify. Must give credit.',
    icons: ['CC', 'BY', 'ND'],
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
    json: '"rights": "Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)"'
  },
  'CC BY-NC': {
    name: 'CC BY-NC (Attribution-NonCommercial)',
    summary: 'Others can copy, modify, and distribute for non-commercial use, with credit.',
    icons: ['CC', 'BY', 'NC'],
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    json: '"rights": "Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)"'
  },
  'CC BY-NC-SA': {
    name: 'CC BY-NC-SA',
    summary: 'Others can modify for non-commercial use, with credit, under same license.',
    icons: ['CC', 'BY', 'NC', 'SA'],
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    json: '"rights": "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)"'
  },
  'CC BY-NC-ND': {
    name: 'CC BY-NC-ND',
    summary: 'Others can only share verbatim for non-commercial use, with credit.',
    icons: ['CC', 'BY', 'NC', 'ND'],
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    json: '"rights": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)"'
  }
};

// Flowchart nodes
const flowNodes = {
  start: { x: 0.5, y: 0.08, label: 'Your\nMicroSim', type: 'start' },
  commercial: { x: 0.5, y: 0.30, label: 'Commercial?', type: 'decision' },
  modsYes: { x: 0.25, y: 0.55, label: 'Modifications?', type: 'decision' },
  modsNo: { x: 0.75, y: 0.55, label: 'Modifications?', type: 'decision' },
  ccby: { x: 0.10, y: 0.82, label: 'CC BY', type: 'result', license: 'CC BY' },
  ccbysa: { x: 0.25, y: 0.82, label: 'BY-SA', type: 'result', license: 'CC BY-SA' },
  ccbynd: { x: 0.40, y: 0.82, label: 'BY-ND', type: 'result', license: 'CC BY-ND' },
  ccbync: { x: 0.55, y: 0.82, label: 'BY-NC', type: 'result', license: 'CC BY-NC' },
  ccbyncsa: { x: 0.70, y: 0.82, label: 'BY-NC-SA', type: 'result', license: 'CC BY-NC-SA' },
  ccbyncnd: { x: 0.85, y: 0.82, label: 'BY-NC-ND', type: 'result', license: 'CC BY-NC-ND' }
};

// Flowchart connections
const flowConnections = [
  { from: 'start', to: 'commercial', label: '', active: true },
  { from: 'commercial', to: 'modsYes', label: 'Yes', type: 'yes' },
  { from: 'commercial', to: 'modsNo', label: 'No', type: 'no' },
  { from: 'modsYes', to: 'ccby', label: 'Yes', type: 'yes' },
  { from: 'modsYes', to: 'ccbysa', label: 'SA', type: 'sharealike' },
  { from: 'modsYes', to: 'ccbynd', label: 'No', type: 'no' },
  { from: 'modsNo', to: 'ccbync', label: 'Yes', type: 'yes' },
  { from: 'modsNo', to: 'ccbyncsa', label: 'SA', type: 'sharealike' },
  { from: 'modsNo', to: 'ccbyncnd', label: 'No', type: 'no' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  describe('Interactive Creative Commons license chooser. Answer questions about commercial use and modifications to get a license recommendation.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Background
  background(colors.background);

  // Draw top row panels (Questions + Decision Path)
  drawQuestionsPanel();
  drawFlowchartPanel();

  // Draw bottom row panel (Recommendation)
  drawResultPanel();

  // Control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  drawControlArea();
}

function drawQuestionsPanel() {
  let x = panelMargin;
  let y = panelMargin;
  let w = leftPanelWidth;
  let h = topRowHeight - panelMargin * 2;

  // Panel background
  fill(colors.panelBg);
  stroke(colors.panelBorder);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Header
  fill(colors.headerBlue);
  noStroke();
  rect(x, y, w, 40, 8, 8, 0, 0);

  fill('white');
  textSize(16);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('License Questions', x + w/2, y + 20);
  textStyle(NORMAL);

  // Question 1: Commercial Use
  let qy = y + 60;
  fill(colors.text);
  textSize(14);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Allow commercial use?', x + 10, qy);
  textStyle(NORMAL);

  fill(colors.subtext);
  textSize(11);
  text('Can others sell or profit from\nwork based on yours?', x + 10, qy + 20);

  // Radio buttons for commercial
  drawRadioButton(x + 15, qy + 60, 'Yes', commercialChoice === 'yes', 'commercial-yes');
  drawRadioButton(x + 95, qy + 60, 'No', commercialChoice === 'no', 'commercial-no');

  // Question 2: Modifications
  qy = y + 165;
  fill(colors.text);
  textSize(14);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Allow modifications?', x + 10, qy);
  textStyle(NORMAL);

  fill(colors.subtext);
  textSize(11);
  text('Can others adapt, remix, or\nbuild upon your work?', x + 10, qy + 20);

  // Radio buttons for modifications (stacked vertically)
  drawRadioButton(x + 15, qy + 60, 'Yes', modificationsChoice === 'yes', 'mods-yes');
  drawRadioButton(x + 15, qy + 90, 'Yes with the same license (SA)', modificationsChoice === 'sharealike', 'mods-sharealike');
  drawRadioButton(x + 15, qy + 120, 'No', modificationsChoice === 'no', 'mods-no');

  // Maximum Freedom Button
  let btnY = y + 320;
  let btnW = w - 20;
  let btnH = 40;
  let btnHover = hoveredElement === 'max-freedom';

  fill(btnHover ? '#388E3C' : colors.cc0Badge);
  noStroke();
  rect(x + 10, btnY, btnW, btnH, 6);

  fill('white');
  textSize(13);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('Maximum Freedom (CC0)', x + 10 + btnW/2, btnY + btnH/2);
  textStyle(NORMAL);

  // CC0 explanation
  fill(colors.subtext);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Waive all rights - public domain', x + w/2, btnY + btnH + 8);
}

function drawRadioButton(x, y, label, selected, id) {
  let size = 20;
  let isHovered = hoveredElement === id;

  // Outer circle
  stroke(selected ? colors.radioSelected : (isHovered ? colors.headerBlue : colors.radioUnselected));
  strokeWeight(2);
  fill('white');
  ellipse(x + size/2, y + size/2, size, size);

  // Inner circle if selected
  if (selected) {
    fill(colors.radioSelected);
    noStroke();
    ellipse(x + size/2, y + size/2, size - 8, size - 8);
  }

  // Label
  fill(colors.text);
  noStroke();
  textSize(13);
  textAlign(LEFT, CENTER);
  text(label, x + size + 8, y + size/2);
}

function drawFlowchartPanel() {
  let x = leftPanelWidth + panelMargin * 2;
  let y = panelMargin;
  let w = canvasWidth - leftPanelWidth - panelMargin * 3;
  let h = topRowHeight - panelMargin * 2;

  // Panel background
  fill(colors.panelBg);
  stroke(colors.panelBorder);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Header
  fill(colors.headerGreen);
  noStroke();
  rect(x, y, w, 40, 8, 8, 0, 0);

  fill('white');
  textSize(16);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('Decision Path', x + w/2, y + 20);
  textStyle(NORMAL);

  // Draw flowchart area
  let flowX = x;
  let flowY = y + 45;
  let flowW = w;
  let flowH = h - 50;

  // Draw connections first
  for (let conn of flowConnections) {
    drawFlowConnection(conn, flowX, flowY, flowW, flowH);
  }

  // Draw nodes
  for (let key in flowNodes) {
    drawFlowNode(flowNodes[key], key, flowX, flowY, flowW, flowH);
  }

  // CC0 overlay if selected
  if (isCC0) {
    fill(255, 255, 255, 220);
    noStroke();
    rect(flowX + 5, flowY, flowW - 10, flowH - 5, 0, 0, 5, 5);

    fill(colors.cc0Badge);
    textSize(24);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text('CC0', flowX + flowW/2, flowY + flowH/2 - 20);
    textStyle(NORMAL);
    textSize(12);
    fill(colors.text);
    text('Public Domain', flowX + flowW/2, flowY + flowH/2 + 10);
    text('All rights waived', flowX + flowW/2, flowY + flowH/2 + 28);
  }
}

function drawFlowConnection(conn, panelX, panelY, panelW, panelH) {
  let fromNode = flowNodes[conn.from];
  let toNode = flowNodes[conn.to];

  let x1 = panelX + fromNode.x * panelW;
  let y1 = panelY + fromNode.y * panelH;
  let x2 = panelX + toNode.x * panelW;
  let y2 = panelY + toNode.y * panelH;

  // Determine if this connection is active
  let isActive = isConnectionActive(conn);

  // Set color based on type and active state
  if (isActive) {
    if (conn.type === 'yes') stroke(colors.yes);
    else if (conn.type === 'no') stroke(colors.no);
    else if (conn.type === 'sharealike') stroke(colors.sharealike);
    else stroke(colors.headerBlue);
    strokeWeight(3);
  } else {
    stroke(colors.neutral);
    strokeWeight(1);
  }

  noFill();

  // Adjust start/end points based on node types
  let startX = x1;
  let startY = y1 + 15;
  if (fromNode.type === 'decision') {
    if (conn.type === 'yes') startX -= 25;
    else if (conn.type === 'no') startX += 25;
    else if (conn.type === 'sharealike') startY = y1 + 20;
  }

  let endX = x2;
  let endY = y2 - 15;

  // Draw line
  line(startX, startY, endX, endY);

  // Draw arrowhead
  let arrowColor;
  if (isActive) {
    if (conn.type === 'yes') arrowColor = colors.yes;
    else if (conn.type === 'no') arrowColor = colors.no;
    else if (conn.type === 'sharealike') arrowColor = colors.sharealike;
    else arrowColor = colors.headerBlue;
  } else {
    arrowColor = colors.neutral;
  }

  // Calculate angle of the line
  let angle = atan2(endY - startY, endX - startX);

  fill(arrowColor);
  noStroke();
  push();
  translate(endX, endY);
  rotate(angle - HALF_PI);  // Rotate to point along line direction
  triangle(0, 0, -6, -10, 6, -10);
  pop();

  // Draw label
  if (conn.label) {
    let midX = (startX + endX) / 2;
    let midY = (startY + endY) / 2;

    textSize(10);
    textStyle(BOLD);
    let labelW = textWidth(conn.label) + 6;
    let labelH = 14;

    // White background for readability
    fill('white');
    noStroke();
    rectMode(CENTER);
    rect(midX, midY, labelW, labelH, 2);
    rectMode(CORNER);

    // Label text
    fill(isActive ? arrowColor : colors.neutral);
    textAlign(CENTER, CENTER);
    text(conn.label, midX, midY);
    textStyle(NORMAL);
  }
}

function isConnectionActive(conn) {
  if (isCC0) return false;

  // Start to commercial is always active
  if (conn.from === 'start') return true;

  // Commercial to mods branches
  if (conn.from === 'commercial') {
    if (conn.type === 'yes' && commercialChoice === 'yes') return true;
    if (conn.type === 'no' && commercialChoice === 'no') return true;
  }

  // Mods to results
  if (conn.from === 'modsYes' && commercialChoice === 'yes') {
    if (conn.type === 'yes' && modificationsChoice === 'yes') return true;
    if (conn.type === 'sharealike' && modificationsChoice === 'sharealike') return true;
    if (conn.type === 'no' && modificationsChoice === 'no') return true;
  }

  if (conn.from === 'modsNo' && commercialChoice === 'no') {
    if (conn.type === 'yes' && modificationsChoice === 'yes') return true;
    if (conn.type === 'sharealike' && modificationsChoice === 'sharealike') return true;
    if (conn.type === 'no' && modificationsChoice === 'no') return true;
  }

  return false;
}

function drawFlowNode(node, key, panelX, panelY, panelW, panelH) {
  let x = panelX + node.x * panelW;
  let y = panelY + node.y * panelH;

  let isActive = isNodeActive(key);

  push();
  translate(x, y);

  if (node.type === 'start') {
    // Rounded rectangle
    fill(isActive ? colors.headerBlue : colors.neutral);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, 60, 35, 8);

    fill('white');
    textSize(10);
    textAlign(CENTER, CENTER);
    text(node.label, 0, 0);

  } else if (node.type === 'decision') {
    // Diamond (wider to fit text)
    fill(isActive ? colors.sharealike : colors.neutral);
    noStroke();
    beginShape();
    vertex(0, -20);
    vertex(40, 0);
    vertex(0, 20);
    vertex(-40, 0);
    endShape(CLOSE);

    fill('white');
    textSize(9);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(node.label, 0, 0);
    textStyle(NORMAL);

  } else if (node.type === 'result') {
    let isSelected = getSelectedLicense() === node.license;

    // Rounded rectangle
    fill(isSelected ? colors.yes : (isActive ? colors.headerPurple : colors.neutral));
    noStroke();
    rectMode(CENTER);
    rect(0, 0, 55, 30, 6);

    fill('white');
    textSize(8);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(node.label, 0, 0);
    textStyle(NORMAL);
  }

  pop();
}

function isNodeActive(key) {
  if (isCC0) return false;

  if (key === 'start' || key === 'commercial') return true;
  if (key === 'modsYes' && commercialChoice === 'yes') return true;
  if (key === 'modsNo' && commercialChoice === 'no') return true;

  // Result nodes
  if (commercialChoice === 'yes') {
    if (key === 'ccby' && modificationsChoice === 'yes') return true;
    if (key === 'ccbysa' && modificationsChoice === 'sharealike') return true;
    if (key === 'ccbynd' && modificationsChoice === 'no') return true;
  }
  if (commercialChoice === 'no') {
    if (key === 'ccbync' && modificationsChoice === 'yes') return true;
    if (key === 'ccbyncsa' && modificationsChoice === 'sharealike') return true;
    if (key === 'ccbyncnd' && modificationsChoice === 'no') return true;
  }

  return false;
}

function drawResultPanel() {
  let x = panelMargin;
  let y = topRowHeight + rowGap;
  let w = canvasWidth - panelMargin * 2;
  let h = bottomRowHeight - panelMargin;

  // Panel background
  fill(colors.panelBg);
  stroke(colors.panelBorder);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Header
  fill(colors.headerPurple);
  noStroke();
  rect(x, y, w, 40, 8, 8, 0, 0);

  fill('white');
  textSize(16);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('Recommendation', x + w/2, y + 20);
  textStyle(NORMAL);

  let license = getSelectedLicense();

  if (!license) {
    // No selection yet
    fill(colors.subtext);
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Answer the questions\nto get a recommendation', x + w/2, y + h/2);
    return;
  }

  let licenseData = licenses[license];

  // Horizontal layout: Left section (badge + name + summary), Right section (JSON + link)
  let leftSectionWidth = w * 0.4;
  let rightSectionX = x + leftSectionWidth + 20;
  let rightSectionWidth = w - leftSectionWidth;
  let contentY = y + 55;

  // License badge (left section)
  drawLicenseBadge(x + leftSectionWidth/2, contentY + 25, licenseData.icons);

  // License name
  fill(colors.text);
  textSize(14);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text(licenseData.name, x + leftSectionWidth/2, contentY + 60);
  textStyle(NORMAL);

  // Summary
  fill(colors.subtext);
  textSize(11);
  textAlign(CENTER, TOP);
  text(licenseData.summary, x + 15, contentY + 85, leftSectionWidth - 30);

  // Vertical divider
  stroke(colors.panelBorder);
  strokeWeight(1);
  line(rightSectionX - 10, y + 50, rightSectionX - 10, y + h - 15);

  // JSON snippet header (right section)
  fill(colors.text);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Metadata JSON:', rightSectionX + 10, contentY);
  textStyle(NORMAL);

  // JSON code box
  fill('#F5F5F5');
  stroke('#E0E0E0');
  strokeWeight(1);
  rect(rightSectionX + 5, contentY + 20, rightSectionWidth - 30, 50, 4);

  fill('#D32F2F');
  textSize(10);
  textAlign(LEFT, TOP);
  textFont('monospace');
  text(licenseData.json, rightSectionX + 12, contentY + 30, rightSectionWidth - 45);
  textFont('Arial');

  // Link
  fill(colors.headerBlue);
  textSize(11);
  textAlign(LEFT, TOP);
  let linkY = contentY + 85;
  let linkX = rightSectionX + 10;
  text('View full license text', linkX, linkY);

  // Underline for link
  let linkW = textWidth('View full license text');
  stroke(colors.headerBlue);
  strokeWeight(1);
  line(linkX, linkY + 14, linkX + linkW, linkY + 14);
}

function drawLicenseBadge(cx, cy, icons) {
  let iconSize = 30;
  let totalWidth = icons.length * (iconSize + 5) - 5;
  let startX = cx - totalWidth / 2;

  for (let i = 0; i < icons.length; i++) {
    let ix = startX + i * (iconSize + 5) + iconSize / 2;
    drawCCIcon(ix, cy, iconSize, icons[i]);
  }
}

function drawCCIcon(x, y, size, type) {
  let iconColor = '#333';

  // Draw circle outline
  noFill();
  stroke(iconColor);
  strokeWeight(size * 0.08);
  ellipse(x, y, size, size);

  // Draw icon symbol
  noStroke();
  fill(iconColor);

  let r = size / 2;

  switch(type) {
    case 'CC':
      // Two C letters
      textSize(size * 0.32);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text('CC', x, y);
      textStyle(NORMAL);
      break;

    case '0':
      // Zero for public domain
      textSize(size * 0.5);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text('0', x, y);
      textStyle(NORMAL);
      break;

    case 'BY':
      // Person/attribution icon
      let headR = size * 0.12;
      let bodyW = size * 0.28;
      let bodyH = size * 0.22;
      ellipse(x, y - size * 0.15, headR * 2, headR * 2);
      // Body (shoulders and torso)
      beginShape();
      vertex(x - bodyW/2, y + size * 0.05);
      vertex(x - bodyW/2, y + size * 0.28);
      vertex(x + bodyW/2, y + size * 0.28);
      vertex(x + bodyW/2, y + size * 0.05);
      // Neck curve
      bezierVertex(x + bodyW/4, y - size * 0.02, x - bodyW/4, y - size * 0.02, x - bodyW/2, y + size * 0.05);
      endShape(CLOSE);
      break;

    case 'NC':
      // Dollar sign with slash
      textSize(size * 0.9);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text('$', x, y);
      textStyle(NORMAL);
      // Diagonal slash
      stroke(iconColor);
      strokeWeight(size * 0.08);
      let slashOffset = size * 0.32;
      line(x - slashOffset, y + slashOffset, x + slashOffset, y - slashOffset);
      noStroke();
      break;

    case 'SA':
      // Circular arrow (ShareAlike)
      stroke(iconColor);
      strokeWeight(size * 0.08);
      noFill();
      let arcR = size * 0.28;
      arc(x, y, arcR * 2, arcR * 2, PI * 0.8, PI * 2.2);
      // Arrow head
      fill(iconColor);
      noStroke();
      push();
      translate(x + arcR * cos(PI * 2.2), y + arcR * sin(PI * 2.2));
      rotate(PI * 2.2 + PI/2);
      triangle(0, -size * 0.1, -size * 0.08, size * 0.02, size * 0.08, size * 0.02);
      pop();
      break;

    case 'ND':
      // Equals sign with slash (No Derivatives)
      let barW = size * 0.35;
      let barH = size * 0.08;
      let barGap = size * 0.12;
      // Top bar
      rect(x - barW/2, y - barGap/2 - barH, barW, barH);
      // Bottom bar
      rect(x - barW/2, y + barGap/2, barW, barH);
      // Diagonal slash
      stroke(iconColor);
      strokeWeight(size * 0.08);
      let ndSlash = size * 0.32;
      line(x - ndSlash, y + ndSlash, x + ndSlash, y - ndSlash);
      noStroke();
      break;
  }
}

function getSelectedLicense() {
  if (isCC0) return 'CC0';
  if (!commercialChoice || !modificationsChoice) return null;

  if (commercialChoice === 'yes') {
    if (modificationsChoice === 'yes') return 'CC BY';
    if (modificationsChoice === 'sharealike') return 'CC BY-SA';
    if (modificationsChoice === 'no') return 'CC BY-ND';
  } else {
    if (modificationsChoice === 'yes') return 'CC BY-NC';
    if (modificationsChoice === 'sharealike') return 'CC BY-NC-SA';
    if (modificationsChoice === 'no') return 'CC BY-NC-ND';
  }
  return null;
}

function drawControlArea() {
  // Reset button
  let btnW = 80;
  let btnH = 32;
  let btnX = canvasWidth / 2 - btnW / 2;
  let btnY = drawHeight + (controlHeight - btnH) / 2;

  let isHovered = hoveredElement === 'reset';

  fill(isHovered ? '#616161' : colors.buttonReset);
  noStroke();
  rect(btnX, btnY, btnW, btnH, 6);

  fill('white');
  textSize(13);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('Reset', btnX + btnW/2, btnY + btnH/2);
  textStyle(NORMAL);

  // Instructions
  fill(colors.subtext);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Select options to see the license path', panelMargin + 10, drawHeight + controlHeight/2);
}

function mousePressed() {
  // Check result panel link click
  let license = getSelectedLicense();
  if (license) {
    let licenseData = licenses[license];
    let panelX = panelMargin;
    let panelW = canvasWidth - panelMargin * 2;
    let leftSectionWidth = panelW * 0.4;
    let rightSectionX = panelX + leftSectionWidth;
    let contentY = topRowHeight + rowGap + 55;
    let linkY = contentY + 85;
    let linkX = rightSectionX + 10;
    let linkW = 120;

    if (mouseX >= linkX && mouseX <= linkX + linkW &&
        mouseY >= linkY && mouseY <= linkY + 20) {
      window.open(licenseData.url, '_blank');
      return;
    }
  }

  // Check radio buttons and buttons in questions panel
  checkQuestionsPanelClicks();

  // Check reset button
  let btnW = 80;
  let btnH = 32;
  let btnX = canvasWidth / 2 - btnW / 2;
  let btnY = drawHeight + (controlHeight - btnH) / 2;

  if (mouseX >= btnX && mouseX <= btnX + btnW &&
      mouseY >= btnY && mouseY <= btnY + btnH) {
    resetAll();
  }
}

function checkQuestionsPanelClicks() {
  let px = panelMargin;
  let py = panelMargin;

  // Commercial radio buttons
  let qy = py + 60;
  if (isClickOnRadio(px + 15, qy + 60)) {
    commercialChoice = 'yes';
    isCC0 = false;
  }
  if (isClickOnRadio(px + 95, qy + 60)) {
    commercialChoice = 'no';
    isCC0 = false;
  }

  // Modifications radio buttons (stacked vertically)
  qy = py + 165;
  if (isClickOnRadio(px + 15, qy + 60)) {
    modificationsChoice = 'yes';
    isCC0 = false;
  }
  if (isClickOnRadio(px + 15, qy + 90)) {
    modificationsChoice = 'sharealike';
    isCC0 = false;
  }
  if (isClickOnRadio(px + 15, qy + 120)) {
    modificationsChoice = 'no';
    isCC0 = false;
  }

  // Maximum Freedom button
  let btnY = py + 320;
  let btnW = leftPanelWidth - 20;
  let btnH = 40;

  if (mouseX >= px + 10 && mouseX <= px + 10 + btnW &&
      mouseY >= btnY && mouseY <= btnY + btnH) {
    isCC0 = true;
    commercialChoice = null;
    modificationsChoice = null;
  }
}

function isClickOnRadio(rx, ry) {
  let size = 20;
  return mouseX >= rx && mouseX <= rx + size + 160 &&
         mouseY >= ry && mouseY <= ry + size;
}

function mouseMoved() {
  hoveredElement = null;
  cursor(ARROW);

  let px = panelMargin;
  let py = panelMargin;

  // Check commercial radios
  let qy = py + 60;
  if (isHoverOnRadio(px + 15, qy + 60)) {
    hoveredElement = 'commercial-yes';
    cursor(HAND);
    return;
  }
  if (isHoverOnRadio(px + 95, qy + 60)) {
    hoveredElement = 'commercial-no';
    cursor(HAND);
    return;
  }

  // Check modifications radios (stacked vertically)
  qy = py + 165;
  if (isHoverOnRadio(px + 15, qy + 60)) {
    hoveredElement = 'mods-yes';
    cursor(HAND);
    return;
  }
  if (isHoverOnRadio(px + 15, qy + 90)) {
    hoveredElement = 'mods-sharealike';
    cursor(HAND);
    return;
  }
  if (isHoverOnRadio(px + 15, qy + 120)) {
    hoveredElement = 'mods-no';
    cursor(HAND);
    return;
  }

  // Check maximum freedom button
  let btnY = py + 320;
  let btnW = leftPanelWidth - 20;
  let btnH = 40;

  if (mouseX >= px + 10 && mouseX <= px + 10 + btnW &&
      mouseY >= btnY && mouseY <= btnY + btnH) {
    hoveredElement = 'max-freedom';
    cursor(HAND);
    return;
  }

  // Check reset button
  let resetBtnW = 80;
  let resetBtnH = 32;
  let resetBtnX = canvasWidth / 2 - resetBtnW / 2;
  let resetBtnY = drawHeight + (controlHeight - resetBtnH) / 2;

  if (mouseX >= resetBtnX && mouseX <= resetBtnX + resetBtnW &&
      mouseY >= resetBtnY && mouseY <= resetBtnY + resetBtnH) {
    hoveredElement = 'reset';
    cursor(HAND);
    return;
  }

  // Check license link
  let license = getSelectedLicense();
  if (license) {
    let panelX = panelMargin;
    let panelW = canvasWidth - panelMargin * 2;
    let leftSectionWidth = panelW * 0.4;
    let rightSectionX = panelX + leftSectionWidth;
    let contentY = topRowHeight + rowGap + 55;
    let linkY = contentY + 85;
    let linkX = rightSectionX + 10;
    let linkW = 120;

    if (mouseX >= linkX && mouseX <= linkX + linkW &&
        mouseY >= linkY && mouseY <= linkY + 20) {
      cursor(HAND);
      return;
    }
  }
}

function isHoverOnRadio(rx, ry) {
  let size = 20;
  return mouseX >= rx && mouseX <= rx + size + 160 &&
         mouseY >= ry && mouseY <= ry + size;
}

function resetAll() {
  commercialChoice = null;
  modificationsChoice = null;
  isCC0 = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(600, container.offsetWidth);

    // Recalculate panel widths for two-column top row
    let totalMargin = panelMargin * 3;
    let availableWidth = canvasWidth - totalMargin;

    // Left panel (Questions) takes 35%, right panel (Decision Path) takes rest
    leftPanelWidth = Math.floor(availableWidth * 0.35);
  }
}
