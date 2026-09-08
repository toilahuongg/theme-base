# Compliance Matrix — Ember (EXAMPLE)

EXAMPLE ONLY. This matrix shows the expected fill quality. The values below were verified against shopify.dev on 2026-09-08, but the skill MUST re-fetch and re-verify on every run — do not copy these values into a real matrix.

## Header

- Theme name: Ember
- Run date: 2026-09-08
- Requirements as-of date (date docs were fetched): 2026-09-08
- Fetch status: 2 of 2 URLs fetched; failed URLs: none
- Fetch script version: 1.0.0

## Matrix

| Requirement area | Current standard (verified) | Source URL | As-of | Checked where |
| --- | --- | --- | --- | --- |
| Submission rules | Theme Store exclusive distribution; no designer credits, affiliate links, or external marketing in theme files; unique vs other themes; Skeleton Theme is only approved codebase (Dawn/Horizon-derived not eligible); version number and release notes required | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | docs/source-audit.md; docs/uniqueness-matrix.md; config/settings_schema.json (theme_info) |
| Architecture (OS 2.0) | Fixed directory set (assets, blocks, config, layout, locales, sections, snippets, templates); header/footer in section groups; JSON templates wrap sections; no config/markets.json in submission | https://shopify.dev/docs/storefronts/themes/architecture | 2026-09-08 | layout/theme.liquid; templates/*.json; sections/header-group.json; sections/footer-group.json |
| Required templates | theme.liquid, 404.json, article.json, blog.json, cart.json, collection.json, index.json, list-collections.json, page.json, page.contact.json, password.json, product.json, search.json, gift_card.liquid, settings_data.json, settings_schema.json | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | glob templates/*; layout/theme.liquid; config/settings_data.json; config/settings_schema.json |
| Sections everywhere | All templates support sections except Customer Account, Gift Card, Checkout | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | All 13 JSON templates reference sections |
| Blocks (main product section) | Blocks for all or most main-product elements (price, vendor, description as individual blocks) | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | sections/main-product.liquid (11 block types) |
| App blocks | `type: "@app"` supported in main product section and featured product section | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | sections/main-product.liquid; sections/featured-product.liquid |
| Custom Liquid section and blocks | Custom Liquid section with `liquid`-type setting on all section-supporting templates; Custom Liquid blocks where app blocks may be added | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | sections/custom-liquid.liquid; referenced in all JSON templates |
| Assets (Sass, minification, hosting) | No Sass/.scss; no minified css/js except ES6 and third-party; scripts hosted on Shopify servers | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | glob assets/*.scss* (0 hits); assets/base.css unminified; assets/theme.js unminified |
| URL and link rules | Protocol-relative asset URLs; rel="nofollow" on Shopify-domain links; payment icons via enabled_payment_types; lang attribute; routes object; content_for_header unmodified | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | layout/theme.liquid; grep rel="nofollow" |
| Browser support (desktop) | Safari latest 2 (Mac); Chrome latest 3 (Mac/PC); Firefox latest 3 (Mac/PC); Edge latest 2 (PC) | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | docs/performance-report.md (theme-performance-engineer) |
| Browser support (mobile and webviews) | Mobile Safari latest 2 (iOS); Chrome Mobile latest 3 (Android/iOS); Samsung Internet latest 2 (Android); purchasing in Instagram/Facebook/Pinterest webviews; mobile responsive | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | docs/performance-report.md; theme-qa-reviewer mobile pass |
| Performance minimum | Lighthouse performance average >= 60 across home, product, collection, desktop + mobile, benchmark dataset, populated sections | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | docs/performance-report.md (avg 71 — exceeds 60) |
| Accessibility minimum | Lighthouse accessibility average >= 90 across home, product, collection, desktop + mobile | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | docs/accessibility-report.md (avg 94 — exceeds 90) |
| Accessibility static rules | Keyboard access incl. dropdowns; visible focus states; focus order = DOM order; alt on all images; unique form IDs with matching labels; valid HTML; contrast 4.5:1 / 3:1; touch targets >= 24x24 CSS px; h1-h6 visually distinct | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | docs/accessibility-report.md; grep for missing alt attributes in sections/ |
| Settings and terminology | All settings have labels; sentence case; American English; no ampersands; theme_info; favicon setting; link_list defaults main-menu/footer; standard metaobject types only | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | config/settings_schema.json; section schemas |
| Fonts and colors | font_picker type with default; font_modify loads bold/italic/bold-italic; no custom fonts; >= 4 colors with background/foreground pairs typed `color` | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | config/settings_schema.json (font_picker x3, color x6) |
| SEO and social media | SEO metadata snippet (title, description, canonical); rich product snippets; no robots.txt.liquid; social icons; Open Graph + Twitter cards; empty placeholder text | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | layout/theme.liquid; sections/social-icons.liquid |
| Demo store rules | Demo store per preset matching industry; Bogus Gateway/test mode on; authentic text (no Lorem Ipsum); powered_by_link unaltered; no affiliate links; no apps showcased | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | Demo store URL (partner dashboard); grep lorem in templates/ |
| Documentation and support | Documentation + public contact form linked before launch; support replies within 2 business days | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-09-08 | Listing draft (partner dashboard) |

## Known current thresholds — MAY BE STALE, VERIFY

| Threshold | Last-known value | Verified this run? |
| --- | --- | --- |
| Lighthouse performance minimum | average >= 60 across home, product, collection; desktop + mobile | [x] |
| Lighthouse accessibility minimum | average >= 90 across home, product, collection; desktop + mobile | [x] |
| Test dataset | Shopify benchmark dataset; sections must contain real images and content | [x] |
| Touch targets | >= 24 x 24 CSS pixels for pointer inputs | [x] |
| Text contrast | 4.5:1 body; 3:1 large text (over 18pt) and non-text elements | [x] |

## Exceptions and notes

| Deviation | Requirement it touches | Reason and sign-off |
| --- | --- | --- |
| None | — | — |

## Verification footer

- Verified by static check (this run): submission rules, architecture, required templates, sections everywhere, blocks, app blocks, Custom Liquid, assets, URL/link rules, settings/terminology, fonts/colors, SEO/social, demo-store file rules.
- Pending reviewer reports: none — performance and accessibility rows cite docs/performance-report.md and docs/accessibility-report.md (both complete).
- Open items handed to theme-qa-reviewer: none; all rows have evidence.
