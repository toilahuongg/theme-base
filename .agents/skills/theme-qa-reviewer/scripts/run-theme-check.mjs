#!/usr/bin/env node
/**
 * run-theme-check.mjs — summarize `shopify theme check` output for the readiness report.
 *
 * Usage:
 *   node run-theme-check.mjs [theme-root] [check-output.json]
 *
 *   theme-root       Shopify theme root to check (default: current directory).
 *   check-output.json  Optional path to a saved `shopify theme check --output json`
 *                    file. When given, the CLI is not invoked; the file is parsed.
 *
 * When no JSON file is given, runs:
 *   shopify theme check --output json
 * inside the theme root and summarizes the result.
 *
 * Output: a compact severity table plus the top failures (code, file:line, message),
 * suitable for pasting into docs/readiness-report.md section 1.
 *
 * Exit codes:
 *   0  check ran (or file parsed) and the summary was produced with zero errors
 *   1  check ran and errors were found (level 0 findings)
 *   2  Shopify CLI not found; no check could be run
 *   3  could not produce a summary (invalid/missing JSON input)
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const LEVELS = {
  0: { label: "ERROR", short: "E" },
  1: { label: "WARNING", short: "W" },
  2: { label: "INFO", short: "I" },
  3: { label: "SUGGESTION", short: "S" },
};

function fail(message, code) {
  console.error(message);
  process.exit(code);
}

function looksLikeThemeRoot(dir) {
  return (
    existsSync(join(dir, "layout")) ||
    existsSync(join(dir, "templates")) ||
    existsSync(join(dir, "config"))
  );
}

function extractFindings(data) {
  const findings = [];
  const checks = data?.themeCheck?.checks ?? data?.checks ?? {};
  for (const category of Object.values(checks)) {
    if (!Array.isArray(category)) continue;
    for (const f of category) {
      const level = typeof f.level === "number" ? f.level : 1;
      findings.push({
        code: f.code ?? "UNKNOWN",
        level,
        path: f.path ?? "",
        line: f.start?.line ?? f.line ?? 0,
        message: (f.message ?? "").replace(/\s+/g, " ").trim(),
      });
    }
  }
  return findings;
}

function summarize(data) {
  const s = data?.themeCheck?.summary ?? data?.summary ?? {};
  return {
    total: s.total ?? 0,
    errors: s.errors ?? 0,
    warnings: s.warnings ?? 0,
    info: s.info ?? 0,
    suggestions: s.suggestions ?? 0,
  };
}

function pad(str, width) {
  str = String(str);
  return str.length >= width ? str : str + " ".repeat(width - str.length);
}

function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max - 3) + "...";
}

function printTable(rows, widths) {
  for (const row of rows) {
    console.log(
      "  " + row.map((cell, i) => pad(cell, widths[i])).join(" | ").trimEnd()
    );
  }
}

function printSummary(themeRoot, summary, findings, source) {
  const rule = "=".repeat(72);
  console.log(rule);
  console.log("THEME CHECK SUMMARY — theme-qa-reviewer");
  console.log(rule);
  console.log(`Theme root : ${themeRoot}`);
  console.log(`Source     : ${source}`);
  console.log(`Generated  : ${new Date().toISOString()}`);
  console.log("");

  const sevRows = [
    ["Severity", "Count"],
    ["errors", String(summary.errors)],
    ["warnings", String(summary.warnings)],
    ["info", String(summary.info)],
    ["suggestions", String(summary.suggestions)],
    ["total", String(summary.total)],
  ];
  const sevWidth = Math.max(...sevRows.map((r) => r[0].length)) + 2;
  console.log("Severity counts:");
  for (const [k, v] of sevRows) console.log(`  ${pad(k, sevWidth)} ${v}`);
  console.log("");

  const byLevel = (lvl) => findings.filter((f) => f.level === lvl);
  const top = [
    ...byLevel(0).map((f) => ({ ...f, label: LEVELS[0].label })),
    ...byLevel(1).map((f) => ({ ...f, label: LEVELS[1].label })),
    ...byLevel(2).map((f) => ({ ...f, label: LEVELS[2].label })),
    ...byLevel(3).map((f) => ({ ...f, label: LEVELS[3].label })),
  ]
    .sort((a, b) => a.level - b.level || a.path.localeCompare(b.path))
    .slice(0, 15);

  if (top.length === 0) {
    console.log("Findings: none.");
  } else {
    console.log(`Top failures (${Math.min(top.length, 15)} shown):`);
    const rows = [
      ["SEVERITY", "CODE", "FILE:LINE", "MESSAGE"],
      ...top.map((f) => [
        f.label,
        f.code,
        `${f.path}:${f.line}`,
        truncate(f.message, 88),
      ]),
    ];
    const widths = [
      Math.max(...rows.map((r) => r[0].length)),
      Math.max(...rows.map((r) => r[1].length)) + 2,
      Math.max(...rows.map((r) => r[2].length)) + 2,
      Math.max(...rows.map((r) => r[3].length)) + 2,
    ];
    printTable(rows, widths);
  }
  console.log("");
  console.log(
    summary.errors > 0
      ? `VERDICT FOR REPORT: ${summary.errors} error(s) found — these are BLOCKERS unless justified.`
      : "VERDICT FOR REPORT: zero errors — theme check gate passes."
  );
  console.log(rule);
}

function parseJson(text, what) {
  try {
    return JSON.parse(text);
  } catch {
    // Defensive: the CLI occasionally prefixes output with banners.
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        /* fall through */
      }
    }
    fail(
      `Could not parse ${what} as JSON. Raw output (first 2000 chars):\n${truncate(text, 2000)}`,
      3
    );
  }
}

function main() {
  const args = process.argv.slice(2);
  const themeRoot = resolve(args[0] ?? process.cwd());
  const jsonFile = args[1] ? resolve(args[1]) : null;

  if (!looksLikeThemeRoot(themeRoot)) {
    console.warn(
      `Warning: ${themeRoot} does not look like a Shopify theme root (no layout/, templates/, or config/ directory). Proceeding anyway.`
    );
  }

  if (jsonFile) {
    if (!existsSync(jsonFile)) {
      fail(`Provided JSON file does not exist: ${jsonFile}`, 3);
    }
    const text = readFileSync(jsonFile, "utf8");
    const data = parseJson(text, jsonFile);
    const summary = summarize(data);
    const findings = extractFindings(data);
    printSummary(themeRoot, summary, findings, jsonFile);
    process.exit(summary.errors > 0 ? 1 : 0);
  }

  const check = spawnSync(
    "shopify",
    ["theme", "check", "--output", "json"],
    { cwd: themeRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );

  if (check.error && check.error.code === "ENOENT") {
    fail(
      [
        "Shopify CLI not found on PATH; could not run theme check.",
        "Install it per https://shopify.dev/docs/storefronts/themes/tools/theme-check",
        "then re-run:  node run-theme-check.mjs " + themeRoot,
        "Alternatively, run `shopify theme check --output json > check.json` elsewhere",
        "and pass the file:  node run-theme-check.mjs " + themeRoot + " check.json",
      ].join("\n"),
      2
    );
  }

  if (check.stdout && check.stdout.trim().length > 0) {
    const data = parseJson(check.stdout, "theme check output");
    const summary = summarize(data);
    const findings = extractFindings(data);
    printSummary(themeRoot, summary, findings, "fresh `shopify theme check --output json` run");
    process.exit(summary.errors > 0 ? 1 : 0);
  }

  const stderr = (check.stderr ?? "").trim();
  if (stderr) {
    fail(
      [
        "Theme check produced no JSON output. This usually means the Shopify CLI",
        "failed to start (for example, an unsupported Node version or missing",
        "dependencies). Check the CLI with `shopify version` and the Node version",
        "your setup requires, or produce the JSON another way and pass the file:",
        "  node run-theme-check.mjs " + themeRoot + " check.json",
        "Stderr:",
        truncate(stderr, 2000),
      ].join("\n"),
      3
    );
  }
  fail("Theme check produced no output (exit status " + (check.status ?? "unknown") + ").", 3);
}

main();
