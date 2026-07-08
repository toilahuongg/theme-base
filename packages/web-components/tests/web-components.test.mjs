import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { buildWebComponents } from '../scripts/build.mjs';

const packageRoot = path.resolve(import.meta.dirname, '..');

test('registers Theme Base custom elements once', async () => {
  const source = await fs.readFile(path.join(packageRoot, 'src/index.js'), 'utf8');
  const definitions = new Map();
  const context = vm.createContext({
    Event,
    HTMLElement: class HTMLElement {},
    customElements: {
      define(name, elementClass) {
        definitions.set(name, elementClass);
      },
      get(name) {
        return definitions.get(name);
      }
    }
  });

  vm.runInContext(source, context);
  vm.runInContext(source, context);

  assert.equal(definitions.size, 2);
  assert.equal(typeof definitions.get('theme-base-disclosure'), 'function');
  assert.equal(typeof definitions.get('theme-base-quantity'), 'function');
});

test('builds distributable browser asset', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'theme-base-web-components-'));
  const distFile = path.join(tempDir, 'dist/theme-components.js');

  try {
    const result = await buildWebComponents({ distFile, syncCoreAsset: false });
    const output = await fs.readFile(result.distFile, 'utf8');

    assert.equal(result.coreAssetFile, null);
    assert.match(output, /Generated from packages\/web-components\/src\/index\.js/);
    assert.match(output, /customElements\.define\('theme-base-disclosure'/);
    assert.match(output, /customElements\.define\('theme-base-quantity'/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
