import { setExpanded, rememberFocus, FOCUSABLE_SELECTOR } from '../helpers.js';

/**
 * so-cart-drawer — Cart-specific drawer that auto-opens on so:cart:add.
 *
 * Attributes:
 *   trigger-selector  — Document selector for open triggers.
 *   open              — Reflects the current open state.
 *
 * Events:
 *   so:cart-drawer:open   — When drawer opens.
 *   so:cart-drawer:close  — When drawer closes.
 *
 * Public API:
 *   open()    — Open the cart drawer.
 *   close()   — Close the cart drawer.
 *   toggle()  — Toggle open state.
 *   refresh() — Fetch cart state from /cart.js and update chrome.
 */
export class SoCartDrawer extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.panel = this.querySelector('[data-cart-drawer-panel]') || this;
    this.closeButtons = Array.from(this.querySelectorAll('[data-cart-drawer-close]'));
    this.triggerSelector = this.getAttribute('trigger-selector');
    this.triggers = this.getTriggers();
    this.onCartAdd = () => this.open();

    this.closeButtons.forEach((button) => button.addEventListener('click', this));
    this.triggers.forEach((trigger) => trigger.addEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this);
      document.addEventListener('so:cart:add', this.onCartAdd);
    }

    this.syncExpanded();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.closeButtons.forEach((button) => button.removeEventListener('click', this));
    this.triggers.forEach((trigger) => trigger.removeEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this);
      document.removeEventListener('so:cart:add', this.onCartAdd);
    }

    this._cleanupFocus?.();
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape' && this.isOpen()) {
      this.close();
      return;
    }

    if (event.type !== 'click') return;

    if (this.closeButtons.includes(event.currentTarget)) {
      this.close();
      return;
    }

    if (this.triggers.includes(event.currentTarget)) {
      event.preventDefault();
      this.open();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  /** Open the cart drawer. */
  open() {
    if (this.isOpen()) return;
    this.setAttribute('open', '');
    this.syncExpanded();
    this._lockBody();
    this._trapFocus();
    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:cart-drawer:open', { bubbles: true }));
    }
  }

  /** Close the cart drawer. */
  close() {
    if (!this.isOpen()) return;
    this.removeAttribute('open');
    this.syncExpanded();
    this._unlockBody();
    this._cleanupFocus?.();
    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:cart-drawer:close', { bubbles: true }));
    }
  }

  /** Toggle open state. */
  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  /** Fetch cart state and update DOM chrome. */
  async refresh() {
    try {
      const response = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const cart = await response.json();
      this._updateCartChrome(cart);
    } catch {
      // Silently fail — cart chrome is best-effort
    }
  }

  syncExpanded() {
    const expanded = this.isOpen();
    this.triggers.forEach((trigger) => setExpanded(trigger, expanded));
    if (this.panel) {
      this.panel.hidden = !expanded;
    }
  }

  getTriggers() {
    if (!this.triggerSelector || typeof document === 'undefined') {
      return [];
    }
    return Array.from(document.querySelectorAll(this.triggerSelector));
  }

  _lockBody() {
    document.body?.classList?.add('so-body-locked');
  }

  _unlockBody() {
    document.body?.classList?.remove('so-body-locked');
  }

  _trapFocus() {
    const panel = this.panel || this;
    if (typeof panel?.querySelectorAll !== 'function') return;
    const focusable = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))
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

    panel.addEventListener('keydown', onKeydown);
    first.focus();

    this._cleanupFocus = () => {
      panel.removeEventListener('keydown', onKeydown);
      restoreFocus();
      this._cleanupFocus = null;
    };
  }

  _updateCartChrome(cart) {
    if (typeof document === 'undefined') return;

    const hasItems = Number(cart.item_count) > 0;
    const subtotal = this._formatMoney(cart.total_price ?? 0);

    document.querySelectorAll('[data-cart-count]').forEach((target) => {
      target.textContent = String(cart.item_count ?? 0);
    });
    document.querySelectorAll('[data-cart-subtotal]').forEach((target) => {
      target.textContent = subtotal;
    });
    document.querySelectorAll('[data-cart-lines]').forEach((target) => {
      target.hidden = !hasItems;
    });
    document.querySelectorAll('[data-cart-empty]').forEach((target) => {
      target.hidden = hasItems;
    });
  }

  _formatMoney(cents) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: this.getAttribute('currency') || 'USD'
      }).format(Number(cents) / 100);
    } catch {
      return `${(Number(cents) / 100).toFixed(2)} USD`;
    }
  }
}
