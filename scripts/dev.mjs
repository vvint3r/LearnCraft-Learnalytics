// Starts the development server for one explainer.
// Usage: npm run dev -- <slug>
import { spawnSync } from 'node:child_process'
import { root, slugsFromArgs } from './lib.mjs'

const args = process.argv.slice(2)
if (!args.filter((a) => !a.startsWith('-')).length) {
  console.error('Name the explainer: npm run dev -- <slug>')
  process.exit(1)
}
const [slug] = slugsFromArgs(args)
const flags = args.filter((a) => a.startsWith('-'))
const result = spawnSync('npx', ['vite', ...flags], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, EXPLAINER: slug },
  shell: process.platform === 'win32',
})
process.exit(result.status ?? 0)
