/* eslint-disable react-refresh/only-export-components --
   SSR build entry: intentionally re-exports data + helpers (routes, content,
   headExtras, NOINDEX_ROUTES) for scripts/prerender.mjs. It is never a React
   Fast Refresh boundary, so the only-export-components rule does not apply. */
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Writable } from 'node:stream';
import App from './App.jsx';

// Re-export the route list + content arrays so scripts/prerender.mjs can
// enumerate routes and generate sitemap.xml / llms.txt from the built SSR
// bundle (single source of truth = content manifest).
export { getAllRoutePaths, services, work, blog, NOINDEX_ROUTES } from './content/manifest.js';
// Site-wide <head> extras (search-engine verification + analytics), injected
// into every prerendered page by scripts/prerender.mjs. Config-driven.
export { headExtras } from './site.config.js';

// react-helmet-async does not populate its server context under React 19 +
// renderToPipeableStream — it renders its tags INLINE into the streamed body
// instead. Since the app itself never emits <title>/<meta>/<link>/JSON-LD (those
// come only from <Helmet> via <Seo>/<Breadcrumbs>), we deterministically lift
// every head-type tag out of the rendered markup into `head` (→ <head>) and keep
// `html` (→ #root) clean. This puts SEO tags in the <head> where they belong and
// also removes a hydration mismatch (the client Helmet renders null into #root).
const HEAD_TAG_PATTERNS = [
  /<title[^>]*>[\s\S]*?<\/title>/gi,
  /<meta\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/gi,
];
// Tag each lifted element with data-rh="true" (react-helmet-async's marker) so
// that on client hydration Helmet ADOPTS and replaces these in place instead of
// appending a second copy — otherwise JS clients would get duplicate
// title/meta/canonical/JSON-LD. Crawlers without JS just see the clean head.
const tagRh = (tag) => tag.replace(/^<([a-zA-Z]+)/, '<$1 data-rh="true"');
function liftHead(markup) {
  const head = [];
  let body = markup;
  for (const re of HEAD_TAG_PATTERNS) {
    body = body.replace(re, (m) => {
      head.push(tagRh(m));
      return '';
    });
  }
  return { head: head.join(''), body };
}

/**
 * Render a route to { html, head } at build time.
 *  - html: the #root markup (renderToPipeableStream + onAllReady, so all lazy
 *    route/section chunks resolve to real content, not Suspense fallbacks).
 *  - head: the per-route <head> (title/meta/canonical/OG/JSON-LD), lifted out of
 *    the rendered markup to inject into index.html's <!--app-head-->.
 * Any render error rejects so SSR-unsafe code fails the build loudly.
 */
export function render(url) {
  return new Promise((resolve, reject) => {
    let html = '';
    let settled = false;
    const helmetContext = {};
    const fail = (err) => {
      if (!settled) {
        settled = true;
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };

    const writable = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString('utf8');
        cb();
      },
      final(cb) {
        cb();
        if (!settled) {
          settled = true;
          const { head, body } = liftHead(html);
          resolve({ html: body, head });
        }
      },
    });

    const { pipe } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          if (!settled) pipe(writable);
        },
        onShellError: fail,
        onError: fail,
      },
    );
  });
}
