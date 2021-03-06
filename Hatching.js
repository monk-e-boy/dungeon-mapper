class HandDrawnGraphics {
	constructor() {
		this.r = new Rand();
	}

	// returns an array of lines
	// that look hand drawn
	// some ideas from here (we don't use curves)
	//   http://stevehanov.ca/blog/index.php?id=33
	//
	// this is interesting:
	//   https://github.com/pshihn/rough
	//
	line(x1, y1, x2, y2) {

		let lines = [];

		let v = createVector(
			x2 - x1,
			y2 - y1,
			);

		if (true || v.mag() > 8) {

			let mid = v.copy();
			mid.mult(0.5);
			let mid2 = v.copy();
			mid2.mult(0.5);
			mid2.add(mid);

			mid.rotate(this.r.next_rand_between(0.1, -0.1));// + );

			let start = v.copy();
			start.normalize();		// 1px length
			// 3px in 'wrong' direction - sketchy start
			start.mult(this.r.next_rand_between(-4, 3));
			start.rotate(start.heading() + this.r.next_rand_between(-1, 1));

			let end = start.copy();
			end.rotate(end.heading());	// flip it 180
			mid2.add(end);

			lines.push([
				x1 + start.x,
				y1 + start.y,
				x1 + mid.x,
				y1 + mid.y,
			]);

			lines.push([
				x1 + mid.x,
				y1 + mid.y,
				x1 + mid2.x,
				y1 + mid2.y,
			]);
		}

		return lines;
	}
}

byHand = null;// see script new HandDrawnGraphics();


//
// The big list of things I googled and investigated:
//
// https://en.wikipedia.org/wiki/Delaunay_triangulation
// https://gist.github.com/bpeck/1889735
// https://github.com/ironwallaby/delaunay/blob/master/delaunay.js
// quasi random

function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }

function pointsOfTriangle(delaunay, t) {
    return edgesOfTriangle(t)
        .map(e => delaunay.triangles[e]);
}

function forEachTriangle(points, delaunay, callback) {
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        callback(t, pointsOfTriangle(delaunay, t).map(p => points[p]));
    }
}

class HatchThis {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		// flag to monitor if the hatching
		// algorithm has visted this item yet
		this.visited = false;
	}
}

class HatchListener {
	constructor() {
		// TODO: put list of triangles here?
		this.points = [];
		this.pos = 0;
	}

	// takes a list of lines, hatches
	// under those lines are enabled
	enable_hatches(points) {
		this.points.push(...points);
		this.pos = 0;

		// TODO: move this into script->draw()
		this.update();
	}

	disable_hatches(points) {		
		const filteredItems = this.points.filter(item => !points.includes(item));

		for (let p=0; p<d_triangles.length; p++) {
			d_triangles[p].visible = false;
		}

		this.points = filteredItems;
		this.pos = 0;

		// TODO: move this into script->draw()
		this.update();
	}

	update() {
		for (let i=0; i<this.points.length; i++) {

			for (let p=0; p<d_triangles.length; p++) {
				if (d_triangles[p].is_over(this.points[i])) {
					d_triangles[p].visible = true;
				}
			}
		}
	}


}

class Triangle {
	constructor(x1, y1, x2, y2, x3, y3) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;

		this.lines = [];
		this.hatch();

		this.visible = false;
	}

	// http://jsfiddle.net/PerroAZUL/zdaY8/1/
	ptInTriangle(p, p0, p1, p2) {
		var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
		var sign = A < 0 ? -1 : 1;
		var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
		var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

		return s > 0 && t > 0 && (s + t) < 2 * A * sign;
	}

	is_over(point) {
		let x1 = point[0];
		let y1 = point[1];

		if (
			this.ptInTriangle(
				{x: x1, y: y1},
				{x: this.x1, y: this.y1},
				{x: this.x2, y: this.y2},
				{x: this.x3, y: this.y3}
				)
			) {
			return true;
		}

		return false;
	}

	draw() {

		let debug = false;
//		let debug = true;
		if(debug) {
			stroke(200,200,200);
			strokeWeight(1);
			noFill();

			triangle(
				this.x1, this.y1,
				this.x2, this.y2,
				this.x3, this.y3
			);

			stroke(255,50,30);
			strokeWeight(3);

			point(this.x1, this.y1);
			point(this.x2, this.y2);
			point(this.x3, this.y3);
		}

		if (!this.visible) return;

		if (false) {
			// fill background with white
			// don't think we need this as
			// triangles don't overlap
			stroke(255);
			strokeWeight(0);
			fill(255);
			triangle(
				this.x1, this.y1,
				this.x2, this.y2,
				this.x3, this.y3
			);
		}
		

		stroke(100);
		strokeWeight(1);

		for (let i=0; i<this.lines.length; i++) {
			line(this.lines[i][0], this.lines[i][1], this.lines[i][2], this.lines[i][3]);
		}

	}

	hatch() {

		if (random() > 0.5) this.rotate();
		if (random() > 0.5) this.rotate();

		//
		// TODO TODO!!
		// measure the triangle and put lines in
		// that are all similary distance apart
		//

		let r = new Rand();

		let v1 = createVector(this.x2-this.x1, this.y2-this.y1);
		let v2 = createVector(this.x3-this.x1, this.y3-this.y1);
		let v3 = createVector(this.x3-this.x2, this.y3-this.y2);

		let m1 = v1.mag();
		let m2 = v2.mag();
		let m3 = v3.mag();

		// TODO: choose the smallest for our base (short
		// hatches are pretty)
		let base = m3; // <<-- fix this

		// TODO: make this better:
		// get area of triangle (Herons formula):
		let semiperimeter = (m1 + m2 + m3) / 2;
		let area = Math.sqrt(
			semiperimeter *
			(semiperimeter-m1) *
			(semiperimeter-m2) *
			(semiperimeter-m3)
		);
		let height = (2 * area) / base;
		

		// How much the lines fan (are not parallel)
		let fan1 = r.next_rand_between(5, 20) / 100;
		let fan2 = 1 - (2*fan1);

		// Draw a ling approx every 5px to
		// match the old hatching
		let c = 1 / (height / r.next_rand_between(4.9, 7.5));
		c *= 0.95;
		for (let i=c; i<1; i+=c) {
			// how much the lines wander up and down
			// the left and right vectors:
			//       /\
			//      /  \
			//     /    \
			//    +------+   <--- this is the line / hatch we are
			//   /        \       calculating
			//  /          \
			// v1          v2
			//
			// change the MAG of v1 to retreat back to
			// the + position (same with v2) then use
			// v1.x, v1.y as start pos, and v2.x, v2.y
			// as end of line
			//
			let jitter = 0;// r.next_rand_between(-3, 3);
			v1.setMag((m1 * i) + jitter);
			v2.setMag(fan1*m2 + ((m2 * i) * fan2) - jitter);

			this.lines.push(
				...byHand.line(
					this.x1 + v1.x, this.y1 + v1.y,
					this.x1 + v2.x, this.y1 + v2.y
				)
			);
		}

	}

	rotate() {
		let x = this.x1;
		let y = this.y1;
		this.x1 = this.x2;
		this.y1 = this.y2;
		this.x2 = this.x3;
		this.y2 = this.y3;
		this.x3 = x;
		this.y3 = y;
	}
}

let dots = [];

let d_triangles = [];

// lines that will enable hatching
let hatch_this = [];
// TODO: maybe fix the name of this?
// TODO: move this into script->setup
let hatch_listener = new HatchListener();

function draw_clutter() {

	for (let p=0; p<d_triangles.length; p++) {
		d_triangles[p].draw();
	}

}

function create_clutter_dots() {
	// TO DO: https://www.youtube.com/watch?v=1B7YUp5Bvtk
	var baseX = 2;
	var baseY = 3;

	for (let i=1; i<600; i++) {
		dots.push([halton(i, baseX)*660-30, halton(i, baseY)*660-30]);
	}

	const delaunay = Delaunator.from(dots);

	function xxxx(i, tri) {
		d_triangles.push(new Triangle(
			tri[0][0], tri[0][1],
			tri[1][0], tri[1][1],
			tri[2][0], tri[2][1]
		));
	}

	forEachTriangle(dots, delaunay, xxxx);

}


// https://gist.github.com/bpeck/1889735
function halton(index, base) {
	var result = 0;
	var f = 1 / base;
	var i = index;
	while(i > 0) {
		result = result + f * (i % base);
		i = Math.floor(i / base);
		f = f / base;
	}
	return result;
};

