/**
 * so-back-to-top — Scroll-to-top button that appears after scrolling down.
 *
 * Attributes:
 *   threshold   — Scroll Y offset before button appears (default 300).
 *
 * Public API:
 *   scrollToTop()  — Scroll to top with smooth behavior.
 *   isVisible      — Whether the button is currently visible.
 */
export class SoBackToTop extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.threshold = Number(this.getAttribute('threshold')) || 300;

    this._onScroll = () => this._updateVisibility();
    this._onClick = () => this.scrollToTop();

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this._onScroll, { passive: true });
    }

    this.addEventListener('click', this._onClick);
    this._updateVisibility();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._onScroll);
    }
    this.removeEventListener('click', this._onClick);
    this._connected = false;
  }

  get isVisible() {
    return this.hasAttribute('visible');
  }

  scrollToTop() {
    window?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _updateVisibility() {
    const scrolled = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset : 0;
    if (scrolled >= this.threshold) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }
}
