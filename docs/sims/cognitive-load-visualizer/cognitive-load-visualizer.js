// Cognitive Load Balance Visualizer
// Understand how three types of cognitive load compete for limited working memory

let canvasWidth = 850;
const drawHeight = 420;
const controlHeight = 80;

let intrinsicLoad = 3;
let extraneousLoad = 2;
const maxCapacity = 10;

let liquidLevel = { intrinsic: 0, extraneous: 0, germane: 0 };
let overflow = 0;
let lightbulbBrightness = 1;

const presets = [
  { name: 'Well-designed Simple', intrinsic: 2, extraneous: 1 },
  { name: 'Well-designed Complex', intrinsic: 6, extraneous: 1 },
  { name: 'Poorly-designed Simple', intrinsic: 2, extraneous: 5 },
  { name: 'Overload!', intrinsic: 7, extraneous: 5 }
];

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

  // Control area background
  fill(240);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill(50);
  textSize(16);
  textStyle(BOLD);
  text('Cognitive Load Balance Visualizer', canvasWidth / 2, 20);
  textStyle(NORMAL);

  // Calculate loads
  let totalLoad = intrinsicLoad + extraneousLoad;
  let germaneLoad = max(0, maxCapacity - totalLoad);
  let isOverloaded = totalLoad >= maxCapacity;

  // Animate liquid levels
  liquidLevel.intrinsic = lerp(liquidLevel.intrinsic, intrinsicLoad, 0.1);
  liquidLevel.extraneous = lerp(liquidLevel.extraneous, extraneousLoad, 0.1);
  liquidLevel.germane = lerp(liquidLevel.germane, germaneLoad, 0.1);

  // Animate lightbulb
  let targetBrightness = isOverloaded ? 0.1 : germaneLoad / maxCapacity;
  lightbulbBrightness = lerp(lightbulbBrightness, targetBrightness, 0.05);

  drawBeaker();
  drawLightbulb();
  drawStats();
  drawControls();
}

function drawBeaker() {
  let beakerX = canvasWidth * 0.15;
  let beakerY = 60;
  let beakerW = canvasWidth * 0.35;
  let beakerH = 300;

  // Beaker outline
  stroke(150);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(beakerX, beakerY);
  vertex(beakerX, beakerY + beakerH);
  vertex(beakerX + beakerW, beakerY + beakerH);
  vertex(beakerX + beakerW, beakerY);
  endShape();

  // Capacity markers
  textSize(10);
  fill(100);
  noStroke();
  for (let i = 0; i <= 10; i += 2) {
    let y = beakerY + beakerH - (i / 10) * beakerH;
    stroke(150);
    strokeWeight(1);
    line(beakerX - 5, y, beakerX, y);
    noStroke();
    textAlign(RIGHT, CENTER);
    text(i, beakerX - 10, y);
  }
  textAlign(CENTER, CENTER);

  // Draw liquids (bottom to top: intrinsic, extraneous, germane)
  let totalHeight = beakerH;
  let intrinsicH = (liquidLevel.intrinsic / maxCapacity) * totalHeight;
  let extraneousH = (liquidLevel.extraneous / maxCapacity) * totalHeight;
  let germaneH = (liquidLevel.germane / maxCapacity) * totalHeight;

  noStroke();

  // Intrinsic (blue) - bottom
  fill(52, 152, 219, 200);
  rect(beakerX + 3, beakerY + beakerH - intrinsicH, beakerW - 6, intrinsicH);

  // Extraneous (red) - middle
  fill(231, 76, 60, 200);
  rect(beakerX + 3, beakerY + beakerH - intrinsicH - extraneousH, beakerW - 6, extraneousH);

  // Germane (green) - top
  if (germaneH > 0) {
    fill(39, 174, 96, 200);
    rect(beakerX + 3, beakerY + beakerH - intrinsicH - extraneousH - germaneH, beakerW - 6, germaneH);
  }

  // Overflow effect
  if (intrinsicLoad + extraneousLoad > maxCapacity) {
    overflow = min(overflow + 0.02, 1);
    fill(231, 76, 60, 150);
    for (let i = 0; i < 5; i++) {
      let dropX = beakerX + beakerW + 10 + sin(frameCount * 0.1 + i) * 5;
      let dropY = beakerY + (frameCount * 2 + i * 30) % beakerH;
      ellipse(dropX, dropY, 8, 12);
    }

    // Warning text
    fill(231, 76, 60);
    textSize(14);
    textStyle(BOLD);
    text('⚠️ OVERLOAD!', beakerX + beakerW / 2, beakerY - 15);
    textStyle(NORMAL);
  } else {
    overflow = max(overflow - 0.02, 0);
  }

  // Legend
  let legendX = beakerX;
  let legendY = beakerY + beakerH + 20;
  textSize(11);
  textAlign(LEFT, CENTER);

  fill(52, 152, 219);
  rect(legendX, legendY, 15, 15);
  fill(50);
  text('Intrinsic (concept complexity)', legendX + 20, legendY + 7);

  fill(231, 76, 60);
  rect(legendX, legendY + 20, 15, 15);
  fill(50);
  text('Extraneous (design waste)', legendX + 20, legendY + 27);

  fill(39, 174, 96);
  rect(legendX, legendY + 40, 15, 15);
  fill(50);
  text('Germane (actual learning)', legendX + 20, legendY + 47);

  textAlign(CENTER, CENTER);
}

function drawLightbulb() {
  let bulbX = canvasWidth * 0.62;
  let bulbY = 150;
  let bulbSize = 80;

  // Glow effect
  if (lightbulbBrightness > 0.2) {
    noStroke();
    for (let i = 5; i > 0; i--) {
      fill(255, 220, 100, lightbulbBrightness * 30 * (6 - i));
      ellipse(bulbX, bulbY, bulbSize + i * 20, bulbSize + i * 20);
    }
  }

  // Bulb
  fill(lerpColor(color(100), color(255, 220, 100), lightbulbBrightness));
  stroke(150);
  strokeWeight(2);
  ellipse(bulbX, bulbY, bulbSize, bulbSize);

  // Base
  fill(180);
  rect(bulbX - 15, bulbY + bulbSize / 2 - 5, 30, 25, 0, 0, 5, 5);

  // Lines inside
  stroke(200);
  strokeWeight(1);
  line(bulbX - 10, bulbY + bulbSize / 2, bulbX - 10, bulbY + bulbSize / 2 + 20);
  line(bulbX + 10, bulbY + bulbSize / 2, bulbX + 10, bulbY + bulbSize / 2 + 20);

  // Label
  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Learning', bulbX, bulbY + 70);
  text('Effectiveness', bulbX, bulbY + 85);
  textStyle(NORMAL);

  // Percentage
  let effectiveness = lightbulbBrightness * 100;
  textSize(24);
  fill(effectiveness > 50 ? color(39, 174, 96) : effectiveness > 20 ? color(241, 196, 15) : color(231, 76, 60));
  text(nf(effectiveness, 1, 0) + '%', bulbX, bulbY + 115);
}

function drawStats() {
  let statsX = canvasWidth * 0.75;
  let statsY = 60;

  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(statsX - 5, statsY, canvasWidth * 0.22, 160, 8);

  fill(50);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  text('Load Analysis', statsX + canvasWidth * 0.11 - 5, statsY + 20);
  textStyle(NORMAL);

  textAlign(LEFT, CENTER);
  textSize(11);

  let totalLoad = intrinsicLoad + extraneousLoad;
  let germane = max(0, maxCapacity - totalLoad);

  let y = statsY + 45;
  fill(52, 152, 219);
  text('Intrinsic: ' + intrinsicLoad.toFixed(1), statsX + 5, y);

  y += 22;
  fill(231, 76, 60);
  text('Extraneous: ' + extraneousLoad.toFixed(1), statsX + 5, y);

  y += 22;
  fill(39, 174, 96);
  text('Germane: ' + germane.toFixed(1), statsX + 5, y);

  y += 22;
  fill(50);
  text('Total Load: ' + totalLoad.toFixed(1) + ' / ' + maxCapacity, statsX + 5, y);

  y += 22;
  let status = totalLoad < 7 ? 'Optimal' : totalLoad < 9 ? 'Caution' : 'Overloaded';
  let statusColor = totalLoad < 7 ? color(39, 174, 96) : totalLoad < 9 ? color(241, 196, 15) : color(231, 76, 60);
  fill(statusColor);
  text('Status: ' + status, statsX + 5, y);

  textAlign(CENTER, CENTER);
}

function drawControls() {
  let y = drawHeight + 25;

  // Sliders labels
  fill(50);
  textSize(11);

  // Concept Complexity slider
  text('Concept Complexity', 100, y - 8);
  drawSlider(30, y, 140, intrinsicLoad, 1, 8, color(52, 152, 219));

  // Interface Confusion slider
  text('Interface Confusion', 300, y - 8);
  drawSlider(230, y, 140, extraneousLoad, 0, 8, color(231, 76, 60));

  // Preset buttons
  textSize(10);
  text('Presets:', 430, y - 8);

  for (let i = 0; i < presets.length; i++) {
    let btnX = 400 + i * 100;
    let isHovered = mouseX > btnX && mouseX < btnX + 95 && mouseY > y && mouseY < y + 28;

    fill(isHovered ? color(70, 130, 180) : color(100, 149, 237));
    noStroke();
    rect(btnX, y, 95, 28, 5);

    fill(255);
    textSize(9);
    text(presets[i].name, btnX + 47, y + 14);
  }
}

function drawSlider(x, y, w, value, minVal, maxVal, col) {
  // Track
  stroke(200);
  strokeWeight(4);
  line(x, y + 14, x + w, y + 14);

  // Filled portion
  let fillW = map(value, minVal, maxVal, 0, w);
  stroke(col);
  line(x, y + 14, x + fillW, y + 14);

  // Handle
  fill(col);
  noStroke();
  ellipse(x + fillW, y + 14, 16, 16);

  // Value label
  fill(50);
  textSize(10);
  text(value.toFixed(1), x + w + 20, y + 14);
}

function mousePressed() {
  let y = drawHeight + 25;

  // Check slider interactions
  if (mouseY > y && mouseY < y + 30) {
    if (mouseX > 30 && mouseX < 170) {
      intrinsicLoad = map(constrain(mouseX, 30, 170), 30, 170, 1, 8);
    }
    if (mouseX > 230 && mouseX < 370) {
      extraneousLoad = map(constrain(mouseX, 230, 370), 230, 370, 0, 8);
    }
  }

  // Check preset buttons
  for (let i = 0; i < presets.length; i++) {
    let btnX = 400 + i * 100;
    if (mouseX > btnX && mouseX < btnX + 95 && mouseY > y && mouseY < y + 28) {
      intrinsicLoad = presets[i].intrinsic;
      extraneousLoad = presets[i].extraneous;
    }
  }
}

function mouseDragged() {
  let y = drawHeight + 25;

  if (mouseY > y && mouseY < y + 30) {
    if (mouseX > 25 && mouseX < 175) {
      intrinsicLoad = map(constrain(mouseX, 30, 170), 30, 170, 1, 8);
    }
    if (mouseX > 225 && mouseX < 375) {
      extraneousLoad = map(constrain(mouseX, 230, 370), 230, 370, 0, 8);
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
