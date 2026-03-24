import { useState, useEffect, useCallback, useRef } from 'react';

const NAV_LINKS = [
  { label: 'HOME',       href: '#home'         },
  { label: 'ABOUT',      href: '#about'        },
  { label: 'EXPERIENCE', href: '#experience'   },
  { label: 'PROJECTS',   href: '#projects'     },
  { label: 'SKILLS',     href: '#skills'       },
  { label: 'CONTACT',    href: '#contact'      },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

// ── Inline styles ──────────────────────────────────────────────────────────────
const styles = {
  nav: (scrolled) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 clamp(1rem, 4vw, 2.5rem)',
    fontFamily: "'JetBrains Mono', monospace",
    background: scrolled
      ? 'rgba(3,7,18,0.88)'
      : 'transparent',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
    borderBottom: scrolled
      ? '1px solid rgba(0,255,65,0.25)'
      : '1px solid transparent',
    boxShadow: scrolled
      ? '0 0 24px rgba(0,255,65,0.06)'
      : 'none',
    transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
  }),

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    textDecoration: 'none',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoMark: {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 900,
    fontSize: '1.4rem',
    color: '#00ff41',
    textShadow: '0 0 12px #00ff41, 0 0 24px rgba(0,255,65,0.5)',
    letterSpacing: '0.05em',
    lineHeight: 1,
  },
  logoText: {
    fontSize: '0.7rem',
    color: '#00d4ff',
    textShadow: '0 0 8px #00d4ff',
    letterSpacing: '0.06em',
    opacity: 0.9,
  },

  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    listStyle: 'none',
  },

  link: (active) => ({
    position: 'relative',
    display: 'inline-block',
    padding: '0.35rem 0.7rem',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    fontWeight: active ? 600 : 400,
    color: active ? '#00ff41' : 'rgba(226,232,240,0.65)',
    textShadow: active ? '0 0 8px #00ff41' : 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s, text-shadow 0.2s',
    background: 'none',
    border: 'none',
  }),

  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.3rem 0.75rem',
    border: '1px solid rgba(0,255,65,0.45)',
    borderRadius: '3px',
    background: 'rgba(0,255,65,0.06)',
    boxShadow: '0 0 10px rgba(0,255,65,0.12)',
    cursor: 'default',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  badgeDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#00ff41',
    boxShadow: '0 0 6px #00ff41',
    flexShrink: 0,
    animation: 'navBadgeBlink 1.1s step-end infinite',
  },
  badgeText: {
    fontSize: '0.6rem',
    letterSpacing: '0.1em',
    color: '#00ff41',
    fontWeight: 600,
    textShadow: '0 0 6px rgba(0,255,65,0.6)',
  },

  hamburger: (open) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '24px',
    height: '18px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    zIndex: 1100,
  }),
  hamburgerLine: (i, open) => ({
    display: 'block',
    height: '2px',
    background: '#00ff41',
    boxShadow: '0 0 6px #00ff41',
    borderRadius: '1px',
    transition: 'transform 0.25s ease, opacity 0.25s ease',
    transformOrigin: 'center',
    transform:
      open
        ? i === 0
          ? 'translateY(8px) rotate(45deg)'
          : i === 2
          ? 'translateY(-8px) rotate(-45deg)'
          : 'scaleX(0)'
        : 'none',
    opacity: open && i === 1 ? 0 : 1,
  }),

  mobileMenu: (open) => ({
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    background: 'rgba(3,7,18,0.97)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(0,255,65,0.2)',
    boxShadow: '0 8px 32px rgba(0,255,65,0.08)',
    padding: open ? '1.5rem 2rem 2rem' : '0 2rem',
    overflow: 'hidden',
    maxHeight: open ? '420px' : '0',
    transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1), padding 0.3s ease',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  }),

  mobileLink: (active) => ({
    display: 'block',
    padding: '0.75rem 0.5rem',
    fontSize: '0.8rem',
    letterSpacing: '0.15em',
    fontWeight: active ? 600 : 400,
    color: active ? '#00ff41' : 'rgba(226,232,240,0.7)',
    textShadow: active ? '0 0 8px #00ff41' : 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(0,255,65,0.07)',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(0,255,65,0.07)',
    width: '100%',
    textAlign: 'left',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'color 0.2s',
  }),
};

// ── Underline indicator for active link ────────────────────────────────────────
function NavLink({ label, href, active, onClick }) {
  return (
    <li style={{ position: 'relative' }}>
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); onClick(href); }}
        style={styles.link(active)}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.color = 'rgba(226,232,240,0.95)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.color = 'rgba(226,232,240,0.65)';
          }
        }}
      >
        {label}
      </a>
      {/* Active underline bar */}
      <span
        style={{
          position: 'absolute',
          bottom: '-2px',
          left: '0.7rem',
          right: '0.7rem',
          height: '2px',
          background: '#00ff41',
          boxShadow: '0 0 6px #00ff41',
          borderRadius: '1px',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      />
    </li>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [activeId, setActiveId]     = useState('home');
  const [menuOpen, setMenuOpen]     = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const observerRef                 = useRef(null);

  // Responsive check
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);

  // Scroll → glass navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver → active section
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    observerRef.current = observer;

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((href) => {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  }, []);

  const scrollHome = useCallback(() => scrollTo('#home'), [scrollTo]);

  return (
    <>
      <nav style={styles.nav(scrolled)} role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div style={styles.logo} onClick={scrollHome} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && scrollHome()}>
          <span style={styles.logoMark}>SM</span>
          <span style={styles.logoText}>&gt; saswat.exe</span>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <ul style={styles.desktopLinks} role="list">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                label={link.label}
                href={link.href}
                active={activeId === link.href.slice(1)}
                onClick={scrollTo}
              />
            ))}
          </ul>
        )}

        {/* Right-side group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Available badge — hide on very small mobile */}
          {!(isMobile && menuOpen) && (
            <div style={styles.badge} aria-label="Available for hire">
              <span style={styles.badgeDot} />
              <span style={styles.badgeText}>
                {isMobile ? 'HIRING' : 'AVAILABLE FOR HIRE'}
              </span>
            </div>
          )}

          {/* Hamburger */}
          {isMobile && (
            <button
              style={styles.hamburger(menuOpen)}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={styles.hamburgerLine(i, menuOpen)} />
              ))}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div style={styles.mobileMenu(menuOpen)} aria-hidden={!menuOpen} role="menu">
          {/* Terminal prefix */}
          <div
            style={{
              fontSize: '0.6rem',
              color: 'rgba(0,255,65,0.4)',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(0,255,65,0.1)',
            }}
          >
            &gt; navigation.exe --list-sections
          </div>
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              style={styles.mobileLink(activeId === link.href.slice(1))}
              onClick={() => scrollTo(link.href)}
              role="menuitem"
              onMouseEnter={(e) => {
                if (activeId !== link.href.slice(1)) {
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== link.href.slice(1)) {
                  e.currentTarget.style.color = 'rgba(226,232,240,0.7)';
                }
              }}
            >
              <span style={{ color: 'rgba(0,212,255,0.5)', marginRight: '0.5rem' }}>
                {activeId === link.href.slice(1) ? '▶' : '·'}
              </span>
              {link.label}
            </button>
          ))}
          {/* Badge row */}
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
            <div style={styles.badge}>
              <span style={styles.badgeDot} />
              <span style={styles.badgeText}>AVAILABLE FOR HIRE</span>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe injection */}
      <style>{`
        @keyframes navBadgeBlink {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #00ff41; }
          50%       { opacity: 0.25; box-shadow: none; }
        }
      `}</style>
    </>
  );
}
