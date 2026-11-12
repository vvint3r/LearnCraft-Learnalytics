import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollyStep {
  /** Short heading for the step. */
  title: string
  body: ReactNode
}

export interface ScrollyProps {
  steps: ScrollyStep[]
  /** Renders the pinned figure for the active step. */
  figure: (active: number) => ReactNode
  className?: string
  /** Classes for each step. The active step carries `data-active` and `aria-current="step"`. */
  stepClassName?: string
}

/**
 * Scroll-driven steps beside a pinned figure. The text scrolls; the figure stays in
 * view and changes with the step nearest the middle of the viewport. On narrow
 * screens the figure pins to the top and the steps pass beneath it.
 *
 * Layout and behaviour only. It carries no visual style: style the steps through
 * `stepClassName` and the `data-active` attribute.
 */
export function Scrolly({ steps, figure, className, stepClassName }: ScrollyProps) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [steps.length])

  return (
    <div className={cn('relative grid gap-x-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]', className)}>
      <div className="sticky top-0 z-10 self-start bg-background py-4 lg:order-2 lg:top-[12vh] lg:py-0">
        {figure(active)}
      </div>
      <ol className="m-0 list-none p-0 lg:order-1">
        {steps.map((step, i) => (
          <li
            key={step.title}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-step={i}
            data-active={i === active ? '' : undefined}
            aria-current={i === active ? 'step' : undefined}
            className={cn('flex min-h-[70vh] flex-col justify-center gap-3 py-10', stepClassName)}
          >
            <h3>{step.title}</h3>
            <div>{step.body}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
