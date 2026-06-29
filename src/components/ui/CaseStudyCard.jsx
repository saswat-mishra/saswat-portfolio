import { Link } from 'react-router-dom';
import { C } from '../../theme.js';

const initials = (title = '') =>
  title
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/**
 * Reusable proof card: logo/skeleton + one-line problem + BOLD quantified result
 * + named attribution. Lead with the number (Dossier §4). `work` is a manifest
 * item from src/content/work/*.js.
 */
export default function CaseStudyCard({ work }) {
  if (!work) return null;
  const result = work.results?.[0];

  return (
    <Link to={`/work/${work.slug}`} style={card} data-cs-card>
      {/* Logo skeleton (monogram stands in for a client logo) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
        <span style={monogram}>{initials(work.title)}</span>
        <span style={{ fontFamily: C.mono, fontSize: '0.62rem', letterSpacing: '0.12em', color: C.cyan }}>
          {(work.serviceName || 'CASE STUDY').toUpperCase()}
          {work.status ? ` · ${work.status}` : ''}
        </span>
      </div>

      {/* One-line problem */}
      <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: '1.02rem', color: C.text, lineHeight: 1.3, marginBottom: '0.9rem' }}>
        {work.title}
      </div>
      <p style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.dim, lineHeight: 1.6, margin: '0 0 1.1rem' }}>
        {work.subtitle}
      </p>

      {/* Bold quantified result */}
      {result && (
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: '0.9rem', marginBottom: '0.8rem' }}>
          <span style={{ fontFamily: C.display, fontWeight: 900, fontSize: '1.6rem', color: C.green, textShadow: '0 0 14px rgba(0,255,65,0.4)', lineHeight: 1 }}>
            {result.metric}
          </span>{' '}
          <span style={{ fontFamily: C.mono, fontSize: '0.74rem', color: C.dim }}>{result.label}</span>
        </div>
      )}

      {/* Named attribution */}
      <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.faint, fontStyle: work.testimonial ? 'italic' : 'normal' }}>
        {work.testimonial
          ? `“${work.testimonial.quote}” — ${work.testimonial.author}`
          : `Built by Saswat Mishra${work.role ? ` · ${work.role}` : ''}`}
      </div>

      <div style={{ fontFamily: C.mono, fontSize: '0.74rem', color: C.green, marginTop: '1rem' }}>
        Read the case study →
      </div>
    </Link>
  );
}

const card = {
  display: 'block',
  textDecoration: 'none',
  background: C.panel,
  border: `1px solid ${C.panelBorder}`,
  borderRadius: '4px',
  padding: '1.3rem 1.4rem',
  height: '100%',
  boxSizing: 'border-box',
};
const monogram = {
  fontFamily: C.display,
  fontWeight: 900,
  fontSize: '0.9rem',
  color: C.green,
  width: 38,
  height: 38,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${C.panelBorder}`,
  borderRadius: '4px',
  background: 'rgba(0,255,65,0.06)',
  flexShrink: 0,
};
