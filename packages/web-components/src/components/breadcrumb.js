/**
 * so-breadcrumb — Breadcrumb navigation with ARIA support.
 *
 * Public API:
 *   setItems([{ label, url, current? }])  — Set breadcrumb items.
 *   items                                  — Current items array.
 */
export class SoBreadcrumb extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  /** Set items and re-render. Each item: { label, url?, current? }. */
  setItems(items) {
    this._items = items;
    this.render();
  }

  get items() {
    return this._items || [];
  }

  render() {
    const items = this._items || this._parseChildren();
    if (items.length === 0) {
      this.innerHTML = '';
      return;
    }

    let html = `<ol class="so-breadcrumb" aria-label="Breadcrumb">`;
    items.forEach((item, i) => {
      const isLast = i === items.length - 1;
      html += `<li class="so-breadcrumb__item" ${isLast ? 'aria-current="page"' : ''}>`;
      if (item.url && !isLast) {
        html += `<a class="so-breadcrumb__link" href="${this.escapeHtml(item.url)}">${this.escapeHtml(item.label)}</a>`;
      } else {
        html += `<span class="so-breadcrumb__current">${this.escapeHtml(item.label)}</span>`;
      }
      html += `</li>`;
    });
    html += `</ol>`;

    this.innerHTML = html;
  }

  /** Parse children into items if setItems wasn't called. */
  _parseChildren() {
    const items = [];
    this.querySelectorAll('[data-breadcrumb-item]').forEach((el) => {
      items.push({
        label: el.dataset.breadcrumbLabel || el.textContent?.trim() || '',
        url: el.dataset.breadcrumbUrl || null,
        current: el.hasAttribute('data-breadcrumb-current')
      });
    });
    return items;
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }
}
