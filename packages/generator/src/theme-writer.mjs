import fs from 'node:fs/promises';
import path from 'node:path';
import { coreRoot, themePath } from './paths.mjs';

const MANIFEST_PATH = path.join(coreRoot, 'manifest.json');
const MANIFEST_DESTINATIONS = {
  assets: 'assets',
  layouts: 'layout',
  snippets: 'snippets',
  sections: 'sections',
  templates: 'templates',
  locales: 'locales'
};

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function ensureParentDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function copyFile(sourcePath, destinationPath) {
  await ensureParentDirectory(destinationPath);
  await fs.copyFile(sourcePath, destinationPath);
}

function safeManifestPath(root, directoryName, fileName) {
  const directoryRoot = path.resolve(root, directoryName);
  const filePath = path.resolve(directoryRoot, fileName);
  const relativePath = path.relative(directoryRoot, filePath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Manifest file "${fileName}" must stay inside ${directoryRoot}`);
  }
  return filePath;
}

function settingsValues(blueprint) {
  const tokens = blueprint.visual.tokens;

  return {
    color_background: tokens.background,
    color_surface: tokens.surface,
    color_text: tokens.text,
    color_accent: tokens.accent,
    color_border: tokens.border,
    radius: tokens.radius,
    typography: blueprint.visual.typography,
    imagery: blueprint.visual.imagery,
    density: blueprint.visual.density,
    motion: blueprint.visual.motion
  };
}

function createSettingsSchema(blueprint) {
  const values = settingsValues(blueprint);

  return [
    {
      name: 'theme_info',
      theme_name: blueprint.theme.name,
      theme_version: blueprint.theme.version,
      theme_author: blueprint.theme.author,
      theme_documentation_url: blueprint.theme.documentationUrl,
      theme_support_url: blueprint.theme.supportUrl
    },
    {
      name: 'Visual tokens',
      settings: [
        { type: 'color', id: 'color_background', label: 'Background', default: values.color_background },
        { type: 'color', id: 'color_surface', label: 'Surface', default: values.color_surface },
        { type: 'color', id: 'color_text', label: 'Text', default: values.color_text },
        { type: 'color', id: 'color_accent', label: 'Accent', default: values.color_accent },
        { type: 'color', id: 'color_border', label: 'Border', default: values.color_border },
        { type: 'text', id: 'radius', label: 'Radius', default: values.radius },
        { type: 'text', id: 'typography', label: 'Typography', default: values.typography },
        { type: 'text', id: 'imagery', label: 'Imagery', default: values.imagery },
        { type: 'text', id: 'density', label: 'Density', default: values.density },
        { type: 'text', id: 'motion', label: 'Motion', default: values.motion }
      ]
    }
  ];
}

function createSettingsData(blueprint) {
  return {
    current: settingsValues(blueprint)
  };
}

export async function writeTheme(handle, blueprint, options = {}) {
  const manifest = await readJson(MANIFEST_PATH);
  const destinationRoot = themePath(handle, options.themeRoot);

  await fs.rm(destinationRoot, { recursive: true, force: true });
  await fs.mkdir(destinationRoot, { recursive: true });

  for (const [manifestKey, fileNames] of Object.entries(manifest)) {
    const destinationDirectory = MANIFEST_DESTINATIONS[manifestKey];
    if (!destinationDirectory) {
      throw new Error(`Unknown core manifest key "${manifestKey}"`);
    }
    if (!Array.isArray(fileNames)) {
      throw new Error(`Core manifest key "${manifestKey}" must be an array`);
    }

    for (const fileName of fileNames) {
      const sourcePath = safeManifestPath(coreRoot, destinationDirectory, fileName);
      const destinationPath = safeManifestPath(destinationRoot, destinationDirectory, fileName);
      await copyFile(sourcePath, destinationPath);
    }
  }

  const configDir = path.join(destinationRoot, 'config');
  await fs.mkdir(configDir, { recursive: true });
  await fs.writeFile(path.join(configDir, 'settings_schema.json'), `${JSON.stringify(createSettingsSchema(blueprint), null, 2)}\n`);
  await fs.writeFile(path.join(configDir, 'settings_data.json'), `${JSON.stringify(createSettingsData(blueprint), null, 2)}\n`);

  return destinationRoot;
}
