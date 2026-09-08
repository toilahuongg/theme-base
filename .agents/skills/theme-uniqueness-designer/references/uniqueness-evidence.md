# Uniqueness Evidence: Structural vs Surface Difference

Reference for the theme-uniqueness-designer skill. This file tells you what counts as evidence of real uniqueness and what does not, and how to tell settings-level flexibility from structural difference.

## Verify current

Shopify's published uniqueness requirements change. This file summarizes the position as of its writing: Shopify's Theme Store requirement is that a theme must be unique and not a reskin, and that superficial styling or adding a few sections/options does not create enough uniqueness. VERIFY the current wording at run time before issuing verdicts:

- Theme Store requirements: https://shopify.dev/docs/storefronts/themes/theme-store-requirements
- Theme quality checklist: https://shopify.dev/docs/storefronts/themes/theme-quality-checklist

Never cite this file as the authority in a review; cite the live shopify.dev page you fetched this run.

## The one question

Every judgment reduces to one test, the golden rule:

> "If the source theme could reproduce the new UX using normal theme settings plus modest CSS customization: FAIL."

If the answer is "yes, a competent merchant could", the difference is surface. If the answer is "no, that would require rebuilding templates, adding schema, changing data flow, or inventing new behavior", the difference is structural or experiential.

## Surface styling: never evidence

These are settings-level or CSS-level changes. They can make a theme look different in a screenshot and still be a reskin:

- Font family, weights, sizes, letter-spacing, line-height
- Color palette, gradients, shadows, borders, border radius
- Spacing, paddings, margins, grid gaps, section widths
- Animations and transitions: fades, slides, marquees, hover effects, parallax, reveal-on-scroll
- Image filters, tints, overlays, rounded or masked images
- Icon set swaps, logo placement, announcement bar copy
- Section order, number of sections, template composition using the same building blocks
- Default values of settings that already exist in the source theme (e.g., "4 columns" -> "3 columns")
- Any change a merchant can make in the Theme Editor in under five minutes

Shopify's stated position: superficial styling/settings, or adding a few sections or options, does not create enough uniqueness. Adding a brand-new setting to the new theme is also not uniqueness; an option is not a structural difference.

## Structural and experiential difference: what counts

Real uniqueness changes what the customer can do, how pages are architected, or how the theme behaves. Evidence falls into five axes. A claim must satisfy at least one axis, and must be verifiable in code, not just in a design doc.

### Axis 1: New interaction model

The customer does something the source theme's customers could not do, or does it through a different mechanic.

Examples that count:

- Cart drawer with variant-level quantity editing and free-shipping progress, where the source only has a page cart
- Quick-view with variant and metafield selection, where the source has none
- Predictive search overlay with filter chips, where the source has a plain results page
- Scroll-spy navigation inside the PDP (sticky section menu that tracks reading position)
- Multi-select compare mode on collection pages
- Color-swatch filtering that updates the grid without reload
- Persistent bottom utility rail on mobile (not a restyled drawer)

Examples that do not count: hover zoom on images (CSS), a slide-out menu that is the source drawer with different colors (settings + CSS), an accordion that replaces a tab with the same content model (CSS).

### Axis 2: New page architecture

Pages are composed of purpose-built blocks that have no settings-level equivalent in the source theme.

Examples that count:

- Collection page rebuilt as an editorial lookbook: full-bleed intro, split media/text rows, curated product rows between editorial blocks, where the source only renders a standard grid
- PDP with an attached "product story" chapter system (mixed image/text/video sections bound to the product template)
- Homepage built from concept-specific sections (e.g., a "field guide" index) that do not exist as settings in the source
- Cart page replaced by a drawer experience with dedicated sections

Examples that do not count: adding three sections that wrap the source's existing section types with new names; stacking the same building blocks in a different order.

### Axis 3: New media treatment

The theme treats product media differently in a way that changes the experience, not just the crop.

Examples that count:

- Mixed media gallery (image + video + 3D model) with per-media aspect ratios and a filmstrip, where the source gallery is uniform images only
- Aspect-ratio system that changes the whole grid's rhythm (landscape lead media, portrait cards) with deliberate source/fallback handling
- Before/after or zoom-to-detail media interactions not available in the source
- Video-first hero with poster and play-state choreography, where the source hero is a static image block

Examples that do not count: changing image border radius, adding hover zoom, changing crop from square to portrait if the source already has an aspect-ratio setting.

### Axis 4: New shopping paradigm

The theme organizes the buying journey around a concept the source cannot express.

Examples that count:

- Expedition/bundle-first PDP where products are sold as kits with a checklist, not single SKUs
- Lookbook-to-cart flow: shop items from editorial imagery with hot spots
- Subscription-oriented presentation with plan selector and cadence logic
- Configurator or step-wizard add-to-cart flow
- Store-locator or gift-finder journeys as first-class theme sections

Caveat: if the paradigm depends on an app to function, the theme is not unique — app-powered features are not theme uniqueness. The theme must deliver the experience itself.

### Axis 5: New content model / data architecture

The theme reads and presents data the source theme has no way to express.

Examples that count:

- Product metafield-driven fields rendered on the card/PDP (e.g., weight, materials, lead time) with dedicated schema
- Collection-level curated editorial content bound through a new content model
- Menu structure with editorial blocks (image + copy + links per column) defined by a purpose-built mega menu section, not by the source's plain menu settings

Examples that do not count: rendering a metafield in a plain text block; a "mega menu" checkbox that toggles the source's existing dropdown with images.

## Settings-level flexibility vs structural difference

The most common error in uniqueness review is mistaking a theme's *flexibility* for a *difference*. A feature that exists as a checkbox, range, select, or text field in the source's `settings_schema.json` is part of the source's experience, even if the new theme changes its default value. The new theme must be judged against the source at its full settings range, not at the source's default configuration.

Four tests to distinguish the two:

1. **Schema test.** Does the source theme's `settings_schema.json` (or its section schemas) contain a setting that produces the claimed new behavior? If yes, the behavior is source flexibility. Examples: `enable_sticky_header`, `mega_menu_columns`, `product_card_image_ratio`, `enable_search_overlay`, `drawer_type`, `gallery_style`, `animations_enabled`, `header_layout`. A new default is not a difference.
2. **Interaction test.** Does the customer do something different — a different gesture, a different sequence, a different information architecture — or only see different styling? Styling differences fail this test.
3. **Screenshot test.** Cover the color/font/spacing layer. Would a reviewer comparing layouts and behaviors side by side still see a different theme? If the skeletons match, it is a reskin.
4. **Edge-case test.** Force the degenerate states: no mega menu configured, no product images, one-product collection, empty cart, short and long titles, mobile width, reduced motion. Structural differences survive these states; settings-level or CSS-only changes collapse into the source's behavior.

## The reproduction ladder

When testing the golden rule, classify the effort a merchant would need:

- Theme Editor settings only (toggles, ranges, pickers, text fields) -> surface. FAIL.
- Settings plus modest CSS in the theme's custom-CSS facility (colors, fonts, radius, spacing, animations, hover effects, gradients, image crops) -> surface. FAIL.
- Settings plus CSS plus small Liquid snippet tweaks (wrapping, class names) -> still surface unless the tweak changes behavior.
- Rewriting templates, adding new sections with new schemas, new JavaScript interactions, new data flow, new templates, or new behavior across breakpoints -> structural. Eligible for PASS if it is real, complete, and observable.

## Common traps

- **Doc-vs-code drift.** The design doc promises an interaction the code does not implement. Judge the code. FAIL the row and require the code, or drop the claim.
- **App-powered uniqueness.** "Customers can take a quiz" is not theme uniqueness if the quiz is an app embed. The theme must own the experience.
- **Empty shells.** A section that renders a heading and a text block is not a structural differentiator, no matter how the schema is named.
- **One-breakpoint wonders.** A mobile nav that differs on mobile but is the source nav on desktop is at most WEAK.
- **Counting settings added.** The new theme adding five new options to the source's product card is still the source's product card with more knobs.
- **Counting the theme's own defaults.** New theme's "3-column grid" vs source's "4-column grid" default is a settings change, not a difference.

## Decision bar

One genuinely structural differentiator can carry a row; one row rarely carries the whole theme. The theme's overall uniqueness claim rests on the set of PASS rows surviving all four tests at both design stage and code stage. Count differentiators, not features or sections.
