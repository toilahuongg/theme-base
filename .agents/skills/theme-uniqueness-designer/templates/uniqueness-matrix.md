# Uniqueness Matrix

Fill in every field. Verdict scale is always PASS / WEAK / FAIL; no other grades. The golden rule applies to every row:

> "If the source theme could reproduce the new UX using normal theme settings plus modest CSS customization: FAIL."

## Review header

| Field | Value |
| --- | --- |
| Theme name |  |
| Source theme (name, version) |  |
| New theme (name, version) |  |
| Pipeline run | [ ] 1st (design-stage, after art direction and architecture) [ ] 2nd (code-stage, before submission) |
| Reviewer |  |
| Date |  |
| Shopify uniqueness requirement verified at | (URL fetched this run) |
| Inputs reviewed | (docs and code paths read, including `docs/source-audit.md`) |

## Core experience matrix

| # | Core experience | Source behavior (evidence) | New theme behavior (evidence) | Settings-reproduction result (which source settings cover it) | Structural difference? (axis + code evidence) | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Header |  |  |  |  |  |
| 2 | Navigation |  |  |  |  |  |
| 3 | Mega menu |  |  |  |  |  |
| 4 | Product card |  |  |  |  |  |
| 5 | Collection page |  |  |  |  |  |
| 6 | PDP |  |  |  |  |  |
| 7 | Cart |  |  |  |  |  |
| 8 | Search |  |  |  |  |  |
| 9 | Mobile nav |  |  |  |  |  |
| 10 | Media |  |  |  |  |  |

## Row evidence

For each row, record the detailed evidence behind the verdict. Repeat this block per row.

### Row N: <core experience> — <PASS | WEAK | FAIL>

- Source behavior (file:line): 
- New theme behavior (file:line): 
- Source settings that reproduce it (setting ids): 
- Edge cases forced (no menu/images, empty states, mobile, reduced motion): 
- Structural axis claimed and where it lives in code: 
- Verdict rationale: 

## Overall verdict

- Row count: PASS x / WEAK y / FAIL z
- Overall verdict: [ ] PASS [ ] WEAK [ ] FAIL
- Theme is a reskin: [ ] Yes [ ] No
- Structural differentiators that carry the theme (axis each, one line):
  1. 
  2. 
  3. 
- Verdict rationale:

## Required changes before re-review

For every FAIL and WEAK row. Format: row -> required structural change -> owning sibling -> evidence to check at re-review.

1. 
2. 
3. 

## Re-review delta (second run only)

- Changes verified in code since first run (file:line):
- Rows re-tested (schema / interaction / screenshot / edge-case) and new verdicts:
- Remaining blockers:

## Final statement

One sentence: is the new theme genuinely different from its source theme, or a reskin? Ground the answer in the row count and the structural differentiators above.
