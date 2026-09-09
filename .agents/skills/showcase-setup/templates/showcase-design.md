# Showcase Design — {{brand_name}}

Produced by the showcase-setup skill (Phase 3). This document defines the showcase as ONE real brand. Fill every section with a decision; a section left with a placeholder is not done. Source of truth for Phases 4-9.

- Status: <Draft | Approved>
- Store: `__STORE__.myshopify.com`
- Generated: {{date}}

## 1. Brand identity

- Brand name: {{name}}
- Tagline: {{tagline}}
- One-sentence story: {{story}}
- Voice/tone: {{voice — e.g. warm, playful, minimal, editorial; 2-3 adjectives + what it forbids}}
- Logo treatment: {{wordmark / monogram / icon; color; placement}}
- Locale/language of all copy: {{lang}}

## 2. Niche & shopper (commerce thesis)

- Niche (and sub-niche): {{e.g. botanical skincare for sensitive skin}}
- Primary shopper: {{who buys; age, context, time budget}}
- How they decide: {{impulse vs researched; price-led vs trust-led}}
- Journey archetype: {{Beauty | Fashion | Furniture | Electronics | derived}}
- Shopping-model decisions (7): navigation model / collection discovery / search model / PDP IA / cross-selling / cart continuation / mobile flow
- What the theme must make effortless: {{outcomes}}

> Delegate depth to `commerce-ux-architect` (`docs/commerce-thesis.md`, `docs/user-journeys.md`, `docs/page-information-architecture.md`).

## 3. Page → sections map

Map every page type to the theme's ACTUAL sections (`sections/`, template JSONs). Never invent section names.

### Home (`templates/index.json`)

| Order | Section | Blocks/settings | Purpose |
|---|---|---|---|
| 1 | {{section type}} | {{blocks}} | {{why}} |
| 2 |  |  |  |
| … |  |  |  |

### Product / PDP (`templates/product*.json` — which variant: stacked / thumbnails-carousel / grid-mix)

| Order | Section | Purpose |
|---|---|---|
| 1 | main-product | media + buy box |
| 2 | {{product-tabs / product-information-tabs}} | details |
| 3 | {{product-recommendations / featured-product-slider}} | cross-sell |

### Collection (`templates/collection*.json` — which banner variant: as-background / left / right / top)

| Order | Section | Purpose |
|---|---|---|
| 1 | main-collection-banner | intro |
| 2 | main-collection-product-grid | grid |

### Other page types

- Blog / article (`blog.json`, `article.json`): {{sections}}
- Cart (`cart.json`): {{sections}}
- Pages: about-us, lookbook, find-a-store, faqs, contact — {{which sections each uses, e.g. rich-text, image-with-text, lookbook, maps, contact-form}}
- Search / 404 / password / list-collections: {{sections}}

## 4. Config plan (`config/settings_data.json`)

- Layout: container width, page width
- Fonts: heading {{font}} / body {{font}}
- Announcement bar: {{text}}
- Header: logo, menu, sticky behavior
- Footer: menu columns, social links, newsletter
- Color scheme → section assignment: {{which sections use scheme 1/2/3/4}}
- Section presets to verify: {{list}}

## 5. Color schema & typography

| Role | Hex | Used where |
|---|---|---|
| Background | #{{hex}} | default |
| Foreground/text | #{{hex}} | body |
| Accent | #{{hex}} | buttons, links |
| Surface | #{{hex}} | cards, footer |
| + scheme variants | #{{hex}} | alternate sections |

- Contrast: text on background ≥ 4.5:1; large text ≥ 3:1 (Theme Store minimum)
- Font pairing: heading {{family}} / body {{family}} (merchant-selectable via `font_picker`)

## 6. Asset list (imagen — no video)

| # | Asset | Page/section/block | Ratio/dimensions | Style direction | Source | Status |
|---|---|---|---|---|---|---|
| 1 | {{hero image}} | home / slideshow slide 1 | 16:9 / 1920×1080 | {{warm, natural light, brand palette}} | free | to source |
| 2 | {{product shot: name}} | PDP + card | 1:1 / 1200×1200 | clean studio bg | free | to source |
| 3 | {{brand logo / mascot}} | header / about | 2:1 | {{brand identity}} | ai | to source |
| 4 | {{SVG icon/pattern}} | section decorative | 512×512 | line style | ai | to source |
| … |  |  |  |  |  |  |

Source = `free` (Unsplash stock, `--mode free`), `ai` (codex imagegen / relay, `--mode ai` — brand, exact render, text-in-image), or `supplied` (customer-provided). Run `imagen` in Phase 4.

Video: theme video sections stay empty unless the customer supplies video files (imagen does not generate video).

## 7. Resource list

### Products

| Handle | Title | Price | Compare-at | Variants | Images (from §6) | Template |
|---|---|---|---|---|---|---|
| {{handle}} | {{title}} | {{price}} | {{-}} | {{size/color}} | {{asset #}} | {{product / stacked / thumbnails-carousel / grid-mix}} |

### Collections

| Handle | Title | Membership (product handles) | Banner image | Template variant |
|---|---|---|---|---|
| {{handle}} | {{title}} | {{list}} | {{asset #}} | {{default / banner-as-background / left / right / top / without-image}} |

### Pages

| Handle | Template | Content source (brand voice) |
|---|---|---|
| about-us | page.about-us | brand story from §1 |
| lookbook | page.lookbook | {{asset #s}} |
| find-a-store | page.find-a-store | {{locations}} |
| faqs | page.faqs | {{Q/A}} |
| contact | page.contact | {{email/phone}} |

### Blog & menus

- Blog: {{handle}} — 6-8 articles, each: title, excerpt, image, body (brand voice)
- Menus: main-menu ({{items → resources}}), footer ({{items}})

## 8. Consistency check (before build)

- [ ] Every page type in §3 uses only sections that exist in the theme
- [ ] Every handle in §7 exists in §3 references (no dead links)
- [ ] Copy tone matches §1 voice everywhere
- [ ] Every image has a style direction matching §5 palette
- [ ] ≥ 4 colors, background/foreground paired (Theme Store minimum)
