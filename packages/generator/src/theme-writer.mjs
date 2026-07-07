import fs from 'node:fs/promises';
import path from 'node:path';
import { coreRoot, themePath } from './paths.mjs';

const CORE_DIRECTORIES = ['assets', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const MANIFEST_PATH = path.join(coreRoot, 'manifest.json');

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

async function copyDirectory(sourceDir, destinationDir) {
  await fs.mkdir(destinationDir, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (entry.isFile()) {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

function createSettingsSchema(blueprint) {
  const tokens = blueprint.visual.tokens;

  return [
    {
      name: 'Theme identity',
      settings: [
        { type: 'text', id: 'theme_name', label: 'Theme name', default: blueprint.theme.name },
        { type: 'text', id: 'theme_handle', label: 'Theme handle', default: blueprint.theme.handle },
        { type: 'text', id: 'theme_version', label: 'Theme version', default: blueprint.theme.version },
        { type: 'text', id: 'theme_author', label: 'Theme author', default: blueprint.theme.author },
        { type: 'url', id: 'theme_documentation_url', label: 'Documentation URL', default: blueprint.theme.documentationUrl },
        { type: 'url', id: 'theme_support_url', label: 'Support URL', default: blueprint.theme.supportUrl }
      ]
    },
    {
      name: 'Visual tokens',
      settings: [
        { type: 'color', id: 'color_background', label: 'Background', default: tokens.background },
        { type: 'color', id: 'color_surface', label: 'Surface', default: tokens.surface },
        { type: 'color', id: 'color_text', label: 'Text', default: tokens.text },
        { type: 'color', id: 'color_accent', label: 'Accent', default: tokens.accent },
        { type: 'color', id: 'color_border', label: 'Border', default: tokens.border },
        { type: 'text', id: 'radius', label: 'Radius', default: tokens.radius },
        { type: 'text', id: 'typography', label: 'Typography', default: blueprint.visual.typography },
        { type: 'text', id: 'imagery', label: 'Imagery', default: blueprint.visual.imagery },
        { type: 'text', id: 'density', label: 'Density', default: blueprint.visual.density },
        { type: 'text', id: 'motion', label: 'Motion', default: blueprint.visual.motion }
      ]
    }
  ];
}

function createSettingsData(blueprint) {
  const preset = blueprint.presets[0] ?? null;
  return {
    current: {
      theme: {
        name: blueprint.theme.name,
        handle: blueprint.theme.handle,
        version: blueprint.theme.version,
        author: blueprint.theme.author,
        documentation_url: blueprint.theme.documentationUrl,
        support_url: blueprint.theme.supportUrl
      },
      preset: preset
        ? {
            name: preset.name,
            handle: preset.handle,
            industries: preset.industries,
            catalog_size: preset.catalogSize,
            positioning: preset.positioning
          }
        : null,
      visual: {
        ...blueprint.visual.tokens,
        typography: blueprint.visual.typography,
        imagery: blueprint.visual.imagery,
        density: blueprint.visual.density,
        motion: blueprint.visual.motion
      },
      market: blueprint.market,
      content: blueprint.content
    },
    generated: {
      blueprint_handle: blueprint.theme.handle,
      source_of_truth: ['blueprints', 'packages/core']
    }
  };
}

export async function writeTheme(handle, blueprint) {
  const manifest = await readJson(MANIFEST_PATH);
  const destinationRoot = themePath(handle);

  await fs.rm(destinationRoot, { recursive: true, force: true });
  await fs.mkdir(destinationRoot, { recursive: true });

  for (const directoryName of CORE_DIRECTORIES) {
    const sourceDir = path.join(coreRoot, directoryName);
    const targetDir = path.join(destinationRoot, directoryName);
    await copyDirectory(sourceDir, targetDir);
  }

  for (const [directoryName, fileNames] of Object.entries(manifest)) {
    if (!CORE_DIRECTORIES.includes(directoryName)) {
      continue;
    }

    for (const fileName of fileNames) {
      const sourcePath = path.join(coreRoot, directoryName, fileName);
      const destinationPath = path.join(destinationRoot, directoryName, fileName);
      await copyFile(sourcePath, destinationPath);
    }
  }

  const configDir = path.join(destinationRoot, 'config');
  await fs.mkdir(configDir, { recursive: true });
  await fs.writeFile(path.join(configDir, 'settings_schema.json'), `${JSON.stringify(createSettingsSchema(blueprint), null, 2)}\n`);
  await fs.writeFile(path.join(configDir, 'settings_data.json'), `${JSON.stringify(createSettingsData(blueprint), null, 2)}\n`);

  return destinationRoot;
}
