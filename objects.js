class Objects {

	load(data) {

		// this.reset();

		// TODO: remove this ugly global
		objects = [];

		for (let i=0; i<data.length; i++) {
			let c = data[i];
			if (c.t == 0) {
				objects.push(new Column(c.x, c.y, c.s));
			} else if (c.t == 1) {
				let s = new Scatter(c.x, c.y, c.s);
				s.jitter = c.j;
				objects.push(s);
			} else if (c.t == 2) {
				objects.push(new Stairs(c.x, c.y, c.d));
			}
		}
	}
}


class Column {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.hover = false;
		this.click = false;
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

	save() {
		// return a json representation of this object
		return {
			t: 0, // <-- type
			x: this.x,
			y: this.y,
			s: this.size
		};
	}

	is_over(x, y) {
		let d = int(dist(x, y, this.x, this.y));
		return d < this.size;
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

	display() {
		this.jitter_pos = 10;
		strokeWeight(1);
		if (this.hover) {
			stroke("#1289A7");
			fill('#12CBC4');
		} else {
			stroke("#000000");
			fill('#ffffff');
		}
		this.stone(this.x, this.y, this.size, 11);
		
	}
}

class Scatter extends Column {
	constructor(x, y, size) {
		super(x, y, size);
		this.life = 3;
	}

	save() {
		// return a json representation of this object
		return {
			t: 1, // <-- type
			x: this.x,
			y: this.y,
			s: this.size,
			j: this.jitter
		};
	}

	display() {

		super.display();

		this.jitter_pos = 11;
		strokeWeight(1);
		if (this.hover) {
			stroke("#1289A7");
			fill('#12CBC4');
		} else {
			stroke("#000000");
			fill('#ffffff');
		}

		for (let i=0; i<this.next_rand() * 5; i++) {

			let size = this.size * this.next_rand();
			let angle = TWO_PI * this.next_rand();
			let radius = this.size * 1.2 + (this.size * 2.6 * this.next_rand());
			
			let sx = cos(angle) * radius;
			let sy = sin(angle) * radius;

			this.stone(this.x+sx, this.y+sy, size, 9);

		}

		// Not sure if I'll keep this, but this shows the current life
		// keep clicking to kill it
		if (this.hover) {
			textAlign(LEFT);
			textSize(14);
			textFont(font);
			var bbox = font.textBounds(this.life.toString(), this.x, this.y, 14, LEFT);

			noStroke();
			fill('#000000');
			text(this.life.toString(), this.x-bbox.w/2, this.y);

		}
	}

}