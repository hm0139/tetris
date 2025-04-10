import {
  BLOCK_SIZE,
  BLOCK_TYPE_CONST_BLOCK,
  BLOCK_TYPE_NONE,
  DEFAULT_LINE_COLOR,
  ORIGIN_POSITION_X,
  ORIGIN_POSITION_Y,
} from "./constval.js";

class FieldBlock {
  constructor(type, color = "") {
    this.type = type;
    this.color = color;
  }

  clone() {
    return new FieldBlock(this.type, this.color);
  }

  draw(ctx, posCol, posRow, offsetX, offsetY, scale = 1) {
    if (this.type == BLOCK_TYPE_NONE) {
      return;
    }

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(
      posCol * BLOCK_SIZE * scale + offsetX + ORIGIN_POSITION_X,
      posRow * BLOCK_SIZE * scale + offsetY + ORIGIN_POSITION_Y,
      BLOCK_SIZE * scale,
      BLOCK_SIZE * scale
    );
    ctx.fill();
    if (this.type != BLOCK_TYPE_CONST_BLOCK) {
      ctx.strokeStyle = DEFAULT_LINE_COLOR;
      ctx.stroke();
    }
  }
}

export default FieldBlock;
