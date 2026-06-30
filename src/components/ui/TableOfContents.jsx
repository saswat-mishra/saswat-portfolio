import { C } from '../../theme.js';

/**
 * In-article "On this page" nav. items: [{ id, text }]. Renders crawlable
 * anchor links to the heading ids that RichBody / the markdown pipeline bake
 * into the body, so it works in the prerendered HTML with no JS. Hidden when
 * there aren't enough sections to be useful.
 */
export default function TableOfContents({ items }) {
  const toc = (items || []).filter((t) => t && t.id && t.text);
  if (toc.length < 3) return null;
  return (
    <nav
      aria-label="On this page"
      style={{
        background: C.panel,
        border: `1px solid ${C.panelBorder}`,
        borderRadius: '4px',
        padding: '1.1rem 1.3rem',
        margin: '0 0 2rem',
      }}
    >
      <div style={{ fontFamily: C.mono, fontSize: '0.66rem', letterSpacing: '0.18em', color: C.cyan, marginBottom: '0.7rem' }}>
        &gt; ON THIS PAGE
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {toc.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              style={{ fontFamily: C.mono, fontSize: '0.82rem', color: C.dim, textDecoration: 'none', lineHeight: 1.5 }}
            >
              <span style={{ color: C.green, marginRight: '0.5rem' }}>›</span>
              {t.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
