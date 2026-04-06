import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

// GitHub Pages serves project sites at /<repo-name>/ — assets must use that base.
// https://vite.dev/config/shared-options.html#base
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/hotel-booking/' : '/',
  plugins: [
    react(),
    {
      name: 'github-pages-spa-fallback',
      closeBundle() {
        const index = resolve(__dirname, 'dist', 'index.html')
        const notFound = resolve(__dirname, 'dist', '404.html')
        copyFileSync(index, notFound)
      },
    },
  ],
}))
