import { useRef, useEffect, useState, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Environment, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ─── 3D Model Component ────────────────────────────────────────────────────────
function AvatarModel() {
  const group = useRef();
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/model.glb`);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (names.length > 0) {
      const firstAction = actions[names[0]];
      if (firstAction) {
        firstAction.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={1.3} position={[0, -1.1, 0]} />
    </group>
  );
}

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Dark scene background */}
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 10, 25]} />

      {/* Lighting — bright green sci-fi illumination for avatar visibility */}
      <ambientLight intensity={1.2} color="#1a4a2a" />

      {/* Key light — very strong front-facing white/green to illuminate face */}
      <pointLight position={[0, 1.8, 4]} intensity={8} color="#c8ffd4" distance={12} decay={1.5} />
      {/* Fill light — bright green from front-left */}
      <pointLight position={[-1.5, 1, 3]} intensity={5} color="#00ff41" distance={10} decay={1.5} />
      {/* Fill light — bright cyan from front-right */}
      <pointLight position={[1.5, 0.5, 3]} intensity={4} color="#00d4ff" distance={10} decay={1.5} />
      {/* Rim light — top-down directional for overhead fill */}
      <directionalLight position={[0, 6, 3]} intensity={2.5} color="#00ff88" />
      {/* Side rim for edge definition */}
      <directionalLight position={[4, 3, 1]} intensity={1.5} color="#00ff41" />
      {/* Under/bounce light */}
      <pointLight position={[0, -0.5, 2]} intensity={2.5} color="#00ff41" distance={6} decay={1.5} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={false}
      />

      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4}>
        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>
      </Float>
    </>
  );
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
function useTypewriter(texts, speed = 80, pause = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return displayText;
}

// ─── Glitch Text Component ────────────────────────────────────────────────────
function GlitchText({ text }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glitch-container" style={{ position: 'relative', display: 'inline-block' }}>
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
        fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
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
            fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
            letterSpacing: '0.05em',
            lineHeight: 1.1,
          }}>{text}</span>
          <span className="glitch-after" aria-hidden="true" style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
            letterSpacing: '0.05em',
            lineHeight: 1.1,
          }}>{text}</span>
        </>
      )}
    </div>
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
  const subtitles = [
    'Senior AI/ML Engineer',
    'Gen AI Architect',
    'Multi-Agent Systems Builder',
    'Product Manager',
  ];
  const typewriterText = useTypewriter(subtitles, 75, 1800);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const stats = [
    { value: '5+', label: 'YRS EXP' },
    { value: '10+', label: 'AI PROJECTS' },
    { value: '$60', label: '/HR RATE' },
    { value: 'IIT', label: 'DELHI' },
  ];

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
          {/* Initializing label */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
              color: '#00ff41',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}>
              {'> INITIALIZING SASWAT.EXE...'}
              <span className="cursor-blink" style={{ color: '#00ff41', fontWeight: 700 }}>█</span>
            </span>
          </motion.div>

          {/* Main heading with glitch */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1rem' }}>
            <GlitchText text="SASWAT" />
            <br />
            <GlitchText text="MISHRA" />
          </motion.div>

          {/* Typewriter subtitle */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem', minHeight: '2rem' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)',
              color: '#00d4ff',
              letterSpacing: '0.05em',
            }}>
              {'// '}
              {typewriterText}
              <span className="cursor-blink" style={{ color: '#00d4ff', marginLeft: 2 }}>|</span>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p variants={itemVariants} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.78rem, 1.3vw, 0.95rem)',
            color: '#8892a4',
            lineHeight: 1.8,
            marginBottom: '2rem',
            maxWidth: 480,
            borderLeft: '2px solid rgba(0,255,65,0.3)',
            paddingLeft: '1rem',
          }}>
            IIT Delhi engineer building AI that thinks, speaks &amp; acts — from
            multi-agent sales bots to MetaHumans to real-time pose tracking.
            Rising Talent on Upwork. Shipping production-grade AI across industries.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
          }}>
            <a
              href="#projects"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.15em',
                color: '#030712',
                backgroundColor: '#00ff41',
                border: '1px solid #00ff41',
                padding: '0.75rem 1.8rem',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 0 20px rgba(0,255,65,0.35), inset 0 0 20px rgba(0,255,65,0.1)',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,65,0.6), inset 0 0 30px rgba(0,255,65,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.35), inset 0 0 20px rgba(0,255,65,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              VIEW MY WORK
            </a>
            <a
              href="#contact"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.15em',
                color: '#00d4ff',
                backgroundColor: 'transparent',
                border: '1px solid #00d4ff',
                padding: '0.75rem 1.8rem',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 0 15px rgba(0,212,255,0.2)',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              HIRE ME
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} style={{
            display: 'flex',
            gap: 'clamp(1rem, 2.5vw, 2rem)',
            flexWrap: 'wrap',
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '2px solid rgba(0,255,65,0.4)',
                paddingLeft: '0.75rem',
              }}>
                <span style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                  color: '#00ff41',
                  lineHeight: 1.1,
                  textShadow: '0 0 10px rgba(0,255,65,0.5)',
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: '#4a5568',
                  letterSpacing: '0.1em',
                  marginTop: '0.2rem',
                }}>
                  {stat.label}
                </span>
              </div>
            ))}
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

          <Canvas
            camera={{ position: [0, 0.2, 5.5], fov: 52 }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            gl={{
              alpha: true,
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.4,
            }}
            onCreated={({ gl, scene }) => {
              gl.setClearColor(0x030712, 1);
              scene.background = new THREE.Color('#030712');
            }}
          >
            <Scene />
          </Canvas>

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
          }
          .hero-canvas-col {
            flex: 0 0 55vh !important;
            min-height: 55vh !important;
            order: -1;
          }
          .hero-text-col {
            flex: none !important;
            padding: 1.5rem 1.2rem 5rem !important;
          }
        }
        @media (max-width: 480px) {
          .hero-canvas-col {
            flex: 0 0 45vh !important;
            min-height: 45vh !important;
          }
          .hero-text-col {
            padding: 1.2rem 1rem 4.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/model.glb`);
