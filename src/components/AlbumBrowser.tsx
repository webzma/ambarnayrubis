'use client'

import { useState } from 'react'

import { albumCategories } from '@/lib/categories'

type Props = {
  /** Category of each album, in the same order as `children`. */
  categories: (string | null | undefined)[]
  children: React.ReactNode[]
}

/** Album grid with category filter chips (only categories that have albums). */
export function AlbumBrowser({ categories, children }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const available = albumCategories.filter((category) => categories.includes(category.value))

  const chip = (value: string | null, label: string) => (
    <button
      key={label}
      type="button"
      onClick={() => setActive(value)}
      aria-pressed={active === value}
      className={`rounded-full border px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
        active === value ? 'border-ink bg-ink text-paper' : 'border-line text-muted hover:border-ink hover:text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <>
      {available.length > 1 && (
        <div className="mb-14 flex flex-wrap justify-center gap-2">
          {chip(null, 'Todas')}
          {available.map((category) => chip(category.value, category.label))}
        </div>
      )}
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {children.map((child, i) =>
          active === null || categories[i] === active ? (
            <div key={i} className="animate-rise">
              {child}
            </div>
          ) : null,
        )}
      </div>
    </>
  )
}
