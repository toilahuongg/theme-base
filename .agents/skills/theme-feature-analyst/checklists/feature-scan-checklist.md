# Feature Scan Checklist

Systematic scan of an existing theme so no feature is missed. Run top to bottom; check every box. A feature is "captured" when it has its own YAML block in docs/feature-inventory.md. Do not start classifying until the scan is complete.

## 0. Setup

- [ ] Theme root identified (contains layout/, sections/, templates/, config/settings_schema.json).
- [ ] `node scripts/detect-features.mjs <theme-root>` run from the skill directory; JSON output saved as the candidate seed list.
- [ ] Product spec / brief available (the store's target positioning; used later for REMOVE/keep judgments).

## 1. config/settings_schema.json — global settings

- [ ] Every settings group read; each group given a candidate feature name.
- [ ] Every setting id mapped to a feature (a toggle like `enable_quick_add` proves the feature exists even if a section is missing).
- [ ] Settings that reference nothing rendered (dead settings) noted as candidates with a "dead setting" flag.
- [ ] `presets` and default values noted (they reveal which features ship enabled).

## 2. sections/ — one section at a time

For EACH section file:

- [ ] Section file listed (including subdirectories, e.g. sections/product/).
- [ ] `{% schema %}` name and `presets` read; preset-tagged sections are merchant-placeable features.
- [ ] Every schema setting read (each is a feature behavior: text, checkbox, select, image picker, collection picker, link list).
- [ ] Blocks enumerated (block type = sub-feature, e.g. a "mega menu" block inside the header section).
- [ ] Section render logic skimmed for behaviors the schema does not reveal (JS hooks, data attributes, hidden markup).
- [ ] Section classified or deferred with a reason (deferral only for features owned by another file — note the owner).

Section-level gotchas:

- [ ] One section can contain several features (header = nav + search + announcement + mega menu). Split them into separate YAML blocks.
- [ ] A feature can span multiple sections (quick add lives in product card, product form, AND cart drawer). Merge into one block listing all files.

## 3. snippets/ — shared components

- [ ] Every snippet listed and skimmed for feature-bearing markup (card, modal, drawer, icon, price, badge).
- [ ] Vendor-like snippets (external code, copied libraries) flagged as RISKY licensing candidates.
- [ ] Snippets rendered by no section or template flagged as dead code.

## 4. assets/ — JavaScript and CSS behaviors

- [ ] Every JS file inventoried by behavior (not by filename): what does it do on the page?
- [ ] Vendor libraries identified (jQuery, Swiper, Slick, GSAP, Shopify section rendering); provenance/license noted for RISKY review.
- [ ] Global JS behaviors captured: sticky header, cart drawer open/close, predictive search, quick add, quick view, swatches, countdown, recently viewed, free shipping progress, announcement rotation.
- [ ] `theme.js` / `theme.liquid` script tags enumerated (each is a feature or part of one).
- [ ] CSS-only features captured (parallax, hover effects, carousels built with CSS scroll-snap).
- [ ] Data attributes in Liquid that JS hooks into cross-checked (data-quick-add, data-cart-drawer...).

## 5. templates/ — template-specific features

- [ ] Every template file listed: product, collection, search, cart, blog, article, page, customers/*, 404, password, gift_card.
- [ ] Template-only features captured: quick view on collection, predictive search on search page, product recommendations on product, cart upsell on cart, recently viewed on product.
- [ ] Custom template types noted (e.g. `product.quick-view.json` = a feature in itself).
- [ ] `layout/theme.liquid` checked for: cart drawer, sticky header, announcement bar, global scripts, app embeds, fonts (licensing check).

## 6. Cross-cutting sweeps

- [ ] `{% render %}` / `{% section %}` call graph built mentally: every snippet reachable from at least one template is accounted for.
- [ ] App embeds / theme app extensions noted (these are apps by definition — classify APP-LIKE with the embed name).
- [ ] Locales scanned for feature copy that reveals features with no obvious file (e.g. "countdown" strings in locales/*.json).
- [ ] settings_schema.json, sections, assets, templates, layout cross-referenced: no feature appears zero times in the inventory.

## 7. Classification pass

- [ ] Every candidate from steps 0-6 has exactly one class (CORE / VALUABLE / GENERIC / REDESIGN / REMOVE / APP-LIKE / RISKY) per references/classification-guide.md.
- [ ] Every block has both booleans set (keep_concept, keep_implementation).
- [ ] APP-LIKE and RISKY blocks carry evidence in the rationale.
- [ ] No duplicate blocks: features split across files were merged, not repeated.
- [ ] Dead-code features (unrendered sections, dead settings) recorded and flagged in the rationale.

## 8. Output

- [ ] docs/feature-inventory.md written from templates/feature-inventory.md.
- [ ] Inventory contains every feature the scan captured; nothing from the scan was silently dropped.
- [ ] Handoff note written: inventory path reported to shopify-theme-product-orchestrator.
