import { setExpanded } from '../helpers.js';

/**
 * so-accordion — Manages multiple independent disclosure rows.
 *
 * Attributes:
 *   single-expand  — Only one panel open at a time.
 *
 * Events:
 *   so:accordion:toggle  — { toggle, panel, expanded }
 *
 * Public API:
 *   open(index)    — Open a panel by index.
 *   close(index)   — Close a panel by index.
 *   toggle(index)  — Toggle a panel by index.
 *   openAll()      — Open all panels.
 *   closeAll()     — Close all panels.
 */
export class SoAccordion extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.items = Array.from(this.querySelectorAll('[data-accordion-item]')).map((item) => {
      const toggle = item.querySelector('[data-accordion-toggle]');
      const panel = item.querySelector('[data-accordion-panel]');
      if (!toggle || !panel) return null;

      toggle.addEventListener('click', this);
      toggle.addEventListener('keydown', this);
      this.syncItem(toggle, panel);
      return { item, toggle, panel };
    }).filter(Boolean);

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.items.forEach(({ toggle }) => {
      toggle.removeEventListener('click', this);
      toggle.removeEventListener('keydown', this);
    });
    this._connected = false;
  }

  handleEvent(event) {
    const toggle = event.currentTarget;
    const item = toggle.closest('[data-accordion-item]');
    const panel = item?.querySelector('[data-accordion-panel]');
    if (!item || !panel) return;

    if (event.type === 'click') {
      this._toggleItem(toggle, panel);
      return;
    }

    // Keyboard navigation
    if (event.type === 'keydown') {
      const index = this.items.findIndex((r) => r.toggle === toggle);
      const keyActions = {
        ArrowDown: () => this._focusItemAt((index + 1) % this.items.length),
        ArrowUp: () => this._focusItemAt((index - 1 + this.items.length) % this.items.length),
        Home: () => this._focusItemAt(0),
        End: () => this._focusItemAt(this.items.length - 1)
      };
      if (keyActions[event.key]) {
        event.preventDefault();
        keyActions[event.key]();
      }
    }
  }

  /** Open a panel by index. */
  open(index) {
    const row = this.items[index];
    if (!row || row.toggle.getAttribute('aria-expanded') === 'true') return;
    this._toggleItem(row.toggle, row.panel);
  }

  /** Close a panel by index. */
  close(index) {
    const row = this.items[index];
    if (!row || row.toggle.getAttribute('aria-expanded') !== 'true') return;
    this._toggleItem(row.toggle, row.panel);
  }

  /** Toggle a panel by index. */
  toggle(index) {
    const row = this.items[index];
    if (!row) return;
    this._toggleItem(row.toggle, row.panel);
  }

  /** Open all panels. */
  openAll() {
    this.items.forEach(({ toggle, panel }) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') {
        this._toggleItem(toggle, panel);
      }
    });
  }

  /** Close all panels. */
  closeAll() {
    this.items.forEach(({ toggle, panel }) => {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        this._toggleItem(toggle, panel);
      }
    });
  }

  _toggleItem(toggle, panel) {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    // Single-expand: close other panels
    if (typeof this.hasAttribute === 'function' && this.hasAttribute('single-expand')) {
      this.items.forEach(({ toggle: t, panel: p }) => {
        if (t !== toggle && t.getAttribute('aria-expanded') === 'true') {
          setExpanded(t, false);
          p.hidden = true;
        }
      });
    }

    const expanded = !isExpanded;
    setExpanded(toggle, expanded);
    panel.hidden = !expanded;

    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:accordion:toggle', {
        bubbles: true,
        detail: { toggle, panel, expanded, index: this.items.findIndex((r) => r.toggle === toggle) }
      }));
    }
  }

  _focusItemAt(index) {
    const row = this.items[index];
    if (row) row.toggle.focus();
  }

  syncItem(toggle, panel) {
    const expandedAttr = toggle.getAttribute('aria-expanded');
    const expanded = expandedAttr === 'true' || (expandedAttr === null && !panel.hidden);
    setExpanded(toggle, expanded);
    panel.hidden = !expanded;
  }
}
