export class SoProductCard extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this.link = this.querySelector('a[href]');
    this._connected = true;
  }
}
