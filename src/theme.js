// Shared cyberpunk/terminal design tokens. Keeping these in one place lets the
// new content pages match the existing hero/terminal aesthetic exactly.
export const C = {
  green: '#00ff41',
  cyan: '#00d4ff',
  amber: '#ffaa00',
  bg: '#030712',
  bgAlt: '#070b16',
  panel: 'rgba(0,255,65,0.04)',
  panelBorder: 'rgba(0,255,65,0.2)',
  line: 'rgba(0,255,65,0.12)',
  text: '#e2e8f0',
  dim: '#8892a4',
  faint: '#4b5563',
  mono: "'JetBrains Mono', monospace",
  display: "'Orbitron', sans-serif",
};

// Page content max width and standard horizontal padding.
export const WRAP = { maxWidth: 1080, margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)' };

export const scanlines = {
  position: 'absolute',
  inset: 0,
  background:
    'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,65,0.012) 3px,rgba(0,255,65,0.012) 4px)',
  pointerEvents: 'none',
  zIndex: 0,
};
