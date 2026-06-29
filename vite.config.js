import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// Served from the apex domain saswatbuilds.com, so base is root "/".
// (Was "/saswat-portfolio/" while on the github.io project subpath.)
// Hard-coded asset paths use import.meta.env.BASE_URL, so they resolve from "/".
//
// Run `ANALYZE=1 npm run build:client` to emit dist/stats.html (bundle treemap)
// — used to verify the Three.js bundle stays out of non-Home route chunks.
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE &&
      visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, template: 'treemap' }),
  ].filter(Boolean),
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  // Emit .vite/manifest.json so the prerenderer can <link rel=modulepreload>
  // each route's chunk per-page → React.lazy resolves before first paint
  // (no painted Suspense fallback → no layout shift), while keeping per-route
  // code-splitting.
  build: { manifest: true },
})
