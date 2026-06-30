/**
 * Per-route JavaScript performance budget (runs in `npm run build`, after the
 * client build). Reads dist/.vite/manifest.json, and for each route component
 * computes the transitive STATIC JS it ships = the shared app shell (main entry
 * graph) ∪ the route chunk's own import graph. Fails the build (exit 1) if any
 * route exceeds its gzipped budget.
 *
 * This also enforces the code-splitting law structurally: Three.js is only ever
 * statically reachable from Home, so if it leaked into another route's graph,
 * that route would blow past the shell budget and fail here.
 */
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

// Gzipped budgets in KB. Home carries the hero shell; every other route shares
// the same lean shell + a small route chunk. Headroom is ~30% over current.
const BUDGET_KB = { 'src/routes/Home.jsx': 260, default: 200 };

const manifest = JSON.parse(await readFile(path.join(distDir, '.vite', 'manifest.json'), 'utf8'));

// Transitive static import closure of a manifest key.
function closure(key, seen = new Set()) {
  const e = manifest[key];
  if (!e || seen.has(key)) return seen;
  seen.add(key);
  for (const imp of e.imports || []) closure(imp, seen);
  return seen;
}

const sizeCache = new Map();
async function gzipSize(file) {
  if (sizeCache.has(file)) return sizeCache.get(file);
  const buf = await readFile(path.join(distDir, file));
  const n = gzipSync(buf).length;
  sizeCache.set(file, n);
  return n;
}
async function jsSize(keys) {
  let total = 0;
  for (const k of keys) {
    const f = manifest[k]?.file;
    if (f && f.endsWith('.js')) total += await gzipSize(f);
  }
  return total;
}

const mainKey =
  Object.keys(manifest).find((k) => manifest[k].isEntry && /main\.jsx$/.test(k)) ||
  Object.keys(manifest).find((k) => manifest[k].isEntry);
const shared = closure(mainKey);
const sharedKB = (await jsSize(shared)) / 1024;

const routeKeys = Object.keys(manifest)
  .filter((k) => /^src\/routes\/.*\.jsx$/.test(k))
  .sort();

let failed = 0;
const rows = [];
for (const rk of routeKeys) {
  const union = closure(rk, new Set(shared));
  const kb = (await jsSize(union)) / 1024;
  const budget = BUDGET_KB[rk] ?? BUDGET_KB.default;
  const over = kb > budget;
  if (over) failed++;
  rows.push({ route: rk.replace('src/routes/', '').replace('.jsx', ''), kb: kb.toFixed(1), budget, over });
}

console.log(`\nPer-route JS budget (gzipped, shell = ${sharedKB.toFixed(1)} KB shared):`);
for (const r of rows) {
  console.log(`  ${r.over ? '✗' : '✓'} ${r.route.padEnd(18)} ${String(r.kb).padStart(7)} KB / ${r.budget} KB`);
}
if (failed) {
  console.error(`\n❌ budget: ${failed} route(s) over budget`);
  process.exit(1);
}
console.log(`\n✓ budget: all ${rows.length} routes within budget`);
