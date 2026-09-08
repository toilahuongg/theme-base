# Commerce Verification — scripts/README.md

This skill ships no executable scripts: commerce verification is (a) checking the CURRENT Shopify documentation for every API the implementation touches, and (b) running the manual test flows below. Automated QA is owned by theme-qa-reviewer (skill: theme-qa-reviewer), which runs the edge-case data documented in `docs/commerce-implementation.md`. The engineer's job is to verify against documentation and reproduce the flows by hand before handing off.

## 1. Verify current Shopify documentation

Shopify changes object shapes, Ajax endpoints, and theme APIs without notice. Do NOT rely on memory or on values hardcoded in this skill. Open each page that applies to the features you implemented and confirm the objects/endpoints/filters you used still exist and behave as documented:

| Topic | Source (verify current) |
| --- | --- |
| Product form tag | https://shopify.dev/docs/api/liquid/tags/product-form |
| Product object (options, selected variant, media, selling plans, quantity rule, gift_card) | https://shopify.dev/docs/api/liquid/objects/product |
| Variant object (availability, inventory policy, unit price, quantity rule, quantity price breaks, selling plan allocations) | https://shopify.dev/docs/api/liquid/objects/variant |
| Cart object (items, totals, discount allocations) | https://shopify.dev/docs/api/liquid/objects/cart |
| Money filters (money, money_with_currency, money_without_trailing_zeros) | https://shopify.dev/docs/api/liquid/filters/money |
| Cart Ajax API (add/change/update/clear, /cart.js) | https://shopify.dev/docs/api/ajax/reference/cart |
| Product Ajax API (/products/<handle>.js) and variant endpoint | https://shopify.dev/docs/api/ajax/reference/product |
| Predictive search (/search/suggest.json) | https://shopify.dev/docs/api/ajax/reference/predictive-search |
| Collection filters object | https://shopify.dev/docs/api/liquid/objects/collection-filters |
| Paginate tag | https://shopify.dev/docs/api/liquid/tags/paginate |
| Localization and currency | Search shopify.dev for: theme localization, localization form, enabled currencies |
| Quantity rules and quantity price breaks | Search shopify.dev for: quantity rules theme, quantity price breaks |
| Selling plans (groups, allocations, price adjustments) | Search shopify.dev for: selling plan groups, theme selling plans |
| Pickup availability | Search shopify.dev for: pickup availability theme section |
| Product recommendations | Search shopify.dev for: product recommendations theme |
| Section Rendering API (/?sections=...) | Search shopify.dev for: Section Rendering API |

Procedure: for each feature in `docs/commerce-implementation.md`, confirm (1) every Liquid object/field exists in the docs, (2) every JS endpoint/parameter matches the docs, (3) no field you use is marked deprecated (if deprecated, migrate to its replacement, e.g. newer discount-allocation objects over legacy `*_discount_applications` fields). Record the verification date in the implementation doc.

## 2. Manual test flows

Run these against a dev store with the test data listed in `docs/commerce-implementation.md`. Use a fresh private/incognito session where noted, and test both with JavaScript enabled and disabled (initial state must be correct and purchasable without JS).

1. **Variant picker matrix**: open the 3-option product via `?variant=<id>` for each variant; verify first-paint price/media/SKU/availability. Select every combination; verify the unavailable combination is disabled and the button never enables on it; verify sold-out (deny) vs backorder (continue) states. Verify the URL updates on change and that refreshing restores the same variant. Verify a bogus `?variant=999999` falls back cleanly.
2. **Price/media/SKU/unit price sync**: for each variant change, confirm price, compare-at strikethrough, main media, thumbnail, SKU (hidden when absent), and unit price all update together, with no stale values from the previous variant.
3. **Quantity rules**: set quantities at min/max boundaries and out-of-step values; verify snap/disable/error behavior and that volume-price tiers change the displayed price at the right quantities.
4. **Selling plans**: on a subscription product, confirm the plan selector appears only when required, a plan is preselected, add-to-cart submits the plan, and switching to a non-plan variant removes the selector. Verify plan-adjusted pricing.
5. **Cart add**: add via the product form (JS and no-JS). Verify the cart drawer opens, count badge matches `cart.item_count`, line shows correct `final_line_price`, `original_line_price` strikethrough when discounted, and selling-plan info where applicable.
6. **Cart drawer mutations**: change quantity (fast clicks — one request at a time), remove a line, empty the cart (empty state renders), re-add. Verify totals equal the sum of line finals and match checkout.
7. **Discounts**: apply a coupon; verify cart-level discount rows and total; remove it; verify rows disappear.
8. **Currency/locale**: switch currency and language; verify all prices and strings change and match the money format helper output (compare Liquid-rendered vs JS-rendered prices for `{{amount}}`, no-decimals, and comma-separator formats).
9. **Pickup availability**: open a pickup-eligible product, change variants, verify the widget refetches and shows correct availability per variant; verify the widget is absent for non-eligible products.
10. **Search/predictive search/filters/pagination**: run a query with results and one without; test predictive search keyboard navigation; apply filters, sort, and page 2 — verify params (q, filter.*, sort_by, page) are preserved and canonical/prev/next are correct.
11. **Sold out and gift cards**: verify full sold-out product state; add a gift card product to the cart and check the drawer line.
12. **Media**: switch variants with video/external-video media; verify play state resets and `media.alt` updates; thumbnail click must not change the variant.

## 3. Handoff to theme-qa-reviewer

The manual flows above are the engineer's smoke pass. They prove the implementation is coherent; they are NOT a substitute for the reviewer. Before yielding:

- `docs/commerce-implementation.md` exists with every feature row filled and the consolidated test data section complete.
- The required variant-picker matrix rows (Option A + B + C combinations, unavailable combination, sold-out variant, URL variant, deep linking, price change, media change, SKU change, quantity rule, selling plan) are all marked Implemented or explicitly Not applicable/Needs data.
- You did not certify the theme as "passed" — theme-qa-reviewer runs the flows with edge-case data and issues the readiness verdict in `docs/readiness-report.md`.
