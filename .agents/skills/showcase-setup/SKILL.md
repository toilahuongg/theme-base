---
name: showcase-setup
version: 1.1.0
description: "Sets up a Shopify theme showcase/demo storefront — creates products, collections, pages, blog content, menus, theme settings, and template files, executing store operations via the shopify-store-manager skill (shopify-store graphql/rest/scopes), pushing the theme with the registry token, generating imagery via the imagen skill, and authoring GraphQL with shopify-admin. Use when asked to create, set up, or build a showcase or demo store for a Shopify theme. ALWAYS asks the customer which store to target before any store operation."
triggers:
  - showcase
  - showcase store
  - demo store
  - theme showcase
  - tạo showcase
  - build showcase
  - /showcase-setup
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Ask
  - Todo
---

# Showcase Setup

Builds a complete, presentation-ready showcase that reads as ONE real brand: a defined brand identity (name, story, voice, colors, typography) driving real products, collections, pages, blog content, menus, theme settings, and template files that render without empty blocks or placeholder text. The showcase is created on a store the CUSTOMER chooses — never on a store you assume.

## Hard gates

1. **G1 — Ask the store first (mandatory).** Before any store operation (read, write, push), use the `ask` tool to confirm the target store:
   - Option A: a store registered in the `shopify-store` registry (`shopify-store list`).
   - Option B: another store — let the customer type the `*.myshopify.com` domain.
   - Ask in the customer's language. Proceed ONLY with the chosen store. Resolve its token from the `shopify-store` registry (`shopify-store get <store>`); if it is not registered, ask the customer for the store's credentials — prefer `client_id`/`client_secret` (+ `refresh_token` when available) so the tool can auto-mint expiring tokens: `shopify-store add <store> --client-id <id> --secret <secret> [--refresh-token <token>]`. A pasted admin token also works but skips auto-minting.
2. **G2 — Access verified.** Confirm the configured credentials actually work against the chosen store: `shopify-store scopes <store>` (exits 1 on invalid token), then list themes via Admin GraphQL (`shopify-store graphql <store> --query '{ themes(first: 5) { edges { node { id name role } } } }'`). ACCESS_DENIED or auth errors block the run until the customer supplies valid credentials.
3. **G3 — Tooling works.** Shopify CLI requires Node >= 22. If `shopify version` fails with `node:module does not provide an export named 'enableCompileCache'`, switch Node (`nvm use 22` or equivalent) before running any CLI command.
4. **G4 — No fake content.** Every product, page, and article uses real, authentic copy and imagery. No Lorem Ipsum, no placeholder URLs, no empty blocks left behind. Every image reference must resolve to a file that actually exists on the store.
5. **G5 — Code changes need approval; content does not.** JSON is content — edit freely:
   - **Content (no approval):** `templates/*.json`, section group JSONs (`sections/*-group.json`), `config/settings_data.json`, `locales/*.json`.
   - **Code (STOP and ask — WHAT will change, HOW, then wait):** `sections/*.liquid`, `snippets/`, `assets/` (JS/CSS/images), `layout/`, `templates/*.liquid`. Never silently modify or add code files.

## Skills this skill delegates to

| Work | Skill | Notes |
| --- | --- | --- |
| Resolve store credentials + execute store operations (GraphQL/REST) | `shopify-store-manager` (trigger `/shopify-store`, CLI `shopify-store`) | `shopify-store graphql <store> --query '...'` (Admin API, auto auth header), `shopify-store rest <store> --path '...'`, `shopify-store scopes <store>` for fast token/scope check, `shopify-store token <store>` to mint on demand. Look up credentials with `get`/`env` before asking |
| Author Admin GraphQL queries/mutations | `shopify-admin` | Use for writing correct operations (productCreate, collectionCreate, pageCreate, menuCreate...) before executing them |
| Create/update store content with the registry token | `shopify-store graphql <store> --query '...'` / `shopify-store rest <store>` | Token-driven writes go through the tool (it fills endpoint, auth header, version). `shopify store execute` does NOT accept a token — it needs OAuth auth from `shopify store auth` |
| Push the theme | `shopify theme push --password <token>` (env `SHOPIFY_CLI_THEME_TOKEN` — token from registry) | See `shopify-use-shopify-cli` for CLI guidance |
| Run store operations when OAuth is set up | `shopify-use-shopify-cli` (`shopify store auth` + `shopify store execute`) | Only when the customer has completed OAuth login |
| Generate product/lifestyle/banner images | `imagen` | Use for any imagery the showcase needs that the customer has not supplied |

Read each delegated skill's instructions (skill://name) before using it.

## Image reference format (customer-confirmed)

All image refs in templates/section-group JSONs MUST use the `shopify://shop_images/<filename>` scheme — NOT raw CDN URLs (`https://cdn.shopify.com/...`), NOT empty strings for required images. This is the format the customer accepted as correct; re-introducing CDN URLs is a regression. Optional image_pickers stay empty ONLY when the section liquid falls back to collection/product images or conditionally renders (see Image audit).

## Bundled scripts (this skill's `scripts/`)

- `node scripts/audit-image-pickers.mjs [repoPath] [image-urls.json]` — schema-driven audit of every `image_picker` setting across `templates/` + `sections/*.json` against each section's `{% schema %}`. Flags: `EMPTY` (required → fill; optional → verify fallback in liquid), `MISSING FILE: <name>` (shopify:// ref not in uploaded set), `MISSING ASSET: <file>` (asset not in repo `assets/`), `WEIRD VALUE`. Omit the urls-json arg to skip MISSING FILE checks.
- `node scripts/audit-cta.mjs [repoPath] [out-file]` — schema-driven CTA audit. Flags `DEAD BUTTON` (button label set but its paired link empty — renders `aria-disabled`), `LINK W/O TEXT` (link set, label empty), `EMPTY TEXT` (richtext/text content empty), and lists every `/collections/...` `/products/...` `/pages/...` path ref for store-handle verification. Checks CTA pairs ONLY against keys the section schema actually declares (instances often carry both `button_link` and `button_url`; the schema picks one). EMPTY TEXT is acceptable when liquid renders `if != blank` — verify per section, same discipline as image_pickers.
- `node scripts/upload-images.mjs <store> <urls-json> <slug> <image-file> [alt]` — upload one image via stagedUploadsCreate → PUT → fileCreate → requery-by-filename. Or pass a directory to upload every image inside it. Requires `SHOPIFY_ADMIN_TOKEN`. Appends results to `<urls-json>` (slug → {id, url, filename}) — feed the same file to the audit script. Known API gotchas are encoded in the script header; see also Upload flow below.

## Workflow

### Phase 0 — Confirm the store (G1)

- Read the `shopify-store` registry: `shopify-store list` (tokens masked) and `shopify-store default`.
- `ask`: "Which store should the showcase be created on?" → a registered store | another store.
- If the customer names a store, resolve its token with `shopify-store get <store>` (or `shopify-store env <store>`; both auto-mint when credentials are saved). If the store is not in the registry, ask the customer for credentials and save with `shopify-store add <store> --client-id <id> --secret <secret>` (plus `--refresh-token` if they have one) — never paste secrets back into chat; they persist in the registry, not in the repo.
- Write the chosen store domain into the showcase state file (see Phase 9).

### Phase 1 — Verify access and environment (G2, G3)

- Use the token from Phase 0 to confirm access: `shopify-store scopes <store>` lists granted scope handles and exits 1 on an invalid token (fast preflight; the tool auto-mints/retries once on 401 when credentials are saved). Then list themes via Admin GraphQL (`shopify-store graphql <store> --query '{ themes(first: 5) { edges { node { id name role } } } }'`). ACCESS_DENIED or auth errors block the run until the customer supplies valid credentials (saved via `shopify-store add`).
- Confirm scope coverage for the work:
  - `read_themes`/`write_themes` (theme push),
  - products, collections, pages, articles (content creation),
  - `read_menus`/`write_menus` (menu creation — if the token lacks it, create menus via the store admin and tell the customer).
- Make Shopify CLI runnable (Node >= 22; `shopify version` passes).
- Confirm the repo theme matches the store theme before editing (`shopify theme pull`, or the repo's own sync script if present) to avoid overwriting drifted files.

### Phase 2 — Inventory the target

- Read `docs/showcase-plan.md` if it exists; otherwise scan `templates/*.json` for referenced handles (collection/product/page references, empty `""` blocks).
- Query the store: products, collections, pages, blogs, menus. Build the gap list: which handles the templates reference but the store lacks; which template pages have no store page (`page.about-us`, `page.lookbook`, `page.find-a-store`, `page.faqs`, ...).
- Record gaps in the showcase state file.

### Phase 3 — Brand & showcase design

The showcase must read as ONE real brand: a name, story, voice, and visual identity that every page, product, and image obeys. Answer every question below BEFORE creating anything; write the decisions to `docs/showcase-design.md` (template in `templates/showcase-design.md`). Sibling skills may own parts of this if present in the repo (`.agents/skills/`): `commerce-ux-architect` (niche, shopping model, page IA) and `theme-art-director` (design system, color, typography). Read their SKILL.md and reuse their artifacts if present (`docs/commerce-thesis.md`, `docs/design-system.md`); otherwise produce the consolidated design doc directly.

1. **Brand identity** — brand name, one-sentence story, voice/tone, logo treatment, tagline. Every copy decision in later phases must match this voice.
2. **Niche & shopper** — which industry/shopper the showcase targets (one clear niche; commerce thesis: who buys, how they decide, navigation/discovery/search model).
3. **Page → sections map** — for every main page type (home, PDP, collection, blog, pages), which sections/blocks from the theme's ACTUAL section inventory (`sections/`, template JSONs), in what order, and what each block does. Never invent section names that don't exist in the theme.
4. **Config plan** — `config/settings_data.json` targets: layout width, fonts, color scheme assignments, announcement bar, header/footer menus, section presets.
5. **Color schema & typography** — 4+ colors (background, text, accent, surface...) with scheme-to-section assignment; font pairing (heading/body); must satisfy the Theme Store minimum (4+ colors, background paired with foreground).
6. **Asset list** — every image/SVG the showcase needs: purpose, page, section/block, dimensions/ratio, style direction → generate with `imagen` in Phase 4. **No video assets** (theme video sections use supplied video or stay empty).
7. **Resource list** — every resource to create in Phases 5-7: products (handle, title, price, variants, images), collections (handle, membership, banner), pages (handle, template), blog + articles, menus — each tied to a template reference from Phase 2 and to the brand identity.

### Phase 4 — Images

- For every asset in the Phase 3 asset list (product shots, collection banners, page heroes, blog images, SVG graphics): generate with the `imagen` skill (match the theme's art direction and the Phase 3 color schema).
- Verify each generation actually produced a file (imagen may fall back to a relay when codex auth is broken; check the output directory, not the exit code). If the codex path fails, use the relay fallback explicitly: `IMAGEN_SKIP_CODEX=1 <imagen>/bin/imagen.sh "<prompt>" --count 1 --out <slug> --repo <dir>`. Use simple lowercase slugs for `--out` — do NOT derive slugs with `sed 's/.*/\L&/'` (BSD sed lacks `\L` and mangles the directory name).
- Save generated images locally in a working dir (e.g. `/tmp/<showcase>-img/gen/<slug>/`); upload them before any template references them (Upload flow below).
- Never reference images that do not exist on the store.

### Upload flow (staged uploads — 2026-07 API shapes)

1. `stagedUploadsCreate(input:[{resource: IMAGE, filename, mimeType, httpMethod: PUT, fileSize: "<bytes-as-string>"}])` → `stagedTargets[0].url` + `.resourceUrl`. `resource: IMAGE` (NOT `SHOP_IMAGE` — ACCESS_DENIED); `fileSize` MUST be a string.
2. Plain PUT the file bytes to `target.url` (`curl -sS -X PUT "<url>" -H "Content-Type: image/png" --data-binary @<file> -o /dev/null`). Do NOT append `parameters`.
3. `fileCreate(files:[{originalSource: <resourceUrl>, filename, contentType: IMAGE, alt}])` → `files[0].id`. File has NO `url`/`filename` fields; URL is `preview.image.url` (null immediately after create). Requery:
   `query { files(first:1, query:"filename:<name>") { nodes { id preview { image { url } } } } }` — the `filename:` filter works; `id:` filter does NOT.
4. On error: check `fileCreate.files[0].fileErrors` (top-level `fileErrors` does NOT exist on fileCreate; `userErrors` may be absent too).
5. Scripted: `node scripts/upload-images.mjs <store> <urls-json> <slug> <file>` (see Bundled scripts).

### Phase 5 — Products

- For each product the showcase needs (templates' product references first, then catalog depth to fill collection pages): create via Admin GraphQL `productCreate` executed with `shopify-store graphql <store> --query '...'` (author the query with `shopify-admin`; the tool fills in endpoint, auth header, and API version).
- Note: `shopify store execute` does NOT accept a token flag — it uses OAuth auth stored by `shopify store auth`. Use `shopify-store graphql` for token-driven creation; use `shopify store auth` + `shopify store execute` only when the customer has completed OAuth login.
- Include: title, handle (must match template references), vendor/type, price, compare-at price where used, inventory, at least 1-4 images, and a real description in the showcase language.
- Record handle → id in the state file.
- Attach product images with `productSet(input:{id, files:[{id}]})` after uploading (2-3 images per product reads best).

### Phase 6 — Collections, pages, blog

- Collections: create the collections the templates reference (homepage `collection` blocks, collection banner templates, nav) with `shopify-store graphql <store> --query '...'` (`collectionCreate`). Set image, description, and product membership. Attach covers with `collectionUpdate(collection:{id, image:{src}})` — note: NO `id:` arg on the mutation, and the image input uses `src`.
- Pages: create the pages the theme's page templates need (about-us, lookbook, find-a-store, faqs, contact...) with `shopify-store graphql <store> --query '...'` (`pageCreate`). Use authentic copy matching the theme's locale and the customer's brand.
- Blog: ensure at least 6-8 articles exist in the theme's blog (`blogCreate`/`articleCreate` if missing) so `blog.json`/`article.json` render populated; each with an image and real content. Attach article images with `articleUpdate(id, article:{image:{url}})` — `ArticleImageInput` uses `url`, NOT `src`.

### Phase 7 — Menus

- Create/update the menus the theme's settings reference (default `main-menu` and `footer`; check `config/settings_data.json`) with `shopify-store graphql <store> --query '...'` (`menuCreate`) or `shopify-store rest <store> --path 'menus.json' --method POST --data '{...}'`.
- Menu items point at real resources: collections, products, pages created in Phases 5-6. No dead links.
- If the token lacks menu scopes, instruct the customer to create them in the store admin, and block Phase 9 until confirmed.

### Phase 8 — Theme files and settings

- Fill every empty block in the JSON templates (`templates/index.json` and others) with the handles created above. JSON templates are content — edit freely (G5).
- All image refs use `shopify://shop_images/<filename>` (see Image reference format) — never raw CDN URLs, never empty for required images.
- Update `config/settings_data.json` to match the design doc (§4-5): colors (4+ color scheme), fonts, social links, logo, announcement bar, layout — coherent with the brand identity.
- Add/verify `presets` for main sections so the Theme Editor shows a populated default.
- Add metaobject definitions/entries only if the theme actually uses metaobjects (check `templates/metaobject/` and sections).
- **G5 applies here:** if the design reveals the theme's existing code cannot deliver (a section/block is missing, a behavior needs JS/CSS, an asset must be added), do NOT modify code. Stop, report to the customer WHAT is missing and HOW you propose to change it (which file, what change), and wait for approval before touching sections/, snippets/, assets/, layout/, or any Liquid.

### Phase 8.5 — Image audit (mandatory before Phase 9)

Run the schema-driven audit and resolve every required empty:

1. `node scripts/audit-image-pickers.mjs <repoPath> <urls-json>` (Bundled scripts). Feed it the same urls-json the upload script appended to, so uploaded files are in the checked set.
2. Resolve until **0 required-EMPTY, 0 MISSING FILE, 0 MISSING ASSET, 0 WEIRD**:
   - `EMPTY` on a setting that renders a placeholder (`placeholder_svg_tag`, `<div class="m-image">` fallback) → fill with `shopify://shop_images/<filename>`; generate the image first if none exists.
   - `EMPTY` is acceptable ONLY after reading the section liquid and confirming a fallback: collection refs → `collection.image`/`featured_image`/first product image; testimonial avatars → rendered only `if image != blank`; decorative `bg_image` → section renders without it; mobile images → desktop image shown when blank; icons → rendered only under a specific `prefix_header` mode.
   - `MISSING FILE` / `MISSING ASSET` → always fix (broken reference = G4 violation).
   - Keep a per-type note of which empties were verified-optional and why (feed the final section of docs/showcase-state.md).
3. **CTA audit** — `node scripts/audit-cta.mjs <repoPath>` (Bundled scripts), same discipline:
   - `DEAD BUTTON` → always fix: fill the paired link with a real store handle (`/collections/<h>`, `/products/<h>`, `/pages/<h>`) — verify the handle exists on the store via Admin GraphQL before writing it.
   - `LINK W/O TEXT` → clear the orphan link (or add a label).
   - `EMPTY TEXT` → acceptable only when liquid renders `if != blank`; verify per section. Empty `richtext` content that renders a bare wrapper → fill or disable the block.
   - Also grep for foreign-language button labels / brand remnants (`Enviar`, `Comprar`, `español`, ...) — a single non-brand-label button is a G4 violation.
   - Sections whose button links derive from `collection.url` / product URLs (featured-collection, collections-showcase) are NOT dead when the label exists — the link comes from the referenced resource.
4. Grep-verify: zero brand remnants, zero non-`shopify://shop_images/` refs in `templates/`, `sections/*-group.json`, `config/settings_data.json`. All template JSONs must `JSON.parse` clean.
5. Clean up dead presets in `config/settings_data.json` (remove themes that were replaced; keep one live preset).

### Phase 9 — Push, verify, report

- Push the theme: `shopify theme push` (or via Admin API) using the chosen store's token from `shopify-store env <store>`. If the customer says no push, respect that — repo + store content are the deliverable.
- Walk every template on the real storefront (home, each product template variant, each collection banner variant, pages, blog, article, cart, search, 404, password, customers): no empty blocks, no broken links, images load, and the page reads as the designed brand (colors, fonts, copy voice match the design doc).
- Write `docs/showcase-state.md` (template in `templates/showcase-state.md`): chosen store, theme id, resource handle → id map, image audit result (checked/filled/optional-by-fallback counts), per-template verification result, remaining blockers.
- Report: store URL, preview link, what was created (counts), verification evidence, blockers.

## Anti-patterns

- Creating anything on a store the customer did not choose, or silently reusing a store without confirmation.
- Building pages/products that contradict the design doc (wrong colors, fonts, or copy voice) — the showcase must read as one brand.
- Modifying or adding sections/JS/CSS/Liquid without asking the customer first (G5) — state WHAT and HOW, wait for approval. (JSON templates, section-group JSONs, settings_data.json are content — no approval needed.)
- Pushing a theme with empty product/collection blocks or placeholder text still in place.
- Referencing images that were never uploaded, or using raw CDN URLs where `shopify://shop_images/<filename>` is required.
- Creating menus/pages without verifying the theme actually references them.
- Skipping the storefront walk-through and claiming "done" from file edits alone.
- Skipping the Phase 8.5 image audit and claiming "no empty image_pickers" from grep alone.
- Executing store mutations without first checking the token has the required scopes.
