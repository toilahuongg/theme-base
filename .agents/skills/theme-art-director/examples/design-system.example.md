# Design System — Aestra Clinical Skincare (Example)

> Illustrative example produced by theme-art-director for the "clinical editorial beauty" niche. It shows the level of concreteness required: every dimension is a decision with rationale and tokens that are internally consistent. Aestra is a fictional brand; every real theme must produce its own decisions from its own merchant brief. Do not copy these tokens into another theme.

- **Merchant type / industry:** clinical skincare sold direct-to-consumer by a dermatology-led brand.
- **Brand posture:** precise, evidence-led, calm; the brand talks like a treatment dossier, not a beauty ad.
- **Design thesis:** pages read like clinical editorial — image-first, text as annotation, whitespace as the brand's primary texture. The shop is quiet so the product and its clinical claims are loud.
- **Source of truth:** docs/commerce-thesis.md, docs/user-journeys.md, docs/page-information-architecture.md.
- **Generated:** 2026-09-08
- **Status:** Draft — pending theme-uniqueness-designer first-pass review

## Requirements verified

Theme Store review guidelines and theme quality standards fetched from shopify.dev during this run; URLs cited in the working session notes. The requirement driving this doc: themes must demonstrate intentional visual design and art direction targeting a clear merchant type or industry.

## 1. Layout philosophy

- **Decision:** every page opens with media and treats all text as annotation; nothing is centered.
- **Rationale:** clinical editorial — the product is the evidence, type is the case notes. Centering signals brochure, not dossier.
- **Tokens / examples:** media always leads (hero, PDP, editorial interstitials); text blocks left-aligned, never centered; page-level rule "no symmetry between text and image columns."

## 2. Grid

- **Decision:** 12-column desktop grid with an asymmetric 40/60 editorial split reserved for feature surfaces; 6-column tablet; 4-column mobile.
- **Rationale:** the asymmetric split forces the media-led reading order and prevents the mirrored hero pattern.
- **Tokens:**
  - Container max: 1400px
  - Columns: 12 / 6 / 4
  - Gutter: 24px desktop, 16px mobile
  - Editorial split: 40/60 media/text, media leads; allowed only on feature sections (lookbook, journal, collection intro), never on product grids

## 3. Whitespace

- **Decision:** low density everywhere; PDP and editorial surfaces get the largest padding, grids slightly tighter; whitespace always points at one loud element.
- **Rationale:** the brand's primary texture is air; density is reserved for product grids where comparison matters.
- **Tokens:** spacing scale below; section padding 96px desktop / 56px mobile; editorial pause 160px desktop / 96px mobile; product grid gap 24px.

## 4. Image treatment

- **Decision:** clinical and clean — no borders, no shadows, no overlays on product media; editorial images carry a 0.9 opacity scrim only when a statement sits on them.
- **Rationale:** the product must read as clinical evidence: flat, honest, uncropped-feeling. Any frame or shadow adds decoration the niche rejects.
- **Tokens:** ratios below; hover: product cards crossfade to a second image (no movement); editorial and hero images scale 1.00 to 1.03 over 600ms; retouching direction: true-to-tone, no beauty retouch on texture.

## 5. Typographic hierarchy

- **Decision:** one grotesque family (merchant-selectable via theme font settings), weights 300-500 only, hierarchy signaled by size and weight, never by color except for links.
- **Rationale:** a single clinical grotesque reads as laboratory labeling; the 300-weight display gives scale without shout; two families would add editorial warmth the niche does not want.
- **Tokens:** type scale below; measure 62 characters; body never below 15px; the hard-coded display weight (300) is the only font asset shipped; everything else merchant-selectable.

## 6. Product card identity

- **Decision:** card = image, then eyebrow (category), then title, then price — in that order, nothing else; one badge maximum; hover crossfades to the second image.
- **Rationale:** the product name is the loudest text on the card; price is quiet because the brand sells on claims, not discounts.
- **Tokens:** card ratio 3:4; field order image, eyebrow, title, price; max badges 1; allowed badge content "New" or "Clinical"; badge style: 0 radius, 1px ink border, 10px uppercase; hover: 400ms crossfade, no scale, no underline.

## 7. Navigation visual language

- **Decision:** a 64px header, transparent over the hero, switching to surface with a 1px hairline bottom border after 8px of scroll; links are eyebrow-scale (quiet); the current collection gets a 1px accent underline.
- **Rationale:** quiet wayfinding keeps the media-led pages intact; the hairline-on-scroll preserves the clinical grid without blur or shadow.
- **Tokens:** header height 64px; scroll surface color-surface + 1px color-line; link style eyebrow; active state 1px underline in color-accent; mega menu: none — collections listed flat, one level; mobile: full-screen drawer on color-surface, links at H2 scale, 44px touch targets.

## 8. Motion language

- **Decision:** motion is slow and single-purpose: reveals fade up 8px once per viewport, images may zoom 3%, everything else is static; no bounce, no parallax, no marquee.
- **Rationale:** clinical calm; any playful easing breaks the dossier posture.
- **Tokens:** motion specs below; move list: hero image zoom (600ms on load), reveal-on-scroll (opacity + 8px rise, 400ms, once), header surface switch (160ms), drawer slide (240ms); never moves: text blocks, prices, cards, badges; reduced-motion: all transforms and zooms off, opacity-only transitions remain.

## 9. Editorial treatment

- **Decision:** full-bleed editorial interstitials interrupt collection grids every 8 products; journal and lookbook use oversized display statements, numbered sections, and meta captions.
- **Rationale:** the interruptions give the grid a narrated rhythm — the shop talks to you between products instead of just listing them.
- **Tokens:** interstitial placement: after every 8th product in collections, full-bleed, 21:9 desktop / 4:5 mobile; editorial voice: display-type statements (64px 300), pull quotes in Display italic 28px with a 1px color-accent left rule, numbered sections "01 / Formula" in eyebrow; metadata captions in Meta role; editorial images are the only images allowed the 0.9 scrim.

## 10. Iconography

- **Decision:** 1.5px stroke line icons on a 24px grid with square joins; allowed glyphs only; no filled icons, no emoji, no star ratings.
- **Rationale:** hairline strokes match the type weight and the clinical grid; ratings are excluded because the brand sells on clinical claims, not stars.
- **Tokens:** stroke 1.5px; grid 24px; joins square; allowed glyphs: cart, search, menu, close, chevron-down, chevron-right, arrow-right, plus, minus, check; loading: inline SVG in snippets so stroke inherits currentColor; labeling: aria-hidden with visually hidden text on interactive icons.

## 11. Responsive visual behavior

- **Decision:** deliberate redesigns, not rescales: type clamps down, section padding halves, the editorial split stacks to full-bleed media with text below, and the header becomes a drawer under 768px.
- **Rationale:** mobile readers get the same dossier, re-paginated for one hand.
- **Tokens:** type clamps: Display clamp(40px, 6vw, 64px), H1 clamp(28px, 4.5vw, 40px); spacing: 96px to 56px section padding below 768px, editorial pause 160px to 96px; grid collapse: 4-up to 2-up to 2-up; redesigned components: navigation (drawer), hero (stacked, media first), PDP media (stays single-column at every size); touch targets min 44px.

---

# Token Tables

## Type scale

| Role | Size | Line-height | Weight | Case / tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | 64px (clamp 40-64) | 0.95 | 300 | normal / -1.5% | hero statements, editorial interstitials |
| Heading 1 | 40px (clamp 28-40) | 1.05 | 400 | normal / -1% | page titles, PDP title |
| Heading 2 | 28px | 1.1 | 400 | normal / -0.5% | section titles, journal titles |
| Heading 3 | 20px | 1.2 | 500 | normal / 0 | card titles, form labels |
| Body | 15px | 1.6 | 400 | normal / 0 | paragraphs, descriptions |
| Meta | 12px | 1.5 | 400 | normal / 0 | prices, dates, captions, SKU |
| Eyebrow | 11px | 1.4 | 500 | uppercase / 0.14em | navigation, category labels, badges |

## Spacing scale

| Token | Value | Typical use |
| --- | --- | --- |
| space-1 | 4px | icon-to-label gap |
| space-2 | 8px | badge to title gap |
| space-3 | 12px | eyebrow to title gap |
| space-4 | 16px | card text block gap |
| space-5 | 24px | grid gutters, card gaps |
| space-6 | 32px | form field stacks |
| space-7 | 48px | section internal rhythm |
| space-8 | 96px (56px mobile) | section padding |

## Color role system

| Token | Value | Usage | Contrast vs surface (if text) |
| --- | --- | --- | --- |
| color-surface | #F5F3EE | page background, drawers | — |
| color-surface-alt | #ECE9E1 | alternating blocks, table rows | — |
| color-surface-inverse | #141210 | dark editorial interstitials | — |
| color-ink | #1A1815 | body text, headings | 12.8:1 |
| color-ink-muted | #6B655C | meta, captions, prices | 5.2:1 |
| color-line | #D8D3C9 | hairlines, dividers, input borders | — |
| color-accent | #4A6B5D | active nav, links, pull-quote rule | 4.6:1 (large/active text only) |
| color-accent-soft | #E4EBE6 | accent tint backgrounds | — |
| color-error | #A33B2E | form validation | 4.9:1 |
| color-success | #3E6B4F | confirmation states | 4.7:1 |

All text tokens verified against WCAG AA during implementation by theme-accessibility-engineer; values above measured on color-surface.

## Radii

| Token | Value | Usage |
| --- | --- | --- |
| radius-none | 0 | cards, images, badges, buttons (default) |
| radius-sm | 2px | inputs, quantity steppers |
| radius-full | not used | deliberate: no pills, no circular elements |

## Image ratios

| Surface | Ratio | Notes |
| --- | --- | --- |
| Hero | 3:2 | full-bleed, media leads |
| Product / PDP media | 3:4 | single-column stream, no thumbnail grid |
| Collection card | 3:4 | consistent with PDP media |
| Editorial interstitial | 21:9 (4:5 mobile) | full-bleed, every 8 products |
| Blog / article hero | 16:9 | journal entries |

## Motion specs

| Token | Duration | Easing | Usage |
| --- | --- | --- | --- |
| motion-micro | 160ms | cubic-bezier(0.22, 0.61, 0.36, 1) | header surface switch, icon states |
| motion-standard | 240ms | cubic-bezier(0.22, 0.61, 0.36, 1) | drawer slide, form focus |
| motion-editorial | 400ms | cubic-bezier(0.22, 0.61, 0.36, 1) | reveals, card crossfade, scrim |
| motion-zoom | 600ms | cubic-bezier(0.22, 0.61, 0.36, 1) | hero and editorial image scale 1.00-1.03 |

# Enforcement

- Every value in `sections/`, `snippets/`, `assets/`, and `layout/` comes from a token above. No arbitrary values, no one-off hex codes, no magic numbers.
- New values require a new token added to this doc first, then mirrored into theme settings (config/settings_schema.json color and typography settings) and CSS custom properties in assets/base.css during implementation.
- Dawn-derived: Dawn's defaults (24px gutters with mirrored hero sections, default gradient scrim, bold card titles, pill buttons, badge stacks) are rejected wherever they appear; this theme uses the asymmetric split, 3:4 media, 300-weight display, 0 radius, hairline borders, and the single-badge rule above.

# Review handoff

- Next reviewer: theme-uniqueness-designer (first pass now, second pass before submission).
- Later conflict sources: theme-performance-engineer (docs/performance-report.md), theme-accessibility-engineer (docs/accessibility-report.md). Resolve conflicts in writing in this doc.
