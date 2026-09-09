#!/usr/bin/env node
// Upload images to a Shopify store via stagedUploadsCreate → PUT → fileCreate → requery-by-filename.
// Usage:
//   node upload-images.mjs <store> <urls-json> <slug> <image-file> [alt]
//   node upload-images.mjs <store> <urls-json> <slug-dir>          — upload every image in <slug-dir>
// Requires SHOPIFY_ADMIN_TOKEN env (shopify-store registry token).
//
// Flow notes (2026-07 API shapes, hard-won):
//   - resource: IMAGE (NOT SHOP_IMAGE — ACCESS_DENIED)
//   - fileSize MUST be a string
//   - PUT straight to target.url; do NOT append parameters
//   - fileCreate returns NO url; preview.image.url is null immediately after create
//   - requery by filename: filter works, id: filter does NOT
//   - errors live on fileCreate.files[0].fileErrors (top-level fileErrors does not exist)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [store, urlsJson, slugArg, fileArg, altArg] = process.argv.slice(2);
if (!store || !urlsJson || !slugArg) {
  console.error("usage: node upload-images.mjs <store> <urls-json> <slug> [image-file] [alt]");
  process.exit(1);
}
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
if (!TOKEN) { console.error("SHOPIFY_ADMIN_TOKEN missing"); process.exit(1); }
const QFILE = "/tmp/shopify-upload-query.graphql";

function gql(query) {
  fs.writeFileSync(QFILE, query);
  const r = execFileSync("shopify-store", ["graphql", store, "--query-file", QFILE],
    { encoding: "utf8", env: { ...process.env, SHOPIFY_ADMIN_TOKEN: TOKEN } });
  const j = JSON.parse(r);
  if (j.errors) { const e = new Error(j.errors[0].message); e.raw = r; throw e; }
  return j.data;
}

const results = fs.existsSync(urlsJson) ? JSON.parse(fs.readFileSync(urlsJson, "utf8")) : {};

function uploadOne(slug, file, alt) {
  const filename = `${slug}.${file.split(".").pop().toLowerCase()}`;
  const mime = /\.(jpe?g)$/i.test(file) ? "image/jpeg" : /\.webp$/i.test(file) ? "image/webp" : "image/png";
  if (results[slug]?.id) { console.log(`[SKIP] ${slug}: already uploaded (${results[slug].id})`); return; }

  let target;
  try {
    const d = gql(`mutation { stagedUploadsCreate(input: [{ resource: IMAGE, filename: "${filename}", mimeType: "${mime}", httpMethod: PUT, fileSize: "${fs.statSync(file).size}" }]) { stagedTargets { url resourceUrl } userErrors { field message } } }`);
    if (d.stagedUploadsCreate.userErrors.length) throw new Error(JSON.stringify(d.stagedUploadsCreate.userErrors));
    target = d.stagedUploadsCreate.stagedTargets[0];
  } catch (e) {
    console.log(`[FAIL] ${slug}: staged: ${(e.message || "").split("\n")[0]}`);
    return;
  }

  const put = execFileSync("curl", ["-sS", "-X", "PUT", target.url, "-H", `Content-Type: ${mime}`, "--data-binary", `@${file}`, "-w", " HTTP:%{http_code}"], { encoding: "utf8" });
  if (!/HTTP:2\d\d/.test(put)) { console.log(`[FAIL] ${slug}: PUT ${put.slice(-60)}`); return; }

  try {
    const d = gql(`mutation { fileCreate(files: [{ originalSource: "${target.resourceUrl}", filename: "${filename}", contentType: IMAGE, alt: "${alt || slug}" }]) { files { id preview { image { url } } fileErrors { code message } } } }`);
    const f = d.fileCreate.files[0];
    if (f?.fileErrors?.length) { console.log(`[FAIL] ${slug}: ${JSON.stringify(f.fileErrors)}`); return; }
    let url = f.preview?.image?.url;
    if (!url) {
      const q = gql(`query { files(first: 1, query: "filename:${filename}") { nodes { id preview { image { url } } } } }`);
      url = q.files?.nodes?.[0]?.preview?.image?.url || null;
    }
    results[slug] = { id: f.id, url, filename };
    fs.writeFileSync(urlsJson, JSON.stringify(results, null, 2));
    console.log(`[OK] ${slug} → ${url}`);
  } catch (e) {
    console.log(`[FAIL] ${slug}: fileCreate: ${(e.message || "").split("\n")[0]}`);
    if (e.raw) console.log(`  RAW: ${e.raw.slice(0, 300)}`);
  }
}

if (fileArg) {
  uploadOne(slugArg, fileArg, altArg);
} else {
  const dir = slugArg;
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
    const slug = f.replace(/\.(png|jpe?g|webp)$/i, "");
    uploadOne(slug, path.join(dir, f), slug);
  }
}
const ok = Object.values(results).filter(r => r?.id).length;
console.log(`\nTotal entries in ${urlsJson}: ${Object.keys(results).length} (${ok} with id)`);
