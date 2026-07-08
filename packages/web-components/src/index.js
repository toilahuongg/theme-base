(() => {
if (!customElements.get('so-disclosure')) {
  customElements.define('so-disclosure', class SoDisclosure extends HTMLElement {
    connectedCallback() {
      if (this._connected) return;

      this.toggleButton = this.querySelector('[data-disclosure-toggle]') || this.querySelector('button');
      this.panel = this.querySelector('[data-disclosure-panel]') || this.querySelector('[hidden]');

      if (!this.toggleButton || !this.panel) return;

      this.toggleButton.setAttribute('aria-expanded', this.open ? 'true' : 'false');
      this.panel.hidden = !this.open;
      this.toggleButton.addEventListener('click', this);
      this._connected = true;
    }

    disconnectedCallback() {
      if (!this._connected) return;
      this.toggleButton?.removeEventListener('click', this);
      this._connected = false;
    }

    get open() {
      return this.hasAttribute('open');
    }

    handleEvent(event) {
      if (event.type === 'click') {
        this.toggle();
      }
    }

    toggle() {
      const nextState = !this.open;

      if (nextState) {
        this.setAttribute('open', '');
      } else {
        this.removeAttribute('open');
      }

      this.panel.hidden = !nextState;
      this.toggleButton.setAttribute('aria-expanded', nextState ? 'true' : 'false');
    }
  });
}

if (!customElements.get('so-quantity')) {
  customElements.define('so-quantity', class SoQuantity extends HTMLElement {
    constructor() {
      super();
      this.decrease = () => this.step(-1);
      this.increase = () => this.step(1);
    }

    connectedCallback() {
      if (this._connected) return;

      this.input = this.querySelector('input[type="number"]');
      this.decreaseButton = this.querySelector('[data-quantity-decrease]');
      this.increaseButton = this.querySelector('[data-quantity-increase]');

      if (!this.input) return;

      this.decreaseButton?.addEventListener('click', this.decrease);
      this.increaseButton?.addEventListener('click', this.increase);
      this._connected = true;
    }

    disconnectedCallback() {
      if (!this._connected) return;
      this.decreaseButton?.removeEventListener('click', this.decrease);
      this.increaseButton?.removeEventListener('click', this.increase);
      this._connected = false;
    }

    step(direction) {
      const step = Number(this.input.step) || 1;
      const min = this.input.min === '' ? -Infinity : Number(this.input.min);
      const max = this.input.max === '' ? Infinity : Number(this.input.max);
      const current = Number(this.input.value) || 0;
      const nextValue = Math.min(max, Math.max(min, current + direction * step));

      this.input.value = String(nextValue);
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}
})();
