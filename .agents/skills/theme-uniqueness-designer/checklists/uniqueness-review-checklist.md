# Uniqueness Review Checklist

Walkthrough for the theme-uniqueness-designer. Run this checklist before finalizing `docs/uniqueness-matrix.md`. The golden rule applies to every row:

> "If the source theme could reproduce the new UX using normal theme settings plus modest CSS customization: FAIL."

## 1. Preflight

- [ ] Fetched the current Shopify uniqueness requirement from shopify.dev (Theme Store requirements page) and read the uniqueness/reskin wording this run.
- [ ] Read `docs/source-audit.md`; built the source inventory from it, not from memory.
- [ ] Read the source theme's `config/settings_schema.json` and its section schemas; enumerated every experience the source can express via settings (header layouts, nav modes, mega menu, product card options, gallery modes, cart behavior, search overlay, mobile drawer, media ratios, animation toggles).
- [ ] Read the new theme's docs: `docs/design-system.md`, `docs/commerce-thesis.md`, `docs/user-journeys.md`, `docs/page-information-architecture.md`, `docs/theme-architecture.md`, `docs/commerce-implementation.md`, `docs/editor-architecture.md`.
- [ ] Read the landed code: `layout/`, `templates/`, `sections/`, `snippets/`, `assets/`, `config/`.
- [ ] Fresh-eyes reset done: judged behavior, not builders; no claim accepted without a file/line citation.

## 2. Per-row walkthrough (run for each of the 10 core experiences)

Rows: header, navigation, mega menu, product card, collection page, PDP, cart, search, mobile nav, media.

For each row:

- [ ] 2a. Stated the source behavior with a citation (file/line) — at the source's FULL settings range, not its defaults.
- [ ] 2b. Stated the new theme's behavior with a citation (file/line).
- [ ] 2c. Ran the settings-reproduction test: which source settings (by name) could produce the new behavior? List them explicitly. If the list is non-empty and complete, the row is FAIL on the golden rule unless a structural difference remains.
- [ ] 2d. Checked for structural difference on all five axes (interaction model, page architecture, media treatment, shopping paradigm, content model). At least one axis must be satisfied by CODE, not docs.
- [ ] 2e. Forced the edge cases: no mega menu configured, no product images, one-product collection, empty cart, short/long titles, mobile width, reduced motion. Structural claim still holds?
- [ ] 2f. Recorded verdict PASS / WEAK / FAIL with evidence. WEAK only when a real structural change exists but is partial (one breakpoint, one edge case, or a dominant settings-reproducible experience).

## 3. FAIL-rule checks (reject on any of these)

- [ ] The only differences are: font, colors, radius, spacing, animations, three added sections, a new gradient, renamed labels, swapped icons, reordered sections, changed setting defaults, image filters, hover tints.
- [ ] The new theme's feature exists as a setting in the source theme (schema test) and only its default changed.
- [ ] The new UX is reproducible with Theme Editor settings plus modest CSS (custom CSS facility, small snippet tweaks).
- [ ] The claim is doc-only: the design doc promises X, the code does not deliver X.
- [ ] The claim depends on an app to function (app embeds are not theme uniqueness).
- [ ] The "new section" is an empty shell: renders headings/text with no content model or behavior.
- [ ] The difference exists on one breakpoint only and the rest of the experience matches the source.

## 4. Global golden-rule pass

- [ ] Stripped the color/font/animation layer from the whole theme: does the skeleton still differ from the source? If the stripped theme matches the source experience, the theme is a reskin regardless of individual row verdicts -> overall FAIL.

## 5. Overall verdict

- [ ] Counted rows: PASS x / WEAK y / FAIL z.
- [ ] Applied the overall rule: PASS only if every row is PASS; WEAK if zero FAIL and one or more WEAK; FAIL if any row is FAIL or the theme is a reskin.
- [ ] Listed the structural differentiators that actually carry the theme (one line each, with the axis they satisfy).
- [ ] Used only PASS / WEAK / FAIL anywhere in the matrix; no other grades.

## 6. Required changes

For every FAIL and WEAK row, recorded:

- [ ] The concrete structural change required (what must become structural, not a styling wish).
- [ ] The owning sibling: theme-art-director (concept), commerce-ux-architect (experience definition), shopify-liquid-architect (template/section structure), theme-editor-architect (schema/content model), shopify-commerce-engineer (commerce behavior).
- [ ] Which evidence will be checked at re-review (file/line to inspect), so the fix can be verified in code.

## 7. Re-review (second run, before submission)

- [ ] Diffed this run's matrix against the first run's `docs/uniqueness-matrix.md`.
- [ ] Verified every required change landed in code by reading it — no builder assertions accepted.
- [ ] Re-ran the four tests (schema, interaction, screenshot, edge-case) on every previously FAIL/WEAK row.
- [ ] Recorded the delta in the matrix's re-review section: what changed, new verdicts, new evidence.
