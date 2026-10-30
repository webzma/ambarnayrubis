import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { navLinks } from './SiteHeader'

export const whatsappHref = (number?: string | null) => (number ? `https://wa.me/${number.replace(/\D/g, '')}` : null)

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const socials = [
    { href: settings.instagram, label: 'Instagram' },
    { href: settings.facebook, label: 'Facebook' },
    { href: settings.tiktok, label: 'TikTok' },
    { href: whatsappHref(settings.whatsapp), label: 'WhatsApp' },
  ].filter((social): social is { href: string; label: string } => Boolean(social.href))

  const heading = 'mb-5 text-[11px] font-medium tracking-[0.3em] text-white/45 uppercase'

  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-20 pb-14 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Link href="/" className="font-serif text-4xl font-light text-white">
            {settings.siteName}
          </Link>
          {settings.tagline && <p className="mt-3 text-[11px] tracking-[0.3em] text-white/45 uppercase">{settings.tagline}</p>}
          <Link href="/contacto" className="btn btn-light mt-10">
            Reservar sesión
          </Link>
        </div>

        <nav className="md:col-span-2">
          <p className={heading}>Explora</p>
          <ul className="flex flex-col gap-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className={heading}>Contacto</p>
          <ul className="flex flex-col gap-3 text-sm">
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="link hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="link hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.location && <li className="text-white/55">{settings.location}</li>}
          </ul>
        </div>

        {socials.length > 0 && (
          <div className="md:col-span-2">
            <p className={heading}>Síguenos</p>
            <ul className="flex flex-col gap-3 text-sm">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="link hover:text-white">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-7 text-xs text-white/45 md:flex-row md:px-10">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. Todos los derechos reservados.
          </p>
          <Link href="/admin" prefetch={false} className="link hover:text-white">
            Acceso administración
          </Link>
        </div>
      </div>
    </footer>
  )
}
