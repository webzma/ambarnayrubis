import Link from 'next/link'

import { ChevronIcon } from './icons'

type Props = { page: number; totalPages: number; href: (page: number) => string }

export function Pagination({ page, totalPages, href }: Props) {
  if (totalPages < 2) return null
  const cell = 'flex h-9 min-w-9 items-center justify-center px-2 text-xs transition-colors'

  return (
    <nav className="mt-16 flex items-center justify-center gap-1" aria-label="Paginación">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${cell} hover:bg-line/60`} aria-label="Página anterior">
          <ChevronIcon direction="left" />
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`${cell} ${n === page ? 'bg-line' : 'hover:bg-line/60'}`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} className={`${cell} hover:bg-line/60`} aria-label="Página siguiente">
          <ChevronIcon />
        </Link>
      )}
    </nav>
  )
}
