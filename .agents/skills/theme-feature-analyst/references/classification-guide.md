# Classification Guide

Decision criteria for classifying every feature of an existing theme into one of seven classes. Read this before assigning any class. The class is the headline decision; `keep_concept` and `keep_implementation` are the executable booleans downstream skills act on.

> VERIFY CURRENT REQUIREMENTS: Shopify Theme Store requirements, OS 2.0 rules, and app-like functionality guidance change over time. Nothing in this file is a permanent rule. When a classification depends on a current requirement, fetch it from shopify.dev before finalizing and cite the URL in the feature's `rationale`.
> Sources to consult when running:
> - Theme Store requirements: https://shopify.dev/docs/storefronts/themes/store-requirements
> - Theme Store OS 2.0 guidance: https://shopify.dev/docs/storefronts/themes/architecture (and linked OS 2.0 migration pages)
> - Theme app extensions / app boundaries: https://shopify.dev/docs/api/theme-app-extensions

---

## CORE — must keep

Load-bearing behavior the theme cannot function without. Removing it breaks the store.

Decision criteria (all should hold):

- The store cannot operate or navigate without it (header, footer, product page, cart, collection navigation).
- It is infrastructure, not campaign decoration.
- No viable alternative exists inside a theme.

Booleans: `keep_concept: true`, `keep_implementation: true`. The implementation may still be refactored by shopify-liquid-architect, but the code and markup are the foundation of the rebuild, not candidates for deletion.

Example features: header with logo + nav, footer, product page main content, cart page, collection page grid, breadcrumbs, image/richtext sections.

---

## VALUABLE — keep concept, rebuild implementation

The problem the feature solves is real and converts shoppers, but the shipped code is tied to the legacy architecture (old card markup, globals, jQuery, section coupling) and would be a liability to carry over.

Decision criteria:

- The feature meaningfully helps conversion, retention, or merchandising (e.g. reduces steps to purchase, surfaces relevant products).
- The current implementation is coupled to legacy markup, deprecated patterns, or bespoke state management that the new architecture replaces.
- Rebuilding on the new components is cheaper and cleaner than porting.

Booleans: `keep_concept: true`, `keep_implementation: false`.

Example features: quick add, predictive search, sticky add-to-cart, cart drawer, product recommendations, recently viewed, free shipping bar, mega menu.

---

## GENERIC — standard theme feature, rebuild per new architecture

A feature that every competent theme has, with no special value proposition. It stays because a store needs it, and it is rebuilt the standard way in the new theme — no bespoke behavior is preserved.

Decision criteria:

- The feature is expected baseline functionality (newsletter signup, contact form, blog pagination, search page).
- The current implementation carries no unique interaction, data, or merchandising logic worth preserving.
- The rebuild follows the new theme's standard section/snippet patterns.

Booleans: `keep_concept: true`, `keep_implementation: false`.

Example features: newsletter section, contact form, social sharing, back-to-top button, blog sidebar, standard product form (as distinct from quick add), FAQ accordion.

---

## REDESIGN — concept worth keeping, needs new UX

The idea solves a real problem, but the current interaction model is the problem: poor mobile ergonomics, confusing states, outdated pattern, or a UX that fights the store's target shopper.

Decision criteria:

- The underlying need is real (e.g. shoppers need to compare color options without loading each product).
- The shipped interaction is outdated, confusing, or fails on mobile (hover-only menus, cramped swatch targets, modal-over-modal).
- The concept survives into the new theme with a different interaction; the code does not.

Booleans: `keep_concept: true`, `keep_implementation: false`.

Example features: product swatches (needs new picker UX, mobile-first), mega menu (needs keyboard/dismissal redesign), quick view (needs a modern modal or slide-over), size chart (needs a real responsive layout instead of a scaled image).

---

## REMOVE — no value

The feature earns no place in the rebuild: dead code, decoration, gimmick, or something the target store's strategy explicitly drops.

Decision criteria:

- No evidence it affects conversion, retention, or merchandising (verify usage in templates and settings; a feature nobody enables is a candidate).
- It is a gimmick (countdown urgency timers, confetti, autoplaying carousels with no merchandising case).
- It duplicates another feature kept in the inventory.
- The store's product spec or positioning contradicts it.

Booleans: `keep_concept: false`, `keep_implementation: false`.

Example features: countdown timer, random rotating hero, ticker tape announcement, particle/floating-effects canvas, unused vendor widgets. If the feature is dead code, say so in the `rationale` ("no template renders this section; no setting enables it").

---

## APP-LIKE — belongs in an app, not a theme

Functionality that requires server-side state, cross-store data, paid services, or admin-side management that a theme cannot and should not own. Themes are presentation layers; features that need their own data store, authentication, external API keys, or recurring logic belong in an app (often surfaced via a theme app extension).

Decision criteria:

- Requires data that does not live in Shopify store resources (products, collections, customers, orders, metafields) — e.g. a server, database, or third-party API.
- Requires per-merchant accounts, API keys, or billing.
- The feature cannot function with only Liquid + storefront JS + Shopify resources.
- The Theme Store's current rules discourage shipping it inside a theme (verify current guidance from the URLs above; cite the requirement in the rationale).

Booleans: `keep_concept: false`, `keep_implementation: false`. Optionally add `recommendation: "move to app (theme app extension)"` in the rationale.

Example features: customer reviews with moderation, loyalty points, live chat, email popups with list integration, currency converter backed by an external rate API, real-time stock countdown, wishlist sync across devices (a local-only wishlist is theme-appropriate; synced wishlists need an app).

Theme-appropriate boundary (what stays in the theme): rendering store resources, theme-editor settings, Liquid filters, metafield display, vanilla JS interactions on the storefront, forms that post to Shopify native endpoints (contact form, search, customer account, cart).

---

## RISKY — licensing, performance, or accessibility risk

The feature ships a concrete risk that blocks carrying it over as-is. Assign only with evidence naming the specific risk.

Decision criteria (any one is enough):

- Licensing: unlicensed fonts, images, or third-party code; missing attribution; unknown provenance of vendored libraries. Name the asset.
- Performance: bundle weight from heavy vendors (jQuery UI, huge carousels), blocking scripts, unoptimized images, inline SVGs repeated per item. Name the artifact and rough impact.
- Accessibility: keyboard traps, focus loss, missing labels, contrast failures, hover-only interactions, no reduced-motion handling. Name the interaction and the WCAG criterion it violates (verify current WCAG guidance; do not hardcode version numbers as permanent rules).

Booleans: `keep_concept`: your judgment — a risky feature with a real concept can keep its concept while the implementation is dropped; `keep_implementation: false` unless the risk is fully resolved and documented. The `rationale` MUST name the risk.

Example features: vendored jQuery plugins with no license headers (RISKY, licensing), an 800 KB carousel bundle on every page (RISKY, performance), hover-only mega menu (RISKY, accessibility — and often also REDESIGN; pick the class that best drives the action: RISKY when it blocks shipping, REDESIGN when the UX is the problem).

---

## App-like vs theme-appropriate — quick decision table

| Concern | Theme-appropriate (stays) | App-like (moves out) |
|---|---|---|
| Data | Shopify resources, metafields, Liquid objects | External API, server, database, per-merchant accounts |
| State | Storefront session (localStorage, URL, cart) | Cross-device sync, moderation queue, analytics backend |
| Integration | Native Shopify endpoints (cart, customer, search, contact) | Third-party SDKs, payment providers, chat/email services |
| Management | Theme editor settings | Admin panels, billing, API keys |
| Lifecycle | Renders what the store already owns | Produces, stores, or bills for data itself |

When in doubt, verify the current Theme Store requirement (link at the top of this file) and cite it in the rationale.
