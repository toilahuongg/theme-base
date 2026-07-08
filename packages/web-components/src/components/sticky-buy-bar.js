export class SoStickyBuyBar extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.targetSelector = this.getAttribute('target-selector');
    this.target = this.targetSelector && typeof document !== 'undefined' ? document.querySelector(this.targetSelector) : null;

    if ('IntersectionObserver' in globalThis && this.target) {
      this.observer = new IntersectionObserver(([entry]) => {
        this.hidden = entry.isIntersecting;
      });
      this.observer.observe(this.target);
    } else {
      this.hidden = false;
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this._connected = false;
  }
}
