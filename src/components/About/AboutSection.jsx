import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// ─── Typing animation hook ────────────────────────────────────────────────────
function useTerminalTyping(lines, startDelay = 400) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];

    if (currentChar < line.length) {
      const t = setTimeout(() => {
        setVisibleLines((prev) => {
          const updated = [...prev];
          updated[currentLine] = (updated[currentLine] || '') + line[currentChar];
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 80);
      return () => clearTimeout(t);
    }
  }, [started, currentLine, currentChar, lines]);

  return { visibleLines, isComplete: currentLine >= lines.length };
}

// ─── Progress Bar Component ───────────────────────────────────────────────────
function SkillBar({ label, percentage, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        width: `${percentage}%`,
        transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay },
      });
    }
  }, [isInView, controls, percentage, delay]);

  return (
    <div ref={ref} style={{ marginBottom: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.35rem',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.78rem',
          color: '#a0aec0',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: '#00ff41',
        }}>
          {percentage}%
        </span>
      </div>
      <div style={{
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0,255,65,0.1)',
        position: 'relative',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00ff41, #00d4ff)',
            borderRadius: 3,
            boxShadow: '0 0 8px rgba(0,255,65,0.6)',
            position: 'relative',
          }}
        >
          {/* Shimmer */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', delay: delay + 1.4 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Achievement Badge ────────────────────────────────────────────────────────
function Badge({ icon, text }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.04, y: -2 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.6rem 1.1rem',
        border: `1px solid ${hovered ? '#00ff41' : 'rgba(0,255,65,0.3)'}`,
        backgroundColor: hovered ? 'rgba(0,255,65,0.08)' : 'rgba(0,255,65,0.03)',
        borderRadius: 2,
        transition: 'border-color 0.2s, background-color 0.2s',
        boxShadow: hovered ? '0 0 16px rgba(0,255,65,0.25)' : 'none',
        cursor: 'default',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.72rem',
        color: hovered ? '#00ff41' : '#a0aec0',
        letterSpacing: '0.06em',
        transition: 'color 0.2s',
      }}>
        {text}
      </span>
    </motion.div>
  );
}

// ─── Terminal Window ──────────────────────────────────────────────────────────
function TerminalWindow({ isInView }) {
  const profileLines = [
    'NAME: Saswat Mishra',
    'LOCATION: New Delhi, India',
    'EDUCATION: IIT Delhi (Industrial Eng + Entrepreneurship)',
    'ROLE: Senior AI/ML Engineer | Product Manager',
    'EXPERIENCE: 5+ years building AI/tech products',
    'RANK: JEE Advanced AIR-2495 | JEE Mains AIR-1331',
    'PHILOSOPHY: "Build AI that creates real value for end users"',
  ];

  const { visibleLines, isComplete } = useTerminalTyping(
    profileLines,
    isInView ? 600 : 999999
  );

  const [showCommand, setShowCommand] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setShowCommand(true), 300);
    const t2 = setTimeout(() => setShowOutput(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView]);

  return (
    <div style={{
      backgroundColor: '#0a0f1a',
      border: '1px solid rgba(0,255,65,0.2)',
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '0 0 30px rgba(0,255,65,0.08), 0 20px 60px rgba(0,0,0,0.5)',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(0,255,65,0.1)',
      }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffbd2e', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#28ca41', display: 'inline-block' }} />
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.65rem',
          color: 'rgba(0,255,65,0.5)',
          letterSpacing: '0.08em',
        }}>
          terminal@saswat:~
        </span>
      </div>

      {/* Terminal body */}
      <div style={{
        padding: '1.2rem 1.4rem',
        minHeight: 320,
        fontSize: '0.8rem',
        lineHeight: 1.8,
      }}>
        {/* Previous command history */}
        <div style={{ color: 'rgba(0,255,65,0.35)', marginBottom: '0.4rem' }}>
          Last login: {new Date().toDateString()}
        </div>

        {showCommand && (
          <div style={{ marginBottom: '0.6rem' }}>
            <span style={{ color: '#00ff41' }}>saswat@terminal</span>
            <span style={{ color: '#a0aec0' }}>:</span>
            <span style={{ color: '#00d4ff' }}>~</span>
            <span style={{ color: '#a0aec0' }}>$ </span>
            <span style={{ color: '#e2e8f0' }}>cat about_me.txt</span>
          </div>
        )}

        {showOutput && (
          <div>
            {profileLines.map((line, i) => {
              const visible = visibleLines[i] || '';
              const isCurrentlyTyping = i === visibleLines.length - 1 && !isComplete;
              if (i >= visibleLines.length && visibleLines.length < profileLines.length) {
                return null;
              }
              if (!visible && i >= visibleLines.length) return null;

              const [key, ...valueParts] = (visibleLines[i] || '').split(':');
              const value = valueParts.join(':');

              return (
                <div key={i} style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {value !== undefined ? (
                    <>
                      <span style={{ color: '#00d4ff', minWidth: 120 }}>{key}:</span>
                      <span style={{ color: '#e2e8f0' }}>{value}</span>
                    </>
                  ) : (
                    <span style={{ color: '#e2e8f0' }}>{visible}</span>
                  )}
                  {isCurrentlyTyping && (
                    <span style={{
                      display: 'inline-block',
                      width: 8,
                      height: '1em',
                      backgroundColor: '#00ff41',
                      marginLeft: 1,
                      verticalAlign: 'text-bottom',
                      animation: 'blink 0.8s step-end infinite',
                    }} />
                  )}
                </div>
              );
            })}

            {isComplete && (
              <div style={{ marginTop: '0.6rem' }}>
                <span style={{ color: '#00ff41' }}>saswat@terminal</span>
                <span style={{ color: '#a0aec0' }}>:</span>
                <span style={{ color: '#00d4ff' }}>~</span>
                <span style={{ color: '#a0aec0' }}>$ </span>
                <span style={{
                  display: 'inline-block',
                  width: 8,
                  height: '1em',
                  backgroundColor: '#00ff41',
                  verticalAlign: 'text-bottom',
                  animation: 'blink 0.8s step-end infinite',
                }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '0px' });

  const skills = [
    { label: 'Gen AI & LLMs', percentage: 95 },
    { label: 'Multi-Agent Systems', percentage: 92 },
    { label: 'Computer Vision', percentage: 88 },
    { label: 'Product Strategy', percentage: 90 },
    { label: 'React / Node.js', percentage: 85 },
    { label: 'Unreal Engine 5', percentage: 80 },
  ];

  const badges = [
    { icon: '🎓', text: 'IIT Delhi Alumni' },
    { icon: '🏆', text: 'JEE Top 2500' },
    { icon: '⚡', text: 'KVPY AIR-429' },
    { icon: '🥇', text: 'ICC Hackathon Top 30' },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        backgroundColor: '#030712',
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        {/* Section header */}
        <motion.div variants={itemVariants} style={{ marginBottom: '3.5rem' }}>
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
              {'> about_me.exe'}
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
          }} />
        </motion.div>

        {/* Two column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          alignItems: 'start',
          marginBottom: '3rem',
        }}>
          {/* Left: Terminal */}
          <motion.div variants={itemVariants}>
            <TerminalWindow isInView={isInView} />
          </motion.div>

          {/* Right: Skills */}
          <motion.div variants={itemVariants}>
            <div style={{
              backgroundColor: '#0a0f1a',
              border: '1px solid rgba(0,255,65,0.15)',
              borderRadius: 4,
              padding: '1.8rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.8rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(0,255,65,0.12)',
              }}>
                <span style={{ color: '#00ff41', fontSize: '0.9rem' }}>{'///'}</span>
                <span style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#e2e8f0',
                  letterSpacing: '0.12em',
                }}>
                  CORE COMPETENCIES
                </span>
              </div>

              {/* Skill bars */}
              <div>
                {skills.map((skill, i) => (
                  <SkillBar
                    key={skill.label}
                    label={skill.label}
                    percentage={skill.percentage}
                    delay={i * 0.1}
                  />
                ))}
              </div>

              {/* Quick stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.8rem',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(0,255,65,0.1)',
              }}>
                {[
                  { val: '5+', lbl: 'Years Experience' },
                  { val: '10+', lbl: 'AI Projects' },
                ].map((item) => (
                  <div key={item.lbl} style={{
                    textAlign: 'center',
                    padding: '0.8rem',
                    backgroundColor: 'rgba(0,255,65,0.04)',
                    border: '1px solid rgba(0,255,65,0.1)',
                    borderRadius: 2,
                  }}>
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      color: '#00ff41',
                      textShadow: '0 0 10px rgba(0,255,65,0.4)',
                    }}>
                      {item.val}
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.62rem',
                      color: '#4a5568',
                      marginTop: '0.2rem',
                      letterSpacing: '0.06em',
                    }}>
                      {item.lbl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievement badges */}
        <motion.div variants={itemVariants}>
          <div style={{
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: 'rgba(0,212,255,0.7)',
              letterSpacing: '0.12em',
            }}>
              {'// achievements.json'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            {badges.map((badge, i) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'backOut' }}
              >
                <Badge icon={badge.icon} text={badge.text} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
