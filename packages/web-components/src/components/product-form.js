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
      const body = this.serializeBody();
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.description || `Add to cart failed (${response.status})`);
      }

      const item = await response.json();
      emit(this, 'so:cart:add', { item });
    } catch (error) {
      emit(this, 'so:cart:error', { error });
    } finally {
      this.setBusy(false);
    }
  }

  serializeBody() {
    const formData = new FormData(this.form);
    const body = {};
    formData.forEach((value, key) => {
      body[key] = String(value);
    });
    return JSON.stringify(body);
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
