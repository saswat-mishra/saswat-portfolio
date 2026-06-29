import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { personJsonLd, websiteJsonLd, profilePageJsonLd, serviceJsonLd, faqJsonLd } from '../seo/jsonld.js';
import BootScreen from '../components/Boot/BootScreen.jsx';
import { SITE } from '../site.config.js';
import { C, WRAP } from '../theme.js';
import { Section, Kicker, SectionTitle } from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import CaseStudyCard from '../components/ui/CaseStudyCard.jsx';
import { services, getWork } from '../content/manifest.js';

// Three-free sections imported statically → hydrate without fallback flash (no CLS).
// HeroSection lazy-loads its own Three.js (HeroCanvas); the rest of Home is a
// conversion-focused, Three-free layer-cake.
import HeroSection from '../components/Hero/HeroSection.jsx';
import TestimonialsSection from '../components/Testimonials/TestimonialsSection.jsx';

const VALUE_POINTS = [
  { h: 'Agents that act, not chat', p: 'Autonomous LangGraph/multi-agent systems that research, decide, and take actions across your tools — with human approval on the risky steps.' },
  { h: 'Voice AI that books & qualifies', p: 'Real-time phone agents with sub-second latency, calendar/CRM integration, and clean human handoff.' },
  { h: 'RAG that answers from your data', p: 'Company copilots and document Q&A that cite sources and don’t hallucinate — hybrid search + reranking + verification.' },
];

const PACKAGES = [
  { name: 'Pilot', price: 'starting at $2,500', line: '1-week working prototype on your real data — go/no-go before you commit.' },
  { name: 'Build', price: 'starting at $7,500', line: 'Full agent or system shipped to production: integrations, guardrails, evals, docs.', featured: true },
  { name: 'Retainer', price: '$2,500 / week', line: 'Ongoing iteration, new agents & workflows, monitoring and tuning.' },
];

const HOME_FAQ = [
  { q: 'What does Saswat Mishra build?', a: 'Custom AI agents, voice AI agents, RAG knowledge bases, and AI workflow automation for B2B teams — designed and shipped to run reliably in production, not just demo well.' },
  { q: 'How do I start a project?', a: 'Book a free 30-minute AI scoping call. I’ll give you an honest read on whether it’s worth building, roughly what it costs (I bill a flat $60/hour or $2,500/week), and how I’d approach it.' },
  { q: 'Do you work with international clients?', a: 'Yes — remotely with founders and teams across the US, UK, UAE, and Singapore, with working-hours overlap and data-residency awareness.' },
];

function InlineCta({ children = SITE.cta.label }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <Button to={SITE.cta.href}>{children} →</Button>
      <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: C.faint, marginTop: '0.8rem', letterSpacing: '0.04em' }}>
        {SITE.cta.microcopy}
      </div>
    </div>
  );
}

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <Seo
        path="/"
        jsonLd={[
          personJsonLd(),
          websiteJsonLd(),
          profilePageJsonLd(),
          serviceJsonLd({
            name: 'AI Agent Development Services',
            serviceType: 'AI Agent Development',
            description: 'Custom AI agents, voice AI, RAG knowledge bases, and workflow automation for B2B teams.',
            path: '/services',
            offers: [
              { name: 'AI Agent Development', description: 'Autonomous LangGraph/multi-agent systems.' },
              { name: 'Voice AI Agents', description: 'Real-time conversational voice agents.' },
              { name: 'RAG & Knowledge Bases', description: 'Retrieval-augmented company copilots.' },
              { name: 'AI Workflow Automation', description: 'Automating manual business workflows with AI.' },
            ],
          }),
          faqJsonLd(HOME_FAQ),
        ]}
      />

      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Outcome / value prop */}
      <Section id="value">
        <Kicker>What I do</Kicker>
        <SectionTitle>I take the work your team shouldn’t be doing — and ship the AI that does it reliably</SectionTitle>
        <p style={lead}>
          Most AI projects stall at the demo. I build the unglamorous parts — guardrails, evals, observability,
          human-in-the-loop — so the system actually runs in production and your team trusts it with real work.
        </p>
        <div style={grid3}>
          {VALUE_POINTS.map((v) => (
            <div key={v.h} style={card}>
              <h3 style={cardTitle}>{v.h}</h3>
              <p style={cardDesc}>{v.p}</p>
            </div>
          ))}
        </div>
        {/* Proof immediately after the value prop */}
        <div style={{ marginTop: '2rem', maxWidth: 460 }}>
          <CaseStudyCard work={getWork('claude-cowork-linkedin-agent')} />
        </div>
        <InlineCta />
      </Section>

      {/* 3 — Productized packages */}
      <Section id="packages" style={{ background: 'rgba(0,255,65,0.02)' }}>
        <Kicker>Productized packages</Kicker>
        <SectionTitle>Clear ways to start — fixed scope, fixed price</SectionTitle>
        <div style={grid3}>
          {PACKAGES.map((p) => (
            <Link key={p.name} to="/services" style={{ ...card, border: `1px solid ${p.featured ? C.green : C.panelBorder}`, boxShadow: p.featured ? '0 0 22px rgba(0,255,65,0.12)' : 'none', textDecoration: 'none' }}>
              <h3 style={cardTitle}>{p.name}</h3>
              <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: '1.25rem', color: C.green, margin: '0.3rem 0 0.7rem' }}>{p.price}</div>
              <p style={cardDesc}>{p.line}</p>
              <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.cyan, marginTop: '0.9rem' }}>See packages & pricing →</div>
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: C.mono, fontSize: '0.74rem', color: C.faint, marginTop: '1.2rem' }}>
          All work billed at a flat <strong style={{ color: C.green }}>$60/hour or $2,500/week</strong>.
        </p>
      </Section>

      {/* 4 — Proof (case-study cards) */}
      <Section id="proof">
        <Kicker>Proof</Kicker>
        <SectionTitle>Systems I’ve shipped — and the numbers they moved</SectionTitle>
        <div style={grid3}>
          {['b2b-lead-engine', 'legal-rag-platform', 'podit-voice-agent'].map((slug) => (
            <CaseStudyCard key={slug} work={getWork(slug)} />
          ))}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/work" style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.cyan, textDecoration: 'none' }}>
            See all case studies →
          </Link>
        </div>
        <InlineCta />
      </Section>

      {/* 5 — Services grid */}
      <Section id="services" style={{ background: 'rgba(0,255,65,0.02)' }}>
        <Kicker>Services</Kicker>
        <SectionTitle>Four ways I put AI to work for B2B teams</SectionTitle>
        <div style={grid2}>
          {services.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} style={{ ...card, textDecoration: 'none' }}>
              <h3 style={cardTitle}>{s.nav}</h3>
              <p style={cardDesc}>{s.hero?.sub}</p>
              <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.cyan, marginTop: '0.9rem' }}>Explore {s.nav} →</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 6 — Testimonials (named, near the footer CTA) */}
      <TestimonialsSection />

      {/* 7 — Final CTA */}
      <CtaBlock />
    </>
  );
}

const lead = { fontFamily: C.mono, fontSize: '0.98rem', color: C.dim, lineHeight: 1.8, maxWidth: 760, margin: '0 0 1.5rem' };
const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' };
const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' };
const card = { background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.3rem 1.4rem' };
const cardTitle = { fontFamily: C.display, fontWeight: 700, fontSize: '1.02rem', color: C.green, margin: '0 0 0.6rem' };
const cardDesc = { fontFamily: C.mono, fontSize: '0.82rem', color: C.dim, lineHeight: 1.7, margin: 0 };
