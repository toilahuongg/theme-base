import { emit } from '../helpers.js';

export class SoShare extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.button = this.querySelector('[data-share-button]');
    this.onClick = () => this.share();
    this.button?.addEventListener('click', this.onClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.onClick);
    this._connected = false;
  }

  async share() {
    const url = this.getAttribute('url') || globalThis.location?.href || '';
    const title = this.getAttribute('title') || globalThis.document?.title || '';

    try {
      if (globalThis.navigator?.share) {
        await globalThis.navigator.share({ title, url });
      } else if (globalThis.navigator?.clipboard) {
        await globalThis.navigator.clipboard.writeText(url);
      }
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'NotAllowedError') return;
      emit(this, 'so:share:error', { error });
    }
  }
}
