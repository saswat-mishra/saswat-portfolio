// Single source of truth for site-wide constants: domain, identity, CTA, nav.
// Imported by SEO/JSON-LD builders, layout, and route components.

export const SITE = {
  origin: 'https://saswatbuilds.com',
  name: 'Saswat Mishra',
  brand: 'saswatbuilds.com',
  defaultTitle:
    'Saswat Mishra — Custom AI Agents, Voice AI & Automation Developer',
  titleTemplate: '%s | Saswat Mishra',
  tagline:
    "Custom AI agents & automation that take real work off your team's plate.",
  description:
    'Saswat Mishra builds custom AI agents, voice AI, RAG knowledge bases, and automation for B2B teams — IIT Delhi engineer, 5+ years shipping production AI.',
  // ── CANONICAL BIO ──────────────────────────────────────────────────────────
  // ONE entity-consistency bio string, used VERBATIM in three places: the About
  // page (bio paragraph), the footer (brand blurb), and Person/Organization
  // JSON-LD `description`. Do not fork it — search engines and AI answer engines
  // cross-check the entity across these surfaces, so the exact same sentence in
  // all three strengthens the Saswat-Mishra entity. (See CLAUDE.md.)
  canonicalBio:
    'Saswat Mishra is an AI agent developer and senior machine learning engineer from IIT Delhi with 5+ years building production AI — autonomous multi-agent systems, voice AI, RAG knowledge bases, and workflow automation — for B2B teams across the US, UK, UAE, and Singapore.',
  email: 'saswatmishra.iitd@gmail.com',
  ogImage: '/og-image.png',
  twitter: '@saswatmishra',
  founder: {
    jobTitle: 'AI Agent Developer & Senior ML Engineer',
    alumni: 'Indian Institute of Technology Delhi',
  },
  // Public profiles → schema `sameAs` + footer. Only non-empty entries are
  // emitted, so unverified profiles (crunchbase/clutch) stay out of sameAs until
  // you paste a real URL — a wrong sameAs hurts entity resolution.
  social: {
    linkedin: 'https://www.linkedin.com/in/saswatbuilds/',
    github: 'https://github.com/saswat-mishra',
    upwork: 'https://upwork.com/freelancers/saswat-mishra',
    x: 'https://x.com/saswatmishra',
    huggingface: 'https://huggingface.co/saswatmishra',
    crunchbase: '', // ← paste profile URL to add to sameAs + footer
    clutch: '', // ← paste profile URL to add to sameAs + footer
  },
  // ── Third-party IDs (config-driven; empty = not emitted) ─────────────────────
  // Paste the tokens below and rebuild — the integration is already wired
  // (verification <meta> + analytics <script> are injected site-wide at prerender
  // via headExtras() and on the client via SiteMeta). No code changes needed.
  verification: {
    google: '', // Search Console → HTML tag method → the content="..." value
    bing: '', // Bing Webmaster Tools → meta tag → the content="..." value
  },
  analytics: {
    // Cloudflare Web Analytics (free, cookieless): dash.cloudflare.com → Web
    // Analytics → add saswatbuilds.com → copy the beacon token.
    cloudflareToken: '',
    plausibleDomain: '', // optional: set to 'saswatbuilds.com' if you add Plausible
  },
  clarity: '', // Microsoft Clarity project ID (clarity.microsoft.com)
  // Primary CTA, used site-wide (header button, page CTA blocks). First-person
  // label per the Dossier, identical everywhere. Risk-reversal microcopy below it.
  cta: {
    label: 'Book my free 30-min AI scoping call',
    short: 'Book my call',
    href: '/contact',
    microcopy: 'Free · 30 min · no obligation · reply within 1 business day',
  },
  // Scheduler embed target (Cal.com / Calendly). Update to the real link.
  scheduler: 'https://cal.com/saswatbuilds/ai-scoping-call',
};

/** Stable @id for the founder, referenced across JSON-LD graphs. */
export const PERSON_ID = `${SITE.origin}/#person`;
export const ORG_ID = `${SITE.origin}/#org`;
export const WEBSITE_ID = `${SITE.origin}/#website`;

/** Absolute URL for a route path. */
export const abs = (path = '/') =>
  `${SITE.origin}${path === '/' ? '/' : '/' + String(path).replace(/^\/+|\/+$/g, '')}${
    path !== '/' && !String(path).includes('.') ? '/' : ''
  }`;

// Primary header navigation (real route links, crawlable).
export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

// Hub-and-spoke footer (links down to money pages + across to CTA).
export const FOOTER_NAV = [
  {
    title: 'Services',
    links: [
      { label: 'AI Agent Development', href: '/services/ai-agents' },
      { label: 'Voice AI Agents', href: '/services/voice-ai-agents' },
      { label: 'RAG & Knowledge Bases', href: '/services/rag-knowledge-base' },
      { label: 'AI Workflow Automation', href: '/services/ai-automation' },
      { label: 'Pricing & Packages', href: '/services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'AI agent cost guide', href: '/blog/ai-agent-cost' },
      { label: 'LangGraph vs CrewAI vs AutoGen', href: '/blog/langgraph-vs-crewai-vs-autogen' },
      { label: 'Retell vs Vapi vs Bland', href: '/blog/retell-vs-vapi-vs-bland' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Case studies', href: '/work' },
      { label: 'About', href: '/about' },
      { label: 'Open source', href: '/open-source' },
      { label: 'Contact', href: '/contact' },
      { label: 'Résumé (PDF)', href: '/resume.pdf', external: true },
    ],
  },
];

/**
 * Public-profile URLs for schema `sameAs` (and the footer social row), in a
 * stable order. Empty config entries are dropped so we never emit a sameAs that
 * doesn't resolve. The email mailto is intentionally excluded (not a profile).
 */
export function sameAs() {
  const s = SITE.social;
  return [s.linkedin, s.github, s.upwork, s.x, s.huggingface, s.crunchbase, s.clutch].filter(Boolean);
}

/**
 * Site-wide <head> extras injected at prerender time (and mirrored on the client
 * by SiteMeta): search-engine verification <meta> + privacy-friendly analytics.
 * Everything is config-driven and conditional, so with empty tokens this returns
 * '' (build stays clean) and the moment you paste a token + rebuild, the tag
 * appears on every route. Returns a raw HTML string for prerender injection.
 */
export function headExtras() {
  const out = [];
  if (SITE.verification.google)
    out.push(`<meta name="google-site-verification" content="${SITE.verification.google}">`);
  if (SITE.verification.bing)
    out.push(`<meta name="msvalidate.01" content="${SITE.verification.bing}">`);
  if (SITE.analytics.cloudflareToken)
    out.push(
      `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${SITE.analytics.cloudflareToken}"}'></script>`,
    );
  if (SITE.analytics.plausibleDomain)
    out.push(
      `<script defer data-domain="${SITE.analytics.plausibleDomain}" src="https://plausible.io/js/script.js"></script>`,
    );
  if (SITE.clarity)
    out.push(
      `<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${SITE.clarity}");</script>`,
    );
  return out.join('\n');
}

// Open-source repos surfaced on /open-source (credibility + E-E-A-T/GEO + backlinks).
// `name` = the GitHub repo slug; the URL derives from the configured GitHub account.
export const OSS = [
  {
    name: 'langgraph-agent-starter',
    title: 'LangGraph Agent Starter',
    language: 'Python',
    desc: 'A production-shaped LangGraph starter: typed state, a plan → act → verify loop, a human-in-the-loop approval checkpoint, and an evals harness — the parts that make an agent reliable, not just demo-able. Runs offline in under 60 seconds.',
    topics: ['langgraph', 'ai-agents', 'multi-agent', 'human-in-the-loop', 'evals'],
    highlights: ['Typed agent state', 'plan → act → verify loop', 'Human-in-the-loop checkpoint', 'Evals harness + zero-dep demo'],
    related: 'ai-agents',
  },
  {
    name: 'voice-ai-agent-starter',
    title: 'Voice AI Agent Starter',
    language: 'Python',
    desc: 'A latency-aware voice AI boilerplate: the STT → LLM → TTS turn pipeline with a per-stage latency budget, barge-in-ready turn handling, and reference Twilio + Retell webhook servers. Simulates a call offline with no keys.',
    topics: ['voice-ai', 'twilio', 'retell', 'tts', 'realtime'],
    highlights: ['STT → LLM → TTS pipeline', 'Per-stage latency budget', 'Barge-in ready', 'Twilio + Retell servers'],
    related: 'voice-ai-agents',
  },
];
/** Full GitHub URL for an OSS repo (derived from SITE.social.github). */
export const ossUrl = (name) => `${SITE.social.github}/${name}`;

// Knowledge areas for Person JSON-LD (ported from the original site head).
export const KNOWS_ABOUT = [
  'AI Agent Development',
  'Multi-Agent Systems',
  'LangGraph',
  'LangChain',
  'Large Language Models',
  'GPT-4',
  'Anthropic Claude',
  'Retrieval-Augmented Generation',
  'RAG Systems',
  'Voice AI',
  'AI Workflow Automation',
  'Computer Vision',
  'Python',
  'React',
];
