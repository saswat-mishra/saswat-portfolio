import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// Every route is prerendered to static HTML at build time, so #root already
// holds server-rendered markup in production — hydrate it. In dev (or any
// non-prerendered fallback) #root is empty — mount fresh.
if (root.firstElementChild) {
  // The prerenderer lifts the per-route SEO tags into <head> marked data-rh.
  // On React 19, react-helmet-async re-adds <title>/<meta>/<link> on hydration
  // (duplicating the prerendered ones) but does NOT re-emit JSON-LD <script>s.
  // So: drop the prerendered title/meta/link (Helmet re-applies exactly one of
  // each) and KEEP the prerendered ld+json scripts (Helmet won't restore them).
  // Crawlers without JS keep the full static head either way.
  document.querySelectorAll('head [data-rh]:not(script)').forEach((el) => el.remove())
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
