import {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  BLOCK_TYPE_CONST_BLOCK,
  BLOCK_TYPE_NONE,
  BLOCK_COLOR_CONST_BLOCK,
  TETRIMINO_FIELD,
  FIELD_POSITION_X,
  FIELD_POSITION_Y,
  SPACE_ROwS,
  ORIGIN_POSITION_X,
  BLOCK_SIZE,
  ORIGIN_POSITION_Y,
  FIELD_BACK_GROUND_LINE_COLOR,
} from "./constval.js";
import FieldBlock from "./fieldBlock.js";
import Tetrimino from "./tetrimino.js";

class Field {
  /**
   * コンストラクタ
   */
  constructor() {
    /** @type {FieldBlock[][]} */
    this.field = Array.from({ length: FIELD_HEIGHT + SPACE_ROwS }, () => Array(FIELD_WIDTH).fill(null));
    /** @type {Number} */
    this.fieldIncludeSpaceHeight = FIELD_HEIGHT + SPACE_ROwS;
    /** @type {Number} */
    this.fieldWidth = FIELD_WIDTH;
  }

  /**
   * 初期化
   */
  init() {
    for (let i = 0; i < this.fieldIncludeSpaceHeight; i++) {
      for (let j = 0; j < this.fieldWidth; j++) {
        if (i == this.fieldIncludeSpaceHeight - 1 || j == 0 || j == this.fieldWidth - 1) {
          this.field[i][j] = new FieldBlock(BLOCK_TYPE_CONST_BLOCK, BLOCK_COLOR_CONST_BLOCK);
        } else {
          this.field[i][j] = new FieldBlock(BLOCK_TYPE_NONE);
        }
      }
    }
  }

  /**
   * フィールドの描画
   * @param {CanvasRenderingContext2D} ctx 描画コンテキスト
   */
  draw(ctx) {
    ctx.strokeStyle = FIELD_BACK_GROUND_LINE_COLOR;
    for (let i = 0; i < FIELD_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(ORIGIN_POSITION_X + FIELD_POSITION_X, i * BLOCK_SIZE + ORIGIN_POSITION_Y + FIELD_POSITION_Y);
      ctx.lineTo(
        BLOCK_SIZE * this.fieldWidth + ORIGIN_POSITION_X + FIELD_POSITION_X,
        i * BLOCK_SIZE + ORIGIN_POSITION_Y + FIELD_POSITION_Y
      );
      ctx.stroke();
    }
    for (let i = 0; i < this.fieldWidth; i++) {
      ctx.beginPath();
      ctx.moveTo(i * BLOCK_SIZE + ORIGIN_POSITION_X + FIELD_POSITION_X, ORIGIN_POSITION_Y + FIELD_POSITION_Y);
      ctx.lineTo(
        i * BLOCK_SIZE + ORIGIN_POSITION_X + FIELD_POSITION_X,
        BLOCK_SIZE * FIELD_HEIGHT + ORIGIN_POSITION_Y + FIELD_POSITION_Y
      );
      ctx.stroke();
    }
    //上部のスペース領域は非表示
    for (let i = SPACE_ROwS; i < this.fieldIncludeSpaceHeight; i++) {
      for (let j = 0; j < this.fieldWidth; j++) {
        this.field[i][j].draw(ctx, j, i - SPACE_ROwS, FIELD_POSITION_X, FIELD_POSITION_Y); //非表示分上にずらす
      }
    }
  }

  /**
   * 指定された行と列がフィールド内か
   * @param {Number} col 列
   * @param {Number} row 行
   * @returns {Boolean} true: フィールド内, false: フィールド外
   */
  isInField(col, row) {
    return col >= 0 && col < this.fieldWidth && row >= 0 && row < this.fieldIncludeSpaceHeight;
  }

  /**
   * テトリミノとの当たり判定
   * @param {Tetrimino} tetrimino 判定対象のテトリミノ
   * @param {Number} dirX テトリミノからのX方向の相対位置
   * @param {Number} dirY テトリミノからのY方向の相対位置
   * @returns {Boolean} true: 当たった, false: 当たっていない
   */
  isHit(tetrimino, dirX, dirY) {
    for (let i = 0; i < TETRIMINO_FIELD; i++) {
      for (let j = 0; j < TETRIMINO_FIELD; j++) {
        const block = tetrimino.blocks[i][j];
        if (
          block.type != BLOCK_TYPE_NONE &&
          this.isInField(tetrimino.col + j + dirX, tetrimino.row + i + dirY) &&
          this.field[tetrimino.row + i + dirY][tetrimino.col + j + dirX].type != BLOCK_TYPE_NONE
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * フィールドとテトリミノを合成する
   * @param {Tetrimino} tetrimino
   */
  mergeTetrimino(tetrimino) {
    for (let i = 0; i < TETRIMINO_FIELD; i++) {
      for (let j = 0; j < TETRIMINO_FIELD; j++) {
        const block = tetrimino.blocks[i][j];
        if (block.type != BLOCK_TYPE_NONE) {
          this.field[tetrimino.row + i][tetrimino.col + j] = block.clone();
        }
      }
    }
  }

  /**
   * フィールド内で消去可能なラインの位置を取得する
   * @returns {Number[]} 消去可能なラインの行
   */
  checkCanDeleteRow() {
    let canDeleteRows = [];
    for (let i = this.fieldIncludeSpaceHeight - 2; i >= 0; i--) {
      let canDelete = true;
      for (let j = 1; j < this.fieldWidth - 1; j++) {
        if (this.field[i][j].type == BLOCK_TYPE_NONE) {
          canDelete = false;
          break;
        }
      }
      if (canDelete) {
        canDeleteRows.push(i);
      }
    }

    return canDeleteRows;
  }

  /**
   * フィールド内の揃った部分を消去する
   * @param {Number[]} deleteRows 消去する行
   */
  deleteRow(deleteRows) {
    let rowIndex = 0;
    for (let row = this.fieldIncludeSpaceHeight - 1; row > 0; row--) {
      while (rowIndex < deleteRows.length && row - rowIndex == deleteRows[rowIndex]) rowIndex++;

      if (rowIndex == 0) continue;

      for (let col = 1; col < this.fieldWidth - 1; col++) {
        if (row - rowIndex < 0) break;

        this.field[row][col] = this.field[row - rowIndex][col].clone();
      }
    }
  }

  /**
   * フィールド内のブロックを全て消去する
   */
  allBlockClear() {
    for (let i = 0; i < this.fieldIncludeSpaceHeight - 1; i++) {
      for (let j = 1; j < this.fieldWidth - 1; j++) {
        this.field[i][j] = new FieldBlock(BLOCK_TYPE_NONE);
      }
    }
  }

  /**
   * 指定された位置にブロックを配置
   * @param {Number} col 列
   * @param {Number} row 行
   * @param {FieldBlock} block 配置するブロック
   */
  setBlock(col, row, block) {
    this.field[row][col] = block.clone();
  }
}

export default Field;
