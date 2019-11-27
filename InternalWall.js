
class InternalWall {
  constructor() {
    this.points = [];
    // this.closed = false;
    this.editing = true;
    this.R = new Rand();

    //
    this.cache_curve = [];

    this.add_button = new AddButton(this, 0, -12);
    this.remove_button = new RemoveButton(this, 10, -12);
    
    this.angle = 0;
    
    this.dead = false;
  }

  // TODO merge with other curved lines
   add_point() {
	let end = this.points[this.points.length-1];

	if (this.points.length > 2) {
		//
		// Insert the new point half way between point 0
		// and the END point - very close to the button
		// that the user has clicked
		//
		let e2 = this.points[0];
		let x = (e2.x - end.x) / 2;
		let y = (e2.y - end.y) / 2;
		this.add(end.x + x, end.y + y);

	} else {
	    this.add(end.x + 5, end.y + 5);
	}
  }

  add(x, y) {
    this.points.push(new CurvePoint(x, y));
  }

  delete() {
  	this.dead = true;
  }

  is_mouse_near_me() {
  	// check all the user clicked points:
  	for (let c=0; c<this.points.length; c++) {
        if (this.points[c].is_near()) {
        	return true;
        }
    }

    // check the curve between the points:
    for(let i=0; i<this.cache_curve.length-2; i+=2) {
	    let p = new CurvePoint(this.cache_curve[i], this.cache_curve[i+1]);
	    if (p.is_near())
	    	return true;
	}

	// check if close to the buttons:
	let p1 = this.points[0];
	if (this.remove_button.is_near(mouseX - p1.x, mouseY - p1.y))
		return true;
	if (this.add_button.is_near(mouseX - p1.x, mouseY - p1.y))
		return true;

  }


  mouseReleased() {

  	let p1 = this.points[0];

  	if (this.remove_button.is_over(mouseX - p1.x, mouseY - p1.y)) {
  		this.remove_button.mouseReleased();
  		return;
  	}

  	if (this.add_button.is_over(mouseX - p1.x, mouseY - p1.y)) {
  		this.add_button.mouseReleased();
  		return;
  	}

  }

  render_buttons() {
	 let p1 = this.points[0];

     push();
     translate(p1.x, p1.y);

    this.add_button.render();
    this.remove_button.render();

    pop();

  }

  draw_curve(cache_curve, R, mouse_near_curve) {
  	drawLines_sketchy(cache_curve, R);//, mouse_near_curve);
  }

  render() {

  	// this.angle += 0.05;

  	push();
  	rotate(this.angle);
  	this.render_2();
  	pop();
  }

  render_2() {

    let myPoints = [];
    let mouse_near_curve = false;

    if ( this.points.length > 2) {
      stroke(176,196,222);

      mouse_near_curve = this.is_mouse_near_me() || this.editing;
      
      for (var c=0; c<this.points.length-1; c++) {
        let p1 = this.points[c];
        let p2 = this.points[c+1];
        //if (mouse_near_curve)
          //line(p1.x, p1.y, p2.x, p2.y);

        myPoints.push(p1.x);
        myPoints.push(p1.y);
      }

      let p = this.points[this.points.length-1];
      myPoints.push(p.x);
      myPoints.push(p.y);

      if (this.editing) {
      	// user is dragging a point around.
      	// add mouse position into the curved line:
        myPoints.push(mouseX);
        myPoints.push(mouseY);

        // DEBUG HELP: change the colour to RED to
        // see the line clearly:
        //stroke(90,90,90);
        //p = this.points[this.points.length -1];
        // draw a straight line to mouse:
        //line(p.x, p.y, mouseX, mouseY);  
      }

      
    }

    stroke(0);

    var tension = 0.6;
    var numOfSegments = 8;
    this.R.reset();


    // TODO: we may need to cache this in the future,
    // at the moment I don't bother. It seems pretty
    // quick ... but I worry when we have 1,000 curved paths
    // things may get slow
    this.cache_curve = getCurvePoints(myPoints, tension, this.closed, numOfSegments);
    this.draw_curve(this.cache_curve, this.R, mouse_near_curve);

   

    stroke(176,196,222);
    if (mouse_near_curve || /* TODO: global var */ gui_mode == mode_add_points) {
      for (var c=0; c<this.points.length; c++) {
        this.points[c].render();
      } 
    }

    // RENDER BUTTONS last
    if ( !this.editing && mouse_near_curve){
      	this.render_buttons();
     }
  }
}




