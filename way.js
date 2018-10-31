class Way {
  constructor(xStart, yStart, size) {
    this.fitness = 0;
    this.size = size;
    this.xPath = [];
    this.yPath = [];

    for(let i = 0; i < this.size; i++) {
      this.xPath[i] = Math.random() < 0.5 ? -0.25 : 0.25;
      this.yPath[i] = Math.random() < 0.5 ? -0.25 : 0.25;
    }

    this.xPath[0] = xStart;
    this.yPath[0] = yStart;
  }

  draw(scale) {
    const x = this.getCumulativePath('x');
    const y = this.getCumulativePath('y');
    for(let i = 1; i < this.size; i++) {
      line(x[i - 1] * scale, y[i - 1] * scale, x[i] * scale, y[i] * scale);
    }
  }

  grow(rate) {
    if(Math.random() < rate) {
      let extension = Math.floor(Math.random() * 10) - 5;
      if(this.size + extension > 0) {
        this.size += extension;
        if(extension > 0) {
          for(let i = 0; i < extension; i++) {
            this.xPath.push(Math.random() < 0.5 ? -0.25 : 0.25);
            this.yPath.push(Math.random() < 0.5 ? -0.25 : 0.25);
          }
        } else if(extension < 0) {
          this.xPath = this.xPath.slice(0, this.size);
          this.yPath = this.yPath.slice(0, this.size);
        }
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
      if(Math.random() < rate) this.xPath[i] = Math.random() < 0.5 ? -0.25 : 0.25;
      if(Math.random() < rate) this.yPath[i] = Math.random() < 0.5 ? -0.25 : 0.25;
    }
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
