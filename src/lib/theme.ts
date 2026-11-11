import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function current(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * The active theme. Each explainer's index.html sets the `dark` class on <html>
 * from the `data-theme` attribute, or from the system setting when it is absent.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(current)
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(current()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return theme
}

/** Resolved value of a CSS custom property on <html>, for libraries that need literal colours. */
export function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
