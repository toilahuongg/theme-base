import { setExpanded } from '../helpers.js';

export class SoDisclosure extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.toggleButton = this.querySelector('[data-disclosure-toggle]') || this.querySelector('button');
    this.panel = this.querySelector('[data-disclosure-panel]') || this.querySelector('[hidden]');

    if (!this.toggleButton || !this.panel) return;

    setExpanded(this.toggleButton, this.open);
    this.panel.hidden = !this.open;
    this.toggleButton.addEventListener('click', this);
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.toggleButton?.removeEventListener('click', this);
    this._connected = false;
  }

  get open() {
    return this.hasAttribute('open');
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.toggle();
    }
  }

  toggle() {
    const nextState = !this.open;

    if (nextState) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }

    this.panel.hidden = !nextState;
    setExpanded(this.toggleButton, nextState);
  }
}
