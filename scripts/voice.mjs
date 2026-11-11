// Generates narration clips with ElevenLabs from an explainer's narration.json.
// Reads   explainers/<slug>/narration.json   { "clips": [{ "id": "intro", "text": "..." }] }
// Writes  explainers/<slug>/audio/<id>.mp3   and audio/manifest.json
// A clip is regenerated only when its text, the voice or the model has changed.
//
// Usage: npm run voice -- <slug>            generate missing or changed clips
//        npm run voice -- <slug> --dry-run  list what would be generated, spend nothing
//
// The API key is read from ELEVENLABS_API_KEY. In a Claude cloud session the key is
// held by the environment and injected into requests to api.elevenlabs.io, so the
// variable can stay unset.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { explainersDir, root, slugsFromArgs } from './lib.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
if (!args.filter((a) => !a.startsWith('-')).length) {
  console.error('Name the explainer: npm run voice -- <slug>')
  process.exit(1)
}
const [slug] = slugsFromArgs(args)
const config = JSON.parse(readFileSync(path.join(root, 'voice.config.json'), 'utf8'))
const dir = path.join(explainersDir, slug)
const source = path.join(dir, 'narration.json')
if (!existsSync(source)) {
  console.error(`explainers/${slug}/narration.json not found.`)
  process.exit(1)
}
const { clips } = JSON.parse(readFileSync(source, 'utf8'))
const audioDir = path.join(dir, 'audio')
mkdirSync(audioDir, { recursive: true })
const manifestPath = path.join(audioDir, 'manifest.json')
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {}

const fingerprint = (text) =>
  createHash('sha256').update([config.voice_id, config.model_id, JSON.stringify(config.voice_settings ?? null), text].join('\n')).digest('hex').slice(0, 16)

const key = process.env.ELEVENLABS_API_KEY || 'injected-by-environment'
let failed = false

for (const clip of clips) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(clip.id)) {
    console.error(`Clip id "${clip.id}" must be lowercase letters, digits and hyphens.`)
    process.exit(1)
  }
  const out = path.join(audioDir, `${clip.id}.mp3`)
  const print = fingerprint(clip.text)
  if (existsSync(out) && manifest[clip.id] === print) {
    console.log(`keep  ${clip.id}`)
    continue
  }
  if (dryRun) {
    console.log(`would generate  ${clip.id}  (${clip.text.length} characters)`)
    continue
  }
  const body = { text: clip.text, model_id: config.model_id }
  if (config.voice_settings) body.voice_settings = config.voice_settings
  const tmp = `${out}.tmp`
  const result = spawnSync(
    'curl',
    [
      '--silent', '--show-error', '--fail-with-body',
      '--request', 'POST',
      `https://api.elevenlabs.io/v1/text-to-speech/${config.voice_id}?output_format=${config.output_format}`,
      '--header', `xi-api-key: ${key}`,
      '--header', 'Content-Type: application/json',
      '--data', JSON.stringify(body),
      '--output', tmp,
    ],
    { encoding: 'utf8' },
  )
  if (result.status !== 0) {
    failed = true
    const detail = existsSync(tmp) ? readFileSync(tmp, 'utf8').slice(0, 400) : ''
    rmSync(tmp, { force: true })
    console.error(`FAIL  ${clip.id}: ${result.stderr.trim()} ${detail}`)
    continue
  }
  renameSync(tmp, out)
  manifest[clip.id] = print
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`made  ${clip.id}`)
}

process.exit(failed ? 1 : 0)
