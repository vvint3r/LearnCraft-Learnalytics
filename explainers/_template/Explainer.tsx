import { ExplainerPage, Section } from '@/components/explainer'

/**
 * Starting point for a new explainer. Read AGENTS.md before filling it in.
 * explainers/starter/ shows every layer of the stack in use: a pinned figure with
 * scroll steps, figures that change, a themed chart with controls, in-place
 * definitions, a table, and narration.
 */
export default function Explainer() {
  return (
    <ExplainerPage
      eyebrow="Analytics explained"
      title="__TITLE__"
      lead="State the question this page answers, in one or two sentences."
    >
      <Section
        id="first"
        eyebrow="Part 01 /"
        title="The first claim"
        lead="Each section makes one claim and shows it with one figure."
      >
        <p className="max-w-[65ch]">Replace this with the section's figure and text.</p>
      </Section>
    </ExplainerPage>
  )
}
