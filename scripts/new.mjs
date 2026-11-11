// Creates a new explainer from explainers/_template.
// Usage: npm run new -- <slug> "Title of the explainer"
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { explainersDir } from './lib.mjs'

const [slug, ...rest] = process.argv.slice(2)
const title = rest.join(' ').trim()
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !title) {
  console.error('Usage: npm run new -- <slug> "Title"   (slug: lowercase letters, digits and hyphens)')
  process.exit(1)
}
const target = path.join(explainersDir, slug)
if (existsSync(target)) {
  console.error(`explainers/${slug}/ already exists.`)
  process.exit(1)
}
cpSync(path.join(explainersDir, '_template'), target, { recursive: true })
for (const file of ['index.html', 'Explainer.tsx']) {
  const full = path.join(target, file)
  writeFileSync(full, readFileSync(full, 'utf8').replaceAll('__TITLE__', title))
}
console.log(`Created explainers/${slug}/. Start it with: npm run dev -- ${slug}`)
