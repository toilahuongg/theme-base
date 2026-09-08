# Commerce Implementation — Example (Aurora Essentials theme)

> This is a WORKED EXAMPLE showing how to fill `templates/commerce-implementation.md`. It covers the variant picker and the cart drawer end to end. When implementing for a real theme, replace every concrete detail with the actual sections, asset names, and APIs the theme uses, and verify current Shopify behavior on shopify.dev on the day you implement.

- Theme name / version: Aurora Essentials / 1.0.0 (Dawn-derived base; treated as audit finding, not license)
- Theme framework basis (shopify-liquid-architect doc): `docs/theme-architecture.md`
- Design system (theme-art director doc): `docs/design-system.md`
- Feature inventory (theme-feature-analyst doc): `docs/feature-inventory.md`
- Commerce date of verification (shopify.dev check): 2026-09-08
- Engineer: shopify-commerce-engineer (implementation only; behavior certification is theme-qa-reviewer's)

---

## Feature-by-feature implementation

### 1. Variant picker and availability

**Implementation approach.** The product form lives in `sections/main-product.liquid` using `{% form 'product', product %}`. The option controls are rendered from `product.options_with_values` as radio inputs named `options[<option name>]` (framework convention: no hardcoded option names; option labels come from `option.name`). The form carries a hidden `id` input initialized to `product.selected_or_first_available_variant.id`, so first paint and no-JS submission are always correct. The variant-resolution logic lives in `assets/main-product.js` as a single `resolveVariant(selectedOptions)` function that matches the cached product variant list by exact `option1`/`option2`/`option3`; every consumer (price, media, SKU, availability, unit price, pickup availability, selling-plan selector, quantity rule) is updated from that one resolved variant — no consumer resolves its own.

Variant data: the section embeds the product JSON once (`<script type="application/json" data-product-json>{{ product | json }}</script>`); on option change the picker re-reads the embedded data and, if the theme needs fresher inventory data, falls back to fetching `/products/{{ product.handle }}.js`. Client-side price strings go through the theme's single money-format helper, which mirrors `shop.money_format` and reads `window.Shopify.moneyFormat` and `window.Shopify.currency` set in `layout/theme.liquid`.

**Liquid objects / JS APIs used.** `product`, `product.options_with_values`, `product.selected_or_first_available_variant`, `product.selected_variant` (deep link), `variant.option1/2/3`, `variant.available`, `variant.inventory_policy`, `variant.price`, `variant.compare_at_price`, `variant.featured_media`, `variant.sku`, `variant.unit_price`, `variant.unit_price_measurement`, `variant.quantity_rule`, `variant.quantity_price_breaks`, `variant.requires_selling_plan`, `variant.selling_plan_allocations`; `{% form 'product', product %}`; JS: product JSON endpoint `/products/<handle>.js`, `history.replaceState` for the variant URL.

**Edge cases handled.**
- Option A + B + C combinations: all three selections resolve via exact option match; the resolved variant drives every dependent state in one pass.
- Unavailable combination (A1+B1+C1 does not exist): `resolveVariant` returns null; the picker disables option values for which no variant exists given the other selections, and the add button stays disabled.
- Sold-out variant (policy `deny`, quantity 0): value disabled in the picker; button shows "Sold out", `disabled`.
- Backorder variant (policy `continue`): remains selectable; button enabled; availability text shows the pre-order state.
- URL variant: server renders `product.selected_variant` when `?variant=` is present; picker radios checked accordingly.
- Deep linking: option change updates the URL to `?variant=<id>` via `history.replaceState` without reload; refresh restores state; invalid ids fall back to the first available variant.
- Price change: price and compare-at price (strikethrough only when compare_at > price) update from the resolved variant; unit price and volume-tier display update too.
- Media change: main media and active thumbnail swap to `variant.featured_media` via `data-media-id`; media-less variants keep the current gallery state.
- SKU change: SKU element updates from `variant.sku`; hidden when the variant has no SKU (never shows the previous variant's SKU).
- Quantity rule: quantity input snaps to the variant's `quantity_rule` min/max/increment; steppers disable at bounds; rule resets on variant change.
- Selling plan: selector appears only when the resolved variant `requires_selling_plan`; a valid plan is preselected and the hidden `selling_plan` input is set; switching to a non-plan variant removes the selector and input.
- Rapid switching: option change handlers run through a request-ordering guard; the UI always ends on the last selection, never on a stale response.

**Test data needed.** Product "Aurora Chair" with options Material (Wood/Metal/Glass), Finish (Matte/Gloss), Size (S/M/L) where Glass+Gloss+S has no variant; variants differing in price, compare_at_price, SKU, media, unit price; one variant with no SKU; one with no media; sold-out (deny) and backorder (continue) variants; a subscription variant requiring a selling plan; quantity rules min 1 / increment 2 / max 10.

### 5. Cart and cart drawer

**Implementation approach.** The drawer is the `sections/cart-drawer.liquid` section included on all pages via `{% section 'cart-drawer' %}`. Initial markup renders from the `cart` object (line items, `final_line_price`, `original_line_price`, count, `total_price`, `original_total_price`, empty state). `assets/cart-drawer.js` owns all updates: after any cart mutation it fetches `/cart.js` for state and re-renders the drawer body and count badge via the Section Rendering API (`/?sections=cart-drawer,cart-icon-bubble`) so markup stays authoritative. Mutations go through a single queue so only one `/cart/change.js` request is in flight at a time; inputs disable during the request and revert with an error message on failure. Add-to-cart on the product page dispatches a theme-wide `cart-updated` event; the drawer listens, refreshes, and opens on add per settings.

**Liquid objects / JS APIs used.** `cart`, `cart.item_count`, `cart.items`, `cart.items[i].final_line_price`, `cart.items[i].original_line_price`, `cart.items[i].url`, `cart.items[i].image`, `cart.items[i].variant`, `cart.items[i].quantity`, `cart.items[i].unit_price`, `cart.total_price`, `cart.original_total_price`, `cart.empty?`; money filters; JS: `/cart.js`, `/cart/add.js`, `/cart/change.js`, `/cart/update.js`, Section Rendering API `/?sections=cart-drawer,cart-icon-bubble`, `cart-updated` custom event.

**Edge cases handled.**
- Initial render: drawer markup matches the `cart` object on first paint (works before JS).
- Add to cart: `cart-updated` fires once per add; drawer re-renders and opens; count badge updates.
- Quantity steppers: one request at a time; disable during request; correct state after response; revert + message on error.
- Remove line: change to quantity 0; line disappears; totals/count update; empty state renders when no lines.
- Sold-out mid-session: change fails; line reverts; actionable message shown; totals never stale.
- Discounted lines: `original_line_price` strikethrough next to `final_line_price`; cart-level discounts listed from the cart allocation objects above the totals.
- Cross-tab staleness: drawer re-fetches `/cart.js` when opened rather than trusting cached markup.

**Test data needed.** Two-variant product for add/change tests; a coupon code producing a cart-level discount; a line-level discounted item; a product that can be sold out mid-session (low inventory); a multi-currency store to verify drawer totals render in `cart.currency.iso_code`.

---

## Edge-case matrix coverage statement

| Edge case | Status | Where handled |
| --- | --- | --- |
| Option A + B + C combinations | Implemented | main-product.liquid + main-product.js `resolveVariant` |
| Unavailable combination | Implemented | picker disables values; button disabled (main-product.js) |
| Sold-out variant | Implemented | disabled value + "Sold out" button state |
| URL variant | Implemented | server render of `product.selected_variant` |
| Deep linking | Implemented | `history.replaceState`; fallback for invalid ids |
| Price change | Implemented | price/compare-at/unit/volume update in one pass |
| Media change | Implemented | main media + thumbnail swap via `data-media-id` |
| SKU change | Implemented | SKU element update; hidden when empty |
| Quantity rule | Implemented | input snap + stepper bounds + reset on change |
| Selling plan | Implemented | selector + hidden input per resolved variant |

## Handoff to theme-qa-reviewer

- [x] Feature rows filled; every "Edge cases handled" bullet is observable.
- [x] Test data below lists every product/config needed to reproduce the flows.
- [x] No self-certification in this document.
- [x] Referenced docs exist: `docs/theme-architecture.md`, `docs/design-system.md`, `docs/feature-inventory.md`.

## Consolidated test data needed

- Product 1 (3-option A/B/C with unavailable combination): "Aurora Chair" — Material (Wood/Metal/Glass) x Finish (Matte/Gloss) x Size (S/M/L); Glass+Gloss+S has no variant.
- Product 2 (sold-out + backorder variants, differing price/media/SKU/unit price): "Aurora Desk" — variants with and without media, with and without SKU; one deny-policy variant at quantity 0, one continue-policy variant.
- Product 3 (quantity rules + volume breaks): "Aurora Lamp" — min 1 / increment 2 / max 10; price breaks at quantity 2 and 5.
- Product 4 (subscription): "Aurora Light Subscription" — selling-plan groups with a 10% percentage adjustment and a fixed-price plan.
- Discounts: coupon code `AURORA10` (cart-level 10%); line-level discount via product sale price.
- Store config: two currencies (USD/EUR) and two languages (en/fr); pickup location enabled for "Aurora Chair"; gift card product; video-media product; search terms "aurora" (results) and "zzzzqqq" (no results) plus a term with `<script>` for escaping checks.
