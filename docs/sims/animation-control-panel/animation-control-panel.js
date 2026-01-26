// Animation Control Interface Design
// Demonstrates essential animation controls for educational content

let canvasWidth = 850;
const drawHeight = 370;
const controlHeight = 80;

let animationTime = 0;
let isPlaying = false;
let playbackSpeed = 1.0;
let loopEnabled = true;
const maxTime = 4; // seconds for one cycle

let hoveredControl = '';

const controls = [
  { id: 'play', x: 0, label: 'Play/Pause', desc: 'Control animation state' },
  { id: 'restart', x: 50, label: 'Restart', desc: 'Return to beginning' },
  { id: 'stepBack', x: 100, label: 'Step Back', desc: 'Rewind one frame' },
  { id: 'stepForward', x: 150, label: 'Step Forward', desc: 'Advance one frame' }
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
  text('Animation Control Interface', canvasWidth / 2, 20);
  textStyle(NORMAL);

  // Update animation
  if (isPlaying) {
    animationTime += (deltaTime / 1000) * playbackSpeed;
    if (animationTime >= maxTime) {
      if (loopEnabled) {
        animationTime = animationTime % maxTime;
      } else {
        animationTime = maxTime;
        isPlaying = false;
      }
    }
  }

  drawAnimationArea();
  drawTransportControls();
  drawScrubber();
  drawSpeedControl();
  drawCallouts();
  drawBottomControls();
}

function drawAnimationArea() {
  let areaX = 50;
  let areaY = 50;
  let areaW = canvasWidth - 100;
  let areaH = 150;

  // Animation frame
  fill(30, 30, 40);
  stroke(100);
  strokeWeight(2);
  rect(areaX, areaY, areaW, areaH, 5);

  // Draw pendulum animation
  let pendulumX = areaX + areaW / 2;
  let pendulumPivot = areaY + 20;
  let pendulumLen = 100;
  let angle = sin(animationTime * PI) * 0.5;

  let bobX = pendulumX + sin(angle) * pendulumLen;
  let bobY = pendulumPivot + cos(angle) * pendulumLen;

  // Pivot
  stroke(150);
  strokeWeight(3);
  fill(100);
  ellipse(pendulumX, pendulumPivot, 10, 10);

  // String
  stroke(200);
  strokeWeight(2);
  line(pendulumX, pendulumPivot, bobX, bobY);

  // Bob
  fill(100, 180, 255);
  noStroke();
  ellipse(bobX, bobY, 30, 30);

  // Label
  fill(150);
  textSize(10);
  text('Sample Animation', areaX + areaW / 2, areaY + areaH - 10);
}

function drawTransportControls() {
  let baseX = 50;
  let baseY = 220;

  // Control bar background
  fill(50);
  stroke(80);
  strokeWeight(1);
  rect(baseX, baseY, 220, 40, 5);

  // Play/Pause button
  let btnSize = 32;
  let btnY = baseY + 4;

  for (let i = 0; i < 4; i++) {
    let ctrl = controls[i];
    let btnX = baseX + 8 + ctrl.x;
    let isHovered = hoveredControl === ctrl.id;

    fill(isHovered ? color(80, 80, 90) : color(60, 60, 70));
    noStroke();
    rect(btnX, btnY, 40, btnSize, 4);

    fill(200);
    textSize(16);

    if (ctrl.id === 'play') {
      text(isPlaying ? '⏸' : '▶', btnX + 20, btnY + btnSize / 2);
    } else if (ctrl.id === 'restart') {
      text('⟲', btnX + 20, btnY + btnSize / 2);
    } else if (ctrl.id === 'stepBack') {
      text('|◀', btnX + 20, btnY + btnSize / 2);
    } else if (ctrl.id === 'stepForward') {
      text('▶|', btnX + 20, btnY + btnSize / 2);
    }
  }

  // Time display
  fill(200);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text(nf(animationTime, 1, 1) + 's / ' + maxTime + '.0s', baseX + 210, baseY + 20);
  textAlign(CENTER, CENTER);
}

function drawScrubber() {
  let scrubX = 290;
  let scrubY = 225;
  let scrubW = canvasWidth - 340;
  let scrubH = 30;

  // Track background
  fill(80);
  noStroke();
  rect(scrubX, scrubY, scrubW, 8, 4);

  // Played portion
  let progress = animationTime / maxTime;
  fill(100, 180, 255);
  rect(scrubX, scrubY, scrubW * progress, 8, 4);

  // Scrubber handle
  let handleX = scrubX + scrubW * progress;
  fill(255);
  stroke(100, 180, 255);
  strokeWeight(2);
  ellipse(handleX, scrubY + 4, 16, 16);

  // Label
  fill(100);
  textSize(10);
  noStroke();
  text('Scrubber: Jump to any point', scrubX + scrubW / 2, scrubY + 22);
}

function drawSpeedControl() {
  let speedX = 290;
  let speedY = 270;

  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Speed:', speedX, speedY);

  // Speed slider track
  let trackX = speedX + 50;
  let trackW = 150;

  fill(100);
  noStroke();
  rect(trackX, speedY - 4, trackW, 8, 3);

  // Speed position
  let speedPos = map(playbackSpeed, 0.25, 2, 0, trackW);
  fill(46, 204, 113);
  rect(trackX, speedY - 4, speedPos, 8, 3);

  // Handle
  fill(255);
  stroke(46, 204, 113);
  strokeWeight(2);
  ellipse(trackX + speedPos, speedY, 14, 14);

  // Speed value
  fill(80);
  noStroke();
  textAlign(LEFT, CENTER);
  text(nf(playbackSpeed, 1, 2) + 'x', trackX + trackW + 15, speedY);

  // Loop toggle
  let loopX = trackX + trackW + 70;
  fill(loopEnabled ? color(100, 180, 255) : color(150));
  rect(loopX, speedY - 10, 70, 20, 4);

  fill(255);
  textSize(10);
  textAlign(CENTER, CENTER);
  text('Loop: ' + (loopEnabled ? 'ON' : 'OFF'), loopX + 35, speedY);
}

function drawCallouts() {
  let calloutY = 310;

  // Callout for hovered control
  if (hoveredControl) {
    let ctrl = controls.find(c => c.id === hoveredControl);
    if (ctrl) {
      fill(255, 250, 240);
      stroke(255, 200, 100);
      strokeWeight(1);
      rect(50, calloutY, 250, 40, 5);

      fill(200, 120, 50);
      textSize(12);
      textStyle(BOLD);
      textAlign(LEFT, CENTER);
      text(ctrl.label + ':', 60, calloutY + 12);
      textStyle(NORMAL);

      fill(80);
      textSize(11);
      text(ctrl.desc, 60, calloutY + 28);

      textAlign(CENTER, CENTER);
    }
  } else {
    // Default instruction
    fill(150);
    textSize(11);
    text('Hover over controls to see their purpose', canvasWidth / 2, calloutY + 20);
  }
}

function drawBottomControls() {
  let y = drawHeight + 40;

  // Instructions
  fill(80);
  textSize(11);
  text('Click controls to interact • Drag scrubber • Adjust speed', canvasWidth / 2, y);

  // Try it prompt
  fill(100, 149, 237);
  textSize(12);
  textStyle(BOLD);
  text('Try the controls!', canvasWidth / 2, y + 25);
  textStyle(NORMAL);
}

function mousePressed() {
  // Transport controls
  let baseX = 50;
  let baseY = 220;
  let btnY = baseY + 4;

  // Play/Pause
  if (mouseX > baseX + 8 && mouseX < baseX + 48 && mouseY > btnY && mouseY < btnY + 32) {
    isPlaying = !isPlaying;
  }

  // Restart
  if (mouseX > baseX + 58 && mouseX < baseX + 98 && mouseY > btnY && mouseY < btnY + 32) {
    animationTime = 0;
    isPlaying = false;
  }

  // Step back
  if (mouseX > baseX + 108 && mouseX < baseX + 148 && mouseY > btnY && mouseY < btnY + 32) {
    animationTime = max(0, animationTime - 0.1);
    isPlaying = false;
  }

  // Step forward
  if (mouseX > baseX + 158 && mouseX < baseX + 198 && mouseY > btnY && mouseY < btnY + 32) {
    animationTime = min(maxTime, animationTime + 0.1);
    isPlaying = false;
  }

  // Scrubber click
  let scrubX = 290;
  let scrubY = 225;
  let scrubW = canvasWidth - 340;
  if (mouseX > scrubX && mouseX < scrubX + scrubW && mouseY > scrubY - 10 && mouseY < scrubY + 20) {
    animationTime = map(mouseX, scrubX, scrubX + scrubW, 0, maxTime);
    animationTime = constrain(animationTime, 0, maxTime);
  }

  // Loop toggle
  let loopX = 290 + 50 + 150 + 70;
  if (mouseX > loopX && mouseX < loopX + 70 && mouseY > 260 && mouseY < 280) {
    loopEnabled = !loopEnabled;
  }
}

function mouseDragged() {
  // Scrubber drag
  let scrubX = 290;
  let scrubW = canvasWidth - 340;
  if (mouseX > scrubX - 20 && mouseX < scrubX + scrubW + 20 && mouseY > 210 && mouseY < 260) {
    animationTime = map(mouseX, scrubX, scrubX + scrubW, 0, maxTime);
    animationTime = constrain(animationTime, 0, maxTime);
  }

  // Speed slider drag
  let speedTrackX = 340;
  let speedTrackW = 150;
  if (mouseX > speedTrackX - 10 && mouseX < speedTrackX + speedTrackW + 10 && mouseY > 255 && mouseY < 285) {
    playbackSpeed = map(mouseX, speedTrackX, speedTrackX + speedTrackW, 0.25, 2);
    playbackSpeed = constrain(playbackSpeed, 0.25, 2);
  }
}

function mouseMoved() {
  hoveredControl = '';

  let baseX = 50;
  let baseY = 220;
  let btnY = baseY + 4;

  for (let i = 0; i < controls.length; i++) {
    let ctrl = controls[i];
    let btnX = baseX + 8 + ctrl.x;
    if (mouseX > btnX && mouseX < btnX + 40 && mouseY > btnY && mouseY < btnY + 32) {
      hoveredControl = ctrl.id;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, drawHeight + controlHeight);
}
