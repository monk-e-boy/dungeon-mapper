class Text {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.text = "";
		this.editing = true;
		//this.size = size;
		this.hover = false;
		this.click = false;
		this.active = true;
		this.active_offset_x = 0;
		this.active_offset_y = 0;

		this.blink = 0;
		this.blink_max = 60;

		this.fontSize = 16;
		this.bbox = false;

		this.is_dead = false;

		// used to determine the saved data type
		// re-inflated via the factory method
		this.save_type = 0;
	}

	save() {
		// return a json representation of this object
		return {
			t: this.save_type,
			x: this.x,
			y: this.y,
			v: this.text,	// value (t is used for type)
			s: this.fontSize
		};
	}

	static factory(data) {
		let txt = null;

		if (data.t == 0)
			txt = new Text(data.x, data.y);

		if (data.t == 1) {
			txt = new TextB(data.x, data.y);
			txt.jitter = data.j;
		}

		if (data.t == 2) {
			txt = new TextC(data.x, data.y);
			txt.jitter = data.j;
		}

		
		txt.text = data.v;
		txt.fontSize = data.s;
		txt.editing = false;
		txt.active = false;
		return txt;
	}

	is_over(x, y) {
		if ( !this.bbox) {
			return false;

		}
		else {
			if ( !(this.hover || this.active) ) {
				return x > this.bbox.x &&
				y > this.bbox.y &&
				x < this.bbox.x + this.bbox.w &&
				y < this.bbox.y + this.bbox.h;

			} else {
				// be in hover state 
				return x > this.bbox.x - 28 /* left buttons */ &&
				y > this.bbox.y - 8 &&
				x < this.bbox.x + this.bbox.w + 28 /* right buttons */ &&
				y < this.bbox.y + this.bbox.h + 8;
			}
		}
	}

	hover_state(mouse_over) {
		this.hover = mouse_over;
		if(mouse_over){
			let x = 99;
		}
	}

	onMouseDown() {
		this.click = true;
		if (this.hover) {
			this.active = true;
			this.active_offset_x = this.x - mouseX;
			this.active_offset_y = this.y - mouseY;
		}
	}

	onMouseUp() {
		this.click = false;

		// TODO: fix this shit (refactoring will happen if anyone uses the product
		//       there's no point fixing problems in an unused product)
		// increase font size button
		if (mouseX > this.bbox.x-15 && mouseX < this.bbox.x &&
			mouseY > this.bbox.y+(this.bbox.h/2) - 15 && mouseY < this.bbox.y+(this.bbox.h/2) )
		{
			this.fontSize++;
		}

		// reduce font size button
		if (mouseX > this.bbox.x-15 && mouseX < this.bbox.x &&
			mouseY > this.bbox.y+(this.bbox.h/2) && mouseY < this.bbox.y+(this.bbox.h/2) + 15 )
		{
			if (this.fontSize > 2)
				this.fontSize--;
		}

		// close button
		let x = this.bbox.x + this.bbox.w + 8;
		let y = this.bbox.y+(this.bbox.h/2) - 8;
		if ( dist(mouseX, mouseY, x, y) < 8 )
			this.is_dead = true;

	}

	set_text(text) {
		this.text = text;
		textAlign(LEFT);
		textSize(this.fontSize);
		textFont(font_LaBelleAurore);
		this.bbox = font_LaBelleAurore.textBounds(this.text, this.x, this.y, this.fontSize, LEFT);
	}

	go_font() {
		textFont(font_LaBelleAurore);
	}

	measure_text_bounds()
	{
		return font_LaBelleAurore.textBounds(this.text, this.x, this.y, this.fontSize, LEFT);
	}

	measure_text() {
		if (this.text.length > 0)
			return this.measure_text_bounds();
		else
			return {x: this.x, y: this.y, w: 10, h: this.fontSize};
	}

	display_button_inc() {
		// TODO: fix this shit:
		let d = int(dist(mouseX, mouseY, this.bbox.x - 8, this.bbox.y+(this.bbox.h/2) - 8));
		if (d < 7)
		{

			// drop shadow
			fill(140,140,140,125);
			noStroke();
			circle(this.bbox.x-8, this.bbox.y+(this.bbox.h/2) - 7, 13 + 4);

			fill(255, 204, 0);
		} else {
			fill("#ffffff");
		}

		stroke("#000000");
		strokeWeight(1);
		// + inc font size
		push();
		translate(this.bbox.x - 8, this.bbox.y+(this.bbox.h/2) - 8);
		circle(0, 0, 13);
		line(-4, 0, 4, 0);
		line(0, -4, 0, 4);
		pop();
	}

	display_button_dec() {
		if (mouseX > this.bbox.x-15 && mouseX < this.bbox.x &&
		mouseY > this.bbox.y+(this.bbox.h/2) && mouseY < this.bbox.y+(this.bbox.h/2) + 15 )
		{
			// drop shadow
			fill(140,140,140,125);
			noStroke();
			circle(this.bbox.x-8, this.bbox.y+(this.bbox.h/2) + 9, 13 + 4);

			fill(255, 204, 0);

		} else {
			fill("#ffffff");
		}

		stroke("#000000");
		strokeWeight(1);
		// - dec font size
		push();
		translate(this.bbox.x - 8, this.bbox.y+(this.bbox.h/2) + 8);
		circle(0, 0, 13);
		line(-4, 0, 4, 0);
		pop();
	}

	display_button_del() {
		let x = this.bbox.x + this.bbox.w + 8;
		let y = this.bbox.y+(this.bbox.h/2) - 8;
		let size = 13;
		let is_over = dist(mouseX, mouseY, x, y) < 8;
		if (is_over)
		{
			// drop shadow
			fill(140,140,140,125);
			noStroke();
			circle(x, y+1, size + 4);

			fill(238,17,17);
		} else {
			fill("#ffffff");
		}

		stroke("#000000");
		strokeWeight(1);
		// - dec font size
		push();
		translate(x, y);
		circle(0, 0, size);
		if (is_over)
			stroke("#ffffff");
		line(-4, -4, 4, 4);
		line(4, -4, -4, 4);
		pop();
	}

	display_prepare() {
		textAlign(LEFT);
		textSize(this.fontSize);
		this.go_font();
		this.bbox = this.measure_text();
	}

	display_decorations() {

	}

	display() {

		this.display_prepare();
		this.display_decorations();

		if (this.hover || this.active) {
			strokeWeight(1);
			stroke(0);
			fill("#ffffff");
			rect(this.bbox.x - 4, this.bbox.y - 4, this.bbox.w + 8, this.bbox.h + 8);

			if (this.active) {
				// user is editing the text - show blinking I bar
				if (this.blink < this.blink_max/2) {
					fill(0);
					strokeWeight(0);
					rect(this.bbox.x+this.bbox.w, this.bbox.y+2, 2, this.bbox.h-2);

				}
				this.blink++;
				if (this.blink > this.blink_max)
					this.blink = 0;
			}
		}

		noStroke();
		fill('#000000');
		text(this.text, this.x, this.y);

		if (this.hover || this.active) {

			this.display_button_inc();
			this.display_button_dec();
			this.display_button_del();

		}

	}
}


