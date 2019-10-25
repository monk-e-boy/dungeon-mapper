// https://flatuicolors.com/palette/nl

class Button {
  constructor(x, y, letter, size) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.size = size;
    this.hover = false;
    this.click = false;
  }

  is_over(x, y) {
    let d = int(dist(x, y, this.x, this.y));
    return d < this.size/2;
  }

  hover_state(mouse_over) {
    this.hover = mouse_over
  }

  onMouseDown() {
    this.click = true;
  }

  onMouseUp() {
    this.click = false;
  }

  display() {
    if (this.hover && this.click) {
      strokeWeight(2);
      stroke("#EA2027");
      fill('#EE5A24');
      circle(this.x, this.y, this.size);
      fill('#ffffff');
      strokeWeight(0);
      text(this.letter, this.x, this.y - 8);


    } else if (this.hover && !this.click) {
      
      strokeWeight(2);
      stroke("#EA2027");
      fill('#ffffff');
      circle(this.x, this.y, this.size);
      fill('#EE5A24');
      strokeWeight(0);
      text(this.letter, this.x, this.y - 8);

    } else {
      strokeWeight(0);
      fill('#ffffff');
      circle(this.x, this.y, this.size);
      fill('#EE5A24');
      strokeWeight(0);
      // textFont(font_LaBelleAurore);
      text(this.letter, this.x, this.y - 8);
    }
    
  }
}

