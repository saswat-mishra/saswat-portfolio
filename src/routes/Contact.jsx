import { useState } from 'react';
import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd } from '../seo/jsonld.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section, Kicker } from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import { C } from '../theme.js';
import { SITE } from '../site.config.js';

// Lead capture: the form POSTs to /api/lead (a Cloudflare Pages Function in
// functions/api/lead.js) which forwards to the deployed Google Apps Script
// (Google Sheet + email notification) server-side, returning a real ok/error.

// Two named testimonials beside the form (trust adjacent to the conversion point).
const PROOF = [
  {
    quote:
      'Saswat brings deep technical expertise, high ownership, and disciplined execution. A dependable engineer who can be trusted with complex, high-stakes work.',
    name: 'Ajay S.',
    role: 'Founder',
  },
  {
    quote:
      'He executed quickly, handled every revision without friction, and delivered exactly what I wanted. Already produced a strong ROI.',
    name: 'Aiden S.',
    role: 'Founder & CEO',
  },
];

export default function Contact() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }];
  // Single-step, 4 fields. Budget intentionally omitted at first contact to
  // maximize volume; qualify on the call.
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [postFailed, setPostFailed] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || status === 'sending') return;
    setStatus('sending');
    // Same-origin Cloudflare Function forwards to the Google Apps Script
    // (Sheet + email). Server-side call → we get a real success/error.
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'saswatbuilds.com/contact',
          ts: new Date().toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) setPostFailed(true);
    } catch {
      setPostFailed(true);
    }
    setStatus('sent');
  };

  return (
    <>
      <Seo
        title="Contact — book a free AI scoping call"
        description="Tell me what you want to build and book a free 30-minute AI scoping call. Honest take on whether it’s worth building, rough cost, and how I’d approach it."
        path="/contact"
        image="/og/contact.png"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        kicker="CONTACT"
        title="Book a free 30-minute AI scoping call"
        sub="Tell me what you want to build. I’ll give you an honest take on whether it’s worth building, roughly what it costs, and how I’d approach it — no pitch, no obligation."
      />

      <Section>
        {status === 'sent' ? (
          // ── Lead captured → clean confirmation (I follow up by email) ──
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ background: C.panel, border: `1px solid ${C.green}`, borderRadius: '4px', padding: '1.8rem 1.6rem', textAlign: 'center' }}>
              <div style={{ fontFamily: C.mono, color: C.green, fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.7rem' }}>
                ✓ Got it, {form.name.split(' ')[0] || 'thanks'} — your details are in.
              </div>
              <p style={{ fontFamily: C.mono, fontSize: '0.9rem', color: C.dim, lineHeight: 1.85, margin: 0 }}>
                {postFailed ? (
                  <>The form had trouble saving — please email me directly at <a href={`mailto:${SITE.email}`} style={{ color: C.green }}>{SITE.email}</a> and I’ll reply within 1 business day.</>
                ) : (
                  <>I’ll personally read your note and email you within <strong style={{ color: C.text }}>1 business day</strong> to set up your free 30-minute scoping call. Talk soon.</>
                )}
              </p>
              <div style={{ marginTop: '1.4rem', display: 'flex', gap: '1.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/work" style={{ ...direct, color: C.cyan }}>See recent work →</a>
                <a href={`mailto:${SITE.email}`} style={{ ...direct, color: C.cyan }}>✉ {SITE.email}</a>
              </div>
            </div>
          </div>
        ) : (
          // ── Single-step qualifying form + trust sidebar ──
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            {/* Form */}
            <div>
              <Kicker>Start here</Kicker>
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '0.4rem' }}>
                <Field label="Name *"><input style={input} value={form.name} onChange={set('name')} autoComplete="name" required /></Field>
                <Field label="Work email *"><input style={input} type="email" value={form.email} onChange={set('email')} autoComplete="email" required /></Field>
                <Field label="Company"><input style={input} value={form.company} onChange={set('company')} autoComplete="organization" /></Field>
                <Field label="What do you want to build? *">
                  <textarea style={{ ...input, minHeight: '110px', resize: 'vertical' }} value={form.message} onChange={set('message')} required />
                </Field>
                <Button href="#" variant="primary" style={{ justifyContent: 'center', marginTop: '0.2rem' }} onClick={onSubmit}>
                  {status === 'sending' ? 'One sec…' : 'Book my call →'}
                </Button>
                {/* Risk-reversal microcopy directly under the button. */}
                <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.faint, textAlign: 'center' }}>
                  {SITE.cta.microcopy}
                </div>
                <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.dim, textAlign: 'center', lineHeight: 1.6 }}>
                  🔒 Your details stay private. I reply within 1 business day.
                </div>
              </form>
            </div>

            {/* Trust sidebar: named testimonials + direct contact */}
            <div>
              <Kicker>Why founders book</Kicker>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.4rem' }}>
                {PROOF.map((t) => (
                  <blockquote key={t.name} style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.1rem 1.2rem', margin: 0 }}>
                    <p style={{ fontFamily: C.mono, fontSize: '0.84rem', color: C.text, lineHeight: 1.7, margin: '0 0 0.6rem', fontStyle: 'italic' }}>“{t.quote}”</p>
                    <cite style={{ fontFamily: C.mono, fontSize: '0.75rem', color: C.cyan, fontStyle: 'normal' }}>— {t.name}, {t.role}</cite>
                  </blockquote>
                ))}
              </div>
              <div style={{ marginTop: '1.4rem', borderTop: `1px solid ${C.line}`, paddingTop: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <span style={{ fontFamily: C.mono, fontSize: '0.68rem', letterSpacing: '0.12em', color: C.faint }}>PREFER EMAIL?</span>
                <a href={`mailto:${SITE.email}`} style={direct}>✉ {SITE.email}</a>
                <a href={SITE.social.linkedin} style={direct} target="_blank" rel="noopener noreferrer me">in LinkedIn — /saswatbuilds</a>
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <span style={{ fontFamily: C.mono, fontSize: '0.72rem', letterSpacing: '0.06em', color: C.cyan }}>{label}</span>
      {children}
    </label>
  );
}

const input = {
  fontFamily: C.mono,
  fontSize: '0.85rem',
  color: C.text,
  background: 'rgba(0,0,0,0.3)',
  border: `1px solid ${C.panelBorder}`,
  borderRadius: '3px',
  padding: '0.6rem 0.7rem',
  outline: 'none',
  width: '100%',
};
const direct = { fontFamily: C.mono, fontSize: '0.8rem', color: C.dim, textDecoration: 'none' };
