# Showcase State

Updated by the showcase-setup skill after every phase. Working record for the showcase build.

## Store

- Chosen store (customer-confirmed): `veloura-demo-store.myshopify.com`
- Store display name: `veloura-demo-store` (API rename impossible — `shopUpdate` removed; customer approved generated wordmark instead)
- Theme: **not pushed** — customer decision (2026-09-09): no theme push. Repo is the source of truth; push/publish skipped per request.
- Showcase language: English (USD), brand "Veloura" — handcrafted Miyuki-bead & gold-vermeil jewelry
- Plan: docs/showcase-design.md (approved; supersedes stale docs/showcase-plan.md)

## Environment

- Shopify CLI: Node v22.21.1 wrapper (`/Users/devhugon/.nvm/versions/node/v22.21.1/bin/node <v20 global @shopify/cli run.js>`; v4.7.1). Theme push requires `write_themes` + exemption — blocked; not attempted (customer: no push).
- Admin API via `shopify-store graphql` (token from `shopify-store get veloura-demo-store.myshopify.com`), queries via `--query-file` (multi-line `--query` strings break CLI parsing; single-line works).
- Repo ↔ store sync: repo is source of truth; store content created via Admin API matches repo templates.

## Content built (all live on store via Admin API)

### Products — 14
| Handle | Store id |
| --- | --- |
| miyuki-bead-bracelet-rainbow | gid://shopify/Product/8660287979699 |
| miyuki-bead-bracelet-sunset | gid://shopify/Product/8660293943603 |
| miyuki-bead-bracelet-ocean | gid://shopify/Product/8660294017139 |
| gold-vermeil-bangle-set | gid://shopify/Product/8660294072675 |
| pearl-drop-necklace | gid://shopify/Product/8660294105443 |
| peridot-pendant-necklace | gid://shopify/Product/8660294138211 |
| layered-chain-necklace | gid://shopify/Product/8660294170979 |
| diamond-studs | gid://shopify/Product/8660294203747 |
| gold-hoop-earrings | gid://shopify/Product/8660294236515 |
| pearl-hoop-earrings | gid://shopify/Product/8660294269283 |
| twist-ring-gold | gid://shopify/Product/8660294302051 |
| stacking-ring-set | gid://shopify/Product/8660294334819 |
| bridal-parure-set | gid://shopify/Product/8660294367587 |
| crystal-veil-pins | gid://shopify/Product/8660294400355 |

All: English copy, correct prices/compare-at, template suffixes, 25 inventory each (location gid://shopify/Location/85215674547).

### Collections — 15
`necklaces, earrings, bracelets, rings, gifts, on-sale, signature, sakura-bloom, golden-forever, sunset-glow, fusion, dreamshine, new-in, best-sellers, bridal` — memberships + template suffixes + cover images (14/14 attached).

### Pages — 8
`about-us, about-us-2, lookbook, find-a-store, faqs, contact (updated), care-guide, shipping-returns`.

### Articles — 8 (blog "The Veloura Journal", gid://shopify/Blog/99317055667)
`inside-our-miyuki-workshop, why-gold-vermeil-not-plating, how-to-build-a-signature-stack, pearls-reconsidered, behind-the-bridal-edit, care-that-keeps-jewelry-for-decades, autumn-capsule-is-here, lab-grown-diamonds-the-honest-choice` — all with images (8/8).

### Menus — 4
`main-menu, footer, footer-services, footer-about`.

## Images

- 84 files uploaded to store Files (MediaImage): 82 generated assets + logo-wordmark-2x.png + logo-wordmark.png (+logo-wordmark-view.png also exists). All URLs in `/tmp/veloura-img/image-urls.json` (84 entries, 0 missing).
- 14/14 products (2–3 images each, `productSet` files), 15/15 collections (covers), 8/8 articles — attached via Admin API.
- Template refs: all image refs use the `shopify://shop_images/<filename>` scheme (customer-confirmed format, 2026-09-09) — 0 raw CDN URLs, 0 empty required refs. Header logo → logo-wordmark-2x.png; footer popup → p-pearlneck-1.png.
- **image_picker audit** (`/tmp/veloura-img/audit-image-pickers.mjs`, schema-driven): 150 image_picker settings checked across all templates + section groups. Result: **0 required-EMPTY, 0 MISSING FILE, 0 MISSING ASSET, 0 WEIRD** — 83 flagged → 17 filled during audit; 25 testimonial avatar refs filled 2026-09-09 (see below); 54 remaining empties all optional by verified liquid fallback (see below).
- 17 required image_picker settings filled during audit (all `shopify://shop_images/…`, 13 blocks):
  - page.about-us.json multicolumn image_hdKyy7 → about-hands.png
  - index.json image-with-text-slider slides (3) → capsule-sakura/sunset/dreamshine.png (image + mb_background)
  - page.about-us-2.json multicolumn (45e4c2ac) 3 columns → promise-beadwork/tools/gold.png
  - page.about-us-2.json hero_FXtfQm → hero-worn-daily.png (image + image_mobile)
  - page.about-us-2.json multicolumn (a16d91be) 3 columns → col-traceable/lifetime-repair/gift-wrapped.png
  - password.json logo → logo-wordmark-2x.png; background_image → hero-desktop.png
- 4 new generated assets uploaded 2026-09-09: `hero-worn-daily.png`, `col-traceable.png`, `col-lifetime-repair.png`, `col-gift-wrapped.png` (via stagedUploadsCreate → PUT → fileCreate; URLs confirmed via requery-by-filename).
- 5 testimonial avatar assets uploaded 2026-09-09: `testimonial-avatar-{black-natural-coils,blonde-bob-silver,east-asian,latina-chestnut-waves,south-asian-low-bun}-gold.png` (codex imagegen via imagen skill, 1254×1254; files live on store, CDN URLs verified by MediaImage id query — `preview.image.url` is null right after fileCreate, patch urls json from requery-by-id).
- 25 testimonial avatar image_pickers filled 2026-09-09 (5× `templates/index.json` + 5× each of product.json/stacked/grid-mix/thumbnails-carousel, all `shopify://shop_images/testimonial-avatar-*.png`): previously `show_image: true` + empty image rendered a visible placeholder SVG (scrolling-promotion renders `placeholder_svg_tag` when image blank — the "renders only if image != blank" note below was wrong for this section and is removed).
- **Optional empties (left empty by design, verified in section liquid)**:
  - 12× main-collection-banner (banner-left/right/top/as-background/without-image) — falls back to `collection.featured_image` (15/15 collections have covers)
  - 6× collection-tabs (3 blocks × image+icon) — image falls back to `collection.image` → first product image; icon renders only when `prefix_header == 'icon'` (set to `ordinal_number`)
  - 6× collection-list-slider (lookbook) — falls back to `collection.image`
  - 9× collection-list (collection.json 5, 404 4) — falls back to `collection.image` → first product image
  - 4× collections-showcase (index) — falls back to `collection.image`
  - 9× custom-content `bg_image` — decorative section background (section renders without it)
  - 1× image-with-text (about-us-2) — text-only section, image optional
  - 2× hero `image_mobile` (about-us-2 hero_FXtfQm, lookbook hero_9mL3W7) — desktop image renders on mobile when mobile image is blank
  - 2× lookbook image-comparison mobile images — fall back to desktop before/after images
- Zero brand remnants (`epi_`, fLAIRY, Laura, Spanish) and zero non-conforming shop_images refs in `templates/`, `sections/*-group.json`, `config/settings_data.json` (grep verified).
- All templates + group JSONs parse clean (28 files).
- **CTA audit** (`/tmp/veloura-img/audit-cta.mjs`, schema-driven, pair-aware): 124 CTA pairs checked → **0 DEAD BUTTON, 0 LINK W/O TEXT**; 13 EMPTY TEXT remain (all optional: gallery-image overlay + product richtext render `if != blank`); 4 CTA link targets verified live on store (`/collections/signature`, `/collections/golden-forever`, `/pages/contact`, `/products/twist-ring-gold`). **Caveat: this audit's pair map matched only exact `button_text`/`button_link` keys — it MISSED numbered `button_text_N`/`button_link_N` settings (slideshow, image-with-text-slider).**
- **Home-page CTA re-audit 2026-09-09** (numbered-key aware): 5 dead buttons found + fixed in `templates/index.json` — hero slide "Shop Bracelets" → `/collections/bracelets`, "Our Story" → `/pages/about-us`; 3 capsule slides "Shop the capsule" → `/collections/sakura-bloom`, `/collections/sunset-glow`, `/collections/dreamshine`. 6 "Shop by category" image cards (custom-content) were non-clickable (full-width link renders only when `button_link` set) → added per-card `button_label`/`button_link` (bracelets/earrings/necklaces/bridal/golden-forever/rings). Verified: JSON parses, 0 dead pairs, 14 resolving CTAs. Collections-showcase + featured-collection buttons intentionally have no link setting — they auto-link via `collection.url` (verified in liquid).
- CTA fixes applied 2026-09-09: `text_gJMWax` "Discover the metals"/"Discover More" → `/collections/signature` (index + lookbook); find-a-store 3× "Contact Us" → `/pages/contact`; lookbook hero "Shop now" → `/products/twist-ring-gold`; promotion-banner "Shop the Capsule" → `/collections/golden-forever`; contact-form "Enviar ahora" → "Send message" (Spanish remnant removed).

## Theme files (repo, ready to push)

- 10 templates rewritten: index, blog, 404, collection, page.lookbook, page.find-a-store, page.about-us, page.about-us-2, page.faqs, page.contact + 4 product templates (earlier).
- settings_data.json: preset "Veloura" (arapey_n4/archivo_n4, container 1580), §5 color schemes (#ffffff/#1f1a17/#b0573b/#f3ece4/#dfe8e2), instagram link, sale badge #b0573b.
- header-group.json: announcement bar (2 English blocks), header design-2, wordmark logo, main-menu, mega-menu → 6 collections.
- footer-group.json: newsletter + 3 link lists + The Atelier text, mobile-sticky-bar enabled, English popup.
- Theme check: 336 files, 138 offenses (2 errors, 136 warnings) — **2 errors are pre-existing upstream code issues, not from this work** (see Blockers). All 6 new section files are clean.
- **6 new sections built 2026-09-10** (customer-approved code change — supersedes the earlier no-code-change constraint for this task): `stats-counter`, `sticky-story`, `pinned-compare`, `image-hotspots`, `card-stack`, `magnetic-cta` — each in `sections/` + `assets/` (JS only where interaction needs it; image-hotspots is pure CSS). All wired into `templates/index.json` with Veloura brand copy and `shopify://shop_images/…` refs. Foxify conventions cloned: `color_scheme` + `m-section-padding` + inline `--section-padding-*`, `divider`, `index-section-header`, `motion-element` animations, `custom_id`/`custom_class`, `VelouraSettings.motionReduced` respected, `if (!customElements.get(...))` guards. **Schema structure follows the theme's canonical layout** (2026-09-10): General (container + color_scheme) → Section header (spacing, heading, highlight, heading_size, `heading_font_size`, heading_color, subheading, description) → section-specific content groups (Grid / Image / Media / Stage / Content) → Section padding → Section divider → Custom attributes → Animations; common groups reuse the theme's `t:sections.common.*` / `t:settings_schema.animations.*` keys (resolve via `locales/en.default.schema.json`, verified), plain English only for new section-specific labels. `heading_font_size` (px, default 72 for the 5 index-section-header sections; magnetic-cta default 0 = uses `heading_size`) applies `font-size: min(<px>, 14vw/17vw)` so headings never overflow on mobile — the theme ships no font-size rules for `.h0/.h1/.h2/.h-xl`, so this setting is what makes section headings sizable in the editor. magnetic-cta also got the standard `heading_size` select (default `h-xl`) with an explicit clamp scale in `magnetic-cta.css` (`.magnetic-cta__title.h3→.h-xl`). Browser smoke test (headless, 2026-09-10) verified: count-up incl. decimals, sticky-story step↔media sync, pinned-compare step↔state sync, card-stack sticky + scroll-progress scale + nth-child palette, magnetic pointer-follow (skips coarse/reduced), hotspot hover lift; magnetic minimal layout pins the CTA row to the bottom of the 88vh stage (re-verified after 2026-09-10 CSS fix). Card-stack fold fix (2026-09-10): card was `min-height: 60vh` on content-box → card ≈ 60vh + 80px padding with text pinned to the bottom (`justify-content: flex-end`), so the description clipped below the fold on short preview viewports (~650px); fixed with `box-sizing: border-box` + `min-height: 52vh` (content floor ~460px, text bottom ~484px at 1280×650 — fully visible, re-verified headless + vision). Card-stack full-bleed redesign (2026-09-10, customer ask: image covers the whole card + bigger gaps so text is never lost): `:has(.card-stack__art img)` scoped rules make the image absolute `inset: 0` cover (z-index −1 behind `isolation: isolate` card), copy overlays bottom-left in white over a `linear-gradient(to top, rgba(24,18,14,.78)→transparent)` scrim (palette fallback with the shape circle when no image); `margin-bottom` raised `clamp(32px,5vw,64px)` → `clamp(160px,20vw,320px)` so the next card stays below the fold until the current card's text is read (verified: 307px gaps @1535, card N text fully visible while card N+1 peeks ≤102px).

## Template walk-through (Phase 8)

| Template | Rendered OK? | Notes |
| --- | --- | --- |
| (all) | — | Not verified live — theme not pushed (customer decision) |

## Blockers

- Theme push/publish: skipped per customer ("không cần push theme"). When wanted, run (Node 22 CLI wrapper): `theme push --store veloura-demo-store.myshopify.com --password "$SHOPIFY_ADMIN_TOKEN" --unpublished --theme "Veloura"` — note current token lacks write_themes; needs an app token with theme scopes or staff access.
- 2 pre-existing theme-check code errors (upstream, unmodified — fixing = code change, G5 approval needed):
  1. `sections/product-information-tabs.liquid:275` — ValidSchema: property `templates` not allowed.
  2. `snippets/tooltip.liquid:1` — MissingAsset: `assets/tooltip.css` does not exist.
- Store display name remains `veloura-demo-store` (rename impossible via API; wordmark approved instead).
