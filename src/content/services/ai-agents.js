// SERVICE PAGE schema (template for all /services/* pages).
// Rendered by src/routes/ServicePage.jsx. Keep copy outcome-led, first-person,
// answer-first. related.{caseStudies,articles} are slugs (hub-and-spoke links).
export default {
  slug: 'ai-agents',
  order: 1,
  nav: 'AI Agent Development',
  breadcrumb: 'AI Agent Development',
  serviceType: 'AI Agent Development',

  // Answer-first GEO intro (40–60 words: what / who / result), rendered as the lead.
  answerFirst:
    'Custom AI agent development is building autonomous LangGraph and multi-agent systems that reason, call your tools, and finish multi-step work — not chatbots. It is for B2B SaaS and services teams drowning in manual ops, research, or outreach. The result: reliable agents your team trusts to take real work off their plate, shipped to production with guardrails and evals.',
  pricing: { from: '$2,500', typical: '$7,500–$30,000' },

  seo: {
    title: 'Custom AI Agent Development (LangGraph & Multi-Agent)',
    description:
      'Custom AI agent development with LangGraph and multi-agent orchestration. I design, build, and ship autonomous agents that reason, plan, and take real work off your team. Book a free scoping call.',
  },

  hero: {
    kicker: 'AI AGENT DEVELOPMENT',
    headline: "Custom AI agents that take real work off your team's plate",
    sub: 'I design and build autonomous LangGraph/LangChain agents and multi-agent systems that research, decide, and act across your workflows — with human-in-the-loop control, evals, and observability so they hold up in production.',
    primaryQuery: 'custom ai agent development',
  },

  // Proof bar — shown high in the viewport with the CTA.
  proof: [
    { metric: '80%', label: 'less manual research time on a shipped lead-gen agent' },
    { metric: '12', label: 'coordinated agents in one production GTM system' },
    { metric: '124', label: 'tests on a single delivered multi-agent build' },
  ],

  problem: {
    heading: 'Most "AI agents" never survive contact with production',
    body: [
      'Demos are easy; reliable agents are hard. The gap is everything that happens after the happy path — tool errors, hallucinated arguments, runaway loops, silent failures, and no way to see what the agent actually did. Teams end up babysitting a system that was supposed to save them time.',
      'I build agents the way you build the rest of your stack: explicit state machines, typed tool calls, retries and guardrails, human-in-the-loop checkpoints on high-stakes actions, and tracing so every decision is auditable. The result is an agent your team trusts enough to actually hand work to.',
    ],
  },

  includes: [
    { title: 'Agent architecture & scoping', desc: 'We map the workflow, decide where an agent helps vs. plain automation, and define success metrics before writing code.' },
    { title: 'LangGraph state machines', desc: 'Deterministic graphs with explicit nodes, edges, and state — not a prompt-and-pray loop. Easy to reason about and extend.' },
    { title: 'Typed tools & integrations', desc: 'Pydantic-validated tool calls into your APIs, databases, CRMs, and third-party services, with retries and error handling.' },
    { title: 'Human-in-the-loop control', desc: 'Review/approve gates on irreversible or high-stakes actions, plus override and edit paths.' },
    { title: 'Evals & observability', desc: 'Test suites over real cases, tracing (LangSmith/OpenTelemetry), and dashboards so you can see and trust agent behavior.' },
    { title: 'Handover & docs', desc: 'Clean repo, runbook, and a walkthrough so your team can operate and extend the system.' },
  ],

  process: [
    { title: '1 · Scoping call', desc: 'Free 30 minutes to pressure-test the use case, ROI, and the riskiest unknowns.' },
    { title: '2 · Prototype', desc: 'A working vertical slice on your real data within 1–2 weeks to de-risk the approach.' },
    { title: '3 · Build & harden', desc: 'Full implementation with tools, guardrails, evals, and observability.' },
    { title: '4 · Ship & support', desc: 'Deploy, monitor, and iterate against real usage; optional retainer for ongoing work.' },
  ],

  stack: ['LangGraph', 'LangChain', 'GPT-4o', 'Claude', 'Pydantic v2', 'Python', 'LangSmith', 'FastAPI', 'Streamlit'],

  faq: [
    { q: 'What is custom AI agent development?', a: 'It is building an autonomous system that uses an LLM to reason over a goal, choose actions, call tools/APIs, and complete multi-step tasks — tailored to your workflow rather than a generic chatbot. In practice that means a state machine (often LangGraph), typed tools into your systems, guardrails, and human checkpoints.' },
    { q: 'LangGraph or CrewAI or AutoGen — which do you use?', a: 'I default to LangGraph for production work because its explicit state graph makes agents debuggable and reliable, but the right choice depends on the task. I cover the trade-offs in detail in my LangGraph vs CrewAI vs AutoGen comparison.' },
    { q: 'How much does a custom AI agent cost?', a: 'I bill at a flat $60/hour or $2,500/week, so cost tracks weeks of work: a focused single-agent build (about 1–3 weeks) typically runs $2,500–$7,500, and a complex multi-agent system (6–12 weeks) is $15,000–$30,000. The biggest driver is integration surface and reliability requirements. See my full AI agent cost guide for the breakdown.' },
    { q: 'How do you keep agents from hallucinating or going off the rails?', a: 'Typed tool calls (the model can only act through validated functions), explicit graph control flow, retries with bounded loops, output validation, human-in-the-loop gates on risky actions, and eval suites that run on every change.' },
    { q: 'Can you work with my existing stack and data?', a: 'Yes. Agents integrate with your APIs, databases, CRMs, and SaaS tools. I handle auth, rate limits, and data-residency constraints, and I work across US/UK/UAE/Singapore time zones.' },
  ],

  related: {
    caseStudies: ['claude-cowork-linkedin-agent', 'b2b-lead-engine'],
    articles: ['ai-agent-cost', 'langgraph-vs-crewai-vs-autogen', 'build-ai-agent-langgraph', 'why-ai-agents-fail'],
  },

  offers: [
    { name: 'Autonomous Agent Development', description: 'Single-purpose agents that reason, plan, and act across a workflow.' },
    { name: 'Multi-Agent Orchestration', description: 'Coordinated specialist agents collaborating on complex tasks.' },
  ],
};
