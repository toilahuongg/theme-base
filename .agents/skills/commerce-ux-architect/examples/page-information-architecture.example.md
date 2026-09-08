# Page Information Architecture: Vela Botanica (Botanical Skincare for Sensitive Skin)

- Status: Ready for review
- Skill: commerce-ux-architect
- Note: EXAMPLE artifact for the beauty niche; consistent with examples/commerce-thesis.example.md and examples/user-journeys.example.md.

## Home

- Question this page answers: "Can this brand fix my concern?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Concern-led hero ("Redness? Barrier repair starts here.") | Matches the shopper's first question (Concern hop) |
| 2 | Find-my-routine quiz entry | First hop of the archetype: Concern -> Routine |
| 3 | Concern tiles (Redness, Dryness, Breakouts, Barrier Repair) | Navigation model entry points |
| 4 | Bestseller routine kit with review count | Social proof plus a complete-routine starting point |
| 5 | Ingredient glossary teaser | Trust signal for researchers (Ingredient hop) |
| 6 | Patch-test promise and dermatologist badge | Removes purchase risk before browsing |

## Collection

- Question this page answers: "Which of these is for my concern, and does it fit my routine?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Collection heading with concern explanation | Orient by concern, not product type |
| 2 | Routine-step filter (Cleanser / Serum / Moisturizer) | Rescue undirected browsing (exit analytics) |
| 3 | Key-ingredient filter | Supports the Ingredient hop |
| 4 | Product grid: image, step badge, hero ingredient, price, review count | Decision info on every card |
| 5 | "Not sure? Take the quiz" escape hatch | Recover lost shoppers back into the journey |

## Product (PDP)

- Question this page answers: "Is this safe and right for my concern, and where does it fit?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Hero: image, routine-step badge, hero claim, price, add-to-cart | Above-the-fold decision core |
| 2 | Key ingredients with one-line purpose (inline glossary) | Ingredient validation without navigation loss |
| 3 | Texture and swatch photography | Reduces texture anxiety for sensitive skin |
| 4 | Routine placement (step 2 of 3; links to the kit) | Cross-selling anchor (Routine hop) |
| 5 | Application steps | Correct-use confidence |
| 6 | Evidence: dermatologist-tested, photo reviews | Trust-led decision support |
| 7 | Full ingredient list with glossary links | Deep research without leaving the page |
| 8 | Delivery, returns, patch-test promise | Last-step risk removal |

## Search results

- Question this page answers: "Does this store have what I actually mean?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Query echo plus result groups (Routines / Products / Ingredients) | Mirrors the shopper's vocabulary |
| 2 | Product results with step badges and hero ingredients | Fast relevance judgment |
| 3 | Ingredient explainers with links | Researcher support (Ingredient hop) |
| 4 | Routine kits | Complete-the-routine pull |

## Cart

- Question this page answers: "Am I done, and is this safe to commit to?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Line items with routine-step indicators | Routine completion state ("2 of 3 steps") |
| 2 | Complete-the-routine kit upsell | Cross-selling decision |
| 3 | Patch-test promise and free returns | Risk removal at the last step |
| 4 | Checkout button plus delivery window | Forward motion |
| 5 | "Continue to routine quiz" link | Path back to the journey |

## Additional page types

### Ingredient glossary

- Question this page answers: "What does this ingredient do, and which products have it?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Alphabetical ingredient index with plain-language explanations | Ingredient hop destination |
| 2 | Per-ingredient product links | Researcher-to-product conversion |

### My Routine (logged-in)

- Question this page answers: "What do I use, and what is running low?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Saved routine with per-step products | Repeat journey anchor |
| 2 | Low-stock badges and one-tap reorder | Refill path (journey 3) |
| 3 | Subscription offer (single, dismissible) | Retention without pushiness |

## Cross-page rules

- Every ingredient mention anywhere renders as a glossary link (shared snippet).
- The PDP hero block content order is identical on desktop and mobile; mobile adds a sticky add-to-cart.
- The patch-test promise appears on PDP, cart, and checkout-adjacent blocks only, never on collection grids (clutter).
- No page asks for account creation before purchase; My Routine is a logged-in enhancement, never a wall.
