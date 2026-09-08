# Performance Audit Checklist

> VERIFY CURRENT: thresholds and budgets below reflect Shopify guidance at the time of writing. Fetch the current values from `https://shopify.dev/docs/storefronts/themes/store/requirements` and `https://shopify.dev/docs/storefronts/themes/best-practices/performance` before treating any number as a gate. Theme Store evaluation is a plain average of home + product + collection Lighthouse performance scores, desktop and mobile evaluated separately.

Work area by area. For each check, record: file(s), line(s), severity, fix applied or reason declined.

---

## 1. JavaScript bundle

Checks:
- [ ] List every script that loads on the home page initial paint (`layout/theme.liquid`, section assets, app embeds). Compute the total gzipped bytes of the critical path.
- [ ] Identify per-asset size. Theme Check's default `AssetSizeJavaScript` check flags assets over its threshold — run `theme-check` and read which files it names.
- [ ] Find scripts loaded on every page that only power one section (sliders, tabs, quick add).
- [ ] Find third-party scripts (analytics, chat widgets, review badges) and where they load.

Fixes:
- Keep initial JavaScript under the budget YAML ceiling (`javascript.initial_budget_kb`) in the product spec — verify the current documented figure at the URLs above.
- Split per-section JS into its own asset and load it only when the section renders: gate with `{% if ... %}` in the section, or output `{{ 'section-foo.js' | asset_url | script_tag }}` from inside the section file itself.
- Add `defer` to every non-critical `<script src>`; use `async` only for scripts with no dependencies on DOM readiness and no shared state.
- Load interaction-only features on demand: attach a listener, then inject the script via `import()`/dynamic script element on first user gesture instead of loading at page start.
- Remove jQuery unless a script genuinely depends on it; replace with native DOM APIs.
- Minify every shipped asset (no unminified `.js` in `assets/`).

Verify: reload with DevTools Network throttled; confirm no script blocks first paint; re-run Lighthouse and compare the "Reduce JavaScript execution time" and "Total blocking time" audits.

## 2. CSS

Checks:
- [ ] Total CSS bytes loaded on home page (theme stylesheet + section sheets + inline styles + font CSS).
- [ ] Number of `<style>` blocks in `sections/*.liquid` and their byte size.
- [ ] `@import` statements in any stylesheet (render-blocking cascade).
- [ ] Unused rules: classes referenced in CSS but never in Liquid markup.

Fixes:
- One theme stylesheet plus small per-section sheets is the Dawn-compatible pattern; prefer it over many inline `<style>` blocks.
- Inline `<style>` in a section is acceptable only when tiny and section-scoped; anything approaching or exceeding ~2 KB should move to an asset file. Inline styles defeat caching and add HTML weight to every page.
- Remove `@import`; concatenate into the theme stylesheet or load via `<link>`.
- Purge rules for features the theme does not use (e.g., Dawn color-scheme variants the theme never enables, unused utility classes). Cross-check selectors against `templates/`, `sections/`, `snippets/` with a grep, then delete.
- Consider `media` attributes or `content-visibility: auto` only where you can prove no layout regression (measure CLS before and after).

Verify: `theme-check` clean; per-page CSS weight recorded; no `@import` found by grep; re-run Lighthouse "Eliminate render-blocking resources".

## 3. Render blocking

Checks:
- [ ] Which CSS files block first paint (render-blocking) and whether each is needed for above-fold content.
- [ ] Which scripts block parsing (`<script>` without `defer`/`async` in `layout/theme.liquid`).
- [ ] Fonts/font CSS loaded in the critical path.

Fixes:
- Keep one render-blocking stylesheet for above-fold styling; defer non-critical CSS with `media="print" onload="this.media='all'"` plus a `<noscript>` fallback if it is large and below-fold only.
- All scripts `defer` or `async` (never parse-blocking unless the script must run before DOMContentLoaded and has no alternative).
- Preload the LCP image and any font used by first paint with `<link rel="preload" as="image|font">`; never preload more than 2-3 resources (preload of everything is a slowdown).
- Remove duplicate loads: the same asset fetched twice on one page.

Verify: Lighthouse "Eliminate render-blocking resources" and "Preload key requests" pass or are explained.

## 4. Lazy loading

Checks:
- [ ] Every `<img>` and `<iframe>` below the fold has `loading="lazy"`.
- [ ] The LCP image (hero, first product image) is NOT lazy — it must be `loading="eager"` (or no attribute) and ideally `fetchpriority="high"`.
- [ ] Lazy images have a placeholder strategy (width/height reserved, blurred placeholder, or dominant-color background) so lazy loading does not cause layout shift.

Fixes:
- `{{ image | image_tag: loading: 'lazy' }}` for below-fold images in grids and galleries.
- Explicit `fetchpriority: 'high'` ONLY on the LCP image; never on several.
- Set `widths:` and `sizes:` on every responsive image so the browser picks the right candidate.
- For background-image based sections (e.g., hero with CSS background), keep the intrinsic size reserved in CSS (`aspect-ratio` + `width: 100%`).

Verify: DevTools Network shows below-fold images fetched after scroll; Lighthouse "Defer offscreen images" and CLS unchanged.

## 5. Responsive images

Checks:
- [ ] Every product/collection/hero image renders via `image_tag` or `image_url` with `widths:` (e.g., `'360, 540, 720, 900, 1080, 1296, 1512'`) and `sizes:` reflecting actual layout width.
- [ ] Images carry explicit `width` and `height` attributes (or CSS aspect-ratio) so the browser reserves space.
- [ ] No giant source images shipped to small viewports (check DevTools: a 1000px+ image displayed at 300px without srcset).
- [ ] No upscaling: rendered size never exceeds source width.

Fixes:
- Prefer `image_tag` over raw `<img src="{{ image | image_url }}">` — `image_tag` emits `srcset`/`sizes` when given `widths:`.
- Provide `sizes` matching real breakpoints, e.g. `sizes="(min-width: 990px) 50vw, 100vw"`.
- Always pass width/height; derive from `image.width`/`image.height` when known.
- Use `image_url` only where you need a specific pixel size; add `&width=` params deliberately.
- SVG icons: inline or `asset_url`, never rasterized at high resolution.

Verify: Lighthouse "Properly size images" / "Serve images in next-gen formats" pass; spot-check 2-3 images in DevTools for correct selected candidate.

## 6. Font loading

Checks:
- [ ] Every `@font-face` has `font-display: swap` (no FOIT — invisible text while fonts load).
- [ ] Fonts loaded: self-hosted via `asset_url` or Shopify-hosted; no unsubstituted `fonts.googleapis.com` links in `theme.liquid`.
- [ ] Number of font files and weights: each weight = one file; 4+ weights on 2+ families is a smell.
- [ ] Preloads: only the fonts actually used above the fold are preloaded.
- [ ] Subsetting: a full-family font file used for one script subset.

Fixes:
- `font-display: swap` everywhere; confirm via grep on `assets/*.css`.
- Reduce weights/families; prefer variable fonts (one file, multiple axes) where supported.
- Preload at most the heading font and body font files used in first paint, with `as="font" type="font/woff2" crossorigin`.
- Remove Google Fonts `<link>` in favor of self-hosting the subsetted `@font-face` in the theme stylesheet.
- Never render text with a font that is not `woff2` if avoidable (woff2 only on modern stores is fine).

Verify: Network shows fonts fetched with `font-display: swap` behavior (no long blank text); Lighthouse "Avoid chaining critical requests" and "Preload key requests" clean.

## 7. DOM size

Checks:
- [ ] Document node count (DevTools: document.querySelectorAll('*').length) on home/product/collection. Above ~1500 nodes is heavy; above ~3000 is a problem.
- [ ] Depth: `document.querySelectorAll('*')` deepest nesting; >32 deep hurts.
- [ ] Liquid loops rendering redundant wrappers: cards, grids, and menus emitting empty `<div>` chains per item.
- [ ] Duplicate markup per breakpoint (two navs rendered, one hidden by CSS).

Fixes:
- Trim wrapper divs in cards/grid snippets; one semantic element per level.
- Render responsive navigation once; switch layout in CSS.
- Cap long lists (e.g., `limit:` on collection loops when the design shows 12 items).
- Remove unused Dawn blocks/sections from templates rather than hiding them.

Verify: node count recorded before/after; Lighthouse "Avoid an excessive DOM size" passes.

## 8. Layout shift (CLS)

Checks:
- [ ] Every `<img>`, `<video>`, `<iframe>`, and carousel slide reserves its space (width/height attributes or `aspect-ratio`).
- [ ] Ad/announcement bars, cookie banners, and app-embed widgets that inject content do not push layout after first paint without reserved space.
- [ ] Dynamic content (countdowns, recently-viewed, AJAX cart drawers) does not reflow above-fold content.
- [ ] Font swaps do not shift layout (font metrics are close or space reserved).

Fixes:
- Add width/height attributes everywhere (the static audit flags missing ones).
- Reserve fixed heights for injected widgets (e.g., announcement bar slot) or render them server-side when possible.
- Use `aspect-ratio` CSS for responsive media.
- Prefer `transform`-based animations (never animate `top`/`margin`/`width`).

Verify: Lighthouse CLS per page type recorded before and after fixes; target near 0.

## 9. Event listeners and section JS lifecycle

Checks:
- [ ] Listeners bound inside render loops (each card binding its own click → N listeners).
- [ ] Section JS does not re-bind on `Shopify:section:load` without unbinding on `Shopify:section:unload`.
- [ ] `document`/`window` listeners added by sections that are never removed on section unload.
- [ ] Intervals/timeouts (slider autoplay, countdowns) cleared on unload.

Fixes:
- One delegated listener per concern (e.g., a single click handler on the document or container reading `data-*`).
- Wrap section logic in init/teardown functions registered against the Shopify section-rendering events:
  - `Shopify:section:load` (init)
  - `Shopify:section:unload` (teardown, remove listeners, clear timers)
  - `Shopify:block:select`/`Shopify:block:deselect` for editor preview state
- Use event delegation in the theme's global script rather than per-section binding.
- Clear `setInterval`/`setTimeout` in teardown; guard against double-init with a flag or `WeakMap`.

Verify: with several sections on a page, `getEventListeners(document)` in DevTools shows no listener multiplication after adding/removing a section in the editor.

## 10. Third-party scripts

Checks:
- [ ] Inventory every third-party script (analytics, chat, reviews, personalization) and where it loads.
- [ ] Which ones load on every page vs. only pages that need them.
- [ ] Which block parsing or add significant execution time.

Fixes:
- Load non-essential third parties only on pages that use them (e.g., reviews widget on product pages only).
- Defer or inject after user interaction / consent where acceptable.
- Prefer `async` for independent tracking pixels.
- Consolidate: two analytics SDKs where one suffices is a real cost.
- Check Shopify app embeds (`{% schema %}` app blocks) — an app embed that injects heavy JS on every page is a finding; move it to conditional settings or report it as a remaining risk.

Verify: Network on a clean reload shows third-party bytes minimized; Lighthouse "Third-party usage" reduced.

## 11. Section-level JS patterns

Checks:
- [ ] Section JS assets are named to match sections and loaded only when the section is present.
- [ ] Global `theme.liquid` script list stays minimal (only cross-cutting code).
- [ ] No section script executes work for sections that are absent.

Fixes:
- Load per-section JS from inside the section file: `{{ 'section-<name>.js' | asset_url | script_tag: defer: true }}` guarded by the settings that enable the feature (`{% if section.settings.enable_slider %}`).
- Keep the main theme JS to shared utilities (delegated navigation, cart drawer, section lifecycle registry).
- Initialize lazily: only run feature init when the corresponding DOM node exists (`document.querySelector('[data-section-id="..."]')`).
- Never output inline `<script>` in a section when an asset file works; inline scripts are not cacheable and bloat every page that renders the section.

Verify: grep confirms no `script_tag` in `layout/theme.liquid` referencing a section-specific asset; feature init is guarded.

## 12. Unused code

Checks:
- [ ] Assets in `assets/` never referenced from any `.liquid` file (orphans).
- [ ] Snippets not included by any template/section.
- [ ] Sections listed in `config/settings_schema.json` presets but never used in `templates/*.json`.
- [ ] CSS rules for removed Dawn features (e.g., icon-packs, unused animation classes).
- [ ] Duplicate assets (same file twice with different names).

Fixes:
- Grep each asset filename across `layout/`, `sections/`, `snippets/`, `templates/`, `config/`; delete unreferenced files.
- Delete unused snippets and orphan sections (keep `templates/*.json` valid after removal).
- Remove dead CSS rules; re-check selectors against rendered pages before deleting.
- Remove test/demo content (lorem sections, placeholder presets) from `settings_data.json` and templates.

Verify: no filename in `assets/` is unmatched; theme still renders home/product/collection without missing-asset errors in console.

---

## Record keeping

For every run, record in the report: tool, device emulation, network throttle, cache state, number of runs, and the plain average per device. Never mix conditions between baseline and final measurement.
