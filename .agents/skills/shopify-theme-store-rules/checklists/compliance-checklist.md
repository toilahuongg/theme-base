# Pre-Submission Compliance Checklist

Run after fetching current documentation (SKILL.md step 1). For every item, verify against the fetched source text, not memory. The Evidence column must name a concrete file, template, section, or report — "looks fine" is not evidence. Rows marked (measure) are owned by theme-performance-engineer or theme-accessibility-engineer; record their report path.

Checklist statuses: `[ ]` open, `[x]` verified, `[!]` violation found (record in matrix Exceptions).

## 1. Submission rules

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | Theme distributed only through Shopify Theme Store; no other marketplace distribution | |
| [ ] | No designer credits, developer-website links, or affiliate links in any theme file | |
| [ ] | Theme is fundamentally different from other Theme Store themes (architectural, not cosmetic) — see docs/uniqueness-matrix.md from theme-uniqueness-designer | |
| [ ] | Codebase provenance: Skeleton Theme original code, not Dawn/Horizon-derived | docs/source-audit.md |
| [ ] | Version number and release notes present | config/settings_schema.json, changelog |
| [ ] | Theme and preset names: 1-2 words, under 30 chars, no Shopify-product/industry/platform names | settings_schema.json, config/settings_data.json |
| [ ] | Multiple presets: `/listings` folder present with unique templates per preset; single preset: no `/listings` folder needed | |
| [ ] | No `config/markets.json` in submission zip | |

## 2. Architecture (OS 2.0)

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | Directory structure matches the supported set (assets, blocks, config, layout, locales, sections, snippets, templates [+ customers, metaobject]) | |
| [ ] | `layout/theme.liquid` exists | |
| [ ] | Header and footer rendered in section groups | layout/theme.liquid |
| [ ] | JSON templates used for all section-supporting page types | templates/*.json |
| [ ] | Editor changes reflect in editor preview (request.design_mode) | |

## 3. Templates

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | All required files exist: theme.liquid, 404.json, article.json, blog.json, cart.json, collection.json, index.json, list-collections.json, page.json, page.contact.json, password.json, product.json, search.json, gift_card.liquid, settings_data.json, settings_schema.json | |
| [ ] | Product page outputs title, price, unit price, compare-at price, description, option names/values, all images, variant images, tax-included indication, buying functions, swatches | templates/product.json + main product section |
| [ ] | Product page supports: recommendations, rich media, accelerated checkout (default on), pickup availability, Shop Pay Installments, gift-card recipient form | |
| [ ] | Collection page outputs collection.title/description/image, product grid with title (linked), price, images, unit price, media, sorting, price-varies range, empty message, pagination | |
| [ ] | Cart page outputs line_item details, cart.total_price, tax-included indication, checkout button, quantity controls, empty message; supports cart notes, selling plans, automatic discount codes, accelerated checkout | |
| [ ] | Page templates output page.title and page.content; contact alternate template present | |
| [ ] | Blog/article/search/404/gift card/password pages meet their required outputs (see references/requirement-areas.md section 3) | |

## 4. Sections, blocks, and app blocks

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | Custom Liquid section exists with a `liquid`-type setting, available on all section-supporting templates | sections/*, templates/*.json |
| [ ] | Custom Liquid blocks present in sections where app blocks could be added (with `liquid`-type setting) | |
| [ ] | Main product section supports blocks for all or most elements (price, vendor, description as individual blocks) | sections/main-product.liquid |
| [ ] | App blocks (`type: "@app"`) supported in main product section and featured product section | |
| [ ] | Blocks flow logically regardless of type/order; no reliance on block order for layout | |
| [ ] | Sections define presets; section/block limits within 25 sections / 50 blocks per section | |
| [ ] | No theme functionality depends on an app or app-like API-requiring features (wishlists, scheduling, cart-level codes, Instagram feeds) | |

## 5. Assets, scripts, and URLs

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | No `.scss`/`.scss.liquid` files; CSS native in `.css`/`.css.liquid` | |
| [ ] | No minified `.css`/`.js` except ES6 and third-party libraries | |
| [ ] | Scripts hosted on Shopify servers except approved third-party libraries | |
| [ ] | No JS interfering with native Shopify features in editor/admin | |
| [ ] | Asset links protocol-relative (no hard-coded http/https) | |
| [ ] | All links to Shopify domains carry `rel="nofollow"` | |
| [ ] | Third-party plugins/images have appropriate licenses | |
| [ ] | Layout uses `lang` attribute, `routes` object for dynamic URLs, unmodified content_for_header, enabled_payment_types for payment icons | layout/theme.liquid |

## 6. Browser support

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | Desktop: Safari (latest 2, Mac), Chrome (latest 3, Mac/PC), Firefox (latest 3, Mac/PC), Edge (latest 2, PC) | docs/performance-report.md, theme-qa-reviewer notes |
| [ ] | Mobile: Mobile Safari (latest 2, iOS), Chrome Mobile (latest 3, Android/iOS), Samsung Internet (latest 2, Android); theme mobile responsive | |
| [ ] | Purchasing works in Instagram, Facebook, Pinterest webviews | |

## 7. Performance (measure)

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | Lighthouse performance average >= 60 across home, product, collection, desktop + mobile, benchmark dataset, sections populated with real content | docs/performance-report.md |

## 8. Accessibility (measure)

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | Lighthouse accessibility average >= 90 across home, product, collection, desktop + mobile | docs/accessibility-report.md |
| [ ] | Static a11y rules: keyboard access incl. dropdowns, visible focus states, focus order matches DOM, alt on all images, unique form IDs with matching for labels, valid HTML, contrast 4.5:1 / 3:1, touch targets >= 24 x 24 CSS px, h1-h6 visually distinct | |

## 9. Merchant customization (settings, fonts, colors)

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | All settings have a `label`; names descriptive, sentence case, American English, no ampersands | config/settings_schema.json, section schemas |
| [ ] | theme_info section present; favicon setting present | |
| [ ] | Header/footer link_list settings default to main-menu/footer | |
| [ ] | Resource-based defaults reference existing resources; metaobject settings use standard definitions only | |
| [ ] | No Lorem Ipsum or demo-store content as default values | |
| [ ] | Font pickers: `font_picker` type, default font, font_modify loads bold/italic/bold-italic, no custom fonts | |
| [ ] | Color system: >= 4 colors, background paired with foreground, `type: "color"` | |
| [ ] | Responsive image strategy; lazy loading as appropriate | |
| [ ] | Social media icons available; Open Graph + Twitter card tags present; placeholder text empty | |
| [ ] | SEO: metadata snippet (title, description, canonical); rich product snippets; no robots.txt.liquid | |

## 10. Demo store, documentation, support (submission packaging)

| Status | Check | Evidence |
| --- | --- | --- |
| [ ] | Demo store per preset, matching industry and catalog size; Bogus Gateway / test mode enabled, other checkout options disabled | |
| [ ] | Demo pages use authentic text; powered_by_link unaltered; no affiliate links; no apps showcased | |
| [ ] | Theme documentation and public contact form ready and linked before launch | |
| [ ] | No demo-admin-specific resources in JSON defaults (no shopify:// URLs, no custom metafields) | |

## Sign-off

- As-of date of the fetched requirements: ____
- Fetch status (URLs fetched / failed): ____
- Open items handed to theme-qa-reviewer for the final readiness verdict: ____
