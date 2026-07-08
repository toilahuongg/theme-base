# AI Review Checklist

Use this checklist before declaring a SO change complete.

## Validation

- [ ] `npm run validate:blueprint -- <handle>` passes.
- [ ] `npm run generate -- <handle>` passes.
- [ ] `npm run check:theme-structure -- <handle>` passes.
- [ ] `shopify theme check --path themes/<handle>` passes.
- [ ] `shopify theme package --path themes/<handle>` passes.

## Structure

- [ ] The change lives in source, not only in `themes/<handle>`.
- [ ] Blueprint intent matches the generated output.
- [ ] Section and component contracts still line up with the callers.
- [ ] Generated storefront code uses the `so-` prefix for custom elements, CSS classes, and CSS variables. New source must not introduce `theme-base-`, `tb-`, or `--tb-`.
- [ ] No generated file was used as the durable fix for a source problem.

## UX And Accessibility

- [ ] Mobile layout works without clipped content or broken stacking.
- [ ] Keyboard focus is visible on interactive controls.
- [ ] Empty states are understandable and not visually broken.
- [ ] Copy and imagery still fit the intended catalog and industry.

## Theme Store Readiness

- [ ] The theme still looks like a coherent product, not a patchwork of fixes.
- [ ] Documentation points future edits to blueprints or core source.
- [ ] Any new feature is described in source docs for future AI agents.

## Final Question

If a future regenerate would lose the fix, the fix is in the wrong place.
