import { useParams, Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { serviceJsonLd, faqJsonLd, breadcrumbJsonLd } from '../seo/jsonld.js';
import { getService, getWork, postLink } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import ProofBar from '../components/ui/ProofBar.jsx';
import { Section, Kicker, SectionTitle } from '../components/ui/Section.jsx';
import Faq from '../components/ui/Faq.jsx';
import RelatedLinks from '../components/ui/RelatedLinks.jsx';
import CaseStudyCard from '../components/ui/CaseStudyCard.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import Button from '../components/ui/Button.jsx';
import NotFound from './NotFound.jsx';
import { C } from '../theme.js';
import { SITE } from '../site.config.js';

export default function ServicePage() {
  const { slug } = useParams();
  const s = getService(slug);
  if (!s) return <NotFound />;

  const path = `/services/${s.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: s.breadcrumb || s.nav, path },
  ];
  // Case studies render as proof cards (across-links); articles link down to the blog.
  const caseStudies = (s.related?.caseStudies || []).map(getWork).filter(Boolean);
  const articleLinks = (s.related?.articles || []).map(postLink).filter(Boolean);

  return (
    <>
      <Seo
        title={s.seo.title}
        description={s.seo.description}
        path={path}
        jsonLd={[
          serviceJsonLd({ name: s.nav, serviceType: s.serviceType, description: s.seo.description, path, offers: s.offers }),
          breadcrumbJsonLd(crumbs),
          ...(s.faq?.length ? [faqJsonLd(s.faq)] : []),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      {/* ── Answer-first hero (H1 = outcome) + primary CTA + proof + pricing signal ── */}
      <PageHero kicker={s.hero.kicker} title={s.hero.headline} sub={s.hero.sub}>
        <div style={{ marginTop: '1.6rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button to={SITE.cta.href}>{SITE.cta.label} →</Button>
          <Button to="/work" variant="ghost">See case studies</Button>
        </div>
        <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: C.faint, marginTop: '0.8rem' }}>
          {SITE.cta.microcopy}
        </div>
        {s.proof?.length > 0 && <ProofBar items={s.proof} />}
        {s.pricing && (
          <div style={pricingSignal}>
            <span>
              From <strong style={{ color: C.green }}>{s.pricing.from}</strong> · typical projects{' '}
              <strong style={{ color: C.green }}>{s.pricing.typical}</strong> · billed at $60/hr or $2,500/week
            </span>
            <Link to="/services" style={{ color: C.cyan, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              See pricing &amp; packages →
            </Link>
          </div>
        )}
      </PageHero>

      {/* Answer-first GEO lead — direct what/who/result in the first ~50 words */}
      {s.answerFirst && (
        <Section style={{ paddingBottom: 0 }}>
          <p style={lead}>{s.answerFirst}</p>
        </Section>
      )}

      {/* The problem & outcome */}
      {s.problem && (
        <Section>
          <Kicker>The problem &amp; the outcome</Kicker>
          <SectionTitle>{s.problem.heading}</SectionTitle>
          {s.problem.body.map((para, i) => (
            <p key={i} style={para_}>{para}</p>
          ))}
        </Section>
      )}

      {/* What you get */}
      {s.includes?.length > 0 && (
        <Section style={{ background: 'rgba(0,255,65,0.02)' }}>
          <Kicker>What you get</Kicker>
          <SectionTitle>Scope &amp; deliverables — everything needed to ship it reliably</SectionTitle>
          <div style={grid3}>
            {s.includes.map((it, i) => (
              <div key={i} style={card}>
                <div style={cardTitle}>{it.title}</div>
                <p style={cardDesc}>{it.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Process */}
      {s.process?.length > 0 && (
        <Section>
          <Kicker>How I work</Kicker>
          <SectionTitle>A low-risk path from idea to production</SectionTitle>
          <div style={grid4}>
            {s.process.map((p, i) => (
              <div key={i} style={card}>
                <div style={cardTitle}>{p.title}</div>
                <p style={cardDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Stack */}
      {s.stack?.length > 0 && (
        <Section style={{ paddingTop: 0 }}>
          <Kicker>Stack</Kicker>
          <SectionTitle>The stack I build on — chosen for your use case</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {s.stack.map((t) => (
              <span key={t} style={tag}>{t}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Proof — CaseStudyCard(s) leading with the metric */}
      {caseStudies.length > 0 && (
        <Section style={{ background: 'rgba(0,255,65,0.02)' }}>
          <Kicker>Proof</Kicker>
          <SectionTitle>Proof: shipped systems and the numbers they moved</SectionTitle>
          <div style={grid3}>
            {caseStudies.map((w) => (
              <CaseStudyCard key={w.slug} work={w} />
            ))}
          </div>
        </Section>
      )}

      {/* FAQ → FAQPage JSON-LD (above) */}
      {s.faq?.length > 0 && (
        <Section>
          <Faq faq={s.faq} heading={`${s.nav}: questions buyers ask`} />
        </Section>
      )}

      {/* Go deeper — related blog articles (hub → spokes) */}
      {articleLinks.length > 0 && (
        <Section style={{ paddingTop: 0 }}>
          <RelatedLinks title="Go deeper" links={articleLinks} />
        </Section>
      )}

      <CtaBlock />
    </>
  );
}

const lead = { fontFamily: C.mono, fontSize: '1.05rem', color: C.text, lineHeight: 1.8, maxWidth: 800, margin: 0, borderLeft: `3px solid ${C.green}`, paddingLeft: '1.1rem' };
const para_ = { fontFamily: C.mono, fontSize: '0.95rem', color: C.dim, lineHeight: 1.85, margin: '0 0 1.1rem', maxWidth: 760 };
const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.8rem' };
const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.8rem' };
const card = { background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.2rem 1.3rem' };
const cardTitle = { fontFamily: C.display, fontWeight: 700, fontSize: '1rem', color: C.green, marginBottom: '0.6rem' };
const cardDesc = { fontFamily: C.mono, fontSize: '0.82rem', color: C.dim, lineHeight: 1.7, margin: 0 };
const tag = { fontFamily: C.mono, fontSize: '0.72rem', color: C.cyan, border: `1px solid rgba(0,212,255,0.3)`, borderRadius: '3px', padding: '0.3rem 0.6rem' };
const pricingSignal = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem 1rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '1.6rem',
  padding: '0.7rem 1rem',
  background: C.panel,
  border: `1px solid ${C.panelBorder}`,
  borderRadius: '4px',
  fontFamily: C.mono,
  fontSize: '0.78rem',
  color: C.dim,
  maxWidth: 720,
};
