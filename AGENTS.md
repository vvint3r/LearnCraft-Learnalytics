# LearnCraft-Learnalytics

Explanations of analytics concepts. A piece uses whatever explains its concept best: diagrams,
animation, charts, tables, 3D, video, narration, sound and interaction, combined freely in one
piece. There is no fixed format and no house visual style.

This file is the working brief for any agent in this repository. `docs/STACK.md` lists what is
installed and why.

## Working agreement

1. **Specification before build.** Nothing is produced until the owner has agreed, for that piece:
   the audience, the points covered, the script step by step, the modules to be made and their
   form, the content and data used, the visual direction, and the outputs.
2. **No fixed format.** Forms combine: an animation can hold a chart and a table; a film, an
   interactive page and a set of clips can come from the same scenes. Do not frame the work as a
   choice between formats.
3. **No fixed tool list.** Use any framework, library or tool the piece needs. `docs/STACK.md` is
   an inventory, not a limit. Unmaintained tools are excluded. A paid plan is raised with the owner
   case by case.
4. **No inherited design system.** The look of a piece (palette, type, layout, motion) is defined
   in its specification. Nothing is carried over from another repository, an earlier piece or a
   skill's default skin.
5. **Voice and audio come from ElevenLabs**, on the owner's account.
6. **Every figure is computed or sourced.** Compute it in code from a stated definition, or cite
   the source. Label illustrative data as illustrative. State what was verified and what was not.

## Commands

| Command | Does |
| --- | --- |
| `npm install` | Installs dependencies. Run once after cloning |
| `npm run new -- <slug> "Title"` | Creates `explainers/<slug>/` from the empty scaffold |
| `npm run dev -- <slug>` | Development server for one piece |
| `npm run build` / `npm run build -- <slug>` | Builds to `dist/<slug>.html`, one file, nothing external |
| `npm run check` / `npm run check -- <slug>` | Opens each built page in a headless browser at desktop and phone width, light and dark, and with reduced motion; fails on a script error, a network request, sideways scroll, a missing title or a wrong `<h1>` count; screenshots go to `.check/` |
| `npm run typecheck` | TypeScript check |
| `npm run voice -- <slug>` | Generates narration clips from `explainers/<slug>/narration.json` |

The build and check scripts cover web-page output. A piece with other outputs (rendered video,
audio mix) adds the scripts it needs.

`npm run check` needs Playwright with Chromium. Claude cloud sessions have it. Elsewhere:
`npm install --no-save playwright && npx playwright install chromium`.

## Where things live

| Path | Contents |
| --- | --- |
| `explainers/<slug>/` | One piece: `index.html`, `main.tsx`, its scenes, data and stylesheet, `narration.json`, `audio/` |
| `explainers/_template/` | What `npm run new` copies: an empty page with no layout or style |
| `src/styles/base.css` | Tailwind and the unmodified shadcn/ui neutral variables, so imported components render. Not a visual direction |
| `src/components/explainer/` | Behaviour-only helpers: `Scrolly` (pinned figure with scroll steps), `Chart` (ECharts wrapper), `Narration` (audio control). None sets a look |
| `src/components/ui/` | Components added as source from shadcn/ui, Magic UI and Aceternity UI, in their libraries' stock look. Edit freely |
| `src/lib/` | `motion.ts` (GSAP, ScrollTrigger, reduced-motion helpers), `theme.ts` (light or dark, CSS variable lookup) |
| `scripts/` | Build, dev, scaffold, check and voice scripts |
| `voice.config.json` | The narration voice and model |
| `.claude/skills/`, `.claude/agents/`, `.claude/vendor/` | Third-party skills, copied in at reviewed commits. `.claude/third-party/README.md` lists sources, licences and changes |
| `dist/`, `.check/` | Build output and check screenshots. Not committed |

## Installed tools

| Purpose | Installed | How |
| --- | --- | --- |
| Build | Vite, React, TypeScript, `vite-plugin-singlefile` | `npm run build` |
| Styling | Tailwind 4 | Utility classes, or a piece's own stylesheet |
| Controls | shadcn/ui on Base UI | `npx shadcn@latest add <name>` |
| Designed components | Magic UI, Aceternity UI registries | `npx shadcn@latest add @magicui/<name>` or `@aceternity/<name>` |
| Animated numbers | NumberFlow | `@number-flow/react` |
| Charts | ECharts; D3 | `Chart` in `@/components/explainer`; D3 modules for scales, shapes and layouts |
| Motion | GSAP with ScrollTrigger; Motion | Import GSAP from `@/lib/motion` |
| Voice | ElevenLabs | `npm run voice`, `Narration` |

Anything else a piece needs is added when it is needed and recorded in `docs/STACK.md`. Vaul is
excluded: its repository states it is unmaintained.

## Skills

| Need | Skill |
| --- | --- |
| Which chart or figure fits; critique a page | `visualization-strategy-and-critique` |
| Structure of an explanation; narrated video | `visual-explainer` |
| Diagram forms and layout | `diagram-design` |
| Chart design, forms, legibility, accessibility, interaction, review | `d3-design`, `d3-patterns`, `d3-legibility`, `d3-accessibility`, `d3-interaction`, `d3-review`, and the other `d3-*` skills |
| Whether and how to animate; sequencing several elements | `animate`, `choreograph`, `d3-motion` |
| Find or remove motion; review it; performance; naming an effect | `find-animation-opportunities`, `remove-animations`, `review-animations`, `animation-performance`, `animation-vocabulary` |
| GSAP API: timelines, ScrollTrigger, plugins, React usage, performance | `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-react`, `gsap-performance`, `gsap-utils`, `gsap-frameworks` |
| Which library for a task | `pick-ui-library` (runs when invoked by name) |

Skills supply method. A skill's own palette, typeface or library list is that skill's default,
not this project's: the piece's specification decides.

Agents on tools other than Claude Code can read the same skills as plain Markdown: each is
`.claude/skills/<name>/SKILL.md`.

## Voice

`voice.config.json` sets the narrator: ElevenLabs, voice "Bella - Professional, Bright, Warm",
model `eleven_v4`. Change it in that file only.

- Script: `explainers/<slug>/narration.json`.
- Generate: `npm run voice -- <slug>`. It needs `ELEVENLABS_API_KEY`, or an environment that
  injects the key for `api.elevenlabs.io`. Only new or changed clips are generated.
- With the ElevenLabs connector in a Claude session, a clip can also be generated there with the
  same voice and model and saved to `explainers/<slug>/audio/<id>.mp3`.
- Never put an API key in a file, a commit or a chat message.

## Working in this repository

- Work on a branch and open a pull request. Commit when a change is complete and checked.
- Run typecheck, build and check before committing a change to a piece or to `src/`.
- Third-party skills change only by the update procedure in `.claude/third-party/README.md`.
- Report outcomes plainly: what was built, what was checked, what was not.
