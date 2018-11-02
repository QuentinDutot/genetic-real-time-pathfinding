const SCALE = 15;
const GROW_RATE = 0.1;
const CROSS_RATE = 0.8;
const MUTATE_RATE = 0.0001;
const FORCE_MUTATE_RATE = 0.01;
const FORCE_MUTATE = 500;
const STARTING_POP_SIZE = 100;

const GOAL_POINT = [0, 0];
const START_POINT = [window.innerWidth / 2 / SCALE, window.innerHeight / 2 / SCALE];
const OBSTACLES = [
  [2 * START_POINT[0] / 3, 5 * START_POINT[1] / 6], [2 * START_POINT[0] / 3, START_POINT[1] / 3],// left line
];

let ga;
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
  ga = new GA(START_POINT[0], START_POINT[1], STARTING_POP_SIZE, GROW_RATE, CROSS_RATE, MUTATE_RATE);
  mode = 'best';
}

function draw() {
  clear();
  drawPoints(START_POINT, GOAL_POINT, SCALE);
  drawObstacles(OBSTACLES, SCALE);

  if(!keyIsDown(ENTER)) return;

  ga.fitness(GOAL_POINT[0], GOAL_POINT[1], OBSTACLES);
  ga.draw(mode, SCALE);
  ga.evolve();
}

function keyPressed() {
  if(keyCode === 32) mode = (mode === 'best' ? 'all' : 'best');
}

function mouseMoved() {
  GOAL_POINT[0] = mouseX / SCALE;
  GOAL_POINT[1] = mouseY / SCALE;
  draw();
}
