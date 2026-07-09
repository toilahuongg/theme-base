// ─── Constants ───────────────────────────────────────────────────────────

/** CSS selector for all focusable elements. */
export const FOCUSABLE_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
].join(', ');

// ─── Event helpers ───────────────────────────────────────────────────────

/** Dispatch a bub CustomEvent from an element. */
export function emit(element, name, detail = {}) {
  element.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

/** One-time event listener. Returns the bound handler for manual removal. */
export function once(element, eventName, handler, options) {
  const wrapped = (event) => {
    element.removeEventListener(eventName, wrapped, options);
    handler.call(element, event);
  };
  element.addEventListener(eventName, wrapped, options);
  return wrapped;
}

// ─── DOM helpers ─────────────────────────────────────────────────────────

export function qs(root, selector) {
  return root.querySelector(selector);
}

export function qsa(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

/** Set or remove aria-expanded on a button. */
export function setExpanded(button, expanded) {
  if (button) {
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
}

/** Save the current activeElement and return a restore function. */
export function rememberFocus() {
  const previous = document.activeElement;
  return () => {
    if (previous && typeof previous.focus === 'function') {
      previous.focus();
    }
  };
}

/** Get the slotted content for a named slot. Returns an array of nodes. */
export function slotContent(target, name = '') {
  const slot = target.querySelector(`slot[name="${name}"]`);
  if (slot) return Array.from(slot.assignedNodes());
  return [];
}

// ─── Timing helpers ──────────────────────────────────────────────────────

/** Debounce a function. Returns a debounced wrapper. */
export function debounce(fn, ms = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/** Throttle a function to at most once per interval. */
export function throttle(fn, ms = 100) {
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
export function trapFocus(root) {
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
export function cssVar(element, name) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

// ─── Announce (live region wrapper) ─────────────────────────────────────

/** Announce a message to screen readers via a live region. */
export function announce(message, politeness = 'polite') {
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
