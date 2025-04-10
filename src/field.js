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

class Field {
  constructor() {
    this.field = Array.from({ length: FIELD_HEIGHT + SPACE_ROwS }, () => Array(FIELD_WIDTH).fill(null));
    this.fieldIncludeSpaceHeight = FIELD_HEIGHT + SPACE_ROwS;
    this.fieldWidth = FIELD_WIDTH;
  }

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

  isInField(col, row) {
    return col >= 0 && col < this.fieldWidth && row >= 0 && row < this.fieldIncludeSpaceHeight;
  }

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

  //デバック用
  allBlockClear() {
    for (let i = 0; i < this.fieldIncludeSpaceHeight - 1; i++) {
      for (let j = 1; j < this.fieldWidth - 1; j++) {
        this.field[i][j] = new FieldBlock(BLOCK_TYPE_NONE);
      }
    }
  }

  setBlock(col, row, block) {
    this.field[row][col] = block.clone();
  }
}

export default Field;
