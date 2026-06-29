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
    'Saswat Mishra builds custom AI agents, voice AI, RAG knowledge bases, and workflow automation for B2B teams. IIT Delhi engineer, 5+ years, production-grade systems shipped across SaaS, fintech, legal, and real estate.',
  email: 'saswatmishra.iitd@gmail.com',
  ogImage: '/og-image.png',
  twitter: '@saswatmishra',
  founder: {
    jobTitle: 'AI Agent Developer & Senior ML Engineer',
    alumni: 'Indian Institute of Technology Delhi',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/saswatbuilds/',
    github: 'https://github.com/saswat-mishra',
    upwork: 'https://upwork.com/freelancers/saswat-mishra',
  },
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
      { label: 'Contact', href: '/contact' },
      { label: 'Résumé (PDF)', href: '/resume.pdf', external: true },
    ],
  },
];

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
