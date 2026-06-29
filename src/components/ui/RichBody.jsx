import { C } from '../../theme.js';

// Minimal inline formatter: **bold** → <strong>. Keeps content data plain.
function inline(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) => {
      const m = /^\*\*([^*]+)\*\*$/.exec(part);
      return m ? (
        <strong key={i} style={{ color: C.text, fontWeight: 700 }}>
          {m[1]}
        </strong>
      ) : (
        part
      );
    });
}

const p = { fontFamily: C.mono, fontSize: '0.95rem', color: C.dim, lineHeight: 1.85, margin: '0 0 1.2rem' };
const h2 = { fontFamily: C.display, fontWeight: 800, fontSize: 'clamp(1.3rem, 2.6vw, 1.7rem)', color: C.text, lineHeight: 1.25, margin: '2.4rem 0 1rem' };
const h3 = { fontFamily: C.display, fontWeight: 700, fontSize: '1.1rem', color: C.cyan, margin: '1.8rem 0 0.8rem' };
const li = { ...p, margin: '0 0 0.6rem' };

/** Renders an array of typed content blocks into semantic, crawlable HTML. */
export default function RichBody({ blocks }) {
  if (!blocks?.length) return null;
  return (
    <div>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return <h2 key={i} style={h2}>{b.text}</h2>;
          case 'h3':
            return <h3 key={i} style={h3}>{b.text}</h3>;
          case 'ul':
            return (
              <ul key={i} style={{ paddingLeft: '1.2rem', margin: '0 0 1.2rem' }}>
                {b.items.map((it, j) => <li key={j} style={li}>{inline(it)}</li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} style={{ paddingLeft: '1.2rem', margin: '0 0 1.2rem' }}>
                {b.items.map((it, j) => <li key={j} style={li}>{inline(it)}</li>)}
              </ol>
            );
          case 'table':
            return (
              <div key={i} style={{ overflowX: 'auto', margin: '0 0 1.4rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: C.mono, fontSize: '0.82rem' }}>
                  <thead>
                    <tr>
                      {b.headers.map((h, j) => (
                        <th key={j} style={{ textAlign: 'left', padding: '0.7rem 0.9rem', color: C.green, borderBottom: `1px solid ${C.panelBorder}`, background: C.panel }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.7rem 0.9rem', color: C.dim, borderBottom: `1px solid ${C.line}`, verticalAlign: 'top' }}>
                            {inline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'callout':
            return (
              <aside key={i} style={{ background: 'rgba(0,212,255,0.06)', border: `1px solid rgba(0,212,255,0.3)`, borderRadius: '4px', padding: '1.1rem 1.3rem', margin: '0 0 1.4rem' }}>
                {b.title && <div style={{ fontFamily: C.mono, fontSize: '0.7rem', letterSpacing: '0.15em', color: C.cyan, marginBottom: '0.5rem' }}>{b.title.toUpperCase()}</div>}
                <div style={{ ...p, margin: 0, color: C.text }}>{inline(b.text)}</div>
              </aside>
            );
          case 'quote':
            return (
              <blockquote key={i} style={{ borderLeft: `3px solid ${C.green}`, margin: '0 0 1.4rem', padding: '0.4rem 0 0.4rem 1.2rem' }}>
                <p style={{ ...p, margin: 0, color: C.text, fontStyle: 'italic' }}>“{b.text}”</p>
                {b.cite && <cite style={{ fontFamily: C.mono, fontSize: '0.75rem', color: C.faint }}>— {b.cite}</cite>}
              </blockquote>
            );
          case 'code':
            return (
              <pre key={i} style={{ background: C.bgAlt, border: `1px solid ${C.line}`, borderRadius: '4px', padding: '1rem 1.2rem', overflowX: 'auto', margin: '0 0 1.4rem' }}>
                <code style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.green }}>{b.code}</code>
              </pre>
            );
          case 'p':
          default:
            return <p key={i} style={p}>{inline(b.text)}</p>;
        }
      })}
    </div>
  );
}
