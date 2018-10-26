const SCALE = 15;
const N_MOVES = 100;
const CROSS_RATE = 0.8;
const MUTATE_RATE = 0.0001;
const FORCE_MUTATE_RATE = 0.01;
const FORCE_MUTATE = 1000;
const POP_SIZE = 100;
const GOAL_POINT = [0, 0];
// const START_POINT = [10, 10];
const START_POINT = [window.innerWidth / 2 / SCALE, window.innerHeight / 2 / SCALE];
const OBSTACLES = [
  [START_POINT[0]/2, START_POINT[1]/2],
  [START_POINT[0]/2, START_POINT[1]],
];

let ga;
let gen;
let mode;

function drawBestLine(xLines, yLines, scale) {
  for(let i=1;i<xLines.length;i++) {
    line(xLines[i-1]*scale, yLines[i-1]*scale, xLines[i]*scale, yLines[i]*scale);
  }
}

function drawLines(xLines, yLines, scale) {
  for(let i=0;i<xLines.length;i++) {
    for(let j=1;j<xLines[i].length;j++) {
      line(xLines[i][j-1]*scale, yLines[i][j-1]*scale, xLines[i][j]*scale, yLines[i][j]*scale);
    }
  }
}

function drawPoints(start, goal, scale) {
  fill('green');
  rect((start[0]-0.5)*scale, (start[1]-0.5)*scale, scale, scale);
  rect((goal[0]-0.5)*scale, (goal[1]-0.5)*scale, scale, scale);
}

function drawObstacles(obstacles, scale) {
  fill('green');
  rect((obstacles[0][0]-0.5)*scale, (obstacles[0][1]-0.5)*scale, scale, (obstacles[1][1]-0.5)*scale);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ga = new GA(N_MOVES, CROSS_RATE, MUTATE_RATE, POP_SIZE);
  mode = 'best';
  gen = 0;
}

function draw() {
  if(!keyIsDown(ENTER)) return;

  const lines = ga.dnaToProduct(ga.pop, START_POINT);
  const fitness = ga.getFitness(lines[0], lines[1], GOAL_POINT, OBSTACLES);
  ga.evolve(fitness);
  gen++;

  console.log(`Gen : ${gen} - Best fit : ${fitness.max()} - Average fit : ${fitness.mean()}`);
  const bestFitIndex = fitness.tolist().findIndex(e => e[0] === fitness.max());

  if(fitness.mean() < FORCE_MUTATE_RATE && ga.forceMutation <= 0) {
    console.log('Mutations forced !');
    ga.forceMutation = FORCE_MUTATE;
  }

  clear();
  if(mode === 'best') {
    drawBestLine(lines[0][bestFitIndex], lines[1][bestFitIndex], SCALE);
  } else {
    drawLines(lines[0], lines[1], SCALE);
  }
  drawPoints(START_POINT, GOAL_POINT, SCALE);
  drawObstacles(OBSTACLES, SCALE);
}

function keyPressed() {
  if(keyCode === 32) {
    mode = (mode === 'best' ? 'all' : 'best');
  }
}

function mouseMoved() {
  GOAL_POINT[0] = mouseX / SCALE;
  GOAL_POINT[1] = mouseY / SCALE;
  ga.forceMutation = FORCE_MUTATE;
  clear();
  drawPoints(START_POINT, GOAL_POINT, SCALE);
  drawObstacles(OBSTACLES, SCALE);
}
