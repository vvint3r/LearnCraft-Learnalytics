// Opens each built explainer in a headless browser and asserts the publishing rules:
// no script errors, no network requests, no sideways scroll, and one <h1>.
// Runs at desktop and phone widths, in light and dark, and with reduced motion.
// Screenshots go to .check/. Build first: npm run build.
// Usage: npm run check            (every explainer)
//        npm run check -- <slug>  (one explainer)
import { existsSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { distDir, root, slugsFromArgs } from './lib.mjs'

let chromium
try {
  ;({ chromium } = createRequire(import.meta.url)('playwright'))
} catch {
  console.error('Playwright is not available. Install it once: npm install --no-save playwright && npx playwright install chromium')
  process.exit(1)
}

const runs = [
  { name: 'desktop-light', width: 1280, height: 900, colorScheme: 'light', reducedMotion: 'no-preference' },
  { name: 'phone-dark', width: 390, height: 844, colorScheme: 'dark', reducedMotion: 'no-preference' },
  { name: 'desktop-reduced', width: 1280, height: 900, colorScheme: 'light', reducedMotion: 'reduce' },
]

const shots = path.join(root, '.check')
mkdirSync(shots, { recursive: true })
const browser = await chromium.launch()
let failed = false

for (const slug of slugsFromArgs()) {
  const file = path.join(distDir, `${slug}.html`)
  if (!existsSync(file)) {
    console.error(`FAIL  ${slug}: dist/${slug}.html not found. Run npm run build -- ${slug}`)
    failed = true
    continue
  }
  for (const run of runs) {
    const context = await browser.newContext({
      viewport: { width: run.width, height: run.height },
      colorScheme: run.colorScheme,
      reducedMotion: run.reducedMotion,
    })
    const page = await context.newPage()
    const findings = []
    page.on('pageerror', (e) => findings.push(`script error: ${e.message}`))
    page.on('console', (m) => m.type() === 'error' && findings.push(`console error: ${m.text()}`))
    page.on('request', (r) => /^https?:/.test(r.url()) && findings.push(`network request: ${r.url()}`))

    await page.goto(`file://${file}`)
    await page.waitForTimeout(600)
    // Scroll the whole page so scroll-driven sections run.
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += Math.round(run.height * 0.6)) {
      await page.mouse.wheel(0, Math.round(run.height * 0.6))
      await page.waitForTimeout(120)
    }
    await page.waitForTimeout(400)

    const facts = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      dark: document.documentElement.classList.contains('dark'),
    }))
    if (facts.overflow > 0) findings.push(`sideways scroll: page is ${facts.overflow}px wider than the viewport`)
    if (facts.h1 !== 1) findings.push(`expected one <h1>, found ${facts.h1}`)
    if (!facts.title.trim()) findings.push('the page has no <title>')
    if (facts.dark !== (run.colorScheme === 'dark')) findings.push(`theme did not follow the ${run.colorScheme} setting`)

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)
    await page.screenshot({ path: path.join(shots, `${slug}-${run.name}.png`), fullPage: true })
    await context.close()

    if (findings.length) {
      failed = true
      console.log(`FAIL  ${slug}  ${run.name}`)
      for (const f of [...new Set(findings)]) console.log(`      ${f}`)
    } else {
      console.log(`ok    ${slug}  ${run.name}`)
    }
  }
}

await browser.close()
process.exit(failed ? 1 : 0)
