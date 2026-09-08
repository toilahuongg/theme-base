# Theme Architecture

> Fillable template for the `shopify-liquid-architect` skill. Replace every `<angle-bracket>` placeholder and every bracketed `[ ]` block. Remove instructions in blockquotes before committing. Target: `<theme-root>/docs/theme-architecture.md`.

## 1. Context

- Theme name: `<name>`
- Niche / commerce thesis: `<one-paragraph summary from docs/commerce-thesis.md>`
- Uniqueness commitments this architecture must enable (from docs/uniqueness-matrix.md): `[list]`
- Source theme status: `[e.g. legacy custom theme / Dawn-derived / greenfield]` — audit ref: docs/source-audit.md

## 2. Verified current rules

Checked on `<YYYY-MM-DD>` at these shopify.dev URLs; requirements below that are not in these sources are design decisions, not platform rules.

- Theme architecture: https://shopify.dev/docs/storefronts/themes/architecture
- JSON templates: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
- Sections: https://shopify.dev/docs/storefronts/themes/architecture/sections
- Section groups: https://shopify.dev/docs/storefronts/themes/architecture/section-groups
- Layouts: https://shopify.dev/docs/storefronts/themes/architecture/layouts
- Settings / dynamic sources: https://shopify.dev/docs/storefronts/themes/architecture/settings , .../settings/dynamic-sources
- Liquid reference: https://shopify.dev/docs/api/liquid
- Locales: https://shopify.dev/docs/storefronts/themes/architecture/locales

Current constraint notes that shaped the graph: `[e.g. template/section limits, flat Liquid directories, assets/ subdirectories only]`

## 3. Page map (template -> sections)

| Template file | Page | Sections (in render order) | Group-driven chrome |
| --- | --- | --- | --- |
| `templates/index.json` | Home | `[collection-discovery, editorial-product-stream, ...]` | `{% sections 'header-group' %}`, `{% sections 'footer-group' %}` |
| `templates/product.json` | Product | `[product-main, ...]` | ... |
| `templates/collection.json` | Collection | `[...]` | ... |
| `templates/blog.json` | Blog | `[...]` | ... |
| `templates/article.json` | Article | `[...]` | ... |
| `templates/page.json` | Page | `[...]` | ... |
| `templates/cart.json` | Cart | `[...]` | ... |
| `templates/search.json` | Search | `[...]` | ... |
| `templates/list-collections.json` | Collection list | `[...]` | ... |
| `templates/404.json` | Not found | `[...]` | ... |
| `templates/password.json` | Password | `[...]` | ... |
| `templates/<custom>.json` | `[custom purpose]` | `[...]` | ... |

## 4. Component graph

```text
layout/
  theme.liquid                # shell: content_for_header, content_for_layout, {% sections 'header-group' %}, {% sections 'footer-group' %}
templates/                    # one JSON file per page type (see page map)
sections/
  <section>.liquid            # one per merchant-configurable module
  <section>-group.json        # header/footer groups
snippets/
  <cluster>.liquid            # flat files; clusters expressed via shared prefix
assets/
  base.css                    # tokens + reset + global
  components/<component>.css  # one per component
  global.js                   # delegated listeners + section init
  components/<component>.js   # custom elements / per-section modules
config/
  settings_schema.json        # global settings
  settings_data.json
locales/
  en.default.json             # storefront copy
  en.default.schema.json      # editor labels
```

## 5. File responsibility map

`[One row per file. Every file the graph introduces, including assets and locales.]`

| File | Type | Responsibility | Consumes | Rendered from |
| --- | --- | --- | --- | --- |
| `layout/theme.liquid` | layout | Document shell, fonts, global styles/scripts, groups | `shop`, `request`, `template`, `content_for_header`, `content_for_layout` | every page |
| `sections/<section>.liquid` | section | `[what it renders, which blocks it supports]` | `[objects, settings ids, metafields]` | `templates/<page>.json` |
| `snippets/<snippet>.liquid` | snippet | `[partial purpose]` | `[render arguments]` | `[rendering section]` |
| `assets/components/<component>.css` | css | `[what it styles]` | design tokens | `layout/theme.liquid` (stylesheet_tag) |
| `assets/components/<component>.js` | js | `[behavior; custom element vs delegated]` | `[DOM hooks, section settings passed via data attributes]` | deferred script / conditional registration |

## 6. Data flow

### 6.1 Template context objects

`[Table: object -> where it comes from -> components that read it]` (product, collection, article, blog, cart, search, shop, customer, request, linklists, pages, routes)

### 6.2 Settings consumption

| Component | Theme settings (`settings.*`) | Section settings (`section.settings.*`) | Block settings (`block.settings.*`) |
| --- | --- | --- | --- |
| `[component]` | `[ids]` | `[ids]` | `[ids]` |

### 6.3 Metafields and metaobjects

| Component | Metafield/metaobject | Namespace.type | Accessed via | Editor source |
| --- | --- | --- | --- | --- |
| `[component]` | `[custom.materials]` | `[list.metaobject_reference -> metaobject "material"]` | `[product.metafields.custom.materials | metaobject]` / `[dynamic-source setting `section.settings.materials`]` | `[editor connection or metaobject setting type]` |

Rule applied: `[state which values are hardcoded defaults, which are plain settings, which are merchant-connected dynamic sources]`

### 6.4 Loops, pagination, limits

| Loop | Source | Bound by | Items rendered |
| --- | --- | --- | --- |
| `[product cards]` | `[collection.products]` | `[paginate by 24]` | `[24 per page]` |
| `[recommendations]` | `[recommendations.products]` | `[limit 4]` | `[4]` |

## 7. Naming conventions

- Sections: `kebab-case` (`product-main`, `collection-discovery`, `editorial-product-stream`).
- Snippets: `kebab-case`, cluster prefix first (`product-card-media.liquid`).
- Setting ids: `snake_case`, design-system vocabulary; same id in schema and render.
- Block types: `<section>--<block>` (`product_main--media`).
- Assets: `kebab-case`, component-scoped (`assets/components/product-card.css`).
- Locale keys: dotted namespace matching component (`product_card.quick_add`); standard Shopify keys reused where they exist.

## 8. JS architecture

Decision: `[delegated listeners for <behaviors>; custom elements for <behaviors>]`

- Registration: `[custom element definitions conditional on DOM presence; global.js init keyed by [data-section-type]]`.
- Loading: `[single deferred bundle vs per-section modules; nothing loads on pages where the section is absent]`.
- State: `[DOM state vs data attributes vs element properties; no framework dependency unless justified]`.
- Handoff contract with markup: `[data-* attributes and custom event names the sections must emit]`.

## 9. CSS architecture

- Tokens: `[CSS custom properties on :root from docs/design-system.md: colors, type scale, spacing, radii, shadows, motion]`.
- File layout: `[assets/base.css + assets/components/<component>.css, loaded via stylesheet_tag in theme.liquid]`.
- Scoping: `[prefixed component classes, BEM-style; flat specificity; no IDs; no global class pollution]`.
- Responsive: `[mobile-first breakpoint tokens]`.

## 10. Localization strategy

- Files: `locales/en.default.json` (storefront), `locales/en.default.schema.json` (editor labels).
- Standard keys reused: `[list, e.g. products.product.add_to_cart, general.search.submit]`.
- Custom keys: `[namespace by component, e.g. product_card.quick_add, variant_picker.choose_option]`.
- Output: `{{ 'namespace.key' | t }}`; `t` `default:` only for optional strings; schema labels via `t:sections.<section>.<setting>.label`.

## 11. Removed legacy files

`[From docs/source-audit.md: old file -> reason -> replacement]`

## 12. Open questions / handoff notes

`[Anything the commerce engineer or editor architect must resolve; explicit pointers to which skill owns it]`
