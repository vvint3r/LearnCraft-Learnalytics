# LearnCraft-Learnalytics

Scroll-driven, animated explainers for analytics concepts. Each explainer is a landing-page-style
page: the concept is explored as the reader scrolls, through text, diagrams, charts, data flows,
figures that change, animation and optional narration. Each one builds to a single self-contained
HTML file.

This file is the working brief for any agent in this repository. `docs/STACK.md` records why each
part of the stack was chosen.

## Commands

| Command | Does |
| --- | --- |
| `npm install` | Installs dependencies. Run once after cloning |
| `npm run new -- <slug> "Title"` | Creates `explainers/<slug>/` from the template |
| `npm run dev -- <slug>` | Development server for one explainer |
| `npm run build` / `npm run build -- <slug>` | Builds to `dist/<slug>.html`, one file, nothing external |
| `npm run check` / `npm run check -- <slug>` | Opens each built file in a headless browser at desktop and phone width, light and dark, and with reduced motion; fails on a script error, a network request, sideways scroll, a missing title or a wrong `<h1>` count; screenshots go to `.check/` |
| `npm run typecheck` | TypeScript check |
| `npm run voice -- <slug>` | Generates narration clips from `explainers/<slug>/narration.json` |

`npm run check` needs Playwright with Chromium. Claude cloud sessions have it. Elsewhere:
`npm install --no-save playwright && npx playwright install chromium`.

## Where things live

| Path | Contents |
| --- | --- |
| `explainers/<slug>/` | One explainer: `index.html`, `main.tsx`, `Explainer.tsx`, its data and figures, `narration.json`, `audio/` |
| `explainers/starter/` | Reference explainer (attribution models). Shows every layer of the stack in use |
| `explainers/_template/` | What `npm run new` copies |
| `src/styles/theme.css` | Design tokens: colours, radii, typefaces, light and dark. **The styling authority** |
| `src/components/explainer/` | Page parts written for this project: `ExplainerPage`, `Section`, `Figure`, `Scrolly`, `Stat`, `Chart`, `Narration` |
| `src/components/ui/` | Components added as source from shadcn/ui, Magic UI and Aceternity UI. Edit freely |
| `src/lib/` | `motion.ts` (GSAP, ScrollTrigger, reduced motion), `theme.ts` (active theme, token lookup) |
| `scripts/` | Build, dev, scaffold, check and voice scripts |
| `voice.config.json` | The narration voice and model |
| `.claude/skills/`, `.claude/agents/`, `.claude/vendor/` | Third-party skills, copied in at reviewed commits. `.claude/third-party/README.md` lists sources, licences and changes |
| `dist/`, `.check/` | Build output and check screenshots. Not committed |

## Stack

| Layer | Use | How |
| --- | --- | --- |
| Build | Vite, React, TypeScript, `vite-plugin-singlefile` | `npm run build` |
| Styling | Tailwind 4 with the tokens in `src/styles/theme.css` | Utility classes; token colours such as `bg-brand`, `text-ink`, `border-hairline` |
| Controls | shadcn/ui on Base UI | `npx shadcn@latest add <name>` |
| Scroll structure | `Scrolly`; Aceternity UI; GSAP ScrollTrigger | `npx shadcn@latest add @aceternity/<name>` |
| Animated emphasis | Magic UI | `npx shadcn@latest add @magicui/<name>` |
| Figures that change | NumberFlow | `Stat`, or `@number-flow/react` directly |
| Charts | ECharts | `Chart` in `@/components/explainer` |
| Bespoke figures | D3 modules and inline SVG | Draw the SVG in React; D3 for scales, shapes and layouts |
| Motion | GSAP for sequences and scroll; Motion inside imported components; CSS transitions for simple state changes | Import GSAP from `@/lib/motion` |
| Voice | ElevenLabs | `npm run voice`, `Narration` |
| Situational | RareUI (one opening moment), Beautiful UI (tables, insight cards), 21st.dev (search for a missing pattern), cmdk (search across explainers), Sonner (confirmations) | Add only when a page calls for it |

Not used: Vaul (unmaintained; the Base UI drawer replaces it), Radix (redundant with Base UI),
Recharts and other chart libraries (ECharts and D3 cover charts).

## Building an explainer

1. **Decide what to show.** State the question the page answers and the one claim of each section.
   Use `visualization-strategy-and-critique` to choose the form of each figure and `d3-design` to
   look at the data first.
2. **Scaffold.** `npm run new -- <slug> "Title"`, then `npm run dev -- <slug>`.
3. **Structure the page.** `ExplainerPage` and one `Section` per claim. Use `Scrolly` where a figure
   should stay in view while the text advances. `visual-explainer` covers explanation structure.
4. **Build the figures.** Diagrams: inline SVG, with `diagram-design` for the form. Charts: `Chart`
   with a plain ECharts option. Bespoke forms: the D3 skills. Changing numbers: `Stat`.
5. **Add motion last.** Decide with `animate` and `choreograph`, build with the GSAP skills, then
   prune with `remove-animations`.
6. **Narration, if wanted.** Write `narration.json`, run `npm run voice -- <slug>`, place a
   `Narration` control per clip.
7. **Check.** `npm run typecheck`, `npm run build -- <slug>`, `npm run check -- <slug>`. Look at the
   screenshots in `.check/`. Review charts with `d3-review` and motion with `review-animations`.
8. **Publish.** `dist/<slug>.html` is the deliverable. It opens offline and can be published as a
   Claude Artifact or hosted anywhere as a static file.

## Rules

1. **One claim per section, one figure per claim.** A figure is complete at rest and at every step.
2. **One orchestrated showpiece per page.** Everything else uses quiet reveals or stays still.
3. **Animate a correspondence.** Motion shows what changed into what. No motion for decoration.
4. **The reader controls pace.** Nothing autoplays. Audio starts only from a control. Scroll
   position or a control drives every sequence.
5. **Reduced motion.** Under `prefers-reduced-motion` figures draw in their final state. Check with
   `prefersReducedMotion()` or `useReducedMotion()` from `@/lib/motion`.
6. **Every number is computed or sourced.** Compute figures from definitions in code, as
   `explainers/starter/attribution.ts` does, or cite the source on the page. Label illustrative
   data as illustrative.
7. **Tokens only.** No literal colours in explainer code; use token classes or `var(--token)`.
   Text is ink on paper: no grey text and no lowered opacity; rank with weight. The brand green is
   for fills, rules and marks, never text. Radii come from the set 4, 6, 8, 12, 14, full.
8. **Restyle what you import.** A component from any library takes the tokens before it ships.
   Replace hard-coded colours, gradients and fonts in its source.
9. **Do not hand-build a solved component.** Use `pick-ui-library` when unsure which library fits.
10. **Meaning never rests on colour alone.** Pair colour with a label, position, size or shape.
    Every chart has a text alternative (`label` on `Chart`); every figure has a caption.
11. **Self-contained output.** No runtime network requests. Fonts, scripts, images and audio are
    bundled; import assets so the build inlines them.
12. **Phone first-class.** No sideways scroll at 390 px. Diagram labels stay legible: give a figure
    a narrow layout when scaling would shrink its text.

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

Where a skill's own palette, typeface, chart library or motion library differs from this file or
`src/styles/theme.css`, this project's choice wins. Several skills default to writing a standalone
HTML file; here their method is applied inside an explainer's React components.

Agents on tools other than Claude Code can read the same skills as plain Markdown: each is
`.claude/skills/<name>/SKILL.md`.

## Voice

`voice.config.json` sets the narrator: ElevenLabs, voice "Bella - Professional, Bright, Warm",
model `eleven_v4`. Keep one voice across the series; change it in that file only.

- Script: `explainers/<slug>/narration.json`, one clip per section, short sentences, plain
  punctuation. Narration states what the section shows; it does not read the page aloud.
- Generate: `npm run voice -- <slug>`. It needs `ELEVENLABS_API_KEY`, or an environment that
  injects the key for `api.elevenlabs.io`. Only new or changed clips are generated.
- With the ElevenLabs connector in a Claude session, a clip can also be generated there with the
  same voice and model and saved to `explainers/<slug>/audio/<id>.mp3`.
- Never put an API key in a file, a commit or a chat message.

## Working in this repository

- Work on a branch and open a pull request. Commit when a change is complete and checked.
- Run typecheck, build and check before committing a change to an explainer or to `src/`.
- Third-party skills change only by the update procedure in `.claude/third-party/README.md`.
- Report outcomes plainly: what was built, what was checked, what was not.
