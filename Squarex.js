class Drawable {
	
}

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

		this.listener = false;
		// remember this so we can turn the
		// hatches on/off as we see fit
		this.create_hatch_list();
	}

	clone() {
		let tmp = new Squarex(this.c, this.r, this.size);
		tmp.enabled = this.enabled;
		tmp.door = this.door;
		tmp.top = this.top;
		tmp.right = this.right;
		tmp.bottom = this.bottom;
		tmp.left = this.left;
		tmp.jitter_pos = this.jitter_pos;
		tmp.jitter = this.jitter;
		tmp.listener = this.listener;
		tmp.hatch_list = this.hatch_list;
		return tmp;
	}

	disable() {
		this.enabled = false;
		// when we disable a room we reset the walls
		this.top = true;
		this.right = true;
		this.bottom = true;
		this.left = true;
	}

	create_hatch_list() {

		if (!this.enabled) {
			// if this room is off, don't hatch anything
			this.hatch_list = [];
			return;
		}

		let tmp = [];

		if (this.top || this.left) {
			tmp.push([0, 0]);               // top left
			tmp.push([-5, -5]); // diagonal top left
		}

		if (this.top || this.right) {
			tmp.push([this.size, 0]);    // top right
			tmp.push([this.size+5, -5]); // diagonal top right
		}

		if (this.bottom || this.left) {
			tmp.push([0, this.size]);                 // bottom left
			tmp.push([-5, this.size+5]); // diagonal bottom left
		}

		if (this.bottom || this.right) {
			tmp.push([this.size, this.size]);	  // bottom right
			tmp.push([this.size+5, this.size+5]); // diagonal bottom right
		}

		if (this.top) {
			// funky lines:
			// mid top going up
			tmp.push([this.size/2, 0]);
			tmp.push([this.size/2, -7]);
			tmp.push([this.size/2, -15]);			
		}

		if (this.bottom) {
			tmp.push([this.size/2, this.size]);
			tmp.push([this.size/2, this.size+10]);
			tmp.push([this.size/2, this.size+15]);
		}

		if (this.left) {
			tmp.push([0, this.size/2]);
			tmp.push([-10, this.size/2]);
			tmp.push([-15, this.size/2]);
		}

		if (this.right) {
			tmp.push([this.size, this.size/2]);
			tmp.push([this.size+10, this.size/2]);
			tmp.push([this.size+15, this.size/2]);
		}

		this.hatch_list =  tmp;
	}

	get_hatch_list() {
		let list = [];

		for (let j=0; j<this.hatch_list.length; j++) {
			// translate and rotate list
			let x = this.x + this.hatch_list[j][0];
			let y = this.y + this.hatch_list[j][1];
			list.push([x,y]);
		}
		return list;
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

		return	y > this.y && y < this.y + this.size &&
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

	update_hatches() {

		if ( !this.listener) return;

		

		if (this.enabled && this.listener) {
			// check where we want to hatch
			this.create_hatch_list();
			// tell the hatching layer to show
			this.listener.enable_hatches(this.get_hatch_list());
		}

		if ( !this.enabled && this.listener) {
			// remove the hatches
			this.listener.disable_hatches(this.get_hatch_list());
			// update the hatch list (set to empty)
			this.create_hatch_list();
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


	display_clutter_debug() {
		for (let j=0; j<this.hatch_list.length; j++) {
			// translate and rotate list
			let x = this.hatch_list[j][0];
			let y = this.hatch_list[j][1];

			//let v = createVector(x, y);
			//v.sub(this.x1, this.y1);
			//v.rotate(this.angle);

			stroke(0, 0, 255);
			strokeWeight(3);
			//v.add(this.x1, this.y1);
			point(this.x + x, this.y + y);


			// list.push([]);
		}

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

/*
		if (this.enabled)
			if(this.hover)
				fill(255, 204, 0);
			else
				fill(255, 255, 255);
		else
			if (this.hover)
				fill(255, 204, 0);
			else
				fill(224, 224, 224);
*/
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

	display_clutter_whimsy(side) {
		let v1 = createVector(this.x + this.size/2, this.y);
		let v2 = createVector(this.next_rand_between(2.2, 2.6), 0);
		let a = -HALF_PI + this.next_rand_between(PI * 0.2, PI * -0.2);
		v2.rotate(a);
		let angle = 0.04 * (this.next_rand() > 0.5 ? -1.0 : 1.0);
		let delta = 1.15;

		let tmp = null;
		let tmp_pos = Math.floor(this.next_rand_between(5, 12));

		for (let i=0; i<25; i++) {
			line(v1.x, v1.y, v1.x+v2.x, v1.y+v2.y);
			v1.add(v2);		

			let h = v2.heading();
			v2.rotate(angle);
			angle *= delta;

			if (i==tmp_pos) tmp = v1.copy();
			//v2.rotate(v2.heading());
		}

		v1 = createVector(tmp.x, tmp.y);
		v2 = createVector(2.4, 0);
		v2.rotate(tmp.heading()- PI*0.75);
		angle = -0.06 * (this.next_rand() > 0.5 ? -1.0 : 1.0);
		delta = 1.15;


		for (let i=0; i<20; i++) {
			line(v1.x, v1.y, v1.x+v2.x, v1.y+v2.y);
			v1.add(v2);		

			let h = v2.heading();
			v2.rotate(angle);
			angle *= delta;
		}


	}


	display_clutter() {
		if (!this.enabled) return;

		return;

		stroke(100,100,100);
		strokeWeight(1);

		this.jitter_pos = 10;

//		if (this.top && this.next_rand() < 0.1)
//		if (this.top)
//			this.display_clutter_whimsy(TOP);

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


class Group {
	constructor(squares) {
		this.squares = squares;
		this.centre_button = new RotateCenterButton(this, 0, 0);
		this.enabled = true;

		this.angle = 0;
		this.c_angle = 0; //The initial mouse rotation
		this.q_angle = 0;

		this.x1 = 5000;
		this.x2 = -1;
		this.y1 = 5000;
		this.y2 = -1;

		for (let i=0; i<this.squares.length; i++) {
			this.x1 = Math.min(this.squares[i].x, this.x1);
			this.y1 = Math.min(this.squares[i].y, this.y1);

			this.x2 = Math.max(this.squares[i].x + this.squares[i].size, this.x2);
			this.y2 = Math.max(this.squares[i].y + this.squares[i].size, this.y2);
		}

		// move all of the squares so their co-ords are
		// now internal co-ods
		// 0, 0 is at the center of the group box
		let halfx = (this.x2-this.x1)/2;
		let halfy = (this.y2-this.y1)/2;

		for (let i=0; i<this.squares.length; i++) {
			this.squares[i].x -= (this.x1 + halfx);
			this.squares[i].y -= (this.y1 + halfy);
		}

		// top right
		this.close_button = new CloseButton(this, halfx+10, -(halfy+10));

		// trigger the HATCHING
		//this.update(0, 0);
		this.enable_hatches();
	}

	display() {
		let halfx = (this.x2-this.x1)/2;
		let halfy = (this.y2-this.y1)/2;
		let x = this.x1 + halfx;
		let y = this.y1 + halfy;

		push();
		translate(x, y);
		rotate(this.angle);

		for (let i=0; i<this.squares.length; i++) {
			//this.squares[i].display_offset(x, y);
			this.squares[i].display();

			if (this.enabled)
				this.squares[i].display_clutter_debug();
		}

		if (this.enabled) {
			strokeWeight(2);
			stroke(0, 0, 255, 75);
			noFill();

			rect( -(halfx + 10), -(halfy + 10), halfx + 10, halfy + 10);

			//
			this.centre_button.render();
			this.close_button.render();			
		}

		pop();
	}

	mouseMoved(mx, my) {
		// TODO: "update()" can move into here (I think - need to check)

		// translate to local co-ordinates
		let x = this.x1 + (this.x2-this.x1)/2;
		let y = this.y1 + (this.y2-this.y1)/2;

		let v = createVector(mx, my);
		v.sub(x, y);
		v.rotate(-this.angle);

		this.centre_button.mouseMoved(v.x, v.y);
		this.close_button.mouseMoved(v.x, v.y);
	}

	mousePressed(mx, my) {
		let x = this.x1 + (this.x2-this.x1)/2;
		let y = this.y1 + (this.y2-this.y1)/2;
		// this.angle_offset = this.angle + atan2(my - y, mx - x);
		// this.angle_offset = atan2(my - y, mx - x);

		this.c_angle = atan2(my - y, mx - x); //The initial mouse rotation
		this.q_angle = this.angle; //Initial box rotation
	}

	mouseReleased(mx, my) {
		this.close_button.mouseReleased();
	}

	close_clicked() {
		this.enabled = false;
		gui_mode_group(-1);
	}

	update(mx, my) {

		let halfx = (this.x2-this.x1)/2;
		let halfy = (this.y2-this.y1)/2;
		//let x = this.x1 + halfx;
		//let y = this.y1 + halfy;

		for (let i=0; i<this.squares.length; i++) {

			let s = this.squares[i];
			let list = [];

			for (let j=0; j<s.hatch_list.length; j++) {
				// translate and rotate list
				let x = this.x1 + halfx + s.x + s.hatch_list[j][0];
				let y = this.y1 + halfy + s.y + s.hatch_list[j][1];

				let v = createVector(x, y);
				v.sub(this.x1 + halfx, this.y1 + halfy);
				v.rotate(this.angle);

				stroke(0, 0, 255);
				strokeWeight(3);
				v.add(this.x1 + halfx, this.y1 + halfy);


				list.push([Math.floor(v.x), Math.floor(v.y)]);
			}

			s.listener.disable_hatches(list);
		}
		

		if (this.centre_button.mouse_over) {
			// dragging
			this.x1 = mouseX - halfx;
			this.x2 = mouseX + halfx;

			this.y1 = mouseY - halfy;
			this.y2 = mouseY + halfy;

		} else {
			// rotating
			let x = this.x1 + (this.x2-this.x1)/2;
			let y = this.y1 + (this.y2-this.y1)/2;

			let m_angle = atan2(my - y, mx - x);

			let dangle = m_angle - this.c_angle; //How much the box needs to be rotated
			if (dangle>=TWO_PI) dangle-=TWO_PI; //clamping
			if (dangle<0) dangle+=TWO_PI; //clamping
			this.angle =  this.q_angle + dangle; //Apply the rotation
			if (this.angle>=TWO_PI) this.angle -= TWO_PI; //clamping
		}

		this.enable_hatches();
	}

	enable_hatches() {
		let halfx = (this.x2-this.x1)/2;
		let halfy = (this.y2-this.y1)/2;

		for (let i=0; i<this.squares.length; i++) {

			let s = this.squares[i];
			let list = [];

			for (let j=0; j<s.hatch_list.length; j++) {
				// translate and rotate list
				let x = this.x1 + halfx + s.x + s.hatch_list[j][0];
				let y = this.y1 + halfy + s.y + s.hatch_list[j][1];

				let v = createVector(x, y);
				v.sub(this.x1 + halfx, this.y1 + halfy);
				v.rotate(this.angle);

				// stroke(0, 0, 255);
				// strokeWeight(3);
				v.add(this.x1 + halfx, this.y1 + halfy);


				list.push([Math.floor(v.x), Math.floor(v.y)]);
			}

			s.listener.enable_hatches(list);
		}
		
		// this.listener.enable_hatches(this.hatch_list);
	}
}