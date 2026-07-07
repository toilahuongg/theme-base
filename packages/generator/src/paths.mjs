import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BLUEPRINT_HANDLE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const currentFile = fileURLToPath(import.meta.url);
export const repoRoot = path.resolve(path.dirname(currentFile), '../../..');
export const coreRoot = path.join(repoRoot, 'packages/core');
export const blueprintRoot = path.join(repoRoot, 'blueprints');
export const themesRoot = path.join(repoRoot, 'themes');
export const schemaPath = path.join(coreRoot, 'schemas/blueprint.schema.json');

export function assertBlueprintHandle(handle) {
  if (!BLUEPRINT_HANDLE_PATTERN.test(handle)) {
    throw new Error(`Invalid blueprint handle "${handle}". Use lowercase letters, numbers, and hyphens.`);
  }
}

export function blueprintPath(handle, root = blueprintRoot) {
  assertBlueprintHandle(handle);
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(resolvedRoot, `${handle}.json`);
  const relativePath = path.relative(resolvedRoot, resolvedPath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Blueprint path for "${handle}" must stay inside ${resolvedRoot}.`);
  }
  return resolvedPath;
}

export function themePath(handle) {
  return path.join(themesRoot, handle);
}
