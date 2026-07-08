export class SoModal extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.closeButtons = Array.from(this.querySelectorAll('[data-modal-close]'));
    this.closeButtons.forEach((button) => button.addEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this);
    }

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
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }
}
