# Accessibility audit procedure (manual + tooling)

How the theme-accessibility-engineer audits a theme. Follow this order: verify requirements, tooling pass, keyboard walkthrough, screen-reader spot checks, code review, fixes, re-test, report. All findings go to `docs/accessibility-report.md`.

## 1. Verify current requirements (always first)

Shopify requirements change; never rely on memory. Fetch the current Theme Store requirements page and find the accessibility section:

1. Open https://shopify.dev/docs/storefronts/themes/store-requirements
2. Locate the accessibility requirement: historically an average Lighthouse accessibility score of at least 90 across required templates. Record the current value, the exact required template list, and the test conditions (storefront password handling, which pages are tested).
3. Record the URL, the value, and today's date in the report (Section 1). If the page changed or the value differs from the historical figure, the fetched value wins.
4. Secondary sources for context: https://developer.chrome.com/docs/lighthouse/accessibility/scoring and https://www.w3.org/TR/WCAG22/

## 2. Tooling pass

### Lighthouse (automated batch)

`scripts/run-lighthouse-a11y.mjs` runs the Lighthouse accessibility category against a list of routes and prints a structured summary. It needs a reachable storefront URL (preview store with password, or a dev server) and Chrome; Lighthouse installs itself via `npx`.

```bash
node scripts/run-lighthouse-a11y.mjs https://store.example.myshopify.com --routes / /collections/all /cart /search --min-score 90
```

Read the script header for the full CLI. Output: per-route JSON results in `docs/lighthouse-a11y/`, a markdown table, and a JSON summary on stdout. Exit code is non-zero when any route scores below `--min-score` — use that as the pass/fail signal for the threshold.

Notes:

- Add the storefront password to the URL if the preview store is password-protected (`?preview_theme_id=...&password=...` or the `/password` flow) — Lighthouse must load real rendered pages.
- Lighthouse scores are a floor, not the whole audit: a 100 can still hide focus-trap and screen-reader problems. The keyboard walkthrough below is mandatory regardless of score.
- Test every required template from the verified list (Section 1), not just the defaults.

### axe-core (where available)

When `@axe-core/cli` or the axe browser extension is available, run it per template to get rule-level detail (`color-contrast`, `heading-order`, `aria-hidden-focus`, `label`, `image-alt`, `region`):

```bash
npx @axe-core/cli https://store.example.myshopify.com/ --exit
```

Or use the axe DevTools extension in a Chrome session. Record failing rule IDs with element selectors in the report; axe failures map directly to WCAG criteria.

### Browser accessibility tree (any Chromium)

DevTools > Elements > Accessibility pane, or the Rendering panel's accessibility tree: verify each interactive element has a sensible name, role, and state.

## 3. Keyboard walkthrough (manual, per template)

For each required template, from a fresh page load:

1. Press Tab from the address bar. The first focus stop must be the skip link; activate it and confirm focus lands in `#MainContent` with a visible ring.
2. Tab through the entire page. Confirm: order follows visual order, no invisible stops, every stop has a visible focus indicator, no page content is skipped.
3. Open each disclosure: main menu dropdowns (Enter/Space to open, Escape to close, focus returns to the toggle), search drawer, mobile menu, cart drawer.
4. Cart drawer, verbatim contract: open -> focus moves into drawer; Tab -> stays logically within drawer; Escape -> closes; close -> focus returns to trigger. Test the same for every modal/lightbox.
5. In the cart drawer: Tab must wrap (no exit into the page), Shift+Tab must wrap backward, the close button must work, Checkout must be reachable.
6. Operate the variant picker by keyboard: arrow keys / Tab between options, selection changes, Add to cart reachable.
7. Operate carousels: prev/next and dots reachable; focus is not trapped; autoplay does not steal focus.
8. Submit each form with an error: confirm focus moves to the first invalid field and the error is announced.
9. Zoom to 200% and repeat the primary flows (add to cart, navigate, search) — no loss of function.
10. Emulate `prefers-reduced-motion: reduce` (DevTools Rendering panel) and confirm no autoplay or scroll animation.

Record per template: pass/fail per step, and any failure with repro steps.

## 4. Screen-reader spot checks (manual)

VoiceOver (macOS) with Safari is the baseline; add NVDA (Windows, Firefox) when the environment allows. Do these flows per template:

- VO + Command + H: heading rotor — confirm one h1, no skipped levels.
- VO + U: landmarks — one banner, main, contentinfo; labeled navs.
- Land on every button/link/input: confirm the announced name matches the visible text.
- Cart drawer: open, hear the dialog name, confirm focus inside, Escape, confirm focus returns to the trigger.
- Variant picker: change a variant, hear selection + price + availability announced politely.
- Carousel: hear slide position or the live-region announcement.
- Form: submit with an error, hear the error text and field identification.
- Icons: icon-only buttons announce their action ("Search", "Cart, 3 items"), never "button".

Record anything the screen reader fails to name, mis-names, or fails to announce.

## 5. Code review

Walk `layout/`, `sections/`, `snippets/`, `assets/` against `checklists/accessibility-checklist.md` and `references/accessibility-patterns.md`. Target: focus management for drawers/modals, `aria-expanded`/`aria-controls` on toggles, labels on all inputs, `alt` on all images, heading levels, live regions for state changes, `prefers-reduced-motion` in CSS and JS, contrast tokens against real backgrounds, touch target sizes.

## 6. Fix, re-test, report

- Fix highest severity first in theme source; never suppress a failing check.
- Re-test each fix with the exact check that failed (same Lighthouse template, same keyboard sequence, same screen-reader flow). A fix is done only when the failing check passes on the real surface.
- Write `docs/accessibility-report.md` from `templates/accessibility-report.md`, with before/after evidence.
- Hand the report to theme-qa-reviewer for the final submission-readiness verdict. Never self-certify.

## Script: run-lighthouse-a11y.mjs

```bash
node scripts/run-lighthouse-a11y.mjs <base-url> [options]
```

- `<base-url>` — reachable storefront origin (required).
- `--routes "r1 r2"` — space-separated routes; defaults to `/` `/collections/all` `/cart` `/search`.
- `--min-score <n>` — failing threshold; defaults to 90 (historical Theme Store minimum; pass the verified current value).
- `--out-dir <dir>` — where per-route Lighthouse JSON lands; defaults to `docs/lighthouse-a11y`.
- `--help` — full usage.

Prerequisites: Node.js 18+, Google Chrome installed. Lighthouse is invoked via `npx --yes lighthouse` and installs on first run. Output is a markdown table plus a JSON summary; exit code 0 only when every route meets `--min-score`.
