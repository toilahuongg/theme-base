---
verdict: THIRD-PARTY
confidence: 0.99
theme_name: "Veloura (rebrand of FoxEcom 'Zest' v9.1.1)"
audit_date: "2026-09-09"
auditor: theme-source-auditor
shopify_requirements_verified_at: "2026-09-09"
shopify_requirements_url: "https://shopify.dev/docs/storefronts/themes/store/requirements"
---

# Source Audit: Veloura (theme-base)

## 1. Source provenance

- **Theme identity:** The live `config/settings_schema.json` declares `theme_name: "Veloura"`, `theme_version: "1.0.0"`, `theme_author: "Veloura"`. However, the bundled `Archive.zip` (same tree, 2026-09-08 21:44) contains `config/settings_schema.json` declaring `theme_name: "Zest"`, `theme_version: "9.1.1"`, `theme_author: "FoxEcom"`, `theme_documentation_url: "https://docs.foxecom.com/zest-theme/"`, `theme_support_url: "https://help.foxecom.com"`. `docs.foxecom.com/zest-theme` is the official documentation of **Zest, a commercial Shopify Theme Store theme by FoxEcom**, currently listed at `https://themes.shopify.com/themes/zest` (USD $330, "by FoxEcom", verified 2026-09-09). The live tree is the same codebase with the identity block swapped and FoxEcom branding mechanically renamed.
- **Rebrand evidence:** `diff /tmp/zest-x/assets/global.js live/assets/global.js` shows only namespace renames: `window.Foxtheme` → `window.VelouraTheme`, `FoxTheme` → `VelouraTheme`, `FoxThemeSettings` → `VelouraSettings`, `FoxThemeEvents` → `VelouraEvents`. `config/settings_schema.json` diff is limited to the `theme_info` block (name/version/author/URLs) and three `foxecom.link` how-to links repointed to `https://github.com/toilahuongg/theme-base`. Live code still contains FoxEcom fingerprints the rebrand missed: metafield namespace `foxecom-bs-kit` in `sections/main-product.liquid`, `sections/featured-product.liquid`, `sections/product-quickview.liquid`, `snippets/product-media.liquid`.
- **Git history:** Single squashed commit `c202d1d` ("start theme base", author toilahuong <vbh30062001@gmail.com>, 2026-09-09 00:00:01 +0700) on `main`, remote `git@github.com:toilahuongg/theme-base.git` (personal, not Shopify). No tags. Reflog shows assembly of the rebrand: `HEAD@{3}: merge feat/veloura-theme: Fast-forward`, `HEAD@{2}: commit (initial): start theme base`, `HEAD@{0}: Branch: renamed refs/heads/fresh-start to refs/heads/main`. No history of the theme code itself. `Archive.zip`, `.env`, and `themes/` are untracked.
- **Source archives:** `Archive.zip` (1.7 MB, 980 members, all timestamps 2026-09-08 21:44, includes 490 `__MACOSX/` entries — zipped on macOS) is the **pre-rebrand FoxEcom Zest v9.1.1** snapshot: identical file set to the live theme (only `.agents/`, `.github/`, `.gitignore`, `.env*`, `.shopify/`, `Archive.zip` exist in live but not archive). No `.shopify/` directory inside the archive. `themes/` (the `pull-theme.mjs` output dir) is empty. `scripts/pull-theme.mjs` + `.env.example` confirm the theme was pulled from a live store via the Admin API (`theme { files(...) }`) using a `SHOPIFY_STORE`/`SHOPIFY_ACCESS_TOKEN`.
- **Fingerprint comparison (verified against official Shopify/dawn, cloned 2026-09-09, Dawn 16.0.0 = `258f00f6`, plus tags v1.0.0–v15.3.0):** The theme is Dawn-derived at its core. 34 of 77 section files share names with Dawn v15.2 (`announcement-bar`, `header`, `footer`, `main-product`, `main-cart-items`, `main-collection-product-grid`, `predictive-search`, `quick-order-list`, `pickup-availability`, `slideshow`, `video`, etc.); `layout/theme.liquid` uses Dawn v15+ section groups (`{% sections 'header-group' %}`, `{% sections 'footer-group' %}`, `render 'cart-drawer'`, `render 'search-drawer'`); 51 of 52 locale file names match Dawn v15.2 (`vi.schema.json` is the only theme-only file); 66 sections use the Dawn `t:sections.*` locale architecture; `assets/global.js` contains Dawn v15+'s `HTMLUpdateUtility` class and `PUB_SUB_EVENTS` constants. Content diffs vs Dawn v15.2: `sections/main-product.liquid` shares 886/1674 lines, `assets/global.js` 658/2356, `assets/base.css` 647/1174, `config/settings_schema.json` 621/1613, `assets/product-info.js` 241/750, `templates/product.json` 106/599. No file is byte-identical to any Dawn release v1.0.0–v16.0.0 (all heavily modified). The `.github/` directory (9 files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `PULL_REQUEST_TEMPLATE.md`, `dependabot.yaml`, `workflows/ci.yml|cla.yml|stale.yml`, `ISSUE_TEMPLATE/*`) is **byte-identical (md5) to Shopify/dawn's repo**, e.g. `CONTRIBUTING.md` md5 `05a455b66a6fa91a1e7901620068d7f7`, and its text still instructs contributors to "create a pull request for Dawn". Dawn section names absent from every Dawn release (`hero.liquid`, `popup.liquid`, `maps.liquid`, `custom-content.liquid`, `main-password.liquid`) are FoxEcom's own additions, not Dawn files. The 27 inventory "Horizon" hits are all false positives: the substring `Horizon` inside the label `"Horizontal"` (spot-checked `locales/de.schema.json` lines 1439/3748/4285/4511, `en.default.schema.json`, `sections/products-bundle.liquid` line 683). No Skeleton markers.
- **Naming conventions:** Dawn-style `t:sections.*` / `t:settings_schema.*` key paths (230 of 1,883 locale leaf keys shared with Dawn v15.2), Dawn section-group JSON (`header-group.json`, `footer-group.json`), but FoxEcom-owned section/snippet vocabulary (`hero`, `popup`, `maps`, `custom-content`, `main-password`, `products-bundle`, `scrolling-promotion`, `lookbook`, `age-verifier`, `product-quickview`, `sticky-atc-bar`, `favorite-products`, …) and FoxEcom CSS/JS architecture (`theme.css` + `components.css` + `grid.css` + `non-critical.css`, per-section CSS files, `window.VelouraTheme` JS namespace).
- **Verdict reasoning:** The theme is the commercial theme **Zest by FoxEcom (v9.1.1)** — proven by the archive's own `settings_schema.json` identity block, the `window.Foxtheme` namespace, `foxecom.link` links, `foxecom-bs-kit` metafields still present in live code, and the matching live Theme Store listing — mechanically renamed to "Veloura". Per the HARD RULES, renaming does not change provenance. The code is additionally Dawn-derived (section set, section groups, locale architecture, shared line content, byte-identical `.github` scaffolding), so it is a third-party commercial theme *and* Dawn-derived: doubly ineligible for a new Theme Store submission. Confidence 0.99 because the identity is declared by the vendor's own files in the archive; the only residual uncertainty is the exact license terms the current owner holds (personal store use ≠ resale rights).

## 2. Third-party dependencies

| Artifact | Location | Origin | Version | License | License text present? |
| --- | --- | --- | --- | --- | --- |
| FoxEcom "Zest" theme (entire codebase) | all of `layout/`, `templates/`, `sections/`, `snippets/`, `assets/`, `config/`, `locales/` | FoxEcom (commercial, sold on Shopify Theme Store) | 9.1.1 | Commercial (Theme Store license for store use) | No license file in theme |
| Dawn-derived core (sections, locales, section groups, `.github/`) | `sections/announcement-bar, header, footer, main-product, main-cart-items, predictive-search, quick-order-list, …`; `layout/theme.liquid`; 51 locale files; `.github/*` | Shopify/dawn (MIT) | v15.x-era base, compared against v1.0.0–v16.0.0 | MIT | No — Dawn's `LICENSE.md` absent; 0 MIT-text hits |
| GSAP | `assets/gsap.js`, `assets/ScrollTrigger.js` | GreenSock (greensock.com) | 3.12.2 (headers, "Copyright 2023") | GreenSock Standard License | Yes — header block present in both files; used by `sections/layered-images.liquid` |
| Flickity (bundled) | `assets/vendor.js` (webpack bundle, `flickity` references incl. lazyLoad) | Metafizzy | unbranded in bundle | GPL-3.0 or commercial | No — `vendor.js` header says "see vendor.js.LICENSE.txt" but that file does not exist |
| PhotoSwipe (bundled) | `assets/vendor.js`; used by `assets/product-media.js`, `assets/product-info.js`, `sections/main-product.liquid`, `sections/featured-product.liquid`, `snippets/product-thumbnail.liquid` | PhotoSwipe (dimsemenov) | unbranded in bundle | MIT | No |
| jQuery (bundled) | `assets/vendor.js` | OpenJS Foundation | unbranded in bundle | MIT | No |
| FoxEcom "bs-kit" metafield hook | `sections/main-product.liquid`, `sections/featured-product.liquid`, `sections/product-quickview.liquid`, `snippets/product-media.liquid` | FoxEcom proprietary | n/a | proprietary (unnamed) | n/a |

- Additional notes: `assets/vendor.js` (267,980 B) is a minified webpack bundle with no license file shipped despite its banner referencing `vendor.js.LICENSE.txt`. The GPL-3.0 Flickity component inside a closed bundle is a copyleft risk. Build artifacts (bundles) have no source present in the repo.

## 3. High-risk files

| File | Risk | Evidence |
| --- | --- | --- |
| `assets/vendor.js` | Minified bundle without license file; GPL-3.0 Flickity + MIT jQuery/PhotoSwipe mixed inside | Banner `/*! For license information please see vendor.js.LICENSE.txt */`; `vendor.js.LICENSE.txt` absent; `flickity`/`PhotoSwipe`/`JQuery` identifiers found in bundle |
| `assets/gsap.js`, `assets/ScrollTrigger.js` | Third-party commercial-licensed libraries (standard license), attribution/terms coupling | GSAP 3.12.2 headers, "Subject to the terms at https://greensock.com/standard-license" |
| `config/settings_schema.json` (live) | Identity of another vendor's commercial theme declared as own | `theme_author: "Veloura"` vs archive's `theme_author: "FoxEcom"`, `theme_version: "9.1.1"` |
| All theme code with residual FoxEcom branding | Rebrand incomplete; provenance markers survive | `foxecom-bs-kit` metafields in 4 files; `foxecom.link` URLs removed but namespace remains |
| `layout/theme.liquid`, `sections/*`, `locales/*` | Dawn-derived code under a renamed namespace | Section-group pattern, `t:sections.*` architecture, 886/1674-line overlap in `main-product.liquid` |

- Explanation: The highest-risk artifacts are the minified third-party bundles with missing license texts and the entire commercial FoxEcom codebase presented under a new brand. No obfuscation, license-key logic, or base64 blobs were observed beyond the webpack bundle itself.

## 4. Safe concepts to retain

Concepts are ideas and patterns, not code.

- OS 2.0 architecture (JSON templates, section groups for header/footer, `t:sections.*` localization) — standard Shopify platform conventions required by the Theme Store, not vendor IP.
- Generic e-commerce UX ideas: quick view, recently viewed, product tabs, gift wrapping, sticky add-to-cart, age verifier, lookbook, before/after slider, countdown timer, collection tabs — generic merchandising concepts; must be re-implemented from scratch.
- Dawn-style pub/sub event names and HTML-update utility pattern — a well-known Dawn design pattern; only the *idea* of using pub/sub for cart/variant updates is safe, the code is not.
- GreenSock/Flickity/PhotoSwipe *capabilities* (scroll animations, carousels, lightboxes) — standard library features; any reuse must be re-implemented or properly licensed, not copied from the bundle.

## 5. Code that must be rewritten

For each item, the finding that makes it ineligible: derived from a commercial third-party theme (FoxEcom "Zest") and from Dawn; per HARD RULES, renaming/refactoring does not change provenance.

- **Everything under `layout/`, `sections/`, `snippets/`, `assets/`, `templates/`, `locales/`, `config/`** — the entire theme is FoxEcom's commercial Zest codebase (archive identity block + `window.Foxtheme` + `foxecom-bs-kit`), and its core is Dawn-derived (section set, section groups, locale architecture, shared content). A new submission must start from Shopify's Skeleton Theme or from fully original code.
- **Dawn-derived sections** (`announcement-bar`, `header`, `footer`, `main-product`, `main-cart-items`, `main-collection-product-grid`, `predictive-search`, `quick-order-list`, `pickup-availability`, `cart-drawer`, `featured-collection`, `featured-product`, `image-with-text`, `multicolumn`, `rich-text`, `slideshow`, `video`, and the other 17 shared-name files) — Dawn derivatives are explicitly ineligible for the Theme Store regardless of license.
- **`assets/global.js`, `assets/base.css`, `assets/customer.js`, `assets/facets.js`, `assets/product-info.js`, `assets/recipient-form.js`, `assets/quantity-popover.*`, `assets/quick-order-list.*`, `assets/pickup-availability.js`, `assets/cart-drawer.js`, `assets/cart.js`** — line-level overlap with Dawn v15.2 verified by diff (e.g., `global.js` 658/2356 common lines, `base.css` 647/1174, `product-info.js` 241/750).
- **`config/settings_schema.json`, `config/settings_data.json`, `locales/*.schema.json`, `locales/*.json`** — Dawn `t:settings_schema.*`/`t:sections.*` architecture (621/1613 common schema lines; 230 shared locale keys) extended by FoxEcom; both layers are non-eligible.
- **`assets/vendor.js`, `assets/gsap.js`, `assets/ScrollTrigger.js`** — minified third-party bundles (Flickity GPL-3.0, jQuery MIT, PhotoSwipe MIT, GSAP standard license) with missing license texts; replace with properly licensed alternatives or original code.
- **`.github/`** — byte-identical copy of Shopify/dawn's contribution scaffolding; must not be republished as the theme's own project scaffolding without the MIT license and Dawn attribution (and its Dawn-referencing text is misleading).

## 6. Potential IP/licensing risks

- **Redistribution of a commercial Theme Store theme** — the archive proves the theme is FoxEcom "Zest" v9.1.1, currently sold on the Shopify Theme Store. A Theme Store license covers the purchaser's store use, not rebranding and resubmission as a new product. Required action: do not submit; replace with Skeleton-based or original code, or obtain written resale rights from FoxEcom (unlikely).
- **Dawn-derived core** — Dawn is MIT, which would permit reuse *with license/attribution*, but the current Theme Store requirements make Dawn-derived submissions ineligible regardless of license, and the theme ships no MIT license text or attribution (0 MIT hits). Required action: remove all Dawn-derived code.
- **GPL-3.0 Flickity inside `vendor.js` without license text** — copyleft conflict for a commercial/distributed theme; `vendor.js.LICENSE.txt` referenced by the banner does not exist. Required action: remove or re-license.
- **Missing third-party license texts** — GSAP (standard license), jQuery, PhotoSwipe bundled without accompanying terms. Required action: either ship license texts or replace.
- **Theme Store exclusivity/uniqueness violations** — the requirements state themes must be exclusive to the Theme Store and "fundamentally different from other themes on the Shopify Theme Store"; a rebranded Zest is, byte-for-byte, a currently-listed commercial theme. Required action: restart from an eligible codebase.

## Evidence log

- 2026-09-09 — Ran inventory script `inventory.mjs` — 482 theme files; 27 "Horizon" hits (all false positives on "Horizontal"); 0 Dawn/Skeleton/MIT hits.
- 2026-09-09 — Git inspection — 1 commit (`c202d1d` "start theme base"), no tags, personal remote; reflog shows `feat/veloura-theme` fast-forward merge and branch rename `fresh-start`→`main`.
- 2026-09-09 — `unzip -l Archive.zip` — 980 members incl. 490 `__MACOSX/`, all stamped 2026-09-08 21:44; no `.shopify/` in archive.
- 2026-09-09 — Archive extraction — `config/settings_schema.json` identity: Zest 9.1.1, author FoxEcom, `docs.foxecom.com/zest-theme/`, `help.foxecom.com`; `assets/global.js` starts `window.Foxtheme`.
- 2026-09-09 — Archive-vs-live diff — 125 differing paths, all rebrand-type: `theme_info` block, `FoxTheme*`→`Veloura*` renames, 3 `foxecom.link` URL swaps; live code retains `foxecom-bs-kit` metafields.
- 2026-09-09 — Official Dawn cloned (`258f00f6`, 16.0.0) + tags v1.0.0–v15.3.0 — 34 shared section names (vs v15.2), 51/52 shared locale names, `.github/*` byte-identical (md5), no Dawn release contains `hero/popup/maps/custom-content/main-password`; content overlap: `main-product.liquid` 886/1674, `global.js` 658/2356, `base.css` 647/1174, `settings_schema.json` 621/1613, `product.json` 106/599; 0 byte-identical files in any release.
- 2026-09-09 — Locale key comparison vs Dawn v15.2 — 230 of 1,883 theme leaf keys shared; theme-only keys are FoxEcom sections (`age-verifier`, `hero`, `popup`, `maps`, …).
- 2026-09-09 — `docs.foxecom.com/zest-theme/` read — "Zest is a flexible and easy-to-use Shopify theme… a product of FoxEcom" with Theme Store embed `themes.shopify.com/themes/zest`.
- 2026-09-09 — `themes.shopify.com/themes/zest` read — "Zest, $330 USD, by FoxEcom" currently listed.
- 2026-09-09 — Library inspection — GSAP 3.12.2 headers in `gsap.js`/`ScrollTrigger.js`; `vendor.js` bundles Flickity/jQuery/PhotoSwipe; `vendor.js.LICENSE.txt` absent.

## Eligibility verification

- Current Theme Store requirements checked at: `https://shopify.dev/docs/storefronts/themes/store/requirements` on 2026-09-09 (also `https://shopify.dev/docs/storefronts/themes/store` and `https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme`).
- Summary: The requirements page states verbatim — "Shopify's Skeleton Theme is the only approved codebase for Theme Store development. Otherwise, themes must be built with fully original code. **New theme submissions built on or derived from Dawn or Horizon are not eligible for the Shopify Theme Store.**" It further requires Theme Store exclusivity, no external marketing material/designer credits, and uniqueness — themes must be "fundamentally different from other themes on the Shopify Theme Store," with cosmetic/additive alterations explicitly insufficient.
- Consequences for this verdict class: a THIRD-PARTY theme (FoxEcom Zest) that is additionally Dawn-derived fails every relevant gate — exclusivity (it is another vendor's currently-listed Theme Store product), uniqueness, and the approved-codebase rule. The pipeline must not proceed to redesign on this codebase; it must restart from the Skeleton Theme or original code.
