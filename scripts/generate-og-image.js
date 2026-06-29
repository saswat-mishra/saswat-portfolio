/**
 * OG Image Generator for Saswat Mishra Portfolio
 * Generates a 1200×630px PNG social preview image
 * Run: node scripts/generate-og-image.js
 * Output: public/og-image.png
 *
 * Dependencies: npm install @napi-rs/canvas --save-dev
 * OR use the SVG fallback (public/og-image.svg) if canvas is unavailable
 */

import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// ── Background ──────────────────────────────────────────────────────────────
// Deep dark background matching the portfolio aesthetic
const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
bgGrad.addColorStop(0, '#050510');
bgGrad.addColorStop(0.5, '#0a0a1f');
bgGrad.addColorStop(1, '#060614');
ctx.fillStyle = bgGrad;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// ── Grid pattern ─────────────────────────────────────────────────────────────
ctx.strokeStyle = 'rgba(0, 255, 65, 0.06)';
ctx.lineWidth = 1;
const gridSize = 40;
for (let x = 0; x <= WIDTH; x += gridSize) {
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
}
for (let y = 0; y <= HEIGHT; y += gridSize) {
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
}

// ── Glow accent — top-left ────────────────────────────────────────────────
const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
glow1.addColorStop(0, 'rgba(0, 255, 65, 0.12)');
glow1.addColorStop(1, 'transparent');
ctx.fillStyle = glow1;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// ── Glow accent — bottom-right ────────────────────────────────────────────
const glow2 = ctx.createRadialGradient(WIDTH, HEIGHT, 0, WIDTH, HEIGHT, 450);
glow2.addColorStop(0, 'rgba(99, 102, 241, 0.14)');
glow2.addColorStop(1, 'transparent');
ctx.fillStyle = glow2;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// ── Terminal prompt top-left ──────────────────────────────────────────────
ctx.font = '500 18px "Courier New", monospace';
ctx.fillStyle = 'rgba(0, 255, 65, 0.7)';
ctx.fillText('root@saswat:~$ ./portfolio.exe', 60, 80);

// ── Blinking cursor ───────────────────────────────────────────────────────
ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
ctx.fillRect(422, 64, 14, 22);

// ── Name ─────────────────────────────────────────────────────────────────
ctx.font = 'bold 72px Arial, sans-serif';
ctx.fillStyle = '#ffffff';
ctx.fillText('Saswat Mishra', 60, 210);

// ── Title ─────────────────────────────────────────────────────────────────
const titleGrad = ctx.createLinearGradient(60, 230, 700, 270);
titleGrad.addColorStop(0, '#00ff41');
titleGrad.addColorStop(0.5, '#00d4ff');
titleGrad.addColorStop(1, '#6366f1');
ctx.font = '500 32px Arial, sans-serif';
ctx.fillStyle = titleGrad;
ctx.fillText('AI Agent Developer  ·  ML Engineer  ·  IIT Delhi', 60, 268);

// ── Separator line ─────────────────────────────────────────────────────────
const lineGrad = ctx.createLinearGradient(60, 0, 900, 0);
lineGrad.addColorStop(0, 'rgba(0, 255, 65, 0.8)');
lineGrad.addColorStop(0.5, 'rgba(0, 212, 255, 0.5)');
lineGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
ctx.strokeStyle = lineGrad;
ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(60, 295); ctx.lineTo(900, 295); ctx.stroke();

// ── Skill chips ────────────────────────────────────────────────────────────
const skills = ['LangGraph', 'GPT-4', 'Multi-Agent', 'Voice AI', 'Computer Vision', 'RAG'];
const chipColors = [
  { bg: 'rgba(0,255,65,0.12)', border: 'rgba(0,255,65,0.5)', text: '#00ff41' },
  { bg: 'rgba(0,212,255,0.12)', border: 'rgba(0,212,255,0.5)', text: '#00d4ff' },
  { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.5)', text: '#818cf8' },
  { bg: 'rgba(0,255,65,0.12)', border: 'rgba(0,255,65,0.5)', text: '#00ff41' },
  { bg: 'rgba(0,212,255,0.12)', border: 'rgba(0,212,255,0.5)', text: '#00d4ff' },
  { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.5)', text: '#818cf8' },
];

let chipX = 60;
const chipY = 330;
ctx.font = '600 20px Arial, sans-serif';
for (let i = 0; i < skills.length; i++) {
  const w = ctx.measureText(skills[i]).width + 32;
  const c = chipColors[i % chipColors.length];
  // Background
  ctx.fillStyle = c.bg;
  ctx.beginPath();
  ctx.roundRect(chipX, chipY, w, 40, 8);
  ctx.fill();
  // Border
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(chipX, chipY, w, 40, 8);
  ctx.stroke();
  // Text
  ctx.fillStyle = c.text;
  ctx.fillText(skills[i], chipX + 16, chipY + 27);
  chipX += w + 12;
}

// ── Stats row ─────────────────────────────────────────────────────────────
const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '8+', label: 'AI Products Shipped' },
  { value: '1200+', label: 'Platform Users' },
];

let statX = 60;
const statY = 430;
for (const stat of stats) {
  ctx.font = 'bold 40px Arial, sans-serif';
  ctx.fillStyle = '#00ff41';
  ctx.fillText(stat.value, statX, statY + 40);
  ctx.font = '500 18px Arial, sans-serif';
  ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
  ctx.fillText(stat.label, statX, statY + 68);
  statX += 220;
}

// ── Bottom URL ─────────────────────────────────────────────────────────────
ctx.font = '500 18px "Courier New", monospace';
ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
ctx.fillText('saswatbuilds.com', 60, 590);

// ── Right accent — availability badge ─────────────────────────────────────
const badgeX = 980;
const badgeY = 540;
const badgeW = 160;
const badgeH = 48;
ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 24); ctx.fill(); ctx.stroke();
// Green dot
ctx.fillStyle = '#00ff41';
ctx.beginPath(); ctx.arc(badgeX + 20, badgeY + 24, 6, 0, Math.PI * 2); ctx.fill();
ctx.font = '600 16px Arial, sans-serif';
ctx.fillStyle = '#00ff41';
ctx.fillText('Available Now', badgeX + 34, badgeY + 29);

// ── Output ────────────────────────────────────────────────────────────────
const outputPath = resolve(__dirname, '../public/og-image.png');
const buffer = canvas.toBuffer('image/png');
writeFileSync(outputPath, buffer);
console.log(`✅ OG image generated: ${outputPath}`);
console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB`);
