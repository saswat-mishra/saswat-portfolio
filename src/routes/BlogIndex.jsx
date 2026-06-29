import { Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd } from '../seo/jsonld.js';
import { blog } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section } from '../components/ui/Section.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import { C } from '../theme.js';

export default function BlogIndex() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }];
  return (
    <>
      <Seo
        title="Blog — AI agents, voice AI, RAG & automation"
        description="Practical, no-fluff guides on building production AI agents, voice AI, and RAG systems — costs, framework comparisons, and what actually works."
        path="/blog"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        kicker="BLOG"
        title="Field notes on building AI that ships"
        sub="Costs, framework trade-offs, and hard-won lessons from putting AI agents, voice AI, and RAG into production. Written for the people who have to make the build-or-buy call."
      />

      <Section>
        {blog.length === 0 ? (
          <p style={{ fontFamily: C.mono, color: C.dim }}>Articles are publishing soon.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {blog.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} style={cardLink}>
                <div style={{ fontFamily: C.mono, fontSize: '0.66rem', letterSpacing: '0.1em', color: C.cyan, marginBottom: '0.5rem' }}>
                  {p.category?.toUpperCase()} · {p.readingTime}
                </div>
                <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: '1.15rem', color: C.green, marginBottom: '0.5rem' }}>
                  {p.title}
                </div>
                <p style={{ fontFamily: C.mono, fontSize: '0.84rem', color: C.dim, lineHeight: 1.7, margin: 0 }}>{p.description}</p>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <CtaBlock />
    </>
  );
}

const cardLink = {
  display: 'block',
  textDecoration: 'none',
  background: C.panel,
  border: `1px solid ${C.panelBorder}`,
  borderRadius: '4px',
  padding: '1.3rem 1.4rem',
};
