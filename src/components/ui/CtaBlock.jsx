import Button from './Button.jsx';
import { SITE } from '../../site.config.js';
import { C, WRAP } from '../../theme.js';

/**
 * Repeatable primary CTA. Used 3–5× down each page per the conversion rules:
 * first-person copy + risk-reversal microcopy + one primary action.
 */
export default function CtaBlock({
  heading = "Let's see if I can take this off your plate",
  sub = 'Tell me what you want to automate. On a free 30-minute call I’ll tell you straight whether it’s worth building, roughly what it costs, and how I’d approach it — no pitch, no obligation.',
}) {
  return (
    <section style={{ padding: 'clamp(2.5rem, 6vw, 4.5rem) 0' }}>
      <div
        style={{
          ...WRAP,
          maxWidth: 820,
          textAlign: 'center',
          background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.06), transparent 70%)',
        }}
      >
        <h2
          style={{
            fontFamily: C.display,
            fontWeight: 800,
            fontSize: 'clamp(1.4rem, 3.2vw, 2.1rem)',
            color: C.text,
            margin: '0 0 1rem',
          }}
        >
          {heading}
        </h2>
        <p style={{ fontFamily: C.mono, fontSize: '0.9rem', color: C.dim, lineHeight: 1.8, maxWidth: 620, margin: '0 auto 1.8rem' }}>
          {sub}
        </p>
        <Button to={SITE.cta.href} variant="primary">
          {SITE.cta.label} →
        </Button>
        <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: C.faint, marginTop: '1rem', letterSpacing: '0.05em' }}>
          {SITE.cta.microcopy}
        </div>
      </div>
    </section>
  );
}
