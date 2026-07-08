export class SoFacets extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.onChange = () => this.apply();
    this.form?.addEventListener('change', this.onChange);
    this._connected = true;
  }

  disconnectedCallback() {
    this.form?.removeEventListener('change', this.onChange);
    this._connected = false;
  }

  apply() {
    if (!this.form || typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const formData = new FormData(this.form);
    const filterNames = [...new Set(Array.from(this.form.querySelectorAll('[name]')).map((field) => field.name))];

    filterNames.forEach((name) => url.searchParams.delete(name));
    url.searchParams.delete('page');
    for (const [name, value] of formData.entries()) {
      url.searchParams.append(name, value);
    }

    window.location.href = url.toString();
  }
}
