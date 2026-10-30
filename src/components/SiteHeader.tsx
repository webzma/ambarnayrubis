import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { asMedia } from '@/lib/content'

export const navLinks = [
  { href: '/portafolio', label: 'Portafolio' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/clientes', label: 'Clientes' },
]

type Props = { settings: SiteSetting; overlay?: boolean }

export function SiteHeader({ settings, overlay = false }: Props) {
  const logo = asMedia(settings.logo)
  const tone = overlay ? 'text-white' : 'text-ink'

  return (
    <header className={`${overlay ? 'absolute inset-x-0 top-0 z-20' : 'border-b border-line'} ${tone}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="font-serif text-2xl tracking-wide md:text-3xl">
          {logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.url} alt={settings.siteName} className={`h-10 w-auto ${overlay ? 'invert' : ''}`} />
          ) : (
            settings.siteName
          )}
        </Link>

        <nav className="hidden gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium tracking-[0.25em] uppercase opacity-90 transition-opacity hover:opacity-60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu without client JS */}
        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none text-[11px] tracking-[0.25em] uppercase [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Menú</span>
            <span className="hidden group-open:inline">Cerrar</span>
          </summary>
          <nav className="absolute right-0 mt-4 flex min-w-48 flex-col gap-4 bg-paper p-6 text-ink shadow-xl">
            <Link href="/" className="text-xs tracking-[0.2em] uppercase">
              Inicio
            </Link>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs tracking-[0.2em] uppercase">
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
