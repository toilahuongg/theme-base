import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';
import { validateBlueprint } from '../packages/generator/src/validate-blueprint.mjs';

const execFileAsync = promisify(execFile);

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

test('rejects unsafe blueprint handles before resolving files', async () => {
  await assert.rejects(
    () => validateBlueprint('../package'),
    /Invalid blueprint handle/
  );
});

test('can be imported from node eval without running the CLI entrypoint', async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    '-e',
    "import('./packages/generator/src/validate-blueprint.mjs').then(async (m) => { try { await m.validateBlueprint('../package') } catch (error) { console.log(error.message) } })"
  ]);
  assert.match(stdout, /Invalid blueprint handle/);
});

test('rejects a blueprint missing required schema fields', async () => {
  const invalidHandle = 'invalid-missing-fields-test';
  const blueprintRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'so-blueprints-'));
  const invalidPath = path.join(blueprintRoot, `${invalidHandle}.json`);
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
      () => validateBlueprint(invalidHandle, { blueprintRoot }),
      /Blueprint invalid-missing-fields-test is invalid:[\s\S]*must have required property 'presets'/
    );
  } finally {
    await fs.rm(blueprintRoot, { recursive: true, force: true });
  }
});
