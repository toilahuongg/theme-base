export class SoInfiniteList extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.nextLink = this.querySelector('[data-infinite-next]');
    this.onClick = (event) => this.loadMore(event);
    this.nextLink?.addEventListener('click', this.onClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.nextLink?.removeEventListener('click', this.onClick);
    this._connected = false;
  }

  async loadMore(event) {
    if (!this.hasAttribute('ajax')) return;

    event.preventDefault();
    this.toggleAttribute('aria-busy', true);

    try {
      const response = await fetch(this.nextLink.href, { headers: { Accept: 'text/html' } });
      if (!response.ok) throw new Error('Load more failed');
      this.dispatchEvent(new CustomEvent('so:infinite-list:load', { bubbles: true }));
    } finally {
      this.toggleAttribute('aria-busy', false);
    }
  }
}
