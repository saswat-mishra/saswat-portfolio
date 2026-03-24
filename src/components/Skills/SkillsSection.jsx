import { useEffect, useRef, useState } from 'react';

const SKILL_CATEGORIES = [
  {
    id: 'ai-ml',
    label: 'AI & ML',
    icon: '🤖',
    accentColor: '#00ff41',
    skills: [
      { name: 'LangChain / LangGraph', level: 95 },
      { name: 'OpenAI GPT-4/4o/5', level: 95 },
      { name: 'RAG Pipelines', level: 90 },
      { name: 'PyTorch / TensorFlow', level: 80 },
      { name: 'Hugging Face', level: 85 },
      { name: 'Prompt Engineering', level: 95 },
    ],
  },
  {
    id: 'computer-vision',
    label: 'Computer Vision',
    icon: '👁',
    accentColor: '#00d4ff',
    skills: [
      { name: 'OpenCV', level: 85 },
      { name: 'YOLOv8', level: 80 },
      { name: 'MediaPipe', level: 75 },
      { name: 'Pose Estimation', level: 75 },
    ],
  },
  {
    id: 'gen-ai',
    label: 'Generative AI',
    icon: '✨',
    accentColor: '#a855f7',
    skills: [
      { name: 'Stable Diffusion', level: 85 },
      { name: 'HeyGen (Video AI)', level: 90 },
      { name: 'ElevenLabs (TTS)', level: 90 },
      { name: 'DALL-E / Midjourney', level: 85 },
    ],
  },
  {
    id: 'cloud-backend',
    label: 'Cloud & Backend',
    icon: '☁',
    accentColor: '#f59e0b',
    skills: [
      { name: 'AWS (Lambda, GameLift)', level: 80 },
      { name: 'GCP', level: 70 },
      { name: 'Supabase / PostgreSQL', level: 85 },
      { name: 'Node.js / Python', level: 90 },
      { name: 'Vector DBs (Pinecone, Weaviate)', level: 80 },
    ],
  },
  {
    id: 'frontend-3d',
    label: 'Frontend & 3D',
    icon: '◈',
    accentColor: '#00d4ff',
    skills: [
      { name: 'React / React Native', level: 90 },
      { name: 'Unreal Engine 5', level: 80 },
      { name: 'Three.js', level: 75 },
      { name: 'TypeScript', level: 85 },
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: '⚙',
    accentColor: '#00ff41',
    skills: [
      { name: 'n8n', level: 85 },
      { name: 'LangGraph Agents', level: 90 },
      { name: 'Make.com', level: 80 },
      { name: 'Python Automation', level: 90 },
    ],
  },
];

function SkillBadge({ skill, accentColor, delay }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600 + delay);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);

  const hex = accentColor;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.skillBadge,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
        transition: `all 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
        background: hovered ? `${hex}25` : 'rgba(0, 255, 65, 0.1)',
        borderColor: hovered ? hex : 'rgba(0,255,65,0.4)',
        boxShadow: hovered
          ? `0 0 14px ${hex}40, 0 0 28px ${hex}15, inset 0 0 10px ${hex}08`
          : `0 0 4px rgba(0,255,65,0.1)`,
        color: '#00ff41',
      }}
    >
      <div
        style={{
          ...styles.badgeDot,
          background: hex,
          boxShadow: `0 0 6px ${hex}`,
          opacity: hovered ? 1 : 0.5,
        }}
      />
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          letterSpacing: '0.03em',
          transition: 'color 0.3s ease',
        }}
      >
        {skill.name}
      </span>
    </div>
  );
}

function CategoryBlock({ category, blockIndex }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500 + blockIndex * 100);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), blockIndex * 100);
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [blockIndex]);

  return (
    <div
      ref={ref}
      style={{
        ...styles.categoryBlock,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${blockIndex * 80}ms`,
        borderColor: 'rgba(0, 255, 65, 0.3)',
        boxShadow: '0 0 16px rgba(0,255,65,0.08), inset 0 0 20px rgba(0,255,65,0.02)',
      }}
    >
      {/* Category header */}
      <div style={styles.categoryHeader}>
        <div
          style={{
            ...styles.categoryIcon,
            color: category.accentColor,
            borderColor: `${category.accentColor}30`,
            background: `${category.accentColor}10`,
            textShadow: `0 0 10px ${category.accentColor}`,
          }}
        >
          {category.icon}
        </div>
        <div>
          <h3
            style={{
              ...styles.categoryLabel,
              color: category.accentColor,
              textShadow: `0 0 12px ${category.accentColor}60`,
            }}
          >
            {category.label}
          </h3>
          <div
            style={{
              ...styles.categoryLine,
              background: `linear-gradient(90deg, ${category.accentColor} 0%, transparent 100%)`,
            }}
          />
        </div>
      </div>

      {/* Skills */}
      <div style={styles.skillsGrid}>
        {category.skills.map((skill, i) => (
          <SkillBadge
            key={skill.name}
            skill={skill}
            accentColor={category.accentColor}
            delay={blockIndex * 60 + i * 50}
          />
        ))}
      </div>
    </div>
  );
}

function PhilosophyBanner({ visible }) {
  return (
    <div
      style={{
        ...styles.philosophyBanner,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s',
      }}
    >
      {/* Corner decorations */}
      <div style={{ ...styles.philosophyCorner, top: 0, left: 0, borderTop: '2px solid #00ff41', borderLeft: '2px solid #00ff41' }} />
      <div style={{ ...styles.philosophyCorner, top: 0, right: 0, borderTop: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />
      <div style={{ ...styles.philosophyCorner, bottom: 0, left: 0, borderBottom: '2px solid #00ff41', borderLeft: '2px solid #00ff41' }} />
      <div style={{ ...styles.philosophyCorner, bottom: 0, right: 0, borderBottom: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />

      {/* Scanline overlay */}
      <div style={styles.philosophyScanlines} />

      <div style={styles.philosophyInner}>
        <div style={styles.philosophyLabel}>
          <span style={{ color: '#00ff41', marginRight: '8px' }}>{'>'}</span>
          <span style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '11px', letterSpacing: '0.15em' }}>
            CORE_PHILOSOPHY.txt
          </span>
        </div>
        <blockquote style={styles.philosophyQuote}>
          "I don't just build AI — I architect intelligence that creates measurable impact."
        </blockquote>
        <div style={styles.philosophyAuthor}>
          <span style={{ color: '#00ff41', opacity: 0.6, fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
            — saswat@neural:~$
          </span>
          <span style={styles.philosophyCursor}>█</span>
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [philosophyVisible, setPhilosophyVisible] = useState(false);
  const philosophyRef = useRef(null);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    const philosophyObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPhilosophyVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) headerObserver.observe(sectionRef.current);
    if (philosophyRef.current) philosophyObserver.observe(philosophyRef.current);
    return () => {
      headerObserver.disconnect();
      philosophyObserver.disconnect();
    };
  }, []);

  return (
    <section id="skills" ref={sectionRef} style={styles.section}>
      {/* Section header */}
      <div style={styles.sectionHeader}>
        <div
          style={{
            ...styles.headerLine,
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          <span style={styles.prompt}>root@saswat:~$</span>
          <span style={styles.command}> tech_stack.json</span>
          <span style={styles.cursor}>█</span>
        </div>
        <div
          style={{
            ...styles.headerMeta,
            opacity: headerVisible ? 1 : 0,
            transition: 'all 0.8s ease 0.3s',
          }}
        >
          <span style={{ color: '#00d4ff', marginRight: '8px' }}>//</span>
          <span style={{ color: '#6b7280', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
            {SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)} skills loaded across {SKILL_CATEGORIES.length} domains
          </span>
        </div>
        <div style={styles.headerDivider} />
      </div>

      {/* Categories grid */}
      <div style={styles.categoriesGrid}>
        {SKILL_CATEGORIES.map((category, idx) => (
          <CategoryBlock key={category.id} category={category} blockIndex={idx} />
        ))}
      </div>

      {/* Philosophy banner */}
      <div ref={philosophyRef} style={styles.philosophyWrapper}>
        <PhilosophyBanner visible={philosophyVisible} />
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    padding: '100px 60px 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  sectionHeader: {
    marginBottom: '60px',
  },
  headerLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    marginBottom: '10px',
  },
  prompt: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '14px',
    color: '#6b7280',
  },
  command: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '22px',
    fontWeight: '700',
    color: '#00ff41',
    textShadow: '0 0 20px rgba(0,255,65,0.6), 0 0 40px rgba(0,255,65,0.2)',
    letterSpacing: '0.05em',
  },
  cursor: {
    color: '#00ff41',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '20px',
    animation: 'blink 1s infinite',
    marginLeft: '4px',
  },
  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(0,255,65,0.5) 0%, rgba(0,255,65,0.1) 40%, transparent 100%)',
    maxWidth: '600px',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, auto)',
    gap: '24px',
    marginBottom: '60px',
  },
  categoryBlock: {
    background: 'rgba(8, 14, 26, 1)',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '12px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px',
  },
  categoryIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  categoryLabel: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    letterSpacing: '0.08em',
  },
  categoryLine: {
    height: '2px',
    width: '40px',
    borderRadius: '1px',
  },
  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  skillBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid',
    cursor: 'default',
    transition: 'all 0.3s ease',
  },
  badgeDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'opacity 0.3s ease',
  },
  philosophyWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px',
  },
  philosophyBanner: {
    maxWidth: '700px',
    width: '100%',
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(0,255,65,0.04) 0%, rgba(0,15,5,0.95) 50%, rgba(0,255,65,0.04) 100%)',
    border: '1px solid rgba(0,255,65,0.15)',
    borderRadius: '12px',
    padding: '40px 48px',
    overflow: 'hidden',
    boxShadow: '0 0 40px rgba(0,255,65,0.06), inset 0 0 40px rgba(0,0,0,0.3)',
  },
  philosophyCorner: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    opacity: 0.6,
  },
  philosophyScanlines: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.01) 3px, rgba(0,255,65,0.01) 4px)',
    pointerEvents: 'none',
  },
  philosophyInner: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
  },
  philosophyLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  philosophyQuote: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '18px',
    fontWeight: '600',
    color: '#e2e8f0',
    lineHeight: '1.6',
    textAlign: 'center',
    margin: '0 0 20px 0',
    textShadow: '0 0 30px rgba(255,255,255,0.1)',
    letterSpacing: '0.03em',
    fontStyle: 'normal',
  },
  philosophyAuthor: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  philosophyCursor: {
    color: '#00ff41',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '14px',
    animation: 'blink 1s infinite',
  },
};
