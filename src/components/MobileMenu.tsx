'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

type Props = { links: { href: string; label: string }[]; siteName: string }

const noopSubscribe = () => () => {}

/** Full-screen menu for small screens. Closes itself after navigating. */
export function MobileMenu({ links, siteName }: Props) {
  const [open, setOpen] = useState(false)
  // The panel is portaled to <body>: the header's backdrop-filter would otherwise
  // become the containing block of `position: fixed` and clip the overlay.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        Menú
        <span className="flex w-5 flex-col gap-1.5" aria-hidden>
          <span className="h-px w-full bg-current" />
          <span className="h-px w-3/5 self-end bg-current" />
        </span>
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            className={`fixed inset-0 z-50 flex flex-col bg-paper md:hidden px-6 py-6 text-ink transition-[opacity,visibility] duration-500 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
            aria-hidden={!open}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl tracking-wide">{siteName}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[11px] tracking-[0.25em] uppercase"
              >
                Cerrar
              </button>
            </div>
            <nav className="my-auto flex flex-col gap-6">
              {[{ href: '/', label: 'Inicio' }, ...links].map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? undefined : -1}
                  className={`font-serif text-5xl font-light transition-all duration-700 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
              className="btn btn-solid w-full"
            >
              Reservar sesión
            </Link>
          </div>,
          document.body,
        )}
    </div>
  )
}
