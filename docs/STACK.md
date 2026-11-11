# Stack

Each choice, the version installed on 11 November 2026, and the reason for it.

## Build and styling

| Part | Version | Reason |
| --- | --- | --- |
| Vite | 8.3.8 | Fast builds; one configuration serves every explainer |
| React | 19.3.1 | Required by shadcn/ui, Base UI, Magic UI, Aceternity UI and the other component libraries in use |
| TypeScript | 7.0.2 | Type-checks explainer code and imported components |
| `vite-plugin-singlefile` | 2.3.4 | Inlines script, style, fonts and audio so an explainer is one file that opens offline and publishes anywhere |
| Tailwind CSS | 4.3.5 | The styling layer shadcn/ui, Magic UI and Aceternity UI are written for |
| Nunito, JetBrains Mono | bundled | The design system's typefaces, inlined as variable fonts; Latin and Latin Extended only |

## Components

| Part | Version | Role | Reason |
| --- | --- | --- | --- |
| shadcn/ui | 4.23.0 | Controls: tabs, slider, popover, drawer, table, accordion, toggle group | Components arrive as source and take the project's tokens |
| Base UI | 1.9.0 | Behaviour layer under shadcn/ui | Maintained, accessible; its Drawer replaces Vaul, which is unmaintained |
| Magic UI | registry | Reading progress, text reveal, beam between nodes, number ticker, blur fade | Free, installed through the shadcn CLI, closest to explanation work |
| Aceternity UI | registry, free set | Pinned scroll reveal, tracing beam, and further scroll structures as needed | Free components cover the scroll-explainer format |
| NumberFlow | 0.6.2 | Figures that change | Animates digits, formats through `Intl.NumberFormat`, honours reduced motion |
| lucide-react | 1.72.0 | Icons | shadcn/ui's icon set |

Installed from Magic UI: `animated-beam`, `blur-fade`, `number-ticker`, `scroll-progress`,
`text-reveal`. From Aceternity UI: `sticky-scroll-reveal`, `tracing-beam`. Others are added when a
page needs them. The starter uses `scroll-progress`; the rest are installed as source and
still carry their library's default colours, to be set to the tokens on first use.

## Charts

**Decision: ECharts for quantitative charts, D3 for bespoke figures. Recharts is not used.**

| Part | Version | Use |
| --- | --- | --- |
| ECharts | 6.1.0 | Bar, line, scatter, pie, funnel, heatmap, Sankey, through `Chart` |
| D3 | 7.9.2 | Scales, shapes and layouts for hand-drawn SVG figures |

| Criterion | ECharts | Recharts (shadcn's default) | D3 alone |
| --- | --- | --- | --- |
| Animated transition between data states and between chart types | Both built in | Animates a series' own updates; no transition between chart types | Hand-written per chart |
| Chart types an analytics series needs (Sankey, funnel, heatmap) | All three included | Sankey and funnel; no heatmap | Hand-written |
| Theming from one token set, light and dark | One theme object, built from the tokens in `chart.tsx` | Per-component props | Hand-written |
| Consistency with the owner's reports, which use ECharts | Same library and option format | Different | Different |
| Full control over individual marks for choreographed diagrams | Limited | Limited | Complete |

ECharts wins on every criterion except mark-level control, which is why D3 sits beside it. The
`Chart` component uses the SVG renderer, registers only the chart types listed above, redraws on
theme change and draws without animation under reduced motion. To use another chart type,
register it in `src/components/explainer/chart.tsx`.

## Motion

| Part | Version | Use |
| --- | --- | --- |
| GSAP with ScrollTrigger | 3.15.1 | Scroll-linked sequences, pinned sections, timelines, SVG drawing. All plugins are free |
| `@gsap/react` | 2.1.2 | `useGSAP`, which scopes and cleans up animations in React |
| Motion | 14.12.0 | Springs, layout and enter/exit animation inside imported components |
| CSS transitions | | Simple state changes, such as a disc resizing when a value changes |

## Voice

**Decision: ElevenLabs, voice "Bella - Professional, Bright, Warm", model `eleven_v4`.**

| Aspect | Value | Reason |
| --- | --- | --- |
| Voice | Bella, id `hpp4J3VqNfWAUOO0d1Us` | Listed for educational use: standard American accent, crisp diction, a deliberate pace suited to long-form listening |
| Voice type | ElevenLabs premade | Stays available; a community library voice can be withdrawn by its owner mid-series |
| Model | `eleven_v4` | The provider's current default for speech; accepts delivery tags such as `[pause]` |
| Format | MP3, 44.1 kHz, 128 kbps | Small enough to inline: a 14-second clip is about 240 kB |
| Verified | One 13.8-second clip generated on 11 November 2026 and bundled in the starter explainer | |

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

None is in use. Position on each as of 11 November 2026:

| Tier | Price | Position |
| --- | --- | --- |
| Aceternity UI All-Access | $169 for one year, $199 lifetime | Hold. The free components cover scroll structures; the paid blocks are marketing sections |
| Magic UI Pro | $199 lifetime | Decline. Landing-page templates only |
| 21st.dev Builder | $6 a month billed yearly | Buy when the free limit of two component copies a day blocks work |

## Excluded

| Library | Reason |
| --- | --- |
| Vaul | Its repository states it is unmaintained. The Base UI drawer replaces it |
| Radix | Redundant with Base UI as the behaviour layer |
| Recharts | ECharts is the chart library |
