#!/usr/bin/env node
// Audit CTA settings in every template + group JSON against section schemas.
// Flags:
//   DEAD BUTTON   — button_label set but button_link empty (renders aria-disabled, useless)
//   LINK W/O TEXT — button_link set but button_label empty (invisible control)
//   EMPTY TEXT    — richtext/text content empty where liquid renders the wrapper unconditionally
//   MISSING LINK HANDLE — /collections/... /products/... /pages/... /blogs/... refs to verify
// Usage: node audit-cta.mjs [repoPath] [out-file]
import fs from "node:fs";
import path from "node:path";

const REPO = process.argv[2] || process.cwd();
const OUT = process.argv[3] || "/tmp/cta-audit.txt";

// CTA settings: { id, kind } kind = "label" | "link" | "text"
const CTA = {
  label: new Set(["button_text", "button_label", "btn_text", "cta_text", "primary_text", "secondary_text", "action_text"]),
  link: new Set(["button_link", "button_url", "btn_link", "cta_link", "primary_link", "secondary_link", "action_link", "link", "url"]),
  text: new Set(["text"]), // richtext/text content blocks
};
const PAIRS = [
  ["button_text", "button_link"], ["button_text", "button_url"],
  ["button_label", "button_link"], ["button_label", "button_url"],
  ["cta_text", "cta_link"], ["primary_text", "primary_link"],
  ["secondary_text", "secondary_link"], ["action_text", "action_link"],
  ["btn_text", "btn_link"],
];

const schemas = {};
for (const f of fs.readdirSync(path.join(REPO, "sections"))) {
  if (!f.endsWith(".liquid")) continue;
  const raw = fs.readFileSync(path.join(REPO, "sections", f), "utf8");
  const m = raw.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!m) continue;
  try { schemas[f.replace(/\.liquid$/, "")] = JSON.parse(m[1]); } catch {}
}

const files = [
  ...fs.readdirSync(path.join(REPO, "templates")).filter(f => f.endsWith(".json")).map(f => `templates/${f}`),
  "sections/header-group.json",
  "sections/footer-group.json",
];

const problems = [];
const checked = { settings: 0 };

function where(file, secKey, secType, blkId, blkType) {
  return `${file} :: ${secKey}[${secType}]${blkId ? ` blocks.${blkId}[${blkType}]` : ""}`;
}

for (const file of files) {
  const tpl = JSON.parse(fs.readFileSync(path.join(REPO, file), "utf8"));
  if (!tpl.sections) continue;
  for (const [sk, sec] of Object.entries(tpl.sections)) {
    if (sec.disabled === true) continue;
    const schema = schemas[sec.type] || {};
    const check = (settingsObj, w, schemaSettings = []) => {
      if (!settingsObj) return;
      const schemaIds = new Set((schemaSettings || []).map(s => s.id));
      // pair check — only against keys the schema actually declares
      for (const [labelId, linkId] of PAIRS) {
        if (!schemaIds.has(labelId) || !schemaIds.has(linkId)) continue; // CTA pair must be declared by schema
        const label = settingsObj[labelId];
        const link = settingsObj[linkId]; // may be undefined if schema lacks it (fine, nothing to link)
        if (label !== undefined && label !== null && label !== "" && (link === undefined || link === null || link === "")) {
          problems.push(`${w}.${labelId}="${String(label).slice(0, 40)}" but .${linkId} empty → DEAD BUTTON`);
        } else if ((label === undefined || label === null || label === "") && link !== undefined && link !== null && link !== "") {
          problems.push(`${w}.${linkId}="${String(link).slice(0, 40)}" but .${labelId} empty → LINK W/O TEXT`);
        }
        checked.settings++;
      }
      // text content check
      for (const t of CTA.text) {
        if (!(t in settingsObj)) continue;
        const v = settingsObj[t];
        if (v === undefined || v === null || v === "") {
          problems.push(`${w}.${t} = EMPTY TEXT`);
        }
        checked.settings++;
      }
    };
    check(sec.settings, where(file, sk, sec.type), schema.settings);
    for (const [bid, blk] of Object.entries(sec.blocks || {})) {
      if (blk.disabled === true) continue;
      const bschema = (schema.blocks || []).find(b => b.type === blk.type) || {};
      check(blk.settings, where(file, sk, sec.type, bid, blk.type), bschema.settings);
    }
  }
}

// dead-link handle verification: collect link values
const links = new Set();
for (const p of problems) { /* none here */ }
for (const file of files) {
  const tpl = JSON.parse(fs.readFileSync(path.join(REPO, file), "utf8"));
  if (!tpl.sections) continue;
  const walk = (o) => {
    for (const [k, v] of Object.entries(o || {})) {
      if (typeof v === "string" && /^\/(collections|products|pages|blogs|blogs)\//.test(v)) links.add(v);
      if (v && typeof v === "object") walk(v);
    }
  };
  walk(tpl.sections);
}
const validHandles = new Set();
for (const d of ["products", "collections", "pages", "blogs"]) {
  const dir = path.join(REPO, "templates");
  void dir;
}
// note: cross-check against store content is done in the report phase (query store handles);
// here we only surface every path ref for manual/API verification.
const linkRefs = [...links].sort();

fs.writeFileSync(OUT, problems.join("\n") + "\n\n--- link refs to verify against store ---\n" + linkRefs.join("\n") + "\n");
console.log(`Checked CTA pairs: ${checked.settings}`);
console.log(`Problems: ${problems.length} | link refs to verify: ${linkRefs.length}`);
for (const p of problems) console.log("  " + p);
