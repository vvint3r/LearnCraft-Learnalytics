# LearnCraft-Learnalytics

Scroll-driven, animated explainers for analytics concepts. Each explainer builds to one
self-contained HTML file.

## Quick start

```bash
npm install
npm run dev -- starter
```

```bash
npm run build
npm run check
```

`dist/starter.html` is the built reference explainer, on attribution models.

## Start a new explainer

```bash
npm run new -- incrementality "Incrementality testing"
npm run dev -- incrementality
```

## Documents

| File | Contents |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Working brief: commands, layout, stack, workflow, rules, skills, voice |
| [docs/STACK.md](docs/STACK.md) | Each stack choice, its version and the reason for it |
| [docs/HANDOFF.md](docs/HANDOFF.md) | Setting up another agent or machine on this stack |
| [.claude/third-party/README.md](.claude/third-party/README.md) | Third-party skills: sources, commits, licences, changes |
