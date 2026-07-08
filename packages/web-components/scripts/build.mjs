import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(currentFile), '..');
const repoRoot = path.resolve(packageRoot, '../..');
const sourceFile = path.join(packageRoot, 'src/index.js');
const defaultDistFile = path.join(packageRoot, 'dist/theme-components.js');
const defaultCoreAssetFile = path.join(repoRoot, 'packages/core/assets/theme-components.js');
const generatedBanner = `// Generated from packages/web-components/src/index.js.\n// Run npm run build:web-components after editing web component source.\n\n`;

async function writeFile(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents);
}

export async function buildWebComponents(options = {}) {
  const distFile = options.distFile ?? defaultDistFile;
  const coreAssetFile = options.coreAssetFile ?? defaultCoreAssetFile;
  const syncCoreAsset = options.syncCoreAsset ?? true;
  const source = await fs.readFile(sourceFile, 'utf8');
  const output = `${generatedBanner}${source}`;

  await writeFile(distFile, output);

  if (syncCoreAsset) {
    await writeFile(coreAssetFile, output);
  }

  return {
    distFile,
    coreAssetFile: syncCoreAsset ? coreAssetFile : null
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await buildWebComponents();
  console.log(`Built ${path.relative(repoRoot, result.distFile)}`);
  console.log(`Synced ${path.relative(repoRoot, result.coreAssetFile)}`);
}
