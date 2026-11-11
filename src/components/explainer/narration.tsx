import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NarrationProps {
  /** URL of the clip. Import the MP3 from the explainer's audio folder so the build inlines it. */
  src: string
  /** What the clip covers, for the button label. */
  label?: string
  className?: string
}

/** A play control for one narration clip. Audio starts only when the reader asks for it. */
export function Narration({ src, label = 'Listen to this section', className }: NarrationProps) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = audio.current
    if (!el) return
    const on = () => setPlaying(true)
    const off = () => setPlaying(false)
    el.addEventListener('play', on)
    el.addEventListener('pause', off)
    el.addEventListener('ended', off)
    return () => {
      el.removeEventListener('play', on)
      el.removeEventListener('pause', off)
      el.removeEventListener('ended', off)
    }
  }, [])

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className={cn(
          'inline-flex h-11 items-center gap-2 rounded-full border-[1.5px] border-ink bg-surface px-5 text-sm font-extrabold transition-colors hover:bg-brand-hover',
          className,
        )}
      >
        {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
        {playing ? 'Pause' : label}
      </button>
      <audio ref={audio} src={src} preload="none" />
    </>
  )
}
