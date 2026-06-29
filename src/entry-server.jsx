import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Writable } from 'node:stream';
import App from './App.jsx';

// Re-export the route list + content arrays so scripts/prerender.mjs can
// enumerate routes and generate sitemap.xml / llms.txt from the built SSR
// bundle (single source of truth = content manifest).
export { getAllRoutePaths, services, work, blog } from './content/manifest.js';

/**
 * Render a route to { html, head } at build time.
 *  - html: the #root markup (renderToPipeableStream + onAllReady, so all lazy
 *    route/section chunks resolve to real content, not Suspense fallbacks).
 *  - head: the per-route <head> (title/meta/canonical/OG/JSON-LD) collected from
 *    react-helmet-async, to inject into index.html's <!--app-head-->.
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
          const { helmet } = helmetContext;
          const head = helmet
            ? [helmet.title, helmet.meta, helmet.link, helmet.script]
                .map((part) => (part && part.toString ? part.toString() : ''))
                .join('')
            : '';
          resolve({ html, head });
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
