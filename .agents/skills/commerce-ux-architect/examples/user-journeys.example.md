# User Journeys: Vela Botanica (Botanical Skincare for Sensitive Skin)

- Status: Ready for review
- Skill: commerce-ux-architect
- Note: EXAMPLE artifact for the beauty niche; consistent with examples/commerce-thesis.example.md and examples/page-information-architecture.example.md.

## Journey 1: First routine build (the concerned beginner)

- Shopper: Ana, 34, redness and reactive skin; researched over 2 prior sessions; skeptical of claims.
- Goal: find a complete routine that will not irritate her skin.
- Archetype path: Concern -> Routine -> Ingredient -> Product -> Purchase.

Steps:

| # | Screen | Action | Information needed to advance |
|---|---|---|---|
| 1 | Home | Taps "Find my routine" quiz entry | Reassurance the quiz is 3 questions and needs no account |
| 2 | Quiz (3 screens) | Picks concern: redness; sensitivity level; budget | Each option explained in plain language |
| 3 | Routine result page | Reads recommended 3-step routine | Why each step exists; total price; swap option per step |
| 4 | PDP (serum, step 2) | Opens serum; checks ingredients | Ingredient purposes inline; patch-test note; photo reviews |
| 5 | Cart | Reviews routine completion state | "2 of 3 steps in cart"; kit price vs. separate; returns promise |
| 6 | Checkout | Completes purchase | Delivery window; dermatologist-tested badge carried from PDP |

Friction points and design responses:

| Friction | Design response |
|---|---|
| Quiz feels like a data grab | No-account quiz; privacy line on screen 1 |
| Ingredient names are intimidating | Every ingredient links to an inline explainer |
| Buying 3 products feels risky | Kit price, patch-test promise, free returns |
| Routine result page dead-ends | Every step links to its PDP; routine is prefilled into the cart |

- Success signal: 3-step routine added to cart from the routine result page.
- Must not break: the swap-a-step option on the routine result page; ingredient links from the PDP.

## Journey 2: The ingredient researcher

- Shopper: Mira, 29, knows niacinamide helps her; compares brands before buying.
- Goal: confirm Vela's serum has the right ingredient at a useful concentration.
- Archetype path: Concern (implicit) -> Ingredient -> Product -> Purchase.

Steps:

| # | Screen | Action | Information needed to advance |
|---|---|---|---|
| 1 | Search | Types "niacinamide" | Predictive results: product, ingredient explainer, routine |
| 2 | Ingredient explainer | Reads what it does, concentration range, who it suits | Plain-language info; links to products containing it |
| 3 | PDP | Opens serum; checks concentration and formulation | Concentration stated; texture; reviews mentioning results |
| 4 | Cart | Adds serum; considers the full routine | Kit offer appears in cart (step 2 of 3) |

Friction points and design responses:

| Friction | Design response |
|---|---|
| Search returns only products | Search groups: Routines, Products, Ingredients |
| Concentration unclear on PDP | Concentration in the hero block; glossary link |

- Success signal: serum added to cart; target metric — kit upsell accepted on 40%+ of such carts.
- Must not break: search result grouping; glossary deep-links from search results.

## Journey 3: The refill customer

- Shopper: Imani, 41, 8-month customer; knows her routine; buys every 6 weeks.
- Goal: reorder the same routine in under a minute.
- Archetype path: Routine (known) -> Product -> Purchase (repeat).

Steps:

| # | Screen | Action | Information needed to advance |
|---|---|---|---|
| 1 | My Routine (account) | Opens saved routine | Routine listed with low-stock badges |
| 2 | Cart | Taps "Reorder all" | Price matches the last order; no re-research needed |
| 3 | Checkout | Pays with saved address | Subscription offer presented once, dismissible |

Friction points and design responses:

| Friction | Design response |
|---|---|
| Has to re-find products every time | My Routine page for logged-in customers |
| Subscription pushiness | One offer at checkout, dismissible forever |

- Success signal: full routine reordered without visiting a single PDP.
- Must not break: guest shoppers — My Routine prompts account creation but never walls the purchase.

## Cross-journey requirements

- Every ingredient mention anywhere renders as a glossary link (shared snippet).
- PDP hero block content order is identical on desktop and mobile; mobile adds a sticky add-to-cart.
- No page requires account creation before purchase.
