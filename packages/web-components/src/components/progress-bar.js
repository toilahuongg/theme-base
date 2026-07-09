/**
 * so-progress-bar — Progress bar for stock levels, free shipping threshold, etc.
 *
 * Attributes:
 *   value   — Current value (0-100 or absolute number).
 *   max     — Maximum value (default 100).
 *   label   — Accessible label.
 *   color   — "default", "success", "warning", "error".
 *
 * Events:
 *   so:progress:change  — { value, max, percent }
 *
 * Public API:
 *   percent    — Current percentage (0-100).
 *   setValue(n) — Update value.
 *   setMax(n)   — Update max.
 */
export class SoProgressBar extends HTMLElement {
  static observedAttributes = ['value', 'max'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Current value. */
  get value() {
    return Number(this.getAttribute('value')) || 0;
  }

  /** Current max. */
  get max() {
    return Number(this.getAttribute('max')) || 100;
  }

  /** Current percentage. */
  get percent() {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  setValue(n) {
    this.setAttribute('value', String(n));
  }

  setMax(n) {
    this.setAttribute('max', String(n));
  }

  render() {
    const percent = this.percent;
    const color = this.getAttribute('color') || 'default';
    const label = this.getAttribute('label') || 'Progress';
    const colorClass = color !== 'default' ? ` so-progress-bar__fill--${color}` : '';
    const showText = this.hasAttribute('show-text');

    this.innerHTML = `
      <div class="so-progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}">
        <div class="so-progress-bar__fill${colorClass}" style="width:${percent}%"></div>
      </div>
      ${showText ? `<span class="so-progress-bar__text">${Math.round(percent)}%</span>` : ''}
    `;

    this.dispatchEvent(new CustomEvent('so:progress:change', {
      bubbles: true,
      detail: { value: this.value, max: this.max, percent }
    }));
  }
}
