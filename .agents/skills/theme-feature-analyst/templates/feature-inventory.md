# Feature Inventory — Template

Fill one YAML block per feature. Copy this file to `<theme-root>/docs/feature-inventory.md` and complete it. Do not change the field names; do not omit `class`, `keep_concept`, or `keep_implementation`. The worked examples in examples/feature-inventory.example.md show a fully filled inventory.

---

# Feature Inventory

| | |
|---|---|
| Theme (source): | <theme name and version, e.g. "Dawn 15.0.0 (forked)"> |
| Theme root: | <absolute path> |
| Analyst date: | <YYYY-MM-DD> |
| Product spec consulted: | <spec name / link, if any> |
| Detector run: | <command used: node scripts/detect-features.mjs <root>> |

## Classification legend

- CORE — must keep (load-bearing). keep_concept: true, keep_implementation: true
- VALUABLE — keep concept, rebuild implementation. keep_concept: true, keep_implementation: false
- GENERIC — standard feature, rebuild per new architecture. keep_concept: true, keep_implementation: false
- REDESIGN — concept worth keeping, needs new UX. keep_concept: true, keep_implementation: false
- REMOVE — no value. keep_concept: false, keep_implementation: false
- APP-LIKE — belongs in an app, not a theme. keep_concept: false, keep_implementation: false
- RISKY — licensing/performance/a11y risk. keep_concept: judgment, keep_implementation: false

## Inventory

```yaml
features:
  - id: <snake_case_id>
    name: <Human-Readable Name>
    class: <CORE|VALUABLE|GENERIC|REDESIGN|REMOVE|APP-LIKE|RISKY>
    keep_concept: <true|false>
    keep_implementation: <true|false>
    files:
      - <path relative to theme root>
    settings: [<setting ids, or []>]
    templates: [<template names, or []>]
    rationale: >
      <1-2 sentences. For APP-LIKE and RISKY: name the specific app boundary
      or the specific risk. For dead code: state that nothing renders it.>

  - id: <snake_case_id>
    name: <Human-Readable Name>
    class: <CORE|VALUABLE|GENERIC|REDESIGN|REMOVE|APP-LIKE|RISKY>
    keep_concept: <true|false>
    keep_implementation: <true|false>
    files:
      - <path relative to theme root>
    settings: [<setting ids, or []>]
    templates: [<template names, or []>]
    rationale: >
      <1-2 sentences.>

  # Repeat for every feature. One block per feature, no duplicates.
  # Split multi-feature files (e.g. header = nav + search + announcement bar)
  # into separate blocks. Merge features that span files (quick add in
  # product-card + product-form + cart-drawer) into a single block.
```

## Handoff note

- [ ] Every feature found by the scan appears in this file exactly once.
- [ ] Every block has both booleans set.
- [ ] Inventory path reported to shopify-theme-product-orchestrator for stage 3+ (commerce-ux-architect, shopify-liquid-architect).
