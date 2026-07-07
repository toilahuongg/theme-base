import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { checkThemeStructure } from '../packages/generator/src/check-theme-structure.mjs';
import { generateTheme } from '../packages/generator/src/generate-theme.mjs';
import { themePath } from '../packages/generator/src/paths.mjs';

const execFileAsync = promisify(execFile);

test('generateTheme returns the Aster theme path', async () => {
  await fs.rm(themePath('aster'), { recursive: true, force: true });

  const generatedPath = await generateTheme('aster');

  assert.equal(generatedPath, themePath('aster'));
});

test('checkThemeStructure succeeds for Aster', async () => {
  await checkThemeStructure('aster');
});

test('settings_schema.json includes the Aster theme name', async () => {
  const schemaPath = path.join(themePath('aster'), 'config/settings_schema.json');
  const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
  const themeNameSetting = schema.flatMap((group) => group.settings ?? []).find((setting) => setting.id === 'theme_name');

  assert.ok(themeNameSetting);
  assert.equal(themeNameSetting.default, 'Aster');
});

test('merchant docs include generated source-of-truth guidance', async () => {
  const docsPath = path.join(themePath('aster'), 'docs/merchant.md');
  const merchantDocs = await fs.readFile(docsPath, 'utf8');

  assert.match(merchantDocs, /generated from the blueprint/i);
  assert.match(merchantDocs, /source of truth/i);
});

test('generator modules can be imported from node eval without running CLI entrypoints', async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    '-e',
    "import('./packages/generator/src/generate-theme.mjs').then((m) => console.log(typeof m.generateTheme))"
  ]);

  assert.match(stdout, /function/);
});
