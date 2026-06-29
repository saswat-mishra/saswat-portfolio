import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV, SITE } from '../../site.config.js';
import { C } from '../../theme.js';

const linkStyle = ({ isActive }) => ({
  fontFamily: C.mono,
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: isActive ? C.green : 'rgba(226,232,240,0.7)',
  textShadow: isActive ? '0 0 8px rgba(0,255,65,0.6)' : 'none',
  textDecoration: 'none',
  padding: '0.4rem 0.7rem',
  transition: 'color 0.2s, text-shadow 0.2s',
});

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 2.5rem)',
        background: scrolled ? 'rgba(3,7,18,0.9)' : 'rgba(3,7,18,0.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(0,255,65,0.25)' : 'transparent'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
        <span style={{ fontFamily: C.display, fontWeight: 900, fontSize: '1.3rem', color: C.green, textShadow: '0 0 12px #00ff41', letterSpacing: '0.05em' }}>
          SM
        </span>
        <span style={{ fontFamily: C.mono, fontSize: '0.66rem', color: C.cyan, textShadow: '0 0 8px #00d4ff' }}>
          &gt; saswatbuilds
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hdr-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} aria-label="Primary">
        <NavLink to="/" end style={linkStyle}>Home</NavLink>
        {NAV.map((n) => (
          <NavLink key={n.href} to={n.href} style={linkStyle}>{n.label}</NavLink>
        ))}
        <Link
          to={SITE.cta.href}
          style={{
            marginLeft: '0.6rem',
            fontFamily: C.display,
            fontWeight: 700,
            fontSize: '0.66rem',
            letterSpacing: '0.1em',
            color: C.bg,
            background: C.green,
            border: `1px solid ${C.green}`,
            borderRadius: '3px',
            padding: '0.55rem 1rem',
            textDecoration: 'none',
            boxShadow: '0 0 14px rgba(0,255,65,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          {SITE.cta.short.toUpperCase()} →
        </Link>
      </nav>

      {/* Mobile toggle */}
      <button
        className="hdr-burger"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: C.green, fontSize: '1.4rem', fontFamily: C.mono }}
      >
        {open ? '✕' : '≡'}
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          className="hdr-mobile"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            background: 'rgba(3,7,18,0.98)',
            borderBottom: `1px solid ${C.panelBorder}`,
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}
        >
          <NavLink to="/" end style={linkStyle} onClick={() => setOpen(false)}>Home</NavLink>
          {NAV.map((n) => (
            <NavLink key={n.href} to={n.href} style={linkStyle} onClick={() => setOpen(false)}>{n.label}</NavLink>
          ))}
          <Link to={SITE.cta.href} onClick={() => setOpen(false)} style={{ marginTop: '0.6rem', fontFamily: C.display, fontWeight: 700, fontSize: '0.7rem', color: C.bg, background: C.green, borderRadius: '3px', padding: '0.7rem 1rem', textDecoration: 'none', textAlign: 'center' }}>
            {SITE.cta.label.toUpperCase()} →
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .hdr-desktop { display: none !important; }
          .hdr-burger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
