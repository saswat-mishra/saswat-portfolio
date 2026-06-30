/**
 * Per-route / per-article OG image generator.
 *   Run: node scripts/generate-og-images.mjs   (also runs as part of `npm run build`)
 *   Output: public/og-image.png (default/home) + public/og/<slug>.png (every
 *           service, case study, article, and index page).
 *
 * Runs in Node BEFORE `vite build`, so the PNGs exist in public/ and Vite copies
 * them into dist/. Reads content straight from src/content/* (the same data the
 * site renders) so OG images never drift from page titles. Brand fonts are
 * registered best-effort (Orbitron/JetBrains Mono); falls back to system fonts
 * on CI so the build never fails for a missing font.
 */
import { GlobalFonts, createCanvas } from '@napi-rs/canvas';
import { writeFileSync, mkdirSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { compileMarkdown } from '../plugins/vite-markdown.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pub = resolve(root, 'public');
const ogDir = resolve(pub, 'og');
mkdirSync(ogDir, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;

// ── Brand fonts (best-effort; system fallback on CI) ─────────────────────────
let TITLE_FONT = 'Arial, sans-serif';
let MONO_FONT = '"Courier New", monospace';
try {
  const reg = (file, name) => {
    try { return GlobalFonts.registerFromPath(resolve(pub, 'fonts', file), name); } catch { return false; }
  };
  if (reg('orbitron-800.woff2', 'OG Orbitron')) TITLE_FONT = 'OG Orbitron';
  if (reg('jetbrains-mono-500.woff2', 'OG Mono')) MONO_FONT = 'OG Mono';
} catch { /* keep system fallbacks */ }

// ── Helpers ──────────────────────────────────────────────────────────────────
function wrapLines(ctx, text, maxWidth, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  // If we ran out of lines, ellipsize the last one.
  const consumed = lines.join(' ').split(/\s+/).length;
  if (consumed < words.length && lines.length) {
    let last = lines[lines.length - 1];
    while (ctx.measureText(last + '…').width > maxWidth && last.length) last = last.slice(0, -1);
    lines[lines.length - 1] = last + '…';
  }
  return lines;
}

function titleSizeFor(text) {
  const n = String(text).length;
  if (n <= 38) return 66;
  if (n <= 60) return 56;
  if (n <= 90) return 46;
  return 40;
}

function drawCard({ file, kicker, title }) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#050510');
  bg.addColorStop(0.5, '#070b16');
  bg.addColorStop(1, '#04040e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Grid
  ctx.strokeStyle = 'rgba(0,255,65,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke(); }
  for (let y = 0; y <= HEIGHT; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke(); }

  // Glows
  const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 420);
  g1.addColorStop(0, 'rgba(0,255,65,0.12)'); g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const g2 = ctx.createRadialGradient(WIDTH, HEIGHT, 0, WIDTH, HEIGHT, 460);
  g2.addColorStop(0, 'rgba(0,212,255,0.12)'); g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Left accent bar
  ctx.fillStyle = '#00ff41';
  ctx.fillRect(0, 0, 8, HEIGHT);

  const PAD = 72;

  // Terminal prompt
  ctx.font = `500 20px ${MONO_FONT}`;
  ctx.fillStyle = 'rgba(0,255,65,0.7)';
  ctx.fillText('root@saswat:~$ saswatbuilds.com', PAD, 78);

  // Kicker
  ctx.font = `600 22px ${MONO_FONT}`;
  ctx.fillStyle = '#00d4ff';
  ctx.fillText(String(kicker).toUpperCase().slice(0, 60), PAD, 150);

  // Title (wrapped)
  const size = titleSizeFor(title);
  ctx.font = `800 ${size}px ${TITLE_FONT}`;
  ctx.fillStyle = '#ffffff';
  const lines = wrapLines(ctx, title, WIDTH - PAD * 2, 4);
  const lineH = size * 1.18;
  let y = 150 + 60;
  for (const ln of lines) { ctx.fillText(ln, PAD, y + size); y += lineH; }

  // Separator
  const sep = ctx.createLinearGradient(PAD, 0, WIDTH - PAD, 0);
  sep.addColorStop(0, 'rgba(0,255,65,0.8)'); sep.addColorStop(0.6, 'rgba(0,212,255,0.4)'); sep.addColorStop(1, 'transparent');
  ctx.strokeStyle = sep; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(PAD, HEIGHT - 96); ctx.lineTo(WIDTH - PAD, HEIGHT - 96); ctx.stroke();

  // Footer — name + role
  ctx.font = `700 26px ${TITLE_FONT}`;
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Saswat Mishra', PAD, HEIGHT - 50);
  ctx.font = `500 20px ${MONO_FONT}`;
  ctx.fillStyle = 'rgba(0,255,65,0.7)';
  ctx.fillText('AI Agent Developer · Senior ML Engineer · IIT Delhi', PAD, HEIGHT - 22);

  // Availability badge (bottom-right)
  const bx = WIDTH - 220, by = HEIGHT - 70, bw = 160, bh = 44;
  ctx.fillStyle = 'rgba(0,255,65,0.1)';
  ctx.strokeStyle = 'rgba(0,255,65,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 22); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#00ff41';
  ctx.beginPath(); ctx.arc(bx + 22, by + 22, 6, 0, Math.PI * 2); ctx.fill();
  ctx.font = `600 16px ${TITLE_FONT}`;
  ctx.fillText('Available', bx + 38, by + 28);

  writeFileSync(file, canvas.toBuffer('image/png'));
}

// ── Load content (same data the site renders) ────────────────────────────────
async function loadDir(rel) {
  const dir = resolve(root, rel);
  const files = (await readdir(dir)).filter((f) => f.endsWith('.js'));
  const out = [];
  for (const f of files) {
    const m = await import(pathToFileURL(resolve(dir, f)).href);
    if (m.default) out.push(m.default);
  }
  return out;
}

const services = await loadDir('src/content/services');
const work = await loadDir('src/content/work');
const blogJs = await loadDir('src/content/blog');
const mdFiles = (await readdir(resolve(root, 'src/content/blog/posts'))).filter((f) => f.endsWith('.md'));
const blogMd = [];
for (const f of mdFiles) blogMd.push(compileMarkdown(await readFile(resolve(root, 'src/content/blog/posts', f), 'utf8')));
const blog = [...blogJs, ...blogMd];

// ── Build the work list ──────────────────────────────────────────────────────
const cards = [
  { file: resolve(pub, 'og-image.png'), kicker: 'AI Agent Developer · IIT Delhi', title: 'Custom AI Agents, Voice AI & Automation' },
  { file: resolve(ogDir, 'about.png'), kicker: 'About', title: 'Saswat Mishra — AI Agent Developer' },
  { file: resolve(ogDir, 'services.png'), kicker: 'Services & Pricing', title: 'AI Agents, Voice AI, RAG & Automation' },
  { file: resolve(ogDir, 'work.png'), kicker: 'Case Studies', title: 'Shipped AI agent, voice & automation builds' },
  { file: resolve(ogDir, 'blog.png'), kicker: 'Blog', title: 'Field notes on building AI that ships' },
  { file: resolve(ogDir, 'contact.png'), kicker: 'Contact', title: 'Book a free 30-minute AI scoping call' },
  { file: resolve(ogDir, 'open-source.png'), kicker: 'Open Source', title: 'LangGraph & Voice AI starters (MIT)' },
  ...services.map((s) => ({ file: resolve(ogDir, `${s.slug}.png`), kicker: 'AI Service', title: s.hero?.headline || s.nav })),
  ...work.map((w) => ({ file: resolve(ogDir, `${w.slug}.png`), kicker: `Case Study · ${w.serviceName || ''}`, title: w.title })),
  ...blog.map((p) => ({ file: resolve(ogDir, `${p.slug}.png`), kicker: p.category || 'Article', title: p.title })),
];

for (const c of cards) drawCard(c);
console.log(`✅ Generated ${cards.length} OG images (fonts: ${TITLE_FONT} / ${MONO_FONT})`);
console.log(`   default → public/og-image.png · per-page → public/og/*.png`);
