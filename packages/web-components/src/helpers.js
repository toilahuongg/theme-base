export function emit(element, name, detail = {}) {
  element.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

export function qs(root, selector) {
  return root.querySelector(selector);
}

export function qsa(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

export function setExpanded(button, expanded) {
  if (button) {
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
}

export function trapFocus(container) {
  const previous = document.activeElement;

  return () => {
    if (previous && typeof previous.focus === 'function') {
      previous.focus();
    }
  };
}
