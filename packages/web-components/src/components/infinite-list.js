export class SoInfiniteList extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.nextLink = this.querySelector('[data-infinite-next]');
    this.itemsContainer = this.querySelector('[data-infinite-items]');
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

      const html = await response.text();
      this.appendContent(html);
      this.dispatchEvent(new CustomEvent('so:infinite-list:load', { bubbles: true }));
    } finally {
      this.toggleAttribute('aria-busy', false);
    }
  }

  appendContent(html) {
    if (!this.itemsContainer) {
      this.insertAdjacentHTML('beforeend', html);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const productItems = doc.querySelectorAll('[data-infinite-item]');
    if (productItems.length > 0) {
      productItems.forEach((item) => {
        this.itemsContainer.appendChild(item);
      });
    } else {
      const fragment = doc.createDocumentFragment();
      while (doc.body.firstChild) {
        fragment.appendChild(doc.body.firstChild);
      }
      this.itemsContainer.appendChild(fragment);
    }

    this.updateNextLink(doc);
  }

  updateNextLink(doc) {
    const nextLink = doc.querySelector('[data-infinite-next]');
    if (this.nextLink) {
      if (nextLink && nextLink.href) {
        this.nextLink.href = nextLink.href;
        this.nextLink.hidden = false;
      } else {
        this.nextLink.remove();
        this.nextLink = null;
      }
    }
  }
}
