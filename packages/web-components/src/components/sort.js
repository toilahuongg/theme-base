export class SoSort extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.select = this.querySelector('select[name="sort_by"]');
    this.onChange = () => this.apply();
    this.select?.addEventListener('change', this.onChange);
    this._connected = true;
  }

  disconnectedCallback() {
    this.select?.removeEventListener('change', this.onChange);
    this._connected = false;
  }

  apply() {
    if (!this.select || typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', this.select.value);
    url.searchParams.delete('page');
    window.location.href = url.toString();
  }
}
