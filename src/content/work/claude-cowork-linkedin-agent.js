// CASE STUDY schema (template for all /work/* pages).
// Rendered by src/routes/CaseStudy.jsx. `service` links up to the hub;
// related.articles link across. Lead with the metric.
export default {
  slug: 'claude-cowork-linkedin-agent',
  order: 1,
  title: 'Claude Cowork — LinkedIn Multi-Agent GTM System',
  subtitle: '12 autonomous agents running an entire LinkedIn growth + outbound motion',
  service: 'ai-agents',
  serviceName: 'AI Agent Development',

  seo: {
    title: 'Case Study: 12-Agent LinkedIn GTM Automation (Claude API)',
    description:
      'Claude Cowork — a 12-agent Claude API system that publishes in-voice LinkedIn posts, scores leads, and runs DM outreach. 28 days: +5,735% impressions.',
  },

  client: 'Solo founder / GTM',
  role: 'AI engineer — architecture, build, deploy',
  timeframe: '2025',
  status: 'LIVE',

  summary:
    'A fully autonomous LinkedIn go-to-market system: 12 Python agents orchestrated through the Claude API that discover trending AI topics, draft and publish posts in the founder’s voice, score inbound and outbound leads on a 100-point ICP model, run a 7-day warmup, and send personalized DMs — with zero manual input.',

  problem: [
    'Founder-led GTM on LinkedIn works, but it eats hours every day: finding what to post about, writing in a consistent voice, identifying who is worth reaching out to, warming them up, and following through on DMs. None of it scales with a single person’s time.',
    'The goal was an autonomous system that runs the whole loop end-to-end while keeping the output on-brand and the targeting tight enough that outreach stays credible, not spammy.',
  ],

  approach: [
    { title: 'Topic discovery', desc: 'Agents scan 22 sources daily to surface trending AI topics worth posting about.' },
    { title: 'In-voice drafting', desc: 'A writing agent drafts and publishes ~2 posts/day matched to the founder’s tone and prior posts.' },
    { title: '100-point ICP scoring', desc: 'A scoring model ranks prospects on title, intent, company fit, and recent activity so outreach targets the right people.' },
    { title: 'Warmup + outreach', desc: 'A 7-day per-prospect warmup precedes personalized DM outreach, all sequenced by the orchestrator.' },
    { title: 'Orchestration', desc: '12 agents coordinated via the Claude API with shared state, integrating Apify, Chrome automation, and Google Sheets.' },
  ],

  results: [
    { metric: '+5,735%', label: '28-day impressions lift (to 3,676)' },
    { metric: '1,156', label: 'members reached' },
    { metric: '31', label: 'leads in pipeline' },
    { metric: '0', label: 'manual steps in the daily loop' },
  ],

  // Business impact narrative for the Result section.
  resultNarrative:
    'In its first 28 days the system lifted LinkedIn impressions by 5,735% (to 3,676), reached 1,156 members, and put 31 qualified leads into the pipeline — all on autopilot, with zero manual steps in the daily loop. It turned a founder’s scattered, hours-a-day LinkedIn effort into a hands-off GTM engine.',

  stack: ['Python', 'Claude API', '12-agent orchestration', 'Apify', 'Chrome Automation', 'Google Sheets API'],

  testimonial: null,
  video: '/videos/portfolio/Claude Cowork LinkedIn.mp4',

  related: {
    articles: ['ai-agent-cost', 'why-ai-agents-fail', 'langgraph-vs-crewai-vs-autogen'],
  },
};
