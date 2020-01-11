//let TOP = 1
//let BOTTOM = 2
//let LEFT = 3
//let RIGHT = 4

p5.disableFriendlyErrors = true; // disables FES


let rooms = null;
let _object = null;
var squares = [];
var columns = 25;
var mouse_mode = 1;
let font, fontsize = 32;
let font2, fontsize2 = 32;
let font_LaBelleAurore;
let objects = [];
let gui_texts = [];
let lines = [];
let walls = [];
// groups of rooms:
let groups = [];

// dragging a point in a line:
let drag_point = null;

// MODES:
let mode_none = 0;
let mode_save_png = 11;
let mode_save_png_x2 = 16;
// line modes:
let mode_drag = 132;
let mode_add_points = 131;
let mode_wall = 14;
let mode_select = 15;
let mode_group_interaction = 17;

let gui_mode = mode_none;

function toggle_gui_all_off() {
	var x = document.getElementsByClassName("toggle");
	for (var i=0; i < x.length; i++) {
		x[i].classList.remove("toggle-on");
	}
}

function toggle_gui_mode(mode) {

	toggle_gui_all_off();

	if (gui_mode != mode) {
		gui_mode = mode;
		var element = document.getElementById("toolbar-button-"+mode);
  		element.classList.toggle("toggle-on");
	} else {
		gui_mode = mode_none;
	}
}

function gui_mode_group(id) {
	for (let i=0; i<groups.length; i++) {
		groups[i].enabled=false;
	}

	if (id != -1) {
		gui_mode = mode_group_interaction;
		groups[id].enabled=true;
	} else {
		// bottom layer chosen
		gui_mode = mode_none;
	}

	
	// set the GUI reflect internal state
	// turn off all selected indeicators
	var element = document.getElementById("layer-bottom");
	element.className = "";
	for (let i=0; i<groups.length; i++) {
		var element = document.getElementById("layer-"+i);
		element.className = "";
	}

	if (id==-1) {
		var element = document.getElementById("layer-bottom");
		element.className = "selected";
	} else {
		var element = document.getElementById("layer-"+id);
		element.className = "selected";
	}	
}

function preload() {
	// Ensure the .ttf or .otf font stored in the assets directory
	// is loaded before setup() and draw() are called
	font = loadFont('SourceSansPro-Regular.otf');
	font_AmaticSC = loadFont('AmaticSC-Regular.ttf');
	font_LaBelleAurore = loadFont('LaBelleAurore-Regular.ttf');
	font_Sunshiney = loadFont('fonts/Sunshiney/Sunshiney-Regular.ttf');

}

function setup() {
	randomSeed(33);
	var canvas = createCanvas(600, 600);
	canvas.parent('sketch-holder');

	textFont(font);
	textSize(fontsize);
	textAlign(CENTER, CENTER);

	var size = 30;

	byHand = new HandDrawnGraphics();
	rooms = new Rooms(columns, columns, size);
	_object = new Objects();

	rooms.add_event_listener("show", hatch_listener);

	get_data_from_url();

	//  https://github.com/zenozeng/p5.js-pdf
	create_clutter_dots();

}

let rot = 0.0;

function pre_draw() {

	if (gui_mode == mode_save_png_x2) {
		resizeCanvas(1200, 1200);
		push();
		scale(2.0);
	}

	if (gui_mode == mode_save_png) {
		gui_mode = 0;
		save();
		return;
	}

	if (gui_mode == 12) {
		gui_mode = 0;
		make_url();
		return;
	}

	for (let objs=0; objs<gui_texts.length; objs++) {
		if (gui_texts[objs].is_dead) {
			gui_texts.splice(objs, 1);
		}
	}

	for (let i=0; i<lines.length; i++) {
		if(lines[i].dead)
			lines.splice(i, 1);
	}	
}

function pre_draw_events() {

	let dispatched = false;

	// the user is editing some text -
	// don't show any mouse_over's as they move the
	// mouse around the canvas
	for (let objs=0; objs<gui_texts.length; objs++) {
		if (gui_texts[objs].active) {
			dispatched = true;
		}
	}


	if ( !dispatched ) {
		gui_texts.forEach(function(text) {
			text.hover_state(text.is_over(mouseX, mouseY));
			if (text.hover)
				dispatched = true;
		}); 
	}

	if ( !dispatched ) {
		for (let objs=0; objs<objects.length; objs++) {
			objects[objs].hover_state(objects[objs].is_over(mouseX, mouseY));
			if (objects[objs].hover)
				dispatched = true;
		}
	} else {
		for (let objs=0; objs<objects.length; objs++)
			objects[objs].hover_state(false);
	}

	if ( !dispatched ) {
		for (let i=0; i<lines.length; i++) {
			if (lines[i].is_mouse_near_me() )
				dispatched = true;
		}
	}


	//
    //
    // TEMP FIX
    //
    //
    //if (groups.length > 0) dispatched=true;
    //
    //
    //

    if (gui_mode == mode_group_interaction || gui_mode == mode_select) {
    	// user is interacting with a group layer
    	dispatched = true;
    }

	if ( !dispatched ) {
		for (var c=0; c<columns; c++) {
			for (var r=0; r<columns; r++) {
				squares[c][r].hover_state(squares[c][r].is_over(mouseX, mouseY));

				/* undo the 
				let v = createVector(mouseX, mouseY);
				v.sub(300, 300);
				v.rotate(-(PI/4 + rot));

				stroke("red");
				strokeWeight(3);
				point(v.x, v.y);


				squares[c][r].hover_state(squares[c][r].is_over(v.x, v.y));
				*/
			}
		}
	} else {
		for (var c=0; c<columns; c++) {
			for (var r=0; r<columns; r++) {
				squares[c][r].hover_state(false);
			}
		}
	}

		
}

function post_draw() {
	if (gui_mode == mode_save_png_x2) {
		gui_mode = 0;
		save();
		pop();
		
		resizeCanvas(600, 600);
		return;
	}

}

function mouseMoved() {
	//
	// TODO: a lot of pre_draw can move into here
	//

	let dispatched = false;

	if ( !dispatched) {
		for (let i=0; i<groups.length; i++) {
			groups[i].mouseMoved(mouseX, mouseY);
		}
	}
}

function draw() {
	// randomSeed(99);
	pre_draw();
	pre_draw_events();

	// has the user selected to place an item on the canvas?
	if ( gui_mode > 0 ) {
		cursor(CROSS);
		dispatched = true;
	} else {
		cursor(ARROW);
	}
	
	// draw the unimportant stuff first
	// blank squares
	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if ( ! squares[c][r].enabled) {
				squares[c][r].display();
			}
		}
	}

	draw_clutter();

	// clutter
	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].enabled) {
				squares[c][r].display_clutter();
			}
		}
	}


/*
	push();
	translate(300, 300);
	rotate(PI/4 + rot);
	// rot += 0.01;
*/	
	// rooms and external walls
	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].enabled) {
				squares[c][r].display();
			}
		}
	}

/*
	pop();
*/
	// internal walls
	for (let i=0; i<walls.length; i++) {
		walls[i].display();
	}

	for (let i=0; i<groups.length; i++) {
		groups[i].display();
	}

	if (gui_mode == mode_wall) {
		//
		// draw internal walls - highlight / hover event
		//
		for (var c=0; c<columns; c++) {
			for (var r=0; r<columns; r++) {
				if (squares[c][r].enabled) {
					let s = squares[c][r];
					if (!s.top) {
						if (mouseY > s.y - 7 && mouseY < s.y + 7 &&
							mouseX > s.x && mouseX < s.x + s.size) {

							fill(255, 204, 0, 127);
							stroke(255, 204, 0);

							rect(s.x, s.y - 3, s.size, 6);
						}
					}

					if (!s.left) {
						if (mouseY > s.y && mouseY < s.y + s.size &&
							mouseX > s.x - 7 && mouseX < s.x + 7) {

							fill(255, 204, 0, 127);
							stroke(255, 204, 0);

							rect(s.x-3, s.y, 6, s.size);
						}
					}
					
				}
			}
		}
	}

	if (gui_mode == mode_drag) {
		drag_point.x = mouseX;
		drag_point.y = mouseY;
	}

	// curved walls
	for (let i=0; i<lines.length; i++) {
		lines[i].render();
	}

	for (let objs=0; objs<objects.length; objs++) {
		objects[objs].display();
	}


	gui_texts.forEach(function(text) {
		text.display();
	});

	if (gui_mode == mode_select) {
		if (select_start_pos.start_x != -1 ) {

			strokeWeight(1);
			stroke(0, 0, 255, 75);
			fill(0, 0, 255, 75);
			rectMode(CORNERS);
			rect(
				select_start_pos.start_x,
				select_start_pos.start_y,
				select_start_pos.end_x,
				select_start_pos.end_y
			);
		}
	}

	post_draw();
}

function mousePressed() {

	gui_texts.forEach(function(text) {
		// User has clicked away from an active
		// text box
		var tmp = text.is_over(mouseX, mouseY);
		if (text.active && !text.is_over(mouseX, mouseY)) {
			text.active = false;
			gui_mode = -1;  // ignore mouse up event
		}
		
	});

	let dispatched = false;

	if (!dispatched ) {
		gui_texts.forEach(function(text) {
			if (text.is_over(mouseX, mouseY)) {
				text.onMouseDown();
			}
		});
	}

	//
	// curved walls
	//
	if (!dispatched) {

		let is_near = false;

		for(let i=0; i<lines.length; i++) {
			let curve = lines[i];
			for (var c=0; c<curve.points.length; c++) {
				if (curve.points[c].is_near()) {
					drag_point = curve.points[c];
					gui_mode = mode_drag;
				}
			}
		}
	}

	//
	// SELECT ITEMS FOR ROTATION
	//
	if (!dispatched && gui_mode == mode_select) {
		select_start_pos.start_x = mouseX;
		select_start_pos.start_y = mouseY;
	}

	//
	// Maybe rotating a group
	//
	if (groups.length > 0) {
		groups[0].mousePressed(mouseX, mouseY);
	}
}

var select_start_pos = {
	start_x: -1,
	start_y: 0,
	end_x: 0,
	end_y: 0
};

/*
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

https://p5js.org/reference/#/p5/resizeCanvas
*/

function mouseDragged() {
	gui_texts.forEach(function(text) {
		if (text.active) {
			text.x = text.active_offset_x + mouseX;
			text.y = text.active_offset_y + mouseY;
		}
	});

	if (gui_mode == mode_select) {
		select_start_pos.end_x = mouseX;
		select_start_pos.end_y = mouseY;
	}

	let pos = -1;
	for (let i=0; i<groups.length; i++) {
		if (groups[i].enabled) pos = i;
	}
	if (pos > -1) {
		groups[pos].update(mouseX, mouseY);
	}
}


function mouseReleased_internal_wall() {

	let action_performed = false;
	for (let zz=0; zz<walls.length; zz++) {
		if (walls[zz].is_near(mouseX, mouseY)) {
			// user clicks, if it is in door mode
			// then delete it
			if (walls[zz].door) {
				walls.splice(zz, 1);
			} else {
				walls[zz].door = true;
			}
			action_performed = true;
		}
	}

	if (action_performed) return true;

	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].enabled) {
				let s = squares[c][r];
				if (!s.top) {
					if (mouseY > s.y - 7 && mouseY < s.y + 7 &&
						mouseX > s.x && mouseX < s.x + s.size) {

						let w = new Wall(s);
						walls.push(w);
					}
				}

				if (!s.left) {
					if (mouseY > s.y && mouseY < s.y + s.size &&
						mouseX > s.x - 7 && mouseX < s.x + 7) {

						let w = new WallVert(s);
						walls.push(w);
					}
				}
			}
		}
	}
}

function group_squares_in_area() {
	// user was dragging a selection box
	// now they are interacting with a
	// layer group
	gui_mode = mode_group_interaction;
/*
	var select_start_pos = {
		start_x: -1,
		start_y: 0,
		end_x: 0,
		end_y: 0
	};
*/

	let tmp = [];
	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			let s = squares[c][r];
			if (s.enabled) {
				if (
					s.x > select_start_pos.start_x &&
					s.x + s.size < select_start_pos.end_x &&
					s.y > select_start_pos.start_y &&
					s.y + s.size < select_start_pos.end_y
					) {

					tmp.push(squares[c][r].clone());

					// TODO: clean this shit up
					squares[c][r].enabled = false;
					squares[c][r].listener.disable_hatches(squares[c][r].hatch_list);	
				}					
			}
		}
	}
	groups.push(new Group(tmp));
	let pos = groups.length-1;

	var a = document.createElement("a");
	a.href = "javascript:gui_mode_group("+ pos +");";
	a.appendChild(document.createTextNode("Group "+groups.length));
	a.className = "selected";
	a.setAttribute("id", "layer-"+pos);
	var element = document.getElementById("layers");
	element.appendChild(a);

	select_start_pos.start_x = -1;
}

function mouseReleased() {
	if (gui_mode == mode_drag) {
		// user was dragging internal wall
		gui_mode = mode_none;
	}

	if (gui_mode == mode_select) {
		group_squares_in_area();
		return;
	}

	// user is clicking to STOP editing text
	// see mousePressed for details
	if (gui_mode == -1) {

		let clicked_inside_active_textbox = false;  
		
		gui_texts.forEach(function(text) {
			if (text.active && text.is_over(mouseX, mouseY)) {
				text.onMouseUp();
				clicked_inside_active_textbox = true;
			}
		});

		if ( !clicked_inside_active_textbox)
			gui_mode = 0;
		return;
	}
	
	let dispatched = false;

	gui_texts.forEach(function(text) {
		if (text.is_over(mouseX, mouseY)) {
			text.onMouseUp();
			dispatched = true;
		}
	}); 
	
	if (dispatched) return;

	// let tmp = -1;
	for (let objs=0; objs<objects.length; objs++) {
		objects[objs].hover_state();
		if (objects[objs].is_over(mouseX, mouseY)) {

			// This was an attempt to rotate stairs
			// for now, there are 4 types of stairs
			// UGH!! TODO Fix this crap:
			// either make boulders rotateable (? sounds stupid)
			// or give them a .dead status? (sounds stupid)
			/* or .... ? do something non-stupid
			if (Object.prototype.toString.call(objects[objs]) == "Stairs") {

				if (objects[objs].dead) {
					objects.splice(objs, 1);
					dispatched = true;  
				} else {
					// Move this into Stairs
					objects[objs].direction++;
					if (objects[objs].direction > 2)
						objects[objs].dead = true;
				}
				
			} else {

				*/

				// Reconfigurable scatter boulders

				var o = objects[objs];

				if (o.life && o.life > 0) {
					o.life--;
					o.jitter = random();
				} else {
					objects.splice(objs, 1);
				}

				dispatched = true;


			//     }
		}
	}

	if (dispatched) return;

	if (gui_mode == 1) {
		objects.push(new Column(mouseX, mouseY, 16));
		dispatched = true;
		//gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 2) {
		objects.push(new Column(mouseX, mouseY, 12));
		dispatched = true;
		//gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 3) {
		objects.push(new Scatter(mouseX, mouseY, 12));
		dispatched = true;
		//gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 4) {
		gui_texts.push(new Text(mouseX, mouseY));
		dispatched = true;
		gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 5) {
		gui_texts.push(new TextB(mouseX, mouseY));
		dispatched = true;
		gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 6) {
		gui_texts.push(new TextC(mouseX, mouseY));
		dispatched = true;
		gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 7 || gui_mode == 8 || gui_mode == 9 || gui_mode == 10) {
		objects.push(new Stairs(mouseX, mouseY, gui_mode-7));
		dispatched = true;
		gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 13) {
		let w = new InternalWall();
		lines.push(w);
		w.add(mouseX, mouseY);

		dispatched = true;
		gui_mode = mode_add_points;
	}

	if (dispatched) return;

	if (gui_mode == mode_wall) {
		mouseReleased_internal_wall();
		dispatched = true;
	}

	if (dispatched) return;

	if (gui_mode == mode_add_points) {

		let curve = lines[lines.length-1];
		if (curve.points.length > 0 && curve.points[0].is_over()) {
			// clicked on first element in line
			curve.closed = true;
			curve.editing = false;
			gui_mode = mode_none;
		} else {
			curve.add(mouseX, mouseY);
		}
		dispatched = true;
		// NOTE: we DO NOT change the mode - use key
		// press ESC to stop adding points
	}

	if (dispatched) return;

	for(let i=0; i<lines.length; i++) {
		let curve = lines[i];

     	if (curve.is_mouse_near_me() && !dispatched) {
     		curve.mouseReleased();
     		dispatched = true;
     	}
    }

    if (dispatched) return;


    //if (groups.length > 0) {
    if (gui_mode == mode_group_interaction) {
    	// user is interacting with a group layer
    	let pos = -1;
		for (let i=0; i<groups.length; i++) {
			if (groups[i].enabled) pos = i;
		}
		if (pos > -1) {
			groups[pos].mouseReleased(mouseX, mouseY);
    		dispatched = true;
		}
	}
	if (dispatched) return;

	//if (gui_mode == mode_group_interaction || gui_mode == mode_select)


    // if (groups.length > 0) return;
    
	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].is_over(mouseX, mouseY)){
				squares[c][r].onClick();

				rooms.enable_walls(squares, c, r);
				rooms.recreate_hatch_list();
			}
		}
	}

}

function keyTyped() {
	
	gui_texts.forEach(function(text) {
		if (text.active) {
			text.set_text(text.text + key);
		}
	});

	// uncomment to prevent any default behavior
	return false;
}

function keyPressed() {
	if (keyCode === BACKSPACE) {
		gui_texts.forEach(function(text) {
			if (text.active) {
				text.set_text(text.text.slice(0, -1));
			}
		});
	}

	if (keyCode === ESCAPE) {
		gui_texts.forEach(function(text) {
			if (text.active) {
				text.active = false;
			}
		});

		// stop adding points to a curve
		gui_mode = mode_none;

		for(let i=0; i<lines.length; i++) {
			let curve = lines[i];
			curve.editing = false;
    	}
		
		// tell all toggle buttons to turn off
		toggle_gui_all_off();
	}


	if (keyCode === RETURN) {
		gui_texts.forEach(function(text) {
			if (text.active) {
				text.active = false;
			}
		});
	}
}


function mouseClicked() {
}