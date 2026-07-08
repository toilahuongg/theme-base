# SO Architecture

SO is a Shopify-native monorepo theme factory. It exists to turn blueprint-driven theme intent into generated Shopify themes without losing source clarity, Theme Store quality, or repeatability.

## Source Of Truth

SO has three distinct layers:

- `packages/core` contains reusable source assets, Liquid, schemas, and component primitives.
- `blueprints/<handle>.json` describes the theme-specific intent, market, content, and QA targets for one generated theme.
- `themes/<handle>` is generated output only.

If a change should persist across future generations, it belongs in `packages/core` or the blueprint. Do not make durable edits directly in `themes/<handle>`.

## Generated Output Rule

Generated theme folders are disposable build artifacts. They can be inspected, validated, and packaged, but they should not become the canonical source of behavior.

The normal flow is:

1. Edit the blueprint or core source.
2. Validate the blueprint.
3. Regenerate the theme.
4. Check the generated structure.
5. Run Shopify CLI validation.

Use these commands as the default workflow:

```bash
npm run validate:blueprint -- <handle>
npm run generate -- <handle>
npm run check:theme-structure -- <handle>
shopify theme check --path themes/<handle>
shopify theme package --path themes/<handle>
```

## Repository Boundaries

Keep responsibilities narrow:

- `packages/core` defines reusable behavior and design primitives.
- Blueprints select and configure those primitives for a market or catalog size.
- Generated themes are the output of that configuration, not a place to invent new source contracts.

## Practical Rule

If you find a bug in generated output, ask first whether the fix belongs in:

- the blueprint, if it is theme-specific intent or content,
- `packages/core`, if it affects shared theme behavior,
- or the generator, if it affects how output is assembled.

Only use `themes/<handle>` for temporary inspection or short-lived debugging.
