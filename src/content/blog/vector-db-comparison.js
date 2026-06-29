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
  slug: 'vector-db-comparison',
  title: 'Pinecone vs Qdrant vs pgvector: Which Vector DB for RAG? (2026)',
  description:
    'A practical 2026 comparison of Pinecone, Qdrant, and pgvector for RAG — hosting model, scale, hybrid search, cost, and which one to pick for your stack, from shipped production work.',
  date: '2026-06-05',
  updated: '2026-06-05',
  readingTime: '9 min',
  category: 'Comparison',
  primaryQuery: 'pinecone vs qdrant vs pgvector',

  tldr: [
    'Pick pgvector when you already run Postgres and want vectors next to your relational data with zero new infrastructure.',
    'Pick Qdrant when you want a dedicated, open-source vector DB with first-class hybrid search and metadata filtering — self-hosted or managed.',
    'Pick Pinecone when you want a fully managed service and are happy to trade some lock-in for near-zero ops.',
    'For most RAG builds the vector DB is not the thing that decides quality — chunking, hybrid search, and reranking are. Choose the store that fits your stack, then spend your effort on retrieval.',
  ],

  body: [
    { type: 'p', text: 'Short version: **there is no universally best vector database — there is the one that fits your stack and scale**. pgvector, Qdrant, and Pinecone all retrieve nearest neighbours well; they differ in where they run, how far they scale, how good their hybrid search and filtering are, and what they cost to operate. I have shipped RAG systems on all three, and the choice usually comes down to whether you already run Postgres, whether you want to self-host, and how much ops time you have.' },

    { type: 'h2', text: 'Pinecone vs Qdrant vs pgvector: the comparison at a glance' },
    { type: 'p', text: 'Here is how the three line up on the factors that actually decide the choice for a production RAG system:' },
    {
      type: 'table',
      headers: ['', 'pgvector', 'Qdrant', 'Pinecone'],
      rows: [
        ['Hosting', 'Postgres extension (self-host or any managed PG: Supabase, RDS, Neon)', 'Open-source; self-host (Docker/K8s) or Qdrant Cloud', 'Fully managed SaaS only'],
        ['Scale', 'Comfortable to a few million vectors; needs tuning beyond that', 'Tens of millions+ with sharding, quantization, on-disk storage', 'Designed for very large, high-throughput indexes'],
        ['Hybrid search', 'Dense + Postgres full-text/BM25-style; you wire the fusion yourself', 'Native dense + sparse with built-in fusion and strong payload filtering', 'Native sparse-dense hybrid and metadata filtering, managed for you'],
        ['Cost', 'Effectively free if you already run PG; you pay for the DB', 'Free self-hosted (infra cost only); usage-based on Qdrant Cloud', 'Usage-based managed pricing; predictable but a recurring line item'],
        ['Best for', 'Teams already on Postgres wanting one fewer system to run', 'Teams wanting an open, portable, hybrid-search-first dedicated DB', 'Teams that want zero ops and will trade lock-in for it'],
      ],
    },
    { type: 'callout', title: 'Key takeaway', text: 'If you already run Postgres, start with pgvector — one fewer system to operate beats marginal recall gains until you actually hit a scale or hybrid-search wall. Reach for Qdrant or Pinecone when you do.' },

    { type: 'h2', text: 'When should you use pgvector?' },
    { type: 'p', text: 'pgvector is the right default when **Postgres is already in your stack**. It stores embeddings as a column type and adds vector indexes (HNSW or IVFFlat) and distance operators, so similarity search lives right next to the rows it relates to. That means you can filter on real columns, join against your application tables, and keep one backup, one connection pool, and one thing to monitor.' },
    { type: 'p', text: 'The trade-offs are real but bounded. Pure-vector throughput is lower than a dedicated engine, hybrid search means combining the vector index with Postgres full-text yourself, and very large indexes need index tuning and memory headroom. For corpora up to a few million vectors with sensible filtering, that is rarely the bottleneck — retrieval quality lives in chunking and reranking, not in the last few points of raw recall.' },
    { type: 'ul', items: [
      'Already run Postgres (Supabase, RDS, Neon, self-hosted) and want vectors beside your data.',
      'Corpus in the thousands-to-low-millions of vectors range.',
      'You value operational simplicity and metadata-rich filtering over peak vector throughput.',
    ] },

    { type: 'h2', text: 'When should you use Qdrant?' },
    { type: 'p', text: 'Qdrant is my pick when I want a **dedicated, open-source vector DB that does hybrid search and filtering well out of the box**. It supports dense and sparse vectors with built-in fusion, has a genuinely strong payload-filtering engine, and scales to tens of millions of vectors with quantization and on-disk storage. Because it is open source, you can run it in Docker locally, self-host on your own cluster, or use Qdrant Cloud — and move between them without rewriting your retrieval layer.' },
    { type: 'p', text: 'On the Indian legal AI platform I built, Qdrant is the vector store behind a Hybrid RAG layer (Voyage law-2 embeddings + BM25 + an LLM reranker) over curated statute and case-law chunks. The payload filtering and hybrid support made it straightforward to combine semantic recall with exact-term matching — which matters when a wrong or missing authority is a liability, not a cosmetic bug.' },
    { type: 'ul', items: [
      'You want native hybrid (dense + sparse) search and rich metadata filtering without bolting it together yourself.',
      'You want portability — self-host or managed, no SaaS lock-in.',
      'You expect to grow into tens of millions of vectors and want quantization and on-disk options ready.',
    ] },

    { type: 'h2', text: 'When should you use Pinecone?' },
    { type: 'p', text: 'Pinecone is the right call when you want a **fully managed service and the least possible ops**. There is no cluster to run, scaling and replication are handled for you, and it offers native sparse-dense hybrid search and metadata filtering. For teams without infrastructure people — or who simply do not want to spend their time on vector-DB operations — that convenience is the whole value proposition.' },
    { type: 'p', text: 'The costs are vendor lock-in and a recurring usage-based bill. You cannot self-host, and migrating off later is real work. If your data has residency or sovereignty constraints, or you need the store inside your own VPC, a managed-only SaaS may simply be off the table. When those are non-issues and ops time is scarce, Pinecone is a clean, fast way to ship.' },
    { type: 'quote', text: 'The best vector database is usually the one you do not have to think about — until your scale, hybrid-search, or data-residency needs make you think about it.', cite: 'Saswat Mishra' },

    { type: 'h2', text: 'Does the vector DB actually decide RAG quality?' },
    { type: 'p', text: 'Mostly no — and this is the part teams get wrong. All three engines retrieve nearest neighbours well. What separates a RAG system that holds up from one that hallucinates is everything around the store: **how you chunk and add metadata, whether you run hybrid (keyword + semantic) search, whether you rerank candidates before they reach the model, and whether you verify citations and run evals**. Swapping Pinecone for Qdrant will not fix bad chunking. Adding a reranker often will.' },
    { type: 'p', text: 'So pick the store that fits your stack and ops appetite, then put your real effort into retrieval quality. That ordering ships better systems than agonising over benchmark recall deltas you will never feel in production.' },

    { type: 'h2', text: 'How do you choose in practice?' },
    {
      type: 'ol',
      items: [
        'Already on Postgres and under a few million vectors? Start with pgvector — fewer moving parts wins.',
        'Want open-source, portable, hybrid-search-first, and headroom to grow? Use Qdrant.',
        'Want zero ops and can accept managed-only lock-in? Use Pinecone.',
        'Whatever you pick, invest the saved time in hybrid search, reranking, citation checks, and evals — that is where RAG quality actually comes from.',
      ],
    },
  ],

  faq: [
    { q: 'Pinecone vs Qdrant vs pgvector — which should I use for RAG?', a: 'Use pgvector if you already run Postgres and your corpus is in the thousands-to-low-millions of vectors; it keeps vectors beside your relational data with no new infrastructure. Use Qdrant if you want an open-source, portable, dedicated vector DB with strong native hybrid search and metadata filtering, self-hosted or managed. Use Pinecone if you want a fully managed service with near-zero ops and can accept vendor lock-in and a recurring usage-based bill. For most builds the store is not what decides quality — chunking, hybrid search, and reranking are.' },
    { q: 'Is pgvector good enough for production RAG?', a: 'Yes, for a large share of real workloads. pgvector handles similarity search well up to a few million vectors with HNSW indexing, and keeps embeddings alongside your application data so you can filter and join naturally and operate one system instead of two. Its limits show at very high vector counts and throughput, and hybrid search requires combining it with Postgres full-text yourself rather than getting it built in. If you already run Postgres, it is usually the right place to start, and you can graduate to Qdrant or Pinecone when you actually hit a scale or hybrid-search wall.' },
    { q: 'Do I need a dedicated vector database, or can I use Postgres?', a: 'You often do not need a dedicated vector database. If you run Postgres, pgvector lets you add vector search without a new system, which means fewer things to deploy, secure, back up, and monitor. A dedicated database like Qdrant or Pinecone earns its place when you need tens of millions of vectors, very high query throughput, native sparse-dense hybrid search out of the box, or fully managed scaling. Choose based on data volume, hybrid-search and filtering needs, and whether you prefer self-hosted or managed — not on benchmark recall numbers you will not feel in production.' },
  ],

  related: {
    service: 'rag-knowledge-base',
    articles: ['rag-that-works'],
    caseStudies: ['legal-rag-platform'],
  },
};
