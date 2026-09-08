# Accessibility Checklist — per component type

WCAG 2.2 AA-oriented. Use during the audit pass (Step 2) and again to verify fixes (Step 4). Mark each item pass/fail/na with the file and line where the fix landed. Items marked (verify current) depend on Theme Store requirements — check https://shopify.dev/docs/storefronts/themes/store-requirements at audit time.

## Global (every template)

- [ ] Exactly one `h1` per page; no skipped heading levels (1.3.1, 2.4.6).
- [ ] Landmarks: one `<header>`, one `<main id="MainContent">`, one `<footer>`; navs labeled (1.3.1).
- [ ] Skip link is the first focusable element, visible on focus, targets `#MainContent` (2.4.1).
- [ ] Focus indicator visible on every interactive element: `:focus-visible` with 2px outline, 3:1 against adjacent color, 2px offset (2.4.11).
- [ ] No `outline: none` without replacement (2.4.7).
- [ ] Page works at 200% zoom with no loss of function or horizontal scroll for content (1.4.4, 1.4.10).
- [ ] No content flashes more than three times per second (2.3.1).
- [ ] Full keyboard walkthrough passes: Tab order logical, no traps, Escape closes overlays and returns focus (2.1.1, 2.1.2, 2.4.3).
- [ ] `prefers-reduced-motion` honored in CSS and JS: no autoplay, no scroll animation (2.3.3).
- [ ] Lighthouse accessibility score recorded per required template; threshold verified against current Theme Store requirement (verify current).
- [ ] Language attribute set on `<html>` (`{{ request.locale.iso_code }}` or equivalent) (3.1.1).
- [ ] `title` tag present and descriptive on every template (2.4.2).

## Header

- [ ] Header is a single banner landmark; logo is a link with an accessible name (alt or aria-label) (1.1.1, 1.3.1).
- [ ] Cart icon button has `aria-label` including item count, or a visually hidden count span; count updates are announced politely (1.1.1, 4.1.3).
- [ ] Search toggle: `aria-expanded`, `aria-controls`; open moves focus to the input; Escape closes and returns focus (4.1.2, 2.4.3).
- [ ] Announcement bar text is present in the accessibility tree (not `aria-hidden`, not image-only without alt) (1.3.1).
- [ ] Locale/currency selectors have labels; changes are announced if they re-render the page (1.3.1, 4.1.3).
- [ ] Account/login links have meaningful names ("Log in", not "Account icon") (2.4.4).
- [ ] Sticky header does not cover content at 200% zoom or when zooming with a focused element (1.4.10).

## Navigation

- [ ] `<nav aria-label="Main menu">`; current page link has `aria-current="page"` (1.3.1, 2.4.2).
- [ ] Top-level items reachable and operable by keyboard (Enter/Space activate) (2.1.1).
- [ ] Dropdown toggles: `aria-expanded` + `aria-controls`; open on Enter/Space, close on Escape; focus returns to the toggle (4.1.2, 2.4.3).
- [ ] Dropdown panels not required to stay open by hover alone; dismissible, hoverable, persistent (1.4.13).
- [ ] Closed menus contain no focusable content in the tab order (hidden/`inert`) (4.1.2, axe `aria-hidden-focus`).
- [ ] Mobile menu while open: focus trap, scroll lock, Escape closes, focus returns to the menu button (2.1.2, 2.4.3).
- [ ] Mega menu with overlay behavior traps focus and restores it on close (2.4.3).
- [ ] Breadcrumbs: `<nav aria-label="Breadcrumb">` with `aria-current="page"` on the last item (1.3.1).
- [ ] All nav links have descriptive text; no unlabeled icon-only links (2.4.4).

## Cards (product, collection, blog)

- [ ] Card title is a link with the product/collection/article name as its accessible name (2.4.4).
- [ ] Whole-card link pattern has no nested interactive elements left without handling; inner buttons (quick add, wishlist) are not inside the outer link without `stopPropagation` + proper markup (4.1.2).
- [ ] Product image alt is descriptive ("{{ title }} — front view"); decorative badges have `alt=""` (1.1.1).
- [ ] Price visible text; compare-at price includes a visually hidden "Compare at" prefix so it is not conveyed by strikethrough alone (1.4.1).
- [ ] Sale/badge text is real text, not an image without alt (1.1.1, 1.4.1).
- [ ] Quick-add buttons labeled with the product name ("Add {{ title }} to cart") (1.1.1).
- [ ] Card heading level matches the section nesting (h3 under an h2 section) (1.3.1).
- [ ] Rating stars have text or aria-label with the numeric rating (1.1.1, 1.4.1).

## Forms (newsletter, search, contact, password, customer)

- [ ] Every input has a programmatic label (`for`/`id` or `aria-labelledby`); placeholder is never the label (1.3.1, 3.3.2).
- [ ] Required fields visibly marked and `required`/`aria-required` set (3.3.1, 3.3.2).
- [ ] Errors: visible text wired with `aria-describedby`, `aria-invalid` set, focus moves to the first invalid field, error summary announced with `role="alert"` (3.3.1, 4.1.3).
- [ ] Error state not conveyed by color alone (1.4.1).
- [ ] `autocomplete` set on email, name, tel, address fields (1.3.5).
- [ ] Submit button has a clear name ("Subscribe", "Search", "Send message") (2.4.4).
- [ ] Password forms: show/hide toggle is a button with `aria-expanded`/`aria-pressed` and announces state (4.1.2).
- [ ] Form re-render after submit (Shopify contact form) announces success or error to screen readers (4.1.3).
- [ ] Validation is not the only success indicator: success state announced or visible with text (3.3.1).

## Drawers (cart drawer, search drawer)

- [ ] `role="dialog"`, `aria-modal="true"`, `aria-label` or `aria-labelledby` pointing at the heading (4.1.2).
- [ ] Focus moves into the drawer on open; initial focus on close button or the drawer heading (2.4.3).
- [ ] Focus trap: Tab cycles within the drawer, Shift+Tab cycles backwards (2.1.2).
- [ ] Escape closes the drawer; close button closes it; backdrop click closes it where applicable (2.1.2).
- [ ] Focus returns to the trigger on close (2.4.3).
- [ ] Cart drawer flow matches the product contract, verbatim: open -> focus moves into drawer; Tab -> stays logically within drawer; Escape -> closes; close -> focus returns to trigger.
- [ ] Background is inert while open (`inert` on page wrapper or equivalent) (2.4.3, 4.1.2).
- [ ] Line item remove buttons named with the product ("Remove {{ line_item.title }} from cart") (1.1.1).
- [ ] Quantity steppers labeled and keyboard operable; value changes announced (1.3.1, 4.1.3).
- [ ] Subtotal and item count updates announced politely (4.1.3).
- [ ] Empty-cart state announced on open (focus lands on a readable message) (4.1.3).
- [ ] Checkout link reachable and named (2.4.4).
- [ ] Drawer hidden state is real: `hidden`/`inert`, no focusable content in tab order when closed (4.1.2).

## Modals (quick view, product media lightbox, age gate, popups)

- [ ] `role="dialog"` + `aria-modal="true"` + `aria-labelledby` to a visible heading (4.1.2).
- [ ] All dialog rules from Drawers apply: focus in, trap, Escape, focus return, inert background (2.1.2, 2.4.3).
- [ ] Close affordances: button, Escape, backdrop click — at least two, all working (2.1.2).
- [ ] Lightbox: prev/next buttons labeled ("Previous image", "Next image"), keyboard operable, current media announced (1.1.1, 2.1.1).
- [ ] Popup/promo modal is dismissible without time limit; autoplay timers pause on hover/focus and under reduced motion (2.2.1, 2.2.2, 2.3.3).
- [ ] Modal does not open on page load without a keyboard-reachable dismiss (2.1.1, 3.2.1).
- [ ] `aria-describedby` used where a description helps context (4.1.2).

## Carousels and sliders (hero, featured collection, testimonials)

- [ ] Prev/next controls are buttons with accessible names (1.1.1, 2.4.4).
- [ ] Dot controls named ("Go to slide 2 of 5") and `aria-current`/`aria-checked` reflects the active slide (4.1.2).
- [ ] Slides announced: visually hidden polite live region or `role="group"` with `aria-roledescription="slide"` + `aria-label="N of M"` (4.1.3).
- [ ] Auto-advance: pauses on hover and focus; disabled under `prefers-reduced-motion`; content not required to be consumed within a time limit (2.2.2, 2.3.3).
- [ ] All slide content reachable by keyboard; no slide content skipped when navigating (2.1.1, 2.4.3).
- [ ] Slide links (hero CTAs) reachable and named (2.4.4).
- [ ] No trap: Tab exits the carousel normally (2.1.2).
- [ ] Swipe-only navigation absent; keyboard controls always present (2.1.1).

## Variant pickers

- [ ] Options grouped in `<fieldset>` with `<legend>` ("Size", "Color") or `role="radiogroup"` + `aria-label` (1.3.1).
- [ ] Swatch/button selection uses `role="radio"` + `aria-checked` or a button with `aria-pressed`; selection not conveyed by color/border alone (4.1.2, 1.4.1).
- [ ] Selection changes announced: polite live region with selected values, price, and availability (4.1.3).
- [ ] Sold-out/unavailable options conveyed by text ("Sold out") in addition to any visual treatment; `aria-disabled` where disabled (4.1.2).
- [ ] Price updates from selection announced (4.1.3).
- [ ] Add to cart button reflects the selection in its label ("Add to cart — Black / M") (2.4.4, 4.1.3).
- [ ] Color swatches have accessible names (color name, not hex code or "swatch") (1.1.1).
- [ ] Focus moves to the selected variant state or stays logically in the picker (2.4.3).

## Footer

- [ ] Single contentinfo landmark; footer nav is a labeled `<nav>` (1.3.1).
- [ ] Newsletter form meets all Form checks (labels, errors, announce) (1.3.1, 3.3.x).
- [ ] Social links: text or `aria-label` with platform name ("Facebook", "Instagram") (2.4.4).
- [ ] Payment icons are decorative with `alt=""` (1.1.1).
- [ ] Links reachable on mobile; no content only on hover (1.4.13, 2.1.1).
- [ ] No `h1` in footer; heading levels continue the page hierarchy (1.3.1).
- [ ] Contact/phone links have meaningful text ("Call 1-800-555-0199") (2.4.4).

## Sign-off gate (before writing the report)

- [ ] Every Critical and High finding has a fix and a passing re-test.
- [ ] Lighthouse accessibility re-run on every failed template; scores and before/after recorded.
- [ ] Keyboard walkthrough re-run on every failed page.
- [ ] Screen-reader spot check re-run on drawer, modal, variant picker, and carousel flows.
- [ ] Remaining risks listed explicitly with owner (theme code, third-party app, merchant content).
- [ ] Items deferred to theme-qa-reviewer for final sign-off are listed.
