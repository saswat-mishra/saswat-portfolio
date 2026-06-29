// SERVICE PAGE schema (template for all /services/* pages).
// Rendered by src/routes/ServicePage.jsx. Keep copy outcome-led, first-person,
// answer-first. related.{caseStudies,articles} are slugs (hub-and-spoke links).
export default {
  slug: 'ai-automation',
  order: 4,
  nav: 'AI Workflow Automation',
  breadcrumb: 'AI Workflow Automation',
  serviceType: 'AI Workflow Automation',

  // Answer-first GEO intro (40–60 words: what / who / result), rendered as the lead.
  answerFirst:
    'AI workflow automation services connect your tools and add AI-in-the-loop so repetitive, manual work runs itself. It is for ops and GTM teams losing hours to copy-paste, data entry, and triage across SaaS apps that were never meant to talk. The result: workflows that reliably handle 60–90% of the busywork on your real, messy data — with humans on the exceptions.',
  pricing: { from: '$2,500', typical: '$2,500–$20,000' },

  seo: {
    title: 'AI Workflow Automation Services (n8n, Make & Custom Python)',
    description:
      'AI workflow automation that takes manual, repetitive work off your team. I automate ops, GTM, and back-office workflows with n8n/Make/Zapier plus custom Python and LangGraph where logic gets bespoke — typically cutting manual effort 60-90%. Book a free scoping call.',
  },

  hero: {
    kicker: 'AI WORKFLOW AUTOMATION',
    headline: 'AI automation that takes the repetitive work off your team',
    sub: 'I automate the manual, copy-paste workflows that eat your week — ops, GTM, and back-office — using n8n, Make, and Zapier for the plumbing and custom Python or LangGraph where the logic gets bespoke. AI-in-the-loop for judgment calls, humans in control where it matters.',
    primaryQuery: 'ai workflow automation services',
  },

  // Proof bar — shown high in the viewport with the CTA.
  proof: [
    { metric: '60-90%', label: 'less manual effort on automated workflows' },
    { metric: '0', label: 'manual steps in a shipped daily GTM loop' },
    { metric: '22', label: 'sources monitored automatically in one build' },
  ],

  problem: {
    heading: 'Your team is doing work software should be doing',
    body: [
      'Most teams lose hours every week to the same manual loops: pulling data between tools, re-keying records, chasing approvals, formatting reports, triaging inbox and CRM updates, and copy-pasting between SaaS apps that were never meant to talk to each other. It is invisible on the org chart but it is real cost — and it does not scale with headcount.',
      'I automate those workflows end-to-end. For straightforward connect-and-trigger work I use n8n, Make, or Zapier; where a step needs real judgment — classifying, summarizing, extracting, drafting, or deciding — I add AI-in-the-loop. When the logic outgrows a visual builder, I drop into custom Python or LangGraph so the workflow stays reliable instead of becoming a fragile pile of nodes. The result is a system your team trusts to run on its own, with humans kept in the loop wherever a mistake would be expensive.',
    ],
  },

  includes: [
    { title: 'Workflow audit & scoping', desc: 'We map your manual workflows, quantify the time they cost, and pick the highest-ROI ones to automate first — and decide where AI genuinely helps vs. plain automation.' },
    { title: 'n8n / Make / Zapier builds', desc: 'Reliable no-code/low-code automations connecting your CRMs, databases, email, Slack, and SaaS tools, with error handling and alerting baked in.' },
    { title: 'AI-in-the-loop steps', desc: 'LLM steps that classify, extract, summarize, draft, and route — so the automation handles unstructured input and judgment calls, not just rigid if-this-then-that.' },
    { title: 'Custom Python & LangGraph', desc: 'When logic outgrows a visual builder, I move bespoke steps into typed, tested Python or LangGraph so the workflow stays maintainable and debuggable.' },
    { title: 'Human-in-the-loop control', desc: 'Approval gates and review steps on high-stakes or irreversible actions, so the system never acts unsupervised where it shouldn\'t.' },
    { title: 'Monitoring & handover', desc: 'Logging, failure alerts, a runbook, and a walkthrough so your team can operate, trust, and extend the automation without me.' },
  ],

  process: [
    { title: '1 · Scoping call', desc: 'Free 30 minutes to map the workflow, estimate the hours it costs, and pick the automation with the clearest ROI.' },
    { title: '2 · Prototype', desc: 'A working slice of the real workflow within 1-2 weeks so you can see it run on your own data before committing.' },
    { title: '3 · Build & harden', desc: 'Full implementation with AI-in-the-loop steps, error handling, alerting, and human approval gates where they matter.' },
    { title: '4 · Ship & support', desc: 'Deploy, monitor against real usage, and iterate; optional retainer for new workflows and ongoing changes.' },
  ],

  stack: ['n8n', 'Make', 'Zapier', 'Python', 'LangGraph', 'GPT-4o', 'Claude', 'FastAPI', 'Google Sheets API', 'Webhooks'],

  faq: [
    { q: 'What is AI workflow automation?', a: 'AI workflow automation means wiring your tools together so a repetitive business process runs on its own, with AI handling the steps that need judgment. A plain automation moves data on fixed rules; an AI-powered one can read an email, classify a support ticket, extract fields from a messy document, summarize a thread, or draft a reply — then route it. I build these with n8n, Make, or Zapier for the connections and custom Python or LangGraph for any logic too complex for a visual builder.' },
    { q: 'Do you use n8n, Make, or Zapier — and how do you choose?', a: 'I use all three and pick based on the job. Zapier is fastest for simple, popular-app triggers. Make is stronger for branching, data transformation, and visual multi-step flows. n8n is my default when you want self-hosting, lower per-run cost at volume, or to embed custom code and AI steps directly in the workflow. When a process needs real branching logic, retries, and testability beyond what any of them offer cleanly, I move that part into custom Python or LangGraph.' },
    { q: 'How much manual work can automation actually remove?', a: 'For well-scoped, repetitive workflows I typically cut manual effort by 60-90%. The exact figure depends on how structured the inputs are and how many exceptions need a human. Highly standardized work (data entry, report generation, lead routing, status updates) trends toward the top of that range; workflows with frequent judgment calls keep a human in the loop on the hard cases while AI handles the rest. I cover what drives the numbers and the cost trade-offs in my AI automation cost guide.' },
    { q: 'What kinds of workflows do you automate?', a: 'Operations (data sync between tools, report generation, ticket triage, approvals), go-to-market (lead enrichment and scoring, CRM hygiene, outreach sequencing, content workflows), and back-office (invoice and document processing, onboarding steps, recurring reconciliations). A good candidate is any process that is repetitive, rule-heavy or pattern-based, and currently done by a person moving data between screens.' },
    { q: 'How do you keep automations from breaking or making bad calls?', a: 'Error handling and retries on every external call, failure alerts so you hear about problems before your customers do, validation on AI outputs so a model can\'t push garbage downstream, and human-in-the-loop approval gates on anything irreversible or high-stakes. I cover the common failure modes — and how to design around them — in my piece on why AI agents fail. I also work across US/UK/UAE/Singapore time zones and integrate with your existing stack and data-residency constraints.' },
  ],

  related: {
    caseStudies: ['b2b-lead-engine', 'claude-cowork-linkedin-agent'],
    articles: ['ai-automation-cost', 'why-ai-agents-fail'],
  },

  offers: [
    { name: 'Workflow Automation Build', description: 'End-to-end automation of a manual ops, GTM, or back-office workflow with n8n/Make/Zapier.' },
    { name: 'AI-in-the-Loop Automation', description: 'Automations with LLM steps that classify, extract, summarize, and decide — plus custom Python where needed.' },
  ],
};
