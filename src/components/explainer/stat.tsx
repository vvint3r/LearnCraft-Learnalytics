import NumberFlow, { type Format } from '@number-flow/react'
import { cn } from '@/lib/utils'

export interface StatProps {
  label: string
  value: number
  /** Intl.NumberFormat options, for example { style: 'percent' }. */
  format?: Format
  suffix?: string
  /** Marks the figure the current step is about. */
  emphasis?: boolean
  className?: string
}

/** A labelled figure whose digits roll when the value changes. */
export function Stat({ label, value, format, suffix, emphasis, className }: StatProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-xl border border-hairline bg-surface p-4 transition-shadow duration-300',
        emphasis && 'shadow-[5px_5px_0_var(--brand)]',
        className,
      )}
    >
      <span className="text-[11px] leading-snug font-extrabold tracking-[0.06em] uppercase">{label}</span>
      <NumberFlow value={value} format={format} suffix={suffix} className="text-3xl leading-none font-black" />
    </div>
  )
}
