class Modal {
  constructor(modalId) {
    this.modalId = modalId;
    this.modal = document.getElementById(this.modalId);
    this.modalBox = new bootstrap.Modal(this.modal);
    this.modalHeder = this.modal.querySelector(".modal-title");
    this.modalContent = this.modal.querySelector(".modal-body");
  }

  show() {
    this.modalBox.show();
  }

  hide() {
    this.modalBox.hide();
  }

  setHeaderText(text) {
    this.modalHeder.textContent = text;
  }

  setContentText(text) {
    this.modalContent.innerHTML = text;
  }

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

  removeButtons() {
    let modalFotter = this.modal.querySelector(".modal-footer");
    if (modalFotter == null) return;

    while (modalFotter.childElementCount > 0) {
      modalFotter.children[0].remove();
    }
  }
}

export default Modal;
