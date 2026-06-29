// SERVICE PAGE schema (template for all /services/* pages).
// Rendered by src/routes/ServicePage.jsx. Keep copy outcome-led, first-person,
// answer-first. related.{caseStudies,articles} are slugs (hub-and-spoke links).
export default {
  slug: 'rag-knowledge-base',
  order: 3,
  nav: 'RAG & Knowledge Bases',
  breadcrumb: 'RAG & Knowledge Bases',
  serviceType: 'RAG & Knowledge Base Development',

  // Answer-first GEO intro (40–60 words: what / who / result), rendered as the lead.
  answerFirst:
    'RAG chatbot development is building an internal knowledge-base AI that answers from your own documents with citations — not the model’s memory. It is for teams whose answers are buried across wikis, PDFs, and support tickets. The result: a company copilot that gives correct, sourced answers without hallucinating, using hybrid search, reranking, and citation verification.',
  pricing: { from: '$2,500', typical: '$5,000–$30,000' },

  seo: {
    title: 'RAG Chatbot & Knowledge Base Development (Cites Your Data)',
    description:
      'I build retrieval-augmented company copilots and document Q&A that answer from your data with citations — not hallucinations. Hybrid search, reranking, and evals on LangChain/LlamaIndex with Qdrant, pgvector, or Pinecone. Book a free scoping call.',
  },

  hero: {
    kicker: 'RAG & KNOWLEDGE BASE DEVELOPMENT',
    headline: 'A company copilot that answers from your data — with citations, not guesses',
    sub: 'I build retrieval-augmented chatbots and document Q&A systems that search your real knowledge — docs, wikis, tickets, contracts, PDFs — and answer with linked sources. Hybrid search, reranking, citation verification, and evals so the answers hold up when your team relies on them.',
    primaryQuery: 'rag chatbot development',
  },

  // Proof bar — shown high in the viewport with the CTA.
  proof: [
    { metric: 'Citations', label: 'every answer links back to the source passage it used' },
    { metric: 'Hybrid', label: 'BM25 keyword + dense vector search, then reranked for precision' },
    { metric: 'Evals', label: 'retrieval + answer accuracy measured on your real questions before launch' },
  ],

  problem: {
    heading: 'Most RAG demos hallucinate the moment they meet real questions',
    body: [
      'Wiring an LLM to a vector database is a weekend demo. Making it trustworthy is the hard part. Naive RAG retrieves the wrong chunks, blends stale and current docs, answers confidently when the answer is not in the corpus, and gives you no way to check whether a claim is actually grounded. Once your team catches it making things up, they stop trusting it — and a copilot nobody trusts is worse than no copilot at all.',
      'I build retrieval the way it has to work in production: hybrid keyword-plus-semantic search so exact terms and concepts both surface, a reranking pass to push the truly relevant passages to the top, citation verification so every claim is tied to a retrieved source, and evals that score retrieval and answer quality on your own questions. The result is a system that answers from your data, cites where it got each answer, and says "I do not know" instead of inventing one.',
    ],
  },

  includes: [
    { title: 'Data ingestion & chunking', desc: 'Parsers for PDFs, docs, wikis, tickets, and databases, with chunking and metadata tuned to your content so retrieval has something good to find.' },
    { title: 'Hybrid search & vector store', desc: 'BM25 keyword + dense embedding search over Qdrant, pgvector, or Pinecone, so exact terms and semantic matches both surface.' },
    { title: 'Reranking', desc: 'A cross-encoder reranker (Cohere/Voyage) reorders candidates so the most relevant passages reach the model, not just the closest vectors.' },
    { title: 'Citation & grounding checks', desc: 'Every answer links to the source passages it used, with verification that flags claims the retrieved context does not support.' },
    { title: 'Evals & quality gates', desc: 'Retrieval and answer-accuracy test suites on your real questions, run on every change so quality is measured, not assumed.' },
    { title: 'Handover & docs', desc: 'Clean repo, a re-indexing pipeline for new content, and a walkthrough so your team can operate, extend, and keep the corpus fresh.' },
  ],

  process: [
    { title: '1 · Scoping call', desc: 'Free 30 minutes to map your content sources, the questions users will ask, and what "correct" looks like.' },
    { title: '2 · Prototype', desc: 'A working Q&A slice over a slice of your real corpus within 1–2 weeks to prove retrieval quality before we scale it.' },
    { title: '3 · Build & harden', desc: 'Full ingestion, hybrid search, reranking, citation checks, and an eval suite that gates accuracy.' },
    { title: '4 · Ship & support', desc: 'Deploy, monitor answer quality against real usage, and keep the index fresh; optional retainer for ongoing work.' },
  ],

  stack: ['LangChain', 'LlamaIndex', 'Qdrant', 'pgvector', 'Pinecone', 'BM25 + dense hybrid', 'Cohere Rerank', 'Voyage', 'OpenAI embeddings', 'Python'],

  faq: [
    { q: 'What is RAG (retrieval-augmented generation)?', a: 'RAG is a technique where, instead of relying on what an LLM memorized in training, you first retrieve relevant passages from your own data — documents, wikis, tickets, contracts — and feed them to the model as context so it answers from those sources. Done well, it lets a chatbot answer questions about your specific knowledge base, cite where each answer came from, and stay current as your content changes, rather than guessing or hallucinating.' },
    { q: 'How do you stop a RAG chatbot from hallucinating?', a: 'Several layers. Hybrid search (keyword + semantic) plus a reranking pass so the right passages are actually retrieved; instructing the model to answer only from the retrieved context and to say it does not know when the answer is not there; citation verification that ties each claim back to a source passage and flags unsupported ones; and eval suites that score answer accuracy on your real questions before launch and on every change after. The goal is a system that grounds every answer in your data and refuses to invent one.' },
    { q: 'Which vector database should I use — Qdrant, pgvector, or Pinecone?', a: 'It depends on your stack and scale. pgvector is great when you already run Postgres and want vectors alongside your relational data with no new infrastructure. Qdrant is a strong open-source dedicated vector DB with excellent hybrid-search and filtering support, self-hostable or managed. Pinecone is a fully managed service that minimizes ops at the cost of vendor lock-in. I pick based on data volume, filtering needs, and whether you prefer self-hosted or managed — and cover the trade-offs in my vector database comparison.' },
    { q: 'Can it answer from our private documents securely?', a: 'Yes. The system retrieves only from the corpus you provide, and I handle access controls, per-user or per-team document permissions, and data-residency constraints so people only get answers from content they are allowed to see. It can run against managed or self-hosted vector stores, keep your documents inside your own infrastructure, and integrate with your existing auth. I work across US/UK/UAE/Singapore time zones.' },
    { q: 'How much does a RAG chatbot or knowledge base cost?', a: 'I bill at a flat $60/hour or $2,500/week. A focused document-Q&A build over a single well-structured corpus (about 2–4 weeks) typically runs $5,000–$10,000; broader company copilots spanning many sources, with permissions, reranking, and rigorous evals (6–12 weeks), run $15,000–$30,000. The biggest cost drivers are the number and messiness of your data sources, accuracy and citation requirements, and access-control complexity — not the model or the vector database. I scope the exact number on a free call.' },
  ],

  related: {
    caseStudies: ['legal-rag-platform'],
    articles: ['rag-that-works', 'vector-db-comparison'],
  },

  offers: [
    { name: 'RAG Chatbot Development', description: 'Document Q&A and company copilots that answer from your data with linked citations.' },
    { name: 'Knowledge Base & Search Engineering', description: 'Hybrid search, reranking, and evals over your docs, wikis, and tickets — built for accuracy.' },
  ],
};
