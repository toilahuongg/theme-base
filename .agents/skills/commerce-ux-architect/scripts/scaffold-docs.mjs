#!/usr/bin/env node
// scaffold-docs.mjs — create the three commerce-ux-architect output docs from templates.
//
// Usage: node scaffold-docs.mjs [theme-root]
//   theme-root defaults to the current working directory.
//   Creates docs/commerce-thesis.md, docs/user-journeys.md, and
//   docs/page-information-architecture.md from the skill templates.
//   Existing files are never overwritten.
//
// Output: structured JSON on stdout: { themeRoot, created: [...], skipped: [...] }.

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(scriptDir, "..");
const themeRoot = resolve(process.argv[2] ?? process.cwd());

const OUTPUTS = [
  { doc: "docs/commerce-thesis.md", template: "templates/commerce-thesis.md" },
  { doc: "docs/user-journeys.md", template: "templates/user-journeys.md" },
  { doc: "docs/page-information-architecture.md", template: "templates/page-information-architecture.md" },
];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const created = [];
const skipped = [];

for (const { doc, template } of OUTPUTS) {
  const docPath = join(themeRoot, doc);
  const templatePath = join(skillRoot, template);
  if (await exists(docPath)) {
    skipped.push({ file: doc, reason: "already exists" });
    continue;
  }
  try {
    const content = await readFile(templatePath, "utf8");
    await mkdir(dirname(docPath), { recursive: true });
    await writeFile(docPath, content, "utf8");
    created.push({ file: doc, from: template });
  } catch (err) {
    console.error(`scaffold-docs: failed to create ${docPath}: ${err.message}`);
    process.exitCode = 1;
  }
}

console.log(JSON.stringify({ themeRoot, created, skipped }, null, 2));
