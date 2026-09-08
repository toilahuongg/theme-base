#!/usr/bin/env node
/**
 * validate-schemas.mjs — Shopify Theme Editor schema validator.
 *
 * Part of the theme-editor-architect skill (Shopify Theme Factory).
 *
 * Checks, for a Shopify theme root:
 *
 *   1. config/settings_schema.json parses as JSON; its ids form the GLOBAL
 *      settings scope.
 *   2. config/settings_data.json parses as JSON; its keys are validated as a
 *      SUBSET of the global settings scope (stale keys -> warning). The
 *      Shopify admin writes a /* comment header *​/ into this file and into
 *      templates/*.json, so block comments are stripped before parsing those
 *      two file kinds (section {% schema %} blocks stay strict JSON).
 *   3. Every {% schema %} block in sections/*.liquid and blocks/*.liquid
 *      parses as JSON.
 *   4. Liquid setting references are validated in THREE SCOPES:
 *        - GLOBAL:  bare `settings.<id>` / `settings['<id>']` — must exist in
 *          config/settings_schema.json. Scanned in layout/, sections/,
 *          blocks/ (and section groups' own files).
 *        - SECTION: `section.settings.<id>` — must exist in that section's
 *          {% schema %} settings (not in blocks, not in templates).
 *        - BLOCK:   `block.settings.<id>` — resolved per block-type context:
 *          references inside `{% case block.type %}` / `{% when 'X' %}` regions
 *          are checked against block type X's settings; references outside any
 *          case region are checked against the union of all block types known
 *          to the section (schema blocks + blocks/*.liquid).
 *      Sections with no parseable schema downgrade missing references to
 *      warnings (their settings may be supplied by template JSON).
 *   5. templates/*.json section and block setting keys are validated as a
 *      SUBSET of the referenced section's schema (unknown keys -> error).
 *      Template keys are NEVER treated as schema definitions.
 *   6. Every visible_if conditional references a setting that exists in the
 *      same schema (schema-internal reference check).
 *
 * Usage:
 *   node validate-schemas.mjs [theme-root]
 *   node validate-schemas.mjs [theme-root] --json   # machine-readable output
 *   node validate-schemas.mjs --help
 *
 * Exit codes: 0 = no errors, 1 = errors found. Warnings never change the exit
 * code.
 */

import fs from 'node:fs';
import path from 'node:path';

const HELP = `Usage: node validate-schemas.mjs [theme-root] [--json]

Checks Theme Editor schemas for a Shopify theme:

  - parses config/settings_schema.json and config/settings_data.json
  - parses every {% schema %} block in sections/*.liquid and blocks/*.liquid
  - verifies Liquid setting references in three scopes:
      settings.<id>            -> must exist in config/settings_schema.json
      section.settings.<id>    -> must exist in that section's schema
      block.settings.<id>      -> must exist in the block type's settings
                                   (case block.type regions resolve the type;
                                   elsewhere the union of the section's blocks)
  - verifies templates/*.json setting keys are a subset of the referenced
    section's schema (unknown keys are errors, never treated as definitions)
  - verifies every visible_if conditional references an existing setting

Sections without a parseable {% schema %} produce warnings, not errors.

Options:
  --json    emit a single JSON object instead of human-readable output
  --help    show this help

Exit codes: 0 = clean, 1 = errors found. Warnings do not fail the run.`;

const args = process.argv.slice(2);
if (args.includes('--help')) {
  process.stdout.write(HELP + '\n');
  process.exit(0);
}
const jsonOutput = args.includes('--json');
const positional = args.filter((a) => !a.startsWith('--'));
const themeRoot = path.resolve(positional[0] || process.cwd());

const report = {
  root: themeRoot,
  files: [],
  errors: [],
  warnings: [],
  summary: { sectionFiles: 0, schemaBlocks: 0, settingReferencesChecked: 0, errors: 0, warnings: 0 },
};

function error(message) {
  report.errors.push(message);
  report.summary.errors += 1;
}
function warn(message) {
  report.warnings.push(message);
  report.summary.warnings += 1;
}
function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}
/** Strip Shopify-generated /* ... *​/ comment headers (settings_data.json, templates). */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '');
}
/** Replace a range with spaces but keep newlines, so line numbers survive. */
function mask(text, start, end) {
  let out = text.slice(0, start);
  for (let i = start; i < end; i += 1) out += text[i] === '\n' ? '\n' : ' ';
  return out + text.slice(end);
}
function readJson(file, { strip = false } = {}) {
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(strip ? stripComments(raw) : raw);
}
/** Collect setting ids from an array of schema settings. */
function collectSettingIds(settings, out) {
  if (!Array.isArray(settings)) return;
  for (const s of settings) {
    if (s && typeof s.id === 'string') out.add(s.id);
  }
}
/** Parse a schema JSON object into { settings: Set, blocks: Map<type, Set> }. */
function parseSchemaObject(schema) {
  const parsed = { settings: new Set(), blocks: new Map() };
  collectSettingIds(schema && schema.settings, parsed.settings);
  if (schema && Array.isArray(schema.blocks)) {
    for (const b of schema.blocks) {
      if (!b || typeof b.type !== 'string') continue;
      if (!parsed.blocks.has(b.type)) parsed.blocks.set(b.type, new Set());
      collectSettingIds(b.settings, parsed.blocks.get(b.type));
    }
  }
  return parsed;
}
/** Extract {% schema %} blocks from a .liquid file: [{ index, block, startLine }]. */
function extractSchemaBlocks(raw) {
  const blocks = [];
  const re = /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    blocks.push({ index: m.index, block: m[1], startLine: lineAt(raw, m.index) });
  }
  return blocks;
}
/**
 * Find `{% case block.type %}` regions. Returns
 * [{ types: [string], start, end, text }] where each region is the text of a
 * `{% when 'a' or 'b' %}` branch. Nested cases are skipped (their spans are
 * consumed so the outer branch text does not include them).
 */
function extractBlockTypeRegions(liquid) {
  const tagRe = /\{%\s*([\s\S]*?)\s*%\}/g;
  const tags = [];
  let m;
  while ((m = tagRe.exec(liquid)) !== null) {
    const body = m[1].trim();
    tags.push({ index: m.index, end: m.index + m[0].length, body });
  }
  const regions = [];
  for (let i = 0; i < tags.length; i += 1) {
    const t = tags[i];
    if (!/^case\s+block\s*\.\s*type\b/.test(t.body)) continue;
    // Walk forward; depth tracks nested {% case %} blocks.
    let depth = 0;
    let regionStart = -1;
    let regionTypes = [];
    for (let j = i + 1; j < tags.length; j += 1) {
      const s = tags[j];
      if (/^case\b/.test(s.body)) {
        depth += 1;
        continue;
      }
      if (/^endcase\b/.test(s.body)) {
        if (depth > 0) {
          depth -= 1;
          continue;
        }
        // Close the currently open branch, if any.
        if (regionStart >= 0) {
          regions.push({ types: regionTypes, start: regionStart, end: s.index, text: liquid.slice(regionStart, s.index) });
        }
        break;
      }
      if (/^when\b/.test(s.body)) {
        // Close previous branch.
        if (regionStart >= 0) {
          regions.push({ types: regionTypes, start: regionStart, end: s.index, text: liquid.slice(regionStart, s.index) });
        }
        const typeRe = /['"]([^'"]+)['"]/g;
        const types = [];
        let tm;
        while ((tm = typeRe.exec(s.body)) !== null) types.push(tm[1]);
        regionStart = s.end;
        regionTypes = types;
        continue;
      }
    }
  }
  return regions;
}

if (!fs.existsSync(themeRoot) || !fs.statSync(themeRoot).isDirectory()) {
  error(`theme root not found: ${themeRoot}`);
  finish();
}

// ---------------------------------------------------------------------------
// 0. GLOBAL SCOPE: config/settings_schema.json
// ---------------------------------------------------------------------------
const configDir = path.join(themeRoot, 'config');
const schemaFile = path.join(configDir, 'settings_schema.json');
const dataFile = path.join(configDir, 'settings_data.json');

const globalIds = new Set();
if (fs.existsSync(schemaFile)) {
  try {
    const schema = readJson(schemaFile);
    // settings_schema.json is an array of groups ({ name, settings: [...] })
    // possibly with flat sidebar entries; ids may be nested one level.
    const flat = [];
    if (Array.isArray(schema)) {
      for (const item of schema) {
        if (item && Array.isArray(item.settings)) flat.push(...item.settings);
        else if (item) flat.push(item);
      }
    } else if (schema && Array.isArray(schema.settings)) {
      flat.push(...schema.settings);
    }
    collectSettingIds(flat, globalIds);
    report.files.push({ file: 'config/settings_schema.json', status: 'ok', detail: `JSON parses (${globalIds.size} global setting(s))` });
  } catch (e) {
    error(`config/settings_schema.json: JSON parse failed: ${e.message}`);
    report.files.push({ file: 'config/settings_schema.json', status: 'error', detail: e.message });
  }
} else {
  error('config/settings_schema.json: missing file');
}

// settings_data.json: parse + keys must be a subset of the global scope.
if (fs.existsSync(dataFile)) {
  try {
    const data = readJson(dataFile, { strip: true });
    const sections = {};
    if (data && typeof data === 'object') {
      if (data.current && typeof data.current === 'object') sections.current = [data.current];
      if (data.presets && typeof data.presets === 'object') {
        sections.presets = Object.values(data.presets).filter((v) => v && typeof v === 'object');
      }
    }
    for (const [group, groups] of Object.entries(sections)) {
      for (const values of groups) {
        for (const key of Object.keys(values)) {
          if (globalIds.size > 0 && !globalIds.has(key)) {
            warn(`config/settings_data.json (${group}): key '${key}' is not defined in config/settings_schema.json (stale key)`);
          }
        }
      }
    }
    report.files.push({ file: 'config/settings_data.json', status: 'ok', detail: 'JSON parses' });
  } catch (e) {
    error(`config/settings_data.json: JSON parse failed: ${e.message}`);
    report.files.push({ file: 'config/settings_data.json', status: 'error', detail: e.message });
  }
}

// ---------------------------------------------------------------------------
// 1. Schema registry: section groups (sections/*.json) + theme blocks (blocks/*.liquid)
// ---------------------------------------------------------------------------
const sectionsDir = path.join(themeRoot, 'sections');
const blocksDir = path.join(themeRoot, 'blocks');
const layoutDir = path.join(themeRoot, 'layout');
const templatesDir = path.join(themeRoot, 'templates');

/** section-group type -> { settings: Set, blocks: Map<type, Set> } */
const groupSchemas = new Map();
/** block type -> { settings: Set, file } from blocks/*.liquid */
const blockFileSchemas = new Map();
/** blocks/*.liquid entry records for the report */
const blockFileEntries = [];

if (fs.existsSync(sectionsDir)) {
  for (const f of fs.readdirSync(sectionsDir).filter((x) => x.endsWith('.json')).sort()) {
    const rel = path.join('sections', f);
    try {
      const group = readJson(path.join(sectionsDir, f));
      if (group && typeof group.type === 'string') {
        groupSchemas.set(group.type, parseSchemaObject(group));
        report.files.push({ file: rel, status: 'ok', detail: `section group '${group.type}'` });
      }
    } catch (e) {
      error(`${rel}: JSON parse failed: ${e.message}`);
      report.files.push({ file: rel, status: 'error', detail: e.message });
    }
  }
}

if (fs.existsSync(blocksDir)) {
  for (const f of fs.readdirSync(blocksDir).filter((x) => x.endsWith('.liquid')).sort()) {
    const rel = path.join('blocks', f);
    const raw = fs.readFileSync(path.join(blocksDir, f), 'utf8');
    const entry = { file: rel, status: 'ok', schemas: 0, settings: 0, blockSettings: 0, missing: [] };
    const schemaBlocks = extractSchemaBlocks(raw);
    let liquid = raw;
    for (const sb of schemaBlocks) {
      entry.schemas += 1;
      report.summary.schemaBlocks += 1;
      let schema;
      try {
        schema = JSON.parse(sb.block);
      } catch (e) {
        error(`${rel}: schema block (line ${sb.startLine}) JSON parse failed: ${e.message}`);
        entry.status = 'error';
        continue;
      }
      const parsed = parseSchemaObject(schema);
      const type = schema && schema.type;
      if (typeof type === 'string') {
        blockFileSchemas.set(type, { settings: parsed.settings, file: rel });
        entry.blockSettings += parsed.settings.size;
      }
      liquid = mask(liquid, sb.index, sb.index + sb.block.length + '{% schema %}'.length + '{% endschema %}'.length);
    }
    // Scoped Liquid scan for this block file.
    const blockIds = new Set();
    for (const [, meta] of blockFileSchemas) for (const id of meta.settings) blockIds.add(id);
    const missing = new Map();
    const scanBlock = (re) => {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(liquid)) !== null) {
        report.summary.settingReferencesChecked += 1;
        if (blockIds.has(m[1])) continue;
        const info = missing.get(m[1]) || { line: lineAt(liquid, m.index), count: 0 };
        info.count += 1;
        missing.set(m[1], info);
      }
    };
    scanBlock(/\bblock\.settings\.([A-Za-z_][A-Za-z0-9_]*)/g);
    scanBlock(/\bblock\.settings\[\s*['"]([^'"]+)['"]\s*\]/g);
    // bare settings.<id> = global scope
    const missingGlobal = new Map();
    const scanGlobal = (re) => {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(liquid)) !== null) {
        report.summary.settingReferencesChecked += 1;
        if (globalIds.has(m[1])) continue;
        const info = missingGlobal.get(m[1]) || { line: lineAt(liquid, m.index), count: 0 };
        info.count += 1;
        missingGlobal.set(m[1], info);
      }
    };
    scanGlobal(/(?<![\w.])settings\.([A-Za-z_][A-Za-z0-9_]*)/g);
    scanGlobal(/(?<![\w.])settings\[\s*['"]([^'"]+)['"]\s*\]/g);
    for (const [id, info] of missing) {
      const msg = `${rel}: line ${info.line}: block.settings '${id}' referenced but not defined in this block's schema (${info.count} occurrence${info.count > 1 ? 's' : ''})`;
      if (entry.schemas > 0) {
        error(msg);
        entry.status = 'error';
      } else {
        warn(`${msg} — no parseable {% schema %} block; reference cannot be verified`);
        entry.status = 'warn';
      }
      entry.missing.push({ id, line: info.line, count: info.count });
    }
    for (const [id, info] of missingGlobal) {
      error(`${rel}: line ${info.line}: settings '${id}' referenced but not defined in config/settings_schema.json (${info.count} occurrence${info.count > 1 ? 's' : ''})`);
      entry.status = 'error';
      entry.missing.push({ id, line: info.line, count: info.count });
    }
    if (entry.schemas === 0) {
      warn(`${rel}: no {% schema %} block found in block file`);
      entry.status = 'warn';
    }
    report.files.push(entry);
    blockFileEntries.push(entry);
  }
}

// ---------------------------------------------------------------------------
// 2. Section schemas (sections/*.liquid)
// ---------------------------------------------------------------------------
if (!fs.existsSync(sectionsDir)) {
  error('sections/ directory not found; nothing to validate');
  finish();
}

const sectionFiles = fs
  .readdirSync(sectionsDir)
  .filter((f) => f.endsWith('.liquid'))
  .sort();
report.summary.sectionFiles = sectionFiles.length;

/** lookup key -> { settings: Set, blocks: Map<type, Set>, parsed: bool, file } */
const sectionSchemas = new Map();

for (const file of sectionFiles) {
  const rel = path.join('sections', file);
  const abs = path.join(sectionsDir, file);
  const raw = fs.readFileSync(abs, 'utf8');
  const entry = { file: rel, status: 'ok', schemas: 0, parsedSchemas: 0, settings: 0, blockSettings: 0, missing: [], templateKeys: 0 };

  const schemaBlocks = extractSchemaBlocks(raw);
  const parsed = { settings: new Set(), blocks: new Map(), parsed: false };
  const schemaIds = [];
  let blockIndex = 0;

  for (const sb of schemaBlocks) {
    blockIndex += 1;
    entry.schemas += 1;
    report.summary.schemaBlocks += 1;
    let schema;
    try {
      schema = JSON.parse(sb.block);
    } catch (e) {
      error(`${rel}: schema block ${blockIndex} (line ${sb.startLine}) JSON parse failed: ${e.message}`);
      entry.status = 'error';
      continue;
    }
    entry.parsedSchemas += 1;
    parsed.parsed = true;
    if (typeof schema.id === 'string') schemaIds.push(schema.id);
    const one = parseSchemaObject(schema);
    for (const id of one.settings) parsed.settings.add(id);
    for (const [type, ids] of one.blocks) {
      if (!parsed.blocks.has(type)) parsed.blocks.set(type, new Set());
      for (const id of ids) parsed.blocks.get(type).add(id);
    }
  }

  entry.settings = parsed.settings.size;
  entry.blockSettings = Array.from(parsed.blocks.values()).reduce((n, s) => n + s.size, 0);
  const lookupKeys = [path.basename(file, '.liquid'), ...schemaIds];
  for (const key of lookupKeys) sectionSchemas.set(key, { ...parsed, file: rel });

  // visible_if validation (schema-internal, two-pass: collect then check).
  for (const sb of schemaBlocks) {
    let schema;
    try {
      schema = JSON.parse(sb.block);
    } catch (e) {
      continue; // already reported above
    }
    const one = parseSchemaObject(schema);
    const condRe = /\bsettings\.([A-Za-z_][A-Za-z0-9_]*)/g;
    const checkCond = (settingList, scopeIds) => {
      if (!Array.isArray(settingList)) return;
      for (const s of settingList) {
        if (!s || typeof s.visible_if !== 'string') continue;
        condRe.lastIndex = 0;
        let m;
        while ((m = condRe.exec(s.visible_if)) !== null) {
          if (scopeIds.has(m[1])) continue;
          const owner = s.id ? `'${s.id}'` : s.type ? `(${s.type})` : '(unnamed)';
          error(`${rel}: visible_if on setting ${owner} references 'settings.${m[1]}' which is not defined in the same schema`);
          entry.status = 'error';
        }
      }
    };
    checkCond(schema && schema.settings, one.settings);
    if (schema && Array.isArray(schema.blocks)) {
      for (const b of schema.blocks) {
        if (!b) continue;
        const typeIds = one.blocks.get(b.type) || new Set();
        checkCond(b.settings, typeIds);
      }
    }
  }

  report.files.push(entry);
}

// ---------------------------------------------------------------------------
// 3. Liquid scope scans for sections/*.liquid
// ---------------------------------------------------------------------------
for (const file of sectionFiles) {
  const rel = path.join('sections', file);
  const abs = path.join(sectionsDir, file);
  const raw = fs.readFileSync(abs, 'utf8');
  const entry = report.files.find((f) => f.file === rel);
  const schemaBlocks = extractSchemaBlocks(raw);

  let liquid = raw;
  for (const sb of schemaBlocks) {
    liquid = mask(liquid, sb.index, sb.index + sb.block.length + '{% schema %}'.length + '{% endschema %}'.length);
  }
  // Mask comment and raw bodies so their text is not scanned as Liquid.
  const MASK_RE = /\{%\s*(?:comment|raw)\s*%\}[\s\S]*?\{%\s*end(?:comment|raw)\s*%\}/g;
  MASK_RE.lastIndex = 0;
  let m;
  while ((m = MASK_RE.exec(liquid)) !== null) {
    liquid = mask(liquid, m.index, m.index + m[0].length);
  }

  const parsed = sectionSchemas.get(path.basename(file, '.liquid')) || sectionSchemas.get(file);
  const sectionIds = parsed ? parsed.settings : new Set();
  const hasParsedSchema = parsed ? parsed.parsed : false;

  // BLOCK scope: case block.type regions resolve the block type.
  const knownBlockIds = new Set();
  if (parsed) {
    for (const ids of parsed.blocks.values()) for (const id of ids) knownBlockIds.add(id);
  }
  for (const [, meta] of blockFileSchemas) for (const id of meta.settings) knownBlockIds.add(id);

  const missing = new Map(); // id -> { line, count, scope }
  const scan = (re, scope, allow) => {
    re.lastIndex = 0;
    let mm;
    while ((mm = re.exec(liquid)) !== null) {
      report.summary.settingReferencesChecked += 1;
      if (allow(mm[1])) continue;
      const info = missing.get(mm[1]) || { line: lineAt(liquid, mm.index), count: 0, scope };
      info.count += 1;
      missing.set(mm[1], info);
    }
  };

  // GLOBAL scope: bare settings.<id> (not section.settings / block.settings)
  scan(/(?<![\w.])settings\.([A-Za-z_][A-Za-z0-9_]*)/g, 'global', (id) => globalIds.has(id));
  scan(/(?<![\w.])settings\[\s*['"]([^'"]+)['"]\s*\]/g, 'global', (id) => globalIds.has(id));
  // SECTION scope: section.settings.<id>
  scan(/\bsection\.settings\.([A-Za-z_][A-Za-z0-9_]*)/g, 'section', (id) => sectionIds.has(id));
  scan(/\bsection\.settings\[\s*['"]([^'"]+)['"]\s*\]/g, 'section', (id) => sectionIds.has(id));
  // BLOCK scope outside case regions: union of the section's block types.
  scan(/\bblock\.settings\.([A-Za-z_][A-Za-z0-9_]*)/g, 'block', (id) => knownBlockIds.has(id));
  scan(/\bblock\.settings\[\s*['"]([^'"]+)['"]\s*\]/g, 'block', (id) => knownBlockIds.has(id));

  // BLOCK scope inside case block.type regions: strict per-type check.
  const regions = extractBlockTypeRegions(liquid);
  for (const region of regions) {
    if (region.types.length === 0) continue;
    const allowed = new Set();
    for (const t of region.types) {
      if (parsed && parsed.blocks.has(t)) for (const id of parsed.blocks.get(t)) allowed.add(id);
      if (blockFileSchemas.has(t)) for (const id of blockFileSchemas.get(t).settings) allowed.add(id);
    }
    const reDot = /\bblock\.settings\.([A-Za-z_][A-Za-z0-9_]*)/g;
    const reBracket = /\bblock\.settings\[\s*['"]([^'"]+)['"]\s*\]/g;
    for (const re of [reDot, reBracket]) {
      re.lastIndex = 0;
      let mm;
      while ((mm = re.exec(region.text)) !== null) {
        report.summary.settingReferencesChecked += 1;
        if (allowed.has(mm[1])) continue;
        const info = missing.get(mm[1]) || { line: lineAt(region.text, mm.index), count: 0, scope: `block (when ${region.types.join(' | ')})` };
        info.count += 1;
        missing.set(mm[1], info);
      }
    }
  }

  for (const [id, info] of missing) {
    const msg = `${rel}: line ${info.line}: ${info.scope} setting '${id}' referenced in Liquid but not defined (${info.count} occurrence${info.count > 1 ? 's' : ''})`;
    // GLOBAL scope is verifiable without a section schema; only section/block
    // scope depends on the {% schema %} block.
    const needsSchema = info.scope !== 'global';
    if (hasParsedSchema || !needsSchema) {
      error(msg);
      entry.status = 'error';
    } else {
      warn(`${msg} — no parseable {% schema %} block; reference cannot be verified`);
      entry.status = 'warn';
    }
    entry.missing.push({ id, line: info.line, count: info.count, scope: info.scope });
  }

  // id: '<literal>' hash keys inside Liquid tags — warning level.
  const TAG_RE = /\{%[\s\S]*?%\}/g;
  const HASH_ID_RE = /\bid\s*:\s*['"]([^'"]+)['"]/g;
  const hashWarnings = new Set();
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(liquid)) !== null) {
    HASH_ID_RE.lastIndex = 0;
    let hm;
    while ((hm = HASH_ID_RE.exec(m[0])) !== null) {
      if (knownBlockIds.has(hm[1]) || sectionIds.has(hm[1]) || globalIds.has(hm[1])) continue;
      if (hashWarnings.has(hm[1])) continue;
      hashWarnings.add(hm[1]);
      const ln = lineAt(liquid, m.index + hm.index);
      warn(`${rel}: line ${ln}: id: '${hm[1]}' is not a schema setting id — verify it is a render/hash key, not a setting reference`);
    }
  }

  if (entry.schemas === 0) {
    warn(`${rel}: no {% schema %} block found in section file`);
    entry.status = 'warn';
  }
}

// ---------------------------------------------------------------------------
// 4. templates/*.json: setting keys must be a SUBSET of the referenced schema
// ---------------------------------------------------------------------------
if (fs.existsSync(templatesDir)) {
  for (const f of fs.readdirSync(templatesDir).filter((x) => x.endsWith('.json')).sort()) {
    const rel = path.join('templates', f);
    let tpl;
    try {
      tpl = readJson(path.join(templatesDir, f), { strip: true });
    } catch (e) {
      warn(`${rel}: JSON parse failed (after stripping comments): ${e.message}`);
      continue;
    }
    const sections = tpl && tpl.sections;
    if (!sections || typeof sections !== 'object') continue;
    for (const [instance, cfg] of Object.entries(sections)) {
      if (!cfg || typeof cfg.type !== 'string') continue;
      const type = cfg.type;
      const schema = sectionSchemas.get(type) || groupSchemas.get(type);
      if (!schema) {
        warn(`${rel}: section '${instance}' (type '${type}') has no parseable schema — template settings/block settings cannot be verified`);
        continue;
      }
      if (cfg.settings && typeof cfg.settings === 'object') {
        for (const key of Object.keys(cfg.settings)) {
          if (schema.settings.has(key)) continue;
          if (schema.parsed === false) {
            warn(`${rel}: section '${instance}' sets '${key}' but the section has no parseable schema — cannot verify`);
            continue;
          }
          error(`${rel}: section '${instance}' (type '${type}') sets '${key}' which is not defined in the section schema`);
          report.files.push({ file: rel, status: 'error', detail: `section '${instance}': unknown setting '${key}'` });
        }
      }
      if (cfg.blocks && Array.isArray(cfg.blocks)) {
        for (const b of cfg.blocks) {
          if (!b || typeof b.type !== 'string') continue;
          const typeIds = schema.blocks.get(b.type);
          if (!typeIds && schema.parsed !== false) {
            error(`${rel}: section '${instance}' (type '${type}') uses block type '${b.type}' which is not declared in the section schema`);
            report.files.push({ file: rel, status: 'error', detail: `section '${instance}': unknown block type '${b.type}'` });
            continue;
          }
          if (!b.settings || typeof b.settings !== 'object') continue;
          for (const key of Object.keys(b.settings)) {
            if (typeIds && typeIds.has(key)) continue;
            if (schema.parsed === false) {
              warn(`${rel}: section '${instance}' block '${b.type}' sets '${key}' but the section has no parseable schema — cannot verify`);
              continue;
            }
            error(`${rel}: section '${instance}' (type '${type}') block '${b.type}' sets '${key}' which is not defined in that block's settings`);
            report.files.push({ file: rel, status: 'error', detail: `section '${instance}' block '${b.type}': unknown setting '${key}'` });
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 5. layout/*.liquid — GLOBAL scope only
// ---------------------------------------------------------------------------
if (fs.existsSync(layoutDir)) {
  for (const f of fs.readdirSync(layoutDir).filter((x) => x.endsWith('.liquid')).sort()) {
    const rel = path.join('layout', f);
    const raw = fs.readFileSync(path.join(layoutDir, f), 'utf8');
    let liquid = raw;
    const MASK_RE = /\{%\s*(?:comment|raw)\s*%\}[\s\S]*?\{%\s*end(?:comment|raw)\s*%\}/g;
    MASK_RE.lastIndex = 0;
    let m;
    while ((m = MASK_RE.exec(liquid)) !== null) {
      liquid = mask(liquid, m.index, m.index + m[0].length);
    }
    const missing = new Map();
    const scan = (re) => {
      re.lastIndex = 0;
      let mm;
      while ((mm = re.exec(liquid)) !== null) {
        report.summary.settingReferencesChecked += 1;
        if (globalIds.has(mm[1])) continue;
        const info = missing.get(mm[1]) || { line: lineAt(liquid, mm.index), count: 0 };
        info.count += 1;
        missing.set(mm[1], info);
      }
    };
    scan(/(?<![\w.])settings\.([A-Za-z_][A-Za-z0-9_]*)/g);
    scan(/(?<![\w.])settings\[\s*['"]([^'"]+)['"]\s*\]/g);
    const entry = { file: rel, status: 'ok', missing: [] };
    for (const [id, info] of missing) {
      error(`${rel}: line ${info.line}: global settings '${id}' referenced but not defined in config/settings_schema.json (${info.count} occurrence${info.count > 1 ? 's' : ''})`);
      entry.status = 'error';
      entry.missing.push({ id, line: info.line, count: info.count });
    }
    report.files.push(entry);
  }
}

finish();

function finish() {
  if (jsonOutput) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    process.stdout.write(`theme-editor-architect validate-schemas\n`);
    process.stdout.write(`theme root: ${report.root}\n`);
    for (const f of report.files) {
      const status = f.status === 'error' ? 'ERROR' : f.status === 'warn' ? 'WARN' : 'OK';
      let line = `[${status}] ${f.file}`;
      if (f.detail) line += `: ${f.detail}`;
      if (f.schemas > 0) {
        line += ` (${f.schemas} schema block${f.schemas > 1 ? 's' : ''}, ${f.settings} settings, ${f.blockSettings} block settings`;
        if (f.templateKeys > 0) line += `, ${f.templateKeys} from templates`;
        line += ')';
      }
      if (f.missing && f.missing.length > 0) line += ` — missing: ${f.missing.map((m) => `'${m.id}' (line ${m.line})`).join(', ')}`;
      process.stdout.write(line + '\n');
    }
    for (const e of report.errors) process.stdout.write(`[ERROR] ${e}\n`);
    for (const w of report.warnings) process.stdout.write(`[WARN] ${w}\n`);
    process.stdout.write(
      `summary: ${report.summary.sectionFiles} section file(s), ${report.summary.schemaBlocks} schema block(s), ` +
        `${report.summary.settingReferencesChecked} setting reference(s) checked, ` +
        `${report.summary.errors} error(s), ${report.summary.warnings} warning(s)\n`
    );
  }
  process.exitCode = report.summary.errors > 0 ? 1 : 0;
}
