import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

// GitHub Pages: https://<user>.github.io/<repo>/
// CI sets GITHUB_REPOSITORY; local build falls back to repo name below.
function productionBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const name = repo ?? 'hotel-booking'
  return `/${name}/`
}

// https://vite.dev/config/shared-options.html#base
export default defineConfig(({ command }) => ({
  base: command === 'build' ? productionBase() : '/',
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
