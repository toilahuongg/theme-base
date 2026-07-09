import fs from 'node:fs/promises';
import path from 'node:path';
import { coreRoot, themePath } from './paths.mjs';
import { generateTokenSet, generateDarkTokens } from './color-utils.mjs';

const MANIFEST_PATH = path.join(coreRoot, 'manifest.json');
const MANIFEST_DESTINATIONS = {
  assets: 'assets',
  blocks: 'blocks',
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
  const typography = blueprint.visual.typography;
  const isObj = typeof typography === 'object' && typography !== null;

  return {
    color_background: tokens.background,
    color_surface: tokens.surface,
    color_text: tokens.text,
    color_accent: tokens.accent,
    color_border: tokens.border,
    radius: tokens.radius,
    font_heading: isObj ? typography.headingFont : '',
    font_body: isObj ? typography.bodyFont : '',
    typography: isObj ? `${typography.headingFont} headings, ${typography.bodyFont} body` : typography,
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
        { type: 'text', id: 'font_heading', label: 'Heading Font', default: values.font_heading },
        { type: 'text', id: 'font_body', label: 'Body Font', default: values.font_body },
        { type: 'text', id: 'typography', label: 'Typography', default: values.typography },
        { type: 'text', id: 'imagery', label: 'Imagery', default: values.imagery },
        { type: 'select', id: 'density', label: 'Density', default: values.density, options: [
          { value: 'spacious', label: 'Spacious' },
          { value: 'balanced', label: 'Balanced' },
          { value: 'compact', label: 'Compact' }
        ]},
        { type: 'select', id: 'motion', label: 'Motion', default: values.motion, options: [
          { value: 'expressive', label: 'Expressive' },
          { value: 'standard', label: 'Standard' },
          { value: 'restrained', label: 'Restrained' }
        ]}
      ]
    }
  ];
}

function createSettingsData(blueprint) {
  return {
    current: settingsValues(blueprint)
  };
}

/**
 * Generate theme-specific CSS custom properties from blueprint tokens.
 * Writes a :root override block into the theme's so.css.
 */
function generateThemeCSS(blueprint) {
  const tokens = blueprint.visual.tokens;
  const typography = blueprint.visual.typography;
  const density = blueprint.visual.density;
  const motion = blueprint.visual.motion;
  const isObj = typeof typography === 'object' && typography !== null;

  const fullTokens = generateTokenSet(tokens);
  const darkTokens = generateDarkTokens(fullTokens);

  const densityScale = { spacious: 1.25, balanced: 1.0, compact: 0.8 }[density] || 1.0;
  const motionScale = { expressive: 0.8, standard: 1.0, restrained: 1.25 }[motion] || 1.0;

  const headingFont = isObj ? typography.headingFont : 'Satoshi';
  const bodyFont = isObj ? typography.bodyFont : 'Satoshi';
  const headingWeight = isObj ? (typography.headingWeight || '400') : '700';
  const headingTracking = isObj ? (typography.headingTracking || '-0.025em') : '-0.025em';

  return `/* ==========================================================================
   Theme Tokens — ${blueprint.theme.name}
   Auto-generated from blueprint. Edit settings in Shopify admin to override.
   ========================================================================== */

:root {
  /* Colors */
  --so-color-background: ${fullTokens.background};
  --so-color-surface: ${fullTokens.surface};
  --so-color-surface-hover: ${fullTokens.surfaceHover};
  --so-color-surface-muted: ${fullTokens.surfaceMuted};
  --so-color-surface-strong: ${fullTokens.surfaceStrong};
  --so-color-text: ${fullTokens.text};
  --so-color-text-soft: ${fullTokens.textSoft};
  --so-color-text-faint: ${fullTokens.textFaint};
  --so-color-text-inverse: ${fullTokens.textInverse};
  --so-color-accent: ${fullTokens.accent};
  --so-color-accent-hover: ${fullTokens.accentHover};
  --so-color-accent-soft: ${fullTokens.accentSoft};
  --so-color-accent-glow: ${fullTokens.accentGlow};
  --so-color-border: ${fullTokens.border};
  --so-color-border-strong: ${fullTokens.borderStrong};
  --so-color-focus: ${fullTokens.focus};

  /* Semantic */
  --so-color-success: ${fullTokens.success};
  --so-color-success-soft: ${fullTokens.successSoft};
  --so-color-success-bg: ${fullTokens.successBg};
  --so-color-warning: ${fullTokens.warning};
  --so-color-warning-soft: ${fullTokens.warningSoft};
  --so-color-warning-bg: ${fullTokens.warningBg};
  --so-color-error: ${fullTokens.error};
  --so-color-error-soft: ${fullTokens.errorSoft};
  --so-color-error-bg: ${fullTokens.errorBg};
  --so-color-info: ${fullTokens.info};
  --so-color-info-soft: ${fullTokens.infoSoft};
  --so-color-info-bg: ${fullTokens.infoBg};

  /* Shadows */
  --so-shadow-xs: 0 1px 2px ${fullTokens.shadowColor};
  --so-shadow-sm: 0 18px 40px -30px ${fullTokens.shadowColorMd};
  --so-shadow-md: 0 20px 50px -36px ${fullTokens.shadowColorMd};
  --so-shadow-lg: 0 24px 60px -42px ${fullTokens.shadowColorLg};
  --so-shadow-xl: 0 32px 80px -48px ${fullTokens.shadowColorXl};

  /* Typography */
  --so-font-heading: ${headingFont}, "Avenir Next", Avenir, "Helvetica Neue", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --so-font-body: ${bodyFont}, "Avenir Next", Avenir, "Helvetica Neue", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Radius */
  --so-radius: ${fullTokens.radiusMd};
  --so-radius-small: ${fullTokens.radiusSm};

  /* Density scaling */
  --so-section-gap: clamp(calc(2.75rem * ${densityScale}), calc(5vw * ${densityScale}), calc(5.5rem * ${densityScale}));

  /* Motion scaling */
  --so-transition-fast: calc(100ms * ${motionScale}) cubic-bezier(0.16, 1, 0.3, 1);
  --so-transition-base: calc(180ms * ${motionScale}) cubic-bezier(0.16, 1, 0.3, 1);
  --so-transition-slow: calc(300ms * ${motionScale}) cubic-bezier(0.16, 1, 0.3, 1);
}

/* Dark mode */
.so-dark,
:root.so-dark,
@media (prefers-color-scheme: dark) {
  .so-dark,
  :root.so-dark {
    --so-color-background: ${darkTokens.background};
    --so-color-surface: ${darkTokens.surface};
    --so-color-surface-hover: ${darkTokens.surfaceHover};
    --so-color-surface-muted: ${darkTokens.surfaceMuted};
    --so-color-surface-strong: ${darkTokens.surfaceStrong};
    --so-color-text: ${darkTokens.text};
    --so-color-text-soft: ${darkTokens.textSoft};
    --so-color-text-faint: ${darkTokens.textFaint};
    --so-color-text-inverse: ${darkTokens.textInverse};
    --so-color-accent: ${darkTokens.accent};
    --so-color-accent-hover: ${darkTokens.accentHover};
    --so-color-accent-soft: ${darkTokens.accentSoft};
    --so-color-accent-glow: ${darkTokens.accentGlow};
    --so-color-border: ${darkTokens.border};
    --so-color-border-strong: ${darkTokens.borderStrong};
    --so-color-focus: ${darkTokens.focus};
    --so-color-success: ${darkTokens.success};
    --so-color-success-soft: ${darkTokens.successSoft};
    --so-color-success-bg: ${darkTokens.successBg};
    --so-color-warning: ${darkTokens.warning};
    --so-color-warning-soft: ${darkTokens.warningSoft};
    --so-color-warning-bg: ${darkTokens.warningBg};
    --so-color-error: ${darkTokens.error};
    --so-color-error-soft: ${darkTokens.errorSoft};
    --so-color-error-bg: ${darkTokens.errorBg};
    --so-color-info: ${darkTokens.info};
    --so-color-info-soft: ${darkTokens.infoSoft};
    --so-color-info-bg: ${darkTokens.infoBg};
    --so-shadow-xs: 0 1px 2px ${darkTokens.shadowColor};
    --so-shadow-sm: 0 18px 40px -30px ${darkTokens.shadowColorMd};
    --so-shadow-md: 0 20px 50px -36px ${darkTokens.shadowColorMd};
    --so-shadow-lg: 0 24px 60px -42px ${darkTokens.shadowColorLg};
    --so-shadow-xl: 0 32px 80px -48px ${darkTokens.shadowColorXl};
    --so-drawer-overlay: rgba(0, 0, 0, 0.6);
    --so-modal-overlay: rgba(0, 0, 0, 0.65);
  }
}
`;
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

  // Write theme-specific CSS tokens (overrides the default so-tokens.css)
  const themeCSS = generateThemeCSS(blueprint);
  await fs.writeFile(path.join(destinationRoot, 'assets', 'so-tokens.css'), themeCSS);

  return destinationRoot;
}
