import { Kicker } from './Section.jsx';
import { C, WRAP } from '../../theme.js';

/** Outcome-led page hero: kicker → H1 → sub → (CTA/proof via children). */
export default function PageHero({ kicker, title, sub, children }) {
  return (
    <header style={{ ...WRAP, paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h1
        style={{
          fontFamily: C.display,
          fontWeight: 900,
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          color: C.text,
          lineHeight: 1.1,
          margin: '0 0 1.1rem',
          maxWidth: 900,
          textShadow: '0 0 30px rgba(0,255,65,0.15)',
        }}
      >
        {title}
      </h1>
      {sub && (
        <p
          style={{
            fontFamily: C.mono,
            fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
            color: C.dim,
            lineHeight: 1.8,
            maxWidth: 720,
            margin: 0,
            borderLeft: `2px solid ${C.panelBorder}`,
            paddingLeft: '1rem',
          }}
        >
          {sub}
        </p>
      )}
      {children}
    </header>
  );
}
