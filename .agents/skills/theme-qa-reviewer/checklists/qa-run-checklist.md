# QA RUN CHECKLIST — theme-qa-reviewer

Run in order. Evidence must be recorded per item before moving on; an item with no evidence is an untested area, and an untested area blocks the verdict. Reference: references/qa-methods.md for how to execute each item.

Evidence format for every item:
```
[PASS|FAIL|N/A] <item>
  Tested: <page/URL/viewport/input>
  Observed: <what actually happened>
  Evidence: <screenshot path, console excerpt, command output, metric value>
```

Severity tags: [BLOCKER] = stops submission, [WARN] = non-blocking, [PASS] = verified correct.

## Phase 0 — Setup

- [ ] 0.1 Confirm theme root structure: layout/, templates/, sections/, snippets/, assets/, config/, locales/, .theme-check.yml exist.
- [ ] 0.2 Fetch CURRENT Theme Store requirements, theme check docs, and performance budgets from shopify.dev; record URLs and date. Note: mutable values must be verified at run time, never assumed from memory.
- [ ] 0.3 Confirm a preview is available (shopify theme dev or Shopify preview URL) and the browser tooling is ready.
- [ ] 0.4 Record baseline: theme name from config/theme_info.yml or settings, current commit/version, test date.

## Phase 1 — Theme Check

- [ ] 1.1 Run `shopify theme check`; confirm the CLI works (or record that the CLI is unavailable and state how the check will be evidenced).
- [ ] 1.2 Produce JSON output (`shopify theme check --output json`) and run scripts/run-theme-check.mjs for the summary table.
- [ ] 1.3 Triage every finding by severity: errors, warnings, info, suggestions. Assign each to BLOCKER, WARN, or PASS-with-justification.
- [ ] 1.4 Inspect .theme-check.yml: disabled rules and their justification; whole-category disable is a finding.

## Phase 2 — Lighthouse

- [ ] 2.1 Audit home page (mobile and desktop presets); record scores and core metrics.
- [ ] 2.2 Audit one product page and one collection page; record scores and metrics.
- [ ] 2.3 Compare metrics against the current Theme Store budget (URL + date recorded in 0.2). Budget miss = BLOCKER.

## Phase 3 — Browser QA

- [ ] 3.1 Home page: hero, sliders/carousels, featured collections/products, newsletter, announcement bar, footer, app embeds; console clean.
- [ ] 3.2 Collection: sort, filters, pagination, product cards, badges, breadcrumbs.
- [ ] 3.3 Product (PDP): gallery, zoom/lightbox, variant picker + price updates, qty stepper, add to cart, dynamic checkout, accordions.
- [ ] 3.4 Cart: edit quantity, remove line item, free-shipping progress, upsells, note, checkout button.
- [ ] 3.5 Search: predictive results, no-results state, keyboard path trigger to result.
- [ ] 3.6 Other templates: 404, password page, blog/article, page template, custom templates.
- [ ] 3.7 Global: drawers/modals open and close, no horizontal scroll, network errors logged.

## Phase 4 — Responsive QA

- [ ] 4.1 Extract theme breakpoints from assets; record them.
- [ ] 4.2 Test every page type at 320, 375, 414, 768/834, 1024, 1280, 1440 (and theme breakpoints).
- [ ] 4.3 Per width: no horizontal overflow; tap targets >= 44x44; image crops correct; text not clipped; mobile menu works; sticky headers do not cover content.

## Phase 5 — Keyboard QA

- [ ] 5.1 Skip link present and functional on every template.
- [ ] 5.2 Tab order logical across home, product, collection, cart, search.
- [ ] 5.3 Focus visible on all interactive elements.
- [ ] 5.4 Modals/drawers: focus moves in, traps inside, Escape closes, focus returns to trigger.
- [ ] 5.5 Carousels, sliders, accordions, quick-add, qty steppers keyboard-operable with correct roles/aria.

## Phase 6 — JS-off Testing

- [ ] 6.1 Reload home, collection, product, cart, search, 404, password with JavaScript disabled.
- [ ] 6.2 Core content and primary navigation render; add-to-cart has a non-JS path where the platform allows.
- [ ] 6.3 Record which features degrade and whether degradation is acceptable (blank page = BLOCKER; cosmetic = WARN).

## Phase 7 — Editor QA

- [ ] 7.1 Change settings on every section type, save, reload storefront, confirm render.
- [ ] 7.2 Create a preset, apply, rename/duplicate, then delete it; page must not error.
- [ ] 7.3 Add/reorder/remove each section type; no editor errors.
- [ ] 7.4 Editor with edge-case content: empty fields, very long text, empty image pickers.

## Phase 8 — Edge-case QA (destructive dataset)

Run each fixture against the appropriate pages. Dataset (verbatim): very long titles, very long vendor, 0 images, 1 image, 20 images, portrait images, landscape images, single variant, 100 variants, sold out, mixed availability, long translations, empty collections, large menus, large carts, sale pricing.

- [ ] 8.1 very long titles: no grid break, no overflow, no clipping.
- [ ] 8.2 very long vendor: renders, truncates or wraps cleanly.
- [ ] 8.3 0 images / 1 image / 20 images: no broken media, gallery handles all counts.
- [ ] 8.4 portrait images / landscape images: object-fit correct, no layout jump (CLS) on load.
- [ ] 8.5 single variant: no pointless variant picker; price and add-to-cart correct.
- [ ] 8.6 100 variants: picker responsive, switching updates price/availability without jank.
- [ ] 8.7 sold out: badges, disabled controls, correct price states.
- [ ] 8.8 mixed availability: per-variant availability reflected in picker and controls.
- [ ] 8.9 long translations: no clipping in buttons, badges, notices.
- [ ] 8.10 empty collections: empty state renders, no console errors.
- [ ] 8.11 large menus: usable on desktop and mobile, drawer scrolls, no overflow.
- [ ] 8.12 large carts: 20+ line items render, qty updates, totals correct.
- [ ] 8.13 sale pricing: compare_at_price renders sale badge and strikethrough; price updates per variant; no wrong "on sale" states.
- [ ] 8.14 Clean up fixtures (delete test products/collections/locale strings); note cleanup in the report.

## Phase 9 — Localization QA

- [ ] 9.1 Inventory locale files; confirm en.default.json and en.default.schema.json exist and load.
- [ ] 9.2 No missing/extra translation keys (theme check Translation rules).
- [ ] 9.3 Switch storefront language and verify storefront chrome and content translate; schema keys present per locale.
- [ ] 9.4 Long-translation clipping check per locale.
- [ ] 9.5 RTL: if a shipped locale is RTL, verify layout flip; otherwise record as out of scope.

## Phase 10 — Verdict

- [ ] 10.1 Apply the READY gate (SKILL.md section 3): zero theme check errors, Lighthouse minimums met, a11y minimums met, zero blockers, all areas evidenced.
- [ ] 10.2 Assemble docs/readiness-report.md from templates/readiness-report.md with the exact YAML verdict block at top.
- [ ] 10.3 Double-check consistency: status vs ready_for_submission; blockers list non-empty implies BLOCKED; every BLOCKER from phases 1-9 appears in the list; every WARN appears in warnings.
- [ ] 10.4 Report to the orchestrator: status, blocker count, warning count, areas with missing evidence.
