export class SoPickupAvailability extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.variantId = this.getAttribute('variant-id');
    this.loadingEl = this.querySelector('[data-pickup-loading]');
    this.listEl = this.querySelector('[data-pickup-list]');
    this.emptyEl = this.querySelector('[data-pickup-empty]');
    this.errorEl = this.querySelector('[data-pickup-error]');

    this._connected = true;

    if (this.variantId) {
      this.fetchAvailability();
    }
  }

  disconnectedCallback() {
    this._connected = false;
  }

  async fetchAvailability() {
    this.setLoading(true);

    try {
      const response = await fetch(
        `/variants/${this.variantId}/pickup-availability?section_id=pickup-availability`
      );

      if (!response.ok) throw new Error('Failed to fetch pickup availability');

      const html = await response.text();
      this.renderResult(html);
    } catch (error) {
      this.renderError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.toggleAttribute('data-loading', loading);
    if (this.loadingEl) this.loadingEl.hidden = !loading;
    if (this.listEl) this.listEl.hidden = loading;
    if (this.emptyEl) this.emptyEl.hidden = loading;
    if (this.errorEl) this.errorEl.hidden = loading;
  }

  renderResult(html) {
    if (this.loadingEl) this.loadingEl.hidden = true;
    if (this.errorEl) this.errorEl.hidden = true;
    if (this.listEl) {
      this.listEl.innerHTML = html;
      this.listEl.hidden = false;
    }
  }

  renderError(message) {
    if (this.loadingEl) this.loadingEl.hidden = true;
    if (this.listEl) this.listEl.hidden = true;
    if (this.emptyEl) this.emptyEl.hidden = true;
    if (this.errorEl) {
      this.errorEl.textContent = message || 'Unable to check pickup availability';
      this.errorEl.hidden = false;
    }
  }

  refresh(variantId) {
    if (variantId) {
      this.variantId = variantId;
      this.setAttribute('variant-id', String(variantId));
    }
    if (this.variantId) {
      this.fetchAvailability();
    }
  }
}
