class GA {
  constructor(xStart, yStart, size, scale) {
    this.popSize = size;
    this.pop = [];
    for(let i = 0; i < this.popSize; i++) {
      this.pop[i] = new Way(xStart, yStart, scale);
    }
  }

  draw(mode) {
    if(mode === 'best') {
      const maxFit = Math.max.apply(Math, this.pop.map(o => o.fitness));
      const maxIndex = this.pop.findIndex(e => e.fitness === maxFit);
      this.pop[maxIndex].draw();
    } else {
      for(let i = 0; i < this.popSize; i++) {
        this.pop[i].draw();
      }
    }
  }

  fitness(xGoal, yGoal, obstacles) {
    for(let i = 0; i < this.popSize; i++) {
      const xCumSum = this.pop[i].getCumulativePath('x');
      const yCumSum = this.pop[i].getCumulativePath('y');

      // Pythagorean theorem
      const distToGoal = Math.sqrt(Math.pow(xGoal - xCumSum[xCumSum.length - 1], 2) + Math.pow(yGoal - yCumSum[yCumSum.length - 1], 2));

      // Fitness logic
      const fitness = Math.pow(1 / (distToGoal + 1), 2);

      // Collisions
      let fit = fitness;
      for(let j = 0; j < this.pop[i].size; j++) {
        for(let k = 0; k < obstacles.length; k++) {
          if(xCumSum[j] > obstacles[k].xFrom && xCumSum[j] < obstacles[k].xTo
          && yCumSum[j] > obstacles[k].yFrom && yCumSum[j] < obstacles[k].yTo) {
            fit =  1e-6;
            break;
          }
        }
        if(fit !== fitness) break;
      }

      this.pop[i].fitness = fit;
    }
  }

  evolve(growRate, crossRate, mutationRate, goalMoved) {
    const pop = [];
    const fitnessSum = this.pop.reduce((sum, current) => sum + current.fitness, 0);

    for(let i = 0; i < this.popSize; i++) {
      let selected;
      let random = Math.random() * fitnessSum;

      // Select by fitness
      for(let j = 0; j < this.popSize; j++) {
        if(random < this.pop[j].fitness) {
          selected = this.pop[j];
          break;
        }
        random -= this.pop[j].fitness;
      }

      // Deep clone
      pop[i] = new Way(selected.xPath[0], selected.yPath[0], selected.scale);
      if(!goalMoved) pop[i].size = selected.size;
      pop[i].xPath = selected.xPath.slice(0);
      pop[i].yPath = selected.yPath.slice(0);

      // Genetic actions
      pop[i].grow(growRate);
      pop[i].crossover(crossRate, this.pop[Math.floor(Math.random() * this.popSize)]);
      pop[i].mutate(goalMoved ? 1 : mutationRate);
    }

    this.pop = pop.slice(0);
  }
}
