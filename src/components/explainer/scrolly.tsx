import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollyStep {
  /** Short heading for the step. */
  title: string
  body: ReactNode
}

export interface ScrollyProps {
  steps: ScrollyStep[]
  /** Renders the pinned figure for the active step. The figure must be complete at every step. */
  figure: (active: number) => ReactNode
  className?: string
}

/**
 * Scroll-driven steps beside a pinned figure. The text scrolls; the figure stays in
 * view and changes with the step nearest the middle of the viewport. On narrow
 * screens the figure pins to the top and the steps pass beneath it.
 */
export function Scrolly({ steps, figure, className }: ScrollyProps) {
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
      <div className="sticky top-0 z-10 -mx-4 self-start bg-background px-4 py-4 sm:-mx-8 sm:px-8 lg:order-2 lg:top-[12vh] lg:mx-0 lg:px-0 lg:py-0">
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
            aria-current={i === active ? 'step' : undefined}
            className="flex min-h-[70vh] flex-col justify-center py-10"
          >
            <div
              className={cn(
                'flex flex-col gap-3 border-l-4 py-2 pl-5 transition-[border-color] duration-300',
                i === active ? 'border-brand' : 'border-hairline',
              )}
            >
              <h3 className={cn('text-2xl leading-tight', i === active ? 'font-black' : 'font-semibold')}>{step.title}</h3>
              <div className="max-w-[48ch] text-lg leading-relaxed">{step.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
