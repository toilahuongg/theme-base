import { emit } from '../helpers.js';

/**
 * so-rating — Star rating display and interactive input.
 *
 * Attributes:
 *   value          — Current rating (0-5, decimal allowed).
 *   max            — Max stars (default 5).
 *   interactive    — Allow clicking to set rating.
 *   show-count     — Show review count.
 *   count          — Review count.
 *
 * Events:
 *   so:rating:change  — { value, count }
 *
 * Public API:
 *   value       — Current rating value.
 *   setValue(n) — Set rating.
 */
export class SoRating extends HTMLElement {
  static observedAttributes = ['value', 'max', 'count'];

  connectedCallback() {
    if (this._connected) return;

    if (this.hasAttribute('interactive')) {
      this.addEventListener('click', this._onClick.bind(this));
      this.addEventListener('keydown', this._onKeydown.bind(this));
    }

    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Get/set current value. */
  get value() {
    return Number(this.getAttribute('value')) || 0;
  }

  set value(n) {
    this.setAttribute('value', String(n));
  }

  setValue(n) {
    this.setAttribute('value', String(n));
    this.render();
  }

  render() {
    const value = this.value;
    const max = Number(this.getAttribute('max')) || 5;
    const count = Number(this.getAttribute('count')) || 0;
    const interactive = this.hasAttribute('interactive');

    let html = `<span class="so-rating" role="${interactive ? 'radiogroup' : 'img'}" aria-label="Rating: ${value} out of ${max} stars">`;

    for (let i = 1; i <= max; i++) {
      const filled = value >= i;
      const half = !filled && value >= i - 0.5;
      const state = filled ? 'true' : 'false';

      if (interactive) {
        html += `<svg class="so-rating__star" data-rating-star="${i}" role="radio" aria-checked="${state}" tabindex="${i === Math.ceil(value) ? 0 : -1}" viewBox="0 0 24 24" fill="${filled || half ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
      } else {
        html += `<svg class="so-rating__star" aria-hidden="true" viewBox="0 0 24 24" fill="${filled || half ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
      }
    }

    if (count > 0 || this.hasAttribute('show-count')) {
      html += `<span class="so-rating__count">(${count})</span>`;
    }

    html += `</span>`;
    this.innerHTML = html;
  }

  _onClick(event) {
    const star = event.target.closest('[data-rating-star]');
    if (star) {
      const value = Number(star.dataset.ratingStar);
      this.setAttribute('value', String(value));
      this.render();
      emit(this, 'so:rating:change', { value, max: this.getAttribute('max') || 5 });
    }
  }

  _onKeydown(event) {
    const current = Math.ceil(this.value);
    const max = Number(this.getAttribute('max')) || 5;
    let next = current;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      next = Math.min(current + 1, max);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      next = Math.max(current - 1, 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      next = 1;
    } else if (event.key === 'End') {
      event.preventDefault();
      next = max;
    } else {
      return;
    }

    this.setAttribute('value', String(next));
    this.render();
    emit(this, 'so:rating:change', { value: next, max });
  }
}
