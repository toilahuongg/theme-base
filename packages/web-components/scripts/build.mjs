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

function toModulePath(specifier, fromFile) {
  return path.resolve(path.dirname(fromFile), specifier);
}

async function collectModules(entryFile, seen = new Set(), ordered = []) {
  if (seen.has(entryFile)) return ordered;
  seen.add(entryFile);

  const source = await fs.readFile(entryFile, 'utf8');
  const importRe = /^\s*import\s+{([^}]+)}\s+from\s+['"](.+)['"];\s*$/gm;
  let match;
  while ((match = importRe.exec(source))) {
    const dependency = toModulePath(match[2], entryFile);
    await collectModules(dependency, seen, ordered);
  }

  ordered.push({ file: entryFile, source });
  return ordered;
}

function transformModule(source) {
  const withoutImports = source.replace(/^\s*import\s+{[^}]+}\s+from\s+['"][^'"]+['"];\s*$/gm, '');
  return withoutImports
    .replace(/^\s*export\s+function\s+/gm, 'function ')
    .replace(/^\s*export\s+class\s+/gm, 'class ')
    .replace(/^\s*export\s+(const|let|var)\s+/gm, '$1 ');
}

async function bundle(entryFile) {
  const modules = await collectModules(entryFile);
  const body = modules.map((module) => transformModule(module.source).trim()).filter(Boolean).join('\n\n');
  return `${generatedBanner}(() => {\n${body}\n})();\n`;
}

export async function buildWebComponents(options = {}) {
  const distFile = options.distFile ?? defaultDistFile;
  const coreAssetFile = options.coreAssetFile ?? defaultCoreAssetFile;
  const syncCoreAsset = options.syncCoreAsset ?? true;
  const output = await bundle(sourceFile);

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
