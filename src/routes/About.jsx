import Seo from '../seo/Seo.jsx';
import { personJsonLd, breadcrumbJsonLd, faqJsonLd } from '../seo/jsonld.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import ProofBar from '../components/ui/ProofBar.jsx';
import { Section, Kicker, SectionTitle } from '../components/ui/Section.jsx';
import Faq from '../components/ui/Faq.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import { C } from '../theme.js';

const PROOF = [
  { metric: '5+ yrs', label: 'shipping production AI & ML systems' },
  { metric: 'IIT Delhi', label: 'engineering background (JEE Mains AIR-1331)' },
  { metric: '10+', label: 'AI products shipped across industries' },
  { metric: 'US/UK/UAE/SG', label: 'clients across time zones' },
];

const VALUES = [
  { title: 'Outcome over output', desc: 'I optimize for the business result — fewer hours, faster cycles, more revenue — not for shipping the most impressive-looking demo.' },
  { title: 'Production-first', desc: 'Guardrails, evals, observability, and human-in-the-loop from day one. I build agents you can actually trust with real work.' },
  { title: 'Straight talk', desc: 'If you don’t need a custom build, I’ll tell you. The fastest way to lose a client’s trust is to sell them something they don’t need.' },
  { title: 'Senior, hands-on', desc: 'You work directly with the person building it — no account managers, no offshore handoffs, no telephone game.' },
];

const ABOUT_FAQ = [
  { q: 'Who is Saswat Mishra?', a: 'I’m an AI agent developer and senior ML engineer from IIT Delhi with 5+ years building production AI — multi-agent systems, voice AI, RAG, and automation — for B2B companies across SaaS, fintech, legal, and real estate.' },
  { q: 'Do you work with international clients?', a: 'Yes. I work remotely with founders and teams across the US, UK, UAE, and Singapore, with working-hours overlap for each, and I’m comfortable with data-residency and compliance constraints.' },
  { q: 'What makes you different from an agency?', a: 'You work directly with the engineer who designs and ships the system — no layers, no handoffs. That means tighter feedback loops, senior judgment on every decision, and accountability for the outcome.' },
];

export default function About() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }];
  return (
    <>
      <Seo
        title="About Saswat Mishra — AI Agent Developer (IIT Delhi)"
        description="Saswat Mishra is an AI agent developer & senior ML engineer from IIT Delhi with 5+ years shipping production AI for B2B teams across the US, UK, UAE, and Singapore."
        path="/about"
        type="profile"
        jsonLd={[personJsonLd(), breadcrumbJsonLd(crumbs), faqJsonLd(ABOUT_FAQ)]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        kicker="ABOUT"
        title="I build AI that takes real work off your team"
        sub="I’m Saswat Mishra — an AI agent developer and senior ML engineer from IIT Delhi. For 5+ years I’ve shipped production AI systems: autonomous agents, voice AI, RAG knowledge bases, and automation that quietly does work people used to do by hand."
      >
        <ProofBar items={PROOF} />
      </PageHero>

      <Section>
        <Kicker>Background</Kicker>
        <SectionTitle>From IIT Delhi to production AI</SectionTitle>
        <p style={para}>I studied Industrial Engineering & Entrepreneurship at IIT Delhi (JEE Mains AIR-1331), and I’ve spent the years since at the intersection of machine learning and product — the rare combination that makes AI projects actually land. I’ve built and shipped across fintech, legal tech, real estate, entertainment, and gaming.</p>
        <p style={para}>That range matters: most "AI developers" can wire up an API call. Far fewer have taken multi-agent systems, voice AI, and RAG pipelines all the way into production, with the guardrails and observability that keep them reliable once real users show up. That’s the work I do.</p>
      </Section>

      <Section style={{ background: 'rgba(0,255,65,0.02)' }}>
        <Kicker>How I work</Kicker>
        <SectionTitle>Principles, not platitudes</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.6rem' }}>
          {VALUES.map((v) => (
            <div key={v.title} style={card}>
              <div style={cardTitle}>{v.title}</div>
              <p style={cardDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Kicker>Working together</Kicker>
        <SectionTitle>International clients welcome</SectionTitle>
        <p style={para}>I work remotely with founders, operators, and engineering leaders across the US, UK, UAE, and Singapore. I keep working-hours overlap for each region, communicate proactively in writing, and I’m comfortable operating under data-residency and compliance constraints when your domain requires it.</p>
      </Section>

      <Section style={{ paddingTop: 0 }}>
        <Faq faq={ABOUT_FAQ} heading="About working with me" />
      </Section>

      <CtaBlock heading="Think we’d work well together?" />
    </>
  );
}

const para = { fontFamily: C.mono, fontSize: '0.95rem', color: C.dim, lineHeight: 1.85, margin: '0 0 1.1rem', maxWidth: 760 };
const card = { background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.2rem 1.3rem' };
const cardTitle = { fontFamily: C.display, fontWeight: 700, fontSize: '1rem', color: C.green, marginBottom: '0.6rem' };
const cardDesc = { fontFamily: C.mono, fontSize: '0.82rem', color: C.dim, lineHeight: 1.7, margin: 0 };
