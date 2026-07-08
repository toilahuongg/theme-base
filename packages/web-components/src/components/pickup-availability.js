export class SoPickupAvailability extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this.variantId = this.getAttribute('variant-id');
    this._connected = true;
  }
}
