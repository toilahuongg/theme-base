# Provenance Verification Checklist

Run every step in order. Record results as you go; the evidence feeds `docs/source-audit.md`. Do not skip steps - an unchecked step is a hole in the verdict.

## Step 0 - Baseline

- [ ] Confirm the working directory is a Shopify theme root (contains at least `layout/`, `templates/`, `config/`, `locales/`). If not, locate the theme root first and note it.
- [ ] Note the theme name from `config/settings_schema.json` (`"name": ...`).
- [ ] Run the inventory script:
      `node <skill-root>/scripts/inventory.mjs <theme-root>`
- [ ] Record file counts and total bytes per directory: `layout/`, `templates/`, `sections/`, `snippets/`, `assets/`, `config/`, `locales/`.
- [ ] Record every file matching the default markers (Dawn, Horizon, Skeleton, Shopify Theme Store, MIT license text).

## Step 1 - Directory inspection

- [ ] `layout/` - read `theme.liquid` fully; check which assets and snippets it loads; look for comment headers, credits, and schema conventions.
- [ ] `templates/` - list all templates (including `templates/customers/` and `templates/404.json`). Compare the section set against the official Skeleton/Dawn/Horizon file sets.
- [ ] `sections/` - list all sections; note naming prefixes; read the `{% schema %}` of 3-5 representative sections; check for `t:sections.*` translation keys.
- [ ] `snippets/` - list all snippets; note families (`card-*`, `icon-*`) and any vendor prefixes.
- [ ] `assets/` - list all assets; flag minified or obfuscated files; check headers of JS/CSS for license banners; note fonts and images (binary files are counted in the inventory but not marker-scanned).
- [ ] `config/` - read `settings_schema.json` and `settings_data.json`; compare setting ids and structure against the official repos.
- [ ] `locales/` - list locale files; check for theme/vendor name keys and credit strings.

## Step 2 - Git history

- [ ] `git remote -v` - record remotes. An upstream pointing at `Shopify/dawn`, `Shopify/horizon`, `Shopify/skeleton-theme`, or a vendor repo is decisive.
- [ ] `git log --oneline --all` - record total commits and the first commit message/author.
- [ ] `git tag` - record tags; tags matching upstream releases indicate a full clone.
- [ ] `git reflog` - record evidence of re-pointed remotes or imported history.
- [ ] If no `.git` directory exists, record that (common for exported theme zips).

## Step 3 - Source archives

- [ ] Find archives in the theme root or supplied with the task (for example `Archive.zip`).
- [ ] List members: `unzip -l Archive.zip` (or equivalent for other formats).
- [ ] Check for `__MACOSX/`, `.DS_Store`, a `.shopify/` directory, vendor metadata files, and license files.
- [ ] Record member timestamps; a single uniform timestamp suggests a one-time export.
- [ ] Extract (or read members directly) and compare against the live theme to confirm the archive matches the code under audit.

## Step 4 - Dependency and library scan

- [ ] Identify every vendored JS/CSS library in `assets/` and its provenance marker (banner, `@license`, comment header).
- [ ] Record library name, version, and license for each (MIT, Apache-2.0, BSD, GPL, unknown).
- [ ] Flag build artifacts (bundled/minified output) whose source (`src/`, `package.json`, source maps) is absent.
- [ ] Flag GPL-licensed assets as a license conflict (see Step 6).

## Step 5 - High-risk pattern scan

- [ ] Re-run the inventory with focused markers for anything suspicious, e.g.
      `node <skill-root>/scripts/inventory.mjs <theme-root> --markers=Powered by,License,license,Copyright,copyright,All rights reserved`
- [ ] Flag: obfuscated or minified assets without source; base64-encoded blobs; license-key settings; "remove attribution" toggles; watermark links; credit links in the footer.
- [ ] For every flagged file, read enough of it to determine what it does and whether its origin is identifiable.

## Step 6 - Licensing keyword scan

- [ ] Search for: `MIT`, `Apache`, `BSD`, `GPL`, `All rights reserved`, `Powered by`, `Copyright`, `©`.
- [ ] For each hit, identify the licensed artifact and whether the license text is present alongside the code.
- [ ] Record: can this code be redistributed inside a Theme Store submission? If unknown, mark the item's licensing UNVERIFIED.

## Step 7 - Official-repo verification

- [ ] For each suspected Skeleton/Dawn/Horizon derivation, clone or read the official repository (see `references/provenance-signals.md` for URLs).
- [ ] Compare file sets: which theme files exist verbatim (or near-verbatim) in the official repo at which release.
- [ ] Compare content: diff or hash representative sections, snippets, assets, and `config/` files. Record similarity level (identical / near-identical / similar patterns only / unrelated).
- [ ] Record the official release/commit you compared against.
- [ ] Remember the HARD RULES: renaming, reformatting, or minifying derived code does not change its provenance.

## Step 8 - Current eligibility rules

- [ ] Fetch the current Theme Store requirements from shopify.dev (search "Theme Store requirements").
- [ ] Record the URL and the verification date.
- [ ] Confirm which base codebases are currently eligible and whether the audit's verdict class is affected.

## Step 9 - Verdict decision tree

Follow the first path that matches:

```
Do decisive official-repo content matches exist?
├─ YES, to Shopify/skeleton-theme      -> SKELETON
├─ YES, to Shopify/dawn                -> DAWN
├─ YES, to Shopify/horizon             -> HORIZON
├─ YES, to a commercial vendor theme   -> THIRD-PARTY
└─ NO
   ├─ Do multiple components show different provenances (e.g. Dawn core + vendored slider)?
   │  └─ YES -> MIXED (disposition each component)
   ├─ Are positive authorship signals present (original naming, original comments,
   │    plausible git history, owner statement)?
   │  └─ YES -> ORIGINAL
   └─ NO -> UNVERIFIED
```

| Verdict | Pipeline meaning |
| --- | --- |
| ORIGINAL | Proceed. Hand off to `theme-feature-analyst`. |
| SKELETON | Proceed. Skeleton is an eligible base; its additions are the original part. |
| DAWN | Block. Not eligible for a new Theme Store submission. Restart from Skeleton or original code. |
| HORIZON | Block. Not eligible for a new Theme Store submission. Restart from Skeleton or original code. |
| THIRD-PARTY | Hold for licensing review. Do not proceed until the license permits redistribution. |
| MIXED | Proceed per component: safe concepts retainable, derived/unlicensed parts rewritten. |
| UNVERIFIED | Block. Record the missing evidence and what would resolve the audit. Never proceed silently. |

## Step 10 - Write the audit

- [ ] Fill `templates/source-audit.md` into `docs/source-audit.md`.
- [ ] Verdict block: one of the seven verdicts, confidence 0.0-1.0, audit date, theme name, shopify.dev verification URL/date.
- [ ] All six sections present and each claim backed by an observed signal (file path, git object, archive member, or repo diff).
- [ ] No fabricated fingerprints. No rename/reformat/minify "solutions" recorded as fixes.
