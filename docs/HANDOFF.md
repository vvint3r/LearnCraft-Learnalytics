# Handoff

How to put another agent, or another machine, on this stack.

## What carries the setup

| Item | Where | Carries |
| --- | --- | --- |
| The repository | `github.com/vvint3r/LearnCraft-Learnalytics` | Build project, design tokens, components, scripts, the reference explainer, 31 skills, 3 review agents |
| `AGENTS.md` | Repository root | The working brief every agent reads first |
| `voice.config.json` | Repository root | The narration voice and model |
| An ElevenLabs API key | Supplied per environment, never committed | Narration through `npm run voice` |

Everything except the API key is in the repository. An agent with the repository has the stack.

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
npm run build
npm run check
```

All three check lines for `starter` should read `ok`.

## Setup by agent type

| Agent | Steps |
| --- | --- |
| Claude Code, local | Open the cloned folder. `CLAUDE.md`, the skills and the review agents load on their own |
| Claude Code, cloud | Start a session with this repository selected. Skills load on their own. Add the ElevenLabs key as a network secret for `api.elevenlabs.io` (header `xi-api-key`) in the environment's settings |
| Codex, Cursor, Gemini CLI and other agents that read `AGENTS.md` | Open the cloned folder. `AGENTS.md` is read automatically. Skills are plain Markdown at `.claude/skills/<name>/SKILL.md`; the brief tells the agent when to read which |
| An agent with no repository access | Give it the archive of the repository and the brief below |

## Brief to paste into another agent

```text
You are working in the LearnCraft-Learnalytics repository: scroll-driven, animated explainers
for analytics concepts, each built to one self-contained HTML file.

1. Read AGENTS.md in full before doing anything. It sets the commands, the stack, the workflow
   and the rules. docs/STACK.md gives the reason for each choice.
2. Run: npm install, then npm run build, then npm run check. Confirm the starter explainer
   passes before changing anything.
3. Study explainers/starter/ as the reference for structure, figures, motion and narration.
4. To build a new explainer: npm run new -- <slug> "Title", then follow "Building an explainer"
   in AGENTS.md. Use the skills in .claude/skills/ that AGENTS.md names for each step; each is a
   Markdown file at .claude/skills/<name>/SKILL.md.
5. Use only the stack in AGENTS.md. Styling comes from src/styles/theme.css. Do not add a second
   chart, motion or component foundation library.
6. Before reporting done: npm run typecheck, npm run build -- <slug>, npm run check -- <slug>,
   and look at the screenshots in .check/.
7. Deliver dist/<slug>.html and say what you checked and what you did not.

Topic for this explainer: <state the concept, the audience and any source data>
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
- A change to the stack is recorded in `docs/STACK.md` and `AGENTS.md` in the same commit.
