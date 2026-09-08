# Shopping Models: Archetypes and Derivation

Working reference for commerce-ux-architect. Use this to select the journey archetype for the theme's niche (SKILL.md Step 2) and to derive a custom archetype when the niche is not one of the four core ones.

Verify-current warning: this reference describes design patterns, not platform guarantees. Shopify storefront capabilities (collection/product filtering, predictive search, metafields, cart behavior, customer-account-aware sections, etc.) evolve. Verify current behavior and limits from shopify.dev before committing a decision that depends on one, and cite the shopify.dev source URL in docs/commerce-thesis.md.

## The four core archetypes

Each archetype lists who buys, the decision pattern, and what the storefront must do across the seven decisions (navigation, collection discovery, search, PDP, cross-selling, cart continuation, mobile).

### Beauty: Concern -> Routine -> Ingredient -> Product

- Who buys: primarily women; self-purchase plus a secondary gift buyer; two speeds — the concerned beginner (researching a problem) and the loyal repeater (restocking a routine).
- Decision pattern: starts from a skin concern (acne, dryness, aging), assembles or discovers a routine, validates by ingredient, then chooses the product. Trust is the currency: clinical claims, ingredient transparency, and routine coherence convert more than discounts.
- Navigation: by concern and routine first, product type second; a routine/quiz entry point; ingredient glossary as a destination.
- Collection discovery: concern-based collections ("for dry skin"), routine kits, ingredient tags; editorial linking from guides to products.
- Search: shoppers type concerns and ingredients ("redness", "niacinamide"); results must surface routines and ingredient explainers plus matching products.
- PDP: hero claim + key ingredients with purpose, texture/swatch, how it fits the routine, application steps, evidence (photo reviews, clinical testing).
- Cross-sell: complete-the-routine (the other steps of the regimen), same-concern alternatives, refill reminders.
- Cart: reassure (returns, patch-test promise, dermatologist-tested), continue to routine completion, one-tap refill for repeaters.
- Mobile: quiz and routine builder in a few taps; ingredient lookups and reviews on thumb reach.

### Electronics: Use case -> Category -> Compare -> Configuration -> Purchase

- Who buys: the user or a technically involved decision-maker; high research load, high price, long consideration.
- Decision pattern: starts from a use case ("4K video editing", "home office"), narrows to a category, compares 2-4 models side by side, configures (color, storage, bundle), then purchases. Rational validation dominates; spec tables and honest trade-offs build trust.
- Navigation: by use case and category; prominent compare; clear tiering (entry/mid/pro).
- Collection discovery: use-case landing pages, spec-filterable collection grids (port, power, size), editor's picks.
- Search: model numbers, use cases, spec terms; results must allow spec-based narrowing without leaving the list.
- PDP: spec table, comparison matrix, compatibility, configuration options with live price, benchmarks/reviews, warranty.
- Cross-sell: compatible accessories (cables, mounts), warranty/service plans, same-tier alternatives to compare.
- Cart: configuration summary, compatibility check result, delivery date; upsell before checkout, not during.
- Mobile: comparison and configuration must survive small screens; sticky add-to-cart with a running price.

### Furniture: Room -> Style -> Collection -> Material -> Product

- Who buys: often a household decision; large-ticket, spatial, long consideration; visual and material confidence are the blockers.
- Decision pattern: starts from a room ("living room"), settles a style (mid-century, Japandi), enters a collection, evaluates material and dimensions, then the product. The shopper must be able to visualize the piece in their space.
- Navigation: by room, then style; the collection is the organizing unit.
- Collection discovery: room landing pages, style galleries, collection pages that show pieces as a family; material swatches.
- Search: rooms, styles, materials, dimensions; results grouped by collection.
- PDP: dimensions and scale (visual and numeric), material and care, assembly and lead time, room-scene photography, fabric/color swatches.
- Cross-sell: pieces from the same collection (complete the room), material samples, complementary items (rugs, lighting).
- Cart: lead time and delivery window up front, white-glove options, free-return reassurance; save-and-compare before commit.
- Mobile: room-scene imagery and dimension context must not degrade; configurable options (fabric) with real previews.

### Fashion: Story -> Look -> Product -> Complete the look

- Who buys: style-led, aspiration-driven; browsing is part of the purchase; impulse is enabled by looks, not specs.
- Decision pattern: a story or editorial moment (a campaign, a trend, an influencer) creates a look; the shopper finds the product inside the look; completing the look is the natural next step.
- Navigation: editorial and look-driven navigation (shop the look, trends, capsules) alongside classic categories for repeat buyers.
- Collection discovery: look pages with shoppable hotspots, trend capsules, outfit editing; categories still required.
- Search: shoppers search product types and trends; results should be styled, not bare thumbnails.
- PDP: full outfit styling, size guidance (fit notes, model measurements), fabric and care, multiple angles and video.
- Cross-sell: complete-the-look items from the same outfit, size-match alternatives, same-collection pieces.
- Cart: complete-the-look prompts, per-item size reminders, bundle/outfit offer.
- Mobile: full-bleed imagery; shoppable looks must be tap-easy; add-to-cart from the look without losing the story.

## Deriving a custom archetype

When the niche is not one of the four core archetypes (groceries, outdoor, toys, pet, books, tools, ...), derive the archetype yourself. Do not force-fit a core archetype; the thesis only works if the logic matches real shoppers.

### Method

1. State who buys. Be concrete: primary shopper, decision-maker, gift buyer; purchase frequency (weekly staple vs. once-a-year); who holds the money and who holds the veto.
2. State how they decide. Research depth, impulse share, brand loyalty, price vs. trust vs. convenience, whether the decision is shared (household, parent-child, IT).
3. Map the information they need at each step. For every step of their path, list the exact information that must be present for them to continue (dimensions, ingredients, compatibility, care, delivery, warranty, reviews, provenance).
4. Name where they drop off. From merchant report or analytics: the step where sessions end — unclear collections, missing information, dead-end cart, no way to compare, no trust signal.
5. Write the archetype as a chain. Start -> Next -> Next -> ... -> Purchase. Keep it 3-5 hops, in the shopper's own vocabulary.

### Question battery (use verbatim with the merchant or the brief)

- Who buys this, and who decides? (Different people? Gift vs. self?)
- What triggers the purchase — a problem, a use case, a room, a story, a restock?
- What is the first question the shopper asks?
- What information is required at each step before they advance?
- Do they compare? Against what — models, prices, materials, brands, reviews?
- Is the purchase repeatable? What does the second purchase look like?
- Where do sessions die today, and why (per the merchant)?
- What would make the shopper stop researching and commit?

### Worked mini-profiles

- Groceries: Basket -> List -> Category -> Product -> Reorder. Repeat, fast, convenience-first; search and past orders dominate; the cart IS the plan; the PDP is near-irrelevant beyond price/unit/weight.
- Outdoor/gear: Activity -> Season/Environment -> Use case -> Specs -> Gear. Performance-led; specs, weight, weatherproofing, and honest limitations; comparison heavy; accessories cross-sell (tent -> stakes -> repair kit).
- Toys: Occasion -> Age -> Interest -> Product -> Add-on. An adult buys for a child; occasion and age gate everything; safety/age badges are trust; the add-on logic is "more fun in the box", not "you need a charger".
- Pet: Pet -> Life stage -> Need -> Product -> Repeat. The pet, not the person, is the persona; life stage (puppy, senior) and health need (sensitive stomach) drive; subscriptions and refills are natural; trust via vet input.

### Custom archetype pitfalls

- Do not copy a core archetype because it is close. If the shopper's first question differs, the archetype differs.
- Keep the chain in shopper vocabulary, not merchant vocabulary (merchants say "category"; shoppers say "for my dog" or "for my living room").
- The archetype must make the seven decisions harder to get wrong: each decision should visibly fall out of the chain.
