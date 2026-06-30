import { useState } from 'react';
import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd } from '../seo/jsonld.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section, Kicker } from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import { C } from '../theme.js';
import { SITE } from '../site.config.js';

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

export default function Contact() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }];
  const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      if (SCRIPT_URL) {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'saswatbuilds.com/contact', ts: new Date().toISOString() }),
        });
      }
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Seo
        title="Contact — book a free AI scoping call"
        description="Tell me what you want to automate and book a free 30-minute AI scoping call. Honest take on whether it’s worth building, rough cost, and how I’d approach it."
        path="/contact"
        image="/og/contact.png"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        kicker="CONTACT"
        title="Book a free 30-minute AI scoping call"
        sub="Tell me what you’re trying to automate. I’ll reply within 24 hours with an honest take on whether it’s worth building, roughly what it costs, and how I’d approach it. No pitch, no obligation."
      />

      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          {/* Form first */}
          <div>
            <Kicker>Start here</Kicker>
            {status === 'sent' ? (
              <div style={{ background: C.panel, border: `1px solid ${C.green}`, borderRadius: '4px', padding: '1.6rem', fontFamily: C.mono, color: C.text }}>
                <div style={{ color: C.green, fontWeight: 700, marginBottom: '0.5rem' }}>✓ Message received.</div>
                <p style={{ fontSize: '0.85rem', color: C.dim, lineHeight: 1.7, margin: 0 }}>
                  Thanks — I’ll get back to you within 24 hours. Prefer to grab a time now? Use the scheduler on the right.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <Field label="Name *"><input style={input} value={form.name} onChange={set('name')} required /></Field>
                <Field label="Email *"><input style={input} type="email" value={form.email} onChange={set('email')} required /></Field>
                <Field label="Company"><input style={input} value={form.company} onChange={set('company')} /></Field>
                <Field label="Rough budget">
                  <select style={input} value={form.budget} onChange={set('budget')}>
                    <option value="">Select…</option>
                    <option>$2,500 (1-week pilot)</option>
                    <option>$2,500–$10,000</option>
                    <option>$10,000–$30,000</option>
                    <option>$30,000+ / retainer</option>
                    <option>Not sure yet</option>
                  </select>
                </Field>
                <Field label="What do you want to automate? *">
                  <textarea style={{ ...input, minHeight: '120px', resize: 'vertical' }} value={form.message} onChange={set('message')} required />
                </Field>
                <Button href="#" variant="primary" style={{ justifyContent: 'center' }} onClick={onSubmit}>
                  {status === 'sending' ? 'Sending…' : 'Send & request a call →'}
                </Button>
                {status === 'error' && (
                  <p style={{ fontFamily: C.mono, fontSize: '0.78rem', color: C.amber }}>
                    Something went wrong. Email me directly at{' '}
                    <a href={`mailto:${SITE.email}`} style={{ color: C.green }}>{SITE.email}</a>.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Scheduler + direct contact */}
          <div>
            <Kicker>Or book directly</Kicker>
            <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.6rem' }}>
              <p style={{ fontFamily: C.mono, fontSize: '0.85rem', color: C.dim, lineHeight: 1.7, marginTop: 0 }}>
                Prefer to skip the form? Grab a 30-minute slot directly on my calendar.
              </p>
              <Button href={SITE.scheduler} variant="cyan" style={{ justifyContent: 'center', width: '100%' }}>
                Open scheduler →
              </Button>
              <div style={{ marginTop: '1.6rem', borderTop: `1px solid ${C.line}`, paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <a href={`mailto:${SITE.email}`} style={direct}>✉ {SITE.email}</a>
                <a href={SITE.social.linkedin} style={direct} target="_blank" rel="noopener noreferrer">in LinkedIn — /saswatbuilds</a>
                <a href={SITE.social.upwork} style={direct} target="_blank" rel="noopener noreferrer">⬆ Upwork — Rising Talent</a>
              </div>
            </div>
          </div>
        </div>
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
