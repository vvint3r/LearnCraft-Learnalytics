import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const explainersDir = path.join(root, 'explainers')
export const distDir = path.join(root, 'dist')

/** Folder names under explainers/ that hold an explainer. Names starting with "_" are scaffolds. */
export function allSlugs() {
  return readdirSync(explainersDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && existsSync(path.join(explainersDir, d.name, 'index.html')))
    .map((d) => d.name)
    .sort()
}

/** The slugs named on the command line, or every explainer when none is named. */
export function slugsFromArgs(args = process.argv.slice(2)) {
  const named = args.filter((a) => !a.startsWith('-'))
  const slugs = named.length ? named : allSlugs()
  for (const slug of slugs) {
    if (!existsSync(path.join(explainersDir, slug, 'index.html'))) {
      console.error(`No explainer at explainers/${slug}/. Existing: ${allSlugs().join(', ') || 'none'}.`)
      process.exit(1)
    }
  }
  return slugs
}
