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
