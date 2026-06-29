import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd } from '../seo/jsonld.js';
import { work } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section } from '../components/ui/Section.jsx';
import CaseStudyCard from '../components/ui/CaseStudyCard.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import { C } from '../theme.js';

export default function WorkIndex() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }];
  return (
    <>
      <Seo
        title="Case studies — shipped AI agent, voice & automation builds"
        description="Real AI systems I’ve designed and shipped: multi-agent GTM automation, voice AI, legal RAG, and more — with the problem, approach, and measurable results for each."
        path="/work"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        kicker="CASE STUDIES"
        title="Systems I’ve shipped — and what they moved"
        sub="A selection of production AI work across multi-agent automation, voice AI, RAG, and generative pipelines. Each one links the problem to a measurable outcome."
      />

      <Section>
        {work.length === 0 ? (
          <p style={{ fontFamily: C.mono, color: C.dim }}>Case studies are publishing soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {work.map((w) => (
              <CaseStudyCard key={w.slug} work={w} />
            ))}
          </div>
        )}
      </Section>

      <CtaBlock />
    </>
  );
}
