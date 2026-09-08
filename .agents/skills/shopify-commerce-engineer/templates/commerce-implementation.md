# Commerce Implementation — <THEME NAME>

> Fill every section below and save this as `docs/commerce-implementation.md` at the theme root. This is the contract handed to theme-qa-reviewer: it must be able to reproduce every edge case from the "Edge cases handled" and "Test data needed" columns. Do not delete headings; write "Not applicable" when a feature is not in the theme.
>
> For every API listed, confirm current behavior on shopify.dev before finalizing (see `scripts/README.md` for doc URLs). Mutable behaviors change; the doc must reflect what Shopify does TODAY.

- Theme name / version:
- Theme framework basis (shopify-liquid-architect doc): `docs/theme-architecture.md`
- Design system (theme-art-director doc): `docs/design-system.md`
- Feature inventory (theme-feature-analyst doc): `docs/feature-inventory.md`
- Commerce date of verification (shopify.dev check): YYYY-MM-DD
- Engineer: shopify-commerce-engineer (implementation only; behavior certification is theme-qa-reviewer's)

## How to fill this template

For each commerce feature present in the theme, complete one row block:

1. **Implementation approach** — where the logic lives (section/snippet/asset), how state flows, what renders on first paint vs updates client-side.
2. **Liquid objects / JS APIs used** — exact objects, tags, filters, and endpoints; note server-rendered vs client-side.
3. **Edge cases handled** — concrete scenarios from `references/commerce-edge-cases.md` that were handled, and HOW (what renders/updates/disables). One bullet per scenario.
4. **Test data needed** — the exact store data (product options, variant states, discounts, currency setup) required to reproduce those edge cases.

Add one row per feature. Use the same feature names as `checklists/commerce-correctness-checklist.md` so QA can map rows to checks.

---

## Feature-by-feature implementation

| # | Feature | Approach | Liquid objects / JS APIs | Edge cases handled | Test data needed |
| --- | --- | --- | --- | --- | --- |
| 1 | Variant picker and availability | <where + how state resolves and flows> | <objects/APIs> | <scenarios and expected UI outcomes> | <data required> |
| 2 | Product form | | | | |
| 3 | Selling plans | | | | |
| 4 | Quantity rules and volume pricing | | | | |
| 5 | Cart and cart drawer | | | | |
| 6 | Discount display | | | | |
| 7 | Localization and currency | | | | |
| 8 | Unit pricing | | | | |
| 9 | Pickup availability | | | | |
| 10 | Product recommendations | | | | |
| 11 | Search and predictive search | | | | |
| 12 | Filters, sort, and pagination | | | | |
| 13 | Sold out | | | | |
| 14 | Gift cards | | | | |
| 15 | Product media | | | | |

## Edge-case matrix coverage statement

For the variant picker, confirm each REQUIRED row of the handling matrix (spec): mark Implemented / Not applicable / Needs data.

| Edge case | Status | Where handled |
| --- | --- | --- |
| Option A + B + C combinations | | |
| Unavailable combination | | |
| Sold-out variant | | |
| URL variant | | |
| Deep linking | | |
| Price change | | |
| Media change | | |
| SKU change | | |
| Quantity rule | | |
| Selling plan | | |

## Handoff to theme-qa-reviewer

- [ ] All feature rows filled; every "Edge cases handled" bullet is observable (renders/updates/disables).
- [ ] "Test data needed" section below lists every product/config the reviewer must set up.
- [ ] This document contains NO self-certification ("verified by QA") — only implementation claims.
- [ ] Docs paths referenced actually exist: `docs/theme-architecture.md`, `docs/design-system.md`, `docs/feature-inventory.md`.

## Consolidated test data needed

- Product 1 (3-option A/B/C with unavailable combinations):
- Product 2 (sold-out + backorder variants, differing price/media/SKU/unit price):
- Product 3 (quantity rules: min/max/increment; volume price breaks):
- Product 4 (subscription, selling-plan groups with percentage + fixed adjustments):
- Discounts: coupon code for cart-level discount; line-level discount product:
- Store config: currencies, languages, pickup locations, gift card product, video/external-video media products, search terms with and without results:
