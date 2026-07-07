import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';
import { blueprintPath } from '../packages/generator/src/paths.mjs';
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

test('rejects a blueprint missing required schema fields', async () => {
  const invalidHandle = '__invalid-missing-fields-test';
  const invalidPath = blueprintPath(invalidHandle);
  const invalidBlueprint = {
    theme: {
      name: 'Invalid',
      handle: 'invalid',
      version: '0.1.0',
      author: 'Miso',
      documentationUrl: 'https://example.com/docs',
      supportUrl: 'https://example.com/support'
    }
  };

  await fs.writeFile(invalidPath, JSON.stringify(invalidBlueprint, null, 2));
  try {
    await assert.rejects(
      () => validateBlueprint(invalidHandle),
      /Blueprint __invalid-missing-fields-test is invalid:[\s\S]*must have required property 'presets'/
    );
  } finally {
    await fs.rm(invalidPath, { force: true });
  }
});
