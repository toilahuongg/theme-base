# SO Factory Design

## Context

The current repository is based on Dawn 15.5.0. Dawn is useful as a reference for Shopify feature coverage, edge cases, accessibility patterns, and theme behavior. It must not be treated as the final foundation for Theme Store submission output.

The product direction has changed from building one Aster theme to building a reusable **Shopify-native theme factory**. Aster is now the first generated proof theme, not the center of the product.

The factory must help create new Shopify themes quickly for different industries and catalog sizes while preserving Theme Store quality, Shopify-native output, maintainable code, strong documentation, and AI-friendly workflows.

## Product Direction

The product is a monorepo called **SO**.

SO is an opinionated premium commerce factory for generating complete Shopify themes. It provides:

- A reusable core component and section system
- A blueprint schema for describing child themes
- A generator that outputs complete Shopify-native theme folders
- Merchant documentation
- AI handoff documentation
- Theme Store listing drafts
- Release notes
- QA and submission checklists

SO should support many industries and catalog sizes, including Beauty, Wellness, Clothing, Electronics, Home, Food and drink, B2B, Services, single-product brands, and large catalogs.

The first generated proof theme is **Aster**:

- Industry tags: Beauty and Wellness
- Catalog size: Some (11-100+)
- Positioning: clinical skincare plus soft premium wellness
- Differentiator: routine-led skincare commerce with ingredient proof

## Core Principles

SO must satisfy these principles:

- Shopify-native output: each generated theme must be a normal Shopify theme folder.
- Strong source-of-truth boundaries: edit core and blueprints, then regenerate themes.
- AI-friendly structure: docs and naming must make correct edits obvious to an AI agent.
- Opinionated premium taste: the core should provide strong layout, typography, spacing, and component defaults without locking themes to one industry.
- Theme Store awareness: generated themes must be designed for review, listing, demo parity, accessibility, and performance.
- No Dawn-derived submission output: Dawn can be referenced for behavior coverage, but final generated themes must use original code or a Shopify-approved Skeleton-compatible foundation.

## Monorepo Architecture

Target structure:

```text
so/
  packages/
    core/
      assets/
      blocks/
      components/
      docs/
      schemas/
      sections/
      snippets/
      tokens/
    generator/
      src/
      templates/
  blueprints/
    aster.json
    fashion-editorial.json
    electronics-spec.json
  themes/
    aster/
      assets/
      blocks/
      config/
      docs/
      layout/
      locales/
      sections/
      snippets/
      templates/
      listings/
  docs/
    ai/
    architecture/
    patterns/
    theme-store/
  references/
    dawn-15.5.0/
```

### Source Directories

`packages/core` is the reusable source-of-truth for commerce primitives, web components, Liquid snippets, sections, schemas, tokens, and core documentation.

`packages/generator` reads a blueprint and produces a generated Shopify theme plus documentation and Theme Store support artifacts.

`blueprints` contains child theme definitions. A blueprint describes a theme's market, visual system, component variants, templates, content defaults, listing copy, documentation needs, and QA expectations.

`themes` contains generated Shopify theme output. Each folder under `themes/<theme-name>` must match Shopify's standard theme directory structure so CLI commands can run with `--path themes/<theme-name>`.

`docs` contains human and AI-facing documentation for the factory itself.

`references` can store Dawn or other reference material used for audits. Reference code must not be copied into generated Theme Store output.

## Shopify CLI Contract

Generated themes must support:

- `shopify theme dev --path themes/<theme-name>`
- `shopify theme check --path themes/<theme-name>`
- `shopify theme package --path themes/<theme-name>`

Each generated theme folder must include the Shopify theme directories required for the features it uses:

- `assets`
- `blocks`
- `config`
- `layout`
- `locales`
- `sections`
- `snippets`
- `templates`

For multi-preset themes, generated output must include `/listings/<preset-name>` folders using kebab-case names. For one-preset themes, `/listings` can be omitted unless the current Shopify ZIP validator requires it at packaging time.

## UI Component Layer

SO should use a strong UI component layer while keeping generated output Shopify-native.

### Web Components

Use vanilla JavaScript custom elements for reusable behavior:

- Drawer
- Modal
- Tabs
- Accordion
- Carousel
- Quantity stepper
- Variant controller
- Predictive search shell
- Sticky buy bar
- Media gallery
- Disclosure menus

Web components should enhance server-rendered Liquid markup. They must not make critical navigation or purchase flows unusable when JavaScript fails.

### Liquid Primitives

Core Liquid snippets should cover:

- Button
- Responsive image
- Product card
- Price
- Badge
- Icon
- Section heading
- Media frame
- Form field
- Pagination
- Breadcrumbs
- SEO/social metadata

Snippets must pass data through explicit render parameters, include LiquidDoc where appropriate, and avoid hidden global dependencies unless Shopify requires them.

### Section Families

Core sections should be grouped by intent, not by a single industry:

- Hero and editorial intro
- Featured collection and product grid
- Collection list
- Story and rich text
- Comparison
- Proof points
- Bundle or curated set
- FAQ
- Newsletter
- Lookbook/media gallery
- Specs table
- Testimonials/social proof
- Blog and education cards
- Contact and support

Each section must expose essential merchant settings only. Avoid deep configuration structures that make primary controls hard to find.

## Blueprint System

Blueprints should use JSON with a JSON Schema. JSON is the v1 format because it is strict, easy to validate, and friendly for AI-generated changes.

Each blueprint must define:

- `theme`: name, handle, version, author, docs URL, support URL
- `presets`: preset names, industries, catalog sizes, listing positioning
- `market`: merchant profile, product model, buying behavior, catalog strategy
- `visual`: tokens, typography role, imagery direction, spacing density, radius, motion
- `components`: enabled components and variants
- `sections`: enabled sections, defaults, block presets, schema overrides
- `templates`: home, product, collection, search, cart, blog, article, page, account/customer compositions
- `content`: demo copy, empty states, onboarding-safe copy, translation seeds
- `listing`: Theme Store description, feature bullets, screenshot plan, demo store notes, release notes draft
- `docs`: merchant documentation topics and AI handoff notes
- `qa`: required checks, scenario list, Lighthouse targets, manual test cases

Blueprints must not contain arbitrary Liquid code. They should describe intent and configuration. Generator templates and core components are responsible for implementation.

## Generator Output

The generator must produce a full theme pack:

- Shopify theme files in `themes/<theme-name>`
- `config/settings_schema.json`
- `config/settings_data.json`
- JSON templates
- Section groups where needed
- Liquid sections, snippets, blocks, layouts, and assets
- Locale files
- `/listings` for multi-preset install states or current packaging requirements
- `docs/merchant.md`
- `docs/ai-handoff.md`
- `docs/listing-draft.md`
- `docs/release-notes.md`
- `docs/qa-checklist.md`

Generated files must include clear metadata in generated docs. Theme files should avoid noisy comments unless a generated marker is necessary and accepted by Shopify/theme validation.

The generator should fail fast when:

- Required blueprint fields are missing
- A requested component or section does not exist in core
- A template recipe references an unavailable section
- A preset uses invalid Theme Store catalog size or industry tags
- A generated settings or template file would be invalid JSON

## Documentation System

Docs are part of the product, not an afterthought.

Factory docs:

- `docs/architecture/overview.md`: monorepo map, source-of-truth, generated output rules
- `docs/architecture/component-contracts.md`: component inputs, output, dependencies, accessibility rules
- `docs/architecture/section-contracts.md`: section schema rules, block rules, naming, translation keys
- `docs/patterns/page-recipes.md`: home, product, collection, cart, blog, search, page recipes
- `docs/patterns/catalog-strategies.md`: 1 product, Few (2-10), Some (11-100+), Lots (500+)
- `docs/patterns/industry-playbooks.md`: industry-specific guidance for generated themes
- `docs/ai/agent-guide.md`: required AI workflow for creating or modifying a generated theme
- `docs/ai/blueprint-authoring.md`: blueprint writing rules and examples
- `docs/ai/review-checklist.md`: AI self-review for layout, Liquid, schema, accessibility, performance, Theme Store readiness
- `docs/theme-store/submission-checklist.md`: package, listing, demo store, screenshots, docs, support, release notes
- `docs/theme-store/demo-store-guide.md`: demo store setup rules by industry and catalog size

Generated theme docs:

- Merchant setup guide
- Section usage guide
- Theme settings guide
- AI handoff summary
- Listing copy draft
- Release notes
- QA checklist

## AI-Friendly Workflow

When creating a new theme, AI agents should follow this workflow:

1. Read `docs/ai/agent-guide.md`.
2. Read `docs/ai/blueprint-authoring.md`.
3. Read the relevant industry playbook and catalog strategy.
4. Create or modify `blueprints/<theme>.json`.
5. Validate the blueprint against JSON Schema.
6. Run the generator.
7. Run `shopify theme check --path themes/<theme>`.
8. Validate generated theme files with Shopify theme validation.
9. Preview with `shopify theme dev --path themes/<theme>`.
10. Review responsive behavior, accessibility, keyboard navigation, and no-JavaScript basics.
11. Review generated merchant docs, listing draft, release notes, and QA checklist.
12. Package with `shopify theme package --path themes/<theme>`.

AI agents must not patch generated output for durable changes when the source blueprint or core component should be changed instead. Exceptions are allowed only for temporary debugging, and the final fix must move back into source.

## Theme Store Requirements

Generated Theme Store candidates must be designed for:

- Theme uniqueness across core templates and elements
- Preset-specific listing pages
- Demo store parity
- Industry and catalog size tagging
- Documentation and public support contact requirements
- Release notes
- Performance targets
- Accessibility targets
- Browser compatibility
- SEO and social sharing
- Valid Liquid, JSON, and theme schemas

Theme Store acceptance targets:

- Average Lighthouse performance score of at least 60 across home, product, and collection pages on desktop and mobile
- Average Lighthouse accessibility score of at least 90 across home, product, and collection pages on desktop and mobile

Generated demo stores must use authentic copy, properly licensed imagery, no lorem ipsum, no onboarding copy, no app-dependent functionality presented as built-in theme functionality, and payment setup that follows Shopify demo store requirements.

## Build Phases

### Phase 1: Preserve And Audit Dawn Reference

Use the current Dawn-based repo as a reference for feature coverage and behavior. Move or isolate Dawn reference material so it is not confused with generated Theme Store output.

Tasks:

- Record current Theme Check baseline.
- Map required Shopify theme features from Dawn into a coverage checklist.
- Identify which behaviors need original core implementations.
- Document which Dawn patterns are references only.

### Phase 2: Create Monorepo Foundation

Create the monorepo structure and root developer workflow.

Tasks:

- Add root package metadata and scripts.
- Create `packages/core`.
- Create `packages/generator`.
- Create `blueprints`.
- Create `themes`.
- Create `docs`.
- Create JSON Schema for blueprints.
- Add first Aster blueprint.

### Phase 3: Build Core Commerce Primitives

Build enough original core primitives to generate a complete Shopify theme.

Required primitives:

- Layout shell
- Header
- Footer
- Product card
- Responsive image
- Price
- Badge
- Button
- Form field
- Product media
- Product form
- Variant picker/controller
- Quantity input
- Buy buttons
- Collection grid
- Filter/facet hooks
- Cart drawer or cart page flow
- Search shell
- Localization forms
- SEO/social snippets
- Accessibility utilities
- Design tokens

### Phase 4: Build Generator

Build generator v1 to produce a full Shopify theme plus documentation and Theme Store support artifacts.

The generator must:

- Validate blueprint JSON.
- Resolve requested components, sections, and templates.
- Generate Shopify-native theme folders.
- Generate settings schema and settings data.
- Generate locale files.
- Generate merchant docs.
- Generate AI handoff docs.
- Generate listing draft.
- Generate release notes.
- Generate QA checklist.
- Fail loudly on invalid or unsupported blueprint requests.

### Phase 5: Generate Aster Proof Theme

Generate Aster as the first proof theme.

Aster should prove that the core can support:

- Beauty and Wellness positioning
- Some (11-100+) catalog size
- Premium clinical visual direction
- Routine-led homepage
- Ingredient proof product page modules
- Guided collection discovery
- Theme Store listing and docs generation

### Phase 6: Generate A Second Non-Beauty Theme

Generate a second theme in a different industry, such as Electronics or Home.

This phase proves that SO is not beauty-specific. If the second generated theme requires extensive one-off hacks, the core and blueprint schema need refinement before SO is considered successful.

## Validation Plan

Factory validation:

- Blueprint schema validation
- Generator unit tests for successful generation and failure cases
- Snapshot or fixture tests for generated theme structure
- Documentation completeness checks

Generated theme validation:

- `shopify theme check --path themes/<theme>`
- Shopify theme validation for generated theme files
- Desktop and mobile previews
- Product, collection, and home Lighthouse checks
- Keyboard navigation checks
- No-JavaScript checks for navigation and purchase basics
- Long navigation and long title checks
- Product variants, sold-out products, sale prices, gift cards, empty collections, and cart error states
- Demo store parity review
- Theme Store checklist review

Known current baseline:

- The current root theme is Dawn 15.5.0.
- `shopify theme check` exits successfully.
- It reports 8 warnings across 7 files.
- Current repo identity still says Dawn in README, `config/settings_schema.json`, and `config/settings_data.json`.
- This baseline should be preserved as reference evidence, not accepted as SO architecture.

## Approved Direction

The approved direction is:

- Build a monorepo theme factory, not a single theme.
- Keep generated output Shopify-native.
- Use a strong UI component layer.
- Use JSON Schema-backed blueprints.
- Generate full theme folders plus docs, listing drafts, release notes, and QA checklists.
- Make the system friendly to AI agents and future theme generation.
- Use Aster as the first proof theme.
- Use a second non-beauty theme to prove generality.
