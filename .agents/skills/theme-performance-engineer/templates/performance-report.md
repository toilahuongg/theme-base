# Performance Report

> Fill every section. Never leave a placeholder in the delivered report. Every number must come from a run you can name; mark unmeasurable items as "not measured — reason".

## 1. Summary

- Theme name: `__THEME_NAME__` — version `__VERSION__`
- Budget YAML in force (from product spec; verify at run time):

```yaml
javascript:
  initial_budget_kb: __INITIAL_JS_BUDGET__
lighthouse:
  theme_store_minimum: __CURRENT_MINIMUM__
  internal_target: 75
```

- Verdict: `__PASS_WITH_MARGIN__ | __PASS_THIN__ | __FAIL__` — margin to threshold: `__N__ points (mobile) / __N__ points (desktop)`

## 2. Requirements verified

| Requirement | Value used | Source URL | Verified date |
| --- | --- | --- | --- |
| Lighthouse minimum (mobile) | `__N__` | `https://shopify.dev/docs/storefronts/themes/store/requirements` | `__DATE__` |
| Lighthouse minimum (desktop) | `__N__` | `https://shopify.dev/docs/storefronts/themes/store/requirements` | `__DATE__` |
| Page set evaluated | home, product, collection | same | `__DATE__` |
| Evaluation formula | plain average of the three pages per device | same | `__DATE__` |
| Initial JS guidance | `__N__ KB` | `https://shopify.dev/docs/storefronts/themes/best-practices/performance` | `__DATE__` |

Note any delta between the budget YAML and the verified current values.

## 3. Baseline

Run conditions (must be identical for baseline and final): device emulation `__mobile__ | __desktop__`; network throttle `__e.g. Fast 4G 150ms RTT__`; cache state `__warm__` (repeat count `__3__`, median taken); tool `__Lighthouse CLI vX / CI action__`.

| Page | Mobile | Desktop | Notes |
| --- | --- | --- | --- |
| Home | `__N__` | `__N__` | `__LCP image? blocking script?__` |
| Product | `__N__` | `__N__` |  |
| Collection | `__N__` | `__N__` |  |
| **Average** | **`__N__`** | **`__N__`** | threshold `__N__` |

Supporting measurements: initial JS bytes `__N__ KB gz`, CSS bytes `__N__ KB`, DOM nodes `__N__`, CLS `__N__`, LCP `__N__ s`.

## 4. Findings

| # | Severity | Area | File:line | Finding | Fix applied / declined |
| --- | --- | --- | --- | --- | --- |
| 1 | `__Critical/High/Medium/Low__` | `__JS/CSS/...__` | `__assets/theme.js:120__` | `__script blocks parse__` | `__added defer__` |
| 2 |  |  |  |  |  |

Severity legend: Critical = fails requirement/budget with margin risk; High = materially moves scores; Medium = suboptimal; Low = polish.

## 5. Fixes applied

| Fix | Files touched | Pattern used |
| --- | --- | --- |
| `__defer all non-critical scripts__` | `__layout/theme.liquid__` | `__script_tag: defer: true__` |
| `__responsive image pipeline__` | `__snippets/responsive-image.liquid__` | `__image_tag with widths/sizes, width/height attrs__` |
| `__lazy below-fold media__` | `__sections/*.liquid__` | `__loading: 'lazy'__` |
| `__font-display swap + preload__` | `__assets/base.css, layout/theme.liquid__` | `__@font-face font-display: swap; preload woff2__` |
| `__section JS on demand__` | `__sections/foo.liquid, assets/section-foo.js__` | `__{% if %} ... asset_url | script_tag: defer__` |
| `__listener lifecycle__` | `__assets/theme.js__` | `__delegation + Shopify:section:load/unload__` |
| `__removed unused code__` | `__assets/, snippets/__` | `__deleted N orphaned assets/snippets__` |

## 6. Final numbers

Same conditions as baseline. Delta = final - baseline (positive = improvement).

| Page | Mobile before | Mobile after | Delta | Desktop before | Desktop after | Delta |
| --- | --- | --- | --- | --- | --- | --- |
| Home | `__N__` | `__N__` | `__+N__` |  |  |  |
| Product |  |  |  |  |  |  |
| Collection |  |  |  |  |  |  |
| **Average** | **`__N__`** | **`__N__`** | **`__+N__`** |  |  |  |

Secondary metrics: initial JS `__N__ -> __N__ KB gz` (budget `__N__`), CSS `__N__ -> __N__ KB`, DOM nodes `__N__ -> __N__`, CLS `__N__ -> __N__`, LCP `__N__ -> __N__ s`.

## 7. Remaining risks

- `__What could regress in the Theme Store benchmark environment (different catalog, more sections, app embeds).__`
- `__Any fix declined and why (e.g., merchant-critical third-party script).__`
- `__Anything unmeasured (e.g., no Lighthouse available here; replaced by X).__`
- `__Budget deltas: if the current Theme Store threshold differs from the budget YAML, the margin above changes to N.__`

## Handoff

This report feeds `theme-qa-reviewer` for the final readiness verdict. Any Critical finding still open must be resolved before handoff.
