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
  slug: 'build-voice-ai-agent',
  title: 'How to Build a Voice AI Agent: An Architecture Walkthrough (2026)',
  description:
    'An engineer’s end-to-end guide to a real-time voice AI agent: telephony, STT, turn-taking, the LLM, TTS, barge-in, human handoff, and the latency budget.',
  date: '2026-05-24',
  updated: '2026-05-24',
  readingTime: '10 min',
  category: 'How-to',
  primaryQuery: 'how to build a voice ai agent',

  tldr: [
    'A voice AI agent is a pipeline: telephony → speech-to-text → turn detection (VAD) → LLM → text-to-speech → back to the caller, all streaming in real time.',
    'The whole loop has to land under ~800ms (ideally sub-500ms) or the conversation feels broken — so every stage is engineered against a latency budget, not bolted together.',
    'Barge-in (letting callers interrupt) and a warm human handoff path are what separate a production voice agent from a demo.',
    'You can ship fast on a managed platform like Retell or Vapi, or go custom on LiveKit for maximum control over latency and behavior.',
  ],

  body: [
    { type: 'p', text: 'To build a voice AI agent you assemble a **real-time streaming pipeline**: phone audio comes in over telephony, speech-to-text transcribes it as the caller speaks, a turn detector decides when they’ve finished, an LLM reasons and (often) calls tools, text-to-speech speaks the reply, and the whole loop repeats — fast enough that the caller never feels the seams. Below is how I architect each stage, and the latency budget that holds it all together.' },

    { type: 'h2', text: 'What are the parts of a voice AI agent?' },
    { type: 'p', text: 'A production voice agent is not one model — it is a chain of components, each of which can make or break the call. Conceptually the loop is: **caller audio → telephony → STT → VAD/turn-taking → LLM (+ tools) → TTS → caller audio**, with barge-in and handoff running alongside it. Here is what each stage does and the kind of tooling I reach for:' },
    {
      type: 'table',
      headers: ['Stage', 'What it does', 'Typical tools'],
      rows: [
        ['Telephony', 'Connects the agent to the phone network for inbound/outbound calls and media streaming', 'Twilio, SIP / phone numbers'],
        ['Speech-to-text (STT)', 'Streams the caller’s audio into live text', 'Deepgram, Whisper, OpenAI Realtime'],
        ['Turn-taking / VAD', 'Detects when the caller has finished a turn so the agent replies at the right moment', 'Voice activity detection, end-of-turn models'],
        ['LLM', 'Understands intent, holds conversation state, calls tools (calendar, CRM)', 'OpenAI, Claude, via LangGraph'],
        ['Text-to-speech (TTS)', 'Turns the reply into natural, streamed speech', 'ElevenLabs, OpenAI Realtime, Cartesia'],
        ['Orchestration platform', 'Wires the pipeline together and manages the call lifecycle', 'Retell AI, Vapi, custom LiveKit'],
      ],
    },
    { type: 'callout', title: 'Key takeaway', text: 'The model is the easy part. The hard engineering is the plumbing between stages — streaming, turn detection, and interruption handling — because that is what decides whether a call feels human or robotic.' },

    { type: 'h2', text: 'How does the telephony layer work?' },
    { type: 'p', text: 'Telephony is how your agent actually gets on a phone call. In practice that means a provider like Twilio handles the phone number, the carrier connection, and a bidirectional media stream of raw audio. Your agent subscribes to that stream, pushes audio to STT, and pushes synthesized speech back. The same layer handles **inbound** (the agent answers your line) and **outbound** (the agent places calls), call routing into your existing phone setup, and — critically — the warm transfer when a human needs to take over. Get this layer wrong and you fight audio glitches and dropped calls for weeks, so I treat it as real infrastructure, not an afterthought.' },

    { type: 'h2', text: 'Why is turn-taking (VAD) the hardest part?' },
    { type: 'p', text: 'Turn-taking is deciding *when the caller has finished talking* so the agent knows it is its turn to speak. It sounds trivial; it is the single most common reason voice bots feel broken. End the turn too early and the agent cuts the caller off mid-sentence; end it too late and there is an awkward dead pause after every reply. Voice activity detection (VAD) plus an end-of-turn model listens for pauses, intonation, and silence thresholds to make that call in real time. This is also where **barge-in** lives — the ability for a caller to interrupt the agent mid-sentence and have it stop talking and listen, exactly like a person would. Without barge-in, the agent talks over people and the call collapses.' },

    { type: 'h2', text: 'How do the LLM and TTS turn intent into a spoken reply?' },
    { type: 'p', text: 'Once a turn is closed, the transcript goes to the LLM. I do not drive these agents with one giant prompt and hope — I use an explicit conversation state machine (a LangGraph state graph) that sequences understanding, tool calls, and confirmation, so the agent follows your process instead of improvising. The LLM calls typed tools to check live calendar availability, qualify a lead against your rules, or write to your CRM. Its reply then streams into text-to-speech, which begins speaking the first words before the full sentence is even generated — streaming end to end is how you shave hundreds of milliseconds off perceived latency.' },
    { type: 'quote', text: 'Callers forgive a lot, but they do not forgive lag and they do not forgive being talked over. Fix those two and the agent already sounds human.', cite: 'Saswat Mishra' },

    { type: 'h2', text: 'What is the latency budget for a natural-feeling call?' },
    { type: 'p', text: 'The threshold where a phone conversation feels live rather than awkward is roughly **800ms** of round-trip latency, and sub-500ms feels genuinely natural — that is the bar I hit on shipped agents like Podit. The only way to get there is to assign every stage a budget and engineer to it. Here is a realistic budget for a sub-700ms loop:' },
    {
      type: 'table',
      headers: ['Stage', 'Latency budget', 'How you protect it'],
      rows: [
        ['STT (final transcript)', '~100–200ms', 'Streaming STT, partial results, fast model'],
        ['Turn / end-of-turn detection', '~50–150ms', 'Tuned VAD thresholds, end-of-turn model'],
        ['LLM first token', '~200–400ms', 'Smaller/faster model, short prompts, streaming'],
        ['TTS first audio', '~100–200ms', 'Streaming TTS, start speaking on first chunk'],
        ['Network / telephony overhead', '~50–100ms', 'Co-located services, persistent connections'],
        ['Total round-trip target', '~500–700ms', 'Stream every stage; never wait for completion'],
      ],
    },
    { type: 'callout', title: 'The rule that matters', text: 'Never wait for a stage to finish before starting the next. Stream STT into the LLM, stream the LLM into TTS, and start speaking on the first audio chunk. Streaming is the difference between a 600ms loop and a 2-second one.' },

    { type: 'h2', text: 'How do you handle barge-in and human handoff?' },
    { type: 'p', text: 'These two are what move an agent from demo to production. **Barge-in:** when the caller starts speaking while the agent is talking, the system must instantly stop TTS playback, flush the queued audio, and switch back to listening — otherwise it steamrolls the caller. **Human handoff:** on defined triggers — an explicit request for a person, low model confidence, or a high-stakes or sensitive request — the agent does a warm transfer to a live human and passes the full transcript and context along. Where no one is available, it falls back to voicemail or a scheduled callback so no caller ever hits a dead end. I build both of these into every voice agent; they are not optional.' },

    { type: 'h2', text: 'How do you actually build one, step by step?' },
    {
      type: 'ol',
      items: [
        'Map the call flows and define the win — booked calls, qualified leads, deflected tickets — before writing any code.',
        'Stand up the telephony layer (Twilio number + media stream) and prove you can route audio in and out.',
        'Wire streaming STT and tune VAD/end-of-turn detection on recordings of real calls, not synthetic ones.',
        'Build the LLM as an explicit state graph with typed tools into your calendar, CRM, and APIs — not a single prompt.',
        'Add streaming TTS and barge-in, then tune the whole loop against the latency budget until it feels live.',
        'Wire the human handoff and fallback paths, then harden with transcripts, tracing, and evals over real and adversarial calls.',
      ],
    },
    { type: 'p', text: 'You do not have to build every layer from scratch. Managed platforms like **Retell** and **Vapi** get you to production quickly with solid turn-taking, while a custom **LiveKit** pipeline gives maximum control over latency and behavior for demanding cases. I choose based on your latency, integration, and cost requirements rather than defaulting to one — and I break down the trade-offs in my Retell vs Vapi vs Bland comparison.' },
  ],

  faq: [
    { q: 'How do you build a voice AI agent?', a: 'You build a real-time streaming pipeline: telephony (e.g. Twilio) carries the call audio, speech-to-text transcribes the caller live, a turn-detection/VAD stage decides when they have finished, an LLM reasons and calls tools, and text-to-speech speaks the reply — all streaming so the round-trip stays under ~800ms. You then add barge-in for interruptions and a warm human-handoff path before shipping. You can assemble this on a managed platform like Retell or Vapi, or build a custom pipeline on LiveKit for full control over latency.' },
    { q: 'What is the biggest technical challenge in a voice agent?', a: 'Latency and turn-taking. The conversation only feels human if the full loop responds in roughly 800ms or less (sub-500ms feels natural), which forces you to stream every stage instead of waiting for each to finish. Closely tied to that is turn detection — knowing exactly when the caller has stopped talking so the agent neither cuts them off nor leaves an awkward pause. Get latency and turn-taking right and the agent already sounds human; get them wrong and no amount of clever prompting saves the call.' },
    { q: 'What tech stack is used to build voice AI agents?', a: 'A typical stack is Twilio for telephony, Deepgram or OpenAI Realtime for streaming speech-to-text, voice activity detection plus an end-of-turn model for turn-taking, an LLM like OpenAI or Claude orchestrated with LangGraph, and ElevenLabs or OpenAI Realtime for text-to-speech. The pipeline is wired together by a managed platform such as Retell or Vapi, or a custom LiveKit setup. The exact choice depends on your latency, integration, and cost requirements.' },
  ],

  related: {
    service: 'voice-ai-agents',
    articles: ['retell-vs-vapi-vs-bland', 'ai-voice-agent-cost'],
    caseStudies: ['podit-voice-agent'],
  },
};
