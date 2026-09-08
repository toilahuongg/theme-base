#!/usr/bin/env node
/**
 * audit-basics.mjs — static performance audit for a Shopify theme.
 *
 * Usage:
 *   node audit-basics.mjs [theme-root]
 *
 * theme-root defaults to the current working directory. Prints one JSON
 * document to stdout grouped by category. Exit code 0 on success (findings
 * are data, not failures); exit code 1 if the theme root cannot be read.
 *
 * Checks (static heuristics — confirm each finding in the file before fixing):
 *   1. images_without_dimensions  — <img> tags missing width and/or height
 *      attributes (missing dimensions cause layout shift / CLS).
 *   2. blocking_scripts           — <script src> in layout/*.liquid without
 *      defer or async (parse-blocking).
 *   3. script_tag_without_defer   — Liquid `| script_tag` calls in layout
 *      without a defer option (advisory: script_tag needs `defer: true`).
 *   4. external_assets            — http(s) URLs in assets/ that are not on
 *      the Shopify CDN allowlist.
 *   5. missing_lazy_loading       — images/iframes after the first per file
 *      without loading="lazy" (heuristic for below-fold media).
 *   6. inline_styles_in_sections  — <style> blocks in sections/*.liquid with
 *      byte size (large inline styles defeat caching).
 *   7. oversized_js               — assets/*.js larger than 150 KB raw
 *      (gzip size is the real budget; re-check gzipped bytes manually).
 *
 * No dependencies. Works on Node >= 14.
 */
import fs from "node:fs";
import path from "node:path";

const VERSION = "1.0.0";
const OVERSIZED_JS_RAW_BYTES = 150 * 1024;
const INLINE_STYLE_WARNING_BYTES = 2048;
const SHOPIFY_CDN_ALLOWLIST = [
  "cdn.shopify.com",
  "cdn.shopifycloud.com",
  "shopify.com",
];
const LIQUID_EXT = ".liquid";
const ASSET_EXTS = new Set([".css", ".js", ".svg", ".json"]);

const HELP = `audit-basics.mjs — static performance audit for a Shopify theme

Usage:
  node audit-basics.mjs [theme-root] [--help]

theme-root defaults to the current working directory.
Prints findings as JSON grouped by category to stdout.
Exit codes: 0 = ran successfully (findings are data, not failures);
            1 = theme root missing or unreadable.`;

function usageError(msg) {
  process.stderr.write(msg + "\n\n" + HELP + "\n");
  process.exit(1);
}

function collectFiles(root, exts) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "node_modules") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full);
    }
  }
  return out.sort();
}

function lineAt(content, index) {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i++) {
    if (content.charCodeAt(i) === 10) line++;
  }
  return line;
}

function findAttr(name, attrs) {
  return attrs.some((a) => a.name.toLowerCase() === name);
}

function parseAttrs(tag) {
  const attrs = [];
  const re = /([a-zA-Z-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
  let m;
  while ((m = re.exec(tag)) !== null) {
    if (m[1] === "img" || m[1] === "iframe" || m[1] === "script") continue;
    attrs.push({ name: m[1], value: m[2] ?? "" });
  }
  return attrs;
}

function rel(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function audit(root) {
  const findings = {
    images_without_dimensions: [],
    blocking_scripts: [],
    script_tag_without_defer: [],
    external_assets: [],
    missing_lazy_loading: [],
    inline_styles_in_sections: [],
    oversized_js: [],
  };

  const liquidFiles = collectFiles(root, new Set([LIQUID_EXT]));
  const layoutFiles = liquidFiles.filter((f) =>
    f.split(path.sep).includes("layout")
  );
  const sectionFiles = liquidFiles.filter((f) =>
    f.split(path.sep).includes("sections")
  );
  const assetFiles = collectFiles(root, ASSET_EXTS).filter((f) =>
    f.split(path.sep).includes("assets")
  );

  // 1 + 5. Images: dimensions and lazy loading.
  for (const file of liquidFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const imgRe = /<img\b[^>]*>/gi;
    let m;
    let imgIndex = 0;
    while ((m = imgRe.exec(content)) !== null) {
      const tag = m[0];
      const attrs = parseAttrs(tag);
      const line = lineAt(content, m.index);
      const hasWidth = findAttr("width", attrs);
      const hasHeight = findAttr("height", attrs);
      if (!hasWidth || !hasHeight) {
        findings.images_without_dimensions.push({
          file: rel(root, file),
          line,
          detail: `img tag missing ${!hasWidth ? "width" : ""}${
            !hasWidth && !hasHeight ? " and " : ""
          }${!hasHeight ? "height" : ""} attribute(s) — causes layout shift (CLS)`,
          severity: hasWidth || hasHeight ? "info" : "warning",
          fix: "add width and height attributes (e.g. from image.width/image.height) or CSS aspect-ratio",
        });
      }
      if (imgIndex > 0 && !findAttr("loading", attrs)) {
        findings.missing_lazy_loading.push({
          file: rel(root, file),
          line,
          detail:
            "img after the first in this file has no loading attribute — likely below the fold",
          severity: "warning",
          fix: "add loading: 'lazy' via image_tag, or loading=\"lazy\" on the img tag; keep the LCP image eager",
        });
      }
      imgIndex++;
    }
    const iframeRe = /<iframe\b[^>]*>/gi;
    let iframeIndex = 0;
    while ((m = iframeRe.exec(content)) !== null) {
      const attrs = parseAttrs(m[0]);
      if (iframeIndex > 0 && !findAttr("loading", attrs)) {
        findings.missing_lazy_loading.push({
          file: rel(root, file),
          line: lineAt(content, m.index),
          detail: "iframe after the first in this file has no loading=\"lazy\"",
          severity: "warning",
          fix: "add loading=\"lazy\" to the iframe",
        });
      }
      iframeIndex++;
    }
  }

  // 2 + 3. Scripts in layout.
  for (const file of layoutFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const scriptRe = /<script\b([^>]*)>/gi;
    let m;
    while ((m = scriptRe.exec(content)) !== null) {
      const attrs = parseAttrs(m[1]);
      const hasSrc = attrs.some((a) => a.name.toLowerCase() === "src");
      if (!hasSrc) continue;
      const deferred =
        findAttr("defer", attrs) || findAttr("async", attrs) || findAttr("type", attrs) && attrs.some((a) => a.name.toLowerCase() === "type" && a.value.toLowerCase().includes("module"));
      if (!deferred) {
        findings.blocking_scripts.push({
          file: rel(root, file),
          line: lineAt(content, m.index),
          detail: `script tag without defer or async blocks parsing${
            m[1] ? `: <script ${m[1].trim().slice(0, 120)}>` : ""
          }`,
          severity: "error",
          fix: "add defer (preferred) or async; or convert to a section-scoped deferred asset",
        });
      }
    }
    const scriptTagRe = /\|\s*script_tag(?::\s*([^}]*))?/g;
    let st;
    while ((st = scriptTagRe.exec(content)) !== null) {
      const opts = (st[1] ?? "").toLowerCase();
      if (!opts.includes("defer") && !opts.includes("async")) {
        findings.script_tag_without_defer.push({
          file: rel(root, file),
          line: lineAt(content, st.index),
          detail: "Liquid script_tag call without a defer/async option",
          severity: "warning",
          fix: "script_tag: defer: true (script_tag supports defer/async options)",
        });
      }
    }
  }

  // 4. External URLs in assets.
  const urlRe = /https?:\/\/[^\s'")\]]+/g;
  for (const file of assetFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const seen = new Set();
    let m;
    while ((m = urlRe.exec(content)) !== null) {
      const url = m[0].replace(/[.,;]+$/, "");
      let parsed;
      try {
        parsed = new URL(url);
      } catch {
        continue;
      }
      const host = parsed.hostname.toLowerCase();
      const allowed = SHOPIFY_CDN_ALLOWLIST.some(
        (d) => host === d || host.endsWith("." + d)
      );
      if (allowed || seen.has(url)) continue;
      seen.add(url);
      findings.external_assets.push({
        file: rel(root, file),
        line: lineAt(content, m.index),
        detail: `external URL referenced: ${url}`,
        severity: "warning",
        fix: "self-host via asset_url, or defer/consent-gate if it is a third-party dependency",
      });
    }
  }

  // 6. Inline styles in sections.
  for (const file of sectionFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    let m;
    while ((m = styleRe.exec(content)) !== null) {
      const bytes = Buffer.byteLength(m[1], "utf8");
      findings.inline_styles_in_sections.push({
        file: rel(root, file),
        line: lineAt(content, m.index),
        detail: `inline <style> block (${bytes} bytes)`,
        severity: bytes > INLINE_STYLE_WARNING_BYTES ? "warning" : "info",
        fix:
          bytes > INLINE_STYLE_WARNING_BYTES
            ? "move to an asset stylesheet (inline styles are not cacheable); keep only tiny section-scoped rules inline"
            : "acceptable if small and section-scoped; consider an asset file for consistency",
      });
    }
  }

  // 7. Oversized JS.
  for (const file of assetFiles.filter((f) => f.toLowerCase().endsWith(".js"))) {
    let stat;
    try {
      stat = fs.statSync(file);
    } catch {
      continue;
    }
    if (stat.size > OVERSIZED_JS_RAW_BYTES) {
      findings.oversized_js.push({
        file: rel(root, file),
        line: 1,
        detail: `JavaScript asset is ${(stat.size / 1024).toFixed(0)} KB raw (limit 150 KB raw)`,
        severity: "error",
        fix: "minify, split per-section assets, and load on demand; verify gzipped size separately (gzip is the real budget)",
      });
    }
  }

  const severityCounts = { error: 0, warning: 0, info: 0 };
  let total = 0;
  const categoryCounts = {};
  for (const [category, list] of Object.entries(findings)) {
    categoryCounts[category] = list.length;
    total += list.length;
    for (const f of list) severityCounts[f.severity]++;
  }

  return {
    meta: {
      tool: "theme-performance-engineer/scripts/audit-basics.mjs",
      version: VERSION,
      theme_root: root,
      generated_at: new Date().toISOString(),
      heuristics: [
        "Static checks only; confirm each finding in the file before fixing.",
        "missing_lazy_loading exempts the first img/iframe per file (assumed above the fold).",
        "Images inside Liquid/HTML comments are not stripped and may appear as false positives.",
        "Oversized-JS limit is raw bytes; gzip the file and compare against the real budget.",
        "External-asset allowlist covers cdn.shopify.com and cdn.shopifycloud.com; everything else is flagged.",
      ],
    },
    summary: {
      total_findings: total,
      by_severity: severityCounts,
      by_category: categoryCounts,
    },
    findings,
    next_steps: [
      "Verify current Theme Store performance requirements at https://shopify.dev/docs/storefronts/themes/store/requirements",
      "Run Lighthouse per checklists/lighthouse-run-checklist.md (home/product/collection, desktop+mobile, warm cache).",
      "Work through references/performance-checklist.md and record fixes in docs/performance-report.md.",
    ],
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(HELP + "\n");
    process.exit(0);
  }
  const root = path.resolve(args[0] ?? process.cwd());
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    usageError(`theme root not found or not a directory: ${root}`);
  }
  const result = audit(root);
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main();
