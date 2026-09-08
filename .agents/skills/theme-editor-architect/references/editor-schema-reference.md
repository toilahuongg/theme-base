# Editor Schema Reference

Reference for designing merchant-facing Theme Editor configuration on the current Online Store 2.0 platform. Setting types, schema keys, and rules change over time.

> VERIFY CURRENT: this file summarizes the state at the time of writing. Before shipping, fetch the live references and confirm every type and rule you rely on:
> - Input settings: https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings
> - Sidebar settings: https://shopify.dev/docs/storefronts/themes/architecture/settings/sidebar-settings
> - Dynamic sources: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources
> - Section schema: https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema
> - Theme blocks schema: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema
> - config/settings_schema.json: https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json
> - Theme Store requirements: https://shopify.dev/docs/storefronts/themes (Theme Store requirements section)

## Setting types

Two families: input settings (store a merchant-configurable value) and sidebar settings (display-only text in the editor).

### Basic input settings

| Type | Stores | Fits when |
|---|---|---|
| `text` | Single-line string | Short merchant copy: buttons, headings, links, handles. Always provide a default. |
| `textarea` | Multi-line string | Longer copy: announcement messages, helper text, footer blurb. Use over `text` when content exceeds ~60 chars. |
| `checkbox` | Boolean | On/off behaviors: "Show X", "Enable Y", "Hide on mobile". Labels must be a full readable toggle, not a variable name. |
| `select` | One of curated options | Layout or style choices with 2-6 named options: "Content position: Left / Center / Right", "Image layout: Stacked / Side by side". Prefer over `range` whenever options are qualitative. |
| `radio` | One of curated options | Same fit as `select` when 2-4 options and each option deserves an info string; visually heavier, so prefer `select` in dense sections. |
| `range` | Number within min/max | Quantitative density/size choices: "Products per row" (3-6), "Heading size" (small/large as numbers), "Autoplay speed". ALWAYS set min, max, step, default; default must render the reference design. |
| `number` | Numeric input | Precise values merchants may type (e.g. "Items per page"); otherwise prefer `range` because it constrains to safe values. |

### Specialized input settings

| Type | Stores | Fits when |
|---|---|---|
| `article` | One article | Editorial sections featuring a single blog post. No `default` attribute (verify). |
| `article_list` | Multiple articles | Blog-style grids / featured posts collections. |
| `blog` | One blog | Sections that render a blog's recent posts. No `default` attribute (verify). |
| `collection` | One collection | Single-collection feature blocks, banner-to-collection links. No `default` attribute (verify). |
| `collection_list` | Multiple collections | Collection grids and showcases. Dynamic-source enabled. |
| `color` | One color | A standalone accent/background color picker. Prefer `color_scheme` over a pile of color pickers. |
| `color_background` | CSS background (color or gradient) | Backgrounds that may need gradients. |
| `color_palette` | Named color palette | Themes that want merchants to swap a curated palette instead of free colors. |
| `color_scheme` | One of the theme's schemes | The primary way to let merchants recolor sections without breaking contrast or hierarchy. Default: the design system's primary scheme. |
| `color_scheme_group` | Group of schemes | Group-level scheme switching; use only when the design system defines scheme groups. |
| `font_picker` | One Shopify font | Typography choice: heading font, body font. Curated by Shopify; cannot break layout. |
| `html` | Raw HTML | Advanced sections where merchants paste embed code (maps, forms). Label as "Custom HTML" with an info string warning. |
| `image_picker` | One uploaded image | Hero images, banners, logos, media blocks. Does NOT support the `default` attribute (current input-settings docs); ship a Liquid placeholder/fallback asset (`placeholder_svg_tag`) so the section renders before upload. Dynamic-source enabled. |
| `inline_richtext` | Inline formatted text (no paragraph wrapping) | Short inline copy where bold/italic/links matter but paragraphs would break layout. |
| `liquid` | HTML + limited Liquid | Power-user content sections. Mark clearly as advanced; do not use for mainstream settings. |
| `link_list` | One navigation menu | Menu-driven sections: header, footer, nav columns. Dynamic-source enabled. |
| `metaobject` | One metaobject | Structured content from merchant metaobjects. Verify current availability. |
| `metaobject_list` | Multiple metaobjects | Repeating structured content. Verify current availability. |
| `page` | One page | Sections that render a full page's content (About blurb, FAQ). No `default` attribute (verify). |
| `product` | One product | Featured single-product blocks. No `default` attribute (verify). |
| `product_list` | Multiple products | Product carousels, featured collections of products. Dynamic-source enabled. |
| `richtext` | Multi-line formatted text | Body copy with paragraphs: about text, FAQ answers, descriptions. |
| `text_alignment` | Left / center / right | Quick alignment choice; equivalent to a curated `select` with standard options. |
| `url` | Internal or external URL | Link fields: button targets, image links, announcement links. Supports internal picker; dynamic-source enabled. |
| `video` | Shopify-hosted video | Video sections using hosted videos. No `default` attribute (verify). |
| `video_url` | External video URL | YouTube/Vimeo embeds; includes a URL field with guidance. |

### Sidebar (display-only) settings

| Type | Purpose | Fits when |
|---|---|---|
| `header` | Group heading in the editor | Starts a named setting group ("Content", "Layout", "Design", "Advanced"). Use 2-5 per section, ordered by merchant priority. |
| `paragraph` | Explanatory text block | Explains a behavior, warns about an interaction, or links to a guide. Use sparingly; every paragraph is reading cost. |

## Rules that apply to every schema

- Every setting that stores content or controls layout: `default` present — except setting types that do not support a schema `default` (current input-settings docs: `image_picker`, `product`, `collection`, `blog`, `article`, `page`, `video`). Those get a Liquid placeholder/fallback render path (`placeholder_svg_tag`, `{% if setting == blank %}` fallbacks) so a section added with zero interaction still renders the reference design. A section added to a page must render the reference design with zero interaction.
- Every `range`: `min`, `max`, `step`, `default`. The max must be provably layout-safe (bound by the grid/container math, never free).
- Every block-type section: `max_blocks` set to a number that keeps output fast and layout sane; document the justification.
- Setting `id`s: lowercase `snake_case` or `kebab-case`, unique within the schema, stable once shipped (renaming id breaks merchants' saved values).
- Setting `label`s: merchant language, outcome-oriented, no code vocabulary (see SKILL.md Rule 1). Use `t:` translation keys from `locales/` so labels are localizable; keep schema strings out of the template.
- `info`: optional one-line clarification, only when the label alone is genuinely ambiguous.
- Conditional visibility: verify the current mechanism on shopify.dev (historically `visible_if` expressions on the setting; syntax and supported operators change). Hide dependent settings when their trigger is off; never hide settings whose absence causes broken output.
- Groups via `header` must not produce an empty group or a one-setting group; merge or cut instead.

## Blocks

- Use blocks when merchants must add, remove, reorder, or configure repeated content (menu columns, announcement items, image cards, FAQ items).
- Each block has `type` (stable machine id), `name` (merchant label), and its own `settings`.
- Block settings follow the same label/default/limit/conditional rules as section settings.
- `max_blocks` required on every section with blocks; justify the number (performance + layout sanity, not whim).
- `default` (preset) on the section should include sensible starter blocks so the section is useful immediately; never an empty block list unless empty is a valid merchant state (and say so).
- Theme blocks (reusable blocks in `blocks/`) follow the same schema rules; merchants add them in the editor per the current UX.
- Verify block count limits and theme block availability on shopify.dev before relying on them.

## Presets

- Every merchant-facing section ships at least one `preset` (name + settings + blocks) so it appears in "Add section" with a correct starting state.
- Preset names are merchant language: "Featured product", "Image banner", not "product_banner_v2".
- Preset settings/block values mirror the defaults from the design system; presets are how the curated starting layouts in `docs/page-information-architecture.md` are delivered.
- `templates/*.json` compose sections with their presets for each template (index, product, collection, page, blog, article, cart, search, 404, password, gift_card). Keep template composition in sync with `commerce-ux-architect`'s IA.
- When the current platform still requires/uses `presets` vs `default` keys, follow the live docs; do not mix both meanings.

## Dynamic sources

- Dynamic sources let merchants bind a setting to store data (products, collections, images, menus) instead of a fixed value. Verify the current list of dynamic-source-enabled setting types.
- Wire dynamic sources on: product/media pickers in product-rich sections, `collection_list` in collection grids, `link_list` for menus, `blog`/`page`/`article` in editorial sections, `image_picker` for hero/banner imagery, `url` for links.
- Dynamic-source wiring must never change the label or the default; it is an extra binding capability on top of a sound default.
- Do not build a setting whose only purpose is a manual workaround for a missing dynamic source (e.g. a text field asking merchants to paste a product handle).

## config/settings_schema.json (global settings)

- Global settings: colors (schemes), typography (font pickers), social links, favicon, checkout-relevant bits, store-wide behaviors. NOT per-section layout trivia.
- Structure with sidebar `header` groups exactly like sections; merchant priority order.
- Every global setting needs a default so the theme renders before configuration — except non-default types (`image_picker` e.g. favicon, `video`); render those conditionally in layout (`{% if settings.favicon != blank %}`) with a fallback where a visible placeholder is needed.
- Saved values live in `config/settings_data.json`; never hand-edit it except to set initial defaults, and keep its keys in sync with the schema.
