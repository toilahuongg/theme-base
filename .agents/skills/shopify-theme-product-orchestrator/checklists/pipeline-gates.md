# Pipeline gate checklist

Run after each stage completes. Do not rely on the stage skill's self-assessment; verify the artifact.

## G1 — Source audit (stage 1)

- [ ] docs/source-audit.md exists with all six sections: provenance, third-party deps, high-risk files, safe concepts, must-rewrite code, licensing risks.
- [ ] Verdict is ORIGINAL or SKELETON.
- [ ] If DAWN/HORIZON/THIRD-PARTY/MIXED/UNVERIFIED: pipeline marked BLOCKED, rewrite mandate recorded, no later stage started.

## G2 — Uniqueness review #1 (stage 6)

- [ ] docs/uniqueness-matrix.md covers header, navigation, mega menu, product card, collection, PDP, cart, search, mobile nav, media.
- [ ] Zero FAIL rows.
- [ ] WEAK rows carry concrete remediation plans.
- [ ] No row passes solely on font/color/radius/spacing/animation/gradient evidence (golden rule: source settings + modest CSS must not reproduce the new UX).

## G3 — Compliance (stage 3)

- [ ] docs/compliance-matrix.md exists with as-of date and source URL per requirement area.
- [ ] Performance and accessibility thresholds verified against current docs (not memory).
- [ ] No "unverified" area remains.

## G4 — Performance / accessibility (stage 10)

- [ ] docs/performance-report.md has baseline, findings, fixes, final numbers.
- [ ] Final numbers >= internal targets (not just >= minimum).
- [ ] docs/accessibility-report.md shows fixes applied and re-test results.

## G5 — Uniqueness review #2 (stage 11)

- [ ] Updated docs/uniqueness-matrix.md against the implemented theme.
- [ ] Zero FAIL rows.

## G6 — Readiness (stage 12)

- [ ] docs/readiness-report.md verdict block present:
      status: READY
      ready_for_submission: true
- [ ] Zero blockers.
- [ ] Theme Check green (no errors in output).
- [ ] Lighthouse minimums met on home/product/collection, desktop + mobile.
- [ ] Accessibility minimums met.
- [ ] docs/pipeline-state.md records every stage passed with artifact paths.
