import { Link } from 'react-router-dom';
import { C } from '../../theme.js';

const base = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontFamily: C.display,
  fontWeight: 700,
  fontSize: '0.78rem',
  letterSpacing: '0.12em',
  padding: '0.8rem 1.6rem',
  textDecoration: 'none',
  cursor: 'pointer',
  borderRadius: '3px',
  transition: 'all 0.22s ease',
  whiteSpace: 'nowrap',
};

const variants = {
  primary: {
    color: C.bg,
    backgroundColor: C.green,
    border: `1px solid ${C.green}`,
    boxShadow: '0 0 18px rgba(0,255,65,0.35)',
  },
  ghost: {
    color: C.green,
    backgroundColor: 'transparent',
    border: `1px solid ${C.green}`,
  },
  cyan: {
    color: C.bg,
    backgroundColor: C.cyan,
    border: `1px solid ${C.cyan}`,
    boxShadow: '0 0 18px rgba(0,212,255,0.3)',
  },
};

/**
 * Cyberpunk CTA button. Renders a real crawlable <a> via React Router <Link>
 * for internal paths, or a plain <a> for external/mailto/hash links.
 */
export default function Button({ to, href, variant = 'primary', children, style, ...rest }) {
  const css = { ...base, ...variants[variant], ...style };
  const external = href && /^(https?:|mailto:|tel:|#|\/[^/])/.test(href) === false;
  if (to) {
    return (
      <Link to={to} style={css} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      style={css}
      {...(external || (href && /^https?:/.test(href)) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
