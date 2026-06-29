import Seo from '../seo/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import { C, WRAP } from '../theme.js';
import { NAV } from '../site.config.js';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <Seo title="404 — Page not found" description="That route doesn’t exist." path="/404" noindex />
      <section style={{ ...WRAP, minHeight: '72vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '90px', textAlign: 'center' }}>
        <div style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.cyan, letterSpacing: '0.2em', marginBottom: '1rem' }}>
          &gt; ERROR 404 — SEGMENT NOT FOUND
        </div>
        <h1 style={{ fontFamily: C.display, fontWeight: 900, fontSize: 'clamp(3rem, 12vw, 7rem)', color: C.green, textShadow: '0 0 30px rgba(0,255,65,0.4)', margin: '0 0 1rem', lineHeight: 1 }}>
          404
        </h1>
        <p style={{ fontFamily: C.mono, fontSize: '0.95rem', color: C.dim, lineHeight: 1.8, maxWidth: 480, margin: '0 auto 2rem' }}>
          The page you’re looking for isn’t on this server. It may have moved, or the link was mistyped.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Button to="/">Back to home</Button>
          <Button to="/contact" variant="ghost">Book a call</Button>
        </div>
        <nav style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {NAV.map((n) => (
            <Link key={n.href} to={n.href} style={{ fontFamily: C.mono, fontSize: '0.75rem', color: C.faint, textDecoration: 'none' }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </section>
    </>
  );
}
