import { Helmet } from 'react-helmet-async';
import { SITE, abs } from '../site.config.js';

/**
 * Per-route <head>. Renders title, description, canonical, Open Graph/Twitter,
 * and any JSON-LD blocks via react-helmet-async. During prerender the server
 * collects this and injects it into index.html's <!--app-head--> placeholder,
 * so every route ships complete, crawler-visible metadata with no JS required.
 *
 * Props:
 *  - title:        page title (run through the site title template unless `rawTitle`)
 *  - description:  meta description
 *  - path:         route path (e.g. '/services/ai-agents') → canonical + og:url
 *  - image:        OG image path (defaults to site OG image)
 *  - type:         og:type ('website' | 'article' | 'profile')
 *  - noindex:      emit robots noindex (e.g. 404)
 *  - jsonLd:       array of schema.org objects
 */
export default function Seo({
  title,
  description = SITE.description,
  path = '/',
  image = SITE.ogImage,
  type = 'website',
  rawTitle = false,
  noindex = false,
  jsonLd = [],
}) {
  const fullTitle = !title
    ? SITE.defaultTitle
    : rawTitle
      ? title
      : SITE.titleTemplate.replace('%s', title);
  const canonical = abs(path);
  const ogImage = abs(image);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {/* Single robots directive per page (the static index.html tag was removed
          to avoid an index+noindex conflict on noindex routes). */}
      <meta
        name="robots"
        content={noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Saswat Mishra — AI Agent Developer" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:creator" content={SITE.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
