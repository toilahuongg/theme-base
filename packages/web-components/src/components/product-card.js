export class SoProductCard extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.link = this.querySelector('a[href]');
    this.mediaLink = this.querySelector('[data-product-card-media]');
    this.titleLink = this.querySelector('[data-product-card-title] a, .so-card__title a');

    if (this.mediaLink) {
      this.mediaLink.addEventListener('click', this.onMediaClick.bind(this));
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    if (this.mediaLink) {
      this.mediaLink.removeEventListener('click', this.onMediaClick);
    }
    this._connected = false;
  }

  onMediaClick(event) {
    event.preventDefault();
    this.navigateToProduct();
  }

  navigateToProduct() {
    const url = this.getProductUrl();
    if (url && typeof window !== 'undefined') {
      window.location.href = url;
    }
  }

  getProductUrl() {
    if (this.titleLink?.href) return this.titleLink.href;
    if (this.mediaLink?.href) return this.mediaLink.href;
    if (this.link?.href) return this.link.href;
    return null;
  }
}
