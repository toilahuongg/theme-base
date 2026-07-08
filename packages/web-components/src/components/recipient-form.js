export class SoRecipientForm extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.toggle = this.querySelector('[data-recipient-toggle]');
    this.fields = this.querySelector('[data-recipient-fields]');
    this.onChange = () => this.sync();
    this.toggle?.addEventListener('change', this.onChange);
    this.sync();
    this._connected = true;
  }

  disconnectedCallback() {
    this.toggle?.removeEventListener('change', this.onChange);
    this._connected = false;
  }

  sync() {
    if (this.fields) {
      this.fields.hidden = !this.toggle?.checked;
    }
  }
}
