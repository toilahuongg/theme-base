# Showcase Setup — checklist

Run in order. Every box must be checked or marked BLOCKED with a reason before yielding.

## Store confirmation
- [ ] `shopify-store list` read (registry); default store noted
- [ ] Asked the customer which store to target (ask tool); choice recorded
- [ ] Chosen store credentials resolved via `shopify-store get <store>` (added to registry with client-id/secret if missing)
- [ ] Token verified against the chosen store (`shopify-store scopes` + themes query succeed)

## Environment
- [ ] Shopify CLI runs (`shopify version`; Node >= 22 if it failed before)
- [ ] Token verified via `shopify-store scopes <store>` (exit 0; granted scope handles listed)
- [ ] Token scopes cover the planned work (themes/products/content/menus — note missing ones)
- [ ] Repo theme synced with store theme (shopify theme pull or confirmed match)

## Inventory
- [ ] Template-referenced handles listed (products, collections, pages, blogs)
- [ ] Store content queried; gap list written to docs/showcase-state.md
- [ ] Empty blocks in templates identified (index.json collection/product blocks)

## Design (Phase 3)
- [ ] Brand identity written: name, story, voice, tagline, logo treatment
- [ ] Niche + shopper decided (commerce thesis)
- [ ] Page → sections map for every page type, using only real theme sections
- [ ] Config plan (layout, fonts, menus, presets) written
- [ ] Color schema: >= 4 colors, background/foreground paired, contrast >= 4.5:1
- [ ] Asset list complete (imagen; no video), each with ratio + style direction
- [ ] Resource list: products, collections, pages, blog, menus — all tied to template references
- [ ] docs/showcase-design.md written

## Images (Phase 4)
- [ ] All assets in the design doc generated (imagen) or supplied (verify output file exists, not just exit code)
- [ ] All images uploaded to store Files (scripts/upload-images.mjs); slug → {id,url,filename} in urls-json
- [ ] No image referenced before it exists on the store

## Products (Phase 5)
- [ ] All template-referenced products exist on the store with matching handles
- [ ] Products have: title, price, inventory, 1-4 images, real description in brand voice
- [ ] Handle → id map recorded in docs/showcase-state.md

## Collections, pages, blog (Phase 6)
- [ ] All template-referenced collections exist with image + product membership
- [ ] Pages for theme page templates created (about-us, lookbook, find-a-store, faqs, contact...) in brand voice
- [ ] Blog exists with >= 6 articles, each with image and real content in brand voice

## Menus (Phase 7)
- [ ] `main-menu` / `footer` (per settings_data.json) exist with live links only
- [ ] No dead menu links

## Theme files & settings (Phase 8)
- [ ] No empty blocks left in any template JSON
- [ ] All image refs use `shopify://shop_images/<filename>` — no raw CDN URLs, no empty required refs
- [ ] settings_data.json matches the design doc: colors, fonts, social links, layout, presets
- [ ] Section presets present so Theme Editor shows a populated default
- [ ] Dead presets removed from settings_data.json (one live preset)
- [ ] Metaobjects only if the theme uses them
- [ ] G5: any section/snippet/JS/CSS/Liquid change proposed to the customer (WHAT + HOW) and approved before editing

## Image audit (Phase 8.5)
- [ ] `scripts/audit-image-pickers.mjs <repo> <urls-json>` run; 0 required-EMPTY, 0 MISSING FILE, 0 MISSING ASSET, 0 WEIRD
- [ ] Each remaining EMPTY verified-optional by reading section liquid (fallback/conditional render) and noted in state doc
- [ ] `scripts/audit-cta.mjs <repo>` run; 0 DEAD BUTTON, 0 LINK W/O TEXT
- [ ] Each remaining EMPTY TEXT verified-optional (`if != blank`) by reading section liquid
- [ ] Every CTA link target (`/collections/...`, `/products/...`, `/pages/...`) verified to exist on the store via Admin GraphQL
- [ ] Zero foreign-language / brand-remnant button labels (Enviar, Comprar, español, ...)
- [ ] Grep: zero brand remnants + zero non-`shopify://shop_images/` refs in templates/, sections/*-group.json, config/
- [ ] All template + group JSONs JSON.parse clean

## Push & verify (Phase 9)
- [ ] Theme pushed to the confirmed store
- [ ] Every template walked on the real storefront (home, product variants, collection variants, pages, blog, article, cart, search, 404, password, customers)
- [ ] docs/showcase-state.md written
- [ ] Report delivered: store URL, preview link, created-resource counts, evidence, blockers
