# Editor UX Checklist

Merchant-perspective acceptance checklist. Run it once per section schema and once for `config/settings_schema.json`. Any unchecked "must" blocks delivery. The reviewer skills (`theme-uniqueness-designer`, `theme-performance-engineer`, `theme-accessibility-engineer`, `theme-qa-reviewer`) use this checklist when auditing the editor surface.

How to run: open each schema exactly as the merchant sees it (Shopify admin -> Online Store -> Themes -> Customize -> add the section). If you cannot open the editor, read the schema JSON and simulate the editor state on paper, then say so in `docs/editor-architecture.md`.

## Understandable without the codebase

- [ ] Every label names an outcome the merchant sees, not a mechanic. Rewrite any label that mentions a CSS property, a variable, a version, a class, a unit the merchant never chose, or an implementation term.
- [ ] Bad patterns absent: "Enable offset top V2", "Content align x", "Grid item multiplier", "Padding top", "Section gap override", "Visibility class", "Enable sticky-scroll-progress".
- [ ] Good patterns present where relevant: "Content position", "Image layout", "Products per row", "Show ingredient badges", "Enable quick add", "Show on mobile", "Button style".
- [ ] Option values inside `select`/`radio` are merchant language ("Left / Center / Right", "Compact / Comfortable / Spacious") — never code names ("flex-start", "space-between", "sm/md/lg" without a legend).
- [ ] A merchant who has never opened the repo can configure the section without touching Liquid. Check: no setting asks for a handle, class, breakpoint, or technical identifier.
- [ ] `info` strings are present only where the label is genuinely ambiguous, and they clarify in one line.
- [ ] All labels use translation keys (`t:`) with entries in `locales/` — no raw strings baked into the schema.

## Grouping and ordering

- [ ] Settings grouped with `header` sidebar settings: 2-5 groups per section ("Content", "Layout", "Design", "Advanced"), ordered by merchant priority, first group = the content the merchant most often changes.
- [ ] No group contains a single setting (merge or cut).
- [ ] Group titles are merchant language, not component names ("Typography", not "TextBlockHeaderStyles").
- [ ] Within a group, order follows the visual build order of the section: heading, content, media, layout, behavior.

## Defaults are safe

- [ ] Every content-bearing and layout-bearing setting has a default — except types that do not support a schema `default` (current docs: `image_picker`, `product`, `collection`, `blog`, `article`, `page`, `video`).
- [ ] Adding the section with zero interaction reproduces the reference design from `docs/design-system.md`.
- [ ] Text/textarea defaults contain real sample content where the design shows copy, so the section never renders empty.
- [ ] `image_picker` and other resource pickers cannot carry a schema default; every image-bearing section renders a placeholder/fallback (`placeholder_svg_tag` or fallback asset) until the merchant uploads, so a fresh section never renders broken.
- [ ] Global settings (`settings_schema.json`) all have defaults (except non-default types like favicon `image_picker` / `video`); layout renders placeholders/fallbacks so the theme renders complete with a fresh install.

## Limits prevent broken layouts

- [ ] Every `range` has `min`, `max`, `step`, and a `default` strictly inside the range.
- [ ] Max values are provably layout-safe: "Products per row" bounded by grid capacity, "Heading size" bounded so it cannot overflow, "Autoplay speed" bounded to sane seconds. No max is a free number typed without math.
- [ ] Every block-type section has a `max_blocks` justified in `docs/editor-architecture.md` (performance + layout sanity).
- [ ] No setting lets the merchant produce broken output by itself (e.g. an empty required text field with no default, a range that allows negative spacing).
- [ ] Number of settings per section is bounded: no section buries the merchant under 30+ micro-settings. If a section needs many settings, split into blocks with per-block settings instead.

## Conditional settings reduce clutter

- [ ] Dependent settings are conditionally visible: "Autoplay speed" only when "Autoplay" is on, "Slide interval" only when "Enable carousel" is on.
- [ ] Conditions match the current platform mechanism (verified on shopify.dev), and every condition key references a setting id that exists in the same schema.
- [ ] No critical setting is hidden: the merchant cannot save a state that produces broken output because a needed setting was invisible.
- [ ] Conditional chains have no dead ends: if setting B depends on A, and A is off by default, B's default state is still valid.

## Blocks and presets

- [ ] Repeated content uses blocks (merchant can add/remove/reorder), with merchant-language block names and their own safe defaults.
- [ ] `max_blocks` present on every block section, with justification.
- [ ] Section preset exists, is merchant-named, and its block/settings values mirror the reference design.
- [ ] `templates/*.json` compose sections per `docs/page-information-architecture.md`, and every composed section exists with a valid preset.
- [ ] Block settings follow the same label/default/limit rules as section settings.

## Dynamic sources

- [ ] Product/media-rich sections wire dynamic sources on product, collection, image, and URL settings (per current docs).
- [ ] Editorial sections wire `blog`/`page`/`article` and `link_list` where the content is store data.
- [ ] Dynamic-source binding never replaces a sensible default; it is an extra capability on top.
- [ ] No manual-workaround settings (text field asking for a product handle) exist where a dynamic source is the correct solution.

## Global settings (settings_schema.json)

- [ ] Global scope only: colors, typography, social links, favicon, store-wide behaviors — no per-section layout trivia.
- [ ] Groups ordered by merchant priority, with defaults on everything.
- [ ] `config/settings_data.json` initial values match schema defaults and key naming.

## Anti-pattern sweep (final pass)

- [ ] No setting exists whose merchant goal cannot be named from `docs/feature-inventory.md` / `docs/commerce-thesis.md`. If you cannot name the goal, delete the setting.
- [ ] No CSS property has been turned into a setting that does not gate content or meaning (Rule 2 sweep).
- [ ] The theme's DNA (design system) survives every possible merchant configuration reachable from the editor.
- [ ] `node scripts/validate-schemas.mjs <theme-root>` passes: all schema JSON parses; every setting referenced in Liquid exists in the schema; no missing references reported.
