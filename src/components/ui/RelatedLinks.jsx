import { Link } from 'react-router-dom';
import { C } from '../../theme.js';

/**
 * Hub-and-spoke internal link grid. links: [{ to, label, desc?, kind? }].
 * Used to link services↔articles↔case studies and across to the CTA.
 */
export default function RelatedLinks({ title = 'Related', links }) {
  const items = (links || []).filter(Boolean);
  if (!items.length) return null;
  return (
    <div>
      <div style={{ fontFamily: C.mono, fontSize: '0.7rem', letterSpacing: '0.2em', color: C.cyan, marginBottom: '1rem' }}>
        &gt; {title.toUpperCase()}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
        {items.map((l, i) => (
          <Link
            key={i}
            to={l.to}
            style={{
              display: 'block',
              textDecoration: 'none',
              background: C.panel,
              border: `1px solid ${C.panelBorder}`,
              borderRadius: '4px',
              padding: '1rem 1.1rem',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            {l.kind && (
              <span style={{ fontFamily: C.mono, fontSize: '0.62rem', letterSpacing: '0.12em', color: C.faint }}>
                {l.kind.toUpperCase()}
              </span>
            )}
            <div style={{ fontFamily: C.mono, fontSize: '0.88rem', color: C.green, margin: '0.3rem 0', fontWeight: 600 }}>
              {l.label} →
            </div>
            {l.desc && <div style={{ fontFamily: C.mono, fontSize: '0.74rem', color: C.dim, lineHeight: 1.6 }}>{l.desc}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
