#!/usr/bin/env node
/**
 * scaffold-docs.mjs — create docs/design-system.md in a Shopify theme root.
 *
 * Usage:
 *   node scaffold-docs.mjs [theme-root] [--force]
 *
 * - theme-root defaults to the current working directory.
 * - Creates <theme-root>/docs/design-system.md from templates/design-system.md
 *   only if it does not already exist (use --force to overwrite).
 * - Substitutes {{theme_name}} (from config/settings_schema.json theme_info,
 *   falling back to the directory name) and {{generated_date}}.
 * - Prints structured JSON to stdout; exits non-zero on error.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE_PATH = join(SKILL_DIR, "templates", "design-system.md");
const OUTPUT_RELATIVE = ["docs", "design-system.md"];

function fail(message, code = 1) {
  process.stdout.write(JSON.stringify({ status: "error", message }, null, 2) + "\n");
  process.exit(code);
}

function isThemeRoot(dir) {
  const hasSettings = existsSync(join(dir, "config", "settings_schema.json"));
  const hasLayout = existsSync(join(dir, "layout"));
  const hasSections = existsSync(join(dir, "sections"));
  if (hasSettings) return true;
  if (hasLayout && hasSections) return true;
  return false;
}

function readThemeInfo(dir) {
  const settingsPath = join(dir, "config", "settings_schema.json");
  if (!existsSync(settingsPath)) return null;
  try {
    const schema = JSON.parse(readFileSync(settingsPath, "utf8"));
    const info = Array.isArray(schema) ? schema.find((s) => s && s.name === "theme_info") : null;
    if (info && typeof info.theme_name === "string" && info.theme_name.trim()) {
      return { themeName: info.theme_name, themeAuthor: info.theme_author || null };
    }
  } catch {
    // unparseable schema: fall through to directory-name fallback
  }
  return null;
}

function parseArgs(argv) {
  let force = false;
  let rootArg = null;
  for (const arg of argv) {
    if (arg === "--force" || arg === "-f") force = true;
    else if (arg === "--help" || arg === "-h") {
      process.stdout.write(
        "scaffold-docs.mjs — create docs/design-system.md from the theme-art-director template\n\n" +
          "Usage: node scaffold-docs.mjs [theme-root] [--force]\n" +
          "  theme-root   Shopify theme root (default: current directory)\n" +
          "  --force      overwrite an existing docs/design-system.md\n"
      );
      process.exit(0);
    } else if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`);
    } else {
      rootArg = arg;
    }
  }
  return { force, rootArg };
}

const { force, rootArg } = parseArgs(process.argv.slice(2));
const themeRoot = resolve(rootArg || process.cwd());

if (!isThemeRoot(themeRoot)) {
  fail(
    `"${themeRoot}" does not look like a Shopify theme root (expected config/settings_schema.json, or layout/ and sections/ directories).`
  );
}

if (!existsSync(TEMPLATE_PATH)) {
  fail(`Template not found at ${TEMPLATE_PATH}.`);
}

const themeInfo = readThemeInfo(themeRoot);
const themeName = (themeInfo && themeInfo.themeName) || basename(themeRoot);
const generatedDate = new Date().toISOString().slice(0, 10);

let template;
try {
  template = readFileSync(TEMPLATE_PATH, "utf8");
} catch (err) {
  fail(`Could not read template: ${err.message}`);
}

const doc = template
  .replaceAll("{{theme_name}}", themeName)
  .replaceAll("{{generated_date}}", generatedDate);

const outputPath = join(themeRoot, ...OUTPUT_RELATIVE);

if (existsSync(outputPath) && !force) {
  process.stdout.write(
    JSON.stringify(
      {
        status: "exists",
        themeRoot,
        outputPath,
        themeName,
        generatedAt: generatedDate,
        message: `docs/design-system.md already exists; pass --force to overwrite.`,
      },
      null,
      2
    ) + "\n"
  );
  process.exit(0);
}

try {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, doc);
} catch (err) {
  fail(`Could not write ${outputPath}: ${err.message}`);
}

process.stdout.write(
  JSON.stringify(
    {
      status: "created",
      themeRoot,
      outputPath,
      themeName,
      author: (themeInfo && themeInfo.themeAuthor) || null,
      generatedAt: generatedDate,
      message:
        "Design-system scaffold created. Fill every section with decisions, rationales, and concrete tokens per the skill instructions.",
    },
    null,
    2
  ) + "\n"
);
process.exit(0);
