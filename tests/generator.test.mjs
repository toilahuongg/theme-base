import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { checkThemeStructure } from '../packages/generator/src/check-theme-structure.mjs';
import { generateTheme } from '../packages/generator/src/generate-theme.mjs';
import { coreRoot, themePath } from '../packages/generator/src/paths.mjs';

const execFileAsync = promisify(execFile);
const tempThemesRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'theme-base-generated-'));
const asterPath = themePath('aster', tempThemesRoot);

test.after(async () => {
  await fs.rm(tempThemesRoot, { recursive: true, force: true });
});

test('generateTheme returns the Aster theme path', async () => {
  const generatedPath = await generateTheme('aster', { themeRoot: tempThemesRoot });

  assert.equal(generatedPath, asterPath);
});

test('rejects unsafe theme handles before resolving output paths', async () => {
  assert.throws(() => themePath('../packages'), /Invalid theme handle/);
  await assert.rejects(() => checkThemeStructure('../packages'), /Invalid theme handle/);
});

test('checkThemeStructure succeeds for Aster', async () => {
  await generateTheme('aster', { themeRoot: tempThemesRoot });
  await checkThemeStructure('aster', { themeRoot: tempThemesRoot });
});

test('generated theme includes Shopify theme blocks from core', async () => {
  await generateTheme('aster', { themeRoot: tempThemesRoot });

  const blockFiles = await fs.readdir(path.join(asterPath, 'blocks'));

  assert.deepEqual(blockFiles.sort(), ['callout-card.liquid', 'content-stack.liquid']);
});

test('settings data matches generated settings schema ids', async () => {
  await generateTheme('aster', { themeRoot: tempThemesRoot });
  const schemaPath = path.join(asterPath, 'config/settings_schema.json');
  const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
  const themeInfo = schema.find((group) => group.name === 'theme_info');
  const settingIds = schema.flatMap((group) => group.settings ?? []).map((setting) => setting.id);
  const settingsData = JSON.parse(await fs.readFile(path.join(asterPath, 'config/settings_data.json'), 'utf8'));

  assert.ok(themeInfo);
  assert.equal(themeInfo.theme_name, 'Aster');
  assert.deepEqual(Object.keys(settingsData.current).sort(), settingIds.sort());
});

test('merchant docs include generated source-of-truth guidance', async () => {
  await generateTheme('aster', { themeRoot: tempThemesRoot });
  const docsPath = path.join(asterPath, 'docs/merchant.md');
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

test('checkThemeStructure rejects files where directories are required', async () => {
  const handle = 'invalid-structure-test';
  const root = themePath(handle, tempThemesRoot);
  await fs.rm(root, { recursive: true, force: true });
  await fs.mkdir(root, { recursive: true });
  await fs.writeFile(path.join(root, 'assets'), '');

  try {
    await assert.rejects(() => checkThemeStructure(handle, { themeRoot: tempThemesRoot }), /Required directory is not a directory/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('checkThemeStructure rejects themes without a blocks directory', async () => {
  const handle = 'missing-blocks-test';
  const root = themePath(handle, tempThemesRoot);
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

  await fs.rm(root, { recursive: true, force: true });
  for (const directory of requiredDirectories) {
    await fs.mkdir(path.join(root, directory), { recursive: true });
  }
  for (const file of requiredFiles) {
    await fs.writeFile(path.join(root, file), '{}');
  }

  try {
    await assert.rejects(() => checkThemeStructure(handle, { themeRoot: tempThemesRoot }), /Missing required directory: .*blocks/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('generated files are restricted to the core manifest allowlist', async () => {
  const extraPath = path.join(coreRoot, 'assets/__manifest-leak-test.txt');
  await fs.writeFile(extraPath, 'should not be generated');

  try {
    await generateTheme('aster', { themeRoot: tempThemesRoot });
    await assert.rejects(
      () => fs.stat(path.join(asterPath, 'assets/__manifest-leak-test.txt')),
      /ENOENT/
    );
  } finally {
    await fs.rm(extraPath, { force: true });
  }
});
