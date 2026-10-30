import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { asMedia } from '@/lib/content'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

export const navLinks = [
  { href: '/portafolio', label: 'Portafolio' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/clientes', label: 'Clientes' },
]

type Props = { settings: SiteSetting; overlay?: boolean }

export function SiteHeader({ settings, overlay = false }: Props) {
  const logo = asMedia(settings.logo)

  return (
    <header
      className={
        overlay
          ? 'absolute inset-x-0 top-0 z-20 text-white'
          : 'sticky top-0 z-30 border-b border-line/80 bg-paper/85 text-ink backdrop-blur-md'
      }
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 ${overlay ? 'py-7' : 'py-5'}`}>
        <Link href="/" className="font-serif text-2xl tracking-wide md:text-3xl">
          {logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.url} alt={settings.siteName} className={`h-10 w-auto ${overlay ? 'invert' : ''}`} />
          ) : (
            settings.siteName
          )}
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <nav className="flex gap-9">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium tracking-[0.25em] uppercase opacity-90 transition-opacity hover:opacity-100"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link href="/contacto" className={`btn !px-5 !py-2.5 ${overlay ? 'btn-light' : 'btn-solid'}`}>
            Reservar
          </Link>
        </div>

        <MobileMenu links={navLinks} siteName={settings.siteName} />
      </div>
    </header>
  )
}
