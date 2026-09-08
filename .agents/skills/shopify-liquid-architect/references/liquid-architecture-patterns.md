# Liquid Architecture Patterns

Reference for the `shopify-liquid-architect` skill. This file summarizes the current state of Shopify Online Store 2.0 architecture so an agent can design quickly. VERIFY CURRENT: Shopify changes requirements; re-check the cited URLs before finalizing an architecture, and record what you verified in `docs/theme-architecture.md`. Do not treat any number here as a permanent fact.

Primary sources:
- Theme architecture overview: https://shopify.dev/docs/storefronts/themes/architecture
- JSON templates: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
- Sections: https://shopify.dev/docs/storefronts/themes/architecture/sections
- Section groups: https://shopify.dev/docs/storefronts/themes/architecture/section-groups
- Layouts: https://shopify.dev/docs/storefronts/themes/architecture/layouts
- Settings: https://shopify.dev/docs/storefronts/themes/architecture/settings
- Dynamic sources: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources
- Liquid reference: https://shopify.dev/docs/api/liquid
- Locales: https://shopify.dev/docs/storefronts/themes/architecture/locales
- Theme Check: https://shopify.dev/docs/storefronts/themes/tools/theme-check

## 1. Sections vs snippets vs render

| Concern | Use | Why |
| --- | --- | --- |
| Merchant-configurable page module | `sections/<name>.liquid` with `{% schema %}` | Sections are addable, reorderable, duplicatable in the theme editor; each carries its own settings and blocks. |
| Reusable, non-editable markup | `snippets/<name>.liquid` | Snippets render fast, take arguments, and are never exposed to the merchant. |
| Inline partial with per-use data | `{% render 'snippet-name', arg: value %}` | `render` is isolated: the snippet cannot read variables from the caller (except globals). No variable leakage, no scope bleed. Explicit arguments are the contract. |
| Include for legacy/global partials | `{% include %}` (deprecated for new code) | `include` shares caller scope and can read/write caller variables. Never use in new architecture. |

Rules:
- A section that needs repeated configurable sub-units defines blocks in its own schema (`"type": "block"` entries). Blocks belong to a section; block types are prefixed by the section name (`product_main--media`).
- Snippets never declare `{% schema %}`. If a partial needs editor settings, it is a section or a block.
- Keep snippets argument-driven: every value a snippet needs is passed via `render` hash or read from an explicit object available in every context that renders it. A snippet that reaches into `product`, `section`, or `block` globals is a design smell unless it is a section-private component guaranteed to render inside that context.

## 2. Blocks vs settings

- `settings` = scalar configuration for one instance: heading text, toggle, image picker, color.
- `blocks` = repeatable, orderable units the merchant manages as a list: media items, accordion rows, feature tiles, footer columns.
- Rule of thumb: if the merchant should be able to have two or more of the same thing, it is a block. If it is a single value or a fixed set of fields, it is a setting.
- Dynamic behavior (adding/removing/reordering) belongs to blocks. Static composition belongs to settings.
- Blocks have a shared `"limit"` only via `"max_blocks"` at the section-schema level when the platform enforces it; per-type limits are not universal — check current docs.
- Settings and blocks both support dynamic sources when the rendering context provides a compatible resource; general theme settings in `config/settings_schema.json` do not support resource-context dynamic sources. Use section/block settings for merchant-selected metafield connections.

## 3. Section groups

- `sections/header-group.json` and `sections/footer-group.json` are JSON containers rendered from `layout/theme.liquid` with `{% sections 'header-group' %}` / `{% sections 'footer-group' %}`.
- A group file contains `"type"`, `"name"`, `"sections"`, `"order"`, and `"blocks"` (app blocks for apps like announcement bars, wishlists, geo-switchers).
- Use groups for persistent chrome (header, footer) so merchants can add/reorder group members and app blocks without touching templates.
- Sections inside a group render in a context without a page resource: product/collection metafield dynamic sources generally do not resolve there. Use group-level sections for global content only.

## 4. Dynamic sources

- Section and block settings of compatible types (text, richtext, image, product, collection, metaobject, and lists thereof) can be connected to metafields, metaobjects, and resource attributes in the theme editor.
- Metafield access in Liquid: `{{ product.metafields.custom.field }}`; metaobject access: `{{ product.metafields.custom.ref.value.field }}` or the metaobject setting value directly when a `metaobject` setting type is used.
- Metaobject settings (`"type": "metaobject"` / `"metaobject_list"`) require `"metaobject_type"`; one type per setting; the definition must be storefront-visible.
- Architecture rule: decide per component which values are (a) hardcoded theme defaults, (b) section settings, (c) merchant-connected dynamic sources. Never read metafields directly in Liquid when the merchant should choose the source in the editor; expose the choice as a dynamic-source-capable setting instead. For editor-pinned references (size chart, lookbook), prefer a `metaobject` setting over free-text handles.

## 5. Template-specific sections

- One JSON template per page type under `templates/`: `index.json`, `product.json`, `collection.json`, `blog.json`, `article.json`, `page.json`, `cart.json`, `search.json`, `list-collections.json`, `404.json`, `password.json`, plus any custom templates (e.g. `product.watch.json` for a custom template suffix).
- JSON template root requires `"sections"` (id -> section instance) and `"order"` (render order). `"layout"` selects an alternate layout file; `"wrapper"` adds a wrapper element. Check current limits on section count per template and block count per section (verify, historically 25 sections per template, 50 blocks per section).
- A section referenced by a template must exist as `sections/<type>.liquid` (or `.json` for a section group); a section without a `preset` cannot be added by merchants through the editor, so every merchant-addable section ships a preset.
- Product/collection templates commonly name their main section `product-main` / `collection-discovery`; the `main` section id is a convention, not a requirement — the id is arbitrary and must match between `sections` and `order`.

## 6. Performance-aware Liquid

- Avoid expensive loops: iterate `collections`, `blogs`, `products`, and `linklists` sparingly. Prefer template context objects (`product`, `collection`, `article`, `blog`, `search`, `cart`, `customer`) over cross-references.
- `paginate` renders one page of a collection/search; it is the sanctioned way to bound output. Never loop a whole collection without pagination.
- `limit` and `offset` filters bound object lists and arrays; use them instead of `for ... break` gymnastics. Do not fetch more than you render.
- `image_url` / `image_tag` with `width`/`crop` produce responsive, CDN-served images; always constrain sizes and prefer `srcset` via `responsive-image` snippets. Never output original-resolution images for cards.
- Avoid per-request heavy work in `layout/theme.liquid` (menus are fine; product loops are not).
- Snippets called with `render` are cached per render context; deep recursion or many renders of the same snippet (e.g. inside a loop over hundreds of items) still costs, so keep card markup lean.
- Defer all theme JavaScript; never block render. Register section JS conditionally (see SKILL.md JS architecture).
- `shopify theme check` flags performance anti-patterns (unused settings, missing presets, oversized assets). Run it during later stages; the architecture doc must not introduce patterns it would flag.

## 7. Shopify objects and product forms

- Core objects the architecture will consume: `shop`, `shop.name`, `shop.currency`, `customer`, `request`, `template`, `page_title`, `content_for_header`, `content_for_layout`, `routes`; resources: `product` (with `variants`, `options`, `selected_or_first_available_variant`, `compare_at_price`, `price_varies`, `available`, `featured_media`), `collection` (with `products`, `all_products_count`, `url`), `article`, `blog`, `cart` (`items`, `item_count`, `total_price`), `search` (`results`, `terms`, `performed`), `linklists` / `link`, `pages`, `blogs`.
- Product form: `{% form 'product', product, id: product_form_id, class: '...' %}` inside the buy box; the form handles add-to-cart and (with `data-product-form`) dynamic checkout buttons via `buy-buttons` snippet patterns. Hidden inputs (`id`, `quantity`) name the variant; the variant picker must update them via JS when options change.
- Cart form: `{% form 'cart', cart %}` for the cart template; line-item editing re-renders via AJAX endpoints (`/cart/change.js`) in cart drawer implementations.
- Locale-aware rendering: `request.locale.iso_code` on `<html lang>`, `localization` forms for language/currency pickers, `shop.locale`, `cart.currency`.
- JSON templates and section groups are `.json`, not Liquid; sections themselves are `.liquid` files with `{% schema %}` blocks.

## 8. Localization

- `locales/en.default.json` holds storefront copy; `locales/en.default.schema.json` holds editor labels (schema `label`, `content`, `info`, placeholder texts). Additional locales copy the default with translations; never invent keys in translated files that do not exist in the default.
- Keys are flat JSON, conventionally namespaced: `"products.product.add_to_cart"`, `"general.search.submit"`, `"product_card.quick_add"`. Reuse standard keys from a Dawn-derived baseline where present so translated locales keep working.
- Output with `{{ 'namespace.key' | t }}`; `t` with `default:` for optional strings. Schema `label` values use `t:` references into the `.schema.json` file (`"label": "t:sections.product_main.name"`).
