# Design System — {{theme_name}}

> Art direction artifact produced by theme-art-director. Fill every section with a decision, a rationale, and concrete tokens. Delete this blockquote and all bracketed instructions before committing. If a section ends with "default" or an adjective instead of a decision, it is not done.

- **Merchant type / industry:** [one explicit sentence, e.g. "clinical skincare sold direct-to-consumer"]
- **Brand posture:** [one sentence on the brand voice the design must carry]
- **Design thesis:** [one paragraph stating the organizing idea; must be testable against any template]
- **Source of truth:** [the docs read: docs/commerce-thesis.md, docs/user-journeys.md, docs/page-information-architecture.md]
- **Generated:** {{generated_date}}
- **Status:** Draft — pending theme-uniqueness-designer first-pass review

## Requirements verified

[Fetch the current Theme Store review guidelines and theme quality standards from shopify.dev during this run. Cite URLs and the specific requirements that touch visual design, art direction, or merchant-type targeting. Never rely on memorized thresholds.]

## 1. Layout philosophy

- **Decision:** [one sentence every page obeys]
- **Rationale:** [why this fits the merchant type]
- **Tokens / examples:** [the one rule, e.g. "media always leads; text annotates"]

## 2. Grid

- **Decision:** [columns, gutter, container, breakpoints]
- **Rationale:** [why this grid serves the layout philosophy]
- **Tokens:**
  - Container max: [value]
  - Columns: [desktop / tablet / mobile]
  - Gutter: [desktop / mobile]
  - Editorial split: [split ratio, when allowed, which side leads]

## 3. Whitespace

- **Decision:** [density budget per surface]
- **Rationale:** [why this density]
- **Tokens:** spacing scale below; section padding: [standard / editorial pause]

## 4. Image treatment

- **Decision:** [ratios, frames, scrims, retouching direction]
- **Rationale:** [why this treatment]
- **Tokens:** ratios below; hover: [zoom / crossfade / none]

## 5. Typographic hierarchy

- **Decision:** [roles, family pairing, hierarchy signal]
- **Rationale:** [why this type voice]
- **Tokens:** type scale below; measure: [value]; merchant-selectable vs hard-coded fonts: [decision]

## 6. Product card identity

- **Decision:** [field order, density, badges]
- **Rationale:** [why the card says what it says]
- **Tokens:** card ratio: [value]; field order: [list]; max badges: [number]; allowed badge content: [list]; hover: [behavior]

## 7. Navigation visual language

- **Decision:** [header, menu weight, wayfinding]
- **Rationale:** [why navigation reads this way]
- **Tokens:** header height: [value]; scroll behavior: [transparent/solid + surface]; active state: [style]; mega menu: [yes/no + grammar or replacement]

## 8. Motion language

- **Decision:** [durations, easings, move/no-move]
- **Rationale:** [why motion behaves this way]
- **Tokens:** motion specs below; reduced-motion: [all off / opacity only]

## 9. Editorial treatment

- **Decision:** [how content surfaces interrupt commerce]
- **Rationale:** [why this editorial voice]
- **Tokens:** interstitial placement: [where]; editorial voice: [statements / pull quotes / numbered sections]; metadata role: [type role]

## 10. Iconography

- **Decision:** [stroke, grid, allowed glyphs]
- **Rationale:** [why this icon voice]
- **Tokens:** stroke: [value]; grid: [value]; corners: [sharp / rounded / mixed]; allowed glyphs: [list]; loading: [SVG sprite / inline]; labeling: [strategy]

## 11. Responsive visual behavior

- **Decision:** [what changes at each breakpoint, deliberately]
- **Rationale:** [why these changes]
- **Tokens:** type clamps: [ranges per role]; spacing on mobile: [scale behavior]; grid collapse: [per breakpoint]; redesigned components: [list]

---

# Token Tables

## Type scale

| Role | Size | Line-height | Weight | Case / tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | [value] | [value] | [value] | [case / tracking] | [where used] |
| Heading 1 | [value] | [value] | [value] | [case / tracking] | [where used] |
| Heading 2 | [value] | [value] | [value] | [case / tracking] | [where used] |
| Heading 3 | [value] | [value] | [value] | [case / tracking] | [where used] |
| Body | [value] | [value] | [value] | [case / tracking] | [where used] |
| Meta | [value] | [value] | [value] | [case / tracking] | [where used] |
| Eyebrow | [value] | [value] | [value] | [case / tracking] | [where used] |

## Spacing scale

| Token | Value | Typical use |
| --- | --- | --- |
| space-1 | [value] | [use] |
| space-2 | [value] | [use] |
| space-3 | [value] | [use] |
| space-4 | [value] | [use] |
| space-5 | [value] | [use] |
| space-6 | [value] | [use] |
| space-7 | [value] | [use] |
| space-8 | [value] | [use] |

## Color role system

| Token | Value | Usage | Contrast vs surface (if text) |
| --- | --- | --- | --- |
| color-surface | [value] | [use] | — |
| color-surface-alt | [value] | [use] | — |
| color-surface-inverse | [value] | [use] | — |
| color-ink | [value] | [use] | [ratio] |
| color-ink-muted | [value] | [use] | [ratio] |
| color-line | [value] | [use] | — |
| color-accent | [value] | [use] | [ratio] |
| color-accent-soft | [value] | [use] | — |
| color-error | [value] | [use] | [ratio] |
| color-success | [value] | [use] | [ratio] |

## Radii

| Token | Value | Usage |
| --- | --- | --- |
| radius-none | [value] | [use] |
| radius-sm | [value] | [use] |
| radius-full | [value] | [use] |

## Image ratios

| Surface | Ratio | Notes |
| --- | --- | --- |
| Hero | [value] | [notes] |
| Product / PDP media | [value] | [notes] |
| Collection card | [value] | [notes] |
| Editorial interstitial | [value] | [notes] |
| Blog / article hero | [value] | [notes] |

## Motion specs

| Token | Duration | Easing | Usage |
| --- | --- | --- | --- |
| motion-micro | [value] | [value] | [use] |
| motion-standard | [value] | [value] | [use] |
| motion-editorial | [value] | [value] | [use] |
| motion-zoom | [value] | [value] | [use] |

# Enforcement

- Every value in `sections/`, `snippets/`, `assets/`, and `layout/` comes from a token above. No arbitrary values, no one-off hex codes, no magic numbers.
- New values require a new token added to this doc first, then mirrored into theme settings / CSS custom properties during implementation.
- [If Dawn-derived: state the per-dimension differences and the rule that residual Dawn styling is a uniqueness defect.]

# Review handoff

- Next reviewer: theme-uniqueness-designer (first pass now, second pass before submission).
- Later conflict sources: theme-performance-engineer (docs/performance-report.md), theme-accessibility-engineer (docs/accessibility-report.md). Resolve conflicts in writing in this doc.
