# Feature Inventory — Example (filled)

Realistic filled inventory for a Dawn-derived theme with common third-party additions. Copy the shape, not the content. Classes follow references/classification-guide.md. This example demonstrates all seven classes, multi-file features merged into one block, and split features (header) separated into their own blocks.

---

# Feature Inventory

| | |
|---|---|
| Theme (source): | "Dawn 15.0.0 (forked, heavily customized)" |
| Theme root: | /Users/devhugon/Desktop/Workspaces/miso-apps/theme-base |
| Analyst date: | 2026-09-08 |
| Product spec consulted: | store-brief-2026.md (premium apparel, conversion-focused) |
| Detector run: | node scripts/detect-features.mjs . |

## Classification legend

- CORE — must keep (load-bearing). keep_concept: true, keep_implementation: true
- VALUABLE — keep concept, rebuild implementation. keep_concept: true, keep_implementation: false
- GENERIC — standard feature, rebuild per new architecture. keep_concept: true, keep_implementation: false
- REDESIGN — concept worth keeping, needs new UX. keep_concept: true, keep_implementation: false
- REMOVE — no value. keep_concept: false, keep_implementation: false
- APP-LIKE — belongs in an app, not a theme. keep_concept: false, keep_implementation: false
- RISKY — licensing/performance/a11y risk. keep_concept: judgment, keep_implementation: false

## Inventory

```yaml
features:
  - id: header_navigation
    name: Header Navigation
    class: CORE
    keep_concept: true
    keep_implementation: true
    files:
      - sections/header.liquid
      - snippets/navigation.liquid
      - assets/header.js
    settings: [enable_sticky_header, logo_position, menu]
    templates: []
    rationale: >
      Primary wayfinding for the entire store; logo, menu, search trigger,
      and cart trigger. Load-bearing and carried into the new theme
      (rebuilt by the architect only where the new architecture demands).

  - id: mega_menu
    name: Mega Menu
    class: REDESIGN
    keep_concept: true
    keep_implementation: false
    files:
      - sections/header.liquid
      - snippets/mega-menu.liquid
      - assets/mega-menu.js
    settings: [enable_mega_menu, mega_menu_columns]
    templates: []
    rationale: >
      Shoppers need multi-column category discovery from the nav, and the
      concept stays, but the interaction is hover-only with no focus
      management or Escape handling, which fails keyboard users. Rebuilt as
      a keyboard-accessible disclosure or click-to-open menu.

  - id: predictive_search
    name: Predictive Search
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/predictive-search.liquid
      - assets/predictive-search.js
    settings: [enable_predictive_search]
    templates: [search]
    rationale: >
      Instant product/collection results reduce search friction and are a
      real conversion driver. The current implementation mutates DOM from
      inline globals and is coupled to the legacy search snippet; rebuilt
      on the new search component.

  - id: quick_add
    name: Quick Add
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-card.liquid
      - sections/main-collection-product-grid.liquid
      - assets/quick-add.js
    settings: [enable_quick_add]
    templates: [collection]
    rationale: >
      One-tap add-to-cart from collection cards removes steps from the
      browse-to-buy flow. Implementation is coupled to the legacy card
      snippet and must be rebuilt on the new product card component.

  - id: quick_view
    name: Quick View
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/quick-view.liquid
      - sections/quick-view.liquid
      - assets/quick-view.js
    settings: [enable_quick_view]
    templates: [collection]
    rationale: >
      Lets shoppers inspect and add products without leaving the grid;
      concept is a keeper. Current modal nests a full product form with
      duplicate IDs, which breaks labels and form state; rebuilt as a
      proper dialog with unique IDs.

  - id: product_swatches
    name: Product Swatches
    class: REDESIGN
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-swatches.liquid
      - assets/swatches.js
    settings: [show_color_swatches]
    templates: [product, collection]
    rationale: >
      Shoppers need to compare color options at a glance; the concept
      stays. The current 24 px click targets and hover-only tooltips are
      cramped on mobile and fail touch users; rebuilt with a mobile-first
      picker and visible selected state.

  - id: sticky_atc
    name: Sticky Add-to-Cart Bar
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/sticky-atc.liquid
      - assets/sticky-atc.js
    settings: [enable_sticky_atc]
    templates: [product]
    rationale: >
      Keeps the purchase action reachable while scrolling long product
      pages; direct conversion support. Current bar breaks on the new
      product form and ignores reduced-motion preferences; rebuilt with
      the new form component and motion guard.

  - id: cart_drawer
    name: Cart Drawer
    class: CORE
    keep_concept: true
    keep_implementation: true
    files:
      - sections/cart-drawer.liquid
      - assets/cart-drawer.js
    settings: [enable_cart_drawer]
    templates: []
    rationale: >
      Drawer cart is the store's primary cart surface (checkout starts
      from it) and the pattern is retained in the new theme. Architecture
      refactors it onto the new drawer component but the feature and its
      interaction model are load-bearing.

  - id: free_shipping_bar
    name: Free Shipping Progress Bar
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/free-shipping-bar.liquid
      - assets/cart-drawer.js
    settings: [free_shipping_threshold]
    templates: []
    rationale: >
      Progress toward the free-shipping threshold measurably lifts AOV
      and belongs in the drawer cart. Current logic recomputes the
      threshold from a hardcoded setting and races the cart fetch; rebuilt
      with a single source of truth for threshold and cart totals.

  - id: product_recommendations
    name: Product Recommendations
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/product-recommendations.liquid
    settings: [recommendations_count]
    templates: [product]
    rationale: >
      Standard upsell surface every product theme ships; no bespoke logic
      worth preserving. Rebuilt on the native recommendations endpoint
      per the new architecture.

  - id: recently_viewed
    name: Recently Viewed Products
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/recently-viewed.liquid
      - assets/recently-viewed.js
    settings: [enable_recently_viewed]
    templates: [product]
    rationale: >
      Brings shoppers back to products they already considered; real
      retention value and fully theme-appropriate (localStorage-based,
      no server state). Current code stores raw handles and re-fetches
      per page; rebuilt with a compact storage schema and the new card.

  - id: size_chart
    name: Size Chart
    class: REDESIGN
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/size-chart.liquid
      - assets/size-chart.js
    settings: [size_chart_image, size_chart_page]
    templates: [product]
    rationale: >
      Sizing confidence is decisive for apparel conversion; concept stays.
      Current chart is a scaled image in a non-modal link that is
      unreadable on mobile and has no focus trap; rebuilt as a responsive,
      accessible dialog fed by a size-chart page or structured table.

  - id: countdown_timer
    name: Countdown Timer
    class: REMOVE
    keep_concept: false
    keep_implementation: false
    files:
      - sections/countdown-timer.liquid
      - assets/countdown-timer.js
    settings: [enable_countdown, countdown_date]
    templates: []
    rationale: >
      Artificial urgency with no inventory or pricing backing; adds noise
      and conflicts with the store's premium positioning. No template
      renders this section in any preset; dropped from the rebuild.

  - id: customer_reviews
    name: Customer Reviews
    class: APP-LIKE
    keep_concept: false
    keep_implementation: false
    files:
      - sections/reviews.liquid
      - assets/reviews.js
    settings: [reviews_api_key, reviews_widget_id]
    templates: [product]
    rationale: >
      Reviews require moderation, a data store, and merchant accounts —
      server-side concerns a theme cannot own. Verify the current Theme
      Store requirement (shopify.dev/docs/storefronts/themes/store-requirements)
      and move to an app surfaced as a theme app extension.

  - id: hero_carousel
    name: Homepage Hero Carousel (Slick)
    class: RISKY
    keep_concept: true
    keep_implementation: false
    files:
      - sections/hero-carousel.liquid
      - assets/vendor/slick.min.js
      - assets/vendor/slick.css
    settings: [carousel_autoplay, carousel_speed]
    templates: [index]
    rationale: >
      Concept (editorial hero rotation) is worth keeping, but the vendored
      Slick bundle has no license header in-repo and ships ~40 KB
      unminified JavaScript on every page. Verify provenance/license and
      current performance guidance before any reuse; rebuild on the new
      architecture instead.
```
