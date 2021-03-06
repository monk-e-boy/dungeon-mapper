

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
		if (d < this.size/2) {
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

class RemoveButton2 extends Buttonx {

	mouseReleased() {
		this.parent.delete();
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

	render(mouse_x, mouse_y) {

		this.size = 13;
		let is_over = this.is_over(mouse_x, mouse_y);
		if (is_over) {
			// drop shadow
			fill(140,140,140,125);
			noStroke();
			circle(this.x, this.y+1, this.size + 4);

			fill(238,17,17);
		} else {
			fill("#ffffff");
		}

		stroke("#000000");
		strokeWeight(1);
		// - dec font size
		push();
		translate(this.x, this.y);
		circle(0, 0, this.size);
		if (is_over)
			stroke("#ffffff");
		line(-4, -4, 4, 4);
		line(4, -4, -4, 4);
		pop();
	}
}

class AddButton extends Buttonx {

	mouseReleased() {
		this.parent.add_point();
	}

	render(mouse_x, mouse_y) {
		
		this.size = 13;
		if (this.is_over(mouse_x, mouse_y)) {

			// drop shadow
			fill(140,140,140,125);
			noStroke();
			circle(this.x, this.y+1, this.size + 4);
			fill(255, 204, 0);
		} else {
			fill("#ffffff");
		}

		stroke(0);
		strokeWeight(1);
		// + inc font size
		push();
		translate(this.x, this.y);
		circle(0, 0, 13);
		line(-4, 0, 4, 0);
		line(0, -4, 0, 4);
		pop();
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