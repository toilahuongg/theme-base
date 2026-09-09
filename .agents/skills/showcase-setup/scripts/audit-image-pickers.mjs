#!/usr/bin/env node
// Audit every image_picker setting in every template + group JSON against section schemas.
import fs from "node:fs";
import path from "node:path";

const REPO = process.argv[2] || process.cwd();
const urlsJson = process.argv[3];
const urls = urlsJson ? JSON.parse(fs.readFileSync(urlsJson, "utf8")) : {};
const uploaded = new Set(Object.values(urls).filter(r => r?.filename).map(r => r.filename));
// usage: node audit-image-pickers.mjs [repoPath] [image-urls.json]  — omit urls json to skip MISSING FILE checks
const assets = new Set(fs.readdirSync(path.join(REPO, "assets")));

// --- parse section schemas ---
const schemas = {};
for (const f of fs.readdirSync(path.join(REPO, "sections"))) {
  if (!f.endsWith(".liquid")) continue;
  const raw = fs.readFileSync(path.join(REPO, "sections", f), "utf8");
  const m = raw.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!m) continue;
  try { schemas[f.replace(/\.liquid$/, "")] = JSON.parse(m[1]); } catch {}
}

const imagePickers = (settings) => (settings || []).filter(s => s.type === "image_picker").map(s => ({ id: s.id, default: s.default ?? "" }));

function checkValue(v, key, where, problems) {
  if (v === undefined || v === null || v === "") {
    problems.push(`${where}${key} = EMPTY`);
    return;
  }
  if (v.startsWith("shopify://shop_images/")) {
    const name = v.replace("shopify://shop_images/", "");
    if (!uploaded.has(name)) problems.push(`${where}${key} = MISSING FILE: ${name}`);
    return;
  }
  if (v.startsWith("https://")) return; // external ok
  if (/^[a-zA-Z0-9_.-]+\.(png|jpe?g|webp|gif|svg|avif)$/i.test(v)) {
    if (!assets.has(v)) problems.push(`${where}${key} = MISSING ASSET: ${v}`);
    return;
  }
  problems.push(`${where}${key} = WEIRD VALUE: ${v}`);
}

const problems = [];
const checked = { total: 0, ok: 0 };

function auditFile(file) {
  const tpl = JSON.parse(fs.readFileSync(path.join(REPO, file), "utf8"));
  if (!tpl.sections) return;
  for (const [secKey, sec] of Object.entries(tpl.sections)) {
    if (sec.disabled === true) continue;
    const schema = schemas[sec.type] || {};
    const where = `${file} :: ${secKey}[${sec.type}] `;
    // section-level image_picker
    for (const s of imagePickers(schema.settings)) {
      checked.total++;
      const v = sec.settings?.[s.id] ?? s.default;
      if (v) checked.ok++; else if (v === "" || v === undefined || v === null) { checked.ok++; }
      checkValue(v, `settings.${s.id}`, where, problems);
    }
    // block-level image_picker
    for (const [bid, blk] of Object.entries(sec.blocks || {})) {
      if (blk.disabled === true) continue;
      const bschema = (schema.blocks || []).find(b => b.type === blk.type) || {};
      for (const s of imagePickers(bschema.settings)) {
        checked.total++;
        const v = blk.settings?.[s.id] ?? s.default;
        if (v) checked.ok++; else if (v === "" || v === undefined || v === null) { checked.ok++; }
        checkValue(v, `blocks.${bid}[${blk.type}].settings.${s.id}`, where, problems);
      }
    }
  }
}

const files = [];
for (const d of ["templates", "sections"]) {
  for (const f of fs.readdirSync(path.join(REPO, d))) {
    if (f.endsWith(".json")) files.push(`${d}/${f}`);
  }
}
for (const f of files) auditFile(f);

console.log(`Checked ${checked.total} image_picker settings (${checked.ok} with values)`);
console.log(`Problems: ${problems.length}`);
for (const p of problems) console.log("  " + p);
