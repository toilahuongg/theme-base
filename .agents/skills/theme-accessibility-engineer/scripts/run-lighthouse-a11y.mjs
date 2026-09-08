#!/usr/bin/env node
// run-lighthouse-a11y.mjs
// Batch Lighthouse accessibility audits for a Shopify theme storefront.
//
// Usage:
//   node run-lighthouse-a11y.mjs https://store.example.myshopify.com \
//     --routes "/ /collections/all /cart /search" --min-score 90 --out-dir docs/lighthouse-a11y
//
// Behavior:
//   - Runs the Lighthouse "accessibility" category on every route.
//   - Writes per-route Lighthouse JSON to <out-dir>.
//   - Prints a markdown table and a JSON summary to stdout.
//   - Exit code 0 only when every route meets --min-score.
//
// Prerequisites: Node.js 18+, Google Chrome installed. Lighthouse is fetched
// via `npx --yes lighthouse` on first run.

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const USAGE = `Usage:
  node run-lighthouse-a11y.mjs <base-url> [options]

Options:
  --routes "r1 r2"     Space-separated routes (default: / /collections/all /cart /search)
  --min-score <n>      Failing threshold, 0-100 (default: 90)
  --out-dir <dir>      Directory for per-route Lighthouse JSON (default: docs/lighthouse-a11y)
  --quiet              Suppress per-route failing-audit detail in the summary
  --help               Show this help
`;

function parseArgs(argv) {
  const args = {
    baseUrl: null,
    routes: null,
    minScore: 90,
    outDir: 'docs/lighthouse-a11y',
    quiet: false,
  };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help') {
      console.log(USAGE);
      process.exit(0);
    }
    if (arg === '--quiet') {
      args.quiet = true;
      continue;
    }
    if (arg === '--routes') {
      args.routes = argv[++i].split(/\s+/).filter(Boolean);
      continue;
    }
    if (arg === '--min-score') {
      args.minScore = Number(argv[++i]);
      continue;
    }
    if (arg === '--out-dir') {
      args.outDir = argv[++i];
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}\n\n${USAGE}`);
      process.exit(2);
    }
    positional.push(arg);
  }
  if (positional.length === 0) {
    console.error(`Missing <base-url>\n\n${USAGE}`);
    process.exit(2);
  }
  args.baseUrl = positional[0];
  if (!args.routes) args.routes = ['/', '/collections/all', '/cart', '/search'];
  return args;
}

function auditRoute(url, outDir, index) {
  const outFile = join(outDir, `route-${String(index).padStart(2, '0')}.json`);
  const result = spawnSync(
    'npx',
    [
      '--yes',
      'lighthouse',
      url,
      '--only-categories=accessibility',
      '--output=json',
      `--output-path=${outFile}`,
      '--quiet',
      '--chrome-flags=--headless --no-sandbox',
    ],
    { stdio: ['ignore', 'inherit', 'inherit'] },
  );
  if (result.status !== 0) {
    console.error(
      `Lighthouse failed for ${url} (exit ${result.status}). Is Chrome installed and is the storefront reachable?`,
    );
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(outFile, 'utf8'));
  return { outFile, raw };
}

const args = parseArgs(process.argv.slice(2));
const outDir = resolve(args.outDir);
mkdirSync(outDir, { recursive: true });

const results = [];
for (const [index, route] of args.routes.entries()) {
  const url = route.startsWith('http')
    ? route
    : `${args.baseUrl.replace(/\/+$/, '')}${route}`;
  console.error(`Auditing ${url} ...`);
  const { outFile, raw } = auditRoute(url, outDir, index);
  const score = raw.categories?.accessibility?.score ?? null;
  const failing = Object.values(raw.audits ?? {})
    .filter(
      (audit) =>
        audit.score !== null &&
        audit.score < 1 &&
        audit.scoreDisplayMode !== 'notApplicable' &&
        audit.scoreDisplayMode !== 'informative',
    )
    .map((audit) => audit.id);
  results.push({
    route,
    url,
    score: score === null ? null : Math.round(score * 100),
    failing,
    outFile,
  });
}

console.log('\n| Route | Score | Failing audits |');
console.log('| --- | --- | --- |');
for (const r of results) {
  const detail = args.quiet || r.failing.length === 0 ? '-' : r.failing.join(', ');
  console.log(`| ${r.route} | ${r.score ?? 'n/a'} | ${detail} |`);
}

const summary = {
  baseUrl: args.baseUrl,
  minScore: args.minScore,
  thresholdMet: results.every((r) => r.score !== null && r.score >= args.minScore),
  results: results.map(({ route, score, failing, outFile }) => ({
    route,
    score,
    failingAudits: failing,
    outputFile: outFile,
  })),
};
console.log(`\n${JSON.stringify(summary, null, 2)}`);

const failed = results.filter((r) => r.score === null || r.score < args.minScore);
process.exit(failed.length === 0 ? 0 : 1);
