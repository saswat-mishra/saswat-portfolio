import { Link } from 'react-router-dom';
import { C, WRAP } from '../../theme.js';

/**
 * Crawlable breadcrumb trail (visual). BreadcrumbList JSON-LD is emitted once per
 * route via <Seo jsonLd={[breadcrumbJsonLd(crumbs), …]}> — do NOT also emit it
 * here, or every page ships a duplicate BreadcrumbList.
 * items: [{ name, path }] from Home → current page (current is rendered plain).
 */
export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" style={{ ...WRAP, paddingTop: '90px' }}>
      <ol
        style={{
          listStyle: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          margin: 0,
          padding: 0,
          fontFamily: C.mono,
          fontSize: '0.72rem',
          letterSpacing: '0.04em',
        }}
      >
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {last ? (
                <span style={{ color: C.green }} aria-current="page">
                  {it.name}
                </span>
              ) : (
                <>
                  <Link to={it.path} style={{ color: C.dim, textDecoration: 'none' }}>
                    {it.name}
                  </Link>
                  <span style={{ color: C.faint }}>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
