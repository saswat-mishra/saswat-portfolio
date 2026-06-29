// BLOG ARTICLE schema (template for all /blog/* posts).
// Rendered by src/routes/BlogPost.jsx + RichBody. Answer-first, question H2s,
// tables, TL;DR, sourced claims. body is an array of typed blocks:
//   { type:'p', text }                      paragraph (may include inline <strong> via **bold**)
//   { type:'h2', text } / { type:'h3', text }
//   { type:'ul'|'ol', items:[...] }
//   { type:'table', headers:[...], rows:[[...]] }
//   { type:'callout', title?, text }        highlighted box (e.g. key takeaway)
//   { type:'quote', text, cite? }
//   { type:'code', code, lang? }
export default {
  slug: 'ai-voice-agent-cost',
  title: 'How Much Does an AI Voice Agent Cost? (2026 Pricing Guide)',
  description:
    'A practical 2026 breakdown of AI voice agent pricing — one-time build cost plus the real per-minute runtime cost of telephony, speech-to-text, the LLM, and text-to-speech — and what actually moves the number.',
  date: '2026-06-10',
  updated: '2026-06-10',
  readingTime: '9 min',
  category: 'Cost Guide',
  primaryQuery: 'ai voice agent cost',

  tldr: [
    'I bill a flat $60/hour or $2,500/week — build cost ≈ weeks of work × $2,500.',
    'A single-purpose voice agent (one call flow, a couple of integrations) typically costs ~$5k–$10k to build.',
    'A production phone agent with CRM/calendar integrations, guardrails, and barge-in handling runs ~$10k–$20k.',
    'Unlike text agents, voice has a real per-minute runtime cost — telephony + STT + LLM + TTS — usually ~$0.07–$0.20 per minute all-in.',
    'The biggest cost drivers are conversation latency, integration surface, and call reliability — not the voice model you pick.',
  ],

  body: [
    { type: 'p', text: 'The honest answer: **an AI voice agent costs roughly $5,000 to $35,000+ to build, plus about $0.07–$0.20 per call minute to run.** I bill at a flat **$60/hour or $2,500/week**, so the build figure is really just weeks of work × $2,500. What separates a cheap one from an expensive one is rarely the voice quality — it is the engineering that keeps the conversation fast, on-script, and correctly wired into your calendar, CRM, and phone system.' },

    { type: 'h2', text: 'What does an AI voice agent actually cost in 2026?' },
    { type: 'p', text: 'There are two numbers that matter for a voice agent: the one-time build, and the per-minute runtime cost (which text agents barely have). Here are realistic ranges for a custom-built phone or in-app voice agent, based on shipped work:' },
    {
      type: 'table',
      headers: ['Type of voice agent', 'Typical build cost', 'Timeline'],
      rows: [
        ['Single call flow (1 task, FAQ or qualification)', '$5k–$10k', '2–4 weeks'],
        ['Production phone agent (CRM/calendar, guardrails, transfers)', '$10k–$20k', '4–8 weeks'],
        ['Multi-flow / multi-language agent (routing, analytics, HITL)', '$20k–$35k+', '8–14 weeks'],
        ['Per-minute runtime (telephony + STT + LLM + TTS)', '$0.07–$0.20 / min', 'continuous'],
      ],
    },
    { type: 'callout', title: 'Key takeaway', text: 'A text agent’s LLM bill is a rounding error. A voice agent’s is not: at scale, per-minute runtime can rival or exceed the build cost, so the unit economics have to work before you turn it on.' },

    { type: 'h2', text: 'Why does a voice agent have a real per-minute cost?' },
    { type: 'p', text: 'A text agent calls one model and stops. A voice agent runs a real-time pipeline on every second of the call: it streams audio in, transcribes it, sends text to the LLM, converts the reply back to speech, and pushes it down a phone line — all fast enough to feel like a conversation. Each of those stages is metered. Here is roughly where the per-minute cost goes:' },
    {
      type: 'table',
      headers: ['Pipeline stage', 'What it does', 'Rough cost / minute'],
      rows: [
        ['Telephony', 'Inbound/outbound phone carriage (PSTN/SIP)', '$0.01–$0.02'],
        ['Speech-to-text (STT)', 'Transcribes the caller in real time', '$0.01–$0.04'],
        ['LLM', 'Decides what to say and which tools to call', '$0.02–$0.08'],
        ['Text-to-speech (TTS)', 'Speaks the reply in a natural voice', '$0.02–$0.08'],
        ['All-in (typical)', 'Telephony + STT + LLM + TTS combined', '$0.07–$0.20'],
      ],
    },
    { type: 'p', text: 'Platforms like Retell, Vapi, and Bland bundle some or all of these stages and add a per-minute platform fee on top, which is why their published rates often land near the top of this range. A self-hosted pipeline can be cheaper per minute but costs more engineering up front.' },

    { type: 'h2', text: 'What drives the build price up or down?' },
    { type: 'p', text: 'Five factors explain most of the gap between a $5k voice agent and a $35k one:' },
    {
      type: 'ul',
      items: [
        '**Latency budget** — natural conversation needs sub-second responses, so streaming, interruption (barge-in), and endpointing tuning are real engineering, not config.',
        '**Integration surface** — every calendar, CRM, or backend the agent reads or writes during a live call adds auth, error handling, and tight timeouts.',
        '**Call reliability** — handling silence, background noise, accents, voicemail, and graceful human handoff is where most of the budget goes.',
        '**Compliance and recording** — consent prompts, call recording, redaction, and data handling add scope for regulated industries.',
        '**Languages and voices** — multi-language support and on-brand custom voices multiply testing and tuning effort.',
      ],
    },

    { type: 'h2', text: 'Why is the voice model such a small part of the cost?' },
    { type: 'p', text: 'Modern STT and TTS models all sound good in a demo. The hard part is the orchestration around them: detecting when the caller has actually finished speaking, letting them interrupt the agent mid-sentence, recovering when a tool call is slow, and knowing when to hand off to a human. A voice agent that sounds perfect but talks over people or stalls for two seconds will get hung up on. That conversational robustness — not the model — is what you are paying an engineer to build.' },
    { type: 'quote', text: 'A voice demo that works once is easy. A voice agent that handles a confused caller on a bad line is the entire budget.', cite: 'Saswat Mishra' },

    { type: 'h2', text: 'How do you keep voice agent cost reasonable?' },
    {
      type: 'ol',
      items: [
        'Start with one high-value call flow — appointment booking or lead qualification — instead of replacing a whole call centre.',
        'Validate the per-minute unit economics against the value of each call before scaling volume.',
        'Prototype on real call recordings to surface latency and accent issues early, when they are cheap to fix.',
        'Keep human handoff in from day one, then narrow it as the agent earns trust on live calls.',
      ],
    },
  ],

  faq: [
    { q: 'How much does an AI voice agent cost to build?', a: 'I bill a flat $60/hour or $2,500/week, so the build cost is essentially weeks of work × $2,500. A single-flow voice agent typically costs $5,000–$10,000; a production phone agent with CRM/calendar integrations, guardrails, and human handoff runs $10,000–$35,000+. The main drivers are the latency budget, integration surface, and call reliability rather than the voice model itself.' },
    { q: 'What is the per-minute cost of running an AI voice agent?', a: 'Most voice agents cost about $0.07–$0.20 per call minute all-in, covering telephony, speech-to-text, the LLM, and text-to-speech. Platforms like Retell, Vapi, and Bland add a per-minute platform fee on top, so their rates often sit near the top of that range; a self-hosted pipeline can be cheaper per minute but costs more to build.' },
    { q: 'Why does a voice agent cost more to run than a text chatbot?', a: 'A text chatbot calls one model and stops, so its runtime cost is tiny. A voice agent runs a real-time pipeline on every second of the call — streaming audio, transcribing it, querying the LLM, and synthesising speech — and each stage is metered per minute, which is why voice has a genuine ongoing cost that text agents do not.' },
  ],

  related: {
    service: 'voice-ai-agents',
    articles: ['retell-vs-vapi-vs-bland', 'build-voice-ai-agent'],
    caseStudies: ['podit-voice-agent'],
  },
};
