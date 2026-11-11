import { useEffect, useRef, useState } from 'react'
import { Figure, Stat } from '@/components/explainer'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/motion'
import { journey } from './attribution'

// Two layouts, so labels stay legible on a phone: the SVG scales with its container.
const WIDE = { x: [70, 200, 330, 460], conversion: 590, width: 660, height: 200, y: 104, r: 46, name: 17, note: 14 }
const NARROW = { x: [46, 136, 226, 316], conversion: 398, width: 452, height: 210, y: 112, r: 36, name: 16, note: 14 }

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setNarrow(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return narrow
}

export interface JourneyFigureProps {
  /** Credit share per touchpoint, or null to show the journey before any model is applied. */
  credits: number[] | null
  caption: string
  /** Draw the journey in on first view. Use on one figure per page. */
  drawIn?: boolean
}

/**
 * The journey as a line of touchpoints ending in a conversion. Each touchpoint's
 * disc has an area proportional to its credit, and the same value is printed below.
 */
export function JourneyFigure({ credits, caption, drawIn = false }: JourneyFigureProps) {
  const root = useRef<HTMLDivElement>(null)
  const narrow = useNarrow()
  const L = narrow ? NARROW : WIDE

  // The page's one orchestrated moment: the journey draws itself once, on first view.
  useGSAP(
    () => {
      if (!drawIn || prefersReducedMotion()) return
      const line = root.current!.querySelector<SVGPathElement>('[data-line]')!
      const length = line.getTotalLength()
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        .fromTo(line, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
        .from('[data-node]', { opacity: 0, y: 10, duration: 0.4, stagger: 0.12, ease: 'power2.out' }, 0.15)
    },
    { scope: root, dependencies: [drawIn] },
  )

  const max = credits ? Math.max(...credits) : 0
  const leaders = credits ? credits.filter((c) => c === max).length : 0

  return (
    <div ref={root}>
      <Figure caption={caption}>
        <svg viewBox={`0 0 ${L.width} ${L.height}`} className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label={caption}>
          <path data-line d={`M${L.x[0]} ${L.y} H${L.conversion}`} fill="none" stroke="var(--ink)" strokeWidth="2" />
          {journey.map((point, i) => (
            <g key={point.channel} data-node transform={`translate(${L.x[i]} ${L.y})`}>
              <circle
                r={L.r}
                fill="var(--brand-tint)"
                stroke="var(--brand)"
                strokeWidth="1.5"
                style={{
                  transform: `scale(${credits ? Math.sqrt(credits[i]) : 0})`,
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              <circle r="6" fill="var(--ink)" />
              <text y={-L.r - (narrow ? 30 : 12)} textAnchor="middle" fill="var(--ink)" fontSize={L.name} fontWeight="800">
                {narrow
                  ? point.channel.split(' ').map((word, line) => (
                      <tspan key={word} x="0" dy={line === 0 ? 0 : L.name + 2}>
                        {word}
                      </tspan>
                    ))
                  : point.channel}
              </text>
              <text y={L.r + 28} textAnchor="middle" fill="var(--ink)" fontSize={L.note}>
                {point.daysBefore === 0 ? 'Same day' : `${point.daysBefore} days${narrow ? '' : ' before'}`}
              </text>
            </g>
          ))}
          <g data-node transform={`translate(${L.conversion} ${L.y})`}>
            <rect x="-11" y="-11" width="22" height="22" rx="4" fill="var(--ink)" transform="rotate(45)" />
            <text y={-L.r - 12} textAnchor="middle" fill="var(--ink)" fontSize={L.name} fontWeight="800">
              Conversion
            </text>
          </g>
        </svg>
        {credits && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {journey.map((point, i) => (
              <Stat
                key={point.channel}
                label={point.channel}
                value={credits[i]}
                format={{ style: 'percent', maximumFractionDigits: 0 }}
                emphasis={credits[i] === max && leaders < credits.length}
              />
            ))}
          </div>
        )}
      </Figure>
    </div>
  )
}
