// Multi-route post-build prerender.
//
// Runs AFTER both Vite builds:
//   1) vite build                              → dist/        (client bundle + index.html template)
//   2) vite build --ssr src/entry-server.jsx   → dist-ssr/    (render() + getAllRoutePaths())
//
// For every route it renders { html, head } and injects them into the built
// index.html (head → <!--app-head-->, markup → #root), writing one fully-formed
// .html file per route. Also emits dist/404.html (the catch-all route) so
// GitHub Pages serves a styled, app-shell 404 for unknown URLs.

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

async function resolveSsrEntry() {
  const files = await readdir(ssrDir).catch(() => {
    throw new Error(`prerender: ${path.relative(root, ssrDir)} not found — run the SSR build first`)
  })
  const entry = files.find((f) => /^entry-server\.(js|mjs)$/.test(f))
  if (!entry) throw new Error(`prerender: no entry-server.{js,mjs} in dist-ssr (found: ${files.join(', ')})`)
  return path.join(ssrDir, entry)
}

const ssrEntry = await resolveSsrEntry()
const { render, getAllRoutePaths, services, work, blog, headExtras, NOINDEX_ROUTES } = await import(pathToFileURL(ssrEntry).href)
const noindex = NOINDEX_ROUTES instanceof Set ? NOINDEX_ROUTES : new Set(NOINDEX_ROUTES || [])

// Site-wide verification <meta> + analytics <script> from site.config (empty
// until tokens are pasted in). Injected into every page's <head>.
const SITE_HEAD = (typeof headExtras === 'function' ? headExtras() : '') || ''

const template = await readFile(path.join(distDir, 'index.html'), 'utf8')

// NOTE: use FUNCTION replacements, never string replacements. Rendered content
// and JSON-LD contain literal "$" (e.g. "$2,000"), and a string replacement
// would interpret "$1"/"$2" as capture-group backreferences and corrupt output.
function injectHead(tpl, head) {
  if (tpl.includes('<!--app-head-->')) return tpl.replace('<!--app-head-->', () => head)
  return tpl.replace('</head>', () => `${head}</head>`)
}
function injectHtml(tpl, html) {
  return tpl.replace(/(<div id="root">)(?:<!--app-html-->)?(<\/div>)/, (_m, open, close) => open + html + close)
}
if (!/<div id="root">(<!--app-html-->)?<\/div>/.test(template)) {
  throw new Error('prerender: could not find an empty <div id="root"> in dist/index.html')
}

function outPathFor(route) {
  if (route === '/') return path.join(distDir, 'index.html')
  return path.join(distDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

// Vite build manifest → per-route modulepreload (kills the lazy-route hydration
// fallback flash that otherwise causes CLS under throttling).
let manifest = null
try {
  manifest = JSON.parse(await readFile(path.join(distDir, '.vite', 'manifest.json'), 'utf8'))
} catch {
  console.warn('  (no manifest.json — skipping route modulepreload)')
}
function routeSource(route) {
  if (route === '/') return 'src/routes/Home.jsx'
  if (route === '/services') return 'src/routes/ServicesOverview.jsx'
  if (route.startsWith('/services/')) return 'src/routes/ServicePage.jsx'
  if (route === '/work') return 'src/routes/WorkIndex.jsx'
  if (route.startsWith('/work/')) return 'src/routes/CaseStudy.jsx'
  if (route === '/blog') return 'src/routes/BlogIndex.jsx'
  if (route.startsWith('/blog/')) return 'src/routes/BlogPost.jsx'
  if (route === '/about') return 'src/routes/About.jsx'
  if (route === '/open-source') return 'src/routes/OpenSource.jsx'
  if (route === '/contact') return 'src/routes/Contact.jsx'
  if (route === '/search') return 'src/routes/Search.jsx'
  return 'src/routes/NotFound.jsx'
}
function preloadLinks(route) {
  // Preload ONLY the route's own entry chunk (cheap, 1 link) so React.lazy
  // resolves quickly; the footer-inside-Suspense structure handles the rest of
  // the no-CLS guarantee without eagerly downloading the whole import graph.
  const entry = manifest?.[routeSource(route)]
  return entry?.file ? `<link rel="modulepreload" href="/${entry.file}">` : ''
}

async function emit(route, file) {
  const { html, head } = await render(route)
  if (!html || html.length < 80) throw new Error(`prerender: render("${route}") produced too little HTML (${html?.length ?? 0} bytes)`)
  let page = injectHead(template, SITE_HEAD + preloadLinks(route) + head)
  page = injectHtml(page, html)
  const target = file || outPathFor(route)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, page, 'utf8')
  return { target, bytes: html.length }
}

const routes = getAllRoutePaths()
let count = 0
for (const route of routes) {
  const { target, bytes } = await emit(route)
  count++
  console.log(`  ${String(route).padEnd(34)} → ${path.relative(root, target)} (+${bytes.toLocaleString()} bytes)`)
}

// Custom 404 for GitHub Pages: render the catch-all route to dist/404.html.
await emit('/__not-found__', path.join(distDir, '404.html'))
console.log(`  ${'/* (404)'.padEnd(34)} → ${path.relative(root, path.join(distDir, '404.html'))}`)

// Generate sitemap.xml from the same route list (single source of truth).
// noindex tool routes (e.g. /search) are excluded; blog/work get a real per-page
// lastmod from their content date so search engines see accurate freshness.
const ORIGIN = 'https://saswatbuilds.com'
const lastmod = new Date().toISOString().slice(0, 10)
const loc = (r) => `${ORIGIN}${r === '/' ? '/' : '/' + r.replace(/^\/+|\/+$/g, '') + '/'}`
const priority = (r) => (r === '/' ? '1.0' : /^\/(services|work|blog)\/[^/]+$/.test(r) ? '0.8' : '0.9')
const lastmodFor = (r) => {
  const b = r.match(/^\/blog\/(.+)$/)
  if (b) { const p = blog.find((x) => x.slug === b[1]); return (p?.updated || p?.date || lastmod) }
  const w = r.match(/^\/work\/(.+)$/)
  if (w) { const x = work.find((y) => y.slug === w[1]); return (x?.updated || x?.date || lastmod) }
  return lastmod
}
const indexableRoutes = routes.filter((r) => !noindex.has(r))
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexableRoutes
    .map((r) => `  <url>\n    <loc>${loc(r)}</loc>\n    <lastmod>${lastmodFor(r)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority(r)}</priority>\n  </url>`)
    .join('\n') +
  `\n</urlset>\n`
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')
console.log(`  sitemap.xml (${indexableRoutes.length} urls${routes.length - indexableRoutes.length ? `, ${routes.length - indexableRoutes.length} noindex excluded` : ''})`)

// Generate rss.xml from the blog collection (single source of truth = manifest).
const xmlEscape = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const rfc822 = (d) => {
  if (!d) return ''
  const [y, m, day] = String(d).split('-').map(Number)
  return new Date(Date.UTC(y, (m || 1) - 1, day || 1, 12)).toUTCString()
}
const postUrl = (p) => `${ORIGIN}/blog/${p.slug}/`
const rssItems = blog
  .map(
    (p) =>
      `  <item>\n` +
      `    <title>${xmlEscape(p.title)}</title>\n` +
      `    <link>${postUrl(p)}</link>\n` +
      `    <guid isPermaLink="true">${postUrl(p)}</guid>\n` +
      `    <pubDate>${rfc822(p.date)}</pubDate>\n` +
      `    <description>${xmlEscape(p.description)}</description>\n` +
      `  </item>`
  )
  .join('\n')
const rss =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
  `<channel>\n` +
  `  <title>Saswat Mishra — AI Agents, Voice AI, RAG &amp; Automation</title>\n` +
  `  <link>${ORIGIN}/blog/</link>\n` +
  `  <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />\n` +
  `  <description>Practical, no-fluff guides on building production AI agents, voice AI, and RAG systems.</description>\n` +
  `  <language>en-us</language>\n` +
  `  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
  rssItems +
  `\n</channel>\n</rss>\n`
await writeFile(path.join(distDir, 'rss.xml'), rss, 'utf8')
console.log(`  rss.xml (${blog.length} items)`)

// Generate llms.txt from the manifest so AI crawlers get a clean, current map.
const list = (items, base, label) =>
  items.length
    ? `\n## ${label}\n\n` +
      items
        .map((it) => `- [${it.title || it.nav}](${ORIGIN}${base}${it.slug}/): ${it.seo?.description || it.description || it.summary || ''}`)
        .join('\n') +
      '\n'
    : ''
const llms =
  `# Saswat Mishra — Custom AI Agents, Voice AI, RAG & Automation\n` +
  `> ${'Custom AI agents & automation that take real work off your team’s plate.'} Freelance AI agent developer & senior ML engineer (IIT Delhi), shipping production AI for B2B teams across the US, UK, UAE, and Singapore.\n` +
  `\nPrimary CTA: book a free 30-minute AI scoping call at ${ORIGIN}/contact/.\n` +
  list(services, '/services/', 'Services') +
  list(work, '/work/', 'Case studies') +
  list(blog, '/blog/', 'Articles') +
  `\n## Key pages\n\n- [Services & pricing](${ORIGIN}/services/)\n- [Case studies](${ORIGIN}/work/)\n- [Blog](${ORIGIN}/blog/)\n- [About](${ORIGIN}/about/)\n- [Contact](${ORIGIN}/contact/)\n`
await writeFile(path.join(distDir, 'llms.txt'), llms, 'utf8')
console.log(`  llms.txt`)

console.log(`\n✓ prerender complete: ${count} routes + 404.html + sitemap.xml + rss.xml + llms.txt`)
