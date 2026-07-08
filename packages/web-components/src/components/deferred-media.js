export class SoDeferredMedia extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.button = this.querySelector('[data-deferred-media-load]');
    this.template = this.querySelector('template');
    this.onClick = () => this.load();
    this.button?.addEventListener('click', this.onClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.onClick);
    this._connected = false;
  }

  load() {
    if (!this.template) return;

    this.append(this.template.content.cloneNode(true));
    this.setAttribute('loaded', '');
    this.button?.remove();
  }
}
