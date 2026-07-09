import { emit, debounce } from '../helpers.js';

/**
 * so-predictive-search — Debounces input, fetches Shopify predictive search, renders results.
 *
 * Attributes:
 *   data-loading-text  — Status text during fetch.
 *   data-ready-text    — Status text after results render.
 *   data-empty-text    — Status text when no results.
 *   data-error-text    — Status text on failure.
 *
 * Events:
 *   so:predictive-search:results  — { query, results }
 *   so:predictive-search:error    — { query, error }
 *
 * Public API:
 *   setQuery(query)  — Set the search input value and trigger search.
 *   clear()          — Clear input and hide results.
 *   showRecent()     — Show recent searches (if configured).
 *   hideResults()    — Hide the results dropdown.
 *   query            — Current input value.
 */
export class SoPredictiveSearch extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.input = this.querySelector('[data-predictive-search-input]');
    this.results = this.querySelector('[data-predictive-search-results]');
    this.status = this.querySelector('[data-predictive-search-status]');
    this.scheduledSearch = debounce(() => this.search(), 200);

    this.onInput = () => this.scheduleSearch();
    this.onKeydown = (e) => this.handleKeydown(e);
    this.onFocus = () => {
      if (this.input?.value?.trim()) this.search();
    };

    this.input?.addEventListener('input', this.onInput);
    this.input?.addEventListener('keydown', this.onKeydown);
    this.input?.addEventListener('focus', this.onFocus);

    // Click outside closes results
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this._onDocClick.bind(this));
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.input?.removeEventListener('input', this.onInput);
    this.input?.removeEventListener('keydown', this.onKeydown);
    this.input?.removeEventListener('focus', this.onFocus);
    clearTimeout(this.searchTimer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this._onDocClick);
    }
    this._connected = false;
  }

  /** Current query value. */
  get query() {
    return this.input?.value?.trim() || '';
  }

  /** Set the search input value and trigger search. */
  setQuery(query) {
    if (this.input) {
      this.input.value = query;
      this.search();
    }
  }

  /** Clear input and hide results. */
  clear() {
    if (this.input) this.input.value = '';
    this.renderResults([]);
    this.hideResults();
  }

  /** Show recent searches (if available via data-recent attribute or localStorage). */
  showRecent() {
    let recent;
    try {
      recent = JSON.parse(localStorage.getItem('so:recent-searches') || '[]');
    } catch {
      recent = [];
    }
    if (recent.length > 0) {
      this.renderResults(recent.map((q) => ({ title: q, url: `/search?q=${encodeURIComponent(q)}`, type: 'recent' })));
      this.setStatus('ready');
    }
  }

  /** Hide the results dropdown. */
  hideResults() {
    if (this.results) {
      this.results.hidden = true;
    }
  }

  scheduleSearch() {
    clearTimeout(this.searchTimer);
    this.scheduledSearch();
  }

  async search() {
    const query = this.input?.value?.trim() || '';
    if (!query) {
      this.renderResults([]);
      this.hideResults();
      return;
    }

    this.setStatus('loading');

    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page,article`,
        { headers: { Accept: 'application/json' } }
      );

      if (!response.ok) {
        throw new Error('Predictive search failed');
      }

      const data = await response.json();
      const resources = data.resources?.results || {};
      const results = ['products', 'collections', 'pages', 'articles'].flatMap((key) => {
        const items = resources[key] || [];
        return items.map((item) => ({ ...item, type: key.slice(0, -1) }));
      });

      this.renderResults(results, query);
      this.setStatus(results.length > 0 ? 'ready' : 'empty');
      emit(this, 'so:predictive-search:results', { query, results });

      // Save to recent searches
      this._saveRecent(query);
    } catch (error) {
      this.setStatus('error');
      emit(this, 'so:predictive-search:error', { query, error });
    }
  }

  renderResults(results, query = '') {
    if (!this.results) return;

    this.results.innerHTML = results.map((result) => {
      const title = this.escapeHtml(result.title || result.handle || '');
      const url = this.escapeHtml(result.url || result.online_store_url || '#');
      const highlighted = query ? this.highlightMatch(title, query) : title;
      const typeLabel = result.type ? `<span class="so-predictive-search__type">${this.escapeHtml(result.type)}</span>` : '';
      return `<li class="so-predictive-search__item" data-type="${result.type || ''}"><a href="${url}">${highlighted}</a>${typeLabel}</li>`;
    }).join('');

    this.results.hidden = results.length === 0;

    // Set aria-activedescendant for keyboard nav
    if (results.length > 0 && this.input) {
      const firstItem = this.results.querySelector('.so-predictive-search__item');
      if (firstItem) {
        firstItem.dataset.highlighted = 'true';
        this.input.setAttribute('aria-activedescendant', firstItem.id || '');
      }
    }
  }

  /** Handle keyboard navigation within results. */
  handleKeydown(event) {
    if (!this.results || this.results.hidden) return;

    const items = Array.from(this.results.querySelectorAll('.so-predictive-search__item'));
    const activeIndex = items.findIndex((item) => item.dataset.highlighted === 'true');

    let nextIndex = activeIndex;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        break;
      case 'Enter':
        if (activeIndex >= 0) {
          event.preventDefault();
          const link = items[activeIndex].querySelector('a');
          if (link) window.location.href = link.href;
        }
        return;
      case 'Escape':
        this.hideResults();
        return;
      default:
        return;
    }

    // Update highlighted state
    items.forEach((item, i) => {
      item.dataset.highlighted = i === nextIndex ? 'true' : 'false';
    });
    if (this.input) {
      this.input.setAttribute('aria-activedescendant', items[nextIndex]?.id || '');
    }
  }

  setStatus(status) {
    this.setAttribute('data-status', status);
    if (this.status) {
      this.status.textContent = this.getAttribute(`data-${status}-text`) || '';
    }
  }

  /** Highlight matching text in the result title. */
  highlightMatch(title, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return title.replace(regex, '<mark>$1</mark>');
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

  _saveRecent(query) {
    try {
      let recent = JSON.parse(localStorage.getItem('so:recent-searches') || '[]');
      recent = [query, ...recent.filter((q) => q !== query)].slice(0, 5);
      localStorage.setItem('so:recent-searches', JSON.stringify(recent));
    } catch {
      // Storage unavailable — silently skip
    }
  }

  _onDocClick(event) {
    if (!this.contains(event.target) && this.results) {
      this.hideResults();
    }
  }
}
