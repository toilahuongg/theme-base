# Commerce Correctness Checklist

Verification checklist per commerce feature. Run this while implementing; the filled-in results (what passed, what was fixed, what needs data) belong in `docs/commerce-implementation.md` under each feature's "Edge cases handled" section. theme-qa-reviewer independently tests these flows with edge-case data — do not mark a box "verified by QA" here; mark it "implemented" only.

> Before starting: confirm the current Shopify behavior for every API touched (see `scripts/README.md` for doc URLs). Mutable behaviors (quantity rules, selling-plan objects, discount allocation objects, Ajax endpoints) change; stale assumptions fail QA.

## A. Variant picker and availability

- [ ] Every option (A/B/C) renders one control per option value from `product.options_with_values` — no hardcoded option names.
- [ ] Initial state reflects `product.selected_or_first_available_variant` (deep link `?variant=` honored).
- [ ] Selecting a combination resolves to exactly one variant (exact `option1/2/3` match against the variant list).
- [ ] Unavailable combinations: option values with no matching variant given current selection are `disabled`.
- [ ] Sold-out variants (inventory policy `deny`, quantity 0) are disabled/marked per theme policy.
- [ ] Inventory-policy-`continue` variants stay selectable (backorder), never disabled.
- [ ] Changing selection updates: price, compare-at price, media, SKU, availability text, unit price, quantity rule, selling plan selector, pickup availability, sticky add-to-cart (if any).
- [ ] No stale data after rapid option switching (requests ordered/cancelled; UI ends on the last selection).
- [ ] Variant with no SKU hides the SKU element (does not show previous SKU).
- [ ] Variant with no media keeps a valid media state.
- [ ] URL updates to `?variant=<id>` on change without reload; refresh restores state; back button works.
- [ ] Invalid `?variant=` falls back to first available variant without broken UI.

## B. Product form

- [ ] Uses `{% form 'product', product %}` with the framework's attributes; hidden variant `id` input present and updated on selection.
- [ ] No-JS submit adds the initially selected variant to the cart.
- [ ] JS submit uses `/cart/add.js` with variant id (+ quantity, + selling plan when required).
- [ ] Quantity input `name="quantity"` with min/max attributes mirroring the variant's quantity rule.
- [ ] Add button disabled when: product unavailable, selected combination unavailable, or quantity violates the rule.
- [ ] Button label states: "Add to cart" / "Sold out" / pre-order per availability; no incorrect mixed states.
- [ ] Quick-add surfaces (cards, recommendations) use the same resolution logic and never quick-add sold-out/unavailable variants.

## C. Selling plans

- [ ] Selector renders from `product.selling_plan_groups` only when the selected variant `requires_selling_plan`.
- [ ] A valid plan is preselected; hidden `selling_plan` input carries the plan id.
- [ ] Add-to-cart submits `selling_plan` with the variant; no plan = blocked with message.
- [ ] Variant change crosses plan/no-plan boundary: selector appears/disappears, plan resets to a valid allocation.
- [ ] Price reflects the selected plan's adjustment (percentage/fixed) and updates on plan change.

## D. Quantity rules and volume pricing

- [ ] Quantity input snaps to `min` (default 1), `increment`, and `max` of the selected variant.
- [ ] Steppers disabled at bounds; manual out-of-range/out-of-step entry rejected or corrected with a visible message.
- [ ] Rule resets on variant change; never carries the previous variant's max.
- [ ] Volume pricing: crossing a `minimum_quantity` break updates per-unit and total price; active tier highlighted where breaks are shown.
- [ ] Cart quantity respects rules when changed in the drawer (clamp or explicit error).

## E. Cart and cart drawer

- [ ] Initial render matches the `cart` object: count badge, line items, `final_line_price`, `original_line_price`, `url`, `image`, variant info, unit price, selling-plan allocation where present.
- [ ] Add-to-cart triggers a single cart-state refresh (event-driven) and the drawer reflects the new state.
- [ ] Quantity steppers in drawer: one in-flight request at a time, disabled during request, correct state after response, input reverts on error with message.
- [ ] Remove line (quantity 0) removes the line and updates totals/count; empty-cart state renders when no lines.
- [ ] Checkout button submits a non-empty cart only; disabled/hidden for empty cart.
- [ ] Drawer re-fetches `/cart.js` (or Section Rendering API) on open — no stale cross-tab markup.
- [ ] Cart errors (sold-out mid-session, rule violation) surface an actionable message; totals never show stale values.
- [ ] `cart.note` / `cart.attributes` (if exposed) persist via `/cart/update.js`.

## F. Discount display

- [ ] Line discounts: discounted `final_line_price` with `original_line_price` strikethrough and allocated amount (current allocation objects; verify names).
- [ ] Cart-level discounts listed with title and amount; `total_price` matches checkout.
- [ ] No discounts: no empty discount rows; totals equal the sum of line finals.
- [ ] Discount code entry (if exposed): success/error visible; totals update; removal clears rows.
- [ ] Product-page compare-at strikethrough never confused with cart line discounts.

## G. Localization and currency

- [ ] All static strings via `t` filter from `locales/`; no hardcoded English.
- [ ] `window.Shopify.locale` set from `request.locale.iso_code`; language switcher (`{% form 'localization' %}`) works and persists.
- [ ] Currency: prices render in `cart.currency.iso_code`; no hardcoded `$`/currency codes anywhere.
- [ ] Currency switcher re-renders prices and refreshes cart totals.
- [ ] Liquid `money` filters and the JS money formatter produce identical output for: `{{amount}}`, no-decimals, comma-separator, apostrophe-separator formats, and the active currency's rate.
- [ ] Free/zero prices render per shop format, consistently between Liquid and JS.

## H. Unit pricing

- [ ] Unit price + measurement renders per canonical pattern (`$4.00 / 100 g`) when `shop.unit_price_enabled` and the variant has `unit_price_measurement`.
- [ ] Hidden/absent for variants without unit price; never stale after variant change.
- [ ] Cart drawer line unit price present and correct after quantity changes.

## I. Pickup availability

- [ ] Widget renders only for pickup-eligible products and fetches availability for the SELECTED variant.
- [ ] Variant change refetches; "not available for pickup" state for variants without allocations.
- [ ] No widget (no pickup enabled) leaves no broken fetch or empty box.

## J. Product recommendations

- [ ] Renders only on product pages with product context; correct `section_id`, `product_id`, `limit` params.
- [ ] Empty response renders nothing (no broken section).
- [ ] Cards link to the right product URLs; never include the current product.

## K. Search and predictive search

- [ ] `search.results` paginated correctly; `q` and `type` params preserved across pages; terms escaped on output.
- [ ] Empty-result state renders with the original terms.
- [ ] Predictive search: debounced `/search/suggest.json` with type/limit/fields params; results grouped; no stale panel after query change.
- [ ] Keyboard: arrows move focus, Enter follows, Escape closes; click-outside closes.
- [ ] Predictive-search product links carry the correct variant where surfaced.

## L. Filters, sort, and pagination

- [ ] Filters built from `collection.filters` (param names, active state, counts, `url_to_add`/`url_to_remove`); checkboxes reflect active values.
- [ ] Toggling one filter preserves other active filters and sort.
- [ ] Price-range filter validates min/max; boolean filters toggle correctly.
- [ ] Sort persists across filter changes.
- [ ] Pagination preserves `q`, filters, and `sort_by`; page 1 reset on filter change.
- [ ] `rel=canonical`, `prev`, `next` correct; no pagination UI on a single page; no broken last-page state.

## M. Sold out

- [ ] Product fully sold out: button "Sold out" + disabled; availability text correct; no active checkout path.
- [ ] Mixed availability: per-variant state drives the button; disabled only the sold-out picker values per policy.
- [ ] Pre-order (policy `continue`) shows enabled, non-"Sold out" state.

## N. Gift cards

- [ ] `product.gift_card` products render a working product form and cart flow (no pickup widget, no recommendations assumptions).
- [ ] Gift card line renders in drawer with correct price; custom fields persist via cart attributes where the theme collects them.

## O. Product media

- [ ] Variant change swaps main media + active thumbnail to `variant.featured_media`; fallback to product media order for media-less variants.
- [ ] Video/external/model media switch cleanly; leaving a video stops it; `media.alt` updates.
- [ ] Thumbnail click changes media WITHOUT changing variant; variant select with media updates both consistently.
- [ ] Lazy loading / `image_tag` conventions honored; no layout shift explosion.

## Test data needed (for theme-qa-reviewer)

Assemble or request this data and record it in `docs/commerce-implementation.md`:

- Product with 3 options (A x B x C) where some A/B/C combinations have no variant.
- Product with sold-out variants (policy deny) and backorder variants (policy continue).
- Variants differing in price, compare-at price, media, SKU, unit price — including a media-less and a SKU-less variant.
- Products with quantity rules (min/max/increment) and quantity price breaks (volume tiers).
- Subscription products with selling-plan groups and price adjustments (percentage and fixed).
- Cart-level and line-level discounts (coupon) to verify allocation display.
- Multi-currency and multi-language store configuration.
- Pickup-eligible product with multiple pickup locations and a non-eligible one.
- Gift card product.
- Products with video/external-video/model media.
- Search terms with results, no results, and special characters (`<script>`, quotes) for escaping checks.

## Handoff note

After the checklist passes implementation, export the per-feature results into `docs/commerce-implementation.md` (template: `templates/commerce-implementation.md`) and hand the "Test data needed" section to theme-qa-reviewer, who runs these flows with edge-case data and issues the final verdict.
