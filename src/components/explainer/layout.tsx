import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ScrollProgress } from '@/components/ui/scroll-progress'

export interface ExplainerPageProps {
  /** Short label above the title, such as the series or topic area. */
  eyebrow?: string
  title: string
  /** One or two sentences stating what the page answers. */
  lead: ReactNode
  /** Controls shown under the lead, such as a narration button. */
  actions?: ReactNode
  children: ReactNode
}

/** Page frame: reading-progress bar, opening block, then the sections. */
export function ExplainerPage({ eyebrow, title, lead, actions, children }: ExplainerPageProps) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-32 sm:px-8">
      <ScrollProgress className="h-1 bg-brand bg-none" />
      <header className="flex min-h-[70vh] flex-col justify-center gap-6 py-20">
        <span aria-hidden className="h-1.5 w-16 bg-brand" />
        {eyebrow && <p className="text-sm font-extrabold tracking-[0.08em] uppercase">{eyebrow}</p>}
        <h1 className="max-w-[18ch] text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.05] font-black tracking-tight text-balance">
          {title}
        </h1>
        <p className="max-w-[60ch] text-[clamp(1.1rem,2.2vw,1.35rem)] leading-relaxed">{lead}</p>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </header>
      <main className="flex flex-col gap-32">{children}</main>
    </div>
  )
}

export interface SectionProps {
  id: string
  /** Section number or short label, shown above the title. */
  eyebrow?: string
  title: string
  lead?: ReactNode
  className?: string
  children: ReactNode
}

/** One step of the argument. Each section makes a single claim. */
export function Section({ id, eyebrow, title, lead, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('flex scroll-mt-12 flex-col gap-8', className)}>
      <div className="flex flex-col gap-2 border-b-4 border-ink pb-4">
        {eyebrow && <p className="text-lg font-light tracking-[0.04em] uppercase">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.15] font-black tracking-tight text-balance">
          {title}
        </h2>
      </div>
      {lead && <p className="max-w-[65ch] text-lg leading-relaxed">{lead}</p>}
      {children}
    </section>
  )
}

export interface FigureProps {
  /** States what the figure shows. Required: a figure never stands without one. */
  caption: ReactNode
  className?: string
  children: ReactNode
}

/** A framed figure with its caption. */
export function Figure({ caption, className, children }: FigureProps) {
  return (
    <figure className={cn('m-0 flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-elev-2 sm:p-7', className)}>
      {children}
      <figcaption className="border-t border-hairline pt-3 text-sm leading-relaxed">{caption}</figcaption>
    </figure>
  )
}
