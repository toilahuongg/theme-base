# Theme Architecture — Example: Small-Batch Coffee Roaster

Realistic worked example of `docs/theme-architecture.md` for a specialty coffee roaster theme ("Roast & Ritual"). Shows the component graph and three component contracts. Niche-specific decisions are marked `[niche]`. This is an example, not the target output for a real store: re-derive every decision from the actual thesis, journeys, and design system.

## 1. Context

- Theme name: `ritual`
- Commerce thesis: The store sells small-batch coffee subscriptions and brewing gear. Conversion happens through a ritual-driven narrative: origin stories, roast profiles, and brewing guidance must carry the product, not discounting.
- Uniqueness commitments to enable: editorial product stream replaces the generic hero-carousel; collection discovery organizes by brew method and origin story; product page leads with the roast narrative before the buy box.
- Source theme status: Dawn-derived legacy (`docs/source-audit.md` lists `main-collection-product-grid`, `main-product`, `featured-product`, `product-grid-header` to be removed; no file is converted 1:1).

## 2. Verified current rules

Checked on `<YYYY-MM-DD>` at shopify.dev (architecture, templates/json-templates, sections, section-groups, settings/dynamic-sources, api/liquid, locales). Constraint notes: Liquid directories are flat (snippet clusters expressed via prefixes); subdirectories only under `assets/`; merchant-addable sections need presets; template/section limits verified at the URLs above.

## 3. Page map (template -> sections)

| Template file | Page | Sections (render order) | Chrome |
| --- | --- | --- | --- |
| `templates/index.json` | Home | `collection-discovery`, `editorial-product-stream`, `rich-text-ritual` | header-group / footer-group |
| `templates/product.json` | Product | `product-main`, `editorial-product-stream` (origin story block) | header-group / footer-group |
| `templates/collection.json` | Collection | `collection-discovery` | header-group / footer-group |
| `templates/blog.json` | Blog | `main-blog`, `editorial-product-stream` (featured) | header-group / footer-group |
| `templates/article.json` | Article | `main-article` | header-group / footer-group |
| `templates/page.json` | Page | `main-page`, `editorial-product-stream` | header-group / footer-group |
| `templates/cart.json` | Cart | `main-cart` | header-group / footer-group |
| `templates/search.json` | Search | `main-search`, `collection-discovery` (empty state) | header-group / footer-group |
| `templates/list-collections.json` | Collection list | `collection-discovery` | header-group / footer-group |
| `templates/404.json` | Not found | `main-404`, `editorial-product-stream` | header-group / footer-group |
| `templates/password.json` | Password | `main-password` (no groups) | none |

## 4. Component graph

```text
layout/
  theme.liquid                      # shell; groups; global.js + base.css + components/*.css
templates/                          # index, product, collection, blog, article, page,
                                    # cart, search, list-collections, 404, password (.json)
sections/
  header-group.json                 # header, announcement-bar
  footer-group.json                 # footer, newsletter
  header.liquid
  announcement-bar.liquid
  footer.liquid
  collection-discovery.liquid       # home hero + curated rail; collection template core
  editorial-product-stream.liquid   # editorial rows with inline product cards
  product-main.liquid               # media gallery + buy box + roast narrative
  rich-text-ritual.liquid           # ritual/story text block [niche]
  main-blog.liquid
  main-article.liquid
  main-page.liquid
  main-cart.liquid
  main-search.liquid
  main-404.liquid
  main-password.liquid
  newsletter.liquid
snippets/                           # flat; clusters via prefix
  product-card.liquid
  product-card-media.liquid
  product-card-actions.liquid       # quick add (custom element quick-add)
  price.liquid
  price-format.liquid
  media.liquid
  media-gallery.liquid
  variant-picker.liquid
  variant-picker-option.liquid
  variant-picker-selected-variant.liquid
  buy-buttons.liquid
  icons.liquid
  responsive-image.liquid
  social-links.liquid
assets/
  base.css                          # tokens + reset
  components/collection-discovery.css
  components/editorial-product-stream.css
  components/product-main.css
  components/product-card.css
  components/price.css
  components/media.css
  components/variant-picker.css
  global.js                         # delegated: cart drawer, sticky header, search overlay
  components/product-card.js        # quick-add element registration
  components/variant-picker.js      # variant-picker element registration
  components/media-gallery.js       # media-gallery element registration
config/
  settings_schema.json              # colors, type, layout, social
  settings_data.json
locales/
  en.default.json
  en.default.schema.json
```

## 5. File responsibility map (excerpt)

| File | Type | Responsibility | Consumes | Rendered from |
| --- | --- | --- | --- | --- |
| `layout/theme.liquid` | layout | Shell, `<html lang>`, fonts, base.css, deferred global.js | `shop`, `request`, `template`, `content_for_header`, `content_for_layout` | every page |
| `sections/collection-discovery.liquid` | section | Hero + curated product rail; on collection template acts as the collection grid; blocks: `collection_discovery--rail` (product source: collection or metaobject list) | `collection` (template context), `section.settings.heading/collection`, blocks `collection_discovery--rail` | `index.json`, `collection.json`, `list-collections.json`, `search.json` (empty state) |
| `sections/product-main.liquid` | section | Product page core: media gallery, roast narrative, buy box | `product`, `product.selected_or_first_available_variant`, `product.media`, metafields `custom.roast_notes`, `custom.origin` (dynamic-source settings) | `product.json` |
| `snippets/product-card.liquid` | snippet | Card shell composing media + price + actions; single source of truth for cards | `card_product`, `card_media`, `card_url`, `quick_add` (render args) | collection-discovery, editorial-product-stream, main-search |
| `snippets/price.liquid` | snippet | Money rendering incl. compare-at and unit price; reads `price`, `compare_at_price`, `unit_price`, `money` args only | render args from callers | product-card, product-main, buy-buttons, quick-order rows |
| `assets/components/variant-picker.js` | js | Custom element `variant-picker`; syncs hidden inputs in product form; emits `variant:change` | `[data-variant-picker]`, `product.variants` JSON in section data | registered only when `[data-variant-picker]` exists in DOM |
| `assets/components/product-card.css` | css | Card layout: media ratio, title clamp, price row | tokens from `base.css` | theme.liquid |

## 6. Data flow (excerpt)

### 6.1 Template context objects

| Object | Where it comes from | Components that read it |
| --- | --- | --- |
| `collection` | template context | collection-discovery, product-card (via `collection.products`) |
| `product` | template context | product-main, product-card, editorial-product-stream, variant-picker |
| `search` | template context | main-search (results -> product-card) |
| `cart` | template context | main-cart, header cart drawer (global.js) |
| `shop`, `request`, `linklists` | global | layout, header, footer |

### 6.2 Settings consumption

| Component | Theme settings | Section settings | Block settings |
| --- | --- | --- | --- |
| collection-discovery | `color_accent` | `heading`, `collection` (product source), `show_quick_add` | `collection_discovery--rail`: `title`, `collection`, `products_limit` |
| product-main | `color_accent`, `type_heading` | `show_vendor`, `enable_image_zoom`, `roast_notes` (dynamic source text) | `product_main--media`: `media`, `image` |
| editorial-product-stream | `color_accent` | `heading`, `subheading`, `reverse` | `editorial_stream--entry`: `heading`, `text`, `image`, `product` |

### 6.3 Metafields and metaobjects

| Component | Metafield/metaobject | Namespace.type | Accessed via | Editor source |
| --- | --- | --- | --- | --- |
| product-main | roast notes | `custom.roast_notes` (single_line_text_field) | `product.metafields.custom.roast_notes` | section setting `roast_notes` connected as dynamic source |
| product-main | origin story | `custom.origin` -> metaobject `origin` (storefront visible) | `product.metafields.custom.origin.value.description` | metaobject setting `origin_story` (`"type": "metaobject"`) |
| collection-discovery | curated rails | metaobject type `curated_rail` | block setting `rail` (`metaobject` type) | block setting in theme editor |
| product-card | badge | `custom.badge_label` (single_line_text_field) | `card_product.metafields.custom.badge_label` | hardcoded read (merchant sets in admin, not editor) — documented tradeoff |

### 6.4 Loops, pagination, limits

| Loop | Source | Bound by | Items rendered |
| --- | --- | --- | --- |
| collection grid | `collection.products` | `paginate by 24` | 24 per page |
| curated rail | `rail.value.products` | `limit: products_limit` (default 6) | setting value |
| editorial inline cards | `section.blocks` | `for ... in section.blocks` (max_blocks 8) | block count |
| search results | `search.results` | `paginate by 24` | 24 per page |
| recommendations | `recommendations.products` | `limit: 4` | 4 |

## 7. Naming conventions

Sections kebab-case; snippet clusters prefix-first; setting ids snake_case from design vocabulary (`show_quick_add`, `products_limit`); block types `<section>--<block>` (`collection_discovery--rail`); assets kebab-case component-scoped; locale keys dotted namespace (`product_card.quick_add`, `variant_picker.choose_option`), standard Shopify keys reused (`products.product.add_to_cart`).

## 8. JS architecture

- Custom elements (stateful islands): `variant-picker` (option state, selected-variant sync), `media-gallery` (slide state, zoom), `quick-add` (mini cart line add). Each registered in `assets/components/<name>.js` only when `document.querySelector('[data-<name>]')` matches.
- Delegated listeners in `global.js`: cart drawer open/close, sticky header, search overlay, announcement dismissal — one-time listeners on `document` with `[data-*]` targets, initialized in `DOMContentLoaded`.
- Section init: `global.js` scans `[data-section-type]` on load and after `section:render` events (editor), invoking per-section init functions registered by component modules. No framework; state lives in DOM data attributes and element properties.
- Handoff contract: sections emit `variant:change`, `cart:updated`, `media:change` CustomEvents; product form hidden inputs updated by `variant-picker`.

## 9. CSS architecture

- Tokens on `:root` in `assets/base.css` from the design system: `--color-bg`, `--color-text`, `--color-accent`, `--color-surface`, `--font-display`, `--font-body`, `--space-*`, `--radius-*`, `--shadow-*`, `--motion-*`; breakpoint tokens `--bp-sm/md/lg`.
- One file per component under `assets/components/`; all loaded via `stylesheet_tag` in `theme.liquid` (deferred, non-render-blocking patterns verified at build time by `theme-performance-engineer`).
- Scoping: prefixed BEM-style classes (`product-card__media`, `collection-discovery__rail`); flat specificity; no element selectors outside base.css; no `!important` without documented reason.

## 10. Localization strategy

- `locales/en.default.json`: storefront copy, namespaced per component (`product_card.quick_add`, `variant_picker.choose_option`, `collection_discovery.view_all`).
- `locales/en.default.schema.json`: editor labels via `t:sections.<section>.<setting>.label`.
- Standard keys reused: `products.product.add_to_cart`, `general.search.submit`, `cart.general.title`, `collections.general.title`.
- Output: `{{ 'product_card.quick_add' | t }}`; optional strings use `t` `default:`.

## 11. Removed legacy files

`main-collection-product-grid.liquid` -> replaced by `collection-discovery` + `product-card` cluster; `featured-product.liquid` -> replaced by `editorial-product-stream`; `product-grid-header.liquid` -> dropped (heading moved into collection-discovery settings); `main-product.liquid` -> replaced by `product-main`; `product-quickview.liquid` -> dropped (quick add replaces it). No 1:1 renames.

## 12. Handoff notes

`shopify-commerce-engineer` owns section markup + product form wiring per this graph; `theme-editor-architect` owns schema details for all sections above (presets, dynamic sources, metaobject settings); dynamic-source compatibility of `roast_notes`/`origin_story` verified against current docs before editor work.
