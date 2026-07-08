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

async function assertDirectory(directoryPath) {
  let stat;
  try {
    stat = await fs.stat(directoryPath);
  } catch {
    throw new Error(`Missing required directory: ${directoryPath}`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`Required directory is not a directory: ${directoryPath}`);
  }
}

async function assertFile(filePath) {
  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    throw new Error(`Missing required file: ${filePath}`);
  }
  if (!stat.isFile()) {
    throw new Error(`Required file is not a file: ${filePath}`);
  }
}

export async function checkThemeStructure(handle, options = {}) {
  const root = themePath(handle, options.themeRoot);

  await assertDirectory(root);

  for (const directoryName of REQUIRED_DIRECTORIES) {
    await assertDirectory(path.join(root, directoryName));
  }

  for (const fileName of REQUIRED_FILES) {
    await assertFile(path.join(root, fileName));
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
