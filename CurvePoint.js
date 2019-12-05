class CurvePoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	render() {
		//strokeWeight(1);
		//stroke(0);

		if (this.is_over()) {
			fill(90,140,90);
		} else {
			fill(255,255,255,50);
		}
		circle(this.x, this.y, 8);
	}

	is_over(x, y) {
		let d = int(dist(mouseX, mouseY, this.x, this.y));
		return d < 8;
	}

	is_near(x, y) {
		let d = int(dist(mouseX, mouseY, this.x, this.y));
		return d < 10;
	}
}
