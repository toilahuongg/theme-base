import { FOCUSABLE_SELECTOR, setExpanded, rememberFocus, trapFocus } from '../helpers.js';

/**
 * SoOverlay — Shared base for overlay-like components (drawer, modal).
 *
 * Handles: open/close/toggle, body scroll lock, focus trap & restore,
 * ESC dismissal, backdrop click, external trigger wiring, aria-expanded sync,
 * and dispatch of open/close custom events.
 *
 * Subclasses MUST provide:
 *   - this.panel  — the element that receives focus trapping
 *   - _openClass  — CSS class added to the host when open
 *   - _backdrop   — optional backdrop element (click outside panel closes)
 *   - _closeButtons — array of close button elements
 *   - _triggers   — array of external trigger elements
 *   - _panelAttr  — attribute selector for the panel (e.g. 'data-drawer-panel')
 *   - _closeAttr  — attribute selector for close buttons (e.g. 'data-drawer-close')
 *   - _triggerAttr — attribute name for trigger selector (e.g. 'trigger-selector')
 *   - _eventPrefix — event name prefix (e.g. 'so:drawer' → 'so:drawer:open')
 *   - _bodyLockClass — CSS class added to <body> when open
 */
export class SoOverlay extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.panel = this.querySelector(`[${this._panelAttr}]`) || this;
    this._closeButtons = Array.from(this.querySelectorAll(`[${this._closeAttr}]`));
    this._triggerSelector = this.getAttribute(this._triggerAttr);
    this._triggers = this._getDocumentTriggers();

    this._closeButtons.forEach((btn) => btn.addEventListener('click', this));
    this._triggers.forEach((t) => t.addEventListener('click', this));
    document.addEventListener('keydown', this);

    // Backdrop click — click on host but outside panel closes
    this.addEventListener('click', (e) => {
      if (e.target === this) this.close();
    });

    this._syncExpanded();
    if (this.hasAttribute('open')) {
      this._lockBody();
      this._trapFocus();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this._closeButtons.forEach((btn) => btn.removeEventListener('click', this));
    this._triggers.forEach((t) => t.removeEventListener('click', this));
    document.removeEventListener('keydown', this);
    this._cleanupFocus?.();
    this._unlockBody();
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape' && this.isOpen()) {
      this.close();
      return;
    }
    if (event.type !== 'click') return;

    if (this._closeButtons.includes(event.currentTarget)) {
      this.close();
      return;
    }
    if (this._triggers.includes(event.currentTarget)) {
      this.open();
    }
  }

  /** Whether the overlay is currently open. */
  isOpen() {
    return this.hasAttribute('open');
  }

  /** Open the overlay. */
  open() {
    if (this.isOpen()) return;
    this.setAttribute('open', '');
    this.classList.add(this._openClass);
    this._syncExpanded();
    this._lockBody();
    this._trapFocus();
    this._emit(`${this._eventPrefix}:open`);
  }

  /** Close the overlay. */
  close() {
    if (!this.isOpen()) return;
    this.removeAttribute('open');
    this.classList.remove(this._openClass);
    this._syncExpanded();
    this._unlockBody();
    this._cleanupFocus?.();
    this._emit(`${this._eventPrefix}:close`);
  }

  /** Toggle open state. */
  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  /** Refresh trigger elements from the document (call after DOM changes). */
  refreshTriggers() {
    this._triggers = this._getDocumentTriggers();
    this._triggers.forEach((t) => t.addEventListener('click', this));
  }

  _syncExpanded() {
    const expanded = this.isOpen();
    this._triggers.forEach((t) => setExpanded(t, expanded));
    if (this.panel) {
      this.panel.hidden = !expanded;
    }
  }

  _getDocumentTriggers() {
    if (!this._triggerSelector || typeof document === 'undefined') return [];
    return Array.from(document.querySelectorAll(this._triggerSelector));
  }

  _lockBody() {
    document.body?.classList?.add(this._bodyLockClass);
  }

  _unlockBody() {
    document.body?.classList?.remove(this._bodyLockClass);
  }

  _trapFocus() {
    const root = this.panel || this;
    if (typeof root?.querySelectorAll !== 'function') return;
    const focusable = Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((el) => !el.closest('[hidden]'));
    if (focusable.length === 0) return;

    const restoreFocus = rememberFocus();
    const cleanup = trapFocus(root);

    this._cleanupFocus = () => {
      cleanup();
      restoreFocus();
      this._cleanupFocus = null;
    };
  }

  _emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true }));
  }
}
