# Component Contracts

SO uses reusable components as stable contracts. This doc covers two kinds of components:

- Web components that ship as JavaScript-backed UI primitives.
- Liquid snippets that render reusable storefront fragments.
- Shopify theme blocks that merchants can compose inside block-enabled sections.

## Web Component Contract

Web components must expose a narrow, predictable API:

- Generated storefront code uses the `so-` prefix for custom elements, CSS classes, and CSS variables. New source must not introduce `theme-base-`, `tb-`, or `--tb-`.
- Public attributes and properties are the contract.
- Internal DOM shape can change if the public API stays stable.
- Components must not depend on generated theme-only state.
- Inputs should come from settings, section data, or explicit attributes.
- Behavior hooks should use `data-*` attributes so Liquid markup stays readable.
- Selectors should stay local to the component and avoid page-wide coupling.

Keep the API backward compatible whenever possible. If a prop or attribute changes, update the source docs and regenerate the theme.

## Liquid Snippet Contract

Liquid snippets are reusable render units with explicit inputs.

- Pass data through snippet parameters or captured variables.
- Avoid hidden dependencies on global state unless that state is documented.
- Keep naming stable so sections and templates can continue to call the snippet without churn.
- When a snippet changes its expected inputs, update every caller in source, not in generated output.

## Theme Block Contract

Theme blocks are small merchant-editable modules under `packages/core/blocks`.

- Each block must include a LiquidDoc header, a schema, and essential settings only.
- Blocks that support nesting should render `{% content_for 'blocks' %}` and declare `@theme` and `@app` blocks in schema.
- Block wrappers must include `{{ block.shopify_attributes }}` so the theme editor can target them.
- Block-enabled sections should expose `@theme` and `@app` in schema and render a clear content area for merchant-composed blocks.
- Generated themes must include a top-level `blocks/` directory so Shopify block support is visible in output structure.

## Shared Rules

All reusable components should:

- remain accessible by default,
- handle empty or partial data safely,
- avoid hardcoded catalog assumptions,
- and stay theme-agnostic unless a blueprint intentionally scopes them.

Component changes that affect merchant-facing behavior belong in source. Do not patch generated theme files as the durable fix.

## Review Questions

Before merging a component change, confirm:

- Is the public interface documented?
- Do callers still pass the correct shape?
- Does the component still work for mobile and keyboard users?
- Would a future regenerate reproduce the fix?
