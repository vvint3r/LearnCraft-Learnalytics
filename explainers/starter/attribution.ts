/**
 * Attribution arithmetic for the starter explainer. Every figure on the page is
 * computed here from the model definitions; none is typed in by hand.
 */

export interface Touchpoint {
  channel: string
  /** Days between this touchpoint and the conversion. */
  daysBefore: number
}

/** An illustrative journey: four touchpoints, in order, ending in one conversion. */
export const journey: Touchpoint[] = [
  { channel: 'Paid social', daysBefore: 12 },
  { channel: 'Organic search', daysBefore: 7 },
  { channel: 'Email', daysBefore: 3 },
  { channel: 'Direct', daysBefore: 0 },
]

export type ModelId = 'first' | 'last' | 'linear' | 'position' | 'decay'

export interface Model {
  id: ModelId
  name: string
  /** The rule, in one sentence. */
  rule: string
}

export const models: Model[] = [
  { id: 'first', name: 'First touch', rule: 'All credit goes to the touchpoint that started the journey.' },
  { id: 'last', name: 'Last touch', rule: 'All credit goes to the touchpoint just before the conversion.' },
  { id: 'linear', name: 'Linear', rule: 'Every touchpoint gets an equal share.' },
  {
    id: 'position',
    name: 'Position-based',
    rule: 'The first and last touchpoints get 40% each; the rest split the remaining 20%.',
  },
  {
    id: 'decay',
    name: 'Time decay',
    rule: 'Credit halves for every half-life that separates a touchpoint from the conversion.',
  },
]

/** Share of one conversion credited to each touchpoint. The shares sum to 1. */
export function credit(model: ModelId, points: Touchpoint[], halfLifeDays = 7): number[] {
  const n = points.length
  switch (model) {
    case 'first':
      return points.map((_, i) => (i === 0 ? 1 : 0))
    case 'last':
      return points.map((_, i) => (i === n - 1 ? 1 : 0))
    case 'linear':
      return points.map(() => 1 / n)
    case 'position': {
      if (n === 1) return [1]
      if (n === 2) return [0.5, 0.5]
      const middle = 0.2 / (n - 2)
      return points.map((_, i) => (i === 0 || i === n - 1 ? 0.4 : middle))
    }
    case 'decay': {
      const weights = points.map((p) => 2 ** (-p.daysBefore / halfLifeDays))
      const total = weights.reduce((a, b) => a + b, 0)
      return weights.map((w) => w / total)
    }
  }
}
