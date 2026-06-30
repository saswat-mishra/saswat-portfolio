import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd } from '../seo/jsonld.js';
import { services, work, blog } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section } from '../components/ui/Section.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import { C } from '../theme.js';

// Flatten the content manifest into one searchable index. Built once.
const INDEX = [
  ...services.map((s) => ({ to: `/services/${s.slug}`, kind: 'Service', title: s.nav || s.breadcrumb, desc: s.seo?.description || s.hero?.sub, keywords: [s.serviceType, s.hero?.primaryQuery] })),
  ...work.map((w) => ({ to: `/work/${w.slug}`, kind: 'Case study', title: w.title, desc: w.subtitle || w.summary, keywords: [w.serviceName, ...(w.stack || [])] })),
  ...blog.map((p) => ({ to: `/blog/${p.slug}`, kind: 'Article', title: p.title, desc: p.description, keywords: p.keywords || [] })),
];

function searchIndex(q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return INDEX.map((item) => {
    const hay = `${item.title} ${item.desc} ${(item.keywords || []).filter(Boolean).join(' ')}`.toLowerCase();
    const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    return { item, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const results = useMemo(() => searchIndex(q), [q]);
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Search', path: '/search' }];

  return (
    <>
      {/* Search results are a tool page, not indexable content → noindex, follow. */}
      <Seo
        title="Search"
        description="Search Saswat Mishra’s AI agent, voice AI, RAG, and automation services, case studies, and articles."
        path="/search"
        noindex
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero kicker="SEARCH" title="Search" sub="Find services, case studies, and articles across the site." />

      <Section>
        <input
          type="search"
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          placeholder="Search AI agents, voice AI, RAG, pricing…"
          aria-label="Search the site"
          style={{
            width: '100%',
            maxWidth: 560,
            background: C.panel,
            border: `1px solid ${C.panelBorder}`,
            borderRadius: '4px',
            padding: '0.8rem 1rem',
            fontFamily: C.mono,
            fontSize: '0.9rem',
            color: C.text,
            outline: 'none',
          }}
        />

        <div style={{ marginTop: '1.5rem' }}>
          {!q ? (
            <p style={muted}>Type above to search the site.</p>
          ) : results.length === 0 ? (
            <p style={muted}>No matches for “{q}”. Try a broader term, or <Link to="/contact" style={{ color: C.cyan, textDecoration: 'none' }}>book a scoping call</Link>.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {results.map((r) => (
                <Link key={r.to} to={r.to} style={cardLink}>
                  <span style={{ fontFamily: C.mono, fontSize: '0.62rem', letterSpacing: '0.12em', color: C.faint }}>{r.kind.toUpperCase()}</span>
                  <div style={{ fontFamily: C.mono, fontSize: '0.92rem', color: C.green, margin: '0.3rem 0', fontWeight: 600 }}>{r.title} →</div>
                  {r.desc && <div style={{ fontFamily: C.mono, fontSize: '0.76rem', color: C.dim, lineHeight: 1.6 }}>{r.desc}</div>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>

      <CtaBlock />
    </>
  );
}

const muted = { fontFamily: C.mono, fontSize: '0.9rem', color: C.dim };
const cardLink = { display: 'block', textDecoration: 'none', background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1rem 1.1rem' };
