export class SoLiveRegion extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'status');
    }
    if (!this.hasAttribute('aria-live')) {
      this.setAttribute('aria-live', 'polite');
    }
    if (!this.hasAttribute('aria-atomic')) {
      this.setAttribute('aria-atomic', 'true');
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.clearTimer();
    this._connected = false;
  }

  announce(message) {
    this.clearTimer();
    this.textContent = '';
    this._timer = setTimeout(() => {
      this.textContent = String(message ?? '');
    }, 25);
  }

  clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}
