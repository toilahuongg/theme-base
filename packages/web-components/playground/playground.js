import { componentCatalog, getComponentByName } from './components.js';

const state = {
  selectedName: new URLSearchParams(window.location.search).get('component') || componentCatalog[0].name,
  selectedVariant: 0,
  query: ''
};

const refs = {
  list: document.querySelector('#component-list'),
  search: document.querySelector('#component-search'),
  group: document.querySelector('#component-group'),
  name: document.querySelector('#component-name'),
  summary: document.querySelector('#component-summary'),
  status: document.querySelector('#component-status'),
  variantSelect: document.querySelector('#variant-select'),
  reset: document.querySelector('#reset-preview'),
  notes: document.querySelector('#variant-notes'),
  preview: document.querySelector('#preview-root'),
  code: document.querySelector('#usage-code'),
  attributes: document.querySelector('#attribute-list'),
  events: document.querySelector('#event-list'),
  eventLog: document.querySelector('#event-log')
};

const demoFetch = async (url) => {
  const href = String(url);

  if (href.includes('/search/suggest.json')) {
    return jsonResponse({
      resources: {
        results: {
          products: [
            { title: 'Everyday Jacket', url: '/products/everyday-jacket' },
            { title: 'Canvas Tote', url: '/products/canvas-tote' }
          ],
          collections: [{ title: 'Field Goods', url: '/collections/field-goods' }]
        }
      }
    });
  }

  if (href.includes('/cart/add.js')) {
    return jsonResponse({ id: 1001, title: 'Everyday Jacket', quantity: 1 });
  }

  if (href.includes('/cart/change.js')) {
    return jsonResponse({
      item_count: 2,
      total_price: 11600,
      items: [{ quantity: 2, final_line_price: 5800, original_line_price: 5800 }]
    });
  }

  return new Response('<div data-infinite-items><div class="demo-product-card">Loaded product</div></div>', {
    headers: { 'Content-Type': 'text/html' }
  });
};

window.fetch = demoFetch;

function jsonResponse(payload) {
  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function renderList() {
  const groups = new Map();
  const filtered = componentCatalog.filter((component) => {
    const haystack = `${component.name} ${component.group} ${component.summary}`.toLowerCase();
    return haystack.includes(state.query.toLowerCase());
  });

  filtered.forEach((component) => {
    if (!groups.has(component.group)) groups.set(component.group, []);
    groups.get(component.group).push(component);
  });

  refs.list.innerHTML = '';

  for (const [group, components] of groups) {
    const section = document.createElement('section');
    const heading = document.createElement('h3');
    heading.textContent = group;
    section.append(heading);

    components.forEach((component) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'component-button';
      button.toggleAttribute('aria-current', component.name === state.selectedName);
      button.innerHTML = `<span>${component.name}</span><small>${component.status}</small>`;
      button.addEventListener('click', () => selectComponent(component.name));
      section.append(button);
    });

    refs.list.append(section);
  }
}

function selectComponent(name) {
  state.selectedName = name;
  state.selectedVariant = 0;
  const url = new URL(window.location.href);
  url.searchParams.set('component', name);
  window.history.replaceState({}, '', url);
  render();
}

function render() {
  const component = getComponentByName(state.selectedName);
  const variant = component.variants[state.selectedVariant] || component.variants[0];

  refs.group.textContent = component.group;
  refs.name.textContent = component.name;
  refs.summary.textContent = component.summary;
  refs.status.textContent = component.status;
  refs.status.dataset.status = component.status;
  refs.notes.textContent = variant.notes || '';

  refs.variantSelect.innerHTML = component.variants.map((item, index) => {
    const selected = index === state.selectedVariant ? ' selected' : '';
    return `<option value="${index}"${selected}>${escapeHtml(item.name)}</option>`;
  }).join('');

  refs.preview.innerHTML = variant.html;
  refs.code.textContent = variant.html.trim();
  refs.attributes.innerHTML = renderMeta(component.attributes, 'No attributes required.');
  refs.events.innerHTML = renderMeta(component.events.map((event) => ({ name: event, type: 'event', description: 'Dispatched by the component.' })), 'No custom events.');
  refs.eventLog.innerHTML = '<span>Event log is waiting for interaction.</span>';

  renderList();
}

function renderMeta(items, emptyText) {
  if (!items.length) {
    return `<p class="empty">${emptyText}</p>`;
  }

  return items.map((item) => `<div class="meta-row">
    <strong>${escapeHtml(item.name)}</strong>
    <span>${escapeHtml(item.type || '')}</span>
    <p>${escapeHtml(item.description || '')}</p>
  </div>`).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function logEvent(event) {
  const name = event.type;
  if (!name.startsWith('so:')) return;

  refs.eventLog.innerHTML = '';
  const row = document.createElement('span');
  row.textContent = `${name} ${event.detail ? JSON.stringify(event.detail) : ''}`;
  refs.eventLog.append(row);
}

refs.search.addEventListener('input', (event) => {
  state.query = event.currentTarget.value;
  renderList();
});

refs.variantSelect.addEventListener('change', (event) => {
  state.selectedVariant = Number(event.currentTarget.value) || 0;
  render();
});

refs.reset.addEventListener('click', render);

refs.preview.addEventListener('submit', (event) => event.preventDefault());
refs.preview.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (link) event.preventDefault();
});

document.addEventListener('so:cart:add', logEvent);
document.addEventListener('so:cart:error', logEvent);
document.addEventListener('so:cart:update', logEvent);
document.addEventListener('so:variant:change', logEvent);
document.addEventListener('so:predictive-search:results', logEvent);
document.addEventListener('so:predictive-search:error', logEvent);
document.addEventListener('so:quick-view:open', logEvent);
document.addEventListener('so:quick-view:opened', logEvent);
document.addEventListener('so:swatch:change', logEvent);
document.addEventListener('so:infinite-list:load', logEvent);

render();
