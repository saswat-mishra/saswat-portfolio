import { C, WRAP } from '../../theme.js';

export function Kicker({ children }) {
  return (
    <div
      style={{
        fontFamily: C.mono,
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        color: C.cyan,
        textShadow: '0 0 8px rgba(0,212,255,0.4)',
        marginBottom: '0.9rem',
      }}
    >
      &gt; {children}
    </div>
  );
}

export function SectionTitle({ children, style }) {
  return (
    <h2
      style={{
        fontFamily: C.display,
        fontWeight: 800,
        fontSize: 'clamp(1.5rem, 3.4vw, 2.3rem)',
        color: C.text,
        lineHeight: 1.15,
        margin: '0 0 1rem',
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function Section({ children, id, style, wrap = true }) {
  return (
    <section id={id} style={{ padding: 'clamp(3rem, 7vw, 5.5rem) 0', position: 'relative', ...style }}>
      {wrap ? <div style={WRAP}>{children}</div> : children}
    </section>
  );
}
