import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { navLinks } from './SiteHeader'

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const socials = [
    { href: settings.instagram, label: 'Instagram' },
    { href: settings.facebook, label: 'Facebook' },
    { href: settings.tiktok, label: 'TikTok' },
    { href: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : null, label: 'WhatsApp' },
  ].filter((social): social is { href: string; label: string } => Boolean(social.href))

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-serif text-2xl">{settings.siteName}</p>
          {settings.tagline && <p className="eyebrow mt-2">{settings.tagline}</p>}
        </div>
        <nav className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 text-sm text-muted">
          {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-ink">{settings.email}</a>}
          {settings.phone && <a href={`tel:${settings.phone}`} className="hover:text-ink">{settings.phone}</a>}
          {settings.location && <span>{settings.location}</span>}
          {socials.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-5">
              {socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="eyebrow hover:text-ink">
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="pb-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} {settings.siteName}. Todos los derechos reservados.
      </p>
    </footer>
  )
}
