/**
 * @typedef {Object} TextSetting 文字列の描画設定
 * @property {String} fillStyle 塗りつぶしの色
 * @property {String} strokeStyle 枠線の色
 * @property {String} textAlign テキストの横方向の原点の基準
 * @property {String} textBaseline テキストの縦方向の原点の基準
 */
class DrawText {
  /**
   * コンストラクタ
   * @param {Number} fontSize フォントサイズ
   * @param {String} fontFamily　フォントファミリー
   * @param {TextSetting} drawSetting 描画設定
   */
  constructor(fontSize, fontFamily, drawSetting) {
    /** @type {Number} */
    this.fontSize = fontSize;
    /** @type {String} */
    this.fontFamily = fontFamily;
    /** @type {String} */
    this.fillStyle = drawSetting?.fillStyle || null;
    /** @type {String} */
    this.strokeStyle = drawSetting?.strokeStyle || null;
    /** @type {String} */
    this.textAlign = drawSetting?.textAlign || null;
    /** @type {String} */
    this.textBaseline = drawSetting?.textBaseline || null;
  }

  /**
   * テキストの描画
   * @param {CanvasRenderingContext2D} ctx 描画コンテキスト
   * @param {String} text 描画する文字列
   * @param {Number} x 描画するX座標
   * @param {Number} y 描画するY座標
   */
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

  /**
   * 塗りつぶしの色の設定
   * @param {String} color カラーコード
   */
  setFillStyle(color) {
    this.fillStyle = color;
  }

  /**
   * 枠線の色の設定
   * @param {String} color カラーコード
   */
  setStrokeStyle(color) {
    this.strokeStyle = color;
  }
}

export default DrawText;
