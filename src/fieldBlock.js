import {
  BLOCK_SIZE,
  BLOCK_TYPE_CONST_BLOCK,
  BLOCK_TYPE_NONE,
  DEFAULT_LINE_COLOR,
  ORIGIN_POSITION_X,
  ORIGIN_POSITION_Y,
} from "./constval";

class FieldBlock {
  /**
   * コンストラクタ
   * @param {Number} type ブロックタイプ
   * @param {String} color 色
   */
  constructor(type, color = "") {
    /** @type {Number} */
    this.type = type;
    /** @type {String} */
    this.color = color;
  }

  /**
   * オブジェクトを複製
   * @returns {FieldBlock} 複製されたオブジェクト
   */
  clone() {
    return new FieldBlock(this.type, this.color);
  }

  /**
   * ブロックを描画
   * @param {CanvasRenderingContext2D} ctx 描画コンテキスト
   * @param {Number} posCol 描画する列
   * @param {Number} posRow 描画する行
   * @param {Number} offsetX 原点からのX方向の距離
   * @param {Number} offsetY 原点からのY方向の距離
   * @param {Number} [scale=1] 拡大倍率
   */
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
