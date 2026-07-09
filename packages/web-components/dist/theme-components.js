// Generated from packages/web-components/src/index.js.
// Run npm run build:web-components after editing web component source.

(() => {
function registerElement(name, elementClass) {
  if (!customElements.get(name)) {
    customElements.define(name, elementClass);
  }
}

// ─── Constants ───────────────────────────────────────────────────────────

/** CSS selector for all focusable elements. */
const FOCUSABLE_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
].join(', ');

// ─── Event helpers ───────────────────────────────────────────────────────

/** Dispatch a bub CustomEvent from an element. */
function emit(element, name, detail = {}) {
  element.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

/** One-time event listener. Returns the bound handler for manual removal. */
function once(element, eventName, handler, options) {
  const wrapped = (event) => {
    element.removeEventListener(eventName, wrapped, options);
    handler.call(element, event);
  };
  element.addEventListener(eventName, wrapped, options);
  return wrapped;
}

// ─── DOM helpers ─────────────────────────────────────────────────────────
function qs(root, selector) {
  return root.querySelector(selector);
}
function qsa(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

/** Set or remove aria-expanded on a button. */
function setExpanded(button, expanded) {
  if (button) {
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
}

/** Save the current activeElement and return a restore function. */
function rememberFocus() {
  const previous = document.activeElement;
  return () => {
    if (previous && typeof previous.focus === 'function') {
      previous.focus();
    }
  };
}

/** Get the slotted content for a named slot. Returns an array of nodes. */
function slotContent(target, name = '') {
  const slot = target.querySelector(`slot[name="${name}"]`);
  if (slot) return Array.from(slot.assignedNodes());
  return [];
}

// ─── Timing helpers ──────────────────────────────────────────────────────

/** Debounce a function. Returns a debounced wrapper. */
function debounce(fn, ms = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/** Throttle a function to at most once per interval. */
function throttle(fn, ms = 100) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// ─── Focus management ────────────────────────────────────────────────────

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
].join(', ');

/** Trap focus inside a root element. Call the returned cleanup to release. */
function trapFocus(root) {
  const focusable = Array.from(root.querySelectorAll(FOCUSABLE))
    .filter((el) => !el.closest('[hidden]'));

  if (focusable.length === 0) return () => {};

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function onKeydown(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  root.addEventListener('keydown', onKeydown);
  first.focus();

  return () => {
    root.removeEventListener('keydown', onKeydown);
  };
}

// ─── CSS custom properties ──────────────────────────────────────────────

/** Read a CSS custom property value from the computed style of an element. */
function cssVar(element, name) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

// ─── Announce (live region wrapper) ─────────────────────────────────────

/** Announce a message to screen readers via a live region. */
function announce(message, politeness = 'polite') {
  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
  region.textContent = message;
  document.body.appendChild(region);
  // Remove after screen readers have had time to pick it up
  setTimeout(() => region.remove(), 3000);
}

class SoDisclosure extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.toggleButton = this.querySelector('[data-disclosure-toggle]') || this.querySelector('button');
    this.panel = this.querySelector('[data-disclosure-panel]') || this.querySelector('[hidden]');

    if (!this.toggleButton || !this.panel) return;

    setExpanded(this.toggleButton, this.open);
    this.panel.hidden = !this.open;
    this.toggleButton.addEventListener('click', this);
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.toggleButton?.removeEventListener('click', this);
    this._connected = false;
  }

  get open() {
    return this.hasAttribute('open');
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.toggle();
    }
  }

  toggle() {
    const nextState = !this.open;

    if (nextState) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }

    this.panel.hidden = !nextState;
    setExpanded(this.toggleButton, nextState);
  }
}

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
class SoAccordion extends HTMLElement {
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
class SoOverlay extends HTMLElement {
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

/**
 * so-drawer — Slide-in drawer from left or right edge.
 *
 * Attributes:
 *   trigger-selector  — CSS selector for external open triggers.
 *   open              — Reflects the current open state.
 *   position          — "left" (default) or "right".
 *
 * Events:
 *   so:drawer:open   — Fired when the drawer opens.
 *   so:drawer:close  — Fired when the drawer closes.
 *
 * Public API:
 *   open()    — Open the drawer.
 *   close()   — Close the drawer.
 *   toggle()  — Toggle open state.
 *
 * Markup:
 *   <so-drawer trigger-selector=".open-cart">
 *     <div data-drawer-panel class="so-drawer__panel">
 *       <button data-drawer-close>Close</button>
 *       <!-- content -->
 *     </div>
 *   </so-drawer>
 */
class SoDrawer extends SoOverlay {
  _openClass = 'so-drawer--open';
  _bodyLockClass = 'so-body-locked';
  _panelAttr = 'data-drawer-panel';
  _closeAttr = 'data-drawer-close';
  _triggerAttr = 'trigger-selector';
  _eventPrefix = 'so:drawer';
}

class SoLiveRegion extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'status');
    }
    if (!this.hasAttribute('aria-live')) {
      this.setAttribute('aria-live', 'polite');
    }
    if (!this.hasAttribute('aria-atomic')) {
      this.setAttribute('aria-atomic', 'true');
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.clearTimer();
    this._connected = false;
  }

  announce(message) {
    this.clearTimer();
    this.textContent = '';
    this._timer = setTimeout(() => {
      this.textContent = String(message ?? '');
    }, 25);
  }

  clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}

/**
 * so-modal — Centered modal overlay with focus trap.
 *
 * Attributes:
 *   trigger-selector  — CSS selector for external open triggers.
 *   open              — Reflects the current open state.
 *
 * Events:
 *   so:modal:open   — Fired when the modal opens.
 *   so:modal:close  — Fired when the modal closes.
 *
 * Public API:
 *   open()    — Open the modal.
 *   close()   — Close the modal.
 *   toggle()  — Toggle open state.
 *
 * Markup:
 *   <so-modal trigger-selector=".open-modal">
 *     <div data-modal-panel class="so-modal__panel">
 *       <button data-modal-close>Close</button>
 *       <!-- content -->
 *     </div>
 *   </so-modal>
 */
class SoModal extends SoOverlay {
  _openClass = 'so-modal--open';
  _bodyLockClass = 'so-body-locked';
  _panelAttr = 'data-modal-panel';
  _closeAttr = 'data-modal-close';
  _triggerAttr = 'trigger-selector';
  _eventPrefix = 'so:modal';
}

class SoQuantity extends HTMLElement {
  constructor() {
    super();
    this.decrease = () => this.step(-1);
    this.increase = () => this.step(1);
    this.update = () => this.updateControls();
  }

  connectedCallback() {
    if (this._connected) return;

    this.input = this.querySelector('input[type="number"]');
    this.decreaseButton = this.querySelector('[data-quantity-decrease]');
    this.increaseButton = this.querySelector('[data-quantity-increase]');

    if (!this.input) return;

    this.decreaseButton?.addEventListener('click', this.decrease);
    this.increaseButton?.addEventListener('click', this.increase);
    this.input.addEventListener('input', this.update);
    this.input.addEventListener('change', this.update);
    this.updateControls();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.decreaseButton?.removeEventListener('click', this.decrease);
    this.increaseButton?.removeEventListener('click', this.increase);
    this.input?.removeEventListener('input', this.update);
    this.input?.removeEventListener('change', this.update);
    this._connected = false;
  }

  step(direction) {
    const step = this.getStep();
    const min = this.getMin();
    const max = this.getMax();
    const current = this.getCurrent();
    const nextValue = Math.min(max, Math.max(min, current + direction * step));

    this.input.value = String(nextValue);
    this.updateControls();
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  updateControls() {
    if (!this.input) return;

    const current = this.getCurrent();
    const min = this.getMin();
    const max = this.getMax();

    this.setButtonDisabled(this.decreaseButton, Number.isFinite(min) && current <= min);
    this.setButtonDisabled(this.increaseButton, Number.isFinite(max) && current >= max);
  }

  setButtonDisabled(button, disabled) {
    if (!button) return;

    button.disabled = disabled;
    button.toggleAttribute?.('disabled', disabled);
    button.setAttribute?.('aria-disabled', disabled ? 'true' : 'false');
  }

  getStep() {
    const step = Number(this.input.step);
    return Number.isFinite(step) && step > 0 ? step : 1;
  }

  getMin() {
    if (this.input.min === '') return -Infinity;

    const min = Number(this.input.min);
    return Number.isFinite(min) ? min : -Infinity;
  }

  getMax() {
    if (this.input.max === '') return Infinity;

    const max = Number(this.input.max);
    return Number.isFinite(max) ? max : Infinity;
  }

  getCurrent() {
    const current = Number(this.input.value);
    if (Number.isFinite(current)) return current;

    const min = this.getMin();
    return Number.isFinite(min) ? min : 0;
  }
}

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
class SoTabs extends HTMLElement {
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
class SoToast extends HTMLElement {
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

class SoVariantController extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.optionInputs = Array.from(this.querySelectorAll('[data-variant-option]'));
    this.formId = this.getAttribute('product-form-id');
    this.form = this.getProductForm();
    this.variantInput = this.getVariantInput();
    this.submitButton = this.getSubmitButton();
    this.variants = this.getVariants();
    this.onChange = () => this.syncVariant();

    this.optionInputs.forEach((input) => input.addEventListener('change', this.onChange));
    this.syncVariant();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.optionInputs.forEach((input) => input.removeEventListener('change', this.onChange));
    this._connected = false;
  }

  syncVariant() {
    const selectedOptions = this.getSelectedOptions();
    const selectedVariant = this.variants.find((variant) => {
      return selectedOptions.every((value, index) => variant.options?.[index] === value);
    });

    if (this.variantInput) {
      this.variantInput.value = selectedVariant ? String(selectedVariant.id) : '';
      this.variantInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this.syncSubmitButton(selectedVariant);
    this.toggleUnavailableState(selectedVariant);
    emit(this, 'so:variant:change', {
      variant: selectedVariant || null,
      formId: this.formId || null
    });
  }

  getSelectedOptions() {
    const optionNames = [...new Set(this.optionInputs.map((input) => input.name))];

    return optionNames.map((name) => {
      const selected = this.optionInputs.find((input) => input.name === name && input.checked);
      return selected?.value ?? '';
    });
  }

  getVariantInput() {
    return this.form?.querySelector('[name="id"]') || this.querySelector('[name="id"]');
  }

  getProductForm() {
    return this.formId && typeof document !== 'undefined' ? document.getElementById(this.formId) : null;
  }

  getSubmitButton() {
    return this.form?.querySelector('[type="submit"]') || this.querySelector('[type="submit"]');
  }

  getVariants() {
    const script = this.querySelector('[data-variant-json]');
    if (!script?.textContent) return [];

    try {
      return JSON.parse(script.textContent);
    } catch {
      return [];
    }
  }

  toggleUnavailableState(variant) {
    const unavailable = !variant || variant.available === false;
    this.toggleAttribute('data-unavailable', unavailable);
  }

  syncSubmitButton(variant) {
    if (!this.submitButton) return;

    const disabled = !variant || variant.available === false;
    const text = this.getButtonText(variant);

    this.submitButton.toggleAttribute('data-variant-disabled', disabled);
    this.submitButton.disabled = disabled || this.submitButton.hasAttribute('aria-busy');

    if (text) {
      this.submitButton.textContent = text;
    }
  }

  getButtonText(variant) {
    if (!variant) {
      return this.submitButton.getAttribute('data-unavailable-text') || 'Unavailable';
    }

    if (variant.available === false) {
      return this.submitButton.getAttribute('data-sold-out-text') || 'Sold out';
    }

    return this.submitButton.getAttribute('data-add-to-cart-text') || 'Add to cart';
  }
}

/**
 * so-product-form — Submits add-to-cart forms normally or through AJAX.
 *
 * Attributes:
 *   ajax        — Posts to /cart/add.js and emits cart events.
 *   aria-busy   — Set while an AJAX request is pending.
 *
 * Events:
 *   so:form:submit  — Before form submission (cancelable).
 *   so:cart:add     — After successful add-to-cart.
 *   so:cart:error   — On add-to-cart failure.
 *   so:form:success — After successful submission (non-AJAX or AJAX).
 *
 * Public API:
 *   submit()        — Trigger form submission programmatically.
 *   reset()         — Reset the form to initial state.
 *   setSubmitting(bool) — Set busy state.
 *   serializeBody() — Returns JSON string of form data.
 */
class SoProductForm extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.submitButton = this.querySelector('[type="submit"]');
    this.onSubmit = this.onSubmit.bind(this);
    this.form?.addEventListener('submit', this.onSubmit);
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.form?.removeEventListener('submit', this.onSubmit);
    this._connected = false;
  }

  /** Programmatic submit. */
  submit() {
    this.form?.requestSubmit?.(this.submitButton) || this.form?.submit();
  }

  /** Reset form and clear busy state. */
  reset() {
    this.form?.reset();
    this.setBusy(false);
  }

  /** Set submitting (busy) state. */
  setSubmitting(busy) {
    this.setBusy(busy);
  }

  async onSubmit(event) {
    if (this.isUnavailable()) {
      event.preventDefault();
      return;
    }

    // Allow consumers to intercept/cancel submission
    const beforeSubmit = new CustomEvent('so:form:submit', {
      bubbles: true,
      cancelable: true,
      detail: { action: this.form?.action, method: this.form?.method }
    });
    this.dispatchEvent(beforeSubmit);
    if (beforeSubmit.defaultPrevented) {
      event.preventDefault();
      return;
    }

    if (!this.hasAttribute('ajax') || !this.form) return;

    event.preventDefault();
    this.setBusy(true);

    try {
      const body = this.serializeBody();
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.description || `Add to cart failed (${response.status})`);
      }

      const item = await response.json();
      emit(this, 'so:cart:add', { item });
      emit(this, 'so:form:success', { item });
    } catch (error) {
      emit(this, 'so:cart:error', { error });
    } finally {
      this.setBusy(false);
    }
  }

  /** Serialize form data to JSON string. */
  serializeBody() {
    const formData = new FormData(this.form);
    const body = {};
    formData.forEach((value, key) => {
      body[key] = String(value);
    });
    return JSON.stringify(body);
  }

  setBusy(busy) {
    this.toggleAttribute('aria-busy', busy);
    this.submitButton?.toggleAttribute('aria-busy', busy);
    if (this.submitButton) {
      this.submitButton.disabled = busy || this.submitButton.hasAttribute('data-variant-disabled');
    }
  }

  isUnavailable() {
    const variantInput = this.form?.querySelector('[name="id"]');
    return this.submitButton?.disabled === true || !variantInput?.value;
  }
}

class SoMediaGallery extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.thumbnails = Array.from(this.querySelectorAll('[data-media-thumbnail]'));
    this.mediaItems = Array.from(this.querySelectorAll('[data-media-item]'));
    this.onClick = (event) => this.select(event.currentTarget.getAttribute('data-media-thumbnail'));
    this.onVariantChange = (event) => {
      const mediaId = event.detail?.variant?.featured_media?.id;
      if (mediaId) {
        this.select(String(mediaId));
      }
    };

    this.thumbnails.forEach((thumbnail) => thumbnail.addEventListener('click', this.onClick));
    if (typeof document !== 'undefined') {
      document.addEventListener('so:variant:change', this.onVariantChange);
    }

    const selectedId = this.thumbnails.find((thumbnail) => thumbnail.getAttribute('aria-current') === 'true')?.getAttribute('data-media-thumbnail');
    this.select(selectedId || this.mediaItems[0]?.getAttribute('data-media-item'));
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.thumbnails.forEach((thumbnail) => thumbnail.removeEventListener('click', this.onClick));
    if (typeof document !== 'undefined') {
      document.removeEventListener('so:variant:change', this.onVariantChange);
    }
    this._connected = false;
  }

  select(id) {
    if (!id) return;

    this.mediaItems.forEach((item) => {
      item.hidden = item.getAttribute('data-media-item') !== id;
    });

    this.thumbnails.forEach((thumbnail) => {
      thumbnail.setAttribute('aria-current', thumbnail.getAttribute('data-media-thumbnail') === id ? 'true' : 'false');
    });
  }
}

class SoStickyBuyBar extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.targetSelector = this.getAttribute('target-selector');
    this.target = this.targetSelector && typeof document !== 'undefined' ? document.querySelector(this.targetSelector) : null;

    if ('IntersectionObserver' in globalThis && this.target) {
      this.observer = new IntersectionObserver(([entry]) => {
        this.hidden = entry.isIntersecting;
      });
      this.observer.observe(this.target);
    } else {
      this.hidden = false;
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this._connected = false;
  }
}

class SoStickyHeader extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.threshold = Number(this.getAttribute('threshold')) || 8;
    this.lastScrollY = typeof window === 'undefined' ? 0 : window.scrollY || 0;
    this.onScroll = () => this.update();

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.update();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
    this._connected = false;
  }

  update() {
    const currentScrollY = window.scrollY || 0;
    const scrolled = currentScrollY > this.threshold;
    const scrollingDown = currentScrollY > this.lastScrollY;

    this.toggleAttribute('scrolled', scrolled);
    this.toggleAttribute('scrolling-down', scrolled && scrollingDown);
    this.lastScrollY = currentScrollY;
  }
}

class SoLocalization extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.selects = Array.from(this.querySelectorAll('select'));
    this.onChange = () => this.submit();

    this.selects.forEach((select) => select.addEventListener('change', this.onChange));
    this._connected = true;
  }

  disconnectedCallback() {
    this.selects?.forEach((select) => select.removeEventListener('change', this.onChange));
    this._connected = false;
  }

  submit() {
    if (!this.form) return;

    if (typeof this.form.requestSubmit === 'function') {
      this.form.requestSubmit();
    } else {
      this.form.submit();
    }
  }
}

/**
 * so-cart-drawer — Cart-specific drawer that auto-opens on so:cart:add.
 *
 * Attributes:
 *   trigger-selector  — Document selector for open triggers.
 *   open              — Reflects the current open state.
 *
 * Events:
 *   so:cart-drawer:open   — When drawer opens.
 *   so:cart-drawer:close  — When drawer closes.
 *
 * Public API:
 *   open()    — Open the cart drawer.
 *   close()   — Close the cart drawer.
 *   toggle()  — Toggle open state.
 *   refresh() — Fetch cart state from /cart.js and update chrome.
 */
class SoCartDrawer extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.panel = this.querySelector('[data-cart-drawer-panel]') || this;
    this.closeButtons = Array.from(this.querySelectorAll('[data-cart-drawer-close]'));
    this.triggerSelector = this.getAttribute('trigger-selector');
    this.triggers = this.getTriggers();
    this.onCartAdd = () => this.open();

    this.closeButtons.forEach((button) => button.addEventListener('click', this));
    this.triggers.forEach((trigger) => trigger.addEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this);
      document.addEventListener('so:cart:add', this.onCartAdd);
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
      document.removeEventListener('so:cart:add', this.onCartAdd);
    }

    this._cleanupFocus?.();
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
      event.preventDefault();
      this.open();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  /** Open the cart drawer. */
  open() {
    if (this.isOpen()) return;
    this.setAttribute('open', '');
    this.syncExpanded();
    this._lockBody();
    this._trapFocus();
    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:cart-drawer:open', { bubbles: true }));
    }
  }

  /** Close the cart drawer. */
  close() {
    if (!this.isOpen()) return;
    this.removeAttribute('open');
    this.syncExpanded();
    this._unlockBody();
    this._cleanupFocus?.();
    if (typeof this.dispatchEvent === 'function') {
      this.dispatchEvent(new CustomEvent('so:cart-drawer:close', { bubbles: true }));
    }
  }

  /** Toggle open state. */
  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  /** Fetch cart state and update DOM chrome. */
  async refresh() {
    try {
      const response = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const cart = await response.json();
      this._updateCartChrome(cart);
    } catch {
      // Silently fail — cart chrome is best-effort
    }
  }

  syncExpanded() {
    const expanded = this.isOpen();
    this.triggers.forEach((trigger) => setExpanded(trigger, expanded));
    if (this.panel) {
      this.panel.hidden = !expanded;
    }
  }

  getTriggers() {
    if (!this.triggerSelector || typeof document === 'undefined') {
      return [];
    }
    return Array.from(document.querySelectorAll(this.triggerSelector));
  }

  _lockBody() {
    document.body?.classList?.add('so-body-locked');
  }

  _unlockBody() {
    document.body?.classList?.remove('so-body-locked');
  }

  _trapFocus() {
    const panel = this.panel || this;
    if (typeof panel?.querySelectorAll !== 'function') return;
    const focusable = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((el) => !el.closest('[hidden]'));
    if (focusable.length === 0) return;

    const restoreFocus = rememberFocus();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onKeydown = (event) => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    panel.addEventListener('keydown', onKeydown);
    first.focus();

    this._cleanupFocus = () => {
      panel.removeEventListener('keydown', onKeydown);
      restoreFocus();
      this._cleanupFocus = null;
    };
  }

  _updateCartChrome(cart) {
    if (typeof document === 'undefined') return;

    const hasItems = Number(cart.item_count) > 0;
    const subtotal = this._formatMoney(cart.total_price ?? 0);

    document.querySelectorAll('[data-cart-count]').forEach((target) => {
      target.textContent = String(cart.item_count ?? 0);
    });
    document.querySelectorAll('[data-cart-subtotal]').forEach((target) => {
      target.textContent = subtotal;
    });
    document.querySelectorAll('[data-cart-lines]').forEach((target) => {
      target.hidden = !hasItems;
    });
    document.querySelectorAll('[data-cart-empty]').forEach((target) => {
      target.hidden = hasItems;
    });
  }

  _formatMoney(cents) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: this.getAttribute('currency') || 'USD'
      }).format(Number(cents) / 100);
    } catch {
      return `${(Number(cents) / 100).toFixed(2)} USD`;
    }
  }
}

class SoCartItems extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.quantityControls = Array.from(this.querySelectorAll('[data-cart-line][data-cart-quantity]'));
    this.onClick = this.onClick.bind(this);
    this.quantityControls.forEach((control) => control.addEventListener('click', this.onClick));
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.quantityControls.forEach((control) => control.removeEventListener('click', this.onClick));
    this._connected = false;
  }

  async onClick(event) {
    event.preventDefault();

    const control = event.currentTarget;
    const line = Number(control.getAttribute('data-cart-line'));
    const quantity = Math.max(0, Number(control.getAttribute('data-cart-quantity')));

    if (!line || Number.isNaN(quantity)) return;

    await this.changeLine(line, quantity);
  }

  async changeLine(line, quantity) {
    this.setBusy(true);

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity })
      });

      if (!response.ok) {
        throw new Error('Cart update failed');
      }

      const cart = await response.json();
      this.reconcileCart(cart, line, quantity);
      emit(this, 'so:cart:update', { cart, line, quantity });
    } catch (error) {
      emit(this, 'so:cart:error', { error, line, quantity });
    } finally {
      this.setBusy(false);
    }
  }

  setBusy(busy) {
    this.toggleAttribute('aria-busy', busy);
    this.quantityControls.forEach((control) => {
      control.disabled = busy;
      control.toggleAttribute('aria-busy', busy);
    });
  }

  reconcileCart(cart, line, quantity) {
    this.getCartItemRoots().forEach((root) => this.updateLineInRoot(root, cart, line, quantity));
    this.updateCartChrome(cart);
  }

  getCartItemRoots() {
    if (typeof document === 'undefined') {
      return [this];
    }

    const roots = Array.from(document.querySelectorAll('so-cart-items'));
    return roots.includes(this) ? roots : [this, ...roots];
  }

  updateLineInRoot(root, cart, line, quantity) {
    const lineItem = root.querySelector(`[data-cart-line-item][data-cart-line="${line}"]`);

    if (lineItem && quantity === 0) {
      lineItem.remove();
    } else if (lineItem) {
      const nextItem = cart.items?.[line - 1];
      const nextQuantity = nextItem?.quantity ?? quantity;
      const quantityTarget = lineItem.querySelector('[data-cart-line-quantity-value]');
      const priceTarget = lineItem.querySelector('[data-cart-line-price]');

      if (quantityTarget) {
        quantityTarget.textContent = String(nextQuantity);
      }
      if (priceTarget && nextItem) {
        this.updateLinePrice(priceTarget, nextItem);
      }
    }

    this.reindexRoot(root);
  }

  updateLinePrice(priceTarget, item) {
    const currentPrice = priceTarget.querySelector('.so-price__current') || priceTarget.querySelector('.so-price');
    const comparePrice = priceTarget.querySelector('.so-price__compare');

    if (currentPrice) {
      currentPrice.textContent = this.formatMoney(item.final_line_price);
    }

    if (comparePrice && item.original_line_price > item.final_line_price) {
      comparePrice.textContent = this.formatMoney(item.original_line_price);
    }
  }

  reindexRoot(root) {
    const lineItems = Array.from(root.querySelectorAll('[data-cart-line-item]'));

    lineItems.forEach((lineItem, index) => {
      const line = index + 1;
      const quantity = Number(lineItem.querySelector('[data-cart-line-quantity-value]')?.textContent) || 0;

      lineItem.setAttribute('data-cart-line', String(line));
      lineItem.querySelectorAll('[data-cart-line]').forEach((control) => {
        control.setAttribute('data-cart-line', String(line));

        if (control.hasAttribute('data-cart-quantity-decrease')) {
          const nextQuantity = Math.max(0, quantity - 1);
          control.setAttribute('data-cart-quantity', String(nextQuantity));
          control.setAttribute('value', String(nextQuantity));
        }

        if (control.hasAttribute('data-cart-quantity-increase')) {
          const nextQuantity = quantity + 1;
          control.setAttribute('data-cart-quantity', String(nextQuantity));
          control.setAttribute('value', String(nextQuantity));
        }
      });
    });
  }

  updateCartChrome(cart) {
    if (typeof document === 'undefined') return;

    const hasItems = Number(cart.item_count) > 0;
    const subtotal = this.formatMoney(cart.total_price ?? 0);

    document.querySelectorAll('[data-cart-count]').forEach((target) => {
      target.textContent = String(cart.item_count ?? 0);
    });
    document.querySelectorAll('[data-cart-subtotal]').forEach((target) => {
      target.textContent = subtotal;
    });
    document.querySelectorAll('[data-cart-lines]').forEach((target) => {
      target.hidden = !hasItems;
    });
    document.querySelectorAll('[data-cart-empty]').forEach((target) => {
      target.hidden = hasItems;
    });
    document.querySelectorAll('[data-cart-summary]').forEach((target) => {
      target.hidden = !hasItems;
    });
  }

  formatMoney(cents) {
    const currency = this.getAttribute('currency') || 'USD';

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency
      }).format(Number(cents) / 100);
    } catch {
      return `${(Number(cents) / 100).toFixed(2)} ${currency}`;
    }
  }
}

/**
 * so-predictive-search — Debounces input, fetches Shopify predictive search, renders results.
 *
 * Attributes:
 *   data-loading-text  — Status text during fetch.
 *   data-ready-text    — Status text after results render.
 *   data-empty-text    — Status text when no results.
 *   data-error-text    — Status text on failure.
 *
 * Events:
 *   so:predictive-search:results  — { query, results }
 *   so:predictive-search:error    — { query, error }
 *
 * Public API:
 *   setQuery(query)  — Set the search input value and trigger search.
 *   clear()          — Clear input and hide results.
 *   showRecent()     — Show recent searches (if configured).
 *   hideResults()    — Hide the results dropdown.
 *   query            — Current input value.
 */
class SoPredictiveSearch extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.input = this.querySelector('[data-predictive-search-input]');
    this.results = this.querySelector('[data-predictive-search-results]');
    this.status = this.querySelector('[data-predictive-search-status]');
    this.scheduledSearch = debounce(() => this.search(), 200);

    this.onInput = () => this.scheduleSearch();
    this.onKeydown = (e) => this.handleKeydown(e);
    this.onFocus = () => {
      if (this.input?.value?.trim()) this.search();
    };

    this.input?.addEventListener('input', this.onInput);
    this.input?.addEventListener('keydown', this.onKeydown);
    this.input?.addEventListener('focus', this.onFocus);

    // Click outside closes results
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this._onDocClick.bind(this));
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.input?.removeEventListener('input', this.onInput);
    this.input?.removeEventListener('keydown', this.onKeydown);
    this.input?.removeEventListener('focus', this.onFocus);
    clearTimeout(this.searchTimer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this._onDocClick);
    }
    this._connected = false;
  }

  /** Current query value. */
  get query() {
    return this.input?.value?.trim() || '';
  }

  /** Set the search input value and trigger search. */
  setQuery(query) {
    if (this.input) {
      this.input.value = query;
      this.search();
    }
  }

  /** Clear input and hide results. */
  clear() {
    if (this.input) this.input.value = '';
    this.renderResults([]);
    this.hideResults();
  }

  /** Show recent searches (if available via data-recent attribute or localStorage). */
  showRecent() {
    let recent;
    try {
      recent = JSON.parse(localStorage.getItem('so:recent-searches') || '[]');
    } catch {
      recent = [];
    }
    if (recent.length > 0) {
      this.renderResults(recent.map((q) => ({ title: q, url: `/search?q=${encodeURIComponent(q)}`, type: 'recent' })));
      this.setStatus('ready');
    }
  }

  /** Hide the results dropdown. */
  hideResults() {
    if (this.results) {
      this.results.hidden = true;
    }
  }

  scheduleSearch() {
    clearTimeout(this.searchTimer);
    this.scheduledSearch();
  }

  async search() {
    const query = this.input?.value?.trim() || '';
    if (!query) {
      this.renderResults([]);
      this.hideResults();
      return;
    }

    this.setStatus('loading');

    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page,article`,
        { headers: { Accept: 'application/json' } }
      );

      if (!response.ok) {
        throw new Error('Predictive search failed');
      }

      const data = await response.json();
      const resources = data.resources?.results || {};
      const results = ['products', 'collections', 'pages', 'articles'].flatMap((key) => {
        const items = resources[key] || [];
        return items.map((item) => ({ ...item, type: key.slice(0, -1) }));
      });

      this.renderResults(results, query);
      this.setStatus(results.length > 0 ? 'ready' : 'empty');
      emit(this, 'so:predictive-search:results', { query, results });

      // Save to recent searches
      this._saveRecent(query);
    } catch (error) {
      this.setStatus('error');
      emit(this, 'so:predictive-search:error', { query, error });
    }
  }

  renderResults(results, query = '') {
    if (!this.results) return;

    this.results.innerHTML = results.map((result) => {
      const title = this.escapeHtml(result.title || result.handle || '');
      const url = this.escapeHtml(result.url || result.online_store_url || '#');
      const highlighted = query ? this.highlightMatch(title, query) : title;
      const typeLabel = result.type ? `<span class="so-predictive-search__type">${this.escapeHtml(result.type)}</span>` : '';
      return `<li class="so-predictive-search__item" data-type="${result.type || ''}"><a href="${url}">${highlighted}</a>${typeLabel}</li>`;
    }).join('');

    this.results.hidden = results.length === 0;

    // Set aria-activedescendant for keyboard nav
    if (results.length > 0 && this.input) {
      const firstItem = this.results.querySelector('.so-predictive-search__item');
      if (firstItem) {
        firstItem.dataset.highlighted = 'true';
        this.input.setAttribute('aria-activedescendant', firstItem.id || '');
      }
    }
  }

  /** Handle keyboard navigation within results. */
  handleKeydown(event) {
    if (!this.results || this.results.hidden) return;

    const items = Array.from(this.results.querySelectorAll('.so-predictive-search__item'));
    const activeIndex = items.findIndex((item) => item.dataset.highlighted === 'true');

    let nextIndex = activeIndex;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        break;
      case 'Enter':
        if (activeIndex >= 0) {
          event.preventDefault();
          const link = items[activeIndex].querySelector('a');
          if (link) window.location.href = link.href;
        }
        return;
      case 'Escape':
        this.hideResults();
        return;
      default:
        return;
    }

    // Update highlighted state
    items.forEach((item, i) => {
      item.dataset.highlighted = i === nextIndex ? 'true' : 'false';
    });
    if (this.input) {
      this.input.setAttribute('aria-activedescendant', items[nextIndex]?.id || '');
    }
  }

  setStatus(status) {
    this.setAttribute('data-status', status);
    if (this.status) {
      this.status.textContent = this.getAttribute(`data-${status}-text`) || '';
    }
  }

  /** Highlight matching text in the result title. */
  highlightMatch(title, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return title.replace(regex, '<mark>$1</mark>');
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

  _saveRecent(query) {
    try {
      let recent = JSON.parse(localStorage.getItem('so:recent-searches') || '[]');
      recent = [query, ...recent.filter((q) => q !== query)].slice(0, 5);
      localStorage.setItem('so:recent-searches', JSON.stringify(recent));
    } catch {
      // Storage unavailable — silently skip
    }
  }

  _onDocClick(event) {
    if (!this.contains(event.target) && this.results) {
      this.hideResults();
    }
  }
}

class SoFacets extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.onChange = () => this.apply();
    this.form?.addEventListener('change', this.onChange);
    this._connected = true;
  }

  disconnectedCallback() {
    this.form?.removeEventListener('change', this.onChange);
    this._connected = false;
  }

  apply() {
    if (!this.form || typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const formData = new FormData(this.form);
    const filterNames = [...new Set(Array.from(this.form.querySelectorAll('[name]')).map((field) => field.name))];

    filterNames.forEach((name) => url.searchParams.delete(name));
    url.searchParams.delete('page');
    for (const [name, value] of formData.entries()) {
      url.searchParams.append(name, value);
    }

    window.location.href = url.toString();
  }
}

class SoSort extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.select = this.querySelector('select[name="sort_by"]');
    this.onChange = () => this.apply();
    this.select?.addEventListener('change', this.onChange);
    this._connected = true;
  }

  disconnectedCallback() {
    this.select?.removeEventListener('change', this.onChange);
    this._connected = false;
  }

  apply() {
    if (!this.select || typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', this.select.value);
    url.searchParams.delete('page');
    window.location.href = url.toString();
  }
}

class SoQuickAdd extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.form = this.querySelector('form');
    this.submitButton = this.querySelector('[type="submit"]');
    this.quickViewTrigger = this.querySelector('[data-quick-add-open]');
    this.onSubmit = this.onSubmit.bind(this);
    this.onQuickViewClick = (event) => this.openQuickView(event);
    this.form?.addEventListener('submit', this.onSubmit);
    this.quickViewTrigger?.addEventListener('click', this.onQuickViewClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.form?.removeEventListener('submit', this.onSubmit);
    this.quickViewTrigger?.removeEventListener('click', this.onQuickViewClick);
    this._connected = false;
  }

  async onSubmit(event) {
    if (this.hasAttribute('requires-options')) {
      this.openQuickView(event);
      return;
    }

    if (!this.hasAttribute('ajax') || !this.form) return;

    event.preventDefault();
    this.setBusy(true);

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this.form)
      });

      if (!response.ok) {
        throw new Error('Quick add failed');
      }

      const item = await response.json();
      emit(this, 'so:cart:add', { item });
    } catch (error) {
      emit(this, 'so:cart:error', { error });
    } finally {
      this.setBusy(false);
    }
  }

  openQuickView(event) {
    event.preventDefault();
    emit(this, 'so:quick-view:open', { productUrl: this.getAttribute('product-url') });
  }

  setBusy(busy) {
    this.toggleAttribute('aria-busy', busy);
    if (this.submitButton) {
      this.submitButton.disabled = busy;
      this.submitButton.toggleAttribute('aria-busy', busy);
    }
  }
}

/**
 * so-carousel — Horizontal carousel with dots, keyboard nav, drag/swipe, autoplay.
 *
 * Attributes:
 *   autoplay       — Auto-advance slides (ms interval, default 5000).
 *   pause-on-hover — Pause autoplay on hover.
 *   per-page       — Items visible at once (default: auto-fit).
 *
 * Events:
 *   so:carousel:change  — { from, to, index }
 *   so:carousel:play    — When autoplay starts.
 *   so:carousel:pause   — When autoplay stops.
 *
 * Public API:
 *   goTo(index)    — Navigate to slide index.
 *   next()         — Go to next slide.
 *   prev()         — Go to previous slide.
 *   play()         — Start autoplay.
 *   pause()        — Stop autoplay.
 *   setPerPage(n)  — Update items per page.
 *   currentIndex   — Read-only current slide index.
 *   pageCount      — Read-only total slide count.
 */
class SoCarousel extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.track = this.querySelector('[data-carousel-track]');
    this.prevButton = this.querySelector('[data-carousel-prev]');
    this.nextButton = this.querySelector('[data-carousel-next]');
    this.dotsContainer = this.querySelector('[data-carousel-dots]');

    // Bind handlers so we can remove them later
    this.onPrevClick = () => this.prev();
    this.onNextClick = () => this.next();
    this.onScroll = () => this.syncUI();
    this.onKeydown = (e) => this.handleKeydown(e);
    this.onPointerDown = (e) => this.handlePointerDown(e);
    this.onPointerMove = (e) => this.handlePointerMove(e);
    this.onPointerUp = () => this.handlePointerUp();

    // Attach listeners
    this.prevButton?.addEventListener('click', this.onPrevClick);
    this.nextButton?.addEventListener('click', this.onNextClick);
    if (this.track) {
      this.track.addEventListener('scroll', this.onScroll);
      this.track.addEventListener('keydown', this.onKeydown);
      this.track.addEventListener('pointerdown', this.onPointerDown);
    }

    // A11y
    if (this.track) {
      this.track.setAttribute('role', 'group');
      this.track.setAttribute('aria-roledescription', 'carousel');
    }

    // Hover pause
    if (typeof this.hasAttribute === 'function' && this.hasAttribute('pause-on-hover')) {
      this.addEventListener('mouseenter', () => this.pause());
      this.addEventListener('mouseleave', () => this.play());
    }

    this.generateDots();
    this.syncUI();

    // Start autoplay if attribute set
    if (typeof this.hasAttribute === 'function' && this.hasAttribute('autoplay')) {
      this.play();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.pause();
    this.prevButton?.removeEventListener('click', this.onPrevClick);
    this.nextButton?.removeEventListener('click', this.onNextClick);
    if (this.track) {
      this.track.removeEventListener('scroll', this.onScroll);
      this.track.removeEventListener('keydown', this.onKeydown);
      this.track.removeEventListener('pointerdown', this.onPointerDown);
      this.track.removeEventListener('pointermove', this.onPointerMove);
      this.track.removeEventListener('pointerup', this.onPointerUp);
    }
    this.dotsContainer?.removeEventListener('click', this.onDotClick);
    this._connected = false;
  }

  /** Read-only: current slide index. */
  get currentIndex() {
    if (!this.track || !this.track.children.length) return 0;
    const itemWidth = this.track.children[0]?.clientWidth || 1;
    return Math.round(this.track.scrollLeft / itemWidth);
  }

  /** Read-only: total slide count. */
  get pageCount() {
    return this.track?.children.length || 0;
  }

  /** Navigate to slide by index. */
  goTo(index) {
    if (!this.track || this.pageCount === 0) return;
    const clamped = Math.max(0, Math.min(index, this.pageCount - 1));
    const prevIndex = this.currentIndex;
    const target = this.track.children[clamped];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      if (clamped !== prevIndex) {
        emit(this, 'so:carousel:change', { from: prevIndex, to: clamped, index: clamped });
      }
    }
  }

  /** Go to next slide. */
  next() {
    this.goTo(this.currentIndex + 1);
  }

  /** Go to previous slide. */
  prev() {
    this.goTo(this.currentIndex - 1);
  }

  /** Start autoplay. */
  play() {
    if (this._autoplayTimer) return;
    const delay = Number(this.getAttribute('autoplay')) || 5000;
    this._autoplayTimer = setInterval(() => this.next(), delay);
    emit(this, 'so:carousel:play', { delay });
  }

  /** Stop autoplay. */
  pause() {
    if (this._autoplayTimer) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
      emit(this, 'so:carousel:pause', {});
    }
  }

  /** Set items per page (affects grid-auto-columns). */
  setPerPage(n) {
    if (!this.track) return;
    this.track.style.gridAutoColumns = `minmax(${100 / n}%, 1fr)`;
    this.syncUI();
  }

  syncUI() {
    this.updateButtons();
    this.updateDots();
  }

  updateButtons() {
    if (!this.track) return;
    const atStart = this.track.scrollLeft <= 2;
    const atEnd = this.track.scrollLeft + this.track.clientWidth >= this.track.scrollWidth - 2;
    if (this.prevButton) {
      this.prevButton.disabled = atStart;
    }
    if (this.nextButton) {
      this.nextButton.disabled = atEnd;
    }
  }

  generateDots() {
    if (this.dotsContainer) {
      // User provided their own dots container, just wire up clicks
      this.onDotClick = (e) => {
        const dot = e.target.closest('[data-carousel-dot]');
        if (dot) this.goTo(Number(dot.dataset.carouselDot));
      };
      this.dotsContainer.addEventListener('click', this.onDotClick);
      return;
    }
    if (!this.track || this.pageCount === 0) return;

    const dots = document.createElement('div');
    dots.className = 'so-carousel__dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Carousel navigation');

    for (let i = 0; i < this.pageCount; i++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'so-carousel__dot';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-label', `Go to slide ${i + 1}`);
      button.setAttribute('aria-controls', `slide-${i}`);
      button.dataset.carouselDot = i;
      // Set ID on the slide for aria-controls
      const slide = this.track.children[i];
      if (slide && !slide.id) slide.id = `slide-${i}`;
      dots.appendChild(button);
    }

    this.track.after(dots);
    this.dotsContainer = dots;

    this.onDotClick = (e) => {
      const dot = e.target.closest('[data-carousel-dot]');
      if (dot) this.goTo(Number(dot.dataset.carouselDot));
    };
    this.dotsContainer.addEventListener('click', this.onDotClick);
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('[data-carousel-dot]');
    dots.forEach((dot, i) => {
      const active = i === this.currentIndex;
      dot.setAttribute('aria-current', active ? 'true' : 'false');
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.goTo(this.pageCount - 1);
    }
  }

  handlePointerDown(event) {
    if (event.button !== 0) return;
    this._dragStartX = event.clientX;
    this._dragStartScrollLeft = this.track.scrollLeft;
    this._isDragging = true;
    this.track.setPointerCapture(event.pointerId);
    this.track.addEventListener('pointermove', this.onPointerMove);
    this.track.addEventListener('pointerup', this.onPointerUp);
  }

  handlePointerMove(event) {
    if (!this._isDragging) return;
    const dx = event.clientX - this._dragStartX;
    this.track.scrollLeft = this._dragStartScrollLeft - dx;
  }

  handlePointerUp() {
    this._isDragging = false;
    this.track?.removeEventListener('pointermove', this.onPointerMove);
    this.track?.removeEventListener('pointerup', this.onPointerUp);
  }
}

/**
 * so-quick-view — Opens from so:quick-view:open, manages open/close state with ESC.
 *
 * Attributes:
 *   open        — Reflects visible quick view state.
 *   product-url — Set when opened with a product URL.
 *
 * Events:
 *   so:quick-view:open   — Internal (consumed by this element).
 *   so:quick-view:opened — When quick view opens (bubbles to document).
 *   so:quick-view:closed — When quick view closes.
 *
 * Public API:
 *   open(url?)       — Open with optional product URL.
 *   close()          — Close the quick view.
 *   toggle(url?)     — Toggle open state.
 *   setContent(html) — Replace content inside data-quick-view-content.
 */
class SoQuickView extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.closeButtons = Array.from(this.querySelectorAll('[data-quick-view-close]'));
    this.content = this.querySelector('[data-quick-view-content]');
    this.panel = this.querySelector('[data-quick-view-panel]') || this;
    this.onOpen = (event) => this.open(event.detail?.productUrl);
    this.onClose = this.close.bind(this);

    this.closeButtons.forEach((button) => button.addEventListener('click', this.onClose));

    // Click on backdrop closes
    if (typeof this.addEventListener === 'function') {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.close();
      });
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('so:quick-view:open', this.onOpen);
      document.addEventListener('keydown', this);
    }

    if (this.hasAttribute('open')) {
      this._lockBody();
      this._trapFocus();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.closeButtons.forEach((button) => button.removeEventListener('click', this.onClose));
    if (typeof document !== 'undefined') {
      document.removeEventListener('so:quick-view:open', this.onOpen);
      document.removeEventListener('keydown', this);
    }

    this._cleanupFocus?.();
    this._unlockBody();
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  /** Open the quick view with optional product URL. */
  open(productUrl) {
    if (this.isOpen()) return;
    this.setAttribute('open', '');
    if (productUrl) {
      this.setAttribute('product-url', productUrl);
    }
    this._lockBody();
    this._trapFocus();
    emit(this, 'so:quick-view:opened', { productUrl });
  }

  /** Close the quick view. */
  close() {
    if (!this.isOpen()) return;
    this.removeAttribute('open');
    this._unlockBody();
    this._cleanupFocus?.();
    this.dispatchEvent(new CustomEvent('so:quick-view:closed', { bubbles: true }));
  }

  /** Toggle open state. */
  toggle(productUrl) {
    this.isOpen() ? this.close() : this.open(productUrl);
  }

  /** Replace inner content of the data-quick-view-content region. */
  setContent(html) {
    if (this.content) {
      this.content.innerHTML = html;
    }
  }

  _lockBody() {
    document.body?.classList?.add('so-body-locked');
  }

  _unlockBody() {
    document.body?.classList?.remove('so-body-locked');
  }

  _trapFocus() {
    const root = this.panel || this;
    if (typeof root?.querySelectorAll !== 'function') return;
    const focusable = Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((el) => !el.closest('[hidden]'));
    if (focusable.length === 0) return;

    const restoreFocus = rememberFocus();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onKeydown = (event) => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    root.addEventListener('keydown', onKeydown);
    first.focus();

    this._cleanupFocus = () => {
      root.removeEventListener('keydown', onKeydown);
      restoreFocus();
      this._cleanupFocus = null;
    };
  }
}

/**
 * so-product-card — Semantic product card with media click and product URL helpers.
 *
 * Attributes:
 *   product-id   — Optional product identifier.
 *
 * Events:
 *   so:card:media-click  — When the media area is clicked (bubbles).
 *   so:card:wishlist     — When the wishlist toggle is clicked (bubbles).
 *
 * Public API:
 *   getProductUrl()   — Returns the product URL from title/media/link.
 *   getProductId()    — Returns the product-id attribute or data-product-id.
 *   showBadge(type)   — Show a badge (sale, new, sold-out).
 *   hideBadge()       — Hide the badge.
 *   toggleWishlist()  — Toggle wishlist state.
 */
class SoProductCard extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.link = this.querySelector('a[href]');
    this.mediaLink = this.querySelector('[data-product-card-media]');
    this.titleLink = this.querySelector('[data-product-card-title] a, .so-card__title a');

    // Fix: store bound handler for proper removal in disconnectedCallback
    this._onMediaClick = this._onMediaClick.bind(this);

    if (this.mediaLink) {
      this.mediaLink.addEventListener('click', this._onMediaClick);
    }

    // Wishlist button
    this.wishlistButton = this.querySelector('[data-wishlist-toggle]');
    if (this.wishlistButton) {
      this._onWishlistClick = this._onWishlistClick.bind(this);
      this.wishlistButton.addEventListener('click', this._onWishlistClick);
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    if (this.mediaLink) {
      this.mediaLink.removeEventListener('click', this._onMediaClick);
    }
    if (this.wishlistButton) {
      this.wishlistButton.removeEventListener('click', this._onWishlistClick);
    }
    this._connected = false;
  }

  _onMediaClick(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('so:card:media-click', {
      bubbles: true,
      detail: { url: this.getProductUrl() }
    }));
    this.navigateToProduct();
  }

  _onWishlistClick(event) {
    event.preventDefault();
    this.toggleWishlist();
    this.dispatchEvent(new CustomEvent('so:card:wishlist', {
      bubbles: true,
      detail: { productId: this.getProductId(), wished: this._isWished() }
    }));
  }

  navigateToProduct() {
    const url = this.getProductUrl();
    if (url && typeof window !== 'undefined') {
      window.location.href = url;
    }
  }

  /** Get the product URL from title link, media link, or first anchor. */
  getProductUrl() {
    if (this.titleLink?.href) return this.titleLink.href;
    if (this.mediaLink?.href) return this.mediaLink.href;
    if (this.link?.href) return this.link.href;
    return null;
  }

  /** Get the product ID from attribute or data-product-id. */
  getProductId() {
    return this.getAttribute('product-id') || this.dataset.productId || null;
  }

  /** Show a badge on the card media. Type: "sale", "new", "sold-out", or custom. */
  showBadge(type = 'sale', text) {
    let badge = this.querySelector('.so-card__badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'so-card__badge';
      const media = this.querySelector('.so-card__media');
      if (media) media.appendChild(badge);
    }
    badge.textContent = text || this._badgeText(type);
    badge.className = `so-card__badge so-badge so-badge--${type === 'sold-out' ? 'error' : type === 'new' ? 'success' : 'warning'}`;
  }

  /** Hide the badge. */
  hideBadge() {
    this.querySelector('.so-card__badge')?.remove();
  }

  /** Toggle wishlist state. */
  toggleWishlist() {
    if (!this.wishlistButton) return;
    const wished = this._isWished();
    this.wishlistButton.setAttribute('aria-pressed', String(!wished));
    this.wishlistButton.dataset.wished = String(!wished);
  }

  _isWished() {
    return this.wishlistButton?.getAttribute('aria-pressed') === 'true';
  }

  _badgeText(type) {
    const labels = { sale: 'Sale', new: 'New', 'sold-out': 'Sold Out' };
    return labels[type] || type;
  }
}

/**
 * so-swatches — Manages pressed state for swatch buttons and emits selected value.
 *
 * Attributes:
 *   name  — Group name for radio-style selection (for a11y).
 *
 * Events:
 *   so:swatch:change  — { value, element }
 *
 * Public API:
 *   value              — Currently selected swatch value.
 *   setValue(val)      — Select a swatch by value.
 *   setOptions([...])  — Replace all swatch options.
 *   selectedIndex      — Index of the currently selected swatch.
 */
class SoSwatches extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.swatches = Array.from(this.querySelectorAll('[data-swatch-value]'));
    this.onKeydown = this._onKeydown.bind(this);
    this.swatches.forEach((swatch) => swatch.addEventListener('click', this._onClick.bind(this)));
    this.addEventListener('keydown', this.onKeydown);

    this._connected = true;
  }

  disconnectedCallback() {
    this.swatches?.forEach((swatch) => swatch.removeEventListener('click', this._onClick));
    this.removeEventListener('keydown', this.onKeydown);
    this._connected = false;
  }

  _onClick(event) {
    const swatch = event.currentTarget;
    this.select(swatch);
  }

  /** Keyboard: ArrowLeft/ArrowUp/ArrowRight/ArrowDown to navigate swatches. */
  _onKeydown(event) {
    const index = this.swatches.indexOf(event.target);
    if (index === -1) return;

    const perRow = this._getPerRow();
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % this.swatches.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + this.swatches.length) % this.swatches.length;
        break;
      case 'ArrowDown':
        nextIndex = (index + perRow) % this.swatches.length;
        break;
      case 'ArrowUp':
        nextIndex = (index - perRow + this.swatches.length) % this.swatches.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = this.swatches.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.swatches[nextIndex].focus();
    this.select(this.swatches[nextIndex]);
  }

  /** Select a swatch element. */
  select(swatch) {
    if (!swatch) return;
    this.swatches.forEach((s) => {
      s.setAttribute('aria-pressed', s === swatch ? 'true' : 'false');
    });
    emit(this, 'so:swatch:change', {
      value: swatch.getAttribute('data-swatch-value'),
      element: swatch
    });
  }

  /** Currently selected swatch value. */
  get value() {
    const selected = this.swatches.find((s) => s.getAttribute('aria-pressed') === 'true');
    return selected?.getAttribute('data-swatch-value') || null;
  }

  /** Select a swatch by value string. */
  setValue(val) {
    const match = this.swatches.find((s) => s.getAttribute('data-swatch-value') === val);
    if (match) this.select(match);
  }

  /** Replace all swatch options. Each option: { value, label, color, image? }. */
  setOptions(options) {
    this.swatches.forEach((s) => s.remove());
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'so-swatches__swatch';
      btn.dataset.swatchValue = opt.value;
      btn.setAttribute('aria-pressed', String(opt.selected || false));
      if (opt.color) {
        btn.style.setProperty('--so-swatch', opt.color);
      }
      btn.textContent = opt.label || opt.value;
      this.appendChild(btn);
    });
    this.swatches = Array.from(this.querySelectorAll('[data-swatch-value]'));
    this.swatches.forEach((swatch) => swatch.addEventListener('click', this._onClick.bind(this)));
  }

  /** Index of the currently selected swatch. */
  get selectedIndex() {
    return this.swatches.findIndex((s) => s.getAttribute('aria-pressed') === 'true');
  }

  /** Estimate items per row (for keyboard nav). */
  _getPerRow() {
    if (this.swatches.length <= 1) return 1;
    const first = this.swatches[0];
    if (!first) return 1;
    const containerWidth = this.clientWidth;
    const itemWidth = first.offsetWidth || containerWidth / this.swatches.length;
    return Math.max(1, Math.round(containerWidth / itemWidth));
  }
}

/**
 * so-infinite-list — Fetches next page HTML, appends items, updates next link.
 *
 * Attributes:
 *   ajax          — Enables fetch instead of normal link navigation.
 *   aria-busy     — Set while fetch is pending.
 *   auto          — Enables IntersectionObserver scroll-triggered loading.
 *
 * Events:
 *   so:infinite-list:load  — After new items are appended.
 *   so:infinite-list:error — On fetch failure.
 *   so:infinite-list:end   — When no more pages exist.
 *
 * Public API:
 *   loadNext()    — Load the next page.
 *   reset()       — Clear loaded items and reset state.
 *   isLoading     — Read-only boolean.
 */
class SoInfiniteList extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.nextLink = this.querySelector('[data-infinite-next]');
    this.itemsContainer = this.querySelector('[data-infinite-items]');
    this.skeletonTemplate = this.querySelector('[data-infinite-skeleton]');
    this.onClick = (event) => this.loadMore(event);

    this.nextLink?.addEventListener('click', this.onClick);

    // Auto-load via IntersectionObserver
    if (this.hasAttribute('auto')) {
      this._setupObserver();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.nextLink?.removeEventListener('click', this.onClick);
    this._observer?.disconnect();
    this._connected = false;
  }

  /** Whether a load is currently in progress. */
  get isLoading() {
    return this.hasAttribute('aria-busy');
  }

  /** Load the next page programmatically. */
  async loadNext() {
    if (!this.nextLink || this.isLoading) return;
    await this._fetchAndAppend(this.nextLink.href);
  }

  /** Reset to initial state (clears loaded items). */
  reset() {
    if (this.itemsContainer) {
      const initial = this.itemsContainer.querySelectorAll('[data-infinite-item]');
      initial.forEach((item) => item.remove());
    }
    this.removeAttribute('aria-busy');
  }

  async loadMore(event) {
    if (!this.hasAttribute('ajax') || !this.nextLink) return;

    event.preventDefault();
    await this._fetchAndAppend(this.nextLink.href);
  }

  async _fetchAndAppend(url) {
    this.toggleAttribute('aria-busy', true);

    try {
      const response = await fetch(url, { headers: { Accept: 'text/html' } });
      if (!response.ok) {
        throw new Error(`Load more failed (${response.status})`);
      }

      const html = await response.text();
      this.appendContent(html);
      this.dispatchEvent(new CustomEvent('so:infinite-list:load', { bubbles: true }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('so:infinite-list:error', {
        bubbles: true,
        detail: { error }
      }));
    } finally {
      this.toggleAttribute('aria-busy', false);
    }
  }

  appendContent(html) {
    if (!this.itemsContainer) {
      this.insertAdjacentHTML('beforeend', html);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const productItems = doc.querySelectorAll('[data-infinite-item]');
    if (productItems.length > 0) {
      productItems.forEach((item) => {
        this.itemsContainer.appendChild(item);
      });
    } else {
      const fragment = doc.createDocumentFragment();
      while (doc.body.firstChild) {
        fragment.appendChild(doc.body.firstChild);
      }
      this.itemsContainer.appendChild(fragment);
    }

    this.updateNextLink(doc);
  }

  updateNextLink(doc) {
    const nextLink = doc.querySelector('[data-infinite-next]');
    if (this.nextLink) {
      if (nextLink && nextLink.href) {
        this.nextLink.href = nextLink.href;
        this.nextLink.hidden = false;
      } else {
        this.nextLink.remove();
        this.nextLink = null;
        this.dispatchEvent(new CustomEvent('so:infinite-list:end', { bubbles: true }));
      }
    }
  }

  _setupObserver() {
    const sentinel = this.querySelector('[data-infinite-sentinel]') || this.nextLink;
    if (!sentinel) return;

    this._observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading && this.nextLink) {
        this.loadNext();
      }
    }, { rootMargin: '200px' });

    this._observer.observe(sentinel);
  }
}

class SoDeferredMedia extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.button = this.querySelector('[data-deferred-media-load]');
    this.template = this.querySelector('template');
    this.onClick = () => this.load();
    this.button?.addEventListener('click', this.onClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.onClick);
    this._connected = false;
  }

  load() {
    if (!this.template) return;

    this.append(this.template.content.cloneNode(true));
    this.setAttribute('loaded', '');
    this.button?.remove();
  }
}

class SoRecipientForm extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.toggle = this.querySelector('[data-recipient-toggle]');
    this.fields = this.querySelector('[data-recipient-fields]');
    this.onChange = () => this.sync();
    this.toggle?.addEventListener('change', this.onChange);
    this.sync();
    this._connected = true;
  }

  disconnectedCallback() {
    this.toggle?.removeEventListener('change', this.onChange);
    this._connected = false;
  }

  sync() {
    if (this.fields) {
      this.fields.hidden = !this.toggle?.checked;
    }
  }
}

class SoPickupAvailability extends HTMLElement {
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

class SoShare extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.button = this.querySelector('[data-share-button]');
    this.onClick = () => this.share();
    this.button?.addEventListener('click', this.onClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.onClick);
    this._connected = false;
  }

  async share() {
    const url = this.getAttribute('url') || globalThis.location?.href || '';
    const title = this.getAttribute('title') || globalThis.document?.title || '';

    try {
      if (globalThis.navigator?.share) {
        await globalThis.navigator.share({ title, url });
      } else if (globalThis.navigator?.clipboard) {
        await globalThis.navigator.clipboard.writeText(url);
      }
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'NotAllowedError') return;
      emit(this, 'so:share:error', { error });
    }
  }
}

/**
 * so-price — Price display with compare-at, sale badge, and per-unit.
 *
 * Attributes:
 *   price          — Price in cents (required).
 *   compare-at     — Original price in cents (shows as crossed-out).
 *   currency       — ISO currency code (default: USD).
 *   per-unit       — Per-unit text (e.g., "/oz", "/ea").
 *   show-badge     — Show "Sale" badge when compare-at > price.
 *
 * Events:
 *   so:price:render  — { price, compareAt, currency, onSale }
 *
 * Public API:
 *   setPrice(cents, compareAt?)  — Update price display.
 *   isOnSale                     — Whether compare-at > price.
 */
class SoPrice extends HTMLElement {
  static observedAttributes = ['price', 'compare-at', 'currency', 'per-unit', 'show-badge'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Set price in cents with optional compare-at. */
  setPrice(cents, compareAt) {
    this.setAttribute('price', String(cents));
    if (compareAt !== undefined) {
      this.setAttribute('compare-at', String(compareAt));
    }
    this.render();
  }

  /** Whether this price is on sale. */
  get isOnSale() {
    const price = Number(this.getAttribute('price')) || 0;
    const compareAt = Number(this.getAttribute('compare-at')) || 0;
    return compareAt > price && price > 0;
  }

  render() {
    const price = Number(this.getAttribute('price')) || 0;
    const compareAt = Number(this.getAttribute('compare-at')) || 0;
    const currency = this.getAttribute('currency') || 'USD';
    const perUnit = this.getAttribute('per-unit') || '';
    const showBadge = this.hasAttribute('show-badge');
    const onSale = compareAt > price && price > 0;

    const formatted = this.formatMoney(price, currency);
    const formattedCompare = compareAt > 0 ? this.formatMoney(compareAt, currency) : null;

    let html = `<span class="so-price">`;
    if (onSale) {
      if (showBadge) {
        const discount = Math.round(((compareAt - price) / compareAt) * 100);
        html += `<span class="so-price__sale-badge">-${discount}%</span> `;
      }
      html += `<span class="so-price__current">${formattedCompare}</span>`;
      html += ` <span class="so-price__current" style="color:var(--so-color-error)">${formatted}</span>`;
    } else {
      html += `<span class="so-price__current">${formatted}</span>`;
      if (formattedCompare) {
        html += ` <span class="so-price__compare">${formattedCompare}</span>`;
      }
    }
    if (perUnit) {
      html += ` <span class="so-price__unit">${this.escapeHtml(perUnit)}</span>`;
    }
    html += `</span>`;

    this.innerHTML = html;

    emit(this, 'so:price:render', {
      price,
      compareAt,
      currency,
      onSale
    });
  }

  formatMoney(cents, currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency
      }).format(cents / 100);
    } catch {
      return `${(cents / 100).toFixed(2)} ${currency}`;
    }
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }
}

/**
 * so-rating — Star rating display and interactive input.
 *
 * Attributes:
 *   value          — Current rating (0-5, decimal allowed).
 *   max            — Max stars (default 5).
 *   interactive    — Allow clicking to set rating.
 *   show-count     — Show review count.
 *   count          — Review count.
 *
 * Events:
 *   so:rating:change  — { value, count }
 *
 * Public API:
 *   value       — Current rating value.
 *   setValue(n) — Set rating.
 */
class SoRating extends HTMLElement {
  static observedAttributes = ['value', 'max', 'count'];

  connectedCallback() {
    if (this._connected) return;

    if (this.hasAttribute('interactive')) {
      this.addEventListener('click', this._onClick.bind(this));
      this.addEventListener('keydown', this._onKeydown.bind(this));
    }

    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Get/set current value. */
  get value() {
    return Number(this.getAttribute('value')) || 0;
  }

  set value(n) {
    this.setAttribute('value', String(n));
  }

  setValue(n) {
    this.setAttribute('value', String(n));
    this.render();
  }

  render() {
    const value = this.value;
    const max = Number(this.getAttribute('max')) || 5;
    const count = Number(this.getAttribute('count')) || 0;
    const interactive = this.hasAttribute('interactive');

    let html = `<span class="so-rating" role="${interactive ? 'radiogroup' : 'img'}" aria-label="Rating: ${value} out of ${max} stars">`;

    for (let i = 1; i <= max; i++) {
      const filled = value >= i;
      const half = !filled && value >= i - 0.5;
      const state = filled ? 'true' : 'false';

      if (interactive) {
        html += `<svg class="so-rating__star" data-rating-star="${i}" role="radio" aria-checked="${state}" tabindex="${i === Math.ceil(value) ? 0 : -1}" viewBox="0 0 24 24" fill="${filled || half ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
      } else {
        html += `<svg class="so-rating__star" aria-hidden="true" viewBox="0 0 24 24" fill="${filled || half ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
      }
    }

    if (count > 0 || this.hasAttribute('show-count')) {
      html += `<span class="so-rating__count">(${count})</span>`;
    }

    html += `</span>`;
    this.innerHTML = html;
  }

  _onClick(event) {
    const star = event.target.closest('[data-rating-star]');
    if (star) {
      const value = Number(star.dataset.ratingStar);
      this.setAttribute('value', String(value));
      this.render();
      emit(this, 'so:rating:change', { value, max: this.getAttribute('max') || 5 });
    }
  }

  _onKeydown(event) {
    const current = Math.ceil(this.value);
    const max = Number(this.getAttribute('max')) || 5;
    let next = current;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      next = Math.min(current + 1, max);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      next = Math.max(current - 1, 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      next = 1;
    } else if (event.key === 'End') {
      event.preventDefault();
      next = max;
    } else {
      return;
    }

    this.setAttribute('value', String(next));
    this.render();
    emit(this, 'so:rating:change', { value: next, max });
  }
}

/**
 * so-pagination — Page navigation with ellipsis support.
 *
 * Attributes:
 *   current   — Current page number (required).
 *   total     — Total pages.
 *   href      — URL template with {page} placeholder (e.g., "/collections/all?page={page}").
 *   show-edges — Number of edge pages to show (default 2).
 *
 * Events:
 *   so:pagination:change  — { page }
 *
 * Public API:
 *   currentPage  — Current page.
 *   totalPages   — Total pages.
 *   goTo(page)   — Navigate to page.
 */
class SoPagination extends HTMLElement {
  static observedAttributes = ['current', 'total', 'href'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  get currentPage() {
    return Number(this.getAttribute('current')) || 1;
  }

  get totalPages() {
    return Number(this.getAttribute('total')) || 1;
  }

  /** Navigate to a page. */
  goTo(page) {
    const clamped = Math.max(1, Math.min(page, this.totalPages));
    this.setAttribute('current', String(clamped));
    this.dispatchEvent(new CustomEvent('so:pagination:change', {
      bubbles: true,
      detail: { page: clamped }
    }));

    // Navigate if href template provided
    const href = this.getAttribute('href');
    if (href && typeof window !== 'undefined') {
      window.location.href = href.replace('{page}', String(clamped));
    }
  }

  render() {
    const current = this.currentPage;
    const total = this.totalPages;
    const showEdges = Number(this.getAttribute('show-edges')) || 2;
    const href = this.getAttribute('href') || '?page={page}';

    if (total <= 1) {
      this.innerHTML = '';
      return;
    }

    const pages = this._generatePages(current, total, showEdges);
    const hrefTpl = (p) => href.replace('{page}', String(p));

    let html = `<ul class="so-pagination" role="navigation" aria-label="Pagination">`;

    // Previous button
    html += `<li><a class="so-pagination__link" href="${current > 1 ? hrefTpl(current - 1) : '#'}" ${current <= 1 ? 'disabled aria-disabled="true"' : ''} aria-label="Previous page">&laquo;</a></li>`;

    for (const page of pages) {
      if (page === '...') {
        html += `<li><span class="so-pagination__ellipsis" aria-hidden="true">…</span></li>`;
      } else {
        const isCurrent = page === current;
        html += `<li><a class="so-pagination__link" href="${hrefTpl(page)}" ${isCurrent ? `aria-current="page"` : ''} data-page="${page}">${page}</a></li>`;
      }
    }

    // Next button
    html += `<li><a class="so-pagination__link" href="${current < total ? hrefTpl(current + 1) : '#'}" ${current >= total ? 'disabled aria-disabled="true"' : ''} aria-label="Next page">&raquo;</a></li>`;

    html += `</ul>`;
    this.innerHTML = html;

    // Wire up clicks
    this.querySelectorAll('[data-page]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.goTo(Number(link.dataset.page));
      });
    });
  }

  _generatePages(current, total, edges) {
    const pages = [];
    const showLeft = Math.max(1, current - edges);
    const showRight = Math.min(total, current + edges);
    const showMiddle = [];

    for (let i = showLeft; i <= showRight; i++) {
      showMiddle.push(i);
    }

    // Add left edge + ellipsis
    for (let i = 1; i < showLeft; i++) {
      pages.push(i);
    }
    if (showLeft > 1) pages.push('...');

    // Middle
    pages.push(...showMiddle);

    // Ellipsis + right edge
    if (showRight < total) pages.push('...');
    for (let i = showRight + 1; i <= total; i++) {
      pages.push(i);
    }

    return pages;
  }
}

/**
 * so-breadcrumb — Breadcrumb navigation with ARIA support.
 *
 * Public API:
 *   setItems([{ label, url, current? }])  — Set breadcrumb items.
 *   items                                  — Current items array.
 */
class SoBreadcrumb extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  /** Set items and re-render. Each item: { label, url?, current? }. */
  setItems(items) {
    this._items = items;
    this.render();
  }

  get items() {
    return this._items || [];
  }

  render() {
    const items = this._items || this._parseChildren();
    if (items.length === 0) {
      this.innerHTML = '';
      return;
    }

    let html = `<ol class="so-breadcrumb" aria-label="Breadcrumb">`;
    items.forEach((item, i) => {
      const isLast = i === items.length - 1;
      html += `<li class="so-breadcrumb__item" ${isLast ? 'aria-current="page"' : ''}>`;
      if (item.url && !isLast) {
        html += `<a class="so-breadcrumb__link" href="${this.escapeHtml(item.url)}">${this.escapeHtml(item.label)}</a>`;
      } else {
        html += `<span class="so-breadcrumb__current">${this.escapeHtml(item.label)}</span>`;
      }
      html += `</li>`;
    });
    html += `</ol>`;

    this.innerHTML = html;
  }

  /** Parse children into items if setItems wasn't called. */
  _parseChildren() {
    const items = [];
    this.querySelectorAll('[data-breadcrumb-item]').forEach((el) => {
      items.push({
        label: el.dataset.breadcrumbLabel || el.textContent?.trim() || '',
        url: el.dataset.breadcrumbUrl || null,
        current: el.hasAttribute('data-breadcrumb-current')
      });
    });
    return items;
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }
}

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
class SoCountdown extends HTMLElement {
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

/**
 * so-stock-indicator — Stock level display with color coding.
 *
 * Attributes:
 *   level       — Stock quantity (0 = out, 1-10 = low, 11+ = in).
 *   low-threshold — Threshold for "low stock" (default 10).
 *
 * Events:
 *   so:stock:check  — { level, state }
 *
 * Public API:
 *   level      — Stock quantity.
 *   state      — "in-stock", "low-stock", or "out-of-stock".
 *   setLevel(n) — Update stock level.
 */
class SoStockIndicator extends HTMLElement {
  static observedAttributes = ['level'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Get/set stock level. */
  get level() {
    return Number(this.getAttribute('level')) || 0;
  }

  set level(n) {
    this.setAttribute('level', String(n));
  }

  setLevel(n) {
    this.setAttribute('level', String(n));
  }

  /** Current state: "in-stock", "low-stock", or "out-of-stock". */
  get state() {
    const level = this.level;
    const threshold = Number(this.getAttribute('low-threshold')) || 10;
    if (level <= 0) return 'out-of-stock';
    if (level <= threshold) return 'low-stock';
    return 'in-stock';
  }

  render() {
    const level = this.level;
    const state = this.state;
    const threshold = Number(this.getAttribute('low-threshold')) || 10;

    const messages = {
      'in-stock': this.getAttribute('in-stock-text') || 'In stock',
      'low-stock': this.getAttribute('low-stock-text') || `Only ${level} left`,
      'out-of-stock': this.getAttribute('out-of-stock-text') || 'Out of stock'
    };

    this.setAttribute('class', `so-stock-indicator so-stock-indicator--${state}`);

    this.innerHTML = `
      <span class="so-stock-indicator__dot" aria-hidden="true"></span>
      <span class="so-stock-indicator__text">${messages[state]}</span>
    `;

    emit(this, 'so:stock:check', { level, state });
  }
}

/**
 * so-progress-bar — Progress bar for stock levels, free shipping threshold, etc.
 *
 * Attributes:
 *   value   — Current value (0-100 or absolute number).
 *   max     — Maximum value (default 100).
 *   label   — Accessible label.
 *   color   — "default", "success", "warning", "error".
 *
 * Events:
 *   so:progress:change  — { value, max, percent }
 *
 * Public API:
 *   percent    — Current percentage (0-100).
 *   setValue(n) — Update value.
 *   setMax(n)   — Update max.
 */
class SoProgressBar extends HTMLElement {
  static observedAttributes = ['value', 'max'];

  connectedCallback() {
    if (this._connected) return;
    this.render();
    this._connected = true;
  }

  attributeChangedCallback() {
    if (this._connected) this.render();
  }

  /** Current value. */
  get value() {
    return Number(this.getAttribute('value')) || 0;
  }

  /** Current max. */
  get max() {
    return Number(this.getAttribute('max')) || 100;
  }

  /** Current percentage. */
  get percent() {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  setValue(n) {
    this.setAttribute('value', String(n));
  }

  setMax(n) {
    this.setAttribute('max', String(n));
  }

  render() {
    const percent = this.percent;
    const color = this.getAttribute('color') || 'default';
    const label = this.getAttribute('label') || 'Progress';
    const colorClass = color !== 'default' ? ` so-progress-bar__fill--${color}` : '';
    const showText = this.hasAttribute('show-text');

    this.innerHTML = `
      <div class="so-progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}">
        <div class="so-progress-bar__fill${colorClass}" style="width:${percent}%"></div>
      </div>
      ${showText ? `<span class="so-progress-bar__text">${Math.round(percent)}%</span>` : ''}
    `;

    this.dispatchEvent(new CustomEvent('so:progress:change', {
      bubbles: true,
      detail: { value: this.value, max: this.max, percent }
    }));
  }
}

/**
 * so-announcement-bar — Top banner with dismiss and optional carousel.
 *
 * Attributes:
 *   dismissible    — Show dismiss button.
 *   auto-rotate    — Rotate through multiple announcements (ms interval).
 *   storage-key    — localStorage key for dismissed state (default: "so:announcement").
 *
 * Events:
 *   so:announcement:dismiss  — When dismissed.
 *   so:announcement:rotate   — When rotating to next message.
 *
 * Public API:
 *   dismiss()       — Dismiss and remember.
 *   show()          — Show the bar.
 *   isDismissed()   — Check if dismissed.
 */
class SoAnnouncementBar extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    // Check if previously dismissed
    if (this.hasAttribute('storage-key') && this.isDismissed()) {
      this.hidden = true;
    }

    // Dismiss button
    const dismissBtn = this.querySelector('[data-announcement-dismiss]');
    dismissBtn?.addEventListener('click', () => this.dismiss());

    // Auto-rotate through messages
    if (this.hasAttribute('auto-rotate')) {
      this._startRotation();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (this._rotationTimer) {
      clearInterval(this._rotationTimer);
    }
    this._connected = false;
  }

  /** Dismiss the bar and remember. */
  dismiss() {
    this.hidden = true;
    const key = this.getAttribute('storage-key') || 'so:announcement-dismissed';
    try {
      localStorage.setItem(key, 'true');
    } catch { /* storage unavailable */ }
    emit(this, 'so:announcement:dismiss', {});
  }

  /** Show the bar. */
  show() {
    this.hidden = false;
    const key = this.getAttribute('storage-key') || 'so:announcement-dismissed';
    try {
      localStorage.removeItem(key);
    } catch { /* storage unavailable */ }
  }

  /** Check if previously dismissed. */
  isDismissed() {
    const key = this.getAttribute('storage-key') || 'so:announcement-dismissed';
    try {
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  }

  _startRotation() {
    const messages = this.querySelectorAll('[data-announcement-message]');
    if (messages.length <= 1) return;

    let index = 0;
    const interval = Number(this.getAttribute('auto-rotate')) || 5000;

    this._rotationTimer = setInterval(() => {
      index = (index + 1) % messages.length;
      messages.forEach((msg, i) => {
        msg.hidden = i !== index;
      });
      emit(this, 'so:announcement:rotate', { index });
    }, interval);
  }
}

/**
 * so-back-to-top — Scroll-to-top button that appears after scrolling down.
 *
 * Attributes:
 *   threshold   — Scroll Y offset before button appears (default 300).
 *
 * Public API:
 *   scrollToTop()  — Scroll to top with smooth behavior.
 *   isVisible      — Whether the button is currently visible.
 */
class SoBackToTop extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.threshold = Number(this.getAttribute('threshold')) || 300;

    this._onScroll = () => this._updateVisibility();
    this._onClick = () => this.scrollToTop();

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this._onScroll, { passive: true });
    }

    this.addEventListener('click', this._onClick);
    this._updateVisibility();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._onScroll);
    }
    this.removeEventListener('click', this._onClick);
    this._connected = false;
  }

  get isVisible() {
    return this.hasAttribute('visible');
  }

  scrollToTop() {
    window?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _updateVisibility() {
    const scrolled = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset : 0;
    if (scrolled >= this.threshold) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }
}

// Core utilities

// Overlay base class

// ─── Existing components ───────────────────────────────────────────────────





























// ─── New components ────────────────────────────────────────────────────────









// ─── Register all ──────────────────────────────────────────────────────────
registerElement('so-disclosure', SoDisclosure);
registerElement('so-quantity', SoQuantity);
registerElement('so-drawer', SoDrawer);
registerElement('so-modal', SoModal);
registerElement('so-accordion', SoAccordion);
registerElement('so-tabs', SoTabs);
registerElement('so-toast', SoToast);
registerElement('so-live-region', SoLiveRegion);
registerElement('so-variant-controller', SoVariantController);
registerElement('so-product-form', SoProductForm);
registerElement('so-media-gallery', SoMediaGallery);
registerElement('so-sticky-buy-bar', SoStickyBuyBar);
registerElement('so-sticky-header', SoStickyHeader);
registerElement('so-localization', SoLocalization);
registerElement('so-cart-drawer', SoCartDrawer);
registerElement('so-cart-items', SoCartItems);
registerElement('so-predictive-search', SoPredictiveSearch);
registerElement('so-facets', SoFacets);
registerElement('so-sort', SoSort);
registerElement('so-quick-add', SoQuickAdd);
registerElement('so-carousel', SoCarousel);
registerElement('so-quick-view', SoQuickView);
registerElement('so-product-card', SoProductCard);
registerElement('so-swatches', SoSwatches);
registerElement('so-infinite-list', SoInfiniteList);
registerElement('so-deferred-media', SoDeferredMedia);
registerElement('so-recipient-form', SoRecipientForm);
registerElement('so-pickup-availability', SoPickupAvailability);
registerElement('so-share', SoShare);

registerElement('so-price', SoPrice);
registerElement('so-rating', SoRating);
registerElement('so-pagination', SoPagination);
registerElement('so-breadcrumb', SoBreadcrumb);
registerElement('so-countdown', SoCountdown);
registerElement('so-stock-indicator', SoStockIndicator);
registerElement('so-progress-bar', SoProgressBar);
registerElement('so-announcement-bar', SoAnnouncementBar);
registerElement('so-back-to-top', SoBackToTop);
})();
