export class SoLocalization extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.selects = Array.from(this.querySelectorAll('select'));
    this.onChange = () => this.submit();

    this.selects.forEach((select) => select.addEventListener('change', this.onChange));
    this._connected = true;
  }

  disconnectedCallback() {
    this.selects?.forEach((select) => select.removeEventListener('change', this.onChange));
    this._connected = false;
  }

  submit() {
    if (!this.form) return;

    if (typeof this.form.requestSubmit === 'function') {
      this.form.requestSubmit();
    } else {
      this.form.submit();
    }
  }
}
