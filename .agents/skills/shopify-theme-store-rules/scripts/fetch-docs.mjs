#!/usr/bin/env node
// fetch-docs.mjs — fetch Shopify theme requirement documentation as readable text.
//
// Usage:
//   node fetch-docs.mjs [url...]
//
// Defaults (when no URLs are given) to the two mandatory Theme Store start URLs.
// Each source is saved to <theme-root>/docs/compliance-sources/<slug>.txt.
// Theme root defaults to the current working directory; override with THEME_ROOT.
// Prints a summary table of HTTP status codes and byte sizes.
//
// Requires Node.js 18+ (global fetch).

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_URLS = [
  'https://shopify.dev/docs/storefronts/themes/store/requirements',
  'https://shopify.dev/docs/storefronts/themes/architecture',
];

const THEME_ROOT = process.env.THEME_ROOT || process.cwd();
const OUT_DIR = path.join(THEME_ROOT, 'docs', 'compliance-sources');
const TODAY = new Date().toISOString().slice(0, 10);

const args = process.argv.slice(2);

function printUsage() {
  console.log(`Usage: node fetch-docs.mjs [url...]

Fetches Shopify theme requirement documentation, strips HTML to readable text,
and saves each source to:
  <theme-root>/docs/compliance-sources/<slug>.txt

Defaults (when no URLs are given):
${DEFAULT_URLS.map((u) => `  ${u}`).join('\n')}

Options:
  THEME_ROOT=<dir>   theme root (defaults to the current working directory)
  -h, --help         show this help

Output: a summary table of HTTP status codes and byte sizes per URL.`);
}

if (args.includes('-h') || args.includes('--help')) {
  printUsage();
  process.exit(0);
}

const urls = args.length > 0 ? args : DEFAULT_URLS;

function slugFromUrl(url) {
  let pathname;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return null;
  }
  const base = pathname.replace(/\/+$/, '').split('/').pop() || 'index';
  const slug = base
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return slug || 'index';
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

async function fetchSource(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'shopify-theme-factory-compliance/1.0' },
    redirect: 'follow',
  });
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || '';
  let text = buf.toString('utf8');
  if (/text\/html/i.test(contentType)) {
    text = stripHtml(text);
  }
  return { status: res.status, text, size: Buffer.byteLength(text) };
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const results = [];
for (const url of urls) {
  const slug = slugFromUrl(url);
  if (!slug) {
    results.push({ url, slug: 'invalid-url', status: 'ERR', size: 0 });
    console.error(`Skipping invalid URL: ${url}`);
    continue;
  }
  try {
    const { status, text, size } = await fetchSource(url);
    const file = path.join(OUT_DIR, `${slug}.txt`);
    fs.writeFileSync(file, text, 'utf8');
    results.push({ url, slug, status, size });
  } catch (err) {
    results.push({ url, slug, status: 'ERR', size: 0 });
    console.error(`Failed to fetch ${url}: ${err.message}`);
  }
}

const statusPad = Math.max(...results.map((r) => String(r.status).length), 6);
const slugPad = Math.max(...results.map((r) => r.slug.length), 4);
const sizePad = Math.max(...results.map((r) => String(r.size).length), 5);

console.log('\nCompliance source fetch summary');
console.log(`As-of date: ${TODAY}`);
console.log(`Output dir: ${OUT_DIR}`);
console.log('-'.repeat(statusPad + slugPad + sizePad + 20));
console.log(
  `${'STATUS'.padEnd(statusPad)}  ${'SLUG'.padEnd(slugPad)}  ${'BYTES'.padStart(sizePad)}  URL`
);
console.log('-'.repeat(statusPad + slugPad + sizePad + 20));
for (const r of results) {
  console.log(
    `${String(r.status).padEnd(statusPad)}  ${r.slug.padEnd(slugPad)}  ${String(r.size).padStart(sizePad)}  ${r.url}`
  );
}
console.log('-'.repeat(statusPad + slugPad + sizePad + 20));

const ok = results.filter((r) => r.status === 200).length;
const failed = results.filter((r) => r.status !== 200).length;
console.log(`${ok} of ${results.length} sources fetched successfully.`);
if (failed > 0) {
  console.log(`${failed} source(s) failed. Retry once; if still failing, mark affected matrix rows "unverified - fetch failed".`);
  process.exitCode = 1;
} else {
  console.log('Read the saved text files for the exact wording of every standard you assert.');
}
