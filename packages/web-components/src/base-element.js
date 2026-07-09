import { emit } from './helpers.js';

/**
 * Base class for all SO web components.
 * Provides lifecycle guards, event dispatch, and DOM query helpers.
 */
export class SoElement extends HTMLElement {
  /** Whether this instance has finished connectedCallback. */
  get _isConnected() {
    return this.__connected === true;
  }

  connectedCallback() {
    if (this.__connected) return;
    this.__rendered = false;
  }

  disconnectedCallback() {
    this.__connected = false;
    this.__rendered = false;
  }

  /** Mark the component as fully connected after subclass setup. */
  _markConnected() {
    this.__connected = true;
    this.__rendered = true;
  }

  /** Dispatch a bub CustomEvent from this element. */
  _emit(name, detail = {}) {
    emit(this, name, detail);
  }

  /** Query a selector within this element's shadow or light DOM. */
  _qs(selector) {
    return this.querySelector(selector);
  }

  /** Query all matches within this element's light DOM. */
  _qsa(selector) {
    return Array.from(this.querySelectorAll(selector));
  }

  /** Toggle an attribute presence (true = add, false = remove). */
  _toggleAttr(name, value) {
    if (value) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  /** Read a CSS custom property from this element's computed style. */
  _cssVar(name) {
    return getComputedStyle(this).getPropertyValue(name).trim();
  }
}
