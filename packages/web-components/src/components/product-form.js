import { emit } from '../helpers.js';

export class SoProductForm extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.submitButton = this.querySelector('[type="submit"]');
    this.onSubmit = this.onSubmit.bind(this);
    this.form?.addEventListener('submit', this.onSubmit);
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.form?.removeEventListener('submit', this.onSubmit);
    this._connected = false;
  }

  async onSubmit(event) {
    if (this.isUnavailable()) {
      event.preventDefault();
      return;
    }

    if (!this.hasAttribute('ajax') || !this.form) return;

    event.preventDefault();
    this.setBusy(true);

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this.form)
      });

      if (!response.ok) {
        throw new Error('Add to cart failed');
      }

      const item = await response.json();
      emit(this, 'so:cart:add', { item });
    } catch (error) {
      emit(this, 'so:cart:error', { error });
    } finally {
      this.setBusy(false);
    }
  }

  setBusy(busy) {
    this.toggleAttribute('aria-busy', busy);
    this.submitButton?.toggleAttribute('aria-busy', busy);
    if (this.submitButton) {
      this.submitButton.disabled = busy || this.submitButton.hasAttribute('data-variant-disabled');
    }
  }

  isUnavailable() {
    const variantInput = this.form?.querySelector('[name="id"]');
    return this.submitButton?.disabled === true || !variantInput?.value;
  }
}
