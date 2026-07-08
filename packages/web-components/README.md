# Theme Base Web Components

Browser-safe custom elements for generated Theme Base Shopify themes.

The package keeps component source in `src/index.js`, builds a distributable browser asset to `dist/theme-components.js`, and syncs the same asset into `packages/core/assets/theme-components.js` so existing theme generation continues to copy `theme-components.js` from the core manifest.

## Commands

```sh
npm run build:web-components
npm run test:web-components
```

Keep this package dependency-free unless a real browser build step becomes necessary.
