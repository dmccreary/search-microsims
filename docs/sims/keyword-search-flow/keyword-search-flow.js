// Keywords to Search Results Flow MicroSim - Step-Through Version
// Redesigned based on instructional design principles:
// - Worked examples with concrete data transformations
// - Self-paced stepping through stages
// - Predict-test-observe pedagogy support
// - Reduced extraneous cognitive load (no animation)
// MicroSim version 2.0 - 2025-01-25

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// UI elements
let queryDropdown;
let prevButton;
let nextButton;
let resetButton;

// State
let currentStage = 0;
let currentQueryIndex = 0;

// Stage definitions
const stages = [
  { id: 'query', name: 'User Query', color: [66, 133, 244] },
  { id: 'processing', name: 'Processing', color: [52, 168, 83] },
  { id: 'matching', name: 'Matching', color: [52, 168, 83] },
  { id: 'ranking', name: 'Ranking', color: [251, 188, 4] },
  { id: 'results', name: 'Results', color: [234, 67, 53] }
];

// Example queries with full transformation data at each stage
const exampleQueries = [
  {
    query: "physics ball throwing simulation",
    stages: [
      {
        title: "Stage 1: User Query",
        description: "The user enters a search query in natural language.",
        data: {
          "Raw Query": '"physics ball throwing simulation"',
          "Intent": "Find interactive physics simulations about projectile motion"
        }
      },
      {
        title: "Stage 2: Query Processing",
        description: "The query is tokenized, normalized, and synonyms are expanded.",
        data: {
          "Tokenization": '["physics", "ball", "throwing", "simulation"]',
          "Normalization": '["physics", "ball", "throw", "simul"]  (stemmed)',
          "Synonym Expansion": {
            "throwing": '→ ["throw", "projectile", "launch", "toss"]',
            "simulation": '→ ["simul", "interactive", "demo"]'
          },
          "Final Terms": '["physics", "ball", "throw", "projectile", "launch", "simul"]'
        }
      },
      {
        title: "Stage 3: Keyword Matching",
        description: "Query terms are compared against MicroSim metadata keywords.",
        data: {
          "Candidates Evaluated": "127 MicroSims in index",
          "Match Results": [
            { name: "Projectile Motion Sim", matches: ["physics", "projectile", "simul"], count: "3 exact" },
            { name: "Ball Bounce Physics", matches: ["physics", "ball"], count: "2 exact" },
            { name: "Kinematics Explorer", matches: ["physics"], synonyms: ["projectile"], count: "1 exact, 1 synonym" },
            { name: "Gravity Simulator", matches: ["physics", "simul"], count: "2 exact" }
          ]
        }
      },
      {
        title: "Stage 4: Ranking",
        description: "Match scores are calculated using weighted factors.",
        data: {
          "Scoring Rules": {
            "Exact match": "+10 points",
            "Partial match": "+5 points",
            "Synonym match": "+3 points",
            "Metadata quality": "+1-5 points",
            "Recency bonus": "+1-2 points"
          },
          "Score Calculation": [
            { name: "Projectile Motion Sim", calc: "3×10 + 5 = 35 pts", final: 35 },
            { name: "Ball Bounce Physics", calc: "2×10 + 4 = 24 pts", final: 24 },
            { name: "Gravity Simulator", calc: "2×10 + 3 = 23 pts", final: 23 },
            { name: "Kinematics Explorer", calc: "1×10 + 1×3 + 5 = 18 pts", final: 18 }
          ]
        }
      },
      {
        title: "Stage 5: Results",
        description: "Ranked list of MicroSims with scores and highlighted matches.",
        data: {
          "Ranked Results": [
            { rank: 1, name: "Projectile Motion Sim", score: 35, matches: ["physics", "projectile", "simulation"] },
            { rank: 2, name: "Ball Bounce Physics", score: 24, matches: ["physics", "ball"] },
            { rank: 3, name: "Gravity Simulator", score: 23, matches: ["physics", "simulation"] },
            { rank: 4, name: "Kinematics Explorer", score: 18, matches: ["physics", "projectile*"] }
          ],
          "Note": "* indicates synonym match"
        }
      }
    ]
  },
  {
    query: "interactive graph visualization",
    stages: [
      {
        title: "Stage 1: User Query",
        description: "The user enters a search query in natural language.",
        data: {
          "Raw Query": '"interactive graph visualization"',
          "Intent": "Find tools for visualizing graph/network data"
        }
      },
      {
        title: "Stage 2: Query Processing",
        description: "The query is tokenized, normalized, and synonyms are expanded.",
        data: {
          "Tokenization": '["interactive", "graph", "visualization"]',
          "Normalization": '["interact", "graph", "visual"]  (stemmed)',
          "Synonym Expansion": {
            "graph": '→ ["graph", "network", "chart", "diagram"]',
            "visualization": '→ ["visual", "display", "render"]'
          },
          "Final Terms": '["interact", "graph", "network", "chart", "visual"]'
        }
      },
      {
        title: "Stage 3: Keyword Matching",
        description: "Query terms are compared against MicroSim metadata keywords.",
        data: {
          "Candidates Evaluated": "127 MicroSims in index",
          "Match Results": [
            { name: "Network Graph Viewer", matches: ["graph", "network", "visual"], count: "3 exact" },
            { name: "Bar Chart Builder", matches: ["chart", "interact"], count: "1 exact, 1 synonym" },
            { name: "Force-Directed Graph", matches: ["graph", "interact"], count: "2 exact" },
            { name: "Data Dashboard", matches: ["visual"], synonyms: ["chart"], count: "1 exact, 1 synonym" }
          ]
        }
      },
      {
        title: "Stage 4: Ranking",
        description: "Match scores are calculated using weighted factors.",
        data: {
          "Scoring Rules": {
            "Exact match": "+10 points",
            "Partial match": "+5 points",
            "Synonym match": "+3 points",
            "Metadata quality": "+1-5 points",
            "Recency bonus": "+1-2 points"
          },
          "Score Calculation": [
            { name: "Network Graph Viewer", calc: "3×10 + 4 = 34 pts", final: 34 },
            { name: "Force-Directed Graph", calc: "2×10 + 5 = 25 pts", final: 25 },
            { name: "Bar Chart Builder", calc: "1×10 + 1×3 + 3 = 16 pts", final: 16 },
            { name: "Data Dashboard", calc: "1×10 + 1×3 + 2 = 15 pts", final: 15 }
          ]
        }
      },
      {
        title: "Stage 5: Results",
        description: "Ranked list of MicroSims with scores and highlighted matches.",
        data: {
          "Ranked Results": [
            { rank: 1, name: "Network Graph Viewer", score: 34, matches: ["graph", "network", "visualization"] },
            { rank: 2, name: "Force-Directed Graph", score: 25, matches: ["graph", "interactive"] },
            { rank: 3, name: "Bar Chart Builder", score: 16, matches: ["chart*", "interactive"] },
            { rank: 4, name: "Data Dashboard", score: 15, matches: ["visualization", "chart*"] }
          ],
          "Note": "* indicates synonym match"
        }
      }
    ]
  },
  {
    query: "pendulum motion for kids",
    stages: [
      {
        title: "Stage 1: User Query",
        description: "The user enters a search query in natural language.",
        data: {
          "Raw Query": '"pendulum motion for kids"',
          "Intent": "Find age-appropriate physics simulations for children"
        }
      },
      {
        title: "Stage 2: Query Processing",
        description: "The query is tokenized, normalized, and synonyms are expanded.",
        data: {
          "Tokenization": '["pendulum", "motion", "for", "kids"]',
          "Stop Word Removal": '["pendulum", "motion", "kids"]  ("for" removed)',
          "Normalization": '["pendulum", "motion", "kid"]  (stemmed)',
          "Synonym Expansion": {
            "kids": '→ ["kid", "child", "elementary", "beginner"]',
            "motion": '→ ["motion", "movement", "physics"]'
          },
          "Final Terms": '["pendulum", "motion", "kid", "child", "elementary", "beginner"]'
        }
      },
      {
        title: "Stage 3: Keyword Matching",
        description: "Query terms are compared against MicroSim metadata keywords.",
        data: {
          "Candidates Evaluated": "127 MicroSims in index",
          "Match Results": [
            { name: "Simple Pendulum", matches: ["pendulum", "motion"], grade: "Elementary", count: "2 exact + grade match" },
            { name: "Pendulum Period Explorer", matches: ["pendulum"], grade: "High School", count: "1 exact" },
            { name: "Harmonic Motion Intro", matches: ["motion"], synonyms: ["beginner"], count: "1 exact, 1 synonym" },
            { name: "Physics for Kids", matches: ["kid", "motion"], grade: "Elementary", count: "2 exact + grade match" }
          ]
        }
      },
      {
        title: "Stage 4: Ranking",
        description: "Match scores are calculated using weighted factors.",
        data: {
          "Scoring Rules": {
            "Exact match": "+10 points",
            "Synonym match": "+3 points",
            "Grade level match": "+8 points",
            "Metadata quality": "+1-5 points"
          },
          "Score Calculation": [
            { name: "Simple Pendulum", calc: "2×10 + 8 + 4 = 32 pts", final: 32 },
            { name: "Physics for Kids", calc: "2×10 + 8 + 3 = 31 pts", final: 31 },
            { name: "Harmonic Motion Intro", calc: "1×10 + 1×3 + 5 = 18 pts", final: 18 },
            { name: "Pendulum Period Explorer", calc: "1×10 + 5 = 15 pts", final: 15 }
          ]
        }
      },
      {
        title: "Stage 5: Results",
        description: "Ranked list of MicroSims with scores and highlighted matches.",
        data: {
          "Ranked Results": [
            { rank: 1, name: "Simple Pendulum", score: 32, matches: ["pendulum", "motion"], grade: "Elementary ✓" },
            { rank: 2, name: "Physics for Kids", score: 31, matches: ["kids", "motion"], grade: "Elementary ✓" },
            { rank: 3, name: "Harmonic Motion Intro", score: 18, matches: ["motion", "beginner*"] },
            { rank: 4, name: "Pendulum Period Explorer", score: 15, matches: ["pendulum"], grade: "High School" }
          ],
          "Note": "✓ indicates grade level match; * indicates synonym match"
        }
      }
    ]
  },
  {
    query: "sorting algorithm animation",
    stages: [
      {
        title: "Stage 1: User Query",
        description: "The user enters a search query in natural language.",
        data: {
          "Raw Query": '"sorting algorithm animation"',
          "Intent": "Find animated demonstrations of sorting algorithms"
        }
      },
      {
        title: "Stage 2: Query Processing",
        description: "The query is tokenized, normalized, and synonyms are expanded.",
        data: {
          "Tokenization": '["sorting", "algorithm", "animation"]',
          "Normalization": '["sort", "algorithm", "anim"]  (stemmed)',
          "Synonym Expansion": {
            "sorting": '→ ["sort", "order", "arrange"]',
            "animation": '→ ["anim", "visual", "interactive", "demo"]'
          },
          "Final Terms": '["sort", "algorithm", "anim", "order", "visual", "interactive"]'
        }
      },
      {
        title: "Stage 3: Keyword Matching",
        description: "Query terms are compared against MicroSim metadata keywords.",
        data: {
          "Candidates Evaluated": "127 MicroSims in index",
          "Match Results": [
            { name: "Bubble Sort Visualizer", matches: ["sort", "visual", "algorithm"], count: "3 exact" },
            { name: "QuickSort Animation", matches: ["sort", "anim", "algorithm"], count: "3 exact" },
            { name: "Sorting Comparison", matches: ["sort", "algorithm"], count: "2 exact" },
            { name: "Algorithm Basics", matches: ["algorithm"], synonyms: ["interactive"], count: "1 exact, 1 synonym" }
          ]
        }
      },
      {
        title: "Stage 4: Ranking",
        description: "Match scores are calculated using weighted factors.",
        data: {
          "Scoring Rules": {
            "Exact match": "+10 points",
            "Partial match": "+5 points",
            "Synonym match": "+3 points",
            "Metadata quality": "+1-5 points",
            "Recency bonus": "+1-2 points"
          },
          "Score Calculation": [
            { name: "Bubble Sort Visualizer", calc: "3×10 + 5 = 35 pts", final: 35 },
            { name: "QuickSort Animation", calc: "3×10 + 4 = 34 pts", final: 34 },
            { name: "Sorting Comparison", calc: "2×10 + 5 = 25 pts", final: 25 },
            { name: "Algorithm Basics", calc: "1×10 + 1×3 + 3 = 16 pts", final: 16 }
          ]
        }
      },
      {
        title: "Stage 5: Results",
        description: "Ranked list of MicroSims with scores and highlighted matches.",
        data: {
          "Ranked Results": [
            { rank: 1, name: "Bubble Sort Visualizer", score: 35, matches: ["sorting", "algorithm", "visualization"] },
            { rank: 2, name: "QuickSort Animation", score: 34, matches: ["sorting", "algorithm", "animation"] },
            { rank: 3, name: "Sorting Comparison", score: 25, matches: ["sorting", "algorithm"] },
            { rank: 4, name: "Algorithm Basics", score: 16, matches: ["algorithm", "interactive*"] }
          ],
          "Note": "* indicates synonym match"
        }
      }
    ]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create query dropdown
  queryDropdown = createSelect();
  queryDropdown.position(120, drawHeight + 12);
  for (let i = 0; i < exampleQueries.length; i++) {
    queryDropdown.option(exampleQueries[i].query, i);
  }
  queryDropdown.changed(onQueryChange);

  // Create navigation buttons
  prevButton = createButton('← Previous');
  prevButton.position(canvasWidth - 200, drawHeight + 12);
  prevButton.mousePressed(prevStage);

  nextButton = createButton('Next →');
  nextButton.position(canvasWidth - 100, drawHeight + 12);
  nextButton.mousePressed(nextStage);

  updateButtonStates();

  describe('Step-through visualization of how search queries are processed through keyword matching to produce ranked results. Use the dropdown to select a query and Next/Previous buttons to step through each stage.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Keywords to Search Results Flow', canvasWidth / 2, 10);
  textStyle(NORMAL);

  // Draw stage indicators
  drawStageIndicators();

  // Draw current stage data
  drawStageData();

  // Draw control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Query:', 10, drawHeight + 22);

  // Stage counter
  textAlign(RIGHT, CENTER);
  text(`Stage ${currentStage + 1} of ${stages.length}`, canvasWidth - 210, drawHeight + 22);
}

function drawStageIndicators() {
  const stageWidth = 70;
  const stageHeight = 35;
  const totalWidth = stages.length * stageWidth + (stages.length - 1) * 30;
  const startX = (canvasWidth - totalWidth) / 2;
  const stageY = 45;

  for (let i = 0; i < stages.length; i++) {
    const x = startX + i * (stageWidth + 30);
    const stage = stages[i];
    const isCurrent = i === currentStage;
    const isPast = i < currentStage;

    // Draw arrow before this stage (except first)
    if (i > 0) {
      const arrowX = x - 20;
      stroke(isPast || isCurrent ? 100 : 200);
      strokeWeight(2);
      line(arrowX - 8, stageY + stageHeight / 2, arrowX + 8, stageY + stageHeight / 2);
      // Arrowhead
      noStroke();
      fill(isPast || isCurrent ? 100 : 200);
      triangle(
        arrowX + 12, stageY + stageHeight / 2,
        arrowX + 4, stageY + stageHeight / 2 - 5,
        arrowX + 4, stageY + stageHeight / 2 + 5
      );
    }

    // Stage box
    const c = stage.color;
    if (isCurrent) {
      fill(c[0], c[1], c[2]);
      stroke(c[0] * 0.6, c[1] * 0.6, c[2] * 0.6);
      strokeWeight(3);
    } else if (isPast) {
      fill(c[0], c[1], c[2], 150);
      stroke(180);
      strokeWeight(1);
    } else {
      fill(220);
      stroke(180);
      strokeWeight(1);
    }
    rect(x, stageY, stageWidth, stageHeight, 6);

    // Stage label
    noStroke();
    fill(isCurrent ? 255 : (isPast ? 255 : 120));
    textAlign(CENTER, CENTER);
    textSize(11);
    text(stage.name, x + stageWidth / 2, stageY + stageHeight / 2);
  }
}

function drawStageData() {
  const panelX = 20;
  const panelY = 100;
  const panelW = canvasWidth - 40;
  const panelH = drawHeight - 120;

  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  const stageData = exampleQueries[currentQueryIndex].stages[currentStage];

  // Stage title
  const c = stages[currentStage].color;
  fill(c[0], c[1], c[2]);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  text(stageData.title, panelX + 15, panelY + 15);

  // Description
  textStyle(NORMAL);
  fill(80);
  textSize(13);
  text(stageData.description, panelX + 15, panelY + 40);

  // Data content
  let yPos = panelY + 70;
  textSize(12);

  const data = stageData.data;
  for (const [key, value] of Object.entries(data)) {
    if (yPos > panelY + panelH - 30) break;

    // Key label
    fill(60);
    textStyle(BOLD);
    text(key + ":", panelX + 15, yPos);
    textStyle(NORMAL);

    if (typeof value === 'string') {
      // Simple string value
      fill(30);
      textStyle(NORMAL);
      const valueX = panelX + 15;
      const valueText = value;
      text(valueText, valueX, yPos + 18);
      yPos += 45;
    } else if (Array.isArray(value)) {
      // Array of match results or ranked results
      yPos += 22;
      for (const item of value) {
        if (yPos > panelY + panelH - 25) break;

        if (item.rank !== undefined) {
          // Ranked result
          drawRankedResult(panelX + 20, yPos, panelW - 40, item);
          yPos += 28;
        } else if (item.calc !== undefined) {
          // Score calculation
          drawScoreCalc(panelX + 20, yPos, panelW - 40, item);
          yPos += 24;
        } else {
          // Match result
          drawMatchResult(panelX + 20, yPos, panelW - 40, item);
          yPos += 28;
        }
      }
      yPos += 10;
    } else if (typeof value === 'object') {
      // Nested object (like synonym expansion or scoring rules)
      yPos += 20;
      for (const [subKey, subValue] of Object.entries(value)) {
        if (yPos > panelY + panelH - 20) break;
        fill(70);
        textSize(11);
        text("  " + subKey + "  " + subValue, panelX + 20, yPos);
        yPos += 18;
      }
      yPos += 10;
    }
  }
}

function drawMatchResult(x, y, w, item) {
  // Background
  fill(248, 250, 252);
  noStroke();
  rect(x, y - 2, w, 24, 4);

  // Name
  fill(40);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(item.name, x + 8, y + 10);
  textStyle(NORMAL);

  // Matches
  fill(80);
  textSize(10);
  const matchText = "Matches: " + item.matches.join(", ");
  text(matchText, x + 180, y + 10);

  // Count badge
  fill(52, 168, 83);
  rect(x + w - 100, y + 1, 90, 18, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  text(item.count, x + w - 55, y + 10);
  textAlign(LEFT, CENTER);
}

function drawScoreCalc(x, y, w, item) {
  // Name
  fill(40);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(item.name, x + 8, y + 8);
  textStyle(NORMAL);

  // Calculation
  fill(80);
  textSize(10);
  text(item.calc, x + 180, y + 8);

  // Score badge
  const scoreColor = item.final > 30 ? color(52, 168, 83) :
                     item.final > 20 ? color(251, 188, 4) : color(234, 67, 53);
  fill(scoreColor);
  noStroke();
  rect(x + w - 60, y, 50, 18, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(BOLD);
  text(item.final + " pts", x + w - 35, y + 9);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
}

function drawRankedResult(x, y, w, item) {
  // Background with rank-based color
  const bgColor = item.rank === 1 ? color(236, 253, 245) :
                  item.rank === 2 ? color(254, 252, 232) :
                  color(248, 250, 252);
  fill(bgColor);
  stroke(220);
  strokeWeight(1);
  rect(x, y - 2, w, 24, 4);

  // Rank badge
  const rankColor = item.rank === 1 ? color(52, 168, 83) :
                    item.rank === 2 ? color(251, 188, 4) :
                    item.rank === 3 ? color(234, 160, 53) : color(150);
  fill(rankColor);
  noStroke();
  ellipse(x + 15, y + 10, 20, 20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(BOLD);
  text(item.rank, x + 15, y + 10);
  textStyle(NORMAL);

  // Name
  fill(40);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(item.name, x + 35, y + 10);
  textStyle(NORMAL);

  // Matched keywords
  fill(80);
  textSize(9);
  const matchStr = item.matches.join(", ");
  text(matchStr, x + 190, y + 10);

  // Score badge
  fill(60);
  textSize(10);
  textAlign(RIGHT, CENTER);
  text("Score: " + item.score, x + w - 10, y + 10);

  // Grade level if present (positioned before score)
  if (item.grade) {
    fill(100, 100, 180);
    textSize(9);
    text(item.grade, x + w - 75, y + 10);
  }
  textAlign(LEFT, CENTER);
}

function onQueryChange() {
  currentQueryIndex = parseInt(queryDropdown.value());
  currentStage = 0;
  updateButtonStates();
}

function prevStage() {
  if (currentStage > 0) {
    currentStage--;
    updateButtonStates();
  }
}

function nextStage() {
  if (currentStage < stages.length - 1) {
    currentStage++;
    updateButtonStates();
  }
}

function updateButtonStates() {
  prevButton.attribute('disabled', currentStage === 0 ? true : null);
  nextButton.attribute('disabled', currentStage === stages.length - 1 ? true : null);

  // Remove disabled attribute properly
  if (currentStage > 0) {
    prevButton.removeAttribute('disabled');
  }
  if (currentStage < stages.length - 1) {
    nextButton.removeAttribute('disabled');
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition controls
  if (queryDropdown) {
    queryDropdown.size(min(250, canvasWidth - 250));
  }
  if (prevButton) {
    prevButton.position(canvasWidth - 200, drawHeight + 12);
  }
  if (nextButton) {
    nextButton.position(canvasWidth - 100, drawHeight + 12);
  }
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
