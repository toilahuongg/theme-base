# Theme Base Factory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working vertical slice of the Theme Base monorepo factory: validated blueprint input, reusable core source files, a generator, generated Shopify-native Aster theme output, generated docs/listing/QA pack, and checks that prove the structure works.

**Architecture:** The repository becomes a Shopify-native monorepo where `packages/core` stores reusable Liquid, assets, schemas, and documentation; `blueprints/*.json` describes child themes; `packages/generator` validates blueprints and generates complete theme folders under `themes/<theme>`. Aster is the first generated proof theme, and a second non-beauty blueprint is added to prove that the system is not beauty-specific.

**Tech Stack:** Shopify Liquid, Shopify CLI, Node.js ESM, `node:test`, Ajv JSON Schema validation, vanilla JavaScript custom elements, JSON blueprints, Markdown docs.

---

## File Structure

Create and modify these files:

- Modify: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/package.json`
  Root scripts for generation, validation, tests, and Shopify CLI wrappers.
- Modify: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/.gitignore`
  Ignore generated archives and Node dependencies.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/schemas/blueprint.schema.json`
  JSON Schema for blueprint validation.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/manifest.json`
  Registry of core assets, layouts, snippets, sections, and templates the generator can use.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/assets/theme-base.css`
  Token-driven CSS foundation.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/assets/theme-components.js`
  Vanilla custom elements for disclosure, drawer, tabs, and quantity behavior.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/layout/theme.liquid`
  Minimal Shopify layout shell.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/button.liquid`
  Button primitive.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/responsive-image.liquid`
  Image primitive.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/price.liquid`
  Price primitive.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/product-card.liquid`
  Product card primitive.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/main-hero.liquid`
  Hero section.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/featured-products.liquid`
  Featured collection grid section.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/rich-content.liquid`
  Editorial content section.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/index.json`
  Base homepage template recipe.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/product.json`
  Base product template recipe.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/collection.json`
  Base collection template recipe.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/locales/en.default.json`
  Core English translations.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/paths.mjs`
  Repository path helpers.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/validate-blueprint.mjs`
  Blueprint validation CLI.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/generate-theme.mjs`
  Theme generator CLI.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/theme-writer.mjs`
  Theme output writer.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/docs-writer.mjs`
  Generated documentation writer.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/check-theme-structure.mjs`
  Structure validator for generated output.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/blueprints/aster.json`
  First proof blueprint.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/blueprints/electronics-spec.json`
  Second non-beauty blueprint.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/tests/blueprint-validation.test.mjs`
  Schema validation tests.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/tests/generator.test.mjs`
  Generator tests.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/overview.md`
  Monorepo architecture docs.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/component-contracts.md`
  Component contracts.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/section-contracts.md`
  Section contracts.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/agent-guide.md`
  AI workflow guide.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/blueprint-authoring.md`
  Blueprint authoring guide.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/review-checklist.md`
  AI review checklist.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/catalog-strategies.md`
  Catalog strategy guide.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/industry-playbooks.md`
  Industry playbooks.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/page-recipes.md`
  Page recipe docs.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/theme-store/submission-checklist.md`
  Theme Store submission checklist.
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/theme-store/demo-store-guide.md`
  Demo store setup guide.

Generated files after running the generator:

- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/themes/aster/**`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/themes/electronics-spec/**`

---

### Task 1: Root Monorepo Scaffolding

**Files:**
- Modify: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/package.json`
- Modify: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/.gitignore`

- [ ] **Step 1: Add root package metadata**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/package.json`:

```json
{
  "name": "theme-base-factory",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Shopify-native theme factory with blueprint-driven generation.",
  "scripts": {
    "test": "node --test",
    "theme:check": "shopify theme check --path",
    "theme:package": "shopify theme package --path"
  },
  "dependencies": {
    "ajv": "^8.17.1"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Update ignored local artifacts**

Append these lines to `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/.gitignore` if they are not already present:

```gitignore
node_modules/
dist/
*.zip
.DS_Store
themes/*/.shopify/
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and Ajv installs successfully.

- [ ] **Step 4: Commit root scaffold**

Run:

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: scaffold theme factory workspace"
```

Expected: commit succeeds with only root workspace files staged.

---

### Task 2: Blueprint Schema And Validation

**Files:**
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/schemas/blueprint.schema.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/paths.mjs`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/validate-blueprint.mjs`
- Modify: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/package.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/blueprints/aster.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/tests/blueprint-validation.test.mjs`

- [ ] **Step 1: Add blueprint schema**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/schemas/blueprint.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://miso.ai/theme-base/blueprint.schema.json",
  "title": "Theme Base Blueprint",
  "type": "object",
  "additionalProperties": false,
  "required": ["theme", "presets", "market", "visual", "components", "sections", "templates", "content", "listing", "docs", "qa"],
  "properties": {
    "theme": {
      "type": "object",
      "additionalProperties": false,
      "required": ["name", "handle", "version", "author", "documentationUrl", "supportUrl"],
      "properties": {
        "name": { "type": "string", "minLength": 1, "maxLength": 30 },
        "handle": { "type": "string", "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
        "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
        "author": { "type": "string", "minLength": 1 },
        "documentationUrl": { "type": "string", "format": "uri" },
        "supportUrl": { "type": "string", "format": "uri" }
      }
    },
    "presets": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "handle", "industries", "catalogSize", "positioning"],
        "properties": {
          "name": { "type": "string", "minLength": 1, "maxLength": 30 },
          "handle": { "type": "string", "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
          "industries": {
            "type": "array",
            "minItems": 1,
            "maxItems": 2,
            "items": {
              "enum": ["Art", "Auto", "Bags", "Beauty", "Clothing", "Electronics", "Entertainment", "Food and drink", "Garden", "Hardware", "Home", "Jewelry and accessories", "Kids", "Office", "Pets", "Services", "Shoes", "Sports", "Toys", "Wellness"]
            }
          },
          "catalogSize": { "enum": ["1 product", "Few (2-10)", "Some (11-100+)", "Lots (500+)"] },
          "positioning": { "type": "string", "minLength": 20 }
        }
      }
    },
    "market": {
      "type": "object",
      "additionalProperties": false,
      "required": ["merchantProfile", "productModel", "buyingBehavior", "catalogStrategy"],
      "properties": {
        "merchantProfile": { "type": "string", "minLength": 20 },
        "productModel": { "type": "string", "minLength": 10 },
        "buyingBehavior": { "type": "string", "minLength": 10 },
        "catalogStrategy": { "type": "string", "minLength": 10 }
      }
    },
    "visual": {
      "type": "object",
      "additionalProperties": false,
      "required": ["tokens", "typography", "imagery", "density", "motion"],
      "properties": {
        "tokens": {
          "type": "object",
          "additionalProperties": false,
          "required": ["background", "text", "accent", "surface", "border", "radius"],
          "properties": {
            "background": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
            "text": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
            "accent": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
            "surface": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
            "border": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
            "radius": { "type": "string", "pattern": "^[0-9]+px$" }
          }
        },
        "typography": { "type": "string", "minLength": 10 },
        "imagery": { "type": "string", "minLength": 10 },
        "density": { "enum": ["compact", "balanced", "spacious"] },
        "motion": { "enum": ["none", "restrained", "expressive"] }
      }
    },
    "components": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string", "pattern": "^[a-z0-9-]+$" }
    },
    "sections": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string", "pattern": "^[a-z0-9-]+$" }
    },
    "templates": {
      "type": "array",
      "minItems": 1,
      "items": { "enum": ["index", "product", "collection", "cart", "search", "blog", "article", "page"] }
    },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["homeHeroHeading", "homeHeroText", "emptyStateText", "newsletterHeading"],
      "properties": {
        "homeHeroHeading": { "type": "string", "minLength": 1 },
        "homeHeroText": { "type": "string", "minLength": 1 },
        "emptyStateText": { "type": "string", "minLength": 1 },
        "newsletterHeading": { "type": "string", "minLength": 1 }
      }
    },
    "listing": {
      "type": "object",
      "additionalProperties": false,
      "required": ["summary", "featureBullets", "screenshotPlan", "releaseNotes"],
      "properties": {
        "summary": { "type": "string", "minLength": 40 },
        "featureBullets": { "type": "array", "minItems": 3, "items": { "type": "string", "minLength": 10 } },
        "screenshotPlan": { "type": "string", "minLength": 20 },
        "releaseNotes": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 10 } }
      }
    },
    "docs": {
      "type": "object",
      "additionalProperties": false,
      "required": ["merchantTopics", "aiNotes"],
      "properties": {
        "merchantTopics": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 5 } },
        "aiNotes": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 5 } }
      }
    },
    "qa": {
      "type": "object",
      "additionalProperties": false,
      "required": ["scenarios", "lighthouse"],
      "properties": {
        "scenarios": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 5 } },
        "lighthouse": {
          "type": "object",
          "additionalProperties": false,
          "required": ["performance", "accessibility"],
          "properties": {
            "performance": { "type": "integer", "minimum": 60 },
            "accessibility": { "type": "integer", "minimum": 90 }
          }
        }
      }
    }
  }
}
```

- [ ] **Step 2: Add path helpers**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/paths.mjs`:

```js
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentFile = fileURLToPath(import.meta.url);
export const repoRoot = path.resolve(path.dirname(currentFile), '../../..');
export const coreRoot = path.join(repoRoot, 'packages/core');
export const blueprintRoot = path.join(repoRoot, 'blueprints');
export const themesRoot = path.join(repoRoot, 'themes');
export const schemaPath = path.join(coreRoot, 'schemas/blueprint.schema.json');

export function blueprintPath(handle) {
  return path.join(blueprintRoot, `${handle}.json`);
}

export function themePath(handle) {
  return path.join(themesRoot, handle);
}
```

- [ ] **Step 3: Add blueprint validator**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/validate-blueprint.mjs`:

```js
import fs from 'node:fs/promises';
import Ajv from 'ajv';
import { blueprintPath, schemaPath } from './paths.mjs';

export async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

export async function validateBlueprint(handle) {
  const [schema, blueprint] = await Promise.all([
    loadJson(schemaPath),
    loadJson(blueprintPath(handle))
  ]);
  const ajv = new Ajv({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  const valid = validate(blueprint);
  if (!valid) {
    const message = validate.errors
      .map((error) => `${error.instancePath || '/'} ${error.message}`)
      .join('\n');
    throw new Error(`Blueprint ${handle} is invalid:\n${message}`);
  }
  return blueprint;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const handle = process.argv[2];
  if (!handle) {
    throw new Error('Usage: npm run validate:blueprint -- <handle>');
  }
  await validateBlueprint(handle);
  console.log(`Blueprint ${handle} is valid`);
}
```

- [ ] **Step 4: Add validation script**

Update `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/package.json` scripts:

```json
{
  "scripts": {
    "validate:blueprint": "node packages/generator/src/validate-blueprint.mjs"
  }
}
```

- [ ] **Step 5: Add Aster blueprint**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/blueprints/aster.json`:

```json
{
  "theme": {
    "name": "Aster",
    "handle": "aster",
    "version": "0.1.0",
    "author": "Miso",
    "documentationUrl": "https://example.com/aster/docs",
    "supportUrl": "https://example.com/aster/support"
  },
  "presets": [
    {
      "name": "Aster",
      "handle": "aster",
      "industries": ["Beauty", "Wellness"],
      "catalogSize": "Some (11-100+)",
      "positioning": "A premium clinical skincare storefront for brands that sell by routine, concern, and ingredient proof."
    }
  ],
  "market": {
    "merchantProfile": "Independent skincare and wellness brands with education-led buying journeys.",
    "productModel": "Serums, cleansers, creams, supplements, kits, and curated routines.",
    "buyingBehavior": "Customers compare benefits, concerns, ingredients, and routine fit before purchasing.",
    "catalogStrategy": "Some catalog with guided discovery, editorial education, and curated bundles."
  },
  "visual": {
    "tokens": {
      "background": "#F8F5EF",
      "text": "#171512",
      "accent": "#496F5D",
      "surface": "#FFFFFF",
      "border": "#D8D0C4",
      "radius": "8px"
    },
    "typography": "Editorial headings with calm readable body copy for clinical premium commerce.",
    "imagery": "Bright product and lifestyle photography with clean ingredient and routine context.",
    "density": "spacious",
    "motion": "restrained"
  },
  "components": ["drawer", "accordion", "tabs", "quantity-stepper", "variant-controller", "media-gallery"],
  "sections": ["main-hero", "featured-products", "rich-content"],
  "templates": ["index", "product", "collection", "cart", "search", "blog", "article", "page"],
  "content": {
    "homeHeroHeading": "Build a routine that feels clear from the first step",
    "homeHeroText": "A clinical-soft storefront for skincare rituals, ingredient education, and curated product discovery.",
    "emptyStateText": "No products are available in this view yet.",
    "newsletterHeading": "Skin notes, launch updates, and routine guidance"
  },
  "listing": {
    "summary": "Aster is a premium skincare and wellness theme built for routine-led discovery, ingredient education, and calm conversion.",
    "featureBullets": [
      "Routine-led homepage and product storytelling",
      "Ingredient and benefit-forward product cards",
      "Generated merchant docs, QA checklist, and listing draft"
    ],
    "screenshotPlan": "Capture desktop and mobile home pages with hero, routine story, featured products, and editorial content visible.",
    "releaseNotes": [
      "Initial generated Aster proof theme with core Theme Base structure."
    ]
  },
  "docs": {
    "merchantTopics": ["Homepage setup", "Featured products", "Editorial content", "Theme settings"],
    "aiNotes": ["Aster proves beauty and wellness support for the Theme Base factory."]
  },
  "qa": {
    "scenarios": ["Home page renders", "Product card renders", "Collection template exists", "Theme docs generated"],
    "lighthouse": {
      "performance": 60,
      "accessibility": 90
    }
  }
}
```

- [ ] **Step 6: Add schema tests**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/tests/blueprint-validation.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { validateBlueprint } from '../packages/generator/src/validate-blueprint.mjs';

test('validates the Aster blueprint', async () => {
  const blueprint = await validateBlueprint('aster');
  assert.equal(blueprint.theme.handle, 'aster');
  assert.equal(blueprint.presets[0].catalogSize, 'Some (11-100+)');
});

test('rejects a missing blueprint handle', async () => {
  await assert.rejects(
    () => validateBlueprint('missing-blueprint'),
    /ENOENT/
  );
});
```

- [ ] **Step 7: Run validation tests**

Run:

```bash
npm run validate:blueprint -- aster
npm test -- tests/blueprint-validation.test.mjs
```

Expected:

```text
Blueprint aster is valid
```

and Node test output reports passing tests.

- [ ] **Step 8: Commit schema and validation**

Run:

```bash
git add packages/core/schemas/blueprint.schema.json packages/generator/src/paths.mjs packages/generator/src/validate-blueprint.mjs blueprints/aster.json tests/blueprint-validation.test.mjs package.json
git commit -m "feat: add blueprint schema and validator"
```

Expected: commit succeeds with schema, validator, blueprint, and tests.

---

### Task 3: Core Theme Source Files

**Files:**
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/manifest.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/assets/theme-base.css`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/assets/theme-components.js`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/layout/theme.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/button.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/responsive-image.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/price.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/product-card.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/main-hero.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/featured-products.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/rich-content.liquid`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/index.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/product.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/collection.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/locales/en.default.json`

- [ ] **Step 1: Add core manifest**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/manifest.json`:

```json
{
  "assets": ["theme-base.css", "theme-components.js"],
  "layouts": ["theme.liquid"],
  "snippets": ["button.liquid", "responsive-image.liquid", "price.liquid", "product-card.liquid"],
  "sections": ["main-hero.liquid", "featured-products.liquid", "rich-content.liquid"],
  "templates": ["index.json", "product.json", "collection.json"],
  "locales": ["en.default.json"]
}
```

- [ ] **Step 2: Add token-driven CSS**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/assets/theme-base.css`:

```css
:root {
  --tb-color-background: #ffffff;
  --tb-color-text: #171512;
  --tb-color-accent: #496f5d;
  --tb-color-surface: #ffffff;
  --tb-color-border: #d8d0c4;
  --tb-radius-card: 8px;
  --tb-page-width: 1200px;
  --tb-space-1: 4px;
  --tb-space-2: 8px;
  --tb-space-3: 16px;
  --tb-space-4: 24px;
  --tb-space-5: 40px;
  --tb-space-6: 64px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--tb-color-background);
  color: var(--tb-color-text);
  font-family: var(--font-body-family, system-ui, sans-serif);
  font-size: 16px;
  line-height: 1.5;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--tb-color-accent);
  outline-offset: 3px;
}

.tb-page-width {
  width: min(100% - 32px, var(--tb-page-width));
  margin-inline: auto;
}

.tb-section {
  padding-block: var(--tb-section-padding, var(--tb-space-6));
}

.tb-button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--tb-color-accent);
  border-radius: var(--tb-radius-card);
  background: var(--tb-color-accent);
  color: #ffffff;
  padding: 12px 18px;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
}

.tb-button--secondary {
  background: transparent;
  color: var(--tb-color-accent);
}

.tb-grid {
  display: grid;
  gap: var(--tb-space-4);
}

.tb-product-card {
  display: grid;
  gap: var(--tb-space-3);
}

.tb-product-card__media {
  overflow: hidden;
  border-radius: var(--tb-radius-card);
  background: var(--tb-color-surface);
  border: 1px solid var(--tb-color-border);
}

.tb-product-card__title {
  margin: 0;
  font-size: 1rem;
}

.tb-product-card__price {
  font-weight: 600;
}

@media (min-width: 750px) {
  .tb-grid--products {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

- [ ] **Step 3: Add web components**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/assets/theme-components.js`:

```js
class ThemeBaseDisclosure extends HTMLElement {
  connectedCallback() {
    this.summary = this.querySelector('[data-disclosure-summary]');
    this.panel = this.querySelector('[data-disclosure-panel]');
    if (!this.summary || !this.panel) return;
    this.summary.addEventListener('click', () => {
      const expanded = this.summary.getAttribute('aria-expanded') === 'true';
      this.summary.setAttribute('aria-expanded', String(!expanded));
      this.panel.hidden = expanded;
    });
  }
}

class ThemeBaseQuantity extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input[type="number"]');
    this.minus = this.querySelector('[data-quantity-minus]');
    this.plus = this.querySelector('[data-quantity-plus]');
    if (!this.input || !this.minus || !this.plus) return;
    this.minus.addEventListener('click', () => this.step(-1));
    this.plus.addEventListener('click', () => this.step(1));
  }

  step(direction) {
    const min = Number(this.input.min || 1);
    const current = Number(this.input.value || min);
    this.input.value = String(Math.max(min, current + direction));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

customElements.define('theme-base-disclosure', ThemeBaseDisclosure);
customElements.define('theme-base-quantity', ThemeBaseQuantity);
```

- [ ] **Step 4: Add Liquid layout**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/layout/theme.liquid`:

```liquid
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ page_title }}</title>
    {{ content_for_header }}
    {{ 'theme-base.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'theme-components.js' | asset_url }}" defer="defer"></script>
  </head>
  <body>
    <a class="skip-to-content-link visually-hidden" href="#MainContent">{{ 'accessibility.skip_to_text' | t }}</a>
    <main id="MainContent" role="main">
      {{ content_for_layout }}
    </main>
  </body>
</html>
```

- [ ] **Step 5: Add Liquid snippets**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/button.liquid`:

```liquid
{% doc %}
Renders a theme button.
@param {string} label - Button label
@param {string} [url] - Optional URL
@param {boolean} [secondary] - Render secondary style
@example
{% render 'button', label: 'Shop now', url: routes.all_products_collection_url %}
{% enddoc %}

{% liquid
  assign button_class = 'tb-button'
  if secondary
    assign button_class = button_class | append: ' tb-button--secondary'
  endif
%}

{% if url != blank %}
  <a class="{{ button_class }}" href="{{ url }}">{{ label | escape }}</a>
{% else %}
  <button class="{{ button_class }}" type="button">{{ label | escape }}</button>
{% endif %}
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/responsive-image.liquid`:

```liquid
{% doc %}
Renders a responsive Shopify image with fallback content.
@param {image} image - Shopify image object
@param {string} [class] - Optional CSS class
@param {string} [alt] - Optional alt text override
@example
{% render 'responsive-image', image: product.featured_image, class: 'card__image' %}
{% enddoc %}

{% if image != blank %}
  {{ image | image_url: width: 1200 | image_tag: class: class, alt: alt }}
{% else %}
  {{ 'product-1' | placeholder_svg_tag: class }}
{% endif %}
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/price.liquid`:

```liquid
{% doc %}
Renders product price.
@param {product} product - Product object
@example
{% render 'price', product: product %}
{% enddoc %}

<span class="tb-product-card__price">
  {% if product.compare_at_price > product.price %}
    <span>{{ product.price | money }}</span>
    <s>{{ product.compare_at_price | money }}</s>
  {% else %}
    <span>{{ product.price | money }}</span>
  {% endif %}
</span>
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/snippets/product-card.liquid`:

```liquid
{% doc %}
Renders a product card.
@param {product} product - Product object
@example
{% render 'product-card', product: product %}
{% enddoc %}

<article class="tb-product-card">
  <a class="tb-product-card__media" href="{{ product.url }}">
    {% render 'responsive-image', image: product.featured_image, class: 'tb-product-card__image', alt: product.featured_image.alt %}
  </a>
  <div>
    <h3 class="tb-product-card__title">
      <a href="{{ product.url }}">{{ product.title | escape }}</a>
    </h3>
    {% render 'price', product: product %}
  </div>
</article>
```

- [ ] **Step 6: Add core sections**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/main-hero.liquid`:

```liquid
<section class="tb-section" style="--tb-section-padding: {{ section.settings.padding_top }}px;">
  <div class="tb-page-width">
    <p>{{ section.settings.eyebrow | escape }}</p>
    <h1>{{ section.settings.heading | escape }}</h1>
    <div>{{ section.settings.text }}</div>
    {% render 'button', label: section.settings.button_label, url: section.settings.button_link %}
  </div>
</section>

{% schema %}
{
  "name": "Hero",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Theme Base" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Build a storefront with a clear point of view" },
    { "type": "richtext", "id": "text", "label": "Text", "default": "<p>Compose premium commerce pages from reusable sections and components.</p>" },
    { "type": "text", "id": "button_label", "label": "Button label", "default": "Shop all" },
    { "type": "url", "id": "button_link", "label": "Button link" },
    { "type": "range", "id": "padding_top", "label": "Vertical padding", "min": 32, "max": 120, "step": 8, "default": 64 }
  ],
  "presets": [{ "name": "Hero" }]
}
{% endschema %}
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/featured-products.liquid`:

```liquid
<section class="tb-section">
  <div class="tb-page-width">
    <h2>{{ section.settings.heading | escape }}</h2>
    {% assign featured_collection = section.settings.collection %}
    {% if featured_collection != blank and featured_collection.products_count > 0 %}
      <div class="tb-grid tb-grid--products">
        {% for product in featured_collection.products limit: section.settings.products_to_show %}
          {% render 'product-card', product: product %}
        {% endfor %}
      </div>
    {% else %}
      <p>{{ 'sections.featured_products.empty' | t }}</p>
    {% endif %}
  </div>
</section>

{% schema %}
{
  "name": "Featured products",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Featured products" },
    { "type": "collection", "id": "collection", "label": "Collection" },
    { "type": "range", "id": "products_to_show", "label": "Products to show", "min": 2, "max": 12, "step": 1, "default": 4 }
  ],
  "presets": [{ "name": "Featured products" }]
}
{% endschema %}
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/sections/rich-content.liquid`:

```liquid
<section class="tb-section">
  <div class="tb-page-width">
    <h2>{{ section.settings.heading | escape }}</h2>
    <div>{{ section.settings.text }}</div>
  </div>
</section>

{% schema %}
{
  "name": "Rich content",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Designed for guided commerce" },
    { "type": "richtext", "id": "text", "label": "Text", "default": "<p>Use editorial content to explain products, routines, benefits, and buying decisions.</p>" }
  ],
  "presets": [{ "name": "Rich content" }]
}
{% endschema %}
```

- [ ] **Step 7: Add base templates and locale**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/index.json`:

```json
{
  "sections": {
    "main_hero": {
      "type": "main-hero",
      "settings": {}
    },
    "featured_products": {
      "type": "featured-products",
      "settings": {}
    },
    "rich_content": {
      "type": "rich-content",
      "settings": {}
    }
  },
  "order": ["main_hero", "featured_products", "rich_content"]
}
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/product.json`:

```json
{
  "sections": {
    "rich_content": {
      "type": "rich-content",
      "settings": {
        "heading": "Product details"
      }
    }
  },
  "order": ["rich_content"]
}
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/templates/collection.json`:

```json
{
  "sections": {
    "featured_products": {
      "type": "featured-products",
      "settings": {
        "heading": "Collection"
      }
    }
  },
  "order": ["featured_products"]
}
```

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/core/locales/en.default.json`:

```json
{
  "accessibility": {
    "skip_to_text": "Skip to content"
  },
  "sections": {
    "featured_products": {
      "empty": "Choose a collection to show featured products."
    }
  }
}
```

- [ ] **Step 8: Commit core source files**

Run:

```bash
git add packages/core
git commit -m "feat: add core theme source files"
```

Expected: commit succeeds with only `packages/core` changes.

---

### Task 4: Generator Implementation

**Files:**
- Modify: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/package.json`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/theme-writer.mjs`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/docs-writer.mjs`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/generate-theme.mjs`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/check-theme-structure.mjs`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/tests/generator.test.mjs`

- [ ] **Step 1: Add theme writer**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/theme-writer.mjs`:

```js
import fs from 'node:fs/promises';
import path from 'node:path';
import { coreRoot, themePath } from './paths.mjs';

async function copyDir(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyDir(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

export async function writeThemeFiles(blueprint) {
  const destination = themePath(blueprint.theme.handle);
  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(destination, { recursive: true });

  const mappings = [
    ['assets', 'assets'],
    ['layout', 'layout'],
    ['snippets', 'snippets'],
    ['sections', 'sections'],
    ['templates', 'templates'],
    ['locales', 'locales']
  ];

  for (const [sourceName, destinationName] of mappings) {
    await copyDir(path.join(coreRoot, sourceName), path.join(destination, destinationName));
  }

  await fs.mkdir(path.join(destination, 'config'), { recursive: true });
  await fs.writeFile(
    path.join(destination, 'config/settings_schema.json'),
    JSON.stringify(buildSettingsSchema(blueprint), null, 2)
  );
  await fs.writeFile(
    path.join(destination, 'config/settings_data.json'),
    JSON.stringify(buildSettingsData(blueprint), null, 2)
  );

  return destination;
}

function buildSettingsSchema(blueprint) {
  return [
    {
      "name": "theme_info",
      "theme_name": blueprint.theme.name,
      "theme_version": blueprint.theme.version,
      "theme_author": blueprint.theme.author,
      "theme_documentation_url": blueprint.theme.documentationUrl,
      "theme_support_url": blueprint.theme.supportUrl
    },
    {
      "name": "Theme Base tokens",
      "settings": [
        { "type": "color", "id": "color_background", "label": "Background", "default": blueprint.visual.tokens.background },
        { "type": "color", "id": "color_text", "label": "Text", "default": blueprint.visual.tokens.text },
        { "type": "color", "id": "color_accent", "label": "Accent", "default": blueprint.visual.tokens.accent }
      ]
    }
  ];
}

function buildSettingsData(blueprint) {
  return {
    "current": blueprint.presets[0].name,
    "presets": {
      [blueprint.presets[0].name]: {
        "color_background": blueprint.visual.tokens.background,
        "color_text": blueprint.visual.tokens.text,
        "color_accent": blueprint.visual.tokens.accent
      }
    }
  };
}
```

- [ ] **Step 2: Add docs writer**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/docs-writer.mjs`:

```js
import fs from 'node:fs/promises';
import path from 'node:path';

export async function writeGeneratedDocs(themeDirectory, blueprint) {
  const docsDirectory = path.join(themeDirectory, 'docs');
  await fs.mkdir(docsDirectory, { recursive: true });

  await fs.writeFile(path.join(docsDirectory, 'merchant.md'), merchantDocs(blueprint));
  await fs.writeFile(path.join(docsDirectory, 'ai-handoff.md'), aiDocs(blueprint));
  await fs.writeFile(path.join(docsDirectory, 'listing-draft.md'), listingDraft(blueprint));
  await fs.writeFile(path.join(docsDirectory, 'release-notes.md'), releaseNotes(blueprint));
  await fs.writeFile(path.join(docsDirectory, 'qa-checklist.md'), qaChecklist(blueprint));
}

function merchantDocs(blueprint) {
  return `# ${blueprint.theme.name} Merchant Guide

## Theme Positioning

${blueprint.presets[0].positioning}

## Setup Topics

${blueprint.docs.merchantTopics.map((topic) => `- ${topic}`).join('\n')}
`;
}

function aiDocs(blueprint) {
  return `# ${blueprint.theme.name} AI Handoff

Generated from \`blueprints/${blueprint.theme.handle}.json\`.

## Source Rules

- Durable changes belong in the blueprint or \`packages/core\`.
- Generated theme files can be inspected for validation.
- Move debug fixes back into source before committing.

## Notes

${blueprint.docs.aiNotes.map((note) => `- ${note}`).join('\n')}
`;
}

function listingDraft(blueprint) {
  return `# ${blueprint.theme.name} Listing Draft

${blueprint.listing.summary}

## Feature Bullets

${blueprint.listing.featureBullets.map((bullet) => `- ${bullet}`).join('\n')}

## Screenshot Plan

${blueprint.listing.screenshotPlan}
`;
}

function releaseNotes(blueprint) {
  return `# ${blueprint.theme.name} ${blueprint.theme.version}

${blueprint.listing.releaseNotes.map((note) => `- ${note}`).join('\n')}
`;
}

function qaChecklist(blueprint) {
  return `# ${blueprint.theme.name} QA Checklist

## Scenarios

${blueprint.qa.scenarios.map((scenario) => `- [ ] ${scenario}`).join('\n')}

## Lighthouse Targets

- Performance: ${blueprint.qa.lighthouse.performance}
- Accessibility: ${blueprint.qa.lighthouse.accessibility}
`;
}
```

- [ ] **Step 3: Add generator CLI**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/generate-theme.mjs`:

```js
import { validateBlueprint } from './validate-blueprint.mjs';
import { writeThemeFiles } from './theme-writer.mjs';
import { writeGeneratedDocs } from './docs-writer.mjs';

export async function generateTheme(handle) {
  const blueprint = await validateBlueprint(handle);
  const themeDirectory = await writeThemeFiles(blueprint);
  await writeGeneratedDocs(themeDirectory, blueprint);
  return themeDirectory;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const handle = process.argv[2];
  if (!handle) {
    throw new Error('Usage: npm run generate -- <handle>');
  }
  const themeDirectory = await generateTheme(handle);
  console.log(`Generated ${handle} at ${themeDirectory}`);
}
```

- [ ] **Step 4: Add structure checker**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/packages/generator/src/check-theme-structure.mjs`:

```js
import fs from 'node:fs/promises';
import path from 'node:path';
import { themePath } from './paths.mjs';

const requiredDirectories = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'docs'];
const requiredFiles = [
  'config/settings_schema.json',
  'config/settings_data.json',
  'layout/theme.liquid',
  'templates/index.json',
  'docs/merchant.md',
  'docs/ai-handoff.md',
  'docs/listing-draft.md',
  'docs/release-notes.md',
  'docs/qa-checklist.md'
];

export async function checkThemeStructure(handle) {
  const root = themePath(handle);
  for (const directory of requiredDirectories) {
    const stat = await fs.stat(path.join(root, directory));
    if (!stat.isDirectory()) {
      throw new Error(`${directory} is not a directory`);
    }
  }
  for (const file of requiredFiles) {
    const stat = await fs.stat(path.join(root, file));
    if (!stat.isFile()) {
      throw new Error(`${file} is not a file`);
    }
  }
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const handle = process.argv[2];
  if (!handle) {
    throw new Error('Usage: npm run check:theme-structure -- <handle>');
  }
  await checkThemeStructure(handle);
  console.log(`Theme ${handle} has the required generated structure`);
}
```

- [ ] **Step 5: Add generator scripts**

Update `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/package.json` scripts:

```json
{
  "scripts": {
    "generate": "node packages/generator/src/generate-theme.mjs",
    "check:theme-structure": "node packages/generator/src/check-theme-structure.mjs"
  }
}
```

- [ ] **Step 6: Add generator tests**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/tests/generator.test.mjs`:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { generateTheme } from '../packages/generator/src/generate-theme.mjs';
import { checkThemeStructure } from '../packages/generator/src/check-theme-structure.mjs';
import { themePath } from '../packages/generator/src/paths.mjs';

test('generates the Aster theme structure', async () => {
  const output = await generateTheme('aster');
  assert.equal(output, themePath('aster'));
  await checkThemeStructure('aster');

  const settingsSchema = JSON.parse(
    await fs.readFile(path.join(themePath('aster'), 'config/settings_schema.json'), 'utf8')
  );
  assert.equal(settingsSchema[0].theme_name, 'Aster');
});
```

- [ ] **Step 7: Run generator tests**

Run:

```bash
npm test -- tests/generator.test.mjs
npm run generate -- aster
npm run check:theme-structure -- aster
```

Expected:

```text
Generated aster at /Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/themes/aster
Theme aster has the required generated structure
```

- [ ] **Step 8: Commit generator implementation**

Run:

```bash
git add packages/generator tests/generator.test.mjs themes/aster package.json
git commit -m "feat: generate Shopify theme output from blueprint"
```

Expected: commit succeeds with generator, tests, and generated Aster output.

---

### Task 5: Factory Documentation

**Files:**
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/overview.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/component-contracts.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/section-contracts.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/agent-guide.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/blueprint-authoring.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/review-checklist.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/catalog-strategies.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/industry-playbooks.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/page-recipes.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/theme-store/submission-checklist.md`
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/theme-store/demo-store-guide.md`

- [ ] **Step 1: Add architecture overview**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/overview.md`:

```markdown
# Theme Base Architecture

Theme Base is a Shopify-native theme factory.

## Source Of Truth

- `packages/core`: reusable assets, Liquid snippets, sections, templates, schemas, and tokens.
- `blueprints`: theme definitions that select and configure core capabilities.
- `packages/generator`: code that validates blueprints and generates themes.
- `themes`: generated Shopify theme output.

## Generated Output Rule

Durable changes belong in `packages/core` or `blueprints`. Generated theme files under `themes/<handle>` can be inspected and validated, but source fixes must move back into core or the blueprint before committing.
```

- [ ] **Step 2: Add AI agent guide**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/agent-guide.md`:

```markdown
# AI Agent Guide

When creating or changing a generated theme:

1. Read `docs/architecture/overview.md`.
2. Read `docs/ai/blueprint-authoring.md`.
3. Edit `blueprints/<handle>.json` for theme-specific intent.
4. Edit `packages/core` for reusable implementation.
5. Run `npm run validate:blueprint -- <handle>`.
6. Run `npm run generate -- <handle>`.
7. Run `npm run check:theme-structure -- <handle>`.
8. Run `shopify theme check --path themes/<handle>`.

Do not make durable fixes only inside `themes/<handle>`.
```

- [ ] **Step 3: Add remaining docs with concrete content**

Create the remaining docs with these headings and bullet lists:

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/component-contracts.md`

```markdown
# Component Contracts

## Web Components

- Enhance server-rendered markup.
- Do not block navigation or purchase flows when JavaScript fails.
- Use `data-*` attributes for behavior hooks.
- Keep selectors local to the component.

## Liquid Snippets

- Accept explicit render parameters.
- Include LiquidDoc for reusable snippets.
- Avoid hidden global dependencies unless Shopify requires them.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/architecture/section-contracts.md`

```markdown
# Section Contracts

## Schema

- Use clear merchant-facing setting labels.
- Keep controls shallow.
- Provide presets for reusable sections.
- Use `block.shopify_attributes` for block wrappers.

## Content

- Provide useful empty states.
- Avoid demo-only content in install templates.
- Keep Theme Store demo copy authentic.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/blueprint-authoring.md`

```markdown
# Blueprint Authoring

Blueprints describe theme intent and configuration. They do not contain arbitrary Liquid code.

## Required Flow

1. Choose industries and catalog size.
2. Define merchant profile and buying behavior.
3. Choose visual tokens.
4. Select core components and sections.
5. Define template coverage.
6. Add listing, docs, release notes, and QA scenarios.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/ai/review-checklist.md`

```markdown
# AI Review Checklist

- Blueprint validates.
- Generated theme structure validates.
- Shopify Theme Check passes or warnings are documented.
- Mobile layout fits text and controls.
- Keyboard focus is visible.
- Generated docs match the blueprint positioning.
- Durable changes are in source, not only generated output.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/catalog-strategies.md`

```markdown
# Catalog Strategies

## 1 Product

Use focused storytelling, comparison, FAQ, and sticky purchase behavior.

## Few (2-10)

Use product education, bundles, and guided comparison.

## Some (11-100+)

Use collection discovery, filters, editorial merchandising, and clear product cards.

## Lots (500+)

Use dense filtering, search, category navigation, and highly scannable product grids.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/industry-playbooks.md`

```markdown
# Industry Playbooks

## Beauty And Wellness

Prioritize routines, ingredients, benefits, trust, education, and gentle conversion.

## Electronics

Prioritize specifications, comparison, compatibility, warranty, inventory clarity, and dense collection browsing.

## Home

Prioritize room context, materials, dimensions, lookbooks, collection grouping, and delivery details.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/patterns/page-recipes.md`

```markdown
# Page Recipes

## Home

Hero, featured products, editorial content, trust, newsletter.

## Product

Media, title, price, variants, buy buttons, details, related products.

## Collection

Intro, filters, product grid, pagination, empty state.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/theme-store/submission-checklist.md`

```markdown
# Theme Store Submission Checklist

- Package with `shopify theme package --path themes/<handle>`.
- Confirm theme and preset names before upload.
- Provide demo store URL.
- Provide desktop screenshot at 1000x1248 or 2000x2496.
- Provide mobile screenshot at 750x1334.
- Provide docs URL and support contact form.
- Include release notes.
- Verify performance and accessibility targets.
```

`/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/theme-store/demo-store-guide.md`

```markdown
# Demo Store Guide

- Match demo store industry to preset industry tags.
- Match demo store catalog size to preset catalog size.
- Use authentic copy.
- Use licensed imagery.
- Do not show app-powered features as built-in theme features.
- Use test payment setup required by Shopify demo store rules.
```

- [ ] **Step 4: Commit documentation**

Run:

```bash
git add docs/architecture docs/ai docs/patterns docs/theme-store
git commit -m "docs: add theme factory documentation"
```

Expected: commit succeeds with factory documentation files.

---

### Task 6: Second Blueprint To Prove Generality

**Files:**
- Create: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/blueprints/electronics-spec.json`
- Generated: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/themes/electronics-spec/**`

- [ ] **Step 1: Add electronics blueprint**

Create `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/blueprints/electronics-spec.json`:

```json
{
  "theme": {
    "name": "Spec",
    "handle": "electronics-spec",
    "version": "0.1.0",
    "author": "Miso",
    "documentationUrl": "https://example.com/spec/docs",
    "supportUrl": "https://example.com/spec/support"
  },
  "presets": [
    {
      "name": "Spec",
      "handle": "spec",
      "industries": ["Electronics"],
      "catalogSize": "Some (11-100+)",
      "positioning": "A precise electronics storefront for specification-heavy products, comparison-led browsing, and confident purchasing."
    }
  ],
  "market": {
    "merchantProfile": "Electronics merchants selling products where specs, compatibility, and warranty details matter.",
    "productModel": "Cameras, audio gear, accessories, bundles, and device-compatible products.",
    "buyingBehavior": "Customers compare specifications, price, warranty, compatibility, and availability.",
    "catalogStrategy": "Some catalog with structured collection browsing and product detail clarity."
  },
  "visual": {
    "tokens": {
      "background": "#F5F7FA",
      "text": "#10151F",
      "accent": "#2357D6",
      "surface": "#FFFFFF",
      "border": "#D6DCE7",
      "radius": "6px"
    },
    "typography": "Utility-forward headings and compact body copy for specification browsing.",
    "imagery": "Clean product photography with device context and close-up detail shots.",
    "density": "balanced",
    "motion": "restrained"
  },
  "components": ["drawer", "accordion", "tabs", "quantity-stepper", "variant-controller", "media-gallery"],
  "sections": ["main-hero", "featured-products", "rich-content"],
  "templates": ["index", "product", "collection", "cart", "search", "blog", "article", "page"],
  "content": {
    "homeHeroHeading": "Compare the details before you buy",
    "homeHeroText": "A precise commerce experience for spec-heavy electronics and accessory catalogs.",
    "emptyStateText": "No products are available in this view yet.",
    "newsletterHeading": "Product updates, launch notes, and buying guides"
  },
  "listing": {
    "summary": "Spec is an electronics theme direction built for specification-led browsing, comparison, and confident purchasing.",
    "featureBullets": [
      "Structured browsing for specification-heavy catalogs",
      "Clean product cards for fast comparison",
      "Generated merchant docs, QA checklist, and listing draft"
    ],
    "screenshotPlan": "Capture desktop and mobile home pages with product comparison framing and featured products visible.",
    "releaseNotes": [
      "Initial generated electronics proof theme for Theme Base generality."
    ]
  },
  "docs": {
    "merchantTopics": ["Homepage setup", "Featured products", "Product specs", "Theme settings"],
    "aiNotes": ["Spec proves electronics support for the Theme Base factory."]
  },
  "qa": {
    "scenarios": ["Home page renders", "Product card renders", "Collection template exists", "Theme docs generated"],
    "lighthouse": {
      "performance": 60,
      "accessibility": 90
    }
  }
}
```

- [ ] **Step 2: Validate and generate electronics proof theme**

Run:

```bash
npm run validate:blueprint -- electronics-spec
npm run generate -- electronics-spec
npm run check:theme-structure -- electronics-spec
```

Expected:

```text
Blueprint electronics-spec is valid
Generated electronics-spec at /Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/themes/electronics-spec
Theme electronics-spec has the required generated structure
```

- [ ] **Step 3: Commit second proof theme**

Run:

```bash
git add blueprints/electronics-spec.json themes/electronics-spec
git commit -m "feat: add electronics proof blueprint"
```

Expected: commit succeeds and proves the generator is not beauty-only.

---

### Task 7: Shopify Validation Pass

**Files:**
- Generated theme files under `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/themes/aster`
- Generated theme files under `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/themes/electronics-spec`

- [ ] **Step 1: Run Theme Check on Aster**

Run:

```bash
SHOPIFY_CLI_AGENT_INFO='n:codex|v:none|p:openai|m:none' SHOPIFY_CLI_AGENT_IDS='s:537a64ef-749c-4808-85c0-68dbff726d5a' shopify theme check --path themes/aster
```

Expected: no errors. Warnings must be fixed unless they are documented in the plan execution notes with a concrete reason.

- [ ] **Step 2: Run Theme Check on electronics proof theme**

Run:

```bash
SHOPIFY_CLI_AGENT_INFO='n:codex|v:none|p:openai|m:none' SHOPIFY_CLI_AGENT_IDS='s:537a64ef-749c-4808-85c0-68dbff726d5a' shopify theme check --path themes/electronics-spec
```

Expected: no errors. Warnings must be fixed unless they are documented in the plan execution notes with a concrete reason.

- [ ] **Step 3: Package Aster**

Run:

```bash
SHOPIFY_CLI_AGENT_INFO='n:codex|v:none|p:openai|m:none' SHOPIFY_CLI_AGENT_IDS='s:537a64ef-749c-4808-85c0-68dbff726d5a' shopify theme package --path themes/aster
```

Expected: Shopify CLI creates a ZIP named from Aster's `theme_name` and `theme_version`.

- [ ] **Step 4: Package electronics proof theme**

Run:

```bash
SHOPIFY_CLI_AGENT_INFO='n:codex|v:none|p:openai|m:none' SHOPIFY_CLI_AGENT_IDS='s:537a64ef-749c-4808-85c0-68dbff726d5a' shopify theme package --path themes/electronics-spec
```

Expected: Shopify CLI creates a ZIP named from Spec's `theme_name` and `theme_version`.

- [ ] **Step 5: Commit validation fixes**

If validation required code fixes, run:

```bash
git add packages/core packages/generator blueprints themes docs package.json package-lock.json
git commit -m "fix: resolve generated theme validation issues"
```

Expected: commit succeeds only if fixes were required. If no fixes were required, skip the commit and record successful validation in the final execution summary.

---

### Task 8: Final Review And Handoff

**Files:**
- Read: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/superpowers/specs/2026-07-07-theme-base-factory-design.md`
- Read: `/Users/devhugon/Desktop/Workspaces/miso-apps/theme-base/docs/superpowers/plans/2026-07-07-theme-base-factory.md`

- [ ] **Step 1: Run full local verification**

Run:

```bash
npm test
npm run validate:blueprint -- aster
npm run validate:blueprint -- electronics-spec
npm run check:theme-structure -- aster
npm run check:theme-structure -- electronics-spec
SHOPIFY_CLI_AGENT_INFO='n:codex|v:none|p:openai|m:none' SHOPIFY_CLI_AGENT_IDS='s:537a64ef-749c-4808-85c0-68dbff726d5a' shopify theme check --path themes/aster
SHOPIFY_CLI_AGENT_INFO='n:codex|v:none|p:openai|m:none' SHOPIFY_CLI_AGENT_IDS='s:537a64ef-749c-4808-85c0-68dbff726d5a' shopify theme check --path themes/electronics-spec
```

Expected: all tests and checks complete. Any warning or failure is captured with file path, command, and next fix.

- [ ] **Step 2: Review generated docs**

Run:

```bash
sed -n '1,220p' themes/aster/docs/merchant.md
sed -n '1,220p' themes/aster/docs/ai-handoff.md
sed -n '1,220p' themes/aster/docs/listing-draft.md
sed -n '1,220p' themes/electronics-spec/docs/listing-draft.md
```

Expected: generated docs reflect the correct blueprint positioning and do not mention Dawn as a generated foundation.

- [ ] **Step 3: Summarize implementation state**

Write a final execution summary with:

```markdown
## Theme Base Factory Status

- Blueprint schema: complete
- Aster blueprint: complete
- Electronics proof blueprint: complete
- Generator: complete
- Generated Aster theme: complete
- Generated electronics proof theme: complete
- Factory docs: complete
- Shopify Theme Check: record the exact command status for Aster and electronics-spec.
- Theme packages: record the generated ZIP filenames for Aster and electronics-spec.

## Remaining Next Phase

- Expand core product page primitives.
- Add richer section families.
- Add browser preview screenshots.
- Add Lighthouse workflow.
```

- [ ] **Step 4: Commit final verification notes if a notes file was created**

If the execution creates a verification notes file, run:

```bash
git add docs
git commit -m "docs: record theme factory verification"
```

Expected: commit succeeds only when a verification notes file exists.

---

## Self-Review Coverage

This plan covers every approved spec area:

- Monorepo factory structure: Tasks 1, 4
- Shopify-native generated output: Tasks 4, 7
- Strong UI component layer: Task 3
- JSON Schema-backed blueprints: Task 2
- Full theme plus docs/listing/release notes/QA generation: Task 4
- AI-friendly docs and workflow: Task 5
- Aster proof theme: Tasks 2, 4, 7
- Second non-beauty proof theme: Task 6
- Validation and packaging: Tasks 7, 8

The first implementation pass intentionally builds a working vertical slice. Product-page depth, richer section families, Lighthouse automation, and browser screenshot workflows become the next phase after this plan proves the factory loop end to end.
