# Accessibility Report — {{ theme name }}

- Theme: {{ theme name }} (version {{ version }})
- Date: {{ YYYY-MM-DD }}
- Auditor: theme-accessibility-engineer
- Theme root: {{ path }}
- Status: {{ Draft | Re-test pending | Complete }}

## 1. Verified requirements

| Requirement | Current value | Source URL | Verified on |
| --- | --- | --- | --- |
| Theme Store accessibility minimum (e.g. Lighthouse average) | {{ value }} | {{ url }} | {{ date }} |
| Required template list | {{ list }} | {{ url }} | {{ date }} |
| WCAG baseline | WCAG 2.2 AA | https://www.w3.org/TR/WCAG22/ | {{ date }} |

Note: thresholds change. The values above were fetched from the cited sources on the date shown, not assumed from memory.

## 2. Scope and method

- Templates audited: {{ home, product, collection, cart, page, blog, article, 404, search, password }}
- Tooling: {{ Lighthouse CLI/Chrome DevTools, axe-core, @axe-core/cli, browser DevTools }}
- Manual: full keyboard walkthrough per template, screen-reader spot checks (VoiceOver on macOS/Safari, NVDA on Windows/Firefox), 200% zoom check, reduced-motion check.
- Environment: {{ store preview URL, browser, OS }}

## 3. Results summary

| Template | Lighthouse a11y (before) | Lighthouse a11y (after) | Keyboard | Screen reader | Critical/High findings open |
| --- | --- | --- | --- | --- | --- |
| Home | | | | | |
| Product | | | | | |
| Collection | | | | | |
| Cart | | | | | |
| Page | | | | | |
| Blog | | | | | |
| Article | | | | | |
| 404 | | | | | |
| Search | | | | | |
| Password | | | | | |

Severity definitions: Critical — blocks a primary flow for keyboard or screen-reader users. High — significant WCAG failure on a common path. Medium — secondary-path failure or WCAG gap with a workaround. Low — polish and consistency.

## 4. Findings and fixes

### {{ ID-01 }} — {{ severity }} — {{ summary }}

- Location: {{ file, line or component }}
- WCAG: {{ criterion (e.g. 2.4.3 Focus Order) }}
- Finding: {{ what was observed, with evidence }}
- Fix: {{ what was changed and where }}
- Before: {{ evidence — score, repro steps, or snippet }}
- After: {{ evidence — re-test result }}

### {{ ID-02 }} — ...

## 5. Re-test results

{{ One paragraph per failed check re-run: which check, how it was re-run, the result. A fix is done only when the failing check passes on the real surface. }}

## 6. Remaining risks

| Risk | Affected surface | Why it remains | Owner |
| --- | --- | --- | --- |
| {{ e.g. third-party app embeds }} | {{ surface }} | {{ reason }} | {{ theme code / app vendor / merchant }} |

## 7. Hand-off to theme-qa-reviewer

Items deferred for final sign-off:

- {{ Verified requirements snapshot for the readiness verdict }}
- {{ Any fix that could not be re-tested on the real surface }}
- {{ Open Critical/High findings, if any, with reason }}

This report is the builder's evidence. The submission-readiness verdict belongs to theme-qa-reviewer.
