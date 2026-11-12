# Handoff

How to put another agent, or another machine, on this project.

## What carries the setup

| Item | Where | Carries |
| --- | --- | --- |
| The repository | `github.com/vvint3r/LearnCraft-Learnalytics` | Build project, components, scripts, 31 skills, 3 review agents |
| `AGENTS.md` | Repository root | The working brief every agent reads first |
| `voice.config.json` | Repository root | The narration voice and model |
| An ElevenLabs API key | Supplied per environment, never committed | Narration through `npm run voice` |

Everything except the API key is in the repository. An agent with the repository has the setup.

## Requirements

- Node.js 20 or later, npm, git, curl.
- For `npm run check`: Playwright with Chromium.
- Read access to the repository. It is private: add the other agent's GitHub account as a
  collaborator, or install the agent's GitHub app on the repository.

## Setup on another machine

```bash
git clone https://github.com/vvint3r/LearnCraft-Learnalytics.git
cd LearnCraft-Learnalytics
npm install
npm run typecheck
```

The repository holds no piece yet, so there is nothing to build until one is scaffolded with
`npm run new`.

## Setup by agent type

| Agent | Steps |
| --- | --- |
| Claude Code, local | Open the cloned folder. `CLAUDE.md`, the skills and the review agents load on their own |
| Claude Code, cloud | Start a session with this repository selected. Skills load on their own. Add the ElevenLabs key as a network secret for `api.elevenlabs.io` (header `xi-api-key`) in the environment's settings |
| Codex, Cursor, Gemini CLI and other agents that read `AGENTS.md` | Open the cloned folder. `AGENTS.md` is read automatically. Skills are plain Markdown at `.claude/skills/<name>/SKILL.md`; the brief tells the agent when to read which |
| An agent with no repository access | Give it the archive of the repository and the brief below |

## Brief to paste into another agent

```text
You are working in the LearnCraft-Learnalytics repository: explanations of analytics concepts,
built from whatever explains the concept best (diagrams, animation, charts, tables, 3D, video,
narration, sound, interaction), combined freely.

1. Read AGENTS.md in full before doing anything. It sets the working agreement, the commands
   and what is installed. docs/STACK.md gives the reason for each installed part.
2. Run: npm install, then npm run typecheck.
3. Do not build yet. First agree a specification with the owner: audience, points covered,
   script step by step, modules and their form, content and data, visual direction, outputs.
4. There is no house visual style and no fixed format or tool list. Take the look from the
   agreed specification, not from another repository, an earlier piece or a skill's default.
5. Use the skills in .claude/skills/ that AGENTS.md names; each is a Markdown file at
   .claude/skills/<name>/SKILL.md.
6. Before reporting done on a web page: npm run typecheck, npm run build -- <slug>,
   npm run check -- <slug>, and look at the screenshots in .check/.
7. Say what you checked and what you did not.

Topic: <state the concept, the audience and any source data>
```

## Narration on another setup

| Setup | How |
| --- | --- |
| Local shell | `export ELEVENLABS_API_KEY=...` in the shell, then `npm run voice -- <slug>` |
| Claude cloud environment | Save the key as a network secret for `api.elevenlabs.io`; the script runs without the variable |
| Claude session with the ElevenLabs connector | Generate the clip in the session with the voice and model in `voice.config.json`, save it to `explainers/<slug>/audio/<id>.mp3` |

## Keeping setups in step

- The repository is the single source. Pull before starting work; push through a pull request.
- Skill updates follow `.claude/third-party/README.md`.
- A tool added to the project is recorded in `docs/STACK.md` and `AGENTS.md` in the same commit.
