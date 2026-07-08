export class SoSwatches extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.swatches = Array.from(this.querySelectorAll('[data-swatch-value]'));
    this.onClick = (event) => this.select(event.currentTarget);
    this.swatches.forEach((swatch) => swatch.addEventListener('click', this.onClick));
    this._connected = true;
  }

  disconnectedCallback() {
    this.swatches?.forEach((swatch) => swatch.removeEventListener('click', this.onClick));
    this._connected = false;
  }

  select(selectedSwatch) {
    this.swatches.forEach((swatch) => {
      swatch.setAttribute('aria-pressed', swatch === selectedSwatch ? 'true' : 'false');
    });
    this.dispatchEvent(new CustomEvent('so:swatch:change', {
      bubbles: true,
      detail: { value: selectedSwatch.getAttribute('data-swatch-value') }
    }));
  }
}
