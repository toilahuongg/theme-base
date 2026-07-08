import { emit } from '../helpers.js';

export class SoPredictiveSearch extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.input = this.querySelector('[data-predictive-search-input]');
    this.results = this.querySelector('[data-predictive-search-results]');
    this.status = this.querySelector('[data-predictive-search-status]');
    this.onInput = () => this.scheduleSearch();
    this.input?.addEventListener('input', this.onInput);
    this._connected = true;
  }

  disconnectedCallback() {
    this.input?.removeEventListener('input', this.onInput);
    clearTimeout(this.searchTimer);
    this._connected = false;
  }

  scheduleSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.search(), 200);
  }

  async search() {
    const query = this.input?.value?.trim() || '';
    if (!query) {
      this.renderResults([]);
      return;
    }

    this.setStatus('loading');

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page,article`, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Predictive search failed');
      }

      const data = await response.json();
      const resources = data.resources?.results || {};
      const results = ['products', 'collections', 'pages', 'articles'].flatMap((key) => resources[key] || []);
      this.renderResults(results);
      this.setStatus(results.length > 0 ? 'ready' : 'empty');
      emit(this, 'so:predictive-search:results', { query, results });
    } catch (error) {
      this.setStatus('error');
      emit(this, 'so:predictive-search:error', { query, error });
    }
  }

  renderResults(results) {
    if (!this.results) return;

    this.results.innerHTML = results.map((result) => {
      const title = this.escapeHtml(result.title || result.handle || '');
      const url = this.escapeHtml(result.url || result.online_store_url || '#');
      return `<li class="so-predictive-search__item"><a href="${url}">${title}</a></li>`;
    }).join('');
    this.results.hidden = results.length === 0;
  }

  setStatus(status) {
    this.setAttribute('data-status', status);
    if (this.status) {
      this.status.textContent = this.getAttribute(`data-${status}-text`) || '';
    }
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }
}
