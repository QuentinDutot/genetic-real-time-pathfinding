
# genetic-real-time-pathfinding

Genetic pathfinding algorithm in javascript with [p5.js](https://github.com/processing/p5.js) for visualization.  
Demo available [here](https://quentindutot.github.io/genetic-real-time-pathfinding/).
  
It searches for a path from the center of the window to the user's mouse avoiding obstacles. The found way is probabely not the shortest but is certainly a viable one.
  
Algorithm characteristics :
- <b>selection</b> used is the roulette wheel
- <b>grow</b> to increase or decrease the genome
- <b>crossover</b> with a random parent individual
- <b>mutations</b> to create new behaviors
