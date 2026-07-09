/**
 * so-toast — Shows a temporary message and auto-hides after duration.
 *
 * Attributes:
 *   duration   — Auto-hide delay in milliseconds (default 4000).
 *   open       — Reflects visible state.
 *   data-type  — "success", "error", "warning", "info" (default: none).
 *   data-position — "bottom-center", "top-right", "top-center", "bottom-right".
 *
 * Events:
 *   so:toast:open   — When toast appears.
 *   so:toast:close  — When toast disappears.
 *
 * Public API:
 *   show(message, opts?)  — Show toast with optional type/action.
 *   hide()                — Hide the toast.
 *
 * Static API (on class):
 *   SoToast.show(message, opts)  — Create and show a toast element.
 *   SoToast.dismissAll()         — Hide all visible toasts.
 */
export class SoToast extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    // Dismiss button
    this.dismissButton = this.querySelector('[data-toast-dismiss]');
    this.dismissButton?.addEventListener('click', () => this.hide());

    this._connected = true;
  }

  disconnectedCallback() {
    this.clearTimer();
    this._connected = false;
  }

  /** Show a message in this toast element. */
  show(message, opts = {}) {
    this.clearTimer();
    this._timerToken = Symbol('so-toast-timer');
    const timerToken = this._timerToken;

    // Set type
    if (opts.type) {
      this.setAttribute('data-type', opts.type);
    }

    // Set position
    if (opts.position) {
      this.setAttribute('data-position', opts.position);
    }

    // Build content
    const contentHtml = opts.action
      ? `<span>${this.escapeHtml(String(message ?? ''))}</span><button type="button" data-toast-action class="so-toast__action">${this.escapeHtml(opts.action.label)}</button>`
      : this.escapeHtml(String(message ?? ''));

    this.innerHTML = contentHtml;
    this.setAttribute('open', '');

    // Bind action button
    if (opts.action?.onClick) {
      const actionBtn = this.querySelector('[data-toast-action]');
      actionBtn?.addEventListener('click', () => {
        opts.action.onClick();
        this.hide();
      });
    }

    const duration = opts.duration !== undefined ? opts.duration : (Number(this.getAttribute('duration')) || 4000);
    if (duration > 0) {
      this._timer = setTimeout(() => {
        if (this._timerToken === timerToken) {
          this.hide();
        }
      }, duration);
    }

    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:toast:open', { bubbles: true }));
    }
  }

  /** Hide the toast. */
  hide() {
    this.clearTimer();
    this.removeAttribute('open');
    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:toast:close', { bubbles: true }));
    }
  }

  /** Clear any pending auto-dismiss timer. */
  clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._timerToken = null;
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  /** Static: Create and show a toast. Returns the element. */
  static show(message, opts = {}) {
    let container = document.querySelector('[data-toast-container]');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-toast-container', '');
      container.style.cssText = 'position:fixed;inset-block-end:1rem;inset-inline:1rem;z-index:90;display:grid;gap:0.5rem;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('so-toast');
    toast.setAttribute('data-position', opts.position || 'bottom-center');
    container.appendChild(toast);
    toast.show(message, opts);

    // Auto-remove from DOM after hide
    const originalHide = toast.hide.bind(toast);
    toast.hide = () => {
      originalHide();
      setTimeout(() => toast.remove(), 300);
    };

    return toast;
  }

  /** Static: Dismiss all visible toasts. */
  static dismissAll() {
    document.querySelectorAll('so-toast[open]').forEach((toast) => {
      if (typeof toast.hide === 'function') toast.hide();
    });
  }
}
