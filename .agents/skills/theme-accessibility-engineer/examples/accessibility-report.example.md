# Accessibility Report — Aurora (Dawn-derived theme)

- Theme: Aurora 1.2.0 (Dawn-derived; custom art direction applied)
- Date: 2026-09-08
- Auditor: theme-accessibility-engineer
- Theme root: /path/to/theme-root
- Status: Complete (builder evidence; readiness verdict belongs to theme-qa-reviewer)

## 1. Verified requirements

| Requirement | Current value | Source URL | Verified on |
| --- | --- | --- | --- |
| Theme Store accessibility minimum | Average Lighthouse accessibility score >= 90 across required templates (verify current value at audit time) | https://shopify.dev/docs/storefronts/themes/store-requirements | 2026-09-08 |
| Required template list | home, product, collection, cart, page, blog, article, 404, search, password | https://shopify.dev/docs/storefronts/themes/store-requirements | 2026-09-08 |
| WCAG baseline | WCAG 2.2 AA | https://www.w3.org/TR/WCAG22/ | 2026-09-08 |

Note: thresholds change. Values above were fetched from the cited sources on the date shown, not assumed from memory.

## 2. Scope and method

- Templates audited: home, product, collection, cart, page, blog, article, 404, search, password.
- Tooling: Lighthouse CLI (accessibility category), axe-core via browser DevTools, manual code review.
- Manual: full keyboard walkthrough per template (VoiceOver on macOS/Safari for screen-reader spot checks), 200% zoom check, prefers-reduced-motion check.
- Environment: preview store https://aurora-example.myshopify.com with storefront password, Chrome 128 on macOS.

## 3. Results summary

| Template | Lighthouse a11y (before) | Lighthouse a11y (after) | Keyboard | Screen reader | Critical/High findings open |
| --- | --- | --- | --- | --- | --- |
| Home | 87 | 100 | Pass | Pass | 0 |
| Product | 91 | 100 | Pass | Pass | 0 |
| Collection | 96 | 100 | Pass | Pass | 0 |
| Cart | 84 | 100 | Pass | Pass | 0 |
| Page | 98 | 100 | Pass | Pass | 0 |
| Blog | 97 | 100 | Pass | Pass | 0 |
| Article | 97 | 100 | Pass | Pass | 0 |
| 404 | 99 | 100 | Pass | Pass | 0 |
| Search | 95 | 100 | Pass | Pass | 0 |
| Password | 99 | 100 | Pass | Pass | 0 |
| **Average** | **94.3** | **100** | | | |

Severity definitions: Critical — blocks a primary flow for keyboard or screen-reader users. High — significant WCAG failure on a common path. Medium — secondary-path failure or WCAG gap with a workaround. Low — polish and consistency.

## 4. Findings and fixes

### A11Y-01 — Critical — Cart drawer has no focus trap and ignores Escape

- Location: `sections/cart-drawer.liquid`, `assets/cart-drawer.js`
- WCAG: 2.1.2 No Keyboard Trap, 2.4.3 Focus Order
- Finding: Opening the cart drawer left focus on the cart icon in the header. Tab cycled through the page behind the drawer, and Escape did nothing. The drawer is the primary purchase path — a keyboard or screen-reader user could not reach Checkout without tabbing blindly through the whole page.
- Fix: Added a focus trap in `assets/cart-drawer.js` (Tab wraps between first and last focusable element inside the drawer), a document-level Escape handler that closes the drawer, focus moved to the drawer heading on open, and focus returned to the cart trigger on close. The drawer container now carries `role="dialog"`, `aria-modal="true"`, `aria-label="Shopping cart"`, and `tabindex="-1"`; the page wrapper gets the `inert` attribute while the drawer is open.
- Before: Tab escaped the drawer into the page; Escape did not close.
- After: The flow matches the product contract, verbatim: open -> focus moves into drawer; Tab -> stays logically within drawer; Escape -> closes; close -> focus returns to trigger. Verified by keyboard walkthrough on the cart template and on home with an open drawer.

### A11Y-02 — Critical — Mobile menu keeps closed-panel links in the tab order

- Location: `sections/header.liquid`
- WCAG: 4.1.2 Name, Role, Value; 2.4.3 Focus Order
- Finding: The mobile menu panel was hidden with `opacity: 0` + `pointer-events: none` only. Its links stayed in the tab order when closed, so Tab could land on invisible menu items; axe reported `aria-hidden-focus`-style failures.
- Fix: The panel now uses the `hidden` attribute when closed; the toggle button sets `aria-expanded` and `aria-controls`. When open, the panel acts as a dialog: focus trap, scroll lock, Escape closes and returns focus to the menu button.
- Before: 9 hidden focus stops reachable by keyboard on home.
- After: Tab sequence contains only visible, interactive elements; axe clean on `hidden-content` and `aria-hidden-focus`.

### A11Y-03 — High — Body copy contrast below 4.5:1

- Location: `assets/base.css` (design token `--color-foreground` muted variant), `snippets/price.liquid`
- WCAG: 1.4.3 Contrast (Minimum)
- Finding: Muted gray `#8f8f8f` used for body text and secondary descriptions rendered at 3.2:1 on the white page background. Compare-at prices used the same gray, making them nearly invisible.
- Fix: Muted text token changed to `#4d4d4d` (measured 8.4:1 on white). Compare-at price keeps its visual treatment but now includes a visually hidden "Compare at" prefix so the meaning does not rely on strikethrough alone (1.4.1).
- Before: axe `color-contrast` failures on home (3 findings), product (4), collection (2), cart (2).
- After: all contrast audits pass; spot-checked worst-case regions in the footer newsletter and product card prices.

### A11Y-04 — High — Product image alt text is uninformative

- Location: `snippets/card-product.liquid`, `sections/main-product.liquid`
- WCAG: 1.1.1 Non-text Content
- Finding: All product images rendered `alt="Image"`. Screen readers announced "Image" with no product context; Lighthouse `image-alt` failed on product and collection templates.
- Fix: Primary media now uses `alt="{{ product.title }} — front view"` and variant media `alt="{{ product.title }} — {{ option_value }}"`. Media thumbnails are `alt=""` since the selected media is described in the main figure.
- Before: Lighthouse `image-alt` audit failed (2-4 instances per template).
- After: audit passes; VoiceOver announced "Quick-view example product, front view, image" on the product template.

### A11Y-05 — High — Variant selection not announced

- Location: `sections/main-product.liquid`, `assets/product-variant-picker.js`
- WCAG: 4.1.3 Status Messages, 1.4.1 Use of Color
- Finding: Selecting a size/color updated the price and button label visually but announced nothing. Sold-out options were shown grayed out with no text.
- Fix: Added a visually hidden `aria-live="polite"` status region that announces the selection, price, and availability ("Selected: Black, M. Price: $24.00."). Unavailable options now render "Sold out" text and `aria-disabled="true"; the picker legend carries the note that greyed-out options are sold out. Option groups wrapped in `<fieldset>` with `<legend>`.
- Before: VoiceOver heard no change when picking a variant; sold-out state was color-only.
- After: selection, price, and availability announced in a single polite message; sold-out conveyed by text and announced.

### A11Y-06 — Medium — Heading levels skip from h2 to h4

- Location: `sections/featured-collection.liquid`
- WCAG: 1.3.1 Info and Relationships
- Finding: Section title was `h2`, but card titles inside were `h4` (Dawn legacy), skipping h3. Heading rotor showed the jump on home and collection.
- Fix: Card titles in the featured collection now render `h3`; all other card snippets follow the same rule (h3 under an h2 section).
- After: `heading-order` passes; heading rotor reads h1 -> h2 -> h3 in sequence.

### A11Y-07 — Medium — Hero carousel auto-advances under reduced motion

- Location: `sections/hero.liquid`, `assets/hero.js`
- WCAG: 2.3.3 Animation from Interactions, 2.2.2 Pause, Stop, Hide
- Finding: The hero slider auto-advanced every 5 seconds regardless of `prefers-reduced-motion`, with no pause-on-hover/focus behavior.
- Fix: `hero.js` now checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and skips autoplay entirely; autoplay pauses on hover and on focus. A visually hidden polite region announces "Slide 2 of 5" on change; prev/next and dot controls were already named buttons and remain keyboard-operable.
- After: with reduced motion enabled, the slider renders slide 1 and only advances on manual control; without it, autoplay pauses on hover/focus.

### A11Y-08 — Low — Focus indicator below recommended thickness

- Location: `assets/base.css`
- WCAG: 2.4.11 Focus Appearance (Minimum)
- Finding: Global focus ring was a 1px outline in a light gray that measured below 3:1 against the page background.
- Fix: Global `:focus-visible` set to 2px outline in `--color-foreground` with a 2px offset; verified 3:1+ against page and card backgrounds.
- After: keyboard walkthrough shows a clearly visible ring on every element; axe `focusable-content` and manual check pass.

### A11Y-09 — Low — Cart quantity steppers undersized for touch

- Location: `sections/cart-drawer.liquid`
- WCAG: 2.5.8 Target Size (Minimum)
- Finding: Quantity stepper buttons were 32 x 32 px; adjacent buttons were not spaced 24 px apart, so the 2.5.8 minimum (24 x 24 px) was not clearly met and the targets felt cramped.
- Fix: Steppers sized to 44 x 44 px hit areas (visual 32 px with padded hit area) in the cart drawer and cart template.
- After: targets measure 44 x 44 px in DevTools on a 375 px viewport.

## 5. Re-test results

- Cart drawer flow (A11Y-01): re-ran the full keyboard sequence on cart and home — focus enters drawer, Tab wraps, Shift+Tab wraps backward, Escape closes, focus returns to the cart trigger. Passed on all templates with the drawer.
- Mobile menu (A11Y-02): re-ran the Tab sequence on home at 375 px — no hidden focus stops; axe clean. Passed.
- Contrast (A11Y-03): re-ran Lighthouse accessibility on home, product, collection, cart — all pass `color-contrast`; spot-checked footer and price text with the WebAIM checker. Passed.
- Alt text (A11Y-04): re-ran Lighthouse on product and collection — `image-alt` passes; VoiceOver spot check announced the product name. Passed.
- Variant picker (A11Y-05): VoiceOver pass — selection, price, and sold-out announcements heard in order; axe clean on the product template. Passed.
- Headings (A11Y-06): heading-rotor walkthrough on home, product, collection. Passed.
- Reduced motion (A11Y-07): emulated `prefers-reduced-motion: reduce` in DevTools — no autoplay; manual controls work. Passed.
- Focus and targets (A11Y-08, A11Y-09): keyboard walkthrough and DevTools measurement. Passed.

Final Lighthouse accessibility: 100 on all ten required templates (average 100; threshold is an average of at least 90, verify current value).

## 6. Remaining risks

| Risk | Affected surface | Why it remains | Owner |
| --- | --- | --- | --- |
| Third-party app embeds (reviews widget, chat) can inject unlabeled or non-keyboard widgets | Product template, embedded apps | App code is outside theme scope; verified with embeds disabled, which is the Theme Store baseline | App vendors; re-audit after merchant installs apps |
| Merchant-uploaded imagery with embedded text | Blog articles, banner sections | Theme cannot control merchant content; documented in theme documentation for merchants | Merchant |
| Video content without captions | Video section, product media | Theme ships the `<video>` element; captions are the merchant's responsibility | Merchant |
| NVDA/Windows verification pending | All templates | Only macOS/VoiceOver available in this environment | theme-qa-reviewer |

## 7. Hand-off to theme-qa-reviewer

- Verified requirements snapshot (Section 1) for the readiness verdict.
- NVDA and Windows keyboard verification is pending and should be part of final QA.
- All Critical and High findings are fixed and re-tested; no open Critical/High items.

This report is the builder's evidence. The submission-readiness verdict belongs to theme-qa-reviewer.
