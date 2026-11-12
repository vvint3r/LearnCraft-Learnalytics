import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// One explainer is built at a time. EXPLAINER names its folder under explainers/;
// the dev and build scripts set it.
const slug = process.env.EXPLAINER
if (!slug) throw new Error('EXPLAINER is not set. Use npm run dev -- <slug> or npm run build -- <slug>.')

export default defineConfig({
  root: path.resolve(import.meta.dirname, 'explainers', slug),
  publicDir: false,
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist', slug),
    emptyOutDir: true,
  },
})
