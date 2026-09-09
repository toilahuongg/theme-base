# User Journeys: Fashion & Beauty Lifestyle Commerce (Mobile-First)

- Status: Ready for review
- Skill: commerce-ux-architect
- Note: Consistent with docs/commerce-thesis.md (archetype Moment -> Look -> Product -> Complete it) and docs/page-information-architecture.md. Four journeys: two research shoppers (fashion-led and beauty-led), one repeat shopper, one different-intent gift shopper.

## Journey 1: The occasion shopper (first-time, fashion-led)

- Shopper: Maya, 29 — has a wedding in six weeks; browses on her phone on the commute; wants to look right without spending hours; trusts brands that show real bodies and honest fit.
- Goal: find one dress she can commit to, with everything she needs to wear it with it, before the weekend.
- Archetype path: Moment -> Look -> Product -> Complete it -> Purchase.

Steps:

| # | Screen | Action | Information needed to advance |
|---|---|---|---|
| 1 | Home (mobile) | Taps the "Wedding Guest" edit from the moment-led nav or hero | The edit name matches her occasion; real-life imagery, not a runway shot |
| 2 | Look landing page | Scans the styled looks; taps a look that feels like her | Each look shows the full outfit, price total, and the pieces in it |
| 3 | PDP (dress) | Checks size and fit | Fit notes, model measurements for her height, size guide link, fabric, photo reviews |
| 4 | PDP cross-sell | Sees the rest of the look ("complete the look") | The shoes and bag from the same look; bundle value, not a generic "you may also like" |
| 5 | Cart drawer | Reviews cart; sees delivery window and free returns | Delivery date before the wedding; free-returns promise; dress size repeated on the line |
| 6 | Checkout | Pays with Shop Pay | Saved address/payment; no account wall |

Friction points and design responses:

| Friction | Design response |
|---|---|
| Size anxiety blocks the add-to-cart tap | Fit notes + model measurements above the fold; size guide one tap away; free returns stated in the drawer |
| The look page is a dead-end gallery | Every piece is shoppable from the look; "add the whole look" action |
| "Is it my size AND in stock?" | Size picker greys out unavailable sizes; availability filter reached from collection grids |
| Delivery uncertainty at commit | Delivery window in the cart drawer and next to checkout; no fake urgency |

- Success signal: dress + shoes + bag from one look in the cart in under 4 minutes; checkout started.
- Must not break: per-look shoppable hotspots; the add-the-whole-look action; fit/returns reassurance carried from PDP to drawer.

## Journey 2: The ingredient researcher (research, beauty-led)

- Shopper: Priya, 34 — wants a simple glow routine that will not irritate her skin; compares two brands before buying; reads ingredient lists and photo reviews.
- Goal: confirm Veloura's serum has the right ingredient at a useful concentration, and that it fits a complete routine.
- Archetype path: Moment (skin goal) -> Look (routine) -> Ingredient (validation) -> Product -> Complete it -> Purchase.

Steps:

| # | Screen | Action | Information needed to advance |
|---|---|---|---|
| 1 | Search (mobile) | Types "niacinamide" | Predictive results grouped: ingredient guide, products, routine kit |
| 2 | Ingredient guide (glossary) | Reads what niacinamide does, useful concentration, who it suits | Plain-language explanation; links to products containing it |
| 3 | Routine look page | Opens the "Glow" routine (cleanser, serum, moisturizer) | Why each step exists; total price; swap-a-step option |
| 4 | PDP (serum) | Checks concentration and formulation | Concentration stated near the hero; key ingredient with one-line purpose; photo reviews |
| 5 | Cart drawer | Sees "2 of 3 steps of your Glow routine in cart" | Kit price vs. separate; patch-test note; returns promise |
| 6 | Checkout | Completes purchase | Delivery window; routine kit upsell accepted or dismissed once |

Friction points and design responses:

| Friction | Design response |
|---|---|
| Search returns only products, never guidance | Grouped predictive results: Looks & Guides, Products, Collections |
| Ingredient names are intimidating | Every ingredient renders as a glossary link; inline purpose on the PDP |
| Buying a whole routine feels risky | Kit value, patch-test note, free returns; one dismissible subscription offer at checkout |
| Routine page dead-ends | Each step links to its PDP; routine prefills the cart |

- Success signal: 3-step routine in cart from the routine look page; target metric — kit upsell accepted on a meaningful share of researcher carts.
- Must not break: search result grouping; glossary deep-links; swap-a-step on the routine page.

## Journey 3: The restock customer (repeat)

- Shopper: Imani, 41 — six-month customer; knows her routine and her size; buys every six weeks; resents re-research and subscription nagging.
- Goal: reorder the same serum (and check what is new) in under a minute.
- Archetype path: Routine (known) -> Product -> Purchase (repeat).

Steps:

| # | Screen | Action | Information needed to advance |
|---|---|---|---|
| 1 | Any page | Taps the account avatar in the header (shopify-account sheet) | Sign-in via Shop/social/email; no password hunt |
| 2 | My Routine (account) | Opens saved routine | Routine listed with low-stock badges and "reorder all" |
| 3 | Cart | Taps "Reorder all" | Price matches the last order; delivery window |
| 4 | Checkout | Pays with saved address | One subscription offer, clearly dismissible forever |

Friction points and design responses:

| Friction | Design response |
|---|---|
| Re-finds every product from scratch | My Routine page in the customer account; one-tap reorder |
| Subscription pushiness | Single offer at checkout, dismissible, never re-asks on that product |
| New collections invisible to returning buyers | "New" entry in the moment-led nav; account pages link back to New/Edits |

- Success signal: full routine reordered without visiting a single PDP.
- Must not break: guest purchase — the account sheet invites sign-in but never walls the cart or checkout.

## Journey 4: The gift giver (different intent)

- Shopper: Daniel, 38 — buying a birthday gift for his partner; knows she likes skincare and neutral tones; wants it to arrive wrapped and on time; will not research much.
- Goal: pick a gift that looks considered, add gift wrap and a note, and be sure it can be returned.
- Archetype path: Moment (gift occasion) -> Look (gift edit/kit) -> Product (set) -> Complete it (wrap + note) -> Purchase.

Steps:

| # | Screen | Action | Information needed to advance |
|---|---|---|---|
| 1 | Home | Taps "Gifts" from the moment-led nav | Gift-appropriate edits and sets, not a generic category |
| 2 | Gift edit page | Picks a curated set (e.g., "The Calm Ritual" kit) | What is inside; total value; "the gift they didn't know they wanted" framing |
| 3 | PDP (kit) | Adds gift wrap and a note | Wrap option and note field on the line item; no checkout surprises |
| 4 | Cart drawer | Confirms delivery date | Delivery window; returns policy for gifts |
| 5 | Checkout | Completes with saved details | No account required |

Friction points and design responses:

| Friction | Design response |
|---|---|
| Generic product grid scares off a low-research buyer | Curated gift edits and kits in the moment nav |
| Gift wrap is buried until checkout | Gift wrapping + note as a line-item property on the PDP and in the drawer |
| Returns risk on someone else's behalf | Free returns and gift-receipt language at the cart step |

- Success signal: kit + gift wrap in cart in 2 minutes; checkout started.
- Must not break: gift wrap/note added before checkout; delivery window visible before payment.

## Cross-journey requirements

- The account sheet (shopify-account) is present in the header on every page, desktop and mobile, but no purchase path requires sign-in.
- Every fit/fabric or ingredient mention renders as a glossary/size-guide link (shared snippet) — Journeys 1-2.
- PDP hero block content order is identical on desktop and mobile; mobile adds a sticky bottom add-to-cart — Journeys 1-2.
- The cart drawer is the primary cart surface on mobile and opens on every add; the full cart page remains for edits and quantity changes.
- One contextual completion prompt (look/routine) appears in the cart — never multiple, never urgency-styled.
- Free-returns and delivery-window reassurance appear at PDP-bottom, cart, and checkout-adjacent blocks; trust badges never clutter collection grids.
