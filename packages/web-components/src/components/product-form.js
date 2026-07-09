import { emit } from '../helpers.js';

/**
 * so-product-form — Submits add-to-cart forms normally or through AJAX.
 *
 * Attributes:
 *   ajax        — Posts to /cart/add.js and emits cart events.
 *   aria-busy   — Set while an AJAX request is pending.
 *
 * Events:
 *   so:form:submit  — Before form submission (cancelable).
 *   so:cart:add     — After successful add-to-cart.
 *   so:cart:error   — On add-to-cart failure.
 *   so:form:success — After successful submission (non-AJAX or AJAX).
 *
 * Public API:
 *   submit()        — Trigger form submission programmatically.
 *   reset()         — Reset the form to initial state.
 *   setSubmitting(bool) — Set busy state.
 *   serializeBody() — Returns JSON string of form data.
 */
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

  /** Programmatic submit. */
  submit() {
    this.form?.requestSubmit?.(this.submitButton) || this.form?.submit();
  }

  /** Reset form and clear busy state. */
  reset() {
    this.form?.reset();
    this.setBusy(false);
  }

  /** Set submitting (busy) state. */
  setSubmitting(busy) {
    this.setBusy(busy);
  }

  async onSubmit(event) {
    if (this.isUnavailable()) {
      event.preventDefault();
      return;
    }

    // Allow consumers to intercept/cancel submission
    const beforeSubmit = new CustomEvent('so:form:submit', {
      bubbles: true,
      cancelable: true,
      detail: { action: this.form?.action, method: this.form?.method }
    });
    this.dispatchEvent(beforeSubmit);
    if (beforeSubmit.defaultPrevented) {
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
      emit(this, 'so:form:success', { item });
    } catch (error) {
      emit(this, 'so:cart:error', { error });
    } finally {
      this.setBusy(false);
    }
  }

  /** Serialize form data to JSON string. */
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
