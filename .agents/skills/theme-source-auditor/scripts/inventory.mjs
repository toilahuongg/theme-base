#!/usr/bin/env node
/**
 * theme-source-auditor: provenance inventory script.
 *
 * Walks the seven standard Shopify theme directories (layout, templates,
 * sections, snippets, assets, config, locales), reports file counts and
 * sizes, and greps every text file for a configurable list of provenance
 * marker strings. Output is a single JSON document on stdout.
 *
 * Usage:
 *   node inventory.mjs [theme-root] [--markers=a,b,c] [--help]
 *
 * - theme-root defaults to the current working directory.
 * - --markers overrides the default marker list (comma-separated).
 * - INVENTORY_MARKERS environment variable also overrides the list.
 * - The special marker "MIT license text" is matched with a regex for the
 *   MIT license preamble instead of a plain substring.
 *
 * Exit code: 0 on success (including "no matches found"), 1 on invalid
 * arguments or an unreachable theme root. Errors are reported as JSON on
 * stdout; the script never throws an uncaught exception.
 */

import fs from 'node:fs';
import path from 'node:path';

const THEME_DIRS = [
  'layout',
  'templates',
  'sections',
  'snippets',
  'assets',
  'config',
  'locales',
];

const DEFAULT_MARKERS = [
  'Dawn',
  'Horizon',
  'Skeleton',
  'Shopify Theme Store',
  'MIT license text',
];

// Regexes for markers that are matched as patterns rather than substrings.
const PATTERN_MARKERS = new Map([
  ['MIT license text', /Permission is hereby granted, free of charge|MIT License|Released under the MIT/i],
]);

const MAX_TEXT_BYTES = 5 * 1024 * 1024; // skip marker scan for files larger than 5 MB
const BINARY_SNIFF_BYTES = 8192;

function parseArgs(argv) {
  const args = { root: process.cwd(), markers: null, help: false };
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg.startsWith('--markers=')) {
      args.markers = arg.slice('--markers='.length).split(',').map((s) => s.trim()).filter(Boolean);
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      args.root = arg;
    }
  }
  return args;
}

function isLikelyBinary(filePath) {
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(BINARY_SNIFF_BYTES);
    const bytesRead = fs.readSync(fd, buf, 0, buf.length, 0);
    return buf.subarray(0, bytesRead).includes(0);
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function countMatches(content, marker) {
  const pattern = PATTERN_MARKERS.get(marker);
  if (pattern) {
    return (content.match(pattern) || []).length;
  }
  let count = 0;
  let from = 0;
  for (;;) {
    const at = content.indexOf(marker, from);
    if (at === -1) break;
    count += 1;
    from = at + marker.length;
  }
  return count;
}

function walkDir(root, dirName, state) {
  const dirAbs = path.join(root, dirName);
  const entry = { files: 0, bytes: 0, largest: null };
  if (!fs.existsSync(dirAbs)) {
    entry.missing = true;
    state.dirs[dirName] = entry;
    return;
  }
  if (!fs.statSync(dirAbs).isDirectory()) {
    entry.notDirectory = true;
    state.dirs[dirName] = entry;
    return;
  }

  const stack = [dirAbs];
  while (stack.length > 0) {
    const current = stack.pop();
    let names;
    try {
      names = fs.readdirSync(current, { withFileTypes: true });
    } catch (err) {
      state.errors.push(`cannot read directory ${current}: ${err.message}`);
      continue;
    }
    for (const dirent of names) {
      if (dirent.name === '.DS_Store' || dirent.name === '__MACOSX' || dirent.name.startsWith('.')) {
        continue;
      }
      const abs = path.join(current, dirent.name);
      const rel = path.relative(root, abs).split(path.sep).join('/');
      if (dirent.isDirectory()) {
        stack.push(abs);
        continue;
      }
      if (!dirent.isFile()) {
        continue; // skip symlinks, sockets, fifos
      }
      let size = 0;
      try {
        size = fs.statSync(abs).size;
      } catch (err) {
        state.errors.push(`cannot stat ${rel}: ${err.message}`);
        continue;
      }
      entry.files += 1;
      entry.bytes += size;
      if (!entry.largest || size > entry.largest.bytes) {
        entry.largest = { path: rel, bytes: size };
      }

      if (size > MAX_TEXT_BYTES || isLikelyBinary(abs)) {
        continue;
      }
      let content;
      try {
        content = fs.readFileSync(abs, 'utf8');
      } catch (err) {
        state.errors.push(`cannot read ${rel}: ${err.message}`);
        continue;
      }
      for (const marker of state.markers) {
        const count = countMatches(content, marker);
        if (count > 0) {
          state.markerHits[marker].push({ path: rel, count });
        }
      }
    }
  }
  state.dirs[dirName] = entry;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(
      [
        'theme-source-auditor inventory',
        '',
        'Usage:',
        '  node inventory.mjs [theme-root] [--markers=a,b,c] [--help]',
        '',
        'theme-root defaults to the current working directory.',
        '--markers overrides the default provenance marker list.',
        'INVENTORY_MARKERS env var overrides the list as well.',
        'The special marker "MIT license text" matches the MIT license preamble.',
        'Output: JSON on stdout with directory inventories and per-file marker matches.',
      ].join('\n'),
    );
    process.exit(0);
  }

  const markers = args.markers
    || (process.env.INVENTORY_MARKERS ? process.env.INVENTORY_MARKERS.split(',').map((s) => s.trim()).filter(Boolean) : null)
    || DEFAULT_MARKERS;

  const root = path.resolve(args.root);
  if (!fs.existsSync(root)) {
    const out = { error: `theme root not found: ${root}`, root };
    console.log(JSON.stringify(out, null, 2));
    process.exit(1);
  }
  if (!fs.statSync(root).isDirectory()) {
    const out = { error: `theme root is not a directory: ${root}`, root };
    console.log(JSON.stringify(out, null, 2));
    process.exit(1);
  }

  const state = {
    markers,
    dirs: {},
    markerHits: Object.fromEntries(markers.map((m) => [m, []])),
    errors: [],
  };

  for (const dirName of THEME_DIRS) {
    walkDir(root, dirName, state);
  }

  const totals = { files: 0, bytes: 0 };
  for (const dirName of THEME_DIRS) {
    const entry = state.dirs[dirName];
    if (entry && !entry.missing && !entry.notDirectory) {
      totals.files += entry.files;
      totals.bytes += entry.bytes;
    }
  }

  const markerSummary = {};
  for (const marker of markers) {
    const hits = state.markerHits[marker];
    markerSummary[marker] = hits.reduce((sum, hit) => sum + hit.count, 0);
    hits.sort((a, b) => b.count - a.count || a.path.localeCompare(b.path));
  }

  const out = {
    tool: 'theme-source-auditor/inventory',
    root,
    scannedAt: new Date().toISOString(),
    themeDirs: THEME_DIRS,
    markersConfigured: markers,
    dirs: state.dirs,
    totals,
    markerHits: state.markerHits,
    markerSummary,
    errors: state.errors,
  };

  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

main();
