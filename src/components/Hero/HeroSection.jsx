import { useRef, useEffect, useState, Suspense, useCallback, lazy } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE } from '../../site.config.js';

// Three.js is isolated in its own chunk, dynamically imported only on desktop
// with motion allowed, after load/on-view (3D performance contract, Dossier §3).
const HeroCanvas = lazy(() => import('./HeroCanvas.jsx'));
const BASE = import.meta.env.BASE_URL;

// ─── Hero visual: static poster (LCP) + deferred 3D ───────────────────────────
// The poster <img> is in the prerendered HTML and is the LCP element. The 3D
// canvas is never loaded under prefers-reduced-motion or on mobile breakpoints
// (zero Three.js JS there); on desktop it loads after the load event + on-view
// and fades in over the poster. The column has fixed dims → no CLS.
function HeroVisual() {
  const [enabled, setEnabled] = useState(false); // desktop + motion-ok (client-only)
  const [show, setShow] = useState(false); // 3D ready to mount
  const ref = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 769px)').matches;
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(desktop && motionOk);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let idleId;
    const fire = () => setShow(true);
    // Load 3D AFTER the load event (Dossier §3) — the hero is above the fold, so
    // it is always "in view"; we defer to idle time so the static poster wins LCP
    // and the heavy Three.js work never competes with first paint.
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(fire, { timeout: 1500 });
      else idleId = setTimeout(fire, 300);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (idleId) (window.cancelIdleCallback || clearTimeout)(idleId);
    };
  }, [enabled]);

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      {/* Home-only: preload the LCP poster so it paints as early as possible. */}
      <Helmet>
        <link rel="preload" as="image" href={`${BASE}hero-poster.webp`} type="image/webp" fetchpriority="high" />
      </Helmet>
      <picture>
        <source srcSet={`${BASE}hero-poster.webp`} type="image/webp" />
        <img
          src={`${BASE}hero-poster.jpg`}
          alt="Saswat Mishra — AI developer 3D avatar"
          width="467"
          height="1030"
          fetchPriority="high"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: show ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        />
      </picture>
      {show && (
        <Suspense fallback={null}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <HeroCanvas />
          </div>
        </Suspense>
      )}
    </div>
  );
}

// ─── Glitch Text Component ────────────────────────────────────────────────────
function GlitchText({ text, fontSize = 'clamp(2.4rem, 5.5vw, 4.5rem)' }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="glitch-container" style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        @keyframes glitch-1 {
          0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
          20% { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 2px); }
          40% { clip-path: inset(50% 0 30% 0); transform: translate(4px, -2px); }
          60% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 1px); }
          80% { clip-path: inset(10% 0 80% 0); transform: translate(2px, -1px); }
        }
        @keyframes glitch-2 {
          0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
          20% { clip-path: inset(60% 0 20% 0); transform: translate(4px, -2px); }
          40% { clip-path: inset(30% 0 50% 0); transform: translate(-4px, 2px); }
          60% { clip-path: inset(10% 0 70% 0); transform: translate(2px, -1px); }
          80% { clip-path: inset(80% 0 10% 0); transform: translate(-2px, 1px); }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .glitch-before {
          animation: glitch-1 0.2s linear;
          color: #00ff41;
          position: absolute;
          top: 0; left: 0;
        }
        .glitch-after {
          animation: glitch-2 0.2s linear;
          color: #00d4ff;
          position: absolute;
          top: 0; left: 0;
        }
      `}</style>
      <span style={{
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 900,
        fontSize,
        color: '#ffffff',
        letterSpacing: '0.05em',
        textShadow: '0 0 30px rgba(0,255,65,0.3)',
        lineHeight: 1.1,
      }}>
        {text}
      </span>
      {glitching && (
        <>
          <span className="glitch-before" aria-hidden="true" style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize,
            letterSpacing: '0.05em',
            lineHeight: 1.1,
          }}>{text}</span>
          <span className="glitch-after" aria-hidden="true" style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize,
            letterSpacing: '0.05em',
            lineHeight: 1.1,
          }}>{text}</span>
        </>
      )}
    </span>
  );
}

// ─── Music Player ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0);   // 0–1, starts muted
  const [ready, setReady] = useState(false);
  const [floated, setFloated] = useState(false); // true when scrolled past hero
  const animRef = useRef(null);
  const barsRef = useRef([0.3, 0.5, 0.7, 0.4, 0.6, 0.5, 0.3, 0.45]);

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/dance.mp3`);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'metadata';
    audio.addEventListener('canplaythrough', () => setReady(true), { once: true });
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Float to top sticky bar once user scrolls past the hero section
  useEffect(() => {
    const onScroll = () => setFloated(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep volume in sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const handleVolume = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v > 0 && !playing && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  // Animate waveform bars when playing
  useEffect(() => {
    if (!playing) return;
    let frame;
    const animate = () => {
      barsRef.current = barsRef.current.map(() => 0.2 + Math.random() * 0.8);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  // Force re-render for bar animation
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, [playing]);

  // Floating-top bar style vs in-hero style
  const floatedStyle = {
    position: 'fixed',
    top: '64px',           // sit just below the 64px-tall navbar
    left: 0,
    right: 0,
    zIndex: 999,           // below navbar (1000) but above page content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    background: 'rgba(3,7,18,0.97)',
    borderBottom: '1px solid rgba(0,255,65,0.2)',
    borderRadius: 0,
    padding: '5px 20px',
    backdropFilter: 'blur(16px)',
    boxShadow: playing
      ? '0 4px 20px rgba(0,255,65,0.14)'
      : '0 2px 10px rgba(0,255,65,0.05)',
    transition: 'opacity 0.35s ease, box-shadow 0.4s ease',
    opacity: floated ? 1 : 0,
    pointerEvents: floated ? 'auto' : 'none',
    userSelect: 'none',
    minWidth: 0,
    width: '100%',
  };
  const inHeroStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(3,7,18,0.82)',
    border: '1px solid rgba(0,255,65,0.25)',
    borderRadius: '8px',
    padding: '8px 14px',
    backdropFilter: 'blur(12px)',
    boxShadow: playing
      ? '0 0 20px rgba(0,255,65,0.2), inset 0 0 10px rgba(0,255,65,0.04)'
      : '0 0 8px rgba(0,255,65,0.08)',
    transition: 'box-shadow 0.4s ease',
    minWidth: '220px',
    userSelect: 'none',
  };

  return (
    <>
    {/* Fixed top bar — slides in when user scrolls past hero */}
    <div
      data-no-click-sound
      style={floatedStyle}
    >
      {/* Play / pause button */}
      <button
        onClick={togglePlay}
        title={playing ? 'Pause music' : 'Play ambient music'}
        style={{
          background: 'none',
          border: '1px solid rgba(0,255,65,0.35)',
          borderRadius: '4px',
          color: playing ? '#00ff41' : 'rgba(0,255,65,0.5)',
          cursor: 'pointer',
          padding: '3px 8px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          lineHeight: 1,
          transition: 'all 0.2s ease',
          flexShrink: 0,
          boxShadow: playing ? '0 0 10px rgba(0,255,65,0.25)' : 'none',
        }}
      >
        {playing ? '⏸' : '▶'}
      </button>
      {/* Waveform bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '16px', flexShrink: 0 }}>
        {barsRef.current.map((h, i) => (
          <div key={i} style={{
            width: '3px',
            height: playing ? `${h * 16}px` : '3px',
            background: playing ? '#00ff41' : 'rgba(0,255,65,0.25)',
            borderRadius: '2px',
            transition: playing ? 'height 0.08s ease' : 'height 0.3s ease',
          }} />
        ))}
      </div>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: playing ? 'rgba(0,255,65,0.7)' : 'rgba(0,255,65,0.3)', letterSpacing: '0.1em', flexShrink: 0, transition: 'color 0.3s ease' }}>
        {playing ? 'AMBIENT.MP3' : 'MUSIC OFF'}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: 'min(180px, 30vw)' }}>
        <span style={{ color: 'rgba(0,255,65,0.35)', fontSize: '10px', flexShrink: 0 }}>
          {volume === 0 ? '🔇' : volume < 0.4 ? '🔈' : volume < 0.75 ? '🔉' : '🔊'}
        </span>
        <input
          type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume} title="Volume"
          style={{ flex: 1, appearance: 'none', height: '3px', borderRadius: '2px', background: `linear-gradient(90deg, #00ff41 ${volume * 100}%, rgba(0,255,65,0.15) ${volume * 100}%)`, outline: 'none', cursor: 'pointer', accentColor: '#00ff41' }}
        />
      </div>
    </div>

    {/* In-hero player — hidden when floated */}
    <div
      data-no-click-sound
      style={{ ...inHeroStyle, opacity: floated ? 0 : 1, pointerEvents: floated ? 'none' : 'auto', transition: 'opacity 0.3s ease, box-shadow 0.4s ease' }}
    >
      {/* Play / pause button */}
      <button
        onClick={togglePlay}
        title={playing ? 'Pause music' : 'Play ambient music'}
        style={{
          background: 'none',
          border: '1px solid rgba(0,255,65,0.35)',
          borderRadius: '4px',
          color: playing ? '#00ff41' : 'rgba(0,255,65,0.5)',
          cursor: 'pointer',
          padding: '4px 8px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          lineHeight: 1,
          transition: 'all 0.2s ease',
          flexShrink: 0,
          boxShadow: playing ? '0 0 10px rgba(0,255,65,0.25)' : 'none',
        }}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* Waveform bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '18px', flexShrink: 0 }}>
        {barsRef.current.map((h, i) => (
          <div
            key={i}
            style={{
              width: '3px',
              height: playing ? `${h * 18}px` : '4px',
              background: playing ? '#00ff41' : 'rgba(0,255,65,0.25)',
              borderRadius: '2px',
              transition: playing ? 'height 0.08s ease' : 'height 0.3s ease',
              boxShadow: playing ? '0 0 4px rgba(0,255,65,0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Track label */}
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '9px',
        color: playing ? 'rgba(0,255,65,0.7)' : 'rgba(0,255,65,0.3)',
        letterSpacing: '0.1em',
        flexShrink: 0,
        transition: 'color 0.3s ease',
      }}>
        {playing ? 'AMBIENT.MP3' : 'MUSIC OFF'}
      </span>

      {/* Volume slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
        <span style={{ color: 'rgba(0,255,65,0.35)', fontSize: '10px', flexShrink: 0 }}>
          {volume === 0 ? '🔇' : volume < 0.4 ? '🔈' : volume < 0.75 ? '🔉' : '🔊'}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          title="Volume"
          style={{
            flex: 1,
            appearance: 'none',
            height: '3px',
            borderRadius: '2px',
            background: `linear-gradient(90deg, #00ff41 ${volume * 100}%, rgba(0,255,65,0.15) ${volume * 100}%)`,
            outline: 'none',
            cursor: 'pointer',
            accentColor: '#00ff41',
          }}
        />
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #00ff41;
          box-shadow: 0 0 6px rgba(0,255,65,0.6);
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border: none;
          border-radius: 50%;
          background: #00ff41;
          box-shadow: 0 0 6px rgba(0,255,65,0.6);
          cursor: pointer;
        }
      `}</style>
    </div>
    </> /* end Fragment */
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        backgroundColor: '#030712',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0',
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Corner decorators */}
      {['topleft', 'topright', 'bottomleft', 'bottomright'].map((pos) => (
        <div key={pos} style={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderColor: 'rgba(0,255,65,0.4)',
          borderStyle: 'solid',
          borderWidth: 0,
          ...(pos.includes('top') ? { top: 20, borderTopWidth: 2 } : { bottom: 20, borderBottomWidth: 2 }),
          ...(pos.includes('left') ? { left: 20, borderLeftWidth: 2 } : { right: 20, borderRightWidth: 2 }),
          zIndex: 1,
        }} />
      ))}

      {/* Main content wrapper */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: '100vh',
        zIndex: 2,
        position: 'relative',
      }}
        className="hero-inner"
      >
        {/* ── Left: Text Content ─────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(2rem, 5vw, 5rem) clamp(1.5rem, 4vw, 4rem)',
            paddingRight: '2rem',
          }}
          className="hero-text-col"
        >
          {/* Eyebrow / byline (terminal) */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1rem' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(0.62rem, 1.1vw, 0.78rem)',
              color: '#00ff41',
              letterSpacing: '0.12em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              {'> SASWAT MISHRA · SENIOR ML ENGINEER · IIT DELHI'}
              <span className="cursor-blink" style={{ color: '#00ff41', fontWeight: 700 }}>█</span>
            </span>
          </motion.div>

          {/* Outcome-led headline (H1) — keeps the glitch signature */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1.1rem' }}>
            <h1 style={{ margin: 0, maxWidth: 620, lineHeight: 1.12 }}>
              <GlitchText
                text="AI agents that take the work your team shouldn't be doing off their plate."
                fontSize="clamp(1.45rem, 3.2vw, 2.5rem)"
              />
            </h1>
          </motion.div>

          {/* Buyer-named subhead */}
          <motion.p variants={itemVariants} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
            color: '#a7b2c4',
            lineHeight: 1.7,
            marginBottom: '1.4rem',
            maxWidth: 540,
            borderLeft: '2px solid rgba(0,255,65,0.3)',
            paddingLeft: '1rem',
          }}>
            Custom multi-agent systems, voice AI &amp; RAG for B2B SaaS and services teams —
            built by a senior ML engineer (IIT Delhi) who ships production-grade AI, not demos.
          </motion.p>

          {/* One proof signal (hard metric) */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1.6rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(0.72rem, 1.3vw, 0.85rem)',
              color: '#e2e8f0',
              background: 'rgba(0,255,65,0.08)',
              border: '1px solid rgba(0,255,65,0.4)',
              borderRadius: '3px',
              padding: '0.5rem 0.9rem',
              boxShadow: '0 0 14px rgba(0,255,65,0.12)',
            }}>
              <span style={{ color: '#00ff41', fontWeight: 700 }}>▸ PROVEN</span>
              <strong style={{ color: '#00ff41' }}>12-agent system → 31 leads in 28 days</strong>
            </span>
          </motion.div>

          {/* Primary CTA (first-person, high-contrast) + risk-reversal microcopy + secondary */}
          <motion.div variants={itemVariants}>
            <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to={SITE.cta.href}
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(0.72rem, 1.2vw, 0.82rem)',
                  letterSpacing: '0.08em',
                  color: '#030712',
                  backgroundColor: '#00ff41',
                  border: '1px solid #00ff41',
                  padding: '0.85rem 1.6rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 0 24px rgba(0,255,65,0.45), inset 0 0 20px rgba(0,255,65,0.1)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 44px rgba(0,255,65,0.7), inset 0 0 30px rgba(0,255,65,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(0,255,65,0.45), inset 0 0 20px rgba(0,255,65,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {SITE.cta.label} →
              </Link>
              <Link
                to="/work"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(0.72rem, 1.2vw, 0.82rem)',
                  letterSpacing: '0.08em',
                  color: '#00d4ff',
                  backgroundColor: 'transparent',
                  border: '1px solid #00d4ff',
                  padding: '0.85rem 1.4rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 0 15px rgba(0,212,255,0.2)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                See case studies
              </Link>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#5a6678', marginTop: '0.85rem', letterSpacing: '0.04em' }}>
              {SITE.cta.microcopy}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: 3D Canvas ────────────────────────────── */}
        <div style={{
          flex: '0 0 50%',
          position: 'relative',
          minHeight: '100vh',
          background: '#030712',
        }}
          className="hero-canvas-col"
        >
          {/* Scanline overlay on canvas */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.015) 3px, rgba(0,255,65,0.015) 4px)',
            pointerEvents: 'none',
            zIndex: 3,
          }} />

          {/* Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,0.7) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Static poster image is the LCP element; Three.js loads deferred
              (after load/on-view) and only on desktop with motion allowed. */}
          <HeroVisual />

          {/* HUD decorators */}
          <div style={{
            position: 'absolute',
            top: '5%',
            right: '5%',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(0,255,65,0.5)',
            zIndex: 4,
            textAlign: 'right',
            lineHeight: 1.8,
            pointerEvents: 'none',
          }}>
            <div>SYS: ACTIVE</div>
            <div>MDL: v2.4.1</div>
            <div>FPS: --</div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '14%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(0,212,255,0.5)',
            zIndex: 4,
            textAlign: 'center',
            pointerEvents: 'none',
            letterSpacing: '0.15em',
          }}>
            DRAG TO ROTATE
          </div>

          {/* Ambient music player */}
          <MusicPlayer />
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '25%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 5,
        }}
      >
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: 'rgba(0,255,65,0.4)',
          letterSpacing: '0.2em',
        }}>SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{ width: 1, height: 32, backgroundColor: 'rgba(0,255,65,0.4)' }}
        />
      </motion.div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-inner {
            flex-direction: column !important;
            min-height: auto !important;
          }
          /* Conversion content FIRST on mobile (headline + CTA + proof above the
             fold); the 3D/poster column peeks below it (no false floor). */
          .hero-text-col {
            flex: none !important;
            order: -1;
            padding: 4.75rem 1.2rem 1.25rem !important;
          }
          .hero-canvas-col {
            flex: 0 0 40vh !important;
            min-height: 40vh !important;
            order: 0;
          }
        }
        @media (max-width: 480px) {
          .hero-canvas-col {
            flex: 0 0 34vh !important;
            min-height: 34vh !important;
          }
          .hero-text-col {
            padding: 4.5rem 1rem 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
