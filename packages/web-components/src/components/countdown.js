/**
 * so-countdown — Countdown timer for flash sales and promotions.
 *
 * Attributes:
 *   target    — Target ISO date string (required).
 *   labels    — Show labels (days, hours, minutes, seconds).
 *   compact   — Compact display (no labels, single row).
 *
 * Events:
 *   so:countdown:tick   — { days, hours, minutes, seconds }
 *   so:countdown:done   — When countdown reaches zero.
 *
 * Public API:
 *   setTarget(isoDate)  — Update the target date.
 *   pause()             — Pause the countdown.
 *   resume()            — Resume after pause.
 */
export class SoCountdown extends HTMLElement {
  static observedAttributes = ['target'];

  connectedCallback() {
    if (this._connected) return;
    this.start();
    this._connected = true;
  }

  disconnectedCallback() {
    this.pause();
    this._connected = false;
  }

  attributeChangedCallback() {
    if (this._connected) this.start();
  }

  /** Set a new target date. */
  setTarget(isoDate) {
    this.setAttribute('target', isoDate);
    this.start();
  }

  /** Start/resume the countdown. */
  start() {
    this.pause();
    this._render();
    this._timer = setInterval(() => this._render(), 1000);
  }

  /** Pause the countdown. */
  pause() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  /** Resume after pause. */
  resume() {
    if (!this._timer) this.start();
  }

  _render() {
    const target = new Date(this.getAttribute('target'));
    if (isNaN(target.getTime())) {
      this.innerHTML = '<span class="so-countdown__error">Invalid date</span>';
      return;
    }

    const diff = Math.max(0, target.getTime() - Date.now());
    if (diff === 0) {
      this.innerHTML = '<span class="so-countdown__done">Ended</span>';
      this.pause();
      this.dispatchEvent(new CustomEvent('so:countdown:done', { bubbles: true }));
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const isCompact = this.hasAttribute('compact');
    const showLabels = this.hasAttribute('labels') && !isCompact;

    const unit = (value, label) => `
      <span class="so-countdown__unit">
        <span class="so-countdown__value">${String(value).padStart(2, '0')}</span>
        ${showLabels ? `<span class="so-countdown__label">${label}</span>` : ''}
      </span>`;

    let html = '<span class="so-countdown">';
    if (days > 0 || this.hasAttribute('show-days')) html += unit(days, 'Days');
    html += unit(hours, 'Hours');
    html += unit(minutes, 'Min');
    html += unit(seconds, 'Sec');
    html += '</span>';

    this.innerHTML = html;

    this.dispatchEvent(new CustomEvent('so:countdown:tick', {
      bubbles: true,
      detail: { days, hours, minutes, seconds }
    }));
  }
}
