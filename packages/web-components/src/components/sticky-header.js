export class SoStickyHeader extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.threshold = Number(this.getAttribute('threshold')) || 8;
    this.lastScrollY = typeof window === 'undefined' ? 0 : window.scrollY || 0;
    this.onScroll = () => this.update();

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.update();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
    this._connected = false;
  }

  update() {
    const currentScrollY = window.scrollY || 0;
    const scrolled = currentScrollY > this.threshold;
    const scrollingDown = currentScrollY > this.lastScrollY;

    this.toggleAttribute('scrolled', scrolled);
    this.toggleAttribute('scrolling-down', scrolled && scrollingDown);
    this.lastScrollY = currentScrollY;
  }
}
