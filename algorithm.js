class GA {
  constructor(growRate, crossRate, mutationRate, popSize, startPoint) {
    this.growRate = growRate;
    this.crossRate = crossRate;
    this.mutationRate = mutationRate;
    this.popSize = popSize;

    this.pop = [];
    for(let i = 0; i < popSize; i++) {
      this.pop[i] = new Way(startPoint[0], startPoint[1], 10);
    }
  }

  draw(mode, scale) {
    if(mode === 'best') {
      const maxFit = Math.max.apply(Math, this.pop.map(o => o.fitness));
      const maxIndex = this.pop.findIndex(e => e.fitness === maxFit);
      this.pop[maxIndex].draw(scale);
    } else {
      for(let i = 0; i < this.popSize; i++) {
        this.pop[i].draw(scale);
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
      let j = 0;
      let fit = fitness;
      do {
        if(xCumSum[i] > obstacles[0][0] - 0.5 && xCumSum[i] < obstacles[1][0] + 0.5
        && yCumSum[i] > obstacles[0][1] - 0.5 && yCumSum[i] < obstacles[0][1] + obstacles[1][1] + 0.5) {
          fit =  1e-6;
        }
        j++;
      } while(j < xCumSum.length && fit === fitness);

      // Optimize path
      // fit = Math.min(1, fit + 1 / this.pop[i].size);

      this.pop[i].fitness = fit;
    }
  }

  evolve() {
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
      pop[i] = new Way(selected.xPath[0], selected.yPath[0], selected.size);
      pop[i].xPath = selected.xPath.slice(0);
      pop[i].yPath = selected.yPath.slice(0);

      // Genetic actions
      pop[i].grow(this.growRate);
      pop[i].crossover(this.crossRate, this.pop[Math.floor(Math.random() * this.popSize)]);
      pop[i].mutate(this.mutationRate);
    }

    this.pop = pop.slice(0);
  }
}
