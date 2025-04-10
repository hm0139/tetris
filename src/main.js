import { GAME_STATUS_PLAYING, GAME_STATUS_WAIT } from "./constval.js";
import Dialog from "./dialog.js";
import Game from "./game.js";
import { switchFormDisabled } from "./util.js";

function main() {
  const canvas = document.getElementById("main");
  const game = new Game(canvas);
  const gameStartBtn = document.getElementById("game-start-btn");
  const gameCancelBtn = document.getElementById("game-cancel-btn");
  const continueBtn = document.getElementById("continue-btn");
  const gamePauseBtn = document.getElementById("game-pause");

  gameStartBtn.addEventListener("click", () => {
    switchFormDisabled([
      { formElement: gameStartBtn, disabled: true, className: "cursor" },
      { formElement: gamePauseBtn, disabled: false, className: "cursor" },
      { formElement: gameCancelBtn, disabled: false, className: "cursor" },
    ]);
    game.start();
  });

  continueBtn.addEventListener("click", () => {
    switchFormDisabled([
      { formElement: gameStartBtn, disabled: false, className: "cursor" },
      { formElement: continueBtn, disabled: true, className: "cursor" },
      { formElement: gameCancelBtn, disabled: true, className: "cursor" },
    ]);
    game.gameStatus = GAME_STATUS_WAIT;
  });

  gamePauseBtn.addEventListener("click", () => {
    if (game.gameStatus == GAME_STATUS_PLAYING) {
      gamePauseBtn.value = "再開";
      game.pause();
    } else {
      gamePauseBtn.value = "一時停止";
      game.resume();
    }
  });

  const dialog = new Dialog("dialog-box", "dialog-active", "確認", "ゲームを中断しますか？");
  dialog.addButton([
    {
      value: "はい",
      func: () => {
        game.gameStatus = GAME_STATUS_WAIT;
        switchFormDisabled([
          { formElement: gameStartBtn, disabled: false, className: "cursor" },
          { formElement: gameCancelBtn, disabled: true, className: "cursor" },
          { formElement: gamePauseBtn, disabled: true, className: "cursor" },
        ]);
        gamePauseBtn.value = "一時停止";
        dialog.setDialogVisibility(false);
      },
      className: "cursor ui-btn",
    },
    {
      value: "いいえ",
      func: () => {
        game.resume();
        gamePauseBtn.value = "一時停止";
        dialog.setDialogVisibility(false);
      },
      className: "cursor ui-btn",
    },
  ]);

  gameCancelBtn.addEventListener("click", () => {
    game.pause();
    dialog.setDialogVisibility(true);
  });

  game.finishFunc = () => {
    switchFormDisabled([
      { formElement: continueBtn, disabled: false, className: "cursor" },
      { formElement: gamePauseBtn, disabled: true, className: "cursor" },
      { formElement: gameCancelBtn, disabled: true, className: "cursor" },
    ]);
  };

  game.init();
}

window.addEventListener("DOMContentLoaded", main);
