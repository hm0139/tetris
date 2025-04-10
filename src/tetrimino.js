import {
  BLOCK_TYPE_TETRIMINO_I,
  SPACE_ROwS,
  TETRIMINO_DIRECTION_LEFT,
  TETRIMINO_DIRECTION_UP,
  TETRIMINO_FIELD,
  TETRIMINO_ROTATE_LEFT,
  TETRIMINO_ROTATE_RIGHT,
} from "./constval.js";

class Tetrimino {
  constructor(type, col, row) {
    this.type = type;
    this.col = col;
    this.row = row;
    this.blocks = Array.from({ length: TETRIMINO_FIELD }, () => Array(TETRIMINO_FIELD).fill(null));
    this.currentDirection = TETRIMINO_DIRECTION_UP;
  }

  clone() {
    const clone = new Tetrimino(this.type, this.col, this.row);
    clone.setTetrimino({ type: this.type, blocks: this.blocks });
    clone.currentDirection = this.currentDirection;
    return clone;
  }

  setTetrimino(tetrimino) {
    this.type = tetrimino.type;
    this.blocks = tetrimino.blocks.map((row) => row.map((value) => value.clone()));
  }

  setPosition(col, row) {
    this.col = col;
    this.row = row;
  }

  move(moveCol, moveRow) {
    this.col += moveCol;
    this.row += moveRow;
  }

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

  fallDown() {
    this.row++;
  }

  draw(ctx, offsetX, offsetY, scale = 1) {
    for (let i = 0; i < TETRIMINO_FIELD; i++) {
      for (let j = 0; j < TETRIMINO_FIELD; j++) {
        this.blocks[i][j].draw(ctx, this.col + j, this.row + i - SPACE_ROwS, offsetX, offsetY, scale);
      }
    }
  }
}

export default Tetrimino;
