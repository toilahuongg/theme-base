# Theme Editor Architecture

Template. Copy to `<theme-root>/docs/editor-architecture.md` and fill every `[...]` placeholder. Keep one section entry per theme section; the example at `examples/editor-architecture.example.md` shows a completed entry.

Sources verified: [input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings), [sidebar settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/sidebar-settings), [dynamic sources](https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources), [section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema), [theme blocks schema](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema), [settings_schema.json](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json). Verified on [date]. Anything marked UNVERIFIED was not confirmed against shopify.dev and must be before submission.

## 1. Global settings (config/settings_schema.json)

Design principle: [one sentence: what merchants can change store-wide and why]

| Group | Setting id | Type | Label (merchant) | Default | Limit | Dynamic source | Rationale |
|---|---|---|---|---|---|---|---|
| [Group] | [id] | [type] | [label] | [default] | [min/max/step or n/a] | [yes/no] | [why it exists, merchant goal] |

Notes: [rationale for group order, which design-system tokens are exposed and which are deliberately NOT exposed]

## 2. Per-section editor design

### Section: [section name] (`sections/[file].liquid`)

Merchant job: [what the merchant is trying to achieve with this section, from feature-inventory / commerce-thesis]

#### Settings

| # | Group | Setting id | Type | Label (merchant) | Default | Limit | Conditional on | Dynamic source | Rationale |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Content | [id] | text | [label] | [default] | [maxlength/n/a] | [none / "Show heading" == true] | [yes/no] | [why it exists] |
| 2 | Layout | [id] | range | [label] | [default] | min-max step | [none] | [no] | [why the max is safe] |

Grouping rationale: [why these groups, this order; what was merged or cut]

Defaults rationale: [how a fresh add reproduces the reference design]

Limit rationale: [per range: the layout math that bounds max; per max_blocks: performance/layout reasoning]

#### Blocks

| Block type | Name (merchant) | max_blocks | Block settings (id / type / label / default / limit) | Rationale |
|---|---|---|---|---|
| [type] | [name] | [n] | [setting rows] | [why blocks here, what merchants add/remove/reorder] |

Preset: [preset name and starter block/setting values, and which template JSON composes it]

Dynamic sources: [which pickers are dynamic-source bound and why]

Conditional settings: [list each conditional pair and the exact condition; note the mechanism version verified]

#### Anti-pattern audit for this section

- [ ] Labels merchant-understandable (no code vocabulary)
- [ ] No CSS-property-as-setting (Rule 2)
- [ ] Every setting maps to a named merchant goal
- [ ] Defaults + limits prevent broken layouts

## 3. Preset and template composition

| Template | Sections composed (preset names) | Rationale |
|---|---|---|
| [index] | [section A (preset X), section B (preset Y)] | [why this composition] |

## 4. Dynamic source coverage

[Table of section -> dynamic-source-enabled settings. Note any merchant data the editor does NOT expose and why that is deliberate.]

## 5. Open items

- [ ] [anything UNVERIFIED against shopify.dev]
- [ ] [findings from reviewer skills, when received]
