import { Modal } from "bootstrap";

/**
 * @typedef {Object} Button 追加するボタン
 * @property {String} value ボタンに表示する文字列
 * @property {String} className ボタンのHTMLクラス
 * @property {Function} func ボタンを押下した際に呼び出されるコールバック関数
 */
class ModalWindow {
  /**
   * コンストラクタ
   * @param {String} modalId モーダルウィンドウのHTML要素のID
   */
  constructor(modalId) {
    /** @type {String} */
    this.modalId = modalId;
    /** @type {HTMLElement} */
    this.modal = document.getElementById(this.modalId);
    /** @type {Modal} */
    this.modalBox = new Modal(this.modal);
    /** @type {HTMLElement} */
    this.modalHeder = this.modal.querySelector(".modal-title");
    /** @type {HTMLElement} */
    this.modalContent = this.modal.querySelector(".modal-body");
  }

  /**
   * モーダルウィンドウの表示
   */
  show() {
    this.modalBox.show();
  }

  /**
   * モーダルウィンドウの非表示
   */
  hide() {
    this.modalBox.hide();
  }

  /**
   * モーダルウィンドウのヘッダ部分の文字列の設定
   * @param {String} text 設定する文字列
   */
  setHeaderText(text) {
    this.modalHeder.textContent = text;
  }

  /**
   * モーダルウィンドウの内容の設定
   * @param {String} 設定する内容
   */
  setContentText(text) {
    this.modalContent.innerHTML = text;
  }

  /**
   * モーダルウィンドウにボタンを追加
   * @param {Button[]} buttons
   */
  addButtons(buttons) {
    let modalFotter = this.modal.querySelector(".modal-footer");
    if (modalFotter == null) {
      modalFotter = document.createElement("div");
      modalFotter.className = "modal-footer";
      this.modalContent.parentNode.insertBefore(modalFotter, this.modalContent.nextElementSibling);
    }
    const originalButton = document.createElement("input");
    originalButton.type = "button";
    for (const btn of buttons) {
      const cloneButton = originalButton.cloneNode();
      cloneButton.value = btn.value;
      cloneButton.className = btn.className;
      cloneButton.addEventListener("click", btn.func);
      modalFotter.append(cloneButton);
    }
  }

  /**
   * ボタンの削除
   */
  removeButtons() {
    let modalFotter = this.modal.querySelector(".modal-footer");
    if (modalFotter == null) return;

    while (modalFotter.childElementCount > 0) {
      modalFotter.children[0].remove();
    }
  }
}

export default ModalWindow;
