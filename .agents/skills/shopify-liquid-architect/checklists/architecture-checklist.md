# Architecture Checklist

Run this checklist while designing `docs/theme-architecture.md`. Every item must resolve to a concrete entry in the doc or an explicit non-goal. Do not skip a section because the theme is small; mark small themes with a justified "single section covers X and Y" note.

## A. Component graph completeness (every page type covered)

- [ ] Every page type in `docs/page-information-architecture.md` maps to exactly one JSON template in `templates/` (index, product, collection, blog, article, page, cart, search, list-collections, 404, password, plus any custom templates).
- [ ] Every section named in every template's `sections`/`order` appears in the component graph as `sections/<type>.liquid`.
- [ ] Every `{% sections '...-group' %}` call in `layout/theme.liquid` resolves to a `sections/*-group.json` file present in the graph (header group, footer group).
- [ ] Persistent chrome (header, announcement, footer) lives in section groups, not duplicated per template.
- [ ] Every feature in `docs/feature-inventory.md` is assigned to a section, a block, a snippet, or an explicit non-goal (e.g. "POS not in scope").
- [ ] Every product/collection/article/blog/page/cart/search page type has a designated main section and supporting sections.
- [ ] Empty-state handling is designed: cart empty, search with no results, collection with no products, blog with no articles. Each states which section/snippet renders it.
- [ ] Every interactive behavior in the design system (quick add, variant switching, media gallery, predictive search, cart drawer, announcement dismissal) is assigned to a section or component with its JS owner.

## B. Component decomposition (sections vs snippets vs blocks)

- [ ] Merchant-configurable modules are sections with `{% schema %}` and presets; nothing merchant-editable is a bare snippet.
- [ ] Reusable non-editable markup is a snippet cluster with a shared prefix; no snippet reads caller variables implicitly (all inputs via `render` arguments or template-context objects).
- [ ] Repeatable/orderable content is blocks; single values are settings. Justification is recorded for any block that could be a setting and vice versa.
- [ ] Block type names are prefixed by their section (`product_main--media`), never generic (`image`, `text`).
- [ ] Snippet clusters from the product spec are present as flat namespaced files: `product-card` (card, media, actions), `price` (price, price-format), `media` (media, media-gallery), `variant-picker` (picker, option, selected-variant) — or an equivalent documented decomposition.
- [ ] `assets/components/` is present for per-component CSS/JS with one file per component.
- [ ] No `{% include %}` anywhere in the graph; only `{% render %}`.

## C. Naming consistency

- [ ] Section files: kebab-case, descriptive, no numeric prefixes (`section-01` is forbidden), no legacy names carried over.
- [ ] Snippet files: kebab-case, cluster prefix first (`product-card-actions.liquid`, not `actions-product-card.liquid`).
- [ ] Setting IDs: snake_case, design-system vocabulary, identical id used in schema and render; no duplicate ids across a schema; `id` matches between settings_schema.json and `{{ settings.<id> }}`.
- [ ] Block type ids: `<section>--<block>` namespaced.
- [ ] Asset files: kebab-case; component CSS/JS names match the component (`product-card.css` styles `product-card` markup).
- [ ] Localization keys: dotted namespace mirrors component name (`product_card.quick_add`); standard Shopify keys reused where they exist; every hardcoded string in the graph is flagged as a defect.
- [ ] Class names in markup follow one convention (e.g. BEM-style `product-card__media`) and match the design-system vocabulary; no inline styles for layout.

## D. No leftover old files

- [ ] Diff the graph against `docs/source-audit.md`: no legacy section/snippet/asset file name survives (renamed or kept).
- [ ] Every file the graph lists has a stated purpose; every file type present in the old theme that the new graph drops is explicitly listed as removed (e.g. `snippets/old-header.liquid` -> removed, replacement `sections/header.liquid`).
- [ ] No Dawn-derived files are silently retained "as-is"; anything kept is either a deliberate standard pattern (buy-buttons style form markup) documented as such, or redesigned.
- [ ] `config/settings_schema.json` settings that no new component reads are scheduled for removal; no orphaned settings remain.

## E. Data flow coverage

- [ ] For every component: objects it consumes (product, collection, article, cart, search, shop, customer, request, linklists) are listed.
- [ ] For every component: settings it consumes (section settings, block settings, theme settings) are listed with ids.
- [ ] For every component: metafields/metaobjects it consumes are listed with namespaces and types (`custom.materials` list.metaobject_reference of type `material`).
- [ ] Every dynamic-source-capable setting is identified and its allowed resource context is noted (product template vs global).
- [ ] No component reads a metafield directly where the merchant should pick the source in the editor; such cases are converted to dynamic-source settings.
- [ ] Data direction is explicit: which snippet receives which `render` arguments from which section; no implicit globals.
- [ ] Pagination/limits are specified for every loop (collection pagination, search pagination, blog pagination, product recommendations limits).
- [ ] Localization: every user-facing string in the graph maps to a locale key; schema labels map to `en.default.schema.json` keys.

## F. Architecture decisions present

- [ ] JS architecture states the choice per behavior (custom element vs delegated listener) and the section-level loading mechanism (`data-section-type` init, conditional registration); no script loads on every page when the section is absent.
- [ ] CSS architecture states token strategy (CSS custom properties from the design system), file layout (`assets/base.css` + `assets/components/*`), and scoping rule (prefixed classes, flat specificity).
- [ ] Localization strategy section documents key namespacing and the `t` filter usage.
- [ ] "Verified current rules" section lists the shopify.dev URLs checked and the date; no unverified requirement numbers are asserted as fact.

## G. Handoff readiness

- [ ] Doc written from `templates/theme-architecture.md` with every placeholder filled or marked intentionally empty.
- [ ] `node scripts/validate-structure.mjs <theme-root>` reports all required OS 2.0 items present.
- [ ] Doc handed off to `shopify-commerce-engineer` and `theme-editor-architect` with explicit pointers to the sections they own.
- [ ] No self-certification: uniqueness, performance, accessibility, and readiness verdicts are deferred to the reviewer skills.
