export const componentCatalog = [
  {
    name: 'so-disclosure',
    group: 'Navigation',
    status: 'ready',
    summary: 'Toggles one panel with aria-expanded state.',
    attributes: [
      { name: 'open', type: 'boolean', description: 'Starts with the panel visible.' }
    ],
    events: [],
    variants: [
      {
        name: 'Closed',
        notes: 'Default collapsed state.',
        html: `<so-disclosure class="so-disclosure">
  <button class="so-disclosure__toggle" type="button" data-disclosure-toggle>Shipping notes</button>
  <div class="so-disclosure__panel" data-disclosure-panel hidden>Ships in 2 business days with tracked delivery.</div>
</so-disclosure>`
      },
      {
        name: 'Open',
        notes: 'Use the open attribute for default expanded content.',
        html: `<so-disclosure class="so-disclosure" open>
  <button class="so-disclosure__toggle" type="button" data-disclosure-toggle>Care guide</button>
  <div class="so-disclosure__panel" data-disclosure-panel>Clean with a dry cloth and avoid direct heat.</div>
</so-disclosure>`
      }
    ]
  },
  {
    name: 'so-quantity',
    group: 'Commerce',
    status: 'ready',
    summary: 'Controls a number input with min, max, and step.',
    attributes: [],
    events: ['input', 'change'],
    variants: [
      {
        name: 'Product quantity',
        notes: 'Buttons dispatch input and change events after every step.',
        html: `<so-quantity class="so-quantity">
  <button class="so-quantity__button" type="button" data-quantity-decrease aria-label="Decrease quantity">-</button>
  <input class="so-quantity__input" type="number" name="quantity" min="1" max="12" step="1" value="1" aria-label="Quantity">
  <button class="so-quantity__button" type="button" data-quantity-increase aria-label="Increase quantity">+</button>
</so-quantity>`
      }
    ]
  },
  {
    name: 'so-drawer',
    group: 'Overlay',
    status: 'ready',
    summary: 'Opens a drawer from document triggers and closes with Escape or close controls.',
    attributes: [
      { name: 'trigger-selector', type: 'selector', description: 'Document selector for open triggers.' },
      { name: 'open', type: 'boolean', description: 'Reflects the current open state.' }
    ],
    events: [],
    variants: [
      {
        name: 'Navigation drawer',
        notes: 'The trigger can live outside the custom element.',
        html: `<button class="so-button" type="button" data-so-playground-drawer-trigger>Open drawer</button>
<so-drawer class="so-drawer" trigger-selector="[data-so-playground-drawer-trigger]">
  <aside class="so-drawer__panel" data-drawer-panel hidden>
    <button class="so-drawer__close" type="button" data-drawer-close>Close</button>
    <strong class="so-drawer__title">Menu</strong>
    <a class="so-drawer__link" href="#collections">Collections</a>
    <a class="so-drawer__link" href="#journal">Journal</a>
  </aside>
</so-drawer>`
      }
    ]
  },
  {
    name: 'so-modal',
    group: 'Overlay',
    status: 'ready',
    summary: 'Toggles modal visibility and closes on Escape.',
    attributes: [
      { name: 'open', type: 'boolean', description: 'Displays the modal shell.' }
    ],
    events: [],
    variants: [
      {
        name: 'Open dialog',
        notes: 'Useful for product notices and quick overlays.',
        html: `<so-modal class="so-modal" open>
  <div class="so-modal__panel">
    <button class="so-modal__close" type="button" data-modal-close>Close</button>
    <h3>Size guide</h3>
    <p>Medium fits chest 38-40 in. Large fits chest 41-43 in.</p>
  </div>
</so-modal>`
      }
    ]
  },
  {
    name: 'so-accordion',
    group: 'Navigation',
    status: 'ready',
    summary: 'Manages multiple independent disclosure rows.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'FAQ rows',
        notes: 'Each row owns a toggle and panel pair.',
        html: `<so-accordion class="so-accordion">
  <div class="so-accordion__item" data-accordion-item>
    <button class="so-accordion__toggle" type="button" data-accordion-toggle aria-expanded="true">Materials</button>
    <div class="so-accordion__panel" data-accordion-panel>Organic cotton shell with recycled lining.</div>
  </div>
  <div class="so-accordion__item" data-accordion-item>
    <button class="so-accordion__toggle" type="button" data-accordion-toggle aria-expanded="false">Returns</button>
    <div class="so-accordion__panel" data-accordion-panel hidden>Return unused items within 30 days.</div>
  </div>
</so-accordion>`
      }
    ]
  },
  {
    name: 'so-tabs',
    group: 'Navigation',
    status: 'ready',
    summary: 'Switches tab panels using ARIA tab roles.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'Product tabs',
        notes: 'Tabs map to panels through aria-controls.',
        html: `<so-tabs class="so-tabs">
  <div class="so-tabs__list" role="tablist">
    <button class="so-tabs__tab" role="tab" aria-selected="true" aria-controls="tab-fit">Fit</button>
    <button class="so-tabs__tab" role="tab" aria-selected="false" aria-controls="tab-care">Care</button>
  </div>
  <div class="so-tabs__panel" id="tab-fit" role="tabpanel">Relaxed fit with a structured shoulder.</div>
  <div class="so-tabs__panel" id="tab-care" role="tabpanel" hidden>Machine wash cold, line dry.</div>
</so-tabs>`
      }
    ]
  },
  {
    name: 'so-toast',
    group: 'Feedback',
    status: 'ready',
    summary: 'Shows a temporary message and auto-hides after duration.',
    attributes: [
      { name: 'duration', type: 'number', description: 'Auto-hide delay in milliseconds.' },
      { name: 'open', type: 'boolean', description: 'Reflects visible state.' }
    ],
    events: [],
    variants: [
      {
        name: 'Open message',
        notes: 'The API is element.show(message).',
        html: `<button class="so-button" type="button" onclick="this.nextElementSibling.show('Added to cart')">Show toast</button>
<so-toast duration="2400">Ready</so-toast>`
      }
    ]
  },
  {
    name: 'so-live-region',
    group: 'Feedback',
    status: 'ready',
    summary: 'Creates a polite live region and exposes announce(message).',
    attributes: [
      { name: 'role', type: 'string', description: 'Defaults to status.' },
      { name: 'aria-live', type: 'string', description: 'Defaults to polite.' },
      { name: 'aria-atomic', type: 'boolean', description: 'Defaults to true.' }
    ],
    events: [],
    variants: [
      {
        name: 'Status announcer',
        notes: 'Use from cart, search, and async form flows.',
        html: `<button class="so-button" type="button" onclick="this.nextElementSibling.announce('Cart updated')">Announce</button>
<so-live-region></so-live-region>`
      }
    ]
  },
  {
    name: 'so-variant-controller',
    group: 'Product',
    status: 'ready',
    summary: 'Finds a variant from selected option inputs and syncs a product form.',
    attributes: [
      { name: 'product-form-id', type: 'id', description: 'Form id containing the variant input and submit button.' },
      { name: 'data-unavailable', type: 'boolean', description: 'Set when no matching available variant exists.' }
    ],
    events: ['so:variant:change'],
    variants: [
      {
        name: 'Radio options',
        notes: 'Variant JSON follows Shopify variant option shape.',
        html: `<form id="so-playground-product-form" class="so-product-form">
  <input type="hidden" name="id" value="1001">
  <button class="so-button so-product-form__submit" type="submit" data-add-to-cart-text="Add to cart" data-sold-out-text="Sold out" data-unavailable-text="Unavailable">Add to cart</button>
</form>
<so-variant-controller class="so-variant-picker" product-form-id="so-playground-product-form">
  <fieldset class="so-variant-picker__group">
    <legend class="so-variant-picker__legend">Size</legend>
    <div class="so-variant-picker__values">
      <label class="so-variant-picker__value">
        <input class="so-variant-picker__input" type="radio" name="Size" value="S" data-variant-option checked>
        <span>Small</span>
      </label>
      <label class="so-variant-picker__value">
        <input class="so-variant-picker__input" type="radio" name="Size" value="M" data-variant-option>
        <span>Medium</span>
      </label>
    </div>
  </fieldset>
  <script type="application/json" data-variant-json>[{"id":1001,"available":true,"options":["S"]},{"id":1002,"available":false,"options":["M"]}]</script>
</so-variant-controller>`
      }
    ]
  },
  {
    name: 'so-product-form',
    group: 'Commerce',
    status: 'ready',
    summary: 'Submits add-to-cart forms normally or through AJAX.',
    attributes: [
      { name: 'ajax', type: 'boolean', description: 'Posts to /cart/add.js and emits cart events.' },
      { name: 'aria-busy', type: 'boolean', description: 'Set while an AJAX request is pending.' }
    ],
    events: ['so:cart:add', 'so:cart:error'],
    variants: [
      {
        name: 'Ajax add',
        notes: 'The playground prevents the network submit while preserving markup.',
        html: `<so-product-form ajax>
  <form class="so-product-form" action="/cart/add" method="post">
    <input type="hidden" name="id" value="1001">
    <input type="hidden" name="quantity" value="1">
    <button class="so-button so-product-form__submit" type="submit">Add to cart</button>
  </form>
</so-product-form>`
      }
    ]
  },
  {
    name: 'so-media-gallery',
    group: 'Product',
    status: 'ready',
    summary: 'Switches visible media and reacts to variant featured media.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'Thumbnail gallery',
        notes: 'Use matching data-media-thumbnail and data-media-item values.',
        html: `<so-media-gallery class="so-media-gallery">
  <div class="so-media-gallery__stage">
    <div class="so-media-gallery__item so-media-gallery__placeholder" data-media-item="media-1">Front image</div>
    <div class="so-media-gallery__item so-media-gallery__placeholder" data-media-item="media-2" hidden>Detail image</div>
  </div>
  <div class="so-media-gallery__thumbnails">
    <button class="so-media-gallery__thumbnail" type="button" data-media-thumbnail="media-1" aria-current="true">Front</button>
    <button class="so-media-gallery__thumbnail" type="button" data-media-thumbnail="media-2">Detail</button>
  </div>
</so-media-gallery>`
      }
    ]
  },
  {
    name: 'so-sticky-buy-bar',
    group: 'Commerce',
    status: 'ready',
    summary: 'Shows a sticky purchase bar when the target product form is out of view.',
    attributes: [
      { name: 'target-selector', type: 'selector', description: 'Element observed by IntersectionObserver.' }
    ],
    events: [],
    variants: [
      {
        name: 'Buy bar shell',
        notes: 'Falls back to visible when observation is unavailable.',
        html: `<div id="so-playground-buy-target" class="so-product-form">Primary product form target</div>
<so-sticky-buy-bar target-selector="#so-playground-buy-target">
  <div class="so-page-width so-sticky-buy-bar__inner">
    <span class="so-sticky-buy-bar__title">Everyday Jacket</span>
    <button class="so-button" type="button">Add</button>
  </div>
</so-sticky-buy-bar>`
      }
    ]
  },
  {
    name: 'so-sticky-header',
    group: 'Navigation',
    status: 'ready',
    summary: 'Reflects scroll position with scrolled and scrolling-down attributes.',
    attributes: [
      { name: 'threshold', type: 'number', description: 'Scroll Y offset before scrolled is set.' },
      { name: 'scrolled', type: 'boolean', description: 'Set after threshold.' },
      { name: 'scrolling-down', type: 'boolean', description: 'Set while scrolling downward past threshold.' }
    ],
    events: [],
    variants: [
      {
        name: 'Header wrapper',
        notes: 'In a theme this wraps the site header.',
        html: `<so-sticky-header class="so-site-header" threshold="8">
  <div class="so-page-width so-site-header__inner">
    <strong class="so-site-header__brand">SO Supply</strong>
    <nav class="so-site-header__nav"><a href="#new">New</a><a href="#sale">Sale</a></nav>
  </div>
</so-sticky-header>`
      }
    ]
  },
  {
    name: 'so-localization',
    group: 'Forms',
    status: 'ready',
    summary: 'Submits a localization form when a select changes.',
    attributes: [],
    events: ['submit'],
    variants: [
      {
        name: 'Country selector',
        notes: 'Use with Shopify localization forms.',
        html: `<so-localization class="so-localization">
  <form class="so-localization__form" action="/localization" method="post">
    <label class="so-localization__label">Market<select class="so-localization__select" name="country_code"><option value="US">United States</option><option value="CA">Canada</option></select></label>
  </form>
</so-localization>`
      }
    ]
  },
  {
    name: 'so-cart-drawer',
    group: 'Commerce',
    status: 'ready',
    summary: 'Cart-specific drawer that also opens after so:cart:add.',
    attributes: [
      { name: 'trigger-selector', type: 'selector', description: 'Document selector for cart triggers.' },
      { name: 'open', type: 'boolean', description: 'Reflects visible cart state.' }
    ],
    events: [],
    variants: [
      {
        name: 'Mini cart',
        notes: 'Can be opened by cart button or add-to-cart events.',
        html: `<button class="so-button" type="button" data-so-playground-cart-trigger>Open cart</button>
<so-cart-drawer trigger-selector="[data-so-playground-cart-trigger]">
  <aside class="so-cart-drawer__panel" data-cart-drawer-panel hidden>
    <header class="so-cart-drawer__header">
      <h2 class="so-cart-drawer__title">Cart</h2>
      <button class="so-cart-drawer__close" type="button" data-cart-drawer-close>Close</button>
    </header>
    <div class="so-cart-drawer__items">
      <p class="so-cart-drawer__empty"><span data-cart-count>2</span> items ready for checkout.</p>
    </div>
  </aside>
</so-cart-drawer>`
      }
    ]
  },
  {
    name: 'so-cart-items',
    group: 'Commerce',
    status: 'ready',
    summary: 'Handles cart line quantity changes and updates cart chrome.',
    attributes: [
      { name: 'currency', type: 'string', description: 'ISO currency for formatted line totals.' },
      { name: 'aria-busy', type: 'boolean', description: 'Set while a cart change request is pending.' }
    ],
    events: ['so:cart:update', 'so:cart:error'],
    variants: [
      {
        name: 'Line controls',
        notes: 'Buttons map to Shopify cart line numbers.',
        html: `<so-cart-items class="so-cart-page__items" currency="USD">
  <div class="so-cart-line" data-cart-line-item data-cart-line="1">
    <div class="so-cart-line__content">
      <div class="so-cart-line__header">
        <span class="so-cart-line__title">Canvas Tote</span>
        <span data-cart-line-price><span class="so-price__current">$58.00</span></span>
      </div>
      <div class="so-cart-line__quantity">
        <button class="so-cart-line__quantity-button" type="button" data-cart-line="1" data-cart-quantity="1" data-cart-quantity-decrease>Minus</button>
        <span class="so-cart-line__quantity-value" data-cart-line-quantity-value>2</span>
        <button class="so-cart-line__quantity-button" type="button" data-cart-line="1" data-cart-quantity="3" data-cart-quantity-increase>Plus</button>
      </div>
    </div>
  </div>
</so-cart-items>`
      }
    ]
  },
  {
    name: 'so-predictive-search',
    group: 'Search',
    status: 'ready',
    summary: 'Debounces input, fetches Shopify predictive search JSON, and renders results.',
    attributes: [
      { name: 'data-loading-text', type: 'string', description: 'Status text during fetch.' },
      { name: 'data-ready-text', type: 'string', description: 'Status text after results render.' },
      { name: 'data-empty-text', type: 'string', description: 'Status text when no results exist.' },
      { name: 'data-error-text', type: 'string', description: 'Status text on request failure.' }
    ],
    events: ['so:predictive-search:results', 'so:predictive-search:error'],
    variants: [
      {
        name: 'Search box',
        notes: 'Network calls are intercepted in this playground.',
        html: `<so-predictive-search class="so-site-header__search" data-loading-text="Searching" data-ready-text="Results ready" data-empty-text="No matches" data-error-text="Search unavailable">
  <input class="so-predictive-search__input" type="search" data-predictive-search-input placeholder="Search products">
  <p class="so-predictive-search__status" data-predictive-search-status></p>
  <ul class="so-predictive-search__results" data-predictive-search-results hidden></ul>
</so-predictive-search>`
      }
    ]
  },
  {
    name: 'so-facets',
    group: 'Collection',
    status: 'ready',
    summary: 'Applies filter form values to the current URL.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'Filter form',
        notes: 'The playground blocks navigation after change.',
        html: `<so-facets>
  <form class="so-facets__form">
    <details class="so-facets__group" open>
      <summary class="so-facets__summary">Availability</summary>
      <div class="so-facets__values">
        <label class="so-facets__value"><input type="checkbox" name="filter.p.vendor" value="SO Studio"> SO Studio</label>
        <label class="so-facets__value"><input type="checkbox" name="filter.v.availability" value="1"> In stock</label>
      </div>
    </details>
  </form>
</so-facets>`
      }
    ]
  },
  {
    name: 'so-sort',
    group: 'Collection',
    status: 'ready',
    summary: 'Updates sort_by in the current URL and resets page.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'Sort select',
        notes: 'Use Shopify sort_by values.',
        html: `<so-sort class="so-sort">
  <label class="so-sort__label" for="so-playground-sort">Sort by</label>
  <select id="so-playground-sort" name="sort_by">
    <option value="manual">Featured</option>
    <option value="price-ascending">Price, low to high</option>
    <option value="created-descending">Newest</option>
  </select>
</so-sort>`
      }
    ]
  },
  {
    name: 'so-quick-add',
    group: 'Commerce',
    status: 'ready',
    summary: 'Submits quick add or emits quick view open for products requiring options.',
    attributes: [
      { name: 'ajax', type: 'boolean', description: 'Posts directly to /cart/add.js.' },
      { name: 'requires-options', type: 'boolean', description: 'Opens quick view instead of direct add.' },
      { name: 'product-url', type: 'url', description: 'URL passed to quick view events.' }
    ],
    events: ['so:cart:add', 'so:cart:error', 'so:quick-view:open'],
    variants: [
      {
        name: 'Requires options',
        notes: 'This variant emits so:quick-view:open.',
        html: `<so-quick-add class="so-quick-add" requires-options product-url="/products/everyday-jacket">
  <a class="so-button" href="/products/everyday-jacket" data-quick-add-open>Choose options</a>
</so-quick-add>`
      },
      {
        name: 'Direct ajax add',
        notes: 'For single-variant products.',
        html: `<so-quick-add class="so-quick-add" ajax>
  <form class="so-product-form" action="/cart/add" method="post">
    <input type="hidden" name="id" value="1001">
    <button class="so-button" type="submit">Quick add</button>
  </form>
</so-quick-add>`
      }
    ]
  },
  {
    name: 'so-carousel',
    group: 'Media',
    status: 'ready',
    summary: 'Scrolls a horizontal track with previous and next buttons.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'Product rail',
        notes: 'Track scroll distance follows its own width.',
        html: `<so-carousel class="so-carousel">
  <button class="so-carousel__button" type="button" data-carousel-prev aria-label="Previous">Prev</button>
  <div class="so-carousel__track" data-carousel-track>
    <div class="so-carousel__item">Jacket</div><div class="so-carousel__item">Tote</div><div class="so-carousel__item">Cap</div><div class="so-carousel__item">Notebook</div>
  </div>
  <button class="so-carousel__button" type="button" data-carousel-next aria-label="Next">Next</button>
</so-carousel>`
      }
    ]
  },
  {
    name: 'so-quick-view',
    group: 'Overlay',
    status: 'ready',
    summary: 'Opens from so:quick-view:open, manages open/close state with Escape support.',
    attributes: [
      { name: 'open', type: 'boolean', description: 'Reflects visible quick view state.' },
      { name: 'product-url', type: 'url', description: 'Set when opened with a product URL.' }
    ],
    events: ['so:quick-view:opened'],
    variants: [
      {
        name: 'Event opened',
        notes: 'Opens the modal shell on so:quick-view:open; consumer renders product content into data-quick-view-content.',
        html: `<button class="so-button" type="button" onclick="document.dispatchEvent(new CustomEvent('so:quick-view:open', { detail: { productUrl: '/products/everyday-jacket' } }))">Open quick view</button>
<so-quick-view class="so-quick-view">
  <div class="so-modal__panel" data-quick-view-content>
    <button class="so-modal__close" type="button" data-quick-view-close>Close</button>
    <h3>Quick view</h3>
    <p>Product content rendered by the consumer after so:quick-view:opened.</p>
  </div>
</so-quick-view>`
      }
    ]
  },
  {
    name: 'so-product-card',
    group: 'Product',
    status: 'ready',
    summary: 'Semantic product card wrapper with media click and product URL helpers.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'Catalog card',
        notes: 'Uses data-product-card-media and data-product-card-title for click targets. Exposes getProductUrl().',
        html: `<so-product-card class="so-card">
  <a class="so-card__media" href="/products/everyday-jacket" data-product-card-media aria-label="Everyday Jacket">
    <div class="so-card__image so-card__placeholder">Image</div>
  </a>
  <div class="so-card__content">
    <h3 class="so-card__title" data-product-card-title><a href="/products/everyday-jacket">Everyday Jacket</a></h3>
    <span class="so-price__current">$148.00</span>
  </div>
</so-product-card>`
      }
    ]
  },
  {
    name: 'so-swatches',
    group: 'Product',
    status: 'ready',
    summary: 'Manages pressed state for swatch buttons and emits selected value.',
    attributes: [],
    events: ['so:swatch:change'],
    variants: [
      {
        name: 'Color swatches',
        notes: 'Use data-swatch-value for the emitted value.',
        html: `<so-swatches class="so-swatches">
  <button class="so-swatches__swatch" type="button" data-swatch-value="Olive" aria-pressed="true" style="--so-swatch: #596b49;">Olive</button>
  <button class="so-swatches__swatch" type="button" data-swatch-value="Navy" aria-pressed="false" style="--so-swatch: #27384f;">Navy</button>
  <button class="so-swatches__swatch" type="button" data-swatch-value="Clay" aria-pressed="false" style="--so-swatch: #9b6a4f;">Clay</button>
</so-swatches>`
      }
    ]
  },
  {
    name: 'so-infinite-list',
    group: 'Collection',
    status: 'ready',
    summary: 'Fetches next page HTML, appends items into the grid, and updates the next link.',
    attributes: [
      { name: 'ajax', type: 'boolean', description: 'Enables fetch instead of normal link navigation.' },
      { name: 'aria-busy', type: 'boolean', description: 'Set while fetch is pending.' }
    ],
    events: ['so:infinite-list:load'],
    variants: [
      {
        name: 'Load more',
        notes: 'Fetches HTML, extracts [data-infinite-item] elements, and appends to the grid. Next link updates automatically.',
        html: `<so-infinite-list class="so-infinite-list" ajax>
  <div class="so-product-grid so-grid" data-infinite-items>
    <div class="so-card" data-infinite-item="1"><div class="so-card__content">Product 1</div></div>
    <div class="so-card" data-infinite-item="2"><div class="so-card__content">Product 2</div></div>
  </div>
  <a class="so-button" href="/collections/all?page=2" data-infinite-next>Load more</a>
</so-infinite-list>`
      }
    ]
  },
  {
    name: 'so-deferred-media',
    group: 'Media',
    status: 'ready',
    summary: 'Defers iframe/video markup until the user requests it.',
    attributes: [
      { name: 'loaded', type: 'boolean', description: 'Set after template content is injected.' }
    ],
    events: [],
    variants: [
      {
        name: 'Video placeholder',
        notes: 'The template can hold iframe, video, or model-viewer markup.',
        html: `<so-deferred-media class="so-deferred-media">
  <button class="so-button" type="button" data-deferred-media-load>Load media</button>
  <template><div class="so-deferred-media__frame">Deferred media loaded</div></template>
</so-deferred-media>`
      }
    ]
  },
  {
    name: 'so-recipient-form',
    group: 'Forms',
    status: 'ready',
    summary: 'Shows gift-recipient fields when the recipient toggle is checked.',
    attributes: [],
    events: [],
    variants: [
      {
        name: 'Gift card recipient',
        notes: 'Use with Shopify gift card recipient properties.',
        html: `<so-recipient-form class="so-recipient-form">
  <label class="so-recipient-form__toggle"><input type="checkbox" data-recipient-toggle> Send as a gift</label>
  <div class="so-recipient-form__fields" data-recipient-fields hidden>
    <input class="so-recipient-form__input" name="properties[Recipient email]" placeholder="recipient@example.com">
    <textarea class="so-recipient-form__input" name="properties[Message]" placeholder="Short message"></textarea>
  </div>
</so-recipient-form>`
      }
    ]
  },
  {
    name: 'so-pickup-availability',
    group: 'Commerce',
    status: 'ready',
    summary: 'Fetches pickup availability for a variant and renders loading/empty/error states.',
    attributes: [
      { name: 'variant-id', type: 'id', description: 'Shopify variant id used to request pickup availability.' },
      { name: 'data-loading', type: 'boolean', description: 'Set while the availability request is pending.' }
    ],
    events: [],
    variants: [
      {
        name: 'Pickup lookup',
        notes: 'Auto-fetches on connect. Call refresh(variantId) to re-check.',
        html: `<so-pickup-availability class="so-pickup-availability" variant-id="1001">
  <strong class="so-pickup-availability__title">Pickup availability</strong>
  <p class="so-pickup-availability__loading" data-pickup-loading hidden>Checking stores…</p>
  <div class="so-pickup-availability__list" data-pickup-list></div>
  <p class="so-pickup-availability__empty" data-pickup-empty hidden>No stores nearby.</p>
  <p class="so-pickup-availability__error" data-pickup-error hidden></p>
</so-pickup-availability>`
      }
    ]
  },
  {
    name: 'so-share',
    group: 'Feedback',
    status: 'ready',
    summary: 'Uses navigator.share when available, otherwise copies the URL.',
    attributes: [
      { name: 'url', type: 'url', description: 'URL to share or copy.' },
      { name: 'title', type: 'string', description: 'Title passed to native share.' }
    ],
    events: [],
    variants: [
      {
        name: 'Share button',
        notes: 'Native share availability depends on the browser.',
        html: `<so-share class="so-share" url="https://example.com/products/everyday-jacket" title="Everyday Jacket">
  <button class="so-button so-share__button" type="button" data-share-button>Share product</button>
</so-share>`
      }
    ]
  }
];

export function getComponentByName(name) {
  return componentCatalog.find((component) => component.name === name) ?? componentCatalog[0];
}
