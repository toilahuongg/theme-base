#!/usr/bin/env node
/**
 * init-state.mjs — create docs/pipeline-state.md from the template if absent.
 * Usage: node init-state.mjs [theme-root]
 * Theme root defaults to the current working directory.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(process.argv[2] ?? ".");
const docsDir = join(root, "docs");
const statePath = join(docsDir, "pipeline-state.md");
const templatePath = join(dirname(fileURLToPath(import.meta.url)), "..", "templates", "pipeline-state.md");

if (existsSync(statePath)) {
  console.log(`exists: ${statePath} (not overwritten)`);
  process.exit(0);
}
if (!existsSync(templatePath)) {
  console.error(`template missing: ${templatePath}`);
  process.exit(1);
}
mkdirSync(docsDir, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const content = readFileSync(templatePath, "utf8").replace("<YYYY-MM-DD>", today);
writeFileSync(statePath, content);
console.log(`created: ${statePath}`);
