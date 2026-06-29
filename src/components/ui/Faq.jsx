import { Kicker, SectionTitle } from './Section.jsx';
import { C } from '../../theme.js';

/**
 * Accessible FAQ as native <details> so answers are in the static HTML
 * (crawler-visible, no JS needed to expand). Pair with faqJsonLd in <Seo>.
 * faq: [{ q, a }]
 */
export default function Faq({ faq, heading = 'Frequently asked questions' }) {
  if (!faq?.length) return null;
  return (
    <div>
      <Kicker>FAQ</Kicker>
      <SectionTitle>{heading}</SectionTitle>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {faq.map((item, i) => (
          <details
            key={i}
            style={{
              background: C.panel,
              border: `1px solid ${C.panelBorder}`,
              borderRadius: '4px',
              padding: '1rem 1.2rem',
            }}
          >
            <summary
              style={{
                fontFamily: C.mono,
                fontSize: '0.92rem',
                color: C.text,
                cursor: 'pointer',
                fontWeight: 600,
                listStyle: 'none',
              }}
            >
              <span style={{ color: C.green, marginRight: '0.5rem' }}>?</span>
              {item.q}
            </summary>
            <p style={{ fontFamily: C.mono, fontSize: '0.85rem', color: C.dim, lineHeight: 1.75, margin: '0.9rem 0 0' }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
