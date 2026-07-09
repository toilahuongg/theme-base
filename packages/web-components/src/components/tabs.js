/**
 * so-tabs — Switches tab panels using ARIA tab roles with keyboard navigation.
 *
 * Events:
 *   so:tabs:change  — { tab, panel, index }
 *
 * Public API:
 *   select(indexOrId)  — Activate a tab by index or aria-controls ID.
 *   activeTab          — Returns the currently active tab element.
 *   activePanel        — Returns the currently active panel element.
 */
export class SoTabs extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));

    this.tabs.forEach((tab) => {
      tab.addEventListener('click', this);
      tab.addEventListener('keydown', this);
    });

    const initial = this.tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || this.tabs[0];
    this.syncSelection(initial);

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.tabs.forEach((tab) => {
      tab.removeEventListener('click', this);
      tab.removeEventListener('keydown', this);
    });
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.syncSelection(event.currentTarget);
      return;
    }

    // Keyboard navigation (ArrowLeft/Right/Home/End)
    if (event.type === 'keydown') {
      const index = this.tabs.indexOf(event.currentTarget);
      const direction = this._isVertical() ? -1 : 1;
      const keyActions = {
        ArrowRight: () => this._focusAt(index + direction),
        ArrowLeft: () => this._focusAt(index - direction),
        ArrowDown: () => this._isVertical() && this._focusAt(index + 1),
        ArrowUp: () => this._isVertical() && this._focusAt(index - 1),
        Home: () => this._focusAt(0),
        End: () => this._focusAt(this.tabs.length - 1)
      };
      if (keyActions[event.key]) {
        event.preventDefault();
        keyActions[event.key]();
      }
    }
  }

  /** Activate a tab by index or aria-controls ID. */
  select(indexOrId) {
    if (typeof indexOrId === 'number') {
      const tab = this.tabs[indexOrId];
      if (tab) this.syncSelection(tab);
      return;
    }
    // String: match by aria-controls
    const tab = this.tabs.find((t) => t.getAttribute('aria-controls') === indexOrId);
    if (tab) this.syncSelection(tab);
  }

  /** Currently active tab element. */
  get activeTab() {
    return this.tabs.find((t) => t.getAttribute('aria-selected') === 'true') || null;
  }

  /** Currently active panel element. */
  get activePanel() {
    const tab = this.activeTab;
    if (!tab) return null;
    const panelId = tab.getAttribute('aria-controls');
    return this.panels.find((p) => p.id === panelId) || null;
  }

  syncSelection(selectedTab) {
    if (!selectedTab) return;

    this.tabs.forEach((tab) => {
      const selected = tab === selectedTab;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('tabindex', selected ? '0' : '-1');

      const panelId = tab.getAttribute('aria-controls');
      const panel = this.panels.find((p) => p.id === panelId);
      if (panel) {
        panel.hidden = !selected;
      }
    });

    const panelId = selectedTab.getAttribute('aria-controls');
    const panel = this.panels.find((p) => p.id === panelId);
    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:tabs:change', {
        bubbles: true,
        detail: { tab: selectedTab, panel, index: this.tabs.indexOf(selectedTab) }
      }));
    }
  }

  _focusAt(index) {
    const clamped = Math.max(0, Math.min(index, this.tabs.length - 1));
    const tab = this.tabs[clamped];
    if (tab) {
      tab.focus();
      this.syncSelection(tab);
    }
  }

  _isVertical() {
    return this.hasAttribute('vertical') || this.getAttribute('orientation') === 'vertical';
  }
}
