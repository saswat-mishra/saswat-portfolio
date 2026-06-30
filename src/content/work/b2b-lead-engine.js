// CASE STUDY schema (template for all /work/* pages).
// Rendered by src/routes/CaseStudy.jsx. `service` links up to the hub;
// related.articles link across. Lead with the metric.
export default {
  slug: 'b2b-lead-engine',
  order: 2,
  title: 'AI B2B Lead Engine — LangGraph Multi-Agent Sales System',
  subtitle: 'A 6-agent hub-and-spoke StateGraph that qualifies, scores, and works B2B leads across LinkedIn, email, and voice',
  service: 'ai-agents',
  serviceName: 'AI Agent Development',

  seo: {
    title: 'Case Study: 6-Agent B2B Lead Engine (LangGraph Multi-Agent)',
    description:
      'A 6-agent LangGraph engine for end-to-end B2B sales: MEDDIC scoring, omnichannel outreach (LinkedIn, email, voice), and a human-in-the-loop dashboard.',
  },

  client: 'B2B sales / GTM team',
  role: 'AI engineer — architecture, build, deploy',
  timeframe: '2025',
  status: 'DELIVERED',

  summary:
    'A 6-agent hub-and-spoke system built on a LangGraph StateGraph that runs B2B sales end-to-end: it qualifies and scores leads with a MEDDIC model (0-60), drafts outreach grounded in 7 embedded sales frameworks, and executes across three channels — LinkedIn, email, and AI voice calls — while a real-time Streamlit dashboard keeps a human in the loop for review. Shipped with 124 tests and typed throughout with Pydantic v2.',

  problem: [
    'B2B sales teams lose most of their time before a single real conversation happens: researching accounts, qualifying whether a lead is worth pursuing, deciding which channel to use, and writing outreach that does not read like a template. Done by hand, this work is slow, inconsistent, and impossible to audit when a deal stalls.',
    'The goal was a system that runs the qualification-to-outreach loop end-to-end with a defensible scoring method, draws on proven sales frameworks instead of generic copy, reaches prospects on whatever channel fits, and still lets a human approve or override before anything goes out.',
  ],

  approach: [
    { title: '6-agent hub-and-spoke graph', desc: 'A LangGraph StateGraph coordinates six specialized agents through a central hub with shared state, so research, scoring, and outreach all read and write the same lead record instead of drifting out of sync.' },
    { title: 'MEDDIC qualification scoring', desc: 'Each lead is scored 0-60 on a MEDDIC model (Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion), making "is this worth pursuing?" an explicit, auditable number rather than a gut call.' },
    { title: '7 embedded sales frameworks', desc: 'Seven sales frameworks are embedded in the agents so outreach is grounded in real selling methodology — discovery, value framing, objection handling — not generic AI-written filler.' },
    { title: 'Omnichannel outreach', desc: 'The system reaches prospects across three channels — LinkedIn, email, and AI voice calls via Twilio and Retell AI — choosing the channel that fits the lead and the stage.' },
    { title: 'Human-in-the-loop dashboard', desc: 'A real-time Streamlit dashboard surfaces every lead, score, and drafted message for human review and override before outreach is sent.' },
    { title: 'Typed and tested', desc: 'The whole pipeline is typed with Pydantic v2 and backed by 124 tests, so state transitions and agent outputs stay validated and the system is safe to extend.' },
  ],

  results: [
    { metric: '6', label: 'coordinated agents in one StateGraph' },
    { metric: '0-60', label: 'MEDDIC qualification scoring range' },
    { metric: '3', label: 'outreach channels (LinkedIn, email, voice)' },
    { metric: '124', label: 'tests covering the pipeline' },
  ],

  // Business impact narrative for the Result section.
  resultNarrative:
    'The system replaced hours of manual research and qualification with a defensible, auditable pipeline: every lead gets a MEDDIC score (0-60), outreach is grounded in seven sales frameworks across three channels, and a human approves before anything sends. Shipped with 124 tests, it is safe to extend as the sales motion evolves.',

  stack: ['LangGraph', 'LangChain', 'GPT-4o', 'Twilio', 'Retell AI', 'Streamlit', 'Pydantic v2'],

  testimonial: null,
  video: '/videos/portfolio/B2B Leads Agent.mp4',

  related: {
    articles: ['ai-agent-cost', 'langgraph-vs-crewai-vs-autogen'],
  },
};
