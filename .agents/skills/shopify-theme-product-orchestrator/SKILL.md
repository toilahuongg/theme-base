---
name: shopify-theme-product-orchestrator
description: Coordinates the full Shopify Theme Factory pipeline (source audit, feature analysis, compliance, commerce UX, art direction, uniqueness review, Liquid architecture, commerce engineering, editor architecture, performance, accessibility, QA) to produce a submission-ready Shopify theme. Trigger when building or rebuilding a Shopify theme for Theme Store submission from an existing theme.
trigger: /shopify-theme-product-orchestrator
compatibility: Claude Code, Claude Desktop, Cursor, Oh My Pi
metadata:
  author: Shopify Theme Factory
  version: "1.0.0"
---

# Your Task

You are the orchestrator of a 12-skill production pipeline that turns an existing Shopify theme into a new, original, submission-ready theme. You do not write theme code yourself. You dispatch, sequence, gate, and verify the work of 12 specialist skills. A single skill run is never "the deliverable" — the pipeline state and the final readiness verdict are.

Pipeline stages and their owning skills:

1.  `theme-source-auditor` -> `docs/source-audit.md` (provenance verdict)
2.  `theme-feature-analyst` -> `docs/feature-inventory.md` (what the old theme solves)
3.  `shopify-theme-store-rules` -> `docs/compliance-matrix.md` (current, verified requirements)
4.  `commerce-ux-architect` -> `docs/commerce-thesis.md`, `docs/user-journeys.md`, `docs/page-information-architecture.md`
5.  `theme-art-director` -> `docs/design-system.md`
6.  `theme-uniqueness-designer` -> `docs/uniqueness-matrix.md` (review #1: design is genuinely new)
7.  `shopify-liquid-architect` -> `docs/theme-architecture.md` + code (new component graph)
8.  `shopify-commerce-engineer` -> `docs/commerce-implementation.md` + commerce code
9.  `theme-editor-architect` -> `docs/editor-architecture.md` + editor schemas
10. In parallel: `theme-performance-engineer` -> `docs/performance-report.md`, `theme-accessibility-engineer` -> `docs/accessibility-report.md`, `theme-qa-reviewer` -> QA findings
11. `theme-uniqueness-designer` -> review #2 (the implemented theme is still genuinely new)
12. `theme-qa-reviewer` -> `docs/readiness-report.md` (final verdict)

## Pipeline State

The single source of truth is `docs/pipeline-state.md` at the theme root. Create it on the first run (copy `templates/pipeline-state.md`; scaffold with `scripts/init-state.mjs` if present). Update it after EVERY stage: stage status, artifact path, and notes. Re-running the orchestrator on a theme resumes from the recorded state instead of restarting.

## Gates (do not proceed on failure)

- **G1 source audit**: verdict must be ORIGINAL or SKELETON-DERIVED to continue. DAWN-DERIVED, HORIZON-DERIVED, THIRD-PARTY, MIXED, or UNVERIFIED -> pipeline BLOCKED. If a rewrite path exists (source is available and the theme is eligible), record the rewrite mandate in state and only continue after the code is replaced and re-audited. Never let the pipeline "fix" provenance by renaming, reformatting, or refactoring — that is dishonest submission and the audit rule forbids it.
- **G2 uniqueness review #1**: no FAIL rows in `docs/uniqueness-matrix.md`. WEAK rows must carry concrete remediation before architecture work starts.
- **G3 compliance**: no unverified requirement areas in `docs/compliance-matrix.md`. Every mutable threshold must have an as-of date and source.
- **G4 performance/accessibility**: measured results at or above the internal targets the skills set (which are higher than the Theme Store minimums).
- **G5 uniqueness review #2**: no FAIL rows against the implemented theme.
- **G6 readiness**: `docs/readiness-report.md` verdict `status: READY`, `ready_for_submission: true`, zero blockers, Theme Check green, Lighthouse and accessibility minimums met on home/product/collection, desktop + mobile.

## Builder / reviewer separation (hard rule)

A builder skill never certifies its own work:

- `theme-art-director` designs; `theme-uniqueness-designer` reviews the design (G2).
- `shopify-liquid-architect` + `shopify-commerce-engineer` + `theme-editor-architect` build; `theme-performance-engineer`, `theme-accessibility-engineer`, and `theme-qa-reviewer` review the build (G4-G6).
- When running a reviewer skill after a builder, do not reuse the builder's conclusions; the reviewer inspects the actual artifacts with fresh eyes.

## Workflow

1.  Read `docs/pipeline-state.md` if it exists; identify the first non-passed stage.
2.  For each stage in order, until a gate fails or the pipeline is complete:
    - Invoke the owning skill (by name) with the theme root as the working directory.
    - The skill produces its artifact(s) in `docs/` at the exact paths above.
    - Read the artifact. Evaluate the gate for that stage against the evidence in the artifact — do not trust the skill's self-assessment; verify the artifact content yourself.
    - Update `docs/pipeline-state.md` (status `passed` or `blocked`, notes).
    - Gate failed -> record blockers in state, stop, and report the blocking evidence. Do not continue to later stages.
3.  Stages 10-12: run performance, accessibility, and QA after editor architecture. If any of those exposes a defect, route it back to the owning builder skill (steps 7-9) rather than patching it in the orchestrator.
4.  Final: the `docs/readiness-report.md` verdict is the deliverable. Report the verdict, the blockers/warnings, and the evidence paths.

## Outputs

- `docs/pipeline-state.md` — updated after every stage (the working record).
- The stage artifacts listed above.
- Final verdict in `docs/readiness-report.md`.

## Anti-patterns

- Running stages out of order (e.g. coding before uniqueness review #1 passes).
- Letting a builder stage mark its own gate passed.
- Treating "score = minimum + 1" as done (see `theme-performance-engineer` internal targets).
- Preserving old-theme structure 1:1 (see `shopify-liquid-architect`: design a new component graph).
- Accepting an UNVERIFIED provenance verdict and proceeding.
