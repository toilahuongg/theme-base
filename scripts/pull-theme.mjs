#!/usr/bin/env node
// pull-theme.mjs — download every file of a Shopify theme into ./themes/<name>/
// Uses the Admin GraphQL API `theme { files(...) }` connection.
// Requires an access token with the `read_themes` scope (custom app token).
// Zero dependencies: Node >= 18 (global fetch).
//
// Re-pull semantics: files are written to a temp sibling directory first, then
// atomically swapped into place. The previous snapshot is only replaced when
// its .pull-manifest.json matches the theme being pulled (or --force is given).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, existsSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// ---------- config ----------
function loadDotEnv(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let v = m[2].trim();
    if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function parseArgs(argv) {
  const flags = { list: false, force: false };
  for (const a of argv) {
    if (a === '--list') flags.list = true;
    else if (a === '--force') flags.force = true;
    else if (a === '--help' || a === '-h') return { help: true, flags };
    else {
      console.error(`Unknown argument: ${a}`);
      return { help: true, flags };
    }
  }
  return { help: false, flags };
}

// ---------- GraphQL ----------
async function gql(store, token, apiVersion, query, variables) {
  const endpoint = `https://${store}/admin/api/${apiVersion}/graphql.json`;
  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    });
  } catch (e) {
    throw new Error(`cannot reach ${endpoint}: ${e.message}`);
  }
  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
  }
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data;
}

const LIST_THEMES = `query { themes(first: 50) { edges { node { id name role } } } }`;

const FILES_QUERY = `#graphql
query ThemeFiles($themeId: ID!, $first: Int!, $after: String) {
  theme(id: $themeId) {
    files(first: $first, after: $after) {
      edges {
        cursor
        node {
          filename
          contentType
          size
          checksumMd5
          body {
            __typename
            ... on OnlineStoreThemeFileBodyText { content }
            ... on OnlineStoreThemeFileBodyBase64 { contentBase64 }
            ... on OnlineStoreThemeFileBodyUrl { url }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
      userErrors { code filename }
    }
  }
}`;

async function listThemes(store, token, apiVersion) {
  const data = await gql(store, token, apiVersion, LIST_THEMES, {});
  return data.themes.edges.map((e) => e.node);
}

async function themeMeta(store, token, apiVersion, id) {
  const data = await gql(store, token, apiVersion, `query ($id: ID!) { theme(id: $id) { name role } }`, { id });
  if (!data.theme) throw new Error(`Theme ${id} not found.`);
  return data.theme;
}

// The API may return fewer files than `first` when a page hits the payload
// limit, so we must keep paging on hasNextPage (never assume first == page size).
async function fetchAllFiles(store, token, apiVersion, themeIdGid) {
  const files = [];
  let after = null;
  let first = 250;
  for (let i = 0; i < 2000; i++) {
    let data;
    try {
      data = await gql(store, token, apiVersion, FILES_QUERY, { themeId: themeIdGid, first, after });
    } catch (e) {
      if (/payload|too large|limit|cost/i.test(e.message) && first > 25) {
        first = Math.floor(first / 2);
        console.warn(`  page too large, retrying with first=${first}`);
        continue;
      }
      throw e;
    }
    const conn = data.theme?.files;
    if (!conn) {
      throw new Error('Theme not found or files query unsupported. Check SHOPIFY_THEME_ID / SHOPIFY_API_VERSION.');
    }
    if (conn.userErrors?.length) throw new Error(`files userErrors: ${JSON.stringify(conn.userErrors)}`);
    files.push(...conn.edges.map((e) => e.node));
    if (!conn.pageInfo.hasNextPage) return files;
    const next = conn.pageInfo.endCursor;
    if (!next || next === after) throw new Error('Pagination stalled: hasNextPage without an advancing cursor.');
    after = next;
  }
  throw new Error('Too many pages (possible infinite loop).');
}

// ---------- body union -> Buffer ----------
async function bodyToBuffer(body) {
  switch (body?.__typename) {
    case 'OnlineStoreThemeFileBodyText':
      return Buffer.from(body.content ?? '', 'utf8');
    case 'OnlineStoreThemeFileBodyBase64':
      return Buffer.from(body.contentBase64 ?? '', 'base64');
    case 'OnlineStoreThemeFileBodyUrl': {
      const res = await fetch(body.url);
      if (!res.ok) throw new Error(`body URL fetch failed: HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    }
    default:
      return null; // unsupported / metadata-only entry
  }
}

// ---------- path safety ----------
function safeRel(filename) {
  if (!filename || typeof filename !== 'string') return null;
  if (filename.includes('\\') || filename.includes('..') || filename.startsWith('/') || /^[A-Za-z]:/.test(filename)) {
    return null;
  }
  return filename;
}

// Shopify serves some JSON assets (settings_data.json, locale files) with a
// fixed auto-generated banner comment injected on top and a reformatted body,
// so its size/checksum describe a source representation the returned Text body
// cannot reproduce. Returns the body with that banner removed, or null when
// the text does not start with Shopify's exact banner (an unterminated banner
// is also null — never a silently truncated string).
const GENERATED_BANNER = /^\/\*[\s\S]*?The contents of this file are auto-generated[\s\S]*?\*\//;
function stripGeneratedBanner(text) {
  const m = text.match(GENERATED_BANNER);
  if (!m) return null;
  return text.slice(m[0].length).replace(/^\r?\n/, '');
}

// Verification. Base64/URL bodies and ordinary text must be byte-exact (size +
// checksum when Shopify provides one) — a mismatch there is real corruption.
// A Text *.json that fails byte-exact is exempted ONLY when it starts with
// Shopify's auto-generated banner AND still parses as JSON with the banner
// removed; any other .json failing byte checks is a hard failure, so a genuine
// mismatch can never hide behind "it parses".
function verifyFile(f, buf, btype) {
  // OnlineStoreThemeFile.size is UnsignedInt64, often serialized as a string.
  const sizeMatch =
    f.size != null ? (() => { try { return BigInt(buf.length) === BigInt(f.size); } catch { return false; } })() : null;
  const md5Match = f.checksumMd5 ? createHash('md5').update(buf).digest('hex') === f.checksumMd5 : null;
  const byteOk = sizeMatch !== false && md5Match !== false && (sizeMatch !== null || md5Match !== null);
  if (byteOk) return { ok: true, level: 'bytes' };

  if (btype === 'OnlineStoreThemeFileBodyText' && /\.json$/i.test(f.filename)) {
    const stripped = stripGeneratedBanner(buf.toString('utf8'));
    if (stripped !== null) {
      try {
        JSON.parse(stripped);
        return { ok: true, level: 'json' };
      } catch { /* not parseable → hard failure below */ }
    }
  }

  const bits = [];
  if (sizeMatch === false) bits.push(`size expected ${f.size}, got ${buf.length}`);
  if (md5Match === false) bits.push(`md5 expected ${f.checksumMd5}, got ${createHash('md5').update(buf).digest('hex')}`);
  if (!bits.length) bits.push('no size or checksum metadata to verify against');
  return { ok: false, reason: bits.join('; ') };
}

// ---------- atomic swap ----------
// Moves tempDir (a fully-written new snapshot) into dest. Only replaces dest
// when its existing .pull-manifest.json belongs to the same themeIdGid; a
// foreign/unmanaged dir is left untouched unless force is set. Never touches
// anything outside dest itself.
export function swapIntoPlace(dest, tempDir, themeIdGid, { force = false } = {}) {
  const hasDest = existsSync(dest);
  if (hasDest) {
    if (!statSync(dest).isDirectory()) {
      throw new Error(`Destination ${dest} exists but is not a directory. Remove it or set SHOPIFY_OUTPUT_DIR.`);
    }
    let existing = null;
    try {
      existing = JSON.parse(readFileSync(path.join(dest, '.pull-manifest.json'), 'utf8'));
    } catch {
      /* no readable manifest */
    }
    const matches = !!existing && existing.themeId === themeIdGid;
    if (!matches && !force) {
      throw new Error(
        `Destination ${dest} already exists but its manifest does not match theme ${themeIdGid} ` +
          `(found: ${existing?.themeId ?? 'no manifest'}). Remove it manually or re-run with --force.`
      );
    }
    const backup = path.join(path.dirname(dest), `.tmp-${path.basename(dest)}-${randomUUID()}.old`);
    renameSync(dest, backup);
    try {
      renameSync(tempDir, dest);
    } catch (e) {
      renameSync(backup, dest); // restore the untouched old snapshot
      throw e;
    }
    rmSync(backup, { recursive: true, force: true });
  } else {
    renameSync(tempDir, dest);
  }
}

// ---------- main ----------
let ACTIVE_TEMP = null;

async function main() {
  const { help, flags } = parseArgs(process.argv.slice(2));
  if (help) {
    printHelp();
    return;
  }

  const env = { ...loadDotEnv(path.join(ROOT, '.env')), ...process.env };
  const store = env.SHOPIFY_STORE;
  const token = env.SHOPIFY_ACCESS_TOKEN;
  const themeId = env.SHOPIFY_THEME_ID;
  const apiVersion = env.SHOPIFY_API_VERSION || '2026-07';
  const outputDir = env.SHOPIFY_OUTPUT_DIR || path.join(ROOT, 'themes');

  if (!store || !token) {
    console.error(
      [
        'Missing configuration.',
        '',
        'Create a .env file in the repo root (it is gitignored), from .env.example:',
        '  SHOPIFY_STORE=your-store.myshopify.com',
        '  SHOPIFY_ACCESS_TOKEN=shpat_xxx   (custom app token with read_themes scope)',
        '',
        'Optional: SHOPIFY_THEME_ID (defaults to the MAIN theme),',
        '          SHOPIFY_API_VERSION (default 2026-07),',
        '          SHOPIFY_OUTPUT_DIR (default ./themes/<theme-name>).',
      ].join('\n')
    );
    process.exit(1);
  }

  if (flags.list) {
    const themes = await listThemes(store, token, apiVersion);
    if (!themes.length) {
      console.log('No themes found on this store.');
      return;
    }
    console.log('THEME_ID\tROLE\tNAME');
    for (const t of themes) {
      console.log(`${t.id.replace(/^gid:\/\/shopify\/OnlineStoreTheme\//, '')}\t${t.role}\t${t.name}`);
    }
    return;
  }

  let themeIdGid;
  if (themeId) {
    themeIdGid = /^\d+$/.test(themeId) ? `gid://shopify/OnlineStoreTheme/${themeId}` : themeId;
  } else {
    const themes = await listThemes(store, token, apiVersion);
    if (!themes.length) throw new Error('Store returned no themes. Check SHOPIFY_STORE and token scope (read_themes).');
    console.log(`Themes on store: ${themes.map((t) => `${t.name} [${t.role}]`).join(', ')}`);
    const main = themes.find((t) => t.role === 'MAIN') ?? themes[0];
    console.log(`Using ${main.name} [${main.role}] — set SHOPIFY_THEME_ID to override.`);
    themeIdGid = main.id;
  }

  const meta = await themeMeta(store, token, apiVersion, themeIdGid);
  const slug =
    (meta.name || 'theme').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'theme';
  const dest = path.join(outputDir, slug);

  // Pull into a temp sibling so a failed pull never corrupts the current snapshot.
  mkdirSync(outputDir, { recursive: true });
  // Reap only our own crashed-run leftovers: dirs that carry our marker file
  // AND are older than 24h. Never touches user dirs or a concurrent pull's temp.
  const STALE_MS = 24 * 60 * 60 * 1000;
  for (const entry of readdirSync(outputDir)) {
    if (!entry.startsWith('.tmp-')) continue;
    const p = path.join(outputDir, entry);
    try {
      if (existsSync(path.join(p, '.pull-tmp.json')) && Date.now() - statSync(p).mtimeMs > STALE_MS) {
        rmSync(p, { recursive: true, force: true });
      }
    } catch {
      /* entry vanished or unreadable — leave it alone */
    }
  }
  const tempDir = path.join(outputDir, `.tmp-${slug}-${randomUUID()}`);
  ACTIVE_TEMP = tempDir;
  mkdirSync(tempDir, { recursive: true });
  writeFileSync(
    path.join(tempDir, '.pull-tmp.json'),
    JSON.stringify({ themeId: themeIdGid, pid: process.pid, startedAt: new Date().toISOString() })
  );
  console.log(`Pulling ${meta.name} [${meta.role}] (${themeIdGid}) -> ${dest}`);

  const files = await fetchAllFiles(store, token, apiVersion, themeIdGid);
  const manifestFiles = [];
  const problems = []; // unverified files: skips + checksum mismatches
  let written = 0;
  let bytes = 0;
  let aborted = null;

  for (const f of files) {
    const rel = safeRel(f.filename);
    if (!rel) {
      problems.push({ filename: f.filename, reason: 'unsafe filename' });
      continue;
    }
    const out = path.join(tempDir, rel);
    try {
      const btype = f.body?.__typename;
      const buf = await bodyToBuffer(f.body);
      if (!buf) {
        problems.push({ filename: f.filename, reason: `unsupported body type: ${btype ?? 'null'}` });
        continue;
      }
      mkdirSync(path.dirname(out), { recursive: true });
      writeFileSync(out, buf);
      const v = verifyFile(f, buf, btype);
      if (!v.ok) {
        problems.push({ filename: f.filename, reason: v.reason });
        continue; // written to temp but not verified — not counted
      }
      bytes += buf.length;
      manifestFiles.push({
        filename: f.filename,
        size: f.size,
        contentType: f.contentType,
        checksumMd5: f.checksumMd5,
        verified: v.level,
      });
      written++;
    } catch (e) {
      aborted = `${f.filename}: ${e.message}`;
      console.error(`  FAILED: ${f.filename} (${e.message})`);
      break; // abort the pull; old snapshot stays in place
    }
  }

  if (aborted) {
    rmSync(tempDir, { recursive: true, force: true });
    ACTIVE_TEMP = null;
    throw new Error(`Pull aborted (${aborted}). Previous snapshot untouched; re-run after fixing.`);
  }

  if (problems.length > 0) {
    if (!flags.force) {
      rmSync(tempDir, { recursive: true, force: true });
      ACTIVE_TEMP = null;
      const detail = problems.slice(0, 10).map((p) => `  ${p.filename}: ${p.reason}`).join('\n');
      throw new Error(
        `Pull incomplete: ${problems.length} file(s) not verified:\n${detail}${problems.length > 10 ? '\n  …' : ''}\n` +
          `Snapshot NOT replaced. Fix the cause, or re-run with --force to accept the partial snapshot.`
      );
    }
    console.warn(
      `WARNING: --force given — keeping ${problems.length} unverified file(s) in the snapshot (${problems
        .slice(0, 3)
        .map((p) => p.filename)
        .join(', ')}…).`
    );
  }

  rmSync(path.join(tempDir, '.pull-tmp.json'), { force: true }); // marker is temp-only
  const manifest = {
    themeId: themeIdGid,
    themeName: meta.name,
    role: meta.role,
    apiVersion,
    pulledAt: new Date().toISOString(),
    files: manifestFiles,
    skipped: problems,
  };
  writeFileSync(path.join(tempDir, '.pull-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  swapIntoPlace(dest, tempDir, themeIdGid, { force: flags.force });
  ACTIVE_TEMP = null;

  const mb = (bytes / 1024 / 1024).toFixed(2);
  const jsonCount = manifestFiles.filter((x) => x.verified === 'json').length;
  console.log(
    `Done: ${written}/${files.length} files, ${mb} MB -> ${dest} ` +
      `(${written - jsonCount} byte-verified, ${jsonCount} json-parse verified)` +
      (problems.length ? `\nUnverified ${problems.length}: ${problems.map((p) => `${p.filename} (${p.reason})`).join(', ')}` : '')
  );
  console.log('Manifest: ' + path.join(dest, '.pull-manifest.json'));
}

function printHelp() {
  console.log(
    [
      'Usage: node scripts/pull-theme.mjs [--list] [--force]',
      '',
      'Download every file of a Shopify theme into ./themes/<theme-name>/ via the',
      'Admin GraphQL API. Needs an access token with the read_themes scope.',
      '',
      'Re-pull is atomic: a new snapshot is written to a temp dir and swapped in',
      'only when every file is verified — byte-exact (size + checksum when Shopify',
      'provides one), or parse-validated JSON that carries Shopify\'s auto-generated',
      'banner. A partial or unverified pull exits non-zero and leaves the old',
      'snapshot untouched.',
      '',
      'Config from .env (gitignored) or environment:',
      '  SHOPIFY_STORE=your-store.myshopify.com   (required)',
      '  SHOPIFY_ACCESS_TOKEN=shpat_...           (required, read_themes scope)',
      '  SHOPIFY_THEME_ID=<id>                    (optional; defaults to MAIN theme)',
      '  SHOPIFY_API_VERSION=2026-07              (optional)',
      '  SHOPIFY_OUTPUT_DIR=./themes              (optional)',
      '',
      'Flags:',
      '  --list   list themes on the store, then exit',
      '  --force  accept a partial/unverified pull, or replace a destination whose',
      '           manifest does not match this theme',
    ].join('\n')
  );
}

// Run only when executed directly (keeps the module importable for tests).
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      if (ACTIVE_TEMP) rmSync(ACTIVE_TEMP, { recursive: true, force: true });
      console.error(`Error: ${e.message}`);
      process.exit(1);
    });
}
