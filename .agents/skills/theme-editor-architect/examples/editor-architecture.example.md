# Theme Editor Architecture — Example

Worked example of a completed `docs/editor-architecture.md` entry for a "Featured collection" section. Use it as the bar for tone, completeness, and rationale depth. The section is fictional but realistic: a product-grid section with blocks, a carousel option, and dynamic sources.

## Good vs bad label pairs

The left column is what the schema must say; the right column is the anti-pattern this skill exists to prevent.

| Merchant label (use this) | Code label (reject) | Why |
|---|---|---|
| Content position | Content align x | "align x" names the internal axis; "position" names the outcome the merchant chooses. |
| Image layout | Grid item multiplier | The merchant picks how images sit in the grid, not the math that sizes them. |
| Products per row | Columns desktop / Columns mobile / grid-cols-lg | One merchant-meaningful number replaces three responsive CSS knobs. |
| Show ingredient badges | Enable product-meta-badges V2 | Merchants know what badges are; they do not know your component version. |
| Enable quick add | show_atc_button_variant_desktop | The merchant toggles a behavior, not a render variant. |
| Button style | btn-style flex-1 px-6 | A curated choice ("Solid / Outline / Text") cannot break the design; a class dump can. |
| Heading size | font-size-md-lg-responsive | The merchant picks a size; the theme owns the responsive breakpoints. |
| Slide automatically | autoplay-timer ms | A checkbox for behavior, not a millisecond field hidden behind a variable name. |
| Spacing | padding-top, padding-bottom, margin-x, gap-y | A compound "Compact / Comfortable / Spacious" choice or nothing; never four edge sliders. |

## Section: Featured collection (`sections/featured-collection.liquid`)

Merchant job: feature a curated set of products on the homepage so shoppers see bestsellers/new arrivals without browsing the catalog. Source goals: feature-inventory "Homepage product showcase", commerce-thesis "Reduce time-to-first-purchase".

### Settings

| # | Group | Setting id | Type | Label (merchant) | Default | Limit | Conditional on | Dynamic source | Rationale |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Content | heading | text | Heading | "Featured products" | n/a | none | no | Merchants rename the section headline; default mirrors reference design. |
| 2 | Content | show_heading | checkbox | Show heading | true | n/a | none | no | Lets merchants keep a clean grid without removing the section. |
| 3 | Content | collection | collection_list | Collections | (default collection) | n/a | none | yes | The core content binding; dynamic source lets merchants swap in any collection from the admin. |
| 4 | Content | show_product_vendor | checkbox | Show brand name | false | n/a | none | no | Merchants may hide vendor for private-label stores; default matches design mock. |
| 5 | Layout | products_per_row | range | Products per row | 4 | 2-6, step 1 | none | no | Max 6 bounded by 12-column grid: 6 cols per card keeps cards > 140px at 1024px container; 7 would overflow the reference card min-width. |
| 6 | Layout | mobile_products_per_row | select | Products per row on mobile | 2 | 2 / 2 / 1 options only | none | no | Curated options only, so a phone layout can never show unusable tiny cards. |
| 7 | Layout | image_ratio | select | Image layout | "Portrait 3:4" | Portrait 3:4 / Square 1:1 / Landscape 4:3 | none | no | Changes the feel of the grid; all three ratios are pre-verified to fit the card frame. |
| 8 | Layout | enable_carousel | checkbox | Enable carousel | false | n/a | none | no | Off by default keeps the reference static grid; carousel is an opt-in behavior. |
| 9 | Layout | autoplay | checkbox | Slide automatically | false | n/a | enable_carousel == true | no | Meaningless without a carousel; hidden until carousel is on. |
| 10 | Layout | autoplay_speed | range | Slide interval (seconds) | 5 | 2-10, step 1 | autoplay == true | no | Only visible when autoplay is chosen; max 10s keeps the carousel feeling alive. |
| 11 | Design | color_scheme | color_scheme | Color scheme | "background-1" | n/a | none | no | One curated scheme switch replaces five color pickers; cannot break contrast. |
| 12 | Design | heading_size | select | Heading size | "Medium" | Small / Medium / Large | none | no | Three pre-set sizes; the theme owns font-size tokens. |
| 13 | Advanced | section_id_override | text | HTML anchor | "" | n/a | none | no | Lets merchants deep-link to the section; blank default means no anchor emitted. |

Grouping rationale: Content first (what the merchant edits daily), then Layout (how the grid behaves), then Design (recolor/resize), Advanced last (rarely touched). "Products per row" is one setting with a safe max instead of three responsive columns knobs (rejected: "Columns desktop", "Columns tablet", "Columns mobile").

Defaults rationale: adding the section with zero interaction renders the reference design: heading "Featured products", default collection, 4-per-row portrait grid, no carousel, primary color scheme.

Limit rationale: `products_per_row` max 6 — the section container is 1200px max, card min-width 140px, so 6 cards = 180px each after gutters (safe), 7 = 154px (below min, cards would squeeze text). `autoplay_speed` 2-10s — below 2s is unreadable, above 10s stalls the loop.

### Blocks

| Block type | Name (merchant) | max_blocks | Block settings | Rationale |
|---|---|---|---|---|
| featured_product | Featured product | 8 | product (product, "Product", no default, dynamic source yes); show_price (checkbox, "Show price", true); show_quick_add (checkbox, "Enable quick add", false) | Merchants curate a short hero list of specific products without building a collection. max_blocks 8 = one full row at 8 per row; more would push the section past one viewport and double first-render cost. |

Preset: "Featured collection" — blocks: one `featured_product` block (no schema default — `product` does not support `default`; dynamic-source bound, Liquid renders a placeholder card when no product is picked); settings: heading "Featured products", products_per_row 4. Composed in `templates/index.json`.

Dynamic sources: `collection` (collection_list) and block `product` (product) are dynamic-source bound; the merchant can also click "Change" in the editor and pick from store data directly. `image_ratio` has no dynamic source and needs none — it is a layout choice, not content.

Conditional settings: `autoplay` visible only when `enable_carousel == true`; `autoplay_speed` visible only when `autoplay == true`. Mechanism: `visible_if` verified against the live section schema docs. No hidden setting can produce broken output: with carousel off, `autoplay` state is irrelevant and the grid renders.

### Anti-pattern audit for this section

- [x] Labels merchant-understandable (no code vocabulary)
- [x] No CSS-property-as-setting (spacing, shadows, radii are NOT exposed; "Spacing" as an edge slider is rejected in favor of fixed design-system rhythm)
- [x] Every setting maps to a named merchant goal
- [x] Defaults + limits prevent broken layouts

Validation: `node scripts/validate-schemas.mjs <theme-root>` — schema JSON parses; every setting id referenced in the section's Liquid exists in the schema.
