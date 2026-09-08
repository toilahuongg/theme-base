# Readiness Report — Aurora Commerce (example, BLOCKED)

> Worked example of a completed report. Blocker list, warning list, and evidence sections are realistic but fictional; copy the structure, not the content.

## Verdict

```yaml
status: BLOCKED
blockers:
  - "PDP: variant picker keyboard trap — Tab from the size picker enters the gallery lightbox and cannot Escape back; focus never returns to the trigger"
  - "Collection page CLS: 0.28 CLS on mobile preset at 375px — product cards reflow when images load because aspect-ratio is missing from collection card markup"
  - "PDP: variant state bug — switching from an in-stock to a sold-out variant leaves the old price visible until page reload; Add to cart stays enabled for the unavailable variant"
warnings:
  - "German locale: long translations clip the 'New' badge on product cards (badge width is fixed at 3.5rem)"
  - "Home hero image ~1.2 MB; passes budget today but exceeds the 800 KB page-weight budget when combined with sale banner experiments"
ready_for_submission: false
```

## Scope and Baseline

- Theme name: Aurora Commerce (custom, Dawn-derived)
- Theme version / commit: v1.4.2 / 9f3c21a
- QA date: 2026-09-08
- Review URL(s): https://aurora-preview.myshopify.com (preview theme), local dev at :9292
- Requirements verified on (URL + date): shopify.dev Theme Store requirements (2026-09-08), shopify.dev Theme Store performance budgets (2026-09-08), shopify.dev theme check docs (2026-09-08), shopify.dev accessibility (2026-09-08)
- Areas with missing evidence and why: none

## 1. Shopify Theme Check

- Command run: `shopify theme check --output json` (summarized with scripts/run-theme-check.mjs)
- Summary (errors / warnings / info / suggestions / total): 0 / 4 / 11 / 3 / 18
- Errors triaged: none (zero errors)
- Notable warnings: AssetSizeCSS (base.css 98 KB, warning), MatchingTranslations (2 extra keys in de.json, warning), LiquidTag (deprecated tag usage in two spots, warning), AssetSizeJavaScript (theme.js 61 KB, warning)
- .theme-check.yml review: only `ValidHTMLTranslation` disabled, justified by custom SVG sprite; no whole-category disables

## 2. Lighthouse

- Budget used (URL + date): shopify.dev Theme Store performance budgets (2026-09-08); mobile home target LCP <= 2.5s, TBT <= 300ms, CLS <= 0.1, total page weight <= 800 KB
- Home (mobile): perf 71 / a11y 96 / best practices 100 / SEO 100; LCP 2.9s / TBT 240ms / CLS 0.28 / 812 KB
- Home (desktop): perf 82 / a11y 97 / best practices 100 / SEO 100; LCP 2.1s / TBT 180ms / CLS 0.12
- Product page: perf 74 / a11y 95 / best practices 100 / SEO 100; LCP 2.6s / TBT 210ms / CLS 0.09
- Collection page: perf 69 / a11y 96 / best practices 100 / SEO 100; LCP 2.8s / TBT 260ms / CLS 0.31
- Budget comparison result: FAIL — CLS 0.28 (home) and 0.31 (collection) exceed the 0.1 budget; page weight 812 KB is within budget

## 3. Browser QA

- Home: PASS — hero slider, featured products, newsletter submit, announcement bar, footer links all functional; console clean
- Collection: PASS with finding — sort/filter/pagination work; card images reflow on load (see CLS blocker)
- Product (PDP): FAIL — variant state bug (see blockers); gallery lightbox keyboard trap (see blockers); add to cart, qty stepper, accordions otherwise functional
- Cart: PASS — qty edit, remove, free-shipping progress, checkout button all work
- Search: PASS — predictive results and no-results state correct
- 404 / password / blog / article / page: PASS
- Drawers and modals: FAIL — mobile menu drawer and cart drawer open/close fine, but gallery lightbox traps focus (keyboard blocker)
- Console and network errors: none

## 4. Responsive QA

- Theme breakpoints found: 750px, 990px, 1400px (base.css)
- Widths tested: 320, 375, 414, 768, 834, 1024, 1280, 1440
- Overflow check results per page type: no horizontal overflow at any width on any page type
- Tap target and image crop results: PASS — targets >= 44px; portrait/landscape crops correct via object-fit
- Findings: collection cards CLS at 375px (blocker); otherwise clean

## 5. Keyboard QA

- Skip link: PASS — present and functional on all templates
- Tab order: PASS — logical on home, collection, cart, search
- Focus visibility: PASS — visible outline retained
- Modals/drawers focus trap and return: FAIL — gallery lightbox traps focus, Escape does not close it, focus does not return to the triggering thumbnail (blocker)
- Widget operability: PASS — carousel arrows, accordions, qty steppers operable by keyboard with correct aria
- Findings: one keyboard blocker on PDP gallery lightbox

## 6. JS-off Testing

- Pages tested with JS disabled: home, collection, product, cart, search results, 404, password
- Content and navigation rendered: PASS — all core content and anchor navigation render; product add-to-cart posts natively via Shopify form
- Features degraded and acceptable: predictive search (falls back to native search page), cart drawer (falls back to cart page) — acceptable
- Findings: none blocking

## 7. Editor QA

- Settings save/render per section: PASS — all section settings applied and rendered after save
- Preset lifecycle: PASS — create, apply, rename, duplicate, delete all clean
- Section add/reorder/remove: PASS — no editor errors
- Edge-case content in editor: PASS — empty fields and empty image pickers handled
- Findings: none

## 8. Edge-case QA

Dataset (verbatim): very long titles, very long vendor, 0 images, 1 image, 20 images, portrait images, landscape images, single variant, 100 variants, sold out, mixed availability, long translations, empty collections, large menus, large carts, sale pricing.

| Fixture | Pages tested | Observed | Result |
| --- | --- | --- | --- |
| very long titles | PDP, collection, search | Titles wrap; cards stay in grid; no overflow | PASS |
| very long vendor | PDP | Vendor wraps, truncated with ellipsis in grid | PASS |
| 0 images | PDP | Placeholder renders; no broken media | PASS |
| 1 image | PDP | Single-image gallery works; thumbnails hidden | PASS |
| 20 images | PDP | Gallery loads all thumbnails; lightbox works (keyboard trap separately) | PASS |
| portrait images | PDP | object-fit contain; no distortion | PASS |
| landscape images | PDP | object-fit contain; no distortion | PASS |
| single variant | PDP | No variant picker rendered; price and add-to-cart correct | PASS |
| 100 variants | PDP | Picker renders and switches; mild jank (~200ms) acceptable | PASS |
| sold out | PDP | Badge and disabled add-to-cart correct | PASS |
| mixed availability | PDP | Picker reflects per-variant availability; price bug on switch (blocker) | FAIL |
| long translations | PDP, collection, home | German 'Neu' badge clips (warning); other strings wrap | FAIL (warning) |
| empty collections | collection | Empty state renders; no console errors | PASS |
| large menus | home, mobile drawer | 22 links plus submenus; drawer scrolls; no overflow | PASS |
| large carts | cart | 25 line items render; qty updates; totals correct | PASS |
| sale pricing | PDP | compare_at_price shows badge and strikethrough; price fails to update on variant switch (blocker) | FAIL |

Fixture cleanup completed: yes

## 9. Localization QA

- Locale files audited: en.default.json, en.default.schema.json, de.json, fr.json, es.json
- Translation keys: no missing keys; 2 extra keys in de.json (theme check warning)
- Languages tested: English, German, French, Spanish
- Long-translation clipping check: German badge clipping (warning); others clean
- RTL check: not applicable — no RTL locale shipped (recorded out of scope)
- Findings: clipping warning only

## 10. Verdict Assembly

- READY gate check: theme check zero errors (yes), Lighthouse minimums met (no — CLS), a11y minimums met (no — keyboard trap), zero blockers (no — 3), all areas evidenced (yes)
- Final status: BLOCKED
- Handoff notes: dispatch fixes to (1) theme-accessibility-engineer for the PDP gallery lightbox focus trap, (2) theme-performance-engineer for collection/home CLS (add aspect-ratio to collection cards, set width/height on product media), (3) shopify-commerce-engineer for the variant price/availability state bug (price and add-to-cart must update per selected variant). Re-run: keyboard QA on PDP, Lighthouse home + collection, edge-case mixed availability and sale pricing, then reassemble the verdict.
