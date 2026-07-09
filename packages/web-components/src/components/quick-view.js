import { emit, rememberFocus, FOCUSABLE_SELECTOR } from '../helpers.js';

/**
 * so-quick-view — Opens from so:quick-view:open, manages open/close state with ESC.
 *
 * Attributes:
 *   open        — Reflects visible quick view state.
 *   product-url — Set when opened with a product URL.
 *
 * Events:
 *   so:quick-view:open   — Internal (consumed by this element).
 *   so:quick-view:opened — When quick view opens (bubbles to document).
 *   so:quick-view:closed — When quick view closes.
 *
 * Public API:
 *   open(url?)       — Open with optional product URL.
 *   close()          — Close the quick view.
 *   toggle(url?)     — Toggle open state.
 *   setContent(html) — Replace content inside data-quick-view-content.
 */
export class SoQuickView extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.closeButtons = Array.from(this.querySelectorAll('[data-quick-view-close]'));
    this.content = this.querySelector('[data-quick-view-content]');
    this.panel = this.querySelector('[data-quick-view-panel]') || this;
    this.onOpen = (event) => this.open(event.detail?.productUrl);
    this.onClose = this.close.bind(this);

    this.closeButtons.forEach((button) => button.addEventListener('click', this.onClose));

    // Click on backdrop closes
    if (typeof this.addEventListener === 'function') {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.close();
      });
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('so:quick-view:open', this.onOpen);
      document.addEventListener('keydown', this);
    }

    if (this.hasAttribute('open')) {
      this._lockBody();
      this._trapFocus();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.closeButtons.forEach((button) => button.removeEventListener('click', this.onClose));
    if (typeof document !== 'undefined') {
      document.removeEventListener('so:quick-view:open', this.onOpen);
      document.removeEventListener('keydown', this);
    }

    this._cleanupFocus?.();
    this._unlockBody();
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  /** Open the quick view with optional product URL. */
  open(productUrl) {
    if (this.isOpen()) return;
    this.setAttribute('open', '');
    if (productUrl) {
      this.setAttribute('product-url', productUrl);
    }
    this._lockBody();
    this._trapFocus();
    emit(this, 'so:quick-view:opened', { productUrl });
  }

  /** Close the quick view. */
  close() {
    if (!this.isOpen()) return;
    this.removeAttribute('open');
    this._unlockBody();
    this._cleanupFocus?.();
    this.dispatchEvent(new CustomEvent('so:quick-view:closed', { bubbles: true }));
  }

  /** Toggle open state. */
  toggle(productUrl) {
    this.isOpen() ? this.close() : this.open(productUrl);
  }

  /** Replace inner content of the data-quick-view-content region. */
  setContent(html) {
    if (this.content) {
      this.content.innerHTML = html;
    }
  }

  _lockBody() {
    document.body?.classList?.add('so-body-locked');
  }

  _unlockBody() {
    document.body?.classList?.remove('so-body-locked');
  }

  _trapFocus() {
    const root = this.panel || this;
    if (typeof root?.querySelectorAll !== 'function') return;
    const focusable = Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((el) => !el.closest('[hidden]'));
    if (focusable.length === 0) return;

    const restoreFocus = rememberFocus();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onKeydown = (event) => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    root.addEventListener('keydown', onKeydown);
    first.focus();

    this._cleanupFocus = () => {
      root.removeEventListener('keydown', onKeydown);
      restoreFocus();
      this._cleanupFocus = null;
    };
  }
}
