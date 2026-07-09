# SO Web Components Full Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Shopify storefront interaction layer for generated themes using the `so-` prefix everywhere, replacing the current partial `theme-base`/`tb` contract.

**Architecture:** Keep Liquid server-rendered and progressively enhance it with dependency-free vanilla custom elements from `packages/web-components/src/index.js`. Source-of-truth files live in `packages/core`; generated themes in `themes/*` must be regenerated or synced from core, not patched as the durable implementation. The public contract is `so-*` custom elements, `so-*` classes, `--so-*` CSS variables, and `so.css`.

**Tech Stack:** Shopify Liquid, Shopify theme blocks/sections/snippets, vanilla JavaScript custom elements, Node.js `node:test`, local generator scripts.

---

## Current State

- `packages/web-components/src/index.js` currently has `so-disclosure` and `so-quantity`.
- `packages/core/assets/so.css` exists and has `--so-*` variables and `.so-*` classes.
- `packages/core/assets/theme-components.js` is generated from `packages/web-components/src/index.js`.
- `packages/core/manifest.json` must include `so.css`, not `theme-base.css`.
- `themes/aster` and `themes/electronics-spec` are generated outputs; durable changes belong in `packages/core`, `packages/web-components`, `blueprints`, and generator tests.

## Prefix Rules

Use these exact rules across every task:

- Custom elements: `so-disclosure`, `so-quantity`, `so-drawer`, `so-modal`, etc.
- CSS classes: `.so-section`, `.so-card`, `.so-product-form`, etc.
- CSS variables: `--so-color-background`, `--so-section-gap`, etc.
- Asset file: `so.css`.
- Package scope if renamed: `@so/web-components`.
- Do not introduce new `theme-base-`, `theme-base.css`, `tb-`, or `--tb-` in source or generated themes.
- It is acceptable for tests to mention old prefixes only as negative assertions.

## Component Set

P0 components required before the theme can feel commercially complete:

- `so-disclosure`
- `so-accordion`
- `so-tabs`
- `so-drawer`
- `so-modal`
- `so-quantity`
- `so-variant-controller`
- `so-product-form`
- `so-cart-drawer`
- `so-cart-items`
- `so-media-gallery`
- `so-carousel`
- `so-predictive-search`
- `so-facets`
- `so-sort`
- `so-quick-add`
- `so-sticky-header`
- `so-sticky-buy-bar`
- `so-localization`
- `so-toast`
- `so-live-region`

P1 components after the P0 path is stable:

- `so-quick-view`
- `so-product-card`
- `so-swatches`
- `so-infinite-list`
- `so-deferred-media`
- `so-recipient-form`
- `so-pickup-availability`
- `so-share`

## File Structure

- Modify: `packages/web-components/src/index.js`
  - Defines all custom elements and shared helpers.
- Modify: `packages/web-components/tests/web-components.test.mjs`
  - Unit tests for registration and behavior with minimal DOM stubs.
- Modify: `packages/web-components/scripts/build.mjs`
  - Keeps generated JS synced into `packages/core/assets/theme-components.js`.
- Modify: `packages/web-components/package.json`
  - Rename package contract if the package scope is part of the public API.
- Modify: `packages/core/assets/so.css`
  - Adds base component styles for `so-*` Liquid markup.
- Modify: `packages/core/assets/theme-components.js`
  - Generated output only.
- Modify: `packages/core/manifest.json`
  - Ensure `assets` includes `so.css` and `theme-components.js`.
- Modify: `packages/core/layout/theme.liquid`
  - Load `so.css` and `theme-components.js`.
- Modify: `packages/core/snippets/*.liquid`
  - Add snippets for product form, cart lines, facets, search results, media gallery, swatches, toasts.
- Modify: `packages/core/sections/*.liquid`
  - Add sections for header, cart drawer, predictive search, main product, collection grid, main cart, main search.
- Modify: `packages/core/templates/*.json`
  - Add cart and search templates; enrich product and collection templates.
- Modify: `packages/core/locales/en.default.json`
  - Add user-facing strings for errors, loading, empty states, and accessibility.
- Modify: `tests/generator.test.mjs`
  - Assert generated themes use `so-` contract and include all required templates/assets.
- Modify: `blueprints/aster.json` and `blueprints/electronics-spec.json`
  - Expand component and template declarations to match the full set.
- Regenerate: `themes/aster/*` and `themes/electronics-spec/*`
  - Generated outputs should match source after running generator.

---

### Task 1: Stabilize Prefix Rename

**Files:**
- Modify: `packages/core/manifest.json`
- Modify: `packages/core/layout/theme.liquid`
- Modify: `packages/web-components/src/index.js`
- Modify: `packages/web-components/tests/web-components.test.mjs`
- Modify: `packages/web-components/package.json`
- Modify: `packages/web-components/scripts/build.mjs`
- Modify: `tests/generator.test.mjs`
- Generated: `packages/core/assets/theme-components.js`
- Generated: `themes/aster/*`
- Generated: `themes/electronics-spec/*`

- [ ] **Step 1: Confirm old prefix scan baseline**

Run:

```bash
rg -n "theme-base-|theme-base\.css|@theme-base/|\btb-|--tb-" packages themes tests blueprints docs package.json package-lock.json -g '!**/node_modules/**'
```

Expected: only negative assertions in tests or historical docs remain. Any occurrence in `packages/core`, `packages/web-components/src`, `packages/web-components/dist`, or `themes/*` must be fixed.

- [ ] **Step 2: Update manifest asset contract**

Set `packages/core/manifest.json` to:

```json
{
  "assets": ["so.css", "theme-components.js"],
  "blocks": ["callout-card.liquid", "content-stack.liquid"],
  "layouts": ["theme.liquid"],
  "snippets": ["button.liquid", "responsive-image.liquid", "price.liquid", "product-card.liquid"],
  "sections": ["main-hero.liquid", "featured-products.liquid", "rich-content.liquid", "_blocks.liquid"],
  "templates": ["index.json", "product.json", "collection.json"],
  "locales": ["en.default.json"]
}
```

- [ ] **Step 3: Update layout asset references**

Ensure `packages/core/layout/theme.liquid` contains:

```liquid
{{ 'so.css' | asset_url | stylesheet_tag }}
<script src="{{ 'theme-components.js' | asset_url }}" defer></script>
```

and the skip link class is:

```liquid
<a class="so-skip-link" href="#MainContent">{{ 'accessibility.skip_to_text' | t }}</a>
```

- [ ] **Step 4: Update web component names**

Ensure `packages/web-components/src/index.js` registers at least:

```js
customElements.define('so-disclosure', SoDisclosure);
customElements.define('so-quantity', SoQuantity);
```

Do not leave `theme-base-disclosure`, `theme-base-quantity`, `ThemeBaseDisclosure`, or `ThemeBaseQuantity` in source.

- [ ] **Step 5: Update web component tests**

Ensure `packages/web-components/tests/web-components.test.mjs` asserts:

```js
assert.equal(typeof definitions.get('so-disclosure'), 'function');
assert.equal(typeof definitions.get('so-quantity'), 'function');
assert.match(output, /customElements\.define\('so-disclosure'/);
assert.match(output, /customElements\.define\('so-quantity'/);
```

- [ ] **Step 6: Build generated JS**

Run:

```bash
npm run build:web-components
```

Expected: exits 0 and writes both `packages/web-components/dist/theme-components.js` and `packages/core/assets/theme-components.js`.

- [ ] **Step 7: Regenerate sample themes**

Run:

```bash
npm run generate -- aster
npm run generate -- electronics-spec
```

Expected: exits 0 and generated themes contain `assets/so.css`.

- [ ] **Step 8: Verify prefix contract**

Run:

```bash
rg -n "theme-base-|theme-base\.css|@theme-base/|\btb-|--tb-" packages/core packages/web-components/src packages/web-components/dist themes tests/generator.test.mjs -g '!**/node_modules/**'
```

Expected: no source/generated hits except negative assertions in `tests/generator.test.mjs`.

- [ ] **Step 9: Run focused tests**

Run:

```bash
npm run test:web-components
node --test --test-name-pattern "generated storefront contract uses the so prefix" tests/generator.test.mjs
```

Expected: both exit 0.

- [ ] **Step 10: Commit**

```bash
git add packages/core packages/web-components tests themes package.json package-lock.json blueprints
git commit -m "refactor: rename storefront prefix to so"
```

---

### Task 2: Split Web Component Source Into Testable Modules

**Files:**
- Create: `packages/web-components/src/helpers.js`
- Create: `packages/web-components/src/register.js`
- Create: `packages/web-components/src/components/disclosure.js`
- Create: `packages/web-components/src/components/quantity.js`
- Modify: `packages/web-components/src/index.js`
- Modify: `packages/web-components/scripts/build.mjs`
- Modify: `packages/web-components/tests/web-components.test.mjs`

- [x] **Step 1: Create helper module**

Create `packages/web-components/src/helpers.js`:

```js
export function emit(element, name, detail = {}) {
  element.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    detail
  }));
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
```

- [x] **Step 2: Create register helper**

Create `packages/web-components/src/register.js`:

```js
export function registerElement(name, elementClass) {
  if (!customElements.get(name)) {
    customElements.define(name, elementClass);
  }
}
```

- [x] **Step 3: Move disclosure into its own module**

Create `packages/web-components/src/components/disclosure.js`:

```js
import { setExpanded } from '../helpers.js';

export class SoDisclosure extends HTMLElement {
  connectedCallback() {
    if (this.connected) return;

    this.toggleButton = this.querySelector('[data-disclosure-toggle]') || this.querySelector('button');
    this.panel = this.querySelector('[data-disclosure-panel]') || this.querySelector('[hidden]');

    if (!this.toggleButton || !this.panel) return;

    setExpanded(this.toggleButton, this.open);
    this.panel.hidden = !this.open;
    this.toggleButton.addEventListener('click', this);
    this.connected = true;
  }

  disconnectedCallback() {
    if (!this.connected) return;
    this.toggleButton?.removeEventListener('click', this);
    this.connected = false;
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
    this.toggleAttribute('open', nextState);
    this.panel.hidden = !nextState;
    setExpanded(this.toggleButton, nextState);
  }
}
```

- [x] **Step 4: Move quantity into its own module**

Create `packages/web-components/src/components/quantity.js`:

```js
export class SoQuantity extends HTMLElement {
  constructor() {
    super();
    this.decrease = () => this.step(-1);
    this.increase = () => this.step(1);
  }

  connectedCallback() {
    if (this.connected) return;

    this.input = this.querySelector('input[type="number"]');
    this.decreaseButton = this.querySelector('[data-quantity-decrease]');
    this.increaseButton = this.querySelector('[data-quantity-increase]');

    if (!this.input) return;

    this.decreaseButton?.addEventListener('click', this.decrease);
    this.increaseButton?.addEventListener('click', this.increase);
    this.connected = true;
  }

  disconnectedCallback() {
    if (!this.connected) return;
    this.decreaseButton?.removeEventListener('click', this.decrease);
    this.increaseButton?.removeEventListener('click', this.increase);
    this.connected = false;
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
```

- [x] **Step 5: Update entrypoint**

Set `packages/web-components/src/index.js` to:

```js
import { registerElement } from './register.js';
import { SoDisclosure } from './components/disclosure.js';
import { SoQuantity } from './components/quantity.js';

registerElement('so-disclosure', SoDisclosure);
registerElement('so-quantity', SoQuantity);
```

- [x] **Step 6: Update build script to bundle local modules**

Modify `packages/web-components/scripts/build.mjs` so it recursively reads `src` modules and emits a browser-safe IIFE. The minimal acceptable output must not contain ESM `import` or `export` statements.

Run:

```bash
npm run build:web-components
rg -n "import |export " packages/web-components/dist/theme-components.js packages/core/assets/theme-components.js
```

Expected: build exits 0; `rg` finds no import/export statements in generated browser assets.

- [x] **Step 7: Run tests**

```bash
npm run test:web-components
```

Expected: exits 0.

- [ ] **Step 8: Commit**

```bash
git add packages/web-components packages/core/assets/theme-components.js
git commit -m "refactor: split so web component source"
```

---

### Task 3: Add Core UI Primitives

**Files:**
- Create: `packages/web-components/src/components/drawer.js`
- Create: `packages/web-components/src/components/modal.js`
- Create: `packages/web-components/src/components/accordion.js`
- Create: `packages/web-components/src/components/tabs.js`
- Create: `packages/web-components/src/components/toast.js`
- Create: `packages/web-components/src/components/live-region.js`
- Modify: `packages/web-components/src/index.js`
- Modify: `packages/web-components/tests/web-components.test.mjs`
- Modify: `packages/core/assets/so.css`

- [ ] **Step 1: Write registration test**

Add this assertion list to `packages/web-components/tests/web-components.test.mjs`:

```js
const expectedElements = [
  'so-disclosure',
  'so-quantity',
  'so-drawer',
  'so-modal',
  'so-accordion',
  'so-tabs',
  'so-toast',
  'so-live-region'
];

for (const elementName of expectedElements) {
  assert.equal(typeof definitions.get(elementName), 'function', `${elementName} is registered`);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test:web-components
```

Expected: FAIL because the new elements are not registered.

- [ ] **Step 3: Implement `so-drawer`**

Create `packages/web-components/src/components/drawer.js`:

```js
import { setExpanded } from '../helpers.js';

export class SoDrawer extends HTMLElement {
  connectedCallback() {
    if (this.connected) return;
    this.panel = this.querySelector('[data-drawer-panel]');
    this.closeButtons = Array.from(this.querySelectorAll('[data-drawer-close]'));
    this.triggerSelector = this.getAttribute('trigger-selector');
    this.triggers = this.triggerSelector ? Array.from(document.querySelectorAll(this.triggerSelector)) : [];
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.triggers.forEach((trigger) => trigger.addEventListener('click', this.open));
    this.closeButtons.forEach((button) => button.addEventListener('click', this.close));
    document.addEventListener('keydown', this.onKeydown);
    this.connected = true;
  }

  disconnectedCallback() {
    if (!this.connected) return;
    this.triggers.forEach((trigger) => trigger.removeEventListener('click', this.open));
    this.closeButtons.forEach((button) => button.removeEventListener('click', this.close));
    document.removeEventListener('keydown', this.onKeydown);
    this.connected = false;
  }

  open() {
    this.setAttribute('open', '');
    this.triggers.forEach((trigger) => setExpanded(trigger, true));
  }

  close() {
    this.removeAttribute('open');
    this.triggers.forEach((trigger) => setExpanded(trigger, false));
  }

  onKeydown(event) {
    if (event.key === 'Escape' && this.hasAttribute('open')) {
      this.close();
    }
  }
}
```

- [ ] **Step 4: Implement `so-modal`**

Create `packages/web-components/src/components/modal.js`:

```js
export class SoModal extends HTMLElement {
  connectedCallback() {
    if (this.connected) return;
    this.closeButtons = Array.from(this.querySelectorAll('[data-modal-close]'));
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.closeButtons.forEach((button) => button.addEventListener('click', this.close));
    document.addEventListener('keydown', this.onKeydown);
    this.connected = true;
  }

  disconnectedCallback() {
    if (!this.connected) return;
    this.closeButtons.forEach((button) => button.removeEventListener('click', this.close));
    document.removeEventListener('keydown', this.onKeydown);
    this.connected = false;
  }

  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }

  onKeydown(event) {
    if (event.key === 'Escape' && this.hasAttribute('open')) {
      this.close();
    }
  }
}
```

- [ ] **Step 5: Implement `so-accordion`**

Create `packages/web-components/src/components/accordion.js`:

```js
import { setExpanded } from '../helpers.js';

export class SoAccordion extends HTMLElement {
  connectedCallback() {
    if (this.connected) return;
    this.buttons = Array.from(this.querySelectorAll('[data-accordion-toggle]'));
    this.onClick = this.onClick.bind(this);
    this.buttons.forEach((button) => button.addEventListener('click', this.onClick));
    this.connected = true;
  }

  disconnectedCallback() {
    if (!this.connected) return;
    this.buttons.forEach((button) => button.removeEventListener('click', this.onClick));
    this.connected = false;
  }

  onClick(event) {
    const button = event.currentTarget;
    const panel = button.closest('[data-accordion-item]')?.querySelector('[data-accordion-panel]');
    if (!panel) return;
    const nextState = panel.hidden;
    panel.hidden = !nextState;
    setExpanded(button, nextState);
  }
}
```

- [ ] **Step 6: Implement `so-tabs`**

Create `packages/web-components/src/components/tabs.js`:

```js
export class SoTabs extends HTMLElement {
  connectedCallback() {
    if (this.connected) return;
    this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));
    this.onClick = this.onClick.bind(this);
    this.tabs.forEach((tab) => tab.addEventListener('click', this.onClick));
    this.connected = true;
  }

  disconnectedCallback() {
    if (!this.connected) return;
    this.tabs.forEach((tab) => tab.removeEventListener('click', this.onClick));
    this.connected = false;
  }

  onClick(event) {
    const selectedTab = event.currentTarget;
    const selectedPanelId = selectedTab.getAttribute('aria-controls');
    this.tabs.forEach((tab) => tab.setAttribute('aria-selected', tab === selectedTab ? 'true' : 'false'));
    this.panels.forEach((panel) => {
      panel.hidden = panel.id !== selectedPanelId;
    });
  }
}
```

- [ ] **Step 7: Implement toast and live region**

Create `packages/web-components/src/components/toast.js`:

```js
export class SoToast extends HTMLElement {
  connectedCallback() {
    this.hide = this.hide.bind(this);
  }

  show(message) {
    this.textContent = message;
    this.setAttribute('open', '');
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(this.hide, Number(this.getAttribute('duration')) || 4000);
  }

  hide() {
    this.removeAttribute('open');
  }
}
```

Create `packages/web-components/src/components/live-region.js`:

```js
export class SoLiveRegion extends HTMLElement {
  announce(message) {
    this.textContent = '';
    window.setTimeout(() => {
      this.textContent = message;
    }, 50);
  }
}
```

- [ ] **Step 8: Register primitives**

Add these imports and registrations to `packages/web-components/src/index.js`:

```js
import { SoDrawer } from './components/drawer.js';
import { SoModal } from './components/modal.js';
import { SoAccordion } from './components/accordion.js';
import { SoTabs } from './components/tabs.js';
import { SoToast } from './components/toast.js';
import { SoLiveRegion } from './components/live-region.js';

registerElement('so-drawer', SoDrawer);
registerElement('so-modal', SoModal);
registerElement('so-accordion', SoAccordion);
registerElement('so-tabs', SoTabs);
registerElement('so-toast', SoToast);
registerElement('so-live-region', SoLiveRegion);
```

- [ ] **Step 9: Add base CSS**

Append to `packages/core/assets/so.css`:

```css
so-drawer,
so-modal,
so-accordion,
so-tabs,
so-toast,
so-live-region {
  display: block;
}

so-drawer:not([open]) [data-drawer-panel],
so-modal:not([open]) {
  display: none;
}

so-toast {
  position: fixed;
  inset-block-end: 1rem;
  inset-inline: 1rem;
  z-index: 80;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
}

so-toast[open] {
  opacity: 1;
  pointer-events: auto;
}
```

- [ ] **Step 10: Build and test**

```bash
npm run build:web-components
npm run test:web-components
```

Expected: both exit 0.

- [ ] **Step 11: Commit**

```bash
git add packages/web-components packages/core/assets
git commit -m "feat: add so UI primitives"
```

---

### Task 4: Add Product Interaction Components

**Files:**
- Create: `packages/web-components/src/components/variant-controller.js`
- Create: `packages/web-components/src/components/product-form.js`
- Create: `packages/web-components/src/components/media-gallery.js`
- Create: `packages/web-components/src/components/sticky-buy-bar.js`
- Create: `packages/core/snippets/product-form.liquid`
- Create: `packages/core/snippets/variant-picker.liquid`
- Create: `packages/core/snippets/media-gallery.liquid`
- Create: `packages/core/sections/main-product.liquid`
- Modify: `packages/web-components/src/index.js`
- Modify: `packages/web-components/tests/web-components.test.mjs`
- Modify: `packages/core/manifest.json`
- Modify: `packages/core/templates/product.json`
- Modify: `packages/core/locales/en.default.json`

- [ ] **Step 1: Write registration test for product components**

Add:

```js
for (const elementName of ['so-variant-controller', 'so-product-form', 'so-media-gallery', 'so-sticky-buy-bar']) {
  assert.equal(typeof definitions.get(elementName), 'function', `${elementName} is registered`);
}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:web-components
```

Expected: FAIL because product components are not registered.

- [ ] **Step 3: Implement product component classes**

Create minimal classes with public behavior:

```js
export class SoVariantController extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.variantInput = this.querySelector('[name="id"]');
  }
}
```

```js
export class SoProductForm extends HTMLElement {
  connectedCallback() {
    if (this.connected) return;
    this.form = this.querySelector('form');
    this.submitButton = this.querySelector('[type="submit"]');
    this.onSubmit = this.onSubmit.bind(this);
    this.form?.addEventListener('submit', this.onSubmit);
    this.connected = true;
  }

  disconnectedCallback() {
    this.form?.removeEventListener('submit', this.onSubmit);
    this.connected = false;
  }

  async onSubmit(event) {
    if (!this.hasAttribute('ajax')) return;
    event.preventDefault();
    this.submitButton?.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this.form)
      });
      if (!response.ok) throw new Error('Add to cart failed');
      this.dispatchEvent(new CustomEvent('so:cart:add', { bubbles: true }));
    } finally {
      this.submitButton?.removeAttribute('aria-busy');
    }
  }
}
```

```js
export class SoMediaGallery extends HTMLElement {
  connectedCallback() {
    this.thumbnails = Array.from(this.querySelectorAll('[data-media-thumbnail]'));
    this.media = Array.from(this.querySelectorAll('[data-media-item]'));
    this.onClick = this.onClick.bind(this);
    this.thumbnails.forEach((thumbnail) => thumbnail.addEventListener('click', this.onClick));
  }

  disconnectedCallback() {
    this.thumbnails?.forEach((thumbnail) => thumbnail.removeEventListener('click', this.onClick));
  }

  onClick(event) {
    const id = event.currentTarget.getAttribute('data-media-thumbnail');
    this.media.forEach((item) => {
      item.hidden = item.getAttribute('data-media-item') !== id;
    });
  }
}
```

```js
export class SoStickyBuyBar extends HTMLElement {
  connectedCallback() {
    this.hidden = false;
  }
}
```

- [ ] **Step 4: Register product components**

Register:

```js
registerElement('so-variant-controller', SoVariantController);
registerElement('so-product-form', SoProductForm);
registerElement('so-media-gallery', SoMediaGallery);
registerElement('so-sticky-buy-bar', SoStickyBuyBar);
```

- [ ] **Step 5: Create product Liquid snippets**

Create `packages/core/snippets/product-form.liquid` using:

```liquid
{% form 'product', product %}
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
  <button class="so-button" type="submit">
    {{ 'products.product.add_to_cart' | t }}
  </button>
{% endform %}
```

Create `packages/core/snippets/variant-picker.liquid` with a `so-variant-controller` wrapper and radio inputs for `product.options_with_values`.

Create `packages/core/snippets/media-gallery.liquid` with a `so-media-gallery` wrapper, `[data-media-item]`, and `[data-media-thumbnail]`.

- [ ] **Step 6: Create `main-product` section**

Create `packages/core/sections/main-product.liquid` with `so-media-gallery`, product title, price, variant picker, and `so-product-form ajax`.

- [ ] **Step 7: Update product template**

Set `packages/core/templates/product.json` to include:

```json
{
  "sections": {
    "main": {
      "type": "main-product"
    }
  },
  "order": ["main"]
}
```

- [ ] **Step 8: Update manifest**

Add these files to `packages/core/manifest.json`:

```json
"snippets": ["button.liquid", "responsive-image.liquid", "price.liquid", "product-card.liquid", "product-form.liquid", "variant-picker.liquid", "media-gallery.liquid"],
"sections": ["main-hero.liquid", "featured-products.liquid", "rich-content.liquid", "_blocks.liquid", "main-product.liquid"]
```

- [ ] **Step 9: Add translations**

Add:

```json
{
  "products": {
    "product": {
      "add_to_cart": "Add to cart",
      "sold_out": "Sold out",
      "unavailable": "Unavailable"
    }
  }
}
```

- [ ] **Step 10: Build, generate, test**

```bash
npm run build:web-components
npm run generate -- aster
npm run test
```

Expected: exits 0.

- [ ] **Step 11: Commit**

```bash
git add packages/web-components packages/core themes tests
git commit -m "feat: add so product interactions"
```

---

### Task 5: Add Cart Components

**Files:**
- Create: `packages/web-components/src/components/cart-drawer.js`
- Create: `packages/web-components/src/components/cart-items.js`
- Create: `packages/core/snippets/cart-line-item.liquid`
- Create: `packages/core/sections/cart-drawer.liquid`
- Create: `packages/core/sections/main-cart.liquid`
- Create: `packages/core/templates/cart.json`
- Modify: `packages/web-components/src/index.js`
- Modify: `packages/core/manifest.json`
- Modify: `packages/core/locales/en.default.json`

- [ ] **Step 1: Add failing registration checks**

Expected components:

```js
'so-cart-drawer'
'so-cart-items'
```

- [ ] **Step 2: Implement `so-cart-drawer`**

Use `so-drawer` behavior as the base. The public events are:

```js
document.addEventListener('so:cart:add', () => cartDrawer.open());
```

- [ ] **Step 3: Implement `so-cart-items`**

Support:

```js
fetch('/cart/change.js', {
  method: 'POST',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  body: JSON.stringify({ line, quantity })
});
```

Dispatch:

```js
this.dispatchEvent(new CustomEvent('so:cart:update', { bubbles: true }));
```

- [ ] **Step 4: Create cart Liquid**

Create `cart-line-item.liquid`, `cart-drawer.liquid`, `main-cart.liquid`, and `cart.json` with server-rendered fallback links to `/cart`.

- [ ] **Step 5: Build and test**

```bash
npm run build:web-components
npm run generate -- aster
npm run test
```

Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add packages/web-components packages/core themes tests
git commit -m "feat: add so cart interactions"
```

---

### Task 6: Add Collection, Search, and Merchandising Components

**Files:**
- Create: `packages/web-components/src/components/predictive-search.js`
- Create: `packages/web-components/src/components/facets.js`
- Create: `packages/web-components/src/components/sort.js`
- Create: `packages/web-components/src/components/quick-add.js`
- Create: `packages/web-components/src/components/carousel.js`
- Create: `packages/core/sections/header.liquid`
- Create: `packages/core/sections/predictive-search.liquid`
- Create: `packages/core/sections/main-collection-product-grid.liquid`
- Create: `packages/core/sections/main-search.liquid`
- Create: `packages/core/snippets/facets.liquid`
- Create: `packages/core/snippets/sort.liquid`
- Modify: `packages/web-components/src/index.js`
- Modify: `packages/core/manifest.json`
- Modify: `packages/core/templates/collection.json`
- Create: `packages/core/templates/search.json`

- [ ] **Step 1: Add failing registration checks**

Expected components:

```js
'so-predictive-search'
'so-facets'
'so-sort'
'so-quick-add'
'so-carousel'
```

- [ ] **Step 2: Implement `so-predictive-search`**

Use `/search/suggest.json?q=${query}&resources[type]=product,collection,page,article` with loading, empty, and error states.

- [ ] **Step 3: Implement `so-facets` and `so-sort`**

Use URL search params as the public contract. On change, update `window.location.href`.

- [ ] **Step 4: Implement `so-quick-add`**

Submit a product card form to `/cart/add.js`; if variants are required, dispatch `so:quick-view:open`.

- [ ] **Step 5: Implement `so-carousel`**

Support previous/next buttons with `[data-carousel-prev]`, `[data-carousel-next]`, and slide list `[data-carousel-track]`.

- [ ] **Step 6: Add Liquid sections/snippets**

Add server-rendered header, predictive search container, collection grid, search page, facets, and sort controls.

- [ ] **Step 7: Update templates and manifest**

Collection template should use `main-collection-product-grid`; search template should use `main-search`; manifest should include all new files.

- [ ] **Step 8: Build and test**

```bash
npm run build:web-components
npm run generate -- aster
npm run generate -- electronics-spec
npm run test
```

Expected: exits 0.

- [ ] **Step 9: Commit**

```bash
git add packages/web-components packages/core themes tests
git commit -m "feat: add so discovery interactions"
```

---

### Task 7: Add P1 Premium Components

**Files:**
- Create: `packages/web-components/src/components/quick-view.js`
- Create: `packages/web-components/src/components/product-card.js`
- Create: `packages/web-components/src/components/swatches.js`
- Create: `packages/web-components/src/components/infinite-list.js`
- Create: `packages/web-components/src/components/deferred-media.js`
- Create: `packages/web-components/src/components/recipient-form.js`
- Create: `packages/web-components/src/components/pickup-availability.js`
- Create: `packages/web-components/src/components/share.js`
- Modify: `packages/web-components/src/index.js`
- Modify: `packages/core/snippets/product-card.liquid`
- Modify: `packages/core/assets/so.css`

- [ ] **Step 1: Add registration test**

Expected P1 components:

```js
[
  'so-quick-view',
  'so-product-card',
  'so-swatches',
  'so-infinite-list',
  'so-deferred-media',
  'so-recipient-form',
  'so-pickup-availability',
  'so-share'
]
```

- [ ] **Step 2: Implement each component with progressive enhancement**

Each component must have server-rendered fallback. Do not require JS for product links, cart page, or basic form submission.

- [ ] **Step 3: Build and test**

```bash
npm run build:web-components
npm run test
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add packages/web-components packages/core themes tests
git commit -m "feat: add premium so components"
```

---

### Task 8: Final Contract Verification

**Files:**
- Modify: `docs/architecture/component-contracts.md`
- Modify: `docs/architecture/section-contracts.md`
- Modify: `docs/ai/review-checklist.md`
- Modify: `docs/theme-store/submission-checklist.md`

- [ ] **Step 1: Update docs to name the SO contract**

Docs must state:

```md
Generated storefront code uses the `so-` prefix for custom elements, CSS classes, and CSS variables. New source must not introduce `theme-base-`, `tb-`, or `--tb-`.
```

- [ ] **Step 2: Run old prefix scan**

```bash
rg -n "theme-base-|theme-base\.css|@theme-base/|\btb-|--tb-" packages/core packages/web-components/src packages/web-components/dist themes docs/architecture docs/ai docs/theme-store -g '!**/node_modules/**'
```

Expected: no matches.

- [ ] **Step 3: Run full tests**

```bash
npm run build:web-components
npm run generate -- aster
npm run generate -- electronics-spec
npm run validate:blueprint
npm run test
```

Expected: exits 0.

- [ ] **Step 4: Run Shopify theme checks if CLI is authenticated**

```bash
npm run theme:check -- themes/aster
npm run theme:check -- themes/electronics-spec
```

Expected: no errors. Warnings must be triaged before claiming Theme Store readiness.

- [ ] **Step 5: Commit**

```bash
git add docs packages themes tests blueprints
git commit -m "docs: document so storefront contract"
```

---

## Self-Review

- The plan covers the requested full component direction and explicitly locks the prefix to `so-`.
- Durable implementation is in `packages/core` and `packages/web-components`, not manually patched generated themes.
- The plan keeps critical Shopify flows server-rendered first and uses custom elements as progressive enhancement.
- The plan includes tests before implementation for each component group.
- The plan includes final scans to prevent accidental `theme-base-`, `tb-`, or `--tb-` regressions.
