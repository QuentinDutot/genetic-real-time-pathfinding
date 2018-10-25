class GA {
  constructor(nMoves, crossRate, mutationRate, popSize) {
    this.nMoves = nMoves;
    this.dnaSize = 2 * nMoves;
    this.crossRate = crossRate;
    this.mutationRate = mutationRate;
    this.popSize = popSize;
    this.forceMutation = 0;

    // Generate popSize*dnaSize array with -0.25 or 0.25
    this.pop = nj.array(nj.random(this.popSize, this.dnaSize).tolist().map(e => e.map(f => f < 0.5 ? -0.25 : 0.25)));
  }

  dnaToProduct(dna, startPoint) {
    let pop = dna;

    // Set the start position
    pop.slice(null, [0, 1]).assign(startPoint[0], false);
    pop.slice(null, [this.nMoves, this.nMoves + 1]).assign(startPoint[1], false);

    // Split dna
    let xLines = pop.slice(null, [0, this.nMoves]).tolist();
    let yLines = pop.slice(null, this.nMoves).tolist();

    // Cumulative sum for xLines
    for(let i=0;i<xLines.length;i++) {
      for(let j=1;j<xLines[i].length;j++) {
        xLines[i][j] += xLines[i][j-1];
      }
    }

    // Cumulative sum for yLines
    for(let i=0;i<yLines.length;i++) {
      for(let j=1;j<yLines[i].length;j++) {
        yLines[i][j] += yLines[i][j-1];
      }
    }

    return [xLines, yLines];
  }

  getFitness(xLinesTmp, yLinesTmp, goalPoint) {

    // We store lines
    const xLines = nj.array(xLinesTmp);
    const yLines = nj.array(yLinesTmp);

    // Distance x^2 to goal
    const xDist = nj.array(xLines.slice(null, -1).tolist());
    xDist.multiply(-1, false);
    xDist.add(goalPoint[0], false);
    xDist.pow(2, false);

    // Distance x^2 to goal
    const yDist = nj.array(yLines.slice(null, -1).tolist());
    yDist.multiply(-1, false);
    yDist.add(goalPoint[1], false);
    yDist.pow(2, false);

    // Pythagorean theorem and fitness logic
    const distToGoal = nj.sqrt(xDist.add(yDist));
    const fitness = nj.ones(distToGoal.shape).divide(distToGoal.add(1));
    fitness.pow(2, false);

    // Obstacle logic here...
    return fitness;
  }

  weightedRandom(weights, total) {
    let random = Math.random() * total;
    for(let i=0;i<weights.length;i++) {
      if(random < weights[i]) {
        return i;
      }
      random -= weights[i];
    }
  }

  select(fitness) {
    const selected = [];
    const totalWeight = fitness.sum();

    for(let i=0;i<this.popSize;i++) {
      const randomIndex = this.weightedRandom(fitness.tolist(), totalWeight)
      selected.push(this.pop.tolist()[randomIndex]);
    }

    return selected;
  }

  crossover(parent, pop) {
    const clone = parent;
    if(Math.random() < this.crossRate) {
      // Select new individual from pop
      const randomFromPop = pop[Math.floor(Math.random() * this.popSize)];
      // Choose crossover points
      const crossPoints = nj.random(this.dnaSize).tolist().map(e => e < 0.5 ? true : false);
      // Mating and produce one child
      crossPoints.forEach((cross, point) => {
        if(cross) clone[point] = randomFromPop[point];
      });
    }
    return clone;
  }

  mutate(child) {
    for(let i=0;i<this.dnaSize;i++) {
      if(Math.random() < this.mutationRate + this.forceMutation) {
        child[i] = (Math.floor(Math.random() * 2) - 0.5) / 2;
        if(this.forceMutation > 0) this.forceMutation--;
      }
    }
    return child;
  }

  evolve(fitness) {
    const pop = this.select(fitness);

    pop.map(parent => {
      let child = this.crossover(parent, pop);
      child = this.mutate(child);
      return child;
    });

    this.pop = nj.array(pop);
  }
}
