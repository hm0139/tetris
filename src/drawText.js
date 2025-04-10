class DrawText {
  constructor(fontSize, fontFamily, drawSetting) {
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fillStyle = drawSetting?.fillStyle || null;
    this.strokeStyle = drawSetting?.strokeStyle || null;
    this.textAlign = drawSetting?.textAlign || null;
    this.textBaseline = drawSetting?.textBaseline || null;
  }

  draw(ctx, text, x, y) {
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    if (this.textAlign != null) {
      ctx.textAlign = this.textAlign;
    }
    if (this.textBaseline != null) {
      ctx.textBaseline = this.textBaseline;
    }
    if (this.fillStyle != null) {
      ctx.fillStyle = this.fillStyle;
      ctx.fillText(text, x, y);
    }
    if (this.strokeStyle != null) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.strokeText(text, x, y);
    }
  }
}

export default DrawText;
