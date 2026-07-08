import { emit } from '../helpers.js';

export class SoQuickView extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.closeButtons = Array.from(this.querySelectorAll('[data-quick-view-close]'));
    this.content = this.querySelector('[data-quick-view-content]');
    this.onOpen = (event) => this.open(event.detail?.productUrl);
    this.close = this.close.bind(this);
    this.closeButtons.forEach((button) => button.addEventListener('click', this.close));

    if (typeof document !== 'undefined') {
      document.addEventListener('so:quick-view:open', this.onOpen);
      document.addEventListener('keydown', this);
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.closeButtons.forEach((button) => button.removeEventListener('click', this.close));
    if (typeof document !== 'undefined') {
      document.removeEventListener('so:quick-view:open', this.onOpen);
      document.removeEventListener('keydown', this);
    }
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape') {
      this.close();
    }
  }

  open(productUrl) {
    this.setAttribute('open', '');
    if (productUrl) {
      this.setAttribute('product-url', productUrl);
    }
    emit(this, 'so:quick-view:opened', { productUrl });
  }

  close() {
    this.removeAttribute('open');
  }
}
