#!/usr/bin/env node
/**
 * detect-features.mjs — Theme Feature Analyst candidate detector.
 *
 * Greps a Shopify theme root for configurable feature markers and prints a
 * JSON candidate list (marker -> files) that the analyst then classifies.
 * A match means the marker (or one of its variants/aliases) appears in a
 * file's contents or filename — this is a candidate seed, not a verdict.
 *
 * Usage:
 *   node detect-features.mjs [theme-root] [--markers <json-file>] [--compact]
 *
 *   theme-root   Theme directory to scan. Defaults to the current directory.
 *   --markers    JSON file replacing the default marker map. Two shapes:
 *                  { "quick-add": ["quick_add", "quickAdd"], ... }
 *                  ["quick-add", "cart-drawer", ...]
 *                String entries are treated as markers with auto-generated
 *                variants (lowercase, no-separator, camelCase, PascalCase).
 *   --compact    Print single-line JSON instead of pretty-printed.
 *   --help       Show this usage text.
 *
 * Output: { root, themeRoot, scannedFiles, warnings[], markers: { <marker>: [files] } }
 * Every configured marker appears in `markers`, even when it matched nothing
 * (empty array), so the analyst can see which probes came up empty.
 */

import fs from "node:fs";
import path from "node:path";

/** Default marker map: canonical name -> alias patterns to search. */
const DEFAULT_MARKERS = {
  "quick-add": ["quick-add", "quick_add", "quickAdd", "QuickAdd", "quickadd"],
  "cart-drawer": ["cart-drawer", "cart_drawer", "cartDrawer", "CartDrawer", "cartdrawer"],
  "sticky-atc": [
    "sticky-atc", "sticky_atc", "stickyAtc", "StickyAtc", "stickyatc",
    "sticky-add-to-cart", "sticky_add_to_cart", "sticky-add",
  ],
  swatches: ["swatch", "swatches", "Swatch"],
  "size-chart": ["size-chart", "size_chart", "sizeChart", "SizeChart", "sizechart"],
  countdown: ["countdown", "count_down", "countDown", "Countdown", "count-down"],
  "recently-viewed": [
    "recently-viewed", "recently_viewed", "recentlyViewed", "RecentlyViewed",
    "recentlyviewed", "recently viewed",
  ],
  "predictive-search": [
    "predictive-search", "predictive_search", "predictiveSearch",
    "PredictiveSearch", "predictivesearch",
  ],
  "quick-view": ["quick-view", "quick_view", "quickview", "quickView", "QuickView", "quick view"],
  "mega-menu": ["mega-menu", "mega_menu", "megamenu", "megaMenu", "MegaMenu"],
};

/** Directories never scanned (dependency/build/vcs noise). */
const SKIP_DIRS = new Set([
  "node_modules", ".git", ".github", ".shopify", "vendor", "dist", "build",
  ".cache", ".next", "coverage", ".turbo",
]);

/** File extensions scanned for content matches. Filenames are matched regardless. */
const TEXT_EXTS = new Set([
  ".liquid", ".json", ".js", ".mjs", ".cjs", ".ts", ".html", ".css",
  ".scss", ".sass", ".svg", ".xml", ".txt", ".md",
]);

/** Files larger than this are not read; their basename is still matched. */
const MAX_CONTENT_BYTES = 1 * 1024 * 1024;

/** Build a strict lowercase alphanumeric-only form of a marker fragment. */
const alnum = (s) => s.replace(/[^a-z0-9]/gi, "").toLowerCase();

/** camelCase and PascalCase forms of a hyphen/underscore fragment. */
function caseVariants(fragment) {
  const parts = fragment.split(/[-_]/).filter(Boolean);
  if (parts.length < 2) return [];
  const camel =
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase())
      .join("");
  const pascal =
    camel[0].toUpperCase() + camel.slice(1);
  return [camel, pascal];
}

/** Expand a marker into the full list of search fragments (lowercased). */
function expandMarker(marker, aliases) {
  const fragments = new Set();
  for (const raw of [marker, ...aliases]) {
    fragments.add(raw.toLowerCase());
    fragments.add(alnum(raw));
    for (const c of caseVariants(raw)) {
      fragments.add(c.toLowerCase());
      fragments.add(alnum(c));
    }
  }
  return [...fragments].filter((f) => f.length >= 3);
}

function parseArgs(argv) {
  const opts = { root: process.cwd(), markersFile: null, compact: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") opts.help = true;
    else if (arg === "--compact") opts.compact = true;
    else if (arg === "--markers") {
      if (i + 1 >= argv.length) throw new Error("--markers requires a JSON file path");
      opts.markersFile = argv[++i];
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      opts.root = arg;
    }
  }
  return opts;
}

function loadMarkers(markersFile) {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(markersFile, "utf8"));
  } catch (err) {
    throw new Error(`Cannot read --markers file ${markersFile}: ${err.message}`);
  }
  if (Array.isArray(raw)) {
    const map = {};
    for (const name of raw) {
      if (typeof name !== "string" || !name.trim()) {
        throw new Error(`--markers array entries must be non-empty strings (got ${JSON.stringify(name)})`);
      }
      map[name.trim()] = [];
    }
    return map;
  }
  if (raw && typeof raw === "object") {
    for (const [name, aliases] of Object.entries(raw)) {
      if (typeof name !== "string" || !name.trim()) {
        throw new Error("--markers object keys must be non-empty strings");
      }
      if (aliases == null) {
        raw[name] = [];
      } else if (!Array.isArray(aliases) || aliases.some((a) => typeof a !== "string")) {
        throw new Error(`--markers entry "${name}" must map to an array of alias strings`);
      }
    }
    return raw;
  }
  throw new Error("--markers file must be a JSON object (marker -> aliases) or an array of marker names");
}

async function collectFiles(root) {
  const files = [];
  const warnings = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch (err) {
      warnings.push(`unreadable directory ${dir}: ${err.message}`);
      return;
    }
    for (const entry of entries) {
      if (entry.name === ".DS_Store") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await walk(full);
      } else if (entry.isFile() || entry.isSymbolicLink()) {
        files.push(full);
      }
    }
  }
  await walk(root);
  return { files, warnings };
}

async function fileContainsAny(file, fragments) {
  let stat;
  try {
    stat = await fs.promises.stat(file);
  } catch {
    return false; // dangling symlink or vanished file
  }
  const base = path.basename(file).toLowerCase();
  if (fragments.some((f) => base.includes(f))) return true;
  if (stat.size > MAX_CONTENT_BYTES) return false;
  let buf;
  try {
    buf = await fs.promises.readFile(file);
  } catch {
    return false;
  }
  if (buf.includes(0)) return false; // binary
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buf).toLowerCase();
  return fragments.some((f) => text.includes(f));
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`detect-features.mjs: ${err.message}`);
    console.error("Run with --help for usage.");
    process.exit(1);
  }

  if (opts.help) {
    console.log(`detect-features.mjs — theme feature candidate detector

Usage:
  node detect-features.mjs [theme-root] [--markers <json-file>] [--compact]

  theme-root   Theme directory to scan. Defaults to the current directory.
  --markers    JSON file replacing the default marker map. Two shapes:
                 { "quick-add": ["quick_add", "quickAdd"], ... }
                 ["quick-add", "cart-drawer", ...]
               String entries are treated as markers with auto-generated
               variants (lowercase, no-separator, camelCase, PascalCase).
  --compact    Print single-line JSON instead of pretty-printed.

Default markers:
${Object.keys(DEFAULT_MARKERS).join(", ")}

Output: JSON object { root, themeRoot, scannedFiles, warnings, markers }.
`);
    process.exit(0);
  }

  const root = path.resolve(opts.root);
  let stat;
  try {
    stat = fs.statSync(root);
  } catch {
    console.error(`detect-features.mjs: theme root not found: ${root}`);
    process.exit(1);
  }
  if (!stat.isDirectory()) {
    console.error(`detect-features.mjs: not a directory: ${root}`);
    process.exit(1);
  }

  let markers;
  try {
    markers = opts.markersFile ? loadMarkers(opts.markersFile) : DEFAULT_MARKERS;
  } catch (err) {
    console.error(`detect-features.mjs: ${err.message}`);
    process.exit(1);
  }

  const { files, warnings } = await collectFiles(root);
  const themeRoot =
    fs.existsSync(path.join(root, "layout")) && fs.existsSync(path.join(root, "sections"));
  if (!themeRoot) {
    warnings.push(
      `no layout/ and sections/ pair at ${root}; expected a Shopify theme root (scanning anyway)`
    );
  }

  const expanded = new Map();
  for (const [name, aliases] of Object.entries(markers)) {
    expanded.set(name, expandMarker(name, aliases ?? []));
  }

  const results = {};
  for (const name of expanded.keys()) results[name] = [];

  for (const file of files) {
    for (const [name, fragments] of expanded.entries()) {
      if (await fileContainsAny(file, fragments)) {
        results[name].push(path.relative(root, file));
      }
    }
  }

  for (const name of Object.keys(results)) {
    results[name].sort((a, b) => a.localeCompare(b));
  }

  const output = {
    root,
    themeRoot,
    scannedFiles: files.length,
    warnings,
    markers: results,
  };
  process.stdout.write(opts.compact ? JSON.stringify(output) : JSON.stringify(output, null, 2));
  process.stdout.write("\n");
}

main().catch((err) => {
  console.error(`detect-features.mjs: ${err.stack || err.message}`);
  process.exit(1);
});
