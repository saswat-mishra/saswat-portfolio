// Content registry. Each content item is a plain data module (default export)
// under content/{services,work,blog}/*.js. We auto-discover them with Vite's
// import.meta.glob so adding a page = adding a file (no central list to edit).
//
// This module is the single source of truth for: route enumeration during
// prerender, and the index/related lookups used by route components.

const serviceModules = import.meta.glob('./services/*.js', { eager: true });
const workModules = import.meta.glob('./work/*.js', { eager: true });
// Blog posts come from two sources, merged into one collection:
//   - legacy hand-authored data modules: ./blog/*.js
//   - markdown articles compiled by plugins/vite-markdown.js: ./blog/posts/*.md
const blogModules = import.meta.glob('./blog/*.js', { eager: true });
const mdBlogModules = import.meta.glob('./blog/posts/*.md', { eager: true });

const collect = (mods) =>
  Object.values(mods)
    .map((m) => m.default)
    .filter(Boolean);

// Services & work use an explicit `order`; blog sorts newest-first by date.
const byOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);
const byDateDesc = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));

export const services = collect(serviceModules).sort(byOrder);
export const work = collect(workModules).sort(byOrder);
export const blog = [...collect(blogModules), ...collect(mdBlogModules)].sort(byDateDesc);

export const getService = (slug) => services.find((s) => s.slug === slug);
export const getWork = (slug) => work.find((w) => w.slug === slug);
export const getPost = (slug) => blog.find((p) => p.slug === slug);

// Resolve a content slug → a link object for RelatedLinks. Returns undefined if
// the target doesn't exist yet (so hub-and-spoke links degrade gracefully while
// content is still being authored). RelatedLinks filters out falsy entries.
export function serviceLink(slug) {
  const s = getService(slug);
  return s && { to: `/services/${s.slug}`, label: s.nav || s.breadcrumb, kind: 'Service', desc: s.hero?.sub };
}
export function workLink(slug) {
  const w = getWork(slug);
  return w && { to: `/work/${w.slug}`, label: w.title, kind: 'Case study', desc: w.subtitle };
}
export function postLink(slug) {
  const p = getPost(slug);
  return p && { to: `/blog/${p.slug}`, label: p.title, kind: 'Article', desc: p.description };
}

/** All concrete route paths for the prerenderer + sitemap. */
export function getAllRoutePaths() {
  return [
    '/',
    '/services',
    '/work',
    '/blog',
    '/about',
    '/contact',
    '/search',
    ...services.map((s) => `/services/${s.slug}`),
    ...work.map((w) => `/work/${w.slug}`),
    ...blog.map((p) => `/blog/${p.slug}`),
  ];
}

/** Routes that are prerendered but excluded from sitemap.xml (noindex tools). */
export const NOINDEX_ROUTES = new Set(['/search']);
