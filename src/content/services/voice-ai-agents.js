// SERVICE PAGE schema (template for all /services/* pages).
// Rendered by src/routes/ServicePage.jsx. Keep copy outcome-led, first-person,
// answer-first. related.{caseStudies,articles} are slugs (hub-and-spoke links).
export default {
  slug: 'voice-ai-agents',
  order: 2,
  nav: 'Voice AI Agents',
  breadcrumb: 'Voice AI Agents',
  serviceType: 'Voice AI Agent Development',

  // Answer-first GEO intro (40–60 words: what / who / result), rendered as the lead.
  answerFirst:
    'AI voice agent development is building real-time phone agents that answer and place calls, hold natural multi-turn conversations, and take actions in your systems. It is for teams that book, qualify, or support by phone and cannot scale headcount. The result: a 24/7 line that closes the loop — booking, qualifying, and following up — at sub-second latency.',
  pricing: { from: '$2,500', typical: '$10,000–$35,000' },

  seo: {
    title: 'AI Voice Agent Development (Retell, Vapi & Twilio)',
    description:
      'AI voice agent development for real-time phone calls that book, qualify, support, and follow up. I build sub-second, natural-sounding voice agents with human handoff on Twilio, Retell, Vapi, and LiveKit. Book a free scoping call.',
  },

  hero: {
    kicker: 'VOICE AI AGENT DEVELOPMENT',
    headline: 'AI voice agents that book, qualify, and follow up by phone',
    sub: 'I build real-time conversational voice agents that answer and place calls, hold natural multi-turn conversations, take actions in your systems, and hand off to a human when it matters — with sub-second latency so callers never feel like they are talking to a robot.',
    primaryQuery: 'ai voice agent development',
  },

  // Proof bar — shown high in the viewport with the CTA.
  proof: [
    { metric: 'sub-500ms', label: 'response latency on a shipped voice agent' },
    { metric: '24/7', label: 'availability — every call answered, day or night' },
    { metric: 'multi-turn', label: 'scheduling with live conflict detection' },
  ],

  problem: {
    heading: 'Most voice bots fail the moment a real caller talks back',
    body: [
      'Callers forgive a lot, but not lag and not robotic turn-taking. The usual failure modes are latency that makes every reply feel awkward, an agent that talks over people or misses interruptions, brittle scripts that collapse the second someone goes off-flow, and no clean way to reach a human when the call gets complicated. The result is abandoned calls and a brand that sounds cheap.',
      'I build voice agents the way a senior engineer builds anything that runs in production: a tuned speech-to-text and text-to-speech pipeline for sub-second responses, real barge-in and turn detection, an explicit conversation state machine instead of a fragile prompt, typed actions into your calendar and CRM, and a warm human handoff path. The outcome is a phone line that actually closes the loop — booking, qualifying, and following up without a person on the other end.',
    ],
  },

  includes: [
    { title: 'Telephony & call routing', desc: 'Inbound and outbound calling on Twilio with number provisioning, IVR replacement, and routing into your existing phone setup.' },
    { title: 'Low-latency voice pipeline', desc: 'Tuned Deepgram speech-to-text and ElevenLabs/OpenAI Realtime voices for natural, sub-second responses on real calls.' },
    { title: 'Natural turn-taking', desc: 'Barge-in, interruption handling, and end-of-turn detection so the agent listens and responds like a person, not a script reader.' },
    { title: 'Actions & integrations', desc: 'Typed tool calls into your calendar, CRM, and APIs to book appointments, qualify leads, check availability, and log every call.' },
    { title: 'Human handoff & escalation', desc: 'Warm transfer to a live person on defined triggers, with full context passed along plus voicemail and callback fallbacks.' },
    { title: 'Transcripts, recordings & evals', desc: 'Every call transcribed and traced, with test suites over real scenarios so you can see and trust how the agent performs.' },
  ],

  process: [
    { title: '1 · Scoping call', desc: 'Free 30 minutes to map the call flows, define the win (booked calls, qualified leads, deflected tickets), and pick the stack.' },
    { title: '2 · Prototype', desc: 'A working voice agent you can actually phone within 1–2 weeks, tuned for latency and natural conversation on your real use case.' },
    { title: '3 · Build & harden', desc: 'Full call flows, integrations, handoff logic, guardrails, and evals against real and adversarial calls.' },
    { title: '4 · Ship & support', desc: 'Go live on your numbers, monitor transcripts and latency, and iterate against real calls; optional retainer for ongoing tuning.' },
  ],

  stack: ['Twilio', 'Retell AI', 'Vapi', 'LiveKit', 'Deepgram', 'ElevenLabs', 'OpenAI Realtime', 'LangGraph'],

  faq: [
    { q: 'What is an AI voice agent?', a: 'An AI voice agent is a real-time conversational system that talks to callers over the phone — it listens with speech-to-text, reasons with an LLM, and replies in a natural voice, while taking actions like booking an appointment or qualifying a lead. Unlike a rigid IVR phone tree, it holds genuine multi-turn conversations, handles interruptions, and hands off to a human when needed. I build these on telephony like Twilio with platforms such as Retell or Vapi, or a custom LiveKit pipeline.' },
    { q: 'How fast can a voice agent respond, and why does latency matter?', a: 'Latency is the single biggest driver of whether a voice agent feels human. On a shipped agent I have hit sub-500ms response latency, which is the threshold where conversation feels natural rather than awkward. I get there by tuning the speech-to-text, LLM, and text-to-speech pipeline, streaming responses, and using fast voice models like Deepgram and ElevenLabs so the caller is not left waiting after they stop talking.' },
    { q: 'Retell vs Vapi vs Bland — which platform do you use?', a: 'It depends on the use case. Retell and Vapi are strong managed platforms that get you to production quickly with good turn-taking, while a custom LiveKit pipeline gives maximum control over latency and behavior for demanding cases. Bland targets high-volume outbound. I choose based on your latency, integration, and cost requirements rather than defaulting to one — I cover the trade-offs in detail in my Retell vs Vapi vs Bland comparison.' },
    { q: 'Can the voice agent book appointments and detect scheduling conflicts?', a: 'Yes. I build appointment and scheduling agents that hold multi-turn conversations, check live availability against your calendar, detect conflicts, and confirm bookings during the call — then log everything to your CRM. The agent handles the back-and-forth of finding a time that works instead of dumping the caller into a static menu.' },
    { q: 'What happens when the agent cannot handle a call?', a: 'I always build a human handoff path. On defined triggers — an explicit request for a person, low confidence, a high-stakes or sensitive request — the agent does a warm transfer to a live person and passes along the full context and transcript. Where no one is available, it falls back to voicemail capture or a scheduled callback, so no caller hits a dead end.' },
    { q: 'Can the voice agent work with my existing phone number and CRM?', a: 'Yes. The agent runs on Twilio and can use your existing numbers or new ones, route into your current phone setup, and integrate with your calendar, CRM, and internal APIs. I handle auth, rate limits, and data-residency constraints, and I work across US/UK/UAE/Singapore time zones.' },
  ],

  related: {
    caseStudies: ['podit-voice-agent'],
    articles: ['ai-voice-agent-cost', 'retell-vs-vapi-vs-bland', 'build-voice-ai-agent'],
  },

  offers: [
    { name: 'Inbound & Outbound Voice Agents', description: 'Real-time phone agents that answer and place calls to qualify, support, and follow up.' },
    { name: 'Appointment & Scheduling Agents', description: 'Voice agents that book and confirm appointments with live availability and conflict detection.' },
  ],
};
