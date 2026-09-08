# Theme Store Requirement Areas — Reference Catalog

Companion to SKILL.md. This file summarizes the requirement areas the compliance pipeline must cover, the official documentation URL for each, and the current known rules per area.

## Verify-current discipline

- Every mutable value below is marked **verify** or **MAY BE STALE**. Shopify changes these. Do not assert any of them in docs/compliance-matrix.md without checking them against a freshly fetched copy of the source document.
- Fetch procedure: `node scripts/fetch-docs.mjs [url...]` from the skill directory; sources land in `<theme-root>/docs/compliance-sources/<slug>.txt`. Read the saved text, record the as-of date.
- The two mandatory start URLs are https://shopify.dev/docs/storefronts/themes/store/requirements and https://shopify.dev/docs/storefronts/themes/architecture.
- When a fetched document conflicts with anything in this file, the fetched document wins.

---

## 1. Submission rules

Covers Theme Store exclusivity, uniqueness, review process, versioning, and what must be prepared before submission.

- https://shopify.dev/docs/storefronts/themes/store/requirements
- https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme
- https://shopify.dev/docs/storefronts/themes/store/success/updates
- https://shopify.dev/docs/storefronts/themes/store

Current known rules (verify):

- Themes may be distributed only through the Shopify Theme Store; no other marketplaces (verify).
- No designer credits, developer-website links, or affiliate links inside theme files (verify).
- Themes must be fundamentally different from other Theme Store themes, including your own. Cosmetic changes (spacing, color, typography swaps, gradients, blurs, added settings) are insufficient; uniqueness must be architectural (verify).
- Skeleton Theme is the only approved starter codebase. New submissions built on or derived from Dawn or Horizon are not eligible. Dawn-derived code in a target theme is an audit finding, not a license to keep it (verify).
- Every submission needs a version number and release notes (verify).
- Theme and preset names: 1-2 words, under 30 characters, distinct from Shopify products, company names, ecommerce platforms, industries, and existing Theme Store themes (verify).
- Multiple presets require a `/listings` folder in the theme zip with a unique set of templates per preset (verify).

## 2. Architecture (Online Store 2.0)

Covers the required directory structure and layout/template/section composition model.

- https://shopify.dev/docs/storefronts/themes/architecture
- https://shopify.dev/docs/storefronts/themes/architecture/config
- https://shopify.dev/docs/storefronts/themes/architecture/layouts
- https://shopify.dev/docs/storefronts/themes/architecture/section-groups
- https://shopify.dev/docs/storefronts/themes/best-practices/version-control
- https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json

Current known rules (verify):

- Directory structure is fixed: assets, blocks, config, layout, locales, sections, snippets, templates (with customers and metaobject subdirectories). Other subdirectories are not supported (verify).
- Only a `layout` directory containing `theme.liquid` is required for upload; the Theme Store requires the full template set listed in section 3 (verify).
- Header and footer must render within section groups so merchants can add, remove, and reorder sections (verify).
- JSON templates act as wrappers for sections; Liquid templates contain code (verify).
- All templates must support sections, except Customer Account pages, Gift Card pages, and Checkout (verify).
- Do not include `config/markets.json` when submitting (verify).
- Changes in the theme editor must reflect in the editor preview (request.design_mode) (verify).

## 3. Templates

Covers the required template and config files.

- https://shopify.dev/docs/storefronts/themes/architecture/templates
- https://shopify.dev/docs/storefronts/themes/architecture/templates/product
- https://shopify.dev/docs/storefronts/themes/architecture/templates/collection
- https://shopify.dev/docs/storefronts/themes/architecture/templates/search
- https://shopify.dev/docs/storefronts/themes/architecture/templates/gift-card-liquid
- https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates
- https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates

Current known rules (verify — template list is mutable):

Required theme files: `theme.liquid`, `404.json`, `article.json`, `blog.json`, `cart.json`, `collection.json`, `index.json`, `list-collections.json`, `page.json`, `page.contact.json`, `password.json`, `product.json`, `search.json`, `gift_card.liquid`, `settings_data.json`, `settings_schema.json`.

Per-template content rules (verify): product page must output title, price, unit price, compare-at price, description, option names/values, all images, variant images, tax-included indication, buying functions, swatches (`swatch.image`, `swatch.color`); collection page must output `collection.title`, `collection.description`, `collection.image`, product grid with `product.title`, `product.price`, `product.images`, `variant.unit_price`, media, sorting, price-varies range, empty message, pagination; cart page must output line_item details, `cart.total_price`, tax-included indication, checkout button, quantity controls, empty message, cart notes, selling plans, automatic discount codes, accelerated checkout; page/blog/article/search/404/gift card/password pages have their own required outputs.

## 4. Sections, blocks, and app blocks

Covers section support, block granularity, Custom Liquid insertion points, and app block compatibility.

- https://shopify.dev/docs/storefronts/themes/architecture/sections
- https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema
- https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks
- https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks
- https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings

Current known rules (verify):

- Themes must support blocks for all or most elements of the main product section (price, vendor, description as individual blocks) (verify).
- App blocks (type `@app`) must be supported in the main product section and the featured product section (verify).
- Blocks should not be overly granular; group related elements, avoid reliance on block type or order for layout (verify).
- JSON templates and section groups render up to 25 sections; each section up to 50 blocks (verify).
- Sections must define presets to be addable/removable in the theme editor (verify).

## 5. Custom Liquid policy

Covers where custom Liquid is required and how it may be used.

- https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#liquid
- https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks
- https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates

Current known rules (verify):

- A Custom Liquid section is required, with a setting of type `liquid`, available on all templates that support sections. It acts as an insertion point for certain types of apps (verify).
- Custom Liquid blocks are required in certain sections: introduce one anywhere an app block might be added, with a `liquid`-type setting (verify).
- Custom Liquid is not a backdoor for app-like functionality; themes must not include functionality dependent on an app or requiring API access for full functionality (verify).

## 6. Assets, scripts, and URLs

Covers asset delivery, CSS/JS rules, and link requirements.

- https://shopify.dev/docs/storefronts/themes/architecture#assets
- https://shopify.dev/docs/storefronts/themes/architecture#snippets
- https://shopify.dev/docs/storefronts/themes/architecture/locales
- https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags

Current known rules (verify):

- No Sass; no `.scss` or `.scss.liquid` files. Native CSS only, compiled to `.css` or `.css.liquid` (verify).
- No minified `.css` or `.js` files, except ES6 and third-party libraries; Shopify auto-minifies CSS and ES5-or-lower JS (verify).
- Scripts must be hosted on Shopify's servers except approved third-party libraries (verify).
- No JavaScript that interferes with or augments native Shopify features in the theme editor or admin (verify).
- Assets must be linked with protocol-relative URLs; hard-coded http/https is not permitted (verify).
- Any link to a Shopify domain must include `rel="nofollow"` (verify).
- Appropriate licenses for all third-party plugins and images (verify).
- `.liquid` asset files can access the settings object and Liquid filters (verify).

## 7. Browser support

Covers desktop, mobile, and webview compatibility.

- https://shopify.dev/docs/storefronts/themes/store/requirements (section 9)
- https://shopify.dev/docs/storefronts/themes/best-practices/accessibility

Current known rules (verify — release counts are mutable):

- Desktop: Safari latest two releases (Mac); Chrome latest three (Mac and PC); Firefox latest three (Mac and PC); Edge latest two (PC).
- Mobile: Mobile Safari latest two (iOS); Chrome Mobile latest three (Android and iOS); Samsung Internet latest two (Android).
- Webviews: browsing and purchasing must work in Instagram, Facebook, and Pinterest (latest release, Android and iOS).
- Themes must be mobile responsive.

## 8. Performance

Covers Lighthouse performance minimums and testing procedure.

- https://shopify.dev/docs/storefronts/themes/store/requirements (section 6)
- https://shopify.dev/docs/storefronts/themes/best-practices/performance
- https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance

Current known rules (verify — MAY BE STALE):

- Minimum average Lighthouse performance score 60 across home, product, and collection pages, desktop and mobile, tested against Shopify's benchmark dataset.
- Sections must contain actual images and content during testing; empty sections invalidate the test.
- Testing is executed by theme-performance-engineer; this skill records their report as evidence, never a self-computed score.

## 9. Accessibility

Covers Lighthouse accessibility minimums and WCAG-style rules.

- https://shopify.dev/docs/storefronts/themes/store/requirements (section 12)
- https://shopify.dev/docs/storefronts/themes/best-practices/accessibility

Current known rules (verify — MAY BE STALE):

- Minimum average Lighthouse accessibility score 90 across home, product, and collection pages, desktop and mobile, tested against Shopify's benchmark dataset.
- All parts of a page keyboard accessible, including dropdown navigation; visible focus states; focus order matches DOM order.
- All images require `alt` (use `image.alt` or `image_tag: alt`).
- Form inputs have unique IDs and matching `for` labels.
- Valid HTML; headings h1-h6 visually distinct from each other.
- Contrast 4.5:1 for body text; 3:1 for large text (over 18pt) and non-text elements.
- Touch targets at least 24 x 24 CSS pixels for pointer inputs.
- Testing is executed by theme-accessibility-engineer; this skill records their report as evidence.

## 10. Merchant customization expectations

Covers settings, theme editor UX, terminology, fonts, colors, and presets.

- https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json
- https://shopify.dev/docs/storefronts/themes/architecture/settings
- https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings
- https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts
- https://shopify.dev/docs/storefronts/themes/best-practices/design
- https://shopify.dev/docs/storefronts/themes/best-practices/design/color-system

Current known rules (verify):

- Settings use simple merchant-friendly language, grouped logically; settings labels are descriptive; all settings have a `label` (verify).
- Section, preset, and category names in sentence case; American English; no ampersands; declarative statements; buttons start with verbs (verify).
- Shopify terminology is mandated (home page not homepage, checkout not check out, navigation not menu, main-menu/footer defaults for link_list settings, etc.) (verify).
- Must have a theme_info section and a favicon setting (verify).
- Default values for section/block content show usage, never Lorem Ipsum (verify).
- Resource-based defaults must reference existing resources; metaobject settings may only use standard definitions (verify).
- Font pickers: `font_picker` type, default font loaded, bold/italic/bold-italic variants loaded via font_modify, no custom fonts (verify).
- Color system: minimum 4 colors, each background setting paired with a foreground setting, color settings typed `color` (verify).
- Responsive image strategy; images load only as needed (verify).
- Social media: a set of social icons, Open Graph and Twitter card tags, empty placeholder text (verify).
- SEO: theme SEO metadata snippet with title, meta description, canonical URL; Google rich product snippets; no robots.txt.liquid (verify).

## 11. Demo stores, documentation, and support

Covers what exists outside the theme zip itself.

- https://shopify.dev/docs/storefronts/themes/store/requirements (sections 20-22)
- https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme

Current known rules (verify):

- Each preset needs at least one demo store matching its industry and catalog size; Bogus Gateway or Shopify Payments test mode enabled; all other checkout options disabled (verify).
- Demo store pages use authentic text content — no Lorem Ipsum, no onboarding text; `powered_by_link` unaltered; no affiliate linking; no apps showcased except special-case free review/translation apps (verify).
- Theme documentation and a public support contact form must exist and be linked from the listing before launch (verify).
- Support replies within two business days; critical bugs fixed immediately or the theme may be temporarily removed (verify).
- Demo store files must not reference demo-admin resources (no shopify:// URLs, no custom metafields in JSON defaults) (verify).
