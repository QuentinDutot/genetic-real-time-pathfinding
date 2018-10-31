const SCALE = 15;
const N_MOVES = 100;
const CROSS_RATE = 0.8;
const MUTATE_RATE = 0.0001;
const FORCE_MUTATE_RATE = 0.01;
const FORCE_MUTATE = 500;
const POP_SIZE = 100;
const GOAL_POINT = [0, 0];
const START_POINT = [window.innerWidth / 2 / SCALE, window.innerHeight / 2 / SCALE];
const OBSTACLES = [
  [2 * START_POINT[0] / 3, 5 * START_POINT[1] / 6], [2 * START_POINT[0] / 3, START_POINT[1] / 3],// left line
];

let ga;
let gen;
let mode;

function drawPoints(start, goal, scale) {
  fill('white');
  rect((start[0]-0.5)*scale, (start[1]-0.5)*scale, scale, scale);
  rect((goal[0]-0.5)*scale, (goal[1]-0.5)*scale, scale, scale);
}

function drawObstacles(obstacles, scale) {
  fill('white');
  rect((obstacles[0][0]-0.5)*scale, (obstacles[0][1]-0.5)*scale, scale, (obstacles[1][1]-0.5)*scale);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ga = new GA(N_MOVES, CROSS_RATE, MUTATE_RATE, POP_SIZE, START_POINT);
  mode = 'best';
  gen = 0;
}

function draw() {
  if(!keyIsDown(ENTER)) return;

  clear();
  ga.draw(mode, SCALE);
  drawPoints(START_POINT, GOAL_POINT, SCALE);
  drawObstacles(OBSTACLES, SCALE);

  ga.fitness(GOAL_POINT[0], GOAL_POINT[1], OBSTACLES);
  ga.evolve();
  gen++;

  // console.log(`Gen : ${gen} - Best fit : ${fitness.max()} - Average fit : ${fitness.mean()}`);
  // const bestFitIndex = fitness.tolist().findIndex(e => e[0] === fitness.max());

  /*if(fitness.mean() < FORCE_MUTATE_RATE && ga.forceMutation <= 0) {
    console.log('Mutations forced !');
    ga.forceMutation = FORCE_MUTATE;
  }*/
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
