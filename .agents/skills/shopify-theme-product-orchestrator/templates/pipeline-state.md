# Pipeline state

Update after every stage. This file is the source of truth; the orchestrator resumes from it.

```yaml
pipeline: shopify-theme-product-orchestrator
theme_root: .
as_of: <YYYY-MM-DD>
niche: <merchant type / industry>
verdict: IN_PROGRESS            # IN_PROGRESS | BLOCKED | READY_FOR_SUBMISSION
blockers: []
stages:
  source-audit:
    skill: theme-source-auditor
    status: pending             # pending | running | passed | blocked
    artifact: docs/source-audit.md
    notes: ""
  feature-inventory:
    skill: theme-feature-analyst
    status: pending
    artifact: docs/feature-inventory.md
    notes: ""
  compliance:
    skill: shopify-theme-store-rules
    status: pending
    artifact: docs/compliance-matrix.md
    notes: ""
  commerce-thesis:
    skill: commerce-ux-architect
    status: pending
    artifacts: [docs/commerce-thesis.md, docs/user-journeys.md, docs/page-information-architecture.md]
    notes: ""
  design-system:
    skill: theme-art-director
    status: pending
    artifact: docs/design-system.md
    notes: ""
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
