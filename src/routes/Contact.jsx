import { useState } from 'react';
import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd } from '../seo/jsonld.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section, Kicker } from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import ClientOnly from '../components/util/ClientOnly.jsx';
import { C } from '../theme.js';
import { SITE } from '../site.config.js';

// Lead capture path: POST to the Google Apps Script (→ Google Sheet + email
// notification). See docs/contact-apps-script.gs for the doPost to deploy.
// Set VITE_GOOGLE_SCRIPT_URL (build-time env / CI secret) to the script URL.
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

// Two named testimonials beside the form (Dossier §4: trust adjacent to the
// conversion point; lead with credibility). Trimmed to punchy, attributable lines.
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
  // maximize volume (Dossier §5); qualify on the call.
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [postFailed, setPostFailed] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || status === 'sending') return;
    setStatus('sending');
    // Capture the lead BEFORE showing the scheduler, so we get the contact even
    // if they never book. Best-effort: we still advance to the scheduler on error.
    try {
      if (SCRIPT_URL) {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            ...form,
            source: 'saswatbuilds.com/contact',
            ts: new Date().toISOString(),
          }),
        });
      } else {
        setPostFailed(true);
      }
    } catch {
      setPostFailed(true);
    }
    setStatus('sent');
  };

  // Cal.com inline embed, prefilled with the captured name/email (+ notes for
  // context), dark theme to match the cyberpunk aesthetic.
  const schedulerSrc =
    `${SITE.scheduler}?theme=dark` +
    `&name=${encodeURIComponent(form.name)}` +
    `&email=${encodeURIComponent(form.email)}` +
    `&notes=${encodeURIComponent(form.message)}`;

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
          // ── Form-first → scheduler: lead captured, now show the calendar ──
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div style={{ background: C.panel, border: `1px solid ${C.green}`, borderRadius: '4px', padding: '1.2rem 1.4rem', marginBottom: '1.4rem' }}>
              <div style={{ fontFamily: C.mono, color: C.green, fontWeight: 700, marginBottom: '0.4rem' }}>
                ✓ Got it, {form.name.split(' ')[0] || 'thanks'} — your details are in.
              </div>
              <p style={{ fontFamily: C.mono, fontSize: '0.85rem', color: C.dim, lineHeight: 1.7, margin: 0 }}>
                Pick a 30-minute slot below to lock in your scoping call. Nothing to prep — we’ll talk through what you want to build.
                {postFailed && (
                  <> If the form didn’t save, just email me at <a href={`mailto:${SITE.email}`} style={{ color: C.green }}>{SITE.email}</a>.</>
                )}
              </p>
            </div>
            {/* Cal.com embedded scheduler (client-only; prefilled). */}
            <ClientOnly
              fallback={
                <div style={{ ...schedBox, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.dim, fontFamily: C.mono, fontSize: '0.85rem' }}>
                  Loading the calendar… or <a href={schedulerSrc} style={{ color: C.cyan, marginLeft: 4 }} target="_blank" rel="noopener noreferrer">open it in a new tab →</a>
                </div>
              }
            >
              <iframe
                title="Book a 30-minute AI scoping call"
                src={schedulerSrc}
                style={schedBox}
                loading="lazy"
              />
            </ClientOnly>
            <p style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.faint, textAlign: 'center', marginTop: '0.9rem' }}>
              Can’t see the calendar? <a href={schedulerSrc} style={{ color: C.cyan }} target="_blank" rel="noopener noreferrer">Open the scheduler in a new tab →</a>
            </p>
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
                {/* Risk-reversal microcopy directly under the button (Dossier §2). */}
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
const schedBox = {
  width: '100%',
  height: '700px',
  maxWidth: '100%',
  border: `1px solid ${C.panelBorder}`,
  borderRadius: '6px',
  background: C.bgAlt,
  colorScheme: 'dark',
};
const direct = { fontFamily: C.mono, fontSize: '0.8rem', color: C.dim, textDecoration: 'none' };
