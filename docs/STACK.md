# Stack

What is installed, the version installed on 11 November 2026, and the reason for it. This is an
inventory, not a limit: a piece adds any maintained framework, library or tool it needs, and the
addition is recorded here. No visual style is part of the stack.

## Build and styling

| Part | Version | Reason |
| --- | --- | --- |
| Vite | 8.3.8 | Fast builds; one configuration serves every explainer |
| React | 19.3.1 | Required by shadcn/ui, Base UI, Magic UI, Aceternity UI and the other component libraries in use |
| TypeScript | 7.0.2 | Type-checks explainer code and imported components |
| `vite-plugin-singlefile` | 2.3.4 | Inlines script, style, fonts and audio so a page is one file that opens offline and publishes anywhere |
| Tailwind CSS | 4.3.5 | The styling layer shadcn/ui, Magic UI and Aceternity UI are written for |

## Components

| Part | Version | Role | Reason |
| --- | --- | --- | --- |
| shadcn/ui | 4.23.0 | Controls: tabs, slider, popover, drawer, table, accordion, toggle group | Components arrive as source and can be edited |
| Base UI | 1.9.0 | Behaviour layer under shadcn/ui | Maintained, accessible; its Drawer replaces Vaul, which is unmaintained |
| Magic UI | registry | Reading progress, text reveal, beam between nodes, number ticker, blur fade | Free, installed through the shadcn CLI |
| Aceternity UI | registry, free set | Pinned scroll reveal, tracing beam | Free, installed through the shadcn CLI |
| NumberFlow | 0.6.2 | Figures that change | Animates digits, formats through `Intl.NumberFormat`, honours reduced motion |
| lucide-react | 1.72.0 | Icons | shadcn/ui's icon set |

Installed from Magic UI: `animated-beam`, `blur-fade`, `number-ticker`, `scroll-progress`,
`text-reveal`. From Aceternity UI: `sticky-scroll-reveal`, `tracing-beam`. All are installed as
source in their library's stock look. `src/styles/base.css` holds the unmodified shadcn/ui
"neutral" variables these components read; it is not a project palette.

## Charts

| Part | Version | Use |
| --- | --- | --- |
| ECharts | 6.1.0 | Bar, line, scatter, pie, funnel, heatmap, Sankey, through `Chart`; animates between data states and between chart types |
| D3 | 7.9.2 | Scales, shapes and layouts for hand-drawn figures, where each mark needs individual control |

The `Chart` component uses the SVG renderer, registers only the chart types listed above, redraws
when the page switches between light and dark and draws without animation under reduced motion.
It sets no colours or type: pass a `theme` object for a piece's palette. To use another chart
type, register it in `src/components/explainer/chart.tsx`.

## Motion

| Part | Version | Use |
| --- | --- | --- |
| GSAP with ScrollTrigger | 3.15.1 | Scroll-linked sequences, pinned sections, timelines, SVG drawing. All plugins are free |
| `@gsap/react` | 2.1.2 | `useGSAP`, which scopes and cleans up animations in React |
| Motion | 14.12.0 | Springs, layout and enter/exit animation inside imported components |
| CSS transitions | | Simple state changes |

## Voice

**Decision: ElevenLabs, voice "Bella - Professional, Bright, Warm", model `eleven_v4`.**

| Aspect | Value | Reason |
| --- | --- | --- |
| Voice | Bella, id `hpp4J3VqNfWAUOO0d1Us` | Listed for educational use: standard American accent, crisp diction, a deliberate pace suited to long-form listening |
| Voice type | ElevenLabs premade | Stays available; a community library voice can be withdrawn by its owner mid-series |
| Model | `eleven_v4` | The provider's current default for speech; accepts delivery tags such as `[pause]` |
| Format | MP3, 44.1 kHz, 128 kbps | A 14-second clip is about 240 kB |
| Verified | One 13.8-second clip generated through the ElevenLabs connector on 11 November 2026. The clip is not kept in the repository | |

`eleven_v4` was confirmed through the ElevenLabs connector. If the public API rejects that model
id for `npm run voice`, set `model_id` in `voice.config.json` to `eleven_v3` or
`eleven_multilingual_v2`.

## Skills

31 skills and 3 review agents are installed under `.claude/`. `.claude/third-party/README.md`
lists each source, commit, licence and change.

| Source | Skills | Covers |
| --- | --- | --- |
| nicobailon/visual-explainer | 1 | Structure of an explanation; narrated video |
| cathrynlavery/diagram-design | 1 | Diagram forms and layout |
| greensock/gsap-skills | 8 | GSAP API |
| syntagmatic/d3-power-tools | 12, plus 3 agents | Chart design, forms, legibility, accessibility, interaction, review |
| openai/plugins | 1 | Choosing and critiquing visualizations |
| emilkowalski/skills | 8 | Motion decisions; library selection |

## Paid tiers

None is in use. A paid plan is decided with the owner case by case. Assessment of each as of
11 November 2026:

| Tier | Price | Assessment |
| --- | --- | --- |
| Aceternity UI All-Access | $169 for one year, $199 lifetime | The paid blocks are marketing sections |
| Magic UI Pro | $199 lifetime | Landing-page templates only |
| 21st.dev Builder | $6 a month billed yearly | The free limit is two component copies a day |

## Excluded

| Library | Reason |
| --- | --- |
| Vaul | Its repository states it is unmaintained. The Base UI drawer replaces it |
