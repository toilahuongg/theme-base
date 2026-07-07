import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themePath } from './paths.mjs';

const REQUIRED_DIRECTORIES = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'docs'];
const REQUIRED_FILES = [
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

function isCliEntrypoint() {
  return Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

async function assertExists(filePath, description) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Missing required ${description}: ${filePath}`);
  }
}

export async function checkThemeStructure(handle) {
  const root = themePath(handle);

  await assertExists(root, 'theme directory');

  for (const directoryName of REQUIRED_DIRECTORIES) {
    await assertExists(path.join(root, directoryName), 'directory');
  }

  for (const fileName of REQUIRED_FILES) {
    await assertExists(path.join(root, fileName), 'file');
  }

  return root;
}

if (isCliEntrypoint()) {
  const handle = process.argv[2];
  if (!handle) {
    throw new Error('Usage: npm run check:theme-structure -- <handle>');
  }

  const themeDir = await checkThemeStructure(handle);
  console.log(`Theme structure for ${themeDir} is valid`);
}
