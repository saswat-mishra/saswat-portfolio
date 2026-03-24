import { useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
// Configure VITE_GOOGLE_SCRIPT_URL in your .env file to enable form submissions.

const PROJECT_TYPES = [
  { value: '', label: '-- select project type --' },
  { value: 'gen-ai', label: 'Gen AI' },
  { value: 'multi-agent', label: 'Multi-Agent Systems' },
  { value: 'voice-ai', label: 'Voice AI' },
  { value: 'computer-vision', label: 'Computer Vision' },
  { value: 'other', label: 'Other' },
];

const BUDGET_OPTIONS = [
  { value: '', label: '-- select budget range --' },
  { value: 'under-1k', label: '< $1,000' },
  { value: '1k-5k', label: '$1,000 – $5,000' },
  { value: '5k-10k', label: '$5,000 – $10,000' },
  { value: '10k-plus', label: '$10,000+' },
  { value: 'discuss', label: "Let's discuss" },
];

const CONTACT_INFO = [
  {
    icon: '✉',
    label: 'EMAIL',
    value: 'saswatmishra.iitd@gmail.com',
    href: 'mailto:saswatmishra.iitd@gmail.com',
    color: '#00ff41',
  },
  {
    icon: '◎',
    label: 'LOCATION',
    value: 'New Delhi, India',
    href: null,
    color: '#00d4ff',
  },
  {
    icon: '◈',
    label: 'AVAILABILITY',
    value: 'Open to AI/ML Projects & Consulting',
    href: null,
    color: '#00ff41',
  },
  {
    icon: '$',
    label: 'RATE',
    value: '$60/hr | Project-based',
    href: null,
    color: '#f59e0b',
  },
  {
    icon: '⌥',
    label: 'GITHUB',
    value: 'saswat-mishra',
    href: 'https://github.com/saswat-mishra',
    color: '#e2e8f0',
  },
  {
    icon: '⬡',
    label: 'LINKEDIN',
    value: 'linkedin.com/in/saswat-mishra',
    href: 'https://linkedin.com/in/saswat-mishra',
    color: '#00d4ff',
  },
];

function InputField({ label, id, type = 'text', value, onChange, required, placeholder }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel} htmlFor={id}>
        <span style={{ color: '#00ff41', marginRight: '6px' }}>{'>'}</span>
        {label}
        {required && <span style={{ color: '#ff4444', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.input,
          borderColor: focused ? '#00ff41' : 'rgba(0,255,65,0.25)',
          boxShadow: focused
            ? '0 0 10px rgba(0,255,65,0.3)'
            : 'none',
          color: '#e2e8f0',
        }}
      />
    </div>
  );
}

function SelectField({ label, id, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel} htmlFor={id}>
        <span style={{ color: '#00ff41', marginRight: '6px' }}>{'>'}</span>
        {label}
        {required && <span style={{ color: '#ff4444', marginLeft: '4px' }}>*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.select,
          borderColor: focused ? '#00ff41' : 'rgba(0,255,65,0.25)',
          boxShadow: focused
            ? '0 0 10px rgba(0,255,65,0.3)'
            : 'none',
          color: '#e2e8f0',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#0a0f1a', color: opt.value ? '#e2e8f0' : '#4b5563' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({ label, id, value, onChange, required, placeholder }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel} htmlFor={id}>
        <span style={{ color: '#00ff41', marginRight: '6px' }}>{'>'}</span>
        {label}
        {required && <span style={{ color: '#ff4444', marginLeft: '4px' }}>*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        rows={5}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.textarea,
          borderColor: focused ? '#00ff41' : 'rgba(0,255,65,0.25)',
          boxShadow: focused
            ? '0 0 10px rgba(0,255,65,0.3)'
            : 'none',
          color: '#e2e8f0',
        }}
      />
    </div>
  );
}

function ContactInfoCard({ visible }) {
  return (
    <div
      style={{
        ...styles.infoPanel,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-40px)',
        transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      {/* Panel header */}
      <div style={styles.panelHeader}>
        <div style={styles.terminalDots}>
          <div style={{ ...styles.dot, background: '#ff5f57' }} />
          <div style={{ ...styles.dot, background: '#ffbd2e' }} />
          <div style={{ ...styles.dot, background: '#28c840' }} />
        </div>
        <span style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '11px', marginLeft: '10px' }}>
          contact_info.json
        </span>
      </div>

      <div style={styles.infoPanelContent}>
        {/* Availability indicator */}
        <div style={styles.availabilityRow}>
          <div style={styles.availabilityDot} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#00ff41' }}>
            ONLINE — Available for projects
          </span>
        </div>

        {/* Contact items */}
        <div style={styles.contactItems}>
          {CONTACT_INFO.map((item, i) => (
            <div key={item.label} style={styles.contactItem}>
              <div style={{ ...styles.contactIcon, color: item.color, textShadow: `0 0 8px ${item.color}80` }}>
                {item.icon}
              </div>
              <div style={styles.contactItemContent}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', color: '#4b5563', letterSpacing: '0.15em' }}>
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.contactValue, color: item.color, textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span style={{ ...styles.contactValue, color: '#cbd5e1' }}>{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={styles.quickLinks}>
          <div style={styles.quickLinksLabel}>
            <span style={{ color: '#00ff41', marginRight: '6px' }}>{'>'}</span>
            <span style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
              quick_connect:
            </span>
          </div>
          <div style={styles.quickLinkButtons}>
            <a
              href="https://github.com/saswat-mishra"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.quickLinkBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,255,65,0.15)';
                e.currentTarget.style.borderColor = '#00ff41';
                e.currentTarget.style.color = '#00ff41';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,255,65,0.05)';
                e.currentTarget.style.borderColor = 'rgba(0,255,65,0.2)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/saswat-mishra"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.quickLinkBtn, borderColor: 'rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.05)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.15)';
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.color = '#00d4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              LinkedIn
            </a>
            <a
              href="https://upwork.com/freelancers/saswat-mishra"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.quickLinkBtn, borderColor: 'rgba(20,200,60,0.2)', background: 'rgba(20,200,60,0.05)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(20,200,60,0.15)';
                e.currentTarget.style.borderColor = '#14c43c';
                e.currentTarget.style.color = '#14c43c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(20,200,60,0.05)';
                e.currentTarget.style.borderColor = 'rgba(20,200,60,0.2)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              Upwork
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactSection() {
  const sectionRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const formRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [submitState, setSubmitState] = useState('idle'); // idle | transmitting | success | error
  const [dotsCount, setDotsCount] = useState(0);

  useEffect(() => {
    const headerObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.05 }
    );
    const formObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFormVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) headerObs.observe(sectionRef.current);
    if (formRef.current) formObs.observe(formRef.current);
    // Fallback: ensure visibility after a short delay
    const t1 = setTimeout(() => setHeaderVisible(true), 400);
    const t2 = setTimeout(() => setFormVisible(true), 600);
    return () => { headerObs.disconnect(); formObs.disconnect(); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Dots animation during transmitting
  useEffect(() => {
    if (submitState !== 'transmitting') return;
    const interval = setInterval(() => {
      setDotsCount((d) => (d + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [submitState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState('transmitting');

    if (!GOOGLE_SCRIPT_URL) {
      // Simulate delay for demo
      setTimeout(() => setSubmitState('error'), 2000);
      return;
    }

    try {
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        projectType: formData.projectType,
        budget: formData.budget,
        message: formData.message,
      });

      await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
      });

      setSubmitState('success');
      setFormData({ name: '', email: '', company: '', projectType: '', budget: '', message: '' });
    } catch {
      setSubmitState('error');
    }
  };

  const handleReset = () => {
    setSubmitState('idle');
  };

  const update = (field) => (val) => setFormData((prev) => ({ ...prev, [field]: val }));

  return (
    <section id="contact" ref={sectionRef} style={styles.section}>
      {/* Background glow */}
      <div style={styles.bgGlow} />

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
          <span style={styles.command}> initiate_contact.exe</span>
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
            Secure channel established — ready to receive transmission
          </span>
        </div>
        <div style={styles.headerDivider} />
      </div>

      {/* Main layout */}
      <div style={styles.layout} className="contact-grid">
        {/* Left: Contact info */}
        <ContactInfoCard visible={headerVisible} />

        {/* Right: Form */}
        <div
          ref={formRef}
          style={{
            ...styles.formPanel,
            opacity: formVisible ? 1 : 0,
            transform: formVisible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.15s',
          }}
        >
          {/* Panel header */}
          <div style={styles.panelHeader}>
            <div style={styles.terminalDots}>
              <div style={{ ...styles.dot, background: '#ff5f57' }} />
              <div style={{ ...styles.dot, background: '#ffbd2e' }} />
              <div style={{ ...styles.dot, background: '#28c840' }} />
            </div>
            <span style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '11px', marginLeft: '10px' }}>
              transmit_message.sh
            </span>
            <div style={{ flex: 1 }} />
            <div style={styles.encryptBadge}>
              <span style={{ color: '#00d4ff', fontSize: '10px', marginRight: '4px' }}>⚿</span>
              <span style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono', fontSize: '9px' }}>ENCRYPTED</span>
            </div>
          </div>

          {/* Form body */}
          <div style={styles.formBody}>
            {submitState === 'idle' && (
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <InputField
                    label="Name"
                    id="contact-name"
                    value={formData.name}
                    onChange={update('name')}
                    required
                    placeholder="Your name"
                  />
                  <InputField
                    label="Email"
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={update('email')}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <InputField
                  label="Company"
                  id="contact-company"
                  value={formData.company}
                  onChange={update('company')}
                  placeholder="Company / Startup (optional)"
                />

                <div style={styles.formRow}>
                  <SelectField
                    label="Project Type"
                    id="contact-project-type"
                    value={formData.projectType}
                    onChange={update('projectType')}
                    options={PROJECT_TYPES}
                    required
                  />
                  <SelectField
                    label="Budget"
                    id="contact-budget"
                    value={formData.budget}
                    onChange={update('budget')}
                    options={BUDGET_OPTIONS}
                    required
                  />
                </div>

                <TextareaField
                  label="Message"
                  id="contact-message"
                  value={formData.message}
                  onChange={update('message')}
                  required
                  placeholder="Describe your project, goals, and timeline..."
                />

                <button type="submit" style={styles.submitBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#00cc34';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,65,0.6), 0 0 60px rgba(0,255,65,0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.letterSpacing = '0.22em';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#00ff41';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.letterSpacing = '0.2em';
                  }}
                >
                  <span style={{ marginRight: '10px', fontSize: '14px' }}>⟩</span>
                  TRANSMIT MESSAGE
                  <span style={{ marginLeft: '10px', fontSize: '14px' }}>⟩</span>
                </button>
              </form>
            )}

            {submitState === 'transmitting' && (
              <div style={styles.statusPanel}>
                <div style={styles.statusIcon}>
                  <div style={styles.transmitRing} />
                  <div style={{ ...styles.transmitRing, animationDelay: '0.3s', opacity: 0.6 }} />
                  <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '24px', position: 'relative', zIndex: 1 }}>⟩</span>
                </div>
                <div style={styles.statusTitle}>TRANSMITTING{'.'.repeat(dotsCount)}</div>
                <div style={styles.statusLines}>
                  <div style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '12px', marginBottom: '6px' }}>
                    {'>'} Encrypting payload...
                  </div>
                  <div style={{ color: '#4b5563', fontFamily: 'JetBrains Mono', fontSize: '12px', marginBottom: '6px' }}>
                    {'>'} Routing to secure channel...
                  </div>
                  <div style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '12px', animation: 'blink 0.8s infinite' }}>
                    {'>'} Awaiting confirmation...
                  </div>
                </div>
              </div>
            )}

            {submitState === 'success' && (
              <div style={styles.statusPanel}>
                <div style={{ ...styles.statusIcon, borderColor: '#00ff41' }}>
                  <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '32px' }}>✓</span>
                </div>
                <div style={{ ...styles.statusTitle, color: '#00ff41' }}>
                  MESSAGE RECEIVED ✓
                </div>
                <div style={styles.statusLines}>
                  <div style={{ color: '#6b7280', fontFamily: 'JetBrains Mono', fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>
                    {'>'} Transmission successful. Saswat will respond within 24 hours.
                  </div>
                  <div style={{ color: '#6b7280', fontFamily: 'JetBrains Mono', fontSize: '12px', textAlign: 'center' }}>
                    {'>'} Message stored securely. ✓
                  </div>
                </div>
                <button onClick={handleReset} style={{ ...styles.submitBtn, marginTop: '24px', fontSize: '12px' }}>
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            )}

            {submitState === 'error' && (
              <div style={styles.statusPanel}>
                <div style={{ ...styles.statusIcon, borderColor: '#ff4444' }}>
                  <span style={{ color: '#ff4444', fontFamily: 'JetBrains Mono', fontSize: '28px' }}>✗</span>
                </div>
                <div style={{ ...styles.statusTitle, color: '#ff4444' }}>
                  TRANSMISSION FAILED
                </div>
                <div style={styles.statusLines}>
                  <div style={{ color: '#6b7280', fontFamily: 'JetBrains Mono', fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>
                    {'>'} {GOOGLE_SCRIPT_URL ? 'Error connecting to server. Please try again.' : 'Form endpoint not configured. Contact via email directly.'}
                  </div>
                  <a
                    href="mailto:saswatmishra.iitd@gmail.com"
                    style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '12px', textAlign: 'center', display: 'block' }}
                  >
                    {'>'} saswatmishra.iitd@gmail.com
                  </a>
                </div>
                <button onClick={handleReset} style={{ ...styles.submitBtn, marginTop: '24px', fontSize: '12px', borderColor: 'rgba(255,68,68,0.4)', color: '#ff9999' }}>
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes transmitPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        ::placeholder {
          color: #374151 !important;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }
        select option {
          background: #0a0f1a;
        }
        @media (max-width: 900px) {
          #contact .contact-layout {
            flex-direction: column !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
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
    background: 'rgba(3,7,18,0.95)',
  },
  bgGlow: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    height: '400px',
    background: 'radial-gradient(ellipse at bottom, rgba(0,255,65,0.04) 0%, transparent 70%)',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: '28px',
    position: 'relative',
    zIndex: 1,
  },
  infoPanel: {
    background: 'rgba(8, 14, 26, 1)',
    border: '1px solid rgba(0,255,65,0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,255,65,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  formPanel: {
    background: 'rgba(8, 14, 26, 1)',
    border: '1px solid rgba(0,255,65,0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,255,65,0.1)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(0,255,65,0.08)',
    background: 'rgba(0,0,0,0.3)',
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
  encryptBadge: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,212,255,0.07)',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  infoPanelContent: {
    padding: '24px',
  },
  availabilityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    padding: '10px 14px',
    background: 'rgba(0,255,65,0.05)',
    border: '1px solid rgba(0,255,65,0.15)',
    borderRadius: '6px',
  },
  availabilityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00ff41',
    boxShadow: '0 0 8px #00ff41',
    flexShrink: 0,
    animation: 'pulse 2s infinite',
  },
  contactItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '28px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  contactIcon: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
    marginTop: '2px',
  },
  contactItemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0,
  },
  contactValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    wordBreak: 'break-all',
  },
  quickLinks: {
    borderTop: '1px solid rgba(0,255,65,0.08)',
    paddingTop: '20px',
  },
  quickLinksLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  quickLinkButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  quickLinkBtn: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    color: '#94a3b8',
    background: 'rgba(0,255,65,0.05)',
    border: '1px solid rgba(0,255,65,0.2)',
    borderRadius: '6px',
    padding: '6px 14px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    letterSpacing: '0.08em',
  },
  formBody: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    color: '#00ff41',
    letterSpacing: '0.08em',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    background: 'rgba(3, 7, 18, 0.9)',
    border: '1px solid rgba(0,255,65,0.25)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.25s ease',
    width: '100%',
    boxSizing: 'border-box',
    color: '#e2e8f0',
  },
  select: {
    background: 'rgba(3, 7, 18, 0.9)',
    border: '1px solid rgba(0,255,65,0.25)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.25s ease',
    width: '100%',
    boxSizing: 'border-box',
    color: '#e2e8f0',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2300ff41' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  },
  textarea: {
    background: 'rgba(3, 7, 18, 0.9)',
    border: '1px solid rgba(0,255,65,0.25)',
    borderRadius: '6px',
    padding: '12px 14px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.25s ease',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '120px',
    lineHeight: '1.7',
    color: '#e2e8f0',
  },
  submitBtn: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '13px',
    fontWeight: '700',
    color: '#030712',
    background: '#00ff41',
    border: '2px solid #00ff41',
    borderRadius: '8px',
    padding: '14px 28px',
    cursor: 'pointer',
    letterSpacing: '0.2em',
    width: '100%',
    boxShadow: '0 0 20px rgba(0,255,65,0.4)',
    transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
    textShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    gap: '20px',
    minHeight: '280px',
  },
  statusIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    border: '2px solid rgba(0,255,65,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '16px',
    fontWeight: '700',
    color: '#00d4ff',
    letterSpacing: '0.1em',
    textShadow: '0 0 15px rgba(0,212,255,0.4)',
  },
  statusLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    maxWidth: '360px',
  },
  transmitRing: {
    position: 'absolute',
    inset: '-4px',
    borderRadius: '50%',
    border: '2px solid #00ff41',
    animation: 'transmitPulse 1.5s infinite ease-out',
    opacity: 0.8,
  },
};
