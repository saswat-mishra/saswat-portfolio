import { C } from '../../theme.js';

/** items: [{ metric, label }] — bold metric + named context. */
export default function ProofBar({ items }) {
  if (!items?.length) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        gap: '1px',
        background: C.line,
        border: `1px solid ${C.panelBorder}`,
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '2rem',
      }}
    >
      {items.map((it, i) => (
        <div key={i} style={{ background: C.bg, padding: '1.2rem 1.4rem' }}>
          <div
            style={{
              fontFamily: C.display,
              fontWeight: 900,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              color: C.green,
              textShadow: '0 0 14px rgba(0,255,65,0.4)',
              lineHeight: 1,
            }}
          >
            {it.metric}
          </div>
          <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.dim, marginTop: '0.5rem', lineHeight: 1.5 }}>
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
