# SO Web Components

Browser-safe custom elements for generated SO Shopify themes.

The package keeps component source in `src/index.js`, builds a distributable browser asset to `dist/theme-components.js`, and syncs the same asset into `packages/core/assets/theme-components.js` so existing theme generation continues to copy `theme-components.js` from the core manifest.

## Commands

```sh
npm run build:web-components
npm run test:web-components
npm run playground:web-components
```

Keep this package dependency-free unless a real browser build step becomes necessary.

## Playground

Run `npm run playground:web-components` from the repo root, then open `http://127.0.0.1:4173/`.

The playground uses the built `dist/theme-components.js` bundle and the local component catalog in `playground/components.js`. Each `so-*` entry documents its variants, attributes, events, and runnable usage markup.
