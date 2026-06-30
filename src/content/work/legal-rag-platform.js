// CASE STUDY schema (template for all /work/* pages).
// Rendered by src/routes/CaseStudy.jsx. `service` links up to the hub;
// related.articles link across. Lead with the metric.
export default {
  slug: 'legal-rag-platform',
  order: 4,
  title: 'Indian Legal AI Platform — Hybrid RAG + LangGraph',
  subtitle: 'End-to-end AI legal research and drafting, grounded in statutes and Supreme Court case law',
  service: 'rag-knowledge-base',
  serviceName: 'RAG & Knowledge Bases',

  seo: {
    title: 'Case Study: Indian Legal AI Platform (Hybrid RAG + LangGraph)',
    description:
      'An AI legal research and drafting platform for India: Hybrid RAG over 41 statutes and 50 Supreme Court cases, a LangGraph pipeline, and a citation verifier.',
  },

  client: 'Legal-tech product',
  role: 'AI engineer — RAG architecture, agent pipeline, build',
  timeframe: '2025',
  status: 'LIVE',

  summary:
    'An end-to-end AI legal research and drafting platform for Indian law. A Hybrid RAG retrieval layer (Voyage law-2 embeddings + Qdrant + BM25 + an LLM reranker) runs over 362 curated chunks spanning 41 statutes, 50 Supreme Court cases, and a 30-edge citator graph. A LangGraph agent pipeline classifies, clarifies, retrieves, synthesizes, and verifies every answer, with a citation verifier that strips hallucinated cites before they ever reach the user. The same grounding powers drafting: 21 contract types and 5 legal notices with PDF generation and a clause-level, RAG-grounded audit and edit-improve loop.',

  problem: [
    'Generic LLMs are dangerous for legal work in India: they confidently invent case citations, paraphrase statutes that do not say what they claim, and have no idea whether a precedent has been overruled. A wrong cite in a brief or contract is not a cosmetic bug — it is a liability.',
    'The goal was a system that researches and drafts against real Indian statutes and Supreme Court case law, refuses to fabricate authority, and produces work product a lawyer can actually file — research memos, contracts, and notices — without manually re-checking every reference.',
  ],

  approach: [
    { title: 'Hybrid RAG retrieval', desc: 'Voyage law-2 embeddings in Qdrant combined with BM25 keyword search and an LLM reranker, retrieving over 362 curated chunks across 41 statutes and 50 Supreme Court cases.' },
    { title: 'LangGraph agent pipeline', desc: 'Every query flows through classify, clarify, retrieve, synthesize, and verify nodes, so ambiguous questions get clarified and answers are assembled and checked, not guessed.' },
    { title: 'Citation verifier', desc: 'A dedicated verification step strips hallucinated citations and runs a fuzzy quote-check against source text, so only authority that actually exists and actually says what is claimed survives.' },
    { title: 'Citator graph', desc: 'A 30-edge citator graph links cases to the precedents they rely on or distinguish, giving the retrieval layer awareness of how authorities relate.' },
    { title: 'Grounded drafting', desc: '21 contract types and 5 legal notices generated with PDF output, each backed by a clause-level, RAG-grounded audit and an edit-improve loop.' },
  ],

  results: [
    { metric: '41 + 50', label: 'statutes and Supreme Court cases indexed' },
    { metric: '362', label: 'curated chunks behind Hybrid RAG' },
    { metric: '30-edge', label: 'citator graph linking precedents' },
    { metric: '21', label: 'contract types with grounded drafting' },
  ],

  // Business impact narrative for the Result section.
  resultNarrative:
    'The platform researches and drafts against 41 statutes and 50 Supreme Court cases with a citation verifier that strips hallucinated authority before it reaches the user — turning a tool lawyers could not trust into one that produces filable research memos, contracts, and notices without re-checking every reference.',

  stack: ['Hybrid RAG', 'Voyage law-2', 'Qdrant', 'BM25 + Reranker', 'LangGraph', 'GPT-4o', 'Next.js', 'Supabase'],

  testimonial: null,
  video: '/videos/portfolio/Legal RAG Platform.mp4',

  related: {
    articles: ['rag-that-works', 'vector-db-comparison'],
  },
};
