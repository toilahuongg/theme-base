import { emit } from '../helpers.js';

/**
 * so-price — Price display with compare-at, sale badge, and per-unit.
 *
 * Attributes:
 *   price          — Price in cents (required).
 *   compare-at     — Original price in cents (shows as crossed-out).
 *   currency       — ISO currency code (default: USD).
 *   per-unit       — Per-unit text (e.g., "/oz", "/ea").
 *   show-badge     — Show "Sale" badge when compare-at > price.
 *
 * Events:
 *   so:price:render  — { price, compareAt, currency, onSale }
 *
 * Public API:
 *   setPrice(cents, compareAt?)  — Update price display.
 *   isOnSale                     — Whether compare-at > price.
 */
export class SoPrice extends HTMLElement {
  static observedAttributes = ['price', 'compare-at', 'currency', 'per-unit', 'show-badge'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Set price in cents with optional compare-at. */
  setPrice(cents, compareAt) {
    this.setAttribute('price', String(cents));
    if (compareAt !== undefined) {
      this.setAttribute('compare-at', String(compareAt));
    }
    this.render();
  }

  /** Whether this price is on sale. */
  get isOnSale() {
    const price = Number(this.getAttribute('price')) || 0;
    const compareAt = Number(this.getAttribute('compare-at')) || 0;
    return compareAt > price && price > 0;
  }

  render() {
    const price = Number(this.getAttribute('price')) || 0;
    const compareAt = Number(this.getAttribute('compare-at')) || 0;
    const currency = this.getAttribute('currency') || 'USD';
    const perUnit = this.getAttribute('per-unit') || '';
    const showBadge = this.hasAttribute('show-badge');
    const onSale = compareAt > price && price > 0;

    const formatted = this.formatMoney(price, currency);
    const formattedCompare = compareAt > 0 ? this.formatMoney(compareAt, currency) : null;

    let html = `<span class="so-price">`;
    if (onSale) {
      if (showBadge) {
        const discount = Math.round(((compareAt - price) / compareAt) * 100);
        html += `<span class="so-price__sale-badge">-${discount}%</span> `;
      }
      html += `<span class="so-price__current">${formattedCompare}</span>`;
      html += ` <span class="so-price__current" style="color:var(--so-color-error)">${formatted}</span>`;
    } else {
      html += `<span class="so-price__current">${formatted}</span>`;
      if (formattedCompare) {
        html += ` <span class="so-price__compare">${formattedCompare}</span>`;
      }
    }
    if (perUnit) {
      html += ` <span class="so-price__unit">${this.escapeHtml(perUnit)}</span>`;
    }
    html += `</span>`;

    this.innerHTML = html;

    emit(this, 'so:price:render', {
      price,
      compareAt,
      currency,
      onSale
    });
  }

  formatMoney(cents, currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency
      }).format(cents / 100);
    } catch {
      return `${(cents / 100).toFixed(2)} ${currency}`;
    }
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }
}
