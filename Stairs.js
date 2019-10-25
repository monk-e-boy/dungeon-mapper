class Stairs {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.hover = false;

    // I guess this should be linked to the size
    // of a square
    this.size = 28;
    this.direction = direction;
    this.dead = false;
    this.jitter = random();
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

  is_over(x, y) {
    let d = dist(x, y, this.x, this.y);
    return d < this.size/2;
  }

  hover_state(mouse_over) {
    this.hover = mouse_over;
  }

  onMouseDown() {
    this.click = true;
  }

  onMouseUp() {
    this.click = false;
  }

  line(x, y, size) {

    if (this.next_rand() > 0.5 || true) {
      var y1 = (this.next_rand() - 0.5) * 3;
      y1 = 0;
      line(x, y+y1, x+size, y-y1);
    } else {
      // two lines
      var y1 = (this.next_rand() - 0.5) * 3;
      var y2 = (this.next_rand() - 0.5) * 3;
      line(x, y+y1, x+size/2, y-y1);
      line(size/2, y-y1, x+size, y+y2);
    }

  }

  display() {
    this.jitter_pos = 10;
    push();
    strokeWeight(1);

    // assume the user has clicked in the centre of
    // where she wants the stairs to be
//    translate(this.x - this.size/2, this.y - this.size/2);
    translate(this.x, this.y);

   rotate(HALF_PI * this.direction);
    //rotate(HALF_PI * 2);
    
    translate(-this.size/2, -this.size/2);

    if (this.hover) {
      stroke("#1289A7");
      strokeWeight(3);
    } else {
      stroke("#000000");
    }

    let pos = this.size / 5 * 0.9;

    this.line((this.size - (this.size * 0.800)) / 2, pos * 1, this.size * 0.800);
    this.line((this.size - (this.size * 0.675)) / 2, pos * 2, this.size * 0.675);
    this.line((this.size - (this.size * 0.550)) / 2, pos * 3, this.size * 0.550);
    this.line((this.size - (this.size * 0.425)) / 2, pos * 4, this.size * 0.425);
    this.line((this.size - (this.size * 0.300)) / 2, pos * 5, this.size * 0.300);
    
    pop();
    
  }
}