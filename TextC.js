class TextC extends TextB {
  constructor(x, y) {
    super(x, y);
  }

  go_font() {
    textSize(this.fontSize);
    textFont(font_Sunshiney);
    this.padding_bottom = 3;
  }

  measure_text_bounds() {
    return font_Sunshiney.textBounds(this.text, this.x, this.y, this.fontSize, LEFT);
  }
}