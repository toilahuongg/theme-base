# Section Contracts

Shopify sections are structured contracts, not freeform page fragments. In SO, a section contract defines what content merchants can control, how the section renders, and what shape the generated schema must preserve.

## Contract Surface

A section contract includes:

- section id and file name,
- schema settings and defaults,
- block types and limits,
- presets,
- and the content model that the blueprint expects.

Treat these as public API. Renaming ids, changing setting types, or removing presets can break blueprints and generated themes.

## Content Rules

Section content should be predictable and merchant-editable.

- Defaults must be sensible when the merchant has not changed anything.
- Empty states should render cleanly instead of collapsing.
- Rich text, imagery, buttons, and product references should accept realistic merchant data.
- Content that belongs to the blueprint should live in source, not only in the generated theme.

## Schema Rules

Section schema changes must stay consistent with the blueprint and core source:

- use clear merchant-facing labels,
- keep controls shallow,
- provide presets for reusable sections,
- expose `@theme` and `@app` when the section is intended to host Shopify theme blocks,
- render `{% content_for 'blocks' %}` in a predictable area when block composition is supported,
- use `block.shopify_attributes` on block wrappers,
- update the blueprint when the section needs new content or behavior,
- update `packages/core` when the section is shared behavior,
- regenerate `themes/<handle>` after the source change,
- and validate with `shopify theme check --path themes/<handle>`.

## Stability Rule

Use stable ids, labels, and option names when possible. If a change is intentionally breaking, document it in the source docs and make sure the blueprint is updated to match.
