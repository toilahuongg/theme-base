---
verdict: MIXED
confidence: 0.9
theme_name: Aurora Home
audit_date: 2026-09-08
auditor: theme-source-auditor
shopify_requirements_verified_at: 2026-09-08
shopify_requirements_url: https://shopify.dev/docs/storefronts/themes/store/requirements
---

# Source Audit: Aurora Home

> Example file. The theme "Aurora Home", its files, git history, and archive are fictional, and every fingerprint below is illustrative. This example demonstrates the expected structure, evidence style, and verdict reasoning. Real audits must cite only signals actually observed in the audited theme.

## 1. Source provenance

- **Theme identity:** `config/settings_schema.json` declares `"name": "Aurora Home"`. No locale key names a theme studio. `locales/en.default.json` contains a footer credit string "Powered by Lume Studio".
- **Git history:** single squashed commit, author `lume-dev@example.com`, message "Aurora Home initial import". `git remote -v` returns no remotes. No tags.
- **Source archives:** `Archive.zip` at theme root contains the live theme (verified by hashing extracted members). Archive includes `__MACOSX/` entries and a `.shopify/` directory with a `theme_id` file; all members share timestamp 2026-09-01 09:12 UTC, consistent with a one-time export.
- **Fingerprint comparison:** compared against `github.com/Shopify/dawn` release 15.0.0 (cloned for the audit). File-set match: 24 of 41 theme files exist near-verbatim in Dawn (12 sections, 7 snippets, 5 assets, plus `layout/theme.liquid`). Content diff: those files are identical except whitespace and comment stripping. Compared against `github.com/Shopify/skeleton-theme`: no matches.
- **Naming conventions:** Dawn-family `t:sections.*` translation keys throughout; schema settings use Dawn ids (`color_scheme`, `blocks`); CSS uses Dawn variables (`--color-background`, `--color-foreground`, `--font-body-family`) and class vocabulary (`.card`, `.card__inner`, `.button`, `.page-width`). One custom section (`quiz-builder`) uses bespoke `quiz_*` setting ids.
- **Verdict reasoning:** the section/snippet/asset set and near-identical content against Shopify/dawn 15.0.0 prove a Dawn-derived core; the archive's `.shopify/` export markers and the "Powered by Lume Studio" credit point to a commercial vendor having distributed that core; the `quiz-builder` section and `countdown-timer` section are original additions. Three provenances in one theme, so the verdict is MIXED.

## 2. Third-party dependencies

| Artifact | Location | Origin | Version | License | License text present? |
| --- | --- | --- | --- | --- | --- |
| `splide.min.js` | `assets/splide.min.js` | Splide (github.com/Splidejs/splide) | 4.1.4 | MIT | yes (banner + LICENSE comment) |
| `aurora.min.js` | `assets/aurora.min.js` | unknown (obfuscated, no source) | unknown | unknown | no |
| `base.css` | `assets/base.css` | Shopify/dawn 15.0.0 | 15.0.0 | MIT | no (header stripped) |

- `splide.min.js` is a legitimate vendored MIT library; it may be kept only with its license text and attribution intact.
- `aurora.min.js` is minified with no source file, no license, and no origin marker anywhere in the repo or archive; treated as unknown-origin.
- Dawn-derived files carry MIT headers in upstream but the headers were stripped in this theme; stripping does not change provenance.

## 3. High-risk files

| File | Risk | Evidence |
| --- | --- | --- |
| `assets/aurora.min.js` | minified, no source, no license, unknown origin | single 41 KB line; no banner; no matching source in `src/` or the archive |
| `sections/product-slider.liquid` | vendored component inside a derived core | loads `splide.min.js` and `aurora.min.js`; schema ids are a vendor prefix `lume_*` |
| `layout/theme.liquid` | Dawn-derived layout with stripped comments | diff vs dawn 15.0.0 `theme.liquid` shows only whitespace/comment differences |
| `config/settings_data.json` | contains a `license_key` setting | `license_key` block present; theme reads it in `snippets/license.liquid` |

## 4. Safe concepts to retain

Concepts are ideas and patterns, not code. Retaining a concept is not retaining derived code.

- Section/block editor pattern with `t:sections.*` translation keys - this is a standard Shopify Online Store 2.0 convention, not Dawn-specific IP; the new theme should implement its own key tree.
- A countdown timer section for launches - generic merchandising concept; `countdown-timer.liquid` itself is original and may be ported.
- Quiz-builder onboarding section - original concept with bespoke `quiz_*` schema ids; may be retained and expanded.
- Gift-wrapping cart option - standard commerce pattern; the existing implementation is Dawn-derived and must not be copied, but the feature concept stays in scope.

## 5. Code that must be rewritten

| Component | Finding |
| --- | --- |
| 12 Dawn-matching sections (announcement-bar, cart-drawer, featured-collection, header, footer, main-*, etc.) | near-identical content vs Shopify/dawn 15.0.0; Dawn-derived code is not eligible for a new Theme Store submission |
| Dawn-matching snippets (`card-*`, `icon-*`, `price`, `variant-picker`, `facets`, `predictive-search`) | near-identical content vs Shopify/dawn 15.0.0 |
| Dawn-matching assets (`global.js`, `base.css`, `component-*.css`) | near-identical content vs Shopify/dawn 15.0.0 |
| `layout/theme.liquid` | derived from Dawn with comments stripped |
| `assets/aurora.min.js` | unknown origin; cannot be licensed or attributed |
| `sections/product-slider.liquid` + `snippets/license.liquid` | vendor-gated component tied to `license_key`; third-party commercial logic |

HARD RULES reminder: renaming classes, renaming variables, reformatting, or minifying these files would NOT change their provenance. Each must be replaced by newly authored code or an eligible alternative.

## 6. Potential IP/licensing risks

- **Dawn-derived code resubmitted as original** - near-identical content against Shopify/dawn 15.0.0; the current Theme Store requirements do not accept Dawn-derived themes, so shipping this code risks rejection. Required action: rewrite per section 5 before any submission path is opened.
- **`aurora.min.js` of unknown origin** - no license, no source, obfuscated; redistributing it risks undisclosed third-party IP. Required action: remove and replace with an original implementation.
- **Commercial attribution gating** - `license_key` logic in `snippets/license.liquid` and the "Powered by Lume Studio" credit indicate the Dawn core was resold by a vendor; the vendor's license terms for this theme are not on file. Required action: obtain the purchase/license record or treat the core as unlicensed.
- **`splide.min.js` (MIT)** - usable only if the license text stays attached. Required action: keep the banner, or replace with an original slider.

## Evidence log

- 2026-09-08 - inventory script run; 41 theme files, 1.2 MB across 7 directories; markers Dawn (24 files), MIT license text (1 file).
- 2026-09-08 - cloned Shopify/dawn 15.0.0 and Shopify/skeleton-theme; diffed file sets and contents; results in section 1.
- 2026-09-08 - `unzip -l Archive.zip`; `.shopify/` and `__MACOSX/` found; members hashed and matched live theme.
- 2026-09-08 - current Theme Store requirements fetched from shopify.dev; see below.

## Eligibility verification

- Current Theme Store requirements checked at: https://shopify.dev/docs/storefronts/themes/store/requirements on 2026-09-08.
- Summary: new submissions must be built on the Skeleton Theme or on fully original code; themes on or derived from Dawn or Horizon are not eligible. The Dawn-derived core in this theme is therefore not submittable in its current state. Rules may change; re-verify before submission.
- Requirements were fetched successfully; this section is verified.
