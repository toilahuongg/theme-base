export class SoQuantity extends HTMLElement {
  constructor() {
    super();
    this.decrease = () => this.step(-1);
    this.increase = () => this.step(1);
    this.update = () => this.updateControls();
  }

  connectedCallback() {
    if (this._connected) return;

    this.input = this.querySelector('input[type="number"]');
    this.decreaseButton = this.querySelector('[data-quantity-decrease]');
    this.increaseButton = this.querySelector('[data-quantity-increase]');

    if (!this.input) return;

    this.decreaseButton?.addEventListener('click', this.decrease);
    this.increaseButton?.addEventListener('click', this.increase);
    this.input.addEventListener('input', this.update);
    this.input.addEventListener('change', this.update);
    this.updateControls();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.decreaseButton?.removeEventListener('click', this.decrease);
    this.increaseButton?.removeEventListener('click', this.increase);
    this.input?.removeEventListener('input', this.update);
    this.input?.removeEventListener('change', this.update);
    this._connected = false;
  }

  step(direction) {
    const step = this.getStep();
    const min = this.getMin();
    const max = this.getMax();
    const current = this.getCurrent();
    const nextValue = Math.min(max, Math.max(min, current + direction * step));

    this.input.value = String(nextValue);
    this.updateControls();
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  updateControls() {
    if (!this.input) return;

    const current = this.getCurrent();
    const min = this.getMin();
    const max = this.getMax();

    this.setButtonDisabled(this.decreaseButton, Number.isFinite(min) && current <= min);
    this.setButtonDisabled(this.increaseButton, Number.isFinite(max) && current >= max);
  }

  setButtonDisabled(button, disabled) {
    if (!button) return;

    button.disabled = disabled;
    button.toggleAttribute?.('disabled', disabled);
    button.setAttribute?.('aria-disabled', disabled ? 'true' : 'false');
  }

  getStep() {
    const step = Number(this.input.step);
    return Number.isFinite(step) && step > 0 ? step : 1;
  }

  getMin() {
    if (this.input.min === '') return -Infinity;

    const min = Number(this.input.min);
    return Number.isFinite(min) ? min : -Infinity;
  }

  getMax() {
    if (this.input.max === '') return Infinity;

    const max = Number(this.input.max);
    return Number.isFinite(max) ? max : Infinity;
  }

  getCurrent() {
    const current = Number(this.input.value);
    if (Number.isFinite(current)) return current;

    const min = this.getMin();
    return Number.isFinite(min) ? min : 0;
  }
}
