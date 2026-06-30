// Single slug algorithm shared by RichBody (heading ids) and BlogPost (derived
// TOC) so anchor links match. Mirrors the build-time slugify in
// plugins/vite-markdown.js, which pre-bakes ids into markdown posts' HTML.
export function slugify(s) {
  return String(s)
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
