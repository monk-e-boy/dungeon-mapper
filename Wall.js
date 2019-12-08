class Wall {
	constructor(square) {
		this.parent = square;
		this.door = false;
		this.r = new Rand();
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

	is_near(x, y) {
		return y > this.parent.y - 7 && y < this.parent.y + 7 &&
			   x > this.parent.x && x < this.parent.x + this.parent.size;
	}

	display() {
		this.r.reset();
		stroke(0,0,0);
		strokeWeight(1);
		push();
		translate(this.parent.x, this.parent.y-3);

		// white background:
		fill(255);
		strokeWeight(0);
		rect(0, 0, this.parent.size, 6);

		strokeWeight(1);

		if (this.r.next_rand() > 0.5) {
			// two lines
			var y1 = (this.r.next_rand() * 3) - 1.5;
			line(0, y1, this.parent.size, -y1);
		} else {
			var y1 = ((this.r.next_rand() * 10 % 1) - 0.5) * 3;
			var y2 = ((this.r.next_rand() * 100 % 1) - 0.5) * 3;
			line(0, y1, this.parent.size/2, -y1);
			line(this.parent.size/2, -y1, this.parent.size, y2);
		}

		pop();


		push();
		translate(this.parent.x, this.parent.y+3);


		if (this.r.next_rand() > 0.5) {
			// two lines
			var y1 = (this.r.next_rand() * 3) - 1.5;
			line(0, y1, this.parent.size, -y1);
		} else {
			var y1 = ((this.r.next_rand() * 10 % 1) - 0.5) * 3;
			var y2 = ((this.r.next_rand() * 100 % 1) - 0.5) * 3;
			line(0, y1, this.parent.size/2, -y1);
			line(this.parent.size/2, -y1, this.parent.size, y2);
		}

		pop();

		if (this.door) {
			var y1 = (this.r.next_rand() * 2) - 1;
			let door_size = this.parent.size/4;
			push();
			translate(this.parent.x + this.parent.size/2, this.parent.y-3);

			fill(224, 224, 224);
			quad(
				-door_size-y1, +y1,
				 door_size+y1, -y1,
				 door_size+y1, 6-y1,
				-door_size-y1, 6+y1
			);

			pop();
		}

	}
}

class WallVert extends Wall {

	is_near(x, y) {

		return y > this.parent.y && y < this.parent.y + this.parent.size &&
			   x > this.parent.x - 7 && x < this.parent.x + 7;
	}

	display_line() {
		if (this.r.next_rand() > 0.5) {
			// two lines
			var x1 = (this.r.next_rand() * 3) - 1.5;
			line(x1, 0, -x1, this.parent.size);
		} else {
			var x1 = ((this.r.next_rand() * 10 % 1) - 0.5) * 3;
			var x2 = ((this.r.next_rand() * 100 % 1) - 0.5) * 3;
			line(x1, 0, -x1, this.parent.size/2);
			line(-x1, this.parent.size/2, x2, this.parent.size);
		}
	}

	display() {
		this.r.reset();
		stroke(0,0,0);
		strokeWeight(1);
		push();
		translate(this.parent.x-3, this.parent.y);

		// white background:
		fill(255);
		strokeWeight(0);
		rect(0, 0, 6, this.parent.size);

		strokeWeight(1);
		this.display_line();
		pop();

		push();
		translate(this.parent.x+3, this.parent.y);
		this.display_line();
		pop();

		if (this.door) {
			var x1 = (this.r.next_rand() * 2) - 1;
			let door_size = this.parent.size/4;
			push();
			translate(this.parent.x-3, this.parent.y + this.parent.size/2);

			fill(224, 224, 224);
			quad(
				  x1, -door_size-x1,
				 -x1,  door_size+x1,
				6-x1,  door_size+x1,
				6+x1, -door_size-x1
			);

			pop();
		}

	}
}