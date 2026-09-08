# Commerce Thesis: Vela Botanica (Botanical Skincare for Sensitive Skin)

- Status: Ready for review
- Skill: commerce-ux-architect
- Note: this is an EXAMPLE artifact for the beauty niche, consistent with examples/user-journeys.example.md and examples/page-information-architecture.example.md. Platform capabilities mentioned (predictive search, filtering, metafields, customer-account-aware sections) reflect the current Shopify platform; verify current behavior on shopify.dev when executing the skill.

## 1. Niche and shopper

- Niche: botanical skincare for sensitive and reactive skin; mid-premium price point.
- Primary shopper: women 28-45, skincare-literate but overwhelmed; buy after 2-5 research sessions; read ingredient lists and photo reviews before committing.
- Decision-maker: the shopper herself; no shared veto.
- Gift buyer: secondary; buys a set when the recipient's concern is known.
- How they decide: researched and trust-led. Clinical-style claims only convert with third-party evidence (dermatologist testing, real photo reviews). Price-led discounting signals low quality.
- Evidence: merchant brief (sensitive-skin positioning, 60 SKUs, 12 collections); analytics (top exits on collection pages; top searches "niacinamide", "redness"); competitor review (two general beauty themes organize by product type and convert poorly for this audience).
- Assumptions: shoppers accept a 3-question routine quiz; assumed, to be validated in QA review.

## 2. Journey archetype

- Archetype: Beauty.
- Chain: Concern -> Routine -> Ingredient -> Product.
- Why: sensitive-skin shoppers do not search "cleanser"; they search "redness" and "barrier repair". The concern defines the routine; the routine defines the products; ingredients validate each product. Category-first navigation is exactly backwards for this shopper.

## 3. The seven shopping-model decisions

1. Navigation model: primary nav by concern (Redness, Dryness, Breakouts, Barrier Repair), then by routine step within; secondary nav for refills (Shop All, Bestsellers). Driven by: shoppers arrive with a concern, not a category.
2. Collection discovery: concern landing pages are the hub, linking routines (kits) and ingredient-tagged products; home paths are the concern quiz, Bestsellers, New; collection pages filter by routine step and key ingredient. Driven by: exit analytics on collection pages — filtering must rescue undirected browsing.
3. Search model: predictive search surfaces products AND ingredient glossary entries ("niacinamide" -> product plus explainer) and routines; results grouped as Routines, Products, Ingredients. Driven by: top search terms are concerns and ingredients, not product names.
4. PDP information architecture: (1) hero claim + routine-step badge, (2) key ingredients with one-line purpose, (3) texture/swatch photography, (4) routine placement (previous/next step), (5) application steps, (6) evidence (dermatologist-tested, photo reviews), (7) full ingredient list with glossary links, (8) delivery and returns reassurance. Above the fold: hero claim, ingredient purpose, add-to-cart, routine placement. Driven by: trust-led research shopper who validates ingredients before purchase.
5. Cross-selling logic: complete-the-routine — every PDP recommends the previous and next routine step plus the full routine kit at a bundle price. Driven by: the archetype's Routine hop; a lone product without routine context fails for sensitive-skin users.
6. Cart continuation: cart shows routine completion state ("2 of 3 steps in cart"), a same-concern kit upsell, patch-test and returns reassurance, and a clear path back to the routine quiz. Driven by: drop-off between add-to-cart and checkout on incomplete routines.
7. Mobile shopping flow: quiz is 3 screens, one tap each; sticky bottom add-to-cart on the PDP; ingredient glossary opens inline without navigation loss; reviews collapsible with photo grid first; one-tap refill from "My Routine" for returning customers. Driven by: research and decisions both happen on mobile — thumb-reach only.

## 4. What the theme must make effortless

- Going from a stated concern to a complete 3-step routine in under two minutes.
- Verifying any ingredient's purpose without leaving the PDP (inline glossary).
- Reordering the same routine in one tap for repeat customers.
- Trust validation: patch-test promise, dermatologist testing, and photo reviews visible before purchase.

## 5. Why this shopping model fits the niche

Concern-driven navigation matches how sensitive-skin shoppers speak and search; routine merchandising raises average order value without discounting; ingredient transparency converts trust-led buyers; the refill path retains them. Every decision derives from observed searches and exits, not from generic e-commerce practice.

## 6. Drop-off risks and design responses

| Risk (where sessions die today) | Design response |
|---|---|
| Exit on collection pages (analytics) | Concern hubs plus routine-step filtering |
| Ingredient skepticism blocks PDP-to-cart | Inline glossary plus evidence block |
| Incomplete-routine carts abandoned | Cart routine completion state plus kit upsell |
| Refill customers re-research every time | My Routine one-tap reorder (customer-account-aware section) |

## 7. Platform capability notes

- Capabilities assumed: predictive search with grouped results, collection filtering, product metafields for ingredient data, customer-account-aware sections for My Routine.
- Verify-current status: verify current behavior and limits at https://shopify.dev/docs/storefronts/themes (search, filtering, metafields, customer accounts) when executing; never treat as permanent.
