# Compliance Matrix

Fillable template. Copy to `<theme-root>/docs/compliance-matrix.md` and complete every cell. Every standard MUST be verified against a freshly fetched shopify.dev document on the run date — never fill from memory or from a previous matrix. If a fetch failed, write `unverified - fetch failed (retried)` in the standard column and note it in the footer.

## Header

- Theme name: ____
- Run date: ____
- Requirements as-of date (date docs were fetched): ____
- Fetch status: ____ of ____ URLs fetched; failed URLs: ____
- Fetch script version: ____

## Matrix

| Requirement area | Current standard (verified) | Source URL | As-of | Checked where |
| --- | --- | --- | --- | --- |
| Submission rules |  |  |  |  |
| Architecture (OS 2.0) |  |  |  |  |
| Required templates |  |  |  |  |
| Sections everywhere |  |  |  |  |
| Blocks (main product section) |  |  |  |  |
| App blocks |  |  |  |  |
| Custom Liquid section and blocks |  |  |  |  |
| Assets (Sass, minification, hosting) |  |  |  |  |
| URL and link rules |  |  |  |  |
| Browser support (desktop) |  |  |  |  |
| Browser support (mobile and webviews) |  |  |  |  |
| Performance minimum |  |  |  |  |
| Accessibility minimum |  |  |  |  |
| Accessibility static rules |  |  |  |  |
| Settings and terminology |  |  |  |  |
| Fonts and colors |  |  |  |  |
| SEO and social media |  |  |  |  |
| Demo store rules |  |  |  |  |
| Documentation and support |  |  |  |  |

Add rows for any additional requirement area the fetched documents reveal.

## Known current thresholds — MAY BE STALE, VERIFY

These are the last-known Theme Store thresholds and must be checked against the fetched requirements doc. If the fetched doc disagrees, the doc wins and the corrected value goes in the matrix above with its source.

| Threshold | Last-known value | Verified this run? |
| --- | --- | --- |
| Lighthouse performance minimum | average >= 60 across home, product, collection; desktop + mobile | [ ] |
| Lighthouse accessibility minimum | average >= 90 across home, product, collection; desktop + mobile | [ ] |
| Test dataset | Shopify benchmark dataset; sections must contain real images and content | [ ] |
| Touch targets | >= 24 x 24 CSS pixels for pointer inputs | [ ] |
| Text contrast | 4.5:1 body; 3:1 large text (over 18pt) and non-text elements | [ ] |

## Exceptions and notes

Document any deliberate deviation from a requirement: what deviates, why, who signed off, and what the fetched source says.

| Deviation | Requirement it touches | Reason and sign-off |
| --- | --- | --- |
|  |  |  |

## Verification footer

- Verified by static check (this run): list the checklist areas completed.
- Pending reviewer reports (theme-performance-engineer / theme-accessibility-engineer): list the rows waiting on docs/performance-report.md and docs/accessibility-report.md.
- Open items handed to theme-qa-reviewer for the final readiness verdict: list them.
