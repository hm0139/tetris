import {
  BLOCK_TYPE_NONE,
  FIELD_WIDTH,
  TETRIMINO_FIELD,
  BLOCK_TYPE_TETRIMINO_I,
  BLOCK_TYPE_TETRIMINO_J,
  BLOCK_TYPE_TETRIMINO_O,
  BLOCK_TYPE_TETRIMINO_S,
  BLOCK_TYPE_TETRIMINO_Z,
  BLOCK_TYPE_TETRIMINO_L,
  BLOCK_TYPE_TETRIMINO_T,
  BLOCK_COLOR_TETRIMINO_I,
  BLOCK_COLOR_TETRIMINO_J,
  BLOCK_COLOR_TETRIMINO_L,
  BLOCK_COLOR_TETRIMINO_O,
  BLOCK_COLOR_TETRIMINO_S,
  BLOCK_COLOR_TETRIMINO_T,
  BLOCK_COLOR_TETRIMINO_Z,
  TETRIMINO_FALL_DOWN_INTERVAL,
  TETRIMINO_ROTATE_LEFT,
  TETRIMINO_ROTATE_RIGHT,
  GENERATED_TETRIMINO_LOWER_LIMIT,
  DISPLAY_NEXT_TETRIMINO_POSITION_X,
  DISPLAY_NEXT_TETRIMINO_POSITION_Y,
  BLOCK_SIZE,
  ORIGIN_POSITION_X,
  ORIGIN_POSITION_Y,
  NEXT_TETRIMINO_SCALE,
  NEXT_TETRIMINO_DISPLAY_BOX_SCALE,
  TETRIMINOS,
  DISPLAY_NEXT_TETRIMINO_NUM,
  HOLD_TETRIMINO_DISPLAY_BOX_SCALE,
  HOLD_TETRIMINO_SCALE,
  DISPLAY_HOLD_TETRIMINO_POSITION_X,
  DISPLAY_HOLD_TETRIMINO_POSITION_Y,
  FIELD_POSITION_X,
  FIELD_POSITION_Y,
  SHADOW_ALPHA,
  GAME_STATUS_PLAYING,
  GAME_STATUS_GAME_OVER,
  DEFAULT_FONT_SIZE,
  USE_FONTS,
  FIELD_HEIGHT,
  GAME_STATUS_WAIT,
  DISPLAY_SCORE_POSITION_X,
  DISPLAY_SCORE_POSITION_Y,
  SCORE_TEXT_FONT_SIZE,
  LINE_SINGLE,
  LINE_DOUBLE,
  LINE_TRIPLE,
  LINE_TETRIS,
  SCORE_SINGLE,
  SCORE_DOUBLE,
  SCORE_TRIPLE,
  SCORE_TETRIS,
  SPACE_ROwS,
  TEXT_BLINK_INTERVAL,
  GAME_STATUS_PAUSE,
  TETRIMINO_DIRECTION_LEFT,
  TETRIMINO_DIRECTION_UP,
  TETRIMINO_DIRECTION_DOWN,
  DEBUG,
  TETRIMINO_LOCK_DOWN_TIME,
  TETRIMINO_MOVED_COUNT_MAX,
  DEFAULT_LINE_COLOR,
  INIT_MESSAGE_POSITION_X,
  INIT_MESSAGE_POSITION_Y,
  MESSAGE_DISPLAY_TIME,
  REACH_POINT_Y,
  MESSAGE_DOUBLE_COLOR,
  MESSAGE_TRIPLE_COLOR,
  MESSAGE_TETRIS_COLOR,
  MESSAGE_FONT_SIZE,
} from "./constval.js";
import Animation from "./animation.js";
import Field from "./field.js";
import Tetrimino from "./tetrimino.js";
import FieldBlock from "./fieldBlock.js";
import DrawText from "./drawText.js";
import { convertColAndRowPosition, easeOutCubic, shuffle } from "./util.js";

/**
 * @typedef {Object} NextTetrimino
 * @property {Number} type
 * @property {FieldBlock[][]} blocks
 */
class Game {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");
    /** @type {Animation} */
    this.animation = new Animation(this.update.bind(this), { prevAnimationTime: 0, displayText: true });
    /** @type {Field} */
    this.field = new Field();
    /** @type {Tetrimino} */
    this.tetrimino = new Tetrimino(BLOCK_TYPE_NONE, 0, 0);
    /** @type {Tetrimino} */
    this.shadowMino = null;
    /** @type {NextTetrimino[]} */
    this.nextTetrimino = [];
    /** @type {Tetrimino} */
    this.holdTetrimino = null;
    /** @type {Boolean} */
    this.canHold = true;
    /** @type {Number} */
    this.gameStatus = GAME_STATUS_WAIT;
    /** @type {Number} */
    this.centerX = 0;
    /** @type {Number} */
    this.centerY = 0;
    /** @type {DrawText} */
    this.gameStartText = new DrawText(DEFAULT_FONT_SIZE, USE_FONTS, {
      fillStyle: "#00ffff",
      strokeStyle: "#ffff00",
      textAlign: "center",
      textBaseline: "middle",
    });
    /** @type {DrawText} */
    this.gameMsgText = new DrawText(DEFAULT_FONT_SIZE, USE_FONTS, {
      fillStyle: "#ff0000",
      strokeStyle: "#ffff00",
      textAlign: "center",
      textBaseline: "middle",
    });
    /** @type {DrawText} */
    this.scoreText = new DrawText(SCORE_TEXT_FONT_SIZE, USE_FONTS, {
      fillStyle: "#000000",
      textAlign: "start",
      textBaseline: "top",
    });
    /** @type {DrawText} */
    this.messageText = new DrawText(MESSAGE_FONT_SIZE, USE_FONTS, {
      fillStyle: "ff0000",
      textAlign: "start",
      textBaseline: "top",
    });

    /** @callback GameFinish */
    /** @type {GameFinish} */
    this.finishFunc = null;
    /** @type {Number} */
    this.score = 0;
    /** @type {Number} */
    this.deletedChain = 0;
    /** @type {Number} */
    this.tetriminoInstallationTime = -1;
    /** @type {Boolean} */
    this.installation = false;
    /** @type {Boolean} */
    this.tetriminoMoved = false;
    /** @type {Number} */
    this.tetriminoMovedCount = 0;
    /** @type {String} */
    this.message = "";
    /** @type {Number} */
    this.messageDisplayStartTime = 0;
    /** @type {String} */
    this.messageColor = "";

    //デバック用
    /** @type {Boolean} */
    this.enabeldFallDown = true;
    /** @type {Boolean} */
    this.click = false;
    /** @type {Boolean} */
    this.rightClick = false;
  }

  /**
   * 初期化
   */
  init() {
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("keydown", this.keyControll.bind(this));
    if (DEBUG) {
      this.canvas.addEventListener("mousedown", this.canvasMouseDown.bind(this));
      this.canvas.addEventListener("mouseup", this.canvasMouseUp.bind(this));
      this.canvas.addEventListener("mousemove", (e) => {
        if (this.click) {
          this.makeBlock(e);
        } else if (this.rightClick) {
          this.removeBlock(e);
        }
      });
      this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    this.resize();
    this.animation.start();
  }

  /**
   * ゲームを開始
   */
  start() {
    this.field.init();
    this.nextTetrimino = [];
    this.holdTetrimino = null;
    this.initTetrimino();
    this.shadowMinoGroundSearch();
    this.gameStatus = GAME_STATUS_PLAYING;
  }

  /**
   * 一時停止
   */
  pause() {
    this.gameStatus = GAME_STATUS_PAUSE;
  }

  /**
   * 再開
   */
  resume() {
    this.gameStatus = GAME_STATUS_PLAYING;
  }

  /**
   * テトリミノの初期化
   */
  initTetrimino() {
    if (this.nextTetrimino.length < GENERATED_TETRIMINO_LOWER_LIMIT) {
      const tetriminos = shuffle([...TETRIMINOS]);
      for (const mino of tetriminos) {
        const tetriminoBlocks = this.generateTetrimino(mino);
        this.nextTetrimino.push(tetriminoBlocks);
      }
    }
    const nextTetrimino = this.nextTetrimino.shift();
    this.tetrimino.setTetrimino(nextTetrimino);
    this.tetrimino.currentDirection = TETRIMINO_DIRECTION_UP;
    this.initTetriminoPosition();
    this.shadowMino = this.tetrimino.clone();
  }

  /**
   * テトリミノの位置を初期化
   */
  initTetriminoPosition() {
    const initCol = Math.floor(FIELD_WIDTH / 2) - TETRIMINO_FIELD / 2;
    this.tetrimino.setPosition(initCol, 0);
  }

  /**
   * キャンバスサイズが変更された際の処理
   */
  resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  /**
   * キーボードが押下された際の処理
   * @param {KeyboardEvent} e キーボードイベント
   * @returns
   */
  keyControll(e) {
    if (this.gameStatus != GAME_STATUS_PLAYING) return;

    if (DEBUG && e.shiftKey) {
      this.selectBlock(e);
      return;
    }

    switch (e.key) {
      case "ArrowLeft":
        if (!this.field.isHit(this.tetrimino, -1, 0)) {
          this.tetrimino.move(-1, 0);
          this.shadowMino.move(-1, 0);
          this.shadowMinoGroundSearch();
          if (this.installation) {
            this.tetriminoMoved = true;
            this.tetriminoMovedCount++;
          }
        }
        e.preventDefault();
        break;
      case "ArrowRight":
        if (!this.field.isHit(this.tetrimino, 1, 0)) {
          this.tetrimino.move(1, 0);
          this.shadowMino.move(1, 0);
          this.shadowMinoGroundSearch();
          if (this.installation) {
            this.tetriminoMoved = true;
            this.tetriminoMovedCount++;
          }
        }
        e.preventDefault();
        break;
      case "ArrowUp":
        while (!this.field.isHit(this.tetrimino, 0, 1)) {
          this.tetrimino.move(0, 1);
          this.score += 2;
        }
        this.installation = true;
        e.preventDefault();
        break;
      case "ArrowDown":
        if (!this.field.isHit(this.tetrimino, 0, 1)) {
          this.tetrimino.move(0, 1);
          this.score += 2;
          if (this.installation) {
            this.tetriminoMoved = true;
            this.tetriminoMovedCount++;
          }
        }
        e.preventDefault();
        break;
      case "z":
        this.tetriminoMoved = this.superRotationSystem(TETRIMINO_ROTATE_LEFT);
        this.shadowMino = this.tetrimino.clone();
        if (this.installation && this.tetriminoMoved) {
          this.tetriminoMovedCount++;
        }
        this.shadowMinoGroundSearch();
        e.preventDefault();
        break;
      case "x":
        this.tetriminoMoved = this.superRotationSystem(TETRIMINO_ROTATE_RIGHT);
        this.shadowMino = this.tetrimino.clone();
        if (this.installation && this.tetriminoMoved) {
          this.tetriminoMovedCount++;
        }
        this.shadowMinoGroundSearch();
        e.preventDefault();
        break;
      case "c":
      case " ":
        if (this.canHold) {
          this.setHoldTetrimino();
          this.canHold = false;
        }
        e.preventDefault();
        break;
    }

    if (DEBUG) {
      this.debugKeyControll(e);
    }
  }

  /**
   * デバック用のキーボード処理
   * @param {KeyboardEvent} e キーボードイベント
   */
  debugKeyControll(e) {
    switch (e.key) {
      case "q":
        this.enabeldFallDown = !this.enabeldFallDown;
        e.preventDefault();
        break;
      case "a":
        this.field.allBlockClear();
        e.preventDefault();
        break;
    }
  }

  /**
   * 任意のテトリミノを出現させる
   * @param {KeyboardEvent} e キーボードイベント
   */
  selectBlock(e) {
    e.preventDefault();

    let type = BLOCK_TYPE_NONE;

    switch (e.key) {
      case "I":
        type = BLOCK_TYPE_TETRIMINO_I;
        break;
      case "J":
        type = BLOCK_TYPE_TETRIMINO_J;
        break;
      case "L":
        type = BLOCK_TYPE_TETRIMINO_L;
        break;
      case "O":
        type = BLOCK_TYPE_TETRIMINO_O;
        break;
      case "Z":
        type = BLOCK_TYPE_TETRIMINO_Z;
        break;
      case "S":
        type = BLOCK_TYPE_TETRIMINO_S;
        break;
      case "T":
        type = BLOCK_TYPE_TETRIMINO_T;
        break;
    }

    if (type == BLOCK_TYPE_NONE) return;
    const tetriminoBlock = this.generateTetrimino(type);
    this.tetrimino.setTetrimino(tetriminoBlock);
    this.tetrimino.currentDirection = TETRIMINO_DIRECTION_UP;
    this.initTetriminoPosition();
    this.shadowMino = this.tetrimino.clone();
    this.shadowMinoGroundSearch();
  }

  /**
   * キャンバスにマウスのボタンが押下された際の処理
   * @param {MouseEvent} e マウスイベント
   * @returns
   */
  canvasMouseDown(e) {
    const { col, row } = convertColAndRowPosition(
      this.canvas,
      e.clientX,
      e.clientY,
      FIELD_POSITION_X + ORIGIN_POSITION_X,
      FIELD_POSITION_Y + ORIGIN_POSITION_Y,
      BLOCK_SIZE
    );
    if (!this.field.isInField(col, row)) {
      return;
    }

    if (e.button == 0) {
      const debugBlock = new FieldBlock(BLOCK_TYPE_TETRIMINO_I, BLOCK_COLOR_TETRIMINO_I);
      this.field.setBlock(col, row + SPACE_ROwS, debugBlock);
      this.click = true;
    } else {
      const clearBlock = new FieldBlock(BLOCK_TYPE_NONE);
      this.field.setBlock(col, row + SPACE_ROwS, clearBlock);
      this.rightClick = true;
    }
  }

  /**
   * マウスのボタンが話された際の処理
   */
  canvasMouseUp() {
    this.click = false;
    this.rightClick = false;
  }

  /**
   * フィールド内に任意のブロックを作成
   * @param {MouseEvent} e マウスイベント
   */
  makeBlock(e) {
    const { col, row } = convertColAndRowPosition(
      this.canvas,
      e.clientX,
      e.clientY,
      FIELD_POSITION_X + ORIGIN_POSITION_X,
      FIELD_POSITION_Y + ORIGIN_POSITION_Y,
      BLOCK_SIZE
    );
    const debugBlock = new FieldBlock(BLOCK_TYPE_TETRIMINO_I, BLOCK_COLOR_TETRIMINO_I);
    this.field.setBlock(col, row + SPACE_ROwS, debugBlock);
  }

  /**
   * フィールド内の任意のブロックを消去
   * @param {MouseEvent} e マウスイベント
   */
  removeBlock(e) {
    const { col, row } = convertColAndRowPosition(
      this.canvas,
      e.clientX,
      e.clientY,
      FIELD_POSITION_X + ORIGIN_POSITION_X,
      FIELD_POSITION_Y + ORIGIN_POSITION_Y,
      BLOCK_SIZE
    );
    const clearBlock = new FieldBlock(BLOCK_TYPE_NONE);
    this.field.setBlock(col, row + SPACE_ROwS, clearBlock);
    e.preventDefault();
  }

  /**
   * テトリミノがスムーズに回転できる様にする
   * @param {Number} rotateDirection どちらに回すか
   * @returns {Boolean} 回転できたかどうか
   */
  superRotationSystem(rotateDirection) {
    if (this.tetrimino.type == BLOCK_TYPE_TETRIMINO_O) {
      //Oミノは回転しても意味がないのでなにもしない
      return false;
    }

    if (this.tetrimino.type != BLOCK_TYPE_TETRIMINO_I) {
      //Iミノ以外
      const shiftTable = [
        //右→上
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: -2 },
          { x: 1, y: -2 },
        ],
        //上→右
        [
          { x: 0, y: 0 },
          { x: -1, y: 0 },
          { x: -1, y: -1 },
          { x: 0, y: 2 },
          { x: -1, y: 2 },
        ],
        //右→下
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: -2 },
          { x: 1, y: -2 },
        ],
        //上→左
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: -1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
        ],
      ];

      const prevRotateDirection = this.tetrimino.currentDirection;
      this.tetrimino.rotate(rotateDirection);
      if (
        prevRotateDirection == TETRIMINO_DIRECTION_LEFT &&
        this.tetrimino.currentDirection == TETRIMINO_DIRECTION_UP
      ) {
        //回転が左→上の場合はテーブルを書き換える
        shiftTable[0] = [
          { x: 0, y: 0 },
          { x: -2, y: 0 },
          { x: -2, y: 1 },
          { x: 0, y: -2 },
          { x: -1, y: -2 },
        ];
      } else if (
        prevRotateDirection == TETRIMINO_DIRECTION_LEFT &&
        this.tetrimino.currentDirection == TETRIMINO_DIRECTION_DOWN
      ) {
        //回転が左→下の場合はテーブルを書き換える
        shiftTable[2] = [
          { x: 0, y: 0 },
          { x: -1, y: 0 },
          { x: -1, y: 2 },
          { x: 0, y: -2 },
          { x: -1, y: -2 },
        ];
      }

      for (const shiftAmount of shiftTable[this.tetrimino.currentDirection]) {
        if (!this.field.isHit(this.tetrimino, shiftAmount.x, shiftAmount.y)) {
          this.tetrimino.move(shiftAmount.x, shiftAmount.y);
          return true;
        }
      }
      //全ての試行がダメだった場合は元に戻す
      this.tetrimino.rotate(rotateDirection == TETRIMINO_ROTATE_LEFT ? TETRIMINO_ROTATE_RIGHT : TETRIMINO_ROTATE_LEFT);
      return false;
    } else {
      //Iミノ
      const shiftTable = [
        //右→上
        [
          { x: 0, y: 0 },
          { x: 2, y: 0 },
          { x: -1, y: 0 },
          { x: 2, y: -1 },
          { x: -1, y: 2 },
        ],
        //上→右
        [
          { x: 0, y: 0 },
          { x: -2, y: 0 },
          { x: 1, y: 0 },
          { x: -2, y: 1 },
          { x: 1, y: -2 },
        ],
        //右→下
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: -2, y: 0 },
          { x: 1, y: 2 },
          { x: -2, y: -1 },
        ],
        //上→左
        [
          { x: 0, y: 0 },
          { x: -1, y: 0 },
          { x: 2, y: 0 },
          { x: -1, y: -2 },
          { x: 2, y: 1 },
        ],
        //左→上
        [
          { x: 0, y: 0 },
          { x: -2, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 1 },
          { x: -2, y: -1 },
        ],
        //下→右
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: -2, y: 0 },
          { x: 1, y: 2 },
          { x: -2, y: -1 },
        ],
        //左→下
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: -2, y: 0 },
          { x: -2, y: -2 },
          { x: -2, y: 1 },
        ],
        //下→左
        [
          { x: 0, y: 0 },
          { x: 2, y: 0 },
          { x: -1, y: 0 },
          { x: 2, y: -1 },
          { x: -1, y: 2 },
        ],
      ];

      const prevRotateDirection = this.tetrimino.currentDirection;
      this.tetrimino.rotate(rotateDirection);
      let offset = 0;
      if (prevRotateDirection == TETRIMINO_DIRECTION_LEFT || prevRotateDirection == TETRIMINO_DIRECTION_DOWN) {
        offset = 4;
      }

      for (const shiftAmount of shiftTable[this.tetrimino.currentDirection + offset]) {
        if (!this.field.isHit(this.tetrimino, shiftAmount.x, shiftAmount.y)) {
          this.tetrimino.move(shiftAmount.x, shiftAmount.y);
          return true;
        }
      }
      //全ての試行がダメだった場合は元に戻す
      this.tetrimino.rotate(rotateDirection == TETRIMINO_ROTATE_LEFT ? TETRIMINO_ROTATE_RIGHT : TETRIMINO_ROTATE_LEFT);
      return false;
    }
  }

  /**
   * 更新処理
   * @param {import("./animation.js").AnimInfo} animInfo アニメーション情報
   */
  update(animInfo) {
    const { getExtraData, setExtraData, currentAnimationTime } = animInfo;
    const { prevAnimationTime, displayText } = getExtraData();

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.gameStatus) {
      case GAME_STATUS_WAIT:
        if (currentAnimationTime - prevAnimationTime > TEXT_BLINK_INTERVAL) {
          setExtraData({ prevAnimationTime: currentAnimationTime, displayText: !displayText });
        }
        if (displayText) {
          this.gameStartText.draw(ctx, "右メニューのボタンを押してゲーム開始", this.centerX, this.centerY);
        }
        break;
      case GAME_STATUS_PLAYING:
        //テトリミノが地面に設置していないとき
        if (!this.installation) {
          //一定時間毎にテトリミノを落とす
          if (this.enabeldFallDown && currentAnimationTime - prevAnimationTime >= TETRIMINO_FALL_DOWN_INTERVAL) {
            this.tetrimino.fallDown();
            this.tetriminoMovedCount = 0;
            setExtraData({ prevAnimationTime: currentAnimationTime });
          }

          //下方向に障害物があれば
          if (this.field.isHit(this.tetrimino, 0, 1)) {
            this.installation = true;
            //設置してから動かせる上限を超えていたら強制的に固定
            if (this.tetriminoMovedCount > TETRIMINO_MOVED_COUNT_MAX) {
              this.tetriminoInstallationTime = 0;
            } else {
              //超えていなければ設置した際の時間を記録
              this.tetriminoInstallationTime = currentAnimationTime;
            }
          }
        } else if (this.installation) {
          //テトリミノが地面に設置しているとき
          //下方向に空間があったら
          if (!this.field.isHit(this.tetrimino, 0, 1)) {
            //設置状態をリセット
            this.installation = false;
            this.tetriminoMoved = false;
            setExtraData({ prevAnimationTime: currentAnimationTime });
          } else {
            //設置状態でテトリミノが動かされていたら
            if (this.tetriminoMoved) {
              //動かせる上限未満なら固定までの時間をリセット
              if (this.tetriminoMovedCount < TETRIMINO_MOVED_COUNT_MAX) {
                this.tetriminoInstallationTime = currentAnimationTime;
                this.tetriminoMoved = false;
              } else {
                //動かせる回数を超えていたら強制的に固定
                this.tetriminoInstallationTime = 0;
                this.tetriminoMoved = false;
              }
            }

            //固定までの猶予期間が過ぎていたらフィールドに固定
            if (currentAnimationTime - this.tetriminoInstallationTime >= TETRIMINO_LOCK_DOWN_TIME) {
              this.groundBlock();
              this.installation = false;
              //テトリミノの出現位置に他のテトリミノがあればゲームオーバー
              if (this.field.isHit(this.tetrimino, 0, 0)) {
                this.gameStatus = GAME_STATUS_GAME_OVER;
                this.finishFunc != null ? this.finishFunc() : null;
              }
            }
          }
        }

        this.drawGameContent();
        break;
      case GAME_STATUS_GAME_OVER:
        this.drawGameContent();
        this.gameMsgText.draw(
          ctx,
          "GAME OVER",
          FIELD_POSITION_X + (BLOCK_SIZE * FIELD_WIDTH) / 2 + ORIGIN_POSITION_X,
          FIELD_POSITION_Y + (BLOCK_SIZE * FIELD_HEIGHT) / 2 + ORIGIN_POSITION_Y
        );
        break;
      case GAME_STATUS_PAUSE:
        this.drawGameContent();
        this.gameMsgText.draw(
          ctx,
          "PAUSE",
          FIELD_POSITION_X + (BLOCK_SIZE * FIELD_WIDTH) / 2 + ORIGIN_POSITION_X,
          FIELD_POSITION_Y + (BLOCK_SIZE * FIELD_HEIGHT) / 2 + ORIGIN_POSITION_Y
        );
        break;
    }

    if (DEBUG) {
      ctx.fillStyle = "#808080";
      ctx.font = `20px ${USE_FONTS}`;
      ctx.textAlign = "start";
      ctx.textBaseline = "top";
      ctx.fillText("debug mode", 10, this.canvas.height - 25);
    }
  }

  /**
   * ゲームの内容を描画
   */
  drawGameContent() {
    this.ctx.strokeStyle = "#000000";
    this.field.draw(this.ctx);
    this.drawShadowMino();
    this.tetrimino.draw(this.ctx, FIELD_POSITION_X, FIELD_POSITION_Y);
    this.ctx.strokeStyle = DEFAULT_LINE_COLOR;
    this.drawNextTetrimino();
    this.drawHoldTetrimino();
    this.scoreText.draw(this.ctx, `score: ${this.score}`, DISPLAY_SCORE_POSITION_X, DISPLAY_SCORE_POSITION_Y);
    if (this.message != "") {
      const current = (Date.now() - this.messageDisplayStartTime) / MESSAGE_DISPLAY_TIME;
      const posY = easeOutCubic(INIT_MESSAGE_POSITION_Y, REACH_POINT_Y, current);
      this.ctx.globalAlpha = 1 - current;
      this.messageText.setFillStyle(this.messageColor);
      this.messageText.draw(this.ctx, this.message, INIT_MESSAGE_POSITION_X, posY);
      this.ctx.globalAlpha = 1;
      setTimeout(() => (this.message = ""), MESSAGE_DISPLAY_TIME);
    }
  }

  /**
   * NEXTミノを描画
   */
  drawNextTetrimino() {
    const displayBoxSize = BLOCK_SIZE * NEXT_TETRIMINO_DISPLAY_BOX_SCALE * TETRIMINO_FIELD;
    const nextTetriminoSize = BLOCK_SIZE * NEXT_TETRIMINO_SCALE * TETRIMINO_FIELD;

    for (let count = 0; count < DISPLAY_NEXT_TETRIMINO_NUM; count++) {
      this.ctx.beginPath();
      this.ctx.rect(
        DISPLAY_NEXT_TETRIMINO_POSITION_X + ORIGIN_POSITION_X,
        DISPLAY_NEXT_TETRIMINO_POSITION_Y + ORIGIN_POSITION_Y + count * displayBoxSize,
        displayBoxSize,
        displayBoxSize
      );
      this.ctx.stroke();
      const nextTetrimino = this.nextTetrimino[count];
      for (let i = 0; i < TETRIMINO_FIELD; i++) {
        for (let j = 0; j < TETRIMINO_FIELD; j++) {
          nextTetrimino.blocks[i][j].draw(
            this.ctx,
            j,
            i,
            DISPLAY_NEXT_TETRIMINO_POSITION_X + (displayBoxSize / 2 - nextTetriminoSize / 2),
            DISPLAY_NEXT_TETRIMINO_POSITION_Y + (displayBoxSize / 2 - nextTetriminoSize / 2) + count * displayBoxSize,
            NEXT_TETRIMINO_SCALE
          );
        }
      }
    }
  }

  /**
   * ホールドミノを描画
   */
  drawHoldTetrimino() {
    const displayBoxSize = BLOCK_SIZE * HOLD_TETRIMINO_DISPLAY_BOX_SCALE * TETRIMINO_FIELD;
    const holdTetriminoSize = BLOCK_SIZE * HOLD_TETRIMINO_SCALE * TETRIMINO_FIELD;

    this.ctx.beginPath();
    this.ctx.rect(
      DISPLAY_HOLD_TETRIMINO_POSITION_X + ORIGIN_POSITION_X,
      DISPLAY_HOLD_TETRIMINO_POSITION_Y + ORIGIN_POSITION_Y,
      displayBoxSize,
      displayBoxSize
    );
    this.ctx.stroke();

    if (this.holdTetrimino == null) return;

    this.holdTetrimino.draw(
      this.ctx,
      DISPLAY_HOLD_TETRIMINO_POSITION_X + (displayBoxSize / 2 - holdTetriminoSize / 2),
      DISPLAY_HOLD_TETRIMINO_POSITION_Y + (displayBoxSize / 2 - holdTetriminoSize / 2),
      HOLD_TETRIMINO_SCALE
    );
  }

  /**
   * シャドウミノを描画
   */
  drawShadowMino() {
    this.ctx.globalAlpha = SHADOW_ALPHA;
    this.shadowMino.draw(this.ctx, FIELD_POSITION_X, FIELD_POSITION_Y);
    this.ctx.globalAlpha = 1.0;
  }

  /**
   * シャドウミノが設置する地点を探索
   */
  shadowMinoGroundSearch() {
    this.shadowMino.row = this.tetrimino.row;
    while (!this.field.isHit(this.shadowMino, 0, 1)) {
      this.shadowMino.move(0, 1);
    }
  }

  /**
   * ホールドミノをセット
   */
  setHoldTetrimino() {
    if (this.holdTetrimino == null) {
      this.holdTetrimino = this.tetrimino.clone();
      this.holdTetrimino.col = 0;
      this.holdTetrimino.row = SPACE_ROwS;
      this.initTetrimino();
    } else {
      [this.tetrimino, this.holdTetrimino] = [this.holdTetrimino, this.tetrimino];
      this.holdTetrimino.col = 0;
      this.holdTetrimino.row = SPACE_ROwS;
      this.initTetriminoPosition();
      this.shadowMino = this.tetrimino.clone();
    }
    this.shadowMinoGroundSearch();
  }

  /**
   * テトリミノの設置後の処理
   */
  groundBlock() {
    this.field.mergeTetrimino(this.tetrimino);
    const canDeleteRows = this.field.checkCanDeleteRow();
    if (canDeleteRows.length != 0) {
      this.field.deleteRow(canDeleteRows);
      this.deletedChain++;
      this.score += this.deletedRowsToScore(canDeleteRows.length) + this.deletedChain > 1 ? 50 * this.deletedChain : 0;
      switch (canDeleteRows.length) {
        case LINE_DOUBLE:
          this.message = "double!";
          this.messageDisplayStartTime = Date.now();
          this.messageColor = MESSAGE_DOUBLE_COLOR;
          break;
        case LINE_TRIPLE:
          this.message = "triple!";
          this.messageDisplayStartTime = Date.now();
          this.messageColor = MESSAGE_TRIPLE_COLOR;
          break;
        case LINE_TETRIS:
          this.message = "tetris!";
          this.messageDisplayStartTime = Date.now();
          this.messageColor = MESSAGE_TETRIS_COLOR;
          break;
        default:
          this.message = "";
          break;
      }
    } else {
      this.deletedChain = 0;
    }
    this.initTetrimino();
    this.shadowMinoGroundSearch();
    this.canHold = true;
  }

  /**
   * テトリミノを生成
   * @param {Number} blockType 生成するテトリミノの種類
   * @returns {NextTetrimino}
   */
  generateTetrimino(blockType) {
    const type = blockType;
    const map = this.getTrtriminoMap(type);
    const color = this.getTetriminoColor(type);
    const tetrimino = map.map((row) =>
      row.split("").map((value) => (value == "1" ? new FieldBlock(type, color) : new FieldBlock(BLOCK_TYPE_NONE)))
    );

    return { type: type, blocks: tetrimino };
  }

  /**
   * 消したラインの数に応じたスコアの取得
   * @param {Number} rowCount 消したラインの本数
   * @returns {number} スコア
   */
  deletedRowsToScore(rowCount) {
    switch (rowCount) {
      case LINE_SINGLE:
        return SCORE_SINGLE;
      case LINE_DOUBLE:
        return SCORE_DOUBLE;
      case LINE_TRIPLE:
        return SCORE_TRIPLE;
      case LINE_TETRIS:
        return SCORE_TETRIS;
      default:
        return 0;
    }
  }

  /**
   * テトリミノの形状の取得
   * @param {Number} type テトリミノの種類
   * @returns {String[]} テトリミノの形状を表す文字列
   */
  getTrtriminoMap(type) {
    let map = Array(TETRIMINO_FIELD);

    switch (type) {
      case BLOCK_TYPE_TETRIMINO_I:
        map[0] = "0000";
        map[1] = "1111";
        map[2] = "0000";
        map[3] = "0000";
        break;
      case BLOCK_TYPE_TETRIMINO_J:
        map[0] = "0000";
        map[1] = "1000";
        map[2] = "1110";
        map[3] = "0000";
        break;
      case BLOCK_TYPE_TETRIMINO_L:
        map[0] = "0000";
        map[1] = "0010";
        map[2] = "1110";
        map[3] = "0000";
        break;
      case BLOCK_TYPE_TETRIMINO_O:
        map[0] = "0000";
        map[1] = "0110";
        map[2] = "0110";
        map[3] = "0000";
        break;
      case BLOCK_TYPE_TETRIMINO_S:
        map[0] = "0000";
        map[1] = "0110";
        map[2] = "1100";
        map[3] = "0000";
        break;
      case BLOCK_TYPE_TETRIMINO_Z:
        map[0] = "0000";
        map[1] = "1100";
        map[2] = "0110";
        map[3] = "0000";
        break;
      case BLOCK_TYPE_TETRIMINO_T:
        map[0] = "0000";
        map[1] = "0100";
        map[2] = "1110";
        map[3] = "0000";
        break;
    }

    return map;
  }

  /**
   * 対応するテトリミノの色コードを取得
   * @param {Number} type テトリミノの種類
   * @returns {number} テトリミノの色コード
   */
  getTetriminoColor(type) {
    switch (type) {
      case BLOCK_TYPE_TETRIMINO_I:
        return BLOCK_COLOR_TETRIMINO_I;
      case BLOCK_TYPE_TETRIMINO_J:
        return BLOCK_COLOR_TETRIMINO_J;
      case BLOCK_TYPE_TETRIMINO_L:
        return BLOCK_COLOR_TETRIMINO_L;
      case BLOCK_TYPE_TETRIMINO_O:
        return BLOCK_COLOR_TETRIMINO_O;
      case BLOCK_TYPE_TETRIMINO_S:
        return BLOCK_COLOR_TETRIMINO_S;
      case BLOCK_TYPE_TETRIMINO_Z:
        return BLOCK_COLOR_TETRIMINO_Z;
      case BLOCK_TYPE_TETRIMINO_T:
        return BLOCK_COLOR_TETRIMINO_T;
      default:
        return null;
    }
  }
}

export default Game;
