/**
 * so-product-card — Semantic product card with media click and product URL helpers.
 *
 * Attributes:
 *   product-id   — Optional product identifier.
 *
 * Events:
 *   so:card:media-click  — When the media area is clicked (bubbles).
 *   so:card:wishlist     — When the wishlist toggle is clicked (bubbles).
 *
 * Public API:
 *   getProductUrl()   — Returns the product URL from title/media/link.
 *   getProductId()    — Returns the product-id attribute or data-product-id.
 *   showBadge(type)   — Show a badge (sale, new, sold-out).
 *   hideBadge()       — Hide the badge.
 *   toggleWishlist()  — Toggle wishlist state.
 */
export class SoProductCard extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.link = this.querySelector('a[href]');
    this.mediaLink = this.querySelector('[data-product-card-media]');
    this.titleLink = this.querySelector('[data-product-card-title] a, .so-card__title a');

    // Fix: store bound handler for proper removal in disconnectedCallback
    this._onMediaClick = this._onMediaClick.bind(this);

    if (this.mediaLink) {
      this.mediaLink.addEventListener('click', this._onMediaClick);
    }

    // Wishlist button
    this.wishlistButton = this.querySelector('[data-wishlist-toggle]');
    if (this.wishlistButton) {
      this._onWishlistClick = this._onWishlistClick.bind(this);
      this.wishlistButton.addEventListener('click', this._onWishlistClick);
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    if (this.mediaLink) {
      this.mediaLink.removeEventListener('click', this._onMediaClick);
    }
    if (this.wishlistButton) {
      this.wishlistButton.removeEventListener('click', this._onWishlistClick);
    }
    this._connected = false;
  }

  _onMediaClick(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('so:card:media-click', {
      bubbles: true,
      detail: { url: this.getProductUrl() }
    }));
    this.navigateToProduct();
  }

  _onWishlistClick(event) {
    event.preventDefault();
    this.toggleWishlist();
    this.dispatchEvent(new CustomEvent('so:card:wishlist', {
      bubbles: true,
      detail: { productId: this.getProductId(), wished: this._isWished() }
    }));
  }

  navigateToProduct() {
    const url = this.getProductUrl();
    if (url && typeof window !== 'undefined') {
      window.location.href = url;
    }
  }

  /** Get the product URL from title link, media link, or first anchor. */
  getProductUrl() {
    if (this.titleLink?.href) return this.titleLink.href;
    if (this.mediaLink?.href) return this.mediaLink.href;
    if (this.link?.href) return this.link.href;
    return null;
  }

  /** Get the product ID from attribute or data-product-id. */
  getProductId() {
    return this.getAttribute('product-id') || this.dataset.productId || null;
  }

  /** Show a badge on the card media. Type: "sale", "new", "sold-out", or custom. */
  showBadge(type = 'sale', text) {
    let badge = this.querySelector('.so-card__badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'so-card__badge';
      const media = this.querySelector('.so-card__media');
      if (media) media.appendChild(badge);
    }
    badge.textContent = text || this._badgeText(type);
    badge.className = `so-card__badge so-badge so-badge--${type === 'sold-out' ? 'error' : type === 'new' ? 'success' : 'warning'}`;
  }

  /** Hide the badge. */
  hideBadge() {
    this.querySelector('.so-card__badge')?.remove();
  }

  /** Toggle wishlist state. */
  toggleWishlist() {
    if (!this.wishlistButton) return;
    const wished = this._isWished();
    this.wishlistButton.setAttribute('aria-pressed', String(!wished));
    this.wishlistButton.dataset.wished = String(!wished);
  }

  _isWished() {
    return this.wishlistButton?.getAttribute('aria-pressed') === 'true';
  }

  _badgeText(type) {
    const labels = { sale: 'Sale', new: 'New', 'sold-out': 'Sold Out' };
    return labels[type] || type;
  }
}
