
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

		stroke(255);
		strokeWeight(0);
		fill(255);
		triangle(
			this.x1, this.y1,
			this.x2, this.y2,
			this.x3, this.y3
		);

		stroke(100);
		strokeWeight(1);

		for (let i=0; i<this.lines.length; i++) {
			line(
				this.lines[i][0], this.lines[i][1],
				this.lines[i][2], this.lines[i][3]
			);
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
		for (let i=c; i<1; i+=c) {
			// how much the lines wander up and down
			// the vector:
			//       /\
			//      /  \
			//     /    \
			//    +------+
			//   /        \
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

			this.lines.push([
				this.x1 + v1.x, this.y1 + v1.y,
				this.x1 + v2.x, this.y1 + v2.y
			]);
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
let attractors = [];
let triangles = [];

let dots2 = [];
let dots3 = [];
let dots4 = [];
let d_triangles = [];

function draw_clutter() {

	stroke(139, 235, 65);
	strokeWeight(3);
	for (let p=0; p<attractors.length; p++) {
		point(attractors[p][0], attractors[p][1]);
	}

	for (let p=0; p<triangles.length; p++) {
		triangles[p].draw();
	}

	stroke(50,30,255);
	strokeWeight(3);
		
	for (let i=0; i<dots3.length; i++) {
		point(dots3[i][0], dots3[i][1]);
	}

	for (let p=0; p<d_triangles.length; p++) {
		d_triangles[p].draw();
	}


}

function create_clutter_dots() {
	// TO DO: https://www.youtube.com/watch?v=1B7YUp5Bvtk
	var baseX = 2;
	var baseY = 3;

//	for (let i=1; i<30; i++) {
//		dots.push([halton(i, baseX)*600, halton(i, baseY)*600]);
//	}

	for (let i=0; i<20; i++) {
		dots.push([100 + i * 30, 300 - i]);
	}

	for (let i=0; i<21; i++) {
		dots.push([100 + i * 30, 320 - i]);
	}

/*
	let v1 = createVector(300, 300);
	let v2 = createVector(14, 0);
	v2.rotate(TWO_PI * random());
	let angle = 0.05;
	let delta = 1.02;

	for (let i=0; i<70; i++) {
		attractors.push([v1.x, v1.y]);
		v1.add(v2);		

		let h = v2.heading();
		v2.rotate(angle);
		angle *= delta;

		//v2.rotate(v2.heading());
	}
*/

	for (let p=0; p<19; p++) {
		triangles.push(
			new Triangle(
				dots[p][0], dots[p][1],
				dots[p+20][0], dots[p+20][1],
				dots[p+21][0], dots[p+21][1]
			)
		);

		triangles.push(
			new Triangle(
				dots[p][0], dots[p][1],
				dots[p+1][0], dots[p+1][1],
				dots[p+21][0], dots[p+21][1]
			)
		);
	}

/*
	for (let p=0; p<dots.length; p++) {
		let close = closest(dots[p][0], dots[p][1]);
		triangles.push(
			new Triangle(
				dots[p][0], dots[p][1],
				dots[close[0]][0], dots[close[0]][1],
				dots[close[1]][0], dots[close[1]][1]
			)
		);
	}
*/

	for (let i=1; i<40; i++) {
		dots2.push([100+ halton(i, baseX)*100, 100+halton(i, baseY)*100]);
	}

	for (let i=0; i<dots2.length; i++) {
		let x = dots2[i][0];
		let y = dots2[i][1];

		let v = createVector(15, 0);
		v.rotate(TWO_PI*random());

		let t = [];
		t.push(x + v.x, y + v.y);
		v.rotate(TWO_PI/3);
		t.push(x + v.x, y + v.y);
		v.rotate(TWO_PI/3);
		t.push(x + v.x, y + v.y);

		triangles.push(new Triangle(
			t[0], t[1],
			t[2], t[3],
			t[4], t[5]
		));
	}

	for (let i=1; i<30; i++) {
		dots3.push([240+ halton(i, baseX)*150, 100+halton(i, baseY)*150]);
	}


	for (let p=0; p<dots3.length; p++) {
		let close = closest3(dots3[p][0], dots3[p][1]);
		triangles.push(
			new Triangle(
				dots3[p][0], dots3[p][1],
				dots3[close[0]][0], dots3[close[0]][1],
				dots3[close[1]][0], dots3[close[1]][1]
			)
		);
	}


	for (let i=1; i<45; i++) {
		dots4.push([200+ halton(i, baseX)*150, 340+halton(i, baseY)*150]);
	}

	const delaunay = Delaunator.from(dots4);

	function xxxx(i, tri) {
		d_triangles.push(new Triangle(
			tri[0][0], tri[0][1],
			tri[1][0], tri[1][1],
			tri[2][0], tri[2][1]
		));
	}

	forEachTriangle(dots4, delaunay, xxxx);

	d_triangles.push(new Triangle(
		410, 380,
		390, 400,
		430, 400
	));

	d_triangles.push(new Triangle(
		460, 380,
		440, 400,
		480, 400
	));
}

function closest3(x, y) {

	// 600 px is a big enough non squared distance
	let dist = 600 * 600;
	let dist2 = dist;
	let pos = -1;
	let pos2 = -1;

	for (let p=0; p<dots3.length; p++) {
		let dx = dots3[p][0]-x;
		let dy = dots3[p][1]-y;
		let d = dx*dx + dy*dy;
		if (d!=0 && d < dist) {
			pos = p;
			dist = d;
		}

		if (d!=0 && d!=dist && d < dist2) {
			pos2 = p;
			dist2 = d;
		}
	}

	return [pos, pos2];
}

function closest(x, y) {

	// 600 px is a big enough non squared distance
	let dist = 600 * 600;
	let dist2 = dist;
	let pos = -1;
	let pos2 = -1;

	for (let p=0; p<dots.length; p++) {
		let dx = dots[p][0]-x;
		let dy = dots[p][1]-y;
		let d = dx*dx + dy*dy;
		if (d!=0 && d < dist) {
			pos = p;
			dist = d;
		}

		if (d!=0 && d!=dist && d < dist2) {
			pos2 = p;
			dist2 = d;
		}
	}

	return [pos, pos2];
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

