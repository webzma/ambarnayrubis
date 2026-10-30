'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = { href: string; children: React.ReactNode; className?: string }

/** Nav link that underlines itself while its section is open. */
export function NavLink({ href, children, className = '' }: Props) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100 ${active ? 'after:scale-x-100' : 'after:scale-x-0'} ${className}`}
    >
      {children}
    </Link>
  )
}
