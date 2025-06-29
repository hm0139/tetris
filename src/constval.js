//全ての原点となる位置(px)
export const ORIGIN_POSITION_X = 150;
export const ORIGIN_POSITION_Y = 20;

//フィールドの大きさ(壁を含む)
export const FIELD_WIDTH = 12;
export const FIELD_HEIGHT = 21;
export const SPACE_ROwS = 2; //フィールド上部の余分なスペース

export const BLOCK_SIZE = 25; //ブロック一つの大きさ(px)

//フィールドの位置(px)
export const FIELD_POSITION_X = 100;
export const FIELD_POSITION_Y = 40;

//操作中のテトリミノのを保持する配列の大きさ(縦X横)
export const TETRIMINO_FIELD = 4;

//フィールドの各ブロックの種類
export const BLOCK_TYPE_NONE = 0;
export const BLOCK_TYPE_CONST_BLOCK = 1;
export const BLOCK_TYPE_TETRIMINO_O = 2;
export const BLOCK_TYPE_TETRIMINO_I = 3;
export const BLOCK_TYPE_TETRIMINO_J = 4;
export const BLOCK_TYPE_TETRIMINO_L = 5;
export const BLOCK_TYPE_TETRIMINO_Z = 6;
export const BLOCK_TYPE_TETRIMINO_S = 7;
export const BLOCK_TYPE_TETRIMINO_T = 8;

//フィールドの各ブロックの色
export const BLOCK_COLOR_CONST_BLOCK = "#808080";
export const BLOCK_COLOR_TETRIMINO_O = "#ffff00";
export const BLOCK_COLOR_TETRIMINO_I = "#00ffff";
export const BLOCK_COLOR_TETRIMINO_J = "#0000ff";
export const BLOCK_COLOR_TETRIMINO_L = "#ffa500";
export const BLOCK_COLOR_TETRIMINO_Z = "#ff0000";
export const BLOCK_COLOR_TETRIMINO_S = "#00ff00";
export const BLOCK_COLOR_TETRIMINO_T = "#ff00ff";

export const DEFAULT_LINE_COLOR = "#000000";
export const FIELD_BACK_GROUND_LINE_COLOR = "#f0f0f0";

export const TETRIMINO_FALL_DOWN_INTERVAL = 1000; //テトリミノが落下する間隔(ms)

//テトリミノをどちらに回すかの定数
export const TETRIMINO_ROTATE_RIGHT = 0;
export const TETRIMINO_ROTATE_LEFT = 1;

//テトリミノの現在の方向
export const TETRIMINO_DIRECTION_UP = 0;
export const TETRIMINO_DIRECTION_RIGHT = 1;
export const TETRIMINO_DIRECTION_DOWN = 2;
export const TETRIMINO_DIRECTION_LEFT = 3;

export const DISPLAY_NEXT_TETRIMINO_NUM = 6; //表示するネクストミノの数
export const GENERATED_TETRIMINO_LOWER_LIMIT = 7; //生成したネクストミノがこの数を下回った際に生成

//ネクストミノを表示する位置(px)
export const DISPLAY_NEXT_TETRIMINO_POSITION_X = 420;
export const DISPLAY_NEXT_TETRIMINO_POSITION_Y = 100;

export const NEXT_TETRIMINO_SCALE = 0.5; //ネクストミノを表示するブロック一つのBLOCK_SIZEに対する比率
export const NEXT_TETRIMINO_DISPLAY_BOX_SCALE = 0.6; //ネクストミノを表示する際に表示する枠の大きさをBLOCK_SIZEに対する比率で決定する定数

//ホールドしたテトリミノを表示する位置(px)
export const DISPLAY_HOLD_TETRIMINO_POSITION_X = 10;
export const DISPLAY_HOLD_TETRIMINO_POSITION_Y = 100;

export const HOLD_TETRIMINO_SCALE = 0.5; //ホールドしたテトリミノのブロック一つのBLOCK_SIZEに対する比率
export const HOLD_TETRIMINO_DISPLAY_BOX_SCALE = 0.6; //ホールドしたテトリミノを表示する際の枠の大きさをBLOCK_SIZEに対する比率で決定する定数

//テトリミノの配列
export const TETRIMINOS = [
  BLOCK_TYPE_TETRIMINO_O,
  BLOCK_TYPE_TETRIMINO_I,
  BLOCK_TYPE_TETRIMINO_J,
  BLOCK_TYPE_TETRIMINO_L,
  BLOCK_TYPE_TETRIMINO_Z,
  BLOCK_TYPE_TETRIMINO_S,
  BLOCK_TYPE_TETRIMINO_T,
];

export const SHADOW_ALPHA = 0.4; //テトリミノの影の透明度

//ゲームの状態を表す定数
export const GAME_STATUS_WAIT = 0;
export const GAME_STATUS_PLAYING = 1;
export const GAME_STATUS_GAME_OVER = 2;
export const GAME_STATUS_PAUSE = 3;

//フォントの大きさ(px)と使用フォント
export const DEFAULT_FONT_SIZE = 40;
export const USE_FONTS = "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif";

//スコアを表示する位置(px)
export const DISPLAY_SCORE_POSITION_X = 10;
export const DISPLAY_SCORE_POSITION_Y = 10;

export const SCORE_TEXT_FONT_SIZE = 20; //スコアを表示するフォントサイズ(px)

//テトリミノを消した際に一度に消されたラインの本数
export const LINE_SINGLE = 1;
export const LINE_DOUBLE = 2;
export const LINE_TRIPLE = 3;
export const LINE_TETRIS = 4;

//テトリミノを消した際に消したラインの本数に応じて加算されるスコア
export const SCORE_SINGLE = 100;
export const SCORE_DOUBLE = 300;
export const SCORE_TRIPLE = 500;
export const SCORE_TETRIS = 800;

//テトリミノを消した際に出るメッセージの色
export const MESSAGE_DOUBLE_COLOR = "#ffa500";
export const MESSAGE_TRIPLE_COLOR = "#adff2f";
export const MESSAGE_TETRIS_COLOR = "#ff00ff";

export const TEXT_BLINK_INTERVAL = 1000; //テキストの点滅速度(ms)

export const TETRIMINO_MOVED_COUNT_MAX = 15; //テトリミノが設置してから移動・回転できる最大数
export const TETRIMINO_LOCK_DOWN_TIME = 500; //テトリミノが地面や他のテトリミノに設置された場合に固定されるまでの時間(ms)

export const MESSAGE_FONT_SIZE = 30; //メッセージのフォントサイズ(px)
//ユーザの操作によって表示される文字列の位置(px)
export const INIT_MESSAGE_POSITION_X = 120;
export const INIT_MESSAGE_POSITION_Y = 500;

export const REACH_POINT_Y = 300; //メッセージが上昇するアニメーションにおいての到達地点(px)
export const MESSAGE_DISPLAY_TIME = 2000; //メッセージが表示される時間(ms)

export const DEBUG = true; //デバックモードの有効無効切替
