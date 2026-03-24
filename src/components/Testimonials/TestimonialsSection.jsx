import { useEffect, useRef, useState } from 'react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aiden S.',
    role: 'Founder & CEO',
    date: 'March 2026',
    stars: 5,
    rating: 5.0,
    project: 'AI Avatar Pipeline',
    projectColor: '#a855f7',
    quote:
      'From day one, he set the tone with a detailed video proposal... He executed quickly, handled every revision without friction, and delivered an avatar that nailed what I wanted. The level of customization is excellent — voice, clothing, positioning, and backgrounds are all dialed in. Already produced a strong ROI.',
    enterFrom: 'left',
  },
  {
    id: 2,
    name: 'Ajay S.',
    role: 'Founder',
    date: 'January 2026',
    stars: 5,
    rating: 5.0,
    project: 'Podit AI Voice Agent',
    projectColor: '#00ff41',
    quote:
      'Exceptionally strong in translating ambiguous ideas into working solutions. Saswat brings deep technical expertise, high ownership, and disciplined execution. He communicates clearly, meets timelines, and consistently proposes out-of-the-box ideas. A dependable engineer who can be trusted with complex, high-stakes work.',
    enterFrom: 'right',
  },
  {
    id: 3,
    name: 'Reeyan',
    role: 'SDK Integration',
    date: 'March 2026',
    stars: 5,
    rating: 5.0,
    project: 'SDK Integration',
    projectColor: '#00d4ff',
    quote:
      'Saswat is an excellent resource. I would 100% recommend working with him. If you\'re considering collaborating, you can confidently move forward.',
    enterFrom: 'left',
  },
];

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: '#f59e0b', fontSize: '14px', textShadow: '0 0 8px rgba(245,158,11,0.6)' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500 + index * 200);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 200);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [index]);

  const fromLeft = testimonial.enterFrom === 'left';

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? 'translateY(-6px) scale(1.01)'
            : 'translateY(0) scale(1)'
          : `translateX(${fromLeft ? '-60px' : '60px'}) scale(0.97)`,
        transition: visible
          ? 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s ease, opacity 0.7s ease'
          : 'opacity 0.7s ease, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
        boxShadow: hovered
          ? '0 0 40px rgba(0,255,65,0.25), 0 0 80px rgba(0,255,65,0.08), inset 0 0 40px rgba(0,255,65,0.04)'
          : '0 0 20px rgba(0,255,65,0.15), inset 0 0 30px rgba(0,255,65,0.03)',
        borderColor: hovered ? 'rgba(0,255,65,0.6)' : 'rgba(0,255,65,0.4)',
      }}
    >
      {/* Scanlines */}
      <div style={styles.scanlines} />

      {/* Top bar */}
      <div style={styles.topBar}>
        {/* Terminal dots */}
        <div style={styles.terminalDots}>
          <div style={{ ...styles.dot, background: '#ff5f57' }} />
          <div style={{ ...styles.dot, background: '#ffbd2e' }} />
          <div style={{ ...styles.dot, background: '#28c840' }} />
        </div>
        <div style={styles.topBarLabel}>
          <span style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '10px' }}>
            client_review_{testimonial.id.toString().padStart(2, '0')}.log
          </span>
        </div>
        {/* Verified badge */}
        <div style={styles.verifiedBadge}>
          <span style={{ color: '#00ff41', fontSize: '10px', marginRight: '4px' }}>✓</span>
          <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '0.12em' }}>
            UPWORK VERIFIED
          </span>
        </div>
      </div>

      {/* Card content */}
      <div style={styles.cardContent}>
        {/* Opening quote mark */}
        <div style={styles.openQuote}>"</div>

        {/* Quote text */}
        <blockquote style={styles.quoteText}>
          {testimonial.quote}
        </blockquote>

        {/* Closing quote mark */}
        <div style={styles.closeQuote}>"</div>

        {/* Client info row */}
        <div style={styles.clientRow}>
          {/* Avatar */}
          <div style={styles.clientAvatar}>
            <span style={styles.clientInitial}>
              {testimonial.name.charAt(0)}
            </span>
            <div style={styles.avatarGlow} />
          </div>

          {/* Name & role */}
          <div style={styles.clientInfo}>
            <h4 style={styles.clientName}>{testimonial.name}</h4>
            <p style={styles.clientRole}>{testimonial.role}</p>
            <div style={styles.clientMeta}>
              <StarRating count={testimonial.stars} />
              <span style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '10px', marginLeft: '8px' }}>
                {testimonial.date}
              </span>
            </div>
          </div>

          {/* Project tag */}
          <div
            style={{
              ...styles.projectTag,
              borderColor: `${testimonial.projectColor}40`,
              background: `${testimonial.projectColor}08`,
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: testimonial.projectColor,
                letterSpacing: '0.06em',
                textShadow: `0 0 8px ${testimonial.projectColor}60`,
              }}
            >
              {testimonial.project}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom terminal line */}
      <div style={styles.terminalFooter}>
        <span style={{ color: '#00ff41', opacity: 0.35, fontFamily: 'JetBrains Mono', fontSize: '10px' }}>
          $ echo $SATISFACTION
        </span>
        <span style={{ color: '#00ff41', opacity: 0.7, fontFamily: 'JetBrains Mono', fontSize: '10px', marginLeft: '8px' }}>
          100/100
        </span>
        <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '10px', animation: 'blink 1s infinite', marginLeft: '4px' }}>
          █
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} style={styles.section}>
      {/* Background accent */}
      <div style={styles.bgAccent} />

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
          <span style={styles.command}> client_reviews.log</span>
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
            {TESTIMONIALS.length} verified client reviews — 5.0 avg rating
          </span>
        </div>
        <div style={styles.headerDivider} />
      </div>

      {/* Cards */}
      <div style={styles.cardsGrid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} index={i} />
        ))}
      </div>

      {/* Bottom aggregate row */}
      <div
        style={{
          ...styles.aggregateRow,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.8s',
        }}
      >
        <div style={styles.aggregateStat}>
          <span style={styles.aggValue}>5.0</span>
          <span style={styles.aggLabel}>Avg Rating</span>
        </div>
        <div style={styles.aggDivider} />
        <div style={styles.aggregateStat}>
          <span style={styles.aggValue}>100%</span>
          <span style={styles.aggLabel}>Job Success</span>
        </div>
        <div style={styles.aggDivider} />
        <div style={styles.aggregateStat}>
          <span style={styles.aggValue}>Rising Talent</span>
          <span style={styles.aggLabel}>Upwork Status</span>
        </div>
        <div style={styles.aggDivider} />
        <div style={styles.aggregateStat}>
          <span style={styles.aggValue}>On Time</span>
          <span style={styles.aggLabel}>Delivery</span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
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
  bgAccent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(0,255,65,0.03) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  sectionHeader: {
    marginBottom: '48px',
    position: 'relative',
    zIndex: 1,
  },
  headerLine: {
    display: 'flex',
    alignItems: 'center',
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '28px',
    position: 'relative',
    zIndex: 1,
    marginBottom: '40px',
  },
  card: {
    background: 'rgba(8, 14, 26, 1)',
    border: '1px solid rgba(0, 255, 65, 0.4)',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 4px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(0,255,65,0.08)',
    background: 'rgba(0,0,0,0.3)',
    position: 'relative',
    zIndex: 1,
  },
  terminalDots: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },
  dot: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    opacity: 0.7,
  },
  topBarLabel: {
    flex: 1,
    textAlign: 'center',
  },
  verifiedBadge: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,255,65,0.07)',
    border: '1px solid rgba(0,255,65,0.2)',
    borderRadius: '4px',
    padding: '2px 8px',
    boxShadow: '0 0 8px rgba(0,255,65,0.1)',
  },
  cardContent: {
    padding: '28px 32px 20px',
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  openQuote: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '64px',
    lineHeight: '0.6',
    color: '#00ff41',
    marginBottom: '16px',
    textShadow: '0 0 20px rgba(0,255,65,0.4)',
    opacity: 0.9,
    userSelect: 'none',
  },
  quoteText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: '1.85',
    margin: '0 0 16px 0',
    fontStyle: 'normal',
  },
  closeQuote: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '64px',
    lineHeight: '0.3',
    color: '#00ff41',
    textAlign: 'right',
    textShadow: '0 0 20px rgba(0,255,65,0.4)',
    opacity: 0.9,
    marginBottom: '24px',
    userSelect: 'none',
  },
  clientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  clientAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(0,212,255,0.2))',
    border: '2px solid rgba(0,255,65,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    boxShadow: '0 0 14px rgba(0,255,65,0.2)',
  },
  clientInitial: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '16px',
    fontWeight: '700',
    color: '#00ff41',
    textShadow: '0 0 10px rgba(0,255,65,0.6)',
  },
  avatarGlow: {
    position: 'absolute',
    inset: '-3px',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(0,255,65,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: '0 0 2px 0',
    letterSpacing: '0.05em',
  },
  clientRole: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    color: '#6b7280',
    margin: '0 0 6px 0',
  },
  clientMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
  },
  projectTag: {
    padding: '4px 10px',
    borderRadius: '4px',
    border: '1px solid',
    flexShrink: 0,
  },
  terminalFooter: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    borderTop: '1px solid rgba(0,255,65,0.06)',
    background: 'rgba(0,0,0,0.2)',
    position: 'relative',
    zIndex: 1,
  },
  aggregateRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0',
    background: 'rgba(10,15,26,0.8)',
    border: '1px solid rgba(0,255,65,0.1)',
    borderRadius: '10px',
    padding: '20px 40px',
    position: 'relative',
    zIndex: 1,
    flexWrap: 'wrap',
  },
  aggregateStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '0 32px',
  },
  aggValue: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '18px',
    fontWeight: '700',
    color: '#00ff41',
    textShadow: '0 0 15px rgba(0,255,65,0.5)',
  },
  aggLabel: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    color: '#6b7280',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  aggDivider: {
    width: '1px',
    height: '40px',
    background: 'linear-gradient(180deg, transparent, rgba(0,255,65,0.2), transparent)',
  },
};
