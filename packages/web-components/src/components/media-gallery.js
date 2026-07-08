export class SoMediaGallery extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.thumbnails = Array.from(this.querySelectorAll('[data-media-thumbnail]'));
    this.mediaItems = Array.from(this.querySelectorAll('[data-media-item]'));
    this.onClick = (event) => this.select(event.currentTarget.getAttribute('data-media-thumbnail'));
    this.onVariantChange = (event) => {
      const mediaId = event.detail?.variant?.featured_media?.id;
      if (mediaId) {
        this.select(String(mediaId));
      }
    };

    this.thumbnails.forEach((thumbnail) => thumbnail.addEventListener('click', this.onClick));
    if (typeof document !== 'undefined') {
      document.addEventListener('so:variant:change', this.onVariantChange);
    }

    const selectedId = this.thumbnails.find((thumbnail) => thumbnail.getAttribute('aria-current') === 'true')?.getAttribute('data-media-thumbnail');
    this.select(selectedId || this.mediaItems[0]?.getAttribute('data-media-item'));
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.thumbnails.forEach((thumbnail) => thumbnail.removeEventListener('click', this.onClick));
    if (typeof document !== 'undefined') {
      document.removeEventListener('so:variant:change', this.onVariantChange);
    }
    this._connected = false;
  }

  select(id) {
    if (!id) return;

    this.mediaItems.forEach((item) => {
      item.hidden = item.getAttribute('data-media-item') !== id;
    });

    this.thumbnails.forEach((thumbnail) => {
      thumbnail.setAttribute('aria-current', thumbnail.getAttribute('data-media-thumbnail') === id ? 'true' : 'false');
    });
  }
}
