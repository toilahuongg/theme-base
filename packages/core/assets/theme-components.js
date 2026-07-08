// Generated from packages/web-components/src/index.js.
// Run npm run build:web-components after editing web component source.

(() => {
function registerElement(name, elementClass) {
  if (!customElements.get(name)) {
    customElements.define(name, elementClass);
  }
}

function emit(element, name, detail = {}) {
  element.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}
function qs(root, selector) {
  return root.querySelector(selector);
}
function qsa(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}
function setExpanded(button, expanded) {
  if (button) {
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
}
function trapFocus(container) {
  const previous = document.activeElement;

  return () => {
    if (previous && typeof previous.focus === 'function') {
      previous.focus();
    }
  };
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

class SoAccordion extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.items = Array.from(this.querySelectorAll('[data-accordion-item]')).map((item) => {
      const toggle = item.querySelector('[data-accordion-toggle]');
      const panel = item.querySelector('[data-accordion-panel]');

      if (!toggle || !panel) {
        return null;
      }

      toggle.addEventListener('click', this);
      this.syncItem(toggle, panel);

      return { item, toggle, panel };
    }).filter(Boolean);

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.items.forEach(({ toggle }) => toggle.removeEventListener('click', this));
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type !== 'click') return;

    const toggle = event.currentTarget;
    const item = toggle.closest('[data-accordion-item]');
    const panel = item?.querySelector('[data-accordion-panel]');

    if (!item || !panel) return;

    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    setExpanded(toggle, expanded);
    panel.hidden = !expanded;
  }

  syncItem(toggle, panel) {
    const expandedAttr = toggle.getAttribute('aria-expanded');
    const expanded = expandedAttr === 'true' || (expandedAttr === null && !panel.hidden);
    setExpanded(toggle, expanded);
    panel.hidden = !expanded;
  }
}

class SoDrawer extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.panel = this.querySelector('[data-drawer-panel]') || this;
    this.closeButtons = Array.from(this.querySelectorAll('[data-drawer-close]'));
    this.triggerSelector = this.getAttribute('trigger-selector');
    this.triggers = this.getDocumentTriggers();

    this.closeButtons.forEach((button) => button.addEventListener('click', this));
    this.triggers.forEach((trigger) => trigger.addEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this);
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
    }

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
      this.open();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  open() {
    if (this.isOpen()) {
      this.syncExpanded();
      return;
    }

    this.setAttribute('open', '');
    this.syncExpanded();
  }

  close() {
    if (!this.isOpen()) {
      this.syncExpanded();
      return;
    }

    this.removeAttribute('open');
    this.syncExpanded();
  }

  syncExpanded() {
    const expanded = this.isOpen();

    this.triggers.forEach((trigger) => setExpanded(trigger, expanded));
    if (this.panel) {
      this.panel.hidden = !expanded;
    }
  }

  getDocumentTriggers() {
    if (!this.triggerSelector || typeof document === 'undefined') {
      return [];
    }

    return Array.from(document.querySelectorAll(this.triggerSelector));
  }
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

class SoModal extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.closeButtons = Array.from(this.querySelectorAll('[data-modal-close]'));
    this.closeButtons.forEach((button) => button.addEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this);
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;

    this.closeButtons.forEach((button) => button.removeEventListener('click', this));

    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this);
    }

    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape' && this.isOpen()) {
      this.close();
      return;
    }

    if (event.type === 'click' && this.closeButtons.includes(event.currentTarget)) {
      this.close();
    }
  }

  isOpen() {
    return this.hasAttribute('open');
  }

  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }
}

class SoQuantity extends HTMLElement {
  constructor() {
    super();
    this.decrease = () => this.step(-1);
    this.increase = () => this.step(1);
  }

  connectedCallback() {
    if (this._connected) return;

    this.input = this.querySelector('input[type="number"]');
    this.decreaseButton = this.querySelector('[data-quantity-decrease]');
    this.increaseButton = this.querySelector('[data-quantity-increase]');

    if (!this.input) return;

    this.decreaseButton?.addEventListener('click', this.decrease);
    this.increaseButton?.addEventListener('click', this.increase);
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.decreaseButton?.removeEventListener('click', this.decrease);
    this.increaseButton?.removeEventListener('click', this.increase);
    this._connected = false;
  }

  step(direction) {
    const step = Number(this.input.step) || 1;
    const min = this.input.min === '' ? -Infinity : Number(this.input.min);
    const max = this.input.max === '' ? Infinity : Number(this.input.max);
    const current = Number(this.input.value) || 0;
    const nextValue = Math.min(max, Math.max(min, current + direction * step));

    this.input.value = String(nextValue);
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

class SoTabs extends HTMLElement {
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

class SoToast extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
  }

  disconnectedCallback() {
    this.clearTimer();
    this._connected = false;
  }

  show(message) {
    this.clearTimer();
    this._timerToken = Symbol('so-toast-timer');
    const timerToken = this._timerToken;

    this.textContent = String(message ?? '');
    this.setAttribute('open', '');

    const duration = Number(this.getAttribute('duration')) || 4000;
    this._timer = setTimeout(() => {
      if (this._timerToken === timerToken) {
        this.hide();
      }
    }, duration);
  }

  hide() {
    this.clearTimer();
    this.removeAttribute('open');
  }

  clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    this._timerToken = null;
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

  async onSubmit(event) {
    if (this.isUnavailable()) {
      event.preventDefault();
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
        throw new Error('Add to cart failed');
      }

      const item = await response.json();
      emit(this, 'so:cart:add', { item });
    } catch (error) {
      emit(this, 'so:cart:error', { error });
    } finally {
      this.setBusy(false);
    }
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

  open() {
    this.setAttribute('open', '');
    this.syncExpanded();
  }

  close() {
    this.removeAttribute('open');
    this.syncExpanded();
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

class SoPredictiveSearch extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.input = this.querySelector('[data-predictive-search-input]');
    this.results = this.querySelector('[data-predictive-search-results]');
    this.status = this.querySelector('[data-predictive-search-status]');
    this.onInput = () => this.scheduleSearch();
    this.input?.addEventListener('input', this.onInput);
    this._connected = true;
  }

  disconnectedCallback() {
    this.input?.removeEventListener('input', this.onInput);
    clearTimeout(this.searchTimer);
    this._connected = false;
  }

  scheduleSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.search(), 200);
  }

  async search() {
    const query = this.input?.value?.trim() || '';
    if (!query) {
      this.renderResults([]);
      return;
    }

    this.setStatus('loading');

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page,article`, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Predictive search failed');
      }

      const data = await response.json();
      const resources = data.resources?.results || {};
      const results = ['products', 'collections', 'pages', 'articles'].flatMap((key) => resources[key] || []);
      this.renderResults(results);
      this.setStatus(results.length > 0 ? 'ready' : 'empty');
      emit(this, 'so:predictive-search:results', { query, results });
    } catch (error) {
      this.setStatus('error');
      emit(this, 'so:predictive-search:error', { query, error });
    }
  }

  renderResults(results) {
    if (!this.results) return;

    this.results.innerHTML = results.map((result) => {
      const title = this.escapeHtml(result.title || result.handle || '');
      const url = this.escapeHtml(result.url || result.online_store_url || '#');
      return `<li class="so-predictive-search__item"><a href="${url}">${title}</a></li>`;
    }).join('');
    this.results.hidden = results.length === 0;
  }

  setStatus(status) {
    this.setAttribute('data-status', status);
    if (this.status) {
      this.status.textContent = this.getAttribute(`data-${status}-text`) || '';
    }
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

class SoCarousel extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.track = this.querySelector('[data-carousel-track]');
    this.prevButton = this.querySelector('[data-carousel-prev]');
    this.nextButton = this.querySelector('[data-carousel-next]');
    this.prev = () => this.scroll(-1);
    this.next = () => this.scroll(1);
    this.prevButton?.addEventListener('click', this.prev);
    this.nextButton?.addEventListener('click', this.next);
    this._connected = true;
  }

  disconnectedCallback() {
    this.prevButton?.removeEventListener('click', this.prev);
    this.nextButton?.removeEventListener('click', this.next);
    this._connected = false;
  }

  scroll(direction) {
    if (!this.track) return;

    const distance = this.track.clientWidth || 320;
    this.track.scrollBy({ left: distance * direction, behavior: 'smooth' });
  }
}

class SoQuickView extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.closeButtons = Array.from(this.querySelectorAll('[data-quick-view-close]'));
    this.content = this.querySelector('[data-quick-view-content]');
    this.onOpen = (event) => this.open(event.detail?.productUrl);
    this.close = this.close.bind(this);
    this.closeButtons.forEach((button) => button.addEventListener('click', this.close));

    if (typeof document !== 'undefined') {
      document.addEventListener('so:quick-view:open', this.onOpen);
      document.addEventListener('keydown', this);
    }

    this._connected = true;
  }

  disconnectedCallback() {
    this.closeButtons.forEach((button) => button.removeEventListener('click', this.close));
    if (typeof document !== 'undefined') {
      document.removeEventListener('so:quick-view:open', this.onOpen);
      document.removeEventListener('keydown', this);
    }
    this._connected = false;
  }

  handleEvent(event) {
    if (event.type === 'keydown' && event.key === 'Escape') {
      this.close();
    }
  }

  open(productUrl) {
    this.setAttribute('open', '');
    if (productUrl) {
      this.setAttribute('product-url', productUrl);
    }
    emit(this, 'so:quick-view:opened', { productUrl });
  }

  close() {
    this.removeAttribute('open');
  }
}

class SoProductCard extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this.link = this.querySelector('a[href]');
    this._connected = true;
  }
}

class SoSwatches extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.swatches = Array.from(this.querySelectorAll('[data-swatch-value]'));
    this.onClick = (event) => this.select(event.currentTarget);
    this.swatches.forEach((swatch) => swatch.addEventListener('click', this.onClick));
    this._connected = true;
  }

  disconnectedCallback() {
    this.swatches?.forEach((swatch) => swatch.removeEventListener('click', this.onClick));
    this._connected = false;
  }

  select(selectedSwatch) {
    this.swatches.forEach((swatch) => {
      swatch.setAttribute('aria-pressed', swatch === selectedSwatch ? 'true' : 'false');
    });
    this.dispatchEvent(new CustomEvent('so:swatch:change', {
      bubbles: true,
      detail: { value: selectedSwatch.getAttribute('data-swatch-value') }
    }));
  }
}

class SoInfiniteList extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.nextLink = this.querySelector('[data-infinite-next]');
    this.onClick = (event) => this.loadMore(event);
    this.nextLink?.addEventListener('click', this.onClick);
    this._connected = true;
  }

  disconnectedCallback() {
    this.nextLink?.removeEventListener('click', this.onClick);
    this._connected = false;
  }

  async loadMore(event) {
    if (!this.hasAttribute('ajax')) return;

    event.preventDefault();
    this.toggleAttribute('aria-busy', true);

    try {
      const response = await fetch(this.nextLink.href, { headers: { Accept: 'text/html' } });
      if (!response.ok) throw new Error('Load more failed');
      this.dispatchEvent(new CustomEvent('so:infinite-list:load', { bubbles: true }));
    } finally {
      this.toggleAttribute('aria-busy', false);
    }
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
    this._connected = true;
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

    if (globalThis.navigator?.share) {
      await globalThis.navigator.share({ title, url });
    } else if (globalThis.navigator?.clipboard) {
      await globalThis.navigator.clipboard.writeText(url);
    }
  }
}

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
})();
