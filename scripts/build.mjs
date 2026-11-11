// Builds each explainer to one self-contained file: dist/<slug>.html.
// Usage: npm run build            (every explainer)
//        npm run build -- <slug>  (one explainer)
import { spawnSync } from 'node:child_process'
import { renameSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { distDir, root, slugsFromArgs } from './lib.mjs'

for (const slug of slugsFromArgs()) {
  const result = spawnSync('npx', ['vite', 'build'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'inherit'],
    env: { ...process.env, EXPLAINER: slug },
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    process.stdout.write(result.stdout ?? '')
    console.error(`Build failed: ${slug}`)
    process.exit(result.status ?? 1)
  }
  const out = path.join(distDir, `${slug}.html`)
  renameSync(path.join(distDir, slug, 'index.html'), out)
  rmSync(path.join(distDir, slug), { recursive: true, force: true })
  console.log(`dist/${slug}.html  ${(statSync(out).size / 1024).toFixed(0)} kB`)
}
