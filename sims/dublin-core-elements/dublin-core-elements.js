// Dublin Core Elements Infographic
// Interactive visualization of the 15 Dublin Core metadata elements
// organized into three categories: Content, Intellectual Property, and Instantiation
// MicroSim template version 2026.02

// Canvas dimensions - responsive width
let containerWidth;
let canvasWidth = 800;
let drawHeight = 480;
let controlHeight = 0; // No controls needed - interaction via hover/click
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 15;
let columnGap = 10;
let headerHeight = 45;
let cardHeight = 52;
let cardPadding = 6;
let cardCornerRadius = 8;
let defaultTextSize = 14;

// Animation state
let mouseOverCanvas = false;
let pulsePhase = 0;
let selectedElement = null;
let hoveredElement = null;

// Category colors
const categoryColors = {
  content: { base: [70, 130, 180], hover: [100, 160, 210], light: [230, 240, 250] },
  ip: { base: [60, 140, 80], hover: [90, 170, 110], light: [230, 250, 235] },
  instantiation: { base: [200, 120, 50], hover: [230, 150, 80], light: [255, 245, 230] }
};

// Dublin Core elements data
const dublinCoreElements = [
  // Content category (7 elements)
  {
    name: "Title",
    category: "content",
    definition: "The name given to the resource",
    example: "Pendulum Period Explorer",
    extended: "A title is a word or phrase that identifies the resource. Typically, this is the name by which the resource is formally known. Multiple titles may exist (e.g., translations).",
    required: true,
    usage: "high"
  },
  {
    name: "Subject",
    category: "content",
    definition: "The topic or keywords describing the resource",
    example: "Physics, Harmonic Motion, Oscillation",
    extended: "Subject is typically expressed as keywords, phrases, or classification codes. Best practice is to use a controlled vocabulary such as Library of Congress Subject Headings.",
    required: true,
    usage: "high"
  },
  {
    name: "Description",
    category: "content",
    definition: "A summary or account of the resource content",
    example: "Interactive simulation showing how pendulum length affects period",
    extended: "Description may include an abstract, table of contents, graphical representation, or free-text account of the resource. Provides more detail than Title alone.",
    required: true,
    usage: "high"
  },
  {
    name: "Type",
    category: "content",
    definition: "The nature or genre of the resource",
    example: "Interactive Simulation",
    extended: "Type describes the nature of the resource using the DCMI Type Vocabulary: Collection, Dataset, Event, Image, Interactive Resource, Moving Image, Physical Object, Service, Software, Sound, Still Image, Text.",
    required: false,
    usage: "medium"
  },
  {
    name: "Source",
    category: "content",
    definition: "A related resource from which this is derived",
    example: "Based on PhET Pendulum Lab",
    extended: "Source captures derivation relationships. The described resource may be derived from the Source in whole or in part. Best practice is to use a URI or formal citation.",
    required: false,
    usage: "low"
  },
  {
    name: "Relation",
    category: "content",
    definition: "A related resource or reference",
    example: "Part of Physics MicroSim Collection",
    extended: "Relation describes relationships to other resources. Refinements include: isPartOf, hasPart, isVersionOf, hasVersion, isFormatOf, hasFormat, references, isReferencedBy, isBasedOn, isBasisFor, requires, isRequiredBy.",
    required: false,
    usage: "low"
  },
  {
    name: "Coverage",
    category: "content",
    definition: "Spatial or temporal scope of the resource",
    example: "Classical mechanics era (1687-1900)",
    extended: "Coverage includes spatial location (place name or coordinates), temporal period (date range or named period), or jurisdiction. Use controlled vocabularies where possible.",
    required: false,
    usage: "low"
  },

  // Intellectual Property category (4 elements)
  {
    name: "Creator",
    category: "ip",
    definition: "The entity primarily responsible for making the resource",
    example: "Dr. Maria Santos",
    extended: "Creator is the person, organization, or service primarily responsible for making the resource content. If multiple creators, list in order of importance or contribution.",
    required: true,
    usage: "high"
  },
  {
    name: "Publisher",
    category: "ip",
    definition: "The entity responsible for making the resource available",
    example: "OpenEd Simulations",
    extended: "Publisher is the entity (person, organization, service) making the resource available. This is typically the hosting organization or distribution platform.",
    required: false,
    usage: "medium"
  },
  {
    name: "Contributor",
    category: "ip",
    definition: "An entity responsible for contributing to the resource",
    example: "Reviewed by Physics Dept.",
    extended: "Contributor includes entities who made contributions beyond the primary Creator. May include editors, translators, illustrators, reviewers, or funding agencies.",
    required: false,
    usage: "low"
  },
  {
    name: "Rights",
    category: "ip",
    definition: "Information about rights held over the resource",
    example: "CC BY-NC-SA 4.0",
    extended: "Rights typically contains a rights statement or reference to a license. Best practice is to use a standard license identifier (Creative Commons, MIT, etc.) or URI to a rights statement.",
    required: true,
    usage: "high"
  },

  // Instantiation category (4 elements)
  {
    name: "Date",
    category: "instantiation",
    definition: "A date associated with the resource lifecycle",
    example: "2026-01-15",
    extended: "Date is typically the creation or publication date. Refinements include: created, valid, available, issued, modified, dateAccepted, dateCopyrighted, dateSubmitted. Use ISO 8601 format.",
    required: true,
    usage: "high"
  },
  {
    name: "Format",
    category: "instantiation",
    definition: "The file format or physical medium",
    example: "text/html",
    extended: "Format describes the media type, dimensions, or duration of the resource. For digital resources, use MIME types (e.g., text/html, application/pdf). May also describe physical extent.",
    required: false,
    usage: "medium"
  },
  {
    name: "Identifier",
    category: "instantiation",
    definition: "An unambiguous reference to the resource",
    example: "https://example.com/sims/pendulum",
    extended: "Identifier is a unique reference within a given context. Best practice is to use formal identification systems: URI, URL, DOI, ISBN, ISSN. This enables linking and citation.",
    required: true,
    usage: "high"
  },
  {
    name: "Language",
    category: "instantiation",
    definition: "The language of the resource content",
    example: "en-US",
    extended: "Language uses ISO 639 codes (en, es, fr) or RFC 4646 tags (en-US, zh-Hans). Multiple languages may be specified. Refers to the intellectual content, not the interface.",
    required: false,
    usage: "medium"
  }
];

// Pre-calculate element positions
let elementPositions = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  // Track mouse for animation
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  textSize(defaultTextSize);

  describe('Interactive Dublin Core metadata elements infographic showing 15 elements organized into Content, Intellectual Property, and Instantiation categories. Hover over elements to see definitions and examples.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Update animation
  if (mouseOverCanvas) {
    pulsePhase += 0.05;
  }

  // Calculate column layout
  let columnWidth = (canvasWidth - 2 * margin - 2 * columnGap) / 3;
  let columns = {
    content: { x: margin, width: columnWidth, elements: [] },
    ip: { x: margin + columnWidth + columnGap, width: columnWidth, elements: [] },
    instantiation: { x: margin + 2 * (columnWidth + columnGap), width: columnWidth, elements: [] }
  };

  // Group elements by category
  for (let elem of dublinCoreElements) {
    if (elem.category === 'content') columns.content.elements.push(elem);
    else if (elem.category === 'ip') columns.ip.elements.push(elem);
    else columns.instantiation.elements.push(elem);
  }

  // Reset positions array
  elementPositions = [];

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Dublin Core Metadata Elements', canvasWidth / 2, 10);

  // Draw subtitle
  textSize(12);
  fill(100);
  text('15 elements organized into 3 categories - Hover for details, Click for extended description', canvasWidth / 2, 36);

  // Draw columns
  let startY = 58;

  drawColumn(columns.content, 'Content', 'content', startY, categoryColors.content);
  drawColumn(columns.ip, 'Intellectual Property', 'ip', startY, categoryColors.ip);
  drawColumn(columns.instantiation, 'Instantiation', 'instantiation', startY, categoryColors.instantiation);

  // Draw info panel if element is hovered or selected
  let displayElement = selectedElement || hoveredElement;
  if (displayElement) {
    drawInfoPanel(displayElement);
  }
}

function drawColumn(col, title, category, startY, colors) {
  let x = col.x;
  let w = col.width;

  // Draw column header
  fill(colors.base[0], colors.base[1], colors.base[2]);
  noStroke();
  rect(x, startY, w, headerHeight, cardCornerRadius, cardCornerRadius, 0, 0);

  // Header text
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  noStroke();
  text(title, x + w/2, startY + headerHeight/2);

  // Draw element count
  textSize(11);
  fill(255, 255, 255, 180);
  text('(' + col.elements.length + ' elements)', x + w/2, startY + headerHeight/2 + 14);

  // Draw cards for each element
  let cardY = startY + headerHeight + cardPadding;

  for (let elem of col.elements) {
    let isHovered = hoveredElement === elem;
    let isSelected = selectedElement === elem;

    // Calculate usage-based opacity
    let usageAlpha = elem.usage === 'high' ? 255 : (elem.usage === 'medium' ? 210 : 170);

    // Card background with hover effect
    let cardW = w - cardPadding * 2;
    let cardX = x + cardPadding;

    // Store position for hit detection
    elementPositions.push({
      element: elem,
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardHeight - cardPadding
    });

    // Draw shadow when hovered
    if (isHovered || isSelected) {
      fill(0, 0, 0, 30);
      noStroke();
      rect(cardX + 3, cardY + 3, cardW, cardHeight - cardPadding, cardCornerRadius);
    }

    // Card background
    if (isSelected) {
      fill(colors.hover[0], colors.hover[1], colors.hover[2]);
    } else if (isHovered) {
      let pulse = sin(pulsePhase * 2) * 0.3 + 0.7;
      fill(lerpColor(
        color(colors.light[0], colors.light[1], colors.light[2]),
        color(colors.hover[0], colors.hover[1], colors.hover[2], 100),
        pulse
      ));
    } else {
      fill(colors.light[0], colors.light[1], colors.light[2], usageAlpha);
    }

    stroke(colors.base[0], colors.base[1], colors.base[2], 100);
    strokeWeight(1);
    rect(cardX, cardY, cardW, cardHeight - cardPadding, cardCornerRadius);

    // Element name
    fill(isSelected ? 255 : 50);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);
    text(elem.name, cardX + 10, cardY + (cardHeight - cardPadding) / 2 - 6);

    // Required badge
    if (elem.required) {
      fill(isSelected ? 255 : colors.base[0], isSelected ? 255 : colors.base[1], isSelected ? 255 : colors.base[2]);
      textSize(9);
      textAlign(RIGHT, CENTER);
      text('REQUIRED', cardX + cardW - 8, cardY + (cardHeight - cardPadding) / 2 - 6);
    }

    // Brief definition
    fill(isSelected ? 230 : 100);
    textSize(10);
    textAlign(LEFT, CENTER);
    let defText = elem.definition;
    if (textWidth(defText) > cardW - 20) {
      defText = defText.substring(0, 35) + '...';
    }
    text(defText, cardX + 10, cardY + (cardHeight - cardPadding) / 2 + 10);

    cardY += cardHeight;
  }
}

function drawInfoPanel(elem) {
  let panelWidth = 280;
  // Position panel on left side for right column (instantiation) elements
  // to avoid covering the element being viewed
  let panelX = (elem.category === 'instantiation') ? margin : (canvasWidth - panelWidth - margin);
  let panelY = 58;
  let panelHeight = selectedElement ? 310 : 180;

  // Get category colors
  let colors = categoryColors[elem.category];

  // Panel shadow
  fill(0, 0, 0, 20);
  noStroke();
  rect(panelX + 4, panelY + 4, panelWidth, panelHeight, 10);

  // Panel background
  fill(255, 255, 255, 245);
  stroke(colors.base[0], colors.base[1], colors.base[2]);
  strokeWeight(2);
  rect(panelX, panelY, panelWidth, panelHeight, 10);

  // Header bar
  fill(colors.base[0], colors.base[1], colors.base[2]);
  noStroke();
  rect(panelX, panelY, panelWidth, 35, 10, 10, 0, 0);

  // Element name in header
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);
  noStroke();
  text(elem.name, panelX + 15, panelY + 17);

  // Required badge in header
  if (elem.required) {
    fill(255, 255, 255, 200);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text('REQUIRED', panelX + panelWidth - 15, panelY + 17);
  }

  let textY = panelY + 50;
  let lineHeight = 18;

  // Definition
  fill(80);
  textAlign(LEFT, TOP);
  textSize(12);
  noStroke();
  text('Definition:', panelX + 15, textY);
  textY += lineHeight;

  fill(40);
  textSize(11);
  let defLines = wrapText(elem.definition, panelWidth - 30);
  for (let line of defLines) {
    text(line, panelX + 15, textY);
    textY += 14;
  }
  textY += 8;

  // Example
  fill(80);
  textSize(12);
  text('MicroSim Example:', panelX + 15, textY);
  textY += lineHeight;

  fill(colors.base[0], colors.base[1], colors.base[2]);
  textSize(11);
  let exLines = wrapText(elem.example, panelWidth - 30);
  for (let line of exLines) {
    text(line, panelX + 15, textY);
    textY += 14;
  }
  textY += 8;

  // Usage frequency
  fill(80);
  textSize(12);
  text('Usage in MicroSims:', panelX + 15, textY);

  // Usage indicator
  let usageX = panelX + 130;
  let usageText = elem.usage === 'high' ? 'Common' : (elem.usage === 'medium' ? 'Moderate' : 'Rare');
  let usageColor = elem.usage === 'high' ? [60, 140, 80] : (elem.usage === 'medium' ? [200, 150, 50] : [150, 150, 150]);
  fill(usageColor[0], usageColor[1], usageColor[2]);
  textSize(11);
  text(usageText, usageX, textY);
  textY += lineHeight + 5;

  // Extended description (only when selected)
  if (selectedElement) {
    // Divider line
    stroke(200);
    strokeWeight(1);
    line(panelX + 15, textY, panelX + panelWidth - 15, textY);
    textY += 12;

    fill(80);
    noStroke();
    textSize(12);
    text('Extended Description:', panelX + 15, textY);
    textY += lineHeight;

    fill(60);
    textSize(10);
    let extLines = wrapText(elem.extended, panelWidth - 30);
    for (let i = 0; i < min(extLines.length, 7); i++) {
      text(extLines[i], panelX + 15, textY);
      textY += 13;
    }

    // Click hint
    textY = panelY + panelHeight - 18;
    fill(150);
    textSize(9);
    textAlign(CENTER, CENTER);
    text('Click elsewhere to close', panelX + panelWidth/2, textY);
  } else {
    // Click hint
    fill(150);
    textSize(9);
    textAlign(CENTER, CENTER);
    text('Click for extended description', panelX + panelWidth/2, panelY + panelHeight - 15);
  }
}

function wrapText(txt, maxWidth) {
  let words = txt.split(' ');
  let lines = [];
  let currentLine = '';

  for (let word of words) {
    let testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (textWidth(testLine) > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

function mouseMoved() {
  hoveredElement = null;

  for (let pos of elementPositions) {
    if (mouseX >= pos.x && mouseX <= pos.x + pos.w &&
        mouseY >= pos.y && mouseY <= pos.y + pos.h) {
      hoveredElement = pos.element;
      cursor(HAND);
      return;
    }
  }

  cursor(ARROW);
}

function mousePressed() {
  // Check if clicking on an element
  for (let pos of elementPositions) {
    if (mouseX >= pos.x && mouseX <= pos.x + pos.w &&
        mouseY >= pos.y && mouseY <= pos.y + pos.h) {
      if (selectedElement === pos.element) {
        selectedElement = null; // Toggle off
      } else {
        selectedElement = pos.element; // Select new
      }
      return;
    }
  }

  // Clicking elsewhere deselects
  selectedElement = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
