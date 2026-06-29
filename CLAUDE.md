# Project: saswatbuilds.com — AI developer portfolio + lead engine

## Goal
Maximize organic inbound leads from high-paying B2B buyers (US/UK/UAE/Singapore) for AI agent, voice AI, RAG, and automation services. The site is a conversion hub fed by SEO, GEO (AI-search), LinkedIn, and open source.

## Positioning
Spearhead: "Custom AI agents & automation that take real work off your team's plate." Companion services: voice AI agents, RAG/knowledge bases. Founder anchor: Saswat Mishra, AI agent developer & senior ML engineer (IIT Delhi). Single-founder studio tone (credible, senior, outcome-led). Target buyers: founders/ops/eng leaders at SaaS & services companies.

## Non-negotiable design law
Keep the existing cyberpunk/terminal aesthetic, 3D hero, glitch text, terminal project cards. Do NOT redesign the look. Allowed changes: content must be in server-rendered HTML; boot screen must not block crawlers or delay content >~1s; audio off by default w/ visible control; 3D lazy-loads after first paint and is disabled on mobile + prefers-reduced-motion.

## Hard technical targets
- Every route ships complete static HTML (content + meta + JSON-LD) in the initial response — verifiable via view-source / curl with JS disabled. (AI crawlers GPTBot/ClaudeBot/PerplexityBot do NOT run JS.)
- Core Web Vitals (75th pct, mobile/CrUX): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Hosting: GitHub Pages, custom domain saswatbuilds.com, Vite base "/". Cloudflare DNS only.
- One primary CTA site-wide: "Book a free 30-minute AI scoping call" → form-first → Cal.com/Calendly embed.

## Conversion + GEO rules (see Dossier)
Outcome-led hero with CTA + one proof signal in the top viewport; CTA repeated 3–5× with first-person copy + risk-reversal microcopy; reusable case-study cards (logo + problem + bold metric + named attribution); answer-first content, question H2s, tables, TL;DR boxes, embedded stats + sourced quotes; JSON-LD Person/Service/Article/FAQPage/BreadcrumbList; visible bylines + real dates; never keyword-stuff.

## Stack
React 19, Vite 8, React Router 7, Three.js/@react-three, framer-motion, GSAP, Tailwind 4. Static prerender required for GitHub Pages.

## Prerendering (build-time SSR) — how & why
The site is a single-page app (one route `/`, hash-anchor sections — no React Router routes in use). Every route is emitted as fully-formed static HTML at build time so crawlers (incl. GPTBot/ClaudeBot/PerplexityBot/Bing, which don't run JS) see real content, not an empty `<div id="root">`.

**Approach chosen: build-time SSR prerender, Vite-native, implemented directly** (React 19 `renderToPipeableStream` + `onAllReady` → static HTML injected into `dist/index.html`). This is option (a)'s architecture (vite-react-ssg's own technique) without the wrapper lib, because the named off-the-shelf tools do **not** build cleanly on this exact stack:
- **(a) vite-react-ssg** — `ERESOLVE` on install: its peer range caps at Vite 7 (and expects react-router-dom 6); we run Vite 8 + RR7. Only installs with `--force`/`--legacy-peer-deps` (npm: "incorrect and potentially broken"). Rejected.
- **(b) React Router 7 framework-mode prerender** — requires a full framework-mode rewrite (root/entry/loaders), violating "keep the existing app intact"; `@react-router/dev` also lacks Vite 8 support. Rejected.
- **(c) react-snap** — installs but ships `puppeteer@1.20.0` ("no longer supported") with 3 critical + 12 high vulns, abandoned, untested on React 19 hydration. Not "clean" for a client production/CI pipeline. Rejected.

**Pipeline** (`npm run build` = `build:client` → `build:server` → `prerender`):
1. `vite build` → `dist/` (client bundle + `index.html` whose `<head>` already holds title/meta/canonical/OG/JSON-LD).
2. `vite build --ssr src/entry-server.jsx --outDir dist-ssr` → server `render()`.
3. `node scripts/prerender.mjs` → for each route in its `ROUTES` array, render to an HTML string and inject into `<div id="root">…</div>`. `src/main.jsx` hydrates when `#root` has children, else `createRoot` (dev).

## Multi-page architecture (routes + code-splitting)
The site is now a **multi-page** React Router 7 app, each route prerendered to its own `dist/<route>/index.html`:
- `/` Home (existing hero + scroll sections), `/services` (overview + packages), `/services/{ai-agents,voice-ai-agents,rag-knowledge-base,ai-automation}`, `/work` + `/work/:slug` (case studies), `/blog` + `/blog/:slug` (articles), `/about`, `/contact`, and a catch-all `*` → `dist/404.html`.
- **Routing:** client uses `<BrowserRouter>` (`src/main.jsx`); SSR uses `<StaticRouter location>` (`src/entry-server.jsx`). `src/App.jsx` is the `<Routes>` table with **all routes lazy-loaded**. The shared shell is `src/components/Layout/Layout.jsx` (sticky `Header` with primary CTA, `SiteFooter` hub-and-spoke columns, global CursorTrail/StarField, scroll-reset).
- **Per-route head:** every route renders `<Seo>` (`src/seo/Seo.jsx`, react-helmet-async) → title/meta/canonical/OG/Twitter + JSON-LD (Person/Service/Article/FAQPage/BreadcrumbList via `src/seo/jsonld.js`). `entry-server` collects helmet output and the prerenderer injects it into `index.html`'s `<!--app-head-->`; markup goes into `<!--app-html-->` inside `#root`.
- **Content is data:** pages are data modules under `src/content/{services,work,blog}/*.js`, auto-discovered via `import.meta.glob` in `src/content/manifest.js`. Generic renderers (`src/routes/ServicePage|CaseStudy|BlogPost.jsx`) + UI primitives (`src/components/ui/*`) render them. **Add a page = add a data file** (mirror an existing one); it's auto-routed, auto-prerendered, auto-added to sitemap.xml + llms.txt. Hub-and-spoke links come from `related.{service,caseStudies,articles}` slugs.
- **Code-splitting law (verify on every change):** only `Home` may import Three.js (via the lazy Hero/Projects sections). Nothing in `Layout` or any content route may import `three`/`@react-three`. Verify: `ANALYZE=1 npm run build:client` → `dist/stats.html`, and grep that non-Home route chunks don't reference the three chunk. The shared shell must stay three-free.
- **Prerender pitfall:** `scripts/prerender.mjs` injects head/html with **function** replacements (not string), because content/JSON-LD contains literal `$` that string-`replace` would mangle as `$1` backrefs. Always run via `npm run build` (the client build regenerates a clean `dist/index.html` template before prerender).

**SSR-safety rules (must follow or the prerender build fails loudly):**
- Anything that touches the browser at *render* time (WebGL/`<Canvas>`, `window`/`document`, `CanvasTexture`) must be wrapped in `src/components/util/ClientOnly.jsx` (renders `fallback` on server + first client render, real children after mount — no hydration mismatch). This also satisfies the design law "3D lazy-loads after first paint."
- JSX prop expressions evaluate at element-creation even inside `<ClientOnly>` — guard browser reads in props (e.g. `dpr={isBrowser ? window.devicePixelRatio : 1}`).
- Module-level browser calls (e.g. `useGLTF.preload(...)`) must be guarded with `if (isBrowser)`.
- The boot overlay is CSS-faded (≤~1s) and `prefers-reduced-motion` aware; content is rendered visible underneath (never opacity-gated on JS) so it's present with JS disabled.

**Verify after any build:** `npm run build`, then curl/grep the raw static HTML for headline text + meta description + canonical + JSON-LD (must be present with JS disabled). Note: `og-image.png` is generated by `node scripts/generate-og-image.js` (output `public/og-image.png`).

## 3D performance contract (implemented — Dossier §3)
The hero 3D is split so it never gates Core Web Vitals:
- **Static poster = LCP.** `public/hero-poster.{webp,jpg}` (a captured still of the avatar) is rendered as a fixed-size `<img fetchpriority=high>` in the prerendered HTML and is the LCP element. The Three.js `<Canvas>` lives in `src/components/Hero/HeroCanvas.jsx` (its own lazy chunk) and is dynamically imported only **after the load event**, only on **desktop with motion allowed** (`HeroVisual` in HeroSection). On mobile / `prefers-reduced-motion` → poster only, **zero Three.js JS** (verified: `canvasPresent: 0`).
- **CLS ≈ 0.** Two things were the CLS sources and are now fixed: (1) lazy-route Suspense fallback flashing during throttled hydration → put `SiteFooter` INSIDE the route Suspense + `<link rel=modulepreload>` the route chunk per-page (prerender reads `dist/.vite/manifest.json`); (2) animated boxes that grow (boot-screen log, hero typewriter) → give them FIXED heights + `overflow:hidden`. The hero column has fixed dims; the poster is absolutely positioned within it.
- **Fonts:** self-hosted in `public/fonts/*.woff2` with `@font-face` in index.css; critical weights `<link rel=preload>`ed in index.html (no render-blocking external request, ready before paint → no swap reflow). Re-fetch via `/tmp/fetch-fonts.mjs` pattern if weights change.
- **Audio:** site-wide click-sound autoplay removed (WCAG 1.4.2); only the hero music player makes sound, off by default with a visible control.
- **Lab vs field:** measure with `CHROME_PATH="…/Google Chrome" node scripts/lh.mjs <url> [url2]` (mobile Lighthouse). Lighthouse's simulated throttle is far harsher than CrUX field — the poster paints in ~130ms in-browser. Targets: article routes ≥95 perf; LCP element must be the poster (not the canvas); no CLS from the hero.
