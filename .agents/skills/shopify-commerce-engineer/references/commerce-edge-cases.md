# Commerce Edge Cases — Reference Catalog

Target: Shopify Online Store 2.0 themes (Liquid). This catalog defines the EXPECTED BEHAVIOR for every commerce edge case: what must render, update, or disable in each scenario.

> VERIFY CURRENT: Shopify changes object shapes, Ajax endpoints, and theme APIs over time. Before implementing, confirm each API below against the current Shopify docs and against the live store's data. Key sources:
> - Product form tag: https://shopify.dev/docs/api/liquid/tags/product-form
> - Product object: https://shopify.dev/docs/api/liquid/objects/product
> - Variant object: https://shopify.dev/docs/api/liquid/objects/variant
> - Cart object: https://shopify.dev/docs/api/liquid/objects/cart
> - Cart Ajax API: https://shopify.dev/docs/api/ajax/reference/cart
> - Money filters: https://shopify.dev/docs/api/liquid/filters/money
> - Search on shopify.dev for: quantity rules, quantity price breaks (volume pricing), selling plans, predictive search, collection filters, pagination, localization, pickup availability, product recommendations, Section Rendering API.

---

## 1. Variant selection (product form)

The variant picker resolves the full option selection against the variant list and drives every dependent UI state. This is the highest-risk surface in the theme.

| Scenario | Expected behavior |
| --- | --- |
| Product with options (A/B/C) renders | Server-rendered picker reflects `product.selected_or_first_available_variant`; radio/select inputs carry option values; hidden variant `id` input is set; price/media/SKU show the selected variant's data on first paint (no flash of wrong data). |
| Option A + B + C combination selected | All three selections resolve to exactly one variant via exact `option1`/`option2`/`option3` match; UI updates price, compare-at price, media, SKU, availability, unit price, quantity rule, selling plan, pickup availability, and URL. |
| Unavailable combination (A1+B1+C1 does not exist) | Option values for which NO variant exists given the current selection of the other options are disabled in the picker (rendered `disabled`). The form must not enable add-to-cart for an unresolvable selection. |
| Sold-out variant (inventory policy `deny`, quantity 0) | The option value is marked sold out/disabled when the theme's policy requires it; add button shows "Sold out", `disabled`, and cannot submit. |
| Sold-out variant with inventory policy `continue` | Variant remains selectable and purchasable (backorder); button stays enabled; availability text shows backorder state. Do not disable. |
| Variant with no image | Media area keeps current media or shows a placeholder; do not blank the gallery to a broken state. |
| Variant with no SKU | SKU element is hidden or emptied, never left showing the previous variant's SKU. |
| Rapid option switching | Requests are handled in order; the UI never ends on stale data for a selection the user already moved past. Debounce/cancel pattern required. |
| Variant change while cart drawer open | Price/availability state on the product page and any sticky add-to-cart stays consistent. |

## 2. URL variant and deep linking

| Scenario | Expected behavior |
| --- | --- |
| `?variant=<id>` valid | Server renders that variant on first paint; picker inputs are checked; price/media/SKU match; form's hidden `id` input matches the URL variant. |
| `?variant=<id>` invalid or deleted | Fallback to `selected_or_first_available_variant`; no broken UI; URL may keep the param but state must be the fallback. |
| Variant change | URL updated via `history.replaceState`/`pushState` to `?variant=<new id>` without reload; shareable; page refresh restores the same variant. |
| Option re-selection to the original variant | URL reverts correctly; no duplicate history entries that break back-button behavior. |
| Deep link from predictive search/recommendations/cross-sell | Each destination URL carries `?variant=` and lands on the right variant state. |

## 3. Price and money

| Scenario | Expected behavior |
| --- | --- |
| Variant with compare-at price | Price shows current price with compare-at strikethrough; sale styling only when compare_at_price > price. |
| Variant without compare-at price | No strikethrough, no sale styling; don't show a stale previous variant's compare-at price. |
| Price varies across variants | Server-rendered range or per-variant price, consistent with `product.price_varies` / `compare_at_price_varies`; client updates match. |
| Price ends in whole units | Money renders with the shop's format (e.g. `$50` vs `$50.00`) exactly as `money`/`money_with_currency` filters would; the JS formatter mirrors `shop.money_format` (placeholders `{{amount}}`, `{{amount_no_decimals}}`, `{{amount_with_comma_separator}}`, `{{amount_no_decimals_with_comma_separator}}`, `{{amount_with_apostrophe_separator}}`). |
| Multi-currency store | Prices render in `cart.currency.iso_code`; currency selector updates price displays; money format helper handles the active currency rate and rounding. |
| Tax-inclusive vs exclusive | Tax display follows store settings; never hardcode `+ tax` text; follow `shop.taxes_included` and the theme's tax note setting. |
| Free price (`0`) | Renders as the shop's zero-amount format (commonly "Free" via settings or `money` filter); consistent between Liquid and JS. |

## 4. Unit pricing

| Scenario | Expected behavior |
| --- | --- |
| `shop.unit_price_enabled` and variant has `unit_price` + `unit_price_measurement` | Shows e.g. `$4.00 / 100 g` using the canonical pattern: unit price, `/`, reference value when != 1, reference unit. |
| Variant without unit price | Unit-price element is absent or hidden; never shows the previous variant's unit price. |
| Cart line with unit price | Cart drawer shows line unit price and measurement; updates after quantity change if volume pricing applies. |

## 5. Quantity rules

| Scenario | Expected behavior |
| --- | --- |
| Variant has `quantity_rule.min` (default 1) | Quantity input clamps to min; minus stepper disabled at min. |
| Variant has `quantity_rule.max` | Input and stepper capped at max; plus stepper disabled at max; message shown. |
| Variant has `quantity_rule.increment` | Quantity input snaps to min + n*increment; manual out-of-step entry is corrected or rejected with a clear message. |
| Quantity rule changes on variant change | Input value, steppers, and displayed rule text reset to the new variant's rule; never keeps the previous variant's max. |
| Cart quantity above max (e.g. cart merged) | Cart drawer shows the quantity and a note; change/update clamps or errors per cart behavior; never silently truncates display. |
| Volume pricing (quantity price breaks) | When quantity crosses `minimum_quantity` of a break, per-unit price and total update; breaks list (if shown) highlights the active tier; `variant.quantity_price_breaks` objects drive the display. |

## 6. Selling plans (subscriptions / payment plans)

| Scenario | Expected behavior |
| --- | --- |
| Variant `requires_selling_plan` | Selling-plan selector renders with groups from `product.selling_plan_groups`; a valid plan is preselected; hidden `selling_plan` input carries the plan id; add-to-cart submits plan + variant. |
| Variant does not require a selling plan | No selector, no plan input; add-to-cart submits variant only. |
| Variant change crosses plan/no-plan boundary | Selector appears/disappears; selected plan resets to a valid one for the new variant (validate against `variant.selling_plan_allocations`); plan-dependent price (per `price_adjustments` on the plan) is reflected. |
| Plan price adjustment (percentage / fixed amount / fixed price) | Displayed price matches the selected plan's adjustment; switching plans updates price; switching variant resets it. |
| Add-to-cart without a required plan | Blocked with an actionable message; never silently adds without the plan. |
| Cart line with selling plan | Cart drawer shows plan name/cycle; `line.selling_plan_allocation` data used when available; quantity and remove still work. |

## 7. Product form submission

| Scenario | Expected behavior |
| --- | --- |
| No-JS submit | Form posts to `/cart/add` with the hidden variant `id` (server-rendered value = initially selected variant); purchase path works without JavaScript. |
| JS submit | `fetch('/cart/add.js')` with the selected variant id (FormData or JSON `{items:[{id, quantity, selling_plan}]}`); success updates cart state; failure shows message. |
| Duplicate add of same variant | Cart increments the line per storefront default; no duplicate lines, no error. |
| Variant deleted between render and submit | `/cart/add.js` returns 422/error; surface the message and refresh the page state. |
| Quantity input named correctly | Input `name="quantity"` min/max attributes mirror the quantity rule for no-JS enforcement. |
| Product form on non-product pages (quick add) | Quick-add uses the same variant-resolution and cart-update logic; sold-out and unavailable variants are not quick-addable. |

## 8. Cart object and cart drawer

| Scenario | Expected behavior |
| --- | --- |
| Initial render | Cart drawer/cart page render from the `cart` object: `item_count`, `total_price`, `original_total_price`, line items with `final_line_price`, `original_line_price`, `url`, `image`, `variant`, `quantity`, `unit_price`, `selling_plan_allocation`. |
| Add to cart | `cart-updated`-style event fires; drawer fetches `/cart.js` (or Section Rendering API) and re-renders; count badge updates; drawer opens on add when configured. |
| Quantity change in drawer | `POST /cart/change.js` with line key + quantity; optimistic UI or re-render from response; input disabled during the request; errors revert the input and show a message. |
| Remove line | Quantity 0 via change.js; line disappears; totals and count update; empty-cart state renders when no lines. |
| Empty cart | Drawer/cart shows the empty state (message + continue-shopping link); no totals, no checkout button that submits an empty cart. |
| Cart error (variant sold out mid-session) | Change/add fails; the line reverts; user-visible error, no stale totals. |
| Multiple tabs | Cart state is fetched fresh (`/cart.js`) before drawer opens rather than trusting stale cached markup. |
| Note/attributes | `cart.note` and `cart.attributes` render and persist via `/cart/update.js` when the theme exposes them. |

## 9. Discount display

| Scenario | Expected behavior |
| --- | --- |
| Line-level discount | Line shows discounted `final_line_price` with `original_line_price` strikethrough; discount amount shown with the allocation (check current `item.discount_allocations` vs deprecated `line_level_discount_applications`). |
| Cart-level discount | Totals area shows each discount (current `cart.discounts_allocations`; legacy `cart.cart_level_discount_applications`) with title and amount; `total_price` reflects it. |
| No discounts | No discount rows; no zero-amount rows; totals match sum of `final_line_price`. |
| Free shipping / automatic discounts | Rendered from the same allocation objects; never hardcoded strings. |
| Discount code entry (if theme exposes it) | Submit `discount` via `/cart/update.js` (`discount` attribute); success/error state visible; total updates; removed discount clears rows. |
| Compare-at vs discount confusion | Strikethrough compare-at price on product page and strikethrough original line price in cart are distinct concepts; don't mix them. |

## 10. Localization and currency

| Scenario | Expected behavior |
| --- | --- |
| Multiple languages | All static strings come from `locales/` via `t` filter; `request.locale.iso_code` drives `window.Shopify.locale`; nothing hardcoded in English. |
| Language switcher | `{% form 'localization' %}` posts to the localization endpoint; persists; page re-renders in the chosen locale. |
| Multiple currencies | `localization.country` and `cart.currency.iso_code` drive price formatting; enabled currencies come from `shop.enabled_currencies`; never hardcode `$` or a currency code. |
| Currency switcher | Selecting a currency re-renders prices; money format helper uses the active currency's rate; cart totals re-fetch after currency change. |
| Country-dependent availability | Product/cart behavior respects `shop.enabled_countries`/localization where the theme surfaces it. |

## 11. Pickup availability

| Scenario | Expected behavior |
| --- | --- |
| Product eligible for local pickup | Pickup widget renders; fetches availability for the SELECTED variant (section rendering or variant endpoint) and shows pickup locations/times. |
| Variant change | Widget refetches for the new variant; shows "not available for pickup" state for variants without allocations. |
| No pickup enabled | Widget absent; no broken fetch. |
| Product requires shipping only | Widget absent. |

## 12. Product recommendations

| Scenario | Expected behavior |
| --- | --- |
| Recommendations render | Only on product pages with product context; fetch via the recommendations endpoint (`/recommendations/products?section_id=...&product_id=...&limit=...`); empty responses render nothing, not a broken section. |
| Product IDs match | Cards link to `product.url` (with variant where appropriate); no recommendations for the current product id. |
| Performance | Lazy/deferred load after initial paint; respects reduced-motion and image loading settings. |

## 13. Search

| Scenario | Expected behavior |
| --- | --- |
| Search performed with results | `search.results` paginated; result cards show correct type (product/page/article) and link correctly; `search.terms` echoed safely (escaped). |
| Search with no results | Empty state with the original terms; no broken pagination. |
| Search types | `?type=product` / `search.types` respected; sorting via `sort_by` + `sort_options` works. |
| Pagination of results | `{% paginate search.results %}`; page links preserve `q` and `type` params; canonical/prev/next set. |
| Escaping | Query terms escaped on output; no HTML injection via search terms. |

## 14. Predictive search

| Scenario | Expected behavior |
| --- | --- |
| Typing triggers suggest | `/search/suggest.json?q=...&resources[type]=product,collection,article,page&resources[limit]=...&resources[options][fields]=...` fetched debounced; results grouped by type. |
| Product results with variants | Product entries may carry `variants`; click navigates to the right product (and variant where surfaced). |
| Empty/error response | Panel hides or shows empty state; no console-breaking fetch errors. |
| Keyboard navigation | Arrow keys move focus through results; Enter follows the highlighted result; Escape closes; focus returns to the input. |
| Click-outside | Panel closes; stale results never render after the query changes. |

## 15. Filters

| Scenario | Expected behavior |
| --- | --- |
| Filter values render | Built from `collection.filters` (labels, `param_name`, values with `active`/`count`/`url_to_add`/`url_to_remove`); checkboxes reflect active state. |
| Apply/remove filter | Navigation via `url_to_add`/`url_to_remove` preserves other active filters and sort; remove-only-one filter keeps the rest. |
| Price range filter | `filter.type == 'price_range'` inputs with min/max use the filter's param names; invalid ranges rejected. |
| Boolean filters | Checkbox state driven by `active_values`; correct param. |
| Filter + sort | Sort selection persists across filter changes; `sort_by` param preserved. |
| Filter + pagination | Page links preserve all active filter and sort params; never drop filters when paging (or always reset page to 1 on filter change). |
| No results after filter | Empty state with clear-filters action; zero-count values shown per store settings (filter values include `count`). |
| Category/faceted navigation | `collection.filters` category filters render with hierarchy when the store uses them. |

## 16. Pagination

| Scenario | Expected behavior |
| --- | --- |
| More items than page size | `{% paginate collection.products by N %}` renders page links via `paginate.parts`, next/previous via `paginate.next.url` / `paginate.previous.url`. |
| Single page | No pagination UI rendered. |
| On last page | No next link; on first page no previous link. |
| Params preserved | `q` (search), filters, and `sort_by` survive across page transitions. |
| SEO | `rel="canonical"`, `prev`, `next` link tags correct; `paginate.current_page` used for the canonical page when needed. |
| Page beyond range | Server returns last/first page state without breaking layout; no 404 page states. |

## 17. Sold out

| Scenario | Expected behavior |
| --- | --- |
| Entire product sold out | Add button shows "Sold out", disabled; availability text shows sold-out state; no checkout button; media/pickers still browsable. |
| Some variants sold out | Sold-out variants disabled in picker (per theme policy); available variants still selectable; button state follows the selected variant. |
| Pre-order (inventory policy continue) | Button enabled; text/state per theme settings (e.g. "Pre-order" or default); do not show sold out. |
| Sold-out with selling plans | Selling-plan variants are not purchasable one-time when sold out; plan selector and button reflect the same availability rules. |

## 18. Gift cards

| Scenario | Expected behavior |
| --- | --- |
| Gift card product (`product.gift_card` true) | Standard product form renders; amount variants (if any) selectable; no selling-plan/quantity-rule assumptions that gift cards don't support; add-to-cart and drawer flows work normally. |
| Gift card in cart drawer | Renders as a line with correct price/quantity; custom message/recipient fields (if the theme collects them via cart attributes) persist through `/cart/update.js`. |
| Gift card restrictions | Do not attach pickup availability or recommendations assumptions; follow `product.gift_card` semantics per current docs (e.g. no local pickup). |

## 19. Product media

| Scenario | Expected behavior |
| --- | --- |
| Variant change with `variant.featured_media` | Main media and active thumbnail swap to the variant's media; `data-media-id` logic updates; thumbnails re-sync. |
| Variant without media | Media selection falls back to product media order; gallery stays valid. |
| Video/external video/model media | `media.media_type` switching works (video plays/pauses appropriately, model viewer renders); changing variant away from a video stops it. |
| Media with custom alt | `media.alt` rendered as alt text; changing media updates alt. |
| Thumbnail selection vs variant selection | Clicking a thumbnail updates main media without changing variant; selecting a variant with media updates both; the two never fight. |
| Media loading | Images use `image_url`/`image_tag` with lazy loading per theme settings; no layout shift explosion on variant change. |

---

## Cross-cutting rules

- **One source of truth per state.** Variant state is resolved once (server-rendered variant + JS variant-resolution) and broadcast to all consumers; consumers never each resolve their own variant.
- **Money parity.** Liquid `money` filters and the JS money formatter must produce identical strings for the same input, currency, and rate.
- **Initial state = no-JS state.** What renders on first paint must be purchasable and correct without JavaScript.
- **Errors never silent.** Every failed commerce operation shows an actionable message in the page's language.
- **Data you need.** Each feature lists required test data (products with A/B/C combinations, sold-out variants, quantity rules, volume breaks, selling plans, discounts, multi-currency) in `docs/commerce-implementation.md` so theme-qa-reviewer can reproduce every row of this catalog.
