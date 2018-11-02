class Way {
  constructor(xStart, yStart, scale) {
    this.fitness = 0;
    this.size = 2 * scale;
    this.scale = scale;
    this.xPath = [];
    this.yPath = [];

    for(let i = 0; i < this.size; i++) {
      this.xPath[i] = this.getRandomDirection();
      this.yPath[i] = this.getRandomDirection();
    }

    this.xPath[0] = xStart;
    this.yPath[0] = yStart;
  }

  draw() {
    const x = this.getCumulativePath('x');
    const y = this.getCumulativePath('y');
    for(let i = 1; i < this.size; i++) {
      line(x[i - 1], y[i - 1], x[i], y[i]);
    }
  }

  grow(rate) {
    if(Math.random() < rate) {
      const index = Math.floor(Math.random() * this.size) + 1;
      if(Math.random() < 0.5) {
        this.size--;
        this.xPath.splice(index, 1);
        this.yPath.splice(index, 1);
      } else {
        this.size++;
        this.xPath.splice(index, 0, this.getRandomDirection());
        this.yPath.splice(index, 0, this.getRandomDirection());
      }
    }
  }

  crossover(rate, target) {
    if(Math.random() < rate) {
      for(let i = 1; i < Math.min(this.size, target.size); i++) {
        if(Math.random() < 0.5) this.xPath[i] = target.xPath[i];
        if(Math.random() < 0.5) this.yPath[i] = target.yPath[i];
      }
    }
  }

  mutate(rate) {
    for(let i = 1; i < this.size; i++) {
      if(Math.random() < rate) this.xPath[i] = this.getRandomDirection();
      if(Math.random() < rate) this.yPath[i] = this.getRandomDirection();
    }
  }

  getRandomDirection() {
    return (Math.floor(Math.random() * 3) - 1) / 4 * this.scale;
  }

  getCumulativePath(type) {
    const path = type === 'x' ? this.xPath : this.yPath;
    const cumulativePath = [];
    cumulativePath[0] = path[0];
    for(let i = 1; i < this.size; i++) {
      cumulativePath[i] = cumulativePath[i - 1] + path[i];
    }
    return cumulativePath;
  }
}
