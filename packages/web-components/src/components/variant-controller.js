import { emit } from '../helpers.js';

export class SoVariantController extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.optionInputs = Array.from(this.querySelectorAll('[data-variant-option]'));
    this.formId = this.getAttribute('product-form-id');
    this.form = this.getProductForm();
    this.variantInput = this.getVariantInput();
    this.submitButton = this.getSubmitButton();
    this.variants = this.getVariants();
    this.onChange = () => this.syncVariant();

    this.optionInputs.forEach((input) => input.addEventListener('change', this.onChange));
    this.syncVariant();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.optionInputs.forEach((input) => input.removeEventListener('change', this.onChange));
    this._connected = false;
  }

  syncVariant() {
    const selectedOptions = this.getSelectedOptions();
    const selectedVariant = this.variants.find((variant) => {
      return selectedOptions.every((value, index) => variant.options?.[index] === value);
    });

    if (this.variantInput) {
      this.variantInput.value = selectedVariant ? String(selectedVariant.id) : '';
      this.variantInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this.syncSubmitButton(selectedVariant);
    this.toggleUnavailableState(selectedVariant);
    emit(this, 'so:variant:change', {
      variant: selectedVariant || null,
      formId: this.formId || null
    });
  }

  getSelectedOptions() {
    const optionNames = [...new Set(this.optionInputs.map((input) => input.name))];

    return optionNames.map((name) => {
      const selected = this.optionInputs.find((input) => input.name === name && input.checked);
      return selected?.value ?? '';
    });
  }

  getVariantInput() {
    return this.form?.querySelector('[name="id"]') || this.querySelector('[name="id"]');
  }

  getProductForm() {
    return this.formId && typeof document !== 'undefined' ? document.getElementById(this.formId) : null;
  }

  getSubmitButton() {
    return this.form?.querySelector('[type="submit"]') || this.querySelector('[type="submit"]');
  }

  getVariants() {
    const script = this.querySelector('[data-variant-json]');
    if (!script?.textContent) return [];

    try {
      return JSON.parse(script.textContent);
    } catch {
      return [];
    }
  }

  toggleUnavailableState(variant) {
    const unavailable = !variant || variant.available === false;
    this.toggleAttribute('data-unavailable', unavailable);
  }

  syncSubmitButton(variant) {
    if (!this.submitButton) return;

    const disabled = !variant || variant.available === false;
    const text = this.getButtonText(variant);

    this.submitButton.toggleAttribute('data-variant-disabled', disabled);
    this.submitButton.disabled = disabled || this.submitButton.hasAttribute('aria-busy');

    if (text) {
      this.submitButton.textContent = text;
    }
  }

  getButtonText(variant) {
    if (!variant) {
      return this.submitButton.getAttribute('data-unavailable-text') || 'Unavailable';
    }

    if (variant.available === false) {
      return this.submitButton.getAttribute('data-sold-out-text') || 'Sold out';
    }

    return this.submitButton.getAttribute('data-add-to-cart-text') || 'Add to cart';
  }
}
