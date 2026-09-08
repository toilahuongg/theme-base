# Commerce Thesis Checklist

Run after filling docs/commerce-thesis.md, docs/user-journeys.md, and docs/page-information-architecture.md. Every check must pass; fix failures in the artifacts, never by relaxing a check. For each check, be able to point at the artifact line that satisfies it.

## Niche specificity (anti-generic)

- [ ] The thesis names the exact niche and sub-niche (e.g., "botanical skincare for sensitive skin"), not "beauty" or "e-commerce" at large.
- [ ] The shopper is a concrete persona with role and context (e.g., "Ana, 34, researching redness"), not "the customer".
- [ ] Every design decision cites the niche behavior that drives it; no decision is justified by "best practice" or "always".
- [ ] The archetype is one of the four verbatim archetypes or a derived chain in shopper vocabulary; it is not a generic funnel (Awareness -> Consideration -> Purchase).
- [ ] The archetype chain uses the shopper's vocabulary (concern, room, use case, story), not merchant vocabulary (categories, SKUs).
- [ ] At least one decision is deliberately unusual for generic e-commerce (e.g., navigation by concern instead of category) and is justified by niche behavior.
- [ ] No section reads like it could be dropped into any other theme's thesis unchanged.
- [ ] Price positioning (premium vs. value) is stated and consistent with the shopper persona.
- [ ] Repeat purchase behavior is addressed (refills, subscriptions, reorders) or explicitly ruled out with a reason.

## The seven decisions

- [ ] Navigation model is stated and mirrors the archetype's first hop.
- [ ] Collection discovery covers at least: primary entry points, filtering needs, and curated/editorial paths.
- [ ] Search model names the shopper's actual query vocabulary and what search must surface (products, guides, ingredients, looks).
- [ ] PDP information architecture lists the information blocks in the exact order the shopper needs them, and names the above-the-fold block.
- [ ] Cross-selling logic names what to recommend, when, and which archetype step it completes; it is not "related products".
- [ ] Cart continuation defines what happens after add-to-cart: reassurance, the next decision, upsell placement, path back to the journey.
- [ ] Mobile flow is designed separately from desktop: thumb reach, tap count, sticky elements, collapsed blocks.
- [ ] Each decision names the evidence (merchant report, catalog, analytics, competitor store) that drives it.
- [ ] Assumptions are flagged as assumptions, not facts.

## User journeys

- [ ] 2-4 journeys, each with: shopper, goal, archetype path, and concrete steps.
- [ ] Each step names the screen touched and the information the shopper needs to advance.
- [ ] At least one journey covers the first-time/research shopper; at least one covers a repeat or different-intent shopper.
- [ ] Friction points are concrete (missing ingredient info, dead-end search, no comparison) and each has a design response.
- [ ] Journeys are consistent with the thesis: same archetype, same decisions.

## Page information architecture

- [ ] Every page type the theme will ship (home, collection, product, search results, cart, at minimum) is specified.
- [ ] Each page states the single question it must answer for the shopper.
- [ ] Information blocks are ordered, and each block has a purpose tied to a journey step.
- [ ] The order matches the archetype's information needs (e.g., the PDP leads with the hero claim, not delivery promises).

## Handoff readiness

- [ ] The artifacts exist at the exact contract paths: docs/commerce-thesis.md, docs/user-journeys.md, docs/page-information-architecture.md.
- [ ] Platform capability assumptions (filtering, predictive search, metafields, cart behavior) carry a "verify current" note with a shopify.dev source.
- [ ] The artifacts contain no visual-language direction (that is theme-art-director's scope) and no old-feature inventory (theme-feature-analyst's scope).
- [ ] The thesis does not self-certify performance, accessibility, or compliance; those belong to the reviewer skills.
- [ ] The artifacts are complete enough for theme-art-director, shopify-liquid-architect, and theme-editor-architect to consume without further questions.
