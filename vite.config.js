import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base is /saswat-portfolio/ for production (GitHub Pages subdirectory),
// and / for local dev so hard-coded asset paths (/models/, /videos/, etc.) work unchanged.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/saswat-portfolio/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
}))
