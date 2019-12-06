class Rand {
  constructor() {
  	// randomSeed(99);
	this.jitter = random();
    this.jitter_pos = 10;
  }

  reset() {
  	this.jitter_pos = 10;
  }

  // walk down the random number
  next_rand() {
    this.jitter_pos *= 10;
    if (this.jitter_pos > 10000000000)
      this.jitter_pos = 10;
    return (this.jitter * this.jitter_pos) % 1;
  }

  next_rand_between(min, max) {
    let r = this.next_rand();
    return min + (r * (max - min));
  }
}