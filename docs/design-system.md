# Design System — Veloura

> Art direction artifact produced by theme-art-director. Every dimension carries a decision, a rationale tied to the merchant type, and concrete tokens. Nothing here is a default: if a section ended with an adjective instead of a decision, it would not be done.

- **Merchant type / industry:** mid-premium fashion-and-beauty lifestyle brands (clothing, accessories, skincare) sold direct-to-consumer, mobile commerce first, to the style + skincare "mood" shopper.
- **Brand posture:** a considered lifestyle publication that sells — warm, body-honest ("real bodies and honest fit"), ingredient-transparent, aspirational without distance; the voice of a personal stylist-editor who speaks the shopper's moments ("Wedding Guest", "Weekend", "Glow", "Calm my redness"), never the merchant's category chart.
- **Design thesis:** every page is a shoppable magazine spread — oversized portrait photography leads each surface at full bleed, type annotates in one narrow column that never competes with media, compositions are deliberately off-center (nothing is centered), and every editorial moment resolves into a styled, shoppable look (Moment → Look → Product → Complete it). Testable against any template: (1) the largest element on any page is media, not type; (2) no block of text is ever centered; (3) no surface carries more than one quiet label; (4) every image-led surface resolves to a purchase path in at most two taps.
- **Source of truth:** docs/commerce-thesis.md (archetype Moment → Look → Product → Complete it; 7 shopping-model decisions), docs/user-journeys.md (four journeys: occasion shopper, ingredient researcher, restock customer, gift giver), docs/page-information-architecture.md (block order per template), docs/feature-inventory.md (keep_concept concepts available to the rebuild), docs/source-audit.md (Dawn-derived + third-party context — Dawn's look is an audit finding, never a baseline).
- **Generated:** 2026-09-09
- **Status:** Draft — pending theme-uniqueness-designer first-pass review

## Requirements verified

Fetched 2026-09-09 from shopify.dev (mutable — re-verify before submission; never treat these as permanent):

- **https://shopify.dev/docs/storefronts/themes/store/requirements** (fetched 2026-09-09) — the Theme Store requirements that directly shape this design system:
  - §2 Uniqueness: themes must be "fundamentally different," identity "must not be easily reproducible… by adjusting settings, superficial styling, or adding a few sections"; "use an inventive art direction that distinguishes the theme, with clear systems for header and navigation, product cards, media treatments, and page structure"; "cosmetic or additive alterations are insufficient" (spacing tweaks, color/typography swaps, gradients, blurs, animation tweaks are explicitly called out); uniqueness must be "embedded at the architectural level." Also: Skeleton Theme is the only approved codebase; Dawn/Horizon-derived submissions are ineligible (conforms to docs/source-audit.md).
  - §3 Visual design and art direction: unique and intentional design that "clearly targets a specific merchant type or industry"; professional-quality visuals; "simple, complementary color palette" that doesn't clash or reduce readability. Layout: logical grid, deliberate spacing, clear content hierarchy by size/color/contrast/position, flexible layouts that stay intentional with varying content length. Consistency: no over-abundance of fonts, consistent pairing everywhere, consistent interaction design. Merchant-first theme editor.
  - §6 Lighthouse: minimum average 60 performance / 90 accessibility across product, collection, home, desktop and mobile — the design's image-first, low-density choices must be paid for with responsive images and zero gratuitous motion.
  - §8 Consistency and functionality: "themes must not mislead or deceive… fake urgency and scarcity tactics like fictitious countdown timers, stock levels, or viewer activity counts" — this design system's restraint rule (no urgency animation, no stock stamps) is compliance-aligned by construction.
  - §9 Mobile responsiveness: themes must be mobile responsive; webview support (Instagram, Facebook, Pinterest) — the full-bleed, thumb-reach surfaces are built for these shells.
  - §12 Accessibility: 4.5:1 contrast for body text, 3:1 for large text and non-text (icons, borders), keyboard access incl. dropdowns, visible focus, alt attributes, h1–h6 visually different, touch targets ≥24px (this system enforces ≥44px per compliance-matrix). The palette table below lists computed ratios.
  - §15 Font picker: fonts must use `font_picker` settings with a default from currently available fonts; load bold/italic/bold-italic variants via `font_modify`; custom fonts aren't accepted.
  - §16 Color system: minimum 4 colors; every background color setting must include a corresponding foreground setting; settings use `type: color`.
  - §17 Responsive images: responsive image strategy; images load only as needed (supports the large-media, lazy-load-first treatment).
  - §20 Demo stores: authentic content, no Lorem Ipsum; "don't use embedded text or buttons in images, except… infographics, badges" — the no-baked-in-text image rule below is a compliance requirement, not a preference.
- **https://shopify.dev/docs/storefronts/themes/best-practices/design** (fetched 2026-09-09) — purposeful design ("build a strong, opinionated theme art direction and make sure you balance those design decisions with ecommerce best practices"; inspiration-led flows for fashion), antifragile components ("product cards should look clean and cohesive, even with inconsistent product images"), cohesive and efficient customer experience (mobile-first, standard well-established iconography, reduced steps to purchase).
- **https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts** (fetched 2026-09-09) — available font library confirms both families below as `font_picker`-selectable: Cormorant Garamond (`cormorant_n6` etc.) and Work Sans (`work_sans_n4` etc.). Fonts used in defaults must be on this list; the two chosen families are.

## 1. Layout philosophy

- **Decision:** "Media leads; type annotates; nothing is centered" — every template opens with a full-bleed portrait image moment, every text block sits in one annotation column never wider than 40% of its surface, and no block of text is ever centered.
- **Rationale:** the archetype's first hop is the Moment — the shopper arrives wanting to belong to a look or solve a skin goal, so the first thing she must see is a styled person or scene, not a headline. Type's job is to name the moment and point at the buy. A magazine spread (the dominant gesture) narrates rather than inventories; asymmetry signals curation and editorial authorship, while symmetric "image left, text right" mirrors are the template-default look the uniqueness standard (§2) explicitly rejects. The emotional job splits by surface: narrate on home/look/editorial, reassure on the PDP, inventory with rhythm on collections.
- **Tokens / examples:** rule — media occupies ≥60% of any hero or split surface; the text annotation column is capped at 40%; one action maximum per annotation block; no centered text anywhere (logo mark and single-word art are exempt; body copy, headings, and CTAs are not). Dawn contrast: Dawn's home is stacked symmetric sections — centered rich-text blocks and 50/50 alternating image-with-text variants. This theme replaces both with full-bleed media and 60/40 asymmetric splits; the mirrored-template pattern is banned.

## 2. Grid

- **Decision:** a 12-column structural grid at a 1440px container, with a mandatory 60/40 editorial split (media always on the wide side) for every media-plus-text pair; gutters 24px desktop / 16px mobile; breakpoints 1024 and 750.
- **Rationale:** a symmetric structural grid keeps the catalog surfaces (collections, search, cart, account) orderly and predictable, while the 60/40 split gives every storytelling surface the asymmetric editorial spine the layout philosophy demands — the grid is the spine, the split is the voice, and the two never conflict.
- **Tokens:**
  - Container max: 1440px; page margins `clamp(16px, 4vw, 48px)` (token: `page-margin`)
  - Columns: 12 (desktop ≥1024) / 8 (tablet 750–1023) / 4 (mobile <750)
  - Gutter: 24px desktop / 16px mobile (tokens `gap-grid-desktop`, `gap-grid-mobile`)
  - Editorial split: 60/40, media 60 — never 50/50; allowed on home feature blocks, look/routine heroes, collection editorial strips, PDP story and validation blocks, article features; the text side leads only when it is the *narrower* side, never the wider
  - Baseline alignment: top-aligned; contained sections obey the spine; full-bleed sections (heroes, interstitials, look pages) escape the container to the viewport edge
  - Dawn contrast: Dawn's 12-col/24px-grid has no split rule and its image-text pairs alternate at 50/50; this system forbids 50/50 and fixes media at 60.

## 3. Whitespace

- **Decision:** a two-speed density budget — commerce surfaces are tight (collection grids, search, cart), storytelling and decision surfaces are airy (hero, look pages, PDP, editorial); the page is loud exactly once (the moment hero) and quiet everywhere the shopper must decide.
- **Rationale:** low density around the impulse decision (PDP hero, cart drawer commit) is what converts the mood shopper — whitespace carries the "considered" signal at this price point; dense-but-calm grids keep mobile browsing fast, which is where 60–75% of sessions live. Whitespace is a hierarchy tool: it points at the one action (add to cart, add the whole look) by clearing everything around it.
- **Tokens:** spacing scale below (4px base, values 4→160). Section padding: standard `space-8` (64px) desktop / `space-6` (32px) mobile; editorial pause (interstitials, look heroes) `space-10` (160px) desktop / `space-8` (64px) mobile. PDP block separation `space-7` (48px); cart drawer padding `space-5` (24px); card grid gaps `space-4` (16px) mobile / `space-5` (24px) desktop. Dawn contrast: Dawn applies uniform section padding and one vertical rhythm everywhere; this system deliberately alternates standard and editorial-pause rhythm and assigns low vs high density per surface type.

## 4. Image treatment

- **Decision:** portrait photography, zero chrome — no borders, no shadows, no rounded corners, no gradient scrims anywhere; text never sits on imagery except as solid-chip labels; hover crossfades to a second image (never zoom).
- **Rationale:** un-framed, un-scrimmed portrait images read as editorial photography rather than product-sheet thumbnails — the magazine illusion depends on images bleeding to their grid edge with no card chrome. Solid chips replace the default white-to-black gradient overlay (which the uniqueness standard classifies as cosmetic and which fails on bright imagery) while keeping text contrast ≥4.5:1. Crossfade, not zoom, preserves the still, considered mood; zoom reads as a tech demo in this niche. Natural-light, unretouched retouching direction ("real bodies, honest fit") is the trust layer the first-time fashion buyer and ingredient researcher both demand (Journeys 1–2).
- **Tokens:** ratios table below. Frames: `radius-none`, no shadow tokens exist for imagery. Scrims: none; the only overlay mechanism is a solid chip — `color-surface` at 96% opacity for labels, `color-accent` for hotspot pins (white icon, 6.44:1). Hover: crossfade to second image at `motion-editorial` (800ms) when a second image exists; no movement otherwise. Retouching direction (demo-store directive): natural light, unretouched skin, honest fit/model measurements; no high-contrast fashion retouch, no baked-in text on any image (locale-safe and required by §20). Dawn contrast: Dawn frames images in white cards with rounded corners, runs gradient scrims on slideshow heroes, and uses 1:1 square product images; this theme uses un-framed 3:4/4:5 imagery with no scrims.

## 5. Typographic hierarchy

- **Decision:** two families — Cormorant Garamond (display serif, the editorial voice) paired with Work Sans (text/UI sans); hierarchy is signaled by size and color, never by stacking weights; headings stay sentence case, uppercase is reserved for eyebrows only.
- **Rationale:** a high-contrast serif display over a quiet grotesque text is the magazine voice this niche already consumes on social and editorial feeds — the family split *is* the "considered but approachable" brand tone. Two families, each locked to a role, satisfies the consistency requirement (no over-abundance of fonts) while giving the brand an audible voice; both families are in Shopify's font library, so the requirement that defaults use currently available fonts is met by construction.
- **Tokens:** type scale table below. Measure: 62–72ch for body (magazine-length reads), 55ch exception for PDP validation blocks and glossary. Hierarchy signal: size + color (ink vs ink-muted); weight stays quiet (display max 600, body 400/500); never "everything bold" — price never out-weights the product name. Merchant-selectable: two `font_picker` settings (`font_heading` default `cormorant_n6`, `font_body` default `work_sans_n4`), variants loaded via `font_modify` (bold, italic, bold-italic per §15); no custom fonts, no hard-coded @font-face assets. Dawn contrast: Dawn pairs a single family (Assistant) across every role with weight-only hierarchy; this system splits display/text into two voices and differentiates by size and color.

## 6. Product card identity

- **Decision:** the card is one image and two quiet lines — 3:4 portrait image full-bleed in its cell, then title (Body), then price (Meta, muted); at most one contextual label; vendor, rating rows, and badge stacks are deliberately absent.
- **Rationale:** the mood shopper buys styled identity, not spec sheets — the photograph must carry the desire, so the card is almost all image. One contextual line (fit note, hero ingredient) delivers the trust signal this niche actually needs at grid density (drop-off risks: unfiltered grids, fit/ingredient uncertainty); badge stacks and stock stamps are the category cliché the uniqueness standard rejects and the deceptive-practices rule limits. Quick-add in ≤2 taps is the mobile AOV lever the commerce model requires.
- **Tokens:** card ratio 3:4 fixed — `object-fit: cover` + focal-point support so grids never break on inconsistent imagery (required by §4 and the antifragile best practice). Field order: image → title → price. Max labels: 1. Allowed label content: fit note ("true to size"), hero ingredient ("niacinamide 10%"), "Bestseller", "New", "Back soon" (sold-out). Sale state: compare-at price struck through in the price line itself — no SALE badge. Sold-out: image at full strength + single "Back soon" eyebrow chip (solid surface chip, bottom-left) + disabled add. Quick-add: desktop ghost button appears on hover (150ms); mobile persistent 44px circular `color-accent` button, bottom-right of the image. Hover: crossfade to second image + title underline; no zoom, no scale. Dawn contrast: Dawn stacks title/vendor/price/rating plus up to three badges on 1:1 images; this system uses 3:4 portrait, one label max, no vendor, no rating row.

## 7. Navigation visual language

- **Decision:** quiet utility-chrome header (solid, sticky, hairline on scroll) with moment-led navigation that opens as an editorial image mosaic — the menu is a magazine contents page, not a text list.
- **Rationale:** navigation must serve both the moment shopper (discovery through imagery — "Wedding Guest", "Glow") and the repeat buyer (fast taxonomy paths to New/Clothing/Beauty); keeping the header itself quiet lets the mosaic panel carry the editorial weight. A solid header avoids the contrast debt of transparent-over-hero variants (which fail on white editorial photography) and keeps the account/search/cart chrome stable in thumb reach.
- **Tokens:** header height 64px desktop / 56px mobile (44px targets inside). Solid `color-surface` at all times; sticky; 1px `color-line` hairline fades in on scroll (150ms). Top-level links: Meta weight (13px, 500, sentence case) — quiet chrome, not display type. Active state: 2px `color-accent` underline offset 4px below the link — no filled pills. Mega menu: full-width panel on `color-surface-alt`; left 4 columns carry one 4:5 moment tile with a solid-chip label; remaining 8 columns carry two H3 (24px) link groups (moments, categories) — the "contents page" scale. Mobile: full-screen drawer (not a side sheet): 4:5 moment tiles in a 2-column mosaic at top, then H3 links, account + search pinned at the bottom; rows ≥44px. Cart/search/account icons share one style (24px grid, 1.5px stroke). Dawn contrast: Dawn's nav is text-only dropdowns at 16px with a transparent-over-hero variant and a plain 16px mobile list; this system uses an image mosaic panel, a solid header, and editorial-scale (24px) menu links.

## 8. Motion language

- **Decision:** motion is a page-turn, not a show — image crossfades, drawer slides, and one 16px scroll reveal; text, prices, and grid content never animate; no parallax, no bounce, no scroll-jacking, no urgency animation.
- **Rationale:** at mid-premium, impulse is enabled by stillness and confidence; motion exists only to signal state (added to cart, drawer open, image swapped) or to pace editorial reveals. Moving text and countdown-style animation read as discount-sale behavior in this niche and are compliance-adjacent (deceptive urgency is banned by §8) — restraint is the brand, and it is also the performance budget that keeps the 60/90 Lighthouse floors (§6) reachable with oversized imagery.
- **Tokens:** motion specs table below. What moves: card second-image crossfade, cart-drawer slide (right, 300ms), sticky add-to-cart bar (300ms), header hairline (150ms), editorial interstitial + look-hero reveal (opacity 0→1 + translateY 16px, once, triggered at 20% viewport visibility), quick-add reveal (150ms). What never moves: price, titles, body text, card grids, free-shipping progress, badge/label content. Scroll-triggered animation: editorial interstitials and look heroes only; every element animates once — nothing re-animates on scroll pass and nothing above the fold animates on load. Reduced motion: `prefers-reduced-motion: reduce` → all transform/opacity animation off; state changes become instant (drawer opens without slide, crossfade becomes an instant swap). Dawn contrast: Dawn's slideshow ships gradient/parallax-style hero animation and urgency-style countdown elements; this system has no hero animation and no urgency animation anywhere.

## 9. Editorial treatment

- **Decision:** editorial content is the narration between purchases — full-bleed interstitials interrupt collection grids, look/routine pages are the editorial core, and articles are shoppable features with inline product links (no dead ends).
- **Rationale:** the archetype's first hop is the Moment, so commerce pages must read as a narrated magazine rather than a catalog: an interstitial ("a look from this collection") converts an undirected browser back into the Look hop mid-grid and keeps the page's rhythm alive; the look/routine page is where the styled-context purchase actually happens (Journeys 1–2), so it gets the full editorial treatment, not a product grid.
- **Tokens:** interstitial placement — collection grids after row 3 and after row 7 (mobile: after row 2), home between featured blocks, and the collection editorial strip (IA block 5); look/routine heroes full-bleed. Editorial voice: Display-role statements (one sentence, max 12 words), numbered steps for routines and looks ("01 — cleanse", "02 — treat", "03 — seal"), pull quotes in Display with no border (size is the signal, never a left rule), captions in Meta. Editorial metadata (occasion, "why we styled it this way", materials/ingredients) renders in Meta role, never over the image except hotspot chips. Editorial vs product imagery: same photography direction (natural, unretouched) but deliberately different ratios and framing — editorial is 16:9 or 4:5 full-bleed, product is 3:4 on surface — so the eye reads the story break without any decorative treatment. Dawn contrast: Dawn's blog is a centered giant hero with a stacked date/author block and the theme has no collection interstitials; this system runs asymmetric features, a caption system, inline shoppable links, and narrated collection grids.

## 10. Iconography

- **Decision:** one line set — 1.5px stroke on a 24px grid, sharp corners, utilities only, delivered as an inline SVG sprite; social brand marks are the sole exemption.
- **Rationale:** a single hairline icon voice matches the 400-weight text and signals a considered brand; standard, well-established glyphs (cart, search, menu, account) keep navigation intuitive per design best practices, and one defined set prevents the mixed-fill, mixed-stroke drift that makes icons read as assembled.
- **Tokens:** stroke 1.5px; grid 24px (glyph drawn in 24×24, optically centered); corners sharp; allowed glyphs: menu, close, search, cart, account, chevron-down, chevron-right, arrow-right (CTA), plus, minus, check, filter, gift, play, star (review-slot support for the @app block), heart (account area only — never on product cards, per app-like feature compliance), globe, language. Deliberately not iconified: no decorative glyphs, no product-card icons beyond quick-add, no emoji or system glyphs anywhere. Loading: inline SVG `<symbol>` sprite referenced by `<use>`, stroke inherits `currentColor`; social brand marks are a separate brand-glyph set (exempt from the stroke rule, required by §13). Labeling: every icon is `aria-hidden` with a visually hidden text label or `aria-label` ("Cart, 2 items", "Search"). Dawn contrast: Dawn mixes a filled cart, 2px strokes, rounded corners, and per-section icon decisions; this system is one defined 1.5px set with sharp corners and a strict allowlist.

## 11. Responsive visual behavior

- **Decision:** mobile is the primary surface and desktop is the expanded canvas — grids recompose at each breakpoint, components are redesigned (not rescaled), and nothing merely shrinks.
- **Rationale:** 60–75% of sessions are mobile; the drawer-first cart, sticky add-to-cart, full-screen moment drawer, and bottom-sheet filters are behaviors this niche requires (commerce-thesis decisions 6–7) and they only work if designed at mobile scale first. Desktop is where the same system expands — persistent filter column, hover mega menu, look context beside the product — rather than where the layout is authored.
- **Tokens:** breakpoints 1024 / 750. Type: clamps carry the scale (type table below: display 36→72px etc.). Spacing on mobile: the scale halves — section padding `space-8`→`space-6` (64→32), editorial pause `space-10`→`space-8` (160→64), gutters 24→16. Grid collapse: product grid 4-up (≥1024) → 3-up (750–1023) → 2-up (<750), cards always 3:4; editorial 60/40 split stacks to full-bleed image with type below in the margin column (never over the image); look mosaic 2-col → 1-col; mega menu → full-screen drawer; moment tiles 2-col mosaic on mobile. Redesigned components: header (mobile: menu left, logo center, account + search + cart right, all 44px targets); PDP (mobile: vertical media stream then info, sticky bottom add-to-cart bar appears after the hero scrolls past — desktop: media left 60%, sticky info right 40%); filters (desktop persistent 280px column → mobile bottom-sheet drawer per storefront-filtering UX guidance); cart (drawer opens on every add at both widths; full page remains for edits). Touch targets ≥44×44 never shrink with text (exceeds the 24px §12 minimum; per docs/compliance-matrix.md). Hero text never overlaps the header (solid header; heroes get `space-6` top padding). Dawn contrast: Dawn's mobile is desktop-scaled-down — same horizontal list nav, inline filter column, no drawer-first cart; this system recomposes deliberately at each breakpoint.

---

# Token Tables

## Type scale

| Role | Size | Line-height | Weight | Case / tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | `clamp(2.25rem, 5.5vw, 4.5rem)` (36–72px) | 1.05 | 600 serif | sentence / -0.01em | Home moment-hero statement, editorial interstitial statements, look/routine page titles |
| Heading 1 | `clamp(1.75rem, 4vw, 2.75rem)` (28–44px) | 1.15 | 600 serif | sentence / -0.01em | Page titles: product name (PDP), collection headings, article titles |
| Heading 2 | `clamp(1.5rem, 3vw, 2.125rem)` (24–34px) | 1.2 | 600 serif | sentence / 0 | Section headings, validation-block titles ("How to wear", "Key ingredients") |
| Heading 3 | `clamp(1.25rem, 2vw, 1.5rem)` (20–24px) | 1.3 | 500 sans | sentence / 0 | Mega-menu and mobile-drawer links, card-group titles, routine step names, PDP price |
| Body | `clamp(1rem, 1vw, 1.0625rem)` (16–17px) | 1.6 | 400 sans | sentence / 0 | Paragraphs, PDP story, product card title, form labels, RTE content |
| Meta | 0.8125rem (13px) | 1.4 | 400 sans | sentence / 0 | Captions, card price, per-item context (size note, routine step), footer, timestamps |
| Eyebrow | 0.75rem (12px) | 1.3 | 500 sans | UPPERCASE / +0.12em | Section kickers, moment labels, hotspot chips, the card's single label |

- Measure: 62–72ch body; 55ch exception (PDP validation blocks, glossary).
- Fonts: `font_heading` default `cormorant_n6`, `font_body` default `work_sans_n4` — both in Shopify's available-fonts list (verified 2026-09-09); variants loaded via `font_modify`; merchant-selectable only, no hard-coded fonts.

## Spacing scale

| Token | Value | Typical use |
| --- | --- | --- |
| space-1 | 4px | Icon-to-text gaps, hairline offsets |
| space-2 | 8px | Inline gaps; chip padding (8px vertical) |
| space-3 | 12px | Meta-to-content gaps, group gaps |
| space-4 | 16px | Card grid gap (mobile), form-control gaps, drawer item gaps, button horizontal padding |
| space-5 | 24px | Card grid gap (desktop), drawer padding, list gaps |
| space-6 | 32px | Mobile section padding, accordion padding, look-page block gaps |
| space-7 | 48px | Desktop component gaps, PDP block separation |
| space-8 | 64px | Desktop section padding (standard) |
| space-9 | 96px | Large section separation, look-hero-to-content gap |
| space-10 | 160px | Editorial pause (interstitial vertical padding, desktop) |

- Grid gaps: `gap-grid-mobile` = space-4, `gap-grid-desktop` = space-5. Page margin: `clamp(16px, 4vw, 48px)`.

## Color role system

Warm neutral palette (bone-and-espresso) with one clay accent. Contrast ratios computed against the surface each role renders on (WCAG 2.x, verified 2026-09-09):

| Token | Value | Usage | Contrast vs surface (if text) |
| --- | --- | --- | --- |
| color-surface | `#FAF7F2` (bone) | Default page surface, header, drawers, modals | — |
| color-surface-alt | `#F1EBE1` (sand) | Alternate sections, mega-menu panel, interstitials | — |
| color-surface-inverse | `#1F1B16` (espresso) | Footer, dark editorial bands | — |
| color-ink | `#211C16` | Primary text, product titles, headings | 15.82:1 on surface |
| color-ink-muted | `#6B6257` (taupe) | Secondary text: captions, card price, meta | 5.6:1 on surface; 5.05:1 on surface-alt |
| color-line | `#E4DCCE` (hairline) | Borders, dividers, header scroll hairline | — (non-text, 3:1 minimum met vs surface) |
| color-accent | `#9E4226` (clay) | Primary buttons, links, active nav underline, quick-add button, progress fill | 6.03:1 on surface (text/link); white button text 6.44:1 |
| color-accent-soft | `#F3E3DA` (pale clay) | Chip/state backgrounds, button hover surfaces, selected filter chip | — |
| color-accent-inverse | `#D97A54` | Accent text/links on dark surfaces (footer) only | 5.59:1 on surface-inverse |
| color-error | `#A33A2E` | Error states, validation messages | 6.14:1 on surface |
| color-success | `#3E6B4F` (sage) | Success confirmations ("Added to your cart", toast states) | 5.74:1 on surface |

Rules: text on inverse surfaces uses `color-surface` (16.02:1) with `color-accent-inverse` for links/underlines; `color-accent` is never text on dark surfaces (2.66:1 — fails). No other hex values exist; every background setting is paired with a foreground setting (§16), and the demo uses a single warm-light photography grade consistent with bone/sand.

## Radii

| Token | Value | Usage |
| --- | --- | --- |
| radius-none | 0 | All imagery, product cards, editorial surfaces, buttons' structural corners — photography and cards are never rounded |
| radius-sm | 4px | Buttons, form inputs, filter chips, search input |
| radius-full | 999px | Pills: the card's single label, hotspot pins, quick-add circular button, account avatar |

## Image ratios

| Surface | Ratio | Notes |
| --- | --- | --- |
| Hero | 4:5 | Full-bleed portrait moment hero; no overlay, text in margin column |
| Product / PDP media | 3:4 | Single-column vertical media stream (magazine feature, no thumbnail grid); frame fixed 3:4, `object-fit: cover` for video |
| Collection card | 3:4 | Fixed; `object-fit: cover` + focal-point support; never mixed with other ratios in one grid |
| Editorial interstitial | 16:9 | Full-bleed landscape "pause"; deliberately different from product 3:4 so the eye reads a story break |
| Look / routine hero | 4:5 | Full-bleed with shoppable hotspot pins (44px targets) |
| Blog / article hero | 4:5 | Asymmetric feature header |
| Moment tile (mega menu / mobile drawer) | 4:5 | Image mosaic tiles in navigation surfaces |

## Motion specs

| Token | Duration | Easing | Usage |
| --- | --- | --- | --- |
| motion-micro | 150ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Hover states, quick-add reveal, header hairline fade, icon press |
| motion-standard | 300ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Cart drawer slide, filter drawer, sticky add-to-cart bar, accordions, focus rings |
| motion-editorial | 800ms | `linear` | Card second-image crossfade, PDP media swap |
| motion-reveal | 600ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Editorial interstitial + look-hero reveal: opacity 0→1 + translateY 16px, once, at 20% viewport visibility |

- Banned: bounce, spring, elastic, parallax, scroll-jacking, countdown/urgency animation, re-animation on scroll pass, above-the-fold load animation.
- `prefers-reduced-motion: reduce` → all transform/opacity motion off; state changes become instant swaps.

# Enforcement

- Every value in `sections/`, `snippets/`, `assets/`, and `layout/` comes from a token above, exposed as CSS custom properties (`--space-*`, `--type-*`, `--color-*`, `--radius-*`, `--ratio-*`, `--motion-*`, `--ease-*`) and mirrored into theme settings by shopify-liquid-architect / theme-editor-architect during implementation. No arbitrary values, no one-off hex codes, no magic numbers — including in demo store content.
- New values require a new token added to this doc first, then mirrored into settings / CSS custom properties. Implementing agents add tokens here; they never inline a value. Any inline value found in review is a defect.
- Merchant-facing settings surface only: fonts (two `font_picker` settings, §15), colors (each color role with paired foregrounds, §16), content settings. Radii, image ratios, and motion are fixed tokens — the opinionated art direction §3 requires is not a settings menu.
- Dawn-derived rule: every dimension above states what Dawn does and what this theme does instead. Residual Dawn styling — rounded image frames, gradient hero scrims, centered text blocks, 50/50 image-text mirrors, square cards, badge stacks, mixed 2px icons, uniform section padding — is a uniqueness defect and will fail theme-uniqueness-designer. Each dimension is checked for settings-reproducibility: a merchant must not be able to reach another Theme Store theme's look from this theme's settings, and this theme's identity must not be reachable from another theme's settings.

# Review handoff

- Next reviewer: theme-uniqueness-designer (first pass now, second pass before submission) — checks every dimension against the differentiation standard (§2) and for settings-reproducibility.
- Later conflict sources: theme-performance-engineer (docs/performance-report.md — oversized imagery is paid for by lazy-loaded responsive images, §17) and theme-accessibility-engineer (docs/accessibility-report.md — contrast ratios above, 44px targets, reduced-motion handling). Conflicts are resolved in writing in this doc; the design decision stands until a reviewer overturns it.
