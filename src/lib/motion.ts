import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useEffect, useState } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const query = '(prefers-reduced-motion: reduce)'

/** True when the reader has asked for reduced motion. Safe to call outside React. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

/** Reactive form of prefersReducedMotion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

export { gsap, ScrollTrigger, useGSAP }
