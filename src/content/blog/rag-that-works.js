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
  slug: 'rag-that-works',
  title: 'Why Most RAG Fails (and How to Build RAG That Actually Works)',
  description:
    'Most RAG systems fail in production because retrieval quality is poor, not because the LLM is weak. A practical guide to the four things that break RAG — chunking, retrieval, reranking, and citation verification — and the fixes that make answers trustworthy.',
  date: '2026-06-14',
  updated: '2026-06-14',
  readingTime: '9 min',
  category: 'Guide',
  primaryQuery: 'why rag fails',

  tldr: [
    'Most RAG failures are retrieval failures: if the right chunk never reaches the model, no prompt or bigger model can save the answer.',
    'The four usual culprits are bad chunking, vector-only retrieval, no reranking, and no citation verification — fix them in that order.',
    'Hybrid retrieval (dense + keyword) plus a reranker reliably beats pure vector search, especially on names, codes, and exact terms.',
    'For anything high-stakes, verify citations against source text before answering — a confident wrong cite is worse than "I do not know".',
  ],

  body: [
    { type: 'p', text: 'The honest diagnosis: **most RAG systems fail at retrieval, not generation.** The model is usually fine. The problem is that the right passage never makes it into the context window, so the LLM is left to guess — and a good model guesses fluently and confidently, which is exactly what makes the failure dangerous. Fix retrieval and the rest of the system gets dramatically easier.' },

    { type: 'h2', text: 'Why does RAG fail in production?' },
    { type: 'p', text: 'RAG looks great in a demo and then disappoints on real questions. The reason is almost never the language model. In practice, four issues account for the vast majority of bad answers I see when I am brought in to fix a RAG system:' },
    {
      type: 'table',
      headers: ['Failure mode', 'What it looks like', 'Root cause'],
      rows: [
        ['Bad chunking', 'Answers cut off mid-fact or mix unrelated topics', 'Chunks split by character count, ignoring document structure'],
        ['Vector-only retrieval', 'Misses exact names, codes, IDs, and rare terms', 'Dense embeddings blur lexical detail; no keyword channel'],
        ['No reranking', 'Right document is retrieved but buried at rank 8', 'Top-k by vector similarity is noisy; nothing re-scores it'],
        ['No citation check', 'Confident answers citing things the source never says', 'Nothing verifies the claim against the retrieved text'],
      ],
    },
    { type: 'callout', title: 'Key takeaway', text: 'Before you blame the model or rewrite the prompt, check whether the correct chunk is even in the retrieved set. If it is not, that is the bug — and it is a retrieval bug.' },

    { type: 'h2', text: 'How does chunking break retrieval?' },
    { type: 'p', text: 'Chunking is the most underrated lever in RAG. The default — split every document into 500-character windows — destroys meaning: a clause gets severed from its heading, a table loses its caption, a definition is split from the term it defines. Then you embed half-thoughts and wonder why retrieval is fuzzy.' },
    { type: 'p', text: 'Better chunking respects the structure of the document. Split on semantic boundaries (sections, headings, list items, table rows), keep each chunk self-contained, and attach metadata — source, section, date — so you can filter and cite later. For long structured corpora, smaller well-bounded chunks with overlap beat large arbitrary ones almost every time.' },

    { type: 'h2', text: 'Is vector search alone enough?' },
    { type: 'p', text: 'No — and this surprises people. Dense vector search is excellent at meaning and terrible at specifics. Ask for "section 80C deductions" and a pure-embedding system may return passages that are semantically about tax relief while missing the one chunk that literally says "80C". Names, statute numbers, SKUs, error codes, and acronyms are exactly where dense retrieval slips.' },
    { type: 'p', text: '**Hybrid retrieval fixes this:** run dense vector search and a keyword search (BM25) in parallel, then fuse the results. You get the semantic recall of embeddings and the lexical precision of keyword matching. On the legal AI platform I built, the retrieval layer pairs Voyage law-2 embeddings in Qdrant with BM25 keyword search precisely so that exact statute and case references are never lost to fuzzy similarity.' },

    { type: 'h2', text: 'What does a reranker actually do?' },
    { type: 'p', text: 'Top-k retrieval gives you candidates, not answers. The right passage is often in your top 20 but sitting at rank 9 — below noise the model will happily latch onto instead. A reranker is a second, slower, more accurate model that re-scores those candidates against the actual question and pushes the genuinely relevant chunks to the top.' },
    { type: 'p', text: 'The payoff is large for the cost: you retrieve broadly (high recall) and then rerank tightly (high precision), so the few chunks you actually pass to the LLM are the right ones. Skipping reranking is the single most common reason a system "retrieves the answer" and still gets it wrong.' },
    { type: 'quote', text: 'Retrieval gives you candidates. Reranking decides which ones the model is allowed to trust.', cite: 'Saswat Mishra' },

    { type: 'h2', text: 'How do you stop RAG from hallucinating citations?' },
    { type: 'p', text: 'Grounding a model in retrieved text reduces hallucination — it does not eliminate it. The model can still paraphrase a source into saying something it never said, or cite a passage that does not support the claim. For low-stakes use that is tolerable. For legal, medical, financial, or compliance work it is a liability.' },
    { type: 'p', text: 'The fix is a verification step after generation: for every citation the model produces, check that the cited source exists in the retrieved set and that its text actually supports the claim — a fuzzy quote-check against the source works well. On the legal platform, a dedicated citation verifier strips hallucinated cites and quote-checks the rest before anything reaches the user, so only authority that exists and actually says what is claimed survives.' },

    { type: 'h2', text: 'A do / don\'t checklist for production RAG' },
    {
      type: 'ul',
      items: [
        '**Do** chunk on document structure (sections, headings, rows) and attach source metadata to every chunk.',
        '**Do** use hybrid retrieval (dense + BM25) so exact names, codes, and terms are never lost.',
        '**Do** add a reranker between retrieval and generation — retrieve broad, rerank tight.',
        '**Do** verify citations against source text for anything high-stakes, and let the system say "I do not know".',
        '**Do** build an eval set of real questions with known-good answers so you can measure retrieval, not vibes.',
        '**Don\'t** split documents by raw character count and hope embeddings sort it out.',
        '**Don\'t** rely on vector similarity alone, or pass the top-k straight to the model without reranking.',
        '**Don\'t** ship answers with unverified citations in any domain where a wrong cite causes real harm.',
      ],
    },

    { type: 'h2', text: 'How do you actually fix a failing RAG system?' },
    {
      type: 'ol',
      items: [
        'Measure first: build an eval set and check whether the correct chunk is in the retrieved set at all.',
        'Fix chunking so each chunk is self-contained and carries metadata.',
        'Add a keyword channel and fuse it with vector search (hybrid retrieval).',
        'Insert a reranker so the best candidates land in the context window.',
        'Add citation verification and a confident "I do not know" path for high-stakes answers.',
      ],
    },
    { type: 'callout', title: 'In short', text: 'Good RAG is mostly good retrieval engineering. Chunk well, retrieve hybrid, rerank, and verify — in that order — and the same LLM that produced garbage will produce answers you can stand behind.' },
  ],

  faq: [
    { q: 'Why does my RAG system give wrong or vague answers?', a: 'Almost always because retrieval failed, not the model. If the chunk containing the answer is not in the retrieved set, the LLM has nothing to work from and will guess fluently. The common causes are poor chunking (documents split by character count), vector-only retrieval that misses exact terms, and no reranking to surface the best candidate. Fix retrieval before changing the prompt or the model.' },
    { q: 'Is hybrid search better than pure vector search for RAG?', a: 'Yes, for most real corpora. Pure vector (dense) search is strong on meaning but weak on specifics like names, statute numbers, SKUs, and error codes. Hybrid retrieval runs dense vector search and keyword search (BM25) in parallel and fuses the results, giving you semantic recall and lexical precision together. Adding a reranker on top of hybrid retrieval typically gives the largest quality jump for the effort.' },
    { q: 'How do you prevent RAG from hallucinating citations?', a: 'Add a verification step after generation. For every citation the model produces, confirm the source exists in the retrieved set and that its text actually supports the claim, using a fuzzy quote-check against the source. Strip any citation that fails, and let the system answer "I do not know" rather than fabricate authority. Grounding reduces hallucination but does not remove it, so for legal, medical, or financial work explicit citation verification is essential.' },
  ],

  related: {
    service: 'rag-knowledge-base',
    articles: ['vector-db-comparison'],
    caseStudies: ['legal-rag-platform'],
  },
};
