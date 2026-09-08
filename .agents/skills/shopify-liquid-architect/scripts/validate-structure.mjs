#!/usr/bin/env node
/**
 * validate-structure.mjs — Shopify Online Store 2.0 structure validator.
 *
 * Usage:
 *   node validate-structure.mjs [theme-root] [--json]
 *
 * - theme-root defaults to the current working directory.
 * - --json prints a machine-readable report instead of the human table.
 *
 * Exit codes:
 *   0  all required items present
 *   1  one or more required items missing (or the root is not a directory)
 *
 * Required (errors if missing):
 *   layout/theme.liquid, templates/index.json, config/settings_schema.json,
 *   sections/ present and non-empty, locales/ containing a default locale
 *   file (en.default.json), .theme-check.yml at the root.
 *
 * Warning-only (informational):
 *   config/settings_data.json, locales/en.default.schema.json,
 *   templates/ containing at least one .json template, assets/ present,
 *   a section named by templates/*.json missing from sections/.
 *
 * This script checks physical structure only. Current platform rules that
 * change over time (template/section limits, Theme Store thresholds) are
 * intentionally NOT hardcoded here — verify those on shopify.dev per the
 * skill contract.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REQUIRED = [
  {
    id: 'layout/theme.liquid',
    check: (root) => existsSync(join(root, 'layout', 'theme.liquid')),
    hint: 'Global layout required by every OS 2.0 theme; contains content_for_header, content_for_layout, and section groups.',
  },
  {
    id: 'templates/index.json',
    check: (root) => existsSync(join(root, 'templates', 'index.json')),
    hint: 'Home page JSON template is the OS 2.0 entry point.',
  },
  {
    id: 'config/settings_schema.json',
    check: (root) => existsSync(join(root, 'config', 'settings_schema.json')),
    hint: 'Global theme settings schema shown under Theme settings.',
  },
  {
    id: 'sections/',
    check: (root) => {
      const dir = join(root, 'sections');
      if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
      return readdirSync(dir).length > 0;
    },
    hint: 'sections/ must exist and contain at least one .liquid (or -group.json) file.',
  },
  {
    id: 'locales/en.default.json',
    check: (root) => {
      const dir = join(root, 'locales');
      if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
      return readdirSync(dir).some((f) => f.endsWith('.default.json'));
    },
    hint: 'locales/ must contain a default locale (en.default.json) for storefront strings.',
  },
  {
    id: '.theme-check.yml',
    check: (root) => existsSync(join(root, '.theme-check.yml')),
    hint: 'Theme Check configuration at the theme root (used by shopify theme check).',
  },
];

const WARNINGS = [
  {
    id: 'config/settings_data.json',
    check: (root) => existsSync(join(root, 'config', 'settings_data.json')),
    hint: 'Current settings values; uploaded themes normally ship a defaults file.',
  },
  {
    id: 'locales/en.default.schema.json',
    check: (root) => {
      const dir = join(root, 'locales');
      if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
      return readdirSync(dir).some((f) => f.endsWith('.default.schema.json'));
    },
    hint: 'Editor schema labels locale; recommended for translated editor labels.',
  },
  {
    id: 'templates/*.json',
    check: (root) => {
      const dir = join(root, 'templates');
      if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
      return readdirSync(dir).some((f) => f.endsWith('.json'));
    },
    hint: 'At least one JSON template beyond index.json is expected for a complete store.',
  },
  {
    id: 'assets/',
    check: (root) => existsSync(join(root, 'assets')) && statSync(join(root, 'assets')).isDirectory(),
    hint: 'Static assets directory (css/js/images/fonts).',
  },
];

function listJsonTemplates(root) {
  const dir = join(root, 'templates');
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
}

function checkTemplateSectionRefs(root) {
  const missing = [];
  const sectionsDir = join(root, 'sections');
  const sectionTypes = new Set();
  if (existsSync(sectionsDir) && statSync(sectionsDir).isDirectory()) {
    for (const f of readdirSync(sectionsDir)) {
      const base = f.replace(/\.(liquid|json)$/, '');
      sectionTypes.add(base);
    }
  }
  for (const file of listJsonTemplates(root)) {
    const abs = join(root, 'templates', file);
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(abs, 'utf8'));
    } catch {
      continue; // malformed JSON is out of scope for structure; json check flags it
    }
    for (const [id, instance] of Object.entries(parsed.sections || {})) {
      if (!instance || typeof instance !== 'object' || typeof instance.type !== 'string') continue;
      if (!sectionTypes.has(instance.type)) {
        missing.push(`${file} -> section id "${id}" references missing section type "${instance.type}"`);
      }
    }
  }
  return missing;
}

function main() {
  const args = process.argv.slice(2);
  const jsonFlag = args.includes('--json');
  const rootArg = args.find((a) => a !== '--json') || process.cwd();
  const root = resolve(rootArg);

  if (!existsSync(root) || !statSync(root).isDirectory()) {
    const report = { root, requiredMissing: [root], warnings: [], templateSectionRefsMissing: [], ok: false };
    if (jsonFlag) {
      process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    } else {
      process.stdout.write(`ERROR: not a directory: ${root}\n`);
    }
    process.exit(1);
  }

  const requiredMissing = REQUIRED.filter((r) => !r.check(root)).map((r) => r.id);
  const warnings = WARNINGS.filter((w) => !w.check(root)).map((w) => w.id);
  const refsMissing = checkTemplateSectionRefs(root);

  if (jsonFlag) {
    const report = {
      root,
      ok: requiredMissing.length === 0,
      requiredPresent: REQUIRED.filter((r) => r.check(root)).map((r) => r.id),
      requiredMissing,
      warnings,
      templateSectionRefsMissing: refsMissing,
    };
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    process.stdout.write(`Theme root: ${root}\n\n`);
    process.stdout.write('Required OS 2.0 structure:\n');
    let ok = true;
    for (const r of REQUIRED) {
      const present = r.check(root);
      if (!present) ok = false;
      process.stdout.write(`  [${present ? 'OK' : 'MISSING'}] ${r.id}\n`);
      if (!present) process.stdout.write(`        hint: ${r.hint}\n`);
    }
    process.stdout.write('\nInformational checks:\n');
    for (const w of WARNINGS) {
      const present = w.check(root);
      process.stdout.write(`  [${present ? 'OK' : 'WARN'}] ${w.id}\n`);
    }
    if (refsMissing.length) {
      process.stdout.write('\nTemplate section references:\n');
      for (const m of refsMissing) process.stdout.write(`  [MISSING] ${m}\n`);
    }
    process.stdout.write(`\nResult: ${ok ? 'PASS - required structure present' : 'FAIL - required items missing'}\n`);
  }

  process.exit(requiredMissing.length > 0 ? 1 : 0);
}

main();
