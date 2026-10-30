'use client'

import { useRef, useState } from 'react'

import { SearchIcon } from './icons'

/** Search icon that expands into an input; submits to the homepage as `?q=`. */
export function SearchToggle({ initial }: { initial?: string }) {
  const [open, setOpen] = useState(Boolean(initial))
  const input = useRef<HTMLInputElement>(null)

  return (
    <form action="/" className="flex items-center" role="search">
      <input
        ref={input}
        name="q"
        type="search"
        defaultValue={initial}
        placeholder="Buscar galerías"
        aria-label="Buscar galerías"
        className={`border-b border-line bg-transparent text-sm outline-none transition-all duration-300 focus:border-ink ${open ? 'w-44 px-1 py-1.5 opacity-100 md:w-60' : 'pointer-events-none w-0 opacity-0'}`}
        tabIndex={open ? undefined : -1}
      />
      <button
        type="submit"
        onClick={(event) => {
          // First click only reveals the input; the type must not flip mid-click or the form submits empty.
          if (open && input.current?.value.trim()) return
          event.preventDefault()
          setOpen(true)
          input.current?.focus()
        }}
        className="icon-btn"
        aria-label="Buscar"
      >
        <SearchIcon />
      </button>
    </form>
  )
}
