/**
 * so-pagination — Page navigation with ellipsis support.
 *
 * Attributes:
 *   current   — Current page number (required).
 *   total     — Total pages.
 *   href      — URL template with {page} placeholder (e.g., "/collections/all?page={page}").
 *   show-edges — Number of edge pages to show (default 2).
 *
 * Events:
 *   so:pagination:change  — { page }
 *
 * Public API:
 *   currentPage  — Current page.
 *   totalPages   — Total pages.
 *   goTo(page)   — Navigate to page.
 */
export class SoPagination extends HTMLElement {
  static observedAttributes = ['current', 'total', 'href'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  get currentPage() {
    return Number(this.getAttribute('current')) || 1;
  }

  get totalPages() {
    return Number(this.getAttribute('total')) || 1;
  }

  /** Navigate to a page. */
  goTo(page) {
    const clamped = Math.max(1, Math.min(page, this.totalPages));
    this.setAttribute('current', String(clamped));
    this.dispatchEvent(new CustomEvent('so:pagination:change', {
      bubbles: true,
      detail: { page: clamped }
    }));

    // Navigate if href template provided
    const href = this.getAttribute('href');
    if (href && typeof window !== 'undefined') {
      window.location.href = href.replace('{page}', String(clamped));
    }
  }

  render() {
    const current = this.currentPage;
    const total = this.totalPages;
    const showEdges = Number(this.getAttribute('show-edges')) || 2;
    const href = this.getAttribute('href') || '?page={page}';

    if (total <= 1) {
      this.innerHTML = '';
      return;
    }

    const pages = this._generatePages(current, total, showEdges);
    const hrefTpl = (p) => href.replace('{page}', String(p));

    let html = `<ul class="so-pagination" role="navigation" aria-label="Pagination">`;

    // Previous button
    html += `<li><a class="so-pagination__link" href="${current > 1 ? hrefTpl(current - 1) : '#'}" ${current <= 1 ? 'disabled aria-disabled="true"' : ''} aria-label="Previous page">&laquo;</a></li>`;

    for (const page of pages) {
      if (page === '...') {
        html += `<li><span class="so-pagination__ellipsis" aria-hidden="true">…</span></li>`;
      } else {
        const isCurrent = page === current;
        html += `<li><a class="so-pagination__link" href="${hrefTpl(page)}" ${isCurrent ? `aria-current="page"` : ''} data-page="${page}">${page}</a></li>`;
      }
    }

    // Next button
    html += `<li><a class="so-pagination__link" href="${current < total ? hrefTpl(current + 1) : '#'}" ${current >= total ? 'disabled aria-disabled="true"' : ''} aria-label="Next page">&raquo;</a></li>`;

    html += `</ul>`;
    this.innerHTML = html;

    // Wire up clicks
    this.querySelectorAll('[data-page]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.goTo(Number(link.dataset.page));
      });
    });
  }

  _generatePages(current, total, edges) {
    const pages = [];
    const showLeft = Math.max(1, current - edges);
    const showRight = Math.min(total, current + edges);
    const showMiddle = [];

    for (let i = showLeft; i <= showRight; i++) {
      showMiddle.push(i);
    }

    // Add left edge + ellipsis
    for (let i = 1; i < showLeft; i++) {
      pages.push(i);
    }
    if (showLeft > 1) pages.push('...');

    // Middle
    pages.push(...showMiddle);

    // Ellipsis + right edge
    if (showRight < total) pages.push('...');
    for (let i = showRight + 1; i <= total; i++) {
      pages.push(i);
    }

    return pages;
  }
}
