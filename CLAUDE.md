@AGENTS.md

## Claude Code notes

- The skills in `.claude/skills/` and the three review agents in `.claude/agents/` load
  automatically in this repository.
- To publish a built page as an Artifact, publish `dist/<slug>.html` as it is.
- In a cloud session, request the ElevenLabs key through the secure credential form for
  `api.elevenlabs.io` (header `xi-api-key`). Do not ask for it in chat.
