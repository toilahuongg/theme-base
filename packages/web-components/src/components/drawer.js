import { setExpanded } from '../helpers.js';

export class SoDrawer extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.panel = this.querySelector('[data-drawer-panel]') || this;
    this.closeButtons = Array.from(this.querySelectorAll('[data-drawer-close]'));
    this.triggerSelector = this.getAttribute('trigger-selector');
    this.triggers = this.getDocumentTriggers();

    this.closeButtons.forEach((button) => button.addEventListener('click', this));
    this.triggers.forEach((trigger) => trigger.addEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this);
    }

    this.syncExpanded();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.closeButtons.forEach((button) => button.removeEventListener('click', this));
    this.triggers.forEach((trigger) => trigger.removeEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this);
    }

    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape' && this.isOpen()) {
      this.close();
      return;
    }

    if (event.type !== 'click') return;

    if (this.closeButtons.includes(event.currentTarget)) {
      this.close();
      return;
    }

    if (this.triggers.includes(event.currentTarget)) {
      this.open();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  open() {
    if (this.isOpen()) {
      this.syncExpanded();
      return;
    }

    this.setAttribute('open', '');
    this.syncExpanded();
  }

  close() {
    if (!this.isOpen()) {
      this.syncExpanded();
      return;
    }

    this.removeAttribute('open');
    this.syncExpanded();
  }

  syncExpanded() {
    const expanded = this.isOpen();

    this.triggers.forEach((trigger) => setExpanded(trigger, expanded));
    if (this.panel) {
      this.panel.hidden = !expanded;
    }
  }

  getDocumentTriggers() {
    if (!this.triggerSelector || typeof document === 'undefined') {
      return [];
    }

    return Array.from(document.querySelectorAll(this.triggerSelector));
  }
}
