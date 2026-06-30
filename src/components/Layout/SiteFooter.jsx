import { Link } from 'react-router-dom';
import { FOOTER_NAV, SITE } from '../../site.config.js';
import { C, WRAP } from '../../theme.js';

// Social links, in sameAs order; only render the ones with a configured URL.
const SOCIALS = [
  { label: 'LinkedIn', href: SITE.social.linkedin },
  { label: 'GitHub', href: SITE.social.github },
  { label: 'Upwork', href: SITE.social.upwork },
  { label: 'X', href: SITE.social.x },
  { label: 'Hugging Face', href: SITE.social.huggingface },
  { label: 'Crunchbase', href: SITE.social.crunchbase },
  { label: 'Clutch', href: SITE.social.clutch },
].filter((s) => s.href);

export default function SiteFooter() {
  const year = 2026;
  return (
    <footer style={{ position: 'relative', borderTop: `1px solid ${C.panelBorder}`, background: 'linear-gradient(180deg, transparent, rgba(3,7,18,0.6))', marginTop: '2rem' }}>
      <div style={{ ...WRAP, padding: 'clamp(2.5rem,5vw,4rem) clamp(1rem,4vw,2rem) 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          {/* Brand + CTA */}
          <div>
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: '1.2rem', color: C.green, textShadow: '0 0 12px rgba(0,255,65,0.5)', letterSpacing: '0.08em' }}>
              SASWAT MISHRA
            </div>
            {/* Canonical bio — verbatim match with About page + Person/Org JSON-LD. */}
            <p style={{ fontFamily: C.mono, fontSize: '0.75rem', color: C.dim, lineHeight: 1.7, marginTop: '0.7rem', maxWidth: 340 }}>
              {SITE.canonicalBio}
            </p>
            <Link to={SITE.cta.href} style={{ display: 'inline-block', marginTop: '1rem', fontFamily: C.mono, fontSize: '0.75rem', color: C.green, border: `1px solid ${C.green}`, borderRadius: '3px', padding: '0.5rem 0.9rem', textDecoration: 'none' }}>
              {SITE.cta.label} →
            </Link>
          </div>

          {/* Link columns */}
          {FOOTER_NAV.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div style={{ fontFamily: C.mono, fontSize: '0.66rem', letterSpacing: '0.18em', color: C.cyan, marginBottom: '0.9rem' }}>
                {col.title.toUpperCase()}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {col.links.map((l) =>
                  l.external ? (
                    <li key={l.href}>
                      <a href={l.href} style={fLink} target="_blank" rel="noopener noreferrer">{l.label}</a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link to={l.href} style={fLink}>{l.label}</Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.2rem', borderTop: `1px solid ${C.line}` }}>
          <span style={{ fontFamily: C.mono, fontSize: '0.7rem', color: C.faint }}>
            © {year} Saswat Mishra · saswatbuilds.com
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} style={fLink} target="_blank" rel="noopener noreferrer me">{s.label}</a>
            ))}
            <a href={`mailto:${SITE.email}`} style={fLink}>Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const fLink = {
  fontFamily: C.mono,
  fontSize: '0.78rem',
  color: C.dim,
  textDecoration: 'none',
};
