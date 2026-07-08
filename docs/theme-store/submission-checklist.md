# Theme Store Submission Checklist

Use this checklist when preparing a Theme Base output theme for Shopify Theme Store review.

## Package And Build

- [ ] Run `shopify theme package --path themes/<handle>`.
- [ ] Verify the generated package contains the intended source output only.
- [ ] Confirm the theme handle, preset names, and documentation references are correct.

## Demo And Listing

- [ ] Demo URL works and loads the correct theme.
- [ ] Desktop screenshot is prepared at 1000x1248 or 2000x2496.
- [ ] Mobile screenshot is prepared at 750x1334.
- [ ] Screenshots match the actual theme state.
- [ ] Release notes describe the real change set.
- [ ] Docs and support links are current.

## Quality

- [ ] Performance is acceptable for the target catalog and page mix.
- [ ] Accessibility is checked on key templates and interactive controls.
- [ ] Theme structure passes the repo checks.
- [ ] Shopify CLI checks pass against the generated theme.

## Merchant-Facing Details

- [ ] Theme name is distinct and clear.
- [ ] Preset names are consistent with the intended market.
- [ ] Copy and screenshots match the submitted design.
- [ ] Documentation URL and support contact form are ready for review.
- [ ] The submission package does not rely on generated-theme-only fixes.

## Final Gate

If the fix only exists in `themes/<handle>`, move it back to source before submission.
