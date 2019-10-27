class Squarex {
  constructor(c, r, size) {
    this.c = c;
    this.r = r;
    this.x = c*size;
    this.y = r*size;
    this.size = size;
    this.hover = false;
    this.enabled = false;
    this.door = false;

    this.top = true;
    this.right = true;
    this.bottom = true;
    this.left = true;

    this.jitter = random();
    this.jitter_pos = 10;
  }

  save() {
    // return a json representation of this object
    return {
      c: this.c,
      r: this.r
    };
  }

  load(data) {
    //this.c = data.c;
    //this.r = data.r;
    this.enabled = true;
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

    return y > this.y && y < this.y + this.size &&
      x > this.x && x <this.x + this.size;

  }

  hover_state(mouse_over) {
    this.hover = mouse_over
  }

  onClick() {
    if (this.enabled && !this.door && this.top && this.bottom && (!this.left && !this.right)) {
      // this is a room and it is a coridoor, toggle to doorway
      this.door = true;
    } else if (this.enabled && !this.door && this.left && this.right && (!this.top && !this.bottom)) {
      this.door = true;
    } else {
      this.enabled = !this.enabled;
      this.door = false;
    }
  }

  display_door_wall() {
    var y1 = (this.jitter * 2.0) - 1.0;
    line(0, y1, this.size/3, -y1);
    line(this.size/3,  -y1,    this.size/3,   5);
    line(this.size/3,    5,  2*this.size/3,   5);
    line(2*this.size/3,  5,  2*this.size/3,   y1);
    line(2*this.size/3, y1,      this.size,  -y1);
  }

  display_door_wall_top() {
    // draw a wall shaped like ->  --_--
    push();
    translate(this.x, this.y);
    this.display_door_wall();
    pop();
  }

  display_door_wall_bottom() {
    push();
    translate(this.x, this.y+this.size);
    scale(1, -1.0);
    this.display_door_wall();
    pop();
  }

  display_door_wall_left() {
    push();
    translate(this.x, this.y);
    rotate(HALF_PI);
    scale(1.0, -1.0);
    this.display_door_wall();
    pop();
  }

  display_door_wall_right() {
    push();
    translate(this.x+this.size, this.y);
    rotate(HALF_PI);
    //scale(1.0, -1.0);
    this.display_door_wall();
    pop();
  }

  display() {
    
    if (this.enabled)
      if(this.hover)
        fill(255, 255, 255);
      else
        fill(224, 224, 224);
    else
      if (this.hover)
        fill(255, 204, 0);
      else
        fill(255, 255, 255);

    noStroke();

    if (!this.door) {
      push();
      translate(this.x, this.y);
      square(0, 0, this.size);
      pop();
    } else {
      // fill(255, 255, 0);
      square(this.x, this.y, this.size);
    }
    
    if (this.enabled) {
      stroke(0,0,0);
      //stroke(200,0,40);
      strokeWeight(1);
      if (this.top) {
        if (this.door) {
          this.display_door_wall_top();
        } else {
          push();
          translate(this.x, this.y);

          if (this.jitter > 0.5) {
            // two lines
            var y1 = (this.jitter * 3) - 1.5;
            line(0, y1, this.size, -y1);
          } else {
            var y1 = ((this.jitter * 10 % 1) - 0.5) * 3;
            var y2 = ((this.jitter * 100 % 1) - 0.5) * 3;
            line(0, y1, this.size/2, -y1);
            line(this.size/2, -y1, this.size, y2);
          }

          pop();

        }
      }
      else {
        // dots between 0 and 7
        var num_dots = this.jitter * 7;
        var tmp = this.jitter;
        for (var i=0; i<num_dots; i++) {
          tmp *= 10;
          tmp = tmp % 1;
          var offset = this.size * tmp - 1;

          push();
          translate(this.x, this.y);

          point(offset, 0);

          pop();
        }
      }

      if (this.door && this.bottom) {
        line(this.x+this.size/2, this.y+7, this.x+this.size/2, this.y+this.size-7);
      }

      if (this.door && this.left) {
        line(this.x+7, this.y+this.size/2, this.x+this.size-7, this.y+this.size/2);
      }

      if (this.bottom) {
        if (this.door) {
          this.display_door_wall_bottom();
        } else {

          push();
          translate(this.x, this.y);

          if (this.jitter > 0.5) {
            // two lines
            var y1 = (this.jitter * 3) - 1.5;
            line(0, this.size+y1, this.size, this.size-y1);
          } else {
            var y1 = ((this.jitter * 10 % 1) - 0.5) * 3;
            var y2 = ((this.jitter * 100 % 1) - 0.5) * 3;
            line(0, this.size+y1, this.size/2, this.size-y1);
            line(this.size/2, this.size-y1, this.size, this.size+y2);
          }

          pop();
        }
        
      }

      if (this.left) {
        if (this.door) {
          this.display_door_wall_left();
        } else {
          push();
          translate(this.x, this.y);
          
          if (this.jitter > 0.8) {
            // two lines
            var x1 = (this.jitter - 0.5) * 3;
            line(x1, 0, -x1, this.size);

          } else {
            var x1 = ((this.jitter * 10 % 1) - 0.5) * 3;
            var x2 = ((this.jitter * 100 % 1) - 0.5) * 3;
            line(x1, 0, -x1, this.size/2);
            line(-x1, this.size/2, -x2, this.size);
          }

          pop();          
        }
      }

      if(this.right) {
        if (this.door) {
          this.display_door_wall_right();
        } else {
          if (this.jitter > 0.8) {
            // two lines
            var x1 = (this.jitter - 0.5) * 3;
            line(this.x+this.size+x1, this.y, this.x+this.size-x1, this.y+this.size);
            //line(this.x+this.size+x1, this.y, this.x+this.size, this.y+this.size);
          } else {
            var x1 = ((this.jitter * 10 % 1) - 0.5) * 3;
            var x2 = ((this.jitter * 100 % 1) - 0.5) * 3;
            line(this.x+this.size+x1, this.y, this.x+this.size-x1, this.y+this.size/2);
            line(this.x+this.size-x1, this.y+this.size/2, this.x+this.size-x2, this.y+this.size);
          }  
        }
      }
      else {
        // dots between 0 and 7
        var num_dots = this.jitter * 7;
        var tmp = this.jitter;
        for (var i=0; i<num_dots; i++) {
          tmp *= 10;
          tmp = tmp % 1;
          var offset = this.size * tmp - 1;
          line(
            this.x+this.size,
            this.y+offset,
            this.x+this.size,
            this.y+offset+1);
        }
      }
    }
  }

  stone(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;

    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let rand = (this.next_rand() * 3.0) - 1.5;
      
      let sx = x + cos(a) * (radius + rand);
      let sy = y + sin(a) * (radius + rand);
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  display_clutter_transform(side) {
    if (side == TOP) {
      translate(this.x, this.y);
    }
    else if (side == RIGHT) {
      translate(this.x+this.size, this.y);
      rotate(HALF_PI);
    }
    else if (side == BOTTOM) {
      translate(this.x+this.size, this.y+this.size);
      rotate(PI);
    }
    else if(side == LEFT) {
      translate(this.x, this.y+this.size);
      rotate(PI + HALF_PI);
    }
  }

  display_clutter_a(side) {
    // three lines, big, medium and small

    push();
    this.display_clutter_transform(side);
    
    let angle = 225 + ((this.jitter * 100) % 1) * 90;
    let v = p5.Vector.fromAngle(radians(angle), 24);

    line(this.size*0.1, 0, this.size*0.1 + v.x,     v.y    );
    line(this.size*0.3, 0, this.size*0.3 + v.x*0.8, v.y*0.8);
    line(this.size*0.5, 0, this.size*0.5 + v.x*0.5, v.y*0.5);

    pop();

  }

  display_clutter_b(side) {
    // three lines, small, medium and big

    push();
    this.display_clutter_transform(side);

    let angle = 225 + ((this.jitter * 1000) % 1) * 90;
    let v = p5.Vector.fromAngle(radians(angle), 24);

    line(this.size,     0, this.size + v.x,         v.y    );
    line(this.size*0.7, 0, this.size*0.7 + v.x*0.8, v.y*0.8);
    line(this.size*0.4, 0, this.size*0.4 + v.x*0.5, v.y*0.5);

    pop();
  }

  display_clutter_c(side) {
    push();
    this.display_clutter_transform(side);

    let angle = -15 + ((this.jitter * 1000) % 1) * 30;
    let v = p5.Vector.fromAngle(radians(angle), this.size*0.8);

    line(0, -this.size*0.6, v.x*0.5, -this.size*0.6 + v.y);
    line(0, -this.size*0.3, v.x*0.8, -this.size*0.3 + v.y*0.8);
    line(0, -this.size*0.1, v.x,     -this.size*0.1 + v.y*0.5);

    pop();
  }

  display_clutter_random(side) {

    let rand = this.next_rand();
    if (rand > 0.66) {
      this.display_clutter_a(side);
    } else if (rand > 0.33) {
      this.display_clutter_b(side);
    } else {
      this.display_clutter_c(side);
    }

  }

  display_clutter_rocks(side) {
    push();
    this.display_clutter_transform(side);

    // two big stones
    this.stone(this.size/2, -30, 5, 9);
    
    // random angle:
    let angle = TWO_PI * this.next_rand();
    let radius = 7;
    
    let x = this.size/2 + cos(angle) * radius;
    let y = -30         + sin(angle) * radius;

    this.stone(x, y, 4, 8);

    x = this.size/2 + cos(angle+PI) * radius;
    y = -30         + sin(angle+PI) * radius;
    this.stone(x, y, 4, 8);

    x = this.next_rand_between(-6, 6);
    this.stone(this.size/2 - x, -42, 3, 8);

    x = this.next_rand_between(-4, 4);
    this.stone(this.size/2 + x, -47, 3, 7);

    point(this.size/2, -47);
    point(this.size/2, -50);
    point(this.size/2 + 1, -53);

    pop();
  }


  display_clutter() {
    if (!this.enabled) return;

    stroke(100,100,100);
    strokeWeight(1);

    this.jitter_pos = 10;

    if (this.top)
      this.display_clutter_random(TOP);

    if (this.bottom)
      this.display_clutter_random(BOTTOM);

    if (this.left)
      this.display_clutter_random(LEFT);

    if (this.right)
      this.display_clutter_random(RIGHT);
      

    if (this.top && this.next_rand() < 0.1)
      this.display_clutter_rocks(TOP);

    if (this.bottom && this.next_rand() < 0.1)
      this.display_clutter_rocks(BOTTOM);

    if (this.left && this.next_rand() < 0.1)
      this.display_clutter_rocks(LEFT);

    if (this.right && this.next_rand() < 0.1)
      this.display_clutter_rocks(RIGHT);


  }

}
