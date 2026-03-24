import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Module-level layout constants ────────────────────────────────────────────
const CARD_WIDTH = 500;
const CARD_GAP = 40;
const TRACK_PADDING = 80;

// ─── Tag Pill ─────────────────────────────────────────────────────────────────
function TagPill({ label }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.62rem',
      color: '#00d4ff',
      backgroundColor: 'rgba(0,212,255,0.08)',
      border: '1px solid rgba(0,212,255,0.25)',
      borderRadius: 2,
      padding: '0.2rem 0.55rem',
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

// ─── Horizontal Timeline Card ─────────────────────────────────────────────────
function HTimelineCard({ entry, index, position, leftOffset }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const isCurrent = entry.current;
  const glowColor = isCurrent ? '#00ff41' : '#00d4ff';
  const glowRgb = isCurrent ? '0,255,65' : '0,212,255';
  const isBelow = position === 'below';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: isBelow ? -30 : 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      style={{
        position: 'absolute',
        left: leftOffset,
        width: CARD_WIDTH,
        ...(isBelow
          ? { top: 'calc(50%)' }
          : { bottom: 'calc(50%)' }
        ),
      }}
    >
      {/* Dot on the timeline track */}
      <div style={{
        position: 'absolute',
        ...(isBelow
          ? { top: '-1px', bottom: 'auto', transform: 'translate(-50%, -50%)' }
          : { bottom: '-1px', top: 'auto', transform: 'translate(-50%, 50%)' }),
        left: '50%',
        width: 14,
        height: 14,
        borderRadius: '50%',
        backgroundColor: glowColor,
        boxShadow: `0 0 12px 3px rgba(${glowRgb},0.7)`,
        zIndex: 3,
        border: '2px solid #030712',
      }} />

      {/* Connector line from card to dot */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 2,
        height: '1.5rem',
        background: `linear-gradient(${isBelow ? '0deg' : '180deg'}, rgba(${glowRgb},0.5), transparent)`,
        ...(isBelow
          ? { top: '-1.5rem', bottom: 'auto' }
          : { bottom: '-1.5rem', top: 'auto' }),
        zIndex: 2,
      }} />

      {/* Card */}
      <motion.div
        whileHover={{
          borderColor: glowColor,
          boxShadow: `0 0 40px rgba(${glowRgb},0.2), 0 20px 50px rgba(0,0,0,0.5)`,
          transition: { duration: 0.25 },
        }}
        style={{
          backgroundColor: '#0a0f1a',
          border: `1px solid ${isCurrent ? 'rgba(0,255,65,0.35)' : 'rgba(0,212,255,0.2)'}`,
          borderRadius: 4,
          padding: '1.5rem',
          width: '100%',
          position: 'relative',
          boxShadow: `0 0 ${isCurrent ? '30px' : '15px'} rgba(${glowRgb},${isCurrent ? '0.08' : '0.04'}), 0 20px 40px rgba(0,0,0,0.4)`,
          ...(isBelow ? { marginTop: '2rem' } : { marginBottom: '2rem' }),
        }}
      >
        {/* Current badge */}
        {isCurrent && (
          <div style={{
            position: 'absolute',
            top: '-1px',
            right: 16,
            backgroundColor: '#00ff41',
            color: '#030712',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            padding: '0.2rem 0.6rem',
            borderRadius: '0 0 3px 3px',
          }}>
            ACTIVE
          </div>
        )}

        {/* Year label */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: glowColor,
          opacity: 0.7,
          letterSpacing: '0.12em',
          marginBottom: '0.75rem',
        }}>
          {entry.dates.split('—')[0].trim()}
        </div>

        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '0.9rem' }}>
          <span style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0 }}>{entry.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: '#e2e8f0',
              letterSpacing: '0.05em',
              marginBottom: '0.2rem',
              lineHeight: 1.3,
            }}>
              {entry.company}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: isCurrent ? '#00ff41' : '#00d4ff',
              marginBottom: '0.15rem',
            }}>
              {entry.role}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem',
              color: 'rgba(160,174,192,0.5)',
              letterSpacing: '0.05em',
            }}>
              {entry.dates}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {entry.tags.map((tag) => <TagPill key={tag} label={tag} />)}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, rgba(${glowRgb},0.3), transparent)`,
          marginBottom: '0.9rem',
        }} />

        {/* Achievements */}
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {entry.achievements.map((achievement, i) => (
            <li key={i} style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: i < entry.achievements.length - 1 ? '0.5rem' : 0,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.72rem',
              color: '#8892a4',
              lineHeight: 1.55,
            }}>
              <span style={{ color: '#00ff41', flexShrink: 0, marginTop: '0.05rem' }}>{'>'}</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

// ─── Experience Section ───────────────────────────────────────────────────────
export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [scrollProgress, setScrollProgress] = useState(0);

  const experiences = [
    {
      icon: '🤖',
      company: 'Senior AI/ML Engineer',
      role: 'Freelancer — Self-Employed',
      dates: 'May 2025 — Present',
      current: true,
      tags: ['Gen AI', 'LangChain', 'Voice AI', 'Computer Vision', 'LLMs'],
      achievements: [
        'Built AI Avatar Pipeline for B2B marketing using HeyGen + ElevenLabs',
        'Developed Podit: AI voice multi-agent scheduling app',
        'Real-time AI avatar system with MetaHuman + NVIDIA ACE',
        'Rising Talent on Upwork with 5-star client reviews',
      ],
    },
    {
      icon: '🏠',
      company: 'Movin Homes',
      role: 'Co-founder & CPO',
      dates: 'Dec 2024 — Sep 2025',
      current: false,
      tags: ['Real Estate', 'React', 'Python', 'AI', 'Streamlit'],
      achievements: [
        'Tested 10+ product ideas through deep market analysis',
        'Finalist at South Park Commons Fall 2025 batch',
        'Built broker network of 100+ partners',
        'Executed property transaction in 7 days at 12% profit',
      ],
    },
    {
      icon: '🎮',
      company: 'Creatospace',
      role: 'Founder',
      dates: 'Jul 2021 — Nov 2024',
      current: false,
      tags: ['Unreal Engine', 'AWS GameLift', 'Multiplayer', '3D Metaverse', 'Lambda'],
      achievements: [
        'Built cross-platform multiplayer 3D metaverse (iOS/Windows/Android)',
        'Grew to 1200+ users, 110+ MAUs',
        'Partnered with AjnaLens for VR headset distribution',
        'Built with AWS GameLift + Lambda, improved FPS by 35%',
      ],
    },
    {
      icon: '📡',
      company: 'Nokia',
      role: 'Data Science Intern',
      dates: 'May 2019 — Jul 2019',
      current: false,
      tags: ['Python', 'ML', 'K-means', 'Data Science', 'KPI Optimization'],
      achievements: [
        'Optimized KPIs using 200+ variables with K-means clustering',
        'Predicted operational cycles (45–50 min) for location optimization',
      ],
    },
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  // Scroll-driven horizontal translation
  // The section is tall enough to allow scrolling through all cards
  const totalTrackWidth = experiences.length * (CARD_WIDTH + CARD_GAP) + TRACK_PADDING * 2;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;

      // Progress from 0 (section top at viewport bottom) to 1 (section bottom at viewport top)
      const totalScrollable = sectionHeight - windowHeight;
      // We want scroll to start when section enters fully and end when it exits
      const entered = -rect.top; // how many px we've scrolled past the section top
      const progress = Math.max(0, Math.min(1, entered / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate how far to translate: from 0 to -(totalTrackWidth - viewport width)
  const maxTranslate = totalTrackWidth - (typeof window !== 'undefined' ? window.innerWidth : 1200) + 120;
  const translateX = -scrollProgress * Math.max(0, maxTranslate);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        backgroundColor: '#030712',
        // Extra height creates scroll room for the horizontal animation
        minHeight: '600vh',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse-line {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
      `}</style>

      {/* Background accents */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '15%',
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,65,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Sticky container that pins while the section scrolls */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem) 0',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          {/* Section header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{ marginBottom: '3rem' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                color: '#00ff41',
              }}>
                {'> career_log.json'}
              </span>
              <span style={{
                display: 'inline-block',
                width: 10,
                height: '1.2em',
                backgroundColor: '#00ff41',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }} />
            </div>
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, rgba(0,255,65,0.5), rgba(0,212,255,0.3), transparent)',
              maxWidth: 600,
              marginBottom: '1rem',
            }} />
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.78rem',
              color: 'rgba(160,174,192,0.6)',
              letterSpacing: '0.05em',
            }}>
              {`// ${experiences.length} entries loaded — sorted by recency DESC — scroll to traverse`}
            </p>
          </motion.div>
        </div>

        {/* Horizontal scrolling track */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Horizontal timeline track line — centered vertically */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, #00ff41 0%, rgba(0,212,255,0.6) 60%, rgba(0,212,255,0.1) 100%)',
              animation: 'pulse-line 3s ease-in-out infinite',
              zIndex: 1,
            }}
          />

          {/* The moving strip — cards absolutely positioned above and below the timeline */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${experiences.length * (CARD_WIDTH + CARD_GAP) + TRACK_PADDING * 2}px`,
              height: '100%',
              transform: `translateX(${translateX}px)`,
              transition: 'transform 0.05s linear',
              willChange: 'transform',
            }}
          >
            {experiences.map((entry, i) => (
              <HTimelineCard
                key={entry.company}
                entry={entry}
                index={i}
                position={i % 2 === 0 ? 'above' : 'below'}
                leftOffset={TRACK_PADDING + i * (CARD_WIDTH + CARD_GAP)}
              />
            ))}
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: scrollProgress >= 0.7 ? 0 : 0.6 * (1 - scrollProgress / 0.7),
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: '#00ff41',
            letterSpacing: '0.12em',
          }}>
            SCROLL TO TRAVERSE TIMELINE
          </span>
          <div style={{
            width: '120px',
            height: '2px',
            background: 'rgba(0,255,65,0.15)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${scrollProgress * 100}%`,
              background: '#00ff41',
              borderRadius: '1px',
              transition: 'width 0.1s linear',
            }} />
          </div>
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: 'center',
            padding: '1.5rem 0 2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <a
            href="#contact"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#030712',
              backgroundColor: '#00ff41',
              border: '1px solid #00ff41',
              padding: '0.7rem 1.8rem',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 0 20px rgba(0,255,65,0.35)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,65,0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.35)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            HIRE ME
          </a>
          <a
            href="/resume.pdf"
            download
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#00d4ff',
              backgroundColor: 'transparent',
              border: '1px solid rgba(0,212,255,0.5)',
              padding: '0.7rem 1.8rem',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 0 10px rgba(0,212,255,0.15)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.08)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0,212,255,0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(0,212,255,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            DOWNLOAD RESUME
          </a>
        </motion.div>
      </div>
    </section>
  );
}
