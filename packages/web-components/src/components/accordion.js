import { setExpanded } from '../helpers.js';

export class SoAccordion extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.items = Array.from(this.querySelectorAll('[data-accordion-item]')).map((item) => {
      const toggle = item.querySelector('[data-accordion-toggle]');
      const panel = item.querySelector('[data-accordion-panel]');

      if (!toggle || !panel) {
        return null;
      }

      toggle.addEventListener('click', this);
      this.syncItem(toggle, panel);

      return { item, toggle, panel };
    }).filter(Boolean);

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.items.forEach(({ toggle }) => toggle.removeEventListener('click', this));
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type !== 'click') return;

    const toggle = event.currentTarget;
    const item = toggle.closest('[data-accordion-item]');
    const panel = item?.querySelector('[data-accordion-panel]');

    if (!item || !panel) return;

    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    setExpanded(toggle, expanded);
    panel.hidden = !expanded;
  }

  syncItem(toggle, panel) {
    const expandedAttr = toggle.getAttribute('aria-expanded');
    const expanded = expandedAttr === 'true' || (expandedAttr === null && !panel.hidden);
    setExpanded(toggle, expanded);
    panel.hidden = !expanded;
  }
}
