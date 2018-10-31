class GA {
  constructor(nMoves, crossRate, mutationRate, popSize, startPoint) {
    this.dnaSize = 2 * nMoves;
    this.crossRate = crossRate;
    this.mutationRate = mutationRate;
    this.popSize = popSize;
    this.forceMutation = 0;

    this.pop = [];
    this.bestIndex = 0;
    this.fitnessSum = 0;
    for(let i = 0; i < popSize; i++) {
      this.pop[i] = new Way(startPoint[0], startPoint[1], nMoves);
    }
  }

  draw(mode, scale) {
    if(mode === 'best') {
      this.pop[this.bestIndex].draw(scale);
    } else {
      for(let i = 0; i < this.popSize; i++) {
        this.pop[i].draw(scale);
      }
    }
  }

  fitness(xGoal, yGoal, obstacles) {
    let best = 0;
    this.fitnessSum = 0;
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

      // Global fitness logic
      this.fitnessSum += fit;
      this.pop[i].fitness = fit;
      if(fit > best) {
        best = fit;
        this.bestIndex = i;
      }
    }
  }

  yep() {
    let random = Math.random() * this.fitnessSum;
    for(let j = 0; j < this.popSize; j++) {
      if(random < this.pop[j].fitness) {
        return j;
      }
      random -= this.pop[j].fitness;
    }
  }

  evolve() {
    const pop = [];

    // Select by fitness
    for(let i = 0; i < this.popSize; i++) {
      const sel = this.pop[this.yep()];
      pop[i] = new Way(sel.xPath[0], sel.yPath[0], sel.size);
      pop[i].xPath = sel.xPath.slice(0);
      pop[i].yPath = sel.yPath.slice(0);
    }

    // Crossover and mutations
    for(let i = 0; i < this.popSize; i++) {
      pop[i].crossover(this.crossRate, this.pop[Math.floor(Math.random() * this.popSize)]);
      pop[i].mutate(this.mutationRate, this.forceMutation);
    }

    this.pop = pop.slice(0);
  }
}
