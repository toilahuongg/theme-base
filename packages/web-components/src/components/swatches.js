import { emit } from '../helpers.js';

/**
 * so-swatches — Manages pressed state for swatch buttons and emits selected value.
 *
 * Attributes:
 *   name  — Group name for radio-style selection (for a11y).
 *
 * Events:
 *   so:swatch:change  — { value, element }
 *
 * Public API:
 *   value              — Currently selected swatch value.
 *   setValue(val)      — Select a swatch by value.
 *   setOptions([...])  — Replace all swatch options.
 *   selectedIndex      — Index of the currently selected swatch.
 */
export class SoSwatches extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.swatches = Array.from(this.querySelectorAll('[data-swatch-value]'));
    this.onKeydown = this._onKeydown.bind(this);
    this.swatches.forEach((swatch) => swatch.addEventListener('click', this._onClick.bind(this)));
    this.addEventListener('keydown', this.onKeydown);

    this._connected = true;
  }

  disconnectedCallback() {
    this.swatches?.forEach((swatch) => swatch.removeEventListener('click', this._onClick));
    this.removeEventListener('keydown', this.onKeydown);
    this._connected = false;
  }

  _onClick(event) {
    const swatch = event.currentTarget;
    this.select(swatch);
  }

  /** Keyboard: ArrowLeft/ArrowUp/ArrowRight/ArrowDown to navigate swatches. */
  _onKeydown(event) {
    const index = this.swatches.indexOf(event.target);
    if (index === -1) return;

    const perRow = this._getPerRow();
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % this.swatches.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + this.swatches.length) % this.swatches.length;
        break;
      case 'ArrowDown':
        nextIndex = (index + perRow) % this.swatches.length;
        break;
      case 'ArrowUp':
        nextIndex = (index - perRow + this.swatches.length) % this.swatches.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = this.swatches.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.swatches[nextIndex].focus();
    this.select(this.swatches[nextIndex]);
  }

  /** Select a swatch element. */
  select(swatch) {
    if (!swatch) return;
    this.swatches.forEach((s) => {
      s.setAttribute('aria-pressed', s === swatch ? 'true' : 'false');
    });
    emit(this, 'so:swatch:change', {
      value: swatch.getAttribute('data-swatch-value'),
      element: swatch
    });
  }

  /** Currently selected swatch value. */
  get value() {
    const selected = this.swatches.find((s) => s.getAttribute('aria-pressed') === 'true');
    return selected?.getAttribute('data-swatch-value') || null;
  }

  /** Select a swatch by value string. */
  setValue(val) {
    const match = this.swatches.find((s) => s.getAttribute('data-swatch-value') === val);
    if (match) this.select(match);
  }

  /** Replace all swatch options. Each option: { value, label, color, image? }. */
  setOptions(options) {
    this.swatches.forEach((s) => s.remove());
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'so-swatches__swatch';
      btn.dataset.swatchValue = opt.value;
      btn.setAttribute('aria-pressed', String(opt.selected || false));
      if (opt.color) {
        btn.style.setProperty('--so-swatch', opt.color);
      }
      btn.textContent = opt.label || opt.value;
      this.appendChild(btn);
    });
    this.swatches = Array.from(this.querySelectorAll('[data-swatch-value]'));
    this.swatches.forEach((swatch) => swatch.addEventListener('click', this._onClick.bind(this)));
  }

  /** Index of the currently selected swatch. */
  get selectedIndex() {
    return this.swatches.findIndex((s) => s.getAttribute('aria-pressed') === 'true');
  }

  /** Estimate items per row (for keyboard nav). */
  _getPerRow() {
    if (this.swatches.length <= 1) return 1;
    const first = this.swatches[0];
    if (!first) return 1;
    const containerWidth = this.clientWidth;
    const itemWidth = first.offsetWidth || containerWidth / this.swatches.length;
    return Math.max(1, Math.round(containerWidth / itemWidth));
  }
}
