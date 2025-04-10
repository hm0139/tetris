class Dialog {
  constructor(dialogId, toggleClass, headerText, contentText = "") {
    this.dialogId = dialogId;
    this.headerText = headerText;
    this.contentText = contentText;
    this.dialog = document.getElementById(dialogId);
    this.buttons = [];
    this.visibility = false;
    this.toggleClass = toggleClass;
    this.dialogBody = this.dialog.querySelector(".dialog-body");

    this.init();
  }

  init() {
    this.setHeaderText(this.headerText);
    this.setContentText(this.contentText);
  }

  addButton(addButtons) {
    let dialogButtons = this.dialogBody.querySelector(".dialog-btn");
    if (dialogButtons == null) {
      dialogButtons = document.createElement("div");
      dialogButtons.className = "dialog-btn";
    }
    const originalButton = document.createElement("input");
    originalButton.type = "button";
    for (const button of addButtons) {
      const cloneButton = originalButton.cloneNode();
      cloneButton.value = button.value;
      cloneButton.className = button.className;
      cloneButton.addEventListener("click", button.func);
      dialogButtons.appendChild(cloneButton);
    }
    if (addButtons.length > 0) {
      this.dialogBody.appendChild(dialogButtons);
      this.buttons.push(...addButtons);
    }
  }

  setHeaderText(text) {
    const dialogHeder = this.dialog.querySelector(".dialog-header");
    dialogHeder.textContent = text;
  }

  setContentText(text) {
    this.contentText = text;
    const dialogContent = this.dialog.querySelector(".dialog-body");
    dialogContent.innerHTML = `<div class="dialog-text"><div>${this.contentText}</div></div>`;
  }

  setDialogVisibility(visible) {
    if (visible) {
      this.dialog.classList.add(this.toggleClass);
    } else {
      this.dialog.classList.remove(this.toggleClass);
    }
    this.visibility = visible;
  }
}

export default Dialog;
