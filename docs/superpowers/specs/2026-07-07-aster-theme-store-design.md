# Aster Theme Store Design

## Context

The current repository is based on Dawn 15.5.0. It is useful as a reference for Shopify feature coverage, edge cases, and prototype validation, but it must not be treated as the final submission codebase for the Shopify Theme Store.

Shopify Theme Store requirements currently emphasize originality, preset-specific positioning, demo store parity, accessibility, performance, and tested merchant workflows. New theme submissions built on or derived from Dawn or Horizon are not eligible for the Theme Store. Aster must therefore be rebuilt with original theme architecture or a Shopify-approved Skeleton-compatible approach after the prototype/spec phase.

## Product Direction

The theme is named **Aster**.

Aster is a Shopify theme for clinical skincare and soft premium wellness brands with a **Some (11-100+)** catalog size. The first submission should include one preset, also named **Aster**.

The theme's main experience is **routine commerce**. It helps merchants sell skincare and wellness products through routines, skin concerns, ingredient proof, education, and curated bundles rather than relying on a generic product grid.

The intended Theme Store listing tags are:

- Primary industries: Beauty and Wellness
- Catalog size: Some (11-100+)
- Preset count: 1
- Preset name: Aster

## Differentiation

Aster must be structurally different from Dawn and from other generic beauty themes.

The core differentiators are:

- Homepage flow built around guided routines: hero, routine steps, concern finder, curated products, ingredient spotlight, proof, education, and trust.
- Product pages that explain where a product fits in a routine, which concern it addresses, what key ingredients do, and what to pair it with.
- Collection pages that support guided discovery by concern, skin type, routine step, and ingredient, while preserving Shopify's native filter and sort patterns.
- Product cards that show practical decision signals such as routine step, key benefit, skin type or concern, price, availability, secondary media, and quick add.
- Merchant-friendly sections for routine, ingredient, proof, bundle, and education merchandising without depending on apps.

Cosmetic changes such as color swaps, spacing tweaks, gradients, and extra settings are not enough. Aster's identity must remain clear across core templates and merchant customization.

## Page Architecture

### Homepage

The homepage should guide a buyer from brand promise to routine-based shopping.

Required section flow for the first preset:

1. Editorial hero with product/lifestyle image, short clinical-premium copy, and one primary call to action.
2. Routine steps module with 3-5 steps such as cleanse, treat, hydrate, and protect.
3. Concern finder for common skincare concerns such as dryness, dullness, sensitivity, blemishes, and aging.
4. Featured routine or bundle merchandising.
5. Ingredient spotlight with benefit explanation and linked products.
6. Featured collection with enhanced product cards.
7. Education cards from blog articles or merchant-authored cards.
8. Proof and trust block.
9. Newsletter with restrained copy and accessible form states.

### Product Page

The product page should make the buying decision clear on mobile and desktop.

Required modules:

- Product media gallery
- Product title, price, variant picker, quantity selector, buy buttons, and pickup/availability support where applicable
- Benefit summary
- Routine step badge
- Skin concern and skin type fit
- Ingredient proof points
- How to use
- Pair-with recommendations or routine completion products
- FAQ or collapsible details
- Reviews/app block area where Shopify app blocks can render correctly

### Collection Page

The collection page should combine native Shopify browsing with Aster's guided skincare structure.

Required modules:

- Collection intro with concise context
- Guided concern, routine step, and skin type navigation
- Native filters and sort
- Enhanced product grid
- Empty state with helpful merchant-controlled copy
- Pagination or progressive loading that remains accessible and SEO-safe

### Blog And Article Pages

Blog and article templates should support educational commerce.

Required modules:

- Article header
- Rich editorial body
- Ingredient/routine callouts where appropriate
- Product callout section
- Related articles

### Cart

The cart should stay fast and clear.

Required modules:

- Cart line items with quantity updates and accessible errors
- Discounts, totals, and checkout call to action
- Routine-complete or pair-with recommendation area
- App block compatibility where Shopify expects it

## Section Architecture

The first version should prioritize a compact set of high-value sections:

- `routine-steps`: 3-5 merchant-configurable routine steps with links to products, collections, or pages.
- `concern-finder`: concern cards that link to filtered collections, collections, or pages.
- `ingredient-spotlight`: ingredient name, image, benefit copy, proof points, and linked products.
- `routine-bundle`: manual bundle or routine merchandising section without app dependency.
- `proof-points`: trust, claim, and benefit cards with accessible icon/text treatment.
- `before-after-safe`: editorial comparison section with merchant-supplied images and copy, avoiding medical result promises.
- `education-cards`: article-driven or manual education cards.
- `featured-collection`: original Aster product card treatment with Shopify-native collection data.

Core commerce primitives must also exist:

- Header
- Footer
- Product card
- Cart drawer or cart page flow
- Predictive search
- Product media
- Variant picker
- Buy buttons
- Quantity input
- Filters and facets
- Pagination
- Localization forms
- Contact/newsletter/customer forms
- SEO/social metadata

## Visual System

Aster should feel clinical but not cold, premium but not decorative.

Design principles:

- Warm white or mist backgrounds
- Near-black text for readability
- Muted botanical green or mineral blue accent
- Soft blush only as a secondary accent
- Clear editorial headings paired with highly readable body typography
- Consistent 4/8/16/24 spacing rhythm
- Low-radius cards and controls
- Full-width page bands with constrained content width
- No decorative blobs, gradient orbs, or generic bokeh backgrounds
- Real product/lifestyle imagery for the demo
- No embedded fake UI text in images

Product cards should prioritize scanability:

- Product image
- Product title
- Price
- Availability or sale state
- Routine step or benefit chip
- Skin concern or skin type chip when product data is present
- Secondary image hover on desktop
- Touch-friendly quick add on mobile

## UX And Accessibility Rules

Aster must be mobile-first.

Required UX behavior:

- Clear visible focus states
- Keyboard-accessible navigation, menus, filters, drawers, forms, and disclosures
- DOM order that matches visual focus order
- Accessible labels and IDs for all form inputs
- Minimum 24px touch targets for pointer controls
- Valid HTML
- Main body text contrast of at least 4.5:1
- Large text, icons, borders, and key non-text UI contrast of at least 3:1
- Product image alt handling through Shopify image objects or merchant settings
- No-JavaScript baseline for navigation and product purchase where Shopify supports it
- Progressive enhancement for drawers, predictive search, variant updates, and media interactions

Theme editor UX should avoid excessive settings. Each section should expose only essential controls and provide useful empty states when merchant content is missing.

## Performance Rules

Aster should keep JavaScript limited to clear interaction needs:

- Cart updates
- Variant selection
- Predictive search
- Disclosure/menu behavior
- Product media enhancements
- Progressive section interactions

The theme should avoid heavy animation and third-party libraries. Images should use Shopify image filters and responsive `image_tag` usage. Sections should not load unnecessary assets when not present on a page.

Theme Store acceptance targets:

- Average Lighthouse performance score of at least 60 across home, product, and collection pages on desktop and mobile.
- Average Lighthouse accessibility score of at least 90 across home, product, and collection pages on desktop and mobile.

## Demo Store And Listing Requirements

The first demo store must match the Aster preset:

- Industry: Beauty and Wellness
- Catalog size: Some (11-100+)
- Authentic copy, no lorem ipsum or onboarding copy
- Product imagery and lifestyle imagery with proper usage rights
- No app-dependent storefront features
- Payment setup using Bogus Gateway or Shopify Payments test mode with other checkout options disabled
- Demo store install state should match the preset's initial templates, sections, colors, typography, and copy expectations

The Theme Store listing will need:

- Theme ZIP packaged through Shopify CLI
- Correct `theme_name` in `config/settings_schema.json`
- One preset named Aster
- Demo store URL
- Desktop homepage screenshot at 1000x1248 or 2000x2496
- Mobile homepage screenshot at 750x1334
- Alt text for listing images
- Documentation URL
- Public support contact form
- Release notes for the submitted version

Because Aster starts with one preset, the plan should omit `/listings` unless the current Shopify ZIP validator requires it at packaging time. If `/listings` is required, it must mirror the Aster demo store install state.

## Build Strategy

The project should proceed in two stages.

### Stage 1: Prototype And Audit In Current Repo

Use `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base` as a working reference and prototype area only.

Goals:

- Map required Shopify feature coverage from the existing Dawn-based theme.
- Prototype Aster's key page compositions and sections.
- Verify visual direction, responsive behavior, and merchant settings.
- Run Theme Check and browser previews to catch early issues.
- Produce a rebuild checklist for the final original theme.

### Stage 2: Production Theme For Submission

Build the final Aster theme using original theme code or a Shopify-approved Skeleton-compatible foundation.

Goals:

- Implement Aster's templates, sections, snippets, assets, locales, settings, and preset install state.
- Avoid Dawn-derived code in the final Theme Store submission.
- Validate Liquid, schemas, accessibility, performance, and Theme Store checklist coverage.
- Package with `shopify theme package`.

## Validation Plan

Before Aster is considered ready for submission, run:

- `shopify theme check`
- Shopify theme validation for edited theme files
- Desktop and mobile browser previews
- Product, collection, home page Lighthouse checks
- Manual Theme Store checklist using Shopify's testing guidance
- No-JavaScript checks for navigation and product purchase basics
- Keyboard navigation checks
- Long navigation, long product title, long collection title, sold-out product, sale product, variant-heavy product, and gift card checks
- Demo store parity review against preset install state

Known baseline for the current reference repo:

- `shopify theme check` currently exits successfully.
- It reports 8 warnings across 7 files.
- The current repo still contains Dawn identity in README, `config/settings_schema.json`, and `config/settings_data.json`.
- The current homepage only has `image-banner` and `featured-collection`, which is not enough for Aster's Theme Store positioning.

## Implementation Boundaries

The implementation plan must follow these boundaries:

- Stage 1 prototype work should happen in this repository on a dedicated development branch or worktree.
- Stage 2 production work should use a separate production theme directory or repository so Dawn-derived prototype code cannot leak into the Theme Store ZIP.
- The implementation sequence must prototype the Aster experience first, then rebuild original production theme files, then validate and package.
- Exact color tokens and font choices must be finalized during visual exploration before production build.
- Documentation and support contact locations must be chosen before submission packaging.

## Approved Direction

The approved direction is:

- Theme name: Aster
- Preset count: 1
- Preset name: Aster
- Industries: Beauty and Wellness
- Catalog size: Some (11-100+)
- Positioning: clinical skincare plus soft premium wellness
- Differentiator: routine-led skincare commerce with ingredient proof
- Current repo role: prototype/reference only
- Final Theme Store role: original or Skeleton-compatible production theme
