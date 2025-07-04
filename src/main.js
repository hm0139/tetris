import "bootstrap/dist/css/bootstrap.min.css";
import { GAME_STATUS_PLAYING, GAME_STATUS_WAIT } from "./constval";
import ModalWindow from "./modalWindow";
import Game from "./game";
import { switchFormDisabled } from "./util";

function main() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("main");
  const game = new Game(canvas);
  const gameStartBtn = document.getElementById("game-start-btn");
  const gameCancelBtn = document.getElementById("game-cancel-btn");
  const continueBtn = document.getElementById("continue-btn");
  const gamePauseBtn = document.getElementById("game-pause");

  gameStartBtn.addEventListener("click", () => {
    switchFormDisabled([
      { formElement: gameStartBtn, disabled: true },
      { formElement: gamePauseBtn, disabled: false },
      { formElement: gameCancelBtn, disabled: false },
    ]);
    game.start();
  });

  continueBtn.addEventListener("click", () => {
    switchFormDisabled([
      { formElement: gameStartBtn, disabled: false },
      { formElement: continueBtn, disabled: true },
      { formElement: gameCancelBtn, disabled: true },
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

  const modal = new ModalWindow("modal-box");
  modal.setHeaderText("確認");
  modal.setContentText("ゲームを中断しますか？");
  modal.addButtons([
    {
      value: "はい",
      func: () => {
        switchFormDisabled([
          { formElement: gameStartBtn, disabled: false },
          { formElement: gameCancelBtn, disabled: true },
          { formElement: gamePauseBtn, disabled: true },
        ]);
        game.gameStatus = GAME_STATUS_WAIT;
        modal.hide();
      },
      className: "btn btn-primary",
    },
    {
      value: "いいえ",
      func: () => {
        game.resume();
        modal.hide();
      },
      className: "btn btn-secondary",
    },
  ]);

  gameCancelBtn.addEventListener("click", () => {
    modal.show();
    game.pause();
  });

  game.finishFunc = () => {
    switchFormDisabled([
      { formElement: continueBtn, disabled: false },
      { formElement: gamePauseBtn, disabled: true },
      { formElement: gameCancelBtn, disabled: true },
    ]);
  };

  game.init();
}

window.addEventListener("DOMContentLoaded", main);
