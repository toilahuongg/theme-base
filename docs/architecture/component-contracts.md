# Component Contracts

Theme Base uses reusable components as stable contracts. This doc covers two kinds of components:

- Web components that ship as JavaScript-backed UI primitives.
- Liquid snippets that render reusable storefront fragments.

## Web Component Contract

Web components must expose a narrow, predictable API:

- Public attributes and properties are the contract.
- Internal DOM shape can change if the public API stays stable.
- Components must not depend on generated theme-only state.
- Inputs should come from settings, section data, or explicit attributes.

Keep the API backward compatible whenever possible. If a prop or attribute changes, update the source docs and regenerate the theme.

## Liquid Snippet Contract

Liquid snippets are reusable render units with explicit inputs.

- Pass data through snippet parameters or captured variables.
- Avoid hidden dependencies on global state unless that state is documented.
- Keep naming stable so sections and templates can continue to call the snippet without churn.
- When a snippet changes its expected inputs, update every caller in source, not in generated output.

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
