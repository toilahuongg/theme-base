# Readiness Report — <Theme Name>

<!-- Fill every section. Delete the <...> placeholders. Do not change the shape of the YAML verdict block. -->

## Verdict

```yaml
status: BLOCKED | READY
blockers: [ ... ]
warnings: [ ... ]
ready_for_submission: true|false
```

<!-- Rules: status BLOCKED must pair with ready_for_submission: false; status READY with true.
     Every BLOCKER found below must appear in blockers; every WARN in warnings. -->

## Scope and Baseline

- Theme name:
- Theme version / commit:
- QA date:
- Review URL(s) (local dev or Shopify preview):
- Requirements verified on (URL + date): [shopify.dev Theme Store requirements] [shopify.dev performance budgets] [shopify.dev theme check] [shopify.dev accessibility]
  <!-- Mutable requirements must be fetched at run time; record exactly what was used. -->
- Areas with missing evidence and why:

## 1. Shopify Theme Check

- Command run:
- Summary (errors / warnings / info / suggestions / total):
- Errors triaged (each: code, file:line, decision BLOCKER/WARN/PASS + justification):
- Notable warnings:
- .theme-check.yml review (disabled rules and justification):

## 2. Lighthouse

- Budget used (URL + date):
- Home (mobile): performance / accessibility / best practices / SEO; LCP / TBT / CLS / page weight:
- Home (desktop):
- Product page:
- Collection page:
- Budget comparison result:

## 3. Browser QA

- Home:
- Collection:
- Product (PDP):
- Cart:
- Search:
- 404 / password / blog / article / page / custom templates:
- Drawers and modals:
- Console and network errors:

## 4. Responsive QA

- Theme breakpoints found:
- Widths tested:
- Overflow check results per page type:
- Tap target and image crop results:
- Findings:

## 5. Keyboard QA

- Skip link:
- Tab order:
- Focus visibility:
- Modals/drawers focus trap and return:
- Widget operability (carousels, sliders, accordions, quick add, qty):
- Findings:

## 6. JS-off Testing

- Pages tested with JS disabled:
- Content and navigation rendered:
- Features degraded and whether acceptable:
- Findings:

## 7. Editor QA

- Settings save/render per section:
- Preset lifecycle (create, apply, rename, duplicate, delete):
- Section add/reorder/remove:
- Edge-case content in editor:
- Findings:

## 8. Edge-case QA

Dataset (verbatim): very long titles, very long vendor, 0 images, 1 image, 20 images, portrait images, landscape images, single variant, 100 variants, sold out, mixed availability, long translations, empty collections, large menus, large carts, sale pricing.

| Fixture | Pages tested | Observed | Result |
| --- | --- | --- | --- |
| very long titles |  |  |  |
| very long vendor |  |  |  |
| 0 images |  |  |  |
| 1 image |  |  |  |
| 20 images |  |  |  |
| portrait images |  |  |  |
| landscape images |  |  |  |
| single variant |  |  |  |
| 100 variants |  |  |  |
| sold out |  |  |  |
| mixed availability |  |  |  |
| long translations |  |  |  |
| empty collections |  |  |  |
| large menus |  |  |  |
| large carts |  |  |  |
| sale pricing |  |  |  |

Fixture cleanup completed: yes / no

## 9. Localization QA

- Locale files audited:
- Translation keys (missing / extra):
- Languages tested:
- Long-translation clipping check:
- RTL check (if applicable):
- Findings:

## 10. Verdict Assembly

- READY gate check: theme check zero errors (yes/no), Lighthouse minimums met (yes/no), a11y minimums met (yes/no), zero blockers (yes/no), all areas evidenced (yes/no)
- Final status: BLOCKED / READY
- Handoff notes (what the orchestrator must dispatch for fixes, and what to re-verify):
