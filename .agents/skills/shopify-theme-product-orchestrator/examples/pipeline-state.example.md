# Pipeline state — example (blocked at source audit)

Shows a realistic mid-run state and the blocking record format.

```yaml
pipeline: shopify-theme-product-orchestrator
theme_root: .
as_of: 2026-09-08
niche: beauty
verdict: BLOCKED
blockers:
  - "G1: source audit verdict = DAWN-DERIVED; theme ineligible for submission until rewritten from Skeleton or original code"
stages:
  source-audit:
    skill: theme-source-auditor
    status: blocked
    artifact: docs/source-audit.md
    notes: "DAWN fingerprints: dawn-specific schema ids in sections/, layout/theme.liquid asset references; Archive.zip contains stock Dawn assets. Rewrite mandate recorded; pipeline stopped."
  feature-inventory:
    skill: theme-feature-analyst
    status: pending
    artifact: docs/feature-inventory.md
    notes: ""
  # ... remaining stages pending ...
```
