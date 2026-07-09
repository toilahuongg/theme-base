import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { buildWebComponents } from '../scripts/build.mjs';
import { pathToFileURL } from 'node:url';

const packageRoot = path.resolve(import.meta.dirname, '..');
const expectedElements = [
  'so-disclosure',
  'so-quantity',
  'so-drawer',
  'so-modal',
  'so-accordion',
  'so-tabs',
  'so-toast',
  'so-live-region',
  'so-variant-controller',
  'so-product-form',
  'so-media-gallery',
  'so-sticky-buy-bar',
  'so-sticky-header',
  'so-localization',
  'so-cart-drawer',
  'so-cart-items',
  'so-predictive-search',
  'so-facets',
  'so-sort',
  'so-quick-add',
  'so-carousel',
  'so-quick-view',
  'so-product-card',
  'so-swatches',
  'so-infinite-list',
  'so-deferred-media',
  'so-recipient-form',
  'so-pickup-availability',
  'so-share'
];

class FakeNode {
  constructor(attributes = {}) {
    this.listeners = new Map();
    this.attributes = new Map(Object.entries(attributes).map(([name, value]) => [name, String(value)]));
    this.hidden = false;
    this.textContent = '';
  }

  setAttribute(name, value = '') {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  toggleAttribute(name, force) {
    const enabled = force ?? !this.hasAttribute(name);
    if (enabled) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
    return enabled;
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(handler);
  }

  removeEventListener(type, handler) {
    this.listeners.get(type)?.delete(handler);
  }

  dispatch(type, extra = {}) {
    const event = { type, currentTarget: this, target: this, ...extra };
    for (const handler of this.listeners.get(type) ?? []) {
      if (typeof handler === 'function') {
        handler.call(this, event);
      } else if (handler && typeof handler.handleEvent === 'function') {
        handler.handleEvent(event);
      }
    }
    return event;
  }

  dispatchEvent(event) {
    return this.dispatch(event.type, event);
  }
}

class FakeDocument extends FakeNode {
  constructor(triggers = []) {
    super();
    this.triggers = triggers;
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(handler);
  }

  removeEventListener(type, handler) {
    this.listeners.get(type)?.delete(handler);
  }

  querySelectorAll(selector) {
    return this.triggersBySelector?.get(selector) ?? this.triggers.filter((trigger) => trigger.selector === selector);
  }
}

test('registers SO custom elements once from source modules', async () => {
  const definitions = new Map();
  const previousGlobals = {
    customElements: globalThis.customElements,
    HTMLElement: globalThis.HTMLElement,
    Event: globalThis.Event
  };
  const indexUrl = pathToFileURL(path.join(packageRoot, 'src/index.js')).href;

  globalThis.customElements = {
    define(name, elementClass) {
      definitions.set(name, elementClass);
    },
    get(name) {
      return definitions.get(name);
    }
  };
  globalThis.HTMLElement = class HTMLElement {};
  globalThis.Event = previousGlobals.Event;

  try {
    await import(`${indexUrl}?first`);
    await import(`${indexUrl}?second`);
  } finally {
    globalThis.customElements = previousGlobals.customElements;
    globalThis.HTMLElement = previousGlobals.HTMLElement;
    globalThis.Event = previousGlobals.Event;
  }

  assert.equal(definitions.size, expectedElements.length);
  for (const elementName of expectedElements) {
    assert.equal(typeof definitions.get(elementName), 'function');
  }
});

test('builds distributable browser asset', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'so-web-components-'));
  const distFile = path.join(tempDir, 'dist/theme-components.js');

  try {
    const result = await buildWebComponents({ distFile, syncCoreAsset: false });
    const output = await fs.readFile(result.distFile, 'utf8');
    const definitions = new Map();
    const context = vm.createContext({
      Event,
      HTMLElement: class HTMLElement {},
      customElements: {
        define(name, elementClass) {
          definitions.set(name, elementClass);
        },
        get(name) {
          return definitions.get(name);
        }
      }
    });

    assert.equal(result.coreAssetFile, null);
    assert.match(output, /Generated from packages\/web-components\/src\/index\.js/);
    assert.doesNotMatch(output, /\bimport\s/);
    assert.doesNotMatch(output, /\bexport\s/);

    vm.runInContext(output, context);

    assert.equal(definitions.size, expectedElements.length);
    for (const elementName of expectedElements) {
      assert.equal(typeof definitions.get(elementName), 'function');
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('playground documents every registered component with runnable examples', async () => {
  const playgroundRoot = path.join(packageRoot, 'playground');
  const html = await fs.readFile(path.join(playgroundRoot, 'index.html'), 'utf8');
  const catalogModule = await import(`${pathToFileURL(path.join(playgroundRoot, 'components.js')).href}?catalog`);
  const catalog = catalogModule.componentCatalog;

  assert.match(html, /\.\.\/dist\/theme-components\.js/);
  assert.match(html, /\.\/playground\.js/);
  assert.equal(catalog.length, expectedElements.length);

  for (const elementName of expectedElements) {
    const entry = catalog.find((candidate) => candidate.name === elementName);
    assert.ok(entry, `${elementName} is missing from the playground catalog`);
    assert.ok(entry.summary, `${elementName} needs a summary`);
    assert.ok(Array.isArray(entry.attributes), `${elementName} attributes must be listed`);
    assert.ok(Array.isArray(entry.variants) && entry.variants.length > 0, `${elementName} needs at least one variant`);

    for (const variant of entry.variants) {
      assert.match(variant.html, new RegExp(`<${elementName}\\b`), `${elementName} variant must render the custom element`);
    }
  }
});

test('playground component examples use storefront base classes', async () => {
  const playgroundRoot = path.join(packageRoot, 'playground');
  const catalogModule = await import(`${pathToFileURL(path.join(playgroundRoot, 'components.js')).href}?base-classes`);
  const catalog = catalogModule.componentCatalog;

  for (const entry of catalog) {
    for (const variant of entry.variants) {
      assert.doesNotMatch(variant.html, /\bdemo-[a-z0-9_-]+/, `${entry.name} / ${variant.name} must not rely on playground demo CSS`);
    }
  }
});

test('quantity steps within bounds and updates control disabled state', async () => {
  const { SoQuantity } = await import(pathToFileURL(path.join(packageRoot, 'src/components/quantity.js')).href);

  const input = new FakeNode();
  input.type = 'number';
  input.value = '1';
  input.min = '1';
  input.max = '3';
  input.step = '1';
  const decrease = new FakeNode({ 'data-quantity-decrease': '' });
  const increase = new FakeNode({ 'data-quantity-increase': '' });
  const events = [];
  input.addEventListener('input', () => events.push('input'));
  input.addEventListener('change', () => events.push('change'));

  const quantity = new SoQuantity();
  quantity.querySelector = (selector) => {
    if (selector === 'input[type="number"]') return input;
    if (selector === '[data-quantity-decrease]') return decrease;
    if (selector === '[data-quantity-increase]') return increase;
    return null;
  };

  quantity.connectedCallback();

  assert.equal(decrease.hasAttribute('disabled'), true);
  assert.equal(increase.hasAttribute('disabled'), false);

  increase.dispatch('click');
  assert.equal(input.value, '2');
  assert.deepEqual(events, ['input', 'change']);
  assert.equal(decrease.hasAttribute('disabled'), false);

  increase.dispatch('click');
  assert.equal(input.value, '3');
  assert.equal(increase.hasAttribute('disabled'), true);

  increase.dispatch('click');
  assert.equal(input.value, '3');
  assert.equal(increase.hasAttribute('disabled'), true);

  decrease.dispatch('click');
  decrease.dispatch('click');
  assert.equal(input.value, '1');
  assert.equal(decrease.hasAttribute('disabled'), true);
});

test('drawer opens from trigger and closes on escape and close button', async () => {
  const { SoDrawer } = await import(pathToFileURL(path.join(packageRoot, 'src/components/drawer.js')).href);

  const trigger = new FakeNode({ 'aria-expanded': 'false' });
  trigger.selector = '[data-drawer-trigger]';
  const closeButton = new FakeNode();
  const panel = new FakeNode();
  const drawer = new SoDrawer();

  drawer.getAttribute = (name) => (name === 'trigger-selector' ? '[data-drawer-trigger]' : null);
  drawer.hasAttribute = (name) => name === 'open' && drawer._open === true;
  drawer.setAttribute = (name) => {
    if (name === 'open') drawer._open = true;
  };
  drawer.removeAttribute = (name) => {
    if (name === 'open') drawer._open = false;
  };
  drawer.querySelector = (selector) => (selector === '[data-drawer-panel]' ? panel : selector === '[data-drawer-close]' ? closeButton : null);
  drawer.querySelectorAll = (selector) => (selector === '[data-drawer-close]' ? [closeButton] : []);

  const documentTriggers = [trigger];
  const previousDocument = globalThis.document;
  globalThis.document = {
    addEventListener: (type, handler) => {
      if (type === 'keydown') {
        globalThis.__drawerKeydown = handler;
      }
    },
    removeEventListener: () => {},
    querySelectorAll: (selector) => (selector === '[data-drawer-trigger]' ? documentTriggers : [])
  };

  try {
    drawer.connectedCallback();
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(panel.hidden, true);

    trigger.dispatch('click');
    assert.equal(drawer._open, true);
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(panel.hidden, false);

    globalThis.__drawerKeydown.handleEvent({ type: 'keydown', key: 'Escape' });
    assert.equal(drawer._open, false);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(panel.hidden, true);

    trigger.dispatch('click');
    closeButton.dispatch('click');
    assert.equal(drawer._open, false);
  } finally {
    globalThis.document = previousDocument;
  }
});

test('modal toggles open state and removes listeners on disconnect', async () => {
  const { SoModal } = await import(pathToFileURL(path.join(packageRoot, 'src/components/modal.js')).href);

  const closeButton = new FakeNode();
  const modal = new SoModal();
  const previousDocument = globalThis.document;
  const fakeDocument = new FakeDocument();

  modal.querySelectorAll = (selector) => (selector === '[data-modal-close]' ? [closeButton] : []);
  modal.setAttribute = (name) => {
    if (name === 'open') modal._open = true;
  };
  modal.removeAttribute = (name) => {
    if (name === 'open') modal._open = false;
  };
  modal.hasAttribute = (name) => name === 'open' && modal._open === true;

  globalThis.document = fakeDocument;

  try {
    modal.connectedCallback();
    assert.equal(fakeDocument.listeners.get('keydown')?.has(modal), true);
    assert.equal(closeButton.listeners.get('click')?.has(modal), true);

    modal.open();
    assert.equal(modal._open, true);

    fakeDocument.listeners.get('keydown').forEach((handler) => {
      if (handler && typeof handler.handleEvent === 'function') {
        handler.handleEvent({ type: 'keydown', key: 'Escape' });
      }
    });
    assert.equal(modal._open, false);

    modal.open();
    closeButton.dispatch('click');
    assert.equal(modal._open, false);

    modal.disconnectedCallback();
    assert.equal(fakeDocument.listeners.get('keydown')?.has(modal), false);
    assert.equal(closeButton.listeners.get('click')?.has(modal), false);
  } finally {
    globalThis.document = previousDocument;
  }
});

test('accordion toggles hidden state and aria-expanded', async () => {
  const { SoAccordion } = await import(pathToFileURL(path.join(packageRoot, 'src/components/accordion.js')).href);

  const toggle = new FakeNode({ 'aria-expanded': 'false' });
  const panel = new FakeNode();
  const item = new FakeNode();
  item.querySelector = (selector) => (selector === '[data-accordion-toggle]' ? toggle : selector === '[data-accordion-panel]' ? panel : null);
  toggle.closest = (selector) => (selector === '[data-accordion-item]' ? item : null);
  const accordion = new SoAccordion();
  accordion.querySelectorAll = (selector) => (selector === '[data-accordion-item]' ? [item] : []);

  accordion.connectedCallback();
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(panel.hidden, true);

  toggle.dispatch('click');
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(panel.hidden, false);

  toggle.dispatch('click');
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(panel.hidden, true);
});

test('tabs select the matching panel', async () => {
  const { SoTabs } = await import(pathToFileURL(path.join(packageRoot, 'src/components/tabs.js')).href);

  const tabA = new FakeNode({ role: 'tab', 'aria-controls': 'panel-a', 'aria-selected': 'true' });
  const tabB = new FakeNode({ role: 'tab', 'aria-controls': 'panel-b', 'aria-selected': 'false' });
  const panelA = new FakeNode();
  panelA.id = 'panel-a';
  const panelB = new FakeNode();
  panelB.id = 'panel-b';
  const tabs = new SoTabs();
  tabs.querySelectorAll = (selector) => {
    if (selector === '[role="tab"]') return [tabA, tabB];
    if (selector === '[role="tabpanel"]') return [panelA, panelB];
    return [];
  };
  tabs.querySelector = (selector) => {
    if (selector === '#panel-a') return panelA;
    if (selector === '#panel-b') return panelB;
    return null;
  };

  tabs.connectedCallback();
  assert.equal(tabA.getAttribute('aria-selected'), 'true');
  assert.equal(tabB.getAttribute('aria-selected'), 'false');
  assert.equal(panelA.hidden, false);
  assert.equal(panelB.hidden, true);

  tabB.dispatch('click');
  assert.equal(tabA.getAttribute('aria-selected'), 'false');
  assert.equal(tabB.getAttribute('aria-selected'), 'true');
  assert.equal(panelA.hidden, true);
  assert.equal(panelB.hidden, false);
});

test('toast show and hide respects duration and manual hide', async () => {
  const { SoToast } = await import(pathToFileURL(path.join(packageRoot, 'src/components/toast.js')).href);
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const scheduled = [];
  const cleared = [];

  globalThis.setTimeout = (fn) => {
    scheduled.push(fn);
    return scheduled.length;
  };
  globalThis.clearTimeout = (timerId) => {
    cleared.push(timerId);
  };

  try {
    const toast = new SoToast();
    toast.getAttribute = (name) => (name === 'duration' ? '10' : null);
    toast.removeAttribute = (name) => {
      if (name === 'open') toast._open = false;
    };
    toast.setAttribute = (name) => {
      if (name === 'open') toast._open = true;
    };

    toast.show('Saved');
    assert.equal(toast.textContent, 'Saved');
    assert.equal(toast._open, true);
    assert.equal(scheduled.length, 1);

    scheduled[0]();
    assert.equal(toast._open, false);

    toast.show('Saved again');
    assert.equal(toast._open, true);

    toast.hide();
    assert.equal(toast._open, false);
    assert.equal(cleared.length > 0, true);

    toast.show('Pending');
    toast.disconnectedCallback();
    assert.equal(cleared.length > 1, true);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
});

test('toast cancels stale auto-hide timer on rapid reschedule', async () => {
  const { SoToast } = await import(pathToFileURL(path.join(packageRoot, 'src/components/toast.js')).href);
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const scheduled = [];
  const cleared = new Set();

  globalThis.setTimeout = (fn) => {
    const timer = { id: scheduled.length + 1, fn };
    scheduled.push(timer);
    return timer.id;
  };
  globalThis.clearTimeout = (timerId) => {
    cleared.add(timerId);
  };

  try {
    const toast = new SoToast();
    toast.getAttribute = (name) => (name === 'duration' ? '10' : null);
    toast.removeAttribute = (name) => {
      if (name === 'open') toast._open = false;
    };
    toast.setAttribute = (name) => {
      if (name === 'open') toast._open = true;
    };

    toast.show('First');
    assert.equal(scheduled.length, 1);
    assert.equal(toast.textContent, 'First');
    assert.equal(toast._open, true);

    toast.show('Second');
    assert.equal(scheduled.length, 2);
    assert.equal(cleared.has(1), true);
    assert.equal(toast.textContent, 'Second');
    assert.equal(toast._open, true);

    scheduled[0].fn();
    assert.equal(toast.textContent, 'Second');
    assert.equal(toast._open, true);

    scheduled[1].fn();
    assert.equal(toast._open, false);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
});

test('live region sets defaults, announces asynchronously, and clears timers on disconnect', async () => {
  const { SoLiveRegion } = await import(pathToFileURL(path.join(packageRoot, 'src/components/live-region.js')).href);
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const scheduled = [];
  const cleared = [];

  globalThis.setTimeout = (fn) => {
    scheduled.push(fn);
    return scheduled.length;
  };
  globalThis.clearTimeout = (timerId) => {
    cleared.push(timerId);
  };

  try {
    const liveRegion = new SoLiveRegion();

    liveRegion.hasAttribute = () => false;
    liveRegion.setAttribute = function(name, value) {
      this.attributes ??= new Map();
      this.attributes.set(name, String(value));
    };

    liveRegion.connectedCallback();
    assert.equal(liveRegion.attributes.get('role'), 'status');
    assert.equal(liveRegion.attributes.get('aria-live'), 'polite');
    assert.equal(liveRegion.attributes.get('aria-atomic'), 'true');

    liveRegion.announce('Updated');
    assert.equal(liveRegion.textContent, '');
    assert.equal(scheduled.length, 1);

    scheduled[0]();
    assert.equal(liveRegion.textContent, 'Updated');

    liveRegion.announce('Pending');
    liveRegion.disconnectedCallback();
    assert.equal(cleared.length > 0, true);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
});

test('variant controller selects matching variant id and emits change', async () => {
  const { SoVariantController } = await import(pathToFileURL(path.join(packageRoot, 'src/components/variant-controller.js')).href);

  const sizeSmall = new FakeNode();
  sizeSmall.name = 'options[Size]';
  sizeSmall.value = 'S';
  sizeSmall.checked = true;
  const sizeLarge = new FakeNode();
  sizeLarge.name = 'options[Size]';
  sizeLarge.value = 'L';
  sizeLarge.checked = false;
  const colorBlack = new FakeNode();
  colorBlack.name = 'options[Color]';
  colorBlack.value = 'Black';
  colorBlack.checked = true;
  const colorWhite = new FakeNode();
  colorWhite.name = 'options[Color]';
  colorWhite.value = 'White';
  colorWhite.checked = false;
  const hiddenInput = new FakeNode();
  const submitButton = new FakeNode({
    'data-add-to-cart-text': 'Add to cart',
    'data-sold-out-text': 'Sold out',
    'data-unavailable-text': 'Unavailable'
  });
  const script = new FakeNode();
  script.textContent = JSON.stringify([
    { id: 101, available: true, options: ['S', 'Black'] },
    { id: 102, available: false, options: ['L', 'Black'] }
  ]);
  const controller = new SoVariantController();
  const events = [];

  controller.querySelectorAll = (selector) => (selector === '[data-variant-option]' ? [sizeSmall, sizeLarge, colorBlack, colorWhite] : []);
  controller.querySelector = (selector) => {
    if (selector === '[name="id"]') return hiddenInput;
    if (selector === '[type="submit"]') return submitButton;
    if (selector === '[data-variant-json]') return script;
    return null;
  };
  controller.getAttribute = () => null;
  controller.dispatchEvent = (event) => {
    events.push(event);
    return true;
  };
  controller.toggleAttribute = (name, value) => {
    controller.unavailable = name === 'data-unavailable' && value;
  };

  controller.connectedCallback();
  assert.equal(hiddenInput.value, '101');
  assert.equal(controller.unavailable, false);
  assert.equal(submitButton.disabled, false);
  assert.equal(submitButton.textContent, 'Add to cart');

  sizeSmall.checked = false;
  sizeLarge.checked = true;
  sizeLarge.dispatch('change');

  assert.equal(hiddenInput.value, '102');
  assert.equal(controller.unavailable, true);
  assert.equal(submitButton.disabled, true);
  assert.equal(submitButton.textContent, 'Sold out');

  colorBlack.checked = false;
  colorWhite.checked = true;
  colorWhite.dispatch('change');

  assert.equal(hiddenInput.value, '');
  assert.equal(controller.unavailable, true);
  assert.equal(submitButton.disabled, true);
  assert.equal(submitButton.textContent, 'Unavailable');
  assert.equal(events.at(-1).type, 'so:variant:change');
});

test('product form submits ajax add-to-cart and restores busy state', async () => {
  const { SoProductForm } = await import(pathToFileURL(path.join(packageRoot, 'src/components/product-form.js')).href);
  const originalFetch = globalThis.fetch;
  const originalFormData = globalThis.FormData;
  const form = new FakeNode();
  const submitButton = new FakeNode();
  const hiddenInput = new FakeNode();
  hiddenInput.value = '101';
  const productForm = new SoProductForm();
  const events = [];

  globalThis.FormData = class FormData {
    constructor(source) {
      this.source = source;
    }
  };
  globalThis.fetch = async (url, options) => ({
    ok: true,
    url,
    options,
    json: async () => ({ id: 101 })
  });

  productForm.querySelector = (selector) => {
    if (selector === 'form') return form;
    if (selector === '[type="submit"]') return submitButton;
    return null;
  };
  form.querySelector = (selector) => (selector === '[name="id"]' ? hiddenInput : null);
  productForm.hasAttribute = (name) => name === 'ajax';
  productForm.toggleAttribute = (name, value) => {
    productForm.busy = name === 'aria-busy' && value;
  };
  productForm.dispatchEvent = (event) => {
    events.push(event);
    return true;
  };

  try {
    productForm.connectedCallback();

    let prevented = false;
    const submitHandler = Array.from(form.listeners.get('submit'))[0];
    await submitHandler({
      type: 'submit',
      preventDefault: () => {
        prevented = true;
      }
    });

    assert.equal(prevented, true);
    assert.equal(submitButton.disabled, false);
    assert.equal(productForm.busy, false);
    assert.equal(events.at(-1).type, 'so:cart:add');

    hiddenInput.value = '';
    prevented = false;
    await submitHandler({
      type: 'submit',
      preventDefault: () => {
        prevented = true;
      }
    });

    assert.equal(prevented, true);
    assert.equal(events.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.FormData = originalFormData;
  }
});

test('media gallery selects requested item and thumbnail state', async () => {
  const { SoMediaGallery } = await import(pathToFileURL(path.join(packageRoot, 'src/components/media-gallery.js')).href);
  const firstMedia = new FakeNode({ 'data-media-item': 'one' });
  const secondMedia = new FakeNode({ 'data-media-item': 'two' });
  const firstThumbnail = new FakeNode({ 'data-media-thumbnail': 'one' });
  const secondThumbnail = new FakeNode({ 'data-media-thumbnail': 'two' });
  const gallery = new SoMediaGallery();
  const previousDocument = globalThis.document;
  const fakeDocument = new FakeDocument();

  gallery.querySelectorAll = (selector) => {
    if (selector === '[data-media-thumbnail]') return [firstThumbnail, secondThumbnail];
    if (selector === '[data-media-item]') return [firstMedia, secondMedia];
    return [];
  };

  globalThis.document = fakeDocument;

  try {
    gallery.connectedCallback();
    assert.equal(firstMedia.hidden, false);
    assert.equal(secondMedia.hidden, true);
    assert.equal(firstThumbnail.getAttribute('aria-current'), 'true');

    secondThumbnail.dispatch('click');
    assert.equal(firstMedia.hidden, true);
    assert.equal(secondMedia.hidden, false);
    assert.equal(secondThumbnail.getAttribute('aria-current'), 'true');

    fakeDocument.listeners.get('so:variant:change').forEach((handler) => handler({ detail: { variant: { featured_media: { id: 'one' } } } }));
    assert.equal(firstMedia.hidden, false);
    assert.equal(secondMedia.hidden, true);
    assert.equal(firstThumbnail.getAttribute('aria-current'), 'true');
  } finally {
    globalThis.document = previousDocument;
  }
});

test('cart drawer opens from cart add event and closes from controls', async () => {
  const { SoCartDrawer } = await import(pathToFileURL(path.join(packageRoot, 'src/components/cart-drawer.js')).href);
  const trigger = new FakeNode({ 'aria-expanded': 'false' });
  trigger.selector = '[data-cart-drawer-trigger]';
  const closeButton = new FakeNode();
  const panel = new FakeNode();
  const drawer = new SoCartDrawer();
  const previousDocument = globalThis.document;
  const fakeDocument = new FakeDocument([trigger]);

  drawer.getAttribute = (name) => (name === 'trigger-selector' ? '[data-cart-drawer-trigger]' : null);
  drawer.hasAttribute = (name) => name === 'open' && drawer._open === true;
  drawer.setAttribute = (name) => {
    if (name === 'open') drawer._open = true;
  };
  drawer.removeAttribute = (name) => {
    if (name === 'open') drawer._open = false;
  };
  drawer.querySelector = (selector) => (selector === '[data-cart-drawer-panel]' ? panel : null);
  drawer.querySelectorAll = (selector) => (selector === '[data-cart-drawer-close]' ? [closeButton] : []);

  globalThis.document = fakeDocument;

  try {
    drawer.connectedCallback();
    assert.equal(panel.hidden, true);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');

    fakeDocument.listeners.get('so:cart:add').forEach((handler) => handler());
    assert.equal(drawer._open, true);
    assert.equal(panel.hidden, false);
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');

    closeButton.dispatch('click');
    assert.equal(drawer._open, false);
    assert.equal(panel.hidden, true);
  } finally {
    globalThis.document = previousDocument;
  }
});

test('cart items changes line quantity through cart ajax endpoint', async () => {
  const { SoCartItems } = await import(pathToFileURL(path.join(packageRoot, 'src/components/cart-items.js')).href);
  const originalFetch = globalThis.fetch;
  const previousDocument = globalThis.document;
  const decrease = new FakeNode({ 'data-cart-line': '2', 'data-cart-quantity': '1', 'data-cart-quantity-decrease': '' });
  const quantityValue = new FakeNode();
  quantityValue.textContent = '2';
  const priceTarget = new FakeNode();
  const currentPriceTarget = new FakeNode();
  const lineItem = new FakeNode({ 'data-cart-line': '2' });
  const subtotalTarget = new FakeNode();
  const countTarget = new FakeNode();
  const cartItems = new SoCartItems();
  const events = [];
  const requests = [];
  const fakeDocument = new FakeDocument();

  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        item_count: 2,
        total_price: 1700,
        items: [
          { quantity: 1, final_line_price: 500 },
          { quantity: 1, final_line_price: 1200 }
        ]
      })
    };
  };

  lineItem.querySelector = (selector) => {
    if (selector === '[data-cart-line-quantity-value]') return quantityValue;
    if (selector === '[data-cart-line-price]') return priceTarget;
    return null;
  };
  priceTarget.querySelector = (selector) => (selector === '.so-price' ? currentPriceTarget : null);
  lineItem.querySelectorAll = (selector) => (selector === '[data-cart-line]' ? [decrease] : []);
  cartItems.querySelector = (selector) => (selector === '[data-cart-line-item][data-cart-line="2"]' ? lineItem : null);
  cartItems.querySelectorAll = (selector) => {
    if (selector === '[data-cart-line][data-cart-quantity]') return [decrease];
    if (selector === '[data-cart-line-item]') return [lineItem];
    return [];
  };
  cartItems.getAttribute = (name) => (name === 'currency' ? 'USD' : null);
  cartItems.dispatchEvent = (event) => {
    events.push(event);
    return true;
  };
  cartItems.toggleAttribute = (name, value) => {
    cartItems.busy = name === 'aria-busy' && value;
  };
  fakeDocument.querySelectorAll = (selector) => {
    if (selector === 'so-cart-items') return [cartItems];
    if (selector === '[data-cart-count]') return [countTarget];
    if (selector === '[data-cart-subtotal]') return [subtotalTarget];
    return [];
  };
  globalThis.document = fakeDocument;

  try {
    cartItems.connectedCallback();

    let prevented = false;
    await Array.from(decrease.listeners.get('click'))[0]({
      currentTarget: decrease,
      preventDefault: () => {
        prevented = true;
      }
    });

    assert.equal(prevented, true);
    assert.equal(requests[0].url, '/cart/change.js');
    assert.equal(requests[0].options.method, 'POST');
    assert.equal(requests[0].options.headers['Content-Type'], 'application/json');
    assert.equal(requests[0].options.body, JSON.stringify({ line: 2, quantity: 1 }));
    assert.equal(decrease.disabled, false);
    assert.equal(cartItems.busy, false);
    assert.equal(quantityValue.textContent, '1');
    assert.equal(priceTarget.textContent, '');
    assert.equal(currentPriceTarget.textContent, '$12.00');
    assert.equal(countTarget.textContent, '2');
    assert.equal(subtotalTarget.textContent, '$17.00');
    assert.equal(decrease.getAttribute('data-cart-quantity'), '0');
    assert.equal(events.at(-1).type, 'so:cart:update');
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.document = previousDocument;
  }
});

test('quick add opens quick view for products with required options', async () => {
  const { SoQuickAdd } = await import(pathToFileURL(path.join(packageRoot, 'src/components/quick-add.js')).href);
  const trigger = new FakeNode();
  const quickAdd = new SoQuickAdd();
  const events = [];

  quickAdd.querySelector = (selector) => {
    if (selector === '[data-quick-add-open]') return trigger;
    return null;
  };
  quickAdd.hasAttribute = (name) => name === 'requires-options';
  quickAdd.getAttribute = (name) => (name === 'product-url' ? '/products/example' : null);
  quickAdd.dispatchEvent = (event) => {
    events.push(event);
    return true;
  };

  quickAdd.connectedCallback();

  let prevented = false;
  trigger.dispatch('click', {
    preventDefault: () => {
      prevented = true;
    }
  });

  assert.equal(prevented, true);
  assert.equal(events.at(-1).type, 'so:quick-view:open');
  assert.equal(events.at(-1).detail.productUrl, '/products/example');
});

test('share ignores native share cancellation', async () => {
  const { SoShare } = await import(pathToFileURL(path.join(packageRoot, 'src/components/share.js')).href);
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const payloads = [];
  const abortError = new Error('Share canceled');
  abortError.name = 'AbortError';

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      share: async (payload) => {
        payloads.push(payload);
        throw abortError;
      }
    }
  });

  const share = new SoShare();
  share.getAttribute = (name) => {
    if (name === 'url') return 'https://example.com/products/everyday-jacket';
    if (name === 'title') return 'Everyday Jacket';
    return null;
  };

  try {
    await assert.doesNotReject(() => share.share());
    assert.deepEqual(payloads, [{ title: 'Everyday Jacket', url: 'https://example.com/products/everyday-jacket' }]);
  } finally {
    if (previousNavigator) {
      Object.defineProperty(globalThis, 'navigator', previousNavigator);
    } else {
      delete globalThis.navigator;
    }
  }
});
