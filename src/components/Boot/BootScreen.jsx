import { useState, useEffect } from 'react';

// Terminal "Portfolio OS" boot overlay — shown only on the Home route as the
// landing brand moment. The real content is always rendered underneath (present
// in the prerendered HTML); this overlay fades out via a pure-CSS animation
// within ~1s, so content is never gated from crawlers or no-JS users. JS only
// drives the typing animation, then unmounts the already-invisible overlay.
const BOOT_LINES = [
  { text: 'BIOS v2.4.1 — POST check... OK', delay: 0 },
  { text: 'Initializing kernel modules...', delay: 70 },
  { text: 'Loading neural interface drivers... OK', delay: 140 },
  { text: 'Mounting encrypted filesystem...', delay: 210 },
  { text: 'Starting quantum process scheduler... OK', delay: 280 },
  { text: 'Connecting to neural network... OK', delay: 350 },
  { text: 'Calibrating holographic display matrix...', delay: 420 },
  { text: 'Loading AI/ML runtime environment... OK', delay: 500 },
  { text: 'Bootstrapping saswat.portfolio.exe...', delay: 580 },
  { text: '> SYSTEM READY — Welcome, Agent.', delay: 680, highlight: true },
];

export default function BootScreen({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [barProgress, setBarProgress] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReduced) {
      const t = setTimeout(onDone, 0);
      return () => clearTimeout(t);
    }
    const timers = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, line]);
          setBarProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        }, line.delay),
      );
    });
    timers.push(setTimeout(() => onDone(), 1150));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className="boot-overlay"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030712',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)', pointerEvents: 'none' }} />
      <div style={{ width: 'min(640px, 90vw)', padding: '0 1rem' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, color: '#00ff41', textShadow: '0 0 20px #00ff41, 0 0 40px rgba(0,255,65,0.5)', marginBottom: '2rem', letterSpacing: '0.15em' }}>
          SM
          <span style={{ fontSize: '0.35em', color: '#00d4ff', textShadow: '0 0 10px #00d4ff', marginLeft: '1em', verticalAlign: 'middle', letterSpacing: '0.05em' }}>PORTFOLIO OS</span>
        </div>
        <div style={{ background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '4px', padding: '1.2rem 1.4rem', height: '260px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(0,255,65,0.08)' }}>
          {visibleLines.map((line, i) => (
            <div key={i} style={{ fontSize: '0.78rem', lineHeight: 1.8, color: line.highlight ? '#00ff41' : 'rgba(226,232,240,0.8)', textShadow: line.highlight ? '0 0 8px #00ff41' : 'none', fontWeight: line.highlight ? 600 : 400 }}>
              <span style={{ color: '#00d4ff', opacity: 0.7 }}>[{String(i).padStart(2, '0')}]</span> {line.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '4px', background: 'rgba(0,255,65,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${barProgress}%`, background: 'linear-gradient(90deg, #00ff41, #00d4ff)', boxShadow: '0 0 10px rgba(0,255,65,0.6)', transition: 'width 0.25s ease', borderRadius: '2px' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#00ff41', minWidth: '38px', textAlign: 'right', textShadow: '0 0 8px #00ff41' }}>{barProgress}%</span>
        </div>
      </div>
      <style>{`
        @keyframes bootFade { to { opacity: 0; visibility: hidden; } }
        .boot-overlay { opacity: 1; animation: bootFade 0.3s ease 0.72s forwards; }
        @media (prefers-reduced-motion: reduce) {
          .boot-overlay { animation: none; opacity: 0; visibility: hidden; pointer-events: none; }
        }
      `}</style>
    </div>
  );
}
