// Cloudflare Pages Function — same-origin lead capture for /api/lead.
// The contact form POSTs JSON here; we forward to the deployed Google Apps Script
// (Google Sheet + email notification) server-side as URL params (the script reads
// e.parameter), then return a real ok/error so the client can confirm honestly.
// No CORS issues (same-origin), and a failed save is reported instead of faked.

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzcEfX1ZOlxOJqYVXqpgA2-orhHnHi433dbpMOkpNzKaXB9h8Wl4h7CQCJFRgnA1YYG/exec';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function onRequestPost({ request }) {
  let data = {};
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();
  if (!name || !email) return json({ ok: false, error: 'Name and email are required.' }, 400);

  const params = new URLSearchParams({
    name,
    email,
    company: String(data.company || ''),
    message,
    source: String(data.source || 'saswatbuilds.com/contact'),
    ts: String(data.ts || new Date().toISOString()),
  });

  try {
    const res = await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'saswatbuilds-lead-capture' },
    });
    const body = await res.text();
    const ok = res.ok && /success/i.test(body);
    return ok
      ? json({ ok: true })
      : json({ ok: false, error: 'Upstream save failed.' }, 502);
  } catch {
    return json({ ok: false, error: 'Lead service unreachable.' }, 502);
  }
}

// Health check: GET /api/lead → { ok:true, service:'lead' } (no write).
export async function onRequestGet() {
  return json({ ok: true, service: 'lead' });
}
