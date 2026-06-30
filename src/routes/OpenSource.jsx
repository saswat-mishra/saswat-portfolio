import { Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd, softwareSourceCodeJsonLd } from '../seo/jsonld.js';
import { OSS, ossUrl, SITE } from '../site.config.js';
import { getService } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section } from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import { C } from '../theme.js';

export default function OpenSource() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Open Source', path: '/open-source' }];
  return (
    <>
      <Seo
        title="Open Source — LangGraph & Voice AI starters"
        description="Free, MIT-licensed starters I maintain: a production-shaped LangGraph agent starter and a latency-aware voice AI boilerplate. Clone, run in 60 seconds, ship."
        path="/open-source"
        image="/og/open-source.png"
        jsonLd={[breadcrumbJsonLd(crumbs), ...OSS.map(softwareSourceCodeJsonLd)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        kicker="OPEN SOURCE"
        title="Open-source starters I build and maintain"
        sub="I open-source the scaffolding I wish I’d had: small, production-shaped starters that run in under a minute and show how I build agents and voice AI for clients. MIT-licensed — use them freely."
      />

      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.4rem' }}>
          {OSS.map((repo) => {
            const service = getService(repo.related);
            return (
              <div key={repo.name} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: C.mono, fontSize: '0.66rem', letterSpacing: '0.12em', color: C.cyan }}>{repo.language.toUpperCase()}</span>
                  <span style={{ fontFamily: C.mono, fontSize: '0.62rem', color: C.faint }}>· MIT</span>
                </div>
                <h2 style={cardTitle}>{repo.title}</h2>
                <p style={cardDesc}>{repo.desc}</p>

                <ul style={{ listStyle: 'none', margin: '1rem 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {repo.highlights.map((h) => (
                    <li key={h} style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.dim, lineHeight: 1.5 }}>
                      <span style={{ color: C.green, marginRight: '0.5rem' }}>▹</span>{h}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                  {repo.topics.map((t) => <span key={t} style={tag}>{t}</span>)}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', alignItems: 'center' }}>
                  <Button href={ossUrl(repo.name)} variant="primary" style={{ fontSize: '0.72rem' }}>View on GitHub →</Button>
                  {service && (
                    <Link to={`/services/${service.slug}`} style={{ fontFamily: C.mono, fontSize: '0.76rem', color: C.cyan, textDecoration: 'none' }}>
                      Related service ↑
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontFamily: C.mono, fontSize: '0.82rem', color: C.dim, lineHeight: 1.8, maxWidth: 720, marginTop: '2rem' }}>
          Each starter ships the same discipline I bring to client work — typed state, evals, latency budgets, human-in-the-loop where it matters. Found them useful, or want one adapted to your stack?{' '}
          <Link to={SITE.cta.href} style={{ color: C.green, textDecoration: 'none' }}>Book a free 30-minute scoping call →</Link>
        </p>
      </Section>

      <CtaBlock />
    </>
  );
}

const card = { background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.4rem 1.5rem' };
const cardTitle = { fontFamily: C.display, fontWeight: 800, fontSize: '1.2rem', color: C.green, margin: '0 0 0.6rem' };
const cardDesc = { fontFamily: C.mono, fontSize: '0.84rem', color: C.dim, lineHeight: 1.7, margin: 0 };
const tag = { fontFamily: C.mono, fontSize: '0.68rem', color: C.cyan, border: `1px solid rgba(0,212,255,0.3)`, borderRadius: '3px', padding: '0.25rem 0.5rem' };
