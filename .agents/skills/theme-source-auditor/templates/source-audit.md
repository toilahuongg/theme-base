---
verdict: UNVERIFIED
confidence: 0.0
theme_name: ""
audit_date: ""
auditor: theme-source-auditor
shopify_requirements_verified_at: ""
shopify_requirements_url: ""
---

# Source Audit: <Theme Name>

> How to fill this template: replace every `<...>` placeholder with observed evidence. Every claim below must be traceable to a file path, a git object, an archive member, or an official-repo diff. If a signal was not observed, write "no matches" or "not observed" - never infer. Verdict must be one of: ORIGINAL / SKELETON / DAWN / HORIZON / THIRD-PARTY / MIXED / UNVERIFIED. Set `confidence` to a value between 0.0 and 1.0. Delete this blockquote before delivering.

## 1. Source provenance

- **Theme identity:** `<name from config/settings_schema.json; locale keys naming the theme; comment headers>`
- **Git history:** `<remotes, commit count, first-commit message and author, tags, reflog findings, or "no .git directory">`
- **Source archives:** `<archive file names, member listing highlights, __MACOSX/.DS_Store/.shopify/ findings, timestamps, whether the archive matches the live theme>`
- **Fingerprint comparison:** `<which directories/files were compared against which official repository at which release; similarity level for sections, snippets, assets, config>`
- **Naming conventions:** `<schema setting id patterns, section/snippet prefixes, t:sections.* usage, CSS custom-property and class vocabulary>`
- **Verdict reasoning:** `<why the verdict above was chosen, in 2-4 sentences, citing the strongest evidence>`

## 2. Third-party dependencies

| Artifact | Location | Origin | Version | License | License text present? |
| --- | --- | --- | --- | --- | --- |
| `<library/asset>` | `<path>` | `<vendor/GitHub>` | `<version>` | `<MIT/Apache/BSD/GPL/unknown>` | `<yes/no>` |

- `<Additional notes: build artifacts whose source is absent, GPL conflicts, dependencies with unverifiable licenses>`

## 3. High-risk files

| File | Risk | Evidence |
| --- | --- | --- |
| `<path>` | `<obfuscated / minified without source / license-key logic / attribution-gating / base64 blobs / unknown origin>` | `<what was observed>` |

- `<One-line explanation per file or group of files>`

## 4. Safe concepts to retain

Concepts are ideas and patterns, not code. Retaining a concept is not retaining derived code. For each item, state why it is safe (it is an original idea, a standard Shopify pattern, or a generic UX convention).

- `<Concept> - <why safe>`
- `<Concept> - <why safe>`

## 5. Code that must be rewritten

For each item, state the provenance finding that makes it ineligible (derived from Dawn/Horizon, third-party license that does not permit redistribution, unknown origin).

- `<Component / file group> - <finding>`
- `<Component / file group> - <finding>`

> HARD RULES: renaming variables, renaming classes, moving files, changing formatting, or minifying do NOT change provenance and are NOT acceptable fixes. Rewriting means authoring new code from scratch, or replacing the component with an eligible implementation.

## 6. Potential IP/licensing risks

- `<Risk description> - <evidence> - <required action>`
- `<Risk description> - <evidence> - <required action>`

## Evidence log

- `<Date> - <check performed> - <result>`
- `<Date> - <check performed> - <result>`

## Eligibility verification

- Current Theme Store requirements checked at: `<URL>` on `<date>`.
- Summary of what the current rules say about this verdict class: `<summary>`.
- If requirements could not be fetched, this section is UNVERIFIED and the verdict must say so.
