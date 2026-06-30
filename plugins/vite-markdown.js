import { marked } from 'marked';

// Build-time .md → data module. Runs only in the Vite/Node build, so `marked`
// never ships to the client. Each article compiles to the same shape the JS blog
// posts use, plus bodyHtml + toc, so BlogPost renders both uniformly.
//
// Parses: frontmatter, the TL;DR blockquote, the main body (→ HTML with heading
// ids), the "Frequently asked questions" section (→ [{q,a}] for accordion +
// FAQPage JSON-LD), the `<!-- Internal links -->` hub-and-spoke comment, and a
// reading-time estimate.

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!mm) continue;
    let val = mm[2].trim();
    if (val.startsWith('[')) {
      try { val = JSON.parse(val); } catch { val = []; }
    } else {
      val = val.replace(/^["']|["']$/g, '');
    }
    data[mm[1]] = val;
  }
  return { data, body: m[2] };
}

const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const slugify = (s) =>
  stripTags(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const cleanInline = (t) =>
  t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\s+/g, ' ').trim();

const CATEGORY = {
  'ai-agent-cost': 'Cost Guide',
  'ai-voice-agent-cost': 'Cost Guide',
  'retell-vs-vapi-vs-bland': 'Comparison',
  'build-ai-agent-langgraph': 'Architecture Guide',
  'rag-that-works': 'Engineering Guide',
};

export function compileMarkdown(raw) {
  const { data, body } = parseFrontmatter(raw);

  // 1) TL;DR blockquote (first "> **TL;DR** …" block)
  let tldrHtml = '';
  const tldrMatch = body.match(/^>\s*\*\*TL;DR\*\*[\s\S]*?(?=\n\n)/m);
  let rest = body;
  if (tldrMatch) {
    const tldrText = tldrMatch[0].replace(/^>\s?/gm, '').replace(/\*\*TL;DR\*\*\s*[—–-]?\s*/, '').replace(/\s+/g, ' ').trim();
    tldrHtml = marked.parseInline(tldrText);
    rest = rest.replace(tldrMatch[0], '');
  }

  // 2) Split off the FAQ section
  const faqSplit = rest.split(/\n##\s+Frequently asked questions\s*\n/i);
  let bodyMd = faqSplit[0];
  const faqBlock = (faqSplit[1] || '').split(/\n---\s*\n/)[0]; // stop before closing rule/byline

  // 3) Strip the closing rule + byline + HTML comment from the main body
  bodyMd = bodyMd.replace(/\n---\s*\n[\s\S]*$/, '').replace(/<!--[\s\S]*?-->/g, '').trim();

  // 4) FAQ → [{q,a}]
  const faq = [];
  if (faqBlock.trim()) {
    for (const chunk of faqBlock.trim().split(/\n\n+/)) {
      const m = chunk.match(/^\*\*(.+?)\*\*\s*\n([\s\S]+)$/);
      if (m) faq.push({ q: cleanInline(m[1]), a: cleanInline(m[2]) });
    }
  }

  // 5) Related (hub-and-spoke) from the Internal links comment
  const related = { services: [], articles: [], caseStudies: [] };
  const relMatch = body.match(/<!--\s*Internal links:\s*([^>]*?)-->/i);
  if (relMatch) {
    for (const p of relMatch[1].split(/[·,]/).map((x) => x.trim()).filter(Boolean)) {
      const path = p.replace(/[).]+$/, '');
      if (path.startsWith('/services/')) related.services.push(path.replace('/services/', ''));
      else if (path.startsWith('/work/')) related.caseStudies.push(path.replace('/work/', ''));
      else if (path.startsWith('/blog/')) related.articles.push(path.replace('/blog/', ''));
    }
  }

  // 6) Body → HTML, add ids to h2/h3, collect TOC (h2 only)
  let html = marked.parse(bodyMd, { gfm: true, breaks: false });
  const toc = [];
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl, inner) => {
    const id = slugify(inner);
    if (lvl === '2') toc.push({ id, text: stripTags(inner).trim() });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  if (faq.length) toc.push({ id: 'faq', text: 'Frequently asked questions' });

  const words = (bodyMd + ' ' + faq.map((f) => f.q + ' ' + f.a).join(' ')).split(/\s+/).filter(Boolean).length;
  const readingTime = `${Math.max(1, Math.round(words / 220))} min`;

  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    date: data.datePublished,
    updated: data.dateModified,
    author: data.author || 'Saswat Mishra',
    authorTitle: data.authorTitle || '',
    keywords: data.keywords || [],
    canonical: data.canonical || '',
    ogImage: data.ogImage || '',
    category: data.category || CATEGORY[data.slug] || 'Guide',
    readingTime,
    tldrHtml,
    bodyHtml: html,
    toc,
    faq,
    related,
    markdown: true,
  };
}

export default function markdownPlugin() {
  return {
    name: 'md-to-data',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      const data = compileMarkdown(code);
      return { code: `export default ${JSON.stringify(data)};`, map: null };
    },
  };
}
