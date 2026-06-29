// CASE STUDY schema (template for all /work/* pages).
// Rendered by src/routes/CaseStudy.jsx. `service` links up to the hub;
// related.articles link across. Lead with the metric.
export default {
  slug: 'podit-voice-agent',
  order: 3,
  title: 'Podit — AI Voice Event Agent',
  subtitle: 'A hybrid voice + text agent that plans, schedules, and protects your calendar',
  service: 'voice-ai-agents',
  serviceName: 'Voice AI Agents',

  seo: {
    title: 'Case Study: Podit — Hybrid Voice AI Event & Scheduling Agent',
    description:
      'How I built Podit, a hybrid voice/text AI agent for event planning and scheduling: sub-500ms latency, Google Calendar integration, conflict detection, and dynamic guardrails that respect sleep and work hours. Built on LangGraph, OpenAI, and Twilio.',
  },

  client: 'Podit (startup)',
  role: 'AI engineer — voice architecture, agent graph, integrations',
  timeframe: '2025',
  status: 'LIVE',

  summary:
    'Podit is a hybrid voice and text AI agent for intelligent event planning and scheduling. Users talk or type to plan events; the agent detects scheduling conflicts, books into Google Calendar, and respects personal guardrails like sleep and work hours so it never schedules over them. The voice loop runs at sub-500ms latency, fast enough to feel like a real conversation rather than a delayed assistant.',

  problem: [
    'Scheduling is one of the most common things people want to hand to an assistant, but most voice agents fail at exactly the part that matters: they book over conflicts, ignore personal boundaries like sleep and work hours, and lag badly enough that the conversation feels broken. A scheduling agent that double-books or wakes you up is worse than no agent at all.',
    'Podit needed to be conversational and fast, but also disciplined — it had to reason over a live calendar, catch conflicts before committing, and honor each user’s preferences as hard constraints, all while staying responsive enough on voice to feel natural.',
  ],

  approach: [
    { title: 'Hybrid voice + text', desc: 'One agent serves both a voice channel (via Twilio) and a text channel, so users can switch between speaking and typing without losing context.' },
    { title: 'Sub-500ms voice loop', desc: 'Tuned the speech-to-response pipeline — streaming, model selection, and pruned tool calls — to keep round-trip latency under 500ms so the conversation feels live.' },
    { title: 'Conflict detection', desc: 'Before booking, the agent reads the live Google Calendar and checks for overlaps, flagging conflicts and proposing alternatives instead of double-booking.' },
    { title: 'Dynamic guardrails', desc: 'User preferences such as sleep and work hours are enforced as dynamic guardrails, so the agent never schedules into protected time even when asked carelessly.' },
    { title: 'Agent orchestration', desc: 'A LangGraph state graph (on OpenAI models) sequences understanding, calendar reads, conflict checks, and confirmation, with shared state persisted in Supabase and a React Native client.' },
  ],

  results: [
    { metric: '<500ms', label: 'voice round-trip latency' },
    { metric: 'Voice + text', label: 'hybrid agent, one shared context' },
    { metric: 'Calendar-integrated', label: 'live Google Calendar reads + writes' },
    { metric: 'Guardrail-aware', label: 'respects sleep / work hours, no double-booking' },
  ],

  // Business impact narrative for the Result section.
  resultNarrative:
    'Podit holds real-time voice conversations at sub-500ms latency, reads and writes a live Google Calendar, catches conflicts before booking, and enforces sleep/work-hour guardrails so it never double-books or schedules over protected time — a scheduling assistant users can actually trust with their calendar.',

  stack: ['LangChain', 'LangGraph', 'OpenAI', 'Twilio', 'React Native', 'Supabase'],

  testimonial: {
    quote: 'A dependable engineer who can be trusted with complex, high-stakes work',
    author: 'Ajay S., Founder',
  },
  video: '/videos/podit.mp4',

  related: {
    articles: ['ai-voice-agent-cost', 'retell-vs-vapi-vs-bland', 'build-voice-ai-agent'],
  },
};
