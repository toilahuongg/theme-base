# Uniqueness Matrix — NORTHLINE (first review, design+code stage)

Realistic worked example. Theme: "NORTHLINE", an outdoor/expedition concept built on source theme "Atelier" (Dawn-derived fashion theme, v15.0.0). All citations are illustrative; a real review cites actual files and lines.

## Review header

| Field | Value |
| --- | --- |
| Theme name | NORTHLINE |
| Source theme (name, version) | Atelier (Dawn-derived), 15.0.0 |
| New theme (name, version) | NORTHLINE, 1.0.0 |
| Pipeline run | 1st (design-stage review, after art direction and architecture; code landed for review) |
| Reviewer | theme-uniqueness-designer |
| Date | 2026-09-08 |
| Shopify uniqueness requirement verified at | https://shopify.dev/docs/storefronts/themes/theme-store-requirements (fetched this run; reskin language unchanged) |
| Inputs reviewed | docs/source-audit.md, docs/design-system.md, docs/commerce-thesis.md, docs/user-journeys.md, docs/page-information-architecture.md, docs/theme-architecture.md, docs/commerce-implementation.md, docs/editor-architecture.md; source theme checkout; landed code in layout/, templates/, sections/, snippets/, assets/, config/ |

## Core experience matrix

| # | Core experience | Source behavior (evidence) | New theme behavior (evidence) | Settings-reproduction result (which source settings cover it) | Structural difference? (axis + code evidence) | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Header | Centered logo, announcement bar, sticky header toggle (`enable_sticky_header`), search icon | Logo left-aligned, CSS marquee ticker in announcement bar, added utility bar with link slots | `header_layout`, `enable_sticky_header` cover layout; marquee is pure CSS; utility bar is source announcement bar with link settings | Interaction: none. Page architecture: partial (new layout section wraps source elements) | WEAK |
| 2 | Navigation | Dropdown menus with `menu` pickers, one level, image banner option per menu item | Same dropdown structure; adds "expeditions" trigger item styling; mega menu handled in its own row | `menu` setting, image banner option reproduce it | Interaction: none; structure unchanged | WEAK |
| 3 | Mega menu | Mega menu via settings: `enable_mega_menu` checkbox, `mega_menu_columns`, per-column image pickers | "Mega menu" claims editorial column layout; implementation reuses source's `enable_mega_menu` + `mega_menu_columns`, only defaults changed, image hover zoom added in CSS | `enable_mega_menu`, `mega_menu_columns`, image pickers cover it fully | Interaction: none. Content model: none (same schema, changed defaults + CSS) | FAIL |
| 4 | Product card | Image, title, price, quick-add to cart button, `product_card_image_ratio` setting | Same base card plus on-card variant selector (size select rendered in Liquid with schema, updates price via JS) and weight badge from product metafield | `product_card_image_ratio`, quick-add setting do not cover variant selection or metafield rendering | Interaction: variant selection on card. Content model: metafield-driven weight badge | PASS |
| 5 | Collection page | Standard grid, `products_per_row` setting, banner image, sort/filter sidebar | Editorial lookbook: full-bleed intro, split media/text rows, curated product rows between editorial blocks; new section types with own schemas | `products_per_row`, banner image do not cover editorial row blocks or split media/text | Page architecture: purpose-built editorial sections absent from source; collection template restructured | PASS |
| 6 | PDP | Image gallery with thumbnails, title, price, variant picker, accordion description, sticky add-to-cart on mobile | Editorial PDP: sticky "expedition checklist" sidebar (scroll-spy section listing product highlights, animated check-off) plus sticky add-to-cart bar; gallery becomes mixed media | No source setting produces a checklist section or scroll-spy behavior; sticky add-to-cart only | Interaction: scroll-spy checklist with state. Media: mixed media gallery (see row 10) | PASS |
| 7 | Cart | Page cart with line items, quantity inputs, note field; no drawer | Cart drawer replaces page cart; drawer includes trip-weight widget summing variant metafield weights with packing summary; JS + new schema | Source has no drawer setting; weight widget requires new data flow (variant metafields + JS) | Interaction: drawer. Content model: weight aggregation from metafields | PASS |
| 8 | Search | Predictive search overlay (settings: `enable_predictive_search`, results per query), results page | Overlay restyled (colors, font, animation), results reordered (products before collections) | `enable_predictive_search`, `results_per_query` cover behavior; reorder is a settings-order change | Interaction: none; restyle only | FAIL |
| 9 | Mobile nav | Drawer with collapsible menus, `mobile_menu_behavior` settings | Same drawer, new icon set, accent colors, CSS slide-in animation | `mobile_menu_behavior` covers it; icon/color/animation are CSS | Interaction: none; restyle only | FAIL |
| 10 | Media | Uniform square image gallery, `image_ratio` setting, hover zoom | Mixed media gallery (image + video + 3D model) with per-media aspect ratios and filmstrip; video play states in gallery | `image_ratio` covers crops only; source gallery schema handles images only | Media treatment: mixed-media gallery with per-media ratios, new schema and media handling | PASS |

## Row evidence (selected rows)

### Row 3: Mega menu — FAIL

- Source behavior (sections/header.liquid:210): mega menu rendered when `enable_mega_menu` checked, `mega_menu_columns` controls columns, per-column image pickers in menu schema.
- New theme behavior (sections/header.liquid:198): identical rendering path; defaults changed to 4 columns; hover zoom in CSS.
- Source settings that reproduce it: `enable_mega_menu`, `mega_menu_columns`, column image pickers.
- Edge cases forced: menu with 1 item, no images picked, mobile width — renders identically to source.
- Structural axis claimed: none survives the schema test. The editorial column layout claimed in docs/design-system.md:5 does not exist in schema; the "mega menu" is the source's mega menu.
- Verdict rationale: golden rule fires. A merchant sets `enable_mega_menu` and picks images; the rest is CSS.

### Row 5: Collection page — PASS

- Source behavior (templates/collection.json): standard grid, `products_per_row`, banner image, sidebar filters.
- New theme behavior (templates/collection.json): editorial intro section, split media/text sections, curated product rows; new section types `collection-editorial-intro`, `collection-editorial-row` with own schemas and Liquid.
- Source settings that reproduce it: none; source has no editorial section types.
- Edge cases forced: one-product collection, no banner image, mobile width — editorial sections render sensibly; grid still functional.
- Structural axis: page architecture. Code evidence: sections/collection-editorial-intro.liquid, sections/collection-editorial-row.liquid.
- Verdict rationale: new page architecture with purpose-built sections the source cannot express via settings.

### Row 8: Search — FAIL

- Source behavior (sections/predictive-search.liquid): overlay with `enable_predictive_search` and `results_per_query`.
- New theme behavior: same overlay, restyled (colors/font per design-system.md), results reordered via settings change.
- Source settings that reproduce it: `enable_predictive_search`, `results_per_query`, plus CSS for restyle.
- Edge cases forced: empty query, no results, mobile — identical to source.
- Verdict rationale: golden rule fires; restyle plus settings change is surface.

## Overall verdict

- Row count: PASS 5 / WEAK 2 / FAIL 3
- Overall verdict: FAIL
- Theme is a reskin: Partial. The collection page, PDP, cart drawer, product card, and media experiences are genuinely structural; header, nav, mega menu, search, and mobile nav remain reskins of the source.
- Structural differentiators that carry the theme:
  1. Collection editorial lookbook sections (page architecture).
  2. PDP scroll-spy expedition checklist (interaction model).
  3. Cart drawer with trip-weight widget (interaction model + content model).
  4. On-card variant selector and metafield weight badge (interaction model + content model).
  5. Mixed-media gallery with per-media aspect ratios (media treatment).
- Verdict rationale: three FAIL rows violate the golden rule, so the theme cannot pass. The five PASS differentiators are real and worth preserving; they do not rescue the FAIL rows.

## Required changes before re-review

1. Mega menu (FAIL) -> Build a purpose-built mega menu section with an editorial content model (per-column image, copy, and link blocks) defined in new schema, not the source's `enable_mega_menu` toggle. Owner: shopify-liquid-architect + theme-editor-architect. Evidence to check: `sections/mega-menu.liquid` exists, `config/settings_schema.json` has no `enable_mega_menu` passthrough; menu renders editorial blocks without the source setting.
2. Search (FAIL) -> Give search a structural behavior: category-prefiltered overlay with filter chips and "expedition" suggestion groups driven by collection data, per docs/user-journeys.md:14. Owner: commerce-ux-architect (definition) + shopify-liquid-architect (implementation). Evidence to check: predictive-search.liquid renders collection-driven chips; behavior differs with source settings at full range.
3. Mobile nav (FAIL) -> Add a structural difference: bottom utility rail with trip-status and quick-access to the checklist, or drop the uniqueness claim for mobile nav. Owner: commerce-ux-architect + shopify-liquid-architect. Evidence to check: mobile nav renders the rail only when checklist section enabled; rail is not a source setting.
4. Header (WEAK) -> Either make the utility bar a real content model (typed link blocks, not announcement-bar text fields) or accept WEAK and do not count the header in the uniqueness claim. Owner: theme-editor-architect. Evidence to check: utility bar schema uses link-list blocks; not reproducible via `announcement_bar` settings.
5. Navigation (WEAK) -> Resolve after mega menu: if the editorial mega menu lands, navigation row can be re-scored PASS for its trigger/entry behavior. Owner: shopify-liquid-architect.

## Re-review delta (second run)

To be filled before submission. Expected procedure: diff this matrix against the landed code, verify each required change at the cited evidence paths, re-run the four tests, and re-score rows 2, 3, 8, 9 (and 1).

## Final statement

NORTHLINE carries five genuine structural differentiators (editorial collection architecture, PDP checklist interaction, cart drawer with weight widget, on-card variant selection, mixed-media gallery) but as reviewed it is a reskin of Atelier on mega menu, search, and mobile nav. It is not yet genuinely different overall: FAIL, pending the required changes above.
