# Provenance Signals - How to Recognize Each Class

> VERIFY CURRENT: Eligibility rules change. As of the last verified update (May 15, 2025), new Theme Store submissions must be built on the Skeleton Theme or on fully original code; themes on or derived from Dawn or Horizon are not eligible. Confirm at run time:
> - https://shopify.dev/docs/storefronts/themes/store/requirements
> - https://shopify.dev/changelog/updated-shopify-theme-store-requirements-and-submission-process-effective-may-15-2025
> Official repositories: https://github.com/Shopify/skeleton-theme, https://github.com/Shopify/dawn, https://github.com/Shopify/horizon

## Fingerprint discipline

- A fingerprint is a claim. Every fingerprint in this document is a candidate signal, not proof. You MUST verify each candidate against the actual theme files and against the official repository before recording it in `docs/source-audit.md`.
- The definitive check for Dawn/Horizon/Skeleton derivation is a **diff against the official repository**: clone it, compare the file set, and compare file contents (hashes or a real diff). Similarity by name is weak; similarity by content is strong.
- Never infer provenance from a single marker. A theme can contain a file named `cart-drawer.liquid` that is wholly original. Require converging evidence: file sets, content matches, schema conventions, comments, and history.
- List only signals you observed. If a marker string appears nowhere, say "no matches" - do not speculate about intent.

## ORIGINAL

Signals that the code is authored for this theme:

- Custom, coherent naming throughout: section/snippet prefixes specific to the theme or studio (for example `quiz-*`, `atc-*`), schema setting ids that do not appear in any official repo, bespoke CSS custom properties.
- Original comments referencing the theme or its author/studio; brand strings in locales and schema names.
- Git history with the author's own commits over time, authored by the actual owner (name/email consistent), no upstream remote, no imported initial commit.
- No vendored assets beyond what the theme's own documentation declares.
- Caveat: absence of Dawn/Horizon/Skeleton markers is NOT proof of originality. Originality requires positive authorship evidence. Without it the verdict is UNVERIFIED, not ORIGINAL.

## SKELETON (Shopify/skeleton-theme)

The official minimal starting point, eligible for Theme Store development. Signals:

- Small file set: a thin `layout/theme.liquid`, a handful of sections (fewer than fifteen), a single small `assets/base.css` (or similar minimal stylesheet), minimal `config/settings_schema.json` and `config/settings_data.json`, a single `locales/en.default.json`, few or no snippets, little or no custom JavaScript.
- Generic minimal section names (for example `main`, `rich-text`, `image-banner`, `featured-collection` style names) with plain schema blocks and no `t:sections.*` translation-key machinery.
- No cart drawer, no predictive search, no variant-picker/slider machinery.
- Definitive check: diff the file set against https://github.com/Shopify/skeleton-theme at the matching version. Skeleton-derived themes keep the minimal core and add their own sections; the additions are the original part.

## DAWN (Shopify/dawn)

Signals (each MUST be verified against the files and against github.com/Shopify/dawn):

- Recognizable section family: `announcement-bar`, `header`, `cart-drawer`, `featured-product`, `featured-collection`, `collection-list`, `collage`, `image-banner`, `image-with-text`, `multirow`, `rich-text`, `video`, `newsletter`, `blog-posts`, `contact-form`, `product-recommendations`, `footer`, `main-product`, `main-collection`, `main-cart`, `main-search`, `main-blog`, `main-article`, `main-404`, `main-password`, `main-list-collections`, `main-page`.
- Snippet families: `card-product`, `card-collection`, `card-article`, `icon-*` (one snippet per icon), `price`, `variant-picker`, `facets`, `predictive-search`, `product-info`, `media-gallery`, `quantity-popover`, `badge`, `button`.
- Assets: `global.js`, `constants.js`, `details-disclosure.js`, `show-more.js`, `cart-notification.js`, `main-product.js`, `variant-select.js`, `predictive-search.js`, `base.css`, `component-*.css`.
- Schema conventions: settings and blocks named with `t:sections.<section>.<setting>` translation keys backed by a `locales/en.default.json` carrying the same key tree; `"type": "header"` and `"type": "footer"` section groups in templates; preset names like `t:sections.*.presets.name`.
- CSS custom properties: `--color-background`, `--color-foreground`, `--color-button`, `--color-base-*`, `--font-body-family`, `--font-body-style`, `--font-body-weight`, `--font-heading-*`, plus layout variables such as `--page-width`, `--grid-*`, `--spacing-*`.
- Class vocabulary: `.page-width`, `.section-*`, `.card`, `.card__inner`, `.card__media`, `.button`, `.button--primary`, `.badge`, `.color-background-1`, `.header__*`, `.footer__*`.
- Comments and licensing: Dawn is MIT-licensed open source. Copied Dawn files may carry MIT headers, or the headers may have been stripped - stripping does not change provenance.
- Git history: `git remote -v` pointing at `github.com/Shopify/dawn`, or an initial commit importing Dawn (for example "Import Dawn 15.0.0").
- Definitive check: diff sections, snippets, assets, and config against the official repo at the matching version. More than a handful of files at near-identical content, or an exact file-set match, is a derivation - regardless of renaming, reformatting, or minification (see SKILL.md HARD RULES).

## HORIZON (Shopify/horizon)

Shopify's reference Online Store 2.0 implementation, MIT-licensed, in the `Shopify/horizon` repository. Not eligible as a base for new Theme Store submissions.

- Marker strings `Horizon` / `horizon` in section names, schema names, asset filenames, or comments.
- Because the official file set changes between releases, do NOT rely on memorized file names. Clone https://github.com/Shopify/horizon and compare the file set and content hashes directly. Report the release you compared against.
- Treat the absence of the literal string as insufficient: a renamed copy of Horizon still carries its content. The diff is the evidence.
- Git history pointing at `github.com/Shopify/horizon` is conclusive.

## THIRD-PARTY (commercial theme or components)

- Theme identity strings: the theme's product name in `config/settings_schema.json` (`"name": ...`), in locale keys (for example a `general.meta.theme_name` or brand-prefixed keys), or in template/section comments.
- Credit and watermarking: "Powered by <vendor>", attribution links in the footer, copyright comments naming a theme studio.
- Commercial patterns: vendor-prefixed section/snippet names (for example `vela-*`, `dc-*`, `bss-*`), settings for license keys or "remove attribution" toggles, obfuscated or minified assets without corresponding source, support links to a third-party help center.
- Archive artifacts: exported zip with vendor metadata, `.shopify/` directory, timestamps consistent with a single export, `templates/customers/*` from a purchased theme.
- Git history: none (theme delivered as a zip), or a squashed import commit with no authorship trail.
- Licensing: a commercial theme license usually covers one store and does not permit redistribution or resubmission as a new Theme Store theme. Record the license terms if found; otherwise mark the licensing question UNVERIFIED.

## COPIED COMPONENTS / LIBRARIES

- Vendored open-source JavaScript with recognizable banners: Splide, Swiper, Slick, Flickity, Glide, GSAP, Alpine.js, noUiSlider, AOS, Isotope, Masonry, Lottie, PhotoSwipe/lightbox libs, and minified bundles carrying `/*! ... */` or `@license` headers.
- License texts embedded in assets: MIT, Apache-2.0, BSD, GPL preambles. A GPL asset inside a theme creates a license conflict; an MIT asset may be kept only with its license text and attribution intact.
- Build artifacts committed into `assets/`: bundled/minified output whose source is absent (no `src/`, no `package.json`, no source maps).
- Shopify sample code copied from documentation or tutorials (common examples: gift wrapping, age verification, countdown timers, cart drawers). Matching a tutorial pattern is a signal to check, not a verdict by itself.
- For each copied component record: library name, version, license, where the license text lives, and whether the theme's own license permits inclusion.

## MIXED

Different components with different provenances - for example a Dawn-derived section set plus an original custom section plus a vendored slider. MIXED is not a verdict of failure; it means every component gets its own disposition (safe to retain / must rewrite / keep with license).

## UNVERIFIED

- No positive authorship evidence and no conclusive markers: comments stripped, no git history, no archive, no owner statement.
- Contradictory or inconclusive fingerprint results that a diff could not resolve.
- UNVERIFIED blocks the pipeline. The audit must state precisely which evidence is missing and what would resolve it (a git history, the purchase license, the original archive, a written originality statement).

## Git history and archive checks

- `git remote -v` - an upstream remote is the strongest single signal; check for `Shopify/dawn`, `Shopify/horizon`, `Shopify/skeleton-theme`, or a commercial vendor's repo.
- `git log --oneline --all` and the first commit - look for "Import", "Initial", upstream version numbers, and author emails.
- `git tag` - tags matching upstream releases indicate a full clone.
- `git reflog` - can reveal an upstream clone that was later re-pointed.
- Archive listing - `unzip -l Archive.zip` (or equivalent). Look for `__MACOSX/`, `.DS_Store`, `.shopify/`, vendor metadata files, and member timestamps. A `.shopify/` directory or vendor-specific files indicate an export from a commercial theme, not original work.
