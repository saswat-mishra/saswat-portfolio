import { useParams, Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { articleJsonLd, faqJsonLd, breadcrumbJsonLd } from '../seo/jsonld.js';
import { getPost, serviceLink, postLink, workLink } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import { Section } from '../components/ui/Section.jsx';
import RichBody from '../components/ui/RichBody.jsx';
import TableOfContents from '../components/ui/TableOfContents.jsx';
import Faq from '../components/ui/Faq.jsx';
import RelatedLinks from '../components/ui/RelatedLinks.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import NotFound from './NotFound.jsx';
import { slugify } from '../lib/slug.js';
import { C, WRAP } from '../theme.js';

const ARTICLE_WRAP = { maxWidth: 760, margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)' };

// JS data-posts carry typed body blocks; derive a TOC from their h2s so they get
// the same on-this-page nav as markdown posts (which arrive with toc pre-built).
function deriveToc(post) {
  if (post.toc) return post.toc;
  const toc = (post.body || [])
    .filter((b) => b.type === 'h2')
    .map((b) => ({ id: slugify(b.text), text: b.text }));
  if (post.faq?.length) toc.push({ id: 'faq', text: 'Frequently asked questions' });
  return toc;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  if (!post) return <NotFound />;

  const path = `/blog/${post.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path },
  ];

  // Related: markdown posts use related.services[]; legacy JS posts use a single
  // related.service. Normalize both into the hub-and-spoke link grid.
  const rel = post.related || {};
  const related = [
    ...(rel.service ? [serviceLink(rel.service)] : []),
    ...(rel.services || []).map(serviceLink),
    ...(rel.caseStudies || []).map(workLink),
    ...(rel.articles || []).map(postLink),
  ].filter(Boolean);

  const toc = deriveToc(post);
  const author = post.author || 'Saswat Mishra';
  // Every post (markdown + legacy JS) gets a generated /og/<slug>.png — the OG
  // generator names by slug, so use the slug (frontmatter ogImage can be stale).
  const ogImage = `/og/${post.slug}.png`;

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        path={path}
        type="article"
        image={ogImage}
        rawTitle
        jsonLd={[
          articleJsonLd({ title: post.title, description: post.description, path, date: post.date, updated: post.updated, image: ogImage }),
          breadcrumbJsonLd(crumbs),
          ...(post.faq?.length ? [faqJsonLd(post.faq)] : []),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <article style={{ ...ARTICLE_WRAP, paddingTop: '1.5rem' }}>
        <div style={{ fontFamily: C.mono, fontSize: '0.7rem', letterSpacing: '0.12em', color: C.cyan, marginBottom: '0.8rem' }}>
          {post.category?.toUpperCase()} · {post.readingTime}
        </div>
        <h1 style={{ fontFamily: C.display, fontWeight: 900, fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', color: C.text, lineHeight: 1.15, margin: '0 0 1rem' }}>
          {post.title}
        </h1>
        <div style={{ fontFamily: C.mono, fontSize: '0.74rem', color: C.faint, marginBottom: '1.5rem' }}>
          By{' '}
          {/* Visible byline linking to the author page (E-E-A-T / GEO authority). */}
          <Link to="/about" rel="author" style={{ color: C.green, textDecoration: 'none' }}>{author}</Link>
          {post.authorTitle && <span style={{ color: C.faint }}>, {post.authorTitle}</span>} ·{' '}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated && post.updated !== post.date && <> · Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></>}
        </div>

        {/* TL;DR callout — markdown posts carry HTML; JS posts carry a string[] */}
        {(post.tldrHtml || post.tldr?.length > 0) && (
          <aside style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.1rem 1.3rem', marginBottom: '2rem' }}>
            <div style={{ fontFamily: C.mono, fontSize: '0.68rem', letterSpacing: '0.15em', color: C.green, marginBottom: '0.6rem' }}>TL;DR</div>
            {post.tldrHtml ? (
              <p
                style={{ fontFamily: C.mono, fontSize: '0.86rem', color: C.dim, lineHeight: 1.75, margin: 0 }}
                dangerouslySetInnerHTML={{ __html: post.tldrHtml }}
              />
            ) : (
              <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {post.tldr.map((t, i) => (
                  <li key={i} style={{ fontFamily: C.mono, fontSize: '0.85rem', color: C.dim, lineHeight: 1.7, marginBottom: '0.4rem' }}>{t}</li>
                ))}
              </ul>
            )}
          </aside>
        )}

        <TableOfContents items={toc} />

        {/* Body — markdown posts render pre-compiled, sanitized HTML (high-contrast
            via the .article-body rules in index.css); JS posts render typed blocks. */}
        {post.bodyHtml ? (
          <div className="article-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        ) : (
          <RichBody blocks={post.body} />
        )}
      </article>

      {post.faq?.length > 0 && (
        <div id="faq" style={{ ...ARTICLE_WRAP, marginTop: '2rem', scrollMarginTop: '90px' }}>
          <Faq faq={post.faq} />
        </div>
      )}

      {related.length > 0 && (
        <Section style={{ ...WRAP, paddingTop: '2.5rem' }} wrap={false}>
          <div style={ARTICLE_WRAP}>
            <RelatedLinks title="Keep reading" links={related} />
          </div>
        </Section>
      )}

      <CtaBlock heading="Building something like this?" sub="If this is the kind of system you want shipped — reliably, in production — book a free 30-minute scoping call. I’ll tell you straight whether it’s worth building and how I’d approach it." />
    </>
  );
}

function formatDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[(m || 1) - 1]} ${day}, ${y}`;
}
