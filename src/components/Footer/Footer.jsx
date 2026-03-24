import { useEffect, useRef, useState } from 'react';

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    href: 'https://github.com/saswat-mishra',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
    accentColor: '#e2e8f0',
    hoverColor: '#00ff41',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/saswat-mishra',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    accentColor: '#e2e8f0',
    hoverColor: '#00d4ff',
  },
  {
    name: 'Upwork',
    href: 'https://upwork.com/freelancers/saswat-mishra',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06a2.705 2.705 0 012.703 2.703 2.707 2.707 0 01-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112a2.551 2.551 0 01-2.547 2.547 2.55 2.55 0 01-2.545-2.547V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.438-5.439-5.439z" />
      </svg>
    ),
    accentColor: '#e2e8f0',
    hoverColor: '#14c43c',
  },
];

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} style={styles.footer}>
      {/* Top divider */}
      <div style={styles.topDivider} />

      {/* Scanlines overlay */}
      <div style={styles.scanlines} />

      {/* Glow accent */}
      <div style={styles.glowAccent} />

      <div
        style={{
          ...styles.content,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        {/* Name block */}
        <div style={styles.nameBlock}>
          <div style={styles.nameRow}>
            <div style={styles.nameCaret}>{'>'}</div>
            <h2 style={styles.name}>SASWAT MISHRA</h2>
          </div>
          <p style={styles.tagline}>
            <span style={styles.taglinePrompt}>{'>'} </span>
            Built with React + Three.js | Designed for impact
          </p>
        </div>

        {/* Center: navigation links */}
        <nav style={styles.navLinks}>
          {['projects', 'skills', 'testimonials', 'contact'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              style={styles.navLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00ff41';
                e.currentTarget.style.textShadow = '0 0 8px rgba(0,255,65,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {section}
            </a>
          ))}
        </nav>

        {/* Right: social links */}
        <div style={styles.socialBlock}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              style={styles.socialLink}
              title={link.name}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = link.hoverColor;
                e.currentTarget.style.borderColor = `${link.hoverColor}60`;
                e.currentTarget.style.background = `${link.hoverColor}10`;
                e.currentTarget.style.boxShadow = `0 0 12px ${link.hoverColor}30`;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.borderColor = 'rgba(0,255,65,0.1)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          ...styles.bottomBar,
          opacity: visible ? 1 : 0,
          transition: 'all 0.8s ease 0.3s',
        }}
      >
        <div style={styles.bottomDivider} />
        <div style={styles.bottomContent}>
          <span style={styles.copyright}>
            <span style={{ color: '#00ff41', marginRight: '6px', opacity: 0.6 }}>©</span>
            {year} Saswat Mishra. All rights reserved.
          </span>
          <div style={styles.terminalLine}>
            <span style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '10px' }}>
              $ uptime --since 2021
            </span>
            <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '10px', marginLeft: '8px' }}>
              [ONLINE]
            </span>
            <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '10px', animation: 'blink 1s infinite', marginLeft: '4px' }}>
              █
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes neonPulse {
          0%, 100% { text-shadow: 0 0 20px rgba(0,255,65,0.6), 0 0 40px rgba(0,255,65,0.2); }
          50% { text-shadow: 0 0 30px rgba(0,255,65,0.8), 0 0 60px rgba(0,255,65,0.3), 0 0 80px rgba(0,255,65,0.1); }
        }
      `}</style>
    </footer>
  );
}

const styles = {
  footer: {
    position: 'relative',
    background: 'linear-gradient(180deg, rgba(3,7,18,0) 0%, rgba(3,7,18,0.98) 20%, #030712 100%)',
    overflow: 'hidden',
    paddingTop: '60px',
  },
  topDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.3) 20%, rgba(0,255,65,0.5) 50%, rgba(0,255,65,0.3) 80%, transparent 100%)',
    boxShadow: '0 0 12px rgba(0,255,65,0.2)',
    marginBottom: '0',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.006) 3px, rgba(0,255,65,0.006) 4px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glowAccent: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '200px',
    background: 'radial-gradient(ellipse at top, rgba(0,255,65,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '40px 60px 24px',
    position: 'relative',
    zIndex: 1,
    flexWrap: 'wrap',
    gap: '24px',
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  nameCaret: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '20px',
    color: '#00ff41',
    opacity: 0.7,
  },
  name: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '20px',
    fontWeight: '900',
    color: '#00ff41',
    margin: 0,
    letterSpacing: '0.12em',
    animation: 'neonPulse 3s ease-in-out infinite',
  },
  tagline: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    color: '#4b5563',
    margin: 0,
    letterSpacing: '0.04em',
  },
  taglinePrompt: {
    color: '#00ff41',
    opacity: 0.5,
  },
  navLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
  },
  navLink: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    color: '#4b5563',
    textDecoration: 'none',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transition: 'color 0.25s ease, text-shadow 0.25s ease',
    cursor: 'pointer',
  },
  socialBlock: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid rgba(0,255,65,0.1)',
    color: '#4b5563',
    textDecoration: 'none',
    transition: 'all 0.25s cubic-bezier(0.25,0.46,0.45,0.94)',
    cursor: 'pointer',
  },
  bottomBar: {
    position: 'relative',
    zIndex: 1,
    padding: '0 60px 24px',
  },
  bottomDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.1) 30%, rgba(0,255,65,0.1) 70%, transparent 100%)',
    marginBottom: '16px',
  },
  bottomContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
  },
  copyright: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    color: '#374151',
    letterSpacing: '0.06em',
  },
  terminalLine: {
    display: 'flex',
    alignItems: 'center',
  },
};
