

class Buttonx {
	constructor(parent, x, y) {
		// x and y are relative to parent/containter
		this.x = x;
		this.y = y;
		this.size = 8;
		this.parent = parent;
	}

	is_over(x, y) {
		let d = int(dist(x, y, this.x, this.y));
		if (d < this.size) {
			return true;
		}
		return false;
	}

	mouseReleased() {
	}

	is_near(x, y) {
		let d = int(dist(x, y, this.x, this.y));
		return d < this.size * 1.2;
	}

	render() {
		// add point
		fill(255,50,50);
		circle(this.x, this.y, this.size);
 	}
}

class RemoveButton extends Buttonx {

	mouseReleased() {
		this.parent.delete();
	}

	render() {
		// add point
		fill(255,50,50);
		circle(this.x, this.y, this.size);
 	}
}

class AddButton extends Buttonx {

	mouseReleased() {
		this.parent.add_point();
	}

	render() {
		// add point
		fill(50,255,50);
		circle(this.x, this.y, this.size);
 	}
}

class ColourFlipButton extends Buttonx {

	mouseReleased() {
		this.parent.set_colour();
	}

	render() {
		// add point
		fill(0);
		circle(this.x, this.y, this.size);
		fill(255);
		arc(this.x, this.y, this.size, this.size, HALF_PI/2, PI+HALF_PI/2);
 	}
}