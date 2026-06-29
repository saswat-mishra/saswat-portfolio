import { useParams } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { articleJsonLd, faqJsonLd, breadcrumbJsonLd } from '../seo/jsonld.js';
import { getPost, serviceLink, postLink, workLink } from '../content/manifest.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import { Section } from '../components/ui/Section.jsx';
import RichBody from '../components/ui/RichBody.jsx';
import Faq from '../components/ui/Faq.jsx';
import RelatedLinks from '../components/ui/RelatedLinks.jsx';
import CtaBlock from '../components/ui/CtaBlock.jsx';
import NotFound from './NotFound.jsx';
import { C, WRAP } from '../theme.js';

const ARTICLE_WRAP = { maxWidth: 760, margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)' };

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
  const related = [
    serviceLink(post.related?.service),
    ...(post.related?.caseStudies || []).map(workLink),
    ...(post.related?.articles || []).map(postLink),
  ].filter(Boolean);

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        path={path}
        type="article"
        rawTitle
        jsonLd={[
          articleJsonLd({ title: post.title, description: post.description, path, date: post.date, updated: post.updated }),
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
          By <span style={{ color: C.dim }}>Saswat Mishra</span> ·{' '}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated && post.updated !== post.date && <> · Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></>}
        </div>

        {post.tldr?.length > 0 && (
          <aside style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: '4px', padding: '1.1rem 1.3rem', marginBottom: '2rem' }}>
            <div style={{ fontFamily: C.mono, fontSize: '0.68rem', letterSpacing: '0.15em', color: C.green, marginBottom: '0.6rem' }}>TL;DR</div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
              {post.tldr.map((t, i) => (
                <li key={i} style={{ fontFamily: C.mono, fontSize: '0.85rem', color: C.dim, lineHeight: 1.7, marginBottom: '0.4rem' }}>{t}</li>
              ))}
            </ul>
          </aside>
        )}

        <RichBody blocks={post.body} />
      </article>

      {post.faq?.length > 0 && (
        <div style={{ ...ARTICLE_WRAP, marginTop: '2rem' }}>
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
