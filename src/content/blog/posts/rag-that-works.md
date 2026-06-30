---
title: "RAG That Actually Works: Why Most AI Knowledge Bases Fail (and 8 Fixes)"
slug: "rag-that-works"
description: "Most RAG chatbots fail on retrieval, not the LLM. The 8 fixes — hybrid search, reranking, query rewriting, citation verification, and evals — that work."
datePublished: "2026-06-29"
dateModified: "2026-06-29"
author: "Saswat Mishra"
authorTitle: "RAG & Applied AI Engineer"
schema: ["Article", "FAQPage"]
primaryKeyword: "why rag fails"
keywords: ["rag best practices", "why rag chatbots fail", "production rag", "rag knowledge base", "hybrid search reranking rag"]
canonical: "https://saswatbuilds.com/blog/rag-that-works"
ogImage: "/og/rag-that-works.png"
---

> **TL;DR** — Most RAG (retrieval-augmented generation) knowledge bases fail at the **retrieval** step, not the LLM. If the right chunk never reaches the model, no prompt can save the answer. The fixes that move a RAG system from demo to production are mostly retrieval and evaluation engineering: better chunking, **hybrid search + reranking**, query rewriting, metadata filtering, citation verification, and a real eval harness. Data preparation alone is typically **30–50%** of a serious RAG build.

## Why do most RAG chatbots fail?

Because teams obsess over the model and neglect retrieval. A RAG answer is only as good as the chunks retrieved for it — **garbage retrieval in, confident hallucination out**. The most common failure pattern is a naive pipeline (split documents into fixed chunks → embed → cosine-similarity top-k → stuff into the prompt) that demos beautifully on three documents and collapses on a real corpus of thousands. Here are the eight fixes that actually matter.

## The 8 fixes that separate production RAG from a demo

### 1. Fix chunking first
Fixed-size character chunks cut sentences and tables in half and destroy meaning. Use **structure-aware chunking** (by heading/section), keep tables and lists intact, and add a little overlap. Bad chunks are the #1 root cause of bad answers.

### 2. Go hybrid: keyword (BM25) + vector
Pure vector search misses exact terms — names, codes, statute numbers, SKUs. **Hybrid search** (BM25 lexical + dense embeddings) catches both "what it means" and "the exact string," and consistently outperforms either alone on real corpora.

### 3. Add a reranker
Retrieve broadly (e.g., top 20–50), then **rerank** with a cross-encoder and keep the best 3–8. Reranking is one of the highest-ROI additions to a RAG pipeline — it pushes the genuinely relevant chunk into the context the model actually reads.

### 4. Rewrite the query
Users ask messy, underspecified questions. **Query rewriting / expansion** (and, for follow-ups, rewriting against conversation history) dramatically improves recall. For complex questions, decompose into sub-queries and retrieve for each.

### 5. Use metadata + access control
Tag chunks with source, date, document type, and permissions. **Filter before you search** (e.g., "only this client's docs," "only current policy versions") for relevance, freshness, and — critically for internal copilots — to stop users seeing data they shouldn't.

### 6. Verify citations, kill hallucinated ones
Require the model to ground every claim in retrieved chunks, then **programmatically verify** that cited passages exist and actually support the statement (fuzzy-match the quote). Strip or flag anything that fails. This is the difference between a tool people trust and one they quietly stop using.

### 7. Build an eval harness (or you're flying blind)
You cannot improve what you don't measure. Maintain a labeled question→expected-answer set and track **retrieval metrics** (recall@k, precision) and **answer metrics** (faithfulness, correctness) on every change. Most failed RAG projects never had evals — they "felt" fine until users hit the edges.

### 8. Handle "I don't know"
A production knowledge base must **decline gracefully** when the corpus lacks the answer, rather than inventing one. Calibrated refusal + a path to a human is a feature, not a failure.

## What this costs and how long it takes

| Build | Typical price | Timeline |
|---|---|---|
| Single-source doc Q&A | $12,000–$30,000 | 4–8 weeks |
| Multi-source production copilot (hybrid + rerank + access control) | $30,000–$60,000 | 8–14 weeks |
| Enterprise/agentic, multi-tenant | $70,000–$200,000+ | 3–6 months |

Remember: **data preparation is 30–50%** of the effort. A quote that ignores data prep is quoting a demo.

## Frequently asked questions

**Is RAG dead now that context windows are huge?**
No. Long context helps but doesn't replace retrieval at scale — you can't (and shouldn't) stuff an entire corpus into every prompt; it's slow, expensive, and accuracy degrades. RAG + long context together is the practical pattern.

**Which vector database should I use?**
Pinecone, Qdrant, and pgvector all work; the choice depends on scale, filtering needs, and whether you already run Postgres. The database is rarely the bottleneck — retrieval *quality* is. (Comparison piece coming.)

**Why does my RAG bot hallucinate even with retrieval?**
Almost always because the right chunk wasn't retrieved (fixes 1–4) or because there's no citation verification (fix 6). Add hybrid search + a reranker + citation checks before blaming the model.

**How do I keep it accurate over time?**
Re-index when documents change, keep evals running on every change, and monitor real queries for gaps. RAG is a system to maintain, not a one-time build.

---

*Written by Saswat Mishra — I build production RAG systems (hybrid retrieval, reranking, citation verification) including a legal-research platform over dozens of statutes and case law. Need a knowledge base your team can actually trust? [Book a free 30-minute scoping call](/contact).*

<!-- Internal links: /services/rag-knowledge-base · /blog/vector-db-comparison · /work/legal-rag-platform -->
