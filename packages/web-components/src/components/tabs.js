export class SoTabs extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));

    this.tabs.forEach((tab) => tab.addEventListener('click', this));
    this.syncSelection(this.tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || this.tabs[0]);

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.tabs.forEach((tab) => tab.removeEventListener('click', this));
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type !== 'click') return;

    this.syncSelection(event.currentTarget);
  }

  syncSelection(selectedTab) {
    if (!selectedTab) return;

    this.tabs.forEach((tab) => {
      const selected = tab === selectedTab;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');

      const panelId = tab.getAttribute('aria-controls');
      const panel = panelId ? this.panels.find((candidate) => candidate.id === panelId) : null;
      if (panel) {
        panel.hidden = !selected;
      }
    });

    this.panels.forEach((panel) => {
      const activeTab = this.tabs.find((tab) => tab.getAttribute('aria-controls') === panel.id);
      panel.hidden = !activeTab || activeTab !== selectedTab;
    });
  }
}
