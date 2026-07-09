import { emit } from '../helpers.js';

/**
 * so-stock-indicator — Stock level display with color coding.
 *
 * Attributes:
 *   level       — Stock quantity (0 = out, 1-10 = low, 11+ = in).
 *   low-threshold — Threshold for "low stock" (default 10).
 *
 * Events:
 *   so:stock:check  — { level, state }
 *
 * Public API:
 *   level      — Stock quantity.
 *   state      — "in-stock", "low-stock", or "out-of-stock".
 *   setLevel(n) — Update stock level.
 */
export class SoStockIndicator extends HTMLElement {
  static observedAttributes = ['level'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Get/set stock level. */
  get level() {
    return Number(this.getAttribute('level')) || 0;
  }

  set level(n) {
    this.setAttribute('level', String(n));
  }

  setLevel(n) {
    this.setAttribute('level', String(n));
  }

  /** Current state: "in-stock", "low-stock", or "out-of-stock". */
  get state() {
    const level = this.level;
    const threshold = Number(this.getAttribute('low-threshold')) || 10;
    if (level <= 0) return 'out-of-stock';
    if (level <= threshold) return 'low-stock';
    return 'in-stock';
  }

  render() {
    const level = this.level;
    const state = this.state;
    const threshold = Number(this.getAttribute('low-threshold')) || 10;

    const messages = {
      'in-stock': this.getAttribute('in-stock-text') || 'In stock',
      'low-stock': this.getAttribute('low-stock-text') || `Only ${level} left`,
      'out-of-stock': this.getAttribute('out-of-stock-text') || 'Out of stock'
    };

    this.setAttribute('class', `so-stock-indicator so-stock-indicator--${state}`);

    this.innerHTML = `
      <span class="so-stock-indicator__dot" aria-hidden="true"></span>
      <span class="so-stock-indicator__text">${messages[state]}</span>
    `;

    emit(this, 'so:stock:check', { level, state });
  }
}
