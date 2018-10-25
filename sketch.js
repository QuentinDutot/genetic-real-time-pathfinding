const SCALE = 15;
const N_MOVES = 100 * SCALE;
const CROSS_RATE = 0.8;
const MUTATE_RATE = 0.0001;
const FORCE_MUTATE_RATE = 0.01;
const FORCE_MUTATE = 1000;
const POP_SIZE = 100;
const GOAL_POINT = [0, 0];
// const START_POINT = [0, 0];
const START_POINT = [window.innerWidth / 2 / SCALE, window.innerHeight / 2 / SCALE];

let ga;
let gen;

function drawLines(xLines, yLines, scale) {
  fill('grey');
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

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ga = new GA(N_MOVES, CROSS_RATE, MUTATE_RATE, POP_SIZE);
  gen = 0;
}

function draw() {
  if(!keyIsDown(ENTER)) return;

  const lines = ga.dnaToProduct(ga.pop, START_POINT);
  const fitness = ga.getFitness(lines[0], lines[1], GOAL_POINT);
  ga.evolve(fitness);
  gen++;

  console.log(`Gen : ${gen} - Best fit : ${fitness.max()} - Average fit : ${fitness.mean()}`);

  if(fitness.mean() < FORCE_MUTATE_RATE && ga.forceMutation <= 0) {
    console.log('Mutations forced !');
    ga.forceMutation = FORCE_MUTATE;
  }

  clear();
  drawLines(lines[0], lines[1], SCALE);
  drawPoints(START_POINT, GOAL_POINT, SCALE);
}

function mouseMoved() {
  GOAL_POINT[0] = mouseX / SCALE;
  GOAL_POINT[1] = mouseY / SCALE;
  ga.forceMutation = FORCE_MUTATE;
  clear();
  drawPoints(START_POINT, GOAL_POINT, SCALE);
}
