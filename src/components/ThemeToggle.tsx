'use client'

import { useSyncExternalStore } from 'react'

import { MoonIcon, SunIcon } from './icons'

type Theme = 'light' | 'dark'

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

export function ThemeToggle({ className = 'icon-btn' }: { className?: string }) {
  // The server can't know the theme; React swaps to the real value right after hydration.
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light' as Theme)
  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next
        try {
          localStorage.setItem('theme', next)
        } catch {
          // private mode: the choice just won't persist
        }
      }}
      className={className}
      aria-label={next === 'dark' ? 'Activar modo oscuro' : 'Activar modo claro'}
      title={next === 'dark' ? 'Modo oscuro' : 'Modo claro'}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
