# Page Information Architecture: Fashion & Beauty Lifestyle Commerce (Mobile-First)

- Status: Ready for review
- Skill: commerce-ux-architect
- Note: Consistent with docs/commerce-thesis.md (archetype Moment -> Look -> Product -> Complete it) and docs/user-journeys.md. Information blocks are ordered to serve the archetype: the Moment first, the Look second, Product validation before risk removal. No visual-language direction here (theme-art-director owns that).

## Home

- Question this page answers: "Does this brand speak my moment, and where do I start?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Moment hero: one current story/edit ("The Wedding Edit", "Glow", "New in") | First hop of the archetype — the shopper must see her occasion or mood, not a logo |
| 2 | Moment tiles: The Edit / Occasions / Skin goals / Gifts | Navigation model entry points (decisions 1-2; Journeys 1, 2, 4) |
| 3 | Featured look: one styled outfit or routine with shop-the-look | Look hop: shows the complete result and its pieces |
| 4 | New arrivals row | Repeat-buyer pull and discovery (Journey 3) |
| 5 | Bestseller kit/set with review count | Social proof plus a complete-look/routine starting point |
| 6 | Glossary teaser (ingredient/fit vocabulary) | Trust signal for researchers (Journey 2) |
| 7 | Footer reassurance: returns, delivery window, contact | Risk removal before any commitment |

## Collection

- Question this page answers: "Which of these fits my moment, my size/concern — and do I want the whole look?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Collection heading with moment/concern explanation | Orient by shopper vocabulary, not merchant taxonomy |
| 2 | Filter set (desktop: persistent column; mobile: drawer): size, color, price, availability, product type, concern/ingredient metafields | Self-narrowing for undirected browsing (decision 2; drop-off risk 1) |
| 3 | Product grid: image, quick-add, price, fit/ingredient badge, review count | Decision info on every card; quick-add keeps the mood (decision 7) |
| 4 | "Not sure? Start with an edit / take the 3-question routine path" escape hatch | Recover lost shoppers back into the Moment -> Look journey |
| 5 | Editorial strip: a look from this collection | Look hop pull from within a category |

## Product (PDP)

- Question this page answers: "Is this the piece for my moment, and will it fit/work for me?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Hero (above the fold): styled gallery, name, price, size/variant picker, add-to-cart, "seen in [look/routine]" link | Impulse decision core; look context completes the Product hop |
| 2 | How to wear / what it does (one paragraph) | The story of the piece; bridges Look and Product |
| 3 | Validation block: fit notes + model measurements + fabric (fashion) OR key ingredients with one-line purpose (beauty) | Trust hop; the exact information researchers need (Journeys 1-2) |
| 4 | Size guide / ingredient glossary links (inline, no navigation loss) | Validation without breaking the mood |
| 5 | Care instructions | Post-purchase confidence, low cost |
| 6 | Complete-the-look/routine (complementary block: the rest of the outfit or routine, with bundle value) | Cross-selling anchor — the archetype's last hop (decision 5) |
| 7 | Evidence: rating + photo reviews via the @app review block | Social proof from real people; app-provided, not theme-owned |
| 8 | Delivery window, free returns, (beauty: patch-test note) | Last-step risk removal; never above the hero |

## Search results

- Question this page answers: "Does this store have what I actually mean?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Query echo + result groups: Looks & Guides / Products / Collections | Mirrors the shopper's vocabulary (decision 3; drop-off risk 4) |
| 2 | Looks & Guides (articles) with styled imagery | Styled context before bare products |
| 3 | Product results with quick-add, price, fit/ingredient badge | Fast relevance judgment and quick commit |
| 4 | Filters (same set as collections, incl. availability) | Narrowing without a new search |
| 5 | Collection results | Alternative entry back into the journey |

## Cart (drawer is primary on mobile; full page for edits)

- Question this page answers: "Am I done, and is this safe to commit to?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Line items with per-item context: size/fit note (fashion) or routine-step indicator (beauty) | Completion state — "2 of 3 in your Glow routine" |
| 2 | One contextual complete-the-look/routine prompt with value | The archetype's last hop, exactly once (decision 5) |
| 3 | Free-shipping progress | Soft value incentive; never urgency-styled |
| 4 | Reassurance: delivery window, free returns, gift-receipt note where applicable | Trust at the moment of commit (decision 6) |
| 5 | Checkout action (sticky on mobile) | Forward motion in thumb reach |
| 6 | "Back to the look/routine" link | Path back to the journey, not to a dead end |

## Additional page types

### Look landing page (moment/editorial; shop-the-look)

- Question this page answers: "Is this the look I want to belong to, and what is in it?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Full-bleed styled look image with shoppable hotspots (44x44 px minimum targets) | The Look hop rendered; tap-easy on mobile |
| 2 | Piece list with prices and "add the whole look" | Complete-it action in one tap |
| 3 | Per-piece quick links to PDPs | Product hop without losing the story |
| 4 | "Why we styled it this way" note | Authenticity; the Moment's context |

### Routine / kit page (beauty look)

- Question this page answers: "Is this the routine for my skin goal, and can I swap steps?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Routine hero: skin goal, steps shown in order with why each exists | Beauty Look hop in shopper vocabulary |
| 2 | Step list: each step with hero ingredient, swap-a-step option, price | Ingredient validation per step (Journey 2) |
| 3 | Kit price vs. separate + "add the routine" | Complete-it value |
| 4 | Patch-test note and returns promise | Risk removal for a multi-product commit |

### Glossary page (ingredients / fit vocabulary)

- Question this page answers: "What does this ingredient/fit term mean, and which products prove it?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Alphabetical index with plain-language explanations | Ingredient/fit hop destination (Journey 2) |
| 2 | Per-term product links | Researcher-to-product conversion |

### My Routine / favourites (logged-in customer account)

- Question this page answers: "What do I use, and what is running low?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Saved routine/favourites with per-item status | Repeat journey anchor (Journey 3) |
| 2 | Low-stock badges and one-tap reorder | Restock without re-research |
| 3 | Single dismissible subscription offer | Retention without nagging (selling-plan capability, verify current) |

### Blog / article (styling and ritual guides)

- Question this page answers: "Why does this look/routine work, and can I buy it?"

| Order | Block | Purpose (ties to journey step) |
|---|---|---|
| 1 | Article body with inline shoppable product links | Editorial -> look -> product path |
| 2 | Related look/routine block at the end | Continuous journey, no dead end |

## Cross-page rules

- Every fit/fabric or ingredient mention anywhere renders as a size-guide/glossary link (shared snippet); glossary and size guide are deep-linkable from search results, PDPs, and look pages.
- The PDP hero block content order is identical on desktop and mobile; mobile adds a sticky bottom add-to-cart; primary touch targets are at least 44x44 px.
- The cart drawer opens on every add-to-cart (mobile-first); the full cart page remains for quantity edits; the drawer is one tap from every screen via the header cart icon.
- Trust signals (returns, delivery window, patch-test) appear at PDP-bottom, cart, and checkout-adjacent blocks only — never on collection grids or the home hero.
- Filters are the same vocabulary everywhere (size, color, price, availability, product type, concern/ingredient metafields) on collections and search results; mobile filters live in a drawer.
- No fake urgency anywhere: no fictitious countdowns or fake stock claims (Theme Store deceptive-practices rule; docs/compliance-matrix.md) — completion and value do the selling.
- The `<shopify-account>` component is in the header on every page; no purchase path requires sign-in, and account features (My Routine, favourites) are logged-in enhancements only.
- No page requires account creation before purchase; guest checkout is always available.
