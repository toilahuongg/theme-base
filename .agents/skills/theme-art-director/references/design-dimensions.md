# Design Dimensions — Deeper Guidance

This reference gives the art director a working method per dimension: what the dimension decides, the questions that force a real decision, and the anti-patterns to reject. Read it alongside `templates/design-system.md` and fill the template dimension by dimension. The end product is a design doc where every sentence is a decision backed by a token.

## Reading the merchant type first

Before any dimension, answer: who is this merchant, what do they sell, and what does their customer already expect to feel? The same decision can be correct in one niche and wrong in another.

- Luxury / heritage: media dominance, restraint, slowness, low density, asymmetry.
- Clinical beauty / pharmacy: precision, hairline structure, one accent, generous air, no decoration.
- Architectural furniture / objects: material honesty, brutal grid, scale contrast, near-monochrome.
- Food / hospitality: warmth, appetite-scale imagery, visible craft, readable type.
- Kids / toys: high-chroma accents, rounded radii, playful motion, dense but calm grids.
- Tech / developer tools: monochrome, sharp radii, dense information, fast motion.

This mapping is a starting heuristic, not a rule. The decision must come from the merchant brief in `docs/commerce-thesis.md`, not from a lookup table.

## 1. Layout philosophy

What the dimension decides: the single organizing idea behind every page — the thing that makes a page from this theme recognizable before the logo does.

Questions to answer:

- What is the dominant gesture of a page: a magazine spread, a catalog sheet, a dossier, a gallery wall, a laboratory notebook?
- Is the page image-first, type-first, or object-first? What does that mean for every template?
- What is the one rule every section obeys (for example: "media always leads," "nothing is centered," "every page opens with a full-bleed image")?
- What emotional job does the layout do: narrate, inventory, persuade, or reassure?

Anti-patterns:

- No stated philosophy at all — pages are just stacked sections.
- "Clean and modern" as a philosophy (a placeholder, not a decision).
- The mirrored template pattern: hero left/right variants that swap text and image but change nothing else.
- Every page built from the same three blocks in the same order (hero, three-column feature, cards).

## 2. Grid

What the dimension decides: the column structure, gutter, container, breakpoints, and the alignment rules that give every section its spine.

Questions to answer:

- How many columns at desktop, tablet, mobile? Is the grid symmetric or asymmetric at any breakpoint?
- What are the gutter and container values, and do they scale between breakpoints?
- Does any template use an editorial split (for example 40/60) instead of the standard grid? When is the split allowed and which side leads?
- What is the baseline alignment rule: top-aligned, baseline-aligned, or optical center?
- How do full-bleed and contained sections coexist?

Anti-patterns:

- 12/6/4 grid with 24px gutters copied from Dawn with no stated reason.
- Grid used only at the container level; inner cards arbitrarily sized per section.
- Content that never touches the grid (floaty centering everywhere).
- Different gutters in sibling sections without a rule explaining when each applies.

## 3. Whitespace

What the dimension decides: the density budget — how much air each surface gets, and where the theme deliberately gets quiet or loud.

Questions to answer:

- What is the spacing scale (base unit and values), and how does it scale on mobile?
- What is the standard section padding, and what is the "editorial pause" padding for interstitials?
- Which surfaces are low-density by design (PDP, editorial) and which may be denser (collection grids, cart)?
- Where does the theme intentionally go quiet to make one element loud?

Anti-patterns:

- "Generous whitespace" with no numbers.
- Uniform padding everywhere — every section exactly the same height and rhythm.
- Whitespace used as a filler instead of a hierarchy tool (empty space that points at nothing).
- Cramming all metadata onto a card while the page around it is empty.

## 4. Image treatment

What the dimension decides: crop ratios, sizing rules, overlays, borders, retouching style, and how images behave inside cards, heroes, and editorial surfaces.

Questions to answer:

- What are the canonical image ratios per surface (hero, product, collection card, editorial, blog)? Are products always vertical, always square, always consistent within a grid?
- Do images get borders, hairline frames, shadows, or none?
- Do text overlays sit on images? With what scrim (gradient, tint, duotone) and at what opacity?
- What is the retouching direction: clinical and clean, warm and grain, high-contrast editorial?
- What happens on hover: zoom, crossfade to a second image, nothing?

Anti-patterns:

- Mixed ratios inside one grid (some square, some 4:5) unless that mix is the point.
- The default white-to-black gradient scrim on every hero.
- Duotones or filters applied because they look "designed" rather than because they carry the brand.
- Images with baked-in text that duplicates real UI text (breaks locale and accessibility).

## 5. Typographic hierarchy

What the dimension decides: type roles, the scale, weights, case, tracking, and line lengths that make content scannable and the brand audible.

Questions to answer:

- How many type roles exist (display, heading, body, meta, eyebrow)? What is each role's size, line-height, weight, case, and tracking?
- One family or two? If two, which role pair do they split (display vs text)? Is the pairing justified by the niche?
- What is the reading measure (45-75 characters) and where is the exception?
- How is hierarchy signaled: by size, by weight, by color, by case — or a deliberate combination?
- Which fonts are available in the Shopify font settings (merchant-selectable) and which are hard-coded assets?

Anti-patterns:

- Generic system sans everywhere with no display voice.
- More than two families, or two families that differ only in weight.
- Body text below 15px, or tracking applied to lowercase text.
- The "everything bold" card: title, price, and badge all equally loud.
- A scale with no rhythm (random sizes like 18, 26, 34, 52 picked per section).

## 6. Product card identity

What the dimension decides: what a product card says, in what order, at what density — the single most repeated component in the theme.

Questions to answer:

- What is the exact field order on a card (image, title, price, meta)? What is deliberately absent?
- How many badges or labels max, and what are they allowed to say?
- What is the card's ratio, and is the image the full card or inset?
- What happens on hover (second image, scale, underline, nothing)?
- How do sale, sold-out, and preorder states render without breaking the card's calm?

Anti-patterns:

- Four identical card layouts in one grid with only the image changing (the classic AI-slop collection).
- Every badge the theme offers stacked on one card (sale, new, low stock, free shipping, rating).
- Price in a different visual weight than the title, shouting louder than the product name.
- Cards that change ratio or alignment mid-grid at the same breakpoint.

## 7. Navigation visual language

What the dimension decides: header height and behavior, menu weight, wayfinding states, and how the navigation reads against the page it sits on.

Questions to answer:

- What is the header height, and does it change on scroll (transparent over hero, solid after)?
- How loud is the menu: eyebrow-sized quiet links, or large display-type links?
- What is the active-page state, and how is the current collection marked?
- Is there a mega menu, and if so what is its visual grammar? If not, what replaces it?
- How does the mobile menu open (drawer, full screen) and what type scale does it use?

Anti-patterns:

- The Dawn sticky header with translucent blur and nothing else decided.
- Mega menu columns that silently duplicate the footer layout.
- Cart count and search icons styled differently from each other.
- Mobile drawer that inherits desktop styling instead of being designed at its own scale.

## 8. Motion language

What the dimension decides: durations, easings, what is allowed to move, and what is forbidden from moving — including reduced-motion behavior.

Questions to answer:

- What are the duration tokens (micro, standard, editorial) and easing tokens?
- Which specific interactions move: hover zoom, reveal-on-scroll, header collapse, drawer slide, image crossfade?
- What never moves (text blocks, price, cards sliding in)?
- Is there scroll-triggered animation? What is its distance, fade, and trigger rule?
- What happens under `prefers-reduced-motion: reduce` — everything off, or reduced to opacity only?

Anti-patterns:

- The default gradient-and-parallax hero animation on every theme.
- Bounce, spring, or elastic easings in a theme that claims restraint.
- Motion applied per-section by different agents with different timings.
- Elements that animate on every scroll pass (re-animating above the fold).

## 9. Editorial treatment

What the dimension decides: how content surfaces (journal, lookbook, about, FAQ, collection introductions) interrupt and pace the shopping experience.

Questions to answer:

- Where do editorial interruptions appear inside commerce flows (collection interstitials, PDP features)?
- What is the editorial voice in type: oversized statements, pull quotes, numbered sections, captions?
- What metadata accompanies editorial imagery (author, date, ingredients, materials) and in what type role?
- Are editorial and product imagery the same treatment, or deliberately different?

Anti-patterns:

- The blog template with a giant hero image, date, and author stacked — identical to every other theme's blog.
- Editorial sections that reuse the product card component with different text.
- Pull quotes styled as body text with a left border and nothing else.
- No editorial surfaces at all, so the theme has no voice beyond its grids.

## 10. Iconography

What the dimension decides: the icon set's stroke weight, grid, corner style, and which glyphs are allowed to exist.

Questions to answer:

- What is the stroke weight, icon grid, and corner style (sharp, rounded, mixed)?
- Which icons are strictly necessary (cart, search, menu, chevron, close)? What is deliberately not iconified?
- Do icons appear in navigation, product cards, or only in utilities?
- How are icons loaded (SVG sprite, inline, icon font) so they match the type weight?

Anti-patterns:

- Mixed icon styles across the theme (filled cart, stroked search).
- A 40-icon set nobody defined, drawn differently by each section.
- Emoji or system glyphs standing in for icons.
- Icons with no accessible label strategy (aria-label or visually hidden text).

## 11. Responsive visual behavior

What the dimension decides: what changes at each breakpoint — deliberately — rather than what merely collapses.

Questions to answer:

- How does the type scale change (clamp ranges per role) at tablet and mobile?
- How does the spacing scale halve or shift at each breakpoint?
- Which grids collapse to what (4-up to 2-up to 2-up? editorial split to stacked)?
- What is the mobile menu, and what happens to the header at small widths?
- Which components are redesigned, not just rescaled, at mobile?

Anti-patterns:

- The "mobile is desktop scaled down" theme: same layout, smaller text.
- Breakpoints that only trigger because content breaks, with no design intent behind them.
- Touch targets that shrink with the text (44px minimum applies to tap targets, not type).
- Hero text overlapping the header at mobile because the desktop spacing was scaled blindly.

## Cross-cutting rule

The design system is enforced, not aspirational: every token above becomes a named CSS custom property or theme setting, and implementation (shopify-liquid-architect, shopify-commerce-engineer, theme-editor-architect) consumes only tokens. If a value is not a token, it is not a design decision yet — it is debt. theme-uniqueness-designer audits the finished design system for differentiation, and theme-performance-engineer and theme-accessibility-engineer may flag conflicts later; record resolutions in the design doc.
