import {
  BLOCK_TYPE_TETRIMINO_I,
  SPACE_ROwS,
  TETRIMINO_DIRECTION_LEFT,
  TETRIMINO_DIRECTION_UP,
  TETRIMINO_FIELD,
  TETRIMINO_ROTATE_LEFT,
  TETRIMINO_ROTATE_RIGHT,
} from "./constval";
import FieldBlock from "./fieldBlock";

class Tetrimino {
  /**
   * コンストラクタ
   * @param {Number} type ブロックタイプ
   * @param {Number} col 行
   * @param {Number} row 列
   */
  constructor(type, col, row) {
    /** @type {Number} */
    this.type = type;
    /** @type {Number} */
    this.col = col;
    /** @type {Number} */
    this.row = row;
    /** @type {FieldBlock[][]} */
    this.blocks = Array.from({ length: TETRIMINO_FIELD }, () => Array(TETRIMINO_FIELD).fill(null));
    /** @type {Number} */
    this.currentDirection = TETRIMINO_DIRECTION_UP;
  }

  /**
   * オブジェクトの複製
   * @returns {Tetrimino} 複製されたオブジェクト
   */
  clone() {
    const clone = new Tetrimino(this.type, this.col, this.row);
    clone.setTetrimino({ type: this.type, blocks: this.blocks });
    clone.currentDirection = this.currentDirection;
    return clone;
  }

  /**
   * @param {Tetrimino} tetrimino
   */
  setTetrimino(tetrimino) {
    this.type = tetrimino.type;
    this.blocks = tetrimino.blocks.map((row) => row.map((value) => value.clone()));
  }

  /**
   * テトリミノの位置を設定
   * @param {Number} col 行
   * @param {Number} row 列
   */
  setPosition(col, row) {
    this.col = col;
    this.row = row;
  }

  /**
   * テトリミノの移動
   * @param {Number} moveCol 列の相対位置
   * @param {Number} moveRow 行の相対位置
   */
  move(moveCol, moveRow) {
    this.col += moveCol;
    this.row += moveRow;
  }

  /**
   * テトリミノの回転
   * @param {Number} dir 回転する方向
   */
  rotate(dir) {
    let temp = Array.from({ length: TETRIMINO_FIELD }, () => Array(TETRIMINO_FIELD).fill(null));
    for (let i = 0; i < TETRIMINO_FIELD; i++) {
      for (let j = 0; j < TETRIMINO_FIELD; j++) {
        if (dir == TETRIMINO_ROTATE_LEFT) {
          temp[i][j] = this.blocks[j][TETRIMINO_FIELD - i - 1].clone();
        } else if (dir == TETRIMINO_ROTATE_RIGHT) {
          temp[i][j] = this.blocks[TETRIMINO_FIELD - j - 1][i].clone();
        }
      }
    }

    if (dir == TETRIMINO_ROTATE_LEFT) {
      this.currentDirection--;
      this.currentDirection = (this.currentDirection + (TETRIMINO_DIRECTION_LEFT + 1)) % (TETRIMINO_DIRECTION_LEFT + 1);
      if (this.type != BLOCK_TYPE_TETRIMINO_I) {
        //回転軸の補正
        for (let i = 0; i < temp.length; i++) {
          const firstCol = temp[i].shift();
          temp[i].push(firstCol);
        }
      }
    } else if (dir == TETRIMINO_ROTATE_RIGHT) {
      this.currentDirection++;
      this.currentDirection %= TETRIMINO_DIRECTION_LEFT + 1;
      if (this.type != BLOCK_TYPE_TETRIMINO_I) {
        //回転軸の補正
        const lastRow = temp.pop();
        temp.unshift(lastRow);
      }
    }
    this.blocks = temp.map((row) => row.map((value) => value.clone()));
  }

  /**
   * テトリミノを落下させる
   */
  fallDown() {
    this.row++;
  }

  /**
   * テトリミノの描画
   * @param {CanvasRenderingContext2D} ctx 描画コンテキスト
   * @param {Number} offsetX 原点からのX方向の距離
   * @param {Number} offsetY 原点からのY方向の距離
   * @param {Number} [scale=1] 拡大倍率
   */
  draw(ctx, offsetX, offsetY, scale = 1) {
    for (let i = 0; i < TETRIMINO_FIELD; i++) {
      for (let j = 0; j < TETRIMINO_FIELD; j++) {
        this.blocks[i][j].draw(ctx, this.col + j, this.row + i - SPACE_ROwS, offsetX, offsetY, scale);
      }
    }
  }
}

export default Tetrimino;
