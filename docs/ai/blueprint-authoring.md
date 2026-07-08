# Blueprint Authoring

Blueprints define what a generated theme should be, not arbitrary Liquid code. A blueprint describes intent, configuration, market fit, content defaults, and validation expectations.

## Required Flow

When authoring or updating a blueprint:

1. Pick the correct theme handle.
2. Update `blueprints/<handle>.json`.
3. Validate with `npm run validate:blueprint -- <handle>`.
4. Generate with `npm run generate -- <handle>`.
5. Inspect the result.
6. Refine the blueprint or source and repeat.

## What Belongs In A Blueprint

Use the blueprint for:

- theme identity and metadata,
- preset names and positioning,
- industry and catalog-size fit,
- market profile,
- visual direction,
- supported components and sections,
- supported templates,
- content defaults,
- listing copy,
- AI notes,
- and QA expectations.

## What Does Not Belong In A Blueprint

Do not use the blueprint as a place to write arbitrary theme code.

- Put reusable implementation in `packages/core`.
- Put generator behavior in `packages/generator`.
- Put theme-specific intent and copy in the blueprint.

## Writing Rules

- Keep the blueprint concrete and merchant-facing.
- Match the supported catalog size categories exactly.
- Keep industry labels aligned with the schema.
- Make content defaults realistic for the target market.
- Ensure the blueprint can be regenerated without manual edits to `themes/<handle>`.

## Good Test

If someone can understand the theme's market, visual direction, and content posture from the blueprint alone, the blueprint is doing its job.
