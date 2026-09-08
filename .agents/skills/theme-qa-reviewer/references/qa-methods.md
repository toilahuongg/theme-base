# QA METHODS — theme-qa-reviewer

How to run each QA area, capture evidence, and record it in docs/readiness-report.md.
All commands assume the theme root is your working directory or is passed explicitly.

> VERIFY-CURRENT WARNING: Shopify changes Theme Store requirements, theme check rule sets, and performance budgets over time. The numbers and URLs in this file describe the state at the time of writing. Before each run, fetch the current requirements from shopify.dev (links below) and record what you actually used in the report.
>
> Primary sources to re-check each run:
> - Theme Check: https://shopify.dev/docs/storefronts/themes/tools/theme-check
> - Theme Store requirements: https://shopify.dev/docs/storefronts/themes/architecture/theme-store-requirements
> - Theme Store performance testing / budgets: https://shopify.dev/docs/storefronts/themes/performance/theme-store-performance-testing
> - Accessibility: https://shopify.dev/docs/storefronts/themes/accessibility/accessibility

## 1. Shopify Theme Check

Purpose: static linting of Liquid, JSON, schema, and translation files.

1. Confirm the CLI: `shopify version` (or `npx shopify version`). If missing, install per https://shopify.dev/docs/storefronts/themes/tools/theme-check (the Shopify CLI bundles theme check).
2. Run the full check:
   ```
   shopify theme check
   ```
3. Run with machine-readable output for the report:
   ```
   shopify theme check --output json > /tmp/theme-check.json
   ```
   The JSON contains a `themeCheck` object with `checks` (findings grouped by file type: Liquid, JSON, Translation, ...) and `summary` (counts: total, errors, warnings, info, suggestions). Each finding has `code`, `level` (0=error, 1=warning, 2=info, 3=suggestion), `path`, `start`/`end` line, and `message`.
4. Triage every finding by severity:
   - level 0 (error): a BLOCKER unless the finding is provably a false positive on a documented Shopify workaround; even then, record the justification.
   - level 1 (warning): investigate; fix before submission unless you can justify keeping it, then record it as a warning.
   - level 2/3 (info/suggestion): review for patterns that indicate real problems (e.g. `AssetSizeCSS` info on a huge stylesheet points at a performance risk).
5. Check .theme-check.yml: note which checks are disabled and why. A theme that disables whole categories (e.g. Translation, JSON) to hide errors is itself a finding.
6. Evidence: record the command, the summary counts, the list of errors, and the triage decision per finding. Automated helper: `scripts/run-theme-check.mjs` prints a compact summary table from a fresh run or a saved JSON file.

## 2. Lighthouse

Purpose: performance, accessibility, best practices, and SEO signals on real pages.

1. Get a preview: run the theme locally (`shopify theme dev`) or on a Shopify preview URL, and load it in the browser you will audit. Lighthouse must run against the rendered storefront, not the theme files.
2. Install the runner once:
   ```
   npm install -g lighthouse        # or: npx lighthouse
   ```
3. Audit the default home page plus one product and one collection page:
   ```
   lighthouse <url> --preset=desktop --output=json --output-path=/tmp/lh-home.json --chrome-flags="--headless --no-sandbox"
   ```
   Repeat for mobile preset (`--preset=mobile`) on at least the home page.
4. Read the report: performance/accessibility/best-practices/SEO scores and the core metrics (LCP, TBT, CLS, total page weight). Fetch the CURRENT Theme Store budget from the performance page above; compare recorded numbers against it, and note the URL and date of the budget you used.
5. Common failure classes to chase down: large images without srcset, third-party scripts in the critical path, render-blocking CSS/JS, CLS from images without width/height, below-the-fold JS that should be deferred.
6. Evidence: audit URLs, presets, scores, metrics, and the budget comparison.

## 3. Browser QA

Purpose: the storefront must work as a shopper uses it, on every page type.

Drive a real browser (headless Chromium via the harness browser tools, or a local browser). For each page type below, click through the full happy path plus one failure path (missing product, sold-out variant, empty search).

- Home: hero, carousels/sliders, featured collections and products, newsletter form, announcement bar, footer links, app embeds. Every interactive element responds; no console errors.
- Collection: sort, filter, pagination, product cards (quick add if present), badge rendering, breadcrumbs.
- Product (PDP): gallery (thumbnails, zoom, lightbox), variant picker and price updates, quantity stepper, add to cart, dynamic checkout button, accordions (description, shipping), sticky elements not overlapping content.
- Cart: line item edit (qty, remove), free-shipping progress, upsells, note field, checkout button reachable and live.
- Search: predictive results, no-results state, keyboard from the search trigger to result click.
- Other templates: 404 page, password page, blog/article, page template, and any custom templates in the theme.
- Global: every drawer/modal opens and closes, no horizontal scroll on any page, console clean (filter out benign third-party noise), network errors logged as findings.

Evidence: page URL, flow walked, pass/fail per step, console/network excerpts, screenshots of failures.

## 4. Responsive QA

Purpose: no broken layout at any supported width.

1. Find the theme's breakpoints from assets (base.css / *.css: `@media` queries) and record them.
2. Test every page type at: 320, 375, 414 (phones), 768/834 (tablet), 1024 (small laptop), 1280, 1440 (desktop), plus any theme-specific breakpoint.
3. Check per width: no horizontal overflow (document.scrollingElement.scrollWidth <= clientWidth), tap targets >= 44x44 CSS px, images crop correctly (portrait vs landscape, object-fit), text not clipped or overlapping, mobile menu opens and closes, tables/price rows wrap, sticky headers do not cover content.
4. Evidence: widths tested, overflow check result per page, screenshots of any broken width.

## 5. Keyboard QA

Purpose: the whole storefront is operable without a mouse, WCAG 2.1 AA bar (verify current requirement).

1. Skip link: first Tab on every template reveals a working "Skip to content" that moves focus past nav.
2. Tab order: nav, search, product cards, variant picker, add to cart, checkout; order is logical and never jumps off-screen or into hidden elements.
3. Focus visibility: every focused element shows a clear visible outline; focus is never removed silently (outline:none without replacement is a finding).
4. Modals/drawers: open with keyboard (button is reachable), focus moves into the dialog, Tab/Shift+Tab are trapped inside, Escape closes, focus returns to the trigger.
5. Interactive widgets: carousel arrows, sliders, accordions, quick-add, qty steppers all operable by keyboard; custom controls expose correct roles/aria (verify with the browser's accessibility tree).
6. Evidence: templates walked, key sequences used, any trap/escape failure with the exact element and tab order position.

## 6. JS-off Testing

Purpose: core content and navigation survive without JavaScript.

1. Disable JavaScript (Chrome DevTools > Settings > Debugger > "Disable JavaScript", or launch headless with `--disable-javascript`).
2. Reload: home, one collection, one product, cart, search results, 404, password page.
3. Verify per page: main content text and images render; primary navigation links are anchors, not JS-only handlers; product page shows title, price, media, and at least a fallback path for adding to cart (Shopify forms may still post); no blank sections, no infinite spinners, no dead "load more" without fallback.
4. Note honestly which features are JS-only by design (predictive search, cart drawer) and whether the theme provides non-JS equivalents (native form posts).
5. Evidence: pages tested with JS off, what rendered, what degraded, and whether the degradation is acceptable or a blocker (a blank homepage is a blocker; a less fancy search overlay is a warning).

## 7. Editor QA

Purpose: merchants can configure the theme in the theme editor without breakage.

1. Open the theme editor (Online Store > Themes > Customize) on a preview.
2. Save test: change a setting on every section (headings, colors, image pickers, toggles), save, reload the storefront, confirm the change renders.
3. Preset test: create a preset (Save as new preset), name it, apply it, confirm it renders; rename/duplicate presets; delete the test preset afterwards.
4. Section add/remove: add each section type to a template, reorder, remove; the page must not error.
5. Content edge cases in the editor: empty text fields, very long text fields (paste the long-title fixture), empty image pickers, no featured collection selected.
6. Evidence: settings changed, preset lifecycle result, any editor error (red toast, broken preview, settings not applying).

## 8. Edge-case QA — destructive fixtures

Purpose: the theme must survive merchant-generated extremes. Create fixtures in the dev store or via seed scripts; never ship the fixtures.

Fixture creation per item in the dataset:
- very long titles: product/collection titles of 200-500 characters.
- very long vendor: vendor string of 100+ characters.
- 0 images / 1 image / 20 images: products with no media, one image, twenty images (gallery stress).
- portrait images / landscape images: extreme aspect ratios (e.g. 400x1600 and 1600x400) plus square; verify object-fit and no CLS jump on load.
- single variant: product with one option/value; no pointless variant picker rendered.
- 100 variants: product with a large option matrix; variant switching stays responsive, no layout jump.
- sold out: product with all variants unavailable; badges, disabled add-to-cart, correct price states.
- mixed availability: product with some in-stock and some sold-out variants; picker reflects per-variant availability.
- long translations: add very long strings (500+ chars) to the active locales for key storefront labels; verify no clipping in buttons, badges, notices.
- empty collections: collection with zero products; empty state renders, no broken grid or console errors.
- large menus: 20+ top-level links plus nested submenus; navigation usable on desktop and mobile, drawer scrolls, no overflow.
- large carts: 20+ line items; cart page and drawer render, qty updates work, totals correct.
- sale pricing: products with compare_at_price; sale badge, strikethrough, and price update on variant change are correct; no inconsistent "on sale" states.

For each item record: fixture created, pages checked, observed behavior, pass/fail. A crash, unreadable layout, or wrong commerce state (e.g. sale price not updating per variant) is a BLOCKER.

## 9. Localization QA

Purpose: the theme's translations are complete and render correctly in every supported language.

1. Inventory locales/: en.default.json, en.default.schema.json, plus any additional locale files the theme ships.
2. Run theme check Translation rules (already covered) for missing/extra keys.
3. Switch the storefront language (URL /?locale=xx or the language selector) and verify: storefront chrome (cart, search, menu, buttons) translates; page content that should translate does; schema keys in the editor are present for every locale file.
4. Long translation check: for each locale, confirm buttons, badges, and notices do not clip (use the long-translation fixture from edge-case QA).
5. RTL: if any shipped locale is RTL, verify layout direction flips (dir="rtl"), and that the theme CSS handles it; otherwise note RTL as out of scope.
6. Evidence: locale files audited, languages tested, missing keys, clipping screenshots.
