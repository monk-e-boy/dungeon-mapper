//let TOP = 1
//let BOTTOM = 2
//let LEFT = 3
//let RIGHT = 4


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

let gui_mode = 0;


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

	rooms = new Rooms(columns, columns, size);
	_object = new Objects();

}

function draw() {

	if (gui_mode == 11) {
		gui_mode = 0;
		save();
		return;
	}

	if (gui_mode == 12) {
		gui_mode = 0;
		make_url();
		return;
	}

	//
	// TODO move this to pre_draw setup
	//
	for (let objs=0; objs<gui_texts.length; objs++) {
		if (gui_texts[objs].is_dead) {
			gui_texts.splice(objs, 1);
		}
	}
	//
	// END TODO
	//

	let dispatched = false;

	// has the user selected to place an item on the canvas?
	if ( gui_mode != 0 ) {
		cursor(CROSS);
		dispatched = true;
	} else {
		cursor(ARROW);
	}
	

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
		for (var c=0; c<columns; c++) {
			for (var r=0; r<columns; r++) {
				squares[c][r].hover_state(squares[c][r].is_over(mouseX, mouseY));
			}
		}
	} else {
		for (var c=0; c<columns; c++) {
			for (var r=0; r<columns; r++) {
				squares[c][r].hover_state(false);
			}
		}
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

	// clutter
	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].enabled) {
				squares[c][r].display_clutter();
			}
		}
	}

	// walls
	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].enabled) {
				squares[c][r].display();
			}
		}
	}

	for (let objs=0; objs<objects.length; objs++) {
		objects[objs].display();
	}


	gui_texts.forEach(function(text) {
		text.display();
	});

}

function mousePressed() {

	gui_texts.forEach(function(text) {
		if (text.active) {
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

}

function mouseDragged() {
	gui_texts.forEach(function(text) {
		if (text.active) {
			text.x = text.active_offset_x + mouseX;
			text.y = text.active_offset_y + mouseY;
		}
	});
}



function mouseReleased() {

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
		gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 2) {
		objects.push(new Column(mouseX, mouseY, 12));
		dispatched = true;
		gui_mode = 0;
	}

	if (dispatched) return;

	if (gui_mode == 3) {
		objects.push(new Scatter(mouseX, mouseY, 12));
		dispatched = true;
		gui_mode = 0;
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


	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].is_over(mouseX, mouseY)){
				squares[c][r].onClick();

				rooms.enable_walls(squares, c, r);
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