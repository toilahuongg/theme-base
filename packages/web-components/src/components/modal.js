export class SoModal extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.panel = this.querySelector('[data-modal-panel]') || this;
    this.closeButtons = Array.from(this.querySelectorAll('[data-modal-close]'));
    this.closeButtons.forEach((button) => button.addEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this);
    }

    this.syncPanel();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.closeButtons.forEach((button) => button.removeEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this);
    }

    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape' && this.isOpen()) {
      this.close();
      return;
    }

    if (event.type === 'click' && this.closeButtons.includes(event.currentTarget)) {
      this.close();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  open() {
    if (this.isOpen()) return;
    this.setAttribute('open', '');
    this.syncPanel();
  }

  close() {
    if (!this.isOpen()) return;
    this.removeAttribute('open');
    this.syncPanel();
  }

  syncPanel() {
    if (this.panel) {
      this.panel.hidden = !this.isOpen();
    }
  }
}
