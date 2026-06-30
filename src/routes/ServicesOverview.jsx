import { Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { breadcrumbJsonLd, faqJsonLd } from '../seo/jsonld.js';
import { services } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { Section, Kicker, SectionTitle } from '../components/ui/Section.jsx';
import Faq from '../components/ui/Faq.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import Button from '../components/ui/Button.jsx';
import { C } from '../theme.js';
import { SITE } from '../site.config.js';

const PACKAGES = [
  { name: 'Pilot', price: '$2,500', tagline: 'De-risk the idea', points: ['Working prototype on your real data', '1-week sprint', 'Go/no-go recommendation', 'Fixed scope, fixed price'] },
  { name: 'Build', price: 'from $7,500', tagline: 'Ship to production', points: ['Full agent / system build', 'Integrations + guardrails + evals', 'Observability & docs', 'Deploy + handover'], featured: true },
  { name: 'Retainer', price: '$2,500 / week', tagline: 'Ongoing partner', points: ['Continuous iteration', 'New agents & workflows', 'Monitoring & tuning', 'Priority availability'] },
];

const PRICING_FAQ = [
  { q: 'How do you price AI projects?', a: 'I bill at a flat $60/hour or $2,500/week. Most engagements are scoped to a fixed number of weeks after a short call, so you know the total up front — a 1-week pilot is $2,500, a typical 3–6 week build is $7,500–$15,000. I’ll always tell you the cheaper path if one exists — including "you don’t need a custom build for this".' },
  { q: 'Do you offer a fixed-price pilot?', a: 'Yes. The Pilot is a fixed $2,500 for a one-week sprint that delivers a working prototype on your real data, so you can validate the approach before committing to a full build.' },
  { q: 'What does a typical AI agent build cost?', a: 'At $2,500/week, a focused single-task agent (about 1–3 weeks) typically runs $2,500–$7,500; a production multi-agent system (6–12 weeks) is $15,000–$30,000. See the AI agent cost guide for the full breakdown and what drives the number.' },
];

export default function ServicesOverview() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }];
  return (
    <>
      <Seo
        title="AI Development Services & Pricing"
        description="AI agent development, voice AI, RAG knowledge bases, and workflow automation — plus transparent pilot/build/retainer packages. Book a free scoping call."
        path="/services"
        image="/og/services.png"
        jsonLd={[breadcrumbJsonLd(crumbs), faqJsonLd(PRICING_FAQ)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        kicker="SERVICES & PRICING"
        title="AI that does real work — built to survive production"
        sub="Four ways I help B2B teams put AI to work, plus clear packages so you know what things cost before we talk."
      >
        <div style={{ marginTop: '1.8rem' }}>
          <Button to={SITE.cta.href}>{SITE.cta.label} →</Button>
        </div>
      </PageHero>

      {/* Service cards */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {services.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} style={card}>
              <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: '1.05rem', color: C.green, marginBottom: '0.5rem' }}>{s.nav}</div>
              <p style={{ fontFamily: C.mono, fontSize: '0.82rem', color: C.dim, lineHeight: 1.7, margin: 0 }}>{s.hero?.sub}</p>
              <div style={{ fontFamily: C.mono, fontSize: '0.74rem', color: C.cyan, marginTop: '0.9rem' }}>Explore {s.nav} →</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Packages */}
      <Section style={{ background: 'rgba(0,255,65,0.02)' }}>
        <Kicker>Packages</Kicker>
        <SectionTitle>Clear ways to start</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.8rem' }}>
          {PACKAGES.map((p) => (
            <div key={p.name} style={{ ...card, border: `1px solid ${p.featured ? C.green : C.panelBorder}`, boxShadow: p.featured ? '0 0 22px rgba(0,255,65,0.12)' : 'none' }}>
              <div style={{ fontFamily: C.mono, fontSize: '0.66rem', letterSpacing: '0.15em', color: C.cyan }}>{p.tagline.toUpperCase()}</div>
              <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: '1.3rem', color: C.text, margin: '0.4rem 0' }}>{p.name}</div>
              <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: '1.5rem', color: C.green, marginBottom: '1rem' }}>{p.price}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {p.points.map((pt) => (
                  <li key={pt} style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.dim, lineHeight: 1.5 }}>
                    <span style={{ color: C.green, marginRight: '0.5rem' }}>▸</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: C.mono, fontSize: '0.74rem', color: C.faint, marginTop: '1.2rem' }}>
          All work is billed at a flat <strong style={{ color: C.green }}>$60/hour or $2,500/week</strong>. Packages are scoped to a fixed number of weeks; exact scope and total are set after a free scoping call.
        </p>
      </Section>

      <Section>
        <Faq faq={PRICING_FAQ} heading="Pricing questions" />
      </Section>

      <CtaBlock />
    </>
  );
}

const card = { display: 'block', textDecoration: 'none', background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.3rem 1.4rem' };
