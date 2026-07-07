import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentFile = fileURLToPath(import.meta.url);
export const repoRoot = path.resolve(path.dirname(currentFile), '../../..');
export const coreRoot = path.join(repoRoot, 'packages/core');
export const blueprintRoot = path.join(repoRoot, 'blueprints');
export const themesRoot = path.join(repoRoot, 'themes');
export const schemaPath = path.join(coreRoot, 'schemas/blueprint.schema.json');

export function blueprintPath(handle) {
  return path.join(blueprintRoot, `${handle}.json`);
}

export function themePath(handle) {
  return path.join(themesRoot, handle);
}
