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

	}
}