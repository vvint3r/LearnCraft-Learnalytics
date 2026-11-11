import { useMemo, useState } from 'react'
import { Chart, ExplainerPage, Figure, Narration, Scrolly, Section } from '@/components/explainer'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { credit, journey, models, type ModelId } from './attribution'
import { JourneyFigure } from './JourneyFigure'
import intro from './audio/intro.mp3'

const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 0 })

/** An inline term with its definition one tap away. */
function Term({ term, children }: { term: string; children: string }) {
  return (
    <Popover>
      <PopoverTrigger className="cursor-help font-bold underline decoration-brand decoration-2 underline-offset-4">
        {term}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle className="capitalize">{term}</PopoverTitle>
          <PopoverDescription>{children}</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

export default function Explainer() {
  const [model, setModel] = useState<ModelId>('linear')
  const [halfLife, setHalfLife] = useState(7)
  const selected = models.find((m) => m.id === model)!
  const shares = useMemo(() => credit(model, journey, halfLife), [model, halfLife])

  const option = useMemo(
    () => ({
      grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
      xAxis: { type: 'category', data: journey.map((p) => p.channel) },
      yAxis: { type: 'value', max: 1, axisLabel: { formatter: (v: number) => percent.format(v) } },
      tooltip: { trigger: 'axis', valueFormatter: (v: number) => percent.format(v) },
      series: [{ type: 'bar', name: 'Credit', data: shares, barMaxWidth: 72 }],
    }),
    [shares],
  )

  return (
    <ExplainerPage
      eyebrow="Analytics explained"
      title="Attribution models"
      lead="When a customer converts after several touchpoints, which of them gets the credit? Follow one journey through five models and watch the credit move."
      actions={<Narration src={intro} label="Listen to the introduction" />}
    >
      <Section
        id="journey"
        eyebrow="Part 01 /"
        title="One journey, four touchpoints"
        lead={
          <>
            A <Term term="touchpoint">Any recorded interaction between a customer and a channel before a conversion.</Term>{' '}
            is each contact a customer has with a channel on the way to a{' '}
            <Term term="conversion">The outcome being measured, such as a purchase or a sign-up.</Term>. This customer met
            four of them over twelve days. The journey is illustrative.
          </>
        }
      >
        <JourneyFigure drawIn credits={null} caption="An illustrative journey: four touchpoints over twelve days, ending in one conversion." />
      </Section>

      <Section
        id="models"
        eyebrow="Part 02 /"
        title="Five rules for sharing the credit"
        lead="An attribution model is a rule that divides one conversion among the touchpoints before it. The journey stays the same. Only the rule changes."
      >
        <Scrolly
          steps={models.map((m) => ({
            title: m.name,
            body: <p>{m.id === 'decay' ? `${m.rule} Here the half-life is seven days.` : m.rule}</p>,
          }))}
          figure={(active) => (
            <JourneyFigure
              credits={credit(models[active].id, journey)}
              caption={`${models[active].name}: disc area and the figures below show each touchpoint's share of the conversion.`}
            />
          )}
        />
      </Section>

      <Section
        id="compare"
        eyebrow="Part 03 /"
        title="Compare the models"
        lead="Choose a model to see how it divides the same conversion. Time decay takes one setting, the half-life, which you can change."
      >
        <Tabs value={model} onValueChange={(value) => setModel(value as ModelId)}>
          <TabsList className="h-auto flex-wrap">
            {models.map((m) => (
              <TabsTrigger key={m.id} value={m.id} className="px-4 py-2 text-sm font-bold">
                {m.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Figure caption={`${selected.name}. ${selected.rule}`}>
          <Chart
            option={option}
            label={`${selected.name} credit by channel: ${journey.map((p, i) => `${p.channel} ${percent.format(shares[i])}`).join(', ')}.`}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6" aria-disabled={model !== 'decay'}>
            <label id="half-life-label" className="shrink-0 text-sm font-extrabold">
              Half-life: {halfLife} {halfLife === 1 ? 'day' : 'days'}
            </label>
            <Slider
              aria-labelledby="half-life-label"
              min={1}
              max={14}
              step={1}
              value={halfLife}
              disabled={model !== 'decay'}
              onValueChange={(value) => setHalfLife(Array.isArray(value) ? value[0] : value)}
            />
          </div>
        </Figure>
      </Section>

      <Section
        id="table"
        eyebrow="Part 04 /"
        title="The same conversion, five answers"
        lead="Each row divides one conversion. Paid social is worth everything under first touch and nothing under last touch; the journey did not change between them."
      >
        <div className="overflow-x-auto rounded-2xl bg-surface shadow-elev-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-extrabold">Model</TableHead>
                {journey.map((p) => (
                  <TableHead key={p.channel} className="text-right font-extrabold">
                    {p.channel}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-bold">{m.id === 'decay' ? `${m.name} (7-day half-life)` : m.name}</TableCell>
                  {credit(m.id, journey).map((share, i) => (
                    <TableCell key={journey[i].channel} className="text-right tabular-nums">
                      {percent.format(share)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>
    </ExplainerPage>
  )
}
