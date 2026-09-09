# Pipeline stage cards

For each stage: owner skill, required inputs, produced artifact, gate evidence, failure behavior.

## 1. Source audit — theme-source-auditor

- Inputs: theme root (layout/, templates/, sections/, snippets/, assets/, config/, locales/), git history, any source archives (e.g. Archive.zip).
- Artifact: docs/source-audit.md.
- Gate evidence: provenance verdict (ORIGINAL | SKELETON | DAWN | HORIZON | THIRD-PARTY | MIXED | UNVERIFIED) and the licensing-risk section.
- Failure: UNVERIFIED -> BLOCKED, do not proceed. DAWN/HORIZON/THIRD-PARTY/MIXED -> REFERENCE-REBUILD mode: source theme is a concept reference only, all code rebuilt from Skeleton/original, G1 re-run on the new codebase before readiness. Provenance is never "fixed" by renaming/reformatting/refactoring.

## 2. Feature inventory — theme-feature-analyst

- Inputs: docs/source-audit.md (safe concepts to retain), theme source.
- Artifact: docs/feature-inventory.md.
- Purpose: what problems the old theme solves, classified CORE/VALUABLE/GENERIC/REDESIGN/REMOVE/APP-LIKE/RISKY with keep_concept/keep_implementation per feature.
- No gate; feeds stages 4-9.

## 3. Compliance matrix — shopify-theme-store-rules

- Inputs: current shopify.dev docs (fetched fresh each run).
- Artifact: docs/compliance-matrix.md with as-of dates and source URLs.
- Gate: every mutable threshold verified and dated. Unverified requirement area -> BLOCKED.

## 4. Commerce thesis — commerce-ux-architect

- Inputs: niche, docs/feature-inventory.md (what to keep), docs/compliance-matrix.md (what is allowed).
- Artifacts: docs/commerce-thesis.md, docs/user-journeys.md, docs/page-information-architecture.md.
- No gate, but the thesis must name the niche and the shopping model (archetype or derived), not generic advice.

## 5. Design system — theme-art-director

- Inputs: commerce thesis (structure/flow), niche, merchant type.
- Artifact: docs/design-system.md (per-dimension decisions with concrete tokens).
- No gate here; reviewed at stage 6.

## 6. Uniqueness review #1 — theme-uniqueness-designer

- Inputs: docs/design-system.md, docs/commerce-thesis.md, source theme.
- Artifact: docs/uniqueness-matrix.md (PASS/WEAK/FAIL per core experience).
- Gate: zero FAIL rows; WEAK rows have remediation. FAIL rows -> send back to stage 5 (art director) or stage 4.

## 7. Liquid architecture — shopify-liquid-architect

- Inputs: docs/design-system.md, docs/feature-inventory.md, docs/compliance-matrix.md.
- Artifacts: docs/theme-architecture.md + code (new component graph, no 1:1 file conversion).
- No gate; correctness of the build is verified at stages 10-12.

## 8. Commerce implementation — shopify-commerce-engineer

- Inputs: docs/theme-architecture.md, docs/compliance-matrix.md.
- Artifacts: docs/commerce-implementation.md + commerce code (variants, forms, cart, search, etc.).
- No gate; edge cases are exercised at stage 12 with destructive data.

## 9. Editor architecture — theme-editor-architect

- Inputs: docs/theme-architecture.md, docs/design-system.md.
- Artifacts: docs/editor-architecture.md + settings_schema.json and section schemas.
- No gate; merchant-friendliness is checked at stage 12 (editor QA).

## 10. Parallel review — performance / accessibility / QA

- Owners: theme-performance-engineer, theme-accessibility-engineer, theme-qa-reviewer.
- Artifacts: docs/performance-report.md, docs/accessibility-report.md, QA findings.
- Gate: measured results >= internal targets (higher than Theme Store minimums).
- Defects found -> route back to the owning builder stage (7/8/9), then re-run this stage.

## 11. Uniqueness review #2 — theme-uniqueness-designer

- Inputs: docs/uniqueness-matrix.md (v1), implemented theme, docs/design-system.md.
- Artifact: updated docs/uniqueness-matrix.md against the implemented theme.
- Gate: zero FAIL rows.

## 12. Readiness — theme-qa-reviewer

- Inputs: all artifacts, all review reports.
- Artifact: docs/readiness-report.md (status BLOCKED | READY, blockers, warnings, ready_for_submission).
- Gate: status READY, zero blockers, Theme Check green, minimums met, uniqueness passed. This verdict is the pipeline deliverable.
