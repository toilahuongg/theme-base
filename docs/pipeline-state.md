# Pipeline state

Update after every stage. This file is the source of truth; the orchestrator resumes from it.

```yaml
pipeline: shopify-theme-product-orchestrator
theme_root: .
as_of: 2026-09-09
niche: lifestyle brands — fashion/beauty, mobile commerce
context: theme transitioning from Zest to Veloura (rebrand in progress); target niche lifestyle/fashion-beauty/mobile-first
mode: REFERENCE-REBUILD       # skill amended 2026-09-09: ineligible source -> concept reference only
verdict: IN_PROGRESS          # IN_PROGRESS | BLOCKED | READY_FOR_SUBMISSION
blockers: []                  # provenance findings below are handled by REFERENCE-REBUILD mode, not blocking
provenance_findings:
  - THIRD-PARTY (conf 0.99): theme is FoxEcom "Zest" v9.1.1 (commercial Theme Store theme, $330) rebranded to Veloura — Archive.zip's own settings_schema.json identity block, window.Foxtheme namespace, foxecom-bs-kit metafields in 4 live files, live Theme Store listing. Theme Store license covers store use, not rebrand+resubmission.
  - Dawn-derived core: 34/77 sections share Dawn v15.2 names, section groups, t:sections locale architecture, .github byte-identical to Shopify/dawn, main-product.liquid 886/1674 lines shared — ineligible per shopify.dev (verified 2026-09-09).
  - Licensing: assets/vendor.js bundles GPL-3.0 Flickity with missing vendor.js.LICENSE.txt; GSAP standard-license files bundled without terms.
rewrite_mandate: >
  REFERENCE-REBUILD mode (skill amended 2026-09-09): the current codebase is a concept reference ONLY. All of
  layout/, templates/, sections/, snippets/, assets/, config/, locales/, .github/ must be replaced with code
  built from Shopify's Skeleton Theme or fully original code (stages 7-9), then re-audited (G1 re-run) before
  stages 10-12. No file/line/asset carries over. Renaming/reformatting/refactoring the current codebase is
  explicitly forbidden as a fix.
orchestrator_notes: >
  2026-09-09 — Skill amended per user request "build a new theme from this theme": G1 for DAWN/HORIZON/
  THIRD-PARTY/MIXED now fails FORWARD into REFERENCE-REBUILD mode instead of stopping; UNVERIFIED still blocks.
  Resuming at stage 2 (feature inventory, concepts only, keep_implementation=false everywhere).
stages:
  source-audit:
    skill: theme-source-auditor
    status: passed             # pending | running | passed | blocked
    artifact: docs/source-audit.md
    notes: "Verdict THIRD-PARTY confidence 0.99 (2026-09-09). Zest v9.1.1 rebrand; Dawn v15.2-derived core; eligibility verified at shopify.dev/docs/storefronts/themes/store/requirements. REFERENCE-REBUILD mode entered; G1 re-run on new codebase required before readiness."
  feature-inventory:
    skill: theme-feature-analyst
    status: passed
    artifact: docs/feature-inventory.md
    notes: "86 features inventoried 2026-09-09: 27 CORE, 16 VALUABLE, 29 GENERIC, 3 REDESIGN, 6 REMOVE, 3 APP-LIKE, 2 RISKY. Reference-rebuild override honored: keep_implementation=false in all 86 blocks. Feeds stages 4-9."
  compliance:
    skill: shopify-theme-store-rules
    status: passed
    artifact: docs/compliance-matrix.md
    notes: "26/26 docs fetched 2026-09-09, all requirements dated+sourced, static audit PASS. 9 violations recorded vs current tree (shopify:// demo URLs, hard-coded demo video, bottom_menu default, 'Homepage' label, app-dependent embeds, GPL Flickity/GSAP licensing, preset-name collisions, no /listings, no release notes) — all routed to rebuild owners. Perf/a11y/browser rows pending reviewer reports. Touch targets corrected to 44x44 (best-practices doc supersedes 24x24)."
  commerce-thesis:
    skill: commerce-ux-architect
    status: passed
    artifact: docs/commerce-thesis.md
    notes: "Archetype derived: Moment -> Look -> Product -> Complete it (fashion x beauty hybrid, 2026-09-09). 7 decisions niche-justified; 4 journeys; page IA complete; platform capabilities verified vs shopify.dev. Artifacts: docs/commerce-thesis.md, docs/user-journeys.md, docs/page-information-architecture.md."
  design-system:
    skill: theme-art-director
    status: passed
    artifact: docs/design-system.md
    notes: "Design thesis: shoppable magazine spread — media-led, asymmetric 60/40, one-label cards, moment-mosaic nav, page-turn motion. 11 dimensions with tokens; token tables complete; palette contrast-verified (4.5:1+); shopify.dev reqs cited 2026-09-09. Pending G2 review (stage 6)."
  uniqueness-review-1:
    skill: theme-uniqueness-designer
    status: pending
    artifact: docs/uniqueness-matrix.md
    notes: ""
  liquid-architecture:
    skill: shopify-liquid-architect
    status: pending
    artifact: docs/theme-architecture.md
    notes: ""
  commerce-implementation:
    skill: shopify-commerce-engineer
    status: pending
    artifact: docs/commerce-implementation.md
    notes: ""
  editor-architecture:
    skill: theme-editor-architect
    status: pending
    artifact: docs/editor-architecture.md
    notes: ""
  performance:
    skill: theme-performance-engineer
    status: pending
    artifact: docs/performance-report.md
    notes: ""
  accessibility:
    skill: theme-accessibility-engineer
    status: pending
    artifact: docs/accessibility-report.md
    notes: ""
  qa:
    skill: theme-qa-reviewer
    status: pending
    artifact: docs/readiness-report.md
    notes: ""
  uniqueness-review-2:
    skill: theme-uniqueness-designer
    status: pending
    artifact: docs/uniqueness-matrix.md
    notes: ""
  readiness:
    skill: theme-qa-reviewer
    status: pending
    artifact: docs/readiness-report.md
    notes: ""
```
