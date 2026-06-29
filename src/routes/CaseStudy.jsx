import { useParams, Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { caseStudyJsonLd, breadcrumbJsonLd } from '../seo/jsonld.js';
import { getWork, getService, postLink } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import ProofBar from '../components/ui/ProofBar.jsx';
import { Section, Kicker, SectionTitle } from '../components/ui/Section.jsx';
import RelatedLinks from '../components/ui/RelatedLinks.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import NotFound from './NotFound.jsx';
import { C } from '../theme.js';

export default function CaseStudy() {
  const { slug } = useParams();
  const w = getWork(slug);
  if (!w) return <NotFound />;

  const path = `/work/${w.slug}`;
  const service = getService(w.service);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: w.title, path },
  ];
  const articleLinks = (w.related?.articles || []).map(postLink).filter(Boolean);

  return (
    <>
      <Seo
        title={w.seo?.title || w.title}
        description={w.seo?.description || w.summary}
        path={path}
        type="article"
        jsonLd={[
          caseStudyJsonLd({ title: w.title, description: w.seo?.description || w.summary, path, serviceName: w.serviceName }),
          breadcrumbJsonLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      {/* Hero — H1 = the project/result; kicker links UP to the service hub */}
      <PageHero
        kicker={
          service ? (
            <>
              CASE STUDY ·{' '}
              <Link to={`/services/${service.slug}`} style={{ color: C.green, textDecoration: 'none' }}>
                {w.serviceName} ↑
              </Link>
            </>
          ) : (
            `CASE STUDY · ${w.serviceName || ''}`
          )
        }
        title={w.title}
        sub={w.subtitle}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.4rem', marginTop: '1.4rem', fontFamily: C.mono, fontSize: '0.74rem', color: C.faint }}>
          {w.role && <span>ROLE: <span style={{ color: C.dim }}>{w.role}</span></span>}
          {w.timeframe && <span>WHEN: <span style={{ color: C.dim }}>{w.timeframe}</span></span>}
          {w.status && <span>STATUS: <span style={{ color: C.green }}>{w.status}</span></span>}
        </div>
      </PageHero>

      {/* Answer-first summary */}
      {w.summary && (
        <Section style={{ paddingBottom: 0 }}>
          <p style={lead}>{w.summary}</p>
        </Section>
      )}

      {/* PROBLEM — quantified pain */}
      {w.problem?.length > 0 && (
        <Section>
          <Kicker>The problem</Kicker>
          <SectionTitle>The pain this had to solve</SectionTitle>
          {w.problem.map((p, i) => <p key={i} style={para_}>{p}</p>)}
        </Section>
      )}

      {/* APPROACH — what I built, architecture, + stack */}
      {w.approach?.length > 0 && (
        <Section style={{ background: 'rgba(0,255,65,0.02)' }}>
          <Kicker>The approach</Kicker>
          <SectionTitle>What I built — the architecture</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.6rem' }}>
            {w.approach.map((a, i) => (
              <div key={i} style={card}>
                <div style={cardTitle}>{a.title}</div>
                <p style={cardDesc}>{a.desc}</p>
              </div>
            ))}
          </div>
          {w.stack?.length > 0 && (
            <div style={{ marginTop: '1.8rem' }}>
              <div style={{ fontFamily: C.mono, fontSize: '0.7rem', letterSpacing: '0.15em', color: C.cyan, marginBottom: '0.7rem' }}>BUILT WITH</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {w.stack.map((t) => <span key={t} style={tag}>{t}</span>)}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* RESULT — bold metrics + business impact + named quote */}
      {(w.results?.length > 0 || w.resultNarrative || w.testimonial) && (
        <Section>
          <Kicker>The result</Kicker>
          <SectionTitle>What it delivered</SectionTitle>
          {w.results?.length > 0 && <ProofBar items={w.results} />}
          {w.resultNarrative && <p style={{ ...para_, marginTop: '1.6rem', color: C.text, fontSize: '1rem' }}>{w.resultNarrative}</p>}
          {w.testimonial && (
            <blockquote style={{ borderLeft: `3px solid ${C.green}`, padding: '0.5rem 0 0.5rem 1.4rem', margin: '1.4rem 0 0', maxWidth: 720 }}>
              <p style={{ ...para_, color: C.text, fontStyle: 'italic', fontSize: '1.05rem', margin: 0 }}>“{w.testimonial.quote}”</p>
              <cite style={{ fontFamily: C.mono, fontSize: '0.78rem', color: C.cyan }}>— {w.testimonial.author}</cite>
            </blockquote>
          )}
        </Section>
      )}

      {/* Up to the service + across to related articles */}
      <Section style={{ paddingTop: 0 }}>
        <RelatedLinks
          title="Related"
          links={[
            service && { to: `/services/${service.slug}`, label: `${w.serviceName} service`, kind: 'Service', desc: service.hero?.sub },
            ...articleLinks,
          ].filter(Boolean)}
        />
      </Section>

      <CtaBlock heading="Want results like this for your team?" />
    </>
  );
}

const lead = { fontFamily: C.mono, fontSize: '1.02rem', color: C.text, lineHeight: 1.8, maxWidth: 800, margin: 0 };
const para_ = { fontFamily: C.mono, fontSize: '0.95rem', color: C.dim, lineHeight: 1.85, margin: '0 0 1.1rem', maxWidth: 760 };
const card = { background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.2rem 1.3rem' };
const cardTitle = { fontFamily: C.display, fontWeight: 700, fontSize: '1rem', color: C.green, marginBottom: '0.6rem' };
const cardDesc = { fontFamily: C.mono, fontSize: '0.82rem', color: C.dim, lineHeight: 1.7, margin: 0 };
const tag = { fontFamily: C.mono, fontSize: '0.72rem', color: C.cyan, border: `1px solid rgba(0,212,255,0.3)`, borderRadius: '3px', padding: '0.3rem 0.6rem' };
