# Performance Report — Example (Aurora Paper theme, v1.2.0)

> This file is a worked example. All numbers are illustrative but realistic for a Dawn-derived theme with no performance work done. Replace every value with measured data when using the template.

## 1. Summary

- Theme name: Aurora Paper — version 1.2.0
- Budget YAML in force (product spec; verified 2026-08-14):

```yaml
javascript:
  initial_budget_kb: 150
lighthouse:
  theme_store_minimum: 60
  internal_target: 75
```

- Verdict: PASS_WITH_MARGIN — margin to threshold: +17 points mobile, +29 points desktop.

## 2. Requirements verified

| Requirement | Value used | Source URL | Verified date |
| --- | --- | --- | --- |
| Lighthouse minimum (mobile) | 60 | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-08-14 |
| Lighthouse minimum (desktop) | 60 | https://shopify.dev/docs/storefronts/themes/store/requirements | 2026-08-14 |
| Page set evaluated | home, product, collection | same | 2026-08-14 |
| Evaluation formula | plain average of the three pages per device | same | 2026-08-14 |
| Initial JS guidance | 150 KB (budget YAML; current docs recommend per-asset limits — see theme-check) | https://shopify.dev/docs/storefronts/themes/best-practices/performance | 2026-08-14 |

Delta note: budget YAML matches verified values at run time; no supersession required.

## 3. Baseline

Run conditions: Lighthouse CLI v12, mobile emulation (Moto G Power, 412x823, DPR 1.75) and desktop (1350x940); network throttle Fast 4G (150ms RTT, 1.6Mbps down); warm cache; median of 3 runs per page per device; benchmark catalog on the dev store.

| Page | Mobile | Desktop | Notes |
| --- | --- | --- | --- |
| Home | 52 | 68 | LCP image unoptimized (2.1 MB, no srcset), 2 parse-blocking scripts |
| Product | 55 | 70 | Google Fonts render-blocking link, gallery images eager |
| Collection | 50 | 66 | 24-card grid, every image eager + full-size, DOM 2,400 nodes |
| **Average** | **52.3** | **68.0** | threshold 60 |

Supporting measurements: initial JS 412 KB gz, CSS 186 KB (includes 44 KB unused Dawn rules), DOM nodes 2,400, CLS 0.18 (home), LCP 6.4 s (mobile home).

## 4. Findings

| # | Severity | Area | File:line | Finding | Fix applied / declined |
| --- | --- | --- | --- | --- | --- |
| 1 | Critical | Render blocking | layout/theme.liquid:42-45 | Two `<script src>` without defer block parsing (~1.1 s) | Applied: defer on both |
| 2 | Critical | Images | snippets/card-product.liquid:18 | Raw `<img src="{{ image | image_url: width: 2000 }}">`, no srcset/sizes, no width/height | Applied: image_tag with widths/sizes + attributes |
| 3 | Critical | Images | sections/main-banner.liquid:9 | Hero image fetched at 2000px, no preload, no fetchpriority | Applied: preload LCP, fetchpriority high, widths pipeline |
| 4 | High | Fonts | layout/theme.liquid:29 | Google Fonts `<link>` render-blocking, font-display absent | Applied: self-hosted woff2, font-display: swap, preload 2 files |
| 5 | High | Lazy loading | sections/main-collection.liquid:14 | Grid images eager, 24 per page | Applied: loading: lazy for all but first row |
| 6 | High | JS bundle | assets/theme.js | 214 KB unminified, includes slider + quick-add used on 1 section | Applied: split section assets, load on section presence, minified |
| 7 | Medium | CSS | assets/base.css | 44 KB unused Dawn rules (color schemes, icon pack) | Applied: purged to 96 KB |
| 8 | Medium | CLS | sections/announcement.liquid | Cookie/app banner injected after first paint, shifts hero | Applied: reserved height slot |
| 9 | Medium | Section JS | assets/theme.js:300 | Slider binds per-instance listeners, leaks on section unload | Applied: delegation + Shopify:section:load/unload teardown |
| 10 | Low | DOM | snippets/card-product.liquid | 4 nested wrapper divs per card (96 extra nodes) | Applied: trimmed to 2 semantic levels |

## 5. Fixes applied

| Fix | Files touched | Pattern used |
| --- | --- | --- |
| Defer all non-critical scripts | layout/theme.liquid | `script_tag: defer: true` |
| Responsive image pipeline | snippets/card-product.liquid, sections/main-banner.liquid | `image_tag` with `widths: '360, 540, 720, 900, 1080, 1296, 1512'`, matching `sizes:`, width/height attributes |
| LCP optimization | sections/main-banner.liquid, layout/theme.liquid | `<link rel="preload" as="image">` + `fetchpriority: 'high'` |
| Font strategy | assets/base.css, layout/theme.liquid | self-hosted subset woff2, `font-display: swap`, preload heading+body files |
| Lazy below-fold media | sections/main-collection.liquid, sections/main-product.liquid | `loading: 'lazy'` |
| Section JS on demand | sections/main-collection.liquid, assets/section-slider.js | `{% if section.settings.enable_slider %}` guard + deferred asset |
| Listener lifecycle | assets/theme.js | event delegation, init/teardown on Shopify:section:load/unload |
| Removed unused code | assets/base.css, assets/icon-pack.css, snippets/ | deleted icon pack + 3 orphan snippets, purged dead rules |

## 6. Final numbers

Same conditions as baseline. Delta = final - baseline (positive = improvement).

| Page | Mobile before | Mobile after | Delta | Desktop before | Desktop after | Delta |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 52 | 78 | +26 | 68 | 90 | +22 |
| Product | 55 | 77 | +22 | 70 | 89 | +19 |
| Collection | 50 | 76 | +26 | 66 | 88 | +22 |
| **Average** | **52.3** | **77.0** | **+24.7** | **68.0** | **89.0** | **+21.0** |

Secondary metrics: initial JS 412 -> 88 KB gz (budget 150), CSS 186 -> 96 KB, DOM nodes 2,400 -> 1,180, CLS 0.18 -> 0.02, LCP 6.4 -> 2.1 s (mobile home).

## 7. Remaining risks

- Benchmark store catalog differs from the dev store (more images per collection page, longer product descriptions): collection page DOM could grow ~30%; current margin of 16+ points absorbs it, re-measure against the official benchmark shop before submission.
- One third-party review widget loads on product pages only, deferred, but its SDK adds ~40 KB gz when present; accepted because it is merchant-required and page-scoped.
- Lighthouse was run against the dev store with a warm cache; cold-cache runs typically score 3-5 points lower. Internal target of 75 still holds on cold runs (observed 74-78 mobile).
- If the Theme Store raises the minimum or changes the page set, the 17-point margin is the buffer; re-verify requirements from the URL in section 2 before submission.

## Handoff

This report feeds `theme-qa-reviewer` for the final readiness verdict. No Critical findings remain open.
