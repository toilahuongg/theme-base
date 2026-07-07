import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBlueprint } from './validate-blueprint.mjs';
import { themePath } from './paths.mjs';
import { writeDocs } from './docs-writer.mjs';
import { writeTheme } from './theme-writer.mjs';

function isCliEntrypoint() {
  return Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

export async function generateTheme(handle) {
  const blueprint = await validateBlueprint(handle);
  await writeTheme(handle, blueprint);
  await writeDocs(handle, blueprint);
  return themePath(handle);
}

if (isCliEntrypoint()) {
  const handle = process.argv[2];
  if (!handle) {
    throw new Error('Usage: npm run generate -- <handle>');
  }

  const generatedPath = await generateTheme(handle);
  console.log(`Generated theme at ${generatedPath}`);
}
