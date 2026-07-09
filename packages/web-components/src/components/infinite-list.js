import { debounce } from '../helpers.js';

/**
 * so-infinite-list — Fetches next page HTML, appends items, updates next link.
 *
 * Attributes:
 *   ajax          — Enables fetch instead of normal link navigation.
 *   aria-busy     — Set while fetch is pending.
 *   auto          — Enables IntersectionObserver scroll-triggered loading.
 *
 * Events:
 *   so:infinite-list:load  — After new items are appended.
 *   so:infinite-list:error — On fetch failure.
 *   so:infinite-list:end   — When no more pages exist.
 *
 * Public API:
 *   loadNext()    — Load the next page.
 *   reset()       — Clear loaded items and reset state.
 *   isLoading     — Read-only boolean.
 */
export class SoInfiniteList extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.nextLink = this.querySelector('[data-infinite-next]');
    this.itemsContainer = this.querySelector('[data-infinite-items]');
    this.skeletonTemplate = this.querySelector('[data-infinite-skeleton]');
    this.onClick = (event) => this.loadMore(event);

    this.nextLink?.addEventListener('click', this.onClick);

    // Auto-load via IntersectionObserver
    if (this.hasAttribute('auto')) {
      this._setupObserver();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.nextLink?.removeEventListener('click', this.onClick);
    this._observer?.disconnect();
    this._connected = false;
  }

  /** Whether a load is currently in progress. */
  get isLoading() {
    return this.hasAttribute('aria-busy');
  }

  /** Load the next page programmatically. */
  async loadNext() {
    if (!this.nextLink || this.isLoading) return;
    await this._fetchAndAppend(this.nextLink.href);
  }

  /** Reset to initial state (clears loaded items). */
  reset() {
    if (this.itemsContainer) {
      const initial = this.itemsContainer.querySelectorAll('[data-infinite-item]');
      initial.forEach((item) => item.remove());
    }
    this.removeAttribute('aria-busy');
  }

  async loadMore(event) {
    if (!this.hasAttribute('ajax') || !this.nextLink) return;

    event.preventDefault();
    await this._fetchAndAppend(this.nextLink.href);
  }

  async _fetchAndAppend(url) {
    this.toggleAttribute('aria-busy', true);

    try {
      const response = await fetch(url, { headers: { Accept: 'text/html' } });
      if (!response.ok) {
        throw new Error(`Load more failed (${response.status})`);
      }

      const html = await response.text();
      this.appendContent(html);
      this.dispatchEvent(new CustomEvent('so:infinite-list:load', { bubbles: true }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('so:infinite-list:error', {
        bubbles: true,
        detail: { error }
      }));
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
        this.dispatchEvent(new CustomEvent('so:infinite-list:end', { bubbles: true }));
      }
    }
  }

  _setupObserver() {
    const sentinel = this.querySelector('[data-infinite-sentinel]') || this.nextLink;
    if (!sentinel) return;

    this._observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading && this.nextLink) {
        this.loadNext();
      }
    }, { rootMargin: '200px' });

    this._observer.observe(sentinel);
  }
}
