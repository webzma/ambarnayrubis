import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { FacebookIcon, InstagramIcon, TikTokIcon } from './icons'
import { SearchToggle } from './SearchToggle'

/** Thin top bar: social links on the left, gallery search on the right. */
export function SiteTopBar({ settings, query }: { settings: SiteSetting; query?: string }) {
  const socials = [
    { href: settings.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.tiktok, label: 'TikTok', Icon: TikTokIcon },
  ].filter((social) => Boolean(social.href))

  return (
    <header className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-1">
        {socials.length > 0 ? (
          socials.map(({ href, label, Icon }) => (
            <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn !w-9">
              <Icon />
            </a>
          ))
        ) : (
          <Link href="/" className="heading text-xs">
            {settings.siteName}
          </Link>
        )}
      </div>
      <SearchToggle initial={query} />
    </header>
  )
}
