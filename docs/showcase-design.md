# Showcase Design — Veloura

Produced by the showcase-setup skill (Phase 3). This document defines the showcase as ONE real brand. Source of truth for Phases 4-9.

- Status: Approved (customer chose `veloura-demo-store.myshopify.com`; store name and theme preset "Veloura" fix the brand)
- Store: `veloura-demo-store.myshopify.com`
- Generated: 2026-09-09

## 1. Brand identity

- Brand name: **Veloura**
- Tagline: *Jewelry with a story to tell.*
- One-sentence story: Veloura is a jewelry atelier that handcrafts every piece from Japanese Miyuki beads, 18K gold vermeil, and natural stones — slow, personal jewelry made to be lived in and passed on.
- Voice/tone: warm, editorial, craft-first. Forbids: hype, discount-y shouting, jargon, anything mass-produced in tone.
- Logo treatment: typographic wordmark rendered by the theme header in the Arapey italic heading font (no raster logo — keeps the header clean; store name is the brand).
- Locale/language of all copy: **English** (theme default locale `en.default`, store currency USD).

## 2. Niche & shopper (commerce thesis)

- Niche (and sub-niche): handcrafted jewelry — Miyuki beadwork and gold vermeil — at accessible prices.
- Primary shopper: women 25-45, buying for herself or as a gift; short time budget, mobile-first.
- How they decide: researched but emotive; trust-led (materials, craft story, care guidance) with gift urgency.
- Journey archetype: Fashion-derived jewelry.
- Shopping-model decisions (7): navigation model = category-first with capsule collections on top; collection discovery = homepage category showcase + collection-list sliders; search model = predictive search over products/collections/pages; PDP IA = media + buy box → description → tabs (care, shipping) → reviews → recommendations; cross-selling = recommendations + bundle slider; cart continuation = recommendations on cart page + drawer; mobile flow = bottom sticky bar (home/products/search/cart).
- What the theme must make effortless: find-by-category, gift decision, and trust in materials.

## 3. Page → sections map

Every page type uses ONLY sections that exist in `sections/`. Template JSONs are content and get rewritten to this map (Phase 8).

### Home (`templates/index.json`)

| Order | Section | Blocks/settings | Purpose |
|---|---|---|---|
| 1 | slideshow | 1 active slide: hero image + headline + 2 buttons | brand hero |
| 2 | image-with-text-slider | 3 slides: capsule stories (Sakura Bloom, Sunset Glow, Dreamshine) | brand capsules |
| 3 | scrolling-promotion | 3 announcements + dividers | craft values ticker |
| 4 | featured-collection | collection `signature`, limit 8 | hero edit |
| 5 | custom-content | 6 image cards (3/4 portraits) | shop-by-mood grid |
| 6 | custom-content | image comparison (gold vs silver) + text | material story |
| 7 | rich-text | section heading | editorial break |
| 8 | collection-list | 5 capsule collections w/ covers | capsule navigation |
| 9 | products-bundle | 3 bracelets (rainbow/sunset/ocean) | bundle slider |
| 10 | collection-tabs | 3 tabs: bridal, new-in, on-sale | tabbed shopping |
| 11 | custom-content | 2 image cards | campaign strip |
| 12 | scrolling-promotion | 5 testimonials | social proof |
| 13 | collections-showcase | 4 category collections | shop by category |
| 14 | promotion-banner | 2 text blocks: seasonal sale | offer banner |
| 15 | multicolumn | 3 columns w/ images | brand promises |
| 16 | gallery-images | 6 product/lifestyle images | gallery |
| 17 | video | disabled (no video assets — G4) | — |

### Product / PDP (`templates/product*.json` — 4 variants: default, stacked, thumbnails-carousel, grid-mix)

| Order | Section | Purpose |
|---|---|---|
| 1 | main-product | media + buy box |
| 2 | product-information-tabs | description tab + Care Guide + Shipping & Returns (pages) |
| 3 | testimonials (in default) | 5 linked product testimonial cards |
| 4 | product-recommendations | cross-sell |

Products assigned per variant via `template_suffix`: `stacked` → twist-ring-gold, `thumbnails-carousel` → pearl-drop-necklace, `grid-mix` → gold-hoop-earrings, default → miyuki-bead-bracelet-rainbow.

### Collection (`templates/collection*.json` — 5 variants)

| Order | Section | Purpose |
|---|---|---|
| 1 | main-collection-banner (block `collection` + `image`) | intro banner per variant |
| 2 | main-collection-product-grid | grid |

Variant assignment via collection `template_suffix`: `banner-as-background` → sakura-bloom, `banner-left` → necklaces, `banner-right` → earrings, `banner-top` → golden-forever, `without-image` → on-sale, default → rest.

### Other page types

- Blog (`blog.json`): breadcrumb + rich-text (title/text) + main-blog. Article (`article.json`): main-article (title/content/share/next-prev).
- Cart (`cart.json`): main-cart-items + main-cart-footer (subtotal/buttons/note) + product-recommendations.
- Pages: about-us, about-us-2 (image-with-text + multicolumn + hero + scrolling-promotion + image-with-text), lookbook (hero + collection-list + collection-list-slider + image comparison + featured-collection + gallery-images), find-a-store (3 boutique blocks image+text), faqs (collapsible-tabs), contact (rich-text + collage-tabs + contact-form).
- Search (`search.json`) / 404 (`main-404` + collection-list ×4) / password (`main-password` blocks) / list-collections (`main-list-collections`).

## 4. Config plan (`config/settings_data.json`)

- Layout: container_width 1580, fluid 1330, font_base_size 15, animations fade-in-up, page_transition on.
- Fonts: heading **Arapey** (`arapey_n4`, highlight `arapey_i4`) / body **Archivo** (`archivo_n4`, weight 500) — from the theme's own Veloura preset.
- Announcement bar: color_schema accent; text set per block: "Free shipping on orders over $75" + "Handcrafted with Japanese Miyuki beads".
- Header: layout design-2, sticky on, main_menu `main-menu`, mega menu on (5 category columns), search/cart/account on.
- Footer: color_schema background-2, 3 link_list columns → `footer`, `footer-services`, `footer-about`; newsletter block; social on.
- Color scheme → section assignment: background-1 default; background-2 footer; accent announcement; scheme-5 slider; scheme-6/7 accent sections; inverse for hero overlays.
- Section presets: already present on all content sections (verified) — no code change.
- Social links: left empty except Instagram `https://www.instagram.com/veloura` (demo handle).
- Sticky ATC bar: on for desktop+mobile.

## 5. Color schema & typography

| Role | Hex | Used where |
|---|---|---|
| Background | `#ffffff` | default (background-1) |
| Foreground/text | `#1f1a17` | body, headings (warm black) |
| Accent | `#b0573b` | buttons, highlights, announcement (terracotta) |
| Surface | `#f3ece4` | secondary bg, cards, footer (warm ivory) |
| Inverse bg | `#1f1a17` | inverse scheme sections |
| Soft sage | `#dfe8e2` | scheme-5 accent sections |

- Contrast: `#1f1a17` on `#ffffff` = 16.6:1 ✓; `#ffffff` on `#b0573b` = 4.9:1 ✓ (≥4.5). All scheme text/background pairs keep ≥4.5:1 (dark text on light surfaces, white on `#1f1a17`).
- Font pairing: heading Arapey / body Archivo (both merchant-selectable `font_picker` values already in `settings_schema.json`).

## 6. Asset list (imagen — no video)

All images generated (none supplied). Style direction: warm natural light, ivory/terracotta palette, jewelry macro + editorial lifestyle, consistent 1:1 product studio.

| # | Asset | Page/section/block | Ratio | Style direction |
|---|---|---|---|---|
| 1-2 | hero desktop + mobile | home slideshow slide 1 (background, mb_background) | 16:9 / 4:5 | editorial flatlay of gold jewelry on ivory linen |
| 3-5 | capsule slides ×3 | home image-with-text-slider | 4:5 | Sakura Bloom / Sunset Glow / Dreamshine mood imagery |
| 6-11 | image cards ×6 | home custom-content image_card | 3:4 | product lifestyle, model hands |
| 12-13 | gold vs silver earrings | home + lookbook image comparison | 1:1 | macro pair shot, identical earrings in two metals |
| 14-18 | collection covers ×5 | home collection-list (sakura-bloom, sunset-glow, fusion, dreamshine, golden-forever) | 4:5 | capsule mood |
| 19-21 | brand promise icons ×3 | home multicolumn | 1:1 | beadwork hands, gold ingot, tools |
| 22-24 | about-us story images ×3 | page.about-us custom-content | 3:4 | atelier, hands beading, workshop |
| 25-26 | about-us-2 images ×2 | page.about-us-2 image-with-text | 3:4 | atelier portraits |
| 27 | lookbook hero | page.lookbook hero | 16:9 | editorial model jewelry |
| 28-30 | boutique images ×3 | page.find-a-store | 3:4 | boutique interiors (NY/Paris/Tokyo) |
| 31 | faqs side image | page.faqs image_card | 3:4 | jewelry flatlay |
| 32 | contact collage image | page.contact collage-tabs | 4:5 | atelier scene |
| 33-40 | article images ×8 | blog news articles | 16:9 | craft/materials stories |
| 41-72 | product images ×14 (2-3 each) | PDP + product cards | 1:1 | clean studio on ivory, consistent |

Gallery images (home + lookbook) reuse product/lifestyle shots above. No video assets — video sections stay disabled.

## 7. Resource list

### Products

| Handle | Title | Price | Compare-at | Images | Template suffix |
|---|---|---|---|---|---|
| miyuki-bead-bracelet-rainbow | Rainbow Miyuki Bead Bracelet | 38 | — | 3 | default |
| miyuki-bead-bracelet-sunset | Sunset Miyuki Bead Bracelet | 38 | — | 2 | default |
| miyuki-bead-bracelet-ocean | Ocean Miyuki Bead Bracelet | 38 | — | 2 | default |
| gold-vermeil-bangle-set | Gold Vermeil Bangle Set | 89 | 112 | 2 | default |
| pearl-drop-necklace | Freshwater Pearl Drop Necklace | 74 | — | 3 | thumbnails-carousel |
| peridot-pendant-necklace | Peridot Pendant Necklace | 96 | 120 | 2 | default |
| layered-chain-necklace | Layered Chain Necklace | 82 | — | 2 | default |
| diamond-studs | Lab Diamond Stud Earrings | 129 | — | 2 | default |
| gold-hoop-earrings | 14K Gold Hoop Earrings | 118 | 148 | 3 | grid-mix |
| pearl-hoop-earrings | Pearl Hoop Earrings | 68 | — | 2 | default |
| twist-ring-gold | Double Twist Ring in 14K Gold | 164 | — | 3 | stacked |
| stacking-ring-set | Stacking Ring Set | 92 | 115 | 2 | default |
| bridal-parure-set | Bridal Parure Set | 249 | — | 3 | default |
| crystal-veil-pins | Crystal Veil Pins | 46 | — | 2 | default |

### Collections

| Handle | Title | Membership | Banner image | Template suffix |
|---|---|---|---|---|
| necklaces | Necklaces | pearl-drop, peridot-pendant, layered-chain, bridal-parure | product shot | banner-left |
| earrings | Earrings | diamond-studs, gold-hoop, pearl-hoop, crystal-veil-pins | product shot | banner-right |
| bracelets | Bracelets | rainbow, sunset, ocean, bangle-set | product shot | default |
| rings | Rings | twist-ring, stacking-ring-set | product shot | default |
| gifts | Gifts | all except bridal parure excluded: 13 products | lifestyle | default |
| on-sale | On Sale | bangle-set, peridot-pendant, gold-hoop, stacking-ring-set | lifestyle | without-image |
| signature | The Signature Edit | twist-ring, layered-chain, diamond-studs, gold-hoop, bridal-parure | lifestyle | default |
| sakura-bloom | Sakura Bloom | rainbow, pearl-hoop, crystal-veil-pins | capsule #14 | banner-as-background |
| golden-forever | Golden Forever | bangle-set, layered-chain, gold-hoop, twist-ring, stacking-ring-set | capsule #18 | banner-top |
| sunset-glow | Sunset Glow | sunset, peridot-pendant | capsule #15 | default |
| fusion | Fusion | diamond-studs, stacking-ring-set, pearl-drop | capsule #16 | default |
| dreamshine | Dreamshine | ocean, pearl-drop, bridal-parure, crystal-veil-pins | capsule #17 | default |
| new-in | New In | rainbow, sunset, ocean, crystal-veil-pins | product shot | default |
| best-sellers | Best Sellers | twist-ring, gold-hoop, pearl-drop, rainbow | product shot | default |
| bridal | The Bridal Edit | bridal-parure, crystal-veil-pins, pearl-hoop, pearl-drop | product shot | default |

### Pages

| Handle | Template | Content source (brand voice) |
|---|---|---|
| about-us | page.about-us | brand story from §1 + atelier images |
| about-us-2 | page.about-us-2 | materials & craft values |
| lookbook | page.lookbook | capsule editorial |
| find-a-store | page.find-a-store | 3 ateliers: New York, Paris, Tokyo |
| faqs | page.faqs | shipping, care, returns, sizing Q/A |
| contact | page.contact | existing page updated; brand copy + English form labels |
| care-guide | page (default) | PDP tab: jewelry care |
| shipping-returns | page (default) | PDP tab: shipping & returns |

### Blog & menus

- Blog: `news` → renamed **The Veloura Journal**; 8 articles, each: title, excerpt, image, brand-voice body.
- Menus: `main-menu` (Shop dropdown → 5 categories; On Sale; New In; Our Story; Lookbook; Journal; Contact), `footer` (5 category links), `footer-services` (FAQ, Find a Store, Contact, Care Guide, Shipping & Returns), `footer-about` (About Us, Our Story, Lookbook, Journal).

## 8. Consistency check (before build)

- [x] Every page type in §3 uses only sections that exist in the theme (verified against `sections/`)
- [ ] Every handle in §7 exists in §3 references (no dead links) — built in Phases 5-6
- [ ] Copy tone matches §1 voice everywhere (Spanish/workout-brand remnants rewritten in Phase 8)
- [ ] Every image has a style direction matching §5 palette
- [x] ≥ 4 colors, background/foreground paired (Theme Store minimum) — §5
- [x] No theme code changes required (all work is template JSON content + settings_data + store content) — G5: no approval gate needed
