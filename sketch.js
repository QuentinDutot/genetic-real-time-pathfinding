const GROW_RATE = 0.1;
const CROSS_RATE = 0.8;
const MUTATE_RATE = 0.0001;
const FORCE_MUTATE_RATE = 0.01;
const FORCE_MUTATE = 500;
const STARTING_POP_SIZE = 100;

const SCALE = 15;
const GOAL_POINT = [0, 0];
const START_POINT = [window.innerWidth / 2, window.innerHeight / 2];
const OBSTACLES = [
  { // left line
    xFrom: START_POINT[0] - 3 * SCALE,
    yFrom: START_POINT[1] - 3 * SCALE,
    xTo: START_POINT[0] - 2 * SCALE,
    yTo:  START_POINT[1] + 3 * SCALE
  },
];

let ga;
let mode;

function drawPoints(start, goal) {
  fill('white');
  rect(start[0] - SCALE / 2, start[1] - SCALE / 2, SCALE, SCALE);
  rect(goal[0] - SCALE / 2, goal[1] - SCALE / 2, SCALE, SCALE);
}

function drawObstacles(obstacles) {
  fill('white');
  rect(obstacles[0].xFrom, obstacles[0].yFrom, obstacles[0].xTo - obstacles[0].xFrom, obstacles[0].yTo - obstacles[0].yFrom);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ga = new GA(START_POINT[0], START_POINT[1], STARTING_POP_SIZE, SCALE);
  mode = 'best';
}

function draw() {
  clear();
  drawPoints(START_POINT, GOAL_POINT);
  drawObstacles(OBSTACLES);

  if(!keyIsDown(ENTER)) return;

  ga.fitness(GOAL_POINT[0], GOAL_POINT[1], OBSTACLES);
  ga.draw(mode);
  ga.evolve(GROW_RATE, CROSS_RATE, MUTATE_RATE);
}

function keyPressed() {
  if(keyCode === 32) mode = (mode === 'best' ? 'all' : 'best');
}

function mouseMoved() {
  GOAL_POINT[0] = mouseX;
  GOAL_POINT[1] = mouseY;
  draw();
}
