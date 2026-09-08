# Design System Checklist — Completeness and Intentionality

Run this checklist against `docs/design-system.md` before handing off to theme-uniqueness-designer. Two kinds of checks: **completeness** (is the dimension decided at all?) and **intentionality** (is the decision real, specific, and defensible, or a disguised default?). A checkbox that fails intentionality means the decision must be reworked, not just reworded.

## Cross-cutting

- [ ] The merchant type or industry is stated explicitly in the first section, drawn from `docs/commerce-thesis.md`.
- [ ] The design thesis is one paragraph that could not apply to a different merchant type.
- [ ] Every dimension has a Decision, a Rationale, and concrete Tokens — no section is a paragraph of adjectives.
- [ ] The words "elegant," "modern," "premium," "clean," "sophisticated" appear only in quoted critiques, never as decisions.
- [ ] Every token table (type scale, spacing scale, color roles, radii, image ratios, motion specs) is filled with real values; no empty rows, no "TBD."
- [ ] Current Shopify requirements were fetched from shopify.dev during this run; the URLs are cited in the doc.
- [ ] The enforcement rule is stated: implementation consumes tokens only; new values require a new token, never an inline value.
- [ ] If the theme is Dawn-derived, each dimension notes what Dawn does and what this theme does instead where they differ.
- [ ] The doc names theme-uniqueness-designer as the next reviewer and theme-performance-engineer / theme-accessibility-engineer as later conflict sources.
- [ ] No emojis, no filler, no placeholder text.

## 1. Layout philosophy

- [ ] A single organizing idea is stated that every page obeys.
- [ ] It is testable: a reviewer can look at any template and say whether it follows the rule.
- [ ] It is not "clean and modern," not a default stacking of sections, not the mirrored hero pattern.

## 2. Grid

- [ ] Columns, gutter, container, and breakpoints are concrete values, not "standard."
- [ ] Any asymmetric or editorial split is defined with its condition and which side leads.
- [ ] A baseline alignment rule is stated (top, baseline, optical center).
- [ ] The grid choice is justified against the merchant type, not copied from a base theme.

## 3. Whitespace

- [ ] The spacing scale is a numbered series with a base unit and a mobile behavior.
- [ ] Standard section padding and the editorial-pause padding are distinct, named tokens.
- [ ] Density targets are explicit per surface (low on PDP and editorial, denser where allowed).
- [ ] Whitespace is used as a hierarchy tool: each quiet zone points at one loud element.

## 4. Image treatment

- [ ] Canonical ratios per surface are listed and consistent within each grid.
- [ ] Borders, frames, shadows, and scrims are decided with values (color, opacity).
- [ ] Hover behavior for images is specified (zoom amount, crossfade, or none).
- [ ] Retouching direction is one sentence a photographer could execute.

## 5. Typographic hierarchy

- [ ] Every type role has size, line-height, weight, case, and tracking — a complete scale, not a list of headings.
- [ ] Font families are justified against the niche; the merchant-selectable vs hard-coded split is stated.
- [ ] Body size and line length are decided (minimum 15px; measure 45-75 characters).
- [ ] Hierarchy is signaled by a deliberate combination, and no card tries to make title, price, and badge equally loud.

## 6. Product card identity

- [ ] Field order on a card is specified, including what is deliberately absent.
- [ ] The maximum badge count and allowed badge content are stated.
- [ ] Card ratio and hover behavior are stated and match the image-treatment tokens.
- [ ] Sale, sold-out, and preorder states are designed, not inherited.

## 7. Navigation visual language

- [ ] Header height, scroll behavior, and its surface change are specified.
- [ ] Menu weight (quiet vs loud) and the active-page state are decided.
- [ ] Mega menu presence/absence is a decision with a stated replacement.
- [ ] The mobile menu is designed at its own scale (drawer or full-screen with its own type roles).

## 8. Motion language

- [ ] Duration and easing tokens are named values, not "smooth."
- [ ] A move/no-move list exists: what animates, what never animates.
- [ ] Scroll-triggered animation is defined with distance, fade, and trigger rule.
- [ ] `prefers-reduced-motion: reduce` behavior is specified (off, or opacity only).
- [ ] No bounce/spring/elastic easings unless the niche genuinely calls for playfulness — and then it is stated.

## 9. Editorial treatment

- [ ] Editorial interruptions inside commerce flows are placed and styled explicitly.
- [ ] The editorial voice (oversized statements, pull quotes, numbered sections, captions) is specified.
- [ ] Editorial metadata uses a defined type role, not body text with a border.
- [ ] Editorial surfaces are distinct from product-card surfaces, or the shared grammar is intentional and stated.

## 10. Iconography

- [ ] Stroke weight, grid, and corner style are named values.
- [ ] The allowed glyph list exists; anything not on it is rejected.
- [ ] Icon loading and accessible labeling strategy are decided.
- [ ] No emoji or system glyphs stand in for icons; no mixed stroke styles.

## 11. Responsive visual behavior

- [ ] Type and spacing scales have explicit mobile values (clamp ranges or scaled series).
- [ ] Grid collapses are decided per breakpoint (4-up to 2-up to 2-up, editorial split to stacked), not accidental.
- [ ] Components that get redesigned at mobile are named (menu, header, PDP media).
- [ ] Touch targets and hero/header overlap at small widths are checked.

## Handoff gate

- [ ] All 11 dimensions pass completeness and intentionality above.
- [ ] Token tables are internally consistent (example: the card ratio in dimension 6 matches the image ratio in dimension 4; motion tokens in dimension 8 match the hover rules in dimensions 4 and 6).
- [ ] The doc is committed to the theme root as `docs/design-system.md`.
- [ ] theme-uniqueness-designer has been told the doc is ready for its first-pass review.
