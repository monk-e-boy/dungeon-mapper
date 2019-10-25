class TextB extends Text {
  constructor(x, y) {
    super(x, y);
    this.jitter = random();
    this.jitter_pos = 10;
    this.padding_bottom = 6;
  }

  // walk down the random number
  next_rand() {
    this.jitter_pos *= 10;
    if (this.jitter_pos > 10000000000)
      this.jitter_pos = 10;
    return (this.jitter * this.jitter_pos) % 1;
  }

  //display() {
  display_decorations() {

    this.jitter_pos = 10;
    
    let h = this.bbox.h + this.padding_bottom;

    if ( !this.hover && !this.active ) {

      // draw the end ribbons first so ugly parts get
      // hidden behind the main text box
      //
      // right end ribbon
      this.end_ribbon(false);
      // left end ribbon
      this.end_ribbon(true);

      stroke(0);
      strokeWeight(1);
      fill("#ffffff");

      beginShape();

      // top of box
      push();
      translate(this.bbox.x, this.bbox.y);

      // top line(s)
      this.line2(-8, -4, this.bbox.w + 16);
      

      // ends - right mini V
      // the end line curves inwards a little
      let x1 = (this.next_rand() - 0.5) * 3 - 2;
      //x1 = (this.next_rand() - 0.5) * 3 - 2;
      vertex(this.bbox.w + 8, -4);
      vertex(this.bbox.w + 8 + x1, (h / 2));

      // bottom line(s)
      this.line2(this.bbox.w + 8, h, (this.bbox.w + 16) * -1);

      // left mini V
      // left side curves inwards a little
      x1 = (this.next_rand() - 0.5) * 3 + 2;
      vertex(-8 + x1, (h / 2));
      vertex(-8, -4);

      endShape(CLOSE);
      pop();
  
    }
  }

  line2(x, y, width) {
    
    if (this.jitter > 0.5) {
      // one lines
      let y1 = (this.next_rand() * 3) - 1.5;
      vertex(x,       y+y1);
      vertex(x+width, y-y1);

    } else if (width < 120) {
      // two lines
      let y1 = (this.next_rand() - 0.5) * 3;
      let y2 = (this.next_rand() - 0.5) * 3;

      vertex(x,         y+y1);
      vertex(x+width/2, y-y1);
      vertex(x+width/2, y-y1);
      vertex(x+width,   y+y2);

    } else {

      let y1 = (this.next_rand() - 0.5) * 3;
      let y2 = (this.next_rand() - 0.5) * 3;
      let y3 = (this.next_rand() - 0.5) * 3;
      let pos = width/4;

      vertex(x,       y+y1);
      vertex(x+pos,     y-y1);
      vertex(x+pos,     y-y1);
      vertex(x+pos+pos, y+y2);
      vertex(x+pos+pos, y+y2);
      vertex(x+pos*3,   y-y2);
      vertex(x+pos*3,   y-y2);
      vertex(x+width,   y+y3);

    }

  }


  line(width) {
    stroke(0,0,0);
    strokeWeight(1);

    if (true || this.jitter > 0.5) {
      // one lines
      let y1 = (this.next_rand() * 3) - 1.5;
      line(0, y1, width, -y1);
    } else if (width < 120) {
      // two lines
      let y1 = (this.next_rand() - 0.5) * 3;
      let y2 = (this.next_rand() - 0.5) * 3;
      line(0, y1, width/2, -y1);
      line(width/2, -y1, width, y2);
    } else {

      let y1 = (this.next_rand() - 0.5) * 3;
      let y2 = (this.next_rand() - 0.5) * 3;
      let y3 = (this.next_rand() - 0.5) * 3;
      let pos = width/4;

      line(0, y1, pos, -y1);
      line(pos, -y1, pos+pos, y2);
      line(pos+pos, y2, pos*3, -y2);
      line(pos*3, -y2, width, y3);

    }

  }

  end_ribbon(left) {
      let x1 = (this.next_rand() - 0.5) * 3 - 10;
      let y1 = (this.next_rand() - 0.5) * 3;

      push();

      if (left) {
        translate(this.bbox.x - 4, this.bbox.y);
        scale(-1.0,1.0);
      } else {
        translate(this.bbox.x + this.bbox.w + 4, this.bbox.y);
      }

      stroke(0,0,0);
      strokeWeight(1);
      fill("#ffffff");

      beginShape();
      
      // _____
      //
      //
      //
      vertex(0, 0);
      vertex(20, y1);

      // _____
      //     /
      //
      //
      vertex(20, y1);
      vertex(20 + x1, this.bbox.h / 2);

      // _____
      //     /
      //     \
      //
      y1 = (this.next_rand() - 0.5) * 3;
      vertex(20 + x1, this.bbox.h / 2);
      vertex(20, this.bbox.h + y1);

      // _____
      //     /
      // ____\
      //
      vertex(20, this.bbox.h + y1);
      vertex(0, this.bbox.h);

      endShape(CLOSE);
      pop();

  }

  
}
