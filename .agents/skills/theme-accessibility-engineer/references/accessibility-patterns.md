# Accessibility Patterns Reference

Concrete, copy-adaptable patterns for Shopify theme components. Each pattern states the WCAG criterion it serves, the implementation, and the failure mode it prevents. Adapt the code to the theme's naming conventions; never paste blindly.

Verify current Theme Store requirements from https://shopify.dev/docs/storefronts/themes/store-requirements at audit time — values quoted here (contrast ratios, touch target sizes) are WCAG 2.2 specifications or common practice, not Shopify requirements.

## 1. Semantic structure and landmarks

- One `<header>` per page (banner landmark), one `<main id="MainContent">` (wraps `{{ content_for_layout }}`), one `<footer>` (contentinfo). No `<header>` inside `<header>`; use `<div>` for nested wrappers.
- `<nav>` elements get an accessible name: `<nav aria-label="Main menu">` (and `aria-label="Footer menu"` for the footer nav). Only one unlabeled `<nav>` is allowed per page.
- Use `<section aria-labelledby="section-heading-id">` when a section has a visible heading, so the heading names the region.
- Never make `<main>` a link target without focus support: `<main id="MainContent" tabindex="-1">` so the skip link's `:focus` outline shows.
- Check with: `npx @axe-core/cli <url> --rules landmark-one-main,landmark-banner-is-top-level,region`.

## 2. Skip link

Snippet (place first inside `<body>` in `layout/theme.liquid`):

```liquid
<a class="skip-link" href="#MainContent">Skip to content</a>
```

CSS (`assets/base.css`):

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 1000;
  padding: 1rem 1.5rem;
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));
}
.skip-link:focus {
  left: 0;
}
```

- Must be the first focusable element on every page.
- Must become visible on focus (WCAG 2.4.1 Bypass Blocks).
- Target `#MainContent` needs `tabindex="-1"` and a focus style so the outline is visible after jumping.

## 3. Heading hierarchy

- Exactly one `h1` per page. On the product template the product title is the `h1`; on home it is the hero or first section title.
- Do not skip levels: h1 -> h2 -> h3 -> h4 in order. Section titles inside `sections/` should be `h2` (a section is never a document root); card titles inside a section are `h3`.
- Headings must describe the content that follows; do not hide the only descriptive heading (e.g. "Featured collection" with `class="visually-hidden"` only, no visible text) unless the heading is decorative.
- When a section heading is visually hidden, keep the `h2` with `.visually-hidden` — hidden but present is correct; missing entirely is a WCAG 1.3.1 failure.
- Check: axe `heading-order` audit; manual: navigate with a screen reader's heading rotor (VoiceOver: `VO + Command + H`).

## 4. Focus-visible styles

Never remove focus indicators. Use `:focus-visible` for pointer-vs-keyboard distinction:

```css
:focus-visible {
  outline: 2px solid rgb(var(--color-foreground));
  outline-offset: 2px;
}
```

- WCAG 2.2 2.4.11 Focus Appearance (Minimum): the indicator must have a contrast ratio of at least 3:1 against adjacent colors and an area at least as large as a 1px-per-100px-of-width line; 2px outline + 2px offset is the safe default.
- If the design system defines a custom focus ring color, verify it against the adjacent background, not against white.
- `outline: none` is forbidden unless a visible replacement exists for keyboard users (`:focus-visible` styled differently is fine).
- Browsers style `:focus-visible` differently from `:focus`; test with a real Tab press, not a click.

## 5. Focus management for drawers and modals (focus trap + return)

The cart drawer focus flow is the product contract, verbatim:

open -> focus moves into drawer; Tab -> stays logically within drawer; Escape -> closes; close -> focus returns to trigger.

JavaScript (`assets/theme-accessibility.js`), loaded on all templates:

```js
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container) {
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

function trapFocus(container) {
  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusables = getFocusable(container);
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function openDrawer(trigger) {
  const drawer = document.getElementById(trigger.getAttribute('aria-controls'));
  if (!drawer) return;
  window.__lastFocused = trigger;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open'); // scroll lock
  trapFocus(drawer);
  const initial = drawer.querySelector('[data-autofocus]');
  (initial || drawer).focus();
}

function closeDrawer(drawer) {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
  if (window.__lastFocused) window.__lastFocused.focus();
}

// One document-level handler; safe for multiple drawers.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const open = document.querySelector('.drawer.is-open, .modal.is-open');
  if (open) closeDrawer(open);
});
```

Notes:

- The drawer/modal container gets `role="dialog"`, `aria-modal="true"`, `aria-label` (or `aria-labelledby` pointing at a visible heading), and `tabindex="-1"` so `.focus()` works when it has no focusable children (empty cart).
- While open, the rest of the page must be inert to assistive technology: set `inert` on the page wrapper (`document.querySelector('body > *')` excluding the drawer) or at minimum keep the focus trap tight. `inert` is supported in all evergreen browsers.
- Hidden drawers must be `hidden` (or `aria-hidden="true"` plus no focusable content in the tab order). Never leave focusable elements inside a closed drawer — axe `aria-hidden-focus` catches this.
- Focus moves in on open (WCAG 2.4.3), is contained (no trap: Escape always works), and returns to the trigger on close (WCAG 2.4.3 focus order restoration).

## 6. aria-modal dialogs

```liquid
<div class="modal" role="dialog" aria-modal="true"
     aria-labelledby="quickview-title" aria-describedby="quickview-desc" tabindex="-1" hidden>
  <h2 id="quickview-title">Quick view — {{ product.title }}</h2>
  <p id="quickview-desc">Choose options below to add this product to your cart.</p>
</div>
```

- `aria-labelledby` must reference a visible heading. If no visible heading exists, use `aria-label` with a meaningful name.
- `aria-modal="true"` is a hint that background content is inert; still implement the focus trap and `inert` on siblings — screen readers in some browsers ignore the hint without the actual inert state.
- Provide at least one of: close button, Escape, and backdrop click — all must work. The close button is the primary affordance.
- After close, focus returns to the trigger that opened the dialog.

## 7. Disclosure pattern (menus, accordions, search toggle)

```liquid
<button type="button" aria-expanded="false" aria-controls="menu-panel-1" class="menu__toggle">
  Shop
</button>
<div id="menu-panel-1" class="menu__panel" hidden>
  <!-- links -->
</div>
```

```js
document.querySelectorAll('.menu__toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      button.setAttribute('aria-expanded', 'false');
      document.getElementById(button.getAttribute('aria-controls')).hidden = true;
      button.focus();
    }
  });
});
```

- `aria-expanded` reflects state on the button; `aria-controls` points at the panel id.
- Escape closes the panel and returns focus to the toggle.
- Mega menus that overlay content while open act like dialogs: focus trap while open, focus return on close.
- Never leave hover as the only open mechanism (WCAG 1.4.13 Content on Hover or Focus: dismissible, hoverable, persistent).

## 8. Form labels and errors

Every input needs a programmatic label. `for`/`id` pairing is the default; `aria-label`/`aria-labelledby` only when the label cannot be visible.

```liquid
<label for="newsletter-email">Email address</label>
<input id="newsletter-email" name="contact[email]" type="email" autocomplete="email"
       required aria-describedby="newsletter-email-error">
<p id="newsletter-email-error" class="field__error" hidden>Enter a valid email address.</p>
```

- Placeholder text is never a label (WCAG 1.3.1, 3.3.2); it disappears, has poor contrast, and is not a name.
- On validation failure: reveal the error text, add `aria-invalid="true"` to the input, keep `aria-describedby` wired, and move focus to the first invalid field.
- Error states must not be conveyed by color alone; the text is the source of truth.
- Required fields: visible indication plus `required`/`aria-required="true"`.
- Use `autocomplete` attributes (`email`, `name`, `tel`, `street-address`) for known field types (WCAG 1.3.5).
- If a form submits and re-renders with errors (Shopify contact form), render the error with `role="alert"` or `aria-live="assertive"` so it is announced.

## 9. Image alt rules

| Case | Rule | Example |
| --- | --- | --- |
| Product image, primary | Describe the product as shown | `alt="{{ product.title }} — front view"` |
| Variant image | Include the variant | `alt="{{ product.title }} — {{ option.value }}"` |
| Decorative (badges, icons, dividers) | `alt=""` (empty, still present) | `alt=""` |
| Link/button image | Destination or action | `alt="View {{ product.title }}"` |
| Image containing text | The text in the alt | `alt="Free shipping over $50"` |
| Duplicates adjacent text | `alt=""` | `alt=""` next to the title link |

- Never leave `alt` missing on an informative image (Lighthouse `image-alt` is a critical audit).
- Never use the filename, "Image", or "photo of" as the alt.
- Product media in the gallery: the first/selected media describes the product; thumbnails can be `alt=""` (the selected media is announced in the main figure).
- Logos: `alt="{{ shop.name }}"` when the logo is the home link.

## 10. Contrast ratios

WCAG 2.2 AA thresholds (verify Shopify-specific minimums from the store requirements page):

- Normal text: 4.5:1.
- Large text (>= 24px regular, or >= 18.66px bold): 3:1.
- UI component boundaries and meaningful graphics (icons, focus rings, input borders): 3:1.

Practical rules for themes:

- Body copy color from design tokens must be checked against the actual background token, including page background versus card background.
- Opacity never counts toward contrast: `color: rgba(var(--color-foreground), 0.6)` fails even when the hex would pass. Compute the blended color.
- Text over images: the image must be darkened or the text placed on a solid overlay; check the worst-case region of the image.
- Placeholder text is exempt but must remain at least 3:1 to be usable.
- Quick check: https://webaim.org/resources/contrastchecker/ — and the axe `color-contrast` audit, which measures rendered color.

## 11. Touch targets

- WCAG 2.2 2.5.8 Target Size (Minimum): 24 x 24 CSS px for pointer inputs, with exceptions for inline text, spacing (targets 24px apart), and essential targets.
- Common practice for comfortable mobile UI is 44 x 44 px (Apple HIG). Theme menus and cart quantity steppers should aim for at least 40-44 px hit areas.
- Increase hit area without changing visuals: padding plus negative margins, or a pseudo-element that extends the target:

```css
.quantity__button {
  position: relative;
  width: 44px;
  height: 44px;
}
```

- When two targets are close, verify a 24px spacing gap or acceptable individual sizes.
- Keyboard users get the full element size, so undersized targets hurt touch users specifically.

## 12. prefers-reduced-motion

Global CSS kill-switch in `assets/base.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

JavaScript guard for anything that auto-advances (carousels, marquees, countdowns):

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Do not start autoplay, do not schedule slide transitions.
  carousel.stopAutoplay();
}
```

- Honor in both CSS and JS; CSS alone misses JS-driven carousels.
- Smooth scrolling via CSS `scroll-behavior: smooth` must be disabled under reduced motion (covered by the kill-switch).
- Ensure no content flashes more than three times per second anywhere (WCAG 2.3.1); moving carousels under reduced motion should become static with manual controls.

## 13. Carousel keyboard controls

- All controls are real buttons: previous, next, dots, and any "pause" control. Every control has an accessible name (`aria-label="Previous slide"`, `aria-label="Go to slide 2 of 5"`).
- Slides are `role="group"` with `aria-roledescription="slide"` and `aria-label="1 of 5"` when the carousel exposes its structure to assistive tech. For purely decorative image sliders where all content is static in the DOM, the simpler pattern is controls plus the live region below.
- Announcement of the active slide and any auto-advance: use a visually hidden live region:

```html
<p class="visually-hidden" aria-live="polite" data-carousel-status>
  Slide 2 of 5
</p>
```

```js
function announceCarousel(region, message) {
  region.textContent = '';
  // Re-insert forces announcement even when the text is unchanged.
  requestAnimationFrame(() => { region.textContent = message; });
}
```

- Keyboard order: controls reachable, no invisible slides capturing focus, no autoplay that yanks focus.
- Pause on hover and on focus; never auto-advance under `prefers-reduced-motion`.
- If slides contain links (e.g. hero CTA), the links must be reachable and the carousel must not trap focus.
- Swipe-only navigation is forbidden: keyboard controls must exist.

## 14. Variant picker: announced state changes

- Group options in a `<fieldset>` with a `<legend>` ("Size", "Color") or `role="radiogroup"` with `aria-label`. Native radio inputs for a select, or buttons with `role="radio"`/`aria-checked` for swatches.
- Selected state is never conveyed by color alone: the radio/`aria-checked` carries it, and the picker announces the selection.
- Announce selection, price, and availability updates in one polite live region so screen readers get a single, sensible message:

```liquid
<p class="visually-hidden" aria-live="polite" data-variant-status></p>
```

```js
const statusRegion = document.querySelector('[data-variant-status]');
statusRegion.textContent =
  'Selected: ' + selectedValues.join(', ') +
  (variant ? '. Price: ' + formatMoney(variant.price) + '.' : '');
if (variant && !variant.available) {
  statusRegion.textContent += ' This combination is sold out.';
}
```

- Sold-out/unavailable variants: convey with text ("Sold out", "Unavailable"), not only strikethrough or reduced opacity. A disabled button with no explanation fails 4.1.2 (name, role, value: the state is not announced).
- If unavailable options are disabled buttons, add a visible legend note ("Greyed out options are sold out") and `aria-disabled="true"` so the state is announced.
- Price updates from variant selection must be announced (live region above), because sighted users see the change and screen-reader users otherwise hear nothing.
- Add to cart button label reflects the selection ("Add to cart — Black / M").

## 15. Visually hidden utility

```css
.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

Use for: hidden-but-present section headings, live regions, sr-only labels on icon buttons, "Compare at" price text next to a strikethrough. Never use `display: none` for content that must be announced — `display: none` removes it from the accessibility tree.

## 16. Live regions for dynamic updates

- Cart count changes: a visually hidden `aria-live="polite"` region next to the cart icon ("3 items in cart") — announcing on every count change is noisy; announce on add-to-cart actions instead.
- "Added to cart" toast: `role="status"` (implicitly polite) with the item name.
- Form errors: `role="alert"` (assertive).
- Product media change in the gallery: polite region with the new media description.
- Do not use `aria-live` on elements that update constantly (sliders, timers) — that is a 4.1.3 status-message over-announcement failure.

## 17. Source verification

- Theme Store requirements (current threshold, template list): https://shopify.dev/docs/storefronts/themes/store-requirements
- Lighthouse a11y scoring and audit list: https://developer.chrome.com/docs/lighthouse/accessibility/scoring
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- ARIA spec: https://www.w3.org/TR/wai-aria-1.2/
- WebAIM contrast checker: https://webaim.org/resources/contrastchecker/

Re-verify the Theme Store values at audit time; do not copy them into permanent theme code or comments.
