import { emit } from '../helpers.js';

export class SoQuickAdd extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.submitButton = this.querySelector('[type="submit"]');
    this.quickViewTrigger = this.querySelector('[data-quick-add-open]');
    this.onSubmit = this.onSubmit.bind(this);
    this.onQuickViewClick = (event) => this.openQuickView(event);
    this.form?.addEventListener('submit', this.onSubmit);
    this.quickViewTrigger?.addEventListener('click', this.onQuickViewClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.form?.removeEventListener('submit', this.onSubmit);
    this.quickViewTrigger?.removeEventListener('click', this.onQuickViewClick);
    this._connected = false;
  }

  async onSubmit(event) {
    if (this.hasAttribute('requires-options')) {
      this.openQuickView(event);
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
        throw new Error('Quick add failed');
      }

      const item = await response.json();
      emit(this, 'so:cart:add', { item });
    } catch (error) {
      emit(this, 'so:cart:error', { error });
    } finally {
      this.setBusy(false);
    }
  }

  openQuickView(event) {
    event.preventDefault();
    emit(this, 'so:quick-view:open', { productUrl: this.getAttribute('product-url') });
  }

  setBusy(busy) {
    this.toggleAttribute('aria-busy', busy);
    if (this.submitButton) {
      this.submitButton.disabled = busy;
      this.submitButton.toggleAttribute('aria-busy', busy);
    }
  }
}
