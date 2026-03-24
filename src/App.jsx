import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import CursorTrail from './components/Cursor/CursorTrail.jsx';
import StarField from './components/Background/StarField.jsx';
import Navbar from './components/Nav/Navbar.jsx';

// Lazy-load all heavy sections for code-splitting
const HeroSection       = lazy(() => import('./components/Hero/HeroSection.jsx'));
const AboutSection      = lazy(() => import('./components/About/AboutSection.jsx'));
const ExperienceSection = lazy(() => import('./components/Experience/ExperienceSection.jsx'));
const ProjectsSection   = lazy(() => import('./components/Projects/ProjectsSection.jsx'));
const SkillsSection     = lazy(() => import('./components/Skills/SkillsSection.jsx'));
const TestimonialsSection = lazy(() => import('./components/Testimonials/TestimonialsSection.jsx'));
const ContactSection    = lazy(() => import('./components/Contact/ContactSection.jsx'));
const Footer            = lazy(() => import('./components/Footer/Footer.jsx'));

// ─── Terminal Boot Screen ─────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: 'BIOS v2.4.1 — POST check... OK', delay: 0 },
  { text: 'Initializing kernel modules...', delay: 280 },
  { text: 'Loading neural interface drivers... OK', delay: 560 },
  { text: 'Mounting encrypted filesystem...', delay: 820 },
  { text: 'Starting quantum process scheduler... OK', delay: 1050 },
  { text: 'Connecting to neural network... OK', delay: 1280 },
  { text: 'Calibrating holographic display matrix...', delay: 1500 },
  { text: 'Loading AI/ML runtime environment... OK', delay: 1720 },
  { text: 'Bootstrapping saswat.portfolio.exe...', delay: 1950 },
  { text: '> SYSTEM READY — Welcome, Agent.', delay: 2250, highlight: true },
];

function BootScreen({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [barProgress, setBarProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, line]);
          setBarProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        }, line.delay)
      );
    });

    // Start fade-out shortly after last line
    const lastDelay = BOOT_LINES[BOOT_LINES.length - 1].delay;
    timers.push(setTimeout(() => setFadeOut(true), lastDelay + 600));
    timers.push(setTimeout(() => onDone(), lastDelay + 1100));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
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
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Scan lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: 'min(640px, 90vw)', padding: '0 1rem' }}>
        {/* Logo */}
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 900,
            color: '#00ff41',
            textShadow: '0 0 20px #00ff41, 0 0 40px rgba(0,255,65,0.5)',
            marginBottom: '2rem',
            letterSpacing: '0.15em',
          }}
        >
          SM
          <span
            style={{
              fontSize: '0.35em',
              color: '#00d4ff',
              textShadow: '0 0 10px #00d4ff',
              marginLeft: '1em',
              verticalAlign: 'middle',
              letterSpacing: '0.05em',
            }}
          >
            PORTFOLIO OS
          </span>
        </div>

        {/* Boot log */}
        <div
          style={{
            background: 'rgba(0,255,65,0.04)',
            border: '1px solid rgba(0,255,65,0.2)',
            borderRadius: '4px',
            padding: '1.2rem 1.4rem',
            minHeight: '260px',
            marginBottom: '1.5rem',
            boxShadow: '0 0 20px rgba(0,255,65,0.08)',
          }}
        >
          {visibleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.78rem',
                lineHeight: 1.8,
                color: line.highlight ? '#00ff41' : 'rgba(226,232,240,0.8)',
                textShadow: line.highlight ? '0 0 8px #00ff41' : 'none',
                fontWeight: line.highlight ? 600 : 400,
              }}
            >
              <span style={{ color: '#00d4ff', opacity: 0.7 }}>[{String(i).padStart(2, '0')}]</span>{' '}
              {line.text}
              {i === visibleLines.length - 1 && !line.highlight && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '14px',
                    background: '#00ff41',
                    marginLeft: '3px',
                    verticalAlign: 'middle',
                    animation: 'blink 0.8s step-end infinite',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '4px',
              background: 'rgba(0,255,65,0.15)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${barProgress}%`,
                background: 'linear-gradient(90deg, #00ff41, #00d4ff)',
                boxShadow: '0 0 10px rgba(0,255,65,0.6)',
                transition: 'width 0.25s ease',
                borderRadius: '2px',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#00ff41',
              minWidth: '38px',
              textAlign: 'right',
              textShadow: '0 0 8px #00ff41',
            }}
          >
            {barProgress}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Section fallback while lazy chunk loads ──────────────────────────────────
function SectionFallback() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(0,255,65,0.5)',
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
      }}
    >
      <span style={{ animation: 'pulse 1.2s ease-in-out infinite' }}>
        loading module...
      </span>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [booted, setBooted] = useState(false);
  const clickAudioRef = useRef(null);

  // ── Global click sound (audio pool — prevents cutoff on rapid clicks) ────────
  useEffect(() => {
    const POOL_SIZE = 5;
    const VOLUME = 0.32;
    // Pre-create a pool of Audio instances so rapid clicks overlap cleanly
    const pool = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio('/audio/click.mp3');
      a.volume = VOLUME;
      a.preload = 'auto';
      return a;
    });
    clickAudioRef.current = pool;
    let idx = 0;

    const playClick = (e) => {
      // Opt-out: elements (or ancestors) with data-no-click-sound skip the SFX
      if (e.target.closest?.('[data-no-click-sound]')) return;
      const audio = pool[idx % POOL_SIZE];
      audio.currentTime = 0;
      audio.play().catch(() => {});
      idx++;
    };

    document.addEventListener('click', playClick);
    return () => document.removeEventListener('click', playClick);
  }, []);

  return (
    <>
      {/* Always-present canvas overlays */}
      <CursorTrail />
      <StarField />

      {/* Terminal boot screen — shown until animation completes */}
      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      {/* Main content — mounted early so sections can pre-render */}
      <div
        style={{
          opacity: booted ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: booted ? 'all' : 'none',
        }}
      >
        <Navbar />

        <main>
          <Suspense fallback={<SectionFallback />}>
            <HeroSection />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <TestimonialsSection />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <AboutSection />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <ExperienceSection />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <ProjectsSection />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <SkillsSection />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <ContactSection />
          </Suspense>

          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </main>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
