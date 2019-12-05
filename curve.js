// reference:
// https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas

// TODO:

// lines of scatter and hatching
// select rooms and rotate


function draw_rib(posv, vec) {

	m = vec.copy();
	n = vec.copy();
	m.rotate(HALF_PI);
    n.rotate(-HALF_PI);

    m.setMag(15);
    n.setMag(15);

	// see the vectors drawn on screen
    push();
    stroke(0);
    strokeWeight(1);
    translate(posv.x, posv.y);
    line(0, 0, m.x, m.y);
    line(0, 0, n.x, n.y);
    pop();

    return [posv.x+m.x, posv.y+m.y, posv.x+n.x, posv.y+n.y];
}


var g_ppp = null;

function draw_grid(pts) {

	let i = 0;
	let start = 2;
	let tmp = [];

	// create a list of Vectors
	for(i=start; i<pts.length-2; i+=2) {
        let v = createVector(pts[i] - pts[i-2], pts[i+1] - pts[i-1]);
        tmp.push(v);
    }

	let step_size = 30;
	let overflow = 0;
	let gpos = createVector(pts[0], pts[1]);
	let top = [];
	let bot = [];


	for (let i=0; i<tmp.length; i++) {

		let v    = tmp[i];
		let dist = v.mag() + overflow;
		let count = Math.floor(dist/step_size);
		
		for (let p=1; p<=count; p++) {
			let o = v.copy();
			o.setMag(step_size * p - overflow); // <-- translate part way down v

		   	let t = p5.Vector.add(gpos, o);

		   	let xxx = draw_rib(t, o);
		   	top.push(xxx[0]);
		   	top.push(xxx[1]);
		   	bot.push(xxx[2]);
		   	bot.push(xxx[3]);
		}
		overflow = 0;
		gpos = p5.Vector.add(gpos, v);
		overflow = dist % step_size;

	}

if (top.length>3)
	g_ppp = [
		top[0],
		top[1],
		top[2],
		top[3]
	];


	pts = getCurvePoints(top, 0.6, false, 3);
    for(i=0;i<pts.length-2;i+=2) {
        line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
    }

    pts = getCurvePoints(bot, 0.6, false, 3);
    for(i=0;i<pts.length-2;i+=2) {
        line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
    }

}

function drawLines_path(pts, R, show_skeleton) {

    let debug = true;
    let start = 2; // <--- look!
    //let show_skeleton = true;


    if (show_skeleton) {
    	for(i=start; i<pts.length-2; i+=2) {
            // TODO: change this to offest the angle, not
            // random x, y.
            // BUG: the line can backtrack sometimes with this
            // algorithm
            let v = createVector(pts[i-2] - pts[i], pts[i-1] - pts[i+1]);
            let b = createVector(pts[i-2], pts[i-1]);

            u = v.copy();
            v.rotate(HALF_PI);
            u.rotate(-HALF_PI);

            v.setMag(5);
            u.setMag(5);
            

            // see the vectors drawn on screen
            push();
            stroke(220,220,220);
            strokeWeight(1);
            translate(b.x, b.y);
            line(0, 0, v.x, v.y);
            line(0, 0, u.x, u.y);
            pop();
        
        }
    }

    draw_grid(pts);

	if (show_skeleton) {
	    for(i=0;i<pts.length-2;i+=2) {
	    	stroke(220,220,220);
	    	strokeWeight(1);
	        line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
	    }
	}
}

function drawLines_path_old(pts, R) {

    let debug = true;
    let start = 2; // <--- look!

    for(i=start; i<pts.length-2; i+=2) {

        //
        // TODO: change this to measure SQUARE SIZE lengths
        // to make a tiled path
        //
        if (R.next_rand() > 0.7) {
            // TODO: change this to offest the angle, not
            // random x, y.
            // BUG: the line can backtrack sometimes with this
            // algorithm
            let v = createVector(pts[i-2] - pts[i], pts[i-1] - pts[i+1]);
            let b = createVector(pts[i-2], pts[i-1]);

            u = v.copy();
            v.rotate(HALF_PI);
            u.rotate(-HALF_PI);

            //v.normalize();
            v.setMag(13);
            u.setMag(13);
            

            if (debug) {
                // see the vectors drawn on screen
                push();
                stroke(0);
                strokeWeight(3);
                translate(b.x, b.y);
                line(0, 0, v.x, v.y);
                line(0, 0, u.x, u.y);
                pop();    
            }
            

            // let x = R.next_rand_between(-3, 3);
            // let y = R.next_rand_between(-3, 3);
            // pts[i] += x;
            // pts[i+1] += y;
            // pts[i+2] += x;
            // pts[i+3] += y;
        }
    }

    for(i=0;i<pts.length-2;i+=2) {
        line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
    }
}


function drawLines_grid(pts, R) {

    let show_skeleton = true;
    let start = 2; // <--- look!

    if (show_skeleton) {
	    for(i=start; i<pts.length-2; i+=2) {


	        let v = createVector(
	        	pts[i-2] - pts[i],	// x
	        	pts[i-1] - pts[i+1]	// y
	        );
	        let b = createVector(pts[i], pts[i+1]);

	        u = v.copy();
	        v.rotate(HALF_PI);
	        u.rotate(-HALF_PI);

	        v.setMag(3);
	        u.setMag(3);
	        
            // see the vectors drawn on screen
            push();
            stroke(255, 204, 0);
            strokeWeight(1);
            translate(b.x, b.y);
            line(0, 0, v.x, v.y);
            line(0, 0, u.x, u.y);
            pop();
        }

    }


    let dist = 31;
    let dist2 = 31;
    let left = [];
    let right = [];

    for(i=start; i<pts.length-2; i+=2) {


        let v = createVector(
        	pts[i-2] - pts[i],		// x
        	pts[i-1] - pts[i+1]		// y
        );

        dist2 += v.mag();

        if (dist2>30) {

        	// somewhere in this section is 
        	// the 30px position, we split the vector length
        	// into two bits
        	//            ------|------>
        	//          offset  &    d
        	//
        	let d = dist2 - 30;
        	let offset = v.mag() - d;
        	// get previous point
        	//let c = createVector(pts[i-2], pts[i-1]);
        	// calc distance down that line to 30px
        	
        	j = v.copy();
        	j.setMag(offset); // <-- translate part way down v
        	
        	m = j.copy();
        	n = j.copy();
        	m.rotate(HALF_PI);
	        n.rotate(-HALF_PI);

	        m.setMag(20);
	        n.setMag(20);

	        // see the vectors drawn on screen
            push();
            stroke(200,200,10);
            strokeWeight(1);
            translate(j.x, j.y);
            //line(0, 0, m.x, m.y);
            //line(0, 0, n.x, n.y);
            pop();

        	// OLD CODE
        	dist = 0;
        	let b = createVector(pts[i], pts[i+1]);

	        u = v.copy();
	        v.rotate(HALF_PI);
	        u.rotate(-HALF_PI);

	        v.setMag(15);
	        u.setMag(15);
	        

            // see the vectors drawn on screen
            push();
            stroke(10,10,10);
            strokeWeight(1);
            translate(b.x, b.y);
            //line(0, 0, v.x, v.y);
            line(0, 0, u.x, u.y);
            pop();

            left.push(b.x +v.x);
            left.push(b.y +v.y);
            right.push(b.x +u.x);
            right.push(b.y +u.y);
        }
    }


    if (show_skeleton) {
    	for(i=0;i<pts.length-2;i+=2) {
    		stroke(200,55,50);
        	line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
    	}
    }
    

    stroke(0);

    pts = getCurvePoints(left, 0.6, false, 3);
    for(i=0;i<pts.length-2;i+=2) {
        //line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
    }

    pts = getCurvePoints(right, 0.6, false, 3);
    for(i=0;i<pts.length-2;i+=2) {
        line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
    }
}


function drawLines_sketchy(pts, R) {

    let debug = false;
    let start = 2; // <--- look!

    for(i=start; i<pts.length-2; i+=2) {
        if (R.next_rand() > 0.7) {

            let v = createVector(pts[i-2] - pts[i], pts[i-1] - pts[i+1]);

            u = v.copy();
            v.rotate(HALF_PI);
            u.rotate(-HALF_PI);

            let mag = 0.9;
            if (R.next_rand() > 0.5) {
            	mag = 1.2;
            }

            v.setMag(mag);
            u.setMag(mag);
            

            if (debug) {

            	let b = createVector(pts[i], pts[i+1]);
                // see the vectors drawn on screen
                push();
                stroke(200,90,70);
                strokeWeight(1);
                translate(b.x, b.y);
                line(0, 0, v.x, v.y);
                line(0, 0, u.x, u.y);
                pop();    
            }
            

            if (R.next_rand() > 0.5) {
            	// Alternate the line moving left or right from
            	// the center line
                v = u;
            }

            // line(
            // 	pts[i-2] + v.x, pts[i-1] + v.y,
            // 	pts[i] + v.x, pts[i+1] + v.y
            // );

            //if (false && R.next_rand() < 0.7) {
            	// altering these x, y co-ords in the array
            	// means the line WILL JOIN with any other
            	// lines. If this does NOT run, there is a
            	// little break in the lines.
            	pts[i]   += v.x;
	            pts[i+1] += v.y;
	            pts[i+2] += v.x;
	            pts[i+3] += v.y;
            //}


        } else {
        	//line(pts[i-2], pts[i-1], pts[i], pts[i+1]);
        }
    }

    // now we have a suitabley wiggly line
    // we'll draw it. With a few breaks in it
    // where the pen was lifted up from the paper
    // To match the rooms, we'll do this every 30px
    let len = 0;
     for(i=0;i<pts.length-2;i+=2) {

         let v = createVector(pts[i] - pts[i+2], pts[i+1] - pts[i+3]);
         len += v.mag();

         if (len > 90) {
         	len = 0;

         	if (R.next_rand() > 0.5) {
         		v.rotate(HALF_PI);
         	} else {
         		v.rotate(-HALF_PI);
         	}
         	v.setMag(1.8);
         	// broken line:
         	line(pts[i]+v.x, pts[i+1]+v.y, pts[i+2], pts[i+3]);
         } else {
         	// unbroken line:
         	line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
         }

     }

}

function drawLines_smooth(pts) {

    for(i=0;i<pts.length-2;i+=2) {
      line(pts[i], pts[i+1], pts[i+2], pts[i+3]);
    }
}

function drawCurve(ptsa, tension, isClosed, numOfSegments, showPoints, R, show_skeleton) {

    showPoints  = showPoints ? showPoints : false;

    //ctx.beginPath();
/*
    drawLines_sketchy(
        getCurvePoints(ptsa, tension, isClosed, numOfSegments),
        R
    );
*/
    drawLines_path(
        getCurvePoints(ptsa, tension, isClosed, numOfSegments),
        R, show_skeleton
    );

    if (showPoints) {
        ctx.stroke();
        ctx.beginPath();
        for(var i=0;i<ptsa.length-1;i+=2) 
                ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
    }
}

function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}