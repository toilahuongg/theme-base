import { emit } from '../helpers.js';

export class SoCartItems extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.quantityControls = Array.from(this.querySelectorAll('[data-cart-line][data-cart-quantity]'));
    this.onClick = this.onClick.bind(this);
    this.quantityControls.forEach((control) => control.addEventListener('click', this.onClick));
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.quantityControls.forEach((control) => control.removeEventListener('click', this.onClick));
    this._connected = false;
  }

  async onClick(event) {
    event.preventDefault();

    const control = event.currentTarget;
    const line = Number(control.getAttribute('data-cart-line'));
    const quantity = Math.max(0, Number(control.getAttribute('data-cart-quantity')));

    if (!line || Number.isNaN(quantity)) return;

    await this.changeLine(line, quantity);
  }

  async changeLine(line, quantity) {
    this.setBusy(true);

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity })
      });

      if (!response.ok) {
        throw new Error('Cart update failed');
      }

      const cart = await response.json();
      this.reconcileCart(cart, line, quantity);
      emit(this, 'so:cart:update', { cart, line, quantity });
    } catch (error) {
      emit(this, 'so:cart:error', { error, line, quantity });
    } finally {
      this.setBusy(false);
    }
  }

  setBusy(busy) {
    this.toggleAttribute('aria-busy', busy);
    this.quantityControls.forEach((control) => {
      control.disabled = busy;
      control.toggleAttribute('aria-busy', busy);
    });
  }

  reconcileCart(cart, line, quantity) {
    this.getCartItemRoots().forEach((root) => this.updateLineInRoot(root, cart, line, quantity));
    this.updateCartChrome(cart);
  }

  getCartItemRoots() {
    if (typeof document === 'undefined') {
      return [this];
    }

    const roots = Array.from(document.querySelectorAll('so-cart-items'));
    return roots.includes(this) ? roots : [this, ...roots];
  }

  updateLineInRoot(root, cart, line, quantity) {
    const lineItem = root.querySelector(`[data-cart-line-item][data-cart-line="${line}"]`);

    if (lineItem && quantity === 0) {
      lineItem.remove();
    } else if (lineItem) {
      const nextItem = cart.items?.[line - 1];
      const nextQuantity = nextItem?.quantity ?? quantity;
      const quantityTarget = lineItem.querySelector('[data-cart-line-quantity-value]');
      const priceTarget = lineItem.querySelector('[data-cart-line-price]');

      if (quantityTarget) {
        quantityTarget.textContent = String(nextQuantity);
      }
      if (priceTarget && nextItem) {
        this.updateLinePrice(priceTarget, nextItem);
      }
    }

    this.reindexRoot(root);
  }

  updateLinePrice(priceTarget, item) {
    const currentPrice = priceTarget.querySelector('.so-price__current') || priceTarget.querySelector('.so-price');
    const comparePrice = priceTarget.querySelector('.so-price__compare');

    if (currentPrice) {
      currentPrice.textContent = this.formatMoney(item.final_line_price);
    }

    if (comparePrice && item.original_line_price > item.final_line_price) {
      comparePrice.textContent = this.formatMoney(item.original_line_price);
    }
  }

  reindexRoot(root) {
    const lineItems = Array.from(root.querySelectorAll('[data-cart-line-item]'));

    lineItems.forEach((lineItem, index) => {
      const line = index + 1;
      const quantity = Number(lineItem.querySelector('[data-cart-line-quantity-value]')?.textContent) || 0;

      lineItem.setAttribute('data-cart-line', String(line));
      lineItem.querySelectorAll('[data-cart-line]').forEach((control) => {
        control.setAttribute('data-cart-line', String(line));

        if (control.hasAttribute('data-cart-quantity-decrease')) {
          const nextQuantity = Math.max(0, quantity - 1);
          control.setAttribute('data-cart-quantity', String(nextQuantity));
          control.setAttribute('value', String(nextQuantity));
        }

        if (control.hasAttribute('data-cart-quantity-increase')) {
          const nextQuantity = quantity + 1;
          control.setAttribute('data-cart-quantity', String(nextQuantity));
          control.setAttribute('value', String(nextQuantity));
        }
      });
    });
  }

  updateCartChrome(cart) {
    if (typeof document === 'undefined') return;

    const hasItems = Number(cart.item_count) > 0;
    const subtotal = this.formatMoney(cart.total_price ?? 0);

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
    document.querySelectorAll('[data-cart-summary]').forEach((target) => {
      target.hidden = !hasItems;
    });
  }

  formatMoney(cents) {
    const currency = this.getAttribute('currency') || 'USD';

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency
      }).format(Number(cents) / 100);
    } catch {
      return `${(Number(cents) / 100).toFixed(2)} ${currency}`;
    }
  }
}
