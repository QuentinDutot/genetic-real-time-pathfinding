const GROW_RATE = 0.4;
const CROSS_RATE = 0.8;
const MUTATE_RATE = 0.0001;
const STARTING_POP_SIZE = 100;

const SCALE = 30;
const GOAL_POINT = [0, 0];
const START_POINT = [window.innerWidth / 2, window.innerHeight / 2];
const OBSTACLES = [
  { // top line
    xFrom: START_POINT[0] - 2 * SCALE,
    yFrom: START_POINT[1] - 6 * SCALE,
    xTo: START_POINT[0] + 2 * SCALE,
    yTo:  START_POINT[1] - 5 * SCALE
  },
  { // right line
    xFrom: START_POINT[0] + 4 * SCALE,
    yFrom: START_POINT[1] - 2 * SCALE,
    xTo: START_POINT[0] + 5 * SCALE,
    yTo:  START_POINT[1] + 2 * SCALE
  },
  { // bottom line
    xFrom: START_POINT[0] - 2 * SCALE,
    yFrom: START_POINT[1] + 5 * SCALE,
    xTo: START_POINT[0] + 2 * SCALE,
    yTo:  START_POINT[1] + 6 * SCALE
  },
  { // left line
    xFrom: START_POINT[0] - 5 * SCALE,
    yFrom: START_POINT[1] - 2 * SCALE,
    xTo: START_POINT[0] - 4 * SCALE,
    yTo:  START_POINT[1] + 2 * SCALE
  },
];

let ga;
let display;
let goalMoved;

function writeTuto() {
  fill('black');
  textSize(16);
  text('Press ENTER to play pathfinding', 10, window.innerHeight - 28);
  text('Press SPACE to show/hide the best way', 10, window.innerHeight - 10);
}

function drawPoints(start, goal) {
  fill('white');
  rect(start[0] - SCALE / 2, start[1] - SCALE / 2, SCALE, SCALE);
  rect(goal[0] - SCALE / 2, goal[1] - SCALE / 2, SCALE, SCALE);
}

function drawObstacles(obstacles) {
  fill('white');
  for(let i = 0; i < obstacles.length; i++) {
    rect(obstacles[i].xFrom, obstacles[i].yFrom, obstacles[i].xTo - obstacles[i].xFrom, obstacles[i].yTo - obstacles[i].yFrom);
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ga = new GA(START_POINT[0], START_POINT[1], STARTING_POP_SIZE, SCALE);
  display = 'all';
  goalMoved = true;
}

function draw() {
  clear();
  writeTuto();
  drawPoints(START_POINT, GOAL_POINT);
  drawObstacles(OBSTACLES);

  if(!keyIsDown(ENTER)) return;

  ga.draw(display);
  ga.fitness(GOAL_POINT[0], GOAL_POINT[1], OBSTACLES);
  ga.evolve(GROW_RATE, CROSS_RATE, MUTATE_RATE, goalMoved);
  goalMoved = false;
}

function keyPressed() {
  if(keyCode === 32) display = (display === 'best' ? 'all' : 'best');
}

function mouseMoved() {
  GOAL_POINT[0] = mouseX;
  GOAL_POINT[1] = mouseY;
  goalMoved = true;
  draw();
}
